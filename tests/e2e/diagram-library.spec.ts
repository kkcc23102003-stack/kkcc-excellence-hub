import { test, expect } from "@playwright/test";

test("admin filters syllabus maps, previews and inserts into unsaved note without enabling diagrams", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@fixture.invalid");
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
  await page.goto("/admin/materials");
  await page
    .getByRole("button", { name: /Add material/i })
    .first()
    .click();
  await page.getByRole("button", { name: "Open full syllabus diagram library" }).click();
  await expect(page.getByText(/1002 total/)).toBeVisible();
  await page.getByLabel("Diagram exam filter").selectOption("NEET");
  await page.getByLabel("Diagram subject filter").selectOption("Biology");
  await page.getByLabel("Search diagram topics").fill("Anatomy of Flowering Plants");
  await page.getByRole("button", { name: /Anatomy of Flowering Plants.*Revision map/ }).click();
  await expect(page.getByRole("heading", { name: /Preview: Biology/ })).toBeVisible();
  await page.getByLabel("No diagrams for this note").check();
  await page.getByRole("button", { name: "Insert into note draft" }).click();
  await expect(page.getByRole("button", { name: "Inserted into draft" })).toBeDisabled();
  await expect(page.getByLabel("No diagrams for this note")).toBeChecked();
  await expect(page.locator("textarea").first()).toHaveValue(/Anatomy of Flowering Plants/);
  await page.getByLabel("Search diagram topics").fill("no-such-topic-zzzz");
  await expect(page.getByText("No matching topics.", { exact: false })).toBeVisible();
});
