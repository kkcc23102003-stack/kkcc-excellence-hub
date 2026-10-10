/**
 * "Paisa kat gaya lekin access nahi mila?" — the recovery card.
 *
 * Verifies a Razorpay Payment ID against Razorpay itself and unlocks whatever
 * that payment bought (Batch, Test Series, Test or a 23KAAT coin pack). Any
 * payment started in this browser is remembered, so the student usually only
 * has to tap once.
 */
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, CheckCircle2, LifeBuoy, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { invalidateLearningQueries } from "@/hooks/use-learning-access";
import { safeServerCall } from "@/lib/safe-server-call";
import {
  forgetPendingPayment,
  listPendingPayments,
  type PendingPayment,
} from "@/lib/pending-payments";
import { recoverRazorpayPurchase } from "@/lib/razorpay.functions";
import { formatINR } from "@/lib/cms";

type RecoveryResult = {
  ok: boolean;
  kind: string;
  item_id: string;
  title: string;
  credited: number;
  amount_inr: number;
  already_unlocked?: boolean;
  message: string;
};

export function RazorpayPaymentRecovery({ className = "" }: { className?: string }) {
  const qc = useQueryClient();
  const recover = useServerFn(recoverRazorpayPurchase);
  const [paymentId, setPaymentId] = useState("");
  const [pending, setPending] = useState<PendingPayment[]>([]);
  const [result, setResult] = useState<RecoveryResult | null>(null);

  useEffect(() => {
    const refresh = () => setPending(listPendingPayments());
    refresh();
    window.addEventListener("kkcc:pending-payments", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("kkcc:pending-payments", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const mutation = useMutation({
    mutationFn: (id: string) =>
      safeServerCall(() => recover({ data: { payment_id: id } }) as Promise<RecoveryResult>, null),
    onSuccess: async (data, id) => {
      if (!data) {
        toast.error("Could not reach the server. Please check your connection and try again.");
        return;
      }
      setResult(data);
      forgetPendingPayment(id);
      setPending(listPendingPayments());
      await invalidateLearningQueries(qc);
      window.dispatchEvent(new Event("kkcc:23kaat-refresh"));
      toast.success("Access recovered", { description: data.message });
    },
    onError: (error: Error) => toast.error(error.message || "Payment recovery failed"),
  });

  const submit = (id?: string) => {
    const value = (id ?? paymentId).trim();
    if (value.length < 6) {
      toast.error("Enter the full Razorpay Payment ID (it starts with pay_)");
      return;
    }
    setPaymentId(value);
    setResult(null);
    mutation.mutate(value);
  };

  return (
    <section className={`surface-panel p-5 ${className}`} id="payment-recovery">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-600">
          <LifeBuoy className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-black">Payment ho gaya lekin access nahi mila?</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Razorpay Payment ID daaliye (UPI app / SMS / email me <strong>pay_</strong> se shuru
            hone wala number). Hum payment ko Razorpay se verify karke aapka Batch, Test Series,
            Test ya 23KAAT coins turant unlock kar denge — Admin ko message karne ki zaroorat nahi.
          </p>
        </div>
      </div>

      {pending.length > 0 ? (
        <div className="mt-4 space-y-2">
          {pending.map((entry) => (
            <div
              key={entry.payment_id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed bg-muted/40 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{entry.title}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {entry.payment_id} · {formatINR(entry.amount_inr)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={mutation.isPending}
                onClick={() => submit(entry.payment_id)}
              >
                Recover this
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          value={paymentId}
          onChange={(event) => setPaymentId(event.target.value)}
          placeholder="pay_XXXXXXXXXXXXXX"
          autoComplete="off"
          spellCheck={false}
          className="font-mono text-sm"
        />
        <Button
          className="rounded-full sm:w-auto"
          disabled={mutation.isPending}
          onClick={() => submit()}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" /> Verify &amp; unlock
            </>
          )}
        </Button>
      </div>

      {result ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="font-semibold text-emerald-700">
            {result.message}
            {result.already_unlocked ? " (Pehle se active tha — kuch badla nahi.)" : ""}
          </p>
        </div>
      ) : null}

      <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Payment verify karne ke liye Admin Panel me Razorpay <strong>Key Secret</strong> bhi bhara
        hona chahiye. Agar verify na ho paye to Payment ID ke saath Admin se sampark karein — aapko
        wahi flow dikhega jo pehle tha.
      </p>
    </section>
  );
}
