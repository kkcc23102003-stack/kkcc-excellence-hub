import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createFixtureDatabase, seedFixtureUsers, asRole, fixtureIds } from "../fixtures/database";
import { builtInMaterials } from "../../src/lib/builtin-materials.server";
const sql = readFileSync("KKCC-Excellence-Hub-CONTENT-RESET.sql", "utf8");
test("reset installation is non-destructive, repeatable and inaccessible to students", async () => {
  assert.equal(sql, readFileSync("public/KKCC-Excellence-Hub-CONTENT-RESET.sql", "utf8"));
  assert.equal(sql, readFileSync("supabase/migrations/20261009190000_content_reset.sql", "utf8"));
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await db.query(
      "INSERT INTO public.kkcc_materials(title,description) VALUES('Preserve until confirmed','original')",
    );
    await db.exec(sql);
    await db.exec(sql);
    assert.equal(
      (await db.query<{ description: string }>("SELECT description FROM public.kkcc_materials"))
        .rows[0]!.description,
      "original",
    );
    for (const role of ["anon", "authenticated"] as const) {
      await asRole(db, role, fixtureIds.studentA);
      await assert.rejects(
        db.query("SELECT public.admin_remove_old_content($1)", [fixtureIds.admin]),
        /permission denied/,
      );
      await assert.rejects(
        db.query("SELECT * FROM public.kkcc_removed_content_files"),
        /permission denied/,
      );
    }
    await asRole(db, "service_role");
    await assert.rejects(
      db.query("SELECT public.admin_remove_old_content($1)", [fixtureIds.studentA]),
      /Admin server only/,
    );
    await assert.rejects(
      db.query("SELECT public.admin_remove_old_content($1,'remove',now(),'wrong')", [
        fixtureIds.admin,
      ]),
      /confirm/,
    );
  } finally {
    await db.close();
  }
});
test("confirmed removal clears bodies, keeps student references/records, excludes new content and protects shared files", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    const users = await db.query("SELECT * FROM public.profiles ORDER BY id");
    const id = randomUUID(),
      qid = randomUUID(),
      mid = randomUUID(),
      path = `${id}/${randomUUID()}.json`;
    await db.query(
      "INSERT INTO public.kkcc_tests(id,title,is_published,created_at) VALUES($1,'Old test',true,'2026-01-01')",
      [id],
    );
    await db.query(
      "INSERT INTO public.kkcc_test_questions(id,test_id,question_text,options,correct_index,explanation,body_storage_path,created_at) VALUES($1,$2,'Old private question',ARRAY['A','B'],1,'Old explanation',$3,'2026-01-01')",
      [qid, id, path],
    );
    await db.query(
      "INSERT INTO public.kkcc_materials(id,title,description,created_at) VALUES($1,'Old note','Erase this content','2026-01-01')",
      [mid],
    );
    await db.exec(
      "CREATE TABLE public.fixture_student_links(student_id uuid REFERENCES auth.users(id),test_id uuid REFERENCES public.kkcc_tests(id),question_id uuid REFERENCES public.kkcc_test_questions(id),note_id uuid REFERENCES public.kkcc_materials(id));",
    );
    await db.query("INSERT INTO public.fixture_student_links VALUES($1,$2,$3,$4)", [
      fixtureIds.studentA,
      id,
      qid,
      mid,
    ]);
    await asRole(db, "service_role");
    const review = (
      await db.query<{ r: { cutoff: string; remaining: number } }>(
        "SELECT public.admin_remove_old_content($1) r",
        [fixtureIds.admin],
      )
    ).rows[0]!.r;
    assert.equal(review.remaining, 3);
    const newer = randomUUID();
    await db.query(
      "INSERT INTO public.kkcc_materials(id,title,description,created_at) VALUES($1,'New','Keep me',$2::timestamptz+interval '1 second')",
      [newer, review.cutoff],
    );
    await db.query(
      "SELECT public.admin_remove_old_content($1,'remove',$2,'DELETE OLD NOTES AND TESTS')",
      [fixtureIds.admin, review.cutoff],
    );
    const question = (
      await db.query<{ id: string; question_text: string; content_deleted_at: string }>(
        "SELECT * FROM public.kkcc_test_questions WHERE id=$1",
        [qid],
      )
    ).rows[0]!;
    assert.equal(question.question_text, "");
    assert.ok(question.content_deleted_at);
    assert.equal(question.id, qid);
    assert.equal(
      (
        await db.query<{ description: string }>(
          "SELECT description FROM public.kkcc_materials WHERE id=$1",
          [newer],
        )
      ).rows[0]!.description,
      "Keep me",
    );
    const files = (
      await db.query<{ r: Array<{ bucket: string; path: string }> }>(
        "SELECT public.admin_remove_old_content($1,'files') r",
        [fixtureIds.admin],
      )
    ).rows[0]!.r;
    assert.equal(files[0]!.path, path);
    const sharedId = randomUUID();
    await db.query(
      "INSERT INTO public.kkcc_test_questions(id,test_id,question_text,options,correct_index,body_storage_path) VALUES($1,$2,'',ARRAY[]::text[],1,$3)",
      [sharedId, id, path],
    );
    assert.deepEqual(
      (
        await db.query<{ r: unknown[] }>("SELECT public.admin_remove_old_content($1,'files') r", [
          fixtureIds.admin,
        ])
      ).rows[0]!.r,
      [],
    );
    await db.exec("RESET ROLE");
    assert.deepEqual(await db.query("SELECT * FROM public.profiles ORDER BY id"), users);
    assert.equal((await db.query("SELECT * FROM public.fixture_student_links")).rows.length, 1);
  } finally {
    await db.close();
  }
});
test("sample restore stores references only, resurrects removed samples but never overwrites live edits", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await asRole(db, "service_role");
    const sample = builtInMaterials()[0]!;
    const row = {
      ...sample,
      description: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      body_storage_path: `${sample.id}/${randomUUID()}.txt`,
      body_storage_sha256: "a".repeat(64),
      body_storage_bytes: 123,
    };
    await db.query("SELECT public.restore_storage_sample_notes($1,$2)", [fixtureIds.admin, [row]]);
    await db.query("UPDATE public.kkcc_materials SET title='Live admin edit' WHERE id=$1", [
      sample.id,
    ]);
    await db.query("SELECT public.restore_storage_sample_notes($1,$2)", [fixtureIds.admin, [row]]);
    assert.equal(
      (
        await db.query<{ title: string }>("SELECT title FROM public.kkcc_materials WHERE id=$1", [
          sample.id,
        ])
      ).rows[0]!.title,
      "Live admin edit",
    );
    await db.query("UPDATE public.kkcc_materials SET content_deleted_at=now() WHERE id=$1", [
      sample.id,
    ]);
    await db.query("SELECT public.restore_storage_sample_notes($1,$2)", [fixtureIds.admin, [row]]);
    const saved = (
      await db.query<{
        title: string;
        description: string;
        content_deleted_at: null;
        body_storage_path: string;
      }>("SELECT * FROM public.kkcc_materials WHERE id=$1", [sample.id])
    ).rows[0]!;
    assert.equal(saved.title, sample.title);
    assert.equal(saved.description, "");
    assert.equal(saved.content_deleted_at, null);
    assert.equal(saved.body_storage_path, row.body_storage_path);
  } finally {
    await db.close();
  }
});

test("reset refuses unprotected attempts and preserves complete student rows once snapshot verification is recorded", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    const testId = randomUUID(),
      attempt = randomUUID();
    await db.query(
      "INSERT INTO public.kkcc_tests(id,title,is_published,created_at) VALUES($1,'Preserve history',true,'2026-01-01')",
      [testId],
    );
    await db.query(
      "INSERT INTO public.learning_attempts(id,user_id,test_id,duration_seconds,question_count,source_refs,status) VALUES($1,$2,$3,600,1,ARRAY['q1'],'started')",
      [attempt, fixtureIds.studentA, testId],
    );
    const before = await db.query("SELECT * FROM public.learning_attempts");
    const cutoff = new Date().toISOString();
    await asRole(db, "service_role");
    await assert.rejects(
      db.query(
        "SELECT public.admin_remove_old_content($1,'remove',$2,'DELETE OLD NOTES AND TESTS')",
        [fixtureIds.admin, cutoff],
      ),
      /Protect existing attempt papers/,
    );
    assert.equal(
      (
        await db.query<{ is_published: boolean }>(
          "SELECT is_published FROM public.kkcc_tests WHERE id=$1",
          [testId],
        )
      ).rows[0]!.is_published,
      true,
    );
    await db.query(
      "INSERT INTO public.kkcc_attempt_papers(attempt_id,path,sha256,bytes,verified_at) VALUES($1,$2,$3,100,'2020-01-01')",
      [attempt, `${attempt}/${randomUUID()}.json`, "a".repeat(64)],
    );
    await assert.rejects(
      db.query(
        "SELECT public.admin_remove_old_content($1,'remove',$2,'DELETE OLD NOTES AND TESTS')",
        [fixtureIds.admin, cutoff],
      ),
      /Protect existing attempt papers/,
    );
    await db.query("UPDATE public.kkcc_attempt_papers SET verified_at=clock_timestamp()");
    await db.query(
      "SELECT public.admin_remove_old_content($1,'remove',$2,'DELETE OLD NOTES AND TESTS')",
      [fixtureIds.admin, cutoff],
    );
    assert.deepEqual((await db.query("SELECT * FROM public.learning_attempts")).rows, before.rows);
    await asRole(db, "authenticated", fixtureIds.studentA);
    await assert.rejects(db.query("SELECT * FROM public.kkcc_attempt_papers"), /permission denied/);
  } finally {
    await db.close();
  }
});
