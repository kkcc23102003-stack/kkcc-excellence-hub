import assert from "node:assert/strict";
import { generateOnDemandTestPaper, QuestionBankCoverageError } from "../src/lib/generated-test";

const requested = 4;
assert.throws(
  () =>
    generateOnDemandTestPaper({
      exam: "__coverage-regression-probe__",
      subject: "__coverage-regression-probe__",
      topic: "__coverage-regression-probe__",
      difficulty: "Easy",
      count: requested,
      marks: 1,
      negative_marks: 0,
    }),
  (error: unknown) => {
    assert.ok(error instanceof QuestionBankCoverageError);
    assert.equal(error.requested, requested);
    assert.equal(error.available, 0);
    assert.match(error.message, /paper was not started/i);
    return true;
  },
  "a short question bank must not silently return an incomplete test paper",
);

const complete = generateOnDemandTestPaper({
  exam: "Punjab PCS",
  subject: "Punjab GK",
  topic: "Districts and Headquarters",
  difficulty: "Mixed",
  count: 20,
  marks: 1,
  negative_marks: 0,
});
assert.equal(complete.length, 20, "same-scope overdraw must replace cross-level duplicate stems");
assert.equal(
  new Set(complete.map((question) => question.question_text.trim().toLowerCase())).size,
  20,
  "a generated mixed paper must contain unique question stems",
);
assert.ok(complete.every((question) => question.subject === "Punjab GK"));

console.log(
  "Generated-paper shortfall is explicit, exact-scope reserves are unique, and no paper is padded: PASS",
);
