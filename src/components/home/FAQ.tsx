import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { getDict, type Locale } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

export function FAQ({ locale }: { locale: Locale }) {
  const t = getDict(locale).faq;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="py-20 md:py-28 bg-section scroll-mt-20"
      aria-labelledby="faq-heading"
    >
      <div className="container-page max-w-3xl">
        <SectionHeading
          headingId="faq-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
        <div className="mt-10 space-y-3">
          {t.items.map((f, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div key={f.q} className="card-soft overflow-hidden">
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left p-5 gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-md"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    type="button"
                  >
                    <span className="font-medium text-brand">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed"
                >
                  {f.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
