import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { LearningFlow } from "@/components/kkcc/learning-flow";
import { TestCard } from "@/components/kkcc/test-card";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { getCustomSeriesCatalog, listPublicTests } from "@/lib/content.functions";
import {
  getEffectiveLearningSeries,
  LEARNING_SERIES,
  setRuntimeCustomSeriesCatalog,
} from "@/lib/test-series-catalog";
import { canonicalSeriesId, prioritizeEnrolled } from "@/lib/learning-access";
import { useLearningAccess } from "@/hooks/use-learning-access";

export const Route = createFileRoute("/test-series/learn/$seriesId")({
  ssr: false,
  validateSearch: z.object({
    subject: z.string().optional(),
    chapter: z.string().optional(),
    view: z.enum(["learning", "tests"]).optional(),
  }),
  beforeLoad: async ({ location }) => {
    if (!isSupabaseConfigured())
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
  },
  head: () => ({
    meta: [{ title: "Test Series Learning — KKCC" }, { name: "robots", content: "noindex" }],
  }),
  component: SeriesLearningPage,
});
function SeriesLearningPage() {
  const { seriesId } = Route.useParams();
  const { subject, chapter, view } = Route.useSearch();
  const navigate = Route.useNavigate();
  const customCatalogQuery = useQuery({
    queryKey: ["public", "custom-series-catalog"],
    queryFn: () => getCustomSeriesCatalog(),
    staleTime: 60_000,
  });
  setRuntimeCustomSeriesCatalog(customCatalogQuery.data);
  const allSeries = [...getEffectiveLearningSeries(customCatalogQuery.data), ...LEARNING_SERIES];
  const series = allSeries.find(
    (item) => item.id === canonicalSeriesId(seriesId) || item.id === seriesId,
  );
  const access = useLearningAccess();
  const testsQuery = useQuery({
    queryKey: ["public", "tests"],
    queryFn: () => listPublicTests(),
    enabled: view === "tests",
  });
  if (!series)
    return (
      <SiteLayout>
        <PageHeader title="Test series not found" />
        <Button asChild>
          <Link to="/test-series">Back to Test Series</Link>
        </Button>
      </SiteLayout>
    );
  if (view !== "tests")
    return (
      <LearningFlow
        selection={{ series_id: series.id }}
        subject={subject}
        chapter={chapter}
        select={(nextSubject, nextChapter) => {
          void navigate({
            search: {
              ...(nextSubject ? { subject: nextSubject } : {}),
              ...(nextChapter ? { chapter: nextChapter } : {}),
            },
          });
        }}
      />
    );
  const direct = new Set(access.data?.test_ids ?? []);
  const seriesEnrolled = Boolean(access.data?.series_ids.includes(series.id));
  const tests = prioritizeEnrolled(
    (testsQuery.data ?? []).filter(
      (test) => canonicalSeriesId(test.series_name, access.data?.series_aliases) === series.id,
    ),
    direct,
  );
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Tests in this series"
        title={series.name}
        description={series.examTrack}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {access.isError && (
          <p role="alert">
            Access check failed: {access.error.message}
            <Button onClick={() => void access.refetch()}>Retry</Button>
          </p>
        )}
        {testsQuery.isPending && <p role="status">Loading tests…</p>}
        {testsQuery.isError && <p role="alert">{testsQuery.error.message}</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              enrolled={direct.has(test.id) || seriesEnrolled}
              allowed={Boolean(access.data?.allowed_test_ids.includes(test.id)) || !test.is_paid}
            />
          ))}
        </div>
        <article className="surface-panel mt-6 max-w-xl p-6">
          <h2 className="text-xl font-bold">Chapterwise practice</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose your subject and chapter using the existing exam-bank templates.
          </p>
          <Button asChild className="mt-4 rounded-full">
            <Link
              to="/test-series/learn/$seriesId"
              params={{ seriesId: series.id }}
              search={{ view: "learning" }}
            >
              Start Learning
            </Link>
          </Button>
        </article>
      </div>
    </SiteLayout>
  );
}
