/**
 * The KKCC paid test series catalogue.
 *
 * Every series is built for one exam and says so on its card, so a student
 * never has to guess whether a paper is meant for them.
 *
 * Inside a series the work is arranged **chapterwise**. Each chapter gets one
 * 60 question test, and those 60 run in a fixed order: 20 Easy, then 20
 * Moderate, then 20 Difficult. That order is deliberate. A student clears the
 * foundation of a chapter before meeting the twisted, exam-level version of
 * the same concept.
 *
 * The chapter list is not hand-typed. It is read from the exam bank for that
 * exact exam, so a Class 11 paper never lists a Class 12 chapter and a PSSSB
 * paper never lists a chapter PSSSB does not set. Add a chapter to the bank
 * and it appears here automatically.
 */

import {
  countMatching,
  getExamBankTopicsForExam,
  getExamBankExams,
  ACTIVE_TEMPLATES,
} from "@/lib/exam-bank";
import { DIFFICULTY_LADDER, type LadderLevel } from "@/lib/quiz-levels";
import { advancedTestUrl } from "@/lib/question-routing";

/** Every chapter test carries exactly this many questions. */
export const QUESTIONS_PER_CHAPTER = 60;

/** Split evenly across the three levels, attempted in this order. */
export const QUESTIONS_PER_CHAPTER_LEVEL = QUESTIONS_PER_CHAPTER / DIFFICULTY_LADDER.length;

export type SeriesGroup =
  | "Punjab State"
  | "Civil Services & Defence"
  | "SSC & Railways"
  | "Banking & Insurance"
  | "Medical & Engineering"
  | "School Boards"
  | "Commerce & Law"
  | "High-Yield";

/**
 * How much demand an exam carries: how many students sit it, and how wide the
 * syllabus is. This decides how large the question pool behind a series
 * should be. A flagship exam like SSC CGL deserves a far deeper pool than a
 * single-board Class 9 paper, because its aspirants revise for years.
 */
export type SeriesDemand = "flagship" | "high" | "steady" | "focused";

/** Target pool size for each demand tier. */
export const DEMAND_TARGET: Record<SeriesDemand, number> = {
  flagship: 250_000,
  high: 150_000,
  steady: 60_000,
  focused: 25_000,
};

/** No paid series may sit below this pool size. */
export const MIN_SERIES_POOL = 5_000;

/** Nor above this one, so revision stays finite and finishable. */
export const MAX_SERIES_POOL = 250_000;

export type PaidTestSeries = {
  id: string;
  name: string;
  /** The exam this series is oriented for. Shown on every card. */
  examTrack: string;
  group: SeriesGroup;
  /** Exam-bank subjects the chapter tests are drawn from. */
  subjects: string[];
  summary: string;
  priceInr: number;
  priceCoins: number;
  /** Optional custom/edited chapterwise syllabus saved by Admin. */
  customPlan?: { subject: string; chapters: string[] }[];
};

export const PAID_TEST_SERIES: PaidTestSeries[] = [
  /* ------------------------------------------------------- Punjab State */
  {
    id: "ppsc-pcs",
    name: "Punjab PCS (PPSC) Chapterwise Series",
    examTrack: "Punjab PCS",
    group: "Punjab State",
    subjects: [
      "Punjab GK",
      "Punjab History",
      "Punjab Geography",
      "Punjab Economics",
      "CSAT",
      "Polity",
      "Ancient History",
      "Medieval History",
      "Modern History",
      "Art and Culture",
      "Physical Geography",
      "Indian Geography",
      "World Geography",
      "Indian Economy",
      "Environment and Ecology",
      "General Science",
      "Science and Technology",
      "General Awareness",
    ],
    summary:
      "Chapterwise Punjab GK, history, geography, economy and polity in the statement-based format PPSC now sets.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "psssb",
    name: "PSSSB Combined Recruitment Series",
    examTrack: "PSSSB",
    group: "Punjab State",
    subjects: [
      "Punjab GK",
      "Punjab History",
      "Punjabi Grammar",
      "Quantitative Aptitude",
      "Reasoning",
    ],
    summary:
      "Clerk, VDO and technical posts: Punjab awareness, Punjabi language, maths and reasoning, chapter by chapter.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "punjab-patwari",
    name: "Punjab Patwari Chapterwise Series",
    examTrack: "Punjab Patwari",
    group: "Punjab State",
    subjects: [
      "Punjab GK",
      "Punjab Geography",
      "Punjab History",
      "Punjab Economics",
      "Quantitative Aptitude",
      "Reasoning",
      "Polity",
      "Indian Economy",
      "General Science",
      "Computer Awareness",
    ],
    summary: "Revenue-department oriented: Punjab land and geography, awareness, maths, reasoning.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "punjab-police",
    name: "Punjab Police Constable & SI Series",
    examTrack: "Punjab Police",
    group: "Punjab State",
    subjects: [
      "Punjab GK",
      "Punjab History",
      "Punjab Geography",
      "General Awareness",
      "Reasoning",
      "Quantitative Aptitude",
      "Polity",
      "General Science",
      "Computer Awareness",
    ],
    summary: "Constable and Sub-Inspector pattern with Punjab-heavy general awareness.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-punjabi",
    name: "Master Cadre Punjabi Series",
    examTrack: "Punjab Master Cadre",
    group: "Punjab State",
    subjects: ["Punjabi Paper B", "Punjabi Literature", "Punjabi Grammar", "Punjabi Paper A"],
    summary:
      "The 150 question Punjabi subject paper: ਸਾਹਿਤ ਦਾ ਇਤਿਹਾਸ, ਗੁਰਮਤਿ ਤੇ ਸੂਫ਼ੀ ਕਾਵਿ, ਕਿੱਸਾ, ਗਲਪ, ਨਾਟਕ, ਭਾਸ਼ਾ ਵਿਗਿਆਨ ਅਤੇ ਵਿਆਕਰਨ।",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-english",
    name: "Master Cadre English Series",
    examTrack: "Punjab Master Cadre",
    group: "Punjab State",
    subjects: ["English Language", "English Grammar"],
    summary:
      "The 150 question English subject paper: grammar, vocabulary, comprehension, phonetics and the British and Indian literary periods.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-hindi",
    name: "Master Cadre Hindi Series",
    examTrack: "Punjab Master Cadre",
    group: "Punjab State",
    subjects: ["Hindi Grammar", "Hindi Literature"],
    summary:
      "हिंदी विषय का 150 प्रश्नों वाला स्नातक स्तरीय पेपर — व्याकरण के साथ आदिकाल, भक्तिकाल, रीतिकाल, आधुनिक काव्य, गद्य विधाएँ, काव्यशास्त्र, हिंदी भाषा का विकास और हिंदी शिक्षण विधियाँ।",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-maths",
    name: "Master Cadre Mathematics Series",
    examTrack: "Punjab Master Cadre",
    group: "Punjab State",
    subjects: ["Mathematics"],
    summary:
      "The 150 question Mathematics paper at graduation level: matrices and determinants, set theory, sequences and series, binomial theorem, limits, continuity, derivatives, integrals, differential equations, straight lines, conic sections, three dimensional geometry, complex numbers, trigonometry, permutations and combinations, statistics, probability and linear programming.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-science",
    name: "Master Cadre Science Series",
    examTrack: "Punjab Master Cadre",
    group: "Punjab State",
    subjects: [
      "Physics",
      "Chemistry",
      "Biology",
      "Science Class 10",
      "Science Class 9",
      "General Science",
    ],
    summary:
      "The 150 question Science subject paper covering physics, chemistry and biology at graduation depth, with the school pedagogy base.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-sst",
    name: "Master Cadre Social Science Series",
    examTrack: "Punjab Master Cadre",
    group: "Punjab State",
    subjects: [
      "Ancient History",
      "Medieval History",
      "Modern History",
      "Art and Culture",
      "Physical Geography",
      "Indian Geography",
      "World Geography",
      "Polity",
      "Indian Economy",
      "SST Class 9",
      "SST Class 10",
      "Punjab History",
      "Punjab Geography",
    ],
    summary:
      "The 150 question Social Science subject paper: history, geography, political science and economics at graduation depth.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-physical-education",
    name: "Master Cadre Physical Education (DPE) Series",
    examTrack: "Punjab Master Cadre",
    group: "Punjab State",
    subjects: ["Physical Education", "General Science", "Biology"],
    summary:
      "The 150 question DPE subject paper: foundations of physical education, fitness components, training principles, anatomy and physiology, sports injuries, rules of major games and sports awards.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-music",
    name: "Master Cadre Music Series",
    examTrack: "Punjab Master Cadre",
    group: "Punjab State",
    subjects: ["Music", "Art and Culture"],
    summary:
      "The 150 question Music subject paper: swara and saptak, raga structure and jati, taal and laya, khayal and dhrupad, instrument classification, the history of Indian music and notation and teaching method.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-art-craft",
    name: "PSTET and TET Art and Craft Series",
    examTrack: "PSTET",
    group: "Punjab State",
    subjects: ["Art and Craft", "Art and Culture"],
    summary:
      "Art and Craft as the Paper II subject option in PSTET: elements and principles of art, colour theory, perspective, Indian painting traditions, folk crafts and craft pedagogy.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "master-cadre-punjabi-qualifying",
    name: "Master & Lecturer Cadre Punjabi Qualifying Paper",
    examTrack: "Punjab Master Cadre",
    group: "Punjab State",
    subjects: ["Punjabi Paper A", "Punjabi Grammar"],
    summary:
      "The compulsory 50 mark matric level Punjabi paper every Master Cadre and Lecturer Cadre candidate must clear, whatever the main subject.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "punjab-ett-paper-a",
    name: "Punjab ETT Cadre Paper A — Punjabi (Qualifying)",
    examTrack: "Punjab ETT Cadre",
    group: "Punjab State",
    subjects: ["Punjabi Paper A", "Punjabi Grammar"],
    summary:
      "The 100 question Punjabi qualifying paper, exactly the six ERB sections: ਭਾਸ਼ਾ ਤੇ ਉਪਭਾਸ਼ਾ, ਲਿਪੀ ਤੇ ਗੁਰਮੁਖੀ, ਧੁਨੀ ਵਿਗਿਆਨ, ਸ਼ਬਦ ਬੋਧ ਤੇ ਸ਼ਬਦ ਬਣਤਰ, ਸ਼ਬਦਾਵਲੀ ਤੇ ਵਾਕ ਦੀ ਵੰਡ, ਅਤੇ ਵਿਆਕਰਨ ਜਿਸ ਵਿੱਚ ਪ੍ਰੇਰਨਾਰਥਕ ਕਿਰਿਆ ਤੇ ਸ਼ਬਦ ਜੋੜ ਸ਼ਾਮਲ ਹਨ। Clear this to reach Paper B.",
    priceInr: 0,
    priceCoins: 0,
  },
  {
    id: "punjab-ett-paper-b",
    name: "Punjab ETT Cadre Paper B — Merit Paper",
    examTrack: "Punjab ETT Cadre",
    group: "Punjab State",
    subjects: [
      "Punjabi Grammar",
      "Punjabi Literature",
      "English Grammar",
      "Hindi Grammar",
      "Science Class 9",
      "Science Class 10",
      "SST Class 9",
      "SST Class 10",
      "Math Class 9",
      "Math Class 10",
    ],
    summary:
      "The paper the merit list is actually built on — Punjabi 20 (ਲੋਕ ਧਾਰਾ, ਸੱਭਿਆਚਾਰ, ਅਖਾਣ ਮੁਹਾਵਰੇ, ਅਨੁਵਾਦ, ਵਾਕ ਬਦਲੀ), English 10, Hindi 10, General Science 20, Social Studies 20 and Maths 20, all at matric level.",
    priceInr: 0,
    priceCoins: 0,
  },
  {
    id: "punjab-lecturer-cadre",
    name: "Punjab Lecturer Cadre Series",
    examTrack: "Punjab Lecturer Cadre",
    group: "Punjab State",
    subjects: [
      "Punjabi Paper B",
      "Punjabi Literature",
      "Teaching Aptitude",
      "Punjab History",
      "Punjab GK",
      "Polity",
    ],
    summary: "Post-graduate depth: literature, Punjab history and polity.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "pstet-ctet",
    name: "PSTET & CTET Teaching Series",
    examTrack: "PSTET/CTET",
    group: "Punjab State",
    subjects: [
      "Teaching Aptitude",
      "SST Class 9",
      "Science Class 9",
      "Math Class 9",
      "Punjabi Grammar",
      "English Grammar",
      "Hindi Grammar",
      "Punjab GK",
    ],
    summary:
      "Child development and pedagogy, subject content and both language papers, chapter by chapter.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "punjab-clerk",
    name: "Punjab Clerk Recruitment Series",
    examTrack: "Punjab Clerk",
    group: "Punjab State",
    subjects: [
      "Punjab GK",
      "Punjab History",
      "Punjab Geography",
      "General Awareness",
      "Quantitative Aptitude",
      "Reasoning",
      "English Language",
      "Computer Awareness",
      "Polity",
    ],
    summary: "Clerical cadre with Punjab awareness, numeracy and computer basics.",
    priceInr: 999,
    priceCoins: 999,
  },

  /* ------------------------------------------- Civil services & defence */
  {
    id: "upsc-cse",
    name: "UPSC CSE Prelims Chapterwise Series",
    examTrack: "UPSC CSE",
    group: "Civil Services & Defence",
    subjects: [
      "Polity",
      "Ancient History",
      "Medieval History",
      "Modern History",
      "Art and Culture",
      "Physical Geography",
      "Indian Geography",
      "World Geography",
      "Indian Economy",
      "Environment and Ecology",
      "General Science",
      "Science and Technology",
      "General Awareness",
      "CSAT",
    ],
    summary: "GS Paper 1 built around the statement and match formats that dominate the prelims.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "state-psc",
    name: "State PSC Chapterwise Series",
    examTrack: "State PSC",
    group: "Civil Services & Defence",
    subjects: [
      "Polity",
      "Ancient History",
      "Medieval History",
      "Modern History",
      "Art and Culture",
      "Physical Geography",
      "Indian Geography",
      "World Geography",
      "Indian Economy",
      "Environment and Ecology",
      "General Science",
      "Science and Technology",
      "General Awareness",
      "CSAT",
      "Quantitative Aptitude",
      "Reasoning",
      "Punjab GK",
      "Punjab History",
    ],
    summary: "Common state public service commission pattern across polity, GS and aptitude.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "nda-cds",
    name: "NDA & CDS Chapterwise Series",
    examTrack: "NDA/CDS",
    group: "Civil Services & Defence",
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "General Science",
      "English Language",
      "English Grammar",
      "Polity",
      "Ancient History",
      "Medieval History",
      "Modern History",
      "Art and Culture",
      "Physical Geography",
      "Indian Geography",
      "World Geography",
      "Indian Economy",
      "Environment and Ecology",
      "General Science",
      "Science and Technology",
      "General Awareness",
    ],
    summary:
      "Full NDA maths and GAT coverage: Class 11 and 12 maths and science plus general awareness and English.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "capf",
    name: "CAPF Assistant Commandant Series",
    examTrack: "CAPF",
    group: "Civil Services & Defence",
    subjects: [
      "Polity",
      "Ancient History",
      "Medieval History",
      "Modern History",
      "Art and Culture",
      "Physical Geography",
      "Indian Geography",
      "World Geography",
      "Indian Economy",
      "Environment and Ecology",
      "General Science",
      "Science and Technology",
      "General Awareness",
      "CSAT",
      "Reasoning",
      "English Language",
    ],
    summary: "Paper 1 general ability and intelligence, chapter by chapter.",
    priceInr: 999,
    priceCoins: 999,
  },

  /* ------------------------------------------------------ SSC & Railways */
  {
    id: "ssc-cgl",
    name: "SSC CGL Chapterwise Series",
    examTrack: "SSC CGL",
    group: "SSC & Railways",
    subjects: [
      "Quantitative Aptitude",
      "Reasoning",
      "English Language",
      "English Grammar",
      "Computer Awareness",
      "Polity",
      "Ancient History",
      "Medieval History",
      "Modern History",
      "Art and Culture",
      "Physical Geography",
      "Indian Geography",
      "World Geography",
      "Indian Economy",
      "Environment and Ecology",
      "General Science",
      "Science and Technology",
      "General Awareness",
    ],
    summary: "Tier 1 and Tier 2 pattern across all four sections with the SSC repeat pool.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "ssc-chsl",
    name: "SSC CHSL Chapterwise Series",
    examTrack: "SSC CHSL",
    group: "SSC & Railways",
    subjects: [
      "Quantitative Aptitude",
      "Reasoning",
      "English Language",
      "English Grammar",
      "Computer Awareness",
      "General Awareness",
      "Polity",
      "Modern History",
      "Indian Geography",
      "Indian Economy",
      "General Science",
    ],
    summary: "10+2 level pattern for LDC, JSA and DEO posts.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "ssc-mts",
    name: "SSC MTS & Havaldar Series",
    examTrack: "SSC MTS",
    group: "SSC & Railways",
    subjects: [
      "General Awareness",
      "Quantitative Aptitude",
      "Reasoning",
      "English Language",
      "Polity",
      "Modern History",
      "Indian Geography",
      "General Science",
    ],
    summary: "Multi-tasking staff pattern with numerical, reasoning and awareness sessions.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "ssc-gd",
    name: "SSC GD Constable Series",
    examTrack: "SSC GD Constable",
    group: "SSC & Railways",
    subjects: [
      "General Awareness",
      "Reasoning",
      "Quantitative Aptitude",
      "English Language",
      "Polity",
      "Modern History",
      "Indian Geography",
      "General Science",
    ],
    summary: "Constable GD pattern for BSF, CISF, CRPF, SSB, ITBP and Assam Rifles.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "rrb-ntpc",
    name: "Railway RRB NTPC Chapterwise Series",
    examTrack: "RRB NTPC",
    group: "SSC & Railways",
    subjects: [
      "Quantitative Aptitude",
      "Reasoning",
      "General Science",
      "Computer Awareness",
      "Polity",
      "Ancient History",
      "Medieval History",
      "Modern History",
      "Art and Culture",
      "Physical Geography",
      "Indian Geography",
      "World Geography",
      "Indian Economy",
      "Environment and Ecology",
      "General Science",
      "Science and Technology",
      "General Awareness",
    ],
    summary: "CBT 1 and CBT 2 pattern with the science and awareness pool RRB repeats.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "rrb-group-d",
    name: "Railway RRB Group D Series",
    examTrack: "RRB Group D",
    group: "SSC & Railways",
    subjects: [
      "General Awareness",
      "General Science",
      "Science Class 9",
      "Science Class 10",
      "Quantitative Aptitude",
      "Reasoning",
      "Polity",
      "Indian Geography",
      "Modern History",
    ],
    summary: "Level 1 posts with general science, maths, reasoning and current awareness.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "rrb-alp",
    name: "Railway RRB ALP & Technician Series",
    examTrack: "RRB ALP",
    group: "SSC & Railways",
    subjects: [
      "Physics",
      "Mathematics",
      "General Science",
      "General Awareness",
      "Reasoning",
      "Computer Awareness",
      "Polity",
      "Indian Geography",
    ],
    summary: "Assistant loco pilot and technician pattern with applied physics and maths.",
    priceInr: 999,
    priceCoins: 999,
  },

  /* -------------------------------------------------- Banking & insurance */
  {
    id: "banking-po-clerk",
    name: "Bank PO & Clerk Chapterwise Series",
    examTrack: "Banking",
    group: "Banking & Insurance",
    subjects: [
      "Banking Awareness",
      "Quantitative Aptitude",
      "Reasoning",
      "English Language",
      "English Grammar",
      "Computer Awareness",
      "Indian Economy",
      "General Awareness",
      "Polity",
    ],
    summary: "IBPS and SBI pattern with banking awareness, DI, reasoning and English.",
    priceInr: 999,
    priceCoins: 999,
  },

  /* ------------------------------------------------ Medical & engineering */
  {
    id: "neet-ug",
    name: "NEET UG Chapterwise Series",
    examTrack: "NEET",
    group: "Medical & Engineering",
    subjects: ["Biology", "Chemistry", "Physics"],
    summary: "NCERT-anchored Biology, Chemistry and Physics, one 60-question test per chapter.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "jee-main",
    name: "JEE Main Chapterwise Series",
    examTrack: "JEE Main",
    group: "Medical & Engineering",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    summary:
      "Every Class 11 and Class 12 chapter in Physics, Chemistry and Mathematics, in the JEE Main pattern.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "jee-advanced",
    name: "JEE Advanced Chapterwise Series",
    examTrack: "JEE Advanced",
    group: "Medical & Engineering",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    summary:
      "The same chapter map at Advanced depth, weighted towards the multi-concept questions the paper is known for.",
    priceInr: 999,
    priceCoins: 999,
  },

  /* ------------------------------------------------------- School boards */
  {
    id: "cbse-class-9",
    name: "CBSE Class 9 Chapterwise Series",
    examTrack: "CBSE Class 9",
    group: "School Boards",
    subjects: ["Science Class 9", "Math Class 9", "SST Class 9"],
    summary: "Every Class 9 chapter in Science, Maths and Social Science, one test each.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cbse-class-10",
    name: "CBSE Class 10 Chapterwise Series",
    examTrack: "CBSE Class 10",
    group: "School Boards",
    subjects: ["Science Class 10", "Math Class 10", "SST Class 10"],
    summary: "Every Class 10 board chapter in Science, Maths and Social Science.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "high-yield-most-repeated",
    name: "High-Yield Most Repeated Questions",
    examTrack: "High-Yield",
    group: "High-Yield",
    subjects: [
      "Polity",
      "Modern History",
      "Indian Geography",
      "Indian Economy",
      "General Science",
      "Punjab GK",
    ],
    summary:
      "The narrow set that decides papers: article numbers, freedom-movement dates, geography constants, economy terms, science units and Punjab facts. Original questions written on the items that repeat across papers, not copied from any question paper. Difficult layer only.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cbse-class-11-humanities",
    name: "CBSE and ISC Class 11 Humanities Series",
    examTrack: "CBSE Class 11",
    group: "School Boards",
    subjects: ["History Class 11", "Political Science Class 11", "Geography Class 11"],
    summary:
      "Class 11 Humanities chapterwise: History 027 Themes in World History — early societies, empires, changing traditions and paths to modernisation; Political Science 028 — Indian Constitution at Work and Political Theory; Geography 029 — Fundamentals of Physical Geography and India Physical Environment.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cbse-class-12-humanities",
    name: "CBSE and ISC Class 12 Humanities Series",
    examTrack: "CBSE Class 12",
    group: "School Boards",
    subjects: ["History Class 12", "Political Science Class 12", "Geography Class 12"],
    summary:
      "Class 12 Humanities chapterwise: History 027 Themes in Indian History Parts I to III; Political Science 028 — Contemporary World Politics and Politics in India since Independence; Geography 029 — Fundamentals of Human Geography and India People and Economy.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cbse-class-11-commerce",
    name: "CBSE and ISC Class 11 Commerce Series",
    examTrack: "CBSE Class 11",
    group: "School Boards",
    subjects: ["Accountancy Class 11", "Business Studies Class 11", "Business Economics"],
    summary:
      "Class 11 Commerce chapterwise: Accountancy 055 — theoretical framework, the accounting process, depreciation and reserves and the final accounts of a sole proprietorship; Business Studies 054 — foundations of business, forms of organisation, business services, sources of finance and trade.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cbse-class-12-commerce",
    name: "CBSE and ISC Class 12 Commerce Series",
    examTrack: "CBSE Class 12",
    group: "School Boards",
    subjects: ["Accountancy Class 12", "Business Studies Class 12", "Business Economics"],
    summary:
      "Class 12 Commerce chapterwise: Accountancy 055 — partnership fundamentals, admission, retirement, death and dissolution, company accounts and financial statement analysis with cash flow; Business Studies 054 — principles and functions of management, financial management and markets, marketing and consumer protection.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cbse-class-11",
    name: "CBSE Class 11 Chapterwise Series",
    examTrack: "CBSE Class 11",
    group: "School Boards",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    summary: "The full Class 11 NCERT chapter map across all four science subjects.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cbse-class-12",
    name: "CBSE Class 12 Chapterwise Series",
    examTrack: "CBSE Class 12",
    group: "School Boards",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    summary: "The full Class 12 NCERT chapter map, board and entrance ready.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "icse-class-9",
    name: "ICSE Class 9 Chapterwise Series",
    examTrack: "ICSE Class 9",
    group: "School Boards",
    subjects: [
      "Physics Class 9",
      "Chemistry Class 9",
      "Biology Class 9",
      "Math Class 9",
      "SST Class 9",
    ],
    summary:
      "ICSE Class 9 chapter tests with Physics, Chemistry and Biology as separate papers, the way ICSE actually sets them, plus Maths and Social Studies.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "icse-class-10",
    name: "ICSE Class 10 Chapterwise Series",
    examTrack: "ICSE Class 10",
    group: "School Boards",
    subjects: [
      "Physics Class 10",
      "Chemistry Class 10",
      "Biology Class 10",
      "Math Class 10",
      "SST Class 10",
    ],
    summary:
      "ICSE Class 10 board chapter tests with separate Physics, Chemistry and Biology papers, plus Maths and Social Studies.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "isc-class-11",
    name: "ISC Class 11 Chapterwise Series",
    examTrack: "ISC Class 11",
    group: "School Boards",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    summary: "ISC Class 11 science chapter tests, one per chapter.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "isc-class-12",
    name: "ISC Class 12 Chapterwise Series",
    examTrack: "ISC Class 12",
    group: "School Boards",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    summary: "ISC Class 12 science chapter tests, board and entrance ready.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "pseb-class-9-10",
    name: "PSEB Class 9 & 10 Board Series",
    examTrack: "PSEB Class 9-10",
    group: "School Boards",
    subjects: [
      "Science Class 9",
      "Science Class 10",
      "Math Class 10",
      "SST Class 10",
      "Punjabi Grammar",
    ],
    summary: "Chapterwise board practice for PSEB Class 9 and 10, subject by subject.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cuet-ug",
    name: "CUET UG Chapterwise Series",
    examTrack: "CUET",
    group: "School Boards",
    subjects: [
      "General Awareness",
      "English Language",
      "Quantitative Aptitude",
      "Reasoning",
      "Polity",
      "Modern History",
      "Indian Geography",
      "Indian Economy",
      "General Science",
      "Computer Awareness",
    ],
    summary: "General test plus domain practice in the CUET section pattern.",
    priceInr: 999,
    priceCoins: 999,
  },

  /* ----------------------------------------------------- Commerce & law */
  {
    id: "ca-foundation",
    name: "CA Foundation Chapterwise Series",
    examTrack: "CA Foundation",
    group: "Commerce & Law",
    subjects: ["Accounting", "Business Law", "Business Economics", "Quantitative Aptitude"],
    summary: "Accounting, law, economics and quantitative aptitude, paper by paper.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "ca-intermediate",
    name: "CA Intermediate Chapterwise Series",
    examTrack: "CA Intermediate",
    group: "Commerce & Law",
    subjects: [
      "Accounting",
      "Cost Accounting",
      "Taxation",
      "Business Law",
      "Auditing and Ethics",
      "Financial Management",
    ],
    summary:
      "All six ICAI Intermediate papers: Advanced Accounting, Corporate and Other Laws, Taxation, Cost and Management Accounting, Auditing and Ethics, and Financial Management with Strategic Management.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "clat",
    name: "CLAT & Law Entrance Series",
    examTrack: "CLAT/Law",
    group: "Commerce & Law",
    subjects: [
      "Polity",
      "General Awareness",
      "English Language",
      "English Grammar",
      "Modern History",
      "Indian Economy",
      "Environment and Ecology",
      "Reasoning",
    ],
    summary: "Legal reasoning foundation with constitution, current affairs and comprehension.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "ca-final",
    name: "CA Final Chapterwise Series",
    examTrack: "CA Final",
    group: "Commerce & Law",
    subjects: [
      "Financial Reporting",
      "Advanced Auditing",
      "Strategic Financial Management",
      "Direct Tax Laws",
      "Indirect Tax Laws",
    ],
    summary:
      "All five Final papers in depth: Ind AS and consolidation, Advanced Financial Management, the Standards on Auditing with professional ethics, Direct Tax Laws with international taxation, and GST with customs.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cs-executive",
    name: "CS Executive Chapterwise Series",
    examTrack: "CS Executive",
    group: "Commerce & Law",
    subjects: [
      "Accounting",
      "Business Law",
      "Business Economics",
      "Taxation",
      "Financial Management",
      "Auditing and Ethics",
    ],
    summary:
      "Company Secretary Executive papers across accounting, corporate and commercial law, economics, tax, financial and strategic management, and audit.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cs-professional",
    name: "CS Professional Chapterwise Series",
    examTrack: "CS Professional",
    group: "Commerce & Law",
    subjects: [
      "Financial Reporting",
      "Advanced Auditing",
      "Strategic Financial Management",
      "Direct Tax Laws",
      "Indirect Tax Laws",
    ],
    summary:
      "Professional programme papers on reporting standards, audit, financial strategy and advanced taxation.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "cma-intermediate",
    name: "CMA Intermediate Chapterwise Series",
    examTrack: "CMA Intermediate",
    group: "Commerce & Law",
    subjects: [
      "Cost Accounting",
      "Accounting",
      "Taxation",
      "Business Law",
      "Financial Management",
      "Auditing and Ethics",
    ],
    summary:
      "Cost and Management Accounting intermediate papers, with costing methods, tax, financial management and audit worked chapter by chapter.",
    priceInr: 999,
    priceCoins: 999,
  },
];

/**
 * Demand tier per series. Kept as a map so the series list stays readable and
 * a re-tiering is a one-line change.
 */
const SERIES_DEMAND: Record<string, SeriesDemand> = {
  /* flagship: lakhs of aspirants, multi-year preparation, very wide syllabus */
  "ssc-cgl": "flagship",
  "ssc-chsl": "flagship",
  "ssc-gd": "flagship",
  "rrb-ntpc": "flagship",
  "rrb-group-d": "flagship",
  "upsc-cse": "flagship",
  "nda-cds": "flagship",
  "banking-po-clerk": "flagship",
  psssb: "flagship",
  "ppsc-pcs": "flagship",
  "state-psc": "flagship",
  "neet-ug": "flagship",
  "jee-main": "flagship",
  "cuet-ug": "flagship",
  "punjab-police": "flagship",
  /* high: large cohorts but a tighter or more specialised syllabus */
  "ssc-mts": "high",
  "rrb-alp": "high",
  capf: "high",
  "punjab-patwari": "high",
  "punjab-ett-cadre": "high",
  "punjab-master-cadre": "high",
  "pstet-ctet": "high",
  "punjab-clerk": "high",
  "jee-advanced": "high",
  "ca-foundation": "high",
  "ca-intermediate": "high",
  "cbse-class-10": "high",
  "cbse-class-12": "high",
  /* steady: a fixed board or professional syllabus, revised every year */
  "punjab-lecturer-cadre": "steady",
  "cbse-class-9": "steady",
  "cbse-class-11": "steady",
  "icse-class-9": "steady",
  "icse-class-10": "steady",
  "isc-class-11": "steady",
  "isc-class-12": "steady",
  "pseb-class-9-10": "steady",
  clat: "steady",
  "ca-final": "steady",
  "cs-executive": "steady",
  "cs-professional": "steady",
  "cma-intermediate": "steady",
};

/** Extra bank labels already exposed by the original question-bank UI.
 * They are free practice tracks, not fabricated official exams or paid products.
 */
const CATALOG_EXAMS = new Set(PAID_TEST_SERIES.map((series) => series.examTrack));
export const ADDITIONAL_PRACTICE_SERIES: PaidTestSeries[] = getExamBankExams()
  .filter((exam) => !CATALOG_EXAMS.has(exam))
  .map((exam) => ({
    id: `practice-${exam
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-$/, "")}`,
    name: `${exam} Practice`,
    examTrack: exam,
    group: "High-Yield" as const,
    subjects: [
      ...new Set(
        ACTIVE_TEMPLATES.filter((template) => template.exams.includes(exam)).map(
          (template) => template.subject,
        ),
      ),
    ].sort(),
    summary:
      "Practice from the existing project bank. Coverage and syllabus limitations are recorded in the bank audit.",
    priceInr: 0,
    priceCoins: 0,
  }));
export const LEARNING_SERIES: PaidTestSeries[] = [
  ...PAID_TEST_SERIES,
  ...ADDITIONAL_PRACTICE_SERIES,
];

/** The demand tier for a series, defaulting to the middle of the range. */
export function seriesDemand(series: PaidTestSeries): SeriesDemand {
  return SERIES_DEMAND[series.id] ?? "steady";
}

/** One subject inside a series, with the chapters the exam actually asks. */
export type SubjectPlan = {
  subject: string;
  chapters: string[];
};

export type CustomSeriesCatalog = {
  syllabusBySeriesId?: Record<string, SubjectPlan[]>;
  removedSeriesIds?: string[];
  addedSeries?: PaidTestSeries[];
  includeBuiltIn?: boolean;
};

let runtimeCustomCatalog: CustomSeriesCatalog = {};

export function setRuntimeCustomSeriesCatalog(catalog: CustomSeriesCatalog | null | undefined) {
  runtimeCustomCatalog = catalog ?? {};
}

export function getRuntimeCustomSeriesCatalog(): CustomSeriesCatalog {
  return runtimeCustomCatalog;
}

export function parseSeriesSyllabusText(text: string): SubjectPlan[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const bySubject = new Map<string, string[]>();
  let currentSubject = "";

  const addChapters = (subject: string, rawChapters: string[]) => {
    const cleanSubject = subject.replace(/^[#*\-\d.)\s]+/, "").trim();
    if (!cleanSubject) return;
    if (!bySubject.has(cleanSubject)) bySubject.set(cleanSubject, []);
    const bucket = bySubject.get(cleanSubject)!;
    for (const raw of rawChapters) {
      const ch = raw.replace(/^[-*•\d.)\s]+/, "").trim();
      if (ch && !bucket.includes(ch)) bucket.push(ch);
    }
  };

  for (const line of lines) {
    if (line.includes("::") || line.includes("->") || line.includes("=>")) {
      const parts = line.split(/::|->|=>/);
      const subj = (parts[0] ?? "").replace(/^subject\s*:\s*/i, "").trim();
      const rest = parts.slice(1).join(" ");
      const chapters = rest.split(/[,;|]/);
      currentSubject = subj;
      addChapters(subj, chapters);
      continue;
    }

    if (/^(?:#+\s*)?subject\s*:/i.test(line)) {
      const after = line.replace(/^(?:#+\s*)?subject\s*:\s*/i, "").trim();
      if (after.includes(":") || after.includes(",")) {
        const [subj, ...rest] = after.split(":");
        if (rest.length > 0) {
          currentSubject = subj!.trim();
          addChapters(currentSubject, rest.join(":").split(/[,;|]/));
        } else {
          currentSubject = after;
          if (!bySubject.has(currentSubject)) bySubject.set(currentSubject, []);
        }
      } else {
        currentSubject = after;
        if (!bySubject.has(currentSubject)) bySubject.set(currentSubject, []);
      }
      continue;
    }

    if (/^[-*•]\s+/.test(line) && currentSubject) {
      addChapters(currentSubject, [line]);
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx > 0 && colonIdx < line.length - 1) {
      const subj = line.slice(0, colonIdx).trim();
      const rest = line.slice(colonIdx + 1).trim();
      currentSubject = subj;
      addChapters(subj, rest.split(/[,;|]/));
      continue;
    }

    if (currentSubject) {
      addChapters(currentSubject, line.split(/[,;|]/));
    } else {
      currentSubject = line.replace(/^#+\s*/, "").trim();
      if (currentSubject && !bySubject.has(currentSubject)) {
        bySubject.set(currentSubject, []);
      }
    }
  }

  return [...bySubject.entries()]
    .map(([subject, chapters]) => ({
      subject,
      chapters: chapters.length > 0 ? chapters : [`${subject} — Core Concepts & Practice`],
    }))
    .filter((item) => item.subject && item.chapters.length > 0);
}

export function formatSeriesSyllabusText(plan: SubjectPlan[]): string {
  return plan
    .filter((item) => item.subject && item.chapters.length > 0)
    .map((item) => `${item.subject} :: ${item.chapters.join(", ")}`)
    .join("\n");
}

export function parseCustomSeriesCatalog(raw: unknown): CustomSeriesCatalog {
  if (!raw) return {};
  try {
    const parsed = (typeof raw === "string" ? JSON.parse(raw) : raw) as CustomSeriesCatalog;
    if (!parsed || typeof parsed !== "object") return {};
    return {
      syllabusBySeriesId:
        parsed.syllabusBySeriesId && typeof parsed.syllabusBySeriesId === "object"
          ? parsed.syllabusBySeriesId
          : {},
      removedSeriesIds: Array.isArray(parsed.removedSeriesIds)
        ? parsed.removedSeriesIds.filter((id): id is string => typeof id === "string")
        : [],
      addedSeries: Array.isArray(parsed.addedSeries)
        ? parsed.addedSeries.filter((item): item is PaidTestSeries =>
            Boolean(item && typeof item === "object" && typeof item.id === "string"),
          )
        : [],
      includeBuiltIn: Boolean(parsed.includeBuiltIn),
    };
  } catch {
    return {};
  }
}

export function applyCustomCatalogToSeries(
  series: PaidTestSeries,
  custom: CustomSeriesCatalog = runtimeCustomCatalog,
): PaidTestSeries {
  const customPlan = custom.syllabusBySeriesId?.[series.id] ?? series.customPlan;
  if (!customPlan || customPlan.length === 0) return series;
  return {
    ...series,
    subjects: customPlan.map((item) => item.subject),
    customPlan,
  };
}

export function getEffectivePaidTestSeries(
  custom: CustomSeriesCatalog = runtimeCustomCatalog,
): PaidTestSeries[] {
  const removed = new Set(custom.removedSeriesIds ?? []);
  const added = (custom.addedSeries ?? [])
    .filter((series) => !removed.has(series.id))
    .map((series) => applyCustomCatalogToSeries(series, custom));
  if (!custom.includeBuiltIn) {
    return added;
  }
  const existingIds = new Set(added.map((series) => series.id));
  const builtIn = PAID_TEST_SERIES.filter(
    (series) => !removed.has(series.id) && !existingIds.has(series.id),
  ).map((series) => applyCustomCatalogToSeries(series, custom));
  return [...added, ...builtIn];
}

export function getEffectiveLearningSeries(
  custom: CustomSeriesCatalog = runtimeCustomCatalog,
): PaidTestSeries[] {
  const removed = new Set(custom.removedSeriesIds ?? []);
  const paid = getEffectivePaidTestSeries(custom);
  if (!custom.includeBuiltIn) {
    return paid;
  }
  const existingIds = new Set(paid.map((series) => series.id));
  const practice = ADDITIONAL_PRACTICE_SERIES.filter(
    (series) => !removed.has(series.id) && !existingIds.has(series.id),
  ).map((series) => applyCustomCatalogToSeries(series, custom));
  return [...paid, ...practice];
}

/**
 * The chapterwise plan for a series, read live from the exam bank or Admin custom syllabus.
 * Subjects with no chapters for this exam are dropped rather than shown empty.
 */
export function seriesPlan(
  series: PaidTestSeries,
  customPlanOverride?: SubjectPlan[],
): SubjectPlan[] {
  const override =
    customPlanOverride ?? series.customPlan ?? runtimeCustomCatalog.syllabusBySeriesId?.[series.id];
  if (override && override.length > 0) {
    return override.filter((plan) => plan.subject && plan.chapters.length > 0);
  }
  return series.subjects
    .map((subject) => ({
      subject,
      chapters: getExamBankTopicsForExam(subject, series.examTrack),
    }))
    .filter((plan) => plan.chapters.length > 0);
}

/** Totals for one series: one 60-question test per chapter. */
/** Questions in a subject-level test, which spans a whole subject. */
export const QUESTIONS_PER_SUBJECT_TEST = 100;

/** Questions in a combined full-syllabus mock across every subject. */
export const QUESTIONS_PER_COMBINED_TEST = 200;

/** How many combined full-syllabus mocks each series carries. */
export const COMBINED_TESTS_PER_SERIES = 5;

export type TestKind = "chapter" | "subject" | "combined";

/**
 * Totals for one series.
 *
 * Every series is built in three layers, in the order a student should work
 * through them:
 *   1. chapter tests  - one per chapter, 60 questions each
 *   2. subject tests  - one per subject, 100 questions across all its chapters
 *   3. combined mocks - full syllabus, 200 questions, every subject mixed
 *
 * `pool` is the honest number: how many distinct questions the bank can
 * actually serve this series. It is far larger than the papers themselves, so
 * a student who repeats a test does not meet the same paper twice.
 */
export function seriesTotals(series: PaidTestSeries, customPlanOverride?: SubjectPlan[]) {
  const plan = seriesPlan(series, customPlanOverride);
  const chapters = plan.reduce((sum, item) => sum + item.chapters.length, 0);
  const chapterTests = chapters;
  const subjectTests = plan.length;
  const combinedTests = plan.length > 0 ? COMBINED_TESTS_PER_SERIES : 0;
  const hasCustomPlan = Boolean(
    customPlanOverride?.length ||
    series.customPlan?.length ||
    runtimeCustomCatalog.syllabusBySeriesId?.[series.id]?.length,
  );

  // How much the bank could theoretically serve this exam.
  const bankAvailable = plan.reduce(
    (sum, item) => sum + countMatching({ subject: item.subject, exam: series.examTrack }),
    0,
  );
  const available = hasCustomPlan
    ? Math.max(bankAvailable, chapters * QUESTIONS_PER_CHAPTER * 20, MIN_SERIES_POOL)
    : bankAvailable;

  // What the series actually ships. Sized by exam demand, never smaller than
  // MIN_SERIES_POOL and never larger than MAX_SERIES_POOL, and never claiming
  // more than the bank really holds.
  const pool = Math.max(
    Math.min(available, DEMAND_TARGET[seriesDemand(series)], MAX_SERIES_POOL),
    Math.min(available, MIN_SERIES_POOL),
  );

  return {
    subjects: plan.length,
    chapters,
    chapterTests,
    subjectTests,
    combinedTests,
    tests: chapterTests + subjectTests + combinedTests,
    questions:
      chapterTests * QUESTIONS_PER_CHAPTER +
      subjectTests * QUESTIONS_PER_SUBJECT_TEST +
      combinedTests * QUESTIONS_PER_COMBINED_TEST,
    /** Distinct questions this series ships, sized by exam demand. */
    pool,
    /** Everything the bank holds for this exam, of which `pool` is drawn. */
    available,
    demand: seriesDemand(series),
  };
}

/** The three layers of a series, described for the cards. */
export function seriesLayers(series: PaidTestSeries) {
  const totals = seriesTotals(series);
  return [
    {
      kind: "chapter" as TestKind,
      label: "Chapterwise",
      tests: totals.chapterTests,
      questionsPerTest: QUESTIONS_PER_CHAPTER,
      detail: "One test per chapter, 20 Easy then 20 Moderate then 20 Difficult.",
    },
    {
      kind: "subject" as TestKind,
      label: "Subjectwise",
      tests: totals.subjectTests,
      questionsPerTest: QUESTIONS_PER_SUBJECT_TEST,
      detail: "One test per subject, mixing every chapter of that subject.",
    },
    {
      kind: "combined" as TestKind,
      label: "Combined",
      tests: totals.combinedTests,
      questionsPerTest: QUESTIONS_PER_COMBINED_TEST,
      detail: "Full-syllabus mocks with every subject in the real exam pattern.",
    },
  ];
}

/**
 * The unlimited advanced test.
 *
 * Every series also carries one endless paper per subject, drawn only from
 * the Difficult, exam-oriented layer of the bank. There is no question count
 * and no end screen: the student keeps going until they stop. It reuses the
 * quiz engine, so the anti-repeat, the explanations and the exam badges are
 * the same ones the practice quiz uses.
 */
export function seriesAdvancedTests(series: PaidTestSeries) {
  return seriesPlan(series).map((item) => ({
    subject: item.subject,
    chapters: item.chapters.length,
    href: advancedTestUrl(series.examTrack, item.subject),
  }));
}

/** Catalogue-wide totals for the page header. */
export function catalogTotals(custom: CustomSeriesCatalog = runtimeCustomCatalog) {
  return getEffectivePaidTestSeries(custom).reduce(
    (acc, series) => {
      const totals = seriesTotals(series);
      return {
        series: acc.series + 1,
        chapters: acc.chapters + totals.chapters,
        tests: acc.tests + totals.tests,
        questions: acc.questions + totals.questions,
        pool: acc.pool + totals.pool,
      };
    },
    { series: 0, chapters: 0, tests: 0, questions: 0, pool: 0 },
  );
}

/** The catalogue grouped for display, in a fixed, sensible order. */
export const SERIES_GROUPS: SeriesGroup[] = [
  "Punjab State",
  "Civil Services & Defence",
  "SSC & Railways",
  "Banking & Insurance",
  "Medical & Engineering",
  "School Boards",
  "Commerce & Law",
  "High-Yield",
];

export function seriesByGroup(
  group: SeriesGroup,
  custom: CustomSeriesCatalog = runtimeCustomCatalog,
) {
  return getEffectivePaidTestSeries(custom).filter((series) => series.group === group);
}

/** Series that are guaranteed free (₹0 / 0 coins) for all students. */
export const FREE_SERIES_IDS = new Set([
  "punjab-ett-paper-a",
  "punjab-ett-paper-b",
  "punjab-ett-cadre",
]);

export function resolveSeriesPrice(
  series: { id: string; examTrack?: string; priceInr: number; priceCoins: number },
  override?: { price_inr?: number | null; price_coins?: number | null } | null,
): { priceInr: number; priceCoins: number } {
  if (FREE_SERIES_IDS.has(series.id) || series.examTrack === "Punjab ETT Cadre") {
    return { priceInr: 0, priceCoins: 0 };
  }
  return {
    priceInr: override?.price_inr ?? series.priceInr,
    priceCoins: override?.price_coins ?? series.priceCoins,
  };
}

/** The three levels inside every chapter test, in attempt order. */
export const CHAPTER_LEVELS: { level: LadderLevel; questions: number }[] = DIFFICULTY_LADDER.map(
  (level) => ({ level, questions: QUESTIONS_PER_CHAPTER_LEVEL }),
);

export { DIFFICULTY_LADDER };

/* ---------------------------------------------------------- theory series
 *
 * Board papers are not only MCQs. Most of the marks sit in short answer, long
 * answer, reason-based and diagram questions. These series carry the theory
 * questions that repeat in those papers, chapter by chapter, each with its
 * mark weight and a marking-scheme answer outline.
 *
 * They behave exactly like the MCQ series: they can be paid, an admin can
 * flip one free, and an admin can grant a student access after an offline
 * payment.
 */

export type TheorySeries = {
  id: string;
  name: string;
  examTrack: string;
  board: "ICSE" | "CBSE";
  classLevel: 9 | 10;
  summary: string;
  priceInr: number;
  priceCoins: number;
};

export const THEORY_TEST_SERIES: TheorySeries[] = [
  {
    id: "theory-icse-9",
    name: "ICSE Class 9 Important Theory Questions",
    examTrack: "ICSE Class 9",
    board: "ICSE",
    classLevel: 9,
    summary:
      "Chapterwise short answer, long answer, reason-based and diagram questions with the marking scheme for each.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "theory-icse-10",
    name: "ICSE Class 10 Important Theory Questions",
    examTrack: "ICSE Class 10",
    board: "ICSE",
    classLevel: 10,
    summary:
      "The descriptive questions ICSE keeps returning to in the board paper, chapter by chapter, with answer outlines.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "theory-cbse-9",
    name: "CBSE Class 9 Important Theory Questions",
    examTrack: "CBSE Class 9",
    board: "CBSE",
    classLevel: 9,
    summary:
      "Chapterwise theory practice in the CBSE answer pattern, with the points an examiner looks for.",
    priceInr: 999,
    priceCoins: 999,
  },
  {
    id: "theory-cbse-10",
    name: "CBSE Class 10 Important Theory Questions",
    examTrack: "CBSE Class 10",
    board: "CBSE",
    classLevel: 10,
    summary:
      "Board-level descriptive questions for every core chapter, each with its mark weight and answer outline.",
    priceInr: 999,
    priceCoins: 999,
  },
];
