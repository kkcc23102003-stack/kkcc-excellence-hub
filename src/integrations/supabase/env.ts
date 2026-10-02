export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
  projectId?: string;
};

type RuntimeEnv = Record<string, string | undefined>;

declare const __PUBLIC_SUPABASE_URL__: string | undefined;
declare const __PUBLIC_SUPABASE_PUBLISHABLE_KEY__: string | undefined;
declare const __PUBLIC_SUPABASE_PROJECT_ID__: string | undefined;

const PLACEHOLDER_PARTS = [
  "your-project-ref",
  "your-publishable-key",
  "your-anon-key",
  "replace-with",
  "example.supabase.co",
];

function importMetaEnv(): RuntimeEnv {
  return ((import.meta as ImportMeta & { env?: RuntimeEnv }).env ?? {}) as RuntimeEnv;
}

function processEnv(): RuntimeEnv {
  const maybeProcess = (globalThis as typeof globalThis & { process?: { env?: RuntimeEnv } })
    .process;
  return maybeProcess?.env ?? {};
}

function definedConstant(value: string | undefined): string | undefined {
  return clean(value);
}

function definedSupabaseUrl(): string | undefined {
  return typeof __PUBLIC_SUPABASE_URL__ === "undefined" ? undefined : __PUBLIC_SUPABASE_URL__;
}

function definedSupabasePublishableKey(): string | undefined {
  return typeof __PUBLIC_SUPABASE_PUBLISHABLE_KEY__ === "undefined"
    ? undefined
    : __PUBLIC_SUPABASE_PUBLISHABLE_KEY__;
}

function definedSupabaseProjectId(): string | undefined {
  return typeof __PUBLIC_SUPABASE_PROJECT_ID__ === "undefined"
    ? undefined
    : __PUBLIC_SUPABASE_PROJECT_ID__;
}

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/^['"]|['"]$/g, "");
  return trimmed ? trimmed : undefined;
}

function envValue(keys: string[], constant?: string | undefined): string | undefined {
  const constantValue = definedConstant(constant);
  if (constantValue) return constantValue;

  const viteEnv = importMetaEnv();
  const nodeEnv = processEnv();

  for (const key of keys) {
    const value = clean(viteEnv[key]) ?? clean(nodeEnv[key]);
    if (value) return value;
  }

  return undefined;
}

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const normalized = value.toLowerCase();
  return PLACEHOLDER_PARTS.some((part) => normalized.includes(part));
}

function isValidSupabaseUrl(value: string | undefined): boolean {
  if (isPlaceholder(value)) return false;
  try {
    const url = new URL(value!);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = envValue(
    ["VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"],
    definedSupabaseUrl(),
  );
  const publishableKey = envValue(
    [
      "VITE_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "SUPABASE_PUBLISHABLE_KEY",
      "VITE_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_ANON_KEY",
    ],
    definedSupabasePublishableKey(),
  );
  const projectId = envValue(
    ["VITE_SUPABASE_PROJECT_ID", "NEXT_PUBLIC_SUPABASE_PROJECT_ID", "SUPABASE_PROJECT_ID"],
    definedSupabaseProjectId(),
  );

  if (!isValidSupabaseUrl(url) || isPlaceholder(publishableKey)) return null;

  return {
    url: url!,
    publishableKey: publishableKey!,
    ...(projectId && !isPlaceholder(projectId) ? { projectId } : {}),
  };
}

export function getSupabasePublicConfigOrThrow(): SupabasePublicConfig {
  const config = getSupabasePublicConfig();
  if (config) return config;

  throw new Error(
    "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (NEXT_PUBLIC_* and SUPABASE_* aliases are also supported) for this app.",
  );
}

export function getSupabaseConnectionStatus() {
  const config = getSupabasePublicConfig();
  return {
    configured: !!config,
    missing: config ? [] : ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"],
    help: "Add your Supabase project URL and publishable/anon key to the deployment environment (VITE_, NEXT_PUBLIC_, or SUPABASE_ aliases), then rebuild/restart the app.",
  };
}
