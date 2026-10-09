import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeOldEducationalContent } from "@/lib/content-reset.functions";
import { adoptBuiltInMaterials } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function ContentResetPanel() {
  const call = useServerFn(removeOldEducationalContent),
    adopt = useServerFn(adoptBuiltInMaterials),
    client = useQueryClient();
  const [phrase, setPhrase] = useState("");
  const [cutoff, setCutoff] = useState<string>();
  const sample = useMutation({
    mutationFn: () => adopt(),
    onSuccess: () => client.invalidateQueries(),
  });
  const mutation = useMutation({
    mutationFn: (action: "preview" | "remove") =>
      call({
        data: {
          action,
          ...(action === "remove" && cutoff ? { cutoff, confirmation: phrase } : {}),
        },
      }),
    onSuccess: async (result, action) => {
      setCutoff(result.cutoff);
      if (action === "remove") {
        setPhrase("");
        await client.invalidateQueries();
      }
    },
  });
  const r = mutation.data;
  return (
    <section
      data-testid="content-reset-panel"
      className="surface-panel mb-5 space-y-3 border border-destructive/40 p-5"
    >
      <h2 className="text-lg font-bold">Delete old notes/tests · keep student records</h2>
      <p className="text-sm">
        This removes old educational content from the website, not a move-to-Storage operation. Main
        Database text is cleared; small hidden ID records remain to protect student links. Student
        accounts, payments, grants, saved attempts and results stay untouched. Old paid content will
        no longer open.
      </p>
      <p className="text-sm">
        Back up Database AND Storage first. Removal cannot be undone here. Files still referenced
        elsewhere are protected; removed bodies in the two dedicated Supabase buckets are queued for
        deletion. Before deletion, existing attempt papers are verified in a separate private
        Supabase Storage bucket so saved results/reviews and ongoing attempts remain accessible.
        Shared PDF/image uploads, external Drive files, backups and these result snapshots are not
        erased.
      </p>
      <a className="block text-sm underline" href="/KKCC-Excellence-Hub-CONTENT-RESET.sql" download>
        Install Content Reset SQL
      </a>
      <Button
        variant="outline"
        disabled={mutation.isPending || sample.isPending}
        onClick={() => mutation.mutate("preview")}
      >
        Review old content counts
      </Button>
      {r && (
        <>
          <p data-testid="reset-counts">
            Remaining old rows: {r.remaining} · Pending Storage files: {r.pending_files}
          </p>
          <ul className="text-xs">
            {Object.entries(r.counts).map(([name, count]) => (
              <li key={name}>
                {name}: {count}
              </li>
            ))}
          </ul>
          <p className="text-xs">
            Cutoff: {r.cutoff}. New items created after this review are excluded. Do not edit old
            content, Storage files or backups while removal is running. Safety preparation verifies
            up to 5 attempt papers per call; repeat if more are pending. Then up to 500 rows per
            table and 100 queued files per call; repeat until both counts are zero.
          </p>
          <label className="block text-sm">
            Type DELETE OLD NOTES AND TESTS
            <Input
              aria-label="Old content deletion confirmation"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
            />
          </label>
          <Button
            variant="destructive"
            disabled={
              mutation.isPending ||
              sample.isPending ||
              phrase !== "DELETE OLD NOTES AND TESTS" ||
              (!r.remaining && !r.pending_files)
            }
            onClick={() => {
              if (
                window.confirm(
                  "PERMANENT removal of reviewed old notes/tests and their unreferenced body files. Backups taken? Student records/results stay, but old library content will stop opening.",
                )
              )
                mutation.mutate("remove");
            }}
          >
            Delete reviewed old content batch
          </Button>
          {r.errors.map((error) => (
            <p className="break-all text-sm" role="alert" key={error}>
              {error}
            </p>
          ))}
        </>
      )}
      <div className="space-y-2 border-t pt-3">
        <p className="text-sm">
          After removal completes, save the original sample notes into Supabase Storage. Existing
          live admin-edited samples are not overwritten. This does not create demo tests or copy the
          question template bank.
        </p>
        <Button
          disabled={
            sample.isPending || mutation.isPending || Boolean(r && (r.remaining || r.pending_files))
          }
          onClick={() => sample.mutate()}
        >
          Save sample notes to Supabase Storage
        </Button>
        {sample.isSuccess && (
          <p role="status">
            Sample notes saved in Supabase Storage; Database has metadata/references only.
          </p>
        )}
      </div>
      {mutation.isPending && <p role="status">Processing reviewed content…</p>}
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
      {sample.isError && <p role="alert">{sample.error.message}</p>}
    </section>
  );
}
