import { useLearningAccess } from "@/hooks/use-learning-access";
import { TestCard } from "@/components/kkcc/test-card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  PlayCircle,
  FileCheck2,
  NotebookPen,
  LineChart,
  Sigma,
  Atom,
  BookOpen,
  Search,
  GraduationCap,
  Sparkles,
  BrainCircuit,
  Flame,
  Target,
  Trophy,
  LogIn,
  UserPlus,
  Gamepad2,
  Dice5,
} from "lucide-react";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { CourseCard } from "@/components/kkcc/course-card";
import { useBranding } from "@/components/kkcc/branding-provider";
import { useWebsiteContent } from "@/components/kkcc/website-content-provider";
import { CustomPageSections } from "@/components/kkcc/custom-page-sections";
import { useAuthUser } from "@/hooks/use-auth-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/cms";
import { buildFacultyProfiles } from "@/lib/faculty";
import {
  EMPTY_PUBLIC_PLATFORM_STATS,
  getPublicPlatformStats,
  listPublishedCourses,
  type PublicPlatformStats,
} from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KKCC — Kusum Kartik Coaching Centre | Study That Makes You Return" },
      {
        name: "description",
        content:
          "KKCC is a high-energy learning hub with focused lectures, smart notes, tests, progress cues and quick wins that help students return with confidence.",
      },
      { property: "og:title", content: "KKCC — Kusum Kartik Coaching Centre" },
      {
        property: "og:description",
        content:
          "Focused courses, quick wins, smart practice and visible progress — all in one KKCC learning hub.",
      },
    ],
  }),
  loader: async () => {
    const [courses, stats] = await Promise.all([
      safeServerCall(() => listPublishedCourses(), []),
      safeServerCall(() => getPublicPlatformStats(), EMPTY_PUBLIC_PLATFORM_STATS),
    ]);
    return { courses, stats };
  },
  component: Home,
});

const PILLAR_ICONS = [PlayCircle, FileCheck2, NotebookPen, LineChart] as const;

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

function HeroVisual({ stats }: { stats: PublicPlatformStats }) {
  const cards = [
    { label: "Students joined", value: stats.studentsJoined, icon: GraduationCap },
    { label: "Published courses", value: stats.publishedCourses, icon: BookOpen },
    { label: "Lectures online", value: stats.publishedLectures, icon: PlayCircle },
    { label: "Study resources", value: stats.publishedMaterials, icon: FileCheck2 },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div
        className="absolute inset-6 rounded-[2.5rem] border bg-card shadow-lift"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 20% 0%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 60%)",
        }}
      />
      <div className="absolute inset-6 overflow-hidden rounded-[2.5rem]">
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.07]"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <defs>
            <pattern id="hero-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10 0H0V10" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="reveal absolute left-2 top-10 w-[62%] rounded-2xl border bg-card p-4 shadow-lift">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Atom className="h-4 w-4" /> Daily Study Spark
        </div>
        <p className="mt-2 text-sm font-semibold leading-snug">Open. Learn. Win. Repeat.</p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Clear next steps, quick wins, and progress cues keep learning exciting.
        </p>
      </div>

      <div className="float-slow absolute right-1 top-32 w-[52%] rounded-2xl border bg-card p-4 shadow-lift">
        <div className="flex items-center gap-2 text-xs font-semibold text-accent-foreground">
          <Sigma className="h-4 w-4" /> Students joined
        </div>
        <p className="mt-2 font-display text-3xl font-bold">{formatCount(stats.studentsJoined)}</p>
        <p className="text-[11px] text-muted-foreground">Students joined</p>
      </div>

      <div className="absolute bottom-14 left-6 grid w-[68%] grid-cols-2 gap-2">
        {cards.slice(1).map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border bg-card p-3 shadow-lift">
            <Icon className="h-4 w-4 text-primary" />
            <p className="mt-1 font-display text-xl font-bold">{formatCount(value)}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="float-slow absolute bottom-5 right-4 rounded-2xl border bg-card px-4 py-3 shadow-lift">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <BookOpen className="h-4 w-4 text-primary" /> {formatCount(stats.publishedTests)} tests
          live
        </div>
      </div>
    </div>
  );
}

const COMEBACK_LOOP = [
  {
    icon: Target,
    title: "Tiny start",
    sub: "One clear next step",
    description:
      "Students do not open a confusing pile of work — they see the next focused action and start fast.",
  },
  {
    icon: BrainCircuit,
    title: "Brain-active practice",
    sub: "Recall beats rereading",
    description:
      "Lectures, notes, MCQs, and tests work together so study turns into memory, confidence, and speed.",
  },
  {
    icon: Trophy,
    title: "Visible wins",
    sub: "Progress feels real",
    description:
      "Results, course progress, and unlocked access make every improvement visible instead of hidden.",
  },
  {
    icon: Flame,
    title: "Return energy",
    sub: "A reason to come back",
    description:
      "Fresh lessons, alerts, and practice targets give students a healthy reason to return for the next win.",
  },
] as const;

function StudentLoginSection() {
  return (
    <section className="content-auto mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border bg-ink p-8 text-ink-foreground shadow-lift sm:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <LogIn className="h-3.5 w-3.5" /> Student login
            </p>
            <h2 className="mt-5 max-w-2xl text-2xl font-black tracking-tight sm:text-4xl">
              Access your lectures, notes, tests and progress from one secure place.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-foreground/70">
              Existing students can sign in directly. New students can create an account first and
              contact KKCC support for paid or offline-access assistance when needed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login now
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-ink-foreground/25 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <Link to="/signup">
                  <UserPlus className="mr-2 h-4 w-4" /> Create account
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative rounded-3xl border border-ink-foreground/15 bg-ink-foreground/5 p-5">
            <div className="grid gap-3">
              {[
                ["One login", "Use one KKCC account for courses, tests, notes and support."],
                ["Quick access", "After login, the home page opens and dashboard links are ready."],
                ["Install friendly", "Install from Chrome and open KKCC like a regular app."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-ink-foreground/10 p-4">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-foreground/65">
                    {description}
                  </p>
                </div>
              ))}
            </div>
            <Button asChild variant="ghost" className="mt-4 rounded-full text-ink-foreground">
              <Link to="/dashboard">
                Open dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeAccessSwitch({ children }: { children: ReactNode }) {
  const branding = useBranding();
  const { configured, user, loading } = useAuthUser();

  if (!configured || user) return <>{children}</>;

  return (
    <>
      <section className="relative flex min-h-[calc(100dvh-4.5rem)] items-center overflow-hidden border-b px-4 py-14 sm:px-6">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[840px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="reveal">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Student entry
            </p>
            <h1 className="neon-text mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Welcome to {branding.short_name || "KKCC"}
              <span className="block text-gradient-brand">
                Sign in to start your learning journey.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Open your secure student account to access lectures, notes, tests, batches and your
              progress. New students can create an account first.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/signup">
                  <UserPlus className="mr-2 h-4 w-4" /> Create account
                </Link>
              </Button>
            </div>
            {loading && (
              <p className="mt-4 text-xs text-muted-foreground">Checking your saved session…</p>
            )}
          </div>

          <div className="surface-panel p-6 shadow-lift sm:p-8">
            <div className="grid gap-4">
              {[
                ["Secure access", "Dashboard, admin and learning routes stay protected."],
                ["Fast restart", "After login, continue from your welcome/home page."],
                ["Install ready", "Add KKCC from Chrome for an app-like experience."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border bg-background/60 p-4">
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              If you already installed the app, remove the old shortcut after redeploy and install
              again from Chrome to refresh the new crisp KKCC icon.
            </p>
          </div>
        </div>
      </section>
      <StudentLoginSection />
    </>
  );
}

function ComebackLoopSection() {
  return (
    <section className="content-auto relative overflow-hidden border-b bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_34%),radial-gradient(circle_at_80%_20%,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-18">
        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Built for daily comebacks
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl">
              Make study feel like the next win waiting to happen.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            KKCC uses bright visuals, clean choices, quick achievement cues, and progress feedback
            to help students start faster, focus deeper, and return with confidence — with clear,
            honest learning steps.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {COMEBACK_LOOP.map(({ icon: Icon, title, sub, description }) => (
            <div
              key={title}
              className="hover-lift group relative overflow-hidden rounded-3xl border bg-card p-5 shadow-lift"
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_22%,transparent)]">
                <Icon className="h-6 w-6" />
              </span>
              <p className="relative mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {sub}
              </p>
              <h3 className="relative mt-2 text-lg font-bold">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border bg-background/70 p-5 text-center shadow-lift backdrop-blur sm:p-6">
          <p className="text-sm font-semibold text-muted-foreground">The KKCC comeback loop</p>
          <p className="mt-2 text-xl font-black tracking-tight sm:text-2xl">
            Open → Learn → Practice → See progress → Return stronger
          </p>
        </div>
      </div>
    </section>
  );
}

function HomeGameZoneSection() {
  return (
    <section className="content-auto mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-ink p-6 text-ink-foreground shadow-lift sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#1bdfff,#63e675,#b5fcf8,#a977ff,#ffd071)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-[#9cff6e]/15 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary shadow-[0_0_22px_color-mix(in_oklab,var(--primary)_18%,transparent)]">
              <Gamepad2 className="h-3.5 w-3.5" /> Colourful Quiz Zone
            </p>
            <h2 className="mt-5 text-2xl font-black tracking-tight sm:text-4xl">
              Play NEET, JEE, CBSE, ICSE, CA, UPSC, Banking, Railways and state exam quiz practice
              with weekly Kit 2 Coins.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-foreground/70">
              Students get daily local Kit 2 Coins, choose NEET, JEE, CBSE, ICSE, CA, UPSC, SSC,
              Banking, Railways, Punjab ETT, PSTET, PPSC or other state exams, answer 60-second quiz
              questions, read explanations, then create a weekly 23KAAT redeem voucher at 1000 Kit 2
              Coins. No cash-out, no betting and no cloud quiz storage.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[linear-gradient(135deg,#18c7e6,#69e569_48%,#f3c74f)] font-black text-[#05232b] shadow-[0_12px_34px_rgba(105,229,105,0.22)] hover:opacity-95"
              >
                <Link to="/games">
                  Play Quiz Now <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-ink-foreground/25 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <Link to="/coins">Open 23KAAT wallet</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: Gamepad2,
                title: "NEET",
                description: "Biology, physics and chemistry exam-pattern practice.",
                tone: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
              },
              {
                icon: Dice5,
                title: "JEE Main / Advanced",
                description: "Maths, physics and chemistry exam-level drills.",
                tone: "border-violet-300/25 bg-violet-400/10 text-violet-100",
              },
              {
                icon: Trophy,
                title: "Punjab & State Exams",
                description: "CBSE, ICSE, UPSC, SSC, Banking, Railways, ETT and PPSC presets.",
                tone: "border-lime-300/25 bg-lime-400/10 text-lime-100",
              },
              {
                icon: Sparkles,
                title: "1000:1",
                description: "1000 local Kit 2 Coins create 1 23KAAT redeem voucher.",
                tone: "border-amber-300/25 bg-amber-400/10 text-amber-100",
              },
            ].map(({ icon: Icon, title, description, tone }) => (
              <div
                key={title}
                className={`hover-lift rounded-2xl border border-ink-foreground/15 bg-ink-foreground/5 p-4`}
              >
                <span className={`grid h-10 w-10 place-items-center rounded-xl border ${tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-bold">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-foreground/65">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const branding = useBranding();
  const content = useWebsiteContent();
  const { courses, stats } = Route.useLoaderData();
  const access = useLearningAccess();
  const enrolledCourseIds = useMemo(
    () => new Set(access.data?.course_ids ?? []),
    [access.data?.course_ids],
  );
  const facultyProfiles = useMemo(() => buildFacultyProfiles(courses), [courses]);
  const [tab, setTab] = useState<string>("School");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(
      (c) =>
        !enrolledCourseIds.has(c.id) &&
        c.category === tab &&
        (!q || c.title.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q)),
    );
  }, [courses, tab, query, enrolledCourseIds]);

  return (
    <SiteLayout>
      <HomeAccessSwitch>
        {access.user && (
          <section
            data-testid="home-enrolled"
            aria-label="My enrolled learning"
            className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6"
          >
            <h2 className="text-2xl font-black">My enrolled learning</h2>
            {access.isPending && (
              <p role="status" className="mt-3">
                Loading your enrolled courses and tests…
              </p>
            )}
            {access.isError && (
              <div role="alert" className="mt-3 surface-panel p-4">
                Enrollment could not be checked: {access.error.message}
                <Button className="ml-3" onClick={() => void access.refetch()}>
                  Retry
                </Button>
              </div>
            )}
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(access.data?.courses ?? []).map((course) => (
                <CourseCard key={course.id} course={course} enrolled />
              ))}
              {(access.data?.tests ?? []).map((test) => (
                <TestCard key={test.id} test={test} enrolled allowed />
              ))}
            </div>
            {access.data && !access.data.courses.length && !access.data.tests.length && (
              <p className="mt-3 text-sm text-muted-foreground">
                No active course or individual-test enrollment yet. Enrolled series are available
                first on Test Series.
              </p>
            )}
          </section>
        )}
        {/* HERO */}
        <section className="relative overflow-hidden border-b">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
            <div className="reveal">
              {branding.hero_eyebrow && (
                <Badge
                  variant="secondary"
                  className="rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary shadow-[0_0_22px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> {branding.hero_eyebrow}
                </Badge>
              )}
              <h1 className="neon-text mt-5 text-[2.1rem] font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                {branding.hero_title || "KKCC Excellence Hub — Study That Makes You Return."}
                {branding.hero_highlight && (
                  <span className="block whitespace-pre-wrap text-gradient-brand neon-text">
                    {branding.hero_highlight}
                  </span>
                )}
              </h1>
              {branding.hero_description && (
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  {branding.hero_description}
                </p>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/courses">
                    {branding.cta_primary_label || "Find My Next Win"}{" "}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/dashboard">{branding.cta_secondary_label || "Continue Learning"}</Link>
                </Button>
              </div>
              <Link
                to="/games"
                aria-label="Play the Kit 2 Coins Quiz now"
                className="hover-lift group mt-5 inline-flex max-w-sm items-center gap-3 overflow-hidden rounded-3xl border border-primary/25 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_16%,transparent),color-mix(in_oklab,var(--accent)_12%,transparent))] p-2 pr-4 shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_14%,transparent)] transition-all hover:border-primary/55"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <Gamepad2 className="h-5 w-5 transition-transform group-hover:rotate-6 group-hover:scale-110" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-gradient-brand">
                    Play Quiz Now
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    60-second MCQs, fresh practice and weekly Kit 2 Coins
                  </span>
                </span>
                <span className="ml-auto rounded-full bg-primary/15 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-primary">
                  New
                </span>
              </Link>
            </div>
            <HeroVisual stats={stats} />
          </div>
        </section>

        <CustomPageSections page="home" position="top" />

        {/* FEATURE STRIP */}
        <section className="content-auto border-b bg-surface">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:gap-5">
            {content.home.pillars.map(({ label, sub }, index) => {
              const Icon = PILLAR_ICONS[index] ?? LineChart;
              return (
                <Link
                  key={label}
                  to="/courses"
                  aria-label={`${label} courses`}
                  className="hover-lift group flex items-center gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/45 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{sub}</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </section>

        <HomeGameZoneSection />

        <ComebackLoopSection />

        {/* COURSE DISCOVERY */}
        <section className="content-auto mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {content.home.course_eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{content.home.course_title}</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                {content.home.course_description}
              </p>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={content.home.course_search_placeholder}
                aria-label={content.home.course_search_placeholder}
                className="h-11 rounded-full pl-10"
              />
            </div>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="mt-8">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted/70 p-1.5">
              {CATEGORIES.map((c) => (
                <TabsTrigger key={c} value={c} className="rounded-xl px-4 py-2 text-xs sm:text-sm">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed p-12 text-center">
              <p className="font-semibold">{content.home.course_empty_title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {content.home.course_empty_description}
              </p>
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/courses">
                {content.home.view_all_courses_label} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* TEACHING TEAM */}
        <section className="content-auto border-y bg-surface">
          <div className="content-auto mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {content.home.faculty_eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  {content.home.faculty_title}
                </h2>
              </div>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/faculty">
                  {content.home.all_faculty_label} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {facultyProfiles.slice(0, 4).map((f) => (
                <Link
                  key={f.id}
                  to="/faculty/$slug"
                  params={{ slug: f.slug }}
                  className="hover-lift rounded-2xl border bg-card p-5"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-sm font-semibold">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.subjectLabel}</p>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    {f.courseCount} course{f.courseCount === 1 ? "" : "s"} · {f.lectureCount}{" "}
                    lectures
                  </p>
                </Link>
              ))}
              {!facultyProfiles.length && (
                <div className="rounded-2xl border border-dashed bg-card p-5 text-sm text-muted-foreground sm:col-span-2 lg:col-span-4">
                  Faculty profiles will appear here automatically when published courses have a
                  faculty name in the admin panel.
                </div>
              )}
            </div>
          </div>
        </section>

        <CustomPageSections page="home" position="bottom" />

        {/* STUDENT LOGIN */}
        <StudentLoginSection />
      </HomeAccessSwitch>
    </SiteLayout>
  );
}
