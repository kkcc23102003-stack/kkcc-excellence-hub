import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  writeVerifiedBody,
  verifiedBodyText,
  validateBodyReference,
  bodyHash,
  MAX_NOTE_BODY_BYTES,
  type NoteBodyIO,
} from "../../src/lib/note-body-store";
import { materialAccessMode } from "../../src/lib/material-access-mode";
import { createFixtureDatabase, seedFixtureUsers, asRole, fixtureIds } from "../fixtures/database";
const id = "80000000-0000-4000-8000-000000000001";
const text =
  "  ਪੰਜਾਬੀ नोट्स\nExact explanation: x² + y² = z²\n:::cycle Water cycle\nRain -> River -> Sea\n  ";
function memoryIO() {
  const files = new Map<string, Buffer>();
  const io: NoteBodyIO = {
    write: async (path, data) => {
      assert.equal(files.has(path), false);
      files.set(path, Buffer.from(data));
    },
    read: async (path) => {
      if (!files.has(path)) throw new Error("Missing object");
      return files.get(path)!;
    },
  };
  return { files, io };
}
test("note files preserve exact UTF-8 explanation and produce verified immutable references", async () => {
  const { files, io } = memoryIO();
  const first = await writeVerifiedBody(io, id, text);
  const second = await writeVerifiedBody(io, id, text + "Edited");
  assert.equal(first.body_storage_bytes, Buffer.byteLength(text));
  assert.equal(first.body_storage_sha256, bodyHash(Buffer.from(text)));
  assert.notEqual(first.body_storage_path, second.body_storage_path);
  assert.equal(files.size, 2);
  validateBodyReference({ id, ...first });
  assert.equal(verifiedBodyText({ id, ...first }, files.get(first.body_storage_path!)!), text);
  assert.throws(
    () => validateBodyReference({ id, ...first, body_storage_path: "../private.txt" }),
    /reference/,
  );
  assert.throws(() => validateBodyReference({ id: fixtureIds.studentA, ...first }), /reference/);
});
test("upload failure, read-back failure, corruption and size mismatch never return a committable reference", async () => {
  const { io } = memoryIO();
  await assert.rejects(
    writeVerifiedBody(
      {
        ...io,
        write: async () => {
          throw new Error("Quota exhausted");
        },
      },
      id,
      text,
    ),
    /Quota exhausted/,
  );
  await assert.rejects(
    writeVerifiedBody(
      {
        ...io,
        read: async () => {
          throw new Error("Network failed");
        },
      },
      id,
      text,
    ),
    /Network failed/,
  );
  await assert.rejects(
    writeVerifiedBody({ ...io, read: async () => Buffer.from("corrupt") }, id, text),
    /verification failed/,
  );
  const result = await writeVerifiedBody(io, id, text);
  assert.throws(
    () => verifiedBodyText({ id, ...result, body_storage_bytes: 1 }, Buffer.from(text)),
    /verification failed/,
  );
  await assert.rejects(writeVerifiedBody(io, id, "x".repeat(MAX_NOTE_BODY_BYTES + 1)), /too large/);
});
test("an intentionally cleared body uses a null reference, not a downloadable empty object", async () => {
  const { io, files } = memoryIO();
  assert.deepEqual(await writeVerifiedBody(io, id, ""), {
    body_storage_path: null,
    body_storage_sha256: null,
    body_storage_bytes: 0,
  });
  assert.equal(files.size, 0);
});
test("zero-price paid notes and legacy free-labelled notes with prices are never treated as free", () => {
  assert.equal(materialAccessMode({ access_type: "paid", price: 0, coin_price: 0 }), "paid");
  assert.equal(materialAccessMode({ access_type: "free", price: 100 }), "paid");
  assert.equal(materialAccessMode({ coin_price: 1 }), "paid");
  assert.equal(materialAccessMode({ access_type: "free", course_id: fixtureIds.course }), "free");
  assert.equal(materialAccessMode({ course_id: fixtureIds.course }), "course");
});
test("private body migration SQL is mirrored and repeatable; setup does not migrate legacy text", async () => {
  const sql = readFileSync("KKCC-Excellence-Hub-NOTE-BODIES.sql", "utf8");
  assert.equal(
    sql,
    readFileSync("supabase/migrations/20261009120000_note_body_storage.sql", "utf8"),
  );
  assert.equal(sql, readFileSync("public/KKCC-Excellence-Hub-NOTE-BODIES.sql", "utf8"));
  const db = await createFixtureDatabase();
  try {
    await db.query("INSERT INTO public.kkcc_materials(id,title,description) VALUES($1,$2,$3)", [
      id,
      "legacy",
      text,
    ]);
    await db.exec(sql);
    await db.exec(sql);
    assert.equal(
      (
        await db.query<{ description: string }>(
          "SELECT description FROM public.kkcc_materials WHERE id=$1",
          [id],
        )
      ).rows[0]!.description,
      text,
    );
    assert.equal(
      (
        await db.query<{ public: boolean }>(
          "SELECT public FROM storage.buckets WHERE id='kkcc-note-bodies'",
        )
      ).rows[0]!.public,
      false,
    );
    await db.exec(
      "INSERT INTO storage.objects(bucket_id,name) VALUES('kkcc-note-bodies','private-body.txt'); GRANT SELECT ON storage.objects TO anon,authenticated; CREATE POLICY fixture_broad_read ON storage.objects FOR SELECT TO anon,authenticated USING(true);",
    );
    for (const role of ["anon", "authenticated"] as const) {
      await asRole(db, role, fixtureIds.studentA);
      assert.equal(
        (await db.query("SELECT * FROM storage.objects WHERE bucket_id='kkcc-note-bodies'")).rows
          .length,
        0,
      );
      await assert.rejects(
        db.query("SELECT public.move_note_body_to_storage($1,$2,NULL,$3,$4,$5,$6)", [
          fixtureIds.admin,
          id,
          "oldhash",
          `${id}/note.txt`,
          "a".repeat(64),
          10,
        ]),
        /permission denied/,
      );
    }
  } finally {
    await db.close();
  }
});
test("migration CAS preserves concurrent edits, retries safely, and only lets admin server replace DB body", async () => {
  const db = await createFixtureDatabase();
  try {
    await seedFixtureUsers(db);
    await asRole(db, "service_role");
    const old = (
      await db.query<{ updated_at: string }>(
        "INSERT INTO public.kkcc_materials(id,title,description) VALUES($1,$2,$3) RETURNING updated_at",
        [id, "legacy", text],
      )
    ).rows[0]!;
    const status = await db.query<{
      inline_count: number;
      inline_bytes: number;
      stored_count: number;
    }>("SELECT * FROM public.note_body_storage_status($1)", [fixtureIds.admin]);
    assert.equal(Number(status.rows[0]!.inline_count), 1);
    assert.equal(Number(status.rows[0]!.inline_bytes), Buffer.byteLength(text));
    await assert.rejects(
      db.query("SELECT * FROM public.note_body_storage_status($1)", [fixtureIds.studentA]),
      /Admin server only/,
    );
    const fields = await writeVerifiedBody(memoryIO().io, id, text);
    const params = [
      fixtureIds.admin,
      id,
      old.updated_at,
      createHash("md5").update(text).digest("hex"),
      fields.body_storage_path,
      fields.body_storage_sha256,
      fields.body_storage_bytes,
    ];
    const sql = "SELECT public.move_note_body_to_storage($1,$2,$3,$4,$5,$6,$7) AS moved";
    await assert.rejects(
      db.query(sql, [fixtureIds.studentA, ...params.slice(1)]),
      /Admin server only/,
    );
    await db.query("UPDATE public.kkcc_materials SET description=$1 WHERE id=$2", [
      text + " changed",
      id,
    ]);
    assert.equal((await db.query<{ moved: boolean }>(sql, params)).rows[0]!.moved, false);
    assert.equal(
      (
        await db.query<{ description: string }>(
          "SELECT description FROM public.kkcc_materials WHERE id=$1",
          [id],
        )
      ).rows[0]!.description,
      text + " changed",
    );
    await db.query("UPDATE public.kkcc_materials SET description=$1,updated_at=$2 WHERE id=$3", [
      text,
      old.updated_at,
      id,
    ]);
    assert.equal((await db.query<{ moved: boolean }>(sql, params)).rows[0]!.moved, true);
    assert.equal((await db.query<{ moved: boolean }>(sql, params)).rows[0]!.moved, false);
    const row = (
      await db.query<{ description: string; body_storage_path: string }>(
        "SELECT description,body_storage_path FROM public.kkcc_materials WHERE id=$1",
        [id],
      )
    ).rows[0]!;
    assert.equal(row.description, "");
    assert.equal(row.body_storage_path, fields.body_storage_path);
  } finally {
    await db.close();
  }
});
