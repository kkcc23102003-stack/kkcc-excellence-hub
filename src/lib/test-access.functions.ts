import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { projectContent } from "@/lib/project-content.server";
import {
  assertAdmin,
  findStudent,
  readStudentAccess,
  testPermission,
  effectiveSeries,
  learningPlan,
  buildSelectedPaper,
  unwrap,
} from "@/lib/learning.server";
import { publicQuestions } from "@/lib/test-scoring";
import { canonicalSeriesId, isCurrentGrant } from "@/lib/learning-access";
import {
  getEffectiveLearningSeries,
  LEARNING_SERIES,
  resolveSeriesPrice,
} from "@/lib/test-series-catalog";

const recipient = {
  user_id: z.string().uuid().optional(),
  email: z.string().trim().email().max(200).optional(),
  method: z.string().trim().max(80).default("offline"),
  amount_inr: z.number().int().min(0).max(1_000_000).default(0),
  note: z.string().trim().max(1200).default(""),
  valid_days: z.number().int().min(0).max(3650).optional(),
};
const testGrantSchema = z.object({ ...recipient, test_id: z.string().uuid() });
const seriesGrantSchema = z.object({ ...recipient, series_id: z.string().trim().min(1).max(200) });
const selectionSchema = z.object({
  test_id: z.string().uuid().optional(),
  series_id: z.string().trim().min(1).max(200).optional(),
  subject: z.string().trim().min(1).max(160).optional(),
  chapter: z.string().trim().min(1).max(240).optional(),
});

export const getMyLearningAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [access, coursesResult, testsResult, overridesResult] = await Promise.all([
      readStudentAccess(context),
      projectContent.from("courses").select("*").eq("status", "published"),
      projectContent.from("tests").select("*").eq("is_published", true).order("sort_order"),
      projectContent.from("test_series_overrides").select("*"),
    ]);
    const courses = unwrap(coursesResult);
    const tests = unwrap(testsResult);
    const allowed_tests = tests.filter((test) => testPermission(test, access).allowed);
    const enrolled_tests = tests.filter(
      (test) =>
        access.test_ids.includes(test.id) ||
        (test.course_id && access.course_ids.includes(test.course_id)) ||
        Boolean(
          canonicalSeriesId(test.series_name, access.series_aliases) &&
          access.series_ids.includes(canonicalSeriesId(test.series_name, access.series_aliases)!),
        ),
    );
    const overrides = unwrap(overridesResult);
    const overrideById = new Map(overrides.map((override) => [override.series_id, override]));
    const combinedSeries = [...getEffectiveLearningSeries(), ...LEARNING_SERIES];
    const seenSeries = new Set<string>();
    const series = combinedSeries
      .filter((item) => {
        if (seenSeries.has(item.id)) return false;
        seenSeries.add(item.id);
        return true;
      })
      .map((item) => {
        const override = overrideById.get(item.id);
        const price = resolveSeriesPrice(item, override);
        return {
          ...item,
          enabled: override?.enabled ?? true,
          ...price,
        };
      });
    return {
      ...access,
      courses: courses.filter((course) => access.course_ids.includes(course.id)),
      tests: enrolled_tests,
      allowed_test_ids: allowed_tests.map((test) => test.id),
      allowed_series_ids: series
        .filter(
          (item) =>
            access.is_admin ||
            access.series_ids.includes(item.id) ||
            (item.enabled && item.priceInr <= 0 && item.priceCoins <= 0),
        )
        .map((item) => item.id),
    };
  });
export const myTestAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ test_id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const test = unwrap(
      await projectContent.from("tests").select("*").eq("id", data.test_id).maybeSingle(),
    );
    return test
      ? testPermission(test, await readStudentAccess(context))
      : { allowed: false, reason: "missing" as const };
  });
export const adminListTestGrants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const grants =
      unwrap(
        await context.supabase
          .from("test_access_grants")
          .select("*")
          .order("created_at", { ascending: false }),
      ) ?? [];
    const profiles = unwrap(
      await context.supabase
        .from("profiles")
        .select("id,email,full_name")
        .in("id", [...new Set(grants.map((grant) => grant.user_id))]),
    );
    const tests = unwrap(await projectContent.from("tests").select("*"));
    const byUser = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    const byTest = new Map(tests.map((test) => [test.id, test]));
    return grants.map((grant) => ({
      ...grant,
      studentEmail: byUser.get(grant.user_id)?.email ?? "",
      studentName: byUser.get(grant.user_id)?.full_name ?? "",
      testTitle: byTest.get(grant.test_id)?.title ?? "",
      seriesName: byTest.get(grant.test_id)?.series_name ?? "",
    }));
  });
export const adminGrantTestAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => testGrantSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const test = unwrap(
      await projectContent
        .from("tests")
        .select("*")
        .eq("id", data.test_id)
        .eq("is_published", true)
        .maybeSingle(),
    );
    if (!test) throw new Error("Select a published test. Draft/missing tests cannot be enrolled.");
    const student = await findStudent(context, data);
    const expiresAt = data.valid_days
      ? new Date(Date.now() + data.valid_days * 86_400_000).toISOString()
      : null;
    const result = unwrap(
      await context.supabase.rpc("admin_grant_learning_access", {
        p_kind: "test",
        p_key: test.id,
        p_user_id: student.id,
        p_method: data.method,
        p_amount: data.amount_inr,
        p_note: data.note,
        p_expires_at: expiresAt,
      }),
    );
    const verified = unwrap(
      await context.supabase
        .from("test_access_grants")
        .select("*")
        .eq("user_id", student.id)
        .eq("test_id", test.id)
        .is("revoked_at", null)
        .single(),
    );
    if (!verified || !isCurrentGrant(verified))
      throw new Error("Grant was saved but is not currently usable. Check validity.");
    return {
      ok: true,
      student,
      user_id: student.id,
      test_id: test.id,
      expiresAt,
      alreadyHadAccess: Boolean((result as Record<string, unknown>)?.["renewed"]),
    };
  });
export const adminRevokeTestAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    unwrap(
      await context.supabase
        .from("test_access_grants")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", data.id)
        .select("*")
        .single(),
    );
    return { ok: true };
  });
export const adminSetTestFree = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ id: z.string().uuid(), free: z.boolean() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const test = unwrap(await projectContent.from("tests").select("*").eq("id", data.id).single());
    if (!data.free && test.price_inr <= 0 && test.price_coins <= 0)
      throw new Error("Set a rupee or coin price before switching this test back to paid.");
    unwrap(
      await projectContent
        .from("tests")
        .update({ is_paid: !data.free })
        .eq("id", data.id)
        .select("*")
        .single(),
    );
    return { ok: true, free: data.free };
  });
/** Compatibility endpoint, now with full selection validation and project-data loading. */
export const getTestForAttempt = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        test_id: z.string().uuid(),
        subject: z.string().optional(),
        chapter: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const learning = await learningPlan(context, data);
    const subject = data.subject || learning.plan[0]?.subject;
    const chapter = data.chapter || learning.plan[0]?.chapters[0];
    if (!subject || !chapter) throw new Error("This test has no mapped questions.");
    const paper = await buildSelectedPaper(
      context,
      { ...data, subject, chapter },
      crypto.randomUUID(),
    );
    return {
      allowed: true as const,
      reason: "granted" as const,
      questions: publicQuestions(paper.questions),
    };
  });
export const listMySeriesAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const access = await readStudentAccess(context);
    return access.series_grants.map((grant) => ({
      series_id: grant.series_id,
      expires_at: grant.expires_at,
    }));
  });
export const adminListSeriesGrants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    return unwrap(
      await context.supabase
        .from("series_access_grants")
        .select("*")
        .order("created_at", { ascending: false }),
    );
  });
export const adminGrantSeriesAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => seriesGrantSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const series = await effectiveSeries(data.series_id);
    if (!series.enabled)
      throw new Error("This series is hidden. Enable it before granting new access.");
    const student = await findStudent(context, data);
    const expiresAt = data.valid_days
      ? new Date(Date.now() + data.valid_days * 86_400_000).toISOString()
      : null;
    const result = unwrap(
      await context.supabase.rpc("admin_grant_learning_access", {
        p_kind: "series",
        p_key: series.id,
        p_user_id: student.id,
        p_method: data.method,
        p_amount: data.amount_inr,
        p_note: data.note,
        p_expires_at: expiresAt,
      }),
    );
    const verified = unwrap(
      await context.supabase
        .from("series_access_grants")
        .select("*")
        .eq("user_id", student.id)
        .eq("series_id", series.id)
        .is("revoked_at", null)
        .single(),
    );
    if (!verified || !isCurrentGrant(verified))
      throw new Error("Series grant was saved but is not currently usable.");
    return {
      ok: true,
      student,
      user_id: student.id,
      series_id: series.id,
      expiresAt,
      renewed: Boolean((result as Record<string, unknown>)?.["renewed"]),
    };
  });
export const adminRevokeSeriesAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    unwrap(
      await context.supabase
        .from("series_access_grants")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", data.id)
        .select("*")
        .single(),
    );
    return { ok: true };
  });
export const getLearningPlan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => selectionSchema.parse(input))
  .handler(async ({ context, data }) => {
    const learning = await learningPlan(context, data);
    return {
      kind: learning.kind,
      id: learning.id,
      title: learning.title,
      exam: learning.exam,
      series_id: learning.series_id,
      plan: learning.plan,
    };
  });
export const getSeriesChapterTest = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    selectionSchema.extend({ exam: z.string().optional() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const paper = await buildSelectedPaper(context, data, crypto.randomUUID());
    if (data.exam && data.exam !== paper.test.exam_track)
      throw new Error("Exam does not match the enrolled series.");
    return { ...paper, locked: false };
  });
