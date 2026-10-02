import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { getSandboxPreviewClient } from "@/integrations/supabase/sandbox-client";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

export const SOCIAL_LINKS_KEY = "social_links_json";

export const SOCIAL_KEYS = [
  "social_youtube",
  "social_instagram",
  "social_facebook",
  "social_telegram",
  "social_whatsapp",
] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];
export type LegacySocialLinks = Record<SocialKey, string>;

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  social_youtube: "YouTube",
  social_instagram: "Instagram",
  social_facebook: "Facebook",
  social_telegram: "Telegram",
  social_whatsapp: "WhatsApp",
};

export const LEGACY_SOCIAL_IDS: Record<SocialKey, string> = {
  social_youtube: "youtube",
  social_instagram: "instagram",
  social_facebook: "facebook",
  social_telegram: "telegram",
  social_whatsapp: "whatsapp",
};

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
  sort_order: number;
};

export type SocialLinks = SocialLink[];

export const emptySocialLinks = (): SocialLinks =>
  SOCIAL_KEYS.map((key, index) => ({
    id: LEGACY_SOCIAL_IDS[key],
    label: SOCIAL_LABELS[key],
    url: "",
    enabled: true,
    sort_order: index + 1,
  }));

/** Accepts an empty string (not configured) or a valid http(s) URL. */
export const socialUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || /^https?:\/\/[^\s]+\.[^\s]+/i.test(v),
    "Enter a full URL starting with https://",
  );

const socialLinkSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1, "Label is required").max(80),
  url: socialUrlSchema,
  enabled: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(999).default(0),
});

const payloadSchema = z.array(socialLinkSchema).max(40);

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

function slugifyId(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return slug || fallback;
}

function normalizeLinks(links: SocialLink[]): SocialLink[] {
  const seen = new Set<string>();
  return links
    .map((link, index) => {
      const baseId = slugifyId(link.id || link.label, `social-${index + 1}`);
      let id = baseId;
      let suffix = 2;
      while (seen.has(id)) {
        id = `${baseId}-${suffix}`;
        suffix += 1;
      }
      seen.add(id);
      return {
        id,
        label: link.label.trim(),
        url: link.url.trim(),
        enabled: Boolean(link.enabled),
        sort_order: Number.isFinite(link.sort_order) ? link.sort_order : index + 1,
      };
    })
    .filter((link) => link.label.length > 0)
    .sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label));
}

function linksFromLegacy(rows: { key: string; value: string | null }[]) {
  const legacy: Record<string, string> = {};
  for (const row of rows) legacy[row.key] = row.value ?? "";
  return emptySocialLinks().map((link) => {
    const legacyKey = SOCIAL_KEYS.find((key) => LEGACY_SOCIAL_IDS[key] === link.id);
    return legacyKey ? { ...link, url: legacy[legacyKey] ?? "" } : link;
  });
}

function parseSocialLinks(rows: { key: string; value: string | null }[]): SocialLinks {
  const json = rows.find((row) => row.key === SOCIAL_LINKS_KEY)?.value;
  if (json) {
    try {
      const parsed = payloadSchema.parse(JSON.parse(json));
      return normalizeLinks(parsed);
    } catch (error) {
      console.warn("[settings] invalid custom social links; using legacy links", error);
    }
  }
  return normalizeLinks(linksFromLegacy(rows));
}

export const getSocialLinks = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = publicClient();
    if (!supabase) return emptySocialLinks();

    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [SOCIAL_LINKS_KEY, ...SOCIAL_KEYS] as unknown as string[]);
    return parseSocialLinks((data ?? []) as { key: string; value: string | null }[]);
  } catch (error) {
    console.error("[settings] social links read failed", error);
    return emptySocialLinks();
  }
});

export const saveSocialLinks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => payloadSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw new Error("Forbidden — admin access required");

    const links = normalizeLinks(data);
    const rows = [
      {
        key: SOCIAL_LINKS_KEY,
        value: JSON.stringify(links),
        updated_at: new Date().toISOString(),
      },
      ...SOCIAL_KEYS.map((key) => {
        const legacyId = LEGACY_SOCIAL_IDS[key];
        const match = links.find((link) => link.id === legacyId);
        return {
          key,
          value: match?.url ?? "",
          updated_at: new Date().toISOString(),
        };
      }),
    ];

    const { error } = await context.supabase
      .from("site_settings")
      .upsert(rows as never, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return links;
  });
