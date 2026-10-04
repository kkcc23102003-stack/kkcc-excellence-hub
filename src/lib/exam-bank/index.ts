/**
 * KKCC mega exam question bank — public API.
 *
 * Combines every template family into one addressable bank. Because each
 * template exposes a finite `count` and a deterministic `at(index)`, the whole
 * bank is enumerable: `EXAM_BANK_TOTAL` counts parameter positions, NOT unique verified/PYQ questions.
 */

import {
  isPublishableQuestion,
  type Difficulty,
  type GeneratedQuestion,
  type Template,
} from "./core";
import { QUANT_TEMPLATES } from "./quant";
import { REASONING_TEMPLATES } from "./reasoning";
import { GK_TEMPLATES } from "./facts-gk";
import { BANKING_TEMPLATES } from "./facts-banking";
import { NEET_TEMPLATES } from "./neet";
import { NEET_BIO_TEMPLATES } from "./neet-bio";
import { CHEM_EXTRA_TEMPLATES } from "./neet-chem";
import { JEE_TEMPLATES } from "./jee";
import { CA_TEMPLATES } from "./ca";
import { ENGLISH_TEMPLATES } from "./english";
import { EXTRA_FACT_TEMPLATES } from "./facts-extra";
import { UPSC_TEMPLATES } from "./upsc";
import { PUNJAB_TEMPLATES } from "./punjab";
import { PUNJABI_TEMPLATES } from "./punjabi";
import { HINDI_TEMPLATES } from "./hindi";
import { ENGLISH_GRAMMAR_TEMPLATES } from "./english-grammar";
import { PSEB_TEMPLATES } from "./pseb";
import { PHYSICS_TEMPLATES } from "./physics";
import { MATHS_TEMPLATES } from "./maths";
import { ICSE_TEMPLATES } from "./icse";
import { ICSE_MATHS_TEMPLATES } from "./icse-maths";
import { NCERT9_TEMPLATES } from "./ncert9";
import { NCERT10_TEMPLATES } from "./ncert10";
import { SST_TEMPLATES } from "./sst";
import { POLITY_FULL_TEMPLATES } from "./polity-full";
import { HISTORY_TEMPLATES } from "./history";
import { GEOGRAPHY_TEMPLATES } from "./geography";
import { ECONOMY_TEMPLATES } from "./economy";
import { ENVIRONMENT_TEMPLATES } from "./environment";
import { SCIENCE_TECH_TEMPLATES } from "./science-tech";
import { REASONING_FULL_TEMPLATES } from "./reasoning-full";
import { QUANT_FULL_TEMPLATES } from "./quant-full";
import { ENGLISH_FULL_TEMPLATES } from "./english-full";
import { COMPUTER_BANKING_TEMPLATES } from "./computer-banking";
import { PUNJAB_FULL_TEMPLATES } from "./punjab-full";
import { CSAT_TEMPLATES } from "./csat";
import { GS_EXTRA_TEMPLATES } from "./gs-extra";
import { TEACHING_TEMPLATES } from "./teaching";
import { PUNJABI_FULL_TEMPLATES } from "./punjabi-full";
import { HINDI_FULL_TEMPLATES } from "./hindi-full";
import { CA_FULL_TEMPLATES } from "./ca-full";
import { ICSE_FULL_TEMPLATES } from "./icse-full";
import { CHEMISTRY_FULL_TEMPLATES } from "./chemistry-full";
import { CA_ADVANCED_TEMPLATES } from "./ca-advanced";
import { TEACHING_GS_FULL_TEMPLATES } from "./teaching-gs-full";
import { PUNJAB_CADRE_FIX_TEMPLATES } from "./punjab-cadre-fix";
import { ICSE_BIO_FIX_TEMPLATES } from "./icse-bio-fix";
import { MASTER_CADRE_MATHS_TEMPLATES } from "./master-cadre-maths";
import { ICSE9_FULL_TEMPLATES } from "./icse9-full";
import { ETT_MASTER_FIX_TEMPLATES } from "./ett-master-fix";
import { ICSE_MATHS_FULL_TEMPLATES } from "./icse-maths-full";
import { HINDI_LITERATURE_TEMPLATES } from "./hindi-literature";
import { ICSE10_FULL_TEMPLATES } from "./icse10-full";
import { CA_FINAL_FULL_TEMPLATES } from "./ca-final-full";
import { CA_INTER_FULL_TEMPLATES } from "./ca-inter-full";
import { SST_FULL_TEMPLATES } from "./sst-full";
import { HISTORY_FULL2_TEMPLATES } from "./history-full2";
import { GS_FULL2_TEMPLATES } from "./gs-full2";
import { CADRE_PRO_FULL_TEMPLATES } from "./cadre-pro-full";
import { LANG_CADRE_FULL_TEMPLATES } from "./lang-cadre-full";
import { GS_COMMERCE_FULL_TEMPLATES } from "./gs-commerce-full";
import { HIGH_YIELD_TEMPLATES } from "./high-yield";
import { CMA_PAPERS_TEMPLATES } from "./cma-papers";
import { SCHOOL_EXTRA_TEMPLATES } from "./school-extra";
import { HUMANITIES_SCHOOL_TEMPLATES } from "./humanities-school";
import { COMMERCE_SCHOOL_TEMPLATES } from "./commerce-school";
import { MUSIC_CADRE_TEMPLATES } from "./music-cadre";
import { CTET_OFFICIAL_TEMPLATES } from "./ctet-official";
import { NEET_BIO_OFFICIAL_TEMPLATES } from "./neet-bio-official";
import { CURRICULUM_PRACTICE_TEMPLATES, foundationRecallPractice } from "./curriculum-practice";
import { applySchoolGradeScope } from "./school-scope";
import { applyOfficialSyllabus } from "./official-syllabus";

export type { Difficulty, GeneratedQuestion, Template } from "./core";
export { DIFFICULTIES } from "./core";

const RAW_TEMPLATES: Template[] = [
  ...PHYSICS_TEMPLATES,
  ...MATHS_TEMPLATES,
  ...ICSE_TEMPLATES,
  ...ICSE_MATHS_TEMPLATES,
  ...NCERT9_TEMPLATES,
  ...NCERT10_TEMPLATES,
  ...SST_TEMPLATES,
  ...POLITY_FULL_TEMPLATES,
  ...HISTORY_TEMPLATES,
  ...GEOGRAPHY_TEMPLATES,
  ...ECONOMY_TEMPLATES,
  ...ENVIRONMENT_TEMPLATES,
  ...SCIENCE_TECH_TEMPLATES,
  ...REASONING_FULL_TEMPLATES,
  ...QUANT_FULL_TEMPLATES,
  ...ENGLISH_FULL_TEMPLATES,
  ...COMPUTER_BANKING_TEMPLATES,
  ...PUNJAB_FULL_TEMPLATES,
  ...CSAT_TEMPLATES,
  ...GS_EXTRA_TEMPLATES,
  ...TEACHING_TEMPLATES,
  ...PUNJABI_FULL_TEMPLATES,
  ...HINDI_FULL_TEMPLATES,
  ...CA_FULL_TEMPLATES,
  ...ICSE_FULL_TEMPLATES,
  ...CHEMISTRY_FULL_TEMPLATES,
  ...CA_ADVANCED_TEMPLATES,
  ...TEACHING_GS_FULL_TEMPLATES,
  ...PUNJAB_CADRE_FIX_TEMPLATES,
  ...ICSE_BIO_FIX_TEMPLATES,
  ...MASTER_CADRE_MATHS_TEMPLATES,
  ...ICSE9_FULL_TEMPLATES,
  ...ETT_MASTER_FIX_TEMPLATES,
  ...ICSE_MATHS_FULL_TEMPLATES,
  ...HINDI_LITERATURE_TEMPLATES,
  ...ICSE10_FULL_TEMPLATES,
  ...CA_FINAL_FULL_TEMPLATES,
  ...CA_INTER_FULL_TEMPLATES,
  ...SST_FULL_TEMPLATES,
  ...HISTORY_FULL2_TEMPLATES,
  ...GS_FULL2_TEMPLATES,
  ...CADRE_PRO_FULL_TEMPLATES,
  ...LANG_CADRE_FULL_TEMPLATES,
  ...GS_COMMERCE_FULL_TEMPLATES,
  ...NEET_BIO_OFFICIAL_TEMPLATES,
  ...CTET_OFFICIAL_TEMPLATES,
  ...MUSIC_CADRE_TEMPLATES,
  ...COMMERCE_SCHOOL_TEMPLATES,
  ...HUMANITIES_SCHOOL_TEMPLATES,
  ...SCHOOL_EXTRA_TEMPLATES,
  ...CMA_PAPERS_TEMPLATES,
  ...HIGH_YIELD_TEMPLATES,
  ...QUANT_TEMPLATES,
  ...REASONING_TEMPLATES,
  ...GK_TEMPLATES,
  ...BANKING_TEMPLATES,
  ...NEET_TEMPLATES,
  ...NEET_BIO_TEMPLATES,
  ...CHEM_EXTRA_TEMPLATES,
  ...JEE_TEMPLATES,
  ...CA_TEMPLATES,
  ...ENGLISH_TEMPLATES,
  ...EXTRA_FACT_TEMPLATES,
  ...UPSC_TEMPLATES,
  ...PUNJAB_TEMPLATES,
  ...PUNJABI_TEMPLATES,
  ...HINDI_TEMPLATES,
  ...ENGLISH_GRAMMAR_TEMPLATES,
  ...PSEB_TEMPLATES,
  ...CURRICULUM_PRACTICE_TEMPLATES,
];

// Template ids are used as stable React/data keys. A few legacy families
// accidentally reused the same id while carrying different question builders.
// Preserve every question family but make the exported ids deterministic and
// unique so one family can never overwrite another in a map or UI key.
const TEMPLATE_ID_SEEN = new Map<string, number>();
export const ALL_TEMPLATES: Template[] = RAW_TEMPLATES.map((template) => {
  const seen = (TEMPLATE_ID_SEEN.get(template.id) ?? 0) + 1;
  TEMPLATE_ID_SEEN.set(template.id, seen);
  return seen === 1 ? template : { ...template, id: `${template.id}#${seen}` };
});

/**
 * Subjects a paper covers in full, listed against the exam that sets it.
 *
 * A chapter is written once and tagged with the exams its author had in mind,
 * which under-counts whenever a later paper adopts the whole subject. The ETT
 * Paper B merit paper, for instance, asks the complete matric Maths, Social
 * Studies and Hindi syllabus, and the Master Cadre Science paper asks
 * graduation level Physics, Chemistry and Biology — yet those chapters
 * carried no such tag, so the series showed a fraction of its real chapter
 * list.
 *
 * Every pair below is a whole subject the exam genuinely examines. Splits
 * that are deliberate are NOT listed: CBSE and ISC Class 11 against Class 12,
 * JEE Main against JEE Advanced, and the ICSE-only Maths chapters that a CBSE
 * student must never be shown.
 */
const WHOLE_SUBJECT_PAPERS: Record<string, readonly string[]> = {
  // PSTET fixes Language I as Punjabi and Language II as English, each a
  // full 30-mark section in both papers. Source: SCERT Punjab PSTET
  // notification, structure of Paper I and Paper II.
  PSTET: [
    "Punjabi Grammar",
    "Punjabi Literature",
    "English Grammar",
    "English Language",
    // Art and Craft, Music and Science & Maths are the Paper II subject
    // options PSTET publishes separate answer keys for.
    "Art and Craft",
    "Music",
  ],
  "Punjab ETT Cadre": [
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
  "Punjab Master Cadre": [
    "Art and Culture",
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics",
    "Science Class 9",
    "Science Class 10",
    "SST Class 9",
    "SST Class 10",
    "English Language",
    "English Grammar",
    "Hindi Grammar",
    "Hindi Literature",
    "Punjabi Paper A",
    "Punjabi Literature",
  ],
  "Punjab Lecturer Cadre": [
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics",
    "English Language",
    "English Grammar",
    "Hindi Grammar",
    "Hindi Literature",
    "Punjabi Literature",
  ],
  "CLAT/Law": [
    "Polity",
    "General Awareness",
    "English Language",
    "English Grammar",
    "Modern History",
    "Indian Economy",
    "Environment and Ecology",
    "Reasoning",
    // Quantitative Techniques is an official CLAT section worth 10 to 14
    // questions and was absent from this exam. Source: Consortium of NLUs
    // CLAT UG exam pattern.
    "Quantitative Aptitude",
  ],
  "RRB ALP": ["Physics", "Mathematics", "Computer Awareness", "Polity"],
  "PSEB Class 9-10": [
    "Science Class 9",
    "Science Class 10",
    "Math Class 10",
    "SST Class 10",
    "Punjabi Grammar",
  ],
  "PSTET/CTET": ["SST Class 9", "Science Class 9", "Math Class 9"],
  "State Teacher/TET": ["SST Class 9", "Science Class 9", "Math Class 9"],
  "NDA/CDS": ["Mathematics", "Physics", "Chemistry"],
  "RRB Group D": ["Science Class 9", "Science Class 10", "Polity"],
  "CA Foundation": ["Quantitative Aptitude"],
  PSSSB: ["Quantitative Aptitude", "Reasoning"],
  CUET: ["Quantitative Aptitude", "Computer Awareness"],
  "SSC CGL": ["Computer Awareness", "Polity"],
  "SSC CHSL": ["Computer Awareness", "Polity"],
  "SSC MTS": ["Computer Awareness", "Polity"],
  "SSC GD Constable": ["Computer Awareness", "Polity"],
  "RRB NTPC": ["Computer Awareness", "Polity"],
  "Punjab Patwari": ["Reasoning", "Computer Awareness"],
  // PPSC Mains Paper I is Punjabi in Gurmukhi and Paper II is English, both
  // compulsory at 10+2 standard and 100 marks each. English was absent from
  // this exam in the bank. Source: PPSC combined competitive examination
  // notification.
  "Punjab PCS": ["Polity", "English Grammar", "English Language"],
  "PPSC Punjab": ["Polity", "English Grammar", "English Language"],
  CAPF: ["Polity"],
  Banking: ["Polity"],
  "Punjab Police": ["Computer Awareness"],
  "Punjab Clerk": ["English Language"],
  "CS Executive": ["Business Law", "Business Economics"],
  "CMA Intermediate": ["Business Law"],
  "ICSE Class 9": ["Math Class 9"],
  "ICSE Class 10": ["Math Class 10"],
};

/** Subject to the extra exams whose whole paper covers it. */
const EXTRA_EXAMS_BY_SUBJECT = new Map<string, string[]>();
for (const [exam, subjects] of Object.entries(WHOLE_SUBJECT_PAPERS)) {
  for (const subject of subjects) {
    const list = EXTRA_EXAMS_BY_SUBJECT.get(subject) ?? [];
    list.push(exam);
    EXTRA_EXAMS_BY_SUBJECT.set(subject, list);
  }
}

for (const template of ALL_TEMPLATES) {
  const extra = EXTRA_EXAMS_BY_SUBJECT.get(template.subject);
  if (!extra) continue;
  const missing = extra.filter((exam) => !template.exams.includes(exam));
  if (missing.length > 0) template.exams = [...template.exams, ...missing];
}

// Official-syllabus corrections run last, so they also undo any exam tag the
// whole-subject widening above would otherwise have added wrongly.
export const OFFICIAL_SYLLABUS_TAGS_REMOVED = applyOfficialSyllabus(ALL_TEMPLATES);
export const SCHOOL_GRADE_TAGS_REMOVED = applySchoolGradeScope(ALL_TEMPLATES);
ALL_TEMPLATES.push(...foundationRecallPractice(ALL_TEMPLATES));

const DEAD_TEMPLATE_IDS = new Set([
  "im9:compound-interest:adv:match",
  "im9:expansions-factorisation:adv:match",
  "im9:indices-logarithms:adv:match",
  "im10:gst:adv:match",
  "im10:banking:adv:match",
  "im10:shares-dividends:adv:match",
  "im10:matrices:adv:match",
  "im10:remainder-factor:adv:match",
  "im10:inequations-loci:adv:match",
  "n9:sci:atoms-molecules:adv:match",
  "n9:sci:tissues:adv:match",
  "n9:sci:motion:adv:match",
  "n9:sci:gravitation:adv:match",
  "n9:sci:work-energy:adv:match",
  "n9:sci:food-resources:adv:match",
  "n9:sci:diversity:adv:match",
  "n9:sci:illness:adv:match",
  "n9:sci:natural-resources:adv:match",
  "n9:math:number-systems:adv:match",
  "n9:math:coordinate-geometry:adv:match",
  "n9:math:linear-equations:adv:match",
  "n9:math:euclid:adv:match",
  "n9:math:lines-angles:adv:match",
  "n9:math:triangles:adv:match",
  "n9:math:quadrilaterals:adv:match",
  "n9:math:circles:adv:match",
  "n9:math:herons:adv:match",
  "n9:math:surface-volume:adv:match",
  "n9:math:statistics:adv:match",
  "n10:sci:metals:adv:match",
  "n10:sci:carbon:adv:match",
  "n10:sci:control:adv:match",
  "n10:sci:reproduction:adv:match",
  "n10:sci:heredity:adv:match",
  "n10:sci:human-eye:adv:match",
  "n10:sci:magnetic-effects:adv:match",
  "n10:sci:environment:adv:match",
  "n10:sci:periodic:adv:match",
  "n10:sci:energy-sources:adv:match",
  "n10:sci:natural-resource-mgmt:adv:match",
  "n10:math:real-numbers:adv:match",
  "n10:math:polynomials:adv:match",
  "n10:math:linear-pair:adv:match",
  "n10:math:quadratic:adv:match",
  "n10:math:ap:adv:match",
  "n10:math:triangles:adv:match",
  "n10:math:coordinate:adv:match",
  "n10:math:trig-applications:adv:match",
  "n10:math:circles:adv:match",
  "n10:math:areas-circles:adv:match",
  "n10:math:surface-volume:adv:match",
  "n10:math:statistics:adv:match",
  "n10:math:probability:adv:match",
  "im9:standard-angles:adv:fwd",
  "hy:polity:adv:match",
  "hy:geography:adv:fwd",
  "hy:economy:adv:fwd",
  "hy:science:adv:fwd",
  "hy:punjab:adv:fwd",
  "ca:acc:classify:fwd",
  "comp2:devices:fwd",
  "eg:article:fwd",
  "practice:foundation:ca:acc:classify:fwd",
]);

/** Runtime bank: only templates with a non-zero parameter space and known
 * dead families removed. Source definitions remain intact for audit/history. */
export const ACTIVE_TEMPLATES: Template[] = ALL_TEMPLATES.filter(
  (template) =>
    template.count > 0 &&
    !DEAD_TEMPLATE_IDS.has(template.id) &&
    !/\(old NCERT\)/i.test(template.topic),
);

/** Exact number of addressable questions in the bank. */
export const EXAM_BANK_TOTAL = ACTIVE_TEMPLATES.reduce((sum, t) => sum + t.count, 0);

/* ------------------------------------------------------------- indexing */

const bySubject = new Map<string, Template[]>();
const byTopic = new Map<string, Template[]>();
const byExam = new Map<string, Template[]>();

for (const template of ACTIVE_TEMPLATES) {
  const subjectList = bySubject.get(template.subject) ?? [];
  subjectList.push(template);
  bySubject.set(template.subject, subjectList);

  const topicKey = `${template.subject}::${template.topic}`;
  const topicList = byTopic.get(topicKey) ?? [];
  topicList.push(template);
  byTopic.set(topicKey, topicList);

  for (const exam of template.exams) {
    const examList = byExam.get(exam) ?? [];
    examList.push(template);
    byExam.set(exam, examList);
  }
}

export const EXAM_BANK_SUBJECTS = [...bySubject.keys()].sort();

function resolveSubjectTemplates(subject: string): Template[] {
  const exact = bySubject.get(subject);
  if (exact && exact.length > 0) return exact;
  const norm = subject.trim().toLowerCase();
  if (!norm) return [];
  for (const [key, list] of bySubject.entries()) {
    if (key.toLowerCase() === norm) return list;
  }
  const aliasSubjects: string[] = [];
  if (/[\u0A00-\u0A7F]/.test(subject) || norm.includes("punjabi") || norm.includes("gurmukhi")) {
    aliasSubjects.push("Punjabi Grammar", "Punjabi Paper A", "Punjabi Paper B", "Punjabi Literature");
  } else if (/[\u0900-\u097F]/.test(subject) || norm.includes("hindi")) {
    aliasSubjects.push("Hindi Grammar", "Hindi Literature");
  } else if (norm.includes("punjab") && norm.includes("hist")) {
    aliasSubjects.push("Punjab History", "Punjab GK");
  } else if (norm.includes("punjab") && norm.includes("geog")) {
    aliasSubjects.push("Punjab Geography", "Punjab GK");
  } else if (norm.includes("punjab") && norm.includes("econ")) {
    aliasSubjects.push("Punjab Economics", "Punjab GK");
  } else if (norm.includes("punjab")) {
    aliasSubjects.push("Punjab GK", "Punjab History", "Punjab Geography", "Punjab Economics");
  } else if (
    norm.includes("pedagog") ||
    norm.includes("child") ||
    norm.includes("cdp") ||
    norm.includes("teaching")
  ) {
    aliasSubjects.push("Teaching Aptitude", "Psychology");
  } else if (norm.includes("english")) {
    aliasSubjects.push("English Grammar", "English Language", "English Core");
  } else if (norm.includes("math") || norm.includes("quant") || norm.includes("arithmetic")) {
    aliasSubjects.push("Quantitative Aptitude", "Math Class 10", "Math Class 9", "Mathematics");
  } else if (norm.includes("reason") || norm.includes("mental") || norm.includes("logical")) {
    aliasSubjects.push("Reasoning", "CSAT");
  } else if (norm.includes("comp") || norm.includes("ict") || norm === "it") {
    aliasSubjects.push("Computer Awareness");
  } else if (norm.includes("evs") || norm.includes("environment") || norm.includes("ecolog")) {
    aliasSubjects.push("Environment and Ecology");
  } else if (norm.includes("polity") || norm.includes("civic") || norm.includes("constitution")) {
    aliasSubjects.push("Polity", "SST");
  } else if (norm.includes("history")) {
    aliasSubjects.push("Modern History", "Ancient History", "Medieval History", "SST");
  } else if (norm.includes("geog")) {
    aliasSubjects.push("Indian Geography", "Physical Geography", "World Geography", "SST");
  } else if (norm.includes("econ")) {
    aliasSubjects.push("Indian Economy", "Business Economics", "SST");
  } else if (
    norm.includes("gk") ||
    norm.includes("general knowledge") ||
    norm.includes("general studies") ||
    norm.includes("subject specialization") ||
    norm === "gs" ||
    norm === "ga" ||
    norm === "general"
  ) {
    aliasSubjects.push("General Awareness", "Polity", "Modern History", "Indian Geography");
  }
  const out: Template[] = [];
  for (const s of aliasSubjects) {
    const list = bySubject.get(s);
    if (list) out.push(...list);
  }
  return out;
}

export function getExamBankTopics(subject: string): string[] {
  const list = resolveSubjectTemplates(subject);
  return [...new Set(list.map((t) => t.topic))].sort();
}

export function getExamBankExams(): string[] {
  return [...byExam.keys()].sort();
}

/**
 * Chapters a given exam actually asks inside a subject. The paid test series
 * uses this so a Class 11 paper never lists a Class 12 chapter, and a PSSSB
 * paper never lists a chapter PSSSB does not set.
 */
export function getExamBankTopicsForExam(subject: string, exam: string): string[] {
  const exact = bySubject.get(subject);
  const baseList = exact && exact.length > 0 ? exact : resolveSubjectTemplates(subject);
  const list = baseList.filter(
    (t) => t.count > 0 && (exam === "All Exams" || t.exams.includes(exam)),
  );
  return [...new Set(list.map((t) => t.topic))].sort();
}

/** Total addressable questions for a subject. */
export function countBySubject(subject: string): number {
  return resolveSubjectTemplates(subject).reduce((sum, t) => sum + t.count, 0);
}

/* -------------------------------------------------------------- sampling */

function pickTemplate(pool: Template[], random: () => number): Template | null {
  if (!pool.length) return null;
  // Weight by template size so large templates are not under-sampled, but damp
  // the weight so a 19k template does not drown a 200 question one.
  const weights = pool.map((t) => Math.sqrt(Math.max(1, t.count)));
  const total = weights.reduce((a, b) => a + b, 0);
  let cursor = random() * total;
  for (let i = 0; i < pool.length; i += 1) {
    cursor -= weights[i] as number;
    if (cursor <= 0) return pool[i] as Template;
  }
  return pool[pool.length - 1] as Template;
}

export type SampleFilter = {
  subject?: string | undefined;
  topic?: string | undefined;
  exam?: string | undefined;
  difficulty?: Difficulty | undefined;
};

function resolvePool(filter: SampleFilter): Template[] {
  const effectiveTopic =
    filter.topic && filter.topic !== "Mixed" && filter.topic !== "All Chapters"
      ? filter.topic
      : undefined;
  let pool: Template[];
  if (filter.subject && effectiveTopic) {
    const exactTopic = byTopic.get(`${filter.subject}::${effectiveTopic}`);
    if (exactTopic && exactTopic.length > 0) {
      pool = exactTopic;
    } else {
      const subjPool = resolveSubjectTemplates(filter.subject);
      const normTopic = effectiveTopic.trim().toLowerCase();
      pool = subjPool.filter((t) => {
        const tl = t.topic.toLowerCase();
        return tl === normTopic || tl.includes(normTopic) || normTopic.includes(tl);
      });
    }
  } else if (filter.subject) {
    pool = resolveSubjectTemplates(filter.subject);
  } else if (filter.exam) {
    pool = byExam.get(filter.exam) ?? [];
  } else {
    pool = ACTIVE_TEMPLATES;
  }
  if (filter.exam && (filter.subject || effectiveTopic)) {
    pool = pool.filter((t) => t.exams.includes(filter.exam as string));
  }
  if (filter.difficulty) {
    pool = pool.filter((t) => t.difficulty === filter.difficulty);
  }
  return pool;
}

/**
 * Draw one question matching the filter. Returns null only when no template
 * matches at all, so callers can fall back to their own generator.
 */
export function sampleQuestion(
  filter: SampleFilter = {},
  random: () => number = Math.random,
): GeneratedQuestion | null {
  const pool = resolvePool(filter);
  if (!pool.length) return null;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const template = pickTemplate(pool, random);
    if (!template) continue;
    const index = Math.floor(random() * template.count);
    const question = template.at(index);
    if (question && isPublishableQuestion(question)) return question;
  }
  // Deterministic last resort: walk the pool for any valid index.
  for (const template of pool) {
    for (let i = 0; i < Math.min(template.count, 40); i += 1) {
      const question = template.at(i);
      if (question && isPublishableQuestion(question)) return question;
    }
  }
  return null;
}

/** Count how many questions match a filter. */
export function countMatching(filter: SampleFilter = {}): number {
  return resolvePool(filter).reduce((sum, t) => sum + t.count, 0);
}
