import { useAuthUser } from "@/hooks/use-auth-user";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flag,
  Timer,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import {
  getLearningAttempt,
  saveLearningAttemptAnswers,
  submitLearningAttempt,
} from "@/lib/test-attempts.functions";
import type { LearningAttemptRow } from "@/integrations/supabase/db";
import type { ScorableQuestion } from "@/lib/test-scoring";

type TestAttemptQuestion = Omit<ScorableQuestion, "correct_index" | "explanation"> & {
  correct_index?: number;
  explanation?: string;
};

const NEON_OPTION_STYLES = [
  {
    idle: "border-cyan-400/40 bg-cyan-500/[0.06] hover:border-cyan-300 hover:bg-cyan-500/15 hover:shadow-[0_0_18px_rgba(34,211,238,0.22)]",
    active:
      "border-cyan-300 bg-gradient-to-r from-cyan-500/25 via-cyan-500/15 to-teal-500/20 shadow-[0_0_24px_rgba(34,211,238,0.38)] ring-1 ring-cyan-300/70",
    badgeIdle: "border-cyan-400/60 bg-cyan-500/20 text-cyan-700 dark:text-cyan-200",
    badgeActive:
      "border-cyan-200 bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.8)]",
  },
  {
    idle: "border-violet-400/40 bg-violet-500/[0.06] hover:border-violet-300 hover:bg-violet-500/15 hover:shadow-[0_0_18px_rgba(167,139,250,0.22)]",
    active:
      "border-violet-300 bg-gradient-to-r from-violet-500/25 via-purple-500/15 to-fuchsia-500/20 shadow-[0_0_24px_rgba(167,139,250,0.38)] ring-1 ring-violet-300/70",
    badgeIdle: "border-violet-400/60 bg-violet-500/20 text-violet-700 dark:text-violet-200",
    badgeActive:
      "border-violet-200 bg-violet-400 text-slate-950 shadow-[0_0_12px_rgba(167,139,250,0.8)]",
  },
  {
    idle: "border-pink-400/40 bg-pink-500/[0.06] hover:border-pink-300 hover:bg-pink-500/15 hover:shadow-[0_0_18px_rgba(244,114,182,0.22)]",
    active:
      "border-pink-300 bg-gradient-to-r from-pink-500/25 via-fuchsia-500/15 to-rose-500/20 shadow-[0_0_24px_rgba(244,114,182,0.38)] ring-1 ring-pink-300/70",
    badgeIdle: "border-pink-400/60 bg-pink-500/20 text-pink-700 dark:text-pink-200",
    badgeActive:
      "border-pink-200 bg-pink-400 text-slate-950 shadow-[0_0_12px_rgba(244,114,182,0.8)]",
  },
  {
    idle: "border-emerald-400/40 bg-emerald-500/[0.06] hover:border-emerald-300 hover:bg-emerald-500/15 hover:shadow-[0_0_18px_rgba(52,211,153,0.22)]",
    active:
      "border-emerald-300 bg-gradient-to-r from-emerald-500/25 via-teal-500/15 to-cyan-500/20 shadow-[0_0_24px_rgba(52,211,153,0.38)] ring-1 ring-emerald-300/70",
    badgeIdle: "border-emerald-400/60 bg-emerald-500/20 text-emerald-700 dark:text-emerald-200",
    badgeActive:
      "border-emerald-200 bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.8)]",
  },
];

export const Route = createFileRoute("/test/$id")({
  ssr: false,
  validateSearch: z.object({ attempt: z.string().uuid().optional() }),
  beforeLoad: async ({ location }) => {
    if (!isSupabaseConfigured())
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
  },
  loaderDeps: ({ search }) => ({ attempt: search.attempt }),
  loader: async ({ params, deps }) => {
    if (!deps.attempt) {
      if (params.id === "series") throw redirect({ to: "/test-series" });
      throw redirect({ to: "/tests/learn/$testId", params: { testId: params.id } });
    }
    const paper = await getLearningAttempt({ data: { attempt_id: deps.attempt } });
    if (
      (paper.attempt.test_id && paper.attempt.test_id !== params.id) ||
      (!paper.attempt.test_id && params.id !== "series")
    )
      throw new Error("Attempt and test ID do not match.");
    return { ...paper, test: { ...paper.test, minutes: paper.test.duration_minutes } };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.test.title || "Test"} — KKCC` },
      { name: "robots", content: "noindex" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-2xl font-bold">Test could not open</h1>
      <p className="mt-3 text-sm">{error instanceof Error ? error.message : String(error)}</p>
      <Button asChild className="mt-6">
        <Link to="/test-series">Back to Test Series</Link>
      </Button>
    </div>
  ),
  component: TestRunner,
});
function TestRunner() {
  const data = Route.useLoaderData();
  const { user, loading } = useAuthUser();
  if (loading)
    return (
      <p role="status" className="p-8">
        Checking your account…
      </p>
    );
  if (!user || data.attempt.user_id !== user.id)
    return (
      <section role="alert" className="p-8">
        This attempt belongs to another account. Sign in to the correct account.
      </section>
    );
  return <TestPaper key={data.attempt.id} questions={data.questions} />;
}

function TestPaper({ questions: dbQuestions }: { questions: TestAttemptQuestion[] }) {
  const { test, attempt, server_now } = Route.useLoaderData();
  const [paperQuestions, setPaperQuestions] = useState<TestAttemptQuestion[]>(dbQuestions);
  const [result, setResult] = useState<LearningAttemptRow | null>(
    attempt.status === "submitted" ? attempt : null,
  );
  const questions = paperQuestions.map((question) => ({
    id: question.id,
    text: question.question_text,
    subject: question.subject || test.subject,
    options: question.options,
    answer: question.correct_index,
    marks: question.marks,
    negativeMarks: question.negative_marks,
    explanation: question.explanation,
  }));

  const [started, setStarted] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(
    attempt.answers as Record<string, number>,
  );
  const [flagged, setFlagged] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(attempt.status === "submitted");
  const timerMode = test.timer_mode ?? "test";
  const questionSeconds = Math.max(0, attempt.question_timer_seconds);
  const isUnlimited = attempt.duration_seconds <= 0;
  const clockAnchor = useRef({ local: performance.now(), server: Date.parse(server_now) });
  const serverElapsed = useCallback(
    () =>
      Math.max(
        0,
        Math.floor(
          (clockAnchor.current.server +
            performance.now() -
            clockAnchor.current.local -
            Date.parse(attempt.started_at)) /
            1000,
        ),
      ),
    [attempt.started_at],
  );
  const initialElapsed = serverElapsed();
  const [elapsed, setElapsed] = useState(initialElapsed);
  const seconds = Math.max(0, attempt.duration_seconds - elapsed);
  const currentTimedIndex =
    questionSeconds > 0
      ? Math.min(questions.length - 1, Math.floor(elapsed / questionSeconds))
      : null;
  const questionLocked = currentTimedIndex !== null && index !== currentTimedIndex;
  const [saveError, setSaveError] = useState("");
  const submitFn = useServerFn(submitLearningAttempt);
  const saveFn = useServerFn(saveLearningAttemptAnswers);
  const submit = useMutation({
    mutationFn: () => submitFn({ data: { attempt_id: attempt.id, answers } }),
    onSuccess: (data) => {
      setResult(data.attempt);
      setPaperQuestions(data.questions);
      setAnswers(data.attempt.answers as Record<string, number>);
      setSubmitted(true);
    },
    onError: (error) =>
      toast.error(
        `Result was not saved: ${error instanceof Error ? error.message : String(error)}. Please retry Submit Test.`,
      ),
  });
  const mutateSubmit = submit.mutate;
  const autoSubmit = useRef(false);
  const saveRevision = useRef(attempt.answer_revision ?? 0);
  useEffect(() => {
    if (!started || submitted) return;
    const revision = ++saveRevision.current;
    const timeout = setTimeout(
      () => {
        void saveFn({ data: { attempt_id: attempt.id, answers, revision } })
          .then((result) => {
            if (revision !== saveRevision.current) return;
            setSaveError(
              result.ok
                ? ""
                : result.reason === "expired"
                  ? "The server deadline has passed. Only previously saved answers count."
                  : result.reason === "question_window_closed"
                    ? "This question time window has closed. Later changes cannot be saved."
                    : result.reason === "stale_revision"
                      ? "A newer answer version was already saved. Reload if this attempt is also open on another device."
                      : "Answers were not saved.",
            );
          })
          .catch((error) => {
            if (revision === saveRevision.current)
              setSaveError(error instanceof Error ? error.message : "Answers could not be saved.");
          });
      },
      questionSeconds > 0 ? 0 : 250,
    );
    return () => clearTimeout(timeout);
  }, [answers, attempt.id, saveFn, started, submitted, questionSeconds]);
  useEffect(() => {
    if (!started || submitted || isUnlimited) return;
    const timer = setInterval(() => setElapsed(serverElapsed()), 250);
    return () => clearInterval(timer);
  }, [started, submitted, isUnlimited, serverElapsed]);
  useEffect(() => {
    if (!submitted && currentTimedIndex !== null) setIndex(currentTimedIndex);
  }, [currentTimedIndex, submitted]);
  useEffect(() => {
    if (!started || submitted || isUnlimited || seconds > 0 || autoSubmit.current) return;
    autoSubmit.current = true;
    mutateSubmit();
  }, [seconds, started, submitted, isUnlimited, mutateSubmit]);

  const localScore = useMemo(
    () =>
      questions.reduce((acc, q) => {
        const a = answers[q.id];
        if (a === undefined) return acc;
        return acc + (q.answer !== undefined && a === q.answer ? q.marks : -q.negativeMarks);
      }, 0),
    [answers, questions],
  );

  const score = result?.score ?? localScore;
  const correct =
    result?.correct_count ??
    questions.filter((q) => q.answer !== undefined && answers[q.id] === q.answer).length;
  const attempted = Object.keys(answers).length;
  const clock = isUnlimited
    ? "No timer"
    : `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const timerDescription = isUnlimited
    ? "No timer: move when you click Next."
    : timerMode === "question"
      ? `${questionSeconds} seconds per question; earlier questions lock. Remaining test time is shown. Reload does not reset the server timer.`
      : "The timer starts immediately and auto-submits at zero.";

  if (!questions.length) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-16">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Questions for this test have not been published yet. Please check again later or contact
          KKCC support.
        </p>
        <Button asChild variant="outline" className="mt-8 w-fit rounded-full">
          <Link to="/test-series">Back to tests</Link>
        </Button>
      </div>
    );
  }

  const q = questions[index]!;

  if (!started) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-16">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li>
            {test.questions_count} questions ·{" "}
            {isUnlimited
              ? "No timer"
              : timerMode === "question"
                ? `${questionSeconds}s/question`
                : `${test.minutes} minutes`}{" "}
            · {test.total_marks} marks
          </li>
          {test.instructions && <li>{test.instructions}</li>}

          <li>{timerDescription}</li>
        </ul>
        <div className="mt-8 flex gap-3">
          <Button className="rounded-full" onClick={() => setStarted(true)}>
            Start test
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/test-series">Back</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div data-testid="test-result" className="mx-auto max-w-2xl px-4 py-16">
        <CheckCircle2 className="h-10 w-10 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
        <h1 className="mt-4 text-2xl font-bold">Result</h1>
        <p className="mt-2 text-sm font-semibold text-cyan-500 dark:text-cyan-300">
          Test submitted · Saved to your account
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{test.title}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Score",
              value: `${score}`,
              tone: "border-cyan-400/50 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.18)]",
            },
            {
              label: "Correct",
              value: `${correct}/${questions.length}`,
              tone: "border-emerald-400/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.18)]",
            },
            {
              label: "Attempted",
              value: `${attempted}/${questions.length}`,
              tone: "border-violet-400/50 bg-violet-500/10 text-violet-600 dark:text-violet-300 shadow-[0_0_20px_rgba(167,139,250,0.18)]",
            },
          ].map((s) => (
            <div key={s.label} className={cn("rounded-2xl border p-5", s.tone)}>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs font-semibold opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-lg font-bold">Answer review</h2>
        <div className="mt-4 space-y-4">
          {questions.map((question, i) => {
            const chosen = answers[question.id];
            const isCorrect = chosen !== undefined && chosen === question.answer;
            return (
              <div
                key={question.id}
                className={cn(
                  "rounded-2xl border p-5",
                  chosen === undefined
                    ? "border-violet-400/30 bg-violet-500/[0.04]"
                    : isCorrect
                      ? "border-emerald-400/50 bg-emerald-500/[0.07]"
                      : "border-pink-400/50 bg-pink-500/[0.07]",
                )}
              >
                <p className="text-sm font-medium">
                  {i + 1}. {question.text}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your answer: {chosen === undefined ? "Not attempted" : question.options[chosen]}
                </p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  Correct answer:{" "}
                  {question.answer === undefined
                    ? "Unavailable"
                    : question.options[question.answer]}
                </p>
                {question.explanation && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Explanation: {question.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            asChild
            className="rounded-full border-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-500 font-bold text-slate-950"
          >
            <Link to="/dashboard/tests">Go to results</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-cyan-400/50">
            <Link to="/test-series">More tests</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b border-cyan-400/30 bg-background/95 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <p className="truncate bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-sm font-black text-transparent">
            {test.title}
          </p>
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 via-emerald-500/15 to-violet-500/20 px-3.5 py-1.5 text-sm font-bold text-cyan-600 shadow-[0_0_16px_rgba(34,211,238,0.28)] tabular-nums dark:text-cyan-300">
            <Timer className="h-4 w-4 text-cyan-400" /> {clock}
          </span>
        </div>
        <Progress
          value={((index + 1) / questions.length) * 100}
          className="h-1.5 rounded-none bg-violet-500/20 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:via-fuchsia-500 [&>div]:to-emerald-400"
        />
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <main className="min-w-0">
          <p
            data-testid="attempt-context"
            className="mb-4 inline-flex flex-wrap items-center gap-1.5 rounded-full border border-violet-400/40 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-cyan-500/15 px-3.5 py-1 text-xs font-semibold text-violet-700 shadow-[0_0_14px_rgba(167,139,250,0.16)] dark:text-violet-200"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            {attempt.exam} · {attempt.subject} · {attempt.chapter}
          </p>
          {saveError && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-amber-400/50 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-200"
            >
              Answers not yet saved: {saveError}. Submit Test will retry saving your current
              answers.
            </p>
          )}
          {submit.isError && (
            <p role="alert" className="mb-4 rounded-xl border p-3 text-sm text-destructive">
              {submit.error.message}
              <Button variant="outline" className="ml-2" onClick={() => submit.mutate()}>
                Retry Submit Test
              </Button>
            </p>
          )}
          {submit.isPending && (
            <p role="status" className="mb-3 flex items-center gap-2 text-cyan-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Saving result…
            </p>
          )}

          <div className="rounded-2xl border border-cyan-400/35 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.06] to-fuchsia-500/[0.05] p-5 shadow-[0_0_28px_rgba(34,211,238,0.12)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-400/50 bg-cyan-500/20 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-200">
                Question {index + 1} of {questions.length}
              </span>
              <span className="rounded-full border border-fuchsia-400/50 bg-fuchsia-500/20 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-fuchsia-700 dark:text-fuchsia-200">
                {q.subject}
              </span>
            </div>
            <h1
              data-testid="test-question"
              className="mt-3.5 whitespace-pre-line break-words text-lg font-bold leading-relaxed sm:text-xl"
            >
              {q.text}
            </h1>
          </div>

          <div className="mt-6 space-y-3.5">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === i;
              const palette = NEON_OPTION_STYLES[i % NEON_OPTION_STYLES.length]!;
              return (
                <button
                  key={opt}
                  type="button"
                  data-testid="answer-option"
                  aria-pressed={selected}
                  disabled={questionLocked || submit.isPending || (!isUnlimited && seconds <= 0)}
                  onClick={() => setAnswers((current) => ({ ...current, [q.id]: i }))}
                  className={cn(
                    "flex w-full min-w-0 items-center gap-3.5 break-words rounded-2xl border p-4 text-left text-sm font-medium transition-all duration-200",
                    selected ? palette.active : palette.idle,
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-black transition-all",
                      selected ? palette.badgeActive : palette.badgeIdle,
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="min-w-0 flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-full border-violet-400/60 bg-violet-500/15 font-bold text-violet-700 shadow-[0_0_14px_rgba(167,139,250,0.2)] hover:bg-violet-500/25 dark:text-violet-200"
              disabled={index === 0 || timerMode === "question"}
              onClick={() => setIndex((i) => i - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              className={cn(
                "rounded-full font-bold transition-all",
                flagged.includes(q.id)
                  ? "border-amber-300 bg-amber-400 text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.55)]"
                  : "border-amber-400/60 bg-amber-500/15 text-amber-700 shadow-[0_0_14px_rgba(245,158,11,0.2)] hover:bg-amber-500/25 dark:text-amber-200",
              )}
              onClick={() =>
                setFlagged((f) => (f.includes(q.id) ? f.filter((x) => x !== q.id) : [...f, q.id]))
              }
            >
              <Flag className="mr-1 h-4 w-4" />
              {flagged.includes(q.id) ? "Unflag" : "Flag"}
            </Button>
            {index < questions.length - 1 ? (
              <Button
                className="rounded-full border-0 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 px-6 font-black text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.45)] hover:brightness-110"
                onClick={() => setIndex((i) => i + 1)}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="rounded-full border-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-fuchsia-400 px-6 font-black text-slate-950 shadow-[0_0_22px_rgba(52,211,153,0.5)] hover:brightness-110"
                disabled={submit.isPending}
                onClick={() => submit.mutate()}
              >
                {submit.isPending ? "Saving result…" : "Submit Test"}
              </Button>
            )}
          </div>
        </main>

        <aside className="h-fit rounded-2xl border border-violet-400/35 bg-gradient-to-b from-violet-500/[0.08] via-cyan-500/[0.05] to-fuchsia-500/[0.08] p-5 shadow-[0_0_28px_rgba(167,139,250,0.16)] lg:sticky lg:top-24">
          <p className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-sm font-black text-transparent">
            Question palette
          </p>
          <div className="mt-4 grid grid-cols-6 gap-2 lg:grid-cols-5">
            {questions.map((question, i) => {
              const answered = answers[question.id] !== undefined;
              const isCurrent = i === index;
              const isFlagged = flagged.includes(question.id);
              return (
                <button
                  key={question.id}
                  aria-label={`Question ${i + 1}${answers[question.id] !== undefined ? ", answered" : ""}`}
                  aria-current={isCurrent ? "step" : undefined}
                  disabled={timerMode === "question" && i !== index}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl border text-xs font-black transition-all duration-150",
                    isCurrent &&
                      "border-cyan-200 bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 ring-2 ring-cyan-300 ring-offset-2 ring-offset-background shadow-[0_0_16px_rgba(34,211,238,0.65)]",
                    !isCurrent &&
                      isFlagged &&
                      "border-amber-400 bg-gradient-to-br from-amber-500/35 to-orange-500/30 text-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.35)] dark:text-amber-200",
                    !isCurrent &&
                      !isFlagged &&
                      answered &&
                      "border-emerald-400 bg-gradient-to-br from-emerald-500/35 to-teal-500/30 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.35)] dark:text-emerald-200",
                    !isCurrent &&
                      !isFlagged &&
                      !answered &&
                      "border-violet-400/35 bg-violet-500/10 text-violet-700 hover:border-cyan-400/60 hover:bg-cyan-500/20 dark:text-violet-200",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <dl className="mt-5 space-y-2 rounded-xl border border-violet-400/25 bg-background/60 p-3 text-xs font-semibold">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-300">
              <dt className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Attempted
              </dt>
              <dd className="font-black">{attempted}</dd>
            </div>
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-300">
              <dt className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                Flagged
              </dt>
              <dd className="font-black">{flagged.length}</dd>
            </div>
          </dl>
          <Button
            className="mt-5 w-full rounded-full border-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-fuchsia-400 font-black text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:brightness-110"
            disabled={submit.isPending}
            onClick={() => submit.mutate()}
          >
            {submit.isPending ? "Saving result…" : "Submit Test"}
          </Button>
        </aside>
      </div>
    </div>
  );
}
