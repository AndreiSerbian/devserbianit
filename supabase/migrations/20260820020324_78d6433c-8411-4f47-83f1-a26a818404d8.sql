-- 1. Recreate rate-limit / retention functions without SECURITY DEFINER (SECURITY INVOKER),
--    with SET search_path = '' and fully schema-qualified relation references.
--    Built-in constructs (EXTRACT, GREATEST, CEIL, count) live in pg_catalog, which is
--    always implicitly searched and cannot be shadowed by search_path.

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip_hmac text,
  p_scope text DEFAULT 'submit-lead',
  p_max_hits integer DEFAULT 5,
  p_window_seconds integer DEFAULT 3600
)
RETURNS TABLE(allowed boolean, retry_after integer)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
DECLARE
  v_lock_key BIGINT;
  v_window_start TIMESTAMPTZ := pg_catalog.now() - pg_catalog.make_interval(secs => p_window_seconds);
  v_hits INT;
  v_oldest TIMESTAMPTZ;
BEGIN
  IF p_ip_hmac IS NULL OR pg_catalog.length(p_ip_hmac) < 16 THEN
    RAISE EXCEPTION 'invalid rate limit identity';
  END IF;

  v_lock_key := pg_catalog.hashtextextended(p_scope || ':' || p_ip_hmac, 0);
  PERFORM pg_catalog.pg_advisory_xact_lock(v_lock_key);

  SELECT count(*), pg_catalog.min(h.created_at)
    INTO v_hits, v_oldest
    FROM public.rate_limit_hits h
   WHERE h.ip_hmac = p_ip_hmac
     AND h.scope = p_scope
     AND h.created_at >= v_window_start;

  IF v_hits >= p_max_hits THEN
    RETURN QUERY SELECT false,
      GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_oldest + pg_catalog.make_interval(secs => p_window_seconds) - pg_catalog.now())))::INT);
    RETURN;
  END IF;

  INSERT INTO public.rate_limit_hits (ip_hmac, scope) VALUES (p_ip_hmac, p_scope);

  RETURN QUERY SELECT true, 0;
END;
$function$;

CREATE OR REPLACE FUNCTION public.purge_rate_limit_hits()
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM public.rate_limit_hits
   WHERE created_at < pg_catalog.now() - INTERVAL '24 hours';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_expired_leads(retain_months integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
DECLARE
  v_deleted INT;
BEGIN
  IF retain_months IS NULL OR retain_months < 1 THEN
    RAISE EXCEPTION 'retain_months must be >= 1';
  END IF;

  DELETE FROM public.leads
   WHERE created_at < pg_catalog.now() - pg_catalog.make_interval(months => retain_months);
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$function$;

-- 2. Re-assert EXECUTE privileges explicitly (idempotent).
REVOKE ALL ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.purge_rate_limit_hits() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.purge_rate_limit_hits() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_expired_leads(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_expired_leads(integer) FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_expired_leads(integer) TO service_role;

-- 3. Sequence privileges: nothing for PUBLIC/anon/authenticated, minimum for service_role.
REVOKE ALL ON SEQUENCE public.rate_limit_hits_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE public.rate_limit_hits_id_seq FROM anon, authenticated;
REVOKE UPDATE ON SEQUENCE public.rate_limit_hits_id_seq FROM service_role;
GRANT USAGE, SELECT ON SEQUENCE public.rate_limit_hits_id_seq TO service_role;