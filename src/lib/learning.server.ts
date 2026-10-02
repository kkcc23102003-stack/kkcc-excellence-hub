import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DB,
  TestRow,
  TestQuestionRow,
  CourseEnrollmentRow,
  TestAccessGrantRow,
  SeriesAccessGrantRow,
} from "@/integrations/supabase/db";
import { projectContent } from "@/lib/project-content.server";
import { LEARNING_SERIES, seriesPlan } from "@/lib/test-series-catalog";
import {
  canonicalSeriesId,
  seriesAliases,
  isCurrentEnrollment,
  isCurrentGrant,
  assertSelection,
} from "@/lib/learning-access";
import { ACTIVE_TEMPLATES, getExamBankTopicsForExam } from "@/lib/exam-bank";
import { generateOnDemandTestPaper } from "@/lib/generated-test";

export type StudentContext = { supabase: SupabaseClient<DB>; userId: string };
export function unwrap<T>(result: { data: T; error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}
export async function assertAdmin(context: StudentContext) {
  if (!unwrap(await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" })))
    throw new Error("Forbidden — admin access required");
}
export async function findStudent(
  context: StudentContext,
  payload: { user_id?: string | undefined; email?: string | undefined },
) {
  if (payload.user_id) {
    const row = unwrap(
      await context.supabase.from("profiles").select("*").eq("id", payload.user_id).maybeSingle(),
    );
    if (!row) throw new Error("Student profile not found. Ask the student to sign up first.");
    if (payload.email && row.email.toLowerCase() !== payload.email.toLowerCase())
      throw new Error("Selected student ID and email do not match.");
    return row;
  }
  const email = payload.email?.trim().toLowerCase();
  if (!email) throw new Error("Select a student or enter their email.");
  // eq, not ilike: underscores and percent signs in email must not act as wildcards.
  const rows = unwrap(
    await context.supabase
      .from("profiles")
      .select("*")
      .ilike("email", email.replace(/[%_]/g, "\\$&")),
  );
  const row = (rows ?? []).find((profile) => profile.email.trim().toLowerCase() === email);
  if (!row) throw new Error(`No student account found for ${email}. Ask them to sign up first.`);
  return row;
}
export type StudentAccess = {
  user_id: string;
  is_admin: boolean;
  course_ids: string[];
  test_ids: string[];
  series_ids: string[];
  series_aliases: Record<string, string | null>;
  enrollments: CourseEnrollmentRow[];
  test_grants: TestAccessGrantRow[];
  series_grants: SeriesAccessGrantRow[];
};
export async function readStudentAccess(context: StudentContext): Promise<StudentAccess> {
  const [enrollmentsResult, testsResult, seriesResult, roleResult, aliasesResult] =
    await Promise.all([
      context.supabase
        .from("course_enrollments")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("test_access_grants")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("series_access_grants")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false }),
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
      projectContent.from("test_series_overrides").select("*"),
    ]);
  const aliases = seriesAliases(unwrap(aliasesResult));
  const enrollments = (unwrap(enrollmentsResult) ?? []).filter((enrollment) =>
    isCurrentEnrollment(enrollment),
  );
  const test_grants = (unwrap(testsResult) ?? []).filter((grant) => isCurrentGrant(grant));
  const series_grants = (unwrap(seriesResult) ?? [])
    .filter((grant) => isCurrentGrant(grant))
    .map((grant) => ({
      ...grant,
      series_id: canonicalSeriesId(grant.series_id, aliases) ?? grant.series_id,
    }));
  return {
    user_id: context.userId,
    series_aliases: aliases,
    is_admin: Boolean(unwrap(roleResult)),
    course_ids: [...new Set(enrollments.map((enrollment) => enrollment.course_id))],
    test_ids: [...new Set(test_grants.map((grant) => grant.test_id))],
    series_ids: [...new Set(series_grants.map((grant) => grant.series_id))],
    enrollments,
    test_grants,
    series_grants,
  };
}
export function testPermission(test: TestRow, access: StudentAccess) {
  if (!test.is_published) return { allowed: false, reason: "missing" as const };
  if (access.is_admin) return { allowed: true, reason: "admin" as const };
  if (access.test_ids.includes(test.id)) return { allowed: true, reason: "granted" as const };
  if (test.course_id && access.course_ids.includes(test.course_id))
    return { allowed: true, reason: "course_granted" as const };
  const series = canonicalSeriesId(test.series_name, access.series_aliases);
  if (series && access.series_ids.includes(series))
    return { allowed: true, reason: "series_granted" as const };
  return { allowed: !test.is_paid, reason: test.is_paid ? ("locked" as const) : ("free" as const) };
}
export async function effectiveSeries(id: string) {
  const canonical = canonicalSeriesId(id);
  const series = LEARNING_SERIES.find((item) => item.id === canonical);
  if (!series) throw new Error("Test series not found.");
  const override = unwrap(
    await projectContent
      .from("test_series_overrides")
      .select("*")
      .eq("series_id", series.id)
      .maybeSingle(),
  );
  return {
    ...series,
    name: override?.name ?? series.name,
    summary: override?.summary ?? series.summary,
    priceInr: override?.price_inr ?? series.priceInr,
    priceCoins: override?.price_coins ?? series.priceCoins,
    enabled: override?.enabled ?? true,
  };
}
export async function seriesPermission(id: string, access: StudentAccess) {
  const series = await effectiveSeries(id);
  const enrolled = access.series_ids.includes(series.id);
  const allowed =
    access.is_admin ||
    enrolled ||
    (series.enabled && series.priceInr <= 0 && series.priceCoins <= 0);
  return { allowed, series, enrolled };
}
export type LearningSelection = {
  series_id?: string | undefined;
  test_id?: string | undefined;
  subject?: string | undefined;
  chapter?: string | undefined;
};

/** Preserves manual questions and uses their original subject/chapter metadata. */
export async function individualTestPlan(test: TestRow) {
  if (test.question_source === "deterministic") {
    const exam = resolveTestExam(test);
    const availableSubjects = allExamSubjects(exam);
    const subjects = test.generation_subject
      ? [test.generation_subject]
      : availableSubjects.includes(test.subject)
        ? [test.subject]
        : availableSubjects;
    return subjects
      .map((subject) => {
        const topics = getExamBankTopicsForExam(subject, exam);
        return {
          subject,
          chapters:
            test.generation_topic && test.generation_topic !== "Mixed"
              ? topics.filter((topic) => topic === test.generation_topic)
              : topics,
        };
      })
      .filter((item) => item.chapters.length > 0);
  }
  const questions = unwrap(
    await projectContent
      .from("test_questions")
      .select("*")
      .eq("test_id", test.id)
      .order("sort_order"),
  );
  const plan = new Map<string, Set<string>>();
  for (const question of questions) {
    const subject = question.subject || test.subject || "General";
    const chapter = (question as TestQuestionRow & { chapter?: string }).chapter || "Complete Test";
    if (!plan.has(subject)) plan.set(subject, new Set());
    plan.get(subject)!.add(chapter);
  }
  return [...plan].map(([subject, chapters]) => ({ subject, chapters: [...chapters] }));
}
export function resolveTestExam(test: TestRow) {
  return test.question_source === "deterministic" &&
    test.generation_exam &&
    test.generation_exam !== "All Exams"
    ? test.generation_exam
    : test.exam_track || test.generation_exam || "All Exams";
}
export async function learningPlan(context: StudentContext, selection: LearningSelection) {
  const access = await readStudentAccess(context);
  if (selection.test_id) {
    const test = unwrap(
      await projectContent.from("tests").select("*").eq("id", selection.test_id).maybeSingle(),
    );
    if (!test) throw new Error("Test not found.");
    if (!testPermission(test, access).allowed) throw new Error("TEST_ACCESS_REQUIRED");
    if (selection.series_id) {
      const selectedSeries = await effectiveSeries(selection.series_id);
      if (canonicalSeriesId(test.series_name, access.series_aliases) !== selectedSeries.id)
        throw new Error("This test does not belong to the selected series.");
    }
    return {
      kind: "test" as const,
      id: test.id,
      title: test.title,
      exam: resolveTestExam(test),
      series_id: canonicalSeriesId(test.series_name, access.series_aliases),
      plan: await individualTestPlan(test),
      test,
      access,
    };
  }
  if (!selection.series_id) throw new Error("Select a test or test series.");
  const permission = await seriesPermission(selection.series_id, access);
  if (!permission.allowed) throw new Error("SERIES_ACCESS_REQUIRED");
  return {
    kind: "series" as const,
    id: permission.series.id,
    title: permission.series.name,
    exam: permission.series.examTrack,
    series_id: permission.series.id,
    plan: seriesPlan(permission.series),
    test: null,
    access,
  };
}
export async function buildSelectedPaper(
  context: StudentContext,
  selection: LearningSelection,
  seed: string,
) {
  const learning = await learningPlan(context, selection);
  if (!selection.subject || !selection.chapter)
    throw new Error("Select Subject and Select Chapter before starting.");
  assertSelection(learning.plan, selection.subject, selection.chapter);
  if (learning.test?.question_source === "manual") {
    const test = learning.test;
    const rows = unwrap(
      await projectContent
        .from("test_questions")
        .select("*")
        .eq("test_id", test.id)
        .order("sort_order"),
    );
    const questions = rows.filter(
      (question) =>
        (question.subject || test.subject || "General") === selection.subject &&
        ((question as TestQuestionRow & { chapter?: string }).chapter || "Complete Test") ===
          selection.chapter,
    );
    if (!questions.length) throw new Error("No published questions exist for this test selection.");
    return {
      test: {
        ...test,
        questions_count: questions.length,
        total_marks: questions.reduce((sum, question) => sum + question.marks, 0),
      },
      questions,
    };
  }
  const recipe = learning.test;
  const questions = generateOnDemandTestPaper({
    exam: learning.exam,
    subject: selection.subject,
    topic: selection.chapter,
    difficulty: recipe?.generation_difficulty || "Mixed",
    count: recipe?.generation_count || 60,
    marks: recipe?.generation_marks ?? 1,
    negative_marks: recipe?.generation_negative_marks ?? 0,
    seed,
  });
  if (!questions.length)
    throw new Error(
      `Question coverage is missing for ${learning.exam} / ${selection.subject} / ${selection.chapter}. No unrelated questions have been substituted.`,
    );
  const now = new Date().toISOString();
  const test: TestRow = recipe ?? {
    id: `series:${learning.id}`,
    course_id: null,
    lecture_id: null,
    title: `${selection.subject} — ${selection.chapter}`,
    instructions:
      "Practice questions from the existing project bank. Easy → Moderate → Difficult. Actual available question count is shown; no questions are invented to fill a paper.",
    subject: selection.subject,
    duration_minutes: 60,
    question_timer_seconds: 0,
    timer_mode: "test",
    questions_count: questions.length,
    total_marks: questions.length,
    is_published: true,
    sort_order: 0,
    exam_track: learning.exam,
    level: "Mixed",
    series_name: learning.id,
    is_paid: true,
    price_inr: 0,
    price_coins: 0,
    question_source: "deterministic",
    generation_exam: learning.exam,
    generation_subject: selection.subject,
    generation_topic: selection.chapter,
    generation_difficulty: "Mixed",
    generation_count: questions.length,
    created_at: now,
    updated_at: now,
  };
  return {
    test: {
      ...test,
      questions_count: questions.length,
      total_marks: questions.reduce((sum, question) => sum + question.marks, 0),
    },
    questions,
  };
}
export function allExamSubjects(exam: string) {
  return [
    ...new Set(
      ACTIVE_TEMPLATES.filter((template) => template.count > 0 && template.exams.includes(exam)).map(
        (template) => template.subject,
      ),
    ),
  ].sort();
}
