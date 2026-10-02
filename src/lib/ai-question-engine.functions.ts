import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AIQuestionCandidateRow,
  AIQuestionTargetRow,
  DB,
  Json,
} from "@/integrations/supabase/db";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ALL_TEMPLATES } from "@/lib/exam-bank";
import {
  getAIQuestionArchiveStatus,
  getArchivedQuestion,
  putArchivedQuestion,
} from "@/lib/ai-question-archive";

type AdminContext = { supabase: SupabaseClient<DB>; userId: string };
type AIQuestionCandidateView = Omit<
  AIQuestionCandidateRow,
  "prompt" | "options" | "explanation"
> & {
  prompt: string;
  options: string[];
  explanation: string;
};

function jsonStringArray(value: Json | null): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

async function assertAdmin(c: AdminContext) {
  const { data, error } = await c.supabase.rpc("has_role", { _user_id: c.userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

const settingSchema = z.object({
  enabled: z.boolean(),
  model: z.string().min(3).max(80),
  dailyLimit: z.number().int().min(1).max(100),
  minQuality: z.number().int().min(70).max(100),
  autoPublish: z.boolean(),
  googleSearch: z.boolean(),
  apiKey: z.string().trim().max(500).optional(),
});

export const getAIQuestionEngineSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const c = context;
    await assertAdmin(c);
    const { data } = await c.supabase
      .from("private_settings")
      .select("key,value")
      .in("key", [
        "ai_question_engine_enabled",
        "ai_question_engine_model",
        "ai_question_engine_daily_limit",
        "ai_question_engine_min_quality",
        "ai_question_engine_auto_publish",
        "ai_question_engine_google_search",
        "ai_question_engine_gemini_api_key",
      ]);
    const m = new Map<string, string>((data ?? []).map((row) => [row.key, row.value]));
    return {
      enabled: m.get("ai_question_engine_enabled") === "true",
      model: m.get("ai_question_engine_model") || "gemini-2.5-flash",
      dailyLimit: Number(m.get("ai_question_engine_daily_limit") || 30),
      minQuality: Number(m.get("ai_question_engine_min_quality") || 85),
      autoPublish: m.get("ai_question_engine_auto_publish") === "true",
      googleSearch: m.get("ai_question_engine_google_search") !== "false",
      apiKeyConfigured: !!m.get("ai_question_engine_gemini_api_key"),
    };
  });

export const saveAIQuestionEngineSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(settingSchema)
  .handler(async ({ data, context }) => {
    const c = context;
    await assertAdmin(c);
    const rows = [
      ["ai_question_engine_enabled", String(data.enabled)],
      ["ai_question_engine_model", data.model],
      ["ai_question_engine_daily_limit", String(data.dailyLimit)],
      ["ai_question_engine_min_quality", String(data.minQuality)],
      ["ai_question_engine_auto_publish", String(data.autoPublish)],
      ["ai_question_engine_google_search", String(data.googleSearch)],
    ];
    for (const [key, value] of rows)
      await c.supabase
        .from("private_settings")
        .upsert({ key, value, updated_by: c.userId } as never);
    if (data.apiKey !== undefined)
      await c.supabase.from("private_settings").upsert({
        key: "ai_question_engine_gemini_api_key",
        value: data.apiKey,
        updated_by: c.userId,
      } as never);
    return { ok: true };
  });

export const syncAIQuestionTargets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const c = context;
    await assertAdmin(c);
    const rows: Array<
      Pick<AIQuestionTargetRow, "exam" | "subject" | "topic" | "enabled" | "priority">
    > = [];
    const seen = new Set<string>();
    for (const t of ALL_TEMPLATES) {
      for (const exam of t.exams) {
        const k = `${exam}|${t.subject}|${t.topic}`;
        if (seen.has(k)) continue;
        seen.add(k);
        rows.push({
          exam,
          subject: t.subject,
          topic: t.topic,
          enabled: true,
          priority: t.id.startsWith("hy:") ? 80 : 50,
        });
      }
    }
    for (let i = 0; i < rows.length; i += 200)
      await c.supabase.from("ai_question_targets").upsert(rows.slice(i, i + 200), {
        onConflict: "exam,subject,topic",
        ignoreDuplicates: true,
      });
    return { targets: rows.length };
  });

export const listAIQuestionCandidates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AIQuestionCandidateView[]> => {
    const c = context;
    await assertAdmin(c);
    const { data, error } = await c.supabase
      .from("ai_question_candidates")
      .select(
        "id,prompt,options,correct_index,explanation,exam,subject,topic,difficulty,quality_score,source_urls,source_notes,status,duplicate_key,archive_key,archive_provider,content_hash,created_at,updated_at,reviewed_by,reviewed_at",
      )
      .order("quality_score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return Promise.all(
      (data ?? []).map(async (row) => {
        if (!row.archive_key) {
          return {
            ...row,
            prompt: row.prompt ?? "[Archived question unavailable]",
            options: jsonStringArray(row.options),
            explanation: row.explanation ?? "Archive content could not be loaded.",
          };
        }
        try {
          const q = await getArchivedQuestion(c.supabase, row.archive_key);
          return {
            ...row,
            prompt: q.prompt,
            options: q.options,
            correct_index: q.correct_index,
            explanation: q.explanation,
          };
        } catch {
          return {
            ...row,
            prompt: "[Archived question unavailable]",
            options: [],
            explanation: "Archive content could not be loaded.",
          };
        }
      }),
    );
  });

export const reviewAIQuestionCandidate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({ id: z.string().uuid(), status: z.enum(["approved", "rejected", "review"]) }),
  )
  .handler(async ({ data, context }) => {
    const c = context;
    await assertAdmin(c);
    const { data: row, error } = await c.supabase
      .from("ai_question_candidates")
      .update({
        status: data.status,
        reviewed_by: c.userId,
        reviewed_at: new Date().toISOString(),
      } as never)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    if (row.archive_key) {
      const q = await getArchivedQuestion(c.supabase, row.archive_key);
      await putArchivedQuestion(c.supabase, { ...q, status: data.status });
    }
    return row;
  });

export const runAIQuestionEngine = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const c = context;
    await assertAdmin(c);
    const { data, error } = await c.supabase.functions.invoke("ai-question-research", {
      body: { source: "admin" },
    });
    if (error) throw new Error(error.message);
    return data;
  });

export const getAIArchiveStatus = getAIQuestionArchiveStatus;
