import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Mail, Phone, Quote, Star } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingContactForm } from "@/components/landing/LandingContactForm";
import { COMPANY } from "@/config/legal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  serviceSchema,
} from "@/lib/structured-data";
import type { LandingContent } from "@/data/landing";
import { testimonials } from "@/data/testimonials";

const SITE_URL = "https://korolov-it-service.de";

export function ServiceLandingPage({ content }: { content: LandingContent }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={localBusinessSchema("de")} />
      <JsonLd
        data={serviceSchema({
          name: content.breadcrumbName,
          description: content.seo.description,
          path: content.path,
          serviceType: content.serviceType,
        })}
      />
      <JsonLd data={faqPageSchema(content.faq)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startseite", item: `${SITE_URL}/` },
          { name: content.breadcrumbName, item: `${SITE_URL}${content.path}` },
        ])}
      />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Hero */}
        <section
          className="hero-grid-bg relative overflow-hidden"
          aria-labelledby="landing-heading"
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
                  {content.breadcrumbName}
                </li>
              </ol>
            </nav>
            <p className="mt-8 text-sm font-medium text-accent-blue uppercase tracking-wider">
              {content.eyebrow}
            </p>
            <h1
              id="landing-heading"
              className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-brand leading-[1.1] hyphens-none text-balance"
            >
              {content.h1}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {content.lede}
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
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-13 px-7 text-base"
              >
                <a href="/#preise">Pakete & Preise ansehen</a>
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Oder rufen Sie direkt an:{" "}
              <a
                href={COMPANY.phoneHref}
                className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-accent-blue transition-colors"
                aria-label="Korolov IT-Service anrufen"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {COMPANY.phoneDisplay}
              </a>
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-14 md:py-20" aria-label="Einführung">
          <div className="container-page max-w-3xl space-y-5 text-foreground/90 leading-relaxed text-[17px]">
            {content.intro.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="py-14 md:py-20 bg-section" aria-labelledby="landing-benefits">
          <div className="container-page">
            <h2
              id="landing-benefits"
              className="text-2xl md:text-3xl font-bold text-brand text-balance"
            >
              {content.benefitsTitle}
            </h2>
            <div className="mt-10 grid md:grid-cols-3 gap-5">
              {content.benefits.map((b) => (
                <article key={b.title} className="card-soft p-6">
                  <h3 className="font-semibold text-brand">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Included */}
        <section className="py-14 md:py-20" aria-labelledby="landing-included">
          <div className="container-page">
            <h2
              id="landing-included"
              className="text-2xl md:text-3xl font-bold text-brand text-balance"
            >
              {content.includedTitle}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">{content.includedSubtitle}</p>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.included.map((item) => (
                <article key={item.title} className="card-soft p-6 flex gap-3">
                  <Check className="h-5 w-5 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-brand text-[15px]">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Price anchor */}
        <section className="py-14 md:py-20 bg-section" aria-labelledby="landing-price-heading">
          <div className="container-page max-w-3xl">
            <div className="card-soft p-8 text-center">
              <h2
                id="landing-price-heading"
                className="text-sm font-medium text-accent-blue uppercase tracking-wider"
              >
                {content.price.label}
              </h2>
              <p id="landing-price" className="mt-3 text-4xl font-bold text-brand">
                {content.price.value}
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  {content.price.suffix}
                </span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                {content.price.note}
              </p>
              <div className="mt-6">
                <a href="/#preise" className="text-sm font-medium text-accent-blue hover:underline">
                  Alle Pakete & Preise ansehen →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-14 md:py-20" aria-labelledby="landing-steps">
          <div className="container-page">
            <h2
              id="landing-steps"
              className="text-2xl md:text-3xl font-bold text-brand text-balance"
            >
              {content.stepsTitle}
            </h2>
            <ol className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {content.steps.map((s, i) => (
                <li key={s.title} className="card-soft p-6">
                  <div
                    className="h-9 w-9 rounded-full bg-accent-blue/10 text-accent-blue font-bold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-semibold text-brand text-[15px]">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20 bg-section" aria-labelledby="landing-faq">
          <div className="container-page max-w-3xl">
            <h2 id="landing-faq" className="text-2xl md:text-3xl font-bold text-brand text-balance">
              {content.faqTitle}
            </h2>
            <Accordion type="single" collapsible className="mt-8 space-y-3">
              {content.faq.map((f, i) => (
                <AccordionItem
                  key={f.question}
                  value={`faq-${i}`}
                  className="card-soft border-none px-5"
                >
                  <AccordionTrigger className="text-left font-medium text-brand hover:no-underline">
                    {f.question}
                  </AccordionTrigger>
                  {/* forceMount: Antworten bleiben im DOM (SEO/FAQPage-Konsistenz); Radix
                      blendet geschlossene Panels über das hidden-Attribut aus. */}
                  <AccordionContent forceMount className="text-muted-foreground leading-relaxed">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Kundenstimme — nur auf den Webdesign-Seiten: die Rezension bezieht
            sich auf ein Website-Projekt und wäre auf IT-Seiten off-topic. */}
        {content.serviceType === "Webdesign" && testimonials.length > 0 && (
          <section className="py-14 md:py-20" aria-labelledby="landing-testimonial">
            <div className="container-page max-w-3xl">
              <h2
                id="landing-testimonial"
                className="text-2xl md:text-3xl font-bold text-brand text-balance"
              >
                Was Kunden sagen
              </h2>
              {testimonials.map((t) => (
                <figure key={t.id} className="card-soft mt-8 p-6 md:p-7">
                  <div className="flex items-center gap-2">
                    <Quote className="h-5 w-5 text-accent-blue" aria-hidden="true" />
                    <div
                      className="flex items-center gap-0.5"
                      aria-label={`${t.rating} von 5 Sternen`}
                    >
                      {Array.from({ length: t.rating }, (_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                  <blockquote
                    lang={t.quoteLocale}
                    className="mt-4 text-foreground/90 leading-relaxed"
                  >
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <div className="font-medium text-brand">{t.author}</div>
                    <div className="text-muted-foreground">
                      <a
                        href={t.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="hover:text-accent-blue transition-colors"
                      >
                        {t.source}
                      </a>
                      {" · "}
                      {t.date}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* CTA + related */}
        <section className="py-16 md:py-24" aria-labelledby="landing-cta">
          <div className="container-page max-w-3xl text-center">
            <h2 id="landing-cta" className="text-2xl md:text-3xl font-bold text-brand text-balance">
              {content.ctaTitle}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {content.ctaText}
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
              <LandingContactForm topic={content.formTopic} />
            </div>
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {content.relatedTitle}
              </h3>
              <ul className="mt-4 flex flex-wrap justify-center gap-3">
                {content.related.map((r) => (
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
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
