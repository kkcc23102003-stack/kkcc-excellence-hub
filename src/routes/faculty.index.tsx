import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { CustomPageSections } from "@/components/kkcc/custom-page-sections";
import { useWebsiteContent } from "@/components/kkcc/website-content-provider";
import { buildFacultyProfiles } from "@/lib/faculty";
import { listPublishedCourses } from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/faculty/")({
  head: () => ({
    meta: [
      { title: "Faculty — KKCC | Teachers & Mentors" },
      {
        name: "description",
        content:
          "Meet the KKCC teaching team. Faculty profiles are generated from published courses added by the admin.",
      },
      { property: "og:title", content: "Faculty — KKCC" },
      { property: "og:description", content: "Subject specialists guiding every KKCC programme." },
    ],
  }),
  loader: () => safeServerCall(() => listPublishedCourses(), []),
  component: FacultyPage,
});

function FacultyPage() {
  const content = useWebsiteContent();
  const courses = Route.useLoaderData();
  const faculty = buildFacultyProfiles(courses);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={content.page_headers.faculty.eyebrow}
        title={content.page_headers.faculty.title}
        description={content.page_headers.faculty.description}
      />
      <CustomPageSections page="faculty" position="top" />
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {faculty.map((f) => (
          <Link
            key={f.id}
            to="/faculty/$slug"
            params={{ slug: f.slug }}
            className="hover-lift group rounded-2xl border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="h-7 w-7" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <p className="mt-5 font-semibold">{f.name}</p>
            <p className="text-sm text-primary">{f.subjectLabel}</p>
            <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
              <div>
                {f.courseCount} course{f.courseCount === 1 ? "" : "s"}
              </div>
              <div>{f.lectureCount} lectures on the platform</div>
              <div>{f.testCount} tests linked with courses</div>
            </dl>
          </Link>
        ))}
        {!faculty.length && (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
            No faculty profiles are published yet. Add a faculty name while creating/publishing a
            course in the admin panel and it will appear here automatically.
          </div>
        )}
      </div>
      <CustomPageSections page="faculty" position="bottom" />
    </SiteLayout>
  );
}
