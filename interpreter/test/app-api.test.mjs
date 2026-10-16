// Tests für die JSON-API der iOS-App, den Live-Text und die Warteschleife bei eingehenden Anrufen.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { once } from "node:events";
import { test } from "node:test";
import WebSocket from "ws";
import { createApiRoutes, groupCalls, rateForNumber, toE164 } from "../src/api.mjs";
import { createVoiceToken } from "../src/voicetoken.mjs";
import { compressPauses } from "../src/clips.mjs";
import { createLiveFeed } from "../src/live.mjs";
import { buildServer } from "../src/server.mjs";

const config = {
  publicUrl: "https://dolmetscher.test",
  wsUrl: "wss://dolmetscher.test/media",
  authToken: "secret",
  twilioNumber: "+4921400000",
  ownerNumber: "+491630000000",
  peerCallerId: "+491630000000",
  languages: { owner: "ru", peer: "de" },
  secretaryNumber: "",
  allowedPrefixes: ["+49", "+420"],
  maxSessions: 1,
  maxCallSeconds: 60,
  adminToken: "",
  callKey: "app-key",
  liveKey: "live-key",
  mediaStreamRate: 0.0044,
  openaiRatePerMin: 0.068,
};
const quiet = { info() {}, error() {} };

const DE = {
  country: "Germany",
  price_unit: "USD",
  inbound_call_prices: [{ current_price: "0.010" }],
  outbound_prefix_prices: [
    { current_price: "0.042", destination_prefixes: ["49163", "49176"], friendly_name: "Germany - Mobile - From Eea", origination_prefixes: ["49"] },
    { current_price: "0.3763", destination_prefixes: ["49163", "49176"], friendly_name: "Germany - Mobile", origination_prefixes: ["ALL"] },
    { current_price: "0.0283", destination_prefixes: ["49"], friendly_name: "Germany", origination_prefixes: ["ALL"] },
  ],
};
const fakeTwilioApi = {
  balance: async () => ({ balance: "10.00", currency: "USD" }),
  country: async (iso) => (iso === "DE" ? DE : { country: iso, price_unit: "USD", outbound_prefix_prices: [] }),
  countries: async () => [{ iso: "DE", name: "Germany" }],
  calls: async () => ({ calls: [] }),
};

test("numbers: phone-style input becomes E.164, longest prefix wins", () => {
  assert.equal(toE164("0214 83263440"), "+4921483263440");
  assert.equal(toE164("0049 163 1234567"), "+491631234567");
  assert.equal(toE164("+49 (176) 123-45"), "+4917612345");
  assert.equal(toE164("12"), null);
  // Schreibweisen aus Kontakten
  assert.equal(toE164("49 163 8252129"), "+491638252129");
  assert.equal(toE164("+49 (0) 163 8252129"), "+491638252129");
  assert.equal(toE164("+49 0163 8252129"), "+491638252129");
  assert.equal(toE164("\u202D+49 163 8252129\u202C"), "+491638252129");
  assert.equal(toE164("420 601 234 567"), "+420601234567");
  assert.equal(toE164("1638252129"), null, "without 0 or country code it stays ambiguous");
  assert.equal(rateForNumber(DE, "+491631234567", "49").price, 0.042);
  assert.equal(rateForNumber(DE, "+4921412345", "49").price, 0.0283);
});

test("quote: price per number, refusal for blocked or foreign numbers", async () => {
  const routes = createApiRoutes({ config, twilioApi: fakeTwilioApi, log: quiet });
  const q = (number) => routes["/api/quote"](new URLSearchParams({ number }));

  const mobile = await q("0163 1234567");
  assert.equal(mobile.allowed, true);
  assert.equal(mobile.mobile, true);
  // 0.042 (zu Ihnen) + 0.042 (Gegenseite) + 2 × 0.0044 (Media Streams)
  assert.equal(mobile.perMinute, 0.0928);
  assert.equal(mobile.minutes, Math.floor(10 / 0.0928));
  assert.equal(mobile.plainPerMinute, 0.084);

  const landline = await q("0214 83263440");
  assert.equal(landline.mobile, false);
  assert.equal(landline.perMinute, 0.0791);

  assert.equal((await q("0900 123456")).reason, "premium");
  assert.equal((await q("+1 555 0000000")).reason, "country");
  assert.equal((await q("0214")).reason, "format");
  assert.equal((await q("1638252129")).reason, "format");
  assert.equal((await q("49 163 1234567")).allowed, true, "German number without plus is understood");
});

test("account: minutes left for a typical translated call to a German mobile", async () => {
  const routes = createApiRoutes({ config, twilioApi: fakeTwilioApi, log: quiet });
  const account = await routes["/api/account"](new URLSearchParams());
  assert.equal(account.typicalPerMinute, 0.0928);
  assert.equal(account.minutesLeft, Math.floor(10 / 0.0928));
});

test("history: both legs merged, full price includes media streams and OpenAI", () => {
  const at = (s) => new Date(Date.UTC(2026, 9, 15, 12, 0, s)).toUTCString();
  const calls = [
    // übersetzt ausgehend: Inhaber 55 s, Gegenseite 47 s
    { sid: "OWN1", from: config.twilioNumber, to: config.ownerNumber, direction: "outbound-api", date_created: at(0), duration: "55", price: "-0.042", status: "completed" },
    { sid: "OUT1", from: config.peerCallerId, to: "+4921412345", direction: "outbound-api", date_created: at(5), duration: "47", price: "-0.0283", status: "completed" },
  ];
  const [call] = groupCalls(calls, config);
  assert.equal(call.direction, "out");
  assert.equal(call.translated, true);
  assert.equal(call.price, 0.0703);
  assert.equal(call.mediaPrice, 0.0088); // 2 Streams × 1 angefangene Minute
  assert.equal(call.openaiPrice, Math.round((47 / 60) * 0.068 * 10000) / 10000);
  assert.equal(call.totalPrice, Math.round((0.0703 + 0.0088 + call.openaiPrice) * 10000) / 10000);

  const plain = groupCalls(
    [{ ...calls[1], sid: "OUT2", direction: "outbound-dial" }, { ...calls[0], sid: "OWN2" }],
    config,
  )[0];
  assert.equal(plain.translated, false);
  assert.equal(plain.totalPrice, plain.price);

  const missed = groupCalls(
    [
      { sid: "IN1", from: "+4930111", to: config.twilioNumber, direction: "inbound", date_created: at(0), duration: "30", price: "-0.01", status: "completed" },
      { sid: "OWN3", from: config.twilioNumber, to: config.ownerNumber, direction: "outbound-api", date_created: at(1), duration: "0", price: null, status: "no-answer" },
    ],
    config,
  )[0];
  assert.equal(missed.direction, "in");
  assert.equal(missed.translated, false);
  assert.equal(missed.openaiPrice, 0);

  const fresh = groupCalls([{ ...calls[0], price: null }, calls[1]], config)[0];
  assert.equal(fresh.pricePending, true, "Twilio has not priced the owner leg yet");
  assert.equal(call.pricePending, false);
});

function sign(path, params) {
  const data = config.publicUrl + path + Object.keys(params).sort().map((k) => k + params[k]).join("");
  return crypto.createHmac("sha1", config.authToken).update(data).digest("base64");
}

// Testklänge: Ansage 100 ms (800 Byte μ-law), "Можно говорить" 50 ms
const CLIPS = {
  peerWait: Buffer.alloc(800, 0x7f).toString("base64"),
  peerNotice: Buffer.alloc(800, 0x7d).toString("base64"),
  ownerReady: Buffer.alloc(400, 0x7e).toString("base64"),
};

async function start(cfg = config) {
  const created = [];
  const updated = [];
  const twilio = {
    createCall: async (args) => (created.push(args), { sid: `CA_${created.length}` }),
    updateCall: async (sid, twimlText) => (updated.push({ sid, twiml: twimlText }), {}),
    hangup: async () => ({}),
  };
  const translators = [];
  const createTranslator = (options) => {
    const t = { ...options, send() {}, close() {} };
    translators.push(t);
    return t;
  };
  const clips = { warmup: async () => true, get: (key) => CLIPS[key] ?? null };
  const { server, sessions } = buildServer(cfg, { twilio, createTranslator, clips, twilioApi: fakeTwilioApi, log: quiet });
  server.listen(0);
  await once(server, "listening");
  const base = `127.0.0.1:${server.address().port}`;
  const post = async (path, params) => {
    const res = await fetch(`http://${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Twilio-Signature": sign(path, params) },
      body: new URLSearchParams(params).toString(),
    });
    return res.text();
  };
  const stream = async (token, streamSid) => {
    const ws = new WebSocket(`ws://${base}/media`);
    ws.received = [];
    ws.on("message", (raw) => ws.received.push(JSON.parse(raw.toString())));
    await once(ws, "open");
    ws.send(JSON.stringify({ event: "start", start: { streamSid, customParameters: { token } } }));
    return ws;
  };
  return { base, created, updated, translators, sessions, post, stream, close: () => server.close() };
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tokenFrom = (twimlText) => /name="token" value="([0-9a-f]+)"/.exec(twimlText)[1];

test("incoming: caller hears the hold tone until the owner answers, then it stops", async (t) => {
  const app = await start();
  t.after(() => app.close());
  const incoming = await app.post("/voice/incoming", { From: "+4930123456", CallSid: "CA_peer" });
  const peer = await app.stream(tokenFrom(incoming), "MZ_peer");
  await wait(60);
  const holdFrames = peer.received.filter((m) => m.event === "media").length;
  assert.ok(holdFrames > 0, "caller must hear something while waiting");

  const legUrl = new URL(app.created[0].url);
  const ownerTwiml = await app.post(legUrl.pathname + legUrl.search, { CallSid: "CA_1" });
  const owner = await app.stream(tokenFrom(ownerTwiml), "MZ_owner");
  await wait(60);
  assert.ok(peer.received.some((m) => m.event === "clear"), "hold sound is cut on pairing");
  assert.equal(app.translators.length, 2);
  peer.close();
  owner.close();
});

test("app key: /call and the live text accept Authorization: Bearer <CALL_KEY>", async (t) => {
  const app = await start();
  t.after(() => app.close());
  const call = await fetch(`http://${app.base}/call`, {
    method: "POST",
    headers: { Authorization: "Bearer app-key", "Content-Type": "application/json" },
    body: JSON.stringify({ to: "+15550000000" }),
  });
  assert.equal(call.status, 400);
  assert.deepEqual(await call.json(), { ok: false, error: "country" });
  const denied = await fetch(`http://${app.base}/call`, { method: "POST", headers: { Authorization: "Bearer nope" }, body: "{}" });
  assert.equal(denied.status, 404);

  const refused = new WebSocket(`ws://${app.base}/live-ws`, { headers: { Authorization: "Bearer nope" } });
  const [error] = await once(refused, "error");
  assert.ok(error, "wrong key is refused");

  const live = new WebSocket(`ws://${app.base}/live-ws`, { headers: { Authorization: "Bearer app-key" } });
  await once(live, "open");
  live.close();
});

test("live text: a client opened mid-call gets the conversation so far, nothing after the end", () => {
  const feed = createLiveFeed();
  const client = () => {
    const ws = { readyState: 1, got: [], send: (p) => ws.got.push(JSON.parse(p)), on() {} };
    return ws;
  };
  feed.publish("peer", "in", "vor dem Gespräch");
  feed.event("start");
  feed.publish("peer", "in", "Guten Tag");
  feed.publish("peer", "out", "Добрый день");
  const late = client();
  feed.attach(late);
  assert.deepEqual(late.got.map((m) => m.event ?? m.text), ["start", "Guten Tag", "Добрый день"]);
  feed.publish("owner", "out", "Hallo");
  assert.equal(late.got.at(-1).text, "Hallo");

  feed.event("end");
  const afterEnd = client();
  feed.attach(afterEnd);
  assert.deepEqual(afterEnd.got, [], "text is dropped when the call ends");
});

const voip = { ...config, apiKey: "SK123", apiSecret: "topsecret", twimlAppSid: "AP123", clientIdentity: "owner", clientRate: 0.004 };

test("voice token: signed HS256 JWT with the outgoing grant for the TwiML app", () => {
  const { token, expiresAt } = createVoiceToken({
    accountSid: "AC1", apiKey: "SK123", apiSecret: "topsecret", appSid: "AP123", identity: "owner", now: 1000,
  });
  const [h, p, sig] = token.split(".");
  const header = JSON.parse(Buffer.from(h, "base64url"));
  const payload = JSON.parse(Buffer.from(p, "base64url"));
  assert.deepEqual(header, { alg: "HS256", typ: "JWT", cty: "twilio-fpa;v=1" });
  assert.equal(payload.iss, "SK123");
  assert.equal(payload.sub, "AC1");
  assert.equal(payload.grants.identity, "owner");
  assert.equal(payload.grants.voice.outgoing.application_sid, "AP123");
  assert.equal(expiresAt, 1000 + 3600);
  const expected = crypto.createHmac("sha256", "topsecret").update(`${h}.${p}`).digest("base64url");
  assert.equal(sig, expected);
});

test("voice token endpoint: only with the app key and only when VoIP is configured", async (t) => {
  const off = await start();
  t.after(() => off.close());
  const none = await fetch(`http://${off.base}/api/voice-token`, { headers: { Authorization: "Bearer app-key" } });
  assert.equal(none.status, 404);

  const on = await start(voip);
  t.after(() => on.close());
  const denied = await fetch(`http://${on.base}/api/voice-token`, { headers: { Authorization: "Bearer nope" } });
  assert.equal(denied.status, 404);
  const ok = await fetch(`http://${on.base}/api/voice-token`, { headers: { Authorization: "Bearer app-key" } });
  assert.equal(ok.status, 200);
  const body = await ok.json();
  assert.equal(body.identity, "owner");
  assert.equal(body.token.split(".").length, 3);
});

test("app call: translated call dials the peer, plain call bridges directly, strangers are rejected", async (t) => {
  const app = await start(voip);
  t.after(() => app.close());
  const stranger = await app.post("/voice/client", { From: "client:someone", CallSid: "CA_x", to: "02141234567" });
  assert.match(stranger, /<Reject/);
  const premium = await app.post("/voice/client", { From: "client:owner", CallSid: "CA_x", to: "0900123456" });
  assert.match(premium, /нельзя/);

  const translated = await app.post("/voice/client", { From: "client:owner", CallSid: "CA_app", to: "0214 1234567", mode: "translate" });
  assert.match(translated, /<Stream/);
  assert.equal(app.created[0].to, "+492141234567");
  assert.equal(app.created[0].from, voip.peerCallerId, "the peer sees the owner's mobile number");
  const session = [...app.sessions.sessions.values()][0];
  assert.equal(session.callSids.owner, "CA_app");
  assert.equal(session.viaApp, true);

  // App legt auf -> Gespräch endet
  await app.post("/voice/client-status", { CallSid: "CA_app", CallStatus: "completed" });
  assert.equal(app.sessions.sessions.size, 0);

  const plain = await app.post("/voice/client", { From: "client:owner", CallSid: "CA_plain", to: "+4921412345678", mode: "plain" });
  assert.match(plain, /<Dial callerId="\+491630000000"[^>]*><Number>\+4921412345678<\/Number><\/Dial>/);
  assert.equal(app.created.length, 1, "plain call is bridged by TwiML, no extra REST call");
  await app.post("/voice/client-status", { CallSid: "CA_plain", CallStatus: "completed" });
  assert.equal(app.sessions.sessions.size, 0);
});

test("pricing via the app: the owner leg costs the client rate instead of a mobile call", async () => {
  const routes = createApiRoutes({ config: voip, twilioApi: fakeTwilioApi, log: quiet });
  const quote = await routes["/api/quote"](new URLSearchParams({ number: "0163 1234567" }));
  // 0.004 (App) + 0.042 (Gegenseite) + 2 × 0.0044
  assert.equal(quote.app.perMinute, 0.0548);
  assert.equal(quote.app.plainPerMinute, 0.046);
  const account = await routes["/api/account"](new URLSearchParams());
  assert.equal(account.voip, true);
  assert.equal(account.appPerMinute, 0.0548);

  const at = (sec) => new Date(Date.UTC(2026, 9, 17, 9, 0, sec)).toUTCString();
  const [call] = groupCalls(
    [
      { sid: "APP", from: "client:owner", to: "", direction: "inbound", date_created: at(0), duration: "40", price: "-0.004", status: "completed" },
      { sid: "PEER", from: voip.peerCallerId, to: "+4921412345", direction: "outbound-api", date_created: at(2), duration: "35", price: "-0.0283", status: "completed" },
    ],
    voip,
  );
  assert.equal(call.viaApp, true);
  assert.equal(call.price, 0.0323);
  assert.equal(call.translated, true);
});

test("outgoing: after the notice for the callee the owner hears 'you can speak', the app gets notice/ready", async (t) => {
  const app = await start();
  t.after(() => app.close());
  const live = new WebSocket(`ws://${app.base}/live-ws`, { headers: { Authorization: "Bearer app-key" } });
  const events = [];
  live.on("message", (raw) => {
    const m = JSON.parse(raw.toString());
    if (m.event) events.push(m);
  });
  await once(live, "open");
  t.after(() => live.close());

  const call = await fetch(`http://${app.base}/call`, {
    method: "POST",
    headers: { Authorization: "Bearer app-key", "Content-Type": "application/json" },
    body: JSON.stringify({ to: "02141234567", mode: "translate" }),
  });
  assert.equal(call.status, 200);
  const ownerLeg = new URL(app.created[0].url);
  const owner = await app.stream(tokenFrom(await app.post(ownerLeg.pathname + ownerLeg.search, {})), "MZ_owner");
  const peerLeg = new URL(app.created[1].url);
  const peer = await app.stream(tokenFrom(await app.post(peerLeg.pathname + peerLeg.search, {})), "MZ_peer");
  t.after(() => { owner.close(); peer.close(); });

  await wait(80);
  assert.ok(peer.received.some((m) => m.media?.payload === CLIPS.peerNotice), "callee hears the notice");
  assert.ok(!owner.received.some((m) => m.media?.payload === CLIPS.ownerReady), "not yet: notice still playing");
  assert.deepEqual(events.find((e) => e.event === "notice")?.ms, 100);

  await wait(350);
  assert.ok(owner.received.some((m) => m.media?.payload === CLIPS.ownerReady), "owner hears 'Можно говорить'");
  assert.ok(events.some((e) => e.event === "ready"), "app is told it can speak");
});

test("history: legs Twilio has not priced yet get a tariff estimate", async () => {
  const at = (sec) => new Date(Date.UTC(2026, 9, 16, 20, 40, sec)).toUTCString();
  const api = {
    ...fakeTwilioApi,
    calls: async () => ({
      calls: [
        { sid: "APP", from: "client:owner", to: "", direction: "inbound", date_created: at(0), duration: "48", price: null, status: "completed" },
        { sid: "PEER", from: voip.peerCallerId, to: "+491631234567", direction: "outbound-api", date_created: at(0), duration: "44", price: null, status: "completed" },
      ],
    }),
  };
  const routes = createApiRoutes({ config: voip, twilioApi: api, log: quiet });
  const [call] = (await routes["/api/calls"](new URLSearchParams())).calls;
  assert.equal(call.pricePending, true);
  assert.equal(call.viaApp, true);
  // 1 Minute App (0.004) + 1 Minute Mobilfunk (0.042)
  assert.equal(call.price, 0.046);
  assert.ok(call.totalPrice > call.price, "media streams and OpenAI are added");
});

test("clips: long pauses are cut to 200 ms, speech stays untouched", () => {
  const tone = (ms) => {
    const b = Buffer.alloc((24000 * ms / 1000) * 2);
    for (let i = 0; i < b.length / 2; i += 1) b.writeInt16LE(Math.round(Math.sin(i / 3) * 8000), i * 2);
    return b;
  };
  const silence = (ms) => Buffer.alloc((24000 * ms / 1000) * 2);
  const out = compressPauses(Buffer.concat([tone(500), silence(900), tone(500), silence(100)]));
  const ms = out.length / 48;
  // 500 + 200 (gekürzt) + 500 + 100 (kurz, bleibt)
  assert.ok(Math.abs(ms - 1300) <= 20, `expected ~1300 ms, got ${ms}`);
});

const pushed = { ...voip, pushCredentialSid: "CR123", clientRingSeconds: 20, secretaryNumber: "+4921411111" };

test("voice token with push credential allows incoming calls", () => {
  const { token } = createVoiceToken({ accountSid: "AC1", apiKey: "SK1", apiSecret: "x", appSid: "AP1", identity: "owner", pushCredentialSid: "CR123" });
  const voice = JSON.parse(Buffer.from(token.split(".")[1], "base64url")).grants.voice;
  assert.deepEqual(voice.incoming, { allow: true });
  assert.equal(voice.push_credential_sid, "CR123");
});

test("incoming with the app: app rings first (caller's number shown), then the mobile, then the assistant", async (t) => {
  const app = await start(pushed);
  t.after(() => app.close());
  await app.post("/voice/incoming", { From: "+4930123456", CallSid: "CA_peer" });
  assert.equal(app.created[0].to, "client:owner");
  assert.equal(app.created[0].from, "+4930123456");
  assert.equal(app.created[0].timeout, 20);

  const status = (n) => new URL(app.created[n].statusCallback);
  await app.post(status(0).pathname + status(0).search, { CallStatus: "no-answer" });
  assert.equal(app.created[1].to, pushed.ownerNumber, "app did not answer -> mobile");
  assert.equal(app.sessions.sessions.size, 1);

  await app.post(status(1).pathname + status(1).search, { CallStatus: "no-answer" });
  assert.match(app.updated[0].twiml, /<Number>\+4921411111<\/Number>/, "mobile neither -> assistant");
  assert.equal(app.sessions.sessions.size, 0);
});

test("incoming declined in the app goes straight to the assistant, not to the mobile", async (t) => {
  const app = await start(pushed);
  t.after(() => app.close());
  await app.post("/voice/incoming", { From: "+4930123456", CallSid: "CA_peer" });
  const status = new URL(app.created[0].statusCallback);
  await app.post(status.pathname + status.search, { CallStatus: "busy" });
  assert.equal(app.created.length, 1, "mobile is not called");
  assert.match(app.updated[0].twiml, /\+4921411111/);
});
