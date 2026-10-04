import { isFreeCourse } from "@/lib/cms";
import { notesPrintDocument } from "@/lib/notes-visuals";
import type { StudentContext } from "@/lib/learning.server";
import { readStudentAccess, unwrap } from "@/lib/learning.server";
import { projectContent } from "@/lib/project-content.server";
import { resolveContentUrl, resolveNoteImages } from "@/lib/content-storage.server";

function buildInlineNoteDataUrl(material: {
  title?: string | null;
  subject?: string | null;
  chapter?: string | null;
  material_type?: string | null;
  description?: string | null;
}) {
  // Same builder the reader and the print button use: text goes in, headings,
  // diagrams/charts and the KKCC watermark on every page come out.
  const html = notesPrintDocument({
    title: material.title || "KKCC Study Note",
    subject: material.subject,
    chapter: material.chapter,
    materialType: material.material_type,
    text: material.description ?? "",
  });
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

export async function materialForStudent(context: StudentContext, id: string) {
  const material = unwrap(
    await projectContent
      .from("materials")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle(),
  );
  if (!material) throw new Error("Material not found.");
  const access = await readStudentAccess(context);
  const hasPaidPrice = Number(material.price ?? 0) > 0 || Number(material.coin_price ?? 0) > 0;
  const mode =
    material.access_type || (hasPaidPrice ? "paid" : material.course_id ? "course" : "free");
  let allowed = access.is_admin || mode === "free" || (!hasPaidPrice && !material.course_id);
  if (!allowed && mode === "paid") {
    allowed = Boolean(
      unwrap(
        await context.supabase
          .from("material_purchases")
          .select("id")
          .eq("user_id", context.userId)
          .eq("material_id", id)
          .eq("status", "active")
          .maybeSingle(),
      ),
    );
  }
  if (!allowed && mode === "course") {
    if (!material.course_id) {
      allowed = true;
    } else {
      const course = unwrap(
        await projectContent
          .from("courses")
          .select("*")
          .eq("id", material.course_id)
          .eq("status", "published")
          .maybeSingle(),
      );
      allowed = Boolean(course && (isFreeCourse(course) || access.course_ids.includes(course.id)));
    }
  }
  if (!allowed)
    throw new Error(mode === "paid" ? "MATERIAL_ACCESS_REQUIRED" : "COURSE_ACCESS_REQUIRED");
  const description = await resolveNoteImages(material.description || "");
  const resolvedUrl = await resolveContentUrl(material.file_url);
  const file_url =
    resolvedUrl && resolvedUrl !== "#"
      ? resolvedUrl
      : buildInlineNoteDataUrl({ ...material, description });
  return { ok: true, material_id: material.id, file_url, description };
}
