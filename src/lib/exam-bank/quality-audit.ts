import { ACTIVE_TEMPLATES } from "./index";
import { isPublishableQuestion, type Difficulty, type Template } from "./core";

export type BankQualityIssue = {
  templateId: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  index: number;
  reason: string;
};

export type BankQualityReport = {
  templates: number;
  sampled: number;
  publishable: number;
  invalid: number;
  duplicatePrompts: number;
  missingExamTags: number;
  issues: BankQualityIssue[];
  byDifficulty: Record<Difficulty, { templates: number; sampled: number; invalid: number }>;
};

const clean = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();

function auditQuestion(template: Template, index: number) {
  const q = template.at(index);
  if (!q) return "builder returned no question";
  if (!isPublishableQuestion(q)) return "failed publishability gate";

  const options = [q.answer, ...q.distractors].map(clean);
  if (options.length !== 4 || new Set(options).size !== 4) return "duplicate or incomplete options";
  if (!q.exams.length) return "missing exam tag";
  if (q.prompt.includes("undefined") || q.explanation.includes("undefined"))
    return "undefined content";
  return null;
}

/**
 * Fast deterministic quality audit. It checks first, middle and last indices
 * of every template, plus a small spread for larger templates. It is designed
 * for the admin panel and CI, not as a replacement for expert fact review.
 */
export function auditQuestionBank(
  templates: readonly Template[] = ACTIVE_TEMPLATES,
): BankQualityReport {
  const issues: BankQualityIssue[] = [];
  const seenPrompts = new Map<string, string>();
  const byDifficulty: BankQualityReport["byDifficulty"] = {
    Easy: { templates: 0, sampled: 0, invalid: 0 },
    Moderate: { templates: 0, sampled: 0, invalid: 0 },
    Difficult: { templates: 0, sampled: 0, invalid: 0 },
  };

  let sampled = 0;
  let publishable = 0;
  let duplicatePrompts = 0;
  let missingExamTags = 0;

  for (const template of templates) {
    byDifficulty[template.difficulty].templates += 1;
    const indices = new Set<number>([
      0,
      Math.max(0, template.count - 1),
      Math.floor(template.count / 2),
    ]);
    if (template.count > 100) {
      indices.add(Math.floor(template.count * 0.25));
      indices.add(Math.floor(template.count * 0.75));
    }

    for (const index of indices) {
      if (index < 0 || index >= template.count) continue;
      sampled += 1;
      byDifficulty[template.difficulty].sampled += 1;
      const q = template.at(index);
      const reason = auditQuestion(template, index);
      if (reason) {
        byDifficulty[template.difficulty].invalid += 1;
        issues.push({
          templateId: template.id,
          subject: template.subject,
          topic: template.topic,
          difficulty: template.difficulty,
          index,
          reason,
        });
        if (reason === "missing exam tag") missingExamTags += 1;
        continue;
      }
      publishable += 1;
      if (!q) continue;
      const key = clean(q.prompt);
      const previous = seenPrompts.get(key);
      if (previous && previous !== template.id) {
        duplicatePrompts += 1;
        issues.push({
          templateId: template.id,
          subject: template.subject,
          topic: template.topic,
          difficulty: template.difficulty,
          index,
          reason: `duplicate prompt with ${previous}`,
        });
      } else {
        seenPrompts.set(key, template.id);
      }
    }
  }

  return {
    templates: templates.length,
    sampled,
    publishable,
    invalid: issues.filter(
      (x) =>
        x.reason === "failed publishability gate" ||
        x.reason === "builder returned no question" ||
        x.reason === "duplicate or incomplete options" ||
        x.reason === "undefined content" ||
        x.reason === "missing exam tag",
    ).length,
    duplicatePrompts,
    missingExamTags,
    issues: issues.slice(0, 100),
    byDifficulty,
  };
}
