import { test, expect, type Page } from "@playwright/test";
import { fixtureIds } from "../fixtures/database";
async function login(page: Page, name: string) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(`${name}@fixture.invalid`);
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
const groups = {
  public: [
    "/",
    "/courses",
    "/classes",
    "/test-series",
    "/study-material",
    "/faculty",
    "/results",
    "/support",
    "/downloads",
    "/login",
    "/signup",
    "/forgot-password",
  ],
  student: [
    "/dashboard",
    "/dashboard/courses",
    "/dashboard/tests",
    "/dashboard/materials",
    "/dashboard/student",
    "/dashboard/progress",
    "/dashboard/profile",
    "/dashboard/doubts",
    "/dashboard/notifications",
    "/dashboard/live",
    "/coins",
    "/games",
  ],
  admin: [
    "/admin",
    "/admin/analytics",
    "/admin/app-builder",
    "/admin/branding",
    "/admin/content",
    "/admin/coupons",
    "/admin/doubts",
    "/admin/enquiries",
    "/admin/exam-bank",
    "/admin/materials",
    "/admin/notifications",
    "/admin/offline-access",
    "/admin/payments",
    "/admin/security",
    "/admin/settings",
    "/admin/storage",
    "/admin/students",
    "/admin/syllabus",
    "/admin/tests",
    "/admin/text-manager",
    "/admin/users",
    "/admin/vouchers",
  ],
};
for (const [role, routes] of Object.entries(groups))
  test(`${role}: route sweep at mobile width, no crashed pages`, async ({ page }, testInfo) => {
    test.setTimeout(240000);
    if (role !== "public") await login(page, role === "student" ? "studenta" : "admin");
    await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const timings = [];
    for (const route of routes) {
      await test.step(route, async () => {
        const started = Date.now(),
          response = await page.goto(route);
        expect(response?.status(), route).toBeLessThan(400);
        await expect(page.locator("h1:visible,h2:visible").first()).toBeVisible();
        await expect(page.getByText("This page didn't load", { exact: true })).toHaveCount(0);
        expect(new URL(page.url()).pathname.replace(/\/$/, "") || "/").toBe(route);
        expect(errors, route).toEqual([]);
        timings.push({ route, readyMs: Date.now() - started });
      });
    }
    await testInfo.attach(`${role}-route-timings`, {
      body: JSON.stringify(timings, null, 2),
      contentType: "application/json",
    });
  });
test("public assets revalidate without payload; private responses remain no-store", async ({
  request,
}) => {
  const first = await request.get("/logo.png");
  expect(first.status()).toBe(200);
  const etag = first.headers()["etag"];
  expect(etag).toBeTruthy();
  const cached = await request.get("/logo.png", { headers: { "if-none-match": etag! } });
  expect(cached.status()).toBe(304);
  expect((await cached.body()).length).toBe(0);
  const excluded = await request.get("/manifest.webmanifest", {
    headers: { "accept-encoding": "gzip;q=0" },
  });
  expect(excluded.headers()["content-encoding"]).toBeUndefined();
  const compressed = await request.get("/manifest.webmanifest", {
    headers: { "accept-encoding": "gzip" },
  });
  expect(compressed.headers()["content-encoding"]).toBe("gzip");
  const privatePage = await request.get("/login");
  expect(privatePage.headers()["cache-control"]).toContain("no-store");
  const video = await request.get("/secure-video.html");
  expect(video.headers()["etag"]).toBeUndefined();
  expect(video.headers()["cache-control"]).toContain("no-store");
});
test("service-worker update never silently reloads a test; explicit update can be cancelled", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.serviceWorker, "controller", {
      configurable: true,
      get: () => ({ scriptURL: "/sw.js" }),
    });
    navigator.serviceWorker.getRegistration = async () => {
      document.documentElement.dataset["pwaWatched"] = "yes";
      return undefined;
    };
  });
  await login(page, "admin");
  await page.goto(`/tests/learn/${fixtureIds.test}`);
  await page.getByTestId("learning-subject").first().click();
  await page.getByTestId("learning-chapter").first().click();
  await page.getByTestId("start-test").click();
  const option = page.getByTestId("answer-option").first();
  await option.click();
  await expect(page.locator("html")).toHaveAttribute("data-pwa-watched", "yes");
  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new Event("controllerchange")));
  await expect(
    page.getByText("App update ready — reload when safe", { exact: true }),
  ).toBeVisible();
  await expect(option).toHaveAttribute("aria-pressed", "true");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Update now", exact: true }).click();
  await expect(option).toHaveAttribute("aria-pressed", "true");
});
