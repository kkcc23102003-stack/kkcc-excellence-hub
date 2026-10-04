import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { projectContent, readProjectDocument } from "../../src/lib/project-content.server";

test("Project content: persistent atomic writes, concurrency, IDs/counts, safe encryption and readonly failure", async () => {
  const folder = await mkdtemp(resolve("data", "adapter-test-"));
  process.env["KKCC_CONTENT_BACKEND"] = "file";
  process.env["KKCC_CONTENT_FILE"] = resolve(folder, "project-content.runtime.json");
  process.env["KKCC_SETTINGS_ENCRYPTION_KEY"] = "11".repeat(32);
  try {
    const id = randomUUID();
    const inserted = await projectContent
      .from("courses")
      .insert({ id, slug: `fixture-${id}`, title: "Atomic fixture", status: "published" })
      .select("*")
      .single();
    assert.equal(inserted.error, null);
    assert.equal(inserted.data.id, id);
    const writes = await Promise.all(
      Array.from({ length: 20 }, (_, index) =>
        projectContent
          .from("lectures")
          .insert({ course_id: id, title: `Lecture ${index}`, sort_order: index }),
      ),
    );
    assert.ok(writes.every((result) => !result.error));
    const course = await projectContent.from("courses").select("*").eq("id", id).single();
    assert.equal(course.data.lectures_count, 20);
    const duplicate = await projectContent
      .from("courses")
      .insert({ id, slug: `other-${id}`, title: "Do not replace" });
    assert.ok(duplicate.error);
    assert.equal(
      (await projectContent.from("courses").select("*").eq("id", id).single()).data.title,
      "Atomic fixture",
    );
    const privateValue = "local-fixture-secret-not-a-real-credential";
    const saved = await projectContent
      .from("private_settings")
      .upsert({ key: "fixture_secret", value: privateValue });
    assert.equal(saved.error, null);
    assert.ok(!(await readFile(process.env["KKCC_CONTENT_FILE"]!, "utf8")).includes(privateValue));
    assert.equal(
      (
        await projectContent
          .from("private_settings")
          .select("*")
          .eq("key", "fixture_secret")
          .single()
      ).data.value,
      privateValue,
    );
    await projectContent
      .from("private_settings")
      .upsert({ key: "fixture_secret", value: "local-new-value" });
    const text = await readFile(process.env["KKCC_CONTENT_FILE"]!, "utf8");
    assert.ok(!text.includes(privateValue));
    assert.ok(!text.includes("local-new-value"));
    assert.ok(text.includes("enc:v1:"));
    const before = JSON.stringify((await readProjectDocument()).document);
    delete process.env["KKCC_SETTINGS_ENCRYPTION_KEY"];
    assert.ok(
      (
        await projectContent
          .from("private_settings")
          .upsert({ key: "must-not-save", value: "never-save-plaintext" })
      ).error,
    );
    assert.equal(JSON.stringify((await readProjectDocument()).document), before);
    process.env["KKCC_CONTENT_BACKEND"] = "readonly";
    assert.ok((await projectContent.from("courses").insert({ title: "Must fail closed" })).error);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
