import { effectiveSeries } from "@/lib/learning.server";
import { projectContent } from "@/lib/project-content.server";
import { coinPriceOf } from "@/lib/cms";
import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  CouponCodeRow,
  CouponRedemptionRow,
  CourseRow,
  DB as Database,
} from "@/integrations/supabase/db";

const couponCodeSchema = z
  .string()
  .trim()
  .min(2)
  .max(40)
  .transform((value) => value.toUpperCase().replace(/\s+/g, ""));

const adminCouponSchema = z.object({
  id: z.string().uuid().optional(),
  code: couponCodeSchema,
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(""),
  discount_percent: z.number().int().min(1).max(100),
  max_uses: z.number().int().min(0).max(100000).default(0),
  per_user_limit: z.number().int().min(1).max(100).default(1),
  starts_at: z.string().datetime().nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  is_active: z.boolean().default(true),
  applies_to_course_id: z.string().uuid().nullable().optional(),
});

const deleteCouponSchema = z.object({ id: z.string().uuid() });
const validateCouponSchema = z.object({
  code: couponCodeSchema,
  course_slug: z.string().trim().optional().default(""),
  series_id: z.string().trim().optional().default(""),
  test_id: z.string().trim().optional().default(""),
  /** Paid study notes / notes bundle — coupons work here too. */
  material_id: z.string().trim().optional().default(""),
});
const redeemCouponSchema = z.object({
  code: couponCodeSchema,
  course_slug: z.string().trim().optional().default(""),
  series_id: z.string().trim().optional().default(""),
  test_id: z.string().trim().optional().default(""),
  material_id: z.string().trim().optional().default(""),
});

type CourseCoupon = CouponCodeRow & { course?: CourseRow | null };

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function isCouponTimeValid(coupon: CouponCodeRow) {
  const now = Date.now();
  if (coupon.starts_at && new Date(coupon.starts_at).getTime() > now) return false;
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() <= now) return false;
  return true;
}

function checkCouponValidity(coupon: CouponCodeRow, targetCourseId: string | null) {
  if (!coupon.is_active) return "Coupon is inactive or expired.";
  if (coupon.starts_at && new Date(coupon.starts_at).getTime() > Date.now()) {
    return "Coupon is not active yet.";
  }
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() <= Date.now()) {
    return "Coupon validity has ended.";
  }
  if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) {
    return "Coupon usage limit is full.";
  }
  if (coupon.applies_to_course_id) {
    if (!targetCourseId || coupon.applies_to_course_id !== targetCourseId) {
      return "This coupon is only valid for its assigned batch/course.";
    }
  }
  return "";
}

function calculateCouponBreakdown(
  originalAmountInr: number,
  originalCoins: number,
  discountPercent: number,
) {
  const pct = Math.min(100, Math.max(0, Math.round(Number(discountPercent) || 0)));
  const origInr = Math.max(0, Math.round(Number(originalAmountInr) || 0));
  const discountAmount = Math.min(origInr, Math.round((origInr * pct) / 100));
  const finalAmount = Math.max(0, origInr - discountAmount);

  const origCoins = Math.max(0, Math.round(Number(originalCoins) || 0));
  const discountCoins = Math.min(origCoins, Math.round((origCoins * pct) / 100));
  const finalCoins = Math.max(0, origCoins - discountCoins);

  return {
    discountPercent: pct,
    originalAmount: origInr,
    discountAmount,
    finalAmount,
    originalCoins: origCoins,
    discountCoins,
    finalCoins,
  };
}

export async function resolveServerCouponDiscount(input: {
  code: string;
  targetCourseId: string | null;
  originalAmountInr: number;
  originalCoins: number;
  userId?: string;
  recordRedemption?: boolean;
}) {
  const cleanCode = input.code.trim().toUpperCase().replace(/\s+/g, "");
  if (!cleanCode) {
    return {
      coupon: null,
      ...calculateCouponBreakdown(input.originalAmountInr, input.originalCoins, 0),
    };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: couponRow, error } = await supabaseAdmin
    .from("coupon_codes")
    .select("*")
    .eq("code", cleanCode)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!couponRow) throw new Error("Coupon code not found.");

  const coupon = couponRow as CouponCodeRow;
  const reason = checkCouponValidity(coupon, input.targetCourseId);
  if (reason) throw new Error(reason);

  if (input.userId && coupon.per_user_limit > 0) {
    const { count } = await supabaseAdmin
      .from("coupon_redemptions")
      .select("*", { count: "exact", head: true })
      .eq("coupon_id", coupon.id)
      .eq("user_id", input.userId);
    if ((count ?? 0) >= coupon.per_user_limit) {
      throw new Error("You have already used this coupon code the maximum number of times.");
    }
  }

  const breakdown = calculateCouponBreakdown(
    input.originalAmountInr,
    input.originalCoins,
    coupon.discount_percent,
  );

  if (input.recordRedemption && input.userId) {
    await supabaseAdmin
      .from("coupon_codes")
      .update({
        used_count: (coupon.used_count ?? 0) + 1,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", coupon.id);

    if (input.targetCourseId) {
      await supabaseAdmin.from("coupon_redemptions").insert({
        coupon_id: coupon.id,
        user_id: input.userId,
        course_id: input.targetCourseId,
        discount_percent: breakdown.discountPercent,
        discount_amount: breakdown.discountAmount,
        original_amount: breakdown.originalAmount,
        final_amount: breakdown.finalAmount,
        currency: "INR",
        status: breakdown.finalAmount === 0 ? "enrolled" : "applied",
      } as never);
    }
  }

  return { coupon, ...breakdown };
}

export const adminListCoupons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [couponResult, courseResult, redemptionResult] = await Promise.all([
      supabaseAdmin
        .from("coupon_codes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      projectContent
        .from("courses")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabaseAdmin
        .from("coupon_redemptions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    if (couponResult.error) throw new Error(couponResult.error.message);
    if (courseResult.error) throw new Error(courseResult.error.message);
    if (redemptionResult.error) throw new Error(redemptionResult.error.message);

    const courses = (courseResult.data ?? []) as CourseRow[];
    const courseById = new Map(courses.map((course) => [course.id, course]));

    return {
      coupons: ((couponResult.data ?? []) as CouponCodeRow[]).map((coupon) => ({
        ...coupon,
        course: coupon.applies_to_course_id
          ? (courseById.get(coupon.applies_to_course_id) ?? null)
          : null,
        is_time_valid: isCouponTimeValid(coupon),
        is_limit_full: coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses,
      })) as CourseCoupon[],
      courses,
      redemptions: (redemptionResult.data ?? []) as CouponRedemptionRow[],
    };
  });

export const adminSaveCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => adminCouponSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    if (
      data.starts_at &&
      data.expires_at &&
      new Date(data.starts_at) >= new Date(data.expires_at)
    ) {
      throw new Error("Expiry date must be after start date.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      code: data.code,
      title: data.title,
      description: data.description,
      discount_percent: Math.min(100, Math.max(1, data.discount_percent)),
      max_uses: data.max_uses,
      per_user_limit: data.per_user_limit,
      starts_at: data.starts_at ?? null,
      expires_at: data.expires_at ?? null,
      is_active: data.is_active,
      applies_to_course_id: data.applies_to_course_id ?? null,
      created_by: context.userId,
      updated_at: new Date().toISOString(),
    };

    if (data.id) {
      const { data: updated, error } = await supabaseAdmin
        .from("coupon_codes")
        .update(payload as never)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return updated as CouponCodeRow;
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("coupon_codes")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return inserted as CouponCodeRow;
  });

export const adminDeleteCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => deleteCouponSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("coupon_codes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const validateCouponForCourse = createServerFn({ method: "GET" })
  .validator((input: unknown) => validateCouponSchema.parse(input))
  .handler(async ({ data }) => {
    let targetCourseId: string | null = null;
    let originalAmountInr = 0;
    let originalCoins = 0;

    if (data.series_id) {
      const series = await effectiveSeries(data.series_id);
      originalAmountInr = Math.max(0, Number(series.priceInr) || 0);
      originalCoins = Math.max(0, Number(series.priceCoins || series.priceInr) || 0);
    } else if (data.test_id) {
      const { data: test } = await projectContent
        .from("tests")
        .select("*")
        .eq("id", data.test_id)
        .eq("is_published", true)
        .maybeSingle();
      if (!test) return { valid: false, message: "Test not found." };
      originalAmountInr = Math.max(0, Number(test.price_inr) || 0);
      originalCoins = Math.max(0, Number(test.price_coins || test.price_inr) || 0);
    } else if (data.material_id) {
      const { data: material } = await projectContent
        .from("materials")
        .select("*")
        .eq("id", data.material_id)
        .eq("is_published", true)
        .maybeSingle();
      if (!material) return { valid: false, message: "Notes not found." };
      if (material.access_type !== "paid")
        return { valid: false, message: "These notes are not a paid item." };
      originalAmountInr = Math.max(0, Number(material.price) || 0);
      originalCoins = Math.max(0, Number(material.coin_price || material.price) || 0);
    } else if (data.course_slug) {
      const { data: course, error: courseError } = await projectContent
        .from("courses")
        .select("*")
        .eq("slug", data.course_slug)
        .eq("status", "published")
        .maybeSingle();
      if (courseError) throw new Error(courseError.message);
      if (!course) return { valid: false, message: "Batch / course not found." };
      targetCourseId = course.id;
      originalAmountInr = Math.max(0, Number(course.price) || 0);
      originalCoins = coinPriceOf(course as CourseRow);
    } else {
      return { valid: false, message: "Please select a batch or test series first." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from("coupon_codes")
      .select("*")
      .eq("code", data.code)
      .maybeSingle();
    if (couponError) throw new Error(couponError.message);
    if (!coupon) return { valid: false, message: "Coupon code not found." };

    const row = coupon as CouponCodeRow;
    const reason = checkCouponValidity(row, targetCourseId);
    if (reason) return { valid: false, message: reason };

    const breakdown = calculateCouponBreakdown(
      originalAmountInr,
      originalCoins,
      row.discount_percent,
    );

    return {
      valid: true,
      coupon_id: row.id,
      code: row.code,
      title: row.title,
      discount_percent: breakdown.discountPercent,
      discount_amount: breakdown.discountAmount,
      original_amount: breakdown.originalAmount,
      final_amount: breakdown.finalAmount,
      original_coins: breakdown.originalCoins,
      discount_coins: breakdown.discountCoins,
      final_coins: breakdown.finalCoins,
      remaining_uses: row.max_uses > 0 ? Math.max(row.max_uses - row.used_count, 0) : null,
      message: `${breakdown.discountPercent}% discount applied!`,
    };
  });

export const redeemCouponForCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => redeemCouponSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Case 1: Test Series 100% coupon unlock
    if (data.series_id) {
      const series = await effectiveSeries(data.series_id);
      const res = await resolveServerCouponDiscount({
        code: data.code,
        targetCourseId: null,
        originalAmountInr: Math.max(0, Number(series.priceInr) || 0),
        originalCoins: Math.max(0, Number(series.priceCoins || series.priceInr) || 0),
        userId: context.userId,
        recordRedemption: true,
      });
      const enrolled = res.finalAmount <= 0 && res.finalCoins <= 0;
      if (enrolled) {
        const { error } = await supabaseAdmin.from("series_access_grants").upsert(
          {
            user_id: context.userId,
            series_id: series.id,
            granted_by: context.userId,
            method: "coupon",
            amount_inr: 0,
            note: `100% Coupon ${res.coupon?.code ?? data.code}`,
            expires_at: null,
            revoked_at: null,
          } as never,
          { onConflict: "series_id,user_id" },
        );
        if (error) {
          await supabaseAdmin.from("series_access_grants").insert({
            user_id: context.userId,
            series_id: series.id,
            granted_by: context.userId,
            method: "coupon",
            amount_inr: 0,
            note: `100% Coupon ${res.coupon?.code ?? data.code}`,
          } as never);
        }
      }
      return {
        ok: true,
        code: res.coupon?.code ?? data.code,
        course_id: series.id,
        final_amount: res.finalAmount,
        discount_amount: res.discountAmount,
        discount_percent: res.discountPercent,
        enrolled,
      };
    }

    // Case 2: Individual Paid Test 100% coupon unlock
    if (data.test_id) {
      const { data: test } = await projectContent
        .from("tests")
        .select("*")
        .eq("id", data.test_id)
        .eq("is_published", true)
        .maybeSingle();
      if (!test) throw new Error("Test not found.");
      const res = await resolveServerCouponDiscount({
        code: data.code,
        targetCourseId: null,
        originalAmountInr: Math.max(0, Number(test.price_inr) || 0),
        originalCoins: Math.max(0, Number(test.price_coins || test.price_inr) || 0),
        userId: context.userId,
        recordRedemption: true,
      });
      const enrolled = res.finalAmount <= 0 && res.finalCoins <= 0;
      if (enrolled) {
        await supabaseAdmin.from("test_access_grants").insert({
          user_id: context.userId,
          test_id: test.id,
          granted_by: context.userId,
          method: "coupon",
          amount_inr: 0,
          note: `100% Coupon ${res.coupon?.code ?? data.code}`,
        } as never);
      }
      return {
        ok: true,
        code: res.coupon?.code ?? data.code,
        course_id: test.id,
        final_amount: res.finalAmount,
        discount_amount: res.discountAmount,
        discount_percent: res.discountPercent,
        enrolled,
      };
    }

    // Case 2b: Paid Notes 100% coupon unlock
    if (data.material_id) {
      const { data: material } = await projectContent
        .from("materials")
        .select("*")
        .eq("id", data.material_id)
        .eq("is_published", true)
        .maybeSingle();
      if (!material) throw new Error("Notes not found.");
      const res = await resolveServerCouponDiscount({
        code: data.code,
        targetCourseId: null,
        originalAmountInr: Math.max(0, Number(material.price) || 0),
        originalCoins: Math.max(0, Number(material.coin_price || material.price) || 0),
        userId: context.userId,
        recordRedemption: true,
      });
      const enrolled = res.finalAmount <= 0 && res.finalCoins <= 0;
      if (enrolled) {
        const { error } = await supabaseAdmin.from("material_purchases").upsert(
          {
            user_id: context.userId,
            material_id: material.id,
            paid_coins: 0,
            status: "active",
            created_by: context.userId,
          } as never,
          { onConflict: "user_id,material_id" },
        );
        if (error) throw new Error(error.message);
      }
      return {
        ok: true,
        code: res.coupon?.code ?? data.code,
        course_id: material.id,
        final_amount: res.finalAmount,
        discount_amount: res.discountAmount,
        discount_percent: res.discountPercent,
        enrolled,
      };
    }

    // Case 3: Course / Batch coupon redemption
    const { data: course, error: courseError } = await projectContent
      .from("courses")
      .select("*")
      .eq("slug", data.course_slug)
      .eq("status", "published")
      .maybeSingle();
    if (courseError) throw new Error(courseError.message);
    if (!course) throw new Error("Course not found.");
    if (course.price <= 0 && course.coin_price > 0)
      throw new Error("Rupee coupons cannot unlock a coin-only course for free.");

    const { data: result, error } = await supabaseAdmin.rpc("redeem_project_course_coupon", {
      p_actor: context.userId,
      p_code: data.code,
      p_course_id: course.id,
      p_original_amount: Math.max(0, Math.round(Number(course.price))),
    });
    if (error) throw new Error(error.message);
    return result as {
      ok: boolean;
      code: string;
      course_id: string;
      final_amount: number;
      discount_amount: number;
      discount_percent: number;
      enrolled: boolean;
      already_redeemed?: boolean;
      message?: string;
    };
  });
