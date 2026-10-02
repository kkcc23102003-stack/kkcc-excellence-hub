import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { BottomNav } from "./bottom-nav";
import { AdminShortcut } from "./admin-shortcut";
import { AppBuilderRuntime } from "./app-builder-runtime";
import { ContentProtection } from "./content-protection";
import { BlockedAccountGate } from "./blocked-account-gate";
import { useAppControls } from "./app-controls-provider";

function MaintenanceNotice() {
  const controls = useAppControls();

  return (
    <div className="mx-auto flex min-h-[62vh] w-full max-w-3xl items-center px-4 py-16 sm:px-6">
      <section className="surface-panel w-full p-8 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Settings className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
          KKCC is being refreshed
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {controls.maintenanceMessage}
        </p>
        <Button asChild className="mt-7 rounded-full">
          <Link to="/">Back to home</Link>
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          Admin tools remain available for authorised team members.
        </p>
      </section>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const controls = useAppControls();
  const location = useLocation();
  const maintenanceActive = controls.maintenanceMode && !location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <AppBuilderRuntime position="top" />
      <main className="flex-1 pb-20 lg:pb-0">
        {maintenanceActive ? <MaintenanceNotice /> : children}
      </main>
      <AppBuilderRuntime position="bottom" />
      <SiteFooter />
      <ContentProtection />
      <BlockedAccountGate />
      <AdminShortcut />
      <BottomNav />
    </div>
  );
}

export function FeatureUnavailable({
  title,
  description,
  actionTo = "/",
  actionLabel = "Back to home",
}: {
  title: string;
  description: string;
  actionTo?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[62vh] w-full max-w-3xl items-center px-4 py-16 sm:px-6">
      <section className="surface-panel w-full p-8 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
        <Button asChild className="mt-7 rounded-full">
          <a href={actionTo}>{actionLabel}</a>
        </Button>
      </section>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
