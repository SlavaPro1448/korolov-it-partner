import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Headset,
  LifeBuoy,
  Lightbulb,
  Monitor,
  ScrollText,
  Wrench,
  Star,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

// Interne Verlinkung von der Startseite auf die einzelnen Leistungsseiten.
// Wichtig fürs SEO: starke interne Links aus dem Seitenkörper der (autoritärsten)
// Startseite beschleunigen Crawling und Indexierung der Landing-Pages.
// Die Zielseiten sind deutschsprachig, daher deutsche Titel auf allen Locales.
type ServiceLink = {
  to: string;
  title: string;
  text: string;
  icon: LucideIcon;
};

const SERVICE_LINKS: ServiceLink[] = [
  {
    to: "/it-service-leverkusen",
    title: "IT-Service in Leverkusen",
    text: "Ihre gesamte IT von einem festen Ansprechpartner — Überblick über alle Leistungen.",
    icon: Headset,
  },
  {
    to: "/it-betreuung-kleine-unternehmen",
    title: "IT-Betreuung für kleine Unternehmen",
    text: "Laufende Betreuung mit Updates, Backups und schneller Hilfe — ab 79 € im Monat.",
    icon: LifeBuoy,
  },
  {
    to: "/it-beratung-leverkusen",
    title: "IT-Beratung in Leverkusen",
    text: "Unabhängige Empfehlungen zu Hardware, Software, Cloud und IT-Sicherheit.",
    icon: Lightbulb,
  },
  {
    to: "/webdesign-leverkusen",
    title: "Webdesign in Leverkusen",
    text: "Moderne, schnelle Websites zum Festpreis — inklusive Domain, SSL und E-Mail.",
    icon: Monitor,
  },
  {
    to: "/wartungsvertrag-it",
    title: "IT-Wartungsvertrag",
    text: "Planbare IT-Kosten mit festen Reaktionszeiten — monatlich kündbar.",
    icon: ScrollText,
  },
  {
    to: "/website-wartung-leverkusen",
    title: "Website-Wartung & Pflege",
    text: "Updates, Backups und Monitoring für bestehende Websites — ab 79 € im Monat.",
    icon: Wrench,
  },
  {
    to: "/referenzen",
    title: "Referenzen",
    text: "Ausgewählte Projekte aus Leverkusen und Umgebung — mit Kundenstimmen.",
    icon: Star,
  },
];

const COPY: Record<Locale, { eyebrow: string; title: string; subtitle: string }> = {
  de: {
    eyebrow: "Leistungen im Detail",
    title: "Alle Leistungen auf einen Blick",
    subtitle:
      "Zu jeder Leistung gibt es eine eigene Seite mit Ablauf, Preisen und Antworten auf häufige Fragen.",
  },
  ru: {
    eyebrow: "Услуги подробно",
    title: "Все услуги на отдельных страницах",
    subtitle:
      "По каждой услуге есть отдельная страница (на немецком) с описанием, ценами и ответами на частые вопросы.",
  },
  uk: {
    eyebrow: "Послуги докладно",
    title: "Усі послуги на окремих сторінках",
    subtitle:
      "Для кожної послуги є окрема сторінка (німецькою) з описом, цінами та відповідями на часті запитання.",
  },
};

export function ServiceLinks({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section className="py-20 md:py-28 scroll-mt-20" aria-labelledby="service-links-heading">
      <div className="container-page">
        <SectionHeading
          headingId="service-links-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_LINKS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.to}
                to={s.to}
                className="card-soft p-6 flex flex-col group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-xl transition-colors hover:border-accent-blue/40"
              >
                <div
                  className="h-11 w-11 rounded-xl bg-brand/5 text-accent-blue flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-brand text-lg group-hover:text-accent-blue transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {s.text}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-blue">
                  Mehr erfahren
                  <ArrowRight
                    className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
