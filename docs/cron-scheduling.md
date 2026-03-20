# Scheduled jobs: `data-collector` + `auto-intel`

## What was true before

- Migrations enabled **`pg_cron`** and **`pg_net`**, but **no jobs** were registered. Nothing invoked the Edge Functions on a timer until migration `20260320160000_schedule_data_collector_auto_intel_cron.sql`.

## What runs every 5 minutes (after setup)

| Job | Edge Function | Purpose |
|-----|----------------|---------|
| `cron_data_collector_every_5m` | `data-collector` | Inserts fresh rows into `raw_market_data` (crypto, forex, GDELT, Google News across **40+ country editions**, Reddit, YouTube, HN, GitHub, X if configured, etc.). Prunes data older than **3 days**. |
| `cron_auto_intel_every_5m` | `auto-intel` | Rotates through industries; writes **`intel_snapshots`** (cached reports) for **one industry + all its sub-flows** per run (global scope key `::global`). Feeds the “auto-updated” copy on industry / sub-flow pages. |

## One-time secret (required)

Cron runs **inside Postgres** and must call your project URL with a **valid JWT**. Use the **service role** key (same privilege your functions use for DB writes).

In the **Supabase SQL editor** (or any postgres superuser session):

```sql
ALTER DATABASE postgres SET app.supabase_service_role_jwt = 'YOUR_SERVICE_ROLE_JWT';
```

Use the **service_role** JWT from **Project Settings → API** (keep it secret; never commit it).

If the setting is missing, the helper function logs a **WARNING** and skips HTTP calls; no data is collected until fixed.

Reconnect the pool or wait for new cron workers to pick up the GUC if jobs still fail.

## Verify

```sql
SELECT jobname, schedule, command FROM cron.job WHERE jobname LIKE 'cron_%';
```

After a few minutes:

```sql
SELECT id, status_code, content::text
FROM net._http_response
ORDER BY id DESC
LIMIT 10;
```

(Exact view names for `pg_net` responses can vary by version; check `net` schema if empty.)

Manually invoke:

```sql
SELECT public.cron_invoke_edge_function('data-collector');
SELECT public.cron_invoke_edge_function('auto-intel');
```

## Throughput expectations

- **`data-collector`**: One run per 5 minutes is enough to keep a **steady stream** of raw signals; country count is defined in `COUNTRIES` in `supabase/functions/data-collector/index.ts`.
- **`auto-intel`**: Processes **one industry per run** (batch size `1`) so each run completes **one industry + all its sub-flows** (many sequential AI calls). A full pass over all industries takes **N × 5 minutes** where N = number of top-level industries in the registry. For 24 industries, that is roughly **2 hours** per full industry cycle, **not** “every page every 5 minutes.”
- If runs **timeout**, increase the Edge Function **max duration** in the Supabase dashboard for `auto-intel`, or reduce work per run (e.g. sub-flow batching — not implemented yet).

## “Every page 24/7”

- **Industry pages** and **sub-flow pages** read **`intel_snapshots`** / **`useCachedIntel`** keyed by scope + `geoScopeId`. The **auto-intel** job currently generates **`::global`** snapshots only; **geo-scoped** cache rows are produced when users hit **`industry-intel`** / **`social-intel`** with a region selected.
- **History**: `intel_snapshots` stores successive reports; **raw** history is trimmed by `data-collector` after 3 days (by design). To keep longer raw history, change the delete window in `data-collector` or archive to another table.

## Local development

Some local stacks **do not** ship `pg_cron`. The migration **skips** `cron.schedule` when `pg_cron` is missing; use **manual** `curl` or the Dashboard “Invoke function” to test.

## If `net.http_post` fails (schema)

Hosted Supabase usually exposes `net.http_post`. If your cluster reports “function does not exist”, try qualifying as `extensions.http_post` or check `SELECT proname, nspname FROM pg_proc JOIN pg_namespace ON ... WHERE proname = 'http_post';`.
