// Zweiter Übersetzungsweg (konsekutiv): Sprechpause erkennen -> Text erkennen -> Text übersetzen
// -> vorlesen. Langsamer als gpt-realtime-translate, aber der Text wird wörtlich übersetzt.
// Gleiche Schnittstelle wie createTranslator: send(base64 PCM16 24 kHz), close().
const RATE = 24000;
const SPEECH_RMS = 500; // Schwelle für Sprache
// Stille, die eine Äußerung beendet: je länger schon gesprochen wird, desto kürzer darf die
// Pause sein – so wird an Satzgrenzen geschnitten und nicht erst am Zeitlimit mitten im Wort.
const endSilenceMs = (totalMs) => (totalMs < 4000 ? 600 : totalMs < 9000 ? 300 : 200);
const MIN_SPEECH_MS = 300;
const MAX_SEGMENT_MS = 15000;
const PREROLL_MS = 300;

const LANGUAGE_NAMES = { de: "Deutsch", ru: "Russisch" };

function rms(buffer) {
  let sum = 0;
  const samples = Math.floor(buffer.length / 2);
  for (let i = 0; i < samples; i += 1) {
    const value = buffer.readInt16LE(i * 2);
    sum += value * value;
  }
  return samples ? Math.sqrt(sum / samples) : 0;
}

function wav(pcm) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

export function createSequentialTranslator({
  apiKey,
  sourceLanguage,
  targetLanguage,
  label,
  onAudio,
  onTranscript = null,
  sttModel = "gpt-4o-transcribe",
  textModel = "gpt-5.4-mini",
  ttsModel = "gpt-4o-mini-tts",
  voice = "cedar",
  log = console,
  fetchImpl = fetch,
}) {
  const headers = { Authorization: `Bearer ${apiKey}` };
  let closed = false;
  let segment = []; // Chunks der laufenden Äußerung
  let preroll = [];
  let speechMs = 0;
  let silenceMs = 0;
  let queue = Promise.resolve();

  async function transcribe(pcm) {
    const form = new FormData();
    form.append("file", new Blob([wav(pcm)], { type: "audio/wav" }), "speech.wav");
    form.append("model", sttModel);
    form.append("language", sourceLanguage);
    const res = await fetchImpl("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers,
      body: form,
    });
    if (!res.ok) throw new Error(`STT ${res.status}`);
    return ((await res.json()).text ?? "").trim();
  }

  async function translate(text) {
    const res = await fetchImpl("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: textModel,
        reasoning_effort: "none",
        messages: [
          {
            role: "system",
            content:
              `Du bist Dolmetscher in einem Telefongespräch. Übersetze die Äußerung aus dem ` +
              `${LANGUAGE_NAMES[sourceLanguage]}en treu und vollständig ins ${LANGUAGE_NAMES[targetLanguage]}e. ` +
              "Zahlen, Uhrzeiten, Daten, Namen und Wochentage exakt übernehmen. Nichts hinzufügen, " +
              "nichts weglassen, nichts erklären, keine Wörter unübersetzt lassen. Gib nur die " +
              "Übersetzung aus.",
          },
          { role: "user", content: text },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Übersetzung ${res.status}`);
    return ((await res.json()).choices?.[0]?.message?.content ?? "").trim();
  }

  async function speak(text) {
    const res = await fetchImpl("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ model: ttsModel, voice, input: text, response_format: "pcm" }),
    });
    if (!res.ok) throw new Error(`TTS ${res.status}`);
    let rest = Buffer.alloc(0);
    for await (const chunk of res.body) {
      if (closed) return;
      const data = Buffer.concat([rest, Buffer.from(chunk)]);
      const usable = data.length - (data.length % 2);
      rest = data.subarray(usable);
      if (usable > 0) onAudio(data.subarray(0, usable).toString("base64"));
    }
  }

  function finishSegment() {
    const pcm = Buffer.concat(segment);
    const spoken = speechMs;
    segment = [];
    speechMs = 0;
    silenceMs = 0;
    if (spoken < MIN_SPEECH_MS) return;
    queue = queue
      .then(async () => {
        if (closed) return;
        const started = Date.now();
        const text = await transcribe(pcm);
        if (!text || closed) return;
        onTranscript?.("in", text + " ");
        const afterStt = Date.now();
        const translated = await translate(text);
        if (!translated || closed) return;
        onTranscript?.("out", translated + " ");
        const afterText = Date.now();
        await speak(translated);
        log.info(
          `[seq:${label}] stt ${afterStt - started} ms, text ${afterText - afterStt} ms, tts ${Date.now() - afterText} ms`,
        );
      })
      .catch((error) => log.error(`[seq:${label}]`, error.message));
  }

  return {
    send(base64) {
      if (closed) return;
      const chunk = Buffer.from(base64, "base64");
      const ms = chunk.length / 2 / (RATE / 1000);
      const loud = rms(chunk) > SPEECH_RMS;
      if (segment.length === 0) {
        if (!loud) {
          preroll.push(chunk);
          while (preroll.length * ms > PREROLL_MS) preroll.shift();
          return;
        }
        segment = [...preroll];
        preroll = [];
      }
      segment.push(chunk);
      if (loud) {
        speechMs += ms;
        silenceMs = 0;
      } else {
        silenceMs += ms;
      }
      const totalMs = segment.length * ms;
      if (silenceMs >= endSilenceMs(totalMs) || totalMs >= MAX_SEGMENT_MS) finishSegment();
    },
    close() {
      closed = true;
    },
  };
}
