import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ClipboardList, Loader2, Plus, Save, Trash2, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  adminGetCourse,
  saveCourse,
  saveLecture,
  deleteLecture,
  saveMaterial,
  deleteMaterial,
  saveTest,
  deleteTest,
  createTestFromMcqText,
} from "@/lib/admin.functions";
import {
  CATEGORIES,
  COURSE_STATUSES,
  COURSE_TYPES,
  MATERIAL_TYPES,
  slugify,
  type Course,
  type Lecture,
  type Material,
} from "@/lib/cms";
import type { DB as Database } from "@/integrations/supabase/db";
import { friendlyError, removeContentFile, uploadContentFile } from "@/lib/storage";
import { validateVideoUrl, youtubeId } from "@/lib/video";

type Test = Database["public"]["Tables"]["tests"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/courses/$id")({
  head: () => ({
    meta: [
      { title: "Edit course — KKCC Admin" },
      { name: "description", content: "Edit KKCC course details, lectures, resources and tests." },
      { property: "og:title", content: "Edit course — KKCC Admin" },
      { property: "og:description", content: "Manage course content without touching code." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CourseEditor,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Cannot open this course</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
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

function CourseEditor() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const getCourse = useServerFn(adminGetCourse);
  const putCourse = useServerFn(saveCourse);
  const putLecture = useServerFn(saveLecture);
  const dropLecture = useServerFn(deleteLecture);
  const putMaterial = useServerFn(saveMaterial);
  const dropMaterial = useServerFn(deleteMaterial);
  const putTest = useServerFn(saveTest);
  const dropTest = useServerFn(deleteTest);
  const importMcqs = useServerFn(createTestFromMcqText);

  const key = ["admin", "course", id];
  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => getCourse({ data: { id } }),
  });

  const [form, setForm] = useState<Course | null>(null);
  const [mcqTitle, setMcqTitle] = useState("New MCQ test");
  const [mcqDuration, setMcqDuration] = useState(60);
  const [mcqTimerMode, setMcqTimerMode] = useState<"test" | "question" | "unlimited">("test");
  const [mcqQuestionTimer, setMcqQuestionTimer] = useState(60);
  const [mcqMarks, setMcqMarks] = useState(4);
  const [mcqNegative, setMcqNegative] = useState(1);
  const [mcqPublished, setMcqPublished] = useState(false);
  const [generatorTopic, setGeneratorTopic] = useState("");
  const [generatorCount, setGeneratorCount] = useState(30);
  const [generatorLevel, setGeneratorLevel] = useState("Mixed");
  const [mcqText, setMcqText] = useState(`Q1. Which gas is released during photosynthesis?
A) Oxygen
B) Carbon dioxide
C) Nitrogen
D) Hydrogen
Answer: A
Explanation: Plants release oxygen during photosynthesis.

Q2. 2 + 2 = ?
A) 3
B) 4
C) 5
D) 6
Answer: B
Explanation: 2 plus 2 equals 4, so option B is correct.`);
  useEffect(() => {
    if (data?.course) {
      setForm(data.course);
      setMcqTitle(`${data.course.subject} practice test`);
    }
  }, [data?.course]);

  const refresh = () => qc.invalidateQueries({ queryKey: key });
  const set = <K extends keyof Course>(k: K, v: Course[K]) =>
    setForm((f: Course | null) => (f ? { ...f, [k]: v } : f));

  const mcqImportMutation = useMutation({
    mutationFn: async () => {
      if (!form) throw new Error("Course not loaded");
      return importMcqs({
        data: {
          course_id: form.id,
          title: mcqTitle,
          instructions: "Read each question carefully and select the correct option.",
          subject: form.subject,
          duration_minutes: mcqTimerMode === "unlimited" ? 0 : mcqDuration,
          question_timer_seconds: mcqTimerMode === "question" ? mcqQuestionTimer : 0,
          timer_mode: mcqTimerMode,
          marks: mcqMarks,
          negative_marks: mcqNegative,
          is_published: mcqPublished,
          text: mcqText,
        },
      });
    },
    onSuccess: (result) => {
      toast.success(`Test created with ${result.questions_count} MCQs`);
      void refresh();
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const saveCourseMutation = useMutation({
    mutationFn: async (course: Course) =>
      putCourse({
        data: {
          id: course.id,
          title: course.title,
          slug: course.slug || slugify(course.title),
          category: course.category,
          class_level: course.class_level,
          subject: course.subject,
          faculty: course.faculty,
          course_type: course.course_type,
          status: course.status as "draft" | "published" | "archived",
          thumbnail_url: course.thumbnail_url,
          summary: course.summary,
          description: course.description,
          outcomes: course.outcomes,
          price: course.price,
          coin_price: Math.max(0, Number(course.coin_price ?? course.price ?? 0) || 0),
          original_price: course.original_price,
          discount_percent: course.discount_percent,
          duration_hours: course.duration_hours,
          lectures_count: course.lectures_count,
          tests_count: course.tests_count,
          materials_count: course.materials_count,
          rating: course.rating,
          hue: course.hue,
          sort_order: course.sort_order,
        },
      }),
    onSuccess: () => {
      void refresh();
      toast.success("Course saved");
    },
    onError: (e: Error) => toast.error(friendlyError(e)),
  });

  const run = (fn: () => Promise<unknown>, message: string) => async () => {
    try {
      await fn();
      await refresh();
      toast.success(message);
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  if (isLoading || !form) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">
          Loading course…
        </div>
      </SiteLayout>
    );
  }

  const lectures = data?.lectures ?? [];
  const materials = data?.materials ?? [];
  const tests = data?.tests ?? [];

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title={form.title}
        description="Edit details, chapters, lectures, resources and tests. Published changes go live instantly."
      />

      <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild size="sm" variant="ghost" className="rounded-full">
            <Link to="/admin">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> All courses
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge
              variant={form.status === "published" ? "default" : "secondary"}
              className="rounded-full capitalize"
            >
              {form.status}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() =>
                saveCourseMutation.mutate({
                  ...form,
                  status: form.status === "published" ? "draft" : "published",
                })
              }
            >
              {form.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <Button
              size="sm"
              className="rounded-full"
              disabled={saveCourseMutation.isPending}
              onClick={() => saveCourseMutation.mutate(form)}
            >
              {saveCourseMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>

        {/* Course details */}
        <section className="surface-panel space-y-4 p-6">
          <h2 className="text-lg font-semibold">Course details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input
                className="mt-1.5"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>
            <div>
              <Label>Slug (URL)</Label>
              <Input
                className="mt-1.5"
                value={form.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                className={selectClass}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Class</Label>
              <Input
                className="mt-1.5"
                value={form.class_level}
                onChange={(e) => set("class_level", e.target.value)}
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                className="mt-1.5"
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
              />
            </div>
            <div>
              <Label>Faculty</Label>
              <Input
                className="mt-1.5"
                value={form.faculty}
                onChange={(e) => set("faculty", e.target.value)}
              />
            </div>
            <div>
              <Label>Course type</Label>
              <select
                className={selectClass}
                value={form.course_type}
                onChange={(e) => set("course_type", e.target.value)}
              >
                {COURSE_TYPES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                className={selectClass}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {COURSE_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                As soon as you change Draft to Published, students will automatically receive a new
                batch notification.
              </p>
            </div>
            {(
              [
                ["price", "Price (₹)"],
                ["coin_price", "23KAAT coin price"],
                ["original_price", "Original price (₹)"],
                ["discount_percent", "Discount %"],
                ["duration_hours", "Duration (hours)"],
                ["rating", "Rating"],
                ["hue", "Theme hue"],
                ["sort_order", "Sort order"],
              ] as const
            ).map(([k, label]) => (
              <div key={k}>
                <Label>{label}</Label>
                <Input
                  className="mt-1.5"
                  type="number"
                  value={form[k] ?? 0}
                  onChange={(e) => set(k, Number(e.target.value) as never)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1">
              <Label>Thumbnail URL</Label>
              <Input
                className="mt-1.5"
                value={form.thumbnail_url ?? ""}
                onChange={(e) => set("thumbnail_url", e.target.value || null)}
                placeholder="Upload an image or paste a URL"
              />
            </div>
            <div className="pt-6">
              <UploadButton
                folder={`courses/${form.id}/thumbnail`}
                accept="image/*"
                label="Upload image"
                onUploaded={(url) => {
                  const next = { ...form, thumbnail_url: url };
                  setForm(next);
                  return saveCourseMutation.mutateAsync(next);
                }}
              />
            </div>
          </div>

          <div>
            <Label>Summary</Label>
            <Textarea
              className="mt-1.5"
              rows={2}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-1.5"
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Learning outcomes (one per line)</Label>
            <Textarea
              className="mt-1.5"
              rows={4}
              value={form.outcomes.join("\n")}
              onChange={(e) =>
                set(
                  "outcomes",
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                )
              }
            />
          </div>
        </section>

        {/* Lectures */}
        <section className="surface-panel space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chapters &amp; lectures ({lectures.length})</h2>
            <Button
              size="sm"
              className="rounded-full"
              onClick={run(
                () =>
                  putLecture({
                    data: {
                      course_id: form.id,
                      module_title: "Module 01",
                      title: "New lecture",
                      description: "",
                      duration: "00:00",
                      video_url: null,
                      is_free: false,
                      sort_order: lectures.length,
                    },
                  }),
                "Lecture added",
              )}
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add lecture
            </Button>
          </div>
          {lectures.map((l) => (
            <LectureRow
              key={l.id}
              lecture={l}
              onSave={(v) => run(() => putLecture({ data: v }), "Lecture saved")()}
              onDelete={run(async () => {
                await removeContentFile(l.video_url);
                await dropLecture({ data: { id: l.id } });
              }, "Lecture deleted")}
            />
          ))}
          {!lectures.length && (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No lectures yet.
            </p>
          )}
        </section>

        {/* Materials */}
        <section className="surface-panel space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">PDFs &amp; resources ({materials.length})</h2>
            <Button
              size="sm"
              className="rounded-full"
              onClick={run(
                () =>
                  putMaterial({
                    data: {
                      course_id: form.id,
                      lecture_id: lectures[materials.length]?.id ?? null,
                      title: "New resource",
                      material_type: "Notes",
                      subject: form.subject,
                      chapter: "",
                      class_level: form.class_level,
                      pages: 0,
                      file_url: null,
                      access_type: "course",
                      price: 0,
                      coin_price: 0,
                      is_published: true,
                      sort_order: materials.length,
                    },
                  }),
                "Resource added",
              )}
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add resource
            </Button>
          </div>
          {materials.map((m) => (
            <MaterialRow
              key={m.id}
              material={m}
              lectures={lectures}
              onSave={(v) => run(() => putMaterial({ data: v }), "Resource saved")()}
              onDelete={run(async () => {
                await removeContentFile(m.file_url);
                await dropMaterial({ data: { id: m.id } });
              }, "Resource deleted")}
            />
          ))}
          {!materials.length && (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No resources yet.
            </p>
          )}
        </section>

        {/* Tests */}
        <section className="surface-panel space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tests ({tests.length})</h2>
            <Button
              size="sm"
              className="rounded-full"
              onClick={run(
                () =>
                  putTest({
                    data: {
                      course_id: form.id,
                      lecture_id: lectures[tests.length]?.id ?? null,
                      title: "New test",
                      instructions: "",
                      subject: form.subject,
                      duration_minutes: 60,
                      question_timer_seconds: 0,
                      timer_mode: "test",
                      questions_count: 0,
                      total_marks: 0,
                      is_published: false,
                      sort_order: tests.length,
                    },
                  }),
                "Test added",
              )}
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add test
            </Button>
          </div>
          <div className="rounded-2xl border bg-muted/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <ClipboardList className="h-4 w-4 text-primary" /> Paste MCQ text and auto-create
                  test
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Format: Q1. question, A) option, B) option, C) option, D) option, Answer: B,
                  Explanation: reason. If explanation is missing, the app adds a short fallback
                  explanation automatically.
                </p>
              </div>
              <label className="flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={mcqPublished}
                  onChange={(event) => setMcqPublished(event.target.checked)}
                />
                Publish after import
              </label>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <Label>Test title</Label>
                <Input
                  className="mt-1.5"
                  value={mcqTitle}
                  onChange={(event) => setMcqTitle(event.target.value)}
                />
              </div>
              <div>
                <Label>Test minutes</Label>
                <Input
                  className="mt-1.5"
                  type="number"
                  disabled={mcqTimerMode === "unlimited"}
                  value={mcqDuration}
                  onChange={(event) => setMcqDuration(Number(event.target.value || 60))}
                />
              </div>
              <div>
                <Label>Timer mode</Label>
                <select
                  className={selectClass}
                  value={mcqTimerMode}
                  onChange={(event) =>
                    setMcqTimerMode(event.target.value as "test" | "question" | "unlimited")
                  }
                >
                  <option value="test">Whole test timer</option>
                  <option value="question">Per-question timer</option>
                  <option value="unlimited">No timer / Next button</option>
                </select>
              </div>
              <div>
                <Label>Seconds per question</Label>
                <Input
                  className="mt-1.5"
                  type="number"
                  disabled={mcqTimerMode !== "question"}
                  value={mcqQuestionTimer}
                  onChange={(event) => setMcqQuestionTimer(Number(event.target.value || 60))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                <div>
                  <Label>Marks</Label>
                  <Input
                    className="mt-1.5"
                    type="number"
                    value={mcqMarks}
                    onChange={(event) => setMcqMarks(Number(event.target.value || 4))}
                  />
                </div>
                <div>
                  <Label>Negative</Label>
                  <Input
                    className="mt-1.5"
                    type="number"
                    value={mcqNegative}
                    onChange={(event) => setMcqNegative(Number(event.target.value || 0))}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border bg-background/70 p-4">
              <h4 className="flex items-center gap-2 text-sm font-bold">
                <Wand2 className="h-4 w-4 text-primary" /> Topic-to-MCQ draft generator
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Type a topic and create 30–50 original MCQ drafts. Review before publishing. For
                pasted PYQs, use only content you have permission to use.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px_160px_auto]">
                <div>
                  <Label>Topic / exam pattern</Label>
                  <Input
                    className="mt-1.5"
                    placeholder="Example: NEET human physiology, JEE quadratic equations"
                    value={generatorTopic}
                    onChange={(event) => setGeneratorTopic(event.target.value)}
                  />
                </div>
                <div>
                  <Label>Count</Label>
                  <Input
                    className="mt-1.5"
                    type="number"
                    min={30}
                    max={50}
                    value={generatorCount}
                    onChange={(event) => setGeneratorCount(Number(event.target.value || 30))}
                  />
                </div>
                <div>
                  <Label>Level</Label>
                  <select
                    className={selectClass}
                    value={generatorLevel}
                    onChange={(event) => setGeneratorLevel(event.target.value)}
                  >
                    {[
                      "Mixed",
                      "NEET",
                      "JEE Main",
                      "JEE Advanced",
                      "CBSE MCQ",
                      "CBSE Class 9-10",
                      "CBSE Class 11-12 Science",
                      "CBSE Class 11-12 Commerce",
                      "ICSE MCQ",
                      "ICSE Class 9-10",
                      "ISC Science",
                      "ISC Commerce",
                      "State Board MCQ",
                      "CA Foundation",
                      "CA Intermediate",
                      "CUET",
                      "CLAT/Law",
                      "NDA/CDS",
                      "UPSC CSE",
                      "UPSC/SSC/Bank",
                      "SSC",
                      "Banking",
                      "Railway",
                      "Punjab ETT Cadre",
                      "PSTET/CTET",
                      "PPSC Punjab",
                      "Punjab Patwari",
                      "Punjab Police",
                      "Punjab Master Cadre",
                      "Punjab Clerk",
                      "State PSC",
                      "State Police",
                      "State Teacher/TET",
                      "State Patwari/Revenue",
                      "State Clerk",
                      "Other Competitive Exam",
                    ].map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full"
                    disabled={!generatorTopic.trim()}
                    onClick={() =>
                      setMcqText(
                        generateTopicMcqText({
                          topic: generatorTopic,
                          subject: form.subject,
                          courseTitle: form.title,
                          count: generatorCount,
                          level: generatorLevel,
                        }),
                      )
                    }
                  >
                    <Wand2 className="mr-1.5 h-4 w-4" /> Generate drafts
                  </Button>
                </div>
              </div>
            </div>
            <Textarea
              className="mt-3 min-h-56 font-mono text-xs"
              value={mcqText}
              onChange={(event) => setMcqText(event.target.value)}
            />
            <Button
              className="mt-3 rounded-full"
              disabled={mcqImportMutation.isPending || mcqText.trim().length < 10}
              onClick={() => mcqImportMutation.mutate()}
            >
              {mcqImportMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-1.5 h-4 w-4" />
              )}
              Create test from MCQ text
            </Button>
          </div>

          {tests.map((t) => (
            <TestRow
              key={t.id}
              test={t}
              lectures={lectures}
              onSave={(v) => run(() => putTest({ data: v }), "Test saved")()}
              onDelete={run(() => dropTest({ data: { id: t.id } }), "Test deleted")}
            />
          ))}
          {!tests.length && (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No tests yet.
            </p>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}

function generateTopicMcqText({
  topic,
  subject,
  courseTitle,
  count,
  level,
}: {
  topic: string;
  subject: string;
  courseTitle: string;
  count: number;
  level: string;
}) {
  const safeCount = Math.min(50, Math.max(30, Math.round(count || 30)));
  const cleanTopic = topic.trim() || subject || courseTitle || "exam practice";
  const label = [level, subject].filter(Boolean).join(" ").trim() || "Competitive";
  const stems = [
    `Which statement is most accurate about ${cleanTopic}?`,
    `In ${cleanTopic}, which option best matches the core concept?`,
    `For ${label} preparation, identify the correct point related to ${cleanTopic}.`,
    `A student is revising ${cleanTopic}. Which conclusion should be selected?`,
    `Which application of ${cleanTopic} is correct?`,
  ];
  const corrects = [
    `The standard concept of ${cleanTopic} applied with correct reasoning`,
    `A direct definition-based understanding of ${cleanTopic}`,
    `The option that follows the main rule of ${cleanTopic}`,
    `The balanced exam-level interpretation of ${cleanTopic}`,
    `The step-by-step logical result for ${cleanTopic}`,
  ];
  const distractors = [
    `A statement that reverses the rule of ${cleanTopic}`,
    `A partially true but incomplete idea about ${cleanTopic}`,
    `An unrelated fact mixed with ${cleanTopic}`,
    `A shortcut that ignores the main condition`,
    `A common misconception from this topic`,
    `A result that uses the wrong formula or sequence`,
  ];

  return Array.from({ length: safeCount }, (_, index) => {
    const stem = stems[index % stems.length];
    const correct = corrects[index % corrects.length];
    const wrong = [
      distractors[index % distractors.length],
      distractors[(index + 2) % distractors.length],
      distractors[(index + 4) % distractors.length],
    ];
    const options = shuffleLocal([correct, ...wrong]);
    const answerIndex = Math.max(
      0,
      options.findIndex((option) => option === correct),
    );
    const answerLetter = String.fromCharCode(65 + answerIndex);
    return `Q${index + 1}. ${stem}\nA) ${options[0]}\nB) ${options[1]}\nC) ${options[2]}\nD) ${options[3]}\nAnswer: ${answerLetter}\nExplanation: This is an original ${label} style draft. Review facts and wording before publishing; the correct option applies the main ${cleanTopic} concept while the distractors represent common mistakes.\n`;
  }).join("\n");
}

function shuffleLocal<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function RowShell({
  children,
  onDelete,
  onSave,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  onSave: () => void;
}) {
  return (
    <div className="rounded-2xl border p-4">
      {children}
      <div className="mt-3 flex justify-end gap-2">
        <Button size="sm" variant="outline" className="rounded-full" onClick={onSave}>
          <Save className="mr-1.5 h-3.5 w-3.5" /> Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full text-destructive"
          onClick={() => {
            if (confirm("Delete permanently? The linked file will also be removed.")) onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function LectureRow({
  lecture,
  onSave,
  onDelete,
}: {
  lecture: Lecture;
  onSave: (v: {
    id: string;
    course_id: string;
    module_title: string;
    title: string;
    description: string;
    duration: string;
    video_url: string | null;
    is_free: boolean;
    sort_order: number;
  }) => void | Promise<void>;
  onDelete: () => void;
}) {
  const [v, setV] = useState(lecture);
  useEffect(() => setV(lecture), [lecture]);
  return (
    <RowShell
      onDelete={onDelete}
      onSave={() => {
        const videoError = validateVideoUrl(v.video_url ?? "");
        if (videoError) {
          toast.error(videoError);
          return;
        }
        onSave({
          id: v.id,
          course_id: v.course_id,
          module_title: v.module_title,
          title: v.title,
          description: v.description,
          duration: v.duration,
          video_url: v.video_url,
          is_free: v.is_free,
          sort_order: v.sort_order,
        });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Chapter / module</Label>
          <Input
            className="mt-1.5"
            value={v.module_title}
            onChange={(e) => setV({ ...v, module_title: e.target.value })}
          />
        </div>
        <div>
          <Label>Lecture title</Label>
          <Input
            className="mt-1.5"
            value={v.title}
            onChange={(e) => setV({ ...v, title: e.target.value })}
          />
        </div>
        <div>
          <Label>Duration</Label>
          <Input
            className="mt-1.5"
            value={v.duration}
            onChange={(e) => setV({ ...v, duration: e.target.value })}
          />
        </div>
        <div>
          <Label>Order</Label>
          <Input
            className="mt-1.5"
            type="number"
            value={v.sort_order}
            onChange={(e) => setV({ ...v, sort_order: Number(e.target.value) })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Description</Label>
          <Textarea
            className="mt-1.5"
            rows={2}
            value={v.description}
            onChange={(e) => setV({ ...v, description: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2 flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <Label>YouTube lecture link</Label>
            <Input
              className="mt-1.5"
              value={v.video_url ?? ""}
              onChange={(e) => setV({ ...v, video_url: e.target.value || null })}
              placeholder="Paste YouTube watch / shorts / youtu.be link"
              inputMode="url"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Videos are not uploaded to Supabase. Publish lectures by pasting YouTube links only.
            </p>
            {v.video_url && youtubeId(v.video_url) && (
              <p className="mt-1 text-xs font-medium text-emerald-600">
                YouTube video detected — students will see it in the lecture player.
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={v.is_free}
              onChange={(e) => setV({ ...v, is_free: e.target.checked })}
            />
            Free preview
          </label>
        </div>
      </div>
    </RowShell>
  );
}

function MaterialRow({
  material,
  lectures,
  onSave,
  onDelete,
}: {
  material: Material;
  lectures: Lecture[];
  onSave: (v: {
    id: string;
    course_id: string | null;
    lecture_id: string | null;
    title: string;
    material_type: string;
    subject: string;
    chapter: string;
    class_level: string;
    pages: number;
    file_url: string | null;
    access_type: "course" | "free" | "paid";
    price: number;
    coin_price: number;
    is_published: boolean;
    sort_order: number;
  }) => void | Promise<void>;
  onDelete: () => void;
}) {
  const [v, setV] = useState<Material>({
    ...material,
    lecture_id: material.lecture_id ?? null,
    access_type: material.access_type ?? "course",
    price: material.price ?? 0,
    coin_price: material.coin_price ?? material.price ?? 0,
  });
  useEffect(
    () =>
      setV({
        ...material,
        lecture_id: material.lecture_id ?? null,
        access_type: material.access_type ?? "course",
        price: material.price ?? 0,
        coin_price: material.coin_price ?? material.price ?? 0,
      }),
    [material],
  );
  return (
    <RowShell
      onDelete={onDelete}
      onSave={() =>
        onSave({
          id: v.id,
          course_id: v.course_id,
          lecture_id: v.lecture_id ?? null,
          title: v.title,
          material_type: v.material_type,
          subject: v.subject,
          chapter: v.chapter,
          class_level: v.class_level,
          pages: v.pages,
          file_url: v.file_url,
          access_type: v.access_type ?? "course",
          price: Math.max(0, Number(v.price ?? 0) || 0),
          coin_price: Math.max(0, Number(v.coin_price ?? v.price ?? 0) || 0),
          is_published: v.is_published,
          sort_order: v.sort_order,
        })
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input
            className="mt-1.5"
            value={v.title}
            onChange={(e) => setV({ ...v, title: e.target.value })}
          />
        </div>
        <div>
          <Label>Type</Label>
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
          <Label>Attach to lecture</Label>
          <select
            className={selectClass}
            value={v.lecture_id ?? ""}
            onChange={(e) => setV({ ...v, lecture_id: e.target.value || null })}
          >
            <option value="">Course-level / auto-match</option>
            {lectures.map((lecture) => (
              <option key={lecture.id} value={lecture.id}>
                {lecture.sort_order + 1}. {lecture.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Access / selling mode</Label>
          <select
            className={selectClass}
            value={v.access_type ?? "course"}
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
            value={v.price ?? 0}
            onChange={(e) => setV({ ...v, price: Number(e.target.value || 0) })}
            disabled={(v.access_type ?? "course") !== "paid"}
          />
        </div>
        <div>
          <Label>23KAAT coin price</Label>
          <Input
            className="mt-1.5"
            type="number"
            min={0}
            value={v.coin_price ?? v.price ?? 0}
            onChange={(e) => setV({ ...v, coin_price: Number(e.target.value || 0) })}
            disabled={(v.access_type ?? "course") !== "paid"}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Set lower than ₹ price if coin buyers should get it cheaper.
          </p>
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
            onChange={(e) => setV({ ...v, pages: Number(e.target.value) })}
          />
        </div>
        <div className="sm:col-span-2 flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <Label>File URL (PDF)</Label>
            <Input
              className="mt-1.5"
              value={v.file_url ?? ""}
              onChange={(e) => setV({ ...v, file_url: e.target.value || null })}
              placeholder="Upload a PDF or paste a link"
            />
          </div>
          <UploadButton
            folder={`courses/${v.course_id ?? "library"}/files`}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,image/*,audio/*,video/*"
            label="Upload file"
            onUploaded={(url) => {
              const next = { ...v, file_url: url, is_published: true };
              setV(next);
              return onSave({
                id: next.id,
                course_id: next.course_id,
                lecture_id: next.lecture_id ?? null,
                title: next.title,
                material_type: next.material_type,
                subject: next.subject,
                chapter: next.chapter,
                class_level: next.class_level,
                pages: next.pages,
                file_url: next.file_url,
                access_type: next.access_type ?? "course",
                price: Math.max(0, Number(next.price ?? 0) || 0),
                coin_price: Math.max(0, Number(next.coin_price ?? next.price ?? 0) || 0),
                is_published: next.is_published,
                sort_order: next.sort_order,
              });
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
    </RowShell>
  );
}

function TestRow({
  test,
  lectures,
  onSave,
  onDelete,
}: {
  test: Test;
  lectures: Lecture[];
  onSave: (v: {
    id: string;
    course_id: string | null;
    lecture_id: string | null;
    title: string;
    instructions: string;
    subject: string;
    duration_minutes: number;
    question_timer_seconds: number;
    timer_mode: "test" | "question" | "unlimited";
    questions_count: number;
    total_marks: number;
    is_published: boolean;
    sort_order: number;
  }) => void;
  onDelete: () => void;
}) {
  const normalizeTest = (row: Test): Test => ({
    ...row,
    lecture_id: row.lecture_id ?? null,
    timer_mode: row.timer_mode ?? "test",
    question_timer_seconds: row.question_timer_seconds ?? 0,
  });
  const [v, setV] = useState<Test>(normalizeTest(test));
  useEffect(() => setV(normalizeTest(test)), [test]);
  return (
    <RowShell
      onDelete={onDelete}
      onSave={() =>
        onSave({
          id: v.id,
          course_id: v.course_id,
          lecture_id: v.lecture_id ?? null,
          title: v.title,
          instructions: v.instructions,
          subject: v.subject,
          duration_minutes: v.timer_mode === "unlimited" ? 0 : v.duration_minutes,
          question_timer_seconds: v.timer_mode === "question" ? v.question_timer_seconds : 0,
          timer_mode: v.timer_mode,
          questions_count: v.questions_count,
          total_marks: v.total_marks,
          is_published: v.is_published,
          sort_order: v.sort_order,
        })
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Test title</Label>
          <Input
            className="mt-1.5"
            value={v.title}
            onChange={(e) => setV({ ...v, title: e.target.value })}
          />
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
          <Label>Attach to lecture</Label>
          <select
            className={selectClass}
            value={v.lecture_id ?? ""}
            onChange={(e) => setV({ ...v, lecture_id: e.target.value || null })}
          >
            <option value="">Course-level / auto-match</option>
            {lectures.map((lecture) => (
              <option key={lecture.id} value={lecture.id}>
                {lecture.sort_order + 1}. {lecture.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Duration (minutes)</Label>
          <Input
            className="mt-1.5"
            type="number"
            disabled={v.timer_mode === "unlimited"}
            value={v.duration_minutes}
            onChange={(e) => setV({ ...v, duration_minutes: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Timer mode</Label>
          <select
            className={selectClass}
            value={v.timer_mode}
            onChange={(e) =>
              setV({ ...v, timer_mode: e.target.value as "test" | "question" | "unlimited" })
            }
          >
            <option value="test">Whole test timer</option>
            <option value="question">Per-question timer</option>
            <option value="unlimited">No timer / Next button</option>
          </select>
        </div>
        <div>
          <Label>Seconds per question</Label>
          <Input
            className="mt-1.5"
            type="number"
            disabled={v.timer_mode !== "question"}
            value={v.question_timer_seconds}
            onChange={(e) => setV({ ...v, question_timer_seconds: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Questions</Label>
          <Input
            className="mt-1.5"
            type="number"
            value={v.questions_count}
            onChange={(e) => setV({ ...v, questions_count: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Total marks</Label>
          <Input
            className="mt-1.5"
            type="number"
            value={v.total_marks}
            onChange={(e) => setV({ ...v, total_marks: Number(e.target.value) })}
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={v.is_published}
              onChange={(e) => setV({ ...v, is_published: e.target.checked })}
            />
            Published
          </label>
        </div>
        <div className="sm:col-span-2">
          <Label>Instructions</Label>
          <Textarea
            className="mt-1.5"
            rows={3}
            value={v.instructions}
            onChange={(e) => setV({ ...v, instructions: e.target.value })}
          />
        </div>
      </div>
    </RowShell>
  );
}
