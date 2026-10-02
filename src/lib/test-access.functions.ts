/**
 * Who may open a paid test.
 *
 * There are exactly two ways in, and both are decided on the server:
 *
 *   1. The test is free. An admin flips `tests.is_paid` to false and the
 *      paper opens for everyone, the same way a free course does. No payment
 *      step, no Razorpay, nothing to buy.
 *
 *   2. The student holds a live grant. When someone pays offline - cash at
 *      the centre, UPI to the desk, a bank transfer - an admin records that
 *      payment against their email and the paper opens for them alone.
 *
 * A student can never write to `test_access_grants`, so access cannot be
 * granted from the browser console.
 */

import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";
import { PAID_TEST_SERIES } from "@/lib/test-series-catalog";

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

async function hasLiveSeriesAccess(
  supabase: SupabaseClient<Database>,
  userId: string,
  seriesId: string | null | undefined,
) {
  const key = seriesId?.trim();
  if (!key) return false;

  // Older tests may have stored the human-readable catalogue name in
  // tests.series_name. Newer ones use the stable catalogue id. Accept both
  // so existing papers do not become inaccessible after the series-grant fix.
  const keys = new Set<string>([key]);
  const catalogMatch = PAID_TEST_SERIES.find(
    (series) => series.id === key || series.name.trim().toLowerCase() === key.toLowerCase(),
  );
  if (catalogMatch) {
    keys.add(catalogMatch.id);
    keys.add(catalogMatch.name);
  }

  const { data, error } = await supabase
    .from("series_access_grants")
    .select("id")
    .in("series_id", [...keys])
    .eq("user_id", userId)
    .is("revoked_at", null)
    .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data);
}

/**
 * Can the signed-in student open this test right now?
 *
 * Returns a reason too, so the UI can say something useful instead of just
 * refusing.
 */
export const myTestAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ test_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: test, error } = await context.supabase
      .from("tests")
      .select("id, is_paid, title, series_name")
      .eq("id", data.test_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!test) return { allowed: false, reason: "missing" as const };

    if (!test.is_paid) return { allowed: true, reason: "free" as const };

    const { data: grant } = await context.supabase
      .from("test_access_grants")
      .select("id, method, amount_inr, note, created_at, expires_at")
      .eq("test_id", data.test_id)
      .eq("user_id", context.userId)
      .is("revoked_at", null)
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
      .maybeSingle();

    if (grant) return { allowed: true, reason: "granted" as const, grant };

    // A series purchase unlocks every published paper belonging to that
    // series. This is the missing bridge that previously left an enrolled
    // student stuck on the individual-test lock screen.
    if (await hasLiveSeriesAccess(context.supabase, context.userId, test.series_name)) {
      return { allowed: true, reason: "series_granted" as const };
    }

    return { allowed: false, reason: "locked" as const };
  });

/** Every live and revoked grant, newest first. Admin only. */
export const adminListTestGrants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("test_access_grants")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    const grants = data ?? [];

    // Resolve the student and the paper so the table reads in plain language
    // rather than as a wall of UUIDs.
    const userIds = [...new Set(grants.map((g) => g.user_id))];
    const testIds = [...new Set(grants.map((g) => g.test_id))];

    const [{ data: profiles }, { data: tests }] = await Promise.all([
      userIds.length
        ? context.supabase.from("profiles").select("id, email, full_name").in("id", userIds)
        : Promise.resolve({ data: [] as { id: string; email: string; full_name: string }[] }),
      testIds.length
        ? context.supabase.from("tests").select("id, title, series_name").in("id", testIds)
        : Promise.resolve({ data: [] as { id: string; title: string; series_name: string }[] }),
    ]);

    const byUser = new Map((profiles ?? []).map((p) => [p.id, p]));
    const byTest = new Map((tests ?? []).map((t) => [t.id, t]));

    return grants.map((g) => ({
      ...g,
      studentEmail: byUser.get(g.user_id)?.email ?? "",
      studentName: byUser.get(g.user_id)?.full_name ?? "",
      testTitle: byTest.get(g.test_id)?.title ?? "",
      seriesName: byTest.get(g.test_id)?.series_name ?? "",
    }));
  });

const grantSchema = z.object({
  test_id: z.string().uuid(),
  email: z.string().trim().email().max(200),
  method: z.string().trim().max(40).default("offline"),
  amount_inr: z.number().int().min(0).max(1_000_000).default(0),
  note: z.string().trim().max(500).default(""),
  // How long the access lasts, in days. 0 or absent means lifetime, which is
  // how every grant behaved before expiry existed.
  valid_days: z.number().int().min(0).max(3650).optional(),
});

/**
 * Unlock a paid test for one student after an offline payment.
 *
 * Looked up by email, because that is what the desk has on the receipt. If
 * the student has never signed up we say so plainly rather than creating a
 * ghost account.
 */
export const adminGrantTestAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => grantSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const email = data.email.toLowerCase();
    const { data: profile, error: profileError } = await context.supabase
      .from("profiles")
      .select("id, email, full_name")
      .ilike("email", email)
      .maybeSingle();
    if (profileError) throw new Error(profileError.message);
    if (!profile) {
      throw new Error(
        `No student account found for ${data.email}. Ask them to sign up first, then grant access.`,
      );
    }

    const { data: existing } = await context.supabase
      .from("test_access_grants")
      .select("id")
      .eq("test_id", data.test_id)
      .eq("user_id", profile.id)
      .is("revoked_at", null)
      .maybeSingle();
    const expiresAt =
      data.valid_days && data.valid_days > 0
        ? new Date(Date.now() + data.valid_days * 86_400_000).toISOString()
        : null;

    if (existing) {
      // Re-granting an active student is how the desk renews a subscription,
      // so push the expiry out rather than treating it as a no-op.
      const { error: extendError } = await context.supabase
        .from("test_access_grants")
        .update({ expires_at: expiresAt } as never)
        .eq("id", existing.id);
      if (extendError) throw new Error(extendError.message);
      return { ok: true, alreadyHadAccess: true, student: profile, expiresAt };
    }

    const { error } = await context.supabase.from("test_access_grants").insert({
      test_id: data.test_id,
      user_id: profile.id,
      expires_at: expiresAt,
      granted_by: context.userId,
      method: data.method || "offline",
      amount_inr: data.amount_inr,
      note: data.note,
    } as never);
    if (error) throw new Error(error.message);

    return { ok: true, alreadyHadAccess: false, student: profile };
  });

/** Withdraw a grant. The row survives with a revoked_at stamp. */
export const adminRevokeTestAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("test_access_grants")
      .update({ revoked_at: new Date().toISOString() } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Flip a test between free and paid in one click.
 *
 * Making it free is the important direction: the paper immediately opens for
 * everyone, exactly like a free course, with no payment step in the way.
 */
export const adminSetTestFree = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ id: z.string().uuid(), free: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    if (!data.free) {
      // Going back to paid only makes sense if there is a price to charge.
      const { data: test } = await context.supabase
        .from("tests")
        .select("price_inr, price_coins")
        .eq("id", data.id)
        .maybeSingle();
      if (test && test.price_inr <= 0 && test.price_coins <= 0) {
        throw new Error("Set a rupee or coin price before switching this test back to paid.");
      }
    }

    const { error } = await context.supabase
      .from("tests")
      .update({ is_paid: !data.free, updated_at: new Date().toISOString() } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true, free: data.free };
  });

/**
 * The paper itself, for a student who is allowed to sit it.
 *
 * This is the only path by which a paid test's questions leave the server.
 * The public loader returns an empty question list for a paid test, so a
 * locked paper cannot be read out of the page source.
 */
export const getTestForAttempt = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ test_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: test, error } = await context.supabase
      .from("tests")
      .select("*")
      .eq("id", data.test_id)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!test) return { allowed: false as const, reason: "missing" as const, questions: [] };

    if (test.is_paid) {
      const now = new Date().toISOString();
      const { data: grant } = await context.supabase
        .from("test_access_grants")
        .select("id")
        .eq("test_id", data.test_id)
        .eq("user_id", context.userId)
        .is("revoked_at", null)
        .or("expires_at.is.null,expires_at.gt." + now)
        .maybeSingle();

      const seriesGranted = !grant
        ? await hasLiveSeriesAccess(context.supabase, context.userId, test.series_name)
        : false;

      if (!grant && !seriesGranted) {
        return { allowed: false as const, reason: "locked" as const, questions: [] };
      }
    }

    if (test.question_source === "deterministic") {
      const { generateOnDemandTestPaper } = await import("@/lib/generated-test");
      const questions = generateOnDemandTestPaper({
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
      return {
        allowed: true as const,
        reason: test.is_paid ? ("granted" as const) : ("free" as const),
        questions: questions as never,
      };
    }

    const { data: questions, error: qError } = await context.supabase
      .from("test_questions")
      .select("*")
      .eq("test_id", test.id)
      .order("sort_order", { ascending: true });
    if (qError) throw new Error(qError.message);

    return {
      allowed: true as const,
      reason: test.is_paid ? ("granted" as const) : ("free" as const),
      questions: questions ?? [],
    };
  });

/* ------------------------------------------------------------------ */
/* Series access                                                      */
/*                                                                    */
/* test_access_grants opens one paper. These open a whole catalogue   */
/* series, keyed by the id the catalogue already uses in code, which  */
/* is what an offline payment for a series actually buys.             */
/* ------------------------------------------------------------------ */

const seriesGrantSchema = z.object({
  series_id: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  method: z.string().trim().max(40).default("offline"),
  amount_inr: z.number().int().min(0).max(1_000_000).default(0),
  note: z.string().trim().max(500).default(""),
  /** 0 or absent means lifetime. */
  valid_days: z.number().int().min(0).max(3650).optional(),
});

/** Which series the signed-in student may open. Drives the lock on the page. */
export const listMySeriesAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("series_access_grants")
      .select("series_id, expires_at")
      .eq("user_id", context.userId)
      .is("revoked_at", null);
    if (error) throw new Error(error.message);
    const now = Date.now();
    return (data ?? [])
      .filter((g) => !g.expires_at || new Date(g.expires_at).getTime() > now)
      .map((g) => ({ series_id: g.series_id, expires_at: g.expires_at }));
  });

/** Every series grant, for the admin screen. */
export const adminListSeriesGrants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("series_access_grants")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Open a series for a student who paid offline. Re-granting renews. */
export const adminGrantSeriesAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => seriesGrantSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const { data: profile, error: profileError } = await context.supabase
      .from("profiles")
      .select("id, email, full_name")
      .ilike("email", data.email.toLowerCase())
      .maybeSingle();
    if (profileError) throw new Error(profileError.message);
    if (!profile) {
      throw new Error(
        `No student account found for ${data.email}. Ask them to sign up first, then grant access.`,
      );
    }

    const expiresAt =
      data.valid_days && data.valid_days > 0
        ? new Date(Date.now() + data.valid_days * 86_400_000).toISOString()
        : null;

    const { data: existing } = await context.supabase
      .from("series_access_grants")
      .select("id")
      .eq("series_id", data.series_id)
      .eq("user_id", profile.id)
      .is("revoked_at", null)
      .maybeSingle();

    if (existing) {
      // Renewing an active student: push the expiry out rather than failing
      // on the one-live-grant index.
      const { error } = await context.supabase
        .from("series_access_grants")
        .update({ expires_at: expiresAt, amount_inr: data.amount_inr, note: data.note } as never)
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
      return { ok: true, renewed: true, student: profile, expiresAt };
    }

    const { error } = await context.supabase.from("series_access_grants").insert({
      series_id: data.series_id,
      user_id: profile.id,
      granted_by: context.userId,
      method: data.method,
      amount_inr: data.amount_inr,
      note: data.note,
      expires_at: expiresAt,
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true, renewed: false, student: profile, expiresAt };
  });

/** Withdraw access. The row is kept so the payment history survives. */
export const adminRevokeSeriesAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("series_access_grants")
      .update({ revoked_at: new Date().toISOString() } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Generate one fresh chapter paper for an enrolled paid series.
 * The paper is never stored in Supabase; access is checked on the server first.
 */
const seriesChapterTestSchema = z.object({
  series_id: z.string().trim().min(1).max(120),
  exam: z.string().trim().min(1).max(160),
  subject: z.string().trim().min(1).max(160),
  chapter: z.string().trim().min(1).max(240),
});

export const getSeriesChapterTest = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => seriesChapterTestSchema.parse(input))
  .handler(async ({ data, context }) => {
    if (!(await hasLiveSeriesAccess(context.supabase, context.userId, data.series_id))) {
      throw new Error("SERIES_ACCESS_REQUIRED");
    }

    const { generateOnDemandTestPaper } = await import("@/lib/generated-test");
    const questions = generateOnDemandTestPaper({
      exam: data.exam,
      subject: data.subject,
      topic: data.chapter,
      difficulty: "Mixed",
      count: 60,
      marks: 1,
      negative_marks: 0,
    });

    return {
      test: {
        id: `series-${data.series_id}-${encodeURIComponent(data.subject)}-${encodeURIComponent(data.chapter)}`,
        title: `${data.subject} — ${data.chapter}`,
        instructions:
          "Fresh on-demand chapter paper. Questions are generated for this attempt and are not stored.",
        subject: data.subject,
        duration_minutes: 60,
        question_timer_seconds: 0,
        timer_mode: "test" as const,
        questions_count: questions.length,
        total_marks: questions.length,
        exam_track: data.exam,
        level: "Mixed" as const,
        series_name: data.series_id,
        is_paid: true,
        price_inr: 0,
        price_coins: 0,
        question_source: "deterministic" as const,
        generation_exam: data.exam,
        generation_subject: data.subject,
        generation_topic: data.chapter,
        generation_difficulty: "Mixed" as const,
        generation_count: questions.length,
      },
      questions,
      locked: false,
    };
  });
