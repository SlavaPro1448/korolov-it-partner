import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Eye, Gauge, Server, ShieldCheck } from "lucide-react";

import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { projects } from "@/data/projects";
import { getDict, type Locale } from "@/i18n";

import { SectionHeading } from "@/components/home/SectionHeading";

const PRINCIPLE_ICONS = [ShieldCheck, Server, Gauge, Eye];

export function KiShowcase({ locale }: { locale: Locale }) {
  const t = getDict(locale).ki;
  const [featured, ...rest] = projects;

  return (
    <section
      id="ki"
      className="section-dark scroll-mt-20 py-20 md:py-28"
      aria-labelledby="ki-heading"
    >
      <div className="container-page">
        <SectionHeading
          headingId="ki-heading"
          tone="dark"
          eyebrow={t.eyebrow}
          title={
            <>
              {t.titleLead} <span className="text-gradient-ai">{t.titleAccent}</span>
            </>
          }
          subtitle={t.subtitle}
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {/* Großes Feature-Kachel: Jarvis */}
          <Link
            to="/projekte/$slug"
            params={{ slug: featured.slug }}
            className="card-glass group relative overflow-hidden p-7 lg:col-span-2 lg:row-span-2"
          >
            <div className="grid h-full items-center gap-8 md:grid-cols-2">
              <div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-white/80">
                    {featured.kind[locale]}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    {featured.status[locale]}
                  </span>
                </div>
                <h3 className="mt-5 text-3xl font-bold tracking-tight text-white">
                  {featured.name}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-white/80">
                  {featured.tagline[locale]}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {featured.summary[locale]}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#9db8ff]">
                  {t.detailsLabel}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <ProjectVisual kind={featured.visual} />
              </div>
            </div>
          </Link>

          {rest.map((p) => (
            <Link
              key={p.slug}
              to="/projekte/$slug"
              params={{ slug: p.slug }}
              className="card-glass group flex flex-col p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/75">
                  {p.status[locale]}
                </span>
                <ArrowUpRight
                  className="h-5 w-5 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">
                {p.tagline[locale]}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-white/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}

          {/* Abschluss-Kachel füllt die letzte Reihe */}
          <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[var(--radius-2xl)] bg-ai-gradient p-7 lg:col-span-2">
            <div
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative">
              <h3 className="text-2xl font-bold tracking-tight text-white text-balance">
                {t.ctaTitle}
              </h3>
              <p className="mt-2 max-w-lg text-white/85">{t.ctaText}</p>
            </div>
            <div className="relative flex flex-wrap gap-3">
              <a
                href="#kontakt"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-brand transition hover:bg-white/90"
              >
                {t.ctaButton} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to="/projekte"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t.allProjects}
              </Link>
            </div>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.principles.map((pr, i) => {
            const Icon = PRINCIPLE_ICONS[i];
            return (
              <li key={pr.title} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#9db8ff]">
                  {Icon && <Icon className="h-4.5 w-4.5" aria-hidden="true" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{pr.title}</div>
                  <div className="mt-0.5 text-sm leading-snug text-white/55">{pr.text}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
