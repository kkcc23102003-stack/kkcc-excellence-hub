import { invalidateLearningQueries } from "@/hooks/use-learning-access";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Save,
  Trash2,
  Unlock,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { listSyllabus, syllabusNodesToRows } from "@/lib/syllabus.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  bulkAddTestQuestions,
  deleteTest,
  deleteTestQuestion,
  listAdminTests,
  listTestQuestions,
  reorderTestQuestions,
  saveTest,
  saveTestQuestion,
  pullQuestionsFromBank,
} from "@/lib/admin.functions";
import {
  CATALOG_EXAMS_LIST,
  CATALOG_SUBJECTS_BY_EXAM,
  getCatalogTopicsForExam,
} from "@/lib/test-series-catalog-meta";
import { cn } from "@/lib/utils";
import {
  adminGrantTestAccess,
  adminListTestGrants,
  adminRevokeTestAccess,
  adminSetTestFree,
} from "@/lib/test-access.functions";

/** Exam tracks the bank actually carries, plus an everything option. */
const BANK_EXAMS = CATALOG_EXAMS_LIST;

/** One price across the whole app, in rupees and in coins alike. */
const DEFAULT_TEST_PRICE = 999;

export const Route = createFileRoute("/_authenticated/admin/tests")({
  head: () => ({
    meta: [
      { title: "Admin — Test Question Writer | KKCC" },
      {
        name: "description",
        content: "Write, edit and publish your own MCQs for KKCC test series.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TestQuestionWriter,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild className="rounded-full">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/login" search={{ redirectTo: "/admin/tests" }}>
              Sign in as admin
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  ),
});

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

type TestPayload = {
  id?: string;
  course_id?: string | null;
  lecture_id?: string | null;
  title: string;
  instructions: string;
  subject: string;
  duration_minutes: number;
  question_timer_seconds: number;
  timer_mode: "test" | "question" | "unlimited";
  questions_count: number;
  total_marks: number;
  is_published: boolean;
  sort_order: number;
  exam_track: string;
  level: "Easy" | "Moderate" | "Difficult" | "Mixed";
  series_name: string;
  is_paid: boolean;
  price_inr: number;
  price_coins: number;
  question_source: "manual" | "deterministic";
  generation_exam: string;
  generation_subject: string;
  generation_topic: string;
  generation_difficulty: "Easy" | "Moderate" | "Difficult" | "Mixed";
  generation_count: number;
  syllabus_subject: string;
  syllabus_chapter: string;
  syllabus_topic: string;
};

/** Narrow a DB row to the exact shape saveTest validates. */
function toTestPayload(
  test: {
    id: string;
    course_id: string | null;
    lecture_id: string | null;
    title: string;
    instructions: string | null;
    subject: string | null;
    duration_minutes: number;
    question_timer_seconds: number | null;
    timer_mode: string | null;
    questions_count: number;
    total_marks: number;
    is_published: boolean;
    sort_order: number;
    exam_track?: string | null;
    level?: string | null;
    series_name?: string | null;
    is_paid?: boolean | null;
    price_inr?: number | null;
    price_coins?: number | null;
    question_source?: "manual" | "deterministic" | null;
    generation_exam?: string | null;
    generation_subject?: string | null;
    generation_topic?: string | null;
    generation_difficulty?: "Easy" | "Moderate" | "Difficult" | "Mixed" | null;
    generation_count?: number | null;
    syllabus_subject?: string | null;
    syllabus_chapter?: string | null;
    syllabus_topic?: string | null;
  },
  patch: Partial<TestPayload> = {},
): TestPayload {
  const mode =
    test.timer_mode === "question" || test.timer_mode === "unlimited" ? test.timer_mode : "test";
  return {
    id: test.id,
    course_id: test.course_id,
    lecture_id: test.lecture_id,
    title: test.title,
    instructions: test.instructions ?? "",
    subject: test.subject ?? "",
    duration_minutes: test.duration_minutes,
    question_timer_seconds: test.question_timer_seconds ?? 0,
    timer_mode: mode,
    questions_count: test.questions_count,
    total_marks: test.total_marks,
    is_published: test.is_published,
    sort_order: test.sort_order,
    exam_track: test.exam_track ?? "",
    level:
      test.level === "Easy" || test.level === "Moderate" || test.level === "Difficult"
        ? test.level
        : "Mixed",
    series_name: test.series_name ?? "",
    is_paid: test.is_paid ?? false,
    // Every paper is priced the same across the app: 999 rupees or 999
    // coins. A new test starts there rather than at zero.
    price_inr: test.price_inr ?? DEFAULT_TEST_PRICE,
    price_coins: test.price_coins ?? DEFAULT_TEST_PRICE,
    question_source: test.question_source === "deterministic" ? "deterministic" : "manual",
    generation_exam: test.generation_exam ?? "All Exams",
    generation_subject: test.generation_subject ?? test.subject ?? "",
    generation_topic: test.generation_topic ?? "Mixed",
    generation_difficulty:
      test.generation_difficulty === "Easy" ||
      test.generation_difficulty === "Moderate" ||
      test.generation_difficulty === "Difficult"
        ? test.generation_difficulty
        : "Mixed",
    generation_count: test.generation_count ?? test.questions_count ?? 0,
    syllabus_subject: test.syllabus_subject ?? test.subject ?? "",
    syllabus_chapter: test.syllabus_chapter ?? "",
    syllabus_topic: test.syllabus_topic ?? "",
    ...patch,
  };
}

type QuestionDraft = {
  id?: string;
  question_text: string;
  subject: string;
  options: string[];
  correct_index: number;
  marks: number;
  negative_marks: number;
  explanation: string;
};

function emptyDraft(subject: string): QuestionDraft {
  return {
    question_text: "",
    subject,
    options: ["", "", "", ""],
    correct_index: 0,
    marks: 4,
    negative_marks: 1,
    explanation: "",
  };
}

function TestQuestionWriter() {
  const queryClient = useQueryClient();
  const fetchTests = useServerFn(listAdminTests);
  const fetchSyllabus = useServerFn(listSyllabus);
  const fetchQuestions = useServerFn(listTestQuestions);
  const putTest = useServerFn(saveTest);
  const dropTest = useServerFn(deleteTest);
  const putQuestion = useServerFn(saveTestQuestion);
  const dropQuestion = useServerFn(deleteTestQuestion);
  const reorder = useServerFn(reorderTestQuestions);
  const bulkAddFn = useServerFn(bulkAddTestQuestions);

  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [draft, setDraft] = useState<QuestionDraft | null>(null);
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkMarks, setBulkMarks] = useState("4");
  const [bulkNegativeMarks, setBulkNegativeMarks] = useState("1");
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState<string | null>(null);
  const [confirmDeleteTest, setConfirmDeleteTest] = useState<string | null>(null);

  const testsQuery = useQuery({
    queryKey: ["admin", "tests"],
    queryFn: () => fetchTests(),
  });

  const tests = useMemo(() => testsQuery.data ?? [], [testsQuery.data]);
  const activeTest = tests.find((t) => t.id === activeTestId) ?? null;

  const syllabusQuery = useQuery({
    queryKey: ["admin", "syllabus"],
    queryFn: () => fetchSyllabus(),
    retry: false,
  });

  const syllabusRows = useMemo(
    () => syllabusNodesToRows(syllabusQuery.data ?? []),
    [syllabusQuery.data],
  );
  const syllabusSubjects = useMemo(
    () => [...new Set(syllabusRows.map((r) => r.subject))],
    [syllabusRows],
  );
  const syllabusChapters = useMemo(() => {
    const subj = activeTest?.syllabus_subject || activeTest?.subject || "";
    const matching = subj
      ? syllabusRows.filter((r) => r.subject.toLowerCase() === subj.toLowerCase())
      : syllabusRows;
    return [...new Set((matching.length ? matching : syllabusRows).map((r) => r.chapter))];
  }, [syllabusRows, activeTest?.syllabus_subject, activeTest?.subject]);
  const syllabusTopics = useMemo(() => {
    const ch = activeTest?.syllabus_chapter || "";
    const matching = ch
      ? syllabusRows.filter((r) => r.chapter.toLowerCase() === ch.toLowerCase())
      : syllabusRows;
    return [...new Set((matching.length ? matching : syllabusRows).map((r) => r.topic))];
  }, [syllabusRows, activeTest?.syllabus_chapter]);

  // Pulling straight from the question bank. The lists come from the bank
  // itself, so a chapter can never be offered that has nothing behind it.
  const [pullExam, setPullExam] = useState<string>("All Exams");
  const [pullSubject, setPullSubject] = useState("");
  const [pullTopic, setPullTopic] = useState("Mixed");
  const [pullCount, setPullCount] = useState("20");
  const [pullLevel, setPullLevel] = useState<"Easy" | "Moderate" | "Difficult" | "Mixed">(
    "Difficult",
  );

  const pullSubjects = useMemo(
    () => CATALOG_SUBJECTS_BY_EXAM[pullExam] ?? CATALOG_SUBJECTS_BY_EXAM["All Exams"] ?? [],
    [pullExam],
  );

  const pullTopics = useMemo(() => {
    if (!pullSubject) return [];
    return getCatalogTopicsForExam(pullExam, pullSubject);
  }, [pullExam, pullSubject]);

  const pullFromBank = useServerFn(pullQuestionsFromBank);
  const pull = useMutation({
    mutationFn: (input: Parameters<typeof pullQuestionsFromBank>[0]) => pullFromBank(input),
    onSuccess: (r) => {
      void invalidateLearningQueries(queryClient);
      toast.success(`${r.added} fresh questions configured — 0 question rows saved`);
      void queryClient.invalidateQueries({ queryKey: ["admin", "test-questions", activeTestId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    if (!activeTestId && tests.length > 0) setActiveTestId(tests[0]?.id ?? null);
  }, [tests, activeTestId]);

  const questionsQuery = useQuery({
    queryKey: ["admin", "test-questions", activeTestId],
    queryFn: () => fetchQuestions({ data: { test_id: activeTestId as string } }),
    enabled: Boolean(activeTestId),
  });

  const questions = useMemo(() => questionsQuery.data ?? [], [questionsQuery.data]);

  const invalidateAll = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "tests"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "test-questions", activeTestId] });
  };

  const createTest = useMutation({
    mutationFn: () =>
      putTest({
        data: {
          title: "New test",
          instructions: "Read every question carefully before answering.",
          subject: "General",
          duration_minutes: 30,
          question_timer_seconds: 0,
          timer_mode: "test" as const,
          questions_count: 0,
          total_marks: 0,
          is_published: false,
          sort_order: 0,
          exam_track: "",
          level: "Mixed" as const,
          series_name: "",
          is_paid: false,
          price_inr: 0,
          price_coins: 0,
          question_source: "manual" as const,
          generation_exam: "All Exams",
          generation_subject: "General",
          generation_topic: "Mixed",
          generation_difficulty: "Difficult" as const,
          generation_count: 0,
          syllabus_subject: "",
          syllabus_chapter: "",
          syllabus_topic: "",
        },
      }),
    onSuccess: (row) => {
      void invalidateLearningQueries(queryClient);
      toast.success("Test created. Now add your questions.");
      setActiveTestId(row.id);
      invalidateAll();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateTest = useMutation({
    mutationFn: (payload: TestPayload) => putTest({ data: payload }),
    onSuccess: () => {
      void invalidateLearningQueries(queryClient);
      toast.success("Test updated");
      invalidateAll();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const setTestFree = useServerFn(adminSetTestFree);
  const setFree = useMutation({
    mutationFn: (input: { id: string; free: boolean }) => setTestFree({ data: input }),
    onSuccess: (result) => {
      void invalidateLearningQueries(queryClient);
      void queryClient.invalidateQueries({ queryKey: ["admin", "tests"] });
      toast.success(
        result.free
          ? "This test is now free. Students can open it directly, with no payment."
          : "This test is paid again. Only granted students can open it.",
      );
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeTest = useMutation({
    mutationFn: (id: string) => dropTest({ data: { id } }),
    onSuccess: () => {
      void invalidateLearningQueries(queryClient);
      toast.success("Test deleted");
      setActiveTestId(null);
      invalidateAll();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const saveQuestion = useMutation({
    mutationFn: (payload: QuestionDraft) =>
      putQuestion({
        data: {
          ...(payload.id ? { id: payload.id } : {}),
          test_id: activeTestId as string,
          question_text: payload.question_text,
          subject: payload.subject,
          options: payload.options.map((o) => o.trim()).filter(Boolean),
          correct_index: payload.correct_index,
          marks: payload.marks,
          negative_marks: payload.negative_marks,
          explanation: payload.explanation,
          sort_order: payload.id ? 0 : questions.length,
        },
      }),
    onSuccess: () => {
      void invalidateLearningQueries(queryClient);
      toast.success(draft?.id ? "Question updated" : "Question added");
      setDraft(null);
      invalidateAll();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeQuestion = useMutation({
    mutationFn: (id: string) => dropQuestion({ data: { id } }),
    onSuccess: () => {
      void invalidateLearningQueries(queryClient);
      toast.success("Question deleted");
      invalidateAll();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const bulkAdd = useMutation({
    mutationFn: (switchToManual: boolean) =>
      bulkAddFn({
        data: {
          test_id: activeTestId as string,
          subject: activeTest?.syllabus_subject || activeTest?.subject || "General",
          marks: Number(bulkMarks || 4),
          negative_marks: Number(bulkNegativeMarks || 1),
          text: bulkText,
          switchToManual,
        },
      }),
    onSuccess: (res) => {
      void invalidateLearningQueries(queryClient);
      toast.success(`Added ${res.addedCount} custom questions to this test!`);
      setBulkText("");
      setShowBulkPaste(false);
      invalidateAll();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const moveQuestion = useMutation({
    mutationFn: (ids: string[]) => reorder({ data: { test_id: activeTestId as string, ids } }),
    onSuccess: invalidateAll,
    onError: (error: Error) => toast.error(error.message),
  });

  const move = (index: number, direction: -1 | 1) => {
    const next = [...questions];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const a = next[index];
    const b = next[target];
    if (!a || !b) return;
    next[index] = b;
    next[target] = a;
    moveQuestion.mutate(next.map((q) => q.id));
  };

  const startEdit = (question: (typeof questions)[number]) => {
    setDraft({
      id: question.id,
      question_text: question.question_text,
      subject: question.subject ?? "",
      options: [...question.options, "", "", "", ""].slice(0, Math.max(4, question.options.length)),
      correct_index: question.correct_index,
      marks: question.marks,
      negative_marks: question.negative_marks,
      explanation: question.explanation ?? "",
    });
  };

  const submitDraft = () => {
    if (!draft) return;
    if (!activeTestId) {
      toast.error("Select a test first.");
      return;
    }
    if (draft.question_text.trim().length < 3) {
      toast.error("Please write the question text.");
      return;
    }
    const filled = draft.options.map((o) => o.trim()).filter(Boolean);
    if (filled.length < 2) {
      toast.error("Please write at least two options.");
      return;
    }
    if (!draft.options[draft.correct_index]?.trim()) {
      toast.error("The option you marked correct is empty.");
      return;
    }
    saveQuestion.mutate(draft);
  };

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 rounded-full">
          <Link to="/admin">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to admin
          </Link>
        </Button>

        <PageHeader
          title="Test question writer"
          description="Write your own MCQs for the test series. Each question is stored with the test, so students see exactly what you type."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* ------------------------------------------------ test list */}
          <aside className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Tests ({tests.length})</h2>
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => createTest.mutate()}
                disabled={createTest.isPending}
              >
                {createTest.isPending ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-1.5 h-4 w-4" />
                )}
                New test
              </Button>
            </div>

            {testsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading tests…</p>
            ) : tests.length === 0 ? (
              <p className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                No test yet. Create one, then start writing questions into it.
              </p>
            ) : (
              <ul className="space-y-2">
                {tests.map((test) => (
                  <li key={test.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTestId(test.id);
                        setDraft(null);
                      }}
                      className={cn(
                        "w-full rounded-2xl border p-3 text-left transition",
                        activeTestId === test.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/40",
                      )}
                    >
                      <span className="block truncate text-sm font-medium">{test.title}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {test.questions_count} Q
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {test.total_marks} marks
                        </Badge>
                        <Badge
                          variant={test.is_published ? "default" : "outline"}
                          className="text-[10px]"
                        >
                          {test.is_published ? "Published" : "Draft"}
                        </Badge>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* --------------------------------------------- question editor */}
          <section className="space-y-5">
            {!activeTest ? (
              <div className="rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                Select a test on the left, or create a new one.
              </div>
            ) : (
              <>
                {/* test settings */}
                <div className="rounded-3xl border bg-background/60 p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <ClipboardList className="h-4 w-4 text-primary" /> Test settings
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Test title</Label>
                      <Input
                        className="mt-1.5"
                        defaultValue={activeTest.title}
                        onBlur={(event) => {
                          const title = event.target.value.trim();
                          if (title && title !== activeTest.title) {
                            updateTest.mutate(toTestPayload(activeTest, { title }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input
                        className="mt-1.5"
                        defaultValue={activeTest.subject ?? ""}
                        onBlur={(event) => {
                          const subject = event.target.value.trim();
                          if (subject !== (activeTest.subject ?? "")) {
                            updateTest.mutate(toTestPayload(activeTest, { subject }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label>Syllabus subject</Label>
                        <Link
                          to="/admin/syllabus"
                          className="text-[11px] font-medium text-primary hover:underline"
                        >
                          Syllabus Builder →
                        </Link>
                      </div>
                      <Input
                        list="kkcc-syllabus-subjects"
                        className="mt-1.5"
                        key={`subj-${activeTest.id}-${activeTest.syllabus_subject ?? ""}`}
                        defaultValue={activeTest.syllabus_subject ?? activeTest.subject ?? ""}
                        onBlur={(event) => {
                          const syllabus_subject = event.target.value.trim();
                          if (syllabus_subject !== (activeTest.syllabus_subject ?? ""))
                            updateTest.mutate(toTestPayload(activeTest, { syllabus_subject }));
                        }}
                      />
                      <datalist id="kkcc-syllabus-subjects">
                        {syllabusSubjects.map((s) => (
                          <option key={s} value={s} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <Label>Syllabus chapter</Label>
                      <Input
                        list="kkcc-syllabus-chapters"
                        className="mt-1.5"
                        placeholder="e.g. Life Processes"
                        key={`chap-${activeTest.id}-${activeTest.syllabus_chapter ?? ""}`}
                        defaultValue={activeTest.syllabus_chapter ?? ""}
                        onBlur={(event) => {
                          const syllabus_chapter = event.target.value.trim();
                          if (syllabus_chapter !== (activeTest.syllabus_chapter ?? ""))
                            updateTest.mutate(toTestPayload(activeTest, { syllabus_chapter }));
                        }}
                      />
                      <datalist id="kkcc-syllabus-chapters">
                        {syllabusChapters.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <Label>Syllabus topic</Label>
                      <Input
                        list="kkcc-syllabus-topics"
                        className="mt-1.5"
                        placeholder="e.g. Nutrition"
                        key={`top-${activeTest.id}-${activeTest.syllabus_topic ?? ""}`}
                        defaultValue={activeTest.syllabus_topic ?? ""}
                        onBlur={(event) => {
                          const syllabus_topic = event.target.value.trim();
                          if (syllabus_topic !== (activeTest.syllabus_topic ?? ""))
                            updateTest.mutate(toTestPayload(activeTest, { syllabus_topic }));
                        }}
                      />
                      <datalist id="kkcc-syllabus-topics">
                        {syllabusTopics.map((t) => (
                          <option key={t} value={t} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        min={0}
                        className="mt-1.5"
                        defaultValue={activeTest.duration_minutes}
                        onBlur={(event) => {
                          const duration_minutes = Number(event.target.value || 0);
                          if (duration_minutes !== activeTest.duration_minutes) {
                            updateTest.mutate(toTestPayload(activeTest, { duration_minutes }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>Oriented for (exam)</Label>
                      <Input
                        className="mt-1.5"
                        placeholder="e.g. Punjab PCS, PSSSB, UPSC CSE"
                        defaultValue={activeTest.exam_track ?? ""}
                        onBlur={(event) => {
                          const exam_track = event.target.value.trim();
                          if (exam_track !== (activeTest.exam_track ?? "")) {
                            updateTest.mutate(toTestPayload(activeTest, { exam_track }));
                          }
                        }}
                      />
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Shown on the test card so students know the paper is for them.
                      </p>
                    </div>
                    <div>
                      <Label>Series name</Label>
                      <Input
                        className="mt-1.5"
                        placeholder="e.g. Punjab PCS Prelims Power Series"
                        defaultValue={activeTest.series_name ?? ""}
                        onBlur={(event) => {
                          const series_name = event.target.value.trim();
                          if (series_name !== (activeTest.series_name ?? "")) {
                            updateTest.mutate(toTestPayload(activeTest, { series_name }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>Level</Label>
                      <select
                        className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                        value={
                          activeTest.level === "Easy" ||
                          activeTest.level === "Moderate" ||
                          activeTest.level === "Difficult"
                            ? activeTest.level
                            : "Mixed"
                        }
                        onChange={(event) => {
                          const level = event.target.value as TestPayload["level"];
                          updateTest.mutate(toTestPayload(activeTest, { level }));
                        }}
                      >
                        <option value="Easy">Level 1 — Easy</option>
                        <option value="Moderate">Level 2 — Moderate</option>
                        <option value="Difficult">Level 3 — Difficult</option>
                        <option value="Mixed">Mixed (full-length paper)</option>
                      </select>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Students attempt a series in this order: Easy, then Moderate, then
                        Difficult.
                      </p>
                    </div>
                    <div>
                      <Label>Price in rupees</Label>
                      <Input
                        type="number"
                        min={0}
                        className="mt-1.5"
                        defaultValue={activeTest.price_inr ?? 0}
                        onBlur={(event) => {
                          const price_inr = Number(event.target.value || 0);
                          if (price_inr !== (activeTest.price_inr ?? 0)) {
                            updateTest.mutate(toTestPayload(activeTest, { price_inr }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>Price in Kit 2 Coins</Label>
                      <Input
                        type="number"
                        min={0}
                        className="mt-1.5"
                        defaultValue={activeTest.price_coins ?? 0}
                        onBlur={(event) => {
                          const price_coins = Number(event.target.value || 0);
                          if (price_coins !== (activeTest.price_coins ?? 0)) {
                            updateTest.mutate(toTestPayload(activeTest, { price_coins }));
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <Label className="mb-1.5">Access</Label>
                      <Button
                        variant={activeTest.is_paid ? "outline" : "default"}
                        className="rounded-full"
                        disabled={setFree.isPending}
                        onClick={() =>
                          setFree.mutate({ id: activeTest.id, free: activeTest.is_paid })
                        }
                      >
                        {setFree.isPending ? (
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        ) : activeTest.is_paid ? (
                          <Unlock className="mr-1.5 h-4 w-4" />
                        ) : (
                          <Lock className="mr-1.5 h-4 w-4" />
                        )}
                        {activeTest.is_paid ? "Make this free" : "Make this paid"}
                      </Button>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {activeTest.is_paid
                          ? "Paid: only students you have granted access can open it."
                          : "Free: opens directly for everyone, like a free course. No payment step."}
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button
                        variant={activeTest.is_published ? "secondary" : "default"}
                        className="rounded-full"
                        onClick={() =>
                          updateTest.mutate(
                            toTestPayload(activeTest, { is_published: !activeTest.is_published }),
                          )
                        }
                      >
                        {activeTest.is_published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full text-destructive"
                        onClick={() => setConfirmDeleteTest(activeTest.id)}
                      >
                        <Trash2 className="mr-1.5 h-4 w-4" /> Delete test
                      </Button>
                    </div>
                  </div>
                </div>

                <OfflineAccessPanel testId={activeTest.id} isPaid={activeTest.is_paid} />

                {/* Fill the paper from the question bank instead of typing
                    every question by hand. Everything pulled stays editable. */}
                <div className="rounded-3xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold">
                        Pull from Question Bank (Priority #1 to Your Added &amp; AI Questions)
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Choose the exam, subject, chapter, level, and any question count (e.g. 10,
                        20, 30, 60, 100). Questions you added or generated with AI in the Question
                        Bank always get <strong>First Preference</strong>, and the rest fill from the
                        template bank.
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="rounded-full font-bold">
                      <Link to="/admin/exam-bank">
                        Open Question Bank (Templates + My Questions + AI)
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="text-xs font-semibold">
                      Exam
                      <select
                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal"
                        value={pullExam}
                        onChange={(e) => {
                          setPullExam(e.target.value);
                          setPullSubject("");
                          setPullTopic("Mixed");
                        }}
                      >
                        {BANK_EXAMS.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold">
                      Subject
                      <select
                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal"
                        value={pullSubject}
                        onChange={(e) => {
                          setPullSubject(e.target.value);
                          setPullTopic("Mixed");
                        }}
                      >
                        <option value="">Choose a subject</option>
                        {pullSubjects.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold">
                      Chapter
                      <select
                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal"
                        value={pullTopic}
                        onChange={(e) => setPullTopic(e.target.value)}
                      >
                        <option value="Mixed">All chapters mixed</option>
                        {pullTopics.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="text-xs font-semibold">
                      <span>How many questions (1–200)</span>
                      <Input
                        className="mt-1"
                        type="number"
                        min={1}
                        max={200}
                        value={pullCount}
                        onChange={(e) => setPullCount(e.target.value)}
                      />
                      <div className="mt-1 flex flex-wrap gap-1">
                        {[10, 15, 20, 25, 30, 50, 60, 100].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setPullCount(String(num))}
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-bold transition",
                              Number(pullCount) === num
                                ? "border-primary bg-primary text-primary-foreground"
                                : "bg-background hover:border-primary/50",
                            )}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="text-xs font-semibold">
                      Level
                      <select
                        className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm font-normal"
                        value={pullLevel}
                        onChange={(e) =>
                          setPullLevel(
                            e.target.value as "Easy" | "Moderate" | "Difficult" | "Mixed",
                          )
                        }
                      >
                        <option value="Difficult">Difficult — High-Yield / exam oriented</option>
                        <option value="Moderate">Moderate — practice</option>
                        <option value="Easy">Easy — foundation</option>
                        <option value="Mixed">Mixed — all three levels</option>
                      </select>
                    </label>
                    <div className="flex items-end">
                      <Button
                        className="w-full rounded-full"
                        disabled={!pullSubject || pull.isPending}
                        onClick={() =>
                          pull.mutate({
                            data: {
                              test_id: activeTest.id,
                              exam: pullExam,
                              subject: pullSubject,
                              topic: pullTopic,
                              difficulty: pullLevel,
                              count: Math.max(1, Math.min(200, Number(pullCount || 20))),
                              marks: 1,
                              negative_marks: 0,
                            },
                          })
                        }
                      >
                        {pull.isPending
                          ? "Configuring…"
                          : `Set Up (${Math.max(1, Math.min(200, Number(pullCount || 20)))} Questions)`}
                      </Button>
                    </div>
                  </div>
                </div>
                {/* write / edit a question + bulk paste */}
                <div className="rounded-3xl border bg-background/60 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold">
                        {draft?.id ? "Edit question" : "Write or Paste Your Own Questions"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Mode:{" "}
                        <strong>
                          {activeTest.question_source === "manual"
                            ? "Only Your Custom Questions (Manual)"
                            : "Your Custom Questions First + Auto Bank Fill"}
                        </strong>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant={activeTest.question_source === "manual" ? "default" : "outline"}
                        className="rounded-full text-xs"
                        onClick={() =>
                          updateTest.mutate(
                            toTestPayload(activeTest, {
                              question_source:
                                activeTest.question_source === "manual"
                                  ? "deterministic"
                                  : "manual",
                            }),
                          )
                        }
                      >
                        {activeTest.question_source === "manual"
                          ? "Mode: Only My Questions"
                          : "Switch to Only My Questions"}
                      </Button>
                      <Button
                        size="sm"
                        variant={showBulkPaste ? "secondary" : "outline"}
                        className="rounded-full"
                        onClick={() => setShowBulkPaste((v) => !v)}
                      >
                        <ClipboardList className="mr-1.5 h-4 w-4" />
                        {showBulkPaste ? "Close Bulk Paste" : "Bulk Paste MCQs"}
                      </Button>
                      {draft ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full"
                          onClick={() => setDraft(null)}
                        >
                          <X className="mr-1.5 h-4 w-4" /> Cancel
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="rounded-full"
                          onClick={() => setDraft(emptyDraft(activeTest.subject ?? ""))}
                        >
                          <Plus className="mr-1.5 h-4 w-4" /> Add question
                        </Button>
                      )}
                    </div>
                  </div>

                  {showBulkPaste ? (
                    <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-bold">
                          Paste Multiple MCQs at Once (Q1... A)... B)... C)... D)... Answer: A)
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <label className="flex items-center gap-1">
                            Marks:
                            <input
                              type="number"
                              min={1}
                              value={bulkMarks}
                              onChange={(e) => setBulkMarks(e.target.value)}
                              className="w-14 rounded border bg-background px-2 py-1 text-xs"
                            />
                          </label>
                          <label className="flex items-center gap-1">
                            Negative:
                            <input
                              type="number"
                              min={0}
                              value={bulkNegativeMarks}
                              onChange={(e) => setBulkNegativeMarks(e.target.value)}
                              className="w-14 rounded border bg-background px-2 py-1 text-xs"
                            />
                          </label>
                        </div>
                      </div>
                      <Textarea
                        rows={7}
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        placeholder={`Q1. With which words does the Preamble to the Indian Constitution begin?\nA) We, the People of India\nB) In the Name of Parliament\nC) By Order of the President\nD) We, the Citizens of India\nAnswer: A\nExplanation: The Preamble begins with 'We, the People of India'.`}
                        className="font-mono text-xs"
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          className="rounded-full font-bold"
                          disabled={!bulkText.trim() || bulkAdd.isPending}
                          onClick={() => bulkAdd.mutate(true)}
                        >
                          {bulkAdd.isPending ? (
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="mr-1.5 h-4 w-4" />
                          )}
                          Import Questions (Use Only My Questions)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full font-bold"
                          disabled={!bulkText.trim() || bulkAdd.isPending}
                          onClick={() => bulkAdd.mutate(false)}
                        >
                          Import Questions (Keep Auto Bank Fill)
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {draft ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Question</Label>
                        <Textarea
                          rows={3}
                          className="mt-1.5"
                          placeholder="e.g. The Constitution of India came into force on which date?"
                          value={draft.question_text}
                          onChange={(event) =>
                            setDraft({ ...draft, question_text: event.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label className="mb-1.5 block">
                          Options — tap the circle to mark the correct answer
                        </Label>
                        <div className="space-y-2">
                          {draft.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <button
                                type="button"
                                aria-label={`Mark option ${OPTION_LABELS[index]} correct`}
                                onClick={() => setDraft({ ...draft, correct_index: index })}
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition",
                                  draft.correct_index === index
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "hover:border-primary",
                                )}
                              >
                                {draft.correct_index === index ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  OPTION_LABELS[index]
                                )}
                              </button>
                              <Input
                                placeholder={`Option ${OPTION_LABELS[index]}`}
                                value={option}
                                onChange={(event) => {
                                  const options = [...draft.options];
                                  options[index] = event.target.value;
                                  setDraft({ ...draft, options });
                                }}
                              />
                              {draft.options.length > 2 ? (
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  aria-label={`Remove option ${OPTION_LABELS[index]}`}
                                  onClick={() => {
                                    const options = draft.options.filter((_, i) => i !== index);
                                    setDraft({
                                      ...draft,
                                      options,
                                      correct_index:
                                        draft.correct_index >= options.length
                                          ? 0
                                          : draft.correct_index,
                                    });
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                        {draft.options.length < 6 ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="mt-2 rounded-full"
                            onClick={() => setDraft({ ...draft, options: [...draft.options, ""] })}
                          >
                            <Plus className="mr-1.5 h-4 w-4" /> Add option
                          </Button>
                        ) : null}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <Label>Subject tag</Label>
                          <Input
                            className="mt-1.5"
                            value={draft.subject}
                            onChange={(event) =>
                              setDraft({ ...draft, subject: event.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Marks</Label>
                          <Input
                            type="number"
                            min={0}
                            className="mt-1.5"
                            value={draft.marks}
                            onChange={(event) =>
                              setDraft({ ...draft, marks: Number(event.target.value || 0) })
                            }
                          />
                        </div>
                        <div>
                          <Label>Negative marks</Label>
                          <Input
                            type="number"
                            min={0}
                            className="mt-1.5"
                            value={draft.negative_marks}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                negative_marks: Number(event.target.value || 0),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Explanation (shown after submit)</Label>
                        <Textarea
                          rows={2}
                          className="mt-1.5"
                          placeholder="Why this answer is correct."
                          value={draft.explanation}
                          onChange={(event) =>
                            setDraft({ ...draft, explanation: event.target.value })
                          }
                        />
                      </div>

                      <Button
                        className="rounded-full"
                        onClick={submitDraft}
                        disabled={saveQuestion.isPending}
                      >
                        {saveQuestion.isPending ? (
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-1.5 h-4 w-4" />
                        )}
                        {draft.id ? "Save changes" : "Add to test"}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Tap <strong>Add question</strong> to write a new MCQ for this test.
                    </p>
                  )}
                </div>

                {/* existing questions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">
                    Questions in this test ({questions.length})
                  </h3>
                  {questionsQuery.isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading questions…</p>
                  ) : questions.length === 0 ? (
                    <p className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                      No question written yet for this test.
                    </p>
                  ) : (
                    <ol className="space-y-3">
                      {questions.map((question, index) => (
                        <li key={question.id} className="rounded-3xl border bg-background/60 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium">
                              {index + 1}. {question.question_text}
                            </p>
                            <div className="flex shrink-0 items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="Move up"
                                disabled={index === 0}
                                onClick={() => move(index, -1)}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="Move down"
                                disabled={index === questions.length - 1}
                                onClick={() => move(index, 1)}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="Edit question"
                                onClick={() => startEdit(question)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="Delete question"
                                className="text-destructive"
                                onClick={() => setConfirmDeleteQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                            {question.options.map((option, optionIndex) => (
                              <li
                                key={optionIndex}
                                className={cn(
                                  "rounded-xl border px-3 py-1.5 text-xs",
                                  optionIndex === question.correct_index
                                    ? "border-emerald-500/60 bg-emerald-500/10 font-semibold"
                                    : "text-muted-foreground",
                                )}
                              >
                                {OPTION_LABELS[optionIndex]}) {option}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            +{question.marks} / -{question.negative_marks}
                            {question.explanation ? ` · ${question.explanation}` : ""}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      <AlertDialog
        open={Boolean(confirmDeleteQuestion)}
        onOpenChange={(open) => !open && setConfirmDeleteQuestion(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              The question will be removed from the test permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDeleteQuestion) removeQuestion.mutate(confirmDeleteQuestion);
                setConfirmDeleteQuestion(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(confirmDeleteTest)}
        onOpenChange={(open) => !open && setConfirmDeleteTest(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this test?</AlertDialogTitle>
            <AlertDialogDescription>
              The test and all of its questions will be deleted permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDeleteTest) removeTest.mutate(confirmDeleteTest);
                setConfirmDeleteTest(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SiteLayout>
  );
}

/**
 * Offline payments.
 *
 * A student pays at the centre, by UPI to the desk, or by bank transfer. The
 * admin records that here against their email and the paid paper opens for
 * them immediately. Nothing is charged online and no payment gateway is
 * involved.
 *
 * Grants are never deleted, only revoked, so there is always a record of who
 * opened what and why.
 */
function OfflineAccessPanel({ testId, isPaid }: { testId: string; isPaid: boolean }) {
  const queryClient = useQueryClient();
  const listGrants = useServerFn(adminListTestGrants);
  const grantAccess = useServerFn(adminGrantTestAccess);
  const revokeAccess = useServerFn(adminRevokeTestAccess);

  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("cash");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  // Blank or 0 means lifetime access, which is the old behaviour.
  const [validDays, setValidDays] = useState("");

  const grantsQuery = useQuery({
    queryKey: ["admin", "test-grants"],
    queryFn: () => listGrants(),
    retry: false,
  });

  const rows = useMemo(
    () => (grantsQuery.data ?? []).filter((g) => g.test_id === testId),
    [grantsQuery.data, testId],
  );
  const live = rows.filter((g) => !g.revoked_at);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "test-grants"] });

  const grant = useMutation({
    mutationFn: () =>
      grantAccess({
        data: {
          test_id: testId,
          email: email.trim(),
          method,
          amount_inr: Number(amount || 0),
          note: note.trim(),
          valid_days: Number(validDays || 0),
        },
      }),
    onSuccess: (result) => {
      void invalidateLearningQueries(queryClient);
      void refresh();
      setEmail("");
      setAmount("");
      setValidDays("");
      setNote("");
      toast.success(
        result.alreadyHadAccess
          ? "That student already had access to this test."
          : `Access granted to ${result.student.full_name || result.student.email}.`,
      );
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => revokeAccess({ data: { id } }),
    onSuccess: () => {
      void invalidateLearningQueries(queryClient);
      void refresh();
      toast.success("Access withdrawn.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="mt-6 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <UserPlus className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Offline payment access</h3>
        <Badge variant="secondary" className="rounded-full text-[11px]">
          {live.length} student{live.length === 1 ? "" : "s"} unlocked
        </Badge>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {isPaid
          ? "Paid at the centre, by UPI, or by bank transfer? Enter the student's registered email and this paper opens for them straight away."
          : "This test is currently free, so every student can already open it. Grants below only matter if you switch it back to paid."}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="grant-email">Student email</Label>
          <Input
            id="grant-email"
            type="email"
            placeholder="student@example.com"
            className="mt-1.5"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="grant-method">Paid by</Label>
          <Input
            id="grant-method"
            placeholder="cash, upi, bank transfer"
            className="mt-1.5"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="grant-amount">Amount collected</Label>
          <Input
            id="grant-amount"
            type="number"
            min={0}
            placeholder="0"
            className="mt-1.5"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="grant-validity">Validity in days</Label>
          <Input
            id="grant-validity"
            inputMode="numeric"
            placeholder="Blank = lifetime, e.g. 30, 90, 365"
            value={validDays}
            onChange={(event) => setValidDays(event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="grant-note">Receipt or note</Label>
          <Input
            id="grant-note"
            placeholder="Receipt 1042"
            className="mt-1.5"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
      </div>

      <Button
        className="mt-4 rounded-full"
        disabled={!email.trim() || grant.isPending}
        onClick={() => grant.mutate()}
      >
        {grant.isPending ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="mr-1.5 h-4 w-4" />
        )}
        Grant access
      </Button>

      {rows.length > 0 && (
        <ul className="mt-5 space-y-2">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs"
            >
              <span className="min-w-0">
                <span className="font-medium">{row.studentName || row.studentEmail}</span>
                {row.studentName && (
                  <span className="text-muted-foreground"> · {row.studentEmail}</span>
                )}
                <span className="text-muted-foreground">
                  {" "}
                  · {row.method}
                  {row.amount_inr > 0 ? ` · ₹${row.amount_inr}` : ""}
                  {row.note ? ` · ${row.note}` : ""}
                  {row.expires_at
                    ? new Date(row.expires_at) > new Date()
                      ? ` · expires ${new Date(row.expires_at).toLocaleDateString("en-IN")} (${Math.max(
                          0,
                          Math.ceil((new Date(row.expires_at).getTime() - Date.now()) / 86_400_000),
                        )} days left)`
                      : ` · expired ${new Date(row.expires_at).toLocaleDateString("en-IN")}`
                    : " · lifetime"}
                </span>
              </span>
              {row.revoked_at ? (
                <Badge variant="outline" className="rounded-full text-[11px]">
                  Withdrawn
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full text-[11px]"
                  disabled={revoke.isPending}
                  onClick={() => revoke.mutate(row.id)}
                >
                  Withdraw
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
