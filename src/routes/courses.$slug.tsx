import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  PlayCircle,
  FileCheck2,
  BookOpen,
  Clock,
  Check,
  Download,
  BarChart3,
  Repeat,
  Video,
  Star,
} from "lucide-react";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { CourseThumb } from "@/components/kkcc/course-thumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/data/kkcc";
import { coinPriceOf, coursePriceLabel, groupLectures, isFreeCourse } from "@/lib/cms";
import { getCourseDetail } from "@/lib/content.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { KaatCoin } from "@/components/kkcc/kaat-coin";

export const Route = createFileRoute("/courses/$slug")({
  loader: async ({ params }) => {
    const detail = await safeServerCall(
      () => getCourseDetail({ data: { slug: params.slug } }),
      null,
    );
    if (!detail) throw notFound();
    return detail;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Course unavailable — KKCC" }, { name: "robots", content: "noindex" }],
      };
    }
    const { course } = loaderData;
    return {
      meta: [
        { title: `${course.title} — KKCC` },
        { name: "description", content: course.summary },
        { property: "og:title", content: `${course.title} — KKCC` },
        { property: "og:description", content: course.summary },
      ],
    };
  },
  component: CourseDetail,
});

const INCLUDES = [
  { label: "HD video lectures", icon: Video },
  { label: "Chapter notes", icon: BookOpen },
  { label: "Downloadable PDFs", icon: Download },
  { label: "Tests & MCQs", icon: FileCheck2 },
  { label: "Progress tracking", icon: BarChart3 },
  { label: "Revision material", icon: Repeat },
];

function CourseDetail() {
  const { course, lectures } = Route.useLoaderData();
  const modules = groupLectures(lectures);
  const free = isFreeCourse(course);
  const coinPrice = coinPriceOf(course);

  return (
    <SiteLayout>
      <section className="border-b bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:py-14">
          <div>
            <Badge variant="secondary" className="rounded-full">
              {course.category} · {course.class_level}
            </Badge>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {course.summary}
            </p>
            <p className="mt-4 text-sm">
              <span className="text-muted-foreground">Faculty · </span>
              {course.faculty}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" /> {course.duration_hours} hours
              </span>
              <span className="inline-flex items-center gap-2">
                <PlayCircle className="h-4 w-4" /> {course.lectures_count} lectures
              </span>
              <span className="inline-flex items-center gap-2">
                <FileCheck2 className="h-4 w-4" /> {course.tests_count} tests
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> {course.materials_count} resources
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-accent text-accent" />{" "}
                {Number(course.rating).toFixed(1)}
              </span>
            </div>
          </div>

          <div className="surface-panel overflow-hidden p-0">
            <CourseThumb course={course} className="aspect-[16/9]" />
            <div className="p-6">
              <div className="flex flex-wrap items-end gap-3">
                <p className="font-display text-3xl font-bold">{coursePriceLabel(course)}</p>
                {course.original_price > course.price && (
                  <p className="pb-1 text-sm text-muted-foreground line-through">
                    {coursePriceLabel({ price: course.original_price })}
                  </p>
                )}
              </div>
              {!free && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                  <KaatCoin size="sm" /> {coinPrice} 23KAAT
                  {coinPrice < course.price ? (
                    <span className="text-success">coin deal</span>
                  ) : null}
                </div>
              )}
              <div className="mt-5 space-y-2">
                <Button asChild size="lg" className="w-full rounded-full">
                  {free ? (
                    <Link to="/learn" search={{ course: course.slug }}>
                      Start Free Course
                    </Link>
                  ) : (
                    <Link to="/checkout" search={{ course: course.slug }}>
                      Enroll Now
                    </Link>
                  )}
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full rounded-full">
                  <Link to="/learn" search={{ course: course.slug }}>
                    Preview free lectures
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {free
                  ? "No Razorpay/payment needed — start learning instantly."
                  : "Secure checkout — payment gateway to be connected."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-14">
          <section>
            <h2 className="text-2xl font-bold">What You'll Learn</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o: string) => (
                <li key={o} className="flex gap-3 rounded-2xl border bg-card p-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Course Curriculum</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {modules.length} modules · {lectures.length} lectures
            </p>
            <Accordion type="multiple" defaultValue={["module-0"]} className="mt-6 space-y-3">
              {modules.map((m, mi) => (
                <AccordionItem
                  key={m.title}
                  value={`module-${mi}`}
                  className="overflow-hidden rounded-2xl border bg-card px-5"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                    <span>
                      {m.title}
                      <span className="ml-2 font-normal text-muted-foreground">
                        {m.lectures.length} lectures
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="divide-y">
                      {m.lectures.map((l) => (
                        <li key={l.id} className="flex items-center gap-3 py-3">
                          <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                          <span className="min-w-0 flex-1 truncate text-sm">{l.title}</span>
                          {l.is_free && (
                            <Badge variant="secondary" className="rounded-full text-[10px]">
                              Free
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{l.duration}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {FAQS.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="mt-6 space-y-3">
                {FAQS.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`faq-${i}`}
                    className="overflow-hidden rounded-2xl border bg-card px-5"
                  >
                    <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}
        </div>

        <aside>
          <div className="surface-panel sticky top-24 p-6">
            <h2 className="text-lg font-bold">Course Includes</h2>
            <ul className="mt-5 space-y-3">
              {INCLUDES.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full rounded-full">
              {free ? (
                <Link to="/learn" search={{ course: course.slug }}>
                  Start Free Course
                </Link>
              ) : (
                <Link to="/checkout" search={{ course: course.slug }}>
                  Buy Now
                </Link>
              )}
            </Button>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
