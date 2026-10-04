/**
 * Owner's business dashboard.
 *
 * Answers the five questions a coaching owner actually asks: what did we earn,
 * what sold, who is paying, which coupons are being used, and what is waiting
 * for me right now. Everything is read from the live tables.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  BookOpen,
  Loader2,
  Receipt,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { AdminCommandBar } from "@/components/kkcc/admin-command-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { adminAnalyticsSummary, adminExportPaymentLedger } from "@/lib/analytics.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { friendlyError } from "@/lib/storage";
import { formatINR } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Admin — Business Dashboard | KKCC" },
      {
        name: "description",
        content: "Revenue, sales, students, coupons and the pending admin queue.",
      },
      { property: "og:title", content: "Admin — Business Dashboard | KKCC" },
      { property: "og:description", content: "Live revenue and student analytics for KKCC." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAnalyticsPage,
});

type Summary = Awaited<ReturnType<typeof adminAnalyticsSummary>>;

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  hint?: string | undefined;
  tone?: "default" | "ok" | "bad";
}) {
  const toneClass =
    tone === "ok" ? "text-emerald-600" : tone === "bad" ? "text-rose-600" : "text-foreground";
  return (
    <div className="surface-panel p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="uppercase tracking-wide">{label}</span>
      </div>
      <p className={`mt-2 text-2xl font-black ${toneClass}`}>{value}</p>
      {hint ? (
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** CSV that opens cleanly in Excel / Google Sheets. */
function toCsv(rows: Record<string, string | number>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]!);
  const escape = (value: string | number) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((key) => escape(row[key]!)).join(",")),
  ].join("\n");
}

function AdminAnalyticsPage() {
  const fetchSummary = useServerFn(adminAnalyticsSummary);
  const fetchLedger = useServerFn(adminExportPaymentLedger);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => safeServerCall<Summary | null>(() => fetchSummary(), null),
    staleTime: 60_000,
    retry: 1,
  });

  const exportMutation = useMutation({
    mutationFn: () => fetchLedger() as Promise<Record<string, string | number>[]>,
    onSuccess: (rows) => {
      if (!rows.length) {
        toast.info("No payments recorded yet");
        return;
      }
      const csv = toCsv(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kkcc-payments-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${rows.length} payment rows`);
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const summary = data ?? null;
  const maxDay = summary ? Math.max(1, ...summary.revenue.series.map((day) => day.amount)) : 1;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Business dashboard"
        description="Revenue, sales, students, coupons and the work waiting for you — computed live from the payment ledger and access tables."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <AdminCommandBar />

        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/students">Student access</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/payments">Payments &amp; recovery</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/coupons">Coupons</Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            disabled={exportMutation.isPending}
            onClick={() => exportMutation.mutate()}
          >
            {exportMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Receipt className="mr-2 h-4 w-4" />
            )}
            Download payment ledger (CSV)
          </Button>
        </div>

        {isLoading ? (
          <div className="surface-panel flex items-center gap-3 p-6 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Reading the live tables…
          </div>
        ) : null}

        {isError ? (
          <div className="surface-panel border-rose-500/40 bg-rose-500/10 p-6 text-sm">
            <p className="flex items-center gap-2 font-bold text-rose-700">
              <AlertTriangle className="h-4 w-4" /> Could not load analytics
            </p>
            <p className="mt-2 text-muted-foreground">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        ) : null}

        {summary ? (
          <>
            {/* Revenue */}
            <section className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                icon={BadgeIndianRupee}
                label="Today"
                value={formatINR(summary.revenue.today)}
                hint="Confirmed payments recorded today."
              />
              <Stat
                icon={TrendingUp}
                label="Last 7 days"
                value={formatINR(summary.revenue.last7)}
                hint={`Average order ${formatINR(summary.revenue.averageOrderValue)}`}
              />
              <Stat
                icon={Receipt}
                label="Last 30 days"
                value={formatINR(summary.revenue.last30)}
                hint={`${summary.revenue.paidPayments} confirmed payments in 90 days`}
              />
              <Stat
                icon={ShieldCheck}
                label="Offline collected"
                value={formatINR(summary.revenue.offlineAllTime)}
                hint="Activated by hand from offline grants."
              />
            </section>

            {/* Revenue chart */}
            <section className="surface-panel mt-4 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-black">Daily collections — last 30 days</h2>
                <p className="text-xs text-muted-foreground">
                  Peak day {formatINR(maxDay)} · Total {formatINR(summary.revenue.last30)}
                </p>
              </div>
              <div className="mt-4 flex h-40 items-end gap-1">
                {summary.revenue.series.map((day) => (
                  <div
                    key={day.date}
                    className="group relative flex-1"
                    title={`${day.date}: ${formatINR(day.amount)} · ${day.payments} payments`}
                  >
                    <div
                      className={`w-full rounded-t ${day.amount > 0 ? "bg-primary" : "bg-muted"}`}
                      style={{
                        height: `${Math.max(3, Math.round((day.amount / maxDay) * 100))}%`,
                        minHeight: day.amount > 0 ? "6px" : "3px",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                <span>{summary.revenue.series[0]?.date}</span>
                <span>{summary.revenue.series[summary.revenue.series.length - 1]?.date}</span>
              </div>
              {summary.revenue.abandonedCheckouts > 0 ? (
                <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
                  <strong>{summary.revenue.abandonedCheckouts}</strong> checkout
                  {summary.revenue.abandonedCheckouts === 1 ? "" : "s"} opened but not confirmed (
                  {formatINR(summary.revenue.abandonedAmount)}). Students can recover these
                  themselves from the Payment Recovery card, or you can unlock one from{" "}
                  <Link to="/admin/payments" className="font-bold underline">
                    Payments &amp; recovery
                  </Link>
                  .
                </p>
              ) : null}
            </section>

            {/* Sales + students */}
            <section className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="surface-panel p-5">
                <h2 className="flex items-center gap-2 text-base font-black">
                  <BookOpen className="h-4 w-4 text-primary" /> What sold
                </h2>
                <div className="mt-3 space-y-2">
                  {summary.revenue.byKind.map((item) => (
                    <div
                      key={item.kind}
                      className="flex items-center justify-between rounded-xl border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-right">
                        <span className="block font-black">{formatINR(item.amount)}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {item.count} payment{item.count === 1 ? "" : "s"}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border p-3">
                    <p className="text-lg font-black">{summary.access.batchEnrollments}</p>
                    <p className="text-[11px] text-muted-foreground">Batch access</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-lg font-black">{summary.access.seriesGrants}</p>
                    <p className="text-[11px] text-muted-foreground">Series access</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-lg font-black">{summary.access.testGrants}</p>
                    <p className="text-[11px] text-muted-foreground">Test access</p>
                  </div>
                </div>

                {summary.revenue.topItems.length ? (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Best sellers
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {summary.revenue.topItems.slice(0, 5).map((item) => (
                        <li
                          key={`${item.kind}-${item.title}`}
                          className="flex justify-between gap-3"
                        >
                          <span className="truncate">{item.title}</span>
                          <span className="shrink-0 font-bold">{formatINR(item.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="surface-panel p-5">
                <h2 className="flex items-center gap-2 text-base font-black">
                  <Users className="h-4 w-4 text-primary" /> Students
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border p-3">
                    <p className="text-lg font-black">{summary.students.total}</p>
                    <p className="text-[11px] text-muted-foreground">Total accounts</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="flex items-center gap-1 text-lg font-black text-emerald-600">
                      <UserPlus className="h-4 w-4" /> {summary.students.newLast30}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Joined in 30 days</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-lg font-black">{summary.students.activeLast30}</p>
                    <p className="text-[11px] text-muted-foreground">Attempted a paper</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-lg font-black">{summary.students.paying}</p>
                    <p className="text-[11px] text-muted-foreground">Paying students</p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  <strong>{summary.students.attempts30}</strong> papers submitted in 30 days · class
                  average <strong>{summary.students.averagePercent}%</strong>
                </p>

                {summary.students.subjectStrength.length ? (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Where students struggle
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {summary.students.subjectStrength
                        .slice()
                        .sort((a, b) => a.averagePercent - b.averagePercent)
                        .slice(0, 5)
                        .map((item) => (
                          <li
                            key={item.subject}
                            className="flex items-center justify-between gap-3"
                          >
                            <span className="truncate">{item.subject}</span>
                            <Badge
                              variant="outline"
                              className={`shrink-0 rounded-full text-[11px] ${
                                item.averagePercent < 50 ? "border-rose-500/50 text-rose-600" : ""
                              }`}
                            >
                              {item.averagePercent}% · {item.attempts}
                            </Badge>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : null}

                {summary.students.topper ? (
                  <p className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs">
                    <strong>Top scorer:</strong> {summary.students.topper.name} —{" "}
                    {summary.students.topper.averagePercent}% average over{" "}
                    {summary.students.topper.papers} paper
                    {summary.students.topper.papers === 1 ? "" : "s"}. Worth a word of appreciation.
                  </p>
                ) : null}

                {summary.students.topSpenders.length ? (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Top supporters
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {summary.students.topSpenders.slice(0, 5).map((item) => (
                        <li key={item.email} className="flex justify-between gap-3">
                          <span className="truncate">
                            {item.name} · {item.attempts} papers
                          </span>
                          <span className="shrink-0 font-bold">{formatINR(item.paidInr)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>

            {/* Coupons + queue */}
            <section className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="surface-panel p-5">
                <h2 className="flex items-center gap-2 text-base font-black">
                  <Ticket className="h-4 w-4 text-primary" /> Coupon performance (30 days)
                </h2>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border p-3">
                    <p className="text-lg font-black">{summary.coupons.redemptions30}</p>
                    <p className="text-[11px] text-muted-foreground">Redeemed</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-lg font-black">
                      {formatINR(summary.coupons.discountGiven30)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Discount given</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-lg font-black">
                      {formatINR(summary.coupons.discountedRevenue30)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Collected after discount</p>
                  </div>
                </div>
                {summary.coupons.topCoupons.length ? (
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {summary.coupons.topCoupons.map((coupon) => (
                      <li key={coupon.code} className="flex justify-between gap-3">
                        <span className="font-mono font-bold">{coupon.code}</span>
                        <span className="text-muted-foreground">
                          {coupon.count} used · {formatINR(coupon.discount)} off
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">
                    No coupon has been redeemed in the last 30 days.{" "}
                    <Link to="/admin/coupons" className="font-bold underline">
                      Create one
                    </Link>{" "}
                    to run an offer.
                  </p>
                )}
                {summary.coupons.nearLimit > 0 ? (
                  <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
                    <strong>{summary.coupons.nearLimit}</strong> coupon
                    {summary.coupons.nearLimit === 1 ? "" : "s"} about to hit the usage limit.
                  </p>
                ) : null}
              </div>

              <div className="surface-panel p-5">
                <h2 className="flex items-center gap-2 text-base font-black">
                  <Sparkles className="h-4 w-4 text-primary" /> Waiting for you
                </h2>
                <ul className="mt-3 space-y-2 text-sm">
                  <QueueRow
                    label="Unanswered student doubts"
                    value={summary.queue.openDoubts}
                    to="/admin/doubts"
                  />
                  <QueueRow
                    label="New admission enquiries"
                    value={summary.queue.newEnquiries}
                    to="/admin/enquiries"
                  />
                  <QueueRow
                    label="Offline access requests to activate"
                    value={summary.queue.pendingOfflineGrants}
                    to="/admin/offline-access"
                  />
                  <QueueRow
                    label="Checkouts opened but not confirmed"
                    value={summary.queue.abandonedCheckouts}
                    to="/admin/payments"
                  />
                </ul>

                {summary.students.needsAttention.length ? (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Not started yet — worth a call
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {summary.students.needsAttention.slice(0, 6).map((student) => (
                        <li key={student.email} className="truncate">
                          {student.name} · {student.email}
                        </li>
                      ))}
                    </ul>
                    <Button asChild size="sm" variant="outline" className="mt-3 rounded-full">
                      <Link to="/admin/students">
                        Open student access <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            </section>

            <p className="mt-6 text-[11px] text-muted-foreground">
              Figures update when the page loads. Money is counted from the payment ledger
              (`payment_transactions`), so an online payment is included only after Razorpay
              confirms it, and a hand-granted access is counted separately as offline.
            </p>
          </>
        ) : null}
      </div>
    </SiteLayout>
  );
}

function QueueRow({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-colors hover:border-primary hover:bg-primary/5 ${
          value > 0 ? "border-amber-500/40 bg-amber-500/5" : "border-border"
        }`}
      >
        <span>{label}</span>
        <span className={`font-black ${value > 0 ? "text-amber-600" : "text-muted-foreground"}`}>
          {value}
        </span>
      </Link>
    </li>
  );
}
