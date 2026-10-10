import { z } from "zod";
import { parseBulkMcqText } from "./test-bulk-parse";
export const easyQuestionSchema = z
  .object({
    question_text: z.string().trim().min(3).max(2000),
    options: z.array(z.string().trim().min(1).max(600)).min(2).max(6),
    correct_index: z.number().int().min(0).max(5),
    explanation: z.string().max(4000),
  })
  .superRefine((q, ctx) => {
    if (q.correct_index >= q.options.length)
      ctx.addIssue({ code: "custom", message: "Correct answer select karein" });
    if (new Set(q.options.map((o) => o.toLocaleLowerCase())).size !== q.options.length)
      ctx.addIssue({ code: "custom", message: "Options duplicate nahi hone chahiye" });
  });
export const easyTestSchema = z
  .object({
    publish: z.boolean().default(true),
    topic: z.string().trim().max(120).default(""),
    assembly_source_ids: z.array(z.string().uuid()).default([]),
    is_paid: z.boolean().default(false),
    price_inr: z.number().int().min(0).max(100000).default(0),
    price_coins: z.number().int().min(0).max(1000000).default(0),
    id: z.string().uuid(),
    title: z.string().trim().min(2).max(200),
    subject: z.string().trim().min(1).max(80),
    chapter: z.string().trim().min(1).max(120),
    series_name: z.string().trim().max(120).default(""),
    duration_minutes: z.number().int().min(1).max(300),
    questions: z.array(easyQuestionSchema).min(1),
  })
  .superRefine((test, ctx) => {
    if (test.is_paid && test.price_inr <= 0 && test.price_coins <= 0)
      ctx.addIssue({
        code: "custom",
        path: ["price_inr"],
        message: "Paid test ke liye rupee price, coin price ya dono set karein.",
      });
  })
  .transform((test) => (test.is_paid ? test : { ...test, price_inr: 0, price_coins: 0 }));
export type EasyQuestion = z.infer<typeof easyQuestionSchema>;
export type EasyTestInput = z.infer<typeof easyTestSchema>;
export function previewEasyText(text: string) {
  const parsed = parseBulkMcqText(text);
  const headings = text
    .split(/\r?\n/)
    .filter((line) => /^\s*(?:Q\s*\d+\s*[).:-]|\d+\.\s)/i.test(line)).length;
  return {
    questions: parsed.map(({ question_text, options, correct_index, explanation }) => ({
      question_text,
      options,
      correct_index,
      explanation,
    })),
    detected: headings,
    incomplete: Math.max(0, headings - parsed.length),
  };
}
