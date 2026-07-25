/**
 * Post-Build-Prerender: rendert alle Routen mit headless Chrome und legt
 * statische HTML-Snapshots in dist/ ab (z. B. dist/ru.html für /ru).
 *
 * Warum: Die Seite ist eine Client-SPA. Ohne Prerender sehen Crawler ohne
 * JavaScript (Bing, WhatsApp, LinkedIn, KI-Bots) nur die leere HTML-Hülle.
 * Die .htaccess liefert <pfad>.html aus, bevor der SPA-Fallback greift.
 *
 * Läuft lokal (macOS-Chrome) und im CI (ubuntu-latest hat Chrome vorinstalliert).
 */
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const PORT = 4173;

// Redirect-Routen (/ua) absichtlich nicht enthalten.
const ROUTES = [
  "/",
  "/ru",
  "/uk",
  "/impressum",
  "/datenschutz",
  "/widerruf",
  "/webdesign-leverkusen",
  "/it-support-leverkusen",
  "/website-wartung-leverkusen",
  "/it-service-leverkusen",
  "/it-betreuung-kleine-unternehmen",
  "/it-beratung-leverkusen",
  "/wartungsvertrag-it",
  "/referenzen",
];

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  try {
    return execSync("which google-chrome || which chromium-browser || which chromium", {
      encoding: "utf8",
    })
      .split("\n")[0]
      .trim();
  } catch {
    return null;
  }
}

const server = createServer((req, res) => {
  let filePath = path.join(DIST, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, "index.html");
  }
  res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
  res.end(readFileSync(filePath));
});

// Chrome-Auflösung: lokal/CI mit System-Chrome (findChrome), auf Vercel mit
// gebündeltem @sparticuz/chromium (der Build-Container hat kein System-Chrome).
let executablePath;
let launchArgs = ["--no-sandbox", "--disable-gpu"];

if (process.env.VERCEL || process.env.PRERENDER_USE_CHROMIUM) {
  const { default: chromium } = await import("@sparticuz/chromium");
  executablePath = await chromium.executablePath();
  launchArgs = chromium.args;
} else {
  executablePath = findChrome();
  if (!executablePath) {
    console.error(
      "[prerender] Kein Chrome/Chromium gefunden — Prerender übersprungen (Build bleibt gültig).",
    );
    process.exit(1);
  }
}

await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await puppeteer.launch({
  executablePath,
  headless: "new",
  args: launchArgs,
});

try {
  const page = await browser.newPage();
  for (const route of ROUTES) {
    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    // HeadContent/JSON-LD anwenden lassen
    await new Promise((r) => setTimeout(r, 800));

    const html = await page.evaluate(() => {
      // Router-verwaltete Head-Tags markieren: die SPA entfernt beim Boot alle
      // [data-static-head]-Tags und setzt eigene — so entstehen keine Dubletten.
      document.head
        .querySelectorAll(
          'meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], link[rel="alternate"]',
        )
        .forEach((el) => el.setAttribute("data-static-head", ""));

      // Doppelte <title>-Elemente entfernen (statischer + HeadContent-Rest);
      // das erste trägt den korrekten, per document.title gesetzten Text.
      document.head.querySelectorAll("title").forEach((el, i) => {
        if (i > 0) el.remove();
      });

      // Reveal-Animationen neutralisieren, damit Inhalte ohne JS sichtbar sind.
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.remove("reveal", "reveal-up", "reveal-visible");
      });

      return "<!doctype html>" + document.documentElement.outerHTML;
    });

    const outFile =
      route === "/" ? path.join(DIST, "index.html") : path.join(DIST, `${route.slice(1)}.html`);
    writeFileSync(outFile, html);
    console.log(
      `[prerender] ${route} -> ${path.relative(DIST, outFile)} (${(html.length / 1024).toFixed(0)} KB)`,
    );
  }
} finally {
  await browser.close();
  server.close();
}

console.log(`[prerender] fertig: ${ROUTES.length} Routen.`);
