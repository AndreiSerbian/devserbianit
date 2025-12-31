import smtPremiumBox from "@/assets/cases/smt-premium-box.png";
import foodsaur from "@/assets/cases/foodsaur.png";
import vmesteSilnee from "@/assets/cases/vmeste-silnee.png";
import unitEcon from "@/assets/cases/unit-econ.png";

export interface CaseStudyDetail {
  id: string;
  name: {
    ru: string;
    en: string;
    ro: string;
  };
  category: {
    ru: string;
    en: string;
    ro: string;
  };
  desc: {
    ru: string;
    en: string;
    ro: string;
  };
  fullDesc: {
    ru: string;
    en: string;
    ro: string;
  };
  features: {
    ru: string[];
    en: string[];
    ro: string[];
  };
  result: {
    ru: string;
    en: string;
    ro: string;
  };
  link: string;
  image: string;
  technologies: string[];
  duration: {
    ru: string;
    en: string;
    ro: string;
  };
  challenge: {
    ru: string;
    en: string;
    ro: string;
  };
  solution: {
    ru: string;
    en: string;
    ro: string;
  };
}

export const caseStudiesData: CaseStudyDetail[] = [
  {
    id: "smt-premium-box",
    name: {
      ru: "SMT Premium Box",
      en: "SMT Premium Box",
      ro: "SMT Premium Box"
    },
    category: {
      ru: "E-commerce",
      en: "E-commerce",
      ro: "E-commerce"
    },
    desc: {
      ru: "Оптовый e-commerce для подарочных коробок с вариациями.",
      en: "Wholesale e-commerce for gift boxes with variants.",
      ro: "E-commerce en-gros pentru cutii cadou cu variante."
    },
    fullDesc: {
      ru: "Полноценная e-commerce платформа для оптовой продажи подарочных коробок. Система позволяет клиентам выбирать товары с различными вариациями (цвет, размер, тип упаковки), оформлять предзаказы и получать автоматические email-подтверждения.",
      en: "Full-featured e-commerce platform for wholesale gift box sales. The system allows customers to select products with various variations (color, size, packaging type), place pre-orders, and receive automatic email confirmations.",
      ro: "Platformă e-commerce completă pentru vânzarea en-gros a cutiilor cadou. Sistemul permite clienților să selecteze produse cu diverse variante (culoare, mărime, tip ambalaj), să plaseze precomenzi și să primească confirmări automate prin email."
    },
    features: {
      ru: ["Карточки с вариациями", "Предзаказ", "Email-подтверждение", "Адаптивный дизайн", "Каталог товаров"],
      en: ["Variant cards", "Pre-order", "Email confirmation", "Responsive design", "Product catalog"],
      ro: ["Carduri cu variante", "Pre-comandă", "Confirmare email", "Design responsiv", "Catalog produse"]
    },
    result: {
      ru: "Сокращение времени обработки B2B",
      en: "Reduced B2B processing time",
      ro: "Reducerea timpului de procesare B2B"
    },
    link: "https://giftboxopt.ru",
    image: smtPremiumBox,
    technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
    duration: {
      ru: "3 недели",
      en: "3 weeks",
      ro: "3 săptămâni"
    },
    challenge: {
      ru: "Клиенту требовалась система, которая могла бы обрабатывать сложные вариации товаров и автоматизировать процесс оформления оптовых заказов. Существующие решения не поддерживали нужную гибкость.",
      en: "The client needed a system that could handle complex product variations and automate the wholesale ordering process. Existing solutions didn't support the required flexibility.",
      ro: "Clientul avea nevoie de un sistem care să gestioneze variații complexe de produse și să automatizeze procesul de comandă en-gros. Soluțiile existente nu ofereau flexibilitatea necesară."
    },
    solution: {
      ru: "Разработали кастомную систему карточек товаров с динамическими вариациями, интегрировали email-уведомления и создали удобный интерфейс для B2B-клиентов.",
      en: "Developed a custom product card system with dynamic variations, integrated email notifications, and created a user-friendly interface for B2B clients.",
      ro: "Am dezvoltat un sistem personalizat de carduri de produse cu variații dinamice, am integrat notificări email și am creat o interfață prietenoasă pentru clienții B2B."
    }
  },
  {
    id: "foodsaur",
    name: {
      ru: "FoodSaur",
      en: "FoodSaur",
      ro: "FoodSaur"
    },
    category: {
      ru: "Маркетплейс",
      en: "Marketplace",
      ro: "Marketplace"
    },
    desc: {
      ru: "Маркетплейс для локальных производителей с админ-панелью и ролями.",
      en: "Marketplace for local producers with admin panel and roles.",
      ro: "Marketplace pentru producători locali cu panou admin și roluri."
    },
    fullDesc: {
      ru: "Маркетплейс скидок для локальных ресторанов и производителей еды. Платформа объединяет заведения, предлагающие скидки на блюда, с покупателями, ищущими выгодные предложения. Включает полноценную админ-панель с разграничением ролей.",
      en: "Discount marketplace for local restaurants and food producers. The platform connects establishments offering discounts on dishes with buyers looking for great deals. Includes a full-featured admin panel with role separation.",
      ro: "Marketplace de reduceri pentru restaurante și producători locali de mâncare. Platforma conectează localurile care oferă reduceri la preparate cu cumpărătorii care caută oferte avantajoase. Include un panou de administrare complet cu separarea rolurilor."
    },
    features: {
      ru: ["Каталоги и расписания", "Админ-панель с RLS", "Telegram уведомления", "Поиск по категориям", "Система ролей"],
      en: ["Catalogs & schedules", "Admin with RLS", "Telegram notifications", "Category search", "Role system"],
      ro: ["Cataloage și programări", "Admin cu RLS", "Notificări Telegram", "Căutare pe categorii", "Sistem de roluri"]
    },
    result: {
      ru: "Меньше ручных ошибок, быстрее обработка",
      en: "Fewer errors, faster processing",
      ro: "Mai puține erori, procesare mai rapidă"
    },
    link: "https://foodsaur.netlify.app/",
    image: foodsaur,
    technologies: ["React", "TypeScript", "Supabase", "RLS", "Telegram API"],
    duration: {
      ru: "4 недели",
      en: "4 weeks",
      ro: "4 săptămâni"
    },
    challenge: {
      ru: "Необходимо было создать платформу, которая позволяла бы ресторанам самостоятельно управлять своими предложениями, при этом обеспечивая безопасность данных и разграничение доступа между пользователями.",
      en: "It was necessary to create a platform that would allow restaurants to independently manage their offers while ensuring data security and access control between users.",
      ro: "A fost necesar să creăm o platformă care să permită restaurantelor să-și gestioneze independent ofertele, asigurând în același timp securitatea datelor și controlul accesului între utilizatori."
    },
    solution: {
      ru: "Реализовали систему на базе Supabase с Row Level Security, создали интуитивную админ-панель для ресторанов и интегрировали Telegram-уведомления для мгновенной связи с клиентами.",
      en: "Implemented a Supabase-based system with Row Level Security, created an intuitive admin panel for restaurants, and integrated Telegram notifications for instant customer communication.",
      ro: "Am implementat un sistem bazat pe Supabase cu Row Level Security, am creat un panou de administrare intuitiv pentru restaurante și am integrat notificări Telegram pentru comunicare instantanee cu clienții."
    }
  },
  {
    id: "vmeste-silnee",
    name: {
      ru: "Вместе сильнее",
      en: "Together Stronger",
      ro: "Împreună mai puternici"
    },
    category: {
      ru: "Социальный проект",
      en: "Social Project",
      ro: "Proiect social"
    },
    desc: {
      ru: "Сайт инклюзивного пространства для мам и детей в Молдове.",
      en: "Website for inclusive space initiative in Moldova.",
      ro: "Site pentru inițiativa spațiului incluziv din Moldova."
    },
    fullDesc: {
      ru: "Информационный портал для инклюзивного сообщества, помогающего семьям с детьми с особенностями развития в Молдове. Сайт предоставляет доступ к юридической информации, психологической поддержке и ресурсам сообщества.",
      en: "Information portal for an inclusive community helping families with children with special needs in Moldova. The site provides access to legal information, psychological support, and community resources.",
      ro: "Portal informativ pentru o comunitate incluzivă care ajută familiile cu copii cu nevoi speciale din Moldova. Site-ul oferă acces la informații juridice, suport psihologic și resurse comunitare."
    },
    features: {
      ru: ["Календарь событий", "Формы волонтёров", "База ресурсов", "Юридическая информация", "Психологическая поддержка"],
      en: ["Events calendar", "Volunteer forms", "Resources base", "Legal information", "Psychological support"],
      ro: ["Calendar evenimente", "Formulare voluntari", "Baza de resurse", "Informații juridice", "Suport psihologic"]
    },
    result: {
      ru: "Удобная точка входа для семей",
      en: "Clear entry point for families",
      ro: "Punct de intrare clar pentru familii"
    },
    link: "https://vmeste-silnee-hub.lovable.app/",
    image: vmesteSilnee,
    technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
    duration: {
      ru: "2 недели",
      en: "2 weeks",
      ro: "2 săptămâni"
    },
    challenge: {
      ru: "Организации требовался сайт, который был бы доступен и понятен для родителей в стрессовой ситуации, при этом содержал бы структурированную информацию о правах, льготах и доступных ресурсах.",
      en: "The organization needed a website that would be accessible and understandable for parents in stressful situations while containing structured information about rights, benefits, and available resources.",
      ro: "Organizația avea nevoie de un site care să fie accesibil și ușor de înțeles pentru părinții aflați în situații stresante, conținând în același timp informații structurate despre drepturi, beneficii și resurse disponibile."
    },
    solution: {
      ru: "Создали понятную структуру с разделами по типам поддержки, добавили возможность записи на консультации и интегрировали Telegram для быстрой связи с командой.",
      en: "Created a clear structure with sections by support type, added the ability to book consultations, and integrated Telegram for quick communication with the team.",
      ro: "Am creat o structură clară cu secțiuni pe tipuri de suport, am adăugat posibilitatea de a programa consultații și am integrat Telegram pentru comunicare rapidă cu echipa."
    }
  },
  {
    id: "unit-econ-strategist",
    name: {
      ru: "Unit Economics Strategist",
      en: "Unit Economics Strategist",
      ro: "Unit Economics Strategist"
    },
    category: {
      ru: "Бизнес-консалтинг",
      en: "Business Consulting",
      ro: "Consultanță de afaceri"
    },
    desc: {
      ru: "Платформа для бизнес-консалтинга и анализа юнит-экономики.",
      en: "Business consulting platform for unit economics analysis.",
      ro: "Platformă de consultanță pentru analiza economiei unitare."
    },
    fullDesc: {
      ru: "Научная платформа для анализа юнит-экономики и конкурентной стратегии. Позволяет рассчитывать ключевые метрики бизнеса, сравнивать сценарии развития, анализировать конкурентов и применять теорию игр для стратегических решений.",
      en: "Scientific platform for unit economics and competitive strategy analysis. Allows calculating key business metrics, comparing development scenarios, analyzing competitors, and applying game theory for strategic decisions.",
      ro: "Platformă științifică pentru analiza economiei unitare și a strategiei competitive. Permite calcularea metricilor cheie de business, compararea scenariilor de dezvoltare, analiza concurenților și aplicarea teoriei jocurilor pentru decizii strategice."
    },
    features: {
      ru: ["Расчёт метрик бизнеса", "Сравнение сценариев", "Анализ конкурентов", "Теория игр", "Интерактивный онбординг"],
      en: ["Business metrics calculation", "Scenario comparison", "Competitor analysis", "Game theory", "Interactive onboarding"],
      ro: ["Calculul metricilor de business", "Comparație scenarii", "Analiză concurenți", "Teoria jocurilor", "Onboarding interactiv"]
    },
    result: {
      ru: "Научный подход к стратегии",
      en: "Scientific approach to strategy",
      ro: "Abordare științifică a strategiei"
    },
    link: "https://unit-econ-strategist.lovable.app/",
    image: unitEcon,
    technologies: ["React", "TypeScript", "Tailwind CSS", "Recharts", "Supabase"],
    duration: {
      ru: "5 недель",
      en: "5 weeks",
      ro: "5 săptămâni"
    },
    challenge: {
      ru: "Необходимо было перевести сложные экономические модели и теорию игр в понятный интерфейс, который могли бы использовать предприниматели без глубоких знаний в экономике.",
      en: "It was necessary to translate complex economic models and game theory into an understandable interface that entrepreneurs without deep economics knowledge could use.",
      ro: "A fost necesar să traducem modele economice complexe și teoria jocurilor într-o interfață ușor de înțeles pe care antreprenorii fără cunoștințe profunde de economie să o poată folosi."
    },
    solution: {
      ru: "Разработали пошаговый онбординг, визуализацию данных через графики и интерактивные калькуляторы, которые помогают пользователям понять свою юнит-экономику.",
      en: "Developed step-by-step onboarding, data visualization through charts, and interactive calculators that help users understand their unit economics.",
      ro: "Am dezvoltat un onboarding pas cu pas, vizualizarea datelor prin grafice și calculatoare interactive care ajută utilizatorii să înțeleagă economia unitară a afacerii lor."
    }
  }
];

export const getCaseStudyById = (id: string): CaseStudyDetail | undefined => {
  return caseStudiesData.find(study => study.id === id);
};
