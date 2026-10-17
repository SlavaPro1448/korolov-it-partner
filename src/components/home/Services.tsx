import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  AppWindow,
  Bot,
  Globe,
  LifeBuoy,
  Lightbulb,
  Mail,
  PhoneCall,
  Workflow,
  Wrench,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { getDict, type Locale } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// Reihenfolge entspricht den Einträgen in services.groups der Wörterbücher.
const GROUP_ICONS: Icon[][] = [
  [Globe, Wrench, LifeBuoy, Mail, Lightbulb],
  [PhoneCall, Workflow, Bot, AppWindow],
];

export function Services({ locale }: { locale: Locale }) {
  const t = getDict(locale).services;
  return (
    <section
      id="leistungen"
      className="scroll-mt-20 bg-section py-20 md:py-28"
      aria-labelledby="services-heading"
    >
      <div className="container-page">
        <SectionHeading
          headingId="services-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
        <div className="mt-14 space-y-12">
          {t.groups.map((group, gi) => {
            const isKi = gi === 1;
            return (
              <div key={group.label}>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="flex items-center gap-3 text-xl font-semibold text-brand">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        isKi ? "bg-ai-gradient" : "bg-brand"
                      }`}
                      aria-hidden="true"
                    />
                    {group.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
                <div
                  className={`grid gap-4 md:grid-cols-2 ${
                    isKi ? "lg:grid-cols-4" : "lg:grid-cols-6"
                  }`}
                >
                  {group.items.map((s, i) => {
                    const Icon = GROUP_ICONS[gi]?.[i];
                    // Websites & IT: erste zwei Kacheln breiter (Bento-Raster 3+3, dann 2+2+2)
                    const span = !isKi ? (i < 2 ? "lg:col-span-3" : "lg:col-span-2") : "";
                    const body = (
                      <>
                        <div className="flex items-start justify-between">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                              isKi
                                ? "bg-ai-gradient text-white"
                                : "bg-brand/[0.06] text-accent-blue"
                            }`}
                            aria-hidden="true"
                          >
                            {Icon && <Icon className="h-5 w-5" />}
                          </div>
                          {s.to && (
                            <ArrowUpRight
                              className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-blue"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="mt-5 text-lg font-semibold text-brand">{s.title}</div>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {s.text}
                        </p>
                        {s.tags && (
                          <div className="mt-5 flex flex-wrap gap-1.5">
                            {s.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border bg-section px-2.5 py-1 text-xs text-foreground/75"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    );
                    const cls = `card-bento group flex flex-col p-6 ${span}`;
                    return s.to ? (
                      <Link
                        key={s.title}
                        to={s.to}
                        className={cls}
                        aria-label={`${s.title} – ${t.moreLabel}`}
                      >
                        {body}
                      </Link>
                    ) : (
                      <div key={s.title} className={cls}>
                        {body}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
