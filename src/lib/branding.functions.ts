import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database, SiteSettingRow } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { getSandboxPreviewClient } from "@/integrations/supabase/sandbox-client";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";
import { BRAND } from "@/data/kkcc";

const BRANDING_KEYS = [
  "brand_app_name",
  "brand_short_name",
  "brand_tagline",
  "brand_logo_url",
  "brand_logo_alt",
  "brand_show_logo_text",
  "brand_primary_color",
  "brand_accent_color",
  "brand_background_color",
  "brand_foreground_color",
  "brand_hero_eyebrow",
  "brand_hero_title",
  "brand_hero_highlight",
  "brand_hero_description",
  "brand_cta_primary_label",
  "brand_cta_secondary_label",
] as const;

type BrandingKey = (typeof BRANDING_KEYS)[number];

type RawBranding = Record<BrandingKey, string>;

export type BrandingSettings = {
  app_name: string;
  short_name: string;
  tagline: string;
  logo_url: string;
  logo_alt: string;
  show_logo_text: boolean;
  primary_color: string;
  accent_color: string;
  background_color: string;
  foreground_color: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_highlight: string;
  hero_description: string;
  cta_primary_label: string;
  cta_secondary_label: string;
};

const DEFAULT_RAW_BRANDING: RawBranding = {
  brand_app_name: BRAND.name,
  brand_short_name: BRAND.short,
  brand_tagline: BRAND.tagline,
  brand_logo_url: "/logo.png",
  brand_logo_alt: `${BRAND.short} logo`,
  brand_show_logo_text: "true",
  brand_primary_color: "#18f4d6",
  brand_accent_color: "#f5d78e",
  brand_background_color: "#050605",
  brand_foreground_color: "#fff8e7",
  brand_hero_eyebrow: BRAND.tagline,
  brand_hero_title: "KKCC Excellence Hub — Study That Makes You Return.",
  brand_hero_highlight: "Learn with clarity. Practice with courage. Rise with confidence.",
  brand_hero_description:
    "KKCC turns lectures, notes, tests, and progress into a bright daily learning loop — so students know exactly what to open next and feel excited to continue.",
  brand_cta_primary_label: "Find My Next Win",
  brand_cta_secondary_label: "Continue Learning",
};

const LEGACY_HERO_HIGHLIGHTS = [
  "Neon Smart Learning for Bright Futures.",
  "Logo-Inspired UV Learning for Bright Futures.",
  "Learning That Builds Futures.",
  "KKCC Excellence Learning for Bright Futures.",
  "One focused session. One clear win. Every day.",
  "2 — Double Vision · 3 — Three Tiers: Courage, Patience, Victory · K — Knowledge · A — Action · A — Ambition · T — Trust",
  "23KAAT :– 2 — Double Vision (aim and reality) · 3 — Three Tiers: Courage, Patience, Victory · K — Knowledge · A — Action · A — Ambition · T — Trust",
  "23KAAT :– 2 — Double Vision ( aim and reality )· 3 — Three Tiers: Courage, Patience, Victory · K — Knowledge · A — Action · A — Ambition · T — Trust",
  [
    "23KAAT is the rule of success",
    "2 — Double Vision ( aim and reality )·",
    "3 — Three Tiers (Courage, Patience, Victory) ·",
    "K — Knowledge ·",
    "A — Action ·",
    "A — Ambition ·",
    "T — Trust",
  ].join("\n\n"),
];

export const DEFAULT_BRANDING: BrandingSettings = toBrandingSettings(DEFAULT_RAW_BRANDING);

const colorSchema = z
  .string()
  .trim()
  .max(20)
  .refine((value) => value === "" || /^#[0-9a-f]{6}$/i.test(value), {
    message: "Use a hex color like #18f4d6, or leave empty.",
  });

const urlSchema = z
  .string()
  .trim()
  .max(4000)
  .refine((value) => value === "" || /^https?:\/\/[^\s]+/i.test(value) || value.startsWith("/"), {
    message: "Use a full https:// URL, a site path like /favicon.png, or leave empty.",
  });

const brandingPayloadSchema = z.object({
  app_name: z.string().trim().max(140),
  short_name: z.string().trim().max(60),
  tagline: z.string().trim().max(220),
  logo_url: urlSchema,
  logo_alt: z.string().trim().max(160),
  show_logo_text: z.boolean(),
  primary_color: colorSchema,
  accent_color: colorSchema,
  background_color: colorSchema,
  foreground_color: colorSchema,
  hero_eyebrow: z.string().trim().max(220),
  hero_title: z.string().trim().max(180),
  hero_highlight: z.string().trim().max(180),
  hero_description: z.string().trim().max(700),
  cta_primary_label: z.string().trim().max(80),
  cta_secondary_label: z.string().trim().max(80),
});

function publicClient() {
  const config = getSupabasePublicConfig();
  if (!config) return getSandboxPreviewClient();

  return createClient<Database>(config.url, config.publishableKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: createSupabaseFetch(config.publishableKey),
    },
  });
}

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function normalizeRows(rows: SiteSettingRow[] | null | undefined): RawBranding {
  const settings: RawBranding = { ...DEFAULT_RAW_BRANDING };
  for (const row of rows ?? []) {
    if (BRANDING_KEYS.includes(row.key as BrandingKey)) {
      settings[row.key as BrandingKey] = row.value ?? "";
    }
  }
  return settings;
}

function toBrandingSettings(raw: RawBranding): BrandingSettings {
  return {
    app_name: raw.brand_app_name,
    short_name: raw.brand_short_name,
    tagline: raw.brand_tagline,
    logo_url: raw.brand_logo_url,
    logo_alt: raw.brand_logo_alt,
    show_logo_text: raw.brand_show_logo_text !== "false",
    primary_color: raw.brand_primary_color,
    accent_color: raw.brand_accent_color,
    background_color: raw.brand_background_color,
    foreground_color: raw.brand_foreground_color,
    hero_eyebrow: raw.brand_hero_eyebrow,
    hero_title: raw.brand_hero_title,
    hero_highlight: LEGACY_HERO_HIGHLIGHTS.includes(raw.brand_hero_highlight)
      ? DEFAULT_RAW_BRANDING.brand_hero_highlight
      : raw.brand_hero_highlight,
    hero_description: raw.brand_hero_description,
    cta_primary_label: raw.brand_cta_primary_label,
    cta_secondary_label: raw.brand_cta_secondary_label,
  };
}

function fromBrandingSettings(data: BrandingSettings): RawBranding {
  return {
    brand_app_name: data.app_name,
    brand_short_name: data.short_name,
    brand_tagline: data.tagline,
    brand_logo_url: data.logo_url,
    brand_logo_alt: data.logo_alt,
    brand_show_logo_text: String(data.show_logo_text),
    brand_primary_color: data.primary_color,
    brand_accent_color: data.accent_color,
    brand_background_color: data.background_color,
    brand_foreground_color: data.foreground_color,
    brand_hero_eyebrow: data.hero_eyebrow,
    brand_hero_title: data.hero_title,
    brand_hero_highlight: data.hero_highlight,
    brand_hero_description: data.hero_description,
    brand_cta_primary_label: data.cta_primary_label,
    brand_cta_secondary_label: data.cta_secondary_label,
  };
}

async function readBranding(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .in("key", [...BRANDING_KEYS]);

  if (error) {
    console.warn("[branding] Falling back to defaults", error.message);
    return DEFAULT_BRANDING;
  }

  return toBrandingSettings(normalizeRows(data));
}

export const getPublicBrandingSettings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = publicClient();
    if (!supabase) return DEFAULT_BRANDING;
    return await readBranding(supabase);
  } catch (error) {
    console.warn("[branding] public read failed", error);
    return DEFAULT_BRANDING;
  }
});

export const getAdminBrandingSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    return readBranding(context.supabase);
  });

export const saveAdminBrandingSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => brandingPayloadSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const raw = fromBrandingSettings(data);
    const rows = Object.entries(raw).map(([key, value]) => ({
      key,
      value: value ?? "",
      updated_at: new Date().toISOString(),
    }));
    const { error } = await context.supabase
      .from("site_settings")
      .upsert(rows as never, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return data;
  });
