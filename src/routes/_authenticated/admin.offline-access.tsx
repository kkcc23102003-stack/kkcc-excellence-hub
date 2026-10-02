import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck, Loader2, Search, UserPlus, XCircle } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminGrantOfflineAccess,
  adminListOfflineAccess,
  adminRevokeOfflineAccess,
} from "@/lib/offline-access.functions";
import { coursePriceLabel, formatINR } from "@/lib/cms";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/offline-access")({
  head: () => ({
    meta: [
      { title: "Offline Access — KKCC Admin" },
      {
        name: "description",
        content: "Give course access by student Gmail and name after offline payment.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OfflineAccessPage,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">{friendlyError(error)}</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/admin">Back to admin</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
});

function OfflineAccessPage() {
  const qc = useQueryClient();
  const listAccess = useServerFn(adminListOfflineAccess);
  const grantAccess = useServerFn(adminGrantOfflineAccess);
  const revokeAccess = useServerFn(adminRevokeOfflineAccess);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI/offline");
  const [expiresAt, setExpiresAt] = useState("");
  const [note, setNote] = useState("");

  const accessQuery = useQuery({
    queryKey: ["admin", "offline-access", query],
    queryFn: () => listAccess({ data: { query } }),
    retry: false,
    throwOnError: true,
  });

  const data = accessQuery.data ?? { courses: [], grants: [], enrollments: [] };
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
          full_name: fullName.trim(),
          course_id: courseId,
          amount_paid: amountPaid ? Math.round(Number(amountPaid)) : 0,
          payment_method: paymentMethod.trim() || "offline",
          admin_note: note.trim(),
          expires_at: expiresAt ? new Date(`${expiresAt}T23:59:59`).toISOString() : null,
        },
      }),
    onSuccess: (result) => {
      toast.success(
        result.activated
          ? `Access active for ${result.email}`
          : `Pending access saved for ${result.email}. It will activate after signup.`,
      );
      setEmail("");
      setFullName("");
      setAmountPaid("");
      setNote("");
      setExpiresAt("");
      void qc.invalidateQueries({ queryKey: ["admin", "offline-access"] });
      void qc.invalidateQueries({ queryKey: ["admin", "student-access"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => revokeAccess({ data: { id } }),
    onSuccess: () => {
      toast.success("Offline access revoked");
      void qc.invalidateQueries({ queryKey: ["admin", "offline-access"] });
      void qc.invalidateQueries({ queryKey: ["admin", "student-access"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Offline payment access"
        description="Enter student Gmail, name and course after cash/UPI/bank payment. If the student has not signed up yet, access stays pending and activates automatically after signup with the same Gmail."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/students">Student access list</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/payments">Payments</Link>
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="surface-panel p-5">
            <UserPlus className="h-8 w-8 text-primary" />
            <h2 className="mt-3 text-lg font-bold">Give access by Gmail</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No Razorpay needed. Add Gmail + student name, select course, and save access.
            </p>
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-email">Student Gmail</Label>
                <Input
                  id="student-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-name">Student name</Label>
                <Input
                  id="student-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Student full name"
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
                <Label htmlFor="expires">Access expiry (optional)</Label>
                <Input
                  id="expires"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Admin note / receipt</Label>
                <Textarea
                  id="note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="UPI ref no., receipt, batch, remarks..."
                />
              </div>
            </div>
            <Button
              className="mt-5 rounded-full"
              disabled={!email.trim() || !fullName.trim() || !courseId || grantMutation.isPending}
              onClick={() => grantMutation.mutate()}
            >
              {grantMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <ClipboardCheck className="mr-1.5 h-4 w-4" />
              )}
              Give access
            </Button>
          </div>

          <div className="surface-panel p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Offline access grants</h2>
                <p className="text-sm text-muted-foreground">
                  Pending means the Gmail has not signed up yet. Activated means course access is
                  live.
                </p>
              </div>
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search email/name/course"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {accessQuery.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
              {data.grants.map((grant) => (
                <div key={grant.id} className="rounded-2xl border bg-background/70 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold">{grant.full_name}</p>
                        <Badge
                          variant={grant.status === "activated" ? "default" : "secondary"}
                          className="rounded-full text-[11px] capitalize"
                        >
                          {grant.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{grant.email}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {grant.course?.title ?? grant.course_id}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {grant.payment_method} · {formatINR(grant.amount_paid)} ·{" "}
                        {new Date(grant.created_at).toLocaleDateString()}
                        {grant.expires_at
                          ? ` · expires ${new Date(grant.expires_at).toLocaleDateString()}`
                          : ""}
                      </p>
                      {grant.admin_note && (
                        <p className="mt-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                          {grant.admin_note}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 rounded-full text-destructive"
                      disabled={grant.status === "revoked" || revokeMutation.isPending}
                      onClick={() => revokeMutation.mutate(grant.id)}
                    >
                      <XCircle className="mr-1.5 h-3.5 w-3.5" /> Revoke
                    </Button>
                  </div>
                </div>
              ))}
              {!accessQuery.isLoading && !data.grants.length && (
                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No offline grants yet. Give access from the form.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
