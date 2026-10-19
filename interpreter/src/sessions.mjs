// Ein Gespräch = zwei Twilio-Anrufe (Inhaber, Gesprächspartner) mit je einem Media Stream.
// Sobald beide Streams stehen, läuft pro Richtung eine Übersetzung. Zustand nur im Speicher.
import crypto from "node:crypto";
import { attenuateMulaw, connectedTone, holdTone, mulawToPcm16, ringbackTone } from "./audio.mjs";

// In der Warteschleife hört der Inhaber die Gegenseite leise mit (Musik = Leitung lebt)
const WAIT_GAIN = 0.4;

const OTHER = { owner: "peer", peer: "owner" };

// Echo-Sperre: Während ein Teilnehmer gerade die Übersetzung hört, kann sein Telefon sie wieder
// ins Mikrofon aufnehmen. Ohne Sperre würde sie zurückübersetzt, und der Sprecher hört den eigenen
// Satz in seiner Sprache noch einmal. Solange (plus Nachlauf) geht statt seines Audios Stille an
// die Übersetzung.
const ECHO_TAIL_MS = 600;
// Das Original der Gegenseite läuft leise mit (Klingeln, Ansagen, Stimme), solange gerade keine
// Übersetzung und kein Hinweis abgespielt wird. Twilio spielt gesendetes Audio nacheinander ab,
// deshalb wird die Warteschlange vor einer Übersetzung geleert ("clear").
// Leiser bei "По фразам": dort kommt die Übersetzung erst nach der Äußerung, ein lautes Original
// darunter verwirrt. Im Synchronmodus etwas lauter (Klingeln, Sprachmenüs bleiben hörbar).
const PASSTHROUGH_GAIN = { live: 0.35, seq: 0.15, direct: 0.35 };
const RINGBACK = ringbackTone();
const CONNECTED = connectedTone();
const RINGBACK_INTERVAL_MS = 5000;
// Eingehender Anrufer wartet auf den Rückruf an den Inhaber: alle 4 s ein weicher Doppelton,
// jedes vierte Mal stattdessen "Einen Moment bitte" – sonst hört er Stille und legt auf
const HOLD = holdTone();
const HOLD_INTERVAL_MS = 4000;
const HOLD_SPEECH_EVERY = 4;
const MULAW_SILENCE = 0xff;
const silenceLike = (payload) =>
  Buffer.alloc(Buffer.from(payload, "base64").length, MULAW_SILENCE).toString("base64");
const mulawMs = (payload) => Buffer.from(payload, "base64").length / 8; // 8 kHz, 1 Byte je Sample
const rms = (payload) => {
  const b = Buffer.from(payload, "base64");
  let sum = 0;
  for (let i = 0; i < b.length; i += 4) {
    const v = mulawToPcm16(b[i]);
    sum += v * v;
  }
  return Math.sqrt(sum / Math.max(1, b.length / 4));
};
const isLoud = (payload) => rms(payload) > 300;
// Die Übersetzung liefert durchgehend Audio, auch Stille. Stille Stücke werden verworfen, sonst
// blockieren sie das leise Original (Warteschleife, Sprachmenü) und jeden Hinweis.
const TRANSLATION_SILENCE_RMS = 120;
const TRANSLATION_HOLD_MS = 400;
// Dazwischenreden: spricht der Hörer deutlich, während ihm eine Übersetzung vorgespielt wird,
// bricht die Wiedergabe ab und seine Rede geht normal weiter. Hohe Schwelle gegen Echo.
const BARGE_IN_RMS = 1500;
// Erst eine echte Äußerung bricht ab, kein kurzes "ja"/"ага": laute Pakete zählen +1, leise −0,5;
// bei 30 (≈ 0,6 s Sprache netto) wird die Wiedergabe gestoppt
const BARGE_IN_FRAMES = 30;

export class SessionStore {
  constructor({
    createTranslator,
    languages,
    maxSessions = 1,
    maxCallSeconds = 1800,
    onEnd = () => {},
    onDtmf = null,
    // Hinweise für die App (Live-Text): "notice" (Ansage an die Gegenseite läuft, ms) und "ready"
    onCue = () => {},
    // Warteschleife abhören: (session, onHuman) => { push(payload), close() }
    createWatcher = null,
    clips = null,
    log = console,
  }) {
    this.clips = clips;
    this.onDtmf = onDtmf;
    this.onCue = onCue;
    this.createWatcher = createWatcher;
    this.createTranslator = createTranslator;
    this.languages = languages; // { owner: "ru", peer: "de" } – Sprache, die der jeweilige Teilnehmer hört
    this.maxSessions = maxSessions;
    this.maxCallSeconds = maxCallSeconds;
    this.onEnd = onEnd;
    this.log = log;
    this.sessions = new Map();
    this.tokens = new Map();
  }

  get isFull() {
    return this.sessions.size >= this.maxSessions;
  }

  create(extra = {}) {
    const session = {
      id: crypto.randomBytes(8).toString("hex"),
      tokens: {
        owner: crypto.randomBytes(16).toString("hex"),
        peer: crypto.randomBytes(16).toString("hex"),
      },
      legs: {},
      callSids: {},
      translators: null,
      paired: false,
      // Zeitpunkt (ms), bis zu dem der jeweilige Teilnehmer noch Übersetzung hört
      playingUntil: { owner: 0, peer: 0 },
      // bis wann der Teilnehmer eine Übersetzung hört (nur dafür gilt die Echo-Sperre;
      // während eines Hinweises soll die Gegenseite – z. B. ein Sprachmenü – weiter übersetzt werden)
      translationUntil: { owner: 0, peer: 0 },
      // Stream wird gerade neu aufgebaut (nach Tastendruck); "stop" dann nicht als Ende werten
      reattaching: { owner: false, peer: false },
      stats: {
        owner: { frames: 0, loud: 0, translated: 0, dropped: 0, passed: 0 },
        peer: { frames: 0, loud: 0, translated: 0, dropped: 0, passed: 0 },
      },
      // bis wann nach dem letzten hörbaren Übersetzungsstück auch leise Stücke noch gesendet werden
      translationHoldUntil: { owner: 0, peer: 0 },
      bargeFrames: { owner: 0, peer: 0 },
      lastHashAt: 0,
      ...extra,
    };
    session.timer = setTimeout(() => this.end(session.id, "Zeitlimit"), this.maxCallSeconds * 1000);
    session.timer.unref?.();
    session.statsTimer = setInterval(() => this.#logStats(session), 10000);
    session.statsTimer.unref?.();
    this.sessions.set(session.id, session);
    this.tokens.set(session.tokens.owner, { session, role: "owner" });
    this.tokens.set(session.tokens.peer, { session, role: "peer" });
    return session;
  }

  get(id) {
    return this.sessions.get(id);
  }

  byToken(token) {
    return this.tokens.get(token) ?? null;
  }

  // leg: { send(mulawBase64), clear(), close() }
  attach(token, leg) {
    const entry = this.byToken(token);
    if (!entry) return null;
    const { session, role } = entry;
    if (session.reattaching[role]) {
      // Stream nach Tastendruck neu verbunden: Übersetzung läuft weiter
      session.reattaching[role] = false;
      session.legs[role] = leg;
      this.log.info(`[session:${session.id}] ${role} wieder verbunden`);
      return entry;
    }
    if (session.legs[role]) return null;
    session.legs[role] = leg;
    if (session.legs.owner && session.legs.peer) {
      this.#pair(session);
    } else if (role === "owner" && session.direction === "outgoing") {
      // Freizeichen, bis der Gesprächspartner abhebt
      session.ringTimer = setInterval(
        () => this.#playback(session, "owner", RINGBACK),
        RINGBACK_INTERVAL_MS,
      );
      session.ringTimer.unref?.();
    } else if (role === "peer" && session.direction === "incoming") {
      this.#startHold(session);
    }
    // Ohne Übersetzung ("off") kein KI-Hinweis – der kommt erst, wenn der Inhaber sie einschaltet
    if (role === "peer" && session.direction === "outgoing" && session.mode !== "off") this.#announce(session);
    return entry;
  }

  media(token, payload, now = Date.now()) {
    const entry = this.byToken(token);
    if (!entry) return;
    const { session, role } = entry;
    if (session.waiting) {
      // Warten: nichts übersetzen; die Gegenseite geht an den Wächter und leise an den Inhaber,
      // der Inhaber selbst wird nicht übertragen (Geräusche am Tisch sollen nicht in die Leitung)
      if (role === "peer") {
        session.watcher?.push(payload);
        if (now >= session.playingUntil.owner) session.legs.owner?.send(attenuateMulaw(payload, WAIT_GAIN));
      }
      return;
    }
    if (session.mode === "off") {
      // Ohne Übersetzung: normales Telefonat, Stimme unverändert zur anderen Seite
      const other = OTHER[role];
      if (now >= session.playingUntil[other]) session.legs[other]?.send(payload);
      return;
    }
    if (!session.translators) return;
    let hearing = now < session.translationUntil[role] + ECHO_TAIL_MS;
    if (hearing && now < session.translationUntil[role]) {
      session.bargeFrames[role] =
        rms(payload) > BARGE_IN_RMS ? session.bargeFrames[role] + 1 : Math.max(0, session.bargeFrames[role] - 0.5);
      if (session.bargeFrames[role] >= BARGE_IN_FRAMES) {
        this.stopPlayback(session, role);
        hearing = false;
        this.log.info(`[session:${session.id}] ${role} redet dazwischen`);
      }
    } else {
      session.bargeFrames[role] = 0;
    }
    // "direct": der Inhaber spricht selbst – sein Original geht unverändert an die Gegenseite,
    // nichts wird übersetzt; die Gegenseite wird ihm weiterhin übersetzt
    const direct = role === "owner" && session.mode === "direct";
    session.translators[role].send(hearing || direct ? silenceLike(payload) : payload);
    const stats = session.stats[role];
    stats.frames += 1;
    if (isLoud(payload)) stats.loud += 1;
    // Original leise an die andere Seite, wenn dort gerade nichts abgespielt wird
    // (nicht während der Sprecher selbst Übersetzung hört – das wäre nur Echo)
    const listener = OTHER[role];
    if (direct) {
      session.legs[listener]?.send(payload);
      stats.passed += 1;
    } else if (!hearing && now >= session.playingUntil[listener]) {
      session.legs[listener]?.send(attenuateMulaw(payload, PASSTHROUGH_GAIN[session.mode] ?? 0.35));
      stats.passed += 1;
    }
  }

  // Übersetzung oder Hinweis für einen Teilnehmer: Durchreich-Puffer leeren, Zeit merken
  #playback(session, listener, payload, isTranslation = false) {
    const now = Date.now();
    const cuePlaying =
      now < session.playingUntil[listener] && now >= session.translationUntil[listener];
    // Die KI-Ansage an die Gegenseite wird nie von einer Übersetzung abgeschnitten – die kommt danach
    const noticePlaying = listener === "peer" && now < (session.noticeUntil ?? 0);
    if (now >= session.playingUntil[listener] || (isTranslation && cuePlaying && !noticePlaying)) {
      session.legs[listener]?.clear?.();
      session.playingUntil[listener] = now;
    }
    if (isTranslation) session.stats[OTHER[listener]].translated += 1;
    session.playingUntil[listener] =
      Math.max(now, session.playingUntil[listener]) + mulawMs(payload);
    if (isTranslation) session.translationUntil[listener] = session.playingUntil[listener];
    session.legs[listener]?.send(payload);
  }

  // Stream eines Teilnehmers ist weg: Gesprächsende – außer er wird gerade neu aufgebaut
  streamClosed(token, leg, reason) {
    const entry = this.byToken(token);
    if (!entry) return;
    const { session, role } = entry;
    if (session.reattaching[role]) {
      session.legs[role] = null;
      return;
    }
    // Ein schon ersetztes Bein (alter Stream nach Tastendruck) beendet das Gespräch nicht
    if (session.legs[role] && session.legs[role] !== leg) return;
    this.end(session.id, reason);
  }

  // Laufende Wiedergabe (Übersetzung oder Hinweis) für einen Teilnehmer abbrechen
  stopPlayback(session, listener) {
    session.legs[listener]?.clear?.();
    const now = Date.now();
    session.playingUntil[listener] = now;
    session.translationUntil[listener] = now;
    session.bargeFrames[listener] = 0;
  }

  // Text oder Schnellsatz des Inhabers an die Gegenseite (μ-law base64)
  say(session, payload) {
    if (!session.paired || !session.legs.peer) return false;
    this.#playback(session, "peer", payload);
    return true;
  }

  // "Für mich warten": Übersetzung aus (spart OpenAI), Wächter hört die Warteschleife ab
  startWait(session) {
    if (!session.paired || session.waiting || !this.createWatcher) return false;
    session.waiting = true;
    session.waitStartedAt = Date.now();
    this.#stopTranslators(session);
    session.watcher = this.createWatcher(session, () => this.stopWait(session, { human: true }));
    this.stopPlayback(session, "owner");
    this.#play(session, "owner", "ownerWait");
    this.onCue(session, "wait", { on: true });
    this.log.info(`[session:${session.id}] Warteschleife: Inhaber wartet`);
    return true;
  }

  // Warten beenden: von Hand oder weil ein Mensch abgenommen hat (dann Hinweis an ihn + Signal)
  stopWait(session, { human = false } = {}) {
    if (!session.waiting || !this.sessions.has(session.id)) return false;
    session.waiting = false;
    session.watcher?.close();
    session.watcher = null;
    if (session.mode !== "off") this.#startTranslators(session);
    this.onCue(session, "wait", { on: false });
    if (human) {
      this.stopPlayback(session, "owner");
      this.#play(session, "owner", "ownerHuman");
      this.onCue(session, "human", {});
      if (session.mode !== "off") this.#announce(session);
      const waited = Math.round((Date.now() - session.waitStartedAt) / 1000);
      this.log.info(`[session:${session.id}] Mensch erkannt nach ${waited} s`);
    }
    return true;
  }

  // Übersetzungsmodus im Gespräch wechseln: live -> seq -> direct -> live
  // Übersetzung im Gespräch ein-/ausschalten (Knopf "Переводчик" in der App, * am Telefon aus "off")
  setTranslation(session, on, mode = "live") {
    if (!session.paired || session.waiting) return false;
    if (on) {
      const wanted = mode === "seq" ? "seq" : "live";
      if (session.mode !== "off") {
        // Schon übersetzt: nur zwischen Синхронно und По фразам wechseln, ohne erneute Ansage
        if (session.mode === wanted) return false;
        this.#stopTranslators(session);
        session.mode = wanted;
        this.stopPlayback(session, "owner");
        this.#startTranslators(session);
        this.onCue(session, "translator", { on: true, mode: session.mode });
        this.#play(session, "owner", wanted === "seq" ? "modeSeq" : "modeLive");
        this.log.info(`[session:${session.id}] Modus: ${session.mode}`);
        return true;
      }
      session.mode = wanted;
      this.stopPlayback(session, "owner");
      this.stopPlayback(session, "peer");
      this.#startTranslators(session);
      this.onCue(session, "translator", { on: true, mode: session.mode });
      this.#announce(session);
    } else {
      if (session.mode === "off") return false;
      this.#stopTranslators(session);
      session.mode = "off";
      this.stopPlayback(session, "owner");
      this.stopPlayback(session, "peer");
      clearTimeout(session.noticeTimer);
      this.onCue(session, "translator", { on: false });
    }
    this.log.info(`[session:${session.id}] Übersetzung ${on ? "an" : "aus"}`);
    return true;
  }

  switchMode(session) {
    if (!session.paired || session.waiting) return;
    if (session.mode === "off") return this.setTranslation(session, true);
    const order = ["live", "seq", "direct"];
    const previous = session.mode ?? "live";
    session.mode = order[(order.indexOf(previous) + 1) % order.length];
    // Übersetzer nur neu aufbauen, wenn sich die Übersetzungsart ändert (direct nutzt die laufenden)
    const engine = (m) => (m === "seq" ? "seq" : "live");
    if (engine(previous) !== engine(session.mode)) {
      this.#stopTranslators(session);
      this.#startTranslators(session);
    }
    this.stopPlayback(session, "owner");
    const clip = { live: "modeLive", seq: "modeSeq", direct: "modeDirect" }[session.mode];
    this.onCue(session, "translator", { on: true, mode: session.mode });
    this.#play(session, "owner", clip);
    this.log.info(`[session:${session.id}] Modus: ${session.mode}`);
  }

  // Tasten des Inhabers: # = Wiedergabe überspringen, * = Modus wechseln, Ziffern -> Gegenseite
  dtmf(token, digit) {
    const entry = this.byToken(token);
    if (!entry || entry.role !== "owner" || !/^[0-9*#]$/.test(digit)) return;
    const { session } = entry;
    if (digit === "#") {
      // ## kurz hintereinander: den Hinweis für die Gegenseite noch einmal abspielen
      const now = Date.now();
      const twice = now - session.lastHashAt < 1500;
      session.lastHashAt = twice ? 0 : now;
      if (twice && session.paired) {
        this.#announce(session);
        this.log.info(`[session:${session.id}] Hinweis an Gegenseite wiederholt`);
        return;
      }
      return this.stopPlayback(session, "owner");
    }
    if (digit === "*") return this.switchMode(session);
    if (!session.paired || !session.callSids.peer || !this.onDtmf) return;
    session.reattaching.peer = true;
    this.log.info(`[session:${session.id}] Taste an Gegenseite`);
    this.onDtmf(session, digit);
  }

  #logStats(session) {
    if (!session.paired) return;
    const f = (r) => {
      const s = session.stats[r];
      return `${r}: frames ${s.frames}, laut ${s.loud}, übersetzt ${s.translated}, still verworfen ${s.dropped}, durchgereicht ${s.passed}`;
    };
    this.log.info(`[session:${session.id}] ${f("owner")} | ${f("peer")}`);
  }

  // Ansage an die Gegenseite (KI-Dolmetscher, keine Aufzeichnung). Der Inhaber hört sie nicht –
  // damit er weiß, wann er anfangen kann, bekommt er danach "Можно говорить" ins Ohr und die App
  // einen Hinweis mit der Dauer.
  #announce(session) {
    const payload = this.clips?.get("peerNotice");
    clearTimeout(session.noticeTimer);
    if (!payload) return this.#ready(session); // Ansage lief schon per <Say> vor dem Stream
    this.stopPlayback(session, "peer");
    this.#playback(session, "peer", payload);
    const ms = mulawMs(payload);
    session.noticeUntil = Date.now() + ms;
    this.onCue(session, "notice", { ms });
    session.noticeTimer = setTimeout(() => this.#ready(session), ms + 200);
    session.noticeTimer.unref?.();
  }

  #ready(session) {
    if (!this.sessions.has(session.id)) return;
    const clip = this.clips?.get("ownerReady");
    this.#playback(session, "owner", clip ?? CONNECTED);
    this.onCue(session, "ready", {});
    this.log.info(`[session:${session.id}] Ansage beendet, Inhaber kann sprechen`);
  }

  #play(session, listener, clipKey) {
    const payload = this.clips?.get(clipKey);
    if (payload) this.#playback(session, listener, payload);
  }

  end(id, reason = "beendet") {
    const session = this.sessions.get(id);
    if (!session) return;
    this.sessions.delete(id);
    this.tokens.delete(session.tokens.owner);
    this.tokens.delete(session.tokens.peer);
    clearTimeout(session.timer);
    clearInterval(session.ringTimer);
    clearInterval(session.holdTimer);
    clearTimeout(session.noticeTimer);
    clearInterval(session.statsTimer);
    session.watcher?.close();
    this.#logStats(session);
    this.#stopTranslators(session);
    session.legs.owner?.close();
    session.legs.peer?.close();
    this.onEnd(session);
    this.log.info(`[session:${id}] ${reason}`);
  }

  // Hinweis abspielen und das Gespräch erst danach beenden
  endAfterCue(id, clipKey, reason) {
    const session = this.sessions.get(id);
    if (!session) return;
    clearInterval(session.ringTimer);
    const payload = this.clips?.get(clipKey);
    const listener = "owner";
    if (!payload || !session.legs[listener]) return this.end(id, reason);
    this.#playback(session, listener, payload);
    setTimeout(() => this.end(id, reason), mulawMs(payload) + 300).unref?.();
  }

  #startHold(session) {
    if (session.quietHold) {
      // Alle Anrufe gehen direkt in die App: Anrufer hört ein normales Freizeichen, keine Ansage
      this.#playback(session, "peer", RINGBACK);
      session.holdTimer = setInterval(() => this.#playback(session, "peer", RINGBACK), RINGBACK_INTERVAL_MS);
      session.holdTimer.unref?.();
      return;
    }
    let tick = 0;
    const play = () => {
      tick += 1;
      const speech = tick % HOLD_SPEECH_EVERY === 0 ? this.clips?.get("peerWait") : null;
      this.#playback(session, "peer", speech ?? HOLD);
    };
    play();
    session.holdTimer = setInterval(play, HOLD_INTERVAL_MS);
    session.holdTimer.unref?.();
  }

  #pair(session) {
    session.paired = true;
    clearInterval(session.ringTimer);
    if (session.holdTimer) {
      clearInterval(session.holdTimer);
      this.stopPlayback(session, "peer");
    }
    // Beide Seiten verbunden – für die App (Zeit läuft, Live-Text dieses Gesprächs beginnt)
    this.onCue(session, "paired", { direction: session.direction, mode: session.mode });
    if (session.mode === "off") this.onCue(session, "translator", { on: false });
    else this.#startTranslators(session);
    if (session.direction === "outgoing") this.#playback(session, "owner", CONNECTED);
    this.log.info(`[session:${session.id}] beide Teilnehmer verbunden${session.mode === "off" ? " (ohne Übersetzung)" : ""}`);
  }

  // Übersetzer schließen und die übersetzte Zeit aufaddieren (für die Kostenanzeige)
  #stopTranslators(session) {
    session.translators?.owner.close();
    session.translators?.peer.close();
    session.translators = null;
    if (session.translatingSince) {
      session.translatedMs = (session.translatedMs ?? 0) + (Date.now() - session.translatingSince);
      session.translatingSince = null;
    }
  }

  #startTranslators(session) {
    session.translatingSince = Date.now();
    const translator = (role) =>
      this.createTranslator({
        sourceLanguage: this.languages[role],
        targetLanguage: this.languages[OTHER[role]],
        // "live" = gpt-realtime-translate (schnell), "seq" = Pause → Text → Übersetzung → Vorlesen (genau);
        // "direct" (Inhaber spricht selbst) nutzt den live-Übersetzer für die Gegenseite
        mode: session.mode === "seq" ? "seq" : "live",
        label: `${session.id}:${role}`,
        onAudio: (payload) => {
          const now = Date.now();
          if (rms(payload) > TRANSLATION_SILENCE_RMS) {
            session.translationHoldUntil[role] = now + TRANSLATION_HOLD_MS;
          } else if (now >= session.translationHoldUntil[role]) {
            session.stats[role].dropped += 1;
            return;
          }
          this.#playback(session, OTHER[role], payload, true);
        },
      });
    // translators[role] übersetzt, was dieser Teilnehmer sagt, in die Sprache des anderen
    session.translators = { owner: translator("owner"), peer: translator("peer") };
  }
}
