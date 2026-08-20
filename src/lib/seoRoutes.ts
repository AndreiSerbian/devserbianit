/**
 * Shared route/locale map for SEO. Used by both <Seo> (HTML hreflang/canonical)
 * and scripts/generate-sitemap.ts so the two can never drift apart.
 */
import { DEFAULT_LOCALE, LOCALES, SITE_URL, type Locale } from "./siteConfig";
import { LEGAL_DOCS, legalPathsByLocale } from "./legalRoutes";

/** Case slugs mirror src/data/caseStudiesData.ts ids. */
export const CASE_SLUGS = ["smt-premium-box", "vmeste-silnee", "unit-econ-strategist"] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

/** Indexable paths, relative to the /{lang} prefix. Calculator and 404 are excluded (noindex). */
export const INDEXABLE_PATHS: readonly string[] = [
  "",
  ...CASE_SLUGS.map((slug) => `/cases/${slug}`),
];

export const localizedUrl = (lang: Locale, path = "") => `${SITE_URL}/${lang}${path}`;

/** Paths whose slug differs per locale (legal pages). */
export type LocalePaths = Record<Locale, string>;

const pathFor = (path: string | LocalePaths, lang: Locale) =>
  typeof path === "string" ? path : path[lang];

export interface Alternate {
  hrefLang: string;
  href: string;
}

export const alternatesFor = (path: string | LocalePaths = ""): Alternate[] => [
  ...LOCALES.map((l) => ({ hrefLang: l, href: localizedUrl(l, pathFor(path, l)) })),
  { hrefLang: "x-default", href: localizedUrl(DEFAULT_LOCALE, pathFor(path, DEFAULT_LOCALE)) },
];

export interface IndexableUrl {
  lang: Locale;
  path: string;
  loc: string;
  alternates: Alternate[];
  priority: string;
}

/** Legal pages are indexable and carry locale-specific slugs. */
export const LEGAL_LOCALE_PATHS: LocalePaths[] = LEGAL_DOCS.map(legalPathsByLocale);

export const indexableUrls = (): IndexableUrl[] => [
  ...INDEXABLE_PATHS.flatMap((path) =>
    LOCALES.map((lang) => ({
      lang,
      path,
      loc: localizedUrl(lang, path),
      alternates: alternatesFor(path),
      priority: path === "" ? "1.0" : "0.7",
    })),
  ),
  ...LEGAL_LOCALE_PATHS.flatMap((paths) =>
    LOCALES.map((lang) => ({
      lang,
      path: paths[lang],
      loc: localizedUrl(lang, paths[lang]),
      alternates: alternatesFor(paths),
      priority: "0.3",
    })),
  ),
];
