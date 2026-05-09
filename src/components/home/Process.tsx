import { getDict, type Locale } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

export function Process({ locale }: { locale: Locale }) {
  const t = getDict(locale).process;
  return (
    <section id="ablauf" className="py-20 md:py-28 scroll-mt-20" aria-labelledby="process-heading">
      <div className="container-page">
        <SectionHeading
          headingId="process-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
        <ol className="mt-12 grid gap-5 lg:grid-cols-5 md:grid-cols-2">
          {t.steps.map((s, i) => (
            <li key={s.title} className="card-soft p-6 relative">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {t.stepLabel} {i + 1}
              </div>
              <div className="mt-2 h-9 w-9 rounded-lg bg-brand text-brand-foreground flex items-center justify-center font-semibold">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold text-brand">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
