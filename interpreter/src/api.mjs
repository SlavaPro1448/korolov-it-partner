// JSON-API für die iOS-App: Guthaben, Minutenpreise je Land und Gesprächsverlauf aus Twilio.
// Alles wird nur weitergereicht, nichts gespeichert. Zugang mit CALL_KEY (?key= oder Bearer).
const PRICING_BASE = "https://pricing.twilio.com/v2/Voice/Countries";
const CACHE_MS = 6 * 60 * 60 * 1000; // Preise ändern sich selten
const GROUP_WINDOW_MS = 150 * 1000; // Inhaber- und Gegenseiten-Leg desselben Gesprächs

import { dialProblem, toE164 } from "./twilio.mjs";

export { toE164 };

const digitsOf = (value) => String(value ?? "").replace(/\D/g, "");
const PREFIX_COUNTRY = { "+49": "DE", "+420": "CZ", "+43": "AT", "+41": "CH", "+1": "US", "+380": "UA" };
const round4 = (value) => Math.round(value * 10000) / 10000;



export function createTwilioApi({ accountSid, authToken, fetchImpl = fetch }) {
  const auth = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const rest = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`;
  const cache = new Map();

  async function get(url) {
    const response = await fetchImpl(url, { headers: { Authorization: auth } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`Twilio ${response.status}: ${body.message ?? "Fehler"}`);
    return body;
  }
  async function cached(key, loader) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.value;
    const value = await loader();
    cache.set(key, { at: Date.now(), value });
    return value;
  }

  return {
    balance: () => get(`${rest}/Balance.json`),
    country: (iso) => cached(`country:${iso}`, () => get(`${PRICING_BASE}/${iso}`)),
    countries: () =>
      cached("countries", async () => {
        const list = [];
        let url = `${PRICING_BASE}?PageSize=200`;
        while (url) {
          const page = await get(url);
          list.push(...page.countries.map((c) => ({ iso: c.iso_country, name: c.country })));
          url = page.meta?.next_page_url;
        }
        return list;
      }),
    calls: (pageSize = 100) => get(`${rest}/Calls.json?PageSize=${pageSize}`),
  };
}

// Preis je Minute für eine Zielnummer: längstes passendes Präfix gewinnt, bei gleicher Länge
// die Regel für unser Herkunftsland (z. B. "49") vor "ALL".
export function rateForNumber(pricing, e164, originPrefix) {
  const digits = digitsOf(e164);
  let best = null;
  for (const entry of pricing.outbound_prefix_prices ?? []) {
    const origins = entry.origination_prefixes ?? ["ALL"];
    const specific = origins.includes(originPrefix);
    if (!specific && !origins.includes("ALL")) continue;
    for (const prefix of entry.destination_prefixes ?? []) {
      if (!digits.startsWith(prefix)) continue;
      const better =
        !best ||
        prefix.length > best.prefix.length ||
        (prefix.length === best.prefix.length && specific && !best.specific);
      if (better) best = { prefix, specific, price: Number(entry.current_price), name: entry.friendly_name };
    }
  }
  return best;
}

// Übersicht eines Landes: typischer Mobil- und Festnetzpreis (günstigste Regel für unser
// Herkunftsland, ohne Sonderdienste).
export function summarizeCountry(pricing, originPrefix) {
  const isMobile = (e) => /mobile/i.test(e.friendly_name ?? "");
  const isSpecial = (e) => /special|premium|shared|toll|other/i.test(e.friendly_name ?? "");
  const usable = (pricing.outbound_prefix_prices ?? []).filter((e) => {
    const origins = e.origination_prefixes ?? ["ALL"];
    return origins.includes(originPrefix) || origins.includes("ALL");
  });
  const pick = (entries) => {
    const specific = entries.filter((e) => (e.origination_prefixes ?? []).includes(originPrefix));
    const pool = specific.length ? specific : entries;
    const prices = pool.map((e) => Number(e.current_price)).filter((p) => Number.isFinite(p));
    return prices.length ? Math.min(...prices) : null;
  };
  return {
    mobile: pick(usable.filter((e) => isMobile(e) && !isSpecial(e))),
    landline: pick(usable.filter((e) => !isMobile(e) && !isSpecial(e))),
    inbound: Number(pricing.inbound_call_prices?.[0]?.current_price ?? NaN) || null,
    unit: pricing.price_unit ?? "USD",
  };
}

const sameNumber = (a, b) => digitsOf(a) !== "" && digitsOf(a) === digitsOf(b);

// Twilio-Legs zu Gesprächen zusammenfassen: Gegenseite + Zeitpunkt + Dauer + Summe beider Legs.
export function groupCalls(
  calls,
  {
    twilioNumber,
    ownerNumber,
    peerCallerId,
    mediaStreamRate = 0.0044,
    openaiRatePerMin = 0.068,
    // Vorläufiger Preis eines Legs, das Twilio noch nicht abgerechnet hat (null = 0)
    estimate = null,
  },
) {
  const legs = calls
    .map((c) => ({
      ...c,
      at: Date.parse(c.date_created),
      // Twilio setzt den Preis erst einige Minuten nach Gesprächsende – bis dahin Schätzung nach Tarif
      price: c.price == null ? (estimate?.(c) ?? 0) : Math.abs(Number(c.price) || 0),
      unpriced: c.price == null && Number(c.duration) > 0,
    }))
    .sort((a, b) => b.at - a.at);
  const isAppLeg = (c) => String(c.from ?? "").startsWith("client:") || String(c.to ?? "").startsWith("client:");
  const ownerLegs = legs.filter(
    (c) => (sameNumber(c.to, ownerNumber) && sameNumber(c.from, twilioNumber)) || isAppLeg(c),
  );
  const used = new Set();
  const result = [];
  for (const leg of legs) {
    let direction = null;
    let number = null;
    if (sameNumber(leg.to, twilioNumber) && !sameNumber(leg.from, ownerNumber) && leg.direction === "inbound") {
      direction = "in";
      number = leg.from;
    } else if (
      sameNumber(leg.from, peerCallerId) &&
      !sameNumber(leg.to, ownerNumber) &&
      !sameNumber(leg.to, twilioNumber) &&
      leg.direction.startsWith("outbound")
    ) {
      direction = "out";
      number = leg.to;
    }
    if (!direction || !/^\+?\d+$/.test(String(number))) continue;
    let price = leg.price;
    let ownerSeconds = null;
    let pricePending = leg.unpriced;
    let viaApp = false;
    for (const owner of ownerLegs) {
      if (used.has(owner.sid) || Math.abs(owner.at - leg.at) > GROUP_WINDOW_MS) continue;
      used.add(owner.sid);
      price += owner.price;
      ownerSeconds = Number(owner.duration) || 0;
      pricePending ||= owner.unpriced;
      viaApp = isAppLeg(owner);
      break;
    }
    const peerSeconds = Number(leg.duration) || 0;
    // Übersetzt: ausgehend per REST angerufen (outbound-api); "Без перевода" läuft über <Dial>
    // (outbound-dial). Eingehend nur, wenn der Inhaber den Rückruf angenommen hat.
    const translated =
      direction === "out" ? leg.direction === "outbound-api" : (ownerSeconds ?? 0) > 0;
    const talkSeconds = ownerSeconds == null ? peerSeconds : Math.min(peerSeconds, ownerSeconds);
    // Twilio rechnet Media Streams je angefangene Minute und Stream; OpenAI nach Sprechzeit
    const media = translated
      ? (Math.ceil(peerSeconds / 60) + Math.ceil((ownerSeconds ?? 0) / 60)) * mediaStreamRate
      : 0;
    const openai = translated ? (talkSeconds / 60) * openaiRatePerMin : 0;
    result.push({
      id: leg.sid,
      direction,
      number,
      startedAt: leg.start_time ? new Date(leg.start_time).toISOString() : new Date(leg.at).toISOString(),
      duration: Number(leg.duration) || 0,
      status: leg.status,
      price: round4(price),
      unit: leg.price_unit || "USD",
      translated,
      talkSeconds,
      mediaPrice: round4(media),
      openaiPrice: round4(openai),
      totalPrice: round4(price + media + openai),
      pricePending,
      viaApp,
    });
  }
  return result;
}

export function createApiRoutes({ config, twilioApi, log = console }) {
  const originPrefix = digitsOf(config.twilioNumber).slice(0, 2); // "49"
  const mediaRate = config.mediaStreamRate;
  const allowedCountries = config.allowedPrefixes
    .map((p) => ({ "+49": "DE", "+420": "CZ", "+43": "AT", "+41": "CH", "+1": "US", "+380": "UA" })[p])
    .filter(Boolean);

  const ownerRate = async () => {
    const owner = await twilioApi.country("DE");
    return rateForNumber(owner, config.ownerNumber, originPrefix)?.price ?? 0.042;
  };
  // Minutenpreis eines übersetzten Gesprächs auf der Twilio-Seite: beide Legs + zwei Media Streams
  // Inhaber-Leg über die App (Twilio Voice SDK) statt Rückruf aufs Handy
  const appRate = config.clientRate ?? 0.004;
  const perMinute = (peerRate, owner, translated = true) =>
    Math.round((owner + peerRate + (translated ? 2 * mediaRate : 0)) * 10000) / 10000;
  const minutes = (balance, rate) => (rate > 0 ? Math.floor(balance / rate) : null);

  return {
    "/api/account": async () => {
      const [{ balance, currency }, owner, de] = await Promise.all([
        twilioApi.balance(),
        ownerRate(),
        twilioApi.country("DE"),
      ]);
      const deMobile = summarizeCountry(de, originPrefix).mobile ?? 0.042;
      const typical = perMinute(deMobile, owner);
      const typicalApp = perMinute(deMobile, appRate);
      return {
        balance: Number(balance),
        minutesLeft: minutes(Number(balance), typical),
        typicalPerMinute: typical,
        appMinutesLeft: minutes(Number(balance), typicalApp),
        appPerMinute: typicalApp,
        voip: Boolean(config.apiKey && config.apiSecret && config.twimlAppSid),
        currency,
        ownerLegPerMinute: owner,
        mediaStreamPerMinute: mediaRate,
        openaiPerMinute: config.openaiRatePerMin,
        allowedCountries,
        translatorNumber: config.twilioNumber,
      };
    },
    "/api/countries": async () => ({ countries: await twilioApi.countries(), allowed: allowedCountries }),
    "/api/rates": async (query) => {
      const iso = String(query.get("country") ?? "DE").toUpperCase().slice(0, 2);
      const [pricing, { balance }, owner] = await Promise.all([
        twilioApi.country(iso),
        twilioApi.balance(),
        ownerRate(),
      ]);
      const summary = summarizeCountry(pricing, originPrefix);
      const money = Number(balance);
      const row = (rate) =>
        rate == null
          ? null
          : { legPerMinute: rate, perMinute: perMinute(rate, owner), minutes: minutes(money, perMinute(rate, owner)),
              plainPerMinute: perMinute(rate, owner, false), plainMinutes: minutes(money, perMinute(rate, owner, false)) };
      return {
        iso,
        country: pricing.country,
        unit: summary.unit,
        balance: money,
        allowed: allowedCountries.includes(iso),
        mobile: row(summary.mobile),
        landline: row(summary.landline),
        // Eingehend: Anrufer landet auf der Dolmetscher-Nummer (Inbound-Preis) + Rückruf an den Inhaber
        incoming: summary.inbound == null ? null : row(summary.inbound),
        openaiPerMinute: config.openaiRatePerMin,
      };
    },
    "/api/quote": async (query) => {
      const number = toE164(query.get("number"));
      if (!number) return { number: null, allowed: false, reason: "format", found: false };
      const prefix = Object.keys(PREFIX_COUNTRY)
        .sort((a, b) => b.length - a.length)
        .find((p) => number.startsWith(p));
      const reason = dialProblem(number, config.allowedPrefixes);
      const allowed = reason === null;
      if (!prefix) return { number, allowed: false, reason: reason ?? "country", found: false };
      const [pricing, { balance }, owner] = await Promise.all([
        twilioApi.country(PREFIX_COUNTRY[prefix]),
        twilioApi.balance(),
        ownerRate(),
      ]);
      const match = rateForNumber(pricing, number, originPrefix);
      if (!match) return { number, allowed, reason, found: false };
      const rate = perMinute(match.price, owner);
      const plain = perMinute(match.price, owner, false);
      const viaApp = perMinute(match.price, appRate);
      const viaAppPlain = perMinute(match.price, appRate, false);
      return {
        app: {
          perMinute: viaApp,
          minutes: minutes(Number(balance), viaApp),
          plainPerMinute: viaAppPlain,
          plainMinutes: minutes(Number(balance), viaAppPlain),
        },
        number,
        iso: PREFIX_COUNTRY[prefix],
        allowed,
        reason,
        found: true,
        mobile: /mobile/i.test(match.name),
        legPerMinute: match.price,
        perMinute: rate,
        minutes: minutes(Number(balance), rate),
        plainPerMinute: plain,
        plainMinutes: minutes(Number(balance), plain),
        openaiPerMinute: config.openaiRatePerMin,
        unit: pricing.price_unit ?? "USD",
      };
    },
    "/api/calls": async () => {
      const [{ calls }, de, cz, owner] = await Promise.all([
        twilioApi.calls(100),
        twilioApi.country("DE"),
        twilioApi.country("CZ"),
        ownerRate(),
      ]);
      const inbound = summarizeCountry(de, originPrefix).inbound ?? 0.01;
      // Twilio rechnet je angefangene Minute
      const estimate = (leg) => {
        const minutes = Math.ceil((Number(leg.duration) || 0) / 60);
        if (String(leg.from ?? "").startsWith("client:") || String(leg.to ?? "").startsWith("client:")) {
          return minutes * appRate;
        }
        if (leg.direction === "inbound") return minutes * inbound;
        if (sameNumber(leg.to, config.ownerNumber)) return minutes * owner;
        const pricing = digitsOf(leg.to).startsWith("420") ? cz : de;
        return minutes * (rateForNumber(pricing, leg.to, originPrefix)?.price ?? 0);
      };
      return {
        calls: groupCalls(calls, {
          ...config,
          mediaStreamRate: mediaRate,
          openaiRatePerMin: config.openaiRatePerMin,
          estimate,
        }),
      };
    },
  };
}
