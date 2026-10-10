import type { startLearningAttempt } from "./test-attempts.functions";
type InitialPaper = Awaited<ReturnType<typeof startLearningAttempt>>;
// Deliberately RAM-only: never localStorage, sessionStorage, IndexedDB or URL tokens.
let current: InitialPaper | null = null;
export function rememberTemporaryTest(paper: InitialPaper) {
  if (typeof window !== "undefined") current = paper;
}
export function readTemporaryTest(id: string) {
  if (!current || current.attempt.id !== id || !current.temporary)
    throw new Error(
      "Temporary test is no longer available. Refreshing or closing the page clears its progress/result. Start a new test.",
    );
  return current;
}
export function clearTemporaryTest() {
  current = null;
}
if (typeof window !== "undefined") window.addEventListener("pagehide", clearTemporaryTest);
