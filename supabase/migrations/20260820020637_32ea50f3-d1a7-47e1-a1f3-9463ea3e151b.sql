-- QA cleanup: remove security-test artifacts created during verification.
DELETE FROM public.leads WHERE name LIKE 'QA TEST %' AND request = 'QA security test, ignore';
DELETE FROM public.analytics_events WHERE session_id IN ('qa-single', 'qa-abuse');
DELETE FROM public.rate_limit_hits WHERE scope IN ('track-event', 'submit-lead');