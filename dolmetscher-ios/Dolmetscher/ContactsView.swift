import SwiftUI
import Contacts

struct ContactItem: Identifiable, Hashable {
    let id: String
    let name: String
    let phones: [(label: String, number: String)]
    /// false — у контакта нет видимого имени, показываем номер
    var named = true

    /// Имя без невидимых символов: пробелы, управляющие, «пустые» буквы (ᅠ U+3164 и подобные),
    /// которыми иногда скрывают имя. Если видимого ничего нет — пустая строка.
    static func visible(_ text: String) -> String {
        let blank: Set<UInt32> = [0x115F, 0x1160, 0x3164, 0xFFA0, 0x2800, 0x180E, 0x200B, 0x200C, 0x200D, 0x2060, 0xFEFF]
        let shown = text.unicodeScalars.contains { scalar in
            !blank.contains(scalar.value)
                && !CharacterSet.whitespacesAndNewlines.union(.controlCharacters).contains(scalar)
                && scalar.properties.generalCategory != .format
        }
        return shown ? text.trimmingCharacters(in: .whitespacesAndNewlines) : ""
    }

    static func == (a: ContactItem, b: ContactItem) -> Bool { a.id == b.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }

    var sectionKey: String {
        guard let first = name.first(where: { $0.isLetter || $0.isNumber }) else { return "#" }
        return first.isLetter ? String(first).uppercased() : "#"
    }
}

/// Контакты iPhone: список для набора и имена для истории. Ничего не отправляется на сервер.
@MainActor
final class ContactsStore: ObservableObject {
    @Published var items: [ContactItem] = []
    @Published var status: CNAuthorizationStatus = CNContactStore.authorizationStatus(for: .contacts)
    @Published var loaded = false
    private var byKey: [String: String] = [:]

    func load() async {
        if status == .notDetermined {
            let granted = (try? await CNContactStore().requestAccess(for: .contacts)) ?? false
            status = granted ? .authorized : .denied
        }
        guard status == .authorized || status.rawValue == 4 else { loaded = true; return } // 4 = .limited (iOS 18)
        let store = CNContactStore()
        let keys = [CNContactGivenNameKey, CNContactFamilyNameKey, CNContactOrganizationNameKey,
                    CNContactPhoneNumbersKey, CNContactIdentifierKey] as [CNKeyDescriptor]
        let request = CNContactFetchRequest(keysToFetch: keys)
        request.sortOrder = .userDefault
        request.unifyResults = true
        let result: [ContactItem] = await Task.detached(priority: .userInitiated) {
            var list: [ContactItem] = []
            try? store.enumerateContacts(with: request) { c, _ in
                let phones = c.phoneNumbers.map { p in
                    (label: CNLabeledValue<CNPhoneNumber>.localizedString(forLabel: p.label ?? ""), number: p.value.stringValue)
                }
                guard !phones.isEmpty else { return }
                var name = [ContactItem.visible(c.givenName), ContactItem.visible(c.familyName)]
                    .filter { !$0.isEmpty }.joined(separator: " ")
                if name.isEmpty { name = ContactItem.visible(c.organizationName) }
                let named = !name.isEmpty
                if !named { name = phones[0].number }
                list.append(ContactItem(id: c.identifier, name: name, phones: phones, named: named))
            }
            return list
        }.value
        items = result
        // Несколько контактов на один номер: берём тот, у которого есть настоящее имя
        var index: [String: String] = [:]
        for item in result where item.named { for p in item.phones { index[Phone.matchKey(p.number)] = index[Phone.matchKey(p.number)] ?? item.name } }
        byKey = index
        loaded = true
    }

    func name(for number: String) -> String? { byKey[Phone.matchKey(number)] }
}

struct ContactsView: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var contacts: ContactsStore
    @State private var query = ""
    @State private var picking: ContactItem?

    private var filtered: [ContactItem] {
        let q = query.trimmingCharacters(in: .whitespaces)
        guard !q.isEmpty else { return contacts.items }
        let digits = Phone.normalize(q)
        return contacts.items.filter { item in
            item.name.localizedCaseInsensitiveContains(q)
                || (!digits.isEmpty && digits.count >= 3 && item.phones.contains { Phone.normalize($0.number).contains(digits) })
        }
    }

    private var sections: [(key: String, items: [ContactItem])] {
        let grouped = Dictionary(grouping: filtered, by: \.sectionKey)
        return grouped.keys.sorted { a, b in
            if a == "#" { return false }
            if b == "#" { return true }
            return a.localizedCompare(b) == .orderedAscending
        }.map { (key: $0, items: grouped[$0] ?? []) }
    }

    var body: some View {
        NavigationStack {
            Group {
                if contacts.status == .denied || contacts.status == .restricted {
                    ContentUnavailableView {
                        Label("Нет доступа к контактам", systemImage: "person.crop.circle.badge.exclamationmark")
                    } description: {
                        Text("Разрешите доступ в Настройках → Переводчик → Контакты.")
                    } actions: {
                        Button("Открыть настройки") {
                            if let url = URL(string: UIApplication.openSettingsURLString) { UIApplication.shared.open(url) }
                        }
                    }
                } else if !contacts.loaded {
                    ProgressView("Загружаю контакты…")
                } else {
                    List {
                        ForEach(sections, id: \.key) { section in
                            Section(section.key) {
                                ForEach(section.items) { item in
                                    Button { pick(item) } label: {
                                        HStack {
                                            Text(item.name).foregroundStyle(.primary)
                                            Spacer()
                                            if item.phones.count > 1 {
                                                Text("\(item.phones.count)").foregroundStyle(.secondary)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .listStyle(.plain)
                    .overlay {
                        if filtered.isEmpty { ContentUnavailableView.search(text: query) }
                    }
                }
            }
            .navigationTitle("Контакты")
            .searchable(text: $query, prompt: "Поиск по имени или номеру")
            .confirmationDialog(picking?.name ?? "", isPresented: Binding(get: { picking != nil }, set: { if !$0 { picking = nil } }), titleVisibility: .visible) {
                if let item = picking {
                    ForEach(Array(item.phones.enumerated()), id: \.offset) { _, phone in
                        Button("\(phone.label.isEmpty ? "Номер" : phone.label): \(Phone.format(phone.number))") { model.dial(phone.number) }
                    }
                }
            }
        }
        .task { if !contacts.loaded { await contacts.load() } }
    }

    private func pick(_ item: ContactItem) {
        if item.phones.count == 1 { model.dial(item.phones[0].number) } else { picking = item }
    }
}
