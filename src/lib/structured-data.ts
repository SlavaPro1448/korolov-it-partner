import { COMPANY } from "@/config/legal";

type SupportedLocale = "de" | "ru" | "uk";

type FaqItem = {
  question: string;
  answer: string;
};

type BreadcrumbItem = {
  name: string;
  item: string;
};

const SITE_URL = "https://korolov-it-service.de";

const areaServedByLocale: Record<SupportedLocale, Array<{ "@type": string; name: string }>> = {
  de: [
    { "@type": "City", name: "Leverkusen" },
    { "@type": "City", name: "Köln" },
    { "@type": "City", name: "Leichlingen" },
    { "@type": "City", name: "Burscheid" },
    { "@type": "City", name: "Bergisch Gladbach" },
    { "@type": "City", name: "Monheim am Rhein" },
    { "@type": "City", name: "Langenfeld" },
    { "@type": "AdministrativeArea", name: "Nordrhein-Westfalen" },
  ],
  ru: [
    { "@type": "City", name: "Леверкузен" },
    { "@type": "City", name: "Кёльн" },
    { "@type": "City", name: "Лайхлинген" },
    { "@type": "City", name: "Буршайд" },
    { "@type": "City", name: "Бергиш-Гладбах" },
    { "@type": "City", name: "Монхайм-на-Рейне" },
    { "@type": "City", name: "Лангенфельд" },
    { "@type": "AdministrativeArea", name: "Северный Рейн-Вестфалия" },
  ],
  uk: [
    { "@type": "City", name: "Леверкузен" },
    { "@type": "City", name: "Кельн" },
    { "@type": "City", name: "Ляйхлінген" },
    { "@type": "City", name: "Буршайд" },
    { "@type": "City", name: "Бергіш-Гладбах" },
    { "@type": "City", name: "Монгайм-на-Рейні" },
    { "@type": "City", name: "Лангенфельд" },
    { "@type": "AdministrativeArea", name: "Північний Рейн-Вестфалія" },
  ],
};

// Google Business Profile (Knowledge-Graph-ID, стабильная форма без сессионных параметров).
const SAME_AS = ["https://www.google.com/search?kgmid=/g/11zbfj169z&q=Korolov+IT+Service"];

const descriptionByLocale: Record<SupportedLocale, string> = {
  de: "Korolov IT-Service unterstützt kleine Unternehmen bei Websites, E-Mail, Hosting und IT-Support in NRW.",
  ru: "Korolov IT-Service помогает малому бизнесу с сайтами, почтой, хостингом и IT-поддержкой в NRW.",
  uk: "Korolov IT-Service допомагає малому бізнесу із сайтами, поштою, хостингом та IT-підтримкою в NRW.",
};

export function localBusinessSchema(locale: SupportedLocale = "de") {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Korolov IT-Service",
    description: descriptionByLocale[locale],
    image: `${SITE_URL}/og-image.jpg`,
    "@id": `${SITE_URL}/#business`,
    url: SITE_URL,
    telephone: COMPANY.phoneDisplay,
    email: COMPANY.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.street,
      addressLocality: "Leverkusen",
      postalCode: COMPANY.zip,
      addressCountry: "DE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.0459,
      longitude: 7.0192,
    },
    areaServed: areaServedByLocale[locale],
    sameAs: SAME_AS,
    founder: {
      "@type": "Person",
      name: "Viacheslav Korolov",
    },
    knowsLanguage: ["de", "ru", "uk"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  };
}

export function organizationSchema(locale: SupportedLocale = "de") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Korolov IT-Service",
    description: descriptionByLocale[locale],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    email: COMPANY.email,
    telephone: COMPANY.phoneDisplay,
    founder: {
      "@type": "Person",
      name: "Viacheslav Korolov",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.street,
      addressLocality: "Leverkusen",
      postalCode: COMPANY.zip,
      addressCountry: "DE",
    },
    areaServed: areaServedByLocale[locale],
    sameAs: SAME_AS,
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    serviceType: input.serviceType,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: areaServedByLocale.de,
    availableLanguage: ["de", "ru", "uk"],
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function webSiteSchema(locale: SupportedLocale = "de") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Korolov IT-Service",
    description: descriptionByLocale[locale],
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function itemListSchema(items: Array<{ name: string; description?: string; url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
      ...(item.url ? { url: item.url } : {}),
    })),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}
