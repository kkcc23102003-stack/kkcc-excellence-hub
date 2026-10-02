import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const KKCC_CACHE_PREFIX = "kkcc-excellence-hub";
const CACHE_HELPER_DISMISSED_KEY = "kkcc-cache-helper-dismissed-v1";

export function PwaUpdateNotice() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showCacheTool, setShowCacheTool] = useState(false);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    const watchRegistration = (registration: ServiceWorkerRegistration | undefined) => {
      if (!registration) return;
      if (registration.waiting) setWaitingWorker(registration.waiting);

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(worker);
          }
        });
      });
    };

    navigator.serviceWorker
      .getRegistration()
      .then(watchRegistration)
      .catch(() => undefined);
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const timer = window.setTimeout(() => {
      if (window.localStorage.getItem(CACHE_HELPER_DISMISSED_KEY) === "1") return;
      const nav = performance.getEntriesByType("navigation")[0] as
        PerformanceNavigationTiming | undefined;
      const slowLoad = (nav?.duration ?? 0) > 3000;
      const slowResponse = (nav?.responseEnd ?? 0) > 1800;
      if (slowLoad || slowResponse) setShowCacheTool(true);
    }, 4200);

    return () => {
      window.clearTimeout(timer);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const updateNow = () => {
    if (!waitingWorker) return;
    setReloading(true);
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  const clearCacheAndReload = async () => {
    setReloading(true);
    try {
      if ("caches" in window) {
        const keys = await window.caches.keys();
        await Promise.all(
          keys
            .filter((key) => key.startsWith(KKCC_CACHE_PREFIX))
            .map((key) => window.caches.delete(key)),
        );
      }
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
    } finally {
      window.location.reload();
    }
  };

  if (!waitingWorker && !showCacheTool) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-[70] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 rounded-2xl border bg-background/95 p-3 shadow-lift backdrop-blur lg:bottom-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
          <RefreshCw className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {waitingWorker ? "New smoother app update is ready" : "App slow or stale?"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {waitingWorker
              ? "Tap update to refresh cached files and load the latest KKCC version."
              : "If refresh feels slow after an update, clear only KKCC app cache and reload."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {waitingWorker && (
              <Button
                size="sm"
                className="h-8 rounded-full"
                disabled={reloading}
                onClick={updateNow}
              >
                Update now
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-full"
              disabled={reloading}
              onClick={clearCacheAndReload}
            >
              Clear app cache
            </Button>
          </div>
        </div>
        {!waitingWorker && (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            aria-label="Hide cache helper"
            onClick={() => {
              window.localStorage.setItem(CACHE_HELPER_DISMISSED_KEY, "1");
              setShowCacheTool(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
