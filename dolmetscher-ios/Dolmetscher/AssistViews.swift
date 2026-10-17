import SwiftUI
import UserNotifications

/// Кнопки помощи в разговоре: «Сказать» (текст или готовая фраза по-немецки) и «Ждать за меня».
struct AssistButtons: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var feed: LiveFeed
    @State private var showSay = false
    @State private var busy = false
    @State private var switching = false
    @State private var error: String?
    /// Перевод сейчас включён (по событиям сервера; до них — как выбрано при звонке)
    var translationOn: Bool

    var body: some View {
        HStack(spacing: 22) {
            AssistButton(icon: "translate", title: translationOn ? "Перевод вкл" : "Переводчик",
                         on: translationOn, busy: switching) { toggleTranslation() }
                .disabled(feed.waitingSince != nil)
            AssistButton(icon: "text.bubble.fill", title: "Сказать", on: false) { showSay = true }
            AssistButton(icon: "hourglass", title: feed.waitingSince == nil ? "Ждать за меня" : "Хватит ждать",
                         on: feed.waitingSince != nil, busy: busy) { toggleWait() }
        }
        .sheet(isPresented: $showSay) { SayView().presentationDetents([.medium, .large]) }
        .alert("Не получилось", isPresented: Binding(get: { error != nil }, set: { if !$0 { error = nil } })) {
            Button("OK", role: .cancel) {}
        } message: { Text(error ?? "") }
    }

    private func toggleTranslation() {
        let on = !translationOn
        switching = true
        Task {
            defer { switching = false }
            do { _ = try await model.api.translate(on, phrases: model.mode == .seq) } catch { self.error = error.localizedDescription }
        }
    }

    private func toggleWait() {
        let on = feed.waitingSince == nil
        busy = true
        Task {
            defer { busy = false }
            if on {
                // Разрешение на уведомление «Ответил человек» — спрашиваем один раз, при первом ожидании
                _ = try? await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound])
            }
            do { _ = try await model.api.wait(on) } catch { self.error = error.localizedDescription }
        }
    }
}

private struct AssistButton: View {
    let icon: String
    let title: String
    let on: Bool
    var busy = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                ZStack {
                    Circle().fill(on ? Color.indigo : Color(.secondarySystemFill))
                    if busy { ProgressView() } else {
                        Image(systemName: icon).font(.system(size: 22)).foregroundStyle(on ? .white : .primary)
                    }
                }
                .frame(width: 58, height: 58)
                Text(title).font(.caption).foregroundStyle(.secondary).lineLimit(1)
            }
        }
        .disabled(busy)
    }
}

/// Окно «Сказать собеседнику»: свой текст (переведётся на немецкий, номера — по цифрам) и быстрые фразы.
struct SayView: View {
    @EnvironmentObject private var model: AppModel
    @Environment(\.dismiss) private var dismiss
    @State private var text = ""
    @State private var phrases: [APIClient.Phrase] = []
    @State private var sending: String?
    @State private var result: String?
    @State private var error: String?
    @FocusState private var focused: Bool

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 14) {
                    HStack(alignment: .bottom, spacing: 10) {
                        TextField("Напишите по-русски — собеседник услышит по-немецки", text: $text, axis: .vertical)
                            .lineLimit(1...5)
                            .focused($focused)
                            .padding(12)
                            .background(RoundedRectangle(cornerRadius: 14).fill(Color(.secondarySystemBackground)))
                        Button { sendText() } label: {
                            Group {
                                if sending == "text" { ProgressView().tint(.white) } else { Image(systemName: "arrow.up").font(.headline) }
                            }
                            .frame(width: 44, height: 44)
                            .background(Circle().fill(text.trimmingCharacters(in: .whitespaces).isEmpty ? Color.gray : Color.accentColor))
                            .foregroundStyle(.white)
                        }
                        .disabled(text.trimmingCharacters(in: .whitespaces).isEmpty || sending != nil)
                    }
                    Text("Номера, Aktenzeichen, IBAN и телефоны прозвучат по цифрам, даты и суммы — словами.")
                        .font(.caption).foregroundStyle(.secondary)

                    if let result {
                        Label(result, systemImage: "checkmark.circle.fill").font(.footnote).foregroundStyle(.green)
                    }
                    if let error {
                        Label(error, systemImage: "exclamationmark.triangle.fill").font(.footnote).foregroundStyle(.orange)
                    }

                    Text("Быстрые фразы").font(.headline).padding(.top, 6)
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                        ForEach(phrases) { phrase in
                            Button { sendPhrase(phrase) } label: {
                                VStack(alignment: .leading, spacing: 3) {
                                    Text(phrase.ru).font(.subheadline.weight(.medium)).foregroundStyle(.primary)
                                    Text(phrase.de).font(.caption2).foregroundStyle(.secondary).lineLimit(2)
                                }
                                .frame(maxWidth: .infinity, minHeight: 54, alignment: .leading)
                                .padding(10)
                                .background(RoundedRectangle(cornerRadius: 12).fill(sending == phrase.key ? Color.accentColor.opacity(0.25) : Color(.secondarySystemBackground)))
                            }
                            .disabled(sending != nil)
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Сказать собеседнику")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Готово") { dismiss() } } }
            .task { if phrases.isEmpty { phrases = (try? await model.api.phrases()) ?? [] } }
        }
    }

    private func sendText() {
        let value = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !value.isEmpty else { return }
        run("text") {
            let r = try await model.api.say(text: value)
            text = ""
            return r.de
        }
    }

    private func sendPhrase(_ phrase: APIClient.Phrase) {
        run(phrase.key) { try await model.api.say(phrase: phrase.key).de }
    }

    private func run(_ key: String, _ work: @escaping () async throws -> String?) {
        sending = key
        error = nil
        Task {
            defer { sending = nil }
            do {
                let de = try await work()
                result = "Сказано: «\(de ?? "")»"
                UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            } catch {
                self.error = error.localizedDescription
            }
        }
    }
}
