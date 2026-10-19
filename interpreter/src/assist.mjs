// Hilfen im Gespräch: getippten Text auf Deutsch sprechen und in der Warteschleife erkennen,
// wann ein Mensch abnimmt. Audio und Text werden nur verarbeitet, nicht gespeichert.
import { attenuateMulaw, mulawToPcm16, realtimeToTwilio, twilioToRealtime } from "./audio.mjs";
import { compressPauses } from "./clips.mjs";

const OPENAI = "https://api.openai.com/v1";

export function createAssist({
  apiKey,
  textModel = "gpt-5.4-mini",
  sttModel = "gpt-4o-mini-transcribe",
  ttsModel = "gpt-4o-mini-tts",
  voice = "cedar",
  fetchImpl = fetch,
}) {
  const headers = { Authorization: `Bearer ${apiKey}` };

  async function chat(system, user) {
    const res = await fetchImpl(`${OPENAI}/chat/completions`, {
      signal: AbortSignal.timeout(10000),
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: textModel,
        reasoning_effort: "none",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Text ${res.status}`);
    return ((await res.json()).choices?.[0]?.message?.content ?? "").trim();
  }

  return {
    // Getippter Text des Inhabers (meist Russisch) -> gesprochenes Deutsch. Nummern, Aktenzeichen,
    // IBAN usw. Ziffer für Ziffer, damit sie am Telefon eindeutig ankommen.
    toGerman: (text) =>
      chat(
        "Du formulierst für ein Telefonat, was der Anrufer sagen will, als gesprochenen deutschen Satz. " +
          "Ist der Text nicht Deutsch, übersetze ihn treu ins Deutsche; ist er schon Deutsch, übernimm ihn. " +
          "Nummern, Kundennummern, Aktenzeichen, Steuer-ID, IBAN, Telefonnummern und Postleitzahlen schreibst " +
          "du Ziffer für Ziffer mit Leerzeichen (z. B. 1 2 3 4), Buchstaben darin einzeln (z. B. D E), " +
          "Trennzeichen als Wort (Punkt, Strich, Schrägstrich), z. B. 'Aktenzeichen 5 2 1 2 Punkt 9 8 7'. " +
          "Achte auf korrektes Deutsch (Artikel, Endungen: 'Meine Kundennummer ist …'). " +
          "Daten, Uhrzeiten, Beträge und Mengen dagegen NICHT in Ziffern zerlegen, sondern als Wörter " +
          "ausschreiben (z. B. 'am einundzwanzigsten Oktober um zehn Uhr dreißig', 'fünfzig Euro'). " +
          "Nichts hinzufügen, nichts erklären. Gib nur den Satz aus.",
        text,
      ),

    async speak(text) {
      // Hängt die Sprachausgabe, nach 8 s ein zweiter Versuch
      for (let attempt = 1; ; attempt += 1) {
        try {
          const res = await fetchImpl(`${OPENAI}/audio/speech`, {
            signal: AbortSignal.timeout(8000),
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ model: ttsModel, voice, input: text, response_format: "pcm" }),
          });
          if (!res.ok) throw new Error(`TTS ${res.status}`);
          const pcm = compressPauses(Buffer.from(await res.arrayBuffer()));
          return realtimeToTwilio(pcm.toString("base64"));
        } catch (error) {
          if (attempt >= 2) throw error;
        }
      }
    },

    async transcribe(pcm24k) {
      const form = new FormData();
      form.append("file", new Blob([wav(pcm24k)], { type: "audio/wav" }), "hold.wav");
      form.append("model", sttModel);
      form.append("language", "de");
      const res = await fetchImpl(`${OPENAI}/audio/transcriptions`, {
        method: "POST",
        headers,
        body: form,
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`STT ${res.status}`);
      return ((await res.json()).text ?? "").trim();
    },

    // Hat ein Mensch abgenommen? Bandansagen wiederholen sich und sagen "bitte warten",
    // ein Mensch meldet sich mit Namen/Abteilung und fragt nach dem Anliegen.
    async isHuman(latest, earlier) {
      const answer = await chat(
        "Du hörst eine Telefon-Warteschleife ab. Entscheide, ob im LETZTEN Abschnitt ein echter Mensch " +
          "das Gespräch angenommen hat (meldet sich z. B. mit Firma oder Namen, 'Was kann ich für Sie tun?', " +
          "'Hallo?', spricht den Anrufer direkt an). Bandansagen ('Bitte haben Sie etwas Geduld', 'Alle " +
          "Mitarbeiter sind im Gespräch', 'Sie werden gleich verbunden', Menüs 'Drücken Sie 1'), Musik, " +
          "Liedtexte, sich wiederholende Ansagen und typische Fehlerkennungen wie 'Untertitel im Auftrag des " +
          "ZDF' oder 'Vielen Dank fürs Zuschauen' sind KEIN Mensch. Antworte nur mit ja oder nein.",
        `Frühere Abschnitte:\n${earlier.map((t) => `- ${t}`).join("\n") || "(keine)"}\n\nLetzter Abschnitt:\n${latest}`,
      );
      return /^ja\b/i.test(answer.trim());
    },
  };
}

function wav(pcm) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(24000, 24);
  header.writeUInt32LE(48000, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

const muRms = (payload) => {
  const b = Buffer.from(payload, "base64");
  let sum = 0;
  for (let i = 0; i < b.length; i += 2) {
    const v = mulawToPcm16(b[i]);
    sum += v * v;
  }
  return Math.sqrt(sum / Math.max(1, b.length / 2));
};

// Warteschleife abhören: Gegenseite in Abschnitte schneiden (Pause oder höchstens 8 s, Musik ist
// durchgehend laut), jeden Abschnitt erkennen und prüfen lassen. Läuft schon eine Prüfung, zählt
// nur der neueste Abschnitt – so hinkt die Erkennung nie hinterher.
const SPEECH_RMS = 400;
const END_SILENCE_MS = 700;
const MAX_SEGMENT_MS = 8000;
const MIN_SPEECH_MS = 600;

export function createHoldWatcher({ assist, onHuman, onText = () => {}, log = console, label = "" }) {
  let segment = [];
  let speechMs = 0;
  let silenceMs = 0;
  let busy = false;
  let pending = null;
  let closed = false;
  const history = [];

  async function check(chunks) {
    busy = true;
    try {
      const pcm = Buffer.concat(chunks.map((c) => Buffer.from(twilioToRealtime(c), "base64")));
      const text = await assist.transcribe(pcm);
      if (closed || !text) return;
      onText(text);
      const human = await assist.isHuman(text, history.slice(-4));
      history.push(text);
      log.info(`[wait${label}] ${human ? "MENSCH" : "Band"}: ${text.slice(0, 120)}`);
      if (human && !closed) {
        closed = true;
        onHuman(text);
      }
    } catch (error) {
      log.error(`[wait${label}]`, error.message);
    } finally {
      busy = false;
      if (pending && !closed) {
        const next = pending;
        pending = null;
        check(next);
      }
    }
  }

  function finish() {
    const chunks = segment;
    const spoken = speechMs;
    segment = [];
    speechMs = 0;
    silenceMs = 0;
    if (spoken < MIN_SPEECH_MS || closed) return;
    if (busy) pending = chunks;
    else check(chunks);
  }

  return {
    push(payload) {
      if (closed) return;
      const ms = Buffer.from(payload, "base64").length / 8;
      const loud = muRms(payload) > SPEECH_RMS;
      if (segment.length === 0 && !loud) return;
      segment.push(payload);
      if (loud) {
        speechMs += ms;
        silenceMs = 0;
      } else {
        silenceMs += ms;
      }
      if (silenceMs >= END_SILENCE_MS || segment.length * ms >= MAX_SEGMENT_MS) finish();
    },
    close() {
      closed = true;
    },
  };
}

export const WAIT_PASSTHROUGH_GAIN = 0.5;
export { attenuateMulaw };
