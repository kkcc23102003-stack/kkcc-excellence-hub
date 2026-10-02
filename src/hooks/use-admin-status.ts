import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { isSandboxAdminSession, SANDBOX_ADMIN_USER } from "@/integrations/supabase/sandbox";

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

  const sandboxAdmin = isSandboxAdminSession() && user?.id === SANDBOX_ADMIN_USER.id;
  return {
    isAdmin: sandboxAdmin || Boolean(query.data),
    loading: !sandboxAdmin && (query.isLoading || query.isFetching),
  };
}
