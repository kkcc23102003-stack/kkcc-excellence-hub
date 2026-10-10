# App audit, optimisation and thumbnails — 6 October 2026

## Completed verification
- `npm test`: **114/114** unit/database checks pass.
- Full Playwright suite: **91/91** pass, 10.4 minutes. Includes three role-specific mobile route sweeps across **46 routes** (12 public, 12 student, 22 admin). This is route smoke coverage plus dedicated flows, not every possible button/input combination.
- `npm run check`: repository integrity, deterministic question-bank sample, ESLint, TypeScript and production build pass. 12 pre-existing fast-refresh warnings; existing large lazy chunk warnings remain.
- PWA readiness and all **12** SQL download mirrors pass.
- Question-bank deterministic sample: 34,139 positions checked; 31,256 emitted valid, 2,883 intentionally null, zero structural failures/quality rejections/exceptions. Original template count/IDs preserved. Not full academic or current-syllabus certification.
- Regression coverage includes mobile/keyboard test styling, strict subject bank generation, Easy/Advanced/manual publishing, a 1001-question paid paper, folder edit/delete, enrollment grants/revocation, auth isolation, private service-worker cache exclusions, result-retention ON/OFF and separately confirmed history cleanup.
- New browser checks: connection loss/reconnect on actual student temporary test, safe PWA update cancellation without losing a selected answer, static 304 response with zero body, gzip exclusion, image/text thumbnail save/upload/remove/reload, literal HTML-looking text rendering and preserved paid settings.

## Fixed during audit
1. Quiz generated random HTML on server/client, causing React hydration error. Interactive quiz now client-renders; no mismatched SSR random questions.
2. Missing quiz slices no longer silently substitute unrelated-subject questions. Explicit non-scoring empty state with retry; no reward/timer scoring for unavailable questions.
3. Dashboard materials re-added built-in samples independently of server admin visibility and duplicated server sample rows. Removed that client fallback; server list is authoritative for paid/hidden/deleted samples.
4. Admin analytics queried removed `learning_attempts.subject`. Reads existing encoded subject metadata instead and surfaces attempt-query failures.
5. Admin security health referenced a legacy CMS-table RPC. Uses existing admin-only storage-usage RPC; no new health schema needed.
6. Coins loader attempted authenticated wallet read during unauthenticated SSR and could show a stale zero. Wallet now loads via per-user authenticated query and participates in payment invalidation/retry.
7. Punjabi gender/number template explanations expanded to clarify the grammar relationship, fixing the quality-sample gate without loosening its rules or deleting templates.
8. Fixture now understands scheduled-notification OR filters; absence of fixture support is not silently treated as evidence of an empty inbox.

## Measured/bounded optimisations
- Dashboard materials route JS chunk: **99,884 → 3,999 bytes** in local production builds after removing duplicate client theory-bank construction (~96% smaller for this route chunk ONLY; not a total-app or real-user speed claim).
- Visible-tab fallback access polling: every 15s → every 60s (240 → 60 timer opportunities/hour, 75% reduction); realtime invalidation, explicit invalidations and focus/reconnect refresh retained. Server authorization still applies on every protected operation. Hidden tabs do not poll.
- Test-retention history counts load only when expanded in Admin Tests.
- Production Node asset cache bounded at **32 MiB raw+gzip / 128 entries**, LRU eviction. Hash-based weak ETags allow 304 on unchanged public files; private/secure-video responses remain no-store and excluded from conditional caching. Gzip q=0 respected; SSR Vary values preserved.
- Cover-only test updates are metadata-only and no longer rebuild a full generated paper. Two thumbnail browser cases passed again after this refinement, including the expanded 390px editor and persisted image/text/delete flows.
- Thumbnail images lazy-decode/load, browser resize target 1280px and server 4 MiB cap. Text thumbnails need no generated image, paid image API or object upload.
- CI now also checks question quality and SQL mirror parity, reducing future regressions.

## Delivery/setup
`KKCC-Excellence-Hub-THUMBNAILS.sql` adds cover metadata and a dedicated public raster-cover bucket. Existing retention mode/prices/student records unchanged. See `docs/THUMBNAILS-HINDI.md`. Combined Production and student-only schemas include it; downloads page links installer and guide.

## Remaining boundaries
All runtime checks use a local PostgreSQL/PGlite database, emulated GoTrue/PostgREST and the real production app handlers. Thumbnail image uploads are stored in a disposable fixture directory during tests. Real Supabase network/storage policies, Razorpay capture/refunds/webhooks, SMTP delivery, deployed mobile network performance, other browser engines and concurrent production load require deployment-specific checks. No live payments, production database deletion, migration execution or production deployment was performed. Large bank/syllabus lazy chunks still exist; do not claim the app is universally bug-free or maximally optimised.
