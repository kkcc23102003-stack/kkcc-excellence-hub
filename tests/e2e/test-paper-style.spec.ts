import { test, expect } from "@playwright/test";
import { fixtureIds } from "../fixtures/database";
test("single-accent test paper has neutral options, clear selection/flags, keyboard focus and mobile result", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@fixture.invalid");
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
  await page.goto(`/tests/learn/${fixtureIds.test}`);
  await page.getByTestId("learning-subject").first().click();
  await page.getByTestId("learning-chapter").first().click();
  await page.getByTestId("start-test").click();
  const paper = page.getByTestId("test-paper");
  await expect(paper).toBeVisible();
  const options = paper.getByTestId("answer-option");
  await page.mouse.move(0, 0);
  await expect
    .poll(async () =>
      options.evaluateAll(
        (nodes) => new Set(nodes.map((n) => getComputedStyle(n).backgroundColor)).size,
      ),
    )
    .toBe(1);
  const styles = await options.evaluateAll((nodes) =>
    nodes.map((node) => {
      const s = getComputedStyle(node);
      return {
        background: s.backgroundColor,
        border: s.borderColor,
        image: s.backgroundImage,
        shadow: s.boxShadow,
        textShadow: s.textShadow,
      };
    }),
  );
  expect(styles.length).toBeGreaterThan(1);
  for (const style of styles) {
    expect(style).toEqual(styles[0]);
    expect(style.image).toBe("none");
    expect(style.shadow).toBe("none");
    expect(style.textShadow).toBe("none");
  }
  await page.keyboard.press("Tab");
  await options.first().focus();
  expect(await options.first().evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(options.first()).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => options.first().evaluate((el) => getComputedStyle(el).borderColor))
    .not.toBe(styles[0]!.border);
  await paper.getByRole("button", { name: "Flag", exact: true }).click();
  await expect(
    paper.getByRole("button", { name: "Question 1, answered, flagged", exact: true }),
  ).toBeVisible();
  await paper.getByRole("button", { name: "Next", exact: true }).click();
  const flagged = paper.getByRole("button", { name: "Question 1, answered, flagged", exact: true });
  expect(await flagged.evaluate((el) => getComputedStyle(el).borderStyle)).toBe("dashed");
  await flagged.click();
  await expect(options.first()).toHaveAttribute("aria-pressed", "true");
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
      true,
    );
  }
  await page.screenshot({ path: "docs/audit/TEST-PAPER-MOBILE.png", fullPage: true });
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.screenshot({ path: "docs/audit/TEST-PAPER-DESKTOP.png", fullPage: true });
  await page.evaluate(() => {
    localStorage.setItem("kkcc-theme", "light");
    document.documentElement.classList.remove("dark");
  });
  await expect
    .poll(() => paper.evaluate((el) => getComputedStyle(el).backgroundColor))
    .toBe("rgb(247, 249, 252)");
  await page.screenshot({ path: "docs/audit/TEST-PAPER-LIGHT.png", fullPage: true });
  await paper.getByRole("button", { name: "Submit Test", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
  await expect(page.getByTestId("test-result")).toContainText("Correct answer:");
  const resultStyle = await page
    .getByTestId("test-result")
    .evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(resultStyle).toBe("none");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
    true,
  );
});
