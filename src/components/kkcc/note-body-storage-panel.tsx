import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { manageNoteBodyStorage } from "@/lib/note-body.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function NoteBodyStoragePanel() {
  const call = useServerFn(manageNoteBodyStorage),
    client = useQueryClient();
  const [phrase, setPhrase] = useState("");
  const mutation = useMutation({
    mutationFn: (action: "preview" | "move") =>
      call({
        data: action === "preview" ? { action } : { action, confirmation: "MOVE NOTES TO STORAGE" },
      }),
    onSuccess: async (_, action) => {
      if (action === "move") {
        setPhrase("");
        await client.invalidateQueries({ queryKey: ["admin"] });
        await client.invalidateQueries({ queryKey: ["public"] });
      }
    },
  });
  const r = mutation.data;
  return (
    <section data-testid="note-body-storage-panel" className="surface-panel mb-5 space-y-3 p-5">
      <h2 className="text-lg font-bold">Note text → private Supabase Storage</h2>
      <p className="text-sm">
        New typed notes and edits save the full text in private Storage. Database keeps small
        metadata/reference records. Paid/course access is checked before reading. Existing database
        text continues working until moved.
      </p>
      <p className="text-sm">
        <a className="underline" href="/KKCC-Excellence-Hub-NOTE-BODIES.sql" download>
          Install Note Bodies SQL
        </a>{" "}
        before saving/moving notes. PDF links and thumbnails are unchanged. Typed notes support up
        to 200,000 characters; large scanned PDFs still need compression/splitting.
      </p>
      <Button
        variant="outline"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate("preview")}
      >
        Check note body storage
      </Button>
      {r && (
        <>
          <p data-testid="note-body-counts">
            Database text: {r.inline_count} notes ({(r.inline_bytes / 1048576).toFixed(2)} MB of
            text) · Storage-backed: {r.stored_count} notes
          </p>
          <p className="text-sm">
            Back up first. Each confirmed batch uploads and verifies up to 5 notes, then replaces
            only the database body with its reference. Concurrent edits are skipped. Old file
            versions/backups are retained; disk usage may not drop immediately.
          </p>
          <label className="block text-sm">
            Type MOVE NOTES TO STORAGE
            <Input
              aria-label="Note migration confirmation"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
            />
          </label>
          <Button
            disabled={mutation.isPending || !r.inline_count || phrase !== "MOVE NOTES TO STORAGE"}
            onClick={() => {
              if (
                window.confirm(
                  "Move up to 5 existing note bodies to private Storage? Text is cleared from the database only after upload verification. Backups and older object versions are retained.",
                )
              )
                mutation.mutate("move");
            }}
          >
            Move next 5 note bodies
          </Button>
          <p role="status">
            Last batch: {r.moved} moved · {r.skipped} changed concurrently (retry after review)
          </p>
          {r.errors.map((message) => (
            <p role="alert" key={message}>
              {message}
            </p>
          ))}
        </>
      )}
      {mutation.isPending && (
        <p role="status">Checking / verifying note files… keep this page open.</p>
      )}
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
    </section>
  );
}
