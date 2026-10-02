# KKCC AI Question Intelligence Engine

This feature is intentionally **disabled by default**. It uses Gemini with Google Search grounding to research high-yield exam concepts, then sends only compact, quality-gated candidates into an admin review queue.

## What you need

1. A Gemini API key from Google AI Studio.
2. Deploy the included Supabase Edge Function:
   `supabase/functions/ai-question-research/index.ts`
3. Run migration:
   `supabase/migrations/20261001010000_kkcc_ai_question_engine.sql`
4. Open **Admin → AI question engine**.
5. Paste the Gemini key once, enable Google Search grounding, keep **Auto-publish OFF** initially, and save.
6. Click **Sync all topics**, then **Run AI now**.

## 24-hour automation

The engine is designed to run in small batches rather than one giant job. This keeps Supabase Edge Function execution inside the platform limits and avoids filling the database with raw web research.

For automatic scheduling, create a recurring Supabase scheduled invocation for `ai-question-research` (for example every 6 hours). The Edge Function also supports a server-side `AI_CRON_SECRET` header for non-user scheduled calls. Do not put that secret in browser code.

## Free-tier reality

The app code itself adds no paid AI subscription. Gemini API and Google Search grounding are subject to Google's current free-tier quotas and may require billing if those quotas are exceeded. Supabase Free also has usage limits. The engine therefore has a configurable daily candidate limit and stores no raw search pages.

## Database-saving design

Only these compact records are retained:
- question + four options
- correct option + explanation
- exam/subject/topic/difficulty
- quality score
- source URLs/notes
- review status

Rejected candidates older than 14 days and approved candidates older than 90 days are cleaned up by the included SQL function.

## Safety/quality rule

AI candidates do **not** automatically become student questions unless Auto-publish is explicitly enabled and the configured quality threshold is met. The recommended setting is Auto-publish OFF so an admin can review new questions first.

No system can guarantee that a future exam will repeat a fixed percentage of questions. The engine is optimized for syllabus fit, PYQ patterns, recurring concepts, source verification and question quality.
