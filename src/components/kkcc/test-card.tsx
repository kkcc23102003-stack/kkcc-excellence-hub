import { Link } from "@tanstack/react-router";
import { ClipboardList, Timer, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TestRow } from "@/integrations/supabase/db";

/** Existing KKCC surface/card styling shared by Home, series and dashboard. */
export function TestCard({
  test,
  enrolled = false,
  allowed = !test.is_paid,
}: {
  test: TestRow;
  enrolled?: boolean;
  allowed?: boolean;
}) {
  return (
    <article
      data-testid={`test-card-${test.id}`}
      className="surface-panel flex h-full flex-col p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <ClipboardList className="h-5 w-5 text-primary" />
        <Badge variant={enrolled ? "default" : "secondary"}>
          {enrolled ? "Enrolled" : test.is_paid ? "Paid" : "Free"}
        </Badge>
      </div>
      <h3 className="mt-3 font-semibold">{test.title}</h3>
      <p className="mt-1 text-xs text-primary">
        {test.exam_track || test.generation_exam} · {test.subject}
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Timer className="h-4 w-4" />
        {test.duration_minutes > 0 ? `${test.duration_minutes} minutes` : "No timer"} ·{" "}
        {test.questions_count} questions · {test.total_marks} marks
      </p>
      <div className="mt-auto pt-4">
        {allowed ? (
          <Button asChild className="w-full rounded-full">
            <Link to="/tests/learn/$testId" params={{ testId: test.id }}>
              Start Learning
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link to="/support">
              <Lock className="h-4 w-4" />
              Request access
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
