# Security Audit & Hardening Report

Internal document. Not published, not served from `public/`.
Last verification run: 2026-08-20 (UTC).

Contains no secret values, no raw client IPs, no `ip_hmac` values, no lead contact data.

## 1. Scope

Static React/Vite SPA + two Supabase edge functions (`submit-lead`, `track-event`) +
Postgres (`leads`, `analytics_events`, `rate_limit_hits`). No end-user auth surface.

## 2. Findings and resolution

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | High | Legacy public function `send-telegram-notification`: no rate limit, no honeypot, no size cap, leaked `error.message` | Removed (sources, `config.toml` entry, deployment) |
| 2 | High | Rate limit used bare `sha256(ip)`, was non-atomic (SELECT + INSERT), `leads.ip_hash` kept indefinitely | Keyed HMAC identity, atomic `check_rate_limit` with `pg_advisory_xact_lock`, `ip_hash` column dropped |
| 3 | Medium | Functions answered `Access-Control-Allow-Origin: *` | Explicit origin allowlist, echoes exact `Origin` + `Vary: Origin`, no wildcard subdomain pattern |
| 4 | Medium | No strict payload schema in `submit-lead` | Zod schema, unknown fields rejected (400), normalization, length caps, per-method contact validation |
| 5 | Medium | Full `page_url` with query and hash was stored | Only `pathname` is stored, normalized server-side |
| 6 | Medium | `anon`/`authenticated` had full table privileges on `leads`, `analytics_events` | Revoked; `service_role` only (RLS deny-all remains as second layer) |
| 7 | Medium | No security headers | Meta CSP in `index.html`; `Permissions-Policy` / `frame-ancestors` documented as hosting-level limitation |
| 8 | Low | No retention mechanism for leads | `public.delete_expired_leads(retain_months int)`, parameter mandatory, no schedule without explicit approval |
| 9 | Low | No incident procedure | `docs/security-runbook.md` |
| 10 | Medium | `check_rate_limit`, `purge_rate_limit_hits`, `delete_expired_leads` ran as `SECURITY DEFINER` | Converted to `SECURITY INVOKER`, `SET search_path = ''`, schema-qualified objects |
| 11 | Medium | `track-event` had no abuse limit | Server-side limit 120/hour per identity, neutral `200 {"ok": false}` on breach |
| 12 | Low | Sequence privileges unreviewed | `PUBLIC`/`anon`/`authenticated` have none; `service_role` has `USAGE` only |

## 3. Privacy properties

- Raw client IP is never written to the application database, application logs, or this report.
  Only `HMAC-SHA-256(RATE_LIMIT_SECRET, ip)` exists, and only inside `rate_limit_hits`.
- Infrastructure-level logs of the hosting/backend provider are outside our control; no claim is made about them.
- Client IP source: `cf-connecting-ip` only (provider-controlled). Caller-supplied values of that
  header are rejected at the edge (verified: `403`, the request never reaches the function).
- Analytics carries no personal fields: event name (allowlist of 9), path, locale, case id, anonymous session id.
- Browser storage after hardening: `theme`, `lang`, `anon_session_id` (sessionStorage), Supabase client session key.

## 4. Verification results (2026-08-20)

Function security model:

- `prosecdef = false` and `proconfig = search_path=""` for all three functions.
- ACL: `{postgres=X/postgres, service_role=X/postgres}` — no EXECUTE for `PUBLIC`, `anon`, `authenticated`.
- Anonymous REST calls to all three functions: `42501 permission denied`.
- Anonymous `SELECT` on `leads` and `rate_limit_hits`: `42501 permission denied`.

Rate limiting:

- `submit-lead` sequential: requests 1-5 → `200`, 6-7 → `429 rate_limited` with `retry_after`.
- `submit-lead` parallel boundary test on an empty bucket, 8 simultaneous requests, run after the
  `SECURITY INVOKER` migration: exactly 5 allowed, exactly 3 `429`, exactly 5 new `rate_limit_hits`
  rows, exactly 5 new leads. Advisory-lock serialization holds without `SECURITY DEFINER`.
- `track-event`: 130 requests → 119 accepted, 11 silently dropped; 120 hits in scope `track-event`
  and 119 analytics rows (nothing written past the limit).
- CORS preflight from a disallowed origin: no `Access-Control-Allow-Origin` header.

Retention / cron:

- Job `purge-rate-limit-hits`, schedule `17 * * * *`, `active = true`, `username = postgres`.
- Run at 02:17:00 UTC, i.e. after the `SECURITY INVOKER` migration: `status = succeeded`,
  `return_message = 1 row`.
- Control rows: a synthetic 30-hour-old row was deleted, the fresh control row survived.
- Records older than 24h are purged hourly, so the actual maximum retention is about 25 hours
  (24h threshold + up to one hour until the next run). There is no hard 24h guarantee.

Least privilege on the sequence:

- `SELECT` was revoked from `service_role` on `public.rate_limit_hits_id_seq` and inserts still
  succeed — `nextval` only needs `USAGE`. Final ACL: `service_role=U`, nothing for
  `PUBLIC`/`anon`/`authenticated`.

Build and scans:

- Production build and typecheck: pass.
- Supabase database linter: no issues found.
- Dependencies: `jspdf` at 4.2.1. Major upgrades are not performed without explicit approval.

## 5. Residual risks and limitations

- CORS is a browser-side control only; it does not stop server-to-server calls or bots. The real
  protections are the rate limit, body size cap, strict schema, and honeypot.
- Honeypot and `form_started_at` are anti-bot heuristics, not security boundaries: both values are
  client-controlled.
- When the trusted IP header is unavailable the rate limit is skipped rather than falling back to a
  shared bucket, which would be a global DoS lever. Remaining controls still apply.
- `Permissions-Policy` and framing protection (`frame-ancestors` / `X-Frame-Options`) are not
  available on this static hosting. Move CSP to the HTTP layer and add both if an own edge/proxy appears.
- Meta CSP cannot enforce `frame-ancestors`; it is intentionally omitted.
- Lead retention has no schedule yet: `delete_expired_leads` must be invoked with an explicit
  `retain_months`, and the retention period is still to be confirmed.

## 6. Secret rotation

No private key leak was found in the code or repository history: git contains only `.env` with
public `VITE_*` values. No rotation required. Rotation order for a suspected compromise is in
`docs/security-runbook.md`.
