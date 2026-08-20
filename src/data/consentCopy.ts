import type { Locale } from "@/lib/siteConfig";

export interface ConsentCopy {
  bannerTitle: string;
  bannerBody: string;
  acceptAll: string;
  rejectAll: string;
  settings: string;
  settingsTitle: string;
  settingsBody: string;
  essentialTitle: string;
  essentialBody: string;
  essentialAlways: string;
  analyticsTitle: string;
  analyticsBody: string;
  preferencesTitle: string;
  preferencesBody: string;
  save: string;
  cancel: string;
  error: string;
  footerSettings: string;
  legal: { privacy: string; cookies: string; terms: string };
  more: string;
}

export const consentCopy: Record<Locale, ConsentCopy> = {
  ru: {
    bannerTitle: "Аналитика и сохранение настроек",
    bannerBody:
      "Сайт работает без cookies. По вашему согласию мы можем собирать псевдонимную аналитику использования и постоянно хранить выбор темы и языка. Без согласия сайт работает полностью.",
    acceptAll: "Принять всё",
    rejectAll: "Отклонить всё",
    settings: "Настроить",
    settingsTitle: "Настройки хранения и аналитики",
    settingsBody:
      "Выберите категории. Решение записывается отдельной неизменяемой записью и может быть изменено в любой момент.",
    essentialTitle: "Необходимое",
    essentialBody:
      "Хранение вашего решения о согласии и техническая защита формы от злоупотреблений.",
    essentialAlways: "Всегда включено",
    analyticsTitle: "Аналитика",
    analyticsBody:
      "Псевдонимные события использования сайта с идентификатором сессии и идентификатором согласия.",
    preferencesTitle: "Настройки",
    preferencesBody:
      "Постоянное сохранение выбранной темы и языка. Тема и язык работают и без согласия — но только в текущей сессии.",
    save: "Сохранить выбор",
    cancel: "Отмена",
    error: "Не удалось сохранить выбор. Попробуйте ещё раз.",
    footerSettings: "Настройки cookie",
    legal: {
      privacy: "Политика конфиденциальности",
      cookies: "Политика cookie",
      terms: "Условия использования",
    },
    more: "Подробнее",
  },
  en: {
    bannerTitle: "Analytics and stored preferences",
    bannerBody:
      "This site sets no cookies. With your consent it can collect pseudonymous usage analytics and store your theme and language choice persistently. The site works fully without consent.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    settings: "Customise",
    settingsTitle: "Storage and analytics settings",
    settingsBody:
      "Choose the categories. Your decision is stored as a separate immutable record and can be changed at any time.",
    essentialTitle: "Essential",
    essentialBody: "Storing your consent decision and technical abuse protection for the form.",
    essentialAlways: "Always on",
    analyticsTitle: "Analytics",
    analyticsBody:
      "Pseudonymous usage events carrying a session identifier and the consent identifier.",
    preferencesTitle: "Preferences",
    preferencesBody:
      "Persistently storing your theme and language choice. Both work without consent — but only for the current session.",
    save: "Save choice",
    cancel: "Cancel",
    error: "Could not save your choice. Please try again.",
    footerSettings: "Cookie settings",
    legal: { privacy: "Privacy Policy", cookies: "Cookie Policy", terms: "Terms of Use" },
    more: "Details",
  },
  ro: {
    bannerTitle: "Analitică și preferințe salvate",
    bannerBody:
      "Site-ul nu instalează cookie-uri. Cu consimțământul dvs. putem colecta analitică pseudonimă de utilizare și păstra persistent tema și limba alese. Fără consimțământ site-ul funcționează integral.",
    acceptAll: "Accept toate",
    rejectAll: "Refuz toate",
    settings: "Personalizează",
    settingsTitle: "Setări de stocare și analitică",
    settingsBody:
      "Alegeți categoriile. Decizia este înregistrată separat, imuabil, și poate fi modificată oricând.",
    essentialTitle: "Esențial",
    essentialBody:
      "Păstrarea deciziei dvs. privind consimțământul și protecția tehnică a formularului împotriva abuzurilor.",
    essentialAlways: "Întotdeauna activ",
    analyticsTitle: "Analitică",
    analyticsBody:
      "Evenimente pseudonime de utilizare, cu identificator de sesiune și identificator de consimțământ.",
    preferencesTitle: "Preferințe",
    preferencesBody:
      "Păstrarea persistentă a temei și limbii alese. Ambele funcționează și fără consimțământ — dar doar în sesiunea curentă.",
    save: "Salvează alegerea",
    cancel: "Anulează",
    error: "Alegerea nu a putut fi salvată. Încercați din nou.",
    footerSettings: "Setări cookie",
    legal: {
      privacy: "Politica de confidențialitate",
      cookies: "Politica cookie",
      terms: "Termeni de utilizare",
    },
    more: "Detalii",
  },
};
