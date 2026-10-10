# Note text ab private Supabase Storage mein

## Existing website par setup
1. Supabase Database ka backup/export lein. Storage ka alag backup bhi rakhein: DB backup se actual Storage objects automatically restore nahi hote.
2. Supabase SQL Editor mein `KKCC-Excellence-Hub-NOTE-BODIES.sql` run karein. Ye additive/idempotent installer hai: existing notes, PDFs, payments, students, results ya questions delete/migrate nahi karta. Fresh installation ke full Production SQL mein bhi ye included hai; existing site par incremental file hi use karein.
3. Updated app deploy karein. Server-only `SUPABASE_SERVICE_ROLE_KEY` configured hona chahiye. Browser/VITE variables mein service-role key kabhi na dein.
4. Admin → Materials (ya Storage) → **Check note body storage**. New notes/edits ka main text ab `kkcc-note-bodies` PRIVATE bucket mein UTF-8 `.txt` objects hai. Title, subject, chapter, access, price, thumbnail/PDF reference, SHA-256, file size/path Database mein hain; stored body ka `description` empty hai.
5. Pehle ek free aur ek paid note save/read/edit test karein. Unpaid student ko paid body nahi milni chahiye. Authorised/offline-granted/purchased student aur admin ko milni chahiye. Math, diagrams, handwriting image references and PDF links preserve hote hain.
6. Purane Database text ko move karna optional/separately confirmed hai: `MOVE NOTES TO STORAGE` type karein → **Move next 5 note bodies** → browser confirmation. Har batch ke baad counts/error report review karke repeat karein. Old inline notes bina migration bhi readable hain.

## Data-loss protection
- Unique immutable object names; current object ko overwrite nahi kiya jata.
- Upload ke baad actual bytes download karke SHA-256 + byte length verify hoti hai. Tabhi DB reference save hota hai.
- Migration compare-and-swap source text hash + updated timestamp check karta hai: simultaneous edit hua ho to old DB text clear nahi hota; item skipped report hota hai.
- Upload/read/verification/DB failure par existing DB note unchanged rehta hai. Migration resumable hai; moved notes next batch mein nahi aate. Failed candidates ko repair karein, phir retry; repeated failed first batch ko blindly repeat na karein.
- Missing/corrupt object par explicit error aayega, silent empty-body fallback nahi. Backup se referenced object restore karein; sha/size mismatch ko ignore karke save na karein.
- Editing, deleting notes, failed writes aur races ke old/orphan objects automatically delete nahi hote. Isse Storage usage badh sakti hai. Cleanup se pehle DB ki **sab current references**, any backups and in-flight writes reconcile karke separate manual review karein; live-used objects delete na karein. Normal SQL Cleaner Storage bodies ko delete nahi karta.
- Admin body lists fail closed if a referenced file is missing/corrupt: restore that object first. Body helper RAM cache max 16 MiB / 128 immutable versions / 2 minutes hai; har protected request mein authorization cache se pehle hoti hai.

## Privacy and limits
- Bucket PRIVATE hi rakhein; installer ki restrictive `kkcc_note_bodies_server_only` policy anon/authenticated browser roles ko is bucket se block karti hai, even if older permissive policies broad hain. Is protection ko remove na karein; custom policies/RLS settings audit karein. App private bucket status check karta hai aur direct public/signed body URLs nahi deta.
- Paid/course body sirf authorized server route se milti hai. Public catalog paid body aur private file references expose nahi karta. Legitimate readers ke screenshots/copying ko 100% prevent nahi kiya ja sakta.
- Typed-note limit ab **200,000 characters** (UTF-16 units), verified object cap **1 MiB**. Text exact UTF-8 mein hai; automatic destructive conversion/compression nahi. Ye 1 GB Samsung Notes/PDF uploader nahi hai. Existing PDF upload limits unchanged; large exports compress/split karein.
- New bundled sample notes app code mein hi rehte hain. **Make sample notes editable** unki bodies Storage aur metadata Database mein adopt karta hai; existing edited IDs ko overwrite nahi karta.
- Storage capacity aur egress Supabase plan ke hisaab se charge/limit honge. DB metadata ab bhi space lega. Database se text clear hone par MVCC/autovacuum ke karan dashboard disk size turant kam hona guaranteed nahi; free pages reuse ho sakti hain. VACUUM FULL automatically run nahi hota.
- Migration preview counts/bytes PostgreSQL mein calculate hote hain; browser/server ko saare legacy bodies download nahi karne padte. Har production migration batch at most 5 full bodies leta hai.

## Verification scope
Local PostgreSQL/RLS, verified-write failure tests and local app/browser fixture use kiye gaye. Real Supabase cloud bucket, production payments ya real user data is workspace se migrate nahi kiye gaye. Deployment ke baad above cloud smoke test zaroor karein.
