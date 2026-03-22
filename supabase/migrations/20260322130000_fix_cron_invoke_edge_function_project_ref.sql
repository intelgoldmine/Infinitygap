-- Point pg_cron → Edge Function HTTP calls at the active Supabase project.
-- Safe to re-run (CREATE OR REPLACE). Use if an older DB still had a previous project_ref.

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
