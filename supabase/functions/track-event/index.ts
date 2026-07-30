import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

const clean = (v: unknown, max = 200) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const eventName = clean(body.event_name, 60);

    if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
      return new Response(JSON.stringify({ ok: false }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    await supabase.from("analytics_events").insert({
      event_name: eventName,
      page: clean(body.page, 300),
      locale: clean(body.locale, 5),
      case_id: clean(body.case_id, 80),
      session_id: clean(body.session_id, 64),
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (_e) {
    // analytics must never break the client
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});