import { createHmac } from "node:crypto";
import { projectContent } from "@/lib/project-content.server";
import { effectiveSeries, readStudentAccess, unwrap } from "@/lib/learning.server";
import { coinPriceOf } from "@/lib/cms";
import { resolveServerCouponDiscount } from "@/lib/coupons.functions";
import { materialForStudent } from "@/lib/material-access.server";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  CoinPackageRow,
  CoinTransactionRow,
  DB as Database,
  ProfileRow,
} from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

function publicClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  return createClient<Database>(config.url, config.publishableKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: createSupabaseFetch(config.publishableKey) },
  });
}

const emailOrUserSchema = z.object({
  email: z.string().trim().email().optional(),
  user_id: z.string().uuid().optional(),
  amount: z.number().int().min(1).max(10_000_000),
  reason: z.string().trim().max(600).default("Admin 23KAAT grant"),
  related_type: z.string().trim().max(80).optional().default(""),
  related_id: z.string().uuid().nullable().optional(),
});

const courseSpendSchema = z.object({
  course_id: z.string().uuid(),
  expected_coins: z.number().int().min(0).max(1_000_000).optional(),
  coupon_code: z.string().trim().max(40).optional().default(""),
});
const seriesSpendSchema = z.object({
  series_id: z.string().trim().min(1).max(120),
  expected_coins: z.number().int().min(0).max(1_000_000).optional(),
  coupon_code: z.string().trim().max(40).optional().default(""),
});
const testSpendSchema = z.object({
  test_id: z.string().uuid(),
  expected_coins: z.number().int().min(0).max(1_000_000).optional(),
  coupon_code: z.string().trim().max(40).optional().default(""),
});
const razorpayCompleteSchema = z.object({
  kind: z.enum(["course", "series", "test"]),
  item_id: z.string().trim().min(1).max(120),
  coupon_code: z.string().trim().max(40).optional().default(""),
  razorpay_payment_id: z.string().trim().min(3).max(200),
  razorpay_order_id: z.string().trim().max(200).optional().default(""),
  razorpay_signature: z.string().trim().max(500).optional().default(""),
});
const razorpayCoinPackSchema = z.object({
  package_id: z.string().uuid(),
  razorpay_payment_id: z.string().trim().min(3).max(200),
  razorpay_order_id: z.string().trim().max(200).optional().default(""),
  razorpay_signature: z.string().trim().max(500).optional().default(""),
});
const materialSchema = z.object({ material_id: z.string().uuid() });

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
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

type CoinRpcResult = {
  ok: boolean;
  locked: boolean;
  already_owned: boolean;
  free: boolean;
  spent: number;
  amount: number;
  balance: number;
  price: number;
  file_url: string;
  reason: string;
};

function toNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function jsonResult(value: unknown): CoinRpcResult {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    ok: Boolean(row["ok"]),
    locked: Boolean(row["locked"]),
    already_owned: Boolean(row["already_owned"]),
    free: Boolean(row["free"]),
    spent: toNumber(row["spent"]),
    amount: toNumber(row["amount"]),
    balance: toNumber(row["balance"]),
    price: toNumber(row["price"]),
    file_url: typeof row["file_url"] === "string" ? row["file_url"] : "",
    reason: typeof row["reason"] === "string" ? row["reason"] : "",
  };
}

export const list23KaatCoinPackages = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  if (!supabase) return [] as CoinPackageRow[];

  const { data, error } = await supabase
    .from("coin_packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("price", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as CoinPackageRow[];
});

export const getMy23KaatWallet = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [
      { data: balanceData, error: balanceError },
      { data: txs, error: txError },
      packagesResult,
    ] = await Promise.all([
      context.supabase.rpc("get_23kaat_balance", { _user_id: context.userId }),
      context.supabase
        .from("coin_transactions")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(20),
      context.supabase
        .from("coin_packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("price", { ascending: true }),
    ]);

    if (balanceError) throw new Error(balanceError.message);
    if (txError) throw new Error(txError.message);
    if (packagesResult.error) throw new Error(packagesResult.error.message);

    return {
      balance: Number(balanceData ?? 0),
      transactions: (txs ?? []) as CoinTransactionRow[],
      packages: packagesResult.data ?? [],
    };
  });

export const adminGrant23Kaat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => emailOrUserSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const profile = await findProfileByEmailOrId(context.supabase, data);
    const { data: result, error } = await context.supabase.rpc("grant_23kaat_to_user", {
      _user_id: profile.id,
      _amount: data.amount,
      _reason: data.reason,
      _related_type: data.related_type || "admin_grant",
      _related_id: data.related_id ?? null,
    });
    if (error) throw new Error(error.message);
    return { ...jsonResult(result), email: profile.email, full_name: profile.full_name };
  });

export const adminList23KaatLedger = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ query: z.string().trim().max(120).default("") }).parse(input ?? {}),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const [{ data: txs, error: txError }, { data: profiles, error: profileError }] =
      await Promise.all([
        context.supabase
          .from("coin_transactions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(300),
        context.supabase.from("profiles").select("*").limit(500),
      ]);
    if (txError) throw new Error(txError.message);
    if (profileError) throw new Error(profileError.message);

    const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    const query = data.query.toLowerCase();
    return ((txs ?? []) as CoinTransactionRow[])
      .map((tx) => ({ ...tx, student: profileById.get(tx.user_id) ?? null }))
      .filter((tx) => {
        if (!query) return true;
        const student = tx.student as ProfileRow | null;
        return [student?.full_name, student?.email, tx.reason, tx.source]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
  });

export const spend23KaatForCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => courseSpendSchema.parse(input))
  .handler(async ({ context, data }) => {
    const course = unwrap(
      await projectContent
        .from("courses")
        .select("*")
        .eq("id", data.course_id)
        .eq("status", "published")
        .single(),
    );
    const baseCoins = coinPriceOf(course);
    const couponInfo = data.coupon_code
      ? await resolveServerCouponDiscount({
          code: data.coupon_code,
          targetCourseId: course.id,
          originalAmountInr: Math.max(0, course.price ?? 0),
          originalCoins: baseCoins,
          userId: context.userId,
          recordRedemption: true,
        })
      : null;
    const effectiveCoins = couponInfo ? couponInfo.finalCoins : baseCoins;
    if (
      data.expected_coins !== undefined &&
      data.expected_coins !== effectiveCoins &&
      data.expected_coins !== baseCoins
    )
      throw new Error("Course coin price changed. Refresh checkout before paying.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("purchase_learning_item", {
      p_actor: context.userId,
      p_kind: "course",
      p_key: course.id,
      p_price: effectiveCoins,
    });
    if (error) throw new Error(error.message);
    return jsonResult(result);
  });

export const spend23KaatForSeries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => seriesSpendSchema.parse(input))
  .handler(async ({ context, data }) => {
    const series = await effectiveSeries(data.series_id);
    if (!series.enabled) throw new Error("This test series is currently unavailable.");
    const baseCoins = Math.max(0, series.priceCoins ?? series.priceInr ?? 0);
    const couponInfo = data.coupon_code
      ? await resolveServerCouponDiscount({
          code: data.coupon_code,
          targetCourseId: null,
          originalAmountInr: Math.max(0, series.priceInr ?? 0),
          originalCoins: baseCoins,
          userId: context.userId,
          recordRedemption: true,
        })
      : null;
    const coinPrice = couponInfo ? couponInfo.finalCoins : baseCoins;
    if (
      data.expected_coins !== undefined &&
      data.expected_coins !== coinPrice &&
      data.expected_coins !== baseCoins
    )
      throw new Error("Test series coin price changed. Refresh checkout before paying.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("purchase_learning_item", {
      p_actor: context.userId,
      p_kind: "series",
      p_key: series.id,
      p_price: coinPrice,
    });
    if (error) throw new Error(error.message);
    return jsonResult(result);
  });

export const spend23KaatForTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => testSpendSchema.parse(input))
  .handler(async ({ context, data }) => {
    const test = unwrap(
      await projectContent
        .from("tests")
        .select("*")
        .eq("id", data.test_id)
        .eq("is_published", true)
        .single(),
    );
    const baseCoins = test.is_paid ? Math.max(0, test.price_coins || test.price_inr || 0) : 0;
    const couponInfo = data.coupon_code
      ? await resolveServerCouponDiscount({
          code: data.coupon_code,
          targetCourseId: null,
          originalAmountInr: Math.max(0, test.price_inr ?? 0),
          originalCoins: baseCoins,
          userId: context.userId,
          recordRedemption: true,
        })
      : null;
    const coinPrice = couponInfo ? couponInfo.finalCoins : baseCoins;
    if (
      data.expected_coins !== undefined &&
      data.expected_coins !== coinPrice &&
      data.expected_coins !== baseCoins
    )
      throw new Error("Test coin price changed. Refresh checkout before paying.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: result, error } = await supabaseAdmin.rpc("purchase_learning_item", {
      p_actor: context.userId,
      p_kind: "test",
      p_key: test.id,
      p_price: coinPrice,
    });
    if (error) throw new Error(error.message);
    return jsonResult(result);
  });

export const completeRazorpayLearningPurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => razorpayCompleteSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: publicRows } = await projectContent
      .from("site_settings")
      .select("key, value")
      .in("key", ["payment_enabled", "razorpay_key_id"]);
    const settingMap = new Map((publicRows ?? []).map((r) => [r.key, r.value]));
    const keyId = (settingMap.get("razorpay_key_id") ?? "").trim();
    const isEnabled = Boolean(keyId) && settingMap.get("payment_enabled") !== "disabled_manual";
    if (!isEnabled || !keyId) {
      throw new Error(
        "Online payment (Razorpay) is currently off. Please contact Admin for offline payment.",
      );
    }

    const { data: secretRow } = await projectContent
      .from("private_settings")
      .select("value")
      .eq("key", "razorpay_key_secret")
      .maybeSingle();
    const keySecret = (secretRow?.value ?? "").trim();
    if (keySecret && data.razorpay_order_id && data.razorpay_signature) {
      const expectedSig = createHmac("sha256", keySecret)
        .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
        .digest("hex");
      if (expectedSig !== data.razorpay_signature) {
        throw new Error("Razorpay payment signature verification failed.");
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let amountInr = 0;

    if (data.kind === "course") {
      const course = unwrap(
        await projectContent
          .from("courses")
          .select("*")
          .eq("id", data.item_id)
          .eq("status", "published")
          .single(),
      );
      const baseInr = Math.max(0, course.price ?? 0);
      const couponInfo = data.coupon_code
        ? await resolveServerCouponDiscount({
            code: data.coupon_code,
            targetCourseId: course.id,
            originalAmountInr: baseInr,
            originalCoins: coinPriceOf(course),
            userId: context.userId,
            recordRedemption: true,
          })
        : null;
      amountInr = couponInfo ? couponInfo.finalAmount : baseInr;
      const couponNote = couponInfo?.coupon ? ` · Coupon ${couponInfo.coupon.code} (${couponInfo.discountPercent}% OFF)` : "";
      const { error } = await supabaseAdmin.from("course_enrollments").upsert(
        {
          user_id: context.userId,
          course_id: course.id,
          status: "active",
          source: "razorpay",
          payment_method: "razorpay",
          amount_paid: amountInr,
          currency: "INR",
          admin_note: `Razorpay payment ${data.razorpay_payment_id}${couponNote}`,
          created_by: context.userId,
        } as never,
        { onConflict: "user_id,course_id" },
      );
      if (error) throw new Error(error.message);
    } else if (data.kind === "series") {
      const series = await effectiveSeries(data.item_id);
      const baseInr = Math.max(0, series.priceInr ?? 0);
      const couponInfo = data.coupon_code
        ? await resolveServerCouponDiscount({
            code: data.coupon_code,
            targetCourseId: null,
            originalAmountInr: baseInr,
            originalCoins: Math.max(0, series.priceCoins ?? baseInr),
            userId: context.userId,
            recordRedemption: true,
          })
        : null;
      amountInr = couponInfo ? couponInfo.finalAmount : baseInr;
      const couponNote = couponInfo?.coupon ? ` · Coupon ${couponInfo.coupon.code} (${couponInfo.discountPercent}% OFF)` : "";
      const { error } = await supabaseAdmin.from("series_access_grants").upsert(
        {
          user_id: context.userId,
          series_id: series.id,
          granted_by: context.userId,
          method: "razorpay",
          amount_inr: amountInr,
          note: `Razorpay payment ${data.razorpay_payment_id}${couponNote}`,
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
          method: "razorpay",
          amount_inr: amountInr,
          note: `Razorpay payment ${data.razorpay_payment_id}${couponNote}`,
        } as never);
      }
    } else if (data.kind === "test") {
      const test = unwrap(
        await projectContent
          .from("tests")
          .select("*")
          .eq("id", data.item_id)
          .eq("is_published", true)
          .single(),
      );
      const baseInr = Math.max(0, test.price_inr ?? 0);
      const couponInfo = data.coupon_code
        ? await resolveServerCouponDiscount({
            code: data.coupon_code,
            targetCourseId: null,
            originalAmountInr: baseInr,
            originalCoins: Math.max(0, test.price_coins ?? baseInr),
            userId: context.userId,
            recordRedemption: true,
          })
        : null;
      amountInr = couponInfo ? couponInfo.finalAmount : baseInr;
      const couponNote = couponInfo?.coupon ? ` · Coupon ${couponInfo.coupon.code} (${couponInfo.discountPercent}% OFF)` : "";
      await supabaseAdmin.from("test_access_grants").insert({
        user_id: context.userId,
        test_id: test.id,
        granted_by: context.userId,
        method: "razorpay",
        amount_inr: amountInr,
        note: `Razorpay payment ${data.razorpay_payment_id}${couponNote}`,
      } as never);
    }

    return { ok: true, kind: data.kind, item_id: data.item_id, amountInr };
  });

export const completeRazorpayCoinPackPurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => razorpayCoinPackSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: publicRows } = await projectContent
      .from("site_settings")
      .select("key, value")
      .in("key", ["payment_enabled", "razorpay_key_id"]);
    const settingMap = new Map((publicRows ?? []).map((r) => [r.key, r.value]));
    const keyId = (settingMap.get("razorpay_key_id") ?? "").trim();
    const isEnabled = Boolean(keyId) && settingMap.get("payment_enabled") !== "disabled_manual";
    if (!isEnabled || !keyId) {
      throw new Error(
        "Online payment (Razorpay) is currently off. Please contact Admin for offline payment.",
      );
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: pack, error: packError } = await supabaseAdmin
      .from("coin_packages")
      .select("*")
      .eq("id", data.package_id)
      .eq("is_active", true)
      .single();
    if (packError || !pack) throw new Error("Coin pack not found.");

    const totalCoins = Math.max(1, (pack.coins ?? 0) + (pack.bonus_coins ?? 0));
    const { data: result, error } = await supabaseAdmin.rpc("grant_23kaat_to_user", {
      _user_id: context.userId,
      _amount: totalCoins,
      _reason: `Razorpay coin pack purchase (${pack.title} · ${data.razorpay_payment_id})`,
      _related_type: "coin_package",
      _related_id: pack.id,
    });
    if (error) throw new Error(error.message);
    return { ...jsonResult(result), credited: totalCoins, title: pack.title };
  });

export const getMyMaterialAccessUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => materialSchema.parse(input))
  .handler(async ({ context, data }) => {
    return materialForStudent(context, data.material_id);
  });

export const spend23KaatForMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => materialSchema.parse(input))
  .handler(async ({ context, data }) => {
    const material = unwrap(
      await projectContent
        .from("materials")
        .select("*")
        .eq("id", data.material_id)
        .eq("is_published", true)
        .single(),
    );
    const mode =
      material.access_type || (material.price > 0 || material.coin_price > 0 ? "paid" : "course");
    if (mode === "course") return materialForStudent(context, material.id);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const result = unwrap(
      await supabaseAdmin.rpc("purchase_learning_item", {
        p_actor: context.userId,
        p_kind: "material",
        p_key: material.id,
        p_price: mode === "free" ? 0 : coinPriceOf(material),
      }),
    );
    return {
      ...(result as Record<string, unknown>),
      ...(await materialForStudent(context, material.id)),
    };
  });
