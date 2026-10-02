import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/integrations/supabase/env";

type AuthUserContextValue = {
  configured: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

const AuthUserContext = createContext<AuthUserContextValue | null>(null);

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const previousUser = useRef<string | null | undefined>(undefined);
  const configured = !!getSupabasePublicConfig();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
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
          const nextId = session?.user.id ?? null;
          if (previousUser.current !== undefined && previousUser.current !== nextId) {
            queryClient.clear();
            // Identity changes must not leave another student's route-loader data behind.
            void router.invalidate();
          }
          previousUser.current = nextId;
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
  }, [configured, queryClient, router]);

  const value = useMemo(
    () => ({ configured, user, setUser, loading }),
    [configured, user, loading],
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
