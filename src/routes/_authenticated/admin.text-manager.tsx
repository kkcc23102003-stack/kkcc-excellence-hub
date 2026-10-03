import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RotateCcw, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_UI_TEXT,
  getAdminUiText,
  saveAdminUiText,
  sanitiseUiText,
  type UiTextSettings,
} from "@/lib/ui-text.functions";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/text-manager")({
  head: () => ({
    meta: [
      { title: "Admin — Hybrid Text Manager | KKCC" },
      {
        name: "description",
        content: "Safely edit selected KKCC app text without changing core technical labels.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TextManager,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild className="rounded-full">
            <Link to="/admin">Back to admin</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/login" search={{ redirectTo: "/admin/text-manager" }}>
              Sign in as admin
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  ),
});

type SectionKey = keyof UiTextSettings;

type Field<Row extends SectionKey> = {
  key: keyof UiTextSettings[Row];
  label: string;
  helper?: string;
  rows?: number;
};

const AUTH_FIELDS: Field<"auth">[] = [
  { key: "side_heading", label: "Auth side heading", rows: 2 },
  { key: "side_description", label: "Auth side description", rows: 2 },
  { key: "login_title", label: "Login title" },
  { key: "login_description", label: "Login description", rows: 2 },
  { key: "login_submit_label", label: "Login button" },
  { key: "forgot_password_label", label: "Forgot password link" },
  { key: "login_footer_prompt", label: "Login footer prompt" },
  { key: "login_footer_link", label: "Login footer link" },
  { key: "secure_login_title", label: "Secure-login card title" },
  { key: "secure_login_description", label: "Secure-login card description", rows: 2 },
  { key: "signup_title", label: "Signup title" },
  { key: "signup_description", label: "Signup description", rows: 2 },
  { key: "signup_submit_label", label: "Signup button" },
  { key: "signup_footer_prompt", label: "Signup footer prompt" },
  { key: "signup_footer_link", label: "Signup footer link" },
  { key: "signup_success_title", label: "Signup success title" },
  { key: "signup_success_description", label: "Signup success description", rows: 2 },
  { key: "forgot_title", label: "Forgot-password title" },
  { key: "forgot_description", label: "Forgot-password description", rows: 2 },
  { key: "forgot_submit_label", label: "Forgot-password button" },
  { key: "forgot_back_label", label: "Back-to-login label" },
  { key: "forgot_success_title", label: "Forgot-password success title" },
  { key: "forgot_success_description", label: "Forgot-password success description", rows: 2 },
  { key: "reset_title", label: "Reset-password title" },
  { key: "reset_description", label: "Reset-password description", rows: 2 },
  { key: "reset_submit_label", label: "Reset-password button" },
  { key: "reset_success_title", label: "Reset-password success title" },
  { key: "reset_success_description", label: "Reset-password success description", rows: 2 },
];

const DASHBOARD_FIELDS: Field<"dashboard">[] = [
  { key: "welcome_eyebrow", label: "Dashboard welcome eyebrow" },
  { key: "welcome_title", label: "Dashboard welcome title" },
  { key: "student_section_label", label: "Student Section label" },
  { key: "student_profile_title", label: "Student profile page title" },
  { key: "student_profile_description", label: "Student profile page description", rows: 2 },
  { key: "active_batches_title", label: "Active batches heading" },
  { key: "no_active_batch_title", label: "No-active-batch title" },
  { key: "no_active_batch_description", label: "No-active-batch description", rows: 2 },
  { key: "browse_courses_label", label: "Browse courses button" },
  { key: "support_cta_title", label: "Access-extension CTA title" },
  { key: "support_cta_description", label: "Access-extension CTA description", rows: 2 },
  { key: "support_cta_label", label: "Support CTA button" },
];

const SYSTEM_FIELDS: Field<"system">[] = [
  { key: "install_title", label: "Install prompt title" },
  { key: "install_chrome_description", label: "Chrome install prompt description", rows: 2 },
  { key: "install_ios_description", label: "iOS/iPad install hint", rows: 2 },
  { key: "install_button_label", label: "Install button" },
  {
    key: "not_found_title",
    label: "404 title",
    helper: "Prepared fallback text for future extension.",
  },
  { key: "not_found_description", label: "404 description", rows: 2 },
  { key: "not_found_home_label", label: "404 home button" },
  { key: "error_title", label: "Error page title" },
  { key: "error_description", label: "Error page description", rows: 2 },
  { key: "error_retry_label", label: "Error retry button" },
  { key: "error_home_label", label: "Error home button" },
  { key: "offline_title", label: "Offline page title", helper: "Static offline fallback default." },
  { key: "offline_description", label: "Offline page description", rows: 2 },
  { key: "offline_retry_label", label: "Offline retry button" },
];

function updateSection<Row extends SectionKey>(
  value: UiTextSettings,
  section: Row,
  key: keyof UiTextSettings[Row],
  next: string,
): UiTextSettings {
  return {
    ...value,
    [section]: {
      ...value[section],
      [key]: next,
    },
  };
}

function FieldGrid<Row extends SectionKey>({
  title,
  description,
  section,
  fields,
  form,
  setForm,
}: {
  title: string;
  description: string;
  section: Row;
  fields: Field<Row>[];
  form: UiTextSettings;
  setForm: (value: UiTextSettings) => void;
}) {
  return (
    <section className="surface-panel p-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
          Hybrid editable
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={String(field.key)}
            className={field.rows && field.rows > 1 ? "sm:col-span-2" : ""}
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <Label>{field.label}</Label>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() =>
                  setForm(
                    updateSection(
                      form,
                      section,
                      field.key,
                      String(DEFAULT_UI_TEXT[section][field.key] ?? ""),
                    ),
                  )
                }
              >
                Default
              </button>
            </div>
            <Textarea
              className="min-h-11 resize-y"
              rows={field.rows ?? 1}
              value={String(form[section][field.key] ?? "")}
              onChange={(event) =>
                setForm(updateSection(form, section, field.key, event.target.value))
              }
            />
            {field.helper && (
              <p className="mt-1 text-[11px] text-muted-foreground">{field.helper}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function TextManager() {
  const qc = useQueryClient();
  const load = useServerFn(getAdminUiText);
  const save = useServerFn(saveAdminUiText);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "ui-text"],
    queryFn: () => load(),
    retry: false,
    throwOnError: true,
  });
  const [form, setForm] = useState<UiTextSettings>(DEFAULT_UI_TEXT);

  useEffect(() => {
    if (data) setForm(sanitiseUiText(data));
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (value: UiTextSettings) => save({ data: sanitiseUiText(value) }),
    onSuccess: (saved) => {
      setForm(sanitiseUiText(saved));
      void qc.invalidateQueries({ queryKey: ["admin", "ui-text"] });
      void qc.invalidateQueries({ queryKey: ["public-ui-text"] });
      toast.success("Hybrid text saved");
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin · Hybrid editing"
        title="Text Manager"
        description="Edit selected student-facing text safely. Core security, validation and admin technical labels stay fixed so the app remains stable. Empty fields automatically fall back to safe defaults."
      >
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/admin/content">Website content</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/admin/branding">Branding</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/admin/app-builder">App Builder</Link>
          </Button>
        </div>
      </PageHeader>

      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        <div className="surface-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">Safe hybrid mode</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Editable: auth marketing text, dashboard friendly labels, install prompt. Fixed:
                form labels, validation, admin controls, destructive actions and backend/security
                text.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setForm(DEFAULT_UI_TEXT)}
              disabled={saveMutation.isPending || isLoading}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" /> Reset all defaults
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => saveMutation.mutate(form)}
              disabled={saveMutation.isPending || isLoading}
            >
              {saveMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              Save text
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="surface-panel p-8 text-sm text-muted-foreground">Loading text…</div>
        ) : (
          <>
            <FieldGrid
              title="Login, signup and password pages"
              description="Marketing and helper text around authentication. Field labels and validation stay fixed for reliability."
              section="auth"
              fields={AUTH_FIELDS}
              form={form}
              setForm={setForm}
            />
            <FieldGrid
              title="Student dashboard friendly copy"
              description="Headings and empty-state messages students see after login. Course data itself remains managed from course/student sections."
              section="dashboard"
              fields={DASHBOARD_FIELDS}
              form={form}
              setForm={setForm}
            />
            <FieldGrid
              title="System and install prompts"
              description="Safe app-level text for install prompts and fallback messages. Technical error details are still protected."
              section="system"
              fields={SYSTEM_FIELDS}
              form={form}
              setForm={setForm}
            />
          </>
        )}
      </div>
    </SiteLayout>
  );
}
