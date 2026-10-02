/**
 * How a 23KAAT balance is shown.
 *
 * Admins read as effectively unlimited, which the database expresses as a
 * very large number rather than a special flag. Anything at or above this
 * threshold is shown as "Unlimited" instead of printing two billion.
 */

export const UNLIMITED_23KAAT_THRESHOLD = 1_000_000_000;

export function is23KaatUnlimited(balance: number) {
  return balance >= UNLIMITED_23KAAT_THRESHOLD;
}

/** Balance for display: "Unlimited" for admins, a plain number otherwise. */
export function format23Kaat(balance: number) {
  return is23KaatUnlimited(balance) ? "Unlimited" : balance.toLocaleString("en-IN");
}
