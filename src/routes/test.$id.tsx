import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Flag, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock } from "lucide-react";
import type { TestQuestionRow } from "@/integrations/supabase/db";
import { getPublicTest } from "@/lib/content.functions";
import {
  getSeriesChapterTest,
  getSeriesLearningTest,
  getTestForAttempt,
} from "@/lib/test-access.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/test/$id")({
  validateSearch: z.object({
    series: z.string().optional(),
    exam: z.string().optional(),
    subject: z.string().optional(),
    chapter: z.string().optional(),
    topic: z.string().optional(),
    kind: z.enum(["combined", "subject", "chapter", "topic"]).optional(),
    autoStart: z.boolean().optional(),
  }),
  loaderDeps: ({ search }) => ({
    series: search.series,
    exam: search.exam,
    subject: search.subject,
    chapter: search.chapter,
    topic: search.topic,
    kind: search.kind,
    autoStart: search.autoStart,
  }),
  loader: async ({ params, deps: search }) => {
    if (params.id === "series") {
      if (!search.series || !search.exam) throw notFound();
      if (search.kind) {
        let row: Awaited<ReturnType<typeof getSeriesLearningTest>> | null = null;
        let generationError: string | null = null;
        try {
          row = await getSeriesLearningTest({
            data: {
              series_id: search.series,
              exam: search.exam,
              kind: search.kind,
              subject: search.subject,
              chapter: search.chapter,
              topic: search.topic,
            },
          });
        } catch (error) {
          generationError = error instanceof Error ? error.message : String(error);
        }
        const title =
          search.kind === "combined"
            ? `${search.series} — Combined mock`
            : `${search.subject ?? "Subject"} — ${search.topic ?? search.chapter ?? search.kind}`;
        if (!row) {
          return {
            test: {
              id: "series-generation-error",
              title,
              instructions: "The requested series paper could not be generated.",
              subject: search.subject ?? "Combined",
              duration_minutes: 60,
              minutes: 60,
              question_timer_seconds: 0,
              timer_mode: "test" as const,
              questions_count: 0,
              total_marks: 0,
              exam_track: search.exam,
              level: "Mixed" as const,
              series_name: search.series,
              is_paid: true,
              price_inr: 0,
              price_coins: 0,
              question_source: "deterministic" as const,
              generation_exam: search.exam,
              generation_subject: search.subject ?? "Combined",
              generation_topic: search.topic ?? search.chapter ?? "Mixed",
              generation_difficulty: "Mixed" as const,
              generation_count: 0,
            },
            dbQuestions: [],
            locked: false,
            generatedSeries: true,
            generationError,
            autoStart: false,
          };
        }
        return {
          test: { ...row.test, minutes: row.test.duration_minutes },
          dbQuestions: row.questions,
          locked: false,
          generatedSeries: true,
          generationError: null,
          autoStart: search.autoStart ?? false,
        };
      }

      if (!search.subject || !search.chapter) throw notFound();
      let row: Awaited<ReturnType<typeof getSeriesChapterTest>> | null = null;
      let generationError: string | null = null;
      try {
        row = await getSeriesChapterTest({
          data: {
            series_id: search.series,
            exam: search.exam,
            subject: search.subject,
            chapter: search.chapter,
          },
        });
      } catch (error) {
        generationError = error instanceof Error ? error.message : String(error);
      }
      if (!row) {
        return {
          test: {
            id: "series-generation-error",
            title: `${search.subject} — ${search.chapter}`,
            instructions: "The chapter paper could not be generated.",
            subject: search.subject,
            duration_minutes: 60,
            minutes: 60,
            question_timer_seconds: 0,
            timer_mode: "test" as const,
            questions_count: 0,
            total_marks: 0,
            exam_track: search.exam,
            level: "Mixed" as const,
            series_name: search.series,
            is_paid: true,
            price_inr: 0,
            price_coins: 0,
            question_source: "deterministic" as const,
            generation_exam: search.exam,
            generation_subject: search.subject,
            generation_topic: search.chapter,
            generation_difficulty: "Mixed" as const,
            generation_count: 0,
          },
          dbQuestions: [],
          locked: false,
          generatedSeries: true,
          generationError,
          autoStart: false,
        };
      }
      return {
        test: { ...row.test, minutes: row.test.duration_minutes },
        dbQuestions: row.questions,
        locked: false,
        generatedSeries: true,
        generationError: null,
        autoStart: search.autoStart ?? false,
      };
    }

    const row = await safeServerCall(() => getPublicTest({ data: { id: params.id } }), null);
    if (!row) throw notFound();
    return {
      test: { ...row.test, minutes: row.test.duration_minutes },
      dbQuestions: row.questions,
      // A paid paper arrives with no questions. They are fetched separately,
      // and only for a student who is actually allowed to sit it.
      locked: row.locked,
      generatedSeries: false,
      generationError: row.generationError ?? null,
      autoStart: false,
    };
  },

  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Test unavailable — KKCC" }, { name: "robots", content: "noindex" }],
      };
    return {
      meta: [
        { title: `${loaderData.test.title} — KKCC Test` },
        {
          name: "description",
          content: `Attempt the ${loaderData.test.title} on the KKCC test platform.`,
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: TestRunner,
});

/**
 * A paid paper. We ask the server whether this student may sit it: either an
 * admin has flipped the test free, or an admin has recorded their offline
 * payment as a grant. Nothing here is decided in the browser.
 */
function LockedTestGate() {
  const { test } = Route.useLoaderData();
  const fetchPaper = useServerFn(getTestForAttempt);

  const { data, isPending } = useQuery({
    queryKey: ["test-attempt", test.id],
    queryFn: () => fetchPaper({ data: { test_id: test.id } }),
    retry: false,
  });

  if (isPending) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Checking your access…</p>
      </div>
    );
  }

  if (data?.reason === "insufficient-coverage") {
    return <TestGenerationError message={data.generationError} />;
  }

  if (!data?.allowed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-16">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </span>
        <h1 className="mt-5 text-2xl font-bold">{test.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This is a paid paper, so it is not open yet. Enrol from the test series page, or if you
          have already paid at the centre, tell us and we will unlock it on your account straight
          away.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/test-series">Go to test series</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/support">I have already paid</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <TestPaper questions={data.questions} />;
}

function TestGenerationError({ message }: { message: string }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold">Test could not start</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The required paper could not be generated with enough quality-approved questions. No attempt
        was started or scored. Please try again later, or contact support if the problem continues.
      </p>
      <p className="mt-3 rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground">
        {message}
      </p>
      <Button asChild className="mt-6 w-fit rounded-full">
        <Link to="/test-series">Back to Test Series</Link>
      </Button>
    </div>
  );
}

function TestRunner() {
  const { test, dbQuestions, locked, generationError, autoStart } = Route.useLoaderData();
  if (generationError) return <TestGenerationError message={generationError} />;
  if (locked) return <LockedTestGate />;
  return <TestPaper key={test.id} questions={dbQuestions} autoStart={autoStart} />;
}

type TestAttemptQuestion = Pick<
  TestQuestionRow,
  | "id"
  | "question_text"
  | "subject"
  | "options"
  | "correct_index"
  | "marks"
  | "negative_marks"
  | "explanation"
>;

function TestPaper({
  questions: dbQuestions,
  autoStart = false,
}: {
  questions: TestAttemptQuestion[];
  autoStart?: boolean;
}) {
  const { test } = Route.useLoaderData();
  const questions = dbQuestions.map((question) => ({
    id: question.id,
    text: question.question_text,
    subject: question.subject || test.subject,
    options: question.options,
    answer: question.correct_index,
    marks: question.marks,
    negativeMarks: question.negative_marks,
    explanation: question.explanation,
  }));

  const [started, setStarted] = useState(autoStart);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const timerMode = test.timer_mode ?? "test";
  const questionSeconds = Math.max(0, Number(test.question_timer_seconds ?? 0));
  const isUnlimited = timerMode === "unlimited" || (timerMode === "test" && test.minutes <= 0);
  const initialSeconds = timerMode === "question" ? questionSeconds : test.minutes * 60;
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!started || submitted || isUnlimited) return;
    if (timerMode === "question") setSeconds(questionSeconds);
  }, [index, isUnlimited, questionSeconds, started, submitted, timerMode]);

  useEffect(() => {
    if (!started || submitted || isUnlimited) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          if (timerMode === "question") {
            if (index < questions.length - 1) {
              setIndex((current) => Math.min(current + 1, questions.length - 1));
              return questionSeconds;
            }
            setSubmitted(true);
            return 0;
          }
          setSubmitted(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [index, isUnlimited, questionSeconds, questions.length, started, submitted, timerMode]);

  const score = useMemo(
    () =>
      questions.reduce((acc, q) => {
        const a = answers[q.id];
        if (a === undefined) return acc;
        return acc + (a === q.answer ? q.marks : -q.negativeMarks);
      }, 0),
    [answers, questions],
  );

  const correct = questions.filter((q) => answers[q.id] === q.answer).length;
  const attempted = Object.keys(answers).length;
  const clock = isUnlimited
    ? "No timer"
    : `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const timerDescription = isUnlimited
    ? "No timer: move when you click Next."
    : timerMode === "question"
      ? `${questionSeconds} seconds per question. Time over moves to the next question.`
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
      <div className="mx-auto max-w-2xl px-4 py-16">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Test submitted</h1>
        <p className="mt-2 text-sm text-muted-foreground">{test.title}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Score", value: `${score}` },
            { label: "Correct", value: `${correct}/${questions.length}` },
            { label: "Attempted", value: `${attempted}/${questions.length}` },
          ].map((s) => (
            <div key={s.label} className="surface-panel p-5">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-lg font-bold">Answer review</h2>
        <div className="mt-4 space-y-4">
          {questions.map((question, i) => {
            const chosen = answers[question.id];
            return (
              <div key={question.id} className="surface-panel p-5">
                <p className="text-sm font-medium">
                  {i + 1}. {question.text}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your answer: {chosen === undefined ? "Not attempted" : question.options[chosen]}
                </p>
                <p className="text-xs text-primary">
                  Correct answer: {question.options[question.answer]}
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
          <Button asChild className="rounded-full">
            <Link to="/dashboard/tests">Go to results</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/test-series">More tests</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <p className="truncate text-sm font-semibold">{test.title}</p>
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary tabular-nums">
            <Timer className="h-4 w-4" /> {clock}
          </span>
        </div>
        <Progress value={((index + 1) / questions.length) * 100} className="h-1 rounded-none" />
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <main className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Question {index + 1} of {questions.length} · {q.subject}
          </p>
          <h1 className="mt-3 text-lg font-semibold sm:text-xl">{q.text}</h1>

          <div className="mt-6 space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setAnswers({ ...answers, [q.id]: i })}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border bg-card p-4 text-left text-sm transition-colors",
                  answers[q.id] === i ? "border-primary bg-primary/[0.06]" : "hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                    answers[q.id] === i && "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-full"
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() =>
                setFlagged((f) => (f.includes(q.id) ? f.filter((x) => x !== q.id) : [...f, q.id]))
              }
            >
              <Flag className="mr-1 h-4 w-4" />
              {flagged.includes(q.id) ? "Unflag" : "Flag"}
            </Button>
            {index < questions.length - 1 ? (
              <Button className="rounded-full" onClick={() => setIndex((i) => i + 1)}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button className="rounded-full" onClick={() => setSubmitted(true)}>
                Submit test
              </Button>
            )}
          </div>
        </main>

        <aside className="surface-panel h-fit p-5 lg:sticky lg:top-24">
          <p className="text-sm font-semibold">Question palette</p>
          <div className="mt-4 grid grid-cols-6 gap-2 lg:grid-cols-5">
            {questions.map((question, i) => {
              const answered = answers[question.id] !== undefined;
              return (
                <button
                  key={question.id}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-lg border text-xs font-semibold transition-colors",
                    i === index && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                    flagged.includes(question.id)
                      ? "border-amber-500/60 bg-amber-500/15 text-amber-700"
                      : answered
                        ? "border-primary bg-primary/15 text-primary"
                        : "text-muted-foreground",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <dl className="mt-5 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <dt>Attempted</dt>
              <dd>{attempted}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Flagged</dt>
              <dd>{flagged.length}</dd>
            </div>
          </dl>
          <Button className="mt-5 w-full rounded-full" onClick={() => setSubmitted(true)}>
            Submit test
          </Button>
        </aside>
      </div>
    </div>
  );
}
