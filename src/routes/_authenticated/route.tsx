import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { isSandboxAdminSession, SANDBOX_ADMIN_USER } from "@/integrations/supabase/sandbox";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (isSandboxAdminSession()) return { user: SANDBOX_ADMIN_USER };

    if (!isSupabaseConfigured()) {
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
