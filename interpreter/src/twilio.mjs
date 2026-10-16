// Twilio: Signaturprüfung der Webhooks, REST-Aufrufe (ohne SDK) und TwiML-Bausteine.
import crypto from "node:crypto";

export function verifyTwilioSignature({ authToken, url, params = {}, signature }) {
  if (!authToken || !signature || !url) return false;
  const data =
    url +
    Object.keys(params)
      .sort()
      .map((key) => key + params[key])
      .join("");
  const expected = crypto.createHmac("sha1", authToken).update(data).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function createTwilioClient({ accountSid, authToken, fetchImpl = fetch }) {
  const base = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls`;
  const auth = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  async function post(url, params) {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params).toString(),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Twilio ${response.status}: ${body.message ?? "unbekannter Fehler"}`);
    }
    return body;
  }

  return {
    createCall: ({ to, from, url, statusCallback, timeout = 25, timeLimit }) =>
      post(`${base}.json`, {
        To: to,
        From: from,
        Url: url,
        StatusCallback: statusCallback,
        Timeout: String(timeout),
        ...(timeLimit ? { TimeLimit: String(timeLimit) } : {}),
      }),
    updateCall: (callSid, twiml) => post(`${base}/${callSid}.json`, { Twiml: twiml }),
    hangup: (callSid) => post(`${base}/${callSid}.json`, { Status: "completed" }),
  };
}

// Ziffern vom Tastenfeld -> E.164. Nur deutsche Schreibweise (0…) und 00-Auslandsvorwahl.
export function normalizeDialedNumber(digits) {
  const clean = String(digits ?? "").replace(/\D/g, "");
  if (clean.length < 5 || clean.length > 16) return null;
  if (clean.startsWith("00")) return "+" + clean.slice(2);
  if (clean.startsWith("0")) return "+49" + clean.slice(1);
  return null;
}

// Plausible Länge: deutsche Rufnummern haben national 5 bis 11 Ziffern, andere Länder bis 12.
export function hasPlausibleLength(e164) {
  const digits = String(e164 ?? "").replace(/\D/g, "");
  if (digits.startsWith("49")) return digits.length >= 7 && digits.length <= 13;
  return digits.length >= 8 && digits.length <= 15;
}

// Sonderrufnummern mit Zusatzkosten bleiben gesperrt.
// DE: 0900, 0137, 0180, 118xx, 019x. CZ: 900/906/909 (Premium), 976 (Audiotext).
const BLOCKED_PREFIXES = [
  "+49900",
  "+49137",
  "+49180",
  "+49118",
  "+4919",
  "+420900",
  "+420906",
  "+420909",
  "+420976",
];

export function isDialAllowed(number, allowedPrefixes) {
  if (!number || BLOCKED_PREFIXES.some((prefix) => number.startsWith(prefix))) return false;
  return allowedPrefixes.some((prefix) => number.startsWith(prefix));
}

export const samePhone = (a, b) =>
  Boolean(a) && String(a).replace(/[^\d+]/g, "") === String(b ?? "").replace(/[^\d+]/g, "");

const xml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const response = (...verbs) =>
  `<?xml version="1.0" encoding="UTF-8"?><Response>${verbs.join("")}</Response>`;
const say = (language, text) => `<Say language="${language}">${xml(text)}</Say>`;
const stream = (wsUrl, token) =>
  `<Connect><Stream url="${xml(wsUrl)}"><Parameter name="token" value="${xml(token)}"/></Stream></Connect>`;

export const TEXT = {
  ownerPrompt: "Переводчик. Наберите номер и нажмите решётку.",
  ownerBadNumber: "Этот номер набрать нельзя.",
  ownerConnecting: "Соединяю.",
  ownerJoined: "Переводчик подключён.",
  ownerEnded: "Соединение завершено.",
  ownerBusy: "Переводчик сейчас занят другим разговором.",
  peerIncoming:
    "Guten Tag. Einen Moment bitte, ich verbinde Sie mit Herrn Korolov. " +
    "Das Gespräch wird von einem KI-Dolmetscher live übersetzt und nicht aufgezeichnet.",
  peerOutgoing:
    "Guten Tag. Dieser Anruf wird von einem KI-Dolmetscher live übersetzt und nicht " +
    "aufgezeichnet. Einen Moment bitte.",
  peerUnavailable:
    "Herr Korolov ist gerade nicht erreichbar. Bitte versuchen Sie es später noch einmal. " +
    "Auf Wiederhören.",
};

export const twiml = {
  reject: () => response('<Reject reason="busy"/>'),
  dialSip: (sipUri) => response(`<Dial answerOnBridge="true"><Sip>${xml(sipUri)}</Sip></Dial>`),
  // Inhaber hat abgehoben: Zielnummer direkt anwählen (ohne Übersetzung)
  ownerDial: (number, callerId, action, timeLimit) =>
    response(
      say("ru-RU", TEXT.ownerConnecting),
      `<Dial callerId="${xml(callerId)}" answerOnBridge="true" timeLimit="${timeLimit}" action="${xml(action)}" method="POST">` +
        `<Number>${xml(number)}</Number></Dial>`,
      say("ru-RU", TEXT.ownerEnded),
    ),
  ownerPrompt: (action) =>
    response(
      `<Gather input="dtmf" finishOnKey="#" timeout="10" action="${xml(action)}" method="POST">` +
        say("ru-RU", TEXT.ownerPrompt) +
        "</Gather>",
      "<Hangup/>",
    ),
  ownerMessage: (text) => response(say("ru-RU", text), "<Hangup/>"),
  ownerStream: (wsUrl, token, intro) =>
    response(say("ru-RU", intro), stream(wsUrl, token), say("ru-RU", TEXT.ownerEnded)),
  peerStream: (wsUrl, token, intro) => response(say("de-DE", intro), stream(wsUrl, token)),
  // Stream sofort; die Ansage spielt der Server selbst hinein (so hört die Übersetzung von
  // Anfang an mit, auch wenn eine Warteschleife oder ein Sprachmenü spricht)
  peerStreamFirst: (wsUrl, token) => response(stream(wsUrl, token)),
  // Taste senden und den Stream der Gegenseite sofort wieder aufbauen
  peerDigit: (digit, wsUrl, token) =>
    response(`<Play digits="${xml(digit)}"/>`, stream(wsUrl, token)),
  // Anrufer an den Telefonassistenten übergeben oder mit kurzer Ansage verabschieden
  peerFallback: (secretaryNumber) =>
    secretaryNumber
      ? response(`<Dial><Number>${xml(secretaryNumber)}</Number></Dial>`)
      : response(say("de-DE", TEXT.peerUnavailable), "<Hangup/>"),
};
