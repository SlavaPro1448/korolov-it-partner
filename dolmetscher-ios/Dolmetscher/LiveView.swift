import SwiftUI

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

    private var task: URLSessionWebSocketTask?
    private var wanted = false
    private var request: () throws -> URLRequest = { throw APIError.badURL }

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

    private struct Message: Decodable { var event: String?; var role: String?; var dir: String?; var text: String? }

    private func handle(_ raw: String) {
        guard let message = try? JSONDecoder().decode(Message.self, from: Data(raw.utf8)) else { return }
        switch message.event {
        case "start": turns = []; state = .talking; return
        case "end": state = .ended; return
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

struct LiveView: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var feed: LiveFeed
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
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
