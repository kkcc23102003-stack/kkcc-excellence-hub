import type { SupabaseClient } from "@supabase/supabase-js";
import type { DB as Database } from "./db";
import { createSandboxSupabaseClient } from "./sandbox-database";
import { isSandboxPreviewAvailable } from "./sandbox";

/**
 * Shared dev-only client for public reads that should reflect local admin
 * edits. It is deliberately unavailable in production and in any development
 * environment connected to a real Supabase project.
 */
export function getSandboxPreviewClient(): SupabaseClient<Database> | null {
  if (!import.meta.env.DEV || !isSandboxPreviewAvailable()) return null;
  return createSandboxSupabaseClient();
}
