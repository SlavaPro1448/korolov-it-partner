import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";
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
  Loader2,
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
import { COMPANY } from "@/config/legal";
import { ReferencesSection } from "@/components/sections/ReferencesSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, localBusinessSchema, organizationSchema, webSiteSchema } from "@/lib/structured-data";
import { buildHreflangLinks, buildSeoMeta } from "@/lib/seo";
import { About } from "@/components/home/About";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Korolov IT-Service | Websites & IT-Support in Leverkusen",
      description:
        "Korolov IT-Service unterstützt kleine Unternehmen in Leverkusen, Köln und NRW bei Websites, E-Mail, Hosting, IT-Support und digitaler Organisation.",
      path: "/",
      locale: "de",
      keywords: "IT-Service Leverkusen, Website erstellen, IT-Support NRW, E-Mail Hosting, digitale Organisation",
    }),
    links: buildHreflangLinks("/"),
  }),
  component: HomePage,
});

function HomePage() {
  const faqItems = faqs.map((item) => ({ question: item.q, answer: item.a }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={localBusinessSchema("de")} />
      <JsonLd data={organizationSchema("de")} />
      <JsonLd data={webSiteSchema("de")} />
      <JsonLd data={faqPageSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([{ name: "Startseite", item: "https://korolov-it-service.de/" }])}
      />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        <Problem />
        <Services />
        <ForWhom />
        <Pricing />
        <Process />
        <References />
        <About locale="de" />
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
    <section className="hero-grid-bg relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="container-page py-20 md:py-28 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
            IT-Partner für kleine Unternehmen in NRW
          </div>
          <h1
            id="hero-heading"
            className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-brand leading-[1.05]"
          >
            Mehr Kundenanfragen mit Website und IT-Support aus Leverkusen
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Ich unterstütze kleine Unternehmen in Leverkusen mit Website, E-Mail, Hosting und
            IT-Support - persönlich und zuverlässig.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base bg-accent-blue hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/30"
            >
              <a href="#kontakt">
                Kostenloses Erstgespräch anfragen{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="default" className="w-full sm:w-auto">
              <a href="#leistungen">Leistungen ansehen</a>
            </Button>
          </div>
          <ul className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl">
            {["Persönlicher Ansprechpartner", "Website + IT", "DE · RU · UA"].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2
                  className="h-5 w-5 text-accent-teal shrink-0 mt-0.5"
                  aria-hidden="true"
                />
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
    <div className="relative" aria-hidden="true">
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
          <MiniRow
            icon={<Globe className="h-4 w-4" />}
            label="Website online"
            value="aktiv · SSL"
            tone="teal"
          />
          <MiniRow
            icon={<Mail className="h-4 w-4" />}
            label="Geschäftliche E-Mail"
            value="info@…de"
            tone="blue"
          />
          <MiniRow
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Backups & Updates"
            value="aktuell"
            tone="teal"
          />
          <MiniRow
            icon={<LifeBuoy className="h-4 w-4" />}
            label="Technischer Support"
            value="erreichbar"
            tone="blue"
          />
        </div>
        <div className="mt-6 p-4 rounded-xl bg-section">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Languages className="h-3.5 w-3.5" /> Beratung
          </div>
          <div className="mt-1 text-sm text-foreground">
            Auf <span className="font-medium">Deutsch</span>,{" "}
            <span className="font-medium">Russisch</span> und{" "}
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
    <section className="py-20 md:py-28" aria-labelledby="problem-heading">
      <div className="container-page max-w-5xl">
        <h2
          id="problem-heading"
          className="text-3xl md:text-4xl font-bold text-brand leading-tight"
        >
          Viele kleine Unternehmen brauchen keine große Agentur — sondern{" "}
          <span className="text-accent-blue">zuverlässige technische Unterstützung</span>.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-3xl">
          Website veraltet, E-Mail-Probleme, Kontaktformulare funktionieren nicht, Updates bleiben
          liegen oder niemand fühlt sich für die Technik verantwortlich. Genau hier unterstütze ich:
          praktisch, verständlich und mit Blick auf den Alltag Ihres Unternehmens.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.title} className="card-soft p-6">
              <div
                className="h-10 w-10 rounded-lg bg-section flex items-center justify-center text-accent-blue"
                aria-hidden="true"
              >
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
    text: "Moderne, schnelle und mobil optimierte Websites für Unternehmen, Selbstständige und Dienstleister. Klar strukturiert, seriös gestaltet und auf Ihre Leistungen abgestimmt.",
    tags: ["Responsive Design", "SEO-Basis", "Kontaktformular", "SSL"],
  },
  {
    icon: Wrench,
    title: "Website-Pflege & Wartung",
    text: "Auch nach dem Launch bleibe ich Ihr technischer Ansprechpartner. Ich unterstütze bei Updates, Backups, kleinen Änderungen, Formularprüfung und technischen Problemen.",
    tags: ["Updates", "Backups", "technische Prüfung"],
  },
  {
    icon: Mail,
    title: "E-Mail, Domain & Hosting",
    text: "Einrichtung von geschäftlichen E-Mail-Adressen, Domain, Hosting, DNS, SPF, DKIM, DMARC und Formularversand — damit Ihre digitale Kommunikation zuverlässig funktioniert.",
    tags: ["Domain", "Business E-Mail", "DNS", "SMTP"],
  },
  {
    icon: LifeBuoy,
    title: "IT-Support für kleine Unternehmen",
    text: "Hilfe bei Computern, Netzwerk, Druckern, Cloud, Datensicherung und alltäglichen technischen Fragen — verständlich, praktisch und lösungsorientiert.",
    tags: ["Remote", "vor Ort", "Netzwerk", "Cloud"],
  },
  {
    icon: FileText,
    title: "Digitale Dokumente & Ordnung",
    text: "Struktur für Rechnungen, Angebote, PDF-Vorlagen, QR-Codes und digitale Ablage — damit Ihre Unterlagen übersichtlich und professionell bleiben.",
    tags: ["Rechnungen", "Angebote", "PDF", "QR-Codes"],
  },
  {
    icon: ShieldCheck,
    title: "Technische DSGVO-orientierte Umsetzung",
    text: "Technische Einbindung von SSL, Cookie-Banner, Kontaktformularen, Impressum- und Datenschutzseiten. Rechtliche Inhalte können über spezialisierte Generatoren oder juristische Beratung ergänzt und geprüft werden.",
    tags: ["SSL", "Cookie-Banner", "Datenschutz", "Impressum"],
  },
];

function Services() {
  return (
    <section
      id="leistungen"
      className="py-20 md:py-28 bg-section scroll-mt-20"
      aria-labelledby="services-heading"
    >
      <div className="container-page">
        <SectionHeading
          headingId="services-heading"
          eyebrow="Leistungen"
          title="Digitale Lösungen für den Geschäftsalltag"
          subtitle="Von der Website bis zur laufenden technischen Betreuung — digitale Lösungen für den Geschäftsalltag kleiner Unternehmen."
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <article key={s.title} className="card-soft p-6 flex flex-col">
              <div
                className="h-11 w-11 rounded-xl bg-brand/5 text-accent-blue flex items-center justify-center"
                aria-hidden="true"
              >
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
    <section
      id="fuer-wen"
      className="py-20 md:py-28 scroll-mt-20"
      aria-labelledby="forwhom-heading"
    >
      <div className="container-page">
        <SectionHeading
          headingId="forwhom-heading"
          eyebrow="Für wen"
          title="Für wen ist Korolov IT-Service geeignet?"
          subtitle="Wer typischerweise mit mir zusammenarbeitet."
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {audiences.map((a) => (
            <div key={a.title} className="card-soft p-6">
              <div
                className="h-10 w-10 rounded-lg bg-section text-accent-teal flex items-center justify-center"
                aria-hidden="true"
              >
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
    <section
      id="preise"
      className="py-20 md:py-28 bg-section scroll-mt-20"
      aria-labelledby="pricing-heading"
    >
      <div className="container-page">
        <SectionHeading
          headingId="pricing-heading"
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
                  <Star className="h-3 w-3" aria-hidden="true" /> Empfohlen
                </div>
              )}
              <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">
                {p.name}
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <div className="text-3xl font-bold text-brand">{p.price}</div>
                <div className="text-sm text-muted-foreground">{p.suffix}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check
                      className="h-4 w-4 text-accent-teal shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              {p.note && <p className="mt-4 text-xs text-muted-foreground italic">{p.note}</p>}
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
    <section id="ablauf" className="py-20 md:py-28 scroll-mt-20" aria-labelledby="process-heading">
      <div className="container-page">
        <SectionHeading
          headingId="process-heading"
          eyebrow="Ablauf"
          title="So läuft die Zusammenarbeit ab"
          subtitle="Klar, strukturiert und ohne Überraschungen."
        />
        <ol className="mt-12 grid gap-5 lg:grid-cols-5 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title} className="card-soft p-6 relative">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Schritt {i + 1}
              </div>
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
  return <ReferencesSection locale="de" />;
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
    <section
      id="faq"
      className="py-20 md:py-28 bg-section scroll-mt-20"
      aria-labelledby="faq-heading"
    >
      <div className="container-page max-w-3xl">
        <SectionHeading
          headingId="faq-heading"
          eyebrow="FAQ"
          title="Häufige Fragen"
          subtitle="Antworten auf die häufigsten Fragen vor dem Erstgespräch."
        />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div key={f.q} className="card-soft overflow-hidden">
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left p-5 gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-md"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    type="button"
                  >
                    <span className="font-medium text-brand">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed"
                >
                  {f.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^[\d\s+\-()]*$/;

function validateContactName(value: string): string | undefined {
  const t = value.trim();
  if (!t) return "Bitte geben Sie Ihren Namen ein.";
  if (t.length < 2) return "Der Name muss mindestens 2 Zeichen haben.";
}

function validateContactEmail(value: string): string | undefined {
  const t = value.trim();
  if (!t) return "Bitte geben Sie Ihre E-Mail-Adresse ein.";
  if (!EMAIL_FORMAT_RE.test(t)) return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
}

function validateContactPhone(value: string): string | undefined {
  const t = value.trim();
  if (!t) return undefined;
  if (!PHONE_CHARS_RE.test(t)) return "Nur Ziffern, Leerzeichen und + - ( ) sind erlaubt.";
}

function validateContactTopic(topic: string): string | undefined {
  if (!topic) return "Bitte wählen Sie ein Anliegen.";
}

function validateContactMessage(value: string): string | undefined {
  const t = value.trim();
  if (!t) return "Bitte geben Sie eine Nachricht ein.";
  if (t.length < 10) return "Die Nachricht muss mindestens 10 Zeichen haben.";
  if (t.length > 2000) return "Die Nachricht darf höchstens 2000 Zeichen haben.";
}

function Contact() {
  const [consentChecked, setConsentChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = (key: string) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateAll = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const message = String(data.get("message") ?? "");

    const next: Record<string, string> = {};
    const nameErr = validateContactName(name);
    const emailErr = validateContactEmail(email);
    const phoneErr = validateContactPhone(phone);
    const topicErr = validateContactTopic(topic);
    const messageErr = validateContactMessage(message);

    if (nameErr) next.name = nameErr;
    if (emailErr) next.email = emailErr;
    if (phoneErr) next.phone = phoneErr;
    if (topicErr) next.topic = topicErr;
    if (messageErr) next.message = messageErr;

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const form = e.currentTarget;
    if (!validateAll(form)) return;

    const data = new FormData(form);
    const honey = String(data.get("_honey") ?? "").trim();
    if (honey) {
      setSubmitted(true);
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const payload = {
      name,
      company,
      email,
      phone,
      topic,
      message,
      consent: consentChecked,
      locale: "de",
      _honey: honey,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !(result?.success ?? result?.ok)) {
        if (result?.errors && typeof result.errors === "object") {
          setErrors((prev) => ({ ...prev, ...result.errors }));
        }
        if (result?.message && typeof result.message === "string") {
          setSubmitError(result.message);
          return;
        }
        if (result?.error && typeof result.error === "string") {
          setSubmitError(result.error);
          return;
        }
        throw new Error("request_failed");
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        `Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie direkt an ${COMPANY.email}.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="py-20 md:py-28 scroll-mt-20" aria-labelledby="contact-heading">
      <div className="container-page grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">
            Kontakt
          </div>
          <h2
            id="contact-heading"
            className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight"
          >
            Kostenloses Erstgespräch anfragen
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Schreiben Sie kurz, wobei Sie Unterstützung benötigen. Ich melde mich mit einer ersten
            Einschätzung zurück.
          </p>
          <div className="mt-8 space-y-4">
            <ContactRow
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              label="E-Mail"
              value={COMPANY.email}
              href={`mailto:${COMPANY.email}`}
              ariaLabel="E-Mail an Korolov IT-Service senden"
            />
            <ContactRow
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              label="Telefon"
              value={COMPANY.phoneDisplay}
              href={COMPANY.phoneHref}
              ariaLabel="Korolov IT-Service anrufen"
            />
            <ContactRow
              icon={<MessageSquare className="h-5 w-5" aria-hidden="true" />}
              label="WhatsApp"
              value="WhatsApp-Nachricht senden"
              href={COMPANY.whatsappHref}
              external
              ariaLabel="Über WhatsApp schreiben"
            />
            <ContactRow
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              label="Standort"
              value="Leverkusen, NRW"
            />
            <ContactRow
              icon={<Languages className="h-5 w-5" aria-hidden="true" />}
              label="Sprachen"
              value="Deutsch · Russisch · Ukrainisch"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          {submitted ? (
            <div role="status" aria-live="polite" className="card-soft p-6 md:p-8 space-y-3">
              <p className="text-lg font-semibold text-brand">
                <span aria-hidden="true">✓</span> Vielen Dank!
              </p>
              <p className="text-sm text-foreground/85 leading-relaxed">
                Ihre Anfrage wurde erfolgreich gesendet. Ich melde mich innerhalb von 24 Stunden bei
                Ihnen zurück.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="card-soft p-6 md:p-8 space-y-5"
              noValidate
              aria-labelledby="contact-heading"
            >
              <input type="hidden" name="topic" value={topic} />

              <input
                type="text"
                name="_honey"
                className="sr-only"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" required fieldId="contact-name" error={errors.name}>
                  <Input
                    name="name"
                    placeholder="Ihr Name"
                    disabled={isSubmitting}
                    onBlur={(e) => {
                      const err = validateContactName(e.target.value);
                      setErrors((prev) => {
                        const next = { ...prev };
                        if (err) next.name = err;
                        else delete next.name;
                        return next;
                      });
                    }}
                  />
                </Field>
                <Field label="Unternehmen" fieldId="contact-company">
                  <Input
                    name="company"
                    placeholder="Firmenname (optional)"
                    disabled={isSubmitting}
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="E-Mail" required fieldId="contact-email" error={errors.email}>
                  <Input
                    type="email"
                    name="email"
                    placeholder="ihre@email.de"
                    disabled={isSubmitting}
                    onBlur={(e) => {
                      const err = validateContactEmail(e.target.value);
                      setErrors((prev) => {
                        const next = { ...prev };
                        if (err) next.email = err;
                        else delete next.email;
                        return next;
                      });
                    }}
                  />
                </Field>
                <Field label="Telefon" fieldId="contact-phone" error={errors.phone}>
                  <Input
                    name="phone"
                    placeholder="optional"
                    disabled={isSubmitting}
                    onBlur={(e) => {
                      const err = validateContactPhone(e.target.value);
                      setErrors((prev) => {
                        const next = { ...prev };
                        if (err) next.phone = err;
                        else delete next.phone;
                        return next;
                      });
                    }}
                  />
                </Field>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-topic" className="text-sm text-foreground/80">
                  Anliegen{" "}
                  <span className="text-destructive" aria-label="erforderlich">
                    *
                  </span>
                </Label>
                <Select
                  value={topic}
                  onValueChange={(v) => {
                    setTopic(v);
                    clearFieldError("topic");
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="contact-topic"
                    aria-invalid={!!errors.topic}
                    aria-describedby={errors.topic ? "contact-topic-error" : undefined}
                    onBlur={() => {
                      const err = validateContactTopic(topic);
                      setErrors((prev) => {
                        const next = { ...prev };
                        if (err) next.topic = err;
                        else delete next.topic;
                        return next;
                      });
                    }}
                  >
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
                {errors.topic && (
                  <p
                    id="contact-topic-error"
                    role="alert"
                    className="text-destructive text-xs mt-1"
                  >
                    {errors.topic}
                  </p>
                )}
              </div>

              <Field label="Nachricht" required fieldId="contact-message" error={errors.message}>
                <Textarea
                  name="message"
                  rows={5}
                  maxLength={2000}
                  placeholder="Beschreiben Sie kurz Ihr Anliegen…"
                  disabled={isSubmitting}
                  onBlur={(e) => {
                    const err = validateContactMessage(e.target.value);
                    setErrors((prev) => {
                      const next = { ...prev };
                      if (err) next.message = err;
                      else delete next.message;
                      return next;
                    });
                  }}
                />
              </Field>

              <label
                htmlFor="contact-consent"
                className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer"
              >
                <Checkbox
                  id="contact-consent"
                  checked={consentChecked}
                  onCheckedChange={(v) => setConsentChecked(Boolean(v))}
                  disabled={isSubmitting}
                  aria-required="true"
                  className="mt-0.5"
                />
                <span>
                  Ich habe die{" "}
                  <Link to="/datenschutz" className="text-accent-blue hover:underline">
                    Datenschutzerklärung
                  </Link>{" "}
                  zur Kenntnis genommen. Ich stimme zu, dass meine Angaben (Name, E-Mail-Adresse
                  sowie ggf. Telefon und Firmenname) zur Bearbeitung meiner Anfrage erhoben und
                  verarbeitet werden. Diese Einwilligung kann ich jederzeit für die Zukunft per
                  E-Mail an{" "}
                  <a href={`mailto:${COMPANY.email}`} className="text-accent-blue hover:underline">
                    {COMPANY.email}
                  </a>{" "}
                  widerrufen.
                </span>
              </label>

              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={!consentChecked || isSubmitting}
                className="w-full sm:w-auto inline-flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    Anfrage senden <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </>
                )}
              </Button>

              {submitError && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground/85"
                >
                  {submitError}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  ariaLabel,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  ariaLabel?: string;
  external?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="h-10 w-10 rounded-lg bg-section text-accent-blue flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        {href ? (
          <a
            href={href}
            aria-label={ariaLabel}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="text-sm font-medium text-foreground hover:text-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm transition-colors"
          >
            {value}
          </a>
        ) : (
          <div className="text-sm font-medium text-foreground">{value}</div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  fieldId,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  fieldId: string;
  error?: string;
  children: React.ReactElement;
}) {
  const errorId = `${fieldId}-error`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId} className="text-sm text-foreground/80">
        {label}{" "}
        {required && (
          <span className="text-destructive" aria-label="erforderlich">
            *
          </span>
        )}
      </Label>
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        id: fieldId,
        "aria-invalid": !!error,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} role="alert" className="text-destructive text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  headingId,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  headingId?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">{eyebrow}</div>
      <h2 id={headingId} className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
