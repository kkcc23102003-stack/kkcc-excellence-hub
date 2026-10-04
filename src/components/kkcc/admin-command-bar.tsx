import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  BookOpen,
  BarChart3,
  Sparkles,
  ClipboardList,
  FileText,
  Database,
  BrainCircuit,
  Users,
  KeyRound,
  HelpCircle,
  MessageSquarePlus,
  Bell,
  CreditCard,
  TicketPercent,
  Gift,
  ShieldAlert,
  Palette,
  LayoutTemplate,
  Type,
  Code2,
  Share2,
  HardDrive,
  ShieldCheck,
  Search,
  Compass,
  Download,
  Copy,
  Trash2,
  Zap,
  SlidersHorizontal,
  Loader2,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  adminClearAllTestSeries,
  adminGetCustomSeriesCatalog,
  adminOptimizeAndCleanServer,
  adminToggleBuiltInSeries,
} from "@/lib/admin.functions";
import { getAdminAppControls, saveAdminAppControls } from "@/lib/app-controls.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { cn } from "@/lib/utils";

type AdminCategory =
  "All" | "Courses & Content" | "Students & Access" | "Payments & Rewards" | "Website & System";

type AdminToolItem = {
  to: string;
  label: string;
  hint: string;
  category: Exclude<AdminCategory, "All">;
  icon: typeof BookOpen;
  badge?: string;
};

export const ADMIN_TOOLS: AdminToolItem[] = [
  {
    to: "/admin/analytics",
    label: "Business Dashboard",
    hint: "Revenue, sales, students, coupons and the pending admin queue",
    category: "Payments & Rewards",
    icon: BarChart3,
    badge: "New",
  },
  {
    to: "/admin",
    label: "Course Manager",
    hint: "Create, edit & publish courses, lectures and chapters",
    category: "Courses & Content",
    icon: BookOpen,
  },
  {
    to: "/admin/syllabus",
    label: "Syllabus Auto Builder",
    hint: "Paste syllabus → Subject, Chapter & Topic tree + 1-click tests",
    category: "Courses & Content",
    icon: Sparkles,
    badge: "New",
  },
  {
    to: "/admin/tests",
    label: "Test Builder & Questions",
    hint: "Write MCQs, set timers, syllabus tags & chapterwise tests",
    category: "Courses & Content",
    icon: ClipboardList,
  },
  {
    to: "/admin/materials",
    label: "Study Material & Notes",
    hint: "Upload PDFs or link Google Drive notes, PYQs & formula sheets",
    category: "Courses & Content",
    icon: FileText,
  },
  {
    to: "/admin/exam-bank",
    label: "Question Bank & Test Series",
    hint: "All Template Questions + Add Your Questions + AI Generator + Set Question Count",
    category: "Courses & Content",
    icon: Database,
    badge: "Question Bank",
  },
  {
    to: "/admin/ai-question-engine",
    label: "AI Question Engine",
    hint: "Research & verify high-yield practice questions",
    category: "Courses & Content",
    icon: BrainCircuit,
  },
  {
    to: "/admin/students",
    label: "Student Access",
    hint: "Grant or revoke course, test & series access, or block accounts",
    category: "Students & Access",
    icon: Users,
  },
  {
    to: "/admin/offline-access",
    label: "Offline Access",
    hint: "Pre-activate access by student Gmail after UPI/cash payment",
    category: "Students & Access",
    icon: KeyRound,
  },
  {
    to: "/admin/doubts",
    label: "Doubts Inbox",
    hint: "Read student subject doubts and send direct answers",
    category: "Students & Access",
    icon: HelpCircle,
  },
  {
    to: "/admin/enquiries",
    label: "Admission Enquiries",
    hint: "Lead CRM for website enquiries, coin requests & follow-ups",
    category: "Students & Access",
    icon: MessageSquarePlus,
  },
  {
    to: "/admin/notifications",
    label: "Notifications",
    hint: "Broadcast announcements or send personal alerts to students",
    category: "Students & Access",
    icon: Bell,
  },
  {
    to: "/admin/payments",
    label: "Payments & Razorpay",
    hint: "Switch between offline UPI/Cash mode and live Razorpay checkout",
    category: "Payments & Rewards",
    icon: CreditCard,
  },
  {
    to: "/admin/coupons",
    label: "Coupons & Discounts",
    hint: "Create promo codes up to 100% off with usage & expiry limits",
    category: "Payments & Rewards",
    icon: TicketPercent,
  },
  {
    to: "/admin/vouchers",
    label: "Amazon / Flipkart Rewards",
    hint: "Manage monthly Kit 2 Coins reward vouchers & student claims",
    category: "Payments & Rewards",
    icon: Gift,
  },
  {
    to: "/admin/users",
    label: "Admin Team Users",
    hint: "Grant or remove admin privileges for trusted KKCC staff",
    category: "Payments & Rewards",
    icon: ShieldAlert,
  },
  {
    to: "/admin/branding",
    label: "Branding & Theme",
    hint: "Customize app name, logo, hero highlights & color palette",
    category: "Website & System",
    icon: Palette,
  },
  {
    to: "/admin/content",
    label: "Website Content",
    hint: "Edit navigation menus, page headers, contact info & custom blocks",
    category: "Website & System",
    icon: LayoutTemplate,
  },
  {
    to: "/admin/text-manager",
    label: "Hybrid Text Manager",
    hint: "Safely override student-facing labels and dashboard copy",
    category: "Website & System",
    icon: Type,
  },
  {
    to: "/admin/app-builder",
    label: "App Builder (HTML/CSS/JS)",
    hint: "Inject live custom HTML sections, CSS styles or JS scripts",
    category: "Website & System",
    icon: Code2,
  },
  {
    to: "/admin/settings",
    label: "Social & App Links",
    hint: "Manage YouTube, Telegram, WhatsApp, Instagram & footer links",
    category: "Website & System",
    icon: Share2,
  },
  {
    to: "/admin/storage",
    label: "Storage Provider",
    hint: "Configure Supabase Storage, Cloudflare R2, AWS S3 or Backblaze B2",
    category: "Website & System",
    icon: HardDrive,
  },
  {
    to: "/admin/security",
    label: "Security & App Controls",
    hint: "Content protection, feature switches, Kit 2 Coins caps & health",
    category: "Website & System",
    icon: ShieldCheck,
  },
  {
    to: "/downloads",
    label: "ZIP, SQL & Cleaner Hub",
    hint: "Download complete Project ZIP, Production SQL & SQL Cleaner",
    category: "Website & System",
    icon: Download,
    badge: "Files",
  },
];

const CATEGORIES: AdminCategory[] = [
  "All",
  "Courses & Content",
  "Students & Access",
  "Payments & Rewards",
  "Website & System",
];

export function AdminCommandBar({ compact = false }: { compact?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const qc = useQueryClient();
  const [category, setCategory] = useState<AdminCategory>("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(!compact);
  const [showMasterControls, setShowMasterControls] = useState(true);

  const getControlsFn = useServerFn(getAdminAppControls);
  const saveControlsFn = useServerFn(saveAdminAppControls);
  const optimizeServerFn = useServerFn(adminOptimizeAndCleanServer);
  const clearAllSeriesFn = useServerFn(adminClearAllTestSeries);
  const toggleBuiltInFn = useServerFn(adminToggleBuiltInSeries);
  const getCustomCatalogFn = useServerFn(adminGetCustomSeriesCatalog);

  const controlsQuery = useQuery({
    queryKey: ["admin", "app-controls"],
    queryFn: () => safeServerCall(() => getControlsFn(), null),
    staleTime: 60_000,
  });

  const customCatalogQuery = useQuery({
    queryKey: ["admin", "custom-series-catalog"],
    queryFn: () => safeServerCall(() => getCustomCatalogFn({} as never), {}),
    staleTime: 60_000,
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async (patch: Record<string, boolean>) => {
      const current = controlsQuery.data;
      if (!current) throw new Error("App controls not loaded yet");
      return saveControlsFn({
        data: {
          maintenanceMode: current.maintenanceMode,
          maintenanceMessage: current.maintenanceMessage,
          protectionEnabled: current.protectionEnabled,
          copyGuardEnabled: current.copyGuardEnabled,
          contextMenuGuardEnabled: current.contextMenuGuardEnabled,
          shortcutGuardEnabled: current.shortcutGuardEnabled,
          watermarkEnabled: current.watermarkEnabled,
          screenshotBlurEnabled: current.screenshotBlurEnabled,
          printGuardEnabled: current.printGuardEnabled,
          kittuQuizEnabled: current.kittuQuizEnabled,
          testSeriesEnabled: current.testSeriesEnabled,
          studyMaterialEnabled: current.studyMaterialEnabled,
          kittuDailyRewardCap: current.kittuRewards.dailyRewardCap,
          kittuDailyPracticeHours: current.kittuRewards.dailyPracticeHours,
          kittuDailyGift: current.kittuRewards.dailyGift,
          kittuPracticeBatches: current.kittuPracticeBatches,
          ...patch,
        },
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "app-controls"] });
      void qc.invalidateQueries({ queryKey: ["public", "app-controls"] });
      toast.success("Master App Control updated live!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const [serverRes] = await Promise.all([
        optimizeServerFn({} as never),
        fetch("/__fixture__/supabase/clean", {
          method: "POST",
          headers: { "content-type": "application/json" },
        }).catch(() => null),
      ]);
      if (typeof window !== "undefined") {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && (k.startsWith("kkcc:") || k.startsWith("kkcc_") || k.includes("cache"))) {
            keysToRemove.push(k);
          }
        }
        for (const k of keysToRemove) window.localStorage.removeItem(k);
      }
      return serverRes;
    },
    onSuccess: (res) => {
      void qc.invalidateQueries();
      toast.success(`Full-Stack Optimized & Cleaned in ${res.durationMs}ms!`, {
        description: `Flushed ${res.clearedSelectEntries} backend cache entries & ${res.cleanedAbandonedAttempts} stale attempts.`,
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const clearSeriesMutation = useMutation({
    mutationFn: () => clearAllSeriesFn({} as never),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "custom-series-catalog"] });
      void qc.invalidateQueries({ queryKey: ["public", "custom-series-catalog"] });
      void qc.invalidateQueries({ queryKey: ["admin", "tests"] });
      void qc.invalidateQueries({ queryKey: ["public", "tests"] });
      toast.success("All Test Series & Tests cleared! Ready for your custom setup.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleBuiltInMutation = useMutation({
    mutationFn: (includeBuiltIn: boolean) => toggleBuiltInFn({ data: { includeBuiltIn } }),
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: ["admin", "custom-series-catalog"] });
      void qc.invalidateQueries({ queryKey: ["public", "custom-series-catalog"] });
      toast.success(
        res.includeBuiltIn
          ? "Built-in Test Series enabled alongside your custom series!"
          : "Switched to 100% Clean Custom-Only Test Series mode!",
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const copySqlFromServer = async (kind: "cleaner" | "production") => {
    try {
      const res = await fetch("/__fixture__/supabase/sql");
      if (!res.ok) throw new Error("Failed to fetch SQL bundle");
      const data = (await res.json()) as { cleanerSql?: string; productionSql?: string };
      const text = kind === "cleaner" ? data.cleanerSql : data.productionSql;
      if (!text) throw new Error("SQL content empty");
      await navigator.clipboard.writeText(text);
      toast.success(
        kind === "cleaner"
          ? "Copied KKCC-Excellence-Hub-SQL-CLEANER.sql to clipboard!"
          : "Copied KKCC-Excellence-Hub-PRODUCTION-SQL.sql to clipboard!",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to copy SQL");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ADMIN_TOOLS.filter((tool) => {
      if (category !== "All" && tool.category !== category) return false;
      if (!q) return true;
      return (
        tool.label.toLowerCase().includes(q) ||
        tool.hint.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      );
    });
  }, [category, search]);

  const controls = controlsQuery.data;
  const includeBuiltIn = Boolean(customCatalogQuery.data?.includeBuiltIn);

  return (
    <div className="surface-panel mb-6 p-4 sm:p-5" data-testid="admin-command-bar">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">
                KKCC Super Admin Full Control Center
              </h2>
              <Badge variant="secondary" className="rounded-full text-[10px]">
                {ADMIN_TOOLS.length} Modules
              </Badge>
              <Badge className="rounded-full bg-emerald-500/15 text-[10px] text-emerald-600 dark:text-emerald-400">
                <Zap className="mr-1 h-3 w-3" /> Fast Gzip + RAM Cache + DB Indexed
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Full control over Courses, Test Series, Syllabus, Speed Optimizer, SQL Cleaner &amp;
              ZIP Downloads.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={showMasterControls ? "default" : "outline"}
            className="h-8 rounded-full text-xs font-bold"
            onClick={() => setShowMasterControls((v) => !v)}
          >
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            {showMasterControls ? "Hide Master Bar" : "Master Controls & Downloads"}
          </Button>
          <div className="relative flex-1 sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!expanded) setExpanded(true);
              }}
              placeholder="Search admin tools..."
              className="h-8 rounded-full pl-8 text-xs"
            />
          </div>
          {compact && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="rounded-full border px-3 py-1.5 text-xs font-medium transition hover:border-primary/50 hover:text-primary"
            >
              {expanded ? "Compact view" : `Show all ${ADMIN_TOOLS.length} tools`}
            </button>
          )}
        </div>
      </div>

      {/* Master App Controls, Speed Optimizer & Downloads Hub */}
      {showMasterControls && (
        <div className="mt-4 space-y-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background/90 to-cyan-500/10 p-3.5 sm:p-4">
          {/* Row 1: Downloads, SQL Cleaner & 1-Click Speed Optimizer */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[11px] font-black uppercase tracking-wider text-primary">
                Downloads &amp; SQL:
              </span>
              <a
                href="/__fixture__/supabase/zip"
                download="full fledge kkcc excellence hub.zip"
                className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                <Download className="h-3.5 w-3.5" /> Download Complete ZIP
              </a>
              <a
                href="/__fixture__/supabase/download/production.sql"
                download="KKCC-Excellence-Hub-PRODUCTION-SQL.sql"
                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              >
                <Database className="h-3.5 w-3.5" /> Production SQL
              </a>
              <button
                type="button"
                onClick={() => void copySqlFromServer("production")}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-background px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
              >
                <Copy className="h-3 w-3" /> Copy SQL
              </button>
              <a
                href="/__fixture__/supabase/download/cleaner.sql"
                download="KKCC-Excellence-Hub-SQL-CLEANER.sql"
                className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-sm transition hover:opacity-90"
              >
                <Download className="h-3.5 w-3.5" /> SQL Cleaner
              </a>
              <button
                type="button"
                onClick={() => void copySqlFromServer("cleaner")}
                className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-background px-2.5 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
              >
                <Copy className="h-3 w-3" /> Copy Cleaner
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={optimizeMutation.isPending}
                onClick={() => optimizeMutation.mutate()}
                className="inline-flex items-center gap-1 rounded-full border border-cyan-500/50 bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-700 transition hover:bg-cyan-500/25 dark:text-cyan-300"
              >
                {optimizeMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
                1-Click Speed &amp; DB Cleaner
              </button>
              <Link
                to="/downloads"
                className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs font-semibold hover:border-primary hover:text-primary"
              >
                All Files Hub
              </Link>
            </div>
          </div>

          {/* Row 2: Live Feature Switches & Test Series Clean-Slate Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                Live Feature Switches:
              </span>
              {controls && (
                <>
                  {(
                    [
                      ["testSeriesEnabled", "Test Series", controls.testSeriesEnabled],
                      ["studyMaterialEnabled", "Study Material", controls.studyMaterialEnabled],
                      ["kittuQuizEnabled", "Kit 2 Coins Quiz", controls.kittuQuizEnabled],
                      ["protectionEnabled", "Content Shield", controls.protectionEnabled],
                      ["copyGuardEnabled", "Anti-Copy Guard", controls.copyGuardEnabled],
                      ["maintenanceMode", "Maintenance Mode", controls.maintenanceMode],
                    ] as const
                  ).map(([key, label, active]) => (
                    <button
                      key={key}
                      type="button"
                      disabled={toggleFeatureMutation.isPending}
                      onClick={() => toggleFeatureMutation.mutate({ [key]: !active })}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition",
                        active
                          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          active ? "bg-emerald-500" : "bg-rose-500",
                        )}
                      />
                      {label}: {active ? "ON" : "OFF"}
                    </button>
                  ))}
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                Test Series Control:
              </span>
              <Link
                to="/admin/exam-bank"
                className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary hover:bg-primary/25"
              >
                + Add Series &amp; Syllabus
              </Link>
              <button
                type="button"
                disabled={toggleBuiltInMutation.isPending}
                onClick={() => toggleBuiltInMutation.mutate(!includeBuiltIn)}
                className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-0.5 text-[11px] font-semibold hover:border-primary"
                title="Switch between Clean Custom-Only Test Series and Built-In Series"
              >
                <RotateCcw className="h-3 w-3" />
                {includeBuiltIn ? "Hide Built-In Series" : "Restore Built-In Series"}
              </button>
              <button
                type="button"
                disabled={clearSeriesMutation.isPending}
                onClick={() => clearSeriesMutation.mutate()}
                className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                title="Clear all Test Series & Tests to start from a 100% empty slate"
              >
                <Trash2 className="h-3 w-3" /> Empty All Series &amp; Tests
              </button>
            </div>
          </div>

          {optimizeMutation.data && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background/90 px-3 py-1.5 text-[11px]">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Server Latency:{" "}
                {optimizeMutation.data.durationMs}ms
              </span>
              <span>
                Courses: <b>{optimizeMutation.data.counts.courses}</b>
              </span>
              <span>
                Lectures: <b>{optimizeMutation.data.counts.lectures}</b>
              </span>
              <span>
                Materials: <b>{optimizeMutation.data.counts.materials}</b>
              </span>
              <span>
                Custom Series: <b>{optimizeMutation.data.counts.customSeries}</b>
              </span>
              <span>
                Tests: <b>{optimizeMutation.data.counts.tests}</b>
              </span>
              <span>
                Cache Flushed: <b>{optimizeMutation.data.clearedSelectEntries}</b>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              if (!expanded) setExpanded(true);
            }}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              category === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      {expanded ? (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => {
            const Icon = tool.icon;
            const isActive =
              tool.to === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(tool.to);
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className={cn(
                  "group flex items-start gap-3 rounded-2xl border p-3 transition-all",
                  isActive
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "bg-background/60 hover:border-primary/40 hover:bg-muted/40",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {tool.label}
                    </span>
                    {tool.badge && (
                      <Badge className="h-4 rounded-full px-1.5 text-[9px]">{tool.badge}</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                    {tool.hint}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {filtered.map((tool) => {
            const isActive =
              tool.to === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(tool.to);
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background/70 text-foreground hover:border-primary/50 hover:text-primary",
                )}
              >
                <tool.icon className="h-3.5 w-3.5" />
                {tool.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
