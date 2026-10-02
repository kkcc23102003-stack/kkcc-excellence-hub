/**
 * Which slice of the question bank each part of the app draws from.
 *
 * The bank is written in two layers for every chapter:
 *
 *   - **Moderate** is the working layer: the facts and formulae a student
 *     needs to hold the chapter in their head. This is what the Kit 2 Coins
 *     practice quiz serves, because practice should build fluency, not
 *     ambush the student.
 *
 *   - **Difficult** is the advanced, exam-oriented layer: the most-asked,
 *     higher-order, twisted items that decide marks in the real paper. This
 *     is what the paid test series and the unlimited advanced test serve.
 *
 * Keeping the choice in one place means the two never drift apart.
 */

import type { LadderLevel } from "@/lib/quiz-levels";

/** The Kit 2 Coins practice quiz draws from here. */
export const PRACTICE_BANK_DIFFICULTY: LadderLevel = "Moderate";

/** The paid series and the unlimited advanced test draw from here. */
export const ADVANCED_BANK_DIFFICULTY: LadderLevel = "Difficult";

/** URL flag that switches the quiz engine into advanced, unlimited mode. */
export const ADVANCED_SEARCH_PARAM = "level";
export const ADVANCED_SEARCH_VALUE = "advanced";

/**
 * Link to the unlimited advanced test for one subject of a series.
 *
 * It reuses the quiz engine, so there is no second implementation to keep in
 * step: same anti-repeat, same explanations, same exam badges - but every
 * question comes from the advanced layer and the run never ends.
 */
export function advancedTestUrl(exam: string, subject: string, topic = "Mixed") {
  const params = new URLSearchParams({
    exam,
    subject,
    topic,
    mode: "PYQ-pattern",
    [ADVANCED_SEARCH_PARAM]: ADVANCED_SEARCH_VALUE,
  });
  return `/games?${params.toString()}`;
}
