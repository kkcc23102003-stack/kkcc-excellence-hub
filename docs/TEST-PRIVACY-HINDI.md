# Test result storage — Admin ON / OFF

## Existing website upgrade
1. Backup/check existing data first. Supabase SQL Editor mein `KKCC-Excellence-Hub-TEST-PRIVACY.sql` ka poora text run karein. Ye latest KKCC student schema ke liye hai; fresh installation mein combined Production SQL includes this migration.
2. Updated app deploy karein. Server-only `SUPABASE_SERVICE_ROLE_KEY` already configured hona chahiye. Is key ko VITE_ variable/browser mein kabhi na rakhein. No new external service required.
3. `/admin/storage` → **Test result storage**, ya `/admin/tests` → expandable **Test result storage** section.
4. **Default ON** hai. Installation se old data delete nahi hota, setting automatically OFF nahi hoti; rerunning SQL preserves an existing OFF choice.
5. **Turn OFF → Confirm setting**. New tests temporary ho jayenge. Purane open saved attempts OFF mein autosave/submit nahi kar sakte; students new test start karein.
6. Old attempts/results hatane ke liye **Refresh setting and history counts** → counts/backup verify → `DELETE TEST HISTORY` type → **Delete old test history → Confirm delete history**. Saving OFF rehni chahiye. Each confirmed batch removes at most 5000 previewed rows; repeat until count zero. No production deletion was performed by the development agent.

## Student experience
- **ON:** existing database autosave, submitted result, history/resume and analytics.
- **OFF:** answers, score and result are NOT persisted to the database or localStorage/sessionStorage/IndexedDB. Temporary encrypted checkpoints are only in RAM. Questions/access are checked and scored by the server, not trusted from the browser. Page refresh/close loses progress/result; cannot resume on another device. Navigation away also ends this temporary page session. Temporary results never turn into saved results when Admin turns ON later.
- Account login/browser preferences still use their existing storage. This is test-result privacy, not account deletion or removal of quiz-wallet transactions.
- Network is required for server-checked answer checkpoints/submission. Only timely accepted answers count when a timer expires. No persistent reward/official record is created in temporary mode.
- Global/per-question timers, access grants and syllabus/question selection remain in effect. Admin edits to an active paper or mode changes invalidate temporary sessions; start again.
- Temporary start throttling is best-effort per-process RAM (30/hour for non-admin); not a multi-server durable exam quota. Stateless tokens are appropriate for temporary practice, not official one-attempt exam certification. Do not add response/body logging or caching of authenticated requests on your host.

## Cleanup scope
Only `learning_attempts` rows (unfinished attempts, answers, scores and submitted history). Accounts/profiles, orders/payments, enrollments/access grants, admin tests/questions, folders, notes and quiz-wallet records are untouched. Old saved-result URLs stop opening after cleanup.

Provider backups, exports, application/proxy logs or copies already viewed/downloaded by students are NOT erased. Database disk usage need not drop immediately after row deletion. Use the provider's separate retention controls for backups/logs.

## Implementation and verification
- RLS-protected singleton setting, admin-only confirmation RPC, database write guard while OFF; default ON.
- AES-256-GCM encrypted session/checkpoint, bound to user + setting epoch + expiry + deterministic paper fingerprint. Token and answers are not placed in URLs; the URL has only a random attempt ID and temporary flag.
- Missing SQL fails closed for new attempts instead of silently saving data.
- Local PostgreSQL/PGlite tests cover permissions, mode guards, idempotent install, scoped cleanup and restoration of ON. Unit tests cover tamper/user/epoch/expiry and question deadlines.
- Playwright exercises saved result → OFF → temporary result/no extra DB rows/no answer/token browser storage → refresh loss → cancelled cleanup → confirmed cleanup → ON and saved-result reload.
- These tests use an isolated fixture, not your production Supabase database.
