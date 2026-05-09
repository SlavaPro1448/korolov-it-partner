export type Locale = "de" | "ru" | "uk";

export type AboutDict = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  trust: string[];
  cardName: string;
  cardRole: string;
  cardLocation: string;
  cardLanguages: string;
  cardContactNote: string;
};

export type ProblemDict = {
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  description: string;
  items: { title: string; text: string }[];
};

export type SectionListItem = {
  title: string;
  text: string;
  tags?: string[];
};

export type ServicesDict = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: SectionListItem[];
};

export type ForWhomDict = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: { title: string; text: string }[];
};

export type PricingPackage = {
  name: string;
  price: string;
  suffix: string;
  desc: string;
  features: string[];
  note?: string;
};

export type PricingDict = {
  eyebrow: string;
  title: string;
  subtitle: string;
  recommendedBadge: string;
  ctaLabel: string;
  packages: PricingPackage[];
};

export type ProcessDict = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stepLabel: string;
  steps: { title: string; text: string }[];
};

export type HeroDict = {
  badge: string;
  heading: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  highlights: string[];
  card: {
    site: { label: string; value: string };
    mail: { label: string; value: string };
    security: { label: string; value: string };
    support: { label: string; value: string };
    consultLabel: string;
    consultText: string;
    consultLanguages: { de: string; ru: string; uk: string };
  };
};

export type FaqDict = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: { q: string; a: string }[];
};

export type ContactTopic =
  | "website"
  | "wartung"
  | "email-domain"
  | "it-support"
  | "digital-setup"
  | "sonstiges";

export type ContactDict = {
  eyebrow: string;
  heading: string;
  description: string;
  rows: {
    emailLabel: string;
    emailAria: string;
    phoneLabel: string;
    phoneAria: string;
    whatsappLabel: string;
    whatsappValue: string;
    whatsappAria: string;
    locationLabel: string;
    locationValue: string;
    languagesLabel: string;
    languagesValue: string;
  };
  form: {
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    topicLabel: string;
    topicPlaceholder: string;
    topicOptions: Record<ContactTopic, string>;
    messageLabel: string;
    messagePlaceholder: string;
    requiredAria: string;
    consentTemplate: string;
    consentPrivacyLabel: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorFallback: string;
  };
  validation: {
    nameRequired: string;
    nameMin: string;
    emailRequired: string;
    emailInvalid: string;
    phoneInvalid: string;
    topicRequired: string;
    messageRequired: string;
    messageMin: string;
    messageMax: string;
  };
};

export type Dict = {
  hero: HeroDict;
  about: AboutDict;
  problem: ProblemDict;
  services: ServicesDict;
  forWhom: ForWhomDict;
  pricing: PricingDict;
  process: ProcessDict;
  faq: FaqDict;
  contact: ContactDict;
};
