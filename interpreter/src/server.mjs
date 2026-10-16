// Live-Dolmetscher DE<->RU: HTTP-Webhooks für Twilio Voice + WebSocket für Media Streams.
// Ablauf und Einrichtung: README.md.
import http from "node:http";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { CALL_PAGE } from "./callpage.mjs";
import { createApiRoutes, createTwilioApi } from "./api.mjs";
import { createVoiceToken } from "./voicetoken.mjs";
import { LIVE_PAGE, createLiveFeed } from "./live.mjs";
import { createSequentialTranslator } from "./sequential.mjs";
import { realtimeToTwilio, twilioToRealtime } from "./audio.mjs";
import { SessionStore } from "./sessions.mjs";
import { createClips } from "./clips.mjs";
import { createTranslator } from "./translation.mjs";
import { TEST_PAGE, attachTestSocket } from "./webtest.mjs";
import {
  TEXT,
  createTwilioClient,
  dialProblem,
  isDialAllowed,
  normalizeDialedNumber,
  toE164,
  samePhone,
  twiml,
  verifyTwilioSignature,
} from "./twilio.mjs";

const FAILED_STATUSES = new Set(["busy", "no-answer", "failed", "canceled"]);

export function loadConfig(env = process.env) {
  const required = [
    "PUBLIC_URL",
    "OPENAI_API_KEY",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_NUMBER",
    "OWNER_NUMBER",
  ];
  const missing = required.filter((key) => !env[key]);
  if (missing.length > 0) throw new Error(`Fehlende Umgebungsvariablen: ${missing.join(", ")}`);
  const publicUrl = env.PUBLIC_URL.replace(/\/+$/, "");
  return {
    publicUrl,
    wsUrl: publicUrl.replace(/^http/, "ws") + "/media",
    port: Number.parseInt(env.PORT ?? "5050", 10),
    openaiApiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_TRANSLATION_MODEL || "gpt-realtime-translate",
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    twilioNumber: env.TWILIO_NUMBER,
    peerCallerId: env.PEER_CALLER_ID || env.TWILIO_NUMBER,
    ownerNumber: env.OWNER_NUMBER,
    languages: { owner: env.OWNER_LANGUAGE || "ru", peer: env.PEER_LANGUAGE || "de" },
    secretaryNumber: env.SECRETARY_NUMBER || "",
    allowedPrefixes: (env.ALLOWED_DIAL_PREFIXES || "+49").split(",").map((p) => p.trim()),
    maxSessions: Number.parseInt(env.MAX_SESSIONS ?? "1", 10) || 1,
    maxCallSeconds: Number.parseInt(env.MAX_CALL_SECONDS ?? "1800", 10) || 1800,
    adminToken: env.ADMIN_TOKEN || "",
    testKey: env.TEST_KEY || "",
    liveKey: env.LIVE_KEY || "",
    callKey: env.CALL_KEY || "",
    // SIP-Adresse des ElevenLabs-Telefonassistenten (Firmennummer); leer = Route aus
    secretarySip: env.SECRETARY_SIP || "",
    // Preise für die App: Media Streams je Leg und Minute (Twilio), OpenAI-Übersetzung je Minute (Schätzung, beide Richtungen)
    mediaStreamRate: Number.parseFloat(env.MEDIA_STREAM_RATE ?? "0.0044") || 0.0044,
    openaiRatePerMin: Number.parseFloat(env.OPENAI_RATE_PER_MIN ?? "0.068") || 0.068,
    // Anrufe direkt aus der iOS-App über das Internet (Twilio Voice SDK); leer = aus
    apiKey: env.TWILIO_API_KEY || "",
    apiSecret: env.TWILIO_API_SECRET || "",
    twimlAppSid: env.TWILIO_TWIML_APP_SID || "",
    clientIdentity: env.CLIENT_IDENTITY || "owner",
    clientRate: Number.parseFloat(env.CLIENT_RATE ?? "0.004") || 0.004,
    // Eingehende Anrufe zuerst in die App (VoIP-Push über diese Twilio Push Credential); leer = nur Handy
    pushCredentialSid: env.TWILIO_PUSH_CREDENTIAL_SID || "",
    clientRingSeconds: Number.parseInt(env.CLIENT_RING_SECONDS ?? "20", 10) || 20,
  };
}

export function buildServer(config, deps = {}) {
  const log = deps.log ?? console;
  const twilio =
    deps.twilio ??
    createTwilioClient({ accountSid: config.accountSid, authToken: config.authToken });
  const live = createLiveFeed();
  let liveSessionId = null; // "start" nur einmal je Gespräch, nicht bei jedem Moduswechsel
  const apiRoutes = createApiRoutes({
    config,
    twilioApi: deps.twilioApi ?? createTwilioApi({ accountSid: config.accountSid, authToken: config.authToken }),
    log,
  });
  const clips = deps.clips ?? createClips({ apiKey: config.openaiApiKey, log });
  let clipsReady = false;
  const warmup = clips.warmup().then((ok) => {
    clipsReady = ok;
    log.info(
      `[clips] ${ok ? "Sprachhinweise bereit" : "Sprachhinweise unvollständig, Fallback über <Say>"}`,
    );
  });
  const sessions = new SessionStore({
    onCue: (session, name, extra) => live.event(name, extra),
    languages: config.languages,
    maxSessions: config.maxSessions,
    maxCallSeconds: config.maxCallSeconds,
    log,
    clips,
    // Taste des Inhabers: Gegenseite kurz umleiten (<Play digits>), Stream wird neu verbunden
    onDtmf: (session, digit) =>
      twilio
        .updateCall(
          session.callSids.peer,
          twiml.peerDigit(digit, config.wsUrl, session.tokens.peer),
        )
        .catch((error) => {
          log.error("[dtmf]", error.message);
          session.reattaching.peer = false;
        }),
    // Beide Anrufe sicher beenden (läutet noch, Zeitlimit, Gegenseite hat aufgelegt)
    onEnd: (session) => {
      for (const callSid of Object.values(session.callSids)) {
        if (callSid) twilio.hangup(callSid).catch(() => {});
      }
      live.event("end");
    },
    createTranslator:
      deps.createTranslator ??
      ((options) => {
        const [sessionId, role] = options.label.split(":");
        if (role === "owner" && sessionId !== liveSessionId) {
          liveSessionId = sessionId;
          live.event("start");
        }
        const onTranscript = (dir, text) => live.publish(role, dir, text);
        if (options.mode === "seq") {
          // Der Satz-für-Satz-Übersetzer arbeitet mit PCM 24 kHz; Telefon liefert μ-law 8 kHz
          const seq = createSequentialTranslator({
            apiKey: config.openaiApiKey,
            sourceLanguage: options.sourceLanguage,
            targetLanguage: options.targetLanguage,
            label: options.label,
            onAudio: (pcm) => options.onAudio(realtimeToTwilio(pcm)),
            onTranscript,
            log,
          });
          return { send: (mulaw) => seq.send(twilioToRealtime(mulaw)), close: () => seq.close() };
        }
        return createTranslator({
          ...options,
          apiKey: config.openaiApiKey,
          model: config.model,
          log,
          onTranscript,
        });
      }),
  });

  const legUrl = (token) => `${config.publicUrl}/voice/leg?token=${token}`;
  const statusUrl = (session, role) =>
    `${config.publicUrl}/voice/status?session=${session.id}&role=${role}`;

  async function dial(session, role, to, { from = null, timeout = null } = {}) {
    const call = await twilio.createCall({
      to,
      from: from ?? (role === "peer" ? (config.peerCallerId ?? config.twilioNumber) : config.twilioNumber),
      url: legUrl(session.tokens[role]),
      statusCallback: statusUrl(session, role),
      timeout: timeout ?? (role === "peer" ? 60 : 25),
      timeLimit: config.maxCallSeconds,
    });
    session.callSids[role] = call.sid;
  }

  const appIncoming = () => Boolean(config.pushCredentialSid && config.apiKey && config.twimlAppSid);
  const clientAddress = () => `client:${config.clientIdentity}`;

  // Eingehend: zuerst die App (Anzeige = Nummer des Anrufers), dann das Handy, dann der Assistent
  async function ringOwner(session) {
    while (session.ownerTargets.length > 0) {
      const target = session.ownerTargets.shift();
      try {
        if (target === "app") {
          await dial(session, "owner", clientAddress(), {
            from: session.callerNumber || config.twilioNumber,
            timeout: config.clientRingSeconds,
          });
        } else {
          await dial(session, "owner", config.ownerNumber);
        }
        session.ringing = target;
        return true;
      } catch (error) {
        log.error(`[incoming:${target}]`, error.message);
      }
    }
    return false;
  }

  // Der gewählte Teilnehmer wurde nicht erreicht oder hat aufgelegt
  async function onLegFinished(session, role, status) {
    if (role === "owner" && !session.paired && session.direction === "incoming") {
      // App nicht angenommen (nicht erreichbar / keine Antwort): weiter aufs Handy.
      // In der App abgelehnt ("busy") heißt: jetzt nicht – direkt zum Assistenten.
      const declinedInApp = session.ringing === "app" && status === "busy";
      if (!declinedInApp && session.ownerTargets.length > 0) {
        log.info(`[session:${session.id}] ${session.ringing}: ${status}, weiter`);
        if (await ringOwner(session)) return;
      }
      // Inhaber hat den Rückruf nicht angenommen: Anrufer an den Telefonassistenten übergeben
      const peerCallSid = session.callSids.peer;
      session.callSids.peer = null;
      if (peerCallSid) {
        await twilio
          .updateCall(peerCallSid, twiml.peerFallback(config.secretaryNumber))
          .catch((error) => log.error("[fallback]", error.message));
      }
      sessions.end(session.id, `Inhaber nicht erreicht (${status})`);
      return;
    }
    if (role === "peer" && !session.paired && session.direction === "outgoing") {
      return sessions.endAfterCue(session.id, "ownerNoAnswer", `peer: ${status}`);
    }
    sessions.end(session.id, `${role}: ${status}`);
  }

  const routes = {
    // Eingehender Anruf auf der Dolmetscher-Nummer
    "/voice/incoming": async ({ params }) => {
      if (samePhone(params.From, config.twilioNumber)) return twiml.reject(); // Weiterleitungsschleife
      if (samePhone(params.From, config.ownerNumber)) {
        return sessions.isFull
          ? twiml.ownerMessage(TEXT.ownerBusy)
          : twiml.ownerPrompt(`${config.publicUrl}/voice/dial`);
      }
      // Vom Handy des Inhabers weitergeleiteter Anruf: Anrufer wartet, Inhaber wird zurückgerufen
      if (sessions.isFull) return twiml.peerFallback(config.secretaryNumber);
      const session = sessions.create({
        direction: "incoming",
        callerNumber: params.From,
        ownerTargets: appIncoming() ? ["app", "mobile"] : ["mobile"],
      });
      session.callSids.peer = params.CallSid;
      if (!(await ringOwner(session))) {
        sessions.end(session.id, "Rückruf fehlgeschlagen");
        return twiml.peerFallback(config.secretaryNumber);
      }
      return twiml.peerStream(config.wsUrl, session.tokens.peer, TEXT.peerIncoming);
    },

    // Inhaber hat die Zielnummer eingetippt
    "/voice/dial": async ({ params }) => {
      if (!samePhone(params.From, config.ownerNumber)) return twiml.reject();
      const target = normalizeDialedNumber(params.Digits);
      if (!isDialAllowed(target, config.allowedPrefixes)) {
        return twiml.ownerMessage(TEXT.ownerBadNumber);
      }
      if (sessions.isFull) return twiml.ownerMessage(TEXT.ownerBusy);
      const session = sessions.create({ direction: "outgoing" });
      session.callSids.owner = params.CallSid;
      try {
        await dial(session, "peer", target);
      } catch (error) {
        log.error("[dial]", error.message);
        sessions.end(session.id, "Anwahl fehlgeschlagen");
        return twiml.ownerMessage(TEXT.ownerBadNumber);
      }
      return twiml.ownerStream(config.wsUrl, session.tokens.owner, TEXT.ownerConnecting);
    },

    // Anruf aus der iOS-App (Twilio Voice SDK über die TwiML-App): der Inhaber ist schon
    // verbunden, gewählt wird sofort die Zielnummer – mit Dolmetscher oder als normaler Anruf
    "/voice/client": async ({ params }) => {
      if (!config.twimlAppSid || params.From !== `client:${config.clientIdentity}`) {
        return twiml.reject();
      }
      const target = toE164(params.to);
      if (dialProblem(target, config.allowedPrefixes)) return twiml.ownerMessage(TEXT.ownerBadNumber);
      if (sessions.isFull) return twiml.ownerMessage(TEXT.ownerBusy);
      const plain = params.mode === "plain";
      const session = sessions.create({
        direction: "outgoing",
        viaApp: true,
        plain,
        mode: params.mode === "seq" ? "seq" : "live",
      });
      session.callSids.owner = params.CallSid;
      if (plain) {
        return twiml.ownerDial(
          target,
          config.peerCallerId ?? config.twilioNumber,
          statusUrl(session, "peer"),
          config.maxCallSeconds,
        );
      }
      try {
        await dial(session, "peer", target);
      } catch (error) {
        log.error("[client]", error.message);
        sessions.end(session.id, "Anwahl fehlgeschlagen");
        return twiml.ownerMessage(TEXT.ownerBadNumber);
      }
      return twiml.ownerStream(config.wsUrl, session.tokens.owner, TEXT.ownerConnecting);
    },

    // Status des App-Anrufs (StatusCallback der TwiML-App): aufgelegt -> Gespräch beenden
    "/voice/client-status": async ({ params }) => {
      const status = params.CallStatus;
      if (FAILED_STATUSES.has(status) || status === "completed") {
        for (const session of sessions.sessions.values()) {
          if (session.callSids.owner === params.CallSid) sessions.end(session.id, `App: ${status}`);
        }
      }
      return "";
    },

    // Ein von uns angerufener Teilnehmer hat abgehoben
    "/voice/leg": async ({ query }) => {
      const entry = sessions.byToken(query.get("token"));
      if (!entry) return twiml.reject();
      const { session, role } = entry;
      if (role === "peer") {
        return clipsReady
          ? twiml.peerStreamFirst(config.wsUrl, session.tokens.peer)
          : twiml.peerStream(config.wsUrl, session.tokens.peer, TEXT.peerOutgoing);
      }
      // Gewöhnlicher Anruf ohne Übersetzung: Twilio verbindet direkt, Rufnummernanzeige = Inhaber
      if (session.plain) {
        return twiml.ownerDial(
          session.pendingTarget,
          config.peerCallerId ?? config.twilioNumber,
          statusUrl(session, "peer"),
          config.maxCallSeconds,
        );
      }
      if (session.pendingTarget) {
        const target = session.pendingTarget;
        session.pendingTarget = null;
        try {
          await dial(session, "peer", target);
        } catch (error) {
          log.error("[leg]", error.message);
          sessions.end(session.id, "Anwahl fehlgeschlagen");
          return twiml.ownerMessage(TEXT.ownerBadNumber);
        }
      }
      return twiml.ownerStream(config.wsUrl, session.tokens.owner, TEXT.ownerJoined);
    },

    // Firmennummer: Anruf per SIP an den ElevenLabs-Telefonassistenten durchreichen
    "/voice/secretary": async () =>
      config.secretarySip ? twiml.dialSip(config.secretarySip) : twiml.reject(),

    "/voice/status": async ({ params, query }) => {
      const session = sessions.get(query.get("session"));
      const status = params.CallStatus;
      if (session && (FAILED_STATUSES.has(status) || status === "completed")) {
        await onLegFinished(session, query.get("role"), status);
      }
      return "";
    },
  };

  async function handleAdminCall(req, res) {
    const url = new URL(req.url, config.publicUrl);
    const byToken =
      config.adminToken && req.headers.authorization === `Bearer ${config.adminToken}`;
    // Schlüssel der Wählseite (?key=) oder der iOS-App (Authorization: Bearer <CALL_KEY>)
    const byKey =
      config.callKey &&
      (url.searchParams.get("key") === config.callKey ||
        req.headers.authorization === `Bearer ${config.callKey}`);
    if (!byToken && !byKey) return send(res, 404, "text/plain", "Not found");
    const body = JSON.parse((await readBody(req)) || "{}");
    // Eingabe wie am Telefon (0214…, 0049…) oder direkt als +49…
    const target = toE164(body.to);
    const problem = dialProblem(target, config.allowedPrefixes);
    if (problem) {
      return send(res, 400, "application/json", JSON.stringify({ ok: false, error: problem }));
    }
    if (sessions.isFull) {
      return send(res, 409, "application/json", JSON.stringify({ ok: false, error: "busy" }));
    }
    // Erst den Inhaber anrufen; die Zielnummer wird gewählt, sobald er abhebt
    const session = sessions.create({
      direction: "outgoing",
      pendingTarget: target,
      plain: body.mode === "plain",
      mode: body.mode === "seq" ? "seq" : "live",
    });
    try {
      await dial(session, "owner", config.ownerNumber);
    } catch (error) {
      log.error("[admin]", error.message);
      sessions.end(session.id, "Anwahl fehlgeschlagen");
      return send(
        res,
        502,
        "application/json",
        JSON.stringify({ ok: false, error: error.message }),
      );
    }
    return send(res, 200, "application/json", JSON.stringify({ ok: true, session: session.id }));
  }

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, config.publicUrl);
      if (req.method === "GET" && url.pathname === "/health") {
        return send(
          res,
          200,
          "application/json",
          JSON.stringify({ ok: true, active: sessions.sessions.size }),
        );
      }
      if (req.method === "GET" && url.pathname === "/call") {
        const allowed = config.callKey && url.searchParams.get("key") === config.callKey;
        return allowed
          ? send(res, 200, "text/html", CALL_PAGE)
          : send(res, 404, "text/plain", "Not found");
      }
      if (req.method === "GET" && url.pathname === "/api/voice-token") {
        const allowed = config.callKey && req.headers.authorization === `Bearer ${config.callKey}`;
        if (!allowed || !config.apiKey || !config.apiSecret || !config.twimlAppSid) {
          return send(res, 404, "application/json", JSON.stringify({ ok: false, error: "voip-off" }));
        }
        const { token, expiresAt } = createVoiceToken({
          pushCredentialSid: config.pushCredentialSid,
          accountSid: config.accountSid,
          apiKey: config.apiKey,
          apiSecret: config.apiSecret,
          appSid: config.twimlAppSid,
          identity: config.clientIdentity,
        });
        return send(
          res,
          200,
          "application/json",
          JSON.stringify({ token, expiresAt, identity: config.clientIdentity, incoming: appIncoming() }),
        );
      }
      if (req.method === "GET" && apiRoutes[url.pathname]) {
        const bearer = req.headers.authorization === `Bearer ${config.callKey}`;
        const allowed = config.callKey && (bearer || url.searchParams.get("key") === config.callKey);
        if (!allowed) return send(res, 404, "text/plain", "Not found");
        try {
          return send(res, 200, "application/json", JSON.stringify(await apiRoutes[url.pathname](url.searchParams)));
        } catch (error) {
          log.error("[api]", error.message);
          return send(res, 502, "application/json", JSON.stringify({ ok: false, error: error.message }));
        }
      }
      if (req.method === "POST" && (url.pathname === "/admin/call" || url.pathname === "/call"))
        return await handleAdminCall(req, res);
      if (req.method === "GET" && url.pathname === "/test") {
        const allowed = config.testKey && url.searchParams.get("key") === config.testKey;
        return allowed
          ? send(res, 200, "text/html", TEST_PAGE)
          : send(res, 404, "text/plain", "Not found");
      }
      if (req.method === "GET" && url.pathname === "/live") {
        const allowed = config.liveKey && url.searchParams.get("key") === config.liveKey;
        return allowed
          ? send(res, 200, "text/html", LIVE_PAGE)
          : send(res, 404, "text/plain", "Not found");
      }

      const route = routes[url.pathname];
      if (req.method !== "POST" || !route) return send(res, 404, "text/plain", "Not found");

      const params = Object.fromEntries(new URLSearchParams(await readBody(req)));
      const valid = verifyTwilioSignature({
        authToken: config.authToken,
        url: config.publicUrl + req.url,
        params,
        signature: req.headers["x-twilio-signature"],
      });
      if (!valid) return send(res, 403, "text/plain", "Invalid signature");

      return send(res, 200, "text/xml", await route({ params, query: url.searchParams }));
    } catch (error) {
      log.error("[http]", error.message);
      return send(res, 500, "text/plain", "Error");
    }
  });

  // Media Streams: Twilio nennt das Token erst im start-Ereignis (Query-Parameter sind nicht erlaubt)
  const wss = new WebSocketServer({ noServer: true });
  const testRoom = new Set();
  server.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url, config.publicUrl);
    const isTest = url.pathname === "/test-ws" && config.testKey;
    if (isTest && url.searchParams.get("key") === config.testKey) {
      return wss.handleUpgrade(req, socket, head, (ws) =>
        attachTestSocket(ws, {
          lang: url.searchParams.get("lang") === "de" ? "de" : "ru",
          room: testRoom,
          live,
          log,
          createTranslator: (options) =>
            url.searchParams.get("mode") === "seq"
              ? createSequentialTranslator({ ...options, apiKey: config.openaiApiKey, log })
              : createTranslator({
                  ...options,
                  apiKey: config.openaiApiKey,
                  model: config.model,
                  log,
                }),
        }),
      );
    }
    if (url.pathname === "/live-ws") {
      const byLiveKey = config.liveKey && url.searchParams.get("key") === config.liveKey;
      const byApp = config.callKey && req.headers.authorization === `Bearer ${config.callKey}`;
      if (!byLiveKey && !byApp) return socket.destroy();
      return wss.handleUpgrade(req, socket, head, (ws) => live.attach(ws));
    }
    if (url.pathname !== "/media") return socket.destroy();
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
  });

  wss.on("connection", (ws) => {
    let token = null;

    let leg = null;
    const authTimer = setTimeout(() => !token && ws.close(), 5000);

    ws.on("message", (raw) => {
      let message;
      try {
        message = JSON.parse(raw.toString("utf8"));
      } catch {
        return;
      }
      if (message.event === "start") {
        const candidate = message.start?.customParameters?.token;
        const streamSid = message.start?.streamSid;
        leg = {
          send: (payload) =>
            ws.readyState === 1 &&
            ws.send(JSON.stringify({ event: "media", streamSid, media: { payload } })),
          clear: () =>
            ws.readyState === 1 && ws.send(JSON.stringify({ event: "clear", streamSid })),
          close: () => ws.close(),
        };
        const entry = sessions.attach(candidate, leg);
        if (!entry) return ws.close();
        token = candidate;
      } else if (message.event === "media" && token) {
        sessions.media(token, message.media?.payload);
      } else if (message.event === "dtmf" && token) {
        sessions.dtmf(token, message.dtmf?.digit);
      } else if (message.event === "stop" && token) {
        sessions.streamClosed(token, leg, "Stream beendet");
        ws.close();
      }
    });

    ws.on("close", () => {
      clearTimeout(authTimer);
      if (token) sessions.streamClosed(token, leg, "Verbindung getrennt");
    });
  });

  return { server, sessions, warmup };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 64 * 1024) return req.destroy();
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res, status, type, body) {
  // Seiten nie cachen: das Telefon soll nach jedem Deploy die aktuelle Version zeigen
  res.writeHead(status, { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "no-store" });
  res.end(body);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  dotenv.config({ quiet: true });
  const config = loadConfig();
  const { server } = buildServer(config);
  server.listen(config.port, "0.0.0.0", () => {
    console.info(`Dolmetscher läuft auf Port ${config.port} (${config.publicUrl})`);
  });
}
