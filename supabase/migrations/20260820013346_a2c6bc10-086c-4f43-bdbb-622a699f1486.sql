REVOKE ALL ON TABLE public.rate_limit_hits FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.rate_limit_hits_id_seq FROM anon, authenticated;