import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Layers,
  Loader2,
  Lock,
  MessageCircle,
  PhoneCall,
  PlayCircle,
  ShieldCheck,
  Tag,
  TicketPercent,
} from "lucide-react";
import { toast } from "sonner";
import { CourseThumb } from "@/components/kkcc/course-thumb";
import { KaatCoin, KaatCoinStack } from "@/components/kkcc/kaat-coin";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthUser } from "@/hooks/use-auth-user";
import { invalidateLearningQueries, useLearningAccess } from "@/hooks/use-learning-access";
import { supabase } from "@/integrations/supabase/client";
import { displayNameFromUser } from "@/lib/auth";
import { coinPriceOf, coursePriceLabel, formatINR, isFreeCourse } from "@/lib/cms";
import {
  completeRazorpayLearningPurchase,
  getMy23KaatWallet,
  spend23KaatForCourse,
  spend23KaatForMaterial,
  spend23KaatForSeries,
  spend23KaatForTest,
} from "@/lib/coins.functions";
import {
  getCustomSeriesCatalog,
  listPublishedCourses,
  listPublicMaterials,
  listPublicTests,
  listSeriesOverrides,
} from "@/lib/content.functions";
import { redeemCouponForCourse, validateCouponForCourse } from "@/lib/coupons.functions";
import { submitAdmissionEnquiry } from "@/lib/enquiries.functions";
import { ensureFreeCourseAccess } from "@/lib/enrollments.functions";
import { getPublicPaymentSettings } from "@/lib/platform-settings.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { createLearningRazorpayOrder } from "@/lib/razorpay.functions";
import { rememberPendingPayment, forgetPendingPayment } from "@/lib/pending-payments";
import { RazorpayPaymentRecovery } from "@/components/kkcc/razorpay-payment-recovery";
import {
  QUESTIONS_PER_CHAPTER,
  getEffectiveLearningSeries,
  resolveSeriesPrice,
  seriesPlan,
  seriesTotals,
  setRuntimeCustomSeriesCatalog,
} from "@/lib/test-series-catalog";

const searchSchema = z.object({
  course: z.string().optional(),
  series: z.string().optional(),
  test: z.string().optional(),
  /** Paid study notes / notes bundle id — same checkout, same Razorpay path. */
  note: z.string().optional(),
  coupon: z.string().optional(),
});

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

async function ensureRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Checkout — KKCC Excellence Hub" },
      {
        name: "description",
        content: "Review your KKCC batch or test series enrollment summary and complete checkout.",
      },
      { property: "og:title", content: "Checkout — KKCC Excellence Hub" },
      {
        property: "og:description",
        content: "Batch and Test Series summary, pricing, and enrollment.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async () => {
    const [courses, tests, notes, customCatalog, seriesOverrides, payment] = await Promise.all([
      safeServerCall(() => listPublishedCourses(), []),
      safeServerCall(() => listPublicTests(), []),
      safeServerCall(() => listPublicMaterials(), []),
      safeServerCall(() => getCustomSeriesCatalog({} as never), {}),
      safeServerCall(() => listSeriesOverrides({} as never), []),
      safeServerCall(() => getPublicPaymentSettings(), {
        enabled: false,
        provider: "razorpay",
        mode: "test",
        razorpay_key_id: "",
        offline_payment_instructions:
          "Online payment (Razorpay) is currently off. Please contact Admin for offline payment (UPI / Cash / Bank Transfer) to unlock access on your student account.",
      }),
    ]);
    return { courses, tests, notes, customCatalog, seriesOverrides, payment };
  },
  component: Checkout,
});

type AppliedCoupon = {
  code: string;
  title: string;
  discount_percent: number;
  discount_amount: number;
  final_amount: number;
  final_coins?: number;
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
      original_coins?: number;
      discount_coins?: number;
      final_coins?: number;
      remaining_uses: number | null;
      message?: string;
    };

function Checkout() {
  const {
    course: slug,
    series: seriesIdParam,
    test: testIdParam,
    note: noteIdParam,
    coupon: initialCouponParam,
  } = Route.useSearch();
  const { courses, tests, notes, customCatalog, seriesOverrides, payment } = Route.useLoaderData();

  const checkoutMode: "series" | "test" | "course" | "material" = seriesIdParam
    ? "series"
    : testIdParam
      ? "test"
      : noteIdParam
        ? "material"
        : "course";

  const allSeries = useMemo(() => {
    setRuntimeCustomSeriesCatalog(customCatalog ?? {});
    const overrideMap = new Map((seriesOverrides ?? []).map((row) => [row.series_id, row]));
    return getEffectiveLearningSeries(customCatalog ?? {})
      .filter((s) => overrideMap.get(s.id)?.enabled !== false)
      .map((s) => {
        const o = overrideMap.get(s.id);
        const price = resolveSeriesPrice(s, o);
        return {
          ...s,
          name: o?.name ?? s.name,
          summary: o?.summary ?? s.summary,
          ...price,
        };
      });
  }, [customCatalog, seriesOverrides]);

  const selectedSeries = useMemo(
    () => (seriesIdParam ? (allSeries.find((s) => s.id === seriesIdParam) ?? null) : null),
    [allSeries, seriesIdParam],
  );
  const selectedTest = useMemo(
    () => (testIdParam ? (tests.find((t) => t.id === testIdParam) ?? null) : null),
    [tests, testIdParam],
  );
  const course = useMemo(
    () => (slug ? courses.find((c) => c.slug === slug) : undefined),
    [courses, slug],
  );
  /** Notes have to be Paid in the admin panel before they can be sold. */
  const selectedNote = useMemo(
    () => (noteIdParam ? (notes.find((n) => n.id === noteIdParam) ?? null) : null),
    [notes, noteIdParam],
  );
  const notePurchasable = Boolean(selectedNote && selectedNote.access_type === "paid");

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [claimingCoupon, setClaimingCoupon] = useState(false);
  const [startingFree, setStartingFree] = useState(false);
  const [spendingCoins, setSpendingCoins] = useState(false);
  const [payingOnline, setPayingOnline] = useState(false);
  const [sendingOfflineRequest, setSendingOfflineRequest] = useState(false);
  const [offlineRequestSent, setOfflineRequestSent] = useState(false);
  // Shown after a payment that could not be confirmed, so the student can
  // recover the access themselves instead of waiting for the admin.
  const [showRecovery, setShowRecovery] = useState(false);

  const paymentConfigured = Boolean(payment.enabled && payment.razorpay_key_id);
  const navigate = useNavigate();
  const loadWallet = useServerFn(getMy23KaatWallet);
  const spendCoinsForCourse = useServerFn(spend23KaatForCourse);
  const spendCoinsForSeries = useServerFn(spend23KaatForSeries);
  const spendCoinsForTest = useServerFn(spend23KaatForTest);
  const spendCoinsForNotes = useServerFn(spend23KaatForMaterial);
  const finishRazorpayPurchase = useServerFn(completeRazorpayLearningPurchase);
  const sendEnquiry = useServerFn(submitAdmissionEnquiry);

  const { user } = useAuthUser();
  const learningAccess = useLearningAccess();
  const queryClient = useQueryClient();
  const wallet = useQuery({
    queryKey: ["student", user?.id, "wallet"],
    enabled: Boolean(user),
    queryFn: () => loadWallet(),
    retry: 1,
  });
  const coinBalance = wallet.data?.balance ?? null;

  const alreadyUnlocked = useMemo(() => {
    if (checkoutMode === "series" && selectedSeries) {
      return Boolean(learningAccess.data?.allowed_series_ids.includes(selectedSeries.id));
    }
    if (checkoutMode === "test" && selectedTest) {
      return Boolean(learningAccess.data?.allowed_test_ids.includes(selectedTest.id));
    }
    // Notes: the server answers "already unlocked" when the order is created,
    // so an owner of the note is never asked to pay twice.
    return false;
  }, [checkoutMode, selectedSeries, selectedTest, learningAccess.data]);

  const free = useMemo(() => {
    if (checkoutMode === "series" && selectedSeries) {
      return selectedSeries.priceInr <= 0 && selectedSeries.priceCoins <= 0;
    }
    if (checkoutMode === "test" && selectedTest) {
      return (
        !selectedTest.is_paid || (selectedTest.price_inr <= 0 && selectedTest.price_coins <= 0)
      );
    }
    if (checkoutMode === "material") {
      // Free notes never reach checkout; batch-only notes are not sold here.
      return !notePurchasable;
    }
    return course ? isFreeCourse(course) : false;
  }, [checkoutMode, selectedSeries, selectedTest, course, notePurchasable]);

  const basePriceInr = useMemo(() => {
    if (checkoutMode === "series" && selectedSeries) return Math.max(0, selectedSeries.priceInr);
    if (checkoutMode === "test" && selectedTest) return Math.max(0, selectedTest.price_inr);
    if (checkoutMode === "material" && selectedNote && notePurchasable)
      return Math.max(0, selectedNote.price ?? 0);
    return course ? Math.max(0, course.price) : 0;
  }, [checkoutMode, selectedSeries, selectedTest, course, selectedNote, notePurchasable]);

  const originalPriceInr = useMemo(() => {
    if (checkoutMode === "series" && selectedSeries) return Math.max(0, selectedSeries.priceInr);
    if (checkoutMode === "test" && selectedTest) return Math.max(0, selectedTest.price_inr);
    if (checkoutMode === "material" && selectedNote) return Math.max(0, selectedNote.price ?? 0);
    return course ? Math.max(course.original_price || course.price, course.price) : 0;
  }, [checkoutMode, selectedSeries, selectedTest, course, selectedNote]);

  const baseCoinCost = useMemo(() => {
    if (free) return 0;
    if (checkoutMode === "series" && selectedSeries) {
      return Math.max(0, selectedSeries.priceCoins || selectedSeries.priceInr);
    }
    if (checkoutMode === "test" && selectedTest) {
      return Math.max(0, selectedTest.price_coins || selectedTest.price_inr);
    }
    if (checkoutMode === "material" && selectedNote) return Math.max(0, coinPriceOf(selectedNote));
    return course ? coinPriceOf(course) : 0;
  }, [free, checkoutMode, selectedSeries, selectedTest, course, selectedNote]);

  const coinCost = useMemo(() => {
    if (free) return 0;
    if (appliedCoupon) {
      if (typeof appliedCoupon.final_coins === "number") return appliedCoupon.final_coins;
      const disc = Math.round((baseCoinCost * appliedCoupon.discount_percent) / 100);
      return Math.max(0, baseCoinCost - disc);
    }
    return baseCoinCost;
  }, [free, baseCoinCost, appliedCoupon]);

  const discount = !free ? (appliedCoupon?.discount_amount ?? 0) : 0;
  const total = free ? 0 : Math.max(0, appliedCoupon?.final_amount ?? basePriceInr);

  const itemTitle =
    checkoutMode === "series"
      ? (selectedSeries?.name ?? "")
      : checkoutMode === "test"
        ? (selectedTest?.title ?? "")
        : checkoutMode === "material"
          ? (selectedNote?.title ?? "")
          : (course?.title ?? "");

  const itemId =
    checkoutMode === "series"
      ? (selectedSeries?.id ?? "")
      : checkoutMode === "test"
        ? (selectedTest?.id ?? "")
        : checkoutMode === "material"
          ? (selectedNote?.id ?? "")
          : (course?.id ?? "");

  const redirectUrlAfterCheckout =
    checkoutMode === "series" && selectedSeries
      ? `/checkout?series=${selectedSeries.id}`
      : checkoutMode === "test" && selectedTest
        ? `/checkout?test=${selectedTest.id}`
        : checkoutMode === "material" && selectedNote
          ? `/checkout?note=${selectedNote.id}`
          : course
            ? `/checkout?course=${course.slug}`
            : "/checkout";

  const openAfterUnlock = () => {
    if (checkoutMode === "material") {
      void navigate({ to: "/study-material" });
      return;
    }
    if (checkoutMode === "series" && selectedSeries) {
      void navigate({
        to: "/test-series/learn/$seriesId",
        params: { seriesId: selectedSeries.id },
      });
      return;
    }
    if (checkoutMode === "test" && selectedTest) {
      void navigate({
        to: "/tests/learn/$testId",
        params: { testId: selectedTest.id },
      });
      return;
    }
    if (course) {
      void navigate({ to: "/learn", search: { course: course.slug } });
    }
  };

  const payWith23Kaat = async () => {
    if (!itemId) return;
    setSpendingCoins(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.info("Login required", {
          description: "Please login/signup first to use 23KAAT coins.",
        });
        void navigate({ to: "/login", search: { redirectTo: redirectUrlAfterCheckout } });
        return;
      }
      const result =
        checkoutMode === "series" && selectedSeries
          ? await spendCoinsForSeries({
              data: {
                series_id: selectedSeries.id,
                expected_coins: coinCost,
                coupon_code: appliedCoupon?.code ?? "",
              },
            })
          : checkoutMode === "test" && selectedTest
            ? await spendCoinsForTest({
                data: {
                  test_id: selectedTest.id,
                  expected_coins: coinCost,
                  coupon_code: appliedCoupon?.code ?? "",
                },
              })
            : checkoutMode === "material" && selectedNote
              ? await spendCoinsForNotes({ data: { material_id: selectedNote.id } })
              : course
                ? await spendCoinsForCourse({
                    data: {
                      course_id: course.id,
                      expected_coins: coinCost,
                      coupon_code: appliedCoupon?.code ?? "",
                    },
                  })
                : null;
      if (!result) return;
      // The notes path answers with the note payload instead of a wallet
      // balance, so the balance is read defensively.
      const remainingBalance = (result as { balance?: number }).balance;
      toast.success(
        `Unlocked with 23KAAT${remainingBalance != null ? ` · Balance ${remainingBalance}` : ""}`,
      );
      await invalidateLearningQueries(queryClient);
      window.dispatchEvent(new Event("kkcc:23kaat-refresh"));
      openAfterUnlock();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "23KAAT payment failed");
    } finally {
      setSpendingCoins(false);
    }
  };

  const handleRazorpayCheckout = async () => {
    if (!itemId) return;
    const { data: session } = await supabase.auth.getSession();
    if (!session.session || !user) {
      toast.info("Login required", {
        description: "Please login or sign up first to buy online.",
      });
      void navigate({ to: "/login", search: { redirectTo: redirectUrlAfterCheckout } });
      return;
    }
    if (!paymentConfigured) {
      toast.info("Please contact Admin for offline payment", {
        description:
          "Online payment (Razorpay) is currently off. Please contact Admin for offline payment to unlock access.",
      });
      return;
    }

    setPayingOnline(true);
    try {
      const loaded = await ensureRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error(
          "Could not load Razorpay checkout. Please check your connection or contact Admin.",
        );
      }

      // The price and the Razorpay order are created on the server, so the
      // amount cannot be edited from the browser and every payment carries the
      // student + item in its notes (that is what powers payment recovery).
      const order = await createLearningRazorpayOrder({
        data: {
          kind: checkoutMode,
          item_id: itemId,
          coupon_code: appliedCoupon?.code ?? "",
        },
      });

      if (order.already_unlocked) {
        await invalidateLearningQueries(queryClient);
        toast.success("Already active on your account", {
          description: `${order.item_title} is already unlocked — no payment needed.`,
        });
        openAfterUnlock();
        return;
      }

      const payableInr = Math.max(0, order.amount_inr || total);
      if (payableInr <= 0) {
        toast.info("This coupon makes the item free", {
          description: "Use the free claim button — no payment is required.",
        });
        return;
      }

      const rzp = new window.Razorpay({
        key: order.key_id || payment.razorpay_key_id,
        ...(order.order_id ? { order_id: order.order_id } : {}),
        amount: order.amount_paise || Math.round(payableInr * 100),
        currency: "INR",
        name: "KKCC Excellence Hub",
        description: `${checkoutMode === "series" ? "Test Series" : checkoutMode === "test" ? "Mock Test" : checkoutMode === "material" ? "Study Notes" : "Batch"}: ${itemTitle}`,
        prefill: {
          name: displayNameFromUser(user) || user.email || "Student",
          email: user.email || "",
        },
        theme: { color: "#dc2626" },
        modal: {
          ondismiss: () => {
            setPayingOnline(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id?: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) => {
          const paymentId = response.razorpay_payment_id || "";
          if (!paymentId) {
            setShowRecovery(true);
            toast.error("Razorpay did not return a Payment ID", {
              description:
                "Please check your UPI app statement and contact Admin if money was cut.",
            });
            return;
          }
          // Remember the id first: if this call fails, the student can recover
          // the access with one tap, even after closing the app.
          rememberPendingPayment({
            payment_id: paymentId,
            kind: checkoutMode,
            item_id: itemId,
            title: itemTitle,
            amount_inr: payableInr,
          });
          try {
            await finishRazorpayPurchase({
              data: {
                kind: checkoutMode,
                item_id: itemId,
                coupon_code: appliedCoupon?.code ?? "",
                razorpay_payment_id: paymentId,
                razorpay_order_id: response.razorpay_order_id || order.order_id || "",
                razorpay_signature: response.razorpay_signature || "",
              },
            });
            forgetPendingPayment(paymentId);
            await invalidateLearningQueries(queryClient);
            toast.success("Payment Successful — Access Unlocked!", {
              description: `${itemTitle} is now active on your student account.`,
            });
            openAfterUnlock();
          } catch (err) {
            setShowRecovery(true);
            toast.error(
              err instanceof Error
                ? err.message
                : "Payment verification failed. Please use Payment Recovery below.",
              {
                description:
                  "Aapka Payment ID save kar liya gaya hai — neeche 'Verify & unlock' dabaayein.",
              },
            );
          }
        },
      });
      rzp.open();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Please contact Admin for offline payment.",
      );
    } finally {
      setPayingOnline(false);
    }
  };

  const handleContactAdminOffline = async () => {
    if (!itemId) return;
    if (!user?.email) {
      toast.info("Login required", {
        description: "Please login or sign up first so Admin can unlock your student account.",
      });
      void navigate({ to: "/login", search: { redirectTo: redirectUrlAfterCheckout } });
      return;
    }

    setSendingOfflineRequest(true);
    try {
      const label =
        checkoutMode === "series"
          ? `Test Series (${itemTitle})`
          : checkoutMode === "test"
            ? `Mock Test (${itemTitle})`
            : checkoutMode === "material"
              ? `Study Notes (${itemTitle})`
              : `Batch / Course (${itemTitle})`;
      const couponSuffix = appliedCoupon
        ? ` Coupon applied: ${appliedCoupon.code} (${appliedCoupon.discount_percent}% OFF — saved ${formatINR(appliedCoupon.discount_amount)}).`
        : "";
      await sendEnquiry({
        data: {
          name: displayNameFromUser(user) || user.email,
          email: user.email,
          phone: "",
          class_level:
            checkoutMode === "series"
              ? (selectedSeries?.examTrack ?? "")
              : checkoutMode === "test"
                ? (selectedTest?.exam_track ?? "")
                : checkoutMode === "material"
                  ? (selectedNote?.class_level ?? "")
                  : (course?.class_level ?? ""),
          interest: label,
          source:
            checkoutMode === "series"
              ? "paid_test_series"
              : checkoutMode === "material"
                ? "paid_notes"
                : "checkout",
          message: `Offline payment / unlock request for ${label}.${couponSuffix} Final Payable Price: ${formatINR(total)} (or ${coinCost} 23KAAT coins). Please contact me for offline payment and unlock access on my student account (${user.email}).`,
        },
      });
      setOfflineRequestSent(true);
      toast.success("Please contact Admin for offline payment", {
        description: `Your offline payment request for "${itemTitle}" has been sent to Admin. Once payment is confirmed, Admin will activate access on your account.`,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send request to Admin");
    } finally {
      setSendingOfflineRequest(false);
    }
  };

  const runValidateCoupon = async (rawCode: string, silent = false) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      if (!silent) toast.error("Enter a coupon code first");
      return;
    }
    setCouponLoading(true);
    setAppliedCoupon(null);
    try {
      const result = (await validateCouponForCourse({
        data: {
          code,
          course_slug: checkoutMode === "course" ? (course?.slug ?? "") : "",
          series_id: checkoutMode === "series" ? (selectedSeries?.id ?? "") : "",
          test_id: checkoutMode === "test" ? (selectedTest?.id ?? "") : "",
          material_id: checkoutMode === "material" ? (selectedNote?.id ?? "") : "",
        },
      })) as CouponValidationResult;
      if (!result.valid) {
        if (!silent) toast.error(result.message || "That coupon code is not valid");
        return;
      }
      setAppliedCoupon({
        code: result.code,
        title: result.title,
        discount_percent: result.discount_percent,
        discount_amount: result.discount_amount,
        final_amount: result.final_amount,
        ...(typeof result.final_coins === "number" ? { final_coins: result.final_coins } : {}),
        remaining_uses: result.remaining_uses,
      });
      toast.success(result.message || `Coupon applied — ${result.discount_percent}% off`);
    } catch (error) {
      if (!silent) toast.error(error instanceof Error ? error.message : "Coupon check failed");
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    if (initialCouponParam && !appliedCoupon) {
      setCoupon(initialCouponParam.toUpperCase());
      void runValidateCoupon(initialCouponParam, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCouponParam]);

  const applyCoupon = async () => {
    await runValidateCoupon(coupon, false);
  };

  const claimCouponCourse = async () => {
    if (!appliedCoupon) return;
    setClaimingCoupon(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.info("Login required", {
          description: "Please login/signup first to claim access with a 100% coupon.",
        });
        void navigate({ to: "/login", search: { redirectTo: redirectUrlAfterCheckout } });
        return;
      }

      const result = await redeemCouponForCourse({
        data: {
          code: appliedCoupon.code,
          course_slug: checkoutMode === "course" ? (course?.slug ?? "") : "",
          series_id: checkoutMode === "series" ? (selectedSeries?.id ?? "") : "",
          test_id: checkoutMode === "test" ? (selectedTest?.id ?? "") : "",
        },
      });
      if (result.final_amount <= 0 && result.enrolled) {
        await invalidateLearningQueries(queryClient);
        toast.success(
          result.already_redeemed
            ? "Coupon already claimed"
            : "100% Coupon claimed — access unlocked!",
        );
        openAfterUnlock();
        return;
      }
      toast.info("Coupon discount applied", {
        description: `${appliedCoupon.discount_percent}% discount is applied to your final price.`,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Coupon claim failed");
    } finally {
      setClaimingCoupon(false);
    }
  };

  const startFreeItem = async () => {
    if (checkoutMode === "series" && selectedSeries) {
      void navigate({
        to: "/test-series/learn/$seriesId",
        params: { seriesId: selectedSeries.id },
      });
      return;
    }
    if (checkoutMode === "test" && selectedTest) {
      void navigate({
        to: "/tests/learn/$testId",
        params: { testId: selectedTest.id },
      });
      return;
    }
    if (checkoutMode === "material") {
      void navigate({ to: "/study-material" });
      return;
    }
    if (!course) return;
    setStartingFree(true);
    try {
      if (user) {
        await ensureFreeCourseAccess({ data: { slug: course.slug } });
        await invalidateLearningQueries(queryClient);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Free enrollment could not be recorded. Public free lessons remain available.",
      );
    } finally {
      setStartingFree(false);
      void navigate({ to: "/learn", search: { course: course.slug } });
    }
  };

  if (!course && !selectedSeries && !selectedTest && !selectedNote) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl font-bold">No batch, test series or notes selected</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a course batch, test series or paid notes to proceed to checkout.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link to="/courses">Browse Batches</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/test-series">Browse Test Series</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/study-material">Browse Notes</Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const seriesSubjects = selectedSeries ? seriesPlan(selectedSeries) : [];
  const sTotals = selectedSeries ? seriesTotals(selectedSeries) : null;
  const qPerChapter = selectedSeries
    ? Math.max(1, selectedSeries.questionsPerTest ?? QUESTIONS_PER_CHAPTER)
    : QUESTIONS_PER_CHAPTER;

  return (
    <SiteLayout>
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {checkoutMode === "series"
                ? "Test Series Checkout"
                : checkoutMode === "test"
                  ? "Test Unlock Checkout"
                  : "Batch Checkout"}
            </h1>
            <Badge
              variant="outline"
              className={
                free
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : paymentConfigured
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300"
              }
            >
              {free
                ? "Free Access"
                : paymentConfigured
                  ? "Paid · Online (Razorpay) Active"
                  : "Paid · Offline (Contact Admin)"}
            </Badge>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {free
              ? "No Razorpay or payment step is required — start learning right away."
              : paymentConfigured
                ? "Pay online via Razorpay, unlock immediately with 23KAAT coins, or contact Admin for offline payment."
                : "Online payment (Razorpay) is currently off — please contact Admin for offline payment or use your 23KAAT wallet."}
          </p>

          {/* Item Card */}
          <div className="surface-panel mt-6 overflow-hidden p-5">
            {checkoutMode === "course" && course ? (
              <div className="flex gap-4">
                <CourseThumb
                  course={course}
                  className="hidden h-24 w-40 shrink-0 rounded-xl sm:block"
                />
                <div className="min-w-0">
                  <Badge variant="secondary" className="mb-1.5 rounded-full text-[11px]">
                    {course.category} · {course.class_level}
                  </Badge>
                  <p className="text-base font-bold">{course.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.faculty} · {course.course_type} · {course.lectures_count} lectures
                  </p>
                  <Link
                    to="/courses/$slug"
                    params={{ slug: course.slug }}
                    className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                  >
                    View batch details →
                  </Link>
                </div>
              </div>
            ) : checkoutMode === "series" && selectedSeries && sTotals ? (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="secondary" className="rounded-full text-[11px]">
                    Oriented for: {selectedSeries.examTrack}
                  </Badge>
                  <Badge variant="outline" className="rounded-full text-[11px]">
                    {sTotals.subjects} Subjects · {sTotals.chapters} Chapters · {sTotals.tests}{" "}
                    Tests
                  </Badge>
                </div>
                <p className="mt-2 text-lg font-bold">{selectedSeries.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {selectedSeries.summary}
                </p>
                <Link
                  to="/test-series/learn/$seriesId"
                  params={{ seriesId: selectedSeries.id }}
                  search={{ view: "tests" }}
                  className="mt-3 inline-block text-xs font-bold text-primary hover:underline"
                >
                  View full tests &amp; syllabus in this series →
                </Link>
              </div>
            ) : selectedTest ? (
              <div>
                <Badge variant="secondary" className="rounded-full text-[11px]">
                  {selectedTest.exam_track || selectedTest.subject || "Mock Test"}
                </Badge>
                <p className="mt-2 text-lg font-bold">{selectedTest.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedTest.questions_count} Questions · {selectedTest.total_marks} Marks ·{" "}
                  {selectedTest.duration_minutes} Minutes
                </p>
              </div>
            ) : null}
          </div>

          {/* Money deducted but no access? Verify the payment right here. */}
          {(paymentConfigured || showRecovery) && !free && (
            <RazorpayPaymentRecovery className="mt-5" />
          )}

          {/* When Razorpay is OFF, show prominent English Contact Admin Notice Card */}
          {!free && !paymentConfigured && (
            <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-black text-amber-900 dark:text-amber-200">
                  <PhoneCall className="h-4 w-4" />
                  Paid (Offline) — Please Contact Admin
                </p>
                <Badge className="rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200">
                  Paid · Offline
                </Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-foreground/90">
                Online payment (Razorpay) is not added yet.{" "}
                <strong>Please contact Admin for offline payment</strong> (UPI / Cash / Bank
                Transfer). Once your offline payment is confirmed, Admin will immediately unlock{" "}
                <strong>{itemTitle}</strong> on your student account.
              </p>
              {payment.offline_payment_instructions && (
                <p className="mt-2 rounded-xl border border-amber-500/30 bg-background/70 p-3 text-xs text-muted-foreground">
                  {payment.offline_payment_instructions}
                </p>
              )}
            </div>
          )}

          {/* If checking out a Test Series, show the complete Syllabus right here */}
          {checkoutMode === "series" && selectedSeries && seriesSubjects.length > 0 && (
            <div className="surface-panel mt-5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-sm font-black">
                  <Layers className="h-4 w-4 text-primary" />
                  Complete Series Syllabus ({seriesSubjects.length} Subjects)
                </h2>
                <span className="text-xs font-bold text-primary">{qPerChapter}Q per chapter</span>
              </div>
              <div className="mt-3 space-y-3">
                {seriesSubjects.map((item) => (
                  <div key={item.subject} className="rounded-xl border bg-background/60 p-3">
                    <p className="text-xs font-black uppercase tracking-wider text-primary">
                      {item.subject} · {item.chapters.length} chapters
                    </p>
                    <ol className="mt-1.5 grid gap-1 sm:grid-cols-2">
                      {item.chapters.map((ch, idx) => (
                        <li key={ch} className="truncate text-xs text-muted-foreground">
                          <span className="mr-1 font-bold text-foreground">{idx + 1}.</span>
                          {ch}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupon Box (1% to 100% Discount for Batches, Test Series & Tests) */}
          {!free && (
            <div className="surface-panel mt-5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="coupon" className="text-sm font-semibold">
                  Have a coupon code? (1% to 100% OFF)
                </Label>
                {appliedCoupon && (
                  <Badge className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    {appliedCoupon.discount_percent}% Discount Active
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Apply a coupon code created in Admin → Coupons to get 1% to 100% discount on this{" "}
                {checkoutMode === "series"
                  ? "test series"
                  : checkoutMode === "test"
                    ? "test"
                    : "batch"}
                .
              </p>
              <div className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="coupon"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value.toUpperCase());
                      setAppliedCoupon(null);
                    }}
                    placeholder="Enter coupon code (e.g. KKCC50)"
                    className="pl-9 font-mono uppercase"
                    maxLength={40}
                  />
                </div>
                <Button variant="outline" onClick={applyCoupon} disabled={couponLoading}>
                  {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply Coupon"}
                </Button>
              </div>
              {appliedCoupon && (
                <div className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                  <p className="font-bold">
                    {appliedCoupon.title} ({appliedCoupon.code}): {appliedCoupon.discount_percent}%
                    OFF applied!
                  </p>
                  <p className="mt-0.5 text-xs">
                    You save {formatINR(appliedCoupon.discount_amount)} · Final payable:{" "}
                    <strong>{total <= 0 ? "Free (₹0)" : formatINR(total)}</strong>
                    {appliedCoupon.remaining_uses !== null
                      ? ` · ${appliedCoupon.remaining_uses} uses left`
                      : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <aside>
          <div className="surface-panel sticky top-24 p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Order summary</h2>
              {!free && (
                <Badge
                  variant="outline"
                  className={
                    paymentConfigured
                      ? "border-primary/40 text-primary"
                      : "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300"
                  }
                >
                  {paymentConfigured ? "Paid · Online" : "Paid · Offline"}
                </Badge>
              )}
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Price</dt>
                <dd>{free ? "Free" : formatINR(originalPriceInr)}</dd>
              </div>
              {originalPriceInr > basePriceInr && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Offer discount</dt>
                  <dd className="text-success">−{formatINR(originalPriceInr - basePriceInr)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Coupon discount{appliedCoupon ? ` (${appliedCoupon.discount_percent}%)` : ""}
                </dt>
                <dd className={discount ? "font-semibold text-success" : ""}>
                  {discount ? `−${formatINR(discount)}` : "—"}
                </dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="font-semibold">Final amount</dt>
                <dd className="font-display text-xl font-bold">
                  {free || total <= 0 ? "Free (₹0)" : formatINR(total)}
                </dd>
              </div>
              {!free && coinCost > 0 && (
                <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2">
                  <dt className="font-semibold text-primary">23KAAT coin price</dt>
                  <dd className="font-bold text-primary">
                    {coinCost} coins
                    {appliedCoupon && baseCoinCost > coinCost ? (
                      <span className="ml-1.5 text-xs text-muted-foreground line-through">
                        {baseCoinCost}
                      </span>
                    ) : null}
                  </dd>
                </div>
              )}
            </dl>

            {checkoutMode === "material" && !notePurchasable ? (
              <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
                <p className="font-bold text-amber-900 dark:text-amber-200">
                  Ye notes online bikri ke liye set nahi hain
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Notes ya to Free hain, ya apne Batch ke saath aate hain. Admin panel → Study
                  material me isse <strong>Paid</strong> karke ₹ price daal dein, phir yahan online
                  payment button aa jayega.
                </p>
                <Button asChild variant="outline" className="mt-3 rounded-full">
                  <Link to="/study-material">Back to Study Material</Link>
                </Button>
              </div>
            ) : alreadyUnlocked || free ? (
              <Button
                size="lg"
                className="mt-6 w-full rounded-full"
                onClick={startFreeItem}
                disabled={startingFree}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                {alreadyUnlocked
                  ? "Already Unlocked — Start Now"
                  : startingFree
                    ? "Opening..."
                    : "Start Free Now"}
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
                Claim Free Access with 100% Coupon
              </Button>
            ) : (
              <div className="mt-6 space-y-3">
                {/* Primary Payment Option: Online Razorpay when ON, or Contact Admin Offline when OFF */}
                {paymentConfigured ? (
                  <Button
                    size="lg"
                    className="w-full rounded-full"
                    disabled={payingOnline}
                    onClick={handleRazorpayCheckout}
                  >
                    {payingOnline ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Buy Online with Razorpay — {formatINR(total)}
                  </Button>
                ) : (
                  <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Online payment (Razorpay) is currently off
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Please contact Admin for offline payment to unlock this{" "}
                      {checkoutMode === "series"
                        ? "test series"
                        : checkoutMode === "test"
                          ? "test"
                          : "batch"}{" "}
                      on your account.
                    </p>
                    <Button
                      size="lg"
                      className="mt-3 w-full rounded-full"
                      disabled={sendingOfflineRequest || offlineRequestSent}
                      onClick={handleContactAdminOffline}
                    >
                      {sendingOfflineRequest ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <PhoneCall className="mr-2 h-4 w-4" />
                      )}
                      {offlineRequestSent
                        ? "Request Sent — Contact Admin"
                        : "Contact Admin for Offline Payment"}
                    </Button>
                  </div>
                )}

                {/* 23KAAT Wallet Option */}
                {coinCost > 0 && (
                  <>
                    <div className="relative overflow-hidden rounded-2xl border bg-muted/40 p-4 text-sm">
                      <div className="pointer-events-none absolute -right-4 -top-4 opacity-50">
                        <KaatCoinStack />
                      </div>
                      <div className="relative flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 font-semibold">
                          <KaatCoin size="sm" /> 23KAAT balance
                        </span>
                        <span>
                          {coinBalance === null ? "Login to check" : `${coinBalance} coins`}
                        </span>
                      </div>
                      <p className="relative mt-1 text-xs text-muted-foreground">
                        Use 23KAAT coins to unlock paid batches &amp; test series instantly.
                      </p>
                    </div>
                    <Button
                      size="lg"
                      variant={paymentConfigured ? "outline" : "default"}
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
                  </>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                    <Link to="/support">
                      <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                      Contact Admin
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                    <Link to="/coins">
                      <KaatCoin size="sm" className="mr-1.5" />
                      Get 23KAAT Coins
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {free
                ? "Free access opens immediately."
                : paymentConfigured
                  ? "Razorpay online checkout is active. You can also unlock with 23KAAT coins or offline payment."
                  : "Paid (Offline): Please contact Admin for offline payment until Razorpay is enabled."}
            </p>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
