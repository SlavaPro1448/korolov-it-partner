export type Case = {
  id: string;
  slug: string;
  client: string;
  industry: string;
  servicesProvided: string[];
  summary: { de: string; ru: string; uk: string };
  thumbnail?: string;
  /** "logo" = no crop, full visible content. "screenshot" = 16:9, object-cover. "icon" = small centred icon. */
  thumbnailStyle?: "logo" | "screenshot" | "icon";
  liveUrl?: string;
  testimonial?: {
    quote: { de: string; ru: string; uk: string };
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
      uk: "Професійний сайт для керуючої компанії з чіткою структурою та надійною технічною базою.",
    },
    thumbnail: "/client-logos/IconOnly_Transparent_NoBuffer.png",
    thumbnailStyle: "logo",
    liveUrl: "https://www.hausverwaltung-natalie-frank.de/",
    featured: true,
  },
  {
    id: "kanzlei-support",
    slug: "kanzlei-support",
    client: "Anwaltskanzlei (anonymisiert)",
    industry: "Rechtsberatung",
    servicesProvided: ["IT-Support", "Wartung", "E-Mail"],
    summary: {
      de: "Laufende technische Betreuung im Kanzlei-Alltag: E-Mail-Stabilität, Wartung und schnelle Unterstützung bei Störungen.",
      ru: "Регулярная техподдержка для офиса: стабильная почта, обслуживание и быстрые реакции на сбои.",
      uk: "Регулярна техпідтримка для офісу: стабільна пошта, обслуговування та швидка реакція на збої.",
    },
    thumbnailStyle: "icon",
    testimonial: {
      quote: {
        de: "Schnelle Reaktion, klare Kommunikation und verlässliche technische Unterstützung im Alltag.",
        ru: "Быстрая реакция, понятная коммуникация и надежная техническая поддержка в ежедневной работе.",
        uk: "Швидка реакція, зрозуміла комунікація та надійна технічна підтримка в щоденній роботі.",
      },
      author: "Anonym",
      role: "Office Management",
    },
    featured: true,
  },
];
