export const translations = {
  ru: {
    hero: {
      title: "Комплексный подход к IT-решениям для бизнеса",
      subtitle: "Не просто «пишем код». Смотрим на продукт и процессы глазами бизнеса.",
      cta: "Рассчитать бюджет"
    },
    calculator: {
      title: "Калькулятор стоимости",
      projectType: "Тип проекта",
      projectSize: "Размер проекта",
      types: {
        ecommerce: "E-commerce решение",
        crm: "CRM/ERP система",
        admin: "Админ-панель",
        telegram: "Telegram-бот",
        integration: "Кастомная интеграция"
      },
      sizes: {
        small: "Малый",
        medium: "Средний",
        large: "Большой"
      },
      options: "Дополнительные опции",
      optionsList: {
        auth: "Авторизация и роли (+16ч)",
        payments: "Платежи (+24ч)",
        analytics: "Аналитика (+10ч)",
        multilingual: "Мультиязычность (+18ч)",
        supabase: "Интеграция Supabase (+20ч)",
        telegram: "Telegram интеграция (+12ч)"
      },
      urgency: "Срочная разработка (+20%)",
      estimate: "Смета проекта",
      hours: "ч",
      rate: "Ставка: €50/ч",
      total: "Итого",
      exportPdf: "Экспорт в PDF",
      sharetelegram: "Отправить в Telegram"
    },
    services: {
      title: "Что мы делаем",
      items: [
        { title: "E-commerce решения", desc: "Каталоги, корзина, оплата, скидки — ориентир на конверсию." },
        { title: "CRM / внутренние панели", desc: "Процессы, роли и доступы под вашу операционку." },
        { title: "Админ-панели", desc: "Удобный контроль контента, заказов и команд." },
        { title: "Telegram-боты", desc: "Оповещения, заявки и внешние интеграции." },
        { title: "Интеграции с Supabase", desc: "Хранилище, роли, функции, email." },
        { title: "Аудит и архитектура", desc: "Разбор решения и дорожная карта." }
      ]
    },
    cases: {
      title: "Кейсы",
      items: [
        {
          name: "FoodSaur",
          desc: "Маркетплейс для локальных производителей с админ-панелью и ролями.",
          features: ["Каталоги и расписания", "Админ-панель с RLS", "Telegram уведомления"],
          result: "Меньше ручных ошибок, быстрее обработка"
        },
        {
          name: "SMT Premium Box",
          desc: "Оптовый e-commerce для подарочных коробок с вариациями.",
          features: ["Карточки с вариациями", "Предзаказ", "Email-подтверждение"],
          result: "Сокращение времени обработки B2B"
        },
        {
          name: "Вместе сильнее",
          desc: "Сайт инклюзивного пространства для мам и детей в Молдове.",
          features: ["Календарь событий", "Формы волонтёров", "База ресурсов"],
          result: "Удобная точка входа для семей"
        }
      ]
    },
    contact: {
      title: "Готовы обсудить?",
      location: "Молдова, ЕС, Россия • Remote"
    }
  },
  en: {
    hero: {
      title: "Comprehensive IT Solutions for Business",
      subtitle: "Beyond coding: business lens from hypothesis to results.",
      cta: "Calculate Budget"
    },
    calculator: {
      title: "Cost Calculator",
      projectType: "Project Type",
      projectSize: "Project Size",
      types: {
        ecommerce: "E-commerce Solution",
        crm: "CRM/ERP System",
        admin: "Admin Panel",
        telegram: "Telegram Bot",
        integration: "Custom Integration"
      },
      sizes: {
        small: "Small",
        medium: "Medium",
        large: "Large"
      },
      options: "Additional Options",
      optionsList: {
        auth: "Auth & Roles (+16h)",
        payments: "Payments (+24h)",
        analytics: "Analytics (+10h)",
        multilingual: "Multilingual (+18h)",
        supabase: "Supabase Integration (+20h)",
        telegram: "Telegram Integration (+12h)"
      },
      urgency: "Urgent Development (+20%)",
      estimate: "Project Estimate",
      hours: "h",
      rate: "Rate: €50/h",
      total: "Total",
      exportPdf: "Export PDF",
      sharetelegram: "Share to Telegram"
    },
    services: {
      title: "What we do",
      items: [
        { title: "E-commerce solutions", desc: "Catalogs, cart, payments, discounts — focused on conversion." },
        { title: "CRM / internal panels", desc: "Processes, roles, access aligned with operations." },
        { title: "Admin panels", desc: "Clear control over content, orders, teams." },
        { title: "Telegram bots", desc: "Notifications, requests, integrations." },
        { title: "Supabase integrations", desc: "Storage, roles, functions, email." },
        { title: "Audit & architecture", desc: "Assessment and roadmap." }
      ]
    },
    cases: {
      title: "Case Studies",
      items: [
        {
          name: "FoodSaur",
          desc: "Marketplace for local producers with admin panel and roles.",
          features: ["Catalogs & schedules", "Admin with RLS", "Telegram notifications"],
          result: "Fewer errors, faster processing"
        },
        {
          name: "SMT Premium Box",
          desc: "Wholesale e-commerce for gift boxes with variants.",
          features: ["Variant cards", "Pre-order", "Email confirmation"],
          result: "Reduced B2B processing time"
        },
        {
          name: "Together Stronger",
          desc: "Website for inclusive space initiative in Moldova.",
          features: ["Events calendar", "Volunteer forms", "Resources base"],
          result: "Clear entry point for families"
        }
      ]
    },
    contact: {
      title: "Ready to talk?",
      location: "Moldova, EU, Russia • Remote"
    }
  }
};

export type TranslationsType = typeof translations;
export type LanguageType = keyof TranslationsType;
