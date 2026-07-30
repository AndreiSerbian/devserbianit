import { createContext, useContext, useCallback, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations, SUPPORTED_LANGS, type Lang } from "@/data/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof translations)[Lang];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "lang";

export const getLangFromPath = (pathname: string): Lang | null => {
  const first = pathname.split("/").filter(Boolean)[0];
  return SUPPORTED_LANGS.includes(first as Lang) ? (first as Lang) : null;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const fromPath = getLangFromPath(location.pathname);
  const stored =
    typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Lang | null) : null;
  const lang: Lang =
    fromPath ?? (stored && SUPPORTED_LANGS.includes(stored) ? stored : "ru");

  const setLang = useCallback(
    (next: Lang) => {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;

      const segments = location.pathname.split("/").filter(Boolean);
      if (segments.length && SUPPORTED_LANGS.includes(segments[0] as Lang)) {
        segments[0] = next;
      } else {
        segments.unshift(next);
      }
      navigate("/" + segments.join("/") + location.hash, { replace: false });
    },
    [location.pathname, location.hash, navigate],
  );

  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};