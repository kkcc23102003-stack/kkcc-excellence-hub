import { Link } from "@tanstack/react-router";
import { ClipboardList, Lock, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TestRow } from "@/integrations/supabase/db";

const LEVELS = {
  Easy: "border-emerald-400/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Moderate: "border-amber-400/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Difficult: "border-rose-400/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Mixed: "border-primary/30 bg-primary/10 text-primary",
} as const;

export function TestCard({
  test,
  enrolled = false,
  allowed = !test.is_paid,
}: {
  test: TestRow;
  enrolled?: boolean;
  allowed?: boolean;
}) {
  const level = test.level in LEVELS ? test.level : "Mixed";
  return (
    <article
      data-testid={`test-card-${test.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/30" />
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Badge className={LEVELS[level as keyof typeof LEVELS]}>{level}</Badge>
          <Badge variant={enrolled ? "default" : "secondary"}>
            {enrolled ? "Enrolled" : test.is_paid ? "Paid" : "Free"}
          </Badge>
        </div>
      </div>
      <h3 className="mt-4 line-clamp-2 text-base font-bold tracking-tight">{test.title}</h3>
      {test.series_name && (
        <p
          className="mt-1 break-words text-xs text-muted-foreground"
          data-testid="test-series-name"
        >
          Series: {test.series_name}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
        {test.exam_track && <Badge variant="outline">{test.exam_track}</Badge>}
        {(test.syllabus_chapter || test.generation_topic) && (
          <Badge variant="outline">{test.syllabus_chapter || test.generation_topic}</Badge>
        )}
      </div>
      <p className="mt-3 text-xs font-medium text-primary">
        {test.syllabus_subject || test.subject || "General"}
        {test.syllabus_topic ? ` · ${test.syllabus_topic}` : ""}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
        <div className="rounded-2xl bg-muted/60 px-2 py-2">
          <Timer className="mx-auto mb-1 h-4 w-4" />
          {test.duration_minutes ? `${test.duration_minutes}m` : "—"}
        </div>
        <div className="rounded-2xl bg-muted/60 px-2 py-2">
          <b className="block text-foreground">{test.questions_count}</b>Questions
        </div>
        <div className="rounded-2xl bg-muted/60 px-2 py-2">
          <b className="block text-foreground">{test.total_marks}</b>Marks
        </div>
      </div>
      <div className="mt-auto pt-5">
        {allowed ? (
          <Button asChild className="w-full rounded-2xl">
            <Link to="/tests/learn/$testId" params={{ testId: test.id }}>
              Start Test
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full rounded-2xl">
            <Link to="/checkout" search={{ test: test.id }}>
              <Lock className="mr-1.5 h-4 w-4" />
              Buy / Contact Admin
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
