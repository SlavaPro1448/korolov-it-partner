import "dotenv/config";

import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

import { handleContact } from "./contactHandler.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const indexHtmlPath = path.join(distDir, "index.html");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.post("/api/contact.php", async (req, res) => {
  const meta = {
    ip: req.ip ?? "-",
    userAgent: String(req.headers["user-agent"] ?? "-"),
  };

  try {
    const { status, body } = await handleContact(req.body ?? {}, meta);
    res.status(status).json(body);
  } catch (err) {
    console.error("[contact-prod] unexpected:", err);
    res.status(500).json({ ok: false, error: "internal_error" });
  }
});

app.use(
  express.static(distDir, {
    index: false,
    maxAge: "1h",
    setHeaders: (res, filePath) => {
      if (/\.(js|css|woff2?|svg|png|jpe?g|webp|avif)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }),
);

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(indexHtmlPath, (err) => {
    if (err) next(err);
  });
});

const port = Number(process.env.PORT ?? 8080);
const host = process.env.HOST ?? "0.0.0.0";

app.listen(port, host, () => {
  console.log(`[server] listening on http://${host}:${port}`);
  console.log(`[server] static: ${distDir}`);
});
