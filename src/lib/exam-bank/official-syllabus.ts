/**
 * Official syllabus corrections.
 *
 * Official-exam rules below were checked against the conducting body's own
 * notification or syllabus, not a coaching site. Composite, generic, legacy,
 * and editorial labels carry an explicit `scopeType`; their notes distinguish
 * official syllabus evidence from practice-pool or historical context. The
 * `source` field records official reference URLs for re-checking.
 *
 * A rule REMOVES an exam tag from chapters that the official syllabus does
 * not contain. It never invents content. If an official syllabus drops a
 * chapter, the chapter stays in the bank for the boards and exams that still
 * teach it, but the exam that dropped it stops drawing from it.
 *
 * See docs/syllabus-verification.md for the full audit trail.
 */

export type OfficialSyllabusRule = {
  /** Exam tag as used in the bank. */
  exam: string;
  /** Conducting body. */
  body: string;
  /** The official document this rule was read from. */
  source: string;
  /** Date the document was checked. */
  verified: string;
  /** Subjects this exam does not examine at all. */
  excludeSubjects?: readonly string[];
  /** Chapters the official syllabus does not contain, regardless of subject. */
  excludeTopics?: readonly string[];
  /** Subject-scoped chapter exclusions for overlapping labels. */
  excludeTopicsBySubject?: Readonly<Record<string, readonly string[]>>;
  /** Classifies broad and historical labels so they are not mistaken for one current exam. */
  scopeType?: "official-exam" | "combined-exam" | "generic-practice" | "legacy" | "editorial";
  /** Short note explaining the correction. */
  note: string;
};

export const OFFICIAL_SYLLABUS_RULES: readonly OfficialSyllabusRule[] = [
  {
    exam: "NEET",
    body: "National Medical Commission (UGMEB), syllabus notified for NTA NEET UG",
    source:
      "https://www.nmc.org.in/ — NEET UG syllabus (Physics 20 units, Chemistry 20 units, Biology 10 units)",
    verified: "2026-09-30",
    // NEET UG is a Class 11 and 12 paper. Class 9 and 10 board chapters are
    // not part of it and must not feed the NEET series.
    excludeSubjects: [
      "Biology Class 9",
      "Biology Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Physics Class 9",
      "Physics Class 10",
      "Science Class 9",
      "Science Class 10",
    ],
    // Units the NMC syllabus does not list.
    excludeTopics: [
      "States of Matter",
      "Surface Chemistry",
      "Hydrogen and the s-Block Elements",
      "Biomolecules, Polymers and Chemistry in Everyday Life",
      "Metallurgy",
      "Acids Bases and Salts",
      "Chemical Formulae",
      "Nuclear Chemistry",
      "Periodic Table",
    ],
    note: "NMC dropped Solid State, Surface Chemistry, Polymers, Chemistry in Everyday Life, Hydrogen, s-Block Elements, Environmental Chemistry and States of Matter. The bank was also feeding Class 10 board chapters into NEET, which is a Class 11-12 paper.",
  },
  {
    exam: "JEE Main",
    body: "National Testing Agency",
    source:
      "https://jeemain.nta.nic.in/ — JEE (Main) syllabus, Paper 1 B.E./B.Tech (Physics 19 units, Chemistry 20 units, Mathematics 14 units)",
    verified: "2026-09-30",
    // JEE Main has no Biology, and no Class 9 or 10 board content.
    excludeSubjects: [
      "Biology",
      "Biology Class 9",
      "Biology Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Physics Class 9",
      "Physics Class 10",
      "Science Class 9",
      "Science Class 10",
    ],
    excludeTopics: [
      "States of Matter",
      "Surface Chemistry",
      "Hydrogen and the s-Block Elements",
      "Biomolecules, Polymers and Chemistry in Everyday Life",
      "Metallurgy",
      "Acids Bases and Salts",
      "Chemical Formulae",
      "Nuclear Chemistry",
      "Periodic Table",
    ],
    note: "NTA removed States of Matter, Surface Chemistry, s-Block Elements, Hydrogen, Environmental Chemistry, Polymers, Chemistry in Everyday Life and General Principles and Processes of Isolation of Metals. JEE Main has no Biology paper, yet Class 10 Biology chapters were tagged to it.",
  },
  {
    exam: "JEE Advanced",
    body: "IIT (Joint Admission Board)",
    source: "https://jeeadv.ac.in/ — JEE (Advanced) syllabus, Physics, Chemistry and Mathematics",
    verified: "2026-09-30",
    excludeSubjects: [
      "Biology",
      "Biology Class 9",
      "Biology Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Physics Class 9",
      "Physics Class 10",
      "Science Class 9",
      "Science Class 10",
    ],
    excludeTopics: ["Acids Bases and Salts", "Chemical Formulae", "Periodic Table"],
    note: "JEE Advanced retains Solid State and Surface Chemistry, so those are not stripped here, but Class 9 and 10 board chapters are not part of it.",
  },
  {
    exam: "UPSC CSE",
    body: "Union Public Service Commission",
    source:
      "https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf — Civil Services (Preliminary) Examination, Section III Part A",
    verified: "2026-09-30",
    excludeSubjects: [
      "Biology Class 9",
      "Biology Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Physics Class 9",
      "Physics Class 10",
      "Math Class 9",
      "Math Class 10",
      "SST Class 9",
      "SST Class 10",
      "Science Class 9",
      "Science Class 10",
    ],
    note: "Prelims Paper I is Current events, History of India and the National Movement, Indian and World Geography, Polity and Governance, Economic and Social Development, Environmental ecology and Biodiversity, and General Science. Paper II is the CSAT list. Board-class chapters are not a UPSC syllabus item.",
  },
  {
    exam: "Punjab ETT Cadre",
    body: "Education Recruitment Board / Department of School Education, Punjab",
    source:
      "https://erd.punjab.gov.in/ — ETT Teacher recruitment, revised syllabus and examination pattern for Paper A and Paper B",
    verified: "2026-09-30",
    // Paper A — Punjabi only, 100 questions, 100 marks, 100 minutes,
    // QUALIFYING, marks not counted in the merit list. Six heads: language
    // and its sub-languages; script and Gurmukhi script; phonemic
    // awareness; word knowledge; vocabulary; grammar.
    //
    // Paper B — 100 questions, 200 marks (two marks each), 100 minutes,
    // and the merit list rests on this paper alone:
    //   Punjabi          20 questions / 40 marks
    //   English          10 questions / 20 marks
    //   Hindi            10 questions / 20 marks
    //   General Science  20 questions / 40 marks
    //   Social Studies   20 questions / 40 marks
    //   Mathematics      20 questions / 40 marks
    //
    // Six subjects. Nothing else is examined. OMR based, one mark per
    // correct answer in Paper A.
    excludeSubjects: [
      // Not sections of either paper.
      "Reasoning",
      "Computer Awareness",
      "Teaching Aptitude",
      "CSAT",
      "General Awareness",
      // Punjab general knowledge is not in the ETT syllabus. Punjab culture
      // is touched only through the Punjabi language paper.
      "Punjab GK",
      "Punjab History",
      "Punjab Geography",
      "Punjab Economics",
      // Social Studies at ETT is school level, 20 questions. These are the
      // civil-services grade treatments of the same ground and are far
      // beyond what this paper asks.
      "Ancient History",
      "Medieval History",
      "Modern History",
      "Art and Culture",
      "Polity",
      "Indian Economy",
      "Indian Geography",
      "Physical Geography",
      "World Geography",
      "Environment and Ecology",
      "Science and Technology",
      // Hindi at ETT is 10 questions of school grammar, not literature.
      "Hindi Literature",
    ],
    note: "Re-checked at chapter level, not just at subject level. Paper B has exactly six subjects and Paper A is Punjabi alone, yet the bank was feeding thirty subjects into this exam, including civil-services grade Ancient History, Polity and Environment chapters and a full Punjab GK block that the syllabus does not contain. What remains maps one to one onto the official six: Punjabi (Paper A, Grammar, Literature), English (Grammar, Language), Hindi (Grammar), General Science (General Science, Science Class 9 and 10), Social Studies (SST, SST Class 9 and 10) and Mathematics (Math Class 9 and 10).",
  },
  {
    exam: "NDA/CDS",
    body: "Union Public Service Commission",
    source:
      "https://www.upsc.gov.in/sites/default/files/Notif-NDA-II-2026-Engl-200526.pdf — NDA & NA Examination (II) 2026, Appendix-I, The Scheme and Syllabus of Examination",
    verified: "2026-09-30",
    // Paper I Mathematics 300 marks, Paper II General Ability Test 600 marks
    // (Part A English 200, Part B General Knowledge 400). Part B covers
    // exactly: Physics, Chemistry, General Science, Social Studies,
    // Geography and Current Events. There is no reasoning section, no
    // computer paper and no Hindi language paper anywhere in the exam.
    excludeSubjects: ["Reasoning", "Computer Awareness", "Hindi Grammar", "Hindi Literature"],
    note: "Appendix-I lists Mathematics in eight parts and the GAT in Part A English plus Part B sections A to F. Reasoning, Computer Awareness and Hindi were being drawn into this series and are not examined. CDS is bundled under the same tag and likewise has only English, General Knowledge and Elementary Mathematics.",
  },
  {
    exam: "Banking",
    body: "Institute of Banking Personnel Selection",
    source:
      "https://www.ibps.in/ — CRP PO/MT notification, structure of the preliminary and main examination",
    verified: "2026-09-30",
    // Prelims: English Language, Quantitative Aptitude, Reasoning Ability.
    // Mains: Reasoning and Computer Aptitude, Data Analysis and
    // Interpretation, English Language, General / Economy / Banking /
    // Digital / Financial Awareness, and a descriptive English paper.
    excludeSubjects: ["Physics", "Chemistry", "Biology"],
    note: "No banking recruitment paper examines Physics, Chemistry or Biology. Those subjects were leaking into the banking series through subject widening. Hindi is retained because IBPS RRB offers a Hindi language section as an alternative to English.",
  },
  {
    exam: "SSC CGL",
    body: "Staff Selection Commission",
    source:
      "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf — paragraphs 13.10 and 13.11",
    verified: "2026-09-30",
    excludeSubjects: ["Hindi Grammar", "Hindi Literature"],
    note: "Tier I is General Intelligence and Reasoning, General Awareness, Quantitative Aptitude and English Comprehension. Tier II adds Computer Knowledge. The paper is bilingual but there is no Hindi language section to be examined on.",
  },
  {
    exam: "SSC CHSL",
    body: "Staff Selection Commission",
    source:
      "https://ssc.gov.in/ — Combined Higher Secondary (10+2) Level Examination notice, scheme of examination",
    verified: "2026-09-30",
    excludeSubjects: ["Hindi Grammar", "Hindi Literature"],
    note: "Same four-section Tier I structure as CGL. English Language is examined, Hindi is not.",
  },
  {
    exam: "SSC MTS",
    body: "Staff Selection Commission",
    source:
      "https://ssc.gov.in/ — Multi Tasking (Non-Technical) Staff notice, scheme of examination",
    verified: "2026-09-30",
    // Session I: Numerical and Mathematical Ability 20, Reasoning Ability
    // and Problem Solving 20. Session II: General Awareness 25, English
    // Language and Comprehension 25.
    excludeSubjects: ["Hindi Grammar", "Hindi Literature"],
    note: "Four sections only. General Awareness is defined as Social Studies plus General Science and Environmental studies up to the 10th standard, so Class 10 science chapters are correctly in scope here and were deliberately left in place. Hindi is not a section.",
  },
  {
    exam: "PSSSB",
    body: "Punjab Subordinate Services Selection Board",
    source:
      "https://sssb.punjab.gov.in/ — Clerk (Common Cadre) Advertisement No. 02 of 2026, syllabus and scheme of examination",
    verified: "2026-09-30",
    // Part A: Punjabi language at matriculation standard, 50 questions and
    // 50 marks, qualifying only, minimum 50 per cent, no negative marking.
    // Part B, 100 questions and 100 marks, negative marking one fourth:
    //   General Knowledge and Current Affairs            25
    //   Logical Reasoning and Mental Ability             25
    //   English                                          12
    //   Punjabi                                          13
    //   Information and Communication Technology          8
    //   Punjab History and Culture                       17
    // Total duration two hours thirty minutes, OMR based.
    excludeSubjects: ["Hindi Grammar", "Hindi Literature", "Banking Awareness"],
    note: "The two languages examined are Punjabi and English. Hindi appears nowhere in either part. Banking Awareness is not a section either. Science and Technology, environmental issues, geography, economic issues and Indian freedom-struggle history are retained because the official General Knowledge head names all of them.",
  },
  {
    exam: "Punjab Patwari",
    body: "Punjab Subordinate Services Selection Board",
    source:
      "https://sssb.punjab.gov.in/ — Patwari recruitment advertisement, scheme of examination",
    verified: "2026-09-30",
    // Same two-part PSSSB structure: Part A Punjabi 50 qualifying, Part B
    // 100 marks split General Knowledge and Current Affairs 25, Logical
    // Reasoning and Mental Ability 25, English 12, Punjabi 13, ICT 9,
    // Punjab History and Culture 16.
    excludeSubjects: ["Hindi Grammar", "Hindi Literature"],
    note: "Patwari follows the same Part A and Part B pattern as the other PSSSB Group C papers. Punjabi and English are the only languages examined.",
  },
  {
    exam: "Punjab Master Cadre",
    body: "Education Recruitment Board, Punjab (Department of School Education)",
    source:
      "https://educationrecruitmentboard.com/ — public notice on the syllabus for Master Cadre posts, one syllabus PDF per subject",
    verified: "2026-09-30",
    // 150 objective questions, 150 marks, 150 minutes, computer based,
    // bilingual, no negative marking, ON THE ONE SUBJECT APPLIED FOR.
    // There is no general knowledge or aptitude section at all.
    //
    // Eight subjects: DPE, English, Hindi, Maths, Punjabi, Science, Social
    // Science and Music. Vacancies in the 4161-post advertisement were
    // Maths 912, Science 859, English 790, Social Science 633, Punjabi 534,
    // Hindi 240, Physical Education 168, Music 25.
    //
    // The board's Social Science syllabus itself names Polity, Geography
    // (physical, India, resources and environment), History (of Punjab, of
    // India, world) and Economics (including Punjab economy), so those stay.
    // The DPE syllabus names an introduction to computers, so Computer
    // Awareness stays too.
    excludeSubjects: [
      // Art and Craft is a PSTET Paper II option, not a Master Cadre subject.
      "Art and Craft",
      // This paper has no general section. Nothing below is named in any of
      // the eight subject syllabi.
      "General Awareness",
      "Art and Culture",
      "Science and Technology",
      "Environment and Ecology",
      "Punjab GK",
      "CSAT",
    ],
    note: "Re-checked at chapter level. Master Cadre is a single-subject paper — a candidate sits 150 questions on the one subject applied for and nothing else. There is no general knowledge or aptitude section, yet the bank was offering General Awareness, Art and Culture, Science and Technology, Environment and Ecology and a Punjab GK block under this exam. Removed. Polity, Geography, History and Economics stay because the board's own Social Science syllabus names them, and Computer Awareness stays because the DPE syllabus names it.",
  },
  {
    exam: "RRB NTPC",
    body: "Railway Recruitment Boards",
    source:
      "https://www.rrbcdg.gov.in/ — CEN 06/2025 and CEN 07/2025, Non-Technical Popular Categories, scheme of examination",
    verified: "2026-09-30",
    // CBT 1: General Awareness 40, Mathematics 30, General Intelligence and
    // Reasoning 30 = 100 questions, 100 marks, 90 minutes.
    // CBT 2: General Awareness 50, Mathematics 35, General Intelligence and
    // Reasoning 35 = 120 questions, 120 marks, 90 minutes.
    // Negative marking one third in both stages. CBT 1 is screening only.
    excludeSubjects: [
      "English Grammar",
      "English Language",
      "Hindi Grammar",
      "Hindi Literature",
      "Banking Awareness",
      "Computer Awareness",
    ],
    note: "The paper has exactly three sections. There is no English section, no Hindi section, no computer section and no banking section anywhere in NTPC. The paper is offered in fifteen languages, which is a medium choice and not a language subject.",
  },
  {
    exam: "RRB Group D",
    body: "Railway Recruitment Boards",
    source: "https://www.rrbcdg.gov.in/ — Level 1 posts CEN, scheme of examination",
    verified: "2026-09-30",
    // Single CBT: Mathematics 25, General Intelligence and Reasoning 30,
    // General Science 25, General Awareness and Current Affairs 20
    // = 100 questions, 100 marks.
    excludeSubjects: [
      "English Grammar",
      "English Language",
      "Hindi Grammar",
      "Hindi Literature",
      "Banking Awareness",
      "Computer Awareness",
    ],
    note: "Four sections only. General Science is a named section here, so Class 9 and 10 science chapters are correctly retained.",
  },
  {
    exam: "RRB ALP",
    body: "Railway Recruitment Boards",
    source: "https://www.rrbcdg.gov.in/ — Assistant Loco Pilot CEN, scheme of examination",
    verified: "2026-09-30",
    // CBT 1: Mathematics, General Intelligence and Reasoning, General
    // Science, General Awareness on Current Affairs. CBT 2 has Part A on the
    // same heads and Part B on the relevant trade.
    excludeSubjects: [
      "English Grammar",
      "English Language",
      "Hindi Grammar",
      "Hindi Literature",
      "Banking Awareness",
      "Computer Awareness",
    ],
    note: "No language or computer section in either CBT. Physics and Mathematics stay, because General Science and Mathematics are named sections and Part B is trade technical.",
  },
  {
    exam: "PPSC Punjab",
    body: "Punjab Public Service Commission",
    source:
      "https://ppsc.gov.in/ — Punjab State Civil Services Combined Competitive Examination notification",
    verified: "2026-09-30",
    // Prelims: Paper I General Studies 100 questions at 2 marks = 200, and
    // Paper II CSAT 80 questions at 2.5 marks = 200, qualifying at 40 per
    // cent. No negative marking. Merit on Paper I alone.
    // Mains, 1350 marks over seven papers: Punjabi in Gurmukhi compulsory
    // 100 and English compulsory 100, both qualifying; Essay 150; General
    // Studies I History, Geography and Society 250; General Studies II
    // Constitution and Polity, Governance and International Relations 250;
    // General Studies III Economy, Statistics and Security 250; General
    // Studies IV Science and Technology, Environment, Problem Solving and
    // Decision Making 250. Interview 150, grand total 1500.
    excludeSubjects: ["Hindi Grammar", "Hindi Literature", "Banking Awareness"],
    note: "The two compulsory language papers are Punjabi in Gurmukhi script and English. Hindi is examined nowhere in PPSC, and there is no banking section. English was missing from this exam and has been added as a whole-subject paper.",
  },
  {
    exam: "Punjab PCS",
    body: "Punjab Public Service Commission",
    source:
      "https://ppsc.gov.in/ — Punjab State Civil Services Combined Competitive Examination notification",
    verified: "2026-09-30",
    excludeSubjects: ["Hindi Grammar", "Hindi Literature", "Banking Awareness"],
    note: "Same examination as the PPSC Punjab tag. Punjabi and English are the compulsory language papers; Hindi is not examined.",
  },
  {
    exam: "CBSE Class 10",
    body: "Central Board of Secondary Education",
    source:
      "https://cbseacademic.nic.in/ — Secondary Curriculum 2026-27, subject codes 041/241 Mathematics, 086 Science, 087 Social Science",
    verified: "2026-09-30",
    // Every subject is 80 theory plus 20 internal assessment.
    //
    // Science (086), five units: Chemical Substances Nature and Behaviour 25,
    // World of Living 25, Natural Phenomena 12, Effects of Current 13,
    // Natural Resources 5.
    //
    // Mathematics (041/241), seven units: Number Systems 6, Algebra 20,
    // Coordinate Geometry 6, Geometry 15, Trigonometry 12, Mensuration 10,
    // Statistics and Probability 11.
    //
    // Social Science (087), four disciplines at 20 marks each. History keeps
    // chapters 1, 2, 3 (subtopics 1 to 1.3 only) and 5 — chapter 4, The Age
    // of Industrialisation, is NOT in the theory paper. Political Science
    // keeps Power-sharing, Federalism, Gender Religion and Caste, Political
    // Parties and Outcomes of Democracy only; Democracy and Diversity,
    // Popular Struggles and Movements and Challenges to Democracy are out.
    excludeSubjects: ["Physics Class 10", "Chemistry Class 10", "Biology Class 10"],
    note: "CBSE Class 10 teaches one combined Science subject, not three separate sciences, so the separate Physics, Chemistry and Biology Class 10 subjects belong to ICSE and are excluded here. Science Class 10 and SST Class 10 carry old-NCERT chapters that are explicitly labelled as such, which is correct because the rationalised syllabus dropped them but many schools still teach them.",
  },
  {
    exam: "CBSE Class 9",
    body: "Central Board of Secondary Education",
    source: "https://cbseacademic.nic.in/ — Secondary Curriculum 2026-27",
    verified: "2026-09-30",
    excludeSubjects: ["Physics Class 9", "Chemistry Class 9", "Biology Class 9"],
    note: "Same reason as Class 10. CBSE Class 9 Science is one combined subject.",
  },
  {
    exam: "ICSE Class 9",
    body: "Council for the Indian School Certificate Examinations",
    source:
      "https://cisce.org/ — ICSE Regulations and Syllabuses, which publish one combined Class 9 and 10 document per subject",
    verified: "2026-09-30",
    excludeSubjects: ["Science Class 9", "Science Class 10"],
    note: "CISCE examines Physics, Chemistry and Biology as three separate 80 plus 20 papers, so the combined CBSE-style Science subject does not belong to ICSE. Mathematics is a single 100-mark written paper with no internal component.",
  },
  {
    exam: "ICSE Class 10",
    body: "Council for the Indian School Certificate Examinations",
    source:
      "https://cisce.org/ — ICSE Regulations and Syllabuses, combined Class 9 and 10 syllabus per subject",
    verified: "2026-09-30",
    excludeSubjects: ["Science Class 9", "Science Class 10"],
    note: "Physics, Chemistry and Biology are separate papers, each Section A compulsory and Section B choice-based. Mathematics covers Commercial Mathematics with GST, Banking and Shares and Dividends, then Algebra, Geometry, Mensuration, Trigonometry, Statistics and Probability.",
  },
  {
    exam: "CAPF",
    body: "Union Public Service Commission",
    source:
      "https://www.upsc.gov.in/ — Central Armed Police Forces (Assistant Commandants) Examination notice, scheme and syllabus",
    verified: "2026-09-30",
    // Paper I General Ability and Intelligence, 250 marks, objective, two
    // hours, set in English and Hindi, negative marking one third. Heads:
    // General Mental Ability (logical reasoning, quantitative ability,
    // interpretation of data); General Science (including information
    // technology, biotechnology and environmental science); Current Events
    // of National and International Importance; Indian Polity and Economy;
    // History of India; Indian and World Geography.
    // Paper II General Studies, Essay and Comprehension, 200 marks,
    // descriptive, three hours. The essay may be written in English or
    // Hindi, but precis, comprehension and other language skills are English
    // only. Interview 150. Written total 450.
    excludeSubjects: ["Hindi Grammar", "Hindi Literature", "Banking Awareness"],
    note: "Checked and found already correct — the bank was not feeding Hindi or banking into this exam. The rule is recorded so the position is explicit. Hindi is a medium option for the essay, not a subject examined.",
  },
  {
    exam: "CUET",
    body: "National Testing Agency",
    source: "https://cuet.nta.nic.in/ — CUET UG Information Bulletin, test design and syllabus",
    verified: "2026-09-30",
    // Section IA 13 languages, Section IB 20 languages, Section II 27 domain
    // subjects drawn from the NCERT Class 11 and 12 syllabus, Section III
    // General Test. Each paper is 50 MCQ of which 40 are attempted, 60
    // minutes, plus 5 for a correct answer and minus 1 for a wrong one.
    // Section III covers General Knowledge, Current Affairs, General Mental
    // Ability, Numerical Ability, Quantitative Reasoning at Grade 8 level,
    // and Logical and Analytical Reasoning.
    excludeSubjects: ["Punjab GK", "Punjab History", "Punjab Geography", "Punjab Economics"],
    note: "CUET is a national test with no state-specific paper. Punjab GK, Punjab History, Punjab Geography and Punjab Economics were being drawn into it and are not domain subjects. Punjabi does appear, but as a Section IA language paper, not as state general knowledge.",
  },
  {
    exam: "Punjab Clerk",
    body: "Punjab Subordinate Services Selection Board",
    source:
      "https://sssb.punjab.gov.in/ — Clerk (Common Cadre) Advertisement No. 02 of 2026, syllabus and scheme of examination",
    verified: "2026-09-30",
    // Identical to the PSSSB rule: Part A Punjabi at matric standard, 50
    // marks, qualifying at 50 per cent. Part B 100 marks with quarter
    // negative marking, split General Knowledge and Current Affairs 25,
    // Logical Reasoning and Mental Ability 25, English 12, Punjabi 13,
    // ICT 8 and Punjab History and Culture 17.
    excludeSubjects: ["Hindi Grammar", "Hindi Literature", "Banking Awareness"],
    note: "Same paper as the PSSSB clerk advertisement. Punjabi and English are the only languages examined, and there is no banking section.",
  },
  {
    exam: "SSC GD Constable",
    body: "Staff Selection Commission",
    source:
      "https://ssc.gov.in/ — Constable (GD) in CAPFs, SSF, Rifleman in Assam Rifles and Sepoy in NCB, scheme of examination",
    verified: "2026-09-30",
    // Computer based, 80 questions and 160 marks: Part A General
    // Intelligence and Reasoning 20, Part B General Knowledge and General
    // Awareness 20, Part C Elementary Mathematics 20, Part D English or
    // Hindi 20.
    note: "Deliberately no exclusions. Unlike CGL, CHSL and MTS, Part D of the GD Constable paper is English OR Hindi at the candidate's choice, so Hindi is genuinely examined here and its chapters were correctly left in place. This is why each SSC paper has to be read separately rather than treated as one family.",
  },
  {
    exam: "Punjab Lecturer Cadre",
    body: "Directorate of School Education, Recruitment Directorate, Punjab",
    source:
      "https://erd.punjab.gov.in/ — Lecturer (Cadre) recruitment notification, 1013 posts, scheme and subject-wise syllabus",
    verified: "2026-09-30",
    // Two sections of 150 questions and 150 marks each, 2 hours 30 minutes
    // per section, OMR, one mark per question and no negative marking.
    //   Section I, general: Punjabi 30, English 30, Teaching Aptitude 30,
    //     Mathematics (General) 30, General Knowledge 30.
    //   Section II: the concerned subject, 150.
    // Twelve subjects only, with the advertised vacancies: History 210,
    // English 141, Political Science 131, Mathematics 105, Punjabi 99,
    // Commerce 98, Physics 58, Economics 50, Chemistry 41, Biology 37,
    // Hindi 29, Geography 14.
    excludeSubjects: ["Art and Craft", "Music", "Physical Education"],
    note: "Lecturer Cadre teaches classes 11 and 12, and its twelve subjects do not include Art and Craft, Music or Physical Education. This is the opposite of Master Cadre, where Music and DPE are real subjects and Art and Craft is not. The two cadres had to be read separately rather than assumed to share a subject list.",
  },
  {
    exam: "CLAT/Law",
    body: "Consortium of National Law Universities",
    source: "https://consortiumofnlus.ac.in/ — CLAT UG exam pattern and syllabus",
    verified: "2026-09-30",
    // 120 passage-based MCQs, 120 marks, 120 minutes, offline, English only,
    // plus 1 for a correct answer and minus 0.25 for a wrong one.
    // Five sections: English Language 22-26, Current Affairs including
    // General Knowledge 28-32, Legal Reasoning 28-32, Logical Reasoning
    // 22-26, Quantitative Techniques 10-14.
    excludeSubjects: ["Hindi Grammar", "Hindi Literature"],
    note: "CLAT is set in English only, so Hindi is not examined. Quantitative Techniques is a real section worth 10 to 14 questions and was missing from this exam entirely; it has been added as a whole-subject paper.",
  },
  {
    exam: "Punjab Police",
    body: "Punjab Police Recruitment Board",
    source:
      "https://punjabpolice.gov.in/ — Constable recruitment notification, scheme of examination",
    verified: "2026-09-30",
    // Paper 1 (CBT), 100 questions and 100 marks in 120 minutes:
    //   General Awareness 35, Quantitative Aptitude and Numerical Skills 20,
    //   Mental Ability and Logical Reasoning 20, English Language Skills 10,
    //   Punjabi Language Skills 10, Digital Literacy and Awareness 5.
    // Paper 2 (CBT, qualifying): Punjabi Language 50 questions, 50 marks,
    //   60 minutes, at matriculation standard.
    // Conducted in Punjabi and English. No negative marking.
    excludeSubjects: ["Hindi Grammar", "Hindi Literature"],
    note: "The paper is set in Punjabi and English only. The Punjab history, geography, culture and economy chapters are correctly retained, because the official General Awareness head names all of them, and Computer Awareness is retained for the Digital Literacy section.",
  },
  {
    exam: "PSEB Class 9-10",
    body: "Punjab School Education Board",
    source: "https://pseb.ac.in/ — Class 9 and 10 curriculum and scheme of studies",
    verified: "2026-09-30",
    excludeSubjects: [
      "Physics Class 9",
      "Physics Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Biology Class 9",
      "Biology Class 10",
    ],
    note: "PSEB teaches one combined Science subject at Class 9 and 10, as CBSE does, not three separate science papers. The separate Physics, Chemistry and Biology subjects belong to ICSE. Punjabi is correctly retained as a compulsory subject.",
  },
  {
    exam: "CA Foundation",
    body: "Institute of Chartered Accountants of India",
    source: "https://www.icai.org/ — New Scheme of Education and Training, Foundation Course",
    verified: "2026-09-30",
    // Four papers only: Paper 1 Accounting, Paper 2 Business Laws,
    // Paper 3 Quantitative Aptitude, Paper 4 Business Economics.
    excludeSubjects: [
      "Cost Accounting",
      "Taxation",
      "Auditing and Ethics",
      "Advanced Auditing",
      "Financial Management",
    ],
    note: "The Foundation course under the ICAI new scheme has exactly four papers. Cost Accounting and Taxation were tagged to it and are Intermediate papers, not Foundation ones.",
  },
  {
    exam: "CA Intermediate",
    body: "Institute of Chartered Accountants of India",
    source: "https://www.icai.org/ — New Scheme of Education and Training, Intermediate Course",
    verified: "2026-09-30",
    // Six papers: Advanced Accounting; Corporate and Other Laws; Taxation;
    // Cost and Management Accounting; Auditing and Ethics; Financial
    // Management and Strategic Management.
    excludeSubjects: [
      "Advanced Auditing",
      "Business Economics",
      "Financial Reporting",
      "Direct Tax Laws",
      "Indirect Tax Laws",
    ],
    note: "Advanced Auditing, Assurance and Professional Ethics is a Final paper, and Business Economics is a Foundation paper. Both were being drawn into Intermediate.",
  },
  {
    exam: "CA Final",
    body: "Institute of Chartered Accountants of India",
    source: "https://www.icai.org/ — New Scheme of Education and Training, Final Course",
    verified: "2026-09-30",
    // Six papers: Financial Reporting; Advanced Financial Management;
    // Advanced Auditing, Assurance and Professional Ethics; Direct Tax Laws
    // and International Taxation; Indirect Tax Laws; Integrated Business
    // Solutions.
    excludeSubjects: [
      "Auditing and Ethics",
      "Financial Management",
      "Business Economics",
      "Business Law",
      "Accounting",
      "Cost Accounting",
    ],
    note: "Auditing and Ethics and Financial Management are Intermediate papers. The Final paper is Advanced Auditing, Assurance and Professional Ethics, and Advanced Financial Management, which the bank holds as Strategic Financial Management.",
  },
  {
    exam: "CS Executive",
    body: "Institute of Company Secretaries of India",
    source:
      "https://www.icsi.edu/academic-portal/new-syllabus-2022/executive-programme/ — Executive Programme, New Syllabus 2022",
    verified: "2026-09-30",
    // Seven papers in two groups.
    //   Group 1: Jurisprudence, Interpretation and General Laws; Company Law
    //     and Practice; Setting Up of Business, Industrial and Labour Laws;
    //     Corporate Accounting and Financial Management.
    //   Group 2: Capital Market and Securities Laws; Economic, Commercial
    //     and Intellectual Property Laws; Tax Laws and Practice.
    excludeSubjects: [
      "Cost Accounting",
      "Advanced Auditing",
      "Auditing and Ethics",
      "Business Economics",
    ],
    note: "Cost Accounting and auditing are not Executive Programme papers under the 2022 syllabus, and Business Economics belongs to the Foundation. The Executive papers the bank can serve are accounting and financial management through Corporate Accounting and Financial Management, law through Jurisprudence and Company Law, and tax through Tax Laws and Practice.",
  },
  {
    exam: "CMA Intermediate",
    body: "Institute of Cost Accountants of India",
    source: "https://icmai.in/ — Intermediate course, Syllabus 2022",
    verified: "2026-09-30",
    // Group I: Paper 5 Business Laws and Ethics, 6 Financial Accounting,
    //   7 Direct and Indirect Taxation, 8 Cost Accounting.
    // Group II: Paper 9 Operations Management and Strategic Management,
    //   10 Corporate Accounting and Auditing, 11 Financial Management and
    //   Business Data Analytics, 12 Management Accounting.
    excludeSubjects: [
      "Business Economics",
      "Financial Reporting",
      "Direct Tax Laws",
      "Indirect Tax Laws",
    ],
    note: "Checked against the ICMAI paper list. The bank's six subjects map onto the eight papers correctly — law to Paper 5, accounting to 6 and 10, taxation to 7, cost to 8, auditing to 10 and financial management to 11. Management Accounting (Paper 12) and Operations and Strategic Management (Paper 9) are now built as their own subjects, so all eight papers are covered.",
  },
  {
    exam: "CBSE Class 11",
    body: "Central Board of Secondary Education",
    source:
      "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Physics_SecP2_2026-27.pdf; https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Maths_SecP2_2026-27.pdf; https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Economics_SecP2_2026-27.pdf; https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/BusinessStudies_SecP2_2026-27.pdf",
    verified: "2026-10-02",
    excludeSubjects: [
      "Accountancy Class 12",
      "Business Studies Class 12",
      "Geography Class 12",
      "History Class 12",
      "Political Science Class 12",
      "Science Class 9",
      "Science Class 10",
      "SST Class 9",
      "SST Class 10",
      "Math Class 9",
      "Math Class 10",
    ],
    excludeTopicsBySubject: {
      Chemistry: ["Acids Bases and Salts"],
    },
    note: "Class XI scope is compared to the 2026-27 CBSE curriculum. Economics chapters are tagged by their actual year: microeconomics and production/demand topics go to XI, while macroeconomics and government-budget topics go to XII. Old-NCERT source templates stay available to their valid non-XI tracks.",
  },
  {
    exam: "CBSE Class 12",
    body: "Central Board of Secondary Education",
    source:
      "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Physics_SecP2_2026-27.pdf; https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Maths_SecP2_2026-27.pdf; https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Economics_SecP2_2026-27.pdf; https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/BusinessStudies_SecP2_2026-27.pdf",
    verified: "2026-10-02",
    excludeSubjects: [
      "Accountancy Class 11",
      "Business Studies Class 11",
      "Geography Class 11",
      "History Class 11",
      "Political Science Class 11",
      "Science Class 9",
      "Science Class 10",
      "SST Class 9",
      "SST Class 10",
      "Math Class 9",
      "Math Class 10",
    ],
    note: "Class XII scope is compared to the 2026-27 CBSE curriculum. Macroeconomics and government-budget topics are tagged to XII; class XI and old-NCERT chapters remain available on their valid board, state-board and olympiad tracks.",
  },
  {
    exam: "ISC Class 11",
    body: "Council for the Indian School Certificate Examinations",
    source:
      "https://cisce.org/wp-content/uploads/2025/04/1.-ISC-Syllabus-Contents.pdf; https://cisce.org/wp-content/uploads/2025/04/27.-ISC-Chemistry-XI-Revised_2025.pdf; https://cisce.org/wp-content/uploads/2025/04/25.-ISC-Physics-XI-Revised_2025.pdf",
    verified: "2026-10-02",
    excludeSubjects: [
      "Biology Class 9",
      "Biology Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Physics Class 9",
      "Physics Class 10",
      "Science Class 9",
      "Science Class 10",
      "Math Class 9",
      "Math Class 10",
      "SST Class 9",
      "SST Class 10",
    ],
    excludeTopicsBySubject: {
      Chemistry: ["Acids Bases and Salts"],
    },
    note: "Class XI follows the current CISCE Class XI syllabus. Remove the Class 9-10 board chapters and the standalone Acids Bases and Salts chapter, which is not an ISC Class XI unit; preserve valid XI subtopics such as mole calculations, IUPAC nomenclature and periodic-table facts where they support the listed units.",
  },
  {
    exam: "ISC Class 12",
    body: "Council for the Indian School Certificate Examinations",
    source:
      "https://cisce.org/wp-content/uploads/2025/04/1.-ISC-Syllabus-Contents.pdf; https://cisce.org/wp-content/uploads/2025/04/ISC-Chemistry-XII.pdf; https://cisce.org/wp-content/uploads/2025/04/9.-ISC-Physics_040424_2025.pdf",
    verified: "2026-10-02",
    excludeSubjects: [
      "Biology Class 9",
      "Biology Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Physics Class 9",
      "Physics Class 10",
      "Science Class 9",
      "Science Class 10",
      "Math Class 9",
      "Math Class 10",
      "SST Class 9",
      "SST Class 10",
    ],
    note: "Class XII topics remain limited to the current CISCE Class XII units; Class 9-10 board material and Class XI-only subjects are not eligible for this tag.",
  },
  {
    exam: "ISC Science",
    body: "Council for the Indian School Certificate Examinations",
    source:
      "https://cisce.org/wp-content/uploads/2025/04/1.-ISC-Syllabus-Contents.pdf; https://cisce.org/wp-content/uploads/2025/04/27.-ISC-Chemistry-XI-Revised_2025.pdf; https://cisce.org/wp-content/uploads/2025/04/ISC-Chemistry-XII.pdf; https://cisce.org/wp-content/uploads/2025/04/25.-ISC-Physics-XI-Revised_2025.pdf; https://cisce.org/wp-content/uploads/2025/04/9.-ISC-Physics_040424_2025.pdf",
    verified: "2026-10-02",
    excludeSubjects: [
      "Biology Class 9",
      "Biology Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Physics Class 9",
      "Physics Class 10",
      "Science Class 9",
      "Science Class 10",
      "Math Class 9",
      "Math Class 10",
      "SST Class 9",
      "SST Class 10",
    ],
    excludeTopicsBySubject: {
      Chemistry: ["Acids Bases and Salts", "Chemical Formulae"],
      Physics: ["Laws and Principles"],
    },
    note: "The combined ISC Science track is the union of current Class XI and XII science subjects, not a third unscoped syllabus. Remove the generic Chemistry Formulae and Laws and Principles buckets and keep old-NCERT/source templates available to their other valid exams.",
  },
  {
    exam: "CBSE Class 11-12 Commerce",
    body: "Central Board of Secondary Education",
    source:
      "https://cbseacademic.nic.in/curriculum_2027.html — Curriculum for Academic Year 2026-27, Senior Secondary Curriculum Part 2",
    verified: "2026-10-02",
    scopeType: "combined-exam",
    note: "This is a combined Commerce practice track, not a single CBSE paper. Its subjects are drawn from the current CBSE senior-secondary curriculum; Accountancy, Business Studies and Economics are the relevant strands. Each subject remains in its own subject/topic slice.",
  },
  {
    exam: "CBSE Class 11-12 Science",
    body: "Central Board of Secondary Education",
    source:
      "https://cbseacademic.nic.in/curriculum_2027.html — Curriculum for Academic Year 2026-27, Senior Secondary Curriculum Part 2 (Physics, Chemistry, Biology, Mathematics and related subjects)",
    verified: "2026-10-02",
    scopeType: "combined-exam",
    note: "This is the combined senior-secondary Science practice track, not a single exam paper. The 2026-27 CBSE curriculum landing page lists the current XI-XII subject syllabi; subject-specific slices remain separated in the bank.",
  },
  {
    exam: "CBSE Class 9-10",
    body: "Central Board of Secondary Education",
    source:
      "https://cbseacademic.nic.in/curriculum_2027.html — Curriculum for Academic Year 2026-27, Secondary Curriculum Part 1 and Secondary Curriculum Part 2",
    verified: "2026-10-02",
    scopeType: "combined-exam",
    excludeSubjects: [
      "Biology Class 9",
      "Biology Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Physics Class 9",
      "Physics Class 10",
    ],
    note: "CBSE Classes IX-X have an integrated Science subject; standalone Physics, Chemistry and Biology class labels are not CBSE exam subjects. Keep the integrated Science, Mathematics, English and Social Science strands. The official 2026-27 page is the source of record.",
  },
  {
    exam: "CBSE MCQ",
    body: "Central Board of Secondary Education",
    source:
      "https://cbseacademic.nic.in/curriculum_2027.html — official CBSE curriculum index for academic year 2026-27",
    verified: "2026-10-02",
    scopeType: "generic-practice",
    excludeSubjects: [
      "Biology Class 9",
      "Biology Class 10",
      "Chemistry Class 9",
      "Chemistry Class 10",
      "Physics Class 9",
      "Physics Class 10",
    ],
    note: "This is a question-format practice tag, not a separate CBSE qualification. For Classes IX-X, CBSE examines integrated Science rather than separate Physics/Chemistry/Biology papers; retain the integrated Science topic buckets and other verified CBSE subjects.",
  },
  {
    exam: "CMA Final",
    body: "The Institute of Cost Accountants of India",
    source:
      "https://icmai.in/ClntStudents/Final_Course_Curriculum — CMA Final Course Curriculum, Syllabus 2022",
    verified: "2026-10-02",
    scopeType: "official-exam",
    note: "The tag is limited to the ICMAI Final course curriculum (Syllabus 2022). The official course page is the source of truth for papers, groups and electives; it is not interchangeable with Foundation or Intermediate.",
  },
  {
    exam: "CMA Foundation",
    body: "The Institute of Cost Accountants of India",
    source:
      "https://icmai.in/ClntStudents/StudyMaterials/1 — Study Materials for Foundation, Syllabus 2022; https://icmai.in/ClntStudents/Foundation_Course_Curriculum",
    verified: "2026-10-02",
    scopeType: "official-exam",
    excludeSubjects: ["Taxation"],
    note: "The Foundation course has four papers: Business Laws and Business Communication; Financial and Cost Accounting; Business Mathematics and Statistics; and Business Economics and Management. Taxation is not a separate Foundation paper and is removed from this tag.",
  },
  {
    exam: "CS Foundation",
    body: "The Institute of Company Secretaries of India",
    source:
      "https://www.icsi.edu/media/webmodules/Notification_fnd_NewSyllabus2017.pdf — Foundation Programme, New Syllabus 2017",
    verified: "2026-10-02",
    scopeType: "legacy",
    excludeSubjects: ["Cost Accounting", "Taxation"],
    note: "This bank label refers to ICSI's legacy Foundation Programme syllabus, not a claim that it is the current entry route. The 2017 programme covered Business Environment and Law, Management/Ethics/Entrepreneurship, Business Economics, and Fundamentals of Accounting and Auditing; standalone Cost Accounting and Taxation are excluded.",
  },
  {
    exam: "CS Professional",
    body: "The Institute of Company Secretaries of India",
    source:
      "https://www.icsi.edu/academic-portal/new-syllabus-2022/professional-programme/ — Professional Programme, Syllabus 2022",
    verified: "2026-10-02",
    scopeType: "official-exam",
    note: "Use the current ICSI Professional Programme Syllabus 2022 page for this tag. The label is distinct from the legacy Foundation tag; subject and elective boundaries follow the official programme structure.",
  },
  {
    exam: "CTET",
    body: "Central Board of Secondary Education (Central Teacher Eligibility Test)",
    source:
      "https://ctet.nic.in/information-bulletin/ — official CTET information bulletins and examination structure",
    verified: "2026-10-02",
    scopeType: "official-exam",
    note: "The current bank tag is a teaching-pedagogy question pool, not a claim of full Paper I/Paper II coverage. CTET also tests languages and age-appropriate Mathematics/Science or Social Studies; those subjects must be mapped to a current bulletin before being advertised as complete coverage.",
  },
  {
    exam: "HTET",
    body: "Board of School Education Haryana",
    source:
      "https://bseh.org.in/uploads/files/3d7b5cf7d6d3c91133a80e9ef3fbfae9.pdf — HTET 2024 Information Bulletin",
    verified: "2026-10-02",
    scopeType: "official-exam",
    note: "The available tag is limited to Teaching Aptitude/pedagogy content. The HTET bulletin separates child development and pedagogy, language, subject-specific sections and level-specific content; this tag alone does not represent a complete level-wise HTET paper.",
  },
  {
    exam: "High-Yield",
    body: "KKCC editorial label; not a conducting body",
    source:
      "https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf; https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf; https://cbseacademic.nic.in/curriculum_2027.html",
    verified: "2026-10-02",
    scopeType: "editorial",
    note: "High-Yield is an internal editorial/practice label, not an official examination or a separate syllabus. The linked official curricula are reference points for cross-exam practice; no government body endorses this label.",
  },
  {
    exam: "ICSE Class 9-10",
    body: "Council for the Indian School Certificate Examinations",
    source:
      "https://cisce.org/wp-content/uploads/2026/01/10.-Physics.pdf — ICSE Physics, Examination Year 2028; https://cisce.org/ — current ICSE Regulations and Syllabuses",
    verified: "2026-10-02",
    scopeType: "combined-exam",
    excludeSubjects: ["Science Class 9", "Science Class 10"],
    note: "ICSE Physics, Chemistry and Biology are separate subjects; remove the blended NCERT Science Class 9/10 buckets from this combined ICSE track. Retain the separate subject-class material and verify each syllabus chapter against the current CISCE year-specific documents.",
  },
  {
    exam: "ICSE MCQ",
    body: "Council for the Indian School Certificate Examinations",
    source:
      "https://cisce.org/wp-content/uploads/2026/01/10.-Physics.pdf — ICSE Physics, Examination Year 2028; https://cisce.org/ — current ICSE Regulations and Syllabuses",
    verified: "2026-10-02",
    scopeType: "generic-practice",
    excludeSubjects: ["Science Class 9", "Science Class 10"],
    note: "This is an MCQ-format practice tag, not a separate ICSE exam. ICSE keeps Physics, Chemistry and Biology as separate subjects, so the integrated NCERT Science class buckets are not applicable; the official CISCE syllabus remains the subject-level source.",
  },
  {
    exam: "NTSE/Olympiad",
    body: "Legacy NTSE reference / general Olympiad practice; not one current conducting body",
    source:
      "https://ncert.nic.in/pdf/notice/Information_Brochure_2019.pdf — NTSE Information Brochure 2019",
    verified: "2026-10-02",
    scopeType: "legacy",
    note: "Keep all 66 old-NCERT templates. NCERT's legacy NTSE brochure states there was no prescribed syllabus and that item standard was Classes IX-X; this combined historical/Olympiad label is not a claim that NTSE is currently active or that all Olympiads share one syllabus.",
  },
  {
    exam: "PSTET",
    body: "Punjab School Education Board",
    source:
      "https://pstet.pseb.ac.in/DownloadDoc/Syllabus-for-all-subjects.pdf; https://pstet.pseb.ac.in/DownloadDoc/Structure-of-PSTET.pdf — official PSTET syllabus and structure",
    verified: "2026-10-02",
    scopeType: "official-exam",
    note: "PSTET Paper I/II are level-specific teacher eligibility papers with language, child development/pedagogy and Mathematics/Science or Social Studies sections. The existing PSTET tag is not a complete syllabus claim; shared core pedagogy/content is separately tagged PSTET/CTET.",
  },
  {
    exam: "PSTET/CTET",
    body: "Punjab School Education Board and Central Board of Secondary Education",
    source:
      "https://pstet.pseb.ac.in/DownloadDoc/Syllabus-for-all-subjects.pdf; https://ctet.nic.in/information-bulletin/ — official PSTET syllabus and CTET bulletins",
    verified: "2026-10-02",
    scopeType: "combined-exam",
    note: "This slash label is a shared practice pool, not a third examination. PSTET and CTET have overlapping teacher-eligibility structures but separate bodies, levels, language options and notifications; confirm each item against the target test before using it as exam-specific practice.",
  },
  {
    exam: "Railway",
    body: "Railway Recruitment Boards; broad practice label",
    source:
      "https://www.rrbcdg.gov.in/uploads/2025/09-LVL1/092025-CEN.pdf — CEN 09/2025 Level-1; https://www.rrbcdg.gov.in/ — official RRB notices",
    verified: "2026-10-02",
    scopeType: "generic-practice",
    note: "Railway is a composite practice tag across distinct RRB notifications and posts, not a single examination. CEN 09/2025 is a reference example; the current post-specific notification controls stages, subjects and syllabus.",
  },
  {
    exam: "SSC",
    body: "Staff Selection Commission; broad practice label",
    source:
      "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf; https://ssc.gov.in/api/attachment/uploads/masterData/Notice_of_adv_mts_2025.pdf — official CGL and MTS notices",
    verified: "2026-10-02",
    scopeType: "generic-practice",
    note: "SSC is a composite practice tag spanning exams with different schemes. The CGL and MTS notices are examples, not a universal syllabus; use the exact examination notification for a particular mock series.",
  },
  {
    exam: "State Board MCQ",
    body: "Punjab School Education Board; generic state-board practice label",
    source:
      "https://pseb.ac.in/structure-of-question-paper-and-syllabus-for-differently-abled-students-including-full-syllabus-of-open-school; https://pseb.ac.in/question-paper-manager — official PSEB syllabus and question-paper structure indexes",
    verified: "2026-10-02",
    scopeType: "generic-practice",
    note: "This is a broad MCQ-format practice label, not one state-board examination or a claim that every state uses the same syllabus. PSEB is the Punjab reference; another state's exact board syllabus must be checked separately.",
  },
  {
    exam: "State Clerk",
    body: "Punjab Subordinate Services Selection Board; broad state-clerk practice label",
    source:
      "https://sssb.punjab.gov.in/Downloads.html — official PSSSB notices and syllabus downloads",
    verified: "2026-10-02",
    scopeType: "generic-practice",
    note: "State Clerk is a composite practice tag, not one permanent recruitment syllabus. The linked PSSSB downloads are the Punjab reference; post-specific notices and amendments govern each recruitment.",
  },
  {
    exam: "State PSC",
    body: "Punjab Public Service Commission; broad state-PSC practice label",
    source:
      "https://ppsc.gov.in/ — official Punjab Public Service Commission notifications, including Punjab State Civil Services",
    verified: "2026-10-02",
    scopeType: "generic-practice",
    note: "State PSC is a composite practice tag, not a uniform syllabus shared by every state's commission. PPSC is the Punjab reference; each commission's current notice controls the applicable examination.",
  },
  {
    exam: "State Police",
    body: "Punjab Police; broad state-police practice label",
    source:
      "https://punjabpolice.gov.in/TSS-CADRE-FAQs/index.html — official Punjab Police recruitment information; https://punjabpolice.gov.in/",
    verified: "2026-10-02",
    scopeType: "generic-practice",
    note: "State Police is a composite practice label. Punjab Police recruitment notices vary by post and year; the linked notice page is an official example, not a universal police-recruitment syllabus.",
  },
  {
    exam: "State Teacher/TET",
    body: "Teacher-eligibility exam bodies; composite practice label",
    source:
      "https://ctet.nic.in/information-bulletin/; https://pstet.pseb.ac.in/DownloadDoc/Syllabus-for-all-subjects.pdf; https://bseh.org.in/uploads/files/3d7b5cf7d6d3c91133a80e9ef3fbfae9.pdf — official CTET, PSTET and HTET sources",
    verified: "2026-10-02",
    scopeType: "generic-practice",
    note: "This is a composite teacher-eligibility practice tag, not a common syllabus. CTET, PSTET, HTET and other state TETs have separate levels, language choices and notices; map the target exam before claiming coverage.",
  },
  {
    exam: "UPSC/SSC/Bank",
    body: "Union Public Service Commission, Staff Selection Commission and banking recruitment bodies",
    source:
      "https://www.upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf; https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf; https://www.ibps.in/ — official exam notifications",
    verified: "2026-10-02",
    scopeType: "combined-exam",
    note: "The slash label is a cross-exam practice pool only. UPSC CSE, SSC examinations and bank recruitment have different patterns and subject boundaries; this tag is not a single official syllabus or a promise of complete coverage for any one of them.",
  },
  {
    exam: "UPTET",
    body: "Examination Regulatory Authority, Uttar Pradesh",
    source: "https://updeled.gov.in/DefaultTET.aspx — official Uttar Pradesh TET candidate portal",
    verified: "2026-10-02",
    scopeType: "official-exam",
    note: "The official portal is the primary source. At verification, no current detailed UPTET syllabus bulletin was available at the candidate page; the existing tag is limited to Teaching Aptitude/pedagogy items and must not be represented as full Paper I/II coverage until a current notice is reviewed.",
  },
] as const;

/**
 * Applies the official-syllabus corrections to a built template list.
 * Returns the number of exam tags removed, for the verification script.
 */
export function applyOfficialSyllabus(
  templates: { subject: string; topic: string; exams: string[] }[],
): number {
  let removed = 0;
  for (const rule of OFFICIAL_SYLLABUS_RULES) {
    const subjects = new Set(rule.excludeSubjects ?? []);
    const topics = new Set(rule.excludeTopics ?? []);
    const topicsBySubject = new Map(
      Object.entries(rule.excludeTopicsBySubject ?? {}).map(([subject, values]) => [
        subject,
        new Set(values),
      ]),
    );
    for (const t of templates) {
      if (!t.exams.includes(rule.exam)) continue;
      if (
        !subjects.has(t.subject) &&
        !topics.has(t.topic) &&
        !topicsBySubject.get(t.subject)?.has(t.topic)
      ) {
        continue;
      }
      t.exams = t.exams.filter((e) => e !== rule.exam);
      removed += 1;
    }
  }
  return removed;
}
