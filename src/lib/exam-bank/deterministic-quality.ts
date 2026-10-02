import { isPublishableQuestion, type GeneratedQuestion } from "./core";

export type QualityCheck = {
  score: number;
  publishable: boolean;
  reasons: string[];
};

const normalise = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();

/**
 * Deterministic, zero-AI quality gate.
 *
 * This never calls an API and never writes to Supabase. It scores the question
 * that is already produced by a trusted template/fact table. The hard gate in
 * core.ts remains the final safety barrier; this layer adds conservative checks
 * for question quality and option construction.
 */
export function checkDeterministicQuality(question: GeneratedQuestion): QualityCheck {
  const reasons: string[] = [];
  let score = 100;
  const prompt = normalise(question.prompt ?? "");
  const answer = normalise(question.answer ?? "");
  const explanation = normalise(question.explanation ?? "");
  const options = [question.answer, ...(question.distractors ?? [])].map(normalise);

  if (!isPublishableQuestion(question)) {
    return { score: 0, publishable: false, reasons: ["Failed the core publishability gate"] };
  }

  if (prompt.length < 30) {
    score -= 8;
    reasons.push("Very short question stem");
  }
  if (explanation.length < 40) {
    score -= 5;
    reasons.push("Short explanation");
  }
  if (!/[?？:]$/.test(question.prompt.trim()) && !/\n/.test(question.prompt)) {
    score -= 3;
    reasons.push("Stem does not end with a clear question/prompt marker");
  }

  const unique = new Set(options);
  if (unique.size !== 4) {
    return { score: 0, publishable: false, reasons: ["Options are not four distinct choices"] };
  }

  // Exact answer leakage in a simple one-line stem is usually a generator bug.
  // We do not reject legitimate statement questions where the answer is a
  // necessary part of the stem; only penalise it here.
  if (prompt.length < 120 && prompt.includes(answer) && answer.length >= 4) {
    score -= 10;
    reasons.push("Answer text appears directly in a short stem");
  }

  // Extremely unbalanced option lengths often reveal an accidental placeholder
  // or a malformed distractor. Keep this as a soft penalty, not a hard reject.
  const lengths = options.map((item) => item.length).sort((a, b) => a - b);
  const min = lengths[0] ?? 0;
  const max = lengths[lengths.length - 1] ?? 0;
  if (min > 0 && max > min * 6) {
    score -= 6;
    reasons.push("Option lengths are unusually unbalanced");
  }

  // Explanations should add information rather than merely repeat the answer.
  if (explanation === answer || explanation.startsWith(`${answer}.`)) {
    return { score: 0, publishable: false, reasons: ["Explanation only repeats the answer"] };
  }

  score = Math.max(0, Math.min(100, score));
  return {
    score,
    publishable: score >= 80,
    reasons,
  };
}
