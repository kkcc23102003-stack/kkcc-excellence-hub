import { rememberTemporaryTest } from "@/lib/temporary-test-memory";
import { useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpenCheck, ChevronLeft, ClipboardList, Loader2, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { useAuthUser } from "@/hooks/use-auth-user";
import { getLearningPlan } from "@/lib/test-access.functions";
import { startLearningAttempt } from "@/lib/test-attempts.functions";

type Selection = { test_id?: string; series_id?: string };
export function LearningFlow({
  selection,
  subject,
  chapter,
  select,
}: {
  selection: Selection;
  subject: string | undefined;
  chapter: string | undefined;
  select: (subject?: string, chapter?: string) => void;
}) {
  const startRequests = useRef(new Map<string, string>());
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const fetchPlan = useServerFn(getLearningPlan);
  const startAttempt = useServerFn(startLearningAttempt);
  const planQuery = useQuery({
    queryKey: ["student", user?.id, "learning-plan", selection.test_id, selection.series_id],
    enabled: Boolean(user),
    queryFn: () => fetchPlan({ data: selection }),
    retry: false,
    refetchInterval: 15_000,
  });
  const start = useMutation({
    mutationFn: () => {
      if (!subject || !chapter) throw new Error("Select Subject and Select Chapter first.");
      const key = JSON.stringify({ ...selection, subject, chapter });
      let request = startRequests.current.get(key);
      if (!request) {
        request = crypto.randomUUID();
        startRequests.current.set(key, request);
      }
      return startAttempt({ data: { request_id: request, ...selection, subject, chapter } });
    },
    onSuccess: (result) => {
      if (result.temporary) rememberTemporaryTest(result);
      return navigate({
        to: "/test/$id",
        params: { id: selection.test_id || "series" },
        search: { attempt: result.attempt.id, ...(result.temporary ? { temporary: true } : {}) },
      });
    },
    onError: (error) => toast.error(error.message),
  });
  const learning = planQuery.data;
  const selected = learning?.plan.find((item) => item.subject === subject);
  const validSubject = !subject || Boolean(selected);
  const validChapter = !chapter || Boolean(selected?.chapters.includes(chapter));
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Start Learning"
        title={learning?.title || "Your learning area"}
        description={learning?.exam || ""}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Button asChild variant="outline" className="mb-6 rounded-full">
          <Link to="/test-series">Back to Test Series</Link>
        </Button>
        {(planQuery.isPending || !user) && !planQuery.isError && (
          <p role="status" className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Checking your access and question mapping…
          </p>
        )}
        {planQuery.isError && (
          <section role="alert" className="surface-panel p-6">
            <h1 className="text-xl font-bold">Learning area could not open</h1>
            <p className="mt-2 text-sm">{planQuery.error.message}</p>
            <Button className="mt-4" onClick={() => void planQuery.refetch()}>
              Retry
            </Button>
          </section>
        )}
        {learning && (!validSubject || !validChapter) && (
          <section role="alert">
            <h1 className="text-xl font-bold">Invalid subject or chapter selection</h1>
            <Button className="mt-4" onClick={() => select()}>
              Select Subject
            </Button>
          </section>
        )}
        {learning && validSubject && validChapter && (
          <>
            <nav aria-label="Learning steps" className="mb-6 flex flex-wrap gap-2 text-sm">
              <Badge variant={!subject ? "default" : "outline"}>1 · Select Subject</Badge>
              <Badge variant={subject && !chapter ? "default" : "outline"}>
                2 · Select Chapter
              </Badge>
              <Badge variant={chapter ? "default" : "outline"}>3 · Start Test</Badge>
            </nav>
            {!subject && (
              <section>
                <h1 className="text-2xl font-black">Select Subject</h1>
                {!learning.plan.length && (
                  <p role="status" className="mt-4">
                    No mapped questions are available for this test. Contact KKCC; no unrelated exam
                    questions will be substituted.
                  </p>
                )}
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {learning.plan.map((item) => (
                    <button
                      key={item.subject}
                      type="button"
                      data-testid="learning-subject"
                      onClick={() => select(item.subject)}
                      className="surface-panel p-5 text-left transition hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <BookOpenCheck className="h-5 w-5 text-primary" />
                      <p className="mt-3 font-bold">{item.subject}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.chapters.length} mapped chapters
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {subject && !chapter && selected && (
              <section>
                <Button variant="ghost" onClick={() => select()}>
                  <ChevronLeft className="h-4 w-4" /> Subjects
                </Button>
                <h1 className="mt-3 text-2xl font-black">Select Chapter</h1>
                <p className="mt-2 text-primary">{subject}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {selected.chapters.map((item) => (
                    <button
                      key={item}
                      type="button"
                      data-testid="learning-chapter"
                      onClick={() => select(subject, item)}
                      className="surface-panel p-5 text-left transition hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <p className="font-bold">{item}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Practice from the existing project question bank
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {subject && chapter && (
              <section>
                <Button variant="ghost" onClick={() => select(subject)}>
                  <ChevronLeft className="h-4 w-4" /> Chapters
                </Button>
                <h1 className="mt-3 text-2xl font-black">Start Test</h1>
                {!learning.save_results && (
                  <p role="status" className="mt-4 rounded-xl border border-primary/30 p-4 text-sm">
                    Temporary test — your answers, score and attempt history will not be saved to
                    the database. Result appears only on this page. Refresh/close loses progress and
                    result; no resume or saved analytics.
                  </p>
                )}

                <article className="surface-panel mt-5 max-w-2xl p-6">
                  <ClipboardList className="h-6 w-6 text-primary" />
                  <h2 className="mt-3 text-lg font-bold">
                    {subject} — {chapter}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your selected test, exam, subject and chapter are verified on the server.
                    Questions come from the existing project data, with the actual available count
                    shown in the test.
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Timer className="h-4 w-4" /> Timer starts when you click Start Test. Your
                    answers and result belong to your account.
                  </p>
                  <Button
                    className="mt-5 w-full rounded-full"
                    data-testid="start-test"
                    disabled={start.isPending}
                    onClick={() => start.mutate()}
                  >
                    {start.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Start Test
                  </Button>
                  {start.isError && (
                    <p role="alert" className="mt-3 text-sm text-destructive">
                      {start.error.message}
                    </p>
                  )}
                </article>
              </section>
            )}
          </>
        )}
      </div>
    </SiteLayout>
  );
}
