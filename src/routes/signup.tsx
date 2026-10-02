import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/kkcc/auth-shell";
import { SupabaseSetupAlert } from "@/components/kkcc/supabase-setup-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/auth";
import { useUiText } from "@/components/kkcc/ui-text-provider";

export const Route = createFileRoute("/signup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create your KKCC account — Sign up" },
      {
        name: "description",
        content:
          "Create a KKCC student account to enrol in courses, attempt tests and track progress.",
      },
      { property: "og:title", content: "Sign up — KKCC" },
      { property: "og:description", content: "Start learning with KKCC in a few seconds." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupPage,
});

const schema = z
  .object({
    name: z.string().trim().min(2, { message: "Enter your full name" }).max(100),
    email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
    mobile: z
      .string()
      .trim()
      .regex(/^(?:\+91[-\s]?)?[6-9]\d{9}$|^[0-9]{10}$/, {
        message: "Enter a valid 10-digit mobile number",
      }),
    classLevel: z.string().trim().min(2, { message: "Enter your class or stream" }).max(50),
    targetExam: z.string().trim().min(2, { message: "Enter your target exam" }).max(80),
    password: z.string().min(8, { message: "Use at least 8 characters" }).max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.input<typeof schema>;

const FIELDS = [
  { key: "name", label: "Full name", type: "text", autoComplete: "name", placeholder: "Your name" },
  {
    key: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "student@example.com",
  },
  {
    key: "mobile",
    label: "Mobile number",
    type: "tel",
    autoComplete: "tel",
    placeholder: "9876543210",
  },
  {
    key: "classLevel",
    label: "Class / stream",
    type: "text",
    autoComplete: "organization-title",
    placeholder: "Class 12 / NEET / JEE",
  },
  {
    key: "targetExam",
    label: "Target exam",
    type: "text",
    autoComplete: "off",
    placeholder: "Boards, NEET, JEE, CUET...",
  },
] as const satisfies readonly {
  key: keyof Pick<FormValues, "name" | "email" | "mobile" | "classLevel" | "targetExam">;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
}[];

function normalizeMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

async function upsertProfile(userId: string, data: z.output<typeof schema>) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email: data.email.toLowerCase(),
      full_name: data.name,
      mobile: normalizeMobile(data.mobile),
      class_level: data.classLevel,
      target_exam: data.targetExam,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) throw error;
}

function SignupPage() {
  const { auth } = useUiText();
  const configured = isSupabaseConfigured();
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    mobile: "",
    classLevel: "",
    targetExam: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!configured) {
      const message = "Signup will go live after the app backend is configured.";
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
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/")}`;
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: parsed.data.name,
            mobile: normalizeMobile(parsed.data.mobile),
            class_level: parsed.data.classLevel,
            target_exam: parsed.data.targetExam,
          },
        },
      });

      if (error) {
        const message = friendlyAuthError(error);
        setFormError(message);
        toast.error(message);
        return;
      }

      if (data.user && data.session) {
        try {
          await upsertProfile(data.user.id, parsed.data);
        } catch (profileError) {
          console.error("[profile] signup profile sync failed", profileError);
          toast.warning("Account created, but profile table sync needs migration check.");
        }
        toast.success("Account created successfully");
        window.location.assign("/");
        return;
      }

      setSentEmail(parsed.data.email);
      toast.success("Confirmation email sent");
    } catch (error) {
      const message = friendlyAuthError(error instanceof Error ? error : new Error(String(error)));
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resendSignupConfirmation = async () => {
    if (!sentEmail) return;
    setResending(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/")}`;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: sentEmail,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setResent(true);
      toast.success("Confirmation email sent again");
    } catch (error) {
      toast.error(friendlyAuthError(error instanceof Error ? error : new Error(String(error))));
    } finally {
      setResending(false);
    }
  };

  if (sentEmail) {
    return (
      <AuthShell
        title={auth.signup_success_title}
        description={auth.signup_success_description}
        footer={
          <Link to="/login" className="font-medium text-primary hover:underline">
            {auth.login_submit_label}
          </Link>
        }
      >
        <div className="rounded-2xl border bg-card p-6 text-center">
          <MailCheck className="mx-auto h-9 w-9 text-primary" />
          <p className="mt-3 font-semibold">{auth.signup_success_title}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {auth.signup_success_description}{" "}
            <span className="font-medium text-foreground">{sentEmail}</span>
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 w-full rounded-full"
            onClick={resendSignupConfirmation}
            disabled={resending}
          >
            {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend confirmation email
          </Button>
          {resent && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Confirmation email sent again. Please also check spam.
            </p>
          )}
          <Button asChild className="mt-3 w-full rounded-full">
            <Link to="/login">{auth.login_submit_label}</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={auth.signup_title}
      description={auth.signup_description}
      footer={
        <>
          {auth.signup_footer_prompt}{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            {auth.signup_footer_link}
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

        {FIELDS.map((f) => (
          <div key={f.key}>
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              type={f.type}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              value={values[f.key]}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              aria-invalid={!!errors[f.key]}
              className="mt-1.5"
              disabled={loading || !configured}
            />
            {errors[f.key] && <p className="mt-1 text-xs text-destructive">{errors[f.key]}</p>}
          </div>
        ))}

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
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

        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={values.confirm}
            onChange={(e) => setValues({ ...values, confirm: e.target.value })}
            aria-invalid={!!errors["confirm"]}
            className="mt-1.5"
            disabled={loading || !configured}
          />
          {errors["confirm"] && (
            <p className="mt-1 text-xs text-destructive">{errors["confirm"]}</p>
          )}
        </div>

        <Button type="submit" className="w-full rounded-full" disabled={loading || !configured}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {auth.signup_submit_label}
        </Button>

        <div className="rounded-2xl border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> Fully connected profile
          </p>
          <p className="mt-1">
            After signup, the student account and profile details sync securely with the app
            database.
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
