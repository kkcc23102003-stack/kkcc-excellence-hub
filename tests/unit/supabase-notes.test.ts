import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createFixtureDatabase, seedFixtureUsers, asRole, fixtureIds } from "../fixtures/database";
import { MANAGED_CONTENT_TABLES } from "../../src/lib/managed-content-tables";

test("Supabase notes migration is repeatable, persistent and denies browser access", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    const sql = readFileSync("KKCC-Excellence-Hub-NOTES-SUPABASE.sql", "utf8");
    await db.exec(sql);
    await asRole(db, "service_role");
    const rows = await db.query<{ id: string }>(
      "INSERT INTO public.kkcc_materials(title,description,is_published) VALUES('Persisted note','Paid content',false) RETURNING id",
    );
    const id = rows.rows[0]!.id;
    await db.query(
      "UPDATE public.kkcc_materials SET description='Admin edit',price=100,access_type='paid' WHERE id=$1",
      [id],
    );
    await db.query(
      "INSERT INTO public.kkcc_private_settings(key,value) VALUES('test-secret','not-a-real-key')",
    );
    await db.exec("RESET ROLE");
    await db.exec(sql);
    assert.equal(
      (
        await db.query<{ description: string }>(
          "SELECT description FROM public.kkcc_materials WHERE id=$1",
          [id],
        )
      ).rows[0]!.description,
      "Admin edit",
    );
    for (const role of ["anon", "authenticated"] as const) {
      await asRole(db, role, role === "authenticated" ? fixtureIds.studentA : "");
      await assert.rejects(db.query("SELECT * FROM public.kkcc_materials"), /permission denied/i);
      await assert.rejects(
        db.query("SELECT * FROM public.kkcc_private_settings"),
        /permission denied/i,
      );
      await assert.rejects(db.query("DELETE FROM public.kkcc_materials"), /permission denied/i);
    }
    await asRole(db, "service_role");
    await db.query("DELETE FROM public.kkcc_materials WHERE id=$1", [id]);
    assert.equal(
      (await db.query("SELECT * FROM public.kkcc_materials WHERE id=$1", [id])).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});

test("notes backend does not upload template/test banks to Supabase or hide setup errors", () => {
  assert.equal(MANAGED_CONTENT_TABLES["materials"], "kkcc_materials");
  assert.equal(MANAGED_CONTENT_TABLES["test_questions"], undefined);
  const source = readFileSync("src/lib/project-content.server.ts", "utf8");
  assert.ok(source.includes('code: "NOTES_SETUP_REQUIRED"'));
  assert.equal(
    readFileSync("KKCC-Excellence-Hub-NOTES-SUPABASE.sql", "utf8"),
    readFileSync("supabase/migrations/20261004150000_supabase_managed_notes.sql", "utf8"),
  );
});
