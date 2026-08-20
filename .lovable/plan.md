# Технический SEO: аудит и безопасные исправления

Дизайн не меняем. Никаких новых фактов, цифр, клиентов и отзывов — только существующий контент.

## Найденные проблемы (до изменений)

1. **Страница кейса без метаданных**: `CaseStudyDetail.tsx` не использует компонент `Seo` — нет title, description, canonical, hreflang и JSON-LD. Все три кейса делят метаданные из `index.html`.
2. **Кейс не читает язык из URL**: страница держит язык в локальном state со значением `ru` вместо `LanguageContext`, поэтому `/en/cases/...` и `/ro/cases/...` показывают русский и не сохраняют язык при навигации.
3. **Ссылки «назад» ведут на `/`** вместо `/{lang}` — язык теряется, плюс лишний redirect-хоп.
4. **Два H1 на странице кейса** (заголовок кейса и «Кейс не найден» в fallback-ветке — второй только в error-состоянии, но заголовок 404-состояния должен быть H1, а внутри контента заголовки разделов должны быть H2).
5. **404 без метаданных**: `NotFound.tsx` не ставит `noindex` и не имеет title.
6. **Sitemap неполный и несогласованный**: только RU-кейсы, нет EN/RO-версий кейсов, hreflang-блок есть только у `/ru`, файл поддерживается вручную.
7. **Calculator**: страница уже `noindex, follow` — это верно, но она отсутствует в правилах robots и нужно убедиться, что её нет в sitemap (сейчас нет — ок).
8. **`index.html`** содержит статичный `og:url`/JSON-LD `Person`; в паре с Helmet это нормально как фallback, но `twitter:card=summary_large_image` без og:image даёт неполный превью.
9. **Нет BreadcrumbList** для кейсов и нет `WebSite` JSON-LD.
10. **Внутренняя перелинковка**: с кейса нет ссылки на следующий/связанный кейс; из блока услуг нет ссылок на кейсы.
11. **Alt/размеры изображений** у кейсов требуют проверки; hero-SVG должен быть `aria-hidden` без скрытого текста.
12. **Ограничение SPA**: Helmet работает только client-side — Telegram/WhatsApp/Facebook/LinkedIn превью останутся из статического `index.html`.

## Что будет сделано

### Страницы кейсов
- Подключить `useLanguage()` вместо локального state; всё содержимое рендерится на языке из URL.
- Добавить `<Seo>`: уникальный title и description на основе реального `name`/`desc` кейса, self-canonical `/{lang}/cases/{slug}`, hreflang ru/en/ro + x-default → `/ru/...`.
- JSON-LD `CreativeWork` (только подтверждённые поля: name, description, author=Andrei Serbian, url при наличии) + `BreadcrumbList`.
- Заголовки: один H1 (название кейса), разделы — H2, подпункты — H3.
- Все внутренние ссылки — с префиксом языка; в конце страницы блок «Следующий кейс» со ссылкой на соседний кейс.

### Главная
- Уникальные title/description на RU/EN/RO по фактическому позиционированию (сайты, интернет-магазины, CRM и интеграции, Telegram-боты, автоматизация) — без «best/№1/leading».
- Добавить JSON-LD `WebSite` рядом с существующим `ProfessionalService`/`Person`.
- В блоке услуг — осмысленные ссылки на релевантные кейсы (без искусственных футер-ссылок).

### 404
- `<Seo index={false}>` с корректным title, H1 остаётся один, ссылка на `/{lang}`.

### Sitemap и robots
- Заменить ручной `public/sitemap.xml` на генератор `scripts/generate-sitemap.ts` (`predev`/`prebuild`), который выводит `/ru`, `/en`, `/ro` и 9 локализованных URL кейсов с hreflang-альтернативами для каждого URL. Без calculator, `__brand-check`, 404.
- `robots.txt`: оставить `Allow: /` и `Sitemap:`, добавить `Disallow: /__brand-check`. Калькулятор остаётся под meta `noindex, follow` (robots.txt для этого не используем).

### index.html
- Оставить sitewide og/twitter как fallback для соцкраулеров, убрать `<link rel="canonical">` из статического head, если он появится (сейчас его нет — проверим), og:image не добавляем, пока нет реального файла.
- Требования к будущей картинке 1200×630 зафиксирую в отчёте (ANDREI SERBIAN / IT SOLUTIONS / AS-логотип / короткий заголовок, без мелкого текста) — саму картинку не генерирую.

### Изображения и производительность
- Проверить и при необходимости добавить `alt`, `width`/`height`, `loading="lazy"` для изображений кейсов; декоративный hero-SVG — `aria-hidden="true"`.
- Hero headline рендерится независимо от анимации (проверить, что текст не появляется только после Framer Motion).
- Отчёт по рискам LCP/CLS/INP без изменения дизайна.

### Проверка
Прогон через браузер: `/ru`, `/en`, `/ro`, все 9 case-routes, 404 — проверка title/description/canonical/hreflang/`html lang`/иерархии заголовков/битых ссылок/мобильного рендера.

## Технические детали
Файлы: `src/pages/CaseStudyDetail.tsx`, `src/pages/NotFound.tsx`, `src/pages/Index.tsx`, `src/components/Seo.tsx` (поддержка типов JSON-LD массивом), `src/components/Services.tsx`, `src/data/translations.ts` (SEO-строки для кейсов и страниц), `scripts/generate-sitemap.ts` (новый), `package.json` (predev/prebuild), `public/robots.txt`, `public/sitemap.xml` (генерируется).

Ограничения: Vite SPA — Google видит client-side метаданные, соцкраулеры видят только статический `index.html`. Миграцию на SSR не делаем. Публикация не выполняется.

## Что останется владельцу
- Подтвердить финальные тексты title/description на EN и RO (машинный RO нуждается в проверке носителем).
- Решить по брендовой social-preview картинке.
- Подключить Google Search Console и отправить sitemap.
