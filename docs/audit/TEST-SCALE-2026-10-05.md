# Own-question scale, isolation and Advanced publication

## Verification
- **101/101 unit/database tests passed**.
- **80/80 full Chromium browser tests passed** (8.7 minutes). This is a fresh whole-suite run, not the historical 78-test JSON report.
- TypeScript, production build, repository quality and 8 release SQL mirrors passed.
- Lint: zero errors, 12 existing React-refresh warnings.
- Local production build with PGlite SQL/RLS and emulated Supabase transport. No hosted production SQL, payment or deployment was executed.

## Defects and repairs
1. Zod defaults were applied to partial settings edits. Publish/title edits could inject defaults for mode, payment and recipe fields. Partial validation now returns only explicitly supplied keys; regression tests check exact payloads. Bank publish validation uses the same strict generator as setup rather than a different topic lookup.
2. Own questions added to deterministic tests could retain auto-fill mode. Single add/edit and bulk authoring now switch to manual-only; the paste “Keep Auto Bank Fill” button and accidental manual-mode toggle were removed. Explicit bank Set Up remains available. Browser test publishes/unpublishes a Physics bank recipe, adds one authored Physics question, then verifies the student paper contains that own question.
3. Heuristic subject-family matches could broaden a custom name into unrelated domains. The strict generator now uses exact bank subjects or an explicit alias list, without chapter-driven subject substitution. AI-assist bank fallback uses this same strict path.
4. Fixed own-content quotas were inconsistent across client/server/SQL/answer submission. Removed the own 200-question, 50-list-name, 50-source-set and 1000-answer caps; large managed test/question reads page through Supabase results. Child-list writes batch 100 rows; source reads batch 50 IDs. Easy preview mounts 25 editor cards/page, Advanced saved list 50/page.

## Scale evidence
- SQL and schema tests save 1001 authored questions and verify exact counts.
- Browser: paste 1001 MCQs, edit explanation on preview page two, publish Paid, inspect first/last Advanced pages, unpublish/republish, confirm price remains 99, reload and verify last question and total 1001.
- Schema tests accept 101 chapter names and 1001 responses; combination retains 1201 unique own questions.
- Existing real-student small-paper attempts/results, paid access, notes/diagrams, all exam flows, mobile and offline guards passed in the complete suite.
- This is **not** an infinite-capacity/performance claim. Database integer capacity, server memory, provider request-size/timeouts, storage and per-field validation still apply. Split oversized imports into smaller saved sets in the same chapter. Authored content has no fixed product count quota. Generated bank coverage/count limits are separate and remain.

## Upgrade
Existing Test Folders users run `KKCC-Excellence-Hub-TEST-SCALE-FIX.sql` and redeploy.
Fresh setup uses the latest combined Test Folders / Production SQL. The small additive
migration updates only the v3 own-question count condition; all existing validation,
admin role checks, transactionality and saved data are retained. Retry is safe.

Evidence: `TEST-SCALE-BROWSER-RESULTS.txt`. Historical JSON/accordion reports remain historical.
