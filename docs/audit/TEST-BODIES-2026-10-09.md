# Supabase Storage test bodies — release verification

## Scope
Notes remain in Supabase Storage from the prior release. Saved test question text/options/explanations now go to the `kkcc-test-bodies` Supabase bucket with PRIVATE access. No alternate provider was added. Database retains identity, relationships, grading/access metadata and verified object references. Student accounts, payments, grants, attempts, answers and results are untouched by content migration.

- Shared immutable JSON per test/import batch; 1001 questions can share one object rather than 1001 uploads.
- Upload/read-back/hash verification before database writes. New Easy publication is transactional and idempotent; Advanced insert/edit/bulk paths use the same verified storage adapter.
- Existing inline questions still read correctly. Server-side hydration retains paid/course checks and answer redaction until submission. No public body URLs.
- Current and historical question migration: 100 rows per confirmed batch. Historical notes: 5 per batch; current notes retain their existing separate panel. Source hashes and timestamps guard concurrent edits. Rows/IDs/FKs stay intact.
- Historical `public.test_questions` and `public.materials`, if present, are archived independently, not used to overwrite newer managed content. Unrelated/custom tables/backups are not blanket-deleted.
- Old/orphan Storage files are intentionally retained; cleanup needs independent reference/backup review. Physical DB disk allocation need not drop immediately.

## Executed verification
- **125/125 unit/database tests passed**. Includes real local PostgreSQL/RLS, broad-policy resistance, service/admin-only RPCs, source-CAS protection, historical IDs/FKs/student-profile preservation, publisher rollback/idempotency and 1001-question shared files.
- Production SDK transport mock verifies upload/read-back and empty heavy-field payloads even with legacy global S3/file/readonly settings; production tests never fall back to those providers.
- Targeted builders/folders/storage browser run: **10/10 passed**.
- Final full browser regression: **95/95 passed**, zero skipped/flaky/unexpected. Existing saved result was opened after source content migration, then a fresh student attempt completed from the Storage-backed source.
- TypeScript, lint/build/repository/question-bank checks passed. Lint has 12 existing warnings, no errors. PWA check and all **14 SQL mirrors** passed.
- Screenshot: `TEST-BODY-STORAGE.png`; full browser report: `browser-results.json`.

These are isolated local fixtures, including emulated Supabase HTTP and local object files. No live Supabase cloud/payment smoke test or production content deletion/migration was performed. Deploy after incremental SQL, verify on the actual project, then perform separately confirmed migration from Admin → Storage. See `docs/TEST-BODIES-HINDI.md`.
