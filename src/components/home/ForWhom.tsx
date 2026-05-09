import { Building2, HardHat, Languages, Scale, UserCheck, Users } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { getDict, type Locale } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

const ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  UserCheck,
  HardHat,
  Building2,
  Scale,
  Users,
  Languages,
];

export function ForWhom({ locale }: { locale: Locale }) {
  const t = getDict(locale).forWhom;
  return (
    <section
      id="fuer-wen"
      className="py-20 md:py-28 scroll-mt-20"
      aria-labelledby="forwhom-heading"
    >
      <div className="container-page">
        <SectionHeading
          headingId="forwhom-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.items.map((a, i) => {
            const Icon = ICONS[i];
            return (
              <div key={a.title} className="card-soft p-6">
                <div
                  className="h-10 w-10 rounded-lg bg-section text-accent-teal flex items-center justify-center"
                  aria-hidden="true"
                >
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <h3 className="mt-4 font-semibold text-brand">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
