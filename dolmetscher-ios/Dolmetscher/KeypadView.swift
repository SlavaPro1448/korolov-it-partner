import SwiftUI
import UIKit

struct KeypadView: View {
    @EnvironmentObject private var model: AppModel
    @State private var status = ""
    @State private var calling = false
    @State private var showSettings = false

    private let keys: [(String, String)] = [
        ("1", ""), ("2", "ABC"), ("3", "DEF"), ("4", "GHI"), ("5", "JKL"), ("6", "MNO"),
        ("7", "PQRS"), ("8", "TUV"), ("9", "WXYZ"), ("*", ""), ("0", "+"), ("#", ""),
    ]
    private let columns = Array(repeating: GridItem(.fixed(74), spacing: 24), count: 3)

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Picker("Режим", selection: $model.mode) {
                    ForEach(CallMode.allCases) { Text($0.title).tag($0) }
                }
                .pickerStyle(.segmented)
                .onChange(of: model.mode) { model.rememberMode() }

                Text(model.mode.hint)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .frame(minHeight: 30)

                Spacer(minLength: 0)

                display

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
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showSettings = true } label: { Image(systemName: "gearshape") }
                }
            }
            .sheet(isPresented: $showSettings) { SettingsView() }
        }
    }

    private var display: some View {
        HStack(spacing: 12) {
            Text(Phone.format(model.number))
                .font(.system(size: model.number.count > 12 ? 30 : 38, weight: .regular))
                .lineLimit(1)
                .minimumScaleFactor(0.5)
                .frame(maxWidth: .infinity)
                .frame(minHeight: 56)
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

    private var callButton: some View {
        Button(action: call) {
            ZStack {
                Circle().fill(calling ? Color.green.opacity(0.5) : Color.green)
                if calling { ProgressView().tint(.white) } else {
                    Image(systemName: "phone.fill").font(.system(size: 32)).foregroundStyle(.white)
                }
            }
            .frame(width: 74, height: 74)
        }
        .disabled(calling || model.number.isEmpty)
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
        guard !number.isEmpty else { return }
        calling = true
        status = "Сейчас зазвонит ваш телефон…"
        Task {
            defer { calling = false }
            do {
                let result = try await model.api.call(to: number, mode: model.mode)
                if result.ok {
                    status = model.mode == .plain
                        ? "Возьмите трубку — дальше набираем собеседника."
                        : "Возьмите трубку — подключаю переводчика."
                    UINotificationFeedbackGenerator().notificationOccurred(.success)
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
