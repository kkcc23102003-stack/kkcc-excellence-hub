import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { useAuthUser } from "@/hooks/use-auth-user";
import { displayNameFromUser } from "@/lib/auth";
import { useAppControls } from "./app-controls-provider";

const COPY_GUARD_EXCLUDED_PREFIXES = ["/admin", "/downloads"];
const WATERMARK_PREFIXES = ["/learn", "/dashboard", "/test", "/courses"];
const PROTECTION_HELP_MESSAGE = "Please use KKCC Support if this protection appears by mistake.";
const BRIEF_GUARD_MS = 3200;
const WRITE_GUARD_MS = 5000;

const KEY_CODE_LABELS: Record<string, string> = {
  KEYA: "A",
  KEYC: "C",
  KEYI: "I",
  KEYJ: "J",
  KEYP: "P",
  KEYS: "S",
  KEYU: "U",
  KEYX: "X",
  DIGIT3: "3",
  DIGIT4: "4",
  DIGIT5: "5",
  F12: "F12",
  PRINTSCREEN: "Print Screen",
};

type GuardOverlay = {
  kind: "brief" | "hold";
  title: string;
  message: string;
};

function isAllowedTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      [
        "input",
        "textarea",
        "select",
        "[contenteditable='true']",
        "[data-allow-copy='true']",
        ".allow-select",
        ".cm-editor",
      ].join(","),
    ),
  );
}

function isExcluded(pathname: string) {
  return COPY_GUARD_EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function shortcutLabel(event: KeyboardEvent) {
  const keyFromCode = KEY_CODE_LABELS[event.code?.toUpperCase() ?? ""];
  const key = (keyFromCode ?? event.key)?.toUpperCase();
  if (event.key.toLowerCase() === "printscreen" || event.code.toLowerCase() === "printscreen") {
    return event.metaKey ? "Win + Print Screen" : "Print Screen";
  }
  const parts = [];
  if (event.ctrlKey) parts.push("Ctrl");
  if (event.metaKey)
    parts.push(window.navigator.platform.toUpperCase().includes("MAC") ? "Cmd" : "Win");
  if (event.shiftKey) parts.push("Shift");
  if (event.altKey) parts.push("Alt");
  parts.push(key || "Unknown Shortcut");
  return parts.join(" + ");
}

function writingKeyText(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey) return "";
  if (event.key.length === 1 && /[a-z0-9]/i.test(event.key)) return event.key;
  return "";
}

function devToolsShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  const code = event.code?.toUpperCase();
  if (
    key === "f12" ||
    code === "F12" ||
    (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
    (event.metaKey && event.altKey && ["i", "j", "c", "u"].includes(key)) ||
    (event.ctrlKey && key === "u")
  ) {
    return true;
  }
  return false;
}

function screenCaptureShortcut(event: KeyboardEvent) {
  const key = event.key.toLowerCase();
  const code = event.code?.toUpperCase();
  const printScreen = key === "printscreen" || code === "PRINTSCREEN";
  const numericCapture = event.metaKey && event.shiftKey && ["3", "4", "5"].includes(key);
  const windowsSnip = event.metaKey && event.shiftKey && key === "s";
  return printScreen || numericCapture || windowsSnip;
}

function shouldWatermark(pathname: string) {
  return WATERMARK_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function ContentProtection() {
  const location = useLocation();
  const { user } = useAuthUser();
  const controls = useAppControls();
  const pathname = location.pathname;
  const protectionActive = controls.protectionEnabled && !isExcluded(pathname);
  const copyGuardEnabled = protectionActive && controls.copyGuardEnabled;
  const contextMenuGuardEnabled = protectionActive && controls.contextMenuGuardEnabled;
  const shortcutGuardEnabled = protectionActive && controls.shortcutGuardEnabled;
  const screenshotBlurEnabled = protectionActive && controls.screenshotBlurEnabled;
  const printGuardEnabled = protectionActive && controls.printGuardEnabled;
  const watermarkEnabled = Boolean(
    user && protectionActive && controls.watermarkEnabled && shouldWatermark(pathname),
  );
  const [guardOverlay, setGuardOverlay] = useState<GuardOverlay | null>(null);
  const guardTimerRef = useRef<number | null>(null);
  const holdReasonRef = useRef<"print" | "screen" | null>(null);
  const lastWritingGuardAtRef = useRef(0);

  const watermark = useMemo(() => {
    const who = user?.email || displayNameFromUser(user) || "KKCC student";
    return `KKCC Secure Learning • ${who}`;
  }, [user]);

  const clearGuard = useCallback(() => {
    if (guardTimerRef.current) {
      window.clearTimeout(guardTimerRef.current);
      guardTimerRef.current = null;
    }
    holdReasonRef.current = null;
    setGuardOverlay(null);
  }, []);

  const showGuard = useCallback((overlay: GuardOverlay, timeout = BRIEF_GUARD_MS) => {
    holdReasonRef.current = null;
    setGuardOverlay(overlay);
    if (guardTimerRef.current) window.clearTimeout(guardTimerRef.current);
    guardTimerRef.current = window.setTimeout(() => {
      setGuardOverlay(null);
      guardTimerRef.current = null;
    }, timeout);
  }, []);

  const showBriefGuard = useCallback(
    (title: string, message: string) => showGuard({ kind: "brief", title, message }),
    [showGuard],
  );

  const showHoldGuard = useCallback(
    (title: string, message: string, reason: "print" | "screen") => {
      if (guardTimerRef.current) {
        window.clearTimeout(guardTimerRef.current);
        guardTimerRef.current = null;
      }
      holdReasonRef.current = reason;
      setGuardOverlay({ kind: "hold", title, message });
    },
    [],
  );

  const writingQuestionFrom = (overlay: GuardOverlay) => (
    <div className={overlay.kind === "hold" ? "kkcc-guard-modal" : "kkcc-guard-pill"}>
      <p className="kkcc-guard-title">{overlay.title}</p>
      <p>{overlay.message}</p>
    </div>
  );

  useEffect(() => {
    document.body.classList.toggle("kkcc-copy-guard", copyGuardEnabled);
    if (!protectionActive) return undefined;

    const preventCopy = (event: Event) => {
      if (!copyGuardEnabled || isAllowedTarget(event.target)) return;
      event.preventDefault();
      if (event instanceof ClipboardEvent) {
        event.clipboardData?.setData("text/plain", "KKCC protected learning content");
      }
      showBriefGuard(
        "Copying is disabled",
        `This learning content is protected. ${PROTECTION_HELP_MESSAGE}`,
      );
    };

    const preventContextMenu = (event: Event) => {
      if (!contextMenuGuardEnabled || isAllowedTarget(event.target)) return;
      event.preventDefault();
      showBriefGuard(
        "Context menu is disabled",
        "Right-click and browser context actions are restricted on protected content.",
      );
    };

    const preventDrag = (event: DragEvent) => {
      if (!copyGuardEnabled || isAllowedTarget(event.target)) return;
      event.preventDefault();
      showBriefGuard(
        "Export is disabled",
        "Dragging text, images or learning material out of the page is not permitted.",
      );
    };

    const preventSelection = (event: Event) => {
      if (!copyGuardEnabled || isAllowedTarget(event.target)) return;
      event.preventDefault();
    };

    const preventHotkeys = (event: KeyboardEvent) => {
      const writingText = writingKeyText(event);
      if (copyGuardEnabled && writingText && !isAllowedTarget(event.target)) {
        const now = Date.now();
        if (now - lastWritingGuardAtRef.current > WRITE_GUARD_MS) {
          showBriefGuard(
            "Write access blocked for 5 seconds",
            "Typing on protected lesson areas is paused to prevent automated extraction.",
          );
          lastWritingGuardAtRef.current = now;
        }
      }

      if (screenCaptureShortcut(event) && screenshotBlurEnabled) {
        event.preventDefault();
        event.stopPropagation();
        showBriefGuard(
          `${shortcutLabel(event)} blocked`,
          `Screen capture shortcuts are restricted here. ${PROTECTION_HELP_MESSAGE}`,
        );
        document.body.classList.add("kkcc-screenshot-guard");
        window.setTimeout(() => document.body.classList.remove("kkcc-screenshot-guard"), 1800);
        return;
      }

      if (devToolsShortcut(event) && shortcutGuardEnabled) {
        event.preventDefault();
        event.stopPropagation();
        showBriefGuard(
          "Source inspection is restricted",
          `Source inspection is disabled while protection is active. ${PROTECTION_HELP_MESSAGE}`,
        );
        return;
      }

      if (!shortcutGuardEnabled || isAllowedTarget(event.target)) return;
      const key = event.key.toLowerCase();
      const guardedCombo =
        (event.ctrlKey || event.metaKey) && ["a", "c", "x", "s", "p", "u"].includes(key);
      if (guardedCombo) {
        event.preventDefault();
        event.stopPropagation();
        showBriefGuard(
          `${shortcutLabel(event)} blocked`,
          "This shortcut is disabled on protected KKCC learning pages.",
        );
        return;
      }
    };

    const beforePrint = () => {
      if (!printGuardEnabled) return;
      document.body.classList.add("kkcc-print-guard", "kkcc-page-hidden");
      showHoldGuard(
        "Printing is not allowed",
        `Document printing is disabled and the page is isolated from print output. ${PROTECTION_HELP_MESSAGE}`,
        "print",
      );
    };
    const afterPrint = () => {
      document.body.classList.remove("kkcc-print-guard", "kkcc-page-hidden");
      clearGuard();
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("selectstart", preventSelection);
    document.addEventListener("keydown", preventHotkeys);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      document.body.classList.remove(
        "kkcc-copy-guard",
        "kkcc-screenshot-guard",
        "kkcc-print-guard",
      );
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("selectstart", preventSelection);
      document.removeEventListener("keydown", preventHotkeys);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, [
    clearGuard,
    contextMenuGuardEnabled,
    copyGuardEnabled,
    printGuardEnabled,
    protectionActive,
    screenshotBlurEnabled,
    shortcutGuardEnabled,
    showBriefGuard,
    showHoldGuard,
  ]);

  useEffect(() => {
    const protectScreen = () => {
      if (!protectionActive || !screenshotBlurEnabled) return;
      document.body.classList.add("kkcc-page-hidden", "kkcc-screenshot-guard");
      showBriefGuard(
        "Screen protection active",
        `The page blurs while another app or browser surface is active. ${PROTECTION_HELP_MESSAGE}`,
      );
    };

    const restoreScreen = () => {
      document.body.classList.remove("kkcc-page-hidden", "kkcc-screenshot-guard");
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") protectScreen();
    };

    const onWindowBlur = () => {
      if (document.visibilityState === "visible") protectScreen();
    };

    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focus", restoreScreen);
    window.addEventListener("pageshow", restoreScreen);
    return () => {
      restoreScreen();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", restoreScreen);
      window.removeEventListener("pageshow", restoreScreen);
    };
  }, [protectionActive, screenshotBlurEnabled, showBriefGuard]);

  return (
    <>
      {guardOverlay ? writingQuestionFrom(guardOverlay) : null}
      {watermarkEnabled ? (
        <div className="kkcc-watermark" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index}>{watermark}</span>
          ))}
        </div>
      ) : null}
    </>
  );
}
