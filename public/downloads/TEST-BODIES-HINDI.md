# Notes + tests: Supabase Storage, not heavy Database text

**Private bucket = Supabase Storage ka hi access setting. Koi alag private-storage provider, S3 ya alternative database nahi add kiya gaya.** Paid content protect karne ke liye buckets PRIVATE rakhein.

## Kya kahan rahega
- Notes main text: Supabase Storage `kkcc-note-bodies` (previous release).
- Saved test question text, options aur explanations: Supabase Storage `kkcc-test-bodies`, verified JSON files. Ek test/batch ke multiple questions ek file share karte hain; 1001 MCQs ke liye 1001 uploads nahi.
- Database: IDs/relations, titles, syllabus, price/access, standard instructions, order, marks, correct-answer index aur file path/hash/size jaise small metadata. Heavy fields `question_text`, `options`, `explanation` blank ho jaate hain **sirf verified file reference ke saath**.
- Student profiles/accounts, payments, purchased access, attempts, answers aur results: unchanged. Migration in records ko delete/move/disable nahi karti. Existing result-saving ON/OFF feature ka setting bhi unchanged.
- Built-in question template bank pehle ki tarah project code mein hai; usko unnecessarily Database/Storage mein copy nahi kiya gaya. Published/saved questions Storage-backed hain; deterministic test recipes small metadata hain.

## Existing site setup
1. Database backup AND actual Supabase Storage objects ka separate backup lein. Database backup alone file contents restore nahi karta.
2. Pehle previous `KKCC-Excellence-Hub-NOTE-BODIES.sql` installed hona chahiye for notes. Phir **`KKCC-Excellence-Hub-TEST-BODIES.sql`** Supabase SQL Editor mein run karein. Fresh full Production SQL mein dono included hain. Existing site ke liye incremental SQL use karein.
3. Updated app deploy karein; server-only `SUPABASE_SERVICE_ROLE_KEY` configured rakhein, browser/VITE environment mein kabhi expose na karein.
4. Supabase Storage mein `kkcc-test-bodies` aur `kkcc-note-bodies` PRIVATE hone chahiye. Restrictive browser-role policies bhi installed hain; inhe remove na karein.
5. Cloud smoke test: ek free aur paid Easy test publish; Advanced mein edit/reload; authorized student attempt/submit/result; unauthorized student blocked. Ek free/paid note bhi test karein. Local fixture results cloud deployment ka substitute nahi hain.

## Purane Database content ko safely clear karna
Admin → **Storage** (Tests page par direct setup/migration link bhi hai):

### Current notes
Previous **Note text → Supabase Storage** panel: counts check → `MOVE NOTES TO STORAGE` type → confirm, 5 notes per batch.

### Current tests / historical copies
**Test content → Supabase Storage** panel mein source choose karein:
1. **Current test questions** → current `kkcc_test_questions` bodies.
2. **Historical test_questions table** → agar old table present hai, uski independent historical bodies. Current test edits ko overwrite nahi karta.
3. **Historical materials table** → old notes table, if present. Current library ko overwrite nahi karta.

Check counts → `MOVE CONTENT TO STORAGE` type → **Move verified content batch** → confirm. Up to 100 question rows / 5 historical notes per call. Har batch report review karke repeat karein until Database bodies = 0 for that source. Absent historical tables show zero. Unrelated legacy/custom tables are not blanket-deleted.

**Rows, IDs, foreign keys, grading/access metadata delete nahi hote.** Historical versions remain as Storage archives referenced from the original historical row; current app reads current managed records. Old SQL exports, Supabase backups, or copies in other projects are not erased by this process.

## Verification / failure safety
- Immutable new object name; existing file never overwritten.
- Upload → actual file download → SHA-256 + byte-length validation → only then Database commit.
- Migration checks original timestamp + text/options/explanation hashes. Concurrent edit ⇒ skip, not overwrite. Review and retry.
- Upload/read-back or Database failure leaves original live content intact. An unused uploaded object may remain; no automatic object deletion is done.
- New Easy publish commits only small references/metadata transactionally after verified file upload. Same request retry does not duplicate published tests. Advanced question writes also verify before committing.
- Missing/corrupt files produce explicit errors, never silent blank questions. Restore the referenced object from backup. Do not delete active/shared files: one file can serve many question rows, including partially migrated batches.
- Deleting a test or editing a question does not automatically remove old Storage objects. Review all DB references/backups/in-flight writes before any separate object cleanup. Normal SQL Cleaner is not required for migration and does not reclaim these objects.
- Historical legacy tables may contain malformed rows: errors stop/skip affected content instead of discarding it. Repair/review rather than blindly repeating failed batches.

## Practical limits
- JSON file cap 16 MiB per test/batch; hosting request/time limits may be lower. Split large imports. Typed-note cap remains 200,000 characters / 1 MiB. This does not implement 1 GB Samsung Notes/PDF uploads.
- Immutable body cache: up to 32 MiB serialized-content budget / 32 files / 2 minutes, with request coalescing; decoded JS objects have additional RAM overhead. Reads are batched; authorization stays in existing server access checks.
- Database still uses space for metadata and student data; actual savings depend on content size. Storage capacity/egress follow Supabase plan limits. Database physical allocation may not immediately shrink due to MVCC/autovacuum/free-page reuse. No automatic VACUUM FULL or student-data deletion.

## What was NOT done
No real production content was migrated/deleted from this development workspace. Admin actions above perform the verified migration on your configured project after deployment. No live cloud payment was made.
