import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { corsFor, jsonResponse, readJsonBody } from "../_shared/http.ts";

const MAX_BODY_BYTES = 2 * 1024;

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
