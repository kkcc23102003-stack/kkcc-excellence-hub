import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/kkcc/auth-shell";
import { SupabaseSetupAlert } from "@/components/kkcc/supabase-setup-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import {
  activateSandboxAdminSession,
  isSandboxPreviewAvailable,
} from "@/integrations/supabase/sandbox";
import { friendlyAuthError, safeRedirectPath } from "@/lib/auth";
import { useUiText } from "@/components/kkcc/ui-text-provider";

const searchSchema = z.object({
  redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Login — KKCC Student Portal" },
      { name: "description", content: "Sign in to your KKCC account to continue learning." },
      { property: "og:title", content: "Login — KKCC" },
      {
        property: "og:description",
        content: "Access your KKCC courses, tests and study material.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(72),
});

function LoginPage() {
  const { redirectTo } = Route.useSearch();
  const { auth } = useUiText();
  const configured = isSupabaseConfigured();
  const sandboxAvailable = isSandboxPreviewAvailable();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const nextPath = safeRedirectPath(redirectTo, "/");
  const openSandboxAdmin = () => {
    if (!activateSandboxAdminSession()) return;
    toast.info("Opening the editable local sandbox; changes never reach Supabase or production.");
    window.location.assign(nextPath === "/" ? "/admin" : nextPath);
  };

  useEffect(() => {
    if (!configured) return;

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) window.location.replace(nextPath);
    });

    return () => {
      active = false;
    };
  }, [configured, nextPath]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!configured) {
      const message = "Login/signup will go live after the app backend is configured.";
      setFormError(message);
      toast.error(message);
      return;
    }

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
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (error) {
        const message = friendlyAuthError(error);
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Signed in successfully");
      window.location.assign(nextPath);
    } catch (error) {
      const message = friendlyAuthError(error instanceof Error ? error : new Error(String(error)));
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    const parsed = z.string().trim().email().safeParse(values.email);
    if (!parsed.success) {
      setFormError("Enter your account email first.");
      return;
    }
    setResending(true);
    setFormError("");
    try {
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: parsed.data,
        options: { emailRedirectTo },
      });
      if (error) throw error;
      setConfirmationSent(true);
      toast.success("Confirmation email sent");
    } catch (error) {
      const message = friendlyAuthError(error instanceof Error ? error : new Error(String(error)));
      setFormError(message);
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      title={auth.login_title}
      description={auth.login_description}
      footer={
        <>
          {auth.login_footer_prompt}{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            {auth.login_footer_link}
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {!configured && <SupabaseSetupAlert />}
        {formError && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </p>
        )}
        {confirmationSent && (
          <p className="flex items-center gap-2 rounded-xl border bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
            <MailCheck className="h-4 w-4 text-primary" />
            Confirmation email sent. Check your inbox and spam folder.
          </p>
        )}
        {/confirm your email|email not confirmed|email_not_confirmed/i.test(formError) && (
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            onClick={resendConfirmation}
            disabled={resending || loading || !configured}
          >
            {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend confirmation email
          </Button>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            aria-invalid={!!errors["email"]}
            className="mt-1.5"
            disabled={loading || !configured}
          />
          {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              {auth.forgot_password_label}
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              aria-invalid={!!errors["password"]}
              disabled={loading || !configured}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground disabled:opacity-50"
              disabled={loading || !configured}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors["password"] && (
            <p className="mt-1 text-xs text-destructive">{errors["password"]}</p>
          )}
        </div>

        <Button type="submit" className="w-full rounded-full" disabled={loading || !configured}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {auth.login_submit_label}
        </Button>

        {sandboxAvailable && (
          <div className="space-y-2 rounded-2xl border border-primary/25 bg-primary/5 p-3">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              onClick={openSandboxAdmin}
            >
              <ShieldCheck className="mr-2 h-4 w-4" /> Open sandbox admin preview
            </Button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Local preview only. No Supabase connection, production records, or writes are used.
            </p>
          </div>
        )}

        <div className="rounded-2xl border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> {auth.secure_login_title}
          </p>
          <p className="mt-1">{auth.secure_login_description}</p>
        </div>
      </form>
    </AuthShell>
  );
}
