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
  // Анбитер по § 5 DDG
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
  // Рабочий номер — Festnetz, на нём отвечает KI-Telefonassistent (Twilio + ElevenLabs).
  // WhatsApp остаётся на мобильном.
  phoneDisplay: "+49 214 83263442",
  phoneHref: "tel:+4921483263442",
  whatsappHref: "https://wa.me/491638251736",

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
    provider: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
    privacyUrl: "https://vercel.com/legal/privacy-policy",
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
