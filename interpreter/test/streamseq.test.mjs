// Streaming "По фразам": Sätze werden übersetzt, sobald sie erkannt sind, nicht erst am Ende.
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { test } from "node:test";
import { createStreamingSequential } from "../src/streamseq.mjs";

class FakeSocket extends EventEmitter {
  static last = null;
  constructor() {
    super();
    this.readyState = 1;
    this.sent = [];
    FakeSocket.last = this;
    setImmediate(() => this.emit("open"));
  }
  send(data) {
    this.sent.push(JSON.parse(data));
  }
  close() {}
  server(event) {
    this.emit("message", Buffer.from(JSON.stringify(event)));
  }
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

function fakeFetch(calls) {
  return async (url, init) => {
    const body = JSON.parse(init.body);
    if (url.endsWith("/chat/completions")) {
      const text = body.messages.at(-1).content;
      calls.push({ text, system: body.messages[0].content });
      return { ok: true, json: async () => ({ choices: [{ message: { content: `RU(${text})` } }] }) };
    }
    calls.push({ tts: body.input });
    return {
      ok: true,
      body: (async function* () {
        yield Buffer.alloc(600, 1);
      })(),
    };
  };
}

test("streaming phrases: a finished sentence is translated while the speaker goes on; short 'Ja.' too", async () => {
  const calls = [];
  const audio = [];
  const seq = createStreamingSequential({
    apiKey: "k",
    sourceLanguage: "de",
    targetLanguage: "ru",
    label: "t",
    onAudio: (b64) => audio.push(b64),
    log: { info() {}, error() {} },
    fetchImpl: fakeFetch(calls),
    WebSocketImpl: FakeSocket,
  });
  await tick();
  const ws = FakeSocket.last;
  assert.equal(ws.sent[0].session.audio.input.turn_detection.type, "server_vad");
  assert.equal(ws.sent[0].session.audio.input.transcription.language, "de");

  seq.send("AAAA"); // vor "bereit": zwischengespeichert
  ws.server({ type: "session.updated" });
  assert.equal(ws.sent.at(-1).type, "input_audio_buffer.append", "backlog is sent once ready");

  ws.server({ type: "conversation.item.input_audio_transcription.delta", item_id: "i1", delta: "Guten Tag. Wie " });
  await tick();
  assert.deepEqual(calls.filter((c) => c.text).map((c) => c.text), ["Guten Tag."], "first sentence before the end");

  ws.server({ type: "conversation.item.input_audio_transcription.delta", item_id: "i1", delta: "geht es Ihnen?" });
  ws.server({ type: "input_audio_buffer.speech_stopped" });
  ws.server({ type: "conversation.item.input_audio_transcription.completed", item_id: "i1", transcript: "Guten Tag. Wie geht es Ihnen?" });
  ws.server({ type: "conversation.item.input_audio_transcription.completed", item_id: "i2", transcript: "Ja." });
  await tick();
  await tick();
  const texts = calls.filter((c) => c.text).map((c) => c.text);
  assert.deepEqual(texts, ["Guten Tag.", "Wie geht es Ihnen?", "Ja."]);
  assert.deepEqual(calls.filter((c) => c.tts).map((c) => c.tts), ["RU(Guten Tag.)", "RU(Wie geht es Ihnen?)", "RU(Ja.)"], "spoken in order");
  assert.match(calls.at(-2).system ?? calls.find((c) => c.text === "Ja.").system, /Gesprächsverlauf/, "earlier sentences as context");
  assert.equal(audio.length, 3);
  seq.close();
});
