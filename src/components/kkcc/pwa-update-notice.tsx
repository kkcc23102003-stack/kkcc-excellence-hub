import { useEffect, useState, useRef } from "react";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const KKCC_CACHE_PREFIX = "kkcc-excellence-hub";
const CACHE_HELPER_DISMISSED_KEY = "kkcc-cache-helper-dismissed-v1";

export function PwaUpdateNotice() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showCacheTool, setShowCacheTool] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const approvedReload = useRef(false);
  const hasUpdate = Boolean(waitingWorker) || updateReady;

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let active = true;
    const cleanups: Array<() => void> = [];
    const hadController = Boolean(navigator.serviceWorker.controller);
    const onControllerChange = () => {
      // Activation/first install must never silently discard an in-memory test or editor.
      if (approvedReload.current) window.location.reload();
      else if (hadController) setUpdateReady(true);
    };
    const watchRegistration = (registration: ServiceWorkerRegistration | undefined) => {
      if (!active || !registration) return;
      if (registration.waiting) setWaitingWorker(registration.waiting);
      const watchWorker = () => {
        const worker = registration.installing;
        if (!worker) return;
        const changed = () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller)
            setWaitingWorker(worker);
        };
        worker.addEventListener("statechange", changed);
        cleanups.push(() => worker.removeEventListener("statechange", changed));
      };
      registration.addEventListener("updatefound", watchWorker);
      cleanups.push(() => registration.removeEventListener("updatefound", watchWorker));
      watchWorker();
    };
    navigator.serviceWorker
      .getRegistration()
      .then(watchRegistration)
      .catch(() => undefined);
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const timer = window.setTimeout(() => {
      try {
        if (window.localStorage.getItem(CACHE_HELPER_DISMISSED_KEY) === "1") return;
      } catch {
        /* restricted storage: keep tool usable */
      }
      const nav = performance.getEntriesByType("navigation")[0] as
        PerformanceNavigationTiming | undefined;
      const slowLoad = (nav?.duration ?? 0) > 3000;
      const slowResponse = (nav?.responseEnd ?? 0) > 1800;
      if (slowLoad || slowResponse) setShowCacheTool(true);
    }, 4200);

    return () => {
      active = false;
      cleanups.forEach((cleanup) => cleanup());
      window.clearTimeout(timer);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const confirmReload = () =>
    window.confirm(
      "Reload KKCC now? Finish your test or save your edits first. Temporary test progress/results will be lost.",
    );
  const updateNow = () => {
    if (!confirmReload()) return;
    approvedReload.current = true;
    setReloading(true);
    if (waitingWorker?.state === "installed") waitingWorker.postMessage({ type: "SKIP_WAITING" });
    else window.location.reload();
  };

  const clearCacheAndReload = async () => {
    if (!confirmReload()) return;
    approvedReload.current = true;
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

  if (!hasUpdate && !showCacheTool) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-[70] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 rounded-2xl border bg-background/95 p-3 shadow-lift backdrop-blur lg:bottom-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
          <RefreshCw className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {hasUpdate ? "App update ready — reload when safe" : "App slow or stale?"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {hasUpdate
              ? "Finish your test or save your edits first. Updates never reload this page automatically."
              : "If refresh feels slow after an update, clear only KKCC app cache and reload."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {hasUpdate && (
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
        {!hasUpdate && (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            aria-label="Hide cache helper"
            onClick={() => {
              try {
                window.localStorage.setItem(CACHE_HELPER_DISMISSED_KEY, "1");
              } catch {
                /* optional preference */
              }
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
