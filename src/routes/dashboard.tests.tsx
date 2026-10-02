import { useQuery } from "@tanstack/react-query";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useLearningAccess } from "@/hooks/use-learning-access";
import { prioritizeEnrolled } from "@/lib/learning-access";
import { listMyLearningResults } from "@/lib/test-attempts.functions";
import { TestCard } from "@/components/kkcc/test-card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, FileQuestion, Target, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listPublicTests } from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/dashboard/tests")({
  head: () => ({
    meta: [
      { title: "Tests & Results — KKCC Dashboard" },
      {
        name: "description",
        content: "Attempt KKCC chapter tests and mock exams, and review your results.",
      },
      { property: "og:title", content: "Tests & Results — KKCC" },
      { property: "og:description", content: "Practice tests with instant scoring and analysis." },
    ],
  }),
  loader: () => safeServerCall(() => listPublicTests(), []),
  component: TestsPage,
});

function TestsPage() {
  const { user } = useAuthUser();
  const access = useLearningAccess();
  const tests = prioritizeEnrolled(
    Route.useLoaderData(),
    new Set(access.data?.tests.map((test) => test.id) ?? []),
  );
  const results = useQuery({
    queryKey: ["student", user?.id, "results"],
    enabled: Boolean(user),
    queryFn: () => listMyLearningResults(),
    staleTime: 0,
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Tests &amp; results</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Published KKCC tests appear here. Start a test to get instant scoring and analysis.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/test-series">Open Test Series</Link>
        </Button>
      </header>

      <section>
        <h2 className="text-lg font-bold">Available tests</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              enrolled={Boolean(access.data?.tests.some((item) => item.id === test.id))}
              allowed={!test.is_paid || Boolean(access.data?.allowed_test_ids.includes(test.id))}
            />
          ))}
        </div>
        {!tests.length && (
          <div className="surface-panel mt-5 p-8 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">No published tests yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              New tests will appear here when the KKCC team publishes them.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link to="/test-series">Check Test Series</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="surface-panel p-6">
        <h2 className="text-lg font-bold">Result history</h2>
        {results.isPending && (
          <p role="status" className="mt-3">
            Loading your results…
          </p>
        )}
        {results.isError && (
          <p role="alert" className="mt-3">
            {results.error.message}
            <Button onClick={() => void results.refetch()}>Retry</Button>
          </p>
        )}
        {!results.isPending && !results.isError && !results.data?.length && (
          <p className="mt-3 text-sm text-muted-foreground">
            Your completed tests will appear here after submission.
          </p>
        )}
        <div className="mt-4 space-y-3">
          {(results.data ?? []).map((result) => (
            <article key={result.id} className="rounded-xl border p-4">
              <p className="font-semibold">
                {result.exam} · {result.subject} — {result.chapter}
              </p>
              <p className="mt-2 text-sm">
                Score: {result.score}/{result.total_marks} · Correct: {result.correct_count}/
                {result.question_count} · Attempted: {result.attempted_count}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {result.submitted_at ? new Date(result.submitted_at).toLocaleString("en-IN") : ""}
              </p>
              <Button asChild variant="outline" className="mt-3 rounded-full">
                <Link
                  to="/test/$id"
                  params={{ id: result.test_id || "series" }}
                  search={{ attempt: result.id }}
                >
                  View Result
                </Link>
              </Button>
            </article>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-5 rounded-full">
          <Link to="/test-series">Attempt a published test</Link>
        </Button>
      </section>
    </div>
  );
}
