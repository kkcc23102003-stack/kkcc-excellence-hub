/**
 * Pure analytics maths.
 *
 * Kept free of any database access so the money calculations can be unit
 * tested: the server function only fetches rows, every figure the owner sees is
 * produced here.
 */

export type LedgerRow = {
  id: string;
  user_id: string | null;
  course_id: string | null;
  provider: string;
  status: string;
  amount: number | null;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type AttemptRow = {
  user_id: string;
  score: number | null;
  total_marks: number | null;
  subject: string | null;
  submitted_at: string | null;
};

export type ProfileRow = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string;
};

export type RedemptionRow = {
  coupon_id: string;
  discount_amount: number | null;
  final_amount: number | null;
  created_at: string;
};

export type CouponRow = {
  id: string;
  code: string;
  used_count: number;
  max_uses: number;
  is_active: boolean;
};

export const KIND_LABELS: Record<string, string> = {
  course: "Batches / Courses",
  series: "Test Series",
  test: "Individual Tests",
  coin_pack: "23KAAT Coin Packs",
};

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function kindOf(row: LedgerRow): string {
  const meta = row.metadata ?? {};
  const kind = meta["kind"];
  if (typeof kind === "string" && kind) return kind;
  return row.course_id ? "course" : "other";
}

export function titleOf(row: LedgerRow): string {
  const meta = row.metadata ?? {};
  const title = meta["item_title"];
  return typeof title === "string" && title.trim() ? title.trim() : "Untitled item";
}

export function amountOf(row: LedgerRow): number {
  return Math.max(0, Math.round(row.amount ?? 0));
}

/** Only rows marked paid are money. Pending checkouts are reported separately. */
export function paidRows(ledger: LedgerRow[]): LedgerRow[] {
  return ledger.filter((row) => row.status === "paid");
}

export function sumAmount(rows: LedgerRow[]): number {
  return rows.reduce((total, row) => total + amountOf(row), 0);
}

/**
 * Daily revenue for the last `days` days, oldest first.
 * A day with no payment is included with zero, so the chart has no gaps.
 */
export function buildDailySeries(
  ledger: LedgerRow[],
  days = 30,
  now = new Date(),
): { date: string; amount: number; payments: number }[] {
  const paid = paidRows(ledger);
  const series: { date: string; amount: number; payments: number }[] = [];
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = dayKey(new Date(now.getTime() - index * 24 * 60 * 60 * 1000).toISOString());
    const dayRows = paid.filter((row) => dayKey(row.created_at) === date);
    series.push({ date, amount: sumAmount(dayRows), payments: dayRows.length });
  }
  return series;
}

export function revenueWindow(ledger: LedgerRow[], days: number, now = new Date()): number {
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  return sumAmount(paidRows(ledger).filter((row) => row.created_at >= cutoff));
}

export function revenueToday(ledger: LedgerRow[], now = new Date()): number {
  const today = dayKey(now.toISOString());
  return sumAmount(paidRows(ledger).filter((row) => dayKey(row.created_at) === today));
}

export function revenueByKind(ledger: LedgerRow[]) {
  return Object.entries(KIND_LABELS).map(([kind, label]) => {
    const rows = paidRows(ledger).filter((row) => kindOf(row) === kind);
    return { kind, label, count: rows.length, amount: sumAmount(rows) };
  });
}

export function revenueByProvider(ledger: LedgerRow[]) {
  return ["razorpay", "offline"]
    .map((provider) => {
      const rows = paidRows(ledger).filter((row) => (row.provider || "razorpay") === provider);
      return { provider, count: rows.length, amount: sumAmount(rows) };
    })
    .filter((entry) => entry.count > 0);
}

export function topSellingItems(ledger: LedgerRow[], limit = 8) {
  const map = new Map<string, { title: string; kind: string; count: number; amount: number }>();
  for (const row of paidRows(ledger)) {
    const kind = kindOf(row);
    const title = titleOf(row);
    const key = `${kind}::${title}`;
    const entry = map.get(key) ?? { title, kind, count: 0, amount: 0 };
    entry.count += 1;
    entry.amount += amountOf(row);
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => b.amount - a.amount).slice(0, limit);
}

export function attemptPercent(row: AttemptRow): number {
  const total = row.total_marks ?? 0;
  if (total <= 0) return 0;
  return ((row.score ?? 0) / total) * 100;
}

/** Average score percentage across every submitted paper with marks. */
export function averagePercent(attempts: AttemptRow[]): number {
  const scored = attempts.filter((row) => (row.total_marks ?? 0) > 0);
  if (!scored.length) return 0;
  const total = scored.reduce((sum, row) => sum + attemptPercent(row), 0);
  return Math.round((total / scored.length) * 10) / 10;
}

/** Subject-wise strength, busiest subjects first. */
export function subjectStrength(attempts: AttemptRow[], limit = 12) {
  const map = new Map<string, { subject: string; attempts: number; percent: number }>();
  for (const row of attempts.filter((item) => (item.total_marks ?? 0) > 0)) {
    const subject = (row.subject ?? "").trim() || "Unclassified";
    const entry = map.get(subject) ?? { subject, attempts: 0, percent: 0 };
    entry.attempts += 1;
    entry.percent += attemptPercent(row);
    map.set(subject, entry);
  }
  return [...map.values()]
    .map((entry) => ({
      subject: entry.subject,
      attempts: entry.attempts,
      averagePercent: Math.round((entry.percent / entry.attempts) * 10) / 10,
    }))
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, limit);
}

export function couponPerformance(
  redemptions: RedemptionRow[],
  coupons: CouponRow[],
  now = new Date(),
) {
  const since30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const recent = redemptions.filter((row) => row.created_at >= since30);
  const usage = new Map<string, { code: string; count: number; discount: number }>();
  for (const row of recent) {
    const coupon = coupons.find((item) => item.id === row.coupon_id);
    const entry = usage.get(row.coupon_id) ?? {
      code: coupon?.code ?? "deleted coupon",
      count: 0,
      discount: 0,
    };
    entry.count += 1;
    entry.discount += Math.max(0, Math.round(row.discount_amount ?? 0));
    usage.set(row.coupon_id, entry);
  }
  return {
    redemptions30: recent.length,
    discountGiven30: recent.reduce(
      (total, row) => total + Math.max(0, Math.round(row.discount_amount ?? 0)),
      0,
    ),
    discountedRevenue30: recent.reduce(
      (total, row) => total + Math.max(0, Math.round(row.final_amount ?? 0)),
      0,
    ),
    topCoupons: [...usage.values()].sort((a, b) => b.count - a.count).slice(0, 6),
    nearLimit: coupons.filter(
      (coupon) => coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses - 3,
    ).length,
  };
}

/** Students who never attempted anything and never paid — worth a call. */
export function studentsNeedingAttention(
  profiles: ProfileRow[],
  attempts: AttemptRow[],
  paidUserIds: Set<string>,
  limit = 25,
) {
  const active = new Set(attempts.map((row) => row.user_id));
  return profiles
    .filter((profile) => !active.has(profile.id) && !paidUserIds.has(profile.id))
    .slice(0, limit)
    .map((profile) => ({
      name: profile.full_name?.trim() || profile.email.split("@")[0] || "Student",
      email: profile.email,
    }));
}

export function topSupporters(
  profiles: ProfileRow[],
  attempts: AttemptRow[],
  ledger: LedgerRow[],
  limit = 8,
) {
  const byId = new Map(profiles.map((profile) => [profile.id, profile]));
  const paidByUser = new Map<string, number>();
  for (const row of paidRows(ledger)) {
    if (!row.user_id) continue;
    paidByUser.set(row.user_id, (paidByUser.get(row.user_id) ?? 0) + amountOf(row));
  }
  return [...paidByUser.entries()]
    .map(([userId, paidInr]) => {
      const profile = byId.get(userId);
      if (!profile) return null;
      return {
        name: profile.full_name?.trim() || profile.email.split("@")[0] || "Student",
        email: profile.email,
        paidInr,
        attempts: attempts.filter((row) => row.user_id === userId).length,
      };
    })
    .filter((entry): entry is { name: string; email: string; paidInr: number; attempts: number } =>
      Boolean(entry),
    )
    .sort((a, b) => b.paidInr - a.paidInr)
    .slice(0, limit);
}

export function paidUserIds(ledger: LedgerRow[]): Set<string> {
  return new Set(
    paidRows(ledger)
      .map((row) => row.user_id)
      .filter((value): value is string => Boolean(value)),
  );
}
