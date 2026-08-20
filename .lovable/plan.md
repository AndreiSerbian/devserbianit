# Security Hardening — финальные правки перед production

Scope строго по вашим 5 пунктам. Архитектуру не пересобираю.

## 1. Убрать SECURITY DEFINER (миграция)

Новая миграция пересоздаёт три функции через `CREATE OR REPLACE`:

- `public.check_rate_limit(p_ip_hmac, p_scope, p_max_hits, p_window_seconds)`
- `public.purge_rate_limit_hits()`
- `public.delete_expired_leads(retain_months int)`

Изменения в каждой:
- убрать `SECURITY DEFINER` (то есть `SECURITY INVOKER` по умолчанию);
- `SET search_path = ''`;
- все объекты полностью schema-qualified: `public.rate_limit_hits`, `public.leads`, а также функции — `pg_catalog.now()`, `pg_catalog.count(*)`, `pg_catalog.make_interval(...)`, `pg_catalog.pg_advisory_xact_lock(...)`, `pg_catalog.hashtextextended(...)`, `pg_catalog.extract(...)`. При `search_path = ''` неквалифицированные вызовы падают, поэтому квалифицирую всё;
- тела и логика остаются идентичными (advisory lock → count в окне → отказ с `retry_after` или insert hit).

GRANT/REVOKE после `CREATE OR REPLACE` не сбрасываются, но миграция всё равно повторит их идемпотентно, чтобы состояние было явным:
```
REVOKE ALL ON FUNCTION public.check_rate_limit(text,text,int,int) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_expired_leads(int) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.purge_rate_limit_hits() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text,text,int,int) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_expired_leads(int) TO service_role;
```
`purge_rate_limit_hits` вызывается cron-джобом от роли `postgres` (owner объектов), ей отдельный GRANT не нужен. Проверю, что при INVOKER эта роль действительно проходит по правам на `public.rate_limit_hits`; если нет — остановлюсь и покажу конкретную ошибку до расширения прав.

QA: RPC от `service_role` работает; `anon`/`authenticated` получают permission denied; cron purge выполняется; параллельный rate-limit тест остаётся PASS.

## 2. Rate limit для track-event

Переиспользую существующую инфраструктуру: `trustedClientIp` → `ipHmac(RATE_LIMIT_SECRET)` → RPC `check_rate_limit` со scope `'track-event'`.

- Лимит задан константой в коде функции (server-controlled), из payload ничего не читается. Предлагаю 120 событий в час на identity — существенно мягче, чем 5/час у submit-lead, и заведомо выше нормальной навигации (обычная сессия даёт единицы событий).
- При превышении: событие не пишется в БД, ответ `200 { ok: false }` — silently drop, как уже устроено в текущем catch-блоке, чтобы аналитика никогда не ломала клиент.
- Если доверенный IP отсутствует — глобального fallback-бакета нет (как в submit-lead): событие обрабатывается обычным путём, ограничение фиксируется в отчёте.
- Порядок: CORS → метод → размер тела → strict allowlist полей → allowlist имён событий → rate limit → insert. Rate-limit проверка после валидации, чтобы мусорные запросы не расходовали бюджет легитимного пользователя.

QA: массовая отправка валидных allowlisted events — первые N проходят, дальше drop без записей в `analytics_events`; обычная навигация по сайту события пишет.

## 3. Sequence privileges

Проверю фактические ACL через `information_schema` / `pg_class.relacl` для `public.rate_limit_hits_id_seq`. Если у `PUBLIC`/`anon`/`authenticated` есть `USAGE`/`SELECT`/`UPDATE`:
```
REVOKE ALL ON SEQUENCE public.rate_limit_hits_id_seq FROM PUBLIC, anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.rate_limit_hits_id_seq TO service_role;
```
`service_role` оставляю только `USAGE, SELECT` (нужно для INSERT через `nextval`), без `UPDATE`. Фактические до/после ACL покажу в отчёте.

## 4. Retention wording

В `docs/security-runbook.md` и `docs/security-audit-report.md` заменяю формулировку про жёсткие 24 часа на фактическую: `rate_limit_hits` — «записи старше 24 часов удаляются ежечасным cron-джобом; фактический максимум хранения около 25 часов». Никаких обещаний строгого 24h-максимума при hourly cron.

## 5. cf-connecting-ip spoof test

Контролируемый тест: два запроса к задеплоенной функции — один без заголовка, один с caller-supplied `cf-connecting-ip: <произвольное значение>` — и проверка, что identity в `rate_limit_hits` не меняется (то есть провайдер перезаписывает заголовок и подмена невозможна). В отчёте — только PASS/FAIL и вывод; реальные IP, значения заголовков и полные `ip_hmac` не показываю и не сохраняю.

## Файлы и проверки

Изменяются:
- новая миграция в `supabase/migrations/` (пункты 1 и 3);
- `supabase/functions/track-event/index.ts` (пункт 2);
- `docs/security-runbook.md`, `docs/security-audit-report.md` (пункт 4).

Не меняются: `submit-lead`, `_shared/http.ts`, `ContactForm.tsx`, `index.html`, CSP, CORS-allowlist.

После правок: production build; Security Advisor / linter; submit-lead sequential + parallel; track-event abuse test; cron test; anon permission tests; browser CSP test. Ничего не публикую. В финале — только diff новых правок и таблица PASS/FAIL.
