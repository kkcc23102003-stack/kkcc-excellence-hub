import { z } from "zod";
import { easyQuestionSchema, type EasyQuestion } from "./easy-text-test";
export const folderPathSchema = z
  .object({
    series_name: z.string().trim().max(120).default(""),
    subject: z.string().trim().min(1).max(80),
    chapter: z.string().trim().max(120).default(""),
    topic: z.string().trim().max(120).default(""),
  })
  .refine((path) => !path.topic || Boolean(path.chapter), "Topic ke liye pehle chapter dein.");
export type FolderPath = z.infer<typeof folderPathSchema>;
export type FolderRecord = FolderPath & { id: string };
export type FolderTest = {
  id: string;
  title: string;
  series_name: string;
  subject: string;
  syllabus_subject: string;
  syllabus_chapter: string;
  syllabus_topic: string;
  questions_count: number;
  question_source: string;
  is_published: boolean;
  is_paid?: boolean;
  assembly_source_ids?: string[];
};
export function testPath(test: FolderTest): FolderPath {
  return {
    series_name: test.series_name || "",
    subject: test.syllabus_subject || test.subject,
    chapter: test.syllabus_chapter || "",
    topic: test.syllabus_topic || "",
  };
}
export function pathContains(parent: FolderPath, child: FolderPath) {
  return (
    parent.series_name === child.series_name &&
    parent.subject === child.subject &&
    (!parent.chapter || parent.chapter === child.chapter) &&
    (!parent.topic || parent.topic === child.topic)
  );
}
export function pathKey(path: FolderPath) {
  return JSON.stringify([path.series_name, path.subject, path.chapter, path.topic]);
}
export function expandFolderPaths(paths: FolderPath[]): FolderPath[] {
  const result = new Map<string, FolderPath>();
  for (const path of paths) {
    if (!path.subject) continue;
    for (const node of [
      { ...path, chapter: "", topic: "" },
      ...(path.chapter ? [{ ...path, topic: "" }] : []),
      ...(path.topic ? [path] : []),
    ])
      result.set(pathKey(node), node);
  }
  return [...result.values()].sort((a, b) => pathKey(a).localeCompare(pathKey(b)));
}
export function combineOwnQuestions(sources: { test: FolderTest; questions: EasyQuestion[] }[]) {
  if (!sources.length) throw new Error("Select at least one saved question set.");
  const first = testPath(sources[0]!.test);
  const seen = new Map<string, EasyQuestion>();
  let duplicates = 0;
  for (const source of sources) {
    const path = testPath(source.test);
    if (path.subject !== first.subject || path.series_name !== first.series_name)
      throw new Error("Complete test must use one subject from one series only.");
    if (source.test.question_source !== "manual" || source.test.assembly_source_ids?.length)
      throw new Error(
        "Select original manual question sets, not generated or already combined papers.",
      );
    for (const input of source.questions) {
      const q = easyQuestionSchema.parse(input);
      const key = JSON.stringify([q.question_text.trim(), q.options]);
      const previous = seen.get(key);
      if (previous) {
        if (previous.correct_index !== q.correct_index || previous.explanation !== q.explanation)
          throw new Error(
            "Duplicate question has different answer/explanation. Correct the source sets before combining.",
          );
        duplicates++;
        continue;
      }
      seen.set(key, q);
    }
  }
  if (!seen.size) throw new Error("Selected folders have no questions yet.");
  if (seen.size > 200)
    throw new Error(
      `${seen.size} questions selected; maximum 200 per test. Select fewer sets. Nothing was truncated.`,
    );
  return { questions: [...seen.values()], duplicates };
}
