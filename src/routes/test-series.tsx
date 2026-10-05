import { useLearningAccess } from "@/hooks/use-learning-access";
import { TestCard } from "@/components/kkcc/test-card";
import { LEARNING_SERIES, ADDITIONAL_PRACTICE_SERIES } from "@/lib/test-series-catalog";
import { useCallback, useMemo, useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertTriangle,
  BookOpenCheck,
  ChevronDown,
  ClipboardList,
  Coins,
  FileText,
  IndianRupee,
  Infinity as InfinityIcon,
  Layers,
  Lock,
  Search,
  Timer,
  Target,
} from "lucide-react";
import { FeatureUnavailable, SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { useAppControls } from "@/components/kkcc/app-controls-provider";
import { useWebsiteContent } from "@/components/kkcc/website-content-provider";
import { CustomPageSections } from "@/components/kkcc/custom-page-sections";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TestSeriesOverrideRow } from "@/integrations/supabase/db";
import {
  getCustomSeriesCatalog,
  listPublicTests,
  listSeriesOverrides,
} from "@/lib/content.functions";
import {
  EMPTY_PUBLIC_PAYMENT_SETTINGS,
  getPublicPaymentSettings,
} from "@/lib/platform-settings.functions";
import { listMySeriesAccess } from "@/lib/test-access.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { useAuthUser } from "@/hooks/use-auth-user";
import { displayNameFromUser } from "@/lib/auth";
import { submitAdmissionEnquiry } from "@/lib/enquiries.functions";
import { friendlyError } from "@/lib/storage";
import { KIT2_PER_23KAAT, RUPEES_PER_23KAAT } from "@/lib/coin-conversion";
import {
  CHAPTER_LEVELS,
  PAID_TEST_SERIES,
  QUESTIONS_PER_CHAPTER,
  SERIES_GROUPS,
  catalogTotals,
  getEffectiveLearningSeries,
  getEffectivePaidTestSeries,
  resolveSeriesPrice,
  seriesByGroup,
  seriesAdvancedTests,
  seriesLayers,
  seriesPlan,
  seriesTotals,
  setRuntimeCustomSeriesCatalog,
  type PaidTestSeries,
} from "@/lib/test-series-catalog";

export const Route = createFileRoute("/test-series")({
  head: () => ({
    meta: [
      { title: "Test Series — Chapter Tests & Mock Exams | KKCC" },
      {
        name: "description",
        content:
          "KKCC test series with chapter tests, sectional practice and full-length mocks, plus instant scoring and analysis.",
      },
      { property: "og:title", content: "Test Series — KKCC" },
      {
        property: "og:description",
        content: "Practice with timed tests and detailed result analysis.",
      },
    ],
  }),
  loader: () => safeServerCall(() => listPublicTests(), []),
  component: TestSeriesRoute,
});

type FreePracticeCard = {
  title: string;
  exam: string;
  subject: string;
  topic?: string;
  mode?: string;
  description: string;
};

const FREE_CHAPTER_PRACTICE: FreePracticeCard[] = [
  {
    title: "Class 9 Science NCERT",
    exam: "CBSE Class 9-10",
    subject: "Science Class 9",
    mode: "NCERT-based",
    description: "Motion, force, atoms, tissues, sound and energy.",
  },
  {
    title: "Class 10 Science NCERT",
    exam: "CBSE Class 9-10",
    subject: "Science Class 10",
    mode: "NCERT-based",
    description: "Acids, metals, heredity, light, electricity and environment.",
  },
  {
    title: "Class 9 Math NCERT",
    exam: "CBSE Class 9-10",
    subject: "Math Class 9",
    mode: "NCERT-based",
    description: "Number systems, polynomials, geometry and statistics.",
  },
  {
    title: "Class 10 Math NCERT",
    exam: "CBSE Class 9-10",
    subject: "Math Class 10",
    mode: "NCERT-based",
    description: "AP, trigonometry, circles, probability and mensuration.",
  },
  {
    title: "History + Geography",
    exam: "All Exams",
    subject: "SST",
    topic: "History",
    mode: "NCERT-based",
    description: "Board-level history, geography, civics and economy chapters.",
  },
  {
    title: "Polity High-Yield",
    exam: "All Exams",
    subject: "Polity",
    topic: "Constitution Basics",
    mode: "NCERT-based",
    description: "Constitution, rights, parliament, judiciary and local government.",
  },
  {
    title: "English Grammar",
    exam: "All Exams",
    subject: "English Grammar",
    topic: "Tenses",
    mode: "NCERT-based",
    description: "Tenses, articles, prepositions, subject-verb agreement and error spotting.",
  },
  {
    title: "Hindi Grammar",
    exam: "All Exams",
    subject: "Hindi Grammar",
    topic: "Karak and Vibhakti",
    mode: "NCERT-based",
    description: "Karak, sandhi, samas, tenses, synonyms, antonyms and idioms.",
  },
  {
    title: "Punjab Exam Chapterwise",
    exam: "Punjab ETT Cadre",
    subject: "Punjab GK",
    topic: "Districts and Headquarters",
    mode: "Exam-pattern",
    description: "Punjab GK, history, geography, economics and Punjabi subjects.",
  },
];

function TestSeriesRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // This route is a real parent. Rendering only the catalogue swallowed /learn/$seriesId.
  return pathname.startsWith("/test-series/learn/") ? <Outlet /> : <TestSeries />;
}

function TestSeries() {
  const content = useWebsiteContent();
  const controls = useAppControls();
  const tests = Route.useLoaderData();
  const [query, setQuery] = useState("");

  // Admin overrides from /admin/exam-bank: a hidden series disappears, and a
  // changed name, summary or price is what the student actually sees.
  const overridesQuery = useQuery({
    queryKey: ["public", "series-overrides"],
    queryFn: () => safeServerCall(() => listSeriesOverrides({} as never), []),
    staleTime: 60_000,
  });
  const customCatalogQuery = useQuery({
    queryKey: ["public", "custom-series-catalog"],
    queryFn: () => safeServerCall(() => getCustomSeriesCatalog({} as never), {}),
    staleTime: 15_000,
  });
  const paymentQuery = useQuery({
    queryKey: ["public", "payment-settings"],
    queryFn: () => safeServerCall(() => getPublicPaymentSettings(), EMPTY_PUBLIC_PAYMENT_SETTINGS),
    staleTime: 30_000,
  });
  const paymentConfigured = Boolean(
    paymentQuery.data?.enabled && paymentQuery.data?.razorpay_key_id,
  );
  const customCatalog = useMemo(() => {
    const data = customCatalogQuery.data ?? {};
    setRuntimeCustomSeriesCatalog(data);
    return data;
  }, [customCatalogQuery.data]);
  const activePaidSeries = useMemo(
    () => getEffectivePaidTestSeries(customCatalog),
    [customCatalog],
  );
  const activeLearningSeries = useMemo(
    () => getEffectiveLearningSeries(customCatalog),
    [customCatalog],
  );
  const paidTotals = useMemo(() => catalogTotals(customCatalog), [customCatalog]);
  const removedIds = useMemo(
    () => new Set(customCatalog.removedSeriesIds ?? []),
    [customCatalog.removedSeriesIds],
  );
  // Which series this student has actually paid for. Signed out, or with no
  // grant, the card stays locked.
  const learningAccess = useLearningAccess();
  const myAccessQuery = { data: learningAccess.data?.series_grants };
  const enrolledTests = learningAccess.data?.tests ?? [];
  const enrolledTestIds = new Set(enrolledTests.map((test) => test.id));
  const accessBySeries = useMemo(
    () => new Map((myAccessQuery.data ?? []).map((item) => [item.series_id, item])),
    [myAccessQuery.data],
  );
  const unlocked = useMemo(
    () => new Set(learningAccess.data?.allowed_series_ids ?? []),
    [learningAccess.data?.allowed_series_ids],
  );

  const enrolledSeries = useMemo(() => {
    const grants = myAccessQuery.data ?? [];
    return activeLearningSeries
      .map((series) => {
        const access = grants.find(
          (item) =>
            item.series_id.trim().toLowerCase() === series.id.trim().toLowerCase() ||
            item.series_id.trim().toLowerCase() === series.name.trim().toLowerCase(),
        );
        return access ? { series, access } : null;
      })
      .filter((item): item is { series: PaidTestSeries; access: (typeof grants)[number] } =>
        Boolean(item),
      );
  }, [myAccessQuery.data, activeLearningSeries]);

  const overrideRows = useMemo(
    () => (overridesQuery.data ?? []) as TestSeriesOverrideRow[],
    [overridesQuery.data],
  );
  const overrides = useMemo(() => {
    const m = new Map<string, TestSeriesOverrideRow>();
    for (const o of overrideRows) m.set(o.series_id, o);
    return m;
  }, [overrideRows]);
  const applyOverride = useCallback(
    <
      T extends {
        id: string;
        examTrack?: string;
        name: string;
        summary: string;
        priceInr: number;
        priceCoins: number;
      },
    >(
      s: T,
    ): T => {
      const o = overrides.get(s.id);
      const price = resolveSeriesPrice(s, o);
      if (!o) return { ...s, ...price };
      return {
        ...s,
        name: o.name ?? s.name,
        summary: o.summary ?? s.summary,
        ...price,
      };
    },
    [overrides],
  );
  const isHidden = useCallback(
    (id: string) => removedIds.has(id) || overrides.get(id)?.enabled === false,
    [overrides, removedIds],
  );

  /*
   * One search box covers the whole catalogue: series name, the exam it is
   * built for, the group heading and every subject inside it. An empty box
   * shows everything, so the page behaves exactly as before until typed in.
   */
  const needle = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!needle) return null;
    const words = needle.split(/\s+/);
    const hit = (series: PaidTestSeries) => {
      const hay = [series.name, series.examTrack, series.group, ...series.subjects]
        .join(" ")
        .toLowerCase();
      return words.every((w) => hay.includes(w));
    };
    return new Set(activePaidSeries.filter(hit).map((series) => series.id));
  }, [needle, activePaidSeries]);

  const matchCount = matches?.size ?? 0;

  if (!controls.testSeriesEnabled) {
    return (
      <SiteLayout>
        <FeatureUnavailable
          title="Test series is temporarily paused"
          description="The KKCC team is refreshing the practice and testing deck. Please check back shortly."
          actionTo="/courses"
          actionLabel="Open courses"
        />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="kkcc-test-series-page min-w-0 overflow-x-clip">
        {learningAccess.isError && (
          <section role="alert" className="mx-auto max-w-7xl px-4 py-6">
            Enrollment check failed: {learningAccess.error.message}
            <Button onClick={() => void learningAccess.refetch()}>Retry</Button>
          </section>
        )}
        {(enrolledSeries.length > 0 || enrolledTests.length > 0) && (
          <section
            data-testid="enrolled-series"
            className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6"
          >
            <h2 className="text-2xl font-black">My enrolled Test Series &amp; Tests</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              All your active enrollments appear first.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {enrolledSeries.map(({ series, access }) => (
                <SeriesCard
                  key={series.id}
                  series={applyOverride(series)}
                  unlocked
                  expiresAt={access.expires_at}
                  paymentConfigured={paymentConfigured}
                />
              ))}
              {enrolledTests.map((test) => (
                <TestCard key={test.id} test={test} enrolled allowed />
              ))}
            </div>
          </section>
        )}

        <PageHeader
          eyebrow={content.page_headers.test_series.eyebrow}
          title={content.page_headers.test_series.title}
          description={content.page_headers.test_series.description}
        />

        <CustomPageSections page="test_series" position="top" />

        <section className="border-t bg-muted/20">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Test Series Catalogue</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  Series are arranged by exam, subject and chapter. Question counts follow admin
                  settings and available matching questions; unrelated questions are never added to
                  fill a paper.
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {paidTotals.series} series · {paidTotals.chapters.toLocaleString()} chapter tests
              </Badge>
            </div>

            {activePaidSeries.length > 0 ? (
              <>
                <div className="mt-6">
                  <label htmlFor="series-search" className="sr-only">
                    Search test series
                  </label>
                  <div className="relative max-w-xl">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="series-search"
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search a series, exam or subject"
                      className="h-12 w-full rounded-full border bg-background pl-11 pr-4 text-sm outline-none ring-primary/40 transition focus:ring-2"
                    />
                  </div>
                  {needle ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {matchCount === 0
                        ? "No series matched your search."
                        : `${matchCount} series matched "${query.trim()}".`}
                    </p>
                  ) : null}
                </div>

                {SERIES_GROUPS.map((group) => {
                  const list = seriesByGroup(group, customCatalog)
                    .filter((series) => !matches || matches.has(series.id))
                    .filter(
                      (series) =>
                        !isHidden(series.id) &&
                        !enrolledSeries.some((item) => item.series.id === series.id),
                    )
                    .map(applyOverride);
                  if (!list.length) return null;
                  return (
                    <div key={group} className="mt-8">
                      <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-muted-foreground">
                        <Layers className="h-4 w-4 text-primary" /> {group}
                      </h3>
                      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {list.map((series) => (
                          <SeriesCard
                            key={series.id}
                            series={series}
                            unlocked={
                              unlocked.has(series.id) ||
                              (series.priceInr <= 0 && series.priceCoins <= 0)
                            }
                            expiresAt={accessBySeries.get(series.id)?.expires_at ?? null}
                            paymentConfigured={paymentConfigured}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="surface-panel mt-6 p-8 text-center">
                <BookOpenCheck className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-3 text-base font-bold">No Test Series Available Right Now</p>
                <p className="mx-auto mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                  New chapterwise and full-length test series are being prepared and will appear
                  here as soon as they are published.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
          <section>
            <h2 className="text-xl font-bold">{content.test_series.available_tests_title}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {tests
                .filter((test) => !enrolledTestIds.has(test.id))
                .map((t) => (
                  <div
                    key={t.id}
                    data-testid={`test-card-${t.id}`}
                    className="surface-panel hover-lift p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <ClipboardList className="h-5 w-5" />
                      </span>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Badge variant="secondary" className="rounded-full text-[11px]">
                          {t.subject}
                        </Badge>
                        {t.level && t.level !== "Mixed" && (
                          <Badge variant="outline" className="rounded-full text-[11px]">
                            {t.level}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 font-semibold">{t.title}</p>
                    {t.series_name && (
                      <p className="mt-1 break-words text-xs text-muted-foreground">
                        Series: {t.series_name}
                      </p>
                    )}
                    {t.exam_track && (
                      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-primary">
                        Oriented for: {t.exam_track}
                      </p>
                    )}
                    <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5" /> {formatTestTimer(t)} · {t.questions_count}{" "}
                        questions
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5" /> {t.total_marks} marks
                      </li>
                    </ul>
                    {t.is_paid && (
                      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
                        {t.price_inr > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                            <IndianRupee className="h-3 w-3" />
                            {t.price_inr}
                          </span>
                        )}
                        {t.price_coins > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-600 dark:text-amber-400">
                            <Coins className="h-3 w-3" />
                            {t.price_coins} coins
                          </span>
                        )}
                      </p>
                    )}
                    {t.is_paid && !learningAccess.data?.allowed_test_ids.includes(t.id) ? (
                      <UnlockTestButton test={t} paymentConfigured={paymentConfigured} />
                    ) : (
                      <Button asChild size="sm" className="mt-5 w-full rounded-full">
                        <Link to="/tests/learn/$testId" params={{ testId: t.id }}>
                          Start Learning
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
            </div>
            {!tests.length && (
              <p className="mt-5 rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                {content.test_series.empty_tests_text}
              </p>
            )}
          </section>

          <aside className="surface-panel h-fit p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <AlertTriangle className="h-4 w-4 text-primary" />{" "}
              {content.test_series.instructions_title}
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              {content.test_series.rules.map((r, i) => (
                <li key={r} className="flex gap-3">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  {r}
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-xl border border-dashed p-4 text-xs text-muted-foreground">
              {content.test_series.note}
            </p>
          </aside>
        </div>
        <CustomPageSections page="test_series" position="bottom" />
      </div>
    </SiteLayout>
  );
}

/**
 * One paid series. The exam it is oriented for is the loudest line on the
 * card, and under it every subject lists its chapters. Each chapter is one
 * 60 question test split 20 Easy, 20 Moderate, 20 Difficult.
 */
function SeriesCard({
  series,
  unlocked,
  expiresAt,
  paymentConfigured = false,
}: {
  series: PaidTestSeries;
  unlocked: boolean;
  expiresAt: string | null;
  paymentConfigured?: boolean;
}) {
  const plan = seriesPlan(series);
  const totals = seriesTotals(series);
  const isFree = series.priceInr <= 0 && series.priceCoins <= 0;
  const qPerChapter = Math.max(1, series.questionsPerTest ?? 60);
  const easyQ = Math.max(0, Math.floor(qPerChapter / 3));
  const modQ = Math.max(0, Math.floor((qPerChapter - easyQ) / 2));
  const diffQ = Math.max(1, qPerChapter - easyQ - modQ);
  const levelBreakdown = [
    { level: "Easy", questions: easyQ },
    { level: "Moderate", questions: modQ },
    { level: "Difficult", questions: diffQ },
  ];
  return (
    <article className="surface-panel hover-lift flex h-full min-w-0 max-w-full flex-col break-words p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ClipboardList className="h-5 w-5" />
        </span>
        {isFree ? (
          <Badge variant="secondary" className="rounded-full text-[11px]">
            <BookOpenCheck className="mr-1 h-3 w-3" /> Free
          </Badge>
        ) : unlocked ? (
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="rounded-full text-[11px]">
              <BookOpenCheck className="mr-1 h-3 w-3" /> Enrolled · Paid
            </Badge>
            <span className="text-[10px] font-semibold text-muted-foreground">
              {expiresAt
                ? `Valid till ${new Date(expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`
                : "Lifetime access"}
            </span>
          </div>
        ) : (
          <Badge
            className={
              paymentConfigured
                ? "rounded-full text-[11px]"
                : "rounded-full border border-amber-500/40 bg-amber-500/15 text-[11px] text-amber-800 dark:text-amber-300"
            }
          >
            <Lock className="mr-1 h-3 w-3" />
            {paymentConfigured ? "Paid · Online" : "Paid · Offline"}
          </Badge>
        )}
      </div>

      <h4 className="mt-4 font-bold leading-snug">{series.name}</h4>
      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-primary">
        Oriented for: {series.examTrack}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{series.summary}</p>

      <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
        {levelBreakdown.map((entry, index) => (
          <span
            key={entry.level}
            className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-primary"
          >
            {index + 1}. {entry.level} · {entry.questions}Q
          </span>
        ))}
        <span className="text-muted-foreground">({qPerChapter}Q per chapter)</span>
      </p>

      <div className="mt-4 grid grid-cols-1 gap-1.5">
        {seriesLayers(series).map((layer) => (
          <div
            key={layer.kind}
            className="flex items-center justify-between gap-3 rounded-xl border bg-background/60 px-3 py-2"
          >
            <span className="min-w-0">
              <span className="text-xs font-bold">{layer.label}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {layer.detail}
              </span>
            </span>
            <span className="shrink-0 text-right text-[11px] font-bold text-primary">
              {layer.tests} test{layer.tests === 1 ? "" : "s"}
              <span className="block font-normal text-muted-foreground">
                {layer.questionsPerTest}Q each
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Always show the collapsible Test Syllabus so students can see all subjects & chapters */}
      <details className="group mt-4 rounded-2xl border bg-background/60 p-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-bold">
          <span>
            {totals.chapters} chapter tests across {totals.subjects} subjects (View Syllabus)
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
        </summary>
        <div className="mt-3 space-y-3">
          {plan.map((item) => (
            <div key={item.subject}>
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                {item.subject} · {item.chapters.length} chapters
              </p>
              <ol className="mt-1.5 space-y-1">
                {item.chapters.map((chapter, index) => (
                  <li
                    key={chapter}
                    className="flex items-baseline justify-between gap-3 rounded-lg px-2 py-1 text-xs odd:bg-muted/40"
                  >
                    <span className="min-w-0">
                      <span className="mr-1.5 font-black text-muted-foreground">{index + 1}.</span>
                      {chapter}
                    </span>
                    <span className="shrink-0 font-bold text-primary">{qPerChapter}Q</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </details>

      {!unlocked ? (
        <div className="mt-3 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/10 p-4 text-center">
          <Lock className="mx-auto h-5 w-5 text-amber-700 dark:text-amber-300" />
          <p className="mt-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
            {paymentConfigured
              ? "Paid Series — Buy Online or Use 23KAAT Coins"
              : "Paid (Offline) — Please Contact Admin"}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {paymentConfigured
              ? "Click Buy This Series to pay online via Razorpay, redeem 23KAAT coins, or contact Admin."
              : "Online payment (Razorpay) is currently off. Please contact Admin for offline payment to unlock this series on your account."}
          </p>
          <p className="mt-2 text-sm font-black">
            {isFree ? "Free access" : `₹${series.priceInr} · ${series.priceCoins} coins`}
          </p>
        </div>
      ) : (
        <details className="group mt-2 rounded-2xl border border-primary/30 bg-primary/5 p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <InfinityIcon className="h-4 w-4 text-primary" />
              Unlimited advanced test · {totals.subjects} subjects
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-[11px] text-muted-foreground">
            An endless paper per subject, drawn only from the advanced, exam-oriented layer of the
            bank. No question count and no end screen — keep going as long as you want.
          </p>
          <ul className="mt-2 space-y-1">
            {seriesAdvancedTests(series).map((item) => (
              <li key={item.subject}>
                <a
                  href={item.href}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1 text-xs font-medium hover:bg-primary/10"
                >
                  <span className="min-w-0 truncate">{item.subject}</span>
                  <span className="shrink-0 font-bold text-primary">Start ∞</span>
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-auto pt-4">
        <Button asChild variant="outline" className="mb-3 w-full rounded-full">
          <Link
            to="/test-series/learn/$seriesId"
            params={{ seriesId: series.id }}
            search={{ view: "tests" }}
          >
            View tests in this series
          </Link>
        </Button>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Timer className="h-3.5 w-3.5" /> {totals.tests} tests ·{" "}
          {totals.questions.toLocaleString()} questions in the papers
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Drawn from a pool of{" "}
          <span className="font-bold text-foreground">{totals.pool.toLocaleString()}</span>{" "}
          parameter positions (not unique verified questions). Actual available paper counts are
          shown when you start.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-black">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
            <IndianRupee className="h-3.5 w-3.5" />
            {isFree ? "Free" : series.priceInr}
          </span>
          {!isFree && (
            <>
              <span className="text-xs font-bold text-muted-foreground">or</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-amber-600 dark:text-amber-400">
                <Coins className="h-3.5 w-3.5" />
                {series.priceCoins} coins
              </span>
            </>
          )}
        </div>
        {unlocked ? (
          <Button asChild className="mt-3 w-full rounded-full">
            <Link to="/test-series/learn/$seriesId" params={{ seriesId: series.id }}>
              Start Learning
            </Link>
          </Button>
        ) : isFree ? (
          <Button asChild className="mt-3 w-full rounded-full">
            <Link to="/test-series/learn/$seriesId" params={{ seriesId: series.id }}>
              Start Learning — Free
            </Link>
          </Button>
        ) : (
          <EnrolButton series={series} totals={totals} paymentConfigured={paymentConfigured} />
        )}
      </div>
    </article>
  );
}

/**
 * A paid test from the database. Opens Checkout (or sends a direct offline request to Admin).
 */
function UnlockTestButton({
  test,
  paymentConfigured = false,
}: {
  test: { id: string; title: string; exam_track: string; price_inr: number; price_coins: number };
  paymentConfigured?: boolean;
}) {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const sendEnquiry = useServerFn(submitAdmissionEnquiry);

  const unlock = useMutation({
    mutationFn: () => {
      if (!user?.email) throw new Error("LOGIN_REQUIRED");
      return sendEnquiry({
        data: {
          name: displayNameFromUser(user) || user.email,
          email: user.email,
          phone: "",
          class_level: "",
          interest: `${test.title}${test.exam_track ? ` — oriented for ${test.exam_track}` : ""}`,
          source: "paid_test",
          message:
            `I want to unlock the paid test "${test.title}". ` +
            `Price: ₹${test.price_inr} or ${test.price_coins} 23KAAT coins ` +
            `(1 23KAAT = ₹${RUPEES_PER_23KAAT}). Please contact me for offline payment and unlock access.`,
        },
      });
    },
    onSuccess: () =>
      toast.success("Please contact Admin for offline payment", {
        description:
          "Your unlock request has been sent to Admin. Once payment is confirmed, Admin will open this test on your account.",
      }),
    onError: (error: Error) => {
      if (error.message === "LOGIN_REQUIRED") {
        toast.info("Login required", {
          description: "Please login or sign up first so we can unlock the test for you.",
        });
        void navigate({ to: "/login", search: { redirectTo: "/test-series" } });
        return;
      }
      toast.error(friendlyError(error));
    },
  });

  return (
    <div className="mt-5 space-y-2">
      <Button asChild size="sm" className="w-full rounded-full">
        <Link to="/checkout" search={{ test: test.id }}>
          <Lock className="mr-1.5 h-3.5 w-3.5" />
          {paymentConfigured
            ? `Buy Test Online — ₹${test.price_inr}`
            : "Buy Test (Offline — Contact Admin)"}
        </Link>
      </Button>
      {!paymentConfigured && (
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-full text-xs"
          disabled={unlock.isPending}
          onClick={() => unlock.mutate()}
        >
          {unlock.isPending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Sending to Admin...
            </>
          ) : (
            "Contact Admin for Offline Payment"
          )}
        </Button>
      )}
    </div>
  );
}

/**
 * Enrolling in a paid Test Series works just like buying a Batch:
 * - Opens `/checkout?series=<seriesId>` where students can pay online via Razorpay
 *   (when enabled), redeem 23KAAT coins, or request offline access.
 * - When Razorpay is off, clearly tells the student in English to Contact Admin
 *   for offline payment.
 */
function EnrolButton({
  series,
  totals,
  paymentConfigured = false,
}: {
  series: PaidTestSeries;
  totals: ReturnType<typeof seriesTotals>;
  paymentConfigured?: boolean;
}) {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const sendEnquiry = useServerFn(submitAdmissionEnquiry);

  const enrol = useMutation({
    mutationFn: () => {
      if (!user?.email) throw new Error("LOGIN_REQUIRED");
      return sendEnquiry({
        data: {
          name: displayNameFromUser(user) || user.email,
          email: user.email,
          phone: "",
          class_level: "",
          interest: `${series.name} — oriented for ${series.examTrack}`,
          source: "paid_test_series",
          message:
            `I want to enrol in the ${series.name}, which is oriented for ${series.examTrack}. ` +
            `It has ${totals.chapters} chapter tests and ${totals.questions} questions. ` +
            `Price: ₹${series.priceInr} or ${series.priceCoins} 23KAAT coins ` +
            `(1 23KAAT = ₹${RUPEES_PER_23KAAT}). Please contact me for offline payment and open the series on my account.`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Please contact Admin for offline payment", {
        description: `Your offline payment request for ${series.name} has been sent to Admin. Once payment is confirmed, Admin will open this series on your account.`,
      });
    },
    onError: (error: Error) => {
      if (error.message === "LOGIN_REQUIRED") {
        toast.info("Login required", {
          description: "Please login or sign up first so we can open the series on your account.",
        });
        void navigate({ to: "/login", search: { redirectTo: "/test-series" } });
        return;
      }
      toast.error(friendlyError(error));
    },
  });

  return (
    <div className="mt-3 space-y-2">
      <Button asChild size="sm" className="w-full rounded-full">
        <Link to="/checkout" search={{ series: series.id }}>
          {paymentConfigured
            ? `Buy This Series — ₹${series.priceInr}`
            : "Buy Series (Offline — Contact Admin)"}
        </Link>
      </Button>
      {!paymentConfigured && (
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-full text-xs"
          disabled={enrol.isPending}
          onClick={() => enrol.mutate()}
        >
          {enrol.isPending ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Sending to Admin...
            </>
          ) : (
            "Contact Admin for Offline Payment"
          )}
        </Button>
      )}
      <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
        {paymentConfigured
          ? `Pay ₹${series.priceInr} online via Razorpay or use ${series.priceCoins} 23KAAT coins.`
          : `Online payment (Razorpay) is off — please contact Admin for offline payment or pay ${series.priceCoins} 23KAAT coins at checkout.`}
      </p>
    </div>
  );
}

function buildChapterPracticeUrl(item: FreePracticeCard) {
  const params = new URLSearchParams({
    exam: item.exam,
    subject: item.subject,
    topic: item.topic ?? "Mixed",
    mode: item.mode ?? "NCERT-based",
  });
  return `/games?${params.toString()}`;
}

function formatTestTimer(test: {
  duration_minutes: number;
  question_timer_seconds?: number | null;
  timer_mode?: string | null;
}) {
  if (
    test.timer_mode === "unlimited" ||
    (test.timer_mode === "test" && test.duration_minutes <= 0)
  ) {
    return "No timer";
  }
  if (test.timer_mode === "question") return `${test.question_timer_seconds ?? 0}s/question`;
  return `${test.duration_minutes} minutes`;
}
