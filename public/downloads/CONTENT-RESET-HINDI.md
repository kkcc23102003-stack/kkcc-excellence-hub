# Purane notes/tests remove karna — students/results safe

**9 October 2026. Latest choice: REMOVE OLD, migration nahi.** Code/local fixture tests ko production deletion na samjhein. Is release ne aapke live Supabase project se kuch delete nahi kiya.

## Pehle setup (SQL zaroori hai)
1. Supabase **Database aur Storage dono ka independent backup** lein. Restore procedure bhi check karein. Maintenance window mein old content, series catalog, files ya backups edit/restore na karein.
2. Supabase SQL Editor mein latest **`KKCC-Excellence-Hub-PRODUCTION-SQL.sql`** poori run karein, **updated app deploy karne se pehle**. Ismein Notes/Test Bodies aur Content Reset setup included hai. Agar latest Note Bodies + Test Bodies + Thumbnail/Privacy schemas already installed hain, standalone **`KKCC-Excellence-Hub-CONTENT-RESET.sql`** sufficient hai.
3. Installer idempotent/additive hai; install karne se content/student history delete nahi hoti. New app `content_deleted_at` aur attempt-paper references use karti hai, isliye SQL pehle. Server-only `SUPABASE_SERVICE_ROLE_KEY` configure rakhein; browser mein expose na karein.
4. Updated app deploy karein. `/downloads` par SQL download/copy aur yeh guide available hain.

## Reviewed removal
- Admin → Storage → **Delete old notes/tests · keep student records**.
- **Review old content counts** se cutoff milta hai. Uske baad created items exclude hote hain.
- Type **`DELETE OLD NOTES AND TESTS`**, press **Delete reviewed old content batch**, phir browser confirmation.
- Pehle har existing attempt ka original available question paper **`kkcc-result-papers` private Supabase Storage** mein hash/read-back verified hota hai. Ek call mein up to 5 papers. Repeat when preparation is pending. Database mein sirf attempt ID, object reference, hash, bytes aur verification timestamp; answers/scores/student records move ya overwrite nahi hote.
- Agar purane attempt ka source pehle hi missing/changed hai aur question IDs safely reconstruct nahi hote, deletion **stop** hoti hai. Original source backup restore karke retry karein; student history delete karke bypass na karein.
- Main cleanup up to 500 rows/table + 100 queued objects/call hai. Same review/cutoff ke saath repeat until remaining rows/preparation aur pending Storage files zero; alerts bhi resolve karein.
- Purane notes/test bodies aur original dedicated Storage files remove hote hain. Small hidden ID/relationship/grading metadata remains so payments/access/attempt links do not cascade-delete. Test series catalog clears only if its reviewed version is unchanged; concurrent/new catalog edits are preserved and reported. Review again only if you also intend to delete that changed catalog.
- **Students/accounts, payments, purchased access, attempts, answers aur saved results untouched.** Paid grants remain recorded, but removed library items cannot be newly opened/purchased as available content. Own saved results/reviews and existing ongoing attempts use protected paper snapshots; account ownership and paid access checks remain enforced. New saved attempts also receive immutable snapshots. Temporary mode stays RAM-only.
- New saved attempt racing cleanup is either safely snapshotted or blocks deletion until retry; SQL checks snapshot verification while locking attempt inserts for the deletion transaction.

## Sample notes aur future content
- Cleanup complete hone ke baad **Save sample notes to Supabase Storage**.
- Supplied sample note text upload + read-back verification ke baad restore hota hai. Main DB description blank; ID/title/access/batch/reference remain. Live admin-edited sample notes overwrite nahi hote. No demo tests are created, and the code template Question Bank is not uploaded.
- New own notes → `kkcc-note-bodies`; saved/published test question text/options/explanations → `kkcc-test-bodies`. All are **Supabase Storage**, no alternate provider. Private is the access setting within Supabase, not a different storage service.
- Existing note visuals/diagrams/PDF links and thumbnail controls remain. Typed notes: existing 200,000-character / 1 MiB safeguards; test/result paper objects: 16 MiB safeguard. No 1 GB typed-content promise.

## What this does NOT erase
- Shared body files still referenced elsewhere, shared PDFs/images/other buckets, external Drive files, provider backups/exports.
- Result-paper snapshots needed for preserved attempts/reviews. They deliberately retain historical questions privately, outside the public library. They contain the paper, not the student's answers/scores/profile.
- Code template Question Bank files stay outside Supabase DB/Storage.
- Separate **Delete old test history** is NOT part of this workflow; do not use it if keeping student results. Its row cleanup cascades snapshot-reference metadata; orphan paper-only Storage objects may require separate reviewed maintenance. Never empty the result-paper bucket while retaining results.
- PostgreSQL allocated disk may not immediately shrink after clearing text (MVCC/free-page reuse). No VACUUM FULL or destructive student-table cleanup is performed.

## Optional read-only SQL sanity check
```sql
select id, public from storage.buckets
where id in ('kkcc-note-bodies','kkcc-test-bodies','kkcc-result-papers');

select count(*) as attempts_without_verified_paper
from public.learning_attempts a
left join public.kkcc_attempt_papers p on p.attempt_id = a.id
where p.attempt_id is null;
```
Run as project owner. All three buckets should be `public = false`. Missing legacy snapshots before running Admin preparation are normal. The app, not this read-only query, verifies actual Storage bytes before removal. Do not call the deletion RPC manually: Admin workflow performs file verification and cleanup safely.
