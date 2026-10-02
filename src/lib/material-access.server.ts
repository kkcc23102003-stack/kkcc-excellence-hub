import { isFreeCourse } from "@/lib/cms";
import type { StudentContext } from "@/lib/learning.server";
import { readStudentAccess, unwrap } from "@/lib/learning.server";
import { projectContent } from "@/lib/project-content.server";
import { resolveContentUrl } from "@/lib/content-storage.server";

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
  const mode =
    material.access_type || (material.price > 0 || material.coin_price > 0 ? "paid" : "course");
  let allowed = access.is_admin || mode === "free";
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
  if (!allowed && mode === "course" && material.course_id) {
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
  if (!allowed)
    throw new Error(mode === "paid" ? "MATERIAL_ACCESS_REQUIRED" : "COURSE_ACCESS_REQUIRED");
  const file_url = await resolveContentUrl(material.file_url);
  if (!file_url) throw new Error("This material has no resource file. Contact KKCC.");
  return { ok: true, material_id: material.id, file_url };
}
