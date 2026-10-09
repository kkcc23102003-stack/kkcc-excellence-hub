import { materialAccessMode } from "./material-access-mode";
import { readNoteBody, mapNoteBodyReads } from "./note-body.server";
import { isFreeCourse } from "@/lib/cms";
import { resolveContentUrl, resolveNoteImages } from "@/lib/content-storage.server";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { DB as Database } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { projectContent } from "@/lib/project-content.server";
import { readCustomSeriesCatalog } from "@/lib/learning.server";
import { protectVideoUrl } from "@/lib/video";
import { isCurrentEnrollment } from "@/lib/learning-access";

function publicStudentClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;
  return createClient<Database>(config.url, config.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: createSupabaseFetch(config.publishableKey) },
  });
}
type Row<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
function unwrap<T>(result: { data: T; error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}
async function protectLectures(lectures: Row<"lectures">[]) {
  return Promise.all(
    lectures.map(async (lecture) => ({
      ...lecture,
      video_url: protectVideoUrl(await resolveContentUrl(lecture.video_url)),
    })),
  );
}
function buildPublicNoteDataUrl(material: Row<"materials">) {
  const title = material.title || "KKCC Study Note";
  const subject = [material.subject, material.chapter, material.class_level]
    .filter(Boolean)
    .join(" · ");
  const body = material.description || `${title} — Complete Study Note & Revision Points.`;
  const escapedBody = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"/><title>${title}</title><style>*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;width:100%;max-width:780px;margin:0 auto;padding:16px;line-height:1.75;color:#0f172a;background:#f8fafc;overflow-wrap:anywhere;word-break:break-word}h1{margin:0 0 10px;color:#0f172a;font-size:clamp(20px,4.5vw,28px);line-height:1.3}.meta{font-size:12px;font-weight:800;color:#0284c7;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:clamp(16px,4vw,28px);box-shadow:0 4px 20px rgba(15,23,42,.05);font-size:clamp(15px,3.8vw,16px)}.print-btn{display:inline-flex;align-items:center;justify-content:center;width:100%;max-width:240px;margin-bottom:14px;padding:10px 18px;border-radius:999px;background:#0284c7;color:#fff;font-weight:700;font-size:14px;border:none;cursor:pointer}@media print{.print-btn{display:none}body{background:#fff;padding:0}.card{border:none;box-shadow:none;padding:0}}</style></head><body><button class="print-btn" onclick="window.print()">Print / Save as PDF</button><div class="card"><div class="meta">KKCC Excellence Hub · ${subject || "Study Material"} · ${material.material_type || "Notes"}</div><h1>${title}</h1><div>${escapedBody}</div></div></body></html>`;
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

async function publicMaterials(materials: Row<"materials">[]) {
  return mapNoteBodyReads(materials, async (material) => {
    const effectiveAccessType = materialAccessMode(material);
    const publicMaterial = { ...material };
    delete publicMaterial.body_storage_path;
    delete publicMaterial.body_storage_sha256;
    delete publicMaterial.body_storage_bytes;
    const description =
      effectiveAccessType === "free" ? await resolveNoteImages(await readNoteBody(material)) : "";
    const resolved =
      effectiveAccessType === "free" ? await resolveContentUrl(material.file_url) : null;
    return {
      ...publicMaterial,
      description,
      access_type: effectiveAccessType,
      file_url:
        effectiveAccessType === "free"
          ? resolved || buildPublicNoteDataUrl({ ...material, description })
          : null,
    };
  });
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

export const listPublishedCourses = createServerFn({ method: "GET" }).handler(async () =>
  unwrap(
    await projectContent
      .from("courses")
      .select("*")
      .eq("status", "published")
      .order("sort_order")
      .order("created_at"),
  ),
);

export const getCourseDetail = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ slug: z.string().trim().min(1).max(140) }).parse(input))
  .handler(async ({ data }) => {
    const course = unwrap(
      await projectContent
        .from("courses")
        .select("*")
        .eq("slug", data.slug)
        .eq("status", "published")
        .maybeSingle(),
    );
    if (!course) return null;
    const [lectures, materials] = await Promise.all([
      projectContent.from("lectures").select("*").eq("course_id", course.id).order("sort_order"),
      projectContent
        .from("materials")
        .select("*")
        .eq("course_id", course.id)
        .eq("is_published", true)
        .order("sort_order"),
    ]);
    return {
      course,
      lectures: await protectLectures(
        unwrap(lectures).filter((lecture) => isFreeCourse(course) || lecture.is_free),
      ),
      materials: await publicMaterials(unwrap(materials)),
    };
  });

export const getMyCourseLearningDeck = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ slug: z.string().trim().min(1).max(140) }).parse(input))
  .handler(async ({ context, data }) => {
    const course = unwrap(
      await projectContent
        .from("courses")
        .select("*")
        .eq("slug", data.slug)
        .eq("status", "published")
        .maybeSingle(),
    );
    if (!course) throw new Error("Course not found.");
    let hasAccess = isFreeCourse(course);
    if (!hasAccess) {
      const result = await context.supabase
        .from("course_enrollments")
        .select("*")
        .eq("user_id", context.userId)
        .eq("course_id", course.id)
        .maybeSingle();
      const enrollment = unwrap(result);
      hasAccess = Boolean(enrollment && isCurrentEnrollment(enrollment));
      if (!hasAccess) {
        const admin = unwrap(
          await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
        );
        hasAccess = Boolean(admin);
      }
    }
    const lectures = unwrap(
      await projectContent
        .from("lectures")
        .select("*")
        .eq("course_id", course.id)
        .order("sort_order"),
    );
    return {
      course,
      lectures: await protectLectures(lectures.filter((lecture) => hasAccess || lecture.is_free)),
      has_access: hasAccess,
    };
  });

export const listPublicMaterials = createServerFn({ method: "GET" }).handler(async () => {
  const rows = unwrap(await projectContent.from("materials").select("*").order("sort_order"));
  const flag = unwrap(
    await projectContent
      .from("site_settings")
      .select("value")
      .eq("key", "builtin_materials_adopted")
      .maybeSingle(),
  );
  const { builtInMaterials } = await import("@/lib/builtin-materials.server");
  const storedIds = new Set(rows.map((row) => row.id));
  const samples =
    flag?.value === "true" ? [] : builtInMaterials().filter((row) => !storedIds.has(row.id));
  return publicMaterials([...rows.filter((row) => row.is_published), ...samples]);
});
export const listPublicLectures = createServerFn({ method: "GET" }).handler(async () => {
  const [lectures, courses] = await Promise.all([
    projectContent.from("lectures").select("*").order("sort_order"),
    projectContent.from("courses").select("*").eq("status", "published"),
  ]);
  const published = new Map(unwrap(courses).map((course) => [course.id, course]));
  return protectLectures(
    unwrap(lectures).filter((lecture) => {
      const course = published.get(lecture.course_id);
      return Boolean(course && (isFreeCourse(course) || lecture.is_free));
    }),
  );
});
export const listPublicTests = createServerFn({ method: "GET" }).handler(async () =>
  unwrap(
    await projectContent.from("tests").select("*").eq("is_published", true).order("sort_order"),
  ),
);

/** Metadata only. All answer-bearing papers go through a protected attempt. */
export const getPublicTest = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const test = unwrap(
      await projectContent
        .from("tests")
        .select("*")
        .eq("id", data.id)
        .eq("is_published", true)
        .maybeSingle(),
    );
    return test ? { test, questions: [] as Row<"test_questions">[], locked: test.is_paid } : null;
  });

export const getPublicPlatformStats = createServerFn({ method: "GET" }).handler(async () => {
  const [courses, lectures, materials, tests] = await Promise.all([
    projectContent.from("courses").select("*"),
    projectContent.from("lectures").select("*"),
    projectContent.from("materials").select("*"),
    projectContent.from("tests").select("*"),
  ]);
  const publishedIds = new Set(
    unwrap(courses)
      .filter((course) => course.status === "published")
      .map((course) => course.id),
  );
  let studentsJoined = 0;
  let activeStudents = 0;
  const client = publicStudentClient();
  if (client) {
    const { data, error } = await client.rpc("get_public_student_stats");
    if (!error && data && typeof data === "object") {
      const row = data as Record<string, unknown>;
      studentsJoined = Number(row["students_joined"] || 0);
      activeStudents = Number(row["active_students"] || 0);
    }
  }
  return {
    studentsJoined,
    activeStudents,
    publishedCourses: publishedIds.size,
    publishedLectures: unwrap(lectures).filter((lecture) => publishedIds.has(lecture.course_id))
      .length,
    publishedMaterials: unwrap(materials).filter(
      (material) =>
        material.is_published && (!material.course_id || publishedIds.has(material.course_id)),
    ).length,
    publishedTests: unwrap(tests).filter((test) => test.is_published).length,
  };
});
export const listSeriesOverrides = createServerFn({ method: "GET" }).handler(async () =>
  unwrap(await projectContent.from("test_series_overrides").select("*")),
);

export const getCustomSeriesCatalog = createServerFn({ method: "GET" }).handler(async () =>
  readCustomSeriesCatalog(),
);
