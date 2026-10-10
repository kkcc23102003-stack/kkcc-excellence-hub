/**
 * Payment ledger.
 *
 * Every online payment gets one row in `payment_transactions` — created when
 * the Razorpay order opens, marked paid when the money is confirmed, and marked
 * paid from the recovery paths too. A row is written even when Razorpay has not
 * confirmed yet, so the owner can always see what a student *started* to buy and
 * reconcile a payment that Razorpay reports but our callback never saw.
 *
 * The write is strictly best effort: a ledger failure must never block a
 * student's access, and a repeated callback must never duplicate a payment.
 *
 * Server only — the table already exists in the production SQL.
 */
import { projectContent } from "@/lib/project-content.server";

export type LedgerKind = "course" | "series" | "test" | "material" | "coin_pack";

export type LedgerEntry = {
  userId: string;
  kind: LedgerKind;
  itemId: string;
  itemTitle?: string;
  amountInr: number;
  /** "pending" when the checkout opened, "paid" once money is confirmed. */
  status: "pending" | "paid" | "failed";
  /** "razorpay" or "offline"; mirrors the access grant method. */
  provider?: string;
  orderId?: string;
  paymentId?: string;
  couponCode?: string;
  note?: string;
};

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function metadataOf(entry: LedgerEntry) {
  return {
    kind: entry.kind,
    item_id: entry.itemId,
    item_title: entry.itemTitle ?? "",
    coupon_code: entry.couponCode ?? "",
  };
}

/** Insert a ledger row. Returns the row id, or null when the write failed. */
export async function recordPaymentEntry(entry: LedgerEntry): Promise<string | null> {
  try {
    const supabaseAdmin = await adminClient();
    const { data, error } = await supabaseAdmin
      .from("payment_transactions")
      .insert({
        user_id: entry.userId,
        // `course_id` is uuid typed, so only a real batch id goes here; every
        // other kind (test series, test, notes, coins) carries its item in
        // metadata instead.
        course_id: entry.kind === "course" ? entry.itemId : null,
        provider: entry.provider ?? "razorpay",
        status: entry.status,
        amount: Math.max(0, Math.round(entry.amountInr)),
        currency: "INR",
        provider_order_id: entry.orderId ?? "",
        provider_payment_id: entry.paymentId ?? "",
        admin_note: entry.note ?? "",
        metadata: metadataOf(entry),
        created_by: entry.userId,
      } as never)
      .select("id")
      .single();
    if (error) {
      console.warn("[ledger] could not record payment entry", error.message);
      return null;
    }
    return (data as { id: string } | null)?.id ?? null;
  } catch (error) {
    console.warn("[ledger] could not record payment entry", error);
    return null;
  }
}

/**
 * Mark a previously opened order as paid. When no row matches (older payments,
 * or the pending insert failed) a paid row is inserted instead, so the ledger is
 * never missing a confirmed payment.
 */
export async function markPaymentPaid(input: {
  userId: string;
  kind: LedgerKind;
  itemId: string;
  itemTitle?: string;
  amountInr: number;
  orderId?: string;
  paymentId: string;
  couponCode?: string;
  note?: string;
}): Promise<void> {
  try {
    const supabaseAdmin = await adminClient();

    // Never duplicate a confirmed payment.
    const { data: existing } = await supabaseAdmin
      .from("payment_transactions")
      .select("id, status")
      .eq("provider_payment_id", input.paymentId)
      .limit(1)
      .maybeSingle();
    if (existing) {
      const row = existing as { id: string; status: string };
      if (row.status !== "paid") {
        await supabaseAdmin
          .from("payment_transactions")
          .update({
            status: "paid",
            admin_note: input.note ?? "",
            provider_order_id: input.orderId ?? "",
            updated_at: new Date().toISOString(),
          } as never)
          .eq("id", row.id);
      }
      return;
    }

    const { data: pendingRow } = input.orderId
      ? await supabaseAdmin
          .from("payment_transactions")
          .select("id")
          .eq("provider_order_id", input.orderId)
          .eq("status", "pending")
          .limit(1)
          .maybeSingle()
      : { data: null };

    if (pendingRow) {
      await supabaseAdmin
        .from("payment_transactions")
        .update({
          status: "paid",
          provider_payment_id: input.paymentId,
          amount: Math.max(0, Math.round(input.amountInr)),
          admin_note: input.note ?? "",
          updated_at: new Date().toISOString(),
        } as never)
        .eq("id", (pendingRow as { id: string }).id);
      return;
    }

    await recordPaymentEntry({ ...input, status: "paid" });
  } catch (error) {
    console.warn("[ledger] could not mark payment paid", error);
  }
}
