# Notes / Study Material — final setup

## Screenshot wala “Project content is read only” error
File upload provider aur notes metadata backend alag the. Updated app managed
notes/settings ko Supabase tables mein save karti hai, S3 mein nahi.

## Existing live app par yeh karo
1. Existing database/content ka backup lo.
2. `KKCC-Excellence-Hub-NOTES-SUPABASE.sql` Supabase → SQL Editor mein **ek baar** run karo.
   Yeh data delete nahi karti; supported legacy material/settings rows copy karti hai.
3. Hosting Environment Variables mein existing Supabase URL/public key ke saath
   **SUPABASE_SERVICE_ROLE_KEY** server-only set/check karo. Is key ko chat mein
   mat bhejna; `VITE_` prefix mat lagana.
4. Updated branch/ZIP deploy karke redeploy karo. Managed notes/tests legacy `KKCC_CONTENT_BACKEND=file/s3` override ko ignore karte hain; baaki modules ki settings bina data migration change na karein.
5. Admin → Storage mein Supabase / `course-content` choose karo. Provider change
   existing S3 files ko move nahi karta; aisi files pehle re-upload/migrate karo.
6. Admin → Materials → **Make sample notes editable** ek baar click karo.
   Ab samples ko bhi Edit, Free/Paid, Publish/Unpublish, Duplicate aur Delete kar sakte ho.
7. Ek draft banao, Save karo, page reload karke verify karo; phir publish karo.

## Controls ready
- Typed notes + Write/Text modes, handwriting/photos, formula rendering.
- Diagram library: search, preview, insert, then edit inserted text/labels.
- No-diagram switch, hide/delete diagrams, replace with photo.
- Photo caption edit, move-up ordering, duplicate-as-draft.
- Title, body, subject, chapter, class, course/batch, price/coins, file/Drive link,
  cover, display order, publish/unpublish/delete.
- New notes draft hain; file upload ke baad editor mein Save dabana hai.
- Deleted adopted samples automatically dobara append nahi honge.

## Important limits
Supabase private bucket **Supabase hi hai**, S3 nahi. Paid attachments ko public
karna safe nahi. Existing attachments duplicate notes mein shared rehte hain;
note delete karne se storage object automatically delete nahi hota.
Static template source code admin edits se rewrite nahi hota; inserted notes editable hain.
Notes text/settings ab Supabase DB space lenge; PDFs/photos Storage space lenge.
Question/diagram template banks Supabase mein bulk upload nahi hote.
Old local/S3 JSON content SQL se import nahi hota: agar use kiya hai toh alag
export/import zaroori hai. Kisi existing saved content ko assume karke discard mat karo.

## Testing/deployment distinction
Local automated tests and build verify kiye gaye hain. Live Supabase SQL apply aur
hosting redeploy is workspace se execute nahi kiye gaye. In steps ke bina live
screenshot wala deployment updated nahi maana ja sakta.

Notes + test publish dono issue hon toh latest `KKCC-Excellence-Hub-PUBLISH-FIX.sql` combined repair run karo. Ismein notes tables, saved tests/questions aur paid Easy publish RPC included hain.
