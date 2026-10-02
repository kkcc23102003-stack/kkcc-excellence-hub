import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_BRANDING,
  getPublicBrandingSettings,
  type BrandingSettings,
} from "@/lib/branding.functions";

const BrandingContext = createContext<BrandingSettings>(DEFAULT_BRANDING);
const BRANDING_CACHE_KEY = "kkcc-public-branding-v3-logo-uv";

function readCachedBranding(): BrandingSettings | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(BRANDING_CACHE_KEY);
    return raw ? ({ ...DEFAULT_BRANDING, ...JSON.parse(raw) } as BrandingSettings) : undefined;
  } catch {
    return undefined;
  }
}

function writeCachedBranding(branding: BrandingSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BRANDING_CACHE_KEY, JSON.stringify(branding));
  } catch {
    // localStorage may be disabled; ignore because defaults still work.
  }
}

function normaliseLogoPalette(branding: BrandingSettings): BrandingSettings {
  return {
    ...branding,
    primary_color: branding.primary_color === "#ff174f" ? "#18f4d6" : branding.primary_color,
    accent_color: branding.accent_color === "#00e5ff" ? "#f5d78e" : branding.accent_color,
    background_color:
      branding.background_color === "#07040d" ? "#050605" : branding.background_color,
    foreground_color:
      branding.foreground_color === "#fff7ff" ? "#fff8e7" : branding.foreground_color,
    hero_title: [
      "Education That Builds Understanding.",
      "KKCC Excellence Hub — Learn with Power.",
    ].includes(branding.hero_title)
      ? "KKCC Excellence Hub — Study That Makes You Return."
      : branding.hero_title,
    hero_highlight: [
      "Neon Smart Learning for Bright Futures.",
      "Logo-Inspired UV Learning for Bright Futures.",
      "Learning That Builds Futures.",
      "KKCC Excellence Learning for Bright Futures.",
      "2 — Double Vision · 3 — Three Tiers: Courage, Patience, Victory · K — Knowledge · A — Action · A — Ambition · T — Trust",
      "23KAAT :– 2 — Double Vision (aim and reality) · 3 — Three Tiers: Courage, Patience, Victory · K — Knowledge · A — Action · A — Ambition · T — Trust",
      "23KAAT :– 2 — Double Vision ( aim and reality )· 3 — Three Tiers: Courage, Patience, Victory · K — Knowledge · A — Action · A — Ambition · T — Trust",
      [
        "23KAAT is the rule of success",
        "2 — Double Vision ( aim and reality )·",
        "3 — Three Tiers (Courage, Patience, Victory) ·",
        "K — Knowledge ·",
        "A — Action ·",
        "A — Ambition ·",
        "T — Trust",
      ].join("\n\n"),
      "One focused session. One clear win. Every day.",
    ].includes(branding.hero_highlight)
      ? "Learn with clarity. Practice with courage. Rise with confidence."
      : branding.hero_highlight,
    hero_description: [
      "A bold digital classroom for real KKCC students — courses, lectures, notes, tests and progress in one colourful learning hub.",
      "Learn from structured courses, expert guidance, smart practice and powerful study tools — all in one place.",
      "KKCC brings courses, lectures, notes, tests, and progress tracking together in one colourful learning hub.",
      "KKCC brings courses, lectures, notes, tests, and progress tracking together in one colorful learning hub.",
    ].includes(branding.hero_description)
      ? "KKCC turns lectures, notes, tests, and progress into a bright daily learning loop — so students know exactly what to open next and feel excited to continue."
      : branding.hero_description,
    cta_primary_label:
      branding.cta_primary_label === "Explore Courses"
        ? "Find My Next Win"
        : branding.cta_primary_label,
    cta_secondary_label:
      branding.cta_secondary_label === "Start Learning"
        ? "Continue Learning"
        : branding.cta_secondary_label,
  };
}

function applyColor(name: string, value: string | undefined) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const color = value?.trim();
  if (color && /^#[0-9a-f]{6}$/i.test(color)) root.style.setProperty(name, color);
  else root.style.removeProperty(name);
}

function applyBrandingTheme(branding: BrandingSettings) {
  if (typeof document === "undefined") return;

  applyColor("--primary", branding.primary_color);
  applyColor("--ring", branding.primary_color);
  applyColor("--sidebar-primary", branding.primary_color);
  applyColor("--chart-1", branding.primary_color);

  applyColor("--accent", branding.accent_color);
  applyColor("--chart-2", branding.accent_color);

  applyColor("--background", branding.background_color);
  applyColor("--foreground", branding.foreground_color);

  const titleParts = [branding.short_name, branding.app_name].filter((item) => item.trim());
  if (titleParts.length) document.title = `${titleParts.join(" — ")} | Learning Platform`;
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [cachedBranding] = useState(readCachedBranding);
  const loadBranding = useServerFn(getPublicBrandingSettings);
  const { data } = useQuery({
    queryKey: ["public-branding"],
    queryFn: () => loadBranding(),
    placeholderData: cachedBranding ?? DEFAULT_BRANDING,
    staleTime: 10 * 60 * 1000,
  });

  const branding = normaliseLogoPalette(data ?? cachedBranding ?? DEFAULT_BRANDING);

  useEffect(() => {
    applyBrandingTheme(branding);
    writeCachedBranding(branding);
  }, [branding]);

  return <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  return useContext(BrandingContext);
}
