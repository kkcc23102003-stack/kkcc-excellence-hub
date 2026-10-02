import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  CourseEnrollmentRow,
  CourseRow,
  DB as Database,
  OfflineAccessGrantRow,
  ProfileRow,
} from "@/integrations/supabase/db";

const grantSchema = z.object({
  email: z.string().trim().email(),
  full_name: z.string().trim().min(1).max(160),
  course_id: z.string().uuid(),
  amount_paid: z.number().int().min(0).max(1000000).default(0),
  payment_method: z.string().trim().max(80).default("offline"),
  admin_note: z.string().trim().max(1200).default(""),
  expires_at: z.string().datetime().nullable().optional(),
});

const listSchema = z.object({ query: z.string().trim().max(120).optional().default("") });
const revokeSchema = z.object({ id: z.string().uuid() });

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function matchesGrant(grant: OfflineAccessGrantRow, course: CourseRow | null, query: string) {
  if (!query) return true;
  const haystack = [
    grant.email,
    grant.full_name,
    grant.payment_method,
    grant.admin_note,
    course?.title,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

async function findProfileByEmail(supabase: SupabaseClient<Database>, email: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("email", email)
    .limit(5);
  if (error) throw new Error(error.message);
  return (
    ((data ?? []) as ProfileRow[]).find((profile) => profile.email.toLowerCase() === email) ?? null
  );
}

async function activateGrantForProfile({
  supabase,
  adminUserId,
  grant,
  profile,
}: {
  supabase: SupabaseClient<Database>;
  adminUserId: string;
  grant: OfflineAccessGrantRow;
  profile: ProfileRow;
}) {
  if (grant.full_name.trim()) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: grant.full_name, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
    if (profileError) throw new Error(profileError.message);
  }

  const { error: enrollmentError } = await supabase.from("course_enrollments").upsert(
    {
      user_id: profile.id,
      course_id: grant.course_id,
      status: "active",
      source: "offline",
      payment_method: grant.payment_method,
      amount_paid: grant.amount_paid,
      currency: grant.currency,
      admin_note: grant.admin_note,
      expires_at: grant.expires_at,
      created_by: adminUserId,
      updated_at: new Date().toISOString(),
    } as never,
    { onConflict: "user_id,course_id" },
  );
  if (enrollmentError) throw new Error(enrollmentError.message);

  await supabase
    .from("payment_transactions")
    .insert({
      user_id: profile.id,
      course_id: grant.course_id,
      provider: "offline",
      status: "paid",
      amount: grant.amount_paid,
      currency: grant.currency,
      provider_order_id: "",
      provider_payment_id: "",
      admin_note: grant.admin_note,
      metadata: {
        offline_grant_id: grant.id,
        email: grant.email,
        full_name: grant.full_name,
        payment_method: grant.payment_method,
      },
      created_by: adminUserId,
    } as never)
    .then(({ error }) => {
      if (error) console.warn("[offline-access] payment audit insert failed", error.message);
    });

  const { error: grantError } = await supabase
    .from("offline_access_grants")
    .update({
      status: "activated",
      activated_user_id: profile.id,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", grant.id);
  if (grantError) throw new Error(grantError.message);
}

export const adminListOfflineAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => listSchema.parse(input ?? {}))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const [coursesResult, grantsResult, enrollmentsResult] = await Promise.all([
      context.supabase
        .from("courses")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      context.supabase
        .from("offline_access_grants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      context.supabase
        .from("course_enrollments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    if (coursesResult.error) throw new Error(coursesResult.error.message);
    if (grantsResult.error) throw new Error(grantsResult.error.message);
    if (enrollmentsResult.error) throw new Error(enrollmentsResult.error.message);

    const courses = (coursesResult.data ?? []) as CourseRow[];
    const courseById = new Map(courses.map((course) => [course.id, course]));
    const grants = ((grantsResult.data ?? []) as OfflineAccessGrantRow[])
      .filter((grant) => matchesGrant(grant, courseById.get(grant.course_id) ?? null, data.query))
      .map((grant) => ({ ...grant, course: courseById.get(grant.course_id) ?? null }));

    return {
      courses,
      grants,
      enrollments: (enrollmentsResult.data ?? []) as CourseEnrollmentRow[],
    };
  });

export const adminGrantOfflineAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => grantSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const email = normalizeEmail(data.email);

    const { data: course, error: courseError } = await context.supabase
      .from("courses")
      .select("*")
      .eq("id", data.course_id)
      .maybeSingle();
    if (courseError) throw new Error(courseError.message);
    if (!course) throw new Error("Course not found.");

    const profile = await findProfileByEmail(context.supabase, email);
    const now = new Date().toISOString();
    const { data: existing, error: existingError } = await context.supabase
      .from("offline_access_grants")
      .select("*")
      .eq("email", email)
      .eq("course_id", data.course_id)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);

    const payload = {
      email,
      full_name: data.full_name,
      course_id: data.course_id,
      status: profile ? "activated" : "pending",
      amount_paid: data.amount_paid,
      currency: "INR",
      payment_method: data.payment_method || "offline",
      admin_note: data.admin_note,
      expires_at: data.expires_at ?? null,
      activated_user_id: profile?.id ?? null,
      created_by: context.userId,
      updated_at: now,
    };

    let grant: OfflineAccessGrantRow;
    if (existing) {
      const { data: updated, error } = await context.supabase
        .from("offline_access_grants")
        .update(payload as never)
        .eq("id", existing.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      grant = updated as OfflineAccessGrantRow;
    } else {
      const { data: inserted, error } = await context.supabase
        .from("offline_access_grants")
        .insert({ ...payload, created_at: now } as never)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      grant = inserted as OfflineAccessGrantRow;
    }

    if (profile) {
      await activateGrantForProfile({
        supabase: context.supabase,
        adminUserId: context.userId,
        grant,
        profile,
      });
      return { ok: true, activated: true, email, user_id: profile.id };
    }

    return { ok: true, activated: false, email };
  });

export const adminRevokeOfflineAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => revokeSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: grant, error: fetchError } = await context.supabase
      .from("offline_access_grants")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (!grant) throw new Error("Offline access grant not found.");

    const row = grant as OfflineAccessGrantRow;
    const { error } = await context.supabase
      .from("offline_access_grants")
      .update({ status: "revoked", updated_at: new Date().toISOString() } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    if (row.activated_user_id) {
      const { error: enrollmentError } = await context.supabase
        .from("course_enrollments")
        .update({ status: "revoked", updated_at: new Date().toISOString() })
        .eq("user_id", row.activated_user_id)
        .eq("course_id", row.course_id);
      if (enrollmentError) throw new Error(enrollmentError.message);
    }

    return { ok: true };
  });
