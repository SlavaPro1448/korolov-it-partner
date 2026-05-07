import { COMPANY_DETAILS } from "@/config/legal";

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
    { "@type": "City", name: "Koeln" },
    { "@type": "AdministrativeArea", name: "Nordrhein-Westfalen" },
  ],
  ru: [
    { "@type": "City", name: "Леверкузен" },
    { "@type": "City", name: "Кельн" },
    { "@type": "AdministrativeArea", name: "Северный Рейн-Вестфалия" },
  ],
  uk: [
    { "@type": "City", name: "Леверкузен" },
    { "@type": "City", name: "Кельн" },
    { "@type": "AdministrativeArea", name: "Північний Рейн-Вестфалія" },
  ],
};

const descriptionByLocale: Record<SupportedLocale, string> = {
  de: "Korolov IT-Service unterstuetzt kleine Unternehmen bei Websites, E-Mail, Hosting und IT-Support in NRW.",
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
    telephone: COMPANY_DETAILS.phone,
    email: COMPANY_DETAILS.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_DETAILS.street,
      addressLocality: "Leverkusen",
      postalCode: COMPANY_DETAILS.zip,
      addressCountry: "DE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.0459,
      longitude: 7.0192,
    },
    areaServed: areaServedByLocale[locale],
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
    name: "Korolov IT-Service",
    description: descriptionByLocale[locale],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    email: COMPANY_DETAILS.email,
    telephone: COMPANY_DETAILS.phone,
    founder: {
      "@type": "Person",
      name: "Viacheslav Korolov",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_DETAILS.street,
      addressLocality: "Leverkusen",
      postalCode: COMPANY_DETAILS.zip,
      addressCountry: "DE",
    },
    areaServed: areaServedByLocale[locale],
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
