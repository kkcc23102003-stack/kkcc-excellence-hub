/**
 * Reward vouchers on the quiz page.
 *
 * A student who finishes the month's target may claim one voucher. The gift
 * vouchers cost the centre real money, so they carry a daily quota shared
 * across all students that resets at 1 AM IST. When the day's quota is gone
 * the student is told exactly that, and when it comes back.
 *
 * A claim is a request. The desk fulfils it; nothing is credited here.
 */

import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { DB as Database } from "@/integrations/supabase/db";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { getSandboxPreviewClient } from "@/integrations/supabase/sandbox-client";
import { createSupabaseFetch } from "@/integrations/supabase/fetch";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { MONTHLY_VOUCHER_THRESHOLD } from "@/lib/coin-conversion";

function publicClient() {
  const config = getSupabasePublicConfig();
  if (!config) return getSandboxPreviewClient();
  return createClient<Database>(config.url, config.publishableKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: { fetch: createSupabaseFetch(config.publishableKey) },
  });
}

export type VoucherOffer = {
  id: string;
  label: string;
  value_inr: number;
  daily_quota: number | null;
  remaining_today: number;
  /** This student's claim for today, if any. */
  my_status: "none" | "pending" | "fulfilled" | "rejected";
};

/** The three vouchers with today's live availability. */
/**
 * The three vouchers with today's live availability.
 *
 * Public on purpose: a visitor should see what a month of practice is worth
 * before signing in. Only the claim needs an account.
 */
export const listRewardVouchers = createServerFn({ method: "GET" }).handler(
  async (): Promise<VoucherOffer[]> => {
    const supabase = publicClient();
    if (!supabase) return [];
    try {
      const { data: types, error } = await supabase
        .from("voucher_types")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);

      const offers: VoucherOffer[] = [];
      for (const t of types ?? []) {
        const { data: remaining } = await supabase.rpc("voucher_remaining_today", {
          p_type: t.id,
        });
        offers.push({
          id: t.id,
          label: t.label,
          value_inr: t.value_inr,
          daily_quota: t.daily_quota,
          remaining_today: Number(remaining ?? 0),
          my_status: "none",
        });
      }
      return offers;
    } catch (error) {
      // A visitor must never see a blank page because the backend blinked.
      console.error("[vouchers] public read failed", error);
      return [];
    }
  },
);

/**
 * Raise a claim.
 *
 * The earned balance is sent by the browser because the Kit 2 wallet lives
 * on the device by design. It is therefore treated as a claim to be checked
 * at the desk, never as proof — which is exactly how the voucher has always
 * been described.
 */
function supabaseOrThrow(context: { supabase: ReturnType<typeof publicClient> | unknown }) {
  return (context as { supabase: NonNullable<ReturnType<typeof publicClient>> }).supabase;
}

export const claimRewardVoucher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        voucher_type: z.string().trim().min(1).max(40),
        earned_kit2: z.number().min(0).max(100_000_000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    if (data.earned_kit2 < MONTHLY_VOUCHER_THRESHOLD) {
      throw new Error("The month's target is not complete yet.");
    }

    const { data: remaining, error: remainingError } = await context.supabase.rpc(
      "voucher_remaining_today",
      { p_type: data.voucher_type },
    );
    if (remainingError) throw new Error(remainingError.message);
    // Distinguish "not offered" from "today's stock is gone". Promising a
    // 1 AM reset on a voucher with a zero quota would be a lie.
    const { data: type } = await supabaseOrThrow(context)
      .from("voucher_types")
      .select("daily_quota")
      .eq("id", data.voucher_type)
      .maybeSingle();
    if (type?.daily_quota === 0) {
      throw new Error("This reward is not on offer at the moment.");
    }
    if (Number(remaining ?? 0) <= 0) {
      throw new Error(
        "All of today's vouchers of this kind are claimed. More become available at 1 AM.",
      );
    }

    const { data: day, error: dayError } = await context.supabase.rpc("voucher_claim_day");
    if (dayError) throw new Error(dayError.message);

    const code = `KV-${String(data.voucher_type).slice(0, 3).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    const { error } = await context.supabase.from("voucher_claims").insert({
      voucher_type: data.voucher_type,
      user_id: context.userId,
      claim_day: day as unknown as string,
      status: "pending",
      code,
    } as never);
    if (error) {
      // The one-per-day unique index is the expected failure here.
      if (error.message.includes("duplicate") || error.message.includes("unique")) {
        throw new Error("You have already claimed this voucher today. Try again after 1 AM.");
      }
      throw new Error(error.message);
    }
    return { ok: true, code };
  });

/** Admin-only reward catalogue controls. */
async function assertVoucherAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

export const adminListRewardVouchers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertVoucherAdmin(context);
    const { data, error } = await context.supabase
      .from("voucher_types")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveRewardVoucher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        id: z.string().trim().min(1).max(40),
        label: z.string().trim().min(1).max(120),
        value_inr: z.number().int().min(0).max(100000),
        daily_quota: z.number().int().min(0).max(1_000_000).nullable(),
        is_active: z.boolean(),
        sort_order: z.number().int().min(0).max(1000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertVoucherAdmin(context);
    const { error } = await context.supabase
      .from("voucher_types")
      .upsert(data as never, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListVoucherClaims = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertVoucherAdmin(context);
    const { data, error } = await context.supabase
      .from("voucher_claims")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
