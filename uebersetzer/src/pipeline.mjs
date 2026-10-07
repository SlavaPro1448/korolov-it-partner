// Konvейер: пауза в речи -> распознавание (язык любой) -> определение языка + перевод текстом
// -> озвучка перевода. Аудио нигде не сохраняется, текст в лог не пишется (только тайминги).
const RATE = 24000;
const endSilenceMs = (totalMs) => (totalMs < 4000 ? 600 : totalMs < 9000 ? 350 : 250);
const MIN_SPEECH_MS = 400;
const MAX_SEGMENT_MS = 12000;
const PREROLL_MS = 300;
const CONTEXT_PHRASES = 3;

const LANG_NAMES = { de: "Deutsch", ru: "Russisch" };

const STT_PROMPT =
  "Gottesdienst der Gemeinde Leverkusen: Predigt, Gebet, Bibel, Jesus Christus, Evangelium, Gemeinde. " +
  "Церковное собрание: проповедь, молитва, Библия, Иисус Христос, Евангелие, церковь, братья и сёстры.";

export function rms(buffer) {
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

export function createPipeline({
  apiKey,
  sttModel = "gpt-4o-transcribe",
  textModel = "gpt-5.4-mini",
  ttsModel = "gpt-4o-mini-tts",
  voices = { ru: "cedar", de: "marin" },
  getThreshold = () => 500,
  onPhrase, // ({id, src, srcText, dst, dstText})
  onAudio, // (id, dst, mp3Buffer)
  onError = () => {},
  log = console,
  fetchImpl = fetch,
}) {
  const headers = { Authorization: `Bearer ${apiKey}` };
  let closed = false;
  let paused = false;
  let segment = [];
  let preroll = [];
  let speechMs = 0;
  let silenceMs = 0;
  let textQueue = Promise.resolve();
  let audioQueue = Promise.resolve();
  let nextId = 1;
  const context = []; // последние оригиналы для контекста перевода
  const stats = { sttSeconds: 0, phrases: 0, ttsChars: 0, inTokens: 0, outTokens: 0 };

  async function transcribe(pcm) {
    const form = new FormData();
    form.append("file", new Blob([wav(pcm)], { type: "audio/wav" }), "speech.wav");
    form.append("model", sttModel);
    form.append("prompt", STT_PROMPT);
    const res = await fetchImpl("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers,
      body: form,
    });
    if (!res.ok) throw new Error(`STT ${res.status}`);
    return ((await res.json()).text ?? "").trim();
  }

  async function detectAndTranslate(text) {
    const res = await fetchImpl("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: textModel,
        reasoning_effort: "none",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "translation",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["lang", "translation"],
              properties: {
                lang: { type: "string", enum: ["ru", "de", "other"] },
                translation: { type: "string" },
              },
            },
          },
        },
        messages: [
          {
            role: "system",
            content:
              "Du bist Simultandolmetscher in einem christlichen Gottesdienst (Gemeinde Leverkusen). " +
              "Im Saal wird abwechselnd Russisch und Deutsch gesprochen. Du bekommst eine erkannte Äußerung. " +
              "Bestimme ihre Sprache (ru oder de; wenn sie weder Russisch noch Deutsch ist oder nur Geräusch/Gesang " +
              "ohne Sinn, dann other und leere Übersetzung). Übersetze Russisch ins Deutsche und Deutsch ins " +
              "Russische: treu, vollständig, natürlich, im Stil einer Predigt. Bibelstellen, Namen, Zahlen exakt. " +
              "Nichts hinzufügen, nichts erklären. Vorherige Äußerungen dienen nur als Kontext und werden nicht übersetzt.",
          },
          ...(context.length
            ? [{ role: "user", content: `Kontext (nicht übersetzen):\n${context.join("\n")}` }]
            : []),
          { role: "user", content: `Äußerung:\n${text}` },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Übersetzung ${res.status}`);
    const data = await res.json();
    stats.inTokens += data.usage?.prompt_tokens ?? 0;
    stats.outTokens += data.usage?.completion_tokens ?? 0;
    const content = data.choices?.[0]?.message?.content ?? "{}";
    try {
      const parsed = JSON.parse(content);
      return { lang: parsed.lang, translation: (parsed.translation ?? "").trim() };
    } catch {
      return { lang: "other", translation: "" };
    }
  }

  async function speak(text, lang) {
    const res = await fetchImpl("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ttsModel,
        voice: voices[lang] ?? "cedar",
        input: text,
        response_format: "mp3",
        instructions:
          lang === "ru"
            ? "Говори спокойно, ясно и тепло, как переводчик проповеди в церкви. Без спешки."
            : "Sprich ruhig, klar und warm, wie ein Dolmetscher einer Predigt in der Kirche. Ohne Hast.",
      }),
    });
    if (!res.ok) throw new Error(`TTS ${res.status}`);
    stats.ttsChars += text.length;
    return Buffer.from(await res.arrayBuffer());
  }

  function finishSegment() {
    const pcm = Buffer.concat(segment);
    const spoken = speechMs;
    segment = [];
    speechMs = 0;
    silenceMs = 0;
    if (spoken < MIN_SPEECH_MS) return;
    const id = nextId++;
    const seconds = pcm.length / 2 / RATE;
    textQueue = textQueue
      .then(async () => {
        if (closed) return;
        const started = Date.now();
        stats.sttSeconds += seconds;
        const text = await transcribe(pcm);
        if (!text || closed) return;
        const afterStt = Date.now();
        const { lang, translation } = await detectAndTranslate(text);
        const afterText = Date.now();
        log.info(
          `[pipe] #${id} audio ${seconds.toFixed(1)} s, stt ${afterStt - started} ms, text ${afterText - afterStt} ms, lang ${lang}, ${text.length}->${translation.length} chars`,
        );
        if (lang !== "ru" && lang !== "de") return;
        if (!translation) return;
        context.push(text);
        while (context.length > CONTEXT_PHRASES) context.shift();
        const dst = lang === "ru" ? "de" : "ru";
        stats.phrases += 1;
        onPhrase({ id, src: lang, srcText: text, dst, dstText: translation });
        audioQueue = audioQueue
          .then(async () => {
            if (closed) return;
            const t0 = Date.now();
            const mp3 = await speak(translation, dst);
            if (closed) return;
            log.info(`[pipe] #${id} tts ${Date.now() - t0} ms, ${mp3.length} bytes`);
            onAudio(id, dst, mp3);
          })
          .catch((error) => {
            log.error(`[pipe] #${id} tts:`, error.message);
            onError(error);
          });
      })
      .catch((error) => {
        log.error(`[pipe] #${id}:`, error.message);
        onError(error);
      });
  }

  return {
    stats,
    get paused() {
      return paused;
    },
    setPaused(value) {
      paused = Boolean(value);
      if (paused) {
        segment = [];
        preroll = [];
        speechMs = 0;
        silenceMs = 0;
      }
    },
    // chunk: Buffer PCM16 LE mono 24 kHz. Возвращает уровень RMS (для индикатора оператора).
    send(chunk) {
      if (closed) return 0;
      const level = rms(chunk);
      if (paused) return level;
      const ms = chunk.length / 2 / (RATE / 1000);
      const loud = level > getThreshold();
      if (segment.length === 0) {
        if (!loud) {
          preroll.push(chunk);
          while (preroll.length * ms > PREROLL_MS) preroll.shift();
          return level;
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
      return level;
    },
    flush() {
      if (segment.length) finishSegment();
    },
    close() {
      closed = true;
    },
  };
}

// Грубая оценка расходов в долларах (цены на 07.10.2026).
export function estimateCost(stats, sttModel) {
  const sttPerMin = sttModel.includes("mini") ? 0.003 : 0.006;
  const stt = (stats.sttSeconds / 60) * sttPerMin;
  const text = (stats.inTokens / 1e6) * 0.75 + (stats.outTokens / 1e6) * 4.5;
  // ~1000 символов ≈ 1 минута речи ≈ $0.015
  const tts = (stats.ttsChars / 1000) * 0.015;
  return { stt, text, tts, total: stt + text + tts };
}
