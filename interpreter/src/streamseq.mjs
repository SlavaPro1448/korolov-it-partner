// "По фразам" mit Streaming-Erkennung: Audio läuft ununterbrochen in eine OpenAI-Realtime-
// Transkription (Server-VAD). Der Text kommt schon während des Sprechens; fertige Sätze werden
// sofort übersetzt und vorgelesen, der Rest direkt nach der Sprechpause – ohne erst die ganze
// Äußerung hochzuladen. Gleiche Schnittstelle wie createSequentialTranslator: send(base64 PCM16
// 24 kHz), close(). Audio und Text werden nicht gespeichert.
import WebSocket from "ws";

const ENDPOINT = "wss://api.openai.com/v1/realtime?intent=transcription";
const LANGUAGE_NAMES = { de: "Deutsch", ru: "Russisch", uk: "Ukrainisch", en: "Englisch" };
// Satzende im laufenden Text: . ! ? gefolgt von Leerzeichen und weiterem Text (Mehrfachpunkte
// markieren einen Abbruch und zählen nicht)
const SENTENCE_END = /^([\s\S]*?(?:[!?]+|(?<!\.)\.(?!\.))["»“”)]?)\s+(?=\S)/;
const CONTEXT_TURNS = 4;

export function createStreamingSequential({
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
  silenceMs = 450,
  log = console,
  fetchImpl = fetch,
  WebSocketImpl = WebSocket,
}) {
  const headers = { Authorization: `Bearer ${apiKey}` };
  let closed = false;
  let ready = false;
  let ws = null;
  const backlog = [];
  const items = new Map(); // item_id -> { text, consumed }
  const context = []; // letzte Äußerungen [{src, dst}] für eine stimmige Übersetzung
  let textQueue = Promise.resolve();
  let audioQueue = Promise.resolve();

  async function translate(text) {
    const recent = context
      .slice(-CONTEXT_TURNS)
      .map((c) => `- ${c.src} => ${c.dst}`)
      .join("\n");
    const res = await fetchImpl("https://api.openai.com/v1/chat/completions", {
      signal: AbortSignal.timeout(8000),
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
              `${LANGUAGE_NAMES[sourceLanguage]}en treu und vollständig ins ${LANGUAGE_NAMES[targetLanguage]}e, ` +
              "natürlich gesprochen. Zahlen, Uhrzeiten, Daten, Namen, Aktenzeichen exakt übernehmen. " +
              "Kurze Antworten wie 'ja', 'genau', 'hallo' ebenfalls übersetzen. Nichts hinzufügen, nichts " +
              "erklären. Gib nur die Übersetzung aus." +
              (recent ? `\n\nBisheriger Gesprächsverlauf dieser Seite (nur als Kontext):\n${recent}` : ""),
          },
          { role: "user", content: text },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Übersetzung ${res.status}`);
    return ((await res.json()).choices?.[0]?.message?.content ?? "").trim();
  }

  // Die Sprachausgabe hängt gelegentlich: antwortet sie nicht binnen 4 s, wird neu angefragt
  async function requestSpeech(text) {
    for (let attempt = 1; ; attempt += 1) {
      const controller = new AbortController();
      const headerTimer = setTimeout(() => controller.abort(), attempt === 1 ? 4000 : 8000);
      try {
        const res = await fetchImpl("https://api.openai.com/v1/audio/speech", {
          signal: controller.signal,
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ model: ttsModel, voice, input: text, response_format: "pcm" }),
        });
        clearTimeout(headerTimer);
        if (!res.ok) throw new Error(`TTS ${res.status}`);
        // für den Rest der Antwort großzügiger
        const bodyTimer = setTimeout(() => controller.abort(), 20000);
        bodyTimer.unref?.();
        return res;
      } catch (error) {
        clearTimeout(headerTimer);
        if (attempt >= 2 || closed) throw error;
        log.info(`[stream:${label}] TTS antwortet nicht, neuer Versuch`);
      }
    }
  }

  async function speak(text) {
    const res = await requestSpeech(text);
    let rest = Buffer.alloc(0);
    let first = null; // Zeitpunkt des ersten Tons
    for await (const chunk of res.body) {
      if (closed) return null;
      const data = Buffer.concat([rest, Buffer.from(chunk)]);
      const usable = data.length - (data.length % 2);
      rest = data.subarray(usable);
      if (usable > 0) {
        first ??= Date.now();
        onAudio(data.subarray(0, usable).toString("base64"));
      }
    }
    return first;
  }

  // Satz übersetzen (Reihenfolge bleibt), dann vorlesen (ebenfalls der Reihe nach)
  function enqueue(text, spokenAt) {
    const clean = text.trim();
    if (!clean || closed) return;
    onTranscript?.("in", clean + " ");
    textQueue = textQueue
      .then(async () => {
        if (closed) return;
        const t0 = Date.now();
        const translated = await translate(clean);
        if (!translated || closed) return;
        context.push({ src: clean, dst: translated });
        onTranscript?.("out", translated + " ");
        const textMs = Date.now() - t0;
        audioQueue = audioQueue
          .then(async () => {
            const ttsStart = Date.now();
            const first = await speak(translated);
            // Wartezeit für den Hörer: Ende der Sprache -> erster Ton der Übersetzung
            log.info(
              `[stream:${label}] text ${textMs} ms, tts ${first ? first - ttsStart : "-"} ms, ` +
                `Sprechende -> erster Ton ${first && spokenAt ? first - spokenAt : "-"} ms`,
            );
          })
          .catch((error) => log.error(`[stream:${label}] tts`, error.message));
      })
      .catch((error) => log.error(`[stream:${label}]`, error.message));
  }

  // Fertige Sätze aus dem noch offenen Text abschneiden und sofort übersetzen
  function cutSentences(item) {
    for (;;) {
      const rest = item.text.slice(item.consumed);
      const m = SENTENCE_END.exec(rest);
      if (!m) return;
      enqueue(m[1], Date.now());
      item.consumed += m[0].length;
    }
  }

  let speechStoppedAt = 0;

  function connect() {
    if (closed) return;
    ready = false;
    ws = new WebSocketImpl(ENDPOINT, { headers });
    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          type: "session.update",
          session: {
            type: "transcription",
            audio: {
              input: {
                format: { type: "audio/pcm", rate: 24000 },
                noise_reduction: { type: "near_field" },
                transcription: { model: sttModel, language: sourceLanguage },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: silenceMs,
                },
              },
            },
          },
        }),
      );
    });
    ws.on("message", (data) => {
      let event;
      try {
        event = JSON.parse(String(data));
      } catch {
        return;
      }
      switch (event.type) {
        case "session.created":
        case "session.updated":
        case "transcription_session.updated":
          if (!ready) {
            ready = true;
            for (const chunk of backlog.splice(0)) append(chunk);
          }
          break;
        case "input_audio_buffer.speech_stopped":
          speechStoppedAt = Date.now();
          break;
        case "conversation.item.input_audio_transcription.delta": {
          if (typeof event.delta !== "string") break;
          const item = items.get(event.item_id) ?? { text: "", consumed: 0 };
          item.text += event.delta;
          items.set(event.item_id, item);
          cutSentences(item);
          break;
        }
        case "conversation.item.input_audio_transcription.completed": {
          const item = items.get(event.item_id) ?? { text: "", consumed: 0 };
          items.delete(event.item_id);
          const full = String(event.transcript ?? item.text);
          // Rest der Äußerung (auch ein einzelnes "Ja") nach der Sprechpause sofort übersetzen
          const tail = full.length >= item.consumed ? full.slice(item.consumed) : item.text.slice(item.consumed);
          enqueue(tail, speechStoppedAt || Date.now());
          break;
        }
        case "conversation.item.input_audio_transcription.failed":
          items.delete(event.item_id);
          log.error(`[stream:${label}] Erkennung fehlgeschlagen`, event.error?.message ?? "");
          break;
        case "error":
          log.error(`[stream:${label}] API-Fehler`, event.error?.message ?? "");
          break;
        default:
          break;
      }
    });
    ws.on("error", (error) => log.error(`[stream:${label}] WebSocket`, error.message));
    ws.on("close", () => {
      ready = false;
      if (!closed) setTimeout(connect, 1000);
    });
  }

  function append(chunk) {
    ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: chunk }));
  }

  connect();

  return {
    send(base64) {
      if (closed) return;
      if (!ready || ws.readyState !== 1) {
        backlog.push(base64);
        while (backlog.length > 250) backlog.shift(); // höchstens ~5 s, solange die Sitzung startet
        return;
      }
      append(base64);
    },
    close() {
      closed = true;
      try {
        ws?.close();
      } catch {
        // bereits geschlossen
      }
    },
  };
}
