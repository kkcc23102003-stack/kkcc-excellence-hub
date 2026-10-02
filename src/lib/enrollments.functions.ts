import { isFreeCourse } from "@/lib/cms";
import { isCurrentEnrollment } from "@/lib/learning-access";
import { findStudent, unwrap } from "@/lib/learning.server";
import { projectContent } from "@/lib/project-content.server";
import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  CourseEnrollmentRow,
  CourseRow,
  DB as Database,
  ProfileRow,
} from "@/integrations/supabase/db";

const grantSchema = z.object({
  user_id: z.string().uuid().optional(),
  email: z.string().trim().email().optional(),
  course_id: z.string().uuid(),
  amount_paid: z.number().int().min(0).max(1000000).default(0),
  payment_method: z.string().trim().max(80).default("offline"),
  admin_note: z.string().trim().max(1200).default(""),
  expires_at: z.string().datetime().nullable().optional(),
  coin_bonus: z.number().int().min(0).max(10000000).default(0),
});

const revokeSchema = z.object({ id: z.string().uuid() });
const searchSchema = z.object({ query: z.string().trim().max(120).optional().default("") });
const slugSchema = z.object({ slug: z.string().trim().min(1).max(140) });

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function notExpired(enrollment: CourseEnrollmentRow) {
  return !enrollment.expires_at || new Date(enrollment.expires_at).getTime() > Date.now();
}

function matchesProfile(profile: ProfileRow, query: string) {
  if (!query) return true;
  const haystack = [
    profile.full_name,
    profile.email,
    profile.mobile,
    profile.class_level,
    profile.target_exam,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

async function findProfileByEmailOrId(
  supabase: SupabaseClient<Database>,
  payload: { user_id?: string | undefined; email?: string | undefined },
) {
  if (payload.user_id) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", payload.user_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Student profile not found. Ask the student to sign up once first.");
    return data as ProfileRow;
  }

  const email = payload.email?.toLowerCase();
  if (!email) throw new Error("Student email or user ID is required.");
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("email", email)
    .limit(5);
  if (error) throw new Error(error.message);
  const profile = (data ?? []).find((item) => item.email.toLowerCase() === email);
  if (!profile) throw new Error("Student not found. Ask the student to sign up once first.");
  return profile as ProfileRow;
}

export const adminListStudentAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => searchSchema.parse(input ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const [profilesResult, coursesResult, enrollmentsResult] = await Promise.all([
      context.supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      projectContent
        .from("courses")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      context.supabase
        .from("course_enrollments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    if (profilesResult.error) throw new Error(profilesResult.error.message);
    if (coursesResult.error) throw new Error(coursesResult.error.message);
    if (enrollmentsResult.error) throw new Error(enrollmentsResult.error.message);

    const profiles = ((profilesResult.data ?? []) as ProfileRow[]).filter((profile) =>
      matchesProfile(profile, data.query),
    );
    const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
    const allProfilesById = new Map(
      ((profilesResult.data ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]),
    );
    const courseById = new Map(
      ((coursesResult.data ?? []) as CourseRow[]).map((course) => [course.id, course]),
    );

    return {
      profiles,
      courses: (coursesResult.data ?? []) as CourseRow[],
      enrollments: ((enrollmentsResult.data ?? []) as CourseEnrollmentRow[])
        .filter((enrollment) => !data.query || profileById.has(enrollment.user_id))
        .map((enrollment) => ({
          ...enrollment,
          student: allProfilesById.get(enrollment.user_id) ?? null,
          course: courseById.get(enrollment.course_id) ?? null,
          is_current: enrollment.status === "active" && notExpired(enrollment),
        })),
    };
  });

export const adminGrantEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => grantSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const profile = await findStudent(context, data);
    const course = unwrap(
      await projectContent
        .from("courses")
        .select("*")
        .eq("id", data.course_id)
        .eq("status", "published")
        .maybeSingle(),
    );
    if (!course)
      throw new Error("Select a published course. Missing/draft courses cannot be enrolled.");
    if (data.expires_at && Date.parse(data.expires_at) <= Date.now())
      throw new Error("Enrollment expiry must be in the future.");
    unwrap(
      await context.supabase.rpc("admin_grant_learning_access", {
        p_kind: "course",
        p_key: course.id,
        p_user_id: profile.id,
        p_method: data.payment_method,
        p_amount: data.amount_paid,
        p_note: data.admin_note,
        p_expires_at: data.expires_at ?? null,
        p_coin_bonus: data.coin_bonus,
      }),
    );
    const verified = unwrap(
      await context.supabase
        .from("course_enrollments")
        .select("*")
        .eq("user_id", profile.id)
        .eq("course_id", course.id)
        .single(),
    );
    if (!verified || !isCurrentEnrollment(verified))
      throw new Error("Enrollment was saved but is not currently usable.");

    return { ok: true, user_id: profile.id, email: profile.email, coin_bonus: data.coin_bonus };
  });

export const adminRevokeEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => revokeSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("course_enrollments")
      .update({ status: "revoked", updated_at: new Date().toISOString() })
      .eq("id", data.id)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const ensureFreeCourseAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: course, error: courseError } = await projectContent
      .from("courses")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (courseError) throw new Error(courseError.message);
    if (!course) throw new Error("Course not found.");
    if (!isFreeCourse(course))
      throw new Error("This course requires admin/manual enrolment or payment.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    unwrap(
      await supabaseAdmin.rpc("purchase_learning_item", {
        p_actor: context.userId,
        p_kind: "course",
        p_key: course.id,
        p_price: 0,
      }),
    );

    return { ok: true, course_slug: course.slug };
  });

export const getMyCourseAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: enrollments, error: enrollmentsError }, { data: courses, error: coursesError }] =
      await Promise.all([
        context.supabase
          .from("course_enrollments")
          .select("*")
          .eq("user_id", context.userId)
          .order("created_at", { ascending: false }),
        projectContent
          .from("courses")
          .select("*")
          .eq("status", "published")
          .order("sort_order", { ascending: true }),
      ]);

    if (enrollmentsError) throw new Error(enrollmentsError.message);
    if (coursesError) throw new Error(coursesError.message);

    const activeCourseIds = new Set(
      ((enrollments ?? []) as CourseEnrollmentRow[])
        .filter((enrollment) => enrollment.status === "active" && notExpired(enrollment))
        .map((enrollment) => enrollment.course_id),
    );

    const availableCourses = ((courses ?? []) as CourseRow[])
      .sort((a, b) => Number(activeCourseIds.has(b.id)) - Number(activeCourseIds.has(a.id)))
      .filter((course) => isFreeCourse(course) || activeCourseIds.has(course.id));

    return {
      user_id: context.userId,
      course_ids: [...activeCourseIds],
      courses: availableCourses,
      enrollments: (enrollments ?? []) as CourseEnrollmentRow[],
    };
  });

function validityDetails(enrollment: CourseEnrollmentRow) {
  const now = Date.now();
  const createdAt = new Date(enrollment.created_at).getTime();
  const expiresAt = enrollment.expires_at ? new Date(enrollment.expires_at).getTime() : null;
  const daysLeft = expiresAt === null ? null : Math.ceil((expiresAt - now) / 86_400_000);
  const totalDays =
    expiresAt === null ? null : Math.max(1, Math.ceil((expiresAt - createdAt) / 86_400_000));
  const isExpiredByDate = expiresAt !== null && expiresAt <= now;
  const isCurrent = enrollment.status === "active" && !isExpiredByDate;
  const validityPercent =
    expiresAt === null
      ? 100
      : Math.max(
          0,
          Math.min(100, Math.round(((expiresAt - now) / Math.max(1, expiresAt - createdAt)) * 100)),
        );

  let validity_state: "lifetime" | "active" | "expiring" | "expired" | "revoked" = "active";
  let validity_label = "Active";

  if (enrollment.status === "revoked") {
    validity_state = "revoked";
    validity_label = "Revoked by admin";
  } else if (enrollment.status === "expired" || isExpiredByDate) {
    validity_state = "expired";
    validity_label = "Expired";
  } else if (expiresAt === null) {
    validity_state = "lifetime";
    validity_label = "Lifetime / no expiry";
  } else if ((daysLeft ?? 0) <= 7) {
    validity_state = "expiring";
    validity_label = `${Math.max(0, daysLeft ?? 0)} day${Math.max(0, daysLeft ?? 0) === 1 ? "" : "s"} left`;
  } else {
    validity_state = "active";
    validity_label = `${daysLeft} days left`;
  }

  return {
    is_current: isCurrent,
    days_left: daysLeft,
    total_validity_days: totalDays,
    validity_percent: validityPercent,
    validity_state,
    validity_label,
  };
}

export const getMyStudentSection = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [profileResult, enrollmentsResult] = await Promise.all([
      context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
      context.supabase
        .from("course_enrollments")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false }),
    ]);

    if (profileResult.error) throw new Error(profileResult.error.message);
    if (enrollmentsResult.error) throw new Error(enrollmentsResult.error.message);

    const enrollments = (enrollmentsResult.data ?? []) as CourseEnrollmentRow[];
    const courseIds = [...new Set(enrollments.map((enrollment) => enrollment.course_id))];
    const coursesResult = courseIds.length
      ? await projectContent.from("courses").select("*").in("id", courseIds)
      : { data: [], error: null };

    if (coursesResult.error) throw new Error(coursesResult.error.message);

    const courseById = new Map(
      ((coursesResult.data ?? []) as CourseRow[]).map((course) => [course.id, course]),
    );

    const enrollmentDetails = enrollments.map((enrollment) => {
      const validity = validityDetails(enrollment);
      return {
        ...enrollment,
        ...validity,
        course: courseById.get(enrollment.course_id) ?? null,
      };
    });

    const active = enrollmentDetails.filter((item) => item.is_current).length;
    const expired = enrollmentDetails.filter((item) => item.validity_state === "expired").length;
    const expiringSoon = enrollmentDetails.filter(
      (item) => item.validity_state === "expiring",
    ).length;
    const lifetime = enrollmentDetails.filter((item) => item.validity_state === "lifetime").length;

    return {
      user_id: context.userId,
      profile: profileResult.data as ProfileRow | null,
      enrollments: enrollmentDetails,
      summary: {
        total: enrollmentDetails.length,
        active,
        expired,
        expiring_soon: expiringSoon,
        lifetime,
      },
    };
  });
