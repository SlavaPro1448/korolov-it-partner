import assert from "node:assert/strict";
import crypto from "node:crypto";
import { once } from "node:events";
import { test } from "node:test";
import WebSocket from "ws";
import { mulawToPcm16, pcm16ToMulaw, realtimeToTwilio, twilioToRealtime } from "../src/audio.mjs";
import { buildServer } from "../src/server.mjs";
import { isDialAllowed, normalizeDialedNumber, verifyTwilioSignature } from "../src/twilio.mjs";

const config = {
  publicUrl: "https://dolmetscher.test",
  wsUrl: "wss://dolmetscher.test/media",
  authToken: "secret",
  twilioNumber: "+4921400000",
  ownerNumber: "+491630000000",
  languages: { owner: "ru", peer: "de" },
  secretaryNumber: "+4921411111",
  allowedPrefixes: ["+49"],
  maxSessions: 1,
  maxCallSeconds: 60,
  adminToken: "",
};
const quiet = { info() {}, error() {} };

function sign(path, params) {
  const data =
    config.publicUrl +
    path +
    Object.keys(params)
      .sort()
      .map((k) => k + params[k])
      .join("");
  return crypto.createHmac("sha1", config.authToken).update(data).digest("base64");
}

async function start() {
  const calls = { created: [], updated: [], hungUp: [] };
  const translators = [];
  const twilio = {
    createCall: async (args) => (
      calls.created.push(args),
      { sid: `CA_out_${calls.created.length}` }
    ),
    updateCall: async (sid, twiml) => (calls.updated.push({ sid, twiml }), {}),
    hangup: async (sid) => (calls.hungUp.push(sid), {}),
  };
  const createTranslator = (options) => {
    const translator = {
      ...options,
      sent: [],
      closed: false,
      send: (p) => translator.sent.push(p),
      close: () => (translator.closed = true),
    };
    translators.push(translator);
    return translator;
  };
  const { server, sessions } = buildServer(config, { twilio, createTranslator, log: quiet });
  server.listen(0);
  await once(server, "listening");
  const port = server.address().port;
  const post = async (path, params, signature = sign(path, params)) => {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Twilio-Signature": signature,
      },
      body: new URLSearchParams(params).toString(),
    });
    return { status: res.status, body: await res.text() };
  };
  const stream = async (token, streamSid) => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/media`);
    ws.received = [];
    ws.on("message", (raw) => ws.received.push(JSON.parse(raw.toString())));
    await once(ws, "open");
    ws.send(JSON.stringify({ event: "start", start: { streamSid, customParameters: { token } } }));
    return ws;
  };
  return { calls, translators, sessions, post, stream, close: () => server.close() };
}

const tokenFrom = (twimlText) => /name="token" value="([0-9a-f]+)"/.exec(twimlText)[1];
const tick = () => new Promise((resolve) => setTimeout(resolve, 30));

test("μ-law round trip and resampling sizes", () => {
  for (const sample of [0, 100, -100, 1000, -8000, 30000]) {
    const back = mulawToPcm16(pcm16ToMulaw(sample));
    assert.ok(
      Math.abs(back - sample) <= Math.max(16, Math.abs(sample) * 0.07),
      `${sample} -> ${back}`,
    );
  }
  const frame = Buffer.alloc(160, pcm16ToMulaw(1000)).toString("base64");
  const pcm24 = Buffer.from(twilioToRealtime(frame), "base64");
  assert.equal(pcm24.length, 160 * 3 * 2);
  assert.equal(Buffer.from(realtimeToTwilio(pcm24.toString("base64")), "base64").length, 160);
});

test("dialed numbers: normalisation and premium block", async () => {
  assert.equal(normalizeDialedNumber("021483263442"), "+4921483263442");
  assert.equal(normalizeDialedNumber("0043123456"), "+43123456");
  assert.equal(normalizeDialedNumber("123"), null);
  assert.equal(isDialAllowed("+4921483263442", ["+49"]), true);
  assert.equal(isDialAllowed("+43123456", ["+49"]), false);
  assert.equal(isDialAllowed("+499001234567", ["+49"]), false);
  assert.equal(isDialAllowed(null, ["+49"]), false);
  assert.equal(isDialAllowed("+420221234567", ["+49", "+420"]), true);
  assert.equal(isDialAllowed("+42090012345", ["+49", "+420"]), false);
  assert.equal(normalizeDialedNumber("0042022123456"), "+42022123456");
  const { hasPlausibleLength } = await import("../src/twilio.mjs");
  assert.equal(hasPlausibleLength("+4980026508043809"), false);
  assert.equal(hasPlausibleLength("+498000326326"), true);
  assert.equal(hasPlausibleLength("+4921483263442"), true);
  assert.equal(hasPlausibleLength("+49214500475100"), true, "number with extension (Durchwahl)");
});

test("webhooks require a valid Twilio signature", async () => {
  const app = await start();
  const params = { From: "+4930123456", CallSid: "CA1" };
  assert.equal((await app.post("/voice/incoming", params, "wrong")).status, 403);
  assert.equal(verifyTwilioSignature({ authToken: "", url: "x", signature: "y" }), false);
  app.close();
});

test("outgoing: owner dials, both streams are bridged in the right languages", async () => {
  const app = await start();
  const prompt = await app.post("/voice/incoming", {
    From: config.ownerNumber,
    CallSid: "CA_owner",
  });
  assert.match(prompt.body, /<Gather input="dtmf"/);

  const dial = await app.post("/voice/dial", {
    From: config.ownerNumber,
    CallSid: "CA_owner",
    Digits: "030123456",
  });
  assert.equal(app.calls.created[0].to, "+4930123456");
  assert.equal(app.calls.created[0].from, config.twilioNumber);
  assert.equal(app.calls.created[0].timeout, 60);
  const ownerToken = tokenFrom(dial.body);

  const legPath =
    new URL(app.calls.created[0].url).pathname + new URL(app.calls.created[0].url).search;
  const leg = await app.post(legPath, { CallSid: "CA_out_1" });
  assert.match(leg.body, /KI-Dolmetscher/);
  const peerToken = tokenFrom(leg.body);
  assert.notEqual(ownerToken, peerToken);

  const ownerWs = await app.stream(ownerToken, "MZ_owner");
  const peerWs = await app.stream(peerToken, "MZ_peer");
  await tick();
  assert.equal(app.translators.length, 2);
  const fromOwner = app.translators.find((t) => t.label.endsWith(":owner"));
  const fromPeer = app.translators.find((t) => t.label.endsWith(":peer"));
  assert.equal(fromOwner.targetLanguage, "de");
  assert.equal(fromPeer.targetLanguage, "ru");

  ownerWs.send(JSON.stringify({ event: "media", media: { payload: "AAAA" } }));
  await tick();
  assert.deepEqual(fromOwner.sent, ["AAAA"]);
  assert.deepEqual(fromPeer.sent, []);
  // das Original des Inhabers kommt leise beim Partner an
  assert.equal(peerWs.received.length, 1);
  assert.equal(peerWs.received[0].streamSid, "MZ_peer");
  assert.notEqual(peerWs.received[0].media.payload, "AAAA");

  // stille Übersetzung (PCM-Nullen) wird verworfen, hörbare kommt an
  const silentPcm = Buffer.alloc(4800, 0xff).toString("base64"); // μ-law-Stille
  fromPeer.onAudio(silentPcm);
  await tick();
  assert.ok(!ownerWs.received.some((m) => m.media?.payload === silentPcm));
  fromPeer.onAudio("BBBB");
  await tick();
  // der Inhaber bekommt zuerst den Verbindungston, dann die Übersetzung – nur an sein Bein
  const ownerPayloads = ownerWs.received
    .filter((m) => m.event === "media")
    .map((m) => m.media.payload);
  assert.equal(ownerPayloads.at(-1), "BBBB");
  assert.ok(ownerWs.received.every((m) => m.streamSid === "MZ_owner"));
  assert.ok(!peerWs.received.some((m) => m.media?.payload === "BBBB"));

  peerWs.send(JSON.stringify({ event: "stop" }));
  await once(ownerWs, "close");
  assert.ok(fromOwner.closed && fromPeer.closed);
  assert.equal(app.sessions.sessions.size, 0);
  assert.deepEqual(app.calls.hungUp.sort(), ["CA_out_1", "CA_owner"]);
  app.close();
});

test("dtmf: owner's key is sent to the peer and the peer stream may reconnect", async () => {
  const app = await start();
  const dial = await app.post("/voice/dial", {
    From: config.ownerNumber,
    CallSid: "CA_owner",
    Digits: "030123456",
  });
  const ownerToken = tokenFrom(dial.body);
  const legUrl = new URL(app.calls.created[0].url);
  const leg = await app.post(legUrl.pathname + legUrl.search, { CallSid: "CA_out_1" });
  const peerToken = tokenFrom(leg.body);
  const ownerWs = await app.stream(ownerToken, "MZ_owner");
  const peerWs = await app.stream(peerToken, "MZ_peer");
  await tick();

  ownerWs.send(JSON.stringify({ event: "dtmf", dtmf: { digit: "1" } }));
  await tick();
  assert.equal(app.calls.updated.length, 1);
  assert.equal(app.calls.updated[0].sid, "CA_out_1");
  assert.match(app.calls.updated[0].twiml, /<Play digits="1"\/><Connect><Stream/);

  // neuer Peer-Stream verbindet sich zuerst, der alte schließt erst danach – Sitzung lebt weiter
  const peerWs2 = await app.stream(peerToken, "MZ_peer2");
  await tick();
  peerWs.send(JSON.stringify({ event: "stop" }));
  await tick();
  assert.equal(app.sessions.sessions.size, 1, "alter Stream darf das Gespräch nicht beenden");
  assert.equal(app.translators.length, 2, "Übersetzer bleiben erhalten");
  app.translators.find((t) => t.label.endsWith(":owner")).onAudio("CCCC");
  await tick();
  assert.ok(
    peerWs2.received.some((m) => m.media?.payload === "CCCC" && m.streamSid === "MZ_peer2"),
  );
  ownerWs.close();
  await once(peerWs2, "close");
  app.close();
});

test("in-call keys: # skips playback, * switches mode, barge-in stops the translation", async () => {
  const { SessionStore } = await import("../src/sessions.mjs");
  const made = [];
  const store = new SessionStore({
    languages: { owner: "ru", peer: "de" },
    log: quiet,
    clips: { warmup: async () => true, get: () => Buffer.alloc(800, 0x20).toString("base64") },
    onDtmf: () => {},
    createTranslator: (o) => {
      const t = {
        ...o,
        sent: [],
        closed: false,
        send: (p) => t.sent.push(p),
        close: () => (t.closed = true),
      };
      made.push(t);
      return t;
    },
  });
  const session = store.create({ direction: "outgoing", mode: "seq" });
  session.callSids.peer = "CA_p";
  const ownerLeg = {
    sent: [],
    clears: 0,
    send: (p) => ownerLeg.sent.push(p),
    clear: () => (ownerLeg.clears += 1),
    close() {},
  };
  store.attach(session.tokens.owner, ownerLeg);
  store.attach(session.tokens.peer, { send() {}, clear() {}, close() {} });
  assert.equal(made[0].mode, "seq");

  // lange Übersetzung (2 s) läuft beim Inhaber
  const fromPeer = made.find((t) => t.label.endsWith(":peer"));
  fromPeer.onAudio(Buffer.alloc(16000, 0x20).toString("base64"));
  const loud = Buffer.alloc(160, 0x10).toString("base64"); // sehr laut
  const silence = Buffer.alloc(160, 0xff).toString("base64");
  const now = Date.now();
  // leise Rede während der Wiedergabe wird noch gedämpft
  store.media(session.tokens.owner, silence, now + 100);
  assert.deepEqual(made[0].sent.at(-1), silence);
  // 5 laute Pakete hintereinander -> Dazwischenreden: Wiedergabe gestoppt, Rede geht durch
  for (let i = 0; i < 5; i += 1) store.media(session.tokens.owner, loud, now + 200 + i * 20);
  assert.equal(ownerLeg.clears >= 1, true);
  assert.deepEqual(made[0].sent.at(-1), loud);

  // ## wiederholt den Hinweis für die Gegenseite
  const peerLegNotice = {
    sent: [],
    send: (p) => peerLegNotice.sent.push(p),
    clear() {},
    close() {},
  };
  session.legs.peer = peerLegNotice;
  store.dtmf(session.tokens.owner, "#");
  store.dtmf(session.tokens.owner, "#");
  assert.equal(peerLegNotice.sent.length, 1, "Hinweis einmal an die Gegenseite");

  // # bricht Wiedergabe ab
  fromPeer.onAudio(Buffer.alloc(16000, 0x20).toString("base64"));
  const clearsBefore = ownerLeg.clears;
  store.dtmf(session.tokens.owner, "#");
  assert.equal(ownerLeg.clears, clearsBefore + 1);

  // * wechselt den Modus: seq -> direct (live-Übersetzer für die Gegenseite), direct -> live (bleiben)
  store.dtmf(session.tokens.owner, "*");
  assert.equal(session.mode, "direct");
  assert.ok(made[0].closed && made[1].closed);
  assert.equal(made.length, 4);
  assert.equal(made.at(-1).mode, "live");
  const ownerTranslator = made.find((t, i) => i >= 2 && t.label.endsWith(":owner"));
  const peerLeg = { sent: [], send: (p) => peerLeg.sent.push(p), clear() {}, close() {} };
  session.legs.peer = peerLeg;
  store.media(session.tokens.owner, loud, now + 5000);
  assert.equal(peerLeg.sent.at(-1), loud, "Original unverändert an die Gegenseite");
  assert.equal(ownerTranslator.sent.at(-1), silence, "nichts zum Übersetzen");
  store.dtmf(session.tokens.owner, "*");
  assert.equal(session.mode, "live");
  assert.equal(made.length, 4, "direct -> live braucht keine neuen Übersetzer");
  store.end(session.id);
});

test("outgoing: only the owner may dial, foreign and premium targets are refused", async () => {
  const app = await start();
  const stranger = await app.post("/voice/dial", {
    From: "+4930999",
    CallSid: "CA_x",
    Digits: "030123456",
  });
  assert.match(stranger.body, /<Reject/);
  const premium = await app.post("/voice/dial", {
    From: config.ownerNumber,
    CallSid: "CA_o",
    Digits: "09001234567",
  });
  assert.match(premium.body, /нельзя/);
  assert.equal(app.calls.created.length, 0);
  app.close();
});

test("incoming: caller waits, owner is called back; unanswered -> secretary", async () => {
  const app = await start();
  const incoming = await app.post("/voice/incoming", { From: "+4930123456", CallSid: "CA_peer" });
  assert.match(incoming.body, /nicht aufgezeichnet/);
  assert.equal(app.calls.created[0].to, config.ownerNumber);
  const peerWs = await app.stream(tokenFrom(incoming.body), "MZ_peer");

  const statusUrl = new URL(app.calls.created[0].statusCallback);
  await app.post(statusUrl.pathname + statusUrl.search, { CallStatus: "no-answer" });
  assert.equal(app.calls.updated[0].sid, "CA_peer");
  assert.match(app.calls.updated[0].twiml, /<Dial><Number>\+4921411111<\/Number><\/Dial>/);
  assert.ok(!app.calls.hungUp.includes("CA_peer"), "caller must not be hung up");
  assert.equal(app.sessions.sessions.size, 0);
  peerWs.close();
  app.close();
});

test("loop guard and capacity limit", async () => {
  const app = await start();
  const loop = await app.post("/voice/incoming", { From: config.twilioNumber, CallSid: "CA_loop" });
  assert.match(loop.body, /<Reject reason="busy"/);

  await app.post("/voice/incoming", { From: "+4930123456", CallSid: "CA_a" });
  const second = await app.post("/voice/incoming", { From: "+4930777777", CallSid: "CA_b" });
  assert.match(second.body, /<Dial><Number>/);
  assert.equal(app.calls.created.length, 1);
  app.sessions.end([...app.sessions.sessions.keys()][0]);
  app.close();
});

test("echo guard: audio from the listener is muted while the translation plays", async () => {
  const { SessionStore } = await import("../src/sessions.mjs");
  const translators = {};
  const store = new SessionStore({
    languages: { owner: "ru", peer: "de" },
    log: quiet,
    createTranslator: (o) => {
      const t = { ...o, sent: [], send: (p) => t.sent.push(p), close() {} };
      translators[o.label.split(":").pop()] = t;
      return t;
    },
  });
  const session = store.create();
  const legs = { owner: [], peer: [] };
  store.attach(session.tokens.owner, { send: (p) => legs.owner.push(p), close() {} });
  store.attach(session.tokens.peer, { send: (p) => legs.peer.push(p), close() {} });
  const speech = Buffer.alloc(160, 0x10).toString("base64"); // 20 ms
  const silence = Buffer.alloc(160, 0xff).toString("base64");

  // Inhaber spricht, Übersetzung (1 s) wird dem Gesprächspartner vorgespielt
  translators.owner.onAudio(Buffer.alloc(8000, 0x20).toString("base64"));
  assert.equal(legs.peer.length, 1);
  const now = Date.now();
  store.media(session.tokens.peer, speech, now + 500); // Echo während der Wiedergabe
  store.media(session.tokens.peer, speech, now + 1400); // noch im Nachlauf
  store.media(session.tokens.peer, speech, now + 1800); // danach wieder normal
  assert.deepEqual(translators.peer.sent, [silence, silence, speech]);
  // Während der Inhaber die Übersetzung hört, bekommt er das Original nicht; danach leise
  assert.equal(legs.owner.length, 1, "nur das Paket nach dem Echo-Fenster wird durchgereicht");
  // Der Inhaber selbst wird nicht gesperrt
  store.media(session.tokens.owner, speech, now + 500);
  assert.deepEqual(translators.owner.sent, [speech]);
  store.end(session.id);
});

test("plain call: owner answers, then target is dialed directly without translation", async () => {
  const app = await start();
  const cfgWithKey = { ...config, callKey: "k1", peerCallerId: "+491638000000" };
  app.close();
  const app2 = await (async () => {
    const calls = { created: [] };
    const twilio = {
      createCall: async (a) => (calls.created.push(a), { sid: "CA_o" }),
      updateCall: async () => ({}),
      hangup: async () => ({}),
    };
    const clips = { warmup: async () => false, get: () => null };
    const { server } = buildServer(cfgWithKey, {
      twilio,
      createTranslator: () => ({ send() {}, close() {} }),
      clips,
      log: quiet,
    });
    server.listen(0);
    await once(server, "listening");
    return { calls, port: server.address().port, close: () => server.close() };
  })();
  const res = await fetch(`http://127.0.0.1:${app2.port}/call?key=k1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: "0214 83263442", mode: "plain" }),
  });
  assert.equal(res.status, 200);
  assert.equal(app2.calls.created[0].to, cfgWithKey.ownerNumber);
  const legUrl = new URL(app2.calls.created[0].url);
  const legRes = await fetch(`http://127.0.0.1:${app2.port}${legUrl.pathname}${legUrl.search}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Twilio-Signature": sign(legUrl.pathname + legUrl.search, { CallSid: "CA_o" }),
    },
    body: new URLSearchParams({ CallSid: "CA_o" }).toString(),
  });
  const body = await legRes.text();
  assert.match(
    body,
    /<Dial callerId="\+491638000000"[^>]*><Number>\+4921483263442<\/Number><\/Dial>/,
  );
  assert.doesNotMatch(body, /<Stream/);
  assert.equal(app2.calls.created.length, 1, "no second outbound call for plain mode");
  app2.close();
});
