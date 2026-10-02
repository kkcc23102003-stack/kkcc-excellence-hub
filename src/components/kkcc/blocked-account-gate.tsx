import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ban, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/use-auth-user";

type BlockStatus = {
  is_blocked: boolean;
  reason: string;
  blocked_at: string | null;
};

export function BlockedAccountGate() {
  const { configured, user, setUser } = useAuthUser();
  const [status, setStatus] = useState<BlockStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus(null);

    if (!configured || !user) return undefined;

    void (async () => {
      try {
        const { data, error } = await supabase.rpc("get_my_block_status");
        if (cancelled) return;
        if (error) {
          // The app can still run before the latest SQL is applied.
          console.warn("[security] block status unavailable", error.message);
          return;
        }
        const row = Array.isArray(data) ? data[0] : data;
        setStatus(
          row
            ? {
                is_blocked: Boolean(row.is_blocked),
                reason: String(row.reason ?? ""),
                blocked_at: row.blocked_at ?? null,
              }
            : { is_blocked: false, reason: "", blocked_at: null },
        );
      } catch (error) {
        if (!cancelled) console.warn("[security] block status unavailable", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [configured, user]);

  if (!status?.is_blocked) return null;

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.assign("/login");
  };

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-background/95 px-4 backdrop-blur-xl">
      <div className="max-w-lg rounded-3xl border bg-card p-7 text-center shadow-lift sm:p-9">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-destructive/10 text-destructive">
          <Ban className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-black tracking-tight">Account access blocked</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your KKCC app access has been paused by admin. Courses, videos, notes, tests and student
          tools are locked until admin restores access.
        </p>
        {status.reason && (
          <p className="mt-4 rounded-2xl border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            Reason: {status.reason}
          </p>
        )}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-full">
            <Link to="/support">Contact support</Link>
          </Button>
          <Button variant="outline" className="rounded-full" onClick={signOut}>
            <LogOut className="mr-1.5 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
