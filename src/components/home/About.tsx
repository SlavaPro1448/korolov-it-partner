import { CheckCircle2, Languages, MapPin, MessageSquare } from "lucide-react";
import { Fragment } from "react";

import { getDict, type Locale } from "@/i18n";

const NAME = "Viacheslav Korolov";

function ParagraphWithName({ text }: { text: string }) {
  const parts = text.split("{name}");
  return (
    <p>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="font-medium text-brand">{NAME}</span>}
        </Fragment>
      ))}
    </p>
  );
}

export function About({ locale }: { locale: Locale }) {
  const t = getDict(locale).about;
  return (
    <section
      id="ueber-mich"
      className="py-20 md:py-28 scroll-mt-20"
      aria-labelledby="about-heading"
    >
      <div className="container-page grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-7">
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-blue">
            {t.eyebrow}
          </div>
          <h2
            id="about-heading"
            className="mt-3 text-3xl md:text-[2.75rem] font-bold leading-[1.08] tracking-[-0.03em] text-brand"
          >
            {t.heading}
          </h2>
          <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
            {t.paragraphs.map((p, i) => (
              <ParagraphWithName key={i} text={p} />
            ))}
          </div>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {t.trust.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground/85">
                <CheckCircle2
                  className="h-5 w-5 text-accent-teal shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-sm">
            <div
              className="absolute -inset-4 rounded-[2rem] bg-ai-gradient opacity-15 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-section shadow-[0_30px_60px_-30px_rgb(15_39_66/0.45)]">
              <img
                src="/images/viacheslav-portrait-v4.webp"
                alt="Viacheslav Korolov – Inhaber Korolov IT-Service"
                loading="lazy"
                width={448}
                height={559}
                className="aspect-[4/5] h-auto w-full object-cover object-center"
              />
              <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/60 bg-white/90 p-4 backdrop-blur">
                <div className="font-semibold text-brand">{t.cardName}</div>
                <div className="text-sm text-muted-foreground">{t.cardRole}</div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-foreground/75">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
                    {t.cardLocation}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Languages className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
                    {t.cardLanguages}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
                    {t.cardContactNote}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
