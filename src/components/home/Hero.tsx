import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Languages,
  LifeBuoy,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Fragment, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { getDict, type Locale } from "@/i18n";

function MiniRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "blue" | "teal";
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5">
      <div className="flex items-center gap-2.5 text-sm text-foreground/80">
        <span className={tone === "blue" ? "text-accent-blue" : "text-accent-teal"}>{icon}</span>
        {label}
      </div>
      <span className="text-xs font-medium text-foreground/70">{value}</span>
    </div>
  );
}

function ConsultText({
  template,
  langs,
}: {
  template: string;
  langs: { de: string; ru: string; uk: string };
}) {
  const parts = template.split(/(\{de\}|\{ru\}|\{uk\})/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part === "{de}") return <span key={i} className="font-medium">{langs.de}</span>;
        if (part === "{ru}") return <span key={i} className="font-medium">{langs.ru}</span>;
        if (part === "{uk}") return <span key={i} className="font-medium">{langs.uk}</span>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function HeroCard({ card }: { card: ReturnType<typeof getDict>["hero"]["card"] }) {
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-4 bg-gradient-to-tr from-accent-blue/10 to-transparent rounded-3xl blur-2xl" />
      <div className="relative card-soft p-6 md:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="text-xs text-muted-foreground">korolov-it-service.de</div>
        </div>
        <div className="mt-5 space-y-3">
          <MiniRow
            icon={<Globe className="h-4 w-4" />}
            label={card.site.label}
            value={card.site.value}
            tone="teal"
          />
          <MiniRow
            icon={<Mail className="h-4 w-4" />}
            label={card.mail.label}
            value={card.mail.value}
            tone="blue"
          />
          <MiniRow
            icon={<ShieldCheck className="h-4 w-4" />}
            label={card.security.label}
            value={card.security.value}
            tone="teal"
          />
          <MiniRow
            icon={<LifeBuoy className="h-4 w-4" />}
            label={card.support.label}
            value={card.support.value}
            tone="blue"
          />
        </div>
        <div className="mt-6 p-4 rounded-xl bg-section">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Languages className="h-3.5 w-3.5" /> {card.consultLabel}
          </div>
          <div className="mt-1 text-sm text-foreground">
            <ConsultText template={card.consultText} langs={card.consultLanguages} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero({ locale }: { locale: Locale }) {
  const t = getDict(locale).hero;
  return (
    <section className="hero-grid-bg relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="container-page py-20 md:py-28 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
            {t.badge}
          </div>
          <h1
            id="hero-heading"
            className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-brand leading-[1.05]"
          >
            {t.heading}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {t.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base bg-accent-blue hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/30"
            >
              <a href="#kontakt">
                {t.ctaPrimary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="default" className="w-full sm:w-auto">
              <a href="#leistungen">{t.ctaSecondary}</a>
            </Button>
          </div>
          <ul className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl">
            {t.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2
                  className="h-5 w-5 text-accent-teal shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5 fade-in-up">
          <HeroCard card={t.card} />
        </div>
      </div>
    </section>
  );
}
