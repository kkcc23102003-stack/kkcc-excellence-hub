import { Link } from "@tanstack/react-router";
import { Star, PlayCircle, FileCheck2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { coinPriceOf, coursePriceLabel, discountOf, isFreeCourse, type Course } from "@/lib/cms";
import { CourseThumb } from "./course-thumb";
import { KaatCoin } from "./kaat-coin";

export function CourseCard({ course }: { course: Course }) {
  const off = discountOf(course);
  const free = isFreeCourse(course);
  const coinPrice = coinPriceOf(course);
  return (
    <article className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft">
      <Link
        to="/courses/$slug"
        params={{ slug: course.slug }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CourseThumb course={course} className="aspect-[16/9]" />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {course.course_type}
          </Badge>
          <span className="text-xs text-muted-foreground">{course.class_level}</span>
        </div>

        <h3 className="mt-3 text-[15px] font-semibold leading-snug">
          <Link to="/courses/$slug" params={{ slug: course.slug }} className="hover:text-primary">
            {course.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{course.faculty}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <PlayCircle className="h-3.5 w-3.5" /> {course.lectures_count} lectures
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileCheck2 className="h-3.5 w-3.5" /> {course.tests_count} tests
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> {course.materials_count} resources
          </span>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-semibold">{Number(course.rating).toFixed(1)}</span>
          <span className="text-muted-foreground">rating</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="font-display text-lg font-bold">{coursePriceLabel(course)}</p>
            {!free && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <KaatCoin size="xs" /> {coinPrice} 23KAAT
                {coinPrice < course.price ? <span className="text-success">· cheaper</span> : null}
              </p>
            )}
            {course.original_price > course.price && (
              <p className="text-xs text-muted-foreground">
                <span className="line-through">
                  {coursePriceLabel({ price: course.original_price })}
                </span>{" "}
                <span className="text-success">{free ? "No payment" : `${off}% off`}</span>
              </p>
            )}
          </div>
          <Button asChild size="sm" className="rounded-full">
            {free ? (
              <Link to="/learn" search={{ course: course.slug }}>
                Start Free
              </Link>
            ) : (
              <Link to="/checkout" search={{ course: course.slug }}>
                Enroll
              </Link>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
