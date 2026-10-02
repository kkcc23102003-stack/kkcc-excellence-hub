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
