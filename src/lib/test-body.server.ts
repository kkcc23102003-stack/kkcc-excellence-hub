import type { NoteBodyIO } from "./note-body-store";
import {
  TEST_BODY_BUCKET,
  MAX_TEST_BODY_BYTES,
  decodeTestBody,
  validateTestReference,
  writeVerifiedTestBodies,
  type TestContentRow,
} from "./test-body-store";
export async function testBodyIO(bucketName = TEST_BODY_BUCKET): Promise<NoteBodyIO> {
  if (process.env["KKCC_FIXTURE_LOCAL_CMS"] === "1" && !process.env["VERCEL"]) {
    const fs = await import("node:fs/promises"),
      path = await import("node:path");
    const root = path.resolve(
      bucketName === "kkcc-result-papers"
        ? ".cache/fixture-result-papers"
        : ".cache/fixture-test-bodies",
    );
    return {
      write: async (key, bytes) => {
        const target = path.join(root, key);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, bytes, { flag: "wx" });
      },
      read: (key) => fs.readFile(path.join(root, key)),
    };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const bucket = await supabaseAdmin.storage.getBucket(bucketName);
  if (bucket.error || !bucket.data || bucket.data.public)
    throw new Error(
      "Private test bucket unavailable. Run KKCC-Excellence-Hub-TEST-BODIES.sql; original content was not cleared.",
    );
  const storage = supabaseAdmin.storage.from(bucketName);
  return {
    write: async (path, bytes) => {
      const result = await storage.upload(path, bytes, {
        upsert: false,
        contentType: "application/json",
        cacheControl: "0",
      });
      if (result.error) throw new Error(result.error.message);
    },
    read: async (path) => {
      const result = await storage.download(path);
      if (result.error || !result.data)
        throw new Error(
          `Test file unavailable: ${result.error?.message || "missing"}. Restore backup; no empty fallback is used.`,
        );
      if (result.data.size > MAX_TEST_BODY_BYTES) throw new Error("Test file too large");
      return Buffer.from(await result.data.arrayBuffer());
    },
  };
}
type BodyMap = ReturnType<typeof decodeTestBody>;
const cache = new Map<string, { body: BodyMap; bytes: number; until: number }>(),
  inflight = new Map<string, Promise<BodyMap>>();
let size = 0;
async function body(row: TestContentRow) {
  validateTestReference(row);
  const key = `${row.body_storage_path}:${row.body_storage_sha256}:${row.body_storage_bytes}`;
  const hit = cache.get(key);
  if (hit && hit.until > Date.now()) return hit.body;
  if (inflight.has(key)) return inflight.get(key)!;
  const promise = (async () => {
    const bytes = await (await testBodyIO()).read(row.body_storage_path!);
    const value = decodeTestBody(bytes, row);
    if (hit) {
      size -= hit.bytes;
      cache.delete(key);
    }
    cache.set(key, { body: value, bytes: bytes.length, until: Date.now() + 120000 });
    size += bytes.length;
    while (size > 32 * 1024 * 1024 || cache.size > 32) {
      const first = cache.keys().next().value!;
      size -= cache.get(first)!.bytes;
      cache.delete(first);
    }
    return value;
  })();
  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
  }
}
/** Server-only adapter: callers retain their existing admin/student access checks. */
export async function hydrateTestQuestions<T extends TestContentRow>(rows: T[]): Promise<T[]> {
  const output: T[] = [];
  for (let i = 0; i < rows.length; i += 8)
    output.push(
      ...(await Promise.all(
        rows.slice(i, i + 8).map(async (row) => {
          if (!row.body_storage_path) return row;
          const content = (await body(row)).get(row.id);
          if (!content)
            throw new Error("Question missing from verified test file. Restore backup.");
          return {
            ...row,
            question_text: content.question_text,
            options: content.options,
            explanation: content.explanation,
          };
        }),
      )),
    );
  return output;
}
export async function storeTestQuestions<T extends TestContentRow>(rows: T[]) {
  return writeVerifiedTestBodies(await testBodyIO(), rows);
}
