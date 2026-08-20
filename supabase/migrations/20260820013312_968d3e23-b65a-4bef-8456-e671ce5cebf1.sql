-- 1. rate limit storage (no raw IP, only keyed HMAC)
CREATE TABLE public.rate_limit_hits (
  id BIGSERIAL PRIMARY KEY,
  ip_hmac TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'submit-lead',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX rate_limit_hits_lookup_idx
  ON public.rate_limit_hits (ip_hmac, scope, created_at DESC);

GRANT ALL ON public.rate_limit_hits TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.rate_limit_hits_id_seq TO service_role;

ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to rate limit hits"
  ON public.rate_limit_hits
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- 2. atomic rate limit check (advisory lock serializes one identity)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip_hmac TEXT,
  p_scope TEXT DEFAULT 'submit-lead',
  p_max_hits INT DEFAULT 5,
  p_window_seconds INT DEFAULT 3600
)
RETURNS TABLE (allowed BOOLEAN, retry_after INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lock_key BIGINT;
  v_window_start TIMESTAMPTZ := now() - make_interval(secs => p_window_seconds);
  v_hits INT;
  v_oldest TIMESTAMPTZ;
BEGIN
  IF p_ip_hmac IS NULL OR length(p_ip_hmac) < 16 THEN
    RAISE EXCEPTION 'invalid rate limit identity';
  END IF;

  -- deterministic 64-bit lock key from the hmac (no raw IP involved)
  v_lock_key := ('x' || substr(encode(digest(p_scope || ':' || p_ip_hmac, 'sha256'), 'hex'), 1, 16))::bit(64)::bigint;
  PERFORM pg_advisory_xact_lock(v_lock_key);

  SELECT count(*), min(h.created_at)
    INTO v_hits, v_oldest
    FROM public.rate_limit_hits h
   WHERE h.ip_hmac = p_ip_hmac
     AND h.scope = p_scope
     AND h.created_at >= v_window_start;

  IF v_hits >= p_max_hits THEN
    RETURN QUERY SELECT false,
      GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_oldest + make_interval(secs => p_window_seconds) - now())))::INT);
    RETURN;
  END IF;

  INSERT INTO public.rate_limit_hits (ip_hmac, scope) VALUES (p_ip_hmac, p_scope);

  RETURN QUERY SELECT true, 0;
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, TEXT, INT, INT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, TEXT, INT, INT) FROM anon;
REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, TEXT, INT, INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, TEXT, INT, INT) TO service_role;

-- 3. retention purge (idempotent)
CREATE OR REPLACE FUNCTION public.purge_rate_limit_hits()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM public.rate_limit_hits
   WHERE created_at < now() - interval '24 hours';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_rate_limit_hits() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.purge_rate_limit_hits() FROM anon;
REVOKE ALL ON FUNCTION public.purge_rate_limit_hits() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.purge_rate_limit_hits() TO service_role;

-- 4. lead retention helper (no schedule, explicit retention required)
CREATE OR REPLACE FUNCTION public.delete_expired_leads(retain_months INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_deleted INT;
BEGIN
  IF retain_months IS NULL OR retain_months < 1 THEN
    RAISE EXCEPTION 'retain_months must be >= 1';
  END IF;

  DELETE FROM public.leads
   WHERE created_at < now() - make_interval(months => retain_months);
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_expired_leads(INT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_expired_leads(INT) FROM anon;
REVOKE ALL ON FUNCTION public.delete_expired_leads(INT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.delete_expired_leads(INT) TO service_role;

-- 5. drop client-side privileges (RLS stays as second layer)
REVOKE ALL ON TABLE public.leads FROM anon, authenticated;
REVOKE ALL ON TABLE public.analytics_events FROM anon, authenticated;

-- 6. stop keeping any IP-derived value on leads
UPDATE public.leads SET ip_hash = NULL WHERE ip_hash IS NOT NULL;

-- 7. scheduled purge (pg_cron)
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule(jobid) FROM cron.job WHERE jobname = 'purge-rate-limit-hits';
    PERFORM cron.schedule(
      'purge-rate-limit-hits',
      '17 * * * *',
      $job$SELECT public.purge_rate_limit_hits();$job$
    );
  END IF;
END;
$$;