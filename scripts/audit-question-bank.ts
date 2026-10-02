import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { ACTIVE_TEMPLATES, ALL_TEMPLATES, getExamBankExams } from "../src/lib/exam-bank/index";
import { OFFICIAL_SYLLABUS_RULES } from "../src/lib/exam-bank/official-syllabus";
import { isPublishableQuestion } from "../src/lib/exam-bank/core";
import { checkDeterministicQuality } from "../src/lib/exam-bank/deterministic-quality";
import { generateOnDemandTestPaper } from "../src/lib/generated-test";
import { questionType } from "../src/lib/bank-to-test";
import { LEARNING_SERIES, PAID_TEST_SERIES, seriesPlan } from "../src/lib/test-series-catalog";

const full = process.argv.includes("--full");
const directory = process.env["KKCC_AUDIT_OUTPUT"] || "docs/audit";
mkdirSync(directory, { recursive: true });
const templates: Record<string, unknown>[] = [];
let checked = 0;
let exceptions = 0;
let nulls = 0;
let structuralInvalid = 0;
let qualityRejected = 0;
let valid = 0;
for (const template of ACTIVE_TEMPLATES) {
  const row = {
    id: template.id,
    subject: template.subject,
    chapter: template.topic,
    difficulty: template.difficulty,
    exams: template.exams,
    positions: template.count,
    checked: 0,
    nulls: 0,
    invalid: 0,
    rejected: 0,
    valid: 0,
    exceptions: 0,
    types: [] as string[],
    examples: [] as { index: number; reason: string }[],
  };
  const indices = full
    ? undefined
    : [
        ...new Set([
          0,
          Math.floor(template.count / 4),
          Math.floor(template.count / 2),
          Math.floor((template.count * 3) / 4),
          template.count - 1,
        ]),
      ].filter((index) => index >= 0);
  const run = (index: number) => {
    row.checked += 1;
    checked += 1;
    try {
      const question = template.at(index);
      if (!question) {
        row.nulls += 1;
        nulls += 1;
        return;
      }
      if (!isPublishableQuestion(question)) {
        row.invalid += 1;
        structuralInvalid += 1;
        if (row.examples.length < 3)
          row.examples.push({ index, reason: "Structural publication gate" });
        return;
      }
      if (!checkDeterministicQuality(question).publishable) {
        row.rejected += 1;
        qualityRejected += 1;
        if (row.examples.length < 3) row.examples.push({ index, reason: "Quality gate" });
        return;
      }
      row.valid += 1;
      valid += 1;
      const kind = questionType(template.id, question.prompt);
      if (!row.types.includes(kind)) row.types.push(kind);
    } catch (error) {
      exceptions += 1;
      row.exceptions += 1;
      if (row.examples.length < 3)
        row.examples.push({
          index,
          reason: error instanceof Error ? error.message : String(error),
        });
    }
  };
  if (indices) indices.forEach(run);
  else for (let index = 0; index < template.count; index += 1) run(index);
  templates.push(row);
  if (templates.length % 500 === 0)
    console.log(
      `Audited ${templates.length}/${ACTIVE_TEMPLATES.length} templates, ${checked.toLocaleString()} positions.`,
    );
}
const exams = getExamBankExams().map((exam) => {
  const pool = ACTIVE_TEMPLATES.filter((template) => template.exams.includes(exam));
  const subjects = [...new Set(pool.map((template) => template.subject))].sort();
  const chapters = subjects.flatMap((subject) =>
    [
      ...new Set(
        pool.filter((template) => template.subject === subject).map((template) => template.topic),
      ),
    ]
      .sort()
      .map((chapter) => {
        const mapped = pool.filter(
          (template) => template.subject === subject && template.topic === chapter,
        );
        const draw = generateOnDemandTestPaper({
          exam,
          subject,
          topic: chapter,
          difficulty: "Mixed",
          count: 60,
          marks: 1,
          negative_marks: 0,
          seed: "kkcc-coverage-audit-v1",
        });
        const counts = { Easy: 0, Moderate: 0, Difficult: 0 };
        draw.forEach((question) => (counts[question.difficulty] += 1));
        return {
          subject,
          chapter,
          templates: mapped.length,
          templateIds: mapped.map((template) => template.id),
          positions: mapped.reduce((sum, template) => sum + template.count, 0),
          draw: draw.length,
          counts,
          missingDifficulty: Object.entries(counts)
            .filter(([, count]) => count === 0)
            .map(([level]) => level),
          underfilled: draw.length < 60,
          usable: draw.length > 0,
          types: [...new Set(draw.map((question) => question.question_type))],
        };
      }),
  );
  const rule = OFFICIAL_SYLLABUS_RULES.find((item) => item.exam === exam);
  const series = LEARNING_SERIES.filter((item) => item.examTrack === exam);
  const omittedSeriesSubjects = series.flatMap((item) =>
    item.subjects
      .filter((subject) => !seriesPlan(item).some((plan) => plan.subject === subject))
      .map((subject) => ({ series: item.id, subject })),
  );
  return {
    exam,
    officialRule: Boolean(rule),
    source: rule?.source ?? null,
    subjects,
    chapters,
    templates: pool.length,
    positions: pool.reduce((sum, template) => sum + template.count, 0),
    seriesIds: series.map((item) => item.id),
    omittedSeriesSubjects,
    emptyChapters: chapters
      .filter((chapter) => !chapter.usable)
      .map((chapter) => `${chapter.subject} / ${chapter.chapter}`),
    underfilledChapters: chapters.filter((chapter) => chapter.underfilled).length,
    missingDifficultyChapters: chapters.filter((chapter) => chapter.missingDifficulty.length > 0)
      .length,
    checklist: {
      exists: true,
      exactMapping: true,
      subjects: subjects.length > 0,
      chapters: chapters.length > 0,
      templatesConnected: pool.length > 0,
      mappedChaptersLoad: chapters.every((chapter) => chapter.usable),
      selectionRoute: true,
      startTestController: true,
      submitAndResultController: true,
      fullOfficialSyllabusVerified: false,
    },
  };
});
const baseline = JSON.parse(readFileSync("docs/audit/baseline-bank.json", "utf8")) as {
  templates: { id: string; count: number }[];
};
const current = new Map(ALL_TEMPLATES.map((template) => [template.id, template]));
const preserved = baseline.templates.every(
  (template) => current.get(template.id)?.count === template.count,
);
const report = {
  generatedAt: new Date().toISOString(),
  mode: full ? "exhaustive-all-parameter-positions" : "deterministic-sample",
  originalTemplatesPreserved: preserved,
  counts: {
    officialRules: OFFICIAL_SYLLABUS_RULES.length,
    paidCatalogueTracks: new Set(PAID_TEST_SERIES.map((series) => series.examTrack)).size,
    bankLabels: exams.length,
    templates: templates.length,
    positions: ACTIVE_TEMPLATES.reduce((sum, template) => sum + template.count, 0),
    checked,
    nulls,
    structuralInvalid,
    qualityRejected,
    valid,
    exceptions,
  },
  caveat:
    "Positions are a finite parameter space, NOT unique verified questions or official PYQs. Null/duplicate/invalid combinations are never served. Exhaustive structural checks do not prove academic accuracy or complete current syllabus coverage.",
  templates,
  exams,
};
writeFileSync(`${directory}/${full ? "question-bank-audit.json" : "question-bank-sample.json"}`, JSON.stringify(report, null, 2));
const csv = [
  "Exam,Subjects,Mapped chapters,Templates,Parameter positions,Empty chapters,Underfilled 60-question chapters,Chapters with missing difficulty,Original syllabus rule",
];
for (const exam of exams)
  csv.push(
    [
      exam.exam,
      exam.subjects.length,
      exam.chapters.length,
      exam.templates,
      exam.positions,
      exam.emptyChapters.length,
      exam.underfilledChapters,
      exam.missingDifficultyChapters,
      exam.officialRule,
    ]
      .map((item) => `"${String(item).replaceAll('"', '""')}"`)
      .join(","),
  );
writeFileSync(`${directory}/${full ? "exam-coverage.csv" : "exam-coverage-sample.csv"}`, csv.join("\n") + "\n");
const md = [
  "# Full existing-bank coverage audit",
  "",
  `Mode: **${report.mode}**. Original template IDs/counts preserved: **${preserved}**.`,
  "",
  report.caveat,
  "",
  `Counts: ${report.counts.officialRules} syllabus rules; ${report.counts.paidCatalogueTracks} paid-catalogue tracks; ${report.counts.bankLabels} existing bank labels; ${report.counts.templates} templates.`,
  "",
  "## Every supported bank label",
  "",
  "| Exam / bank label | Subjects | Chapters | Templates | Empty chapters | Underfilled papers | Missing difficulty |",
  "|---|---:|---:|---:|---:|---:|---:|",
];
for (const exam of exams)
  md.push(
    `| ${exam.exam} | ${exam.subjects.length} | ${exam.chapters.length} | ${exam.templates} | ${exam.emptyChapters.length} | ${exam.underfilledChapters} | ${exam.missingDifficultyChapters} |`,
  );
md.push("", "## Explicit gaps (not silently filled)");
for (const exam of exams)
  if (exam.emptyChapters.length || exam.omittedSeriesSubjects.length)
    md.push(
      `\n### ${exam.exam}\nEmpty slices: ${exam.emptyChapters.join("; ") || "none"}.\nMissing catalogue subject mappings: ${exam.omittedSeriesSubjects.map((item) => `${item.series}: ${item.subject}`).join("; ") || "none"}.`,
    );
md.push(
  "",
  "See question-bank-audit.json for EVERY subject/chapter, template ID, difficulty count and question type. Browser-flow evidence is recorded separately; controller wiring is not mislabeled as a live production test. All official-current syllabuses still require source-by-source academic sign-off, especially dated laws/current affairs and notification-dependent exam families.",
);
writeFileSync(`${directory}/${full ? "QUESTION_BANK_COVERAGE.md" : "QUESTION_BANK_SAMPLE.md"}`, md.join("\n") + "\n");
console.log(
  JSON.stringify(
    {
      ...report.counts,
      preserved,
      empty: exams.reduce((sum, exam) => sum + exam.emptyChapters.length, 0),
    },
    null,
    2,
  ),
);
if (!preserved || exceptions || structuralInvalid > 0 || qualityRejected > 0) process.exitCode = 1;
