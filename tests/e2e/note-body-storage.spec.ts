import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
type Note = {
  id: string;
  title: string;
  description: string;
  file_url: string | null;
  body_storage_path?: string;
  body_storage_sha256?: string;
  body_storage_bytes?: number;
};
const notes = (): Note[] =>
  JSON.parse(readFileSync("data/fixture-content.runtime.json", "utf8")).tables.materials;
async function login(page: Page, name = "admin") {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(`${name}@fixture.invalid`);
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
function verifyStored(note: Note, text: string) {
  expect(note.description).toBe("");
  expect(note.body_storage_path).toMatch(new RegExp(`^${note.id}/`));
  const bytes = readFileSync(`.cache/fixture-note-bodies/${note.body_storage_path}`);
  expect(bytes.toString("utf8")).toBe(text);
  expect(bytes.length).toBe(note.body_storage_bytes);
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(note.body_storage_sha256);
}
test("confirmed legacy migration verifies files, preserves external PDFs, and is resumable", async ({
  page,
}) => {
  await login(page);
  await page.goto("/admin/storage");
  const panel = page.getByTestId("note-body-storage-panel");
  await panel.getByRole("button", { name: "Check note body storage" }).click();
  await expect(panel.getByTestId("note-body-counts")).toBeVisible();
  const before = notes()
    .filter((row) => !row.body_storage_path && Boolean(row.description))
    .sort((a, b) => a.id.localeCompare(b.id));
  expect(before.length).toBeGreaterThan(0);
  const button = panel.getByRole("button", { name: "Move next 5 note bodies" });
  await expect(button).toBeDisabled();
  await panel.getByLabel("Note migration confirmation").fill("MOVE NOTES TO STORAGE");
  page.once("dialog", (dialog) => dialog.accept());
  await button.click();
  const moved = Math.min(5, before.length);
  await expect(
    panel.getByRole("status").filter({ hasText: `Last batch: ${moved} moved` }),
  ).toBeVisible();
  const after = notes();
  for (const previous of before.slice(0, 5)) {
    const next = after.find((row) => row.id === previous.id)!;
    verifyStored(next, previous.description);
    expect(next.file_url).toBe(previous.file_url);
  }
  await expect(button).toBeDisabled();
  await page.reload();
  await page.getByRole("button", { name: "Check note body storage" }).click();
  await expect(page.getByTestId("note-body-counts")).toContainText(
    `Database text: ${before.length - moved} notes`,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
    true,
  );
  await page.getByTestId("note-body-storage-panel").screenshot({
    path: "docs/audit/NOTE-BODY-STORAGE.png",
    style: "header { visibility: hidden; }",
  });
});
test("new/edit note text is file-backed; metadata saves reuse files; free and paid readers retain access rules", async ({
  page,
  browser,
}) => {
  await login(page);
  await page.goto("/admin/materials");
  await page.getByRole("button", { name: "Add material", exact: true }).click();
  const title = "Storage backed audit note",
    body = "ਪੰਜਾਬੀ नोट्स — exact body\n\nThe explanation stays unchanged.";
  await page.getByLabel("Note title").fill(title);
  await page.getByLabel("Study notes content").fill(body);
  await page.getByRole("checkbox", { name: "Published", exact: true }).check();
  const save = async (text: string) => {
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect
      .poll(() => notes().find((row) => row.title === title)?.body_storage_sha256)
      .toBe(createHash("sha256").update(text).digest("hex"));
    await expect(page.getByRole("button", { name: "Save changes", exact: true })).toBeEnabled();
  };
  await save(body);
  verifyStored(
    notes().find((row) => row.title === title)!,
    body,
  );
  const guestContext = await browser.newContext();
  const guest = await guestContext.newPage();
  await guest.goto("/study-material");
  let card = guest.locator("article").filter({ hasText: title });
  await card.getByRole("button", { name: "Read Notes" }).click();
  await expect(guest.getByText("The explanation stays unchanged.", { exact: false })).toBeVisible();
  const edited = body + "\nEdited without losing diagrams or image references.";
  await page.getByLabel("Study notes content").fill(edited);
  await save(edited);
  let stored = notes().find((row) => row.title === title)!;
  verifyStored(stored, edited);
  const path = stored.body_storage_path;
  await page.getByLabel("Note access mode").selectOption("paid");
  await page.getByLabel("Note price rupees").fill("99");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect
    .poll(
      () =>
        notes().find((row) => row.title === title) &&
        JSON.parse(readFileSync("data/fixture-content.runtime.json", "utf8")).tables.materials.find(
          (row: Note) => row.title === title,
        ).price,
    )
    .toBe(99);
  stored = notes().find((row) => row.title === title)!;
  expect(stored.body_storage_path).toBe(path);
  verifyStored(stored, edited);
  await guest.reload();
  card = guest.locator("article").filter({ hasText: title });
  await expect(card.getByRole("link", { name: "Sign in to access" })).toBeVisible();
  expect(await guest.content()).not.toContain(edited);
  expect(await guest.content()).not.toContain(path!);
  await login(guest, "studentb");
  await guest.goto("/study-material");
  await expect(
    guest
      .locator("article")
      .filter({ hasText: title })
      .getByRole("link", { name: "Buy Notes — ₹99" }),
  ).toBeVisible();
  expect(await guest.content()).not.toContain("Edited without losing");
  await page.goto("/study-material");
  await page
    .locator("article")
    .filter({ hasText: title })
    .getByRole("button", { name: "Read Notes" })
    .click();
  await expect(
    page.getByText("Edited without losing diagrams or image references", { exact: false }),
  ).toBeVisible();
  await page.goto("/admin/students");
  await page.locator("#coin-email").fill("studentb@fixture.invalid");
  await page.getByLabel("23KAAT amount").fill("100");
  await page.getByRole("button", { name: "Grant 23KAAT", exact: true }).click();
  await expect(page.getByText(/100 23KAAT granted to/)).toBeVisible();
  await guest
    .locator("article")
    .filter({ hasText: title })
    .getByRole("link", { name: "Buy Notes — ₹99" })
    .click();
  await guest.getByRole("button", { name: /Use 99 23KAAT coins/ }).click();
  await expect(guest.getByText(/Unlocked with 23KAAT/)).toBeVisible();
  await guest.goto("/study-material");
  await guest
    .locator("article")
    .filter({ hasText: title })
    .getByRole("button", { name: "Read Notes" })
    .click();
  await expect(
    guest.getByText("Edited without losing diagrams or image references", { exact: false }),
  ).toBeVisible();
  await guestContext.close();
});

test("sample adoption stores bodies in private files and preserves existing notes on retry", async ({
  page,
}) => {
  const { builtInMaterials } = await import("../../src/lib/builtin-materials.server");
  await login(page);
  await page.goto("/admin/materials");
  const before = notes();
  await page.getByRole("button", { name: "Make sample notes editable" }).click();
  await expect(
    page.getByText("Sample library is now editable below. Deleted samples will not reappear.", {
      exact: true,
    }),
  ).toBeVisible();
  const after = notes();
  for (const previous of before)
    expect(after.find((row) => row.id === previous.id)).toEqual(previous);
  for (const sample of builtInMaterials().filter((row) => !before.some((old) => old.id === row.id)))
    verifyStored(
      after.find((row) => row.id === sample.id)!,
      sample.description,
    );
  await page.getByRole("button", { name: "Make sample notes editable" }).click();
  await expect(page.getByRole("button", { name: "Make sample notes editable" })).toBeEnabled();
  expect(notes()).toEqual(after);
});
