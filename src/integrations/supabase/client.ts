import { createClient } from "@supabase/supabase-js";
import type { DB as Database } from "./db";
import { getSupabasePublicConfig, getSupabasePublicConfigOrThrow } from "./env";
import { createSupabaseFetch } from "./fetch";

function createSupabaseClient() {
  const { url, publishableKey } = getSupabasePublicConfigOrThrow();

  return createClient<Database>(url, publishableKey, {
    global: {
      fetch: createSupabaseFetch(publishableKey),
    },
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export function isSupabaseConfigured(): boolean {
  return !!getSupabasePublicConfig();
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
