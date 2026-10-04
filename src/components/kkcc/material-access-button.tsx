import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  BookOpen,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Lock,
  Printer,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KaatCoin } from "@/components/kkcc/kaat-coin";
import { useAuthUser } from "@/hooks/use-auth-user";
import { invalidateLearningQueries } from "@/hooks/use-learning-access";
import { getMyMaterialAccessUrl, spend23KaatForMaterial } from "@/lib/coins.functions";
import { coinPriceOf } from "@/lib/cms";
import { friendlyError } from "@/lib/storage";
import {
  KKCC_BRAND_PRIMARY,
  KKCC_BRAND_SECONDARY,
  describeVisuals,
  notesPrintDocument,
  renderNotesBody,
} from "@/lib/notes-visuals";
import { analyzeNotes } from "@/lib/notes-visuals/analyze";

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
  subject?: string | null | undefined;
  chapter?: string | null | undefined;
  materialType?: string | null | undefined;
  /** Plain text notes typed by the admin. Diagrams are generated from it. */
  description?: string | null | undefined;
  fontScale?: number | undefined;
}) {
  // One shared document builder, so screen and paper always match, and every
  // printed page carries the KKCC / Kusum Kartik Coaching Centre watermark.
  const html = notesPrintDocument({
    title: input.title || "KKCC Study Note",
    subject: input.subject,
    chapter: input.chapter,
    materialType: input.materialType,
    text: input.description ?? "",
    fontScale: input.fontScale ?? 16,
  });
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
  description: publicDescription,
  materialType,
  className = "mt-5 w-full",
}: {
  fileUrl: string | null;
  materialId?: string | undefined;
  accessType?: string | null | undefined;
  price?: number | null | undefined;
  coinPrice?: number | null | undefined;
  courseId?: string | null | undefined;
  title?: string | null | undefined;
  subject?: string | null | undefined;
  chapter?: string | null | undefined;
  description?: string | null | undefined;
  materialType?: string | null | undefined;
  className?: string | undefined;
}) {
  const { user, loading: authLoading } = useAuthUser();
  const client = useQueryClient();
  const fetchAccess = useServerFn(getMyMaterialAccessUrl);
  const spendCoins = useServerFn(spend23KaatForMaterial);
  const [loading, setLoading] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [fontScale, setFontScale] = useState<number>(15);
  const changeFont = (delta: number) =>
    setFontScale((scale) => Math.min(22, Math.max(13, scale + delta)));
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
      return { userId: user!.id, url: result.file_url, description: result.description };
    },
  });

  const description = free
    ? publicDescription
    : !access.isError && access.data?.userId === user?.id
      ? access.data?.description
      : "";
  const notesAnalysis = useMemo(() => analyzeNotes(description ?? ""), [description]);
  const generatedVisualCount = notesAnalysis.visuals.length;
  const noteBodyHtml = useMemo(
    () => renderNotesBody(description ?? "", { fontScale }),
    [description, fontScale],
  );

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

  /*
   * Paid notes, not unlocked yet: the student gets the exact same checkout as a
   * Batch or Test Series — Razorpay online, 23KAAT coins, or "contact Admin for
   * offline payment" when online payment is switched off.
   */
  const priceInr = Math.max(0, Number(price ?? 0));
  const coins = Math.max(0, Number(coinPrice ?? price ?? 0));
  if (!free && user && mode === "paid" && !resolvedUrl && materialId) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <Button asChild size="sm" className="w-full rounded-full font-semibold">
          <Link to="/checkout" search={{ note: materialId }}>
            <Lock className="mr-1.5 h-3.5 w-3.5" />
            {priceInr > 0 ? `Buy Notes — ₹${priceInr}` : `Unlock with ${coins} 23KAAT`}
          </Link>
        </Button>
        <p className="text-[11px] font-medium text-muted-foreground">
          Online payment, 23KAAT coins or Admin se offline payment — jaise Batch/Test Series me hota
          hai.
        </p>
      </div>
    );
  }

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
                  fontScale,
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
                    onClick={() => changeFont(-1)}
                    title="Decrease text size"
                  >
                    A-
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-full px-2.5 text-xs font-bold"
                    onClick={() => changeFont(1)}
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
                  <>
                    <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {generatedVisualCount
                          ? `${describeVisuals(notesAnalysis.visuals.map((entry) => entry.spec))} auto-generated from the text`
                          : "Add steps, points or numbers in the notes to auto-generate diagrams"}
                      </span>
                    </div>
                    <div
                      className="kkcc-note-reader rounded-2xl border bg-card p-4 leading-relaxed text-foreground sm:p-5"
                      dangerouslySetInnerHTML={{ __html: noteBodyHtml }}
                    />
                  </>
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
                        fontScale,
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
