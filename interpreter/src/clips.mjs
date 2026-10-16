// Kurze Sprachhinweise, die der Server selbst in einen Media Stream spielt (statt Twilio <Say>):
// einmal per OpenAI TTS erzeugt, als μ-law 8 kHz im Speicher gehalten.
import { realtimeToTwilio } from "./audio.mjs";
import { PHRASES, phraseClipKey } from "./phrases.mjs";

export const CLIP_TEXT = {
  ownerNoAnswer: "Собеседник не ответил.",
  peerWait: "Einen Moment bitte, Sie werden gleich verbunden.",
  ownerReady: "Можно говорить.",
  ownerHuman: "Ответил человек! Сейчас ему скажут про переводчика.",
  ownerWait: "Жду за вас. Позову, когда ответит человек.",
  modeLive: "Синхронный перевод.",
  modeSeq: "Перевод по фразам.",
  modeDirect: "Ваш голос напрямую, без перевода.",
  // Kurz halten: der Inhaber wartet, bis die Ansage vorbei ist (~5 s statt früher ~11 s).
  // Pflichtangaben: KI übersetzt (AI Act Art. 50), keine Aufzeichnung, nach jedem Satz warten.
  peerNotice: "Hallo, hier übersetzt eine KI, ohne Aufzeichnung. Bitte nach jedem Satz kurz warten.",
};

// Lange Pausen der Sprachausgabe (PCM16 24 kHz) auf höchstens maxPauseMs kürzen; Sprache bleibt
// unverändert. Spart bei der Ansage rund eine Sekunde.
export function compressPauses(pcm, { maxPauseMs = 200, threshold = 300 } = {}) {
  const samples = Math.floor(pcm.length / 2);
  const window = 240; // 10 ms
  const maxQuiet = (24000 * maxPauseMs) / 1000;
  const parts = [];
  let quiet = 0;
  for (let i = 0; i < samples; i += window) {
    const end = Math.min(samples, i + window);
    let sum = 0;
    for (let j = i; j < end; j += 1) {
      const v = pcm.readInt16LE(j * 2);
      sum += v * v;
    }
    const loud = Math.sqrt(sum / (end - i)) > threshold;
    quiet = loud ? 0 : quiet + (end - i);
    if (loud || quiet <= maxQuiet) parts.push(pcm.subarray(i * 2, end * 2));
  }
  return Buffer.concat(parts);
}

// Schnellsätze werden mit den übrigen Hinweisen vertont
for (const phrase of PHRASES) CLIP_TEXT[phraseClipKey(phrase.key)] = phrase.de;

export function createClips({
  apiKey,
  voice = "cedar",
  model = "gpt-4o-mini-tts",
  log = console,
  fetchImpl = fetch,
}) {
  const cache = new Map();

  async function synthesize(text) {
    const res = await fetchImpl("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, voice, input: text, response_format: "pcm" }),
    });
    if (!res.ok) throw new Error(`TTS ${res.status}`);
    const pcm = compressPauses(Buffer.from(await res.arrayBuffer()));
    // 300 ms Stille davor, damit der Anfang nicht verschluckt wird
    return realtimeToTwilio(Buffer.concat([Buffer.alloc(24000 * 2 * 0.3), pcm]).toString("base64"));
  }

  return {
    // Alle Hinweise beim Start erzeugen; schlägt es fehl, bleibt der Fallback über <Say>
    async warmup() {
      for (const [key, text] of Object.entries(CLIP_TEXT)) {
        try {
          const clip = await synthesize(text);
          cache.set(key, clip);
          log.info?.(`[clips] ${key}: ${(Buffer.from(clip, "base64").length / 8000).toFixed(1)} s`);
        } catch (error) {
          log.error(`[clips] ${key}: ${error.message}`);
        }
      }
      return cache.size === Object.keys(CLIP_TEXT).length;
    },
    get(key) {
      return cache.get(key) ?? null;
    },
  };
}
