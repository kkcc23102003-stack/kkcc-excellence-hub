import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck, Gift, Loader2, Search, UserPlus, XCircle } from "lucide-react";
import { toast } from "sonner";
import { KaatCoin } from "@/components/kkcc/kaat-coin";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminGrantEnrollment,
  adminListStudentAccess,
  adminRevokeEnrollment,
} from "@/lib/enrollments.functions";
import { coursePriceLabel, formatINR } from "@/lib/cms";
import { friendlyError } from "@/lib/storage";
import { adminGrant23Kaat, adminList23KaatLedger } from "@/lib/coins.functions";

export const Route = createFileRoute("/_authenticated/admin/students")({
  head: () => ({
    meta: [
      { title: "Student access — KKCC Admin" },
      { name: "description", content: "Manually unlock courses after offline payment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminStudentsPage,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
});

function AdminStudentsPage() {
  const qc = useQueryClient();
  const listAccess = useServerFn(adminListStudentAccess);
  const grantAccess = useServerFn(adminGrantEnrollment);
  const revokeAccess = useServerFn(adminRevokeEnrollment);
  const grantCoins = useServerFn(adminGrant23Kaat);
  const listCoins = useServerFn(adminList23KaatLedger);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("offline");
  const [expiresAt, setExpiresAt] = useState("");
  const [note, setNote] = useState("");
  const [coinBonus, setCoinBonus] = useState("");
  const [coinEmail, setCoinEmail] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [coinReason, setCoinReason] = useState("Manual 23KAAT grant");

  const accessQuery = useQuery({
    queryKey: ["admin", "student-access", query],
    queryFn: () => listAccess({ data: { query } }),
    retry: false,
    throwOnError: true,
  });

  const coinLedgerQuery = useQuery({
    queryKey: ["admin", "23kaat-ledger", query],
    queryFn: () => listCoins({ data: { query } }),
    retry: false,
  });

  const data = accessQuery.data ?? { profiles: [], courses: [], enrollments: [] };
  const paidCourses = useMemo(
    () => data.courses.filter((course) => Number(course.price) > 0),
    [data.courses],
  );
  const courseOptions = paidCourses.length ? paidCourses : data.courses;

  const grantMutation = useMutation({
    mutationFn: () =>
      grantAccess({
        data: {
          email: email.trim(),
          course_id: courseId,
          amount_paid: amountPaid ? Math.round(Number(amountPaid)) : 0,
          payment_method: paymentMethod.trim() || "offline",
          admin_note: note.trim(),
          expires_at: expiresAt ? new Date(`${expiresAt}T23:59:59`).toISOString() : null,
          coin_bonus: coinBonus ? Math.round(Number(coinBonus)) : 0,
        },
      }),
    onSuccess: ({ email: targetEmail, coin_bonus }) => {
      toast.success(
        `Course access granted to ${targetEmail}${coin_bonus ? ` with ${coin_bonus} 23KAAT` : ""}`,
      );
      setEmail("");
      setAmountPaid("");
      setNote("");
      setExpiresAt("");
      setCoinBonus("");
      void qc.invalidateQueries({ queryKey: ["admin", "student-access"] });
      void qc.invalidateQueries({ queryKey: ["admin", "23kaat-ledger"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => revokeAccess({ data: { id } }),
    onSuccess: () => {
      toast.success("Course access revoked");
      void qc.invalidateQueries({ queryKey: ["admin", "student-access"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const coinGrantMutation = useMutation({
    mutationFn: () =>
      grantCoins({
        data: {
          email: coinEmail.trim(),
          amount: Math.round(Number(coinAmount || 0)),
          reason: coinReason.trim() || "Manual 23KAAT grant",
          related_type: "admin_grant",
          related_id: null,
        },
      }),
    onSuccess: (payload) => {
      const result = payload as { email?: string; amount?: number; balance?: number };
      toast.success(
        `${result.amount ?? Number(coinAmount)} 23KAAT granted to ${result.email ?? coinEmail}. Balance: ${result.balance ?? "updated"}`,
      );
      setCoinEmail("");
      setCoinAmount("");
      setCoinReason("Manual 23KAAT grant");
      void qc.invalidateQueries({ queryKey: ["admin", "23kaat-ledger"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Student course access"
        description="After cash, UPI or bank transfer payment, unlock the student's paid course from here. Free courses need no Razorpay or manual approval."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/offline-access">Offline access</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/users">Admin users</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/payments">Payments</Link>
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="surface-panel p-5">
            <UserPlus className="h-8 w-8 text-primary" />
            <h2 className="mt-3 text-lg font-bold">Manual/offline enrolment</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Student must create account once. Then enter their email and select the paid course.
            </p>
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-email">Student email</Label>
                <Input
                  id="student-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <select
                  id="course"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select course</option>
                  {courseOptions.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} — {coursePriceLabel(course)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount paid ₹</Label>
                  <Input
                    id="amount"
                    inputMode="numeric"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value.replace(/\D/g, ""))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Method</Label>
                  <Input
                    id="method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="UPI / cash / bank"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coin-bonus">23KAAT bonus with this offline batch</Label>
                <Input
                  id="coin-bonus"
                  inputMode="numeric"
                  value={coinBonus}
                  onChange={(e) => setCoinBonus(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 500"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: give coins together with offline batch purchase.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expires">Access expiry (optional)</Label>
                <Input
                  id="expires"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Admin note</Label>
                <Textarea
                  id="note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Receipt/ref no., batch, remarks..."
                />
              </div>
            </div>
            <Button
              className="mt-5 rounded-full"
              disabled={!email.trim() || !courseId || grantMutation.isPending}
              onClick={() => grantMutation.mutate()}
            >
              {grantMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <ClipboardCheck className="mr-1.5 h-4 w-4" />
              )}
              Unlock course{coinBonus ? ` + ${coinBonus} 23KAAT` : ""}
            </Button>
          </div>

          <div className="space-y-5">
            <div className="surface-panel p-5">
              <KaatCoin size="lg" />
              <h2 className="mt-3 text-lg font-bold">Grant 23KAAT coins</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Give any student app currency for offline payments, rewards or support cases.
              </p>
              <div className="mt-5 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="coin-email">Student email</Label>
                  <Input
                    id="coin-email"
                    type="email"
                    value={coinEmail}
                    onChange={(e) => setCoinEmail(e.target.value)}
                    placeholder="student@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coin-amount">23KAAT amount</Label>
                  <Input
                    id="coin-amount"
                    inputMode="numeric"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(e.target.value.replace(/\D/g, ""))}
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coin-reason">Reason</Label>
                  <Textarea
                    id="coin-reason"
                    rows={2}
                    value={coinReason}
                    onChange={(e) => setCoinReason(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="mt-4 rounded-full"
                disabled={!coinEmail.trim() || !Number(coinAmount) || coinGrantMutation.isPending}
                onClick={() => coinGrantMutation.mutate()}
              >
                {coinGrantMutation.isPending ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Gift className="mr-1.5 h-4 w-4" />
                )}
                Grant 23KAAT
              </Button>
            </div>

            <div className="surface-panel p-5">
              <h2 className="text-lg font-bold">Recent 23KAAT ledger</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest coin grants and spends.</p>
              <div className="mt-4 max-h-80 space-y-2 overflow-auto pr-1">
                {(coinLedgerQuery.data ?? []).slice(0, 8).map((tx) => (
                  <div key={tx.id} className="rounded-2xl border bg-background/70 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate font-medium">
                        {tx.student?.full_name || tx.student?.email || tx.user_id}
                      </span>
                      <Badge
                        variant={tx.amount > 0 ? "default" : "secondary"}
                        className="gap-1.5 rounded-full"
                      >
                        <KaatCoin size="xs" />
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount} 23KAAT
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {tx.reason || tx.source} ·{" "}
                      {new Date(tx.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                ))}
                {!coinLedgerQuery.data?.length && (
                  <p className="rounded-2xl border border-dashed p-4 text-center text-xs text-muted-foreground">
                    No 23KAAT transactions yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="surface-panel p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Current access list</h2>
                <p className="text-sm text-muted-foreground">
                  Active, revoked and expired rows are kept for audit/history.
                </p>
              </div>
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search student"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {accessQuery.isLoading && (
                <p className="text-sm text-muted-foreground">Loading access rows…</p>
              )}
              {data.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="rounded-2xl border bg-background/70 p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold">
                          {enrollment.student?.full_name ||
                            enrollment.student?.email ||
                            enrollment.user_id}
                        </p>
                        <Badge
                          variant={enrollment.is_current ? "default" : "secondary"}
                          className="rounded-full text-[11px] capitalize"
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {enrollment.course?.title ?? enrollment.course_id}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {enrollment.payment_method} · {formatINR(enrollment.amount_paid)} ·{" "}
                        {new Date(enrollment.created_at).toLocaleDateString()}
                        {enrollment.expires_at
                          ? ` · expires ${new Date(enrollment.expires_at).toLocaleDateString()}`
                          : ""}
                      </p>
                      {enrollment.admin_note && (
                        <p className="mt-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                          {enrollment.admin_note}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 rounded-full text-destructive"
                      disabled={enrollment.status !== "active" || revokeMutation.isPending}
                      onClick={() => revokeMutation.mutate(enrollment.id)}
                    >
                      <XCircle className="mr-1.5 h-3.5 w-3.5" /> Revoke
                    </Button>
                  </div>
                </div>
              ))}
              {!accessQuery.isLoading && !data.enrollments.length && (
                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No access rows yet. Unlock a course after offline payment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
