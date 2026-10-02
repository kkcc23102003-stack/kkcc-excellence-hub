/**
 * KKCC public constants.
 * User-facing content is loaded from Supabase/admin-managed settings wherever possible.
 */

export const BRAND = {
  name: "Kusum Kartik Coaching Centre",
  short: "KKCC",
  tagline: "Learn Better. Understand Deeper. Achieve More.",
};

export type FAQEntry = {
  q: string;
  a: string;
};

export const FAQS: FAQEntry[] = [];

export { formatINR, CATEGORIES, MATERIAL_TYPES } from "@/lib/cms";
