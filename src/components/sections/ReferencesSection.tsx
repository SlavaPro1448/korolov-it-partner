import { useMemo, useState } from "react";
import { ArrowRight, Briefcase, Quote } from "lucide-react";
import type { Case } from "@/data/cases";
import { cases } from "@/data/cases";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Locale = "de" | "ru" | "uk";

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
  },
  ru: {
    eyebrow: "Референсы",
    title: "Избранные проекты",
    subtitle: "Примеры из предыдущих сотрудничеств.",
    openProject: "Открыть проект",
    moreOnRequest: "Другие проекты — по запросу",
    testimonialsTitle: "Отзывы клиентов",
    testimonialsSubtitle: "Публикуются только после согласования.",
  },
  uk: {
    eyebrow: "Референси",
    title: "Вибрані проєкти",
    subtitle: "Приклади з попередньої співпраці.",
    openProject: "Переглянути проєкт",
    moreOnRequest: "Інші проєкти — за запитом",
    testimonialsTitle: "Відгуки клієнтів",
    testimonialsSubtitle: "Публікуються тільки після погодження.",
  },
};

type CaseCardProps = {
  item: Case;
  locale: Locale;
  openLabel: string;
};

function CaseCard({ item, locale, openLabel }: CaseCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const isIcon = item.thumbnailStyle === "icon";
  const isLogo = item.thumbnailStyle === "logo";

  return (
    <article className="card-soft p-7 flex flex-col">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-border/60 bg-section",
          isIcon ? "aspect-[3/2]" : isLogo ? "aspect-[4/3] sm:aspect-[5/4]" : "aspect-video",
        )}
      >
        {isIcon ? (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <Briefcase className="h-16 w-16 text-muted-foreground/40" />
          </div>
        ) : !hasImageError && item.thumbnail ? (
          isLogo ? (
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
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <Briefcase className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {item.industry}
        </div>
        <h3 className="mt-1 text-lg font-semibold text-brand">{item.client}</h3>
      </div>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
        {item.summary[locale]}
      </p>

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
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${openLabel}: ${item.client}`}
          >
            {openLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      )}
    </article>
  );
}

function TestimonialsCarousel({ locale }: { locale: Locale }) {
  const testimonials = useMemo(() => cases.filter((item) => item.testimonial), []);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="mt-14">
      <h3 id="testimonials-heading" className="text-2xl md:text-3xl font-bold text-brand">
        {copy[locale].testimonialsTitle}
      </h3>
      <p className="mt-3 text-muted-foreground">{copy[locale].testimonialsSubtitle}</p>
      <Carousel
        className="mt-8 px-10"
        opts={{ loop: testimonials.length > 1 }}
        aria-labelledby="testimonials-heading"
      >
        <CarouselContent>
          {testimonials.map((item) => (
            <CarouselItem key={`testimonial-${item.id}`}>
              <figure className="card-soft p-6 md:p-7">
                <Quote className="h-5 w-5 text-accent-blue" aria-hidden="true" />
                <blockquote className="mt-4 text-foreground/90 leading-relaxed">
                  {item.testimonial?.quote[locale]}
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <div className="font-medium text-brand">{item.testimonial?.author}</div>
                  <div className="text-muted-foreground">{item.testimonial?.role}</div>
                </figcaption>
              </figure>
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

export function ReferencesSection({ locale }: { locale: Locale }) {
  const displayedCases = useMemo(() => cases.filter((item) => item.featured), []);

  return (
    <section
      id="referenzen"
      className="py-20 md:py-28 bg-section scroll-mt-20"
      aria-labelledby="references-heading"
    >
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="text-sm font-medium text-accent-blue uppercase tracking-wider">
            {copy[locale].eyebrow}
          </div>
          <h2
            id="references-heading"
            className="mt-3 text-3xl md:text-4xl font-bold text-brand leading-tight"
          >
            {copy[locale].title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{copy[locale].subtitle}</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {displayedCases.map((item) => (
            <CaseCard
              key={item.id}
              item={item}
              locale={locale}
              openLabel={copy[locale].openProject}
            />
          ))}
        </div>

        <TestimonialsCarousel locale={locale} />
      </div>
    </section>
  );
}
