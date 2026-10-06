import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  averagePercent,
  buildDailySeries,
  couponPerformance,
  kindOf,
  paidRows,
  paidUserIds,
  revenueByKind,
  revenueByProvider,
  revenueToday,
  revenueWindow,
  studentsNeedingAttention,
  subjectStrength,
  sumAmount,
  titleOf,
  topSellingItems,
  topSupporters,
  type AttemptRow,
  type CouponRow,
  type LedgerRow,
  type ProfileRow,
  type RedemptionRow,
} from "../../src/lib/analytics";

const NOW = new Date("2026-10-04T12:00:00.000Z");

/** `in` checks (not `??`) so an explicit null override is honoured. */
function ledgerRow(overrides: Partial<LedgerRow>): LedgerRow {
  const pick = <K extends keyof LedgerRow>(key: K, fallback: LedgerRow[K]): LedgerRow[K] =>
    key in overrides ? (overrides[key] as LedgerRow[K]) : fallback;
  return {
    id: pick("id", "row-1"),
    user_id: pick("user_id", "user-1"),
    course_id: pick("course_id", null),
    provider: pick("provider", "razorpay"),
    status: pick("status", "paid"),
    amount: pick("amount", 500),
    provider_order_id: pick("provider_order_id", "order_1"),
    provider_payment_id: pick("provider_payment_id", "pay_1"),
    metadata: pick("metadata", { kind: "course", item_id: "c1", item_title: "Batch A" }),
    created_at: pick("created_at", "2026-10-04T09:00:00.000Z"),
  };
}

test("Only confirmed payments count as revenue; abandoned checkouts are separate", () => {
  const ledger = [
    ledgerRow({ id: "a", status: "paid", amount: 1000, created_at: "2026-10-04T08:00:00.000Z" }),
    ledgerRow({ id: "b", status: "pending", amount: 2500, created_at: "2026-10-04T09:00:00.000Z" }),
    ledgerRow({ id: "c", status: "failed", amount: 700, created_at: "2026-10-04T10:00:00.000Z" }),
    ledgerRow({ id: "d", status: "paid", amount: 500, created_at: "2026-10-02T10:00:00.000Z" }),
  ];
  // `sumAmount` is a raw sum; money is only ever `sumAmount(paidRows(...))`.
  assert.equal(sumAmount(ledger), 4700);
  assert.equal(sumAmount(paidRows(ledger)), 1500);
  assert.equal(revenueToday(ledger, NOW), 1000);
  assert.equal(revenueWindow(ledger, 30, NOW), 1500);

  // The abandoned checkout is visible on its own, never mixed into revenue.
  const pending = ledger.filter((row) => row.status === "pending");
  assert.equal(sumAmount(pending), 2500);
});

test("Daily series is oldest first, gap free and 30 days long", () => {
  const ledger = [
    ledgerRow({ id: "a", amount: 100, created_at: "2026-10-04T05:00:00.000Z" }),
    ledgerRow({ id: "b", amount: 900, created_at: "2026-10-04T06:00:00.000Z" }),
    ledgerRow({ id: "c", amount: 400, created_at: "2026-09-20T06:00:00.000Z" }),
    ledgerRow({ id: "d", status: "pending", amount: 9999, created_at: "2026-10-04T07:00:00.000Z" }),
  ];
  const series = buildDailySeries(ledger, 30, NOW);
  assert.equal(series.length, 30);
  assert.equal(series[0]!.date, "2026-09-05");
  assert.equal(series[series.length - 1]!.date, "2026-10-04");
  assert.equal(series[series.length - 1]!.amount, 1000);
  assert.equal(series[series.length - 1]!.payments, 2);
  // A day with nothing is a zero, not a hole.
  const emptyDay = series.find((day) => day.date === "2026-10-01");
  assert.equal(emptyDay?.amount, 0);
});

test("Revenue splits correctly across batches, series, tests and coin packs", () => {
  const ledger = [
    ledgerRow({ id: "a", amount: 1000, metadata: { kind: "course", item_title: "Batch A" } }),
    ledgerRow({ id: "b", amount: 500, metadata: { kind: "series", item_title: "ETT Series" } }),
    ledgerRow({ id: "c", amount: 300, metadata: { kind: "series", item_title: "ETT Series" } }),
    ledgerRow({ id: "d", amount: 200, metadata: { kind: "test", item_title: "Mock 1" } }),
    ledgerRow({ id: "e", amount: 100, metadata: { kind: "coin_pack", item_title: "Starter" } }),
    // A coin pack bought online is revenue; the kind must not be guessed away.
    ledgerRow({ id: "f", amount: 50, metadata: null, course_id: null }),
  ];
  const byKind = revenueByKind(ledger);
  const map = new Map(byKind.map((entry) => [entry.kind, entry]));
  assert.equal(map.get("course")?.amount, 1000);
  assert.equal(map.get("series")?.amount, 800);
  assert.equal(map.get("series")?.count, 2);
  assert.equal(map.get("test")?.amount, 200);
  assert.equal(map.get("coin_pack")?.amount, 100);
  // A row with no kind and no course is never silently counted as a batch.
  assert.equal(kindOf(ledgerRow({ metadata: null, course_id: null })), "other");
});

test("Best sellers group by item title and sort by money, not by count", () => {
  const ledger = [
    ledgerRow({ id: "a", amount: 100, metadata: { kind: "course", item_title: "Cheap batch" } }),
    ledgerRow({ id: "b", amount: 100, metadata: { kind: "course", item_title: "Cheap batch" } }),
    ledgerRow({ id: "c", amount: 5000, metadata: { kind: "course", item_title: "Premium batch" } }),
  ];
  const top = topSellingItems(ledger);
  assert.equal(top[0]!.title, "Premium batch");
  assert.equal(top[0]!.amount, 5000);
  assert.equal(top[1]!.title, "Cheap batch");
  assert.equal(top[1]!.count, 2);
  assert.equal(titleOf(ledgerRow({ metadata: {} })), "Untitled item");
});

test("Online and offline money are reported separately, never merged", () => {
  const ledger = [
    ledgerRow({ id: "a", provider: "razorpay", amount: 1000 }),
    ledgerRow({ id: "b", provider: "offline", amount: 400 }),
  ];
  const providers = revenueByProvider(ledger);
  assert.equal(providers.find((entry) => entry.provider === "razorpay")?.amount, 1000);
  assert.equal(providers.find((entry) => entry.provider === "offline")?.amount, 400);
  // Zero-activity providers are not shown at all.
  assert.equal(providers.length, 2);
});

test("Subject strength and class average are computed from submitted papers only", () => {
  const attempts: AttemptRow[] = [
    { user_id: "u1", score: 18, total_marks: 20, subject: "Punjabi", submitted_at: "x" },
    { user_id: "u1", score: 5, total_marks: 20, subject: "Punjabi", submitted_at: "x" },
    { user_id: "u2", score: 9, total_marks: 10, subject: "Maths", submitted_at: "x" },
    // A paper with no marks (never submitted properly) must not skew anything.
    { user_id: "u2", score: null, total_marks: 0, subject: "Maths", submitted_at: "x" },
    { user_id: "u3", score: 10, total_marks: 20, subject: "", submitted_at: "x" },
  ];
  const average = averagePercent(attempts);
  // (90 + 25 + 90 + 50) / 4 = 63.75
  assert.equal(average, 63.8);

  const strength = subjectStrength(attempts);
  const punjabi = strength.find((entry) => entry.subject === "Punjabi");
  assert.equal(punjabi?.attempts, 2);
  assert.equal(punjabi?.averagePercent, 57.5);
  // A blank subject is labelled, never dropped from the report.
  assert.ok(strength.some((entry) => entry.subject === "Unclassified"));
  // Maths excludes the marks-less paper.
  assert.equal(strength.find((entry) => entry.subject === "Maths")?.attempts, 1);
});

test("Coupon performance counts only the last 30 days and flags near-limit codes", () => {
  const coupons: CouponRow[] = [
    { id: "c1", code: "KKCC50", used_count: 48, max_uses: 50, is_active: true },
    { id: "c2", code: "WELCOME25", used_count: 2, max_uses: 100, is_active: true },
  ];
  const redemptions: RedemptionRow[] = [
    {
      coupon_id: "c1",
      discount_amount: 500,
      final_amount: 500,
      created_at: "2026-10-03T00:00:00.000Z",
    },
    {
      coupon_id: "c1",
      discount_amount: 300,
      final_amount: 200,
      created_at: "2026-10-02T00:00:00.000Z",
    },
    // Older than 30 days: excluded from the window.
    {
      coupon_id: "c2",
      discount_amount: 900,
      final_amount: 100,
      created_at: "2026-07-01T00:00:00.000Z",
    },
  ];
  const stats = couponPerformance(redemptions, coupons, NOW);
  assert.equal(stats.redemptions30, 2);
  assert.equal(stats.discountGiven30, 800);
  assert.equal(stats.discountedRevenue30, 700);
  assert.equal(stats.topCoupons[0]!.code, "KKCC50");
  assert.equal(stats.topCoupons[0]!.count, 2);
  // KKCC50 has 2 uses left, so it is inside the 3-use warning window.
  assert.equal(stats.nearLimit, 1);
});

test("Students needing attention are the ones who never practised and never paid", () => {
  const profiles: ProfileRow[] = [
    { id: "u1", created_at: "2026-09-01T00:00:00.000Z", full_name: "Amrit", email: "amrit@x.com" },
    { id: "u2", created_at: "2026-09-02T00:00:00.000Z", full_name: null, email: "neha@x.com" },
    { id: "u3", created_at: "2026-09-03T00:00:00.000Z", full_name: "Paid", email: "paid@x.com" },
  ];
  const attempts: AttemptRow[] = [
    { user_id: "u1", score: 10, total_marks: 20, subject: "Maths", submitted_at: "x" },
  ];
  const ledger = [ledgerRow({ user_id: "u3" })];
  const attention = studentsNeedingAttention(profiles, attempts, paidUserIds(ledger));
  assert.deepEqual(
    attention.map((entry) => entry.email),
    ["neha@x.com"],
  );
  // A student with no name falls back to the email prefix, never a blank label.
  assert.equal(attention[0]!.name, "neha");

  const supporters = topSupporters(profiles, attempts, ledger);
  assert.equal(supporters[0]!.email, "paid@x.com");
  assert.equal(supporters[0]!.paidInr, 500);
  assert.equal(supporters[0]!.attempts, 0);
});

test("Analytics reads only existing tables and never trusts the browser for a role", () => {
  const functions = readFileSync("src/lib/analytics.functions.ts", "utf8");
  // Admin only: the handler must assert the role before reading anything.
  assert.match(functions, /assertAdmin\(context\)/);
  assert.match(functions, /requireSupabaseAuth/);
  // Only production-SQL tables are touched.
  const tables = [...functions.matchAll(/\.from\("([a-z_]+)"\)/g)].map((match) => match[1]);
  const allowed = new Set([
    "payment_transactions",
    "series_access_grants",
    "test_access_grants",
    "course_enrollments",
    "coupon_redemptions",
    "profiles",
    "learning_attempts",
    "student_doubts",
    "admission_enquiries",
    "offline_access_grants",
    "coupon_codes",
  ]);
  assert.ok(tables.length > 5);
  for (const table of tables) assert.ok(allowed.has(table!), `unexpected table ${table}`);

  // The ledger only ever writes to payment_transactions.
  const ledger = readFileSync("src/lib/payment-ledger.server.ts", "utf8");
  const ledgerTables = [...ledger.matchAll(/\.from\("([a-z_]+)"\)/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(ledgerTables)], ["payment_transactions"]);
  // A ledger failure must never break a student's access.
  assert.match(ledger, /catch \(error\) \{[\s\S]*console\.warn/);
});

test("Missing quiz content is a non-scoring empty state, never a cross-subject replacement", () => {
  const games = readFileSync("src/routes/games.tsx", "utf8");
  assert.match(games, /No verified question is ready/);
  assert.match(games, /unavailable: true/);
  assert.match(games, /answered \|\| question.unavailable/);
  assert.doesNotMatch(games, /fallbackSubject \?\? subject/);
});

test("A subject without its own chapters never borrows another subject's chapters", () => {
  const games = readFileSync("src/routes/games.tsx", "utf8");
  // The old bug: an unknown subject such as a Commerce paper fell through to
  // the SST chapter list and asked "Geography" questions in a tax paper.
  assert.doesNotMatch(games, /return merged\.length > 0 \? merged : SUBJECT_TOPICS\.SST;/);
  assert.match(games, /function pickTopicForSubject\(/);
  assert.match(games, /if \(subject === "SST"\) return SUBJECT_TOPICS\.SST;/);
  assert.doesNotMatch(games, /pick\(getTopicsForSubject/);
});

test("The payment ledger only ever writes columns that exist in the delivered SQL", () => {
  const ledger = readFileSync("src/lib/payment-ledger.server.ts", "utf8");
  const sql = readFileSync("KKCC-Excellence-Hub-PRODUCTION-SQL.sql", "utf8");
  const block = ledger.slice(ledger.indexOf('.from("payment_transactions")'));
  const insert = block.slice(0, block.indexOf(".select("));
  const columns = [...insert.matchAll(/^\s{6,}([a-z_]+):/gm)].map((match) => match[1]!);
  assert.ok(
    columns.length >= 8,
    `expected the ledger insert to list its columns, got ${columns.length}`,
  );
  for (const column of columns) {
    assert.match(
      sql,
      new RegExp(`(^|\\s)${column}\\s`, "m"),
      `payment_transactions has no ${column} column in the production SQL`,
    );
  }
});

test("The CSV export selects course_id so item kinds stay correct", () => {
  const source = readFileSync("src/lib/analytics.functions.ts", "utf8");
  const exportFn = source.slice(source.indexOf("adminExportPaymentLedger"));
  assert.match(exportFn, /course_id/);
});

test("The sitemap generator never invents a domain", () => {
  const generator = readFileSync("scripts/generate-sitemap.mjs", "utf8");
  assert.match(generator, /if \(!SITE_URL\)/);
  assert.match(generator, /no sitemap was written/);
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
    scripts: Record<string, string>;
  };
  assert.equal(pkg.scripts["sitemap"], "node scripts/generate-sitemap.mjs");
  // Without SITE_URL nothing is written, so a wrong-domain sitemap can never ship.
  assert.equal(existsSync("public/sitemap.xml"), false);
});
