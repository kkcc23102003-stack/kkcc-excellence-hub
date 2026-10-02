import { cn } from "@/lib/utils";
import type { Course } from "@/lib/cms";

/**
 * Course artwork. Uses the uploaded thumbnail when the admin has set one,
 * otherwise falls back to lightweight generated artwork.
 */
export function CourseThumb({ course, className }: { course: Course; className?: string }) {
  if (course.thumbnail_url) {
    return (
      <div className={cn("relative w-full overflow-hidden bg-ink", className)}>
        <img
          src={course.thumbnail_url}
          alt={course.title}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const hue = course.hue;
  return (
    <div
      className={cn("relative w-full overflow-hidden bg-ink", className)}
      style={{
        backgroundImage: `radial-gradient(120% 100% at 12% 0%, oklch(0.42 0.09 ${hue}) 0%, oklch(0.22 0.03 ${hue}) 55%, oklch(0.17 0.02 ${hue}) 100%)`,
      }}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.16]"
        viewBox="0 0 400 225"
        role="presentation"
      >
        <defs>
          <pattern id={`grid-${course.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="400" height="225" fill={`url(#grid-${course.id})`} />
      </svg>
      <div className="relative flex h-full flex-col justify-between p-5">
        <span className="w-fit rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-foreground backdrop-blur">
          {course.category}
        </span>
        <div>
          <p className="font-display text-xl font-bold leading-tight text-ink-foreground">
            {course.subject}
          </p>
          <p className="text-xs text-ink-foreground/70">
            {course.duration_hours} hours of guided learning
          </p>
        </div>
      </div>
    </div>
  );
}
