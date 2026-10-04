/**
 * Razorpay server functions.
 *
 * `createLearningRazorpayOrder` / `createCoinPackRazorpayOrder`
 *   Price the item on the server (coupon included) and open a Razorpay order
 *   whose notes name the student and the item. Returns `order_id: ""` when the
 *   Key Secret is not configured yet, so checkout can fall back to the legacy
 *   amount-only flow instead of breaking.
 *
 * `recoverRazorpayPurchase`
 *   Student self service: "money was deducted but I still have no access".
 *   The payment is fetched straight from Razorpay, matched to the calling
 *   student through the order notes, and the access is granted. This is the
 *   safety net for a browser tab that closed mid-payment.
 *
 * `adminRecoverRazorpayPurchase`
 *   The same, for the admin panel, so support can unlock a student from a
 *   Payment ID alone.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdmin } from "@/lib/learning.server";
import {
  grantCoinPackPurchase,
  grantLearningPurchase,
  hasLearningAccess,
  loadCoinPack,
  resolveLearningPrice,
  type LearningKind,
} from "@/lib/learning-purchase.server";
import { resolveServerCouponDiscount } from "@/lib/coupons.functions";
import { markPaymentPaid, recordPaymentEntry } from "@/lib/payment-ledger.server";
import {
  createRazorpayOrder,
  paymentStatusLabel,
  RazorpayError,
  readRazorpayCredentials,
  verifyRazorpayPayment,
} from "@/lib/razorpay.server";

const learningOrderSchema = z.object({
  kind: z.enum(["course", "series", "test"]),
  item_id: z.string().trim().min(1).max(120),
  coupon_code: z.string().trim().max(40).optional().default(""),
});

const coinPackOrderSchema = z.object({
  package_id: z.string().uuid(),
});

const recoverSchema = z.object({
  payment_id: z.string().trim().min(6).max(120),
});

const adminRecoverSchema = z.object({
  payment_id: z.string().trim().min(6).max(120),
  user_id: z.string().trim().max(80).optional().default(""),
  email: z.string().trim().max(200).optional().default(""),
  kind: z.enum(["course", "series", "test", "coin_pack"]).optional(),
  item_id: z.string().trim().max(120).optional().default(""),
});

function shortReceipt(prefix: string, id: string) {
  return `${prefix}_${id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 18)}_${Date.now().toString(36)}`;
}

function friendlyRazorpayError(error: unknown): never {
  if (error instanceof RazorpayError) throw new Error(error.message);
  throw error instanceof Error ? error : new Error("Razorpay request failed.");
}

/**
 * Open a Razorpay order for a Batch / Test Series / Test, priced on the server.
 * A 100% coupon never reaches here — that path unlocks without any payment.
 */
export const createLearningRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => learningOrderSchema.parse(input))
  .handler(async ({ context, data }) => {
    const credentials = await readRazorpayCredentials();
    if (!credentials.enabled || !credentials.keyId) {
      throw new Error(
        "Online payment (Razorpay) is currently off. Please contact Admin for offline payment.",
      );
    }

    const kind = data.kind as LearningKind;
    const existing = await hasLearningAccess(context.userId, kind, data.item_id);
    if (existing) {
      const price = await resolveLearningPrice({ kind, itemId: data.item_id });
      return {
        already_unlocked: true,
        order_id: "",
        amount_inr: price.finalInr,
        amount_paise: 0,
        key_id: credentials.keyId,
        mode: credentials.mode,
        item_title: price.item.title,
        verified_checkout: credentials.verifiable,
        message: "This item is already active on your account.",
      };
    }

    // Quote only — the coupon is recorded once, on the call that unlocks.
    const price = await resolveLearningPrice({
      kind,
      itemId: data.item_id,
      couponCode: data.coupon_code,
      userId: context.userId,
      recordRedemption: false,
    });

    if (price.finalInr <= 0) {
      return {
        already_unlocked: false,
        order_id: "",
        amount_inr: 0,
        amount_paise: 0,
        key_id: credentials.keyId,
        mode: credentials.mode,
        item_title: price.item.title,
        verified_checkout: credentials.verifiable,
        message: "This coupon makes the item free — claim it without paying.",
      };
    }

    // Without the Key Secret there is no Orders API access; the legacy flow
    // still works and the amount is re-checked at completion time.
    if (!credentials.verifiable) {
      return {
        already_unlocked: false,
        order_id: "",
        amount_inr: price.finalInr,
        amount_paise: Math.round(price.finalInr * 100),
        key_id: credentials.keyId,
        mode: credentials.mode,
        item_title: price.item.title,
        verified_checkout: false,
        message: "",
      };
    }

    try {
      const order = await createRazorpayOrder({
        credentials,
        amountInr: price.finalInr,
        receipt: shortReceipt(kind, price.item.id),
        notes: {
          user_id: context.userId,
          kind,
          item_id: price.item.id,
          coupon_code: data.coupon_code ?? "",
        },
      });
      // Ledger row the moment checkout opens: this is what lets the owner
      // reconcile a payment whose browser callback never arrived.
      await recordPaymentEntry({
        userId: context.userId,
        kind,
        itemId: price.item.id,
        itemTitle: price.item.title,
        amountInr: price.finalInr,
        status: "pending",
        orderId: order.id,
        couponCode: data.coupon_code ?? "",
      });
      return {
        already_unlocked: false,
        order_id: order.id,
        amount_inr: price.finalInr,
        amount_paise: order.amount,
        key_id: credentials.keyId,
        mode: credentials.mode,
        item_title: price.item.title,
        verified_checkout: true,
        message: "",
      };
    } catch (error) {
      // A Razorpay outage must not stop the student from paying: fall back to
      // the amount-only checkout, which is verified from the payment id later.
      console.error("Razorpay order creation failed, using legacy checkout", error);
      return {
        already_unlocked: false,
        order_id: "",
        amount_inr: price.finalInr,
        amount_paise: Math.round(price.finalInr * 100),
        key_id: credentials.keyId,
        mode: credentials.mode,
        item_title: price.item.title,
        verified_checkout: false,
        message:
          error instanceof RazorpayError
            ? `Server order could not be created (${error.message}). You can still pay the exact amount shown.`
            : "",
      };
    }
  });

/** Same idea for a 23KAAT coin pack. */
export const createCoinPackRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => coinPackOrderSchema.parse(input))
  .handler(async ({ context, data }) => {
    const credentials = await readRazorpayCredentials();
    if (!credentials.enabled || !credentials.keyId) {
      throw new Error(
        "Online payment (Razorpay) is currently off. Please contact Admin for offline payment.",
      );
    }
    const pack = await loadCoinPack(data.package_id);
    if (pack.priceInr <= 0) {
      throw new Error("This coin pack has no online price. Please contact Admin.");
    }
    if (!credentials.verifiable) {
      return {
        order_id: "",
        amount_inr: pack.priceInr,
        amount_paise: Math.round(pack.priceInr * 100),
        key_id: credentials.keyId,
        mode: credentials.mode,
        item_title: pack.title,
        verified_checkout: false,
        message: "",
      };
    }
    try {
      const order = await createRazorpayOrder({
        credentials,
        amountInr: pack.priceInr,
        receipt: shortReceipt("coins", pack.id),
        notes: {
          user_id: context.userId,
          kind: "coin_pack",
          item_id: pack.id,
        },
      });
      await recordPaymentEntry({
        userId: context.userId,
        kind: "coin_pack",
        itemId: pack.id,
        itemTitle: pack.title,
        amountInr: pack.priceInr,
        status: "pending",
        orderId: order.id,
      });
      return {
        order_id: order.id,
        amount_inr: pack.priceInr,
        amount_paise: order.amount,
        key_id: credentials.keyId,
        mode: credentials.mode,
        item_title: pack.title,
        verified_checkout: true,
        message: "",
      };
    } catch (error) {
      console.error("Razorpay coin pack order creation failed", error);
      return {
        order_id: "",
        amount_inr: pack.priceInr,
        amount_paise: Math.round(pack.priceInr * 100),
        key_id: credentials.keyId,
        mode: credentials.mode,
        item_title: pack.title,
        verified_checkout: false,
        message: "",
      };
    }
  });

/**
 * Student self service payment recovery.
 * Order notes written by `createLearningRazorpayOrder` make this exact: the
 * payment tells us which student bought which item.
 */
export const recoverRazorpayPurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => recoverSchema.parse(input))
  .handler(async ({ context, data }) => {
    const credentials = await readRazorpayCredentials();
    if (!credentials.verifiable) {
      throw new Error(
        "Razorpay Key Secret is not saved yet, so payments cannot be verified automatically. Please contact Admin with your Payment ID.",
      );
    }

    try {
      const verification = await verifyRazorpayPayment({
        credentials,
        paymentId: data.payment_id,
        userId: context.userId,
      });
      const notes = verification.notes;
      if (!notes.kind || !notes.item_id) {
        throw new RazorpayError(
          "This payment does not carry KKCC order details, so it cannot be matched automatically. Please contact Admin with your Payment ID.",
          400,
        );
      }
      if (!notes.user_id) {
        throw new RazorpayError(
          "This payment is not linked to a student account. Please contact Admin with your Payment ID.",
          400,
        );
      }
      if (notes.user_id !== context.userId) {
        throw new RazorpayError(
          "This payment was made from a different student account. Please sign in with the account used for payment.",
          403,
        );
      }

      if (notes.kind === "coin_pack") {
        const granted = await grantCoinPackPurchase({
          userId: context.userId,
          packageId: notes.item_id,
          reference: `recovered ${verification.paymentId}`,
        });
        await markPaymentPaid({
          userId: context.userId,
          kind: "coin_pack",
          itemId: notes.item_id,
          itemTitle: granted.title,
          amountInr: verification.amountInr,
          orderId: verification.orderId,
          paymentId: verification.paymentId,
          note: "Recovered by the student from the Payment Recovery card",
        });
        return {
          ok: true,
          kind: "coin_pack" as const,
          item_id: notes.item_id,
          title: granted.title,
          credited: granted.credited,
          amount_inr: verification.amountInr,
          message: `${granted.credited} 23KAAT coins credited to your wallet.`,
        };
      }

      const already = await hasLearningAccess(context.userId, notes.kind, notes.item_id);
      const granted = await grantLearningPurchase({
        userId: context.userId,
        kind: notes.kind,
        itemId: notes.item_id,
        amountInr: verification.amountInr,
        couponCode: notes.coupon_code,
        reference: `Razorpay recovery ${verification.paymentId}`,
        method: "razorpay",
      });
      await markPaymentPaid({
        userId: context.userId,
        kind: notes.kind,
        itemId: notes.item_id,
        itemTitle: granted.title,
        amountInr: verification.amountInr,
        orderId: verification.orderId,
        paymentId: verification.paymentId,
        ...(notes.coupon_code ? { couponCode: notes.coupon_code } : {}),
        note: "Recovered by the student from the Payment Recovery card",
      });
      return {
        ok: true,
        kind: granted.kind,
        item_id: granted.itemId,
        title: granted.title,
        credited: 0,
        amount_inr: granted.amountInr,
        already_unlocked: already,
        message: `${granted.title} is now active on your account.`,
      };
    } catch (error) {
      friendlyRazorpayError(error);
    }
  });

/** Admin support tool: unlock a student from a Razorpay Payment ID. */
export const adminRecoverRazorpayPurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => adminRecoverSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const credentials = await readRazorpayCredentials();
    if (!credentials.verifiable) {
      throw new Error(
        "Save the Razorpay Key Secret in Admin → Payments before verifying payments.",
      );
    }

    try {
      const verification = await verifyRazorpayPayment({
        credentials,
        paymentId: data.payment_id,
      });
      const notes = verification.notes;

      let targetUserId = data.user_id?.trim() || notes.user_id || "";
      const kind = data.kind ?? notes.kind;
      const itemId = data.item_id?.trim() || notes.item_id || "";

      if (!targetUserId && data.email?.trim()) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: profile, error } = await supabaseAdmin
          .from("profiles")
          .select("id, email")
          .ilike("email", data.email.trim().toLowerCase())
          .maybeSingle();
        if (error || !profile) {
          throw new Error(
            "No student found with that email. Ask the student to sign up once first.",
          );
        }
        targetUserId = (profile as { id: string }).id;
      }

      if (!targetUserId) {
        throw new Error(
          "Could not tell which student this payment belongs to. Enter the student email or user ID.",
        );
      }
      if (!kind || !itemId) {
        throw new Error(
          "This payment has no KKCC order notes. Choose the item to unlock manually.",
        );
      }

      if (kind === "coin_pack") {
        const granted = await grantCoinPackPurchase({
          userId: targetUserId,
          packageId: itemId,
          reference: `admin recovered ${verification.paymentId}`,
        });
        return {
          ok: true,
          student_user_id: targetUserId,
          kind: "coin_pack" as const,
          item_id: itemId,
          title: granted.title,
          amount_inr: verification.amountInr,
          message: `${granted.credited} 23KAAT coins credited to the student wallet.`,
        };
      }

      const already = await hasLearningAccess(targetUserId, kind, itemId);
      const granted = await grantLearningPurchase({
        userId: targetUserId,
        kind,
        itemId,
        amountInr: verification.amountInr,
        couponCode: notes.coupon_code,
        reference: `Razorpay admin recovery ${verification.paymentId}`,
        method: "razorpay",
      });
      await markPaymentPaid({
        userId: targetUserId,
        kind,
        itemId,
        itemTitle: granted.title,
        amountInr: verification.amountInr,
        orderId: verification.orderId,
        paymentId: verification.paymentId,
        ...(notes.coupon_code ? { couponCode: notes.coupon_code } : {}),
        note: `Unlocked by Admin from payment recovery (${data.payment_id})`,
      });
      return {
        ok: true,
        student_user_id: targetUserId,
        kind: granted.kind,
        item_id: granted.itemId,
        title: granted.title,
        amount_inr: granted.amountInr,
        already_unlocked: already,
        message: already
          ? `Access was already active — nothing changed. (${granted.title})`
          : `${granted.title} unlocked for the student.`,
      };
    } catch (error) {
      friendlyRazorpayError(error);
    }
  });

/** Read only lookup so admin support can see what Razorpay knows about a payment. */
export const adminLookupRazorpayPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => recoverSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const credentials = await readRazorpayCredentials();
    if (!credentials.verifiable) {
      throw new Error("Save the Razorpay Key Secret in Admin → Payments to look up payments.");
    }
    try {
      const verification = await verifyRazorpayPayment({
        credentials,
        paymentId: data.payment_id,
      });
      return {
        ok: true,
        payment_id: verification.paymentId,
        order_id: verification.orderId,
        amount_inr: verification.amountInr,
        status: verification.status,
        status_label: paymentStatusLabel(verification.status),
        method: verification.method,
        student_user_id: verification.notes.user_id ?? "",
        kind: verification.notes.kind ?? "",
        item_id: verification.notes.item_id ?? "",
        coupon_code: verification.notes.coupon_code ?? "",
      };
    } catch (error) {
      friendlyRazorpayError(error);
    }
  });

/** Used by the coupon preview so a quote never burns a coupon use. */
export const quoteCouponForCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ code: z.string().trim().min(2).max(40) }).parse(input))
  .handler(async ({ context, data }) => {
    await resolveServerCouponDiscount({
      code: data.code,
      targetCourseId: null,
      originalAmountInr: 0,
      originalCoins: 0,
      userId: context.userId,
      recordRedemption: false,
    });
    return { ok: true };
  });
