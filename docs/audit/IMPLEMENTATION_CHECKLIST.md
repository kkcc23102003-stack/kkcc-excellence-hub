# KKCC in-place audit and implementation

Source: public repository commit `68a32af`, original ZIP retained unchanged.

## Work items

- [ ] Student-only Supabase boundary; project-backed educational content and configuration; safe legacy export/import without changing IDs.
- [ ] Canonical student/test/course/series grants, read-after-write verification, expiry/revocation, error propagation.
- [ ] Student-specific query keys, sign-out cleanup, entitlement refresh.
- [ ] Enrolled courses/tests first on Home; enrolled series/tests first with no duplicated cards.
- [ ] URL-backed Select Subject → Select Chapter → Start Test flow for both individual tests and series.
- [ ] Correct bounded question generation using existing templates; no whole-pool memory allocation; source IDs and practice metadata.
- [ ] Preserve original questions/templates, including when a test changes generation mode.
- [ ] Server-validated attempts, submit/results and student result history; no question text/options in Supabase.
- [ ] Exhaustive template-space structural audit; every existing exam label and every chapter/difficulty accounted for; report missing official coverage honestly.
- [ ] Classes 9–12 mapping audit and corrections.
- [ ] Routes/auth/security/PWA/responsive/accessibility audit; fix reproducible defects.
- [ ] Production build, TypeScript, lint, unit/integration/browser tests and reproducible deployment instructions.

## Initial reproducible findings

- The repository tracks an archive only, without a package lockfile.
- Node >=20 in package.json contradicts dependencies requiring Node >=22.12.
- Baseline tsc fails; baseline lint: 297 errors and 11 warnings; baseline Vite build succeeds but does not type-check.
- test.$id loader destructures `search`, which is not a TanStack loader context field; use loaderDeps and deps.
- dashboard.index references undefined `seriesAccess` after destructuring two results from a three-call Promise.all.
- routeTree.gen is stale before Vite regenerates it.
- Student access cache keys omit user ID; access API errors are converted to empty arrays.
- Switching manual tests to deterministic generation deletes their question rows.
- bank-to-test allocates and shuffles the complete index space of each selected template.
- Exam/difficulty lookup silently falls back to the unfiltered pool when an exact slice is absent.
- Series chapter RPC accepts client exam/subject/chapter without validating against the purchased catalogue item.
- Series cards are duplicated in a separate enrolled section and the general catalogue, and enrolled display is truncated to 12.
- Results are calculated in browser state and are not saved to student result history.
- Existing CMS queries and legacy migrations place educational content in Supabase.

## Exam-count evidence

The original source has **35 official-syllabus rules**, **43 distinct paid-catalogue exam tracks**, and **67 bank labels** (including family/group aliases). There is not one unique missing 36th exam. Full manifests are recorded in baseline-bank.json; the final checklist must cover all bank labels, with scope distinctions and genuine source gaps documented.

## Environment limitations

No production admin/student credentials or Supabase database management access supplied. Public read-only export found zero publicly readable course, lecture, material, test and manual-question rows; published configuration was preserved. Private/unpublished data must be exported by the owner before cutover. Production migration application and live-account acceptance cannot be asserted from a public clone.
