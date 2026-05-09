import { FileText, Globe, LifeBuoy, Mail, ShieldCheck, Wrench } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { getDict, type Locale } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

const ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  Globe,
  Wrench,
  Mail,
  LifeBuoy,
  FileText,
  ShieldCheck,
];

export function Services({ locale }: { locale: Locale }) {
  const t = getDict(locale).services;
  return (
    <section
      id="leistungen"
      className="py-20 md:py-28 bg-section scroll-mt-20"
      aria-labelledby="services-heading"
    >
      <div className="container-page">
        <SectionHeading
          headingId="services-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.items.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <article key={s.title} className="card-soft p-6 flex flex-col">
                <div
                  className="h-11 w-11 rounded-xl bg-brand/5 text-accent-blue flex items-center justify-center"
                  aria-hidden="true"
                >
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <h3 className="mt-4 font-semibold text-brand text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {s.text}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-section text-foreground/70 border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
