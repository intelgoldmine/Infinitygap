-- ═══════════════════════════════════════════════════════════════════════════
-- pg_cron schedules: data-collector (raw signals, 45+ countries) + auto-intel
-- (intel_snapshots for industries / sub-flows). Requires pg_net + pg_cron.
--
-- ONE-TIME SETUP (Supabase SQL editor, as a role that can set DB parameters):
--   ALTER DATABASE postgres SET app.supabase_service_role_jwt = 'YOUR_SERVICE_ROLE_JWT';
--   (Copy JWT from Project Settings → API → service_role — treat as secret.)
-- Then reconnect / pooler recycle so cron workers see the setting.
--
-- Verify: SELECT * FROM cron.job;
--         SELECT * FROM net._http_response ORDER BY created DESC LIMIT 5;
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.cron_invoke_edge_function(function_path text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net
AS $$
DECLARE
  jwt text;
  project_ref text := 'gtyzvmnqifwyccgmirym';
  target_url text;
BEGIN
  BEGIN
    jwt := NULLIF(trim(current_setting('app.supabase_service_role_jwt', true)), '');
  EXCEPTION WHEN OTHERS THEN
    jwt := NULL;
  END;

  IF jwt IS NULL OR length(jwt) < 32 THEN
    RAISE WARNING 'cron_invoke_edge_function: app.supabase_service_role_jwt not set — see migration header / docs/cron-scheduling.md';
    RETURN;
  END IF;

  target_url := 'https://' || project_ref || '.supabase.co/functions/v1/' || function_path;

  -- pg_net lives in schema `net` on hosted Supabase (extension may be placed under `extensions` — search_path covers both)
  PERFORM net.http_post(
    url := target_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || jwt
    ),
    body := '{}'::jsonb
  );
END;
$$;

REVOKE ALL ON FUNCTION public.cron_invoke_edge_function(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cron_invoke_edge_function(text) TO postgres;

DO $cron$
DECLARE
  r RECORD;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    RAISE NOTICE 'pg_cron not available — skipped scheduling (common on some local stacks).';
    RETURN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    RAISE NOTICE 'pg_net not available — skipped scheduling.';
    RETURN;
  END IF;

  FOR r IN
    SELECT jobid FROM cron.job
    WHERE jobname IN ('cron_data_collector_every_5m', 'cron_auto_intel_every_5m')
  LOOP
    PERFORM cron.unschedule(r.jobid);
  END LOOP;

  PERFORM cron.schedule(
    'cron_data_collector_every_5m',
    '*/5 * * * *',
    $$SELECT public.cron_invoke_edge_function('data-collector');$$
  );

  PERFORM cron.schedule(
    'cron_auto_intel_every_5m',
    '*/5 * * * *',
    $$SELECT public.cron_invoke_edge_function('auto-intel');$$
  );
END
$cron$;
