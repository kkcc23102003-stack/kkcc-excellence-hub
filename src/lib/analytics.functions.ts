/**
 * Business analytics for the owner.
 *
 * Everything here is computed from tables that already exist in
 * `KKCC-Excellence-Hub-PRODUCTION-SQL.sql` — `payment_transactions` (the money
 * ledger), the access grant tables, `coupon_redemptions`, `profiles`,
 * `learning_attempts`, `student_doubts` and `admission_enquiries`. No schema
 * change is needed to read any of it.
 *
 * Rules kept from the rest of the app:
 *   - anonymous students are never counted as revenue,
 *   - a "paid" row is only trusted when it is marked paid (an abandoned checkout
 *     stays pending and is reported separately, not hidden),
 *   - coin purchases are revenue only when the ledger recorded a rupee price;
 *     coins granted by hand are reported as a liability instead.
 */
import { createServerFn } from "@tanstack/react-start";
import { assertAdmin } from "@/lib/learning.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  amountOf,
  attemptPercent,
  kindOf,
  titleOf,
  averagePercent,
  buildDailySeries,
  couponPerformance,
  paidRows,
  paidUserIds,
  revenueByKind,
  revenueByProvider,
  revenueToday,
  revenueWindow,
  studentsNeedingAttention,
  subjectStrength,
  sumAmount,
  topSellingItems,
  topSupporters,
  type AttemptRow,
  type CouponRow,
  type LedgerRow,
  type ProfileRow,
  type RedemptionRow,
} from "@/lib/analytics";

type SeriesGrantRow = {
  series_id: string;
  amount_inr: number | null;
  method: string;
  created_at: string;
};
type TestGrantRow = {
  test_id: string;
  amount_inr: number | null;
  method: string;
  created_at: string;
};
type EnrollmentRow = {
  course_id: string;
  amount_paid: number | null;
  source: string | null;
  created_at: string;
};

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export const adminAnalyticsSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since30 = daysAgo(30);
    const since7 = daysAgo(7);
    const since90 = daysAgo(90);

    const [
      ledgerResult,
      seriesResult,
      testResult,
      enrollmentResult,
      redemptionResult,
      profileResult,
      attemptResult,
      doubtResult,
      enquiryResult,
      offlineResult,
      couponResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("payment_transactions")
        .select(
          "id, user_id, course_id, provider, status, amount, provider_order_id, provider_payment_id, metadata, created_at",
        )
        .gte("created_at", since90)
        .order("created_at", { ascending: false })
        .limit(4000),
      supabaseAdmin
        .from("series_access_grants")
        .select("series_id, amount_inr, method, created_at")
        .limit(3000),
      supabaseAdmin
        .from("test_access_grants")
        .select("test_id, amount_inr, method, created_at")
        .limit(3000),
      supabaseAdmin
        .from("course_enrollments")
        .select("course_id, amount_paid, source, created_at")
        .limit(3000),
      supabaseAdmin
        .from("coupon_redemptions")
        .select("coupon_id, discount_amount, final_amount, created_at")
        .gte("created_at", since30)
        .limit(3000),
      supabaseAdmin.from("profiles").select("id, created_at, full_name, email").limit(5000),
      supabaseAdmin
        .from("learning_attempts")
        .select("user_id, score, total_marks, source_refs, submitted_at")
        .eq("status", "submitted")
        .gte("submitted_at", since30)
        .limit(5000),
      supabaseAdmin.from("student_doubts").select("id, status").limit(2000),
      supabaseAdmin.from("admission_enquiries").select("id, status").limit(2000),
      supabaseAdmin.from("offline_access_grants").select("id, status, amount_paid").limit(2000),
      supabaseAdmin
        .from("coupon_codes")
        .select("id, code, used_count, max_uses, is_active")
        .limit(1000),
    ]);

    const ledger = (ledgerResult.data ?? []) as LedgerRow[];
    const seriesGrants = (seriesResult.data ?? []) as SeriesGrantRow[];
    const testGrants = (testResult.data ?? []) as TestGrantRow[];
    const enrollments = (enrollmentResult.data ?? []) as EnrollmentRow[];
    const redemptions = (redemptionResult.data ?? []) as RedemptionRow[];
    const profiles = (profileResult.data ?? []) as ProfileRow[];
    if (attemptResult.error)
      throw new Error(`Test analytics unavailable: ${attemptResult.error.message}`);
    const attempts: AttemptRow[] = (attemptResult.data ?? []).map((row) => {
      const ref = (row.source_refs || []).find((ref: string) => ref.startsWith("__kkcc_meta__:"));
      let subject = "Unknown";
      try {
        subject = ref
          ? decodeURIComponent(ref.slice("__kkcc_meta__:".length).split(":")[0] || "")
          : "Unknown";
      } catch {
        /* legacy malformed metadata */
      }
      return { ...row, subject };
    });
    const doubts = (doubtResult.data ?? []) as { id: string; status: string }[];
    const enquiries = (enquiryResult.data ?? []) as { id: string; status: string }[];
    const offlineGrants = (offlineResult.data ?? []) as {
      id: string;
      status: string;
      amount_paid: number | null;
    }[];
    const coupons = (couponResult.data ?? []) as {
      id: string;
      code: string;
      used_count: number;
      max_uses: number;
      is_active: boolean;
    }[];

    /* ------------------------------------------------------------------ money */

    const paid = paidRows(ledger);
    const revenueTodayValue = revenueToday(ledger);
    const revenue7 = revenueWindow(ledger, 7);
    const revenue30 = revenueWindow(ledger, 30);
    const revenueAllTime = sumAmount(paid);
    const series = buildDailySeries(ledger, 30);
    const byKind = revenueByKind(ledger);
    const providers = revenueByProvider(ledger);
    const topItems = topSellingItems(ledger);

    const pendingCheckouts = ledger.filter((row) => row.status === "pending");
    const abandonedAmount = sumAmount(pendingCheckouts);

    /* --------------------------------------------------------------- students */

    const students = profiles.filter((profile) => Boolean(profile.id));
    const studentById = new Map(students.map((profile) => [profile.id, profile]));
    const newStudents30 = students.filter((profile) => profile.created_at >= since30).length;
    const activeUserIds = new Set(attempts.map((row) => row.user_id));
    const payingUserIds = paidUserIds(ledger);
    const averagePercentValue = averagePercent(attempts);
    const subjectStrengthRows = subjectStrength(attempts);
    const engaged = topSupporters(students, attempts, ledger);
    const inactive = studentsNeedingAttention(students, attempts, payingUserIds);

    /** Best student in the class by average score, so the owner can praise them. */
    const perStudent = new Map<string, { percent: number; count: number }>();
    for (const row of attempts) {
      if ((row.total_marks ?? 0) <= 0) continue;
      const entry = perStudent.get(row.user_id) ?? { percent: 0, count: 0 };
      entry.percent += attemptPercent(row);
      entry.count += 1;
      perStudent.set(row.user_id, entry);
    }
    const topper =
      [...perStudent.entries()]
        .map(([userId, entry]) => {
          const profile = studentById.get(userId);
          if (!profile) return null;
          return {
            name: profile.full_name?.trim() || profile.email.split("@")[0] || "Student",
            averagePercent: Math.round((entry.percent / entry.count) * 10) / 10,
            papers: entry.count,
          };
        })
        .filter((entry): entry is { name: string; averagePercent: number; papers: number } =>
          Boolean(entry),
        )
        .sort((a, b) => b.averagePercent - a.averagePercent)[0] ?? null;

    /* ---------------------------------------------------------------- coupons */

    const couponStats = couponPerformance(redemptions, coupons);

    /* ------------------------------------------------------------------ queue */

    const queue = {
      openDoubts: doubts.filter((row) => row.status !== "answered" && row.status !== "closed")
        .length,
      newEnquiries: enquiries.filter((row) => row.status === "new").length,
      pendingOfflineGrants: offlineGrants.filter((row) => row.status === "pending").length,
      abandonedCheckouts: pendingCheckouts.length,
    };

    const offlineRevenue = offlineGrants
      .filter((row) => row.status === "activated")
      .reduce((total, row) => total + Math.max(0, Math.round(row.amount_paid ?? 0)), 0);

    return {
      generatedAt: new Date().toISOString(),
      revenue: {
        today: revenueTodayValue,
        last7: revenue7,
        last30: revenue30,
        allTime: revenueAllTime,
        offlineAllTime: offlineRevenue,
        averageOrderValue: paid.length ? Math.round(revenueAllTime / paid.length) : 0,
        paidPayments: paid.length,
        abandonedCheckouts: pendingCheckouts.length,
        abandonedAmount,
        series,
        byKind,
        byProvider: providers,
        topItems,
      },
      access: {
        batchEnrollments: enrollments.length,
        seriesGrants: seriesGrants.length,
        testGrants: testGrants.length,
        paidSeriesPercentage: seriesGrants.length
          ? Math.round(
              (seriesGrants.filter((row) => (row.amount_inr ?? 0) > 0).length /
                seriesGrants.length) *
                100,
            )
          : 0,
      },
      students: {
        total: students.length,
        newLast30: newStudents30,
        activeLast30: activeUserIds.size,
        paying: payingUserIds.size,
        attempts30: attempts.length,
        averagePercent: averagePercentValue,
        subjectStrength: subjectStrengthRows,
        topper,
        topSpenders: engaged,
        needsAttention: inactive,
      },
      coupons: {
        active: coupons.filter((coupon) => coupon.is_active).length,
        total: coupons.length,
        redemptions30: couponStats.redemptions30,
        discountGiven30: couponStats.discountGiven30,
        discountedRevenue30: couponStats.discountedRevenue30,
        topCoupons: couponStats.topCoupons,
        nearLimit: couponStats.nearLimit,
      },
      queue,
    };
  });

/**
 * Payment ledger export for the accountant.
 *
 * Returns plain rows, formatted on the client into CSV, so the owner can
 * reconcile Razorpay settlements against the books without reading the database.
 */
export const adminExportPaymentLedger = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("payment_transactions")
      .select(
        "id, user_id, course_id, provider, status, amount, provider_order_id, provider_payment_id, admin_note, metadata, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) throw new Error(error.message);

    const ledger = (rows ?? []) as unknown as (LedgerRow & {
      admin_note: string | null;
    })[];
    const userIds = [
      ...new Set(
        ledger.map((row) => row.user_id).filter((value): value is string => Boolean(value)),
      ),
    ];

    // One lookup for the whole page of rows, not one request per row.
    const emails = new Map<string, string>();
    if (userIds.length) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);
      for (const profile of (profiles ?? []) as {
        id: string;
        email: string;
        full_name: string | null;
      }[]) {
        emails.set(
          profile.id,
          profile.full_name?.trim() ? `${profile.full_name} <${profile.email}>` : profile.email,
        );
      }
    }

    return ledger.map((row) => ({
      date: row.created_at,
      status: row.status,
      provider: row.provider || "razorpay",
      kind: kindOf(row),
      item: titleOf(row),
      amount: amountOf(row),
      student: row.user_id ? (emails.get(row.user_id) ?? row.user_id) : "—",
      order_id: row.provider_order_id ?? "",
      payment_id: row.provider_payment_id ?? "",
      note: row.admin_note ?? "",
    }));
  });
