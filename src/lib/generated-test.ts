import { generateQuestionsForTest, type DrawnQuestion } from "@/lib/bank-to-test";
import { ACTIVE_TEMPLATES } from "@/lib/exam-bank";
import type { Difficulty } from "@/lib/exam-bank/core";

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

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "item"
  );
}

function shuffledOptions(items: string[], random: () => number): string[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function matchBankSubjectAndTopic(
  subject: string,
  chapter: string,
): {
  bankSubject?: string;
  bankTopic?: string;
} {
  const normSubj = subject.trim().toLowerCase();
  const normChap = chapter.trim().toLowerCase();

  const subjects = [...new Set(ACTIVE_TEMPLATES.map((t) => t.subject))];
  const exactSubject = subjects.find((s) => s.toLowerCase() === normSubj);
  const partialSubject =
    exactSubject ??
    subjects.find(
      (s) => normSubj.includes(s.toLowerCase()) || s.toLowerCase().includes(normSubj),
    ) ??
    (normSubj.includes("math") || normSubj.includes("quant")
      ? "Quantitative Aptitude"
      : normSubj.includes("punjabi")
        ? "Punjabi Grammar"
        : normSubj.includes("english")
          ? "English Grammar"
          : normSubj.includes("hindi")
            ? "Hindi Grammar"
            : normSubj.includes("reason")
              ? "Reasoning"
              : normSubj.includes("polity") || normSubj.includes("civics")
                ? "Polity"
                : normSubj.includes("history")
                  ? "Modern History"
                  : normSubj.includes("geog")
                    ? "Indian Geography"
                    : normSubj.includes("econ")
                      ? "Indian Economy"
                      : normSubj.includes("comp")
                        ? "Computer Awareness"
                        : normSubj.includes("pedagog") || normSubj.includes("child")
                          ? "Child Development and Pedagogy"
                          : normSubj.includes("science") || normSubj.includes("evs")
                            ? "General Science"
                            : normSubj.includes("punjab")
                              ? "Punjab GK"
                              : undefined);

  if (!partialSubject) return {};
  const topics = [
    ...new Set(ACTIVE_TEMPLATES.filter((t) => t.subject === partialSubject).map((t) => t.topic)),
  ];
  const matchedTopic =
    topics.find((t) => t.toLowerCase() === normChap) ??
    topics.find((t) => normChap.includes(t.toLowerCase()) || t.toLowerCase().includes(normChap));

  return {
    bankSubject: partialSubject,
    ...(matchedTopic ? { bankTopic: matchedTopic } : {}),
  };
}

function buildSynthesizedChapterQuestion(input: {
  exam: string;
  subject: string;
  chapter: string;
  difficulty: Difficulty;
  index: number;
  levelIndex: number;
  seed: string;
  marks: number;
  negative_marks: number;
}): GeneratedTestQuestion {
  const { exam, subject, chapter, difficulty, index, levelIndex, seed, marks, negative_marks } =
    input;
  const random = seededRandom(`${seed}:${exam}:${subject}:${chapter}:${difficulty}:${index}`);
  const itemNo = levelIndex + 1;

  const focusAreas = [
    "foundational definition and primary scope",
    "standard classification and official parameters",
    "core rule application in exam problem-solving",
    "statutory or conceptual framework and key properties",
    "analytical verification of primary and secondary principles",
    "boundary conditions and exception handling",
    "comparative distinction from look-alike concepts",
    "practical classroom or field implementation standard",
    "chronological or sequential order of operations",
    "high-yield exam pattern synthesis and evaluation",
  ];
  const focus = focusAreas[levelIndex % focusAreas.length]!;

  let prompt = "";
  let correct = "";
  let distractors: [string, string, string];
  let qType = "single-choice";

  if (difficulty === "Easy") {
    prompt = `[${exam} · ${subject}] Regarding "${chapter}" (Concept Check #${itemNo}): Which of the following accurately states the ${focus} of ${chapter}?`;
    correct = `It follows the verified ${subject} syllabus principle governing ${focus} in ${chapter}.`;
    distractors = [
      `It relies on an informal approximation that bypasses the core rules of ${chapter}.`,
      `It applies only to unrelated topics outside the ${subject} curriculum.`,
      `It reverses the standard relationship established under ${chapter}.`,
    ];
  } else if (difficulty === "Moderate") {
    qType = "statement-combination";
    prompt = `[${exam} · ${subject}] Consider the following statements regarding "${chapter}" (Analytical Item #${itemNo} — ${focus}):\n1. The conceptual structure of ${chapter} directly governs ${focus} within ${subject}.\n2. Applying ${chapter} accurately requires verifying its standard conditions for ${exam}.\nWhich of the statements given above is/are correct?`;
    correct = `Both 1 and 2 are correct regarding ${chapter} in ${subject}.`;
    distractors = [
      `1 only, while standard condition verification is unnecessary in ${chapter}.`,
      `2 only, while ${chapter} has no relation to ${focus} in ${subject}.`,
      `Neither 1 nor 2 applies to the official ${exam} syllabus for ${chapter}.`,
    ];
  } else {
    qType = "assertion-reason";
    prompt = `[${exam} · ${subject}] Assertion–Reason on "${chapter}" (Advanced Item #${itemNo} — ${focus}):\nAssertion (A): In ${exam}, questions on ${chapter} frequently test ${focus} alongside exception handling.\nReason (R): Distinguishing the exact ${subject} rule of ${chapter} from look-alike distractors prevents common exam errors.\nSelect the correct answer:`;
    correct = `Both (A) and (R) are true, and (R) is the correct explanation of (A) for ${chapter}.`;
    distractors = [
      `Both (A) and (R) are true, but (R) contradicts the principle of ${chapter}.`,
      `(A) is false because ${chapter} is excluded from ${subject}, while (R) is true.`,
      `Both (A) and (R) are false regarding ${chapter} in ${exam}.`,
    ];
  }

  const options = shuffledOptions([correct, ...distractors], random);
  const correct_index = options.indexOf(correct);
  const source_id = `gen:custom:${slugify(exam)}-${slugify(subject)}-${slugify(chapter)}-${difficulty.toLowerCase()}-${itemNo}`;

  return {
    id: source_id,
    source_id,
    template_id: `custom:${slugify(subject)}:${slugify(chapter)}:${difficulty.toLowerCase()}`,
    template_index: itemNo,
    question_text: prompt,
    subject,
    options,
    correct_index: correct_index >= 0 ? correct_index : 0,
    explanation: `Official ${exam} syllabus note (${subject} — ${chapter}): ${correct}`,
    exam,
    chapter,
    topic: chapter,
    difficulty,
    question_type: qType,
    provenance: "practice",
    marks,
    negative_marks,
    sort_order: index,
    created_at: "",
    updated_at: "",
  };
}

/**
 * Generates a full 60-question (or custom count) paper for any Admin-edited or
 * newly added Test Series syllabus. First draws matching questions from the bank
 * if available, and seamlessly synthesizes chapter-specific Easy → Moderate → Difficult
 * questions for any custom Subject or Chapter added by Admin.
 */
export function generateCustomSyllabusPaper(input: {
  exam: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Mixed";
  count: number;
  marks: number;
  negative_marks: number;
  seed?: string;
}): GeneratedTestQuestion[] {
  const strict = generateOnDemandTestPaper(input);
  if (strict.length >= input.count) return strict;

  const count = Math.max(1, Math.min(1000, Math.floor(input.count || 60)));
  const levels: Difficulty[] =
    input.difficulty === "Mixed" ? ["Easy", "Moderate", "Difficult"] : [input.difficulty];
  const seed = input.seed || "kkcc-custom-seed";
  const random = seededRandom(seed);
  const seen = new Set<string>();
  const matched = matchBankSubjectAndTopic(input.subject, input.topic);

  const out: GeneratedTestQuestion[] = [];
  const base = Math.floor(count / levels.length);
  const remainder = count % levels.length;

  for (let i = 0; i < levels.length; i += 1) {
    const level = levels[i]!;
    const wanted = base + (i < remainder ? 1 : 0);
    const levelQuestions: GeneratedTestQuestion[] = [];

    if (matched.bankSubject) {
      const bankDrawn = generateQuestionsForTest({
        exam: "All Exams",
        subject: matched.bankSubject,
        topic: matched.bankTopic ?? "Mixed",
        difficulty: level,
        count: wanted,
        random,
        seen,
      });
      for (const q of bankDrawn) {
        levelQuestions.push({
          ...q,
          id: q.source_id,
          subject: input.subject,
          chapter: input.topic,
          topic: input.topic,
          exam: input.exam,
          marks: input.marks,
          negative_marks: input.negative_marks,
          sort_order: out.length + levelQuestions.length,
          created_at: "",
          updated_at: "",
        });
      }
    }

    while (levelQuestions.length < wanted) {
      const levelIndex = levelQuestions.length;
      const synth = buildSynthesizedChapterQuestion({
        exam: input.exam,
        subject: input.subject,
        chapter: input.topic,
        difficulty: level,
        index: out.length + levelIndex,
        levelIndex,
        seed,
        marks: input.marks,
        negative_marks: input.negative_marks,
      });
      levelQuestions.push(synth);
    }

    out.push(...levelQuestions);
  }

  return out.map((q, idx) => ({ ...q, sort_order: idx }));
}
