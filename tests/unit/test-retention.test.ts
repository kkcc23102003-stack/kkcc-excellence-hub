import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  createFixtureDatabase,
  seedFixtureUsers,
  fixtureIds as ids,
  asRole,
} from "../fixtures/database";
import {
  sealTemporary,
  openTemporary,
  checkpointAnswers,
  paperFingerprint,
  type TemporaryClaim,
} from "../../src/lib/temporary-test.server";
import type { ScorableQuestion } from "../../src/lib/test-scoring";

test("Retention SQL: defaults ON, admin-only switch, OFF write guards and confirmed scoped cleanup", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await asRole(db, "authenticated", ids.studentA);
    assert.equal(
      (
        await db.query<{ result: { save_results: boolean } }>(
          "SELECT public.get_test_retention() result",
        )
      ).rows[0]?.result.save_results,
      true,
    );
    await assert.rejects(
      db.query("SELECT public.admin_test_retention('set',false)"),
      /Admin access/,
    );
    await assert.rejects(
      db.query("UPDATE public.kkcc_test_retention SET save_results=false"),
      /permission/,
    );
    await asRole(db, "service_role");
    const insert = () =>
      db.query(
        "INSERT INTO public.learning_attempts(id,user_id,duration_seconds,question_count,source_refs) VALUES($1,$2,600,1,ARRAY['q1'])",
        [randomUUID(), ids.studentA],
      );
    await insert();
    await insert();
    await asRole(db, "authenticated", ids.admin);
    await db.query(
      "SELECT public.admin_grant_learning_access('test',$1,$2,'free',0,'keep me',NULL,0)",
      [ids.test, ids.studentA],
    );
    await assert.rejects(
      db.query("SELECT public.admin_test_retention('cleanup',NULL,now(),'DELETE TEST HISTORY')"),
      /OFF/,
    );
    type Report = {
      epoch: string;
      cutoff: string;
      history_count: number;
      deleted: number;
      save_results: boolean;
      eligible_count: number;
    };
    const run = async (sql: string, params: unknown[] = []) =>
      (await db.query<{ result: Report }>(sql, params)).rows[0]!.result;
    const on = await run("SELECT public.admin_test_retention() result");
    const off = await run("SELECT public.admin_test_retention('set',false) result");
    assert.notEqual(off.epoch, on.epoch);
    assert.equal(off.history_count, 2);
    await assert.rejects(
      db.query("SELECT public.admin_test_retention('cleanup',NULL,now(),'wrong')"),
      /confirm/,
    );
    await asRole(db, "service_role");
    await assert.rejects(insert(), /saving is OFF/);
    await assert.rejects(
      db.query("UPDATE public.learning_attempts SET answers='{\"q1\":0}'"),
      /saving is OFF/,
    );
    await assert.rejects(
      db.query("UPDATE public.learning_attempts SET status='submitted',score=1"),
      /saving is OFF/,
    );
    // Installation must be idempotent and must not turn saving ON or erase records.
    await db.exec("RESET ROLE");
    await db.exec(readFileSync("KKCC-Excellence-Hub-TEST-PRIVACY.sql", "utf8"));
    await asRole(db, "authenticated", ids.admin);
    const rerun = await run("SELECT public.admin_test_retention() result");
    assert.equal(rerun.save_results, false);
    assert.equal(rerun.history_count, 2);
    const cleaned = await run(
      "SELECT public.admin_test_retention('cleanup',NULL,$1,'DELETE TEST HISTORY') result",
      [off.cutoff],
    );
    assert.equal(cleaned.deleted, 2);
    assert.equal(cleaned.history_count, 0);
    assert.equal((await db.query("SELECT * FROM public.test_access_grants")).rows.length, 1);
    assert.equal((await db.query("SELECT * FROM public.profiles")).rows.length, 4);
    await run("SELECT public.admin_test_retention('set',true) result");
    await asRole(db, "service_role");
    await insert();
    await asRole(db, "anon");
    await assert.rejects(db.query("SELECT public.get_test_retention()"), /permission/);
  } finally {
    await db.close();
  }
});
const questions = [
  {
    id: "q1",
    question_text: "One plus one?",
    options: ["2", "3"],
    correct_index: 0,
    marks: 1,
    negative_marks: 0,
    explanation: "Two.",
  },
  {
    id: "q2",
    question_text: "Two plus two?",
    options: ["3", "4"],
    correct_index: 1,
    marks: 1,
    negative_marks: 0,
    explanation: "Four.",
  },
] as ScorableQuestion[];
function claim(): TemporaryClaim {
  return {
    v: 1,
    actor: ids.studentA,
    id: randomUUID(),
    epoch: randomUUID(),
    selection: { test_id: ids.test, subject: "Math", chapter: "Numbers" },
    started: 10000,
    expires: 100000,
    duration: 60,
    questionSeconds: 0,
    hash: paperFingerprint(questions),
    answers: {},
  };
}
test("Temporary token is encrypted, tamper-proof and bound to user, epoch and expiry", () => {
  process.env["SUPABASE_SERVICE_ROLE_KEY"] = "fixture-only-privacy-test";
  const c = claim(),
    token = sealTemporary(c);
  assert.ok(!Buffer.from(token, "base64url").toString().includes(ids.studentA));
  assert.deepEqual(openTemporary(token, c.actor, c.epoch, 12000), c);
  assert.throws(() => openTemporary(token, ids.studentB, c.epoch, 12000), /another account/);
  assert.throws(() => openTemporary(token, c.actor, randomUUID(), 12000));
  assert.throws(() => openTemporary(token, c.actor, c.epoch, 100001));
  const bytes = Buffer.from(token, "base64url");
  bytes[32] = bytes[32]! ^ 1;
  assert.throws(() => openTemporary(bytes.toString("base64url"), c.actor, c.epoch, 12000));
});
test("Temporary checkpoints enforce deadlines and per-question windows without accepting late edits", () => {
  const c = { ...claim(), questionSeconds: 10, answers: { q1: 0 } };
  assert.equal(checkpointAnswers(c, questions, { q1: 1 }, 15000).ok, true);
  assert.equal(checkpointAnswers(c, questions, { q1: 1, q2: 1 }, 25000).ok, false);
  assert.deepEqual(checkpointAnswers(c, questions, { q1: 0, q2: 1 }, 25000).answers, {
    q1: 0,
    q2: 1,
  });
  assert.deepEqual(
    checkpointAnswers({ ...c, questionSeconds: 0 }, questions, { q1: 1 }, 70000).answers,
    { q1: 0 },
  );
  assert.throws(() => checkpointAnswers(c, questions, { unknown: 0 }, 15000));
  assert.notEqual(
    paperFingerprint(questions),
    paperFingerprint([{ ...questions[0]!, correct_index: 1 }, questions[1]!]),
  );
});
