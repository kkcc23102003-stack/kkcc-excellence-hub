import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2, MailCheck } from "lucide-react";
import { AuthShell } from "@/components/kkcc/auth-shell";
import { SupabaseSetupAlert } from "@/components/kkcc/supabase-setup-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/auth";
import { useUiText } from "@/components/kkcc/ui-text-provider";

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Forgot password — KKCC" },
      {
        name: "description",
        content: "Request a password reset link for your KKCC student account.",
      },
      { property: "og:title", content: "Forgot password — KKCC" },
      { property: "og:description", content: "Reset access to your KKCC account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPassword,
});

const schema = z.string().trim().email().max(255);

function ForgotPassword() {
  const { auth } = useUiText();
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!configured) {
      setError("Password reset emails will be available after the app backend is configured.");
      return;
    }

    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Never reveal whether the address exists — always show the same confirmation.
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        "/reset-password",
      )}`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo,
      });

      if (resetError) {
        const message = friendlyAuthError(resetError);
        if (/too many|rate limit/i.test(resetError.message)) {
          setError(message);
          return;
        }
        // Keep account enumeration private; non-rate-limit errors are logged only.
        console.error("[auth] reset email request failed", resetError);
      }

      setSent(true);
    } catch (resetError) {
      setError(
        friendlyAuthError(resetError instanceof Error ? resetError : new Error(String(resetError))),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={auth.forgot_title}
      description={auth.forgot_description}
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          {auth.forgot_back_label}
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-2xl border bg-card p-6 text-center">
          <MailCheck className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 font-semibold">{auth.forgot_success_title}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {auth.forgot_success_description}{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          {!configured && <SupabaseSetupAlert />}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              className="mt-1.5"
              disabled={loading || !configured}
            />
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={loading || !configured}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {auth.forgot_submit_label}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
