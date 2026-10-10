import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { manageTestRetention } from "@/lib/test-retention.functions";
import { invalidateLearningQueries } from "@/hooks/use-learning-access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
export function TestRetentionPanel() {
  const client = useQueryClient(),
    manage = useServerFn(manageTestRetention);
  const query = useQuery({
    queryKey: ["admin", "test-retention"],
    queryFn: () => manage({ data: { action: "preview" } }),
    retry: false,
  });
  const [pendingMode, setPendingMode] = useState<boolean | null>(null),
    [cleanup, setCleanup] = useState(false),
    [phrase, setPhrase] = useState("");
  const [notice, setNotice] = useState("");
  const report = query.data;
  const mutation = useMutation({
    mutationFn: (
      data:
        | { action: "preview" }
        | { action: "set"; enabled: boolean }
        | { action: "cleanup"; before: string; confirmation: "DELETE TEST HISTORY" },
    ) => manage({ data }),
    onSuccess: async (result) => {
      client.setQueryData(["admin", "test-retention"], result);
      setNotice(
        result.deleted
          ? `${result.deleted} old attempts/results deleted. ${result.eligible_count} remain in this preview.`
          : `Saving is ${result.save_results ? "ON" : "OFF"}. Existing history is unchanged unless you run cleanup.`,
      );
      setPendingMode(null);
      setCleanup(false);
      setPhrase("");
      await invalidateLearningQueries(client);
    },
  });
  return (
    <section className="surface-panel mb-6 space-y-4 p-5" data-testid="test-retention-panel">
      <h2 className="text-xl font-bold">Test result storage</h2>
      <p className="text-sm">
        ON saves student attempts, answers and results. OFF uses temporary tests: results are shown
        only on the current page, with no database history, resume or saved analytics. Refresh/close
        loses progress.
      </p>
      <a href="/KKCC-Excellence-Hub-TEST-PRIVACY.sql" download className="text-sm underline">
        Download Test Privacy setup SQL
      </a>
      {query.isPending && <p>Loading privacy setting…</p>}
      {query.isError && <p role="alert">{query.error.message}</p>}
      <Button
        variant="outline"
        disabled={query.isFetching || mutation.isPending}
        onClick={() => void query.refetch()}
      >
        Refresh setting and history counts
      </Button>
      {report && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <strong>Save test results: {report.save_results ? "ON" : "OFF"}</strong>
            <Button
              role="switch"
              aria-label="Save test results"
              aria-checked={report.save_results}
              disabled={mutation.isPending}
              onClick={() => {
                setPendingMode(!report.save_results);
                mutation.reset();
              }}
            >
              Turn {report.save_results ? "OFF" : "ON"}
            </Button>
          </div>
          <p className="text-sm">
            Changing mode stops older open attempts from recording; students should start again.
            Initial setting is ON to preserve existing behaviour. Switching OFF does not delete old
            history automatically.
          </p>
          <div className="space-y-3 rounded-xl border p-4">
            <h3 className="font-semibold">Remove old test attempts and results</h3>
            <p data-testid="test-history-count">
              Saved attempts: {report.history_count} · Submitted results: {report.submitted_count}
            </p>
            <p className="text-sm">
              Permanent cleanup includes unfinished attempts, answers and scores. Student accounts,
              payments, access grants, admin tests/questions, notes and quiz-wallet records are not
              deleted. Old result links stop opening. Existing exports/provider backups are not
              erased. Preview first and check any backup you need.
            </p>
            <p className="text-sm">
              Up to {report.batch_limit} records per confirmed batch. Repeat until none remain. Turn
              saving OFF before cleanup.
            </p>
            <label className="block text-sm">
              Type DELETE TEST HISTORY
              <Input
                aria-label="History cleanup confirmation"
                value={phrase}
                onChange={(event) => setPhrase(event.target.value)}
                disabled={mutation.isPending}
              />
            </label>
            <Button
              variant="destructive"
              disabled={
                report.save_results ||
                !report.eligible_count ||
                phrase !== "DELETE TEST HISTORY" ||
                mutation.isPending
              }
              onClick={() => {
                setCleanup(true);
                mutation.reset();
              }}
            >
              Delete old test history
            </Button>
          </div>
        </>
      )}
      {notice && <p role="status">{notice}</p>}
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
      <Dialog
        open={pendingMode !== null || cleanup}
        onOpenChange={(open) => {
          if (!open && !mutation.isPending) {
            setPendingMode(null);
            setCleanup(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cleanup
                ? "Permanently delete test history?"
                : `Turn test result saving ${pendingMode ? "ON" : "OFF"}?`}
            </DialogTitle>
            <DialogDescription>
              {cleanup
                ? `This removes up to ${Math.min(report?.eligible_count || 0, report?.batch_limit || 5000)} previewed attempts, answers and results. This cannot be undone. Accounts, payments and questions remain untouched.`
                : "Existing history is not deleted. Older open attempts may need to restart after the mode changes. Temporary results never become saved results when you switch back ON."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => {
                setPendingMode(null);
                setCleanup(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={cleanup ? "destructive" : "default"}
              disabled={mutation.isPending}
              onClick={() => {
                if (cleanup && report)
                  mutation.mutate({
                    action: "cleanup",
                    before: report.cutoff,
                    confirmation: "DELETE TEST HISTORY",
                  });
                else if (pendingMode !== null)
                  mutation.mutate({ action: "set", enabled: pendingMode });
              }}
            >
              {mutation.isPending
                ? "Working…"
                : cleanup
                  ? "Confirm delete history"
                  : "Confirm setting"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
