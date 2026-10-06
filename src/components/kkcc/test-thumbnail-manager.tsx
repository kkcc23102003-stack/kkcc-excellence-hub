import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { saveTestThumbnail } from "@/lib/thumbnail.functions";
import type { TestRow } from "@/integrations/supabase/db";
import { ThumbnailEditor } from "./thumbnail-editor";
import { Button } from "@/components/ui/button";
import type { ThumbnailValue } from "@/lib/thumbnail";
export function TestThumbnailManager({ tests }: { tests: TestRow[] }) {
  const [id, setId] = useState("");
  const test = tests.find((t) => t.id === id);
  return (
    <section className="space-y-3 p-3">
      <p>
        All free/paid tests, including Easy and Subjects & Chapters tests. Save the test first, then
        choose it here.
      </p>
      <label className="block">
        Choose test thumbnail
        <select
          aria-label="Choose test thumbnail"
          className="mt-2 min-w-0 w-full max-w-full rounded-lg border bg-background p-2"
          value={id}
          onChange={(e) => setId(e.target.value)}
        >
          <option value="">Select a test</option>
          {tests.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} · {t.is_paid ? "Paid" : "Free"}
            </option>
          ))}
        </select>
      </label>
      {test && <TestThumbnailForm key={test.id} test={test} />}
    </section>
  );
}
function TestThumbnailForm({ test }: { test: TestRow }) {
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState<ThumbnailValue>({
    thumbnail_url: test.thumbnail_url || null,
    thumbnail_text: test.thumbnail_text || null,
  });
  const client = useQueryClient(),
    save = useServerFn(saveTestThumbnail);
  const mutation = useMutation({
    mutationFn: () => save({ data: { id: test.id, ...value } }),
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: ["admin"] }),
        client.invalidateQueries({ queryKey: ["public"] }),
        client.invalidateQueries({ queryKey: ["student"] }),
      ]),
  });
  return (
    <div className="space-y-3">
      <ThumbnailEditor
        value={value}
        onChange={(v) => {
          setValue(v);
          mutation.reset();
        }}
        title={test.title}
        onBusyChange={setUploading}
        disabled={mutation.isPending}
      />
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || uploading}>
        Save test thumbnail
      </Button>
      {mutation.isSuccess && <p role="status">Test thumbnail saved.</p>}
      {mutation.isError && (
        <p role="alert">{mutation.error.message}. Check that Thumbnail SQL is installed.</p>
      )}
    </div>
  );
}
