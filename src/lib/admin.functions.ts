import { readNoteBody, storeNoteBody, hydrateNoteBodies } from "./note-body.server";
import { randomUUID } from "node:crypto";
import { thumbnailFields } from "./thumbnail";
import { testSchema, parseTestSettingsPatch } from "./test-settings";
import { getExamBankExams } from "@/lib/exam-bank";
import {
  generateCustomSyllabusPaper,
  isLegacyScienceFallbackForNonScienceSubject,
} from "@/lib/generated-test";
import { CUSTOM_SERIES_CATALOG_KEY, readCustomSeriesCatalog, unwrap } from "@/lib/learning.server";
import {
  getChapterQuestionCount,
  getCustomChapterConfig,
  makeCustomChapterKey,
  parseSeriesSyllabusText,
  SERIES_GROUPS,
  setRuntimeCustomSeriesCatalog,
  type CustomChapterConfig,
  type CustomChapterQuestion,
  type CustomSeriesCatalog,
  type PaidTestSeries,
  type SeriesGroup,
} from "@/lib/test-series-catalog";
import {
  flushProjectContentCaches,
  projectContent,
  readProjectDocument,
} from "@/lib/project-content.server";
import {
  buildFallbackExplanation,
  parseBulkMcqText,
  prepareBulkRows,
  type ParsedBulkQuestion,
} from "@/lib/test-bulk-parse";
import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";

const courseSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(120),
  category: z.string().trim().max(60),
  class_level: z.string().trim().max(60),
  subject: z.string().trim().max(80),
  faculty: z.string().trim().max(120),
  course_type: z.string().trim().max(30),
  status: z.enum(["draft", "published", "archived"]),
  thumbnail_url: z.string().trim().max(4000).nullable().optional(),
  summary: z.string().trim().max(600),
  description: z.string().trim().max(6000),
  outcomes: z.array(z.string().trim().max(300)).max(20),
  price: z.number().int().min(0).max(1000000),
  coin_price: z.number().int().min(0).max(1000000).optional(),
  original_price: z.number().int().min(0).max(1000000),
  discount_percent: z.number().int().min(0).max(100),
  duration_hours: z.number().int().min(0).max(10000),
  lectures_count: z.number().int().min(0).max(10000),
  tests_count: z.number().int().min(0).max(10000),
  materials_count: z.number().int().min(0).max(10000),
  rating: z.number().min(0).max(5),
  hue: z.number().int().min(0).max(360),
  sort_order: z.number().int().min(0).max(10000),
});

const lectureSchema = z.object({
  id: z.string().uuid().optional(),
  course_id: z.string().uuid(),
  module_title: z.string().trim().max(160),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000),
  duration: z.string().trim().max(20),
  video_url: z.string().trim().max(1200).nullable().optional(),
  is_free: z.boolean(),
  sort_order: z.number().int().min(0).max(10000),
});

const materialSchema = z.object({
  ...thumbnailFields,
  id: z.string().uuid().optional(),
  course_id: z.string().uuid().nullable().optional(),
  lecture_id: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(2).max(200),
  description: z.string().max(200000).optional(),
  subject: z.string().trim().max(80),
  chapter: z.string().trim().max(120),
  module_title: z.string().trim().max(160).optional(),
  batch: z.string().trim().max(120).optional(),
  material_type: z.string().trim().max(60),
  class_level: z.string().trim().max(60),
  pages: z.number().int().min(0).max(10000),
  file_url: z.string().trim().max(200000).nullable().optional(),
  access_type: z.enum(["course", "free", "paid"]).optional(),
  price: z.number().int().min(0).max(1000000).optional(),
  coin_price: z.number().int().min(0).max(1000000).optional(),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0).max(10000),
});

function clean<T extends object>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Record<
    string,
    unknown
  >;
}

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type LectureRow = Database["public"]["Tables"]["lectures"]["Row"];
type MaterialRow = Database["public"]["Tables"]["materials"]["Row"];
type TestRow = Database["public"]["Tables"]["tests"]["Row"];

type AdminContext = { supabase: SupabaseClient<Database>; userId: string };

async function insertNotificationSafe(
  context: AdminContext,
  payload: {
    title: string;
    message: string;
    type: string;
    audience: "all" | "students" | "admins" | "course" | "user";
    course_id?: string | null;
    target_user_id?: string | null;
    priority?: "low" | "normal" | "high";
    action_label?: string;
    action_url?: string;
  },
) {
  try {
    const { error } = await context.supabase.from("notifications").insert({
      title: payload.title,
      message: payload.message,
      type: payload.type,
      audience: payload.audience,
      course_id: payload.course_id ?? null,
      target_user_id: payload.target_user_id ?? null,
      priority: payload.priority ?? "normal",
      action_label: payload.action_label ?? "Open",
      action_url: payload.action_url ?? "",
      is_published: true,
      send_at: null,
      expires_at: null,
      created_by: context.userId,
    } as never);

    if (error) console.error("[admin] notification failed", error.message);
  } catch (error) {
    console.error("[admin] notification failed", error);
  }
}

async function getPublishedCourse(context: AdminContext, courseId: string | null | undefined) {
  if (!courseId) return null;
  const { data } = await projectContent
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle();
  return data?.status === "published" ? data : null;
}

async function sendNewBatchNotification(
  context: AdminContext,
  course: CourseRow,
  previousStatus: string | null,
) {
  if (course.status !== "published" || previousStatus === "published") return;
  const details = [course.class_level, course.subject].filter(Boolean).join(" · ");
  await insertNotificationSafe(context, {
    title: `New batch added: ${course.title}`,
    message: `${course.title} batch is now available${details ? ` for ${details}` : ""}. Open it to check lectures, study material, tests and enrollment details.`,
    type: "batch",
    audience: "students",
    priority: "normal",
    action_label: "View batch",
    action_url: `/courses/${course.slug}`,
  });
}

async function sendLectureNotification(
  context: AdminContext,
  lecture: LectureRow,
  wasExisting: boolean,
) {
  if (wasExisting) return;
  const course = await getPublishedCourse(context, lecture.course_id);
  if (!course) return;
  await insertNotificationSafe(context, {
    title: `New lecture: ${lecture.title}`,
    message: `${course.title}: a new lecture has been added — ${lecture.title}.`,
    type: "lecture",
    audience: "course",
    course_id: course.id,
    action_label: "Watch lecture",
    action_url: "/learn",
  });
}

async function sendMaterialNotification(
  context: AdminContext,
  material: MaterialRow,
  previousPublished: boolean,
) {
  if (!material.is_published || previousPublished) return;
  const course = await getPublishedCourse(context, material.course_id);
  if (!course) return;
  await insertNotificationSafe(context, {
    title: `New study material: ${material.title}`,
    message: `${course.title}: new notes/material have been published — ${material.title}.`,
    type: "material",
    audience: "course",
    course_id: course.id,
    action_label: "Open material",
    action_url: "/dashboard/materials",
  });
}

async function sendTestNotification(
  context: AdminContext,
  test: TestRow,
  previousPublished: boolean,
) {
  if (!test.is_published || previousPublished) return;
  const course = await getPublishedCourse(context, test.course_id);
  if (!course) return;
  await insertNotificationSafe(context, {
    title: `New test: ${test.title}`,
    message: `${course.title}: a new test has been published — ${test.title}. Attempt it to check your preparation.`,
    type: "test",
    audience: "course",
    course_id: course.id,
    priority: "high",
    action_label: "Attempt test",
    action_url: `/test/${test.id}`,
  });
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data), userId: context.userId };
  });

export const adminListCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await projectContent
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetCourse = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const [{ data: course }, { data: lectures }, { data: materials }, { data: tests }] =
      await Promise.all([
        projectContent.from("courses").select("*").eq("id", data.id).maybeSingle(),
        projectContent
          .from("lectures")
          .select("*")
          .eq("course_id", data.id)
          .order("sort_order", { ascending: true }),
        projectContent
          .from("materials")
          .select("*")
          .eq("course_id", data.id)
          .order("sort_order", { ascending: true }),
        projectContent
          .from("tests")
          .select("*")
          .eq("course_id", data.id)
          .order("sort_order", { ascending: true }),
      ]);
    if (!course) return null;
    return {
      course,
      lectures: lectures ?? [],
      materials: await hydrateNoteBodies(materials ?? []),
      tests: tests ?? [],
    };
  });

export const saveCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => courseSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...rest } = data;
    const previousStatus = id
      ? ((await projectContent.from("courses").select("status").eq("id", id).maybeSingle()).data
          ?.status ?? null)
      : null;
    const payload = clean({ ...rest, updated_at: new Date().toISOString() });
    const { data: row, error } = id
      ? await projectContent
          .from("courses")
          .update(payload as never)
          .eq("id", id)
          .select("*")
          .single()
      : await projectContent
          .from("courses")
          .insert(payload as never)
          .select("*")
          .single();
    if (error) throw new Error(error.message);
    await sendNewBatchNotification(context, row, previousStatus);
    return row;
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await projectContent.from("courses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveLecture = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => lectureSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...rest } = data;
    const payload = clean({ ...rest, updated_at: new Date().toISOString() });
    const { data: row, error } = id
      ? await projectContent
          .from("lectures")
          .update(payload as never)
          .eq("id", id)
          .select("*")
          .single()
      : await projectContent
          .from("lectures")
          .insert(payload as never)
          .select("*")
          .single();
    if (error) throw new Error(error.message);
    await sendLectureNotification(context, row, Boolean(id));
    return row;
  });

export const deleteLecture = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await projectContent.from("lectures").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => materialSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.course_id) {
      const course = unwrap(
        await projectContent.from("courses").select("id").eq("id", data.course_id).maybeSingle(),
      );
      if (!course) throw new Error("Linked course is missing. Choose an existing course ID.");
    }
    const { id, ...rest } = data;
    const current = id
      ? unwrap(await projectContent.from("materials").select("*").eq("id", id).single())
      : null;
    const noteId = id || randomUUID();
    const text =
      data.description !== undefined
        ? data.description
        : current
          ? await readNoteBody(current)
          : "";
    const body = await storeNoteBody(noteId, text, current);
    const previousPublished = id
      ? Boolean(
          (await projectContent.from("materials").select("is_published").eq("id", id).maybeSingle())
            .data?.is_published,
        )
      : false;
    const payload = clean({
      ...rest,
      description: "",
      ...body,
      updated_at: new Date().toISOString(),
    });
    const { data: row, error } = id
      ? await projectContent
          .from("materials")
          .update(payload as never)
          .eq("id", id)
          .select("*")
          .single()
      : await projectContent
          .from("materials")
          .insert({ id: noteId, ...payload } as never)
          .select("*")
          .single();
    if (error) throw new Error(error.message);
    await sendMaterialNotification(context, row, previousPublished);
    return { ...row, description: text };
  });

export const deleteMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await projectContent.from("materials").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

async function persistTest(
  data: z.infer<typeof testSchema>,
  context: AdminContext,
  changes?: Record<string, unknown>,
) {
  await assertAdmin(context);
  if (data.is_paid && data.price_inr <= 0 && data.price_coins <= 0) {
    throw new Error("A paid test needs a rupee price, a coin price, or both.");
  }
  if (
    data.course_id &&
    !unwrap(
      await projectContent.from("courses").select("id").eq("id", data.course_id).maybeSingle(),
    )
  )
    throw new Error("Linked course is missing. Choose an existing course ID.");
  if (data.is_published && data.question_source === "deterministic") {
    if (data.generation_count < 1 && data.questions_count < 1) {
      throw new Error("Choose a positive question target before publishing.");
    }
    const exam =
      data.generation_exam && data.generation_exam !== "All Exams"
        ? data.generation_exam
        : data.exam_track || data.generation_exam || "All Exams";
    const targetSubject = data.generation_subject || data.syllabus_subject || data.subject || "";
    const targetTopic =
      data.generation_topic && data.generation_topic !== "Mixed"
        ? data.generation_topic
        : data.syllabus_chapter || data.generation_topic || "Mixed";
    const count = data.generation_count || data.questions_count;
    const preview = generateCustomSyllabusPaper({
      exam,
      subject: targetSubject,
      topic: targetTopic,
      difficulty: data.generation_difficulty,
      count,
      marks: 1,
      negative_marks: 0,
      seed: `publish:${data.id || "new"}`,
    });
    if (preview.length < count) {
      throw new Error(
        `Only ${preview.length} matching bank questions are available for this subject/chapter. Lower the target or use your own questions; unrelated questions will not be added.`,
      );
    }
  }
  if (data.is_published && data.question_source === "manual") {
    const count = data.id
      ? unwrap(await projectContent.from("test_questions").select("id").eq("test_id", data.id))
      : [];
    if (!count.length) throw new Error("Add real questions before publishing this manual test.");
  }
  const { id, ...rest } = data;
  const previousPublished = id
    ? Boolean(
        (await projectContent.from("tests").select("is_published").eq("id", id).maybeSingle()).data
          ?.is_published,
      )
    : false;
  const payload = clean({ ...(changes ?? rest), updated_at: new Date().toISOString() });
  const { data: row, error } = id
    ? await projectContent
        .from("tests")
        .update(payload as never)
        .eq("id", id)
        .select("*")
        .single()
    : await projectContent
        .from("tests")
        .insert(payload as never)
        .select("*")
        .single();
  if (error) throw new Error(error.message);
  await sendTestNotification(context, row, previousPublished);
  return row;
}
export const saveTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => testSchema.parse(input))
  .handler(async ({ data, context }) => persistTest(data, context));

/** Update only fields changed by the admin, so overlapping blur saves cannot erase each other. */
export const patchTestSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(parseTestSettingsPatch)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...changes } = data;
    const current = unwrap(await projectContent.from("tests").select("*").eq("id", id).single());
    return persistTest(testSchema.parse({ ...current, ...data }), context, changes);
  });

export const deleteTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await projectContent.from("tests").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListMaterials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await projectContent
      .from("materials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return hydrateNoteBodies(data ?? []);
  });

const mcqImportSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().trim().min(2).max(200),
  instructions: z.string().trim().max(4000).default(""),
  subject: z.string().trim().max(80),
  duration_minutes: z.number().int().min(0).max(1000).default(60),
  question_timer_seconds: z.number().int().min(0).max(7200).default(0),
  timer_mode: z.enum(["test", "question", "unlimited"]).default("test"),
  marks: z.number().int().min(1).max(100).default(4),
  negative_marks: z.number().int().min(0).max(100).default(1),
  is_published: z.boolean().default(false),
  text: z.string().trim().min(10).max(60000),
});

type ParsedMcq = {
  question_text: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export const createTestFromMcqText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => mcqImportSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const questions = parseBulkMcqText(data.text);
    if (!questions.length) {
      throw new Error(
        "No valid MCQs found. Use format: Q1. question, A) option, B) option, C) option, D) option, Answer: B",
      );
    }

    const totalMarks = questions.reduce((sum) => sum + data.marks, 0);
    const { data: test, error: testError } = await projectContent
      .from("tests")
      .insert({
        course_id: data.course_id,
        title: data.title,
        instructions: data.instructions,
        subject: data.subject,
        duration_minutes: data.duration_minutes,
        question_timer_seconds: data.question_timer_seconds,
        timer_mode: data.timer_mode,
        questions_count: questions.length,
        total_marks: totalMarks,
        is_published: data.is_published,
        sort_order: 0,
      } as never)
      .select("*")
      .single();
    if (testError) throw new Error(testError.message);

    const rows = questions.map((question, index) => ({
      test_id: test.id,
      question_text: question.question_text,
      subject: data.subject,
      options: question.options,
      correct_index: question.correct_index,
      marks: data.marks,
      negative_marks: data.negative_marks,
      explanation: question.explanation || buildFallbackExplanation(question, data.subject),
      sort_order: index,
    }));
    const { error: questionError } = await projectContent
      .from("test_questions")
      .insert(rows as never);
    if (questionError) {
      await projectContent.from("tests").delete().eq("id", test.id);
      throw new Error(questionError.message);
    }

    await sendTestNotification(context, test, false);
    return { test, questions_count: questions.length };
  });

/* ------------------------------------------------------------------------ *
 * Test series question workbench
 *
 * Lets an admin write, edit, reorder and delete individual MCQs for any test
 * from a dedicated screen, instead of only pasting bulk text. The database
 * trigger `refresh_test_question_counts` keeps questions_count and total_marks
 * in sync automatically.
 * ------------------------------------------------------------------------ */

const testQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  test_id: z.string().uuid(),
  question_text: z.string().trim().min(3).max(2000),
  subject: z.string().trim().max(80).default(""),
  options: z.array(z.string().trim().min(1).max(600)).min(2).max(6),
  correct_index: z.number().int().min(0).max(5),
  marks: z.number().int().min(0).max(100).default(4),
  negative_marks: z.number().int().min(0).max(100).default(1),
  explanation: z.string().trim().max(4000).default(""),
  sort_order: z.number().int().min(0).default(0),
});

/** Every test with its course title, newest first. */
export const listAdminTests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await projectContent
      .from("tests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** All questions of one test, in display order. */
export const listTestQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ test_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await projectContent
      .from("test_questions")
      .select("*")
      .eq("test_id", data.test_id)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

async function syncTestQuestionStats(testId: string) {
  const testRes = await projectContent.from("tests").select("*").eq("id", testId).maybeSingle();
  if (testRes.error || !testRes.data) return;
  const rowsRes = await projectContent.from("test_questions").select("*").eq("test_id", testId);
  const rows = rowsRes.data ?? [];
  if (testRes.data.question_source === "manual" || rows.length > 0) {
    const count =
      testRes.data.question_source === "manual"
        ? rows.length
        : Math.max(testRes.data.questions_count, rows.length);
    const totalMarks =
      testRes.data.question_source === "manual"
        ? rows.reduce((sum, r) => sum + (r.marks || 1), 0)
        : Math.max(
            testRes.data.total_marks,
            rows.reduce((sum, r) => sum + (r.marks || 1), 0),
          );
    await projectContent
      .from("tests")
      .update({
        questions_count: count,
        total_marks: totalMarks,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", testId);
  }
}

/** Create or update a single hand-written question. */
export const saveTestQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => testQuestionSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    if (
      !unwrap(await projectContent.from("tests").select("id").eq("id", data.test_id).maybeSingle())
    )
      throw new Error("Parent test not found. No orphan questions were created.");
    const options = data.options.map((option) => option.trim()).filter(Boolean);
    if (options.length < 2) {
      throw new Error("Please write at least two options.");
    }
    if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) {
      throw new Error("Two options are identical. Every option must be different.");
    }
    if (data.correct_index >= options.length) {
      throw new Error("Please mark which option is the correct answer.");
    }

    const { id, ...rest } = data;
    const payload = {
      ...rest,
      options,
      updated_at: new Date().toISOString(),
    };

    const { data: row, error } = id
      ? await projectContent
          .from("test_questions")
          .update(payload as never)
          .eq("id", id)
          .select("*")
          .single()
      : await projectContent
          .from("test_questions")
          .insert(payload as never)
          .select("*")
          .single();
    if (error) throw new Error(error.message);
    const mode = await projectContent
      .from("tests")
      .update({ question_source: "manual" })
      .eq("id", data.test_id);
    if (mode.error)
      throw new Error(
        `Question saved, but switching to manual failed: ${mode.error.message}. Do not re-add; switch to Only My Questions.`,
      );
    await syncTestQuestionStats(data.test_id);
    return row;
  });

export const deleteTestQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const existing = await projectContent
      .from("test_questions")
      .select("test_id")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await projectContent.from("test_questions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    if (existing.data?.test_id) {
      await syncTestQuestionStats(existing.data.test_id);
    }
    return { ok: true };
  });

export const bulkAddTestQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        test_id: z.string().uuid(),
        subject: z.string().trim().max(80).default(""),
        marks: z.number().int().min(1).max(100).default(4),
        negative_marks: z.number().int().min(0).max(100).default(1),
        text: z.string().trim().min(5),
        /**
         * The exact rows the admin approved in the preview step. When present
         * these are published verbatim — the pasted text is only the fallback.
         */
        questions: z
          .array(
            z.object({
              question_text: z.string().trim().min(3).max(2000),
              options: z.array(z.string().trim().min(1).max(500)).min(2).max(6),
              correct_index: z.number().int().min(0).max(5),
              explanation: z.string().trim().max(5000).default(""),
              marks: z.number().int().min(1).max(100).optional(),
              negative_marks: z.number().int().min(0).max(100).optional(),
            }),
          )
          .optional(),
        switchToManual: z.boolean().optional(),
        publish: z.boolean().default(false),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const parent = unwrap(
      await projectContent.from("tests").select("*").eq("id", data.test_id).maybeSingle(),
    );
    if (!parent) throw new Error("Parent test not found.");
    if (data.publish && !data.questions?.length)
      throw new Error("Approve at least one question in preview before publishing.");
    if (data.publish && parent.is_paid && parent.price_inr <= 0 && parent.price_coins <= 0)
      throw new Error("Set a rupee or coin price before publishing a paid test.");
    const fromPreview: ParsedBulkQuestion[] = (data.questions ?? []).map((question) => ({
      question_text: question.question_text,
      options: question.options,
      correct_index: question.correct_index,
      explanation: question.explanation,
      explanation_source: question.explanation ? "paste" : "auto",
      ...(question.marks !== undefined ? { marks: question.marks } : {}),
      ...(question.negative_marks !== undefined ? { negative_marks: question.negative_marks } : {}),
    }));
    const parsed = fromPreview.length ? fromPreview : parseBulkMcqText(data.text);
    if (!parsed.length) {
      throw new Error(
        "No valid MCQs found. Use format:\nQ1. Your question?\nA) Option 1\nB) Option 2\nC) Option 3\nD) Option 4\nAnswer: A\nExplanation: Optional solution",
      );
    }
    const existing = await projectContent
      .from("test_questions")
      .select("id")
      .eq("test_id", data.test_id);
    const baseOrder = (existing.data ?? []).length;
    const rows = prepareBulkRows(parsed, {
      subject: data.subject || parent.subject || "General",
      marks: data.marks,
      negative_marks: data.negative_marks,
      startOrder: baseOrder,
    }).map((row) => ({ ...row, test_id: data.test_id }));
    const { error } = await projectContent.from("test_questions").insert(rows as never);
    if (error) throw new Error(error.message);
    const saved = await projectContent
      .from("tests")
      .update({
        question_source: "manual" as const,
        ...(data.publish ? { is_published: true } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.test_id)
      .select("*")
      .single();
    await syncTestQuestionStats(data.test_id);
    // Questions already exist: do not encourage a duplicate bulk retry on a metadata failure.
    return {
      ok: true,
      addedCount: rows.length,
      published: Boolean(saved.data?.is_published),
      publishError: saved.error?.message ?? null,
    };
  });

/** Persist a new display order after drag/move in the editor. */
export const reorderTestQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        test_id: z.string().uuid(),
        ids: z.array(z.string().uuid()),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    for (let index = 0; index < data.ids.length; index += 1) {
      const id = data.ids[index];
      if (!id) continue;
      const { error } = await projectContent
        .from("test_questions")
        .update({ sort_order: index } as never)
        .eq("id", id)
        .eq("test_id", data.test_id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Test series overrides                                              */
/*                                                                    */
/* The catalogue lives in code because each series is wired to real   */
/* subjects and chapters. These functions let an admin change the     */
/* commercial and presentational side of a series — whether it is on  */
/* sale, its name, its description and its price — without a deploy.  */
/* An absent row means the code values stand.                         */
/* ------------------------------------------------------------------ */

/** Every override currently stored, for the admin screen. */
export const adminListSeriesOverrides = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await projectContent
      .from("test_series_overrides")
      .select("*")
      .order("series_id", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Create or update one override. Null clears a field back to the code value. */
export const adminSaveSeriesOverride = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        series_id: z.string().trim().min(1).max(120),
        enabled: z.boolean(),
        name: z.string().trim().min(3).max(160).nullable().optional(),
        summary: z.string().trim().min(10).max(2000).nullable().optional(),
        price_inr: z.number().int().min(0).max(100000).nullable().optional(),
        price_coins: z.number().int().min(0).max(10000000).nullable().optional(),
        sort_order: z.number().int().min(0).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const row = {
      series_id: data.series_id,
      enabled: data.enabled,
      name: data.name ?? null,
      summary: data.summary ?? null,
      price_inr: data.price_inr ?? null,
      price_coins: data.price_coins ?? null,
      sort_order: data.sort_order ?? null,
      updated_by: context.userId,
    };
    const { error } = await projectContent
      .from("test_series_overrides")
      .upsert(row as never, { onConflict: "series_id" });
    if (error) throw new Error(error.message);

    const current = await readCustomSeriesCatalog();
    if ((current.addedSeries ?? []).some((item) => item.id === data.series_id)) {
      const nextAdded = (current.addedSeries ?? []).map((item) =>
        item.id === data.series_id
          ? {
              ...item,
              ...(data.name ? { name: data.name } : {}),
              ...(data.summary ? { summary: data.summary } : {}),
              ...(typeof data.price_inr === "number" ? { priceInr: data.price_inr } : {}),
              ...(typeof data.price_coins === "number" ? { priceCoins: data.price_coins } : {}),
            }
          : item,
      );
      await writeCustomSeriesCatalog({
        ...current,
        addedSeries: nextAdded,
      });
    }

    return { ok: true };
  });

/** Drop an override so the series falls back to exactly what the code says. */
export const adminResetSeriesOverride = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ series_id: z.string().trim().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await projectContent
      .from("test_series_overrides")
      .delete()
      .eq("series_id", data.series_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Pull questions from the exam bank into a test                      */
/*                                                                    */
/* Until now an admin-made test was typed by hand, question by        */
/* question, while the 1.2 crore bank sat unused a few files away.    */
/* This fills a test straight from the bank, after which every        */
/* question can still be edited, reordered or deleted normally.       */
/* ------------------------------------------------------------------ */

export const pullQuestionsFromBank = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        test_id: z.string().uuid(),
        exam: z.string().trim().min(1).max(80),
        subject: z.string().trim().min(1).max(80),
        topic: z.string().trim().min(1).max(160).default("Mixed"),
        difficulty: z.enum(["Easy", "Moderate", "Difficult", "Mixed"]).default("Difficult"),
        count: z.number().int().min(1).max(1000).default(20),
        marks: z.number().int().min(0).max(100).default(1),
        negative_marks: z.number().int().min(0).max(100).default(0),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const preview = generateCustomSyllabusPaper({
      ...data,
      seed: `coverage:${data.exam}:${data.subject}:${data.topic}`,
    });
    if (preview.length < data.count)
      throw new Error(
        `Only ${preview.length} matching questions are available for this exam/subject/chapter and difficulty. Lower the count or add your own questions. No other subject will be substituted.`,
      );

    // IMPORTANT: this no longer generates/inserts question rows. It only saves
    // the small generation recipe on the test. Students get a fresh paper on
    // every open from the deterministic bank, and the generated MCQs vanish
    // after that request.
    const { data: test, error: testError } = await projectContent
      .from("tests")
      .select("id, exam_track")
      .eq("id", data.test_id)
      .maybeSingle();
    if (testError) throw new Error(testError.message);
    if (!test) throw new Error("Test not found.");

    // Existing manual questions are preserved; switching back restores the same IDs.

    const totalMarks = data.count * data.marks;
    const { error } = await projectContent
      .from("tests")
      .update({
        question_source: "deterministic",
        subject: data.subject,
        syllabus_subject: data.subject,
        syllabus_chapter: data.topic !== "Mixed" ? data.topic : "",
        exam_track: data.exam !== "All Exams" ? data.exam : (test.exam_track ?? ""),
        generation_exam: data.exam,
        generation_subject: data.subject,
        generation_topic: data.topic,
        generation_difficulty: data.difficulty,
        generation_count: data.count,
        generation_marks: data.marks,
        generation_negative_marks: data.negative_marks,
        questions_count: data.count,
        total_marks: totalMarks,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.test_id);
    if (error) throw new Error(error.message);

    return {
      ok: true,
      added: data.count,
      generatedOnDemand: true,
      savedQuestionRows: 0,
    };
  });

async function writeCustomSeriesCatalog(catalog: CustomSeriesCatalog) {
  setRuntimeCustomSeriesCatalog(catalog);
  const { error } = await projectContent.from("site_settings").upsert(
    {
      key: CUSTOM_SERIES_CATALOG_KEY,
      value: JSON.stringify(catalog),
    } as never,
    { onConflict: "key" },
  );
  if (error) throw new Error(error.message);
  return catalog;
}

export const adminGetCustomSeriesCatalog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    return readCustomSeriesCatalog();
  });

export const adminSaveSeriesSyllabus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        series_id: z.string().trim().min(1).max(120),
        syllabus_text: z.string().trim().min(3).max(20000),
        enabled: z.boolean().optional(),
        name: z.string().trim().min(2).max(160).nullable().optional(),
        summary: z.string().trim().min(3).max(2000).nullable().optional(),
        price_inr: z.number().int().min(0).max(100000).nullable().optional(),
        price_coins: z.number().int().min(0).max(10000000).nullable().optional(),
        questions_per_test: z.number().int().min(1).max(200).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const plan = parseSeriesSyllabusText(data.syllabus_text);
    if (plan.length === 0) {
      throw new Error(
        "Enter at least one Subject and Chapter (e.g. General Knowledge :: History of Punjab, Polity).",
      );
    }
    const current = await readCustomSeriesCatalog();
    const qPerTest =
      data.questions_per_test ?? current.questionsPerSeriesId?.[data.series_id] ?? 60;
    const syllabusBySeriesId = {
      ...(current.syllabusBySeriesId ?? {}),
      [data.series_id]: plan,
    };
    const questionsPerSeriesId = {
      ...(current.questionsPerSeriesId ?? {}),
      [data.series_id]: qPerTest,
    };
    const addedSeries = (current.addedSeries ?? []).map((item) =>
      item.id === data.series_id
        ? {
            ...item,
            ...(data.name ? { name: data.name } : {}),
            ...(data.summary ? { summary: data.summary } : {}),
            ...(typeof data.price_inr === "number" ? { priceInr: data.price_inr } : {}),
            ...(typeof data.price_coins === "number" ? { priceCoins: data.price_coins } : {}),
            subjects: plan.map((p) => p.subject),
            customPlan: plan,
            questionsPerTest: qPerTest,
          }
        : item,
    );
    await writeCustomSeriesCatalog({
      ...current,
      syllabusBySeriesId,
      questionsPerSeriesId,
      addedSeries,
    });

    if (
      data.enabled !== undefined ||
      data.name !== undefined ||
      data.summary !== undefined ||
      data.price_inr !== undefined ||
      data.price_coins !== undefined
    ) {
      await projectContent.from("test_series_overrides").upsert(
        {
          series_id: data.series_id,
          enabled: data.enabled ?? true,
          name: data.name ?? null,
          summary: data.summary ?? null,
          price_inr: data.price_inr ?? null,
          price_coins: data.price_coins ?? null,
          sort_order: null,
          updated_by: context.userId,
        } as never,
        { onConflict: "series_id" },
      );
    }

    const totalChapters = plan.reduce((sum, item) => sum + item.chapters.length, 0);
    return {
      ok: true,
      subjectsCount: plan.length,
      chaptersCount: totalChapters,
      questionsPerChapter: qPerTest,
      totalAutoQuestions: totalChapters * qPerTest,
    };
  });

export const adminResetSeriesSyllabus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ series_id: z.string().trim().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const current = await readCustomSeriesCatalog();
    const nextMap = { ...(current.syllabusBySeriesId ?? {}) };
    delete nextMap[data.series_id];
    await writeCustomSeriesCatalog({
      ...current,
      syllabusBySeriesId: nextMap,
    });
    return { ok: true };
  });

export const adminRemoveTestSeries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ series_id: z.string().trim().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const current = await readCustomSeriesCatalog();
    const isCustomAdded = (current.addedSeries ?? []).some((s) => s.id === data.series_id);
    const nextAdded = (current.addedSeries ?? []).filter((s) => s.id !== data.series_id);
    const nextRemoved = isCustomAdded
      ? (current.removedSeriesIds ?? []).filter((id) => id !== data.series_id)
      : [...new Set([...(current.removedSeriesIds ?? []), data.series_id])];
    const nextSyllabus = { ...(current.syllabusBySeriesId ?? {}) };
    if (isCustomAdded) delete nextSyllabus[data.series_id];

    await writeCustomSeriesCatalog({
      ...current,
      syllabusBySeriesId: nextSyllabus,
      removedSeriesIds: nextRemoved,
      addedSeries: nextAdded,
    });

    await projectContent.from("test_series_overrides").upsert(
      {
        series_id: data.series_id,
        enabled: false,
        name: null,
        summary: null,
        price_inr: null,
        price_coins: null,
        sort_order: null,
        updated_by: context.userId,
      } as never,
      { onConflict: "series_id" },
    );

    return { ok: true, removed: data.series_id };
  });

export const adminRestoreTestSeries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ series_id: z.string().trim().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const current = await readCustomSeriesCatalog();
    const nextRemoved = (current.removedSeriesIds ?? []).filter((id) => id !== data.series_id);
    await writeCustomSeriesCatalog({
      ...current,
      removedSeriesIds: nextRemoved,
    });
    await projectContent.from("test_series_overrides").delete().eq("series_id", data.series_id);
    return { ok: true, restored: data.series_id };
  });

export const adminCreateCustomTestSeries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        id: z.string().trim().max(120).optional(),
        name: z.string().trim().min(3).max(160),
        examTrack: z.string().trim().min(2).max(120),
        group: z.string().trim().min(2).max(80).default("Punjab State"),
        summary: z.string().trim().min(5).max(2000),
        priceInr: z.number().int().min(0).max(100000).default(0),
        priceCoins: z.number().int().min(0).max(10000000).default(0),
        syllabus_text: z.string().trim().min(3).max(20000),
        questionsPerTest: z.number().int().min(1).max(200).optional().default(60),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const plan = parseSeriesSyllabusText(data.syllabus_text);
    if (plan.length === 0) {
      throw new Error(
        "Enter at least one Subject and Chapter (e.g. General Knowledge :: History of Punjab, Polity).",
      );
    }
    const cleanId =
      (data.id?.trim() || data.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || `custom-series-${Date.now()}`;

    const group: SeriesGroup = (SERIES_GROUPS as readonly string[]).includes(data.group)
      ? (data.group as SeriesGroup)
      : "Punjab State";

    const qPerTest = data.questionsPerTest ?? 60;
    const newSeries: PaidTestSeries = {
      id: cleanId,
      name: data.name.trim(),
      examTrack: data.examTrack.trim(),
      group,
      subjects: plan.map((p) => p.subject),
      summary: data.summary.trim(),
      priceInr: data.priceInr,
      priceCoins: data.priceCoins,
      customPlan: plan,
      questionsPerTest: qPerTest,
    };

    const current = await readCustomSeriesCatalog();
    const filteredAdded = (current.addedSeries ?? []).filter((s) => s.id !== cleanId);
    const filteredRemoved = (current.removedSeriesIds ?? []).filter((id) => id !== cleanId);
    const syllabusBySeriesId = {
      ...(current.syllabusBySeriesId ?? {}),
      [cleanId]: plan,
    };
    const questionsPerSeriesId = {
      ...(current.questionsPerSeriesId ?? {}),
      [cleanId]: qPerTest,
    };

    await writeCustomSeriesCatalog({
      ...current,
      syllabusBySeriesId,
      questionsPerSeriesId,
      removedSeriesIds: filteredRemoved,
      addedSeries: [newSeries, ...filteredAdded],
    });

    await projectContent.from("test_series_overrides").upsert(
      {
        series_id: cleanId,
        enabled: true,
        name: data.name.trim(),
        summary: data.summary.trim(),
        price_inr: data.priceInr,
        price_coins: data.priceCoins,
        sort_order: null,
        updated_by: context.userId,
      } as never,
      { onConflict: "series_id" },
    );

    const totalChapters = plan.reduce((sum, item) => sum + item.chapters.length, 0);
    return {
      ok: true,
      series: newSeries,
      subjectsCount: plan.length,
      chaptersCount: totalChapters,
      questionsPerChapter: qPerTest,
      totalAutoQuestions: totalChapters * qPerTest,
    };
  });

export const adminClearAllTestSeries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const current = await readCustomSeriesCatalog();
    await writeCustomSeriesCatalog({
      ...current,
      syllabusBySeriesId: {},
      removedSeriesIds: [],
      addedSeries: [],
      includeBuiltIn: false,
    });
    const allTests = await projectContent.from("tests").select("id");
    for (const row of allTests.data ?? []) {
      await projectContent.from("test_questions").delete().eq("test_id", row.id);
      await projectContent.from("tests").delete().eq("id", row.id);
    }
    return { ok: true };
  });

export const adminToggleBuiltInSeries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ includeBuiltIn: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const current = await readCustomSeriesCatalog();
    await writeCustomSeriesCatalog({
      ...current,
      includeBuiltIn: data.includeBuiltIn,
    });
    return { ok: true, includeBuiltIn: data.includeBuiltIn };
  });

export const adminOptimizeAndCleanServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const startMs = Date.now();
    await assertAdmin(context);
    const cacheFlush = flushProjectContentCaches();
    let cleanedAbandonedAttempts = 0;
    try {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const stale = await context.supabase
        .from("learning_attempts")
        .delete()
        .eq("status", "started")
        .lt("started_at", cutoff)
        .select("id");
      cleanedAbandonedAttempts = stale.data?.length ?? 0;
    } catch {
      // Safe fallback when learning_attempts is managed via RPC
    }
    const { document } = await readProjectDocument();
    const customCatalog = await readCustomSeriesCatalog();
    const durationMs = Math.max(1, Date.now() - startMs);
    return {
      ok: true,
      durationMs,
      clearedSelectEntries: cacheFlush.clearedSelectEntries,
      clearedMissingTables: cacheFlush.clearedMissingTables,
      cleanedAbandonedAttempts,
      counts: {
        courses: (document.tables["courses"] ?? []).length,
        lectures: (document.tables["lectures"] ?? []).length,
        materials: (document.tables["materials"] ?? []).length,
        tests: (document.tables["tests"] ?? []).length,
        questions: (document.tables["test_questions"] ?? []).length,
        customSeries: (customCatalog.addedSeries ?? []).length,
        includeBuiltIn: Boolean(customCatalog.includeBuiltIn),
      },
      optimizedAt: new Date().toISOString(),
    };
  });

const customChapterQuestionSchema = z.object({
  series_id: z.string().trim().max(120).optional().default("*"),
  subject: z.string().trim().min(1).max(120),
  chapter: z.string().trim().min(1).max(200),
  mode: z.enum(["custom_only", "custom_plus_bank"]).optional(),
  question: z.object({
    id: z.string().trim().max(120).optional(),
    question_text: z.string().trim().min(3).max(2000),
    options: z.array(z.string().trim().min(1).max(600)).min(2).max(6),
    correct_index: z.number().int().min(0).max(5),
    explanation: z.string().trim().max(4000).optional().default(""),
    difficulty: z.enum(["Easy", "Moderate", "Difficult"]).optional().default("Moderate"),
    marks: z.number().int().min(0).max(100).optional().default(1),
    negative_marks: z.number().int().min(0).max(100).optional().default(0),
  }),
});

export const adminSaveCustomChapterQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => customChapterQuestionSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const options = data.question.options.map((o) => o.trim()).filter(Boolean);
    if (options.length < 2) throw new Error("Please write at least 2 options.");
    if (data.question.correct_index >= options.length) {
      throw new Error("Please select which option is the correct answer.");
    }

    const current = await readCustomSeriesCatalog();
    const key = makeCustomChapterKey(data.series_id, data.subject, data.chapter);
    const existing: CustomChapterConfig = current.customQuestionsByChapter?.[key] ?? {
      mode: data.mode ?? "custom_plus_bank",
      questions: [],
    };
    const qId =
      data.question.id?.trim() || `cq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const nextItem: CustomChapterQuestion = {
      id: qId,
      question_text: data.question.question_text.trim(),
      options,
      correct_index: data.question.correct_index,
      explanation:
        data.question.explanation?.trim() ||
        `Correct answer is ${options[data.question.correct_index]}.`,
      difficulty: data.question.difficulty ?? "Moderate",
      marks: data.question.marks ?? 1,
      negative_marks: data.question.negative_marks ?? 0,
    };

    const hasExisting = existing.questions.some((q) => q.id === qId);
    const nextQuestions = hasExisting
      ? existing.questions.map((q) => (q.id === qId ? nextItem : q))
      : [...existing.questions, nextItem];

    const nextMap: Record<string, CustomChapterConfig> = {
      ...(current.customQuestionsByChapter ?? {}),
      [key]: {
        mode: data.mode ?? existing.mode,
        questions: nextQuestions,
      },
    };

    await writeCustomSeriesCatalog({
      ...current,
      customQuestionsByChapter: nextMap,
    });

    return { ok: true, key, totalCount: nextQuestions.length, question: nextItem };
  });

export const adminBulkImportCustomChapterQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        series_id: z.string().trim().max(120).optional().default("*"),
        subject: z.string().trim().min(1).max(120),
        chapter: z.string().trim().min(1).max(200),
        mode: z.enum(["custom_only", "custom_plus_bank"]).optional(),
        marks: z.number().int().min(0).max(100).optional().default(1),
        negative_marks: z.number().int().min(0).max(100).optional().default(0),
        text: z.string().trim().min(5),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const parsed = parseBulkMcqText(data.text);
    if (!parsed.length) {
      throw new Error(
        "No valid MCQs found. Use format:\nQ1. Your question?\nA) Option 1\nB) Option 2\nC) Option 3\nD) Option 4\nAnswer: A\nExplanation: Optional solution",
      );
    }
    const current = await readCustomSeriesCatalog();
    const key = makeCustomChapterKey(data.series_id, data.subject, data.chapter);
    const existing: CustomChapterConfig = current.customQuestionsByChapter?.[key] ?? {
      mode: data.mode ?? "custom_plus_bank",
      questions: [],
    };
    const newItems: CustomChapterQuestion[] = parsed.map((q, idx) => ({
      id: `cq-${Date.now()}-${idx + 1}-${Math.random().toString(36).slice(2, 6)}`,
      question_text: q.question_text,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation || buildFallbackExplanation(q, data.subject),
      difficulty: "Moderate",
      marks: data.marks ?? 1,
      negative_marks: data.negative_marks ?? 0,
    }));

    const nextQuestions = [...existing.questions, ...newItems];
    const nextMap: Record<string, CustomChapterConfig> = {
      ...(current.customQuestionsByChapter ?? {}),
      [key]: {
        mode: data.mode ?? existing.mode,
        questions: nextQuestions,
      },
    };

    await writeCustomSeriesCatalog({
      ...current,
      customQuestionsByChapter: nextMap,
    });

    return { ok: true, key, addedCount: newItems.length, totalCount: nextQuestions.length };
  });

export const adminSetCustomChapterMode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        series_id: z.string().trim().max(120).optional().default("*"),
        subject: z.string().trim().min(1).max(120),
        chapter: z.string().trim().min(1).max(200),
        mode: z.enum(["custom_only", "custom_plus_bank"]),
        question_count: z.number().int().min(1).max(200).nullable().optional(),
        default_questions_per_chapter: z.number().int().min(1).max(200).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const current = await readCustomSeriesCatalog();
    const key = makeCustomChapterKey(data.series_id, data.subject, data.chapter);
    const existing: CustomChapterConfig = current.customQuestionsByChapter?.[key] ?? {
      mode: data.mode,
      questions: [],
    };
    const nextConfig: CustomChapterConfig = {
      ...existing,
      mode: data.mode,
    };
    if (data.question_count === null) {
      delete nextConfig.questionCount;
    } else if (typeof data.question_count === "number") {
      nextConfig.questionCount = data.question_count;
    }
    const nextCatalog: CustomSeriesCatalog = {
      ...current,
      customQuestionsByChapter: {
        ...(current.customQuestionsByChapter ?? {}),
        [key]: nextConfig,
      },
    };
    if (typeof data.default_questions_per_chapter === "number") {
      nextCatalog.defaultQuestionsPerChapter = data.default_questions_per_chapter;
    }
    await writeCustomSeriesCatalog(nextCatalog);
    return {
      ok: true,
      key,
      mode: data.mode,
      questionCount: nextConfig.questionCount ?? nextCatalog.defaultQuestionsPerChapter ?? 60,
    };
  });

export const adminDeleteCustomChapterQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        series_id: z.string().trim().max(120).optional().default("*"),
        subject: z.string().trim().min(1).max(120),
        chapter: z.string().trim().min(1).max(200),
        question_id: z.string().trim().min(1).max(120),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const current = await readCustomSeriesCatalog();
    const key = makeCustomChapterKey(data.series_id, data.subject, data.chapter);
    const existing = current.customQuestionsByChapter?.[key];
    if (!existing) return { ok: true, totalCount: 0 };
    const nextQuestions = existing.questions.filter((q) => q.id !== data.question_id);
    const nextMap = { ...(current.customQuestionsByChapter ?? {}) };
    if (nextQuestions.length === 0 && !existing.questionCount) {
      delete nextMap[key];
    } else {
      nextMap[key] = { ...existing, questions: nextQuestions };
    }
    await writeCustomSeriesCatalog({
      ...current,
      customQuestionsByChapter: nextMap,
    });
    return { ok: true, totalCount: nextQuestions.length };
  });

export const adminClearCustomChapterQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        series_id: z.string().trim().max(120).optional().default("*"),
        subject: z.string().trim().min(1).max(120),
        chapter: z.string().trim().min(1).max(200),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const current = await readCustomSeriesCatalog();
    const key = makeCustomChapterKey(data.series_id, data.subject, data.chapter);
    const nextMap = { ...(current.customQuestionsByChapter ?? {}) };
    delete nextMap[key];
    await writeCustomSeriesCatalog({
      ...current,
      customQuestionsByChapter: nextMap,
    });
    return { ok: true };
  });

export const adminPreviewQuestionBank = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        series_id: z.string().trim().max(120).optional().default("*"),
        exam: z.string().trim().max(120).optional().default("All Exams"),
        subject: z.string().trim().min(1).max(120),
        chapter: z.string().trim().min(1).max(200),
        difficulty: z.enum(["Easy", "Moderate", "Difficult", "Mixed"]).optional().default("Mixed"),
        count: z.number().int().min(1).max(200).optional().default(30),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const customCatalog = await readCustomSeriesCatalog();
    const customConfig = getCustomChapterConfig(
      data.series_id,
      data.subject,
      data.chapter,
      customCatalog,
    );
    const configuredQuestionCount = getChapterQuestionCount(
      data.series_id,
      data.subject,
      data.chapter,
      customCatalog,
    );

    const recipe = {
      exam: data.exam || "All Exams",
      subject: data.subject,
      topic: data.chapter,
      difficulty: data.difficulty,
      count: data.count,
      marks: 1,
      negative_marks: 0,
      seed: `preview:${data.subject}:${data.chapter}`,
    };

    const templateQuestions = generateCustomSyllabusPaper(recipe);
    const cleanCustomQuestions = (customConfig?.questions ?? []).filter(
      (q) =>
        !isLegacyScienceFallbackForNonScienceSubject(q.question_text, data.subject, data.chapter),
    );

    return {
      ok: true,
      configuredQuestionCount,
      mode: customConfig?.mode ?? "custom_plus_bank",
      customQuestions: cleanCustomQuestions,
      templateQuestions: templateQuestions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        options: q.options,
        correct_index: q.correct_index,
        explanation: q.explanation,
        difficulty: q.difficulty,
        subject: q.subject,
        chapter: q.chapter,
      })),
    };
  });

function synthesizeQuestionsFromPromptAndBank(input: {
  subject: string;
  chapter: string;
  prompt: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Mixed";
  count: number;
  marks: number;
  negative_marks: number;
  existingTexts: Set<string>;
}): CustomChapterQuestion[] {
  const results: CustomChapterQuestion[] = [];
  const levels: Array<"Easy" | "Moderate" | "Difficult"> =
    input.difficulty === "Mixed" ? ["Easy", "Moderate", "Difficult"] : [input.difficulty];

  // First: if the Admin provided MCQ-like text in prompt, parse it directly
  if (input.prompt.trim().length > 10) {
    const parsedMcqs = parseBulkMcqText(input.prompt);
    for (const q of parsedMcqs) {
      const norm = q.question_text.trim().toLowerCase();
      if (!input.existingTexts.has(norm) && results.length < input.count) {
        input.existingTexts.add(norm);
        results.push({
          id: `ai-${Date.now()}-${results.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
          question_text: q.question_text,
          options: q.options.slice(0, 4),
          correct_index: q.correct_index,
          explanation: q.explanation || buildFallbackExplanation(q, input.subject),
          difficulty: levels[results.length % levels.length]!,
          marks: input.marks,
          negative_marks: input.negative_marks,
          source: "ai",
        });
      }
    }

    // Second: if prompt contains notes/sentences/key-value facts (e.g. "Objective Resolution - 13 Dec 1946" or bullet points)
    if (results.length < input.count) {
      const lines = input.prompt
        .split(/\r?\n|(?<=[.?!])\s+/)
        .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
        .filter((l) => l.length >= 12);

      const kvPairs: Array<{ left: string; right: string; raw: string }> = [];
      for (const line of lines) {
        const kvMatch = line.match(
          /^([^:—–-]{3,80})\s*(?::|—|–|-|\bis\b|\bwas\b|\bare\b)\s*(.{3,140})$/i,
        );
        if (kvMatch) {
          kvPairs.push({
            left: kvMatch[1]!.trim(),
            right: kvMatch[2]!.replace(/[.]+$/, "").trim(),
            raw: line,
          });
        }
      }

      const fallbackPool = [
        `None of the listed statements in ${input.chapter}`,
        `Unrelated administrative provision outside ${input.subject}`,
        `A repealed colonial regulation not applicable to ${input.chapter}`,
        `Only a non-binding draft proposal rejected in committee`,
      ];

      for (let i = 0; i < kvPairs.length && results.length < input.count; i++) {
        const pair = kvPairs[i]!;
        const otherRights = kvPairs
          .filter((_, idx) => idx !== i)
          .map((p) => p.right)
          .filter((r) => r.toLowerCase() !== pair.right.toLowerCase());
        const distractors = [...new Set([...otherRights, ...fallbackPool])].slice(0, 3);
        if (distractors.length === 3) {
          const correctPos = i % 4;
          const options = [...distractors];
          options.splice(correctPos, 0, pair.right);
          const qText = `In ${input.subject} (${input.chapter}), which of the following accurately describes or corresponds to "${pair.left}"?`;
          const norm = qText.toLowerCase();
          if (!input.existingTexts.has(norm)) {
            input.existingTexts.add(norm);
            results.push({
              id: `ai-${Date.now()}-${results.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
              question_text: qText,
              options,
              correct_index: correctPos,
              explanation: `${pair.left}: ${pair.right}. (${input.subject} — ${input.chapter})`,
              difficulty: levels[results.length % levels.length]!,
              marks: input.marks,
              negative_marks: input.negative_marks,
              source: "ai",
            });
          }
        }
      }
    }
  }

  // Third: fill remaining requested count using the curated & template engine for this Subject + Chapter
  if (results.length < input.count) {
    const needed = input.count - results.length;
    const isPreamble =
      input.chapter.toLowerCase().includes("preamble") ||
      input.prompt.toLowerCase().includes("preamble");
    const topicHint =
      input.prompt.trim().length > 2 && input.prompt.trim().length <= 80
        ? `${input.chapter} (${input.prompt.trim()})`
        : input.chapter;
    const recipe = {
      exam: "All Exams",
      subject: input.subject,
      topic: isPreamble ? "Preamble" : topicHint,
      difficulty: input.difficulty,
      count: Math.min(200, needed + 30),
      marks: input.marks,
      negative_marks: input.negative_marks,
      seed: `ai-gen:${Date.now()}:${input.subject}:${input.chapter}:${input.prompt.slice(0, 40)}`,
    };
    const candidates = generateCustomSyllabusPaper(recipe);

    for (const cand of candidates) {
      if (results.length >= input.count) break;
      const norm = cand.question_text.trim().toLowerCase();
      if (input.existingTexts.has(norm)) continue;
      input.existingTexts.add(norm);
      results.push({
        id: `ai-${Date.now()}-${results.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
        question_text: cand.question_text,
        options: cand.options.slice(0, 4),
        correct_index: cand.correct_index,
        explanation: cand.explanation,
        difficulty: cand.difficulty,
        marks: input.marks,
        negative_marks: input.negative_marks,
        source: "ai",
      });
    }
  }

  return results;
}

export const adminGenerateAiChapterQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        series_id: z.string().trim().max(120).optional().default("*"),
        subject: z.string().trim().min(1).max(120),
        chapter: z.string().trim().min(1).max(200),
        prompt: z.string().trim().max(20000).optional().default(""),
        count: z.number().int().min(1).max(60).optional().default(10),
        difficulty: z.enum(["Easy", "Moderate", "Difficult", "Mixed"]).optional().default("Mixed"),
        marks: z.number().int().min(0).max(100).optional().default(1),
        negative_marks: z.number().int().min(0).max(100).optional().default(0),
        mode: z.enum(["custom_only", "custom_plus_bank"]).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const current = await readCustomSeriesCatalog();
    const key = makeCustomChapterKey(data.series_id, data.subject, data.chapter);
    const existing: CustomChapterConfig = current.customQuestionsByChapter?.[key] ?? {
      mode: data.mode ?? "custom_plus_bank",
      questions: [],
    };
    const existingTexts = new Set(
      existing.questions.map((q) => q.question_text.trim().toLowerCase()),
    );

    let aiQuestions: CustomChapterQuestion[] = [];
    let usedProvider: "gemini" | "smart-synthesizer" = "smart-synthesizer";

    // Try Gemini API first if a key is configured in env or private_settings
    let geminiKey = process.env["GEMINI_API_KEY"] || "";
    if (!geminiKey) {
      const keyRow = await projectContent
        .from("private_settings")
        .select("value")
        .eq("key", "ai_gemini_api_key")
        .maybeSingle();
      geminiKey = keyRow.data?.value || "";
    }

    if (geminiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Generate exactly ${data.count} high-yield exam multiple-choice questions (MCQs) in JSON array format for Subject: "${data.subject}", Chapter/Topic: "${data.chapter}", Difficulty: "${data.difficulty}". ${data.prompt ? `Focus / Notes: ${data.prompt}` : ""}\nReturn ONLY a JSON array of objects with keys: "question_text" (string), "options" (array of 4 distinct strings), "correct_index" (integer 0-3), "explanation" (string), "difficulty" ("Easy" | "Moderate" | "Difficult").`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                responseMimeType: "application/json",
              },
            }),
          },
        );
        if (res.ok) {
          const json = (await res.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const rawText =
            json.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n") || "[]";
          const cleaned = rawText.replace(/^```json\s*|\s*```$/g, "").trim();
          const parsed = JSON.parse(cleaned) as Array<{
            question_text?: string;
            options?: string[];
            correct_index?: number;
            explanation?: string;
            difficulty?: "Easy" | "Moderate" | "Difficult";
          }>;
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              if (
                item.question_text &&
                Array.isArray(item.options) &&
                item.options.length === 4 &&
                typeof item.correct_index === "number" &&
                item.correct_index >= 0 &&
                item.correct_index < 4
              ) {
                const norm = item.question_text.trim().toLowerCase();
                if (!existingTexts.has(norm) && aiQuestions.length < data.count) {
                  existingTexts.add(norm);
                  aiQuestions.push({
                    id: `ai-${Date.now()}-${aiQuestions.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
                    question_text: item.question_text.trim(),
                    options: item.options.map((o) => String(o).trim()),
                    correct_index: item.correct_index,
                    explanation:
                      item.explanation?.trim() ||
                      `Verified answer: ${item.options[item.correct_index]}`,
                    difficulty: item.difficulty || "Moderate",
                    marks: data.marks ?? 1,
                    negative_marks: data.negative_marks ?? 0,
                    source: "ai",
                  });
                }
              }
            }
            if (aiQuestions.length > 0) usedProvider = "gemini";
          }
        }
      } catch {
        // Fallback to smart synthesizer below
      }
    }

    if (aiQuestions.length < data.count) {
      const synthesized = synthesizeQuestionsFromPromptAndBank({
        subject: data.subject,
        chapter: data.chapter,
        prompt: data.prompt || "",
        difficulty: data.difficulty,
        count: data.count - aiQuestions.length,
        marks: data.marks ?? 1,
        negative_marks: data.negative_marks ?? 0,
        existingTexts,
      });
      aiQuestions = [...aiQuestions, ...synthesized];
    }

    const nextQuestions = [...existing.questions, ...aiQuestions];
    const nextMap: Record<string, CustomChapterConfig> = {
      ...(current.customQuestionsByChapter ?? {}),
      [key]: {
        ...existing,
        mode: data.mode ?? existing.mode,
        questions: nextQuestions,
      },
    };

    await writeCustomSeriesCatalog({
      ...current,
      customQuestionsByChapter: nextMap,
    });

    return {
      ok: true,
      key,
      provider: usedProvider,
      generatedCount: aiQuestions.length,
      totalCount: nextQuestions.length,
      questions: aiQuestions,
    };
  });

/** One-time adoption; source IDs are stable, and existing admin edits win on retries. */
export const adoptBuiltInMaterials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { builtInMaterials } = await import("@/lib/builtin-materials.server");
    const flag = await projectContent
      .from("site_settings")
      .select("value")
      .eq("key", "builtin_materials_adopted")
      .maybeSingle();
    if (flag.error) throw new Error(flag.error.message);

    const ids = new Set(
      unwrap(await projectContent.from("materials").select("id")).map((row) => row.id),
    );
    const samples = builtInMaterials().filter((row) => !ids.has(row.id));
    for (let i = 0; i < samples.length; i += 5) {
      const rows = await Promise.all(
        samples.slice(i, i + 5).map(async (row) => ({
          ...row,
          description: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          content_deleted_at: null,
          ...(await storeNoteBody(row.id, row.description)),
        })),
      );
      const { isLocalManagedFixture } = await import("./managed-content-tables");
      if (isLocalManagedFixture("materials", process.env)) {
        const result = await projectContent.from("materials").upsert(rows, { onConflict: "id" });
        if (result.error) throw new Error(result.error.message);
      } else {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const result = await supabaseAdmin.rpc("restore_storage_sample_notes", {
          p_actor: context.userId,
          p_rows: rows,
        });
        if (result.error) throw new Error(`${result.error.message}. Run CONTENT-RESET SQL setup.`);
        const { flushProjectContentCaches } = await import("./project-content.server");
        flushProjectContentCaches();
      }
    }
    const saved = await projectContent
      .from("site_settings")
      .upsert({ key: "builtin_materials_adopted", value: "true" }, { onConflict: "key" });
    if (saved.error) throw new Error(saved.error.message);
    return { ok: true };
  });
