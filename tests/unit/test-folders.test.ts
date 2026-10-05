import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  combineOwnQuestions,
  expandFolderPaths,
  folderPathSchema,
  pathContains,
  type FolderTest,
} from "../../src/lib/test-folders";
import { createFixtureDatabase, seedFixtureUsers, asRole, fixtureIds } from "../fixtures/database";
const question = {
  question_text: "What is 2 + 3?",
  options: ["4", "5"],
  correct_index: 1,
  explanation: "Exactly my explanation.\nSecond line.",
};
const base: FolderTest = {
  id: "90000000-0000-4000-8000-000000000001",
  title: "Chapter set",
  series_name: "My series",
  subject: "Mathematics",
  syllabus_subject: "Mathematics",
  syllabus_chapter: "Addition",
  syllabus_topic: "Basics",
  questions_count: 1,
  question_source: "manual",
  is_published: false,
};
test("folder hierarchy is subject/chapter/optional topic and respects series boundaries", () => {
  const path = {
    series_name: "My series",
    subject: "Mathematics",
    chapter: "Addition",
    topic: "Basics",
  };
  assert.equal(expandFolderPaths([path, path]).length, 3);
  assert.equal(pathContains({ ...path, chapter: "", topic: "" }, path), true);
  assert.equal(pathContains({ ...path, series_name: "Other" }, path), false);
  assert.equal(folderPathSchema.safeParse({ ...path, chapter: "" }).success, false);
});
test("combine only one subject, preserve answers/explanations, remove exact duplicates, reject conflicting duplicates", () => {
  const source = { test: base, questions: [question] };
  const result = combineOwnQuestions([source, source]);
  assert.deepEqual(result.questions, [question]);
  assert.equal(result.duplicates, 1);
  assert.throws(
    () =>
      combineOwnQuestions([
        source,
        {
          test: { ...base, subject: "Physics", syllabus_subject: "Physics" },
          questions: [question],
        },
      ]),
    /one subject/,
  );
  assert.throws(
    () =>
      combineOwnQuestions([
        { test: { ...base, assembly_source_ids: [base.id] }, questions: [question] },
      ]),
    /already combined/,
  );
  assert.throws(
    () =>
      combineOwnQuestions([source, { test: base, questions: [{ ...question, correct_index: 0 }] }]),
    /different answer/,
  );
  assert.equal(
    combineOwnQuestions([
      {
        test: base,
        questions: Array.from({ length: 1201 }, (_, i) => ({
          ...question,
          question_text: `Unique question ${i}?`,
        })),
      },
    ]).questions.length,
    1201,
  );
});
test("folder SQL persists topic drafts privately and independently publishes combined snapshots", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await asRole(db, "service_role");
    const data = {
      id: base.id,
      title: base.title,
      subject: base.subject,
      chapter: base.syllabus_chapter,
      topic: base.syllabus_topic,
      series_name: base.series_name,
      duration_minutes: 30,
      questions: [question],
      publish: false,
    };
    for (let i = 0; i < 2; i++)
      await db.query("SELECT public.publish_easy_text_test_v3($1,$2::jsonb)", [
        fixtureIds.admin,
        JSON.stringify(data),
      ]);
    const draft = (
      await db.query<{ is_published: boolean; syllabus_topic: string }>(
        "SELECT * FROM public.kkcc_tests WHERE id=$1",
        [data.id],
      )
    ).rows[0]!;
    assert.equal(draft.is_published, false);
    assert.equal(draft.syllabus_topic, "Basics");
    assert.equal((await db.query("SELECT * FROM public.kkcc_test_folders")).rows.length, 3);
    const complete = {
      ...data,
      id: "90000000-0000-4000-8000-000000000002",
      title: "Complete subject",
      chapter: "Complete Test",
      topic: "",
      publish: true,
      is_paid: true,
      price_inr: 99,
      assembly_source_ids: [data.id],
    };
    await db.query("SELECT public.publish_easy_text_test_v3($1,$2::jsonb)", [
      fixtureIds.admin,
      JSON.stringify(complete),
    ]);
    await db.query("DELETE FROM public.kkcc_tests WHERE id=$1", [data.id]);
    assert.equal(
      (
        await db.query<{ explanation: string }>(
          "SELECT explanation FROM public.kkcc_test_questions WHERE test_id=$1",
          [complete.id],
        )
      ).rows[0]!.explanation,
      question.explanation,
    );
    for (const role of ["anon", "authenticated"] as const) {
      await asRole(db, role, fixtureIds.studentA);
      await assert.rejects(db.query("SELECT * FROM public.kkcc_test_folders"), /permission/);
      await assert.rejects(
        db.query("SELECT public.publish_easy_text_test_v3($1,$2::jsonb)", [
          fixtureIds.admin,
          JSON.stringify(complete),
        ]),
        /permission/,
      );
    }
    await db.exec("RESET ROLE");
    await db.exec(readFileSync("KKCC-Excellence-Hub-TEST-FOLDERS.sql", "utf8"));
    assert.equal(
      (await db.query("SELECT * FROM public.kkcc_tests WHERE id=$1", [complete.id])).rows.length,
      1,
    );
  } finally {
    await db.close();
  }
});

test("accordion lists accept multiline names and inherit only their selected parent", async () => {
  const { parseOutlineNames, childListPaths, childListSchema } =
    await import("../../src/lib/test-folders");
  assert.deepEqual(parseOutlineNames("1. Fractions\n2. Decimals\n• Fractions\n\nAlgebra, basics"), [
    "Fractions",
    "Decimals",
    "Algebra, basics",
  ]);
  const parent = { series_name: "My series", subject: "Maths", chapter: "", topic: "" };
  assert.deepEqual(childListPaths(parent, ["Fractions", "Decimals"]), [
    { ...parent, chapter: "Fractions" },
    { ...parent, chapter: "Decimals" },
  ]);
  assert.deepEqual(childListPaths({ ...parent, chapter: "Fractions" }, ["Addition"]), [
    { ...parent, chapter: "Fractions", topic: "Addition" },
  ]);
  assert.equal(
    childListSchema.safeParse({
      parent: { ...parent, chapter: "Fractions", topic: "Addition" },
      names: ["nested"],
    }).success,
    false,
  );
  assert.equal(childListSchema.safeParse({ parent, names: [] }).success, false);
});

test("own questions exceed 200 and lists exceed 50 without truncation", async () => {
  const { easyTestSchema } = await import("../../src/lib/easy-text-test");
  const { childListSchema } = await import("../../src/lib/test-folders");
  const data = {
    id: base.id,
    title: "Large own paper",
    subject: "Mathematics",
    chapter: "Addition",
    duration_minutes: 30,
    publish: true,
    questions: Array.from({ length: 1001 }, (_, i) => ({
      ...question,
      question_text: `What is ${i} plus 1?`,
    })),
  };
  assert.equal(easyTestSchema.parse(data).questions.length, 1001);
  assert.equal(
    childListSchema.parse({
      parent: { series_name: "Large", subject: "Mathematics", chapter: "", topic: "" },
      names: Array.from({ length: 101 }, (_, i) => `Chapter ${i}`),
    }).names.length,
    101,
  );
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await asRole(db, "service_role");
    await db.query("SELECT public.publish_easy_text_test_v3($1,$2::jsonb)", [
      fixtureIds.admin,
      JSON.stringify(data),
    ]);
    const count = await db.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM public.kkcc_test_questions WHERE test_id=$1",
      [data.id],
    );
    assert.equal(count.rows[0]!.n, 1001);
    const test = await db.query<{ questions_count: number; is_published: boolean }>(
      "SELECT questions_count,is_published FROM public.kkcc_tests WHERE id=$1",
      [data.id],
    );
    assert.equal(test.rows[0]!.questions_count, 1001);
    assert.equal(test.rows[0]!.is_published, true);
  } finally {
    await db.close();
  }
});
