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
