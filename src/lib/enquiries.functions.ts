import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { getSandboxPreviewClient } from "@/integrations/supabase/sandbox-client";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

function publicClient() {
  const config = getSupabasePublicConfig();
  if (!config) return getSandboxPreviewClient();

  return createClient<Database>(config.url, config.publishableKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: createSupabaseFetch(config.publishableKey) },
  });
}

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).default(""),
  class_level: z.string().trim().max(80).default(""),
  interest: z.string().trim().max(120).default(""),
  message: z.string().trim().min(10).max(2000),
  source: z.string().trim().max(80).default("support"),
});

const updateEnquirySchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "admitted", "closed", "spam"]),
  priority: z.enum(["low", "normal", "high"]),
  admin_note: z.string().trim().max(4000).default(""),
  mark_contacted: z.boolean().default(false),
});

export const submitAdmissionEnquiry = createServerFn({ method: "POST" })
  .validator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    if (!supabase) throw new Error("Supabase is not configured yet.");

    const { error } = await supabase.from("admission_enquiries").insert({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      class_level: data.class_level,
      interest: data.interest,
      message: data.message,
      source: data.source,
      status: "new",
      priority: data.message.toLowerCase().includes("urgent") ? "high" : "normal",
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("admission_enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => updateEnquirySchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = Object.fromEntries(
      Object.entries({
        status: data.status,
        priority: data.priority,
        admin_note: data.admin_note,
        last_contacted_at: data.mark_contacted ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString(),
      }).filter(([, value]) => value !== undefined),
    );
    const { data: row, error } = await context.supabase
      .from("admission_enquiries")
      .update(payload as never)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("admission_enquiries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
