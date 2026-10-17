import { useState, useEffect, type MouseEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

type Locale = "de" | "ru" | "uk";

// Leistungs-Seiten für das "Leistungen"-Dropdown (nur DE — die Landing-Pages sind deutschsprachig).
type MenuItem = { label: string; to: string; description: string };
const serviceMenuGroups: Array<{ label: string; items: MenuItem[] }> = [
  {
    label: "Websites & IT",
    items: [
      {
        label: "Webdesign Leverkusen",
        to: "/webdesign-leverkusen",
        description: "Websites ab 890 € Festpreis",
      },
      {
        label: "Website-Wartung & Pflege",
        to: "/website-wartung-leverkusen",
        description: "Ab 40 € im Monat",
      },
      {
        label: "IT-Support Leverkusen",
        to: "/it-support-leverkusen",
        description: "Schnelle Hilfe bei Störungen",
      },
      {
        label: "IT-Betreuung für kleine Unternehmen",
        to: "/it-betreuung-kleine-unternehmen",
        description: "Fester Ansprechpartner fürs Büro",
      },
      {
        label: "IT-Beratung Leverkusen",
        to: "/it-beratung-leverkusen",
        description: "Unabhängige Entscheidungshilfe",
      },
      {
        label: "IT-Service im Überblick",
        to: "/it-service-leverkusen",
        description: "Alle IT-Leistungen",
      },
    ],
  },
  {
    label: "KI & Apps",
    items: [
      {
        label: "KI-Telefonassistent",
        to: "/ki-telefonassistent-leverkusen",
        description: "Kein Anruf geht mehr verloren",
      },
      {
        label: "KI-Automatisierung",
        to: "/ki-automatisierung-kleine-unternehmen",
        description: "KI bereitet vor, Sie geben frei",
      },
      {
        label: "KI-Chatbot für die Website",
        to: "/chatbot-fuer-unternehmen",
        description: "Antworten aus Ihren Inhalten",
      },
      {
        label: "Telegram- & WhatsApp-Bots",
        to: "/telegram-bot-erstellen-lassen",
        description: "Anfragen und Abläufe im Messenger",
      },
      {
        label: "App-Entwicklung",
        to: "/app-entwicklung-leverkusen",
        description: "iPhone- und Android-Apps",
      },
    ],
  },
];

const navItemsByLocale: Record<Locale, Array<{ label: string; href: string }>> = {
  de: [
    { label: "Projekte", href: "/projekte" },
    { label: "Preise", href: "#preise" },
    { label: "Referenzen", href: "/referenzen" },
    { label: "Über mich", href: "#ueber-mich" },
    { label: "Kontakt", href: "#kontakt" },
  ],
  ru: [
    { label: "Услуги", href: "#leistungen" },
    { label: "ИИ", href: "#ki" },
    { label: "Проекты", href: "/projekte" },
    { label: "Цены", href: "#preise" },
    { label: "Кейсы", href: "#referenzen" },
    { label: "Обо мне", href: "#ueber-mich" },
    { label: "Контакты", href: "#kontakt" },
  ],
  uk: [
    { label: "Послуги", href: "#leistungen" },
    { label: "ШІ", href: "#ki" },
    { label: "Проєкти", href: "/projekte" },
    { label: "Ціни", href: "#preise" },
    { label: "Кейси", href: "#referenzen" },
    { label: "Про мене", href: "#ueber-mich" },
    { label: "Контакти", href: "#kontakt" },
  ],
};

const ctaByLocale: Record<Locale, string> = {
  de: "Kostenloses Erstgespräch",
  ru: "Бесплатная консультация",
  uk: "Безкоштовна консультація",
};

const menuOpenLabelByLocale: Record<Locale, string> = {
  de: "Hauptmenü öffnen",
  ru: "Открыть главное меню",
  uk: "Відкрити головне меню",
};

const menuCloseLabelByLocale: Record<Locale, string> = {
  de: "Menü schließen",
  ru: "Закрыть меню",
  uk: "Закрити меню",
};

const homeAriaLabelByLocale: Record<Locale, string> = {
  de: "Korolov IT-Service – zur Startseite",
  ru: "Korolov IT-Service – на главную",
  uk: "Korolov IT-Service – на головну",
};

const langSwitchAriaByLocale: Record<
  Locale,
  { de: string; ru: string; uk: string; group: string }
> = {
  de: {
    de: "Sprache auf Deutsch wechseln",
    ru: "Sprache auf Russisch wechseln",
    uk: "Sprache auf Ukrainisch wechseln",
    group: "Sprache wechseln",
  },
  ru: {
    de: "Переключить язык на немецкий",
    ru: "Переключить язык на русский",
    uk: "Переключить язык на украинский",
    group: "Переключение языка",
  },
  uk: {
    de: "Перемкнути мову на німецьку",
    ru: "Перемкнути мову на російську",
    uk: "Перемкнути мову на українську",
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
  const homePath = locale === "de" ? "/" : locale === "ru" ? "/ru" : "/uk";
  const langCopy = langSwitchAriaByLocale[locale];

  const switchLang = (to: "/" | "/ru" | "/uk") => {
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

  // Echte <a>-Links (crawlbar für hreflang-Discovery); Klick läuft trotzdem
  // über switchLang, damit die Scroll-Position erhalten bleibt.
  const langClick = (to: "/" | "/ru" | "/uk") => (e: MouseEvent) => {
    e.preventDefault();
    switchLang(to);
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
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-brand font-bold text-brand-foreground"
            aria-hidden="true"
          >
            <span className="absolute inset-0 bg-ai-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative">K</span>
          </div>
          <div className="whitespace-nowrap leading-tight">
            <div className="font-semibold text-brand">Korolov</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              IT-Service
            </div>
          </div>
        </a>

        <nav
          className="hidden lg:flex items-center gap-4 xl:gap-6"
          aria-label={
            locale === "de"
              ? "Hauptnavigation"
              : locale === "ru"
                ? "Главная навигация"
                : "Головна навігація"
          }
        >
          {locale === "de" && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent px-1 py-0 text-sm font-normal text-foreground/80 hover:bg-transparent hover:text-accent-blue focus:bg-transparent focus:text-accent-blue data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:text-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm">
                    Leistungen
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[640px] grid-cols-2 gap-2 p-3">
                      {serviceMenuGroups.map((g, gi) => (
                        <div key={g.label}>
                          <div className="flex items-center gap-2 px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <span
                              className={`h-2 w-2 rounded-full ${gi === 1 ? "bg-ai-gradient" : "bg-brand"}`}
                              aria-hidden="true"
                            />
                            {g.label}
                          </div>
                          <ul className="grid gap-0.5">
                            {g.items.map((s) => (
                              <li key={s.to}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to={s.to}
                                    className="block rounded-lg px-3 py-2 transition-colors hover:bg-section focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                                  >
                                    <span className="block text-sm font-medium text-brand">
                                      {s.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-muted-foreground">
                                      {s.description}
                                    </span>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          {navItems.map((it) => (
            <a
              key={it.href}
              href={it.href.startsWith("#") ? `${basePath}${it.href}` : it.href}
              className="whitespace-nowrap text-sm text-foreground/80 hover:text-accent-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm px-1"
            >
              {it.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          <div
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-1.5 py-1"
            role="group"
            aria-label={langCopy.group}
          >
            <Languages className="hidden h-3.5 w-3.5 xl:block" aria-hidden="true" />
            <a
              href="/"
              hrefLang="de"
              lang="de"
              onClick={langClick("/")}
              aria-label={langCopy.de}
              aria-current={locale === "de" ? "true" : undefined}
              className={`rounded-md px-2 py-1 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                locale === "de"
                  ? "bg-section text-brand font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              DE
            </a>
            <a
              href="/ru"
              hrefLang="ru"
              lang="ru"
              onClick={langClick("/ru")}
              aria-label={langCopy.ru}
              aria-current={locale === "ru" ? "true" : undefined}
              className={`rounded-md px-2 py-1 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                locale === "ru"
                  ? "bg-section text-brand font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              RU
            </a>
            <a
              href="/uk"
              hrefLang="uk"
              lang="uk"
              onClick={langClick("/uk")}
              aria-label={langCopy.uk}
              aria-current={locale === "uk" ? "true" : undefined}
              className={`rounded-md px-2 py-1 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                locale === "uk"
                  ? "bg-section text-brand font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              UA
            </a>
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
            {locale === "de" && (
              <>
                {serviceMenuGroups.map((g) => (
                  <div key={g.label} className="flex flex-col">
                    <div className="px-2 pt-2 pb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {g.label}
                    </div>
                    {g.items.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        onClick={() => setOpen(false)}
                        className="px-4 py-2.5 rounded-md text-sm hover:bg-section focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                ))}
                <div className="my-1 border-t border-border" aria-hidden="true" />
              </>
            )}
            {navItems.map((it) => (
              <a
                key={it.href}
                href={it.href.startsWith("#") ? `${basePath}${it.href}` : it.href}
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
              <a
                href="/"
                hrefLang="de"
                lang="de"
                onClick={langClick("/")}
                aria-label={langCopy.de}
                aria-current={locale === "de" ? "true" : undefined}
                className={`rounded-md px-3 py-2 text-sm border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                  locale === "de"
                    ? "border-accent-blue text-accent-blue bg-accent-blue/5 font-medium"
                    : "border-border text-foreground/80 hover:bg-section"
                }`}
              >
                Deutsch
              </a>
              <a
                href="/ru"
                hrefLang="ru"
                lang="ru"
                onClick={langClick("/ru")}
                aria-label={langCopy.ru}
                aria-current={locale === "ru" ? "true" : undefined}
                className={`rounded-md px-3 py-2 text-sm border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                  locale === "ru"
                    ? "border-accent-blue text-accent-blue bg-accent-blue/5 font-medium"
                    : "border-border text-foreground/80 hover:bg-section"
                }`}
              >
                Русский
              </a>
              <a
                href="/uk"
                hrefLang="uk"
                lang="uk"
                onClick={langClick("/uk")}
                aria-label={langCopy.uk}
                aria-current={locale === "uk" ? "true" : undefined}
                className={`rounded-md px-3 py-2 text-sm border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
                  locale === "uk"
                    ? "border-accent-blue text-accent-blue bg-accent-blue/5 font-medium"
                    : "border-border text-foreground/80 hover:bg-section"
                }`}
              >
                Українська
              </a>
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
