import { z } from "zod";
export const testSchema = z.object({
  id: z.string().uuid().optional(),
  course_id: z.string().uuid().nullable().optional(),
  lecture_id: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(2).max(200),
  instructions: z.string().trim().max(4000),
  subject: z.string().trim().max(80),
  duration_minutes: z.number().int().min(0).max(1000),
  question_timer_seconds: z.number().int().min(0).max(7200).default(0),
  timer_mode: z.enum(["test", "question", "unlimited"]).default("test"),
  questions_count: z.number().int().min(0),
  total_marks: z.number().int().min(0),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0),
  // Paid test series fields. Every test states the exam it is oriented for
  // and which rung of the Easy/Moderate/Difficult ladder it sits on.
  exam_track: z.string().trim().max(80).default(""),
  level: z.enum(["Easy", "Moderate", "Difficult", "Mixed"]).default("Mixed"),
  series_name: z.string().trim().max(120).default(""),
  is_paid: z.boolean().default(false),
  price_inr: z.number().int().min(0).max(100000).default(0),
  price_coins: z.number().int().min(0).max(1000000).default(0),
  question_source: z.enum(["manual", "deterministic"]).default("manual"),
  generation_exam: z.string().trim().max(80).default("All Exams"),
  generation_subject: z.string().trim().max(80).default(""),
  generation_topic: z.string().trim().max(160).default("Mixed"),
  generation_difficulty: z.enum(["Easy", "Moderate", "Difficult", "Mixed"]).default("Difficult"),
  generation_count: z.number().int().min(0).max(1000).default(0),
  syllabus_subject: z.string().trim().max(120).default(""),
  syllabus_chapter: z.string().trim().max(200).default(""),
  syllabus_topic: z.string().trim().max(240).default(""),
});

/** Zod defaults must not become edits on a partial settings update. */
export function parseTestSettingsPatch(input: unknown) {
  const parsed = testSchema.partial().required({ id: true }).parse(input);
  return Object.fromEntries(
    Object.entries(parsed).filter(([key]) => Object.prototype.hasOwnProperty.call(input, key)),
  ) as typeof parsed;
}
