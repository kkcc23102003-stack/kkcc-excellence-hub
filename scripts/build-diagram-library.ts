/** Rebuild deterministic revision maps from the scoped, active syllabus bank.
 * Run: npx tsx scripts/build-diagram-library.ts
 * No network, Supabase writes, invented relationships, or random sampling.
 */
import { writeFileSync } from "node:fs";
import { ACTIVE_TEMPLATES } from "../src/lib/exam-bank/index";
import { isPublishableQuestion, type Template } from "../src/lib/exam-bank/core";

const groups = new Map<string, Template[]>();
for (const template of ACTIVE_TEMPLATES) {
  const key = JSON.stringify([template.subject, template.topic]);
  groups.set(key, [...(groups.get(key) ?? []), template]);
}
const clean = (text: string) => text.replace(/\r?\n/g, " ").replace(/:::/g, "—").trim();
const library = [...groups.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, templates]) => {
    const [subject, topic] = JSON.parse(key) as [string, string];
    const facts: {
      prompt: string;
      answer: string;
      explanation: string;
      templateId: string;
      index: number;
    }[] = [];
    const seen = new Set<string>();
    const seenExplanations = new Set<string>();
    const seenAnswers = new Set<string>();
    // Prefer breadth: one example from each source template, then more indices.
    for (let index = 0; index < 40 && facts.length < 4; index++) {
      for (const template of templates) {
        if (index >= template.count || facts.length >= 4) continue;
        const question = template.at(index);
        if (!question || !isPublishableQuestion(question) || seen.has(question.prompt)) continue;
        if (question.subject !== subject || question.topic !== topic) continue;
        // The bank's negative pair questions have a false pair as the answer.
        // Extract ONLY the explicit corrected pair from its explanation, never
        // display the deliberately wrong MCQ answer as a fact-map label.
        const corrected =
          /^(.+?) is correctly matched with (.+?), not .+?\. The other three pairs are correctly matched\.$/s.exec(
            question.explanation,
          );
        const negative =
          /\b(?:not|incorrect|except|neither|none of)\b|consider the following|which of (?:the |these )?statements|how many of (?:the |these )?statements/i.test(
            question.prompt + " " + question.answer,
          );
        if (negative && !corrected) continue;
        const prompt = corrected
          ? `What is the correct match for ${corrected[1]}?`
          : question.prompt;
        const answer = corrected ? corrected[2]! : question.answer;
        const explanation = corrected ? `${corrected[1]} — ${corrected[2]}.` : question.explanation;
        if (seenExplanations.has(explanation) || seenAnswers.has(answer)) continue;
        seenAnswers.add(answer);
        seenExplanations.add(explanation);
        seen.add(question.prompt);
        facts.push({
          prompt,
          answer,
          explanation,
          templateId: template.id,
          index,
        });
      }
    }
    if (!facts.length) throw new Error(`No usable source for ${subject} / ${topic}`);
    const body = [
      `# ${clean(topic)} — revision map`,
      `Subject: ${clean(subject)}`,
      "This map groups worked examples; branches do not imply a process, chronology or physical structure.",
      `:::tree ${clean(topic)} — revision map`,
      clean(topic),
      ...facts.map((fact, index) => `${index + 1}. ${clean(fact.answer)}`),
      ":::",
      ...facts.flatMap((fact, index) => [
        `\n## Example ${index + 1}`,
        clean(fact.prompt),
        `Answer: ${clean(fact.answer)}`,
        `Explanation: ${clean(fact.explanation)}`,
      ]),
    ].join("\n");
    return {
      id: key,
      subject,
      title: topic,
      kind: "revision-map" as const,
      exams: [...new Set(templates.flatMap((template) => template.exams))].sort(),
      body,
      sources: facts.map(({ templateId, index }) => ({ templateId, index })),
    };
  });
writeFileSync(
  "src/lib/notes-visuals/syllabus-library.json",
  JSON.stringify(library, null, 2) + "\n",
);
console.log(
  `${library.length} topic maps / ${new Set(library.map((row) => row.subject)).size} subjects / ${new Set(library.flatMap((row) => row.exams)).size} exam tracks`,
);
const subjects = [...new Set(library.map((row) => row.subject))].sort();
writeFileSync(
  "docs/diagram-library-coverage.md",
  [
    "# Diagram library coverage",
    "",
    `Generated from ACTIVE_TEMPLATES: **${library.length} unique subject/topic maps**, **${subjects.length} subjects**, **${new Set(library.flatMap((row) => row.exams)).size} exam tracks**.`,
    "",
    "Scope: the active, scoped syllabus question bank in this checkout, not a live Supabase syllabus audit. The separate curated teaching diagrams supplement these revision maps. Maps contain selected source examples, not every fact in each chapter and not anatomical/circuit illustrations. They require teacher review before publication.",
    "",
    "Regenerate with `npx tsx scripts/build-diagram-library.ts` after bank/syllabus updates. Missing source content fails generation instead of silently inserting a placeholder. Source template IDs and indices are retained in the JSON for audit. Negative-pair answers are never used as factual labels: only explicitly corrected pairs from their explanations are extracted.",
    "",
    "| Subject | Topic maps |",
    "| --- | ---: |",
    ...subjects.map(
      (subject) => `| ${subject} | ${library.filter((row) => row.subject === subject).length} |`,
    ),
    "",
  ].join("\n"),
);
