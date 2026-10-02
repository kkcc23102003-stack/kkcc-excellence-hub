import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";
import { isSandboxAdminSession, SANDBOX_ADMIN_USER } from "@/integrations/supabase/sandbox";

type AuthUserContextValue = {
  configured: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  sandboxEnabled: boolean;
  setSandboxEnabled: (enabled: boolean) => void;
};

const AuthUserContext = createContext<AuthUserContextValue | null>(null);

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const configured = !!getSupabasePublicConfig();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);
  const [sandboxEnabled, setSandboxEnabled] = useState(false);

  useEffect(() => {
    if (isSandboxAdminSession()) {
      setUser(SANDBOX_ADMIN_USER);
      setSandboxEnabled(true);
      setLoading(false);
      return;
    }

    setSandboxEnabled(false);
    if (!configured) {
      setUser(null);
      setLoading(false);
      return;
    }

    let active = true;
    let unsubscribe: (() => void) | undefined;

    setLoading(true);

    void import("@/integrations/supabase/client")
      .then(({ supabase }) => {
        if (!active) return;

        void supabase.auth
          .getSession()
          .then(({ data }) => {
            if (active) setUser(data.session?.user ?? null);
          })
          .finally(() => {
            if (active) setLoading(false);
          });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });
        unsubscribe = () => subscription.subscription.unsubscribe();
      })
      .catch((error) => {
        console.error("[auth] lazy session load failed", error);
        if (active) {
          setUser(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [configured]);

  const value = useMemo(
    () => ({ configured, user, setUser, loading, sandboxEnabled, setSandboxEnabled }),
    [configured, user, loading, sandboxEnabled],
  );

  return createElement(AuthUserContext.Provider, { value }, children);
}

export function useAuthUser() {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error("useAuthUser must be used inside AuthUserProvider");
  }
  return context;
}
