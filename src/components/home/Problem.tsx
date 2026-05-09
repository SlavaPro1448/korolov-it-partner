import { CheckCircle2 } from "lucide-react";

import { getDict, type Locale } from "@/i18n";

export function Problem({ locale }: { locale: Locale }) {
  const t = getDict(locale).problem;
  return (
    <section className="py-20 md:py-28" aria-labelledby="problem-heading">
      <div className="container-page max-w-5xl">
        <h2
          id="problem-heading"
          className="text-3xl md:text-4xl font-bold text-brand leading-tight"
        >
          {t.headingPrefix}
          <span className="text-accent-blue">{t.headingHighlight}</span>
          {t.headingSuffix}
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-3xl">{t.description}</p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {t.items.map((it) => (
            <div key={it.title} className="card-soft p-6">
              <div
                className="h-10 w-10 rounded-lg bg-section flex items-center justify-center text-accent-blue"
                aria-hidden="true"
              >
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-brand">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
