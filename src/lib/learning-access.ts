import { LEARNING_SERIES } from "@/lib/test-series-catalog";

export function isCurrentGrant(
  grant: { revoked_at?: string | null; expires_at?: string | null },
  now = Date.now(),
) {
  if (grant.revoked_at) return false;
  if (!grant.expires_at) return true;
  const expiry = Date.parse(grant.expires_at);
  return Number.isFinite(expiry) && expiry > now;
}
export function isCurrentEnrollment(
  enrollment: { status: string; expires_at?: string | null },
  now = Date.now(),
) {
  return enrollment.status === "active" && isCurrentGrant(enrollment, now);
}
export function canonicalSeriesId(
  value: string | null | undefined,
  aliases?: Record<string, string | null>,
): string | null {
  const key = value?.trim().toLocaleLowerCase();
  if (!key) return null;
  const exact = LEARNING_SERIES.find((item) => item.id.toLocaleLowerCase() === key);
  if (exact) return exact.id; // Canonical code IDs always win over mutable display names.
  if (aliases && Object.hasOwn(aliases, key)) return aliases[key] ?? null;
  const series = LEARNING_SERIES.find((item) => item.name.trim().toLocaleLowerCase() === key);
  return series?.id ?? null;
}
export function seriesAliases(overrides: readonly { series_id: string; name: string | null }[]) {
  const matches = new Map<string, Set<string>>();
  for (const series of LEARNING_SERIES) {
    const key = series.name.trim().toLocaleLowerCase();
    if (!matches.has(key)) matches.set(key, new Set());
    matches.get(key)!.add(series.id);
  }
  for (const override of overrides) {
    const id = canonicalSeriesId(override.series_id);
    const key = override.name?.trim().toLocaleLowerCase();
    if (!id || !key) continue;
    if (!matches.has(key)) matches.set(key, new Set());
    matches.get(key)!.add(id);
  }
  return Object.fromEntries(
    [...matches].map(([key, ids]) => [key, ids.size === 1 ? [...ids][0]! : null]),
  );
}
/** Stable partition + one card per content ID; nothing is capped or duplicated. */
export function prioritizeEnrolled<T extends { id: string }>(
  items: readonly T[],
  enrolled: ReadonlySet<string>,
): T[] {
  const seen = new Set<string>();
  const first: T[] = [];
  const other: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    (enrolled.has(item.id) ? first : other).push(item);
  }
  return [...first, ...other];
}
export function assertSelection(
  plan: { subject: string; chapters: string[] }[],
  subject: string,
  chapter?: string,
) {
  const selected = plan.find((item) => item.subject === subject);
  if (!selected) throw new Error("This subject does not belong to the selected test or series.");
  if (chapter && !selected.chapters.includes(chapter))
    throw new Error("This chapter does not belong to the selected subject and exam.");
  return selected;
}
