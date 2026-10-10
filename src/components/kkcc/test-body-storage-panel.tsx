import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { manageTestBodyStorage } from "@/lib/test-body.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function TestBodyStoragePanel() {
  const call = useServerFn(manageTestBodyStorage),
    client = useQueryClient();
  const [source, setSource] = useState<"questions" | "legacy-questions" | "legacy-notes">(
      "questions",
    ),
    [phrase, setPhrase] = useState("");
  const mutation = useMutation({
    mutationFn: (action: "preview" | "move") =>
      call({ data: { action, source, confirmation: phrase } }),
    onSuccess: async (_, action) => {
      if (action === "move") {
        setPhrase("");
        await client.invalidateQueries({ queryKey: ["admin"] });
        await client.invalidateQueries({ queryKey: ["public"] });
      }
    },
  });
  const report = mutation.data;
  return (
    <section data-testid="test-body-storage-panel" className="surface-panel mb-5 space-y-3 p-5">
      <h2 className="text-lg font-bold">Test content → Supabase Storage</h2>
      <p className="text-sm">
        Questions, options and explanations are saved in a PRIVATE bucket inside Supabase Storage
        (not a separate provider). IDs, marks, grading fields and small metadata remain in Database.
        Student accounts, payments, access, attempts and results are NOT deleted or migrated.
      </p>
      <p className="text-sm">
        <a className="underline" href="/KKCC-Excellence-Hub-TEST-BODIES.sql" download>
          Install Test Bodies SQL
        </a>{" "}
        ·{" "}
        <a className="underline" href="/downloads/TEST-BODIES-HINDI.md">
          Backup and migration guide
        </a>
        . Current notes use the separate Note text panel. This installer does not clear existing
        content.
      </p>
      <label className="block text-sm">
        Content source
        <select
          aria-label="Content migration source"
          className="mt-1 block w-full rounded-md border bg-background p-2"
          value={source}
          disabled={mutation.isPending}
          onChange={(e) => {
            setSource(e.target.value as typeof source);
            setPhrase("");
            mutation.reset();
          }}
        >
          <option value="questions">Current test questions</option>
          <option value="legacy-questions">Historical test_questions table (if present)</option>
          <option value="legacy-notes">Historical materials table (if present)</option>
        </select>
      </label>
      <Button
        variant="outline"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate("preview")}
      >
        Check test / historical content storage
      </Button>
      {report && (
        <>
          <p data-testid="test-body-counts">
            Database bodies: {report.inline_count} ({(report.inline_bytes / 1048576).toFixed(2)} MB
            text) · Storage-backed rows: {report.stored_count}
          </p>
          <p className="text-sm">
            Back up Database AND Storage first. A batch verifies up to{" "}
            {source === "legacy-notes" ? 5 : 100} rows before clearing only their heavy database
            fields. Changed rows are skipped. No IDs/rows are deleted. Historical content is
            archived separately; it does not overwrite the current library. Old file versions remain
            until separately reviewed.
          </p>
          <label className="block text-sm">
            Type MOVE CONTENT TO STORAGE
            <Input
              aria-label="Test migration confirmation"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
            />
          </label>
          <Button
            disabled={
              mutation.isPending || !report.inline_count || phrase !== "MOVE CONTENT TO STORAGE"
            }
            onClick={() => {
              if (
                window.confirm(
                  "Move this content batch to verified private Storage and clear only its old database text? Student details, payments, attempts and results stay untouched.",
                )
              )
                mutation.mutate("move");
            }}
          >
            Move verified content batch
          </Button>
          <p role="status">
            Last batch: {report.moved} moved · {report.skipped} changed concurrently
          </p>
          {report.errors.map((error) => (
            <p role="alert" key={error}>
              {error}
            </p>
          ))}
        </>
      )}
      {mutation.isPending && <p role="status">Uploading / verifying… keep this page open.</p>}
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
    </section>
  );
}
