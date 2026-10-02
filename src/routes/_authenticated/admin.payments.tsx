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
  disconnectAdminRazorpay,
  getAdminPaymentSettings,
  saveAdminPaymentSettings,
} from "@/lib/platform-settings.functions";
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
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
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
  const disconnectGateway = useServerFn(disconnectAdminRazorpay);
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
    onSuccess: () => {
      setKeySecret("");
      setWebhookSecret("");
      toast.success("Payment settings saved");
      void qc.invalidateQueries({ queryKey: ["admin", "payments"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const disconnectMutation = useMutation({
    mutationFn: () => disconnectGateway(),
    onSuccess: () => {
      setEnabled(false);
      setMode("test");
      setKeyId("");
      setKeySecret("");
      setWebhookSecret("");
      toast.success("Razorpay credentials disconnected and removed");
      void qc.invalidateQueries({ queryKey: ["admin", "payments"] });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const secrets = settingsQuery.data?.secrets;
  const credentialsSaved = Boolean(
    settingsQuery.data?.razorpay_key_id &&
    secrets?.razorpay_key_secret.configured &&
    secrets?.razorpay_webhook_secret.configured,
  );

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Payments & Razorpay readiness"
        description="Razorpay is not connected. Collect and grant offline access for now; later you can store or remove gateway credentials here. Saving credentials does not activate an unimplemented online checkout."
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin">Courses</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/students">Student access</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/admin/storage">Storage</Link>
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel p-5">
            <WalletCards className="h-9 w-9 text-primary" />
            <h2 className="mt-3 text-lg font-bold">Current payment mode</h2>
            <Badge
              variant={credentialsSaved ? "secondary" : "outline"}
              className="mt-2 rounded-full"
            >
              {credentialsSaved ? "Credentials saved · checkout remains offline" : "Not connected"}
            </Badge>
            <p className="mt-2 text-sm text-muted-foreground">
              No Razorpay key is required now. Students can contact admin, pay offline, and be
              enrolled from Student access.
            </p>

            <div className="mt-5 space-y-4">
              <label className="flex items-center justify-between gap-3 rounded-2xl border p-4 text-sm">
                <span>
                  <span className="block font-semibold">Gateway status flag</span>
                  <span className="text-muted-foreground">
                    This status is saved for future integration; it does not process payments today.
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
                  <Label htmlFor="key-id">Razorpay key ID</Label>
                  <Input
                    id="key-id"
                    value={keyId}
                    onChange={(e) => setKeyId(e.target.value)}
                    placeholder="rzp_test_..."
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

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                className="rounded-full"
                disabled={saveMutation.isPending || settingsQuery.isLoading}
                onClick={() => saveMutation.mutate()}
              >
                {saveMutation.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                {credentialsSaved ? "Update payment configuration" : "Save configuration for later"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={disconnectMutation.isPending || settingsQuery.isLoading}
                onClick={() => {
                  if (
                    window.confirm(
                      "Remove all saved Razorpay credentials and switch online payments off?",
                    )
                  ) {
                    disconnectMutation.mutate();
                  }
                }}
              >
                {disconnectMutation.isPending && (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                )}
                Disconnect & remove credentials
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Credentials are stored server-side. A live/test account, checkout-order verification,
              webhook validation and successful payment activation are not configured by this app
              yet.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
