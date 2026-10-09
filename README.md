> **9 October — tests too:** Saved question text, options and explanations now live in **Supabase Storage** (`kkcc-test-bodies`, PRIVATE access setting), alongside Storage-backed notes. Small IDs/grading/access metadata stay in Database. Student profiles, payments, attempts and results are unchanged. Install `KKCC-Excellence-Hub-TEST-BODIES.sql` after the previous Note Bodies setup, deploy, then use Admin → Storage for verified current/historical content migration. [Hindi setup and safety guide](docs/TEST-BODIES-HINDI.md). No production deletion was performed by developing this release.

> **9 October update — private Storage note bodies:** New/admin-edited main note text now lives in the private `kkcc-note-bodies` Supabase Storage bucket; small metadata/access/reference records remain in Database. Existing inline notes remain readable. Run `KKCC-Excellence-Hub-NOTE-BODIES.sql`, redeploy, then use Admin → Materials / Storage for separately confirmed verified migration (5 notes per batch). See [Hindi setup, safety and backup guide](docs/NOTE-BODIES-HINDI.md). No other database provider is added; PDFs and template banks are unchanged. Storage quota/egress still applies. Typed notes: up to 200,000 characters, not a 1 GB export uploader.

> **4 October update — notes read-only fix:** Managed notes/materials, settings and file metadata now default to dedicated **Supabase tables**. Uploads default to **Supabase Storage**. Run `KKCC-Excellence-Hub-NOTES-SUPABASE.sql` and configure the server-only `SUPABASE_SERVICE_ROLE_KEY`, then redeploy. No private S3 bucket or persistent volume is required for these features. This supersedes older statements below that all notes text lives outside Supabase. Static question/diagram template banks remain project files.

> **Implemented source / local-tested release candidate — 1 October 2026.** This is not an assertion of a production deployment or complete academic sign-off. Start with [student-only deployment instructions](docs/DEPLOYMENT_STUDENT_ONLY.md) and [the exhaustive bank audit](docs/audit/QUESTION_BANK_COVERAGE.md). Supabase is for student/auth/access-related data only; educational content stays in the existing project bank and private project/external storage. Do not run the historical combined CMS SQL for a fresh install.

## Reproduce the implemented application

Use Node 22.12+ and `npm ci`. Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run check:pwa`, `npm run check:repo`, `npm run build`. For the local production-build browser fixture: `npx playwright install --with-deps chromium` then `npm run test:e2e`.

Original project/branding requirements are retained below. Current architecture/deployment instructions above take precedence over historical Supabase-CMS setup notes.

---

# KKCC Excellence Hub

Create an ultra-premium, world-class EdTech platform for Kusum Kartik Coaching Centre (KKCC).

The final product must look and feel like a premium technology company + elite education platform, with a level of polish that feels more advanced, refined and professional than typical Indian EdTech websites.

IMPORTANT:

I have uploaded the official KKCC logo.

Use the exact uploaded KKCC logo as the official brand logo.

Do NOT redesign it.

Do NOT generate another logo.

Do NOT change its shape.

Do NOT distort it.

Maintain its original aspect ratio.

Do not copy Physics Wallah, Unacademy, Allen, Vedantu, Coursera or any other company's exact design, branding, layout, graphics or text. Build a completely ORIGINAL KKCC visual identity.

---

1. DESIGN PHILOSOPHY

Design KKCC as a premium combination of:

- Apple-level visual cleanliness

- Modern SaaS dashboard quality

- Premium EdTech usability

- High-end Indian education branding

- Excellent mobile UX

- Smooth micro-interactions

- Strong typography

- Intelligent spacing

- Professional information hierarchy

The website must NOT look like a basic template.

Avoid:

- Generic Bootstrap-looking layouts

- Excessive gradients

- Cheap-looking cards

- Excessive shadows

- Clutter

- Too many colors

- Unnecessary animations

- Oversized text everywhere

Every section should have a clear purpose.

---

2. BRAND SYSTEM

Brand:

Kusum Kartik Coaching Centre

Short name:

KKCC

Primary tagline:

Learn Better. Understand Deeper. Achieve More.

Create a sophisticated design system based on the colors present in the uploaded KKCC logo.

Create:

- Primary color

- Secondary color

- Accent color

- Background colors

- Text colors

- Border colors

- Success/warning/error states

Maintain excellent contrast and accessibility.

Use the KKCC logo as the primary visual identity.

---

3. PREMIUM NAVIGATION

Create a highly polished sticky navigation bar.

Desktop:

LEFT:

KKCC logo

Kusum Kartik Coaching Centre

CENTER:

Home

Courses

Classes

Test Series

Study Material

Faculty

Results

RIGHT:

Search

Login

Get Started

Make the navbar slightly transparent/glass-like when appropriate, with subtle blur and border.

When scrolling:

- Reduce navbar height slightly

- Add subtle background blur

- Maintain excellent readability

Mobile:

- KKCC logo

- Search icon

- Menu icon

Create an elegant mobile navigation drawer.

---

4. HERO SECTION

Create a visually stunning hero section.

Main headline:

Education That Builds Understanding.

Learning That Builds Futures.

Supporting text:

Learn from structured courses, expert guidance, smart practice and powerful study tools — all in one place.

Primary CTA:

Explore Courses

Secondary CTA:

Start Learning

Create a premium educational visual on the right side.

Use subtle animated educational elements such as:

- books

- formulas

- learning cards

- graphs

- scientific symbols

- academic icons

Animations must be subtle and professional.

Do NOT create a distracting animation-heavy homepage.

---

5. TRUSTED LEARNING EXPERIENCE

Immediately below hero, create a premium feature strip:

Learn

Video lectures

Practice

Tests & MCQs

Revise

Notes & PDFs

Track

Progress & Results

Use elegant icons and micro-interactions.

---

6. COURSE DISCOVERY SYSTEM

Create an advanced course discovery section.

Heading:

Find the Right Learning Path

Add tabs:

School

Board Exams

Medical

Non-Medical

Commerce

Competitive Exams

Add search:

What do you want to learn?

Filters:

- Class

- Subject

- Exam

- Faculty

- Course type

- Price

Course cards must look premium.

Each card should contain:

- Course thumbnail

- Course title

- Faculty

- Course type

- Number of lectures

- Tests

- Study material

- Rating placeholder

- Price

- Original price

- Enroll button

Use clean typography and excellent spacing.

---

7. COURSE PAGE

Create a world-class course detail page.

Top section:

Course thumbnail

Course title

Short description

Faculty

Course duration

Number of lectures

Number of tests

Study material

Primary CTA:

Enroll Now

Below:

What You'll Learn

Display learning outcomes.

Course Curriculum

Create expandable modules:

Module 01

Module 02

Module 03

Module 04

Each module contains lectures.

Students can expand/collapse modules.

Course Includes

- HD video lectures

- Notes

- PDFs

- Tests

- MCQs

- Progress tracking

- Revision material

Frequently Asked Questions

Use accordion UI.

---

8. PREMIUM STUDENT DASHBOARD

Create an exceptionally polished student dashboard.

This should be one of the best-designed parts of the website.

Sidebar:

Dashboard

My Learning

Courses

Test Series

Study Material

Bookmarks

Results

Notifications

Profile

Settings

Main dashboard:

Good Morning, Student 👋

Then show:

Continue Learning

Large course card with:

- Course image

- Current lecture

- Progress

- Continue button

Your Progress

Display:

- Course completion

- Tests completed

- Questions solved

- Study time

Use clean charts and progress rings.

Upcoming

Show:

- Upcoming test

- Upcoming lecture

- Assignment

Recent Results

Display:

Test

Score

Accuracy

Date

Recommended For You

AI-style recommendation UI using demo logic.

---

9. SMART LEARNING PAGE

Create a "My Learning" experience.

Students can see:

Continue Learning

Recently Watched

Completed

Saved

Downloads

Allow sorting and filtering.

---

10. VIDEO LEARNING EXPERIENCE

Create a premium lecture interface.

Layout:

LEFT:

Large video player

RIGHT:

Course curriculum

Below video:

Lecture title

Faculty

Chapter

Lecture number

Actions:

- Mark Complete

- Download Notes

- Save

- Share

Navigation:

Previous Lecture

Next Lecture

Below:

Lecture Notes

Discussion

Related Lectures

The interface should feel like a premium streaming-learning platform.

---

11. ADVANCED TEST PLATFORM

Build a professional online examination interface.

Before test:

- Instructions

- Number of questions

- Duration

- Maximum marks

- Negative marking information

During test:

LEFT:

Question

RIGHT:

Question palette

Top:

Timer

Controls:

- Previous

- Next

- Mark for Review

- Clear Response

Question states:

- Answered

- Unanswered

- Marked

- Not Visited

After submission:

Create a detailed analytics page:

Score

Accuracy

Attempted

Correct

Incorrect

Unanswered

Time Taken

Charts:

- Accuracy

- Subject performance

- Time distribution

Use demo data initially.

---

12. STUDY MATERIAL LIBRARY

Create a professional digital library.

Categories:

Notes

PDFs

Formula Sheets

MCQs

Question Banks

Previous Year Papers

Revision Material

Create filters:

Class

Subject

Chapter

Type

Each resource:

Title

Subject

Chapter

Pages

Updated date

View

Download

---

13. FACULTY EXPERIENCE

Create premium faculty profiles.

Faculty card:

Photo

Name

Subject

Experience

Qualification

Profile page:

About

Subjects

Courses

Lectures

Student feedback placeholder

Do not invent real credentials.

Use demo placeholders.

---

14. RESULTS & ACHIEVEMENTS

Create a premium results page.

Heading:

Results That Reflect Consistent Learning

Use elegant result cards.

Include:

Student

Exam

Year

Score

Achievement

All initial information must be clearly labelled as demo/sample data until replaced with real information.

---

15. GAMIFIED PROGRESS

Create an optional student progress system.

Show:

Learning Streak

Tests Completed

Questions Solved

Courses Completed

Create achievement badges such as:

First Test

7 Day Streak

100 Questions

Course Completed

Keep gamification subtle and educational.

---

16. GLOBAL SEARCH

Create powerful global search.

Search:

- Courses

- Lectures

- Teachers

- Notes

- PDFs

- Tests

- Subjects

Use instant search suggestions and categories.

---

17. AUTHENTICATION

Create:

Login

Signup

Forgot Password

Reset Password

Fields:

Name

Email

Mobile

Password

Create authentication-ready architecture.

Do not expose passwords or secrets.

---

18. ADMIN DASHBOARD

Create a separate premium admin panel.

Admin sidebar:

Overview

Students

Courses

Faculty

Lectures

Study Material

Tests

Results

Orders

Notifications

Analytics

Settings

Dashboard analytics:

Total Students

Active Courses

Course Enrollments

Revenue placeholder

Tests Attempted

Average Score

Create graphs and tables using demo data.

---

19. COURSE MANAGEMENT

Admin should be able to:

Create course

Edit course

Delete course

Add modules

Add lectures

Upload resources

Manage pricing

Manage visibility

---

20. STUDENT MANAGEMENT

Admin can view:

Student name

Email

Phone

Enrolled courses

Progress

Test performance

Account status

---

21. PAYMENT-READY ARCHITECTURE

Create a professional purchase flow.

Course page:

Buy Now

Checkout:

Course summary

Price

Discount

Final amount

Create the architecture so a legitimate payment gateway such as Razorpay can be integrated later.

Do NOT implement fake payments.

Never expose secret API keys in frontend code.

---

22. NOTIFICATION SYSTEM

Create notification UI for:

New lecture

New test

Course update

Study material

Announcements

Show unread notification count.

---

23. MOBILE APP-LIKE EXPERIENCE

The mobile website must feel almost like a native app.

Bottom navigation:

Home

Courses

Learn

Tests

Profile

Use:

- Smooth transitions

- Touch-friendly buttons

- Swipe-friendly cards

- Sticky controls where useful

- Responsive video player

Optimize for Android phones first, then tablets and desktop.

---

24. MICRO-INTERACTIONS

Use subtle animations:

- Button hover

- Card hover

- Page transitions

- Scroll reveal

- Progress animations

- Dropdown transitions

- Modal transitions

- Loading skeletons

Do not over-animate.

The website must remain fast.

---

25. LOADING STATES

Create professional skeleton loaders for:

Courses

Dashboard

Lectures

Tests

Study material

Also create:

Empty states

Error states

Success states

Do not leave blank screens.

---

26. DARK MODE

Implement a premium dark mode.

Users can switch:

Light

Dark

Both modes must have proper contrast and polished visuals.

---

27. ACCESSIBILITY

Follow good accessibility practices:

- Keyboard navigation

- Proper labels

- Good color contrast

- Accessible buttons

- Responsive text

- Screen-reader-friendly structure

---

28. PERFORMANCE

Prioritize:

Fast loading

Lazy loading

Optimized images

Code splitting

Reusable components

Minimal unnecessary JavaScript

The website should feel fast even on mid-range Android phones.

---

29. SEO

Prepare the website for SEO.

Create:

- Proper page titles

- Meta descriptions

- Semantic HTML

- Clean URLs

- Open Graph metadata

- Sitemap-ready structure

---

30. TECH STACK

Use a modern scalable architecture.

Preferred:

React

TypeScript

Modern component system

Responsive CSS

Proper routing

Reusable components

Form validation

Keep the project structured cleanly for:

GitHub → VS Code → Production

I want to be able to continue development independently in VS Code.

---

31. BACKEND READY

Structure the application so it can later connect to:

Authentication

Database

Cloud storage

Video hosting

PDF storage

Payment gateway

Email notifications

Push notifications

Keep frontend and backend responsibilities clearly separated.

---

32. SECURITY

Follow secure development practices.

Never expose:

- API keys

- Secret keys

- Database credentials

- Payment secrets

Use environment variables for secrets.

Protect admin routes.

---

33. FOOTER

Create a premium multi-column footer.

KKCC logo

Kusum Kartik Coaching Centre

Links:

Home

Courses

Classes

Faculty

Results

About

Contact

Student:

Login

My Courses

Tests

Study Material

Support:

Help Center

FAQs

Contact

Social:

YouTube

Instagram

Facebook

Telegram

WhatsApp

Use placeholders until actual links are provided.

---

34. IMPORTANT BRAND RULE

The uploaded KKCC logo is the ONLY official logo.

Use the uploaded logo exactly.

Do not create a new logo.

Do not replace the logo with text.

Do not distort or stretch it.

---

35. CONTENT RULE

Do not invent:

- Student results

- Faculty qualifications

- Student counts

- Revenue

- Rankings

- Awards

- Success statistics

Where real information is not yet available, use professional empty states and verified KKCC-admin-managed content rather than demo, sample or made-up claims.

---

36. FINAL QUALITY REQUIREMENT

DO NOT build a simple template.

DO NOT build a basic landing page.

Build a complete premium EdTech ecosystem.

The final interface should feel:

Premium + Intelligent + Modern + Trustworthy + Fast + Educational

It should be visually impressive on first opening while remaining extremely easy for students to use.

Every page must share one consistent KKCC design system.

The final architecture should allow KKCC to grow into:

**KKCC Website

- Student Portal

- Online Courses

- Video Classes

- Digital Library

- Test Platform

- Payments

- Admin Dashboard

- Analytics

- Future Mobile App**

Start by building the complete design system and homepage first, then build all major pages using the same design system.

Make every major interaction functional rather than creating only visual placeholders.

## Online payments, coupons and payment recovery

Razorpay is wired once, from `/admin/payments`: paste the **Key ID** and Razorpay
connects automatically across paid Batches (`/courses/$slug` → `/checkout`), Test
Series (`/test-series` → `/checkout`), individual paid Tests and 23KAAT coin packs
(`/coins`). Until a key is saved, every one of those surfaces shows the English
**Paid (Offline) — Please Contact Admin** flow instead.

Saving the **Key Secret** as well upgrades checkout to fully server-side verified
payments:

1. the price (coupon included) is recomputed on the server and a Razorpay **order**
   is created with `kkcc_user`, `kkcc_kind`, `kkcc_item` and `kkcc_coupon` notes;
2. the completion call verifies the `order_id|payment_id` signature, asks Razorpay
   for the payment, and checks the captured amount before anything is unlocked;
3. a retried or duplicated callback is idempotent, so nobody is enrolled twice.

Because the student, item and amount live on the order, a payment whose browser
callback never arrived can still be recovered:

- students: **Payment Recovery** card on `/checkout`, `/coins` and `/support`
  ("Payment ho gaya lekin access nahi mila?") — paste the `pay_…` id, or tap the
  payment the app remembered in the browser, and access is granted immediately;
- admin: **Payment Recovery & Access Grant** tool at `/admin/payments` — look up a
  payment, then grant it to the student from the order notes or from an email.

Coupons (`/admin/coupons`) apply 1%–100% off to the rupee price and to the 23KAAT
coin price, across Batches, Test Series and Tests. A 100% coupon claims the item
with no payment at all. No schema change is needed for any of this: the tables
already exist in `KKCC-Excellence-Hub-PRODUCTION-SQL.sql`.

## SEO sitemap

The public pages can be published as a sitemap for Google in one command. The
generator refuses to run without a real domain on purpose, because a sitemap
that points at a guessed address hurts rankings instead of helping them:

```bash
SITE_URL="https://your-domain.com" npm run sitemap   # writes public/sitemap.xml
```

Re-run it whenever you add a batch, and point Google Search Console at
`https://your-domain.com/sitemap.xml`.

## Business dashboard, payment ledger and student reports

- `/admin/analytics` (Admin Command Bar → **Business Dashboard**) shows revenue,
  sales by item, coupon performance and a "waiting for you" queue. It only counts
  `paid` rows as money; abandoned checkouts are reported separately, never hidden.
- **Download payment ledger (CSV)** exports every payment row (date, status,
  provider, item, amount, student, order id, payment id) ready for Excel or Tally.
- `/dashboard/progress` (student sidebar → **My Progress**) shows subject strength,
  weak chapters and the score trend of the last 10 papers.

## Notes: Free / Paid control and auto-generated diagrams

**Admin panel → Study material** controls every note:

| Setting      | Student sees                                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Free`       | "Read Notes" opens immediately for everyone                                                                                                                                                    |
| `Paid`       | `₹ price` + `23KAAT coin price`; students buy it from `/checkout?note=<id>` exactly like a Batch or Test Series (Razorpay online, 23KAAT coins, or "Contact Admin" when online payment is off) |
| `Batch only` | Unlocked with the Batch the note belongs to                                                                                                                                                    |

The list has one-tap **Free** / **Paid** buttons, and the editor previews the note
exactly as a student will read it.

### Diagrams and charts are generated from the text

Write plain text — no images needed. Under a heading, the analyser reads the
shape of the content and draws the right visual:

| What you type                                | What is generated                                |
| -------------------------------------------- | ------------------------------------------------ |
| `Types of X` + 3 or more points              | classification tree                              |
| `Process` / `Steps` + points                 | flow diagram with arrows                         |
| `Advantages` / `Disadvantages` points        | two-column comparison                            |
| Points that start with years (1946, 1950, …) | timeline in order                                |
| Points with numbers / percentages            | bar chart, or a donut when the values are shares |
| `:::cycle Name` → `A -> B -> C` → `:::`      | cycle diagram                                    |

Explicit fences: `:::flow`, `:::cycle`, `:::tree`, `:::compare`, `:::timeline`,
`:::chart`, `:::auto`. Write `[visuals:off]` anywhere in a note to keep it plain
text only. A note never gets more than six auto visuals, and every figure is a real
SVG, so it stays crisp on a phone screen and in a printed PDF.

### Printing carries the KKCC watermark

Every printed page (Print / Save as PDF, and the inline note that opens when a
material has no PDF attached) repeats **KKCC Excellence Hub** and **Kusum Kartik
Coaching Centre** as a rotated watermark layer, with the brand line in the page
header and footer. That layer is a fixed print layer, which is why it appears on
page 1, page 2, and every page after.

### Math formulas in notes are typeset, not printed as code

Plain text is enough — the reader, the admin preview and the printed PDF all
typeset it with a dependency-free renderer (`src/lib/notes-visuals/math.ts`), so
the print window still works with no internet:

| Admin writes                           | Student sees                             |
| -------------------------------------- | ---------------------------------------- |
| `x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}` | a stacked fraction with a real radical   |
| `\pi r^2`, `mc^2`, `sin^2 \theta`      | π r², mc², sin² θ                        |
| `2H_2 + O_2 -> 2H_2O`                  | chemical subscripts and a reaction arrow |
| `\alpha`, `\sum_{i=1}^{n}`, `\times`   | α, ∑ with limits, ×                      |

A line that is a formula becomes its own centred formula block; a sentence with a
formula inside it is typeset in place. Ordinary sentences (Punjabi, Hindi,
English, history) are never touched — a line only counts as math when it carries
LaTeX commands, math symbols, `^`/`_` groups, a chemical formula or a real
equation. Everything is HTML-escaped first, so an admin can never inject markup.

### Per-diagram control in the admin panel

The note editor shows a **Diagram control** box and a **Har diagram ka control**
list where each generated diagram can be:

- **previewed** live as the exact SVG the student will see,
- **edited** (rename the diagram title),
- **deleted** (one toggle, the text stays untouched),
- **replaced** with an uploaded photo — a printed diagram, a photo of the
  textbook page, or a screenshot,
- **switched off entirely** with the _No diagrams for this note_ checkbox, which
  is what Punjabi / Hindi / English notes want.

Settings are stored inside the note text as one `:::visuals {...}` line, so the
database schema is unchanged, a copied note carries its settings, and the
preview, the reader and the printed PDF all read the same source of truth. Only
`data:image/…`, `https://…` and `/…` image URLs are accepted.

### Handwriting and paste (notes app inside the admin panel)

_Handwrite / paste_ opens a full-screen canvas (`src/components/kkcc/notes-canvas-editor.tsx`)
with pen, highlighter, eraser, six colours, thickness, undo, clear and
_Add photo_. It works with finger, stylus and mouse, and **Ctrl/Cmd+V pastes an
image straight from any notes app** — the pasted page becomes the canvas
background, and the admin can write on top of it. The finished page is saved as
a JPEG, uploaded once, and inserted into the note as a figure (inline in the
note if storage is unreachable, so work is never lost).

### Bulk paste: preview first, publish on Next

Bulk paste is now two steps, and **nothing is written to the test before the
admin approves it**:

1. **Step 1 — paste** MCQs with their explanations and press _Preview questions_.
   Parsing is shared with the server (`src/lib/test-bulk-parse.ts`), so the
   preview is exactly what will be published.
2. **Step 2 — preview & publish**: every question is editable (question text,
   options, correct option, explanation), each one can be dropped, and the
   explanation the admin pasted is kept word for word. Only questions with no
   explanation get the generated one. Pressing **Next → Publish** inserts the
   reviewed rows verbatim and then updates the test statistics.

`Answer:` / `Ans:` / `Correct:` and `Explanation:` / `Solution:` are all
understood, options may be `A)` / `(A)` / `1)` style, and a numbered option line
is never mistaken for the next question.

## Performance notes

- The ~1.7 MB exam bank is code-split (`src/lib/exam-bank/lazy.ts`): the quiz page
  and `/admin/exam-bank` paint immediately and pull the bank in the background,
  with their own chapter-correct generators covering the gap. Nothing about the
  question quality depends on the download finishing first.
- React, the router, the query client and the Supabase client build into separate
  `vendor-*` chunks, so content updates do not invalidate ~550 kB of cached
  vendor code on a student's phone.
- React Query defaults (2 min stale time, no refetch on window focus, preload on
  intent) keep navigation instant and stop background request storms.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Operations

Before production use, run the latest additive Supabase migration and then validate the app:

```sh
npm run check:repo
npm run lint
npx tsc --noEmit
npm run build
npm run check:pwa
```

Do not run legacy SQL exports. Apply only the supported timestamped Supabase migrations for the student/auth/access schema. The resulting admin page is
`/admin/security`, with content-protection, maintenance, feature-switch, Kit 2 Coins reward pacing and compact
Supabase health controls.

Browser/PWA content protection is intentionally implemented as the strongest practical web-level deterrent:
copy/context/right-click/print/selection/drag guards, protected-key interception, screenshot shortcut blocking,
identity watermarks, screen focus/visibility isolation, and inspection-tool blocking. Normal web apps cannot
guarantee device-level DRM against external capture.

### Note workspace: text / write modes and storage

Admin → Materials now has separate **Text only** and **Write + Text** modes,
recorded inside the existing note directives (no new SQL). Switching mode does
not delete existing photos/pages. Diagram generation remains an independent toggle.
Write mode includes pen, marker, eraser, undo/redo, paste/photo insertion, typed
text placement, pen/mouse-only input, clear confirmation, and JPEG page backup.
Save each page into the note and reopen the canvas for another page. Pages are
flattened images, not editable vector ink. OCR, lasso selection, audio recording,
Samsung sync and full Samsung Notes parity are not implemented.

Ten editable teaching templates cover selected science, math, accounting, tax,
computing, polity, history, economics and teaching topics. They are bundled source
files, not a database template bank; they do not cover every syllabus topic.
Review simplified labels for the intended lesson before publishing.

Note image uploads are resized on-device (longest side 1600 px, JPEG quality 0.82)
when appropriate. Small files stay unchanged; unsupported image decoding falls
back to the original. PDFs are unchanged. Compression is NOT a storage quota
promise: original-format fallbacks, PDFs, student records and accumulating images
can still fill the configured provider. Check actual usage in the provider's
dashboard. Removing a note image reference does not automatically delete its
stored object (it may be shared). Use Admin Storage to review files before deleting.
The question-template bank remains in project files. Published test rows use the private project-content store too; student records
and attempt metadata still use Supabase.

Admin → Tests → select test → pencil edits generated as well as manual questions,
including options, correct answer and explanation. This update preserves the
question's existing sort order when correcting it. Editing a published question
is not a retroactive regrade of historical attempts or a patch to its source template.

### Full syllabus diagram library

Admin → Materials → edit/add a note → **Open full syllabus diagram library**.
The library has **1,002 entries**: **30 teaching diagrams** plus **972 revision maps**
(one for every unique subject/topic in the current active question bank), spanning
**78 subjects** and **66 exam tracks**. Filter maps by exam/board and subject,
search by topic, preview the actual note output, then insert into the unsaved
note draft. Existing text, write/text mode and the no-diagram switch are preserved.
Repeated clicks on the same preview do not duplicate an insertion. Edit the
inserted text and save through the existing material form to publish.

Revision maps group selected worked examples. They are not a claim that every
syllabus diagram is now an anatomical drawing, circuit schematic or map, nor that
every fact has been independently verified. Full questions/answers/explanations
appear below the compact map so short/truncated labels retain context. Teacher
review is required. The separately curated diagrams include digestion, reflex arc,
cell cycle, chemical reactions, series/parallel comparisons, electromagnetic
spectrum, energy conversion, management, grammar and other teaching structures.

The generated data is dynamically imported only when the admin opens the library;
no question bank or diagram templates are uploaded to Supabase. Only inserted
note content is saved through the existing note system. **No new SQL required.**
Live custom syllabus additions are not automatically reflected in this snapshot.
After changing source syllabus templates, regenerate with:

```sh
npx tsx scripts/build-diagram-library.ts
```

See `docs/diagram-library-coverage.md` for per-subject counts. The generator fails
if any active topic lacks a usable source; provenance IDs/indices are retained in
`src/lib/notes-visuals/syllabus-library.json`. Coverage tests compare every topic
with the active bank and render every map. The large bank itself is not imported
by the new admin component.


### Free-plan database space saver (4 October 2026)

**Architecture correction:** `projectContent.from("test_questions")` is a private
JSON/persistent-volume or external-object-store adapter, NOT Supabase PostgREST.
Publishing questions does not insert their full text into Supabase in this build.
Notes text and templates also stay outside Supabase. Student attempts store
answers/references and summary results; users, access and financial records still
consume database space. Uploaded files consume the selected provider's storage.
Always provision persistent project-content storage and back it up.

**One-time existing-project setup:** run `KKCC-Excellence-Hub-SPACE-SAVER.sql`
in Supabase SQL Editor (or migration `20261004130000_free_plan_space_saver.sql`).
Fresh installs include it in the Production SQL and student-only schema.
Installation is non-destructive; nothing has been executed against your live DB
by this code update. The SQL Cleaner filename now installs the same safe tools,
rather than running the previous broad destructive cleanup.

Admin → Storage → Free-plan space saver → Preview:
- Shows measured PostgreSQL size and largest public tables including indexes.
  It is NOT remaining Free-plan quota or file-storage usage.
- Reports at most 5,000 eligible drafts per batch, never-submitted AND expired
  at least 90 days ago. Long-running/recent attempts and submitted results stay.
- Back up first, then type `CLEAN OLD DRAFTS` to explicitly delete a batch.
  Deleted drafts cannot be resumed. Another batch requires a fresh preview.
- No schedules, user/result/payment/access-grant deletion, plan changes or
  automatic migration of uploaded files. Existing old cleaner callers now get
  an admin-only, non-destructive report. Students cannot call either function.
- Deletes allow PostgreSQL/autovacuum to reuse space, not necessarily shrink the
  displayed database size immediately. Avoid casually running `VACUUM FULL`.

For files, compressed note photos are already supported. Drive URLs avoid a
second PDF copy but retain Drive sharing/link-leak risks; changing storage
provider alone does not migrate existing objects. There is no zero-space or
unlimited-Free-plan guarantee. Actual production savings depend on eligible data.

### Supabase uploads and complete sample-note controls (4 October 2026)

Supabase remains the shipped upload default (`course-content`). Admin → Storage
now offers **Use Supabase Storage** with a warning: selecting it does NOT migrate
existing S3/R2/local objects. Re-upload old attachments before changing an already
used provider. No S3 account is required. A **private Supabase bucket** is still
Supabase, not S3; we do not make paid content public. With Supabase selected, a
missing bucket setting defaults to `course-content`, and upload errors are surfaced
instead of silently writing files into local public storage. Canvas failures keep
the editor open rather than saving a large inline fallback.

Admin → Materials shows the current upload provider. Click **Make sample notes
editable** once to adopt the built-in study library into managed materials. Stable
IDs and ignore-on-conflict imports preserve existing edits. After successful
adoption, the built-in list is no longer appended by the student page: deleting or
unpublishing a sample stays effective. Existing fixture samples are editable too;
the live preview now preserves material edits/deletions and the adoption flag
across fixture restarts. Automated fixtures still reset deterministically.

The material editor supports title/body, subject/chapter/class/batch/course,
Free/Paid prices, file/Drive URL, cover, order, note mode and visual controls.
Additional controls: Duplicate as draft, photo caption editing and move-up ordering.
New notes start as drafts; uploading a file/image stages it in the editor without
automatically saving/publishing the material. Press Save after checking it.
Deleting a note does not delete shared files from storage. Copies share existing
attachments until replaced. Built-in source code is not rewritten by admin edits.

Supabase image tokens now survive note editing. Fresh signed URLs are generated
for authorized display only; permanent tokens, not expiring URLs, remain saved.
Paid note bodies are omitted from public material responses and are returned only
after the student access check. Free notes remain publicly readable by design.

No new database schema is needed for this update if the existing material/settings
backend and Supabase storage policies are installed. This does not migrate existing
material metadata or project-content backend configuration; it controls uploaded
files and the existing admin-managed materials backend. Keep that backend persistent
and backed up. No live Supabase settings were modified from this sandbox.


### Fix for “Project content is read only” on notes (screenshot issue)

The upload provider and metadata backend are separate. Selecting Supabase Storage
alone could not fix the old fallback to read-only JSON on serverless hosting.
Managed tables now map to `kkcc_materials`, `kkcc_site_settings`,
`kkcc_private_settings` and `kkcc_content_files` using the server Supabase client.
Missing setup returns an actionable SQL/environment error, not a request for S3
and not a silent write to ephemeral disk. Explicit `KKCC_CONTENT_BACKEND=file`
continues to support local fixtures; **remove that override in production**.

Existing-project deployment:
1. Back up existing content. Run **KKCC-Excellence-Hub-NOTES-SUPABASE.sql** once
   in Supabase SQL Editor. It copies matching legacy materials/settings when
   present, without replacing existing destination edits. It deletes nothing.
2. On hosting, configure the existing Supabase URL/public key plus server-only
   **SUPABASE_SERVICE_ROLE_KEY**. Never prefix that secret with `VITE_` or paste
   it into chat. Redeploy the updated app. Notes use the managed tables even on
   Vercel/read-only hosting; no S3 configuration is required.
3. Admin → Materials → Make sample notes editable, then edit/save normally.
4. Admin → Storage → Use Supabase Storage for future uploaded files if another
   provider had previously been selected. Existing objects are not migrated.

The dedicated tables have RLS and no browser-role grants. Server handlers enforce
admin writes and student access. The public material API omits paid note bodies.
Supabase service-role authorization and fresh schema tests cover persistence,
updates/deletion, reruns and rejection of anonymous/student direct table access.

This changes the storage accounting: **saved notes text/settings/file metadata now
consume Supabase database space**, and uploaded files consume Supabase Storage.
Template banks are not copied there. Existing local/S3 JSON documents are not
available to SQL: export/import them separately before switching if they contain
important content. Production data itself has not been inspected or modified.

## Easy Text Test + strict subject isolation (5 October 2026)

See **EASY-TEST-GUIDE-HINDI.md**. Admin → Tests defaults to the new three-step
Easy Text Test tab: metadata/paste → editable preview → explicit publish.
Advanced workbench remains available unchanged in layout. Easy mode publishes
only approved pasted questions, without bank fill or generated explanations.
Publish is atomic and idempotent through the admin server and a service-only RPC.

Existing deployments must apply **KKCC-Excellence-Hub-EASY-TESTS.sql** once and
redeploy. Tests and authored/published question rows now map to `kkcc_tests` and
`kkcc_test_questions`; these consume Supabase database space. Static template
banks remain in source files. Existing legacy SQL rows are copied without
replacement; existing local/S3 JSON data requires separate export/import first.
Student RLS/access/purchases are retained. No production migration was run here.

Strict generation no longer defaults empty subjects to SST, broadens exam scope,
substitutes unrelated chapters, synthesizes generic filler, or returns all manual
rows when a subject/chapter selection does not match. Exact coverage may be lower
than requested; the admin must lower the count or add questions. Old mislabeled
stored content is preserved for admin review, not silently removed.

### Easy Free/Paid and publish repair

Easy Text Test now includes Free/Paid, INR price, and coin price. Paid needs at
least one positive price; free clears both. The price is shown in final review
and persisted atomically with questions via `publish_easy_text_test_v2`. The
versioned endpoint prevents an older SQL function silently ignoring paid fields.

Existing deployments: back up, run **KKCC-Excellence-Hub-PUBLISH-FIX.sql**, verify
server-only Supabase env, and redeploy. It combines notes and test setup, including
the paid RPC. No automatic production migration was executed. Managed notes/test
metadata ignores old global file/S3 overrides; missing SQL returns a setup error,
not a readonly/S3 fallback. Explicit `KKCC_FIXTURE_LOCAL_CMS=1` is only for local
fixtures and is ignored on Vercel. Template bank remains outside Supabase.
Attachment storage selection and legacy files are NOT automatically changed or
migrated. Production SQL copy/preview now loads the real static SQL and fails
visibly on download errors, never substituting the cleaner script.

### Browser-tested Easy + Advanced builders

See `docs/audit/TEST-BUILDERS-E2E-2026-10-05.md` for coverage and limitations:
**78 browser E2E tests passed**, including 66 exam-bank flows and Easy/Advanced
publication, learner attempts/results, access gates and mobile checks.
Easy series names now appear in review and student cards. Advanced publication,
field-level autosave, option-index correction and mutation/cache races were fixed.
Run `npm run test:e2e` after installing Playwright Chromium; the fixture uses port
4600. No new SQL is required beyond the previous Publish Fix migration.

## Subject / Chapter / Topic folder organiser

Admin → Tests → **Subjects & Chapters**. Name a series first, then save subjects in
its own list. Every saved subject has a Chapters button; add a multiline
chapters list, then use each chapter’s Topics / Skip button. Add optional topics or paste questions directly
inside the chapter. The editor opens inline beneath the chapter/topic. Save private drafts or publish. Select
original sets across chapters to assemble an editable combined paper, or choose
Complete subject test. Same-series/subject boundaries are enforced; exact duplicate
questions are removed and conflicting answers/explanations fail explicitly. Existing
Easy and Advanced workflows remain available. See `TEST-FOLDERS-GUIDE-HINDI.md`.

Apply **KKCC-Excellence-Hub-TEST-FOLDERS.sql** once (includes previous Publish Fix),
then redeploy. Folder paths are in a service-only Supabase table; questions remain
saved manual test snapshots, not an imported template bank. No production migration
was executed. Combined papers are independent, without a fixed own-question count quota; hosting resource limits still apply. Questions and explicit preview + confirm before publish.

The large-question update requires `KKCC-Excellence-Hub-TEST-SCALE-FIX.sql` on an existing Test Folders installation. Latest combined Test Folders and Production SQL include it.

Series-first workflow: Continue → Subjects → Save subject → Chapters → save chapter list → Topics / Skip → paste MCQ text → preview → save/publish. Empty series drafts persist only after their first subject is saved.

## Own-question scale and Advanced publish repair
- Fixed partial-setting validation injecting default manual mode/prices/recipe values into unrelated edits.
- Manual add/edit/paste selects manual-only; bank setup must be explicit. Strict generated subject aliases do not infer other subjects from arbitrary names.
- Removed 200 own-question, 50 child-list/source-set and 1000 answer-count caps. There is no product count quota on authored folders/MCQs; platform memory, request, timeout and storage constraints still apply. Per-field validity limits remain. Generated-bank count/coverage limits remain explicit.
- Reads page past Supabase row caps; list writes use repeat-safe batches. Easy previews show 25/page; Advanced saved questions show 50/page.
- Verified: **101 unit/database tests and the complete 80-test browser suite passed**, including a 1001-question paid manual paper and a bank-to-manual transition. See `docs/audit/TEST-SCALE-2026-10-05.md`.

## Outline edit/remove/back upgrade
Series, subject, chapter and topic rows now expose Edit name / Remove; inner panels have Back controls. Rename is atomic across descendant folder metadata and manual-test locations, preserving authored questions, commercial settings and IDs. Subject/chapter renames update persisted attempt selection metadata. Conflicting destinations are rejected rather than merged.
Deletion requires a confirmation dialog with affected counts; it permanently removes the selected subtree and its manual tests/questions, including published tests. Other branches and paid catalogue products are not deleted. Old attempts for deleted tests may stop opening. Unsaved editors get a separate discard confirmation.
Install `KKCC-Excellence-Hub-TEST-OUTLINE-EDIT.sql` on an existing folder setup, or use latest combined Test Folders / Production SQL, then redeploy. Verification: **103 unit/database tests and 8 targeted browser tests passed**; the 80-test full-suite run belongs to the preceding scale release. See `docs/audit/TEST-OUTLINE-EDIT-2026-10-05.md`.

## Storage usage and student access removal
- Admin → Storage usage → Check storage usage / Refresh: read-only database size and Supabase bucket file totals; unknown metadata sizes shown explicitly. Not remaining plan quota, billing or external-provider usage.
- Admin → Student access — Grant / Remove → Enrollment student → Remove student access: revoke course/test/series grants in place with confirmation and history preserved. Free content/other entitlements are not a global ban.
- Existing installations run `KKCC-Excellence-Hub-STORAGE-USAGE.sql` for the new storage RPC, then redeploy. The access-removal UI reuses existing revoke endpoints and needs no additional migration. Latest combined Production SQL includes storage inspection.
- Verification: **104 unit/database tests + 82 full browser tests passed**. Guide: `STORAGE-ACCESS-GUIDE-HINDI.md`; evidence: `docs/audit/STORAGE-ACCESS-2026-10-05.md`.

## Clean single-accent test design — 2026-10-06
The test-taking and result screens now use a single teal accent with neutral light/dark surfaces. This replaces the earlier neon/rainbow design. Per-answer colours, gradients and glow are removed; selection, flags and results remain identifiable by labels/icons/borders. No test/scoring/access logic changed and no new SQL is required.
Verified with 104 unit/database tests and 10 targeted browser tests, including 320px/390px layout and keyboard focus. Screenshots and current evidence: `docs/audit/TEST-PAPER-SINGLE-ACCENT-2026-10-06.md`.

## Admin test-result retention — 2026-10-06
Admin → Storage → **Test result storage** (also under Admin → Tests) now has an ON/OFF switch. **ON is the installation default** and preserves saved autosave/results/history. OFF creates stateless, encrypted temporary tests: answers/token/results remain in browser RAM only, no attempt rows or local/session/IndexedDB persistence; refresh/close loses progress/result. Server grading/access checks/timers remain active. Existing history is unchanged until separately cleaned.

Existing installations must run **`KKCC-Excellence-Hub-TEST-PRIVACY.sql`**, then redeploy. Requires the existing server-only `SUPABASE_SERVICE_ROLE_KEY`; never expose it with a VITE_ prefix. New combined Production / student-only schemas include the migration. Rerunning it preserves the current setting and does not delete history.

To remove old results: OFF → refresh counts → type **DELETE TEST HISTORY** → confirm deletion. Only `learning_attempts` are removed, up to 5000 previewed records per batch; repeat as needed. Profiles/accounts, payments, access grants, admin questions/tests, folders and notes remain. Backups/exports/provider logs are not erased. Nothing was deleted in production by the agent.

Verification: **107 unit/database + 84 full browser cases passed**, plus a follow-up temporary flow with an independent Student A login. See [Hindi setup](docs/TEST-PRIVACY-HINDI.md) and [verification](docs/audit/TEST-RETENTION-2026-10-06.md). Live downloads: `/downloads/` (Privacy SQL, Production SQL, Cleaner and ZIP).

## App audit, safe updates and editable thumbnails — 2026-10-06
- **Free + paid notes/tests:** upload/replace/remove image covers or write a plain-text cover, with preview and explicit Save. Notes: `/admin/materials` → Edit. Tests: `/admin/tests` → Test thumbnails (all saved Easy/Advanced/folder tests).
- Run **`KKCC-Excellence-Hub-THUMBNAILS.sql`** on existing latest installations, then deploy. It is additive, does not delete content, and does not change result-retention mode. Uploaded covers use a dedicated **public** Supabase bucket; no S3 required. Removing a cover does not physically delete a potentially shared file.
- Safe PWA updates never auto-reload an open test/editor; test offline warning/reconnect checkpoint retry; bounded server asset cache/304; reduced fallback access polling. Fixed quiz hydration, admin analytics schema mismatch, stale wallet SSR reads, and dashboard sample duplication/visibility.
- **114 unit/database + 91 browser tests passed**, including a 46-route role-specific mobile smoke sweep. `npm run check`, PWA readiness and 12 SQL mirrors pass. This is local-fixture validation, not live Razorpay/Supabase Storage or production load certification.
- [Thumbnail Hindi guide](docs/THUMBNAILS-HINDI.md) · [Full audit and measured optimisation scope](docs/audit/APP-OPTIMISATION-THUMBNAILS-2026-10-06.md).
