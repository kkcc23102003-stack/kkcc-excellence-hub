> Historical accordion/series-first report. Superseded for current limits and verification by TEST-SCALE-2026-10-05.md.

# Test folder organiser — verification

## Current change verification
- **97/97 unit/database tests passed** (including multiline accordion list validation).
- **6/6 targeted Chromium browser E2E tests passed**: the existing five Easy/Advanced builder checks plus the new folder lifecycle.
- TypeScript and production build passed. Lint: 0 errors, 12 existing warnings.
- This is a targeted regression run. The earlier 78-test whole-app report belongs to the previous release; it was not re-run in full for this change.

## New browser flow covered
1. Add subject, add two chapters in a numbered multiline list, verify collapsed contents are hidden; expand chapter, add/expand optional topic and paste inline. Save topic questions and direct chapter questions as private drafts.
2. Reload the organiser and verify both chapter sets persist.
3. Verify draft sets do not appear in student catalogue.
4. Select a single saved set and preview a chapter paper.
5. A paid source defaults the combined editor to Paid; zero price is rejected.
6. Check organiser mobile width at 390px.
7. Assemble complete subject from both chapter sets; deliberately choose Free, review and publish.
8. Student sees the two-question combined paper, attempts/submits it and reloads saved result.

Existing regression scenarios cover Easy Free/Paid publication and access grants,
Advanced manual publication/edit/reorder/unpublish/delete, mobile validation,
and a scoped Advanced bank recipe with admin question count.

## Unit/database coverage
- Path expansion and exact series/subject boundaries.
- Optional topic validation (requires chapter).
- Explanations/answer preservation and exact-duplicate removal.
- Conflicting answers/explanations fail rather than silently choosing one.
- Generated/already-combined sources rejected; no silent count truncation.
- Draft/topic persistence, repeat-safe publication and service-only folder access.
- Combined snapshot survives deletion of its original source test.
- Combined SQL can be rerun without replacing saved tests.

## Deployment and boundaries
Apply **KKCC-Excellence-Hub-TEST-FOLDERS.sql**, then redeploy. It includes the previous
Notes/Publish Fix. No production SQL or real payment was executed here. Browser
checks use the production build, local PGlite SQL/RLS and emulated Supabase transport.
Static template banks remain in source; folders are metadata and authored questions
remain ordinary draft/published test snapshots. No old S3 files were migrated.

Limits are explicit: one subject/series, max 50 original sets and 200 unique questions
per combined test. Combined paper uses the Easy scoring defaults (1 mark, no negative
marking), editable later in Advanced. Series names do not create paid catalogue bundles.

## Accordion correction
Flat navigation replaced with downward-expanding subject/chapter/topic lists. Parent actions remain accessible while descendants are open. Uses existing SQL; no migration added. Batch creation inherits the selected parent and forbids children below topics.

Accordion browser coverage additionally confirms unsaved pasted text survives chapter collapse/reopen and checks 390px width with the nested editor open.

## Series-first correction
Updated browser run: 6/6 targeted tests; 97/97 unit tests. TypeScript passed.
Starts with series name, then a scoped subject input/list. Saves Mathematics and Hindi
under the same series; verifies each saved subject starts collapsed with its own action.
Opens Mathematics, saves chapter list, then tests optional topic and explicit Skip topics
paths. Existing regression assertions cover persisted MCQs, draft privacy, paid controls,
collapse/reopen preservation, mobile width and preview/publication/student result.
Empty series is a local draft until its first subject save; no additional SQL migration.
Pasted ready MCQs are parsed, not generated from arbitrary theory text.
