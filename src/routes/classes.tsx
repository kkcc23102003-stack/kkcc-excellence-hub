import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck, CalendarDays, FileCheck2, GraduationCap, PlayCircle } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { useWebsiteContent } from "@/components/kkcc/website-content-provider";
import { CustomPageSections } from "@/components/kkcc/custom-page-sections";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, coursePriceLabel, type Course } from "@/lib/cms";
import { listPublishedCourses } from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/classes")({
  head: () => ({
    meta: [
      { title: "Classes & Batches — KKCC" },
      {
        name: "description",
        content:
          "Explore verified KKCC classes and batches. Courses, lectures and access details update automatically.",
      },
      { property: "og:title", content: "Classes & Batches — KKCC" },
      {
        property: "og:description",
        content: "Verified KKCC batches and courses from the KKCC team.",
      },
    ],
  }),
  loader: () => safeServerCall(() => listPublishedCourses(), []),
  component: ClassesPage,
});

function BatchCard({ course }: { course: Course }) {
  return (
    <article className="surface-panel hover-lift flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <BookOpenCheck className="h-5 w-5" />
        </span>
        <Badge variant="secondary" className="rounded-full text-[11px]">
          {course.course_type || "Course"}
        </Badge>
      </div>
      <h3 className="mt-4 line-clamp-2 font-semibold">{course.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{course.summary}</p>
      <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <GraduationCap className="h-3.5 w-3.5 shrink-0" /> {course.class_level} · {course.subject}
        </li>
        <li className="flex items-center gap-1.5">
          <PlayCircle className="h-3.5 w-3.5 shrink-0" /> {course.lectures_count} lectures
        </li>
        <li className="flex items-center gap-1.5">
          <FileCheck2 className="h-3.5 w-3.5 shrink-0" /> {course.tests_count} tests ·{" "}
          {course.materials_count} resources
        </li>
      </ul>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-foreground">{coursePriceLabel(course)}</span>
        <span className="truncate text-xs text-muted-foreground">Faculty: {course.faculty}</span>
      </div>
      <Button asChild size="sm" className="mt-6 w-full rounded-full">
        <Link to="/courses/$slug" params={{ slug: course.slug }}>
          View class details
        </Link>
      </Button>
    </article>
  );
}

function BatchGrid({ courses }: { courses: Course[] }) {
  if (!courses.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
        No published classes are available here yet. When the KKCC team releases a course or batch,
        it will appear automatically.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <BatchCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function ClassesPage() {
  const content = useWebsiteContent();
  const courses = Route.useLoaderData();
  const categories = CATEGORIES.filter((category) =>
    courses.some((course) => course.category === category),
  );
  const defaultTab = categories[0] ?? "all";

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={content.page_headers.classes.eyebrow}
        title={content.page_headers.classes.title}
        description={content.page_headers.classes.description}
      />

      <CustomPageSections page="classes" position="top" />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        {courses.length ? (
          <Tabs defaultValue={defaultTab}>
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted/70 p-1.5">
              <TabsTrigger value="all" className="rounded-xl px-4 py-2 text-xs sm:text-sm">
                All classes
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-xl px-4 py-2 text-xs sm:text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <BatchGrid courses={courses} />
            </TabsContent>
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <BatchGrid courses={courses.filter((course) => course.category === category)} />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <BatchGrid courses={[]} />
        )}

        <div className="surface-panel mt-12 grid gap-6 p-8 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold">Need batch guidance?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share your class and goal. The KKCC team can guide you based on real available batches
              and admin-published courses.
            </p>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/support">Ask KKCC team</Link>
          </Button>
        </div>
      </div>
      <CustomPageSections page="classes" position="bottom" />
    </SiteLayout>
  );
}
