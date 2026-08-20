import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import {
  corsFor,
  ipHmac,
  jsonResponse,
  readJsonBody,
  requestId,
  trustedClientIp,
} from "../_shared/http.ts";

const MAX_BODY_BYTES = 2 * 1024;

// Server-controlled abuse limit for this public endpoint. Never read from the payload.
// Deliberately far softer than submit-lead (5/h): normal browsing emits a handful of
// events per session, so 120/h per identity cannot affect real navigation.
const RATE_LIMIT_SCOPE = "track-event";
const RATE_LIMIT_MAX = 120;
const RATE_LIMIT_WINDOW_SECONDS = 3600;

const ALLOWED_EVENTS = new Set([
  "cta_hero_click",
  "cta_nav_click",
  "telegram_click",
  "email_click",
  "form_start",
  "form_submit_success",
  "form_submit_error",
  "case_open",
  "calculator_open",
]);

const ALLOWED_FIELDS = new Set(["event_name", "page", "locale", "case_id", "session_id"]);
const LOCALES = new Set(["ru", "en", "ro"]);

const clean = (v: unknown, max: number) =>
  typeof v === "string" && v.trim()
    ? v.trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, max)
    : null;

Deno.serve(async (req) => {
  const cors = corsFor(req);
  const rid = requestId(req);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return jsonResponse({ ok: false }, 405, cors);

  try {
    const body = await readJsonBody(req, MAX_BODY_BYTES) as Record<string, unknown>;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ ok: false }, 400, cors);
    }
    if (Object.keys(body).some((k) => !ALLOWED_FIELDS.has(k))) {
      return jsonResponse({ ok: false }, 400, cors);
    }

    const eventName = clean(body.event_name, 60);
    if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
      return jsonResponse({ ok: false }, 400, cors);
    }

    const locale = clean(body.locale, 5);
    const page = clean(body.page, 120);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Abuse limit. Identity is a keyed HMAC of the provider-controlled client IP;
    // the raw IP is never stored or logged. No shared fallback bucket by design:
    // when the trusted header is absent we skip the limit rather than creating a
    // global bucket that any caller could exhaust for everyone.
    const ip = trustedClientIp(req);
    const secret = Deno.env.get("RATE_LIMIT_SECRET");
    if (ip && secret) {
      const { data: rl, error: rlError } = await supabase.rpc("check_rate_limit", {
        p_ip_hmac: await ipHmac(ip, secret),
        p_scope: RATE_LIMIT_SCOPE,
        p_max_hits: RATE_LIMIT_MAX,
        p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
      });
      if (rlError) {
        console.error(JSON.stringify({ rid, event: "rate_limit_error" }));
        return jsonResponse({ ok: false }, 200, cors);
      }
      const verdict = Array.isArray(rl) ? rl[0] : rl;
      if (!verdict?.allowed) {
        // Silently drop: analytics must never surface errors to the client.
        console.warn(JSON.stringify({ rid, event: "rate_limited", scope: RATE_LIMIT_SCOPE }));
        return jsonResponse({ ok: false }, 200, cors);
      }
    }

    await supabase.from("analytics_events").insert({
      event_name: eventName,
      page: page ? page.split("?")[0].split("#")[0].slice(0, 120) : null,
      locale: locale && LOCALES.has(locale) ? locale : null,
      case_id: clean(body.case_id, 80),
      session_id: clean(body.session_id, 64),
    });

    return jsonResponse({ ok: true }, 200, cors);
  } catch (_e) {
    // analytics must never break the client
    return jsonResponse({ ok: false }, 200, cors);
  }
});
