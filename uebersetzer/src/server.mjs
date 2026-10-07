// KI-Übersetzer für den Gottesdienst: один оператор шлёт звук зала, слушатели получают текст и
// озвучку перевода на выбранном языке. Ничего не сохраняется.
import http from "node:http";
import { timingSafeEqual } from "node:crypto";
import { WebSocketServer } from "ws";
import { createPipeline, estimateCost } from "./pipeline.mjs";
import { LISTEN_PAGE, OPERATOR_PAGE } from "./pages.mjs";

const env = process.env;
const config = {
  port: Number(env.PORT || 8080),
  apiKey: env.OPENAI_API_KEY || "",
  sttModel: env.STT_MODEL || "gpt-4o-transcribe",
  textModel: env.TEXT_MODEL || "gpt-5.4-mini",
  ttsModel: env.TTS_MODEL || "gpt-4o-mini-tts",
  voices: { ru: env.VOICE_RU || "cedar", de: env.VOICE_DE || "marin" },
  operatorKey: env.OPERATOR_KEY || "",
  listenKey: env.LISTEN_KEY || "",
  maxListeners: Number(env.MAX_LISTENERS || 120),
  sessionMaxMinutes: Number(env.SESSION_MAX_MINUTES || 240),
};

for (const name of ["apiKey", "operatorKey", "listenKey"]) {
  if (!config[name]) {
    console.error(`[config] ${name} fehlt`);
    process.exit(1);
  }
}

const keyOk = (given, expected) => {
  const a = Buffer.from(String(given ?? ""));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

const listeners = new Set(); // { ws, lang }
let operator = null; // { ws, pipeline, threshold, startedAt, timer, statsTimer }
const recent = []; // последние фразы для только что подключившихся (только текст)
const RECENT_MAX = 6;

function sendJson(ws, payload) {
  if (ws.readyState === 1) ws.send(JSON.stringify(payload));
}

function broadcastPhrase(phrase) {
  recent.push(phrase);
  while (recent.length > RECENT_MAX) recent.shift();
  const payload = JSON.stringify({ type: "phrase", ...phrase });
  for (const l of listeners) if (l.ws.readyState === 1) l.ws.send(payload);
  if (operator) sendJson(operator.ws, { type: "phrase", ...phrase });
}

function broadcastAudio(id, lang, mp3) {
  const frame = Buffer.alloc(4 + mp3.length);
  frame.writeUInt32LE(id, 0);
  mp3.copy(frame, 4);
  for (const l of listeners) if (l.lang === lang && l.ws.readyState === 1) l.ws.send(frame);
}

function listenerCounts() {
  let ru = 0;
  let de = 0;
  for (const l of listeners) if (l.lang === "ru") ru += 1; else de += 1;
  return { ru, de };
}

function broadcastState() {
  const state = {
    type: "state",
    live: Boolean(operator),
    paused: operator?.pipeline.paused ?? false,
    listeners: listenerCounts(),
  };
  const payload = JSON.stringify(state);
  for (const l of listeners) if (l.ws.readyState === 1) l.ws.send(payload);
  if (operator) sendJson(operator.ws, { ...state, threshold: operator.threshold });
}

function attachOperator(ws) {
  if (operator) {
    operator.ws.close(4000, "replaced");
    detachOperator(operator);
  }
  const me = { ws, threshold: 500, startedAt: Date.now() };
  me.pipeline = createPipeline({
    apiKey: config.apiKey,
    sttModel: config.sttModel,
    textModel: config.textModel,
    ttsModel: config.ttsModel,
    voices: config.voices,
    getThreshold: () => me.threshold,
    onPhrase: broadcastPhrase,
    onAudio: broadcastAudio,
    onError: (error) => sendJson(ws, { type: "error", message: error.message }),
  });
  operator = me;
  me.timer = setTimeout(() => ws.close(1000, "time limit"), config.sessionMaxMinutes * 60 * 1000);
  let levelAcc = 0;
  let levelN = 0;
  me.statsTimer = setInterval(() => {
    const s = me.pipeline.stats;
    sendJson(ws, {
      type: "stats",
      listeners: listenerCounts(),
      sttMinutes: s.sttSeconds / 60,
      phrases: s.phrases,
      cost: estimateCost(s, config.sttModel).total,
      level: levelN ? Math.round(levelAcc / levelN) : 0,
      minutes: (Date.now() - me.startedAt) / 60000,
    });
    levelAcc = 0;
    levelN = 0;
  }, 1000);
  console.info("[operator] verbunden");
  broadcastState();
  sendJson(ws, { type: "hello", threshold: me.threshold, models: publicModels() });

  ws.on("message", (data, isBinary) => {
    if (isBinary) {
      const level = me.pipeline.send(Buffer.from(data));
      levelAcc += level;
      levelN += 1;
      return;
    }
    let msg;
    try {
      msg = JSON.parse(String(data));
    } catch {
      return;
    }
    if (typeof msg.paused === "boolean") {
      me.pipeline.setPaused(msg.paused);
      broadcastState();
    }
    if (typeof msg.threshold === "number" && msg.threshold >= 50 && msg.threshold <= 10000) {
      me.threshold = msg.threshold;
    }
    if (msg.flush) me.pipeline.flush();
  });
  ws.on("close", () => {
    if (operator === me) {
      detachOperator(me);
      operator = null;
      console.info(`[operator] getrennt nach ${Math.round((Date.now() - me.startedAt) / 1000)} s`);
      broadcastState();
    }
  });
}

function detachOperator(op) {
  clearTimeout(op.timer);
  clearInterval(op.statsTimer);
  op.pipeline.close();
}

function attachListener(ws, lang) {
  if (listeners.size >= config.maxListeners) return ws.close(1013, "full");
  const me = { ws, lang };
  listeners.add(me);
  sendJson(ws, { type: "hello", lang, recent });
  broadcastState();
  ws.on("message", (data, isBinary) => {
    if (isBinary) return;
    try {
      const msg = JSON.parse(String(data));
      if (msg.lang === "ru" || msg.lang === "de") {
        me.lang = msg.lang;
        broadcastState();
      }
    } catch {
      /* ignorieren */
    }
  });
  ws.on("close", () => {
    listeners.delete(me);
    broadcastState();
  });
}

// Удалённый из конфигурации ключ API не должен уходить на страницу
const publicModels = () => ({
  stt: config.sttModel,
  text: config.textModel,
  tts: config.ttsModel,
  voices: config.voices,
});

const html = (res, body) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
  });
  res.end(body);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, live: Boolean(operator), listeners: listenerCounts() }));
  }
  if (url.pathname === "/operator") {
    if (!keyOk(url.searchParams.get("key"), config.operatorKey)) {
      res.writeHead(403);
      return res.end("Kein Zugang");
    }
    return html(res, OPERATOR_PAGE.replace("__MODELS__", JSON.stringify(publicModels())));
  }
  if (url.pathname === "/" || url.pathname === "/hoeren") {
    if (!keyOk(url.searchParams.get("key"), config.listenKey)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Kein Zugang / Нет доступа");
    }
    return html(res, LISTEN_PAGE);
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 1024 * 1024 });
server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url, "http://localhost");
  const key = url.searchParams.get("key");
  if (url.pathname === "/operator-ws" && keyOk(key, config.operatorKey)) {
    return wss.handleUpgrade(req, socket, head, (ws) => attachOperator(ws));
  }
  if (url.pathname === "/listen-ws" && keyOk(key, config.listenKey)) {
    const lang = url.searchParams.get("lang") === "de" ? "de" : "ru";
    return wss.handleUpgrade(req, socket, head, (ws) => attachListener(ws, lang));
  }
  socket.destroy();
});

// Пинг, чтобы Caddy/телефоны не рвали простаивающие соединения
setInterval(() => {
  for (const ws of wss.clients) if (ws.readyState === 1) ws.ping();
}, 25000);

server.listen(config.port, () => {
  console.info(
    `[server] Port ${config.port}, stt ${config.sttModel}, text ${config.textModel}, tts ${config.ttsModel}`,
  );
});
