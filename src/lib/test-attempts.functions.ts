import { testAnswersSchema as responses } from "./test-answer-schema";
import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { buildSelectedPaper, learningPlan, resolveTestExam, unwrap } from "@/lib/learning.server";
import { gradePaper, publicQuestions } from "@/lib/test-scoring";
import type { LearningAttemptRow, LearningAttemptView } from "@/integrations/supabase/db";

const selection = z.object({
  request_id: z.string().uuid().optional(),
  test_id: z.string().uuid().optional(),
  series_id: z.string().max(200).optional(),
  subject: z.string().min(1).max(160),
  chapter: z.string().min(1).max(240),
});

const attemptId = z.object({
  attempt_id: z.string().uuid(),
});

const answerMap = (value: unknown) => responses.parse(value ?? {});

type AttemptPaper = Awaited<ReturnType<typeof buildSelectedPaper>>;

const META_PREFIX = "__kkcc_meta__:";
const attemptSelectionCache = new Map<string, { subject: string; chapter: string; seed: string }>();

function encodeMetaRef(subject: string, chapter: string, seed: string): string {
  return `${META_PREFIX}${encodeURIComponent(subject)}:${encodeURIComponent(chapter)}:${encodeURIComponent(seed)}`;
}

function decodeMetaRef(refs: string[] | null | undefined): {
  subject?: string;
  chapter?: string;
  seed?: string;
} {
  const ref = (refs ?? []).find((item) => item.startsWith(META_PREFIX));
  if (!ref) return {};
  const parts = ref.slice(META_PREFIX.length).split(":");
  return {
    subject: decodeURIComponent(parts[0] ?? ""),
    chapter: decodeURIComponent(parts[1] ?? ""),
    seed: decodeURIComponent(parts[2] ?? ""),
  };
}

function getAttemptMeta(row: LearningAttemptRow) {
  const cached = attemptSelectionCache.get(row.id);
  const decoded = decodeMetaRef(row.source_refs);
  return {
    subject: decoded.subject || row.subject || cached?.subject || "",
    chapter: decoded.chapter || row.chapter || cached?.chapter || "",
    seed: row.seed || cached?.seed || decoded.seed || row.id,
  };
}

function attemptView(row: LearningAttemptRow, paper: AttemptPaper): LearningAttemptView {
  const meta = getAttemptMeta(row);
  return {
    ...row,
    exam: resolveTestExam(paper.test),
    subject: meta.subject || paper.test.subject || "",
    chapter: meta.chapter || paper.test.generation_topic || "",
  };
}

async function rebuildPaper(
  context: Parameters<typeof buildSelectedPaper>[0],
  row: LearningAttemptRow,
) {
  const meta = getAttemptMeta(row);

  return buildSelectedPaper(
    context,
    {
      test_id: row.test_id ?? undefined,
      series_id: row.series_id ?? undefined,
      subject: meta.subject || undefined,
      chapter: meta.chapter || undefined,
    },
    meta.seed,
  );
}

function isMissingRpcError(message: string | undefined): boolean {
  if (!message) return false;
  return (
    /Could not find the function/i.test(message) ||
    /schema cache/i.test(message) ||
    /function .* does not exist/i.test(message)
  );
}

export const startLearningAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => selection.parse(input))
  .handler(async ({ context, data }) => {
    const learning = await learningPlan(context, data);
    const id = data.request_id ?? randomUUID();
    const { readTestRetention } = await import("./test-retention.server");
    const policy = await readTestRetention(context.supabase);
    if (!policy.save_results) {
      const { startTemporaryTest } = await import("./temporary-test.server");
      return startTemporaryTest(
        context,
        {
          test_id: data.test_id,
          series_id: data.series_id,
          subject: data.subject,
          chapter: data.chapter,
        },
        id,
        policy.epoch,
        learning.access.is_admin,
      );
    }

    const existing = unwrap(
      await context.supabase
        .from("learning_attempts")
        .select("*")
        .eq("id", id)
        .eq("user_id", context.userId)
        .maybeSingle(),
    );

    if (existing) {
      const existingMeta = getAttemptMeta(existing);
      if (
        existing.test_id !== (data.test_id ?? null) ||
        (existingMeta.subject && existingMeta.subject !== data.subject) ||
        (existingMeta.chapter && existingMeta.chapter !== data.chapter) ||
        (data.series_id && existing.series_id !== (learning.series_id ?? null))
      ) {
        throw new Error("This start request belongs to another selection.");
      }

      const paper = await rebuildPaper(context, existing);

      return {
        attempt: attemptView(existing, paper),
        test: paper.test,
        questions:
          existing.status === "submitted" ? paper.questions : publicQuestions(paper.questions),
        server_now: new Date().toISOString(),
        temporary: false as const,
        token: null as string | null,
      };
    }

    if (!learning.access.is_admin) {
      const limit = await context.supabase
        .from("learning_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId)
        .gte("started_at", new Date(Date.now() - 3_600_000).toISOString());

      if (limit.error) throw new Error(limit.error.message);

      if ((limit.count ?? 0) >= 30) {
        throw new Error(
          "Practice start limit reached (30/hour). Resume an existing attempt or try later.",
        );
      }
    }

    const seed = id;
    attemptSelectionCache.set(id, {
      subject: data.subject ?? "",
      chapter: data.chapter ?? "",
      seed,
    });
    const paper = await buildSelectedPaper(context, data, seed);

    const durationSeconds =
      paper.test.timer_mode === "unlimited"
        ? 0
        : paper.test.timer_mode === "question"
          ? paper.test.question_timer_seconds * paper.questions.length
          : paper.test.duration_minutes * 60;

    const questionTimerSeconds =
      paper.test.timer_mode === "question" ? paper.test.question_timer_seconds : 0;

    const sourceRefs = [
      ...paper.questions.map((question) => question.id),
      encodeMetaRef(data.subject, data.chapter, seed),
    ];

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let result = await supabaseAdmin
      .from("learning_attempts")
      .insert({
        id,
        user_id: context.userId,
        test_id: data.test_id ?? null,
        series_id: learning.series_id ?? null,
        duration_seconds: durationSeconds,
        question_timer_seconds: questionTimerSeconds,
        question_count: paper.questions.length,
        source_refs: sourceRefs,
        status: "started",
      })
      .select("*")
      .single();

    if (result.error && /question_timer_seconds/i.test(result.error.message)) {
      result = await supabaseAdmin
        .from("learning_attempts")
        .insert({
          id,
          user_id: context.userId,
          test_id: data.test_id ?? null,
          series_id: learning.series_id ?? null,
          duration_seconds: durationSeconds,
          question_count: paper.questions.length,
          source_refs: sourceRefs,
          status: "started",
        } as never)
        .select("*")
        .single();
    }

    const row =
      result.error?.code === "23505"
        ? unwrap(
            await context.supabase
              .from("learning_attempts")
              .select("*")
              .eq("id", id)
              .eq("user_id", context.userId)
              .single(),
          )
        : unwrap(result);

    if (!row) {
      throw new Error("Attempt could not be recorded. Retry Start Test with the same request.");
    }

    return {
      attempt: attemptView(row, paper),
      test: paper.test,
      questions: publicQuestions(paper.questions),
      server_now: new Date().toISOString(),
      temporary: false as const,
      token: null as string | null,
    };
  });

export const getLearningAttempt = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => attemptId.parse(input))
  .handler(async ({ context, data }) => {
    const row = unwrap(
      await context.supabase
        .from("learning_attempts")
        .select("*")
        .eq("id", data.attempt_id)
        .eq("user_id", context.userId)
        .maybeSingle(),
    );

    if (!row) throw new Error("Attempt not found for this account.");

    const meta = getAttemptMeta(row);

    if (row.status !== "submitted") {
      await learningPlan(context, {
        test_id: row.test_id ?? undefined,
        series_id: row.series_id ?? undefined,
        subject: meta.subject || undefined,
        chapter: meta.chapter || undefined,
      });
    }

    const paper = await rebuildPaper(context, row);

    return {
      attempt: attemptView(row, paper),
      test: paper.test,
      questions: row.status === "submitted" ? paper.questions : publicQuestions(paper.questions),
      server_now: new Date().toISOString(),
      temporary: false as const,
      token: null as string | null,
    };
  });

export const saveLearningAttemptAnswers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    attemptId
      .extend({
        answers: responses,
        revision: z.number().int().min(1).max(1_000_000),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { requireSavedTestMode } = await import("./test-retention.server");
    await requireSavedTestMode(context.supabase);

    const row = unwrap(
      await context.supabase
        .from("learning_attempts")
        .select("*")
        .eq("id", data.attempt_id)
        .eq("user_id", context.userId)
        .maybeSingle(),
    );

    if (!row || row.status !== "started") {
      return { ok: false, reason: "submitted" };
    }

    const meta = getAttemptMeta(row);

    await learningPlan(context, {
      test_id: row.test_id ?? undefined,
      series_id: row.series_id ?? undefined,
      subject: meta.subject || undefined,
      chapter: meta.chapter || undefined,
    });

    const paper = await rebuildPaper(context, row);

    gradePaper(paper.questions, data.answers);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const rpcResult = await supabaseAdmin.rpc("save_learning_attempt_answers", {
      p_actor: context.userId,
      p_attempt: row.id,
      p_answers: data.answers,
      p_revision: data.revision,
    });

    if (!rpcResult.error) {
      return rpcResult.data as { ok: boolean; reason?: string };
    }

    if (isMissingRpcError(rpcResult.error.message)) {
      // Fallback 1: try 3-argument RPC if legacy migration is active
      const legacyRpc = await supabaseAdmin.rpc("save_learning_attempt_answers", {
        p_actor: context.userId,
        p_attempt: row.id,
        p_answers: data.answers,
      } as never);
      if (!legacyRpc.error) {
        return legacyRpc.data as { ok: boolean; reason?: string };
      }

      // Fallback 2: direct service_role table update when RPC is not yet in Supabase schema cache
      if (
        row.duration_seconds > 0 &&
        Date.now() >= Date.parse(row.started_at) + row.duration_seconds * 1000
      ) {
        return { ok: false, reason: "expired" };
      }
      const directUpdate = await supabaseAdmin
        .from("learning_attempts")
        .update({ answers: data.answers })
        .eq("id", row.id)
        .eq("user_id", context.userId)
        .eq("status", "started");
      if (directUpdate.error) throw new Error(directUpdate.error.message);
      return { ok: true };
    }

    throw new Error(rpcResult.error.message);
  });

export const submitLearningAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => attemptId.extend({ answers: responses }).parse(input))
  .handler(async ({ context, data }) => {
    const { requireSavedTestMode } = await import("./test-retention.server");
    await requireSavedTestMode(context.supabase);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    for (let retry = 0; retry < 3; retry += 1) {
      const row = unwrap(
        await context.supabase
          .from("learning_attempts")
          .select("*")
          .eq("id", data.attempt_id)
          .eq("user_id", context.userId)
          .maybeSingle(),
      );

      if (!row) {
        throw new Error("Attempt not found for this account.");
      }

      const paper = await rebuildPaper(context, row);

      if (row.status === "submitted") {
        return {
          attempt: attemptView(row, paper),
          questions: paper.questions,
        };
      }

      const meta = getAttemptMeta(row);

      await learningPlan(context, {
        test_id: row.test_id ?? undefined,
        series_id: row.series_id ?? undefined,
        subject: meta.subject || undefined,
        chapter: meta.chapter || undefined,
      });

      const savedAnswers = answerMap(row.answers);
      const freshResult = gradePaper(paper.questions, data.answers);
      const savedResult = gradePaper(paper.questions, savedAnswers);

      const result = await supabaseAdmin.rpc("finalize_learning_attempt", {
        p_actor: context.userId,
        p_attempt: row.id,
        p_answers: data.answers,
        p_expected_saved_answers: savedAnswers,
        p_fresh_result: freshResult,
        p_saved_result: savedResult,
      });

      if (result.error?.message.includes("ATTEMPT_RETRY")) {
        continue;
      }

      if (result.error && isMissingRpcError(result.error.message)) {
        const acceptFresh =
          row.duration_seconds <= 0 ||
          Date.now() < Date.parse(row.started_at) + row.duration_seconds * 1000;
        const chosenAnswers = acceptFresh ? data.answers : savedAnswers;
        const chosenGrade = acceptFresh ? freshResult : savedResult;
        const directSubmit = unwrap(
          await supabaseAdmin
            .from("learning_attempts")
            .update({
              answers: chosenAnswers,
              status: "submitted",
              submitted_at: new Date().toISOString(),
              score: chosenGrade.score,
              total_marks: chosenGrade.totalMarks,
              correct_count: chosenGrade.correct,
              attempted_count: chosenGrade.attempted,
            })
            .eq("id", row.id)
            .eq("user_id", context.userId)
            .select("*")
            .single(),
        );
        return {
          attempt: attemptView(directSubmit ?? row, paper),
          questions: paper.questions,
        };
      }

      const submitted = unwrap(result) as unknown as LearningAttemptRow;

      return {
        attempt: attemptView(submitted, paper),
        questions: paper.questions,
      };
    }

    throw new Error(
      "Answers changed during submission. Retry Submit Test; no result was overwritten.",
    );
  });

export const listMyLearningResults = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const rows =
      unwrap(
        await context.supabase
          .from("learning_attempts")
          .select("*")
          .eq("user_id", context.userId)
          .eq("status", "submitted")
          .order("submitted_at", { ascending: false })
          .limit(100),
      ) ?? [];

    return Promise.all(
      rows.map(async (row) => {
        try {
          const paper = await rebuildPaper(context, row);
          return attemptView(row, paper);
        } catch {
          const meta = getAttemptMeta(row);
          return {
            ...row,
            exam: "Saved result",
            subject: meta.subject || "Archived selection",
            chapter: meta.chapter || "Context temporarily unavailable",
          };
        }
      }),
    );
  });
