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
  const tests = Route.useLoaderData();

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
            <div key={test.id} className="surface-panel p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <Badge variant="secondary" className="rounded-full text-[11px]">
                  {test.subject}
                </Badge>
              </div>
              <p className="mt-3 font-semibold">{test.title}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5" /> {test.duration_minutes} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileQuestion className="h-3.5 w-3.5" /> {test.questions_count} questions
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" /> {test.total_marks} marks
                </span>
              </p>
              <Button asChild size="sm" className="mt-4 rounded-full">
                <Link to="/test/$id" params={{ id: test.id }}>
                  Start test
                </Link>
              </Button>
            </div>
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
        <p className="mt-2 text-sm text-muted-foreground">
          Result history will populate after students attempt published tests. Use each test's
          result screen immediately after submission for detailed scoring.
        </p>
        <Button asChild variant="outline" className="mt-5 rounded-full">
          <Link to="/test-series">Attempt a published test</Link>
        </Button>
      </section>
    </div>
  );
}
