import { Link } from "@tanstack/react-router";
import { ChevronRight, Mail, Phone } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingContactForm } from "@/components/landing/LandingContactForm";
import { ReferencesSection } from "@/components/sections/ReferencesSection";
import { COMPANY } from "@/config/legal";
import { cases } from "@/data/cases";
import { breadcrumbSchema, itemListSchema, localBusinessSchema } from "@/lib/structured-data";

const SITE_URL = "https://korolov-it-service.de";

export default function ReferenzenPage() {
  const featured = cases.filter((c) => c.featured);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={localBusinessSchema("de")} />
      <JsonLd
        data={itemListSchema(
          featured.map((c) => ({
            name: c.client,
            description: c.summary.de,
            ...(c.liveUrl
              ? { url: c.liveUrl.startsWith("http") ? c.liveUrl : `${SITE_URL}${c.liveUrl}` }
              : {}),
          })),
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startseite", item: `${SITE_URL}/` },
          { name: "Referenzen", item: `${SITE_URL}/referenzen` },
        ])}
      />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Hero */}
        <section
          className="hero-grid-bg relative overflow-hidden"
          aria-labelledby="referenzen-heading"
        >
          <div className="container-page py-16 md:py-24 max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link to="/" className="hover:text-accent-blue transition-colors">
                    Startseite
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li aria-current="page" className="text-foreground/80">
                  Referenzen
                </li>
              </ol>
            </nav>
            <p className="mt-8 text-sm font-medium text-accent-blue uppercase tracking-wider">
              Projekte & Kundenstimmen
            </p>
            <h1
              id="referenzen-heading"
              className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-brand leading-[1.1] hyphens-none text-balance"
            >
              Referenzen
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Ausgewählte Projekte für kleine Unternehmen aus Leverkusen und Umgebung — vom
              Metallbau-Betrieb über die Hausverwaltung bis zur Anwaltskanzlei.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-14 md:py-20" aria-label="Einführung">
          <div className="container-page max-w-3xl space-y-5 text-foreground/90 leading-relaxed text-[17px]">
            <p>
              Jedes der folgenden Projekte steht für dieselbe Arbeitsweise: ein fester
              Ansprechpartner, klare Absprachen und Technik, die im Alltag zuverlässig
              funktioniert. Die Bandbreite reicht von neuen Websites mit Hosting und
              geschäftlicher E-Mail bis zur laufenden IT-Betreuung ganzer Büros.
            </p>
            <p>
              Aus Rücksicht auf meine Kunden zeige ich hier nur freigegebene Projekte und
              Rückmeldungen. Weitere Referenzen — auch aus Ihrer Branche — nenne ich Ihnen gern
              im persönlichen Gespräch.
            </p>
          </div>
        </section>

        <ReferencesSection locale="de" />

        {/* CTA */}
        <section className="py-16 md:py-24" aria-labelledby="referenzen-cta">
          <div className="container-page max-w-3xl text-center">
            <h2
              id="referenzen-cta"
              className="text-2xl md:text-3xl font-bold text-brand text-balance"
            >
              Ihr Projekt könnte das nächste sein
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Erzählen Sie kurz, was Sie planen oder was Sie an Ihrer IT stört — Sie erhalten
              eine ehrliche Einschätzung im kostenlosen Erstgespräch.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a
                href={COMPANY.phoneHref}
                className="inline-flex items-center gap-2 font-medium text-foreground hover:text-accent-blue transition-colors"
                aria-label="Korolov IT-Service anrufen"
              >
                <Phone className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                {COMPANY.phoneDisplay}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center gap-2 font-medium text-foreground hover:text-accent-blue transition-colors"
                aria-label="E-Mail an Korolov IT-Service senden"
              >
                <Mail className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                {COMPANY.email}
              </a>
            </div>
            <div className="mt-8 max-w-xl mx-auto">
              <LandingContactForm topic="Anfrage über Referenzen-Seite" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
