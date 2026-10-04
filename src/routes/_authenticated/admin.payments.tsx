import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, KeyRound, Loader2, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getAdminPaymentSettings,
  saveAdminPaymentSettings,
} from "@/lib/platform-settings.functions";
import { AdminPaymentRecoveryTool } from "@/components/kkcc/admin-payment-recovery-tool";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  head: () => ({
    meta: [
      { title: "Payment settings — KKCC Admin" },
      { name: "description", content: "Configure offline payment text and future Razorpay setup." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPaymentsPage,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
});

function AdminPaymentsPage() {
  const qc = useQueryClient();
  const load = useServerFn(getAdminPaymentSettings);
  const save = useServerFn(saveAdminPaymentSettings);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"test" | "live">("test");
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [offlineInstructions, setOfflineInstructions] = useState("");

  const settingsQuery = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: () => load(),
    retry: false,
    throwOnError: true,
  });

  useEffect(() => {
    const data = settingsQuery.data;
    if (!data) return;
    setEnabled(data.enabled);
    setMode(data.mode);
    setKeyId(data.razorpay_key_id ?? "");
    setOfflineInstructions(data.offline_payment_instructions ?? "");
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          enabled,
          provider: "razorpay",
          mode,
          razorpay_key_id: keyId.trim(),
          razorpay_key_secret: keySecret.trim() || undefined,
          razorpay_webhook_secret: webhookSecret.trim() || undefined,
          offline_payment_instructions: offlineInstructions.trim(),
        },
      }),
    onSuccess: (updated) => {
      setKeySecret("");
      setWebhookSecret("");
      setEnabled(updated.enabled);
      setMode(updated.mode);
      setKeyId(updated.razorpay_key_id ?? "");
      toast.success(
        updated.enabled && updated.razorpay_key_id
          ? `Razorpay (${updated.mode.toUpperCase()}) automatically connected across Batches, Test Series, Tests & 23KAAT Coin Packs!`
          : "Payment settings saved (Offline Payment / Contact Admin mode active).",
      );
      void qc.invalidateQueries({ queryKey: ["admin", "payments"] });
      void qc.invalidateQueries({ queryKey: ["public", "payment-settings"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const secrets = settingsQuery.data?.secrets;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Payments & Razorpay readiness"
        description="Keep paid courses manual/offline for now, then enable Razorpay later from this panel when keys are available."
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/coupons">Coupon Codes (1%–100%)</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/students">Student access</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/storage">Storage</Link>
          </Button>
        </div>

        {/* Auto-Connect Status Banner */}
        <div
          className={`mb-6 rounded-2xl border p-5 ${
            enabled && keyId.trim()
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-amber-500/40 bg-amber-500/10"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black">
                {enabled && keyId.trim()
                  ? `Razorpay Auto-Connected Everywhere (${mode.toUpperCase()} Mode)`
                  : "Offline Payment Mode Active (No Razorpay Key Active)"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {enabled && keyId.trim()
                  ? "All Paid Batches (/courses), Paid Test Series (/test-series), Individual Tests, and 23KAAT Coin Packs (/coins) are automatically connected to Razorpay Online Checkout."
                  : "As soon as you paste your Razorpay Key ID below and click Save, Razorpay will automatically connect across all Batches, Test Series, Paid Tests, and 23KAAT Coin Packs."}
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                enabled && keyId.trim()
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                  : "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-200"
              }
            >
              {enabled && keyId.trim()
                ? "Online Checkout Active"
                : "Paid · Offline (Contact Admin)"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel p-5">
            <WalletCards className="h-9 w-9 text-primary" />
            <h2 className="mt-3 text-lg font-bold">Current payment mode</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No Razorpay key is required now. Students can contact admin, pay offline, and be
              enrolled from Student access.
            </p>

            <div className="mt-5 space-y-4">
              <label className="flex items-center justify-between gap-3 rounded-2xl border p-4 text-sm">
                <span>
                  <span className="block font-semibold">Enable Razorpay checkout</span>
                  <span className="text-muted-foreground">
                    Keep off until real key, secret and webhook are ready.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="h-5 w-5 accent-primary"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <select
                    id="mode"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "test" | "live")}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="test">Test</option>
                    <option value="live">Live</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="key-id">Razorpay key ID (Auto-connects on save)</Label>
                  <Input
                    id="key-id"
                    value={keyId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setKeyId(val);
                      const trimmed = val.trim();
                      if (trimmed.length > 0) {
                        setEnabled(true);
                        if (trimmed.startsWith("rzp_live_")) setMode("live");
                        else if (trimmed.startsWith("rzp_test_")) setMode("test");
                      } else {
                        setEnabled(false);
                      }
                    }}
                    placeholder="rzp_test_... or rzp_live_..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-secret">Razorpay key secret</Label>
                <Input
                  id="key-secret"
                  type="password"
                  value={keySecret}
                  onChange={(e) => setKeySecret(e.target.value)}
                  placeholder={
                    secrets?.razorpay_key_secret.configured
                      ? "Stored — leave blank to keep"
                      : "Paste later"
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Status:{" "}
                  {secrets?.razorpay_key_secret.configured ? "configured" : "not configured"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Webhook secret</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder={
                    secrets?.razorpay_webhook_secret.configured
                      ? "Stored — leave blank to keep"
                      : "Paste later"
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Status:{" "}
                  {secrets?.razorpay_webhook_secret.configured ? "configured" : "not configured"}
                </p>
              </div>
            </div>
          </div>

          <div className="surface-panel p-5">
            <CreditCard className="h-9 w-9 text-primary" />
            <h2 className="mt-3 text-lg font-bold">Offline payment instructions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This text appears on paid checkout while Razorpay is off.
            </p>
            <Textarea
              className="mt-4"
              rows={7}
              value={offlineInstructions}
              onChange={(e) => setOfflineInstructions(e.target.value)}
              placeholder="Write UPI/cash/bank transfer instructions for students..."
            />

            <div className="mt-5 rounded-2xl border bg-muted/40 p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                <span className="font-semibold">Secret safety</span>
                <Badge variant="secondary" className="rounded-full text-[11px]">
                  server/private table
                </Badge>
              </div>
              <p className="mt-2 text-muted-foreground">
                Key secret values are not printed back in the UI. Leave secret fields blank to keep
                the saved value; enter a new value only when rotating credentials.
              </p>
            </div>

            <Button
              className="mt-5 rounded-full"
              disabled={saveMutation.isPending || settingsQuery.isLoading}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Save payment settings
            </Button>
          </div>
        </div>

        {/* Support tool: verify a Razorpay payment and unlock the student. */}
        <AdminPaymentRecoveryTool />
      </div>
    </SiteLayout>
  );
}
