import SwiftUI

/// Звонки через переводчика из Twilio: собеседник, время, длительность, цена обоих плеч.
struct HistoryView: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var contacts: ContactsStore
    @State private var calls: [CallEntry] = []
    @State private var error: String?
    @State private var loading = false
    @State private var onlyMissed = false

    private var shown: [CallEntry] { onlyMissed ? calls.filter(\.failed) : calls }

    var body: some View {
        NavigationStack {
            Group {
                if loading && calls.isEmpty {
                    ProgressView("Загружаю звонки…")
                } else if let error, calls.isEmpty {
                    ContentUnavailableView("Нет данных", systemImage: "wifi.exclamationmark", description: Text(error))
                } else if shown.isEmpty {
                    ContentUnavailableView(onlyMissed ? "Нет пропущенных" : "Без звонков", systemImage: "phone.arrow.down.left",
                                           description: Text("Звонки через переводчика появятся здесь."))
                } else {
                    List(shown) { call in
                        Button { model.dial(call.number) } label: { row(call) }
                            .swipeActions { Button { UIPasteboard.general.string = call.number } label: { Label("Копировать", systemImage: "doc.on.doc") } }
                            .contextMenu { breakdown(call) }
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Последние")
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Picker("", selection: $onlyMissed) {
                        Text("Все").tag(false)
                        Text("Без ответа").tag(true)
                    }
                    .pickerStyle(.segmented)
                    .frame(width: 220)
                }
            }
            .refreshable { await load() }
        }
        .task {
            if calls.isEmpty { await load() }
            if !contacts.loaded { await contacts.load() }
        }
    }

    private func row(_ call: CallEntry) -> some View {
        HStack(spacing: 12) {
            Image(systemName: call.viaApp == true ? "wifi" : call.isIncoming ? "arrow.down.left" : "arrow.up.right")
                .foregroundStyle(call.failed ? .red : .secondary)
                .frame(width: 22)
            VStack(alignment: .leading, spacing: 3) {
                Text(contacts.name(for: call.number) ?? Phone.format(call.number))
                    .foregroundStyle(call.failed ? .red : .primary)
                HStack(spacing: 8) {
                    Text(call.startedAt, format: .dateTime.day().month(.abbreviated).hour().minute())
                    if call.duration > 0 { Text(durationText(call.duration)) }
                    if call.pricePending == true {
                        Text("цена уточняется")
                    } else if let total = call.totalPrice ?? Optional(call.price), total > 0 {
                        Text("≈" + Money.amount(total, call.unit))
                    }
                    if call.translated == false && !call.failed { Text("без перевода") }
                    if call.failed { Text(statusText(call.status)) }
                }
                .font(.footnote)
                .foregroundStyle(.secondary)
            }
            Spacer()
            if contacts.name(for: call.number) != nil {
                Text(Phone.format(call.number)).font(.footnote).foregroundStyle(.tertiary)
            }
        }
    }

    /// По долгому нажатию: из чего сложилась цена звонка.
    @ViewBuilder private func breakdown(_ call: CallEntry) -> some View {
        Section("Цена звонка") {
            Text("Связь Twilio: " + (call.pricePending == true ? "уточняется" : Money.precise(call.price, call.unit)))
            if call.translated == true {
                Text("Media Streams: " + Money.precise(call.mediaPrice ?? 0, call.unit))
                Text("Перевод ИИ (OpenAI): ≈" + Money.precise(call.openaiPrice ?? 0, "USD"))
            }
            if let total = call.totalPrice { Text("Итого: ≈" + Money.precise(total, call.unit)) }
        }
        Button { model.dial(call.number) } label: { Label("Набрать", systemImage: "phone") }
        Button { UIPasteboard.general.string = call.number } label: { Label("Копировать номер", systemImage: "doc.on.doc") }
    }

    private func durationText(_ seconds: Int) -> String {
        seconds < 60 ? "\(seconds) с" : String(format: "%d:%02d", seconds / 60, seconds % 60)
    }

    private func statusText(_ status: String) -> String {
        switch status {
        case "busy": return "занято"
        case "no-answer": return "нет ответа"
        case "canceled": return "отменён"
        default: return "не прошёл"
        }
    }

    private func load() async {
        loading = true
        defer { loading = false }
        do {
            calls = try await model.api.calls()
            error = nil
        } catch {
            self.error = error.localizedDescription
        }
    }
}
