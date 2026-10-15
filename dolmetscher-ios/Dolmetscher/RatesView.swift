import SwiftUI

/// Баланс Twilio и сколько минут хватит по странам. Минута переведённого звонка на стороне Twilio =
/// плечо к владельцу + плечо к собеседнику + два Media Stream; перевод OpenAI считается отдельно.
struct RatesView: View {
    @EnvironmentObject private var model: AppModel
    @State private var account: Account?
    @State private var rates: [String: CountryRates] = [:]
    @State private var countries: [CountryEntry] = []
    @State private var query = ""
    @State private var error: String?
    @State private var loading = false
    @State private var extra: CountryRates?

    private var allowed: [String] { account?.allowedCountries ?? ["DE", "CZ"] }
    private var others: [CountryEntry] {
        let q = query.trimmingCharacters(in: .whitespaces)
        let list = countries.filter { !allowed.contains($0.iso) }
        guard !q.isEmpty else { return [] }
        return list.filter { Country.name($0.iso, fallback: $0.name).localizedCaseInsensitiveContains(q) || $0.name.localizedCaseInsensitiveContains(q) }
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    VStack(spacing: 6) {
                        Text("Посмотрите, сколько вы можете общаться с балансом.")
                            .font(.footnote).foregroundStyle(.secondary).multilineTextAlignment(.center)
                        if let account {
                            HStack(spacing: 6) {
                                Image(systemName: "creditcard.circle.fill").foregroundStyle(.orange)
                                Text("Баланс Twilio").foregroundStyle(.secondary)
                                Text(Money.amount(account.balance, account.currency)).bold()
                            }
                        } else if loading {
                            ProgressView()
                        } else if let error {
                            Text(error).font(.footnote).foregroundStyle(.red).multilineTextAlignment(.center)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .listRowBackground(Color.clear)
                }

                Section("Можно набирать") {
                    ForEach(allowed, id: \.self) { iso in
                        if let r = rates[iso] { CountryRow(rates: r, openai: account?.openaiPerMinute) }
                        else { HStack { Text(Country.flag(iso)); Text(Country.name(iso, fallback: iso)); Spacer(); if error == nil { ProgressView() } else { Text("—").foregroundStyle(.secondary) } } }
                    }
                }

                if let account {
                    Section {
                        LabeledContent("Плечо к вам (мобильный)", value: Money.rate(account.ownerLegPerMinute, account.currency))
                        LabeledContent("Media Stream, за плечо", value: Money.rate(account.mediaStreamPerMinute, account.currency))
                        LabeledContent("Перевод OpenAI (оба направления)", value: Money.rate(account.openaiPerMinute, "USD"))
                    } header: {
                        Text("Из чего складывается минута")
                    } footer: {
                        Text("Минуты выше посчитаны только по балансу Twilio. Перевод OpenAI списывается с отдельного счёта OpenAI, его цена дана для оценки. Режим «Без перевода» дешевле: без Media Streams и без OpenAI.")
                    }
                }

                if !others.isEmpty {
                    Section("Другие страны (набор закрыт)") {
                        ForEach(others.prefix(30)) { c in
                            Button {
                                Task { extra = try? await model.api.rates(country: c.iso) }
                            } label: {
                                HStack { Text(Country.flag(c.iso)); Text(Country.name(c.iso, fallback: c.name)).foregroundStyle(.primary); Spacer(); Image(systemName: "chevron.right").foregroundStyle(.tertiary) }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Тарифы")
            .searchable(text: $query, prompt: "Поиск страны")
            .refreshable { await load(force: true) }
            .sheet(item: $extra) { r in
                NavigationStack {
                    List { CountryRow(rates: r, openai: account?.openaiPerMinute, expanded: true) }
                        .navigationTitle(Country.name(r.iso, fallback: r.country))
                        .navigationBarTitleDisplayMode(.inline)
                }
                .presentationDetents([.medium])
            }
        }
        .task { if account == nil { await load(force: false) } }
    }

    private func load(force: Bool) async {
        loading = true
        defer { loading = false }
        do {
            let acc = try await model.api.account()
            account = acc
            error = nil
            await withTaskGroup(of: CountryRates?.self) { group in
                for iso in acc.allowedCountries { group.addTask { try? await model.api.rates(country: iso) } }
                for await r in group { if let r { rates[r.iso] = r } }
            }
            if countries.isEmpty || force { countries = (try? await model.api.countries()) ?? countries }
        } catch {
            self.error = error.localizedDescription
        }
    }
}

private struct CountryRow: View {
    let rates: CountryRates
    var openai: Double?
    @State var expanded = false

    var body: some View {
        DisclosureGroup(isExpanded: $expanded) {
            if let m = rates.mobile { line("iphone", "Мобильный", m) }
            if let l = rates.landline { line("phone", "Стационарный телефон", l) }
            if let i = rates.incoming { line("arrow.down.left", "Входящий (переадресация к вам)", i) }
            if let m = rates.mobile {
                LabeledContent {
                    Text("\(Money.rate(m.plainPerMinute, rates.unit))  \(Money.minutes(m.plainMinutes))").font(.footnote)
                } label: {
                    Label("Без перевода, мобильный", systemImage: "phone.arrow.up.right").font(.footnote)
                }
            }
        } label: {
            HStack(spacing: 10) {
                Text(Country.flag(rates.iso)).font(.title2)
                Text(Country.name(rates.iso, fallback: rates.country))
                Spacer()
                if let m = rates.mobile ?? rates.landline {
                    Text(Money.rate(m.perMinute, rates.unit)).foregroundStyle(.secondary)
                    Text(Money.minutes(m.minutes)).bold()
                }
            }
        }
    }

    private func line(_ icon: String, _ title: String, _ row: RateRow) -> some View {
        LabeledContent {
            HStack(spacing: 8) {
                Text(Money.rate(row.perMinute, rates.unit)).foregroundStyle(.secondary)
                Text(Money.minutes(row.minutes)).bold()
            }
        } label: {
            Label(title, systemImage: icon)
        }
    }
}
