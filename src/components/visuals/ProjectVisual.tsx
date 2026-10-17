// Stilisierte UI-Mockups für Projekte. Bewusst in Code gebaut (kein Screenshot):
// keine echten Kundendaten, scharf auf jedem Bildschirm, CSP-konform ohne externe Bilder.
import {
  ArrowRightLeft,
  BarChart3,
  Bot,
  CalendarCheck,
  Check,
  FileText,
  Gauge,
  Mail,
  Mic,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import type { ProjectVisualKind } from "@/data/projects";

export function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`phone-frame w-[250px] ${className}`} aria-hidden="true">
      <div className="phone-notch" />
      <div className="phone-screen h-[500px]">{children}</div>
    </div>
  );
}

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between px-6 pt-3 text-[10px] font-semibold ${
        dark ? "text-white/80" : "text-slate-700"
      }`}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-3 rounded-sm bg-current opacity-80" />
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      </span>
    </div>
  );
}

function Wave({ bars = 18, className = "" }: { bars?: number; className?: string }) {
  return (
    <div className={`flex h-8 items-center gap-[3px] ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="wave-bar w-[3px] rounded-full bg-current"
          style={{
            height: `${30 + ((i * 37) % 70)}%`,
            animationDelay: `${(i % 6) * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Screens ---------- */

export function CallScreen() {
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-gradient-to-b from-[#0b1220] via-[#131c3a] to-[#1d1b4b] text-white">
        <StatusBar dark />
        <div className="mt-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ai-gradient">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="mt-3 text-sm font-semibold">KI-Telefonassistent</div>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-white/60">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Anruf aktiv · 01:24
          </div>
          <Wave className="mx-auto mt-3 justify-center text-[#9db8ff]" />
        </div>
        <div className="mt-4 flex-1 space-y-2 px-4 text-[11px] leading-snug">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2">
            Guten Tag, hier spricht der KI-Assistent von Elektro Beispiel. Wie kann ich helfen?
          </div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#3b6cf6] px-3 py-2">
            Bei uns ist die Sicherung rausgeflogen, geht morgen früh ein Termin?
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2">
            Ich notiere einen Rückruf für morgen 8 Uhr. Ihre Nummer?
          </div>
        </div>
        <div className="m-3 rounded-2xl bg-white/[0.08] p-3 text-[10.5px]">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
            <Check className="h-3.5 w-3.5" /> Rückruf notiert
          </div>
          <div className="mt-1 text-white/70">Dringlichkeit: hoch · Zusammenfassung gesendet</div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function TranslateCallScreen() {
  const lines: Array<{ from: string; to: string; me: boolean }> = [
    {
      from: "Здравствуйте, я звоню по поводу письма.",
      to: "Guten Tag, ich rufe wegen des Briefes an.",
      me: true,
    },
    {
      from: "Haben Sie Ihr Aktenzeichen zur Hand?",
      to: "У вас есть номер дела под рукой?",
      me: false,
    },
    { from: "Да, 2026-4471.", to: "Ja, 2026-4471.", me: true },
  ];
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-[#f6f7fb]">
        <StatusBar />
        <div className="px-4 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-semibold text-slate-900">Bürgerbüro</div>
              <div className="text-[10px] text-slate-500">Anruf · 03:12</div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
              RU <ArrowRightLeft className="h-3 w-3" /> DE
            </div>
          </div>
        </div>
        <div className="mt-4 flex-1 space-y-2.5 px-3">
          {lines.map((l) => (
            <div
              key={l.from}
              className={`rounded-2xl border px-3 py-2 ${
                l.me ? "ml-6 border-blue-100 bg-white" : "mr-6 border-violet-100 bg-white"
              }`}
            >
              <div className="text-[11px] font-medium text-slate-900">{l.from}</div>
              <div className={`mt-1 text-[10.5px] ${l.me ? "text-blue-600" : "text-violet-600"}`}>
                → {l.to}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-1 px-2 text-slate-400">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-current" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-current [animation-delay:.2s]" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-current [animation-delay:.4s]" />
          </div>
        </div>
        <div className="m-3 flex items-center gap-2">
          <div className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10.5px] text-slate-400">
            Text eingeben…
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white">
            <Phone className="h-4 w-4 rotate-[135deg]" />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function SubtitlesScreen() {
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-[#0b1220] text-white">
        <StatusBar dark />
        <div className="flex items-center justify-between px-4 pt-5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="pulse-dot h-2 w-2 rounded-full bg-red-500" /> LIVE
          </div>
          <div className="flex rounded-full bg-white/10 p-0.5 text-[10px] font-semibold">
            <span className="rounded-full bg-white px-2.5 py-0.5 text-slate-900">DE</span>
            <span className="px-2.5 py-0.5 text-white/60">RU</span>
          </div>
        </div>
        <div className="mt-5 flex-1 space-y-3 px-4 text-[12.5px] leading-relaxed">
          <p className="text-white/35">Herzlich willkommen zum heutigen Abend.</p>
          <p className="text-white/55">Wir freuen uns, dass so viele Familien gekommen sind.</p>
          <p className="text-white/80">
            Im ersten Teil sprechen wir über die Pläne für das neue Jahr
          </p>
          <p className="font-semibold">
            und danach ist Zeit für Ihre Fragen
            <span className="typing-dot ml-0.5 inline-block">▍</span>
          </p>
        </div>
        <div className="m-3 rounded-2xl bg-white/[0.07] p-3">
          <div className="flex items-center justify-between text-[10.5px] text-white/70">
            <span className="flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5" /> Sprachausgabe an
            </span>
            <span>Verzögerung ~2 s</span>
          </div>
          <Wave bars={26} className="mt-1 text-[#8fd6f5]" />
        </div>
      </div>
    </PhoneFrame>
  );
}

export function BudgetScreen() {
  const cats = [
    { name: "Lebensmittel", value: 412, pct: 82, color: "bg-emerald-500" },
    { name: "Wohnen", value: 950, pct: 100, color: "bg-blue-500" },
    { name: "Mobilität", value: 168, pct: 34, color: "bg-amber-500" },
    { name: "Freizeit", value: 96, pct: 20, color: "bg-violet-500" },
  ];
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-[#f4f6f4]">
        <StatusBar />
        <div className="px-4 pt-5">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Oktober
          </div>
          <div className="mt-1 rounded-2xl bg-gradient-to-br from-[#14532d] to-[#166534] p-4 text-white">
            <div className="text-[10px] text-white/70">Verfügbar</div>
            <div className="text-2xl font-bold tracking-tight">1.284,50 €</div>
            <div className="mt-2 flex gap-3 text-[10px] text-white/80">
              <span>↑ 3.420 €</span>
              <span>↓ 2.135,50 €</span>
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-2 px-4">
          {cats.map((c) => (
            <div key={c.name} className="rounded-xl bg-white px-3 py-2">
              <div className="flex justify-between text-[10.5px]">
                <span className="font-medium text-slate-800">{c.name}</span>
                <span className="text-slate-500">{c.value} €</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-slate-100">
                <div className={`h-1.5 rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mx-3 mt-auto mb-3 rounded-2xl border border-emerald-100 bg-white p-3 text-[10.5px]">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" /> KI-Assistent
          </div>
          <div className="mt-1 text-slate-600">
            Für Lebensmittel haben Sie 9 % weniger ausgegeben als im September.
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function BotScreen() {
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-[#dfe7ef]">
        <StatusBar />
        <div className="flex items-center gap-2 border-b border-black/5 bg-white/80 px-4 pb-2 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2aabee] text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-slate-900">Anfrage-Bot</div>
            <div className="text-[9.5px] text-slate-500">Bot · online</div>
          </div>
        </div>
        <div className="flex-1 space-y-2 px-3 py-3 text-[11px] leading-snug">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-slate-800">
            Hallo! Wobei darf ich helfen?
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {["Neue Website", "Bestehende Seite", "IT-Support", "KI & Bots"].map((b, i) => (
              <div
                key={b}
                className={`rounded-lg px-2 py-1.5 text-center text-[10px] font-medium ${
                  i === 3 ? "bg-[#2aabee] text-white" : "bg-white/70 text-[#1b7fc4]"
                }`}
              >
                {b}
              </div>
            ))}
          </div>
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#e1ffc7] px-3 py-2 text-slate-800">
            Ein Bot für Terminanfragen in unserer Praxis
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-slate-800">
            Danke! Bevor ich Ihre Anfrage weiterleite: Sind Sie mit der Verarbeitung Ihrer Angaben
            einverstanden?
          </div>
          <div className="flex gap-1.5">
            <div className="flex-1 rounded-lg bg-[#2aabee] px-2 py-1.5 text-center text-[10px] font-medium text-white">
              Ja, einverstanden
            </div>
            <div className="flex-1 rounded-lg bg-white/70 px-2 py-1.5 text-center text-[10px] font-medium text-[#1b7fc4]">
              Datenschutz
            </div>
          </div>
        </div>
        <div className="m-3 rounded-full bg-white px-3 py-2 text-[10.5px] text-slate-400">
          Nachricht
        </div>
      </div>
    </PhoneFrame>
  );
}

export function ReportScreen() {
  const scores = [
    { label: "Ladezeit mobil", value: 54, tone: "text-amber-600", bar: "bg-amber-500" },
    { label: "SEO-Grundlagen", value: 71, tone: "text-blue-600", bar: "bg-blue-500" },
    { label: "Barrierearmut", value: 88, tone: "text-emerald-600", bar: "bg-emerald-500" },
  ];
  return (
    <div
      className="w-full max-w-[300px] rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_30px_60px_-24px_rgb(15_39_66/0.35)]"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-slate-900">Website-Check</div>
            <div className="text-[10px] text-slate-500">beispiel-handwerk.de</div>
          </div>
        </div>
        <div className="rounded-full bg-section px-2 py-0.5 text-[10px] font-medium text-slate-600">
          PDF · 9 Seiten
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        {scores.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-700">{s.label}</span>
              <span className={`font-semibold ${s.tone}`}>{s.value}/100</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-slate-100">
              <div className={`h-1.5 rounded-full ${s.bar}`} style={{ width: `${s.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-1.5 text-[10.5px]">
        <div className="flex items-start gap-1.5 text-slate-700">
          <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0 text-amber-500" />
          Google Fonts werden extern geladen
        </div>
        <div className="flex items-start gap-1.5 text-slate-700">
          <Mail className="mt-px h-3.5 w-3.5 shrink-0 text-amber-500" />
          Kein DMARC-Eintrag für die Domain
        </div>
        <div className="flex items-start gap-1.5 text-slate-700">
          <Gauge className="mt-px h-3.5 w-3.5 shrink-0 text-emerald-500" />
          SSL aktiv, Weiterleitung korrekt
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-section p-3 text-[10.5px] text-slate-700">
        <span className="font-semibold text-slate-900">Empfehlung Nr. 1:</span> Bilder komprimieren
        – spart ca. 2,1 s Ladezeit auf dem Smartphone.
      </div>
    </div>
  );
}

export function JarvisScreen() {
  return (
    <div
      className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] text-white shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]"
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ai-gradient">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="text-[12px] font-semibold">Jarvis</div>
        <div className="ml-auto flex gap-1 text-[9.5px] text-white/50">
          <span className="rounded bg-white/10 px-1.5 py-0.5">Telegram</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5">iPhone</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5">Mac</span>
        </div>
      </div>
      <div className="space-y-2.5 p-4 text-[11px] leading-snug">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#3b6cf6] px-3 py-2">
          Erstell die Rechnung für Kunde Beispiel GmbH für Oktober.
        </div>
        <div className="space-y-1.5 rounded-xl bg-white/[0.06] p-2.5 text-[10.5px]">
          {[
            { icon: CalendarCheck, text: "12 Termine im Kalender gefunden" },
            { icon: BarChart3, text: "18,5 Stunden aus der Zeiterfassung" },
            { icon: FileText, text: "Rechnungsentwurf als PDF erstellt" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-white/80">
              <Icon className="h-3.5 w-3.5 text-[#9db8ff]" />
              {text}
              <Check className="ml-auto h-3.5 w-3.5 text-emerald-400" />
            </div>
          ))}
        </div>
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2">
          Entwurf liegt bereit: 18,5 h · 1.017,50 €. Soll ich ihn per E-Mail senden?
        </div>
        <div className="flex gap-1.5">
          <div className="flex-1 rounded-lg bg-white px-2 py-1.5 text-center text-[10px] font-semibold text-slate-900">
            Prüfen & senden
          </div>
          <div className="flex-1 rounded-lg bg-white/10 px-2 py-1.5 text-center text-[10px] font-medium">
            Erst ansehen
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectVisual({ kind }: { kind: ProjectVisualKind }) {
  switch (kind) {
    case "jarvis":
      return <JarvisScreen />;
    case "call":
      return <CallScreen />;
    case "translate-call":
      return <TranslateCallScreen />;
    case "subtitles":
      return <SubtitlesScreen />;
    case "budget":
      return <BudgetScreen />;
    case "bot":
      return <BotScreen />;
    case "report":
      return <ReportScreen />;
  }
}
