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

export type SectionListItem = {
  title: string;
  text: string;
  tags?: string[];
};

export type ServiceItem = SectionListItem & { to?: string };

export type ServicesDict = {
  eyebrow: string;
  title: string;
  subtitle: string;
  moreLabel: string;
  groups: Array<{ label: string; description: string; items: ServiceItem[] }>;
};

export type StatsDict = {
  items: Array<{ value: string; label: string }>;
};

export type KiDict = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  principles: Array<{ title: string; text: string }>;
  detailsLabel: string;
  allProjects: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
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
  headingLead: string;
  headingAccent: string;
  headingTail: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  highlights: string[];
  floating: {
    request: string;
    requestSub: string;
    invoice: string;
    invoiceSub: string;
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
  | "ki"
  | "app"
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
  stats: StatsDict;
  about: AboutDict;
  services: ServicesDict;
  ki: KiDict;
  forWhom: ForWhomDict;
  pricing: PricingDict;
  process: ProcessDict;
  faq: FaqDict;
  contact: ContactDict;
};
