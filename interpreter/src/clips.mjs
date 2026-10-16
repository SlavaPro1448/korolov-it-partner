// Kurze Sprachhinweise, die der Server selbst in einen Media Stream spielt (statt Twilio <Say>):
// einmal per OpenAI TTS erzeugt, als μ-law 8 kHz im Speicher gehalten.
import { realtimeToTwilio } from "./audio.mjs";

export const CLIP_TEXT = {
  ownerNoAnswer: "Собеседник не ответил.",
  peerWait: "Einen Moment bitte, Sie werden gleich verbunden.",
  modeLive: "Синхронный перевод.",
  modeSeq: "Перевод по фразам.",
  modeDirect: "Ваш голос напрямую, без перевода.",
  peerNotice:
    "Guten Tag. Hinweis: Dieses Gespräch wird live von einem KI-Dolmetscher übersetzt und " +
    "nicht aufgezeichnet. Bitte warten Sie nach jedem Satz einen Moment auf die Übersetzung.",
};

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
    const pcm = Buffer.from(await res.arrayBuffer());
    // 300 ms Stille davor, damit der Anfang nicht verschluckt wird
    return realtimeToTwilio(Buffer.concat([Buffer.alloc(24000 * 2 * 0.3), pcm]).toString("base64"));
  }

  return {
    // Alle Hinweise beim Start erzeugen; schlägt es fehl, bleibt der Fallback über <Say>
    async warmup() {
      for (const [key, text] of Object.entries(CLIP_TEXT)) {
        try {
          cache.set(key, await synthesize(text));
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
