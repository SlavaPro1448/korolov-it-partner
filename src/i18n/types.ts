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

export type Dict = {
  about: AboutDict;
};
