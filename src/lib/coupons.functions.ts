import { projectContent } from "@/lib/project-content.server";
import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  CouponCodeRow,
  CouponRedemptionRow,
  CourseRow,
  DB as Database,
} from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

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
  discount_percent: z.number().int().min(0).max(100),
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
  course_slug: z.string().trim().min(1),
});
const redeemCouponSchema = z.object({
  code: couponCodeSchema,
  course_slug: z.string().trim().min(1),
});

type CourseCoupon = CouponCodeRow & { course?: CourseRow | null };

function publicClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  return createClient<Database>(config.url, config.publishableKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: createSupabaseFetch(config.publishableKey),
    },
  });
}

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

function couponReason(coupon: CouponCodeRow, course: CourseRow) {
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
  if (coupon.applies_to_course_id && coupon.applies_to_course_id !== course.id) {
    return "Coupon is not valid for this course.";
  }
  return "";
}

function pricing(course: CourseRow, coupon: CouponCodeRow) {
  const originalAmount = Math.max(Number(course.price) || 0, 0);
  const discountAmount = Math.min(
    originalAmount,
    Math.round((originalAmount * coupon.discount_percent) / 100),
  );
  const finalAmount = Math.max(originalAmount - discountAmount, 0);
  return { originalAmount, discountAmount, finalAmount };
}

export const adminListCoupons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [couponResult, courseResult, redemptionResult] = await Promise.all([
      context.supabase
        .from("coupon_codes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      projectContent
        .from("courses")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      context.supabase
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

    const payload = {
      code: data.code,
      title: data.title,
      description: data.description,
      discount_percent: data.discount_percent,
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
      const { data: updated, error } = await context.supabase
        .from("coupon_codes")
        .update(payload as never)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return updated as CouponCodeRow;
    }

    const { data: inserted, error } = await context.supabase
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
    const { error } = await context.supabase.from("coupon_codes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const validateCouponForCourse = createServerFn({ method: "GET" })
  .validator((input: unknown) => validateCouponSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    if (!supabase) return { valid: false, message: "Supabase is not configured." };

    const { data: course, error: courseError } = await projectContent
      .from("courses")
      .select("*")
      .eq("slug", data.course_slug)
      .eq("status", "published")
      .maybeSingle();
    if (courseError) throw new Error(courseError.message);
    if (!course) return { valid: false, message: "Course not found." };
    if (course.price <= 0 && course.coin_price > 0)
      return { valid: false, message: "This is a coin-priced course; rupee coupons do not apply." };

    const { data: coupon, error: couponError } = await supabase
      .from("coupon_codes")
      .select("*")
      .eq("code", data.code)
      .maybeSingle();
    if (couponError) throw new Error(couponError.message);
    if (!coupon) return { valid: false, message: "Coupon code not found." };

    const row = coupon as CouponCodeRow;
    const reason = couponReason(row, course as CourseRow);
    if (reason) return { valid: false, message: reason };

    const { originalAmount, discountAmount, finalAmount } = pricing(course as CourseRow, row);
    return {
      valid: true,
      coupon_id: row.id,
      code: row.code,
      title: row.title,
      discount_percent: row.discount_percent,
      discount_amount: discountAmount,
      original_amount: originalAmount,
      final_amount: finalAmount,
      remaining_uses: row.max_uses > 0 ? Math.max(row.max_uses - row.used_count, 0) : null,
      message: `${row.discount_percent}% discount applied`,
    };
  });

export const redeemCouponForCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => redeemCouponSchema.parse(input))
  .handler(async ({ context, data }) => {
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

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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
