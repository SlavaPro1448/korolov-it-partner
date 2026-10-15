import Foundation

struct Account: Decodable {
    var balance: Double
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
    var isIncoming: Bool { direction == "in" }
    var failed: Bool { ["busy", "no-answer", "failed", "canceled"].contains(status) }
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
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(T.self, from: data)
    }

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
