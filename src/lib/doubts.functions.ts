import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";

type DoubtRow = Database["public"]["Tables"]["student_doubts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

async function insertNotificationSafe(
  context: { supabase: SupabaseClient<Database>; userId: string },
  payload: {
    title: string;
    message: string;
    type: string;
    audience: "admins" | "user";
    target_user_id?: string | null;
    action_label?: string;
    action_url?: string;
    priority?: "low" | "normal" | "high";
  },
) {
  try {
    const { error } = await context.supabase.from("notifications").insert({
      title: payload.title,
      message: payload.message,
      type: payload.type,
      audience: payload.audience,
      course_id: null,
      target_user_id: payload.target_user_id ?? null,
      priority: payload.priority ?? "normal",
      action_label: payload.action_label ?? "Open",
      action_url: payload.action_url ?? "",
      is_published: true,
      send_at: null,
      expires_at: null,
      created_by: context.userId,
    } as never);
    if (error) console.error("[doubts] notification failed", error.message);
  } catch (error) {
    console.error("[doubts] notification failed", error);
  }
}

const createDoubtSchema = z.object({
  course_id: z.string().uuid().nullable().optional(),
  subject: z.string().trim().min(2).max(80),
  title: z.string().trim().min(3).max(160),
  message: z.string().trim().min(8).max(6000),
  attachment_url: z.string().trim().max(4000).default(""),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
});

const replyDoubtSchema = z.object({
  id: z.string().uuid(),
  admin_reply: z.string().trim().min(2).max(8000),
  status: z.enum(["answered", "closed"]).default("answered"),
});

export const listMyDoubts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("student_doubts")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createDoubt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => createDoubtSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("student_doubts")
      .insert({
        user_id: context.userId,
        course_id: data.course_id ?? null,
        subject: data.subject,
        title: data.title,
        message: data.message,
        attachment_url: data.attachment_url,
        priority: data.priority,
        status: "open",
      } as never)
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await insertNotificationSafe(context, {
      title: `New doubt: ${data.title}`,
      message: data.message.slice(0, 240),
      type: "doubt",
      audience: "admins",
      action_label: "Reply now",
      action_url: "/admin/doubts",
      priority: data.priority,
    });

    return row;
  });

export const adminListDoubts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data: doubts, error } = await context.supabase
      .from("student_doubts")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    const rows = (doubts ?? []) as DoubtRow[];
    const userIds = [...new Set(rows.map((row) => row.user_id))];
    const courseIds = [...new Set(rows.map((row) => row.course_id).filter(Boolean) as string[])];

    const [{ data: profiles }, { data: courses }] = await Promise.all([
      userIds.length
        ? context.supabase.from("profiles").select("*").in("id", userIds)
        : Promise.resolve({ data: [] as ProfileRow[] }),
      courseIds.length
        ? context.supabase.from("courses").select("*").in("id", courseIds)
        : Promise.resolve({ data: [] as CourseRow[] }),
    ]);

    return {
      doubts: rows,
      profiles: profiles ?? [],
      courses: courses ?? [],
    };
  });

export const adminReplyDoubt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => replyDoubtSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: existing, error: readError } = await context.supabase
      .from("student_doubts")
      .select("*")
      .eq("id", data.id)
      .single();
    if (readError) throw new Error(readError.message);

    const { data: row, error } = await context.supabase
      .from("student_doubts")
      .update({
        admin_reply: data.admin_reply,
        status: data.status,
        answered_by: context.userId,
        answered_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    await insertNotificationSafe(context, {
      title: `Doubt answered: ${existing.title}`,
      message: data.admin_reply.slice(0, 280),
      type: "doubt",
      audience: "user",
      target_user_id: existing.user_id,
      action_label: "View answer",
      action_url: "/dashboard/doubts",
      priority: "high",
    });

    return row;
  });

export const adminDeleteDoubt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("student_doubts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
