# Serbian IT Portfolio

Роль: Ты — senior фронтенд-разработчик и продуктовый дизайнер. Создай production-ready одностраничный сайт-портфолио «Serbian IT Development» для лидогенерации B2B.

Цель

Коротко и убедительно показать ценность: кто мы, что делаем, 3 реальных кейса, калькулятор бюджета, быстрый контакт через Telegram. Минимум отвлечений, максимум смысла.

Ограничения (важно)

В UI не упоминать стек и технологии.

Верстка: HTML + Tailwind (CDN).

Скрипты: чистый JavaScript (один app.js).

Одна страница (index.html) + модальные окна.

Тёмная тема по умолчанию + переключатель темы.

Без CMS/бэкенда/React. Всё статично.

Архитектура страницы

Header (sticky): логотип-текст Serbian IT Development; меню: Services, Cases, Calculator, Contact, Language (RU/EN/RO); переключатель темы.

Hero (абстракция/градиент, без фото): заголовок про комплексный подход и бизнес-видение; 1–2 строки саб-текста; кнопки Calculate Budget (скролл к калькулятору) и Write in Telegram (placeholder https://t.me/your_username).

Services (3–6 карточек, упор на выгоды): E-commerce, CRM/ERP, Admin panels, Telegram-боты/интеграции, Интеграции с Supabase, Аудит/архитектура.

Cases (3 карточки — реальные проекты): FoodSaur, SMT Premium Box, Вместе сильнее. В каждой: название, короткий контекст/задача (2 предложения), bullets 3–5 «Что сделали», результат (1 польза/эффект). Кнопка «Запросить демо» → модалка формы (имя, email, сообщение) — фейковая отправка + toast «Sent».

Calculator (конфигуратор сметы):

Поля: Тип проекта (E-commerce, CRM/ERP, Admin panel, Telegram bot, Custom integration), Размер (Small/Medium/Large), Опции (Auth/roles, Payments, Analytics, Multilingual, Supabase integration, Telegram notifications), Срочность (Normal, Rush +20%).

Итоговая смета: редактируемая ставка (дефолт 30 €/h), часы и сумма в реальном времени.

Кнопки: Download Estimate (PDF) (html2canvas + jsPDF) и Share via Telegram (текст-резюме сметы).

Contact / CTA: заголовок «Let’s talk business»; кнопки Write in Telegram, Email (mailto), Request a Call (модалка). География: Молдова, ЕС, Россия; удалённо.

Footer: копирайт, краткий дисклеймер, соц-линки (Telegram).

I18N (RU/EN/RO) — объект в app.js

Сделай переключение RU/EN/RO без перезагрузки (по data-атрибутам).

const i18n = {
  ru: {
    nav: { services: "Услуги", cases: "Кейсы", calc: "Калькулятор", contact: "Контакты", language: "Язык" },
    hero: {
      title: "Комплексный подход к IT-решениям для бизнеса",
      subtitle: "Не просто «пишем код». Смотрим на продукт и процессы глазами бизнеса: от гипотез до измеримого результата.",
      primary: "Рассчитать бюджет",
      secondary: "Написать в Telegram"
    },
    services: {
      title: "Что мы делаем",
      items: [
        { title: "E-commerce решения", desc: "Каталоги, корзина, оплата, скидки, отчёты — ориентир на конверсию и LTV." },
        { title: "CRM / внутренние панели", desc: "Процессы, роли и доступы — под вашу операционку и метрики." },
        { title: "Админ-панели", desc: "Удобный контроль контента, заказов, инвентаря и команд." },
        { title: "Telegram-боты", desc: "Оповещения, заявки, админ-функции и внешние интеграции." },
        { title: "Интеграции с Supabase", desc: "Хранилище, роли, функции, email — быстро и безопасно." },
        { title: "Аудит и архитектура", desc: "Разбор текущего решения и дорожная карта улучшений." }
      ]
    },
    cases: {
      title: "Кейсы",
      cta: "Запросить демо",
      cards: [
        {
          name: "FoodSaur",
          task: "Маркетплейс для локальных производителей с скидками и тайм-слотами выдачи: витрины, админ-панель, заявки и ролевая модель доступа.",
          did: ["Каталоги и расписания", "Админ-панель с ролями (RLS)", "Уведомления в Telegram", "Email-подтверждения заказов"],
          result: "Пилотные продажи и упорядоченные процессы: меньше ручных ошибок и быстрее обработка заказов."
        },
        {
          name: "SMT Premium Box",
          task: "Оптовый e-commerce для подарочных коробок: вариации цвета/размера, предзаказ, учёт остатков и подтверждение через email.",
          did: ["Карточки с вариациями", "Корзина и предзаказ", "Email-подтверждение", "Интеграции с учётом/таблицами"],
          result: "Сокращение времени обработки и лучшая прозрачность ассортимента для B2B."
        },
        {
          name: "Вместе сильнее",
          task: "Информационный сайт инициативы инклюзивного пространства для мам и детей с особыми потребностями в Молдове: ресурсы, события и поддержка сообщества.",
          did: ["Структура разделов и навигация", "Календарь событий и заявки волонтёров", "Страница ресурсов и партнёров", "Контактные формы"],
          result: "Удобная точка входа для семей и волонтёров: единое место с полезной информацией и возможностью быстро связаться."
        }
      ]
    },
    calc: {
      title: "Калькулятор бюджета",
      rate: "Ставка, €/час",
      projectType: "Тип проекта",
      size: "Размер и сложность",
      options: "Опции",
      urgency: "Срочность",
      estimate: "Оценка",
      download: "Скачать смету (PDF)",
      share: "Поделиться в Telegram",
      resultHours: "Часы",
      resultTotal: "Итого, €",
      types: ["E-commerce", "CRM/ERP", "Admin panel", "Telegram bot", "Custom integration"],
      sizes: ["Small", "Medium", "Large"],
      opts: ["Auth/roles", "Payments", "Analytics", "Multilingual", "Supabase integration", "Telegram notifications"],
      urgencies: ["Обычная", "Срочно (+20%)"]
    },
    contact: {
      title: "Готовы обсудить задачу?",
      tg: "Написать в Telegram",
      email: "Написать на email",
      call: "Запросить звонок"
    }
  },
  en: {
    nav: { services: "Services", cases: "Cases", calc: "Calculator", contact: "Contact", language: "Language" },
    hero: {
      title: "A comprehensive approach to IT solutions for business",
      subtitle: "Beyond coding: we look at your product and processes through a business lens — from hypotheses to measurable outcomes.",
      primary: "Calculate Budget",
      secondary: "Write in Telegram"
    },
    services: {
      title: "What we do",
      items: [
        { title: "E-commerce solutions", desc: "Catalogs, cart, payments, discounts, reporting — focused on conversion and LTV." },
        { title: "CRM / internal panels", desc: "Processes, roles, and access aligned with your operations and metrics." },
        { title: "Admin panels", desc: "Clear control over content, orders, inventory, and teams." },
        { title: "Telegram bots", desc: "Notifications, requests, admin features, and external integrations." },
        { title: "Supabase integrations", desc: "Storage, roles, functions, email — fast and reliable." },
        { title: "Audit & architecture", desc: "Assessment and a practical roadmap for improvements." }
      ]
    },
    cases: {
      title: "Case Studies",
      cta: "Request a Demo",
      cards: [
        {
          name: "FoodSaur",
          task: "A marketplace for local producers with discounts and pickup time slots: storefronts, admin panel, requests, and role-based access.",
          did: ["Catalogs & schedules", "Admin panel with roles (RLS)", "Telegram notifications", "Email order confirmations"],
          result: "Pilot sales and streamlined operations: fewer manual errors and faster order handling."
        },
        {
          name: "SMT Premium Box",
          task: "Wholesale e-commerce for gift boxes: color/size variants, pre-order flow, stock tracking, and email confirmation.",
          did: ["Variant product cards", "Cart & pre-order", "Email confirmation", "Integrations with inventory/sheets"],
          result: "Reduced processing time and improved assortment visibility for B2B."
        },
        {
          name: "Together Stronger",
          task: "An informational website for an inclusive space initiative for mothers and children with special needs in Moldova: resources, events, and community support.",
          did: ["Section structure & navigation", "Events calendar and volunteer sign-ups", "Resources & partners page", "Contact forms"],
          result: "A clear entry point for families and volunteers with quick access to help and relevant information."
        }
      ]
    },
    calc: {
      title: "Budget Calculator",
      rate: "Rate, €/hour",
      projectType: "Project type",
      size: "Size & complexity",
      options: "Options",
      urgency: "Urgency",
      estimate: "Estimate",
      download: "Download Estimate (PDF)",
      share: "Share via Telegram",
      resultHours: "Hours",
      resultTotal: "Total, €",
      types: ["E-commerce", "CRM/ERP", "Admin panel", "Telegram bot", "Custom integration"],
      sizes: ["Small", "Medium", "Large"],
      opts: ["Auth/roles", "Payments", "Analytics", "Multilingual", "Supabase integration", "Telegram notifications"],
      urgencies: ["Normal", "Rush (+20%)"]
    },
    contact: {
      title: "Ready to talk business?",
      tg: "Write in Telegram",
      email: "Send an email",
      call: "Request a call"
    }
  },
  ro: {
    nav: { services: "Servicii", cases: "Studii de caz", calc: "Calculator", contact: "Contact", language: "Limbă" },
    hero: {
      title: "Abordare cuprinzătoare a soluțiilor IT pentru afaceri",
      subtitle: "Mai mult decât cod: privim produsul și procesele prin prisma business-ului — de la ipoteze la rezultate măsurabile.",
      primary: "Calculează bugetul",
      secondary: "Scrie pe Telegram"
    },
    services: {
      title: "Ce facem",
      items: [
        { title: "Soluții e-commerce", desc: "Cataloage, coș, plăți, reduceri, rapoarte — focus pe conversie și LTV." },
        { title: "CRM / panouri interne", desc: "Procese, roluri și acces, aliniate operațiunilor și metricilor tale." },
        { title: "Panouri admin", desc: "Control clar al conținutului, comenzilor, stocurilor și echipelor." },
        { title: "Boti Telegram", desc: "Notificări, cereri, funcții admin și integrări externe." },
        { title: "Integrări Supabase", desc: "Stocare, roluri, funcții, email — rapid și fiabil." },
        { title: "Audit & arhitectură", desc: "Evaluare și foaie de parcurs pragmatică pentru îmbunătățiri." }
      ]
    },
    cases: {
      title: "Studii de caz",
      cta: "Solicită un demo",
      cards: [
        {
          name: "FoodSaur",
          task: "Marketplace pentru producători locali cu reduceri și intervale de ridicare: vitrine, panou admin, cereri și acces pe roluri.",
          did: ["Cataloage & programări", "Panou admin cu roluri (RLS)", "Notificări în Telegram", "Confirmări de comandă prin email"],
          result: "Vânzări pilot și procese simplificate: mai puține erori manuale și procesare mai rapidă."
        },
        {
          name: "SMT Premium Box",
          task: "E-commerce en-gross pentru cutii cadou: variante culoare/dimensiune, flux de pre-comandă, gestiune stoc și confirmare prin email.",
          did: ["Carduri cu variante", "Coș & pre-comandă", "Confirmare prin email", "Integrări cu stocuri/foi"],
          result: "Timp de procesare redus și vizibilitate sporită a sortimentului pentru B2B."
        },
        {
          name: "Împreună mai puternici",
          task: "Website informațional pentru o inițiativă de spațiu incluziv pentru mame și copii cu nevoi speciale în Moldova: resurse, evenimente și sprijin comunitar.",
          did: ["Structură secțiuni & navigație", "Calendar evenimente și înscriere voluntari", "Pagină resurse & parteneri", "Formulare de contact"],
          result: "Punct de acces clar pentru familii și voluntari, cu informații utile și posibilitatea de a cere ajutor rapid."
        }
      ]
    },
    calc: {
      title: "Calculator buget",
      rate: "Rată, €/oră",
      projectType: "Tip proiect",
      size: "Dimensiune & complexitate",
      options: "Opțiuni",
      urgency: "Urgență",
      estimate: "Estimare",
      download: "Descarcă estimarea (PDF)",
      share: "Distribuie pe Telegram",
      resultHours: "Ore",
      resultTotal: "Total, €",
      types: ["E-commerce", "CRM/ERP", "Admin panel", "Telegram bot", "Custom integration"],
      sizes: ["Small", "Medium", "Large"],
      opts: ["Auth/roles", "Payments", "Analytics", "Multilingual", "Supabase integration", "Telegram notifications"],
      urgencies: ["Normal", "Urgent (+20%)"]
    },
    contact: {
      title: "Gata să discutăm?",
      tg: "Scrie pe Telegram",
      email: "Trimite un email",
      call: "Solicită un apel"
    }
  }
};

Логика калькулятора (в app.js)
const baseHours = {
  "E-commerce": { Small: 60, Medium: 120, Large: 220 },
  "CRM/ERP": { Small: 70, Medium: 140, Large: 260 },
  "Admin panel": { Small: 50, Medium: 100, Large: 180 },
  "Telegram bot": { Small: 30, Medium: 60, Large: 100 },
  "Custom integration": { Small: 40, Medium: 90, Large: 160 }
};
const optionHours = {
  "Auth/roles": 16, Payments: 24, Analytics: 10,
  Multilingual: 18, "Supabase integration": 20, "Telegram notifications": 12
};
function computeTotal(rate, type, size, checkedOptions, urgency){
  const base = baseHours[type][size];
  const extra = checkedOptions.reduce((s,k)=>s+(optionHours[k]||0),0);
  let totalHours = base + extra;
  let total = totalHours * rate;
  if (urgency.includes("Rush") || urgency.includes("Urgent") || urgency.includes("Срочно")) total *= 1.2;
  return { totalHours, total };
}


Реалтайм пересчёт при изменениях.

PDF: собрать краткую смету (тип, размер, опции, ставка, часы, итог) и скачать.

Share via Telegram: сформировать текст сметы и открыть https://t.me/share/url?text=....

Дизайн-гайд

Минимализм, крупная типографика, карточки rounded-2xl, мягкие тени.

Контентная ширина max-w-7xl; аккуратные интервалы; hover/appear анимации (CSS).

Доступность: контраст AA, фокус-кольца, aria-лейблы.

SEO

Title/Description/OG, favicon.

JSON-LD: Organization/Service/Project (минимальный набор в <script type="application/ld+json">).

Acceptance Criteria

Плавный скролл по секциям.

Переключение RU/EN/RO на лету.

Калькулятор считает корректно, PDF скачивается, Telegram-share работает.

Модалки «Request a Call» и «Запросить демо» показывают toast «Sent».

Cases (FoodSaur, SMT Premium Box, Вместе сильнее) выглядят профессионально и кратко.

Адаптивность от iPhone SE до Desktop.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://devserbianit.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8e3282d4-76d3-4937-8308-2505a3f2f2c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
