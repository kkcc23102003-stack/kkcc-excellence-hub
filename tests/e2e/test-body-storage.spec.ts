import { test, expect, type Page } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
const testId = "82000000-0000-4000-8000-000000000001";
async function login(page: Page, name = "admin") {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(`${name}@fixture.invalid`);
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
async function attempt(page: Page) {
  await page.goto(`/tests/learn/${testId}`);
  await page.getByTestId("learning-subject").filter({ hasText: "Mathematics" }).click();
  await page.getByTestId("learning-chapter").filter({ hasText: "Storage migration" }).click();
  await page.getByTestId("start-test").click();
  await expect(page.getByTestId("test-question")).toContainText(
    "Storage migration: what is 2 + 3?",
  );
  await page.getByTestId("answer-option").filter({ hasText: "5" }).click();
  await page.getByRole("button", { name: "Submit Test", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
}
test("verified migration clears only test bodies; existing saved result and fresh attempts still work", async ({
  page,
  browser,
}) => {
  const studentContext = await browser.newContext(),
    otherContext = await browser.newContext();
  try {
    const student = await studentContext.newPage(),
      other = await otherContext.newPage();
    await login(student, "studenta");
    await attempt(student);
    const resultURL = student.url();
    await login(page);
    await page.goto("/admin/storage");
    const panel = page.getByTestId("test-body-storage-panel");
    await panel.getByRole("button", { name: "Check test / historical content storage" }).click();
    await expect(panel.getByTestId("test-body-counts")).toContainText("Database bodies: 1");
    const move = panel.getByRole("button", { name: "Move verified content batch" });
    await expect(move).toBeDisabled();
    await panel.getByLabel("Test migration confirmation").fill("MOVE CONTENT TO STORAGE");
    page.once("dialog", (dialog) => dialog.accept());
    await move.click();
    await expect(
      panel.getByRole("status").filter({ hasText: "Last batch: 1 moved" }),
    ).toBeVisible();
    await expect(panel.getByTestId("test-body-counts")).toContainText("Database bodies: 0");
    const directory = `.cache/fixture-test-bodies/${testId}`;
    const files = readdirSync(directory);
    expect(files.length).toBeGreaterThan(0);
    const bodies = files.map((file) => JSON.parse(readFileSync(`${directory}/${file}`, "utf8")));
    expect(
      bodies.some((body) =>
        body.questions.some(
          (q: { question_text: string; explanation: string }) =>
            q.question_text === "Storage migration: what is 2 + 3?" &&
            q.explanation === "Original migration explanation: two plus three is five.",
        ),
      ),
    ).toBe(true);
    await student.goto(resultURL);
    await expect(student.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
    await expect(student.getByText("Test submitted · Saved to your account")).toBeVisible();
    await login(other, "studentb");
    await attempt(other);
    await other.reload();
    await expect(other.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
      true,
    );
    await panel.screenshot({
      path: "docs/audit/TEST-BODY-STORAGE.png",
      style: "header { visibility:hidden; }",
    });
    await panel.getByLabel("Content migration source").selectOption("legacy-notes");
    await panel.getByRole("button", { name: "Check test / historical content storage" }).click();
    await expect(panel.getByTestId("test-body-counts")).toContainText("Database bodies: 0");
    await expect(move).toBeDisabled();
  } finally {
    await studentContext.close();
    await otherContext.close();
  }
});
