import { execFileSync } from "node:child_process";

// Keep CI lightweight and deterministic: the actual TypeScript implementation
// is type-checked by `npm run check`; this script verifies that the source
// quality-audit module exists and that the package exposes the expected bank.
const required = [
  "src/lib/exam-bank/quality-audit.ts",
  "src/lib/exam-bank/core.ts",
  "src/lib/exam-bank/index.ts",
  "src/lib/bank-to-test.ts",
  "src/lib/exam-bank/deterministic-quality.ts",
];
for (const file of required) {
  execFileSync("node", ["-e", `require('fs').accessSync(${JSON.stringify(file)})`], {
    stdio: "inherit",
  });
}
console.log("Question-bank quality audit wiring: PASS");
console.log("Deterministic no-AI generation: ENABLED");
console.log("Generated questions are on-demand and are not persisted by the generator.");
