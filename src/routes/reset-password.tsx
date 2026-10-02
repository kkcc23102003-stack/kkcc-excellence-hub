import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/kkcc/auth-shell";
import { SupabaseSetupAlert } from "@/components/kkcc/supabase-setup-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/auth";
import { useUiText } from "@/components/kkcc/ui-text-provider";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset password — KKCC" },
      { name: "description", content: "Set a new password for your KKCC student account." },
      { property: "og:title", content: "Reset password — KKCC" },
      { property: "og:description", content: "Choose a new password for your KKCC account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(72, { message: "Password must be under 72 characters" }),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

function ResetPassword() {
  const { auth } = useUiText();
  const navigate = useNavigate();
  const configured = isSupabaseConfigured();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid" | "done">("checking");
  const [values, setValues] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!configured) {
      setStatus("invalid");
      return;
    }

    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setStatus("ready");
    });

    const verify = async () => {
      const search = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

      if (search.get("error") || hash.get("error")) {
        if (active) setStatus("invalid");
        return;
      }

      const code = search.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!active) return;
        setStatus(error ? "invalid" : "ready");
        return;
      }

      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!active) return;
        setStatus(error ? "invalid" : "ready");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setStatus(data.session ? "ready" : "invalid");
    };
    void verify();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [configured]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[String(i.path[0])] = i.message));
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
      if (error) {
        toast.error(
          /session|jwt|expired/i.test(error.message)
            ? "This reset link has expired or was already used. Request a new one."
            : friendlyAuthError(error),
        );
        return;
      }
      setStatus("done");
      toast.success("Password updated");
      await supabase.auth.signOut();
    } catch (error) {
      toast.error(friendlyAuthError(error instanceof Error ? error : new Error(String(error))));
    } finally {
      setLoading(false);
    }
  };

  if (!configured) {
    return (
      <AuthShell title={auth.reset_title} description="App connection is required.">
        <SupabaseSetupAlert />
      </AuthShell>
    );
  }

  if (status === "checking") {
    return (
      <AuthShell title={auth.reset_title} description="Verifying your reset link…">
        <div className="grid place-items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AuthShell>
    );
  }

  if (status === "invalid") {
    return (
      <AuthShell
        title="Reset link not valid"
        description="This password reset link is invalid, expired or has already been used."
        footer={
          <Link to="/login" className="font-medium text-primary hover:underline">
            {auth.forgot_back_label}
          </Link>
        }
      >
        <Button asChild className="w-full rounded-full">
          <Link to="/forgot-password">Request a new reset link</Link>
        </Button>
      </AuthShell>
    );
  }

  if (status === "done") {
    return (
      <AuthShell title={auth.reset_success_title} description={auth.reset_success_description}>
        <Button className="w-full rounded-full" onClick={() => navigate({ to: "/login" })}>
          {auth.login_submit_label}
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={auth.reset_title}
      description={auth.reset_description}
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          {auth.forgot_back_label}
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="password">New password</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              aria-invalid={!!errors["password"]}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors["password"] && (
            <p className="mt-1 text-xs text-destructive">{errors["password"]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input
            id="confirm"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={values.confirm}
            onChange={(e) => setValues({ ...values, confirm: e.target.value })}
            aria-invalid={!!errors["confirm"]}
            className="mt-1.5"
          />
          {errors["confirm"] && (
            <p className="mt-1 text-xs text-destructive">{errors["confirm"]}</p>
          )}
        </div>

        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {auth.reset_submit_label}
        </Button>
      </form>
    </AuthShell>
  );
}
