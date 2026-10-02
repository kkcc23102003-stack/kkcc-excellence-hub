import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpenCheck, ChevronLeft, ClipboardList, Lock, Timer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { listMySeriesAccess } from "@/lib/test-access.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { PAID_TEST_SERIES, seriesPlan } from "@/lib/test-series-catalog";

export const Route = createFileRoute("/test-series/learn/$seriesId")({
  ssr: false,
  beforeLoad: async ({ params, location }) => {
    if (!isSupabaseConfigured())
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login", search: { redirectTo: location.href } });
    return { userId: data.user.id, seriesId: params.seriesId };
  },
  component: SeriesLearningPage,
});

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
  const access = (accessQuery.data ?? []).find((item) => {
    if (item.series_id === seriesId) return true;
    const catalog = PAID_TEST_SERIES.find((entry) => entry.id === seriesId);
    return Boolean(
      catalog && item.series_id.trim().toLowerCase() === catalog.name.trim().toLowerCase(),
    );
  });
  const plan = useMemo(() => (series ? seriesPlan(series) : []), [series]);
  const subjectPlan = plan.find((item) => item.subject === subject);
  const exam = series?.examTrack ?? "All Exams";

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

  const expiry = access.expires_at
    ? `Valid till ${new Date(access.expires_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`
    : "Lifetime access";

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="My enrolled series"
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
          <Badge variant="secondary" className="rounded-full">
            {expiry}
          </Badge>
        </div>

        {!subject && (
          <section>
            <h2 className="text-xl font-black">1. Choose subject</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {plan.map((item) => (
                <button
                  key={item.subject}
                  type="button"
                  onClick={() => setSubject(item.subject)}
                  className="surface-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <BookOpenCheck className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-bold">{item.subject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.chapters.length} chapters
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {subject && !chapter && subjectPlan && (
          <section>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full"
                onClick={() => setSubject(null)}
              >
                <ChevronLeft className="h-4 w-4" /> Subjects
              </Button>
            </div>
            <h2 className="mt-3 text-xl font-black">2. Choose chapter — {subject}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjectPlan.chapters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setChapter(item)}
                  className="surface-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <p className="font-bold">{item}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    60-question chapter test · Fresh paper each attempt
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {subject && chapter && (
          <section>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full"
                onClick={() => setChapter(null)}
              >
                <ChevronLeft className="h-4 w-4" /> Chapters
              </Button>
            </div>
            <h2 className="mt-3 text-xl font-black">3. Start test — {chapter}</h2>
            <article className="surface-panel mt-5 max-w-2xl p-6">
              <div className="flex items-start justify-between gap-3">
                <ClipboardList className="h-6 w-6 text-primary" />
                <Badge variant="outline" className="rounded-full text-[10px]">
                  60 Questions · Mixed
                </Badge>
              </div>
              <h3 className="mt-3 text-lg font-bold">
                {subject} — {chapter}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Fresh chapter paper generated for this attempt: 20 Easy + 20 Moderate + 20 Difficult
                questions. The generated questions are not saved to Supabase.
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Timer className="h-3.5 w-3.5" /> 60 minutes · 60 questions · 60 marks
              </p>
              <Button asChild className="mt-5 w-full rounded-full">
                <Link
                  to="/test/$id"
                  params={{ id: "series" }}
                  search={{ series: series.id, exam, subject, chapter }}
                >
                  Start Test Series
                </Link>
              </Button>
            </article>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
