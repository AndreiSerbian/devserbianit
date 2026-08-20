-- QA cleanup after regression checks.
DELETE FROM public.rate_limit_hits WHERE scope IN ('qa-retention', 'submit-lead', 'track-event');
DELETE FROM public.leads WHERE name LIKE 'QA TEST %' AND request IN ('QA parallel boundary test, ignore', 'QA sequence acl test, ignore');
DELETE FROM public.analytics_events WHERE session_id = 'qa-seq';