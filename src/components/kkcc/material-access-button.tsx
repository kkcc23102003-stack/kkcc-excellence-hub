import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { BookOpen, Copy, Download, ExternalLink, Loader2, Lock, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KaatCoin } from "@/components/kkcc/kaat-coin";
import { useAuthUser } from "@/hooks/use-auth-user";
import { invalidateLearningQueries } from "@/hooks/use-learning-access";
import { getMyMaterialAccessUrl, spend23KaatForMaterial } from "@/lib/coins.functions";
import { coinPriceOf } from "@/lib/cms";
import { friendlyError } from "@/lib/storage";

type MaterialAccessType = "course" | "free" | "paid";
function normaliseAccessType(
  accessType?: string | null,
  price?: number | null,
  courseId?: string | null,
): MaterialAccessType {
  if (accessType === "paid" || Number(price ?? 0) > 0) return "paid";
  if (accessType === "free" || !courseId) return "free";
  return "course";
}

function toEmbeddedMobilePreviewUrl(url: string | null | undefined): string | null {
  if (!url || url === "#" || url.startsWith("data:")) return null;
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch?.[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  const docsMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docsMatch?.[1]) {
    return `https://docs.google.com/document/d/${docsMatch[1]}/mobilebasic`;
  }
  if (/\.pdf(?:$|[?#])/i.test(url) || url.startsWith("/uploads/")) {
    return url;
  }
  return null;
}

function openPrintableNoteWindow(input: {
  title: string;
  subject?: string | null;
  chapter?: string | null;
  materialType?: string | null;
  description?: string | null;
}) {
  const escapedBody = (
    input.description ||
    `${input.title} — Complete Study Notes & Key Exam Revision Points.`
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"/><title>${input.title}</title><style>*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;width:100%;max-width:800px;margin:0 auto;padding:14px;line-height:1.75;color:#0f172a;background:#f8fafc;overflow-wrap:anywhere;word-break:break-word}h1{margin:0 0 10px;color:#0f172a;font-size:clamp(20px,4.8vw,28px);line-height:1.3}.meta{font-size:12px;font-weight:800;color:#0284c7;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:clamp(16px,4vw,28px);box-shadow:0 4px 20px rgba(15,23,42,.05);font-size:clamp(15px,3.8vw,16px)}.toolbar{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}.btn{padding:10px 18px;border-radius:999px;background:#0284c7;color:#fff;font-weight:700;border:none;cursor:pointer;font-size:14px}@media print{.toolbar{display:none}body{background:#fff;margin:0;padding:0}.card{border:none;box-shadow:none;padding:0}}</style></head><body><div class="toolbar"><button class="btn" onclick="window.print()">Print / Save as PDF</button></div><div class="card"><div class="meta">KKCC Excellence Hub · ${[input.subject, input.chapter, input.materialType].filter(Boolean).join(" · ")}</div><h1>${input.title}</h1><div>${escapedBody}</div></div></body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank", "noopener,noreferrer");
}

export function MaterialAccessButton({
  fileUrl,
  materialId,
  accessType,
  price,
  coinPrice,
  courseId,
  title,
  subject,
  chapter,
  description,
  materialType,
  className = "mt-5 w-full",
}: {
  fileUrl: string | null;
  materialId?: string;
  accessType?: string | null;
  price?: number | null;
  coinPrice?: number | null;
  courseId?: string | null;
  title?: string | null;
  subject?: string | null;
  chapter?: string | null;
  description?: string | null;
  materialType?: string | null;
  className?: string;
}) {
  const { user, loading: authLoading } = useAuthUser();
  const client = useQueryClient();
  const fetchAccess = useServerFn(getMyMaterialAccessUrl);
  const spendCoins = useServerFn(spend23KaatForMaterial);
  const [loading, setLoading] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [fontScale, setFontScale] = useState<number>(15);
  const mode = normaliseAccessType(accessType, price, courseId);
  const free = mode === "free";
  const access = useQuery({
    queryKey: ["student", user?.id, "material-url", materialId],
    enabled: Boolean(user && materialId && !free),
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    queryFn: async () => {
      const result = await fetchAccess({ data: { material_id: materialId! } });
      return { userId: user!.id, url: result.file_url };
    },
  });

  const resolvedUrl = free
    ? fileUrl
    : !access.isError && access.data?.userId === user?.id
      ? access.data?.url
      : null;

  const isInlineDataNote =
    !resolvedUrl || resolvedUrl === "#" || resolvedUrl.startsWith("data:text/html");
  const embeddedPreviewUrl = toEmbeddedMobilePreviewUrl(resolvedUrl);
  const hasReadableNote = Boolean(title || description || isInlineDataNote || embeddedPreviewUrl);

  if (!free && !user)
    return (
      <Button asChild size="sm" variant="outline" className={`${className} rounded-full`}>
        <Link to="/login" search={{ redirectTo: "/study-material" }}>
          <Lock className="mr-1.5 h-3.5 w-3.5" />
          {authLoading ? "Checking access…" : "Sign in to access"}
        </Link>
      </Button>
    );

  if (free || resolvedUrl) {
    return (
      <>
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
          {hasReadableNote ? (
            <Button
              type="button"
              size="sm"
              variant="default"
              className="flex-1 rounded-full font-semibold"
              onClick={() => setReaderOpen(true)}
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Read Notes
            </Button>
          ) : null}
          {!isInlineDataNote && resolvedUrl ? (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="flex-1 rounded-full font-semibold"
            >
              <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Open / Download
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full font-semibold"
              onClick={() =>
                openPrintableNoteWindow({
                  title: title || "KKCC Study Note",
                  subject,
                  chapter,
                  materialType,
                  description,
                })
              }
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Print / PDF
            </Button>
          )}
        </div>

        {readerOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => setReaderOpen(false)}
          >
            <div
              className="relative flex h-[100dvh] w-full max-w-full flex-col overflow-hidden rounded-none border-0 bg-background shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-3xl sm:border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Mobile-First Header */}
              <div className="sticky top-0 z-10 flex items-start justify-between gap-2 border-b bg-background/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="rounded-full text-[11px]">
                      {materialType || "Study Notes"}
                    </Badge>
                    {subject ? (
                      <Badge variant="outline" className="rounded-full text-[11px]">
                        {subject}
                      </Badge>
                    ) : null}
                    {chapter ? (
                      <Badge variant="outline" className="rounded-full text-[11px]">
                        {chapter}
                      </Badge>
                    ) : null}
                  </div>
                  <h2 className="mt-1.5 break-words text-base font-black leading-snug sm:text-xl">
                    {title || "Study Note"}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-full px-2.5 text-xs font-bold"
                    onClick={() => setFontScale((s) => Math.max(13, s - 1))}
                    title="Decrease text size"
                  >
                    A-
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-full px-2.5 text-xs font-bold"
                    onClick={() => setFontScale((s) => Math.min(22, s + 1))}
                    title="Increase text size"
                  >
                    A+
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setReaderOpen(false)}
                    aria-label="Close note reader"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Scrollable Mobile-Responsive Body */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6">
                {description ? (
                  <div
                    style={{ fontSize: `${fontScale}px` }}
                    className="whitespace-pre-wrap break-words rounded-2xl border bg-muted/20 p-4 leading-relaxed text-foreground sm:p-5"
                  >
                    {description}
                  </div>
                ) : null}

                {embeddedPreviewUrl ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border bg-muted/10">
                    <iframe
                      src={embeddedPreviewUrl}
                      title={title || "Study Note Document"}
                      className="h-[62dvh] w-full border-0 sm:h-[480px]"
                    />
                  </div>
                ) : !description ? (
                  <div
                    style={{ fontSize: `${fontScale}px` }}
                    className="whitespace-pre-wrap break-words rounded-2xl border bg-muted/20 p-4 leading-relaxed text-foreground sm:p-5"
                  >
                    {`${title || "Study Note"}\n\nSubject: ${subject || "General"}\nChapter: ${chapter || "Core Concepts"}\n\nUse the Print / Save PDF or Open File button below to view or save a copy for revision.`}
                  </div>
                ) : null}
              </div>

              {/* Sticky Mobile-First Footer */}
              <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 border-t bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-6 sm:py-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-full font-bold"
                    onClick={() =>
                      openPrintableNoteWindow({
                        title: title || "KKCC Study Note",
                        subject,
                        chapter,
                        materialType,
                        description,
                      })
                    }
                  >
                    <Printer className="mr-1.5 h-3.5 w-3.5" />
                    Print / Save as PDF
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${title || "KKCC Note"}\n\n${description || ""}`,
                      );
                      toast.success("Notes copied to clipboard!");
                    }}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copy Notes
                  </Button>
                  {!isInlineDataNote && resolvedUrl ? (
                    <Button asChild size="sm" variant="secondary" className="rounded-full">
                      <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Open Original File
                      </a>
                    </Button>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setReaderOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  if (!free && access.isPending && user)
    return (
      <Button size="sm" variant="outline" className={`${className} rounded-full`} disabled>
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        Checking resource access…
      </Button>
    );
  const error = access.error?.message || "";
  if (error && !/ACCESS_REQUIRED/.test(error))
    return (
      <div className={className}>
        <p role="alert" className="text-xs text-destructive">
          {friendlyError(access.error)}
        </p>
        <Button size="sm" variant="outline" onClick={() => void access.refetch()}>
          Retry resource access
        </Button>
      </div>
    );
  if (mode === "paid" && materialId)
    return (
      <Button
        size="sm"
        className={`${className} rounded-full`}
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            await spendCoins({ data: { material_id: materialId } });
            await invalidateLearningQueries(client);
            await access.refetch();
            toast.success("Material access verified. Use Read Notes to view it.");
            window.dispatchEvent(new Event("kkcc:23kaat-refresh"));
          } catch (error) {
            toast.error(friendlyError(error));
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : (
          <KaatCoin size="xs" className="mr-1.5" />
        )}
        Unlock {coinPriceOf({ price, coin_price: coinPrice })} 23KAAT
      </Button>
    );
  return (
    <Button size="sm" variant="outline" className={`${className} rounded-full`} disabled>
      <Lock className="mr-1.5 h-3.5 w-3.5" />
      Course enrollment required
    </Button>
  );
}
