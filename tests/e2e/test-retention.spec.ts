import { test, expect, type Page } from "@playwright/test";
import { fixtureIds } from "../fixtures/database";
async function start(page: Page) {
  await page.goto(`/tests/learn/${fixtureIds.test}`);
  await page.getByTestId("learning-subject").first().click();
  await page.getByTestId("learning-chapter").first().click();
  await page.getByTestId("start-test").click();
  await expect(page.getByTestId("test-paper")).toBeVisible();
}
async function storage(page: Page) {
  return page.evaluate(() => ({
    local: { ...localStorage },
    session: Object.fromEntries(
      Object.entries(sessionStorage).filter(([key]) => key !== "tsr-scroll-restoration-v1_3"),
    ),
  }));
}
test("Admin retention ON/OFF, RAM-only result, refresh loss, confirmed cleanup and restored saved results", async ({
  page,
  context,
  browser,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@fixture.invalid");
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
  const admin = await context.newPage();
  await admin.goto("/admin/students");
  const grants = admin.getByTestId("admin-enrollment-panel");
  await grants.getByLabel("Enrollment student").selectOption(fixtureIds.studentA);
  await grants.getByLabel("Enrollment type").selectOption("test");
  await grants.getByLabel("Enrollment item").selectOption(fixtureIds.test);
  await grants.getByRole("button", { name: "Grant Enrollment" }).click();
  await expect(grants.getByText("Enrollment verified. Student access is active.")).toBeVisible();
  const studentContext = await browser.newContext();
  const student = await studentContext.newPage();
  await student.goto("/login");
  await student.getByLabel("Email", { exact: true }).fill("studenta@fixture.invalid");
  await student.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await student.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(student).not.toHaveURL(/\/login/);

  await admin.goto("/admin/storage");
  const panel = admin.getByTestId("test-retention-panel");
  const mode = panel.getByRole("switch", { name: "Save test results" });
  await expect(mode).toHaveAttribute("aria-checked", "true");
  const count = async () => {
    await panel.getByRole("button", { name: "Refresh setting and history counts" }).click();
    await expect(
      panel.getByRole("button", { name: "Refresh setting and history counts" }),
    ).toBeEnabled();
    return (await panel.getByTestId("test-history-count").innerText()).match(
      /Saved attempts: (\d+)/,
    )![1];
  };
  const before = Number(await count());
  await start(page);
  await page.getByTestId("answer-option").first().click();
  await page.getByRole("button", { name: "Submit Test", exact: true }).last().click();
  await expect(page.getByTestId("test-result")).toContainText("Saved to your account");
  await expect.poll(async () => Number(await count())).toBe(before + 1);
  await mode.click();
  await admin.getByRole("button", { name: "Confirm setting", exact: true }).click();
  await expect(mode).toHaveAttribute("aria-checked", "false");
  try {
    const old = await storage(student);
    await start(student);
    await expect(student.getByTestId("temporary-test-notice")).toBeVisible();
    await expect(student).toHaveURL(/temporary=true/);
    await student.getByTestId("answer-option").first().click();
    await student.getByRole("button", { name: "Next", exact: true }).click();
    await student.getByTestId("answer-option").last().click();
    await student.getByRole("button", { name: "Submit Test", exact: true }).last().click();
    await expect(student.getByTestId("test-result")).toContainText("Not saved to your account");
    await expect(student.getByTestId("test-result")).toContainText("Correct answer:");
    expect(await storage(student)).toEqual(old);
    await expect.poll(async () => Number(await count())).toBe(before + 1);
    await student.setViewportSize({ width: 390, height: 844 });
    expect(
      await student.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
    ).toBe(true);
    await student.screenshot({ path: "docs/audit/TEMPORARY-TEST-RESULT.png", fullPage: true });
    await student.reload();
    await expect(student.getByRole("alert")).toContainText("Temporary test is no longer available");
    await start(student);
    await student.getByTestId("answer-option").first().click();
    await student.reload();
    await expect(student.getByRole("alert")).toContainText("Temporary test is no longer available");
    await expect.poll(async () => Number(await count())).toBe(before + 1);
    await expect(
      panel.getByRole("button", { name: "Delete old test history", exact: true }),
    ).toBeDisabled();
    await panel.getByLabel("History cleanup confirmation").fill("DELETE TEST HISTORY");
    await panel.getByRole("button", { name: "Delete old test history", exact: true }).click();
    await admin.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect.poll(async () => Number(await count())).toBe(before + 1);
    await panel.getByRole("button", { name: "Delete old test history", exact: true }).click();
    await admin.getByRole("button", { name: "Confirm delete history", exact: true }).click();
    await expect(panel.getByTestId("test-history-count")).toContainText("Saved attempts: 0");
    await admin.screenshot({ path: "docs/audit/TEST-RETENTION-ADMIN.png", fullPage: true });
  } finally {
    if ((await mode.getAttribute("aria-checked")) === "false") {
      await mode.click();
      await admin.getByRole("button", { name: "Confirm setting", exact: true }).click();
      await expect(mode).toHaveAttribute("aria-checked", "true");
    }
  }
  await start(page);
  await page.getByRole("button", { name: "Submit Test", exact: true }).last().click();
  await expect(page.getByTestId("test-result")).toContainText("Saved to your account");
  await page.reload();
  await expect(page.getByTestId("test-result")).toContainText("Saved to your account");
  await studentContext.close();
  await admin.close();
});
