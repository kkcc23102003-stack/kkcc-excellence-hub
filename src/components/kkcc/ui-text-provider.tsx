import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_UI_TEXT,
  getPublicUiText,
  sanitiseUiText,
  type UiTextSettings,
} from "@/lib/ui-text.functions";

const UiTextContext = createContext<UiTextSettings>(DEFAULT_UI_TEXT);
const UI_TEXT_CACHE_KEY = "kkcc-public-ui-text-v1-hybrid";

function mergeUiText(value: Partial<UiTextSettings>): UiTextSettings {
  const merged = sanitiseUiText({
    ...DEFAULT_UI_TEXT,
    ...value,
    auth: { ...DEFAULT_UI_TEXT.auth, ...value.auth },
    dashboard: { ...DEFAULT_UI_TEXT.dashboard, ...value.dashboard },
    system: { ...DEFAULT_UI_TEXT.system, ...value.system },
  } as UiTextSettings);

  if (
    merged.dashboard.no_active_batch_description ===
    "Start a free batch or ask admin to activate access after paid/offline payment."
  ) {
    merged.dashboard.no_active_batch_description =
      "Start a free batch or contact KKCC support to activate paid/offline access.";
  }
  if (
    merged.dashboard.support_cta_description ===
    "If your validity is about to expire, send a message from the Support page or contact admin."
  ) {
    merged.dashboard.support_cta_description =
      "If your validity is about to expire, send a message from the Support page for renewal help.";
  }

  return merged;
}

function readCachedUiText(): UiTextSettings | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(UI_TEXT_CACHE_KEY);
    return raw ? mergeUiText(JSON.parse(raw) as Partial<UiTextSettings>) : undefined;
  } catch {
    return undefined;
  }
}

function writeCachedUiText(text: UiTextSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(UI_TEXT_CACHE_KEY, JSON.stringify(text));
  } catch {
    // Ignore localStorage failures; defaults keep the app usable.
  }
}

export function UiTextProvider({ children }: { children: ReactNode }) {
  const [cachedText] = useState(readCachedUiText);
  const loadUiText = useServerFn(getPublicUiText);
  const { data } = useQuery({
    queryKey: ["public-ui-text"],
    queryFn: () => loadUiText(),
    placeholderData: cachedText ?? DEFAULT_UI_TEXT,
    staleTime: 10 * 60 * 1000,
  });

  const text = mergeUiText(data ?? cachedText ?? DEFAULT_UI_TEXT);

  useEffect(() => {
    writeCachedUiText(text);
  }, [text]);

  return <UiTextContext.Provider value={text}>{children}</UiTextContext.Provider>;
}

export function useUiText() {
  return useContext(UiTextContext);
}
