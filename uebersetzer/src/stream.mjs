// Потоковое распознавание через OpenAI Realtime (intent=transcription): звук идёт непрерывно,
// паузы определяет серверный VAD, текст приходит по словам ещё во время речи. Законченные
// предложения переводятся сразу, не дожидаясь конца реплики. Аудио не сохраняется.
import WebSocket from "ws";
import { createStages, detectLang } from "./stages.mjs";

const RATE = 24000;
const ENDPOINT = "wss://api.openai.com/v1/realtime?intent=transcription";
// Конец предложения: . ! ? (но не многоточие — им распознаватель помечает обрыв фразы)
const SENTENCE_END = /^([\s\S]*?(?:[!?]+|(?<!\.)\.(?!\.))["»“”)]?)\s+(?=\S)/;
const ENDS_SENTENCE = /(?:[!?]|(?<!\.)\.(?!\.))["»“”)]?$/;

export function rms(buffer) {
  let sum = 0;
  const samples = Math.floor(buffer.length / 2);
  for (let i = 0; i < samples; i += 1) {
    const value = buffer.readInt16LE(i * 2);
    sum += value * value;
  }
  return samples ? Math.sqrt(sum / samples) : 0;
}

export function createStreamingPipeline({
  apiKey,
  sttModel = "gpt-4o-transcribe",
  textModel,
  ttsModel,
  voices,
  silenceMs = 600,
  sttPrompt = "",
  noiseReduction = "near_field", // чистый сигнал с пульта; far_field — для микрофона в зале
  onPhrase, // ({id, src, srcText, dst, dstText})
  onAudio, // (id, dst, pcmChunk)
  onAudioEnd = null,
  onPartial = null, // (text) — распознанное «на лету», ещё не переведённое
  onError = () => {},
  log = console,
  fetchImpl = fetch,
  WebSocketImpl = WebSocket,
}) {
  const stats = { sttSeconds: 0, phrases: 0, ttsChars: 0, inTokens: 0, outTokens: 0 };
  let closed = false;
  let paused = false;
  let ws = null;
  let ready = false;
  let nextId = 1;
  let textQueue = Promise.resolve();
  let audioQueue = Promise.resolve();
  const items = new Map(); // item_id -> { text, consumed }
  // Обрывок без точки в конце (проповедник сделал паузу посреди предложения) ждёт продолжения:
  // приклеивается к следующей реплике и переводится, когда предложение закончилось, либо если
  // речь не возобновилась за FLUSH_MS.
  let pending = "";
  let pendingTimer = null;
  const FLUSH_MS = 2000;
  const FLUSH_SHORT_MS = 4500; // одно-два слова ждут продолжения дольше
  const PENDING_MAX_CHARS = 220;
  const wordCount = (t) => t.split(/\s+/).filter(Boolean).length;
  const flushPending = () => {
    clearTimeout(pendingTimer);
    pendingTimer = null;
    if (!pending) return;
    const text = pending;
    pending = "";
    // Одиночное слово без продолжения — заикание или обрыв: переводить нечего
    if (wordCount(text) < 2) {
      log.info("[stream] одиночное слово отброшено");
      return;
    }
    enqueueText(text);
  };
  const audioBacklog = [];
  const append = (chunk) => {
    stats.sttSeconds += chunk.length / 2 / RATE;
    ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: chunk.toString("base64") }));
  };
  const stages = createStages({ apiKey, textModel, ttsModel, voices, stats, isClosed: () => closed, fetchImpl });

  function enqueueText(text) {
    const clean = text.trim();
    if (!clean || detectLang(clean) === "other") return;
    const id = nextId++;
    const started = Date.now();
    textQueue = textQueue
      .then(async () => {
        if (closed) return;
        const { lang, translation } = await stages.detectAndTranslate(clean);
        log.info(`[stream] #${id} text ${Date.now() - started} ms, lang ${lang}, ${clean.length}->${translation.length} chars`);
        if (!translation) return;
        const dst = lang === "ru" ? "de" : "ru";
        stats.phrases += 1;
        onPhrase({ id, src: lang, srcText: clean, dst, dstText: translation });
        audioQueue = audioQueue
          .then(async () => {
            if (closed) return;
            const t0 = Date.now();
            const { total, first } = await stages.speak(id, translation, dst, onAudio, onAudioEnd);
            log.info(`[stream] #${id} tts first ${first} ms, all ${Date.now() - t0} ms, ${(total / 48000).toFixed(1)} s audio`);
          })
          .catch((error) => {
            log.error(`[stream] #${id} tts:`, error.message);
            onError(error);
          });
      })
      .catch((error) => {
        log.error(`[stream] #${id}:`, error.message);
        onError(error);
      });
  }

  // Отрезать законченные предложения из (pending + хвост реплики); вернуть, сколько символов
  // хвоста реплики ушло в перевод.
  function cutSentences(rest) {
    let consumedRest = 0;
    for (;;) {
      const combined = pending ? `${pending} ${rest.slice(consumedRest)}` : rest.slice(consumedRest);
      const m = SENTENCE_END.exec(combined);
      if (!m) return consumedRest;
      enqueueText(m[1]);
      consumedRest += m[0].length - (pending ? pending.length + 1 : 0);
      pending = "";
    }
  }

  function onDelta(itemId, delta) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
    const item = items.get(itemId) ?? { text: "", consumed: "" };
    item.text += delta;
    items.set(itemId, item);
    const rest = item.text.slice(item.consumed.length);
    onPartial?.(pending ? `${pending} ${rest}` : rest);
    const used = cutSentences(rest);
    item.consumed += rest.slice(0, used);
  }

  function onCompleted(itemId, transcript) {
    const item = items.get(itemId) ?? { text: "", consumed: "" };
    items.delete(itemId);
    const full = (transcript ?? "").trim();
    let rest;
    if (!item.consumed) rest = full;
    else if (full.startsWith(item.consumed.trim())) rest = full.slice(item.consumed.trim().length);
    else rest = item.text.slice(item.consumed.length); // итог разошёлся с дельтами — берём хвост дельт
    rest = rest.trim();
    const used = cutSentences(rest);
    const tail = rest.slice(used).trim();
    if (tail) pending = pending ? `${pending} ${tail}` : tail;
    // Хвост заканчивается знаком конца предложения (без пробела после — регулярка его не взяла)
    if (pending && (ENDS_SENTENCE.test(pending) || pending.length >= PENDING_MAX_CHARS)) {
      flushPending();
    } else if (pending) {
      onPartial?.(pending);
      clearTimeout(pendingTimer);
      pendingTimer = setTimeout(flushPending, wordCount(pending) <= 2 ? FLUSH_SHORT_MS : FLUSH_MS);
    } else {
      onPartial?.("");
    }
  }

  function connect() {
    if (closed) return;
    ready = false;
    ws = new WebSocketImpl(ENDPOINT, { headers: { Authorization: `Bearer ${apiKey}` } });
    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          type: "session.update",
          session: {
            type: "transcription",
            audio: {
              input: {
                format: { type: "audio/pcm", rate: RATE },
                noise_reduction: noiseReduction === "none" ? null : { type: noiseReduction },
                transcription: sttPrompt ? { model: sttModel, prompt: sttPrompt } : { model: sttModel },
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
          if (!ready) log.info(`[stream] Sitzung bereit (${event.type})`);
          ready = true;
          break;
        case "input_audio_buffer.speech_started":
          clearTimeout(pendingTimer);
          pendingTimer = null;
          break;
        case "input_audio_buffer.speech_stopped":
          // речь кончилась, а текста ещё нет: если хвост висит, таймер снова пойдёт после completed
          break;
        case "conversation.item.input_audio_transcription.delta":
          if (typeof event.delta === "string") onDelta(event.item_id, event.delta);
          break;
        case "conversation.item.input_audio_transcription.completed":
          onCompleted(event.item_id, event.transcript);
          break;
        case "conversation.item.input_audio_transcription.failed":
          log.error("[stream] Transkription fehlgeschlagen:", event.error?.message ?? "");
          items.delete(event.item_id);
          break;
        case "error":
          log.error("[stream] API-Fehler:", event.error?.message ?? JSON.stringify(event.error));
          onError(new Error(event.error?.message ?? "Realtime error"));
          break;
        default:
          break;
      }
    });
    ws.on("error", (error) => log.error("[stream] WebSocket:", error.message));
    ws.on("close", (code, reason) => {
      ready = false;
      if (closed) return;
      log.info(`[stream] getrennt (${code} ${String(reason)}), neu verbinden…`);
      setTimeout(connect, 1000);
    });
  }
  connect();

  return {
    stats,
    get paused() {
      return paused;
    },
    setPaused(value) {
      paused = Boolean(value);
      if (paused && ready) ws.send(JSON.stringify({ type: "input_audio_buffer.clear" }));
    },
    // chunk: Buffer PCM16 LE mono 24 kHz. Возвращает уровень RMS (для индикатора оператора).
    send(chunk) {
      if (closed) return 0;
      const level = rms(chunk);
      if (paused) return level;
      if (!ready || ws.readyState !== 1) {
        // Сессия ещё поднимается: придержать до 5 с звука, чтобы не потерять первые слова
        audioBacklog.push(chunk);
        while (audioBacklog.length > 50) audioBacklog.shift();
        return level;
      }
      for (const c of audioBacklog.splice(0)) append(c);
      append(chunk);
      return level;
    },
    flush() {},
    close() {
      closed = true;
      clearTimeout(pendingTimer);
      try {
        ws?.close();
      } catch {
        /* egal */
      }
    },
  };
}
