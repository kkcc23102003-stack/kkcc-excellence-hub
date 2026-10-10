# Test-result retention — 6 October 2026

Implemented Admin ON/OFF result retention and a separate, explicitly confirmed old-history cleanup.

## Checks
- 107 unit/database tests passed (includes three new privacy tests).
- Complete browser suite: 84 passed (10.2 minutes), including Easy/Advanced/folder publishing, 1001-question paper, access restrictions, student enrollment revocation, mobile single-accent styling, service-worker privacy and retention flow.
- Follow-up retention browser run passed after strengthening the flow to use a separately logged-in **Student A** for temporary answers/results, with Admin in an independent context. Polls refreshed counts rather than reading a pre-render React Query state.
- TypeScript passed; ESLint: zero errors, 12 existing fast-refresh warnings.
- Production build passed. Existing >500 kB chunk/timing warnings remain; no new build failure.
- Repository quality, question-bank integrity audit and 11 SQL download mirrors passed. Bank audit reports its existing quality-rejected items without altering templates.

## Verified flows
Default ON → save real result → OFF → student temporary result → no extra attempt rows → no answer/token local/session storage (unrelated router scroll positions excluded) → refresh loses result/progress → cancellation leaves history → typed confirmation deletes previewed attempt rows → ON restores saved results and reload.

Database tests: non-admin/anonymous restrictions, write guards in OFF even for service writes, no unconfirmed cleanup, install rerun keeps OFF/data, successful cleanup preserves profiles/access grants, ON allows writes again.
Token tests: ciphertext, tampering rejection, user/epoch/expiry binding, question-window and overall deadline checks, changed-paper fingerprint.

## Evidence
- `browser-results.json`: full 84-case run.
- `TEMPORARY-TEST-RESULT.png`: actual student temporary mobile result.
- `TEST-RETENTION-ADMIN.png`: admin OFF with confirmed cleanup result.
- `tests/e2e/test-retention.spec.ts`, `tests/unit/test-retention.test.ts`.

All database/browser checks used isolated local PostgreSQL/PGlite plus emulated GoTrue/PostgREST contracts and actual app handlers. No real production Supabase SQL, deployment or data deletion was performed. Provider backups/logs/exports are not covered by row cleanup. Default remains ON until the owner explicitly changes it.
