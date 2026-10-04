import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { analyzeNotes } from "../../src/lib/notes-visuals/analyze";
import {
  analyzeNotes as reExportedAnalyze,
  notesPrintDocument,
  renderNotesBody,
  watermarkHtml,
} from "../../src/lib/notes-visuals";
import { escapeHtml, wrapText } from "../../src/lib/notes-visuals/render";
import { looksLikeFormula, renderFormulaLine } from "../../src/lib/notes-visuals/math";
import {
  EMPTY_DIRECTIVES,
  parseVisualDirectives,
  updateNoteWithDirectives,
} from "../../src/lib/notes-visuals/directives";

const TYPES_OF_NOTES = `Types of Taxes

- Direct Tax
- Indirect Tax
- Wealth Tax
- Customs Duty

1. Rate of GST slabs
- 5 percent
- 12 percent
- 18 percent
- 28 percent
`;

test("A 'Types of' list becomes a classification tree", () => {
  const { visuals } = analyzeNotes(TYPES_OF_NOTES);
  const tree = visuals.find((entry) => entry.spec.kind === "tree");
  assert.ok(tree, "expected a tree diagram for a Types of list");
  assert.equal(tree.spec.kind === "tree" && tree.spec.root, "Types of Taxes");
});

test("Percentage points become a donut, plain numbers become bars", () => {
  const donut = analyzeNotes(
    `GST revenue share\n\n- Central GST 40 percent\n- State GST 45 percent\n- Cess 15 percent\n`,
  );
  const chart = donut.visuals.find((entry) => entry.spec.kind === "chart");
  assert.ok(chart && chart.spec.kind === "chart");
  assert.equal(chart.spec.mode, "donut");

  const bars = analyzeNotes(
    `Enrollment by year\n\n- 2019 1200 students\n- 2020 1800 students\n- 2021 2400 students\n`,
  );
  const bar = bars.visuals.find((entry) => entry.spec.kind === "chart");
  assert.ok(bar && bar.spec.kind === "chart");
  assert.equal(bar.spec.mode, "bar");
  assert.equal(bar.spec.series.length, 3);
});

test("Advantages / Disadvantages become a comparison", () => {
  const { visuals } = analyzeNotes(
    `Online Payment\n\nAdvantages\n- Instant access\n- No cash handling\n\nDisadvantages\n- Needs internet\n- Refund takes time\n`,
  );
  const compare = visuals.find((entry) => entry.spec.kind === "compare");
  assert.ok(compare && compare.spec.kind === "compare");
  assert.equal(compare.spec.left.length, 2);
  assert.equal(compare.spec.right.length, 2);
});

test("Years become a timeline, in chronological order", () => {
  const { visuals } = analyzeNotes(
    `Formation of the Constitution\n\n1946 Cabinet Mission arrives\n1950 Constitution comes into force\n1935 Government of India Act\n`,
  );
  const timeline = visuals.find((entry) => entry.spec.kind === "timeline");
  assert.ok(timeline && timeline.spec.kind === "timeline");
  const labels = timeline.spec.events.map((event) => event.label);
  assert.deepEqual(labels, ["1935", "1946", "1950"]);
});

test("A process heading becomes a readable flow of steps", () => {
  const { visuals } = analyzeNotes(
    `Water treatment process\n\n- Screening of large particles\n- Sedimentation of fine particles\n- Filtration through sand beds\n- Chlorination for disinfection\n`,
  );
  const flow = visuals.find((entry) => entry.spec.kind === "flow");
  assert.ok(flow && flow.spec.kind === "flow");
  assert.equal(flow.spec.steps.length, 4);
});

test("The admin can write an explicit diagram block", () => {
  const { visuals } = analyzeNotes(
    `Money cycle\n\n:::cycle Money flow\nHousehold -> Firm -> Bank\n:::\n`,
  );
  const cycle = visuals.find((entry) => entry.spec.kind === "cycle");
  assert.ok(cycle && cycle.spec.kind === "cycle");
  assert.deepEqual(cycle.spec.kind === "cycle" ? cycle.spec.steps : [], [
    "Household",
    "Firm",
    "Bank",
  ]);
});

test("Visuals can be switched off, and a note with no structure stays a plain note", () => {
  const off = analyzeNotes(`[visuals:off]\nTypes of Taxes\n\n- A\n- B\n- C\n`);
  assert.equal(off.visuals.length, 0);
  assert.equal(off.visualsDisabled, true);

  const plain = analyzeNotes("Simple paragraph only. Nothing to draw here.");
  assert.equal(plain.visuals.length, 0);
});

test("Rendered notes escape the author's text and include the diagrams", () => {
  const html = renderNotesBody(
    `Types of Taxes\n\n- Direct Tax\n- Indirect Tax\n- Wealth Tax <script>alert(1)</script>\n`,
  );
  assert.match(html, /<svg/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /class="kkcc-note-body"/);
});

test("Every printed page carries both KKCC brand names", () => {
  const doc = notesPrintDocument({
    title: "GST Notes",
    subject: "Economics",
    text: "Types of Taxes\n\n- Direct\n- Indirect\n- Wealth\n",
  });
  assert.match(doc, /KKCC Excellence Hub/);
  assert.match(doc, /Kusum Kartik Coaching Centre/);
  // The watermark is a fixed layer, which is how it repeats on every page.
  assert.match(doc, /\.kkcc-print-watermark\{display:grid;position:fixed/);
  assert.match(doc, /@page\{size:A4/);
  const marks = watermarkHtml().match(/kkcc-print-watermark/g) ?? [];
  assert.equal(marks.length, 1);
});

test("Helpers keep the drawing safe and readable", () => {
  assert.equal(
    escapeHtml(`<b>"x" & 'y'</b>`),
    "&lt;b&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/b&gt;",
  );
  const lines = wrapText("a very long label that must wrap over several lines nicely", 20, 3);
  assert.ok(lines.length >= 2 && lines.length <= 3);
  assert.ok(lines.every((line) => line.length <= 21));
  assert.equal(reExportedAnalyze("plain text").blocks.length, 1);
});

test("Notes can be sold: paid notes travel through the same checkout as batches", () => {
  const checkout = readFileSync("src/routes/checkout.tsx", "utf8");
  const purchase = readFileSync("src/lib/learning-purchase.server.ts", "utf8");
  const button = readFileSync("src/components/kkcc/material-access-button.tsx", "utf8");
  const admin = readFileSync("src/routes/_authenticated/admin.materials.tsx", "utf8");

  // Free / Paid is an admin switch, and the student side honours it.
  assert.match(purchase, /const isPaid = material\.access_type === "paid";/);
  assert.match(purchase, /baseInr: isPaid \? Math\.max\(0, material\.price \?\? 0\) : 0/);
  // Paid notes open the shared checkout: Razorpay, 23KAAT or contact Admin.
  assert.match(button, /to="\/checkout"/);
  assert.match(button, /note: materialId/);
  // The admin can flip a note to Free / Paid in one tap from the list.
  assert.match(admin, /ab Free hai/);
  assert.match(admin, /ab Paid hai/);
  // Coupons and the ledger understand notes too.
  assert.match(readFileSync("src/lib/coupons.functions.ts", "utf8"), /material_id/);
  assert.match(readFileSync("src/lib/payment-ledger.server.ts", "utf8"), /"material"/);
});

test("The printable note keeps both brand names on every page", () => {
  const button = readFileSync("src/components/kkcc/material-access-button.tsx", "utf8");
  const server = readFileSync("src/lib/material-access.server.ts", "utf8");
  // Both the in-app print button and the server-side inline note use the one
  // shared document builder, so the watermark can never be forgotten.
  assert.match(button, /notesPrintDocument\(/);
  assert.match(server, /notesPrintDocument\(/);
  const document = readFileSync("src/lib/notes-visuals/index.ts", "utf8");
  assert.match(document, /KKCC_BRAND_PRIMARY = "KKCC Excellence Hub"/);
  assert.match(document, /KKCC_BRAND_SECONDARY = "Kusum Kartik Coaching Centre"/);
});

/* --------------------------------------------------------------- formulas */

test("a plain-text formula line becomes a real fraction with a root", () => {
  const html = renderNotesBody("Quadratic Formula\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n");
  assert.match(html, /class="kkcc-math-block"/);
  assert.match(html, /class="kkcc-math-frac"/);
  assert.match(html, /class="kkcc-math-num"/);
  assert.match(html, /class="kkcc-math-den"/);
  assert.match(html, /class="kkcc-math-radicand"/);
  assert.ok(html.includes("√"), "the square-root sign should be drawn");
  assert.ok(!html.includes("\\frac"), "raw LaTeX must never reach the student");
  assert.ok(!html.includes("\\sqrt"));
});

test("powers, greek letters and multiplication signs stay readable", () => {
  const html = renderNotesBody("Area of circle = \\pi r^2\nE = mc^2\n");
  assert.ok(html.includes("π r²"));
  assert.ok(html.includes("mc²"));
});

test("chemical equations get subscripts and a real arrow", () => {
  assert.equal(looksLikeFormula("2H_2 + O_2 -> 2H_2O"), true);
  assert.equal(looksLikeFormula("H2SO4 is sulphuric acid"), true);
  const html = renderFormulaLine("2H_2 + O_2 -> 2H_2O");
  assert.match(html, /class="kkcc-math-sub"/);
  assert.ok(html.includes("→"));
});

test("a normal history sentence is never treated as math", () => {
  assert.equal(looksLikeFormula("Punjab was divided in 1947 after partition."), false);
  const html = renderNotesBody("Punjab was divided in 1947 after partition.\n");
  assert.ok(html.includes("Punjab was divided in 1947"));
  assert.ok(!html.includes("kkcc-math-block"));
});

test("HTML inside a formula is escaped, not executed", () => {
  const html = renderFormulaLine("<img src=x onerror=alert(1)> = \\frac{1}{2}");
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;img"));
});

test("nested groups never print stray braces or backslashes", () => {
  const html = renderFormulaLine("\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1");
  assert.ok(!html.includes("\\"));
  assert.ok(!html.includes("}}"));
});

/* ------------------------------------------------- per-note diagram control */

const DIRECTIVE_NOTE =
  "Photosynthesis\n\nTypes\n- Light reaction\n- Dark reaction\n- Calvin cycle\n";

test("one diagram can be hidden while the text stays intact", () => {
  const stored = updateNoteWithDirectives(DIRECTIVE_NOTE, { ...EMPTY_DIRECTIVES, hide: [1] });
  assert.equal(analyzeNotes(stored).visuals.length, 0);
  assert.ok(stored.includes("Light reaction"));
  assert.ok(analyzeNotes(DIRECTIVE_NOTE).visuals.length > 0, "engine still finds one by default");
});

test("no-diagram switch gives a clean text-only note for language subjects", () => {
  const stored = updateNoteWithDirectives(DIRECTIVE_NOTE, { ...EMPTY_DIRECTIVES, mode: "none" });
  const result = analyzeNotes(stored);
  assert.equal(result.visuals.length, 0);
  assert.equal(result.visualsDisabled, true);
  assert.ok(!renderNotesBody(stored).includes("kkcc-visual"));
});

test("a diagram title can be renamed from the panel", () => {
  const stored = updateNoteWithDirectives(DIRECTIVE_NOTE, {
    ...EMPTY_DIRECTIVES,
    rename: { 1: "Meri apni heading" },
  });
  assert.match(renderNotesBody(stored), /Meri apni heading/);
});

test("a wrong diagram is replaced by the admin's uploaded photo", () => {
  const stored = updateNoteWithDirectives(DIRECTIVE_NOTE, {
    ...EMPTY_DIRECTIVES,
    replace: { 1: { url: "data:image/png;base64,AAAA", caption: "Human lungs — photo" } },
  });
  const html = renderNotesBody(stored);
  assert.match(html, /kkcc-visual-image/);
  assert.ok(html.includes('src="data:image/png;base64,AAAA"'));
  assert.ok(html.includes("Human lungs — photo"));
  assert.ok(!html.includes("<svg"), "the generated drawing is gone once replaced");
});

test("a handwritten page is added as its own figure", () => {
  const stored = updateNoteWithDirectives(DIRECTIVE_NOTE, {
    ...EMPTY_DIRECTIVES,
    images: [{ url: "https://cdn.example.com/hand-1.jpg", caption: "Handwritten page" }],
  });
  const html = renderNotesBody(stored);
  assert.ok(html.includes("https://cdn.example.com/hand-1.jpg"));
  assert.ok(html.includes("Handwritten page"));
});

test("javascript: URLs are refused and the diagram is kept", () => {
  const stored = updateNoteWithDirectives(DIRECTIVE_NOTE, {
    ...EMPTY_DIRECTIVES,
    replace: { 1: { url: "javascript:alert(1)", caption: "x" } },
  });
  const html = renderNotesBody(stored);
  assert.ok(!html.includes("javascript:"));
  assert.match(html, /kkcc-visual/);
});

test("settings round-trip through the note text and never print", () => {
  const stored = updateNoteWithDirectives(DIRECTIVE_NOTE, {
    ...EMPTY_DIRECTIVES,
    mode: "none",
    hide: [2],
    rename: { 1: "Steps" },
  });
  const parsed = parseVisualDirectives(stored).directives;
  assert.equal(parsed.mode, "none");
  assert.deepEqual(parsed.hide, [2]);
  assert.equal(parsed.rename[1], "Steps");
  assert.ok(!renderNotesBody(stored).includes(":::visuals"));
});

test("write/text mode round trips without losing existing images", () => {
  const original = {
    ...EMPTY_DIRECTIVES,
    kind: "write" as const,
    images: [{ url: "https://example.com/page.jpg", caption: "Page" }],
  };
  const stored = updateNoteWithDirectives("Chapter", original);
  assert.equal(parseVisualDirectives(stored).directives.kind, "write");
  const switched = updateNoteWithDirectives(stored, { ...original, kind: "text" });
  assert.equal(parseVisualDirectives(switched).directives.kind, "text");
  assert.equal(parseVisualDirectives(switched).directives.images.length, 1);
  assert.equal(parseVisualDirectives("Old note").directives.kind, "text");
});

test("all bundled teaching diagram templates produce a visual", async () => {
  const { NOTE_DIAGRAM_TEMPLATES } = await import("../../src/lib/notes-visuals/templates");
  for (const template of NOTE_DIAGRAM_TEMPLATES) {
    assert.ok(analyzeNotes(template.body).visuals.length > 0, template.title);
  }
});

test("explicit diagram fences keep short headings and numbered branches together", () => {
  const note =
    "# My chapter\n:::tree Classification\nAccounts\n1. Personal\n2. Real\n3. Nominal\n:::\n# Next section\nText only.";
  const analyzed = analyzeNotes(note);
  assert.equal(analyzed.visuals[0]?.spec.kind, "tree");
  const spec = analyzed.visuals[0]!.spec;
  if (spec.kind === "tree") assert.equal(spec.branches.length, 3);
  assert.ok(renderNotesBody(note).includes("Nominal"));
});
