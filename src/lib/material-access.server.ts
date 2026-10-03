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
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"/><title>${title}</title><style>*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;width:100%;max-width:780px;margin:0 auto;padding:16px;line-height:1.75;color:#0f172a;background:#f8fafc;overflow-wrap:anywhere;word-break:break-word}h1{margin:0 0 10px;color:#0f172a;font-size:clamp(20px,4.5vw,28px);line-height:1.3}.meta{font-size:12px;font-weight:800;color:#0284c7;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:clamp(16px,4vw,28px);box-shadow:0 4px 20px rgba(15,23,42,.05);font-size:clamp(15px,3.8vw,16px)}.print-btn{display:inline-flex;align-items:center;justify-content:center;width:100%;max-width:240px;margin-bottom:14px;padding:10px 18px;border-radius:999px;background:#0284c7;color:#fff;font-weight:700;font-size:14px;border:none;cursor:pointer}@media print{.print-btn{display:none}body{background:#fff;padding:0}.card{border:none;box-shadow:none;padding:0}}</style></head><body><button class="print-btn" onclick="window.print()">Print / Save as PDF</button><div class="card"><div class="meta">KKCC Excellence Hub · ${subject} · ${material.material_type || "Notes"}</div><h1>${title}</h1><div>${escapedBody}</div></div></body></html>`;
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
