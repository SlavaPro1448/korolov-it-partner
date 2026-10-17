import { ArrowRight, CheckCircle2, FileText, Inbox, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { CallScreen } from "@/components/visuals/ProjectVisual";
import { getDict, type Locale } from "@/i18n";

function FloatingCard({
  icon,
  title,
  sub,
  className,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  className: string;
  tone: "blue" | "violet";
}) {
  return (
    <div
      className={`absolute z-10 flex w-[230px] items-start gap-3 rounded-2xl border border-white/70 bg-white/90 p-3.5 shadow-[0_20px_40px_-18px_rgb(15_39_66/0.35)] backdrop-blur ${className}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${
          tone === "blue" ? "bg-accent-blue" : "bg-accent-violet"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold leading-snug text-brand">{title}</div>
        <div className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

export function Hero({ locale }: { locale: Locale }) {
  const t = getDict(locale).hero;
  return (
    <section className="hero-mesh relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="container-page grid items-center gap-14 py-16 md:py-24 lg:grid-cols-12 lg:py-28">
        <div className="fade-in-up lg:col-span-7">
          <div className="eyebrow-pill">
            <Sparkles className="h-3.5 w-3.5 text-accent-violet" aria-hidden="true" />
            {t.badge}
          </div>
          <h1
            id="hero-heading"
            className="display mt-6 text-[2.6rem] text-brand text-balance sm:text-5xl lg:text-[4.1rem] [overflow-wrap:anywhere]"
          >
            {t.headingLead} <span className="text-gradient-ai">{t.headingAccent}</span>{" "}
            {t.headingTail}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="h-14 w-full px-8 text-base sm:w-auto"
            >
              <a href="#kontakt">
                {t.ctaPrimary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 w-full border-brand/15 bg-white/70 px-7 text-base text-brand backdrop-blur sm:w-auto"
            >
              <Link to="/projekte">{t.ctaSecondary}</Link>
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {t.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2
                  className="h-4.5 w-4.5 shrink-0 text-accent-teal"
                  aria-hidden="true"
                />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden justify-center sm:flex lg:col-span-5" aria-hidden="true">
          <div className="absolute inset-x-6 top-10 bottom-6 rounded-[3rem] bg-ai-gradient opacity-20 blur-3xl" />
          <div className="relative py-6">
            <CallScreen />
            <FloatingCard
              tone="blue"
              icon={<Inbox className="h-4 w-4" />}
              title={t.floating.request}
              sub={t.floating.requestSub}
              className="float-slow -left-28 top-16 hidden md:flex"
            />
            <FloatingCard
              tone="violet"
              icon={<FileText className="h-4 w-4" />}
              title={t.floating.invoice}
              sub={t.floating.invoiceSub}
              className="float-slower -right-24 bottom-20 hidden md:flex"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
