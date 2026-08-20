import type { Locale } from "@/lib/siteConfig";
import type { LegalBundle } from "./types";
import { legalEn } from "./en";
import { legalRo } from "./ro";
import { legalRu } from "./ru";

export const legalContent: Record<Locale, LegalBundle> = {
  ru: legalRu,
  en: legalEn,
  ro: legalRo,
};

export type { LegalBundle, LegalDocContent, LegalSection } from "./types";
