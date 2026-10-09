import { createHash, randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { testBodyIO } from "./test-body.server";
import {
  buildSelectedPaper,
  type StudentContext,
  readStudentAccess,
  testPermission,
  readCustomSeriesCatalog,
  learningPlan,
} from "./learning.server";
import type { LearningAttemptRow } from "@/integrations/supabase/db";
type Paper = Awaited<ReturnType<typeof buildSelectedPaper>>;
const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
export function selectionForAttempt(row: LearningAttemptRow) {
  const ref =
    (row.source_refs || [])
      .find((value) => value.startsWith("__kkcc_meta__:"))
      ?.slice(14)
      .split(":") || [];
  return {
    selection: {
      test_id: row.test_id ?? undefined,
      series_id: row.series_id ?? undefined,
      subject: decodeURIComponent(ref[0] || "") || row.subject || undefined,
      chapter: decodeURIComponent(ref[1] || "") || row.chapter || undefined,
    },
    seed: row.seed || decodeURIComponent(ref[2] || "") || row.id,
  };
}
const cache = new Map<string, { paper: Paper; bytes: number; until: number }>();
let cacheSize = 0;
function remember(key: string, paper: Paper, bytes: number) {
  const previous = cache.get(key);
  if (previous) {
    cacheSize -= previous.bytes;
    cache.delete(key);
  }
  cache.set(key, { paper: structuredClone(paper), bytes, until: Date.now() + 120000 });
  cacheSize += bytes;
  while (cacheSize > 16 * 1024 * 1024 || cache.size > 32) {
    const oldest = cache.keys().next().value!;
    cacheSize -= cache.get(oldest)!.bytes;
    cache.delete(oldest);
  }
}
export async function readResultPaper(attemptId: string, force = false): Promise<Paper | null> {
  const meta = await supabaseAdmin
    .from("kkcc_attempt_papers")
    .select("*")
    .eq("attempt_id", attemptId)
    .maybeSingle();
  if (meta.error) throw new Error(`${meta.error.message}. Install CONTENT-RESET SQL.`);
  if (!meta.data) return null;
  const row = meta.data;
  if (
    !row.path.startsWith(attemptId + "/") ||
    !/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.json$/.test(row.path)
  )
    throw new Error("Invalid result paper path");
  const key = `${row.path}:${row.sha256}:${row.bytes}`;
  const hit = cache.get(key);
  if (!force && hit && hit.until > Date.now()) return structuredClone(hit.paper);
  const bytes = await (await testBodyIO("kkcc-result-papers")).read(row.path);
  if (bytes.length !== row.bytes || hash(bytes) !== row.sha256)
    throw new Error("Result paper verification failed; restore backup.");
  const doc = JSON.parse(bytes.toString("utf8")) as { attempt_id: string; paper: Paper };
  if (doc.attempt_id !== attemptId || !Array.isArray(doc.paper?.questions))
    throw new Error("Invalid result paper");
  remember(key, doc.paper, bytes.length);
  return doc.paper;
}
export async function saveResultPaper(id: string, paper: Paper) {
  const previous = await supabaseAdmin
    .from("kkcc_attempt_papers")
    .select("attempt_id")
    .eq("attempt_id", id)
    .maybeSingle();
  if (previous.error) throw new Error(previous.error.message);
  if (previous.data) return;
  const bytes = Buffer.from(JSON.stringify({ attempt_id: id, paper }), "utf8");
  if (bytes.length > 16 * 1024 * 1024)
    throw new Error("Result paper too large; no content was removed");
  const path = `${id}/${randomUUID()}.json`,
    sha256 = hash(bytes),
    io = await testBodyIO("kkcc-result-papers");
  await io.write(path, bytes);
  const checked = await io.read(path);
  if (checked.length !== bytes.length || hash(checked) !== sha256)
    throw new Error("Result paper upload verification failed");
  const saved = await supabaseAdmin
    .from("kkcc_attempt_papers")
    .upsert(
      { attempt_id: id, path, sha256, bytes: bytes.length },
      { onConflict: "attempt_id", ignoreDuplicates: true },
    );
  if (saved.error) throw new Error(saved.error.message);
}
export async function protectExistingAttemptPapers(context: StudentContext, cutoff: string) {
  const attempts: LearningAttemptRow[] = [];
  const saved = new Map<string, string>();
  for (let start = 0; ; start += 500) {
    const page = await supabaseAdmin
      .from("learning_attempts")
      .select("*")
      .order("id")
      .range(start, start + 499);
    if (page.error) throw new Error(page.error.message);
    attempts.push(...page.data);
    if (page.data.length < 500) break;
  }
  for (let start = 0; ; start += 500) {
    const page = await supabaseAdmin
      .from("kkcc_attempt_papers")
      .select("attempt_id,verified_at")
      .order("attempt_id")
      .range(start, start + 499);
    if (page.error) throw new Error(page.error.message);
    page.data.forEach((row) => saved.set(row.attempt_id, row.verified_at));
    if (page.data.length < 500) break;
  }
  const missing = attempts.filter(
    (row) => !saved.has(row.id) || new Date(saved.get(row.id)!) < new Date(cutoff),
  );
  for (const row of missing.slice(0, 5)) {
    if (saved.has(row.id)) {
      await readResultPaper(row.id, true);
      const verified = await supabaseAdmin
        .from("kkcc_attempt_papers")
        .update({ verified_at: new Date().toISOString() })
        .eq("attempt_id", row.id);
      if (verified.error) throw new Error(verified.error.message);
      continue;
    }

    const { selection, seed } = selectionForAttempt(row);
    const paper = await buildSelectedPaper(context, selection, seed);
    const ids = (row.source_refs || []).filter((ref) => !ref.startsWith("__kkcc_meta__:"));
    if (
      ids.length !== paper.questions.length ||
      ids.some((id, index) => id !== paper.questions[index]?.id)
    )
      throw new Error(
        `Cannot safely reconstruct attempt ${row.id}; deletion stopped. Restore its original source first.`,
      );
    await saveResultPaper(row.id, paper);
  }
  return { remaining: Math.max(0, missing.length - 5) };
}
export async function requireArchivedAttemptAccess(
  context: StudentContext,
  row: LearningAttemptRow,
  paper: Paper,
) {
  const blocked = await context.supabase.rpc("is_user_blocked", { _user_id: context.userId });
  if (blocked.error || blocked.data) throw new Error("Account access unavailable");
  if (row.status === "submitted") return;
  const access = await readStudentAccess(context);
  if (row.test_id) {
    const { projectContent } = await import("./project-content.server");
    const live = await projectContent.from("tests").select("*").eq("id", row.test_id).maybeSingle();
    if (live.error) throw new Error(live.error.message);
    const allowed = testPermission(
      live.data || { ...paper.test, is_published: true },
      access,
    ).allowed;
    const archivedSeriesGrant =
      !live.data && row.series_id && access.series_ids.includes(row.series_id);
    if (!allowed && !archivedSeriesGrant) throw new Error("TEST_ACCESS_REQUIRED");
  } else {
    const catalog = await readCustomSeriesCatalog();
    if (!(catalog.removedSeriesIds || []).includes(row.series_id || "")) {
      await learningPlan(context, selectionForAttempt(row).selection);
    } else if (
      !access.is_admin &&
      paper.test.is_paid &&
      !access.series_ids.includes(row.series_id || "")
    )
      throw new Error("SERIES_ACCESS_REQUIRED");
  }
}
