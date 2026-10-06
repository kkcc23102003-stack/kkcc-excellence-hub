import { readTemporaryTest, clearTemporaryTest } from "@/lib/temporary-test-memory";
import { updateTemporaryTest } from "@/lib/temporary-test.functions";
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

const OPTION_STYLE = {
  idle: "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
  active: "border-primary bg-primary/10 ring-1 ring-primary",
  badgeIdle: "border-border bg-muted text-muted-foreground",
  badgeActive: "border-primary bg-primary text-primary-foreground",
};

export const Route = createFileRoute("/test/$id")({
  ssr: false,
  validateSearch: z.object({
    attempt: z.string().uuid().optional(),
    temporary: z.boolean().optional(),
  }),
  staleTime: 0,
  gcTime: 0,
  beforeLoad: async ({ location }) => {
    if (!isSupabaseConfigured())
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
  },
  loaderDeps: ({ search }) => ({ attempt: search.attempt, temporary: search.temporary }),
  loader: async ({ params, deps }) => {
    if (!deps.attempt) {
      if (params.id === "series") throw redirect({ to: "/test-series" });
      throw redirect({ to: "/tests/learn/$testId", params: { testId: params.id } });
    }
    const paper = deps.temporary
      ? readTemporaryTest(deps.attempt)
      : await getLearningAttempt({ data: { attempt_id: deps.attempt } });
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
  const { test, attempt, server_now, temporary, token } = Route.useLoaderData();
  const temporaryFn = useServerFn(updateTemporaryTest);
  const temporaryToken = useRef(token);
  const temporaryQueue = useRef<Promise<unknown>>(Promise.resolve());
  useEffect(
    () => () => {
      if (temporary) {
        clearTemporaryTest();
        temporaryToken.current = null;
      }
    },
    [temporary],
  );

  const syncTemporary = useCallback(
    (values: Record<string, number>, finish: boolean) => {
      const task = temporaryQueue.current.then(async () => {
        if (!temporaryToken.current) throw new Error("Temporary session is missing. Start again.");
        const response = await temporaryFn({
          data: { token: temporaryToken.current, answers: values, submit: finish },
        });
        temporaryToken.current = response.token;
        return response;
      });
      temporaryQueue.current = task.then(
        () => undefined,
        () => undefined,
      );
      return task;
    },
    [temporaryFn],
  );
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
    mutationFn: async () => {
      if (!temporary) return submitFn({ data: { attempt_id: attempt.id, answers } });
      const response = await syncTemporary(answers, true);
      if (!response.attempt || !response.questions)
        throw new Error("Result could not be calculated. Retry.");
      return { attempt: response.attempt, questions: response.questions };
    },
    onSuccess: (data) => {
      setResult(data.attempt);
      setPaperQuestions(data.questions);
      setAnswers(data.attempt.answers as Record<string, number>);
      setSubmitted(true);
      if (temporary) clearTemporaryTest();
    },
    onError: (error) =>
      toast.error(
        `${temporary ? "Result could not be calculated" : "Result was not saved"}: ${error instanceof Error ? error.message : String(error)}. Please retry Submit Test.`,
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
        void (
          temporary
            ? syncTemporary(answers, false)
            : saveFn({ data: { attempt_id: attempt.id, answers, revision } })
        )
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
  }, [answers, attempt.id, saveFn, started, submitted, questionSeconds, temporary, syncTemporary]);
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
      ? `${questionSeconds} seconds per question; earlier questions lock. Remaining test time is shown. ${temporary ? "Reload loses this temporary session." : "Reload does not reset the server timer."}`
      : "The timer starts immediately and auto-submits at zero.";

  if (!questions.length) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-16">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Questions for this test have not been published yet. Please check again later or contact
          KKCC support.
        </p>
        <Button asChild variant="outline" className="mt-8 w-fit rounded-lg">
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
          <Button className="rounded-lg" onClick={() => setStarted(true)}>
            Start test
          </Button>
          <Button asChild variant="outline" className="rounded-lg">
            <Link to="/test-series">Back</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="test-paper min-h-screen bg-background">
        <div data-testid="test-result" className="mx-auto max-w-3xl px-4 py-12">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Result</h1>
          <p className="mt-2 text-sm font-semibold text-primary">
            {temporary
              ? "Temporary result · Not saved to your account · Refresh/close loses this result"
              : "Test submitted · Saved to your account"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{test.title}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Score",
                value: `${score}`,
                tone: "border-border bg-card text-foreground",
              },
              {
                label: "Correct",
                value: `${correct}/${questions.length}`,
                tone: "border-border bg-card text-foreground",
              },
              {
                label: "Attempted",
                value: `${attempted}/${questions.length}`,
                tone: "border-border bg-card text-foreground",
              },
            ].map((s) => (
              <div key={s.label} className={cn("rounded-2xl border p-5", s.tone)}>
                <p className="text-2xl font-semibold">{s.value}</p>
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
                <div key={question.id} className="rounded-xl border border-border bg-card p-5">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    {chosen === undefined ? "Not attempted" : isCorrect ? "Correct" : "Incorrect"}
                  </p>
                  <p className="text-sm font-medium">
                    {i + 1}. {question.text}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Your answer: {chosen === undefined ? "Not attempted" : question.options[chosen]}
                  </p>
                  <p className="text-xs font-semibold text-primary">
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
            <Button asChild className="rounded-lg bg-primary font-semibold text-primary-foreground">
              <Link to={temporary ? "/test-series" : "/dashboard/tests"}>
                {temporary ? "Back to Test Series" : "Go to results"}
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-lg border-border">
              <Link to="/test-series">More tests</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="test-paper min-h-screen bg-background" data-testid="test-paper">
      <header className="sticky top-0 z-20 border-b border-border bg-background">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <p className="truncate text-sm font-semibold">{test.title}</p>
          <span className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-3.5 py-1.5 text-sm font-bold text-primary tabular-nums">
            <Timer className="h-4 w-4 text-primary" /> {clock}
          </span>
        </div>
        <Progress
          value={((index + 1) / questions.length) * 100}
          className="h-1.5 rounded-none bg-primary/10"
        />
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <main className="min-w-0">
          {temporary && (
            <p
              role="status"
              data-testid="temporary-test-notice"
              className="mb-4 rounded-xl border border-primary/30 p-3 text-sm"
            >
              Temporary test · Answers, score and history are not saved to the database.
              Refresh/close loses this session. Session checks are kept only in browser memory.
            </p>
          )}

          <p
            data-testid="attempt-context"
            className="mb-4 inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-border px-3.5 py-1 text-xs font-semibold text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {attempt.exam} · {attempt.subject} · {attempt.chapter}
          </p>
          {saveError && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-border bg-primary/10 p-3 text-sm text-primary"
            >
              {temporary ? "Session checkpoint failed" : "Answers not yet saved"}: {saveError}.
              Submit Test will retry your current answers.
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
            <p role="status" className="mb-3 flex items-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />{" "}
              {temporary ? "Calculating result…" : "Saving result…"}
            </p>
          )}

          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-border bg-primary/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                Question {index + 1} of {questions.length}
              </span>
              <span className="rounded-lg border border-border bg-primary/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
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
              const palette = OPTION_STYLE;
              return (
                <button
                  key={opt}
                  type="button"
                  data-testid="answer-option"
                  aria-pressed={selected}
                  disabled={questionLocked || submit.isPending || (!isUnlimited && seconds <= 0)}
                  onClick={() => setAnswers((current) => ({ ...current, [q.id]: i }))}
                  className={cn(
                    "flex w-full min-w-0 items-center gap-3.5 break-words rounded-2xl border p-4 text-left text-sm font-medium transition-colors duration-200",
                    selected ? palette.active : palette.idle,
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-xs font-semibold transition-colors",
                      selected ? palette.badgeActive : palette.badgeIdle,
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="min-w-0 flex-1">{opt}</span>
                  {selected && (
                    <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-lg border-border bg-card font-medium text-foreground hover:bg-muted"
              disabled={index === 0 || timerMode === "question"}
              onClick={() => setIndex((i) => i - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              className={cn(
                "rounded-lg font-bold transition-colors",
                flagged.includes(q.id)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
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
                className="rounded-lg bg-primary px-6 font-semibold text-primary-foreground"
                onClick={() => setIndex((i) => i + 1)}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="rounded-lg bg-primary px-6 font-semibold text-primary-foreground"
                disabled={submit.isPending}
                onClick={() => submit.mutate()}
              >
                {submit.isPending
                  ? temporary
                    ? "Calculating result…"
                    : "Saving result…"
                  : "Submit Test"}
              </Button>
            )}
          </div>
        </main>

        <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <p className="text-sm font-semibold">Questions</p>
          <div className="mt-4 grid max-h-72 grid-cols-5 gap-2 overflow-y-auto p-1 sm:grid-cols-6 lg:grid-cols-5">
            {questions.map((question, i) => {
              const answered = answers[question.id] !== undefined;
              const isCurrent = i === index;
              const isFlagged = flagged.includes(question.id);
              return (
                <button
                  key={question.id}
                  aria-label={`Question ${i + 1}${answered ? ", answered" : ", not answered"}${isFlagged ? ", flagged" : ""}`}
                  aria-current={isCurrent ? "step" : undefined}
                  disabled={timerMode === "question" && i !== index}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative grid h-10 w-full place-items-center rounded-lg border text-xs font-semibold transition-colors duration-150",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background",
                    !isCurrent &&
                      isFlagged &&
                      "border-dashed border-foreground bg-muted text-foreground",
                    !isCurrent &&
                      !isFlagged &&
                      answered &&
                      "border-primary/40 bg-primary/10 text-primary",
                    !isCurrent &&
                      !isFlagged &&
                      !answered &&
                      "border-border bg-background text-muted-foreground hover:border-primary/50",
                  )}
                >
                  {i + 1}
                  {isFlagged ? (
                    <Flag aria-hidden="true" className="absolute right-0.5 top-0.5 h-2.5 w-2.5" />
                  ) : answered ? (
                    <CheckCircle2
                      aria-hidden="true"
                      className="absolute right-0.5 top-0.5 h-2.5 w-2.5"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          <dl className="mt-5 space-y-2 rounded-xl border border-border bg-background/60 p-3 text-xs font-semibold">
            <div className="flex items-center justify-between text-primary">
              <dt className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-lg bg-primary/10" />
                Attempted
              </dt>
              <dd className="font-semibold">{attempted}</dd>
            </div>
            <div className="flex items-center justify-between text-primary">
              <dt className="flex items-center gap-1.5">
                <Flag aria-hidden="true" className="h-3 w-3" />
                Flagged
              </dt>
              <dd className="font-semibold">{flagged.length}</dd>
            </div>
          </dl>
          <Button
            className="mt-5 w-full rounded-lg bg-primary font-semibold text-primary-foreground"
            disabled={submit.isPending}
            onClick={() => submit.mutate()}
          >
            {submit.isPending
              ? temporary
                ? "Calculating result…"
                : "Saving result…"
              : "Submit Test"}
          </Button>
        </aside>
      </div>
    </div>
  );
}
