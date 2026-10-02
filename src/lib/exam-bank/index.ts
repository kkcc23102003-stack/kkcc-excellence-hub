/**
 * KKCC mega exam question bank — public API.
 *
 * Combines every template family into one addressable bank. Because each
 * template exposes a finite `count` and a deterministic `at(index)`, the whole
 * bank is enumerable: `EXAM_BANK_TOTAL` is an exact figure, not an estimate.
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
import { applyOfficialSyllabus } from "./official-syllabus";
import { INVALID_QUESTION_INDEX_RANGES } from "./invalid-index-ranges";

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
];

// Keep source definitions available to audits, but expose only valid,
// addressable questions to runtime consumers. Some legacy Cartesian builders
// declare impossible parameter combinations; their invalid coordinates are
// compacted from the public index without changing the underlying builders.
export const QUESTION_TEMPLATE_DEFINITIONS: readonly Template[] = RAW_TEMPLATES;

function compactInvalidCoordinates(template: Template): Template {
  const ranges = INVALID_QUESTION_INDEX_RANGES[template.id];
  if (!ranges?.length) return { ...template, exams: [...template.exams] };

  let invalidCount = 0;
  let previousEnd = -1;
  for (const [start, end] of ranges) {
    if (start <= previousEnd || start < 0 || end < start || end >= template.count) {
      throw new Error(`Invalid structural-hole map for exam-bank template ${template.id}.`);
    }
    invalidCount += end - start + 1;
    previousEnd = end;
  }

  const rawCount = template.count;
  const compactCount = rawCount - invalidCount;
  return {
    ...template,
    exams: [...template.exams],
    count: compactCount,
    at: (index) => {
      if (!Number.isSafeInteger(index) || index < 0 || index >= compactCount) return null;
      let rawIndex = index;
      let skipped = 0;
      for (const [start, end] of ranges) {
        const publicBoundary = start - skipped;
        if (index < publicBoundary) break;
        const rangeLength = end - start + 1;
        rawIndex += rangeLength;
        skipped += rangeLength;
      }
      const question = template.at(rawIndex);
      if (question === null) {
        throw new Error(
          `Structural-hole map is stale for ${template.id} at raw index ${rawIndex}.`,
        );
      }
      return question;
    },
  };
}

export const COMPACTED_STRUCTURAL_HOLE_COUNT = Object.values(INVALID_QUESTION_INDEX_RANGES).reduce(
  (total, ranges) => total + ranges.reduce((sum, [start, end]) => sum + end - start + 1, 0),
  0,
);

export const ALL_TEMPLATES: Template[] = RAW_TEMPLATES.filter(
  (template) => Number.isSafeInteger(template.count) && template.count > 0,
)
  .map(compactInvalidCoordinates)
  .filter((template) => template.count > 0);

// The combined commerce tag intentionally spans both years. Add the narrower
// CBSE tags only to economics chapters that actually belong to that class.
const CBSE_ECONOMICS_CLASS_BY_TOPIC: Readonly<Record<string, "CBSE Class 11" | "CBSE Class 12">> = {
  "Theory of Production and Cost": "CBSE Class 11",
  "Price Determination in Different Markets": "CBSE Class 11",
  "Theory of Demand and Elasticity": "CBSE Class 11",
  Microeconomics: "CBSE Class 11",
  "Elasticity of Demand": "CBSE Class 11",
  "Market Structures and Firm Behaviour": "CBSE Class 11",
  "Money, Banking and National Income": "CBSE Class 12",
  "Public Finance, Budget and Fiscal Policy": "CBSE Class 12",
  "International Trade and the Balance of Payments": "CBSE Class 12",
};
for (const template of ALL_TEMPLATES) {
  if (template.subject !== "Business Economics") continue;
  const classTag = CBSE_ECONOMICS_CLASS_BY_TOPIC[template.topic];
  if (classTag && !template.exams.includes(classTag)) {
    template.exams = [...template.exams, classTag];
  }
}

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
  "RRB ALP": ["Physics", "Mathematics", "Polity"],
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
  "RRB NTPC": ["Polity"],
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
  "CS Executive": ["Business Law"],
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

/** Exact number of addressable questions in the bank. */
export const EXAM_BANK_TOTAL = ALL_TEMPLATES.reduce((sum, t) => sum + t.count, 0);

/* ------------------------------------------------------------- indexing */

const bySubject = new Map<string, Template[]>();
const byTopic = new Map<string, Template[]>();
const byExam = new Map<string, Template[]>();

for (const template of ALL_TEMPLATES) {
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

export function getExamBankTopics(subject: string): string[] {
  const list = (bySubject.get(subject) ?? []).filter((template) => template.count > 0);
  return [...new Set(list.map((template) => template.topic))].sort();
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
  const list = (bySubject.get(subject) ?? []).filter((t) => t.count > 0 && t.exams.includes(exam));
  return [...new Set(list.map((t) => t.topic))].sort();
}

/** Total addressable questions for a subject. */
export function countBySubject(subject: string): number {
  return (bySubject.get(subject) ?? []).reduce((sum, t) => sum + t.count, 0);
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
  let pool: Template[];
  if (filter.subject && filter.topic) {
    pool = byTopic.get(`${filter.subject}::${filter.topic}`) ?? [];
  } else if (filter.subject) {
    pool = bySubject.get(filter.subject) ?? [];
  } else if (filter.exam) {
    pool = byExam.get(filter.exam) ?? [];
  } else {
    pool = ALL_TEMPLATES;
  }

  // Filters are constraints, never hints. Silently dropping a missing exam or
  // difficulty can leak a question from another syllabus or level.
  if (filter.topic && !filter.subject) {
    pool = pool.filter((template) => template.topic === filter.topic);
  }
  if (filter.exam) {
    pool = pool.filter((template) => template.exams.includes(filter.exam as string));
  }
  if (filter.difficulty) {
    pool = pool.filter((template) => template.difficulty === filter.difficulty);
  }
  return pool.filter((template) => template.count > 0);
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
