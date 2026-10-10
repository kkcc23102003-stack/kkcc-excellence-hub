import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  isPaidPaymentStatus,
  notesFromContext,
  notesToContext,
  paiseToRupees,
  paymentStatusLabel,
  rupeesToPaise,
  verifyRazorpaySignature,
} from "../../src/lib/razorpay.server";
import { listPendingPayments } from "../../src/lib/pending-payments";

test("Rupee/paise conversion never loses a rupee and rejects junk input", () => {
  assert.equal(rupeesToPaise(499), 49_900);
  assert.equal(rupeesToPaise(499.5), 49_950);
  assert.equal(rupeesToPaise(0), 0);
  assert.equal(rupeesToPaise(-50), 0);
  assert.equal(rupeesToPaise(Number.NaN), 0);
  assert.equal(paiseToRupees(49_900), 499);
  assert.equal(paiseToRupees(0), 0);
});

test("Only captured/authorized Razorpay payments count as paid", () => {
  assert.equal(isPaidPaymentStatus("captured"), true);
  assert.equal(isPaidPaymentStatus("authorized"), true);
  assert.equal(isPaidPaymentStatus("created"), false);
  assert.equal(isPaidPaymentStatus("failed"), false);
  assert.equal(isPaidPaymentStatus("refunded"), false);
  assert.equal(isPaidPaymentStatus(null), false);
  assert.match(paymentStatusLabel("created"), /not completed/i);
});

test("Order notes round trip so a payment can always be traced to student and item", () => {
  const notes = notesFromContext({
    user_id: "user-123",
    kind: "series",
    item_id: "ppsc-pcs",
    coupon_code: "KKCC50",
  });
  assert.deepEqual(notes, {
    kkcc_user: "user-123",
    kkcc_kind: "series",
    kkcc_item: "ppsc-pcs",
    kkcc_coupon: "KKCC50",
  });

  const parsed = notesToContext(notes);
  assert.equal(parsed.user_id, "user-123");
  assert.equal(parsed.kind, "series");
  assert.equal(parsed.item_id, "ppsc-pcs");
  assert.equal(parsed.coupon_code, "KKCC50");

  // Razorpay returns an absent notes object on older payments.
  assert.deepEqual(notesToContext(undefined), {});
  assert.deepEqual(notesToContext({}), {});
  // An unknown kind must never be trusted as an item type.
  assert.equal(notesToContext({ kkcc_kind: "something-else" }).kind, undefined);
});

test("Payment signature verification is exact and constant across order/payment pairs", () => {
  const secret = "rzp_test_secret_value";
  const orderId = "order_ABC123";
  const paymentId = "pay_XYZ789";
  const signature = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");

  assert.equal(verifyRazorpaySignature({ orderId, paymentId, signature, keySecret: secret }), true);
  // Same payment id, different order -> must fail (blocks replay across items).
  assert.equal(
    verifyRazorpaySignature({ orderId: "order_OTHER", paymentId, signature, keySecret: secret }),
    false,
  );
  // Wrong secret -> must fail.
  assert.equal(
    verifyRazorpaySignature({ orderId, paymentId, signature, keySecret: "other_secret" }),
    false,
  );
  // Missing pieces -> must fail closed, never throw.
  assert.equal(
    verifyRazorpaySignature({ orderId, paymentId, signature: "", keySecret: secret }),
    false,
  );
  assert.equal(
    verifyRazorpaySignature({ orderId: "", paymentId, signature, keySecret: secret }),
    false,
  );
  assert.equal(verifyRazorpaySignature({ orderId, paymentId, signature, keySecret: "" }), false);
  assert.equal(
    verifyRazorpaySignature({ orderId, paymentId, signature: "abc", keySecret: secret }),
    false,
  );
});

test("Checkout only trusts the server: amount, signature and notes are all enforced", () => {
  const checkout = readFileSync("src/routes/checkout.tsx", "utf8");
  // The order (and therefore the amount) comes from the server function.
  assert.match(checkout, /createLearningRazorpayOrder/);
  assert.match(checkout, /order\.amount_paise/);
  // A payment id is remembered before the unlock call, so a failed call can be recovered.
  const rememberAt = checkout.indexOf("rememberPendingPayment({");
  const finishAt = checkout.indexOf("finishRazorpayPurchase({");
  assert.ok(rememberAt > -1 && finishAt > -1 && rememberAt < finishAt);
  assert.match(checkout, /RazorpayPaymentRecovery/);

  const coins = readFileSync("src/routes/coins.tsx", "utf8");
  assert.match(coins, /createCoinPackRazorpayOrder/);
  assert.match(coins, /forgetPendingPayment/);

  const completion = readFileSync("src/lib/coins.functions.ts", "utf8");
  assert.match(completion, /verifyRazorpayPayment/);
  assert.match(completion, /hasLearningAccess/);
  // A retried callback must not credit the same coin pack twice.
  assert.match(completion, /alreadyCredited/);
});

test("Pending payment memory is bounded and never throws without storage", () => {
  // Node has no window/localStorage: the helper must degrade to an empty list.
  assert.deepEqual(listPendingPayments(), []);
});

test("Razorpay secret is never shipped to the client bundle", () => {
  const platform = readFileSync("src/lib/platform-settings.functions.ts", "utf8");
  // The public settings function must only expose the key id, not the secret.
  const publicStart = platform.indexOf("export const getPublicPaymentSettings");
  const adminStart = platform.indexOf("export const getAdminPaymentSettings");
  assert.ok(publicStart > -1 && adminStart > publicStart);
  const publicBody = platform.slice(publicStart, adminStart);
  assert.ok(!publicBody.includes("razorpay_key_secret"));
  assert.match(publicBody, /razorpay_key_id/);
});

test("GST-free single price: the recorded amount is the amount Razorpay captured", () => {
  const completion = readFileSync("src/lib/coins.functions.ts", "utf8");
  // The grant must use the verified captured amount, not the browser value.
  assert.match(completion, /verification\.verified && verification\.amountInr > 0/);
  assert.match(completion, /grantLearningPurchase\(/);
  // Coupon bookkeeping must never block access after a confirmed payment.
  assert.match(completion, /Coupon redemption could not be recorded after payment/);
});
