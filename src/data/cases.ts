/**
 * Langform-Inhalt für die eigene Projektseite unter /referenzen/<slug>.
 * Nur für freigegebene Projekte mit ausreichend Substanz — anonymisierte
 * Referenzen bleiben Kundenstimme auf der Übersicht.
 */
export type CaseDetail = {
  path: string;
  eyebrow: string;
  h1: string;
  lede: string;
  situationTitle: string;
  situation: string[];
  solutionTitle: string;
  solution: Array<{ title: string; text: string }>;
  resultTitle: string;
  result: string[];
  factsTitle: string;
  facts: Array<{ label: string; value: string }>;
  ctaTitle: string;
  ctaText: string;
  related: Array<{ label: string; to: string }>;
  seo: { title: string; description: string; keywords: string };
};

export type Case = {
  id: string;
  slug: string;
  client: string;
  industry: string;
  servicesProvided: string[];
  detail?: CaseDetail;
  summary: { de: string; ru: string; uk: string };
  thumbnail?: string;
  /** Intrinsische Bildmaße gegen Layout-Shift (CLS). */
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  /** "logo" = no crop, full visible content. "screenshot" = 16:9, object-cover. "icon" = small centred icon. */
  thumbnailStyle?: "logo" | "screenshot" | "icon";
  liveUrl?: string;
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
    liveUrl: "https://www.wupperstahl.de/",
    detail: {
      path: "/referenzen/wupperstahl",
      eyebrow: "Projekt · Metallbau",
      h1: "Wupperstahl: Webauftritt für einen Metallbau-Betrieb",
      lede: "Website, Hosting und geschäftliche E-Mail für einen Metallbaubetrieb aus Radevormwald — Leistungen und Referenzen klar präsentiert, technisch aus einer Hand aufgesetzt.",
      situationTitle: "Ausgangslage",
      situation: [
        "Wupperstahl fertigt Treppen, Geländer, Handläufe und Stahlbau-Konstruktionen. Das ist ein Geschäft, in dem Auftraggeber — Architekten, Bauherren, Generalunternehmer — vor der ersten Anfrage prüfen, ob ein Betrieb die gesuchte Leistung überhaupt anbietet und wie sauber gearbeitet wird.",
        "Ohne auffindbaren Webauftritt findet diese Prüfung schlicht nicht statt: Der Betrieb taucht in der Vorauswahl nicht auf, und ausgeführte Arbeiten, die eigentlich das beste Verkaufsargument sind, bleiben unsichtbar.",
      ],
      solutionTitle: "Umsetzung",
      solution: [
        {
          title: "Leistungen nach Gewerken gegliedert",
          text: "Treppen, Geländer, Handläufe und Stahlbau erhielten jeweils einen eigenen, verständlichen Abschnitt — so finden Interessenten die gesuchte Leistung sofort und Google kann die Seite passenden Anfragen zuordnen.",
        },
        {
          title: "Referenzen als Beweisführung",
          text: "Fotos ausgeführter Arbeiten wurden so eingebunden, dass sie auf dem Smartphone schnell laden — Bildqualität ohne die Ladezeiten, die große Kamerabilder sonst verursachen.",
        },
        {
          title: "Technische Basis komplett eingerichtet",
          text: "Eigene Domain, SSL-Verschlüsselung, Hosting und geschäftliche E-Mail-Adressen wurden vollständig aufgesetzt und übergeben — statt privater Freemail-Adresse im Kundenkontakt.",
        },
        {
          title: "Mobil zuerst",
          text: "Der Auftritt wurde für das Smartphone entworfen und erst danach auf den Desktop übertragen, inklusive direkt anwählbarer Telefonnummer.",
        },
      ],
      resultTitle: "Ergebnis",
      result: [
        "Der Betrieb hat einen eigenständigen Auftritt unter eigener Domain, auf den er in Angeboten und im Erstkontakt verweisen kann. Leistungsumfang und ausgeführte Arbeiten sind ohne Rückfrage einsehbar.",
        "Domain, Hosting und E-Mail liegen bei einem Ansprechpartner statt verteilt auf mehrere Anbieter — Änderungen und Störungen laufen über eine Stelle.",
      ],
      factsTitle: "Projektdaten",
      facts: [
        { label: "Branche", value: "Metallbau · Radevormwald" },
        { label: "Leistungen", value: "Website, Hosting, geschäftliche E-Mail" },
        { label: "Schwerpunkte", value: "Treppen, Geländer, Handläufe, Stahlbau" },
        { label: "Status", value: "Live unter eigener Domain" },
      ],
      ctaTitle: "Ähnliches Projekt für Ihren Betrieb?",
      ctaText:
        "Ob Metallbau, Elektro oder Sanitär — schildern Sie kurz Ihr Gewerk und Ihr Einsatzgebiet. Sie erhalten eine ehrliche Einschätzung und ein Festpreis-Angebot.",
      related: [
        { label: "Website für Handwerker", to: "/website-fuer-handwerker-leverkusen" },
        { label: "Webdesign in Leverkusen", to: "/webdesign-leverkusen" },
        { label: "Website-Wartung & Pflege", to: "/website-wartung-leverkusen" },
      ],
      seo: {
        title: "Referenz Wupperstahl – Website für Metallbau-Betrieb | Korolov IT-Service",
        description:
          "Projektbericht Wupperstahl: Webauftritt für einen Metallbau-Betrieb mit Leistungen nach Gewerken, Referenzgalerie, Hosting und geschäftlicher E-Mail — umgesetzt von Korolov IT-Service.",
        keywords:
          "Referenz Metallbau Website, Website Metallbaubetrieb, Webdesign Handwerk Referenz, Wupperstahl, Homepage Stahlbau",
      },
    },
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
    detail: {
      path: "/referenzen/erbrecht-leverkusen",
      eyebrow: "Projekt · Rechtsberatung",
      h1: "Anwaltskanzlei Leverkusen: laufende IT-Betreuung und Redesign-Konzept",
      lede: "Technische Betreuung einer Leverkusener Kanzlei im Alltag — dazu ein vollständig ausgearbeitetes Redesign-Konzept mit Online-Terminanfrage, Rückruf-Service und funktionierendem Kontaktformular.",
      situationTitle: "Ausgangslage",
      situation: [
        "Mandanten kommen mit einem Anliegen und wenig Geduld auf eine Kanzlei-Website. Sie prüfen in kurzer Zeit, ob das eigene Rechtsgebiet bearbeitet wird und wie ein Termin zustande kommt. Bleibt das unklar, greifen sie zum Telefon — oder zur nächsten Kanzlei.",
        "Parallel dazu läuft der Kanzleialltag: E-Mail muss zuverlässig funktionieren, Störungen dürfen keine Termine kosten. Beide Themen — Außenauftritt und laufende Technik — hingen hier zusammen und wurden gemeinsam angegangen.",
      ],
      solutionTitle: "Umsetzung",
      solution: [
        {
          title: "Rechtsgebiete verständlich aufbereitet",
          text: "Erbrecht, Arbeitsrecht und Zivilrecht erhielten eigene Abschnitte in laienverständlicher Sprache — damit Mandanten sich selbst einordnen können, bevor sie anrufen.",
        },
        {
          title: "Online-Terminanfrage",
          text: "Ein strukturiertes Formular erfasst Anliegen, Rechtsgebiet und Erreichbarkeit. Das Sekretariat erhält den Fall vorsortiert und schriftlich statt in mehreren Rückrufen.",
        },
        {
          title: "Rückruf-Service",
          text: "Für kurze Anliegen ein separater, bewusst niedrigschwelliger Weg — Name, Nummer, Wunschzeit. Mehr wird nicht abgefragt.",
        },
        {
          title: "Pflichtangaben und Datenschutz technisch sauber",
          text: "Impressum und Datenschutzerklärung von jeder Seite erreichbar eingebunden, Formulare datensparsam, keine überflüssigen Drittanbieter-Skripte.",
        },
        {
          title: "Laufende IT-Betreuung",
          text: "Parallel zum Konzept die alltägliche Technik: E-Mail-Stabilität, Wartung und schnelle Reaktion bei Störungen.",
        },
      ],
      resultTitle: "Ergebnis",
      result: [
        "Das Redesign liegt als vollständig umgesetztes, klickbares Konzept vor — nicht als Foliensatz. Jeder Bereich, von der Terminanfrage bis zum Impressum, lässt sich real ausprobieren.",
        "Die laufende IT-Betreuung deckt den Alltag ab: funktionierende E-Mail, Wartung und ein fester Ansprechpartner bei Störungen.",
      ],
      factsTitle: "Projektdaten",
      facts: [
        { label: "Branche", value: "Rechtsberatung · Leverkusen" },
        { label: "Leistungen", value: "Redesign-Konzept, IT-Betreuung, Kontaktformular" },
        { label: "Rechtsgebiete", value: "Erbrecht, Arbeitsrecht, Zivilrecht" },
        { label: "Status", value: "Konzept live ansehbar, IT-Betreuung laufend" },
      ],
      ctaTitle: "Neuer Auftritt für Ihre Kanzlei?",
      ctaText:
        "Nennen Sie kurz Ihre Rechtsgebiete und was Sie am aktuellen Auftritt stört — Sie erhalten eine ehrliche Einschätzung und ein Festpreis-Angebot.",
      related: [
        { label: "Website für Anwaltskanzleien", to: "/website-fuer-anwaltskanzlei-leverkusen" },
        { label: "Webdesign in Leverkusen", to: "/webdesign-leverkusen" },
        { label: "IT-Betreuung für kleine Unternehmen", to: "/it-betreuung-kleine-unternehmen" },
      ],
      seo: {
        title: "Referenz Anwaltskanzlei Leverkusen – Redesign & IT-Betreuung | Korolov IT-Service",
        description:
          "Projektbericht: Redesign-Konzept für eine Leverkusener Anwaltskanzlei mit Online-Terminanfrage und Rückruf-Service, dazu laufende IT-Betreuung im Kanzleialltag.",
        keywords:
          "Referenz Kanzlei Website, Anwaltskanzlei Webdesign Referenz, Kanzlei Redesign Leverkusen, IT-Betreuung Anwaltskanzlei",
      },
    },
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
    detail: {
      path: "/referenzen/hausverwaltung-frank",
      eyebrow: "Projekt · Immobilienverwaltung",
      h1: "Hausverwaltung Natalie Frank: Webauftritt für eine Leverkusener Verwaltung",
      lede: "Ein Auftritt, der zwei sehr unterschiedliche Zielgruppen bedient — Eigentümer, die eine Verwaltung suchen, und Mieter, die einen konkreten Weg zum Ansprechpartner brauchen.",
      situationTitle: "Ausgangslage",
      situation: [
        "Eine Hausverwaltung wird von zwei Seiten gesucht, die kaum unterschiedlicher sein könnten. Eigentümer und Verwaltungsbeiräte prüfen, ob sie ihr Objekt in verlässliche Hände geben — dafür brauchen sie Leistungsumfang, Zuständigkeit und einen seriösen Eindruck. Mieter dagegen wollen schnell den richtigen Ansprechpartner oder eine Möglichkeit, ein Anliegen loszuwerden.",
        "Ohne klare Trennung dieser beiden Pfade landet alles auf demselben Telefon. Ein Webauftritt kann diesen Erstkontakt vorsortieren, statt ihn nur zu verlagern.",
      ],
      solutionTitle: "Umsetzung",
      solution: [
        {
          title: "Zwei Zielgruppen, zwei Wege",
          text: "Leistungen für Eigentümer und Anliegen von Mietern wurden getrennt geführt, statt beide in eine allgemeine Kontaktseite zu schicken.",
        },
        {
          title: "Persönlicher Charakter statt Konzernoptik",
          text: "Der Auftritt betont die persönliche Betreuung — das Unterscheidungsmerkmal gegenüber großen Verwaltungen — und wirkt dabei aufgeräumt und verbindlich.",
        },
        {
          title: "Datensparsame Formulare",
          text: "Kontaktwege erheben nur die tatsächlich benötigten Angaben, verschlüsselt übertragen. Bei Mieter- und Eigentümerdaten ist das die Grundlage, nicht die Kür.",
        },
        {
          title: "Technische Basis aus einer Hand",
          text: "Domain, SSL, Hosting und geschäftliche E-Mail-Adressen wurden vollständig eingerichtet und übergeben.",
        },
      ],
      resultTitle: "Ergebnis",
      result: [
        "Die Verwaltung hat einen eigenständigen Auftritt unter eigener Domain, auf den sie bei der Akquise neuer Objekte verweisen kann.",
        "Eigentümer und Mieter finden getrennte, jeweils passende Einstiegspunkte — statt einer gemeinsamen Sammel-Kontaktseite.",
      ],
      factsTitle: "Projektdaten",
      facts: [
        { label: "Branche", value: "Immobilienverwaltung · Leverkusen" },
        { label: "Leistungen", value: "Website, Hosting, geschäftliche E-Mail" },
        { label: "Zielgruppen", value: "Eigentümer und Mieter getrennt geführt" },
        { label: "Status", value: "Live unter eigener Domain" },
      ],
      ctaTitle: "Auftritt für Ihre Hausverwaltung?",
      ctaText:
        "Schildern Sie kurz, wie viele Objekte Sie betreuen und was heute am meisten Zeit frisst — Sie erhalten eine ehrliche Einschätzung und ein klares Angebot.",
      related: [
        { label: "Website für Hausverwaltungen", to: "/website-fuer-hausverwaltung-leverkusen" },
        { label: "Webdesign in Leverkusen", to: "/webdesign-leverkusen" },
        { label: "Website-Wartung & Pflege", to: "/website-wartung-leverkusen" },
      ],
      seo: {
        title: "Referenz Hausverwaltung Natalie Frank – Website | Korolov IT-Service Leverkusen",
        description:
          "Projektbericht: Webauftritt für die Hausverwaltung Natalie Frank in Leverkusen — getrennte Wege für Eigentümer und Mieter, datensparsame Formulare, Hosting und E-Mail.",
        keywords:
          "Referenz Hausverwaltung Website, Website Immobilienverwaltung Referenz, Hausverwaltung Leverkusen Website, Webdesign Hausverwaltung",
      },
    },
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
    featured: true,
  },
];

/** Projekte mit eigener Detailseite unter /referenzen/<slug>. */
export const casesWithDetail = cases.filter((c) => c.detail);

export function getCaseBySlug(slug: string): Case | undefined {
  return cases.find((c) => c.slug === slug);
}
