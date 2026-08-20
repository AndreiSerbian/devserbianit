import { LOCALES, type Locale } from "./siteConfig";

export const LEGAL_DOCS = ["privacy", "cookies", "terms"] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];

/** Localized slugs. Romanian is the reference legal version (Republic of Moldova). */
export const LEGAL_SLUGS: Record<LegalDoc, Record<Locale, string>> = {
  privacy: { ro: "confidentialitate", ru: "konfidencialnost", en: "privacy" },
  cookies: { ro: "cookies", ru: "cookie", en: "cookies" },
  terms: { ro: "termeni", ru: "usloviya", en: "terms" },
};

export const legalPath = (lang: Locale, doc: LegalDoc) => `/${lang}/${LEGAL_SLUGS[doc][lang]}`;

/** Relative (locale-prefix-free) path per locale, for canonical/hreflang maps. */
export const legalPathsByLocale = (doc: LegalDoc): Record<Locale, string> =>
  Object.fromEntries(LOCALES.map((l) => [l, `/${LEGAL_SLUGS[doc][l]}`])) as Record<Locale, string>;

export const legalDocFromSlug = (lang: Locale, slug: string): LegalDoc | null =>
  LEGAL_DOCS.find((doc) => LEGAL_SLUGS[doc][lang] === slug) ?? null;
