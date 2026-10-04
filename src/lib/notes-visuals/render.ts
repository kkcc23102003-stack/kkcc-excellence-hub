/**
 * SVG drawing for the notes visuals.
 *
 * Every diagram is a self-contained `<svg>` string: crisp on phones, zoomable,
 * and identical in the browser and in the printed PDF. Colours are fixed (not
 * theme variables) so a printed page never comes out with invisible text, and
 * all labels are escaped — the admin's text can never inject markup.
 */
import type {
  ChartSpec,
  CompareSpec,
  CycleSpec,
  FlowSpec,
  ImageSpec,
  TimelineSpec,
  TreeSpec,
  VisualSpec,
} from "./analyze";

const PALETTE = [
  { fill: "#eef2ff", stroke: "#4f46e5", text: "#1e1b4b" },
  { fill: "#ecfeff", stroke: "#0891b2", text: "#083344" },
  { fill: "#f0fdf4", stroke: "#16a34a", text: "#052e16" },
  { fill: "#fff7ed", stroke: "#ea580c", text: "#431407" },
  { fill: "#fdf2f8", stroke: "#db2777", text: "#500724" },
  { fill: "#fefce8", stroke: "#ca8a04", text: "#422006" },
];

const BAR_COLORS = ["#4f46e5", "#0891b2", "#16a34a", "#ea580c", "#db2777", "#7c3aed", "#0d9488"];

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Greedy word wrap so long labels never overflow a diagram. */
export function wrapText(value: string, maxChars: number, maxLines = 3): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (!line.length) {
      line = word;
    } else if (`${line} ${word}`.length <= maxChars) {
      line += ` ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
    if (lines.length === maxLines) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (!lines.length) return [value.slice(0, maxChars)];
  const last = lines[maxLines - 1];
  if (lines.length === maxLines && last && value.length > lines.join(" ").length)
    lines[maxLines - 1] = `${last}…`;
  return lines;
}

function textLines(
  lines: string[],
  x: number,
  y: number,
  options: { size?: number; weight?: number; color?: string; anchor?: string } = {},
): string {
  const { size = 13, weight = 600, color = "#0f172a", anchor = "middle" } = options;
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * (size + 4)}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" font-family="Segoe UI,system-ui,-apple-system,sans-serif" fill="${color}">${escapeHtml(line)}</text>`,
    )
    .join("");
}

function frame(title: string, height: number, inner: string, width = 720): string {
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${escapeHtml(title)}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;background:#ffffff"><rect width="${width}" height="${height}" rx="18" fill="#ffffff"/><rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="17.5" fill="none" stroke="#e2e8f0"/>${inner}</svg>`;
}

function caption(title: string, width = 720): string {
  return `<text x="24" y="30" font-size="15" font-weight="800" font-family="Segoe UI,system-ui,sans-serif" fill="#0f172a">${escapeHtml(title)}</text>`;
}

function arrowMarker(id: string, color: string): string {
  return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker></defs>`;
}

/* ------------------------------------------------------------------ flow */

export function flowSvg(spec: FlowSpec): string {
  const steps = spec.steps.slice(0, 8);
  const perRow = steps.length > 4 ? 2 : 1;
  const rows = Math.ceil(steps.length / perRow);
  const boxW = perRow === 1 ? 600 : 320;
  const boxH = 58;
  const gapY = 34;
  const height = 58 + rows * (boxH + gapY) + 8;
  const parts: string[] = [caption(spec.title)];
  steps.forEach((step, index) => {
    const row = Math.floor(index / perRow);
    const col = index % perRow;
    const x = perRow === 1 ? 60 : 40 + col * (boxW + 40);
    const y = 56 + row * (boxH + gapY);
    const color = PALETTE[index % PALETTE.length]!;
    parts.push(
      `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="14" fill="${color.fill}" stroke="${color.stroke}" stroke-width="1.6"/>`,
      `<circle cx="${x + 24}" cy="${y + boxH / 2}" r="12" fill="${color.stroke}"/>`,
      `<text x="${x + 24}" y="${y + boxH / 2 + 4.5}" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff" font-family="Segoe UI,system-ui,sans-serif">${index + 1}</text>`,
      textLines(wrapText(step, perRow === 1 ? 62 : 34, 2), x + (boxW + 30) / 2, y + 25, {
        color: color.text,
        size: 13,
        weight: 700,
      }),
    );
    const isLast = index === steps.length - 1;
    if (!isLast) {
      const goesDown = col === perRow - 1 || perRow === 1;
      const marker = `kkcc-arrow-${index}`;
      if (goesDown) {
        parts.push(
          arrowMarker(marker, "#64748b"),
          `<path d="M ${x + boxW / 2} ${y + boxH + 4} L ${x + boxW / 2} ${y + boxH + gapY - 8}" stroke="#64748b" stroke-width="2" marker-end="url(#${marker})" fill="none"/>`,
        );
      } else {
        parts.push(
          arrowMarker(marker, "#64748b"),
          `<path d="M ${x + boxW + 6} ${y + boxH / 2} L ${x + boxW + 34} ${y + boxH / 2}" stroke="#64748b" stroke-width="2" marker-end="url(#${marker})" fill="none"/>`,
        );
      }
    }
  });
  return frame(spec.title, height, parts.join(""));
}

/* ----------------------------------------------------------------- cycle */

export function cycleSvg(spec: CycleSpec): string {
  const steps = spec.steps.slice(0, 8);
  const size = 460;
  const cx = 230;
  const cy = 250;
  const radius = 150;
  const height = 470;
  const parts: string[] = [caption(spec.title)];
  steps.forEach((step, index) => {
    const angle = (index / steps.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const color = PALETTE[index % PALETTE.length]!;
    parts.push(
      `<circle cx="${x}" cy="${y}" r="46" fill="${color.fill}" stroke="${color.stroke}" stroke-width="1.8"/>`,
      textLines(wrapText(step, 15, 3), x, y - (Math.min(3, wrapText(step, 15, 3).length) - 1) * 8, {
        size: 10.5,
        weight: 700,
        color: color.text,
      }),
    );
    const nextAngle = ((index + 1) / steps.length) * Math.PI * 2 - Math.PI / 2;
    const arcFrom = angle + 0.28;
    const arcTo = nextAngle - 0.28;
    const ax = cx + Math.cos(arcFrom) * (radius + 52);
    const ay = cy + Math.sin(arcFrom) * (radius + 52);
    const bx = cx + Math.cos(arcTo) * (radius + 52);
    const by = cy + Math.sin(arcTo) * (radius + 52);
    parts.push(
      arrowMarker(`kkcc-cycle-${index}`, "#94a3b8"),
      `<path d="M ${ax} ${ay} A ${radius + 52} ${radius + 52} 0 0 1 ${bx} ${by}" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#kkcc-cycle-${index})"/>`,
    );
  });
  parts.push(
    `<circle cx="${cx}" cy="${cy}" r="34" fill="#f8fafc" stroke="#e2e8f0"/>`,
    `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="12" font-weight="800" fill="#475569" font-family="Segoe UI,system-ui,sans-serif">CYCLE</text>`,
  );
  return frame(spec.title, height, parts.join(""), 520);
}

/* ------------------------------------------------------------------ tree */

export function treeSvg(spec: TreeSpec): string {
  const branches = spec.branches.slice(0, 6);
  const colW = 700 / Math.max(1, branches.length);
  const height = 220;
  const parts: string[] = [caption(spec.title)];
  parts.push(
    `<rect x="250" y="50" width="220" height="52" rx="14" fill="#4f46e5"/>`,
    textLines(wrapText(spec.root, 26, 2), 360, 74, { color: "#ffffff", size: 13, weight: 800 }),
    `<path d="M 360 102 L 360 130" stroke="#94a3b8" stroke-width="2"/>`,
  );
  if (branches.length) {
    parts.push(
      `<path d="M ${colW / 2 + 20} 130 L ${700 - colW / 2 - 20} 130" stroke="#94a3b8" stroke-width="2"/>`,
    );
  }
  branches.forEach((branch, index) => {
    const x = 20 + index * colW + colW / 2;
    const color = PALETTE[index % PALETTE.length]!;
    parts.push(
      `<path d="M ${x} 130 L ${x} 150" stroke="#94a3b8" stroke-width="2"/>`,
      `<rect x="${x - colW / 2 + 8}" y="150" width="${colW - 16}" height="54" rx="12" fill="${color.fill}" stroke="${color.stroke}" stroke-width="1.5"/>`,
      textLines(wrapText(branch.label, 24, 3), x, 171, {
        size: 11.5,
        weight: 700,
        color: color.text,
      }),
    );
  });
  return frame(spec.title, height, parts.join(""));
}

/* --------------------------------------------------------------- compare */

export function compareSvg(spec: CompareSpec): string {
  const rows = Math.max(spec.left.length, spec.right.length, 1);
  const height = 96 + rows * 34;
  const parts: string[] = [caption(spec.title)];
  const columns = [
    { title: spec.leftTitle, items: spec.left, color: PALETTE[2]! },
    { title: spec.rightTitle, items: spec.right, color: PALETTE[3]! },
  ];
  columns.forEach((column, index) => {
    const x = 20 + index * 346;
    parts.push(
      `<rect x="${x}" y="48" width="334" height="${height - 66}" rx="16" fill="${column.color.fill}" stroke="${column.color.stroke}" stroke-width="1.4"/>`,
      `<rect x="${x}" y="48" width="334" height="38" rx="16" fill="${column.color.stroke}"/>`,
      `<rect x="${x}" y="70" width="334" height="16" fill="${column.color.stroke}"/>`,
      textLines([column.title.toUpperCase()], x + 167, 73, {
        size: 12,
        weight: 800,
        color: "#ffffff",
      }),
    );
    column.items.slice(0, 8).forEach((item, rowIndex) => {
      const y = 108 + rowIndex * 34;
      parts.push(
        `<circle cx="${x + 18}" cy="${y - 4}" r="3.4" fill="${column.color.stroke}"/>`,
        textLines(wrapText(item, 42, 2), x + 30, y, {
          size: 11.5,
          weight: 600,
          color: "#0f172a",
          anchor: "start",
        }),
      );
    });
  });
  return frame(spec.title, height, parts.join(""));
}

/* -------------------------------------------------------------- timeline */

export function timelineSvg(spec: TimelineSpec): string {
  const events = spec.events.slice(0, 8);
  const step = 660 / Math.max(1, events.length);
  const height = 210;
  const parts: string[] = [caption(spec.title)];
  parts.push(
    `<path d="M 30 120 L 690 120" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>`,
  );
  events.forEach((event, index) => {
    const x = 30 + step * index + step / 2;
    const up = index % 2 === 0;
    const color = BAR_COLORS[index % BAR_COLORS.length]!;
    parts.push(
      `<circle cx="${x}" cy="120" r="8" fill="${color}" stroke="#ffffff" stroke-width="2"/>`,
      `<path d="M ${x} ${up ? 112 : 128} L ${x} ${up ? 82 : 158}" stroke="${color}" stroke-width="2"/>`,
      `<rect x="${Math.max(6, x - step / 2 + 4)}" y="${up ? 46 : 158}" width="${step - 8}" height="36" rx="10" fill="#f8fafc" stroke="#e2e8f0"/>`,
      textLines([event.label], x, up ? 62 : 174, { size: 12, weight: 800, color }),
      textLines(wrapText(event.text, 18, 3), x, up ? 92 : 148, {
        size: 10,
        weight: 600,
        color: "#334155",
      }),
    );
  });
  return frame(spec.title, height, parts.join(""));
}

/* ----------------------------------------------------------------- chart */

export function chartSvg(spec: ChartSpec): string {
  if (spec.mode === "donut") return donutSvg(spec);
  const series = spec.series.slice(0, 8);
  const max = Math.max(...series.map((point) => point.value), 1);
  const plotH = 220;
  const step = 660 / Math.max(1, series.length);
  const barW = Math.min(64, step * 0.55);
  const height = 340;
  const parts: string[] = [caption(spec.title)];
  parts.push(
    `<path d="M 40 62 L 40 ${62 + plotH}" stroke="#cbd5e1" stroke-width="1.5"/>`,
    `<path d="M 40 ${62 + plotH} L 700 ${62 + plotH}" stroke="#cbd5e1" stroke-width="1.5"/>`,
  );
  for (let grid = 1; grid <= 4; grid += 1) {
    const y = 62 + plotH - (plotH / 4) * grid;
    parts.push(
      `<path d="M 40 ${y} L 700 ${y}" stroke="#eef2f7" stroke-width="1" stroke-dasharray="4 5"/>`,
      textLines([String(Math.round((max / 4) * grid))], 34, y + 4, {
        size: 10,
        weight: 600,
        color: "#64748b",
        anchor: "end",
      }),
    );
  }
  series.forEach((point, index) => {
    const x = 40 + step * index + (step - barW) / 2;
    const barH = Math.max(6, (point.value / max) * plotH);
    const y = 62 + plotH - barH;
    const color = BAR_COLORS[index % BAR_COLORS.length]!;
    parts.push(
      `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="8" fill="${color}" opacity="0.92"/>`,
      textLines([`${point.value}${point.suffix}`], x + barW / 2, y - 8, {
        size: 11.5,
        weight: 800,
        color,
      }),
      textLines(wrapText(point.label, 14, 3), x + barW / 2, 62 + plotH + 20, {
        size: 10.5,
        weight: 600,
        color: "#334155",
      }),
    );
  });
  return frame(spec.title, height, parts.join(""));
}

function donutSvg(spec: ChartSpec): string {
  const series = spec.series.slice(0, 8);
  const total = series.reduce((sum, point) => sum + point.value, 0) || 1;
  const cx = 190;
  const cy = 210;
  const radius = 118;
  const thickness = 42;
  const height = 420;
  const parts: string[] = [caption(spec.title)];
  let angle = -Math.PI / 2;
  series.forEach((point, index) => {
    const slice = (point.value / total) * Math.PI * 2;
    const x1 = cx + Math.cos(angle) * radius;
    const y1 = cy + Math.sin(angle) * radius;
    const x2 = cx + Math.cos(angle + slice) * radius;
    const y2 = cy + Math.sin(angle + slice) * radius;
    const large = slice > Math.PI ? 1 : 0;
    const color = BAR_COLORS[index % BAR_COLORS.length]!;
    parts.push(
      `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${thickness}" stroke-linecap="butt"/>`,
    );
    angle += slice;
  });
  parts.push(
    `<circle cx="${cx}" cy="${cy}" r="${radius - thickness / 2}" fill="#ffffff"/>`,
    `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="26" font-weight="800" fill="#0f172a" font-family="Segoe UI,system-ui,sans-serif">${total}%</text>`,
    `<text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="11" font-weight="700" fill="#64748b" font-family="Segoe UI,system-ui,sans-serif">TOTAL</text>`,
  );
  series.forEach((point, index) => {
    const y = 96 + index * 30;
    const color = BAR_COLORS[index % BAR_COLORS.length]!;
    parts.push(
      `<rect x="392" y="${y - 11}" width="14" height="14" rx="4" fill="${color}"/>`,
      textLines([`${point.label} — ${point.value}%`], 414, y, {
        size: 12,
        weight: 700,
        color: "#1e293b",
        anchor: "start",
      }),
    );
  });
  return frame(spec.title, height, parts.join(""));
}

/* ------------------------------------------------------------------ image */

/**
 * A photo the admin uploaded — a handwritten page, a screenshot from a notes
 * app, or a printed diagram. Rendered as plain HTML (not SVG) so it prints at
 * full resolution.
 */
export function imageFigureHtml(spec: ImageSpec): string {
  const caption = spec.caption?.trim();
  return `<div class="kkcc-note-image"><img src="${escapeHtml(spec.url)}" alt="${escapeHtml(caption || "Study note image")}" loading="lazy" decoding="async" />${caption ? `<p class="kkcc-note-image-caption">${escapeHtml(caption)}</p>` : ""}</div>`;
}

/* ------------------------------------------------------------- dispatcher */

export function visualSvg(spec: VisualSpec): string {
  if (spec.kind === "image") return imageFigureHtml(spec);
  switch (spec.kind) {
    case "flow":
      return flowSvg(spec);
    case "cycle":
      return cycleSvg(spec);
    case "tree":
      return treeSvg(spec);
    case "compare":
      return compareSvg(spec);
    case "timeline":
      return timelineSvg(spec);
    case "chart":
      return chartSvg(spec);
  }
}
