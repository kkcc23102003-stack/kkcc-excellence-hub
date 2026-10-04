/**
 * Lazy handle for the exam question bank.
 *
 * The bank is ~1.7 MB of template data. Statically importing it made every
 * student who opened the quiz page download and parse the whole thing before
 * the page could paint, which is exactly the "app is laggy on mobile" problem.
 *
 * With this module the bank is fetched through a dynamic `import()`:
 *   - the page renders immediately,
 *   - the download runs in the background and is cached by the browser,
 *   - `examBankSync()` lets synchronous callers (question generators) keep their
 *     existing shape and simply fall back to their own verified generators until
 *     the bank is in memory,
 *   - `useExamBankModule()` re-renders the screen once it arrives.
 *
 * Nothing here is required for correctness: a caller that finds `null` must use
 * its own chapter-correct fallback, which is what the quiz page already does.
 */
import { useEffect, useState } from "react";

export type ExamBankModule = typeof import("./index");

let loaded: ExamBankModule | null = null;
let pending: Promise<ExamBankModule> | null = null;

/** The bank if it is already in memory, otherwise null. Never triggers a load. */
export function examBankSync(): ExamBankModule | null {
  return loaded;
}

/** Start (or join) the background download. Safe to call from anywhere, often. */
export function preloadExamBank(): Promise<ExamBankModule> {
  if (loaded) return Promise.resolve(loaded);
  if (!pending) {
    pending = import("./index")
      .then((module) => {
        loaded = module;
        return module;
      })
      .catch((error) => {
        // Allow a later retry instead of caching the failure forever.
        pending = null;
        throw error;
      });
  }
  return pending;
}

/**
 * Subscribe a component to the bank. Returns the module as soon as it is
 * available and a boolean so callers can show a small "preparing" state.
 */
export function useExamBankModule(): { bank: ExamBankModule | null; ready: boolean } {
  const [bank, setBank] = useState<ExamBankModule | null>(loaded);

  useEffect(() => {
    if (loaded) {
      setBank(loaded);
      return;
    }
    let alive = true;
    void preloadExamBank()
      .then((module) => {
        if (alive) setBank(module);
      })
      .catch((error) => {
        console.error("[exam-bank] could not load the question bank", error);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { bank, ready: Boolean(bank) };
}
