import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { DB as Database } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";
import { createSandboxSupabaseClient } from "@/integrations/supabase/sandbox-database";
import { isSandboxPreviewAvailable } from "@/integrations/supabase/sandbox";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { protectVideoUrl } from "@/lib/video";

function publicClient() {
  const config = getSupabasePublicConfig();
  if (!config) {
    return import.meta.env.DEV && isSandboxPreviewAvailable()
      ? createSandboxSupabaseClient()
      : null;
  }

  return createClient<Database>(config.url, config.publishableKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: createSupabaseFetch(config.publishableKey),
    },
  });
}

/** Public reads must never blank the site: if the backend is unreachable, degrade gracefully. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[content] public read failed", error);
    return fallback;
  }
}

type Row<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

function protectLectureVideoUrls(lectures: Row<"lectures">[] | null | undefined) {
  return (lectures ?? []).map((lecture) => ({
    ...lecture,
    video_url: protectVideoUrl(lecture.video_url),
  }));
}

function protectMaterialFileUrls(materials: Row<"materials">[] | null | undefined) {
  return (materials ?? []).map((material) => ({
    ...material,
    file_url: material.access_type === "free" ? material.file_url : null,
  }));
}

async function loadPublicMaterialRows(
  supabase: NonNullable<ReturnType<typeof publicClient>>,
  courseId: string | null,
) {
  const { data, error } = await supabase.rpc("list_public_materials", { _course_id: courseId });
  if (!error) return (data ?? []) as Row<"materials">[];

  // Graceful compatibility for a live project where the URL-masking migration has
  // not been executed yet. The app-side mask below still keeps private URLs out of
  // public server responses; the migration closes direct PostgREST reads.
  let fallback = supabase
    .from("materials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (courseId) fallback = fallback.eq("course_id", courseId);

  const { data: fallbackData, error: fallbackError } = await fallback.limit(500);
  if (fallbackError) throw new Error(fallbackError.message);
  return (fallbackData ?? []) as Row<"materials">[];
}

export type PublicPlatformStats = {
  studentsJoined: number;
  activeStudents: number;
  publishedCourses: number;
  publishedLectures: number;
  publishedMaterials: number;
  publishedTests: number;
};

export const EMPTY_PUBLIC_PLATFORM_STATS: PublicPlatformStats = {
  studentsJoined: 0,
  activeStudents: 0,
  publishedCourses: 0,
  publishedLectures: 0,
  publishedMaterials: 0,
  publishedTests: 0,
};

function toNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normaliseStats(row: Record<string, unknown> | null | undefined): PublicPlatformStats {
  return {
    studentsJoined: toNumber(row?.["students_joined"]),
    activeStudents: toNumber(row?.["active_students"]),
    publishedCourses: toNumber(row?.["published_courses"]),
    publishedLectures: toNumber(row?.["published_lectures"]),
    publishedMaterials: toNumber(row?.["published_materials"]),
    publishedTests: toNumber(row?.["published_tests"]),
  };
}

export const listPublishedCourses = createServerFn({ method: "GET" }).handler(async () =>
  safe<Row<"courses">[]>(async () => {
    const supabase = publicClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  }, []),
);

export const getCourseDetail = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ slug: z.string().max(120) }).parse(input))
  .handler(async ({ data }) =>
    safe<{
      course: Row<"courses">;
      lectures: Row<"lectures">[];
      materials: Row<"materials">[];
    } | null>(async () => {
      const supabase = publicClient();
      if (!supabase) return null;

      const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", data.slug)
        .eq("status", "published")
        .maybeSingle();
      if (!course) return null;

      const [{ data: lectures, error: lecturesError }, materials] = await Promise.all([
        supabase
          .from("lectures")
          .select("*")
          .eq("course_id", course.id)
          .order("sort_order", { ascending: true }),
        loadPublicMaterialRows(supabase, course.id),
      ]);
      if (lecturesError) throw new Error(lecturesError.message);

      const publicLectures =
        Number(course.price) <= 0
          ? lectures
          : (lectures ?? []).filter((lecture) => lecture.is_free);
      return {
        course,
        lectures: protectLectureVideoUrls(publicLectures ?? []),
        materials: protectMaterialFileUrls(materials),
      };
    }, null),
  );

export const getMyCourseLearningDeck = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ slug: z.string().trim().min(1).max(140) }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: course, error: courseError } = await context.supabase
      .from("courses")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (courseError) throw new Error(courseError.message);
    if (!course) throw new Error("Course not found.");

    let hasAccess = Number(course.price) <= 0;
    if (!hasAccess) {
      const { data: enrollment, error: enrollmentError } = await context.supabase
        .from("course_enrollments")
        .select("id,status,expires_at")
        .eq("user_id", context.userId)
        .eq("course_id", course.id)
        .maybeSingle();
      if (enrollmentError) throw new Error(enrollmentError.message);
      hasAccess = Boolean(
        enrollment?.status === "active" &&
        (!enrollment.expires_at || new Date(enrollment.expires_at).getTime() > Date.now()),
      );
    }

    const { data: lectures, error: lecturesError } = await context.supabase
      .from("lectures")
      .select("*")
      .eq("course_id", course.id)
      .order("sort_order", { ascending: true });
    if (lecturesError) throw new Error(lecturesError.message);

    const visibleLectures = hasAccess
      ? (lectures ?? [])
      : ((lectures ?? []) as Row<"lectures">[]).filter((lecture) => lecture.is_free);

    return {
      course,
      lectures: protectLectureVideoUrls(visibleLectures),
      has_access: hasAccess,
    };
  });

export const listPublicMaterials = createServerFn({ method: "GET" }).handler(async () =>
  safe<Row<"materials">[]>(async () => {
    const supabase = publicClient();
    if (!supabase) return [];

    const data = await loadPublicMaterialRows(supabase, null);
    return protectMaterialFileUrls(data).slice(0, 500);
  }, []),
);

export const listPublicLectures = createServerFn({ method: "GET" }).handler(async () =>
  safe<Row<"lectures">[]>(async () => {
    const supabase = publicClient();
    if (!supabase) return [];

    const [lecturesResult, coursesResult] = await Promise.all([
      supabase.from("lectures").select("*").order("sort_order", { ascending: true }).limit(1000),
      supabase.from("courses").select("*").eq("status", "published").limit(500),
    ]);
    if (lecturesResult.error) throw new Error(lecturesResult.error.message);
    if (coursesResult.error) throw new Error(coursesResult.error.message);

    const freeCourseIds = new Set(
      ((coursesResult.data ?? []) as Row<"courses">[])
        .filter((course) => Number(course.price) <= 0)
        .map((course) => course.id),
    );
    const publicLectures = ((lecturesResult.data ?? []) as Row<"lectures">[]).filter(
      (lecture) => lecture.is_free || freeCourseIds.has(lecture.course_id),
    );
    return protectLectureVideoUrls(publicLectures);
  }, []),
);

export const listPublicTests = createServerFn({ method: "GET" }).handler(async () =>
  safe<Row<"tests">[]>(async () => {
    const supabase = publicClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(300);
    if (error) throw new Error(error.message);
    return data ?? [];
  }, []),
);

export const getPublicTest = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ id: z.string().max(64) }).parse(input))
  .handler(async ({ data }) =>
    safe<{
      test: Row<"tests">;
      questions: Row<"test_questions">[];
      locked: boolean;
      generationError?: string;
    } | null>(async () => {
      const supabase = publicClient();
      if (!supabase) return null;

      const { data: test } = await supabase
        .from("tests")
        .select("*")
        .eq("id", data.id)
        .eq("is_published", true)
        .maybeSingle();
      if (!test) return null;

      // A paid paper never hands its questions to the public client. The
      // signed-in route asks getTestForAttempt instead, which checks access.
      if (test.is_paid) return { test, questions: [], locked: true };

      if (test.question_source === "deterministic") {
        const { generateOnDemandTestPaper, QuestionBankCoverageError } =
          await import("@/lib/generated-test");
        try {
          const generated = generateOnDemandTestPaper({
            exam: test.generation_exam || test.exam_track || "All Exams",
            subject: test.generation_subject || test.subject || "General",
            topic: test.generation_topic || "Mixed",
            difficulty: test.generation_difficulty || "Difficult",
            count: test.generation_count || test.questions_count || 0,
            marks: Math.max(
              0,
              Math.round((test.total_marks || 0) / Math.max(1, test.questions_count || 1)),
            ),
            negative_marks: 0,
          });
          return { test, questions: generated as never, locked: false };
        } catch (error) {
          if (error instanceof QuestionBankCoverageError) {
            return {
              test,
              questions: [],
              locked: false,
              generationError: error.message,
            };
          }
          throw error;
        }
      }

      const { data: questions, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_id", test.id)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return { test, questions: questions ?? [], locked: false };
    }, null),
  );

export const getPublicPlatformStats = createServerFn({ method: "GET" }).handler(async () =>
  safe<PublicPlatformStats>(async () => {
    const supabase = publicClient();
    if (!supabase) return EMPTY_PUBLIC_PLATFORM_STATS;

    const { data, error } = await supabase.rpc("get_public_platform_stats");
    if (error) throw new Error(error.message);

    const row = Array.isArray(data) ? data[0] : data;
    return normaliseStats(row as Record<string, unknown> | null | undefined);
  }, EMPTY_PUBLIC_PLATFORM_STATS),
);

/**
 * Admin overrides for the code-defined test series catalogue.
 *
 * Public on purpose: a series an admin has hidden must disappear for
 * students, and a price an admin has changed must be the price they see.
 * An absent row means the code values stand, so this returning an empty
 * list is a perfectly good outcome.
 */
export const listSeriesOverrides = createServerFn({ method: "GET" }).handler(async () =>
  safe<Row<"test_series_overrides">[]>(async () => {
    const supabase = publicClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from("test_series_overrides").select("*").limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  }, []),
);
