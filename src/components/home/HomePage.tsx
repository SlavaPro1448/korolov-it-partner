import { JsonLd } from "@/components/seo/JsonLd";
import { ReferencesSection } from "@/components/sections/ReferencesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDict, type Locale } from "@/i18n";
import {
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  organizationSchema,
  webSiteSchema,
} from "@/lib/structured-data";

import { About } from "./About";
import { Contact } from "./Contact";
import { FAQ } from "./FAQ";
import { ForWhom } from "./ForWhom";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { Problem } from "./Problem";
import { Process } from "./Process";
import { Services } from "./Services";

const SITE_URL = "https://korolov-it-service.de";

const BREADCRUMB_NAME: Record<Locale, string> = {
  de: "Startseite",
  ru: "Главная",
  uk: "Головна",
};

const BASE_PATH: Record<Locale, string> = {
  de: "",
  ru: "/ru",
  uk: "/uk",
};

export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const faqItems = dict.faq.items.map((item) => ({ question: item.q, answer: item.a }));
  const breadcrumbUrl = `${SITE_URL}${BASE_PATH[locale] || "/"}`;
  const basePath = BASE_PATH[locale];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={localBusinessSchema(locale)} />
      <JsonLd data={organizationSchema(locale)} />
      <JsonLd data={webSiteSchema(locale)} />
      <JsonLd data={faqPageSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([{ name: BREADCRUMB_NAME[locale], item: breadcrumbUrl }])}
      />
      <SiteHeader locale={locale} basePath={basePath || undefined} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero locale={locale} />
        <Problem locale={locale} />
        <Services locale={locale} />
        <ForWhom locale={locale} />
        <Pricing locale={locale} />
        <Process locale={locale} />
        <ReferencesSection locale={locale} />
        <About locale={locale} />
        <FAQ locale={locale} />
        <Contact locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
