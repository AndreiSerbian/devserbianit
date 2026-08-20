# Публикация Security Hardening + production smoke-check

Никаких изменений кода в этом шаге. Только публикация текущей версии и проверки на production.

## 1. Публикация

- Перед публикацией — чтение результатов security scan (наличие критических findings блокирует деплой; при их отсутствии публикуем).
- Публикация текущей версии на `https://devserbianit.lovable.app`.
- Никаких правок в `src/`, миграций, изменений функций или документации одновременно с публикацией.

## 2. Smoke-check после деплоя

1. Открыть `/ru`, `/en`, `/ro` на production через headless-браузер, снять скриншоты.
2. Собрать console errors и CSP violations по каждому из трёх маршрутов.
3. Отправить одну контрольную заявку через обычную форму на production (пометка `SMOKE TEST` в тексте запроса), заполнение с нормальной скоростью, чтобы пройти honeypot/min-fill.
4. Проверить по базе:
   - запись появилась в `leads`;
   - `telegram_delivery_status = sent`;
   - `email_delivery_status = sent`;
   - в `rate_limit_hits` появилась одна строка scope `submit-lead` — и подтвердить, что в ней только `ip_hmac`, без raw IP.
5. Проверить один analytics event: навигация на production пишет строку в `analytics_events` (без raw IP и без PII).
6. Проверить, что `anon` по-прежнему не читает `leads` и `rate_limit_hits` (запрос с anon-ключом → ошибка/0 строк).
7. Проверить `cron.job`: джоб `purge-rate-limit-hits` существует, `active = true`, `username = postgres`.
8. Никаких нагрузочных и rate-limit boundary тестов на production.

## 3. Отчёт

Короткая таблица PASS / FAIL по всем пунктам 1–7. Побочный эффект: одна контрольная заявка уйдёт в Telegram и на почту. Тестовую заявку и её hit после проверки удаляю, продовые данные не трогаю.

## Технические детали

- Публикация — через publish-инструмент, без изменения visibility и slug.
- Smoke-check по production URL, а не по preview.
- Проверки БД — read-only запросы; удаление тестовой строки — отдельной миграцией.
