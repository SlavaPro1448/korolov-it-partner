import SwiftUI
import UIKit
import UserNotifications

/// Реплика в живом тексте: оригинал и перевод одного говорящего подряд.
struct LiveTurn: Identifiable {
    let id = UUID()
    let role: String // "peer" — собеседник, "owner" — вы
    var original = ""
    var translation = ""
    var lastInput = Date()
}

/// Живой текст разговора с сервера: оригинал и перевод идут по мере речи. Только в памяти.
@MainActor
final class LiveFeed: ObservableObject {
    enum State { case idle, connecting, waiting, talking, ended, offline }
    @Published var turns: [LiveTurn] = []
    @Published var state: State = .idle
    /// Собеседнику читается предупреждение про ИИ-переводчика — до этого момента; nil = не читается
    @Published var noticeUntil: Date?
    /// Предупреждение закончилось, можно говорить
    @Published var readyAt: Date?
    /// Ждём за вас в очереди с этого момента; nil — не ждём
    @Published var waitingSince: Date?
    /// В очереди ответил человек
    @Published var humanAt: Date?
    /// Собеседник на связи (обе стороны соединены) — с этого момента идёт время разговора
    @Published var pairedAt: Date?
    /// Переводчик включён в этом разговоре; nil — сервер ещё не сообщил
    @Published var translatorOn: Bool?

    private var task: URLSessionWebSocketTask?
    private var wanted = false
    private var request: () throws -> URLRequest = { throw APIError.badURL }

    /// Позвать: сильная вибрация и уведомление со звуком (телефон может лежать на столе)
    static func alertHuman() {
        UINotificationFeedbackGenerator().notificationOccurred(.warning)
        let content = UNMutableNotificationContent()
        content.title = "Ответил человек"
        content.body = "Возьмите телефон: собеседнику сейчас скажут про переводчика, потом можно говорить."
        content.sound = .default
        content.interruptionLevel = .timeSensitive
        UNUserNotificationCenter.current().add(UNNotificationRequest(identifier: "human", content: content, trigger: nil))
    }

    func start(_ makeRequest: @escaping () throws -> URLRequest) {
        request = makeRequest
        wanted = true
        if task == nil { connect() }
    }

    func stop() {
        wanted = false
        task?.cancel(with: .goingAway, reason: nil)
        task = nil
        if state != .ended { state = .idle }
    }

    private func connect() {
        guard wanted, let req = try? request() else { state = .offline; return }
        if state != .talking { state = .connecting }
        let socket = URLSession.shared.webSocketTask(with: req)
        task = socket
        socket.resume()
        receive(socket)
        ping(socket)
    }

    /// Сервер молчит, пока нет разговора: пинг показывает, что связь есть, и держит соединение живым.
    private func ping(_ socket: URLSessionWebSocketTask) {
        socket.sendPing { [weak self] error in
            Task { @MainActor in
                guard let self, self.task === socket, error == nil else { return }
                if self.state == .connecting || self.state == .offline { self.state = .waiting }
                try? await Task.sleep(for: .seconds(20))
                if self.task === socket { self.ping(socket) }
            }
        }
    }

    private func receive(_ socket: URLSessionWebSocketTask) {
        socket.receive { [weak self] result in
            Task { @MainActor in
                guard let self, self.task === socket else { return }
                switch result {
                case .success(let message):
                    if self.state == .connecting || self.state == .offline { self.state = .waiting }
                    if case .string(let text) = message { self.handle(text) }
                    self.receive(socket)
                case .failure:
                    self.task = nil
                    guard self.wanted else { return }
                    if self.state != .ended { self.state = .offline }
                    try? await Task.sleep(for: .seconds(2))
                    self.connect()
                }
            }
        }
    }

    private struct Message: Decodable {
        var event: String?; var role: String?; var dir: String?; var text: String?; var ms: Double?; var at: Double?
        var on: Bool?; var de: String?; var mode: String?
    }

    private func handle(_ raw: String) {
        guard let message = try? JSONDecoder().decode(Message.self, from: Data(raw.utf8)) else { return }
        switch message.event {
        case "paired":
            // Новый разговор: всё с начала
            turns = []; state = .talking; noticeUntil = nil; readyAt = nil; waitingSince = nil; humanAt = nil
            pairedAt = message.at.map { Date(timeIntervalSince1970: $0 / 1000) } ?? Date()
            translatorOn = nil
            return
        case "start":
            state = .talking
            translatorOn = true
            if pairedAt == nil { pairedAt = message.at.map { Date(timeIntervalSince1970: $0 / 1000) } ?? Date() }
            return
        case "translator":
            translatorOn = message.on ?? false
            if message.on != true { noticeUntil = nil }
            return
        case "said":
            // Сказано текстом или кнопкой: отдельной репликой
            var turn = LiveTurn(role: "owner")
            turn.original = "⌨︎ " + (message.text ?? "")
            turn.translation = message.de ?? ""
            turns.append(turn)
            return
        case "wait":
            let sent = message.at.map { Date(timeIntervalSince1970: $0 / 1000) } ?? Date()
            waitingSince = message.on == true ? sent : nil
            return
        case "human":
            let sent = message.at.map { Date(timeIntervalSince1970: $0 / 1000) } ?? Date()
            humanAt = sent
            if Date().timeIntervalSince(sent) < 10 { Self.alertHuman() }
            return
        case "notice":
            // Время отсчитываем от момента на сервере: при переподключении отсчёт не сбивается
            let sent = message.at.map { Date(timeIntervalSince1970: $0 / 1000) } ?? Date()
            noticeUntil = sent.addingTimeInterval((message.ms ?? 0) / 1000)
            readyAt = nil
            return
        case "ready":
            let fresh = readyAt == nil
            readyAt = message.at.map { Date(timeIntervalSince1970: $0 / 1000) } ?? Date()
            noticeUntil = nil
            if fresh, Date().timeIntervalSince(readyAt!) < 5 { UINotificationFeedbackGenerator().notificationOccurred(.success) }
            return
        case "end": state = .ended; noticeUntil = nil; waitingSince = nil; return
        default: break
        }
        guard let role = message.role, let dir = message.dir, let text = message.text else { return }
        if state != .talking { state = .talking }
        // Новая реплика после паузы 4 с или когда между ними говорил другой
        let now = Date()
        var index = turns.lastIndex { $0.role == role }
        if let i = index, dir == "in", now.timeIntervalSince(turns[i].lastInput) > 4 || i != turns.count - 1 {
            index = nil
        }
        if index == nil {
            turns.append(LiveTurn(role: role))
            index = turns.count - 1
        }
        guard let i = index else { return }
        if dir == "in" {
            turns[i].original += text
            turns[i].lastInput = now
        } else {
            turns[i].translation += text
        }
    }
}

/// Подсказка, когда можно говорить: пока собеседнику читается предупреждение — отсчёт,
/// затем на несколько секунд зелёное «Говорите».
struct SpeakCue: View {
    @EnvironmentObject private var feed: LiveFeed

    var body: some View {
        TimelineView(.periodic(from: .now, by: 0.5)) { context in
            if let since = feed.waitingSince {
                let s = Int(context.date.timeIntervalSince(since))
                cue(icon: "hourglass", text: String(format: "Жду, когда ответит человек · %d:%02d", s / 60, s % 60), color: .indigo)
            } else if let until = feed.noticeUntil, until > context.date {
                let human = feed.humanAt.map { context.date.timeIntervalSince($0) < 20 } ?? false
                cue(icon: human ? "person.wave.2.fill" : "hand.raised.fill",
                    text: (human ? "Ответил человек! " : "Подождите: ") + "собеседнику читается предупреждение · \(Int(until.timeIntervalSince(context.date).rounded(.up))) с",
                    color: .orange)
            } else if let ready = feed.readyAt, context.date.timeIntervalSince(ready) < 5 {
                cue(icon: "mic.fill", text: "Говорите", color: .green)
            }
        }
        .animation(.easeInOut(duration: 0.25), value: feed.readyAt)
    }

    private func cue(icon: String, text: String, color: Color) -> some View {
        Label(text, systemImage: icon)
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(.white)
            .padding(.horizontal, 14)
            .padding(.vertical, 9)
            .frame(maxWidth: .infinity)
            .background(Capsule().fill(color))
            .transition(.opacity)
    }
}

/// Лента реплик (оригинал + перевод); используется в листе «Текст разговора» и на экране звонка.
struct LiveTranscript: View {
    @EnvironmentObject private var feed: LiveFeed
    var placeholder: String

    var body: some View {
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 14) {
                        if feed.turns.isEmpty {
                            Text(placeholder)
                                .foregroundStyle(.secondary)
                                .frame(maxWidth: .infinity, alignment: .center)
                                .padding(.top, 40)
                        }
                        ForEach(feed.turns) { turn in
                            TurnView(turn: turn).id(turn.id)
                        }
                        Color.clear.frame(height: 1).id("bottom")
                    }
                    .padding()
                }
                .onChange(of: feed.turns.last?.translation) { proxy.scrollTo("bottom", anchor: .bottom) }
                .onChange(of: feed.turns.last?.original) { proxy.scrollTo("bottom", anchor: .bottom) }
            }
    }
}

struct LiveView: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var feed: LiveFeed
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 8) {
                SpeakCue().padding(.horizontal)
                LiveTranscript(placeholder: placeholder)
                // Звонок перезвоном на мобильный: помощь в разговоре — здесь
                if feed.state == .talking { AssistButtons(translationOn: feed.translatorOn ?? true).padding(.bottom, 8) }
            }
            .navigationTitle("Текст разговора")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    VStack(spacing: 0) {
                        Text("Текст разговора").font(.headline)
                        Text(stateText).font(.caption).foregroundStyle(feed.state == .offline ? .red : .secondary)
                    }
                }
                ToolbarItem(placement: .confirmationAction) { Button("Готово") { dismiss() } }
            }
        }
        .onAppear { feed.start { try model.api.liveRequest() } }
        .onDisappear { feed.stop() }
    }

    private var placeholder: String {
        feed.state == .ended ? "Разговор завершён." : "Текст появится, когда собеседник заговорит.\nНичего не сохраняется."
    }

    private var stateText: String {
        switch feed.state {
        case .idle, .connecting: return "Подключаюсь…"
        case .waiting: return "Ждём начала разговора"
        case .talking: return "Идёт разговор"
        case .ended: return "Разговор завершён"
        case .offline: return "Нет связи, переподключаюсь…"
        }
    }
}

private struct TurnView: View {
    let turn: LiveTurn
    private var isPeer: Bool { turn.role == "peer" }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(isPeer ? "Собеседник" : "Вы")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
            // Собеседник: крупно перевод на русский, мелко оригинал. Вы: ваш текст и что услышал собеседник.
            if isPeer {
                if !turn.translation.isEmpty { Text(turn.translation).font(.title3) }
                if !turn.original.isEmpty { Text(turn.original).font(.subheadline).foregroundStyle(.secondary) }
            } else {
                if !turn.original.isEmpty { Text(turn.original).font(.body) }
                if !turn.translation.isEmpty { Text(turn.translation).font(.subheadline).foregroundStyle(.secondary) }
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(isPeer ? Color.accentColor.opacity(0.14) : Color(.secondarySystemBackground))
        )
        .textSelection(.enabled)
    }
}
