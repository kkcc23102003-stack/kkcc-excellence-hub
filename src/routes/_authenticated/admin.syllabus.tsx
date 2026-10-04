import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  BookOpen,
  Sparkles,
  Wand2,
  Download,
  Search,
  CheckCircle2,
  Layers,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { AdminCommandBar } from "@/components/kkcc/admin-command-bar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  autoCreateChapterTestsFromSyllabus,
  listSyllabus,
  parseSyllabusText,
  replaceSyllabus,
  syllabusNodesToRows,
} from "@/lib/syllabus.functions";

export const Route = createFileRoute("/_authenticated/admin/syllabus")({
  head: () => ({
    meta: [
      { title: "Admin — Syllabus Auto Builder | KKCC" },
      {
        name: "description",
        content:
          "Convert pasted syllabus text into structured Subject, Chapter and Topic nodes and auto-generate chapterwise tests.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SyllabusAdmin,
});

const SYLLABUS_TEMPLATES: { id: string; label: string; exam: string; content: string }[] = [
  {
    id: "punjab-ett-complete",
    label: "Punjab ETT / PSSSB Complete (Punjabi, Polity, GK, CDP)",
    exam: "Punjab ETT Cadre",
    content: `Subject: Punjabi
Chapter 1 - ਗੁਰਮੁਖੀ ਲਿਪੀ ਅਤੇ ਧੁਨੀ ਬੋਧ
ਵਰਣਮਾਲਾ, ਲਗਾਂ-ਮਾਤਰਾਵਾਂ ਅਤੇ ਲਗਾਖਰ
ਸ਼ਬਦ ਬੋਧ, ਨਾਂਵ, ਪੜਨਾਂਵ ਅਤੇ ਵਿਸ਼ੇਸ਼ਣ

Chapter 2 - ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਅਤੇ ਮੁਹਾਵਰੇ
ਮੁਹਾਵਰੇ ਅਤੇ ਅਖਾਣ
ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ

Chapter 3 - ਪੰਜਾਬੀ ਸਾਹਿਤ ਅਤੇ ਸੱਭਿਆਚਾਰ
ਗੁਰਮਤਿ ਕਾਵਿ, ਸੂਫ਼ੀ ਕਾਵਿ ਅਤੇ ਕਿੱਸਾ ਕਾਵਿ
ਪੰਜਾਬ ਦੇ ਲੋਕ ਨਾਚ, ਮੇਲੇ ਅਤੇ ਤਿਉਹਾਰ

Subject: Polity
Chapter 1 - Preamble & Constitutional Framework
Preamble of the Indian Constitution
Fundamental Rights & Fundamental Duties

Subject: Punjab GK
Chapter 1 - History & Geography of Punjab
Sikh Gurus, Misls & Maharaja Ranjit Singh
Rivers, Doabs & Agriculture of Punjab

Subject: Child Development and Pedagogy
Chapter 1 - Growth, Development & Learning Theories
Piaget, Vygotsky & Kohlberg Theories
Inclusive Education & RTE Act 2009`,
  },
  {
    id: "class10-science",
    label: "Class 10 Science (CBSE/PSEB)",
    exam: "CBSE Class 9-10",
    content: `Subject: Science
Chapter 1 - Chemical Reactions and Equations
Chemical Equations & Balancing
Types of Chemical Reactions
Oxidation, Reduction & Corrosion

Chapter 2 - Acids, Bases and Salts
Indicators & pH Scale
Chemical Properties of Acids and Bases
Important Salts (Baking Soda, Washing Soda, Plaster of Paris)

Chapter 3 - Life Processes
Autotrophic & Heterotrophic Nutrition
Human Respiratory System
Transportation in Humans & Plants
Excretion in Humans

Chapter 4 - Light: Reflection and Refraction
Spherical Mirrors & Mirror Formula
Refraction of Light & Snell's Law
Lenses, Power of Lens & Ray Diagrams`,
  },
  {
    id: "neet-ug",
    label: "NEET UG (Bio / Phys / Chem)",
    exam: "NEET",
    content: `Subject: Biology
Chapter 1 - Cell: The Unit of Life
Prokaryotic & Eukaryotic Cells
Cell Membrane & Organelles
Chromosomes & Cell Cycle

Chapter 2 - Human Physiology
Breathing and Exchange of Gases
Body Fluids and Circulation
Neural Control and Coordination

Subject: Physics
Chapter 1 - Laws of Motion
Newton's Laws & Impulse
Friction & Circular Motion

Subject: Chemistry
Chapter 1 - Chemical Bonding
VSEPR Theory & Hybridisation
Molecular Orbital Theory & Hydrogen Bonding`,
  },
  {
    id: "punjab-exams",
    label: "Punjab Exams (PSSSB / Patwari / Police)",
    exam: "PSSSB",
    content: `Subject: Punjab GK & History
Chapter 1 - Guru Period & Sikh History
Ten Sikh Gurus & Teachings
Banda Singh Bahadur & Sikh Misls
Maharaja Ranjit Singh Administration

Chapter 2 - Geography & Culture of Punjab
Rivers, Doabs & Agro-Climatic Zones
Folk Dances, Fairs & Festivals
Punjabi Literature & Sahitya Akademi Winners

Subject: Quantitative Aptitude
Chapter 1 - Arithmetic & Mensuration
Percentage, Profit & Loss
Ratio, Time & Work
2D & 3D Mensuration for Patwari

Subject: Punjabi Grammar
Chapter 1 - ਵਿਆਕਰਣ (Punjabi Vyakaran)
ਨਾਂਵ, ਪੜਨਾਂਵ ਅਤੇ ਵਿਸ਼ੇਸ਼ਣ
ਮੁਹਾਵਰੇ ਅਤੇ ਅਖਾਣ`,
  },
  {
    id: "ssc-banking",
    label: "SSC CGL & Banking Foundation",
    exam: "SSC",
    content: `Subject: Quantitative Aptitude
Chapter 1 - Number System & Algebra
Divisibility, Remainder Theorem & HCF/LCM
Algebraic Identities & Surds

Chapter 2 - Commercial Maths
Simple & Compound Interest
Time, Speed & Distance

Subject: Reasoning Ability
Chapter 1 - Verbal & Analytical Reasoning
Syllogism & Blood Relations
Coding-Decoding & Number Series
Seating Arrangement & Puzzles

Subject: General Studies
Chapter 1 - Indian Polity
Fundamental Rights & Duties
Parliament, President & Judiciary`,
  },
];

function SyllabusAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listSyllabus);
  const replace = useServerFn(replaceSyllabus);
  const autoCreateTests = useServerFn(autoCreateChapterTestsFromSyllabus);

  const [raw, setRaw] = useState(SYLLABUS_TEMPLATES[0]!.content);
  const [examTrack, setExamTrack] = useState("CBSE Class 9-10");
  const [previewSearch, setPreviewSearch] = useState("");
  const [hydratedFromSaved, setHydratedFromSaved] = useState(false);

  const current = useQuery({
    queryKey: ["admin", "syllabus"],
    queryFn: () => list(),
    retry: false,
  });

  useEffect(() => {
    if (!hydratedFromSaved && current.data && current.data.length > 0) {
      const savedRows = syllabusNodesToRows(current.data);
      if (savedRows.length > 0) {
        const lines = savedRows.map((r) => `${r.subject} > ${r.chapter} > ${r.topic}`).join("\n");
        setRaw(lines);
      }
      setHydratedFromSaved(true);
    }
  }, [current.data, hydratedFromSaved]);

  const parsed = useMemo(() => parseSyllabusText(raw), [raw]);

  const filteredPreview = useMemo(() => {
    const q = previewSearch.trim().toLowerCase();
    if (!q) return parsed;
    return parsed.filter(
      (r) =>
        r.subject.toLowerCase().includes(q) ||
        r.chapter.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q),
    );
  }, [parsed, previewSearch]);

  const save = useMutation({
    mutationFn: () => replace({ data: { rows: parsed } }),
    onSuccess: (r) => {
      toast.success(`${r.subjects} subjects, ${r.chapters} chapters and ${r.topics} topics saved!`);
      void qc.invalidateQueries({ queryKey: ["admin", "syllabus"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const generateChapterTests = useMutation({
    mutationFn: async () => {
      await replace({ data: { rows: parsed } });
      return autoCreateTests({
        data: {
          exam_track: examTrack || "All Exams",
          duration_minutes: 45,
          rows: parsed,
        },
      });
    },
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: ["admin", "syllabus"] });
      void qc.invalidateQueries({ queryKey: ["admin", "tests"] });
      toast.success(
        res.createdCount > 0
          ? `${res.createdCount} new chapter tests created in Test Builder!`
          : `Syllabus saved! All ${res.totalChapters} chapters already have tests in Test Builder.`,
      );
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const subjectCount = new Set(parsed.map((r) => r.subject)).size;
  const chapterCount = new Set(parsed.map((r) => `${r.subject}\u0000${r.chapter}`)).size;

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kkcc-syllabus-tree.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin panel"
        title="Syllabus Auto Builder"
        description="Paste your syllabus once or pick an exam template. KKCC converts it into Subject → Chapter → Topic and links it directly to Test Builder."
      />
      <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-10 sm:px-6">
        <AdminCommandBar compact />

        <div className="surface-panel p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold">1-Click Official Exam Syllabus Templates</h2>
              <p className="text-xs text-muted-foreground">
                Load a ready-made syllabus template to preview or customize for your batch:
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link to="/admin/tests">
                  <ClipboardList className="mr-1.5 h-3.5 w-3.5" /> Open Test Builder
                </Link>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={handleExportJson}
                disabled={!parsed.length}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" /> Export JSON
              </Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SYLLABUS_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  setRaw(tpl.content);
                  setExamTrack(tpl.exam);
                  toast.info(`Loaded ${tpl.label} template`);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3.5 py-1.5 text-xs font-medium transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <Layers className="h-3.5 w-3.5 text-primary" />
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <section className="surface-panel p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-bold">Paste or Edit Syllabus</h2>
              </div>
              <Badge variant="outline" className="rounded-full text-[11px]">
                Saved in DB: {current.data?.length ?? 0} nodes
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Supported formats: <code>Subject:</code>, <code>Chapter:</code>, <code>Topic:</code>{" "}
              lines OR <code>Subject &gt; Chapter &gt; Topic</code> paths. Plain lines under a
              chapter automatically become topics.
            </p>
            <Textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="mt-4 min-h-[420px] font-mono text-sm"
            />
            <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Badge>{subjectCount} subjects</Badge>
                <Badge>{chapterCount} chapters</Badge>
                <Badge>{parsed.length} topics</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="rounded-full"
                  disabled={!parsed.length || save.isPending}
                  onClick={() => save.mutate()}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {save.isPending ? "Saving..." : "Save Syllabus Tree"}
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  disabled={!parsed.length || generateChapterTests.isPending}
                  onClick={() => generateChapterTests.mutate()}
                >
                  <Wand2 className="mr-2 h-4 w-4 text-primary" />
                  {generateChapterTests.isPending
                    ? "Creating tests..."
                    : "Save & Auto-Create Chapter Tests"}
                </Button>
              </div>
            </div>
          </section>

          <section className="surface-panel flex flex-col p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-bold">Live Structured Preview</h2>
              <div className="relative w-48">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={previewSearch}
                  onChange={(e) => setPreviewSearch(e.target.value)}
                  placeholder="Filter preview..."
                  className="h-8 rounded-full pl-8 text-xs"
                />
              </div>
            </div>

            <div className="mt-4 max-h-[460px] flex-1 space-y-4 overflow-auto pr-1">
              {[...new Set(filteredPreview.map((r) => r.subject))].map((subject) => (
                <div key={subject} className="rounded-2xl border bg-background/60 p-3.5">
                  <h3 className="flex items-center gap-2 font-semibold text-primary">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {subject}
                  </h3>
                  {[
                    ...new Set(
                      filteredPreview.filter((r) => r.subject === subject).map((r) => r.chapter),
                    ),
                  ].map((ch) => (
                    <div key={ch} className="mt-2.5 pl-4">
                      <div className="text-sm font-medium text-foreground">{ch}</div>
                      <ul className="ml-4 mt-1 list-disc space-y-0.5 text-xs text-muted-foreground">
                        {filteredPreview
                          .filter((r) => r.subject === subject && r.chapter === ch)
                          .map((r) => (
                            <li key={r.topic}>{r.topic}</li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
              {!filteredPreview.length && (
                <p className="rounded-2xl border border-dashed p-8 text-center text-xs text-muted-foreground">
                  No syllabus topics match your filter.
                </p>
              )}
            </div>

            <div className="mt-5 border-t pt-4 text-xs text-muted-foreground">
              Current saved database nodes: <b>{current.data?.length ?? 0}</b>. Saving updates the
              syllabus tree and makes all subjects, chapters and topics selectable inside{" "}
              <Link to="/admin/tests" className="font-medium text-primary underline">
                Test Builder
              </Link>
              .
            </div>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
