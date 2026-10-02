import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  CheckCircle2,
  Circle,
  Download,
  FileQuestion,
  FileText,
  Lock,
  PlayCircle,
} from "lucide-react";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { MaterialAccessButton } from "@/components/kkcc/material-access-button";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { coinPriceOf, groupLectures, isFreeCourse } from "@/lib/cms";
import {
  getMyCourseLearningDeck,
  listPublishedCourses,
  listPublicLectures,
  listPublicMaterials,
  listPublicTests,
} from "@/lib/content.functions";
import { getMyCourseAccess } from "@/lib/enrollments.functions";
import { videoSource } from "@/lib/video";
import { safeServerCall } from "@/lib/safe-server-call";

const searchSchema = z.object({ course: z.string().optional() });

type LectureWithModule = { id: string; title: string; module: string; sort_order: number };
type MaterialWithOptionalAccess = {
  id: string;
  title: string;
  material_type: string;
  chapter: string;
  module_title: string;
  file_url: string | null;
  sort_order: number;
  course_id: string | null;
  access_type?: string | null;
  price?: number | null;
  coin_price?: number | null;
  lecture_id?: string | null;
};
type TestWithOptionalLecture = {
  id: string;
  title: string;
  duration_minutes: number;
  questions_count: number;
  total_marks: number;
  sort_order: number;
  course_id: string | null;
  lecture_id?: string | null;
};

function tokenise(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function looseIncludes(left: string | null | undefined, right: string | null | undefined) {
  const a = tokenise(left);
  const b = tokenise(right);
  return Boolean(a && b && (a.includes(b) || b.includes(a)));
}

function getMaterialAccessType(material: MaterialWithOptionalAccess) {
  return (material.access_type || (Number(material.price ?? 0) > 0 ? "paid" : "course")) as
    "course" | "free" | "paid";
}

function getMaterialPrice(material: MaterialWithOptionalAccess) {
  return Math.max(0, Number(material.price ?? 0) || 0);
}

function getMaterialCoinPrice(material: MaterialWithOptionalAccess) {
  return coinPriceOf({ price: material.price, coin_price: material.coin_price });
}

function matchLectureMaterials(
  active: LectureWithModule | undefined,
  materials: MaterialWithOptionalAccess[],
) {
  if (!active) return [];
  const exact = materials.filter((m) => m.lecture_id === active.id);
  if (exact.length) return exact;
  const matched = materials.filter(
    (m) =>
      looseIncludes(m.module_title, active.module) ||
      looseIncludes(m.chapter, active.title) ||
      looseIncludes(m.title, active.title) ||
      (m.sort_order > 0 && m.sort_order === active.sort_order),
  );
  return matched.length ? matched : materials.slice(0, 3);
}

function matchLectureTests(
  active: LectureWithModule | undefined,
  tests: TestWithOptionalLecture[],
) {
  if (!active) return [];
  const exact = tests.filter((t) => t.lecture_id === active.id);
  if (exact.length) return exact;
  const matched = tests.filter(
    (t) =>
      looseIncludes(t.title, active.title) ||
      (t.sort_order > 0 && t.sort_order === active.sort_order),
  );
  return matched.length ? matched : tests.slice(0, 2);
}

export const Route = createFileRoute("/learn")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Lecture Player — Learn with KKCC" },
      {
        name: "description",
        content: "Watch KKCC lectures with chapter navigation, notes and downloadable resources.",
      },
      { property: "og:title", content: "Lecture Player — KKCC" },
      {
        property: "og:description",
        content: "Structured video learning with curriculum navigation.",
      },
    ],
  }),
  loader: async () => {
    const [courses, lectures, materials, tests] = await Promise.all([
      safeServerCall(() => listPublishedCourses(), []),
      safeServerCall(() => listPublicLectures(), []),
      safeServerCall(() => listPublicMaterials(), []),
      safeServerCall(() => listPublicTests(), []),
    ]);
    return { courses, lectures, materials, tests };
  },
  component: LearnPage,
});

function LearnPage() {
  const { course: selectedSlug } = Route.useSearch();
  const { courses, lectures, materials, tests } = Route.useLoaderData();
  const selectedCourse = selectedSlug
    ? courses.find((course) => course.slug === selectedSlug)
    : null;
  const [accessibleCourseIds, setAccessibleCourseIds] = useState<string[] | null>(null);
  const [unlockedLectures, setUnlockedLectures] = useState<typeof lectures | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!selectedCourse || isFreeCourse(selectedCourse)) {
      setAccessibleCourseIds([]);
      setUnlockedLectures(null);
      return;
    }

    setAccessibleCourseIds(null);
    setUnlockedLectures(null);
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!data.session) return { course_ids: [] as string[] };
        return getMyCourseAccess();
      })
      .then((access) => {
        if (!cancelled) setAccessibleCourseIds(access.course_ids ?? []);
        if (selectedCourse && access.course_ids?.includes(selectedCourse.id)) {
          void getMyCourseLearningDeck({ data: { slug: selectedCourse.slug } })
            .then((deck) => {
              if (!cancelled) setUnlockedLectures(deck.lectures ?? []);
            })
            .catch((error) => {
              console.warn("[learn] unlocked lecture deck failed", error);
            });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAccessibleCourseIds([]);
          setUnlockedLectures(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCourse]);

  const paidCourseLocked = Boolean(
    selectedCourse &&
    !isFreeCourse(selectedCourse) &&
    !accessibleCourseIds?.includes(selectedCourse.id),
  );
  const learningLectures = unlockedLectures ?? lectures;
  const visibleLectures = selectedCourse
    ? learningLectures.filter(
        (lecture) =>
          lecture.course_id === selectedCourse.id && (!paidCourseLocked || lecture.is_free),
      )
    : lectures;
  const visibleMaterials = selectedCourse
    ? materials.filter(
        (material) => !material.course_id || material.course_id === selectedCourse.id,
      )
    : materials;
  const visibleTests = selectedCourse
    ? tests.filter((test) => !test.course_id || test.course_id === selectedCourse.id)
    : tests;
  const modules = groupLectures(visibleLectures);
  const flat = modules.flatMap((m) => m.lectures.map((l) => ({ ...l, module: m.title })));
  const flatIds = flat.map((lecture) => lecture.id).join("|");
  const firstLectureId = flat[0]?.id ?? "";
  const lectureIdSet = useMemo(() => new Set(flatIds ? flatIds.split("|") : []), [flatIds]);
  const progressKey = `kkcc-lecture-progress-v1-${selectedCourse?.id ?? "all"}`;
  const skipNextProgressSave = useRef(true);
  const [activeId, setActiveId] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const active = flat.find((l) => l.id === activeId) ?? flat[0];
  const source = videoSource(active?.video_url);
  const activeMaterialMatches = useMemo(
    () => matchLectureMaterials(active, visibleMaterials).slice(0, 8),
    [active, visibleMaterials],
  );
  const activeTestMatches = useMemo(
    () => matchLectureTests(active, visibleTests).slice(0, 6),
    [active, visibleTests],
  );
  const percent = Math.round((completed.length / Math.max(flat.length, 1)) * 100);

  useEffect(() => {
    setActiveId((current) => (current && lectureIdSet.has(current) ? current : firstLectureId));
  }, [firstLectureId, lectureIdSet]);

  useEffect(() => {
    skipNextProgressSave.current = true;
    if (typeof window === "undefined") {
      setCompleted([]);
      return;
    }

    try {
      const saved = JSON.parse(window.localStorage.getItem(progressKey) || "[]") as unknown;
      const savedIds = Array.isArray(saved)
        ? saved.filter((id): id is string => typeof id === "string")
        : [];
      setCompleted(savedIds.filter((id) => lectureIdSet.has(id)));
    } catch {
      setCompleted([]);
    }
  }, [progressKey, flatIds, lectureIdSet]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (skipNextProgressSave.current) {
      skipNextProgressSave.current = false;
      return;
    }
    window.localStorage.setItem(progressKey, JSON.stringify(completed));
  }, [completed, progressKey]);

  const toggle = (id: string) => {
    if (!id) return;
    setCompleted((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  if (selectedCourse && paidCourseLocked && !flat.length) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold">Course access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This paid course opens after secure online payment or confirmed offline enrolment.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link to="/checkout" search={{ course: selectedCourse.slug }}>
                Get access
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/dashboard/courses">My courses</Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!flat.length) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <PlayCircle className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold">
            {selectedCourse
              ? `No lectures published for ${selectedCourse.title} yet`
              : "No lectures published yet"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The KKCC team is preparing this learning deck. New lectures will appear here
            automatically.
          </p>
          <Button asChild className="mt-6 rounded-full">
            {selectedCourse ? (
              <Link to="/courses/$slug" params={{ slug: selectedCourse.slug }}>
                Back to course
              </Link>
            ) : (
              <Link to="/courses">Back to courses</Link>
            )}
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          {selectedCourse && paidCourseLocked && (
            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              You are watching free preview lectures. Full paid-course access is unlocked by secure
              online payment or confirmed offline payment.
              <Button asChild size="sm" className="ml-0 mt-3 rounded-full sm:ml-3 sm:mt-0">
                <Link to="/checkout" search={{ course: selectedCourse.slug }}>
                  Get access
                </Link>
              </Button>
            </div>
          )}
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-ink text-ink-foreground">
            {source.kind === "youtube" ? (
              <iframe
                key={source.src}
                src={source.src}
                title={active?.title ?? "Lecture video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            ) : source.kind === "file" ? (
              <video
                key={source.src}
                src={source.src}
                controls
                playsInline
                preload="metadata"
                controlsList="nodownload"
                className="absolute inset-0 h-full w-full bg-ink"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/20 text-primary">
                    <PlayCircle className="h-8 w-8" />
                  </span>
                  <p className="mt-4 px-6 text-sm font-medium">{active?.title}</p>
                  <p className="mt-1 text-xs text-ink-foreground/60">
                    No video has been added to this lecture yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-primary">{active?.module}</p>
              <h1 className="mt-1 text-xl font-bold sm:text-2xl">{active?.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{active?.duration}</p>
            </div>
            <Button
              size="sm"
              variant={completed.includes(activeId) ? "secondary" : "default"}
              className="w-full shrink-0 rounded-full sm:w-auto"
              onClick={() => toggle(activeId)}
            >
              {completed.includes(activeId) ? "Completed" : "Mark complete"}
            </Button>
          </div>

          <Tabs defaultValue="pack" className="mt-8">
            <TabsList className="flex h-auto flex-wrap justify-start gap-1 rounded-2xl bg-muted/70 p-1.5">
              <TabsTrigger value="pack" className="rounded-xl">
                Lecture pack
              </TabsTrigger>
              <TabsTrigger value="resources" className="rounded-xl">
                All resources
              </TabsTrigger>
              <TabsTrigger value="doubts" className="rounded-xl">
                Doubts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pack" className="mt-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="surface-panel p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">Notes/PDF for this lecture</h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Open the notes attached or matched to {active?.title}.
                      </p>
                    </div>
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                  </div>
                  <div className="mt-4 space-y-3">
                    {activeMaterialMatches.map((m) => {
                      const accessType = getMaterialAccessType(m);
                      const paidStandalone = accessType === "paid";
                      const courseIncluded = accessType === "course";
                      const locked = (paidCourseLocked && courseIncluded) || paidStandalone;
                      return (
                        <div key={m.id} className="rounded-2xl border bg-background/70 p-4">
                          <div className="flex items-start gap-3">
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="min-w-0 flex-1 truncate text-sm font-semibold">
                                  {m.title}
                                </p>
                                <Badge variant="secondary" className="rounded-full text-[10px]">
                                  {m.material_type}
                                </Badge>
                                {paidStandalone && (
                                  <>
                                    <Badge className="rounded-full text-[10px]">
                                      ₹{getMaterialPrice(m)}
                                    </Badge>
                                    <Badge variant="secondary" className="rounded-full text-[10px]">
                                      {getMaterialCoinPrice(m)} 23KAAT
                                    </Badge>
                                  </>
                                )}
                              </div>
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {[m.chapter, m.module_title].filter(Boolean).join(" · ") ||
                                  "Lecture resource"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {paidStandalone ? (
                              <MaterialAccessButton
                                fileUrl={m.file_url}
                                materialId={m.id}
                                accessType={m.access_type ?? null}
                                price={m.price ?? null}
                                coinPrice={m.coin_price ?? null}
                                className="w-auto"
                              />
                            ) : locked ? (
                              selectedCourse ? (
                                <Button asChild size="sm" className="rounded-full">
                                  <Link to="/checkout" search={{ course: selectedCourse.slug }}>
                                    <Lock className="mr-1.5 h-3.5 w-3.5" />
                                    Unlock
                                  </Link>
                                </Button>
                              ) : (
                                <Button asChild size="sm" className="rounded-full">
                                  <Link to="/courses">
                                    <Lock className="mr-1.5 h-3.5 w-3.5" />
                                    Unlock
                                  </Link>
                                </Button>
                              )
                            ) : courseIncluded ? (
                              <MaterialAccessButton
                                fileUrl={m.file_url}
                                materialId={m.id}
                                accessType="course"
                                price={m.price ?? null}
                                coinPrice={m.coin_price ?? null}
                                className="w-auto"
                              />
                            ) : m.file_url ? (
                              <Button asChild size="sm" variant="outline" className="rounded-full">
                                <a href={m.file_url} target="_blank" rel="noreferrer">
                                  <Download className="mr-1.5 h-3.5 w-3.5" /> Open PDF
                                </a>
                              </Button>
                            ) : (
                              <Badge variant="outline" className="rounded-full">
                                File coming soon
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {!activeMaterialMatches.length && (
                      <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                        No notes/PDF are attached to this lecture yet. The resource deck for this
                        lesson will appear automatically when released.
                      </div>
                    )}
                  </div>
                </div>

                <div className="surface-panel p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">Test for this lecture</h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Practice immediately after watching this lesson.
                      </p>
                    </div>
                    <FileQuestion className="h-5 w-5 shrink-0 text-primary" />
                  </div>
                  <div className="mt-4 space-y-3">
                    {activeTestMatches.map((test) => (
                      <div key={test.id} className="rounded-2xl border bg-background/70 p-4">
                        <div className="flex items-start gap-3">
                          <FileQuestion className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{test.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {test.duration_minutes} min · {test.questions_count} questions ·{" "}
                              {test.total_marks} marks
                            </p>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="outline" className="mt-3 rounded-full">
                          <Link to="/test/$id" params={{ id: test.id }}>
                            Start test
                          </Link>
                        </Button>
                      </div>
                    ))}
                    {!activeTestMatches.length && (
                      <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                        No test is attached to this lecture yet. Lesson-linked practice will appear
                        automatically when released.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="resources" className="mt-4">
              <div className="space-y-3">
                {visibleMaterials.slice(0, 8).map((m) => {
                  const accessType = getMaterialAccessType(m);
                  const paidStandalone = accessType === "paid";
                  const courseIncluded = accessType === "course";
                  const locked = (paidCourseLocked && courseIncluded) || paidStandalone;
                  return (
                    <div key={m.id} className="surface-panel flex items-center gap-3 p-4">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <span className="min-w-0 flex-1 truncate text-sm">{m.title}</span>
                      <Badge variant="secondary" className="shrink-0 rounded-full text-[10px]">
                        {m.material_type}
                      </Badge>
                      {paidStandalone && (
                        <>
                          <Badge className="shrink-0 rounded-full text-[10px]">
                            ₹{getMaterialPrice(m)}
                          </Badge>
                          <Badge variant="secondary" className="shrink-0 rounded-full text-[10px]">
                            {getMaterialCoinPrice(m)} 23KAAT
                          </Badge>
                        </>
                      )}
                      {paidStandalone ? (
                        <MaterialAccessButton
                          fileUrl={m.file_url}
                          materialId={m.id}
                          accessType={m.access_type ?? null}
                          price={m.price ?? null}
                          coinPrice={m.coin_price ?? null}
                          className="w-auto shrink-0"
                        />
                      ) : locked ? (
                        selectedCourse ? (
                          <Button asChild size="sm" className="shrink-0 rounded-full">
                            <Link to="/checkout" search={{ course: selectedCourse.slug }}>
                              <Lock className="mr-1.5 h-3.5 w-3.5" /> Unlock
                            </Link>
                          </Button>
                        ) : (
                          <Button asChild size="sm" className="shrink-0 rounded-full">
                            <Link to="/courses">
                              <Lock className="mr-1.5 h-3.5 w-3.5" /> Unlock
                            </Link>
                          </Button>
                        )
                      ) : courseIncluded ? (
                        <MaterialAccessButton
                          fileUrl={m.file_url}
                          materialId={m.id}
                          accessType="course"
                          price={m.price ?? null}
                          coinPrice={m.coin_price ?? null}
                          className="w-auto shrink-0"
                        />
                      ) : m.file_url ? (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="shrink-0 rounded-full"
                        >
                          <a href={m.file_url} target="_blank" rel="noreferrer">
                            <Download className="mr-1.5 h-3.5 w-3.5" /> Open
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  );
                })}
                {!visibleMaterials.length && (
                  <div className="surface-panel p-6 text-sm text-muted-foreground">
                    No resources have been uploaded for this course yet.
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="doubts" className="mt-4">
              <div className="surface-panel p-6">
                <h2 className="font-semibold">Ask a doubt</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the Student Doubt Centre to ask questions about this lecture, subject or
                  batch. Faculty replies are saved and also sent as personal notifications.
                </p>
                <Button asChild className="mt-5 rounded-full">
                  <Link to="/dashboard/doubts">Open Doubt Centre</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="surface-panel p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Saved learning progress</span>
              <span className="text-muted-foreground">{percent}%</span>
            </div>
            <Progress value={percent} className="mt-3 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {completed.length} of {flat.length} lectures completed
            </p>
          </div>

          <div className="mt-4 space-y-5">
            {modules.map((m) => (
              <div key={m.title}>
                <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.title}
                </p>
                <ul className="mt-2 space-y-1">
                  {m.lectures.map((l) => {
                    const done = completed.includes(l.id);
                    return (
                      <li key={l.id}>
                        <button
                          onClick={() => setActiveId(l.id)}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                            activeId === l.id ? "bg-primary/10 text-primary" : "hover:bg-muted",
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="min-w-0 flex-1 truncate">{l.title}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {l.duration}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="surface-panel mt-4 flex items-center gap-3 p-4 text-xs text-muted-foreground">
            <Lock className="h-4 w-4 shrink-0" />
            Free courses open instantly. Paid lectures are unlocked only after payment/manual
            enrolment.
          </div>

          <Button asChild variant="ghost" className="mt-3 w-full rounded-full">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </aside>
      </div>
    </SiteLayout>
  );
}
