import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  CoinPackageRow,
  CoinTransactionRow,
  DB as Database,
  ProfileRow,
} from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";

function publicClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  return createClient<Database>(config.url, config.publishableKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: createSupabaseFetch(config.publishableKey) },
  });
}

const emailOrUserSchema = z.object({
  email: z.string().trim().email().optional(),
  user_id: z.string().uuid().optional(),
  amount: z.number().int().min(1).max(10_000_000),
  reason: z.string().trim().max(600).default("Admin 23KAAT grant"),
  related_type: z.string().trim().max(80).optional().default(""),
  related_id: z.string().uuid().nullable().optional(),
});

const courseSpendSchema = z.object({ course_id: z.string().uuid() });
const materialSchema = z.object({ material_id: z.string().uuid() });

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

async function findProfileByEmailOrId(
  supabase: SupabaseClient<Database>,
  payload: { user_id?: string | undefined; email?: string | undefined },
) {
  if (payload.user_id) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", payload.user_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Student profile not found. Ask the student to sign up once first.");
    return data as ProfileRow;
  }

  const email = payload.email?.toLowerCase();
  if (!email) throw new Error("Student email or user ID is required.");
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("email", email)
    .limit(5);
  if (error) throw new Error(error.message);
  const profile = (data ?? []).find((item) => item.email.toLowerCase() === email);
  if (!profile) throw new Error("Student not found. Ask the student to sign up once first.");
  return profile as ProfileRow;
}

type CoinRpcResult = {
  ok: boolean;
  locked: boolean;
  already_owned: boolean;
  free: boolean;
  spent: number;
  amount: number;
  balance: number;
  price: number;
  file_url: string;
  reason: string;
};

function toNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function jsonResult(value: unknown): CoinRpcResult {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    ok: Boolean(row["ok"]),
    locked: Boolean(row["locked"]),
    already_owned: Boolean(row["already_owned"]),
    free: Boolean(row["free"]),
    spent: toNumber(row["spent"]),
    amount: toNumber(row["amount"]),
    balance: toNumber(row["balance"]),
    price: toNumber(row["price"]),
    file_url: typeof row["file_url"] === "string" ? row["file_url"] : "",
    reason: typeof row["reason"] === "string" ? row["reason"] : "",
  };
}

export const list23KaatCoinPackages = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  if (!supabase) return [] as CoinPackageRow[];

  const { data, error } = await supabase
    .from("coin_packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("price", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as CoinPackageRow[];
});

export const getMy23KaatWallet = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [
      { data: balanceData, error: balanceError },
      { data: txs, error: txError },
      packagesResult,
    ] = await Promise.all([
      context.supabase.rpc("get_23kaat_balance", { _user_id: context.userId }),
      context.supabase
        .from("coin_transactions")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(20),
      context.supabase
        .from("coin_packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("price", { ascending: true }),
    ]);

    if (balanceError) throw new Error(balanceError.message);
    if (txError) throw new Error(txError.message);
    if (packagesResult.error) throw new Error(packagesResult.error.message);

    return {
      balance: Number(balanceData ?? 0),
      transactions: (txs ?? []) as CoinTransactionRow[],
      packages: packagesResult.data ?? [],
    };
  });

export const adminGrant23Kaat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => emailOrUserSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const profile = await findProfileByEmailOrId(context.supabase, data);
    const { data: result, error } = await context.supabase.rpc("grant_23kaat_to_user", {
      _user_id: profile.id,
      _amount: data.amount,
      _reason: data.reason,
      _related_type: data.related_type || "admin_grant",
      _related_id: data.related_id ?? null,
    });
    if (error) throw new Error(error.message);
    return { ...jsonResult(result), email: profile.email, full_name: profile.full_name };
  });

export const adminList23KaatLedger = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ query: z.string().trim().max(120).default("") }).parse(input ?? {}),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const [{ data: txs, error: txError }, { data: profiles, error: profileError }] =
      await Promise.all([
        context.supabase
          .from("coin_transactions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(300),
        context.supabase.from("profiles").select("*").limit(500),
      ]);
    if (txError) throw new Error(txError.message);
    if (profileError) throw new Error(profileError.message);

    const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    const query = data.query.toLowerCase();
    return ((txs ?? []) as CoinTransactionRow[])
      .map((tx) => ({ ...tx, student: profileById.get(tx.user_id) ?? null }))
      .filter((tx) => {
        if (!query) return true;
        const student = tx.student as ProfileRow | null;
        return [student?.full_name, student?.email, tx.reason, tx.source]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
  });

export const spend23KaatForCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => courseSpendSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: result, error } = await context.supabase.rpc("spend_23kaat_for_course", {
      _course_id: data.course_id,
    });
    if (error) throw new Error(error.message);
    return jsonResult(result);
  });

export const getMyMaterialAccessUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => materialSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: result, error } = await context.supabase.rpc("get_my_material_access_url", {
      _material_id: data.material_id,
    });
    if (error) throw new Error(error.message);
    return jsonResult(result);
  });

export const spend23KaatForMaterial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => materialSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: result, error } = await context.supabase.rpc("spend_23kaat_for_material", {
      _material_id: data.material_id,
    });
    if (error) throw new Error(error.message);
    return jsonResult(result);
  });
