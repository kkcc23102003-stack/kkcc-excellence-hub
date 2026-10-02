import { projectContent } from "@/lib/project-content.server";
import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";
import {
  KITTU_EXAM_TRACKS,
  KITTU_PRACTICE_MODES,
  KITTU_SUBJECT_TOPICS,
  type KittuPracticeBatch,
} from "@/lib/kittu-batch-catalog";
export type { KittuPracticeBatch } from "@/lib/kittu-batch-catalog";

const CONTROL_KEYS = [
  "app_maintenance_mode",
  "app_maintenance_message",
  "security_protection_enabled",
  "security_copy_guard_enabled",
  "security_context_menu_guard_enabled",
  "security_shortcut_guard_enabled",
  "security_watermark_enabled",
  "security_screenshot_blur_enabled",
  "security_print_guard_enabled",
  "feature_kittu_quiz_enabled",
  "feature_test_series_enabled",
  "feature_study_material_enabled",
  "kittu_daily_reward_cap",
  "kittu_daily_practice_hours",
  "kittu_daily_gift",
  "kittu_practice_batches",
] as const;

type ControlKey = (typeof CONTROL_KEYS)[number];

export type PublicKittuRewardControls = {
  dailyRewardCap: number;
  dailyPracticeHours: number;
  dailyGift: number;
  correctReward: number;
  wrongReward: number;
};

export type PublicAppControls = {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  protectionEnabled: boolean;
  copyGuardEnabled: boolean;
  contextMenuGuardEnabled: boolean;
  shortcutGuardEnabled: boolean;
  watermarkEnabled: boolean;
  screenshotBlurEnabled: boolean;
  printGuardEnabled: boolean;
  kittuQuizEnabled: boolean;
  testSeriesEnabled: boolean;
  studyMaterialEnabled: boolean;
  kittuRewards: PublicKittuRewardControls;
  kittuPracticeBatches: KittuPracticeBatch[];
};

export type AdminSystemHealthRow = {
  area: string;
  label: string;
  value: string;
};

export const DEFAULT_APP_CONTROLS: PublicAppControls = {
  maintenanceMode: false,
  maintenanceMessage:
    "KKCC learning services are temporarily being refreshed. Please check back shortly.",
  protectionEnabled: true,
  copyGuardEnabled: true,
  contextMenuGuardEnabled: true,
  shortcutGuardEnabled: true,
  watermarkEnabled: true,
  screenshotBlurEnabled: true,
  printGuardEnabled: true,
  kittuQuizEnabled: true,
  testSeriesEnabled: true,
  studyMaterialEnabled: true,
  kittuRewards: {
    dailyRewardCap: 160,
    dailyPracticeHours: 8,
    dailyGift: 5,
    correctReward: 160 / (8 * 60),
    wrongReward: 160 / (8 * 60 * 10),
  },
  kittuPracticeBatches: [],
};

const DEFAULT_RECORD: Record<ControlKey, string> = {
  app_maintenance_mode: "false",
  app_maintenance_message: DEFAULT_APP_CONTROLS.maintenanceMessage,
  security_protection_enabled: "true",
  security_copy_guard_enabled: "true",
  security_context_menu_guard_enabled: "true",
  security_shortcut_guard_enabled: "true",
  security_watermark_enabled: "true",
  security_screenshot_blur_enabled: "true",
  security_print_guard_enabled: "true",
  feature_kittu_quiz_enabled: "true",
  feature_test_series_enabled: "true",
  feature_study_material_enabled: "true",
  kittu_daily_reward_cap: "160",
  kittu_daily_practice_hours: "8",
  kittu_daily_gift: "5",
  kittu_practice_batches: "[]",
};

const kittuPracticeBatchSchema = z.object({
  id: z.string().trim().min(4).max(80),
  label: z.string().trim().min(2).max(80),
  exam: z.string().trim().min(2).max(80),
  subject: z.string().trim().min(2).max(80),
  topic: z.string().trim().min(2).max(120),
  mode: z.enum(KITTU_PRACTICE_MODES),
  enabled: z.boolean(),
});

const appControlsSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().trim().min(10).max(240),
  protectionEnabled: z.boolean(),
  copyGuardEnabled: z.boolean(),
  contextMenuGuardEnabled: z.boolean(),
  shortcutGuardEnabled: z.boolean(),
  watermarkEnabled: z.boolean(),
  screenshotBlurEnabled: z.boolean(),
  printGuardEnabled: z.boolean(),
  kittuQuizEnabled: z.boolean(),
  testSeriesEnabled: z.boolean(),
  studyMaterialEnabled: z.boolean(),
  kittuDailyRewardCap: z.number().int().min(20).max(1000),
  kittuDailyPracticeHours: z.number().min(1).max(24),
  kittuDailyGift: z.number().int().min(0).max(500),
  kittuPracticeBatches: z.array(kittuPracticeBatchSchema).max(20),
});

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

function boolSetting(value: string | undefined, fallback: boolean) {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function numberSetting(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeKittuPracticeBatches(input: unknown): KittuPracticeBatch[] {
  const parsed = z.array(kittuPracticeBatchSchema).max(20).safeParse(input);
  if (!parsed.success) return [];

  const examOptions = KITTU_EXAM_TRACKS as readonly string[];
  const modeOptions = KITTU_PRACTICE_MODES as readonly string[];
  const usedIds = new Set<string>();

  return parsed.data.slice(0, 20).map((batch, index) => {
    const exam = examOptions.includes(batch.exam) ? batch.exam : "Other Competitive Exam";
    const subject =
      batch.subject === "Mixed" || KITTU_SUBJECT_TOPICS[batch.subject] ? batch.subject : "Mixed";
    const topics = subject === "Mixed" ? [] : (KITTU_SUBJECT_TOPICS[subject] ?? []);
    const topic = batch.topic !== "Mixed" && topics.includes(batch.topic) ? batch.topic : "Mixed";
    const mode = modeOptions.includes(batch.mode)
      ? (batch.mode as KittuPracticeBatch["mode"])
      : "NCERT-based";
    const baseId = batch.id.trim() || `kittu-batch-${index + 1}`;
    const id = usedIds.has(baseId) ? `${baseId}-${index + 1}` : baseId;
    usedIds.add(id);

    return {
      id,
      label: batch.label.trim(),
      exam,
      subject,
      topic,
      mode,
      enabled: batch.enabled,
    };
  });
}

function parseKittuPracticeBatches(value: string | undefined): KittuPracticeBatch[] {
  if (!value) return [];
  try {
    return normalizeKittuPracticeBatches(JSON.parse(value));
  } catch {
    return [];
  }
}

function buildControls(record: Record<ControlKey, string>): PublicAppControls {
  const defaults = DEFAULT_APP_CONTROLS.kittuRewards;
  const dailyRewardCap = numberSetting(
    record.kittu_daily_reward_cap,
    defaults.dailyRewardCap,
    20,
    1000,
  );
  const dailyPracticeHours = numberSetting(
    record.kittu_daily_practice_hours,
    defaults.dailyPracticeHours,
    1,
    24,
  );
  const dailyGift = numberSetting(record.kittu_daily_gift, defaults.dailyGift, 0, 500);
  const correctReward = dailyRewardCap / (dailyPracticeHours * 60);
  const wrongReward = correctReward / 10;

  return {
    maintenanceMode: boolSetting(record.app_maintenance_mode, DEFAULT_APP_CONTROLS.maintenanceMode),
    maintenanceMessage:
      record.app_maintenance_message.trim() || DEFAULT_APP_CONTROLS.maintenanceMessage,
    protectionEnabled: boolSetting(
      record.security_protection_enabled,
      DEFAULT_APP_CONTROLS.protectionEnabled,
    ),
    copyGuardEnabled: boolSetting(
      record.security_copy_guard_enabled,
      DEFAULT_APP_CONTROLS.copyGuardEnabled,
    ),
    contextMenuGuardEnabled: boolSetting(
      record.security_context_menu_guard_enabled,
      DEFAULT_APP_CONTROLS.contextMenuGuardEnabled,
    ),
    shortcutGuardEnabled: boolSetting(
      record.security_shortcut_guard_enabled,
      DEFAULT_APP_CONTROLS.shortcutGuardEnabled,
    ),
    watermarkEnabled: boolSetting(
      record.security_watermark_enabled,
      DEFAULT_APP_CONTROLS.watermarkEnabled,
    ),
    screenshotBlurEnabled: boolSetting(
      record.security_screenshot_blur_enabled,
      DEFAULT_APP_CONTROLS.screenshotBlurEnabled,
    ),
    printGuardEnabled: boolSetting(
      record.security_print_guard_enabled,
      DEFAULT_APP_CONTROLS.printGuardEnabled,
    ),
    kittuQuizEnabled: boolSetting(
      record.feature_kittu_quiz_enabled,
      DEFAULT_APP_CONTROLS.kittuQuizEnabled,
    ),
    testSeriesEnabled: boolSetting(
      record.feature_test_series_enabled,
      DEFAULT_APP_CONTROLS.testSeriesEnabled,
    ),
    studyMaterialEnabled: boolSetting(
      record.feature_study_material_enabled,
      DEFAULT_APP_CONTROLS.studyMaterialEnabled,
    ),
    kittuRewards: {
      dailyRewardCap,
      dailyPracticeHours,
      dailyGift,
      correctReward,
      wrongReward,
    },
    kittuPracticeBatches: parseKittuPracticeBatches(record.kittu_practice_batches),
  };
}

async function readControls(supabase: SupabaseClient<Database>) {
  const { data, error } = await projectContent
    .from("site_settings")
    .select("key, value, created_at, updated_at")
    .in("key", [...CONTROL_KEYS]);

  if (error) throw new Error(error.message);

  const record: Record<ControlKey, string> = { ...DEFAULT_RECORD };
  for (const row of data ?? []) {
    if (CONTROL_KEYS.includes(row.key as ControlKey)) {
      record[row.key as ControlKey] = row.value ?? "";
    }
  }
  return buildControls(record);
}

async function upsertControls(
  supabase: SupabaseClient<Database>,
  entries: Partial<Record<ControlKey, string>>,
) {
  const rows = Object.entries(entries).map(([key, value]) => ({ key, value: value ?? "" }));
  if (!rows.length) return;
  const { error } = await projectContent.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

function toRecord(data: z.infer<typeof appControlsSchema>): Record<ControlKey, string> {
  return {
    app_maintenance_mode: String(data.maintenanceMode),
    app_maintenance_message: data.maintenanceMessage.trim(),
    security_protection_enabled: String(data.protectionEnabled),
    security_copy_guard_enabled: String(data.copyGuardEnabled),
    security_context_menu_guard_enabled: String(data.contextMenuGuardEnabled),
    security_shortcut_guard_enabled: String(data.shortcutGuardEnabled),
    security_watermark_enabled: String(data.watermarkEnabled),
    security_screenshot_blur_enabled: String(data.screenshotBlurEnabled),
    security_print_guard_enabled: String(data.printGuardEnabled),
    feature_kittu_quiz_enabled: String(data.kittuQuizEnabled),
    feature_test_series_enabled: String(data.testSeriesEnabled),
    feature_study_material_enabled: String(data.studyMaterialEnabled),
    kittu_daily_reward_cap: String(data.kittuDailyRewardCap),
    kittu_daily_practice_hours: String(data.kittuDailyPracticeHours),
    kittu_daily_gift: String(data.kittuDailyGift),
    kittu_practice_batches: JSON.stringify(
      normalizeKittuPracticeBatches(data.kittuPracticeBatches),
    ),
  };
}

export const getPublicAppControls = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  if (!supabase) return DEFAULT_APP_CONTROLS;

  try {
    return await readControls(supabase);
  } catch (error) {
    console.error("[app-controls] public controls fallback", error);
    return DEFAULT_APP_CONTROLS;
  }
});

export const getAdminAppControls = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    return readControls(context.supabase);
  });

export const saveAdminAppControls = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => appControlsSchema.parse(input))
  .handler(async ({ context, data }) => {
    if (data.kittuDailyGift > data.kittuDailyRewardCap) {
      throw new Error("Daily gift cannot be higher than the daily reward cap.");
    }
    await assertAdmin(context);
    await upsertControls(context.supabase, toRecord(data));
    return readControls(context.supabase);
  });

export const getAdminSystemHealth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    try {
      const { data, error } = await context.supabase.rpc("get_kkcc_admin_system_health");
      if (error) throw new Error(error.message);
      return {
        available: true,
        rows: (data ?? []) as AdminSystemHealthRow[],
      };
    } catch (error) {
      return {
        available: false,
        rows: [],
        message:
          error instanceof Error
            ? error.message
            : "Run the latest Supabase migration to enable admin system health metrics.",
      };
    }
  });
