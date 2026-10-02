import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  ClipboardList,
  Clock3,
  Coins,
  Gamepad2,
  FileText,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getMyStudentSection } from "@/lib/enrollments.functions";
import { listMySeriesAccess } from "@/lib/test-access.functions";
import { PAID_TEST_SERIES } from "@/lib/test-series-catalog";
import { getMy23KaatWallet } from "@/lib/coins.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { useUiText } from "@/components/kkcc/ui-text-provider";
import { KaatCoin, KaatCoinStack } from "@/components/kkcc/kaat-coin";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — KKCC" },
      {
        name: "description",
        content: "Track your KKCC lectures, tests, streaks and study progress.",
      },
      { property: "og:title", content: "Student Dashboard — KKCC" },
      { property: "og:description", content: "Your learning progress at a glance." },
    ],
  }),
  loader: async () => {
    const [student, wallet, seriesAccess] = await Promise.all([
      safeServerCall(() => getMyStudentSection(), {
        user_id: "",
        profile: null,
        enrollments: [],
        summary: { total: 0, active: 0, expired: 0, expiring_soon: 0, lifetime: 0 },
      }),
      safeServerCall(() => getMy23KaatWallet(), { balance: 0, transactions: [], packages: [] }),
      safeServerCall(() => listMySeriesAccess(), []),
    ]);
    return { ...student, wallet, seriesAccess };
  },
  component: DashboardHome,
});

type DashboardEnrollment = {
  id: string;
  course_id: string;
  is_current: boolean;
  days_left: number | null;
  validity_label: string;
  validity_percent: number;
  validity_state: "lifetime" | "active" | "expiring" | "expired" | "revoked";
  expires_at: string | null;
  status: string;
  course: {
    category: string;
    title: string;
    faculty: string;
    lectures_count: number;
  } | null;
};

type DashboardProfile = {
  full_name: string;
  email: string;
  mobile: string;
  class_level: string;
  target_exam: string;
} | null;

/** Expiry shown to the student as a plain date, never a raw timestamp. */
function formatExpiry(value: string | null) {
  if (!value) return "No expiry";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** The single word a student cares about: is this access usable right now? */
function accessState(item: DashboardEnrollment) {
  if (item.validity_state === "revoked")
    return { label: "Not activated", tone: "secondary" as const };
  if (item.validity_state === "expired") return { label: "Expired", tone: "destructive" as const };
  if (item.validity_state === "expiring")
    return { label: "Activated", tone: "destructive" as const };
  return { label: "Activated", tone: "default" as const };
}

function daysLeftText(item: DashboardEnrollment) {
  if (item.validity_state === "lifetime") return "Lifetime access";
  if (item.validity_state === "revoked") return "Awaiting activation";
  if (item.days_left === null) return "No expiry set";
  if (item.days_left <= 0) return "0 days left";
  return `${item.days_left} day${item.days_left === 1 ? "" : "s"} left`;
}

function minimumDaysLeft(enrollments: DashboardEnrollment[]) {
  const days = enrollments
    .filter((item) => item.is_current && item.days_left !== null)
    .map((item) => item.days_left ?? 0);
  return days.length ? Math.min(...days) : null;
}

function profileCompletion(profile: DashboardProfile) {
  if (!profile) return 0;
  const fields = [
    profile.full_name,
    profile.email,
    profile.mobile,
    profile.class_level,
    profile.target_exam,
  ];
  return Math.round((fields.filter((field) => field?.trim()).length / fields.length) * 100);
}

function DashboardHome() {
  const { dashboard } = useUiText();
  const data = Route.useLoaderData();
  const enrollments = data.enrollments as DashboardEnrollment[];
  const activeEnrollments = enrollments.filter((item) => item.is_current).slice(0, 3);
  const nextExpiry = minimumDaysLeft(enrollments);
  const completion = profileCompletion(data.profile as DashboardProfile);

  const stats = [
    { label: "Active batches", value: String(data.summary.active), icon: BookOpenCheck },
    {
      label: "Next validity",
      value: nextExpiry === null ? "Lifetime" : `${nextExpiry}d`,
      icon: Clock3,
    },
    { label: "Profile complete", value: `${completion}%`, icon: UserRound },
    { label: "23KAAT coins", value: String(data.wallet.balance), icon: Coins },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">{dashboard.welcome_eyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{dashboard.welcome_title}</h1>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/dashboard/student">
            {dashboard.student_section_label} <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="surface-panel p-5">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="surface-panel relative overflow-hidden border-primary/25 p-6 shadow-[0_0_38px_color-mix(in_oklab,var(--primary)_12%,transparent)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#1bdfff,#63e675,#ffd071,#a977ff)]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-[#9cff6e]/12 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_18%,transparent),color-mix(in_oklab,var(--accent)_12%,transparent))] text-primary shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_24%,transparent)]">
              <Gamepad2 className="h-7 w-7" />
            </span>
            <div>
              <p className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-primary">
                Kit 2 Coins Quiz Zone
              </p>
              <h2 className="mt-1 text-xl font-black">
                Refresh your mind with NEET, JEE, CBSE, ICSE, CA, UPSC, Banking and state quiz
                practice
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Claim daily local Kit 2 Coins, choose NEET, JEE, CBSE, ICSE, CA, UPSC, SSC, Banking,
                Railways, Punjab ETT, PSTET, PPSC or other state exams, answer 60-second quiz
                questions, read explanations, then create a weekly 23KAAT redeem voucher at 1000 Kit
                2 Coins.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="shrink-0 rounded-full bg-[linear-gradient(135deg,#18c7e6,#69e569_48%,#f3c74f)] font-black text-[#05232b] hover:opacity-95"
          >
            <Link to="/games">Play Quiz Now</Link>
          </Button>
        </div>
      </section>

      {data.seriesAccess.length > 0 && (
        <section className="surface-panel border-primary/25 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-primary">
                Active Test Series
              </p>
              <h2 className="mt-1 text-xl font-black">Your enrolled series</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your active enrolments stay at the top so you can continue directly.
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {data.seriesAccess.length} active
            </Badge>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {data.seriesAccess.map((access) => {
              const series = PAID_TEST_SERIES.find(
                (item) =>
                  item.id.trim().toLowerCase() === access.series_id.trim().toLowerCase() ||
                  item.name.trim().toLowerCase() === access.series_id.trim().toLowerCase(),
              );
              const expiry = access.expires_at ? formatExpiry(access.expires_at) : "Lifetime";
              const days = access.expires_at
                ? Math.max(
                    0,
                    Math.ceil((new Date(access.expires_at).getTime() - Date.now()) / 86_400_000),
                  )
                : null;
              return (
                <div
                  key={`${access.series_id}-${access.expires_at ?? "lifetime"}`}
                  className="rounded-2xl border bg-background/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{series?.name ?? access.series_id}</p>
                      <p className="mt-1 text-xs text-primary">Status: Active</p>
                    </div>
                    <Badge className="rounded-full">Active</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border p-3">
                      <span className="text-muted-foreground">Expiry</span>
                      <strong className="mt-1 block">{expiry}</strong>
                    </div>
                    <div className="rounded-xl border p-3">
                      <span className="text-muted-foreground">Days left</span>
                      <strong className="mt-1 block">{days === null ? "∞" : days}</strong>
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
        </section>
      )}

      <section className="surface-panel overflow-hidden p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <KaatCoinStack className="hidden sm:inline-block" />
            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                <KaatCoin size="sm" className="sm:hidden" /> 23KAAT Wallet
              </p>
              <h2 className="mt-1 text-2xl font-black">{data.wallet.balance} coins</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use 23KAAT coins for paid courses and paid notes. Confirmed offline payments are
                credited to your coin wallet.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/courses">Spend on courses</Link>
          </Button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.slice(0, 3).map((item) => {
            const state = accessState(item);
            return (
              <div key={item.id} className="rounded-2xl border bg-background/70 p-4 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 truncate font-semibold">
                    {item.course?.title ?? "Your course"}
                  </p>
                  <Badge variant={state.tone} className="shrink-0 rounded-full text-[11px]">
                    {state.label}
                  </Badge>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-primary">
                  <Clock3 className="h-4 w-4" /> {daysLeftText(item)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Expires on {formatExpiry(item.expires_at)}
                </p>
              </div>
            );
          })}
          {!enrollments.length && (
            <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
              You are not enrolled in a course yet. Once you join, the days left, expiry date and
              activation status will appear here.
            </div>
          )}
        </div>

        {data.wallet.transactions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.wallet.transactions.slice(0, 3).map((tx) => (
              <Badge
                key={tx.id}
                variant={tx.amount > 0 ? "default" : "secondary"}
                className="gap-1.5 rounded-full font-normal"
              >
                <KaatCoin size="xs" />
                {tx.amount > 0 ? "+" : ""}
                {tx.amount}
                <span className="text-[11px] opacity-80">{tx.reason || tx.source}</span>
              </Badge>
            ))}
          </div>
        )}
        {data.wallet.packages.length > 0 && (
          <div className="mt-5 border-t pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold">Buy 23KAAT coin packs</h3>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link to="/coins">Buy coins</Link>
              </Button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {data.wallet.packages.slice(0, 3).map((pack) => (
                <div key={pack.id} className="rounded-2xl border bg-background/70 p-4 text-sm">
                  <p className="font-semibold">{pack.title}</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-black text-primary">
                    <KaatCoin size="sm" /> {pack.coins + pack.bonus_coins} coins
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₹{pack.price}
                    {pack.bonus_coins ? ` · ${pack.bonus_coins} bonus` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="surface-panel p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              {dashboard.student_section_label} & validity
            </p>
            <h2 className="mt-1 text-lg font-bold">
              {data.summary.active
                ? `${data.summary.active} active batch${data.summary.active === 1 ? "" : "es"}`
                : "No active batch yet"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Open the Student Section to view your profile, enrolled batches, and remaining
              validity in one place.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 rounded-full">
            <Link to="/dashboard/student">View details</Link>
          </Button>
        </div>
        <Progress value={completion} className="mt-5 h-2" />
        <p className="mt-2 text-xs text-muted-foreground">Profile completion: {completion}%</p>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{dashboard.active_batches_title}</h2>
          <Link to="/dashboard/student" className="text-sm text-primary hover:underline">
            View validity
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {activeEnrollments.map((item) => (
            <div key={item.id} className="surface-panel p-5">
              <Badge variant="secondary" className="rounded-full text-[11px]">
                {item.course?.category ?? "Batch"} · {item.validity_label}
              </Badge>
              <p className="mt-3 line-clamp-2 font-semibold">
                {item.course?.title ?? item.course_id}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.course?.faculty || "Faculty"} · {item.course?.lectures_count ?? 0} lectures
              </p>
              <Progress value={item.validity_percent} className="mt-4 h-1.5" />
              <p className="mt-2 text-xs text-muted-foreground">
                Validity remaining: {item.validity_label}
              </p>
            </div>
          ))}
          {!activeEnrollments.length && (
            <div className="surface-panel p-6 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
              {dashboard.no_active_batch_description}
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-panel p-6">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="mt-2 text-lg font-bold">Tests & results</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Published tests and instant result screens are available from the Tests section. Attempt
            a published test to generate your real result.
          </p>
          <Button asChild variant="outline" className="mt-5 rounded-full">
            <Link to="/dashboard/tests">Open tests</Link>
          </Button>
        </section>

        <section className="surface-panel p-6">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="mt-2 text-lg font-bold">Latest updates</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            KKCC announcements, batch alerts, doubt replies and new-content updates appear in your
            notifications inbox.
          </p>
          <Button asChild variant="outline" className="mt-5 rounded-full">
            <Link to="/dashboard/notifications">Open notifications</Link>
          </Button>
        </section>
      </div>

      <section className="surface-panel p-6">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="mt-2 text-lg font-bold">{dashboard.support_cta_title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{dashboard.support_cta_description}</p>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/support">{dashboard.support_cta_label}</Link>
        </Button>
      </section>
    </div>
  );
}
