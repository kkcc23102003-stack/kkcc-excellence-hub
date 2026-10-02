// Server-side Supabase client with service role key - bypasses RLS.
// Use this for admin operations in server functions and server routes only.
// For user-authenticated queries (with RLS), use the auth middleware instead.
import { createClient } from "@supabase/supabase-js";
import type { DB as Database } from "./db";
import { getSupabasePublicConfigOrThrow } from "./env";
import { createSupabaseFetch } from "./fetch";

function envValue(key: string): string | undefined {
  const maybeProcess = (
    globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }
  ).process;
  return maybeProcess?.env?.[key]?.trim() || undefined;
}

function createSupabaseAdminClient() {
  const { url } = getSupabasePublicConfigOrThrow();
  const serviceRoleKey = envValue("SUPABASE_SERVICE_ROLE_KEY");

  if (!serviceRoleKey) {
    throw new Error(
      "Missing Supabase environment variable: SUPABASE_SERVICE_ROLE_KEY. Set it only in the server environment.",
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    global: {
      fetch: createSupabaseFetch(serviceRoleKey),
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

// Server-side Supabase client with service role - bypasses RLS
// SECURITY: Only use this for trusted server-side operations, never expose to client code
// Load inside server handlers: const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
// Top-level import is safe only in other .server.ts modules - route files and *.functions.ts ship to the client bundle.
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
