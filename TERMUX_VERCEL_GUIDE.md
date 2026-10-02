# KKCC Excellence Hub — Termux & Vercel Run Guide

This ZIP is a complete source export of the **KKCC-excellence-hub** website. It is ready for local testing on Termux and for an independent Vercel deployment.

## 1) Supabase project already targeted

The app is configured for this Supabase project:

```txt
https://crrtkacxakinzpxcxbzf.supabase.co
project ref: crrtkacxakinzpxcxbzf
first admin email: kkcc23102003@gmail.com
```

The REST URL you shared was `https://crrtkacxakinzpxcxbzf.supabase.co/rest/v1/`; the app correctly uses the base URL `https://crrtkacxakinzpxcxbzf.supabase.co` and Supabase JS adds `/auth`, `/rest/v1`, and `/storage` automatically.

## 2) Required environment variables

Create `.env.local` from `.env.example`. The Supabase URL and publishable key are already filled for your project.

```env
SUPABASE_PROJECT_ID="crrtkacxakinzpxcxbzf"
SUPABASE_URL="https://crrtkacxakinzpxcxbzf.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_7vdkIisIptgwy-7FkrTTLA_ZBAiewMK"

VITE_SUPABASE_PROJECT_ID="crrtkacxakinzpxcxbzf"
VITE_SUPABASE_URL="https://crrtkacxakinzpxcxbzf.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_7vdkIisIptgwy-7FkrTTLA_ZBAiewMK"

# NEXT_PUBLIC_* aliases are also supported for Vercel/Next-style env naming.
NEXT_PUBLIC_SUPABASE_PROJECT_ID="crrtkacxakinzpxcxbzf"
NEXT_PUBLIC_SUPABASE_URL="https://crrtkacxakinzpxcxbzf.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_7vdkIisIptgwy-7FkrTTLA_ZBAiewMK"

# Optional only if you later add server jobs that need service-role access.
# Do not expose publicly.
SUPABASE_SERVICE_ROLE_KEY=""
```

Never share `SUPABASE_SERVICE_ROLE_KEY`, Razorpay secrets, or storage secrets in chat or commit them to GitHub.

## 3) Run on Termux

```bash
pkg update -y
pkg install -y nodejs-lts git unzip
mkdir -p ~/kkcc-excellence-hub
unzip kkcc-excellence-hub-termux-vercel.zip -d ~/kkcc-excellence-hub
cd ~/kkcc-excellence-hub
cp .env.example .env.local
npm install --no-package-lock
npm run dev:termux
```

Then open the URL shown by Vite, usually:

```txt
http://127.0.0.1:5173
```

If you want to test from another device on the same Wi-Fi, use the phone IP shown by Vite with port `5173`.

## 4) Run full local checks

```bash
npm run check
```

This runs:

- ESLint
- TypeScript check
- Production build

Note: ESLint may print existing React Fast Refresh warnings in shared UI component files; warnings are not fatal.

## 5) Apply Supabase migrations

The website expects the included schema/RLS/storage migrations. Apply everything inside `supabase/migrations/` to the same Supabase project `crrtkacxakinzpxcxbzf`.

If you use Supabase CLI on a computer:

```bash
supabase login
supabase link --project-ref crrtkacxakinzpxcxbzf
supabase db push
```

If you do not use CLI, open Supabase Dashboard → SQL Editor and run migration SQL files in timestamp order.

Important latest migrations:

```txt
supabase/migrations/20260917000000_platform_admin_enrollments_and_settings.sql
supabase/migrations/20260918000000_branding_theme_settings.sql
supabase/migrations/20260919000000_website_content_and_offline_access.sql
supabase/migrations/20260920000000_movable_blocks_and_dynamic_social_links.sql
supabase/migrations/20260921000000_app_builder_and_coupons.sql
supabase/migrations/20260922000000_notifications_and_mcq_tests.sql
supabase/migrations/20260923000000_doubts_personal_notifications_and_auto_updates.sql
supabase/migrations/20260924000000_admission_enquiry_crm.sql
supabase/migrations/20260925000000_public_platform_stats.sql
supabase/migrations/20260926000000_uv_logo_branding_refresh.sql
supabase/migrations/20260926001000_logo_uv_palette_correction.sql
supabase/migrations/20260926002000_student_comeback_copy_refresh.sql
supabase/migrations/20260926003000_kaat_philosophy_hero_highlight.sql
supabase/migrations/20260926004000_23kaat_hero_highlight.sql
supabase/migrations/20260926005000_23kaat_rule_of_success_hero_highlight.sql
supabase/migrations/20260926006000_confidence_hero_highlight.sql
supabase/migrations/20260926007000_hybrid_ui_text_manager.sql
supabase/migrations/20260929090000_lecture_linked_materials_and_tests.sql
supabase/migrations/20260929100000_student_blocks_and_secure_video.sql
supabase/migrations/20260929110000_23kaat_coin_wallet.sql
supabase/migrations/20260929120000_coin_price_and_standalone_coin_buy.sql
supabase/migrations/20260929140000_test_question_timer_and_ai_drafts.sql
supabase/migrations/20260929150000_security_app_controls_and_health.sql
supabase/migrations/20260930103000_secure_course_media_and_upload_limit.sql
supabase/migrations/20260930110000_mask_private_material_urls.sql
```

The migration history is the only supported database setup path. Do not run legacy combined-schema downloads or destructive reset scripts. For a linked production project, first review `supabase migration list --linked`, then apply only the pending timestamped migrations with `supabase db push`; verify the applied migration list afterward. The two storage/privacy hardening migrations are `20260930103000_secure_course_media_and_upload_limit.sql` followed by `20260930110000_mask_private_material_urls.sql`. They make the course-content bucket private, restrict direct reads, enforce the upload limit, and mask private paid-material URLs for unauthorized callers. A local migration file is not proof it was applied in production.

The migration set provides admin role management, student/course enrolments, payment settings, storage settings, file metadata, branding/theme settings, editable website content, movable page blocks, dynamic social/app links, App Builder snippets, coupon codes, notifications, update alerts, student profiles, doubts, admission/enquiry CRM, MCQ tests, offline-payment grants, and the existing auto-admin email behavior.

## 6) Make yourself admin

The existing migration grants admin access to `kkcc23102003@gmail.com` when that account exists or signs up. If the account already exists, verify its role in **Admin → Admin users** after the pending migrations are applied; do not use a separate manual schema/reset script. The owner admin can grant or remove additional admins from the same page.

Only users with this role can control `/admin`, `/admin/branding`, `/admin/content`, `/admin/app-builder`, `/admin/coupons`, `/admin/notifications`, `/admin/doubts`, `/admin/enquiries`, `/admin/offline-access`, `/admin/materials`, `/admin/users`, `/admin/students`, `/admin/payments`, `/admin/storage`, and `/admin/settings`.

## 7) Supabase Auth redirect URLs

In Supabase Dashboard → Authentication → URL Configuration, add these redirect URLs:

Local Termux/dev:

```txt
http://localhost:5173/auth/callback
http://127.0.0.1:5173/auth/callback
```

Vercel production:

```txt
https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback
```

If you add a custom domain, also add:

```txt
https://YOUR-CUSTOM-DOMAIN/auth/callback
```

## 8) Deploy independently to Vercel

1. Upload this ZIP to a new GitHub repo, or import the extracted folder in Vercel.
2. In Vercel project settings, add all required environment variables from section 2.
3. Use Node.js 20+ / 22.
4. Build command: `npm run build`.
5. Do not force the output directory to `dist` for this TanStack Start SSR app; let Vercel detect it.
6. Deploy.

`vite.config.ts` includes a Vercel-only Nitro adapter so Vercel can run SSR/server functions. A local verification build with `VERCEL=1 npm run build` generated the expected `.vercel/output/nitro.json` adapter metadata using the Vercel preset and Node runtime configuration.

## 9) Important feature notes

- Login/signup/reset password are connected to Supabase Auth.
- Public courses, tests, study material, and social/payment/storage settings read from Supabase.
- Free courses do not use Razorpay; students can start them directly.
- Paid courses are ready for manual/offline enrolment now: Admin → Offline access can grant by Gmail/name before or after signup, and Admin → Student access can unlock existing student profiles.
- Razorpay is future-ready from Admin → Payments. Keep it disabled until keys and webhook secrets are ready.
- Lecture videos are YouTube links only. Do not upload videos to Supabase. Public users now receive only free-course videos or admin-marked free preview lectures; paid lecture video access is checked against active, unexpired enrolment and protected with the `/secure-video.html` wrapper/token layer.
- Paid/course-included notes metadata stays publicly discoverable, but ordinary public database reads no longer expose their `file_url` values. After the latest migration, free/open notes use their normal URL, while course-included and standalone paid notes unlock through the authenticated material-access RPC only.
- PDF/notes/material/thumbnail uploads use the browser file picker, so Android can pick from Files, Downloads, Gallery, Drive, etc. where available.
- PDF upload guidance for scanned notes: keep each file under 45 MB; prefer 300–450 DPI, or split heavy 600-DPI scans into chapter files. Supabase Free projects can reject very large single-file uploads even when the private bucket itself is ready.
- Admin → Security & Controls manages Kit 2 Coins availability, daily reward pacing, and custom named practice batches. Students can use enabled custom batches in the colourful Quiz Zone; question sets are generated locally in the browser rather than stored as duplicate question rows in Supabase. The header, mobile bottom nav, home page, dashboard, global search and `/quiz` shortcut all lead directly to the same quiz route.
- Admin → Website content edits navigation labels, public page headings/copy, home sections, support details/FAQ text, footer columns/links, test-series copy, result text, and movable custom blocks. A block can be shifted from one public page to another from the admin panel.
- Admin → Social/app links lets you add, rename, reorder, hide/show, or delete any current/future app/community/social link without coding.
- Admin → App Builder lets you save live custom HTML/CSS/JS snippets and a feature prompt/note from the admin panel. These live snippets can add banners, embeds, widgets, notices and styling without downloading a fresh ZIP or redeploying. Full backend/React source changes may still require a normal deploy.
- Admin → Coupons lets you create coupon codes up to 100% discount, set expiry/start date, set max uses such as 200 people, and extend/reactivate by editing the coupon limit/status.
- Admin → Notifications lets you send in-app notices to all users, students, admins, one selected course, or one personal user ID. Students see them at `/dashboard/notifications` and can mark them read.
- When an admin changes a course/batch from draft to published, the app automatically sends a “New batch added” notification to students with a link to that batch.
- When admin adds a new lecture, publishes study material, or publishes a test/MCQ test for a published course, enrolled students automatically receive course-targeted notifications.
- Student → Ask Doubt (`/dashboard/doubts`) lets students submit subject/course-wise doubts with optional attachment links. Admin → Doubts (`/admin/doubts`) lets faculty reply; replies create personal notifications for the student.
- Student → Student Section (`/dashboard/student`) shows profile details, active enrolled batches, access/payment source, validity end date, days left, lifetime/expired/revoked status, and access history.
- Mobile bottom navigation includes a separate Notes shortcut to `/dashboard/materials` for direct student material access.
- Public Support/Contact form now saves admission/batch enquiries into Admin → Enquiries (`/admin/enquiries`) with status, priority, admin notes, contact tracking, and automatic admin notification.
- In Admin → Course Manager → Edit course → Tests, paste MCQs in text format to auto-create a test. Supported format: `Q1. question`, `A) option`, `B) option`, `C) option`, `D) option`, `Answer: B`, with optional `Explanation:`.
- Admin → Branding edits logo/app name/hero text/colours.
- Storage is Supabase-first now, with future provider settings for Cloudflare R2, AWS S3, Backblaze B2, Wasabi/S3-compatible, and external URLs in Admin → Storage.
- The app is Chrome-installable as a PWA using `manifest.webmanifest` and `sw.js`.
- For a quick installability check after extracting the ZIP, run `npm run check:pwa`.
- The app includes low-power/save-data CSS, cache-size limits, and deferred helpers so it stays smooth on phones, tablets, PCs, Macs and Termux-hosted previews.
- Without env keys/migrations, the app can still render fallback public pages, but live auth/admin/storage operations require Supabase configuration.
