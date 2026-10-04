/**
 * Razorpay REST helpers — server only.
 *
 * Every rupee the app charges is validated here, never in the browser:
 *   1. The price is recomputed on the server from the item + coupon.
 *   2. An *order* is created through the Razorpay Orders API with the student,
 *      item and coupon recorded in `notes`, so a payment can always be traced
 *      back to the student who made it — even months later, even for a payment
 *      whose browser callback never reached us.
 *   3. A completed payment is fetched back from Razorpay and checked
 *      (status + amount + the notes we wrote) before any access is granted.
 *
 * If the admin has only saved the Key ID (no Key Secret), the Orders API is not
 * reachable. The app then falls back to the legacy "amount only" checkout so
 * payments never hard-fail; adding the Key Secret upgrades the account to full
 * server-side verification automatically.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { projectContent } from "@/lib/project-content.server";

const RAZORPAY_API = "https://api.razorpay.com/v1";
const REQUEST_TIMEOUT_MS = 15_000;

export type RazorpayMode = "test" | "live";

export type RazorpayCredentials = {
  keyId: string;
  keySecret: string;
  /** True when the admin has switched online payments on AND a key id exists. */
  enabled: boolean;
  /** True when the secret is stored, which unlocks server side verification. */
  verifiable: boolean;
  mode: RazorpayMode;
};

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  receipt?: string | null;
  notes?: Record<string, string>;
  created_at?: number;
};

export type RazorpayPayment = {
  id: string;
  order_id?: string | null;
  amount: number;
  currency: string;
  status: string;
  method?: string | null;
  email?: string | null;
  contact?: string | null;
  notes?: Record<string, string>;
  created_at?: number;
  error_description?: string | null;
};

export class RazorpayError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "RazorpayError";
    this.status = status;
  }
}

export function rupeesToPaise(inr: number): number {
  return Math.max(0, Math.round((Number(inr) || 0) * 100));
}

export function paiseToRupees(paise: number): number {
  return Math.max(0, Math.round(Number(paise) || 0)) / 100;
}

/** Read the stored Razorpay key pair. Never send the secret to the client. */
export async function readRazorpayCredentials(): Promise<RazorpayCredentials> {
  const [publicResult, secretResult] = await Promise.all([
    projectContent
      .from("site_settings")
      .select("key, value")
      .in("key", ["payment_enabled", "razorpay_key_id", "payment_mode"]),
    projectContent
      .from("private_settings")
      .select("value")
      .eq("key", "razorpay_key_secret")
      .maybeSingle(),
  ]);

  const settings = new Map(
    ((publicResult.data ?? []) as { key: string; value: string }[]).map((row) => [
      row.key,
      row.value ?? "",
    ]),
  );
  const keyId = (settings.get("razorpay_key_id") ?? "").trim();
  const keySecret = ((secretResult.data as { value?: string } | null)?.value ?? "").trim();
  const enabled = Boolean(keyId) && settings.get("payment_enabled") !== "disabled_manual";
  const mode: RazorpayMode =
    settings.get("payment_mode") === "live" || keyId.startsWith("rzp_live_") ? "live" : "test";

  return { keyId, keySecret, enabled, verifiable: Boolean(keyId && keySecret), mode };
}

async function razorpayRequest<T>(
  path: string,
  credentials: RazorpayCredentials,
  init: { method: "GET" | "POST"; body?: unknown } = { method: "GET" },
): Promise<T> {
  if (!credentials.keyId || !credentials.keySecret) {
    throw new RazorpayError(
      "Razorpay Key Secret is missing in Admin → Payments. Add it to switch on server side verification.",
      400,
    );
  }

  const auth = Buffer.from(`${credentials.keyId}:${credentials.keySecret}`).toString("base64");
  let response: Response;
  try {
    response = await fetch(`${RAZORPAY_API}${path}`, {
      method: init.method,
      headers: {
        authorization: `Basic ${auth}`,
        "content-type": "application/json",
      },
      ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new RazorpayError(
      error instanceof Error && error.name === "TimeoutError"
        ? "Razorpay did not respond in time. Please try again."
        : "Could not reach Razorpay. Please check the server connection and try again.",
    );
  }

  const text = await response.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    const description =
      (parsed as { error?: { description?: string } } | null)?.error?.description ??
      (parsed as { message?: string } | null)?.message ??
      `Razorpay request failed (${response.status}).`;
    throw new RazorpayError(description, response.status === 401 ? 401 : 502);
  }

  return parsed as T;
}

export type RazorpayOrderNotes = {
  user_id: string;
  /** `material` = paid study notes; the notes travel with the order so a lost
   *  callback can still be recovered. */
  kind: "course" | "series" | "test" | "material" | "coin_pack";
  item_id: string;
  coupon_code?: string;
};

/** Notes Razorpay stores with the order — the trace used by recovery. */
export function notesFromContext(notes: RazorpayOrderNotes): Record<string, string> {
  return {
    kkcc_user: notes.user_id,
    kkcc_kind: notes.kind,
    kkcc_item: notes.item_id,
    kkcc_coupon: notes.coupon_code ?? "",
  };
}

export type RazorpayNotesParsed = {
  user_id?: string;
  kind?: RazorpayOrderNotes["kind"];
  item_id?: string;
  coupon_code?: string;
};

export function notesToContext(
  notes: Record<string, string> | undefined | null,
): RazorpayNotesParsed {
  const raw = notes ?? {};
  const kind = raw["kkcc_kind"];
  const parsed: RazorpayNotesParsed = {};
  const userId = (raw["kkcc_user"] ?? "").trim();
  const itemId = (raw["kkcc_item"] ?? "").trim();
  const coupon = (raw["kkcc_coupon"] ?? "").trim();
  if (userId) parsed.user_id = userId;
  if (kind === "course" || kind === "series" || kind === "test" || kind === "coin_pack") {
    parsed.kind = kind;
  }
  if (itemId) parsed.item_id = itemId;
  if (coupon) parsed.coupon_code = coupon;
  return parsed;
}

export async function createRazorpayOrder(input: {
  credentials: RazorpayCredentials;
  amountInr: number;
  receipt: string;
  notes: RazorpayOrderNotes;
}): Promise<RazorpayOrder> {
  const amount = rupeesToPaise(input.amountInr);
  if (amount < 100) {
    // Razorpay refuses orders below ₹1. A 100% coupon is claimed without an
    // order, so reaching this branch means the item is genuinely mispriced.
    throw new RazorpayError("Payable amount is below the ₹1 Razorpay minimum.", 400);
  }
  return razorpayRequest<RazorpayOrder>("/orders", input.credentials, {
    method: "POST",
    body: {
      amount,
      currency: "INR",
      receipt: input.receipt.slice(0, 40),
      notes: notesFromContext(input.notes),
      payment_capture: 1,
    },
  });
}

export async function fetchRazorpayOrder(
  orderId: string,
  credentials: RazorpayCredentials,
): Promise<RazorpayOrder> {
  return razorpayRequest<RazorpayOrder>(`/orders/${encodeURIComponent(orderId)}`, credentials);
}

export async function fetchRazorpayPayment(
  paymentId: string,
  credentials: RazorpayCredentials,
): Promise<RazorpayPayment> {
  return razorpayRequest<RazorpayPayment>(
    `/payments/${encodeURIComponent(paymentId)}`,
    credentials,
  );
}

/** HMAC SHA256 of `order_id|payment_id`, compared in constant time. */
export function verifyRazorpaySignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
  keySecret: string;
}): boolean {
  if (!input.orderId || !input.paymentId || !input.signature || !input.keySecret) return false;
  const expected = createHmac("sha256", input.keySecret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(input.signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Razorpay payment states that mean the money is actually with the centre. */
export function isPaidPaymentStatus(status: string | null | undefined): boolean {
  return status === "captured" || status === "authorized";
}

export type VerifiedPayment = {
  /** True when the payment was confirmed against the Razorpay API. */
  verified: boolean;
  paymentId: string;
  orderId: string;
  amountInr: number;
  status: string;
  method: string;
  notes: RazorpayNotesParsed;
  /** Set when the payment could not be verified (secret not configured yet). */
  warning: string;
};

/**
 * The single gate every online payment passes through.
 *
 * With a Key Secret stored, a payment is only accepted when:
 *   - the checkout signature over `order_id|payment_id` is valid,
 *   - Razorpay reports the payment as captured/authorized,
 *   - the amount is at least what the item costs on the server,
 *   - and the order notes (when present) name the same student.
 *
 * Without a secret we cannot call Razorpay, so the caller keeps the legacy
 * behaviour and the result carries a warning instead of a false guarantee.
 */
export async function verifyRazorpayPayment(input: {
  credentials: RazorpayCredentials;
  paymentId: string;
  orderId?: string | undefined;
  signature?: string | undefined;
  userId?: string | undefined;
  /** Server side price in rupees, used when there is no server created order. */
  expectedAmountInr?: number | undefined;
}): Promise<VerifiedPayment> {
  const orderId = (input.orderId ?? "").trim();
  const signature = (input.signature ?? "").trim();
  const paymentId = input.paymentId.trim();

  if (!input.credentials.verifiable) {
    return {
      verified: false,
      paymentId,
      orderId,
      amountInr: 0,
      status: "unverified",
      method: "",
      notes: {},
      warning:
        "Razorpay Key Secret is not saved in Admin → Payments, so this payment could not be confirmed with Razorpay.",
    };
  }

  const payment = await fetchRazorpayPayment(paymentId, input.credentials);
  const order = orderId
    ? await fetchRazorpayOrder(orderId, input.credentials).catch(() => null)
    : payment.order_id
      ? await fetchRazorpayOrder(payment.order_id, input.credentials).catch(() => null)
      : null;
  const effectiveOrderId = orderId || payment.order_id || "";

  if (effectiveOrderId) {
    if (!signature) {
      throw new RazorpayError(
        "Payment signature is missing. Please retry the payment or use Payment Recovery with your Payment ID.",
        400,
      );
    }
    const ok = verifyRazorpaySignature({
      orderId: effectiveOrderId,
      paymentId,
      signature,
      keySecret: input.credentials.keySecret,
    });
    if (!ok) {
      throw new RazorpayError(
        "Razorpay payment signature verification failed. Access was not granted — please contact Admin with your Payment ID.",
        400,
      );
    }
  }

  if (!isPaidPaymentStatus(payment.status)) {
    throw new RazorpayError(
      `Payment is not complete yet (status: ${paymentStatusLabel(payment.status)}). If money was deducted it is auto-refunded by Razorpay, or contact Admin with Payment ID ${paymentId}.`,
      400,
    );
  }

  const paidPaise = Math.max(0, payment.amount ?? 0);
  const expectedPaise = order
    ? Math.max(0, order.amount ?? 0)
    : rupeesToPaise(input.expectedAmountInr ?? 0);
  if (expectedPaise > 0 && paidPaise + 1 < expectedPaise) {
    throw new RazorpayError(
      `Payment amount (₹${paiseToRupees(paidPaise)}) is lower than the price (₹${paiseToRupees(expectedPaise)}). Please pay the balance or contact Admin.`,
      400,
    );
  }

  const notes = notesToContext(order?.notes ?? payment.notes);
  if (notes.user_id && input.userId && notes.user_id !== input.userId) {
    throw new RazorpayError(
      "This payment was made from a different student account. Please contact Admin with your Payment ID.",
      403,
    );
  }

  return {
    verified: true,
    paymentId,
    orderId: effectiveOrderId,
    amountInr: paiseToRupees(paidPaise),
    status: payment.status,
    method: (payment.method ?? "").toString(),
    notes,
    warning: "",
  };
}

export function paymentStatusLabel(status: string | null | undefined): string {
  switch (status) {
    case "captured":
      return "Captured (paid)";
    case "authorized":
      return "Authorized (paid)";
    case "created":
      return "Created — payment not completed";
    case "failed":
      return "Failed";
    case "refunded":
      return "Refunded";
    default:
      return status ? status : "Unknown";
  }
}
