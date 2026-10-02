import { generateQuestionsForTest, type DrawnQuestion } from "@/lib/bank-to-test";

export type GeneratedTestQuestion = DrawnQuestion & {
  id: string;
  marks: number;
  negative_marks: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
/** Reproducible papers for server-side answer verification; never stored in Supabase. */
export function seededRandom(seed: string) {
  let state = 2166136261;
  for (const character of seed) state = Math.imul(state ^ character.charCodeAt(0), 16777619);
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function generateOnDemandTestPaper(input: {
  exam: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Mixed";
  count: number;
  marks: number;
  negative_marks: number;
  seed?: string;
}): GeneratedTestQuestion[] {
  const count = Math.max(0, Math.min(1000, Math.floor(input.count)));
  const levels: Array<"Easy" | "Moderate" | "Difficult"> =
    input.difficulty === "Mixed" ? ["Easy", "Moderate", "Difficult"] : [input.difficulty];
  const random = input.seed ? seededRandom(input.seed) : Math.random;
  const seen = new Set<string>();
  const drawn: DrawnQuestion[] = [];
  const base = Math.floor(count / levels.length);
  const remainder = count % levels.length;
  for (let i = 0; i < levels.length; i += 1) {
    const wanted = base + (i < remainder ? 1 : 0);
    drawn.push(
      ...generateQuestionsForTest({
        ...input,
        difficulty: levels[i]!,
        count: wanted,
        random,
        seen,
      }),
    );
  }
  // Preserve Easy → Moderate → Difficult ordering advertised by the existing series.
  // Sparse slices are NEVER filled with another chapter, exam or difficulty.
  return drawn.map((question, index) => ({
    ...question,
    id: question.source_id,
    marks: input.marks,
    negative_marks: input.negative_marks,
    sort_order: index,
    created_at: "",
    updated_at: "",
  }));
}
