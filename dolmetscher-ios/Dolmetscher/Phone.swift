import Foundation

/// Номера: нормализация ввода и показ.
enum Phone {
    /// Оставить только цифры и ведущий «+»; «00» в начале → «+».
    /// Так же, как сервер: «+49 (0) 163…» → «+49163…», «0049…» → «+49…», «49 163…» без плюса → «+49163…».
    /// Номер с 0 в начале остаётся национальным (0214…), как его набирают.
    static func normalize(_ raw: String) -> String {
        let cleaned = raw.replacingOccurrences(of: "(0)", with: "")
        let digits = String(cleaned.filter { $0.isASCII && $0.isNumber })
        let plus = cleaned.first(where: { ($0.isASCII && $0.isNumber) || $0 == "+" }) == "+"
        var result: String
        if plus {
            result = "+" + digits
        } else if digits.hasPrefix("00") {
            result = "+" + digits.dropFirst(2)
        } else if !digits.hasPrefix("0"), digits.count >= 11, ["49", "420", "43", "41"].contains(where: digits.hasPrefix) {
            result = "+" + digits
        } else {
            return digits
        }
        for code in ["+49", "+43", "+41"] where result.hasPrefix(code + "0") {
            result = code + result.dropFirst(code.count + 1)
        }
        return result
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
    static func precise(_ value: Double, _ unit: String) -> String {
        String(format: "%.3f %@", value, unit)
    }
    static func minutes(_ value: Int?) -> String {
        guard let value else { return "—" }
        return "\(value) мин"
    }
}
