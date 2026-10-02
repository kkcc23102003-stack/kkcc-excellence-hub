import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdmin } from "@/lib/learning.server";
export type { ArchivedAIQuestion } from "@/lib/ai-question-archive.server";
export const getAIQuestionArchiveStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { archiveStatus } = await import("@/lib/ai-question-archive.server");
    return archiveStatus();
  });
