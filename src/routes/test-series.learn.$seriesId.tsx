import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Coins,
  IndianRupee,
  Layers,
  Lock,
  PhoneCall,
  PlayCircle,
  Sparkles,
  Timer,
} from "lucide-react";
import { LearningFlow } from "@/components/kkcc/learning-flow";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { TestCard } from "@/components/kkcc/test-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useLearningAccess } from "@/hooks/use-learning-access";
import {
  getCustomSeriesCatalog,
  listPublicTests,
  listSeriesOverrides,
} from "@/lib/content.functions";
import {
  EMPTY_PUBLIC_PAYMENT_SETTINGS,
  getPublicPaymentSettings,
} from "@/lib/platform-settings.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import {
  COMBINED_TESTS_PER_SERIES,
  QUESTIONS_PER_CHAPTER,
  QUESTIONS_PER_COMBINED_TEST,
  QUESTIONS_PER_SUBJECT_TEST,
  getEffectiveLearningSeries,
  resolveSeriesPrice,
  seriesLayers,
  seriesPlan,
  seriesTotals,
  setRuntimeCustomSeriesCatalog,
} from "@/lib/test-series-catalog";

export const Route = createFileRoute("/test-series/learn/$seriesId")({
  // Every parameter is optional so a link can deep link into one view without
  // spelling out the other five, e.g. `/test-series/learn/x?view=tests`.
  validateSearch: (search: Record<string, unknown>): SeriesLearningSearch => {
    const out: SeriesLearningSearch = {};
    for (const key of ["level", "subject", "chapter", "topic", "test", "view"] as const) {
      const value = search[key];
      if (typeof value === "string" && value) out[key] = value;
    }
    if (!out["chapter"] && out["topic"]) out["chapter"] = out["topic"];
    return out;
  },
  component: SeriesLearningPage,
});

type SeriesLearningSearch = {
  level?: string;
  subject?: string;
  chapter?: string;
  topic?: string;
  test?: string;
  view?: string;
};

function SeriesLearningPage() {
  const { seriesId } = Route.useParams();
  const { subject = "", chapter = "", view = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { user, loading } = useAuthUser();
  const learningAccess = useLearningAccess();

  const customCatalogQuery = useQuery({
    queryKey: ["public", "custom-series-catalog"],
    queryFn: () => safeServerCall(() => getCustomSeriesCatalog({} as never), {}),
    staleTime: 15_000,
  });
  const overridesQuery = useQuery({
    queryKey: ["public", "series-overrides"],
    queryFn: () => safeServerCall(() => listSeriesOverrides({} as never), []),
    staleTime: 30_000,
  });
  const paymentQuery = useQuery({
    queryKey: ["public", "payment-settings"],
    queryFn: () => safeServerCall(() => getPublicPaymentSettings(), EMPTY_PUBLIC_PAYMENT_SETTINGS),
    staleTime: 30_000,
  });
  const publicTestsQuery = useQuery({
    queryKey: ["public", "tests-for-series", seriesId],
    queryFn: () => safeServerCall(() => listPublicTests(), []),
    staleTime: 30_000,
  });

  const series = useMemo(() => {
    const customCatalog = customCatalogQuery.data ?? {};
    setRuntimeCustomSeriesCatalog(customCatalog);
    const list = getEffectiveLearningSeries(customCatalog);
    const raw =
      list.find((s) => s.id.toLowerCase() === seriesId.toLowerCase()) ??
      list.find((s) => s.name.toLowerCase() === seriesId.toLowerCase()) ??
      null;
    if (!raw) return null;
    const override = (overridesQuery.data ?? []).find((o) => o.series_id === raw.id);
    const price = resolveSeriesPrice(raw, override);
    return {
      ...raw,
      name: override?.name ?? raw.name,
      summary: override?.summary ?? raw.summary,
      ...price,
    };
  }, [seriesId, customCatalogQuery.data, overridesQuery.data]);

  const paymentConfigured = Boolean(
    paymentQuery.data?.enabled && paymentQuery.data?.razorpay_key_id,
  );
  const isFree = series ? series.priceInr <= 0 && series.priceCoins <= 0 : false;
  const allowed = Boolean(
    isFree || (series && learningAccess.data?.allowed_series_ids.includes(series.id)),
  );

  // If the student clicked "View tests in this series" (view=tests) OR the series is locked,
  // show the full Test Series Syllabus & Tests Overview so students can always inspect the syllabus!
  if (view === "tests" || (series && !allowed && !loading && !learningAccess.isLoading)) {
    if (!series) {
      return (
        <SiteLayout>
          <div className="mx-auto max-w-2xl px-4 py-16 text-center">
            <h1 className="text-2xl font-black">Test series not found</h1>
            <Button asChild className="mt-5 rounded-full">
              <Link to="/test-series">Back to Test Series</Link>
            </Button>
          </div>
        </SiteLayout>
      );
    }

    const plan = seriesPlan(series);
    const totals = seriesTotals(series);
    const layers = seriesLayers(series);
    const qPerChapter = Math.max(1, series.questionsPerTest ?? QUESTIONS_PER_CHAPTER);
    const easyQ = Math.max(0, Math.floor(qPerChapter / 3));
    const modQ = Math.max(0, Math.floor((qPerChapter - easyQ) / 2));
    const diffQ = Math.max(1, qPerChapter - easyQ - modQ);

    const seriesTests = (learningAccess.data?.tests ?? publicTestsQuery.data ?? []).filter(
      (test) =>
        test.series_name?.trim().toLowerCase() === series.id.trim().toLowerCase() ||
        test.series_name?.trim().toLowerCase() === series.name.trim().toLowerCase(),
    );

    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-10">
          {/* Header */}
          <div className="surface-panel p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    Oriented for: {series.examTrack}
                  </Badge>
                  {isFree ? (
                    <Badge className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      <BookOpenCheck className="mr-1 h-3.5 w-3.5" /> Free Access
                    </Badge>
                  ) : allowed ? (
                    <Badge className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Enrolled · Unlocked
                    </Badge>
                  ) : (
                    <Badge className="rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300">
                      <Lock className="mr-1 h-3.5 w-3.5" />
                      {paymentConfigured
                        ? `Paid · Online (₹${series.priceInr})`
                        : `Paid · Offline (Contact Admin) · ₹${series.priceInr}`}
                    </Badge>
                  )}
                </div>
                <h1 className="mt-3 text-2xl font-black sm:text-3xl">{series.name}</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {series.summary}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary">
                    {totals.subjects} Subjects
                  </span>
                  <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary">
                    {totals.chapters} Chapter Tests ({qPerChapter}Q each: {easyQ} Easy · {modQ}{" "}
                    Moderate · {diffQ} Difficult)
                  </span>
                  <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary">
                    {totals.tests} Total Tests · {totals.questions.toLocaleString()} Questions
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                {allowed ? (
                  <Button asChild size="lg" className="rounded-full">
                    <Link to="/test-series/learn/$seriesId" params={{ seriesId: series.id }}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Open Interactive Test Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="rounded-full">
                    <Link to="/checkout" search={{ series: series.id }}>
                      <Lock className="mr-2 h-4 w-4" />
                      {paymentConfigured
                        ? `Buy This Series — ₹${series.priceInr}`
                        : "Buy Series (Offline — Contact Admin)"}
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to="/test-series">Back to All Test Series</Link>
                </Button>
              </div>
            </div>

            {/* Locked / Offline Payment Notice Banner when not yet unlocked */}
            {!allowed && !isFree && (
              <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="max-w-2xl space-y-1">
                    <p className="flex items-center gap-2 text-sm font-black text-amber-900 dark:text-amber-200">
                      <PhoneCall className="h-4 w-4" />
                      {paymentConfigured
                        ? "Unlock Full Test Series Access (Online Razorpay or 23KAAT Coins)"
                        : "Paid (Offline) — Please Contact Admin for Offline Payment"}
                    </p>
                    <p className="text-xs leading-relaxed text-foreground/90">
                      {paymentConfigured
                        ? `Buy this test series online via Razorpay for ₹${series.priceInr} or unlock immediately with ${series.priceCoins} 23KAAT coins.`
                        : `Online payment (Razorpay) is not enabled yet. Please contact Admin for offline payment (₹${series.priceInr}) or use ${series.priceCoins} 23KAAT coins at checkout. You can review the complete subject and chapter syllabus below.`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild size="sm" className="rounded-full">
                      <Link to="/checkout" search={{ series: series.id }}>
                        {paymentConfigured
                          ? `Buy Now — ₹${series.priceInr}`
                          : "Contact Admin / Checkout"}
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="rounded-full">
                      <Link to="/support">Contact Support</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Series Test Layers Summary */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {layers.map((layer) => (
                <div key={layer.kind} className="rounded-2xl border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-primary">
                      {layer.label}
                    </span>
                    <Badge variant="secondary" className="rounded-full text-[11px]">
                      {layer.tests} {layer.tests === 1 ? "test" : "tests"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{layer.detail}</p>
                  <p className="mt-2 text-xs font-bold">
                    {layer.questionsPerTest} Questions per test
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Full Subject & Chapterwise Test Syllabus */}
          <div className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Layers className="h-5 w-5 text-primary" />
                  Complete Test Series Syllabus &amp; Chapterwise Tests
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Every subject includes chapterwise tests ({qPerChapter} MCQs per chapter: {easyQ}{" "}
                  Easy, {modQ} Moderate, {diffQ} Difficult) plus a {QUESTIONS_PER_SUBJECT_TEST}
                  -question Subjectwise Master Test.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-bold">
                {totals.subjects} Subjects · {totals.chapters} Chapters
              </Badge>
            </div>

            <div className="mt-5 space-y-5">
              {plan.map((item, subjectIndex) => (
                <section key={item.subject} className="surface-panel overflow-hidden p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">
                        Subject {subjectIndex + 1} of {plan.length}
                      </span>
                      <h3 className="mt-0.5 text-lg font-black">{item.subject}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        {item.chapters.length} Chapter Tests · {qPerChapter}Q each
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        + 1 Subjectwise Test ({QUESTIONS_PER_SUBJECT_TEST}Q)
                      </Badge>
                      {allowed ? (
                        <Button asChild size="sm" className="rounded-full">
                          <Link
                            to="/test-series/learn/$seriesId"
                            params={{ seriesId: series.id }}
                            search={{ subject: item.subject }}
                          >
                            Start {item.subject} Tests
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild size="sm" variant="outline" className="rounded-full">
                          <Link to="/checkout" search={{ series: series.id }}>
                            <Lock className="mr-1.5 h-3.5 w-3.5" />
                            {paymentConfigured ? "Buy to Unlock" : "Contact Admin to Unlock"}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  <ol className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {item.chapters.map((chapter, chapterIndex) => (
                      <li
                        key={chapter}
                        className="flex items-center justify-between gap-3 rounded-xl border bg-background/70 px-3.5 py-2.5 text-xs transition hover:border-primary/40"
                      >
                        <div className="min-w-0">
                          <p className="font-bold leading-snug text-foreground">
                            <span className="mr-1.5 font-black text-primary">
                              {chapterIndex + 1}.
                            </span>
                            {chapter}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {qPerChapter} MCQs · {easyQ}E / {modQ}M / {diffQ}D
                          </p>
                        </div>
                        {allowed ? (
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="h-7 shrink-0 rounded-full px-2.5 text-[11px] font-bold text-primary hover:bg-primary/10"
                          >
                            <Link
                              to="/test-series/learn/$seriesId"
                              params={{ seriesId: series.id }}
                              search={{ subject: item.subject, topic: chapter }}
                            >
                              Practice →
                            </Link>
                          </Button>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                            <Lock className="h-2.5 w-2.5" /> {qPerChapter}Q
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>

          {/* Combined Full-Syllabus Mocks Section */}
          <div className="surface-panel mt-8 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge variant="secondary" className="rounded-full">
                  <Sparkles className="mr-1 h-3.5 w-3.5 text-primary" /> Full-Length Combined Mocks
                </Badge>
                <h3 className="mt-2 text-lg font-black">
                  {COMBINED_TESTS_PER_SERIES} Combined Full-Syllabus Mock Tests (
                  {QUESTIONS_PER_COMBINED_TEST} Questions Each)
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Covers all {totals.subjects} subjects ({series.subjects.join(", ")}) in a full
                  exam-pattern mock paper.
                </p>
              </div>
              {allowed ? (
                <Button asChild className="rounded-full">
                  <Link to="/test-series/learn/$seriesId" params={{ seriesId: series.id }}>
                    Open Combined Mocks
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/checkout" search={{ series: series.id }}>
                    <Lock className="mr-1.5 h-3.5 w-3.5" />
                    {paymentConfigured
                      ? `Buy Series — ₹${series.priceInr}`
                      : "Contact Admin for Offline Access"}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Additional Custom Tests attached to this Series (if any) */}
          {seriesTests.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-black">Additional Scheduled Papers in {series.name}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {seriesTests.map((test) => (
                  <TestCard key={test.id} test={test} enrolled={allowed} allowed={allowed} />
                ))}
              </div>
            </div>
          )}
        </div>
      </SiteLayout>
    );
  }

  if (loading || learningAccess.isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted-foreground">
          Checking your enrolled test series...
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-2xl font-black">Sign in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in with your student account to start attempting tests in this series.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link to="/login" search={{ redirectTo: `/test-series/learn/${seriesId}` }}>
                Sign in
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link
                to="/test-series/learn/$seriesId"
                params={{ seriesId }}
                search={{ view: "tests" }}
              >
                View Series Syllabus
              </Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <LearningFlow
      selection={{ series_id: series?.id ?? seriesId }}
      subject={subject || undefined}
      chapter={chapter || undefined}
      select={(nextSubject, nextChapter) => {
        void navigate({
          search: (prev) => ({
            ...prev,
            subject: nextSubject ?? "",
            chapter: nextChapter ?? "",
            topic: nextChapter ?? "",
            view: "",
          }),
        });
      }}
    />
  );
}
