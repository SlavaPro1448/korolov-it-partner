// Две страницы: оператор (микрофон зала) и слушатель (субтитры + голос).

export const OPERATOR_PAGE = `<!doctype html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Переводчик — оператор</title>
<style>
  body { font: 16px/1.45 system-ui, sans-serif; max-width: 52rem; margin: 1rem auto; padding: 0 1rem; background: #0f1115; color: #e8e8e8; }
  h1 { font-size: 1.2rem; margin: 0 0 .6rem; }
  .row { display: flex; gap: .8rem; flex-wrap: wrap; align-items: center; margin: .5rem 0; }
  button, select { font: inherit; padding: .6rem .9rem; border-radius: .6rem; border: 1px solid #444; background: #1c1f26; color: #fff; }
  button.primary { background: #1d4ed8; border: 0; }
  button.stop { background: #b91c1c; border: 0; }
  button.pause { background: #a16207; border: 0; }
  button:disabled { opacity: .5; }
  #meter { height: 14px; background: #222; border-radius: 7px; overflow: hidden; flex: 1; min-width: 10rem; position: relative; }
  #meter > div { height: 100%; width: 0; background: #22c55e; }
  #meter > i { position: absolute; top: 0; bottom: 0; width: 2px; background: #f59e0b; }
  input[type=range] { width: 12rem; }
  #stats { color: #9aa; font-size: .9rem; }
  #log { margin-top: 1rem; }
  .ph { border-left: 4px solid #1d4ed8; padding: .2rem .7rem; margin: 0 0 .7rem; }
  .ph .src { color: #9aa; font-size: .9rem; }
  .ph .dst { font-size: 1.05rem; }
  .tag { font-size: .75rem; color: #0f1115; background: #9aa; border-radius: .3rem; padding: 0 .3rem; margin-right: .3rem; }
  #err { color: #f87171; }
</style>
<h1>Переводчик зала — оператор</h1>
<div class="row">
  <label>Вход: <select id="device"></select></label>
  <button id="start" class="primary">Старт</button>
  <button id="pause" class="pause" disabled>Пауза</button>
</div>
<div class="row">
  <span>Уровень</span><div id="meter"><div></div><i></i></div>
  <label>Порог речи <input id="thr" type="range" min="100" max="4000" step="50" value="500"> <span id="thrv">500</span></label>
</div>
<div id="state">Не запущено.</div>
<div id="stats"></div>
<div id="err"></div>
<div id="log"></div>
<script>
const MODELS = __MODELS__;
const WORKLET = \`
class Capture extends AudioWorkletProcessor {
  constructor() { super(); this.chunks = []; this.size = 0; }
  process(inputs) {
    const input = inputs[0][0];
    if (input) {
      this.chunks.push(new Float32Array(input)); this.size += input.length;
      if (this.size >= 2400) {
        const pcm = new Int16Array(this.size); let o = 0, sum = 0;
        for (const c of this.chunks) for (let i = 0; i < c.length; i++) {
          const v = Math.max(-1, Math.min(1, c[i])); const s = v < 0 ? v * 32768 : v * 32767; pcm[o++] = s; sum += s * s;
        }
        this.port.postMessage({ buf: pcm.buffer, rms: Math.sqrt(sum / this.size) }, [pcm.buffer]); this.chunks = []; this.size = 0;
      }
    }
    return true;
  }
}
registerProcessor("capture", Capture);\`;
const $ = (id) => document.getElementById(id);
const key = new URLSearchParams(location.search).get("key");
let stop = null, ws = null, paused = false;
const thr = $("thr");
thr.oninput = () => { $("thrv").textContent = thr.value; $("meter").lastElementChild.style.left = Math.min(100, thr.value / 40) + "%"; if (ws && ws.readyState === 1) ws.send(JSON.stringify({ threshold: Number(thr.value) })); };
thr.oninput();

async function listDevices() {
  const devs = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "audioinput");
  const sel = $("device"); const cur = sel.value; sel.innerHTML = "";
  for (const d of devs) { const o = document.createElement("option"); o.value = d.deviceId; o.textContent = d.label || ("Микрофон " + (sel.length + 1)); sel.appendChild(o); }
  if (cur) sel.value = cur;
}
navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => { s.getTracks().forEach((t) => t.stop()); listDevices(); }).catch(() => listDevices());

function phrase(p) {
  const el = document.createElement("div"); el.className = "ph";
  el.innerHTML = '<div class="src"><span class="tag"></span><span></span></div><div class="dst"><span class="tag"></span><span></span></div>';
  el.querySelectorAll(".tag")[0].textContent = p.src.toUpperCase(); el.querySelectorAll(".src span")[1].textContent = p.srcText;
  el.querySelectorAll(".tag")[1].textContent = p.dst.toUpperCase(); el.querySelectorAll(".dst span")[1].textContent = p.dstText;
  const log = $("log"); log.prepend(el); while (log.children.length > 40) log.lastElementChild.remove();
}

async function start() {
  $("err").textContent = "";
  const ctx = new AudioContext({ sampleRate: 24000 });
  const deviceId = $("device").value;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId: deviceId ? { exact: deviceId } : undefined, channelCount: 1, echoCancellation: false, noiseSuppression: true, autoGainControl: true },
  });
  await listDevices();
  await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET], { type: "text/javascript" })));
  ws = new WebSocket(location.origin.replace(/^http/, "ws") + "/operator-ws?key=" + encodeURIComponent(key));
  const node = new AudioWorkletNode(ctx, "capture");
  ctx.createMediaStreamSource(stream).connect(node);
  node.port.onmessage = (e) => {
    $("meter").firstElementChild.style.width = Math.min(100, e.data.rms / 40) + "%";
    if (ws.readyState === 1) ws.send(e.data.buf);
  };
  ws.onopen = () => { ws.send(JSON.stringify({ threshold: Number(thr.value) })); $("state").textContent = "В эфире. Распознаю речь зала (" + MODELS.stt + " → " + MODELS.text + " → " + MODELS.tts + ")."; };
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.type === "phrase") phrase(m);
    else if (m.type === "stats") $("stats").textContent = "Слушают: RU " + m.listeners.ru + ", DE " + m.listeners.de + " · фраз " + m.phrases + " · распознано " + m.sttMinutes.toFixed(1) + " мин · ≈ $" + m.cost.toFixed(2) + " · сессия " + m.minutes.toFixed(0) + " мин";
    else if (m.type === "error") $("err").textContent = "Ошибка: " + m.message;
  };
  ws.onclose = (e) => { $("state").textContent = e.reason === "replaced" ? "Отключено: оператор подключился с другого устройства." : "Остановлено."; cleanup(); };
  const cleanup = () => { stream.getTracks().forEach((t) => t.stop()); ctx.close().catch(() => {}); $("start").textContent = "Старт"; $("start").className = "primary"; $("pause").disabled = true; stop = null; };
  stop = () => ws.close();
  $("start").textContent = "Стоп"; $("start").className = "stop"; $("pause").disabled = false;
}
$("start").onclick = () => (stop ? stop() : start().catch((e) => ($("err").textContent = "Ошибка: " + e.message)));
$("pause").onclick = () => { paused = !paused; ws && ws.send(JSON.stringify({ paused })); $("pause").textContent = paused ? "Продолжить" : "Пауза"; $("state").textContent = paused ? "ПАУЗА — звук не распознаётся (пение, музыка)." : "В эфире."; };
</script>
</html>`;

export const LISTEN_PAGE = `<!doctype html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<meta name="robots" content="noindex">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>Übersetzung / Перевод</title>
<style>
  :root { color-scheme: dark; }
  body { font: 18px/1.4 system-ui, sans-serif; margin: 0; padding: 1rem; background: #0f1115; color: #f1f1f1; min-height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; }
  header { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; }
  .seg { display: flex; border: 1px solid #444; border-radius: .6rem; overflow: hidden; }
  .seg button { font: inherit; padding: .5rem 1rem; border: 0; background: #1c1f26; color: #ccc; }
  .seg button.on { background: #1d4ed8; color: #fff; }
  #go { font: inherit; font-size: 1.2rem; padding: 1rem; border-radius: .8rem; border: 0; background: #16a34a; color: #fff; margin: 1.5rem 0; }
  #voice { font: inherit; padding: .5rem .8rem; border-radius: .6rem; border: 1px solid #444; background: #1c1f26; color: #fff; }
  #state { color: #9aa; font-size: .9rem; margin: .5rem 0; }
  #now { font-size: 1.6rem; line-height: 1.3; margin: 1rem 0; min-height: 4rem; }
  #orig { color: #9aa; font-size: .95rem; }
  #hist { color: #aab; font-size: 1rem; margin-top: auto; max-height: 40vh; overflow: hidden; }
  #hist p { margin: .3rem 0; }
  small { color: #889; }
</style>
<header>
  <div class="seg"><button data-lang="ru">Русский</button><button data-lang="de">Deutsch</button></div>
  <select id="voice"><option value="server">Голос: сервер</option><option value="phone">Голос: телефон</option><option value="off">Только текст</option></select>
</header>
<button id="go">▶ Слушать перевод</button>
<div id="state"></div>
<div id="now"></div>
<div id="orig"></div>
<div id="hist"></div>
<p><small id="hint">Наушники обязательно. Экран не гасить — страница сама держит его включённым.</small></p>
<script>
const $ = (id) => document.getElementById(id);
const key = new URLSearchParams(location.search).get("key");
const T = {
  ru: { go: "▶ Слушать перевод", wait: "Подключено. Ждём речь в зале…", live: "Идёт перевод.", off: "Переводчик сейчас не включён. Ждите — всё появится само.", paused: "Пауза (пение/музыка).", no: "Нет связи, переподключение…", hint: "Наушники обязательно. Экран не гасить — страница сама держит его включённым.", vs: "Голос: сервер", vp: "Голос: телефон", vo: "Только текст", orig: "Оригинал" },
  de: { go: "▶ Übersetzung hören", wait: "Verbunden. Warten auf Sprache im Saal…", live: "Übersetzung läuft.", off: "Der Übersetzer ist gerade nicht an. Bitte warten — es geht von selbst los.", paused: "Pause (Gesang/Musik).", no: "Keine Verbindung, neuer Versuch…", hint: "Bitte Kopfhörer benutzen. Bildschirm anlassen — die Seite hält ihn wach.", vs: "Stimme: Server", vp: "Stimme: Telefon", vo: "Nur Text", orig: "Original" },
};
let lang = localStorage.getItem("lang") || (navigator.language.startsWith("de") ? "de" : "ru");
let voiceMode = localStorage.getItem("voice") || "server";
let ws = null, started = false, state = { live: false, paused: false };
const audio = new Audio(); audio.setAttribute("playsinline", ""); audio.preload = "auto";
const queue = []; let playing = false; const pending = {}; // id -> blob до прихода текста? (текст приходит раньше)

function t() { return T[lang]; }
function applyLang() {
  document.documentElement.lang = lang;
  for (const b of document.querySelectorAll(".seg button")) b.classList.toggle("on", b.dataset.lang === lang);
  $("go").textContent = t().go; $("hint").textContent = t().hint;
  const v = $("voice"); v.options[0].textContent = t().vs; v.options[1].textContent = t().vp; v.options[2].textContent = t().vo; v.value = voiceMode;
  showState();
}
function showState() {
  if (!started) { $("state").textContent = ""; return; }
  if (!ws || ws.readyState !== 1) $("state").textContent = t().no;
  else if (!state.live) $("state").textContent = t().off + " ✓";
  else if (state.paused) $("state").textContent = t().paused;
  else $("state").textContent = t().live;
}
document.querySelectorAll(".seg button").forEach((b) => (b.onclick = () => { lang = b.dataset.lang; localStorage.setItem("lang", lang); applyLang(); if (ws && ws.readyState === 1) ws.send(JSON.stringify({ lang })); stopAll(); }));
$("voice").onchange = () => { voiceMode = $("voice").value; localStorage.setItem("voice", voiceMode); stopAll(); if (voiceMode === "phone") speechSynthesis.getVoices(); };

function stopAll() { queue.length = 0; audio.pause(); playing = false; if (window.speechSynthesis) speechSynthesis.cancel(); }
function playNext() {
  if (playing || !queue.length) return;
  const item = queue.shift(); playing = true;
  if (item.blob) {
    const url = URL.createObjectURL(item.blob);
    audio.src = url; audio.onended = audio.onerror = () => { URL.revokeObjectURL(url); playing = false; playNext(); };
    audio.play().catch(() => { playing = false; });
  } else if (item.text && window.speechSynthesis) {
    const u = new SpeechSynthesisUtterance(item.text); u.lang = lang === "ru" ? "ru-RU" : "de-DE";
    const v = speechSynthesis.getVoices().find((x) => x.lang.replace("_", "-").toLowerCase().startsWith(u.lang.toLowerCase()) && !x.name.includes("Eloquence"));
    if (v) u.voice = v; u.onend = u.onerror = () => { playing = false; playNext(); };
    speechSynthesis.speak(u);
  } else { playing = false; playNext(); }
}
function enqueue(item) { queue.push(item); while (queue.length > 3) queue.shift(); playNext(); }

function showPhrase(p) {
  const mine = p.dst === lang;
  const text = mine ? p.dstText : p.srcText;
  const prev = $("now").textContent;
  if (prev) { const h = $("hist"); const el = document.createElement("p"); el.textContent = prev; h.prepend(el); while (h.children.length > 6) h.lastElementChild.remove(); }
  $("now").textContent = text;
  $("orig").textContent = mine ? t().orig + ": " + p.srcText : "";
  if (mine && voiceMode === "phone") enqueue({ text: p.dstText });
}

function connect() {
  ws = new WebSocket(location.origin.replace(/^http/, "ws") + "/listen-ws?key=" + encodeURIComponent(key) + "&lang=" + lang);
  ws.binaryType = "arraybuffer";
  ws.onopen = () => { ws.send(JSON.stringify({ lang })); showState(); };
  ws.onmessage = (e) => {
    if (typeof e.data !== "string") {
      if (voiceMode !== "server") return;
      enqueue({ blob: new Blob([new Uint8Array(e.data, 4)], { type: "audio/mpeg" }) });
      return;
    }
    const m = JSON.parse(e.data);
    if (m.type === "phrase") showPhrase(m);
    else if (m.type === "state") { state = m; showState(); }
    else if (m.type === "hello") { for (const p of m.recent || []) showPhrase(p); }
  };
  ws.onclose = () => { showState(); setTimeout(connect, 2000 + Math.random() * 2000); };
}

async function keepAwake() {
  try { if (navigator.wakeLock) { let lock = await navigator.wakeLock.request("screen"); document.addEventListener("visibilitychange", async () => { if (document.visibilityState === "visible") lock = await navigator.wakeLock.request("screen").catch(() => lock); }); } } catch {}
}

// Тихий зацикленный звук: пока он играет, iOS не усыпляет страницу при погашенном экране,
// WebSocket живёт, а озвучка перевода играет поверх (как у веб-радио).
function silentWav(seconds) {
  const rate = 8000, n = rate * seconds, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); str(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, n * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}
const keepalive = new Audio(); keepalive.loop = true; keepalive.setAttribute("playsinline", "");

$("go").onclick = async () => {
  started = true; $("go").style.display = "none";
  // Разблокировать звук жестом пользователя (iOS) и перевести в режим воспроизведения, чтобы играло при выключенном звонке
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch {}
  try { keepalive.src = silentWav(2); await keepalive.play(); } catch {}
  try { audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="; await audio.play(); } catch {}
  if (window.speechSynthesis) { speechSynthesis.getVoices(); const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); }
  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: lang === "de" ? "Übersetzung" : "Перевод", artist: "Gemeinde Leverkusen" });
      navigator.mediaSession.setActionHandler("pause", () => {}); navigator.mediaSession.setActionHandler("play", () => {});
    } catch {}
  }
  keepAwake();
  connect();
};
// Если iOS всё же остановил фоновый звук (звонок, другое приложение) — возобновить при возврате
document.addEventListener("visibilitychange", () => { if (started && document.visibilityState === "visible" && keepalive.paused) keepalive.play().catch(() => {}); });
applyLang();
</script>
</html>`;
