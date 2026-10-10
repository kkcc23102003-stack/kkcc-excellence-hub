import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { publicThumbnail } from "@/lib/thumbnail.functions";
import type { ThumbnailValue } from "@/lib/thumbnail";
export function ContentThumbnail({
  value,
  title,
  kind,
  id,
}: {
  value: ThumbnailValue;
  title: string;
  kind?: "tests" | "materials";
  id?: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const resolve = useServerFn(publicThumbnail);
  const internal = value.thumbnail_url?.startsWith("kkcc-file://");
  const query = useQuery({
    queryKey: ["public", "thumbnail", kind, id, value.thumbnail_url],
    enabled: Boolean(internal && kind && id && !value.thumbnail_text),
    queryFn: () => resolve({ data: { kind: kind!, id: id! } }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const url = internal ? query.data : value.thumbnail_url;
  if (!value.thumbnail_text && !value.thumbnail_url) return null;
  return (
    <div
      data-testid="content-thumbnail"
      className="mb-4 flex aspect-video w-full min-w-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-primary/10 text-primary"
    >
      {value.thumbnail_text || !url || failed === url ? (
        <span className="whitespace-pre-wrap break-words p-5 text-center text-lg font-bold [overflow-wrap:anywhere]">
          {value.thumbnail_text || title}
        </span>
      ) : (
        <img
          src={url}
          alt={`${title} cover`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(url)}
        />
      )}
    </div>
  );
}
