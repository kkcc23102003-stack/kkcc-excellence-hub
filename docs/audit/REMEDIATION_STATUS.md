# KKCC Excellence Hub — remediation status

This checkpoint is based on the verified Arena pre-remediation export.

## Completed safely in this offline checkpoint

- Removed the cross-subject hard-coded Polity fallback from Kit 2 Coins practice.
- Exact-topic bank questions remain preferred; sparse topics can only fall back
  to a verified question from the same subject. No unrelated subject is substituted.
- Renamed the user-facing `PYQ-style` practice mode to neutral `Exam-pattern`.
  Existing official/PYQ provenance metadata is not relabelled or fabricated.
- Retired the public SQL download surface. Old Supabase SQL files are no longer
  served from `public/downloads/`.
- Updated the repository quality gate so `public/downloads/` is inspected and
  legacy public SQL causes a failure.
- Retired legacy combined/cleaner/AI-question-engine setup files with explicit
  no-run notices.
- Removed the nested generated release ZIP from the application source tree.
- Existing student/auth/access Supabase architecture was not removed.

## Deliberately not executed

- No live Supabase migration, cleanup, storage deletion, or production cutover.
  A verified private owner export/backup is required first.
- No question-bank content was fabricated or mass-deleted to make audit numbers
  look green. The original template preservation requirement remains intact.
