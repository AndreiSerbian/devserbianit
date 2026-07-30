import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent =
  | "cta_hero_click"
  | "cta_nav_click"
  | "telegram_click"
  | "email_click"
  | "form_start"
  | "form_submit_success"
  | "form_submit_error"
  | "case_open"
  | "calculator_open";

const SESSION_KEY = "anon_session_id";

const getSessionId = () => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
};

/** Fire-and-forget, never blocks or breaks the UI. */
export const trackEvent = (
  event: AnalyticsEvent,
  meta: { locale?: string; caseId?: string } = {},
) => {
  try {
    void supabase.functions.invoke("track-event", {
      body: {
        event_name: event,
        page: typeof window !== "undefined" ? window.location.pathname : null,
        locale: meta.locale ?? null,
        case_id: meta.caseId ?? null,
        session_id: getSessionId(),
      },
    });
  } catch {
    /* analytics must never surface errors to users */
  }
};