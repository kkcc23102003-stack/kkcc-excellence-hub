# Notes + Test thumbnails — free aur paid dono

## Setup (existing latest KKCC app)
1. Supabase SQL Editor mein `KKCC-Excellence-Hub-THUMBNAILS.sql` run karein. Backup/check recommended. Ye additive SQL hai: notes/tests/questions/prices/accounts/results delete nahi karta; privacy ON/OFF setting unchanged.
2. Updated app deploy karein. Existing server-only `SUPABASE_SERVICE_ROLE_KEY` configured rehni chahiye. Naya service/key nahi chahiye; key browser mein kabhi expose na karein.
3. Fresh installation: latest combined Production SQL already includes this migration. Existing installation par sirf incremental Thumbnail SQL enough, provided earlier Notes + Publish Fix installed.

## Notes
Admin → Study material & notes (`/admin/materials`) → Edit note → **Thumbnail — image or text**:
- Image thumbnail → image URL paste karein ya Upload / replace thumbnail se JPG/PNG/WebP choose karein.
- Text thumbnail → apna text likhein; Hindi/Punjabi/English aur line breaks supported (200 characters).
- Remove thumbnail → cover hat jayega; note/body/PDF unchanged.
- Preview check karke **Save changes** zaroor karein.

## Tests
Admin → Tests (`/admin/tests`) → **Test thumbnails — image / text / remove**:
- Saved test select karein. Easy, Advanced aur Subjects & Chapters tests, free aur paid sab supported.
- Image / Text / Remove choose karke preview check karein → **Save test thumbnail**.
- Naya test ho to pehle test save karein. Cover-only edit se questions, payment price, free/paid/access settings change nahi hote.

## Storage + privacy
- New uploaded covers Supabase ke dedicated **public** `kkcc-thumbnails` bucket mein jayenge, legacy S3 setting se independent. Text covers plain text metadata hain: koi image-generation/API/storage upload nahi.
- Covers intentionally public hain (paid content ki cover image bhi). Confidential note pages/answers cover upload mein na dein. Actual paid note body/test access controls unchanged.
- Input image limit 10 MB; browser tries to reduce longest side to 1280px; server limit 4 MB after compression. Server checks raster signature/MIME; SVG/HTML uploads rejected.
- Replacements use new file names, preventing stale image-cache issues. Remove clears only the item reference after Save; old uploaded files are not automatically deleted because another item may share them. Storage dashboard se usage dekhein; physical file deletion needs a separate verified reference review.
- If a bucket named `kkcc-thumbnails` already existed, installer preserves its configuration rather than silently making private files public. Check that this dedicated cover bucket is public and contains only covers.
- Unsaved text/URL edits are not published. Upload itself stores the image before Save; abandoning the editor may leave an unused object.

## Verification boundaries
114 unit/database tests and 91 browser tests passed in an isolated local fixture. Image upload browser test uses authenticated production app handler + fixture filesystem, not a live Supabase Storage call. After deployment, upload one small cover in your actual Supabase project and check its public image URL and dashboard/storage permissions. No production payment, deployment or data deletion was done by the agent.
