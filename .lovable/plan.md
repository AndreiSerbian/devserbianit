# Технический SEO: аудит и безопасные исправления

Дизайн не меняем. Никаких новых фактов, цифр, клиентов и отзывов — только существующий контент.

## Найденные проблемы (до изменений)

1. **Страница кейса без метаданных**: `CaseStudyDetail.tsx` не использует компонент `Seo` — нет title, description, canonical, hreflang и JSON-LD. Все три кейса делят метаданные из `index.html`.
2. **Кейс не читает язык из URL**: страница держит язык в локальном state со значением `ru` вместо `LanguageContext`, поэтому `/en/cases/...` и `/ro/cases/...` показывают русский и не сохраняют язык при навигации.
3. **Ссылки «назад» ведут на `/`** вместо `/{lang}` — язык теряется, плюс лишний redirect-хоп.
4. **Иерархия заголовков кейса**: H1 в основной и в error-ветке рендерятся не одновременно, так что это не дефект; проверить, что в каждом реально отрендеренном состоянии есть ровно один основной H1, а разделы кейса — H2/H3.
5. **404 без метаданных**: `NotFound.tsx` не ставит `noindex` и не имеет title. Отдельно проверить реальный HTTP-статус несуществующего URL.
6. **Sitemap неполный и несогласованный**: только RU-кейсы, нет EN/RO-версий кейсов, файл поддерживается вручную.
7. **Calculator**: страница уже `noindex, follow` — верно; она должна остаться crawlable (иначе Google не увидит noindex) и отсутствовать в sitemap (сейчас отсутствует — ок).
8. **`index.html`** содержит статичный `og:url`/JSON-LD `Person`; в паре с Helmet это нормально как fallback, но `twitter:card=summary_large_image` без og:image даёт неполный превью.
9. **Structured data**: используется deprecated тип `ProfessionalService`; нет `WebSite` и нет `BreadcrumbList` для кейсов.
10. **Внутренняя перелинковка**: с кейса нет ссылки на следующий/связанный кейс; из блока услуг нет ссылок на кейсы.
11. **Alt/размеры изображений** у кейсов требуют проверки; у hero-SVG нужно определить, смысловой он или декоративный.
12. **Ограничение SPA**: Helmet работает только client-side — соцкраулеры (Telegram/WhatsApp/Facebook/LinkedIn) видят только статический `index.html`. Google поддерживает client-rendered metadata, но это нужно проверять через Search Console URL Inspection.

## Что будет сделано

### Страницы кейсов
- Подключить `useLanguage()` вместо локального state; всё содержимое рендерится на языке из URL.
- Добавить `<Seo>`: уникальный title и description на основе реального `name`/`desc` кейса, self-canonical `/{lang}/cases/{slug}`, hreflang ru/en/ro + x-default → `/ru/...`.
- JSON-LD: `WebPage` с `BreadcrumbList` (по требованиям Google) и `mainEntity` → `CreativeWork` только с подтверждёнными полями (name, description, author → Person «Andrei Serbian», url при наличии). Rich result не гарантируется — это не цель. Все сущности внутри `@graph` с `@id`, чтобы не дублировать Person.
- Заголовки: один основной H1 в каждом отрендеренном состоянии (название кейса), разделы — H2, подпункты — H3.
- Все внутренние ссылки — с префиксом языка; в конце страницы блок «Следующий кейс» со ссылкой на соседний кейс.

### Главная
- Уникальные title/description на RU/EN/RO по фактическому позиционированию (сайты, интернет-магазины, CRM и интеграции, Telegram-боты, автоматизация) — без «best/№1/leading».
- Убрать deprecated `ProfessionalService`. Схема: `Person` (Andrei Serbian) как основная сущность с `@id` = `#person`, `WebSite` отдельной сущностью с `@id` = `#website`, и `Service` для фактически оказываемых услуг (сайты, e-commerce, CRM-интеграции, Telegram-боты/автоматизация) с `provider` → `#person`. Всё собрано в одном `@graph`.
- В блоке услуг — осмысленные ссылки на релевантные кейсы (без искусственных футер-ссылок).

### 404
- `<Seo index={false}>` с корректным title, один H1, ссылка на `/{lang}`.
- Проверить HTTP-статус произвольного несуществующего URL (`/ru/this-page-does-not-exist-12345`). Если хостинг отдаёт 404 — оставляем как есть. Если 200 — фиксируем SPA soft-404 как ограничение и гарантируем client-side `noindex` на NotFound.

### Sitemap и robots
- Заменить ручной `public/sitemap.xml` на генератор `scripts/generate-sitemap.ts` (вызывается через `npm run generate:sitemap` и `prebuild`), который выводит `/ru`, `/en`, `/ro` и 9 локализованных URL кейсов с hreflang-альтернативами (ru, en, ro, self-reference, x-default → RU). Итого 12 индексируемых URL. Без calculator, `__brand-check`, 404.
- hreflang в HTML (`Seo.tsx`) и в sitemap строятся из **одного** общего модуля конфигурации маршрутов/локалей, чтобы две карты не могли разойтись.
- `robots.txt`: оставить `Allow: /` и `Sitemap:`. `Disallow: /__brand-check` не добавляем — маршрут уже ограничен `import.meta.env.DEV` и в production-сборку не попадает; robots.txt как средство контроля доступа не используем.

### index.html / Open Graph / Twitter
- Оставить sitewide og/twitter как fallback для соцкраулеров, убрать `<link rel="canonical">` из статического head (если появится). og:image не добавляем, пока нет реального файла.
- Пока реальной social-preview картинки нет, использовать `twitter:card=summary` вместо `summary_large_image`. После появления настоящего 1200×630 вернуть `summary_large_image`.
- Требования к будущей картинке 1200×630 зафиксирую в отчёте (ANDREI SERBIAN / IT SOLUTIONS / AS-логотип / короткий заголовок, без мелкого текста) — саму картинку не генерирую.

### Изображения и производительность
- Проверить и при необходимости добавить `alt`, `width`/`height` для изображений кейсов. `loading="lazy"` добавлять только изображениям ниже первого экрана; не применять к потенциальному LCP-изображению или другому above-the-fold контенту (особенно для Hero).
- Hero SVG: решение принимаем после осмотра финальной разметки. Если схема несёт самостоятельный смысл — `role="img"` + локализованные `<title>`/`<desc>`; `aria-hidden="true"` только если весь смысл полностью продублирован доступным HTML рядом.
- Hero headline рендерится независимо от анимации (проверить, что текст не появляется только после Framer Motion).
- Отчёт по рискам LCP/CLS/INP без изменения дизайна.

### Проверка
Прогон через браузер: `/ru`, `/en`, `/ro`, все 9 case-routes, 404 — проверка title/description/canonical/hreflang/`html lang`/иерархии заголовков/битых ссылок/мобильного рендера.

## Технические детали

Источник hreflang/локалей — один общий модуль (например `src/lib/seoRoutes.ts`), используемый и `Seo.tsx`, и генератором sitemap.

Файлы: `src/pages/CaseStudyDetail.tsx`, `src/pages/NotFound.tsx`, `src/pages/Index.tsx`, `src/components/Seo.tsx` (поддержка типов JSON-LD массивом), `src/components/Services.tsx`, `src/data/translations.ts` (SEO-строки для кейсов и страниц), `scripts/generate-sitemap.ts` (новый), `package.json` (prebuild + `generate:sitemap`), `public/robots.txt`, `public/sitemap.xml` (генерируется).

Ограничения: Google поддерживает client-rendered title, description, canonical и structured data, но результат нужно проверять через Search Console URL Inspection после публикации. Конфликтующий статический canonical в `index.html` не создаём. Соцкраулеры (Telegram/WhatsApp/Facebook/LinkedIn) видят только статический `index.html`. Миграцию на SSR не делаем. Публикация не выполняется.

## Checklist после публикации (владелец)
- URL Inspection в Google Search Console: rendered HTML, canonical, title/description.
- Rich Results Test для BreadcrumbList.
- Отправка sitemap и проверка отчёта Page Indexing.
- Проверка hreflang-групп на всех трёх локалях.

## Что останется владельцу
- Подтвердить финальные тексты title/description на EN и RO (машинный RO нуждается в проверке носителем).
- Решить по брендовой social-preview картинке 1200×630.
- Подключить Google Search Console и пройти checklist выше.
