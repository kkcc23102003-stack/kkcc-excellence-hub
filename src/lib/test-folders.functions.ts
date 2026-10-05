import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  folderPathSchema,
  childListSchema,
  childListPaths,
  expandFolderPaths,
  combineOwnQuestions,
  type FolderTest,
  type FolderPath,
} from "./test-folders";
import { projectContent } from "./project-content.server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DB } from "@/integrations/supabase/db";
async function admin(context: { supabase: SupabaseClient<DB>; userId: string }) {
  const result = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (result.error || !result.data) throw new Error("Admin access required");
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}
function check(error: { message: string; code?: string } | null) {
  if (error)
    throw new Error(
      ["PGRST205", "42P01"].includes(error.code || "")
        ? "Folder setup pending: run KKCC-Excellence-Hub-TEST-FOLDERS.sql in Supabase and redeploy."
        : error.message,
    );
}
export const listTestFolders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await admin(context);
    const rows: FolderPath[] = [];
    for (;;) {
      const result = await db
        .from("kkcc_test_folders")
        .select("*")
        .order("id")
        .range(rows.length, rows.length + 499);
      check(result.error);
      if (!result.data?.length) break;
      rows.push(...result.data);
    }
    return rows;
  });
export const createTestFolder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => folderPathSchema.parse(input))
  .handler(async ({ context, data }) => {
    const db = await admin(context);
    const result = await db.from("kkcc_test_folders").upsert(expandFolderPaths([data]), {
      onConflict: "series_name,subject,chapter,topic",
      ignoreDuplicates: true,
    });
    check(result.error);
    return data;
  });
export const prepareFolderTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ ids: z.array(z.string().uuid()).min(1) }).parse(input))
  .handler(async ({ context, data }) => {
    await admin(context);
    const sources = [];
    const unique = [...new Set(data.ids)];
    for (let offset = 0; offset < unique.length; offset += 50) {
      const batch = unique.slice(offset, offset + 50);
      const tests = await projectContent.from("tests").select("*").in("id", batch);
      check(tests.error);
      if (tests.data.length !== batch.length)
        throw new Error("A selected test was deleted. Reload folders.");
      const questions = await projectContent
        .from("test_questions")
        .select("*")
        .in("test_id", batch)
        .order("sort_order");
      check(questions.error);
      sources.push(
        ...batch.map((id) => ({
          test: tests.data.find((t) => t.id === id)! as FolderTest,
          questions: questions.data
            .filter((q) => q.test_id === id)
            .map((q) => ({
              question_text: q.question_text,
              options: q.options,
              correct_index: q.correct_index,
              explanation: q.explanation || "",
            })),
        })),
      );
    }
    return { ...combineOwnQuestions(sources), source_ids: data.ids };
  });

/** Add the list below a fixed parent in one database statement. */
export const addTestOutlineList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => childListSchema.parse(input))
  .handler(async ({ context, data }) => {
    const db = await admin(context);
    const paths = childListPaths(data.parent, data.names);
    const rows = expandFolderPaths(paths);
    for (let offset = 0; offset < rows.length; offset += 100) {
      const result = await db.from("kkcc_test_folders").upsert(rows.slice(offset, offset + 100), {
        onConflict: "series_name,subject,chapter,topic",
        ignoreDuplicates: true,
      });
      check(result.error);
    }
    return paths;
  });
