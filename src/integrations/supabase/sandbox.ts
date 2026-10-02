import type { User } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./env";

export const SANDBOX_ADMIN_SESSION_KEY = "kkcc-sandbox-admin-preview";
export const SANDBOX_ADMIN_BEARER = "kkcc-sandbox-preview-only";
export const SANDBOX_ADMIN_ID = "00000000-0000-4000-8000-000000000001";

export const SANDBOX_ADMIN_USER: User = {
  id: SANDBOX_ADMIN_ID,
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: { name: "Sandbox Admin" },
  aud: "authenticated",
  role: "authenticated",
  email: "sandbox-admin@preview.invalid",
  created_at: "2026-10-02T00:00:00.000Z",
  is_anonymous: false,
};

/**
 * A preview-only admin session is available only on the Vite development
 * server, and only when no Supabase project is configured. Production builds
 * and real Supabase-connected development always use normal authentication.
 */
export function isSandboxPreviewAvailable(): boolean {
  return import.meta.env.DEV && !getSupabasePublicConfig();
}

export function isSandboxAdminSession(): boolean {
  if (!isSandboxPreviewAvailable() || typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SANDBOX_ADMIN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function activateSandboxAdminSession(): boolean {
  if (!isSandboxPreviewAvailable() || typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(SANDBOX_ADMIN_SESSION_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function clearSandboxAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SANDBOX_ADMIN_SESSION_KEY);
  } catch {
    // A blocked local-storage implementation simply ends the in-memory session.
  }
}
