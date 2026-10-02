import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  GraduationCap,
  ShieldCheck,
  TimerReset,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getMyStudentSection } from "@/lib/enrollments.functions";
import { listMySeriesAccess } from "@/lib/test-access.functions";
import { PAID_TEST_SERIES } from "@/lib/test-series-catalog";
import { formatINR } from "@/lib/cms";
import { useUiText } from "@/components/kkcc/ui-text-provider";

export const Route = createFileRoute("/dashboard/student")({
  head: () => ({
    meta: [
      { title: "Student Section — KKCC Dashboard" },
      {
        name: "description",
        content: "View your KKCC student profile, enrolled batches and remaining validity.",
      },
      { property: "og:title", content: "Student Section — KKCC" },
      {
        property: "og:description",
        content: "Profile, batch enrollment and validity information in one place.",
      },
    ],
  }),
  loader: async () => {
    const [student, seriesAccess] = await Promise.all([
      getMyStudentSection(),
      listMySeriesAccess(),
    ]);
    return { student, seriesAccess };
  },
  component: StudentSection,
});

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusTone(state: string) {
  if (state === "lifetime") return "default" as const;
  if (state === "active") return "default" as const;
  if (state === "expiring") return "destructive" as const;
  return "secondary" as const;
}

function validityHelp(item: {
  validity_state: string;
  expires_at: string | null;
  days_left: number | null;
}) {
  if (item.validity_state === "lifetime") return "Lifetime access is active.";
  if (item.validity_state === "revoked") return "This access is currently inactive.";
  if (item.validity_state === "expired") return `Expired on ${formatDate(item.expires_at)}.`;
  if (item.days_left === 0) return "Expires today. Contact KKCC support for renewal options.";
  return `Valid till ${formatDate(item.expires_at)}.`;
}

function StudentSection() {
  const { dashboard } = useUiText();
  const loaded = Route.useLoaderData();
  const data = loaded.student;
  const seriesAccess = loaded.seriesAccess;
  const profile = data.profile;
  const activeEnrollments = data.enrollments.filter((item) => item.is_current);
  const historyEnrollments = data.enrollments.filter((item) => !item.is_current);
  const profileFields = [
    { label: "Full name", value: profile?.full_name || "Not added" },
    { label: "Email", value: profile?.email || "Not added" },
    { label: "Mobile", value: profile?.mobile || "Not added" },
    { label: "Class / stream", value: profile?.class_level || "Not added" },
    { label: "Target exam", value: profile?.target_exam || "Not added" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">{dashboard.student_section_label}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{dashboard.student_profile_title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {dashboard.student_profile_description}
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/dashboard/profile">
            <Edit3 className="mr-1.5 h-4 w-4" /> Edit profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={BookOpenCheck}
          label="Active batches"
          value={String(data.summary.active)}
          helper={`${data.summary.total} total enrollment${data.summary.total === 1 ? "" : "s"}`}
        />
        <SummaryCard
          icon={TimerReset}
          label="Expiring soon"
          value={String(data.summary.expiring_soon)}
          helper="Expires within 7 days"
        />
        <SummaryCard
          icon={ShieldCheck}
          label="Lifetime access"
          value={String(data.summary.lifetime)}
          helper="No expiry batches"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Expired / inactive"
          value={String(
            data.summary.expired +
              historyEnrollments.filter((item) => item.validity_state === "revoked").length,
          )}
          helper="Renewal options available"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="surface-panel h-fit p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">My profile</h2>
              <p className="text-sm text-muted-foreground">Student profile details</p>
            </div>
          </div>

          <dl className="mt-6 space-y-4">
            {profileFields.map((field) => (
              <div key={field.label} className="rounded-2xl border bg-background/70 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {field.label}
                </dt>
                <dd className="mt-1 break-words text-sm font-semibold">{field.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 rounded-2xl bg-primary/5 p-4 text-sm text-muted-foreground">
            Complete your profile to avoid batch access issues. Update your details from the Profile
            page.
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">My enrolled batches</h2>
              <p className="text-sm text-muted-foreground">
                The continue button stays enabled for active batches.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link to="/courses">Browse more</Link>
            </Button>
          </div>

          {activeEnrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}

          {!activeEnrollments.length && (
            <div className="surface-panel p-8 text-center">
              <GraduationCap className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-3 text-lg font-semibold">{dashboard.no_active_batch_title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {dashboard.no_active_batch_description}
              </p>
              <Button asChild className="mt-5 rounded-full">
                <Link to="/courses">{dashboard.browse_courses_label}</Link>
              </Button>
            </div>
          )}
        </section>
      </div>

      <section className="surface-panel p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">My Test Series</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Active series, validity and direct Start Learning access.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/test-series">Test Series</Link>
          </Button>
        </div>
        {seriesAccess.length ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {seriesAccess.map((access) => {
              const series = PAID_TEST_SERIES.find(
                (item) =>
                  item.id === access.series_id ||
                  item.name.trim().toLowerCase() === access.series_id.trim().toLowerCase(),
              );
              const expiry = access.expires_at ? formatDate(access.expires_at) : "Lifetime";
              const days = access.expires_at
                ? Math.ceil((new Date(access.expires_at).getTime() - Date.now()) / 86_400_000)
                : null;
              return (
                <div
                  key={`${access.series_id}-${access.expires_at ?? "lifetime"}`}
                  className="rounded-2xl border bg-background/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold">{series?.name ?? access.series_id}</p>
                      <p className="mt-1 text-xs text-primary">Status: Active</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border p-3">
                      <span className="text-muted-foreground">Expiry</span>
                      <strong className="mt-1 block">{expiry}</strong>
                    </div>
                    <div className="rounded-xl border p-3">
                      <span className="text-muted-foreground">Days left</span>
                      <strong className="mt-1 block">
                        {days === null ? "∞" : Math.max(0, days)}
                      </strong>
                    </div>
                  </div>
                  {series && (
                    <Button asChild className="mt-3 w-full rounded-full">
                      <Link to="/test-series/learn/$seriesId" params={{ seriesId: series.id }}>
                        Start Learning
                      </Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
            No active test-series enrolment yet.
          </p>
        )}
      </section>

      {historyEnrollments.length > 0 && (
        <section className="surface-panel p-6">
          <h2 className="text-lg font-bold">Access history</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Expired/revoked batches will remain visible here for records.
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {historyEnrollments.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof BookOpenCheck;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="surface-panel p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{helper}</p>
    </div>
  );
}

function EnrollmentCard({
  enrollment,
  compact = false,
}: {
  enrollment: Awaited<ReturnType<typeof getMyStudentSection>>["enrollments"][number];
  compact?: boolean;
}) {
  const course = enrollment.course;
  const current = enrollment.is_current;
  const canContinue = current && course?.slug;

  return (
    <article className="surface-panel p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={statusTone(enrollment.validity_state)}
              className="rounded-full capitalize"
            >
              {enrollment.validity_label}
            </Badge>
            <Badge variant="outline" className="rounded-full capitalize">
              {enrollment.source}
            </Badge>
            <Badge variant="secondary" className="rounded-full capitalize">
              {enrollment.status}
            </Badge>
          </div>
          <h3 className="mt-3 line-clamp-2 text-lg font-semibold">
            {course?.title ?? "Batch/course not found"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {[course?.class_level, course?.subject, course?.faculty].filter(Boolean).join(" · ") ||
              enrollment.course_id}
          </p>
        </div>

        {!compact && (
          <Button
            asChild={!!canContinue}
            size="sm"
            className="shrink-0 rounded-full"
            disabled={!canContinue}
          >
            {canContinue ? (
              <Link to="/learn" search={{ course: course.slug }}>
                Continue
              </Link>
            ) : (
              <span>Inactive</span>
            )}
          </Button>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <InfoPill
          icon={CalendarClock}
          label="Enrolled on"
          value={formatDate(enrollment.created_at)}
        />
        <InfoPill icon={Clock3} label="Valid till" value={formatDate(enrollment.expires_at)} />
        <InfoPill
          icon={ShieldCheck}
          label="Payment/access"
          value={`${enrollment.payment_method || enrollment.source} · ${formatINR(enrollment.amount_paid)}`}
        />
      </div>

      <div className="mt-5 rounded-2xl border bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">Validity remaining</span>
          <span className="text-muted-foreground">{enrollment.validity_label}</span>
        </div>
        <Progress value={enrollment.validity_percent} className="mt-3 h-2" />
        <p className="mt-2 text-xs text-muted-foreground">{validityHelp(enrollment)}</p>
      </div>

      {enrollment.admin_note && (
        <p className="mt-4 rounded-2xl bg-background/80 px-4 py-3 text-xs text-muted-foreground">
          Access note: {enrollment.admin_note}
        </p>
      )}
    </article>
  );
}

function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-background/70 p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
