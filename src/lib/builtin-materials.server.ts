import { createHash } from "node:crypto";
import { getAllBuiltInStudyNotes } from "@/lib/theory-bank";
export function builtInMaterials() {
  return getAllBuiltInStudyNotes().map((note) => {
    const hash = createHash("sha256").update(`kkcc-study-note:${note.id}`).digest("hex");
    const id = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
    return {
      ...note,
      id,
      course_id: null,
      lecture_id: null,
      module_title: note.chapter,
      batch: "KKCC Study Library",
      file_url: null,
      thumbnail_url: null,
      access_type: "free" as const,
      price: 0,
      coin_price: 0,
      is_published: true,
      sort_order: 999,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };
  });
}
