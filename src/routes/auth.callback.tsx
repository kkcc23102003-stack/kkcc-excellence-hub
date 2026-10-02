import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, ShieldAlert } from "lucide-react";
import { AuthShell } from "@/components/kkcc/auth-shell";
import { SupabaseSetupAlert } from "@/components/kkcc/supabase-setup-alert";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { friendlyAuthError, safeRedirectPath } from "@/lib/auth";

const searchSchema = z.object({
  next: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
  code: z.string().optional(),
  type: z.string().optional(),
});

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Completing sign in — KKCC" }, { name: "robots", content: "noindex" }],
  }),
  component: AuthCallbackPage,
});

function getUrlParts() {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return { search, hash };
}

function AuthCallbackPage() {
  const configured = isSupabaseConfigured();
  const searchState = Route.useSearch();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!configured) return;

    let active = true;

    const complete = async () => {
      const { search, hash } = getUrlParts();
      const errorMessage =
        searchState.error_description ||
        searchState.error ||
        search.get("error_description") ||
        search.get("error") ||
        hash.get("error_description") ||
        hash.get("error");

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      const linkType = search.get("type") || hash.get("type") || searchState.type || "";
      const nextFromUrl = searchState.next || search.get("next") || hash.get("next");
      const isRecovery =
        linkType === "recovery" || safeRedirectPath(nextFromUrl, "/") === "/reset-password";
      const nextPath = isRecovery ? "/reset-password" : safeRedirectPath(nextFromUrl, "/");

      const code = search.get("code") || searchState.code;
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!active) return;

        if (exchangeError) {
          setError(friendlyAuthError(exchangeError));
          return;
        }

        window.location.replace(nextPath);
        return;
      }

      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!active) return;

        if (sessionError) {
          setError(friendlyAuthError(sessionError));
          return;
        }

        window.location.replace(nextPath);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (data.session) {
        window.location.replace(nextPath);
        return;
      }

      setError("Auth link data missing. Please request a fresh link from KKCC.");
    };

    void complete();

    return () => {
      active = false;
    };
  }, [
    configured,
    searchState.code,
    searchState.error,
    searchState.error_description,
    searchState.next,
    searchState.type,
  ]);

  if (!configured) {
    return (
      <AuthShell title="Completing sign in" description="App connection is required.">
        <SupabaseSetupAlert />
      </AuthShell>
    );
  }

  if (error) {
    return (
      <AuthShell
        title="Sign in link failed"
        description="The confirmation/reset link could not be completed."
        footer={
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        }
      >
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
          <ShieldAlert className="mb-2 h-5 w-5" />
          {error}
        </div>
        <Button asChild className="mt-4 w-full rounded-full">
          <Link to="/forgot-password">Request a fresh link</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Completing sign in" description="Please wait while we securely finish auth.">
      <div className="grid place-items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    </AuthShell>
  );
}
