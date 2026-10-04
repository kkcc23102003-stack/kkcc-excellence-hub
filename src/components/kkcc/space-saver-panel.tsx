import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inspectDatabaseSpace, type SpaceReport } from "@/lib/space-saver.functions";
const SQL_URL = "/__fixture__/supabase/download/space-saver.sql";
const size = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
export function SpaceSaverPanel() {
  const inspect = useServerFn(inspectDatabaseSpace);
  const [report, setReport] = useState<SpaceReport | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = async (cleanup: boolean) => {
    if (cleanup && (!report?.preview || confirmation !== "CLEAN OLD DRAFTS")) return;
    setBusy(true);
    setError("");
    try {
      const result = await inspect({
        data: cleanup
          ? { cleanup: true, cutoff: report!.cutoff, confirmation: "CLEAN OLD DRAFTS" }
          : { cleanup: false },
      });
      setReport(result);
      setConfirmation("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="surface-panel mb-6 space-y-4 p-5">
      <h2 className="text-lg font-bold">Free-plan space saver</h2>
      <p className="text-sm text-muted-foreground">
        Published questions, notes text and templates already use private project content, not
        Supabase tables. Keep a backup of that content and use persistent hosting storage. Drive
        links avoid copying PDFs into Supabase Storage; their sharing permissions remain your
        responsibility.
      </p>
      <a className="text-sm underline" href={SQL_URL}>
        Download Space Saver SQL — one-time setup, deletes nothing
      </a>
      <div>
        <Button type="button" disabled={busy} onClick={() => void run(false)}>
          {busy ? "Working…" : "Preview database usage & old drafts"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {report && (
        <>
          <p className="font-semibold">Database: {size(report.database_bytes)}</p>
          <p className="text-xs text-muted-foreground">
            Measured PostgreSQL size, not remaining plan quota. Supabase Storage files and billing
            usage are separate—check your Supabase dashboard. Cleanup frees reusable space; the
            displayed size may not shrink immediately.
          </p>
          <div className="max-h-52 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Largest public tables (including indexes)</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {report.tables.map((table) => (
                  <tr key={table.name}>
                    <td>{table.name}</td>
                    <td>{size(table.bytes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {report.preview ? (
            <>
              <p>
                {report.eligible_batch} eligible abandoned attempts in this batch (max{" "}
                {report.batch_limit}).
              </p>
              <p className="text-sm">
                Only never-submitted drafts started AND expired before{" "}
                {new Date(report.cutoff).toLocaleDateString()} (at least 90 days old). Submitted
                results, payments, access grants, users, notes and files are not deleted. Deleted
                drafts cannot be resumed. Export a database backup first.
              </p>
              {report.eligible_batch > 0 && (
                <>
                  <Input
                    aria-label="Cleanup confirmation"
                    placeholder="Type CLEAN OLD DRAFTS to confirm"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    disabled={busy}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={busy || confirmation !== "CLEAN OLD DRAFTS"}
                    onClick={() => void run(true)}
                  >
                    Permanently delete eligible old drafts
                  </Button>
                </>
              )}
            </>
          ) : (
            <p role="status">
              Deleted {report.deleted} abandoned drafts. Preview again before any further batch.
            </p>
          )}
        </>
      )}
    </section>
  );
}
