import { getDict, type Locale } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

export function Process({ locale }: { locale: Locale }) {
  const t = getDict(locale).process;
  return (
    <section
      id="ablauf"
      className="scroll-mt-20 bg-section py-20 md:py-28"
      aria-labelledby="process-heading"
    >
      <div className="container-page">
        <SectionHeading
          headingId="process-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
        <ol className="relative mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <div
            className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-accent-blue/40 via-accent-violet/40 to-transparent lg:block"
            aria-hidden="true"
          />
          {t.steps.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-sm font-bold text-brand shadow-sm">
                <span className="sr-only">{t.stepLabel} </span>
                {i + 1}
              </div>
              <h3 className="mt-5 font-semibold text-brand">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
