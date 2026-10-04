/**
 * Student progress report.
 *
 * Turns the papers a student has already submitted into something actionable:
 * how they are trending, which subject is strong, which chapters are weak, and
 * a direct button into the practice zone for the weak ones. Every attempt row
 * already stores subject, chapter, score and marks, so nothing new is needed in
 * the database.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Flame,
  Loader2,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { listMyLearningResults } from "@/lib/test-attempts.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/progress")({
  head: () => ({
    meta: [
      { title: "My Progress — KKCC Dashboard" },
      {
        name: "description",
        content: "Subject-wise strength, weak chapters and score trend from your KKCC attempts.",
      },
      { property: "og:title", content: "My Progress — KKCC" },
      { property: "og:description", content: "See your strong and weak chapters and improve." },
    ],
  }),
  component: ProgressPage,
});

type Result = {
  id: string;
  subject?: string | null;
  chapter?: string | null;
  exam?: string | null;
  score?: number | null;
  total_marks?: number | null;
  correct_count?: number | null;
  attempted_count?: number | null;
  question_count?: number | null;
  submitted_at?: string | null;
  started_at?: string | null;
};

function percentOf(row: Result) {
  const total = row.total_marks ?? 0;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round(((row.score ?? 0) / total) * 1000) / 10));
}

function ProgressPage() {
  const { user } = useAuthUser();
  const fetchResults = useServerFn(listMyLearningResults);
  const { data, isLoading } = useQuery({
    queryKey: ["student", user?.id, "results"],
    enabled: Boolean(user),
    queryFn: () => fetchResults() as Promise<Result[]>,
    staleTime: 30_000,
  });

  const rows = useMemo(() => (data ?? []) as Result[], [data]);

  const report = useMemo(() => {
    const scored = rows.filter((row) => (row.total_marks ?? 0) > 0);
    const average = scored.length
      ? Math.round(
          (scored.reduce((total, row) => total + percentOf(row), 0) / scored.length) * 10,
        ) / 10
      : 0;

    const bySubject = new Map<string, { subject: string; attempts: number; percent: number }>();
    const byChapter = new Map<
      string,
      { chapter: string; subject: string; attempts: number; percent: number }
    >();
    for (const row of scored) {
      const subject = (row.subject ?? "").trim() || "Other";
      const subjectEntry = bySubject.get(subject) ?? { subject, attempts: 0, percent: 0 };
      subjectEntry.attempts += 1;
      subjectEntry.percent += percentOf(row);
      bySubject.set(subject, subjectEntry);

      const chapter = (row.chapter ?? "").trim();
      if (!chapter) continue;
      const key = `${subject}::${chapter}`;
      const chapterEntry = byChapter.get(key) ?? { chapter, subject, attempts: 0, percent: 0 };
      chapterEntry.attempts += 1;
      chapterEntry.percent += percentOf(row);
      byChapter.set(key, chapterEntry);
    }

    const subjects = [...bySubject.values()]
      .map((entry) => ({
        ...entry,
        average: Math.round((entry.percent / entry.attempts) * 10) / 10,
      }))
      .sort((a, b) => b.average - a.average);

    const chapters = [...byChapter.values()]
      .map((entry) => ({
        ...entry,
        average: Math.round((entry.percent / entry.attempts) * 10) / 10,
      }))
      .sort((a, b) => a.average - b.average);

    const weakChapters = chapters.filter((entry) => entry.average < 60).slice(0, 6);
    const strongChapters = chapters
      .filter((entry) => entry.average >= 75)
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);

    const trend = scored.slice(0, 10).reverse(); // oldest first
    const firstHalf = trend.slice(0, Math.ceil(trend.length / 2));
    const secondHalf = trend.slice(Math.ceil(trend.length / 2));
    const averageOf = (items: Result[]) =>
      items.length ? items.reduce((total, row) => total + percentOf(row), 0) / items.length : 0;
    const movement =
      trend.length >= 4 ? Math.round((averageOf(secondHalf) - averageOf(firstHalf)) * 10) / 10 : 0;

    const best = scored.slice().sort((a, b) => percentOf(b) - percentOf(a))[0] ?? null;

    return {
      total: rows.length,
      scored: scored.length,
      average,
      subjects,
      weakChapters,
      strongChapters,
      trend,
      movement,
      best,
      bestPercent: best ? percentOf(best) : 0,
    };
  }, [rows]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <BarChart3 className="h-6 w-6 text-primary" /> My progress
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Built from the papers you have submitted. Weak chapters are listed first so you know
          exactly what to practice next.
        </p>
      </header>

      {isLoading ? (
        <div className="surface-panel flex items-center gap-3 p-6 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Reading your attempts…
        </div>
      ) : null}

      {!isLoading && report.scored === 0 ? (
        <div className="surface-panel p-6 text-sm">
          <p className="font-bold">Nothing to analyse yet.</p>
          <p className="mt-2 text-muted-foreground">
            Attempt a paper from the Tests section or the Kit 2 practice zone and your subject-wise
            report will build itself automatically.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" className="rounded-full">
              <Link to="/dashboard/tests">Open tests</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link to="/games">Practice zone</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {report.scored > 0 ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface-panel p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Target className="h-4 w-4" /> Papers submitted
              </p>
              <p className="mt-2 text-2xl font-black">{report.scored}</p>
            </div>
            <div className="surface-panel p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Activity className="h-4 w-4" /> Average score
              </p>
              <p className="mt-2 text-2xl font-black">{report.average}%</p>
            </div>
            <div className="surface-panel p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {report.movement >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                Recent trend
              </p>
              <p
                className={`mt-2 text-2xl font-black ${
                  report.movement > 0
                    ? "text-emerald-600"
                    : report.movement < 0
                      ? "text-rose-600"
                      : ""
                }`}
              >
                {report.movement > 0 ? "+" : ""}
                {report.movement} pts
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">Across your last 10 papers</p>
            </div>
            <div className="surface-panel p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Award className="h-4 w-4" /> Best paper
              </p>
              <p className="mt-2 text-2xl font-black">{report.bestPercent}%</p>
              <p className="mt-1 truncate text-[11px] text-muted-foreground">
                {report.best?.chapter || report.best?.subject || "—"}
              </p>
            </div>
          </section>

          {/* Score trend */}
          <section className="surface-panel p-5">
            <h2 className="text-base font-black">Last {report.trend.length} papers</h2>
            <div className="mt-4 space-y-2">
              {report.trend.map((row) => {
                const percent = percentOf(row);
                return (
                  <div key={row.id} className="flex items-center gap-3 text-xs">
                    <span className="w-40 shrink-0 truncate font-semibold sm:w-56">
                      {row.chapter || row.subject || "Paper"}
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className={`block h-full ${
                          percent >= 75
                            ? "bg-emerald-500"
                            : percent >= 50
                              ? "bg-amber-500"
                              : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.max(2, percent)}%` }}
                      />
                    </span>
                    <span className="w-12 shrink-0 text-right font-bold">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Subjects */}
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="surface-panel p-5">
              <h2 className="text-base font-black">Subject-wise strength</h2>
              <div className="mt-3 space-y-2">
                {report.subjects.map((entry) => (
                  <div
                    key={entry.subject}
                    className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm"
                  >
                    <span className="truncate font-semibold">{entry.subject}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[11px] ${
                          entry.average >= 75
                            ? "border-emerald-500/50 text-emerald-600"
                            : entry.average < 50
                              ? "border-rose-500/50 text-rose-600"
                              : ""
                        }`}
                      >
                        {entry.average}%
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {entry.attempts} paper{entry.attempts === 1 ? "" : "s"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel p-5">
              <h2 className="flex items-center gap-2 text-base font-black">
                <Flame className="h-4 w-4 text-rose-500" /> Practice these first
              </h2>
              {report.weakChapters.length ? (
                <div className="mt-3 space-y-2">
                  {report.weakChapters.map((entry) => (
                    <div
                      key={`${entry.subject}-${entry.chapter}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-sm"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{entry.chapter}</span>
                        <span className="text-[11px] text-muted-foreground">{entry.subject}</span>
                      </span>
                      <span className="shrink-0 font-black text-rose-600">{entry.average}%</span>
                    </div>
                  ))}
                  <Button asChild size="sm" className="rounded-full">
                    <Link to="/games">
                      Practice these chapters <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No weak chapter right now — every chapter you attempted is above 60%. Keep the
                  streak going with a fresh mock paper.
                </p>
              )}

              {report.strongChapters.length ? (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Your strong chapters
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {report.strongChapters.map((entry) => (
                      <li
                        key={`strong-${entry.subject}-${entry.chapter}`}
                        className="flex justify-between gap-3"
                      >
                        <span className="truncate">{entry.chapter}</span>
                        <span className="shrink-0 font-bold text-emerald-600">
                          {entry.average}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>

          <p className="text-[11px] text-muted-foreground">
            Tip: submit every paper you start — an unfinished attempt is not counted here, so your
            report only ever shows real scores.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link to="/dashboard/tests">All tests &amp; results</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link to="/dashboard/student">My series &amp; validity</Link>
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
