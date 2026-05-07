export type Case = {
  id: string;
  slug: string;
  client: string;
  industry: string;
  servicesProvided: string[];
  summary: { de: string; ru: string; ua: string };
  image: string;
  thumbnail: string;
  /** "logo" = keine Beschneidung, voller sichtbarer Inhalt (z. B. Claim unter dem Logo). "screenshot" = 16:9, object-cover. */
  thumbnailStyle?: "logo" | "screenshot";
  liveUrl?: string;
  testimonial?: {
    quote: { de: string; ru: string; ua: string };
    author: string;
    role: string;
  };
  featured: boolean;
};

export const cases: Case[] = [
  {
    id: "hausverwaltung-frank",
    slug: "hausverwaltung-frank",
    client: "Hausverwaltung Natalie Frank",
    industry: "Immobilienverwaltung",
    servicesProvided: ["Website", "Hosting", "E-Mail"],
    summary: {
      de: "Professioneller Webauftritt für eine Immobilienverwaltung mit klarer Struktur und zuverlässiger technischer Basis.",
      ru: "Профессиональный сайт для управляющей компании с понятной структурой и надежной технической базой.",
      ua: "Професійний сайт для керуючої компанії з чіткою структурою та надійною технічною базою.",
    },
    image: "/client-logos/IconOnly_Transparent_NoBuffer.png",
    thumbnail: "/client-logos/IconOnly_Transparent_NoBuffer.png",
    thumbnailStyle: "logo",
    liveUrl: "https://www.hausverwaltung-natalie-frank.de/",
    featured: true,
  },
  {
    id: "kanzlei-support",
    slug: "kanzlei-support",
    client: "Kanzlei (anonymisiert)",
    industry: "Rechtsberatung",
    servicesProvided: ["IT-Support", "Wartung", "E-Mail"],
    summary: {
      de: "Laufende technische Betreuung im Kanzlei-Alltag: E-Mail-Stabilität, Wartung und schnelle Unterstützung bei Störungen.",
      ru: "Регулярная техподдержка для офиса: стабильная почта, обслуживание и быстрые реакции на сбои.",
      ua: "Регулярна техпідтримка для офісу: стабільна пошта, обслуговування та швидка реакція на збої.",
    },
    image: "/cases/kanzlei-support-full.jpg",
    thumbnail: "/cases/kanzlei-support-thumb.jpg",
    testimonial: {
      quote: {
        de: "Schnelle Reaktion, klare Kommunikation und verlässliche technische Unterstützung im Alltag.",
        ru: "Быстрая реакция, понятная коммуникация и надежная техническая поддержка в ежедневной работе.",
        ua: "Швидка реакція, зрозуміла комунікація та надійна технічна підтримка в щоденній роботі.",
      },
      author: "Anonym",
      role: "Office Management",
    },
    featured: false,
  },
  {
    id: "lokaler-service",
    slug: "lokaler-service",
    client: "Lokaler Dienstleister (in Vorbereitung)",
    industry: "Lokale Dienstleistungen",
    servicesProvided: ["Website", "SEO-Basis"],
    summary: {
      de: "Neuer Webauftritt zur lokalen Sichtbarkeit und klaren Darstellung der angebotenen Leistungen.",
      ru: "Новый сайт для локальной видимости и понятной презентации услуг.",
      ua: "Новий сайт для локальної видимості та чіткої презентації послуг.",
    },
    image: "/cases/lokaler-service-full.jpg",
    thumbnail: "/cases/lokaler-service-thumb.jpg",
    featured: false,
  },
];

export const clientLogos = [
  {
    id: "hausverwaltung-frank",
    name: "Hausverwaltung Natalie Frank",
    src: "/client-logos/IconOnly_Transparent_NoBuffer.png",
  },
  { id: "kanzlei", name: "Kanzlei", src: "/client-logos/kanzlei.svg" },
  { id: "praxis", name: "Praxis", src: "/client-logos/praxis.svg" },
  { id: "handwerk", name: "Handwerk", src: "/client-logos/handwerk.svg" },
  { id: "service", name: "Servicebetrieb", src: "/client-logos/servicebetrieb.svg" },
  { id: "beratung", name: "Beratungsbuero", src: "/client-logos/beratungsbuero.svg" },
];
