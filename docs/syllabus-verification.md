# Official syllabus verification

Purpose: check every exam already in the app against the conducting body's own
notification or syllabus document, and correct the app where the two differ.
The official document wins. Nothing here is written from memory or from a
coaching website.

Round 1 and round 2 date: 30 September 2026.

Code that enforces these findings: `src/lib/exam-bank/official-syllabus.ts`.
Each rule in that file carries the source document it came from.

---

## Status by exam

| Exam | Official source reached | Verdict | Fixed |
|---|---|---|---|
| NEET UG | Yes — NMC (UGMEB) syllabus | **Wrong** | Yes |
| JEE Main | Yes — NTA JEE (Main) syllabus | **Wrong** | Yes |
| JEE Advanced | Yes — JAB / jeeadv.ac.in | Minor | Yes |
| UPSC Civil Services | Yes — Exam Notice 05/2026-CSE PDF | Minor | Yes |
| SSC CGL | Yes — official CGL 2025 notice PDF | Correct | n/a |
| Punjab ETT Cadre | Yes — ERB Punjab revised scheme and syllabus | **Wrong** | Yes |
| CTET | Yes — official CTET February 2026 Information Bulletin | **Incomplete** | Yes |
| PSTET | Yes — SCERT Punjab PSTET structure and syllabus | **Missing entirely** | Yes |
| Punjab Master Cadre | Yes — ERB Punjab subject syllabus notice | **Wrong** | Yes |
| PSSSB / Patwari | Yes — PSSSB Advt. 02/2026 syllabus and scheme | **Wrong** | Yes |
| Punjab PCS (PPSC) | Yes — PPSC combined competitive exam notification | **Wrong** | Yes |
| NDA / CDS | Yes — UPSC NDA & NA (II) 2026 notification, Appendix I | **Wrong** | Yes |
| SSC CHSL / MTS | Yes — SSC scheme of examination | **Wrong** | Yes |
| Banking (IBPS) | Yes — IBPS CRP PO/MT structure | **Wrong** | Yes |
| RRB NTPC / Group D / ALP | Yes — RRB CEN scheme of examination | **Wrong** | Yes |

Anything marked "Not verified" is unchanged in the app. It is not claimed to be
correct. It is queued for round 2.

---

## NEET UG — was wrong, now corrected

Source: National Medical Commission, Undergraduate Medical Education Board,
NEET UG syllabus (Physics 20 units, Chemistry 20 units, Biology 10 units).

**Error 1 — Class 10 board chapters were feeding the NEET series.**
The app tagged five `Biology Class 10` chapters to NEET. NEET UG is a Class 11
and 12 paper. Those chapters are now excluded from NEET.

**Error 2 — NEET Chemistry carried units the NMC has removed.**
The NMC syllabus does not contain Solid State, Surface Chemistry, Polymers,
Chemistry in Everyday Life, Hydrogen, s-Block Elements, Environmental Chemistry
or States of Matter. The app was serving all of these under NEET. Removed:

- States of Matter
- Surface Chemistry
- Hydrogen and the s-Block Elements
- Biomolecules, Polymers and Chemistry in Everyday Life
- Metallurgy
- Acids Bases and Salts, Chemical Formulae, Nuclear Chemistry, Periodic Table
  (Class 9-10 chapters that are not NMC units)

NEET Chemistry went from 30 chapters to 21, matching the official unit list.

**Error 3 — 18 official Biology chapters were missing.**
The NMC lists chapters the bank did not have at all. Added in
`src/lib/exam-bank/neet-bio-official.ts`:

The Living World · Plant Kingdom · Animal Kingdom · Anatomy of Flowering Plants
· Structural Organisation in Animals · Transport in Plants and Mineral Nutrition
· Plant Growth and Development · Locomotion and Movement · Sexual Reproduction
in Flowering Plants · Human Reproduction and Reproductive Health · Principles of
Inheritance and Variation · Evolution · Microbes in Human Welfare · Organisms
and Populations · Ecosystem, Biodiversity and Conservation

NEET Biology went from 21 chapters to 36.

---

## JEE Main — was wrong, now corrected

Source: National Testing Agency, JEE (Main) syllabus, Paper 1 B.E./B.Tech.

**Error 1 — Biology was tagged to JEE Main.** JEE Main has no Biology paper at
all, yet five `Biology Class 10` chapters were tagged to it. Removed.

**Error 2 — Chemistry carried the units NTA deleted in the 2024 revision.**
NTA removed States of Matter, Surface Chemistry, s-Block Elements, Hydrogen,
Environmental Chemistry, Polymers, Chemistry in Everyday Life, and General
Principles and Processes of Isolation of Metals. All are now excluded from
JEE Main.

JEE Main went from 4 subjects / 88 chapters to 3 subjects / 74 chapters.

---

## JEE Advanced — minor correction

Source: Joint Admission Board, jeeadv.ac.in syllabus.

JEE Advanced still examines Solid State and Surface Chemistry, so those were
**not** stripped. Only Class 9-10 board chapters were removed from it.

---

## UPSC Civil Services — minor correction

Source: Exam Notice No. 05/2026-CSE dated 4 February 2026,
`https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf`,
Section III Part A.

Prelims Paper I is exactly seven heads: Current events of national and
international importance; History of India and the Indian National Movement;
Indian and World Geography; Indian Polity and Governance; Economic and Social
Development; General issues on Environmental ecology, Bio-diversity and Climate
Change; General Science.

Paper II (CSAT, qualifying at 33%) is exactly seven heads: Comprehension;
Interpersonal skills including communication skills; Logical reasoning and
analytical ability; Decision making and problem solving; General mental ability;
Basic numeracy at Class X level; Data interpretation at Class X level.

The app's CSAT chapters, including Data Sufficiency, are confirmed in scope.
Correction applied: board-class chapters were being tagged to UPSC CSE and are
now excluded.

---

## SSC CGL — confirmed correct

Source: official notice of advertisement, SSC CGL 2025,
`https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf`
(132 pages; syllabus at paragraphs 13.10 and 13.11).

Confirmed structure, which matches the app:

- **Tier I** — four sections of 25 questions and 50 marks each, 100 questions
  and 200 marks, 60 minutes, negative marking 0.50 per wrong answer.
  Sections: General Intelligence and Reasoning; General Awareness;
  Quantitative Aptitude; English Comprehension.
- **Tier II Paper I Session I** — Section I Mathematical Abilities 30 and
  Reasoning and General Intelligence 30; Section II English Language and
  Comprehension 45 and General Awareness 25; Section III Computer Knowledge 20
  (qualifying). Session II is the Data Entry Speed Test.

No change needed.

---

## Punjab ETT Cadre — re-checked at chapter level, and it was badly wrong

Source: Education Recruitment Board / Department of School Education, Punjab —
ETT Teacher recruitment, revised syllabus and examination pattern.

**Paper A** — Punjabi only, 100 questions, 100 marks, 100 minutes,
**qualifying**, marks not counted in the merit list. Six heads: language and
its sub-languages; script and Gurmukhi script; phonemic awareness; word
knowledge; vocabulary; grammar.

**Paper B** — 100 questions, **200 marks at two marks each**, 100 minutes,
and the merit list rests on this paper alone:

| Subject | Questions | Marks |
|---|---|---|
| Punjabi | 20 | 40 |
| English | 10 | 20 |
| Hindi | 10 | 20 |
| General Science | 20 | 40 |
| Social Studies | 20 | 40 |
| Mathematics | 20 | 40 |

**Six subjects. Nothing else is examined.**

**The error.** The first pass only removed Reasoning, Computer Awareness and
Teaching Aptitude, which was correct as far as it went but stopped at subject
level. Checked again at chapter level, the bank was feeding **thirty
subjects and 389 chapters** into a six-subject paper:

- A full **Punjab GK block** — Punjab History, Punjab Geography, Punjab
  Economics, Punjab GK — which the ETT syllabus does not contain at all.
  Punjab culture is touched only through the Punjabi language paper.
- **Civil-services grade treatments** of Social Studies: Ancient History,
  Medieval History, Modern History, Art and Culture, Polity, Indian Economy,
  Indian Geography, Physical Geography, World Geography, Environment and
  Ecology, Science and Technology. ETT Social Studies is **20 questions at
  school level**. A candidate was being served chapters like "Sources of
  Ancient Indian History — Coins and Inscriptions" for a primary-teacher
  paper.
- **Hindi Literature**, when ETT Hindi is 10 questions of school grammar.

**The fix.** ETT now holds 14 subjects and 217 chapters, mapping one to one
onto the official six:

| Official paper | Bank subjects |
|---|---|
| Punjabi | Punjabi Paper A · Punjabi Grammar · Punjabi Literature |
| English | English Grammar · English Language |
| Hindi | Hindi Grammar |
| General Science | General Science · Science Class 9 · Science Class 10 |
| Social Studies | SST · SST Class 9 · SST Class 10 |
| Mathematics | Math Class 9 · Math Class 10 |

**The lesson.** Matching an exam at subject level is not enough. This one
passed a subject-level check in round one and was still carrying 172 chapters
it had no business carrying. The remaining verified exams need the same
chapter-level pass.

---

## CTET — was badly incomplete, now corrected

Source: Central Board of Secondary Education, **CTET February 2026 Information
Bulletin**, Appendix-I "Structure and Content of Syllabus (Paper I and Paper
II)", published on the CTET portal. The `ctet.nic.in` syllabus page still does
not respond, but the bulletin itself is served from the Government of India
CDN and was read in full.

Official structure, confirmed verbatim:

**Paper I (classes I-V)** — 150 MCQ, 150 marks, 2.5 hours, no negative marking.
Child Development and Pedagogy 30 (child development 15, inclusive education 5,
learning and pedagogy 10); Mathematics 30 (content 15, pedagogy 15);
Environmental Studies 30 (content 15, pedagogy 15); Language I 30;
Language II 30.

**Paper II (classes VI-VIII)** — 150 MCQ, 150 marks. Child Development and
Pedagogy 30; Mathematics and Science 60 (maths 30 and science 30, each content
20 and pedagogy 10) **or** Social Studies/Social Science 60 (content 40,
pedagogy 20); Language I 30; Language II 30.

Pass mark 60 per cent, per NCTE notification 76-4/2010/NCTE/Acad of 11.02.2011.
Twenty languages are offered including Punjabi (code 15).

**The error.** The app carried only five CTET chapters, all of them pedagogy.
Child Development and Pedagogy alone is 30 of the 150 marks, and the content
halves of Mathematics, EVS, Science and Social Studies were absent entirely.

**The fix.** `src/lib/exam-bank/ctet-official.ts` adds fifteen chapters built
directly on the bulletin's own headings, taking CTET from 5 to 20 chapters:

Child Development: Concept and Principles · Heredity, Environment and
Socialization · Piaget, Kohlberg and Vygotsky · Inclusive Education and
Children with Special Needs · Learning and Pedagogy · Assessment for Learning
and CCE · Primary Mathematics Content for Paper I · Pedagogical Issues in
Teaching Mathematics · Environmental Studies Content for Paper I · Pedagogical
Issues in Environmental Studies · Pedagogy of Language Development ·
Elementary Mathematics Content for Paper II · Elementary Science Content for
Paper II · Social Studies Content for Paper II · Pedagogical Issues in Social
Science

The content chapters follow the bulletin's strand names exactly — for Paper II
Science, the seven strands Food, Materials, The World of the Living, Moving
Things People and Ideas, How Things Work, Natural Phenomena and Natural
Resources; for Social Studies, the History, Geography and Social and Political
Life theme lists as printed.

---

## NDA and CDS — was wrong, now corrected

Source: **UPSC NDA & NA Examination (II) 2026 notification**,
`https://www.upsc.gov.in/sites/default/files/Notif-NDA-II-2026-Engl-200526.pdf`,
Appendix-I "The Scheme and Syllabus of Examination", read in full.

Official scheme, confirmed verbatim:

| Subject | Code | Duration | Marks |
|---|---|---|---|
| Mathematics | 01 | 2.5 hours | 300 |
| General Ability Test | 02 | 2.5 hours | 600 |
| Written total | | | 900 |
| SSB Test / Interview | | | 900 |

All papers objective type. Mathematics and Part B of the GAT are set
bilingually. No calculator or log tables permitted.

**Mathematics has exactly eight parts:** Algebra; Matrices and Determinants;
Trigonometry; Analytical Geometry of Two and Three Dimensions; Differential
Calculus; Integral Calculus and Differential Equations; Vector Algebra;
Statistics and Probability.

**General Ability Test:** Part A English 200 marks — grammar and usage,
vocabulary, comprehension and cohesion. Part B General Knowledge 400 marks,
covering, in the notification's own words, "Physics, Chemistry, General
Science, Social Studies, Geography and Current Events", in sections A to F.

**The error.** The app was feeding **Reasoning (29 chapters), Computer
Awareness (12) and Hindi Grammar (7)** into this series. None of the three is
examined anywhere in NDA or CDS. CDS likewise has only English, General
Knowledge and Elementary Mathematics.

NDA/CDS went from 22 subjects and 351 chapters to 19 subjects and 303
chapters, matching the notification.

---

## Banking (IBPS) — was wrong, now corrected

Source: IBPS, CRP PO/MT notification, structure of the preliminary and main
examination, `https://www.ibps.in/`.

Prelims: English Language, Quantitative Aptitude, Reasoning Ability.
Mains: Reasoning and Computer Aptitude; Data Analysis and Interpretation;
English Language; General / Economy / Banking / Digital / Financial Awareness;
plus a descriptive English paper.

**The error.** Physics and Chemistry chapters were tagged to the banking
series. No banking recruitment paper examines them. Removed.

Hindi was deliberately **kept**, because IBPS RRB offers a Hindi language
section as an alternative to English.

---

## SSC CHSL and MTS — corrected

Source: SSC scheme of examination for the Combined Higher Secondary (10+2)
Level and the Multi Tasking (Non-Technical) Staff examinations.

MTS confirmed: Session I — Numerical and Mathematical Ability 20 questions,
Reasoning Ability and Problem Solving 20, no negative marking. Session II —
General Awareness 25, English Language and Comprehension 25, one mark deducted
per wrong answer.

**The error.** Hindi Grammar was tagged to SSC CGL, CHSL and MTS. These papers
are printed bilingually but the language section examined is English
Comprehension only. Removed from all three.

**Deliberately not changed.** MTS General Awareness is officially defined as
"Social Studies plus General Science and Environmental studies up to the 10th
Standard", so the Class 10 science chapters in the MTS series are correct and
were left alone. This is the opposite of the NEET case, where Class 10 content
had no business being there.

---

## PSTET — had no chapters at all, now loaded

Source: State Council of Educational Research and Training, Punjab — PSTET
notification and structure of examination, published through the PSTET portal
and `ssapunjab.org`.

Official structure, confirmed:

**Paper I (classes I-V)** — 150 MCQ, 150 marks, 2.5 hours, one mark each, no
negative marking. Child Development and Pedagogy 30; **Language I (Punjabi)**
30; **Language II (English)** 30; Mathematics 30; Environmental Studies 30.

**Paper II (classes VI-VIII)** — Child Development and Pedagogy 30; Language I
(Punjabi) 30; Language II (English) 30; Mathematics and Science 60 **or**
Social Studies / Social Science 60.

Qualifying mark 60 per cent, relaxed to 55 per cent for SC, ST, OBC and
differently abled candidates.

PSTET follows the same NCTE structure as CTET, and its published topic lists
match the CTET Appendix-I headings item for item. **Two real differences:**
CTET lets a candidate choose any two of twenty languages, while PSTET fixes
Language I as Punjabi and Language II as English; and PSTET content is drawn
from the Punjab State and SCERT syllabus for classes I-V and VI-VIII rather
than the NCERT one.

**The error.** PSTET had **zero chapters** in the bank. The `pstet-ctet`
series was running on shared TET content with nothing specific to it.

**The fix.** The twenty official TET chapters now carry the PSTET tag, and
because Language I and Language II are fixed full 30-mark sections, Punjabi
Grammar, Punjabi Literature, English Grammar and English Language are
registered as whole-subject papers for PSTET. PSTET went from 0 to 75
chapters.

---

## PSSSB and Punjab Patwari — corrected

Source: Punjab Subordinate Services Selection Board, Clerk (Common Cadre)
**Advertisement No. 02 of 2026**, syllabus and scheme of examination,
`https://sssb.punjab.gov.in/`.

Official structure, confirmed:

**Part A** — Punjabi language at matriculation standard, 50 questions, 50
marks, **qualifying only**, minimum 50 per cent, no negative marking.

**Part B** — 100 questions, 100 marks, negative marking one fourth, evaluated
only if Part A is cleared:

| Section | Marks |
|---|---|
| General Knowledge and Current Affairs | 25 |
| Logical Reasoning and Mental Ability | 25 |
| English | 12 |
| Punjabi | 13 |
| Information and Communication Technology | 8 |
| Punjab History and Culture | 17 |

Total 2 hours 30 minutes, OMR based. Patwari follows the same two-part
pattern, with ICT 9 and Punjab History and Culture 16.

**The error.** Hindi Grammar and Hindi Literature were tagged to PSSSB and
Patwari. The only two languages examined are Punjabi and English. Banking
Awareness was also tagged to PSSSB and is not a section. All removed.

**Deliberately kept.** Science and Technology, environmental issues,
geography, economic issues and Indian freedom-struggle history stay, because
the official General Knowledge head names every one of them.

---

## Punjab Master Cadre — was wrong, now corrected

Source: **Education Recruitment Board, Punjab** (Department of School
Education) — public notice on the syllabus for Master Cadre posts, which
publishes one syllabus PDF per subject, at `educationrecruitmentboard.com`.

Official paper: 150 objective questions, 150 marks, 150 minutes, computer
based, bilingual, one mark per question and **no negative marking**. A
candidate sits the paper of the single subject applied for. The merit list is
made on the written exam alone.

**The board publishes exactly eight subject syllabi:**

DPE (Physical Education) · English · Hindi · Maths · Punjabi · Science ·
Social Science · **Music**

The 4161-post advertisement bears this out, with Maths 912, Science 859,
English 790, Social Science 633, Punjabi 534, Hindi 240, Physical Education
168 and Music 25.

**The error.** The app had a Master Cadre **Art and Craft** series and **no
Music series at all**. Art and Craft is not a Master Cadre subject. Music, a
real subject with its own published syllabus and its own vacancies, was
missing.

**The fix.**

- `src/lib/exam-bank/music-cadre.ts` adds a Music subject with seven chapters
  built on the subject's actual content: swara, saptak and naad; raga
  definition, jati and the ten thaats; taal, laya and the rhythm system;
  khayal, dhrupad and the light genres; the four-fold classification of
  instruments; the history of Indian music and its theorists; and notation
  systems and the teaching of music.
- A `master-cadre-music` series was added, 19 chapters and 26 tests.
- The Art and Craft series was **not deleted**, because Art and Craft is a
  genuine Paper II subject option in PSTET, which publishes a separate answer
  key for it alongside Science & Maths, Social Studies and Music. The series
  was re-pointed to PSTET and renamed accordingly, 14 chapters and 20 tests.
- Art and Craft is now excluded from the Punjab Master Cadre tag.

---

## Search bar on the test series page

Checked and confirmed present. `src/routes/test-series.tsx` holds the query
state at line 157, filters both the paid and the theory catalogues through
`matches` and `theoryMatches`, and renders the input at line 288 with the
placeholder "Search a series, exam or subject — try Master Cadre, ICSE, CA,
Punjabi".

---

---

## RRB NTPC, Group D and ALP — were wrong, now corrected

Source: Railway Recruitment Boards, CEN 06/2025 and CEN 07/2025 scheme of
examination.

**NTPC CBT 1** — General Awareness 40, Mathematics 30, General Intelligence
and Reasoning 30 = 100 questions, 100 marks, 90 minutes, screening only.
**CBT 2** — General Awareness 50, Mathematics 35, Reasoning 35 = 120
questions, 120 marks, 90 minutes, merit deciding. **Negative marking one
third** in both.

**Group D** — single CBT: Mathematics 25, Reasoning 30, General Science 25,
General Awareness and Current Affairs 20 = 100 marks.

**ALP** — CBT 1 on Mathematics, Reasoning, General Science and General
Awareness; CBT 2 Part A on the same heads and Part B on the trade.

**The error.** All three were being fed **English Grammar, English Language,
Hindi Grammar, Banking Awareness and Computer Awareness**. Not one of those is
a section in any RRB paper. The exam is offered in fifteen languages, but that
is a choice of medium, not a language subject. Removed from all three.

Group D keeps its Class 9 and 10 science, because General Science is a named
section there.

---

## PPSC and Punjab PCS — corrected, and English was missing

Source: Punjab Public Service Commission, Punjab State Civil Services
Combined Competitive Examination notification, `ppsc.gov.in`.

**Prelims** — Paper I General Studies, 100 questions at 2 marks = 200.
Paper II CSAT, 80 questions at 2.5 marks = 200, **qualifying at 40 per cent**.
No negative marking. Merit rests on Paper I alone.

**Mains, 1350 marks over seven papers** — Punjabi in Gurmukhi script
compulsory 100 and English compulsory 100, both qualifying; Essay 150;
GS I History, Geography and Society 250; GS II Constitution and Polity,
Governance and International Relations 250; GS III Economy, Statistics and
Security 250; GS IV Science and Technology, Environment, Problem Solving and
Decision Making 250. Interview 150. Grand total 1500. Prelims marks are not
carried forward.

**Two errors.** Hindi Literature and Banking Awareness were tagged to PPSC and
neither is examined — the compulsory languages are Punjabi and English only.
And **English was absent from the exam altogether**, even though Mains Paper
II is a compulsory 100-mark English paper. Hindi and banking removed, English
added as a whole-subject paper.

## CBSE and ICSE boards — checked, and the separation was already right

### CBSE Classes 9 and 10

Source: `cbseacademic.nic.in`, Secondary Curriculum 2026-27 — Mathematics
041 and 241, Science 086, Social Science 087. Every subject is 80 theory plus
20 internal assessment.

**Science (086), five units:** Chemical Substances Nature and Behaviour 25 ·
World of Living 25 · Natural Phenomena 12 · Effects of Current 13 · Natural
Resources 5.

**Mathematics (041/241), seven units:** Number Systems 6 · Algebra 20 ·
Coordinate Geometry 6 · Geometry 15 · Trigonometry 12 · Mensuration 10 ·
Statistics and Probability 11.

**Social Science (087), four disciplines at 20 each.** Two things worth
knowing, because both are easy to get wrong:

- History keeps chapters 1, 2, 3 (subtopics 1 to 1.3 only) and 5. **Chapter 4,
  The Age of Industrialisation, is not in the theory paper.**
- Political Science keeps Power-sharing, Federalism, Gender Religion and
  Caste, Political Parties and Outcomes of Democracy. **Democracy and
  Diversity, Popular Struggles and Movements, and Challenges to Democracy are
  out.** The app already omits all three, which is correct.

**Correction applied.** CBSE Class 9 and 10 teach one combined Science
subject, not three separate sciences. The separate Physics, Chemistry and
Biology Class 9 and 10 subjects are ICSE subjects and are now excluded from
the CBSE tags.

**Known remaining gap.** The app bundles two or three NCERT chapters into one
app chapter in SST Class 10, and one of those bundles still carries The Age of
Industrialisation. Splitting the bundles to 1:1 NCERT chapters is the next
piece of board work.

### ICSE and ISC Classes 9 and 10

Source: `cisce.org`, ICSE Regulations and Syllabuses. CISCE publishes **one
combined Class 9 and 10 document per subject**, which is why the app's ICSE 9
and 10 chapter lists overlap by design.

Physics, Chemistry and Biology are three separate papers, each 80 external
plus 20 practical, Section A compulsory and Section B choice-based.
Mathematics is a single 100-mark written paper of two and a half hours with
**no internal component**, covering Commercial Mathematics (GST, Banking,
Shares and Dividends), Algebra, Geometry, Mensuration, Trigonometry,
Statistics and Probability.

**Correction applied.** The combined CBSE-style Science Class 9 and 10
subjects are now excluded from the ICSE tags.

### The good news

A machine check for cross-board leakage found **zero** ICSE-only chapters
carrying a CBSE tag. The board split that was built earlier holds up against
the official documents. The ICSE-suffixed Mathematics chapters — GST, Banking,
Shares and Dividends, Matrices, Remainder and Factor Theorem, Section Formula,
Loci — are correctly kept away from CBSE, where none of them is examined.

---

## CAPF, CUET, Punjab Clerk and SSC GD Constable

### CAPF — checked, already correct

Source: UPSC, Central Armed Police Forces (Assistant Commandants) Examination
notice, scheme and syllabus.

Paper I General Ability and Intelligence, 250 marks, objective, two hours, set
in English and Hindi, **negative marking one third**. Six heads: General
Mental Ability (logical reasoning, quantitative ability, interpretation of
data); General Science including information technology, biotechnology and
environmental science; Current Events; Indian Polity and Economy; History of
India; Indian and World Geography.

Paper II General Studies, Essay and Comprehension, 200 marks, descriptive,
three hours. The essay may be written in English or Hindi, but precis,
comprehension and other language skills are English only. Interview 150,
written total 450.

**No correction needed.** The bank was not feeding Hindi or banking into this
exam. The rule is recorded anyway so the position is explicit rather than
accidental.

### CUET — was wrong, now corrected

Source: NTA, CUET UG Information Bulletin, test design and syllabus.

Section IA 13 languages, Section IB 20 languages, Section II 27 domain
subjects drawn from NCERT Class 11 and 12, Section III General Test. Each
paper is 50 MCQ of which 40 are attempted in 60 minutes, **plus 5 for a
correct answer and minus 1 for a wrong one**. Section III covers General
Knowledge, Current Affairs, General Mental Ability, Numerical Ability,
Quantitative Reasoning at Grade 8 level, and Logical and Analytical Reasoning.

**The error.** Punjab GK, Punjab History, Punjab Geography and Punjab
Economics were tagged to CUET. It is a national test with no state paper.
Removed. Punjabi does appear in CUET, but as a Section IA language paper, not
as Punjab general knowledge.

### Punjab Clerk — corrected

Same paper as the PSSSB Clerk advertisement already verified, so the same
correction applies: Hindi and Banking Awareness removed. Part A is Punjabi at
matric standard, qualifying at 50 per cent; Part B is 100 marks with quarter
negative marking across GK 25, Reasoning 25, English 12, Punjabi 13, ICT 8 and
Punjab History and Culture 17.

### SSC GD Constable — deliberately left alone

Source: SSC, Constable (GD) scheme of examination. Computer based, 80
questions and 160 marks: Part A General Intelligence and Reasoning 20, Part B
General Knowledge and General Awareness 20, Part C Elementary Mathematics 20,
**Part D English or Hindi 20**.

**No exclusions applied, on purpose.** Unlike CGL, CHSL and MTS, Part D of
this paper is English **or** Hindi at the candidate's choice, so Hindi is
genuinely examined here and its chapters were correctly left in place. This is
exactly why each SSC paper has to be read on its own rather than treated as
one family — the same board sets four papers and only one of them examines
Hindi.

---

## Punjab Lecturer Cadre and CLAT

### Punjab Lecturer Cadre — was wrong, now corrected

Source: Directorate of School Education, Recruitment Directorate, Punjab —
Lecturer (Cadre) recruitment notification for 1013 posts, `erd.punjab.gov.in`.

**Two sections, 300 questions and 300 marks over five hours.** OMR, one mark
per question, **no negative marking**.

| Section | Content | Questions |
|---|---|---|
| I — General (2h 30m) | Punjabi 30, English 30, Teaching Aptitude 30, Mathematics General 30, General Knowledge 30 | 150 |
| II — Concerned subject (2h 30m) | The one subject applied for | 150 |

**Twelve subjects only**, with the advertised vacancies: History 210 · English
141 · Political Science 131 · Mathematics 105 · Punjabi 99 · Commerce 98 ·
Physics 58 · Economics 50 · Chemistry 41 · Biology 37 · Hindi 29 ·
Geography 14.

**The error.** Art and Craft, Music and Physical Education were tagged to
Lecturer Cadre. None of the three is a Lecturer subject — this cadre teaches
classes 11 and 12. Removed, taking the exam from 34 subjects to 31.

**Worth noting.** This is the exact mirror of the Master Cadre finding. Master
Cadre **has** Music and DPE and does **not** have Art and Craft; Lecturer
Cadre has **none** of the three. Two cadres under the same department with
different subject lists, which is why each had to be read on its own rather
than assumed to match.

### CLAT — a whole section was missing

Source: Consortium of National Law Universities, CLAT UG exam pattern.

120 passage-based MCQs, 120 marks, 120 minutes, offline, **English only**,
**+1 and −0.25**. Five sections:

| Section | Questions | Weight |
|---|---|---|
| English Language | 22–26 | 20% |
| Current Affairs including General Knowledge | 28–32 | 25% |
| Legal Reasoning | 28–32 | 25% |
| Logical Reasoning | 22–26 | 20% |
| Quantitative Techniques | 10–14 | 10% |

**The error.** **Quantitative Techniques was absent from the exam
altogether.** A CLAT student using the app would never have been served a
single question from a section worth up to 14 marks. Quantitative Aptitude has
been added as a whole-subject paper. Hindi is excluded, since the paper is set
in English only.

---

## Punjab Police, PSEB and the three CA levels

### Punjab Police — corrected

Source: Punjab Police Recruitment Board, Constable recruitment notification.

**Paper 1 (CBT)** — 100 questions, 100 marks, 120 minutes, **no negative
marking**: General Awareness 35 · Quantitative Aptitude and Numerical Skills
20 · Mental Ability and Logical Reasoning 20 · English Language Skills 10 ·
Punjabi Language Skills 10 · Digital Literacy and Awareness 5.
**Paper 2 (CBT, qualifying)** — Punjabi Language, 50 questions, 60 minutes,
matriculation standard.

The paper is set in **Punjabi and English only**, so Hindi was removed. The
Punjab history, geography, culture and economy chapters stay, because the
official General Awareness head names all of them, and Computer Awareness
stays for the Digital Literacy section.

### PSEB Class 9-10 — corrected

PSEB teaches **one combined Science subject** at Class 9 and 10, as CBSE does.
The separate Physics, Chemistry and Biology Class 9 and 10 subjects are ICSE
subjects and were being drawn into PSEB. Removed, taking it from 15 subjects
to 9. Punjabi stays, correctly, as a compulsory subject.

### CA Foundation, Intermediate and Final — all three were wrong

Source: ICAI, New Scheme of Education and Training.

| Level | Official papers |
|---|---|
| **Foundation** | Accounting · Business Laws · Quantitative Aptitude · Business Economics — **four only** |
| **Intermediate** | Advanced Accounting · Corporate and Other Laws · Taxation · Cost and Management Accounting · Auditing and Ethics · Financial Management and Strategic Management — **six** |
| **Final** | Financial Reporting · Advanced Financial Management · Advanced Auditing, Assurance and Professional Ethics · Direct Tax Laws and International Taxation · Indirect Tax Laws · Integrated Business Solutions — **six** |

**The errors.** Papers were leaking across levels in both directions:

- **Foundation** was carrying Cost Accounting and Taxation. Both are
  Intermediate papers. A Foundation student was being served two papers that
  do not exist at that level. Now exactly four, matching ICAI.
- **Intermediate** was carrying Advanced Auditing (a Final paper) and
  Business Economics (a Foundation paper). Now six.
- **Final** was carrying Auditing and Ethics and Financial Management, both
  Intermediate papers. Now five of the six, the missing one being Integrated
  Business Solutions, which has no chapters in the bank yet.

---

## The chapter-level pass

ETT showed that matching an exam at subject level is not enough — it passed a
subject-level check and was still carrying 172 chapters it had no business
carrying. So every verified exam is being re-walked at chapter level.

**The test being applied.** An exam may carry broad general-studies subjects
**only if its official scheme names a general section.** Where the scheme is
subject-only, or lists its sections exhaustively, anything outside that list
comes out.

| Exam | Has an official general section? | Verdict |
|---|---|---|
| Punjab ETT Cadre | No — six named subjects in Paper B | **Corrected**, 389 → 217 chapters |
| Punjab Master Cadre | No — 150 questions on one subject | **Corrected**, 3886 → 3456 chapters |
| Punjab Lecturer Cadre | Yes — Section I carries General Knowledge 30 | Breadth is legitimate |
| PSSSB, Patwari, Punjab Clerk | Yes — General Knowledge and Current Affairs 25 | Legitimate |
| PPSC, Punjab PCS, UPSC CSE, CAPF, NDA/CDS | Yes — General Studies papers | Legitimate |
| SSC CGL, CHSL, MTS, GD | Yes — General Awareness sections | Legitimate |
| RRB NTPC, Group D, ALP | Yes — General Awareness sections | Legitimate |
| CUET | Yes — Section III General Test | Legitimate |
| NEET, JEE, CA, CLAT, boards | No | Already reduced to their exact papers |

### Punjab Master Cadre — corrected again

The paper is **150 questions on the one subject applied for**, computer based,
150 minutes, no negative marking. **There is no general knowledge or aptitude
section anywhere in it.** Yet the bank was offering, under this exam, General
Awareness, Art and Culture, Science and Technology, Environment and Ecology
and a Punjab GK block. None is named in any of the eight subject syllabi.
Removed, taking it from 40 subjects to 35.

**Deliberately kept.** Polity, Geography, History and Economics stay, because
the board's own Social Science syllabus names Polity, physical and Indian
geography with resources and environment, the history of Punjab, India and
the world, and economics including the Punjab economy. Computer Awareness
stays because the DPE syllabus names an introduction to computers. Punjab
History and Punjab Economics stay for the same reason.

---

## CBSE and ISC Commerce — the stream had nothing at all

Source: CBSE Senior Secondary Curriculum 2026-27, `cbseacademic.nic.in` —
**Accountancy (055)** and **Business Studies (054)**. Both are two-year
courses carrying the same code into Class 12, both 80 theory plus 20 project.

**The gap.** CBSE Class 11 and 12 held only Physics, Chemistry, Mathematics
and Biology. A Commerce student had **nothing whatsoever** to practise on.

**Official structure, now built:**

| Paper | Parts |
|---|---|
| Accountancy 11 | Part A Financial Accounting I 56 (Theoretical Framework 12, Accounting Process 44) · Part B Financial Accounting II 24 |
| Accountancy 12 | Accounting for Partnership Firms 36 · Accounting for Companies 24 · Financial Statements Analysis 20 |
| Business Studies 11 | Part A Foundations of Business 40 (units 1-6) · Part B Finance and Trade 40 (units 7-10) |
| Business Studies 12 | Part A Principles and Functions of Management 50 (units 1-8) · Part B Business Finance and Marketing 30 (units 9-12) |

`src/lib/exam-bank/commerce-school.ts` adds four subjects and fourteen
chapters built on those units — theoretical framework; journal, ledger and
trial balance; depreciation, provisions and reserves; final accounts of a
sole proprietorship; partnership fundamentals; admission, retirement, death
and dissolution; shares and debentures; statement analysis and cash flow;
nature and forms of business; public, global and emerging modes; finance and
trade; management principles and the business environment; the five
management functions; and financial management, markets, marketing and
consumer protection.

Two series follow, **CBSE and ISC Class 11 Commerce** and **Class 12
Commerce**, tagged to CBSE 11 and 12, ISC 11 and 12, the Commerce streams and
CUET, since CUET Section II examines these same NCERT papers.

**Humanities and the remaining three papers followed** — English Core (301),
Sociology (039) and Psychology (037) are now in as well, so all three senior
secondary streams are covered.

---

## CBSE and ISC Humanities — built from the board's own curriculum PDFs

Sources, read directly from `cbseacademic.nic.in`:
`History_SecP2_2026-27.pdf` (027) · `PoliticalScience_SecP2_2026-27.pdf` (028)
· `Geography_SecP2_2026-27.pdf` (029).

**The gap.** The bank held History, Polity and Geography only in their
**civil-services grade** form. That is the wrong level for a board candidate —
a Class 12 student needs Bricks, Beads and Bones and Bhakti-Sufi Traditions,
not a UPSC treatment of ancient India.

**Official structure, now built:**

| Paper | Structure |
|---|---|
| History XI | Unit I Early Societies 10 · Unit II Empires 20 · Unit III Changing Traditions 20 · Unit IV Towards Modernisation 25 · Map 5 |
| History XII | Themes in Indian History Part I 25 · Part II 25 · Part III 25, four themes each |
| Pol. Science XI | Part A Indian Constitution at Work 40 (ten chapters) · Part B Political Theory 40 (eight chapters) |
| Pol. Science XII | Part A Contemporary World Politics, six chapters at 6 each · Part B Politics in India since Independence |
| Geography XI | Fundamentals of Physical Geography · India Physical Environment |
| Geography XII | Fundamentals of Human Geography · India People and Economy, with map work |

`src/lib/exam-bank/humanities-school.ts` adds **six subjects and ten
chapters** on those units — Mesopotamia and the Roman and Mongol empires;
feudalism, the Renaissance and the Meiji Restoration; Harappa, Ashokan
inscriptions and Sanchi; travellers, Vijayanagara, the Permanent Settlement,
1857 and the Constituent Assembly; the Constitution at work and political
theory from negative liberty to Rawls; the end of bipolarity and Indian
politics from nation building to the era of coalitions; and physical and
human geography with the Indian physiographic divisions.

Two series follow, **Class 11 Humanities** and **Class 12 Humanities**, tagged
to CBSE 11 and 12, ISC 11 and 12, and CUET.

---

## CMA and CS — checked against the institutes' own paper lists

**CS Executive** — ICSI New Syllabus 2022, seven papers in two groups:
Jurisprudence, Interpretation and General Laws · Company Law and Practice ·
Setting Up of Business, Industrial and Labour Laws · Corporate Accounting and
Financial Management · Capital Market and Securities Laws · Economic,
Commercial and Intellectual Property Laws · Tax Laws and Practice.

**The error.** Cost Accounting, Advanced Auditing, Auditing and Ethics and
Business Economics were all tagged to CS Executive. Cost accounting and
auditing are not Executive papers at all under the 2022 syllabus, and
Business Economics belongs to the Foundation. Removed.

**CMA Intermediate** — ICMAI Syllabus 2022, eight papers. Group I: Business
Laws and Ethics · Financial Accounting · Direct and Indirect Taxation · Cost
Accounting. Group II: Operations Management and Strategic Management ·
Corporate Accounting and Auditing · Financial Management and Business Data
Analytics · Management Accounting.

Checked and the mapping holds — law to Paper 5, accounting to 6 and 10, tax
to 7, cost to 8, auditing to 10, financial management to 11. **Recorded as a
gap rather than faked:** Management Accounting and Operations and Strategic
Management have no chapters in the bank yet.

---

## Which exams are NOT yet matched to an official syllabus

This is the honest answer to "which exams are in the app but not checked".
Generated from the code, not written by hand.

**33 exam tags are checked against an official document.** They carry a rule
in `src/lib/exam-bank/official-syllabus.ts` naming the source:

NEET · JEE Main · JEE Advanced · UPSC CSE · NDA/CDS · SSC CGL · SSC CHSL ·
SSC MTS · Banking · RRB NTPC · RRB Group D · RRB ALP · PSSSB · Punjab Patwari
· PPSC Punjab · Punjab PCS · Punjab ETT Cadre · Punjab Master Cadre ·
CBSE Class 9 · CBSE Class 10 · ICSE Class 9 · ICSE Class 10 · CAPF ·
CUET · Punjab Clerk · SSC GD Constable · Punjab Lecturer Cadre · CLAT/Law ·
Punjab Police · PSEB Class 9-10 · CA Foundation · CA Intermediate · CA Final

**33 tags are not checked.** They split into two very different groups.

### A. Real exams with a live series — genuinely not verified

These have paying students and have NOT been read against an official
document. Treat their chapter lists as unconfirmed:

| Exam | Chapters | Why it matters |
|---|---|---|
| PSTET/CTET (combined tag) | 3241 | The two parents are verified, the merged tag is not |
| State PSC | 2136 | Umbrella over many state commissions |


| ISC Class 11 / 12 | 414 / 404 | CISCE regulations |
| CMA Intermediate | 492 | ICMAI |
| CS Executive / Professional | 564 / 385 | ICSI |

### B. Umbrella and alias tags — not real exams

These are internal routing labels, not exams a student sits, so there is no
official document to check them against. They inherit their content from the
real exams above:

SSC · Railway · UPSC/SSC/Bank · State Clerk · State Police ·
State Teacher/TET · General Awareness · CBSE MCQ · ICSE MCQ ·
State Board MCQ · CBSE Class 9-10 · ICSE Class 9-10 ·
CBSE Class 11-12 Science · CBSE Class 11-12 Commerce · ISC Science ·
ISC Commerce · NTSE/Olympiad · CTET · HTET · UPTET · CMA Foundation ·
CS Foundation

---

## Not yet verified — remaining queue

Dead URLs found so far, not to be retried:

- `ctet.nic.in/Content/Syllabus.aspx` — request fails. The Information
  Bulletin on the Government CDN works instead and was used.
- `upsc.gov.in/sites/default/files/Engl_CSP_2025.pdf` — redirects to the
  homepage and returns nothing.
- `ssc.gov.in` homepage — carries notices only. The notice PDF works.

See the table above for the full list. The largest remaining gaps are CUET,
CLAT, CAPF, SSC GD Constable, Punjab Police, Punjab Lecturer Cadre, the CISCE
regulations for ICSE and ISC, the CBSE class curricula, and the ICAI, ICMAI
and ICSI scheme documents.

Until each of those is read, the app's content for them stands as it is and is
not claimed to be officially verified.
