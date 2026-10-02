import { useEffect, useMemo, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiText } from "./ui-text-provider";

const INSTALL_DISMISSED_KEY = "kkcc-pwa-install-dismissed-at-v1";
const DISMISS_DAYS = 14;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function isRecentlyDismissed() {
  try {
    const raw = window.localStorage.getItem(INSTALL_DISMISSED_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (!Number.isFinite(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function dismissInstallPrompt() {
  try {
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()));
  } catch {
    // Ignore storage failures; the prompt is still fully dismissible for this session.
  }
}

function isIosLike() {
  if (typeof window === "undefined") return false;
  const platform = window.navigator.platform || "";
  const ua = window.navigator.userAgent || "";
  const touchMac = platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/i.test(ua) || touchMac;
}

export function PwaInstallPrompt() {
  const { system } = useUiText();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [hidden, setHidden] = useState(true);
  const iosLike = useMemo(isIosLike, []);

  useEffect(() => {
    if (isStandaloneDisplay() || isRecentlyDismissed()) return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setHidden(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const iosTimer = window.setTimeout(() => {
      if (iosLike && !isStandaloneDisplay()) {
        setShowIosHint(true);
        setHidden(false);
      }
    }, 2500);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.clearTimeout(iosTimer);
    };
  }, [iosLike]);

  useEffect(() => {
    const onInstalled = () => {
      dismissInstallPrompt();
      setHidden(true);
      setInstallEvent(null);
      setShowIosHint(false);
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  if (hidden || (!installEvent && !showIosHint)) return null;

  const dismiss = () => {
    dismissInstallPrompt();
    setHidden(true);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice.catch(() => undefined);
    dismissInstallPrompt();
    setHidden(true);
    setInstallEvent(null);
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[70] mx-auto max-w-md rounded-2xl border bg-background/95 p-3 shadow-lift backdrop-blur lg:bottom-6 lg:left-auto lg:right-6 lg:mx-0">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
          {installEvent ? <Download className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{system.install_title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {installEvent ? system.install_chrome_description : system.install_ios_description}
          </p>
          {installEvent && (
            <Button size="sm" className="mt-3 h-8 rounded-full" onClick={install}>
              {system.install_button_label}
            </Button>
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 shrink-0"
          aria-label="Hide install prompt"
          onClick={dismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
