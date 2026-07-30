CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  preferred_contact_method TEXT NOT NULL,
  contact_value TEXT NOT NULL,
  request TEXT NOT NULL,
  budget_and_timeline TEXT,
  locale TEXT NOT NULL DEFAULT 'ru',
  page_url TEXT,
  ip_hash TEXT,
  telegram_delivery_status TEXT NOT NULL DEFAULT 'pending',
  email_delivery_status TEXT NOT NULL DEFAULT 'pending',
  overall_status TEXT NOT NULL DEFAULT 'new'
);

GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to leads"
ON public.leads FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  event_name TEXT NOT NULL,
  page TEXT,
  locale TEXT,
  case_id TEXT,
  session_id TEXT
);

GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to analytics events"
ON public.analytics_events FOR ALL TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE INDEX idx_analytics_events_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();