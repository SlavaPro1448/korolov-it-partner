import "dotenv/config";
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? "465");
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.MAIL_FROM ?? user;
const to = process.env.MAIL_TO ?? user;

if (!host || !user || !pass) {
  console.error("Missing SMTP_HOST, SMTP_USER, or SMTP_PASS in .env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

const info = await transporter.sendMail({
  from,
  to,
  subject: `[Test] Korolov IT-Service — ${new Date().toISOString()}`,
  text: "Это тестовое письмо из scripts/send-test-mail.mjs.\nЕсли вы его видите, SMTP (IONOS) настроен верно.",
  html: "<p>Это <strong>тестовое письмо</strong> из <code>scripts/send-test-mail.mjs</code>.</p><p>Если вы его видите, SMTP (IONOS) настроен верно.</p>",
});

console.log("Sent:", info.messageId);
