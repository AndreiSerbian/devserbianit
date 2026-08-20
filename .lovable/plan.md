# Security Hardening — ANDREI SERBIAN / IT SOLUTIONS

Цель: усилить безопасность и приватность без изменения бизнес-логики и дизайна. Никаких абсолютных формулировок вида «100% secure» на сайте не появится.

## Что уже в порядке (проверено)

- В браузерный код попадают только публичные значения: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`. Service role, Telegram-токен, Gmail-ключ живут только в серверном окружении функций.
- Таблицы `leads` и `analytics_events`: RLS включён, политики `using false / check false` для `anon` и `authenticated` — клиент не может ни читать, ни писать, ни удалять.
- Заявка идёт по схеме Browser → Edge Function `submit-lead` → валидация → БД → Telegram/Email. Прямых INSERT из браузера нет.
- Заявка сохраняется до отправки уведомлений, сбой Telegram/почты её не теряет.
- `track-event` принимает только allowlist из 9 имён событий; персональные поля не передаются.
- Внешние ссылки с `target="_blank"` уже имеют `rel="noopener noreferrer"`.
- Пользовательский текст экранируется перед Telegram/Email; `dangerouslySetInnerHTML` есть только в служебном chart-компоненте shadcn, без пользовательского ввода.

## Найденные проблемы и что исправим

### High — устаревшая публичная функция `send-telegram-notification`
Функция задеплоена с `verify_jwt = false`, но клиент её больше не вызывает (осталась от старой анкеты). Она принимает произвольные `answers`/`questions`, не имеет rate limit, honeypot и лимита размера, шлёт всё в Telegram и на почту, а в ответе отдаёт `error.message` и логирует полное тело ответа Telegram. Это открытый спам-канал и утечка внутренних деталей.
Решение: удалить полностью — каталог исходников, запись в `supabase/config.toml` и задеплоенную функцию; отдельно перепроверить отсутствие клиентских вызовов и любых упоминаний URL этой функции в старом коде.

### High — rate limit: слабый идентификатор, неатомарный, бессрочное хранение
Сейчас лимит 5 заявок в час считается двумя отдельными запросами (SELECT count + INSERT) по `sha256(ip)`, а `ip_hash` хранится в `leads` бессрочно.
Решение:
- Идентификатор — keyed HMAC: `HMAC-SHA-256(RATE_LIMIT_SECRET, normalized_ip)`. Секрет запрошу через хранилище секретов: только серверная среда функций, не `VITE_*`, не во фронтенде, не в таблице БД. Сырой IP не сохраняем нигде.
- Источник IP — только заголовки, которые фактически проставляет hosted Supabase Edge-инфраструктура; сначала логирую и документирую реальный набор заголовков и выбранный trusted source. IP из body/query не принимаем. При `x-forwarded-for` берём первый адрес и нормализуем как IPv4/IPv6.
- Если доверенный IP определить невозможно: общий fallback-bucket для всех пользователей не используем (он превратился бы в глобальный DoS-рычаг), фиксируем это как limitation в отчёте и опираемся на остальные anti-abuse меры (honeypot, cooldown по сессии, strict schema, лимит размера тела).
- Конкурентность: `public.check_rate_limit(...)` сериализует запросы одной rate-limit identity через `pg_advisory_xact_lock(...)` с детерминированным ключом из `ip_hmac`. Порядок внутри транзакции: acquire lock → check cooldown → count hits в окне → либо отказ с `retry_after`, либо insert hit → конец транзакции снимает lock. Публичным ролям (`PUBLIC`, `anon`, `authenticated`) EXECUTE не даём — только серверной роли.
- Retention: `rate_limit_hits` живут 24 часа. Механизм очистки — cron-джоб (`pg_cron`), вызывающий идемпотентную `public.purge_rate_limit_hits()`; удаление внутри `check_rate_limit` остаётся только страховкой, а не единственным механизмом. Перед планированием проверяю доступность `pg_cron`; миграция корректно работает и там, где расширение недоступно (тогда джоб не создаётся, а limitation фиксируется в отчёте). После деплоя проверяю: джоб существует и включён, расписание верное, `cron.job_run_details` содержит успешные запуски, записи старше 24 часов реально удаляются. Точный механизм и расписание — в отчёте.
- `leads.ip_hash` больше не заполняем, существующие значения обнуляем; затем проверяем все ссылки на поле (функции, код, отчёты) и, если оно нигде не требуется, готовим его удаление из схемы отдельным шагом после проверки совместимости.

### Medium — CORS audit
Обе функции сейчас отвечают `Access-Control-Allow-Origin: *`.
Решение: для `submit-lead` и `track-event` вводим allowlist конкретных origins — production-домен, конкретный preview-домен и localhost/dev как отдельные записи; шаблон `*.lovable.app` не разрешаем. Для разрешённого запроса возвращаем ровно запрошенный `Origin` (никогда несколько значений) плюс `Vary: Origin`; для неразрешённого — без CORS-разрешения. Приводим в порядок OPTIONS-preflight, methods и headers. Фиксирую честно: CORS — браузерное ограничение и не защищает от server-to-server запросов и ботов; реальная защита — rate limit, honeypot, strict schema, лимит размера тела.

### Medium — allowlist полей и нормализация в `submit-lead`
Сейчас лишние поля просто игнорируются, но нет строгой схемы и явного отказа. Валидация написана вручную.
Решение: zod-схема со `strict()`-поведением (неизвестные поля → 400), нормализация строк (trim, сжатие пробелов, удаление управляющих символов), разумные максимумы, проверка контакта под каждый способ связи (email/telegram/whatsapp/other), белый список locale.

### Medium — `page_url` пишется целиком
В заявку попадает полный URL с любыми query-параметрами и хешем.
Решение: сохранять только путь (`/ru#contact-form`), без query-строки.

### Medium — широкие табличные GRANT
`anon` и `authenticated` имеют полный набор привилегий на `leads` и `analytics_events`; сейчас их держит только RLS.
Решение: отозвать привилегии у `anon` и `authenticated`, оставить `service_role` (функции работают через него). Защита в два слоя вместо одного.

### Medium — security-заголовки: что реально доступно
Проверил ответ production-хостинга: он уже отдаёт `strict-transport-security`, `referrer-policy: strict-origin-when-cross-origin` и `x-content-type-options: nosniff`. Управления собственными HTTP-заголовками у статичного SPA на этом хостинге нет, поэтому:
- В `index.html` добавляем только meta `Content-Security-Policy`, и только директивы, поддерживаемые в meta.
- `frame-ancestors` в meta CSP не помещаем (в meta игнорируется).
- Фиктивные `meta http-equiv` для `X-Content-Type-Options`, `Permissions-Policy`, HSTS не создаём.
- Фиксируем как hosting-level limitation: `Permissions-Policy` и защита от фрейминга (`frame-ancestors` / `X-Frame-Options`) на этом хостинге недоступны; при появлении своего edge/proxy — перенести CSP на уровень HTTP и добавить эти два заголовка.

Политику собираем из фактически используемых origins, без расширения «на всякий случай»: точный origin backend-проекта (он же для Edge Functions), `fonts.googleapis.com`, `fonts.gstatic.com`, собственный origin. Проверяем необходимость и совместимость каждой директивы: `default-src`, `script-src`, `style-src`, `font-src`, `img-src`, `connect-src`, `object-src 'none'`, `base-uri 'self'`, `form-action`. `frame-ancestors` в meta CSP не добавляем.

CSP сначала тестируем в браузере: Google Fonts, backend Supabase, вызовы Edge Functions, анимации Framer Motion, PDF-экспорт калькулятора (jsPDF + html2canvas, `blob:`/`data:`) и остальные внешние ресурсы. `unsafe-eval` не используем; `unsafe-inline` — только для стилей, если без него ломаются Tailwind/Framer Motion.

### Low — retention для заявок
Механизма удаления старых заявок нет.
Решение: функция `public.delete_expired_leads(retain_months int)` — schema-qualified имена объектов, фиксированный безопасный `search_path`, `SECURITY DEFINER` только если без него не обойтись; `REVOKE EXECUTE FROM PUBLIC, anon, authenticated`, `GRANT EXECUTE` только нужной серверной роли. Срок хранения как утверждённый default не задаём — параметр обязателен, конкретный срок подтверждается отдельно; автозапуск по расписанию — только после вашего подтверждения.

### Low — внутренний runbook на случай инцидента
Решение: файл `docs/security-runbook.md` в репозитории (не в `public/`, на сайте не публикуется): как распознать инцидент, что ограничить, какие данные затронуты, какие логи смотреть, какие credentials ротировать, кто решает про уведомление органа по защите данных.

## Секреты, требующие ротации

По коду и истории репозитория утечек приватных ключей не найдено: в git лежит только `.env` с публичными VITE-значениями, приватные ключи в исходниках отсутствуют. Ротация не требуется. Если Telegram-токен когда-либо вставлялся в чат, скриншот или сторонний сервис — скажите, и я опишу порядок отзыва (значение секрета в отчёте не выводим).

## Технические детали

Файлы:
- Удалить: `supabase/functions/send-telegram-notification/`, блок в `supabase/config.toml`.
- `supabase/functions/submit-lead/index.ts` — zod-схема, allowlist полей, нормализация, лимит размера тела, новый rate limit, honeypot + min-fill-time, нейтральные коды ошибок (`invalid_payload` / `rate_limited` / `unexpected`) без внутренних деталей, логи без контактов и текста заявки.
- `supabase/functions/track-event/index.ts` — оставить allowlist, добавить лимит размера тела и отбраковку неизвестных полей.
- `src/components/ContactForm.tsx` — `form_started_at` как вспомогательная anti-bot эвристика (не security boundary: значение контролируется клиентом; основные меры — серверный rate limit, лимит размера тела, strict schema, honeypot, cooldown), `page_url` без query, поля очищаются после успеха и не сохраняются в storage.
- `index.html` — security meta-заголовки.
- `docs/security-runbook.md`, `docs/security-audit-report.md` — новые внутренние документы.

Миграция БД (одной миграцией, с GRANT-блоком):
- `create table public.rate_limit_hits (id, ip_hmac text, created_at)`; RLS on, deny-all для `anon`/`authenticated`, `grant all` только `service_role`; индекс по `(ip_hmac, created_at)`.
- `create function public.purge_rate_limit_hits()` (идемпотентная) + cron-джоб `pg_cron`, если расширение доступно; EXECUTE только серверной роли.
- `create function public.check_rate_limit(...)` — `pg_advisory_xact_lock` по ключу из `ip_hmac`, затем cooldown, подсчёт окна и запись hit; возвращает `allowed`/`retry_after`; EXECUTE отозван у `PUBLIC`, `anon`, `authenticated`.
- `update public.leads set ip_hash = null` и прекращение записи этого поля; удаление колонки — отдельным шагом после проверки ссылок.
- `revoke all on public.leads, public.analytics_events from anon, authenticated;`
- `create function public.delete_expired_leads(retain_months int)` — schema-qualified объекты, фиксированный `search_path`, EXECUTE только серверной роли.

Browser storage после правок: `theme`, `lang`, `anon_session_id` (sessionStorage), служебный ключ сессии Supabase-клиента. Персональных данных формы в storage нет.

Проверки после изменений: Lovable Basic security scan, Deep scan (если доступен), dependency audit (`jspdf` уже 4.2.1; major-обновления без вашего согласия не делаю — только отчёт о риске и влиянии), production build, QA консоли и сети в браузере.

QA после правок: спам через honeypot, мгновенная отправка (min-fill-time), oversized input, HTML/script-подобный ввод, неизвестное поле в теле, битый email, некорректный Telegram-контакт, серия повторных запросов (rate limit), несколько одновременных параллельных запросов для одной identity (проверка сериализации через advisory lock), попытка прямого чтения `leads` из браузера, прямой вызов функций, CORS с разрешённого и неразрешённого origin, неизвестное событие аналитики, отсутствующее обязательное поле, сетевая ошибка, сбой уведомления, работа cron-очистки. Тестирую на тестовых данных, продовые заявки не трогаю.

Итоговый отчёт с severity, риском, исправлениями и остаточными рисками сохраню в `docs/security-audit-report.md` и покажу в чате — публиковать автоматически не буду.
