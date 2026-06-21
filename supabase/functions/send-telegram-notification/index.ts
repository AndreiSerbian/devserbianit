import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormData {
  projectType: string;
  projectTypeLabel?: string;
  answers: Record<string, string>;
  questions?: string[];
  contactLabel?: string;
  lang: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectType, projectTypeLabel, answers, questions, contactLabel, lang }: FormData = await req.json();
    
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!botToken || !chatId) {
      console.error("Missing Telegram configuration");
      throw new Error("Telegram configuration missing");
    }

    // Format the message
    const fallbackLabels: Record<string, string> = {
      ecommerce: "E-commerce",
      telegram: "Telegram",
      crm: "CRM",
    };
    const typeLabel = projectTypeLabel || fallbackLabels[projectType] || projectType;

    let message = `📋 *Новая заявка*\n\n`;
    message += `*Тип проекта:* ${escapeMarkdown(typeLabel)}\n\n`;
    message += `*Ответы на вопросы:*\n`;

    // Add answers to questions in order
    Object.entries(answers).forEach(([key, value]) => {
      if (key === "contact") return;
      if (value && value.trim()) {
        const idx = parseInt(key.replace("q", ""));
        const questionText = questions && questions[idx]
          ? `_${escapeMarkdown(questions[idx])}_\n`
          : "";
        message += `\n*${idx + 1}.* ${questionText}${escapeMarkdown(value)}\n`;
      }
    });

    if (answers.contact && answers.contact.trim()) {
      const cLabel = contactLabel || "Контактные данные";
      message += `\n📞 *${escapeMarkdown(cLabel)}*\n${escapeMarkdown(answers.contact)}\n`;
    }

    message += `\n---\n_Serbian IT Development_`;

    console.log("Sending message to Telegram...");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const telegramResult = await telegramResponse.json();
    console.log("Telegram response:", telegramResult);

    if (!telegramResult.ok) {
      throw new Error(`Telegram API error: ${telegramResult.description}`);
    }

    // Duplicate the lead to email via Gmail (non-fatal if it fails)
    try {
      await sendEmailNotification(typeLabel, answers, questions, contactLabel);
    } catch (emailError) {
      console.error("Email notification failed (non-fatal):", emailError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending Telegram notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
}

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const EMAIL_RECIPIENT = "serbiyan012@gmail.com";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function encodeBase64Url(str: string): string {
  return encodeBase64(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sendEmailNotification(
  typeLabel: string,
  answers: Record<string, string>,
  questions: string[] | undefined,
  contactLabel: string | undefined,
): Promise<void> {
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  const connectionKey = Deno.env.get("GOOGLE_MAIL_API_KEY");
  if (!lovableApiKey || !connectionKey) {
    console.error("Missing Gmail gateway credentials");
    return;
  }

  let html = `<h2>📋 Новая заявка</h2>`;
  html += `<p><strong>Тип проекта:</strong> ${escapeHtml(typeLabel)}</p>`;
  html += `<h3>Ответы на вопросы:</h3>`;

  Object.entries(answers).forEach(([key, value]) => {
    if (key === "contact") return;
    if (value && value.trim()) {
      const idx = parseInt(key.replace("q", ""));
      const questionText = questions && questions[idx]
        ? `<em>${escapeHtml(questions[idx])}</em><br/>`
        : "";
      html += `<p><strong>${idx + 1}.</strong> ${questionText}${escapeHtml(value)}</p>`;
    }
  });

  if (answers.contact && answers.contact.trim()) {
    const cLabel = contactLabel || "Контактные данные";
    html += `<p>📞 <strong>${escapeHtml(cLabel)}</strong><br/>${escapeHtml(answers.contact)}</p>`;
  }

  html += `<hr/><p><em>Serbian IT Development</em></p>`;

  const subject = `Новая заявка — ${typeLabel}`;
  const encodedSubject = `=?UTF-8?B?${encodeBase64(subject)}?=`;

  const rawMessage = [
    `To: ${EMAIL_RECIPIENT}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");

  const response = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${lovableApiKey}`,
      "X-Connection-Api-Key": connectionKey,
    },
    body: JSON.stringify({ raw: encodeBase64Url(rawMessage) }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gmail API error ${response.status}: ${body}`);
  }

  console.log("Email notification sent successfully");
}

serve(handler);
