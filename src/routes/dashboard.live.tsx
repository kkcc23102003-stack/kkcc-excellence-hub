import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, HelpCircle, PlayCircle, Radio, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listPublishedCourses, listPublicLectures } from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";

export const Route = createFileRoute("/dashboard/live")({
  head: () => ({
    meta: [
      { title: "Live Classes — KKCC Dashboard" },
      { name: "description", content: "Upcoming and recorded live classes for KKCC students." },
      { property: "og:title", content: "Live Classes — KKCC" },
      { property: "og:description", content: "Join scheduled live sessions and watch recordings." },
    ],
  }),
  loader: async () => {
    const [courses, lectures] = await Promise.all([
      safeServerCall(() => listPublishedCourses(), []),
      safeServerCall(() => listPublicLectures(), []),
    ]);
    return { courses, lectures };
  },
  component: LiveClasses,
});

function LiveClasses() {
  const { courses, lectures } = Route.useLoaderData();
  const courseById = new Map(courses.map((course) => [course.id, course]));
  const recorded = lectures.filter((lecture) => lecture.video_url).slice(0, 6);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Live classes & recordings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Recorded video lectures are available through Learn. Scheduled live sessions will appear
          here when announced.
        </p>
      </header>

      <section className="surface-panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Live session status</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              No live class link is published right now. Use recorded lectures or ask KKCC support
              for the next live class schedule.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full">
            Not live now
          </Badge>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/learn">
              <PlayCircle className="mr-1.5 h-4 w-4" /> Open lectures
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/support">
              <HelpCircle className="mr-1.5 h-4 w-4" /> Ask schedule
            </Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold">Recorded lecture shortcuts</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recorded.map((lecture) => {
            const course = courseById.get(lecture.course_id);
            return (
              <article key={lecture.id} className="surface-panel p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Video className="h-5 w-5" />
                </span>
                <p className="mt-3 line-clamp-2 font-semibold">{lecture.title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarClock className="h-3.5 w-3.5" /> {lecture.duration || "Recorded"}
                </p>
                {course && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{course.title}</p>
                )}
                <Button asChild size="sm" variant="outline" className="mt-4 rounded-full">
                  <Link to="/learn" search={course ? { course: course.slug } : {}}>
                    Open in Learn
                  </Link>
                </Button>
              </article>
            );
          })}
          {!recorded.length && (
            <div className="surface-panel p-8 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
              No recorded lecture links are available yet. New recordings will appear automatically.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
