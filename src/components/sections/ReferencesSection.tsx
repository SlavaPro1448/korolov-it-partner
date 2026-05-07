import { useMemo, useState } from "react";
import { ArrowRight, ImageOff, Quote } from "lucide-react";
import type { Case } from "@/data/cases";
import { cases, clientLogos } from "@/data/cases";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Locale = "de" | "ru" | "ua";

const copy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    openProject: string;
    moreOnRequest: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    logoTitle: string;
    logoSubtitle: string;
  }
> = {
  de: {
    eyebrow: "Referenzen",
    title: "Ausgewählte Projekte",
    subtitle: "Beispiele aus der bisherigen Zusammenarbeit.",
    openProject: "Projekt ansehen",
    moreOnRequest: "Weitere Projekte auf Anfrage",
    testimonialsTitle: "Kundenstimmen",
    testimonialsSubtitle: "Freigegebene Rückmeldungen aus der Zusammenarbeit.",
    logoTitle: "Kunden",
    logoSubtitle: "Ausgewählte Logos (Platzhalter bis zur finalen Freigabe).",
  },
  ru: {
    eyebrow: "Референсы",
    title: "Избранные проекты",
    subtitle: "Примеры из предыдущих сотрудничеств.",
    openProject: "Открыть проект",
    moreOnRequest: "Другие проекты — по запросу",
    testimonialsTitle: "Отзывы клиентов",
    testimonialsSubtitle: "Публикуются только после согласования.",
    logoTitle: "Клиенты",
    logoSubtitle: "Выборка логотипов (временные плейсхолдеры до финального согласования).",
  },
  ua: {
    eyebrow: "Референси",
    title: "Вибрані проєкти",
    subtitle: "Приклади з попередньої співпраці.",
    openProject: "Переглянути проєкт",
    moreOnRequest: "Інші проєкти — за запитом",
    testimonialsTitle: "Відгуки клієнтів",
    testimonialsSubtitle: "Публікуються тільки після погодження.",
    logoTitle: "Клієнти",
    logoSubtitle: "Добірка логотипів (тимчасові плейсхолдери до фінального погодження).",
  },
};

type CaseCardProps = {
  item: Case;
  locale: Locale;
  openLabel: string;
};

function CaseCard({ item, locale, openLabel }: CaseCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const isLogoThumb = item.thumbnailStyle !== "screenshot";

  return (
    <article className="card-soft p-7 flex flex-col">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-border/60 bg-section",
          isLogoThumb ? "aspect-[4/3] sm:aspect-[5/4]" : "aspect-video",
        )}
      >
        {!hasImageError && item.thumbnail ? (
          isLogoThumb ? (
            <div className="absolute inset-0 flex min-h-0 min-w-0 items-center justify-center p-4 sm:p-6">
              <img
                src={item.thumbnail}
                loading="lazy"
                alt={`${item.client} – ${item.industry}`}
                className="block h-auto max-h-full w-auto max-w-full object-contain object-center"
                onError={() => setHasImageError(true)}
              />
            </div>
          ) : (
            <img
              src={item.thumbnail}
              loading="lazy"
              alt={`${item.client} – ${item.industry}`}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setHasImageError(true)}
            />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
            <span className="text-sm">Bild folgt</span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{item.industry}</div>
        <h3 className="mt-1 text-lg font-semibold text-brand">{item.client}</h3>
      </div>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{item.summary[locale]}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.servicesProvided.map((service) => (
          <span
            key={`${item.id}-${service}`}
            className="text-xs px-2.5 py-1 rounded-full bg-section text-foreground/70 border border-border"
          >
            {service}
          </span>
        ))}
      </div>

      {item.liveUrl && (
        <Button asChild variant="outline" className="mt-5 self-start">
          <a href={item.liveUrl} target="_blank" rel="noreferrer">
            {openLabel} <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      )}
    </article>
  );
}

function TestimonialsCarousel({ locale }: { locale: Locale }) {
  const testimonials = useMemo(
    () => cases.filter((item) => item.featured && item.testimonial),
    [],
  );

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="mt-14">
      <h3 className="text-2xl md:text-3xl font-bold text-brand">{copy[locale].testimonialsTitle}</h3>
      <p className="mt-3 text-muted-foreground">{copy[locale].testimonialsSubtitle}</p>
      <Carousel className="mt-8 px-10" opts={{ loop: testimonials.length > 1 }}>
        <CarouselContent>
          {testimonials.map((item) => (
            <CarouselItem key={`testimonial-${item.id}`}>
              <div className="card-soft p-6 md:p-7">
                <Quote className="h-5 w-5 text-accent-blue" />
                <p className="mt-4 text-foreground/90 leading-relaxed">"{item.testimonial?.quote[locale]}"</p>
                <div className="mt-5 text-sm">
                  <div className="font-medium text-brand">{item.testimonial?.author}</div>
                  <div className="text-muted-foreground">{item.testimonial?.role}</div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {testimonials.length > 1 && (
          <>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </>
        )}
      </Carousel>
    </div>
  );
}

function LogoCloud({ locale }: { locale: Locale }) {
  return (
    <div className="mt-14">
      <h3 className="text-2xl md:text-3xl font-bold text-brand">{copy[locale].logoTitle}</h3>
      <p className="mt-3 text-muted-foreground">{copy[locale].logoSubtitle}</p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {clientLogos.map((logo) => (
          <div key={logo.id} className="card-soft p-5 flex items-center justify-center min-h-24">
            <img
              src={logo.src}
              loading="lazy"
              alt={logo.name}
              className="max-h-10 w-auto object-contain grayscale opacity-75"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReferencesSection({ locale }: { locale: Locale }) {
  const featuredCases = useMemo(() => cases.filter((item) => item.featured), []);
  const displayedCases = featuredCases.length > 0 ? featuredCases : cases.slice(0, 1);
  const showMoreOnRequest = displayedCases.length <= 1;

  return (
    <section id="referenzen" className="py-20 md:py-28 bg-section scroll-mt-20">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">
            {copy[locale].eyebrow}
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight">
            {copy[locale].title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{copy[locale].subtitle}</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {displayedCases.map((item) => (
            <CaseCard key={item.id} item={item} locale={locale} openLabel={copy[locale].openProject} />
          ))}
        </div>

        {showMoreOnRequest && (
          <div className="mt-6 text-sm text-muted-foreground">{copy[locale].moreOnRequest}</div>
        )}

        <TestimonialsCarousel locale={locale} />
        <LogoCloud locale={locale} />
      </div>
    </section>
  );
}
