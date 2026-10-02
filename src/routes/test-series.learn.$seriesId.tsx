import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Layers3,
  Lock,
  PlayCircle,
  Timer,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { isSandboxAdminSession, SANDBOX_ADMIN_ID } from "@/integrations/supabase/sandbox";
import { listMySeriesAccess } from "@/lib/test-access.functions";
import { listPublishedSeriesSyllabi } from "@/lib/test-series-syllabus.functions";
import { isTestSeriesSyllabus } from "@/lib/test-series-syllabus";
import type { TestSeriesSyllabus } from "@/lib/test-series-syllabus";
import { safeServerCall } from "@/lib/safe-server-call";
import {
  PAID_TEST_SERIES,
  seriesPlan,
  QUESTIONS_PER_CHAPTER,
  QUESTIONS_PER_COMBINED_TEST,
  QUESTIONS_PER_SUBJECT_TEST,
} from "@/lib/test-series-catalog";

export const Route = createFileRoute("/test-series/learn/$seriesId")({
  ssr: false,
  beforeLoad: async ({ params, location }) => {
    if (isSandboxAdminSession()) return { userId: SANDBOX_ADMIN_ID, seriesId: params.seriesId };
    if (!isSupabaseConfigured())
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login", search: { redirectTo: location.href } });
    return { userId: data.user.id, seriesId: params.seriesId };
  },
  component: SeriesLearningPage,
});

type LearningTopic = { name: string; bank_topic: string };
type LearningChapter = { name: string; topics: LearningTopic[] };
type LearningSubject = { name: string; bank_subject: string; chapters: LearningChapter[] };

function formatExpiry(expiresAt: string | null) {
  if (!expiresAt) return "Lifetime access";
  return `Valid till ${new Date(expiresAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
}

function SeriesLearningPage() {
  const { seriesId } = Route.useRouteContext();
  const series = PAID_TEST_SERIES.find((item) => item.id === seriesId);
  const [subject, setSubject] = useState<string | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);

  const accessQuery = useQuery({
    queryKey: ["my", "series-access"],
    queryFn: () => safeServerCall(() => listMySeriesAccess({} as never), []),
    staleTime: 30_000,
  });
  const syllabusQuery = useQuery({
    queryKey: ["public", "series-syllabi"],
    queryFn: () => listPublishedSeriesSyllabi(),
    staleTime: 30_000,
  });
  const access = (accessQuery.data ?? []).find((item) => {
    if (item.series_id === seriesId) return true;
    return Boolean(
      series && item.series_id.trim().toLowerCase() === series.name.trim().toLowerCase(),
    );
  });
  const savedBlueprint = (syllabusQuery.data ?? []).find(
    (item) => item.series_id === seriesId && item.status === "published",
  );
  const syllabus = savedBlueprint?.syllabus;
  const plan = useMemo<LearningSubject[]>(() => {
    if (syllabus && isTestSeriesSyllabus(syllabus)) {
      return (syllabus as TestSeriesSyllabus).subjects.map((item) => ({
        name: item.name,
        bank_subject: item.bank_subject,
        chapters: item.chapters,
      }));
    }
    return (series ? seriesPlan(series) : []).map((item) => ({
      name: item.subject,
      bank_subject: item.subject,
      chapters: item.chapters.map((name) => ({
        name,
        topics: [{ name, bank_topic: name }],
      })),
    }));
  }, [series, syllabus]);
  const subjectPlan = plan.find((item) => item.bank_subject === subject);
  const chapterPlan = subjectPlan?.chapters.find((item) => item.name === chapter);
  const exam = savedBlueprint?.exam_track ?? series?.examTrack ?? "All Exams";

  if (!series) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Test series not found</h1>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/test-series">Back to test series</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  if (accessQuery.isPending) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center text-sm text-muted-foreground">
          Checking your series access…
        </div>
      </SiteLayout>
    );
  }

  if (!access) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <Lock className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Series access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This learning area opens only after the series is enrolled on your account.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/test-series">Back to test series</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const expiry = formatExpiry(access.expires_at);
  const activeSubject = subjectPlan ?? null;
  const startTest = (
    kind: "combined" | "subject" | "chapter" | "topic",
    values: {
      subject?: string;
      chapter?: string;
      topic?: string;
    } = {},
  ) => ({
    to: "/test/$id" as const,
    params: { id: "series" },
    search: {
      series: series.id,
      exam,
      kind,
      subject: values.subject,
      chapter: values.chapter,
      topic: values.topic,
      autoStart: true,
    },
  });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="My enrolled series · Active"
        title={series.name}
        description={`${series.examTrack} · ${expiry}`}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/test-series">
              <ChevronLeft className="mr-1.5 h-4 w-4" /> Back to series
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Active
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {expiry}
            </Badge>
          </div>
        </div>

        {!subject && (
          <section>
            <h2 className="text-xl font-black">Choose how to practise</h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
              <article className="surface-panel border-primary/30 bg-primary/5 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="secondary" className="rounded-full">
                      <Layers3 className="mr-1 h-3.5 w-3.5" /> Combined full syllabus
                    </Badge>
                    <h3 className="mt-3 text-lg font-black">Start a combined mock now</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Questions are drawn across the published subjects. Selecting this starts the
                      mock immediately; there is no extra subject or chapter step.
                    </p>
                  </div>
                  <ClipboardList className="h-6 w-6 shrink-0 text-primary" />
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="h-3.5 w-3.5" /> {QUESTIONS_PER_COMBINED_TEST} questions · Mixed
                  difficulty · fresh on every attempt
                </p>
                <Button asChild className="mt-4 w-full rounded-full">
                  <Link {...startTest("combined")}>Start combined test</Link>
                </Button>
              </article>

              <div className="surface-panel p-6">
                <Badge variant="outline" className="rounded-full">
                  <BookOpenCheck className="mr-1 h-3.5 w-3.5" /> Subject-wise learning
                </Badge>
                <h3 className="mt-3 text-lg font-black">Choose a subject</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open a full subject paper, then drill into chapters and their mapped topics.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {plan.length} published subjects · topic structure from the current syllabus
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {plan.map((item) => (
                <button
                  key={item.bank_subject}
                  type="button"
                  onClick={() => setSubject(item.bank_subject)}
                  className="surface-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <BookOpenCheck className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-bold">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.chapters.length} chapters ·{" "}
                    {item.chapters.reduce((sum, item) => sum + item.topics.length, 0)} topics
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {subject && activeSubject && !chapter && (
          <section>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={() => setSubject(null)}
            >
              <ChevronLeft className="h-4 w-4" /> Subjects
            </Button>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">{activeSubject.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start a subject-wide paper or choose a chapter to drill down to topics.
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {activeSubject.chapters.length} chapters
              </Badge>
            </div>
            <article className="surface-panel mt-5 flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-bold">Full {activeSubject.name} test</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {QUESTIONS_PER_SUBJECT_TEST} questions across the mapped chapters.
                </p>
              </div>
              <Button asChild className="rounded-full">
                <Link {...startTest("subject", { subject: activeSubject.bank_subject })}>
                  <PlayCircle className="mr-1.5 h-4 w-4" /> Start subject test
                </Link>
              </Button>
            </article>

            <h3 className="mt-8 text-lg font-black">Choose chapter</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeSubject.chapters.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setChapter(item.name)}
                  className="surface-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <p className="font-bold">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.topics.length} mapped topic{item.topics.length === 1 ? "" : "s"} ·
                    complete chapter test available
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {subject && chapter && activeSubject && chapterPlan && (
          <section>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={() => setChapter(null)}
            >
              <ChevronLeft className="h-4 w-4" /> Chapters
            </Button>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">
                  {activeSubject.name} · {chapterPlan.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a topic test or take the complete chapter test.
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {chapterPlan.topics.length} topics
              </Badge>
            </div>

            <article className="surface-panel mt-5 flex flex-wrap items-center justify-between gap-4 border-primary/25 bg-primary/5 p-5">
              <div>
                <p className="font-bold">Complete chapter test · {chapterPlan.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {QUESTIONS_PER_CHAPTER} questions drawn across all mapped chapter topics.
                </p>
              </div>
              <Button asChild className="rounded-full">
                <Link
                  {...startTest("chapter", {
                    subject: activeSubject.bank_subject,
                    chapter: chapterPlan.name,
                  })}
                >
                  <PlayCircle className="mr-1.5 h-4 w-4" /> Start chapter test
                </Link>
              </Button>
            </article>

            <h3 className="mt-8 text-lg font-black">Topics in this chapter</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {chapterPlan.topics.map((item) => (
                <article
                  key={`${item.name}-${item.bank_topic}`}
                  className="surface-panel flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.bank_topic
                        ? "Mapped to verified question-bank content"
                        : "Needs a question-bank mapping"}
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    disabled={!item.bank_topic}
                  >
                    <Link
                      {...startTest("topic", {
                        subject: activeSubject.bank_subject,
                        chapter: chapterPlan.name,
                        topic: item.name,
                      })}
                    >
                      <PlayCircle className="mr-1.5 h-4 w-4" /> Start topic test
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
