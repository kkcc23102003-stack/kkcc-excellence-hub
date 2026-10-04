/**
 * One place that decides what a learning item costs and how access is granted.
 *
 * Everything that can unlock a Batch, a Test Series or a Test — Razorpay,
 * 23KAAT coins, an offline request approved by the admin, a recovered payment —
 * goes through here, so the price the student sees, the price the server
 * charges and the price recorded in the database can never drift apart.
 *
 * Server only.
 */
import { coinPriceOf } from "@/lib/cms";
import { resolveServerCouponDiscount } from "@/lib/coupons.functions";
import { effectiveSeries, unwrap } from "@/lib/learning.server";
import { projectContent } from "@/lib/project-content.server";
import type { CourseRow, TestRow } from "@/integrations/supabase/db";

export type LearningKind = "course" | "series" | "test";

export type LearningItem = {
  id: string;
  kind: LearningKind;
  title: string;
  /** Rupee price before any coupon. */
  baseInr: number;
  /** 23KAAT coin price before any coupon. */
  baseCoins: number;
};

export type ResolvedLearningPrice = {
  item: LearningItem;
  baseInr: number;
  baseCoins: number;
  finalInr: number;
  finalCoins: number;
  coupon: {
    code: string;
    title: string;
    discountPercent: number;
    discountAmount: number;
    discountCoins: number;
  } | null;
  /** Human readable suffix recorded with the enrollment. */
  note: string;
};

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Load one item with its real server side price. */
export async function loadLearningItem(kind: LearningKind, itemId: string): Promise<LearningItem> {
  if (kind === "course") {
    const course = unwrap(
      await projectContent
        .from("courses")
        .select("*")
        .eq("id", itemId)
        .eq("status", "published")
        .single(),
    ) as CourseRow;
    return {
      id: course.id,
      kind,
      title: course.title,
      baseInr: Math.max(0, course.price ?? 0),
      baseCoins: coinPriceOf(course),
    };
  }

  if (kind === "series") {
    const series = await effectiveSeries(itemId);
    if (!series.enabled) throw new Error("This test series is currently unavailable.");
    const baseInr = Math.max(0, series.priceInr ?? 0);
    return {
      id: series.id,
      kind,
      title: series.name,
      baseInr,
      baseCoins: Math.max(0, series.priceCoins ?? baseInr),
    };
  }

  const test = unwrap(
    await projectContent
      .from("tests")
      .select("*")
      .eq("id", itemId)
      .eq("is_published", true)
      .single(),
  ) as TestRow;
  const baseInr = test.is_paid ? Math.max(0, test.price_inr ?? 0) : 0;
  return {
    id: test.id,
    kind,
    title: test.title,
    baseInr,
    baseCoins: test.is_paid ? Math.max(0, test.price_coins || test.price_inr || 0) : 0,
  };
}

/**
 * Price an item for one student with an optional coupon.
 *
 * `recordRedemption` must be true only on the call that actually unlocks the
 * item — pricing/quoting a coupon must never burn a use.
 */
export async function resolveLearningPrice(input: {
  kind: LearningKind;
  itemId: string;
  couponCode?: string | undefined;
  userId?: string | undefined;
  recordRedemption?: boolean;
}): Promise<ResolvedLearningPrice> {
  const item = await loadLearningItem(input.kind, input.itemId);
  const code = (input.couponCode ?? "").trim();

  if (!code) {
    return {
      item,
      baseInr: item.baseInr,
      baseCoins: item.baseCoins,
      finalInr: item.baseInr,
      finalCoins: item.baseCoins,
      coupon: null,
      note: "",
    };
  }

  const couponInfo = await resolveServerCouponDiscount({
    code,
    targetCourseId: input.kind === "course" ? item.id : null,
    originalAmountInr: item.baseInr,
    originalCoins: item.baseCoins,
    ...(input.userId ? { userId: input.userId } : {}),
    recordRedemption: input.recordRedemption ?? false,
  });

  const coupon = couponInfo.coupon
    ? {
        code: couponInfo.coupon.code,
        title: couponInfo.coupon.title ?? "",
        discountPercent: couponInfo.discountPercent,
        discountAmount: couponInfo.discountAmount,
        discountCoins: couponInfo.discountCoins,
      }
    : null;

  return {
    item,
    baseInr: item.baseInr,
    baseCoins: item.baseCoins,
    finalInr: couponInfo.finalAmount,
    finalCoins: couponInfo.finalCoins,
    coupon,
    note: coupon ? ` · Coupon ${coupon.code} (${coupon.discountPercent}% OFF)` : "",
  };
}

/**
 * Grant access after a payment is confirmed. Safe to call twice: every branch
 * is an idempotent upsert or a guarded insert, so a retried callback, a
 * recovered payment or an admin re-grant never double-enrolls a student.
 */
export async function grantLearningPurchase(input: {
  userId: string;
  kind: LearningKind;
  itemId: string;
  amountInr: number;
  couponCode?: string | undefined;
  /** e.g. "Razorpay payment pay_xxx" or "Razorpay recovery pay_xxx". */
  reference: string;
  /** "razorpay" for online, "offline" for admin approved, "coins" for 23KAAT. */
  method?: string;
}): Promise<{ kind: LearningKind; itemId: string; title: string; amountInr: number }> {
  const supabaseAdmin = await adminClient();
  // Price is recomputed (coupon NOT re-recorded here — the calling handler owns
  // that exactly once) so a tampered client cannot under-report what was paid.
  const price = await resolveLearningPrice({
    kind: input.kind,
    itemId: input.itemId,
    couponCode: input.couponCode,
    userId: input.userId,
    recordRedemption: false,
  });

  const couponNote = price.coupon
    ? ` · Coupon ${price.coupon.code} (${price.coupon.discountPercent}% OFF)`
    : "";
  const note = `${input.reference}${couponNote}`;
  const method = input.method ?? "razorpay";
  const amountInr = Math.max(0, Math.round(input.amountInr));
  const paidAmount = amountInr > 0 ? amountInr : price.finalInr;

  if (input.kind === "course") {
    const { error } = await supabaseAdmin.from("course_enrollments").upsert(
      {
        user_id: input.userId,
        course_id: price.item.id,
        status: "active",
        source: method,
        payment_method: method,
        amount_paid: paidAmount,
        currency: "INR",
        admin_note: note,
        created_by: input.userId,
      } as never,
      { onConflict: "user_id,course_id" },
    );
    if (error) throw new Error(error.message);
  } else if (input.kind === "series") {
    const { error } = await supabaseAdmin.from("series_access_grants").upsert(
      {
        user_id: input.userId,
        series_id: price.item.id,
        granted_by: input.userId,
        method,
        amount_inr: paidAmount,
        note,
        expires_at: null,
        revoked_at: null,
      } as never,
      { onConflict: "series_id,user_id" },
    );
    if (error) {
      await supabaseAdmin.from("series_access_grants").insert({
        user_id: input.userId,
        series_id: price.item.id,
        granted_by: input.userId,
        method,
        amount_inr: paidAmount,
        note,
      } as never);
    }
  } else {
    await supabaseAdmin.from("test_access_grants").insert({
      user_id: input.userId,
      test_id: price.item.id,
      granted_by: input.userId,
      method,
      amount_inr: paidAmount,
      note,
    } as never);
  }

  return {
    kind: input.kind,
    itemId: price.item.id,
    title: price.item.title,
    amountInr: paidAmount,
  };
}

/** True when the student already has access, so a retry never double-charges. */
export async function hasLearningAccess(
  userId: string,
  kind: LearningKind,
  itemId: string,
): Promise<boolean> {
  const supabaseAdmin = await adminClient();
  if (kind === "course") {
    const { count } = await supabaseAdmin
      .from("course_enrollments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("course_id", itemId)
      .eq("status", "active");
    return (count ?? 0) > 0;
  }
  if (kind === "series") {
    const { count } = await supabaseAdmin
      .from("series_access_grants")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("series_id", itemId)
      .is("revoked_at", null);
    return (count ?? 0) > 0;
  }
  const { count } = await supabaseAdmin
    .from("test_access_grants")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("test_id", itemId);
  return (count ?? 0) > 0;
}

export type CoinPack = {
  id: string;
  title: string;
  coins: number;
  bonusCoins: number;
  totalCoins: number;
  priceInr: number;
};

export async function loadCoinPack(packageId: string): Promise<CoinPack> {
  const supabaseAdmin = await adminClient();
  const { data, error } = await supabaseAdmin
    .from("coin_packages")
    .select("*")
    .eq("id", packageId)
    .eq("is_active", true)
    .single();
  if (error || !data) throw new Error("Coin pack not found.");
  const pack = data as unknown as {
    id: string;
    title: string;
    coins: number | null;
    bonus_coins: number | null;
    price: number | null;
  };
  const coins = Math.max(0, pack.coins ?? 0);
  const bonusCoins = Math.max(0, pack.bonus_coins ?? 0);
  return {
    id: pack.id,
    title: pack.title,
    coins,
    bonusCoins,
    totalCoins: Math.max(1, coins + bonusCoins),
    priceInr: Math.max(0, pack.price ?? 0),
  };
}

/** Credit a purchased coin pack. Idempotency is enforced by the payment guard. */
export async function grantCoinPackPurchase(input: {
  userId: string;
  packageId: string;
  reference: string;
}): Promise<{ credited: number; title: string; balance: number | null }> {
  const supabaseAdmin = await adminClient();
  const pack = await loadCoinPack(input.packageId);
  const { data, error } = await supabaseAdmin.rpc("grant_23kaat_to_user", {
    _user_id: input.userId,
    _amount: pack.totalCoins,
    _reason: `Razorpay coin pack purchase (${pack.title} · ${input.reference})`,
    _related_type: "coin_package",
    _related_id: pack.id,
  });
  if (error) throw new Error(error.message);
  const balance = (data as { balance?: number } | null)?.balance;
  return {
    credited: pack.totalCoins,
    title: pack.title,
    balance: typeof balance === "number" ? balance : null,
  };
}
