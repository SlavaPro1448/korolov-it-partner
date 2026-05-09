type SeoLocale = "de" | "ru" | "uk";

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  locale: SeoLocale;
  type?: "website";
  noindex?: boolean;
  keywords?: string;
};

const SITE_URL = "https://korolov-it-service.de";

const OG_IMAGE_BY_LOCALE: Record<SeoLocale, string> = {
  de: "/og/og-default-de.jpg",
  ru: "/og/og-default-ru.jpg",
  uk: "/og/og-default-ua.jpg",
};

const OG_LOCALE_BY_LOCALE: Record<SeoLocale, string> = {
  de: "de_DE",
  ru: "ru_RU",
  uk: "uk_UA",
};

const HREFLANG_BY_LOCALE: Record<SeoLocale, string> = {
  de: "de",
  ru: "ru",
  uk: "uk",
};

const URL_PREFIX_BY_LOCALE: Record<SeoLocale, string> = {
  de: "",
  ru: "/ru",
  uk: "/uk",
};

function toAbsoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildSeoMeta(config: SeoConfig) {
  const canonicalUrl = toAbsoluteUrl(config.path);
  const ogImageUrl = toAbsoluteUrl(OG_IMAGE_BY_LOCALE[config.locale]);
  const ogLocale = OG_LOCALE_BY_LOCALE[config.locale];

  return [
    { title: config.title },
    { name: "description", content: config.description },
    ...(config.keywords ? [{ name: "keywords", content: config.keywords }] : []),
    { rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: config.type ?? "website" },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:locale", content: ogLocale },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: config.title },
    { name: "twitter:description", content: config.description },
    { name: "twitter:image", content: ogImageUrl },
    ...(config.noindex ? [{ name: "robots", content: "noindex" }] : []),
  ];
}

/**
 * @param subpath path within a locale, without locale prefix (e.g. "" for home, "/about")
 */
export function buildHreflangLinks(subpath: string = "") {
  const locales: SeoLocale[] = ["de", "ru", "uk"];
  const normalized = subpath === "/" ? "" : subpath;
  const links = locales.map((locale) => ({
    rel: "alternate",
    hreflang: HREFLANG_BY_LOCALE[locale],
    href: toAbsoluteUrl(`${URL_PREFIX_BY_LOCALE[locale]}${normalized}` || "/"),
  }));
  links.push({
    rel: "alternate",
    hreflang: "x-default",
    href: toAbsoluteUrl(normalized || "/"),
  });
  return links;
}
