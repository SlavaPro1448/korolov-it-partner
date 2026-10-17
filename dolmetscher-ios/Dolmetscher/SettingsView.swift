import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var calls: CallManager
    @Environment(\.dismiss) private var dismiss
    @State private var result = ""
    @State private var server: APIClient.ServerSettings?
    @State private var directBusy = false
    @State private var directError: String?
    @State private var copied: String?

    var body: some View {
        NavigationStack {
            Form {
                Section("Сервер переводчика") {
                    TextField("https://…", text: $model.serverURL)
                        .keyboardType(.URL).textContentType(.URL).autocorrectionDisabled().textInputAutocapitalization(.never)
                    SecureField("Ключ доступа (CALL_KEY)", text: $model.key)
                }
                Section {
                    Picker("Как соединять вас", selection: $model.route) {
                        ForEach(CallRoute.allCases) { Text($0.title).tag($0) }
                    }
                    .pickerStyle(.inline)
                    .labelsHidden()
                    LabeledContent("Входящие в приложение") {
                        Text(calls.incomingReady ? "Включены" : (calls.incomingError ?? "Подключаю…"))
                            .foregroundStyle(calls.incomingReady ? .green : .secondary)
                            .multilineTextAlignment(.trailing)
                    }
                } header: {
                    Text("Звонок")
                } footer: {
                    Text("Через интернет: звонок идёт прямо из приложения, ваше плечо стоит ≈0.004 $/мин вместо 0.042 $, звонок сразу без ожидания перезвона. Собеседник всё равно видит ваш мобильный номер. «Перезвон» нужен, если интернет плохой.")
                }
                directSection
                Section {
                    Stepper(value: $model.lowBalanceMinutes, in: 5...300, step: 5) {
                        Text("Предупреждать, когда меньше \(model.lowBalanceMinutes) мин")
                    }
                } header: {
                    Text("Баланс")
                } footer: {
                    Text("Минуты считаются для звонка с переводом на немецкий мобильный.")
                }
                Section {
                    Button("Проверить связь") {
                        result = "Проверяю…"
                        Task {
                            do {
                                let a = try await model.api.account()
                                result = "Связь есть. Номер переводчика \(Phone.format(a.translatorNumber)), баланс \(Money.amount(a.balance, a.currency))."
                            } catch { result = error.localizedDescription }
                        }
                    }
                    if !result.isEmpty { Text(result).font(.footnote).foregroundStyle(.secondary) }
                } footer: {
                    Text("Ключ хранится в связке ключей iPhone. Звонок: сервер сначала звонит вам, после ответа набирает собеседника.")
                }
            }
            .task { server = try? await model.api.settings() }
            .navigationTitle("Настройки")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Готово") { dismiss() } } }
        }
    }

    /// Все звонки на O2 сразу в приложение: сервер звонит без объявления, перевод — кнопкой в разговоре.
    @ViewBuilder private var directSection: some View {
        let number = server?.translatorNumber ?? "+4921483263440"
        Section {
            Toggle(isOn: Binding(
                get: { server?.directToApp ?? false },
                set: { on in setDirect(on) }
            )) {
                HStack {
                    Text("Все звонки сразу в приложение")
                    if directBusy { ProgressView().padding(.leading, 4) }
                }
            }
            .disabled(server == nil || directBusy || server?.incomingApp == false)
            if let directError { Text(directError).font(.footnote).foregroundStyle(.orange) }
            codeRow("Включить на O2", "**21*\(number)#")
            codeRow("Выключить", "##21#")
            codeRow("Проверить", "*#21#")
        } header: {
            Text("Переадресация")
        } footer: {
            Text("1. Включите переключатель. 2. Скопируйте код «Включить на O2», вставьте его в клавиатуру «Телефона» и нажмите вызов. Дальше все звонки идут в это приложение как обычные: без объявления, перевод включается кнопкой «Переводчик» в разговоре. Не ответили за 20 секунд или нет интернета — звонящий попадёт на телефонного ассистента. Отключить: код «Выключить» и переключатель.")
        }
    }

    private func codeRow(_ title: String, _ code: String) -> some View {
        Button {
            UIPasteboard.general.string = code
            copied = code
        } label: {
            LabeledContent(title) {
                HStack(spacing: 6) {
                    Text(code).font(.body.monospaced()).foregroundStyle(.primary)
                    Image(systemName: copied == code ? "checkmark" : "doc.on.doc").foregroundStyle(copied == code ? .green : .secondary)
                }
            }
        }
        .foregroundStyle(.primary)
    }

    private func setDirect(_ on: Bool) {
        directBusy = true
        directError = nil
        Task {
            defer { directBusy = false }
            do { server = try await model.api.setDirectToApp(on) } catch { directError = error.localizedDescription }
        }
    }
}
