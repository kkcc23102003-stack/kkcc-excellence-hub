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

/** A test must never silently start with fewer questions than its recipe asks for. */
export class QuestionBankCoverageError extends Error {
  constructor(
    readonly requested: number,
    readonly available: number,
    scope: { exam: string; subject: string; topic: string; difficulty: string },
  ) {
    super(
      `Question bank coverage is short: it produced ${available} of ${requested} required unique, quality-approved questions for ${scope.exam} / ${scope.subject} / ${scope.topic} (${scope.difficulty}). The paper was not started; no duplicate, out-of-scope, or different-difficulty questions were added.`,
    );
    this.name = "QuestionBankCoverageError";
  }
}

function makeId(index: number) {
  // These ids are only in-memory React keys. They are deliberately not UUIDs
  // and are never written to the database.
  return `generated-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 10)}`;
}

export function generateOnDemandTestPaper(input: {
  exam: string;
  subject?: string;
  subjects?: string[];
  topic?: string;
  topics?: string[];
  difficulty: "Easy" | "Moderate" | "Difficult" | "Mixed";
  count: number;
  marks: number;
  negative_marks: number;
}): GeneratedTestQuestion[] {
  const count = Math.max(1, Math.min(1000, Math.floor(input.count)));
  const subjects = [
    ...new Set(input.subjects?.length ? input.subjects : input.subject ? [input.subject] : []),
  ];
  const topics = [...new Set(input.topics?.length ? input.topics : [input.topic || "Mixed"])];
  const scopes = subjects.flatMap((subject) => topics.map((topic) => ({ subject, topic })));
  if (!scopes.length) throw new Error("The test has no mapped question-bank subject.");

  const levels: Array<"Easy" | "Moderate" | "Difficult"> =
    input.difficulty === "Mixed" ? ["Easy", "Moderate", "Difficult"] : [input.difficulty];

  const drawn: DrawnQuestion[] = [];
  for (let i = 0; i < levels.length; i += 1) {
    const wantedAtLevel = Math.floor(count / levels.length) + (i < count % levels.length ? 1 : 0);
    for (let scopeIndex = 0; scopeIndex < scopes.length; scopeIndex += 1) {
      const quota =
        Math.floor(wantedAtLevel / scopes.length) +
        (scopeIndex < wantedAtLevel % scopes.length ? 1 : 0);
      if (quota <= 0) continue;
      const scope = scopes[scopeIndex]!;
      // Different difficulty families can contain the same stem. Draw a small
      // reserve from this exact scope/level so global de-duplication can replace
      // collisions without borrowing another topic, subject, or difficulty.
      const reserve = Math.max(3, Math.ceil(quota * 0.15));
      const questions = generateQuestionsForTest({
        exam: input.exam,
        subject: scope.subject,
        topic: scope.topic,
        difficulty: levels[i]!,
        count: quota + reserve,
      });
      drawn.push(...questions);
    }
  }

  // Shuffle the difficulty layers so Mixed papers do not appear in fixed
  // Easy -> Moderate -> Difficult blocks.
  for (let i = drawn.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [drawn[i], drawn[j]] = [drawn[j]!, drawn[i]!];
  }

  const seenPrompts = new Set<string>();
  const uniqueDrawn = drawn.filter((question) => {
    const key = question.question_text.trim().replace(/\s+/g, " ").toLowerCase();
    if (seenPrompts.has(key)) return false;
    seenPrompts.add(key);
    return true;
  });

  if (uniqueDrawn.length < count) {
    throw new QuestionBankCoverageError(count, uniqueDrawn.length, {
      exam: input.exam,
      subject: subjects.join(", "),
      topic: topics.join(", "),
      difficulty: input.difficulty,
    });
  }

  const now = new Date().toISOString();
  return uniqueDrawn.slice(0, count).map((q, index) => ({
    ...q,
    id: makeId(index),
    marks: input.marks,
    negative_marks: input.negative_marks,
    sort_order: index,
    created_at: now,
    updated_at: now,
  }));
}
