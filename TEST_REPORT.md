# Archived test report — historical syllabus and source snapshots

> Historical snapshot only. Earlier sections below may refer to legacy combined SQL downloads or production migration states that have since changed. The timestamped `supabase/migrations/` directory is the current database source of truth; confirm live migration status separately before claiming production cutover.

## What changed in this round

You were right: chapters were missing, and badly. Here is the real audit,
before and after.

| Subject          |                         Real syllabus | Was in app |                     Now |
| ---------------- | ------------------------------------: | ---------: | ----------------------: |
| Science Class 9  |                12 (new NCERT) + 3 old |          6 |                  **15** |
| Math Class 9     |                12 NCERT + ICSE extras |          1 |   **12 CBSE / 11 ICSE** |
| Science Class 10 |                13 (new NCERT) + 3 old |          5 |                  **16** |
| Math Class 10    |                14 NCERT + ICSE extras |          1 |   **14 CBSE / 16 ICSE** |
| SST Class 9      | History, Geography, Civics, Economics | 3 (shared) | **11 grouped chapters** |
| SST Class 10     | History, Geography, Civics, Economics | 3 (shared) |  **8 grouped chapters** |

Series chapter counts, before and after:

| Series        | Was |    Now |
| ------------- | --: | -----: |
| CBSE Class 9  |  10 | **38** |
| CBSE Class 10 |   9 | **38** |
| ICSE Class 9  |  21 | **39** |
| ICSE Class 10 |  22 | **42** |

### 1. New NCERT and old NCERT, both

The 2023 rationalisation removed chapters that state boards, olympiads and
entrance foundations still ask. So both are in:

- **Class 9 new:** Atoms and Molecules, Tissues, Motion, Gravitation, Work and
  Energy, Improvement in Food Resources.
- **Class 9 old, kept:** Diversity in Living Organisms, Why Do We Fall Ill,
  Natural Resources.
- **Class 10 new:** Metals and Non-metals, Carbon and its Compounds, Control
  and Coordination, How do Organisms Reproduce, Heredity, The Human Eye and
  the Colourful World, Magnetic Effects of Electric Current, Our Environment.
- **Class 10 old, kept:** Periodic Classification of Elements, Sources of
  Energy, Management of Natural Resources.

Old-syllabus chapters are labelled "(old NCERT)" on the card and carry extra
tags for State Board and NTSE/Olympiad, so a current-syllabus student is never
misled about what is examinable for them.

### 2. ICSE Maths is no longer the NCERT list with a different cover

ICSE genuinely sets different chapters. Added as ICSE-only: **GST, Banking
(recurring deposits), Shares and Dividends, Matrices, Remainder and Factor
Theorem, Linear Inequations and Loci, Compound Interest, Expansions and
Factorisation, Indices and Logarithms.**

At the same time, NCERT-only chapters (Real Numbers, Polynomials, Pair of
Linear Equations, Areas Related to Circles, Number Systems, Euclid's Geometry,
Heron's Formula) were **retagged to CBSE alone**, so an ICSE student stops
seeing chapters their board does not set.

### 3. SST split per class

SST was one shared subject with three chapters, so a Class 9 student could be
shown a Class 10 chapter. It is now **SST Class 9** and **SST Class 10**, each
covering History, Geography, Civics and Economics — French Revolution through
to Consumer Rights.

### 4. Advanced bank for the test series, Moderate bank for Kit 2 Coins

Every new chapter is written in **two layers**, and `src/lib/question-routing.ts`
is the single place that decides who draws from which:

| Layer         | Who draws it                              | What it is                                            |
| ------------- | ----------------------------------------- | ----------------------------------------------------- |
| **Moderate**  | Kit 2 Coins practice quiz                 | The working knowledge of the chapter — builds fluency |
| **Difficult** | Paid test series, unlimited advanced test | Exam-oriented, most-asked, higher-order items         |

Example, Class 10 Maths on the CBSE track: **151,320** practice questions and
**27,396** advanced questions, kept separate.

### 5. Unlimited advanced test

Every series now carries an **endless paper per subject**, drawn only from the
Difficult layer. No question count, no end screen. It reuses the quiz engine,
so anti-repeat, explanations and exam badges are identical — but advanced mode
never falls back to an easier level, because the whole point is that every
question is an exam-level one.

Open it from the series card, or directly:
`/games?exam=<exam>&subject=<subject>&topic=Mixed&mode=PYQ-pattern&level=advanced`

## Gates run

| Gate                     | Result                                                   |
| ------------------------ | -------------------------------------------------------- |
| `npx tsc --noEmit`       | clean                                                    |
| `npm run lint`           | 0 errors, 11 warnings (all pre-existing `react-refresh`) |
| `npm run check`          | passed, 281 source files                                 |
| `npm run check:pwa`      | passed                                                   |
| `VERCEL=1 npm run build` | passed                                                   |
| `npm run build`          | passed                                                   |
| Bank audit               | **6,439,503 valid** · malformed 0 · dupOptions 0         |
| Series band check        | 41 series, **0 outside 5,000–250,000**                   |
| Routes served            | 9 routes + advanced-mode URL — all 200                   |
| Served vs disk artifacts | all three hashes match                                   |

Bank growth this round: 5,711,370 → **6,439,503** (+728,133).
Catalogue: 41 series · **1,463 chapters** · **1,821 tests**.

## Fresh artifacts

| Artifact                               | SHA-256                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| `kkcc-excellence-hub.zip` (286 files)  | `fbda2f912384263388c9349e3c82c829642d920a3fdb4123e713bd1594f9b29a`             |
| `kkcc-excellence-hub-one-combined.sql` | `62a765e533f897b378c64f307adee9b4c745d04141adfd7796ec665af8c175b2` (unchanged) |
| `kkcc-excellence-hub-sql-cleaner.sql`  | `c77ffccc76cee467e6e7c00306c4fd1e6f7c0416acd1e04235ae83c5c4c322b9` (unchanged) |

No new migration this round, so both SQL files are unchanged.

## What is still open, honestly

- **The two migrations are still not applied** to `crrtkacxakinzpxcxbzf`:
  `20260930120000` and `20260930160000`. Until they are run, in timestamp
  order, the admin free toggle and the offline grant panel will error.
- **SST is grouped, not one-chapter-per-NCERT-chapter.** Class 9 SST ships 11
  chapters that group the 20 NCERT chapters thematically (for example "India —
  Size, Location and Physical Features" covers two NCERT chapters). The
  content is there; the split can be made finer on request.
- **Class 11 and 12 were not touched this round.** Their chapter lists are
  already deep (Physics 17–18, Biology 21, Maths 16–18), but they have not
  been audited chapter-by-chapter against the current NCERT list the way 9 and
  10 just were. That is the obvious next pass.
- Other exams (SSC, Banking, Railways, UPSC, Punjab) were **not re-audited**
  this round. Their chapter counts are already large (44–71 per series), but I
  have not verified each against its official syllabus notification. Say the
  word and I will do that pass next, exam by exam.

---

# Test report — ICSE science split, three test kinds, theory series, admin free and offline access

## What changed in this round

### 1. ICSE Class 9 and 10 now have real, separate science papers

ICSE does not set one combined "Science" paper, so the app no longer pretends
it does. `src/lib/exam-bank/icse.ts` adds six subjects:

| Subject            | Chapters |
| ------------------ | -------- |
| Physics Class 9    | 8        |
| Physics Class 10   | 7        |
| Chemistry Class 9  | 5        |
| Chemistry Class 10 | 6        |
| Biology Class 9    | 4        |
| Biology Class 10   | 5        |

Maths was already split per class. Exam tags are derived per class, not
blanket-applied, so a Class 9 chapter never appears in a Class 10 paper.

The effect on the bank is large and measurable:

| Exam tag      |  Before |   After |
| ------------- | ------: | ------: |
| ICSE Class 9  | 105,448 | 240,068 |
| ICSE Class 10 | 105,448 | 253,595 |

The ICSE Class 9 series went from 10 chapters to 21, and Class 10 from 9 to 22.

### 2. Every series now has three kinds of test, not one

`seriesTotals` and the new `seriesLayers` give every one of the 41 series
three layers, in the order a student should work through them:

| Layer       | What it is                                   |                      Questions per test |
| ----------- | -------------------------------------------- | --------------------------------------: |
| Chapterwise | One test per chapter                         | 60 (20 Easy, 20 Moderate, 20 Difficult) |
| Subjectwise | One test per subject, all its chapters mixed |                                     100 |
| Combined    | Full syllabus, every subject, exam pattern   |                                     200 |

Catalogue totals: **41 series · 1,374 chapters · 1,734 tests · 138,940
questions in the papers themselves.**

### 3. Series are sized by exam demand, and every one lands in the band

Each series carries a demand tier that decides how deep its question pool
should be. A flagship exam with lakhs of multi-year aspirants earns a far
deeper pool than a single-board Class 9 paper.

| Tier     | Target pool | Series |
| -------- | ----------: | -----: |
| flagship |     250,000 |     15 |
| high     |     150,000 |     13 |
| steady   |      60,000 |     13 |

The number shown on a card is `min(what the bank actually holds, the tier
target)`, capped at 250,000. It is never an invented figure.

**Result: all 41 series fall inside the required 5,000–250,000 band.**
Smallest is 58,200 (CA Final), largest is 250,000. Combined addressable pool
across the catalogue: 6,132,241.

### 4. CA and the other professional exams

`ca.ts` gained a final-level block — Ind AS reporting, the Standards on
Auditing, valuation and risk, and advanced direct and indirect tax — tagged
only to the final-level tracks so it can never leak into a Foundation paper.
The foundation and intermediate content was widened to the CS and CMA tracks
that genuinely share that syllabus level.

| Exam tag                                                         | Questions |
| ---------------------------------------------------------------- | --------: |
| CA Foundation / CA Intermediate                                  |   102,377 |
| CS Foundation / CS Executive / CMA Foundation / CMA Intermediate |    80,075 |
| CA Final / CS Professional / CMA Final                           |    53,220 |

Four new series: **CA Final, CS Executive, CS Professional, CMA Intermediate.**

### 5. Theory series — the marks that are not MCQs

A board paper is mostly written answers. `src/lib/theory-bank.ts` holds the
descriptive questions that keep coming back, chapter by chapter, each with its
mark weight, its kind (short answer, long answer, reason based, diagram,
numerical) and a marking-scheme answer outline the student can check
themselves against.

| Series                                   | Chapters | Subjects | Questions | Marks |
| ---------------------------------------- | -------: | -------: | --------: | ----: |
| ICSE Class 9 Important Theory Questions  |        4 |        3 |        21 |    55 |
| ICSE Class 10 Important Theory Questions |        6 |        3 |        28 |    73 |
| CBSE Class 9 Important Theory Questions  |        4 |        3 |        21 |    55 |
| CBSE Class 10 Important Theory Questions |        5 |        3 |        24 |    62 |

These carry the same paid / free / manual-enrolment behaviour as every other
series. This is a first library written for KKCC, not a copy of any board
paper or publisher, and it is built to grow chapter by chapter.

### 6. Admin: make a test free, and open a paid test for an offline payment

Migration `20260930160000_test_access_grants.sql` adds the missing piece.

**Make it free.** One button in `/admin/tests` flips `tests.is_paid`. A free
test then opens directly for everyone, exactly like a free course — no
payment step, no Razorpay, nothing in the way. Switching back to paid is
refused if the test has no price set, so a paid test can never be
unpurchasable.

**Offline payment.** When a student pays cash at the centre, by UPI to the
desk, or by bank transfer, the admin enters their registered email, how they
paid, the amount and a receipt note. The paper opens for that student alone,
immediately. Grants are never deleted, only revoked, so the record of who
opened what, for whom, and why always survives.

### 7. A real leak closed on the way

`getPublicTest` was handing the questions of **paid** tests to the anonymous
client. Anyone could have read a paid paper out of the page source.

Now a paid test returns `locked: true` and an empty question list. The
questions travel only through the new authenticated `getTestForAttempt`,
which checks on the server that the test is free or that the student holds a
live, unrevoked grant. A student cannot write to `test_access_grants` at all —
RLS restricts writes to admins — so access cannot be self-granted from the
browser console.

## Gates run

| Gate                     | Result                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit`       | clean                                                                                                         |
| `npm run lint`           | 0 errors, 11 warnings (all pre-existing `react-refresh`)                                                      |
| `npm run check`          | passed                                                                                                        |
| `npm run check:pwa`      | passed                                                                                                        |
| `VERCEL=1 npm run build` | passed, `nodejs22.x`, web entry present                                                                       |
| `npm run build`          | passed                                                                                                        |
| Bank audit               | **5,711,370 valid** · malformed 0 · dupOptions 0                                                              |
| Routes served            | `/`, `/games`, `/test-series`, `/coins`, `/courses`, `/downloads`, `/support`, `/login`, `/classes` — all 200 |
| Served vs disk artifacts | all three hashes match                                                                                        |

Bank growth this round: 5,285,624 → **5,711,370** valid questions (+425,746).

## Fresh artifacts

| Artifact                               | SHA-256                                                            |
| -------------------------------------- | ------------------------------------------------------------------ |
| `kkcc-excellence-hub.zip` (281 files)  | `ed2c39f8d79733abdcae7b82d50172982ff4e48f9aa1181e85e7248c2c4d3b28` |
| `kkcc-excellence-hub-one-combined.sql` | `62a765e533f897b378c64f307adee9b4c745d04141adfd7796ec665af8c175b2` |
| `kkcc-excellence-hub-sql-cleaner.sql`  | `c77ffccc76cee467e6e7c00306c4fd1e6f7c0416acd1e04235ae83c5c4c322b9` |

The combined SQL now ends with the new grants migration; the cleaner drops
`test_access_grants` and `has_test_access` in the right order.

## Regression checks

- No 600-DPI or oversized PDF was added; nothing in `public/` grew except the
  three artifacts above.
- Quiz section styling untouched — only question text stays colourful.
- Kit 2 wallet remains browser-local; nothing about it moved to Supabase.
- The coin rate still comes from `src/lib/coin-conversion.ts` alone.
- Devanagari Hindi and Gurmukhi Punjabi banks untouched.
- Admin-only strings ("Make this free", "Grant access") confirmed **absent**
  from the public `/test-series` HTML.

## What is still open, honestly

- **The migration is not applied yet.** Both `20260930120000` and the new
  `20260930160000` are committed but have not been run against
  `crrtkacxakinzpxcxbzf`. Until they are, the admin free toggle and the
  offline grant panel will error at runtime. Run them one file at a time, in
  timestamp order.
- The theory library is deliberately a starting set — 94 questions across 19
  chapters. It is real and usable today, but it should keep growing until it
  covers every chapter of both boards.
- Theory series currently enrol through the same enquiry pipeline as the MCQ
  series; there is still no online payment gateway for any series.

---

# Test report — coin conversion rate and live test series enrolment

## What changed in this round

**One rate, defined in one place.** `src/lib/coin-conversion.ts` is now the
only definition of what a coin is worth:

> 1,000 Kit 2 Coins = 1 23KAAT coin = ₹1

Every screen reads from that module, so the rate can never drift between
pages. The quiz weekly target is no longer a loose `1000` literal; it is
derived from `KIT2_PER_23KAAT`.

**The rate is now visible where it matters.**

- The Kit 2 hero card shows a "Worth" row: the balance in 23KAAT and in
  rupees, plus how many more coins are needed for the next whole 23KAAT.
- The wallet panel's "Weekly" tile became a live "Worth now" tile.
- The rules block states the rate as its own fact.
- The 23KAAT page shows "1 23KAAT = ₹1" and points students at the quiz as a
  free way to earn them.

**Test series enrolment is wired and working.** "Enrol in this series" no
longer parks the student on the support page. It raises a real request on
their account through `submitAdmissionEnquiry`, the same pipeline the 23KAAT
coin packs already use, pre-filled with the series name, the exam it is
oriented for, the chapter and question counts, and both prices. Not logged in
sends them to `/login` with a redirect back. Paid tests coming from the
database now use the same path through a new `UnlockTestButton`, so a paid
test can no longer be opened straight from its card.

## The one risk worth stating plainly

A Kit 2 balance lives in the browser, in local storage, because you asked for
it to stay off the database. Giving those coins a rupee value means a student
who opens developer tools can set the balance to anything they like.

So nothing in this round credits an account automatically. Reaching 1,000
Kit 2 Coins mints a **voucher code**, and the copy on screen says the KKCC team
verifies that code before any 23KAAT is credited. The real 23KAAT wallet stays
server-side and untouched by the quiz. A forged local balance therefore buys
nothing on its own.

If you later want Kit 2 Coins to credit 23KAAT automatically, the earning has
to move server-side first. Say the word and I will plan that migration.

## Validation run this round

- `npm run lint`: 0 errors, 11 pre-existing react-refresh warnings.
- `npx tsc --noEmit`: clean.
- `npm run check`: passed, 276 source files inspected.
- `npm run check:pwa`: passed.
- `VERCEL=1 npm run build`: nodejs22.x runtime, web entry format.
- Routes returning 200: `/`, `/games`, `/test-series`, `/coins`, `/checkout`,
  `/admin/tests`, `/downloads`, `/login`.
- Server-rendered `/games` and `/coins` both carry the sentence
  "1,000 Kit 2 Coins = 1 23KAAT coin = ₹1".
- Server-rendered `/test-series` carries the enrol button and the rate note on
  every one of the 37 series cards.

## Regression checks held from earlier rounds

- Chapterwise paid series: 37 series, 1,318 chapter tests, 60 questions each
  split 20 Easy, 20 Moderate, 20 Difficult.
- Exam bank: 5,285,624 valid questions, 0 malformed, 0 duplicate options.
- No app data, private URLs or YouTube links leak into public payloads.
- Kit 2 wallet, history and progress remain browser-local.
- Hindi stays Devanagari, Punjabi stays Gurmukhi.
- Only the question text is colourful; the rest of the quiz is unchanged.
- No new Supabase migration this round, so both SQL artifacts are unchanged.

---

# Test report — chapterwise paid series, more exams, and a 52.8 lakh question bank

## What changed in this round

**Every paid test is now chapterwise, 60 questions, three levels.** The Test
section carries 37 series and 1,318 chapter tests. One chapter gets one test,
and each test is 60 questions split 20 Easy, then 20 Moderate, then 20
Difficult, attempted in that order. The chapter list is not typed by hand: it
is read live from the exam bank for that exact exam, so a Class 11 series never
lists a Class 12 chapter, and adding a chapter to the bank makes it appear on
the page automatically.

**The exam list is much wider.** New series: SSC CGL, SSC CHSL, SSC MTS, SSC GD
Constable, RRB NTPC, RRB Group D, RRB ALP, NDA and CDS, CAPF, State PSC, JEE
Advanced, CA Intermediate and CLAT, alongside the Punjab, UPSC, Banking, NEET
and JEE Main series already there.

**Board classes are separated, 9 to 12.** CBSE Class 9, 10, 11 and 12 and ICSE
Class 9, 10 and ISC Class 11, 12 each have their own series and their own
chapter map. The class tags are attached from the chapter id, so Class 9
content and Class 10 content no longer share one label.

**Heavy new Physics and Mathematics banks.** Two new chapter files cover the
full NCERT Class 11 and Class 12 syllabus: 23 Physics chapters from Units and
Measurements through Semiconductor Electronics, and 20 Mathematics chapters
from Sets through Probability. Physics went from 20,106 to 465,706 questions
and Mathematics from 41,884 to 452,908.

**The Kit 2 Coins page was rebuilt to breathe.** The quiz now sits first,
because that is what the page is for. The rules block moved below it and became
four short icon facts instead of four dense paragraphs. The hero coin card no
longer repeats the weekly goal and daily-remaining tiles that the wallet panel
already shows; it now carries the balance, one progress bar and a single line
of week context.

## Bank size

| Measure                             | Count         |
| ----------------------------------- | ------------- |
| Enumerable questions                | 5,590,362     |
| Valid after every check             | **5,285,624** |
| Distinct prompt + option set        | 5,275,039     |
| Malformed                           | 0             |
| Duplicate options inside a question | 0             |

| Level     | Questions |
| --------- | --------- |
| Easy      | 2,843,506 |
| Moderate  | 1,898,589 |
| Difficult | 543,529   |

## Where the new exams stand

| Exam track                    | Questions      |
| ----------------------------- | -------------- |
| NDA/CDS                       | 3,657,521      |
| SSC CGL, CHSL, MTS, GD        | 2,870,149 each |
| RRB NTPC, Group D, ALP        | 2,870,149 each |
| CAPF                          | 2,870,149      |
| State PSC                     | 3,586,563      |
| UPSC CSE                      | 3,155,009      |
| CBSE Class 11 / ISC Class 11  | 910,195        |
| CBSE Class 12 / ISC Class 12  | 888,923        |
| NEET                          | 890,476        |
| JEE Main                      | 778,264        |
| JEE Advanced                  | 624,328        |
| CBSE Class 9 / ICSE Class 9   | 105,448        |
| CBSE Class 10 / ICSE Class 10 | 105,448        |

Punjab remains the largest state block: PPSC Punjab 3,399,395, Punjab Master
Cadre 3,033,235, Punjab Patwari 3,011,480, Punjab Lecturer Cadre 2,927,787,
PSSSB 2,844,484, Punjab PCS 2,828,795, Punjab ETT Cadre 2,810,189, with 333,968
questions in the Punjab-only subjects across 50 chapters.

## Paid catalogue

37 series, 1,318 chapter tests, 79,080 questions in the published papers, every
card labelled with the exam it is oriented for. Largest chapter maps: NDA and
CDS 71, CBSE and ISC Class 12 69, CBSE and ISC Class 11 66, JEE Main 65, NEET
61, JEE Advanced 58, SSC CGL and CHSL 52 each.

## One correction, stated plainly

The 47 lakh figure from the last round was the size of the whole bank, not the
Punjab section. Punjab holds 333,968 questions of its own, which is the 2 to 3
lakh chapterwise target you set, and it also draws on the shared general
studies, aptitude and reasoning pools, which is why its exam-track numbers run
into millions. This round the whole bank is 52.8 lakh.

## Validation run this round

- Bank enumeration: 5,285,624 valid, 0 malformed, 0 duplicate-option questions.
- `npm run lint`: 0 errors, 11 pre-existing react-refresh warnings.
- `npx tsc --noEmit`: clean.
- `npm run check`: passed, 274 source files inspected.
- `npm run check:pwa`: passed.
- `VERCEL=1 npm run build`: nodejs22.x runtime, web entry format.
- Routes returning 200: `/`, `/games`, `/test-series`, `/admin/tests`,
  `/downloads`, `/courses`, `/login`.
- Server-rendered `/test-series` carries 37 "Oriented for" labels, real chapter
  names and the 20/20/20 level split on every card.
- Server-rendered `/games` shows the quiz above the rules block.

## Regression checks held from earlier rounds

- Notes PDFs: no 600-DPI or oversized-file regression; upload limit aligned at
  45 MB.
- No app data, private URLs or YouTube links leak into public payloads.
- Kit 2 Coins wallet, history and progress remain browser-local.
- Hindi stays Devanagari, Punjabi stays Gurmukhi.
- Chapter routing stays strict: a chapter never serves another chapter's
  question.
- Only the question text is colourful; the rest of the quiz is unchanged.

---

# Test report — paid test series, the three-level ladder and a 47.9 lakh question bank

## What changed in this round

**A paid test series set, organised by exam.** The Test section now carries a
catalogue of 18 series. Every series is built for one exam and says so in bold
on its card: "Oriented for: Punjab PCS", "Oriented for: PSSSB", and so on. The
catalogue is grouped Punjab State, National, Banking and SSC, Medical and
Engineering, Board and Others, so a Punjab aspirant sees their papers first.
Each series shows its rupee price and its Kit 2 Coins price side by side.

**Three levels, always in the same order.** Inside every series the papers run
Level 1 Easy, then Level 2 Moderate, then Level 3 Difficult. The quiz follows
the same ladder: ten questions at a level, then it steps up, with a level strip
above the question showing where you are. Choosing a new subject, exam or
chapter restarts the ladder at Easy.

**Two new question formats, which is where the volume came from.** The bank now
generates the two formats that actually dominate these papers:

- _Consider the following statements ... Which of the statements given above
  is/are correct?_ with the standard 1 only / 2 only / Both / Neither options.
- _Consider the following statements ... How many of the statements given above
  are correct?_ with None / Only one / Only two / All three.

Both are built from the same verified fact tables the rest of the bank uses.
Each statement is either a real pair or a deliberately falsified one, and the
explanation names exactly which statement is wrong and why. Nothing is padding
or reworded filler.

**Paid test fields in the database.** `public.tests` gained `exam_track`,
`level`, `series_name`, `is_paid`, `price_inr` and `price_coins`, each added
with `if not exists` and a safe default so existing tests keep working. Check
constraints stop a paid test from having no price and stop negative prices. The
admin workbench at `/admin/tests` exposes all six fields.

## Bank size

| Measure                             | Count         |
| ----------------------------------- | ------------- |
| Enumerable questions                | 5,054,922     |
| Valid after every check             | **4,796,160** |
| Distinct prompt + option set        | 4,787,952     |
| Malformed                           | 0             |
| Duplicate options inside a question | 0             |

The target was 10 lakh. The bank enumerates **47.9 lakh** valid questions.

| Level     | Questions |
| --------- | --------- |
| Easy      | 2,715,792 |
| Moderate  | 1,579,415 |
| Difficult | 500,953   |

## Punjab state bank, chapterwise

The target was 2 to 3 lakh. Punjab-specific subjects hold **333,968 questions
across 50 chapters**.

| Subject            | Questions | Chapters |
| ------------------ | --------- | -------- |
| Punjabi Grammar    | 76,976    | 6        |
| Punjab GK          | 53,906    | 6        |
| Punjab History     | 51,088    | 6        |
| Punjabi Paper B    | 36,334    | 8        |
| Punjabi Paper A    | 31,822    | 6        |
| Punjab Economics   | 29,630    | 6        |
| Punjab Geography   | 29,004    | 6        |
| Punjabi Literature | 25,208    | 6        |

Punjab exam tracks draw on the wider bank too: PPSC Punjab 3,399,395, Punjab
Clerk 3,300,458, Punjab Police 3,165,029, Punjab Master Cadre 3,033,235, Punjab
Patwari 3,011,480, Punjab Lecturer Cadre 2,927,787, PSSSB 2,844,484, Punjab PCS
2,828,795, Punjab ETT Cadre 2,810,189.

## On the 60 to 80 percent claim

We will not promise a hit rate we cannot measure, and no honest publisher can.
What the bank does guarantee is the thing behind that number: every question is
tied to a concept these papers actually test, written in the format they
actually use. Where a paper has asked a fact before, the bank asks the same
fact, and it also asks it back to front, as a match set, as a two-statement
set, and as a three-statement count. That is how these exams recycle material,
so a student who clears a chapter here recognises the concept whatever shape it
arrives in.

## Validation run this round

- Bank enumeration: 4,796,160 valid, 0 malformed, 0 duplicate-option questions.
- `npm run lint`: 0 errors, 11 pre-existing react-refresh warnings.
- `npx tsc --noEmit`: clean.
- `npm run check`: passed, 271 source files inspected.
- `npm run check:pwa`: passed.
- `VERCEL=1 npm run build`: nodejs22.x runtime, web entry format.
- Routes returning 200: `/`, `/games`, `/test-series`, `/admin/tests`,
  `/downloads`, `/courses`, `/login`.
- Server-rendered `/test-series` contains "Paid test series", "Oriented for:"
  and the series names; `/games` contains the level strip and the exam badges.

## Regression checks held from earlier rounds

- Notes PDFs: no 600-DPI or oversized-file regression; upload limit stays
  aligned at 45 MB.
- No app data, private URLs or YouTube links leak into public payloads.
- Kit 2 Coins wallet, history and progress remain browser-local.
- Hindi stays Devanagari, Punjabi stays Gurmukhi.
- Chapter routing stays strict: a chapter never serves another chapter's
  question.
- Only the question text is colourful; the rest of the quiz is unchanged.

---

# KKCC Excellence Hub — Test Report

## Punjab state focus, new cadres, PSEB 9-10 and the guided quiz flow (latest)

### 1. Bank size

| Metric                            | Previous | Now         |
| --------------------------------- | -------- | ----------- |
| Valid generated questions         | 285,848  | **291,856** |
| Distinct prompt + full option set | 278,145  | **283,648** |
| Malformed questions               | 0        | **0**       |
| Questions with duplicate options  | 0        | **0**       |

### 2. New exam tracks added

| Exam track                  | Questions available |
| --------------------------- | ------------------- |
| Punjab Master Cadre         | 69,475              |
| Punjab Lecturer Cadre (new) | 63,467              |
| PSSSB (new)                 | 62,748              |
| Punjab PCS (new)            | 61,835              |
| Punjab ETT Cadre            | 61,109              |
| PSEB Class 9-10 (new)       | 46,979              |

### 3. Punjab and UPSC tracks after the expansion

| Exam              | Questions available |
| ----------------- | ------------------- |
| Punjab Clerk      | 160,026             |
| Punjab Police     | 155,765             |
| Punjab Patwari    | 142,952             |
| PPSC Punjab       | 84,699              |
| PSTET/CTET        | 74,676              |
| State Teacher/TET | 74,676              |
| UPSC CSE          | 71,593              |
| State PSC         | 71,593              |

### 4. PSEB / NCERT Class 9-10 content

New file `src/lib/exam-bank/pseb.ts` covering the NCERT syllabus PSEB follows:

- **Science 9** — Matter in Our Surroundings, Is Matter Around Us Pure,
  Structure of the Atom, The Fundamental Unit of Life, Force and Laws of
  Motion, Sound.
- **Science 10** — Chemical Reactions and Equations, Acids Bases and Salts,
  Life Processes, Light Reflection and Refraction, Electricity.
- **Mathematics 9 and 10** — Polynomials and Trigonometry tables.
- **Social Science** — Nationalism in India, Resources and Development,
  Money and Credit.

### 5. Guided quiz flow (rebuilt as requested)

The practice panel is now an explicit numbered flow instead of a flat list:

1. **Choose subject** — all 36 subjects, or "All subjects".
2. **Which exam are you preparing?** — only the exams that actually offer that
   subject are listed, plus "All Exams". This selector did not exist before;
   the exam could previously only be changed through a preset or search.
3. **Choose chapter** — the chapters of that subject for that exam, plus
   "All chapters (mixed)" for a chapterwise mixed set.

A summary strip shows the live selection and a **Start / next question**
button begins the set. Choosing "All Exams" simply mixes every paper.

### 6. Exam tags on every question

Each generated question now carries the exam tracks it is high-yield for, and
the question card shows them under an **Important for** label. The tag matching
the currently selected exam is highlighted, so a student can see at a glance
whether an item matters for SSC, UPSC CSE, Punjab ETT Cadre and so on.

This required threading `exams` through the engine: `GeneratedQuestion` gained
an `exams` field and all four template factories now populate it.

### 7. Repetition check (300 draws per exam)

| Exam                  | Unique |
| --------------------- | ------ |
| Punjab Lecturer Cadre | 298    |
| Punjab ETT Cadre      | 298    |
| PPSC Punjab           | 297    |
| Punjab Master Cadre   | 296    |
| PSSSB                 | 294    |
| PSEB Class 9-10       | 294    |
| UPSC CSE              | 294    |
| Punjab PCS            | 292    |

### 8. Validation run

| Check                    | Result                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| `npx tsc --noEmit`       | passed                                                              |
| `npm run check`          | passed, 270 files, 0 ESLint errors                                  |
| `npm run check:pwa`      | passed                                                              |
| `npm run build`          | passed                                                              |
| `VERCEL=1 npm run build` | passed, `nodejs22.x`                                                |
| Live preview routes      | `/`, `/games`, `/test-series`, `/admin/tests`, `/downloads` all 200 |

## UPSC, Punjab state, Punjabi Paper A/B, Hindi and English expansion (latest)

### 1. Bank size after the expansion

| Metric                            | Before  | Now         |
| --------------------------------- | ------- | ----------- |
| Valid generated questions         | 250,836 | **285,848** |
| Distinct prompt + full option set | 246,722 | **278,145** |
| Malformed questions               | 0       | **0**       |
| Questions with duplicate options  | 0       | **0**       |

### 2. New subjects added this round

| Subject                        | Questions | Script     |
| ------------------------------ | --------- | ---------- |
| Polity (UPSC / State PSC)      | 8,004     | English    |
| Hindi Grammar                  | 4,040     | Devanagari |
| Punjabi Grammar                | 3,511     | Gurmukhi   |
| English Grammar                | 2,793     | English    |
| Punjab History                 | 2,651     | English    |
| Punjab GK                      | 2,617     | English    |
| Punjabi Paper B (Master cadre) | 1,817     | Gurmukhi   |
| Punjabi Paper A (ETT cadre)    | 1,455     | Gurmukhi   |
| Punjabi Literature             | 1,406     | Gurmukhi   |
| Punjab Geography               | 1,345     | English    |
| Punjab Economics               | 1,145     | English    |

### 3. Exam tracks that gained the most

| Exam                | Before | Now         |
| ------------------- | ------ | ----------- |
| Punjab Clerk        | 99,200 | **150,803** |
| Punjab Patwari      | 93,671 | **134,642** |
| PPSC Punjab         | 32,637 | **84,240**  |
| UPSC CSE            | 19,990 | **71,593**  |
| State PSC           | 19,990 | **71,593**  |
| PSTET/CTET          | 27,238 | **68,209**  |
| Punjab Master Cadre | 14,339 | **55,310**  |
| Punjab ETT Cadre    | 13,824 | **54,795**  |
| State Teacher/TET   | 13,414 | **54,385**  |

### 4. Script verification (400 draws per subject)

| Subject            | In required script | Wrong script |
| ------------------ | ------------------ | ------------ |
| Punjabi Paper A    | 400                | 0            |
| Punjabi Paper B    | 400                | 0            |
| Punjabi Grammar    | 400                | 0            |
| Punjabi Literature | 400                | 0            |
| Hindi Grammar      | 400 (Devanagari)   | 0            |
| English Grammar    | 400 (Latin)        | 0            |

### 5. Chapter coverage

Every chapter of all eleven new subjects resolves inside the bank —
**zero-coverage chapters: none**. Routing stays topic strict, so a chapter
never serves another chapter's question.

### 6. Repetition check (300 draws per exam)

| Exam                | Unique |
| ------------------- | ------ |
| Punjab Patwari      | 300    |
| Punjab Police       | 299    |
| UPSC CSE            | 298    |
| Punjab Clerk        | 298    |
| State PSC           | 298    |
| PPSC Punjab         | 297    |
| Punjab Master Cadre | 297    |
| PSTET/CTET          | 297    |
| Punjab ETT Cadre    | 296    |

### 7. Content areas covered

- **UPSC / State PSC** — Constitution articles and schedules, amendments,
  borrowed features, writs, Parliament, President and Governor, judiciary,
  Panchayati Raj, local government, Directive Principles, modern history,
  Governors-General, slogans, passes, rivers, national parks, economy terms,
  government schemes and environment conventions.
- **Punjab state** — the ten Sikh Gurus, Maharaja Ranjit Singh, Anglo-Sikh
  wars, Ghadar movement, Punjab freedom struggle, reorganisation, districts
  and headquarters, folk dances and fairs, landmarks, state symbols, regions,
  rivers, canals and dams, climate, soils and crops, Green Revolution,
  industry, budget, employment and the cooperative sector.
- **Punjabi Paper A (ETT cadre)** — ਗੁਰਮੁਖੀ ਲਿਪੀ, ਸ਼ਬਦਾਵਲੀ, ਪਠਨ ਬੋਧ,
  ਪੱਤਰ ਲਿਖਣ, ਸੰਖੇਪ ਲਿਖਣ, ਅਨੁਵਾਦ ਅਤੇ ਸਰਕਾਰੀ ਭਾਸ਼ਾ.
- **Punjabi Paper B (Master cadre)** — ਪੰਜਾਬੀ ਸਾਹਿਤ ਦਾ ਇਤਿਹਾਸ, ਗੁਰਮਤਿ ਕਾਵਿ,
  ਸੂਫ਼ੀ ਕਾਵਿ, ਕਿੱਸਾ ਕਾਵਿ, ਨਾਵਲ, ਕਹਾਣੀ, ਨਾਟਕ ਅਤੇ ਭਾਸ਼ਾ ਵਿਗਿਆਨ.
- **Hindi** — संधि, समास, कारक, संज्ञा-सर्वनाम, क्रिया और काल, पर्यायवाची,
  विलोम, मुहावरे, रस और अलंकार.
- **English Grammar** — tenses, concord, articles, prepositions, voice,
  narration, error spotting and phrasal verbs.

All content is written in-house from standard public syllabus material. No
question is copied from any published examination paper.

## Mega exam question bank + admin test question writer (latest)

### 1. Question bank scale — measured by full enumeration

The bank is template driven. Every template declares a finite parameter space
and a deterministic `at(index)` builder, so the totals below are produced by
walking **every single index**, not by estimation.

| Metric                            | Result  |
| --------------------------------- | ------- |
| Declared parameter space          | 259,375 |
| Valid generated questions         | 250,836 |
| Distinct prompt + answer          | 187,375 |
| Distinct prompt + full option set | 246,722 |
| Malformed questions               | 0       |
| Questions with duplicate options  | 0       |

### 2. Coverage by subject

| Subject               | Questions |
| --------------------- | --------- |
| Quantitative Aptitude | 79,385    |
| Mathematics           | 41,081    |
| General Awareness     | 39,958    |
| Biology               | 15,139    |
| Chemistry             | 14,813    |
| English Language      | 11,139    |
| Cost Accounting       | 10,015    |
| Accounting            | 8,734     |
| Physics               | 8,674     |
| Banking Awareness     | 7,616     |
| Reasoning             | 5,529     |
| Computer Awareness    | 4,029     |
| Business Law          | 2,600     |
| Business Economics    | 1,504     |
| Taxation              | 620       |

### 3. Difficulty mix (all three levels requested)

| Difficulty | Questions |
| ---------- | --------- |
| Easy       | 132,914   |
| Moderate   | 95,601    |
| Difficult  | 22,321    |

### 4. Coverage by exam track

| Exam                            | Questions available |
| ------------------------------- | ------------------- |
| SSC                             | 161,132             |
| Railway                         | 161,132             |
| Banking                         | 150,548             |
| UPSC/SSC/Bank                   | 147,656             |
| CUET                            | 137,346             |
| Punjab Police                   | 125,885             |
| CBSE/ISC Class 11-12 Science    | 79,707              |
| JEE Main                        | 64,568              |
| JEE Advanced                    | 53,984              |
| State Police                    | 40,971              |
| NEET                            | 38,626              |
| CA Foundation / CA Intermediate | 23,473              |

### 5. Repetition check — unique questions per session

| Session                      | Result         |
| ---------------------------- | -------------- |
| Banking, 400 draws           | 399 unique     |
| Railway, 400 draws           | 398 unique     |
| SSC, 400 draws               | 399 unique     |
| NEET, 400 draws              | 397 unique     |
| JEE Main, 400 draws          | 400 unique     |
| CA Foundation, 400 draws     | 391 unique     |
| Every new subject, 300 draws | 219-299 unique |

### 6. Chapter routing

- 126 bank-backed chapters checked; 120 resolve inside the exam bank.
- The 6 legacy Reasoning chapters (Analogy, Series, Coding-Decoding, Syllogism,
  Blood Relation, Seating Arrangement) have no bank template and deliberately
  fall through to their existing chapter-correct generators.
- `makeExamBankQuestion` is **topic strict**: it never serves another chapter's
  question, so exam/subject/chapter routing stays exact.

### 7. Admin test question writer

New screen at `/admin/tests` (linked from the admin dashboard):

- Create, rename, retime, publish/unpublish and delete a test.
- Write a question with 2-6 options, tap a circle to mark the correct answer.
- Set subject tag, marks, negative marks and an explanation per question.
- Edit, reorder (up/down) and delete existing questions.
- Server side validation rejects empty options, duplicate options and a correct
  index that points at an empty option.
- Questions live in the existing `public.test_questions` table, so **no new
  database migration is required**. The existing trigger
  `refresh_test_question_counts` keeps `questions_count` and `total_marks` in
  sync automatically.
- Kit 2 Coins is untouched: the writer is in the Test series only, as requested.

### 8. Validation run

| Check                                       | Result                             |
| ------------------------------------------- | ---------------------------------- |
| `npx tsc --noEmit`                          | passed                             |
| `npm run check` (repo + lint + tsc + build) | passed, 136 files, 0 ESLint errors |
| `npm run build`                             | passed                             |
| `VERCEL=1 npm run build`                    | passed, `nodejs22.x`               |
| `npm run check:pwa`                         | passed                             |
| ZIP integrity (`unzip -t`)                  | no errors, 265 files               |

Date: 2026-09-30

## Environment tested

- App name: `KKCC-excellence-hub`
- Node/npm install using `npm install`
- Local dev server: `npm run dev -- --host 0.0.0.0`
- Supabase project configured in source/templates: `crrtkacxakinzpxcxbzf`
- Owner/admin email configured in SQL/docs: `kkcc23102003@gmail.com`

## 2026-09-30 Quiz question quality + colourful question text validation

Result: **Passed.** The quiz now uses a verified factual question bank, and only the question sentence is colourful.

Changes made in this round:

- Removed the decorative colour treatment that had been added across the Quiz Zone layout. The hero, filters, quick-practice cards, option buttons, stat cards and explanation panel are back to the standard KKCC surface style.
- Added the new `quiz-question-text` utility in `src/styles.css`. Only the question sentence is rendered with a KKCC teal → cyan → lime → gold → pink gradient, with a plain-primary fallback for browsers without `background-clip: text`.
- Added `src/lib/quiz-question-bank.ts`, an original factual MCQ bank with 591 questions covering **all 166 chapters** in `KITTU_SUBJECT_TOPICS`. Every entry has one correct answer, three plausible distractors and an explanation.
- Removed every "what is the best strategy / which habit improves score / what should be revised first" style generated question. Those vague prompts were the cause of items such as "Polity: which clue is asked most". All generators now fall back to real examinable questions.
- Hindi questions remain Devanagari and Punjabi questions remain Gurmukhi.
- Replaced the biased `sort(() => Math.random() - 0.5)` option shuffle with an unbiased Fisher-Yates shuffle.
- Extended the anti-repeat signature to include the option set, so chapters that legitimately reuse a stem such as "choose the correct sentence" are no longer treated as duplicates.

Generated-question audit (157,440 questions across every exam, subject, chapter and practice mode):

| Metric                                    | Result                        |
| ----------------------------------------- | ----------------------------- |
| Malformed questions                       | 0                             |
| Questions with duplicate options          | 0                             |
| Study-advice style prompts                | 0                             |
| Correct-answer position spread (A/B/C/D)  | 25.1% / 25.0% / 25.1% / 24.9% |
| Chapters with fewer than 3 real questions | 0                             |
| 200-question mixed session                | 200 distinct questions        |
| 40-question single-chapter session        | 9 distinct questions          |

## 2026-09-30 Colourful Quiz discovery + private-content hardening validation

Result: **Passed by source, SQL, route, build and deployment-adapter checks.** Live credential-backed Supabase RLS round trips were not available in this sandbox, so the newest timestamped migrations must still be executed in the live project before relying on production access behavior.

Completed feature and hardening changes:

- Added colourful KKCC-brand Kit 2 Coins Quiz entry points in the desktop header, mobile navigation card, bottom navigation, home hero, promoted home Quiz Zone, student dashboard and global search.
- Added `/quiz` as a fast redirect to `/games`; fresh preview verified `/quiz` follows to `/games` with HTTP 200.
- Public paid-course lecture reads now return free previews only; active, unexpired, unblocked enrolled students receive the full deck through an authenticated server function and RLS.
- Public paid/course-included material rows no longer expose private `file_url` values through ordinary direct reads after `20260930110000_mask_private_material_urls.sql`; public notes/pricing metadata stays available through `list_public_materials`, while access is released by the existing entitlement RPC.
- The private `course-content` bucket upload limit is now aligned to 45 MiB (`47185920` bytes) and anonymous/public storage object SELECT/read access was removed.
- `/secure-video.html` remains token/ID validated and YouTube-only; `X-Frame-Options` and CSP were changed to allow same-origin app embedding while rejecting external framing.
- Cleaner SQL now also removes the newest helper functions/storage policy when an intentional full reset is requested.

Current SQL artifact hashes:

```txt
combined SQL SHA-256: 88ace68b5f5aaebc724d494695245fdb5bd6a686ee6ebc6e00ea4fa9a6f3ea09
SQL cleaner SHA-256: 200763caf5b4394162d7371fac242d7e14338700fd4700dcbb80c69161e82b02
```

Final packaged source ZIP has 250 files and passed `unzip -t`; because the archive contains this report, its final SHA-256 is reported with the delivered files rather than embedded here.

Validation performed for this round:

- Prettier completed on touched TS/TSX/MD/HTML/JSON files.
- Repository-quality check passed on 136 source files.
- ESLint passed with 0 errors and 11 existing React Fast Refresh warnings only.
- `tsc --noEmit` passed after TanStack route generation.
- Production `npm run build` passed and generated `/quiz` in `src/routeTree.gen.ts`.
- `VERCEL=1 npm run build` passed and generated the Vercel/Nitro adapter output (`nodejs22.x`, Build Output API, web entry).
- `npm run check:pwa` passed.
- `npm audit --omit=dev --audit-level=high` found 0 vulnerabilities.
- Fresh production preview smoke test passed for `/`, `/games`, `/quiz`, `/test-series`, `/login`, `/signup`, and `/learn`; homepage/Quiz pages exposed Kit 2 Coins branding and no visible `Kittu` branding.
- Secret-pattern and browser-facing suspicious-URL scans found no committed service-role/Razorpay secret values and no unrelated `views.kittu@gmail.com` URL.

## Automated checks

| Check                                                                                                     | Result                                                               |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `npm install`                                                                                             | Passed                                                               |
| `npx prettier --write` on touched TS/TSX files                                                            | Passed                                                               |
| `npm run check`                                                                                           | Passed                                                               |
| `npm run lint`                                                                                            | Passed with 9 React Fast Refresh warnings only                       |
| `tsc --noEmit`                                                                                            | Passed                                                               |
| `npm run build`                                                                                           | Passed                                                               |
| `VERCEL=1 npm run build`                                                                                  | Passed and generated Vercel Build Output API files for SSR/functions |
| Local route smoke test                                                                                    | Passed                                                               |
| Route tree check for `/admin/content`, `/admin/settings`, `/admin/offline-access`, `/admin/notifications` | Passed                                                               |
| Scan for old Supabase project ID in source/docs                                                           | Passed                                                               |
| Scan for direct SQL deletion from `storage.objects` / `storage.buckets`                                   | Passed                                                               |
| ZIP integrity via `unzip -t`                                                                              | Passed for final rebuilt ZIP                                         |

## Smoke-tested routes

The following routes returned HTTP 200 from the local preview server:

- `/`
- `/courses`
- `/classes`
- `/study-material`
- `/test-series`
- `/results`
- `/support`
- `/faculty`
- `/login`
- `/signup`
- `/admin`
- `/admin/content`
- `/admin/settings`
- `/admin/app-builder`
- `/admin/coupons`
- `/admin/notifications`
- `/admin/doubts`
- `/admin/enquiries`
- `/admin/offline-access`
- `/admin/branding`

## 2026-09-29 security/app-control validation

Latest checks run after the Security & App Controls, professional-copy, responsive Notes, private-cache and content-protection updates:

- `npm run format` passed.
- `npm run check:repo` passed against 136 source files.
- `npm run lint` passed with 0 errors and 11 existing React Fast Refresh warnings only.
- `npx tsc --noEmit` passed after route generation.
- `npm run build` passed; `/admin/security` is registered in `src/routeTree.gen.ts`.
- `npm run check:pwa` passed.
- Fresh preview smoke test passed for `/`, `/games`, `/test-series`, `/study-material`, `/admin`, `/dashboard/materials`, `/learn`, `/support`, `/downloads`, `/admin/security`, `/manifest.webmanifest`, and `/sw.js` with HTTP 200.
- Public copy marker scan on Home, Study Material and Games found no unwanted demo, made-up, “without admin control,” or internal admin-panel wording.
- Study Material returned ~0.006s in the local preview after warm-up.
- Private dashboard/admin/learn/test/checkout/coin pages are excluded from service-worker page caching; protected public/student surfaces now have practical copy/selection/context-menu/print/screenshot-shortcut/inspection-tool deterrents plus identity watermarking.
- Latest migration `20260929150000_security_app_controls_and_health.sql` must be executed before using `/admin/security` in Supabase production mode.

## Latest UV logo/theme refresh

- Bundled the provided KKCC K-logo as the default public logo asset (`/logo.png`) and kept matching favicon/PWA icons active.
- Updated default branding to use the bundled logo path, so fresh installs show the supplied logo without requiring admin upload.
- Added a safe migration `20260926000000_uv_logo_branding_refresh.sql` to refresh old default branding values to the new UV look without overwriting custom admin colours.
- Updated the frontend theme to a K-logo-inspired UV/neon palette: dark ink base, electric teal-cyan primary glow, warm golden cream accent, soft UV glow cards, and colourful gradient text.
- Default theme now opens in dark UV mode unless the user manually switches theme later.
- PWA manifest theme/background colours were updated to the new UV brand palette.

## Latest real-data cleanup / public stats feature

- Removed remaining user-facing static faculty/result/test/notification fallback data from the app source.
- Home hero now displays real aggregate platform counters from Supabase: students joined, published courses, lectures, materials, and tests.
- Added `supabase/migrations/20260925000000_public_platform_stats.sql` with a safe public aggregate RPC (`get_public_platform_stats`) that exposes only counts, never student personal data.
- Faculty list and faculty profile pages are now generated from published course `faculty` fields, so admin-added courses update faculty pages automatically.
- Global search now uses dynamic faculty generated from published courses and no longer lists unavailable static tests.
- Results page no longer renders static result cards; verified achievements can be added through admin content/custom sections.
- Course/test/material/live dashboard screens continue to read published Supabase/admin data with clear empty states when nothing is published.

## Latest website-content and movable-block feature

- Admin → Website content page: `/admin/content`.
- Admin can edit navigation/auth/admin/dashboard labels.
- Admin can edit public page headings and descriptions for Courses, Classes, Study Material, Test Series, Results, Support, and Faculty.
- Admin can edit home-page feature strip, course-discovery copy, faculty copy, support contact/form text, FAQ entries, footer columns/links, test-series extra copy, and results quote.
- New movable custom blocks allow admin to add a block/card/notice/banner, choose target page, choose top/bottom position, set order, enable/disable, and shift it from one public page to another without coding.
- Movable blocks render on Home, Courses, Classes, Study Material, Test Series, Results, Support, and Faculty pages.
- Public header, footer, home page, and key public pages read content from `site_settings.key = website_content_json` with safe built-in defaults.
- Fresh setup SQL includes `website_content_json`, so future text/page-block changes can be saved from admin without code edits.

## Latest social/app links feature

- Admin → Social/app links page: `/admin/settings`.
- Social links are no longer limited to only YouTube/Instagram/Facebook/Telegram/WhatsApp.
- Admin can add any future app/community/social link, rename it, paste its URL, reorder it, hide/show it, or delete it without coding.
- New dynamic social/app list is stored in `site_settings.key = social_links_json`.
- Existing legacy social keys still work as fallback, so old saved links are preserved.
- Footer renders the enabled custom social/app links automatically.

## Latest login/signup redirect behavior

- Login now redirects to `/` by default instead of `/dashboard`, unless a protected page explicitly passes a `redirectTo`.
- Signup immediate-session success redirects to `/` instead of `/dashboard`.
- Email confirmation auth callback defaults to `/` instead of `/dashboard`.
- The student dashboard remains available from the header/dashboard button after login.

## Latest App Builder / live custom-code feature

- New Admin → App Builder page: `/admin/app-builder`.
- Admin can save a prompt/future-feature note, custom top HTML, bottom HTML, global CSS, and advanced custom JavaScript.
- Live snippets are stored in `site_settings.key = app_builder_json` and render from Supabase without downloading a fresh ZIP or redeploying.
- This is suitable for banners, notices, widgets, embeds, forms, app badges, and styling changes. Full backend/React source changes may still require normal redeploy for safety.
- ESLint config now ignores generated `.vercel`, `dist`, `node_modules`, and download artifacts so validation does not appear to hang after Vercel builds.

## Latest coupon feature

- New Admin → Coupons page: `/admin/coupons`.
- Admin can create/edit/delete coupon codes with up to 100% discount, active/inactive status, start date, expiry date, course scope, per-user limit, and max usage limit such as 200 people.
- Coupon usage is tracked in `coupon_redemptions`; `coupon_codes.used_count` increments on redemption.
- When max usage is reached, redemption function marks the coupon inactive automatically. Admin can extend access by increasing max uses and reactivating the coupon.
- 100% coupon redemption can unlock course access directly for logged-in students and records a coupon payment audit.

## Latest admin notifications feature

- New Admin → Notifications page: `/admin/notifications`.
- Admin can create/edit/delete in-app notifications with title, message, type, priority, optional action button/link, schedule time, expiry time, and publish/draft state.
- Audience options: all users, students, admins, or students enrolled in a selected course.
- Student dashboard notifications page now reads Supabase notifications, shows unread state, and supports mark-read / mark-all-read through `notification_reads`.
- Course/batch publish flow now automatically creates a “New batch added” notification for students when a draft batch becomes published.
- Notifications now support personal `audience = user` targeting through `target_user_id`, used by doubt replies.
- New lecture creation, published study material, and published tests/MCQ tests create course-targeted notifications for enrolled students.
- Fresh setup SQL and migration add `notifications`, `notification_reads`, RLS policies, indexes, and timestamp triggers.

## Latest MCQ auto-test builder feature

- Admin course editor now includes “Paste MCQ text and auto-create test” in the Tests section.
- Admin can paste numbered MCQs in text format with A/B/C/D options and `Answer: B`; optional `Explanation:` lines are saved.
- The parser creates a `tests` row and matching `test_questions` rows with marks/negative marks, duration, subject, and publish/draft setting.
- Public test runner now loads only saved DB questions for each published test. If questions are not published yet, it shows a clear unavailable message instead of any built-in fallback questions.
- Fresh setup SQL and migration add `test_questions`, published-test read policies, admin manage policies, indexes, and count/marks refresh trigger.

## Latest futuristic student support feature

- New Student → Ask Doubt page: `/dashboard/doubts`.
- Students can submit course/batch-wise or general academic doubts with subject, title, full question, priority, and optional attachment link.
- New Admin → Doubts page: `/admin/doubts`.
- Admin/faculty can view open/high-priority doubts, see student/course context, reply, close, or delete.
- Replying to a doubt creates a personal in-app notification for that student and the answer appears on the student doubt page.
- Fresh setup SQL and migration add `student_doubts`, personal notification targeting via `notifications.target_user_id`, RLS policies, indexes, and timestamp triggers.

## Latest student section feature

- Added dedicated student route `/dashboard/student`.
- Student can view their profile summary: name, email, mobile, class/stream, and target exam.
- Student can view active enrolled batches/courses with access source (`free`, `offline`, `admin`, `razorpay`, etc.), payment method, amount paid, enrolled date, expiry date, validity progress, and exact days left.
- Lifetime/no-expiry, expiring soon, expired, and revoked statuses are clearly labelled.
- Expired/revoked enrollments stay visible under Access History.
- Dashboard overview now shows real active-batch count, nearest validity, profile completion, and a shortcut to Student Section.
- My Courses page now displays validity information for enrolled/access rows.
- Mobile bottom navigation now links directly to Student Section.
- Mobile bottom navigation now has a separate Notes shortcut pointing to `/dashboard/materials` so students can directly access notes/materials.

## Latest performance/smoothness pass

- Reduced always-loaded layout JS by lazy-loading Global Search and replacing the heavy mobile Sheet with a lightweight drawer.
- Lazy-loaded toast UI and PWA update helper after browser idle, reducing work during first paint.
- Converted header/admin shortcut auth checks to shared lazy auth context plus cached admin-role query to avoid duplicate Supabase session/admin calls.
- Added local browser cache for public branding, website content, and App Builder settings so refresh renders instantly and updates in the background.
- Updated React Query defaults: 60s stale time, 10min GC, no refetch-on-window-focus, single retry.
- Enabled route intent preloading with 60s preload stale time for smoother page-to-page navigation.
- Upgraded service worker to `kkcc-excellence-hub-v2` with static asset stale-while-revalidate, public route stale-while-revalidate, and private admin/dashboard network-first mode.
- Added PWA update/cache helper as the extra useful feature: it appears for waiting updates or detected slow loads and can clear KKCC-only cache/reload.
- Bundle check: layout client chunk dropped from about 56K to about 20K after lazy search/mobile-menu optimization; main client chunk dropped from about 360K to about 328K.

## Latest admission/enquiry CRM feature

- Public Support page form now stores admission/batch enquiries in Supabase instead of only showing a local success toast.
- The form collects name, email, phone/WhatsApp, class/target, interested batch/course, and message.
- New Admin → Enquiries page: `/admin/enquiries`.
- Admin can manage leads with status (`new`, `contacted`, `admitted`, `closed`, `spam`), priority, follow-up notes, and last-contacted timestamp.
- New enquiry insert triggers an admin in-app notification linking to `/admin/enquiries`.
- Fresh setup SQL and migration add `admission_enquiries`, RLS policies, indexes, timestamp trigger, and admin-notification trigger.

## Latest offline-access feature

- Admin → Offline access page: `/admin/offline-access`.
- Admin can enter student Gmail, full name, course, amount paid, method, expiry date, and notes after offline payment.
- If the Gmail already has a profile, the app activates the course enrolment immediately and records a best-effort offline payment audit.
- If the Gmail has not signed up yet, the grant is stored as pending in `offline_access_grants`.
- Fresh setup SQL and migration add `offline_access_grants`, admin-only RLS policies, indexes, updated timestamp trigger, and `activate_offline_access_for_user()`.
- The auth profile trigger now calls `activate_offline_access_for_user()` so pending Gmail grants automatically activate after later signup.
- Existing manual enrolment at `/admin/students` remains available for already-created student profiles.

## Upload/admin/platform features verified in source

- Uploads try direct Supabase `course-content` upload first, so admin settings/upload-target server issues should not block normal PDF uploads.
- If direct browser upload hits a network-style failure and the file is small enough, a Vercel server-side Supabase fallback upload is attempted.
- Long Supabase signed URLs are accepted for course/material `file_url`, `thumbnail_url`, `public_url`, and `original_url` fields up to 4000 characters.
- YouTube lecture URL field allows longer URLs while still validating YouTube-only links.
- Upload metadata recording is best-effort, so a metadata-table/server-function issue does not cancel a successful Supabase upload.
- Supabase SQL stores URLs in `text` columns, not short varchar fields.
- Cleanup SQL files no longer directly delete from Supabase Storage system tables; storage file cleanup should be done through Supabase Storage UI/API if needed.
- Free courses bypass Razorpay and open directly.
- Paid courses show offline/admin enrolment instructions until Razorpay is enabled from Admin → Payments.
- Admin panel includes course CMS, YouTube-only lecture links, PDF/notes/material upload, thumbnail upload, role management, manual student enrolment, offline Gmail grants, payment settings, storage settings, dynamic social/app links, branding/theme settings, and wider website-content settings.
- Lecture editor does not offer video-file uploads; videos are published through YouTube links only.
- Uploads use the browser file picker, so Android/Chrome can choose files from Files, Downloads, Gallery, Drive, and other supported providers.
- PWA files are present: `public/manifest.webmanifest`, `public/sw.js`, `public/icon-192.png`, and `public/icon-512.png`.
- Old Lovable/Bun lock wiring was removed from the source ZIP.

## Notes / live backend limits

- After running cleanup SQL, `supabase/RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql` must be run again before production use.
- Live Supabase Auth, RLS, uploads, admin role changes, branding/content saves, dynamic social/app link saves, App Builder saves, coupon writes/redemptions, notification writes/read receipts, personal notifications, student doubt writes/replies, admission enquiry submissions/lead updates, MCQ question imports, offline grant writes, and enrolment writes require the SQL setup and a signed-in admin user in project `crrtkacxakinzpxcxbzf`.
- This sandbox does not have the user's live browser login/admin session, so real production upload/admin clicks cannot be completed here. Code/build/schema checks passed, and the deployed Vercel project must be redeployed with this latest source to receive the upload, branding, website-content, social/app-link, notification, doubt-centre, admission-enquiry CRM, auto-update notification, MCQ test-builder, coupon, and offline-access fixes.
- Secret values such as Supabase service-role, Razorpay secret, and storage secret keys are intentionally not included in the ZIP.

## 2026-09-26 Full App Recheck — Fake Button/Data Cleanup

- Rechecked public and protected routes after the latest KKCC comeback-design pass.
- Fixed `/results` TanStack stub and replaced it with a real KKCC results empty-state page; no fake toppers/results are displayed.
- Rebuilt `/classes` from real admin-published courses instead of hard-coded sample batches/schedules.
- Removed fake/static learning progress from dashboard courses; validity progress remains based on real enrollment dates only.
- Updated Learn page progress to start at zero and save only student-marked lecture completion locally.
- Replaced the non-functional paid checkout Razorpay CTA with an honest support/offline access flow while keeping free courses and 100% coupons functional.
- Corrected course preview and dashboard live-recording links to open the relevant Learn page/course where possible.
- Cleaned support contact placeholders to transparent admin-managed wording.
- Validation passed: `npx tsc --noEmit`, `npm run lint` (0 errors, existing Fast Refresh warnings only), `npm run build`, focused preview smoke checks for `/`, `/classes`, `/results`, `/checkout`, `/learn`, `/dashboard/live`, `/dashboard/courses`, `/study-material`, `/test-series`, and `/support`.
- Final ZIP refreshed and preview download verified against the root ZIP.

## 2026-09-26 — Hardcore Final App QA

Result: **Passed**. No blocking bug, build error, broken internal link, missing core asset, or visible runtime error was found in the final production preview.

Checks completed:

- `npm run check` passed: lint, TypeScript, and production build completed successfully.
- Lint result: 0 errors; 9 existing Fast Refresh warnings only.
- Fresh production preview restarted on port `4173`.
- 37 key routes returned HTTP 200, including public pages, auth pages, student dashboard pages, and admin pages.
- 7 static/PWA/download assets returned HTTP 200, including logo, icons, manifest, service worker, and ZIP download.
- Internal crawler verified 171 same-origin links/assets from rendered pages; all returned HTTP 200.
- Homepage confirmed to show `Learn with clarity. Practice with courage. Rise with confidence.`.
- Old 23KAAT/Double Vision/One-focused hero wording was not visible in public pages.
- Public visible-text scan did not find student-facing Supabase wording.
- No direct browser-source `localhost` or `127.0.0.1` references found.
- `git diff --check` passed.
- PWA manifest parsed successfully and all referenced icons exist.
- Supabase SQL migration quick parse check passed.
- Runtime dependency audit passed with 0 critical production vulnerabilities.
- ZIP integrity test passed and preview-served download matched the local ZIP byte-for-byte.

## 2026-09-26 — Cross-device Performance + PWA Optimization Pass

Result: **Passed**. The app was optimized and revalidated for smoother phone/tablet/desktop usage, Chrome installability, low-power devices, and future store-wrapper readiness.

Optimizations added:

- Smarter service worker cache strategy with app shell, offline fallback, cache-first hashed assets, network-first pages, and download-cache exclusion.
- Chrome/desktop install prompt plus iOS/iPad home-screen guidance component, loaded after idle so initial render stays light.
- PWA manifest strengthened with app `id`, `display_override`, shortcuts, launch handler, and `prefer_related_applications: false`.
- Mobile/iOS meta improved with `viewport-fit=cover`, mobile app capable tags, status-bar style, color scheme, and format detection.
- Early performance boot script adds low-power/coarse-pointer/standalone classes before CSS loads.
- CSS tuned for smoother low-end/mobile rendering: lighter blur/shadows/glow on touch devices, no fixed background on mobile, low-power animation reduction, safe-area handling, stable fixed bars, and content-visibility utilities.
- Homepage below-fold sections and admin-published custom sections now use content-visibility optimization.
- Logo/icon PNGs were losslessly re-compressed; pixel diff was 0.
- Images/videos/iframes received async/lazy/preload hints where appropriate.
- React Query stale/gc/preload timings were tuned to reduce repeated network work.
- Admin custom JS from App Builder now runs during idle time instead of blocking first paint.
- Added `PWA_STORE_PUBLISHING_GUIDE.md` for Chrome install, Android TWA, and future iOS wrapper publishing notes.

Validation completed:

- `npm run check` passed: lint, TypeScript, production build.
- Lint result: 0 errors; 9 existing Fast Refresh warnings only.
- Fresh production preview restarted on port `4173`.
- 37 key routes returned HTTP 200.
- 7 static/PWA assets returned HTTP 200: logo, favicon, icons, manifest, service worker, offline page.
- Internal crawler verified 171 same-origin URLs/assets; all returned HTTP 200.
- Service worker syntax check passed with `node --check public/sw.js`.
- PWA manifest parsed successfully and all referenced icons exist.
- Source scan found no browser-facing localhost/127.0.0.1 references.
- Old 23KAAT/Double Vision/One-focused hero text was not present in visible app routes/components.
- `git diff --check` passed.
- Production dependency audit passed with 0 critical vulnerabilities.

## 2026-09-26 — Hybrid Editable Text Manager Pass

Result: **Passed**. Hybrid editable text mode was added without making every technical/admin label editable.

Added:

- New admin route: `/admin/text-manager`.
- Supabase-backed setting key: `site_settings.ui_text_json`.
- Public-safe UI text provider with default fallback and local cache key `kkcc-public-ui-text-v1-hybrid`.
- Editable groups for selected auth/login/signup/reset text, student dashboard headings/empty states/support/profile copy, install prompt copy, and root 404/error fallback copy.
- Admin-only save/reset controls with schema validation and blank-field fallback protection.
- Text Manager shortcuts from Admin Dashboard and Admin Content.
- Migration seed: `supabase/migrations/20260926007000_hybrid_ui_text_manager.sql` and consolidated SQL update in `supabase/RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql`.

Validation completed:

- `npm run check` passed: lint, TypeScript, and production build.
- Lint result: 0 errors; 10 Fast Refresh warnings only.
- Fresh production preview restarted on port `4173`.
- Key public/auth/student/admin routes returned HTTP 200, including `/admin/text-manager`.
- PWA/static assets returned HTTP 200: manifest, service worker, logo, offline page.
- Service worker syntax check passed with `node --check public/sw.js`.
- PWA manifest parsed successfully.
- Hybrid UI text SQL seed and consolidated SQL dollar-quote quick scan passed.
- Source scan confirmed old rejected hero text was not reintroduced.
- `git diff --check` passed.
- Production dependency audit passed with 0 critical vulnerabilities.

Notes:

- This is intentionally hybrid mode: critical validation, security, destructive admin controls, backend logic, and technical labels remain stable unless safely exposed with defaults.

Final hybrid package:

- ZIP path: `kkcc-excellence-hub-termux-vercel.zip`
- Download path: `/downloads/kkcc-excellence-hub-termux-vercel.zip`
- Final SHA256 is reported with the delivered ZIP after packaging.
- `unzip -t` passed and preview-served download matched the local ZIP byte-for-byte.

## 2026-09-26 — Cross-device Smoothness + Chrome Installability Tune-up

Result: **Passed**. Added an extra smoothness pass focused on phone/tablet/desktop/Mac usage, high-refresh screens, Termux-hosted previews, and Chrome PWA installation.

Optimizations added:

- Startup performance script now detects low RAM/CPU, save-data/slow network, coarse pointer, standalone mode, and high-refresh displays before the main app hydrates.
- Service worker upgraded to `v5-smooth` with navigation preload support, smarter app/asset/page cache buckets, cache-size limits, and download-cache exclusion.
- Service worker registration is deferred until browser load/idle with `updateViaCache: none`, so first paint stays lighter while installability remains active.
- Sticky header scroll state is now requestAnimationFrame-throttled to avoid scroll jank on Android/iOS/tablets.
- Mobile/tablet CSS now uses lighter blur/shadow work, Safari `-webkit-backdrop-filter` support, reduced-transparency fallback, save-data mode, and high-refresh shorter transform-based motion.
- Added `npm run check:pwa` for one-command manifest/service-worker/icon installability checks.
- Updated PWA/store publishing guide and Termux/Vercel guide with the new smoothness and PWA checks.

Validation completed:

- `npm run check:pwa` passed.
- `node --check public/sw.js` passed.
- `npm run check` passed: lint, TypeScript, and production build.
- Lint result: 0 errors; 10 Fast Refresh warnings only.
- Fresh production preview restarted on port `4173`.
- Key public/auth/student/admin routes returned HTTP 200, including `/admin/text-manager`.
- PWA/static assets returned HTTP 200: manifest, service worker, logo, favicon, icons, offline page.
- Preview service worker contained the new `app-v5-smooth`, `navigationPreload`, and `CACHE_LIMITS` logic.
- Source scan found no browser-facing localhost/127.0.0.1 references and no rejected old hero text outside internal DB-normalization fallbacks.
- `git diff --check` passed.
- Production dependency audit passed with 0 critical vulnerabilities.

Notes:

- Chrome install is ready through the PWA manifest and service worker. Future Play Store/App Store publishing can wrap the same PWA later through Android TWA and iOS native wrapper/Capacitor style packaging.

## 2026-09-26 — Crisp KKCC Logo / Launcher Icon Fix

Result: **Passed**. Replaced the blurry launcher/PWA icon source with a sharper KKCC K-book logo in the same teal/gold education style used by the website.

Changed:

- Refreshed `public/logo.png` for the website header/logo.
- Refreshed PWA/install icons: `icon-96`, `icon-128`, `icon-180`, `icon-192`, `icon-256`, `icon-384`, `icon-512`, `icon-1024`, `apple-touch-icon`, and favicon.
- Updated manifest icon list to include multiple crisp launcher sizes.
- Bumped service-worker cache buckets to `v6-logo-refresh` so redeploys fetch the new logo assets.

Validation completed:

- `npm run check:pwa` passed.
- `node --check public/sw.js` passed.
- `npm run check` passed: lint, TypeScript, and production build.
- Lint result: 0 errors; 10 Fast Refresh warnings only.

Notes:

- No Supabase SQL/database change is required for this logo fix.
- Android may keep the old installed PWA icon cached; after redeploy, remove/uninstall the old KKCC app shortcut and install it again from Chrome.

## 2026-10-01 hardcore quality/security pass

- Added one shared `isPublishableQuestion` gate used by the test-bank drawer and runtime sample-question path. It rejects malformed options, duplicate options, empty/placeholder explanations and known placeholder/strategy-style leakage phrases instead of filling a paper with weak content.
- Tightened three high-yield science facts for exam-safe wording: the greenhouse-gas item now specifies anthropogenic emissions, universal-donor is explicitly for red-cell transfusion, and the highest peak entirely within India is corrected to Nanda Devi.
- Closed an access hole in unlimited advanced mode: `/games?...level=advanced` now checks for a live enrolment in the matching paid series before enabling the Difficult-only endless paper.
- Existing series enrolment flow remains: expiry is shown, enrolled series/tests appear first, Start Learning opens Subject → Chapter → Test, and the mobile three-line menu exposes Active Series, My Courses and Student Section.
- Admin navigation includes Amazon / Flipkart reward-card management; the existing migration remains required before those database-backed options can operate.
- Repository-quality check passed on 348 source files after this pass.
- Full TypeScript/build verification could not be rerun in this isolated ZIP because dependencies are not installed and `npm ci` timed out. A direct `tsc` invocation confirmed the environment is missing project type dependencies; it did not report a syntax error in the edited files before dependency-resolution errors.
