import type { LegalDoc } from "@/lib/legalRoutes";

export interface LegalTable {
  columns: string[];
  rows: string[][];
}

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: LegalTable;
}

export interface LegalDocContent {
  /** H1 */
  title: string;
  seoTitle: string;
  seoDescription: string;
  updatedLabel: string;
  updated: string;
  versionLabel: string;
  version: string;
  intro: string[];
  sections: LegalSection[];
}

export type LegalBundle = Record<LegalDoc, LegalDocContent>;

/** Shared factual constants so the three language versions cannot drift. */
export const LEGAL_FACTS = {
  controller: "Andrei Serbian",
  email: "serbiyan012@gmail.com",
  telegram: "@public_serb",
  site: "devserbianit.lovable.app",
  updated: "2026-08-20",
  /** Mirrors public.consent_policy_version() in the database. */
  policyVersion: "2026-08-20.1",
} as const;
