import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Course, Lecture, Material } from "@/lib/cms";
import { buildFacultyProfiles } from "@/lib/faculty";
import {
  listPublishedCourses,
  listPublicLectures,
  listPublicMaterials,
} from "@/lib/content.functions";

type Hit = {
  group: string;
  label: string;
  sub: string;
  to: string;
  params?: Record<string, string>;
};

function buildIndex(courses: Course[], lectures: Lecture[], materials: Material[]): Hit[] {
  const hits: Hit[] = [
    {
      group: "Quiz",
      label: "Kit 2 Coins Quiz Zone",
      sub: "Colourful 60-second MCQs for NEET, JEE, CBSE, ICSE, CA, UPSC, Banking and state exams",
      to: "/games",
    },
    {
      group: "Wallet",
      label: "23KAAT coins",
      sub: "Buy coin packs and use coins for courses and notes",
      to: "/coins",
    },
  ];
  courses.forEach((c) =>
    hits.push({
      group: "Courses",
      label: c.title,
      sub: `${c.subject} · ${c.class_level}`,
      to: "/courses/$slug",
      params: { slug: c.slug },
    }),
  );
  lectures.forEach((l) =>
    hits.push({ group: "Lectures", label: l.title, sub: `Duration ${l.duration}`, to: "/learn" }),
  );
  buildFacultyProfiles(courses).forEach((f) =>
    hits.push({
      group: "Faculty",
      label: f.name,
      sub: f.subjectLabel,
      to: "/faculty/$slug",
      params: { slug: f.slug },
    }),
  );
  materials.forEach((m) =>
    hits.push({
      group: m.material_type,
      label: m.title,
      sub: `${m.subject} · ${m.chapter}`,
      to: "/study-material",
    }),
  );
  return hits;
}

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<{
    courses: Course[];
    lectures: Lecture[];
    materials: Material[];
  }>({
    courses: [],
    lectures: [],
    materials: [],
  });

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void Promise.all([listPublishedCourses(), listPublicLectures(), listPublicMaterials()])
      .then(([courses, lectures, materials]) => {
        if (!cancelled) setData({ courses, lectures, materials });
      })
      .catch((error) => {
        console.error("[search] content request failed", error);
        if (!cancelled) setData({ courses: [], lectures: [], materials: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const index = useMemo(() => buildIndex(data.courses, data.lectures, data.materials), [data]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? index.filter((h) => h.label.toLowerCase().includes(q) || h.sub.toLowerCase().includes(q))
      : index.slice(0, 8);
    const grouped = new Map<string, Hit[]>();
    list.slice(0, 24).forEach((h) => {
      grouped.set(h.group, [...(grouped.get(h.group) ?? []), h]);
    });
    return [...grouped.entries()];
  }, [index, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="sr-only">Search KKCC</DialogTitle>
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, lectures, teachers and notes…"
              className="h-9 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              aria-label="Search KKCC"
            />
          </div>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No matches for “{query}”. Try a subject, class or faculty name.
            </p>
          )}
          {results.map(([group, hits]) => (
            <div key={group} className="mb-2">
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {group}
              </p>
              {hits.map((h) => (
                <Link
                  key={`${group}-${h.label}`}
                  to={h.to}
                  params={h.params as never}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{h.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{h.sub}</span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
