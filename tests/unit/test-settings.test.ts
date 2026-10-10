import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTestSettingsPatch } from "../../src/lib/test-settings";
import { strictBankSubjects, generateCustomSyllabusPaper } from "../../src/lib/generated-test";
const id = "90000000-0000-4000-8000-000000000001";
test("partial publish/settings updates never inject mode, pricing or recipe defaults", () => {
  assert.deepEqual(parseTestSettingsPatch({ id, is_published: true }), { id, is_published: true });
  assert.deepEqual(parseTestSettingsPatch({ id, title: "Renamed" }), { id, title: "Renamed" });
  assert.deepEqual(parseTestSettingsPatch({ id, is_paid: true }), { id, is_paid: true });
  assert.deepEqual(parseTestSettingsPatch({ id, question_source: "manual" }), {
    id,
    question_source: "manual",
  });
  assert.throws(() => parseTestSettingsPatch({ id, question_source: "fake" }));
});
test("strict bank aliases do not infer unrelated subjects from partial words", () => {
  assert.deepEqual(strictBankSubjects("maths"), ["Mathematics"]);
  for (const subject of ["Custom Economics Paper", "My Computer Art", "Unknown subject"]) {
    assert.deepEqual(strictBankSubjects(subject), []);
    assert.deepEqual(
      generateCustomSyllabusPaper({
        exam: "All Exams",
        subject,
        topic: "Mixed",
        difficulty: "Mixed",
        count: 5,
        marks: 1,
        negative_marks: 0,
      }),
      [],
    );
  }
  assert.deepEqual(strictBankSubjects("Accounting"), ["Accounting"]);
});

test("large own papers can submit more than 1000 answers", async () => {
  const { testAnswersSchema } = await import("../../src/lib/test-answer-schema");
  const answers = Object.fromEntries(Array.from({ length: 1001 }, (_, i) => [`own-${i}`, 0]));
  assert.equal(Object.keys(testAnswersSchema.parse(answers)).length, 1001);
  assert.throws(() => testAnswersSchema.parse({ "own-0": 7 }));
});
