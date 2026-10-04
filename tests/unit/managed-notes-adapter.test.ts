import { test } from "node:test";
import assert from "node:assert/strict";
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
  } finally {
    globalThis.fetch = originalFetch;
    flushProjectContentCaches();
    for (const name of names) {
      if (before[name] === undefined) delete process.env[name];
      else process.env[name] = before[name];
    }
  }
});
