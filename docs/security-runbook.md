# Security runbook (internal)

Not published on the website. Repository-only document.

## 1. Scope

Public site (Vite SPA) + two edge functions (`submit-lead`, `track-event`) + database
tables `leads`, `analytics_events`, `rate_limit_hits`.

Personal data handled: lead name, chosen contact channel, contact value, request text,
optional budget/timeline, locale, page path. No payment data, no accounts, no cookies
for tracking.

## 2. Signals of an incident

- Sudden spike of rows in `leads` or `analytics_events`.
- Many `rate_limited` entries in `submit-lead` logs.
- Telegram/Email notifications containing spam or injection-looking payloads.
- 500-level errors from edge functions in bursts.
- Unexpected `permission denied` errors (may mean grants were changed).

## 3. Immediate containment

1. Disable the public entry point: set `verify_jwt = true` for the affected function in
   `supabase/config.toml` and redeploy, or temporarily return 503 from the handler.
2. If abuse is rate-limit related, lower `p_max_hits` / raise `p_window_seconds` in the
   `check_rate_limit` call in `submit-lead` (scope `submit-lead`, 5/hour) or in
   `track-event` (scope `track-event`, 120/hour). Both limits are server-controlled
   constants in the function source; they are never read from the request payload.
3. If data exposure is suspected, verify grants and RLS:
   - `public.leads` and `public.analytics_events` must have no privileges for
     `anon`/`authenticated`, and deny-all RLS policies.
   - `public.rate_limit_hits` must have privileges for `service_role` only.

## 4. Data that could be affected

- `leads`: contact data and request text (the sensitive set).
- `analytics_events`: event name, page path, locale, anonymous session id.
- `rate_limit_hits`: keyed HMAC of client IP only. No raw IP. Records older than 24h
  are purged hourly by the `purge-rate-limit-hits` cron job, so the actual maximum
  retention is about 25 hours (24h threshold + up to one hour until the next run).
  There is no hard 24h guarantee with an hourly schedule.

## 5. Logs to inspect

- Edge function logs: structured JSON entries with `rid` (request id) and `event`
  (`invalid_payload`, `honeypot`, `too_fast`, `rate_limited`, `lead_stored`,
  `telegram_failed`, `gmail_failed`, `unexpected`). They contain no IP, no contact
  values, no request text, no `ip_hmac`.
- Database: `cron.job_run_details` for the retention job.

## 6. Credentials to rotate

Rotate in this order when compromise is suspected:

1. `TELEGRAM_BOT_TOKEN` (via BotFather `/revoke`), then update the secret.
2. `GOOGLE_MAIL_API_KEY` — reconnect the Gmail connector.
3. `RATE_LIMIT_SECRET` — regenerate (invalidates existing rate-limit buckets, harmless).
4. Backend API keys / service role — rotate from Cloud settings.

Never paste secret values into chat, tickets, or screenshots.

## 7. Notification decision

The project owner (Andrei Serbian) decides whether a personal-data breach requires
notifying the supervisory authority and affected people. Record: what happened, when it
was detected, which fields were affected, how many records, containment actions, and the
decision with its date.

## 8. After the incident

- Re-run the security scan and dependency audit.
- Re-verify: honeypot, min fill time, rate limit, CORS allowlist, direct table read from
  the browser (must fail).
- Update this runbook with anything learned.
