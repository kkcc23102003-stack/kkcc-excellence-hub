/**
 * Notes visual analyser.
 *
 * Turns plain study notes typed by the admin into structured diagram/chart
 * "specs" — no image upload, no external service required.
 *
 * Two ways a visual is produced:
 *   1. An explicit fenced block in the notes text:
 *        :::flow Water cycle
 *        Evaporation -> Condensation -> Precipitation
 *        :::
 *      (also :::cycle, :::tree, :::compare, :::timeline, :::chart, :::auto)
 *   2. Automatic analysis of each heading + its bullets/lines. The analyser
 *      recognises steps, cycles, classifications, comparisons, timelines and
 *      number-heavy lists, and only emits a visual when the content really
 *      supports it.
 *
 * Everything here is pure and dependency free so it can run in the browser, on
 * the server, and inside the printable HTML.
 */

import { looksLikeFormula } from "./math";
import { applyDirectives, parseVisualDirectives, type VisualDirectives } from "./directives";

export type FlowSpec = { kind: "flow"; title: string; steps: string[] };
export type CycleSpec = { kind: "cycle"; title: string; steps: string[] };
export type TreeSpec = {
  kind: "tree";
  title: string;
  root: string;
  branches: { label: string; children: string[] }[];
};
export type CompareSpec = {
  kind: "compare";
  title: string;
  leftTitle: string;
  rightTitle: string;
  left: string[];
  right: string[];
};
export type TimelineSpec = {
  kind: "timeline";
  title: string;
  events: { label: string; text: string }[];
};
export type ImageSpec = {
  kind: "image";
  /** Uploaded photo / handwritten page. Only real image URLs are accepted. */
  url: string;
  caption: string;
};

export type ChartSpec = {
  kind: "chart";
  title: string;
  mode: "bar" | "donut";
  series: { label: string; value: number; suffix: string }[];
};

export type VisualSpec =
  FlowSpec | CycleSpec | TreeSpec | CompareSpec | TimelineSpec | ChartSpec | ImageSpec;

export type TextBlock = {
  type: "heading" | "subheading" | "paragraph" | "bullet" | "numbered" | "formula";
  /** `formula` blocks are typeset with the math renderer. */
  text: string;
};

export type PlacedVisual = { afterBlock: number; spec: VisualSpec };

export type AnalyzedNotes = {
  blocks: TextBlock[];
  visuals: PlacedVisual[];
  /** True when the note author switched the automatic visuals off. */
  visualsDisabled: boolean;
};

const VISUALS_OFF = /^\s*\[visuals:off\]\s*$/im;
/** Never paint more than this many visuals in one note: notes stay readable. */
const MAX_AUTO_VISUALS = 6;

const BULLET = /^\s*(?:[-*•‣▪–]|\d{1,2}[.)])\s+/;
const NUMBERED = /^\s*\d{1,2}[.)]\s+/;
/** Dash/bullet marks only — a numbered line followed by these is a sub-heading. */
const DASH_BULLET = /^\s*(?:[-*•‣▪–])\s+/;
const HEADING_LIKE = /^\s*(?:#{1,4}\s+|[A-Z][A-Z0-9 ,&()/'-]{3,}:?\s*$)/;

/** Formula lines are typeset, never treated as headings or lists. */
function isFormulaLine(line: string): boolean {
  const text = line.trim();
  if (!text || text.length > 240) return false;
  if (isBullet(text)) return false;
  return looksLikeFormula(text);
}

function stripBullet(line: string): string {
  return line.replace(BULLET, "").trim();
}

function isBullet(line: string): boolean {
  return BULLET.test(line) && !HEADING_LIKE.test(line);
}

function isHeading(line: string): boolean {
  const text = line.trim();
  if (!text) return false;
  if (/^#{1,4}\s+/.test(text)) return true;
  if (isBullet(text)) return false;
  if (text.length > 90) return false;
  if (/[.:]$/.test(text) && text.split(/\s+/).length <= 12) return true;
  const letters = text.replace(/[^A-Za-z]/g, "");
  return letters.length >= 4 && letters === letters.toUpperCase();
}

function cleanHeading(line: string): string {
  return line
    .replace(/^#{1,4}\s+/, "")
    .replace(/[:.]\s*$/, "")
    .trim();
}

/* --------------------------------------------------------------- numbers */

const NUMBER_WITH_UNIT =
  /(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(crore|lakh|lac|million|billion|thousand|k|cr)?|([\d,]+(?:\.\d+)?)\s*(%|percent|crore|lakh|lac|million|billion|thousand)\b|(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)|\b([\d,]{2,}(?:\.\d+)?)\s+(?!percent)([a-z]{3,})\b/i;

/** Words that follow a number but are not a unit ("in", "and", "of"). */
const STOP_UNITS = new Set(["in", "and", "or", "of", "for", "per", "the", "to", "by", "with"]);

type Reading = { value: number; suffix: string };

function readNumber(text: string): Reading | null {
  const match = NUMBER_WITH_UNIT.exec(text);
  if (!match) return null;
  const raw = (match[1] ?? match[3] ?? match[5] ?? match[6] ?? "").replace(/,/g, "");
  const bareUnit = (match[7] ?? "").toLowerCase();
  if (match[6] && STOP_UNITS.has(bareUnit)) return null;
  const unit = (match[2] ?? match[4] ?? "").toLowerCase();
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  const suffix =
    unit === "%" || unit === "percent"
      ? "%"
      : unit.startsWith("cr")
        ? " Cr"
        : unit.startsWith("lakh") || unit.startsWith("lac")
          ? " L"
          : unit.startsWith("million")
            ? " M"
            : unit.startsWith("billion")
              ? " B"
              : unit.startsWith("thousand")
                ? "K"
                : unit === "k"
                  ? "K"
                  : /₹|rs\.?|inr/i.test(match[0])
                    ? "₹"
                    : "";
  const notCurrency = !/₹|rs\.?|inr/i.test(match[0]);
  return { value, suffix: notCurrency && suffix === "₹" ? "" : suffix };
}

function labelFrom(line: string): string {
  const label = stripBullet(line)
    .replace(NUMBER_WITH_UNIT, "")
    .replace(/[—–\-–:]\s*$/, "")
    .replace(/^\s*[—–\-–:]\s*/, "")
    .trim();
  const short = label.length > 34 ? `${label.slice(0, 32)}…` : label;
  return short || "Value";
}

function yearOf(line: string): string | null {
  const match = /\b(1[5-9]\d{2}|20\d{2}|2100)\b/.exec(line);
  return match?.[1] ?? null;
}

/* --------------------------------------------------- fenced manual blocks */

function splitArrows(line: string): string[] {
  return line
    .split(/→|->|=>|➜|⇒|\|/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function buildFence(kind: string, title: string, body: string[]): VisualSpec | null {
  const lines = body.map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return null;
  const label = title || "Diagram";

  if (kind === "flow" || kind === "steps") {
    const steps = lines.flatMap(splitArrows);
    return steps.length >= 2 ? { kind: "flow", title: label, steps } : null;
  }
  if (kind === "cycle") {
    const steps = lines.flatMap(splitArrows);
    return steps.length >= 3 ? { kind: "cycle", title: label, steps } : null;
  }
  if (kind === "timeline") {
    const events = lines
      .map((line) => {
        const [first, ...rest] = line.split(/\s*[:|]\s*/);
        const year = yearOf(first ?? "") ?? first ?? "";
        const text = rest.join(" ").trim() || stripBullet(line);
        return { label: (year ?? "").trim(), text };
      })
      .filter((event) => event.label && event.text);
    return events.length >= 2 ? { kind: "timeline", title: label, events } : null;
  }
  if (kind === "tree") {
    const [rootLine, ...rest] = lines;
    if (!rootLine) return null;
    const root = rootLine.split(/\s*[:|]\s*/)[0]?.trim() || label;
    const children = (
      rest.length
        ? rest
        : splitArrows(
            rootLine
              .split(/\s*[:|]\s*/)
              .slice(1)
              .join("|"),
          )
    )
      .map(stripBullet)
      .filter(Boolean);
    if (!children.length) return null;
    return {
      kind: "tree",
      title: label,
      root,
      branches: children.map((child) => ({ label: child, children: [] })),
    };
  }
  if (kind === "compare") {
    const [header, ...rest] = lines;
    const sides = (header ?? "").split(/\s+vs\.?\s+|\s*\|\s*|\s*\/\s*/i);
    const leftTitle = sides[0]?.trim() || "Option A";
    const rightTitle = sides[1]?.trim() || "Option B";
    const left: string[] = [];
    const right: string[] = [];
    for (const line of rest) {
      const parts = line.split(/\s*\|\s*|\s+vs\.?\s+/i);
      const a = stripBullet(parts[0] ?? "");
      const b = stripBullet(parts.slice(1).join(" "));
      if (a) left.push(a);
      if (b) right.push(b);
    }
    if (!left.length && !right.length) return null;
    return { kind: "compare", title: label, leftTitle, rightTitle, left, right };
  }
  if (kind === "chart") {
    const series: ChartSpec["series"] = [];
    for (const line of lines) {
      const reading = readNumber(line);
      if (!reading) continue;
      series.push({ label: labelFrom(line), value: reading.value, suffix: reading.suffix });
    }
    if (series.length < 2) return null;
    const allPercent = series.every((point) => point.suffix === "%");
    const total = series.reduce((sum, point) => sum + point.value, 0);
    const mode = allPercent && total >= 80 && total <= 120 ? "donut" : "bar";
    return { kind: "chart", title: label, mode, series };
  }
  return null;
}

/* --------------------------------------------------------- auto detection */

function detectChart(items: string[], title: string): ChartSpec | null {
  /* Only lines whose number is a real measurement count: "1946 Cabinet
   * Mission" is a date, "1200 students" is data. */
  const measurements: { item: string; reading: Reading }[] = [];
  for (const item of items) {
    const reading = readNumber(item);
    if (!reading) continue;
    const isDate = yearOf(item) === String(reading.value) && reading.suffix === "";
    if (isDate) continue;
    measurements.push({ item, reading });
  }
  if (measurements.length < 3) return null;
  /*
   * Charts need consecutive data lines. A subject list followed by a couple of
   * numbers should not turn the whole list into a chart, so the longest run of
   * neighbouring data lines is used instead of "most lines in the section".
   */
  const runs: { item: string; reading: Reading }[][] = [];
  let run: { item: string; reading: Reading }[] = [];
  for (const item of items) {
    const found = measurements.find((entry) => entry.item === item);
    if (found) {
      run.push(found);
      continue;
    }
    if (run.length) runs.push(run);
    run = [];
  }
  if (run.length) runs.push(run);
  const longest = runs.sort((a, b) => b.length - a.length)[0] ?? [];
  if (longest.length < 3) return null;
  const series = longest.slice(0, 8).map((entry) => ({
    label: labelFrom(entry.item),
    value: entry.reading.value,
    suffix: entry.reading.suffix,
  }));
  const allPercent = series.every((point) => point.suffix === "%");
  const total = series.reduce((sum, point) => sum + point.value, 0);
  return {
    kind: "chart",
    title: title || "Data at a glance",
    mode: allPercent && total >= 80 && total <= 120 ? "donut" : "bar",
    series,
  };
}

function detectSteps(items: string[], title: string, cycle: boolean): VisualSpec | null {
  const steps = items.flatMap((item) => (/(→|->|=>)/.test(item) ? splitArrows(item) : [item]));
  if (steps.length < 3) return null;
  const short = steps.map((step) => (step.length > 46 ? `${step.slice(0, 44)}…` : step));
  return cycle
    ? { kind: "cycle", title: title || "Cycle", steps: short.slice(0, 8) }
    : { kind: "flow", title: title || "Step by step", steps: short.slice(0, 8) };
}

function detectCompare(lines: string[], title: string): CompareSpec | null {
  const groups: { left: string[]; right: string[] } = { left: [], right: [] };
  const leftHeader = /^(advantages?|benefits?|pros|merits?|positive|features?)\b/i;
  const rightHeader = /^(disadvantages?|drawbacks?|cons|demerits?|limitations?|negative)\b/i;
  let side: "left" | "right" | null = null;
  let leftTitle = "Advantages";
  let rightTitle = "Disadvantages";
  let sawHeader = false;
  for (const line of lines) {
    const text = stripBullet(line);
    if (!text) continue;
    if (leftHeader.test(text) && text.split(/\s+/).length <= 3) {
      side = "left";
      leftTitle = text.replace(/[:.]$/, "");
      sawHeader = true;
      continue;
    }
    if (rightHeader.test(text) && text.split(/\s+/).length <= 3) {
      side = "right";
      rightTitle = text.replace(/[:.]$/, "");
      sawHeader = true;
      continue;
    }
    if (side === "left") groups.left.push(text);
    else if (side === "right") groups.right.push(text);
  }
  const left = groups.left.filter(Boolean);
  const right = groups.right.filter(Boolean);
  if (sawHeader && left.length && right.length)
    return {
      kind: "compare",
      title: title || "Comparison",
      leftTitle,
      rightTitle,
      left: left.slice(0, 6),
      right: right.slice(0, 6),
    };

  // "A vs B" inside the heading or the first line.
  const vs = /\b(.{2,30}?)\s+(?:vs\.?|versus|compared to)\s+(.{2,30})/i.exec(title);
  if (vs?.[1] && vs[2]) {
    const points = lines.map(stripBullet).filter(Boolean);
    if (points.length >= 4) {
      const half = Math.ceil(points.length / 2);
      return {
        kind: "compare",
        title: title || "Comparison",
        leftTitle: cleanHeading(vs[1]),
        rightTitle: cleanHeading(vs[2]),
        left: points.slice(0, half),
        right: points.slice(half),
      };
    }
  }
  return null;
}

function detectTimeline(lines: string[], title: string): TimelineSpec | null {
  const events: TimelineSpec["events"] = [];
  for (const line of lines) {
    const year = yearOf(line);
    if (!year) continue;
    const text = stripBullet(line)
      .replace(new RegExp(`^\\D{0,12}${year}\\D{0,6}`), "")
      .trim();
    events.push({ label: year, text: text || stripBullet(line) });
  }
  if (events.length < 2) return null;
  events.sort((a, b) => Number(a.label) - Number(b.label));
  return { kind: "timeline", title: title || "Timeline", events: events.slice(0, 8) };
}

function detectCauseEffect(paragraph: string, title: string): FlowSpec | null {
  const sentences = paragraph
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 12);
  if (sentences.length < 2) return null;
  const link =
    /\b(because|therefore|hence|thus|so that|leads? to|results? in|due to|causes?|as a result|consequently)\b/i;
  const linked = sentences.filter((sentence) => link.test(sentence));
  if (linked.length === 0) return null;
  const steps = sentences
    .slice(0, 3)
    .map((sentence) =>
      sentence.length > 60 ? `${sentence.slice(0, 58)}…` : sentence.replace(/[.]$/, ""),
    );
  return { kind: "flow", title: title || "Cause and effect", steps };
}

/* -------------------------------------------------------------- analysis */

type Section = { heading: string | null; lines: string[] };

/**
 * "Types of Taxes" typed on its own line directly above a list is a title, not
 * a paragraph — that is how everyone writes notes. Recognising it is what lets
 * the analyser turn the list into a classification tree or a flow.
 */
/** Labels that must stay inside their section so a comparison can be built. */
const LABEL_ONLY = new Set([
  "advantages",
  "benefits",
  "pros",
  "merits",
  "disadvantages",
  "drawbacks",
  "cons",
  "demerits",
  "limitations",
]);

function isTitleLine(line: string, nextContentLine: string | undefined): boolean {
  const text = line.trim();
  if (!text) return false;
  /*
   * "1. Rate of GST slabs" directly above "- 5 percent" bullets is a
   * sub-heading of the note, not a list item: the nested list belongs to it.
   */
  if (NUMBERED.test(text) && nextContentLine && DASH_BULLET.test(nextContentLine)) return true;
  if (isBullet(text)) return false;
  if (LABEL_ONLY.has(text.toLowerCase().replace(/[:.]$/, ""))) return false;
  if (isHeading(text)) return true;
  if (text.length > 70) return false;
  if (/[.;,]$/.test(text)) return false;
  if (!nextContentLine) return false;
  if (isBullet(nextContentLine)) return true;
  // "Important milestones" above raw year / data lines is a title, but a line
  // that already carries a number is data itself, not a title.
  const lineHasData = Boolean(yearOf(text) || readNumber(text));
  const nextHasData = Boolean(yearOf(nextContentLine) || readNumber(nextContentLine));
  return !lineHasData && nextHasData;
}

function toSections(lines: string[]): Section[] {
  const sections: Section[] = [];
  // nextContentAfter[i] = the next non-empty line after i (skipping blanks).
  const nextContentAfter: (string | undefined)[] = new Array(lines.length).fill(undefined);
  let nextSeen: string | undefined;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    nextContentAfter[index] = nextSeen;
    const text = (lines[index] ?? "").trim();
    if (text) nextSeen = text;
  }

  let current: Section = { heading: null, lines: [] };
  let insideFence = false;
  for (const [index, line] of lines.entries()) {
    // Explicit diagram bodies are atomic: short labels and numbered nodes
    // must not be mistaken for new section headings inside the fence.
    if (/^\s*:::\s*[a-zA-Z]+/.test(line)) {
      insideFence = true;
      current.lines.push(line);
      continue;
    }
    if (/^\s*:::\s*$/.test(line)) {
      insideFence = false;
      current.lines.push(line);
      continue;
    }
    if (insideFence) {
      current.lines.push(line);
      continue;
    }
    if (isTitleLine(line, nextContentAfter[index])) {
      if (current.heading || current.lines.some((entry) => entry.trim())) sections.push(current);
      current = { heading: cleanHeading(line), lines: [] };
      continue;
    }
    current.lines.push(line);
  }
  if (current.heading || current.lines.some((entry) => entry.trim())) sections.push(current);
  return sections;
}

export function analyzeNotes(input: string): AnalyzedNotes {
  const raw = input ?? "";
  const { directives, text: withoutDirectives } = parseVisualDirectives(raw);
  const visualsDisabled =
    VISUALS_OFF.test(raw) || directives.mode === "none" || directives.hide.includes(0);
  const text = withoutDirectives.replace(VISUALS_OFF, "").replace(/\r\n?/g, "\n");

  const blocks: TextBlock[] = [];
  const visuals: PlacedVisual[] = [];
  const sections = toSections(text.split("\n"));

  for (const section of sections) {
    if (section.heading) {
      blocks.push({ type: "heading", text: section.heading });
    }
    const headingIndex = blocks.length - 1;
    const sectionStart = blocks.length;
    const lines = section.lines.filter((line) => line.trim() || blocks.length > 0);

    const bullets: string[] = [];
    const paragraphs: string[] = [];
    let fenceKind: string | null = null;
    let fenceTitle = "";
    let fenceBody: string[] = [];
    let fenceIndex = -1;

    const flushFence = () => {
      if (!fenceKind) return;
      const spec =
        fenceKind === "auto" || fenceKind === "diagram"
          ? autoSpecFor(fenceTitle, fenceBody)
          : buildFence(fenceKind, fenceTitle, fenceBody);
      if (spec) visuals.push({ afterBlock: fenceIndex, spec });
      fenceKind = null;
      fenceTitle = "";
      fenceBody = [];
    };

    for (const line of lines) {
      const fenceStart = /^\s*:::\s*([a-zA-Z]+)\s*(.*)$/.exec(line);
      if (fenceStart) {
        flushFence();
        fenceKind = (fenceStart[1] ?? "").toLowerCase();
        fenceTitle = (fenceStart[2] ?? "").trim();
        fenceIndex = blocks.length - 1;
        continue;
      }
      if (/^\s*:::\s*$/.test(line)) {
        flushFence();
        continue;
      }
      if (fenceKind) {
        fenceBody.push(line);
        continue;
      }
      if (!line.trim()) continue;

      if (isFormulaLine(line)) {
        blocks.push({ type: "formula", text: line.trim() });
        paragraphs.push(line.trim());
        continue;
      }
      if (isBullet(line)) {
        const text = stripBullet(line);
        bullets.push(text);
        blocks.push({
          type: NUMBERED.test(line) ? "numbered" : "bullet",
          text,
        });
        continue;
      }
      if (isHeading(line)) {
        blocks.push({ type: "subheading", text: cleanHeading(line) });
        continue;
      }
      paragraphs.push(line.trim());
      blocks.push({ type: "paragraph", text: line.trim() });
    }
    flushFence();

    if (visualsDisabled) continue;
    if (visuals.length >= MAX_AUTO_VISUALS) continue;
    if (bullets.length < 3 && paragraphs.length === 0) continue;

    // A short opening line ("Online Payment") titles the generated visual even
    // when the note has no explicit heading above it.
    const firstParagraph = paragraphs[0] ?? "";
    const derivedTitle =
      !section.heading &&
      firstParagraph &&
      firstParagraph.length <= 60 &&
      firstParagraph.split(/\s+/).length <= 9
        ? firstParagraph
        : "";
    const heading = section.heading ?? derivedTitle;
    const body = section.lines.map(stripBullet).filter(Boolean);
    const cycleHint = /\b(cycle|circular|rotation|wheel|loop|recurring)\b/i.test(heading);
    const stepHint =
      /\b(steps?|process|procedure|method|stages?|sequence|how to|flow|working|mechanism|order of)\b/i.test(
        heading,
      );
    const treeHint =
      /\b(types?|kinds?|classification|categor(?:y|ies)|divisions?|branches|forms of|parts of|components?|structure of)\b/i.test(
        heading,
      );
    const compareHint =
      /\b(difference|differences|vs\.?|versus|compare|comparison|advantages|disadvantages|pros|cons|merits|demerits)\b/i.test(
        heading,
      );

    const specs: VisualSpec[] = [];
    if (bullets.length >= 3) {
      // A chart from the data lines and a comparison from the labels are both
      // useful in one section, so both may be emitted.
      const chart = detectChart(bullets, heading);
      if (chart) specs.push(chart);
      const compare = detectCompare(section.lines, heading);
      if (compare) specs.push(compare);
      if (!specs.length) {
        const diagram =
          (cycleHint ? detectSteps(bullets, heading, true) : null) ??
          (stepHint ? detectSteps(bullets, heading, false) : null) ??
          (treeHint
            ? {
                kind: "tree" as const,
                title: heading || "Classification",
                root: cleanHeading(heading).replace(
                  /\b(types?|kinds?|classification|categories|divisions?|forms)\b( of)?/i,
                  "Types of",
                ),
                branches: bullets.slice(0, 6).map((item) => ({ label: item, children: [] })),
              }
            : null) ??
          detectTimeline(section.lines, heading) ??
          (/\b(step|stage|phase|first|second|third|then|next|finally)\b/i.test(bullets.join(" "))
            ? detectSteps(bullets, heading, false)
            : null);
        if (diagram) specs.push(diagram);
      }
    }
    // Year-bearing text lines make a timeline even without bullets.
    if (!specs.some((entry) => entry.kind === "timeline")) {
      const timeline = detectTimeline(section.lines, heading);
      if (timeline) specs.push(timeline);
    }
    if (!specs.length && paragraphs.length) {
      const cause = detectCauseEffect(paragraphs.join(" "), heading);
      if (cause) specs.push(cause);
    }

    for (const spec of specs) {
      if (visuals.length >= MAX_AUTO_VISUALS) break;
      // Steps and cycles read best right after the heading, charts after the list.
      const after =
        spec.kind === "chart" || spec.kind === "compare" || spec.kind === "timeline"
          ? blocks.length - 1
          : Math.max(headingIndex, sectionStart - 1);
      visuals.push({ afterBlock: after, spec });
    }
  }

  return applyAnalyzed(blocks, visuals, visualsDisabled, directives);
}

/** Apply the note's own hide / rename / replace / photo settings. */
function applyAnalyzed(
  blocks: TextBlock[],
  visuals: PlacedVisual[],
  visualsDisabled: boolean,
  directives: VisualDirectives,
): AnalyzedNotes {
  if (visualsDisabled && !directives.images.length)
    return { blocks, visuals: [], visualsDisabled: true };
  const applied = applyDirectives(visualsDisabled ? [] : visuals, directives);
  return { blocks, visuals: applied, visualsDisabled };
}

/** Detection used by `:::auto` / `:::diagram` fences: analyse the content only. */
function autoSpecFor(title: string, body: string[]): VisualSpec | null {
  const lines = body.filter((line) => line.trim());
  if (!lines.length) return null;
  const bullets = lines.map(stripBullet).filter(Boolean);
  return (
    detectChart(bullets, title) ??
    detectCompare(lines, title) ??
    detectTimeline(lines, title) ??
    detectSteps(bullets, title, /\b(cycle|circular|loop|wheel)\b/i.test(title)) ??
    detectCauseEffect(bullets.join(". "), title)
  );
}
