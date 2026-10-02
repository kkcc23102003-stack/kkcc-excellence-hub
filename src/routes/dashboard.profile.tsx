import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { SupabaseSetupAlert } from "@/components/kkcc/supabase-setup-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { friendlyAuthError, profileFromUser } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Profile — KKCC Dashboard" },
      { name: "description", content: "Manage your KKCC student profile details and preferences." },
      { property: "og:title", content: "Profile — KKCC" },
      { property: "og:description", content: "Update your KKCC account information." },
    ],
  }),
  component: ProfilePage,
});

const schema = z.object({
  name: z.string().trim().min(2, { message: "Enter your full name" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  mobile: z
    .string()
    .trim()
    .regex(/^(?:\+91[-\s]?)?[6-9]\d{9}$|^[0-9]{10}$/, {
      message: "Enter a valid 10-digit mobile number",
    }),
  classLevel: z.string().trim().min(2, { message: "Enter your class or stream" }).max(50),
  targetExam: z.string().trim().min(2, { message: "Enter your target exam" }).max(80),
});

type Values = z.infer<typeof schema>;

const EMPTY_VALUES: Values = {
  name: "",
  email: "",
  mobile: "",
  classLevel: "",
  targetExam: "",
};

function normalizeMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function ProfilePage() {
  const navigate = useNavigate();
  const configured = isSupabaseConfigured();
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadProfile = async () => {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!active) return;

      if (authError || !authData.user) {
        navigate({ to: "/login", search: { redirectTo: "/dashboard/profile" } });
        return;
      }

      setCurrentUser(authData.user);
      const fallback = profileFromUser(authData.user);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, mobile, class_level, target_exam")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (!active) return;
      if (profileError) {
        console.error("[profile] load failed", profileError);
        toast.warning("Profile table read failed. Using auth metadata for now.");
      }

      setValues({
        name: profile?.full_name || fallback.full_name,
        email: authData.user.email ?? "",
        mobile: profile?.mobile || fallback.mobile,
        classLevel: profile?.class_level || fallback.class_level,
        targetExam: profile?.target_exam || fallback.target_exam,
      });
      setLoading(false);
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, [configured, navigate]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[String(i.path[0])] = i.message));
      setErrors(next);
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const profilePayload = {
        id: currentUser.id,
        email: parsed.data.email.toLowerCase(),
        full_name: parsed.data.name,
        mobile: normalizeMobile(parsed.data.mobile),
        class_level: parsed.data.classLevel,
        target_exam: parsed.data.targetExam,
        updated_at: new Date().toISOString(),
      };
      const authPayload: {
        email?: string;
        data: Record<string, string>;
      } = {
        data: {
          full_name: profilePayload.full_name,
          mobile: profilePayload.mobile,
          class_level: profilePayload.class_level,
          target_exam: profilePayload.target_exam,
        },
      };

      if (parsed.data.email !== currentUser.email) {
        authPayload.email = parsed.data.email;
      }

      const { data: updated, error: authError } = await supabase.auth.updateUser(authPayload);
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" });
      if (profileError) throw profileError;

      setCurrentUser(updated.user ?? currentUser);
      toast.success(
        authPayload.email
          ? "Profile saved. Please confirm the email change from your inbox."
          : "Profile saved successfully",
      );
    } catch (error) {
      toast.error(friendlyAuthError(error instanceof Error ? error : new Error(String(error))));
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.assign("/login");
  };

  const fields = [
    { key: "name" as const, label: "Full name", type: "text" },
    { key: "email" as const, label: "Email", type: "email" },
    { key: "mobile" as const, label: "Mobile number", type: "tel" },
    { key: "classLevel" as const, label: "Class / stream", type: "text" },
    { key: "targetExam" as const, label: "Target exam", type: "text" },
  ];

  if (!configured) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <div className="mt-6">
          <SupabaseSetupAlert />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid min-h-[300px] place-items-center rounded-3xl border bg-card">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your details are synced securely with your student profile.
          </p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={signOut}>
          <LogOut className="mr-1.5 h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <form onSubmit={save} className="surface-panel max-w-xl space-y-5 p-6" noValidate>
          {fields.map((f) => (
            <div key={f.key}>
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                type={f.type}
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                aria-invalid={!!errors[f.key]}
                className="mt-1.5"
                disabled={saving}
              />
              {errors[f.key] && <p className="mt-1 text-xs text-destructive">{errors[f.key]}</p>}
            </div>
          ))}
          <Separator />
          <Button type="submit" className="rounded-full" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>

        <aside className="surface-panel h-fit p-5">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h2 className="mt-3 font-semibold">Account security</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">User ID</dt>
              <dd className="mt-1 break-all font-mono text-xs">{currentUser?.id}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Email status</dt>
              <dd className="mt-1">{currentUser?.email_confirmed_at ? "Confirmed" : "Pending"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Last sign in</dt>
              <dd className="mt-1">
                {currentUser?.last_sign_in_at
                  ? new Date(currentUser.last_sign_in_at).toLocaleString("en-IN")
                  : "—"}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
