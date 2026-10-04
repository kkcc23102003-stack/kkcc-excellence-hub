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
