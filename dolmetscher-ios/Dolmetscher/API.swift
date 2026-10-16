import Foundation

struct Account: Decodable {
    var balance: Double
    var minutesLeft: Int?
    var typicalPerMinute: Double?
    var appMinutesLeft: Int?
    var appPerMinute: Double?
    var voip: Bool?
    var currency: String
    var ownerLegPerMinute: Double
    var mediaStreamPerMinute: Double
    var openaiPerMinute: Double
    var allowedCountries: [String]
    var translatorNumber: String
}

struct RateRow: Decodable {
    var legPerMinute: Double
    var perMinute: Double
    var minutes: Int?
    var plainPerMinute: Double
    var plainMinutes: Int?
}

struct CountryRates: Decodable, Identifiable {
    var iso: String
    var country: String
    var unit: String
    var balance: Double
    var allowed: Bool
    var mobile: RateRow?
    var landline: RateRow?
    var incoming: RateRow?
    var openaiPerMinute: Double
    var id: String { iso }
}

struct CountryEntry: Decodable, Identifiable, Hashable {
    var iso: String
    var name: String
    var id: String { iso }
}

struct CallEntry: Decodable, Identifiable {
    var id: String
    var direction: String
    var number: String
    var startedAt: Date
    var duration: Int
    var status: String
    var price: Double
    var unit: String
    var translated: Bool?
    var talkSeconds: Int?
    var mediaPrice: Double?
    var openaiPrice: Double?
    var totalPrice: Double?
    var pricePending: Bool?
    var viaApp: Bool?
    var isIncoming: Bool { direction == "in" }
    var failed: Bool { ["busy", "no-answer", "failed", "canceled"].contains(status) }
}

/// Цена звонка на конкретный номер до набора.
struct Quote: Decodable {
    struct Route: Decodable { var perMinute: Double; var minutes: Int?; var plainPerMinute: Double; var plainMinutes: Int? }
    var app: Route?
    var number: String?
    var iso: String?
    var allowed: Bool
    var reason: String?
    var found: Bool
    var mobile: Bool?
    var perMinute: Double?
    var minutes: Int?
    var plainPerMinute: Double?
    var plainMinutes: Int?
    var openaiPerMinute: Double?
    var unit: String?
}

enum APIError: LocalizedError {
    case badURL, server(String), http(Int), offline
    var errorDescription: String? {
        switch self {
        case .badURL: return "Адрес сервера не задан (см. настройки)."
        case .server(let text): return text
        case .http(let code): return code == 404 ? "Ключ доступа не подходит." : "Сервер ответил ошибкой \(code)."
        case .offline: return "Нет связи с сервером."
        }
    }
}

/// HTTP-клиент к серверу переводчика. Ключ идёт заголовком, в адресах его нет.
struct APIClient {
    var baseURL: String
    var key: String

    private func request(_ path: String, query: [String: String] = [:]) throws -> URLRequest {
        guard var components = URLComponents(string: baseURL.trimmingCharacters(in: .whitespaces)),
              components.scheme != nil else { throw APIError.badURL }
        components.path = path
        if !query.isEmpty { components.queryItems = query.map { URLQueryItem(name: $0.key, value: $0.value) } }
        guard let url = components.url else { throw APIError.badURL }
        var req = URLRequest(url: url, timeoutInterval: 20)
        req.setValue("Bearer \(key)", forHTTPHeaderField: "Authorization")
        req.cachePolicy = .reloadIgnoringLocalCacheData
        return req
    }

    private func send<T: Decodable>(_ req: URLRequest, as type: T.Type) async throws -> T {
        let (data, response): (Data, URLResponse)
        do { (data, response) = try await URLSession.shared.data(for: req) } catch { throw APIError.offline }
        let code = (response as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(code) else {
            if let body = try? JSONDecoder().decode(ErrorBody.self, from: data), let text = body.error {
                throw APIError.server(text)
            }
            throw APIError.http(code)
        }
        return try Self.decoder.decode(T.self, from: data)
    }

    /// Сервер отдаёт время с миллисекундами (2026-10-16T19:49:55.000Z) — стандартный .iso8601 их не понимает.
    static let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { d in
            let text = try d.singleValueContainer().decode(String.self)
            let precise = ISO8601DateFormatter()
            precise.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = precise.date(from: text) ?? ISO8601DateFormatter().date(from: text) { return date }
            throw DecodingError.dataCorrupted(.init(codingPath: d.codingPath, debugDescription: "Дата: \(text)"))
        }
        return decoder
    }()

    private struct ErrorBody: Decodable { var ok: Bool?; var error: String? }
    private struct CallsBody: Decodable { var calls: [CallEntry] }
    private struct CountriesBody: Decodable { var countries: [CountryEntry]; var allowed: [String] }
    struct CallResult: Decodable { var ok: Bool; var error: String?; var session: String? }

    func account() async throws -> Account { try await send(try request("/api/account"), as: Account.self) }
    func rates(country: String) async throws -> CountryRates {
        try await send(try request("/api/rates", query: ["country": country]), as: CountryRates.self)
    }
    func countries() async throws -> [CountryEntry] {
        try await send(try request("/api/countries"), as: CountriesBody.self).countries
    }
    func calls() async throws -> [CallEntry] { try await send(try request("/api/calls"), as: CallsBody.self).calls }
    struct VoiceToken: Decodable { var token: String; var incoming: Bool? }
    /// Токен Twilio Voice SDK для звонка через интернет (живёт час, берётся перед каждым звонком).
    func voiceToken() async throws -> String { try await voiceTokenInfo().token }
    /// То же плюс признак, принимает ли сервер входящие в приложение (настроен VoIP-пуш).
    func voiceTokenInfo() async throws -> VoiceToken {
        do { return try await send(try request("/api/voice-token"), as: VoiceToken.self) }
        catch APIError.server("voip-off") { throw APIError.server("Звонки через интернет на сервере не настроены.") }
    }
    func quote(number: String) async throws -> Quote {
        try await send(try request("/api/quote", query: ["number": number]), as: Quote.self)
    }

    /// WebSocket живого текста разговора (ключ — тем же заголовком).
    func liveRequest() throws -> URLRequest {
        var req = try request("/live-ws")
        guard var components = URLComponents(url: req.url!, resolvingAgainstBaseURL: false) else { throw APIError.badURL }
        components.scheme = components.scheme == "http" ? "ws" : "wss"
        req.url = components.url
        req.timeoutInterval = 60
        return req
    }

    /// Сервер сначала звонит владельцу, после ответа набирает собеседника.
    func call(to number: String, mode: CallMode) async throws -> CallResult {
        var req = try request("/call")
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try JSONEncoder().encode(["to": number, "mode": mode.rawValue])
        let (data, response): (Data, URLResponse)
        do { (data, response) = try await URLSession.shared.data(for: req) } catch { throw APIError.offline }
        let code = (response as? HTTPURLResponse)?.statusCode ?? 0
        if let result = try? JSONDecoder().decode(CallResult.self, from: data) { return result }
        throw APIError.http(code)
    }
}
