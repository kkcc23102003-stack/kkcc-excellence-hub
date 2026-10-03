import { invalidateLearningQueries } from "@/hooks/use-learning-access";
import { Fragment, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  Database,
  Layers,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ACTIVE_TEMPLATES, EXAM_BANK_TOTAL, OFFICIAL_SYLLABUS_TAGS_REMOVED } from "@/lib/exam-bank";
import { OFFICIAL_SYLLABUS_RULES } from "@/lib/exam-bank/official-syllabus";
import { auditQuestionBank } from "@/lib/exam-bank/quality-audit";
import {
  adminClearAllTestSeries,
  adminCreateCustomTestSeries,
  adminGetCustomSeriesCatalog,
  adminListSeriesOverrides,
  adminRemoveTestSeries,
  adminResetSeriesOverride,
  adminResetSeriesSyllabus,
  adminRestoreTestSeries,
  adminSaveSeriesOverride,
  adminSaveSeriesSyllabus,
} from "@/lib/admin.functions";
import {
  adminGrantSeriesAccess,
  adminListSeriesGrants,
  adminRevokeSeriesAccess,
} from "@/lib/test-access.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import {
  PAID_TEST_SERIES,
  SERIES_GROUPS,
  THEORY_TEST_SERIES,
  formatSeriesSyllabusText,
  getEffectivePaidTestSeries,
  parseSeriesSyllabusText,
  resolveSeriesPrice,
  seriesPlan,
  seriesTotals,
  setRuntimeCustomSeriesCatalog,
  type PaidTestSeries,
} from "@/lib/test-series-catalog";

const SYLLABUS_PRESETS: Array<{ label: string; exam: string; text: string }> = [
  {
    label: "Punjab ETT Cadre (Paper A & B)",
    exam: "Punjab ETT Cadre",
    text: [
      "Punjabi Paper A :: ਗੁਰਮੁਖੀ ਲਿਪੀ ਅਤੇ ਧੁਨੀ ਬੋਧ, ਸ਼ਬਦ ਬੋਧ ਅਤੇ ਵਿਆਕਰਣ, ਮੁਹਾਵਰੇ ਅਤੇ ਅਖਾਣ, ਪੰਜਾਬੀ ਸਾਹਿਤ ਅਤੇ ਸੱਭਿਆਚਾਰ",
      "Child Development and Pedagogy :: Growth & Development, Learning Theories (Piaget, Vygotsky, Kohlberg), Inclusive Education, Assessment & Evaluation",
      "General Knowledge :: Punjab History & Culture, Geography of Punjab, Indian Polity & Constitution, Current Affairs",
      "Mathematics :: Number System, Percentage & Ratio, Mensuration & Geometry, Data Handling & Arithmetic",
      "General Science :: Living World & Human Body, Force, Energy & Motion, Matter & Chemical Reactions, Environmental Studies (EVS)",
      "English Language :: Tenses & Grammar Rules, Vocabulary & Idioms, Reading Comprehension, Pedagogy of English",
    ].join("\n"),
  },
  {
    label: "PSSSB / Punjab Patwari / Police",
    exam: "PSSSB",
    text: [
      "Punjab GK :: History of Punjab & Sikh Gurus, Geography & Rivers of Punjab, Economy & Agriculture of Punjab, Art, Culture & Heritage",
      "Punjabi Grammar :: ਵਿਆਕਰਣ ਨਿਯਮ, ਸ਼ਬਦ ਜੋੜ ਅਤੇ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ, ਮੁਹਾਵਰੇ ਤੇ ਅਖਾਣ, ਅਣਡਿੱਠਾ ਪੈਰਾ",
      "Quantitative Aptitude :: Number System & Simplification, Percentage, Profit & Loss, Ratio, Time & Work, Speed & Distance, Mensuration & Data Interpretation",
      "Reasoning :: Coding-Decoding & Series, Blood Relations & Direction Sense, Syllogism & Statement Conclusion, Seating Arrangement & Puzzles",
      "Polity :: Constitutional Framework & Fundamental Rights, Parliament & State Legislature, Judiciary & Panchayati Raj",
      "Computer Awareness :: Computer Fundamentals & Hardware, MS Office (Word, Excel, PowerPoint), Internet, Networking & Cyber Security",
    ].join("\n"),
  },
  {
    label: "Master Cadre / PSTET / CTET",
    exam: "Punjab Master Cadre",
    text: [
      "Child Development and Pedagogy :: Child Development Principles, Socialization & Constructivism, Children with Special Needs, Teaching-Learning Process & NCF/NEP",
      "Subject Specialization :: Core Graduated Concepts & Definitions, Classical & Modern Theories, Analytical Problem Solving, Applied Classroom Methodology",
      "Punjabi Language :: ਭਾਸ਼ਾ ਅਤੇ ਵਿਆਕਰਣ, ਸਾਹਿਤ ਦੇ ਰੂਪ ਅਤੇ ਇਤਿਹਾਸ, ਸ਼ਬਦ ਸ਼ਕਤੀਆਂ ਅਤੇ ਅਲੰਕਾਰ",
      "English Grammar :: Parts of Speech & Tenses, Voice & Narration, Clauses, Synthesis & Error Spotting",
    ].join("\n"),
  },
];

export const Route = createFileRoute("/_authenticated/admin/exam-bank")({
  component: AdminExamBankPage,
});

const inr = (n: number) => n.toLocaleString("en-IN");

function AdminExamBankPage() {
  const [tab, setTab] = useState<"series" | "subjects" | "syllabus" | "quality">("series");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [showAddSeries, setShowAddSeries] = useState(true);
  const [grantFor, setGrantFor] = useState("");
  const [gEmail, setGEmail] = useState("");
  const [gMethod, setGMethod] = useState("cash");
  const [gAmount, setGAmount] = useState("999");
  const [gDays, setGDays] = useState("365");
  const [gNote, setGNote] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    summary: "",
    priceInr: "",
    priceCoins: "",
    enabled: true,
    syllabusText: "",
  });
  const [newSeriesDraft, setNewSeriesDraft] = useState({
    name: "",
    examTrack: "Punjab ETT Cadre",
    group: "Punjab State",
    summary:
      "Chapterwise 60-question practice tests (20 Easy → 20 Moderate → 20 Difficult) auto-generated from the official syllabus.",
    priceInr: "0",
    priceCoins: "0",
    syllabusText: SYLLABUS_PRESETS[0]!.text,
  });

  const qc = useQueryClient();
  const listOverrides = useServerFn(adminListSeriesOverrides);
  const saveOverride = useServerFn(adminSaveSeriesOverride);
  const resetOverride = useServerFn(adminResetSeriesOverride);
  const getCustomCatalogFn = useServerFn(adminGetCustomSeriesCatalog);
  const saveSeriesSyllabusFn = useServerFn(adminSaveSeriesSyllabus);
  const resetSeriesSyllabusFn = useServerFn(adminResetSeriesSyllabus);
  const removeSeriesFn = useServerFn(adminRemoveTestSeries);
  const restoreSeriesFn = useServerFn(adminRestoreTestSeries);
  const createCustomSeriesFn = useServerFn(adminCreateCustomTestSeries);
  const clearAllSeriesFn = useServerFn(adminClearAllTestSeries);
  const listGrants = useServerFn(adminListSeriesGrants);
  const grantSeries = useServerFn(adminGrantSeriesAccess);
  const revokeSeries = useServerFn(adminRevokeSeriesAccess);

  const customCatalogQuery = useQuery({
    queryKey: ["admin", "custom-series-catalog"],
    queryFn: () => safeServerCall(() => getCustomCatalogFn({} as never), {}),
  });
  const customCatalog = useMemo(() => {
    const data = customCatalogQuery.data ?? {};
    setRuntimeCustomSeriesCatalog(data);
    return data;
  }, [customCatalogQuery.data]);

  const invalidateAllSeries = () => {
    void invalidateLearningQueries(qc);
    void qc.invalidateQueries({ queryKey: ["admin", "series-overrides"] });
    void qc.invalidateQueries({ queryKey: ["admin", "custom-series-catalog"] });
    void qc.invalidateQueries({ queryKey: ["public", "series-overrides"] });
    void qc.invalidateQueries({ queryKey: ["public", "custom-series-catalog"] });
  };

  const grantsQuery = useQuery({
    queryKey: ["admin", "series-grants"],
    queryFn: () => safeServerCall(() => listGrants({} as never), []),
  });
  const grant = useMutation({
    mutationFn: (input: Parameters<typeof adminGrantSeriesAccess>[0]) => grantSeries(input),
    onSuccess: (r) => {
      void invalidateLearningQueries(qc);
      toast.success(r.renewed ? "Access renewed" : "Access granted");
      setGEmail("");
      setGNote("");
      void qc.invalidateQueries({ queryKey: ["admin", "series-grants"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const revoke = useMutation({
    mutationFn: (id: string) => revokeSeries({ data: { id } } as never),
    onSuccess: () => {
      void invalidateLearningQueries(qc);
      toast.success("Access withdrawn");
      void qc.invalidateQueries({ queryKey: ["admin", "series-grants"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const liveGrants = (grantsQuery.data ?? []).filter((g) => !g.revoked_at);

  const overridesQuery = useQuery({
    queryKey: ["admin", "series-overrides"],
    queryFn: () => safeServerCall(() => listOverrides({} as never), []),
  });
  const overrides = useMemo(() => {
    const m = new Map<
      string,
      {
        enabled: boolean;
        name: string | null;
        summary: string | null;
        price_inr: number | null;
        price_coins: number | null;
      }
    >();
    for (const o of overridesQuery.data ?? []) m.set(o.series_id, o);
    return m;
  }, [overridesQuery.data]);

  const save = useMutation({
    mutationFn: (input: Parameters<typeof adminSaveSeriesOverride>[0]) => saveOverride(input),
    onSuccess: () => {
      invalidateAllSeries();
      toast.success("Series updated");
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const saveSyllabus = useMutation({
    mutationFn: (input: Parameters<typeof adminSaveSeriesSyllabus>[0]) =>
      saveSeriesSyllabusFn(input),
    onSuccess: (res) => {
      invalidateAllSeries();
      toast.success(
        `Syllabus & series saved! ${res.subjectsCount} subjects · ${res.chaptersCount} chapters · ${inr(res.totalAutoQuestions)} auto-generated MCQs ready.`,
      );
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const reset = useMutation({
    mutationFn: async (series_id: string) => {
      await resetOverride({ data: { series_id } } as never);
      await resetSeriesSyllabusFn({ data: { series_id } } as never);
    },
    onSuccess: () => {
      invalidateAllSeries();
      toast.success("Reverted to the built-in values & syllabus");
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const removeSeries = useMutation({
    mutationFn: (series_id: string) => removeSeriesFn({ data: { series_id } } as never),
    onSuccess: () => {
      invalidateAllSeries();
      toast.success("Test series removed from catalogue");
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const restoreSeries = useMutation({
    mutationFn: (series_id: string) => restoreSeriesFn({ data: { series_id } } as never),
    onSuccess: () => {
      invalidateAllSeries();
      toast.success("Test series restored to catalogue");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const createSeries = useMutation({
    mutationFn: (input: Parameters<typeof adminCreateCustomTestSeries>[0]) =>
      createCustomSeriesFn(input),
    onSuccess: (res) => {
      invalidateAllSeries();
      toast.success(
        `Added "${res.series.name}" with ${res.subjectsCount} subjects, ${res.chaptersCount} chapters & ${inr(res.totalAutoQuestions)} auto-generated questions!`,
      );
      setShowAddSeries(false);
      setNewSeriesDraft((prev) => ({ ...prev, name: "" }));
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const clearAllSeries = useMutation({
    mutationFn: () => clearAllSeriesFn({} as never),
    onSuccess: () => {
      invalidateAllSeries();
      toast.success("All test series & tests cleared — catalogue is now 100% empty!");
      setEditing(null);
      setShowAddSeries(true);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openEditor(target: PaidTestSeries) {
    const o = overrides.get(target.id);
    const resolved = resolveSeriesPrice(target, o);
    const currentPlan = seriesPlan(target, customCatalog.syllabusBySeriesId?.[target.id]);
    const fallbackPlan =
      currentPlan.length > 0
        ? currentPlan
        : target.subjects.map((subj) => ({
            subject: subj,
            chapters: [`${subj} — Core Concepts & Exam Practice`],
          }));
    setEditing(target.id);
    setDraft({
      name: o?.name ?? target.name,
      summary: o?.summary ?? target.summary,
      priceInr: String(resolved.priceInr),
      priceCoins: String(resolved.priceCoins),
      enabled: o?.enabled ?? true,
      syllabusText: formatSeriesSyllabusText(fallbackPlan),
    });
  }

  /** Everything below is computed from the live bank, not from a stored copy. */
  const bank = useMemo(() => {
    const subjects = new Map<string, Set<string>>();
    const examTags = new Set<string>();
    for (const t of ACTIVE_TEMPLATES) {
      if (!subjects.has(t.subject)) subjects.set(t.subject, new Set());
      subjects.get(t.subject)!.add(t.topic);
      for (const e of t.exams) examTags.add(e);
    }
    let chapters = 0;
    for (const v of subjects.values()) chapters += v.size;
    return { subjects, chapters, examTags };
  }, []);

  const activePaidSeries = useMemo(
    () => getEffectivePaidTestSeries(customCatalog),
    [customCatalog],
  );
  const removedBuiltInSeries = useMemo(() => {
    if (!customCatalog.includeBuiltIn) return [];
    const removedSet = new Set(customCatalog.removedSeriesIds ?? []);
    return PAID_TEST_SERIES.filter((s) => removedSet.has(s.id));
  }, [customCatalog.includeBuiltIn, customCatalog.removedSeriesIds]);

  const series = useMemo(
    () =>
      activePaidSeries.map((s) => {
        const customPlan = customCatalog.syllabusBySeriesId?.[s.id] ?? s.customPlan;
        const hasCustomSyllabus = Boolean(customPlan && customPlan.length > 0);
        const isAddedByAdmin = Boolean(
          (customCatalog.addedSeries ?? []).some((item) => item.id === s.id),
        );
        const totals = seriesTotals(s, customPlan);
        const plan = seriesPlan(s, customPlan);
        const missing = hasCustomSyllabus ? [] : s.subjects.filter((x) => !bank.subjects.has(x));
        const empty = plan
          .filter((p) => !p.chapters || p.chapters.length === 0)
          .map((p) => p.subject);
        const problems: string[] = [];
        if (missing.length) problems.push(`subject not in bank: ${missing.join(", ")}`);
        if (empty.length) problems.push(`no chapters resolve: ${empty.join(", ")}`);
        if (totals.chapters === 0) problems.push("zero chapters");
        if (totals.tests === 0) problems.push("zero tests");
        if (!hasCustomSyllabus && totals.pool < 5000)
          problems.push(`pool ${inr(totals.pool)} below 5,000`);
        if (totals.pool > 250000) problems.push(`pool ${inr(totals.pool)} above 250,000`);
        return { s, totals, problems, hasCustomSyllabus, isAddedByAdmin };
      }),
    [activePaidSeries, customCatalog, bank.subjects],
  );

  const parsedDraftPlan = useMemo(
    () => parseSeriesSyllabusText(draft.syllabusText),
    [draft.syllabusText],
  );
  const parsedDraftChapters = useMemo(
    () => parsedDraftPlan.reduce((sum, p) => sum + p.chapters.length, 0),
    [parsedDraftPlan],
  );
  const parsedNewPlan = useMemo(
    () => parseSeriesSyllabusText(newSeriesDraft.syllabusText),
    [newSeriesDraft.syllabusText],
  );
  const parsedNewChapters = useMemo(
    () => parsedNewPlan.reduce((sum, p) => sum + p.chapters.length, 0),
    [parsedNewPlan],
  );

  const totals = useMemo(() => {
    const t = { chapters: 0, tests: 0, questions: 0, pool: 0 };
    for (const r of series) {
      t.chapters += r.totals.chapters;
      t.tests += r.totals.tests;
      t.questions += r.totals.questions;
      t.pool += r.totals.pool;
    }
    return t;
  }, [series]);

  const problemCount = series.reduce((n, r) => n + r.problems.length, 0);
  const qualityReport = useMemo(() => (tab === "quality" ? auditQuestionBank() : null), [tab]);
  const recordedRules = useMemo(() => new Set(OFFICIAL_SYLLABUS_RULES.map((r) => r.exam)), []);
  const term = query.trim().toLowerCase();
  const hit = (s: string) => !term || s.toLowerCase().includes(term);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin"
        title="Exam bank and syllabus"
        description="Every subject, chapter, series and official syllabus rule in the app, computed live from the bank itself. Read only — the figures here are the real ones the students get."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Database} label="Questions in the bank" value={inr(EXAM_BANK_TOTAL)} />
          <Stat
            icon={Layers}
            label="Subjects / chapters"
            value={`${bank.subjects.size} / ${bank.chapters}`}
          />
          <Stat
            icon={BookOpenCheck}
            label="Paid / theory series"
            value={`${activePaidSeries.length} / ${THEORY_TEST_SERIES.length}`}
          />
          <Stat
            icon={problemCount === 0 ? CheckCircle2 : AlertTriangle}
            label="Integrity problems"
            value={String(problemCount)}
            tone={problemCount === 0 ? "ok" : "bad"}
          />
        </div>

        <div className="surface-panel mt-4 flex flex-wrap items-center gap-3 p-4 text-sm">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>
            <strong>{OFFICIAL_SYLLABUS_RULES.length}</strong> official syllabus rules applied,
            removing <strong>{inr(OFFICIAL_SYLLABUS_TAGS_REMOVED)}</strong> wrong exam tags.
          </span>
          <span className="text-muted-foreground">
            {totals.tests} tests · {inr(totals.questions)} paper questions · pool {inr(totals.pool)}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {(["series", "subjects", "syllabus", "quality"] as const).map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t)}
              className="font-semibold capitalize"
            >
              {t === "series"
                ? "Test series"
                : t === "subjects"
                  ? "Subjects and chapters"
                  : t === "syllabus"
                    ? "Official syllabus"
                    : "Quality control"}
            </Button>
          ))}
          <div className="relative ml-auto min-w-[16rem] flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, exam or subject"
              className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {tab === "series" ? (
          <div className="mt-4 space-y-4">
            <div className="surface-panel border-primary/30 bg-gradient-to-r from-primary/[0.06] via-cyan-500/[0.05] to-violet-500/[0.06] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-black">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Full Admin Series &amp; Syllabus Control (Add / Remove / Fix Syllabus /
                    Auto-Generate Questions)
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Remove any unwanted test series, add a brand-new series, or fix wrong syllabuses
                    in text format (`Subject :: Chapter 1, Chapter 2`). Every chapter automatically
                    generates 60 exam-grade MCQs (20 Easy → 20 Moderate → 20 Difficult).
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowAddSeries((v) => !v)}
                    className="rounded-full font-bold"
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    {showAddSeries ? "Close New Series Builder" : "Add New Test Series"}
                  </Button>
                  {series.length > 0 ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={clearAllSeries.isPending}
                      onClick={() => clearAllSeries.mutate()}
                      className="rounded-full border-destructive/40 font-bold text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Clear All Series
                    </Button>
                  ) : null}
                </div>
              </div>

              {showAddSeries ? (
                <div className="mt-4 rounded-2xl border bg-background/90 p-5">
                  <p className="text-sm font-black">Create New Test Series with Text Syllabus</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter the series details and paste its syllabus in text format below. Questions
                    will auto-generate for every chapter.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Series Name
                      <input
                        value={newSeriesDraft.name}
                        onChange={(e) =>
                          setNewSeriesDraft({ ...newSeriesDraft, name: e.target.value })
                        }
                        placeholder="e.g. Punjab ETT Cadre Special Series"
                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
                      />
                    </label>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Target Exam Name
                      <input
                        value={newSeriesDraft.examTrack}
                        onChange={(e) =>
                          setNewSeriesDraft({ ...newSeriesDraft, examTrack: e.target.value })
                        }
                        placeholder="e.g. Punjab ETT Cadre"
                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
                      />
                    </label>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Category Group
                      <select
                        value={newSeriesDraft.group}
                        onChange={(e) =>
                          setNewSeriesDraft({ ...newSeriesDraft, group: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
                      >
                        {SERIES_GROUPS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Price in Rupees (0 = Free)
                      <input
                        inputMode="numeric"
                        value={newSeriesDraft.priceInr}
                        onChange={(e) =>
                          setNewSeriesDraft({ ...newSeriesDraft, priceInr: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal tracking-normal outline-none focus:border-primary"
                      />
                    </label>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Price in Coins (0 = Free)
                      <input
                        inputMode="numeric"
                        value={newSeriesDraft.priceCoins}
                        onChange={(e) =>
                          setNewSeriesDraft({ ...newSeriesDraft, priceCoins: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal tracking-normal outline-none focus:border-primary"
                      />
                    </label>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full font-bold"
                        onClick={() =>
                          setNewSeriesDraft({
                            ...newSeriesDraft,
                            priceInr: "0",
                            priceCoins: "0",
                          })
                        }
                      >
                        Set Free (₹0 / 0 Coins)
                      </Button>
                    </div>
                  </div>

                  <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Summary shown to students
                    <input
                      value={newSeriesDraft.summary}
                      onChange={(e) =>
                        setNewSeriesDraft({ ...newSeriesDraft, summary: e.target.value })
                      }
                      className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
                    />
                  </label>

                  <div className="mt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Syllabus in Text Format (`Subject :: Chapter 1, Chapter 2, Chapter 3`)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SYLLABUS_PRESETS.map((preset) => (
                          <Button
                            key={preset.label}
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() =>
                              setNewSeriesDraft({
                                ...newSeriesDraft,
                                examTrack: preset.exam,
                                syllabusText: preset.text,
                              })
                            }
                          >
                            Load {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      rows={6}
                      value={newSeriesDraft.syllabusText}
                      onChange={(e) =>
                        setNewSeriesDraft({ ...newSeriesDraft, syllabusText: e.target.value })
                      }
                      placeholder="General Knowledge :: History of Punjab, Indian Polity, Geography&#10;Mathematics :: Number System, Percentage & Ratio, Mensuration"
                      className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-primary"
                    />
                    <p className="mt-1.5 text-xs font-semibold text-primary">
                      Parsed Live: {parsedNewPlan.length} Subjects · {parsedNewChapters} Chapters ·{" "}
                      {inr(parsedNewChapters * 60)} Auto-Generated Questions (60 MCQs/chapter)
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      disabled={createSeries.isPending || !newSeriesDraft.name.trim()}
                      className="font-bold"
                      onClick={() =>
                        createSeries.mutate({
                          data: {
                            name: newSeriesDraft.name.trim(),
                            examTrack: newSeriesDraft.examTrack.trim() || "Punjab ETT Cadre",
                            group: newSeriesDraft.group,
                            summary:
                              newSeriesDraft.summary.trim() ||
                              "Chapterwise practice tests generated from the official syllabus.",
                            priceInr: Math.max(0, Math.round(Number(newSeriesDraft.priceInr) || 0)),
                            priceCoins: Math.max(
                              0,
                              Math.round(Number(newSeriesDraft.priceCoins) || 0),
                            ),
                            syllabus_text: newSeriesDraft.syllabusText,
                          },
                        })
                      }
                    >
                      Create Series &amp; Auto-Generate Questions
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowAddSeries(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="surface-panel overflow-x-auto p-0">
              <table className="w-full min-w-[56rem] text-sm">
                <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="p-3">Series</th>
                    <th className="p-3">Exam</th>
                    <th className="p-3 text-right">Subjects</th>
                    <th className="p-3 text-right">Chapters</th>
                    <th className="p-3 text-right">Tests</th>
                    <th className="p-3 text-right">Pool</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Control</th>
                  </tr>
                </thead>
                <tbody>
                  {series.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">
                        Test series catalogue is completely empty (0 series). Use the{" "}
                        <strong className="text-foreground">
                          Create New Test Series with Text Syllabus
                        </strong>{" "}
                        builder above to add your own test series and auto-generate questions!
                      </td>
                    </tr>
                  ) : null}
                  {series
                    .filter((r) => hit(r.s.name) || hit(r.s.examTrack) || hit(r.s.id))
                    .map(({ s, totals: t, problems, hasCustomSyllabus, isAddedByAdmin }) => {
                      const o = overrides.get(s.id);
                      const displayName = o?.name ?? s.name;
                      return (
                        <Fragment key={s.id}>
                          <tr className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-3 font-semibold">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span>{displayName}</span>
                                {isAddedByAdmin ? (
                                  <Badge variant="default" className="rounded-full text-[10px]">
                                    Added
                                  </Badge>
                                ) : null}
                                {hasCustomSyllabus ? (
                                  <Badge
                                    variant="outline"
                                    className="rounded-full border-primary/50 text-[10px] text-primary"
                                  >
                                    Custom Syllabus
                                  </Badge>
                                ) : null}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="flex items-center gap-1.5">
                                {s.examTrack}
                                {recordedRules.has(s.examTrack) || hasCustomSyllabus ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                ) : null}
                              </span>
                            </td>
                            <td className="p-3 text-right tabular-nums">{t.subjects}</td>
                            <td className="p-3 text-right tabular-nums">{t.chapters}</td>
                            <td className="p-3 text-right tabular-nums">{t.tests}</td>
                            <td className="p-3 text-right tabular-nums">{inr(t.pool)}</td>
                            <td className="p-3">
                              {problems.length === 0 ? (
                                <Badge variant="secondary" className="rounded-full">
                                  {o?.enabled === false ? "Hidden" : "OK"}
                                </Badge>
                              ) : (
                                <span className="text-xs font-semibold text-destructive">
                                  {problems.join(" · ")}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button size="sm" variant="outline" onClick={() => openEditor(s)}>
                                  Fix Syllabus / Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  disabled={removeSeries.isPending}
                                  onClick={() => removeSeries.mutate(s.id)}
                                  title="Remove this test series"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {editing === s.id ? (
                            <tr>
                              <td colSpan={8} className="bg-muted/30 p-0">
                                <div className="surface-panel mt-4 p-5">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                      <p className="text-sm font-black">
                                        Editing &amp; Fixing Syllabus: {displayName} ({editing})
                                      </p>
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        Edit series details or fix its Subject &amp; Chapter
                                        syllabus in text format below. Questions are auto-generated
                                        (60 MCQs per chapter) from your syllabus.
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      disabled={removeSeries.isPending}
                                      onClick={() => removeSeries.mutate(s.id)}
                                    >
                                      <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove This Series
                                    </Button>
                                  </div>

                                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                      Series name
                                      <input
                                        value={draft.name}
                                        onChange={(e) =>
                                          setDraft({ ...draft, name: e.target.value })
                                        }
                                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
                                      />
                                    </label>

                                    <div className="grid grid-cols-2 gap-3">
                                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                        Price in rupees
                                        <input
                                          inputMode="numeric"
                                          value={draft.priceInr}
                                          onChange={(e) =>
                                            setDraft({ ...draft, priceInr: e.target.value })
                                          }
                                          className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal tracking-normal outline-none focus:border-primary"
                                        />
                                      </label>
                                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                        Price in coins
                                        <input
                                          inputMode="numeric"
                                          value={draft.priceCoins}
                                          onChange={(e) =>
                                            setDraft({ ...draft, priceCoins: e.target.value })
                                          }
                                          className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal tracking-normal outline-none focus:border-primary"
                                        />
                                      </label>
                                    </div>

                                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground sm:col-span-2">
                                      Summary shown to students
                                      <textarea
                                        rows={2}
                                        value={draft.summary}
                                        onChange={(e) =>
                                          setDraft({ ...draft, summary: e.target.value })
                                        }
                                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
                                      />
                                    </label>
                                  </div>

                                  <div className="mt-4 rounded-xl border border-primary/30 bg-primary/[0.04] p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div>
                                        <p className="text-xs font-black uppercase tracking-wide text-primary">
                                          Text Syllabus Editor (Subject :: Chapter 1, Chapter 2,
                                          Chapter 3)
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                          One subject per line, followed by `::` and comma-separated
                                          chapters. Auto-generates 60 questions (20 Easy → 20
                                          Moderate → 20 Difficult) per chapter.
                                        </p>
                                      </div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {SYLLABUS_PRESETS.map((preset) => (
                                          <Button
                                            key={preset.label}
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs"
                                            onClick={() =>
                                              setDraft({ ...draft, syllabusText: preset.text })
                                            }
                                          >
                                            {preset.label}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>

                                    <textarea
                                      rows={7}
                                      value={draft.syllabusText}
                                      onChange={(e) =>
                                        setDraft({ ...draft, syllabusText: e.target.value })
                                      }
                                      placeholder="Punjabi Language :: ਵਿਆਕਰਣ ਅਤੇ ਮੁਹਾਵਰੇ, ਸ਼ਬਦ ਬੋਧ, ਪੰਜਾਬੀ ਸਾਹਿਤ&#10;General Knowledge :: Punjab History & Culture, Indian Polity, Geography"
                                      className="mt-2 w-full rounded-lg border bg-background px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-primary"
                                    />

                                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                                      <span className="font-bold text-primary">
                                        Live Syllabus Preview: {parsedDraftPlan.length} Subjects ·{" "}
                                        {parsedDraftChapters} Chapters ·{" "}
                                        {inr(parsedDraftChapters * 60)} Auto-Generated MCQs
                                      </span>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs"
                                        onClick={() =>
                                          setDraft({
                                            ...draft,
                                            syllabusText: `${draft.syllabusText.trim()}\nNew Subject :: Chapter 1, Chapter 2, Chapter 3`,
                                          })
                                        }
                                      >
                                        + Add Subject Row
                                      </Button>
                                    </div>
                                  </div>

                                  <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
                                    <input
                                      type="checkbox"
                                      checked={draft.enabled}
                                      onChange={(e) =>
                                        setDraft({ ...draft, enabled: e.target.checked })
                                      }
                                      className="h-4 w-4"
                                    />
                                    Visible to students
                                  </label>

                                  <div className="mt-4 flex flex-wrap gap-2">
                                    <Button
                                      disabled={saveSyllabus.isPending || save.isPending}
                                      className="font-bold"
                                      onClick={() =>
                                        saveSyllabus.mutate({
                                          data: {
                                            series_id: editing,
                                            syllabus_text: draft.syllabusText,
                                            enabled: draft.enabled,
                                            name: draft.name.trim() || null,
                                            summary: draft.summary.trim() || null,
                                            price_inr:
                                              draft.priceInr.trim() === ""
                                                ? null
                                                : Math.max(
                                                    0,
                                                    Math.round(Number(draft.priceInr) || 0),
                                                  ),
                                            price_coins:
                                              draft.priceCoins.trim() === ""
                                                ? null
                                                : Math.max(
                                                    0,
                                                    Math.round(Number(draft.priceCoins) || 0),
                                                  ),
                                          },
                                        })
                                      }
                                    >
                                      Save Series &amp; Syllabus (Auto-Generate Questions)
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      disabled={saveSyllabus.isPending || save.isPending}
                                      onClick={() => {
                                        setDraft({ ...draft, priceInr: "0", priceCoins: "0" });
                                        saveSyllabus.mutate({
                                          data: {
                                            series_id: editing,
                                            syllabus_text: draft.syllabusText,
                                            enabled: draft.enabled,
                                            name: draft.name.trim() || null,
                                            summary: draft.summary.trim() || null,
                                            price_inr: 0,
                                            price_coins: 0,
                                          },
                                        });
                                      }}
                                    >
                                      Make Free (₹0)
                                    </Button>
                                    <Button
                                      variant="outline"
                                      disabled={reset.isPending}
                                      onClick={() => reset.mutate(editing)}
                                    >
                                      Revert to built-in
                                    </Button>
                                    <Button variant="ghost" onClick={() => setEditing(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {removedBuiltInSeries.length > 0 ? (
              <div className="surface-panel p-5">
                <p className="text-sm font-black">
                  Removed Test Series ({removedBuiltInSeries.length})
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  These built-in series were removed by Admin and are hidden from students. You can
                  restore any of them with one click.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {removedBuiltInSeries.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-semibold"
                    >
                      <span>
                        {item.name} ({item.examTrack})
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 rounded-full px-2.5 text-xs"
                        disabled={restoreSeries.isPending}
                        onClick={() => restoreSeries.mutate(item.id)}
                      >
                        <RotateCcw className="mr-1 h-3 w-3" /> Restore
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "subjects" ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...bank.subjects]
              .filter(([name]) => hit(name))
              .sort((a, b) => b[1].size - a[1].size)
              .map(([name, topics]) => (
                <div key={name} className="surface-panel p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-bold">{name}</p>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {topics.size} ch
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {[...topics].sort().join(" · ")}
                  </p>
                </div>
              ))}
          </div>
        ) : null}

        {tab === "quality" && qualityReport ? (
          <div className="mt-4 space-y-4">
            <div className="surface-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-black">Question quality control</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Deterministic sample audit across every template. This is a structural safety
                    gate, not a replacement for expert subject review.
                  </p>
                </div>
                <Badge
                  variant={
                    qualityReport.invalid === 0 && qualityReport.duplicatePrompts === 0
                      ? "secondary"
                      : "destructive"
                  }
                  className="rounded-full"
                >
                  {qualityReport.invalid === 0 && qualityReport.duplicatePrompts === 0
                    ? "PASS"
                    : "REVIEW REQUIRED"}
                </Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Stat icon={Database} label="Templates" value={inr(qualityReport.templates)} />
                <Stat icon={Search} label="Questions sampled" value={inr(qualityReport.sampled)} />
                <Stat
                  icon={CheckCircle2}
                  label="Publishable"
                  value={inr(qualityReport.publishable)}
                  tone="ok"
                />
                <Stat
                  icon={AlertTriangle}
                  label="Invalid samples"
                  value={inr(qualityReport.invalid)}
                  tone={qualityReport.invalid ? "bad" : "ok"}
                />
                <Stat
                  icon={Layers}
                  label="Duplicate prompts"
                  value={inr(qualityReport.duplicatePrompts)}
                  tone={qualityReport.duplicatePrompts ? "bad" : "ok"}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {(
                Object.entries(qualityReport.byDifficulty) as Array<
                  [string, { templates: number; sampled: number; invalid: number }]
                >
              ).map(([level, value]) => (
                <div key={level} className="surface-panel p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-black">{level}</p>
                    <Badge variant="outline" className="rounded-full">
                      {value.templates} templates
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sampled {value.sampled} · Invalid {value.invalid}
                  </p>
                </div>
              ))}
            </div>

            {qualityReport.issues.length ? (
              <div className="surface-panel overflow-x-auto p-0">
                <div className="border-b p-4 font-black">Issues requiring review</div>
                <table className="w-full min-w-[50rem] text-sm">
                  <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="p-3">Template</th>
                      <th className="p-3">Subject / topic</th>
                      <th className="p-3">Level</th>
                      <th className="p-3">Index</th>
                      <th className="p-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualityReport.issues.map((issue, i) => (
                      <tr
                        key={`${issue.templateId}-${issue.index}-${i}`}
                        className="border-b last:border-0"
                      >
                        <td className="p-3 font-semibold">{issue.templateId}</td>
                        <td className="p-3">
                          {issue.subject} · {issue.topic}
                        </td>
                        <td className="p-3">{issue.difficulty}</td>
                        <td className="p-3 tabular-nums">{issue.index}</td>
                        <td className="p-3 text-destructive">{issue.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="surface-panel flex items-center gap-3 p-5 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>
                  <strong>No structural quality failures found in the deterministic sample.</strong>{" "}
                  Expert subject review should still be used before publishing newly authored
                  factual material.
                </span>
              </div>
            )}
          </div>
        ) : null}

        {tab === "syllabus" ? (
          <div className="mt-4 space-y-3">
            {OFFICIAL_SYLLABUS_RULES.filter((r) => hit(r.exam) || hit(r.body)).map((r) => (
              <div key={r.exam} className="surface-panel p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-black">{r.exam}</p>
                  <Badge variant="secondary" className="rounded-full text-[11px]">
                    Rule date {r.verified} · academic review required
                  </Badge>
                </div>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">{r.body}</p>
                <p className="mt-2 break-words text-xs text-primary">{r.source}</p>
                {r.excludeSubjects?.length ? (
                  <p className="mt-2 text-xs">
                    <span className="font-bold">Subjects excluded:</span>{" "}
                    {r.excludeSubjects.join(", ")}
                  </p>
                ) : null}
                {r.excludeTopics?.length ? (
                  <p className="mt-1 text-xs">
                    <span className="font-bold">Chapters excluded:</span>{" "}
                    {r.excludeTopics.join(", ")}
                  </p>
                ) : null}
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.note}</p>
              </div>
            ))}
          </div>
        ) : null}

        {/* Offline payments. One grant opens a whole series for one student,
            with an optional expiry, and renewing extends it. */}
        <div className="surface-panel mt-6 p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="text-base font-black">Give a student access after an offline payment</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            The student must already have an account, because access is attached to their login.
            Leave validity blank for lifetime. Granting the same student again renews them.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Series
              <select
                value={grantFor}
                onChange={(e) => setGrantFor(e.target.value)}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
              >
                <option value="">Choose a series</option>
                {activePaidSeries.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Student email
              <input
                value={gEmail}
                onChange={(e) => setGEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
              />
            </label>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Paid by
              <input
                value={gMethod}
                onChange={(e) => setGMethod(e.target.value)}
                placeholder="cash, upi, bank transfer"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
              />
            </label>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Amount collected
              <input
                inputMode="numeric"
                value={gAmount}
                onChange={(e) => setGAmount(e.target.value)}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal tracking-normal outline-none focus:border-primary"
              />
            </label>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Validity in days
              <input
                inputMode="numeric"
                value={gDays}
                onChange={(e) => setGDays(e.target.value)}
                placeholder="Blank = lifetime"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal tracking-normal outline-none focus:border-primary"
              />
            </label>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Receipt or note
              <input
                value={gNote}
                onChange={(e) => setGNote(e.target.value)}
                placeholder="Receipt 1042"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
              />
            </label>
          </div>

          <Button
            className="mt-4 font-bold"
            disabled={!grantFor || !gEmail.trim() || grant.isPending}
            onClick={() =>
              grant.mutate({
                data: {
                  series_id: grantFor,
                  email: gEmail.trim(),
                  method: gMethod,
                  amount_inr: Number(gAmount || 0),
                  note: gNote.trim(),
                  valid_days: Number(gDays || 0),
                },
              })
            }
          >
            Grant access
          </Button>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {liveGrants.length} student{liveGrants.length === 1 ? "" : "s"} with open series access
          </p>
          <ul className="mt-2 space-y-1.5">
            {liveGrants.map((g) => {
              const s = PAID_TEST_SERIES.find((x) => x.id === g.series_id);
              const left = g.expires_at
                ? Math.ceil((new Date(g.expires_at).getTime() - Date.now()) / 86_400_000)
                : null;
              return (
                <li
                  key={g.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs"
                >
                  <span className="min-w-0">
                    <span className="font-bold">{s?.name ?? g.series_id}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {g.method}
                      {g.amount_inr > 0 ? ` · ₹${g.amount_inr}` : ""}
                      {g.note ? ` · ${g.note}` : ""}
                      {left === null
                        ? " · lifetime"
                        : left > 0
                          ? ` · ${left} day${left === 1 ? "" : "s"} left`
                          : " · expired"}
                    </span>
                  </span>
                  <Button size="sm" variant="outline" onClick={() => revoke.mutate(g.id)}>
                    Withdraw
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          These figures are computed from the bank at page load, so they can never drift from what
          students actually receive. Adding a subject, chapter or series is still a code change —
          use{" "}
          <Link to="/admin/tests" className="font-semibold text-primary">
            Write test questions
          </Link>{" "}
          to author your own tests inside the app.
        </p>
      </section>
    </SiteLayout>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Database;
  label: string;
  value: string;
  tone?: "ok" | "bad";
}) {
  return (
    <div className="surface-panel p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Icon
          className={`h-4 w-4 ${tone === "bad" ? "text-destructive" : tone === "ok" ? "text-primary" : ""}`}
        />
        {label}
      </div>
      <p className="mt-2 text-2xl font-black tabular-nums">{value}</p>
    </div>
  );
}
