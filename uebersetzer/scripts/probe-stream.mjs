// Проба потокового распознавания без сервера: PCM-файл (s16le mono 24 kHz) в реальном времени
// → Realtime transcription → перевод → озвучка. Печатает тайминги и текст (только тестовый звук!).
//   OPENAI_API_KEY=… node scripts/probe-stream.mjs <file.pcm>
import { readFileSync } from "node:fs";
import { createStreamingPipeline } from "../src/stream.mjs";

const file = process.argv[2];
const pcm = readFileSync(file);
const t0 = Date.now();
const stamp = () => ((Date.now() - t0) / 1000).toFixed(1) + "s";
let audioBytes = 0;
const p = createStreamingPipeline({
  apiKey: process.env.OPENAI_API_KEY,
  sttPrompt: process.env.STT_PROMPT ?? "",
  onPartial: (text) => text && console.log(`${stamp()} partial: ${text}`),
  onPhrase: (ph) => console.log(`${stamp()} phrase #${ph.id} [${ph.src}] ${ph.srcText}\n       -> [${ph.dst}] ${ph.dstText}`),
  onAudio: (id, lang, chunk) => {
    if (!audioBytes) console.log(`${stamp()} audio #${id} first chunk`);
    audioBytes += chunk.length;
  },
  onAudioEnd: (id) => console.log(`${stamp()} audio #${id} end, ${(audioBytes / 48000).toFixed(1)} s`),
});
await new Promise((r) => setTimeout(r, 1500));
const CHUNK = 4800;
let offset = 0;
await new Promise((resolve) => {
  const timer = setInterval(() => {
    if (offset < pcm.length + CHUNK * 20) {
      p.send(offset < pcm.length ? pcm.subarray(offset, offset + CHUNK) : Buffer.alloc(CHUNK));
      offset += CHUNK;
    } else {
      clearInterval(timer);
      resolve();
    }
  }, 100);
});
console.log(`${stamp()} audio sent (${(pcm.length / 48000).toFixed(1)} s), waiting…`);
await new Promise((r) => setTimeout(r, 12000));
p.close();
console.log("stats", JSON.stringify(p.stats));
process.exit(0);
