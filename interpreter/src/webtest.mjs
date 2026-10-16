// Browser-Testseite: Übersetzung ohne Telefonie ausprobieren (Mikrofon -> OpenAI -> Kopfhörer).
// Ein Gerät allein hört die eigene Übersetzung; zwei Geräte (ru + de) hören sich gegenseitig.
const MAX_PARTICIPANTS = 2;
const MAX_SECONDS = 600;
const identity = (base64) => base64;

export function attachTestSocket(ws, { lang, room, createTranslator, live, log = console }) {
  if (room.size >= MAX_PARTICIPANTS) return ws.close(1013, "busy");
  const me = { ws, lang };
  room.add(me);
  // Diagnose der Testseite: Zähler und Text landen im Log (nur eigene Testsprache, keine Telefonate)
  const stats = { inChunks: 0, outChunks: 0, in: "", out: "" };
  const started = Date.now();
  const flush = setInterval(() => {
    if (!stats.in && !stats.out && !stats.outChunks) return;
    const at = Math.round((Date.now() - started) / 1000);
    log.info(
      `[test:${lang}] t=${at}s in=${stats.inChunks} out=${stats.outChunks} | ${stats.in} => ${stats.out}`,
    );
    stats.outChunks = 0;
    stats.in = "";
    stats.out = "";
  }, 5000);
  const listener = () => [...room].find((other) => other !== me) ?? me;
  const translator = createTranslator({
    sourceLanguage: lang,
    targetLanguage: lang === "ru" ? "de" : "ru",
    label: `test:${lang}`,
    decodeInput: identity,
    encodeOutput: identity,
    onAudio: (base64) => {
      stats.outChunks += 1;
      const target = listener().ws;
      if (target.readyState === 1) target.send(Buffer.from(base64, "base64"));
    },
    onTranscript: (direction, text) => {
      stats[direction] += text;
      live?.publish(lang === "ru" ? "owner" : "peer", direction, text);
      if (ws.readyState === 1) ws.send(JSON.stringify({ [direction]: text }));
    },
  });
  const timer = setTimeout(() => ws.close(1000, "time limit"), MAX_SECONDS * 1000);

  ws.on("message", (data, isBinary) => {
    if (isBinary) {
      stats.inChunks += 1;
      translator.send(data.toString("base64"));
    } else {
      log.info(`[test:${lang}] client ${String(data).slice(0, 300)}`);
    }
  });
  ws.on("close", () => {
    clearTimeout(timer);
    clearInterval(flush);
    log.info(`[test:${lang}] getrennt nach ${Math.round((Date.now() - started) / 1000)}s`);
    room.delete(me);
    translator.close();
  });
}

export const TEST_PAGE = `<!doctype html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Тест переводчика</title>
<style>
  body { font: 17px/1.5 system-ui, sans-serif; max-width: 30rem; margin: 2rem auto; padding: 0 1rem; }
  button, select { font: inherit; padding: .7rem 1rem; border-radius: .6rem; border: 1px solid #888; }
  button { width: 100%; margin-top: 1rem; background: #1d4ed8; color: #fff; border: 0; }
  button.stop { background: #b91c1c; }
  #status { margin-top: 1rem; min-height: 3rem; }
  small { color: #666; }
</style>
<h1>Тест переводчика</h1>
<p><label>Я говорю:
  <select id="lang"><option value="ru">по-русски</option><option value="de">по-немецки</option></select>
</label></p>
<p><label>Режим:
  <select id="mode">
    <option value="live">синхронный (быстрый)</option>
    <option value="seq">по фразам (точнее, с паузой)</option>
  </select>
</label></p>
<p><small>Наденьте наушники. Одно устройство: вы слышите собственный перевод. Два устройства
(на втором выберите другой язык): каждый слышит перевод собеседника. Лимит 10 минут.</small></p>
<button id="toggle">Начать</button>
<div id="status"></div>
<p><small>Распознано:</small><br><span id="heard"></span></p>
<p><small>Перевод (текст):</small><br><span id="translated"></span></p>
<script>
const WORKLET = \`
class Capture extends AudioWorkletProcessor {
  constructor() { super(); this.chunks = []; this.size = 0; }
  process(inputs) {
    const input = inputs[0][0];
    if (input) {
      this.chunks.push(new Float32Array(input)); this.size += input.length;
      if (this.size >= 2400) {
        const pcm = new Int16Array(this.size); let o = 0;
        for (const c of this.chunks) for (let i = 0; i < c.length; i++) {
          const v = Math.max(-1, Math.min(1, c[i])); pcm[o++] = v < 0 ? v * 32768 : v * 32767;
        }
        this.port.postMessage(pcm.buffer, [pcm.buffer]); this.chunks = []; this.size = 0;
      }
    }
    return true;
  }
}
registerProcessor("capture", Capture);\`;
const button = document.getElementById("toggle"), statusEl = document.getElementById("status");
let stop = null;
const say = (text) => (statusEl.textContent = text);

async function start() {
  const lang = document.getElementById("lang").value;
  const mode = document.getElementById("mode").value;
  document.getElementById("heard").textContent = "";
  document.getElementById("translated").textContent = "";
  const ctx = new AudioContext({ sampleRate: 24000 });
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
  });
  await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET], { type: "text/javascript" })));
  const key = new URLSearchParams(location.search).get("key");
  const ws = new WebSocket(location.origin.replace(/^http/, "ws") + "/test-ws?key=" + encodeURIComponent(key) + "&lang=" + lang + "&mode=" + mode);
  ws.binaryType = "arraybuffer";
  const node = new AudioWorkletNode(ctx, "capture");
  ctx.createMediaStreamSource(stream).connect(node);
  node.port.onmessage = (e) => ws.readyState === 1 && ws.send(e.data);
  let playhead = 0;
  ws.onmessage = (e) => {
    if (typeof e.data === "string") {
      const msg = JSON.parse(e.data);
      if (msg.in) document.getElementById("heard").textContent += msg.in;
      if (msg.out) document.getElementById("translated").textContent += msg.out;
      return;
    }
    const pcm = new Int16Array(e.data);
    const buffer = ctx.createBuffer(1, pcm.length, 24000);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < pcm.length; i++) channel[i] = pcm[i] / 32768;
    const source = ctx.createBufferSource();
    source.buffer = buffer; source.connect(ctx.destination);
    playhead = Math.max(playhead, ctx.currentTime + 0.05);
    source.start(playhead); playhead += buffer.duration;
  };
  ctx.onstatechange = () => ws.readyState === 1 && ws.send(JSON.stringify({ ctx: ctx.state }));
  ws.onopen = () => {
    const track = stream.getAudioTracks()[0];
    ws.send(JSON.stringify({ rate: ctx.sampleRate, state: ctx.state, mic: track.label, settings: track.getSettings(), ua: navigator.userAgent }));
    say("Соединено. Говорите — перевод пойдёт с отставанием в несколько секунд.");
  };
  ws.onclose = (e) => { say(e.reason === "busy" ? "Занято: уже подключены два устройства." : "Остановлено."); cleanup(); };
  const cleanup = () => {
    stream.getTracks().forEach((t) => t.stop()); ctx.close().catch(() => {});
    button.textContent = "Начать"; button.classList.remove("stop"); stop = null;
  };
  stop = () => ws.close();
  button.textContent = "Остановить"; button.classList.add("stop");
}
button.onclick = () => (stop ? stop() : start().catch((e) => say("Ошибка: " + e.message)));
</script>
</html>`;
