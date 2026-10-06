import { uploadThumbnail } from "@/lib/thumbnail.functions";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContentThumbnail } from "./content-thumbnail";
import type { ThumbnailValue } from "@/lib/thumbnail";
import { thumbnailUrlSchema } from "@/lib/thumbnail";
import { previewAdminNoteImages } from "@/lib/storage-upload.functions";
export function ThumbnailEditor({
  value,
  onChange,
  title,
  disabled = false,
  onBusyChange,
}: {
  value: ThumbnailValue;
  onChange: (value: ThumbnailValue) => void;
  title: string;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [mode, setMode] = useState(value.thumbnail_text ? "text" : "image"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const preview = useServerFn(previewAdminNoteImages);
  const upload = useServerFn(uploadThumbnail);
  const ref = value.thumbnail_url;
  const image = useQuery({
    queryKey: ["admin", "thumbnail-preview", ref],
    enabled: Boolean(ref?.startsWith("kkcc-file://")),
    queryFn: () => preview({ data: { refs: [ref!] } }),
    staleTime: 5 * 60 * 1000,
  });
  return (
    <fieldset
      disabled={disabled || busy}
      className="min-w-0 space-y-3 rounded-xl border p-4"
      data-testid="thumbnail-editor"
    >
      <legend className="px-2 font-semibold">Thumbnail — image or text</legend>
      <p className="text-xs text-muted-foreground">
        Covers are public, including paid-item covers. Do not upload private note pages here. First
        setup:{" "}
        <a className="underline" href="/KKCC-Excellence-Hub-THUMBNAILS.sql" download>
          Thumbnail SQL
        </a>
        .
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={mode === "image" ? "default" : "outline"}
          onClick={() => setMode("image")}
        >
          Image thumbnail
        </Button>
        <Button
          type="button"
          variant={mode === "text" ? "default" : "outline"}
          onClick={() => setMode("text")}
        >
          Text thumbnail
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onChange({ thumbnail_url: null, thumbnail_text: null });
            setError("");
          }}
        >
          Remove thumbnail
        </Button>
      </div>
      {mode === "text" ? (
        <label className="block text-sm">
          Thumbnail text
          <Textarea
            aria-label="Thumbnail text"
            maxLength={200}
            value={value.thumbnail_text || ""}
            placeholder="Write a heading, subject or chapter…"
            onChange={(event) =>
              onChange({ thumbnail_text: event.target.value || null, thumbnail_url: null })
            }
          />
        </label>
      ) : (
        <>
          <label className="block text-sm">
            Image URL
            <Input
              aria-label="Thumbnail image URL"
              value={value.thumbnail_url || ""}
              placeholder="https://… or upload an image"
              onChange={(event) => {
                const url = event.target.value;
                setError(
                  thumbnailUrlSchema.safeParse(url).success ? "" : "Use an http(s) image URL.",
                );
                onChange({ thumbnail_url: url || null, thumbnail_text: null });
              }}
            />
          </label>
          <label className="block text-sm">
            Upload / replace thumbnail
            <Input
              aria-label="Upload thumbnail image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                if (
                  !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
                  file.size > 10 * 1024 * 1024
                ) {
                  setError("Use a JPG, PNG or WebP image up to 10 MB.");
                  return;
                }
                setBusy(true);
                onBusyChange?.(true);
                setError("");
                try {
                  const { compressImageFile } = await import("@/lib/image-compress");
                  const compressed = await compressImageFile(file, {
                    maxSize: 1280,
                    quality: 0.82,
                  });
                  const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onerror = () => reject(new Error("Could not read image"));
                    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
                    reader.readAsDataURL(compressed.file);
                  });
                  const uploaded = await upload({
                    data: {
                      base64,
                      mime: compressed.file.type as "image/png" | "image/jpeg" | "image/webp",
                    },
                  });
                  onChange({ thumbnail_url: uploaded.url, thumbnail_text: null });
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Upload failed. Retry.");
                } finally {
                  setBusy(false);
                  onBusyChange?.(false);
                }
              }}
            />
          </label>
        </>
      )}
      {busy && <p role="status">Uploading thumbnail… wait before saving.</p>}
      {error && <p role="alert">{error}</p>}
      {image.isError && <p role="alert">Image preview could not load. Retry after reconnecting.</p>}
      <div className="max-w-md">
        <ContentThumbnail
          title={title}
          value={{
            ...value,
            thumbnail_url: ref?.startsWith("kkcc-file://") ? image.data?.[ref] || null : ref,
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Preview only until you save. Remove clears the cover, not the note/test. Previously uploaded
        files are retained so shared images do not break.
      </p>
    </fieldset>
  );
}
