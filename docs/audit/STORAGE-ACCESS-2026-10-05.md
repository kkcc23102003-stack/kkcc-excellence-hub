# Storage inspection and discoverable access revocation

- 104/104 unit/database tests passed.
- 82/82 complete Chromium browser suite passed (8.9 minutes).
- TypeScript, production build, repository checks and 10 SQL mirrors verified.
- Lint: zero errors; 12 existing React-refresh warnings.
- Evidence: STORAGE-ACCESS-BROWSER-RESULTS.txt. Earlier JSON and individual feature reports remain historical.

## Changes and verified paths
The existing universal enrollment panel offered grants but no colocated revocation list.
It now lists all grants for the selected student (paged backend reads), with exact item
labels, expiry/method/status, cancellation, confirmation, revoked history and refresh.
Existing audited admin-only course/test/series revoke endpoints are reused. It does not
delete student accounts or payment records, refund payments or implement a global ban.
Free content or another valid entitlement can still allow access. Pending offline invites
remain managed by the existing offline-access panel.

Browser verification: grant a paid test, access it as the actual student, cancel removal,
revoke, observe access denied, regrant and observe restored access. Revoked history remains.
Course and series removal lock those items while the unrelated direct test grant stays active.
The old grant-success message is cleared on revoke/student change to avoid misleading status.

Storage inspection is a separate read-only panel from the existing cleanup tool. Its admin-only
RPC returns PostgreSQL size and per-bucket object counts/metadata byte totals, with unknown-size
counts. Unit tests verify anon/student rejection, admin reads, exact aggregation and no deletions.
Browser tests exercise check/refresh and mobile width. It does not claim to measure remaining
plan quota, actual provider billing, backups, bandwidth or external file providers.

## Upgrade and limits
Run STORAGE-USAGE SQL on existing installations, then deploy updated source. Latest combined
Production SQL includes it. Access removal needs no new SQL beyond existing access tables/RLS.
Tests use a production build, local PGlite/RLS and emulated Supabase transport. Hosted provider
billing, production SQL, actual online payments and production deployment were not executed.
