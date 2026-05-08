import "dotenv/config";
import { handleContact } from "./contactHandler.mjs";

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
      if (Buffer.concat(chunks).length > 64 * 1024) {
        reject(new Error("payload_too_large"));
      }
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        if (!raw) return resolve({});
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("invalid_json"));
      }
    });
    req.on("error", reject);
  });
}

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? "-";
}

export function viteContactApiPlugin() {
  return {
    name: "korolov-contact-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        if (req.method !== "POST") {
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.setHeader("Allow", "POST");
            return res.end();
          }
          return next();
        }

        let body;
        try {
          body = await readJsonBody(req);
        } catch (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          return res.end(
            JSON.stringify({ ok: false, error: err.message ?? "bad_request" }),
          );
        }

        const meta = {
          ip: getClientIp(req),
          userAgent: String(req.headers["user-agent"] ?? "-"),
        };

        try {
          const { status, body: respBody } = await handleContact(body, meta);
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(respBody));
        } catch (err) {
          console.error("[contact-dev] unexpected:", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ ok: false, error: "internal_error" }));
        }
      });
    },
  };
}
