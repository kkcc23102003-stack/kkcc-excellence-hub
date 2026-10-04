import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { builtInMaterials } from "../../src/lib/builtin-materials.server";
import { projectContent } from "../../src/lib/project-content.server";
import { noteImageRefs, replaceNoteImageRefs } from "../../src/lib/note-image-refs";
import {
  EMPTY_DIRECTIVES,
  parseVisualDirectives,
  updateNoteWithDirectives,
} from "../../src/lib/notes-visuals/directives";

test("all sample notes have stable editable IDs and fit admin form limits", () => {
  const rows = builtInMaterials();
  assert.ok(rows.length > 0);
  assert.deepEqual(rows, builtInMaterials());
  assert.equal(new Set(rows.map((row) => row.id)).size, rows.length);
  for (const row of rows) {
    assert.match(row.id, /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-a[a-f0-9]{3}-[a-f0-9]{12}$/);
    assert.ok(row.description.length <= 50000, row.title);
    assert.ok(row.class_level.length <= 60, row.title);
    assert.ok(row.title.length <= 200, row.title);
  }
});

test("sample adoption retries preserve edits, drafts, and paid settings", async () => {
  const folder = await mkdtemp(resolve("data", "material-test-"));
  process.env["KKCC_CONTENT_BACKEND"] = "file";
  process.env["KKCC_CONTENT_FILE"] = resolve(folder, "content.json");
  try {
    const samples = builtInMaterials();
    assert.equal(
      (
        await projectContent
          .from("materials")
          .upsert(samples, { onConflict: "id", ignoreDuplicates: true })
      ).error,
      null,
    );
    const id = samples[0]!.id;
    await projectContent
      .from("materials")
      .update({ title: "Admin correction", is_published: false, access_type: "paid", price: 100 })
      .eq("id", id);
    await projectContent
      .from("materials")
      .upsert(samples, { onConflict: "id", ignoreDuplicates: true });
    const row = (await projectContent.from("materials").select("*").eq("id", id).single()).data;
    assert.equal(row.title, "Admin correction");
    assert.equal(row.is_published, false);
    assert.equal(row.price, 100);
    await projectContent
      .from("site_settings")
      .upsert({ key: "builtin_materials_adopted", value: "true" }, { onConflict: "key" });
    await projectContent.from("materials").delete().eq("id", id);
    assert.equal(
      (await projectContent.from("materials").select("*").eq("id", id).maybeSingle()).data,
      null,
    );
    assert.equal(
      (
        await projectContent
          .from("site_settings")
          .select("value")
          .eq("key", "builtin_materials_adopted")
          .single()
      ).data.value,
      "true",
    );
  } finally {
    delete process.env["KKCC_CONTENT_BACKEND"];
    delete process.env["KKCC_CONTENT_FILE"];
    await rm(folder, { recursive: true, force: true });
  }
});

test("Supabase image references survive editing and resolve only for display", () => {
  const ref = "kkcc-file://course-content/notes-images%2Fpage.jpg";
  const text = updateNoteWithDirectives("Lesson", {
    ...EMPTY_DIRECTIVES,
    images: [{ url: ref, caption: "Page" }],
  });
  assert.equal(parseVisualDirectives(text).directives.images[0]?.url, ref);
  assert.deepEqual(noteImageRefs(text), [ref]);
  const shown = replaceNoteImageRefs(text, { [ref]: "https://example.com/signed.jpg?token=test" });
  assert.ok(shown.includes("https://example.com/signed.jpg?token=test"));
  assert.ok(text.includes(ref), "saved source retains permanent reference, not expiring URL");
});

test("student page does not append uncontrollable samples; Supabase failure has no local fallback", () => {
  const page = readFileSync("src/routes/study-material.tsx", "utf8");
  assert.ok(!page.includes("getAllBuiltInStudyNotes"));
  const uploads = readFileSync("src/lib/storage-upload.functions.ts", "utf8");
  const start = uploads.indexOf(
    'if (settings.provider === "supabase")',
    uploads.indexOf("export const uploadSmallContentFileViaServer"),
  );
  const block = uploads.slice(start, uploads.indexOf("} else {", start));
  assert.ok(block.includes("throw new Error"));
  assert.ok(!block.includes("writeFile"));
});
