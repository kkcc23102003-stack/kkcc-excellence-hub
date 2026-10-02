/**
 * On-demand deterministic test paper generation.
 *
 * The generated MCQs are never inserted into Supabase. A published test stores
 * only its generation recipe (exam/subject/topic/difficulty/count). Each time
 * the paper is opened this helper builds a fresh question set from the local
 * deterministic template bank.
 */
import { generateQuestionsForTest, type DrawnQuestion } from "@/lib/bank-to-test";

export type GeneratedTestQuestion = DrawnQuestion & {
  id: string;
  marks: number;
  negative_marks: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function makeId(index: number) {
  // These ids are only in-memory React keys. They are deliberately not UUIDs
  // and are never written to the database.
  return `generated-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 10)}`;
}

export function generateOnDemandTestPaper(input: {
  exam: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Mixed";
  count: number;
  marks: number;
  negative_marks: number;
}): GeneratedTestQuestion[] {
  const count = Math.max(1, Math.min(1000, Math.floor(input.count)));
  const levels: Array<"Easy" | "Moderate" | "Difficult"> =
    input.difficulty === "Mixed" ? ["Easy", "Moderate", "Difficult"] : [input.difficulty];

  const base = Math.floor(count / levels.length);
  const remainder = count % levels.length;
  const drawn: DrawnQuestion[] = [];

  for (let i = 0; i < levels.length; i += 1) {
    const wanted = base + (i < remainder ? 1 : 0);
    if (wanted <= 0) continue;
    drawn.push(
      ...generateQuestionsForTest({
        exam: input.exam,
        subject: input.subject,
        topic: input.topic,
        difficulty: levels[i]!,
        count: wanted,
      }),
    );
  }

  // Shuffle the difficulty layers so Mixed papers do not appear in fixed
  // Easy -> Moderate -> Difficult blocks.
  for (let i = drawn.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [drawn[i], drawn[j]] = [drawn[j]!, drawn[i]!];
  }

  const now = new Date().toISOString();
  return drawn.map((q, index) => ({
    ...q,
    id: makeId(index),
    marks: input.marks,
    negative_marks: input.negative_marks,
    sort_order: index,
    created_at: now,
    updated_at: now,
  }));
}
