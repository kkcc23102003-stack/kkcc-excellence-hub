/**
 * Formula typesetting for study notes.
 *
 * The admin writes formulas the way they would in a notebook:
 *
 *   Area of circle = \pi r^2
 *   Quadratic formula: x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
 *   2H_2 + O_2 -> 2H_2O
 *   v = u + at,  x^2 + y^2 = r^2,  H_2SO_4
 *
 * This module turns that into styled HTML: real stacked fractions, superscripts,
 * subscripts, radicals, Greek letters, arrows and chemical subscripts. No
 * external library and no web fonts, so it renders identically on a phone, on a
 * projector and in a printed PDF.
 */

/** `\name` → symbol. Anything not listed here keeps its backslash-stripped text. */
const SYMBOLS: Record<string, string> = {
  times: "×",
  div: "÷",
  cdot: "·",
  pm: "±",
  mp: "∓",
  le: "≤",
  leq: "≤",
  ge: "≥",
  geq: "≥",
  ne: "≠",
  neq: "≠",
  approx: "≈",
  equiv: "≡",
  propto: "∝",
  infty: "∞",
  rightarrow: "→",
  to: "→",
  longrightarrow: "⟶",
  Rightarrow: "⇒",
  leftarrow: "←",
  leftrightarrow: "↔",
  uparrow: "↑",
  downarrow: "↓",
  sum: "∑",
  prod: "∏",
  int: "∫",
  oint: "∮",
  partial: "∂",
  nabla: "∇",
  therefore: "∴",
  because: "∵",
  angle: "∠",
  perp: "⊥",
  parallel: "∥",
  degree: "°",
  circ: "°",
  ldots: "…",
  dots: "…",
  cdots: "⋯",
  prime: "′",
  in: "∈",
  notin: "∉",
  subset: "⊂",
  supset: "⊃",
  cup: "∪",
  cap: "∩",
  forall: "∀",
  exists: "∃",
  Delta: "Δ",
  omega: "ω",
  Omega: "Ω",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  varepsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  Theta: "Θ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  Lambda: "Λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  Xi: "Ξ",
  pi: "π",
  Pi: "Π",
  rho: "ρ",
  sigma: "σ",
  Sigma: "Σ",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  varphi: "φ",
  Phi: "Φ",
  chi: "χ",
  psi: "ψ",
  Psi: "Ψ",
  quad: " ",
  qquad: " ",
  ",": " ",
  ";": " ",
  "!": "",
};

export function escapeMathHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Is this run of text a chemical formula, e.g. H2SO4 / Ca(OH)2 / C6H12O6? */
function isChemicalToken(token: string): boolean {
  const bare = token.replace(/[(),[\]·.+\-\d]/g, "");
  if (!/[A-Z]/.test(bare) || bare.length > 12) return false;
  // Every letter must look like an element symbol: Capital, or Capital + lower.
  if (!/^(?:[A-Z][a-z]?)+$/.test(bare)) return false;
  // Pure English words such as "No" or "In" are elements too, so numbers or a
  // parenthesis are required as evidence that this really is a formula.
  return /\d/.test(token) || /\(/.test(token);
}

/** Subscript the digits (and bracketed groups) of a chemical formula. */
function renderChemical(token: string): string {
  return escapeMathHtml(token).replace(/(\d+)/g, '<sub class="kkcc-math-sub">$1</sub>');
}

const SUPERSCRIPT_TEXT: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  n: "ⁿ",
};

interface MathOptions {
  /** Inside a formula block a plain `a/b` becomes a stacked fraction. */
  stackSimpleFractions?: boolean;
}

/** Convert one math expression (already known to be math) into HTML. */
export function renderMath(expression: string, options: MathOptions = {}): string {
  const source = expression.replace(/\r/g, "").replace(/\n+/g, " ");
  let index = 0;

  /** `{ ... }` (nested allowed) or the next atom, e.g. the `2` of `x^2`. */
  const readBraced = (): string => {
    if (source[index] === "{") {
      let depth = 0;
      const start = index;
      for (; index < source.length; index += 1) {
        if (source[index] === "{") depth += 1;
        else if (source[index] === "}") {
          depth -= 1;
          if (depth === 0) {
            const inner = source.slice(start + 1, index);
            // Step past the closing brace so it is never printed.
            index += 1;
            return inner;
          }
        }
      }
      return source.slice(start + 1);
    }
    const rest = source.slice(index);
    const atom = /^[A-Za-z0-9]+|^\\[A-Za-z]+|^./.exec(rest);
    const taken = atom?.[0] ?? "";
    index += taken.length;
    return taken;
  };

  const parts: string[] = [];
  let plain = "";

  const flushPlain = () => {
    if (!plain) return;
    const escaped = escapeMathHtml(plain);
    // Split off runs that are chemical formulas so their digits drop.
    const html = escaped.replace(/(?:[A-Z][a-z]?\d*|[()[\]]\d*|\+\d*)+/g, (token) =>
      isChemicalToken(token.replace(/&amp;/g, "&")) ? renderChemical(token) : token,
    );
    parts.push(html);
    plain = "";
  };

  while (index < source.length) {
    const char = source[index]!;

    if (char === "\\") {
      const nameMatch = /^\\([A-Za-z]+|[,;!:])/.exec(source.slice(index));
      if (!nameMatch) {
        plain += char;
        index += 1;
        continue;
      }
      const name = nameMatch[1]!;
      index += nameMatch[0].length;

      if (name === "frac" || name === "dfrac" || name === "tfrac") {
        const numerator = readBraced();
        const denominator = readBraced();
        flushPlain();
        parts.push(
          `<span class="kkcc-math-frac"><span class="kkcc-math-num">${renderMath(numerator, options)}</span><span class="kkcc-math-den">${renderMath(denominator, options)}</span></span>`,
        );
        continue;
      }
      if (name === "sqrt") {
        const inner = readBraced();
        flushPlain();
        parts.push(
          `<span class="kkcc-math-sqrt"><span class="kkcc-math-radical">√</span><span class="kkcc-math-radicand">${renderMath(inner, options)}</span></span>`,
        );
        continue;
      }
      if (name === "text" || name === "mathrm" || name === "operatorname") {
        const inner = readBraced();
        flushPlain();
        parts.push(`<span class="kkcc-math-text">${escapeMathHtml(inner)}</span>`);
        continue;
      }
      if (name === "left" || name === "right") {
        const bracket = source[index] === "\\" ? "" : (source[index] ?? "");
        if (bracket) index += 1;
        plain += bracket === "." ? "" : bracket;
        continue;
      }
      const symbol = SYMBOLS[name];
      plain += symbol ?? name;
      continue;
    }

    if (char === "^" || char === "_") {
      index += 1;
      const raw = readBraced();
      flushPlain();
      const isSuperscript = char === "^";
      // Single digits look best as real unicode superscripts, e.g. m/s².
      if (isSuperscript && raw.length === 1 && SUPERSCRIPT_TEXT[raw]) {
        parts.push(escapeMathHtml(SUPERSCRIPT_TEXT[raw]!));
        continue;
      }
      parts.push(
        isSuperscript
          ? `<sup class="kkcc-math-sup">${renderMath(raw, options)}</sup>`
          : `<sub class="kkcc-math-sub">${renderMath(raw, options)}</sub>`,
      );
      continue;
    }

    if (char === "√") {
      index += 1;
      const raw = readBraced();
      flushPlain();
      parts.push(
        `<span class="kkcc-math-sqrt"><span class="kkcc-math-radical">√</span><span class="kkcc-math-radicand">${renderMath(raw, options)}</span></span>`,
      );
      continue;
    }

    if (char === "*") {
      // 2*3 or a*b reads better with a real multiplication sign.
      plain += "×";
      index += 1;
      continue;
    }

    if (char === "-" && source[index + 1] === ">") {
      // 2H2 + O2 -> 2H2O
      plain += "→";
      index += 2;
      continue;
    }

    if (source.startsWith("<=>", index)) {
      plain += "⇌";
      index += 3;
      continue;
    }

    if (options.stackSimpleFractions && char === "/") {
      // Only numeric fractions are stacked: 1/2 becomes a real half.
      const left = /([A-Za-z0-9]+)$/.exec(plain)?.[1] ?? "";
      const right = /^([A-Za-z0-9]+)/.exec(source.slice(index + 1))?.[1] ?? "";
      if (left && right && /\d/.test(left) && /\d/.test(right)) {
        plain = plain.slice(0, plain.length - left.length);
        index += 1 + right.length;
        flushPlain();
        parts.push(
          `<span class="kkcc-math-frac"><span class="kkcc-math-num">${renderMath(left, options)}</span><span class="kkcc-math-den">${renderMath(right, options)}</span></span>`,
        );
        continue;
      }
    }

    plain += char;
    index += 1;
  }

  flushPlain();
  return parts.join("");
}

/**
 * Does this line need the formula renderer? Plain sentences never trigger it, so
 * ordinary notes stay ordinary.
 */
export function looksLikeFormula(line: string): boolean {
  const text = line.trim();
  if (!text) return false;
  if (/\\[A-Za-z]+/.test(text)) return true;
  if (/[√∑∫πΔ∞≤≥≠±×÷]/.test(text)) return true;
  if (/\^\{|_\{|\^\d|_[A-Za-z0-9]/.test(text)) return true;
  if (/(?:\d|[a-zA-Z])\s*\/\s*(?:\d|[a-zA-Z])\s*\^/.test(text)) return true;
  if (/[A-Za-z]\s*=\s*[-+\\\d(]/.test(text)) return true;
  if (/\d+\s*°|°\s*C/.test(text)) return true;
  // Chemical equations and formulas: 2H2 + O2 -> 2H2O, H2SO4, Ca(OH)2.
  if (/(?:->|→|⇌|<=>)/.test(text) && /[A-Z][a-z]?\d/.test(text)) return true;
  if (/\b[A-Z][A-Za-z()]*\d[A-Za-z0-9()]*\b/.test(text) && /[A-Z]/.test(text)) return true;
  if (/^(?:\d*\s*[A-Z][a-z]?\d*(?:\([A-Za-z0-9]+\)\d*)?\s*)+$/.test(text) && /\d/.test(text))
    return true;
  return false;
}

/** Render one full formula line for a formula block. */
export function renderFormulaLine(line: string): string {
  return renderMath(line.trim(), { stackSimpleFractions: true });
}
