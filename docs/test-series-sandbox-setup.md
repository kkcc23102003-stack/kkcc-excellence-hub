# Test-series, sandbox, and production setup

## Supabase-independent local preview

1. Install the repository dependencies with `npm ci`.
2. Start the existing app with `npm run dev -- --host 0.0.0.0`.
3. Open `/login` and select **Open sandbox admin preview**. The seeded preview admin can explore `/admin`, edit the sample tests and series syllabus, grant/revoke demo access, and inspect the payment and AI controls without a Supabase project.
4. Visit `/test-series` and open the active Punjab PCS sample series. The seeded published paper uses the existing Punjab GK → Districts and Headquarters question-bank mapping; it is not a fabricated or duplicated placeholder.

The preview database is isolated, in-memory, and resets when the dev server stops. It makes no production writes, sends no real payments, and does not run external Supabase Edge Functions. The preview button is only available on a Vite development server with no Supabase project configured. A development server connected to Supabase and all production builds use normal Supabase authentication instead.

The automated flow check starts its own temporary no-Supabase Vite server and shuts it down when complete:

```sh
npm run check:sandbox:flow
```

## Supabase production setup

Do not apply a combined schema dump, legacy reset script, or migration directly to an unverified production project. Back up the project and confirm the target environment first. Apply any outstanding migrations from `supabase/migrations/` in timestamp order using the project's normal deployment process. With the Supabase CLI, after linking the intended project, use:

```sh
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

The test-series and related feature migrations include:

- `20260930190000_series_access_grants.sql` — expiring series access grants.
- `20261001000000_series_test_access_bridge.sql` — legacy test-grant compatibility.
- `20261001010000_kkcc_ai_question_engine.sql` and `20261001020000_kkcc_external_question_archive.sql` — AI research settings and review queue.
- `20261001030000_on_demand_deterministic_tests.sql` — bank-backed test-generation settings.
- `20261002100000_test_series_syllabus_blueprints.sql` — editable, draft/published subject/chapter/topic outlines.
- `20261002110000_reviewed_ai_question_bank.sql` — durable storage for questions explicitly promoted after admin review.

These files are additive entries in the existing migration history. If earlier migrations are pending, apply them in order as well; the list above is not a replacement for the full migration history. No remote Supabase migration is applied or claimed as verified by this setup note.

Configure the existing public Supabase URL and publishable key using the variable names in `.env.example` or the hosting provider's environment settings. Never put the service-role key or any private provider secret in browser code or a committed `.env` file. Grant the existing admin role through the project's established secure admin process; do not make the demo preview identity an administrator in production.

## Admin operations and integrations

- **Syllabus:** In Admin → Exam Bank, paste a subject/chapter/topic outline, review the exact question-bank mapping and coverage, save as a draft, then publish. Unmapped tags stay visibly unmapped; generation fails rather than substituting unrelated questions.
- **Offline payments:** In Admin → Offline Access, find a student who has already registered, grant the selected series with the agreed validity, renew an existing grant, or revoke it. This records admin-managed access and does not assert that an online payment occurred.
- **Razorpay:** The app does not have a verified live Razorpay integration. Keep payments disabled until credentials, webhook configuration, order creation, signature verification, refunds, and production callbacks have been configured and tested. Use the disconnect control to remove stored integration settings; do not describe the sandbox or a saved key as a live payment.
- **AI questions:** The engine is off by default. Deploy/configure its Supabase Edge Function and required secrets before enabling it. Keep auto-publish off; review generated candidates and explicitly promote only approved questions to the reviewed AI question bank.

## Verification

Run the full repository check before release:

```sh
npm run check
```

This includes the live sandbox RPC smoke test, syllabus mapping checks, lint/type checks, production build, and a guard that the sandbox is unavailable in a production build. The test-suite does not connect to or mutate the remote Supabase project.
