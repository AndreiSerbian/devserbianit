export type RevolverLocale = "ru" | "en" | "ro";

/** NOTE: Romanian strings are machine-assisted drafts — flag for native review. */
export const OUTER_WORDS: Record<RevolverLocale, string[]> = {
  ru: ["МАРКЕТИНГ", "ПРОДАЖИ", "САЙТ", "CRM", "АВТОМАТИЗАЦИЯ", "АНАЛИТИКА"],
  en: ["MARKETING", "SALES", "WEBSITE", "CRM", "AUTOMATION", "ANALYTICS"],
  ro: ["MARKETING", "VÂNZĂRI", "SITE WEB", "CRM", "AUTOMATIZARE", "ANALITICĂ"],
};

export const CENTER_PHRASES: Record<RevolverLocale, string[]> = {
  ru: ["ВАШ БИЗНЕС", "ВАШ БРЕНД", "ВАША ПРИБЫЛЬ"],
  en: ["YOUR BUSINESS", "YOUR BRAND", "YOUR PROFIT"],
  ro: ["AFACEREA TA", "BRANDUL TĂU", "PROFITUL TĂU"],
};

export const A11Y: Record<RevolverLocale, { title: string; desc: string }> = {
  ru: {
    title: "Система бизнес-функций",
    desc: "Анимированная схема, показывающая, как маркетинг, продажи, сайт, CRM, автоматизация и аналитика работают как единая система.",
  },
  en: {
    title: "Business system diagram",
    desc: "Animated diagram showing marketing, sales, website, CRM, automation and analytics working as one system.",
  },
  ro: {
    title: "Diagrama sistemului de business",
    desc: "Diagramă animată care arată cum marketingul, vânzările, site-ul web, CRM-ul, automatizarea și analitica funcționează ca un singur sistem.",
  },
};

export const OUTER_INTERVAL_MS = 4000;
export const CENTER_INTERVAL_MS = 5000;
