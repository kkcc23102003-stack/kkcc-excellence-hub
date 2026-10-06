import { test, expect, type Page } from "@playwright/test";
import { fixtureIds } from "../fixtures/database";
async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@fixture.invalid");
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
  "base64",
);
test("paid test: text thumbnail, uploaded replacement, remove and reload; access stays paid", async ({
  page,
  context,
}) => {
  await login(page);
  await page.goto("/admin/tests");
  await page.getByText("Test thumbnails — image / text / remove", { exact: true }).click();
  await page.getByLabel("Choose test thumbnail").selectOption(fixtureIds.test);
  const editor = page.getByTestId("thumbnail-editor");
  const save = async () => {
    await page.getByRole("button", { name: "Save test thumbnail", exact: true }).click();
    await expect(page.getByText("Test thumbnail saved.", { exact: true })).toBeVisible();
  };
  await editor.getByRole("button", { name: "Text thumbnail", exact: true }).click();
  await editor.getByLabel("Thumbnail text", { exact: true }).fill("NEET Physics\nਪੰਜਾਬੀ revision");
  await save();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
    true,
  );
  const student = await context.newPage();
  await student.goto("/test-series");
  const card = student.getByTestId(`test-card-${fixtureIds.test}`);
  await expect(card.getByTestId("content-thumbnail")).toContainText("ਪੰਜਾਬੀ revision");
  await card.screenshot({ path: "docs/audit/THUMBNAIL-TEXT-CARD.png" });
  await expect(card).toContainText("Paid");
  await editor.getByRole("button", { name: "Image thumbnail", exact: true }).click();
  await editor
    .getByLabel("Upload thumbnail image")
    .setInputFiles({ name: "cover.png", mimeType: "image/png", buffer: png });
  await expect(editor.getByLabel("Thumbnail image URL")).toHaveValue(/\/uploads\/thumbnails\//);
  await save();
  await student.reload();
  const img = card.getByRole("img");
  await expect(img).toBeVisible();
  await expect
    .poll(() => img.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await page.reload();
  await page.getByText("Test thumbnails — image / text / remove", { exact: true }).click();
  await page.getByLabel("Choose test thumbnail").selectOption(fixtureIds.test);
  await expect(editor.getByLabel("Thumbnail image URL")).toHaveValue(/\/uploads\/thumbnails\//);
  await editor.getByRole("button", { name: "Remove thumbnail", exact: true }).click();
  await save();
  await student.reload();
  await expect(card.getByTestId("content-thumbnail")).toHaveCount(0);
  await expect(card).toContainText("Paid");
  await student.close();
});
test("note thumbnails work for free and paid notes; text escapes HTML and removing does not delete content", async ({
  page,
  context,
}) => {
  await login(page);
  await page.goto("/admin/materials");
  await page.getByRole("button", { name: "Add material", exact: true }).click();
  await page.getByLabel("Note title").fill("Thumbnail audit note");
  const editor = page.getByTestId("thumbnail-editor");
  await editor.getByRole("button", { name: "Text thumbnail", exact: true }).click();
  await editor.getByLabel("Thumbnail text", { exact: true }).fill("Chapter one <b>plain text</b>");
  await page.getByRole("checkbox", { name: "Published", exact: true }).check();
  const save = async () => {
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(page.getByRole("button", { name: "Save changes", exact: true })).toBeEnabled();
  };
  await save();
  const student = await context.newPage();
  await student.goto("/study-material");
  const card = student.locator("article").filter({ hasText: "Thumbnail audit note" });
  await expect(card.getByTestId("content-thumbnail")).toContainText(
    "Chapter one <b>plain text</b>",
  );
  await expect(card.locator("b")).toHaveCount(0);
  await page.getByLabel("Note access mode").selectOption("paid");
  await page.getByLabel("Note price rupees").fill("99");
  await editor.getByRole("button", { name: "Image thumbnail", exact: true }).click();
  await editor.getByLabel("Thumbnail image URL").fill("/logo.png");
  await save();
  await student.reload();
  await expect(card.getByRole("img")).toBeVisible();
  await expect(card).toContainText("₹99");
  await editor.getByRole("button", { name: "Remove thumbnail", exact: true }).click();
  await save();
  await student.reload();
  await expect(card.getByTestId("content-thumbnail")).toHaveCount(0);
  await expect(card).toContainText("₹99");
  await expect(card).toContainText("Thumbnail audit note");
  await student.close();
});
