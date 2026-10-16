import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var model: AppModel
    @Environment(\.dismiss) private var dismiss
    @State private var result = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Сервер переводчика") {
                    TextField("https://…", text: $model.serverURL)
                        .keyboardType(.URL).textContentType(.URL).autocorrectionDisabled().textInputAutocapitalization(.never)
                    SecureField("Ключ доступа (CALL_KEY)", text: $model.key)
                }
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
            .navigationTitle("Настройки")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Готово") { dismiss() } } }
        }
    }
}
