# KKCC AI Question Engine — 24-Hour Mode

The engine now supports a continuous 24-hour scheduler. It does **not** run one giant process: Supabase Cron wakes the Edge Function every 15 minutes. Each wake-up processes only a small batch, checks the rolling 24-hour candidate limit, and advances eligible topics.

## What you need

- Supabase project with `pg_cron` and `pg_net` extensions enabled.
- Gemini API key stored in the existing admin AI settings.
- One random `AI_CRON_SECRET` configured as an Edge Function secret.
- The same URL + secret available to the cron job.

## Scheduler SQL

Run this in Supabase SQL Editor after enabling `pg_cron` and `pg_net` and creating the Vault secrets:

```sql
select cron.unschedule('kkcc-ai-question-engine-15m')
where exists (select 1 from cron.job where jobname = 'kkcc-ai-question-engine-15m');

select cron.schedule(
  'kkcc-ai-question-engine-15m',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'kkcc_supabase_url') || '/functions/v1/ai-question-research',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'kkcc_ai_cron_secret')
    ),
    body := jsonb_build_object('source', 'supabase-cron-15m')
  );
  $$
);
```

The function's target interval is 30 minutes, so a 15-minute scheduler provides a safety window if one invocation is delayed. The rolling 24-hour candidate limit remains the hard quota.

## Free-database protection

Raw Google/Gemini research is never stored. Only compact candidate questions and source URLs/notes are retained. Rejected candidates older than 14 days and approved AI candidates older than 90 days are cleaned automatically by the database function.

## Important

“24-hour” means the scheduler is active around the clock. It does **not** mean unlimited Gemini/Google requests. Provider quotas and billing rules still apply. Keep the daily limit conservative on free-tier usage.

## External question archive (recommended)

The AI engine now keeps the full generated question payload out of Supabase. Supabase stores only lightweight metadata such as ID, exam/subject/topic, quality, status and `archive_key`.

Configure an S3-compatible provider in **Admin → Storage**:

- Cloudflare R2
- AWS S3
- Backblaze B2
- Wasabi / compatible storage

Then apply the migration:

`supabase/migrations/20261001020000_kkcc_external_question_archive.sql`

The archive uses keys under `kkcc-question-bank/v1/...`. Approved questions remain permanently discoverable; rejected queue metadata is disposable. The existing `test_questions` table still stores the questions actually selected into a test paper, because those are operational test records rather than the master question bank.
