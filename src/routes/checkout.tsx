import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ShieldCheck, Tag, PlayCircle, Loader2, TicketPercent, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { KaatCoin, KaatCoinStack } from "@/components/kkcc/kaat-coin";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { CourseThumb } from "@/components/kkcc/course-thumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { coinPriceOf, coursePriceLabel, formatINR, isFreeCourse } from "@/lib/cms";
import { listPublishedCourses } from "@/lib/content.functions";
import { validateCouponForCourse, redeemCouponForCourse } from "@/lib/coupons.functions";
import { ensureFreeCourseAccess } from "@/lib/enrollments.functions";
import { getMy23KaatWallet, spend23KaatForCourse } from "@/lib/coins.functions";
import { getPublicPaymentSettings } from "@/lib/platform-settings.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ course: z.string().optional() });

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Checkout — KKCC" },
      { name: "description", content: "Review your KKCC course enrolment summary before payment." },
      { property: "og:title", content: "Checkout — KKCC" },
      { property: "og:description", content: "Course summary, pricing and enrolment details." },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async () => {
    const [courses, payment] = await Promise.all([
      safeServerCall(() => listPublishedCourses(), []),
      safeServerCall(() => getPublicPaymentSettings(), {
        enabled: false,
        provider: "razorpay",
        mode: "test",
        razorpay_key_id: "",
        offline_payment_instructions:
          "Use the KKCC inquiry flow for UPI, cash or bank-transfer access. Course access is activated after the KKCC team confirms the payment.",
      }),
    ]);
    return { courses, payment };
  },
  component: Checkout,
});

type AppliedCoupon = {
  code: string;
  title: string;
  discount_percent: number;
  discount_amount: number;
  final_amount: number;
  remaining_uses: number | null;
};

type CouponValidationResult =
  | { valid: false; message?: string }
  | {
      valid: true;
      code: string;
      title: string;
      discount_percent: number;
      discount_amount: number;
      original_amount: number;
      final_amount: number;
      remaining_uses: number | null;
      message?: string;
    };

function Checkout() {
  const { course: slug } = Route.useSearch();
  const { courses, payment } = Route.useLoaderData();
  const course = courses.find((c) => c.slug === slug) ?? courses[0];
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [claimingCoupon, setClaimingCoupon] = useState(false);
  const [startingFree, setStartingFree] = useState(false);
  const paymentConfigured = Boolean(payment.enabled && payment.razorpay_key_id);
  const navigate = useNavigate();
  const loadWallet = useServerFn(getMy23KaatWallet);
  const spendCoinsForCourse = useServerFn(spend23KaatForCourse);
  const [coinBalance, setCoinBalance] = useState<number | null>(null);
  const [spendingCoins, setSpendingCoins] = useState(false);

  const free = course ? isFreeCourse(course) : false;
  const coinCost = course ? coinPriceOf(course) : 0;
  const discount = course && !free ? (appliedCoupon?.discount_amount ?? 0) : 0;
  const total = free ? 0 : (appliedCoupon?.final_amount ?? course?.price ?? 0);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      void loadWallet()
        .then((wallet) => {
          if (active) setCoinBalance(wallet.balance);
        })
        .catch(() => {
          if (active) setCoinBalance(null);
        });
    });
    return () => {
      active = false;
    };
  }, [loadWallet]);

  const payWith23Kaat = async () => {
    if (!course) return;
    setSpendingCoins(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.info("Login required", {
          description: "Please login/signup first to use 23KAAT coins.",
        });
        navigate({ to: "/login", search: { redirectTo: `/checkout?course=${course.slug}` } });
        return;
      }
      const result = await spendCoinsForCourse({ data: { course_id: course.id } });
      toast.success(
        `Unlocked with 23KAAT${result.balance != null ? ` · Balance ${result.balance}` : ""}`,
      );
      window.dispatchEvent(new Event("kkcc:23kaat-refresh"));
      navigate({ to: "/learn", search: { course: course.slug } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "23KAAT payment failed");
    } finally {
      setSpendingCoins(false);
    }
  };

  const applyCoupon = async () => {
    if (!course) return;
    const code = coupon.trim().toUpperCase();
    if (!code) {
      toast.error("Enter a coupon code first");
      return;
    }
    setCouponLoading(true);
    setAppliedCoupon(null);
    try {
      const result = (await validateCouponForCourse({
        data: { code, course_slug: course.slug },
      })) as CouponValidationResult;
      if (!result.valid) {
        toast.error(result.message || "That coupon code is not valid");
        return;
      }
      setAppliedCoupon({
        code: result.code,
        title: result.title,
        discount_percent: result.discount_percent,
        discount_amount: result.discount_amount,
        final_amount: result.final_amount,
        remaining_uses: result.remaining_uses,
      });
      toast.success(result.message || `Coupon applied — ${result.discount_percent}% off`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Coupon check failed");
    } finally {
      setCouponLoading(false);
    }
  };

  const claimCouponCourse = async () => {
    if (!course || !appliedCoupon) return;
    setClaimingCoupon(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.info("Login required", {
          description: "Please login/signup first to claim access with a 100% coupon.",
        });
        navigate({ to: "/login", search: { redirectTo: `/checkout?course=${course.slug}` } });
        return;
      }

      const result = await redeemCouponForCourse({
        data: { code: appliedCoupon.code, course_slug: course.slug },
      });
      if (result.final_amount <= 0 && result.enrolled) {
        toast.success(
          result.already_redeemed ? "Coupon already claimed" : "Coupon claimed — access unlocked",
        );
        navigate({ to: "/learn", search: { course: course.slug } });
        return;
      }
      toast.info("Coupon saved for payment", {
        description: "Partial-discount coupons will be finalized when online payment is enabled.",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Coupon claim failed");
    } finally {
      setClaimingCoupon(false);
    }
  };

  const startFreeCourse = async () => {
    if (!course) return;
    setStartingFree(true);
    try {
      await ensureFreeCourseAccess({ data: { slug: course.slug } });
    } catch {
      // Login is not required for the public lecture page; this call only records
      // the free enrolment when a student is already signed in.
    } finally {
      setStartingFree(false);
      navigate({ to: "/learn", search: { course: course.slug } });
    }
  };

  if (!course) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl font-bold">No course selected</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Published courses will appear here once they are added in the admin panel.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/courses">Browse courses</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {free
              ? "This is a free course. No Razorpay/payment step is required — start learning now."
              : "Review your enrolment. Payment is processed by a secure gateway — no card details are handled by this interface."}
          </p>

          <div className="surface-panel mt-8 overflow-hidden p-0">
            <div className="flex gap-4 p-5">
              <CourseThumb
                course={course}
                className="hidden h-24 w-40 shrink-0 rounded-xl sm:block"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{course.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {course.faculty} · {course.course_type} · {course.lectures_count} lectures
                </p>
                <Link
                  to="/courses/$slug"
                  params={{ slug: course.slug }}
                  className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                >
                  View course details
                </Link>
              </div>
            </div>
          </div>

          {!free && (
            <div className="surface-panel mt-5 p-5">
              <Label htmlFor="coupon" className="text-sm font-semibold">
                Have a coupon?
              </Label>
              <div className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="coupon"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setAppliedCoupon(null);
                    }}
                    placeholder="Enter code"
                    className="pl-9"
                    maxLength={40}
                  />
                </div>
                <Button variant="outline" onClick={applyCoupon} disabled={couponLoading}>
                  {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                </Button>
              </div>
              {appliedCoupon && (
                <p className="mt-3 rounded-2xl border border-success/30 bg-success/10 p-3 text-sm text-success">
                  {appliedCoupon.title}: {appliedCoupon.discount_percent}% off applied
                  {appliedCoupon.remaining_uses !== null
                    ? ` · ${appliedCoupon.remaining_uses} uses left`
                    : ""}
                </p>
              )}
            </div>
          )}
        </div>

        <aside>
          <div className="surface-panel sticky top-24 p-6">
            <h2 className="text-lg font-bold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Course price</dt>
                <dd>
                  {course.original_price > 0
                    ? formatINR(course.original_price)
                    : coursePriceLabel(course)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Course offer</dt>
                <dd className="text-success">−{formatINR(course.original_price - course.price)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Coupon discount</dt>
                <dd className={discount ? "text-success" : ""}>
                  {discount ? `−${formatINR(discount)}` : "—"}
                </dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="font-semibold">Final amount</dt>
                <dd className="font-display text-xl font-bold">
                  {free ? "Free" : formatINR(total)}
                </dd>
              </div>
              {!free && (
                <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2">
                  <dt className="font-semibold text-primary">23KAAT coin price</dt>
                  <dd className="font-bold text-primary">{coinCost} coins</dd>
                </div>
              )}
            </dl>

            {free ? (
              <Button
                size="lg"
                className="mt-6 w-full rounded-full"
                onClick={startFreeCourse}
                disabled={startingFree}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                {startingFree ? "Opening..." : "Start Free Course"}
              </Button>
            ) : total <= 0 && appliedCoupon ? (
              <Button
                size="lg"
                className="mt-6 w-full rounded-full"
                onClick={claimCouponCourse}
                disabled={claimingCoupon}
              >
                {claimingCoupon ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <TicketPercent className="mr-2 h-4 w-4" />
                )}
                Claim free access with coupon
              </Button>
            ) : (
              <div className="mt-6 space-y-3">
                <div className="relative overflow-hidden rounded-2xl border bg-muted/40 p-4 text-sm">
                  <div className="pointer-events-none absolute -right-4 -top-4 opacity-50">
                    <KaatCoinStack />
                  </div>
                  <div className="relative flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-semibold">
                      <KaatCoin size="sm" /> 23KAAT balance
                    </span>
                    <span>{coinBalance === null ? "Login to check" : `${coinBalance} coins`}</span>
                  </div>
                  <p className="relative mt-1 text-xs text-muted-foreground">
                    Use 23KAAT coins to unlock paid courses instantly. 1 coin = ₹1 app credit.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="w-full rounded-full"
                  disabled={spendingCoins}
                  onClick={payWith23Kaat}
                >
                  {spendingCoins ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <KaatCoin size="sm" className="mr-2" />
                  )}
                  Use {coinCost} 23KAAT coins
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full rounded-full">
                  <Link to="/coins">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Buy / request 23KAAT coins
                  </Link>
                </Button>
              </div>
            )}
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {free
                ? "Free courses open instantly. Paid course payment keys stay server-side."
                : paymentConfigured
                  ? "Online payment settings are saved, but this checkout only unlocks access after verified admin/offline processing right now."
                  : payment.offline_payment_instructions}
            </p>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
