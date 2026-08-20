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

  -- deterministic 64-bit advisory lock key derived from the hmac (no raw IP involved)
  v_lock_key := hashtextextended(p_scope || ':' || p_ip_hmac, 0);
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

REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, TEXT, INT, INT) TO service_role;