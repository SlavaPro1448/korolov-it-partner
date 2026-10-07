// Текстовые ступени конвейера: определение языка, перевод, потоковая озвучка.
// Общие для режимов «по паузам» (pipeline.mjs) и «потоковое распознавание» (stream.mjs).
const LANG_NAMES = { de: "Deutsch", ru: "Russisch" };
const CONTEXT_PHRASES = 3;

// Язык по алфавиту: кириллица → ru, латиница → de. Надёжнее, чем просить модель.
export function detectLang(text) {
  const cyr = (text.match(/[Ѐ-ӿ]/g) || []).length;
  const lat = (text.match(/[A-Za-zÄÖÜäöüß]/g) || []).length;
  if (cyr + lat < 3) return "other";
  return cyr >= lat ? "ru" : "de";
}

export function createStages({
  apiKey,
  textModel = "gpt-5.4-mini",
  ttsModel = "gpt-4o-mini-tts",
  voices = { ru: "cedar", de: "marin" },
  stats,
  isClosed = () => false,
  fetchImpl = fetch,
}) {
  const headers = { Authorization: `Bearer ${apiKey}` };
  const context = [];

  async function translate(text, src, dst, strict = false) {
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
              `Du bist Dolmetscher in einem christlichen Gottesdienst. Übersetze den Satz des Predigers aus dem ` +
              `${LANG_NAMES[src]}en ins ${LANG_NAMES[dst]}e. Die Antwort ist ausschließlich der übersetzte Text auf ` +
              `${LANG_NAMES[dst]} — nie der Originaltext, keine Anführungszeichen, keine Erklärungen. ` +
              "Treu und vollständig, natürlich, im Ton einer Predigt. Bibelstellen, Namen und Zahlen exakt. " +
              "Auch Satzfragmente übersetzen, so wie sie sind. Der Text kommt aus automatischer Spracherkennung im " +
              "Saal und kann Hörfehler enthalten: übersetze den offensichtlich gemeinten Sinn (biblische Namen, " +
              "Kirchenbegriffe, Bibelstellen) statt wörtlichen Unsinn. Vorherige Sätze sind nur Kontext." +
              (strict ? ` WICHTIG: Der vorige Versuch war nicht auf ${LANG_NAMES[dst]}. Antworte jetzt auf ${LANG_NAMES[dst]}.` : ""),
          },
          ...(context.length ? [{ role: "user", content: `Kontext:\n${context.join("\n")}` }] : []),
          { role: "user", content: text },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Übersetzung ${res.status}`);
    const data = await res.json();
    stats.inTokens += data.usage?.prompt_tokens ?? 0;
    stats.outTokens += data.usage?.completion_tokens ?? 0;
    return (data.choices?.[0]?.message?.content ?? "").trim().replace(/^["«„]|["»“]$/g, "");
  }

  async function detectAndTranslate(text) {
    const lang = detectLang(text);
    if (lang === "other") return { lang, translation: "" };
    const dst = lang === "ru" ? "de" : "ru";
    let translation = await translate(text, lang, dst);
    if (detectLang(translation) !== dst) translation = await translate(text, lang, dst, true);
    if (detectLang(translation) !== dst) return { lang, translation: "" };
    context.push(text);
    while (context.length > CONTEXT_PHRASES) context.shift();
    return { lang, translation };
  }

  // Озвучка потоком: PCM16 24 кГц уходит кусками по мере генерации через onAudio(id, lang, chunk).
  async function speak(id, text, lang, onAudio, onAudioEnd) {
    const res = await fetchImpl("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ttsModel,
        voice: voices[lang] ?? "cedar",
        input: text,
        response_format: "pcm",
        instructions:
          lang === "ru"
            ? "Говори ясно и тепло, как синхронный переводчик проповеди: в живом, довольно быстром темпе, без долгих пауз между предложениями."
            : "Sprich klar und warm, wie ein Simultandolmetscher einer Predigt: in lebendigem, zügigem Tempo, ohne lange Pausen zwischen den Sätzen.",
      }),
    });
    if (!res.ok) throw new Error(`TTS ${res.status}`);
    stats.ttsChars += text.length;
    let rest = Buffer.alloc(0);
    let total = 0;
    let first = 0;
    const t0 = Date.now();
    for await (const chunk of res.body) {
      if (isClosed()) return { total, first };
      const data = Buffer.concat([rest, Buffer.from(chunk)]);
      const usable = data.length - (data.length % 2);
      rest = data.subarray(usable);
      if (usable > 0) {
        if (!first) first = Date.now() - t0;
        total += usable;
        onAudio(id, lang, data.subarray(0, usable));
      }
    }
    onAudioEnd?.(id, lang);
    return { total, first };
  }

  return { detectAndTranslate, speak, context };
}

// Грубая оценка расходов в долларах (цены на 07.10.2026).
export function estimateCost(stats, sttModel) {
  const sttPerMin = sttModel.includes("mini") ? 0.003 : 0.006;
  const stt = (stats.sttSeconds / 60) * sttPerMin;
  const text = (stats.inTokens / 1e6) * 0.75 + (stats.outTokens / 1e6) * 4.5;
  const tts = (stats.ttsChars / 1000) * 0.015; // ~1000 символов ≈ 1 минута речи ≈ $0.015
  return { stt, text, tts, total: stt + text + tts };
}
