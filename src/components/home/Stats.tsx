import { getDict, type Locale } from "@/i18n";

export function Stats({ locale }: { locale: Locale }) {
  const t = getDict(locale).stats;
  return (
    <section aria-label="Kennzahlen" className="border-y border-border bg-white">
      <div className="container-page">
        <dl className="grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
          {t.items.map((s) => (
            <div key={s.label} className="px-2 py-7 md:px-6 md:py-9">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-3xl font-bold tracking-tight text-brand md:text-4xl">
                {s.value}
              </dd>
              <dd className="mt-1.5 text-sm leading-snug text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
