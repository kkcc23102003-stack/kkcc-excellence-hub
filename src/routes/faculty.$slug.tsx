import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookOpen, GraduationCap, PlayCircle, ClipboardList } from "lucide-react";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { Badge } from "@/components/ui/badge";
import { buildFacultyProfiles } from "@/lib/faculty";
import { listPublishedCourses } from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/faculty/$slug")({
  loader: async ({ params }) => {
    const courses = await safeServerCall(() => listPublishedCourses(), []);
    const faculty = buildFacultyProfiles(courses);
    const member = faculty.find((f) => f.slug === params.slug);
    if (!member) throw notFound();
    return { member, courses: courses.filter((course) => member.courseIds.includes(course.id)) };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Profile unavailable — KKCC" }, { name: "robots", content: "noindex" }],
      };
    const { member } = loaderData;
    const description = `${member.name} teaches ${member.subjectLabel} at KKCC. This profile reflects verified courses published by the KKCC team.`;
    return {
      meta: [
        { title: `${member.name} — KKCC Faculty` },
        { name: "description", content: description },
        { property: "og:title", content: `${member.name} — KKCC Faculty` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: FacultyProfile,
});

function FacultyProfile() {
  const { member, courses } = Route.useLoaderData();
  const stats = [
    { label: "Published courses", value: member.courseCount, icon: BookOpen },
    { label: "Lectures", value: member.lectureCount, icon: PlayCircle },
    { label: "Tests", value: member.testCount, icon: ClipboardList },
  ];

  return (
    <SiteLayout>
      <section className="border-b bg-surface">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-primary/10 text-primary">
            <GraduationCap className="h-10 w-10" />
          </span>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <p className="mt-1 text-primary">{member.subjectLabel}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full">
                Auto-updated from published courses
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                <PlayCircle className="mr-1.5 h-3 w-3" /> {member.lectureCount} lectures
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold">Profile source</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This faculty profile is created from real course data. Update the faculty name,
              subject, lectures and course details in the admin panel to update this page
              automatically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">Courses</h2>
            <div className="mt-4 space-y-3">
              {courses.length ? (
                courses.map((c) => (
                  <Link
                    key={c.id}
                    to="/courses/$slug"
                    params={{ slug: c.slug }}
                    className="hover-lift flex items-center justify-between gap-4 rounded-2xl border bg-card p-4"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{c.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {c.subject} · {c.lectures_count} lectures · {c.tests_count} tests
                      </span>
                    </span>
                    <span className="inline-flex h-8 items-center rounded-full px-3 text-xs font-medium text-primary">
                      View
                    </span>
                  </Link>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No published courses are assigned to this faculty yet.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="surface-panel h-fit p-6">
          <h2 className="text-lg font-bold">Teaching snapshot</h2>
          <div className="mt-5 space-y-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-lg font-bold">{value}</span>
                  <span className="block text-xs text-muted-foreground">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
