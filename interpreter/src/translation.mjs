// Eine Übersetzungsrichtung: Audio eines Teilnehmers -> OpenAI Realtime Translation -> Audio in
// der Zielsprache. Transkripte werden bewusst weder gespeichert noch geloggt.
import WebSocket from "ws";
import { realtimeToTwilio, twilioToRealtime } from "./audio.mjs";

const ENDPOINT = "wss://api.openai.com/v1/realtime/translations";
const MAX_PENDING = 250; // ~5 s Audio, solange die Verbindung noch aufgebaut wird

export function buildSessionUpdate(targetLanguage) {
  return {
    type: "session.update",
    session: {
      audio: {
        input: {
          transcription: { model: "gpt-realtime-whisper" },
          noise_reduction: { type: "near_field" },
        },
        output: { language: targetLanguage },
      },
    },
  };
}

export function createTranslator({
  apiKey,
  model = "gpt-realtime-translate",
  targetLanguage,
  label,
  onAudio,
  // Standard: Twilio-Audio (μ-law 8 kHz). Die Browser-Testseite liefert bereits PCM16 24 kHz.
  decodeInput = twilioToRealtime,
  encodeOutput = realtimeToTwilio,
  // Nur für die Testseite: erkannter und übersetzter Text. Bei Telefonaten nicht gesetzt.
  onTranscript = null,
  log = console,
  WebSocketImpl = WebSocket,
}) {
  const url = `${ENDPOINT}?model=${encodeURIComponent(model)}`;
  const socket = new WebSocketImpl(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  const pending = [];

  socket.on("open", () => {
    socket.send(JSON.stringify(buildSessionUpdate(targetLanguage)));
    for (const payload of pending.splice(0)) socket.send(payload);
    log.info(`[translate:${label}] verbunden -> ${targetLanguage}`);
  });

  socket.on("message", (data) => {
    let event;
    try {
      event = JSON.parse(data.toString("utf8"));
    } catch {
      return;
    }
    if (event.type === "session.output_audio.delta" && typeof event.delta === "string") {
      onAudio(encodeOutput(event.delta));
    } else if (onTranscript && event.type === "session.input_transcript.delta") {
      onTranscript("in", event.delta);
    } else if (onTranscript && event.type === "session.output_transcript.delta") {
      onTranscript("out", event.delta);
    } else if (event.type === "error") {
      log.error(`[translate:${label}] Fehler`, event.error?.code, event.error?.message);
    }
  });

  socket.on("close", (code) => log.info(`[translate:${label}] geschlossen (${code})`));
  socket.on("error", (error) => log.error(`[translate:${label}] WebSocket-Fehler`, error.message));

  return {
    send(twilioPayload) {
      const payload = JSON.stringify({
        type: "session.input_audio_buffer.append",
        audio: decodeInput(twilioPayload),
      });
      if (socket.readyState === 1) socket.send(payload);
      else if (socket.readyState === 0 && pending.length < MAX_PENDING) pending.push(payload);
    },
    close() {
      try {
        socket.close();
      } catch {
        // bereits geschlossen
      }
    },
  };
}
