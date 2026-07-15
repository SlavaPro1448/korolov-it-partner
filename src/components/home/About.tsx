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
      <div className="container-page grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">
            {t.eyebrow}
          </div>
          <h2
            id="about-heading"
            className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight"
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
          <div className="card-soft p-7 bg-gradient-to-br from-white to-section">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 pt-1">
                <div className="font-semibold text-brand text-lg">{t.cardName}</div>
                <div className="text-sm text-muted-foreground">{t.cardRole}</div>
              </div>
              <div className="w-24 sm:w-28 aspect-[4/5] rounded-2xl overflow-hidden shadow-sm shrink-0">
                <img
                  src="/images/viacheslav-portrait-v4.webp"
                  alt="Viacheslav Korolov – Inhaber Korolov IT-Service"
                  loading="lazy"
                  width={448}
                  height={559}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="mt-6 space-y-2.5 text-sm text-foreground/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-blue" aria-hidden="true" /> {t.cardLocation}
              </div>
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-accent-blue" aria-hidden="true" /> {t.cardLanguages}
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent-blue" aria-hidden="true" />{" "}
                {t.cardContactNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
