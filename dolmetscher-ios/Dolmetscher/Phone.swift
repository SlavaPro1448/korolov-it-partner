import Foundation

/// Номера: нормализация ввода и показ.
enum Phone {
    /// Оставить только цифры и ведущий «+»; «00» в начале → «+».
    static func normalize(_ raw: String) -> String {
        var digits = raw.filter { $0.isNumber || $0 == "+" }
        if digits.hasPrefix("00") { digits = "+" + digits.dropFirst(2) }
        if let plus = digits.firstIndex(of: "+"), plus != digits.startIndex { digits.remove(at: plus) }
        let body = digits.dropFirst(digits.hasPrefix("+") ? 1 : 0).filter(\.isNumber)
        return (digits.hasPrefix("+") ? "+" : "") + body
    }

    /// Похоже ли на телефонный номер (для кнопки «Вставить»).
    static func looksLikeNumber(_ text: String) -> Bool {
        let n = normalize(text)
        let count = n.filter(\.isNumber).count
        return count >= 3 && count <= 16 && text.filter { $0.isLetter }.count < 2
    }

    private static let codes = ["380", "420", "49", "43", "41", "1", "33", "39", "34", "31", "48", "44"]

    /// Читабельный вид: +49 163 825 1736, 0214 83263440.
    static func format(_ raw: String) -> String {
        let n = normalize(raw)
        guard !n.isEmpty else { return "" }
        var rest = Substring(n)
        var parts: [String] = []
        if rest.hasPrefix("+") {
            rest = rest.dropFirst()
            if let code = codes.first(where: { rest.hasPrefix($0) }) {
                parts.append("+" + code)
                rest = rest.dropFirst(code.count)
            } else {
                parts.append("+")
            }
        } else if rest.hasPrefix("0"), rest.count > 5 {
            let areaLength = rest.hasPrefix("01") ? 4 : 4
            parts.append(String(rest.prefix(areaLength)))
            rest = rest.dropFirst(areaLength)
        }
        var chunk = String(rest)
        while chunk.count > 4 {
            parts.append(String(chunk.prefix(3)))
            chunk = String(chunk.dropFirst(3))
        }
        if !chunk.isEmpty { parts.append(chunk) }
        return parts.joined(separator: " ").replacingOccurrences(of: "+ ", with: "+")
    }

    /// Ключ для сопоставления с контактами: последние 9 цифр.
    static func matchKey(_ raw: String) -> String {
        String(normalize(raw).filter(\.isNumber).suffix(9))
    }
}

enum Country {
    static func name(_ iso: String, fallback: String) -> String {
        Locale(identifier: "ru_RU").localizedString(forRegionCode: iso) ?? fallback
    }
    static func flag(_ iso: String) -> String {
        iso.uppercased().unicodeScalars.compactMap { UnicodeScalar(127397 + $0.value) }.map(String.init).joined()
    }
}

enum Money {
    static func rate(_ value: Double, _ unit: String) -> String {
        String(format: "%.3f %@/мин", value, unit)
    }
    static func amount(_ value: Double, _ unit: String) -> String {
        String(format: "%.2f %@", value, unit)
    }
    static func minutes(_ value: Int?) -> String {
        guard let value else { return "—" }
        return "\(value) мин"
    }
}
