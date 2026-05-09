import { de } from "./de";
import { ru } from "./ru";
import { uk } from "./uk";
import type { Dict, Locale } from "./types";

const dicts: Record<Locale, Dict> = { de, ru, uk };

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

export type { Dict, Locale };
