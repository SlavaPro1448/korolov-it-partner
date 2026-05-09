import { Check, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDict, type Locale } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

const RECOMMENDED_INDEX = 1;

export function Pricing({ locale }: { locale: Locale }) {
  const t = getDict(locale).pricing;
  return (
    <section
      id="preise"
      className="py-20 md:py-28 bg-section scroll-mt-20"
      aria-labelledby="pricing-heading"
    >
      <div className="container-page">
        <SectionHeading
          headingId="pricing-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
        <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {t.packages.map((p, i) => {
            const recommended = i === RECOMMENDED_INDEX;
            return (
              <div
                key={p.name}
                className={`relative card-soft p-6 flex flex-col ${
                  recommended ? "ring-2 ring-accent-blue border-accent-blue" : ""
                }`}
              >
                {recommended && (
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-accent-blue text-white text-xs font-medium px-2.5 py-1">
                    <Star className="h-3 w-3" aria-hidden="true" /> {t.recommendedBadge}
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
                <Button asChild variant={recommended ? "brand" : "outline"} className="mt-6">
                  <a href="#kontakt">{t.ctaLabel}</a>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
