import SwiftUI
import UIKit

struct KeypadView: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var calls: CallManager
    @EnvironmentObject private var contacts: ContactsStore
    @State private var status = ""
    @State private var calling = false
    @State private var showSettings = false
    @State private var quote: Quote?

    private let keys: [(String, String)] = [
        ("1", ""), ("2", "ABC"), ("3", "DEF"), ("4", "GHI"), ("5", "JKL"), ("6", "MNO"),
        ("7", "PQRS"), ("8", "TUV"), ("9", "WXYZ"), ("*", ""), ("0", "+"), ("#", ""),
    ]
    private let columns = Array(repeating: GridItem(.fixed(74), spacing: 24), count: 3)
    static let twilioBilling = URL(string: "https://console.twilio.com/us1/billing/manage-billing/billing-overview")!

    var body: some View {
        NavigationStack {
            VStack(spacing: 12) {
                Picker("Режим", selection: $model.mode) {
                    ForEach(CallMode.allCases) { Text($0.title).tag($0) }
                }
                .pickerStyle(.segmented)
                .onChange(of: model.mode) { model.rememberMode() }

                if model.balanceIsLow, let account = model.account {
                    lowBalanceBanner(account)
                } else {
                    Text(model.mode.hint)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                        .frame(minHeight: 30)
                }

                Spacer(minLength: 0)

                display
                quoteLine

                Text(status)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .frame(minHeight: 34)
                    .padding(.horizontal)

                LazyVGrid(columns: columns, spacing: 12) {
                    ForEach(keys, id: \.0) { digit, letters in
                        KeyButton(digit: digit, letters: letters) { append(digit) } onHold: {
                            if digit == "0" { append("+") }
                        }
                    }
                }

                HStack(spacing: 24) {
                    Color.clear.frame(width: 74, height: 74)
                    callButton
                    deleteButton
                }
                .padding(.bottom, 4)
            }
            .padding(.horizontal, 16)
            .navigationTitle("Переводчик")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { model.showLive = true } label: { Image(systemName: "text.bubble") }
                        .accessibilityLabel("Текст разговора")
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showSettings = true } label: { Image(systemName: "gearshape") }
                }
            }
            .sheet(isPresented: $showSettings) { SettingsView() }
            // Цена набранного номера: запрос после паузы в наборе
            .task(id: model.number) {
                quote = nil
                let number = model.number
                guard number.filter(\.isNumber).count >= 5 else { return }
                try? await Task.sleep(for: .milliseconds(400))
                guard !Task.isCancelled, let fresh = try? await model.api.quote(number: number), number == model.number else { return }
                quote = fresh
            }
            .task { if model.account == nil { await model.refreshAccount() } }
        }
    }

    private func lowBalanceBanner(_ account: Account) -> some View {
        Link(destination: Self.twilioBilling) {
            HStack(spacing: 8) {
                Image(systemName: "exclamationmark.triangle.fill")
                Text("Осталось ≈\(model.minutesLeft ?? 0) мин · \(Money.amount(account.balance, account.currency))")
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
                Spacer(minLength: 4)
                Text("Пополнить").bold()
                Image(systemName: "chevron.right")
            }
            .font(.footnote.weight(.medium))
            .foregroundStyle(.orange)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Capsule().fill(Color.orange.opacity(0.15)))
        }
        .frame(minHeight: 30)
    }

    /// «Мобильный · 0.093 $/мин (+0.068 ИИ) · 162 мин» или почему номер нельзя набрать.
    @ViewBuilder private var quoteLine: some View {
        Group {
            if let quote, !quote.allowed {
                Text(quote.reason == "length" ? "Проверьте количество цифр" : "Этот номер набрать нельзя: только Германия и Чехия, без платных")
                    .foregroundStyle(quote.reason == "length" ? Color.secondary : Color.red)
            } else if let quote, quote.found, let unit = quote.unit {
                let plain = model.mode == .plain
                let app = model.usesInternet ? quote.app : nil
                let rate = (plain ? app?.plainPerMinute ?? quote.plainPerMinute : app?.perMinute ?? quote.perMinute) ?? 0
                let minutes = plain ? (app != nil ? app?.plainMinutes : quote.plainMinutes) : (app != nil ? app?.minutes : quote.minutes)
                let kind = (quote.mobile == true ? "Мобильный" : "Стационарный") + (app != nil ? " · интернет" : "")
                let ai = !plain ? String(format: " (+%.3f ИИ)", quote.openaiPerMinute ?? 0) : ""
                Text("\(kind) · \(String(format: "%.3f", rate)) \(unit)/мин\(ai) · \(Money.minutes(minutes))")
                    .foregroundStyle(.secondary)
            } else {
                Text(" ")
            }
        }
        .font(.footnote)
        .lineLimit(1)
        .minimumScaleFactor(0.8)
    }

    private var display: some View {
        HStack(spacing: 12) {
            Text(Phone.format(model.number))
                .font(.system(size: model.number.count > 12 ? 30 : 38, weight: .regular))
                .lineLimit(1)
                .minimumScaleFactor(0.5)
                .frame(maxWidth: .infinity)
                .frame(minHeight: 52)
                .contentShape(Rectangle())
                .contextMenu {
                    if !model.number.isEmpty {
                        Button { UIPasteboard.general.string = model.number } label: { Label("Копировать", systemImage: "doc.on.doc") }
                        Button(role: .destructive) { model.number = "" } label: { Label("Очистить", systemImage: "xmark.circle") }
                    }
                }
            // Вставка из буфера без системного запроса: PasteButton показывает содержимое только по нажатию
            PasteButton(payloadType: String.self) { strings in
                guard let text = strings.first(where: Phone.looksLikeNumber) else { status = "В буфере нет номера."; return }
                model.number = Phone.normalize(text)
                status = ""
            }
            .labelStyle(.iconOnly)
            .buttonBorderShape(.circle)
            .tint(.secondary)
        }
    }

    private var blocked: Bool { quote?.allowed == false && quote?.reason == "number" }

    private var callButton: some View {
        Button(action: call) {
            ZStack {
                Circle().fill(calling || blocked ? Color.green.opacity(0.4) : Color.green)
                if calling { ProgressView().tint(.white) } else {
                    Image(systemName: "phone.fill").font(.system(size: 32)).foregroundStyle(.white)
                }
            }
            .frame(width: 74, height: 74)
        }
        .disabled(calling || model.number.isEmpty || blocked)
        .accessibilityLabel("Позвонить")
    }

    private var deleteButton: some View {
        Image(systemName: "delete.left.fill")
            .font(.system(size: 28))
            .foregroundStyle(.secondary)
            .frame(width: 74, height: 74)
            .contentShape(Rectangle())
            .opacity(model.number.isEmpty ? 0 : 1)
            .onTapGesture { if !model.number.isEmpty { model.number.removeLast(); tap() } }
            .onLongPressGesture(minimumDuration: 0.6) { model.number = ""; tap() }
            .accessibilityLabel("Стереть")
    }

    private func append(_ digit: String) {
        guard model.number.count < 20 else { return }
        if digit == "+" { if model.number.isEmpty { model.number = "+" }; tap(); return }
        model.number += digit
        tap()
    }

    private func tap() { UIImpactFeedbackGenerator(style: .light).impactOccurred() }

    private func call() {
        let number = model.number
        let mode = model.mode
        guard !number.isEmpty else { return }
        if model.usesInternet { return callViaInternet(number: number, mode: mode) }
        calling = true
        status = "Сейчас зазвонит ваш телефон…"
        Task {
            defer { calling = false }
            do {
                let result = try await model.api.call(to: number, mode: mode)
                if result.ok {
                    status = mode == .plain
                        ? "Возьмите трубку — дальше набираем собеседника."
                        : "Возьмите трубку — подключаю переводчика."
                    UINotificationFeedbackGenerator().notificationOccurred(.success)
                    // Живой текст открывается сам: пока вы берёте трубку, он уже подключён
                    if mode != .plain { model.showLive = true }
                } else {
                    status = Self.messages[result.error ?? ""] ?? "Не получилось: \(result.error ?? "ошибка")"
                    UINotificationFeedbackGenerator().notificationOccurred(.error)
                }
            } catch {
                status = error.localizedDescription
                UINotificationFeedbackGenerator().notificationOccurred(.error)
            }
        }
    }

    /// Звонок прямо из приложения: экран разговора открывается сам (CallManager.isActive).
    private func callViaInternet(number: String, mode: CallMode) {
        calling = true
        status = ""
        Task {
            defer { calling = false }
            do {
                try await calls.start(number: number, name: contacts.name(for: number), mode: mode, api: model.api)
            } catch {
                status = error.localizedDescription
                UINotificationFeedbackGenerator().notificationOccurred(.error)
            }
        }
    }

    private static let messages = [
        "number": "Этот номер набрать нельзя: только Германия и Чехия, без платных.",
        "length": "В номере не то количество цифр — проверьте его.",
        "busy": "Переводчик занят другим разговором.",
    ]
}

/// Круглая клавиша как в «Телефоне»: нажатие — цифра, удержание — второе значение (0 → +).
private struct KeyButton: View {
    let digit: String
    let letters: String
    let onTap: () -> Void
    let onHold: () -> Void
    @State private var pressed = false

    var body: some View {
        VStack(spacing: 2) {
            Text(digit).font(.system(size: 34, weight: .light))
            Text(letters).font(.system(size: 10, weight: .medium)).tracking(2).foregroundStyle(.secondary)
                .frame(height: 12)
        }
        .foregroundStyle(.primary)
        .frame(width: 74, height: 74)
        .background(Circle().fill(pressed ? Color(.systemGray3) : Color(.secondarySystemFill)))
        .contentShape(Circle())
        .onTapGesture(perform: onTap)
        .onLongPressGesture(minimumDuration: 0.45, perform: onHold) { pressed = $0 }
        .animation(.easeOut(duration: 0.12), value: pressed)
    }
}
