import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  DB as Database,
  ProfileRow,
  StudentBlockRow,
  UserRoleRow,
} from "@/integrations/supabase/db";

const OWNER_EMAIL = "kkcc23102003@gmail.com";
const OWNER_EMAIL_NORMALIZED = OWNER_EMAIL.toLowerCase();

const searchSchema = z.object({ query: z.string().trim().max(120).optional().default("") });
const emailSchema = z.object({ email: z.string().trim().email().max(254) });
const roleUserSchema = z.object({ user_id: z.string().uuid() });
const blockUserSchema = z.object({
  user_id: z.string().uuid(),
  blocked: z.boolean(),
  reason: z.string().trim().max(600).optional().default(""),
});

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function profileLabel(profile: ProfileRow) {
  return profile.full_name?.trim() || profile.email?.trim() || profile.id;
}

function matchesProfile(profile: ProfileRow, query: string) {
  if (!query) return true;
  const haystack = [
    profile.full_name,
    profile.email,
    profile.mobile,
    profile.class_level,
    profile.target_exam,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => searchSchema.parse(input ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const [profilesResult, rolesResult, blocksResult] = await Promise.all([
      context.supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      context.supabase.from("user_roles").select("*"),
      context.supabase.from("student_blocks").select("*"),
    ]);

    const { data: profiles, error: profileError } = profilesResult;
    const { data: roles, error: roleError } = rolesResult;
    if (profileError) throw new Error(profileError.message);
    if (roleError) throw new Error(roleError.message);
    if (blocksResult.error)
      console.warn("[admin] student_blocks unavailable", blocksResult.error.message);

    const adminUserIds = new Set(
      ((roles ?? []) as UserRoleRow[])
        .filter((role) => role.role === "admin")
        .map((role) => role.user_id),
    );
    const activeBlocks = new Map(
      (
        ((blocksResult.data ?? []) as StudentBlockRow[]).filter((block) => block.is_active) ?? []
      ).map((block) => [block.user_id, block]),
    );

    return ((profiles ?? []) as ProfileRow[])
      .filter((profile) => matchesProfile(profile, data.query))
      .map((profile) => ({
        ...profile,
        display_name: profileLabel(profile),
        is_admin: adminUserIds.has(profile.id),
        is_owner: profile.email.toLowerCase() === OWNER_EMAIL_NORMALIZED,
        is_blocked: Boolean(activeBlocks.get(profile.id)),
        blocked_reason: activeBlocks.get(profile.id)?.reason ?? "",
        blocked_at: activeBlocks.get(profile.id)?.blocked_at ?? null,
      }));
  });

export const adminGrantRoleByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => emailSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const email = data.email.toLowerCase();
    const { data: profiles, error } = await context.supabase
      .from("profiles")
      .select("*")
      .ilike("email", email)
      .limit(5);
    if (error) throw new Error(error.message);
    const profile = (profiles ?? []).find((item) => item.email.toLowerCase() === email);
    if (!profile) {
      throw new Error(
        "User not found. Ask the person to sign up once, then grant admin access here.",
      );
    }

    const { error: insertError } = await context.supabase.from("user_roles").upsert(
      {
        user_id: profile.id,
        role: "admin",
      },
      { onConflict: "user_id,role" },
    );
    if (insertError) throw new Error(insertError.message);
    return { ok: true, user_id: profile.id, email: profile.email };
  });

export const adminGrantRoleByUserId = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => roleUserSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("user_roles").upsert(
      {
        user_id: data.user_id,
        role: "admin",
      },
      { onConflict: "user_id,role" },
    );
    if (error) throw new Error(error.message);
    return { ok: true, user_id: data.user_id };
  });

export const adminRevokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => roleUserSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);

    const [{ count, error: countError }, { data: targetProfile, error: profileError }] =
      await Promise.all([
        context.supabase
          .from("user_roles")
          .select("id", { count: "exact", head: true })
          .eq("role", "admin"),
        context.supabase.from("profiles").select("*").eq("id", data.user_id).maybeSingle(),
      ]);
    if (countError) throw new Error(countError.message);
    if (profileError) throw new Error(profileError.message);
    if ((count ?? 0) <= 1) throw new Error("At least one admin must remain.");
    if (targetProfile?.email?.toLowerCase() === OWNER_EMAIL_NORMALIZED) {
      throw new Error("Owner admin cannot be removed from the app panel.");
    }

    const { error } = await context.supabase
      .from("user_roles")
      .delete()
      .eq("user_id", data.user_id)
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSetStudentBlockStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => blockUserSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);

    const [{ data: targetProfile, error: profileError }, { data: targetRoles, error: rolesError }] =
      await Promise.all([
        context.supabase.from("profiles").select("*").eq("id", data.user_id).maybeSingle(),
        context.supabase.from("user_roles").select("*").eq("user_id", data.user_id),
      ]);

    if (profileError) throw new Error(profileError.message);
    if (rolesError) throw new Error(rolesError.message);
    if (!targetProfile) throw new Error("Student profile not found.");
    if (targetProfile.email?.toLowerCase() === OWNER_EMAIL_NORMALIZED) {
      throw new Error("Owner admin cannot be blocked.");
    }
    if (((targetRoles ?? []) as UserRoleRow[]).some((role) => role.role === "admin")) {
      throw new Error("Admin users cannot be blocked from the student block tool.");
    }

    if (data.blocked) {
      const { error } = await context.supabase.from("student_blocks").upsert(
        {
          user_id: data.user_id,
          is_active: true,
          reason: data.reason || "Blocked by KKCC admin",
          blocked_by: context.userId,
          blocked_at: new Date().toISOString(),
          unblocked_by: null,
          unblocked_at: null,
        },
        { onConflict: "user_id" },
      );
      if (error) throw new Error(error.message);
      return { ok: true, user_id: data.user_id, blocked: true };
    }

    const { error } = await context.supabase
      .from("student_blocks")
      .update({
        is_active: false,
        unblocked_by: context.userId,
        unblocked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true, user_id: data.user_id, blocked: false };
  });
