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
        crm: "CRM/Админ-панель",
        integration: "Интеграция"
      },
      questions: {
        ecommerce: [
          "Как называется ваш бренд или компания, и чем вы занимаетесь?",
          "Есть ли у вас уже сайт или страницы в соцсетях? (если да — укажите ссылки)",
          "Какая основная цель создания сайта? (продажи, каталог, улучшение имиджа, удобство заказов и т.д.)",
          "Какие товары или услуги вы хотите продавать через сайт?",
          "Есть ли у ваших товаров варианты — например, цвета, размеры, упаковки?",
          "Сколько примерно товаров вы хотите разместить на старте?",
          "Как вы хотите, чтобы проходил процесс оформления заказа? (через корзину, email-подтверждение, Telegram-бот и т.д.)",
          "Какие способы оплаты и доставки вы планируете использовать?",
          "Хотите ли вы иметь админ-панель для управления товарами и заказами?",
          "Есть ли у вас примеры сайтов, дизайн которых вам нравится?",
          "Нужно ли адаптировать сайт под несколько языков (русский, румынский, английский и др.)?",
          "К какому сроку вы хотите запустить проект и какой ориентировочный бюджет закладываете?"
        ],
        telegram: [
          "Как называется ваш бизнес или проект?",
          "Какую основную задачу должен решать бот? (уведомления, приём заказов, поддержка клиентов и т.д.)",
          "С какими системами бот должен интегрироваться? (сайт, CRM, база данных и т.д.)",
          "Нужна ли авторизация и идентификация пользователей?",
          "Какие команды и функции должен выполнять бот?",
          "Нужна ли база данных для хранения информации о пользователях и их действиях?",
          "Планируете ли вы приём платежей через бота?",
          "Сколько пользователей ожидаете в первые месяцы работы?",
          "Нужна ли веб админ-панель для управления ботом и просмотра статистики?",
          "Есть ли примеры ботов, функционал которых вам нравится?",
          "Нужна ли поддержка нескольких языков?",
          "К какому сроку нужно запустить бота и какой бюджет вы планируете?"
        ],
        crm: [
          "Как называется ваша компания и в какой сфере вы работаете?",
          "Какие бизнес-процессы нужно автоматизировать? (продажи, склад, документы, задачи и т.д.)",
          "Сколько сотрудников будут работать с системой?",
          "Какие роли и уровни доступа нужны? (админ, менеджер, оператор и т.д.)",
          "Какие данные нужно хранить и обрабатывать? (клиенты, заказы, товары, финансы и т.д.)",
          "Нужна ли интеграция с существующими системами? (1С, почта, мессенджеры и т.д.)",
          "Какие отчёты и аналитика вам нужны?",
          "Нужны ли уведомления? (email, Telegram, push)",
          "Есть ли особые требования к безопасности данных?",
          "Есть ли примеры систем, интерфейс которых вам нравится?",
          "Нужна ли мобильная версия или приложение?",
          "Планируемый срок запуска и бюджет проекта?"
        ],
        integration: [
          "Как называется ваша компания?",
          "Какие системы или сервисы нужно интегрировать? (укажите названия)",
          "Какая основная цель интеграции? (автоматизация, синхронизация данных и т.д.)",
          "Есть ли API у этих систем или потребуется разработка собственных коннекторов?",
          "Какие данные должны передаваться между системами?",
          "Как часто должна происходить синхронизация? (в реальном времени, раз в час, раз в день)",
          "Нужна ли обработка ошибок и автоматическое повторение при сбоях?",
          "Есть ли требования к производительности? (объём данных, скорость обработки)",
          "Нужен ли мониторинг работы интеграции и уведомления об ошибках?",
          "Есть ли у вас документация API существующих систем?",
          "Есть ли примеры похожих интеграций?",
          "Планируемый срок реализации и бюджет?"
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
        crm: "CRM/Admin Panel",
        integration: "Integration"
      },
      questions: {
        ecommerce: [
          "What is your brand or company name and what do you do?",
          "Do you already have a website or social media pages? (if yes, please provide links)",
          "What is the main goal of creating the website? (sales, catalog, brand image, order convenience, etc.)",
          "What products or services do you want to sell through the website?",
          "Do your products have variants — for example, colors, sizes, packaging?",
          "Approximately how many products do you want to list at launch?",
          "How would you like the order process to work? (cart, email confirmation, Telegram bot, etc.)",
          "What payment and delivery methods do you plan to use?",
          "Would you like an admin panel to manage products and orders?",
          "Do you have examples of websites whose design you like?",
          "Do you need the site adapted for multiple languages (Russian, Romanian, English, etc.)?",
          "By what date do you want to launch the project and what is your approximate budget?"
        ],
        telegram: [
          "What is your business or project name?",
          "What main task should the bot solve? (notifications, order taking, customer support, etc.)",
          "What systems should the bot integrate with? (website, CRM, database, etc.)",
          "Do you need user authorization and identification?",
          "What commands and functions should the bot perform?",
          "Do you need a database to store information about users and their actions?",
          "Do you plan to accept payments through the bot?",
          "How many users do you expect in the first months of operation?",
          "Do you need a web admin panel to manage the bot and view statistics?",
          "Are there examples of bots whose functionality you like?",
          "Do you need support for multiple languages?",
          "By what date do you need to launch the bot and what is your budget?"
        ],
        crm: [
          "What is your company name and what field do you work in?",
          "What business processes need to be automated? (sales, warehouse, documents, tasks, etc.)",
          "How many employees will work with the system?",
          "What roles and access levels are needed? (admin, manager, operator, etc.)",
          "What data needs to be stored and processed? (clients, orders, products, finances, etc.)",
          "Do you need integration with existing systems? (1C, email, messengers, etc.)",
          "What reports and analytics do you need?",
          "Do you need notifications? (email, Telegram, push)",
          "Are there special data security requirements?",
          "Are there examples of systems whose interface you like?",
          "Do you need a mobile version or app?",
          "Planned launch date and project budget?"
        ],
        integration: [
          "What is your company name?",
          "What systems or services need to be integrated? (specify names)",
          "What is the main goal of the integration? (automation, data synchronization, etc.)",
          "Do these systems have APIs or will custom connectors need to be developed?",
          "What data should be transferred between systems?",
          "How often should synchronization occur? (real-time, hourly, daily)",
          "Do you need error handling and automatic retry on failures?",
          "Are there performance requirements? (data volume, processing speed)",
          "Do you need integration monitoring and error notifications?",
          "Do you have API documentation for existing systems?",
          "Are there examples of similar integrations?",
          "Planned implementation timeline and budget?"
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
        crm: "CRM/Panou Admin",
        integration: "Integrare"
      },
      questions: {
        ecommerce: [
          "Care este numele brandului sau companiei tale și cu ce te ocupi?",
          "Ai deja un site sau pagini pe rețele sociale? (dacă da, oferă linkurile)",
          "Care este obiectivul principal al creării site-ului? (vânzări, catalog, imagine, comenzi, etc.)",
          "Ce produse sau servicii vrei să vinzi prin site?",
          "Au produsele tale variante — de exemplu, culori, mărimi, ambalaje?",
          "Câte produse vrei să listezi la lansare?",
          "Cum vrei să funcționeze procesul de comandă? (coș, confirmare email, bot Telegram, etc.)",
          "Ce metode de plată și livrare planifici să folosești?",
          "Vrei un panou de administrare pentru gestionarea produselor și comenzilor?",
          "Ai exemple de site-uri al căror design îți place?",
          "Ai nevoie ca site-ul să fie adaptat pentru mai multe limbi?",
          "Până la ce dată vrei să lansezi proiectul și care este bugetul aproximativ?"
        ],
        telegram: [
          "Care este numele afacerii sau proiectului tău?",
          "Ce sarcină principală trebuie să rezolve botul? (notificări, preluare comenzi, suport, etc.)",
          "Cu ce sisteme trebuie să se integreze botul? (site, CRM, bază de date, etc.)",
          "Ai nevoie de autorizare și identificare a utilizatorilor?",
          "Ce comenzi și funcții trebuie să execute botul?",
          "Ai nevoie de o bază de date pentru stocarea informațiilor despre utilizatori?",
          "Planifici să accepți plăți prin bot?",
          "Câți utilizatori aștepți în primele luni de funcționare?",
          "Ai nevoie de un panou web pentru gestionarea botului și vizualizarea statisticilor?",
          "Ai exemple de boți a căror funcționalitate îți place?",
          "Ai nevoie de suport pentru mai multe limbi?",
          "Până când trebuie lansat botul și care este bugetul?"
        ],
        crm: [
          "Care este numele companiei și în ce domeniu lucrezi?",
          "Ce procese de business trebuie automatizate? (vânzări, depozit, documente, etc.)",
          "Câți angajați vor lucra cu sistemul?",
          "Ce roluri și niveluri de acces sunt necesare? (admin, manager, operator, etc.)",
          "Ce date trebuie stocate și procesate? (clienți, comenzi, produse, finanțe, etc.)",
          "Ai nevoie de integrare cu sisteme existente? (1C, email, mesagerie, etc.)",
          "Ce rapoarte și analize ai nevoie?",
          "Ai nevoie de notificări? (email, Telegram, push)",
          "Există cerințe speciale de securitate a datelor?",
          "Ai exemple de sisteme a căror interfață îți place?",
          "Ai nevoie de versiune mobilă sau aplicație?",
          "Data planificată de lansare și bugetul proiectului?"
        ],
        integration: [
          "Care este numele companiei tale?",
          "Ce sisteme sau servicii trebuie integrate? (specifică numele)",
          "Care este obiectivul principal al integrării? (automatizare, sincronizare date, etc.)",
          "Au aceste sisteme API sau trebuie dezvoltate conectori personalizați?",
          "Ce date trebuie transferate între sisteme?",
          "Cât de des trebuie să aibă loc sincronizarea? (timp real, orar, zilnic)",
          "Ai nevoie de gestionarea erorilor și reîncercare automată?",
          "Există cerințe de performanță? (volum date, viteză de procesare)",
          "Ai nevoie de monitorizarea integrării și notificări despre erori?",
          "Ai documentație API pentru sistemele existente?",
          "Există exemple de integrări similare?",
          "Termenul planificat de implementare și bugetul?"
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
