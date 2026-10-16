// Wählseite für ausgehende Anrufe im Stil der iPhone-Tastatur. Der Server ruft zuerst den Inhaber
// an und wählt danach die Zielnummer – mit Dolmetscher oder als gewöhnlicher Anruf.
export const CALL_PAGE = `<!doctype html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="robots" content="noindex">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="theme-color" content="#000">
<title>Переводчик</title>
<style>
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { height: 100%; margin: 0; background: #000; color: #fff;
    font: 17px -apple-system, "SF Pro", system-ui, sans-serif; }
  body { display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
    padding: max(16px, env(safe-area-inset-top)) 16px max(28px, env(safe-area-inset-bottom)); gap: 18px; }
  .mode { display: flex; background: #1c1c1e; border-radius: 10px; padding: 2px; width: 100%; max-width: 340px; }
  .mode button { flex: 1; border: 0; background: transparent; color: #fff; font: 15px/1 inherit; padding: 9px 4px;
    border-radius: 8px; }
  .mode button.on { background: #636366; font-weight: 600; }
  #display { min-height: 56px; font-size: 38px; letter-spacing: 1px; text-align: center; width: 100%;
    overflow: hidden; white-space: nowrap; }
  #status { min-height: 22px; color: #8e8e93; font-size: 15px; text-align: center; }
  .pad { display: grid; grid-template-columns: repeat(3, 76px); gap: 18px 26px; }
  .key { width: 76px; height: 76px; border-radius: 50%; border: 0; background: #2c2c2e; color: #fff;
    display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .key:active { background: #5a5a5e; }
  .key .d { font-size: 34px; line-height: 1; font-weight: 300; }
  .key .l { font-size: 10px; letter-spacing: 2px; margin-top: 2px; color: #ddd; }
  .row { display: grid; grid-template-columns: repeat(3, 76px); gap: 18px 26px; align-items: center; justify-items: center; }
  #call { width: 76px; height: 76px; border-radius: 50%; border: 0; background: #34c759; color: #fff; font-size: 34px; }
  #call:disabled { background: #2c6e3a; }
  #del { width: 76px; height: 76px; border: 0; background: transparent; color: #8e8e93; font-size: 30px; visibility: hidden; }
  #recent { width: 100%; max-width: 340px; display: flex; gap: 8px; overflow-x: auto; }
  #recent button { border: 0; background: #1c1c1e; color: #0a84ff; border-radius: 14px; padding: 6px 12px; font: 14px inherit; white-space: nowrap; }
</style>
<div class="mode">
  <button id="mTranslate" class="on">Синхронно</button>
  <button id="mSeq">По фразам</button>
  <button id="mPlain">Без перевода</button>
</div>
<div id="recent"></div>
<div id="display"></div>
<div id="status"></div>
<div class="pad" id="pad"></div>
<div class="row"><span></span><button id="call">&#9742;</button><button id="del">&#9003;</button></div>
<script>
const KEYS = [["1",""],["2","ABC"],["3","DEF"],["4","GHI"],["5","JKL"],["6","MNO"],["7","PQRS"],["8","TUV"],["9","WXYZ"],["*",""],["0","+"],["#",""]];
const pad = document.getElementById("pad"), display = document.getElementById("display"), statusEl = document.getElementById("status");
const call = document.getElementById("call"), del = document.getElementById("del"), recentEl = document.getElementById("recent");
const key = new URLSearchParams(location.search).get("key");
let number = "", mode = "translate", holdTimer;
const MESSAGES = {
  format: "Не понял номер. Наберите с 0 (0214…) или с кодом страны (+49…).",
  country: "Звонить можно только в Германию и Чехию.",
  premium: "Платные номера (0900, 0180, 0137, 118…) закрыты.",
  number: "Этот номер набрать нельзя.",
  length: "В номере не то количество цифр — проверьте его.",
  busy: "Переводчик занят другим разговором.",
};
function render() {
  display.textContent = number;
  display.style.fontSize = number.length > 12 ? "28px" : "38px";
  del.style.visibility = number ? "visible" : "hidden";
}
for (const [d, letters] of KEYS) {
  const b = document.createElement("button"); b.className = "key";
  b.innerHTML = '<span class="d">' + d + '</span><span class="l">' + letters + '</span>';
  b.onclick = () => { if (number.length < 20) { number += d; render(); } };
  if (d === "0") {
    b.ontouchstart = b.onmousedown = () => { holdTimer = setTimeout(() => { number += "+"; render(); b.dataset.held = "1"; }, 450); };
    b.ontouchend = b.onmouseup = b.onmouseleave = () => clearTimeout(holdTimer);
    b.onclick = () => { if (b.dataset.held) { delete b.dataset.held; return; } if (number.length < 20) { number += "0"; render(); } };
  }
  pad.appendChild(b);
}
del.onclick = () => { number = number.slice(0, -1); render(); };
del.onpointerdown = () => { holdTimer = setTimeout(() => { number = ""; render(); }, 600); };
del.onpointerup = del.onpointerleave = () => clearTimeout(holdTimer);
const MODES = [["mTranslate", "translate"], ["mSeq", "seq"], ["mPlain", "plain"]];
const MODE_HINT = {
  translate: "",
  seq: "Перевод по фразам: точнее для номеров и имён, пауза 2–3 с после каждой фразы.",
  plain: "Обычный звонок: без объявления и перевода.",
};
for (const [id, m] of MODES) {
  document.getElementById(id).onclick = () => {
    mode = m;
    for (const [otherId, otherMode] of MODES) document.getElementById(otherId).classList.toggle("on", otherMode === m);
    statusEl.textContent = MODE_HINT[m];
  };
}
function recent() {
  try { return JSON.parse(localStorage.getItem("recent") || "[]"); } catch { return []; }
}
function renderRecent() {
  recentEl.innerHTML = "";
  for (const n of recent()) { const b = document.createElement("button"); b.textContent = n; b.onclick = () => { number = n; render(); }; recentEl.appendChild(b); }
}
function remember(n) {
  try { localStorage.setItem("recent", JSON.stringify([n, ...recent().filter((x) => x !== n)].slice(0, 5))); } catch {}
  renderRecent();
}
call.onclick = async () => {
  if (!number) return;
  call.disabled = true; statusEl.textContent = "Сейчас зазвонит ваш телефон…";
  try {
    const res = await fetch("/call?key=" + encodeURIComponent(key), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: number, mode }) });
    const data = await res.json().catch(() => ({}));
    if (data.ok) { statusEl.textContent = "Возьмите трубку — " + (mode === "plain" ? "дальше набираем собеседника." : "подключаю переводчика."); remember(number); }
    else statusEl.textContent = MESSAGES[data.error] || "Не получилось: " + (data.error || res.status);
  } catch { statusEl.textContent = "Нет связи с сервером."; }
  setTimeout(() => (call.disabled = false), 5000);
};
render(); renderRecent();
</script>
</html>`;
