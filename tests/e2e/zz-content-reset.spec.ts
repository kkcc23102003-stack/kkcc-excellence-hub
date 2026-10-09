// Runs last: this deliberately resets the disposable fixture library.
import { test, expect, type Page } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
async function login(page: Page, name = "admin") {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(`${name}@fixture.invalid`);
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
test("reviewed old library is removed, student result survives, and samples/new notes are Storage-backed", async ({
  page,
  browser,
}) => {
  test.setTimeout(180000);
  await login(page);
  await page.goto("/admin/materials");
  await page.getByRole("button", { name: "Add material", exact: true }).click();
  await page.getByLabel("Note title").fill("Remove this old Storage note");
  await page.getByLabel("Study notes content").fill("Old content to remove, not migrate.");
  await page.getByRole("checkbox", { name: "Published", exact: true }).check();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("button", { name: "Save changes", exact: true })).toBeEnabled();
  const rows = () =>
    JSON.parse(readFileSync("data/fixture-content.runtime.json", "utf8")).tables.materials;
  await expect
    .poll(
      () =>
        rows().find((r: { title: string }) => r.title === "Remove this old Storage note")
          ?.body_storage_path,
    )
    .toBeTruthy();
  const old = rows().find((r: { title: string }) => r.title === "Remove this old Storage note");
  expect(old.body_storage_path).toBeTruthy();
  const studentContext = await browser.newContext();
  const ongoingContext = await browser.newContext();
  try {
    const student = await studentContext.newPage();
    await login(student, "studenta");
    const id = "82000000-0000-4000-8000-000000000001";
    await student.goto(`/tests/learn/${id}`);
    await student.getByTestId("learning-subject").filter({ hasText: "Mathematics" }).click();
    await student.getByTestId("learning-chapter").filter({ hasText: "Storage migration" }).click();
    await student.getByTestId("start-test").click();
    // A previous full-suite attempt may already be submitted; otherwise submit this attempt.
    if ((await student.getByRole("heading", { name: "Result", exact: true }).count()) === 0) {
      await expect(student.getByTestId("test-question")).toBeVisible();
      await student.getByTestId("answer-option").filter({ hasText: "5" }).click();
      await student.getByRole("button", { name: "Submit Test", exact: true }).last().click();
    }
    await expect(student.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
    const resultURL = student.url();
    const ongoing = await ongoingContext.newPage();
    await login(ongoing, "studentb");
    await ongoing.goto(`/tests/learn/${id}`);
    await ongoing.getByTestId("learning-subject").filter({ hasText: "Mathematics" }).click();
    await ongoing.getByTestId("learning-chapter").filter({ hasText: "Storage migration" }).click();
    await ongoing.getByTestId("start-test").click();
    await expect(ongoing.getByTestId("test-question")).toBeVisible();
    const ongoingURL = ongoing.url();

    await page.goto("/admin/storage");
    const panel = page.getByTestId("content-reset-panel");
    await panel.getByRole("button", { name: "Review old content counts" }).click();
    await expect(panel.getByTestId("reset-counts")).toBeVisible();
    const remove = panel.getByRole("button", { name: "Delete reviewed old content batch" });
    await expect(remove).toBeDisabled();
    for (let batch = 0; batch < 15; batch++) {
      if (
        (await panel.getByTestId("reset-counts").innerText()).includes(
          "Remaining old rows: 0 · Pending Storage files: 0",
        )
      )
        break;
      await panel
        .getByLabel("Old content deletion confirmation")
        .fill("DELETE OLD NOTES AND TESTS");
      page.once("dialog", (dialog) => dialog.accept());
      await remove.click();
      await expect(panel.getByLabel("Old content deletion confirmation")).toHaveValue("");
    }
    await expect(panel.getByTestId("reset-counts")).toHaveText(
      "Remaining old rows: 0 · Pending Storage files: 0",
    );
    expect(existsSync(`.cache/fixture-note-bodies/${old.body_storage_path}`)).toBe(false);
    expect(rows().find((r: { id: string }) => r.id === old.id).description).toBe("");
    await student.goto(resultURL);
    await expect(student.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
    await expect(
      student.getByText("Explanation: Original migration explanation: two plus three is five.", {
        exact: true,
      }),
    ).toBeVisible();
    await ongoing.goto(resultURL);
    await expect(ongoing.getByRole("alert")).toContainText("Attempt not found for this account");
    await ongoing.goto(ongoingURL);
    await expect(ongoing.getByTestId("test-question")).toContainText(
      "Storage migration: what is 2 + 3?",
    );
    await ongoing.getByTestId("answer-option").filter({ hasText: "5" }).click();
    await ongoing.getByRole("button", { name: "Submit Test", exact: true }).last().click();
    await expect(ongoing.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
    await expect(
      ongoing.getByText("Explanation: Original migration explanation: two plus three is five.", {
        exact: true,
      }),
    ).toBeVisible();

    await student.goto("/study-material");
    await expect(
      student.locator("article").filter({ hasText: "Remove this old Storage note" }),
    ).toHaveCount(0);
    await student.goto("/test-series");
    await expect(student.getByTestId(`test-card-${id}`)).toHaveCount(0);
    await panel.getByRole("button", { name: "Save sample notes to Supabase Storage" }).click();
    await expect(
      panel.getByText(
        "Sample notes saved in Supabase Storage; Database has metadata/references only.",
      ),
    ).toBeVisible();
    const samples = rows().filter(
      (r: { batch: string; content_deleted_at?: string }) =>
        r.batch === "KKCC Study Library" && !r.content_deleted_at,
    );
    expect(samples.length).toBeGreaterThan(0);
    for (const sample of samples) {
      expect(sample.description).toBe("");
      expect(existsSync(`.cache/fixture-note-bodies/${sample.body_storage_path}`)).toBe(true);
    }
    await student.goto("/study-material");
    await expect(student.locator("article").first()).toBeVisible();
    await expect(
      student.locator("article").filter({ hasText: "Remove this old Storage note" }),
    ).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
      true,
    );
    await panel.screenshot({
      path: "docs/audit/CONTENT-RESET.png",
      style: "header{visibility:hidden}",
    });
  } finally {
    await studentContext.close();
    await ongoingContext.close();
  }
});
