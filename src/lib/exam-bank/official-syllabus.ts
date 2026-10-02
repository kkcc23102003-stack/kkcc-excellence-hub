/**
 * Official syllabus corrections.
 *
 * Every rule below was checked against the conducting body's own notification
 * or syllabus document, not against any coaching site and not from memory.
 * The `source` field records the exact document the rule came from, so the
 * rule can be re-checked when the body revises its syllabus.
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
  /** Chapters the official syllabus does not contain. */
  excludeTopics?: readonly string[];
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
    for (const t of templates) {
      if (!t.exams.includes(rule.exam)) continue;
      if (!subjects.has(t.subject) && !topics.has(t.topic)) continue;
      t.exams = t.exams.filter((e) => e !== rule.exam);
      removed += 1;
    }
  }
  return removed;
}
