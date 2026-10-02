import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuthUser } from "@/hooks/use-auth-user";
import { getMyLearningAccess } from "@/lib/test-access.functions";

export function useLearningAccess() {
  const { user, loading } = useAuthUser();
  const client = useQueryClient();
  const fetchAccess = useServerFn(getMyLearningAccess);
  const query = useQuery({
    queryKey: ["student", user?.id, "learning-access"],
    enabled: Boolean(user),
    queryFn: () => fetchAccess(),
    retry: 1,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: "always",
    refetchInterval: 15_000,
  });
  useEffect(() => {
    if (!user) return;
    let cleanup: (() => void) | undefined;
    let active = true;
    void import("@/integrations/supabase/client").then(({ supabase }) => {
      if (!active) return;
      const channel = supabase.channel(`learning-access:${user.id}`);
      for (const table of ["course_enrollments", "test_access_grants", "series_access_grants"]) {
        channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table, filter: `user_id=eq.${user.id}` },
          () => {
            void client.invalidateQueries({ queryKey: ["student", user.id] });
          },
        );
      }
      channel.subscribe();
      cleanup = () => {
        void supabase.removeChannel(channel);
      };
    });
    return () => {
      active = false;
      cleanup?.();
    };
  }, [user, client]);
  return { ...query, user, authLoading: loading };
}

export function invalidateLearningQueries(client: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    client.invalidateQueries({ queryKey: ["student"] }),
    client.invalidateQueries({ queryKey: ["my"] }),
    client.invalidateQueries({ queryKey: ["test-attempt"] }),
    client.invalidateQueries({ queryKey: ["admin"] }),
    client.invalidateQueries({ queryKey: ["public"] }),
  ]);
}
