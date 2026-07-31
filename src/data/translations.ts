// NOTE (RO): Romanian strings are machine-assisted and require manual review
// by a native speaker before production publishing.

export const brand = {
  name: "ANDREI SERBIAN",
  descriptor: "IT SOLUTIONS", // editable, intentionally not translated
  telegram: "https://t.me/public_serb",
  telegramHandle: "@public_serb",
  email: "serbiyan012@gmail.com",
};

/** Accessible name for the standalone AS monogram, per locale. */
export const logoAlt = {
  ru: "Логотип Andrei Serbian",
  en: "Andrei Serbian logo",
  ro: "Logo Andrei Serbian",
} as const;

export const translations = {
  ru: {
    nav: {
      cases: "Кейсы",
      services: "Услуги",
      process: "Как я работаю",
      contact: "Контакт",
      cta: "Обсудить проект",
      menu: "Меню",
    },
    hero: {
      title: "САЙТ, CRM И АВТОМАТИЗАЦИЯ\nДОЛЖНЫ РАБОТАТЬ ВМЕСТЕ.",
      subtitle:
        "Разбираюсь, как в компании проходят заявки, продажи и работа с клиентами. Затем связываю сайт, CRM, Telegram и нужные сервисы в одну рабочую систему.",
      cta: "Обсудить проект",
      ctaSecondary: "Смотреть кейсы",
      specializations: "E-COMMERCE / WEBSITES / CRM / INTEGRATIONS / TELEGRAM",
      diagram: {
        marketing: "Маркетинг",
        sales: "Продажи",
        site: "Сайт",
        crm: "CRM",
        automation: "Автоматизация",
        analytics: "Аналитика",
      },
    },
    services: {
      title: "Чем я могу помочь",
      intro:
        "Разрабатываю сайты и внутренние инструменты для малого бизнеса, интернет-магазинов и НКО. Сначала разбираюсь, как устроена работа компании, а уже потом предлагаю техническое решение.",
      items: [
        {
          title: "Интернет-магазины",
          desc: "Делаю интернет-магазины для B2B и розницы: каталоги, заявки, предзаказы, оплату и учёт заказов. Продумываю не только витрину, но и то, как заказ проходит дальше внутри бизнеса.",
        },
        {
          title: "Сайты для бизнеса и НКО",
          desc: "Создаю корпоративные сайты и лендинги, которые понятно объясняют, чем вы занимаетесь и почему к вам стоит обратиться. Сайт должен не просто выглядеть аккуратно, а помогать человеку принять решение и связаться с вами.",
        },
        {
          title: "CRM и интеграции",
          desc: "Связываю сайт, CRM, таблицы, почту и Telegram в одну рабочую систему. Чтобы заявки не терялись, данные не приходилось переносить вручную, а процессы было проще контролировать.",
        },
        {
          title: "Telegram-боты",
          desc: "Разрабатываю ботов для заявок, уведомлений, поддержки и внутренних задач команды. Использую их там, где они действительно экономят время и убирают повторяющуюся ручную работу.",
        },
      ],
    },
    process: {
      title: "От задачи бизнеса до работающего продукта",
      intro:
        "Я беру на себя весь процесс: погружаюсь в задачу, собираю концепцию, проектирую решение, разрабатываю, проверяю и помогаю с запуском.",
      cta: {
        title: "Есть задача, которую нужно разобрать?",
        text: "Коротко опишите проект в Telegram. Я задам несколько вопросов, оценю масштаб работы и скажу, какое решение здесь имеет смысл.",
        primary: "Обсудить проект в Telegram",
        secondary: "Посмотреть проекты",
      },
      steps: [
        {
          title: "Сначала разбираюсь",
          desc: "Не начинаю работу с дизайна или кода. Сначала выясняю, как устроен ваш бизнес: что вы предлагаете, кто ваши клиенты, откуда приходят заявки и где сейчас возникают сложности.",
        },
        {
          title: "Собираю концепцию и план",
          desc: "Фиксирую требования, изучаю рынок и конкурентов, определяю приоритеты, риски и объём работ. После этого предлагаю структуру проекта, техническое решение, этапы, сроки и предварительную стоимость.",
        },
        {
          title: "Делаю и показываю",
          desc: "Собираю визуальную концепцию и прототип, выбираю технологии под реальный масштаб проекта и начинаю разработку. Показываю промежуточные версии, чтобы важные решения можно было проверить до финального запуска.",
        },
        {
          title: "Проверяю и запускаю",
          desc: "Проверяю основные сценарии, формы, интеграции, безопасность и работу на разных устройствах. После запуска передаю документацию, объясняю логику продукта и при необходимости продолжаю техническую поддержку.",
        },
      ],
    },
    cases: {
      title: "Кейсы",
      viewDetails: "Подробнее",
      learnMore: "Подробнее",
      items: [
        {
          name: "SMT Premium Box",
          desc: "B2B-магазин подарочной упаковки. Каталог, предзаказы, кастомизация коробок и CRM-сценарии.",
          features: ["Более 50 товаров", "Система предзаказов", "Кастомизация коробок"],
          result: "Собственный канал продаж вне маркетплейса",
          link: "https://giftboxopt.ru",
          image: "smt-premium-box",
        },
        {
          name: "Вместе сильнее",
          desc: "Сайт инклюзивного пространства для мам и детей с особенностями развития.",
          features: ["Календарь событий", "Формы участия", "База ресурсов"],
          result: "Понятная точка входа для семей",
          link: "https://vmeste-silnee-hub.lovable.app/",
          image: "vmeste-silnee",
        },
        {
          name: "Unit Economics",
          desc: "Финансовый веб-сервис для ввода данных, расчёта моделей и анализа ключевых показателей.",
          features: ["Ввод данных", "Расчёт моделей", "Анализ показателей"],
          result: "Наглядные финансовые модели",
          link: "https://unit-econ-strategist.lovable.app/",
          image: "unit-econ",
        },
      ],
    },
    form: {
      title: "Расскажите о задаче",
      subtitle: "Отвечу в Telegram или на почту. Обычно в течение рабочего дня.",
      name: "Имя",
      namePlaceholder: "Как к вам обращаться",
      preferredContactMethod: "Как с вами связаться",
      methods: {
        telegram: "Telegram",
        email: "Email",
        whatsapp: "WhatsApp",
        other: "Другой способ",
      },
      contactValue: "Ваш контакт",
      contactPlaceholders: {
        telegram: "@username",
        email: "you@example.com",
        whatsapp: "+373 XX XXX XXX",
        other: "Укажите, как вас найти",
      },
      request: "Ваш запрос",
      requestPlaceholder: "Опишите задачу и что должно измениться в работе",
      budgetAndTimeline: "Расскажите о вашем бюджете и сроках",
      budgetPlaceholder: "Необязательно",
      optional: "необязательно",
      submit: "Отправить заявку",
      sending: "Отправка...",
      success: "Спасибо!",
      successMessage: "Заявка отправлена. Свяжусь с вами в ближайшее время.",
      error: "Ошибка",
      required: "Заполните обязательные поля",
      invalidContact: "Проверьте формат контакта",
      sendError: "Не удалось отправить заявку. Напишите, пожалуйста, в Telegram.",
    },
    contact: {
      title: "Готовы обсудить проект?",
      subtitle: "Telegram — основной способ связи. Email — как альтернатива.",
      location: "Молдова • ЕС • Remote",
      telegramLabel: "Написать в Telegram",
      emailLabel: "Написать на почту",
    },
    footer: {
      rights: "Все права защищены.",
    },
    seo: {
      title: "ANDREI SERBIAN — IT SOLUTIONS",
      description:
        "Сайты, интернет-магазины, CRM и Telegram-боты для малого бизнеса, e-commerce и социальных проектов. Связываю сайт, CRM и сервисы в одну рабочую систему.",
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
      },
      sizes: { small: "Малый", medium: "Средний", large: "Большой" },
      options: "Дополнительные опции",
      optionsList: {
        auth: "Авторизация и роли (+16ч)",
        payments: "Платежи (+24ч)",
        analytics: "Аналитика (+12ч)",
        multilingual: "Мультиязычность (+18ч)",
        supabase: "Интеграция Supabase (+20ч)",
        telegram: "Telegram интеграция (+12ч)",
      },
      urgency: "Срочная разработка (+30%)",
      estimate: "Смета проекта",
      hours: "ч",
      rate: "Ставка: €12.5/ч",
      total: "Итого",
      exportPdf: "Экспорт в PDF",
      sharetelegram: "Отправить в Telegram",
    },
  },

  en: {
    nav: {
      cases: "Cases",
      services: "Services",
      process: "How I work",
      contact: "Contact",
      cta: "Discuss a project",
      menu: "Menu",
    },
    hero: {
      title: "WEBSITE, CRM AND AUTOMATION\nSHOULD WORK TOGETHER.",
      subtitle:
        "I look into how requests, sales and client work actually flow inside your company. Then I connect the website, CRM, Telegram and the services you need into one working system.",
      cta: "Discuss a project",
      ctaSecondary: "View cases",
      specializations: "E-COMMERCE / WEBSITES / CRM / INTEGRATIONS / TELEGRAM",
      diagram: {
        marketing: "Marketing",
        sales: "Sales",
        site: "Website",
        crm: "CRM",
        automation: "Automation",
        analytics: "Analytics",
      },
    },
    services: {
      title: "Services",
      intro:
        "I build websites and internal tools for small business, online stores and NGOs. First I look into how the company actually works, and only then propose a technical solution.",
      items: [
        {
          title: "Online stores",
          desc: "I build stores for B2B and retail: catalogue, orders, pre-orders, payments and convenient order handling.",
        },
        {
          title: "Company and NGO websites",
          desc: "Websites that clearly explain what you do, build trust and bring in enquiries.",
        },
        {
          title: "CRM and integrations",
          desc: "I connect website, CRM, spreadsheets, email and Telegram so requests are not lost and data is not duplicated.",
        },
        {
          title: "Telegram bots",
          desc: "Bots for requests, notifications, support and internal team tasks.",
        },
      ],
    },
    process: {
      title: "How I work",
      intro:
        "I take on the whole process: understanding the task, shaping the concept, designing the solution, building, testing and helping with launch.",
      cta: {
        title: "Got a task worth looking into?",
        text: "Describe the project briefly on Telegram. I will ask a few questions, estimate the scope and tell you which solution makes sense here.",
        primary: "Discuss the project on Telegram",
        secondary: "See projects",
      },
      steps: [
        {
          title: "Understanding the task",
          desc: "I find out what should change in your operations and how requests, sales and client communication work today.",
        },
        {
          title: "Estimate and plan",
          desc: "I define the scope, priorities, stages, timeline and a preliminary project cost.",
        },
        {
          title: "Development with demos",
          desc: "I build the product in stages and show intermediate results so decisions can be verified before launch.",
        },
        {
          title: "Launch and support",
          desc: "I test the main scenarios, launch the product, hand over documentation and continue technical support if needed.",
        },
      ],
    },
    cases: {
      title: "Cases",
      viewDetails: "Details",
      learnMore: "Details",
      items: [
        {
          name: "SMT Premium Box",
          desc: "B2B gift packaging store. Catalogue, pre-orders, box customisation and CRM scenarios.",
          features: ["50+ products", "Pre-order system", "Box customisation"],
          result: "An own sales channel beyond marketplaces",
          link: "https://giftboxopt.ru",
          image: "smt-premium-box",
        },
        {
          name: "Vmeste Silnee",
          desc: "Website of an inclusive space for mothers and children with developmental differences.",
          features: ["Event calendar", "Participation forms", "Resource base"],
          result: "A clear entry point for families",
          link: "https://vmeste-silnee-hub.lovable.app/",
          image: "vmeste-silnee",
        },
        {
          name: "Unit Economics",
          desc: "A financial web service for entering data, calculating models and analysing key metrics.",
          features: ["Data input", "Model calculation", "Metrics analysis"],
          result: "Clear financial models",
          link: "https://unit-econ-strategist.lovable.app/",
          image: "unit-econ",
        },
      ],
    },
    form: {
      title: "Tell me about your task",
      subtitle: "I reply on Telegram or by email, usually within a working day.",
      name: "Name",
      namePlaceholder: "How should I address you",
      preferredContactMethod: "How to reach you",
      methods: {
        telegram: "Telegram",
        email: "Email",
        whatsapp: "WhatsApp",
        other: "Other",
      },
      contactValue: "Your contact",
      contactPlaceholders: {
        telegram: "@username",
        email: "you@example.com",
        whatsapp: "+373 XX XXX XXX",
        other: "How can I reach you",
      },
      request: "Your request",
      requestPlaceholder: "Describe the task and what should change in your work",
      budgetAndTimeline: "Tell me about your budget and timeline",
      budgetPlaceholder: "Optional",
      optional: "optional",
      submit: "Send request",
      sending: "Sending...",
      success: "Thank you!",
      successMessage: "Your request has been sent. I will get back to you shortly.",
      error: "Error",
      required: "Please fill in the required fields",
      invalidContact: "Please check the contact format",
      sendError: "Could not send the request. Please write to me on Telegram.",
    },
    contact: {
      title: "Ready to discuss a project?",
      subtitle: "Telegram is the main channel. Email works as an alternative.",
      location: "Moldova • EU • Remote",
      telegramLabel: "Message on Telegram",
      emailLabel: "Send an email",
    },
    footer: { rights: "All rights reserved." },
    seo: {
      title: "ANDREI SERBIAN — IT SOLUTIONS",
      description:
        "Websites, online stores, CRM and Telegram bots for small business, e-commerce and social projects. Website, CRM and services connected into one working system.",
    },
    calculator: {
      title: "Cost Calculator",
      projectType: "Project type",
      projectSize: "Project size",
      types: {
        ecommerce: "E-commerce solution",
        crm: "CRM/ERP system",
        admin: "Admin panel",
        telegram: "Telegram bot",
      },
      sizes: { small: "Small", medium: "Medium", large: "Large" },
      options: "Additional options",
      optionsList: {
        auth: "Auth and roles (+16h)",
        payments: "Payments (+24h)",
        analytics: "Analytics (+12h)",
        multilingual: "Multilingual (+18h)",
        supabase: "Supabase integration (+20h)",
        telegram: "Telegram integration (+12h)",
      },
      urgency: "Rush development (+30%)",
      estimate: "Project estimate",
      hours: "h",
      rate: "Rate: €12.5/h",
      total: "Total",
      exportPdf: "Export to PDF",
      sharetelegram: "Share via Telegram",
    },
  },

  ro: {
    nav: {
      cases: "Studii de caz",
      services: "Servicii",
      process: "Cum lucrez",
      contact: "Contact",
      cta: "Discutăm proiectul",
      menu: "Meniu",
    },
    hero: {
      title: "SITE, CRM ȘI AUTOMATIZARE\nTREBUIE SĂ LUCREZE ÎMPREUNĂ.",
      subtitle:
        "Analizez cum circulă cererile, vânzările și relația cu clienții în compania dumneavoastră. Apoi conectez site-ul, CRM-ul, Telegram și serviciile necesare într-un singur sistem funcțional.",
      cta: "Discutăm proiectul",
      ctaSecondary: "Vezi studiile de caz",
      specializations: "E-COMMERCE / WEBSITES / CRM / INTEGRATIONS / TELEGRAM",
      diagram: {
        marketing: "Marketing",
        sales: "Vânzări",
        site: "Site",
        crm: "CRM",
        automation: "Automatizare",
        analytics: "Analiză",
      },
    },
    services: {
      title: "Servicii",
      intro:
        "Dezvolt site-uri și instrumente interne pentru afaceri mici, magazine online și ONG-uri. Întâi înțeleg cum funcționează compania, abia apoi propun soluția tehnică.",
      items: [
        {
          title: "Magazine online",
          desc: "Construiesc magazine pentru B2B și retail: catalog, comenzi, precomenzi, plăți și gestionare comodă a comenzilor.",
        },
        {
          title: "Site-uri de companie și ONG",
          desc: "Site-uri care explică clar ce faceți, inspiră încredere și aduc solicitări.",
        },
        {
          title: "CRM și integrări",
          desc: "Conectez site-ul, CRM-ul, tabelele, e-mailul și Telegram astfel încât cererile să nu se piardă, iar datele să nu se dubleze.",
        },
        {
          title: "Boți Telegram",
          desc: "Boți pentru cereri, notificări, suport și sarcini interne ale echipei.",
        },
      ],
    },
    process: {
      title: "Cum lucrez",
      intro:
        "Preiau tot procesul: înțeleg sarcina, construiesc conceptul, proiectez soluția, dezvolt, verific și ajut la lansare.",
      cta: {
        title: "Aveți o sarcină de analizat?",
        text: "Descrieți scurt proiectul pe Telegram. Voi pune câteva întrebări, voi estima volumul și voi spune ce soluție are sens aici.",
        primary: "Discutăm proiectul pe Telegram",
        secondary: "Vedeți proiectele",
      },
      steps: [
        {
          title: "Analiza sarcinii",
          desc: "Aflu ce trebuie să se schimbe în activitatea companiei și cum funcționează acum cererile, vânzările și comunicarea cu clienții.",
        },
        {
          title: "Estimare și plan",
          desc: "Stabilesc volumul lucrărilor, prioritățile, etapele, termenele și costul preliminar al proiectului.",
        },
        {
          title: "Dezvoltare cu demo",
          desc: "Construiesc produsul pe etape și arăt rezultate intermediare, ca deciziile să poată fi verificate înainte de lansare.",
        },
        {
          title: "Lansare și suport",
          desc: "Verific scenariile principale, lansez produsul, predau documentația și continui suportul tehnic la nevoie.",
        },
      ],
    },
    cases: {
      title: "Studii de caz",
      viewDetails: "Detalii",
      learnMore: "Detalii",
      items: [
        {
          name: "SMT Premium Box",
          desc: "Magazin B2B de ambalaje cadou. Catalog, precomenzi, personalizarea cutiilor și scenarii CRM.",
          features: ["Peste 50 de produse", "Sistem de precomenzi", "Personalizarea cutiilor"],
          result: "Canal propriu de vânzări, independent de marketplace",
          link: "https://giftboxopt.ru",
          image: "smt-premium-box",
        },
        {
          name: "Vmeste Silnee",
          desc: "Site-ul unui spațiu incluziv pentru mame și copii cu particularități de dezvoltare.",
          features: ["Calendar de evenimente", "Formulare de participare", "Bază de resurse"],
          result: "Un punct de intrare clar pentru familii",
          link: "https://vmeste-silnee-hub.lovable.app/",
          image: "vmeste-silnee",
        },
        {
          name: "Unit Economics",
          desc: "Serviciu web financiar pentru introducerea datelor, calculul modelelor și analiza indicatorilor cheie.",
          features: ["Introducerea datelor", "Calculul modelelor", "Analiza indicatorilor"],
          result: "Modele financiare clare",
          link: "https://unit-econ-strategist.lovable.app/",
          image: "unit-econ",
        },
      ],
    },
    form: {
      title: "Povestiți-mi despre sarcină",
      subtitle: "Răspund pe Telegram sau pe e-mail, de obicei într-o zi lucrătoare.",
      name: "Nume",
      namePlaceholder: "Cum să vă adresez",
      preferredContactMethod: "Cum vă contactez",
      methods: {
        telegram: "Telegram",
        email: "Email",
        whatsapp: "WhatsApp",
        other: "Altă metodă",
      },
      contactValue: "Contactul dumneavoastră",
      contactPlaceholders: {
        telegram: "@username",
        email: "you@example.com",
        whatsapp: "+373 XX XXX XXX",
        other: "Cum vă pot găsi",
      },
      request: "Solicitarea dumneavoastră",
      requestPlaceholder: "Descrieți sarcina și ce trebuie să se schimbe în activitate",
      budgetAndTimeline: "Povestiți despre buget și termene",
      budgetPlaceholder: "Opțional",
      optional: "opțional",
      submit: "Trimite solicitarea",
      sending: "Se trimite...",
      success: "Mulțumesc!",
      successMessage: "Solicitarea a fost trimisă. Vă contactez în curând.",
      error: "Eroare",
      required: "Completați câmpurile obligatorii",
      invalidContact: "Verificați formatul contactului",
      sendError: "Nu am putut trimite solicitarea. Scrieți-mi pe Telegram.",
    },
    contact: {
      title: "Gata să discutăm proiectul?",
      subtitle: "Telegram este canalul principal. E-mailul este alternativa.",
      location: "Moldova • UE • Remote",
      telegramLabel: "Scrieți pe Telegram",
      emailLabel: "Trimiteți un e-mail",
    },
    footer: { rights: "Toate drepturile rezervate." },
    seo: {
      title: "ANDREI SERBIAN — IT SOLUTIONS",
      description:
        "Site-uri, magazine online, CRM și boți Telegram pentru business mic, e-commerce și proiecte sociale.",
    },
    calculator: {
      title: "Calculator de cost",
      projectType: "Tip de proiect",
      projectSize: "Mărimea proiectului",
      types: {
        ecommerce: "Soluție e-commerce",
        crm: "Sistem CRM/ERP",
        admin: "Panou de administrare",
        telegram: "Bot Telegram",
      },
      sizes: { small: "Mic", medium: "Mediu", large: "Mare" },
      options: "Opțiuni suplimentare",
      optionsList: {
        auth: "Autentificare și roluri (+16h)",
        payments: "Plăți (+24h)",
        analytics: "Analiză (+12h)",
        multilingual: "Multilingv (+18h)",
        supabase: "Integrare Supabase (+20h)",
        telegram: "Integrare Telegram (+12h)",
      },
      urgency: "Dezvoltare urgentă (+30%)",
      estimate: "Estimare proiect",
      hours: "h",
      rate: "Tarif: €12.5/h",
      total: "Total",
      exportPdf: "Export PDF",
      sharetelegram: "Trimite pe Telegram",
    },
  },
} as const;

export type Lang = keyof typeof translations;
export const SUPPORTED_LANGS: Lang[] = ["ru", "en", "ro"];