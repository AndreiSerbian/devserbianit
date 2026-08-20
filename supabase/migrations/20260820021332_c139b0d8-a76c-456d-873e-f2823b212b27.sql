-- QA retention probe: one expired control row (~30h old) and one fresh control row.
-- ip_hmac values are synthetic QA markers, not derived from any real client IP.
INSERT INTO public.rate_limit_hits (ip_hmac, scope, created_at) VALUES
  ('qa-retention-probe-expired-0000000000000000', 'qa-retention', now() - interval '30 hours'),
  ('qa-retention-probe-fresh-0000000000000000', 'qa-retention', now());