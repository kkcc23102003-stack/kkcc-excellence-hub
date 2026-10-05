# Easy + Advanced Test audit — 5 October 2026

## Final verified result

- **78/78 browser tests passed**, one clean full-suite run (~6.5 minutes).
- **93/93 unit/database tests passed**.
- TypeScript and production build passed; ESLint: 0 errors, 12 existing warnings.
- Machine-readable final browser results: `docs/audit/browser-results.json`.

## Browser coverage

| Area | Verified |
| --- | --- |
| Easy free test | Subject/chapter, title, typed series name, MCQ paste, editable explanation, Next/checkbox publish gate, save/reload, student card, attempt/submit/result reload |
| Easy paid test | INR + coin prices persisted; unpaid student blocked; admin grant unlocks assigned student, other account stays blocked |
| Easy mobile | Incomplete numbered questions rejected, zero-price paid test rejected, draft survives switching tabs, no horizontal overflow at 390px |
| Advanced manual | Empty draft cannot publish; rapid metadata autosaves retain subject/chapter/series; preview → publish actually publishes; edit MCQ/options/explanation; reorder both directions; attempt/result; unpublish/republish/delete |
| Advanced bank recipe | NEET → Physics → actual chapter, 3-question recipe (not forced 60), exact scoped subject/chapter, publish and learner result |
| Existing bank | 66 exam flows, each using a real subject available in that exam; subject → chapter → start → answer → submit/result |
| Access/security | Admin grants for test/course/series, ownership of results, student denied admin pages, invalid chapter injection, no wrong-course fallback |
| Other regressions | Course coin purchase, mobile public routes, signup/logout/account isolation, safe offline service-worker behavior, diagram-library insertion |

## Product fixes made during the browser audit

1. Advanced bulk **Next → Publish** previously saved questions but left the test a draft while announcing it was live. The explicit publish intent now reaches the server, and success is based on saved publish state. On a metadata failure, the UI explains that questions were saved and directs the admin to retry Publish without duplicating the bulk import.
2. Advanced full-record blur saves could overwrite a different field saved moments earlier. The editor now sends serialized field-level patches, validated server-side against current test metadata.
3. Selecting another test could display stale uncontrolled settings. Settings reset on test switch; bank subject/exam inputs refresh when a recipe changes.
4. Removing an option before the correct option now adjusts its answer index instead of moving the correct answer to another option.
5. Reorder/edit/delete controls cannot race an in-flight question save/reorder. Server cache invalidation also runs after writes; older in-flight reads cannot repopulate the cache after a write.
6. Easy series-name entry is clearer, offers existing-name suggestions, and appears in final review, admin list, normal student cards and enrolled cards. A typed name groups/labels tests; it does **not** create a new paid catalogue bundle.
7. Mobile preview toolbar no longer occupies a large sticky overlay; Easy action buttons wrap and builder tabs fit narrow screens.
8. Student catalogue copy no longer promises every paper is exactly 60 questions.

## Test harness corrections (not production data changes)

- Playwright fixture startup now binds the expected port 4600.
- Local PostgREST emulator accepts the SDK's `columns` insert parameter and serializes PostgreSQL numeric fields as JSON numbers.
- Exam fixtures use actual bank subjects, not exam names mislabeled as subjects. Strict production scope was not relaxed to make these fixtures pass.
- Checkout empty-state assertion matches current wording. Login helper avoids starting another navigation while logout has already navigated to Login.

## Scope and limitations

Tests used real browser UI against the production build and local PostgreSQL-compatible PGlite SQL/RLS, with emulated GoTrue/PostgREST transport. **No production Supabase migration, real Razorpay charge, real email delivery, or old S3 attachment migration was performed.** Passing this suite is not a guarantee that every possible combination or deployment configuration is bug-free.

No additional SQL was introduced by this audit. Existing deployments still need the previously supplied latest `KKCC-Excellence-Hub-PUBLISH-FIX.sql` if not already applied, server-only Supabase configuration, and redeployment of this release.

## Re-run locally

```bash
npm ci
npx playwright install --with-deps chromium
npm test
npm run test:e2e
```

The browser suite starts the isolated fixture on port 4600. Optional
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` supports a preinstalled Chromium binary.
Fixture admin: `admin@fixture.invalid` / `FixturePass123!` (local test account only).
