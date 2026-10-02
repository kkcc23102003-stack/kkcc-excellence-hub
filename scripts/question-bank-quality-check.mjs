import { execFileSync } from "node:child_process";

// CI must evaluate every published position, not merely confirm that audit
// modules exist. Keep the sampled path available for local exploration, while
// this release gate runs the complete question and compacted-index audits.
const checks = [
  ["scripts/audit-question-bank.ts", "--full", "--assert-clean"],
  ["scripts/verify-compacted-index-map.ts"],
  ["scripts/check-generated-paper-coverage.ts"],
];

for (const [script, ...args] of checks) {
  execFileSync(process.execPath, ["--import", "tsx", script, ...args], {
    stdio: "inherit",
  });
}

console.log("Full question-bank validity, dead-template, and compacted-index gates: PASS");
