import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import {
  writeVerifiedTestBodies,
  decodeTestBody,
  validateTestReference,
} from "../../src/lib/test-body-store";
import { createFixtureDatabase, seedFixtureUsers, asRole, fixtureIds } from "../fixtures/database";
import type { NoteBodyIO } from "../../src/lib/note-body-store";
const sql = readFileSync("KKCC-Excellence-Hub-TEST-BODIES.sql", "utf8");
const testId = "80000000-0000-4000-8000-000000000001";
const makeRow = () => ({
  id: randomUUID(),
  test_id: testId,
  question_text: "  ਪੰਜਾਬੀ प्रश्न — exact\ntext",
  options: ['A "quoted"', "ਦੋ\nlines", "हिन्दी"],
  correct_index: 2,
  explanation: "  Explanation\nmath x² + y² = z²  ",
});
function memory() {
  const files = new Map<string, Buffer>();
  const io: NoteBodyIO = {
    write: async (key, bytes) => {
      assert.ok(!files.has(key));
      files.set(key, bytes);
    },
    read: async (key) => {
      if (!files.has(key)) throw new Error("Missing");
      return files.get(key)!;
    },
  };
  return { files, io };
}
const md5 = (text: string) => createHash("md5").update(text).digest("hex");
test("1001 questions share one verified immutable file, preserve exact text, IDs and grading metadata", async () => {
  const { files, io } = memory();
  const rows = Array.from({ length: 1001 }, makeRow);
  const stored = await writeVerifiedTestBodies(io, rows);
  assert.equal(files.size, 1);
  assert.equal(stored.length, 1001);
  const body = decodeTestBody(files.get(stored[0]!.body_storage_path!)!, stored[0]!);
  for (const [i, row] of stored.entries()) {
    validateTestReference(row);
    assert.equal(row.question_text, "");
    assert.deepEqual(row.options, []);
    assert.equal(row.correct_index, 2);
    assert.equal(row.id, rows[i]!.id);
    assert.equal(body.get(row.id)!.explanation, rows[i]!.explanation);
    assert.deepEqual(body.get(row.id)!.options, rows[i]!.options);
  }
  const edit = await writeVerifiedTestBodies(io, [{ ...rows[0]!, question_text: "Edited" }]);
  assert.notEqual(edit[0]!.body_storage_path, stored[0]!.body_storage_path);
  assert.equal(files.size, 2);
  assert.throws(
    () => validateTestReference({ ...stored[0]!, test_id: fixtureIds.test }),
    /reference/,
  );
});
test("upload/read-back failures, corrupt bytes and duplicate question IDs never yield cleared DB payloads", async () => {
  const { io } = memory(),
    rows = [makeRow()];
  await assert.rejects(
    writeVerifiedTestBodies(
      {
        ...io,
        write: async () => {
          throw new Error("quota");
        },
      },
      rows,
    ),
    /quota/,
  );
  await assert.rejects(
    writeVerifiedTestBodies(
      {
        ...io,
        read: async () => {
          throw new Error("network");
        },
      },
      rows,
    ),
    /network/,
  );
  await assert.rejects(
    writeVerifiedTestBodies({ ...io, read: async () => Buffer.from("bad") }, rows),
    /verification/,
  );
  await assert.rejects(writeVerifiedTestBodies(io, [rows[0]!, rows[0]!]), /Duplicate/);
  assert.notEqual(rows[0]!.question_text, "");
});
test("SQL setup is repeatable, private against broad policies, and does not move existing content", async () => {
  assert.equal(sql, readFileSync("public/KKCC-Excellence-Hub-TEST-BODIES.sql", "utf8"));
  assert.equal(
    sql,
    readFileSync("supabase/migrations/20261009160000_test_body_storage.sql", "utf8"),
  );
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await db.exec(sql);
    await db.exec(sql);
    assert.equal(
      (
        await db.query<{ public: boolean }>(
          "SELECT public FROM storage.buckets WHERE id='kkcc-test-bodies'",
        )
      ).rows[0]!.public,
      false,
    );
    await db.exec(
      "INSERT INTO storage.objects(bucket_id,name) VALUES('kkcc-test-bodies','secret.json'); GRANT SELECT ON storage.objects TO anon,authenticated; CREATE POLICY fixture_broad ON storage.objects FOR SELECT TO anon,authenticated USING(true);",
    );
    for (const role of ["anon", "authenticated"] as const) {
      await asRole(db, role, fixtureIds.studentA);
      assert.equal(
        (await db.query("SELECT * FROM storage.objects WHERE bucket_id='kkcc-test-bodies'")).rows
          .length,
        0,
      );
      await assert.rejects(
        db.query("SELECT * FROM public.test_body_storage_status($1)", [fixtureIds.admin]),
        /permission denied/,
      );
      await assert.rejects(
        db.query("SELECT public.publish_storage_text_test($1,$2)", [fixtureIds.admin, {}]),
        /permission denied/,
      );
    }
  } finally {
    await db.close();
  }
});
test("managed and historical migration preserves student records, question IDs/FKs and skips concurrent edits", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await db.exec(
      "CREATE TABLE public.test_questions(LIKE public.kkcc_test_questions INCLUDING DEFAULTS INCLUDING CONSTRAINTS); ALTER TABLE public.test_questions ADD PRIMARY KEY(id); CREATE TABLE public.materials(id uuid PRIMARY KEY,title text,description text,updated_at timestamptz DEFAULT now());",
    );
    await db.exec(sql);
    const studentBefore = await db.query("SELECT * FROM public.profiles ORDER BY id");
    await db.query("INSERT INTO public.kkcc_tests(id,title) VALUES($1,$2)", [
      testId,
      "Preserve metadata",
    ]);
    const row = makeRow();
    for (const table of ["kkcc_test_questions", "test_questions"])
      await db.query(
        `INSERT INTO public.${table}(id,test_id,question_text,options,correct_index,explanation,updated_at) VALUES($1,$2,$3,$4,$5,$6,'2026-01-01')`,
        [row.id, row.test_id, row.question_text, row.options, row.correct_index, row.explanation],
      );
    await db.exec(
      "CREATE TABLE public.fixture_student_links(student_id uuid REFERENCES auth.users(id),question_id uuid REFERENCES public.test_questions(id),note_id uuid REFERENCES public.materials(id));",
    );
    const noteId = randomUUID();
    await db.query(
      "INSERT INTO public.materials(id,title,description,updated_at) VALUES($1,'old note','Historical original','2026-01-01')",
      [noteId],
    );
    await db.query("INSERT INTO public.fixture_student_links VALUES($1,$2,$3)", [
      fixtureIds.studentA,
      row.id,
      noteId,
    ]);
    const ref = (await writeVerifiedTestBodies(memory().io, [row]))[0]!;
    await asRole(db, "service_role");
    const call = "SELECT public.move_test_question_body($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) AS moved";
    const args = [
      fixtureIds.admin,
      row.id,
      "2026-01-01",
      md5(row.question_text),
      md5(JSON.stringify(row.options)),
      md5(row.explanation),
      ref.body_storage_path,
      ref.body_storage_sha256,
      ref.body_storage_bytes,
      false,
    ];
    await assert.rejects(
      db.query(call, [fixtureIds.studentA, ...args.slice(1)]),
      /Admin server only/,
    );
    await db.query(
      "UPDATE public.kkcc_test_questions SET question_text='Concurrent edit' WHERE id=$1",
      [row.id],
    );
    assert.equal((await db.query<{ moved: boolean }>(call, args)).rows[0]!.moved, false);
    await db.query(
      "UPDATE public.kkcc_test_questions SET question_text=$1,updated_at='2026-01-01' WHERE id=$2",
      [row.question_text, row.id],
    );
    assert.equal((await db.query<{ moved: boolean }>(call, args)).rows[0]!.moved, true);
    assert.equal((await db.query<{ moved: boolean }>(call, args)).rows[0]!.moved, false);
    assert.equal(
      (await db.query<{ moved: boolean }>(call, [...args.slice(0, -1), true])).rows[0]!.moved,
      true,
    );
    assert.equal(
      (
        await db.query<{ moved: boolean }>(
          "SELECT public.move_legacy_note_body($1,$2,$3,$4,$5,$6,$7) AS moved",
          [
            fixtureIds.admin,
            noteId,
            "2026-01-01",
            md5("Historical original"),
            `${noteId}/${randomUUID()}.txt`,
            "a".repeat(64),
            19,
          ],
        )
      ).rows[0]!.moved,
      true,
    );
    const status = (
      await db.query<{ source: string; inline_count: number }>(
        "SELECT * FROM public.test_body_storage_status($1)",
        [fixtureIds.admin],
      )
    ).rows;
    assert.equal(status.length, 3);
    assert.ok(status.every((s) => Number(s.inline_count) === 0));
    await db.exec("RESET ROLE");
    assert.deepEqual(await db.query("SELECT * FROM public.profiles ORDER BY id"), studentBefore);
    assert.equal((await db.query("SELECT * FROM public.fixture_student_links")).rows.length, 1);
    for (const table of ["kkcc_test_questions", "test_questions"]) {
      const saved = (
        await db.query<{ id: string; question_text: string; correct_index: number }>(
          `SELECT * FROM public.${table} WHERE id=$1`,
          [row.id],
        )
      ).rows[0]!;
      assert.equal(saved.id, row.id);
      assert.equal(saved.question_text, "");
      assert.equal(saved.correct_index, 2);
    }
  } finally {
    await db.close();
  }
});
test("Storage-backed Easy publish is transactional, retains paid controls and is idempotent without uploading text to DB", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await asRole(db, "service_role");
    const row = makeRow();
    const stored = (await writeVerifiedTestBodies(memory().io, [row]))[0]!;
    const payload = {
      id: testId,
      title: "Storage paid test",
      subject: "Physics",
      chapter: "Light",
      duration_minutes: 30,
      is_paid: true,
      price_inr: 50,
      price_coins: 20,
      publish: true,
      _request_hash: "b".repeat(64),
      questions: [{ ...stored, option_count: 3 }],
    };
    const call = "SELECT public.publish_storage_text_test($1,$2)";
    await db.query(call, [fixtureIds.admin, payload]);
    await db.query(call, [fixtureIds.admin, payload]);
    const rows = (
      await db.query<{ question_text: string; options: string[]; body_storage_path: string }>(
        "SELECT * FROM public.kkcc_test_questions WHERE test_id=$1",
        [testId],
      )
    ).rows;
    assert.equal(rows.length, 1);
    assert.equal(rows[0]!.question_text, "");
    assert.deepEqual(rows[0]!.options, []);
    assert.equal(rows[0]!.body_storage_path, stored.body_storage_path);
    const meta = (
      await db.query<{ is_paid: boolean; price_inr: number; questions_count: number }>(
        "SELECT * FROM public.kkcc_tests WHERE id=$1",
        [testId],
      )
    ).rows[0]!;
    assert.equal(meta.is_paid, true);
    assert.equal(meta.price_inr, 50);
    assert.equal(meta.questions_count, 1);
    await assert.rejects(
      db.query(call, [fixtureIds.admin, { ...payload, _request_hash: "c".repeat(64) }]),
      /different content/,
    );
    const invalidId = randomUUID();
    await assert.rejects(
      db.query(call, [fixtureIds.admin, { ...payload, id: invalidId }]),
      /Invalid verified/,
    );
    assert.equal(
      (await db.query("SELECT * FROM public.kkcc_tests WHERE id=$1", [invalidId])).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
