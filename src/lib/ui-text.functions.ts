import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { getSandboxPreviewClient } from "@/integrations/supabase/sandbox-client";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

const UI_TEXT_KEY = "ui_text_json";

const authTextSchema = z.object({
  side_heading: z.string().trim().max(180),
  side_description: z.string().trim().max(260),
  login_title: z.string().trim().max(100),
  login_description: z.string().trim().max(220),
  login_submit_label: z.string().trim().max(80),
  login_footer_prompt: z.string().trim().max(100),
  login_footer_link: z.string().trim().max(80),
  forgot_password_label: z.string().trim().max(80),
  secure_login_title: z.string().trim().max(100),
  secure_login_description: z.string().trim().max(260),
  signup_title: z.string().trim().max(100),
  signup_description: z.string().trim().max(240),
  signup_submit_label: z.string().trim().max(80),
  signup_footer_prompt: z.string().trim().max(100),
  signup_footer_link: z.string().trim().max(80),
  signup_success_title: z.string().trim().max(120),
  signup_success_description: z.string().trim().max(300),
  forgot_title: z.string().trim().max(100),
  forgot_description: z.string().trim().max(260),
  forgot_submit_label: z.string().trim().max(80),
  forgot_back_label: z.string().trim().max(80),
  forgot_success_title: z.string().trim().max(120),
  forgot_success_description: z.string().trim().max(300),
  reset_title: z.string().trim().max(100),
  reset_description: z.string().trim().max(260),
  reset_submit_label: z.string().trim().max(80),
  reset_success_title: z.string().trim().max(120),
  reset_success_description: z.string().trim().max(300),
});

const dashboardTextSchema = z.object({
  welcome_eyebrow: z.string().trim().max(100),
  welcome_title: z.string().trim().max(140),
  student_section_label: z.string().trim().max(80),
  student_profile_title: z.string().trim().max(140),
  student_profile_description: z.string().trim().max(300),
  active_batches_title: z.string().trim().max(120),
  no_active_batch_title: z.string().trim().max(120),
  no_active_batch_description: z.string().trim().max(260),
  browse_courses_label: z.string().trim().max(80),
  support_cta_title: z.string().trim().max(120),
  support_cta_description: z.string().trim().max(260),
  support_cta_label: z.string().trim().max(80),
});

const systemTextSchema = z.object({
  not_found_title: z.string().trim().max(100),
  not_found_description: z.string().trim().max(260),
  not_found_home_label: z.string().trim().max(80),
  error_title: z.string().trim().max(100),
  error_description: z.string().trim().max(260),
  error_retry_label: z.string().trim().max(80),
  error_home_label: z.string().trim().max(80),
  install_title: z.string().trim().max(120),
  install_chrome_description: z.string().trim().max(260),
  install_ios_description: z.string().trim().max(260),
  install_button_label: z.string().trim().max(80),
  offline_title: z.string().trim().max(100),
  offline_description: z.string().trim().max(260),
  offline_retry_label: z.string().trim().max(80),
});

const uiTextSchema = z.object({
  auth: authTextSchema,
  dashboard: dashboardTextSchema,
  system: systemTextSchema,
});

export type UiTextSettings = z.infer<typeof uiTextSchema>;

export const DEFAULT_UI_TEXT: UiTextSettings = {
  auth: {
    side_heading: "Education That Builds Understanding. Learning That Builds Futures.",
    side_description: "Learn Better. Understand Deeper. Achieve More.",
    login_title: "Welcome back",
    login_description: "Sign in to continue your lectures, tests and revision.",
    login_submit_label: "Sign in",
    login_footer_prompt: "New to KKCC?",
    login_footer_link: "Create an account",
    forgot_password_label: "Forgot password?",
    secure_login_title: "Secure student login",
    secure_login_description:
      "Your session is safely stored in this browser; dashboard and admin routes stay protected.",
    signup_title: "Create your KKCC account",
    signup_description: "Join KKCC to access courses, tests, notes and your learning progress.",
    signup_submit_label: "Create account",
    signup_footer_prompt: "Already have an account?",
    signup_footer_link: "Sign in",
    signup_success_title: "Check your email",
    signup_success_description:
      "Your KKCC account was created. If email confirmation is enabled, open the verification link before signing in.",
    forgot_title: "Reset your password",
    forgot_description: "Enter your registered email and we will send a secure reset link.",
    forgot_submit_label: "Send reset link",
    forgot_back_label: "Back to login",
    forgot_success_title: "Check your email",
    forgot_success_description:
      "If this email is registered with KKCC, a password reset link has been sent.",
    reset_title: "Set a new password",
    reset_description: "Choose a strong password to continue your KKCC learning journey.",
    reset_submit_label: "Update password",
    reset_success_title: "Password updated",
    reset_success_description: "You can now sign in with your new password.",
  },
  dashboard: {
    welcome_eyebrow: "Welcome back",
    welcome_title: "Your learning today",
    student_section_label: "Student Section",
    student_profile_title: "Profile & batch validity",
    student_profile_description:
      "View your profile, enrolled batches/courses, payment source, and remaining validity in one place.",
    active_batches_title: "My active batches",
    no_active_batch_title: "No active batch right now",
    no_active_batch_description:
      "Start a free batch or contact KKCC support to activate paid/offline access.",
    browse_courses_label: "Explore courses",
    support_cta_title: "Need access extension?",
    support_cta_description:
      "If your validity is about to expire, send a message from the Support page for renewal help.",
    support_cta_label: "Contact support",
  },
  system: {
    not_found_title: "Page not found",
    not_found_description: "The page you're looking for doesn't exist or has been moved.",
    not_found_home_label: "Go home",
    error_title: "This page didn't load",
    error_description: "Something went wrong on our end. You can try refreshing or head back home.",
    error_retry_label: "Try again",
    error_home_label: "Go home",
    install_title: "Install KKCC for a faster app feel",
    install_chrome_description:
      "Add it from Chrome to open full screen, launch quickly, and keep core files cached.",
    install_ios_description:
      "On iPhone or iPad, open the browser share menu and choose Add to Home Screen.",
    install_button_label: "Install app",
    offline_title: "You are offline",
    offline_description:
      "KKCC is ready to continue when your connection returns. Some recently opened pages and app files may still work from cache.",
    offline_retry_label: "Try again",
  },
};

function publicClient() {
  const config = getSupabasePublicConfig();
  if (!config) return getSandboxPreviewClient();

  return createClient<Database>(config.url, config.publishableKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: createSupabaseFetch(config.publishableKey),
    },
  });
}

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function withTextFallbacks(value: UiTextSettings): UiTextSettings {
  return {
    auth: Object.fromEntries(
      Object.entries(DEFAULT_UI_TEXT.auth).map(([key, fallback]) => {
        const next = value.auth[key as keyof UiTextSettings["auth"]];
        return [key, next.trim() || fallback];
      }),
    ) as UiTextSettings["auth"],
    dashboard: Object.fromEntries(
      Object.entries(DEFAULT_UI_TEXT.dashboard).map(([key, fallback]) => {
        const next = value.dashboard[key as keyof UiTextSettings["dashboard"]];
        return [key, next.trim() || fallback];
      }),
    ) as UiTextSettings["dashboard"],
    system: Object.fromEntries(
      Object.entries(DEFAULT_UI_TEXT.system).map(([key, fallback]) => {
        const next = value.system[key as keyof UiTextSettings["system"]];
        return [key, next.trim() || fallback];
      }),
    ) as UiTextSettings["system"],
  };
}

function mergeUiText(value: Partial<UiTextSettings> | null | undefined): UiTextSettings {
  return withTextFallbacks({
    ...DEFAULT_UI_TEXT,
    ...value,
    auth: { ...DEFAULT_UI_TEXT.auth, ...value?.auth },
    dashboard: { ...DEFAULT_UI_TEXT.dashboard, ...value?.dashboard },
    system: { ...DEFAULT_UI_TEXT.system, ...value?.system },
  });
}

function parseUiText(value: string | null | undefined): UiTextSettings {
  if (!value) return DEFAULT_UI_TEXT;
  try {
    const parsed = JSON.parse(value) as Partial<UiTextSettings>;
    return withTextFallbacks(uiTextSchema.parse(mergeUiText(parsed)));
  } catch (error) {
    console.warn("[ui-text] invalid saved text; falling back to defaults", error);
    return DEFAULT_UI_TEXT;
  }
}

async function readUiText(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .eq("key", UI_TEXT_KEY)
    .maybeSingle();
  if (error) {
    console.warn("[ui-text] read failed; falling back to defaults", error.message);
    return DEFAULT_UI_TEXT;
  }
  return parseUiText(data?.value);
}

export const getPublicUiText = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = publicClient();
    if (!supabase) return DEFAULT_UI_TEXT;
    return await readUiText(supabase);
  } catch (error) {
    console.warn("[ui-text] public read failed", error);
    return DEFAULT_UI_TEXT;
  }
});

export const getAdminUiText = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    return readUiText(context.supabase);
  });

export const saveAdminUiText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => uiTextSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const safeData = sanitiseUiText(data);
    const { error } = await context.supabase.from("site_settings").upsert(
      {
        key: UI_TEXT_KEY,
        value: JSON.stringify(safeData),
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "key" },
    );
    if (error) throw new Error(error.message);
    return safeData;
  });

export function sanitiseUiText(value: UiTextSettings): UiTextSettings {
  return withTextFallbacks(uiTextSchema.parse(mergeUiText(value)));
}
