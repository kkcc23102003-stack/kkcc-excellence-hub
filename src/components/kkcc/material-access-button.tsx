import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KaatCoin } from "@/components/kkcc/kaat-coin";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { getMyMaterialAccessUrl, spend23KaatForMaterial } from "@/lib/coins.functions";
import { coinPriceOf } from "@/lib/cms";
import { friendlyError } from "@/lib/storage";

type MaterialAccessType = "course" | "free" | "paid";

function normaliseAccessType(
  accessType?: string | null,
  price?: number | null,
): MaterialAccessType {
  if (accessType === "free" || accessType === "paid" || accessType === "course") return accessType;
  return Number(price ?? 0) > 0 ? "paid" : "course";
}

function openUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function MaterialAccessButton({
  fileUrl,
  materialId,
  accessType,
  price,
  coinPrice,
  className = "mt-5 w-full",
}: {
  fileUrl: string | null;
  materialId?: string;
  accessType?: string | null;
  price?: number | null;
  coinPrice?: number | null;
  className?: string;
}) {
  const configured = isSupabaseConfigured();
  const fetchAccess = useServerFn(getMyMaterialAccessUrl);
  const spendCoins = useServerFn(spend23KaatForMaterial);
  const [signedIn, setSignedIn] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState(fileUrl);
  const [loading, setLoading] = useState(false);
  const mode = normaliseAccessType(accessType, price);
  const paid = mode === "paid";
  const free = mode === "free";
  const labelPrice = coinPriceOf({ price, coin_price: coinPrice });

  useEffect(() => setResolvedUrl(fileUrl), [fileUrl]);

  useEffect(() => {
    if (!configured) return;

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [configured]);

  useEffect(() => {
    if (!signedIn || !materialId || resolvedUrl) return;
    let active = true;
    void fetchAccess({ data: { material_id: materialId } })
      .then((payload) => {
        const result = payload as { file_url?: string };
        if (!active) return;
        if (typeof result.file_url === "string" && result.file_url) {
          setResolvedUrl(result.file_url);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [fetchAccess, materialId, resolvedUrl, signedIn]);

  if (!free && !signedIn) {
    return (
      <Button asChild size="sm" variant="outline" className={`${className} rounded-full`}>
        <Link to="/login" search={{ redirectTo: "/study-material" }}>
          <Lock className="mr-1.5 h-3.5 w-3.5" /> Sign in to access
        </Link>
      </Button>
    );
  }

  if (resolvedUrl) {
    return (
      <Button asChild size="sm" variant="outline" className={`${className} rounded-full`}>
        <a href={resolvedUrl} target="_blank" rel="noreferrer">
          <Download className="mr-1.5 h-3.5 w-3.5" /> Open resource
        </a>
      </Button>
    );
  }

  if (paid && materialId) {
    return (
      <Button
        size="sm"
        className={`${className} rounded-full`}
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            const result = (await spendCoins({ data: { material_id: materialId } })) as {
              file_url?: string;
              balance?: number;
            };
            const nextUrl = typeof result.file_url === "string" ? result.file_url : "";
            if (nextUrl) {
              setResolvedUrl(nextUrl);
              toast.success(
                `Unlocked with 23KAAT${result.balance != null ? ` · Balance ${result.balance}` : ""}`,
              );
              window.dispatchEvent(new Event("kkcc:23kaat-refresh"));
              openUrl(nextUrl);
            } else {
              toast.error("Material unlocked but file URL is not available yet.");
            }
          } catch (error) {
            toast.error(friendlyError(error instanceof Error ? error : new Error(String(error))));
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
        Unlock {labelPrice ? `${labelPrice} 23KAAT` : "with 23KAAT"}
      </Button>
    );
  }

  if (paid) {
    return (
      <Button asChild size="sm" className={`${className} rounded-full`}>
        <Link to="/support">
          <Lock className="mr-1.5 h-3.5 w-3.5" /> Buy notes{labelPrice ? ` ₹${labelPrice}` : ""}
        </Link>
      </Button>
    );
  }

  return (
    <div
      className={`${className} rounded-full border border-dashed px-4 py-2 text-center text-xs font-medium text-muted-foreground`}
    >
      File is being prepared
    </div>
  );
}
