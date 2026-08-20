import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { z } from "https://esm.sh/zod@3.23.8";
import {
  corsFor,
  ipHmac,
  jsonResponse,
  readJsonBody,
  requestId,
  trustedClientIp,
} from "../_shared/http.ts";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const EMAIL_RECIPIENT = "serbiyan012@gmail.com";
const MAX_BODY_BYTES = 8 * 1024;
const MIN_FILL_MS = 2500;

/** trim + collapse whitespace + strip control characters */
const norm = (v: string) =>
  v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const normalized = (max: number) => z.string().max(max * 2).transform(norm);

const LeadSchema = z
  .object({
    name: normalized(80).pipe(z.string().min(2).max(80)),
    preferred_contact_method: z.enum(["telegram", "email", "whatsapp", "other"]),
    contact_value: normalized(120).pipe(z.string().min(3).max(120)),
    request: normalized(2000).pipe(z.string().min(5).max(2000)),
    budget_and_timeline: normalized(500).pipe(z.string().max(500)).nullish(),
    locale: z.enum(["ru", "en", "ro"]).default("ru"),
    page_path: z.string().max(300).optional(),
    company: z.string().max(200).optional(), // honeypot
    form_started_at: z.number().int().positive().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const v = data.contact_value;
    const ok = data.preferred_contact_method === "email"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
      : data.preferred_contact_method === "whatsapp"
      ? v.replace(/\D/g, "").length >= 6
      : v.length >= 3;
    if (!ok) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contact_value"], message: "invalid" });
    }
  });

/** keep only the pathname; query and hash are dropped */
const safePath = (input: string | undefined): string | null => {
  if (!input) return null;
  const path = input.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) return null;
  return path.slice(0, 120);
};

interface Lead {
  name: string;
  preferred_contact_method: string;
  contact_value: string;
  request: string;
  budget_and_timeline: string | null;
  locale: string;
  page_url: string | null;
}

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

async function notifyTelegram(lead: Lead, rid: string): Promise<boolean> {
  const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!botToken || !chatId) {
    console.error(JSON.stringify({ rid, event: "telegram_config_missing" }));
    return false;
  }

  const lines = [
    "<b>Новая заявка с сайта</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Способ связи:</b> ${escapeHtml(lead.preferred_contact_method)}`,
    `<b>Контакт:</b> ${escapeHtml(lead.contact_value)}`,
    "",
    "<b>Запрос:</b>",
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
    console.error(JSON.stringify({ rid, event: "telegram_failed", status: res.status }));
    return false;
  }
  return true;
}

async function notifyEmail(lead: Lead, rid: string): Promise<boolean> {
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  const connectionKey = Deno.env.get("GOOGLE_MAIL_API_KEY");
  if (!lovableApiKey || !connectionKey) {
    console.error(JSON.stringify({ rid, event: "gmail_config_missing" }));
    return false;
  }

  let html = "<h2>Новая заявка с сайта</h2>";
  html += `<p><strong>Имя:</strong> ${escapeHtml(lead.name)}</p>`;
  html += `<p><strong>Способ связи:</strong> ${escapeHtml(lead.preferred_contact_method)}</p>`;
  html += `<p><strong>Контакт:</strong> ${escapeHtml(lead.contact_value)}</p>`;
  html += `<p><strong>Запрос:</strong><br/>${escapeHtml(lead.request).replace(/\n/g, "<br/>")}</p>`;
  if (lead.budget_and_timeline) {
    html += `<p><strong>Бюджет и сроки:</strong> ${escapeHtml(lead.budget_and_timeline)}</p>`;
  }
  html += `<hr/><p><em>Язык: ${escapeHtml(lead.locale)} · ${escapeHtml(lead.page_url ?? "")}</em></p>`;

  const raw = [
    `To: ${EMAIL_RECIPIENT}`,
    `Subject: =?UTF-8?B?${encodeBase64(`Новая заявка — ${lead.name}`)}?=`,
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
    console.error(JSON.stringify({ rid, event: "gmail_failed", status: res.status }));
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  const cors = corsFor(req);
  const rid = requestId(req);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405, cors);

  try {
    let body: unknown;
    try {
      body = await readJsonBody(req, MAX_BODY_BYTES);
    } catch (e) {
      const tooLarge = e instanceof Error && e.message === "payload_too_large";
      return jsonResponse({ error: tooLarge ? "payload_too_large" : "invalid_payload" }, tooLarge ? 413 : 400, cors);
    }

    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      console.warn(JSON.stringify({ rid, event: "invalid_payload" }));
      return jsonResponse({ error: "invalid_payload" }, 400, cors);
    }
    const data = parsed.data;

    // Anti-bot heuristics (not a security boundary): honeypot + min fill time.
    if ((data.company ?? "").trim() !== "") {
      console.warn(JSON.stringify({ rid, event: "honeypot" }));
      return jsonResponse({ ok: true }, 200, cors);
    }
    if (data.form_started_at && Date.now() - data.form_started_at < MIN_FILL_MS) {
      console.warn(JSON.stringify({ rid, event: "too_fast" }));
      return jsonResponse({ ok: true }, 200, cors);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Rate limit on the provider-controlled client IP only. No raw IP and no
    // ip_hmac is ever logged; the hmac is stored solely in rate_limit_hits (24h).
    const secret = Deno.env.get("RATE_LIMIT_SECRET");
    const ip = trustedClientIp(req);
    if (ip && secret) {
      const hmac = await ipHmac(ip, secret);
      const { data: rl, error: rlError } = await supabase
        .rpc("check_rate_limit", { p_ip_hmac: hmac, p_scope: "submit-lead" })
        .maybeSingle<{ allowed: boolean; retry_after: number }>();

      if (rlError) {
        console.error(JSON.stringify({ rid, event: "rate_limit_error" }));
        return jsonResponse({ error: "unexpected" }, 500, cors);
      }
      if (rl && !rl.allowed) {
        console.warn(JSON.stringify({ rid, event: "rate_limited", retry_after: rl.retry_after }));
        return jsonResponse({ error: "rate_limited", retry_after: rl.retry_after }, 429, cors, {
          "Retry-After": String(rl.retry_after),
        });
      }
    } else {
      console.warn(JSON.stringify({ rid, event: "rate_limit_identity_unavailable" }));
    }

    const lead: Lead = {
      name: data.name,
      preferred_contact_method: data.preferred_contact_method,
      contact_value: data.contact_value,
      request: data.request,
      budget_and_timeline: data.budget_and_timeline?.trim() ? data.budget_and_timeline : null,
      locale: data.locale,
      page_url: safePath(data.page_path),
    };

    const { data: inserted, error: insertError } = await supabase
      .from("leads")
      .insert(lead)
      .select("id")
      .single();

    if (insertError) {
      console.error(JSON.stringify({ rid, event: "lead_insert_failed" }));
      return jsonResponse({ error: "unexpected" }, 500, cors);
    }

    const [tg, mail] = await Promise.all([
      notifyTelegram(lead, rid).catch(() => false),
      notifyEmail(lead, rid).catch(() => false),
    ]);

    await supabase
      .from("leads")
      .update({
        telegram_delivery_status: tg ? "sent" : "failed",
        email_delivery_status: mail ? "sent" : "failed",
        overall_status: tg || mail ? "new" : "delivery_failed",
      })
      .eq("id", inserted.id);

    console.info(JSON.stringify({ rid, event: "lead_stored", telegram: tg, email: mail }));

    // Lead is stored even if notifications fail — never lose it.
    return jsonResponse({ ok: true }, 200, cors);
  } catch (_e) {
    console.error(JSON.stringify({ rid, event: "unexpected" }));
    return jsonResponse({ error: "unexpected" }, 500, cors);
  }
});
