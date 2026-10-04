import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createFixtureDatabase,
  seedFixtureUsers,
  fixtureIds as ids,
  asRole,
} from "../fixtures/database";

test("space saver: install/preview safe; only admin-confirmed old drafts removed", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    for (const [id, status, days, duration] of [
      ["1", "started", 120, 600],
      ["2", "submitted", 120, 600],
      ["3", "started", 10, 600],
      ["4", "started", 120, 200 * 86400],
    ] as const) {
      await db.query(
        `INSERT INTO public.learning_attempts(id,user_id,duration_seconds,status,question_count,started_at,submitted_at)
        VALUES($1,$2,$3,$4,10,now()-make_interval(days => $5),CASE WHEN $4='submitted' THEN now()-interval '119 days' ELSE NULL END)`,
        [`30000000-0000-4000-8000-${id.padStart(12, "0")}`, ids.studentA, duration, status, days],
      );
    }
    await db.exec(readFileSync("KKCC-Excellence-Hub-SQL-CLEANER.sql", "utf8"));
    assert.equal(
      (await db.query("SELECT * FROM public.learning_attempts")).rows.length,
      4,
      "installer never deletes",
    );
    await asRole(db, "anon");
    await assert.rejects(db.query("SELECT public.kkcc_space_report()"), /permission/i);
    await asRole(db, "authenticated", ids.studentA);
    await assert.rejects(
      db.query("SELECT public.kkcc_space_report(true)"),
      /Admin access required/i,
    );
    await assert.rejects(
      db.query("SELECT public.kkcc_clean_database_bloat()"),
      /Admin access required/i,
    );
    await asRole(db, "authenticated", ids.admin);
    const report = (
      await db.query<{
        report: { eligible_batch: number; deleted: number; cutoff: string; database_bytes: number };
      }>("SELECT public.kkcc_space_report() report")
    ).rows[0]!.report;
    assert.equal(report.eligible_batch, 1);
    assert.equal(report.deleted, 0);
    assert.ok(report.database_bytes > 0);
    await db.query("SELECT public.kkcc_clean_database_bloat()");
    await assert.rejects(
      db.query("SELECT public.kkcc_space_report(true,now())"),
      /at least 90 days/i,
    );
    const cleaned = (
      await db.query<{ report: { deleted: number } }>(
        "SELECT public.kkcc_space_report(true,$1::timestamptz) report",
        [report.cutoff],
      )
    ).rows[0]!.report;
    assert.equal(cleaned.deleted, 1);
    assert.equal(
      (
        await db.query<{ report: { deleted: number } }>(
          "SELECT public.kkcc_space_report(true,$1::timestamptz) report",
          [report.cutoff],
        )
      ).rows[0]!.report.deleted,
      0,
    );
    await db.exec("RESET ROLE");
    const remaining = await db.query<{ status: string }>(
      "SELECT status FROM public.learning_attempts ORDER BY id",
    );
    assert.deepEqual(
      remaining.rows.map((r) => r.status),
      ["submitted", "started", "started"],
    );
    assert.equal((await db.query("SELECT * FROM auth.users")).rows.length, 4);
  } finally {
    await db.close();
  }
});

test("space saver installer copies match and do not schedule automatic cleanup", () => {
  const sql = readFileSync("KKCC-Excellence-Hub-SPACE-SAVER.sql", "utf8");
  assert.equal(
    readFileSync("supabase/migrations/20261004130000_free_plan_space_saver.sql", "utf8"),
    sql,
  );
  assert.ok(readFileSync("supabase/STUDENT_ONLY_SCHEMA.sql", "utf8").endsWith(sql));
  assert.ok(readFileSync("KKCC-Excellence-Hub-PRODUCTION-SQL.sql", "utf8").endsWith(sql));
  assert.ok(!sql.includes("cron.schedule"));
  assert.ok(!sql.includes("DELETE FROM public.test_access_grants"));
});
