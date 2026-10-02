import { defineConfig } from "@playwright/test";
export default defineConfig({
  webServer: {
    command: "npm run test:fixture",
    url: "http://127.0.0.1:4600",
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000,
  },
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: { timeout: 25_000 },
  workers: 1,
  fullyParallel: false,
  reporter: [["list"], ["json", { outputFile: "docs/audit/browser-results.json" }]],
  use: {
    baseURL: process.env["KKCC_E2E_URL"] || "http://127.0.0.1:4600",
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    serviceWorkers: "block",
  },
});
