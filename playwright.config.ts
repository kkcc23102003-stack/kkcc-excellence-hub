import { defineConfig } from "@playwright/test";
export default defineConfig({
  webServer: {
    command: "PORT=4600 npm run test:fixture",
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
    launchOptions: process.env["PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"]
      ? {
          executablePath: process.env["PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH"],
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        }
      : {},
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    serviceWorkers: "block",
  },
});
