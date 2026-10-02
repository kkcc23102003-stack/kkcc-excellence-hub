import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { useWebsiteContent } from "@/components/kkcc/website-content-provider";
import { CustomPageSections } from "@/components/kkcc/custom-page-sections";
import { CourseCard } from "@/components/kkcc/course-card";
import { MyEnrolledSeriesPanel } from "@/components/kkcc/my-enrolled-series-panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, formatINR } from "@/lib/cms";
import { listPublishedCourses } from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses — KKCC | Structured Learning Paths" },
      {
        name: "description",
        content:
          "Browse KKCC courses across school, board, medical, non-medical, commerce and competitive exams. Filter by class, subject, faculty, type and price.",
      },
      { property: "og:title", content: "Courses — KKCC" },
      {
        property: "og:description",
        content: "Find the right learning path with structured KKCC courses and expert faculty.",
      },
    ],
  }),
  loader: () => safeServerCall(() => listPublishedCourses(), []),
  component: CoursesPage,
});

const ANY = "any";

function CoursesPage() {
  const content = useWebsiteContent();
  const courses = Route.useLoaderData();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [classLevel, setClassLevel] = useState(ANY);
  const [subject, setSubject] = useState(ANY);
  const [faculty, setFaculty] = useState(ANY);
  const [type, setType] = useState(ANY);
  const [maxPrice, setMaxPrice] = useState(12000);
  const [showFilters, setShowFilters] = useState(false);

  const classes = [...new Set(courses.map((c) => c.class_level))];
  const subjects = [...new Set(courses.map((c) => c.subject))];
  const faculties = [...new Set(courses.map((c) => c.faculty))];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (tab === "all" || c.category === tab) &&
        (classLevel === ANY || c.class_level === classLevel) &&
        (subject === ANY || c.subject === subject) &&
        (faculty === ANY || c.faculty === faculty) &&
        (type === ANY || c.course_type === type) &&
        c.price <= maxPrice &&
        (!q || `${c.title} ${c.subject} ${c.faculty}`.toLowerCase().includes(q)),
    );
  }, [courses, tab, query, classLevel, subject, faculty, type, maxPrice]);

  const reset = () => {
    setClassLevel(ANY);
    setSubject(ANY);
    setFaculty(ANY);
    setType(ANY);
    setMaxPrice(12000);
    setQuery("");
    setTab("all");
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={content.page_headers.courses.eyebrow}
        title={content.page_headers.courses.title}
        description={content.page_headers.courses.description}
      />

      <CustomPageSections page="courses" position="top" />

      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6">
        <MyEnrolledSeriesPanel compact />
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={content.home.course_search_placeholder}
              aria-label="Search courses"
              className="h-11 rounded-full pl-10"
            />
          </div>
          <Button
            variant="outline"
            className="h-11 rounded-full lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted/70 p-1.5">
            <TabsTrigger value="all" className="rounded-xl px-4 py-2 text-xs sm:text-sm">
              All
            </TabsTrigger>
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c} className="rounded-xl px-4 py-2 text-xs sm:text-sm">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="surface-panel sticky top-24 space-y-5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Filters</p>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={reset}>
                  <X className="mr-1 h-3 w-3" /> Reset
                </Button>
              </div>

              <FilterSelect
                label="Class"
                value={classLevel}
                onChange={setClassLevel}
                options={classes}
              />
              <FilterSelect
                label="Subject"
                value={subject}
                onChange={setSubject}
                options={subjects}
              />
              <FilterSelect
                label="Faculty"
                value={faculty}
                onChange={setFaculty}
                options={faculties}
              />
              <FilterSelect
                label="Course type"
                value={type}
                onChange={setType}
                options={["Live", "Recorded", "Hybrid"]}
              />

              <div>
                <label className="text-xs font-medium text-muted-foreground" htmlFor="price">
                  Max price — {formatINR(maxPrice)}
                </label>
                <Slider
                  id="price"
                  className="mt-3"
                  min={1000}
                  max={16000}
                  step={500}
                  value={[maxPrice]}
                  onValueChange={([v]) => setMaxPrice(v ?? 16000)}
                />
              </div>
            </div>
          </aside>

          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              {results.length} course{results.length === 1 ? "" : "s"} found
            </p>
            {results.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed p-14 text-center">
                <p className="font-semibold">No courses match these filters</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try widening the price range or clearing a filter.
                </p>
                <Button className="mt-5 rounded-full" variant="outline" onClick={reset}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <CustomPageSections page="courses" position="bottom" />
    </SiteLayout>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function CourseGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-2xl" />
      ))}
    </div>
  );
}
