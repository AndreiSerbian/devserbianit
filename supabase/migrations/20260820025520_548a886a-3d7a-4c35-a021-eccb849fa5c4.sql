-- Consent receipts: opaque identity only. No IP, no name, no email, no user agent.
CREATE TABLE public.consent_receipts (
  consent_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.consent_receipts TO service_role;
ALTER TABLE public.consent_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to consent receipts"
  ON public.consent_receipts FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- Immutable chronological consent decision history.
CREATE TABLE public.consent_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_seq bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  consent_id uuid NOT NULL REFERENCES public.consent_receipts(consent_id) ON DELETE CASCADE,
  policy_version text NOT NULL,
  analytics_allowed boolean NOT NULL,
  preferences_allowed boolean NOT NULL,
  decided_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX consent_decisions_latest_idx
  ON public.consent_decisions (consent_id, decision_seq DESC);

GRANT SELECT, INSERT ON public.consent_decisions TO service_role;
ALTER TABLE public.consent_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to consent decisions"
  ON public.consent_decisions FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- Bind every analytics event to the decision that actually allowed it.
ALTER TABLE public.analytics_events
  ADD COLUMN consent_id uuid REFERENCES public.consent_receipts(consent_id) ON DELETE SET NULL,
  ADD COLUMN consent_decision_id uuid REFERENCES public.consent_decisions(id) ON DELETE SET NULL;

-- Material consent policy version. Bumped only for material changes
-- (purposes, categories, data, consent-related recipients) — never for editorial edits.
CREATE OR REPLACE FUNCTION public.consent_policy_version()
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  SELECT '2026-08-20.1'::text
$function$;

-- Records a new immutable decision. Server owns the uuid, the sequence,
-- the timestamp and the policy version; callers only supply the choices.
CREATE OR REPLACE FUNCTION public.record_consent_decision(
  p_consent_id uuid,
  p_analytics_allowed boolean,
  p_preferences_allowed boolean
)
 RETURNS TABLE(
   consent_id uuid,
   decision_id uuid,
   decision_seq bigint,
   policy_version text,
   analytics_allowed boolean,
   preferences_allowed boolean,
   decided_at timestamptz
 )
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  v_consent uuid;
BEGIN
  IF p_analytics_allowed IS NULL OR p_preferences_allowed IS NULL THEN
    RAISE EXCEPTION 'consent choices are required';
  END IF;

  IF p_consent_id IS NULL THEN
    INSERT INTO public.consent_receipts DEFAULT VALUES RETURNING consent_receipts.consent_id INTO v_consent;
  ELSE
    SELECT r.consent_id INTO v_consent
      FROM public.consent_receipts r
     WHERE r.consent_id = p_consent_id;
    IF v_consent IS NULL THEN
      INSERT INTO public.consent_receipts (consent_id) VALUES (p_consent_id)
        RETURNING consent_receipts.consent_id INTO v_consent;
    END IF;
  END IF;

  -- Same lock as the analytics insert: revoke and event can never interleave.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('consent:' || v_consent::text, 0));

  RETURN QUERY
  INSERT INTO public.consent_decisions AS d
    (consent_id, policy_version, analytics_allowed, preferences_allowed)
  VALUES
    (v_consent, public.consent_policy_version(), p_analytics_allowed, p_preferences_allowed)
  RETURNING d.consent_id, d.id, d.decision_seq, d.policy_version,
            d.analytics_allowed, d.preferences_allowed, d.decided_at;
END;
$function$;

-- Server-authoritative status: current material version + latest decision.
CREATE OR REPLACE FUNCTION public.consent_status(p_consent_id uuid)
 RETURNS TABLE(
   current_policy_version text,
   decision_id uuid,
   decision_seq bigint,
   policy_version text,
   analytics_allowed boolean,
   preferences_allowed boolean,
   decided_at timestamptz
 )
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  SELECT public.consent_policy_version(),
         d.id, d.decision_seq, d.policy_version,
         d.analytics_allowed, d.preferences_allowed, d.decided_at
    FROM public.consent_decisions d
   WHERE d.consent_id = p_consent_id
   ORDER BY d.decision_seq DESC
   LIMIT 1
$function$;

-- Atomic consent-aware analytics insert. One transaction, one advisory lock:
-- latest decision is resolved, validated and bound to the row without a race window.
CREATE OR REPLACE FUNCTION public.insert_analytics_event(
  p_consent_id uuid,
  p_event_name text,
  p_page text,
  p_locale text,
  p_case_id text,
  p_session_id text
)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  v_decision_id uuid;
  v_allowed boolean;
  v_version text;
BEGIN
  IF p_consent_id IS NULL OR p_event_name IS NULL THEN
    RETURN false;
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('consent:' || p_consent_id::text, 0));

  SELECT d.id, d.analytics_allowed, d.policy_version
    INTO v_decision_id, v_allowed, v_version
    FROM public.consent_decisions d
   WHERE d.consent_id = p_consent_id
   ORDER BY d.decision_seq DESC
   LIMIT 1;

  IF v_decision_id IS NULL
     OR v_allowed IS NOT TRUE
     OR v_version IS DISTINCT FROM public.consent_policy_version() THEN
    RETURN false;
  END IF;

  INSERT INTO public.analytics_events
    (event_name, page, locale, case_id, session_id, consent_id, consent_decision_id)
  VALUES
    (p_event_name, p_page, p_locale, p_case_id, p_session_id, p_consent_id, v_decision_id);

  RETURN true;
END;
$function$;

REVOKE ALL ON FUNCTION public.consent_policy_version() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_consent_decision(uuid, boolean, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.consent_status(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.insert_analytics_event(uuid, text, text, text, text, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.consent_policy_version() TO service_role;
GRANT EXECUTE ON FUNCTION public.record_consent_decision(uuid, boolean, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.consent_status(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.insert_analytics_event(uuid, text, text, text, text, text) TO service_role;