/**
 * Single source of truth for the canonical production origin.
 * Change SITE_URL here (or via VITE_SITE_URL) when a custom domain is connected —
 * canonical, hreflang, JSON-LD @id, Open Graph and the sitemap all derive from it.
 */
const FALLBACK_SITE_URL = "https://devserbianit.lovable.app";

const fromEnv =
  typeof process !== "undefined" && process.env?.SITE_URL
    ? process.env.SITE_URL
    : typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string> }).env?.VITE_SITE_URL;

export const SITE_URL = (fromEnv || FALLBACK_SITE_URL).replace(/\/+$/, "");

export const LOCALES = ["ru", "en", "ro"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export const siteConfig = {
  siteUrl: SITE_URL,
  personId: `${SITE_URL}/#person`,
  websiteId: `${SITE_URL}/#website`,
  brandName: "ANDREI SERBIAN",
  brandDescriptor: "IT SOLUTIONS",
} as const;

export const absoluteUrl = (path = "") =>
  `${SITE_URL}${path.startsWith("/") || path === "" ? path : `/${path}`}`;
