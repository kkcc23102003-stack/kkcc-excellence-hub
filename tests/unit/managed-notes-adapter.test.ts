import { test } from "node:test";
import assert from "node:assert/strict";
import { isLocalManagedFixture } from "../../src/lib/managed-content-tables";
import { projectContent, flushProjectContentCaches } from "../../src/lib/project-content.server";

test("serverless managed notes use Supabase, recover after SQL setup, and invalidate cached edits", async () => {
  const originalFetch = globalThis.fetch;
  const names = [
    "VERCEL",
    "KKCC_CONTENT_BACKEND",
    "SUPABASE_URL",
    "VITE_SUPABASE_URL",
    "SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  const before = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  Object.assign(process.env, {
    VERCEL: "1",
    KKCC_CONTENT_BACKEND: "readonly",
    SUPABASE_URL: "http://127.0.0.1:9",
    VITE_SUPABASE_URL: "http://127.0.0.1:9",
    SUPABASE_PUBLISHABLE_KEY: "fixture-public",
    VITE_SUPABASE_PUBLISHABLE_KEY: "fixture-public",
    SUPABASE_SERVICE_ROLE_KEY: "fixture-service-not-a-real-secret",
  });
  let missingSchema = true;
  const rows = new Map<string, Record<string, unknown>>();
  const calls: string[] = [];
  globalThis.fetch = async (input, init) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    calls.push(`${request.method} ${url.pathname}`);
    assert.equal(url.pathname, "/rest/v1/kkcc_materials");
    if (missingSchema)
      return new Response(
        JSON.stringify({ code: "PGRST205", message: "Could not find table in schema cache" }),
        { status: 404, headers: { "content-type": "application/json" } },
      );
    const id = url.searchParams.get("id")?.replace(/^eq\./, "");
    if (request.method === "POST") {
      const body = await request.json();
      for (const row of Array.isArray(body) ? body : [body]) rows.set(row.id, row);
    } else if (request.method === "PATCH" && id) {
      rows.set(id, { ...rows.get(id), ...(await request.json()) });
    } else if (request.method === "DELETE" && id) {
      rows.delete(id);
      return new Response(null, { status: 204 });
    }
    const result = [...rows.values()].filter((row) => !id || row["id"] === id);
    const single = request.headers.get("accept")?.includes("vnd.pgrst.object");
    return new Response(JSON.stringify(single ? result[0] : result), {
      status: 200,
      headers: { "content-type": "application/json", "content-range": `0-0/${result.length}` },
    });
  };
  try {
    flushProjectContentCaches();
    const missing = await projectContent
      .from("materials")
      .insert({ id: "test-note", title: "New note" });
    assert.equal(missing.error?.code, "NOTES_SETUP_REQUIRED");
    assert.ok(!missing.error?.message.includes("Configure private S3"));
    // Old global S3/file settings must not send managed notes back to readonly JSON.
    for (const backend of ["s3", "file", "readonly"]) {
      process.env["KKCC_CONTENT_BACKEND"] = backend;
      flushProjectContentCaches();
      const missingAgain = await projectContent
        .from("materials")
        .insert({ id: "test-note", title: "New note" });
      assert.equal(missingAgain.error?.code, "NOTES_SETUP_REQUIRED");
    }
    missingSchema = false;
    const inserted = await projectContent
      .from("materials")
      .insert({ id: "test-note", title: "New note", is_published: false })
      .select("*")
      .single();
    assert.equal(inserted.error, null);
    assert.equal(inserted.data.title, "New note");
    await projectContent.from("materials").select("*").eq("id", "test-note").single();
    await projectContent
      .from("materials")
      .update({ title: "Corrected sample", is_published: true })
      .eq("id", "test-note");
    assert.equal(
      (await projectContent.from("materials").select("*").eq("id", "test-note").single()).data
        .title,
      "Corrected sample",
    );
    await projectContent.from("materials").delete().eq("id", "test-note");
    assert.deepEqual((await projectContent.from("materials").select("*")).data, []);
    assert.ok(calls.some((call) => call.startsWith("PATCH")));
    const privateObjects = new Map<string, Uint8Array>();
    globalThis.fetch = async (input, init) => {
      const request = new Request(input, init);
      const path = new URL(request.url).pathname;
      if (path === "/storage/v1/bucket/kkcc-test-bodies")
        return Response.json({ id: "kkcc-test-bodies", name: "kkcc-test-bodies", public: false });
      if (path.startsWith("/storage/v1/object/")) {
        const key = path.replace("/authenticated/", "/");
        if (request.method === "POST") {
          privateObjects.set(key, new Uint8Array(await request.arrayBuffer()));
          return Response.json({ Key: key });
        }
        const bytes = privateObjects.get(key);
        return bytes
          ? new Response(bytes as BodyInit, { headers: { "content-type": "application/json" } })
          : new Response("missing", { status: 404 });
      }
      if (path === "/rest/v1/kkcc_test_questions" && request.method === "POST") {
        const body = await request.json();
        assert.equal(body[0].question_text, "");
        assert.deepEqual(body[0].options, []);
        assert.ok(body[0].body_storage_sha256);
        return Response.json(body);
      }
      assert.ok(
        ["/rest/v1/kkcc_tests", "/rest/v1/kkcc_test_questions"].includes(
          new URL(request.url).pathname,
        ),
      );
      return new Response(
        JSON.stringify(
          missingSchema
            ? { code: "PGRST205", message: "Could not find table in schema cache" }
            : [{ id: "saved-test", is_published: true }],
        ),
        { status: missingSchema ? 404 : 200, headers: { "content-type": "application/json" } },
      );
    };
    for (const backend of ["readonly", "s3", "file"]) {
      process.env["KKCC_CONTENT_BACKEND"] = backend;
      for (const table of ["tests", "test_questions"] as const) {
        flushProjectContentCaches();
        missingSchema = true;
        const missingTest = await projectContent.from(table).select("*");
        assert.equal(missingTest.error?.code, "TESTS_SETUP_REQUIRED");
        assert.ok(missingTest.error?.message.includes("PUBLISH-FIX.sql"));
        missingSchema = false;
        const row =
          table === "tests"
            ? { id: "saved-test" }
            : {
                id: "80000000-0000-4000-8000-000000000001",
                test_id: "90000000-0000-4000-8000-000000000001",
                question_text: "Exact UTF-8 ਪੰਜਾਬੀ question",
                options: ["One", "Two"],
                correct_index: 1,
                explanation: "Keep this explanation",
              };
        const saved = await projectContent.from(table).insert(row as never);
        assert.equal(saved.error, null);
        if (table === "test_questions")
          assert.equal(
            (saved.data[0] as { question_text: string }).question_text,
            "Exact UTF-8 ਪੰਜਾਬੀ question",
          );
      }
    }
  } finally {
    globalThis.fetch = originalFetch;
    flushProjectContentCaches();
    for (const name of names) {
      if (before[name] === undefined) delete process.env[name];
      else process.env[name] = before[name];
    }
  }
});

test("local managed CMS is an explicit fixture escape hatch, disabled on Vercel", () => {
  for (const table of ["materials", "tests", "test_questions", "private_settings"]) {
    for (const backend of ["file", "s3", "readonly"]) {
      assert.equal(isLocalManagedFixture(table, { KKCC_CONTENT_BACKEND: backend }), false);
      assert.equal(
        isLocalManagedFixture(table, {
          KKCC_CONTENT_BACKEND: backend,
          VERCEL: "1",
          KKCC_FIXTURE_LOCAL_CMS: "1",
        }),
        false,
      );
    }
    assert.equal(isLocalManagedFixture(table, { KKCC_FIXTURE_LOCAL_CMS: "1" }), true);
  }
  assert.equal(
    isLocalManagedFixture("tests", {
      KKCC_FIXTURE_LOCAL_CMS: "1",
      KKCC_TESTS_BACKEND: "supabase",
    }),
    false,
  );
});
