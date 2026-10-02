import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";

export function useAdminStatus(user: User | null | undefined) {
  const configured = !!getSupabasePublicConfig();
  const userId = user?.id;

  const query = useQuery({
    queryKey: ["admin-status", userId],
    enabled: configured && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId!,
        _role: "admin",
      });
      if (error) {
        console.error("[admin] role check failed", error);
        return false;
      }
      return Boolean(data);
    },
  });

  return { isAdmin: Boolean(query.data), loading: query.isLoading || query.isFetching };
}
