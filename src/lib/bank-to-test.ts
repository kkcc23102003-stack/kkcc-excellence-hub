/**
 * Draws real questions out of the exam bank in the shape a test row needs.
 *
 * Reads the templates directly rather than going through the quiz screen's
 * generator, because that one lives inside a route file and cannot be
 * imported on the server.
 *
 * Every template is a deterministic list: `at(i)` returns the i-th question
 * or null for a parameter combination that does not make sense. So a draw is
 * simply a walk over shuffled indices, skipping the nulls and the repeats.
 */

import { ALL_TEMPLATES } from "@/lib/exam-bank";
import { isPublishableQuestion } from "@/lib/exam-bank/core";
import { checkDeterministicQuality } from "@/lib/exam-bank/deterministic-quality";

export type DrawnQuestion = {
  question_text: string;
  subject: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

/** Fisher-Yates on a fresh array, so the caller's input is untouched. */
function shuffled<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i] as T;
    a[i] = a[j] as T;
    a[j] = t;
  }
  return a;
}

/** A partial Fisher-Yates shuffle that does not allocate `size` indices. */
function createIndexPicker(size: number) {
  let remaining = Math.max(0, Math.floor(size));
  const swaps = new Map<number, number>();

  return () => {
    if (remaining <= 0) return undefined;
    const selected = Math.floor(Math.random() * remaining);
    const value = swaps.get(selected) ?? selected;
    remaining -= 1;
    const tail = swaps.get(remaining) ?? remaining;
    if (selected !== remaining) swaps.set(selected, tail);
    swaps.delete(remaining);
    return value;
  };
}

export function generateQuestionsForTest(input: {
  exam: string;
  subject: string;
  /** "Mixed" draws across every chapter of the subject. */
  topic: string;
  difficulty: "Easy" | "Moderate" | "Difficult";
  count: number;
}): DrawnQuestion[] {
  const pool = ALL_TEMPLATES.filter(
    (t) =>
      t.subject === input.subject &&
      t.difficulty === input.difficulty &&
      t.count > 0 &&
      (input.topic === "Mixed" || t.topic === input.topic) &&
      (input.exam === "All Exams" || t.exams.includes(input.exam)),
  );
  if (pool.length === 0) return [];

  const out: DrawnQuestion[] = [];
  const seen = new Set<string>();

  // High-Yield templates are a deliberate first-class layer. For an exact
  // exam, prefer templates written for that exam; then prefer the dedicated
  // High-Yield family; then use the rest of the same difficulty. We never
  // downgrade Easy/Moderate/Difficult to another level.
  const examName = input.exam.trim().toLowerCase();
  const priority = (t: (typeof pool)[number]) => {
    const exactExam =
      input.exam !== "All Exams" && t.exams.some((exam) => exam.trim().toLowerCase() === examName);
    const highYield = t.id.startsWith("hy:") || t.topic.toLowerCase().includes("high-yield");
    return (exactExam ? 4 : 0) + (highYield ? 2 : 0) + (t.difficulty === "Difficult" ? 1 : 0);
  };

  // Keep random variety inside each priority tier while still guaranteeing
  // that the strongest exam-oriented templates are consumed first.
  const order = shuffled(pool).sort((a, b) => priority(b) - priority(a));
  const cursors = order.map((template) => createIndexPicker(template.count));

  // Sample a bounded number of unique addresses per template. This keeps a
  // single huge Cartesian template from allocating millions of indices or
  // monopolising a request when most of its parameter combinations are null.
  const maxDepth = Math.max(
    ...order.map((template) =>
      Math.min(template.count, Math.max(100, Math.min(5000, input.count * 20))),
    ),
  );
  let depth = 0;
  while (out.length < input.count && depth < maxDepth) {
    for (let k = 0; k < order.length && out.length < input.count; k += 1) {
      const template = order[k];
      const idx = cursors[k]?.();
      if (!template || idx === undefined) continue;
      const q = template.at(idx);
      if (!q) continue;

      // Quality gate: a paid KKCC paper must never be filled with malformed,
      // duplicate, answer-leaking or explanation-free items just to hit a
      // numeric question count. If an item fails the gate we skip it and keep
      // drawing from the same difficulty pool.
      const prompt = q.prompt.trim();
      const answer = q.answer.trim();
      const distractors = q.distractors.map((item) => item.trim()).filter(Boolean);
      const key = prompt.toLowerCase().replace(/\s+/g, " ");
      const explanation = (q.explanation ?? "").trim();
      if (!isPublishableQuestion(q)) continue;
      // Prefer the strongest deterministic candidates. No AI, database write,
      // or external API is involved: the question is created on demand from
      // the trusted template bank and disappears after the test request.
      const quality = checkDeterministicQuality(q);
      if (!quality.publishable) continue;
      if (seen.has(key)) continue;

      // The bank stores the answer apart from its three distractors, so the
      // option list is built here and shuffled.
      const options = shuffled([answer, ...distractors]);
      const correctIndex = options.indexOf(answer);
      if (options.length !== 4 || correctIndex < 0) continue;

      seen.add(key);
      out.push({
        question_text: q.prompt,
        subject: template.subject,
        options,
        correct_index: correctIndex,
        explanation,
      });
    }
    depth += 1;
  }
  return out;
}
