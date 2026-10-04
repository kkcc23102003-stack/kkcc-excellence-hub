/**
 * Remembers payments started in this browser.
 *
 * If a Razorpay checkout window is closed, the network drops, or the callback
 * never reaches us, the student still has the Payment ID in their UPI/SMS
 * record. We keep the same id here so the app can offer a one-tap recovery
 * instead of asking them to dig it out.
 *
 * Client only — nothing sensitive is stored, just ids the student already owns.
 */
export type PendingPayment = {
  payment_id: string;
  kind: "course" | "series" | "test" | "coin_pack";
  item_id: string;
  title: string;
  amount_inr: number;
  at: number;
};

const KEY = "kkcc-pending-payments-v1";
const MAX_ENTRIES = 8;

function read(): PendingPayment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is PendingPayment =>
        Boolean(entry) &&
        typeof (entry as PendingPayment).payment_id === "string" &&
        typeof (entry as PendingPayment).item_id === "string",
    );
  } catch {
    return [];
  }
}

function write(entries: PendingPayment[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
    window.dispatchEvent(new Event("kkcc:pending-payments"));
  } catch {
    /* storage full or blocked — recovery just falls back to manual entry */
  }
}

export function listPendingPayments(): PendingPayment[] {
  return read().sort((a, b) => b.at - a.at);
}

export function rememberPendingPayment(entry: Omit<PendingPayment, "at">) {
  const existing = read().filter((item) => item.payment_id !== entry.payment_id);
  write([{ ...entry, at: Date.now() }, ...existing]);
}

export function forgetPendingPayment(paymentId: string) {
  write(read().filter((item) => item.payment_id !== paymentId));
}

export function clearPendingPayments() {
  write([]);
}
