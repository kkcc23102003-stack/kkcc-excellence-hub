import { StudentAccessRemoval } from "./student-access-removal";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CourseRow, ProfileRow } from "@/integrations/supabase/db";
import { getCustomSeriesCatalog } from "@/lib/content.functions";
import { listAdminTests } from "@/lib/admin.functions";
import { adminGrantEnrollment } from "@/lib/enrollments.functions";
import { adminGrantSeriesAccess, adminGrantTestAccess } from "@/lib/test-access.functions";
import {
  getEffectiveLearningSeries,
  LEARNING_SERIES,
  setRuntimeCustomSeriesCatalog,
} from "@/lib/test-series-catalog";
import { invalidateLearningQueries } from "@/hooks/use-learning-access";

export function AdminEnrollmentPanel({
  profiles,
  courses,
}: {
  profiles: ProfileRow[];
  courses: CourseRow[];
}) {
  const client = useQueryClient();
  const fetchTests = useServerFn(listAdminTests);
  const grantCourse = useServerFn(adminGrantEnrollment);
  const grantTest = useServerFn(adminGrantTestAccess);
  const grantSeries = useServerFn(adminGrantSeriesAccess);
  const [studentId, setStudentId] = useState("");
  const [kind, setKind] = useState<"course" | "test" | "series">("test");
  const [item, setItem] = useState("");
  const [validDays, setValidDays] = useState("0");
  const tests = useQuery({ queryKey: ["admin", "tests"], queryFn: () => fetchTests() });
  const customCatalog = useQuery({
    queryKey: ["public", "custom-series-catalog"],
    queryFn: () => getCustomSeriesCatalog(),
    staleTime: 60_000,
  });
  setRuntimeCustomSeriesCatalog(customCatalog.data);
  const allSeries = (() => {
    const map = new Map<string, (typeof LEARNING_SERIES)[number]>();
    for (const series of [...getEffectiveLearningSeries(customCatalog.data), ...LEARNING_SERIES]) {
      if (!map.has(series.id)) map.set(series.id, series);
    }
    return [...map.values()];
  })();
  const choices =
    kind === "course"
      ? courses
          .filter((course) => course.status === "published")
          .map((course) => ({ id: course.id, title: course.title }))
      : kind === "test"
        ? (tests.data ?? [])
            .filter((test) => test.is_published)
            .map((test) => ({ id: test.id, title: test.title }))
        : allSeries.map((series) => ({
            id: series.id,
            title: `${series.name} · ${series.examTrack}`,
          }));
  const grant = useMutation({
    mutationFn: async () => {
      const student = profiles.find((profile) => profile.id === studentId);
      if (!student || !choices.some((choice) => choice.id === item))
        throw new Error("Select an existing student and published item.");
      const days = Number(validDays);
      if (!Number.isInteger(days) || days < 0 || days > 3650)
        throw new Error("Validity must be 0–3650 days; 0 means lifetime.");
      if (kind === "course")
        return grantCourse({
          data: {
            user_id: student.id,
            course_id: item,
            amount_paid: 0,
            payment_method: "admin free access",
            admin_note: "Manually assigned in Student Access",
            coin_bonus: 0,
            expires_at: days ? new Date(Date.now() + days * 86_400_000).toISOString() : null,
          },
        });
      const fields = {
        user_id: student.id,
        amount_inr: 0,
        method: "admin free access",
        note: "Manually assigned in Student Access",
        valid_days: days,
      };
      return kind === "test"
        ? grantTest({ data: { ...fields, test_id: item } })
        : grantSeries({ data: { ...fields, series_id: item } });
    },
    onSuccess: async () => {
      await invalidateLearningQueries(client);
      toast.success("Enrollment verified", {
        description: "Active access was read back from the backend for the selected student.",
      });
    },
    onError: (error) => toast.error(error.message),
  });
  return (
    <section className="surface-panel mb-8 p-6" data-testid="admin-enrollment-panel">
      <h2 className="text-xl font-bold">Assign Course, Test or Test Series</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Select the student's account ID and the exact content ID. This grants real access, not just
        a card label.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="enrollment-student">Enrollment student</Label>
          <select
            id="enrollment-student"
            className="mt-2 h-11 w-full rounded-xl border bg-background px-3 text-sm"
            value={studentId}
            onChange={(event) => {
              setStudentId(event.target.value);
              grant.reset();
            }}
          >
            <option value="">Select Student</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name || profile.email} · {profile.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="enrollment-kind">Enrollment type</Label>
          <select
            id="enrollment-kind"
            className="mt-2 h-11 w-full rounded-xl border bg-background px-3 text-sm"
            value={kind}
            onChange={(event) => {
              setKind(event.target.value as typeof kind);
              setItem("");
            }}
          >
            <option value="test">Test</option>
            <option value="course">Course</option>
            <option value="series">Test Series</option>
          </select>
        </div>
        <div>
          <Label htmlFor="enrollment-item">Enrollment item</Label>
          <select
            id="enrollment-item"
            className="mt-2 h-11 w-full rounded-xl border bg-background px-3 text-sm"
            value={item}
            onChange={(event) => setItem(event.target.value)}
          >
            <option value="">Select {kind}</option>
            {choices.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="enrollment-validity">Access validity (days)</Label>
          <Input
            id="enrollment-validity"
            className="mt-2 h-11"
            type="number"
            min={0}
            max={3650}
            value={validDays}
            onChange={(event) => setValidDays(event.target.value)}
          />
        </div>
      </div>
      <Button
        className="mt-5 rounded-full"
        disabled={!studentId || !item || grant.isPending}
        onClick={() => grant.mutate()}
      >
        {grant.isPending ? "Verifying access…" : "Grant Enrollment"}
      </Button>
      {tests.isError && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          Test list failed: {tests.error.message}
        </p>
      )}
      {grant.isError && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {grant.error.message}
        </p>
      )}
      {grant.isSuccess && (
        <p role="status" className="mt-3 text-sm text-primary">
          Enrollment verified. Student access is active.
        </p>
      )}
      <StudentAccessRemoval
        key={studentId}
        userId={studentId}
        onRemoved={() => grant.reset()}
        studentLabel={profiles.find((p) => p.id === studentId)?.email || studentId}
        titles={Object.fromEntries([
          ...courses.map((c) => [`course:${c.id}`, c.title]),
          ...(tests.data || []).map((t) => [`test:${t.id}`, t.title]),
          ...allSeries.map((s) => [`series:${s.id}`, s.name]),
        ])}
      />
    </section>
  );
}
