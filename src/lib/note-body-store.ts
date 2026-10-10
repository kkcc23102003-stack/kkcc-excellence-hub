/** Storage-independent verified write contract, also used by migration tests. */
import { createHash, randomUUID } from "node:crypto";
export const NOTE_BODY_BUCKET = "kkcc-note-bodies";
export const MAX_NOTE_BODY_BYTES = 1024 * 1024;
export type NoteBodyFields = {
  body_storage_path?: string | null;
  body_storage_sha256?: string | null;
  body_storage_bytes?: number | null;
};
export type NoteBodyRow = NoteBodyFields & { id: string; description?: string | null };
export type NoteBodyIO = {
  write: (path: string, bytes: Buffer) => Promise<void>;
  read: (path: string) => Promise<Buffer>;
};
export const bodyHash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
export function validateBodyReference(row: NoteBodyRow) {
  if (
    !row.body_storage_path ||
    !/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.txt$/.test(row.body_storage_path) ||
    !row.body_storage_path.startsWith(`${row.id}/`) ||
    !/^[a-f0-9]{64}$/.test(row.body_storage_sha256 || "")
  )
    throw new Error("Invalid private note body reference. Restore this note from backup.");
}
export function verifiedBodyText(row: NoteBodyRow, bytes: Buffer) {
  if (
    bytes.length > MAX_NOTE_BODY_BYTES ||
    bytes.length !== row.body_storage_bytes ||
    bodyHash(bytes) !== row.body_storage_sha256
  )
    throw new Error("Note file verification failed. Original content has not been replaced.");
  return bytes.toString("utf8");
}
export async function writeVerifiedBody(
  io: NoteBodyIO,
  id: string,
  text: string,
): Promise<Required<NoteBodyFields>> {
  if (!text) return { body_storage_path: null, body_storage_sha256: null, body_storage_bytes: 0 };
  const bytes = Buffer.from(text, "utf8");
  if (bytes.length > MAX_NOTE_BODY_BYTES)
    throw new Error("Typed note is too large. Split it into chapter parts.");
  const fields = {
    body_storage_path: `${id}/${randomUUID()}.txt`,
    body_storage_sha256: bodyHash(bytes),
    body_storage_bytes: bytes.length,
  };
  // Never overwrite a previous object: failed uploads/database writes leave the old note intact.
  await io.write(fields.body_storage_path, bytes);
  verifiedBodyText({ id, ...fields }, await io.read(fields.body_storage_path));
  return fields;
}
