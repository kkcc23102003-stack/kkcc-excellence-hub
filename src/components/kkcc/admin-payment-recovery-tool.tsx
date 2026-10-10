/**
 * Admin support tool: unlock a student straight from a Razorpay Payment ID.
 *
 * Use it when a student says "paise kat gaye, access nahi mila". The payment is
 * fetched from Razorpay, the student + item are read from the order notes (or
 * typed in when the payment was made before notes existed), and the access is
 * granted idempotently — running it twice never double-enrolls anyone.
 */
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Loader2, Search, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { friendlyError } from "@/lib/storage";
import { formatINR } from "@/lib/cms";
import { adminLookupRazorpayPayment, adminRecoverRazorpayPurchase } from "@/lib/razorpay.functions";

type Lookup = {
  payment_id: string;
  order_id: string;
  amount_inr: number;
  status: string;
  status_label: string;
  method: string;
  student_user_id: string;
  kind: string;
  item_id: string;
  coupon_code: string;
};

export function AdminPaymentRecoveryTool() {
  const lookupFn = useServerFn(adminLookupRazorpayPayment);
  const recoverFn = useServerFn(adminRecoverRazorpayPurchase);
  const [paymentId, setPaymentId] = useState("");
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState<"" | "course" | "series" | "test" | "coin_pack">("");
  const [itemId, setItemId] = useState("");
  const [lookup, setLookup] = useState<Lookup | null>(null);

  const lookupMutation = useMutation({
    mutationFn: () => lookupFn({ data: { payment_id: paymentId.trim() } }) as Promise<Lookup>,
    onSuccess: (data) => {
      setLookup(data);
      toast.success(`Razorpay says: ${data.status_label}`);
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const recoverMutation = useMutation({
    mutationFn: () =>
      recoverFn({
        data: {
          payment_id: paymentId.trim(),
          email: email.trim(),
          user_id: "",
          ...(kind ? { kind } : {}),
          item_id: itemId.trim(),
        },
      }) as Promise<{ message: string; title: string }>,
    onSuccess: (data) => {
      toast.success("Student unlocked", { description: data.message });
      setLookup(null);
      setItemId("");
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  return (
    <section className="surface-panel mt-6 p-5" id="admin-payment-recovery">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Wand2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-black">Payment Recovery &amp; Access Grant</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Student ka Razorpay <strong>Payment ID</strong> (pay_…) daaliye. App Razorpay se payment
            verify karega aur usi student ka Batch / Test Series / Test / 23KAAT coin pack unlock
            kar dega — bina manually dhoondhe.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <Label className="text-xs font-bold">Razorpay Payment ID</Label>
          <Input
            value={paymentId}
            onChange={(event) => setPaymentId(event.target.value)}
            placeholder="pay_XXXXXXXXXXXXXX"
            className="mt-1 font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            disabled={lookupMutation.isPending || paymentId.trim().length < 6}
            onClick={() => lookupMutation.mutate()}
          >
            {lookupMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Look up
          </Button>
          <Button
            className="rounded-full"
            disabled={recoverMutation.isPending || paymentId.trim().length < 6}
            onClick={() => recoverMutation.mutate()}
          >
            {recoverMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BadgeCheck className="mr-2 h-4 w-4" />
            )}
            Verify &amp; grant
          </Button>
        </div>
      </div>

      {lookup ? (
        <div className="mt-4 rounded-xl border bg-muted/40 p-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
            <strong>{lookup.status_label}</strong>
            <span className="text-muted-foreground">
              {formatINR(lookup.amount_inr)} · {lookup.method || "—"} · {lookup.payment_id}
            </span>
          </div>
          <div className="mt-2 grid gap-1 text-muted-foreground sm:grid-cols-2">
            <span>Student: {lookup.student_user_id || "not in order notes"}</span>
            <span>
              Item: {lookup.kind || "—"} {lookup.item_id ? `· ${lookup.item_id}` : ""}
            </span>
            <span>Order: {lookup.order_id || "—"}</span>
            <span>Coupon: {lookup.coupon_code || "—"}</span>
          </div>
        </div>
      ) : null}

      {lookup && (!lookup.student_user_id || !lookup.item_id) ? (
        <div className="mt-4 grid gap-3 rounded-xl border border-dashed p-4 sm:grid-cols-3">
          <p className="text-xs text-muted-foreground sm:col-span-3">
            Is payment me KKCC order notes nahi mile (purana payment). Neeche details bhar kar
            manually grant karein:
          </p>
          <div>
            <Label className="text-xs font-bold">Student email</Label>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@email.com"
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-bold">Item type</Label>
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value as typeof kind)}
              className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Auto from notes</option>
              <option value="course">Batch / Course</option>
              <option value="series">Test Series</option>
              <option value="test">Test</option>
              <option value="coin_pack">23KAAT Coin pack</option>
            </select>
          </div>
          <div>
            <Label className="text-xs font-bold">Item ID / slug</Label>
            <Input
              value={itemId}
              onChange={(event) => setItemId(event.target.value)}
              placeholder="course id, series id, test id or pack id"
              className="mt-1 font-mono text-sm"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
