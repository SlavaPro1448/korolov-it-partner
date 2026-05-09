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

export type Dict = {
  about: AboutDict;
  problem: ProblemDict;
  services: ServicesDict;
  forWhom: ForWhomDict;
  pricing: PricingDict;
  process: ProcessDict;
};
