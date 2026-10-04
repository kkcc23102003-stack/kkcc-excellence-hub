import { projectContent } from "@/lib/project-content.server";
import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database, PrivateSettingRow, SiteSettingRow } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

const OWNER_EMAIL = "kkcc23102003@gmail.com";

const publicSettingKeys = [
  "payment_provider",
  "payment_enabled",
  "payment_mode",
  "razorpay_key_id",
  "offline_payment_instructions",
  "storage_provider",
  "storage_bucket",
  "storage_region",
  "storage_endpoint",
  "storage_public_base_url",
  "storage_migration_status",
] as const;

type PublicSettingKey = (typeof publicSettingKeys)[number];

function publicClient() {
  return projectContent as unknown as SupabaseClient<Database>;
}

const DEFAULT_SETTINGS: Record<PublicSettingKey, string> = {
  payment_provider: "razorpay",
  payment_enabled: "false",
  payment_mode: "test",
  razorpay_key_id: "",
  offline_payment_instructions:
    "Use the KKCC inquiry flow for UPI, cash or bank-transfer access. Course access is activated after the KKCC team confirms the payment.",
  storage_provider: "supabase",
  storage_bucket: "course-content",
  storage_region: "",
  storage_endpoint: "",
  storage_public_base_url: "",
  storage_migration_status: "idle",
};

const PRIVATE_SECRET_KEYS = [
  "razorpay_key_secret",
  "razorpay_webhook_secret",
  "storage_access_key_id",
  "storage_secret_access_key",
  "storage_application_key_id",
  "storage_application_key",
] as const;

type PrivateSecretKey = (typeof PRIVATE_SECRET_KEYS)[number];

const providerSchema = z.enum([
  "supabase",
  "cloudflare_r2",
  "aws_s3",
  "backblaze_b2",
  "wasabi",
  "external_url",
]);

const paymentSchema = z.object({
  enabled: z.boolean(),
  provider: z.literal("razorpay"),
  mode: z.enum(["test", "live"]),
  razorpay_key_id: z.string().trim().max(200),
  razorpay_key_secret: z.string().trim().max(500).optional(),
  razorpay_webhook_secret: z.string().trim().max(500).optional(),
  offline_payment_instructions: z.string().trim().max(1500),
});

const storageSchema = z.object({
  provider: providerSchema,
  bucket: z.string().trim().max(180),
  region: z.string().trim().max(120).optional().default(""),
  endpoint: z.string().trim().max(500).optional().default(""),
  public_base_url: z.string().trim().max(600).optional().default(""),
  migration_status: z.enum(["idle", "planned", "running", "paused", "complete"]).default("idle"),
  access_key_id: z.string().trim().max(500).optional(),
  secret_access_key: z.string().trim().max(500).optional(),
  application_key_id: z.string().trim().max(500).optional(),
  application_key: z.string().trim().max(500).optional(),
});

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function normalizeSettings(rows: SiteSettingRow[] | null | undefined) {
  const settings: Record<PublicSettingKey, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows ?? []) {
    if (publicSettingKeys.includes(row.key as PublicSettingKey)) {
      settings[row.key as PublicSettingKey] = row.value ?? "";
    }
  }
  return settings;
}

async function readPublicSettings(supabase: SupabaseClient<Database>) {
  const { data, error } = await projectContent
    .from("site_settings")
    .select("*")
    .in("key", [...publicSettingKeys]);

  if (error) {
    console.warn("[settings] Falling back to defaults", error.message);
    return { ...DEFAULT_SETTINGS };
  }

  return normalizeSettings(data);
}

async function upsertPublicSettings(
  supabase: SupabaseClient<Database>,
  entries: Partial<Record<PublicSettingKey, string>>,
) {
  const rows = Object.entries(entries).map(([key, value]) => ({ key, value: value ?? "" }));
  if (!rows.length) return;
  const { error } = await projectContent.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

async function upsertPrivateSettings(
  supabase: SupabaseClient<Database>,
  userId: string,
  entries: Partial<Record<PrivateSecretKey, string | undefined>>,
) {
  const rows = Object.entries(entries)
    .filter(([, value]) => value != null && value.trim().length > 0)
    .map(([key, value]) => ({ key, value: value!.trim(), updated_by: userId }));

  if (!rows.length) return;
  const { error } = await projectContent
    .from("private_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

async function readPrivateStatuses(supabase: SupabaseClient<Database>) {
  const { data, error } = await projectContent
    .from("private_settings")
    .select("key, value, updated_by, created_at, updated_at")
    .in("key", [...PRIVATE_SECRET_KEYS]);

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Pick<PrivateSettingRow, "key" | "value" | "updated_at">[];
  return Object.fromEntries(
    PRIVATE_SECRET_KEYS.map((key) => {
      const row = rows.find((item) => item.key === key);
      return [
        key,
        {
          configured: Boolean(row?.value),
          updated_at: row?.updated_at ?? null,
        },
      ];
    }),
  ) as Record<PrivateSecretKey, { configured: boolean; updated_at: string | null }>;
}

export const EMPTY_PUBLIC_PAYMENT_SETTINGS = {
  enabled: false,
  provider: "razorpay",
  mode: "test" as "test" | "live",
  razorpay_key_id: "",
  offline_payment_instructions: DEFAULT_SETTINGS.offline_payment_instructions,
};

export const getPublicPaymentSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const settings = supabase ? await readPublicSettings(supabase) : { ...DEFAULT_SETTINGS };
  const keyId = (settings.razorpay_key_id ?? "").trim();
  const isEnabled = Boolean(keyId) && settings.payment_enabled !== "disabled_manual";
  const detectedMode =
    settings.payment_mode === "live" || keyId.startsWith("rzp_live_") ? "live" : "test";
  return {
    enabled: isEnabled,
    provider: settings.payment_provider || "razorpay",
    mode: detectedMode as "test" | "live",
    razorpay_key_id: keyId,
    offline_payment_instructions: settings.offline_payment_instructions,
  };
});

export const getAdminPaymentSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [settings, privateStatuses] = await Promise.all([
      readPublicSettings(context.supabase),
      readPrivateStatuses(context.supabase),
    ]);
    const keyId = (settings.razorpay_key_id ?? "").trim();
    const isEnabled = Boolean(keyId) && settings.payment_enabled !== "disabled_manual";
    const detectedMode =
      settings.payment_mode === "live" || keyId.startsWith("rzp_live_") ? "live" : "test";

    return {
      owner_email: OWNER_EMAIL,
      enabled: isEnabled,
      provider: (settings.payment_provider || "razorpay") as "razorpay",
      mode: detectedMode as "test" | "live",
      razorpay_key_id: keyId,
      offline_payment_instructions: settings.offline_payment_instructions,
      secrets: {
        razorpay_key_secret: privateStatuses.razorpay_key_secret,
        razorpay_webhook_secret: privateStatuses.razorpay_webhook_secret,
      },
    };
  });

export const saveAdminPaymentSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => paymentSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const prevSettings = await readPublicSettings(context.supabase);
    const keyId = data.razorpay_key_id.trim();
    const keyJustAddedOrChanged = keyId.length > 0 && prevSettings.razorpay_key_id.trim() !== keyId;
    const effectiveEnabled = keyId.length > 0 && (data.enabled || keyJustAddedOrChanged);
    const effectiveMode: "test" | "live" = keyId.startsWith("rzp_live_")
      ? "live"
      : keyId.startsWith("rzp_test_")
        ? "test"
        : data.mode;

    await upsertPublicSettings(context.supabase, {
      payment_provider: data.provider,
      payment_enabled: !keyId ? "false" : effectiveEnabled ? "true" : "disabled_manual",
      payment_mode: effectiveMode,
      razorpay_key_id: keyId,
      offline_payment_instructions: data.offline_payment_instructions,
    });
    await upsertPrivateSettings(context.supabase, context.userId, {
      razorpay_key_secret: data.razorpay_key_secret,
      razorpay_webhook_secret: data.razorpay_webhook_secret,
    });
    const privateStatuses = await readPrivateStatuses(context.supabase);
    return {
      owner_email: OWNER_EMAIL,
      enabled: effectiveEnabled,
      provider: data.provider,
      mode: effectiveMode,
      razorpay_key_id: keyId,
      offline_payment_instructions: data.offline_payment_instructions,
      secrets: {
        razorpay_key_secret: privateStatuses.razorpay_key_secret,
        razorpay_webhook_secret: privateStatuses.razorpay_webhook_secret,
      },
    };
  });

export const getPublicStorageSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const settings = supabase ? await readPublicSettings(supabase) : { ...DEFAULT_SETTINGS };
  return {
    provider: settings.storage_provider || "supabase",
    bucket: settings.storage_bucket || "course-content",
    region: settings.storage_region,
    endpoint: settings.storage_endpoint,
    public_base_url: settings.storage_public_base_url,
    migration_status: settings.storage_migration_status || "idle",
  };
});

export const getAdminStorageSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [settings, privateStatuses] = await Promise.all([
      readPublicSettings(context.supabase),
      readPrivateStatuses(context.supabase),
    ]);

    return {
      provider: settings.storage_provider,
      bucket: settings.storage_bucket,
      region: settings.storage_region,
      endpoint: settings.storage_endpoint,
      public_base_url: settings.storage_public_base_url,
      migration_status: settings.storage_migration_status,
      secrets: {
        storage_access_key_id: privateStatuses.storage_access_key_id,
        storage_secret_access_key: privateStatuses.storage_secret_access_key,
        storage_application_key_id: privateStatuses.storage_application_key_id,
        storage_application_key: privateStatuses.storage_application_key,
      },
    };
  });

export const saveAdminStorageSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => storageSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    await upsertPublicSettings(context.supabase, {
      storage_provider: data.provider,
      storage_bucket: data.bucket || "course-content",
      storage_region: data.region,
      storage_endpoint: data.endpoint,
      storage_public_base_url: data.public_base_url,
      storage_migration_status: data.migration_status,
    });
    await upsertPrivateSettings(context.supabase, context.userId, {
      storage_access_key_id: data.access_key_id,
      storage_secret_access_key: data.secret_access_key,
      storage_application_key_id: data.application_key_id,
      storage_application_key: data.application_key,
    });
    const privateStatuses = await readPrivateStatuses(context.supabase);
    return {
      provider: data.provider,
      bucket: data.bucket || "course-content",
      region: data.region,
      endpoint: data.endpoint,
      public_base_url: data.public_base_url,
      migration_status: data.migration_status,
      secrets: {
        storage_access_key_id: privateStatuses.storage_access_key_id,
        storage_secret_access_key: privateStatuses.storage_secret_access_key,
        storage_application_key_id: privateStatuses.storage_application_key_id,
        storage_application_key: privateStatuses.storage_application_key,
      },
    };
  });
