import { test } from "node:test";
import assert from "node:assert/strict";
import { createFixtureDatabase, seedFixtureUsers, asRole, fixtureIds } from "../fixtures/database";
test("storage usage is read-only and admin-only; missing file sizes are not presented as measured zero", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await db.exec(`INSERT INTO storage.buckets(id,name) VALUES('usage-test','usage-test'),('usage-empty','usage-empty');
   INSERT INTO storage.objects(bucket_id,name,metadata) VALUES ('usage-test','one','{"size":1024}'),('usage-test','two','{"size":"2048"}'),('usage-test','unknown','{}'),('usage-test','bad','{"size":"invalid"}');`);
    await asRole(db, "anon");
    await assert.rejects(db.query("SELECT public.kkcc_storage_usage()"), /permission/);
    await asRole(db, "authenticated", fixtureIds.studentA);
    await assert.rejects(db.query("SELECT public.kkcc_storage_usage()"), /Admin access/);
    await asRole(db, "authenticated", fixtureIds.admin);
    const r = (
      await db.query<{
        r: {
          database_bytes: number;
          buckets: { bucket: string; files: number; bytes: number; unknown_sizes: number }[];
        };
      }>("SELECT public.kkcc_storage_usage() AS r")
    ).rows[0]!.r;
    assert.ok(r.database_bytes > 0);
    assert.deepEqual(
      r.buckets.find((b) => b.bucket === "usage-test"),
      { bucket: "usage-test", files: 4, bytes: 3072, unknown_sizes: 2 },
    );
    assert.equal(r.buckets.find((b) => b.bucket === "usage-empty")?.files, 0);
    await db.exec("RESET ROLE");
    assert.equal(
      (await db.query("SELECT id FROM storage.objects WHERE bucket_id='usage-test'")).rows.length,
      4,
    );
  } finally {
    await db.close();
  }
});
