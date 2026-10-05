import { test, expect, type Page } from "@playwright/test";
async function login(page: Page, name = "admin") {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(`${name}@fixture.invalid`);
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/ }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
test("Subject/chapter/topic drafts persist; complete subject combines own questions and publishes a student-ready snapshot", async ({
  browser,
}) => {
  const admin = await browser.newContext(),
    student = await browser.newContext();
  try {
    const ap = await admin.newPage(),
      sp = await student.newPage();
    await login(ap);
    await ap.goto("/admin/tests");
    await ap.getByRole("button", { name: "Subjects & Chapters", exact: true }).click();
    const organiser = ap.getByTestId("test-folder-organiser");
    const series = `Folder Series ${Date.now()}`;
    await organiser.getByLabel("Series name", { exact: true }).fill(series);
    await organiser.getByRole("button", { name: "Continue → Subjects", exact: true }).click();
    await organiser.getByLabel(`Subject name in ${series}`, { exact: true }).fill("Mathematics");
    const seriesPanel = organiser
      .getByTestId("outline-series")
      .filter({ has: ap.getByRole("heading", { name: series, exact: true }) });
    await seriesPanel.getByRole("button", { name: "Save subject", exact: true }).click();
    await expect(
      seriesPanel.getByRole("button", { name: `Subject: Mathematics — ${series}`, exact: true }),
    ).toBeVisible();
    await seriesPanel.getByLabel(`Subject name in ${series}`, { exact: true }).fill("Hindi");
    await seriesPanel.getByRole("button", { name: "Save subject", exact: true }).click();
    await expect(
      seriesPanel.getByRole("button", { name: `Subject: Hindi — ${series}`, exact: true }),
    ).toHaveAttribute("aria-expanded", "false");
    const root = organiser.getByTestId("outline-subject").filter({
      has: ap.getByRole("button", { name: `Subject: Mathematics — ${series}`, exact: true }),
    });
    await expect(
      root.getByRole("button", { name: `Subject: Mathematics — ${series}`, exact: true }),
    ).toHaveAttribute("aria-expanded", "false");
    await root
      .getByRole("button", { name: `Subject: Mathematics — ${series}`, exact: true })
      .click();
    await expect(
      root.getByRole("button", { name: `Subject: Mathematics — ${series}`, exact: true }),
    ).toHaveAttribute("aria-expanded", "true");
    await root
      .getByLabel("Chapters list for Mathematics", { exact: true })
      .fill("1. Addition\n2. Subtraction");
    await root.getByRole("button", { name: "Add chapters", exact: true }).click();
    await expect(
      root.getByRole("button", { name: "Chapter: Addition", exact: true }),
    ).toBeVisible();
    await expect(root.getByLabel("Topics list for Addition", { exact: true })).not.toBeVisible();
    for (const [chapter, topic, title, q] of [
      [
        "Addition",
        "Basics",
        "Addition folder set",
        "Q1. What is 2 + 3?\nA) 4\nB) 5\nAnswer: B\nExplanation: Addition explanation.",
      ],
      [
        "Subtraction",
        "",
        "Subtraction folder set",
        "Q1. What is 10 - 4?\nA) 6\nB) 5\nAnswer: A\nExplanation: Subtraction explanation.",
      ],
    ]) {
      const chapterPanel = root
        .getByTestId("outline-chapter")
        .filter({ has: ap.getByRole("button", { name: `Chapter: ${chapter}`, exact: true }) });
      await chapterPanel.getByRole("button", { name: `Chapter: ${chapter}`, exact: true }).click();
      if (topic) {
        await chapterPanel.getByLabel(`Topics list for ${chapter}`, { exact: true }).fill(topic);
        await chapterPanel.getByRole("button", { name: "Add topics", exact: true }).click();
        const topicPanel = chapterPanel.getByTestId("outline-topic");
        await topicPanel.getByRole("button", { name: `Topic: ${topic}`, exact: true }).click();
        await topicPanel
          .getByRole("button", { name: "Paste topic questions", exact: true })
          .click();
      } else {
        await chapterPanel
          .getByRole("button", { name: "Skip topics → Paste chapter questions", exact: true })
          .click();
      }
      const editor = organiser.getByTestId("easy-test-builder");
      await expect(editor.getByLabel("Chapter", { exact: true })).toHaveValue(chapter!);
      await expect(editor.getByLabel("Topic (optional)", { exact: true })).toHaveValue(topic!);
      await expect(chapterPanel.getByTestId("folder-test-draft")).toBeVisible();
      await editor.getByLabel("Test title (optional)").fill(title!);
      if (chapter === "Addition") {
        await editor.getByRole("radio", { name: "Paid", exact: true }).check();
        await editor.getByLabel("Price (₹)", { exact: true }).fill("99");
      }
      await editor.getByLabel("Your question text").fill(q!);
      await chapterPanel.getByRole("button", { name: `Chapter: ${chapter}`, exact: true }).click();
      await expect(editor).not.toBeVisible();
      await chapterPanel.getByRole("button", { name: `Chapter: ${chapter}`, exact: true }).click();
      await expect(editor.getByLabel("Your question text")).toHaveValue(q!);
      await ap.setViewportSize({ width: 390, height: 844 });
      expect(await ap.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
        true,
      );
      await ap.setViewportSize({ width: 1280, height: 800 });

      await editor.getByRole("button", { name: /Preview questions/ }).click();
      await editor.getByRole("button", { name: "Next → Review publish" }).click();
      await editor.getByRole("checkbox").check();
      await editor.getByRole("button", { name: "Save folder draft" }).click();
      await expect(organiser.getByRole("status")).toContainText("saved as draft");
      await expect(editor).toHaveCount(0);
    }
    await ap.reload();
    await ap.getByRole("button", { name: "Subjects & Chapters", exact: true }).click();
    await organiser
      .getByRole("button", { name: `Subject: Mathematics — ${series}`, exact: true })
      .click();
    await expect(organiser).toContainText("Addition folder set");
    await expect(organiser).toContainText("Subtraction folder set");
    await login(sp, "studenta");
    await sp.goto("/test-series");
    await expect(sp.getByText("Addition folder set", { exact: true })).toHaveCount(0);
    await organiser
      .getByRole("checkbox", { name: "Select Addition folder set", exact: true })
      .check();
    await organiser
      .getByRole("button", { name: "Make test from selected sets (1)", exact: true })
      .click();
    await expect(organiser.getByRole("status")).toContainText("1 questions ready");
    await expect(
      organiser.getByTestId("easy-test-builder").getByLabel("Chapter", { exact: true }),
    ).toHaveValue("Addition");
    await expect(
      organiser.getByTestId("easy-test-builder").getByRole("radio", { name: "Paid", exact: true }),
    ).toBeChecked();
    await organiser
      .getByTestId("easy-test-builder")
      .getByRole("button", { name: /Preview questions/ })
      .click();
    await expect(organiser.getByTestId("easy-test-builder").getByRole("alert")).toContainText(
      "Paid test ke liye",
    );
    ap.once("dialog", (dialog) => void dialog.accept());
    await organiser.getByRole("button", { name: "Close unsaved editor" }).click();
    await ap.setViewportSize({ width: 390, height: 844 });
    expect(await ap.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
      true,
    );
    await ap.setViewportSize({ width: 1280, height: 800 });
    await organiser.getByRole("button", { name: "Complete subject test" }).click();
    await expect(organiser.getByRole("status")).toContainText("2 questions ready");
    const editor = organiser.getByTestId("easy-test-builder");
    await expect(editor.getByLabel("Chapter", { exact: true })).toHaveValue("Complete Test");
    await editor.getByLabel("Test title (optional)").fill(`Complete ${series}`);
    await expect(editor.getByRole("radio", { name: "Paid", exact: true })).toBeChecked();
    await editor.getByRole("radio", { name: "Free", exact: true }).check();
    await editor.getByRole("button", { name: /Preview questions/ }).click();
    await expect(editor.getByLabel("Q1 explanation")).toBeVisible();
    await editor.getByRole("button", { name: "Next → Review publish" }).click();
    await editor.getByRole("checkbox").check();
    await editor.getByRole("button", { name: "Publish my test" }).click();
    await expect(organiser.getByRole("status")).toHaveText("Test published.");
    await expect(organiser).toContainText("Combined snapshot");
    await sp.reload();
    const card = sp
      .locator('[data-testid^="test-card-"]')
      .filter({ hasText: `Complete ${series}` });
    await expect(card).toContainText("2 questions");
    await card.getByRole("link", { name: /Start/ }).click();
    await sp.getByTestId("learning-subject").filter({ hasText: "Mathematics" }).click();
    await sp.getByTestId("learning-chapter").filter({ hasText: "Complete Test" }).click();
    await sp.getByTestId("start-test").click();
    await expect(sp.getByTestId("test-question")).toBeVisible();
    await expect(sp.getByTestId("test-question")).toContainText(/What is 2 \+ 3|What is 10 - 4/);
    await sp.getByTestId("answer-option").first().click();
    await sp.getByRole("button", { name: "Submit Test", exact: true }).last().click();
    await expect(sp.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
    await sp.reload();
    await expect(sp.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
  } finally {
    await admin.close();
    await student.close();
  }
});
