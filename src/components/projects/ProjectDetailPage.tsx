import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Mail, Phone } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { LandingContactForm } from "@/components/landing/LandingContactForm";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/config/legal";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import { breadcrumbSchema, faqPageSchema, localBusinessSchema } from "@/lib/structured-data";

const SITE_URL = "https://korolov-it-service.de";

function cellTone(value: string) {
  if (value.startsWith("✓")) return "text-emerald-600 font-semibold";
  if (value.startsWith("–")) return "text-muted-foreground/60";
  return "text-amber-700";
}

export function ProjectDetailPage({ project }: { project: Project }) {
  const d = project.detail;
  const path = `/projekte/${project.slug}`;
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JsonLd data={localBusinessSchema("de")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startseite", item: `${SITE_URL}/` },
          { name: "Projekte", item: `${SITE_URL}/projekte` },
          { name: project.name, item: `${SITE_URL}${path}` },
        ])}
      />
      {d.faq && d.faq.length > 0 && <JsonLd data={faqPageSchema(d.faq)} />}
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Hero */}
        <section className="hero-mesh relative overflow-hidden" aria-labelledby="project-heading">
          <div className="container-page grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link to="/" className="transition-colors hover:text-accent-blue">
                      Startseite
                    </Link>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </li>
                  <li>
                    <Link to="/projekte" className="transition-colors hover:text-accent-blue">
                      Projekte
                    </Link>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </li>
                  <li aria-current="page" className="text-foreground/80">
                    {project.name}
                  </li>
                </ol>
              </nav>
              <div className="mt-8 flex flex-wrap gap-2 text-xs">
                <span className="eyebrow-pill">{project.kind.de}</span>
                <span className="eyebrow-pill">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  {project.status.de}
                </span>
              </div>
              <h1
                id="project-heading"
                className="display mt-5 text-4xl text-brand text-balance md:text-5xl"
              >
                {d.h1}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {d.lede}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="h-13 w-full px-7 text-base sm:w-auto"
                >
                  <a href="#anfrage">
                    {d.forYou.cta}
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-13 w-full bg-white/70 px-7 text-base sm:w-auto"
                >
                  <Link to="/projekte">Alle Projekte</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:col-span-5">
              <div className="relative">
                <div
                  className="absolute -inset-6 rounded-[3rem] bg-ai-gradient opacity-20 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative">
                  <ProjectVisual kind={project.visual} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eckdaten */}
        <section aria-label="Eckdaten" className="border-y border-border bg-white">
          <dl className="container-page grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-border">
            {d.facts.map((f) => (
              <div key={f.label} className="px-2 py-6 md:px-6">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </dt>
                <dd className="mt-1.5 font-semibold text-brand">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Funktionen */}
        <section className="bg-section py-16 md:py-24" aria-labelledby="features-heading">
          <div className="container-page">
            <h2
              id="features-heading"
              className="text-3xl font-bold tracking-[-0.03em] text-brand md:text-4xl"
            >
              {d.featuresTitle}
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {d.features.map((f, i) => (
                <article key={f.title} className="card-bento p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ai-gradient text-sm font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-brand">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Freie Abschnitte */}
        {d.sections.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container-page grid gap-12 lg:grid-cols-2">
              {d.sections.map((s) => (
                <div key={s.title}>
                  <h2 className="text-2xl font-bold tracking-tight text-brand md:text-3xl">
                    {s.title}
                  </h2>
                  {s.paragraphs?.map((p) => (
                    <p key={p} className="mt-4 leading-relaxed text-foreground/85">
                      {p}
                    </p>
                  ))}
                  {s.bullets && (
                    <ul className="mt-5 space-y-3">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-foreground/85">
                          <Check
                            className="mt-0.5 h-5 w-5 shrink-0 text-accent-teal"
                            aria-hidden="true"
                          />
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Vergleich */}
        {d.comparison && (
          <section className="bg-section py-16 md:py-24" aria-labelledby="comparison-heading">
            <div className="container-page">
              <h2
                id="comparison-heading"
                className="text-3xl font-bold tracking-[-0.03em] text-brand md:text-4xl"
              >
                {d.comparison.title}
              </h2>
              {d.comparison.subtitle && (
                <p className="mt-3 text-muted-foreground">{d.comparison.subtitle}</p>
              )}
              <div className="card-bento mt-8 overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="p-4 font-medium text-muted-foreground">
                        Funktion
                      </th>
                      {d.comparison.columns.map((c, i) => (
                        <th
                          key={c}
                          scope="col"
                          className={`p-4 text-center font-semibold ${
                            i === 0 ? "bg-accent-blue/[0.06] text-accent-blue" : "text-brand"
                          }`}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.comparison.rows.map((r) => (
                      <tr key={r.label} className="border-b border-border last:border-0">
                        <th scope="row" className="p-4 font-medium text-foreground/85">
                          {r.label}
                        </th>
                        {r.values.map((v, i) => (
                          <td
                            key={i}
                            className={`p-4 text-center ${cellTone(v)} ${
                              i === 0 ? "bg-accent-blue/[0.06]" : ""
                            }`}
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {d.comparison.note && (
                <p className="mt-4 max-w-4xl text-xs leading-relaxed text-muted-foreground">
                  {d.comparison.note}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Technik */}
        <section className="section-dark py-16 md:py-24" aria-labelledby="stack-heading">
          <div className="container-page">
            <h2
              id="stack-heading"
              className="text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl"
            >
              Technik
            </h2>
            <dl className="mt-10 grid gap-4 md:grid-cols-2">
              {d.stack.map((s) => (
                <div key={s.layer} className="card-glass p-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9db8ff]">
                    {s.layer}
                  </dt>
                  <dd className="mt-2 text-white/85">{s.items}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FAQ */}
        {d.faq && d.faq.length > 0 && (
          <section className="py-16 md:py-24" aria-labelledby="project-faq">
            <div className="container-page max-w-3xl">
              <h2
                id="project-faq"
                className="text-3xl font-bold tracking-[-0.03em] text-brand md:text-4xl"
              >
                Häufige Fragen
              </h2>
              <Accordion type="single" collapsible className="mt-8">
                {d.faq.map((f, i) => (
                  <AccordionItem key={f.question} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-base font-medium text-brand">
                      {f.question}
                    </AccordionTrigger>
                    <AccordionContent forceMount className="leading-relaxed text-muted-foreground">
                      {f.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* CTA + Formular */}
        <section
          id="anfrage"
          className="scroll-mt-20 bg-section py-16 md:py-24"
          aria-labelledby="project-cta"
        >
          <div className="container-page grid gap-12 lg:grid-cols-2">
            <div>
              <h2
                id="project-cta"
                className="text-3xl font-bold tracking-[-0.03em] text-brand text-balance md:text-4xl"
              >
                {d.forYou.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{d.forYou.text}</p>
              <div className="mt-8 space-y-3 text-sm">
                <a
                  href={COMPANY.phoneHref}
                  className="flex items-center gap-3 text-brand hover:text-accent-blue"
                >
                  <Phone className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                  {COMPANY.phoneDisplay}
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-center gap-3 text-brand hover:text-accent-blue"
                >
                  <Mail className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                  {COMPANY.email}
                </a>
              </div>
              {d.related.length > 0 && (
                <div className="mt-10">
                  <div className="text-sm font-semibold text-brand">Passende Leistungen</div>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {d.related.map((r) => (
                      <li key={r.to}>
                        <Link
                          to={r.to}
                          className="inline-flex rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-foreground/80 transition-colors hover:border-accent-blue hover:text-accent-blue"
                        >
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="card-bento p-6 md:p-8">
              <LandingContactForm topic={d.forYou.topic} />
            </div>
          </div>
        </section>

        {/* Weitere Projekte */}
        <section className="py-16 md:py-24" aria-labelledby="more-projects">
          <div className="container-page">
            <h2
              id="more-projects"
              className="text-2xl font-bold tracking-tight text-brand md:text-3xl"
            >
              Weitere Projekte
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to="/projekte/$slug"
                  params={{ slug: p.slug }}
                  className="card-bento group flex flex-col p-6"
                >
                  <span className="text-xs text-muted-foreground">{p.kind.de}</span>
                  <span className="mt-2 text-lg font-semibold text-brand">{p.name}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.tagline.de}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue">
                    Ansehen
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
