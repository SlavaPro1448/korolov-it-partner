// Post-call-Webhook des ElevenLabs-Telefonassistenten: prüft die Signatur und
// schickt dem Inhaber eine Zusammenfassung des Anrufs per E-Mail (auf Russisch,
// dringende Fälle mit «СРОЧНО» im Betreff). Agent-Konfiguration: voice-agent/agent-config.md.
import crypto from "node:crypto";
import { sendEmail, escapeHtml } from "./contactHandler.mjs";

const SIGNATURE_TOLERANCE_SECS = 30 * 60;

const TOPIC_LABELS = {
  stoerung: "Сбой: сайт, почта или IT не работает",
  website: "Новый сайт",
  wartung: "Поддержка сайта",
  "email-domain": "Почта, домен, хостинг",
  "it-support": "IT-поддержка",
  "digital-setup": "Digital Setup",
  werbung: "Реклама / спам",
  sonstiges: "Другое",
};

const LANGUAGE_LABELS = { de: "немецкий", ru: "русский", uk: "украинский" };

// Header-Format: "t=<unix>,v0=<hex hmac-sha256 von `${t}.${rawBody}`>"
export function verifySignature(rawBody, header, secret, nowSecs = Date.now() / 1000) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(
    String(header)
      .split(",")
      .map((p) => p.trim().split("=")),
  );
  const timestamp = Number(parts.t);
  if (!Number.isFinite(timestamp) || !parts.v0) return false;
  if (Math.abs(nowSecs - timestamp) > SIGNATURE_TOLERANCE_SECS) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v0);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function collected(data, key) {
  const value = data?.analysis?.data_collection_results?.[key]?.value;
  return value === null || value === undefined ? "" : String(value).trim();
}

function isUrgent(data) {
  const value = data?.analysis?.data_collection_results?.urgent?.value;
  return value === true || String(value).toLowerCase() === "true";
}

function formatDuration(secs) {
  const total = Math.max(0, Math.round(Number(secs) || 0));
  return `${Math.floor(total / 60)} мин ${total % 60} с`;
}

function formatTranscript(transcript) {
  if (!Array.isArray(transcript)) return "";
  return transcript
    .filter((turn) => turn?.message)
    // Sprechstil-Marker der Sprachausgabe wie "[friendly]" gehören nicht ins Protokoll.
    .map((turn) => {
      const message = String(turn.message).replace(/^\s*\[[^\]]{1,30}\]\s*/, "");
      return `${turn.role === "agent" ? "Ассистент" : "Клиент"}: ${message}`;
    })
    .join("\n");
}

export function buildCallEmail(data) {
  const urgent = isUrgent(data);
  const name = collected(data, "caller_name") || "имя не названо";
  const company = collected(data, "company");
  const topic = collected(data, "topic");
  const topicLabel = TOPIC_LABELS[topic] ?? (topic || "тема не определена");
  const language = collected(data, "language");
  const callerId = data?.metadata?.phone_call?.external_number ?? "";
  const summary =
    collected(data, "summary_ru") || data?.analysis?.transcript_summary || "Резюме отсутствует.";

  const rows = [
    ["Имя", name],
    ["Фирма", company],
    ["Номер для обратного звонка", collected(data, "callback_number")],
    ["Номер, с которого звонили", callerId],
    ["Тема", topicLabel],
    ["Когда удобно перезвонить", collected(data, "best_time")],
    ["Язык разговора", LANGUAGE_LABELS[language] ?? language],
    ["Длительность", formatDuration(data?.metadata?.call_duration_secs)],
  ].filter(([, value]) => value);

  const transcript = formatTranscript(data?.transcript);
  const subject = `${urgent ? "СРОЧНО — " : ""}Звонок: ${name}${company ? `, ${company}` : ""} — ${topicLabel}`;

  const text = [
    urgent ? "СРОЧНО: клиент сообщил о сбое.\n" : "",
    summary,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Транскрипт:",
    transcript,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111;">
      ${urgent ? '<p style="margin:0 0 12px 0;padding:8px 12px;background:#b91c1c;color:#fff;font-weight:bold;">СРОЧНО: клиент сообщил о сбое</p>' : ""}
      <p style="margin:0 0 16px 0;">${escapeHtml(summary)}</p>
      <table style="border-collapse:collapse;margin:0 0 16px 0;">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#555;">${escapeHtml(label)}</td><td style="padding:4px 0;"><strong>${escapeHtml(value)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin:0 0 8px 0;font-size:15px;">Транскрипт</h3>
      <pre style="white-space:pre-wrap;font-family:inherit;margin:0;color:#333;">${escapeHtml(transcript)}</pre>
    </div>`;

  return { subject, text, html };
}

export async function handleVoiceWebhook({ rawBody, signature, send = sendEmail }) {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[voice-webhook] ELEVENLABS_WEBHOOK_SECRET fehlt");
    return { status: 500, body: { ok: false, error: "not_configured" } };
  }
  if (!verifySignature(rawBody, signature, secret)) {
    return { status: 401, body: { ok: false, error: "invalid_signature" } };
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { ok: false, error: "invalid_json" } };
  }
  // Andere Event-Typen (z. B. Audio) bestätigen, aber nicht verarbeiten.
  if (payload?.type !== "post_call_transcription" || !payload.data) {
    return { status: 200, body: { ok: true, ignored: true } };
  }

  const { subject, text, html } = buildCallEmail(payload.data);
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;
  const to = process.env.VOICE_MAIL_TO ?? process.env.MAIL_TO ?? process.env.SMTP_USER;

  try {
    await send({ from, to, subject, text, html });
  } catch (err) {
    // 5xx → ElevenLabs wiederholt die Zustellung.
    console.error("[voice-webhook] mail failed:", err?.message ?? err);
    return { status: 502, body: { ok: false, error: "mail_failed" } };
  }
  return { status: 200, body: { ok: true } };
}
