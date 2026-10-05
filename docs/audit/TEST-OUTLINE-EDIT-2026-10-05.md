# Outline management — 2026-10-05

## Verification
- 103/103 unit/database tests passed.
- 8/8 targeted Chromium E2E tests passed (4.1 minutes), including all Easy/Advanced builder and folder lifecycle tests.
- TypeScript and production build passed; lint zero errors, 12 existing warnings. Release SQL mirrors checked (9 files).
- The prior release's 80-test complete browser run was not rerun in full for this change.
- Tests use the production build, local PGlite/RLS and emulated Supabase transport. No production DB/deployment/payment operation was performed.

## Coverage
- Rename series/subject/chapter/topic; reject conflicting destinations and malformed scopes.
- Atomic descendant/test updates preserve title, prices, publish flags, questions and IDs; subject tags follow subject renames.
- Browser reload confirms names persist. A real submitted student result remains readable after subject and chapter rename.
- Cancelled removal leaves data intact. Checkbox gates permanent deletion; chapter removal and whole-series removal survive reload.
- SQL deletes matching manual tests and cascades their questions, while retaining other series. Anonymous/student roles cannot invoke management RPC.
- Stale saved-test ID confirmation aborts rather than deleting unexpected tests.
- Back controls collapse panels; prior unsaved-text collapse/reopen regression remains covered.
- Existing 1001-question, paid-access, manual-only authoring, bank publication and student results regressions passed.

## Boundaries
- This manages manual-test organiser groupings, not catalogue products, generation recipes, student accounts or payment records.
- Removing a parent permanently deletes its descendant manual tests/questions, including published tests. Old attempts tied to deleted tests may no longer open. Separate snapshots elsewhere remain independent. Dialog warns explicitly.
- Rename does not rewrite authored question text or test titles. Attempt-selection metadata follows subject/chapter rename; question IDs, responses and scores stay intact.
- An unsaved editor gets a separate discard confirmation before management operations. Back alone retains it. Duplicate names are rejected, not merged.
- Empty pending series (before first subject save) are managed locally; persisted nodes use an admin/service-only transactional RPC with table locks and exact test-ID recheck.
- Requires TEST-OUTLINE-EDIT SQL after prior folder setup, or latest combined Test Folders/Production SQL. Migration is additive/re-runnable.
