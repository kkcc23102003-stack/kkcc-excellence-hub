import { isFreeCourse } from "@/lib/cms";
import type { StudentContext } from "@/lib/learning.server";
import { readStudentAccess, unwrap } from "@/lib/learning.server";
import { projectContent } from "@/lib/project-content.server";
import { resolveContentUrl } from "@/lib/content-storage.server";

function buildInlineNoteDataUrl(material: {
  title?: string | null;
  subject?: string | null;
  material_type?: string | null;
  description?: string | null;
}) {
  const title = material.title || "KKCC Study Note";
  const subject = material.subject || "General Studies";
  const body = material.description || "Study note content.";
  const escapedBody = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${title}</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:820px;margin:40px auto;padding:24px;line-height:1.7;color:#0f172a;background:#f8fafc}h1{margin:0 0 8px;color:#0f172a}.meta{font-size:13px;font-weight:700;color:#0284c7;text-transform:uppercase;letter-spacing:.08em;margin-bottom:20px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(15,23,42,.05)}.print-btn{display:inline-block;margin-bottom:16px;padding:8px 16px;border-radius:999px;background:#0284c7;color:#fff;font-weight:700;border:none;cursor:pointer}@media print{.print-btn{display:none}}</style></head><body><button class="print-btn" onclick="window.print()">Print / Save as PDF</button><div class="card"><div class="meta">KKCC Excellence Hub · ${subject} · ${material.material_type || "Notes"}</div><h1>${title}</h1><div>${escapedBody}</div></div></body></html>`;
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
  const resolvedUrl = await resolveContentUrl(material.file_url);
  const file_url =
    resolvedUrl && resolvedUrl !== "#" ? resolvedUrl : buildInlineNoteDataUrl(material);
  return { ok: true, material_id: material.id, file_url };
}
