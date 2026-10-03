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
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${input.title}</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:840px;margin:32px auto;padding:24px;line-height:1.75;color:#0f172a;background:#f8fafc}h1{margin:0 0 10px;color:#0f172a;font-size:26px}.meta{font-size:12px;font-weight:800;color:#0284c7;text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(15,23,42,.05)}.toolbar{display:flex;gap:10px;margin-bottom:16px}.btn{padding:8px 16px;border-radius:999px;background:#0284c7;color:#fff;font-weight:700;border:none;cursor:pointer;font-size:13px}@media print{.toolbar{display:none}body{background:#fff;margin:0;padding:0}.card{border:none;box-shadow:none;padding:0}}</style></head><body><div class="toolbar"><button class="btn" onclick="window.print()">Print / Save as PDF</button></div><div class="card"><div class="meta">KKCC Excellence Hub · ${[input.subject, input.chapter, input.materialType].filter(Boolean).join(" · ")}</div><h1>${input.title}</h1><div>${escapedBody}</div></div></body></html>`;
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
  const hasReadableNote = Boolean(title || description || isInlineDataNote);

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
              variant={isInlineDataNote ? "default" : "outline"}
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
              variant="default"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setReaderOpen(false)}
          >
            <div
              className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl border bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {materialType || "Study Notes"}
                    </Badge>
                    {subject ? (
                      <Badge variant="outline" className="rounded-full text-xs">
                        {subject}
                      </Badge>
                    ) : null}
                    {chapter ? (
                      <Badge variant="outline" className="rounded-full text-xs">
                        {chapter}
                      </Badge>
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-xl font-black">{title || "Study Note"}</h2>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setReaderOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 whitespace-pre-wrap rounded-2xl border bg-muted/20 p-5 text-sm leading-relaxed text-foreground">
                {description ||
                  `${title || "Study Note"}\n\nSubject: ${subject || "General"}\nChapter: ${chapter || "Core Concepts"}\n\nUse the Print / Save PDF or Open File button below to keep a copy for revision.`}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
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
                        Open Attached File
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
