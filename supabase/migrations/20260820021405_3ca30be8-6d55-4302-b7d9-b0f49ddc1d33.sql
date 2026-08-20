-- Least-privilege probe: BIGSERIAL inserts only need USAGE on the sequence (nextval),
-- SELECT is needed just to read currval/last_value. Drop SELECT and verify inserts still work.
REVOKE SELECT ON SEQUENCE public.rate_limit_hits_id_seq FROM service_role;