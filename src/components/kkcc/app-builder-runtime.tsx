import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_APP_BUILDER_SETTINGS,
  getPublicAppBuilderSettings,
  type AppBuilderSettings,
} from "@/lib/app-builder.functions";

const APP_BUILDER_CACHE_KEY = "kkcc-public-app-builder-v1";

function writeCachedAppBuilder(settings: AppBuilderSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(APP_BUILDER_CACHE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore localStorage failures; defaults keep the app usable.
  }
}

function HtmlSlot({ html, label }: { html: string; label: string }) {
  if (!html.trim()) return null;
  return <div data-kkcc-app-builder={label} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function AppBuilderRuntime({ position }: { position: "top" | "bottom" }) {
  const load = useServerFn(getPublicAppBuilderSettings);
  const { data } = useQuery({
    queryKey: ["public-app-builder"],
    queryFn: () => load(),
    placeholderData: DEFAULT_APP_BUILDER_SETTINGS,
    staleTime: 5 * 60 * 1000,
  });

  const settings = data ?? DEFAULT_APP_BUILDER_SETTINGS;
  const enabled = settings.enabled;
  const customCss = enabled ? settings.custom_css : "";
  const customJs = enabled ? settings.custom_js : "";

  useEffect(() => {
    writeCachedAppBuilder(settings);
  }, [settings]);

  useEffect(() => {
    if (position !== "top") return;

    const scriptId = "kkcc-admin-custom-js";
    document.getElementById(scriptId)?.remove();

    if (!enabled || !customJs.trim()) return;

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timerId: number | undefined;

    const injectScript = () => {
      document.getElementById(scriptId)?.remove();
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.text = `try {\n${customJs}\n} catch (error) { console.error('[KKCC admin custom JS]', error); }`;
      document.body.appendChild(script);
    };

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(injectScript, { timeout: 2500 });
    } else {
      timerId = window.setTimeout(injectScript, 900);
    }

    return () => {
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
      document.getElementById(scriptId)?.remove();
    };
  }, [customJs, enabled, position]);

  if (!enabled) return null;

  return (
    <>
      {position === "top" && customCss.trim() && <style data-kkcc-admin-css>{customCss}</style>}
      {position === "top" && <HtmlSlot html={settings.top_html} label="top-html" />}
      {position === "bottom" && <HtmlSlot html={settings.bottom_html} label="bottom-html" />}
    </>
  );
}
