import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  FileText,
  ClipboardList,
  BarChart3,
  Bell,
  HelpCircle,
  User as UserIcon,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { SiteLayout } from "@/components/kkcc/site-layout";
import { Badge } from "@/components/ui/badge";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { displayNameFromUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (!isSupabaseConfigured()) {
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login", search: { redirectTo: location.href } });
    }

    return { user: data.user as User };
  },
  component: DashboardLayout,
});

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/student", label: "Student Section", icon: GraduationCap, exact: false },
  { to: "/dashboard/courses", label: "My Courses", icon: BookOpen, exact: false },
  { to: "/dashboard/live", label: "Live Classes", icon: PlayCircle, exact: false },
  { to: "/dashboard/materials", label: "Study Material", icon: FileText, exact: false },
  { to: "/dashboard/tests", label: "Tests & Results", icon: ClipboardList, exact: false },
  { to: "/dashboard/progress", label: "My Progress", icon: BarChart3, exact: false },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell, exact: false },
  { to: "/dashboard/doubts", label: "Ask Doubt", icon: HelpCircle, exact: false },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon, exact: false },
] as const;

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = Route.useRouteContext();
  const { isAdmin } = useAdminStatus(user);
  const name = displayNameFromUser(user);
  const navItems = isAdmin
    ? [...NAV, { to: "/admin", label: "Admin Panel", icon: ShieldCheck, exact: false }]
    : NAV;

  return (
    <SiteLayout>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav className="lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-4 rounded-2xl border bg-card p-4 shadow-soft">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-3 rounded-full text-[11px]">
              <ShieldCheck className="mr-1 h-3 w-3" /> Signed in
            </Badge>
          </div>
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to} className="shrink-0">
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </SiteLayout>
  );
}
