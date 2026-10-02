import { Fragment, useEffect, useMemo, useState } from "react";
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
  Search,
  ShieldCheck,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ALL_TEMPLATES, EXAM_BANK_TOTAL, OFFICIAL_SYLLABUS_TAGS_REMOVED } from "@/lib/exam-bank";
import { OFFICIAL_SYLLABUS_RULES } from "@/lib/exam-bank/official-syllabus";
import { auditQuestionBank } from "@/lib/exam-bank/quality-audit";
import {
  adminListSeriesOverrides,
  adminResetSeriesOverride,
  adminSaveSeriesOverride,
} from "@/lib/admin.functions";
import {
  adminGrantSeriesAccess,
  adminListSeriesGrants,
  adminRevokeSeriesAccess,
} from "@/lib/test-access.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import {
  PAID_TEST_SERIES,
  THEORY_TEST_SERIES,
  seriesPlan,
  seriesTotals,
} from "@/lib/test-series-catalog";
import {
  adminDeleteSeriesSyllabus,
  adminListSeriesSyllabi,
  adminSaveSeriesSyllabus,
} from "@/lib/test-series-syllabus.functions";
import {
  bankSubjectsForExam,
  bankTopicsForExam,
  countSyllabusMatches,
  createBankSyllabus,
  isTestSeriesSyllabus,
  mapSyllabusToBank,
  parseSyllabusOutline,
  type TestSeriesSyllabus,
} from "@/lib/test-series-syllabus";

export const Route = createFileRoute("/_authenticated/admin/exam-bank")({
  component: AdminExamBankPage,
});

const inr = (n: number) => n.toLocaleString("en-IN");

function formatSyllabusOutline(syllabus: TestSeriesSyllabus) {
  return syllabus.subjects
    .map(
      (subject) =>
        `Subject: ${subject.name}\n${subject.chapters
          .map(
            (chapter) =>
              `  Chapter: ${chapter.name}\n${chapter.topics.map((topic) => `    Topic: ${topic.name}`).join("\n")}`,
          )
          .join("\n")}`,
    )
    .join("\n");
}

function AdminExamBankPage() {
  const [tab, setTab] = useState<"series" | "builder" | "subjects" | "syllabus" | "quality">(
    "series",
  );
  const [blueprintSeriesId, setBlueprintSeriesId] = useState("ppsc-pcs");
  const [outlineText, setOutlineText] = useState("");
  const [blueprint, setBlueprint] = useState<TestSeriesSyllabus | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
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
  });

  const qc = useQueryClient();
  const listOverrides = useServerFn(adminListSeriesOverrides);
  const saveOverride = useServerFn(adminSaveSeriesOverride);
  const resetOverride = useServerFn(adminResetSeriesOverride);
  const listGrants = useServerFn(adminListSeriesGrants);
  const grantSeries = useServerFn(adminGrantSeriesAccess);
  const revokeSeries = useServerFn(adminRevokeSeriesAccess);
  const listSyllabi = useServerFn(adminListSeriesSyllabi);
  const saveSyllabusFn = useServerFn(adminSaveSeriesSyllabus);
  const deleteSyllabusFn = useServerFn(adminDeleteSeriesSyllabus);

  const syllabiQuery = useQuery({
    queryKey: ["admin", "series-syllabi"],
    queryFn: () => listSyllabi(),
  });
  const savedSyllabus = (syllabiQuery.data ?? []).find(
    (row) => row.series_id === blueprintSeriesId,
  );
  useEffect(() => {
    setParseErrors([]);
    if (savedSyllabus && isTestSeriesSyllabus(savedSyllabus.syllabus)) {
      const savedOutline = savedSyllabus.syllabus as unknown as TestSeriesSyllabus;
      setBlueprint(savedOutline);
      setOutlineText(formatSyllabusOutline(savedOutline));
    } else {
      setBlueprint(null);
      setOutlineText("");
    }
  }, [blueprintSeriesId, savedSyllabus]);

  const grantsQuery = useQuery({
    queryKey: ["admin", "series-grants"],
    queryFn: () => safeServerCall(() => listGrants({} as never), []),
  });
  const grant = useMutation({
    mutationFn: (input: Parameters<typeof adminGrantSeriesAccess>[0]) => grantSeries(input),
    onSuccess: (r) => {
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
      toast.success("Series updated");
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["admin", "series-overrides"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const reset = useMutation({
    mutationFn: (series_id: string) => resetOverride({ data: { series_id } } as never),
    onSuccess: () => {
      toast.success("Reverted to the built-in values");
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["admin", "series-overrides"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const saveSyllabus = useMutation({
    mutationFn: (status: "draft" | "published") => {
      if (!blueprint) throw new Error("Parse an outline before saving it.");
      const series = PAID_TEST_SERIES.find((item) => item.id === blueprintSeriesId);
      if (!series) throw new Error("Choose a catalogue series first.");
      return saveSyllabusFn({
        data: {
          series_id: blueprintSeriesId,
          exam_track: series.examTrack,
          syllabus: blueprint,
          status,
        },
      } as never);
    },
    onSuccess: (_result, status) => {
      toast.success(status === "published" ? "Syllabus published to students" : "Draft saved");
      void qc.invalidateQueries({ queryKey: ["admin", "series-syllabi"] });
      void qc.invalidateQueries({ queryKey: ["public", "series-syllabi"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const deleteSyllabus = useMutation({
    mutationFn: () => deleteSyllabusFn({ data: { series_id: blueprintSeriesId } } as never),
    onSuccess: () => {
      toast.success(
        "Custom syllabus removed; students will see the built-in question-bank outline",
      );
      setBlueprint(null);
      setOutlineText("");
      void qc.invalidateQueries({ queryKey: ["admin", "series-syllabi"] });
      void qc.invalidateQueries({ queryKey: ["public", "series-syllabi"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function parseOutline() {
    const result = parseSyllabusOutline(outlineText);
    setParseErrors(result.errors);
    if (result.errors.length) {
      setBlueprint(null);
      toast.error("Fix the outline structure before generating tests");
      return;
    }
    const series = PAID_TEST_SERIES.find((item) => item.id === blueprintSeriesId);
    const mapped = mapSyllabusToBank(result.syllabus, series?.examTrack ?? "All Exams");
    setBlueprint(mapped);
    toast.success("Outline parsed; review the exact question-bank mappings below");
  }

  function loadBuiltInOutline() {
    const series = PAID_TEST_SERIES.find((item) => item.id === blueprintSeriesId);
    if (!series) return;
    const next = createBankSyllabus(
      series.examTrack,
      seriesPlan(series).map((item) => item.subject),
    );
    setBlueprint(next);
    setOutlineText(formatSyllabusOutline(next));
    setParseErrors([]);
  }

  function updateSubjectMapping(index: number, bank_subject: string) {
    setBlueprint((current) => {
      if (!current) return current;
      const subjects = current.subjects.map((item, i) =>
        i === index
          ? {
              ...item,
              bank_subject,
              chapters: item.chapters.map((chapter) => ({
                ...chapter,
                topics: chapter.topics.map((topic) => ({ ...topic, bank_topic: "" })),
              })),
            }
          : item,
      );
      return { subjects };
    });
  }

  function updateTopicMapping(
    subjectIndex: number,
    chapterIndex: number,
    topicIndex: number,
    bank_topic: string,
  ) {
    setBlueprint((current) => {
      if (!current) return current;
      const subjects = current.subjects.map((subject, i) =>
        i === subjectIndex
          ? {
              ...subject,
              chapters: subject.chapters.map((chapter, j) =>
                j === chapterIndex
                  ? {
                      ...chapter,
                      topics: chapter.topics.map((topic, k) =>
                        k === topicIndex ? { ...topic, bank_topic } : topic,
                      ),
                    }
                  : chapter,
              ),
            }
          : subject,
      );
      return { subjects };
    });
  }

  function openEditor(id: string, name: string, summary: string, inr: number, coins: number) {
    const o = overrides.get(id);
    setEditing(id);
    setDraft({
      name: o?.name ?? name,
      summary: o?.summary ?? summary,
      priceInr: String(o?.price_inr ?? inr),
      priceCoins: String(o?.price_coins ?? coins),
      enabled: o?.enabled ?? true,
    });
  }

  /** Everything below is computed from the live bank, not from a stored copy. */
  const bank = useMemo(() => {
    const subjects = new Map<string, Set<string>>();
    const examTags = new Set<string>();
    for (const t of ALL_TEMPLATES) {
      if (!subjects.has(t.subject)) subjects.set(t.subject, new Set());
      subjects.get(t.subject)!.add(t.topic);
      for (const e of t.exams) examTags.add(e);
    }
    let chapters = 0;
    for (const v of subjects.values()) chapters += v.size;
    return { subjects, chapters, examTags };
  }, []);

  const series = useMemo(
    () =>
      PAID_TEST_SERIES.map((s) => {
        const totals = seriesTotals(s);
        const plan = seriesPlan(s);
        const missing = s.subjects.filter((x) => !bank.subjects.has(x));
        const empty = plan
          .filter((p) => !p.chapters || p.chapters.length === 0)
          .map((p) => p.subject);
        const problems: string[] = [];
        if (missing.length) problems.push(`subject not in bank: ${missing.join(", ")}`);
        if (empty.length) problems.push(`no chapters resolve: ${empty.join(", ")}`);
        if (totals.chapters === 0) problems.push("zero chapters");
        if (totals.tests === 0) problems.push("zero tests");
        if (totals.pool < 5000) problems.push(`pool ${inr(totals.pool)} below 5,000`);
        if (totals.pool > 250000) problems.push(`pool ${inr(totals.pool)} above 250,000`);
        return { s, totals, problems };
      }),
    [bank.subjects],
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
  const qualityReport = useMemo(() => auditQuestionBank(), []);
  const verified = new Set(OFFICIAL_SYLLABUS_RULES.map((r) => r.exam));
  const term = query.trim().toLowerCase();
  const hit = (s: string) => !term || s.toLowerCase().includes(term);
  const selectedBlueprintSeries = PAID_TEST_SERIES.find((item) => item.id === blueprintSeriesId);
  const blueprintMatches = useMemo(
    () =>
      blueprint && selectedBlueprintSeries
        ? countSyllabusMatches(blueprint, selectedBlueprintSeries.examTrack)
        : null,
    [blueprint, selectedBlueprintSeries],
  );
  const blueprintTotals = useMemo(() => {
    if (!blueprint) return { subjects: 0, chapters: 0, topics: 0, tests: 0 };
    const subjects = blueprint.subjects.length;
    const chapters = blueprint.subjects.reduce((sum, item) => sum + item.chapters.length, 0);
    const topics = blueprint.subjects.reduce(
      (sum, item) =>
        sum + item.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.topics.length, 0),
      0,
    );
    return { subjects, chapters, topics, tests: subjects + chapters + topics + 5 };
  }, [blueprint]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin"
        title="Exam bank and syllabus"
        description="Review live question-bank coverage, edit series details, and paste, map, review and publish subject → chapter → topic syllabi for students."
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
            value={`${PAID_TEST_SERIES.length} / ${THEORY_TEST_SERIES.length}`}
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
          {(["series", "builder", "subjects", "syllabus", "quality"] as const).map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t)}
              className="font-semibold capitalize"
            >
              {t === "series"
                ? "Test series"
                : t === "builder"
                  ? "Paste & build syllabus"
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
          <div className="surface-panel mt-4 overflow-x-auto p-0">
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
                {series
                  .filter((r) => hit(r.s.name) || hit(r.s.examTrack) || hit(r.s.id))
                  .map(({ s, totals: t, problems }) => (
                    <Fragment key={s.id}>
                      <tr className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-3 font-semibold">{s.name}</td>
                        <td className="p-3">
                          <span className="flex items-center gap-1.5">
                            {s.examTrack}
                            {verified.has(s.examTrack) ? (
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
                              {overrides.get(s.id)?.enabled === false ? "Hidden" : "OK"}
                            </Badge>
                          ) : (
                            <span className="text-xs font-semibold text-destructive">
                              {problems.join(" · ")}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              openEditor(s.id, s.name, s.summary, s.priceInr, s.priceCoins)
                            }
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                      {editing === s.id ? (
                        <tr>
                          <td colSpan={8} className="bg-muted/30 p-0">
                            <div className="surface-panel mt-4 p-5">
                              <p className="text-sm font-black">Editing {editing}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Save stores an override. Revert deletes it and the series goes back
                                to exactly what the app ships with.
                              </p>

                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                  Series name
                                  <input
                                    value={draft.name}
                                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
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
                                    rows={3}
                                    value={draft.summary}
                                    onChange={(e) =>
                                      setDraft({ ...draft, summary: e.target.value })
                                    }
                                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary"
                                  />
                                </label>
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
                                  disabled={save.isPending}
                                  className="font-bold"
                                  onClick={() =>
                                    save.mutate({
                                      data: {
                                        series_id: editing,
                                        enabled: draft.enabled,
                                        name: draft.name.trim() || null,
                                        summary: draft.summary.trim() || null,
                                        price_inr: Number(draft.priceInr) || null,
                                        price_coins: Number(draft.priceCoins) || null,
                                      },
                                    })
                                  }
                                >
                                  Save
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
                  ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {tab === "builder" ? (
          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
            <div className="surface-panel space-y-5 p-5">
              <div>
                <h2 className="text-lg font-black">Paste a complete syllabus outline</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Use one subject per top-level line, chapters indented two spaces, and topics
                  indented four spaces. Explicit Subject:, Chapter: and Topic: labels are supported.
                  The builder maps every topic to an exact question-bank tag; it never invents or
                  substitutes questions.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Test series
                  <select
                    value={blueprintSeriesId}
                    onChange={(event) => setBlueprintSeriesId(event.target.value)}
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal"
                  >
                    {PAID_TEST_SERIES.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} · {item.examTrack}
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="button" variant="outline" onClick={loadBuiltInOutline}>
                  Load current bank outline
                </Button>
              </div>

              <div>
                <Textarea
                  rows={12}
                  value={outlineText}
                  onChange={(event) => setOutlineText(event.target.value)}
                  placeholder={
                    "Subject: Punjab GK\n  Chapter: Punjab at a glance\n    Topic: Districts and Headquarters\n    Topic: Folk Dances and Fairs"
                  }
                  className="font-mono text-sm"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" onClick={parseOutline}>
                    Generate structure & match bank
                  </Button>
                  {savedSyllabus && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => deleteSyllabus.mutate()}
                      disabled={deleteSyllabus.isPending}
                    >
                      Remove custom syllabus
                    </Button>
                  )}
                </div>
              </div>

              {parseErrors.length > 0 && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
                  <p className="font-bold text-destructive">
                    Fix this outline before generating tests
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                    {parseErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {blueprint && selectedBlueprintSeries && blueprintMatches && (
                <div className="space-y-4">
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold">Review generated test structure</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Exam track: {selectedBlueprintSeries.examTrack} ·{" "}
                          {blueprintTotals.subjects} subjects · {blueprintTotals.chapters} chapters
                          · {blueprintTotals.topics} topic tests · {blueprintTotals.tests} total
                          test entry points
                        </p>
                      </div>
                      <Badge
                        variant={
                          blueprintMatches.missingSubjects.length +
                            blueprintMatches.missingTopics.length ===
                          0
                            ? "secondary"
                            : "destructive"
                        }
                        className="rounded-full"
                      >
                        {blueprintMatches.mappedTopics}/{blueprintMatches.totalTopics} topics mapped
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {inr(blueprintMatches.questionPositions)} bank question positions match this
                      outline. This is a raw pool estimate, not a promise that every requested test
                      size has enough publishable questions. The test runner blocks short papers
                      rather than padding them.
                    </p>
                  </div>

                  {blueprint.subjects.map((subject, subjectIndex) => (
                    <div key={`${subject.name}-${subjectIndex}`} className="rounded-2xl border p-4">
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,0.8fr)] sm:items-center">
                        <div>
                          <p className="font-bold">{subject.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {subject.chapters.length} chapters · maps to the verified bank subject
                          </p>
                        </div>
                        <select
                          value={subject.bank_subject}
                          onChange={(event) =>
                            updateSubjectMapping(subjectIndex, event.target.value)
                          }
                          className="rounded-lg border bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Choose bank subject</option>
                          {bankSubjectsForExam(selectedBlueprintSeries.examTrack).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-3 space-y-3">
                        {subject.chapters.map((chapter, chapterIndex) => (
                          <div
                            key={`${chapter.name}-${chapterIndex}`}
                            className="rounded-xl bg-muted/30 p-3"
                          >
                            <p className="text-sm font-semibold">{chapter.name}</p>
                            <div className="mt-2 space-y-2">
                              {chapter.topics.map((topic, topicIndex) => (
                                <div
                                  key={`${topic.name}-${topicIndex}`}
                                  className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,0.8fr)] sm:items-center"
                                >
                                  <p className="text-xs text-muted-foreground">
                                    Topic test: {topic.name}
                                  </p>
                                  <select
                                    value={topic.bank_topic}
                                    onChange={(event) =>
                                      updateTopicMapping(
                                        subjectIndex,
                                        chapterIndex,
                                        topicIndex,
                                        event.target.value,
                                      )
                                    }
                                    className="rounded-lg border bg-background px-3 py-2 text-sm"
                                  >
                                    <option value="">Choose exact bank topic</option>
                                    {bankTopicsForExam(
                                      selectedBlueprintSeries.examTrack,
                                      subject.bank_subject,
                                    ).map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => saveSyllabus.mutate("draft")}
                      disabled={saveSyllabus.isPending}
                    >
                      Save draft for review
                    </Button>
                    <Button
                      type="button"
                      onClick={() => saveSyllabus.mutate("published")}
                      disabled={
                        saveSyllabus.isPending ||
                        blueprintMatches.missingSubjects.length > 0 ||
                        blueprintMatches.missingTopics.length > 0
                      }
                    >
                      Publish syllabus to students
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="surface-panel p-5">
                <h3 className="font-black">Saved syllabus versions</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Drafts are admin-only. Published outlines drive Start Learning for enrolled
                  students; removing one restores the built-in bank outline.
                </p>
                <div className="mt-4 space-y-2">
                  {(syllabiQuery.data ?? []).map((row) => {
                    const series = PAID_TEST_SERIES.find((item) => item.id === row.series_id);
                    return (
                      <button
                        key={row.series_id}
                        type="button"
                        onClick={() => setBlueprintSeriesId(row.series_id)}
                        className={`w-full rounded-xl border p-3 text-left transition hover:border-primary/50 ${row.series_id === blueprintSeriesId ? "border-primary/50 bg-primary/5" : "bg-background"}`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold">
                            {series?.name ?? row.series_id}
                          </span>
                          <Badge
                            variant={row.status === "published" ? "secondary" : "outline"}
                            className="shrink-0 rounded-full text-[10px]"
                          >
                            {row.status}
                          </Badge>
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {row.exam_track}
                        </span>
                      </button>
                    );
                  })}
                  {!syllabiQuery.data?.length && (
                    <p className="rounded-xl border border-dashed p-4 text-xs text-muted-foreground">
                      No saved syllabi yet. The sandbox includes one editable published demo.
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link to="/admin/tests">Review test editor</Link>
                </Button>
              </div>
              <div className="surface-panel p-5 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="mt-2 font-bold">Honest coverage</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Every published topic must map to an existing exact exam-bank subject and topic.
                  Chapter and subject papers combine only mapped bank tags. Generated questions are
                  fresh per attempt and are not saved as question rows.
                </p>
              </div>
            </aside>
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

        {tab === "quality" ? (
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
                    checked {r.verified}
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
            Leave validity blank for lifetime. Granting the same student again renews them. In the
            local sandbox, use <strong>sandbox-admin@preview.invalid</strong> to test grants.
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
                {PAID_TEST_SERIES.map((s) => (
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
          The built-in bank and its 66 old-NCERT templates remain unchanged. Use “Paste & build
          syllabus” to edit the published subject/chapter/topic outline for an existing series, and
          use{" "}
          <Link to="/admin/tests" className="font-semibold text-primary">
            Write test questions
          </Link>{" "}
          for separately authored tests. Generated coverage stays strict; unavailable bank questions
          are reported rather than padded.
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
