import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, ExternalLink, Mail, Phone } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingContactForm } from "@/components/landing/LandingContactForm";
import { COMPANY } from "@/config/legal";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/structured-data";
import type { Case } from "@/data/cases";

const SITE_URL = "https://korolov-it-service.de";

export function CaseDetailPage({ item }: { item: Case }) {
  const detail = item.detail;
  if (!detail) return null;

  const liveHref = item.liveUrl
    ? item.liveUrl.startsWith("http")
      ? item.liveUrl
      : `${SITE_URL}${item.liveUrl}`
    : undefined;
  const isExternalLive = Boolean(item.liveUrl?.startsWith("http"));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={localBusinessSchema("de")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startseite", item: `${SITE_URL}/` },
          { name: "Referenzen", item: `${SITE_URL}/referenzen` },
          { name: item.client, item: `${SITE_URL}${detail.path}` },
        ])}
      />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Hero */}
        <section className="hero-grid-bg relative overflow-hidden" aria-labelledby="case-heading">
          <div className="container-page py-16 md:py-24 max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link to="/" className="hover:text-accent-blue transition-colors">
                    Startseite
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li>
                  <Link to="/referenzen" className="hover:text-accent-blue transition-colors">
                    Referenzen
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li aria-current="page" className="text-foreground/80">
                  {item.client}
                </li>
              </ol>
            </nav>
            <p className="mt-8 text-sm font-medium text-accent-blue uppercase tracking-wider">
              {detail.eyebrow}
            </p>
            <h1
              id="case-heading"
              className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-brand leading-[1.1] hyphens-none text-balance"
            >
              {detail.h1}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {detail.lede}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                variant="brand"
                size="lg"
                className="w-full sm:w-auto h-13 px-7 text-base bg-accent-blue hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/30"
              >
                <a href="/#kontakt">
                  Kostenloses Erstgespräch anfragen
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              {liveHref && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-13 px-7 text-base"
                >
                  <a
                    href={liveHref}
                    {...(isExternalLive ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={`Projekt ansehen: ${item.client}`}
                  >
                    Projekt ansehen
                    <ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Projektdaten */}
        <section className="py-14 md:py-20 bg-section" aria-labelledby="case-facts">
          <div className="container-page">
            <h2 id="case-facts" className="text-2xl md:text-3xl font-bold text-brand text-balance">
              {detail.factsTitle}
            </h2>
            <dl className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {detail.facts.map((f) => (
                <div key={f.label} className="card-soft p-6">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="mt-2 font-semibold text-brand text-[15px] leading-snug">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Ausgangslage */}
        <section className="py-14 md:py-20" aria-labelledby="case-situation">
          <div className="container-page max-w-3xl">
            <h2
              id="case-situation"
              className="text-2xl md:text-3xl font-bold text-brand text-balance"
            >
              {detail.situationTitle}
            </h2>
            <div className="mt-6 space-y-5 text-foreground/90 leading-relaxed text-[17px]">
              {detail.situation.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Umsetzung */}
        <section className="py-14 md:py-20 bg-section" aria-labelledby="case-solution">
          <div className="container-page">
            <h2
              id="case-solution"
              className="text-2xl md:text-3xl font-bold text-brand text-balance"
            >
              {detail.solutionTitle}
            </h2>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {detail.solution.map((s) => (
                <article key={s.title} className="card-soft p-6 flex gap-3">
                  <Check className="h-5 w-5 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-brand text-[15px]">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Ergebnis */}
        <section className="py-14 md:py-20" aria-labelledby="case-result">
          <div className="container-page max-w-3xl">
            <h2 id="case-result" className="text-2xl md:text-3xl font-bold text-brand text-balance">
              {detail.resultTitle}
            </h2>
            <div className="mt-6 space-y-5 text-foreground/90 leading-relaxed text-[17px]">
              {detail.result.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-1.5">
              {item.servicesProvided.map((service) => (
                <span
                  key={service}
                  className="text-xs px-2.5 py-1 rounded-full bg-section text-foreground/70 border border-border"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA + related */}
        <section className="py-16 md:py-24 bg-section" aria-labelledby="case-cta">
          <div className="container-page max-w-3xl text-center">
            <h2 id="case-cta" className="text-2xl md:text-3xl font-bold text-brand text-balance">
              {detail.ctaTitle}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {detail.ctaText}
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
              <LandingContactForm topic={`Anfrage über Referenz ${item.client}`} />
            </div>
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Passende Leistungen
              </h3>
              <ul className="mt-4 flex flex-wrap justify-center gap-3">
                {detail.related.map((r) => (
                  <li key={r.to}>
                    <Link
                      to={r.to}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground/80 hover:text-accent-blue hover:border-accent-blue/40 transition-colors"
                    >
                      {r.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                <Link
                  to="/referenzen"
                  className="text-sm font-medium text-accent-blue hover:underline"
                >
                  ← Alle Referenzen ansehen
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
