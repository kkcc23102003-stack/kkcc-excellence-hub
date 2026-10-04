import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  adminListCourses,
  adminListMaterials,
  deleteMaterial,
  saveMaterial,
} from "@/lib/admin.functions";
import { MATERIAL_TYPES, type Course, type Material } from "@/lib/cms";
import {
  VISUAL_KIND_LABELS,
  describeVisuals,
  renderNotesBody,
  analyzeNotes,
} from "@/lib/notes-visuals";
import { friendlyError, uploadContentFile } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/admin/materials")({
  head: () => ({
    meta: [
      { title: "Admin — Study Material Manager | KKCC" },
      {
        name: "description",
        content: "Add, organise and publish KKCC study material, notes and resources.",
      },
      { property: "og:title", content: "Study Material Manager — KKCC Admin" },
      {
        property: "og:description",
        content: "Manage notes, PDFs and resources for KKCC students.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MaterialsManager,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Study material manager is locked to Supabase admins only. Add your user to
          <code> public.user_roles</code> with role <code>admin</code> to control it.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild className="rounded-full">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/login" search={{ redirectTo: "/admin/materials" }}>
              Sign in as admin
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  ),
});

const selectClass = "mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm";

function UploadButton({
  folder,
  accept,
  label,
  onUploaded,
}: {
  folder: string;
  accept: string;
  label: string;
  onUploaded: (url: string) => void | Promise<unknown>;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          const toastId = toast.loading(`Uploading ${file.name}…`);
          try {
            const { url } = await uploadContentFile(file, folder);
            await onUploaded(url);
            toast.success("Uploaded and saved", { id: toastId });
          } catch (err) {
            toast.error(friendlyError(err), { id: toastId });
          } finally {
            setBusy(false);
          }
        }}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="rounded-full"
        disabled={busy}
        onClick={() => ref.current?.click()}
      >
        {busy ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="mr-1.5 h-3.5 w-3.5" />
        )}
        {label}
      </Button>
    </>
  );
}

type MaterialInput = {
  id?: string;
  course_id: string | null;
  lecture_id: string | null;
  title: string;
  description: string;
  material_type: string;
  subject: string;
  chapter: string;
  module_title: string;
  batch: string;
  class_level: string;
  pages: number;
  file_url: string | null;
  thumbnail_url: string | null;
  access_type: "course" | "free" | "paid";
  price: number;
  coin_price: number;
  is_published: boolean;
  sort_order: number;
};

const toInput = (m: Material): MaterialInput => ({
  id: m.id,
  course_id: m.course_id,
  lecture_id: m.lecture_id ?? null,
  title: m.title,
  description: m.description ?? "",
  material_type: m.material_type,
  subject: m.subject,
  chapter: m.chapter,
  module_title: m.module_title ?? "",
  batch: m.batch ?? "",
  class_level: m.class_level,
  pages: m.pages,
  file_url: m.file_url,
  thumbnail_url: m.thumbnail_url ?? null,
  access_type: m.access_type ?? "course",
  price: m.price ?? 0,
  coin_price: m.coin_price ?? m.price ?? 0,
  is_published: m.is_published,
  sort_order: m.sort_order,
});

function MaterialsManager() {
  const qc = useQueryClient();
  const listMaterials = useServerFn(adminListMaterials);
  const listCourses = useServerFn(adminListCourses);
  const save = useServerFn(saveMaterial);
  const remove = useServerFn(deleteMaterial);

  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Material | null>(null);

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["admin", "materials"],
    queryFn: () => listMaterials(),
    retry: false,
    throwOnError: true,
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => listCourses(),
    retry: false,
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["admin", "materials"] });
    void qc.invalidateQueries({ queryKey: ["admin", "courses"] });
  };

  const saveMutation = useMutation({
    mutationFn: (value: MaterialInput) => save({ data: value }),
    onSuccess: () => {
      invalidate();
      toast.success("Study material saved");
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast.success("Study material deleted");
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return materials;
    return materials.filter((m) =>
      `${m.title} ${m.subject} ${m.chapter} ${m.material_type} ${m.batch ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [materials, query]);

  const addNew = () =>
    saveMutation.mutate(
      {
        course_id: null,
        lecture_id: null,
        title: "Untitled note",
        description: "",
        material_type: "Notes",
        subject: "",
        chapter: "",
        module_title: "",
        batch: "",
        class_level: "",
        pages: 0,
        file_url: null,
        thumbnail_url: null,
        access_type: "free",
        price: 0,
        coin_price: 0,
        is_published: true,
        sort_order: materials.length,
      },
      { onSuccess: (row) => row?.id && setOpenId(row.id as string) },
    );

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Study material & notes"
        description="Upload, organise and publish notes and resources. Published items appear instantly for students."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild variant="ghost" size="sm" className="rounded-full self-start">
            <Link to="/admin">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Course manager
            </Link>
          </Button>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search material by title, subject, chapter or batch"
              className="pl-9"
              aria-label="Search study material"
            />
          </div>
          <Button className="rounded-full" onClick={addNew} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-1.5 h-4 w-4" />
            )}
            Add material
          </Button>
        </div>

        <div className="mt-8 space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading study material…</p>}
          {filtered.map((m) => (
            <div key={m.id} className="surface-panel p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={m.is_published ? "default" : "secondary"}
                      className="rounded-full text-[11px]"
                    >
                      {m.is_published ? "Published" : "Draft"}
                    </Badge>
                    {m.access_type === "paid" && (
                      <>
                        <Badge className="rounded-full text-[11px]">₹{m.price}</Badge>
                        <Badge variant="secondary" className="rounded-full text-[11px]">
                          {m.coin_price ?? m.price} 23KAAT
                        </Badge>
                      </>
                    )}
                    {m.access_type === "free" && (
                      <Badge variant="outline" className="rounded-full text-[11px]">
                        Free
                      </Badge>
                    )}
                    {m.access_type === "course" && (
                      <Badge variant="outline" className="rounded-full text-[11px]">
                        Batch only
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {m.material_type}
                      {m.subject ? ` · ${m.subject}` : ""}
                      {m.batch ? ` · ${m.batch}` : ""}
                    </span>
                  </div>
                  <p className="mt-2 truncate font-semibold">{m.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {courses.find((c: Course) => c.id === m.course_id)?.title ??
                      "Library (no course)"}
                    {m.module_title ? ` · ${m.module_title}` : ""}
                    {m.chapter ? ` · ${m.chapter}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {/* One tap Free / Paid — the student side updates instantly. */}
                  <Button
                    size="sm"
                    variant={m.access_type === "free" ? "default" : "outline"}
                    className="rounded-full"
                    title="Ye notes sabke liye free kar dein"
                    onClick={() => {
                      if (m.access_type === "free") return;
                      saveMutation.mutate({
                        ...toInput(m),
                        access_type: "free",
                        price: 0,
                        coin_price: 0,
                      });
                      toast.success(`"${m.title}" ab Free hai`);
                    }}
                  >
                    Free
                  </Button>
                  <Button
                    size="sm"
                    variant={m.access_type === "paid" ? "default" : "outline"}
                    className="rounded-full"
                    title="Paid notes — ₹ price aur 23KAAT coin price editor me set karein"
                    onClick={() => {
                      if (m.access_type === "paid") {
                        setOpenId(m.id);
                        return;
                      }
                      saveMutation.mutate({
                        ...toInput(m),
                        access_type: "paid",
                        price: m.price && m.price > 0 ? m.price : 49,
                        coin_price: m.coin_price && m.coin_price > 0 ? m.coin_price : 49,
                      });
                      setOpenId(m.id);
                      toast.success(`"${m.title}" ab Paid hai — ₹ price check kar lein`);
                    }}
                  >
                    Paid
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      saveMutation.mutate({ ...toInput(m), is_published: !m.is_published })
                    }
                  >
                    {m.is_published ? (
                      <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                    ) : (
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {m.is_published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setOpenId(openId === m.id ? null : m.id)}
                  >
                    <ChevronDown className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-destructive"
                    onClick={() => setPendingDelete(m)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {openId === m.id && (
                <MaterialForm
                  material={m}
                  courses={courses}
                  saving={saveMutation.isPending}
                  onSave={(v) => saveMutation.mutateAsync(v)}
                />
              )}
            </div>
          ))}
          {!isLoading && !filtered.length && (
            <p className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              No study material yet. Add your first note or resource above.
            </p>
          )}
        </div>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this study material?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be permanently removed for students.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SiteLayout>
  );
}

function MaterialForm({
  material,
  courses,
  saving,
  onSave,
}: {
  material: Material;
  courses: Course[];
  saving: boolean;
  onSave: (v: MaterialInput) => void | Promise<unknown>;
}) {
  const [v, setV] = useState<MaterialInput>(() => toInput(material));
  // Recomputed as the admin types, so the preview below is always the truth.
  const visualsCache = useMemo(() => analyzeNotes(v.description).visuals, [v.description]);
  useEffect(() => setV(toInput(material)), [material]);
  const folder = `materials/${v.course_id ?? "library"}`;

  return (
    <div className="mt-5 border-t pt-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Title</Label>
          <Input
            className="mt-1.5"
            value={v.title}
            onChange={(e) => setV({ ...v, title: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label>Study Notes Content / Description (Shown directly in the Note Reader)</Label>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-7 rounded-full text-xs font-bold"
              onClick={() => {
                const subj = v.subject.trim() || "General Studies";
                const chap = v.chapter.trim() || v.title.trim() || "Core Topic";
                const generated = `1. CHAPTER OVERVIEW — ${chap.toUpperCase()} (${subj.toUpperCase()})
• Core definition, constitutional/theoretical foundation, and primary scope of ${chap} in ${subj}.
• High-frequency exam concepts, chronology, and standard terminology asked in competitive papers.

2. KEY EXAM POINTERS & FACTS
• Point 1: Fundamental principle and primary classification of ${chap}.
• Point 2: Important dates, articles, formulas, or landmark developments related to ${chap}.
• Point 3: Standard exceptions, special cases, and comparative distinctions in ${subj}.

3. QUICK REVISION SUMMARY
• Revise all definitions, match-the-following pairs, and statement-based questions for ${chap} before attempting the chapter test.`;
                setV({
                  ...v,
                  title:
                    v.title === "Untitled note" || !v.title.trim()
                      ? `${chap} — Complete Revision Notes`
                      : v.title,
                  description: v.description.trim()
                    ? `${v.description.trim()}\n\n${generated}`
                    : generated,
                  pages: v.pages || 5,
                });
                toast.success(`Generated structured study notes for ${subj} → ${chap}!`);
              }}
            >
              ✨ Auto-Generate Notes Outline
            </Button>
          </div>
          <Textarea
            className="mt-1.5 font-mono text-xs leading-relaxed"
            rows={8}
            value={v.description}
            onChange={(e) => setV({ ...v, description: e.target.value })}
            placeholder="Write or paste complete chapter study notes here (students can read & print this directly even without a PDF file), or attach a PDF / Google Drive link below."
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Diagrams apne aap ban jaate hain: heading ke neeche 3+ points likhein (Types, Steps,
            Advantages/Disadvantages, saal ke saath Timeline) ya number wale points likhein (chart).
            Apna diagram chahiye to likhein <code>:::flow Naam</code> &rarr; step → step &rarr; step
            &rarr; <code>:::</code> (ya <code>:::cycle</code> / <code>:::tree</code> /{" "}
            <code>:::compare</code> / <code>:::timeline</code> / <code>:::chart</code> /{" "}
            <code>:::auto</code>). Band karne ke liye <code>[visuals:off]</code> likh dein.
          </p>
          {v.description.trim() ? (
            <div className="mt-3 rounded-2xl border bg-muted/20 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Student ko aisa dikhega —{" "}
                  {describeVisuals(visualsCache.map((entry) => entry.spec))}
                </span>
                <div className="flex flex-wrap gap-1">
                  {visualsCache.map((entry, index) => (
                    <Badge
                      key={`${entry.spec.kind}-${index}`}
                      variant="secondary"
                      className="rounded-full text-[10px]"
                    >
                      {VISUAL_KIND_LABELS[entry.spec.kind]}
                    </Badge>
                  ))}
                </div>
              </div>
              <div
                className="kkcc-note-reader mt-2 max-h-72 overflow-y-auto rounded-xl bg-card p-3 text-foreground"
                dangerouslySetInnerHTML={{
                  __html: renderNotesBody(v.description, { fontScale: 13 }),
                }}
              />
            </div>
          ) : null}
        </div>
        <div>
          <Label>Course / batch assignment</Label>
          <select
            className={selectClass}
            value={v.course_id ?? ""}
            onChange={(e) => setV({ ...v, course_id: e.target.value || null })}
          >
            <option value="">Library (no course)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Access / selling mode</Label>
          <select
            className={selectClass}
            value={v.access_type}
            onChange={(e) =>
              setV({ ...v, access_type: e.target.value as "course" | "free" | "paid" })
            }
          >
            <option value="course">Included with course access</option>
            <option value="free">Free standalone note</option>
            <option value="paid">Paid standalone note</option>
          </select>
        </div>
        <div>
          <Label>Notes price (₹)</Label>
          <Input
            className="mt-1.5"
            type="number"
            min={0}
            value={v.price}
            onChange={(e) => setV({ ...v, price: Number(e.target.value || 0) })}
            disabled={v.access_type !== "paid"}
          />
        </div>
        <div>
          <Label>23KAAT coin price</Label>
          <Input
            className="mt-1.5"
            type="number"
            min={0}
            value={v.coin_price}
            onChange={(e) => setV({ ...v, coin_price: Number(e.target.value || 0) })}
            disabled={v.access_type !== "paid"}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Set a lower coin price to give students a 23KAAT discount.
          </p>
        </div>
        <div>
          <Label>Batch</Label>
          <Input
            className="mt-1.5"
            value={v.batch}
            onChange={(e) => setV({ ...v, batch: e.target.value })}
            placeholder="e.g. 2026 Morning Batch"
          />
        </div>
        <div>
          <Label>Module</Label>
          <Input
            className="mt-1.5"
            value={v.module_title}
            onChange={(e) => setV({ ...v, module_title: e.target.value })}
            placeholder="e.g. Module 01"
          />
        </div>
        <div>
          <Label>Category</Label>
          <select
            className={selectClass}
            value={v.material_type}
            onChange={(e) => setV({ ...v, material_type: e.target.value })}
          >
            {MATERIAL_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Subject</Label>
          <Input
            className="mt-1.5"
            value={v.subject}
            onChange={(e) => setV({ ...v, subject: e.target.value })}
          />
        </div>
        <div>
          <Label>Chapter</Label>
          <Input
            className="mt-1.5"
            value={v.chapter}
            onChange={(e) => setV({ ...v, chapter: e.target.value })}
          />
        </div>
        <div>
          <Label>Class</Label>
          <Input
            className="mt-1.5"
            value={v.class_level}
            onChange={(e) => setV({ ...v, class_level: e.target.value })}
          />
        </div>
        <div>
          <Label>Pages</Label>
          <Input
            className="mt-1.5"
            type="number"
            value={v.pages}
            onChange={(e) => setV({ ...v, pages: Number(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label>Order</Label>
          <Input
            className="mt-1.5"
            type="number"
            value={v.sort_order}
            onChange={(e) => setV({ ...v, sort_order: Number(e.target.value) || 0 })}
          />
        </div>

        <div className="sm:col-span-2 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Label>File / Google Drive URL</Label>
            <Input
              className="mt-1.5"
              value={v.file_url ?? ""}
              onChange={(e) => setV({ ...v, file_url: e.target.value || null })}
              placeholder="Paste Google Drive / hosted PDF link or upload a file"
            />
          </div>
          <UploadButton
            folder={`${folder}/files`}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,image/*,audio/*,video/*"
            label="Upload file"
            onUploaded={(url) => {
              const next = { ...v, file_url: url, is_published: true };
              setV(next);
              return onSave(next);
            }}
          />
        </div>
        <div className="sm:col-span-2 -mt-1 rounded-2xl border bg-background/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Google Drive: paste the Share link directly. Set the Drive file permission so the intended
          students can open it. Drive/hosted URLs stay external and are not uploaded to KKCC
          Storage. Scanned notes: keep each PDF below 45 MB. Prefer 300–450 DPI, or split a heavy
          600-DPI scan into chapter PDFs to avoid slow uploads and Free-plan storage failures.
        </div>
        <div className="sm:col-span-2 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <Label>Thumbnail</Label>
            <Input
              className="mt-1.5"
              value={v.thumbnail_url ?? ""}
              onChange={(e) => setV({ ...v, thumbnail_url: e.target.value || null })}
              placeholder="Optional cover image URL"
            />
          </div>
          <UploadButton
            folder={`${folder}/thumbnails`}
            accept="image/*"
            label="Upload image"
            onUploaded={(url) => {
              const next = { ...v, thumbnail_url: url };
              setV(next);
              return onSave(next);
            }}
          />
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={v.is_published}
              onChange={(e) => setV({ ...v, is_published: e.target.checked })}
            />
            Published
          </label>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button className="rounded-full" disabled={saving} onClick={() => onSave(v)}>
          {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}
