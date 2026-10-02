import { createMiddleware } from "@tanstack/react-start";
import { getSupabasePublicConfig } from "./env";
import { supabase } from "./client";
import { isSandboxAdminSession, SANDBOX_ADMIN_BEARER } from "./sandbox";

// Must be registered as a global `functionMiddleware` in `src/start.ts`; otherwise
// the browser never attaches the bearer token to serverFn RPCs.
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    if (typeof window === "undefined") return next();
    if (import.meta.env.DEV && isSandboxAdminSession()) {
      return next({ headers: { Authorization: `Bearer ${SANDBOX_ADMIN_BEARER}` } });
    }
    if (!getSupabasePublicConfig()) return next();

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      return next({
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (error) {
      console.error("[auth] Could not attach Supabase session", error);
      return next();
    }
  },
);
