import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (!isSupabaseConfigured()) {
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    const role = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
    if (role.error) throw new Error("Admin permission could not be verified. Please retry.");
    if (!role.data) throw redirect({ to: "/dashboard" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
