# Remove old library, preserve student history — local verification

## Scope
Selected workflow is REMOVE OLD, not migrate existing library. Additive Content Reset installer; explicit reviewed cutoff + typed confirmation + browser confirmation; batches clear current/legacy library payloads and queue only unreferenced files in dedicated note/test body buckets. Hidden IDs/FKs/grading/access metadata remain. Catalog updates use compare-and-swap, avoiding overwrite of concurrent edits. New post-review content is excluded.

Preserved attempt papers are read-back/SHA-256 verified in a third private **Supabase** bucket (`kkcc-result-papers`); DB stores small references only. Existing records/answers/results are not rewritten. New saved attempts get immutable paper snapshots. Before deletion, up to five existing snapshots are prepared/reverified per call; SQL refuses deletion while any attempt lacks verification for the cutoff and locks concurrent attempt insertion for the deletion transaction. Unreconstructable legacy papers fail closed. Owned historical result review and ongoing submission work independently of deleted library/catalog; another student's URL is denied. Temporary mode remains non-persistent.

Supplied sample notes upload/verify into Supabase Storage on explicit restore; existing live edited samples are not overwritten. Code template bank stays outside Supabase.

## Evidence
- **129/129 unit/database tests passed**. Four new reset tests cover installer idempotency/no implicit deletion, role denial, hidden payload clearing with FK/student preservation, new-content exclusion, shared-file protection, safe sample restore, and refusal until attempt snapshots are freshly verified.
- Complete browser run: **95 existing tests passed**; new 96th reset test failed only on an exact-text locator that omitted the rendered `Explanation:` prefix. Error snapshot showed the correct saved score, selected/correct answer, full question and explanation after deletion.
- Corrected selector; **new destructive end-to-end test passed on a fresh fixture**, including student result review, other-account denial, existing ongoing paper submission, absent old note/test, removed original note file, Storage-backed sample restoration, and mobile overflow check. This is 95 full-run regressions plus one corrected targeted pass, **not a claim of a subsequent all-96 single run**. After the final permission review (including live access/price checks and free-series snapshot metadata), both the reset and retention tests passed together on a fresh fixture (**2/2**). Latest `browser-results.json` is that targeted run.
- `npm run check` passed: repository/question-bank checks, lint, TypeScript, production build. Existing lint warnings (12) and bundle-size warnings remain.
- All **15 release SQL mirrors** verified; PWA readiness passed.
- Screenshot: `CONTENT-RESET.png`.

## Deployment and limitations
Run latest Production SQL before updated app deployment, take independent DB/Storage backups, then use Admin Storage workflow. Installer alone deletes nothing. No authenticated production session/mutation was established; **no live Supabase removal/sample import is claimed**. All browser/database tests use disposable local PostgreSQL/RLS/HTTP fixtures and local Storage emulation, not real cloud deletion.

Shared PDFs/images, external Drive files, provider backups and protected historical paper snapshots intentionally remain. Separate history deletion can leave orphan paper-only objects requiring reviewed Storage maintenance; never empty the protected bucket when retaining results. Physical PostgreSQL allocation may not shrink immediately. See `docs/CONTENT-RESET-HINDI.md` for setup, safety and copy/paste sanity queries.
