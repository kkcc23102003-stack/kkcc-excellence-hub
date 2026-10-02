import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
): MaterialAccessType {
  return accessType === "free" || accessType === "paid" || accessType === "course"
    ? accessType
    : Number(price ?? 0) > 0
      ? "paid"
      : "course";
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
  const { user, loading: authLoading } = useAuthUser();
  const client = useQueryClient();
  const fetchAccess = useServerFn(getMyMaterialAccessUrl);
  const spendCoins = useServerFn(spend23KaatForMaterial);
  const [loading, setLoading] = useState(false);
  const mode = normaliseAccessType(accessType, price);
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
  // No private URL may survive an identity change, even for the first render after login.
  const resolvedUrl = free
    ? fileUrl
    : !access.isError && access.data?.userId === user?.id
      ? access.data?.url
      : null;
  if (!free && !user)
    return (
      <Button asChild size="sm" variant="outline" className={`${className} rounded-full`}>
        <Link to="/login" search={{ redirectTo: "/study-material" }}>
          <Lock className="mr-1.5 h-3.5 w-3.5" />
          {authLoading ? "Checking access…" : "Sign in to access"}
        </Link>
      </Button>
    );
  if (resolvedUrl)
    return (
      <Button asChild size="sm" variant="outline" className={`${className} rounded-full`}>
        <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Open resource
        </a>
      </Button>
    );
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
            toast.success("Material access verified. Use Open resource to view it.");
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
      {free ? "Resource not attached" : "Course enrollment required"}
    </Button>
  );
}
