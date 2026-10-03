import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ALL_TEMPLATES,
  getExamBankExams,
  getExamBankTopicsForExam,
} from "../../src/lib/exam-bank/index";
import { OFFICIAL_SYLLABUS_RULES } from "../../src/lib/exam-bank/official-syllabus";
import {
  generateCustomSyllabusPaper,
  generateOnDemandTestPaper,
} from "../../src/lib/generated-test";
import { generateQuestionsForTest } from "../../src/lib/bank-to-test";
import { textOptions, isPublishableQuestion } from "../../src/lib/exam-bank/core";
import {
  isCurrentGrant,
  isCurrentEnrollment,
  canonicalSeriesId,
  seriesAliases,
  prioritizeEnrolled,
  assertSelection,
} from "../../src/lib/learning-access";
import {
  FREE_SERIES_IDS,
  LEARNING_SERIES,
  PAID_TEST_SERIES,
  formatSeriesSyllabusText,
  getEffectivePaidTestSeries,
  parseSeriesSyllabusText,
  resolveSeriesPrice,
} from "../../src/lib/test-series-catalog";
import { gradePaper, publicQuestions } from "../../src/lib/test-scoring";
import { coinPriceOf, isFreeCourse } from "../../src/lib/cms";

const question = {
  id: "q1",
  question_text: "What is two plus two?",
  subject: "Mathematics",
  options: ["4", "5", "6", "7"],
  correct_index: 0,
  marks: 2,
  negative_marks: 0.5,
  explanation: "Adding two objects to two objects makes four objects.",
};
test("Publication options traverse 7/14/21-sized pools, instead of silently returning null", () => {
  for (const size of [4, 7, 14, 21, 28])
    for (let offset = 0; offset < size; offset++) {
      const choices = textOptions(
        "answer",
        Array.from({ length: size }, (_, i) => `option ${i}`),
        offset,
      );
      assert.ok(choices);
      assert.equal(new Set([choices.answer, ...choices.distractors]).size, 4);
    }
});
test("All original template IDs/counts and all 35 named official-rule entries are preserved", () => {
  const baseline = JSON.parse(readFileSync("docs/audit/baseline-bank.json", "utf8")) as {
    templates: { id: string; count: number }[];
  };
  const current = new Map(ALL_TEMPLATES.map((template) => [template.id, template.count]));
  for (const template of baseline.templates)
    assert.equal(current.get(template.id), template.count, template.id);
  assert.equal(OFFICIAL_SYLLABUS_RULES.length, 35);
  assert.ok(getExamBankExams().length >= 66);
  for (const rule of OFFICIAL_SYLLABUS_RULES)
    assert.ok(
      ALL_TEMPLATES.some((template) => template.exams.includes(rule.exam) && template.count > 0),
      rule.exam,
    );
  assert.equal(current.size, ALL_TEMPLATES.length, "No duplicate template IDs.");
});
test("Seeded exact-scope papers are deterministic, ordered and never padded with an unrelated exam", () => {
  const input = {
    exam: "NEET",
    subject: "Physics",
    topic: "Mixed",
    difficulty: "Mixed" as const,
    count: 12,
    marks: 1,
    negative_marks: 0.25,
    seed: "stable-audit-seed",
  };
  const paper = generateOnDemandTestPaper(input);
  assert.ok(paper.length > 0);
  assert.deepEqual(paper, generateOnDemandTestPaper(input));
  const order = { Easy: 0, Moderate: 1, Difficult: 2 };
  let previous = -1;
  const ids = new Set();
  for (const item of paper) {
    assert.equal(item.exam, "NEET");
    assert.equal(item.subject, "Physics");
    assert.equal(item.provenance, "practice");
    assert.equal(new Set(item.options).size, 4);
    assert.ok(Number.isInteger(item.correct_index));
    assert.ok(item.explanation.length > 20);
    assert.ok(order[item.difficulty] >= previous);
    previous = order[item.difficulty];
    ids.add(item.id);
  }
  assert.equal(ids.size, paper.length);
  assert.equal(
    generateQuestionsForTest({
      exam: "Invented Exam",
      subject: "Physics",
      topic: "Mixed",
      difficulty: "Easy",
      count: 60,
    }).length,
    0,
  );
  assert.equal(
    generateQuestionsForTest({
      exam: "NEET",
      subject: "Physics",
      topic: "Invented Chapter",
      difficulty: "Easy",
      count: 60,
    }).length,
    0,
  );
});
test("Every actually supported bank label can form a publishable exact-exam practice slice", () => {
  for (const exam of getExamBankExams()) {
    const source = ALL_TEMPLATES.find(
      (template) => template.exams.includes(exam) && template.count > 0,
    )!;
    const paper = generateOnDemandTestPaper({
      exam,
      subject: source.subject,
      topic: "Mixed",
      difficulty: "Mixed",
      count: 6,
      seed: `audit:${exam}`,
    });
    assert.ok(paper.length > 0, exam);
    for (const item of paper) assert.equal(item.exam, exam);
  }
});
test("Current CBSE grades do not include known cross-grade Physics/Maths/old Class 10 SST", () => {
  assert.ok(!getExamBankTopicsForExam("Physics", "CBSE Class 11").includes("Current Electricity"));
  assert.ok(!getExamBankTopicsForExam("Physics", "CBSE Class 12").includes("Laws of Motion"));
  assert.ok(!getExamBankTopicsForExam("Mathematics", "CBSE Class 11").includes("Integration"));
  assert.ok(!getExamBankTopicsForExam("Mathematics", "CBSE Class 12").includes("Binomial Theorem"));
  assert.ok(!getExamBankTopicsForExam("SST", "CBSE Class 9").includes("Nationalism in India"));
  assert.ok(
    getExamBankTopicsForExam("Math Class 9", "CBSE Class 9").includes("Sequences and Progressions"),
  );
  assert.ok(
    getExamBankTopicsForExam("SST Class 9", "CBSE Class 9").includes("From Ideas to Startups"),
  );
});
test("Public in-progress responses exclude answer keys and explanations; grading rejects forged question IDs/options", () => {
  const safe = publicQuestions([question])[0]!;
  assert.ok(!("correct_index" in safe));
  assert.ok(!("explanation" in safe));
  assert.deepEqual(gradePaper([question], { q1: 0 }), {
    score: 2,
    correct: 1,
    attempted: 1,
    totalMarks: 2,
    total: 1,
  });
  assert.equal(gradePaper([question], { q1: 1 }).score, -0.5);
  assert.equal(gradePaper([question], {}).attempted, 0);
  for (const values of [{ other: 0 }, { q1: 4 }, { q1: -1 }, { q1: 0.5 }])
    assert.throws(() => gradePaper([question], values), /does not belong/);
});
test("Expiry/revocation/status fail closed; exact series aliases and stable enrolled-first partition", () => {
  const now = Date.parse("2026-10-01T00:00:00Z");
  assert.ok(isCurrentGrant({ expires_at: null }, now));
  assert.ok(!isCurrentGrant({ expires_at: "invalid" }, now));
  assert.ok(!isCurrentGrant({ expires_at: "2026-09-30T00:00:00Z" }, now));
  assert.ok(!isCurrentGrant({ revoked_at: "2026-09-30" }, now));
  assert.ok(!isCurrentEnrollment({ status: "revoked" }, now));
  assert.ok(isCurrentEnrollment({ status: "active" }, now));
  for (const series of LEARNING_SERIES) {
    assert.equal(canonicalSeriesId(series.id), series.id);
    assert.equal(canonicalSeriesId(` ${series.name.toUpperCase()} `), series.id);
  }
  assert.equal(canonicalSeriesId("Invented 36th Exam"), null);
  assert.deepEqual(
    prioritizeEnrolled(
      [{ id: "a" }, { id: "b" }, { id: "a" }, { id: "c" }],
      new Set(["c", "b"]),
    ).map((item) => item.id),
    ["b", "c", "a"],
  );
  const plan = [{ subject: "Physics", chapters: ["Motion"] }];
  assert.throws(() => assertSelection(plan, "Biology"), /subject/);
  assert.throws(() => assertSelection(plan, "Physics", "Biology"), /chapter/);
});
test("Coin-only courses are paid; a zero rupee price cannot leak paid lectures or grant free access", () => {
  assert.ok(!isFreeCourse({ price: 0, coin_price: 100 }));
  assert.ok(isFreeCourse({ price: 0, coin_price: 0 }));
  assert.equal(coinPriceOf({ price: 0, coin_price: 100 }), 100);
  assert.equal(coinPriceOf({ price: 500, coin_price: 100 }), 100);
});
test("New original practice templates remain structurally publishable without fabricated PYQ provenance", () => {
  for (const template of ALL_TEMPLATES.filter((template) =>
    template.id.startsWith("practice26:"),
  )) {
    let valid = 0;
    for (let index = 0; index < Math.min(40, template.count); index++) {
      const item = template.at(index);
      if (item && isPublishableQuestion(item)) valid++;
    }
    assert.ok(valid > 0, template.id);
  }
});

test("Mutable series display names resolve to canonical IDs and ambiguous aliases fail closed", () => {
  const aliases = seriesAliases([{ series_id: "neet-ug", name: "Renamed NEET" }]);
  assert.equal(canonicalSeriesId("Renamed NEET", aliases), "neet-ug");
  const other = LEARNING_SERIES.find((series) => series.id !== "neet-ug")!;
  const ambiguous = seriesAliases([
    { series_id: "neet-ug", name: "Same name" },
    { series_id: other.id, name: "Same name" },
  ]);
  assert.equal(canonicalSeriesId("Same name", ambiguous), null);
  assert.equal(canonicalSeriesId("neet-ug", ambiguous), "neet-ug");
});

test("Punjab ETT Cadre test series (Paper A and Paper B) are always free (0 INR and 0 coins)", () => {
  for (const id of ["punjab-ett-paper-a", "punjab-ett-paper-b"]) {
    assert.ok(FREE_SERIES_IDS.has(id), id);
    const series = PAID_TEST_SERIES.find((item) => item.id === id);
    assert.ok(series, id);
    assert.equal(series.priceInr, 0, id);
    assert.equal(series.priceCoins, 0, id);
    assert.deepEqual(
      resolveSeriesPrice(series, { price_inr: 999, price_coins: 999 }),
      { priceInr: 0, priceCoins: 0 },
      id,
    );
  }
});

test("Admin text syllabus parser, custom series catalogue, and auto question generator work end-to-end", () => {
  const text = [
    "Punjabi Language :: ਵਿਆਕਰਣ ਅਤੇ ਮੁਹਾਵਰੇ, ਸ਼ਬਦ ਬੋਧ, ਪੰਜਾਬੀ ਸਾਹਿਤ",
    "Custom Teaching Aptitude :: Classroom Management, Inclusive Pedagogy",
  ].join("\n");
  const plan = parseSeriesSyllabusText(text);
  assert.equal(plan.length, 2);
  assert.deepEqual(plan[0]?.chapters, ["ਵਿਆਕਰਣ ਅਤੇ ਮੁਹਾਵਰੇ", "ਸ਼ਬਦ ਬੋਧ", "ਪੰਜਾਬੀ ਸਾਹਿਤ"]);
  assert.equal(formatSeriesSyllabusText(plan), text);

  const effective = getEffectivePaidTestSeries({
    removedSeriesIds: ["ppsc-pcs"],
    syllabusBySeriesId: { "punjab-ett-paper-a": plan },
    addedSeries: [
      {
        id: "custom-ett-special",
        name: "Custom ETT Special Series",
        examTrack: "Punjab ETT Cadre",
        group: "Punjab State",
        subjects: plan.map((p) => p.subject),
        summary: "Custom added series",
        priceInr: 0,
        priceCoins: 0,
        customPlan: plan,
      },
    ],
  });
  assert.ok(!effective.some((s) => s.id === "ppsc-pcs"));
  assert.ok(effective.some((s) => s.id === "custom-ett-special"));

  const autoPaper = generateCustomSyllabusPaper({
    exam: "Punjab ETT Cadre",
    subject: "Custom Teaching Aptitude",
    topic: "Classroom Management",
    difficulty: "Mixed",
    count: 60,
    marks: 1,
    negative_marks: 0,
    seed: "admin-syllabus-seed",
  });
  assert.equal(autoPaper.length, 60);
  assert.equal(autoPaper.filter((q) => q.difficulty === "Easy").length, 20);
  assert.equal(autoPaper.filter((q) => q.difficulty === "Moderate").length, 20);
  assert.equal(autoPaper.filter((q) => q.difficulty === "Difficult").length, 20);
});
