# Private Storage note bodies — local release verification

## Shipped
- Supabase remains the only database; no alternate providers introduced.
- Verified UTF-8 main text in private `kkcc-note-bodies`; DB keeps metadata, private reference, SHA-256 and byte size. Explicit inline compatibility fallback only when no file reference exists.
- Admin add/edit, linked-course editor/list, free catalogue/reader, authorized paid/course reader and built-in adoption hydrate the same text. Metadata-only edits reuse a verified immutable version.
- Separate admin confirmation, five-note legacy migration, read-back verification, source hash/timestamp CAS. Production preview aggregates in PostgreSQL; migration fetches only five legacy bodies per call. No automatic migration or old-object deletion.
- Restrictive browser-role Storage policy protects note objects even when an older permissive policy is broad. Public catalog strips paid bodies and private references. Paid-price/coin-price/explicit-paid classification is shared across catalogue, reader and purchasing.
- Typed-note limit 200,000 characters, object cap 1 MiB; no claim of 1 GB file uploading. PDF/thumbnail links and question template banks unchanged.
- Editor save now waits for refetch before enabling the next save: fixes a discovered race where immediately changing Free/Paid could be reset by a late old response.
- Local interactive preview uses separate disposable CMS file from automated browser tests.

## Verification
- 120/120 unit/database tests passed, including verified bytes/hash, upload/read/corruption failures, empty-body clearing, private RLS despite broad policies, idempotent setup, server-only migration/status, concurrent-edit CAS and safe retries.
- Full browser regression: **94/94 passed**, including public/student/admin mobile route sweeps, existing series/tests, retention controls and thumbnails. Results: `browser-results.json`.
- After final private-policy/access-consistency hardening: private-note browser tests rerun **3/3 passed** (migration/PDF preservation, new/edit/free/paid/purchased reading, sample adoption/retry). Targeted note unit suite **6/6 passed**.
- TypeScript passed. `npm run check` passed (build/repository/question-bank audit/lint/typecheck); lint has 12 pre-existing warnings, no errors. PWA readiness and all 13 release SQL mirrors passed.
- Browser used isolated local production-build fixture with PGlite SQL/RLS and filesystem note objects; SDK/cloud services and real payments were not used.

## Release operation
Use incremental `KKCC-Excellence-Hub-NOTE-BODIES.sql` on an existing installed site. Full Production SQL includes it for fresh installation. Deploy, smoke-test a free note and paid authorized/unauthorized accounts on the actual Supabase bucket, then explicitly migrate old notes in Admin → Materials / Storage if desired. Back up Database **and actual Storage objects separately** first.

Physical Database allocation need not shrink immediately after text replacement (MVCC/free page reuse). Old/orphan objects are intentionally retained and consume Storage until separately reviewed. Storage capacity/egress follow the Supabase plan.

No real production notes, accounts, payments or test history were migrated/deleted in this session.
