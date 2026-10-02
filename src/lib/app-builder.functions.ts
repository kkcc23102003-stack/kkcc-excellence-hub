import { projectContent } from "@/lib/project-content.server";
import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

const APP_BUILDER_KEY = "app_builder_json";

const appBuilderSchema = z.object({
  enabled: z.boolean().default(true),
  feature_prompt: z.string().trim().max(5000).default(""),
  custom_css: z.string().max(12000).default(""),
  top_html: z.string().max(12000).default(""),
  bottom_html: z.string().max(12000).default(""),
  custom_js: z.string().max(12000).default(""),
  updated_note: z.string().trim().max(500).default(""),
});

export type AppBuilderSettings = z.infer<typeof appBuilderSchema>;

export const DEFAULT_APP_BUILDER_SETTINGS: AppBuilderSettings = {
  enabled: true,
  feature_prompt: "",
  custom_css: "",
  top_html: "",
  bottom_html: "",
  custom_js: "",
  updated_note: "",
};

function publicClient() {
  return projectContent as unknown as SupabaseClient<Database>;
}

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function parseSettings(value: string | null | undefined): AppBuilderSettings {
  if (!value) return DEFAULT_APP_BUILDER_SETTINGS;
  try {
    return appBuilderSchema.parse(JSON.parse(value));
  } catch (error) {
    console.warn("[app-builder] invalid saved settings; using defaults", error);
    return DEFAULT_APP_BUILDER_SETTINGS;
  }
}

async function readAppBuilderSettings(supabase: SupabaseClient<Database>) {
  const { data, error } = await projectContent
    .from("site_settings")
    .select("key, value")
    .eq("key", APP_BUILDER_KEY)
    .maybeSingle();
  if (error) {
    console.warn("[app-builder] read failed; using defaults", error.message);
    return DEFAULT_APP_BUILDER_SETTINGS;
  }
  return parseSettings(data?.value);
}

export const getPublicAppBuilderSettings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = publicClient();
    if (!supabase) return DEFAULT_APP_BUILDER_SETTINGS;
    return await readAppBuilderSettings(supabase);
  } catch (error) {
    console.warn("[app-builder] public read failed", error);
    return DEFAULT_APP_BUILDER_SETTINGS;
  }
});

export const getAdminAppBuilderSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    return readAppBuilderSettings(context.supabase);
  });

export const saveAdminAppBuilderSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => appBuilderSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await projectContent.from("site_settings").upsert(
      {
        key: APP_BUILDER_KEY,
        value: JSON.stringify(data),
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "key" },
    );
    if (error) throw new Error(error.message);
    return data;
  });
