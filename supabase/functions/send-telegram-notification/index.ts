import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormData {
  projectType: string;
  answers: Record<string, string>;
  lang: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectType, answers, lang }: FormData = await req.json();
    
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!botToken || !chatId) {
      console.error("Missing Telegram configuration");
      throw new Error("Telegram configuration missing");
    }

    // Format the message
    const projectTypeLabels: Record<string, string> = {
      ecommerce: "🛒 E-commerce магазин",
      telegram: "🤖 Telegram бот",
      crm: "📊 CRM / Админ-панель",
      integration: "🔗 Кастомная интеграция",
    };

    let message = `📋 *Новая заявка*\n\n`;
    message += `*Тип проекта:* ${projectTypeLabels[projectType] || projectType}\n\n`;
    message += `*Ответы на вопросы:*\n`;

    // Add all answers
    Object.entries(answers).forEach(([key, value]) => {
      if (value && value.trim()) {
        if (key === "contact") {
          message += `\n📞 *Контактные данные:*\n${escapeMarkdown(value)}\n`;
        } else {
          const questionNum = key.replace("q", "");
          message += `\n*${parseInt(questionNum) + 1}.* ${escapeMarkdown(value)}\n`;
        }
      }
    });

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

serve(handler);
