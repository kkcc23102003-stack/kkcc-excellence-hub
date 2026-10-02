import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  buildSelectedPaper,
  learningPlan,
  resolveTestExam,
  unwrap,
} from "@/lib/learning.server";
import { gradePaper, publicQuestions } from "@/lib/test-scoring";
import type {
  LearningAttemptRow,
  LearningAttemptView,
} from "@/integrations/supabase/db";

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

const responses = z
  .record(z.string().max(300), z.number().int().min(0).max(5))
  .refine((values) => Object.keys(values).length <= 1000, "Too many answers.");

const answerMap = (value: unknown) => responses.parse(value ?? {});

type AttemptPaper = Awaited<ReturnType<typeof buildSelectedPaper>>;

function attemptView(
  row: LearningAttemptRow,
  paper: AttemptPaper,
): LearningAttemptView {
  return {
    ...row,
    exam: resolveTestExam(paper.test),
    subject: row.subject ?? "",
    chapter: row.chapter ?? "",
  };
}

async function rebuildPaper(
  context: Parameters<typeof buildSelectedPaper>[0],
  row: LearningAttemptRow,
) {
  if (!row.seed) {
    throw new Error("Attempt is missing its generation seed.");
  }

  return buildSelectedPaper(
    context,
    {
      test_id: row.test_id ?? undefined,
      series_id: row.series_id ?? undefined,
      subject: row.subject ?? undefined,
      chapter: row.chapter ?? undefined,
    },
    row.seed,
  );
}

export const startLearningAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => selection.parse(input))
  .handler(async ({ context, data }) => {
    const learning = await learningPlan(context, data);
    const id = data.request_id ?? randomUUID();

    const existing = unwrap(
      await context.supabase
        .from("learning_attempts")
        .select("*")
        .eq("id", id)
        .eq("user_id", context.userId)
        .maybeSingle(),
    );

    if (existing) {
      if (
        existing.test_id !== (data.test_id ?? null) ||
        existing.subject !== data.subject ||
        existing.chapter !== data.chapter ||
        (data.series_id &&
          existing.series_id !== (learning.series_id ?? null))
      ) {
        throw new Error("This start request belongs to another selection.");
      }

      const paper = await rebuildPaper(context, existing);

      return {
        attempt: attemptView(existing, paper),
        test: paper.test,
        questions:
          existing.status === "submitted"
            ? paper.questions
            : publicQuestions(paper.questions),
        server_now: new Date().toISOString(),
      };
    }

    if (!learning.access.is_admin) {
      const limit = await context.supabase
        .from("learning_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId)
        .gte(
          "started_at",
          new Date(Date.now() - 3_600_000).toISOString(),
        );

      if (limit.error) throw new Error(limit.error.message);

      if ((limit.count ?? 0) >= 30) {
        throw new Error(
          "Practice start limit reached (30/hour). Resume an existing attempt or try later.",
        );
      }
    }

    const seed = randomUUID();
    const paper = await buildSelectedPaper(context, data, seed);

    const durationSeconds =
      paper.test.timer_mode === "unlimited"
        ? 0
        : paper.test.timer_mode === "question"
          ? paper.test.question_timer_seconds * paper.questions.length
          : paper.test.duration_minutes * 60;

    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");

    const result = await supabaseAdmin
      .from("learning_attempts")
      .insert({
        id,
        user_id: context.userId,
        test_id: data.test_id ?? null,
        series_id: learning.series_id ?? null,
        subject: data.subject,
        chapter: data.chapter,
        seed,
        duration_seconds: durationSeconds,
        question_timer_seconds:
          paper.test.timer_mode === "question"
            ? paper.test.question_timer_seconds
            : 0,
        question_count: paper.questions.length,
        source_refs: paper.questions.map((question) => question.id),
        status: "started",
      })
      .select("*")
      .single();

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
      throw new Error(
        "Attempt could not be recorded. Retry Start Test with the same request.",
      );
    }

    return {
      attempt: attemptView(row, paper),
      test: paper.test,
      questions: publicQuestions(paper.questions),
      server_now: new Date().toISOString(),
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

    if (row.status !== "submitted") {
      await learningPlan(context, {
        test_id: row.test_id ?? undefined,
        series_id: row.series_id ?? undefined,
        subject: row.subject ?? undefined,
        chapter: row.chapter ?? undefined,
      });
    }

    const paper = await rebuildPaper(context, row);

    return {
      attempt: attemptView(row, paper),
      test: paper.test,
      questions:
        row.status === "submitted"
          ? paper.questions
          : publicQuestions(paper.questions),
      server_now: new Date().toISOString(),
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

    await learningPlan(context, {
      test_id: row.test_id ?? undefined,
      series_id: row.series_id ?? undefined,
      subject: row.subject ?? undefined,
      chapter: row.chapter ?? undefined,
    });

    const paper = await rebuildPaper(context, row);

    gradePaper(paper.questions, data.answers);

    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");

    const saved = unwrap(
      await supabaseAdmin.rpc("save_learning_attempt_answers", {
        p_actor: context.userId,
        p_attempt: row.id,
        p_answers: data.answers,
        p_revision: data.revision,
      }),
    );

    return saved as { ok: boolean; reason?: string };
  });

export const submitLearningAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    attemptId.extend({ answers: responses }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");

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

      await learningPlan(context, {
        test_id: row.test_id ?? undefined,
        series_id: row.series_id ?? undefined,
        subject: row.subject ?? undefined,
        chapter: row.chapter ?? undefined,
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
          return {
            ...row,
            exam: "Saved result",
            subject: row.subject ?? "Archived selection",
            chapter: row.chapter ?? "Context temporarily unavailable",
          };
        }
      }),
    );
  });
