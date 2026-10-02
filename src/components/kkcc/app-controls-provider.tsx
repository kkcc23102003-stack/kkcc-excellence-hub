import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_APP_CONTROLS,
  getPublicAppControls,
  type PublicAppControls,
} from "@/lib/app-controls.functions";

const APP_CONTROLS_CACHE_KEY = "kkcc-public-app-controls-v1";

type AppControlsContextValue = {
  controls: PublicAppControls;
};

const AppControlsContext = createContext<AppControlsContextValue>({
  controls: DEFAULT_APP_CONTROLS,
});

function readCachedControls() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(APP_CONTROLS_CACHE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as PublicAppControls;
    return {
      ...DEFAULT_APP_CONTROLS,
      ...parsed,
      kittuRewards: {
        ...DEFAULT_APP_CONTROLS.kittuRewards,
        ...(parsed.kittuRewards ?? {}),
      },
      kittuPracticeBatches: Array.isArray(parsed.kittuPracticeBatches)
        ? parsed.kittuPracticeBatches
        : DEFAULT_APP_CONTROLS.kittuPracticeBatches,
    } satisfies PublicAppControls;
  } catch {
    return undefined;
  }
}

function writeCachedControls(controls: PublicAppControls) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(APP_CONTROLS_CACHE_KEY, JSON.stringify(controls));
  } catch {
    // Keep the app running when private browsing blocks local storage.
  }
}

export function AppControlsProvider({ children }: { children: ReactNode }) {
  const [cachedControls] = useState(readCachedControls);
  const load = useServerFn(getPublicAppControls);
  const { data } = useQuery({
    queryKey: ["public-app-controls"],
    queryFn: () => load(),
    placeholderData: cachedControls ?? DEFAULT_APP_CONTROLS,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const controls = useMemo(
    () =>
      data
        ? {
            ...DEFAULT_APP_CONTROLS,
            ...data,
            kittuRewards: {
              ...DEFAULT_APP_CONTROLS.kittuRewards,
              ...data.kittuRewards,
            },
            kittuPracticeBatches: Array.isArray(data.kittuPracticeBatches)
              ? data.kittuPracticeBatches
              : DEFAULT_APP_CONTROLS.kittuPracticeBatches,
          }
        : (cachedControls ?? DEFAULT_APP_CONTROLS),
    [cachedControls, data],
  );

  useEffect(() => {
    writeCachedControls(controls);
  }, [controls]);

  const value = useMemo(() => ({ controls }), [controls]);

  return <AppControlsContext.Provider value={value}>{children}</AppControlsContext.Provider>;
}

export function useAppControls() {
  return useContext(AppControlsContext).controls;
}
