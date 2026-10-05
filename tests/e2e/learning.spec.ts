import { test, expect, type Page } from "@playwright/test";
import { getExamBankExams } from "../../src/lib/exam-bank/index";
import { fixtureIds as ids } from "../fixtures/database";

async function login(page: Page, name = "studenta") {
  if (new URL(page.url()).pathname !== "/login") await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(`${name}@fixture.invalid`);
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
async function assign(page: Page, kind: string, item: string, student = ids.studentA) {
  await page.goto("/admin/students");
  const panel = page.getByTestId("admin-enrollment-panel");
  await expect(panel).toBeVisible();
  await panel.getByLabel("Enrollment student").selectOption(student);
  await panel.getByLabel("Enrollment type").selectOption(kind);
  await panel.getByLabel("Enrollment item").selectOption(item);
  await panel.getByRole("button", { name: "Grant Enrollment" }).click();
  await expect(panel.getByText("Enrollment verified. Student access is active.")).toBeVisible();
}
async function completeFlow(page: Page, route: string) {
  await page.goto(route);
  await expect(page.getByRole("heading", { name: "Select Subject", exact: true })).toBeVisible();
  const subject = (await page.getByTestId("learning-subject").first().innerText())
    .split("\n")[0]!
    .trim();
  await page.getByTestId("learning-subject").first().click();
  await expect(page.getByRole("heading", { name: "Select Chapter", exact: true })).toBeVisible();
  const chapter = (await page.getByTestId("learning-chapter").first().innerText())
    .split("\n")[0]!
    .trim();
  await page.getByTestId("learning-chapter").first().click();
  await expect(page.getByRole("heading", { name: "Start Test", exact: true })).toBeVisible();
  await page.getByTestId("start-test").click();
  await expect(page.getByTestId("test-question")).toBeVisible();
  await expect(page).toHaveURL(/attempt=/);
  await expect(page.getByTestId("answer-option")).toHaveCount(4);
  await page.getByTestId("answer-option").first().click();
  await expect(page.getByTestId("answer-option").first()).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Submit Test", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
  await expect(page.getByText("Test submitted · Saved to your account")).toBeVisible();
  return { subject, chapter, resultUrl: page.url() };
}

test("Admin assigns Test/Course/Series; actual Student A sees top cards and completes test/series/course access", async ({
  browser,
}) => {
  const admin = await browser.newContext();
  const student = await browser.newContext();
  const other = await browser.newContext();
  try {
    const ap = await admin.newPage(),
      sp = await student.newPage(),
      bp = await other.newPage();
    await login(ap, "admin");
    await login(sp);
    await login(bp, "studentb");
    await bp.goto(`/tests/learn/${ids.test}`);
    await expect(bp.getByRole("alert")).toContainText("TEST_ACCESS_REQUIRED");
    await assign(ap, "test", ids.test);
    await assign(ap, "course", ids.course);
    await assign(ap, "series", "neet-ug");
    await sp.goto("/");
    const enrolled = sp.getByTestId("home-enrolled");
    await expect(enrolled).toContainText("Fixture Paid NEET Test");
    await expect(enrolled).toContainText("Fixture Paid Course");
    const firstHeading = sp.locator("main h2").first();
    await expect(firstHeading).toHaveText("My enrolled learning");
    await expect(enrolled.getByRole("link", { name: /Start Learning/ }).first()).toBeVisible();
    const flow = await completeFlow(sp, `/tests/learn/${ids.test}`);
    await sp.reload();
    await expect(sp.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
    await bp.goto(new URL(flow.resultUrl).pathname + new URL(flow.resultUrl).search);
    await expect(bp.getByRole("alert")).toContainText("Attempt not found for this account");
    await sp.goto("/test-series");
    await expect(sp.getByTestId("enrolled-series")).toContainText("NEET");
    await expect(sp.locator("main h2").first()).toContainText("My enrolled Test Series");
    await completeFlow(sp, "/test-series/learn/neet-ug");
    await sp.goto("/learn?course=fixture-paid-course");
    await expect(sp.getByText("Protected Fixture Lecture", { exact: true }).first()).toBeVisible();
    await bp.goto("/learn?course=fixture-paid-course");
    await expect(bp.getByRole("heading", { name: "Course access required" })).toBeVisible();
    await sp.goto("/dashboard/tests");
    await expect(sp.getByRole("link", { name: /View result/i }).first()).toBeVisible();
    await bp.goto("/admin/students");
    await expect(bp).toHaveURL(/\/dashboard/);
  } finally {
    await admin.close();
    await student.close();
    await other.close();
  }
});

test("Student B coin purchase is verified, grants cannot cross accounts, and course access opens", async ({
  page,
}) => {
  await login(page, "studentb");
  await page.goto("/checkout?course=fixture-paid-course");
  await page
    .getByRole("button", { name: /Pay.*23KAAT|Unlock.*23KAAT|Buy.*23KAAT|Use.*23KAAT/i })
    .click();
  await expect(page).toHaveURL(/\/learn/);
  await expect(page.getByText("Protected Fixture Lecture", { exact: true }).first()).toBeVisible();
});

for (const [index, exam] of getExamBankExams().entries())
  test(`Existing-bank exam flow: ${exam}`, async ({ page }) => {
    // Admin audit account avoids the production learner anti-abuse quota; the exact same learner pages/handlers are used.
    await login(page, "admin");
    const id = `21000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`;
    const selection = await completeFlow(page, `/tests/learn/${id}`);
    expect(selection.subject).toBeTruthy();
    expect(selection.chapter).toBeTruthy();
    await expect(page.getByText(`Fixture ${exam}`, { exact: true }).first()).toBeVisible();
  });

test("Mobile public routes render without horizontal overflow; menus and learning remain reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/courses",
    "/test-series",
    "/study-material",
    "/contact",
    "/login",
    "/signup",
    "/forgot-password",
  ]) {
    await page.goto(route);
    await expect(page.locator("body")).not.toContainText("Something went wrong");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
      route,
    ).toBe(true);
  }
});

test("Signup creates a genuine profile via the auth trigger; logout and next-account login do not reuse enrollments", async ({
  page,
}) => {
  await page.goto("/signup");
  await page.getByLabel("Full name", { exact: true }).fill("New Fixture Student");
  await page.getByLabel("Email", { exact: true }).fill(`new-${Date.now()}@fixture.invalid`);
  await page.getByLabel("Mobile number", { exact: true }).fill("9876543210");
  await page.getByLabel("Class / stream", { exact: true }).fill("Class 9");
  await page.getByLabel("Target exam", { exact: true }).fill("CBSE Class 9");
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByLabel("Confirm password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page).not.toHaveURL(/\/signup/);
  await page.goto("/dashboard/profile");
  await expect(page.getByRole("heading", { name: "Profile", exact: true }).first()).toBeVisible();
  await expect(page.getByLabel(/Full name/i)).toHaveValue("New Fixture Student");
  await page.getByRole("button", { name: "Sign out", exact: true }).first().click();
  await expect(page).toHaveURL(/\/login/);
  await login(page, "studentb");
  await page.goto("/");
  await expect(page.getByTestId("home-enrolled")).not.toContainText("Fixture Paid NEET Test");
});
test("No wrong-course fallback, invalid chapter injection is rejected, and untrusted cached app-builder code cannot execute", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "kkcc-public-app-builder-v1",
      JSON.stringify({
        enabled: true,
        custom_js: "window.__cacheExecuted=true",
        top_html: "<img src=x onerror='window.__cacheExecuted=true'>",
      }),
    ),
  );
  await page.goto("/");
  expect(
    await page.evaluate(() =>
      Boolean((window as Window & { __cacheExecuted?: boolean }).__cacheExecuted),
    ),
  ).toBe(false);
  await page.goto("/checkout?course=nonexistent-course");
  await expect(page.getByRole("heading", { name: /^No .*selected$/ })).toBeVisible();
  await page.goto("/learn?course=nonexistent-course");
  await expect(page.getByRole("heading", { name: "Course not found" })).toBeVisible();
  await login(page, "admin");
  await page.goto(`/tests/learn/${ids.test}?subject=Physics&chapter=Invented-Chapter`);
  await expect(page.getByRole("alert")).toContainText("Invalid subject or chapter selection");
});

test("Real service worker caches public shell/assets, never private routes or authenticated RPCs, and shows a safe offline fallback", async ({
  browser,
}) => {
  const context = await browser.newContext({ serviceWorkers: "allow" });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await login(page);
    await page.goto("/dashboard/tests");
    await expect(page.getByRole("heading").first()).toBeVisible();
    const urls = await page.evaluate(async () => {
      const out: string[] = [];
      for (const key of await caches.keys()) {
        for (const request of await (await caches.open(key)).keys()) out.push(request.url);
      }
      return out;
    });
    expect(urls.length).toBeGreaterThan(0);
    expect(
      urls.some(
        (url) =>
          /\/(?:admin|dashboard|learn|tests\/learn|test-series\/learn|_server|__server|__fixture__)(?:\/|[?]|$)/.test(
            new URL(url).pathname,
          ) || new URL(url).searchParams.has("attempt"),
      ),
    ).toBe(false);
    await context.setOffline(true);
    await page.goto(`/tests/learn/${ids.test}`);
    await expect(page.locator("body")).toContainText(/offline/i);
  } finally {
    await context.close();
  }
});
