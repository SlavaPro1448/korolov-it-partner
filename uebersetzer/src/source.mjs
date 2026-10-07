// Источник звука «стрим зала»: ffmpeg читает mp3 из Icecast внутри docker-сети и отдаёт
// PCM16 24 кГц моно кусками по 100 мс в конвейер. Ничего не сохраняется.
import { spawn } from "node:child_process";

const CHUNK = 4800; // 100 мс

export function startStreamSource({ url, onChunk, log = console }) {
  let stopped = false;
  let child = null;
  let rest = Buffer.alloc(0);

  function run() {
    if (stopped) return;
    child = spawn("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-nostdin",
      "-fflags", "nobuffer", "-flags", "low_delay",
      "-i", url,
      "-f", "s16le", "-ac", "1", "-ar", "24000", "-",
    ]);
    log.info(`[source] ffmpeg gestartet: ${url}`);
    child.stdout.on("data", (buf) => {
      let data = Buffer.concat([rest, buf]);
      while (data.length >= CHUNK) {
        onChunk(data.subarray(0, CHUNK));
        data = data.subarray(CHUNK);
      }
      rest = data;
    });
    child.stderr.on("data", (d) => log.error("[source] ffmpeg:", String(d).trim()));
    child.on("exit", (code) => {
      child = null;
      if (stopped) return;
      log.info(`[source] ffmpeg beendet (${code}), neu starten…`);
      setTimeout(run, 2000);
    });
  }
  run();
  return {
    stop() {
      stopped = true;
      try { child?.kill("SIGTERM"); } catch { /* egal */ }
    },
  };
}
