import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  Flame,
  Sparkles,
  Target,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type MissionTask = {
  id: string;
  label: string;
  subtitle: string;
  to: string;
  linkLabel: string;
};

const DAILY_MISSIONS: MissionTask[] = [
  {
    id: "lecture",
    label: "Watch 1 Focused Lecture",
    subtitle: "Complete one topic video & note down key concepts",
    to: "/dashboard/courses",
    linkLabel: "My Courses",
  },
  {
    id: "notes",
    label: "Revise 1 Chapter Note / Formula Sheet",
    subtitle: "Read summary notes or previous year paper PDF",
    to: "/study-material",
    linkLabel: "Study Material",
  },
  {
    id: "test",
    label: "Attempt 1 Chapterwise Test",
    subtitle: "Practice Easy → Moderate → Difficult questions",
    to: "/test-series",
    linkLabel: "Test Series",
  },
  {
    id: "quiz",
    label: "Play Daily Kit 2 Coins Quiz",
    subtitle: "Earn daily reward coins while sharpening speed",
    to: "/games",
    linkLabel: "Kit 2 Coins",
  },
];

const EXAM_PRESETS = [
  "NEET UG",
  "JEE Main / Advanced",
  "Class 10 Board Exam",
  "Class 12 Board Exam",
  "Punjab PCS / PSSSB",
  "Punjab Police / Patwari",
  "SSC CGL / Railway",
  "CA Foundation / Inter",
];

const STORAGE_KEY = "kkcc:student-study-planner:v1";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function defaultExamDate() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().slice(0, 10);
}

export function StudentStudyPlanner({
  initialTargetExam,
}: {
  initialTargetExam?: string | undefined;
}) {
  const [targetExam, setTargetExam] = useState(initialTargetExam || "NEET UG");
  const [examDate, setExamDate] = useState(defaultExamDate);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        targetExam?: string;
        examDate?: string;
        day?: string;
        completedIds?: string[];
      };
      if (parsed.targetExam) setTargetExam(parsed.targetExam);
      if (parsed.examDate) setExamDate(parsed.examDate);
      if (parsed.day === todayKey() && Array.isArray(parsed.completedIds)) {
        setCompletedIds(parsed.completedIds);
      }
    } catch {
      // ignore storage read errors
    }
  }, []);

  const persist = (nextExam: string, nextDate: string, nextCompleted: string[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          targetExam: nextExam,
          examDate: nextDate,
          day: todayKey(),
          completedIds: nextCompleted,
        }),
      );
    } catch {
      // ignore storage write errors
    }
  };

  const toggleMission = (id: string) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      persist(targetExam, examDate, next);
      return next;
    });
  };

  const daysRemaining = useMemo(() => {
    const target = new Date(`${examDate}T00:00:00`);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Number.isFinite(diff) ? Math.max(0, diff) : 90;
  }, [examDate]);

  const progressPercent = Math.round((completedIds.length / DAILY_MISSIONS.length) * 100);

  return (
    <section className="surface-panel p-6" data-testid="student-study-planner">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3 w-3" /> Smart Study Planner
            </Badge>
            <Badge variant="outline" className="rounded-full text-xs">
              <CalendarClock className="mr-1 h-3.5 w-3.5 text-primary" />
              {daysRemaining} days to exam
            </Badge>
          </div>
          <h2 className="mt-2 font-display text-lg font-bold">
            Daily 4-Step Mission & Exam Countdown
          </h2>
          <p className="text-xs text-muted-foreground">
            Small daily wins build unstoppable exam confidence. Complete your 4 study actions today!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={targetExam}
            onChange={(e) => {
              setTargetExam(e.target.value);
              persist(e.target.value, examDate, completedIds);
            }}
            aria-label="Target exam"
            className="h-9 rounded-full border bg-background px-3 text-xs font-medium"
          >
            {EXAM_PRESETS.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={examDate}
            onChange={(e) => {
              setExamDate(e.target.value);
              persist(targetExam, e.target.value, completedIds);
            }}
            aria-label="Target exam date"
            className="h-9 rounded-full border bg-background px-3 text-xs font-medium"
          />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border bg-background/60 p-4">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-500" />
            Today’s Mission Progress ({completedIds.length}/{DAILY_MISSIONS.length} completed)
          </span>
          <span className="font-bold text-primary">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="mt-2 h-2" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {DAILY_MISSIONS.map((task) => {
          const done = completedIds.includes(task.id);
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-start justify-between gap-3 rounded-2xl border p-3.5 transition",
                done
                  ? "border-primary/40 bg-primary/5"
                  : "bg-background/50 hover:border-primary/30",
              )}
            >
              <button
                type="button"
                onClick={() => toggleMission(task.id)}
                className="flex min-w-0 flex-1 items-start gap-2.5 text-left"
              >
                {done ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      done && "line-through text-muted-foreground",
                    )}
                  >
                    {task.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{task.subtitle}</p>
                </div>
              </button>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-7 shrink-0 rounded-full px-2.5 text-xs"
              >
                <Link to={task.to}>{task.linkLabel} →</Link>
              </Button>
            </div>
          );
        })}
      </div>

      {completedIds.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-primary">
            <Target className="h-3.5 w-3.5" />
            {completedIds.length === DAILY_MISSIONS.length
              ? "All daily missions completed! Fantastic consistency!"
              : "Keep going — you are building a strong daily streak."}
          </span>
          <button
            type="button"
            onClick={() => {
              setCompletedIds([]);
              persist(targetExam, examDate, []);
            }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Reset today
          </button>
        </div>
      )}
    </section>
  );
}
