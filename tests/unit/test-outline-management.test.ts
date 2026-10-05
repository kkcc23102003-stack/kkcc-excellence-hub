import { test } from "node:test";
import assert from "node:assert/strict";
import { createFixtureDatabase, seedFixtureUsers, asRole, fixtureIds } from "../fixtures/database";
import { outlineMutationSchema } from "../../src/lib/test-folders";

test("outline management schema rejects ambiguous scopes and blank renames", () => {
  const base = {
    level: "series",
    action: "delete",
    path: { series_name: "Series", subject: "", chapter: "", topic: "" },
    expected_ids: [],
  };
  assert.equal(outlineMutationSchema.safeParse(base).success, true);
  assert.equal(outlineMutationSchema.safeParse({ ...base, level: "subject" }).success, false);
  assert.equal(
    outlineMutationSchema.safeParse({ ...base, action: "rename", name: " " }).success,
    false,
  );
});

test("outline mutations rename descendants atomically, protect collisions and stale confirmation, delete only matching manual tests", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await asRole(db, "service_role");
    const id = "91000000-0000-4000-8000-000000000001",
      other = "91000000-0000-4000-8000-000000000002";
    const payload = {
      id,
      title: "Original title",
      series_name: "Series A",
      subject: "Maths",
      chapter: "Addition",
      topic: "Basics",
      duration_minutes: 30,
      publish: true,
      is_paid: true,
      price_inr: 99,
      questions: [
        {
          question_text: "What is 2 + 3?",
          options: ["4", "5"],
          correct_index: 1,
          explanation: "Own explanation",
        },
      ],
    };
    for (const p of [payload, { ...payload, id: other, series_name: "Unrelated" }])
      await db.query("SELECT public.publish_easy_text_test_v3($1,$2::jsonb)", [
        fixtureIds.admin,
        JSON.stringify(p),
      ]);
    const path = {
      series_name: "Series A",
      subject: "Maths",
      chapter: "Addition",
      topic: "Basics",
    };
    const mutate = (
      level: string,
      action: string,
      p: typeof path,
      name: string,
      ids: string[] = [id],
    ) =>
      db.query("SELECT public.manage_test_outline($1,$2,$3,$4::jsonb,$5,$6::uuid[])", [
        fixtureIds.admin,
        level,
        action,
        JSON.stringify(p),
        name,
        ids,
      ]);
    await assert.rejects(mutate("topic", "delete", path, "", []), /changed/);
    await mutate("topic", "rename", path, "Fundamentals");
    path.topic = "Fundamentals";
    await mutate("chapter", "rename", { ...path, topic: "" }, "Numbers");
    path.chapter = "Numbers";
    await mutate("subject", "rename", { ...path, chapter: "", topic: "" }, "Mathematics");
    path.subject = "Mathematics";
    await assert.rejects(
      mutate("series", "rename", { ...path, subject: "", chapter: "", topic: "" }, "Unrelated"),
      /already exists/,
    );
    await mutate("series", "rename", { ...path, subject: "", chapter: "", topic: "" }, "Renamed");
    path.series_name = "Renamed";
    const row = (
      await db.query<{
        series_name: string;
        syllabus_subject: string;
        syllabus_chapter: string;
        syllabus_topic: string;
        title: string;
        is_paid: boolean;
        price_inr: number;
        is_published: boolean;
      }>("SELECT * FROM public.kkcc_tests WHERE id=$1", [id])
    ).rows[0]!;
    assert.equal(row.series_name, "Renamed");
    assert.equal(row.syllabus_subject, "Mathematics");
    assert.equal(row.syllabus_chapter, "Numbers");
    assert.equal(row.syllabus_topic, "Fundamentals");
    assert.equal(row.title, "Original title");
    assert.equal(row.price_inr, 99);
    assert.equal(row.is_paid, true);
    assert.equal(row.is_published, true);
    assert.equal(
      (
        await db.query<{ subject: string }>(
          "SELECT subject FROM public.kkcc_test_questions WHERE test_id=$1",
          [id],
        )
      ).rows[0]!.subject,
      "Mathematics",
    );
    await asRole(db, "authenticated", fixtureIds.studentA);
    await assert.rejects(mutate("topic", "delete", path, ""), /permission/);
    await asRole(db, "service_role");
    await mutate("topic", "delete", path, "");
    assert.equal(
      (await db.query("SELECT id FROM public.kkcc_test_questions WHERE test_id=$1", [id])).rows
        .length,
      0,
    );
    assert.equal(
      (await db.query("SELECT id FROM public.kkcc_tests WHERE id=$1", [other])).rows.length,
      1,
    );
    await mutate("series", "delete", { ...path, subject: "", chapter: "", topic: "" }, "", []);
    assert.equal(
      (await db.query("SELECT id FROM public.kkcc_test_folders WHERE series_name='Renamed'")).rows
        .length,
      0,
    );
    assert.equal(
      (await db.query("SELECT id FROM public.kkcc_test_folders WHERE series_name='Unrelated'")).rows
        .length,
      3,
    );
  } finally {
    await db.close();
  }
});
