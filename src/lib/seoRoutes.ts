/**
 * Shared route/locale map for SEO. Used by both <Seo> (HTML hreflang/canonical)
 * and scripts/generate-sitemap.ts so the two can never drift apart.
 */
import { DEFAULT_LOCALE, LOCALES, SITE_URL, type Locale } from "./siteConfig";

/** Case slugs mirror src/data/caseStudiesData.ts ids. */
export const CASE_SLUGS = ["smt-premium-box", "vmeste-silnee", "unit-econ-strategist"] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

/** Indexable paths, relative to the /{lang} prefix. Calculator and 404 are excluded (noindex). */
export const INDEXABLE_PATHS: readonly string[] = [
  "",
  ...CASE_SLUGS.map((slug) => `/cases/${slug}`),
];

export const localizedUrl = (lang: Locale, path = "") => `${SITE_URL}/${lang}${path}`;

export interface Alternate {
  hrefLang: string;
  href: string;
}

export const alternatesFor = (path = ""): Alternate[] => [
  ...LOCALES.map((l) => ({ hrefLang: l, href: localizedUrl(l, path) })),
  { hrefLang: "x-default", href: localizedUrl(DEFAULT_LOCALE, path) },
];

export interface IndexableUrl {
  lang: Locale;
  path: string;
  loc: string;
  alternates: Alternate[];
  priority: string;
}

export const indexableUrls = (): IndexableUrl[] =>
  INDEXABLE_PATHS.flatMap((path) =>
    LOCALES.map((lang) => ({
      lang,
      path,
      loc: localizedUrl(lang, path),
      alternates: alternatesFor(path),
      priority: path === "" ? "1.0" : "0.7",
    })),
  );
