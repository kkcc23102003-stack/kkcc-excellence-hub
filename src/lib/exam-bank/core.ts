/**
 * KKCC mega exam question engine — core primitives.
 *
 * The engine is built from *templates*. A template declares a finite parameter
 * space (`count`) and a deterministic `at(index)` builder, so the whole bank can
 * be enumerated and audited: every question is reachable, countable and
 * reproducible. Nothing here is random at build time — randomness only chooses
 * which index to serve.
 *
 * Two families of templates exist:
 *   1. Fact templates    — real facts turned into forward/reverse MCQs with
 *                          distractors drawn from the same category.
 *   2. Numeric templates — genuine parameterised exam sums (profit/loss, SI/CI,
 *                          kinematics, mole concept, depreciation ...).
 */

export type Difficulty = "Easy" | "Moderate" | "Difficult";

export const DIFFICULTIES: Difficulty[] = ["Easy", "Moderate", "Difficult"];

export type GeneratedQuestion = {
  prompt: string;
  answer: string;
  distractors: string[];
  explanation: string;
  difficulty: Difficulty;
  subject: string;
  topic: string;
  /**
   * Exam tracks this question is high-yield for. The quiz UI shows these as
   * badges so a student can see at a glance which paper the question matters
   * for (e.g. "SSC", "UPSC CSE", "Punjab ETT Cadre").
   */
  exams: string[];
};

/**
 * Shared publication gate for every question source. A question can be
 * enumerable without being good enough for a paid KKCC paper, so all runtime
 * consumers use the same conservative structural checks.
 */
export function isPublishableQuestion(question: GeneratedQuestion): boolean {
  const clean = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  const prompt = question.prompt?.trim() ?? "";
  const answer = question.answer?.trim() ?? "";
  const distractors = Array.isArray(question.distractors)
    ? question.distractors.map((item) => item?.trim() ?? "").filter(Boolean)
    : [];
  const explanation = question.explanation?.trim() ?? "";

  if (prompt.length < 12 || answer.length < 1 || explanation.length < 12) return false;
  if (distractors.length !== 3) return false;

  const options = [answer, ...distractors].map(clean);
  if (new Set(options).size !== 4) return false;

  // These are implementation/placeholder phrases that must never reach a
  // student even if an old template accidentally contains one.
  const forbidden = [
    "undefined",
    "[object object]",
    "todo",
    "lorem ipsum",
    "which clue is asked most",
    "best strategy",
    "what should you revise first",
  ];
  const visible = clean(`${prompt} ${answer} ${distractors.join(" ")} ${explanation}`);
  if (forbidden.some((phrase) => visible.includes(phrase))) return false;

  // A paid-paper question must have a meaningful stem and a non-empty
  // explanation that is not merely the answer copied verbatim. This catches
  // common generator failures while allowing legitimate short factual answers.
  if (clean(explanation) === clean(answer) || clean(explanation).length < 24) return false;
  if (distractors.some((item) => clean(item) === clean(answer))) return false;

  return true;
}

export type Template = {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  /** Exam tracks this template is high-yield for. */
  exams: string[];
  /** Size of the parameter space. */
  count: number;
  /** Deterministic builder. Returns null for parameter combos that are invalid. */
  at: (index: number) => GeneratedQuestion | null;
};

/* ------------------------------------------------------------------ helpers */

/** Decode a flat index into mixed-radix coordinates. */
export function decode(index: number, sizes: number[]): number[] {
  const out: number[] = [];
  let rest = index;
  for (let i = sizes.length - 1; i >= 0; i -= 1) {
    const size = sizes[i] ?? 1;
    out[i] = rest % size;
    rest = Math.floor(rest / size);
  }
  return out;
}

export function product(sizes: number[]): number {
  return sizes.reduce((acc, size) => acc * size, 1);
}

/** Round to at most `places` decimals, dropping trailing zeroes. */
export function round(value: number, places = 2): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function fmtNum(value: number, places = 2): string {
  const rounded = round(value, places);
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(places).replace(/0+$/, "").replace(/\.$/, "");
}

export function rupee(value: number, places = 2): string {
  return `₹${fmtNum(value, places)}`;
}

export function pct(value: number, places = 2): string {
  return `${fmtNum(value, places)}%`;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

export function ratio(a: number, b: number): string {
  const g = gcd(a, b);
  return `${a / g} : ${b / g}`;
}

/**
 * Build a 4-option set from a numeric answer plus "common mistake" candidates.
 * Always returns three distinct distractors, so no question can ever ship with
 * a duplicate or missing option.
 */
export function numericOptions(
  answer: number,
  candidates: number[],
  format: (value: number) => string,
): { answer: string; distractors: string[] } {
  const answerText = format(answer);
  const seen = new Set<string>([answerText]);
  const distractors: string[] = [];

  const push = (value: number) => {
    if (distractors.length >= 3) return;
    if (!Number.isFinite(value)) return;
    const text = format(value);
    if (seen.has(text)) return;
    seen.add(text);
    distractors.push(text);
  };

  for (const candidate of candidates) push(candidate);

  // Deterministic fillers so the option count is guaranteed.
  const magnitude = Math.max(Math.abs(answer), 1);
  const steps = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25];
  for (const step of steps) {
    if (distractors.length >= 3) break;
    push(round(answer + (magnitude * step) / 100, 4));
    push(round(answer - (magnitude * step) / 100, 4));
  }
  let extra = 1;
  while (distractors.length < 3) {
    push(round(answer + extra, 4));
    push(round(answer - extra, 4));
    extra += 1;
    if (extra > 500) break;
  }
  return { answer: answerText, distractors: distractors.slice(0, 3) };
}

/**
 * Build a 4-option set from a text answer plus a pool of same-category
 * alternatives. `offset` rotates the pool so different indices of the same
 * template pick different distractors.
 */
export function textOptions(
  answer: string,
  pool: string[],
  offset = 0,
): { answer: string; distractors: string[] } | null {
  const normalise = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  const answerKey = normalise(answer);
  if (!answerKey) return null;

  const candidates = [
    ...new Map(
      pool
        .map((value) => [normalise(value), value] as const)
        .filter(([key, value]) => key && value.trim() && key !== answerKey),
    ).values(),
  ];
  if (candidates.length < 3) return null;

  // Scan the complete pool in a coprime, sequential order. The former fixed
  // stride of seven could visit only one or two entries when the pool size was
  // divisible by seven, silently turning healthy fact tables into dead banks.
  const start = ((Math.trunc(offset) % candidates.length) + candidates.length) % candidates.length;
  const distractors = Array.from(
    { length: 3 },
    (_, index) => candidates[(start + index) % candidates.length]!,
  );
  return { answer, distractors };
}

/* ------------------------------------------------------ template factories */

type NumericSpec = {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  exams: string[];
  sizes: number[];
  build: (
    coords: number[],
  ) => Omit<GeneratedQuestion, "difficulty" | "subject" | "topic" | "exams"> | null;
};

export function numericTemplate(spec: NumericSpec): Template {
  return {
    id: spec.id,
    subject: spec.subject,
    topic: spec.topic,
    difficulty: spec.difficulty,
    exams: spec.exams,
    count: product(spec.sizes),
    at: (index) => {
      const built = spec.build(decode(index, spec.sizes));
      if (!built) return null;
      return {
        ...built,
        difficulty: spec.difficulty,
        subject: spec.subject,
        topic: spec.topic,
        exams: spec.exams,
      };
    },
  };
}

export type FactRow = {
  /** The cue, e.g. "Japan" or "Newton's second law". */
  key: string;
  /** The response, e.g. "Tokyo" or "F = ma". */
  value: string;
  /** Optional extra note appended to the explanation. */
  note?: string;
};

function uniqueFactRows(rows: FactRow[]): FactRow[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = row.key.trim().replace(/\s+/g, " ").toLocaleLowerCase();
    const value = row.value.trim();
    if (!key || !value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

type FactSpec = {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  exams: string[];
  rows: FactRow[];
  /** Question asked when going key -> value. `%s` is replaced by the key. */
  forward: string;
  /** Question asked when going value -> key. `%s` is replaced by the value. */
  reverse?: string | undefined;
  /** Sentence used to explain, `%k` and `%v` are replaced. */
  explain: string;
};

type FactQuestionForm = "recall" | "match" | "statements" | "three-statements";

/** Calibrate the tier to both source depth and the reasoning asked by the stem. */
function difficultyForFactForm(sourceDifficulty: Difficulty, form: FactQuestionForm): Difficulty {
  if (form === "recall") {
    return sourceDifficulty === "Difficult" ? "Moderate" : "Easy";
  }
  if (form === "three-statements") return "Difficult";
  if (form === "match" || form === "statements") {
    return sourceDifficulty === "Easy" ? "Moderate" : sourceDifficulty;
  }
  return sourceDifficulty;
}

/**
 * Turn a fact table into forward (and optionally reverse) MCQs. Distractors are
 * always other real entries from the same table, which keeps them plausible and
 * factually wrong — exactly how real exam options are built.
 */
export function factTemplate(spec: FactSpec): Template[] {
  const normalise = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  const countBy = (pick: (row: FactRow) => string) => {
    const counts = new Map<string, number>();
    for (const row of spec.rows) {
      const key = normalise(pick(row));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  };
  const keyCounts = countBy((row) => row.key);
  const valueCounts = countBy((row) => row.value);
  const values = [
    ...new Map(
      spec.rows
        .map((row) => [normalise(row.value), row.value.trim()] as const)
        .filter(([key, value]) => key && value),
    ).values(),
  ];
  const keys = [
    ...new Map(
      spec.rows
        .map((row) => [normalise(row.key), row.key.trim()] as const)
        .filter(([key, value]) => key && value),
    ).values(),
  ];
  const forwardRows = spec.rows.filter(
    (row) => row.key.trim() && row.value.trim() && keyCounts.get(normalise(row.key)) === 1,
  );
  const reverseRows = spec.rows.filter(
    (row) =>
      row.key.trim() &&
      row.value.trim() &&
      keyCounts.get(normalise(row.key)) === 1 &&
      valueCounts.get(normalise(row.value)) === 1,
  );
  const difficulty = difficultyForFactForm(spec.difficulty, "recall");

  const makeExplanation = (row: FactRow) => {
    const base = spec.explain.replace("%k", row.key).replace("%v", row.value);
    return row.note ? `${base} ${row.note}` : base;
  };

  const forwardTemplate: Template = {
    id: `${spec.id}:fwd`,
    subject: spec.subject,
    topic: spec.topic,
    difficulty,
    exams: spec.exams,
    count: values.length >= 4 ? forwardRows.length : 0,
    at: (index) => {
      const row = forwardRows[index];
      if (!row) return null;
      const options = textOptions(row.value, values, index);
      if (!options) return null;
      return {
        prompt: spec.forward.replace("%s", row.key),
        answer: options.answer,
        distractors: options.distractors,
        explanation: makeExplanation(row),
        difficulty,
        subject: spec.subject,
        topic: spec.topic,
        exams: spec.exams,
      };
    },
  };

  const output: Template[] = [];
  if (forwardTemplate.count > 0) output.push(forwardTemplate);
  if (!spec.reverse) return output;

  const reverseTemplate: Template = {
    id: `${spec.id}:rev`,
    subject: spec.subject,
    topic: spec.topic,
    difficulty,
    exams: spec.exams,
    count: keys.length >= 4 ? reverseRows.length : 0,
    at: (index) => {
      const row = reverseRows[index];
      if (!row) return null;
      const options = textOptions(row.key, keys, index + 3);
      if (!options) return null;
      return {
        prompt: spec.reverse!.replace("%s", row.value),
        answer: options.answer,
        distractors: options.distractors,
        explanation: makeExplanation(row),
        difficulty,
        subject: spec.subject,
        topic: spec.topic,
        exams: spec.exams,
      };
    },
  };

  if (reverseTemplate.count > 0) output.push(reverseTemplate);
  return output;
}

type MatchSpec = {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  exams: string[];
  rows: FactRow[];
  /** Optional description of the pairing, e.g. "organelle and its function". */
  label?: string | undefined;
  /** How many different companion sets to build per wrong pair. */
  variants?: number | undefined;
};

/**
 * "Which of the following pairs is NOT correctly matched?" — one of the most
 * common real formats in NEET, SSC and state exams. Three pairs are taken
 * straight from the fact table and one is deliberately mismatched, so every
 * option is built from genuine data and exactly one is wrong.
 */
export function matchTemplate(spec: MatchSpec): Template {
  const rows = spec.rows;
  const n = rows.length;
  const variants = Math.max(1, Math.floor(spec.variants ?? 4));
  const normalise = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  const uniqueRows = uniqueFactRows(rows);
  const pairs: Array<{ odd: FactRow; wrong: FactRow; companions: FactRow[] }> = [];

  if (uniqueRows.length >= 5) {
    for (const odd of uniqueRows) {
      for (const wrong of uniqueRows) {
        if (odd === wrong || normalise(odd.value) === normalise(wrong.value)) continue;
        const companions = uniqueRows.filter((candidate) => candidate.key !== odd.key);
        if (companions.length >= 3) pairs.push({ odd, wrong, companions });
      }
    }
  }

  // Precompute only realizable pairs, so every published index maps to a
  // question rather than a null slot. A small variant rotation keeps question
  // options diverse without relying on a stride that can cycle prematurely.
  const addressablePairs = pairs.flatMap((pair) =>
    Array.from({ length: Math.min(variants, pair.companions.length) }, (_, rotation) => ({
      ...pair,
      rotation,
    })),
  );
  const difficulty = difficultyForFactForm(spec.difficulty, "match");

  return {
    id: `${spec.id}:match`,
    subject: spec.subject,
    topic: spec.topic,
    difficulty,
    exams: spec.exams,
    count: addressablePairs.length,
    at: (index) => {
      const item = addressablePairs[index];
      if (!item) return null;
      const answer = `${item.odd.key} — ${item.wrong.value}`;
      const options = Array.from({ length: 3 }, (_, step) => {
        const row = item.companions[(item.rotation + step) % item.companions.length];
        return `${row?.key} — ${row?.value}`;
      });

      return {
        prompt: spec.label
          ? `Which of the following pairs of ${spec.label} is NOT correctly matched?`
          : `Which of the following pairs is NOT correctly matched?`,
        answer,
        distractors: options,
        explanation: `${item.odd.key} is correctly matched with ${item.odd.value}, not ${item.wrong.value}. The other three pairs are correctly matched.`,
        difficulty,
        subject: spec.subject,
        topic: spec.topic,
        exams: spec.exams,
      };
    },
  };
}

type StatementSpec = {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  exams: string[];
  rows: FactRow[];
  /** Describes the set, e.g. "the Sikh Gurus". */
  label?: string | undefined;
};

/**
 * "Consider the following statements ... Which of the statements given above
 * is/are correct?" — the single most common format in UPSC, State PSC, PPSC
 * and PSSSB papers.
 *
 * Two statements are built from the fact table. Each is independently either
 * genuine (key paired with its real value) or falsified (key paired with
 * another row's value), giving four real truth combinations and four standard
 * options. Every statement is built from real data, so a student who knows the
 * facts can always answer it.
 */
export function statementTemplate(spec: StatementSpec): Template {
  const rows = uniqueFactRows(spec.rows);
  const n = rows.length;
  // [first row, offset to second row, truth combination]
  const sizes = [n, Math.max(1, n - 1), 4];
  const about = spec.label ? ` about ${spec.label}` : "";
  const hasDistinctValues =
    new Set(rows.map((row) => row.value.trim().toLocaleLowerCase())).size > 1;
  const difficulty = difficultyForFactForm(spec.difficulty, "statements");

  return {
    id: `${spec.id}:stmt`,
    subject: spec.subject,
    topic: spec.topic,
    difficulty,
    exams: spec.exams,
    count: n < 4 || !hasDistinctValues ? 0 : product(sizes),
    at: (index) => {
      if (n < 4) return null;
      const [firstIdx, offset, truth] = decode(index, sizes) as [number, number, number];
      const rowA = rows[firstIdx];
      const rowB = rows[(firstIdx + 1 + offset) % n];
      if (!rowA || !rowB || rowA.key === rowB.key) return null;

      const aTrue = (truth & 1) === 1;
      const bTrue = (truth & 2) === 2;

      // A falsified statement borrows a different row's value.
      const wrongFor = (row: FactRow, seed: number): string | null => {
        for (let step = 1; step < n; step += 1) {
          const candidate = rows[(firstIdx + seed + step) % n];
          if (!candidate) continue;
          if (candidate.value.trim().toLocaleLowerCase() !== row.value.trim().toLocaleLowerCase()) {
            return candidate.value;
          }
        }
        return null;
      };

      const valueA = aTrue ? rowA.value : wrongFor(rowA, 1);
      const valueB = bTrue ? rowB.value : wrongFor(rowB, 5);
      if (!valueA || !valueB) return null;

      const answer =
        aTrue && bTrue ? "Both 1 and 2" : aTrue ? "1 only" : bTrue ? "2 only" : "Neither 1 nor 2";
      const distractors = ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"].filter(
        (option) => option !== answer,
      );

      const verdict = (ok: boolean, row: FactRow, shown: string) =>
        ok
          ? `Statement about ${row.key} is correct.`
          : `Statement about ${row.key} is wrong, because ${row.key} is ${row.value}, not ${shown}.`;

      return {
        prompt:
          `Consider the following statements${about}:\n` +
          `1. ${rowA.key} — ${valueA}\n` +
          `2. ${rowB.key} — ${valueB}\n` +
          `Which of the statements given above is/are correct?`,
        answer,
        distractors,
        explanation: `${verdict(aTrue, rowA, valueA)} ${verdict(bTrue, rowB, valueB)}`,
        difficulty,
        subject: spec.subject,
        topic: spec.topic,
        exams: spec.exams,
      };
    },
  };
}

/**
 * "How many of the above statements are correct?" — the three-statement
 * variant that UPSC and PPSC now use heavily. Same honest construction: each
 * of the three statements is either a real pair or a falsified one.
 */
export function statementCountTemplate(spec: StatementSpec): Template {
  const rows = uniqueFactRows(spec.rows);
  const n = rows.length;
  // [first row, second offset, third offset, truth pattern 0..7]
  const sizes = [n, Math.max(1, n - 1), Math.max(1, n - 2), 8];
  const about = spec.label ? ` about ${spec.label}` : "";
  const hasDistinctValues =
    new Set(rows.map((row) => row.value.trim().toLocaleLowerCase())).size > 1;
  const difficulty = difficultyForFactForm(spec.difficulty, "three-statements");

  return {
    id: `${spec.id}:stmt3`,
    subject: spec.subject,
    topic: spec.topic,
    difficulty,
    exams: spec.exams,
    // Three unique facts are sufficient: each statement can use a different
    // key, and a distractor value can be borrowed from the other rows. Keeping
    // these compact sets addressable avoids manufacturing zero-count template
    // definitions for legitimate three-statement questions.
    count: n < 3 || !hasDistinctValues ? 0 : product(sizes),
    at: (index) => {
      if (n < 3) return null;
      const [firstIdx, offB, offC, truth] = decode(index, sizes) as [
        number,
        number,
        number,
        number,
      ];
      const idxA = firstIdx;
      const idxB = (firstIdx + 1 + offB) % n;
      const thirdCandidates = rows
        .map((_, rowIndex) => rowIndex)
        .filter((rowIndex) => rowIndex !== idxA && rowIndex !== idxB);
      const idxC = thirdCandidates[offC];
      if (idxC === undefined) return null;

      const picked = [rows[idxA], rows[idxB], rows[idxC]];
      if (picked.some((row) => !row)) return null;
      const chosen = picked as FactRow[];

      const wrongFor = (row: FactRow, seed: number): string | null => {
        for (let step = 1; step < n; step += 1) {
          const candidate = rows[(firstIdx + seed + step) % n];
          if (!candidate) continue;
          if (candidate.value.trim().toLocaleLowerCase() !== row.value.trim().toLocaleLowerCase()) {
            return candidate.value;
          }
        }
        return null;
      };

      const flags = [(truth & 1) === 1, (truth & 2) === 2, (truth & 4) === 4];
      const shown: string[] = [];
      for (let i = 0; i < 3; i += 1) {
        const row = chosen[i] as FactRow;
        const value = flags[i] ? row.value : wrongFor(row, 2 * i + 1);
        if (!value) return null;
        shown.push(value);
      }

      const correctCount = flags.filter(Boolean).length;
      const label = ["None of the statements", "Only one", "Only two", "All three"];
      const answer = label[correctCount] as string;
      const distractors = label.filter((option) => option !== answer);

      const lines = chosen.map((row, i) => `${i + 1}. ${row.key} — ${shown[i]}`).join("\n");
      const why = chosen
        .map((row, i) =>
          flags[i]
            ? `Statement ${i + 1} is correct.`
            : `Statement ${i + 1} is wrong, because ${row.key} is ${row.value}.`,
        )
        .join(" ");

      return {
        prompt:
          `Consider the following statements${about}:\n${lines}\n` +
          `How many of the statements given above are correct?`,
        answer,
        distractors,
        explanation: why,
        difficulty,
        subject: spec.subject,
        topic: spec.topic,
        exams: spec.exams,
      };
    },
  };
}

/** A plain list of hand-written MCQs exposed as a template. */
export function literalTemplate(spec: {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  exams: string[];
  items: {
    prompt: string;
    answer: string;
    distractors: string[];
    explanation: string;
  }[];
}): Template {
  return {
    id: spec.id,
    subject: spec.subject,
    topic: spec.topic,
    difficulty: spec.difficulty,
    exams: spec.exams,
    count: spec.items.length,
    at: (index) => {
      const item = spec.items[index];
      if (!item) return null;
      return {
        ...item,
        difficulty: spec.difficulty,
        subject: spec.subject,
        topic: spec.topic,
        exams: spec.exams,
      };
    },
  };
}
