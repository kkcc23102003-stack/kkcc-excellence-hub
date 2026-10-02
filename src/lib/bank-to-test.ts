/** Bounded-memory draws from the ORIGINAL finite template bank. */
import { ACTIVE_TEMPLATES } from "@/lib/exam-bank";
import { gcd, isPublishableQuestion, type Difficulty } from "@/lib/exam-bank/core";
import { checkDeterministicQuality } from "@/lib/exam-bank/deterministic-quality";

export type DrawnQuestion = {
  question_text: string;
  subject: string;
  options: string[];
  correct_index: number;
  explanation: string;
  source_id: string;
  template_id: string;
  template_index: number;
  exam: string;
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  question_type: string;
  provenance: "practice";
};
export function questionType(templateId: string, prompt: string): string {
  if (templateId.includes(":stmt3")) return "statement-count";
  if (templateId.includes(":stmt")) return "statement-combination";
  if (/assertion.*reason/i.test(prompt)) return "assertion-reason";
  if (/match|matched/i.test(prompt)) return "matching";
  return "single-choice";
}
function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
/** A permutation cursor instead of an Array(template.count) allocation. */
function indexCursor(count: number, random: () => number) {
  const start = Math.floor(random() * count);
  let step = Math.max(1, Math.floor(random() * count));
  while (gcd(step, count) !== 1) step = step >= count - 1 ? 1 : step + 1;
  let used = 0;
  return () => (used < count ? (start + step * used++) % count : null);
}
export function generateQuestionsForTest(input: {
  exam: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  count: number;
  random?: () => number;
  seen?: Set<string>;
}): DrawnQuestion[] {
  const count = Math.max(0, Math.min(1000, Math.floor(input.count)));
  if (!count) return [];
  const random = input.random ?? Math.random;
  const pool = ACTIVE_TEMPLATES.filter(
    (template) =>
      template.subject === input.subject &&
      template.difficulty === input.difficulty &&
      template.count > 0 &&
      (input.topic === "Mixed" || template.topic === input.topic) &&
      (input.exam === "All Exams" || template.exams.includes(input.exam)),
  );
  if (!pool.length) return [];
  const priority = (template: (typeof pool)[number]) => (template.id.startsWith("hy:") ? 1 : 0);
  const ordered = shuffled(pool, random).sort((a, b) => priority(b) - priority(a));
  const cursors = ordered.map((template) => indexCursor(template.count, random));
  const seen = input.seen ?? new Set<string>();
  const out: DrawnQuestion[] = [];
  // Large parameter spaces are sampled in bounded time. Small templates are
  // exhaustively walked; exhausted/invalid ones do not cause infinite loading.
  const maxDepth = Math.min(8192, Math.max(...ordered.map((template) => template.count)));
  for (let depth = 0; depth < maxDepth && out.length < count; depth += 1) {
    for (let k = 0; k < ordered.length && out.length < count; k += 1) {
      const template = ordered[k]!;
      const index = cursors[k]!();
      if (index === null) continue;
      const q = template.at(index);
      if (!q || !isPublishableQuestion(q) || !checkDeterministicQuality(q).publishable) continue;
      const key = q.prompt.trim().toLocaleLowerCase().replace(/\s+/g, " ");
      if (seen.has(key)) continue;
      const answer = q.answer.trim();
      const options = shuffled([answer, ...q.distractors.map((item) => item.trim())], random);
      const correct_index = options.indexOf(answer);
      if (options.length !== 4 || correct_index < 0) continue;
      seen.add(key);
      out.push({
        question_text: q.prompt,
        subject: template.subject,
        options,
        correct_index,
        explanation: q.explanation,
        source_id: `${template.id}:${index}`,
        template_id: template.id,
        template_index: index,
        exam: input.exam,
        chapter: template.topic,
        topic: template.topic,
        difficulty: template.difficulty,
        question_type: questionType(template.id, q.prompt),
        provenance: "practice",
      });
    }
  }
  return out;
}
