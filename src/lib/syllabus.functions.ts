import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { projectContent } from "@/lib/project-content.server";
import type { DB as Database, SyllabusNodeRow } from "@/integrations/supabase/db";
import type { SupabaseClient } from "@supabase/supabase-js";

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

export type ParsedSyllabusNode = { subject: string; chapter: string; topic: string };

export function parseSyllabusText(raw: string): ParsedSyllabusNode[] {
  const rows: ParsedSyllabusNode[] = [];
  let subject = "";
  let chapter = "";
  for (const original of raw.split(/\r?\n/)) {
    const line = original.replace(/^\s*[-*•]\s*/, "").trim();
    if (!line) continue;
    if (line.includes("::") || line.includes("->") || line.includes("=>")) {
      const parts = line.split(/::|->|=>/);
      const subj = (parts[0] ?? "").replace(/^subject\s*:\s*/i, "").trim();
      const rest = parts.slice(1).join(" ");
      const chList = rest
        .split(/[,;|]/)
        .map((c) => c.trim())
        .filter(Boolean);
      if (subj) {
        subject = subj;
        for (const ch of chList) {
          rows.push({ subject: subj, chapter: ch, topic: ch });
        }
      }
      continue;
    }
    const path = line
      .split(/\s*>\s*/)
      .map((x) => x.trim())
      .filter(Boolean);
    if (path.length >= 3) {
      rows.push({ subject: path[0]!, chapter: path[1]!, topic: path.slice(2).join(" > ") });
      continue;
    }
    if (path.length === 2) {
      rows.push({ subject: path[0]!, chapter: path[1]!, topic: path[1]! });
      continue;
    }
    const subjectMatch = line.match(/^subject\s*:\s*(.+)$/i);
    if (subjectMatch) {
      subject = subjectMatch[1]!.trim();
      chapter = "";
      continue;
    }
    const chapterMatch = line.match(/^(?:chapter|ch\.?|unit)\s*(?:\d+\s*[-:.]\s*)?(.+)$/i);
    if (chapterMatch) {
      chapter = chapterMatch[1]!.trim();
      continue;
    }
    const topicMatch = line.match(/^(?:topic)\s*(?:\d+\s*[-:.]\s*)?(.+)$/i);
    if (topicMatch && subject && chapter) {
      rows.push({ subject, chapter, topic: topicMatch[1]!.trim() });
      continue;
    }
    if (subject && chapter) rows.push({ subject, chapter, topic: line });
    else if (subject && !chapter) {
      chapter = line;
      rows.push({ subject, chapter: line, topic: line });
    } else if (!subject) subject = line;
  }
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = `${row.subject}\u0000${row.chapter}\u0000${row.topic}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function syllabusNodesToRows(nodes: SyllabusNodeRow[]): ParsedSyllabusNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const rows: ParsedSyllabusNode[] = [];
  for (const node of nodes) {
    if (node.node_type !== "topic" || !node.parent_id) continue;
    const chapter = byId.get(node.parent_id);
    if (!chapter || chapter.node_type !== "chapter" || !chapter.parent_id) continue;
    const subject = byId.get(chapter.parent_id);
    if (!subject || subject.node_type !== "subject") continue;
    rows.push({
      subject: subject.name,
      chapter: chapter.name,
      topic: node.name,
    });
  }
  return rows;
}

export const listSyllabus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("syllabus_nodes")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as SyllabusNodeRow[];
  });

const saveSchema = z.object({
  rows: z
    .array(
      z.object({
        subject: z.string().trim().min(1),
        chapter: z.string().trim().min(1),
        topic: z.string().trim().min(1),
      }),
    )
    .max(10000),
});

export const replaceSyllabus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const subjects = [...new Set(data.rows.map((r) => r.subject))];
    const chapters = new Map<string, string>();
    const topics = new Map<string, string>();
    for (const row of data.rows) {
      chapters.set(`${row.subject}\u0000${row.chapter}`, row.chapter);
      topics.set(`${row.subject}\u0000${row.chapter}\u0000${row.topic}`, row.topic);
    }
    const { data: existing, error: readError } = await context.supabase
      .from("syllabus_nodes")
      .select("id");
    if (readError) throw new Error(readError.message);
    for (const row of existing ?? []) {
      const { error } = await context.supabase.from("syllabus_nodes").delete().eq("id", row.id);
      if (error) throw new Error(error.message);
    }
    const subjectIds = new Map<string, string>();
    for (let i = 0; i < subjects.length; i++) {
      const { data: node, error } = await context.supabase
        .from("syllabus_nodes")
        .insert({ node_type: "subject", name: subjects[i]!, sort_order: i })
        .select()
        .single();
      if (error) throw new Error(error.message);
      subjectIds.set(subjects[i]!, node.id);
    }
    const chapterIds = new Map<string, string>();
    let order = 0;
    for (const [key, name] of chapters) {
      const subject = key.split("\u0000")[0]!;
      const { data: node, error } = await context.supabase
        .from("syllabus_nodes")
        .insert({
          parent_id: subjectIds.get(subject)!,
          node_type: "chapter",
          name,
          sort_order: order++,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      chapterIds.set(key, node.id);
    }
    order = 0;
    for (const [key, name] of topics) {
      const [subject, chapter] = key.split("\u0000");
      const { data: node, error } = await context.supabase
        .from("syllabus_nodes")
        .insert({
          parent_id: chapterIds.get(`${subject}\u0000${chapter}`)!,
          node_type: "topic",
          name,
          sort_order: order++,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
    }
    return { subjects: subjects.length, chapters: chapters.size, topics: topics.size };
  });

const autoCreateTestsSchema = z.object({
  exam_track: z.string().trim().min(1).max(120).default("All Exams"),
  duration_minutes: z.number().int().min(0).max(600).default(45),
  rows: z
    .array(
      z.object({
        subject: z.string().trim().min(1),
        chapter: z.string().trim().min(1),
        topic: z.string().trim().min(1),
      }),
    )
    .min(1)
    .max(500),
});

export const autoCreateChapterTestsFromSyllabus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => autoCreateTestsSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const grouped = new Map<string, { subject: string; chapter: string; topics: string[] }>();
    for (const row of data.rows) {
      const key = `${row.subject}\u0000${row.chapter}`;
      const existing = grouped.get(key);
      if (existing) {
        if (!existing.topics.includes(row.topic)) existing.topics.push(row.topic);
      } else {
        grouped.set(key, { subject: row.subject, chapter: row.chapter, topics: [row.topic] });
      }
    }

    const existingTests = await projectContent.from("tests").select("*");
    const existingSet = new Set(
      (existingTests.data ?? []).map((t) =>
        `${t.syllabus_subject || t.subject}\u0000${t.syllabus_chapter || t.title}`.toLowerCase(),
      ),
    );

    let createdCount = 0;
    let sortOrder = (existingTests.data ?? []).length;

    for (const [, entry] of grouped) {
      const lookup = `${entry.subject}\u0000${entry.chapter}`.toLowerCase();
      if (existingSet.has(lookup)) continue;
      const topicSummary = entry.topics.slice(0, 4).join(", ");
      const res = await projectContent.from("tests").insert({
        course_id: null,
        lecture_id: null,
        title: `${entry.subject}: ${entry.chapter} — Chapter Test`,
        instructions: `Chapterwise practice test covering: ${entry.topics.join(", ")}.`,
        subject: entry.subject,
        duration_minutes: data.duration_minutes,
        question_timer_seconds: 0,
        timer_mode: "test",
        questions_count: 30,
        total_marks: 30,
        is_published: false,
        sort_order: sortOrder++,
        exam_track: data.exam_track,
        level: "Mixed",
        series_name: "",
        is_paid: false,
        price_inr: 0,
        price_coins: 0,
        question_source: "deterministic",
        generation_exam: data.exam_track,
        generation_subject: entry.subject,
        generation_topic: entry.chapter,
        generation_difficulty: "Mixed",
        generation_count: 30,
        syllabus_subject: entry.subject,
        syllabus_chapter: entry.chapter,
        syllabus_topic: topicSummary,
      });
      if (!res.error) createdCount += 1;
    }

    return { createdCount, totalChapters: grouped.size };
  });
