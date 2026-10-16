// Live-Textanzeige während eines Gesprächs: Original und Übersetzung laufen als Text mit.
// Der Text wird nur an geöffnete Seiten durchgereicht, nicht gespeichert und nicht geloggt.
// Während eines Gesprächs bleibt sein Text im Speicher, damit eine später geöffnete App ihn
// nachlesen kann; mit dem Gesprächsende wird er verworfen.
const BACKLOG_LIMIT = 2000;

export function createLiveFeed() {
  const sockets = new Set();
  let backlog = [];
  const broadcast = (payload) => {
    for (const ws of sockets) if (ws.readyState === 1) ws.send(payload);
  };
  return {
    attach(ws) {
      sockets.add(ws);
      ws.on("close", () => sockets.delete(ws));
      for (const payload of backlog) if (ws.readyState === 1) ws.send(payload);
    },
    // role: "owner" | "peer", dir: "in" (Original) | "out" (Übersetzung)
    publish(role, dir, text) {
      if (!text) return;
      const payload = JSON.stringify({ role, dir, text, at: Date.now() });
      if (backlog.length > 0 && backlog.length < BACKLOG_LIMIT) backlog.push(payload);
      broadcast(payload);
    },
    event(name) {
      const payload = JSON.stringify({ event: name, at: Date.now() });
      backlog = name === "start" ? [payload] : [];
      broadcast(payload);
    },
  };
}

export const LIVE_PAGE = `<!doctype html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Переводчик — текст разговора</title>
<style>
  body { font: 17px/1.5 system-ui, sans-serif; max-width: 46rem; margin: 1rem auto; padding: 0 1rem; }
  h1 { font-size: 1.2rem; margin: 0 0 .3rem; }
  #state { color: #666; font-size: .9rem; margin-bottom: 1rem; }
  .turn { border-left: 4px solid #1d4ed8; padding: .2rem 0 .2rem .8rem; margin: 0 0 1rem; }
  .turn.owner { border-color: #9ca3af; }
  .who { font-size: .8rem; color: #666; }
  .main { font-size: 1.25rem; }
  .turn.owner .main { font-size: 1rem; }
  .orig { color: #555; font-size: .95rem; }
  @media (prefers-color-scheme: dark) { body { background: #111; color: #eee; } .orig, .who, #state { color: #aaa; } }
</style>
<h1>Текст разговора</h1>
<div id="state">Подключение…</div>
<div id="log"></div>
<script>
const log = document.getElementById("log"), state = document.getElementById("state");
const NAMES = { peer: "Собеседник", owner: "Вы" };
const current = {};      // role -> { el, main, orig, lastIn }
function turn(role) {
  const el = document.createElement("div");
  el.className = "turn " + role;
  el.innerHTML = '<div class="who"></div><div class="main"></div><div class="orig"></div>';
  el.querySelector(".who").textContent = NAMES[role];
  log.appendChild(el);
  return (current[role] = { el, main: el.querySelector(".main"), orig: el.querySelector(".orig"), lastIn: Date.now() });
}
function onText({ role, dir, text }) {
  let t = current[role];
  // Neuer Absatz nach einer Sprechpause von 4 s oder wenn inzwischen der andere gesprochen hat
  const stale = !t || (dir === "in" && (Date.now() - t.lastIn > 4000 || log.lastElementChild !== t.el));
  if (stale) t = turn(role);
  if (dir === "in") { t.lastIn = Date.now(); t.orig.textContent += text; }
  // Собеседник: крупно перевод (русский), мелко оригинал. Вы: крупно ваш текст не нужен — показываем перевод на немецкий.
  else t.main.textContent += text;
  window.scrollTo(0, document.body.scrollHeight);
}
function connect() {
  const key = new URLSearchParams(location.search).get("key");
  const ws = new WebSocket(location.origin.replace(/^http/, "ws") + "/live-ws?key=" + encodeURIComponent(key));
  ws.onopen = () => (state.textContent = "Подключено. Текст появится, когда начнётся разговор. Ничего не сохраняется.");
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.event === "start") { log.textContent = ""; for (const k in current) delete current[k]; state.textContent = "Идёт разговор."; }
    else if (msg.event === "end") state.textContent = "Разговор завершён.";
    else onText(msg);
  };
  ws.onclose = () => { state.textContent = "Нет связи, переподключение…"; setTimeout(connect, 2000); };
}
connect();
</script>
</html>`;
