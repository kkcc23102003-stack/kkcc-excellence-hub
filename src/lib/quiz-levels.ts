/**
 * The three-level difficulty ladder used by the quiz and by the paid test
 * series. A run always walks Easy first, then Moderate, then Difficult, so a
 * student warms up before meeting exam-level questions.
 */

/** How many questions are served at each level before the ladder steps up. */
export const QUESTIONS_PER_LEVEL = 10;

/** The three levels a practice run walks through, in order. */
export const DIFFICULTY_LADDER = ["Easy", "Moderate", "Difficult"] as const;

export type LadderLevel = (typeof DIFFICULTY_LADDER)[number];

/** Level for the nth question of a run (0-based index). */
export function levelForIndex(index: number): LadderLevel {
  const step = Math.floor(index / QUESTIONS_PER_LEVEL);
  return DIFFICULTY_LADDER[Math.min(step, DIFFICULTY_LADDER.length - 1)] as LadderLevel;
}
