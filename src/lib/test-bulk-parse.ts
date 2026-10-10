/**
 * Bulk MCQ parsing — shared by the admin panel (live preview) and the server
 * (final insert). One implementation means the preview the admin approves is
 * byte-for-byte what gets published: nothing is re-parsed differently later.
 *
 * Accepted shape (all common variants work):
 *
 *   Q1. With which words does the Preamble begin?
 *   A) We, the People of India
 *   B) In the Name of Parliament
 *   C) By Order of the President
 *   D) We, the Citizens of India
 *   Answer: A
 *   Explanation: The Preamble begins with 'We, the People of India'.
 *
 * Options may be `A)` / `(A)` / `A.` / `1)` … `4)`, the answer line may be
 * `Answer:` / `Ans:` / `Correct:`, and the explanation may be `Explanation:` or
 * `Solution:` followed by extra lines.
 */

export type ParsedBulkQuestion = {
  question_text: string;
  options: string[];
  correct_index: number;
  /** Exactly what the admin pasted, kept as-is (never rewritten). */
  explanation: string;
  /** "paste" when the admin supplied an explanation, "auto" when generated. */
  explanation_source: "paste" | "auto";
  marks?: number;
  negative_marks?: number;
};

function optionIndex(value: string) {
  const trimmed = value.trim();
  if (/^[A-D]$/i.test(trimmed)) return trimmed.toUpperCase().charCodeAt(0) - 65;
  if (/^[1-4]$/.test(trimmed)) return Number(trimmed) - 1;
  return -1;
}

function cleanQuestionText(value: string) {
  return value.replace(/^\s*(?:q\s*)?\d+\s*[).:-]\s*/i, "").trim();
}

/** The one-line fallback used only when the admin pasted no explanation. */
export function buildFallbackExplanation(
  question: Pick<ParsedBulkQuestion, "question_text" | "options" | "correct_index">,
  subject: string,
): string {
  const correctOption = question.options[question.correct_index] ?? "the marked option";
  return `Correct answer is ${correctOption}. This ${subject || "exam"} question is solved by matching the question statement with the correct concept and eliminating the other options. Review the topic once more for stronger retention.`;
}

export function parseBulkMcqText(text: string): ParsedBulkQuestion[] {
  const lines = (text ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const questions: ParsedBulkQuestion[] = [];
  let current: {
    question: string[];
    options: string[];
    answerRaw: string;
    explanation: string[];
    mode: "question" | "option" | "explanation";
  } | null = null;

  const flush = () => {
    if (!current) return;
    const question_text = current.question.join(" ").trim();
    const options = current.options.map((option) => option.trim()).filter(Boolean);
    let correct_index = optionIndex(current.answerRaw);
    if (correct_index < 0 && current.answerRaw) {
      const answerText = current.answerRaw.toLowerCase();
      correct_index = options.findIndex((option) => option.toLowerCase() === answerText);
    }
    if (
      question_text &&
      options.length >= 2 &&
      correct_index >= 0 &&
      correct_index < options.length
    ) {
      const explanation = current.explanation.join(" ").trim();
      questions.push({
        question_text,
        options,
        correct_index,
        explanation,
        explanation_source: explanation ? "paste" : "auto",
      });
    }
    current = null;
  };

  for (const line of lines) {
    const questionMatch = line.match(/^\s*(?:q\s*)?\d+\s*[).:-]\s*(.+)$/i);
    const optionMatch = line.match(/^\s*(?:\(?([A-Da-d])\)?|([1-4]))\s*[).:-]\s*(.+)$/);
    const answerMatch = line.match(/^\s*(?:answer|ans|correct(?:\s*answer)?)\s*[:-]\s*(.+)$/i);
    const explanationMatch = line.match(/^\s*(?:explanation|solution)\s*[:-]\s*(.*)$/i);

    /*
     * "1) 15 August 1947" matches both the question and the option pattern.
     * When the label is exactly the option that should come next (A/B/C/D or
     * 1/2/3/4) and the current question is still collecting options, it is an
     * option — not a new question.
     */
    const optionLabel = (optionMatch?.[1] ?? optionMatch?.[2] ?? "").toUpperCase();
    const open = current;
    const expectedIndex = open ? open.options.length : 0;
    const looksLikeExpectedOption =
      Boolean(optionMatch) &&
      Boolean(open) &&
      !open?.answerRaw &&
      open?.explanation.length === 0 &&
      (optionLabel === String.fromCharCode(65 + expectedIndex) ||
        optionLabel === String(expectedIndex + 1));

    if (
      questionMatch &&
      !looksLikeExpectedOption &&
      (!current || current.options.length > 0 || current.answerRaw)
    ) {
      flush();
      current = {
        question: [questionMatch[1]?.trim() ?? ""],
        options: [],
        answerRaw: "",
        explanation: [],
        mode: "question",
      };
      continue;
    }

    if (!current) {
      current = {
        question: [cleanQuestionText(line)],
        options: [],
        answerRaw: "",
        explanation: [],
        mode: "question",
      };
      continue;
    }

    if (
      questionMatch &&
      !looksLikeExpectedOption &&
      current.options.length === 0 &&
      !current.answerRaw
    ) {
      current.question.push(questionMatch[1]?.trim() ?? "");
      continue;
    }

    if (optionMatch) {
      current.options.push((optionMatch[3] ?? "").trim());
      current.mode = "option";
      continue;
    }

    if (answerMatch) {
      current.answerRaw = (answerMatch[1] ?? "").trim();
      current.mode = "explanation";
      continue;
    }

    if (explanationMatch) {
      current.explanation.push((explanationMatch[1] ?? "").trim());
      current.mode = "explanation";
      continue;
    }

    if (current.mode === "option" && current.options.length > 0) {
      current.options[current.options.length - 1] += ` ${line}`;
    } else if (current.mode === "explanation") {
      current.explanation.push(line);
    } else {
      current.question.push(cleanQuestionText(line));
    }
  }

  flush();
  return questions;
}

/**
 * Rebuild paste-style text from edited questions. Used as a safety net and for
 * "copy my checked questions" — the published rows themselves come from the
 * preview objects, so nothing can drift.
 */
export function serialiseBulkQuestions(questions: ParsedBulkQuestion[]): string {
  return questions
    .map((question, index) => {
      const letters = ["A", "B", "C", "D", "E", "F"];
      const lines = [`Q${index + 1}. ${question.question_text}`];
      question.options.forEach((option, optionIndex_) => {
        lines.push(`${letters[optionIndex_] ?? String(optionIndex_ + 1)}) ${option}`);
      });
      lines.push(
        `Answer: ${letters[question.correct_index] ?? String(question.correct_index + 1)}`,
      );
      if (question.explanation.trim()) lines.push(`Explanation: ${question.explanation.trim()}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

/** The row shape that is written to `test_questions` on publish. */
export type BulkQuestionRow = {
  question_text: string;
  subject: string;
  options: string[];
  correct_index: number;
  marks: number;
  negative_marks: number;
  explanation: string;
  sort_order: number;
};

/**
 * Turn approved preview questions into database rows. The admin's explanation
 * is copied exactly; only a question that has none gets the generated one. Used
 * by the server on publish, so preview and published test can never differ.
 */
export function prepareBulkRows(
  questions: ParsedBulkQuestion[],
  options: {
    subject: string;
    marks: number;
    negative_marks: number;
    /** sort_order of the first new row. */
    startOrder: number;
  },
): BulkQuestionRow[] {
  return questions.map((question, index) => ({
    question_text: question.question_text,
    subject: options.subject || "General",
    options: question.options,
    correct_index: question.correct_index,
    marks: question.marks ?? options.marks,
    negative_marks: question.negative_marks ?? options.negative_marks,
    explanation:
      question.explanation.trim() ||
      buildFallbackExplanation(question, options.subject || "General"),
    sort_order: options.startOrder + index,
  }));
}

/** Count of questions in pasted text — used for live hints under the textarea. */
export function countBulkQuestions(text: string): number {
  return parseBulkMcqText(text).length;
}
