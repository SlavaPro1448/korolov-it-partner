// Страница слушателя: выбор языка, субтитры, озвучка. Звук приходит потоком PCM16 24 кГц
// кусками по мере генерации и играет через Web Audio; тихий <audio> держит страницу живой
// на iPhone при погашенном экране.
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
  #explain { color: #9aa; font-size: .95rem; }
</style>
<header>
  <div class="seg"><button data-lang="ru">Русский</button><button data-lang="de">Deutsch</button></div>
  <select id="voice"><option value="server">Голос: сервер</option><option value="phone">Голос: телефон</option><option value="off">Только текст</option></select>
</header>
<p id="explain"></p>
<button id="go">▶ Слушать перевод</button>
<div id="state"></div>
<div id="now"></div>
<div id="orig"></div>
<div id="partial" style="color:#9aa;font-style:italic;min-height:1.4rem"></div>
<div id="hist"></div>
<p><small id="hint"></small></p>
<script>
const $ = (id) => document.getElementById(id);
const key = new URLSearchParams(location.search).get("key");
const T = {
  ru: { go: "▶ Слушать перевод", explain: "Выберите язык, на котором хотите слышать и читать перевод. Речь на этом языке показывается как есть, без озвучки.", live: "Идёт перевод.", off: "Переводчик сейчас не включён. Ждите — всё появится само.", paused: "Пауза (пение/музыка).", no: "Нет связи, переподключение…", hint: "Наушники обязательно. Экран можно гасить — страница продолжит работать.", vs: "Голос: сервер", vp: "Голос: телефон", vo: "Только текст", orig: "Оригинал" },
  de: { go: "▶ Übersetzung hören", explain: "Wählen Sie die Sprache, in der Sie die Übersetzung hören und lesen möchten. Rede in dieser Sprache wird nur als Text gezeigt.", live: "Übersetzung läuft.", off: "Der Übersetzer ist gerade nicht an. Bitte warten — es geht von selbst los.", paused: "Pause (Gesang/Musik).", no: "Keine Verbindung, neuer Versuch…", hint: "Bitte Kopfhörer benutzen. Der Bildschirm darf ausgehen — die Seite läuft weiter.", vs: "Stimme: Server", vp: "Stimme: Telefon", vo: "Nur Text", orig: "Original" },
};
let lang = localStorage.getItem("lang") || (navigator.language.startsWith("de") ? "de" : "ru");
let voiceMode = localStorage.getItem("voice") || "server";
let ws = null, started = false, state = { live: false, paused: false };
const phrases = []; // последние фразы (оригинал + перевод), перерисовываются при смене языка

function t() { return T[lang]; }
function applyLang() {
  document.documentElement.lang = lang;
  for (const b of document.querySelectorAll(".seg button")) b.classList.toggle("on", b.dataset.lang === lang);
  $("go").textContent = t().go; $("hint").textContent = t().hint; $("explain").textContent = t().explain;
  const v = $("voice"); v.options[0].textContent = t().vs; v.options[1].textContent = t().vp; v.options[2].textContent = t().vo; v.value = voiceMode;
  render(); showState();
}
function showState() {
  if (!started) { $("state").textContent = ""; return; }
  if (!ws || ws.readyState !== 1) $("state").textContent = t().no;
  else if (!state.live) $("state").textContent = t().off + " ✓";
  else if (state.paused) $("state").textContent = t().paused;
  else $("state").textContent = t().live + " ✓";
}
function textFor(p) { return p.dst === lang ? p.dstText : p.srcText; }
function render() {
  const last = phrases[phrases.length - 1];
  $("now").textContent = last ? textFor(last) : "";
  $("orig").textContent = last && last.dst === lang ? t().orig + ": " + last.srcText : "";
  const h = $("hist"); h.innerHTML = "";
  for (let i = phrases.length - 2; i >= 0 && i >= phrases.length - 7; i--) { const el = document.createElement("p"); el.textContent = textFor(phrases[i]); h.appendChild(el); }
}
document.querySelectorAll(".seg button").forEach((b) => (b.onclick = () => { lang = b.dataset.lang; localStorage.setItem("lang", lang); stopAll(); applyLang(); if (ws && ws.readyState === 1) ws.send(JSON.stringify({ lang })); }));
$("voice").onchange = () => { voiceMode = $("voice").value; localStorage.setItem("voice", voiceMode); stopAll(); if (voiceMode === "phone") speechSynthesis.getVoices(); };

// --- Озвучка: потоковый PCM через Web Audio -------------------------------------
let ctx = null, playhead = 0, sources = [], cur = null;
const BACKLOG_SKIP = 25; // секунд: если отстаём сильнее, новую фразу не озвучиваем (текст остаётся)
function backlog() { return ctx ? Math.max(0, playhead - ctx.currentTime) : 0; }
function playPcm(id, bytes) {
  if (!ctx) return;
  if (ctx.state !== "running") ctx.resume().catch(() => {});
  // Решение о темпе и пропуске — один раз на фразу, чтобы скорость не прыгала внутри неё
  if (!cur || cur.id !== id) { const lag = backlog(); cur = { id, skip: lag > BACKLOG_SKIP, rate: lag > 8 ? 1.2 : lag > 4 ? 1.1 : 1 }; }
  if (cur.skip) return;
  // Заголовок кадра 5 байт → смещение нечётное; Int16Array требует выравнивания, поэтому копируем
  const pcm = new Int16Array(bytes.slice(0, bytes.byteLength - (bytes.byteLength % 2)).buffer);
  if (!pcm.length) return;
  const buffer = ctx.createBuffer(1, pcm.length, 24000);
  const ch = buffer.getChannelData(0);
  for (let i = 0; i < pcm.length; i++) ch[i] = pcm[i] / 32768;
  const src = ctx.createBufferSource(); src.buffer = buffer; src.connect(ctx.destination);
  // Догон: отстали больше 3 с — читаем чуть быстрее, больше 6 с — заметно быстрее
  const rate = cur.rate;
  src.playbackRate.value = rate;
  playhead = Math.max(playhead, ctx.currentTime + 0.08);
  src.start(playhead); playhead += buffer.duration / rate;
  sources.push(src); src.onended = () => { sources = sources.filter((s) => s !== src); };
}
// --- Озвучка голосом телефона (бесплатный запасной вариант) ------------------------
const sayQueue = []; let saying = false;
function sayNext() {
  if (saying || !sayQueue.length || !window.speechSynthesis) return;
  const text = sayQueue.shift(); saying = true;
  const u = new SpeechSynthesisUtterance(text); u.lang = lang === "ru" ? "ru-RU" : "de-DE";
  const v = speechSynthesis.getVoices().find((x) => x.lang.replace("_", "-").toLowerCase().startsWith(u.lang.toLowerCase()) && !x.name.includes("Eloquence"));
  if (v) u.voice = v; u.onend = u.onerror = () => { saying = false; sayNext(); };
  speechSynthesis.speak(u);
}
function stopAll() {
  for (const s of sources) { try { s.stop(); } catch {} }
  sources = []; playhead = 0; cur = null;
  sayQueue.length = 0; saying = false; if (window.speechSynthesis) speechSynthesis.cancel();
  bgQueue.length = 0; for (const k in collecting) delete collecting[k];
}

function onPhrase(p) {
  phrases.push(p); while (phrases.length > 8) phrases.shift();
  render();
  if (p.dst === lang && voiceMode === "phone") { sayQueue.push(p.dstText); while (sayQueue.length > 3) sayQueue.shift(); sayNext(); }
}

function connect() {
  ws = new WebSocket(location.origin.replace(/^http/, "ws") + "/listen-ws?key=" + encodeURIComponent(key) + "&lang=" + lang);
  ws.binaryType = "arraybuffer";
  ws.onopen = () => { ws.send(JSON.stringify({ lang })); showState(); };
  ws.onmessage = (e) => {
    if (typeof e.data !== "string") {
      const view = new DataView(e.data); const id = view.getUint32(0, true); const kind = view.getUint8(4);
      onAudioFrame(id, kind, new Uint8Array(e.data, 5));
      return;
    }
    const m = JSON.parse(e.data);
    if (m.type === "phrase") onPhrase(m);
    else if (m.type === "partial") { const cyr = (m.text.match(/[\u0400-\u04FF]/g) || []).length, lat = (m.text.match(/[A-Za-z]/g) || []).length; $("partial").textContent = m.text && (cyr >= lat ? "ru" : "de") === lang ? "… " + m.text : ""; }
    else if (m.type === "state") { state = m; showState(); }
    else if (m.type === "hello") { phrases.length = 0; for (const p of m.recent || []) phrases.push(p); render(); }
  };
  ws.onclose = () => { showState(); setTimeout(connect, 2000 + Math.random() * 2000); };
}

async function keepAwake() {
  try { if (navigator.wakeLock) { let lock = await navigator.wakeLock.request("screen"); document.addEventListener("visibilitychange", async () => { if (document.visibilityState === "visible") lock = await navigator.wakeLock.request("screen").catch(() => lock); }); } } catch {}
}
// Тихий зацикленный звук: пока он играет, iOS не усыпляет страницу при погашенном экране.
function silentWav(seconds) {
  const rate = 8000, n = rate * seconds, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); str(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, n * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}
const keepalive = new Audio(); keepalive.loop = true; keepalive.setAttribute("playsinline", "");
let silentUrl = null;
// Фон (экран погашен): Web Audio на iPhone засыпает, а обычный <audio> играет дальше. Поэтому в фоне
// куски фразы собираются в WAV и проигрываются тем же элементом, что крутит тишину.
let hidden = document.visibilityState !== "visible";
const collecting = {}; const bgQueue = []; let bgPlaying = false;
function wavBlob(chunks) {
  const n = chunks.reduce((a, c) => a + c.byteLength, 0); const buf = new ArrayBuffer(44 + n), v = new DataView(buf), u = new Uint8Array(buf);
  const str = (o, t) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
  str(0, "RIFF"); v.setUint32(4, 36 + n, true); str(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 24000, true); v.setUint32(28, 48000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, "data"); v.setUint32(40, n, true);
  let o = 44; for (const c of chunks) { u.set(c, o); o += c.byteLength; }
  return new Blob([buf], { type: "audio/wav" });
}
function playBgNext() {
  if (bgPlaying || !bgQueue.length) return;
  bgPlaying = true; keepalive.loop = false; keepalive.src = URL.createObjectURL(bgQueue.shift()); keepalive.play().catch(() => { bgPlaying = false; });
}
keepalive.onended = () => {
  if (keepalive.src !== silentUrl) URL.revokeObjectURL(keepalive.src);
  bgPlaying = false;
  if (bgQueue.length) playBgNext();
  else { keepalive.loop = true; keepalive.src = silentUrl; keepalive.play().catch(() => {}); }
};
function onAudioFrame(id, kind, bytes) {
  if (voiceMode !== "server") return;
  if (!hidden && !bgPlaying) { if (kind === 1) playPcm(id, bytes); return; }
  if (kind === 1) { (collecting[id] = collecting[id] || []).push(bytes.slice(0)); }
  else if (kind === 2 && collecting[id]) { bgQueue.push(wavBlob(collecting[id])); delete collecting[id]; while (bgQueue.length > 3) bgQueue.shift(); playBgNext(); }
}

$("go").onclick = () => {
  started = true; $("go").style.display = "none"; $("explain").style.display = "none";
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch {}
  try { ctx = new AudioContext({ sampleRate: 24000 }); ctx.resume().catch(() => {}); } catch { ctx = new AudioContext(); }
  // Короткий звук в жесте пользователя — разблокирует Web Audio на iPhone
  try { const b = ctx.createBuffer(1, 240, ctx.sampleRate); const s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(); } catch {}
  silentUrl = silentWav(2); keepalive.src = silentUrl; keepalive.play().catch(() => {});
  if (window.speechSynthesis) { speechSynthesis.getVoices(); const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); }
  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: lang === "de" ? "Übersetzung" : "Перевод", artist: "Gemeinde Leverkusen" });
      navigator.mediaSession.setActionHandler("pause", () => {}); navigator.mediaSession.setActionHandler("play", () => {});
    } catch {}
  }
  keepAwake();
  showState();
  connect();
};
document.addEventListener("visibilitychange", () => {
  hidden = document.visibilityState !== "visible";
  if (!started || hidden) return;
  if (keepalive.paused) keepalive.play().catch(() => {});
  if (ctx && ctx.state !== "running") ctx.resume().catch(() => {});
});
applyLang();
</script>
</html>`;
