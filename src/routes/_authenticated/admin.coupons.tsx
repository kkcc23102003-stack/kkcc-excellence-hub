import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, TicketPercent, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { adminDeleteCoupon, adminListCoupons, adminSaveCoupon } from "@/lib/coupons.functions";
import type { CouponCodeRow, CourseRow } from "@/integrations/supabase/db";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  head: () => ({
    meta: [
      { title: "Admin — Coupons | KKCC" },
      {
        name: "description",
        content: "Create coupon codes with discount percentage, validity and usage limits.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CouponManager,
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

type CouponForm = {
  id?: string;
  code: string;
  title: string;
  description: string;
  discount_percent: number;
  max_uses: number;
  per_user_limit: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  applies_to_course_id: string;
};

function blankForm(): CouponForm {
  return {
    code: "",
    title: "",
    description: "",
    discount_percent: 100,
    max_uses: 200,
    per_user_limit: 1,
    starts_at: "",
    expires_at: "",
    is_active: true,
    applies_to_course_id: "all",
  };
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function formFromCoupon(coupon: CouponCodeRow): CouponForm {
  return {
    id: coupon.id,
    code: coupon.code,
    title: coupon.title,
    description: coupon.description,
    discount_percent: coupon.discount_percent,
    max_uses: coupon.max_uses,
    per_user_limit: coupon.per_user_limit,
    starts_at: toDateTimeLocal(coupon.starts_at),
    expires_at: toDateTimeLocal(coupon.expires_at),
    is_active: coupon.is_active,
    applies_to_course_id: coupon.applies_to_course_id ?? "all",
  };
}

function CouponManager() {
  const qc = useQueryClient();
  const load = useServerFn(adminListCoupons);
  const save = useServerFn(adminSaveCoupon);
  const del = useServerFn(adminDeleteCoupon);
  const [form, setForm] = useState<CouponForm>(blankForm());

  const query = useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: () => load(),
    throwOnError: true,
  });

  const courses = (query.data?.courses ?? []) as CourseRow[];
  const coupons = query.data?.coupons ?? [];
  const redemptionCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const redemption of query.data?.redemptions ?? []) {
      map.set(redemption.coupon_id, (map.get(redemption.coupon_id) ?? 0) + 1);
    }
    return map;
  }, [query.data?.redemptions]);

  useEffect(() => {
    if (!form.title && form.code) setForm((current) => ({ ...current, title: current.code }));
  }, [form.code, form.title]);

  const saveMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          id: form.id,
          code: form.code,
          title: form.title || form.code,
          description: form.description,
          discount_percent: Number(form.discount_percent),
          max_uses: Number(form.max_uses),
          per_user_limit: Number(form.per_user_limit),
          starts_at: fromDateTimeLocal(form.starts_at),
          expires_at: fromDateTimeLocal(form.expires_at),
          is_active: form.is_active,
          applies_to_course_id:
            form.applies_to_course_id === "all" ? null : form.applies_to_course_id,
        },
      }),
    onSuccess: () => {
      toast.success("Coupon saved");
      setForm(blankForm());
      void qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Coupon deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Coupon codes"
        description="Create coupons up to 100% discount, set validity/expiry, and define a max-use limit such as 200 students. When the limit is reached, the coupon auto-expires or becomes inactive; to extend access, increase max uses and activate it again."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/notifications">Notifications</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/doubts">Doubts</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/enquiries">Enquiries</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/app-builder">App Builder</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/payments">Payments</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/offline-access">Offline access</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <form
            className="surface-panel space-y-5 p-6"
            onSubmit={(event) => {
              event.preventDefault();
              saveMutation.mutate();
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <TicketPercent className="h-5 w-5 text-primary" />
                  {form.id ? "Edit coupon" : "Create coupon"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Example: 100% discount, max uses 200.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setForm(blankForm())}
              >
                <Plus className="mr-1.5 h-4 w-4" /> New
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="code">Coupon code</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(event) =>
                    setForm({ ...form, code: event.target.value.toUpperCase().replace(/\s+/g, "") })
                  }
                  placeholder="KKCC100"
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Launch offer"
                  className="mt-1.5"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows={3}
                className="mt-1.5"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="discount">Discount %</Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  max={100}
                  value={form.discount_percent}
                  onChange={(event) =>
                    setForm({ ...form, discount_percent: Number(event.target.value) })
                  }
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="max-uses">Max uses</Label>
                <Input
                  id="max-uses"
                  type="number"
                  min={0}
                  value={form.max_uses}
                  onChange={(event) => setForm({ ...form, max_uses: Number(event.target.value) })}
                  className="mt-1.5"
                />
                <p className="mt-1 text-xs text-muted-foreground">0 = unlimited</p>
              </div>
              <div>
                <Label htmlFor="per-user">Per user limit</Label>
                <Input
                  id="per-user"
                  type="number"
                  min={1}
                  value={form.per_user_limit}
                  onChange={(event) =>
                    setForm({ ...form, per_user_limit: Number(event.target.value) })
                  }
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="course">Course scope</Label>
              <select
                id="course"
                className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={form.applies_to_course_id}
                onChange={(event) => setForm({ ...form, applies_to_course_id: event.target.value })}
              >
                <option value="all">All paid courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="starts">Starts at</Label>
                <Input
                  id="starts"
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(event) => setForm({ ...form, starts_at: event.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="expires">Expires at</Label>
                <Input
                  id="expires"
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(event) => setForm({ ...form, expires_at: event.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 rounded-2xl border p-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
              />
              Active coupon
            </label>

            <Button className="w-full rounded-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              Save coupon
            </Button>
          </form>

          <section className="surface-panel p-6">
            <h2 className="text-lg font-bold">Coupons</h2>
            {query.isLoading ? (
              <p className="mt-4 text-sm text-muted-foreground">Loading coupons…</p>
            ) : (
              <div className="mt-5 space-y-4">
                {coupons.map((coupon) => {
                  const full = coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses;
                  const actualRedeemed = redemptionCounts.get(coupon.id) ?? coupon.used_count;
                  return (
                    <article key={coupon.id} className="rounded-2xl border bg-card p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                              {coupon.code}
                            </span>
                            <Badge
                              variant={coupon.is_active && !full ? "secondary" : "destructive"}
                            >
                              {coupon.is_active && !full
                                ? "Active"
                                : full
                                  ? "Limit full"
                                  : "Inactive"}
                            </Badge>
                            <Badge variant="outline">{coupon.discount_percent}% off</Badge>
                          </div>
                          <h3 className="mt-3 font-semibold">{coupon.title}</h3>
                          {coupon.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {coupon.description}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-muted-foreground">
                            Uses: {actualRedeemed}/{coupon.max_uses || "∞"} · Per user:{" "}
                            {coupon.per_user_limit} · Course:{" "}
                            {coupon.course ? coupon.course.title : "All paid courses"}
                          </p>
                          {(coupon.starts_at || coupon.expires_at) && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {coupon.starts_at
                                ? `Starts ${new Date(coupon.starts_at).toLocaleString("en-IN")}`
                                : "Starts now"}
                              {" · "}
                              {coupon.expires_at
                                ? `Expires ${new Date(coupon.expires_at).toLocaleString("en-IN")}`
                                : "No expiry date"}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => setForm(formFromCoupon(coupon))}
                          >
                            Edit / extend
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-full text-destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() => deleteMutation.mutate(coupon.id)}
                          >
                            <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
                {coupons.length === 0 && (
                  <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                    No coupons yet. Create your first coupon code.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
