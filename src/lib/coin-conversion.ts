/**
 * The single place that defines what a coin is worth at KKCC.
 *
 *   10,000 Kit 2 Coins  =  1 23KAAT coin  =  1 rupee
 *
 * Kit 2 Coins are the local learning-game points earned in the quiz. 23KAAT
 * coins are the account coins a student buys and spends on courses, batches
 * and notes. This module is the only definition of the rate, so changing the
 * numbers here changes every screen at once.
 *
 * Important: a Kit 2 balance lives in the browser, not on the server. It is
 * therefore treated as a *claim*, never as money. A voucher can only be
 * raised once a month's practice reaches the equivalent of 100 23KAAT
 * coins, and the KKCC team verifies it before any 23KAAT is credited.
 * Nothing here credits an account on its own.
 */

/** Kit 2 Coins needed for one 23KAAT coin. */
export const KIT2_PER_23KAAT = 10_000;

/** Rupee value of one 23KAAT coin. */
export const RUPEES_PER_23KAAT = 1;

/** Kit 2 Coins needed for one rupee of value. */
export const KIT2_PER_RUPEE = KIT2_PER_23KAAT / RUPEES_PER_23KAAT;

/** How many whole 23KAAT coins a Kit 2 balance is worth. */
export function kit2ToKaat(kit2: number): number {
  return Math.floor(kit2 / KIT2_PER_23KAAT);
}

/** Rupee value of a Kit 2 balance, rounded down to the paisa. */
export function kit2ToRupees(kit2: number): number {
  return Math.floor((kit2 / KIT2_PER_RUPEE) * 100) / 100;
}

/** Kit 2 Coins still needed before the next whole 23KAAT coin. */
export function kit2ToNextKaat(kit2: number): number {
  const remainder = kit2 % KIT2_PER_23KAAT;
  return remainder === 0 ? 0 : KIT2_PER_23KAAT - remainder;
}

/** Rupee value shown next to a Kit 2 balance, e.g. "₹1.12". */
export function formatKit2AsRupees(kit2: number): string {
  const rupees = kit2ToRupees(kit2);
  return `₹${rupees.toFixed(2)}`;
}

/** One-line statement of the rate, used wherever the rule is explained. */
export const CONVERSION_SENTENCE = `${KIT2_PER_23KAAT.toLocaleString(
  "en-IN",
)} Kit 2 Coins = 1 23KAAT coin = ₹${RUPEES_PER_23KAAT}`;

/* ---------------------------------------------------------------- */
/* The monthly earning cycle                                        */
/* ---------------------------------------------------------------- */

/** 23KAAT coins a full month of practice is worth. */
export const KAAT_PER_MONTH_TARGET = 100;

/** Kit 2 Coins a student must reach in the month to raise a voucher. */
export const MONTHLY_VOUCHER_THRESHOLD = KAAT_PER_MONTH_TARGET * KIT2_PER_23KAAT;

/** Questions in a day that count as the daily task being done. */
export const DAILY_TASK_QUESTIONS = 1000;

/** Days of completed daily tasks that reach the monthly threshold. */
export const DAYS_TO_MONTHLY_TARGET = 28;

/**
 * Kit 2 Coins a completed daily task pays.
 *
 * Rounded up so that 28 completed days clear the threshold rather than
 * landing a few coins short of it.
 */
export const DAILY_REWARD_CAP = Math.ceil(MONTHLY_VOUCHER_THRESHOLD / DAYS_TO_MONTHLY_TARGET);

/** Coins per question, so exactly 1,000 questions fill the daily cap. */
export const REWARD_PER_QUESTION = DAILY_REWARD_CAP / DAILY_TASK_QUESTIONS;
