import SwiftUI
import Security

enum CallMode: String, CaseIterable, Identifiable {
    case translate, seq, plain
    var id: String { rawValue }
    var title: String {
        switch self {
        case .translate: return "Синхронно"
        case .seq: return "По фразам"
        case .plain: return "Без перевода"
        }
    }
    var hint: String {
        switch self {
        case .translate: return "Перевод идёт одновременно с речью."
        case .seq: return "Перевод по фразам: точнее для номеров и имён, пауза 2–3 с после каждой фразы."
        case .plain: return "Обычный звонок через переводчика: без объявления и перевода."
        }
    }
}

/// Общее состояние: настройки сервера, набираемый номер, активная вкладка.
@MainActor
final class AppModel: ObservableObject {
    @Published var tab: Tab = .keypad
    @Published var number: String = ""
    @Published var mode: CallMode = .translate
    @Published var serverURL: String { didSet { UserDefaults.standard.set(serverURL, forKey: "serverURL") } }
    @Published var key: String { didSet { Keychain.set(key, for: "callKey") } }

    init() {
        let info = Bundle.main.infoDictionary ?? [:]
        let defaultURL = (info["DolmetscherURL"] as? String) ?? ""
        let defaultKey = (info["DolmetscherKey"] as? String) ?? ""
        serverURL = UserDefaults.standard.string(forKey: "serverURL") ?? defaultURL
        key = Keychain.get("callKey") ?? defaultKey
        if let saved = UserDefaults.standard.string(forKey: "mode"), let m = CallMode(rawValue: saved) { mode = m }
    }

    var api: APIClient { APIClient(baseURL: serverURL, key: key) }

    /// Подставить номер в клавиатуру и перейти на неё (из контактов или истории).
    func dial(_ value: String) {
        number = Phone.normalize(value)
        tab = .keypad
    }

    func rememberMode() { UserDefaults.standard.set(mode.rawValue, forKey: "mode") }
}

/// Минимальная обёртка над Keychain для ключа доступа к серверу.
enum Keychain {
    private static func query(_ account: String) -> [String: Any] {
        [kSecClass as String: kSecClassGenericPassword,
         kSecAttrService as String: "Viacheslav.Dolmetscher",
         kSecAttrAccount as String: account]
    }
    static func get(_ account: String) -> String? {
        var q = query(account)
        q[kSecReturnData as String] = true
        q[kSecMatchLimit as String] = kSecMatchLimitOne
        var out: AnyObject?
        guard SecItemCopyMatching(q as CFDictionary, &out) == errSecSuccess, let data = out as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }
    static func set(_ value: String, for account: String) {
        SecItemDelete(query(account) as CFDictionary)
        guard !value.isEmpty else { return }
        var q = query(account)
        q[kSecValueData as String] = Data(value.utf8)
        q[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        SecItemAdd(q as CFDictionary, nil)
    }
}
