import { Link } from "react-router-dom";
import { useConsent } from "@/context/ConsentContext";
import { useLanguage } from "@/context/LanguageContext";
import { consentCopy } from "@/data/consentCopy";
import { LEGAL_DOCS, legalPath } from "@/lib/legalRoutes";
import type { Locale } from "@/lib/siteConfig";

/** Legal navigation + always-available consent settings entry point. */
export const LegalFooterLinks = ({ className = "" }: { className?: string }) => {
  const { lang } = useLanguage();
  const copy = consentCopy[lang as Locale];
  const { openSettings } = useConsent();

  return (
    <nav
      aria-label={copy.settingsTitle}
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground ${className}`}
    >
      {LEGAL_DOCS.map((doc) => (
        <Link key={doc} to={legalPath(lang as Locale, doc)} className="hover:text-foreground transition-colors">
          {copy.legal[doc]}
        </Link>
      ))}
      <button type="button" onClick={openSettings} className="hover:text-foreground transition-colors underline">
        {copy.footerSettings}
      </button>
    </nav>
  );
};
