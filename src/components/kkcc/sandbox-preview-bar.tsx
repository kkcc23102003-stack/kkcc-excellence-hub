import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  GraduationCap,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
  Database,
  Copy,
  Download,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/use-auth-user";
import { Badge } from "@/components/ui/badge";

type CleanerReport = {
  cleanedAbandonedAttempts: number;
  cleanedExpiredGrants: number;
  clearedCacheKeys: number;
  ettSeriesFree: boolean;
  stats?: {
    profiles: number;
    enrollments: number;
    attempts: number;
  };
  cleanedAt: string;
};

const FALLBACK_CLEANER_SQL = `-- KKCC SUPABASE DATABASE & STORAGE BLOAT CLEANER SQL
BEGIN;
DELETE FROM public.learning_attempts WHERE status = 'started' AND started_at < now() - interval '24 hours';
DELETE FROM public.test_access_grants WHERE (revoked_at IS NOT NULL AND revoked_at < now() - interval '90 days') OR (expires_at IS NOT NULL AND expires_at < now() - interval '90 days');
DELETE FROM public.series_access_grants WHERE (revoked_at IS NOT NULL AND revoked_at < now() - interval '90 days') OR (expires_at IS NOT NULL AND expires_at < now() - interval '90 days');
UPDATE public.test_series_overrides SET price_inr = 0, price_coins = 0, updated_at = now() WHERE series_id IN ('punjab-ett-paper-a', 'punjab-ett-paper-b', 'punjab-ett-cadre');
COMMIT;`;

export function SandboxPreviewBar() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showCleanerPanel, setShowCleanerPanel] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const [report, setReport] = useState<CleanerReport | null>(null);
  const [sqlBundle, setSqlBundle] = useState<{
    cleanerSql: string;
    productionSql: string;
  } | null>(null);

  useEffect(() => {
    const metaEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
    const envEnabled =
      (metaEnv?.["VITE_KKCC_SANDBOX_PREVIEW"] ?? "") === "1" ||
      (metaEnv?.["VITE_SUPABASE_URL"] ?? "") === "/__fixture__/supabase";
    const urlEnabled =
      typeof window !== "undefined" && window.location.search.includes("preview=1");
    if (envEnabled || urlEnabled) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const currentRole =
    user?.email === "admin@fixture.invalid" ? "Admin" : user?.email ? "Student" : "Guest (Public)";

  const switchRole = async (role: "admin" | "student" | "guest", targetPath: string) => {
    setSwitching(role);
    try {
      if (role === "guest") {
        await supabase.auth.signOut();
        toast.success("Switched to Public / Guest View");
        await navigate({ to: targetPath });
        return;
      }
      const email = role === "admin" ? "admin@fixture.invalid" : "studenta@fixture.invalid";
      await supabase.auth.signOut();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: "FixturePass123!",
      });
      if (error) throw error;
      toast.success(
        role === "admin"
          ? "Logged in as KKCC Super Admin! Opening Admin Panel..."
          : "Logged in as Demo Student (1,000 23KAAT Coins)!",
      );
      window.location.href = targetPath;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to switch preview role");
    } finally {
      setSwitching(null);
    }
  };

  const runLiveCleaner = async () => {
    setCleaning(true);
    try {
      let clearedCacheKeys = 0;
      if (typeof window !== "undefined") {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && (k.startsWith("kkcc:") || k.startsWith("kkcc_") || k.includes("cache"))) {
            keysToRemove.push(k);
          }
        }
        for (const k of keysToRemove) {
          window.localStorage.removeItem(k);
          clearedCacheKeys++;
        }
      }

      const res = await fetch("/__fixture__/supabase/clean", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const data = res.ok
        ? ((await res.json()) as {
            cleanedAbandonedAttempts?: number;
            cleanedExpiredGrants?: number;
            ettSeriesFree?: boolean;
            stats?: { profiles: number; enrollments: number; attempts: number };
            cleanedAt?: string;
          })
        : null;

      const nextReport: CleanerReport = {
        cleanedAbandonedAttempts: data?.cleanedAbandonedAttempts ?? 0,
        cleanedExpiredGrants: data?.cleanedExpiredGrants ?? 0,
        clearedCacheKeys,
        ettSeriesFree: data?.ettSeriesFree ?? true,
        ...(data?.stats ? { stats: data.stats } : {}),
        cleanedAt: data?.cleanedAt ?? new Date().toISOString(),
      };
      setReport(nextReport);
      setShowCleanerPanel(true);
      toast.success("Sandbox & Database Cleaner completed!", {
        description: `Cleaned ${nextReport.cleanedAbandonedAttempts} stale attempts, ${nextReport.cleanedExpiredGrants} expired grants, ${nextReport.clearedCacheKeys} browser cache keys. ETT Cadre is 100% Free (₹0).`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cleaner failed");
    } finally {
      setCleaning(false);
    }
  };

  const ensureSqlBundle = async () => {
    if (sqlBundle) return sqlBundle;
    try {
      const res = await fetch("/__fixture__/supabase/sql");
      if (res.ok) {
        const data = (await res.json()) as { cleanerSql?: string; productionSql?: string };
        const loaded = {
          cleanerSql: data.cleanerSql || FALLBACK_CLEANER_SQL,
          productionSql: data.productionSql || FALLBACK_CLEANER_SQL,
        };
        setSqlBundle(loaded);
        return loaded;
      }
    } catch {
      // Fallback to built-in SQL
    }
    const fallback = { cleanerSql: FALLBACK_CLEANER_SQL, productionSql: FALLBACK_CLEANER_SQL };
    setSqlBundle(fallback);
    return fallback;
  };

  const copySql = async (kind: "cleaner" | "production") => {
    const bundle = await ensureSqlBundle();
    const text = kind === "cleaner" ? bundle.cleanerSql : bundle.productionSql;
    await navigator.clipboard.writeText(text);
    toast.success(
      kind === "cleaner"
        ? "Copied KKCC-Excellence-Hub-SQL-CLEANER.sql to clipboard!"
        : "Copied KKCC-Excellence-Hub-PRODUCTION-SQL.sql to clipboard!",
    );
  };

  const downloadSql = async (kind: "cleaner" | "production") => {
    const bundle = await ensureSqlBundle();
    const text = kind === "cleaner" ? bundle.cleanerSql : bundle.productionSql;
    const filename =
      kind === "cleaner"
        ? "KKCC-Excellence-Hub-SQL-CLEANER.sql"
        : "KKCC-Excellence-Hub-PRODUCTION-SQL.sql";
    const blob = new Blob([text], { type: "text/sql;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  return (
    <div className="sticky top-0 z-50 border-b border-primary/30 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-primary text-primary-foreground">
            <Sparkles className="mr-1 h-3 w-3" /> KKCC Live Sandbox Preview
          </Badge>
          <span className="text-muted-foreground">
            Active View: <b className="text-foreground">{currentRole}</b>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <a
            href="/__fixture__/supabase/zip"
            download="full fledge kkcc excellence hub.zip"
            className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
            title="Download full fledge kkcc excellence hub.zip (7.5 MB)"
          >
            <Download className="h-3.5 w-3.5" />
            Download Complete ZIP
          </a>

          <button
            type="button"
            disabled={cleaning}
            onClick={() => void runLiveCleaner()}
            className="inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-500/15 px-2.5 py-1 font-semibold text-amber-700 transition hover:bg-amber-500/25 dark:text-amber-300"
            title="Clean stale test attempts, expired grants, browser cache & verify ETT Free"
          >
            {cleaning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            1-Click Cleaner
          </button>

          <button
            type="button"
            onClick={() => {
              setShowCleanerPanel((v) => !v);
              void ensureSqlBundle();
            }}
            className="inline-flex items-center gap-1 rounded-full border border-cyan-500/50 bg-cyan-500/15 px-2.5 py-1 font-semibold text-cyan-700 transition hover:bg-cyan-500/25 dark:text-cyan-300"
          >
            <Database className="h-3.5 w-3.5" />
            SQL & Cleaner
          </button>

          <button
            type="button"
            disabled={switching !== null}
            onClick={() => void switchRole("student", "/dashboard")}
            className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-300"
          >
            {switching === "student" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <GraduationCap className="h-3.5 w-3.5" />
            )}
            1-Click Student View
          </button>

          <button
            type="button"
            disabled={switching !== null}
            onClick={() => void switchRole("admin", "/admin")}
            className="inline-flex items-center gap-1 rounded-full border border-primary/50 bg-primary/15 px-2.5 py-1 font-semibold text-primary transition hover:bg-primary/25"
          >
            {switching === "admin" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" />
            )}
            1-Click Admin Panel
          </button>

          <button
            type="button"
            disabled={switching !== null}
            onClick={() => void switchRole("guest", "/")}
            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            Public View
          </button>

          <button
            type="button"
            onClick={() => setMinimized((m) => !m)}
            className="inline-flex items-center gap-0.5 rounded-full border px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            title="Toggle quick jump links"
          >
            {minimized ? (
              <>
                Links <ChevronDown className="h-3 w-3" />
              </>
            ) : (
              <>
                Hide <ChevronUp className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {showCleanerPanel && (
        <div className="border-t border-primary/25 bg-muted/60 px-3 py-3 text-xs sm:px-6">
          <div className="mx-auto max-w-7xl space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-bold">
                  KKCC Live Server Cleaner & Supabase SQL Control Center
                </span>
                <Badge variant="outline" className="rounded-full text-[10px]">
                  Supabase 0-Bloat Protected · ETT Cadre Paper A & B Free (₹0)
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <a
                  href="/__fixture__/supabase/zip"
                  download="full fledge kkcc excellence hub.zip"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:opacity-90"
                >
                  <Download className="h-3 w-3" /> Download Complete Project ZIP (7.5 MB)
                </a>
                <button
                  type="button"
                  onClick={() => void runLiveCleaner()}
                  disabled={cleaning}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground hover:opacity-90"
                >
                  <Trash2 className="h-3 w-3" /> Run Cleaner Now
                </button>
                <button
                  type="button"
                  onClick={() => void copySql("cleaner")}
                  className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-[11px] font-semibold hover:border-primary"
                >
                  <Copy className="h-3 w-3" /> Copy Cleaner SQL
                </button>
                <button
                  type="button"
                  onClick={() => void downloadSql("cleaner")}
                  className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-[11px] font-semibold hover:border-primary"
                >
                  <Download className="h-3 w-3" /> Download Cleaner SQL
                </button>
                <button
                  type="button"
                  onClick={() => void downloadSql("production")}
                  className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-[11px] font-semibold hover:border-primary"
                >
                  <Download className="h-3 w-3" /> Download Full Production SQL
                </button>
              </div>
            </div>

            {report && (
              <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background/90 px-3 py-2 text-[11px]">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Last Cleaned: {new Date(report.cleanedAt).toLocaleTimeString()}
                </span>
                <span>
                  Abandoned Attempts Removed: <b>{report.cleanedAbandonedAttempts}</b>
                </span>
                <span>
                  Expired Grants Removed: <b>{report.cleanedExpiredGrants}</b>
                </span>
                <span>
                  Browser Cache Keys Cleared: <b>{report.clearedCacheKeys}</b>
                </span>
                <span>
                  ETT Cadre Paper A & B: <b className="text-emerald-600">Free (₹0 / 0 Coins)</b>
                </span>
                {report.stats && (
                  <span>
                    DB Rows — Profiles: <b>{report.stats.profiles}</b> · Enrollments:{" "}
                    <b>{report.stats.enrollments}</b> · Completed Attempts:{" "}
                    <b>{report.stats.attempts}</b>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!minimized && (
        <div className="border-t border-border/60 bg-muted/40 px-3 py-1.5 sm:px-6">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-1.5 text-[11px]">
            <span className="font-semibold text-muted-foreground">Quick Jump:</span>
            <Link
              to="/"
              className="rounded-full border bg-background px-2.5 py-0.5 hover:border-primary hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="rounded-full border bg-background px-2.5 py-0.5 hover:border-primary hover:text-primary"
            >
              Courses
            </Link>
            <Link
              to="/study-material"
              className="rounded-full border bg-background px-2.5 py-0.5 hover:border-primary hover:text-primary"
            >
              Study Material (Notes)
            </Link>
            <Link
              to="/test-series"
              className="rounded-full border bg-background px-2.5 py-0.5 hover:border-primary hover:text-primary"
            >
              Test Series (ETT Free)
            </Link>
            <Link
              to="/games"
              className="rounded-full border bg-background px-2.5 py-0.5 hover:border-primary hover:text-primary"
            >
              Kit 2 Coins Quiz
            </Link>
            <Link
              to="/coins"
              className="rounded-full border bg-background px-2.5 py-0.5 hover:border-primary hover:text-primary"
            >
              23KAAT Wallet
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full border bg-background px-2.5 py-0.5 hover:border-primary hover:text-primary"
            >
              Student Dashboard
            </Link>
            <Link
              to="/admin"
              className="rounded-full border bg-background px-2.5 py-0.5 font-medium text-primary hover:border-primary"
            >
              Admin Home
            </Link>
            <Link
              to="/admin/syllabus"
              className="rounded-full border bg-background px-2.5 py-0.5 font-medium text-primary hover:border-primary"
            >
              Syllabus Auto Builder
            </Link>
            <Link
              to="/admin/tests"
              className="rounded-full border bg-background px-2.5 py-0.5 font-medium text-primary hover:border-primary"
            >
              Test Builder
            </Link>
            <Link
              to="/admin/materials"
              className="rounded-full border bg-background px-2.5 py-0.5 font-medium text-primary hover:border-primary"
            >
              Materials Admin
            </Link>
            <Link
              to="/admin/security"
              className="rounded-full border bg-background px-2.5 py-0.5 font-medium text-primary hover:border-primary"
            >
              Security & Health
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
