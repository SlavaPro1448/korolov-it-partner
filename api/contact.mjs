import { handleContact } from "../server/contactHandler.mjs";

export const config = {
  runtime: "nodejs",
};

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? "-";
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return await new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > 64 * 1024) {
        reject(new Error("payload_too_large"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve(null);
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message ?? "bad_request" });
    return;
  }
  if (body === null) {
    res.status(400).json({ ok: false, error: "invalid_json" });
    return;
  }

  const meta = {
    ip: getClientIp(req),
    userAgent: String(req.headers["user-agent"] ?? "-"),
  };

  try {
    const { status, body: respBody } = await handleContact(body, meta);
    res.status(status).json(respBody);
  } catch (err) {
    console.error("[contact-vercel] unexpected:", err);
    res.status(500).json({ ok: false, error: "internal_error" });
  }
}
