import { AuthUserProvider } from "@/hooks/use-auth-user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { BrandingProvider } from "../components/kkcc/branding-provider";
import { AppControlsProvider } from "../components/kkcc/app-controls-provider";
import { WebsiteContentProvider } from "../components/kkcc/website-content-provider";
import { UiTextProvider, useUiText } from "../components/kkcc/ui-text-provider";

const LazyToaster = lazy(() =>
  import("../components/ui/sonner").then((module) => ({ default: module.Toaster })),
);
const LazyPwaUpdateNotice = lazy(() =>
  import("../components/kkcc/pwa-update-notice").then((module) => ({
    default: module.PwaUpdateNotice,
  })),
);
const LazyPwaInstallPrompt = lazy(() =>
  import("../components/kkcc/pwa-install-prompt").then((module) => ({
    default: module.PwaInstallPrompt,
  })),
);

function NotFoundComponent() {
  const { system } = useUiText();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{system.not_found_title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{system.not_found_description}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {system.not_found_home_label}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { system } = useUiText();
  useEffect(() => {
    // Keep errors visible to the application's own monitoring and hosting logs.
    console.error("Root route error", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {system.error_title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{system.error_description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {system.error_retry_label}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {system.error_home_label}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Kusum Kartik Coaching Centre — KKCC Learning Platform" },
      {
        name: "description",
        content:
          "KKCC is a modern learning platform with structured courses, live classes, test series and study material.",
      },
      { name: "author", content: "Kusum Kartik Coaching Centre" },
      { name: "application-name", content: "KKCC-excellence-hub" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "KKCC" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "format-detection", content: "telephone=no" },
      { name: "color-scheme", content: "dark light" },
      { name: "theme-color", content: "#18f4d6" },
      { property: "og:title", content: "Kusum Kartik Coaching Centre — KKCC" },
      {
        property: "og:description",
        content:
          "Courses, live classes, tests and study material in one premium learning platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preload", href: "/logo.png", as: "image", fetchPriority: "high" },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "96x96" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const PERFORMANCE_BOOT_SCRIPT = `
(function(){
  try {
    var root = document.documentElement;
    root.classList.add('js');
    var nav = navigator || {};
    var memory = nav.deviceMemory || 4;
    var cores = nav.hardwareConcurrency || 4;
    var connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    var saveData = !!(connection && connection.saveData);
    var slowConnection = !!(connection && /(^|-)2g$|slow-2g/i.test(connection.effectiveType || ''));
    if (memory <= 3 || cores <= 4 || saveData || slowConnection) root.classList.add('lite-motion');
    if (saveData || slowConnection) root.classList.add('save-data');
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) root.classList.add('coarse-pointer');
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) root.classList.add('is-standalone');
    if (nav.standalone === true) root.classList.add('is-standalone');
    if (window.requestAnimationFrame) {
      var last = performance.now();
      var total = 0;
      var frames = 0;
      var sample = function(now) {
        total += now - last;
        last = now;
        frames += 1;
        if (frames < 8) return window.requestAnimationFrame(sample);
        if (total / frames < 13) root.classList.add('high-refresh');
      };
      window.requestAnimationFrame(sample);
    }
  } catch (error) {}
})();
`;

const SERVICE_WORKER_SCRIPT = `
(function () {
  if (!('serviceWorker' in navigator)) return;
  var register = function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(function (error) {
      console.warn('[pwa] service worker registration failed', error);
    });
  };
  var start = function () {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(register, { timeout: 3000 });
    } else {
      window.setTimeout(register, 1200);
    }
  };
  window.addEventListener('load', start, { once: true });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    navigator.serviceWorker.getRegistration().then(function (registration) {
      if (registration) registration.update().catch(function () {});
    }).catch(function () {});
  });
})();
`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: PERFORMANCE_BOOT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: SERVICE_WORKER_SCRIPT }} />
        <Scripts />
      </body>
    </html>
  );
}

function DeferredClientEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(() => setReady(true), { timeout: 1800 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }

    const id = globalThis.setTimeout(() => setReady(true), 900);
    return () => globalThis.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <LazyPwaUpdateNotice />
      <LazyPwaInstallPrompt />
      <LazyToaster position="top-center" richColors />
    </Suspense>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthUserProvider>
        <BrandingProvider>
          <UiTextProvider>
            <AppControlsProvider>
              <WebsiteContentProvider>
                {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                <Outlet />
                <DeferredClientEnhancements />
              </WebsiteContentProvider>
            </AppControlsProvider>
          </UiTextProvider>
        </BrandingProvider>
      </AuthUserProvider>
    </QueryClientProvider>
  );
}
