import nodemailer from "nodemailer";

const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^[\d\s+\-()]*$/;

const TOPIC_LABELS = {
  de: {
    website: "Website erstellen",
    wartung: "Website-Betreuung",
    "email-domain": "E-Mail, Domain & Hosting",
    "it-support": "IT-Support",
    "digital-setup": "Digital Setup",
    sonstiges: "Sonstiges",
    other: "Sonstiges",
    support: "Website-Betreuung",
  },
  ru: {
    website: "Создание сайта",
    wartung: "Поддержка сайта",
    support: "Поддержка сайта",
    "email-domain": "Почта, домен и хостинг",
    "it-support": "IT-поддержка",
    "digital-setup": "Digital Setup",
    other: "Другое",
    sonstiges: "Другое",
  },
  ua: {
    website: "Створення сайту",
    wartung: "Підтримка сайту",
    support: "Підтримка сайту",
    "email-domain": "Пошта, домен і хостинг",
    "it-support": "IT-підтримка",
    "digital-setup": "Digital Setup",
    other: "Інше",
    sonstiges: "Інше",
  },
};

const LANG_LABELS = {
  de: {
    name: "Name",
    company: "Unternehmen",
    email: "E-Mail",
    phone: "Telefon",
    topic: "Anliegen",
    message: "Nachricht",
    locale: "Sprache",
    ip: "IP",
    userAgent: "User-Agent",
  },
  ru: {
    name: "Имя",
    company: "Компания",
    email: "E-mail",
    phone: "Телефон",
    topic: "Тема",
    message: "Сообщение",
    locale: "Язык формы",
    ip: "IP",
    userAgent: "User-Agent",
  },
  ua: {
    name: "Ім'я",
    company: "Компанія",
    email: "E-mail",
    phone: "Телефон",
    topic: "Тема",
    message: "Повідомлення",
    locale: "Мова форми",
    ip: "IP",
    userAgent: "User-Agent",
  },
};

const VALIDATION_MESSAGES = {
  de: {
    name: "Bitte geben Sie Ihren Namen ein.",
    nameMin: "Der Name muss mindestens 2 Zeichen haben.",
    email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    phone: "Nur Ziffern, Leerzeichen und + - ( ) sind erlaubt.",
    topic: "Bitte wählen Sie ein Anliegen.",
    message: "Bitte geben Sie eine Nachricht ein.",
    messageMin: "Die Nachricht muss mindestens 10 Zeichen haben.",
    messageMax: "Die Nachricht darf höchstens 2000 Zeichen haben.",
    consent: "Bitte bestätigen Sie die Datenschutzerklärung.",
    rateLimit: "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
    server: "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
  },
  ru: {
    name: "Пожалуйста, укажите ваше имя.",
    nameMin: "Имя должно содержать минимум 2 символа.",
    email: "Введите корректный e-mail.",
    phone: "Допустимы только цифры, пробелы и + - ( ).",
    topic: "Выберите тему запроса.",
    message: "Напишите сообщение.",
    messageMin: "Сообщение должно содержать минимум 10 символов.",
    messageMax: "Сообщение не должно превышать 2000 символов.",
    consent: "Подтвердите согласие с политикой конфиденциальности.",
    rateLimit: "Слишком много запросов. Попробуйте позже.",
    server: "Не удалось отправить сообщение. Попробуйте ещё раз.",
  },
  ua: {
    name: "Будь ласка, вкажіть ім'я.",
    nameMin: "Ім'я має містити щонайменше 2 символи.",
    email: "Введіть коректний e-mail.",
    phone: "Дозволені лише цифри, пробіли та + - ( ).",
    topic: "Оберіть тему звернення.",
    message: "Напишіть повідомлення.",
    messageMin: "Повідомлення має містити щонайменше 10 символів.",
    messageMax: "Повідомлення не може перевищувати 2000 символів.",
    consent: "Підтвердіть згоду з політикою конфіденційності.",
    rateLimit: "Забагато запитів. Спробуйте пізніше.",
    server: "Не вдалося надіслати повідомлення. Спробуйте ще раз.",
  },
};

const rateLimitWindowMs = 60_000;
const rateLimitMax = Number(process.env.CONTACT_RATE_LIMIT_PER_MIN ?? "5");
const rateLimitStore = new Map();

function checkRateLimit(ip) {
  if (!ip) return true;
  const now = Date.now();
  const bucket = rateLimitStore.get(ip) ?? [];
  const fresh = bucket.filter((t) => now - t < rateLimitWindowMs);
  if (fresh.length >= rateLimitMax) {
    rateLimitStore.set(ip, fresh);
    return false;
  }
  fresh.push(now);
  rateLimitStore.set(ip, fresh);
  return true;
}

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

function sanitizeLine(s) {
  return String(s ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

function pickLocale(input) {
  const v = String(input ?? "").toLowerCase();
  if (v === "ru" || v === "de") return v;
  if (v === "uk" || v === "ua") return "ua";
  return "de";
}

function validate(body, locale) {
  const msgs = VALIDATION_MESSAGES[locale];
  const errors = {};

  const name = sanitizeLine(body.name);
  if (!name) errors.name = msgs.name;
  else if (name.length < 2) errors.name = msgs.nameMin;

  const email = sanitizeLine(body.email);
  if (!email || !EMAIL_FORMAT_RE.test(email)) errors.email = msgs.email;

  const phone = sanitizeLine(body.phone);
  if (phone && !PHONE_CHARS_RE.test(phone)) errors.phone = msgs.phone;

  const topic = sanitizeLine(body.topic);
  if (!topic) errors.topic = msgs.topic;

  const message = String(body.message ?? "").trim();
  if (!message) errors.message = msgs.message;
  else if (message.length < 10) errors.message = msgs.messageMin;
  else if (message.length > 2000) errors.message = msgs.messageMax;

  if (!body.consent) errors.consent = msgs.consent;

  return { errors, clean: { name, email, phone, topic, message, company: sanitizeLine(body.company) } };
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmail({ clean, locale, topicLabel, ip, userAgent }) {
  const L = LANG_LABELS[locale];
  const rows = [
    [L.name, clean.name || "-"],
    [L.company, clean.company || "-"],
    [L.email, clean.email || "-"],
    [L.phone, clean.phone || "-"],
    [L.topic, topicLabel],
    [L.locale, locale.toUpperCase()],
  ];

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\n${L.message}:\n${clean.message}\n\n— — —\n${L.ip}: ${ip}\n${L.userAgent}: ${userAgent}`;

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; color:#111;">
      <h2 style="margin:0 0 16px 0;">${escapeHtml(process.env.MAIL_SUBJECT ?? "Neue Anfrage über die Website")}</h2>
      <table style="border-collapse: collapse; font-size: 14px;">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0; color:#555;">${escapeHtml(k)}</td><td style="padding:6px 0;"><strong>${escapeHtml(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin:24px 0 8px 0;">${escapeHtml(L.message)}</h3>
      <pre style="white-space: pre-wrap; word-wrap: break-word; background:#f5f5f5; padding:12px; border-radius:8px; font-family: inherit; font-size: 14px;">${escapeHtml(clean.message)}</pre>
      <p style="margin-top:24px; color:#888; font-size:12px;">${escapeHtml(L.ip)}: ${escapeHtml(ip)}<br>${escapeHtml(L.userAgent)}: ${escapeHtml(userAgent)}</p>
    </div>
  `;

  return { text, html };
}

const CLIENT_COPY_TEXT = {
  de: {
    subject: "Ihre Anfrage ist eingegangen — Korolov IT-Service",
    greet: (name) => `Hallo ${name},`,
    body:
      "vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und melden uns zeitnah bei Ihnen.\n\nMit freundlichen Grüßen\nKorolov IT-Service",
  },
  ru: {
    subject: "Ваше обращение получено — Korolov IT-Service",
    greet: (name) => `Здравствуйте, ${name}!`,
    body:
      "Спасибо за сообщение. Мы получили вашу заявку и свяжемся с вами в ближайшее время.\n\nС уважением,\nKorolov IT-Service",
  },
  ua: {
    subject: "Ваше звернення отримано — Korolov IT-Service",
    greet: (name) => `Вітаємо, ${name}!`,
    body:
      "Дякуємо за повідомлення. Ми отримали вашу заявку і зв'яжемося з вами найближчим часом.\n\nЗ повагою,\nKorolov IT-Service",
  },
};

function buildClientCopyEmail(locale, name) {
  const L = CLIENT_COPY_TEXT[locale] ?? CLIENT_COPY_TEXT.de;
  const displayName = name?.trim() || (locale === "de" ? "Kunde" : locale === "ru" ? "клиент" : "клієнт");
  const text = `${L.greet(displayName)}\n\n${L.body}`;
  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; color:#111; font-size:14px;">
      <p>${escapeHtml(L.greet(displayName))}</p>
      <p>${escapeHtml(L.body).replace(/\n/g, "<br>")}</p>
    </div>
  `;
  return { subject: L.subject, text, html };
}

export async function handleContact(rawBody, meta = {}) {
  const ip = meta.ip ?? "-";
  const userAgent = meta.userAgent ?? "-";

  const honey = String(rawBody?._honey ?? "").trim();
  if (honey) {
    return { ok: true, status: 200, body: { ok: true, skipped: "honeypot" } };
  }

  const locale = pickLocale(rawBody?.locale);

  if (!checkRateLimit(ip)) {
    return {
      ok: false,
      status: 429,
      body: { ok: false, error: VALIDATION_MESSAGES[locale].rateLimit },
    };
  }

  const { errors, clean } = validate(rawBody ?? {}, locale);
  if (Object.keys(errors).length > 0) {
    return { ok: false, status: 400, body: { ok: false, errors } };
  }

  const topicLabel = TOPIC_LABELS[locale][clean.topic] ?? clean.topic;

  let transporter;
  try {
    transporter = getTransporter();
  } catch (err) {
    console.error("[contact] SMTP misconfigured:", err.message);
    return {
      ok: false,
      status: 500,
      body: { ok: false, error: VALIDATION_MESSAGES[locale].server },
    };
  }

  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;
  const to = process.env.MAIL_TO ?? process.env.SMTP_USER;
  const subject = process.env.MAIL_SUBJECT ?? "Neue Anfrage über die Website";

  const { text, html } = buildEmail({ clean, locale, topicLabel, ip, userAgent });

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: `${clean.name} <${clean.email}>`,
      subject: `${subject} — ${topicLabel} — ${clean.name}`,
      text,
      html,
      headers: {
        "X-Origin-Locale": locale,
      },
    });

    const sendClientCopy = process.env.CONTACT_SEND_CLIENT_COPY === "1";
    if (sendClientCopy) {
      const copy = buildClientCopyEmail(locale, clean.name);
      try {
        await transporter.sendMail({
          from,
          to: clean.email,
          replyTo: to,
          subject: copy.subject,
          text: copy.text,
          html: copy.html,
          headers: {
            "X-Mail-Type": "contact-form-client-copy",
          },
        });
      } catch (copyErr) {
        console.error("[contact] client confirmation email failed:", copyErr?.message ?? copyErr);
      }
    }
  } catch (err) {
    const detail = {
      code: err?.code,
      command: err?.command,
      responseCode: err?.responseCode,
      message: err?.message,
    };
    console.error("[contact] sendMail failed:", JSON.stringify(detail), {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from,
      to,
    });

    const debugEnabled = process.env.CONTACT_DEBUG === "1";
    return {
      ok: false,
      status: 502,
      body: debugEnabled
        ? {
            ok: false,
            error: VALIDATION_MESSAGES[locale].server,
            debug: detail,
          }
        : { ok: false, error: VALIDATION_MESSAGES[locale].server },
    };
  }

  return { ok: true, status: 200, body: { ok: true } };
}
