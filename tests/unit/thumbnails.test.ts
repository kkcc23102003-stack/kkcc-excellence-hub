import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { thumbnailUrlSchema, thumbnailFields } from "../../src/lib/thumbnail";
import { parseTestSettingsPatch } from "../../src/lib/test-settings";
import { validateThumbnailBytes } from "../../src/lib/thumbnail-upload.server";
import { createFixtureDatabase, seedFixtureUsers, fixtureIds, asRole } from "../fixtures/database";
test("thumbnail edits are bounded, reject active URL schemes and do not change paid/test settings", () => {
  for (const value of ["javascript:alert(1)", "data:text/html,<script>", "//evil.example/img"])
    assert.equal(thumbnailUrlSchema.safeParse(value).success, false);
  for (const value of [
    null,
    "",
    "https://example.com/a.png",
    "/logo.png",
    "kkcc-file://course-content/a.png",
  ])
    assert.equal(thumbnailUrlSchema.safeParse(value).success, true);
  assert.equal(thumbnailFields.thumbnail_text.safeParse("x".repeat(201)).success, false);
  assert.deepEqual(
    parseTestSettingsPatch({
      id: fixtureIds.test,
      thumbnail_text: "ਪੰਜਾਬੀ Notes",
      thumbnail_url: null,
    }),
    { id: fixtureIds.test, thumbnail_text: "ਪੰਜਾਬੀ Notes", thumbnail_url: null },
  );
});
test("thumbnail upload checks raster signatures, MIME and server size, never accepts SVG/HTML", () => {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
    "base64",
  );
  assert.doesNotThrow(() => validateThumbnailBytes(png, "image/png"));
  assert.throws(() => validateThumbnailBytes(png, "image/jpeg"));
  assert.throws(() =>
    validateThumbnailBytes(Buffer.from('<svg onload="alert(1)"></svg>'), "image/png"),
  );
  assert.throws(() => validateThumbnailBytes(Buffer.alloc(4 * 1024 * 1024 + 1), "image/png"));
});
test("thumbnail migration is additive and idempotent; students cannot alter thumbnails or upload objects", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await db.exec(readFileSync("KKCC-Excellence-Hub-THUMBNAILS.sql", "utf8"));
    await db.query(
      "INSERT INTO public.kkcc_tests(id,title,is_paid,price_inr,thumbnail_text) VALUES($1,'Paid thumb',true,99,'Before')",
      [fixtureIds.test],
    );
    await db.exec(readFileSync("KKCC-Excellence-Hub-THUMBNAILS.sql", "utf8"));
    const row = (
      await db.query<{ is_paid: boolean; price_inr: number; thumbnail_text: string }>(
        "SELECT * FROM public.kkcc_tests WHERE id=$1",
        [fixtureIds.test],
      )
    ).rows[0]!;
    assert.equal(row.price_inr, 99);
    assert.equal(row.thumbnail_text, "Before");
    assert.equal(row.is_paid, true);
    await asRole(db, "authenticated", fixtureIds.studentA);
    await assert.rejects(
      db.query("UPDATE public.kkcc_tests SET thumbnail_text='hacked'"),
      /permission|row-level/,
    );
    await assert.rejects(
      db.query(
        "INSERT INTO storage.objects(bucket_id,name) VALUES('kkcc-thumbnails','hacked.png')",
      ),
      /permission|row-level/,
    );
  } finally {
    await db.close();
  }
});
