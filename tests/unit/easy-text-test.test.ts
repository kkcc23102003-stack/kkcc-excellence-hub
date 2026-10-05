import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { easyTestSchema, previewEasyText } from "../../src/lib/easy-text-test";
import { generateCustomSyllabusPaper } from "../../src/lib/generated-test";
import { ACTIVE_TEMPLATES } from "../../src/lib/exam-bank";
import { createFixtureDatabase, seedFixtureUsers, asRole, fixtureIds } from "../fixtures/database";

const payload = {
  id: "90000000-0000-4000-8000-000000000001",
  title: "My maths paper",
  subject: "Mathematics",
  chapter: "Addition",
  series_name: "My practice",
  duration_minutes: 20,
  questions: [
    {
      question_text: "What is 2 + 3?",
      options: ["4", "5", "6", "7"],
      correct_index: 1,
      explanation: "ਮੇਰੀ explanation — 2 + 3 = 5.",
    },
  ],
};
test("easy paste preserves approved questions and catches incomplete numbered entries", () => {
  const text =
    "Q1. What is 2 + 3?\nA) 4\nB) 5\nAnswer: B\nExplanation: ਮੇਰਾ ਹੱਲ.\nQ2. Missing answer?\nA) yes\nB) no";
  const preview = previewEasyText(text);
  assert.equal(preview.incomplete, 1);
  assert.equal(preview.questions[0]?.explanation, "ਮੇਰਾ ਹੱਲ.");
  assert.ok(easyTestSchema.safeParse(payload).success);
  assert.ok(
    !easyTestSchema.safeParse({
      ...payload,
      questions: [{ ...payload.questions[0], correct_index: 5 }],
    }).success,
  );
  assert.ok(
    !easyTestSchema.safeParse({
      ...payload,
      questions: [{ ...payload.questions[0], options: ["same", "SAME"] }],
    }).success,
  );
});
test("strict generated papers never relabel SST or other chapters to fill gaps", () => {
  for (const subject of [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Punjabi Grammar",
    "English Grammar",
    "Accounting",
    "SST",
  ]) {
    const source = ACTIVE_TEMPLATES.find((t) => t.subject === subject)!;
    assert.ok(source, subject);
    const paper = generateCustomSyllabusPaper({
      exam: "All Exams",
      subject,
      topic: source.topic,
      difficulty: "Mixed",
      count: 5,
      marks: 1,
      negative_marks: 0,
      seed: "strict-audit",
    });
    assert.ok(paper.length > 0, subject);
    for (const q of paper) {
      const template = ACTIVE_TEMPLATES.find((t) => t.id === q.template_id)!;
      assert.equal(template.subject, subject);
      assert.equal(template.topic, source.topic);
      assert.equal(q.chapter, source.topic);
    }
  }
  for (const subject of ["", "Unknown subject", "Mathematics", "Physics"]) {
    const paper = generateCustomSyllabusPaper({
      exam: "All Exams",
      subject,
      topic: "Preamble",
      difficulty: "Mixed",
      count: 60,
      marks: 1,
      negative_marks: 0,
    });
    assert.equal(paper.length, 0, `${subject} must not get SST/Preamble filler`);
  }
  const unmapped = generateCustomSyllabusPaper({
    exam: "NEET",
    subject: "Accounting",
    topic: "Mixed",
    difficulty: "Mixed",
    count: 10,
    marks: 1,
    negative_marks: 0,
  });
  assert.equal(unmapped.length, 0, "exam boundary is not broadened to All Exams");
});
test("easy publish is atomic, admin-only, exact, idempotent, and manually editable", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await asRole(db, "authenticated", fixtureIds.studentA);
    await assert.rejects(
      db.query("SELECT public.publish_easy_text_test($1,$2::jsonb)", [
        fixtureIds.studentA,
        JSON.stringify(payload),
      ]),
      /permission/i,
    );
    await asRole(db, "service_role");
    await assert.rejects(
      db.query("SELECT public.publish_easy_text_test($1,$2::jsonb)", [
        fixtureIds.studentA,
        JSON.stringify(payload),
      ]),
      /Admin server only/,
    );
    const broken = {
      ...payload,
      questions: [
        ...payload.questions,
        { question_text: "Invalid row", options: ["only one"], correct_index: 4 },
      ],
    };
    await assert.rejects(
      db.query("SELECT public.publish_easy_text_test($1,$2::jsonb)", [
        fixtureIds.admin,
        JSON.stringify(broken),
      ]),
      /Invalid/,
    );
    assert.equal(
      (await db.query("SELECT * FROM public.kkcc_tests WHERE id=$1", [payload.id])).rows.length,
      0,
      "failed question rolls entire publication back",
    );
    for (let i = 0; i < 2; i++)
      await db.query("SELECT public.publish_easy_text_test($1,$2::jsonb)", [
        fixtureIds.admin,
        JSON.stringify(payload),
      ]);
    const tests = await db.query<{
      is_published: boolean;
      question_source: string;
      questions_count: number;
    }>("SELECT * FROM public.kkcc_tests WHERE id=$1", [payload.id]);
    assert.equal(tests.rows.length, 1);
    assert.equal(tests.rows[0]!.is_published, true);
    assert.equal(tests.rows[0]!.question_source, "manual");
    assert.equal(tests.rows[0]!.questions_count, 1);
    const questions = await db.query<{ explanation: string; options: string[]; subject: string }>(
      "SELECT * FROM public.kkcc_test_questions WHERE test_id=$1",
      [payload.id],
    );
    assert.equal(questions.rows.length, 1);
    assert.equal(questions.rows[0]!.explanation, payload.questions[0]!.explanation);
    assert.deepEqual(questions.rows[0]!.options, payload.questions[0]!.options);
    assert.equal(questions.rows[0]!.subject, "Mathematics");
    await assert.rejects(
      db.query("SELECT public.publish_easy_text_test($1,$2::jsonb)", [
        fixtureIds.admin,
        JSON.stringify({ ...payload, title: "Different" }),
      ]),
      /different content/,
    );
    await db.query(
      "UPDATE public.kkcc_test_questions SET explanation='Admin correction' WHERE test_id=$1",
      [payload.id],
    );
    assert.equal(
      (
        await db.query<{ explanation: string }>(
          "SELECT explanation FROM public.kkcc_test_questions WHERE test_id=$1",
          [payload.id],
        )
      ).rows[0]!.explanation,
      "Admin correction",
    );
    await db.query("DELETE FROM public.kkcc_tests WHERE id=$1", [payload.id]);
    assert.equal(
      (await db.query("SELECT * FROM public.kkcc_test_questions WHERE test_id=$1", [payload.id]))
        .rows.length,
      0,
    );
    await db.exec("RESET ROLE");
    await db.exec(readFileSync("KKCC-Excellence-Hub-EASY-TESTS.sql", "utf8"));
  } finally {
    await db.close();
  }
});

test("paid Easy tests validate prices and publish paid/coin/free access atomically with v2", async () => {
  assert.equal(easyTestSchema.safeParse({ ...payload, is_paid: true }).success, false);
  assert.equal(
    easyTestSchema.safeParse({ ...payload, is_paid: true, price_inr: -5 }).success,
    false,
  );
  assert.equal(
    easyTestSchema.safeParse({ ...payload, is_paid: true, price_inr: 100001 }).success,
    false,
  );
  assert.equal(easyTestSchema.parse({ ...payload, is_paid: false, price_inr: 99 }).price_inr, 0);
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await asRole(db, "authenticated", fixtureIds.studentA);
    await assert.rejects(
      db.query("SELECT public.publish_easy_text_test_v2($1,$2::jsonb)", [
        fixtureIds.admin,
        JSON.stringify(payload),
      ]),
      /permission/i,
    );
    await asRole(db, "service_role");
    await assert.rejects(
      db.query("SELECT public.publish_easy_text_test_v2($1,$2::jsonb)", [
        fixtureIds.studentA,
        JSON.stringify(payload),
      ]),
      /Admin server only/,
    );
    await assert.rejects(
      db.query("SELECT public.publish_easy_text_test_v2($1,$2::jsonb)", [
        fixtureIds.admin,
        JSON.stringify({ ...payload, is_paid: true }),
      ]),
      /paid test needs/,
    );
    assert.equal(
      (await db.query("SELECT * FROM public.kkcc_tests WHERE id=$1", [payload.id])).rows.length,
      0,
    );
    const configurations = [
      { is_paid: true, price_inr: 199, price_coins: 0 },
      { is_paid: true, price_inr: 0, price_coins: 150 },
      { is_paid: true, price_inr: 299, price_coins: 200 },
      { is_paid: false, price_inr: 299, price_coins: 200 },
    ];
    for (const [index, config] of configurations.entries()) {
      const data = { ...payload, ...config, id: `90000000-0000-4000-8000-00000000000${index + 2}` };
      for (let retry = 0; retry < 2; retry++)
        await db.query("SELECT public.publish_easy_text_test_v2($1,$2::jsonb)", [
          fixtureIds.admin,
          JSON.stringify(data),
        ]);
      const result = await db.query<{
        is_paid: boolean;
        price_inr: number;
        price_coins: number;
        is_published: boolean;
      }>("SELECT * FROM public.kkcc_tests WHERE id=$1", [data.id]);
      assert.equal(result.rows.length, 1);
      const saved = result.rows[0]!;
      assert.equal(saved.is_paid, config.is_paid);
      assert.equal(saved.price_inr, config.is_paid ? config.price_inr : 0);
      assert.equal(saved.price_coins, config.is_paid ? config.price_coins : 0);
      assert.equal(saved.is_published, true);
      assert.equal(
        (await db.query("SELECT * FROM public.kkcc_test_questions WHERE test_id=$1", [data.id]))
          .rows.length,
        1,
      );
    }
    await db.exec("RESET ROLE");
    await db.exec(readFileSync("KKCC-Excellence-Hub-PUBLISH-FIX.sql", "utf8"));
    await db.exec(readFileSync("KKCC-Excellence-Hub-PUBLISH-FIX.sql", "utf8"));
    assert.equal(
      (await db.query("SELECT * FROM public.kkcc_tests WHERE is_paid=true")).rows.length,
      3,
    );
  } finally {
    await db.close();
  }
});
