import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listStudentGrants, type StudentGrant } from "@/lib/admin-student-grants.functions";
import { adminRevokeEnrollment } from "@/lib/enrollments.functions";
import { adminRevokeTestAccess, adminRevokeSeriesAccess } from "@/lib/test-access.functions";
import { invalidateLearningQueries } from "@/hooks/use-learning-access";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
export function StudentAccessRemoval({
  userId,
  studentLabel,
  titles,
  onRemoved,
}: {
  userId: string;
  studentLabel: string;
  titles: Record<string, string>;
  onRemoved: () => void;
}) {
  const client = useQueryClient(),
    list = useServerFn(listStudentGrants),
    course = useServerFn(adminRevokeEnrollment),
    test = useServerFn(adminRevokeTestAccess),
    series = useServerFn(adminRevokeSeriesAccess);
  const [selected, setSelected] = useState<StudentGrant | null>(null);
  const [message, setMessage] = useState("");
  const query = useQuery({
    queryKey: ["admin", "student-grants", userId],
    queryFn: () => list({ data: { user_id: userId } }),
    enabled: Boolean(userId),
  });
  const revoke = useMutation({
    mutationFn: async (row: StudentGrant) => {
      const fn = row.kind === "course" ? course : row.kind === "test" ? test : series;
      await fn({ data: { id: row.id } });
    },
    onSuccess: async () => {
      await invalidateLearningQueries(client);
      setSelected(null);
      onRemoved();
      setMessage("Selected access removed. Account and payment history preserved.");
    },
  });
  return (
    <section className="mt-6 space-y-3 border-t pt-5" data-testid="student-access-removal">
      <h3 className="text-lg font-bold">Remove student access</h3>
      <p className="text-sm text-muted-foreground">
        Select an Enrollment student above to see all their course, test and series grants. Removal
        revokes only that grant—not the student account, payment records or a refund. Free content
        or another valid entitlement may still allow access. Revoked grants remain as history;
        granting again may create a new active row.
      </p>
      {!userId ? (
        <p>Select a student first.</p>
      ) : (
        <>
          <p className="break-words font-medium">{studentLabel}</p>
          <Button
            variant="outline"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            Refresh access list
          </Button>
          {query.isPending && <p>Loading access…</p>}
          {query.isError && <p role="alert">{query.error.message}</p>}
          {message && <p role="status">{message}</p>}
          {query.data?.length === 0 && <p>No saved access grants for this student.</p>}
          {query.data?.map((row) => (
            <div
              key={`${row.kind}-${row.id}`}
              data-testid="student-grant-row"
              data-kind={row.kind}
              data-item-id={row.item_id}
              data-status={row.status}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"
            >
              <div className="min-w-0 flex-1 break-words">
                <strong>{titles[`${row.kind}:${row.item_id}`] || row.item_id}</strong>
                <p className="text-sm">
                  {row.kind} · {row.status} · {row.method}
                </p>
                <p className="text-xs">
                  {row.expires_at
                    ? `Validity: ${new Date(row.expires_at).toLocaleString()}`
                    : "No expiry"}
                </p>
              </div>
              <Button
                variant="destructive"
                disabled={row.status === "Revoked" || revoke.isPending}
                onClick={() => {
                  setSelected(row);
                  revoke.reset();
                  setMessage("");
                }}
              >
                Remove access
              </Button>
            </div>
          ))}
        </>
      )}
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !revoke.isPending) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove this access?</DialogTitle>
            <DialogDescription>
              {studentLabel} —{" "}
              {selected && (titles[`${selected.kind}:${selected.item_id}`] || selected.item_id)}.
              The grant will be marked revoked. No account or payment record is deleted. You can
              grant access again later.
            </DialogDescription>
          </DialogHeader>
          {revoke.isError && <p role="alert">{revoke.error.message}</p>}
          <DialogFooter>
            <Button variant="outline" disabled={revoke.isPending} onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={revoke.isPending || !selected}
              onClick={() => selected && revoke.mutate(selected)}
            >
              {revoke.isPending ? "Removing…" : "Confirm remove access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
