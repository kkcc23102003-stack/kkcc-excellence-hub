import { isLocalManagedFixture } from "./managed-content-tables";
import {
  NOTE_BODY_BUCKET,
  bodyHash,
  writeVerifiedBody,
  verifiedBodyText,
  validateBodyReference,
  type NoteBodyRow,
  type NoteBodyIO,
} from "./note-body-store";
const setup =
  "Run KKCC-Excellence-Hub-NOTE-BODIES.sql in Supabase SQL Editor. Note text was not removed.";
async function io(): Promise<NoteBodyIO> {
  if (isLocalManagedFixture("materials", process.env)) {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const root = path.resolve(".cache/fixture-note-bodies");
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
  const bucket = await supabaseAdmin.storage.getBucket(NOTE_BODY_BUCKET);
  if (bucket.error || !bucket.data || bucket.data.public)
    throw new Error(`Private notes bucket unavailable. ${setup}`);
  const storage = supabaseAdmin.storage.from(NOTE_BODY_BUCKET);
  return {
    write: async (path, bytes) => {
      const { error } = await storage.upload(path, bytes, {
        contentType: "text/plain",
        cacheControl: "0",
        upsert: false,
      });
      if (error) throw new Error(`Note upload failed: ${error.message}. ${setup}`);
    },
    read: async (path) => {
      const { data, error } = await storage.download(path);
      if (error || !data)
        throw new Error(
          `Note file could not be read. Retry or restore a backup; content was not silently cleared. ${error?.message || ""}`,
        );
      return Buffer.from(await data.arrayBuffer());
    },
  };
}
// Process RAM only, bounded to 16 MiB / 128 immutable versions / two minutes.
const cache = new Map<string, { text: string; bytes: number; until: number }>();
let cacheBytes = 0;
function cacheBody(key: string, text: string) {
  const bytes = Buffer.byteLength(text);
  const old = cache.get(key);
  if (old) {
    cacheBytes -= old.bytes;
    cache.delete(key);
  }
  cache.set(key, { text, bytes, until: Date.now() + 120000 });
  cacheBytes += bytes;
  while (cacheBytes > 16 * 1024 * 1024 || cache.size > 128) {
    const first = cache.keys().next().value!;
    cacheBytes -= cache.get(first)!.bytes;
    cache.delete(first);
  }
}
/** Caller must check admin/paid/course access BEFORE calling this helper. */
export async function readNoteBody(row: NoteBodyRow) {
  if (!row.body_storage_path) return row.description || "";
  validateBodyReference(row);
  const key = `${row.body_storage_path}:${row.body_storage_sha256}`;
  const hit = cache.get(key);
  if (hit && hit.until > Date.now()) return verifiedBodyText(row, Buffer.from(hit.text, "utf8"));
  const text = verifiedBodyText(row, await (await io()).read(row.body_storage_path));
  cacheBody(key, text);
  return text;
}
export async function storeNoteBody(id: string, text: string, current?: NoteBodyRow | null) {
  if (
    current?.body_storage_path &&
    current.body_storage_sha256 === bodyHash(Buffer.from(text, "utf8"))
  ) {
    // Validate reused bytes before allowing metadata-only edits to keep this reference.
    await readNoteBody(current);
    return {
      body_storage_path: current.body_storage_path,
      body_storage_sha256: current.body_storage_sha256,
      body_storage_bytes: current.body_storage_bytes ?? Buffer.byteLength(text),
    };
  }
  return writeVerifiedBody(await io(), id, text);
}
export async function mapNoteBodyReads<T, R>(
  rows: T[],
  read: (row: T) => Promise<R>,
): Promise<R[]> {
  const result: R[] = [];
  for (let i = 0; i < rows.length; i += 8)
    result.push(...(await Promise.all(rows.slice(i, i + 8).map(read))));
  return result;
}
export async function hydrateNoteBodies<T extends NoteBodyRow>(rows: T[]) {
  return mapNoteBodyReads(rows, async (row) => ({ ...row, description: await readNoteBody(row) }));
}
