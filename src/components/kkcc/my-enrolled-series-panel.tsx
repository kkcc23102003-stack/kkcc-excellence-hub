import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpenCheck, CalendarClock, Clock3, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/use-auth-user";
import { listMySeriesAccess } from "@/lib/test-access.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { PAID_TEST_SERIES } from "@/lib/test-series-catalog";

function expiryLabel(value: string | null) {
  if (!value) return "Lifetime access";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Personalized active series summary shared by home, courses, and student dashboard. */
export function MyEnrolledSeriesPanel({ compact = false }: { compact?: boolean }) {
  const { user } = useAuthUser();
  const list = useServerFn(listMySeriesAccess);
  const accessQuery = useQuery({
    queryKey: ["my", "series-access"],
    queryFn: () => safeServerCall(() => list({} as never), []),
    enabled: Boolean(user),
    staleTime: 30_000,
  });

  const enrolled = useMemo(() => {
    const grants = accessQuery.data ?? [];
    return PAID_TEST_SERIES.map((series) => {
      const grant = grants.find(
        (item) =>
          item.series_id.trim().toLowerCase() === series.id.trim().toLowerCase() ||
          item.series_id.trim().toLowerCase() === series.name.trim().toLowerCase(),
      );
      return grant ? { series, grant } : null;
    }).filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [accessQuery.data]);

  if (!user || accessQuery.isPending || enrolled.length === 0) return null;

  return (
    <section className="surface-panel border-primary/25 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge className="rounded-full border-primary/30 bg-primary/10 text-primary">
            <BookOpenCheck className="mr-1.5 h-3.5 w-3.5" /> My enrolled tests
          </Badge>
          <h2 className="mt-3 text-lg font-black sm:text-xl">Continue your test series</h2>
          {!compact && (
            <p className="mt-1 text-sm text-muted-foreground">
              Active access and expiry are shown here, with learning one click away.
            </p>
          )}
        </div>
        <Button asChild size="sm" variant="outline" className="rounded-full">
          <Link to="/test-series">Browse all series</Link>
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {enrolled.slice(0, compact ? 3 : 12).map(({ series, grant }) => {
          const daysLeft = grant.expires_at
            ? Math.max(
                0,
                Math.ceil((new Date(grant.expires_at).getTime() - Date.now()) / 86_400_000),
              )
            : null;
          return (
            <article key={series.id} className="rounded-2xl border bg-background/70 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold">{series.name}</p>
                <Badge variant="secondary" className="shrink-0 rounded-full text-[10px]">
                  Active
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{series.examTrack}</p>
              <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5 text-primary" />
                  {daysLeft === null ? "Lifetime validity" : `${daysLeft} days left`}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5 text-primary" />
                  Expiry: {expiryLabel(grant.expires_at)}
                </span>
              </div>
              <Button asChild size="sm" className="mt-4 w-full rounded-full">
                <Link to="/test-series/learn/$seriesId" params={{ seriesId: series.id }}>
                  <PlayCircle className="mr-1.5 h-4 w-4" /> Start Learning
                </Link>
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
