import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Clock3, PlayCircle, ShoppingBag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getMyCourseAccess } from "@/lib/enrollments.functions";
import { coursePriceLabel, formatINR } from "@/lib/cms";
import { safeServerCall } from "@/lib/safe-server-call";
import { MyEnrolledSeriesPanel } from "@/components/kkcc/my-enrolled-series-panel";

export const Route = createFileRoute("/dashboard/courses")({
  head: () => ({
    meta: [
      { title: "My Courses — KKCC Dashboard" },
      {
        name: "description",
        content: "All KKCC courses you are enrolled in, with progress tracking.",
      },
      { property: "og:title", content: "My Courses — KKCC" },
      { property: "og:description", content: "Resume any enrolled KKCC course." },
    ],
  }),
  loader: () =>
    safeServerCall(() => getMyCourseAccess(), {
      user_id: "",
      course_ids: [],
      courses: [],
      enrollments: [],
    }),
  component: MyCourses,
});

function formatDate(value: string | null | undefined) {
  if (!value) return "No expiry";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function enrollmentStatus(
  enrollment: ReturnType<typeof Route.useLoaderData>["enrollments"][number] | undefined,
) {
  if (!enrollment) return { label: "Free open course", percent: 100, tone: "secondary" as const };
  if (enrollment.status === "revoked") {
    return { label: "Revoked", percent: 0, tone: "secondary" as const };
  }
  if (!enrollment.expires_at) {
    return { label: "Lifetime access", percent: 100, tone: "default" as const };
  }

  const now = Date.now();
  const created = new Date(enrollment.created_at).getTime();
  const expiry = new Date(enrollment.expires_at).getTime();
  const daysLeft = Math.ceil((expiry - now) / 86_400_000);
  const percent = Math.max(
    0,
    Math.min(100, Math.round(((expiry - now) / Math.max(1, expiry - created)) * 100)),
  );

  if (enrollment.status === "expired" || expiry <= now) {
    return { label: "Expired", percent: 0, tone: "secondary" as const };
  }
  return {
    label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
    percent,
    tone: daysLeft <= 7 ? ("destructive" as const) : ("default" as const),
  };
}

function MyCourses() {
  const access = Route.useLoaderData();
  const enrolled = access.courses;
  const enrollmentByCourse = new Map(access.enrollments.map((item) => [item.course_id, item]));

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My courses & batches</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Free courses open instantly. Paid courses appear here after secure online payment or
            confirmed offline enrolment. Validity details are shown for every enrolled batch.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/dashboard/student">Student Section</Link>
        </Button>
      </div>

      <div className="mt-6">
        <MyEnrolledSeriesPanel />
      </div>

      <div className="mt-8 space-y-4">
        {enrolled.map((c) => {
          const enrollment = enrollmentByCourse.get(c.id);
          const status = enrollmentStatus(enrollment);
          return (
            <div
              key={c.id}
              className="surface-panel grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 sm:flex sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full text-[11px]">
                    {c.category} · {coursePriceLabel(c)}
                  </Badge>
                  <Badge variant={status.tone} className="rounded-full text-[11px]">
                    {status.label}
                  </Badge>
                </div>
                <p className="mt-2 truncate font-semibold">{c.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.faculty} · {c.lectures_count} lectures · {c.class_level} · {c.subject}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Open this course in Learn and mark lectures complete to save your real local
                  learning progress.
                </p>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5 text-primary" /> Enrolled:{" "}
                    {enrollment ? formatDate(enrollment.created_at) : "Open"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5 text-primary" /> Valid till:{" "}
                    {formatDate(enrollment?.expires_at)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {enrollment
                      ? `${enrollment.payment_method || enrollment.source} · ${formatINR(enrollment.amount_paid)}`
                      : "Free access"}
                  </span>
                </div>
                {enrollment && (
                  <div className="mt-3 max-w-sm">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Validity remaining</span>
                      <span>{status.label}</span>
                    </div>
                    <Progress value={status.percent} className="h-1.5" />
                  </div>
                )}
              </div>
              <Button asChild size="sm" className="shrink-0 rounded-full">
                <Link to="/learn" search={{ course: c.slug }}>
                  <PlayCircle className="mr-1.5 h-4 w-4" /> Continue
                </Link>
              </Button>
            </div>
          );
        })}

        {!enrolled.length && (
          <div className="surface-panel p-8 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-3 text-lg font-semibold">No enrolled courses yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start a free course instantly or contact the KKCC support team after offline payment.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link to="/courses">Browse courses</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
