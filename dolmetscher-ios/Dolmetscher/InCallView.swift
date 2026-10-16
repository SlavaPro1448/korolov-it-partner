import SwiftUI

/// Экран разговора через интернет: кто, сколько идёт, кнопки и живой текст перевода.
struct InCallView: View {
    @EnvironmentObject private var calls: CallManager
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var feed: LiveFeed
    @State private var showKeys = false
    @State private var typed = ""
    @State private var talkStartedAt: Date?

    var body: some View {
        VStack(spacing: 14) {
            header
            if calls.mode == .plain {
                Spacer()
            } else {
                LiveTranscript(placeholder: placeholder)
                    .background(RoundedRectangle(cornerRadius: 18).fill(Color(.secondarySystemBackground).opacity(0.5)))
            }
            if showKeys { dtmfPad } else { controls }
            endButton
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 12)
        .background(Color(.systemBackground).ignoresSafeArea())
        .onAppear {
            talkStartedAt = nil
            if calls.mode != .plain { feed.start { try model.api.liveRequest() } }
        }
        .onDisappear {
            feed.stop()
            Task { await model.refreshAccount() }
        }
        // Собеседник ответил: сервер запускает перевод и шлёт «start»
        .onChange(of: feed.state) { _, state in
            if state == .talking, talkStartedAt == nil { talkStartedAt = Date() }
        }
    }

    private var header: some View {
        VStack(spacing: 6) {
            Text(calls.name ?? Phone.format(calls.number))
                .font(.title.weight(.semibold))
                .lineLimit(1)
                .minimumScaleFactor(0.6)
            if calls.name != nil {
                Text(Phone.format(calls.number)).font(.subheadline).foregroundStyle(.secondary)
            }
            TimelineView(.periodic(from: .now, by: 1)) { _ in
                Text(statusText).font(.headline.monospacedDigit()).foregroundStyle(statusColor)
            }
            Label(calls.mode.title + " · через интернет", systemImage: "wifi")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(.top, 24)
    }

    private var placeholder: String {
        talkStartedAt == nil ? "Звоним собеседнику… Здесь появится текст разговора." : "Текст появится, когда кто-то заговорит."
    }

    private var statusText: String {
        if calls.reconnecting { return "Восстанавливаю связь…" }
        switch calls.phase {
        case .idle, .connecting: return "Соединяю…"
        case .ringing: return "Вызов…"
        case .ended: return calls.endReason ?? "Разговор завершён"
        case .connected:
            // С переводом: время с ответа собеседника; без перевода — с соединения
            let since = calls.mode == .plain ? calls.connectedAt : talkStartedAt
            guard let since else { return "Вызов собеседника…" }
            let seconds = Int(Date().timeIntervalSince(since))
            return String(format: "%d:%02d", seconds / 60, seconds % 60)
        }
    }

    private var statusColor: Color {
        calls.phase == .ended || calls.reconnecting ? .orange : .primary
    }

    private var controls: some View {
        HStack(spacing: 28) {
            CallButton(icon: calls.muted ? "mic.slash.fill" : "mic.fill", title: "Микрофон", on: calls.muted) { calls.toggleMute() }
            CallButton(icon: "circle.grid.3x3.fill", title: "Клавиши", on: false) { showKeys = true }
            CallButton(icon: "speaker.wave.2.fill", title: "Динамик", on: calls.speaker) { calls.toggleSpeaker() }
        }
        .disabled(calls.phase == .ended)
    }

    /// Клавиши: цифры уходят собеседнику (голосовое меню), * меняет режим перевода, # пропускает перевод.
    private var dtmfPad: some View {
        VStack(spacing: 10) {
            Text(typed.isEmpty ? "* — режим перевода · # — пропустить перевод" : typed)
                .font(typed.isEmpty ? .caption : .title2.monospacedDigit())
                .foregroundStyle(typed.isEmpty ? .secondary : .primary)
                .lineLimit(1)
            LazyVGrid(columns: Array(repeating: GridItem(.fixed(64), spacing: 22), count: 3), spacing: 10) {
                ForEach(["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"], id: \.self) { key in
                    Button {
                        typed += key
                        calls.send(digits: key)
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    } label: {
                        Text(key).font(.system(size: 28, weight: .light))
                            .frame(width: 64, height: 64)
                            .background(Circle().fill(Color(.secondarySystemFill)))
                    }
                    .foregroundStyle(.primary)
                }
            }
            Button("Скрыть") { showKeys = false; typed = "" }.font(.subheadline)
        }
    }

    private var endButton: some View {
        Button {
            if calls.phase == .ended { calls.dismiss() } else { calls.hangUp() }
        } label: {
            Image(systemName: calls.phase == .ended ? "xmark" : "phone.down.fill")
                .font(.system(size: 30))
                .foregroundStyle(.white)
                .frame(width: 74, height: 74)
                .background(Circle().fill(calls.phase == .ended ? Color.gray : Color.red))
        }
        .accessibilityLabel(calls.phase == .ended ? "Закрыть" : "Завершить")
    }
}

private struct CallButton: View {
    let icon: String
    let title: String
    let on: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .frame(width: 64, height: 64)
                    .background(Circle().fill(on ? Color.primary : Color(.secondarySystemFill)))
                    .foregroundStyle(on ? Color(.systemBackground) : .primary)
                Text(title).font(.caption).foregroundStyle(.secondary)
            }
        }
    }
}
