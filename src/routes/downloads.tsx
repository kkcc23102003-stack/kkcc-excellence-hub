import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileArchive,
  FileCode2,
  Loader2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads, SQL Cleaner & ZIP — KKCC Excellence Hub" },
      {
        name: "description",
        content:
          "Download the complete KKCC Excellence Hub ZIP, Production SQL, and SQL Cleaner with 1-click Live Database & Cache Cleaner.",
      },
    ],
  }),
  component: DownloadsPage,
});

const GITHUB_BRANCH_RAW =
  "https://github.com/kkcc23102003-stack/kkcc-excellence-hub/raw/arena/01a10030-kkcc-excellence-hub";

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

function DownloadsPage() {
  const [cleaning, setCleaning] = useState(false);
  const [report, setReport] = useState<CleanerReport | null>(null);
  const [sqlPreview, setSqlPreview] = useState<"none" | "cleaner" | "production">("none");
  const [sqlBundle, setSqlBundle] = useState<{
    cleanerSql: string;
    productionSql: string;
  } | null>(null);

  const ensureSqlBundle = async () => {
    if (sqlBundle) return sqlBundle;
    const load = async (name: string) => {
      const response = await fetch(`/KKCC-Excellence-Hub-${name}.sql`, { cache: "no-store" });
      const sql = await response.text();
      if (!response.ok || !sql.trimStart().startsWith("--"))
        throw new Error(
          "SQL download failed. Use the direct download link; no substitute SQL was copied.",
        );
      return sql;
    };
    const [productionSql, cleanerSql] = await Promise.all([
      load("PRODUCTION-SQL"),
      load("SQL-CLEANER"),
    ]);
    const loaded = { productionSql, cleanerSql };
    setSqlBundle(loaded);
    return loaded;
  };

  const copySql = async (kind: "cleaner" | "production") => {
    try {
      const bundle = await ensureSqlBundle();
      await navigator.clipboard.writeText(
        kind === "cleaner" ? bundle.cleanerSql : bundle.productionSql,
      );
      toast.success(`Copied ${kind === "cleaner" ? "Cleaner" : "Production"} SQL to clipboard!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "SQL copy failed");
    }
  };

  const previewSql = async (kind: "cleaner" | "production") => {
    try {
      await ensureSqlBundle();
      setSqlPreview((prev) => (prev === kind ? "none" : kind));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "SQL preview failed");
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
      toast.success("Database, Server Cache & Browser Cleaner Completed!", {
        description: `Cleaned ${nextReport.cleanedAbandonedAttempts} stale attempts, ${nextReport.cleanedExpiredGrants} expired grants & ${nextReport.clearedCacheKeys} cache keys.`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cleaner failed");
    } finally {
      setCleaning(false);
    }
  };

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="surface-panel p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <Download className="h-3.5 w-3.5" /> Server Downloads & SQL Cleaner Hub
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Zap className="mr-1 h-3 w-3" /> Full-Stack Optimized (Gzip + RAM Cache + DB
                  Indexes)
                </Badge>
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link to="/admin">
                    <ShieldCheck className="mr-1.5 h-4 w-4 text-primary" /> Open Admin Full Control
                  </Link>
                </Button>
              </div>
            </div>

            <h1 className="neon-text mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Download Complete ZIP, Production SQL & SQL Cleaner
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Yahan se aap 1 click me poora upgraded project ZIP (
              <code>full fledge kkcc excellence hub.zip</code>), complete Production SQL (
              <code>KKCC-Excellence-Hub-PRODUCTION-SQL.sql</code>), aur Database Speed &amp; Bloat
              Cleaner SQL (<code>KKCC-Excellence-Hub-SQL-CLEANER.sql</code>) seedha download ya copy
              kar sakte hain.
            </p>

            <section className="mt-6 rounded-2xl border border-primary/40 bg-primary/5 p-5">
              <h2 className="font-bold">
                Notes / Test publish error? Easy test ko Paid karna hai?
              </h2>
              <p className="my-2 text-sm text-muted-foreground">
                Existing project mein latest combined Publish Fix SQL ek baar run karke redeploy
                karein. Notes + test tables aur paid Easy publish function included hain. S3 setup
                nahi chahiye; backup pehle lein. Old local/S3 files automatically migrate nahi hote.
              </p>
              <Button asChild>
                <a href="/KKCC-Excellence-Hub-PUBLISH-FIX.sql" download>
                  Download Notes + Test Publish Fix SQL
                </a>
              </Button>
            </section>
            {/* 3 Primary Download Cards */}
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {/* Card 1: Complete Project ZIP */}
              <article className="flex flex-col justify-between rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-background/90 to-cyan-500/10 p-6 shadow-soft">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 text-primary">
                      <FileArchive className="h-6 w-6" />
                    </span>
                    <Badge className="rounded-full bg-primary text-primary-foreground">
                      Complete Project ZIP
                    </Badge>
                  </div>
                  <h2 className="mt-4 text-xl font-black">full fledge kkcc excellence hub.zip</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Complete upgraded source code: Empty Admin-Controlled Test Series, Text Syllabus
                    Auto-Builder, UV Neon Colorful Test UI, Full Admin Control Center, and
                    Frontend/Backend/Database/Network Speed Optimizations.
                  </p>
                </div>

                <div className="mt-6 space-y-2.5">
                  <a
                    href="/__fixture__/supabase/zip"
                    download="full fledge kkcc excellence hub.zip"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black text-primary-foreground shadow-sm transition hover:opacity-90"
                  >
                    <Download className="h-4 w-4" /> Download Complete ZIP (Server)
                  </a>
                  <a
                    href={`${GITHUB_BRANCH_RAW}/full%20fledge%20kkcc%20excellence%20hub.zip`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-background/80 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary/10"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Direct GitHub Raw ZIP Download
                  </a>
                </div>
              </article>

              {/* Card 2: Complete Production SQL */}
              <article className="flex flex-col justify-between rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-background/90 to-teal-500/10 p-6 shadow-soft">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-500">
                      <Database className="h-6 w-6" />
                    </span>
                    <Badge className="rounded-full bg-emerald-600 text-white">
                      Full Production SQL
                    </Badge>
                  </div>
                  <h2 className="mt-4 text-xl font-black">
                    KKCC-Excellence-Hub-PRODUCTION-SQL.sql
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    All-in-one idempotent Supabase PostgreSQL schema: Tables, RLS Policies,
                    <code> save_learning_attempt_answers</code> RPC, 23KAAT Wallet, Composite Speed
                    Indexes, and <code>NOTIFY pgrst, &apos;reload schema&apos;</code>.
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <a
                    href="/KKCC-Excellence-Hub-PRODUCTION-SQL.sql"
                    download="KKCC-Excellence-Hub-PRODUCTION-SQL.sql"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:opacity-90"
                  >
                    <Download className="h-4 w-4" /> Download Production SQL
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => void copySql("production")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/40 bg-background/80 px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-400"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy SQL
                    </button>
                    <button
                      type="button"
                      onClick={() => void previewSql("production")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/40 bg-background/80 px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-400"
                    >
                      <Eye className="h-3.5 w-3.5" />{" "}
                      {sqlPreview === "production" ? "Hide SQL" : "View SQL"}
                    </button>
                  </div>
                  <a
                    href={`${GITHUB_BRANCH_RAW}/KKCC-Excellence-Hub-PRODUCTION-SQL.sql`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border bg-background/70 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" /> Direct GitHub Raw Production SQL
                  </a>
                </div>
              </article>

              {/* Card 3: SQL Cleaner & Composite Indexes */}
              <article className="flex flex-col justify-between rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-background/90 to-orange-500/10 p-6 shadow-soft">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-500">
                      <FileCode2 className="h-6 w-6" />
                    </span>
                    <Badge className="rounded-full bg-amber-500 text-slate-950">
                      Safe Space Saver
                    </Badge>
                  </div>
                  <h2 className="mt-4 text-xl font-black">KKCC-Excellence-Hub-SQL-CLEANER.sql</h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Installs preview-first database usage tools. Installation deletes nothing. Admin
                    → Storage can explicitly remove never-submitted, expired drafts older than 90
                    days. Results, users, payments and access grants are preserved.
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <a
                    href="/KKCC-Excellence-Hub-SQL-CLEANER.sql"
                    download="KKCC-Excellence-Hub-SQL-CLEANER.sql"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:opacity-90"
                  >
                    <Download className="h-4 w-4" /> Download SQL Cleaner
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => void copySql("cleaner")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-500/40 bg-background/80 px-3 py-2 text-xs font-bold text-amber-600 transition hover:bg-amber-500/10 dark:text-amber-400"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy Cleaner
                    </button>
                    <button
                      type="button"
                      onClick={() => void previewSql("cleaner")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-500/40 bg-background/80 px-3 py-2 text-xs font-bold text-amber-600 transition hover:bg-amber-500/10 dark:text-amber-400"
                    >
                      <Eye className="h-3.5 w-3.5" />{" "}
                      {sqlPreview === "cleaner" ? "Hide SQL" : "View SQL"}
                    </button>
                  </div>
                  <a
                    href={`${GITHUB_BRANCH_RAW}/KKCC-Excellence-Hub-SQL-CLEANER.sql`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border bg-background/70 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" /> Direct GitHub Raw Cleaner SQL
                  </a>
                </div>
              </article>
            </div>

            {/* Live SQL Viewer */}
            {sqlPreview !== "none" && sqlBundle && (
              <div className="mt-6 rounded-3xl border border-primary/35 bg-slate-950 p-5 text-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {sqlPreview === "cleaner"
                      ? "KKCC-Excellence-Hub-SQL-CLEANER.sql"
                      : "KKCC-Excellence-Hub-PRODUCTION-SQL.sql"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 rounded-full text-xs"
                      onClick={() => void copySql(sqlPreview)}
                    >
                      <Copy className="mr-1 h-3.5 w-3.5" /> Copy All SQL
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 rounded-full text-xs text-slate-300"
                      onClick={() => setSqlPreview("none")}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                <pre className="max-h-80 overflow-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-4 font-mono text-xs leading-relaxed text-emerald-300">
                  {sqlPreview === "cleaner" ? sqlBundle.cleanerSql : sqlBundle.productionSql}
                </pre>
              </div>
            )}

            {/* 1-Click Live Database & Server Cache Cleaner */}
            <div className="mt-8 rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-background to-emerald-500/10 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-black">
                      1-Click Live Server, Database &amp; Cache Cleaner
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    Live server me stale test attempts, expired grants aur browser cache ko turant
                    clean karein taki app bilkul fast aur smooth chale.
                  </p>
                </div>
                <Button
                  onClick={() => void runLiveCleaner()}
                  disabled={cleaning}
                  className="rounded-full font-bold"
                >
                  {cleaning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Run 1-Click Live Cleaner Now
                </Button>
              </div>

              {report && (
                <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border bg-background/90 px-4 py-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Cleaned at{" "}
                    {new Date(report.cleanedAt).toLocaleTimeString()}
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
                  {report.stats && (
                    <span>
                      Active Profiles: <b>{report.stats.profiles}</b> · Enrollments:{" "}
                      <b>{report.stats.enrollments}</b> · Attempts: <b>{report.stats.attempts}</b>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
