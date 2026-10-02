/**
 * Shared CMS types + helpers. All course content is database-driven.
 */
import type { DB as Database } from "@/integrations/supabase/db";

export type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
export type LectureRow = Database["public"]["Tables"]["lectures"]["Row"];
export type MaterialRow = Database["public"]["Tables"]["materials"]["Row"];

export type Course = CourseRow;
export type Lecture = LectureRow;
export type Material = MaterialRow;

export const CATEGORIES = [
  "School",
  "Board Exams",
  "Medical",
  "Non-Medical",
  "Commerce",
  "Competitive Exams",
] as const;

export const COURSE_TYPES = ["Live", "Recorded", "Hybrid"] as const;

export const COURSE_STATUSES = ["draft", "published", "archived"] as const;

export const MATERIAL_TYPES = [
  "Notes",
  "PDFs",
  "Formula Sheets",
  "MCQs",
  "Question Banks",
  "Previous Year Papers",
  "Revision Material",
] as const;

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const isFreeCourse = (course: Pick<Course, "price"> & { coin_price?: number | null }) =>
  course.price <= 0 && Number(course.coin_price ?? 0) <= 0;

export const coursePriceLabel = (course: Pick<Course, "price"> & { coin_price?: number | null }) =>
  isFreeCourse(course)
    ? "Free"
    : course.price > 0
      ? formatINR(course.price)
      : `${course.coin_price} 23KAAT`;

export const coinPriceOf = (item: {
  price?: number | null | undefined;
  coin_price?: number | null | undefined;
}) => {
  const rupeePrice = Math.max(0, Number(item.price ?? 0) || 0);
  const coinPrice = Math.max(0, Number(item.coin_price ?? 0) || 0);
  return Math.round(coinPrice > 0 ? coinPrice : rupeePrice);
};

export const coinPriceLabel = (item: {
  price?: number | null | undefined;
  coin_price?: number | null | undefined;
}) => {
  const coins = coinPriceOf(item);
  return coins <= 0 ? "Free" : `${coins} 23KAAT`;
};

export const discountOf = (
  course: Pick<Course, "price" | "original_price" | "discount_percent">,
) =>
  course.discount_percent > 0
    ? course.discount_percent
    : course.original_price > 0
      ? Math.max(0, Math.round(100 - (course.price / course.original_price) * 100))
      : 0;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export type CourseModule = { title: string; lectures: Lecture[] };

export const groupLectures = (lectures: Lecture[]): CourseModule[] => {
  const modules: CourseModule[] = [];
  for (const lecture of lectures) {
    const key = lecture.module_title || "Module";
    let group = modules.find((m) => m.title === key);
    if (!group) {
      group = { title: key, lectures: [] };
      modules.push(group);
    }
    group.lectures.push(lecture);
  }
  return modules;
};
