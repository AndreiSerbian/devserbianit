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
        analytics: "Аналитика (+12ч)",
        multilingual: "Мультиязычность (+18ч)",
        supabase: "Интеграция Supabase (+20ч)",
        telegram: "Telegram интеграция (+12ч)"
      },
      urgency: "Срочная разработка (+30%)",
      estimate: "Смета проекта",
      hours: "ч",
      rate: "Ставка: €12.5/ч",
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
          name: "SMT Premium Box",
          desc: "Оптовый e-commerce для подарочных коробок с вариациями.",
          features: ["Карточки с вариациями", "Предзаказ", "Email-подтверждение"],
          result: "Сокращение времени обработки B2B",
          link: "https://giftboxopt.ru",
          image: "smt-premium-box"
        },
        {
          name: "Вместе сильнее",
          desc: "Сайт инклюзивного пространства для мам и детей в Молдове.",
          features: ["Календарь событий", "Формы волонтёров", "База ресурсов"],
          result: "Удобная точка входа для семей",
          link: "https://vmeste-silnee-hub.lovable.app/",
          image: "vmeste-silnee"
        },
        {
          name: "Unit Economics Strategist",
          desc: "Платформа для бизнес-консалтинга и анализа юнит-экономики.",
          features: ["Расчёт метрик бизнеса", "Сравнение сценариев", "Анализ конкурентов", "Теория игр"],
          result: "Научный подход к стратегии",
          link: "https://unit-econ-strategist.lovable.app/",
          image: "unit-econ"
        }
      ],
      viewDetails: "Подробнее",
      learnMore: "Подробнее"
    },
    form: {
      title: "Помогите мне лучше понять ваш бизнес",
      subtitle: "Ответьте на несколько вопросов, чтобы мы могли подготовить для вас идеальное решение",
      selectType: "Выберите тип проекта",
      types: {
        ecommerce: "E-commerce",
        telegram: "Telegram-бот",
        crm: "CRM/Админ-панель"
      },
      questions: {
        ecommerce: [
          "Как называется ваш бренд или компания, и чем вы занимаетесь?",
          "Есть ли у вас уже сайт или страницы в соцсетях? (если да — укажите ссылки)",
          "Какая основная цель сайта и какие товары или услуги вы планируете продавать?",
          "Какие технические особенности нужны магазину? (корзина, оплата, доставка, варианты товаров, админ-панель и т.д.)",
          "Есть ли примеры сайтов или референсы, на которые нам стоит ориентироваться?",
          "Нужно ли адаптировать сайт под несколько языков (русский, румынский, английский и др.)?",
          "К какому сроку вы хотите запустить проект и какой ориентировочный бюджет закладываете?"
        ],
        telegram: [
          "Как называется ваш бизнес или проект?",
          "Какую основную задачу должен решать бот и какие функции/команды выполнять?",
          "Какие технические особенности нужны? (интеграции с сайтом/CRM, авторизация, база данных, приём платежей, веб-админка)",
          "Есть ли референсы или материалы, которые помогут нам в разработке бота?",
          "Нужна ли поддержка нескольких языков?",
          "К какому сроку нужно запустить бота и какой бюджет вы планируете?"
        ],
        crm: [
          "Как называется ваша компания и в какой сфере вы работаете?",
          "Какие бизнес-процессы нужно автоматизировать, какие данные хранить и какие отчёты/аналитика вам нужны?",
          "Сколько сотрудников будут работать с системой?",
          "Нужна ли интеграция с существующими системами? (1С, почта, мессенджеры и т.д.)",
          "Есть ли особые требования к безопасности данных?",
          "Нужна ли мобильная версия или приложение?",
          "Планируемый срок запуска и бюджет проекта?"
        ]
      },
      answerPlaceholder: "Ваш ответ...",
      contactTitle: "Контактные данные",
      contactLabel: "Как с вами связаться? (имя, email, телефон, Telegram)",
      contactPlaceholder: "Иван Петров\nemail: ivan@example.com\nTelegram: @ivanpetrov\n+373 123 456 78",
      submit: "Отправить заявку",
      sending: "Отправка...",
      success: "Спасибо!",
      successMessage: "Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.",
      error: "Ошибка",
      contactRequired: "Пожалуйста, укажите ваши контактные данные",
      sendError: "Не удалось отправить заявку. Попробуйте позже."
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
        analytics: "Analytics (+12h)",
        multilingual: "Multilingual (+18h)",
        supabase: "Supabase Integration (+20h)",
        telegram: "Telegram Integration (+12h)"
      },
      urgency: "Urgent Development (+30%)",
      estimate: "Project Estimate",
      hours: "h",
      rate: "Rate: €12.5/h",
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
          name: "SMT Premium Box",
          desc: "Wholesale e-commerce for gift boxes with variants.",
          features: ["Variant cards", "Pre-order", "Email confirmation"],
          result: "Reduced B2B processing time",
          link: "https://giftboxopt.ru",
          image: "smt-premium-box"
        },
        {
          name: "Together Stronger",
          desc: "Website for inclusive space initiative in Moldova.",
          features: ["Events calendar", "Volunteer forms", "Resources base"],
          result: "Clear entry point for families",
          link: "https://vmeste-silnee-hub.lovable.app/",
          image: "vmeste-silnee"
        },
        {
          name: "Unit Economics Strategist",
          desc: "Business consulting platform for unit economics analysis.",
          features: ["Business metrics calculation", "Scenario comparison", "Competitor analysis", "Game theory"],
          result: "Scientific approach to strategy",
          link: "https://unit-econ-strategist.lovable.app/",
          image: "unit-econ"
        }
      ],
      viewDetails: "Details",
      learnMore: "Learn more"
    },
    form: {
      title: "Help me understand your business better",
      subtitle: "Answer a few questions so we can prepare the perfect solution for you",
      selectType: "Select project type",
      types: {
        ecommerce: "E-commerce",
        telegram: "Telegram Bot",
        crm: "CRM/Admin Panel"
      },
      questions: {
        ecommerce: [
          "What is your brand or company name and what do you do?",
          "Do you already have a website or social media pages? (if yes, please provide links)",
          "What is the main goal of the website and what products or services do you plan to sell?",
          "What technical features does the store need? (cart, payments, delivery, product variants, admin panel, etc.)",
          "Are there example websites or references we should look at?",
          "Do you need the site adapted for multiple languages (Russian, Romanian, English, etc.)?",
          "By what date do you want to launch the project and what is your approximate budget?"
        ],
        telegram: [
          "What is your business or project name?",
          "What main task should the bot solve and what functions/commands should it perform?",
          "What technical features are needed? (integrations with website/CRM, authorization, database, payments, web admin)",
          "Are there references or materials that would help us build the bot?",
          "Do you need support for multiple languages?",
          "By what date do you need to launch the bot and what is your budget?"
        ],
        crm: [
          "What is your company name and what field do you work in?",
          "What business processes need to be automated, what data should be stored, and what reports/analytics do you need?",
          "How many employees will work with the system?",
          "Do you need integration with existing systems? (1C, email, messengers, etc.)",
          "Are there special data security requirements?",
          "Do you need a mobile version or app?",
          "Planned launch date and project budget?"
        ]
      },
      answerPlaceholder: "Your answer...",
      contactTitle: "Contact Information",
      contactLabel: "How can we contact you? (name, email, phone, Telegram)",
      contactPlaceholder: "John Smith\nemail: john@example.com\nTelegram: @johnsmith\n+1 234 567 890",
      submit: "Submit Request",
      sending: "Sending...",
      success: "Thank you!",
      successMessage: "Your request has been submitted. We will contact you shortly.",
      error: "Error",
      contactRequired: "Please provide your contact information",
      sendError: "Failed to submit the request. Please try again later."
    },
    contact: {
      title: "Ready to talk?",
      location: "Moldova, EU, Russia • Remote"
    }
  },
  ro: {
    hero: {
      title: "Abordare cuprinzătoare a soluțiilor IT pentru afaceri",
      subtitle: "Mai mult decât cod: privim produsul și procesele prin prisma business-ului.",
      cta: "Calculează bugetul"
    },
    calculator: {
      title: "Calculator de costuri",
      projectType: "Tipul proiectului",
      projectSize: "Dimensiunea proiectului",
      types: {
        ecommerce: "Soluție E-commerce",
        crm: "Sistem CRM/ERP",
        admin: "Panou de administrare",
        telegram: "Bot Telegram",
        integration: "Integrare personalizată"
      },
      sizes: {
        small: "Mic",
        medium: "Mediu",
        large: "Mare"
      },
      options: "Opțiuni suplimentare",
      optionsList: {
        auth: "Autentificare și roluri (+16h)",
        payments: "Plăți (+24h)",
        analytics: "Analiză (+12h)",
        multilingual: "Multilingv (+18h)",
        supabase: "Integrare Supabase (+20h)",
        telegram: "Integrare Telegram (+12h)"
      },
      urgency: "Dezvoltare urgentă (+30%)",
      estimate: "Estimare proiect",
      hours: "h",
      rate: "Tarif: €12.5/h",
      total: "Total",
      exportPdf: "Export PDF",
      sharetelegram: "Trimite pe Telegram"
    },
    services: {
      title: "Ce facem",
      items: [
        { title: "Soluții e-commerce", desc: "Cataloage, coș, plăți, reduceri — focus pe conversie." },
        { title: "CRM / panouri interne", desc: "Procese, roluri și acces adaptat operațiunilor." },
        { title: "Panouri de administrare", desc: "Control clar asupra conținutului, comenzilor, echipelor." },
        { title: "Boți Telegram", desc: "Notificări, cereri și integrări." },
        { title: "Integrări Supabase", desc: "Stocare, roluri, funcții, email." },
        { title: "Audit și arhitectură", desc: "Evaluare și foaie de parcurs." }
      ]
    },
    cases: {
      title: "Studii de caz",
      items: [
        {
          name: "SMT Premium Box",
          desc: "E-commerce en-gros pentru cutii cadou cu variante.",
          features: ["Carduri cu variante", "Pre-comandă", "Confirmare email"],
          result: "Reducerea timpului de procesare B2B",
          link: "https://giftboxopt.ru",
          image: "smt-premium-box"
        },
        {
          name: "Împreună mai puternici",
          desc: "Site pentru inițiativa spațiului incluziv din Moldova.",
          features: ["Calendar evenimente", "Formulare voluntari", "Baza de resurse"],
          result: "Punct de intrare clar pentru familii",
          link: "https://vmeste-silnee-hub.lovable.app/",
          image: "vmeste-silnee"
        },
        {
          name: "Unit Economics Strategist",
          desc: "Platformă de consultanță pentru analiza economiei unitare.",
          features: ["Calculul metricilor de business", "Comparație scenarii", "Analiză concurenți", "Teoria jocurilor"],
          result: "Abordare științifică a strategiei",
          link: "https://unit-econ-strategist.lovable.app/",
          image: "unit-econ"
        }
      ],
      viewDetails: "Detalii",
      learnMore: "Află mai mult"
    },
    form: {
      title: "Ajută-mă să înțeleg mai bine afacerea ta",
      subtitle: "Răspunde la câteva întrebări pentru a pregăti soluția perfectă",
      selectType: "Selectează tipul proiectului",
      types: {
        ecommerce: "E-commerce",
        telegram: "Bot Telegram",
        crm: "CRM/Panou Admin"
      },
      questions: {
        ecommerce: [
          "Care este numele brandului sau companiei tale și cu ce te ocupi?",
          "Ai deja un site sau pagini pe rețele sociale? (dacă da, oferă linkurile)",
          "Care este obiectivul principal al site-ului și ce produse sau servicii planifici să vinzi?",
          "Ce particularități tehnice are nevoie magazinul? (coș, plăți, livrare, variante de produse, panou de administrare, etc.)",
          "Există exemple de site-uri sau referințe la care ar trebui să ne uităm?",
          "Ai nevoie ca site-ul să fie adaptat pentru mai multe limbi?",
          "Până la ce dată vrei să lansezi proiectul și care este bugetul aproximativ?"
        ],
        telegram: [
          "Care este numele afacerii sau proiectului tău?",
          "Ce sarcină principală trebuie să rezolve botul și ce funcții/comenzi trebuie să execute?",
          "Ce particularități tehnice sunt necesare? (integrări cu site/CRM, autorizare, bază de date, plăți, panou web)",
          "Există referințe sau materiale care ne-ar ajuta să construim botul?",
          "Ai nevoie de suport pentru mai multe limbi?",
          "Până când trebuie lansat botul și care este bugetul?"
        ],
        crm: [
          "Care este numele companiei și în ce domeniu lucrezi?",
          "Ce procese de business trebuie automatizate, ce date trebuie stocate și ce rapoarte/analize ai nevoie?",
          "Câți angajați vor lucra cu sistemul?",
          "Ai nevoie de integrare cu sisteme existente? (1C, email, mesagerie, etc.)",
          "Există cerințe speciale de securitate a datelor?",
          "Ai nevoie de versiune mobilă sau aplicație?",
          "Data planificată de lansare și bugetul proiectului?"
        ]
      },
      answerPlaceholder: "Răspunsul tău...",
      contactTitle: "Date de contact",
      contactLabel: "Cum te putem contacta? (nume, email, telefon, Telegram)",
      contactPlaceholder: "Ion Popescu\nemail: ion@example.com\nTelegram: @ionpopescu\n+373 123 456 78",
      submit: "Trimite cererea",
      sending: "Se trimite...",
      success: "Mulțumim!",
      successMessage: "Cererea ta a fost trimisă. Te vom contacta în curând.",
      error: "Eroare",
      contactRequired: "Te rugăm să oferi datele de contact",
      sendError: "Nu s-a putut trimite cererea. Încearcă mai târziu."
    },
    contact: {
      title: "Pregătit să discutăm?",
      location: "Moldova, UE, Rusia • Remote"
    }
  }
};

export type TranslationsType = typeof translations;
export type LanguageType = keyof TranslationsType;
