import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, X, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

type Locale = "de" | "ru" | "ua";

const navItemsByLocale: Record<Locale, Array<{ label: string; href: string }>> = {
  de: [
    { label: "Leistungen", href: "#leistungen" },
    { label: "Für wen", href: "#fuer-wen" },
    { label: "Preise", href: "#preise" },
    { label: "Ablauf", href: "#ablauf" },
    { label: "Referenzen", href: "#referenzen" },
    { label: "Über mich", href: "#ueber-mich" },
    { label: "Kontakt", href: "#kontakt" },
  ],
  ru: [
    { label: "Услуги", href: "#leistungen" },
    { label: "Для кого", href: "#fuer-wen" },
    { label: "Цены", href: "#preise" },
    { label: "Этапы", href: "#ablauf" },
    { label: "Кейсы", href: "#referenzen" },
    { label: "Обо мне", href: "#ueber-mich" },
    { label: "Контакты", href: "#kontakt" },
  ],
  ua: [
    { label: "Послуги", href: "#leistungen" },
    { label: "Для кого", href: "#fuer-wen" },
    { label: "Ціни", href: "#preise" },
    { label: "Етапи", href: "#ablauf" },
    { label: "Кейси", href: "#referenzen" },
    { label: "Про мене", href: "#ueber-mich" },
    { label: "Контакти", href: "#kontakt" },
  ],
};

const ctaByLocale: Record<Locale, string> = {
  de: "Kostenloses Erstgespräch",
  ru: "Бесплатная консультация",
  ua: "Безкоштовна консультація",
};

const menuOpenLabelByLocale: Record<Locale, string> = {
  de: "Hauptmenü öffnen",
  ru: "Открыть главное меню",
  ua: "Відкрити головне меню",
};

const menuCloseLabelByLocale: Record<Locale, string> = {
  de: "Menü schließen",
  ru: "Закрыть меню",
  ua: "Закрити меню",
};

const homeAriaLabelByLocale: Record<Locale, string> = {
  de: "Korolov IT-Service – zur Startseite",
  ru: "Korolov IT-Service – на главную",
  ua: "Korolov IT-Service – на головну",
};

const langSwitchAriaByLocale: Record<
  Locale,
  { de: string; ru: string; ua: string; group: string }
> = {
  de: {
    de: "Sprache auf Deutsch wechseln",
    ru: "Sprache auf Russisch wechseln",
    ua: "Sprache auf Ukrainisch wechseln",
    group: "Sprache wechseln",
  },
  ru: {
    de: "Переключить язык на немецкий",
    ru: "Переключить язык на русский",
    ua: "Переключить язык на украинский",
    group: "Переключение языка",
  },
  ua: {
    de: "Перемкнути мову на німецьку",
    ru: "Перемкнути мову на російську",
    ua: "Перемкнути мову на українську",
    group: "Перемикання мови",
  },
};

export function SiteHeader({
  locale = "de",
  basePath = "/",
}: {
  locale?: Locale;
  basePath?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const navItems = navItemsByLocale[locale];
  const cta = ctaByLocale[locale];
  const homePath = locale === "de" ? "/" : locale === "ru" ? "/ru" : "/ua";
  const langCopy = langSwitchAriaByLocale[locale];

  const switchLang = (to: "/" | "/ru" | "/ua") => {
    if (typeof window === "undefined") return;
    const y = window.scrollY;
    const hash = window.location.hash.replace(/^#/, "");
    setOpen(false);
    void navigate({
      to,
      hash: hash || undefined,
    }).then(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      });
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? "bg-background/85 backdrop-blur border-b border-border"
          : "bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="container-page flex h-16 md:h-20 items-center justify-between">
        <a
          href={homePath}
          className="flex items-center gap-2 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
          aria-label={homeAriaLabelByLocale[locale]}
        >
          <div
            className="h-9 w-9 rounded-lg bg-brand flex items-center justify-center text-brand-foreground font-bold"
            aria-hidden="true"
          >
            K
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-brand">Korolov</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              IT-Service
            </div>
          </div>
        </a>

        <nav
          className="hidden lg:flex items-center gap-7"
          aria-label={
            locale === "de"
              ? "Hauptnavigation"
              : locale === "ru"
                ? "Главная навигация"
                : "Головна навігація"
          }
        >
          {navItems.map((it) => (
            <a
              key={it.href}
              href={`${basePath}${it.href}`}
              className="text-sm text-foreground/80 hover:text-accent-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm px-1"
            >
              {it.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <div
            className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1"
            role="group"
            aria-label={langCopy.group}
          >
            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
            <button
              onClick={() => switchLang("/")}
              aria-label={langCopy.de}
              aria-current={locale === "de" ? "true" : undefined}
              className={`rounded-md px-2 py-1 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                locale === "de"
                  ? "bg-section text-brand font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              DE
            </button>
            <button
              onClick={() => switchLang("/ru")}
              aria-label={langCopy.ru}
              aria-current={locale === "ru" ? "true" : undefined}
              className={`rounded-md px-2 py-1 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                locale === "ru"
                  ? "bg-section text-brand font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              RU
            </button>
            <button
              onClick={() => switchLang("/ua")}
              aria-label={langCopy.ua}
              aria-current={locale === "ua" ? "true" : undefined}
              className={`rounded-md px-2 py-1 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                locale === "ua"
                  ? "bg-section text-brand font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              UA
            </button>
          </div>
          <Button asChild variant="brand" size="sm">
            <a href={`${basePath}#kontakt`}>{cta}</a>
          </Button>
        </div>

        <button
          className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? menuCloseLabelByLocale[locale] : menuOpenLabelByLocale[locale]}
          aria-expanded={open}
          aria-controls="mobile-nav"
          type="button"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="lg:hidden border-t border-border bg-background"
          aria-label={
            locale === "de"
              ? "Mobile Navigation"
              : locale === "ru"
                ? "Мобильная навигация"
                : "Мобільна навігація"
          }
        >
          <div className="container-page py-4 flex flex-col gap-1">
            {navItems.map((it) => (
              <a
                key={it.href}
                href={`${basePath}${it.href}`}
                onClick={() => setOpen(false)}
                className="px-2 py-2.5 rounded-md text-sm hover:bg-section focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                {it.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground px-2">
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              {locale === "de"
                ? "Beratung auf Deutsch, Russisch & Ukrainisch"
                : locale === "ru"
                  ? "Консультации на немецком, русском и украинском"
                  : "Консультації німецькою, російською та українською"}
            </div>
            <div
              className="mt-2 flex items-center gap-2 px-2"
              role="group"
              aria-label={langCopy.group}
            >
              <button
                onClick={() => switchLang("/")}
                aria-label={langCopy.de}
                aria-current={locale === "de" ? "true" : undefined}
                className={`rounded-md px-3 py-2 text-sm border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                  locale === "de"
                    ? "border-accent-blue text-accent-blue bg-accent-blue/5 font-medium"
                    : "border-border text-foreground/80 hover:bg-section"
                }`}
              >
                Deutsch
              </button>
              <button
                onClick={() => switchLang("/ru")}
                aria-label={langCopy.ru}
                aria-current={locale === "ru" ? "true" : undefined}
                className={`rounded-md px-3 py-2 text-sm border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                  locale === "ru"
                    ? "border-accent-blue text-accent-blue bg-accent-blue/5 font-medium"
                    : "border-border text-foreground/80 hover:bg-section"
                }`}
              >
                Русский
              </button>
              <button
                onClick={() => switchLang("/ua")}
                aria-label={langCopy.ua}
                aria-current={locale === "ua" ? "true" : undefined}
                className={`rounded-md px-3 py-2 text-sm border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                  locale === "ua"
                    ? "border-accent-blue text-accent-blue bg-accent-blue/5 font-medium"
                    : "border-border text-foreground/80 hover:bg-section"
                }`}
              >
                Українська
              </button>
            </div>
            <Button asChild variant="brand" className="mt-3">
              <a href={`${basePath}#kontakt`} onClick={() => setOpen(false)}>
                {cta}
              </a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
