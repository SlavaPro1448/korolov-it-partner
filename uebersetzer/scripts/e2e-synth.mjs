// Сквозной тест без микрофона: шлёт PCM-файл (s16le mono 24 kHz) в /operator-ws в реальном
// времени и печатает, что получил слушатель противоположного языка (текст + размер mp3).
//   node scripts/e2e-synth.mjs <base-url> <operator-key> <listen-key> <file.pcm> <listener-lang>
import { readFileSync } from "node:fs";
import WebSocket from "ws";

const [base, opKey, listenKey, file, lang = "ru"] = process.argv.slice(2);
if (!file) {
  console.error("usage: node scripts/e2e-synth.mjs <base-url> <operator-key> <listen-key> <file.pcm> [ru|de]");
  process.exit(1);
}
const wsBase = base.replace(/^http/, "ws");
const pcm = readFileSync(file);
const CHUNK = 2400 * 2; // 100 ms
const t0 = Date.now();
const audioBytes = {};
const stamp = () => ((Date.now() - t0) / 1000).toFixed(1) + "s";

const listener = new WebSocket(`${wsBase}/listen-ws?key=${encodeURIComponent(listenKey)}&lang=${lang}`);
listener.on("message", (data, isBinary) => {
  if (isBinary) {
    const id = data.readUInt32LE(0), kind = data.readUInt8(4);
    if (kind === 2) console.log(`${stamp()} listener: audio #${id} end, total ${(audioBytes[id] / 48000).toFixed(1)} s`);
    else { if (!audioBytes[id]) console.log(`${stamp()} listener: audio #${id} first chunk`); audioBytes[id] = (audioBytes[id] || 0) + data.length - 5; }
  } else {
    const m = JSON.parse(String(data));
    if (m.type === "phrase") console.log(`${stamp()} listener: [${m.src}] ${m.srcText}\n       -> [${m.dst}] ${m.dstText}`);
    else console.log(`${stamp()} listener: ${m.type}`, m.type === "state" ? JSON.stringify(m) : "");
  }
});
await new Promise((r) => listener.on("open", r));

const op = new WebSocket(`${wsBase}/operator-ws?key=${encodeURIComponent(opKey)}`);
op.on("message", (data) => {
  const m = JSON.parse(String(data));
  if (m.type === "error") console.log(`${stamp()} operator error: ${m.message}`);
});
await new Promise((r) => op.on("open", r));
op.send(JSON.stringify({ threshold: 300 }));

let offset = 0;
const silence = Buffer.alloc(CHUNK);
await new Promise((resolve) => {
  const timer = setInterval(() => {
    if (offset < pcm.length) {
      op.send(pcm.subarray(offset, offset + CHUNK));
      offset += CHUNK;
    } else if (offset < pcm.length + CHUNK * 15) {
      op.send(silence); // 1.5 с тишины, чтобы закрыть фразу
      offset += CHUNK;
    } else {
      clearInterval(timer);
      resolve();
    }
  }, 100);
});
console.log(`${stamp()} audio sent (${(pcm.length / 48000).toFixed(1)} s), waiting 20 s for results…`);
await new Promise((r) => setTimeout(r, 20000));
op.close();
listener.close();
