import { getExamBankExams, getExamBankTopicsForExam } from "@/lib/exam-bank";
import { allExamSubjects, unwrap } from "@/lib/learning.server";
import { projectContent } from "@/lib/project-content.server";
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
  id: z.string().uuid().optional(),
  course_id: z.string().uuid().nullable().optional(),
  lecture_id: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(4000).optional(),
  subject: z.string().trim().max(80),
  chapter: z.string().trim().max(120),
  module_title: z.string().trim().max(160).optional(),
  batch: z.string().trim().max(120).optional(),
  material_type: z.string().trim().max(60),
  class_level: z.string().trim().max(60),
  pages: z.number().int().min(0).max(10000),
  file_url: z.string().trim().max(4000).nullable().optional(),
  thumbnail_url: z.string().trim().max(4000).nullable().optional(),
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
      materials: materials ?? [],
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
    const previousPublished = id
      ? Boolean(
          (await projectContent.from("materials").select("is_published").eq("id", id).maybeSingle())
            .data?.is_published,
        )
      : false;
    const payload = clean({ ...rest, updated_at: new Date().toISOString() });
    const { data: row, error } = id
      ? await projectContent
          .from("materials")
          .update(payload as never)
          .eq("id", id)
          .select("*")
          .single()
      : await projectContent
          .from("materials")
          .insert(payload as never)
          .select("*")
          .single();
    if (error) throw new Error(error.message);
    await sendMaterialNotification(context, row, previousPublished);
    return row;
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

const testSchema = z.object({
  id: z.string().uuid().optional(),
  course_id: z.string().uuid().nullable().optional(),
  lecture_id: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(2).max(200),
  instructions: z.string().trim().max(4000),
  subject: z.string().trim().max(80),
  duration_minutes: z.number().int().min(0).max(1000),
  question_timer_seconds: z.number().int().min(0).max(7200).default(0),
  timer_mode: z.enum(["test", "question", "unlimited"]).default("test"),
  questions_count: z.number().int().min(0).max(1000),
  total_marks: z.number().int().min(0).max(10000),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0).max(10000),
  // Paid test series fields. Every test states the exam it is oriented for
  // and which rung of the Easy/Moderate/Difficult ladder it sits on.
  exam_track: z.string().trim().max(80).default(""),
  level: z.enum(["Easy", "Moderate", "Difficult", "Mixed"]).default("Mixed"),
  series_name: z.string().trim().max(120).default(""),
  is_paid: z.boolean().default(false),
  price_inr: z.number().int().min(0).max(100000).default(0),
  price_coins: z.number().int().min(0).max(1000000).default(0),
  question_source: z.enum(["manual", "deterministic"]).default("manual"),
  generation_exam: z.string().trim().max(80).default("All Exams"),
  generation_subject: z.string().trim().max(80).default(""),
  generation_topic: z.string().trim().max(160).default("Mixed"),
  generation_difficulty: z.enum(["Easy", "Moderate", "Difficult", "Mixed"]).default("Difficult"),
  generation_count: z.number().int().min(0).max(1000).default(0),
});

export const saveTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => testSchema.parse(input))
  .handler(async ({ data, context }) => {
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
      const exam =
        data.generation_exam && data.generation_exam !== "All Exams"
          ? data.generation_exam
          : data.exam_track || data.generation_exam;
      if (exam !== "All Exams" && !getExamBankExams().includes(exam))
        throw new Error(
          "This exam has no exact supported question-bank mapping. No other exam will be substituted.",
        );
      if (data.generation_count < 1)
        throw new Error("Choose a positive question target before publishing.");
      const subjects = data.generation_subject ? [data.generation_subject] : allExamSubjects(exam);
      if (
        !subjects.some((subject) => {
          const topics = getExamBankTopicsForExam(subject, exam);
          return data.generation_topic === "Mixed"
            ? topics.length > 0
            : topics.includes(data.generation_topic);
        })
      )
        throw new Error("No mapped subject/chapter questions are available for this recipe.");
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
          (await projectContent.from("tests").select("is_published").eq("id", id).maybeSingle())
            .data?.is_published,
        )
      : false;
    const payload = clean({ ...rest, updated_at: new Date().toISOString() });
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
    return data ?? [];
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

function optionIndex(value: string) {
  const trimmed = value.trim();
  if (/^[A-D]$/i.test(trimmed)) return trimmed.toUpperCase().charCodeAt(0) - 65;
  if (/^[1-4]$/.test(trimmed)) return Number(trimmed) - 1;
  return -1;
}

function cleanQuestionText(value: string) {
  return value.replace(/^\s*(?:q\s*)?\d+\s*[).:-]\s*/i, "").trim();
}

function buildFallbackExplanation(question: ParsedMcq, subject: string) {
  const correctOption = question.options[question.correct_index] ?? "the marked option";
  return `Correct answer is ${correctOption}. This ${subject || "exam"} question is solved by matching the question statement with the correct concept and eliminating the other options. Review the topic once more for stronger retention.`;
}

function parseMcqText(text: string): ParsedMcq[] {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const questions: ParsedMcq[] = [];
  let current: {
    question: string[];
    options: string[];
    answerRaw: string;
    explanation: string[];
    mode: "question" | "option" | "explanation";
  } | null = null;

  const flush = () => {
    if (!current) return;
    const question_text = current.question.join(" ").trim();
    const options = current.options.map((option) => option.trim()).filter(Boolean);
    let correct_index = optionIndex(current.answerRaw);
    if (correct_index < 0 && current.answerRaw) {
      const answerText = current.answerRaw.toLowerCase();
      correct_index = options.findIndex((option) => option.toLowerCase() === answerText);
    }
    if (
      question_text &&
      options.length >= 2 &&
      correct_index >= 0 &&
      correct_index < options.length
    ) {
      questions.push({
        question_text,
        options,
        correct_index,
        explanation: current.explanation.join(" ").trim(),
      });
    }
    current = null;
  };

  for (const line of lines) {
    const questionMatch = line.match(/^\s*(?:q\s*)?\d+\s*[).:-]\s*(.+)$/i);
    const optionMatch = line.match(/^\s*(?:\(?([A-Da-d])\)?|([1-4]))\s*[).:-]\s*(.+)$/);
    const answerMatch = line.match(/^\s*(?:answer|ans|correct(?:\s*answer)?)\s*[:-]\s*(.+)$/i);
    const explanationMatch = line.match(/^\s*(?:explanation|solution)\s*[:-]\s*(.*)$/i);

    if (questionMatch && (!current || current.options.length > 0 || current.answerRaw)) {
      flush();
      current = {
        question: [questionMatch[1]?.trim() ?? ""],
        options: [],
        answerRaw: "",
        explanation: [],
        mode: "question",
      };
      continue;
    }

    if (!current) {
      current = {
        question: [cleanQuestionText(line)],
        options: [],
        answerRaw: "",
        explanation: [],
        mode: "question",
      };
      continue;
    }

    if (questionMatch && current.options.length === 0 && !current.answerRaw) {
      current.question.push(questionMatch[1]?.trim() ?? "");
      continue;
    }

    if (optionMatch) {
      current.options.push((optionMatch[3] ?? "").trim());
      current.mode = "option";
      continue;
    }

    if (answerMatch) {
      current.answerRaw = (answerMatch[1] ?? "").trim();
      current.mode = "explanation";
      continue;
    }

    if (explanationMatch) {
      current.explanation.push((explanationMatch[1] ?? "").trim());
      current.mode = "explanation";
      continue;
    }

    if (current.mode === "option" && current.options.length > 0) {
      current.options[current.options.length - 1] += ` ${line}`;
    } else if (current.mode === "explanation") {
      current.explanation.push(line);
    } else {
      current.question.push(cleanQuestionText(line));
    }
  }

  flush();
  return questions;
}

export const createTestFromMcqText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => mcqImportSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const questions = parseMcqText(data.text);
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
  sort_order: z.number().int().min(0).max(10000).default(0),
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
    return row;
  });

export const deleteTestQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await projectContent.from("test_questions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Persist a new display order after drag/move in the editor. */
export const reorderTestQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        test_id: z.string().uuid(),
        ids: z.array(z.string().uuid()).max(1000),
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
        sort_order: z.number().int().min(0).max(10000).nullable().optional(),
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

    // IMPORTANT: this no longer generates/inserts question rows. It only saves
    // the small generation recipe on the test. Students get a fresh paper on
    // every open from the deterministic bank, and the generated MCQs vanish
    // after that request.
    const { data: test, error: testError } = await projectContent
      .from("tests")
      .select("id")
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
