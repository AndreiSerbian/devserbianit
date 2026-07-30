import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const EMAIL_RECIPIENT = "serbiyan012@gmail.com";
const METHODS = ["telegram", "email", "whatsapp", "other"];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escapeHtml = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const encodeBase64 = (str: string) => {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};
const encodeBase64Url = (str: string) =>
  encodeBase64(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function sha256(input: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface Lead {
  name: string;
  preferred_contact_method: string;
  contact_value: string;
  request: string;
  budget_and_timeline: string | null;
  locale: string;
  page_url: string | null;
}

async function notifyTelegram(lead: Lead): Promise<boolean> {
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!botToken || !chatId) {
    console.error("Telegram credentials missing");
    return false;
  }

  const lines = [
    "<b>Новая заявка с сайта</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Способ связи:</b> ${escapeHtml(lead.preferred_contact_method)}`,
    `<b>Контакт:</b> ${escapeHtml(lead.contact_value)}`,
    "",
    `<b>Запрос:</b>`,
    escapeHtml(lead.request),
  ];
  if (lead.budget_and_timeline) {
    lines.push("", `<b>Бюджет и сроки:</b> ${escapeHtml(lead.budget_and_timeline)}`);
  }
  lines.push("", `<i>Язык: ${escapeHtml(lead.locale)}</i>`);

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML" }),
  });

  if (!res.ok) {
    console.error("Telegram error", res.status, await res.text());
    return false;
  }
  return true;
}

async function notifyEmail(lead: Lead): Promise<boolean> {
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  const connectionKey = Deno.env.get("GOOGLE_MAIL_API_KEY");
  if (!lovableApiKey || !connectionKey) {
    console.error("Gmail gateway credentials missing");
    return false;
  }

  let html = `<h2>Новая заявка с сайта</h2>`;
  html += `<p><strong>Имя:</strong> ${escapeHtml(lead.name)}</p>`;
  html += `<p><strong>Способ связи:</strong> ${escapeHtml(lead.preferred_contact_method)}</p>`;
  html += `<p><strong>Контакт:</strong> ${escapeHtml(lead.contact_value)}</p>`;
  html += `<p><strong>Запрос:</strong><br/>${escapeHtml(lead.request).replace(/\n/g, "<br/>")}</p>`;
  if (lead.budget_and_timeline) {
    html += `<p><strong>Бюджет и сроки:</strong> ${escapeHtml(lead.budget_and_timeline)}</p>`;
  }
  html += `<hr/><p><em>Язык: ${escapeHtml(lead.locale)} · ${escapeHtml(lead.page_url ?? "")}</em></p>`;

  const subject = `Новая заявка — ${lead.name}`;
  const raw = [
    `To: ${EMAIL_RECIPIENT}`,
    `Subject: =?UTF-8?B?${encodeBase64(subject)}?=`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");

  const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableApiKey}`,
      "X-Connection-Api-Key": connectionKey,
    },
    body: JSON.stringify({ raw: encodeBase64Url(raw) }),
  });

  if (!res.ok) {
    console.error("Gmail error", res.status, await res.text());
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const body = await req.json();

    // Honeypot — silently accept, never store
    if (typeof body.company === "string" && body.company.trim() !== "") {
      return json({ ok: true });
    }

    const str = (v: unknown, max: number) =>
      typeof v === "string" ? v.trim().slice(0, max) : "";

    const name = str(body.name, 80);
    const method = str(body.preferred_contact_method, 20).toLowerCase();
    const contact = str(body.contact_value, 120);
    const request = str(body.request, 2000);
    const budget = str(body.budget_and_timeline, 500) || null;
    const locale = ["ru", "en", "ro"].includes(str(body.locale, 5)) ? str(body.locale, 5) : "ru";
    const pageUrl = str(body.page_url, 300) || null;

    if (!name || !contact || request.length < 5 || !METHODS.includes(method)) {
      return json({ error: "invalid_payload" }, 400);
    }
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)) {
      return json({ error: "invalid_contact" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const ipHash = await sha256(ip + (Deno.env.get("SUPABASE_URL") ?? ""));

    // Basic rate limit: max 5 submissions per IP per hour
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);

    if ((count ?? 0) >= 5) {
      return json({ error: "rate_limited" }, 429);
    }

    const lead: Lead = {
      name,
      preferred_contact_method: method,
      contact_value: contact,
      request,
      budget_and_timeline: budget,
      locale,
      page_url: pageUrl,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("leads")
      .insert({ ...lead, ip_hash: ipHash })
      .select("id")
      .single();

    if (insertError) {
      console.error("Lead insert failed", insertError.message);
      return json({ error: "storage_failed" }, 500);
    }

    const [tg, mail] = await Promise.all([
      notifyTelegram(lead).catch(() => false),
      notifyEmail(lead).catch(() => false),
    ]);

    await supabase
      .from("leads")
      .update({
        telegram_delivery_status: tg ? "sent" : "failed",
        email_delivery_status: mail ? "sent" : "failed",
        overall_status: tg || mail ? "new" : "delivery_failed",
      })
      .eq("id", inserted.id);

    // Lead is stored even if notifications fail — never lose it.
    return json({ ok: true, id: inserted.id });
  } catch (e) {
    console.error("submit-lead error", e instanceof Error ? e.message : e);
    return json({ error: "unexpected" }, 500);
  }
});