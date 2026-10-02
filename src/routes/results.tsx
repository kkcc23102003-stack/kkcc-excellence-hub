import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BarChart3, ClipboardCheck, Trophy } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { useWebsiteContent } from "@/components/kkcc/website-content-provider";
import { CustomPageSections } from "@/components/kkcc/custom-page-sections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — KKCC" },
      {
        name: "description",
        content: "Verified KKCC results and achievement updates published by the KKCC team.",
      },
      { property: "og:title", content: "Results — KKCC" },
      {
        property: "og:description",
        content: "Verified achievements and real result updates from KKCC.",
      },
    ],
  }),
  component: ResultsPage,
});

const RESULT_PROMISES = [
  {
    icon: ClipboardCheck,
    title: "Verified only",
    text: "This page displays only verified KKCC achievements and officially published result records.",
  },
  {
    icon: BarChart3,
    title: "Practice-based growth",
    text: "Students can build real performance history by attempting published tests and reviewing their result screens.",
  },
  {
    icon: Trophy,
    title: "Achievement ready",
    text: "When KKCC publishes authentic achievements, this page is ready to highlight them cleanly.",
  },
] as const;

function ResultsPage() {
  const content = useWebsiteContent();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={content.page_headers.results.eyebrow}
        title={content.page_headers.results.title}
        description={content.page_headers.results.description}
      />

      <CustomPageSections page="results" position="top" />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <section className="overflow-hidden rounded-3xl border bg-ink p-8 text-ink-foreground shadow-lift sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/20 text-primary">
                <Award className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-2xl font-black tracking-tight sm:text-4xl">
                Real progress deserves real proof.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-foreground/70">
                {content.results.quote}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {content.results.quote_by}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full">
                  <Link to="/test-series">Attempt tests</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-ink-foreground/25 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
                >
                  <Link to="/dashboard/tests">My test results</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {RESULT_PROMISES.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-foreground/65">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-dashed bg-card p-8 text-center shadow-lift sm:p-10">
          <Trophy className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-bold">No public result board has been published yet</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            This board stays empty until verified results or achievement sections are released.
            Students can still view their own test attempts inside the dashboard.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-full">
              <Link to="/dashboard/tests">Open my results</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/support">Contact KKCC</Link>
            </Button>
          </div>
        </section>
      </main>

      <CustomPageSections page="results" position="bottom" />
    </SiteLayout>
  );
}
