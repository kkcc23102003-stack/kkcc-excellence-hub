import { createFileRoute } from "@tanstack/react-router";
import { MaterialAccessButton } from "@/components/kkcc/material-access-button";
import { useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { FeatureUnavailable, SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { useAppControls } from "@/components/kkcc/app-controls-provider";
import { useWebsiteContent } from "@/components/kkcc/website-content-provider";
import { CustomPageSections } from "@/components/kkcc/custom-page-sections";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { coinPriceOf, MATERIAL_TYPES } from "@/lib/cms";
import { listPublicMaterials } from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/study-material")({
  head: () => ({
    meta: [
      { title: "Study Material — Notes, Question Banks & Papers | KKCC" },
      {
        name: "description",
        content:
          "Browse KKCC study material: chapter notes, formula sheets, MCQ sets, question banks and previous year papers.",
      },
      { property: "og:title", content: "Study Material — KKCC" },
      {
        property: "og:description",
        content: "Curated notes and practice resources for every subject.",
      },
    ],
  }),
  loader: () => safeServerCall(() => listPublicMaterials(), []),
  component: StudyMaterialPage,
});

function StudyMaterialPage() {
  const content = useWebsiteContent();
  const controls = useAppControls();
  const materials = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [subject, setSubject] = useState("All");

  const combinedMaterials = materials;

  const subjects = [
    "All",
    ...Array.from(new Set(combinedMaterials.map((m) => m.subject).filter(Boolean))),
  ];

  const filtered = useMemo(
    () =>
      combinedMaterials.filter(
        (m) =>
          (type === "All" || m.material_type === type) &&
          (subject === "All" || m.subject === subject) &&
          (m.title + " " + m.chapter + " " + m.subject + " " + (m.description || ""))
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [combinedMaterials, query, type, subject],
  );

  if (!controls.studyMaterialEnabled) {
    return (
      <SiteLayout>
        <FeatureUnavailable
          title="Study material is temporarily paused"
          description="The KKCC team is refreshing notes and resources. Published material will appear here when this section reopens."
          actionTo="/courses"
          actionLabel="Open courses"
        />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="kkcc-study-material-page min-w-0 w-full overflow-x-clip">
        <PageHeader
          eyebrow={content.page_headers.study_material.eyebrow}
          title={content.page_headers.study_material.title}
          description={content.page_headers.study_material.description}
        />

        <CustomPageSections page="study_material" position="top" />

        <div className="mx-auto w-full min-w-0 max-w-7xl overflow-x-clip px-4 py-8 sm:px-6 sm:py-12">
          <div className="relative w-full sm:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or chapter"
              className="pl-9"
              aria-label="Search study material"
            />
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {(["All", ...MATERIAL_TYPES] as string[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    type === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs transition-colors",
                    subject === s
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((m) => (
              <article
                key={m.id}
                className="surface-panel hover-lift flex min-w-0 max-w-full flex-col overflow-hidden p-4 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  {m.thumbnail_url ? (
                    <img
                      src={m.thumbnail_url}
                      alt={`${m.title} cover`}
                      loading="lazy"
                      decoding="async"
                      className="h-11 w-11 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </span>
                  )}
                  <div className="flex max-w-[58%] flex-wrap justify-end gap-2">
                    <Badge variant="secondary" className="rounded-full text-[11px]">
                      {m.material_type}
                    </Badge>
                    {m.access_type === "paid" && (
                      <>
                        <Badge className="rounded-full text-[11px]">₹{m.price}</Badge>
                        <Badge variant="secondary" className="rounded-full text-[11px]">
                          {coinPriceOf(m)} 23KAAT
                        </Badge>
                      </>
                    )}
                    {m.access_type === "free" && (
                      <Badge variant="outline" className="rounded-full text-[11px]">
                        Free
                      </Badge>
                    )}
                  </div>
                </div>
                <h2 className="mt-4 font-semibold leading-snug">{m.title}</h2>
                {m.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{m.description}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {[m.subject, m.class_level, m.batch, m.module_title].filter(Boolean).join(" · ")}
                  {m.pages ? ` · ${m.pages} pages` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Updated {new Date(m.updated_at).toLocaleDateString("en-IN")}
                </p>
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
                />
              </article>
            ))}
          </div>

          {!filtered.length && (
            <p className="mt-10 rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              {materials.length
                ? "No material matches these filters."
                : "No study material is available yet. New KKCC notes and PDFs will appear here automatically."}
            </p>
          )}
        </div>
        <CustomPageSections page="study_material" position="bottom" />
      </div>
    </SiteLayout>
  );
}
