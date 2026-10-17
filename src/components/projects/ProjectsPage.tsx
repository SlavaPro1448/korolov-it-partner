import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReferencesSection } from "@/components/sections/ReferencesSection";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { Button } from "@/components/ui/button";
import { PROJECT_CATEGORY_LABEL, projects, type ProjectCategory } from "@/data/projects";
import { breadcrumbSchema, itemListSchema, localBusinessSchema } from "@/lib/structured-data";

const SITE_URL = "https://korolov-it-service.de";
const FILTERS: Array<ProjectCategory | "all"> = ["all", "ki", "app", "bot"];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const visible = projects.filter((p) => filter === "all" || p.categories.includes(filter));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JsonLd data={localBusinessSchema("de")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startseite", item: `${SITE_URL}/` },
          { name: "Projekte", item: `${SITE_URL}/projekte` },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          projects.map((p) => ({
            name: p.name,
            description: p.tagline.de,
            url: `${SITE_URL}/projekte/${p.slug}`,
          })),
        )}
      />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <section className="section-dark overflow-hidden" aria-labelledby="projects-heading">
          <div className="container-page py-16 md:py-24">
            <nav aria-label="Breadcrumb" className="text-sm text-white/55">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link to="/" className="transition-colors hover:text-white">
                    Startseite
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li aria-current="page" className="text-white/85">
                  Projekte
                </li>
              </ol>
            </nav>
            <h1
              id="projects-heading"
              className="display mt-8 max-w-4xl text-4xl text-white text-balance md:text-6xl"
            >
              Projekte: <span className="text-gradient-ai">KI, Apps und Bots</span>, die wirklich
              laufen
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
              Eigenentwicklungen, die ich selbst täglich nutze oder gerade erprobe – und
              Kundenprojekte rund um Websites und IT. Jede Lösung zeigt, was ich auch für Ihr
              Unternehmen bauen kann.
            </p>
            <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Projekte filtern">
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      active
                        ? "border-white bg-white text-brand"
                        : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"
                    }`}
                  >
                    {f === "all" ? "Alle" : PROJECT_CATEGORY_LABEL[f].de}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" aria-label="Eigene Projekte">
          <div className="container-page space-y-6">
            {visible.map((p, i) => (
              <article
                key={p.slug}
                className="card-bento grid items-center gap-10 overflow-hidden p-6 md:p-10 lg:grid-cols-2"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-section px-2.5 py-1 text-foreground/75">
                      {p.kind.de}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                        aria-hidden="true"
                      />
                      {p.status.de}
                    </span>
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-brand md:text-3xl">
                    {p.name}
                  </h2>
                  <p className="mt-3 text-lg leading-relaxed text-foreground/85">{p.tagline.de}</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{p.summary.de}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border px-2 py-0.5 text-xs text-foreground/65"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button asChild variant="brand" className="mt-7">
                    <Link to="/projekte/$slug" params={{ slug: p.slug }}>
                      Projekt ansehen <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
                <div
                  className={`relative flex justify-center rounded-2xl bg-section py-8 ${
                    i % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <ProjectVisual kind={p.visual} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <ReferencesSection locale="de" />

        <section className="section-dark py-16 md:py-20">
          <div className="container-page flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Eine Idee für Ihr Unternehmen?
              </h2>
              <p className="mt-3 text-lg text-white/65">
                Erzählen Sie mir kurz, was Sie Zeit kostet – ich sage Ihnen ehrlich, ob Website,
                Bot, App oder KI die richtige Antwort ist.
              </p>
            </div>
            <a
              href="/#kontakt"
              className="inline-flex h-13 shrink-0 items-center gap-2 rounded-xl bg-white px-7 text-base font-semibold text-brand transition hover:bg-white/90"
            >
              Kostenloses Erstgespräch <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
