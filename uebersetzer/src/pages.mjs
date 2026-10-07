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
  <label>Источник: <select id="source"><option value="mic">микрофон этого компьютера</option><option value="stream">стрим зала (с пульта)</option></select></label>
  <label>Вход: <select id="device"></select></label>
  <button id="start" class="primary">Старт</button>
  <button id="pause" class="pause" disabled>Пауза</button>
</div>
<div class="row">
  <span>Уровень</span><div id="meter"><div></div><i></i></div>
  <label>Порог речи <input id="thr" type="range" min="100" max="4000" step="50" value="500"> <span id="thrv">500</span></label>
</div>
<div id="state">Не запущено.</div>
<div id="live" style="color:#9aa;min-height:1.4rem;font-style:italic"></div>
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
    // Сигнал идёт с пульта (линейный вход): никаких браузерных обработок для микрофона
    audio: { deviceId: deviceId ? { exact: deviceId } : undefined, channelCount: 1, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
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
  ws.onopen = () => { ws.send(JSON.stringify({ threshold: Number(thr.value) })); ws.send(JSON.stringify({ source: $("source").value })); $("state").textContent = "В эфире. Распознаю речь зала (" + MODELS.stt + " → " + MODELS.text + " → " + MODELS.tts + ")."; };
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.type === "phrase") phrase(m);
    else if (m.type === "partial") $("live").textContent = m.text ? "… " + m.text : "";
    else if (m.type === "source") $("state").textContent = m.source === "stream" ? "В эфире: звук со стрима зала (пульт). Микрофон этого компьютера не используется." : "В эфире: микрофон этого компьютера.";
    else if (m.type === "stats") $("stats").textContent = "Слушают: RU " + m.listeners.ru + ", DE " + m.listeners.de + " · фраз " + m.phrases + " · распознано " + m.sttMinutes.toFixed(1) + " мин · ≈ $" + m.cost.toFixed(2) + " · сессия " + m.minutes.toFixed(0) + " мин";
    else if (m.type === "error") $("err").textContent = "Ошибка: " + m.message;
  };
  ws.onclose = (e) => { $("state").textContent = e.reason === "replaced" ? "Отключено: оператор подключился с другого устройства." : "Остановлено."; cleanup(); };
  const cleanup = () => { stream.getTracks().forEach((t) => t.stop()); ctx.close().catch(() => {}); $("start").textContent = "Старт"; $("start").className = "primary"; $("pause").disabled = true; stop = null; };
  stop = () => ws.close();
  $("start").textContent = "Стоп"; $("start").className = "stop"; $("pause").disabled = false;
}
$("start").onclick = () => (stop ? stop() : start().catch((e) => ($("err").textContent = "Ошибка: " + e.message)));
$("source").onchange = () => { if (ws && ws.readyState === 1) ws.send(JSON.stringify({ source: $("source").value })); };
$("pause").onclick = () => { paused = !paused; ws && ws.send(JSON.stringify({ paused })); $("pause").textContent = paused ? "Продолжить" : "Пауза"; $("state").textContent = paused ? "ПАУЗА — звук не распознаётся (пение, музыка)." : "В эфире."; };
</script>
</html>`;

