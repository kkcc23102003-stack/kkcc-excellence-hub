import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

type NotificationWithRead = Database["public"]["Tables"]["notifications"]["Row"] & {
  is_read: boolean;
  read_at: string | null;
};

function publicClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  return createClient<Database>(config.url, config.publishableKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: createSupabaseFetch(config.publishableKey) },
  });
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[notifications] read failed", error);
    return fallback;
  }
}

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

const notificationSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(160),
  message: z.string().trim().min(2).max(4000),
  type: z.string().trim().max(40).default("announcement"),
  audience: z.enum(["all", "students", "admins", "course", "user"]).default("all"),
  course_id: z.string().uuid().nullable().optional(),
  target_user_id: z.string().uuid().nullable().optional(),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  action_label: z.string().trim().max(80).default(""),
  action_url: z.string().trim().max(1200).default(""),
  is_published: z.boolean().default(true),
  send_at: z.string().trim().nullable().optional(),
  expires_at: z.string().trim().nullable().optional(),
});

export const adminListNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => notificationSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      ...data,
      course_id: data.audience === "course" ? (data.course_id ?? null) : null,
      target_user_id: data.audience === "user" ? (data.target_user_id ?? null) : null,
      send_at: data.send_at || null,
      expires_at: data.expires_at || null,
      created_by: context.userId,
      updated_at: new Date().toISOString(),
    };

    const { id, ...rest } = payload;
    const { data: row, error } = id
      ? await context.supabase
          .from("notifications")
          .update(rest as never)
          .eq("id", id)
          .select("*")
          .single()
      : await context.supabase
          .from("notifications")
          .insert(rest as never)
          .select("*")
          .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("notifications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    safe<NotificationWithRead[]>(async () => {
      const now = new Date().toISOString();
      const [adminResult, enrollmentsResult, readsResult] = await Promise.all([
        context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
        context.supabase
          .from("course_enrollments")
          .select("course_id")
          .eq("user_id", context.userId),
        context.supabase
          .from("notification_reads")
          .select("notification_id, read_at")
          .eq("user_id", context.userId),
      ]);
      const isAdmin = Boolean(adminResult.data);
      const enrolledCourseIds = new Set((enrollmentsResult.data ?? []).map((row) => row.course_id));
      const reads = new Map(
        (readsResult.data ?? []).map((row) => [row.notification_id, row.read_at]),
      );

      const { data, error } = await context.supabase
        .from("notifications")
        .select("*")
        .eq("is_published", true)
        .or(`send_at.is.null,send_at.lte.${now}`)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw new Error(error.message);

      return (data ?? [])
        .filter((notification) => {
          if (notification.audience === "all" || notification.audience === "students") return true;
          if (notification.audience === "admins") return isAdmin;
          if (notification.audience === "course") {
            return Boolean(notification.course_id && enrolledCourseIds.has(notification.course_id));
          }
          if (notification.audience === "user")
            return notification.target_user_id === context.userId;
          return false;
        })
        .map((notification) => ({
          ...notification,
          is_read: reads.has(notification.id),
          read_at: reads.get(notification.id) ?? null,
        }));
    }, []),
  );

export const markNotificationRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("notification_reads").upsert(
      {
        notification_id: data.id,
        user_id: context.userId,
        read_at: new Date().toISOString(),
      } as never,
      { onConflict: "notification_id,user_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listPublicNotifications = createServerFn({ method: "GET" }).handler(async () =>
  safe(async () => {
    const supabase = publicClient();
    if (!supabase) return [];
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("is_published", true)
      .in("audience", ["all", "students"])
      .or(`send_at.is.null,send_at.lte.${now}`)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return data ?? [];
  }, []),
);
