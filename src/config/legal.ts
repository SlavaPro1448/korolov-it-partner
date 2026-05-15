// Юридические данные компании. Используются в:
//   - src/routes/impressum.tsx
//   - src/routes/datenschutz.tsx
//   - src/routes/widerruf.tsx
//   - JSON-LD structured data (LocalBusiness)
//   - футер сайта
//
// При изменении любого поля все страницы обновятся автоматически.
// Дату LAST_UPDATED обновляйте при существенных изменениях содержания
// Impressum или Datenschutz (новые инструменты, смена адреса и т.д.).

export const COMPANY = {
  // Анбитер по § 5 TMG
  legalName: "Viacheslav Korolov",
  tradeName: "Korolov IT-Service",
  legalForm: "Einzelunternehmen",
  taxStatus: "Kleinunternehmer gemäß § 19 UStG",

  // Контакт
  street: "Stegerwaldstraße 14",
  zip: "51373",
  city: "Leverkusen",
  country: "Deutschland",
  countryCode: "DE",

  email: "info@korolov-it-service.de",
  phoneDisplay: "+49 1516 3825 1736",
  phoneHref: "tel:+4915163251736",
  whatsappHref: "https://wa.me/4915163251736",

  // Налоговые данные (Kleinunternehmer — без USt-IdNr.)
  ustId: null as string | null,

  // Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
  responsibleForContent: "Viacheslav Korolov",

  // Деятельность
  activity: "Webentwicklung und IT-Dienstleistungen",

  // Сайт
  website: "https://korolov-it-service.de",

  // Хостинг и инфраструктура
  hosting: {
    provider: "IONOS SE",
    address: "Elgendorfer Straße 57, 56410 Montabaur, Deutschland",
    privacyUrl: "https://www.ionos.de/terms-gtc/datenschutzerklaerung",
  },

  mailProvider: {
    provider: "IONOS SE",
    privacyUrl: "https://www.ionos.de/terms-gtc/datenschutzerklaerung",
  },

  // Резерв: ручная дата для formatLegalDate(); «Stand» на Impressum/Datenschutz/Widerruf — formatTodayLegalStand().
  lastUpdated: "2025-01-15",
} as const;

// Удобный геттер полного адреса
export const FULL_ADDRESS = `${COMPANY.street}, ${COMPANY.zip} ${COMPANY.city}, ${COMPANY.country}`;
// Форматированная дата для отображения на странице
export const formatLegalDate = (iso: string, locale = "de-DE") => {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/** Kalenderdatum für «Stand»-Angaben (täglich aktuell, Zeitzone Deutschland). */
export const formatTodayLegalStand = (locale = "de-DE", timeZone = "Europe/Berlin") => {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
};
