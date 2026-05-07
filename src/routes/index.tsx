import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Wrench,
  Mail,
  LifeBuoy,
  FileText,
  ShieldCheck,
  UserCheck,
  HardHat,
  Building2,
  Scale,
  Users,
  Languages,
  Phone,
  MapPin,
  MessageSquare,
  Sparkles,
  Check,
  Star,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Korolov IT-Service | Websites & IT-Support in Leverkusen" },
      {
        name: "description",
        content:
          "Korolov IT-Service unterstützt kleine Unternehmen in Leverkusen, Köln und NRW bei Websites, E-Mail, Hosting, IT-Support und digitaler Organisation.",
      },
      { property: "og:title", content: "Korolov IT-Service | Websites & IT-Support in Leverkusen" },
      {
        property: "og:description",
        content:
          "Moderne Websites, zuverlässige IT und verständliche Betreuung für kleine Unternehmen in Leverkusen, Köln und NRW.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Services />
        <ForWhom />
        <Pricing />
        <Process />
        <References />
        <About />
        <FAQ />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="hero-grid-bg relative overflow-hidden">
      <div className="container-page py-20 md:py-28 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent-blue" />
            IT-Partner für kleine Unternehmen in NRW
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-brand leading-[1.05]">
            Moderne Websites.<br />
            Zuverlässige IT.<br />
            <span className="text-accent-blue">Verständliche Betreuung.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Ich unterstütze kleine Unternehmen in Leverkusen, Köln und NRW bei Websites,
            geschäftlicher E-Mail, Hosting, IT-Support und digitaler Organisation —
            persönlich, verständlich und zuverlässig.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full sm:w-auto whitespace-normal h-auto py-3 text-center leading-snug"
            >
              <a href="#kontakt">
                Kostenloses Erstgespräch anfragen <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto whitespace-normal h-auto py-3 text-center leading-snug"
            >
              <a href="#leistungen">Leistungen ansehen</a>
            </Button>
          </div>
          <ul className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl">
            {[
              "Direkter Ansprechpartner",
              "Website & IT aus einer Hand",
              "Beratung auf DE, RU & UA",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="h-5 w-5 text-accent-teal shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 fade-in-up">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-tr from-accent-blue/10 to-transparent rounded-3xl blur-2xl" />
      <div className="relative card-soft p-6 md:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="text-xs text-muted-foreground">korolov-it-service.de</div>
        </div>
        <div className="mt-5 space-y-3">
          <MiniRow icon={<Globe className="h-4 w-4" />} label="Website online" value="aktiv · SSL" tone="teal" />
          <MiniRow icon={<Mail className="h-4 w-4" />} label="Geschäftliche E-Mail" value="info@…de" tone="blue" />
          <MiniRow icon={<ShieldCheck className="h-4 w-4" />} label="Backups & Updates" value="aktuell" tone="teal" />
          <MiniRow icon={<LifeBuoy className="h-4 w-4" />} label="Technischer Support" value="erreichbar" tone="blue" />
        </div>
        <div className="mt-6 p-4 rounded-xl bg-section">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Languages className="h-3.5 w-3.5" /> Beratung
          </div>
          <div className="mt-1 text-sm text-foreground">
            Auf <span className="font-medium">Deutsch</span>, <span className="font-medium">Russisch</span> und{" "}
            <span className="font-medium">Ukrainisch</span> möglich.
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "blue" | "teal";
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5">
      <div className="flex items-center gap-2.5 text-sm text-foreground/80">
        <span className={tone === "blue" ? "text-accent-blue" : "text-accent-teal"}>{icon}</span>
        {label}
      </div>
      <span className="text-xs font-medium text-foreground/70">{value}</span>
    </div>
  );
}

/* ---------------- PROBLEM ---------------- */
function Problem() {
  const items = [
    {
      title: "Verständlich erklärt",
      text: "Keine Fachsprache ohne Erklärung. Sie wissen jederzeit, was umgesetzt wird und warum.",
    },
    {
      title: "Sauber umgesetzt",
      text: "Strukturierte Arbeit mit Fokus auf Zuverlässigkeit, Sicherheit und Nachvollziehbarkeit.",
    },
    {
      title: "Auch nach dem Projekt erreichbar",
      text: "Auf Wunsch laufende technische Betreuung — als fester Ansprechpartner für Ihre Technik.",
    },
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="container-page max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-brand leading-tight">
          Viele kleine Unternehmen brauchen keine große Agentur — sondern{" "}
          <span className="text-accent-blue">zuverlässige technische Unterstützung</span>.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-3xl">
          Website veraltet, E-Mail-Probleme, Kontaktformulare funktionieren nicht, Updates bleiben liegen
          oder niemand fühlt sich für die Technik verantwortlich. Genau hier unterstütze ich:
          praktisch, verständlich und mit Blick auf den Alltag Ihres Unternehmens.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.title} className="card-soft p-6">
              <div className="h-10 w-10 rounded-lg bg-section flex items-center justify-center text-accent-blue">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-brand">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SERVICES ---------------- */
const services = [
  {
    icon: Globe,
    title: "Website-Erstellung",
    text:
      "Moderne, schnelle und mobil optimierte Websites für Unternehmen, Selbstständige und Dienstleister. Klar strukturiert, seriös gestaltet und auf Ihre Leistungen abgestimmt.",
    tags: ["Responsive Design", "SEO-Basis", "Kontaktformular", "SSL"],
  },
  {
    icon: Wrench,
    title: "Website-Pflege & Wartung",
    text:
      "Auch nach dem Launch bleibe ich Ihr technischer Ansprechpartner. Ich unterstütze bei Updates, Backups, kleinen Änderungen, Formularprüfung und technischen Problemen.",
    tags: ["Updates", "Backups", "technische Prüfung"],
  },
  {
    icon: Mail,
    title: "E-Mail, Domain & Hosting",
    text:
      "Einrichtung von geschäftlichen E-Mail-Adressen, Domain, Hosting, DNS, SPF, DKIM, DMARC und Formularversand — damit Ihre digitale Kommunikation zuverlässig funktioniert.",
    tags: ["Domain", "Business E-Mail", "DNS", "SMTP"],
  },
  {
    icon: LifeBuoy,
    title: "IT-Support für kleine Unternehmen",
    text:
      "Hilfe bei Computern, Netzwerk, Druckern, Cloud, Datensicherung und alltäglichen technischen Fragen — verständlich, praktisch und lösungsorientiert.",
    tags: ["Remote", "vor Ort", "Netzwerk", "Cloud"],
  },
  {
    icon: FileText,
    title: "Digitale Dokumente & Ordnung",
    text:
      "Struktur für Rechnungen, Angebote, PDF-Vorlagen, QR-Codes und digitale Ablage — damit Ihre Unterlagen übersichtlich und professionell bleiben.",
    tags: ["Rechnungen", "Angebote", "PDF", "QR-Codes"],
  },
  {
    icon: ShieldCheck,
    title: "Technische DSGVO-orientierte Umsetzung",
    text:
      "Technische Einbindung von SSL, Cookie-Banner, Kontaktformularen, Impressum- und Datenschutzseiten. Rechtliche Inhalte können über spezialisierte Generatoren oder juristische Beratung ergänzt und geprüft werden.",
    tags: ["SSL", "Cookie-Banner", "Datenschutz", "Impressum"],
  },
];

function Services() {
  return (
    <section id="leistungen" className="py-20 md:py-28 bg-section scroll-mt-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Leistungen"
          title="Digitale Lösungen für den Geschäftsalltag"
          subtitle="Von der Website bis zur laufenden technischen Betreuung — digitale Lösungen für den Geschäftsalltag kleiner Unternehmen."
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <article key={s.title} className="card-soft p-6 flex flex-col">
              <div className="h-11 w-11 rounded-xl bg-brand/5 text-accent-blue flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-brand text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{s.text}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-section text-foreground/70 border border-border"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOR WHOM ---------------- */
const audiences = [
  {
    icon: UserCheck,
    title: "Selbstständige & Gründer",
    text: "Sie benötigen einen seriösen ersten Webauftritt und eine zuverlässige technische Grundlage für den Start.",
  },
  {
    icon: HardHat,
    title: "Handwerker & lokale Dienstleister",
    text: "Klare Website mit Leistungen, Kontaktmöglichkeit und lokalem Bezug — übersichtlich für Ihre Kundschaft.",
  },
  {
    icon: Building2,
    title: "Hausverwaltungen & Immobilienservice",
    text: "Strukturierte Darstellung Ihrer Leistungen sowie technische Betreuung für den professionellen Alltag.",
  },
  {
    icon: Scale,
    title: "Kanzleien, Büros & Beratungsstellen",
    text: "Seriöser Auftritt, sichere E-Mail und verlässlicher technischer Ansprechpartner für sensible Bereiche.",
  },
  {
    icon: Users,
    title: "Kleine Unternehmen ohne eigene IT",
    text: "Ein fester Ansprechpartner für Website, E-Mail, Hosting und alltägliche technische Fragen.",
  },
  {
    icon: Languages,
    title: "Mehrsprachige Unternehmer in Deutschland",
    text: "Beratung und Umsetzung auf Deutsch, Russisch und Ukrainisch — verständlich und ohne Sprachbarriere.",
  },
];

function ForWhom() {
  return (
    <section id="fuer-wen" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Für wen"
          title="Für wen ist Korolov IT-Service geeignet?"
          subtitle="Wer typischerweise mit mir zusammenarbeitet."
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {audiences.map((a) => (
            <div key={a.title} className="card-soft p-6">
              <div className="h-10 w-10 rounded-lg bg-section text-accent-teal flex items-center justify-center">
                <a.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-brand">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRICING ---------------- */
const packages = [
  {
    name: "Start Website",
    price: "ab 890 €",
    suffix: "netto",
    desc: "Für Selbstständige und kleine Betriebe, die einen professionellen Einstieg benötigen.",
    features: [
      "1–3 Seiten",
      "Responsives Design",
      "Kontaktformular",
      "SSL & Domain-Anbindung",
      "Impressum- und Datenschutzseiten technisch eingebunden",
      "Basis-SEO",
    ],
    recommended: false,
  },
  {
    name: "Business Website",
    price: "ab 1.500 €",
    suffix: "netto",
    desc: "Für Unternehmen mit mehreren Leistungen, klarer Struktur und professionellem Außenauftritt.",
    features: [
      "4–7 Seiten",
      "Individuelle Seitenstruktur",
      "Leistungsseiten",
      "Kontaktformular & E-Mail-Anbindung",
      "Google Maps Link",
      "SEO-Grundstruktur",
      "Hilfe bei Texten nach Absprache",
    ],
    recommended: true,
  },
  {
    name: "Digital Setup",
    price: "ab 390 €",
    suffix: "netto",
    desc: "Für Unternehmen, die Domain, E-Mail und technische Grundlagen sauber eingerichtet haben möchten.",
    features: [
      "Domain & Hosting einrichten",
      "Geschäftliche E-Mail-Adresse",
      "SPF, DKIM, DMARC",
      "E-Mail-Signatur",
      "Formularversand",
      "Google Business Profile Grundsetup",
    ],
    recommended: false,
  },
  {
    name: "Monatliche Betreuung",
    price: "ab 79 €",
    suffix: "/ Monat",
    desc: "Laufende technische Unterstützung nach dem Start.",
    features: [
      "Updates & Backups",
      "Regelmäßige technische Prüfung",
      "Kleine Änderungen nach Absprache",
      "Formularprüfung",
      "Technischer Ansprechpartner",
    ],
    note: "Umfang und Reaktionszeiten werden individuell vereinbart.",
    recommended: false,
  },
];

function Pricing() {
  return (
    <section id="preise" className="py-20 md:py-28 bg-section scroll-mt-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Pakete & Preise"
          title="Transparente Einstiegspakete"
          subtitle="Jedes Projekt wird nach dem kostenlosen Erstgespräch konkret angeboten."
        />
        <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`relative card-soft p-6 flex flex-col ${
                p.recommended ? "ring-2 ring-accent-blue border-accent-blue" : ""
              }`}
            >
              {p.recommended && (
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-accent-blue text-white text-xs font-medium px-2.5 py-1">
                  <Star className="h-3 w-3" /> Empfohlen
                </div>
              )}
              <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <div className="text-3xl font-bold text-brand">{p.price}</div>
                <div className="text-sm text-muted-foreground">{p.suffix}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check className="h-4 w-4 text-accent-teal shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {p.note && (
                <p className="mt-4 text-xs text-muted-foreground italic">{p.note}</p>
              )}
              <Button asChild variant={p.recommended ? "brand" : "outline"} className="mt-6">
                <a href="#kontakt">Anfragen</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROCESS ---------------- */
const steps = [
  {
    title: "Kostenloses Erstgespräch",
    text: "Wir besprechen Ihr Unternehmen, Ihre aktuelle Situation und Ihr Ziel.",
  },
  {
    title: "Kurze Analyse & Empfehlung",
    text: "Ich prüfe, welche Lösung sinnvoll ist — Website, E-Mail, Hosting, Support oder Kombination.",
  },
  {
    title: "Transparentes Angebot",
    text: "Sie erhalten ein klares Angebot mit Leistungsumfang, Preis und nächstem Schritt.",
  },
  {
    title: "Umsetzung",
    text: "Ich setze die vereinbarten Leistungen strukturiert und nachvollziehbar um.",
  },
  {
    title: "Übergabe & Betreuung",
    text: "Nach dem Start erhalten Sie eine kurze Einweisung. Auf Wunsch übernehme ich die laufende Betreuung.",
  },
];

function Process() {
  return (
    <section id="ablauf" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Ablauf"
          title="So läuft die Zusammenarbeit ab"
          subtitle="Klar, strukturiert und ohne Überraschungen."
        />
        <ol className="mt-12 grid gap-5 lg:grid-cols-5 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title} className="card-soft p-6 relative">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Schritt {i + 1}</div>
              <div className="mt-2 h-9 w-9 rounded-lg bg-brand text-brand-foreground flex items-center justify-center font-semibold">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold text-brand">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- REFERENCES ---------------- */
function References() {
  const refs = [
    {
      title: "Hausverwaltung Natalie Frank",
      type: "Website & technische Betreuung",
      text:
        "Professioneller Webauftritt für eine Immobilienverwaltung mit klarer Struktur, Kontaktmöglichkeit und technischer Einrichtung.",
      cta: "Projekt ansehen",
      href: "#",
    },
    {
      title: "IT-Unterstützung für Kanzlei / Büro",
      type: "IT-Support & Wartung",
      text:
        "Technische Unterstützung für eine Kanzlei bzw. ein Büro im Geschäftsalltag — mit Fokus auf Zuverlässigkeit, Datenschutzbewusstsein und praktische Lösungen.",
      cta: "Mehr erfahren",
      href: "#",
    },
  ];
  return (
    <section id="referenzen" className="py-20 md:py-28 bg-section scroll-mt-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Referenzen"
          title="Ausgewählte Projekte"
          subtitle="Beispiele aus der bisherigen Zusammenarbeit."
        />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {refs.map((r) => (
            <article key={r.title} className="card-soft p-7 flex flex-col">
              <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-brand/90 to-accent-blue/80 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 30%, white 1px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1px, transparent 1.5px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="absolute bottom-4 left-5 text-white">
                  <div className="text-xs uppercase tracking-wider opacity-80">{r.type}</div>
                  <div className="text-lg font-semibold">{r.title}</div>
                </div>
              </div>
              <p className="mt-5 text-sm text-muted-foreground leading-relaxed flex-1">{r.text}</p>
              <Button asChild variant="outline" className="mt-5 self-start">
                <a href={r.href}>
                  {r.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ABOUT ---------------- */
function About() {
  const trust = [
    "Persönliche Betreuung",
    "Verständliche Kommunikation",
    "Praktische Lösungen für den Geschäftsalltag",
    "Beratung auf Deutsch, Russisch und Ukrainisch möglich",
  ];
  return (
    <section id="ueber-mich" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">Über mich</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">
            Über Korolov IT-Service
          </h2>
          <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
            <p>
              Mein Name ist <span className="font-medium text-brand">Viacheslav Korolov</span>.
              Mit Korolov IT-Service unterstütze ich kleine Unternehmen, Selbstständige und lokale
              Dienstleister in Leverkusen, Köln und NRW bei Websites, geschäftlicher E-Mail,
              IT-Fragen und digitaler Organisation.
            </p>
            <p>
              Mein Ziel ist es, technische Themen verständlich und praktisch zu lösen. Viele
              Unternehmen brauchen keine große Agentur, sondern einen zuverlässigen Ansprechpartner,
              der erklärt, umsetzt und auch nach dem Projekt erreichbar bleibt.
            </p>
          </div>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {trust.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground/85">
                <CheckCircle2 className="h-5 w-5 text-accent-teal shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <div className="card-soft p-7 bg-gradient-to-br from-white to-section">
            <div className="h-20 w-20 rounded-2xl bg-brand text-brand-foreground flex items-center justify-center text-3xl font-bold">
              VK
            </div>
            <div className="mt-5">
              <div className="font-semibold text-brand text-lg">Viacheslav Korolov</div>
              <div className="text-sm text-muted-foreground">Inhaber · Korolov IT-Service</div>
            </div>
            <div className="mt-6 space-y-2.5 text-sm text-foreground/80">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent-blue" /> Leverkusen, NRW</div>
              <div className="flex items-center gap-2"><Languages className="h-4 w-4 text-accent-blue" /> Deutsch · Русский · Українська</div>
              <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-accent-blue" /> Direkter Ansprechpartner</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const faqs = [
  {
    q: "Wie lange dauert die Erstellung einer Website?",
    a: "Eine einfache Website dauert je nach Inhalt und Abstimmung meist einige Tage bis wenige Wochen. Der genaue Zeitrahmen wird vor Projektstart besprochen.",
  },
  {
    q: "Kann ich später Änderungen an meiner Website machen lassen?",
    a: "Ja. Kleine Änderungen und laufende technische Betreuung können monatlich vereinbart werden.",
  },
  {
    q: "Übernehmen Sie auch Domain und E-Mail?",
    a: "Ja. Ich unterstütze bei Domain, Hosting, geschäftlicher E-Mail, DNS, SPF, DKIM, DMARC und Formularversand.",
  },
  {
    q: "Ist die Website DSGVO-konform?",
    a: "Ich unterstütze bei der technischen DSGVO-orientierten Umsetzung. Rechtliche Inhalte wie Datenschutztexte sollten über spezialisierte Generatoren oder juristische Beratung geprüft werden.",
  },
  {
    q: "Arbeiten Sie auch vor Ort?",
    a: "Je nach Projekt ist Unterstützung remote oder im Raum Leverkusen, Köln und Umgebung möglich.",
  },
  {
    q: "Kann die Beratung auf Russisch oder Ukrainisch stattfinden?",
    a: "Ja, Beratung ist auf Deutsch, Russisch und Ukrainisch möglich.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 md:py-28 bg-section">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Häufige Fragen" subtitle="Antworten auf die häufigsten Fragen vor dem Erstgespräch." />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="card-soft overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left p-5 gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-brand">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function Contact() {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [topic, setTopic] = useState("");

  const topicLabelMap: Record<string, string> = {
    website: "Website erstellen",
    wartung: "Website-Betreuung",
    "email-domain": "E-Mail, Domain & Hosting",
    "it-support": "IT-Support",
    "digital-setup": "Digital Setup",
    sonstiges: "Sonstiges",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitted(false);

    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const topicLabel = topic ? topicLabelMap[topic] ?? topic : "Nicht angegeben";

    const payload = new FormData();
    payload.append("_subject", `Neue Anfrage von ${name || "Website-Formular"}`);
    payload.append("_captcha", "false");
    payload.append("Name", name || "-");
    payload.append("Unternehmen", company || "-");
    payload.append("E-Mail", email || "-");
    payload.append("Telefon", phone || "-");
    payload.append("Anliegen", topicLabel);
    payload.append("Nachricht", message || "-");

    try {
      setSubmitting(true);
      const response = await fetch("https://formsubmit.co/ajax/korolovslava04@gmail.com", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      setSubmitted(true);
      form.reset();
      setTopic("");
      setAgreed(false);
    } catch {
      setErrorMessage(
        "Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie direkt an korolovslava04@gmail.com.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="py-20 md:py-28 scroll-mt-20">
      <div className="container-page grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">Kontakt</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">
            Kostenloses Erstgespräch anfragen
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Schreiben Sie kurz, wobei Sie Unterstützung benötigen. Ich melde mich mit einer ersten
            Einschätzung zurück.
          </p>
          <div className="mt-8 space-y-4">
            <ContactRow icon={<Mail className="h-5 w-5" />} label="E-Mail" value="info@korolov-it-service.de" />
            <ContactRow icon={<Phone className="h-5 w-5" />} label="Telefon / WhatsApp" value="+49 …" />
            <ContactRow icon={<MapPin className="h-5 w-5" />} label="Standort" value="Leverkusen, NRW" />
            <ContactRow icon={<Languages className="h-5 w-5" />} label="Sprachen" value="Deutsch · Russisch · Ukrainisch" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="card-soft p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" required>
                <Input required name="name" placeholder="Ihr Name" />
              </Field>
              <Field label="Unternehmen">
                <Input name="company" placeholder="Firmenname (optional)" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="E-Mail" required>
                <Input required type="email" name="email" placeholder="ihre@email.de" />
              </Field>
              <Field label="Telefon">
                <Input name="phone" placeholder="optional" />
              </Field>
            </div>
            <Field label="Anliegen" required>
              <Select value={topic} onValueChange={setTopic} required>
                <SelectTrigger>
                  <SelectValue placeholder="Bitte wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website erstellen</SelectItem>
                  <SelectItem value="wartung">Website-Betreuung</SelectItem>
                  <SelectItem value="email-domain">E-Mail, Domain & Hosting</SelectItem>
                  <SelectItem value="it-support">IT-Support</SelectItem>
                  <SelectItem value="digital-setup">Digital Setup</SelectItem>
                  <SelectItem value="sonstiges">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="topic" value={topic} />
            </Field>
            <Field label="Nachricht" required>
              <Textarea
                required
                name="message"
                rows={5}
                placeholder="Beschreiben Sie kurz Ihr Anliegen…"
              />
            </Field>

            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <Checkbox
                id="dsgvo"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(Boolean(v))}
                required
              />
              <span>
                Ich habe die{" "}
                <a href="/datenschutz" className="text-accent-blue underline">Datenschutzerklärung</a>{" "}
                gelesen und stimme zu, dass meine Angaben zur Kontaktaufnahme verarbeitet werden.
              </span>
            </label>

            <Button
              type="submit"
              variant="brand"
              size="lg"
              disabled={!agreed || submitting}
              className="w-full sm:w-auto"
            >
              Anfrage senden <ArrowRight className="h-4 w-4" />
            </Button>

            {submitted && (
              <div className="rounded-lg border border-border bg-section p-4 text-sm text-foreground/85">
                Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.
              </div>
            )}

            {errorMessage && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground/85">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-section text-accent-blue flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-foreground/80">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">{eyebrow}</div>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
