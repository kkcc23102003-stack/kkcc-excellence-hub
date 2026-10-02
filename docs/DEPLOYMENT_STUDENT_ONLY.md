# Student-only Supabase cutover and deployment

**Release status: source implemented and locally tested; no production migration/deployment is asserted.** Do not deploy over a populated legacy CMS without the verified owner export. Current syllabus depth/academic review is a separate release gate; see `audit/QUESTION_BANK_COVERAGE.md`.

## 1. Back up before any cutover

- Keep the original archive and a Supabase backup, including auth/user/access/commerce rows.
- The public GET-only export in `audit/public-export-status.json` is **not** a private export. Zero publicly visible education rows does not prove the database is empty.
- In a private operator shell, configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and the 64-hex-character `KKCC_SETTINGS_ENCRYPTION_KEY`. Never add service/secret/encryption keys to `VITE_*`, client code, screenshots or version control.
- Generate an encryption key privately, e.g. `export KKCC_SETTINGS_ENCRYPTION_KEY="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"`; store it in the hosting secret manager and retain a secure backup.
- Run `npm run content:export -- /private/path/owner-export.private.json`. This is a **read-only** remote operation. It exports educational/config/file/AI rows, preserves IDs and source metadata, encrypts private-setting values, and produces a count/hash manifest. It does not export or relocate student/auth data.
- Copy all legacy educational assets to external storage, verify sizes/checksums and replace their URLs without changing educational IDs. Use a private bucket for protected resources; only explicit branding/thumbnail prefixes may be public. Do not merely retain one-year Supabase signed URLs and call migration complete.

## 2. Configure persistent project content and import

Choose one:

### Self-hosted persistent volume


### Vercel/serverless or distributed deployment


Vercel without a persistent backend defaults to **readonly** and rejects editing/starting persisted tests. A serverless temporary filesystem is not a production content store.

With the same encryption key used for the export, run:

```
npm run content:import -- /private/path/owner-export.private.json --allow-update
```

The import merges by original IDs/setting keys; it does not delete omitted questions. Conflicting existing records require the explicit update flag. Verify every table count, exact ID, original question/source/year metadata, course/test/lecture relationship and external asset. Check a renamed series uses its canonical code ID. Archive the successful export/import manifests privately.

## 3. Apply only the appropriate SQL

- **Fresh Supabase project:** run `supabase/STUDENT_ONLY_SCHEMA.sql`. Do **not** run the legacy combined CMS SQL or replay educational-table migrations into a fresh student-only backend.
- **Existing project:** after verified export/import, in the **same SQL session/run**, execute `SET kkcc.verified_project_export = 'true';` followed by `supabase/migrations/20261001120000_student_only_learning_access.sql`.
- The cutover guard intentionally refuses a nonempty legacy CMS without this explicit owner acknowledgement. The acknowledgement is not automatic proof of the copy: verification remains the owner's responsibility.
- The migration detaches educational FKs, keeps existing user/access data, backfills missing profiles/ordinary roles, replaces unsafe legacy policies/RPC privileges, and quarantines legacy education/config rows rather than deleting old questions. Remove legacy storage access and retire old educational signed URLs only after verified copies.
- **Important:** quarantine is not physical deletion. Existing legacy education rows remain as a restricted migration backup until the owner completes external-copy verification and a separate reviewed retirement. Fresh installs contain no educational tables. The application reads/writes educational content only in project/external storage.

The two historical migrations specifically requested in the audit (`20260930120000_paid_test_series_exam_tracks.sql` and `20260930160000_test_access_grants.sql`) belong to the old CMS architecture. Their paid/grant intent is retained; new deployments must use the student-only schema instead of recreating educational tables/FKs.

Bootstrap the first admin using a trusted operator SQL session, after creating/confirming the real account:

```
INSERT INTO public.user_roles(user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE lower(email) = lower('YOUR_CONFIRMED_ADMIN_EMAIL')
ON CONFLICT(user_id, role) DO NOTHING;
```

Do not use an anonymous/self-claim admin shortcut. Verify the selected user ID before execution. Backend guards prevent accidental last-admin deletion and student-tool blocking of admins.

## 4. Build and serve

Use Node **22.12+** (local validation used Node 22.23.3).

```
npm ci
npm run typecheck
npm run lint
npm test
npm run check:pwa
npm run check:repo
npm run build
npm start
```

The Node server binds `0.0.0.0`, uses `PORT` (default 3000), serves `dist/client`, and dispatches the actual production SSR/server-function build. Configure `KKCC_PUBLIC_ORIGIN` to the official HTTPS origin behind a trusted TLS reverse proxy. For Vercel use the existing Nitro/Vercel build configuration and server-only persistent storage.

Set browser-public `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` at build time. Server `SUPABASE_URL` and server-only `SUPABASE_SERVICE_ROLE_KEY` are also required for trusted student attempt/commerce writes. Supabase auth redirect URLs must include the actual HTTPS login/signup/reset-password origins. Confirm real mail delivery and expired/recovery links in staging.

External educational uploads are configured in Admin → Storage; credentials stay encrypted in project storage. Configure provider CORS for the official origin and signed PUTs. Paid PDF/image resources use durable private `kkcc-file://` references and signed read links issued after access checks. Test external IAM/CAS/upload/read/delete against the real provider before production.

Online gateway charging is not implemented by the inherited checkout. Wallet purchases and verified desk/admin enrollment are operational paths; payment settings alone are **not** proof of a working Razorpay checkout. No live charge or automatic financial reward was tested. Device-local Kit 2 points are untrusted claims, never server money; vouchers stay pending for manual verification.

## 5. Reproduce local browser evidence (not production)

```
npx playwright install --with-deps chromium
npm run test:e2e
```

Playwright starts a fresh local fixture when needed. The fixture uses real PostgreSQL/RLS in PGlite and the production app build, but emulates GoTrue/PostgREST HTTP contracts and mints ephemeral test credentials. It never connects to production Supabase. Browser code uses a relative same-origin proxy, not a sandbox localhost address. Reports are written to `audit/browser-results.json`.

For real acceptance, repeat in a credentialed staging deployment: selected real Student A/B, multiple course/test/series grants, expired/revoked access, free/paid controls, every learning step, reload/resume/autosave/submit/result, distinct account caches, mobile layouts, real mail, provider storage, and permitted commerce. Account query keys and ownership checks must remain intact.

## 6. Remaining production gates and operational policy

- Academic reviewers must approve current notification-dependent/Punjab/professional syllabuses, dated law/tax/current-affairs content, paper formats, and the reported quantity/difficulty gaps. Structural enumeration is not academic certification. Generated additions are practice, not official/PYQ.
- Approve a retention policy for learner responses/results and private immutable paper snapshots. Do not delete referenced papers blindly: that would destroy result review. Clean unreferenced failed-start snapshots only after verifying no matching attempt metadata exists.
- Students are limited to 30 new starts/hour; resume/idempotent retries are supported. Autosave revisions prevent older updates overwriting newer ones. Database time governs cutoffs; late submissions use saved answers. Per-question windows cannot be extended by reload.
- Realtime access updates require the genuine Supabase setup/publication; 15-second polling/focus refresh remains a fallback. Local fixture evidence does not prove production realtime.
- Already-issued resource links/downloads cannot be retroactively erased; configure a suitable lease and private bucket. YouTube token wrappers/watermarks are not DRM. The source-code practice bank is intentionally available for public quiz use; private attempt grading is server-authoritative.
- App-builder JavaScript is privileged reviewed administrator code. Untrusted local-storage code is no longer executed, but approved admin scripts must still be vetted. Do not weaken import protection/RLS to silence errors.

Questions and Question Bank remain outside Supabase.
