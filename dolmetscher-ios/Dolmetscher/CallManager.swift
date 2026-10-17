import AVFoundation
import CallKit
import PushKit
import SwiftUI
import TwilioVoice

/// Звонок через интернет: Twilio Voice SDK + системный экран звонка (CallKit).
/// Ваше плечо идёт по интернету из приложения, собеседнику сервер звонит как раньше —
/// с вашего мобильного номера в определителе.
final class CallManager: NSObject, ObservableObject {
    enum Phase: Equatable { case idle, connecting, ringing, connected, ended }

    @Published private(set) var phase: Phase = .idle
    @Published private(set) var number = ""
    @Published private(set) var name: String?
    @Published private(set) var mode: CallMode = .translate
    @Published private(set) var connectedAt: Date?
    @Published private(set) var muted = false
    @Published private(set) var speaker = false
    @Published private(set) var endReason: String?
    @Published var reconnecting = false
    /// Входящий звонок (собеседник позвонил на ваш номер, сервер передал его в приложение)
    @Published private(set) var isIncoming = false
    /// Приложение зарегистрировано для входящих (VoIP-пуш через Twilio)
    @Published private(set) var incomingReady = false
    @Published private(set) var incomingError: String?
    /// Имя по номеру из контактов (задаёт приложение)
    var nameForNumber: (String) -> String? = { _ in nil }

    var isActive: Bool { phase != .idle }

    private let provider: CXProvider
    private let controller = CXCallController()
    private let audioDevice = DefaultAudioDevice()
    private var call: Call?
    private var uuid: UUID?
    private var token = ""
    private var startCompletion: ((Bool) -> Void)?
    private var userHungUp = false
    private let pushRegistry = PKPushRegistry(queue: .main)
    private var pushToken: Data?
    private var api: APIClient?
    private var invites: [UUID: CallInvite] = [:]

    override init() {
        let config = CXProviderConfiguration()
        config.supportsVideo = false
        config.maximumCallGroups = 1
        config.maximumCallsPerCallGroup = 1
        config.supportedHandleTypes = [.phoneNumber]
        // Звонок попадает в «Недавние» системного «Телефона»; нажатие там откроет это приложение
        config.includesCallsInRecents = true
        provider = CXProvider(configuration: config)
        super.init()
        provider.setDelegate(self, queue: nil)
        TwilioVoiceSDK.audioDevice = audioDevice
    }

    enum StartError: LocalizedError {
        case microphone, busy
        var errorDescription: String? {
            switch self {
            case .microphone: return "Нет доступа к микрофону: Настройки → Переводчик → Микрофон."
            case .busy: return "Уже идёт звонок."
            }
        }
    }

    /// Входящие в приложение: PushKit выдаёт VoIP-токен устройства, мы регистрируем его в Twilio.
    /// Вызывать при каждом запуске — так регистрация не устаревает.
    func enableIncoming(api: APIClient) {
        #if targetEnvironment(simulator)
        // Симулятор не регистрируем: Twilio держит одну регистрацию на учётку, и он забрал бы входящие у iPhone
        incomingError = "В симуляторе входящие отключены."
        return
        #endif
        self.api = api
        pushRegistry.delegate = self
        pushRegistry.desiredPushTypes = [.voIP]
        if pushToken != nil { register() }
    }

    private func register() {
        guard let api, let pushToken else { return }
        Task { @MainActor in
            do {
                let info = try await api.voiceTokenInfo()
                guard info.incoming == true else {
                    incomingReady = false
                    incomingError = "Сервер пока не принимает входящие в приложение."
                    return
                }
                TwilioVoiceSDK.register(accessToken: info.token, deviceToken: pushToken) { [weak self] error in
                    DispatchQueue.main.async {
                        self?.incomingReady = error == nil
                        self?.incomingError = error.map { "Регистрация для входящих: \($0.localizedDescription)" }
                    }
                }
            } catch {
                incomingError = error.localizedDescription
            }
        }
    }

    /// Начать звонок: токен с сервера → CXStartCallAction → Twilio connect.
    @MainActor
    func start(number: String, name: String?, mode: CallMode, api: APIClient) async throws {
        guard phase == .idle || phase == .ended else { throw StartError.busy }
        guard await AVAudioApplication.requestRecordPermission() else { throw StartError.microphone }
        token = try await api.voiceToken()
        let id = UUID()
        uuid = id
        self.number = number
        self.name = name
        self.mode = mode
        connectedAt = nil
        muted = false
        speaker = false
        endReason = nil
        userHungUp = false
        isIncoming = false
        phase = .connecting
        let handle = CXHandle(type: .phoneNumber, value: number)
        let action = CXStartCallAction(call: id, handle: handle)
        action.contactIdentifier = name
        do {
            try await controller.request(CXTransaction(action: action))
        } catch {
            phase = .idle
            throw error
        }
    }

    func hangUp() {
        guard let uuid else { return finish(reason: nil) }
        userHungUp = true
        controller.request(CXTransaction(action: CXEndCallAction(call: uuid))) { [weak self] error in
            if error != nil { DispatchQueue.main.async { self?.call?.disconnect(); self?.finish(reason: nil) } }
        }
    }

    func toggleMute() {
        guard let uuid else { return }
        controller.request(CXTransaction(action: CXSetMutedCallAction(call: uuid, muted: !muted))) { _ in }
    }

    func toggleSpeaker() {
        let on = !speaker
        audioDevice.block = {
            DefaultAudioDevice.DefaultAVAudioSessionConfigurationBlock()
            try? AVAudioSession.sharedInstance().overrideOutputAudioPort(on ? .speaker : .none)
        }
        audioDevice.block()
        speaker = on
    }

    /// Клавиши в разговоре: * — режим перевода, # — пропустить перевод, цифры — собеседнику (меню).
    func send(digits: String) {
        call?.sendDigits(digits)
        if digits == "*" {
            let order: [CallMode] = [.translate, .seq, .plain]
            mode = order[((order.firstIndex(of: mode) ?? 0) + 1) % order.count]
        }
    }

    /// Убрать экран звонка после завершения.
    func dismiss() {
        if phase == .ended { phase = .idle }
    }

    private func finish(reason: String?) {
        if let uuid { invites[uuid] = nil }
        call = nil
        uuid = nil
        startCompletion = nil
        endReason = reason
        phase = .ended
        reconnecting = false
        // Экран «Разговор завершён» держится пару секунд, затем закрывается сам
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) { [weak self] in self?.dismiss() }
    }
}

extension CallManager: CXProviderDelegate {
    func providerDidReset(_ provider: CXProvider) {
        audioDevice.isEnabled = false
        call?.disconnect()
        finish(reason: nil)
    }

    func provider(_ provider: CXProvider, perform action: CXStartCallAction) {
        // Звук включится, когда система активирует аудиосессию (didActivate)
        audioDevice.isEnabled = false
        audioDevice.block()
        provider.reportOutgoingCall(with: action.callUUID, startedConnectingAt: Date())
        let options = ConnectOptions(accessToken: token) { [number, mode] builder in
            builder.params = ["to": number, "mode": mode.rawValue]
            builder.uuid = action.callUUID
        }
        startCompletion = { ok in ok ? action.fulfill() : action.fail() }
        call = TwilioVoiceSDK.connect(options: options, delegate: self)
    }

    func provider(_ provider: CXProvider, perform action: CXEndCallAction) {
        if let invite = invites.removeValue(forKey: action.callUUID) {
            // Входящий отклонён до ответа: сервер переведёт собеседника на телефонного ассистента
            invite.reject()
            if uuid == action.callUUID || call == nil { finish(reason: nil) }
        } else {
            call?.disconnect()
            if call == nil { finish(reason: nil) }
        }
        action.fulfill()
    }

    func provider(_ provider: CXProvider, perform action: CXAnswerCallAction) {
        guard let invite = invites.removeValue(forKey: action.callUUID) else { return action.fail() }
        audioDevice.isEnabled = false
        audioDevice.block()
        let from = Self.number(from: invite.from)
        uuid = action.callUUID
        number = from
        name = nameForNumber(from)
        mode = .translate
        connectedAt = nil
        muted = false
        speaker = false
        endReason = nil
        userHungUp = false
        isIncoming = true
        phase = .connecting
        let options = AcceptOptions(callInvite: invite) { builder in builder.uuid = invite.uuid }
        startCompletion = { ok in ok ? action.fulfill() : action.fail() }
        call = invite.accept(options: options, delegate: self)
    }

    func provider(_ provider: CXProvider, perform action: CXSetMutedCallAction) {
        call?.isMuted = action.isMuted
        muted = action.isMuted
        action.fulfill()
    }

    func provider(_ provider: CXProvider, perform action: CXSetHeldCallAction) {
        call?.isOnHold = action.isOnHold
        action.fulfill()
    }

    func provider(_ provider: CXProvider, perform action: CXPlayDTMFCallAction) {
        send(digits: action.digits)
        action.fulfill()
    }

    func provider(_ provider: CXProvider, didActivate audioSession: AVAudioSession) {
        audioDevice.isEnabled = true
    }

    func provider(_ provider: CXProvider, didDeactivate audioSession: AVAudioSession) {
        audioDevice.isEnabled = false
    }
}

extension CallManager: CallDelegate {
    func callDidStartRinging(call: Call) {
        // Сервер уже набирает собеседника; гудки он сам проигрывает в разговор
        phase = .ringing
    }

    func callDidConnect(call: Call) {
        startCompletion?(true)
        startCompletion = nil
        if let uuid { provider.reportOutgoingCall(with: uuid, connectedAt: Date()) }
        connectedAt = Date()
        phase = .connected
    }

    func callDidFailToConnect(call: Call, error: Error) {
        startCompletion?(false)
        if let uuid { provider.reportCall(with: uuid, endedAt: Date(), reason: .failed) }
        finish(reason: "Не удалось соединиться: \(error.localizedDescription)")
    }

    func callDidDisconnect(call: Call, error: Error?) {
        if !userHungUp, let uuid {
            provider.reportCall(with: uuid, endedAt: Date(), reason: error == nil ? .remoteEnded : .failed)
        }
        finish(reason: error.map { "Связь прервалась: \($0.localizedDescription)" })
    }

    func callIsReconnecting(call: Call, error: Error) { reconnecting = true }
    func callDidReconnect(call: Call) { reconnecting = false }
}

extension CallManager: PKPushRegistryDelegate {
    func pushRegistry(_ registry: PKPushRegistry, didUpdate credentials: PKPushCredentials, for type: PKPushType) {
        guard type == .voIP else { return }
        pushToken = credentials.token
        register()
    }

    func pushRegistry(_ registry: PKPushRegistry, didInvalidatePushTokenFor type: PKPushType) {
        guard type == .voIP, let api, let token = pushToken else { return }
        Task { if let access = try? await api.voiceToken() { TwilioVoiceSDK.unregister(accessToken: access, deviceToken: token) { _ in } } }
        pushToken = nil
        incomingReady = false
    }

    /// Пуш о входящем: Twilio сразу вызывает callInviteReceived, и звонок показывается через CallKit
    /// (iOS требует показать его до выхода из этого метода, иначе закроет приложение).
    func pushRegistry(_ registry: PKPushRegistry, didReceiveIncomingPushWith payload: PKPushPayload,
                      for type: PKPushType, completion: @escaping () -> Void) {
        TwilioVoiceSDK.handleNotification(payload.dictionaryPayload, delegate: self, delegateQueue: nil)
        completion()
    }
}

extension CallManager: NotificationDelegate {
    static func number(from raw: String?) -> String {
        let text = (raw ?? "").replacingOccurrences(of: "client:", with: "")
        return text.isEmpty ? "Неизвестный" : text
    }

    func callInviteReceived(callInvite: CallInvite) {
        // Уже идёт разговор: второй звонок не принимаем, сервер отправит его дальше
        if phase != .idle && phase != .ended {
            callInvite.reject()
            return
        }
        invites[callInvite.uuid] = callInvite
        let from = Self.number(from: callInvite.from)
        let update = CXCallUpdate()
        update.remoteHandle = CXHandle(type: .phoneNumber, value: from)
        if let known = nameForNumber(from) { update.localizedCallerName = known }
        update.supportsDTMF = true
        update.supportsHolding = false
        update.supportsGrouping = false
        update.supportsUngrouping = false
        update.hasVideo = false
        provider.reportNewIncomingCall(with: callInvite.uuid, update: update) { [weak self] error in
            if error != nil {
                // Например, «Не беспокоить» или номер заблокирован: отклоняем, сервер позвонит на мобильный
                self?.invites[callInvite.uuid]?.reject()
                self?.invites[callInvite.uuid] = nil
            }
        }
    }

    func cancelledCallInviteReceived(cancelledCallInvite: CancelledCallInvite, error: Error) {
        // Собеседник положил трубку или сервер перестал ждать (через 20 с звонит на мобильный)
        guard let entry = invites.first(where: { $0.value.callSid == cancelledCallInvite.callSid }) else { return }
        invites[entry.key] = nil
        provider.reportCall(with: entry.key, endedAt: Date(), reason: .unanswered)
    }
}
