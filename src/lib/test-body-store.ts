import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import type { NoteBodyFields, NoteBodyIO } from "./note-body-store";
export const TEST_BODY_BUCKET = "kkcc-test-bodies";
export const MAX_TEST_BODY_BYTES = 16 * 1024 * 1024;
export type TestContentRow = NoteBodyFields & {
  id: string;
  test_id: string;
  question_text: string;
  options: string[];
  explanation?: string | null;
};
const question = z.object({
  id: z.string().uuid(),
  question_text: z.string(),
  options: z.array(z.string()),
  explanation: z.string(),
});
const document = z.object({ version: z.literal(1), questions: z.array(question) });
export const testBodyHash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
export function decodeTestBody(bytes: Buffer, reference: NoteBodyFields) {
  if (
    bytes.length > MAX_TEST_BODY_BYTES ||
    bytes.length !== reference.body_storage_bytes ||
    testBodyHash(bytes) !== reference.body_storage_sha256
  )
    throw new Error("Test body verification failed. Original database content was not replaced.");
  const parsed = document.parse(JSON.parse(bytes.toString("utf8")));
  const map = new Map(parsed.questions.map((q) => [q.id, q]));
  if (map.size !== parsed.questions.length) throw new Error("Duplicate question IDs in test file");
  return map;
}
export function validateTestReference(row: TestContentRow) {
  if (
    !row.body_storage_path ||
    !row.body_storage_path.startsWith(`${row.test_id}/`) ||
    !/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.json$/.test(row.body_storage_path) ||
    !/^[a-f0-9]{64}$/.test(row.body_storage_sha256 || "")
  )
    throw new Error("Invalid private test reference");
}
/** A shared file per test/batch avoids one Storage request per question. No old files are overwritten. */
export async function writeVerifiedTestBodies<T extends TestContentRow>(
  io: NoteBodyIO,
  rows: T[],
): Promise<T[]> {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    z.string().uuid().parse(row.test_id);
    const list = groups.get(row.test_id) || [];
    list.push(row);
    groups.set(row.test_id, list);
  }
  const output = new Map<string, T>();
  for (const [testId, group] of groups) {
    const questions = group.map((row) =>
      question.parse({ ...row, explanation: row.explanation ?? "" }),
    );
    const bytes = Buffer.from(JSON.stringify({ version: 1, questions }), "utf8");
    if (bytes.length > MAX_TEST_BODY_BYTES)
      throw new Error(
        "Test content exceeds 16 MiB per batch. Split the import into smaller parts.",
      );
    const fields = {
      body_storage_path: `${testId}/${randomUUID()}.json`,
      body_storage_sha256: testBodyHash(bytes),
      body_storage_bytes: bytes.length,
    };
    await io.write(fields.body_storage_path, bytes);
    decodeTestBody(await io.read(fields.body_storage_path), fields);
    for (const row of group)
      output.set(row.id, { ...row, ...fields, question_text: "", options: [], explanation: "" });
  }
  return rows.map((row) => output.get(row.id)!);
}
