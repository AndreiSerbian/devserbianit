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
Решение: удалить функцию и её запись в конфиге.

### High — rate limit слабый и держит хеш IP бессрочно
Лимит 5 заявок в час считается по `ip_hash` в таблице `leads`, а сам `ip_hash` хранится вместе с заявкой неограниченно долго.
Решение: отдельная таблица `rate_limit_hits` (хеш IP + время, без сырого IP), лимит считается по ней; добавляем per-request проверки: минимальное время заполнения формы, лимит размера тела запроса, короткий cooldown между отправками. `ip_hash` в `leads` перестаём писать — он больше не нужен для лимита.

### Medium — allowlist полей и нормализация в `submit-lead`
Сейчас лишние поля просто игнорируются, но нет строгой схемы и явного отказа. Валидация написана вручную.
Решение: zod-схема со `strict()`-поведением (неизвестные поля → 400), нормализация строк (trim, сжатие пробелов, удаление управляющих символов), разумные максимумы, проверка контакта под каждый способ связи (email/telegram/whatsapp/other), белый список locale.

### Medium — `page_url` пишется целиком
В заявку попадает полный URL с любыми query-параметрами и хешем.
Решение: сохранять только путь (`/ru#contact-form`), без query-строки.

### Medium — широкие табличные GRANT
`anon` и `authenticated` имеют полный набор привилегий на `leads` и `analytics_events`; сейчас их держит только RLS.
Решение: отозвать привилегии у `anon` и `authenticated`, оставить `service_role` (функции работают через него). Защита в два слоя вместо одного.

### Medium — нет security-заголовков
Заголовки уровня хостинга (HSTS, CSP через HTTP) в статичном SPA не настраиваются, но часть можно задать в `index.html`.
Решение: добавить в `<head>` `Content-Security-Policy` через meta (с `frame-ancestors 'self'`, разрешёнными Google Fonts и домом backend), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. `unsafe-eval` не используем, `unsafe-inline` только для стилей (Tailwind/Framer Motion требуют). CSP сначала проверяем в браузере: шрифты, backend-запросы, анимации, PDF-экспорт калькулятора.

### Low — retention для заявок
Механизма удаления старых заявок нет.
Решение: функция `delete_expired_leads()` (по умолчанию 24 месяца, значение согласуем) и запись политики в внутреннем документе. Автозапуск по расписанию — только если вы подтвердите срок.

### Low — внутренний runbook на случай инцидента
Решение: файл `docs/security-runbook.md` в репозитории (не в `public/`, на сайте не публикуется): как распознать инцидент, что ограничить, какие данные затронуты, какие логи смотреть, какие credentials ротировать, кто решает про уведомление органа по защите данных.

## Секреты, требующие ротации

По коду и истории репозитория утечек приватных ключей не найдено: в git лежит только `.env` с публичными VITE-значениями, приватные ключи в исходниках отсутствуют. Ротация не требуется. Если Telegram-токен когда-либо вставлялся в чат, скриншот или сторонний сервис — скажите, и я опишу порядок отзыва (значение секрета в отчёте не выводим).

## Технические детали

Файлы:
- Удалить: `supabase/functions/send-telegram-notification/`, блок в `supabase/config.toml`.
- `supabase/functions/submit-lead/index.ts` — zod-схема, allowlist полей, нормализация, лимит размера тела, новый rate limit, honeypot + min-fill-time, нейтральные коды ошибок (`invalid_payload` / `rate_limited` / `unexpected`) без внутренних деталей, логи без контактов и текста заявки.
- `supabase/functions/track-event/index.ts` — оставить allowlist, добавить лимит размера тела и отбраковку неизвестных полей.
- `src/components/ContactForm.tsx` — отправлять `form_started_at` для min-fill-time, `page_url` без query, очищать поля формы после успеха (уже есть) и не сохранять их в storage.
- `index.html` — security meta-заголовки.
- `docs/security-runbook.md`, `docs/security-audit-report.md` — новые внутренние документы.

Миграция БД (одной миграцией, с GRANT-блоком):
- `create table public.rate_limit_hits (id, ip_hash text, created_at)`; RLS on, deny-all для `anon`/`authenticated`, `grant all` только `service_role`; индекс по `(ip_hash, created_at)`.
- `revoke all on public.leads, public.analytics_events from anon, authenticated;`
- `create function public.delete_expired_leads(retain_months int default 24)` — security definer, `search_path = public`.

Browser storage после правок: `theme`, `lang`, `anon_session_id` (sessionStorage), служебный ключ сессии Supabase-клиента. Персональных данных формы в storage нет.

Зависимости: `jspdf` уже поднят до 4.2.1. Проведу свежий dependency scan и опишу найденное с оценкой риска; major-обновления без вашего согласия делать не буду.

QA после правок: спам через honeypot, мгновенная отправка (min-fill-time), oversized input, HTML/script-подобный ввод, неизвестное поле в теле, битый email, некорректный Telegram-контакт, серия повторных запросов (rate limit), попытка прямого чтения `leads` из браузера, прямой вызов функций, неизвестное событие аналитики, отсутствующее обязательное поле, сетевая ошибка, сбой уведомления. Тестирую на тестовых данных, продовые заявки не трогаю.

Итоговый отчёт с severity, риском, исправлениями и остаточными рисками сохраню в `docs/security-audit-report.md` и покажу в чате — публиковать автоматически не буду.
