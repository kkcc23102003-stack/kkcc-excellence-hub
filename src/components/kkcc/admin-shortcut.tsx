import { Link, useRouterState } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useAuthUser } from "@/hooks/use-auth-user";

export function AdminShortcut() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuthUser();
  const { isAdmin } = useAdminStatus(user);

  if (!isAdmin || pathname.startsWith("/admin")) return null;

  return (
    <Link
      to="/admin"
      className="fixed bottom-20 right-4 z-50 inline-flex items-center gap-2 rounded-full border bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:scale-[1.02] lg:bottom-6"
    >
      <ShieldCheck className="h-4 w-4" /> Admin Panel
    </Link>
  );
}
