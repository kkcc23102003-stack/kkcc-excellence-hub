import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { testAnswersSchema } from "./test-answer-schema";
import { buildSelectedPaper, resolveTestExam } from "./learning.server";
import { gradePaper, publicQuestions, type ScorableQuestion } from "./test-scoring";
import type { LearningAttemptView } from "@/integrations/supabase/db";
const claimSchema = z.object({
  v: z.literal(1),
  actor: z.string().uuid(),
  id: z.string().uuid(),
  epoch: z.string().uuid(),
  selection: z.object({
    test_id: z.string().uuid().optional(),
    series_id: z.string().optional(),
    subject: z.string(),
    chapter: z.string(),
  }),
  started: z.number(),
  expires: z.number(),
  duration: z.number(),
  questionSeconds: z.number(),
  hash: z.string(),
  answers: testAnswersSchema,
});
export type TemporaryClaim = z.infer<typeof claimSchema>;
function key() {
  const secret = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!secret) throw new Error("Temporary tests require the server Supabase service key.");
  return createHash("sha256").update(`kkcc-temporary-v1:${secret}`).digest();
}
export function sealTemporary(claim: TemporaryClaim) {
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", key(), iv);
  const payload = Buffer.concat([cipher.update(JSON.stringify(claim), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), payload]).toString("base64url");
}
export function openTemporary(
  token: string,
  actor: string,
  epoch: string,
  now = Date.now(),
): TemporaryClaim {
  try {
    const data = Buffer.from(token, "base64url"),
      decipher = createDecipheriv("aes-256-gcm", key(), data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(12, 28));
    const claim = claimSchema.parse(
      JSON.parse(
        Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString("utf8"),
      ),
    );
    if (
      claim.actor !== actor ||
      claim.epoch !== epoch ||
      now > claim.expires ||
      now < claim.started - 5000
    )
      throw new Error("Invalid session");
    return claim;
  } catch {
    throw new Error(
      "Temporary session expired, changed or belongs to another account. Start again; nothing was saved.",
    );
  }
}
export function paperFingerprint(questions: readonly ScorableQuestion[]) {
  return createHash("sha256")
    .update(
      JSON.stringify(
        questions.map((q) => [
          q.id,
          q.question_text,
          q.options,
          q.correct_index,
          q.marks,
          q.negative_marks,
          q.explanation,
        ]),
      ),
    )
    .digest("hex");
}
export function checkpointAnswers(
  claim: TemporaryClaim,
  questions: readonly ScorableQuestion[],
  answers: Record<string, number>,
  now = Date.now(),
) {
  gradePaper(questions, answers);
  const expired = claim.duration > 0 && now >= claim.started + claim.duration * 1000;
  if (expired) return { ok: false, reason: "expired", answers: claim.answers };
  if (claim.questionSeconds > 0) {
    const active = questions[Math.floor((now - claim.started) / 1000 / claim.questionSeconds)]?.id;
    const keys = new Set([...Object.keys(claim.answers), ...Object.keys(answers)]);
    if (!active || [...keys].some((id) => id !== active && claim.answers[id] !== answers[id]))
      return { ok: false, reason: "question_window_closed", answers: claim.answers };
  }
  return { ok: true, answers };
}
const startCounters = new Map<string, { count: number; until: number }>();
function checkStartRate(actor: string, admin: boolean) {
  if (admin) return;
  const now = Date.now();
  for (const [id, row] of startCounters) if (row.until < now) startCounters.delete(id);
  const current = startCounters.get(actor) || { count: 0, until: now + 3600000 };
  if (current.count >= 30 || (startCounters.size >= 10000 && !startCounters.has(actor)))
    throw new Error("Temporary practice start limit reached. Try later.");
  current.count++;
  startCounters.set(actor, current);
}
export function temporaryAttemptView(
  claim: TemporaryClaim,
  paper: Awaited<ReturnType<typeof buildSelectedPaper>>,
  submitted = false,
): LearningAttemptView {
  const grade = submitted ? gradePaper(paper.questions, claim.answers) : null;
  return {
    id: claim.id,
    user_id: claim.actor,
    test_id: claim.selection.test_id || null,
    series_id: claim.selection.series_id || null,
    exam: resolveTestExam(paper.test),
    subject: claim.selection.subject,
    chapter: claim.selection.chapter,
    duration_seconds: claim.duration,
    question_timer_seconds: claim.questionSeconds,
    status: submitted ? "submitted" : "started",
    question_count: paper.questions.length,
    started_at: new Date(claim.started).toISOString(),
    submitted_at: submitted ? new Date().toISOString() : null,
    score: grade?.score ?? null,
    total_marks: grade?.totalMarks ?? null,
    correct_count: grade?.correct ?? null,
    attempted_count: grade?.attempted ?? null,
    answers: claim.answers,
    answer_revision: 0,
    source_refs: paper.questions.map((q) => q.id),
  };
}
export async function startTemporaryTest(
  context: Parameters<typeof buildSelectedPaper>[0],
  selection: TemporaryClaim["selection"],
  id: string,
  epoch: string,
  admin: boolean,
) {
  checkStartRate(context.userId, admin);
  const paper = await buildSelectedPaper(context, selection, id);
  const duration =
    paper.test.timer_mode === "unlimited"
      ? 0
      : paper.test.timer_mode === "question"
        ? paper.test.question_timer_seconds * paper.questions.length
        : paper.test.duration_minutes * 60;
  const now = Date.now(),
    claim: TemporaryClaim = {
      v: 1,
      actor: context.userId,
      id,
      epoch,
      selection,
      started: now,
      expires: now + Math.max(86400000, (duration + 3600) * 1000),
      duration,
      questionSeconds: paper.test.timer_mode === "question" ? paper.test.question_timer_seconds : 0,
      hash: paperFingerprint(paper.questions),
      answers: {},
    };
  return {
    attempt: temporaryAttemptView(claim, paper),
    test: paper.test,
    questions: publicQuestions(paper.questions),
    server_now: new Date(now).toISOString(),
    temporary: true as const,
    token: sealTemporary(claim),
  };
}
