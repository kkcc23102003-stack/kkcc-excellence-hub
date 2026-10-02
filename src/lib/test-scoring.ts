export type ScorableQuestion = {
  id: string;
  question_text: string;
  subject: string;
  options: string[];
  correct_index: number;
  marks: number;
  negative_marks: number;
  explanation: string;
};
export function publicQuestions(questions: readonly ScorableQuestion[]) {
  return questions.map((question) => ({
    id: question.id,
    question_text: question.question_text,
    subject: question.subject,
    options: question.options,
    marks: question.marks,
    negative_marks: question.negative_marks,
  }));
}
/** The same deterministic grading function is tested independently of the UI. */
export function gradePaper(
  questions: readonly ScorableQuestion[],
  answers: Record<string, number>,
) {
  const byId = new Map(questions.map((question) => [question.id, question]));
  for (const [id, selected] of Object.entries(answers)) {
    const question = byId.get(id);
    if (
      !question ||
      !Number.isInteger(selected) ||
      selected < 0 ||
      selected >= question.options.length
    )
      throw new Error("Answer does not belong to this attempt.");
  }
  let score = 0;
  let correct = 0;
  let attempted = 0;
  for (const question of questions) {
    const selected = answers[question.id];
    if (selected === undefined) continue;
    attempted += 1;
    if (selected === question.correct_index) {
      correct += 1;
      score += question.marks;
    } else score -= question.negative_marks;
  }
  return {
    score,
    correct,
    attempted,
    totalMarks: questions.reduce((sum, question) => sum + question.marks, 0),
    total: questions.length,
  };
}
