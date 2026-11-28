import type { Lang } from "./translations";

export const serviceIds = ["stores", "websites", "crm", "bots", "marketing", "visual"] as const;
export const nodeDestinations = ["service-marketing", "service-stores", "service-websites", "service-crm", "service-bots", "cases"] as const;

export const designCopy = {
  ru: {
    system: "Единая система", services: "Инструменты бизнеса", cases: "Работающие решения", contact: "Следующий шаг",
    nodes: ["Маркетинг", "Продажи", "Сайт", "CRM", "Автоматизация", "Аналитика"],
    descriptions: ["Решения под ваш бренд и продукты.", "Каталог и путь от выбора до покупки.", "Понятная точка входа для ваших клиентов.", "Сервисы и работа с клиентами в одной системе.", "Боты и ассистенты для повседневных задач.", "Данные и расчёты для бизнес-решений."],
    explore: "К услуге", exploreCases: "К проектам", project: "Проект", solution: "Решение", result: "Результат", details: "Разбор проекта",
    after: "После обращения", steps: ["Разбираюсь в задаче и уточняю детали.", "Предлагаю подход и обсуждаю объём работ.", "Согласуем план и следующие шаги."],
    top: "Наверх", theme: "Сменить тему", language: "Язык", skip: "К содержимому",
  },
  en: {
    system: "One connected system", services: "Business tools", cases: "Working solutions", contact: "Next step",
    nodes: ["Marketing", "Sales", "Website", "CRM", "Automation", "Analytics"],
    descriptions: ["Solutions tailored to your brand and products.", "A catalogue and a clear path to purchase.", "A clear entry point for your clients.", "Services and client work in one system.", "Bots and assistants for everyday tasks.", "Data and calculations for business decisions."],
    explore: "View service", exploreCases: "View projects", project: "Project", solution: "Solution", result: "Result", details: "Explore project",
    after: "After you get in touch", steps: ["I understand the task and clarify the details.", "We discuss the approach and scope of work.", "We agree on a plan and next steps."],
    top: "Back to top", theme: "Change theme", language: "Language", skip: "Skip to content",
  },
  ro: {
    system: "Un singur sistem", services: "Instrumente de afaceri", cases: "Soluții funcționale", contact: "Pasul următor",
    nodes: ["Marketing", "Vânzări", "Site web", "CRM", "Automatizare", "Analiză"],
    descriptions: ["Soluții adaptate brandului și produselor dvs.", "Catalog și un drum clar spre cumpărare.", "Un punct de intrare clar pentru clienți.", "Servicii și relații cu clienții într-un singur sistem.", "Boți și asistenți pentru sarcinile zilnice.", "Date și calcule pentru decizii de afaceri."],
    explore: "Vezi serviciul", exploreCases: "Vezi proiectele", project: "Proiect", solution: "Soluție", result: "Rezultat", details: "Vezi proiectul",
    after: "După ce ne contactați", steps: ["Înțeleg sarcina și clarific detaliile.", "Discutăm abordarea și volumul lucrărilor.", "Stabilim planul și pașii următori."],
    top: "Sus", theme: "Schimbă tema", language: "Limba", skip: "La conținut",
  },
} satisfies Record<Lang, Record<string, string | readonly string[]>>;