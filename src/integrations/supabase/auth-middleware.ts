import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { DB as Database } from "./db";
import { getSupabasePublicConfig } from "./env";
import { createSupabaseFetch } from "./fetch";
import { createSandboxSupabaseClient } from "./sandbox-database";
import {
  isSandboxPreviewAvailable,
  SANDBOX_ADMIN_BEARER,
  SANDBOX_ADMIN_ID,
  SANDBOX_ADMIN_USER,
} from "./sandbox";

export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();

    if (!request?.headers) {
      throw new Error("Unauthorized: No request headers available");
    }

    const authHeader = request.headers.get("authorization");

    if (
      import.meta.env.DEV &&
      isSandboxPreviewAvailable() &&
      authHeader === `Bearer ${SANDBOX_ADMIN_BEARER}`
    ) {
      return next({
        context: {
          supabase: createSandboxSupabaseClient(),
          userId: SANDBOX_ADMIN_ID,
          claims: {
            sub: SANDBOX_ADMIN_ID,
            aud: "authenticated",
            role: "authenticated",
            email: SANDBOX_ADMIN_USER.email,
          },
        },
      });
    }

    const config = getSupabasePublicConfig();
    if (!config) throw new Error("Supabase is not configured for this server request.");
    const { url, publishableKey } = config;

    if (!authHeader) {
      throw new Error("Unauthorized: No authorization header provided");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Only Bearer tokens are supported");
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    if (token.split(".").length !== 3) {
      throw new Error("Unauthorized: Invalid token");
    }

    const supabase = createClient<Database>(url, publishableKey, {
      global: {
        fetch: createSupabaseFetch(publishableKey),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims) {
      throw new Error("Unauthorized: Invalid token");
    }

    if (!data.claims.sub) {
      throw new Error("Unauthorized: No user ID found in token");
    }

    try {
      const { data: blocked } = await supabase.rpc("is_user_blocked", {
        _user_id: data.claims.sub,
      });
      if (blocked) {
        throw new Error("Account blocked by admin. Contact KKCC support to restore access.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.toLowerCase().includes("account blocked")) throw error;
      // Fresh projects without the latest SQL should not lose all auth. The UI still asks admins to run migrations.
      console.warn("[auth] block-status check skipped", message);
    }

    const claims = {
      sub: data.claims.sub,
      aud:
        typeof data.claims.aud === "string"
          ? data.claims.aud
          : (data.claims.aud?.[0] ?? "authenticated"),
      role: typeof data.claims.role === "string" ? data.claims.role : "authenticated",
      email: typeof data.claims.email === "string" ? data.claims.email : undefined,
    };

    return next({
      context: {
        supabase,
        userId: data.claims.sub,
        claims,
      },
    });
  },
);
