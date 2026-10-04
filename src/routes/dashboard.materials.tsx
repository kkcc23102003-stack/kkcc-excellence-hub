import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MaterialAccessButton } from "@/components/kkcc/material-access-button";
import { cn } from "@/lib/utils";
import { coinPriceOf, MATERIAL_TYPES } from "@/lib/cms";
import { listPublicMaterials } from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { getAllBuiltInStudyNotes } from "@/lib/theory-bank";

export const Route = createFileRoute("/dashboard/materials")({
  head: () => ({
    meta: [
      { title: "Study Material — KKCC Dashboard" },
      {
        name: "description",
        content:
          "Notes, formula sheets, question banks and previous year papers for KKCC students.",
      },
      { property: "og:title", content: "Study Material — KKCC" },
      { property: "og:description", content: "Download KKCC notes and practice resources." },
    ],
  }),
  loader: () => safeServerCall(() => listPublicMaterials(), []),
  component: MaterialsPage,
});

function MaterialsPage() {
  const materials = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("All");

  const combinedMaterials = useMemo(() => {
    const builtIn = getAllBuiltInStudyNotes().map((note) => ({
      id: note.id,
      course_id: null,
      lecture_id: null,
      title: note.title,
      description: note.description,
      subject: note.subject,
      chapter: note.chapter,
      module_title: note.chapter,
      batch: "KKCC Study Library",
      material_type: note.material_type,
      class_level: note.class_level,
      pages: note.pages,
      file_url: null as string | null,
      thumbnail_url: null as string | null,
      access_type: "free" as const,
      price: 0,
      coin_price: 0,
      is_published: true,
      sort_order: 999,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    }));
    return [...materials, ...builtIn];
  }, [materials]);

  const filtered = useMemo(
    () =>
      combinedMaterials.filter(
        (m) =>
          (type === "All" || m.material_type === type) &&
          (m.title + " " + m.subject + " " + m.chapter + " " + (m.description || ""))
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [combinedMaterials, query, type],
  );

  return (
    <div className="min-w-0 w-full overflow-x-clip">
      <h1 className="text-2xl font-bold sm:text-3xl">Study material</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        KKCC notes, chapter packs and verified resources appear here when they are published.
      </p>

      <div className="relative mt-6 w-full min-w-0 sm:max-w-2xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes, chapters, subjects"
          className="pl-9"
          aria-label="Search study material"
        />
      </div>

      <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {(["All", ...MATERIAL_TYPES] as string[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              type === t
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 min-w-0 space-y-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="surface-panel flex min-w-0 flex-col gap-4 p-4 sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{m.title}</span>
              {m.description && (
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {m.description}
                </span>
              )}
              <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  {m.material_type}
                </Badge>
                {[m.subject, m.class_level, m.batch, m.module_title].filter(Boolean).join(" · ")}
                {m.pages ? ` · ${m.pages} pages` : ""}
              </span>
            </span>
            <div className="flex w-full shrink-0 flex-wrap items-start justify-start gap-2 sm:w-auto sm:flex-col sm:items-end sm:justify-start">
              {m.access_type === "paid" && (
                <>
                  <Badge className="rounded-full">₹{m.price}</Badge>
                  <Badge variant="secondary" className="rounded-full">
                    {coinPriceOf(m)} 23KAAT
                  </Badge>
                </>
              )}
              {m.access_type === "free" && (
                <Badge variant="outline" className="rounded-full">
                  Free
                </Badge>
              )}
              <MaterialAccessButton
                fileUrl={m.file_url}
                materialId={
                  m.id.startsWith("note:") || m.id.startsWith("theory:") ? undefined : m.id
                }
                accessType={m.access_type}
                price={m.price}
                coinPrice={m.coin_price}
                courseId={m.course_id}
                title={m.title}
                subject={m.subject}
                chapter={m.chapter}
                description={m.description}
                materialType={m.material_type}
                className="w-full sm:w-auto sm:whitespace-nowrap"
              />
            </div>
          </div>
        ))}
        {!filtered.length && (
          <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            {materials.length
              ? "No material matches your search."
              : "No study material is available for this course yet. New KKCC notes and PDFs will appear here automatically."}
          </p>
        )}
      </div>
    </div>
  );
}
