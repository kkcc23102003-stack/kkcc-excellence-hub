/**
 * Notes rendering pipeline — one implementation used everywhere.
 *
 * The admin types plain text. This module turns it into:
 *   - clean headings / bullets / paragraphs,
 *   - auto-generated diagrams and charts (see ./analyze + ./render),
 *   - a printable document that carries the KKCC watermark on every page.
 *
 * The same HTML is used by the in-app reader, the "Print / Save as PDF" window
 * and the inline note that is opened without any PDF file, so what a student
 * reads on screen is exactly what comes out of the printer.
 */
import { analyzeNotes, type TextBlock, type VisualSpec } from "./analyze";
import { escapeHtml, visualSvg, wrapText } from "./render";
import { looksLikeFormula, renderFormulaLine, renderMath } from "./math";

export { analyzeNotes } from "./analyze";
export { escapeHtml, visualSvg } from "./render";
export { looksLikeFormula, renderFormulaLine, renderMath } from "./math";
export type { TextBlock, VisualSpec } from "./analyze";

export const KKCC_BRAND_PRIMARY = "KKCC Excellence Hub";
export const KKCC_BRAND_SECONDARY = "Kusum Kartik Coaching Centre";

/** Shown on both the screen reader and every printed page. */
export const KKCC_BRANDS = [KKCC_BRAND_PRIMARY, KKCC_BRAND_SECONDARY] as const;

/**
 * The watermark repeats on every printed page. Rows alternate between the two
 * brand names so both "KKCC Excellence Hub" and "Kusum Kartik Coaching Centre"
 * appear across the whole sheet.
 */
export function watermarkHtml(): string {
  const cells: string[] = [];
  for (let index = 0; index < 24; index += 1) {
    const brand = KKCC_BRANDS[index % KKCC_BRANDS.length]!;
    cells.push(`<span>${escapeHtml(brand)}</span>`);
  }
  return `<div class="kkcc-print-watermark" aria-hidden="true">${cells.join("")}</div>`;
}

/**
 * One line of the admin's text. A line that is a formula (or a bullet that
 * carries one, e.g. "E = mc^2") is typeset; everything else is escaped text, so
 * the author can never inject markup.
 */
function inlineText(text: string): string {
  if (looksLikeFormula(text)) return renderFormulaLine(text);
  // A formula sitting inside a sentence is typeset too, never re-written.
  return escapeHtml(text);
}

function isFormula(block: TextBlock): boolean {
  return block.type === "formula" || looksLikeFormula(block.text);
}

function textBlockHtml(block: TextBlock): string {
  switch (block.type) {
    case "heading":
      return `<h2 class="kkcc-note-h2">${escapeHtml(block.text)}</h2>`;
    case "subheading":
      return `<h3 class="kkcc-note-h3">${escapeHtml(block.text)}</h3>`;
    case "formula":
      return `<div class="kkcc-math-block" role="math">${renderFormulaLine(block.text)}</div>`;
    default:
      return `<p class="kkcc-note-p">${inlineText(block.text)}</p>`;
  }
}

function listItemHtml(block: TextBlock): string {
  return `<li class="kkcc-note-li">${inlineText(block.text)}</li>`;
}

function visualHtml(spec: VisualSpec): string {
  if (spec.kind === "image") {
    // A photo carries its own caption inside the figure.
    return `<figure class="kkcc-visual kkcc-visual-image kkcc-note-figure">${visualSvg(spec)}</figure>`;
  }
  return `<figure class="kkcc-visual kkcc-visual-${spec.kind}">${visualSvg(spec)}<figcaption>${escapeHtml(spec.title)}</figcaption></figure>`;
}

export type NotesRenderOptions = {
  /** Font size of the note body in px (the reader's A- / A+ buttons). */
  fontScale?: number;
};

/**
 * Body HTML for a note: text with the generated diagrams placed exactly where
 * the content supports them.
 */
export function renderNotesBody(text: string, options: NotesRenderOptions = {}): string {
  const fontScale = options.fontScale ?? 15;
  const { blocks, visuals } = analyzeNotes(text ?? "");
  const byBlock = new Map<number, VisualSpec[]>();
  for (const visual of visuals) {
    const list = byBlock.get(visual.afterBlock) ?? [];
    list.push(visual.spec);
    byBlock.set(visual.afterBlock, list);
  }

  const html: string[] = [];
  let listType: "ul" | "ol" | null = null;
  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };
  const pushVisuals = (index: number) => {
    const specs = byBlock.get(index);
    if (!specs?.length) return;
    // A figure never sits inside a list: close it, draw, and reopen after.
    closeList();
    for (const spec of specs) html.push(visualHtml(spec));
  };

  pushVisuals(-1);
  blocks.forEach((block, index) => {
    if (block.type === "bullet" || block.type === "numbered") {
      const wanted = block.type === "bullet" ? "ul" : "ol";
      if (listType !== wanted) {
        closeList();
        html.push(`<${wanted} class="kkcc-note-list">`);
        listType = wanted;
      }
      html.push(listItemHtml(block));
    } else {
      closeList();
      html.push(textBlockHtml(block));
    }
    pushVisuals(index);
  });
  closeList();
  // Photos/settings pinned to "after the last paragraph" land here.
  pushVisuals(Number.MAX_SAFE_INTEGER);

  const rendered = html.join("\n");
  return `<div class="kkcc-note-body" style="font-size:${fontScale}px">${rendered || `<p class="kkcc-note-p">${escapeHtml(text ?? "")}</p>`}</div>`;
}

/* --------------------------------------------------------- print document */

export function notesPrintStyles(): string {
  return `
:root{color-scheme:light}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:#f1f5f9;color:#0f172a;font-family:Segoe UI,system-ui,-apple-system,"Noto Sans",sans-serif;line-height:1.7;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.kkcc-print-shell{max-width:820px;margin:0 auto;padding:16px}
.kkcc-print-toolbar{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:10px;padding:10px 0 14px}
.kkcc-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:#4f46e5;color:#fff;font-weight:700;font-size:14px;border:0;cursor:pointer}
.kkcc-btn.ghost{background:#fff;color:#4f46e5;border:1px solid #c7d2fe}
.kkcc-note-card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:clamp(16px,4vw,30px);box-shadow:0 8px 30px rgba(15,23,42,.06)}
.kkcc-note-kicker{font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#4f46e5}
.kkcc-note-title{margin:6px 0 2px;font-size:clamp(19px,4.6vw,27px);line-height:1.28;font-weight:900}
.kkcc-note-meta{margin:0 0 14px;font-size:12px;font-weight:700;color:#64748b}
.kkcc-note-h2{margin:20px 0 8px;font-size:17px;font-weight:900;color:#1e1b4b;border-left:4px solid #4f46e5;padding-left:10px}
.kkcc-note-h3{margin:14px 0 6px;font-size:15px;font-weight:800;color:#0f172a}
.kkcc-note-p{margin:8px 0}
.kkcc-note-list{margin:8px 0 8px 20px;padding:0}
.kkcc-note-li{margin:5px 0;padding-left:2px}
.kkcc-visual{margin:16px 0;padding:10px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;break-inside:avoid;page-break-inside:avoid}
.kkcc-visual svg{width:100%;height:auto;display:block}
/* Formulas: plain text in, printed formula out. Serif stacks exist everywhere. */
.kkcc-math-block{margin:12px 0;padding:10px 14px;border:1px solid #c7d2fe;border-radius:14px;background:#eef2ff;font-family:"Cambria Math",Cambria,Georgia,"Times New Roman",serif;font-size:1.06em;line-height:1.9;text-align:center;overflow-x:auto;break-inside:avoid;page-break-inside:avoid}
.kkcc-math-frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 3px;line-height:1.15}
.kkcc-math-num{padding:0 5px 1px;border-bottom:1.4px solid currentColor}
.kkcc-math-den{padding:1px 5px 0}
.kkcc-math-sqrt{display:inline-flex;align-items:stretch;margin:0 2px}
.kkcc-math-radical{font-size:1.18em;line-height:1}
.kkcc-math-radicand{border-top:1.4px solid currentColor;padding:2px 4px 0;margin-top:3px}
.kkcc-math-sup,.kkcc-math-sub{font-size:.72em}
.kkcc-math-text{font-style:italic}
/* Photos the admin adds (handwritten pages, replaced diagrams). */
.kkcc-visual-image{background:#fff}
.kkcc-note-image{text-align:center}
.kkcc-note-image img{max-width:100%;height:auto;display:block;margin:0 auto;border-radius:12px}
.kkcc-note-image-caption{margin:6px 0 0;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#64748b}
.kkcc-visual figcaption{margin-top:6px;text-align:center;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#64748b}
.kkcc-print-watermark{display:none}
.kkcc-print-footer{display:none}
@media print{
  @page{size:A4;margin:16mm 13mm 20mm}
  body{background:#fff}
  .kkcc-print-toolbar{display:none!important}
  .kkcc-print-shell{max-width:100%;padding:0}
  .kkcc-note-card{border:0;border-radius:0;box-shadow:none;padding:0}
  /* A fixed layer is repeated by the browser on EVERY printed page. */
  .kkcc-print-watermark{display:grid;position:fixed;inset:-10mm;z-index:0;pointer-events:none;
    grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:1fr;gap:14mm;overflow:hidden;opacity:.11}
  .kkcc-print-watermark span{align-self:center;justify-self:center;transform:rotate(-28deg);white-space:nowrap;
    font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#4338ca}
  .kkcc-print-footer{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:1;justify-content:space-between;
    gap:10px;padding:4mm 13mm;font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#4338ca}
  .kkcc-print-brandbar{display:block;position:fixed;left:0;right:0;top:0;z-index:1;padding:3mm 13mm;
    font-size:9.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#4338ca;text-align:right}
  .kkcc-note-body{position:relative;z-index:2}
  .kkcc-note-h2,.kkcc-note-h3{break-after:avoid;page-break-after:avoid}
  .kkcc-note-p,.kkcc-note-li{orphans:3;widows:3}
}
`;
}

/**
 * Full printable document for a note. Used by the reader's Print button, the
 * "Print / Save as PDF" window and the inline note that has no PDF file.
 */
export function notesPrintDocument(input: {
  title: string;
  subject?: string | null | undefined;
  chapter?: string | null | undefined;
  materialType?: string | null | undefined;
  text: string;
  fontScale?: number;
}): string {
  const meta = [input.subject, input.chapter, input.materialType].filter(Boolean).join(" · ");
  const body = renderNotesBody(input.text, { fontScale: input.fontScale ?? 16 });
  const title = input.title || "KKCC Study Note";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=5.0,viewport-fit=cover"/><title>${escapeHtml(title)} — ${KKCC_BRAND_PRIMARY}</title><style>${notesPrintStyles()}</style></head><body>
${watermarkHtml()}
<div class="kkcc-print-brandbar">${escapeHtml(`${KKCC_BRAND_PRIMARY} · ${KKCC_BRAND_SECONDARY}`)}</div>
<div class="kkcc-print-shell">
  <div class="kkcc-print-toolbar">
    <button class="kkcc-btn" type="button" onclick="window.print()">Print / Save as PDF</button>
    <button class="kkcc-btn ghost" type="button" onclick="window.close()">Close</button>
  </div>
  <article class="kkcc-note-card">
    <div class="kkcc-note-kicker">${escapeHtml(KKCC_BRAND_PRIMARY)}</div>
    <h1 class="kkcc-note-title">${escapeHtml(title)}</h1>
    <p class="kkcc-note-meta">${escapeHtml(meta || KKCC_BRAND_SECONDARY)}</p>
    ${body}
  </article>
</div>
<div class="kkcc-print-footer"><span>${escapeHtml(KKCC_BRAND_PRIMARY)}</span><span>${escapeHtml(KKCC_BRAND_SECONDARY)}</span></div>
</body></html>`;
}

/** Short brand line used inside lists and cards. */
export function brandLine(): string {
  return `${KKCC_BRAND_PRIMARY} · ${KKCC_BRAND_SECONDARY}`;
}

/** Human summary such as "3 diagrams · 2 charts" for the admin preview. */
export function describeVisuals(specs: VisualSpec[]): string {
  if (!specs.length) return "No visuals detected";
  const diagrams = specs.filter((spec) => spec.kind !== "chart").length;
  const charts = specs.filter((spec) => spec.kind === "chart").length;
  const parts: string[] = [];
  if (diagrams) parts.push(`${diagrams} diagram${diagrams > 1 ? "s" : ""}`);
  if (charts) parts.push(`${charts} chart${charts > 1 ? "s" : ""}`);
  return parts.join(" · ");
}

/** Labels for the admin preview chips. */
export const VISUAL_KIND_LABELS: Record<VisualSpec["kind"], string> = {
  image: "Photo",
  flow: "Flow diagram",
  cycle: "Cycle diagram",
  tree: "Classification tree",
  compare: "Comparison",
  timeline: "Timeline",
  chart: "Chart",
};

export { wrapText };
