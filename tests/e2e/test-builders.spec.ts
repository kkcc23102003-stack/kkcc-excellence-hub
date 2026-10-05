import { test, expect, type Page } from "@playwright/test";
const stamp = Date.now();
const text = `Q1. What is 2 + 3?
A) 4
B) 5
C) 6
D) 7
Answer: B
Explanation: Original addition explanation.

Q2. What is 10 - 4?
A) 6
B) 5
C) 4
D) 3
Answer: A
Explanation: Original subtraction explanation.`;
async function login(page: Page, name = "admin") {
  if (new URL(page.url()).pathname !== "/login") await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(`${name}@fixture.invalid`);
  await page.getByLabel("Password", { exact: true }).fill("FixturePass123!");
  await page.getByRole("button", { name: /Sign in|Login|Log in/i }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
async function easy(page: Page, title: string, series: string, paid = false) {
  await page.goto("/admin/tests");
  const panel = page.getByTestId("easy-test-builder");
  await panel.getByLabel("Subject", { exact: true }).fill("Mathematics");
  await panel.getByLabel("Chapter", { exact: true }).fill("Addition");
  await panel.getByLabel("Test title (optional)").fill(title);
  await panel.getByLabel("Series name (optional)").fill(series);
  if (paid) {
    await panel.getByRole("radio", { name: "Paid", exact: true }).check();
    await panel.getByLabel("Price (₹)", { exact: true }).fill("199");
    await panel.getByLabel("Coin price", { exact: true }).fill("20");
  }
  await panel.getByLabel("Your question text").fill(text);
  await panel.getByRole("button", { name: /Preview questions/ }).click();
  await expect(panel.getByText("2 questions ready.", { exact: false })).toBeVisible();
  await panel
    .getByLabel("Q1 explanation", { exact: true })
    .first()
    .fill("Edited explanation — 2 + 3 = 5.");
  await panel.getByRole("button", { name: "Next → Review publish" }).click();
  await expect(panel.getByTestId("easy-series-review")).toHaveText(`Series: ${series}`);
  await expect(panel.getByRole("button", { name: "Publish my test" })).toBeDisabled();
  await panel.getByRole("checkbox").check();
  await panel.getByRole("button", { name: "Publish my test" }).click();
  const settings = page.getByTestId("advanced-test-settings");
  await expect(settings).toBeVisible();
  await expect(settings.getByLabel("Test title", { exact: true })).toHaveValue(title);
  await expect(settings.getByLabel("Series name", { exact: true })).toHaveValue(series);
  const id = await settings.getAttribute("data-test-id");
  expect(id).toBeTruthy();
  return id!;
}
async function attempt(page: Page, id: string) {
  await page.goto(`/tests/learn/${id}`);
  await page.getByTestId("learning-subject").filter({ hasText: "Mathematics" }).click();
  await page.getByTestId("learning-chapter").filter({ hasText: "Addition" }).click();
  await page.getByTestId("start-test").click();
  await expect(page.getByTestId("test-question")).toContainText("What is 2 + 3?");
  await expect(page.getByTestId("test-question")).not.toContainText(/Preamble|Constitution/);
  await page.getByTestId("answer-option").filter({ hasText: /5/ }).click();
  await page.getByRole("button", { name: "Submit Test", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
  await expect(page.getByText("Test submitted · Saved to your account")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
}
test("Easy free series name, edited explanations, publish, student attempt/result and Advanced edit persist", async ({
  browser,
}) => {
  const admin = await browser.newContext(),
    student = await browser.newContext();
  try {
    const ap = await admin.newPage(),
      sp = await student.newPage();
    await login(ap);
    const name = `Easy Math ${stamp}`,
      series = `Easy Series ${stamp}`;
    const id = await easy(ap, name, series);
    await ap.reload();
    await ap.getByRole("button", { name: "Advanced — existing setup" }).click();
    await ap.getByRole("button", { name: new RegExp(name) }).click();
    const settings = ap.getByTestId("advanced-test-settings");
    await expect(settings.getByLabel("Series name", { exact: true })).toHaveValue(series);
    await expect(
      ap.getByText("Edited explanation — 2 + 3 = 5.", { exact: false }).first(),
    ).toBeVisible();
    await settings.getByLabel("Series name", { exact: true }).fill(`${series} Updated`);
    await settings.getByLabel("Series name", { exact: true }).press("Tab");
    await expect(ap.getByRole("button", { name: new RegExp(name) })).toContainText(
      `${series} Updated`,
    );
    await login(sp, "studenta");
    await sp.goto("/test-series");
    await expect(sp.getByTestId(`test-card-${id}`)).toContainText(`${series} Updated`);
    await attempt(sp, id);
  } finally {
    await admin.close();
    await student.close();
  }
});
test("Easy paid publishes correct prices, blocks unpaid student, offline grant unlocks only assigned student", async ({
  browser,
}) => {
  const admin = await browser.newContext(),
    student = await browser.newContext(),
    other = await browser.newContext();
  try {
    const ap = await admin.newPage(),
      sp = await student.newPage(),
      op = await other.newPage();
    await login(ap);
    const id = await easy(ap, `Paid Math ${stamp}`, `Paid Series ${stamp}`, true);
    const settings = ap.getByTestId("advanced-test-settings");
    await expect(settings.getByLabel("Price in rupees")).toHaveValue("199");
    await expect(settings.getByLabel("Price in Kit 2 Coins")).toHaveValue("20");
    await expect(settings.getByRole("button", { name: "Make this free" })).toBeVisible();
    await login(sp, "studenta");
    await sp.goto(`/tests/learn/${id}`);
    await expect(sp.getByRole("alert")).toContainText("TEST_ACCESS_REQUIRED");
    await ap.goto("/admin/students");
    const panel = ap.getByTestId("admin-enrollment-panel");
    await panel
      .getByLabel("Enrollment student")
      .selectOption("00000000-0000-4000-8000-000000000002");
    await panel.getByLabel("Enrollment type").selectOption("test");
    await panel.getByLabel("Enrollment item").selectOption(id);
    await panel.getByRole("button", { name: "Grant Enrollment" }).click();
    await expect(panel.getByText("Enrollment verified. Student access is active.")).toBeVisible();
    await attempt(sp, id);
    await login(op, "studentb");
    await op.goto(`/tests/learn/${id}`);
    await expect(op.getByRole("alert")).toContainText("TEST_ACCESS_REQUIRED");
  } finally {
    await admin.close();
    await student.close();
    await other.close();
  }
});
test("Advanced blank draft cannot publish; own bulk preview/publish retains series and questions", async ({
  page,
}) => {
  await login(page);
  await page.goto("/admin/tests");
  await page.getByRole("button", { name: "Advanced — existing setup" }).click();
  await page.getByRole("button", { name: "New test", exact: true }).click();
  const settings = page.getByTestId("advanced-test-settings");
  await expect(settings.getByLabel("Test title", { exact: true })).toHaveValue("New test");
  await settings.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(
    page
      .getByText(/Add real questions before publishing|Choose a positive question target/)
      .first(),
  ).toBeVisible();
  const title = `Advanced Math ${stamp}`;
  for (const [label, value] of [
    ["Test title", title],
    ["Subject", "Mathematics"],
    ["Syllabus chapter", "Addition"],
    ["Series name", `Advanced Series ${stamp}`],
  ]) {
    const field = settings.getByLabel(label!, { exact: true });
    await field.fill(value!);
    await field.press("Tab");
    await expect(page.getByText("Test updated", { exact: false }).first()).toBeVisible();
  }
  await page.getByRole("button", { name: "Bulk Paste MCQs", exact: true }).click();
  await page.getByPlaceholder(/Q1. With which words/).fill(text);
  await page
    .getByRole("button", { name: /Preview.*Next|Preview questions|Preview & Edit/ })
    .click();
  await page.getByRole("button", { name: /Next → Publish.*Use Only My Questions/ }).click();
  await expect(page.getByText(/Questions added|questions added|Published/i).first()).toBeVisible();
  await expect(settings.getByRole("button", { name: "Unpublish", exact: true })).toBeVisible();
  const id = (await settings.getAttribute("data-test-id"))!;
  await page.getByRole("button", { name: "Edit question", exact: true }).first().click();
  await page.getByRole("button", { name: "Remove option A", exact: true }).click();
  await page
    .getByPlaceholder("Why this answer is correct.")
    .fill("Advanced edited explanation survives save.");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByTestId("admin-test-question").first()).toContainText(
    "Advanced edited explanation survives save.",
  );
  await page.getByRole("button", { name: "Move down", exact: true }).first().click();
  await expect(page.getByTestId("admin-test-question").first()).toContainText("What is 10 - 4?");
  await page.getByRole("button", { name: "Move up", exact: true }).last().click();
  await expect(page.getByTestId("admin-test-question").first()).toContainText("What is 2 + 3?");
  await attempt(page, id);
  await page.goto("/admin/tests");
  await page.getByRole("button", { name: "Advanced — existing setup" }).click();
  await page.getByRole("button", { name: new RegExp(title) }).click();
  await settings.getByRole("button", { name: "Unpublish", exact: true }).click();
  await expect(settings.getByRole("button", { name: "Publish", exact: true })).toBeVisible();
  await settings.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(settings.getByRole("button", { name: "Unpublish", exact: true })).toBeVisible();
  await settings.getByRole("button", { name: "Delete test", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("button", { name: new RegExp(title) })).toHaveCount(0);
});

test("Easy mobile: incomplete MCQs and zero-price paid publication are blocked; draft survives tab switch", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await page.goto("/admin/tests");
  const panel = page.getByTestId("easy-test-builder");
  await panel.getByLabel("Subject", { exact: true }).fill("Mathematics");
  await panel.getByLabel("Chapter", { exact: true }).fill("Addition");
  await panel.getByLabel("Series name (optional)").fill("Mobile series");
  await panel
    .getByLabel("Your question text")
    .fill(text + "\n\nQ3. Missing answer?\nA) yes\nB) no");
  await panel.getByRole("button", { name: /Preview questions/ }).click();
  await expect(panel.getByRole("alert")).toContainText("1 incomplete");
  await panel.getByLabel("Your question text").fill(text);
  await panel.getByRole("radio", { name: "Paid", exact: true }).check();
  await panel.getByRole("button", { name: /Preview questions/ }).click();
  await expect(panel.getByRole("alert")).toContainText("Paid test ke liye");
  await page.getByRole("button", { name: "Advanced — existing setup" }).click();
  await page.getByRole("button", { name: "Easy Text Test", exact: true }).click();
  await expect(panel.getByLabel("Series name (optional)")).toHaveValue("Mobile series");
  await expect(panel.getByLabel("Your question text")).toHaveValue(text);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(
    true,
  );
});

test("Advanced bank recipe keeps exam/subject/chapter and admin count through student result", async ({
  page,
}) => {
  await login(page);
  await page.goto("/admin/tests");
  await page.getByRole("button", { name: "Advanced — existing setup" }).click();
  await page.getByRole("button", { name: "New test", exact: true }).click();
  const settings = page.getByTestId("advanced-test-settings");
  await expect(settings.getByLabel("Test title", { exact: true })).toHaveValue("New test");
  const bankTitle = `Bank isolation ${stamp}`;
  await settings.getByLabel("Test title", { exact: true }).fill(bankTitle);
  await settings.getByLabel("Test title", { exact: true }).press("Tab");
  await page.getByRole("combobox", { name: "Exam", exact: true }).selectOption("NEET");
  await page.getByRole("combobox", { name: "Subject", exact: true }).selectOption("Physics");
  const chapter = page.getByRole("combobox", { name: "Chapter", exact: true });
  await chapter.selectOption({ index: 1 });
  const selected = await chapter.inputValue();
  await page.getByRole("combobox", { name: "Level", exact: true }).selectOption("Mixed");
  await page.getByLabel("Bank question count").fill("3");
  await page.getByRole("button", { name: "Set Up (3 Questions)", exact: true }).click();
  await expect(
    page.getByText("3 fresh questions configured — 0 question rows saved"),
  ).toBeVisible();
  await expect(settings.getByLabel("Subject", { exact: true })).toHaveValue("Physics");
  const unpublish = settings.getByRole("button", { name: "Unpublish", exact: true });
  if (await unpublish.isVisible()) await unpublish.click();
  await settings.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(settings.getByRole("button", { name: "Unpublish", exact: true })).toBeVisible();
  const id = await settings.getAttribute("data-test-id");
  await page.goto(`/tests/learn/${id}`);
  await expect(page.getByTestId("learning-subject")).toHaveCount(1);
  await page.getByTestId("learning-subject").filter({ hasText: "Physics" }).click();
  await expect(page.getByTestId("learning-chapter")).toHaveCount(1);
  await page.getByTestId("learning-chapter").filter({ hasText: selected }).click();
  await page.getByTestId("start-test").click();
  await expect(page.getByTestId("test-question")).toBeVisible();
  await expect(page.getByTestId("test-question")).not.toContainText(/Preamble|Constitution/);
  await page.getByTestId("answer-option").first().click();
  await page.getByRole("button", { name: "Submit Test", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Result", exact: true })).toBeVisible();
  // Authoring a question on an old bank recipe must disable automatic bank fill.
  await page.goto("/admin/tests");
  await page.getByRole("button", { name: "Advanced — existing setup" }).click();
  await page.getByRole("button", { name: new RegExp(bankTitle) }).click();
  await page.getByRole("button", { name: "Add question", exact: true }).click();
  await page
    .getByLabel("Question text", { exact: true })
    .fill("Which is my own force unit question?");
  for (const [label, value] of [
    ["A", "Newton"],
    ["B", "Joule"],
    ["C", "Watt"],
    ["D", "Pascal"],
  ])
    await page.getByPlaceholder(`Option ${label}`, { exact: true }).fill(value!);
  await page.getByRole("button", { name: "Add to test", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Mode: Only My Questions", exact: true }),
  ).toBeDisabled();
  await expect(page.getByTestId("admin-test-question")).toHaveCount(1);
  await page.goto(`/tests/learn/${id}`);
  await page.getByTestId("learning-subject").filter({ hasText: "Physics" }).click();
  await page.getByTestId("learning-chapter").filter({ hasText: selected }).click();
  await page.getByTestId("start-test").click();
  await expect(page.getByTestId("test-question")).toContainText(
    "Which is my own force unit question?",
  );
});

test("1001 own MCQs preview in pages, publish intact, reload in Advanced and preserve paid settings", async ({
  page,
}) => {
  test.setTimeout(180000);
  await login(page);
  await page.goto("/admin/tests");
  const editor = page.getByTestId("easy-test-builder");
  const title = `Large own Maths ${Date.now()}`;
  await editor.getByLabel("Subject", { exact: true }).fill("Mathematics");
  await editor.getByLabel("Chapter", { exact: true }).fill("Addition");
  await editor.getByLabel("Test title (optional)").fill(title);
  await editor.getByRole("radio", { name: "Paid", exact: true }).check();
  await editor.getByLabel("Price (₹)", { exact: true }).fill("99");
  await editor
    .getByLabel("Your question text")
    .fill(
      Array.from(
        { length: 1001 },
        (_, i) =>
          `Q${i + 1}. What is ${i} plus 1?\nA) ${i + 1}\nB) ${i + 2}\nAnswer: A\nExplanation: Own explanation ${i}.`,
      ).join("\n\n"),
    );
  await editor.getByRole("button", { name: /Preview questions/ }).click();
  await expect(editor.getByText(/1001 questions ready/)).toBeVisible();
  await expect(editor.getByLabel("Q26 explanation", { exact: true })).toHaveCount(0);
  await editor.getByRole("button", { name: "Next questions", exact: true }).click();
  await editor.getByLabel("Q26 explanation", { exact: true }).fill("Edited on page two.");
  await editor.getByRole("button", { name: "Next → Review publish", exact: true }).click();
  await editor.getByRole("checkbox").check();
  await editor.getByRole("button", { name: "Publish my test", exact: true }).click();
  const settings = page.getByTestId("advanced-test-settings");
  await expect(settings.getByLabel("Test title", { exact: true })).toHaveValue(title);
  await expect(
    page.getByRole("heading", { name: "Questions in this test (1001)", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("admin-test-question")).toHaveCount(50);
  await expect(page.getByTestId("admin-test-question").nth(25)).toContainText(
    "Edited on page two.",
  );
  await page.getByRole("button", { name: "Last saved questions", exact: true }).click();
  await expect(page.getByTestId("admin-test-question")).toHaveCount(1);
  if (await page.getByRole("button", { name: "Last saved questions", exact: true }).isEnabled())
    await page.getByRole("button", { name: "Last saved questions", exact: true }).click();
  await expect(page.getByTestId("admin-test-question").last()).toContainText(
    "What is 1000 plus 1?",
  );
  await settings.getByRole("button", { name: "Unpublish", exact: true }).click();
  await settings.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(settings.getByRole("button", { name: "Unpublish", exact: true })).toBeVisible();
  await expect(settings.getByLabel("Price in rupees", { exact: true })).toHaveValue("99");
  await page.reload();
  await page.getByRole("button", { name: "Advanced — existing setup" }).click();
  await page.getByRole("button", { name: new RegExp(title) }).click();
  await expect(
    page.getByRole("heading", { name: "Questions in this test (1001)", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("admin-test-question")).toHaveCount(50);
  await page.getByRole("button", { name: "Last saved questions", exact: true }).click();
  await expect(page.getByTestId("admin-test-question")).toHaveCount(1);
  if (await page.getByRole("button", { name: "Last saved questions", exact: true }).isEnabled())
    await page.getByRole("button", { name: "Last saved questions", exact: true }).click();
  await expect(page.getByTestId("admin-test-question").last()).toContainText(
    "What is 1000 plus 1?",
  );
});
