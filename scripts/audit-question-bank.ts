import {
  ALL_TEMPLATES,
  COMPACTED_STRUCTURAL_HOLE_COUNT,
  EXAM_BANK_TOTAL,
  getExamBankTopicsForExam,
  QUESTION_TEMPLATE_DEFINITIONS,
} from "../src/lib/exam-bank/index";
import { isPublishableQuestion, type GeneratedQuestion } from "../src/lib/exam-bank/core";
import { INVALID_QUESTION_INDEX_RANGES } from "../src/lib/exam-bank/invalid-index-ranges";
import { OFFICIAL_SYLLABUS_RULES } from "../src/lib/exam-bank/official-syllabus";
import { PAID_TEST_SERIES } from "../src/lib/test-series-catalog";

const full = process.argv.includes("--full");
const assertClean = process.argv.includes("--assert-clean");
const sampleSize = full ? Number.POSITIVE_INFINITY : 5;
const verificationDate = "2026-10-02";
const sourceDefinitions = QUESTION_TEMPLATE_DEFINITIONS;
const summary = {
  full,
  sourceDefinitions: sourceDefinitions.length,
  templates: ALL_TEMPLATES.length,
  declaredPositions: EXAM_BANK_TOTAL,
  zeroCountSourceDefinitions: sourceDefinitions.filter(
    (template) => !Number.isSafeInteger(template.count) || template.count <= 0,
  ).length,
  structuralHoleCount: COMPACTED_STRUCTURAL_HOLE_COUNT,
  structuralHoleTemplateCount: 0,
  nullPositions: 0,
  undefinedPositions: 0,
  thrownPositions: 0,
  nonPublishablePositions: 0,
  publishablePositions: 0,
  deadTemplates: [] as Array<{
    id: string;
    subject: string;
    topic: string;
    difficulty: string;
    count: number;
  }>,
  oldNcertTemplates: sourceDefinitions.filter((template) => /old ncert/i.test(template.topic))
    .length,
  duplicateIdGroups: [] as Array<{ id: string; entries: string[] }>,
  invalidReasons: {} as Record<string, number>,
  sampledPositions: 0,
  examTags: 0,
  unruledExamTags: [] as string[],
  syllabusRulesWithoutHttpUrl: [] as string[],
  syllabusRulesWithInvalidDate: [] as string[],
  syllabusRulesWithFutureDate: [] as string[],
  syllabusRulesWithoutMatchingTag: [] as string[],
  syllabusRulesByScopeType: {} as Record<string, number>,
  paidCatalogueMissingSubjects: [] as Array<{ seriesId: string; exam: string; subject: string }>,
  paidCatalogueSlices: 0,
  paidCatalogueFull60Slices: 0,
  paidCatalogueIncomplete60Slices: 0,
  paidCatalogueMissingDifficultySlices: 0,
  paidCatalogueUnder20TotalSlices: 0,
  paidCatalogueBelow20ByDifficulty: { Easy: 0, Moderate: 0, Difficult: 0 },
  allExamTopicSlices: 0,
  allExamTopicFull60Slices: 0,
  allExamTopicIncomplete60Slices: 0,
  allExamTopicUnder20TotalSlices: 0,
  allExamTopicBelow20ByDifficulty: { Easy: 0, Moderate: 0, Difficult: 0 },
};

const idGroups = new Map<string, string[]>();
const examTags = new Set<string>();
for (const template of sourceDefinitions) {
  const baseId = template.id.replace(/#\d+$/, "");
  idGroups.set(baseId, [...(idGroups.get(baseId) ?? []), template.id]);
}
for (const template of ALL_TEMPLATES) {
  for (const exam of template.exams) examTags.add(exam);
}
summary.duplicateIdGroups = [...idGroups.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([id, entries]) => ({ id, entries }));
summary.examTags = examTags.size;
const ruledExams = new Set(OFFICIAL_SYLLABUS_RULES.map((rule) => rule.exam));
summary.unruledExamTags = [...examTags].filter((exam) => !ruledExams.has(exam)).sort();
summary.syllabusRulesWithoutHttpUrl = OFFICIAL_SYLLABUS_RULES.filter(
  (rule) => !/https?:\/\//i.test(rule.source),
).map((rule) => rule.exam);
summary.syllabusRulesWithInvalidDate = OFFICIAL_SYLLABUS_RULES.filter(
  (rule) => !/^\d{4}-\d{2}-\d{2}$/.test(rule.verified) || Number.isNaN(Date.parse(rule.verified)),
).map((rule) => rule.exam);
summary.syllabusRulesWithFutureDate = OFFICIAL_SYLLABUS_RULES.filter(
  (rule) => /^\d{4}-\d{2}-\d{2}$/.test(rule.verified) && rule.verified > verificationDate,
).map((rule) => rule.exam);
summary.syllabusRulesWithoutMatchingTag = OFFICIAL_SYLLABUS_RULES.filter(
  (rule) => !examTags.has(rule.exam),
).map((rule) => rule.exam);
summary.syllabusRulesByScopeType = OFFICIAL_SYLLABUS_RULES.reduce<Record<string, number>>(
  (counts, rule) => {
    const scope = rule.scopeType ?? "official-exam";
    counts[scope] = (counts[scope] ?? 0) + 1;
    return counts;
  },
  {},
);
summary.structuralHoleTemplateCount = Object.keys(INVALID_QUESTION_INDEX_RANGES).length;
summary.paidCatalogueMissingSubjects = PAID_TEST_SERIES.flatMap((series) =>
  series.subjects
    .filter((subject) => getExamBankTopicsForExam(subject, series.examTrack).length === 0)
    .map((subject) => ({ seriesId: series.id, exam: series.examTrack, subject })),
);

const paidSlices = new Map<string, { counts: Record<"Easy" | "Moderate" | "Difficult", number> }>();
for (const series of PAID_TEST_SERIES) {
  for (const subject of series.subjects) {
    for (const topic of getExamBankTopicsForExam(subject, series.examTrack)) {
      const key = `${series.examTrack}|||${subject}|||${topic}`;
      if (!paidSlices.has(key)) {
        paidSlices.set(key, { counts: { Easy: 0, Moderate: 0, Difficult: 0 } });
      }
    }
  }
}
const allExamSlices = new Map<
  string,
  { counts: Record<"Easy" | "Moderate" | "Difficult", number> }
>();
for (const template of ALL_TEMPLATES) {
  for (const exam of template.exams) {
    const key = `${exam}|||${template.subject}|||${template.topic}`;
    const allSlice = allExamSlices.get(key) ?? {
      counts: { Easy: 0, Moderate: 0, Difficult: 0 },
    };
    allSlice.counts[template.difficulty] += template.count;
    allExamSlices.set(key, allSlice);

    const paidSlice = paidSlices.get(key);
    if (paidSlice) paidSlice.counts[template.difficulty] += template.count;
  }
}

const summarizeSlices = (
  slices: Iterable<{ counts: Record<"Easy" | "Moderate" | "Difficult", number> }>,
) => {
  const entries = [...slices];
  return {
    total: entries.length,
    full60: entries.filter((slice) => Object.values(slice.counts).every((count) => count >= 20))
      .length,
    incomplete60: entries.filter((slice) => Object.values(slice.counts).some((count) => count < 20))
      .length,
    missingDifficulty: entries.filter((slice) =>
      Object.values(slice.counts).some((count) => count === 0),
    ).length,
    under20Total: entries.filter(
      (slice) => Object.values(slice.counts).reduce((sum, count) => sum + count, 0) < 20,
    ).length,
    below20ByDifficulty: {
      Easy: entries.filter((slice) => slice.counts.Easy < 20).length,
      Moderate: entries.filter((slice) => slice.counts.Moderate < 20).length,
      Difficult: entries.filter((slice) => slice.counts.Difficult < 20).length,
    },
  };
};

const paidSliceSummary = summarizeSlices(paidSlices.values());
summary.paidCatalogueSlices = paidSliceSummary.total;
summary.paidCatalogueFull60Slices = paidSliceSummary.full60;
summary.paidCatalogueIncomplete60Slices = paidSliceSummary.incomplete60;
summary.paidCatalogueMissingDifficultySlices = paidSliceSummary.missingDifficulty;
summary.paidCatalogueUnder20TotalSlices = paidSliceSummary.under20Total;
summary.paidCatalogueBelow20ByDifficulty = paidSliceSummary.below20ByDifficulty;

const allSliceSummary = summarizeSlices(allExamSlices.values());
summary.allExamTopicSlices = allSliceSummary.total;
summary.allExamTopicFull60Slices = allSliceSummary.full60;
summary.allExamTopicIncomplete60Slices = allSliceSummary.incomplete60;
summary.allExamTopicUnder20TotalSlices = allSliceSummary.under20Total;
summary.allExamTopicBelow20ByDifficulty = allSliceSummary.below20ByDifficulty;

for (const template of ALL_TEMPLATES) {
  if (template.count <= 0) continue;
  const steps = Math.min(template.count, sampleSize);
  const indices = new Set<number>();
  if (full) {
    for (let index = 0; index < steps; index += 1) indices.add(index);
  } else {
    indices.add(0);
    indices.add(Math.floor((template.count - 1) / 2));
    indices.add(template.count - 1);
    for (let part = 1; part <= 2; part += 1) {
      indices.add(Math.floor(((template.count - 1) * part) / 3));
    }
  }

  let publishableInTemplate = 0;
  for (const index of indices) {
    summary.sampledPositions += 1;
    let question: GeneratedQuestion | null | undefined;
    try {
      question = template.at(index);
    } catch {
      summary.thrownPositions += 1;
      summary.invalidReasons["builder-threw"] = (summary.invalidReasons["builder-threw"] ?? 0) + 1;
      continue;
    }

    if (question === undefined) {
      summary.undefinedPositions += 1;
      summary.invalidReasons["undefined-return"] =
        (summary.invalidReasons["undefined-return"] ?? 0) + 1;
      continue;
    }
    if (question === null) {
      summary.nullPositions += 1;
      continue;
    }
    if (!isPublishableQuestion(question)) {
      summary.nonPublishablePositions += 1;
      const reasons = classifyFailure(question);
      for (const reason of reasons) {
        summary.invalidReasons[reason] = (summary.invalidReasons[reason] ?? 0) + 1;
      }
      continue;
    }
    if (question.difficulty !== template.difficulty) {
      summary.nonPublishablePositions += 1;
      summary.invalidReasons["template-question-difficulty-mismatch"] =
        (summary.invalidReasons["template-question-difficulty-mismatch"] ?? 0) + 1;
      continue;
    }
    publishableInTemplate += 1;
    summary.publishablePositions += 1;
  }

  if (full && publishableInTemplate === 0) {
    summary.deadTemplates.push({
      id: template.id,
      subject: template.subject,
      topic: template.topic,
      difficulty: template.difficulty,
      count: template.count,
    });
  }
}

console.log(JSON.stringify(summary, null, 2));
if (assertClean) {
  const failures: string[] = [];
  if (!full) failures.push("run with --full to gate every published question position");
  if (
    summary.nullPositions ||
    summary.undefinedPositions ||
    summary.thrownPositions ||
    summary.nonPublishablePositions
  ) {
    failures.push("question-bank positions contain invalid or non-publishable results");
  }
  if (summary.zeroCountSourceDefinitions)
    failures.push("zero-count source definitions remain exposed");
  if (full && summary.deadTemplates.length)
    failures.push("one or more active templates have no publishable question");
  if (summary.duplicateIdGroups.length)
    failures.push("duplicate question-bank template IDs remain");
  if (summary.oldNcertTemplates !== 66)
    failures.push("old-NCERT source coverage is not exactly 66 templates");
  if (summary.structuralHoleCount !== 95_139)
    failures.push("generated structural-hole map count drifted");
  if (summary.unruledExamTags.length)
    failures.push("one or more exam tags lack an exact syllabus record");
  if (summary.syllabusRulesWithoutHttpUrl.length)
    failures.push("syllabus rules need an official source URL");
  if (summary.syllabusRulesWithInvalidDate.length)
    failures.push("syllabus verification dates are malformed");
  if (summary.syllabusRulesWithFutureDate.length)
    failures.push("syllabus verification date is in the future");
  if (summary.syllabusRulesWithoutMatchingTag.length)
    failures.push("unused syllabus rules need review");
  if (summary.paidCatalogueMissingSubjects.length)
    failures.push("paid catalogue has subject mappings without topics");
  // This is a regression ceiling, not an acceptance claim: each paid chapter
  // advertises 20 questions per tier; the current data set is tracked against
  // the 4,331 incomplete slices reported in the baseline audit.
  if (summary.paidCatalogueIncomplete60Slices > 4_331) {
    failures.push("paid-series tier coverage regressed beyond the reported 4,331-slice baseline");
  }
  if (summary.allExamTopicUnder20TotalSlices > 197) {
    failures.push(
      "all-exam under-20-question slices regressed beyond the reported baseline of 197",
    );
  }
  if (failures.length) {
    console.error(`Question-bank regression check failed: ${failures.join("; ")}`);
    process.exitCode = 1;
  }
}

function classifyFailure(question: GeneratedQuestion): string[] {
  const reasons: string[] = [];
  const values = [question.prompt, question.answer, ...question.distractors, question.explanation];
  const clean = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();
  if (question.prompt.trim().length < 12) reasons.push("short-prompt");
  if (!question.answer.trim()) reasons.push("empty-answer");
  if (question.explanation.trim().length < 12) reasons.push("short-explanation-12");
  if (question.explanation.trim().length < 24) reasons.push("short-explanation-24");
  if (question.distractors.length !== 3) reasons.push("option-count");
  if (new Set([question.answer, ...question.distractors].map(clean)).size !== 4)
    reasons.push("duplicate-options");
  if (values.some((value) => /\b(?:undefined|null|nan)\b/i.test(value)))
    reasons.push("placeholder-or-undefined-word");
  const visible = clean(values.join(" "));
  for (const phrase of [
    "[object object]",
    "todo",
    "lorem ipsum",
    "which clue is asked most",
    "best strategy",
    "what should you revise first",
  ]) {
    if (visible.includes(phrase)) reasons.push(`forbidden:${phrase}`);
  }
  if (clean(question.explanation) === clean(question.answer))
    reasons.push("answer-only-explanation");
  if (reasons.length === 0) reasons.push("unclassified-publishability-failure");
  return reasons;
}
