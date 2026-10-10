import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { checkStorageUsage, type StorageUsage } from "@/lib/storage-usage.functions";
const size = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
export function StorageUsagePanel() {
  const inspect = useServerFn(checkStorageUsage);
  const [report, setReport] = useState<StorageUsage | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const check = async () => {
    setBusy(true);
    setError("");
    try {
      setReport(await inspect());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Storage check failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="surface-panel mb-6 space-y-4 p-5" data-testid="storage-usage-panel">
      <h2 className="text-xl font-bold">Check storage usage</h2>
      <p className="text-sm">
        Read-only check: database size and Supabase uploaded files by bucket. No files, questions or
        student data are deleted.
      </p>
      <Button disabled={busy} onClick={() => void check()}>
        {busy ? "Checking storage…" : report ? "Refresh storage usage" : "Check storage usage"}
      </Button>
      <a className="block text-sm underline" href="/KKCC-Excellence-Hub-STORAGE-USAGE.sql" download>
        Download storage usage setup SQL
      </a>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {report && (
        <>
          <p role="status">Last checked: {new Date(report.checked_at).toLocaleString()}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <p className="rounded-xl border p-4">
              Database size <strong className="block text-xl">{size(report.database_bytes)}</strong>
            </p>
            <p className="rounded-xl border p-4">
              Uploaded file metadata total{" "}
              <strong className="block text-xl">
                {size(report.buckets.reduce((n, b) => n + b.bytes, 0))}
              </strong>
              {report.buckets.reduce((n, b) => n + b.files, 0)} files
            </p>
          </div>
          {report.buckets.map((b) => (
            <div key={b.bucket} className="flex flex-wrap justify-between gap-2 rounded border p-3">
              <strong className="break-all">{b.bucket}</strong>
              <span>
                {b.files} files · {size(b.bytes)}
                {b.unknown_sizes > 0 && ` · ${b.unknown_sizes} sizes unknown (not included)`}
              </span>
            </div>
          ))}
          {!report.buckets.length && <p>No Supabase Storage buckets found.</p>}
          <p className="text-xs text-muted-foreground">
            Database and file storage are separate quotas—do not add them to calculate plan
            capacity. File bytes come from object metadata, not billing. Remaining quota, backups,
            bandwidth, S3/R2, Drive and YouTube usage are not measured here; check provider
            dashboards. Refresh for a new reading.
          </p>
        </>
      )}
    </section>
  );
}
