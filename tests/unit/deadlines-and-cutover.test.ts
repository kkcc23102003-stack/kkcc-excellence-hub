import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import {
  createFixtureDatabase,
  seedFixtureUsers,
  fixtureIds as ids,
  asRole,
} from "../fixtures/database";

test("Legacy cutover is blocked until the owner explicitly acknowledges verified educational/config export", async () => {
  const db = await createFixtureDatabase(true, false);
  try {
    await assert.rejects(
      db.exec(readFileSync("supabase/STUDENT_ONLY_SCHEMA.sql", "utf8")),
      /Verified project-content export/,
    );
    await db.exec("ROLLBACK");
    assert.ok((await db.query("SELECT * FROM public.site_settings")).rows.length > 0);
    await db.query("SELECT set_config('kkcc.verified_project_export','true',false)");
    await db.exec(readFileSync("supabase/STUDENT_ONLY_SCHEMA.sql", "utf8"));
  } finally {
    await db.close();
  }
});
test("Server-time question windows, monotonic autosave, late submission retries, quotas and backend admin safety", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    const columns = await db.query<{ column_name: string }>(
      "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='learning_attempts'",
    );
    assert.ok(
      !columns.rows.some((row) =>
        [
          "exam",
          "subject",
          "chapter",
          "seed",
          "question_text",
          "options",
          "correct_index",
          "explanation",
        ].includes(row.column_name),
      ),
      "Educational context/content is not stored in Supabase attempts.",
    );
    await asRole(db, "authenticated", ids.admin);
    await assert.rejects(
      db.query("DELETE FROM public.user_roles WHERE user_id=$1 AND role='admin'", [ids.admin]),
      /one admin/,
    );
    await assert.rejects(
      db.query("INSERT INTO public.student_blocks(user_id,reason) VALUES($1,'bad')", [ids.admin]),
      /Admin accounts cannot/,
    );
    await assert.rejects(
      db.query("SELECT public.admin_grant_learning_access('test',$1,$2,'free',0,'',NULL,0)", [
        ids.test,
        ids.blocked,
      ]),
      /blocked/,
    );
    await asRole(db, "service_role");
    const id = randomUUID();
    await db.query(
      "INSERT INTO public.learning_attempts(id,user_id,duration_seconds,question_timer_seconds,question_count,source_refs) VALUES($1,$2,300,100,3,ARRAY['q1','q2','q3'])",
      [id, ids.studentA],
    );
    const save = (answers: object, revision: number) =>
      db.query<{ result: { ok: boolean; reason?: string } }>(
        "SELECT public.save_learning_attempt_answers($1,$2,$3::jsonb,$4) result",
        [ids.studentA, id, JSON.stringify(answers), revision],
      );
    assert.ok((await save({ q1: 0 }, 2)).rows[0]?.result.ok);
    assert.equal((await save({ q1: 1 }, 1)).rows[0]?.result.reason, "stale_revision");
    assert.equal(
      (await save({ q1: 0, q2: 1 }, 3)).rows[0]?.result.reason,
      "question_window_closed",
    );
    await db.query(
      "UPDATE public.learning_attempts SET started_at=now()-interval '110 seconds' WHERE id=$1",
      [id],
    );
    assert.equal((await save({ q1: 1 }, 3)).rows[0]?.result.reason, "question_window_closed");
    assert.ok((await save({ q1: 0, q2: 1 }, 4)).rows[0]?.result.ok);
    await db.query(
      "UPDATE public.learning_attempts SET started_at=now()-interval '10 minutes' WHERE id=$1",
      [id],
    );
    const result = { score: 1, correct: 1, attempted: 2, totalMarks: 3 };
    await assert.rejects(
      db.query("SELECT public.finalize_learning_attempt($1,$2,'{}','{}',$3::jsonb,$3::jsonb)", [
        ids.studentA,
        id,
        JSON.stringify(result),
      ]),
      /ATTEMPT_RETRY/,
    );
    const done = await db.query<{ result: { status: string; answers: object } }>(
      "SELECT public.finalize_learning_attempt($1,$2,'{}','{\"q1\":0,\"q2\":1}',$3::jsonb,$3::jsonb) result",
      [ids.studentA, id, JSON.stringify(result)],
    );
    assert.equal(done.rows[0]?.result.status, "submitted");
    assert.deepEqual(done.rows[0]?.result.answers, { q1: 0, q2: 1 });
    for (let index = 0; index < 29; index++)
      await db.query(
        "INSERT INTO public.learning_attempts(id,user_id,duration_seconds,question_count,source_refs) VALUES($1,$2,60,1,ARRAY['q'])",
        [randomUUID(), ids.studentA],
      );
    await assert.rejects(
      db.query(
        "INSERT INTO public.learning_attempts(id,user_id,duration_seconds,question_count,source_refs) VALUES($1,$2,60,1,ARRAY['q'])",
        [randomUUID(), ids.studentA],
      ),
      /start limit/,
    );
    const pending = randomUUID();
    await db.exec("RESET ROLE");
    await db.query(
      "INSERT INTO public.offline_access_grants(email,course_id,status) VALUES('pending@fixture.invalid',$1,'pending')",
      [ids.course],
    );
    await db.query(
      "INSERT INTO auth.users(id,email,raw_user_meta_data) VALUES($1,'pending@fixture.invalid','{\"role\":\"admin\"}')",
      [pending],
    );
    assert.equal(
      (await db.query("SELECT * FROM public.course_enrollments WHERE user_id=$1", [pending])).rows
        .length,
      0,
    );
    await db.query("UPDATE auth.users SET email_confirmed_at=now() WHERE id=$1", [pending]);
    assert.equal(
      (await db.query("SELECT * FROM public.course_enrollments WHERE user_id=$1", [pending])).rows
        .length,
      1,
    );
    assert.equal(
      (
        await db.query("SELECT * FROM public.user_roles WHERE user_id=$1 AND role='admin'", [
          pending,
        ])
      ).rows.length,
      0,
      "Metadata cannot grant admin.",
    );
  } finally {
    await db.close();
  }
});
