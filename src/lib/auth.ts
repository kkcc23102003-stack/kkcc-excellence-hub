import type { AuthError, User } from "@supabase/supabase-js";

export type StudentProfileInput = {
  full_name: string;
  mobile: string;
  class_level: string;
  target_exam: string;
};

export function friendlyAuthError(error: AuthError | Error | null | undefined): string {
  const message = error?.message ?? "Something went wrong. Please try again.";
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email or password is incorrect. Check your details and try again.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please check your email inbox, confirm your account, then log in.";
  }

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "An account already exists with this email. Log in or use password reset.";
  }

  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Too many attempts. Please try again after a few minutes.";
  }

  if (
    normalized.includes("fetch") ||
    normalized.includes("network") ||
    normalized.includes("failed")
  ) {
    return "App connection is not available. Check your internet and app backend settings.";
  }

  return message;
}

export function safeRedirectPath(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || !value.trim()) return fallback;

  try {
    const raw = value.trim();
    const url = new URL(
      raw,
      typeof window === "undefined" ? "https://kkcc.local" : window.location.origin,
    );

    if (raw.startsWith("//")) return fallback;
    if (
      raw.startsWith("http") &&
      typeof window !== "undefined" &&
      url.origin !== window.location.origin
    ) {
      return fallback;
    }

    if (!url.pathname.startsWith("/") || url.pathname.startsWith("//")) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function displayNameFromUser(user: User | null | undefined): string {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;
  const fullName = metadata?.["full_name"];
  const name = metadata?.["name"];
  return (
    (typeof fullName === "string" && fullName.trim()) ||
    (typeof name === "string" && name.trim()) ||
    user?.email?.split("@")[0] ||
    "Student"
  );
}

export function profileFromUser(user: User): StudentProfileInput {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const value = (key: string) => {
    const raw = metadata?.[key];
    return typeof raw === "string" ? raw : "";
  };

  return {
    full_name: value("full_name") || displayNameFromUser(user),
    mobile: value("mobile"),
    class_level: value("class_level"),
    target_exam: value("target_exam"),
  };
}
