export type Case = {
  id: string;
  slug: string;
  client: string;
  industry: string;
  servicesProvided: string[];
  summary: { de: string; ru: string; uk: string };
  thumbnail?: string;
  /** Intrinsische Bildmaße gegen Layout-Shift (CLS). */
  thumbnailWidth?: number;
  thumbnailHeight?: number;
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
    id: "wupperstahl",
    slug: "wupperstahl",
    client: "Wupperstahl",
    industry: "Metallbau",
    servicesProvided: ["Website", "Hosting", "E-Mail"],
    summary: {
      de: "Webauftritt für einen Metallbau-Betrieb: Leistungen und Referenzen klar präsentiert, technisch sauber aufgesetzt — inklusive Hosting und geschäftlicher E-Mail.",
      ru: "Сайт для металлообрабатывающего предприятия: понятная презентация услуг и работ, аккуратная техническая база — включая хостинг и корпоративную почту.",
      uk: "Сайт для металообробного підприємства: зрозуміла презентація послуг і робіт, охайна технічна база — включно з хостингом і корпоративною поштою.",
    },
    thumbnail: "/cases/wupperstahl-thumb.jpg",
    thumbnailWidth: 1200,
    thumbnailHeight: 750,
    thumbnailStyle: "screenshot",
    // Vorläufige URL, bis wupperstahl.de live ist.
    liveUrl: "https://metal-ruddy.vercel.app",
    featured: true,
  },
  {
    id: "erbrecht-leverkusen",
    slug: "erbrecht-leverkusen",
    client: "Rechtsanwaltskanzlei Dr. Plutte & Mettlach-Plutte",
    industry: "Rechtsberatung",
    servicesProvided: ["Website-Redesign", "IT-Betreuung", "Kontaktformular"],
    summary: {
      de: "Laufende IT-Betreuung einer Anwaltskanzlei sowie komplettes Redesign-Konzept: moderner Webauftritt mit Online-Terminanfrage, Rückruf-Service und funktionierendem Kontaktformular.",
      ru: "Постоянная IT-поддержка адвокатской канцелярии и полный редизайн сайта: современный дизайн, онлайн-запись на приём, заказ обратного звонка и рабочая контактная форма.",
      uk: "Постійна IT-підтримка адвокатської канцелярії та повний редизайн сайту: сучасний дизайн, онлайн-запис на прийом, замовлення зворотного дзвінка та робоча контактна форма.",
    },
    thumbnail: "/cases/erbrecht-leverkusen-thumb.jpg",
    thumbnailWidth: 1200,
    thumbnailHeight: 750,
    thumbnailStyle: "screenshot",
    liveUrl: "/projects/erbrecht-leverkusen",
    featured: true,
  },
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
    thumbnailWidth: 1280,
    thumbnailHeight: 766,
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
