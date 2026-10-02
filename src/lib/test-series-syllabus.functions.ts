import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { DB, TestSeriesSyllabusRow } from "@/integrations/supabase/db";
import { createSandboxSupabaseClient } from "@/integrations/supabase/sandbox-database";
import { isSandboxPreviewAvailable } from "@/integrations/supabase/sandbox";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ALL_TEMPLATES } from "@/lib/exam-bank";
import { PAID_TEST_SERIES } from "@/lib/test-series-catalog";
import { isTestSeriesSyllabus } from "@/lib/test-series-syllabus";

function publicClient(): SupabaseClient<DB> | null {
  const config = getSupabasePublicConfig();
  if (config) {
    return createClient<DB>(config.url, config.publishableKey, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: { fetch: createSupabaseFetch(config.publishableKey) },
    });
  }
  if (import.meta.env.DEV && isSandboxPreviewAvailable()) return createSandboxSupabaseClient();
  return null;
}

async function assertAdmin(context: { supabase: SupabaseClient<DB>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

const topicSchema = z.object({
  name: z.string().trim().min(1).max(160),
  bank_topic: z.string().trim().max(160).default(""),
});
const chapterSchema = z.object({
  name: z.string().trim().min(1).max(160),
  topics: z.array(topicSchema).min(1).max(100),
});
const subjectSchema = z.object({
  name: z.string().trim().min(1).max(120),
  bank_subject: z.string().trim().max(120).default(""),
  chapters: z.array(chapterSchema).min(1).max(100),
});
const saveSchema = z.object({
  series_id: z.string().trim().min(1).max(120),
  exam_track: z.string().trim().min(1).max(160),
  syllabus: z.object({ subjects: z.array(subjectSchema).min(1).max(50) }),
  status: z.enum(["draft", "published"]),
});

function bankSubjects(exam: string) {
  return new Set(
    ALL_TEMPLATES.filter((template) => template.exams.includes(exam)).map(
      (template) => template.subject,
    ),
  );
}

function bankTopics(exam: string, subject: string) {
  return new Set(
    ALL_TEMPLATES.filter(
      (template) => template.exams.includes(exam) && template.subject === subject,
    ).map((template) => template.topic),
  );
}

export const listPublishedSeriesSyllabi = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicClient();
  if (!client) return [] as TestSeriesSyllabusRow[];
  const { data, error } = await client
    .from("test_series_syllabi")
    .select("*")
    .eq("status", "published")
    .limit(500);
  if (error) {
    console.warn("[series-syllabus] public read unavailable", error.message);
    return [] as TestSeriesSyllabusRow[];
  }
  return (data ?? []).filter((row) =>
    isTestSeriesSyllabus(row.syllabus),
  ) as TestSeriesSyllabusRow[];
});

export const adminListSeriesSyllabi = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("test_series_syllabi")
      .select("*")
      .order("series_id", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).filter((row) =>
      isTestSeriesSyllabus(row.syllabus),
    ) as TestSeriesSyllabusRow[];
  });

export const adminSaveSeriesSyllabus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const series = PAID_TEST_SERIES.find((item) => item.id === data.series_id);
    if (!series) throw new Error("Choose a test series from the current catalogue.");

    const allowedExams = new Set(ALL_TEMPLATES.flatMap((template) => template.exams));
    if (!allowedExams.has(data.exam_track)) {
      throw new Error("The selected exam track is not present in the verified question bank.");
    }

    if (data.status === "published") {
      const allowedSubjects = bankSubjects(data.exam_track);
      for (const subject of data.syllabus.subjects) {
        if (!subject.bank_subject || !allowedSubjects.has(subject.bank_subject)) {
          throw new Error(
            `Map “${subject.name}” to a subject in the selected exam's question bank before publishing.`,
          );
        }
        const allowedTopics = bankTopics(data.exam_track, subject.bank_subject);
        for (const chapter of subject.chapters) {
          for (const topic of chapter.topics) {
            if (!topic.bank_topic || !allowedTopics.has(topic.bank_topic)) {
              throw new Error(
                `Map “${subject.name} / ${chapter.name} / ${topic.name}” to an exact question-bank topic before publishing.`,
              );
            }
          }
        }
      }
    }

    const row = {
      series_id: data.series_id,
      exam_track: data.exam_track,
      syllabus: data.syllabus,
      status: data.status,
      updated_by: context.userId,
    };
    const { error } = await context.supabase
      .from("test_series_syllabi")
      .upsert(row as never, { onConflict: "series_id" });
    if (error) throw new Error(error.message);
    return { ok: true, status: data.status };
  });

export const adminDeleteSeriesSyllabus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ series_id: z.string().trim().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("test_series_syllabi")
      .delete()
      .eq("series_id", data.series_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
