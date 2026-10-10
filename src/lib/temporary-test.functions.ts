import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { testAnswersSchema } from "./test-answer-schema";
export const updateTemporaryTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({ token: z.string().min(40), answers: testAnswersSchema, submit: z.boolean() })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { readTestRetention } = await import("./test-retention.server");
    const policy = await readTestRetention(context.supabase);
    if (policy.save_results)
      throw new Error(
        "Admin changed test privacy mode. Start again; this temporary result will not be saved.",
      );
    const {
      openTemporary,
      sealTemporary,
      paperFingerprint,
      checkpointAnswers,
      temporaryAttemptView,
    } = await import("./temporary-test.server");
    const claim = openTemporary(data.token, context.userId, policy.epoch);
    const { buildSelectedPaper } = await import("./learning.server");
    const paper = await buildSelectedPaper(context, claim.selection, claim.id);
    if (paperFingerprint(paper.questions) !== claim.hash)
      throw new Error("Admin changed this paper. Start a new temporary test.");
    const checkpoint = checkpointAnswers(claim, paper.questions, data.answers);
    const next = { ...claim, answers: checkpoint.answers };
    return {
      ok: checkpoint.ok,
      reason: checkpoint.reason,
      token: sealTemporary(next),
      ...(data.submit
        ? { attempt: temporaryAttemptView(next, paper, true), questions: paper.questions }
        : {}),
    };
  });
