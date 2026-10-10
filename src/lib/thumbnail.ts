import { z } from "zod";
export const thumbnailUrlSchema = z
  .string()
  .trim()
  .max(4000)
  .refine(
    (value) =>
      !value ||
      /^https?:\/\//i.test(value) ||
      /^\/(?!\/)/.test(value) ||
      value.startsWith("kkcc-file://"),
    "Use an http(s) image URL or a KKCC upload.",
  )
  .nullable()
  .optional();
export const thumbnailFields = {
  thumbnail_url: thumbnailUrlSchema,
  thumbnail_text: z.string().trim().max(200).nullable().optional(),
};
export type ThumbnailValue = { thumbnail_url?: string | null; thumbnail_text?: string | null };
