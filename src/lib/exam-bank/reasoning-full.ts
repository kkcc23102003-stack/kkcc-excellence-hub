/**
 * Logical Reasoning — the rest of the syllabus.
 *
 * `reasoning.ts` already covers number series, coding, directions, clocks,
 * calendars, ranking, alphabet tests and mathematical operations. This file
 * adds every remaining chapter that SSC, banking, railway, defence and state
 * papers actually set, with both a Moderate practice layer and a Difficult
 * exam layer for each.
 */

import {
  type Difficulty,
  type Template,
  fmtNum,
  numericOptions,
  literalTemplate,
  numericTemplate,
  textOptions,
} from "./core";
import { APTITUDE_WIDE } from "./two-layer";

const EX = APTITUDE_WIDE;
const templates: Template[] = [];
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Built = { prompt: string; answer: string; distractors: string[]; explanation: string };

function add(
  id: string,
  topic: string,
  difficulty: Difficulty,
  sizes: number[],
  build: (c: number[]) => Built | null,
) {
  templates.push(
    numericTemplate({ id, subject: "Reasoning", topic, difficulty, exams: EX, sizes, build }),
  );
}

/* ================================================== blood relations ====== */

const MALE = [
  "Ravi",
  "Mohan",
  "Arun",
  "Vikas",
  "Sunil",
  "Rahul",
  "Deepak",
  "Manoj",
  "Karan",
  "Amit",
  "Naveen",
  "Sanjay",
];
const FEMALE = [
  "Sunita",
  "Kavita",
  "Meena",
  "Priya",
  "Anita",
  "Rekha",
  "Neha",
  "Pooja",
  "Sonia",
  "Radha",
  "Geeta",
  "Nisha",
];
const RELATIONS = [
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Maternal uncle",
  "Paternal uncle",
  "Aunt",
  "Nephew",
  "Niece",
  "Cousin",
  "Grandfather",
  "Grandmother",
  "Mother-in-law",
  "Father-in-law",
  "Brother-in-law",
  "Sister-in-law",
  "Husband",
  "Wife",
];

type Chain = { g: ("m" | "f")[]; clues: string; q: string; a: string; why: string };

const CHAINS: Chain[] = [
  {
    g: ["m", "f", "m"],
    clues: "%1 is the brother of %2. %2 is the mother of %3.",
    q: "How is %1 related to %3?",
    a: "Maternal uncle",
    why: "%1 is the brother of %3's mother, so %1 is the maternal uncle of %3.",
  },
  {
    g: ["m", "m", "f"],
    clues: "%1 is the father of %2. %2 is the brother of %3.",
    q: "How is %1 related to %3?",
    a: "Father",
    why: "%2 and %3 are siblings, so the father of %2 is also the father of %3.",
  },
  {
    g: ["f", "m", "f"],
    clues: "%1 is the mother of %2. %2 is the husband of %3.",
    q: "How is %1 related to %3?",
    a: "Mother-in-law",
    why: "%1 is the mother of %3's husband, so %1 is the mother-in-law of %3.",
  },
  {
    g: ["m", "f", "m"],
    clues: "%1 is the son of %2. %2 is the daughter of %3.",
    q: "How is %3 related to %1?",
    a: "Maternal grandfather",
    why: "%3 is the father of %1's mother, so %3 is the maternal grandfather of %1.",
  },
  {
    g: ["m", "f"],
    clues: "Pointing to %2, %1 said, 'She is the daughter of the only son of my father.'",
    q: "How is %2 related to %1?",
    a: "Daughter",
    why: "The only son of %1's father is %1 himself, so %2 is his daughter.",
  },
  {
    g: ["m", "m"],
    clues: "Pointing to %2, %1 said, 'He is the son of the only son of my father.'",
    q: "How is %2 related to %1?",
    a: "Son",
    why: "The only son of %1's father is %1 himself, so %2 is his son.",
  },
  {
    g: ["m", "f"],
    clues:
      "Pointing to a photograph of %2, %1 said, 'Her mother is the only daughter of my mother.'",
    q: "How is %2 related to %1?",
    a: "Niece",
    why: "The only daughter of %1's mother is %1's sister, and %2 is that sister's daughter, so %2 is his niece.",
  },
  {
    g: ["m", "m", "f"],
    clues: "%1 is the husband of %3. %2 is the brother of %3.",
    q: "How is %2 related to %1?",
    a: "Brother-in-law",
    why: "%2 is the brother of %1's wife, so %2 is the brother-in-law of %1.",
  },
  {
    g: ["f", "f", "m"],
    clues: "%1 is the sister of %2. %3 is the father of %1.",
    q: "How is %3 related to %2?",
    a: "Father",
    why: "%1 and %2 are sisters, so the father of %1 is the father of %2 as well.",
  },
  {
    g: ["m", "f", "m"],
    clues: "%1 is the son of %2. %3 is the brother of %2.",
    q: "How is %3 related to %1?",
    a: "Maternal uncle",
    why: "%3 is the brother of %1's mother, hence the maternal uncle of %1.",
  },
  {
    g: ["m", "m", "m"],
    clues: "%1 is the father of %2 and %2 is the father of %3.",
    q: "How is %1 related to %3?",
    a: "Grandfather",
    why: "%1 is the father of %3's father, so %1 is the grandfather of %3.",
  },
  {
    g: ["f", "m", "f"],
    clues: "%1 is the daughter of %2. %3 is the wife of %2.",
    q: "How is %3 related to %1?",
    a: "Mother",
    why: "%3 is the wife of %1's father, so %3 is the mother of %1.",
  },
  {
    g: ["m", "f", "m"],
    clues: "%2 is the wife of %1 and %3 is the son of %2.",
    q: "How is %3 related to %1?",
    a: "Son",
    why: "%3 is the son of %1's wife, so %3 is the son of %1.",
  },
  {
    g: ["m", "m", "f"],
    clues: "%1 is the brother of %2. %3 is the sister of %1.",
    q: "How is %3 related to %2?",
    a: "Sister",
    why: "%1, %2 and %3 are siblings, so %3 is the sister of %2.",
  },
];

const CHAINS_HARD: Chain[] = [
  {
    g: ["m", "f", "m", "f"],
    clues: "%1 is the son of %2. %2 is the sister of %3. %3 is the father of %4.",
    q: "How is %4 related to %1?",
    a: "Cousin",
    why: "%2 and %3 are siblings, so their children %1 and %4 are cousins.",
  },
  {
    g: ["m", "f"],
    clues: "Pointing to %2, %1 said, 'She is the only daughter of the father of my son's mother.'",
    q: "How is %2 related to %1?",
    a: "Wife",
    why: "%1's son's mother is his wife; her father's only daughter is that same wife, so %2 is the wife of %1.",
  },
  {
    g: ["m", "m"],
    clues:
      "Pointing to %2, %1 said, 'He is the father of the sister of my father's only son.' %1 has no brother.",
    q: "How is %2 related to %1?",
    a: "Father",
    why: "The only son of %1's father is %1; the father of %1's sister is %1's own father.",
  },
  {
    g: ["f", "m", "f"],
    clues: "%1 is the mother of %2. %3 is the daughter of %2's wife.",
    q: "How is %1 related to %3?",
    a: "Grandmother",
    why: "%3 is the daughter of %2, and %1 is the mother of %2, so %1 is the grandmother of %3.",
  },
  {
    g: ["m", "f", "m", "m"],
    clues: "%1 is the brother of %2. %2 is the wife of %3. %4 is the son of %3.",
    q: "How is %1 related to %4?",
    a: "Maternal uncle",
    why: "%2 is the mother of %4 and %1 is her brother, so %1 is the maternal uncle of %4.",
  },
  {
    g: ["f", "m", "f"],
    clues: "%2 is the only child of %1. %3 is the wife of %2's father's only son.",
    q: "How is %3 related to %1?",
    a: "Daughter-in-law",
    why: "The only son of %2's father is %2, so %3 is the wife of %2, that is the daughter-in-law of %1.",
  },
];

function chainNames(chain: Chain, combo: number): string[] {
  const used = new Set<string>();
  return chain.g.map((g, i) => {
    const pool = g === "m" ? MALE : FEMALE;
    let k = (combo + i * 5) % pool.length;
    while (used.has(pool[k] as string)) k = (k + 1) % pool.length;
    used.add(pool[k] as string);
    return pool[k] as string;
  });
}

function fillNames(text: string, names: string[]): string {
  return text.replace(/%(\d)/g, (_m, d: string) => names[Number(d) - 1] ?? "");
}

function bloodBuilder(list: Chain[]) {
  return ([ci, combo]: number[]) => {
    const chain = list[ci as number] as Chain;
    const names = chainNames(chain, combo as number);
    const pool = [...RELATIONS, "Daughter-in-law", "Son-in-law"];
    const opts = textOptions(chain.a, pool, (ci as number) + (combo as number) * 3);
    if (!opts) return null;
    return {
      prompt: `${fillNames(chain.clues, names)}\n${fillNames(chain.q, names)}`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: fillNames(chain.why, names),
    };
  };
}

add("reason:blood:chain", "Blood Relations", "Moderate", [CHAINS.length, 48], bloodBuilder(CHAINS));
add(
  "reason:blood:chain:adv",
  "Blood Relations",
  "Difficult",
  [CHAINS_HARD.length, 48],
  bloodBuilder(CHAINS_HARD),
);

/* coded blood relations */

const CODED_OPS: { sym: string; text: string }[] = [
  { sym: "+", text: "is the father of" },
  { sym: "-", text: "is the sister of" },
  { sym: "x", text: "is the mother of" },
  { sym: "/", text: "is the brother of" },
];

const CODED_CASES: { a: number; b: number; answer: string; why: string }[] = [
  {
    a: 2,
    b: 1,
    answer: "P is the mother of R",
    why: "P is the mother of Q and Q is the sister of R, so P is the mother of R as well.",
  },
  {
    a: 0,
    b: 3,
    answer: "P is the father of R",
    why: "P is the father of Q and Q is the brother of R, so P is the father of R as well.",
  },
  {
    a: 0,
    b: 1,
    answer: "P is the father of R",
    why: "P is the father of Q and Q is the sister of R, so P is the father of R as well.",
  },
  {
    a: 2,
    b: 3,
    answer: "P is the mother of R",
    why: "P is the mother of Q and Q is the brother of R, so P is the mother of R as well.",
  },
  {
    a: 1,
    b: 0,
    answer: "P is the aunt of R",
    why: "P is the sister of Q and Q is the father of R, so P is the aunt of R.",
  },
  {
    a: 3,
    b: 2,
    answer: "P is the uncle of R",
    why: "P is the brother of Q and Q is the mother of R, so P is the maternal uncle of R.",
  },
  {
    a: 1,
    b: 2,
    answer: "P is the aunt of R",
    why: "P is the sister of Q and Q is the mother of R, so P is the maternal aunt of R.",
  },
  {
    a: 3,
    b: 0,
    answer: "P is the uncle of R",
    why: "P is the brother of Q and Q is the father of R, so P is the paternal uncle of R.",
  },
];

add("reason:blood:coded", "Blood Relations", "Difficult", [CODED_CASES.length], ([i]) => {
  const c = CODED_CASES[i as number] as (typeof CODED_CASES)[number];
  const legend = CODED_OPS.map((o) => `A ${o.sym} B means A ${o.text} B`).join(", ");
  const expr = `P ${(CODED_OPS[c.a] as (typeof CODED_OPS)[number]).sym} Q ${(CODED_OPS[c.b] as (typeof CODED_OPS)[number]).sym} R`;
  const pool = [
    "P is the mother of R",
    "P is the father of R",
    "P is the aunt of R",
    "P is the uncle of R",
    "P is the sister of R",
    "P is the brother of R",
    "P is the grandmother of R",
    "P is the daughter of R",
  ];
  const opts = textOptions(c.answer, pool, i as number);
  if (!opts) return null;
  return {
    prompt: `If ${legend}, then what does ${expr} mean?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: c.why,
  };
});

/* ======================================================== syllogism ====== */

const NOUNS = [
  { s: "pen", p: "pens" },
  { s: "book", p: "books" },
  { s: "table", p: "tables" },
  { s: "chair", p: "chairs" },
  { s: "flower", p: "flowers" },
  { s: "tree", p: "trees" },
  { s: "cat", p: "cats" },
  { s: "dog", p: "dogs" },
  { s: "doctor", p: "doctors" },
  { s: "engineer", p: "engineers" },
  { s: "city", p: "cities" },
  { s: "village", p: "villages" },
];

const VERDICTS = [
  "Only conclusion I follows",
  "Only conclusion II follows",
  "Both conclusions follow",
  "Neither conclusion follows",
  "Either conclusion I or conclusion II follows",
];

type Syl = { st: [string, string]; c: [string, string]; v: number; why: string };

/** %A %B %C are replaced by plurals, %a %b %c by singulars. */
const SYL: Syl[] = [
  {
    st: ["All %A are %B.", "All %B are %C."],
    c: ["All %A are %C.", "Some %C are %A."],
    v: 2,
    why: "%A is contained in %B and %B in %C, so all %A are %C, and therefore some %C are %A.",
  },
  {
    st: ["Some %A are %B.", "All %B are %C."],
    c: ["Some %A are %C.", "All %A are %C."],
    v: 0,
    why: "The %A that are %B must be %C, so some %A are %C; nothing proves that every %a is a %c.",
  },
  {
    st: ["All %A are %B.", "Some %B are %C."],
    c: ["Some %A are %C.", "Some %C are %A."],
    v: 3,
    why: "The %B that are %C need not be the %B that are %A, so neither conclusion is certain.",
  },
  {
    st: ["No %a is a %b.", "All %C are %B."],
    c: ["No %c is a %a.", "Some %A are %C."],
    v: 0,
    why: "Every %c is a %b and no %a is a %b, so no %c can be an %a; the second conclusion contradicts this.",
  },
  {
    st: ["All %A are %B.", "No %b is a %c."],
    c: ["No %a is a %c.", "Some %C are %A."],
    v: 0,
    why: "Every %a is a %b and no %b is a %c, so no %a is a %c; that rules out the second conclusion.",
  },
  {
    st: ["Some %A are %B.", "Some %B are %C."],
    c: ["Some %A are %C.", "No %a is a %c."],
    v: 4,
    why: "Two particular statements prove nothing, but the two conclusions form a complementary pair, so either one or the other must hold.",
  },
  {
    st: ["All %A are %B.", "All %A are %C."],
    c: ["Some %C are %B.", "Some %B are %C."],
    v: 2,
    why: "Every %a is both a %b and a %c, so the %A themselves are the overlap and both conclusions follow.",
  },
  {
    st: ["No %a is a %b.", "Some %B are %C."],
    c: ["Some %C are not %A.", "All %C are %A."],
    v: 0,
    why: "The %C that are %B cannot be %A, so some %C are not %A, which also rules out the second conclusion.",
  },
  {
    st: ["All %A are %B.", "Some %C are %A."],
    c: ["Some %C are %B.", "Some %B are %C."],
    v: 2,
    why: "The %C that are %A are also %B, so both conclusions follow by conversion.",
  },
  {
    st: ["Some %A are not %B.", "All %C are %B."],
    c: ["Some %A are not %C.", "All %A are %C."],
    v: 0,
    why: "The %A outside %B must also be outside %C because every %c is a %b.",
  },
];

add(
  "reason:syllogism:two",
  "Syllogism",
  "Moderate",
  [SYL.length, NOUNS.length, 11, 11],
  ([si, ni, o1, o2]) => {
    const s = SYL[si as number] as Syl;
    const i0 = ni as number;
    const i1 = (i0 + 1 + (o1 as number)) % NOUNS.length;
    const i2 = (i0 + 1 + (o2 as number)) % NOUNS.length;
    if (i2 === i0 || i1 === i0 || i1 === i2) return null;
    const n = [NOUNS[i0], NOUNS[i1], NOUNS[i2]] as { s: string; p: string }[];
    const put = (t: string) =>
      t
        .replace(/%A/g, n[0]!.p)
        .replace(/%B/g, n[1]!.p)
        .replace(/%C/g, n[2]!.p)
        .replace(/%a/g, n[0]!.s)
        .replace(/%b/g, n[1]!.s)
        .replace(/%c/g, n[2]!.s);
    const opts = textOptions(VERDICTS[s.v] as string, VERDICTS, (si as number) + (ni as number));
    if (!opts) return null;
    return {
      prompt:
        `Statements:\nI. ${put(s.st[0])}\nII. ${put(s.st[1])}\n` +
        `Conclusions:\nI. ${put(s.c[0])}\nII. ${put(s.c[1])}\n` +
        `Which of the conclusions logically follows?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: put(s.why),
    };
  },
);

const SYL_HARD: Syl[] = [
  {
    st: ["Only a few %A are %B.", "All %B are %C."],
    c: ["Some %A are %C.", "All %A are %C."],
    v: 0,
    why: "Only a few %A are %B means some are and some are not, so the %A that are %B are %C, but not all %A need be %C.",
  },
  {
    st: ["All %A are %B.", "No %b is a %c."],
    c: ["Some %C are not %A.", "No %c is an %a."],
    v: 2,
    why: "No %b is a %c and every %a is a %b, so no %c is an %a, which also makes the first conclusion true.",
  },
  {
    st: ["Some %A are %B.", "No %b is a %c."],
    c: ["Some %A are not %C.", "All %A are %C."],
    v: 0,
    why: "The %A that are %B cannot be %C, so some %A are definitely not %C.",
  },
  {
    st: ["No %a is a %b.", "No %b is a %c."],
    c: ["No %a is a %c.", "Some %A are %C."],
    v: 3,
    why: "Two universal negatives give no definite link between %A and %C, so neither conclusion is certain.",
  },
  {
    st: ["All %A are %B.", "All %C are %B."],
    c: ["Some %A are %C.", "No %a is a %c."],
    v: 4,
    why: "Both groups sit inside %B but may or may not overlap; the conclusions are a complementary pair, so either one holds.",
  },
  {
    st: ["Some %A are %B.", "All %A are %C."],
    c: ["Some %B are %C.", "All %B are %C."],
    v: 0,
    why: "The %A that are %B are also %C, so some %B are %C, but nothing forces every %b to be a %c.",
  },
];

add(
  "reason:syllogism:two:adv",
  "Syllogism",
  "Difficult",
  [SYL_HARD.length, NOUNS.length, 11, 11],
  ([si, ni, o1, o2]) => {
    const s = SYL_HARD[si as number] as Syl;
    const i0 = ni as number;
    const i1 = (i0 + 1 + (o1 as number)) % NOUNS.length;
    const i2 = (i0 + 1 + (o2 as number)) % NOUNS.length;
    if (i2 === i0 || i1 === i0 || i1 === i2) return null;
    const n = [NOUNS[i0], NOUNS[i1], NOUNS[i2]] as { s: string; p: string }[];
    const put = (t: string) =>
      t
        .replace(/%A/g, n[0]!.p)
        .replace(/%B/g, n[1]!.p)
        .replace(/%C/g, n[2]!.p)
        .replace(/%a/g, n[0]!.s)
        .replace(/%b/g, n[1]!.s)
        .replace(/%c/g, n[2]!.s);
    const opts = textOptions(
      VERDICTS[s.v] as string,
      VERDICTS,
      (si as number) + (ni as number) * 2,
    );
    if (!opts) return null;
    return {
      prompt:
        `Statements:\nI. ${put(s.st[0])}\nII. ${put(s.st[1])}\n` +
        `Conclusions:\nI. ${put(s.c[0])}\nII. ${put(s.c[1])}\n` +
        `Which of the conclusions logically follows?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: put(s.why),
    };
  },
);

/* ================================================ coded inequality ======= */

type Rel = "gt" | "ge" | "eq" | "le" | "lt" | "un";
const OPS: { sym: string; rel: Rel }[] = [
  { sym: ">", rel: "gt" },
  { sym: "≥", rel: "ge" },
  { sym: "=", rel: "eq" },
  { sym: "≤", rel: "le" },
  { sym: "<", rel: "lt" },
];

function combine(rels: Rel[]): Rel {
  const up = new Set(["gt", "ge", "eq"]);
  const down = new Set(["lt", "le", "eq"]);
  if (rels.every((r) => up.has(r))) {
    if (rels.includes("gt")) return "gt";
    if (rels.includes("ge")) return "ge";
    return "eq";
  }
  if (rels.every((r) => down.has(r))) {
    if (rels.includes("lt")) return "lt";
    if (rels.includes("le")) return "le";
    return "eq";
  }
  return "un";
}

function holds(derived: Rel, claim: Rel): boolean {
  if (derived === "un") return false;
  if (claim === "gt") return derived === "gt";
  if (claim === "lt") return derived === "lt";
  if (claim === "eq") return derived === "eq";
  if (claim === "ge") return derived === "gt" || derived === "ge" || derived === "eq";
  if (claim === "le") return derived === "lt" || derived === "le" || derived === "eq";
  return false;
}

const CLAIM_SYM: Record<string, string> = { gt: ">", ge: "≥", eq: "=", le: "≤", lt: "<" };
const REL_WORD: Record<Rel, string> = {
  gt: "is definitely greater than",
  ge: "is greater than or equal to",
  eq: "is equal to",
  le: "is less than or equal to",
  lt: "is definitely less than",
  un: "cannot be compared with",
};

const INEQ_VERDICTS = [
  "Only conclusion I is true",
  "Only conclusion II is true",
  "Both conclusions are true",
  "Neither conclusion is true",
  "Either conclusion I or conclusion II is true",
];

function inequalityBuilder(varCount: number, difficulty: Difficulty) {
  const opCount = varCount - 1;
  const opSpace = Math.pow(OPS.length, opCount);
  const pairs: [number, number][] = [];
  for (let i = 0; i < varCount; i += 1) {
    for (let j = i + 1; j < varCount; j += 1) pairs.push([i, j]);
  }
  const claimShapes: [Rel, Rel][] = [
    ["gt", "eq"],
    ["lt", "eq"],
    ["ge", "lt"],
    ["le", "gt"],
    ["gt", "ge"],
    ["eq", "le"],
  ];
  const sizes = [opSpace, pairs.length, pairs.length, claimShapes.length, 2];
  const build = ([oi, p1, p2, cs, flip]: number[]) => {
    const letters = "PQRSTUVW".slice(0, varCount).split("");
    const ops: { sym: string; rel: Rel }[] = [];
    let rest = oi as number;
    for (let k = 0; k < opCount; k += 1) {
      ops.push(OPS[rest % OPS.length] as (typeof OPS)[number]);
      rest = Math.floor(rest / OPS.length);
    }
    // Keep the statement readable: never two equals in a row.
    for (let k = 1; k < ops.length; k += 1) {
      if (ops[k]!.rel === "eq" && ops[k - 1]!.rel === "eq") return null;
    }
    const statement = letters.map((l, k) => (k === 0 ? l : `${ops[k - 1]!.sym} ${l}`)).join(" ");
    const derive = (a: number, b: number): Rel => {
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      const seg = ops.slice(lo, hi).map((o) => o.rel);
      const r = combine(seg);
      if (a <= b) return r;
      if (r === "gt") return "lt";
      if (r === "ge") return "le";
      if (r === "lt") return "gt";
      if (r === "le") return "ge";
      return r;
    };
    const shape = claimShapes[cs as number] as [Rel, Rel];
    const [a1, b1] = pairs[p1 as number] as [number, number];
    const [a2, b2] = pairs[p2 as number] as [number, number];
    const c1 = {
      a: (flip as number) === 1 ? b1 : a1,
      b: (flip as number) === 1 ? a1 : b1,
      rel: shape[0],
    };
    const c2 = { a: a2, b: b2, rel: shape[1] };
    const d1 = derive(c1.a, c1.b);
    const d2 = derive(c2.a, c2.b);
    const t1 = holds(d1, c1.rel);
    const t2 = holds(d2, c2.rel);
    const samePair = c1.a === c2.a && c1.b === c2.b;
    const complementary =
      samePair &&
      !t1 &&
      !t2 &&
      ((d1 === "ge" &&
        ((c1.rel === "gt" && c2.rel === "eq") || (c1.rel === "eq" && c2.rel === "gt"))) ||
        (d1 === "le" &&
          ((c1.rel === "lt" && c2.rel === "eq") || (c1.rel === "eq" && c2.rel === "lt"))));
    let verdict: string;
    if (complementary) verdict = INEQ_VERDICTS[4] as string;
    else if (t1 && t2) verdict = INEQ_VERDICTS[2] as string;
    else if (t1) verdict = INEQ_VERDICTS[0] as string;
    else if (t2) verdict = INEQ_VERDICTS[1] as string;
    else verdict = INEQ_VERDICTS[3] as string;
    const show = (c: { a: number; b: number; rel: Rel }) =>
      `${letters[c.a]} ${CLAIM_SYM[c.rel]} ${letters[c.b]}`;
    const opts = textOptions(verdict, INEQ_VERDICTS, (oi as number) + (cs as number));
    if (!opts) return null;
    const clause1 = `${letters[c1.a]} ${REL_WORD[d1]} ${letters[c1.b]}`;
    const clause2 = `${letters[c2.a]} ${REL_WORD[d2]} ${letters[c2.b]}`;
    const why = complementary
      ? `Combining the links gives ${clause1}, so neither conclusion is true on its own, but together they cover every possibility, hence either one of them holds.`
      : samePair
        ? `Combining the links of the statement gives ${clause1}, and that settles both conclusions.`
        : `Combining the links of the statement gives ${clause1}, and ${clause2}.`;
    return {
      prompt:
        `In the following statement the symbols have their usual meanings.\n` +
        `Statement: ${statement}\nConclusions:\nI. ${show(c1)}\nII. ${show(c2)}\n` +
        `Which of the conclusions is or are true?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: why,
    };
  };
  return { sizes, build, difficulty };
}

{
  const m = inequalityBuilder(4, "Moderate");
  add("reason:ineq:four", "Coded Inequality", "Moderate", m.sizes, m.build);
  const h = inequalityBuilder(5, "Difficult");
  add("reason:ineq:five", "Coded Inequality", "Difficult", h.sizes, h.build);
}

/* ========================================================== analogy ====== */

const NUM_RULES: { label: string; f: (n: number) => number; why: string }[] = [
  { label: "square", f: (n) => n * n, why: "each number is replaced by its square" },
  { label: "cube", f: (n) => n * n * n, why: "each number is replaced by its cube" },
  { label: "n squared plus n", f: (n) => n * n + n, why: "each number n becomes n squared plus n" },
  {
    label: "n cubed minus n",
    f: (n) => n * n * n - n,
    why: "each number n becomes n cubed minus n",
  },
  {
    label: "next square",
    f: (n) => (n + 1) * (n + 1),
    why: "each number n becomes the square of n plus one",
  },
  {
    label: "n squared minus one",
    f: (n) => n * n - 1,
    why: "each number n becomes n squared minus one",
  },
  {
    label: "double plus three",
    f: (n) => 2 * n + 3,
    why: "each number n becomes twice n plus three",
  },
];

add("reason:analogy:number", "Analogy", "Moderate", [NUM_RULES.length, 14, 14], ([ri, ai, bi]) => {
  const rule = NUM_RULES[ri as number] as (typeof NUM_RULES)[number];
  const a = 3 + (ai as number);
  const b = 4 + (bi as number);
  if (a === b) return null;
  const answer = rule.f(b);
  const opts = numericOptions(answer, [rule.f(b + 1), rule.f(b - 1), b * b, answer + b], (v) =>
    fmtNum(v, 0),
  );
  return {
    prompt: `${a} : ${rule.f(a)} :: ${b} : ?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `In the given pair ${rule.why}, so the missing term is ${fmtNum(answer, 0)}.`,
  };
});

function shift(letter: string, by: number): string {
  const i = ALPHA.indexOf(letter);
  return ALPHA[(i + by + 26 * 4) % 26] as string;
}

add("reason:analogy:letter", "Analogy", "Moderate", [24, 24, 7], ([ai, bi, si]) => {
  const step = (si as number) + 1;
  const a = ALPHA[ai as number] as string;
  const b = ALPHA[((ai as number) + 1) % 26] as string;
  const c = ALPHA[bi as number] as string;
  const d = ALPHA[((bi as number) + 1) % 26] as string;
  if (a === c) return null;
  const ans = `${shift(c, step)}${shift(d, step)}`;
  const pool = [1, 2, 3, 4, 5, 6, 7, 8].map((k) => `${shift(c, k)}${shift(d, k)}`);
  const opts = textOptions(ans, pool, (ai as number) + (si as number));
  if (!opts) return null;
  return {
    prompt: `${a}${b} : ${shift(a, step)}${shift(b, step)} :: ${c}${d} : ?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `Each letter of the first group moves ${step} place${step === 1 ? "" : "s"} forward, so ${c}${d} becomes ${ans}.`,
  };
});

add("reason:analogy:number:adv", "Analogy", "Difficult", [10, 12, 12], ([ri, ai, bi]) => {
  const a = 4 + (ai as number);
  const b = 5 + (bi as number);
  if (a === b) return null;
  const rules: { f: (n: number) => number; why: string }[] = [
    { f: (n) => n * n * n + n * n, why: "n cubed plus n squared" },
    { f: (n) => (n * (n + 1)) / 2, why: "the sum of the first n natural numbers" },
    { f: (n) => n * n - n + 1, why: "n squared minus n plus one" },
    { f: (n) => 2 * n * n - 1, why: "twice n squared minus one" },
    { f: (n) => n * (n + 2), why: "n multiplied by n plus two" },
    { f: (n) => n * n * n - n * n, why: "n cubed minus n squared" },
    { f: (n) => (n + 2) * (n - 1), why: "n plus two multiplied by n minus one" },
    { f: (n) => 3 * n * n + 1, why: "three times n squared plus one" },
    { f: (n) => n * n * n + 1, why: "n cubed plus one" },
    { f: (n) => n * n + 2 * n + 1, why: "the square of n plus one" },
  ];
  const rule = rules[ri as number] as (typeof rules)[number];
  const answer = rule.f(b);
  if (!Number.isInteger(answer)) return null;
  const opts = numericOptions(answer, [rule.f(b + 1), rule.f(b - 1), b * b * b, answer - b], (v) =>
    fmtNum(v, 0),
  );
  return {
    prompt: `${a} : ${rule.f(a)} :: ${b} : ?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `The rule is ${rule.why}, so for ${b} the term is ${fmtNum(answer, 0)}.`,
  };
});

/* =================================================== classification ====== */

add(
  "reason:odd:number",
  "Classification and Odd One Out",
  "Moderate",
  [6, 10, 6],
  ([ri, base, off]) => {
    const b = 2 + (base as number);
    let family: number[];
    let oddOne: number;
    let why: string;
    switch (ri as number) {
      case 0:
        family = [b * b, (b + 1) * (b + 1), (b + 2) * (b + 2)];
        oddOne = (b + 3) * (b + 3) + 1 + (off as number);
        why = "all the other numbers are perfect squares";
        break;
      case 1:
        family = [b * b * b, (b + 1) * (b + 1) * (b + 1), (b + 2) * (b + 2) * (b + 2)];
        oddOne = (b + 3) * (b + 3) * (b + 3) + 2 + (off as number);
        why = "all the other numbers are perfect cubes";
        break;
      case 2: {
        const m = 7;
        family = [m * (b + 1), m * (b + 3), m * (b + 5)];
        oddOne = m * (b + 7) + 1 + (off as number);
        why = "all the other numbers are multiples of 7";
        break;
      }
      case 3: {
        const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61];
        family = [
          primes[base as number] as number,
          primes[((base as number) + 3) % 14] as number,
          primes[((base as number) + 6) % 14] as number,
        ];
        oddOne = (primes[((base as number) + 9) % 14] as number) + 1 + 2 * (off as number);
        why = "all the other numbers are prime numbers";
        break;
      }
      case 4: {
        const m = 9;
        family = [m * (b + 2), m * (b + 4), m * (b + 6)];
        oddOne = m * (b + 8) + 3 + (off as number);
        why = "all the other numbers are multiples of 9";
        break;
      }
      default:
        family = [b * (b + 1), (b + 1) * (b + 2), (b + 2) * (b + 3)];
        oddOne = (b + 3) * (b + 4) + 1 + (off as number);
        why = "every other number is the product of two consecutive integers";
    }
    if (family.includes(oddOne)) return null;
    const all = [...family, oddOne];
    if (new Set(all).size !== 4) return null;
    return {
      prompt: `Which one of the following does not belong to the group?\n${all.map((v) => String(v)).join(", ")}`,
      answer: String(oddOne),
      distractors: family.map((v) => String(v)),
      explanation: `${oddOne} is the odd one out because ${why}.`,
    };
  },
);

add(
  "reason:odd:letter",
  "Classification and Odd One Out",
  "Moderate",
  [20, 5, 4],
  ([ai, gi, oi]) => {
    const gap = (gi as number) + 1;
    const start = ai as number;
    const grp = (s: number) =>
      `${ALPHA[s % 26]}${ALPHA[(s + gap) % 26]}${ALPHA[(s + 2 * gap) % 26]}`;
    const family = [grp(start), grp((start + 5) % 26), grp((start + 11) % 26)];
    const badGap = gap + 1 + (oi as number);
    const odd = `${ALPHA[(start + 17) % 26]}${ALPHA[(start + 17 + badGap) % 26]}${ALPHA[(start + 17 + 2 * badGap) % 26]}`;
    if (family.includes(odd)) return null;
    return {
      prompt: `Which one of the following letter groups is different from the rest?\n${[...family, odd].join(", ")}`,
      answer: odd,
      distractors: family,
      explanation: `In every other group the letters move forward by ${gap} place${gap === 1 ? "" : "s"}, but in ${odd} the step is ${badGap}.`,
    };
  },
);

/* ===================================================== venn and sets ===== */

add(
  "reason:venn:two",
  "Venn Diagram and Set Theory",
  "Moderate",
  [12, 10, 8, 6],
  ([ti, ai, bi, oi]) => {
    const total = 60 + (ti as number) * 5;
    const a = 25 + (ai as number) * 2;
    const b = 20 + (bi as number) * 2;
    const both = 8 + (oi as number);
    if (both > Math.min(a, b)) return null;
    const union = a + b - both;
    if (union > total) return null;
    const neither = total - union;
    const opts = numericOptions(neither, [total - a - b, union, a - both, b - both], (v) =>
      fmtNum(v, 0),
    );
    return {
      prompt:
        `In a class of ${total} students, ${a} play cricket and ${b} play football. ` +
        `If ${both} students play both games, how many students play neither game?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `Students playing at least one game = ${a} + ${b} - ${both} = ${union}. ` +
        `So students playing neither = ${total} - ${union} = ${neither}.`,
    };
  },
);

add(
  "reason:venn:three",
  "Venn Diagram and Set Theory",
  "Difficult",
  [8, 6, 6, 6, 5],
  ([ti, ai, bi, ci, oi]) => {
    const abc = 5 + (oi as number);
    const ab = abc + 4 + (ai as number);
    const bc = abc + 3 + (bi as number);
    const ca = abc + 5 + (ci as number);
    const a = ab + ca - abc + 12 + (ti as number);
    const b = ab + bc - abc + 10 + (ti as number);
    const c = bc + ca - abc + 14 + (ti as number);
    const union = a + b + c - ab - bc - ca + abc;
    const exactlyOne = a + b + c - 2 * (ab + bc + ca) + 3 * abc;
    if (exactlyOne <= 0) return null;
    const opts = numericOptions(
      exactlyOne,
      [union, a + b + c - ab - bc - ca, exactlyOne + abc, union - abc],
      (v) => fmtNum(v, 0),
    );
    return {
      prompt:
        `In a survey, ${a} people read newspaper A, ${b} read B and ${c} read C. ` +
        `${ab} read both A and B, ${bc} read both B and C, ${ca} read both C and A, and ${abc} read all three. ` +
        `How many people read exactly one newspaper?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `Exactly one = (a + b + c) - 2(ab + bc + ca) + 3(abc) = ` +
        `(${a} + ${b} + ${c}) - 2(${ab} + ${bc} + ${ca}) + 3 x ${abc} = ${exactlyOne}.`,
    };
  },
);

/* ===================================================== cube and dice ===== */

add("reason:cube:painted", "Cube and Dice", "Moderate", [7, 4], ([ni, qi]) => {
  const n = 3 + (ni as number);
  const q = qi as number;
  const inner = n - 2;
  const values = [8, 12 * inner, 6 * inner * inner, inner * inner * inner];
  const labels = [
    "have exactly three faces painted",
    "have exactly two faces painted",
    "have exactly one face painted",
    "have no face painted",
  ];
  const answer = values[q] as number;
  const opts = numericOptions(
    answer,
    values.filter((_, i) => i !== q),
    (v) => fmtNum(v, 0),
  );
  const formulas = [
    "the eight corner cubes always have three painted faces",
    `the edge cubes number 12 x (n - 2) = 12 x ${inner} = ${12 * inner}`,
    `the face cubes number 6 x (n - 2) squared = 6 x ${inner * inner} = ${6 * inner * inner}`,
    `the hidden core is (n - 2) cubed = ${inner * inner * inner}`,
  ];
  return {
    prompt:
      `A cube of edge ${n} cm is painted on all its faces and then cut into ` +
      `1 cm cubes. How many of the small cubes ${labels[q]}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `For a cube cut into ${n * n * n} unit cubes, ${formulas[q]}.`,
  };
});

add("reason:cube:cuboid", "Cube and Dice", "Difficult", [5, 5, 5, 4], ([x, y, z, qi]) => {
  const a = 3 + (x as number);
  const b = 4 + (y as number);
  const c = 5 + (z as number);
  const q = qi as number;
  const ia = a - 2;
  const ib = b - 2;
  const ic = c - 2;
  const values = [8, 4 * (ia + ib + ic), 2 * (ia * ib + ib * ic + ic * ia), ia * ib * ic];
  const labels = [
    "have exactly three faces painted",
    "have exactly two faces painted",
    "have exactly one face painted",
    "have no face painted",
  ];
  const answer = values[q] as number;
  const opts = numericOptions(
    answer,
    values.filter((_, i) => i !== q),
    (v) => fmtNum(v, 0),
  );
  return {
    prompt:
      `A cuboid measuring ${a} cm x ${b} cm x ${c} cm is painted on all faces and cut ` +
      `into 1 cm cubes. How many of the small cubes ${labels[q]}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `With inner dimensions ${ia} x ${ib} x ${ic}: corners = 8, edges = 4(${ia} + ${ib} + ${ic}) = ${4 * (ia + ib + ic)}, ` +
      `faces = 2(${ia}x${ib} + ${ib}x${ic} + ${ic}x${ia}) = ${2 * (ia * ib + ib * ic + ic * ia)}, ` +
      `unpainted = ${ia} x ${ib} x ${ic} = ${ia * ib * ic}.`,
  };
});

add("reason:dice:opposite", "Cube and Dice", "Moderate", [6, 5], ([fi, oi]) => {
  const faces = [1, 2, 3, 4, 5, 6];
  const target = faces[fi as number] as number;
  const opposite = 7 - target;
  const adjacent = faces.filter((f) => f !== target && f !== opposite);
  const shown = adjacent.slice(0, 4);
  const rotated = [...shown.slice((oi as number) % 4), ...shown.slice(0, (oi as number) % 4)];
  const opts = numericOptions(opposite, adjacent, (v) => fmtNum(v, 0));
  return {
    prompt:
      `A standard dice is numbered 1 to 6. The numbers ${rotated.join(", ")} are all ` +
      `adjacent to the face showing ${target}. Which number is on the face opposite ${target}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Four faces are adjacent to ${target} and one is opposite it. The only number left out of ` +
      `${rotated.join(", ")} and ${target} is ${opposite}.`,
  };
});

/* ================================================ missing number ========= */

add(
  "reason:matrix:missing",
  "Missing Number and Number Puzzles",
  "Moderate",
  [6, 8, 8, 8],
  ([ri, a1, a2, a3]) => {
    const rules: { f: (a: number, b: number) => number; why: string }[] = [
      { f: (a, b) => a * b - (a + b), why: "the product of the first two numbers minus their sum" },
      {
        f: (a, b) => a * b + a - b,
        why: "the product of the first two numbers plus the first minus the second",
      },
      { f: (a, b) => (a + b) * 2, why: "twice the sum of the first two numbers" },
      { f: (a, b) => a * a - b, why: "the square of the first number minus the second" },
      { f: (a, b) => a * b + a + b, why: "the product of the first two numbers plus their sum" },
      { f: (a, b) => (a + b) * (a - b), why: "the difference of the squares of the two numbers" },
    ];
    const rule = rules[ri as number] as (typeof rules)[number];
    const rows: number[][] = [
      [3 + (a1 as number), 4 + (a1 as number)],
      [5 + (a2 as number), 2 + (a2 as number)],
      [6 + (a3 as number), 3 + (a3 as number)],
    ];
    const outs = rows.map((r) => rule.f(r[0] as number, r[1] as number));
    const answer = outs[2] as number;
    if (outs.some((v) => !Number.isFinite(v))) return null;
    const opts = numericOptions(
      answer,
      [answer + 2, answer - 2, (rows[2]![0] as number) * (rows[2]![1] as number), answer + 5],
      (v) => fmtNum(v, 0),
    );
    return {
      prompt:
        `Find the missing number.\n` +
        `${rows[0]![0]}  ${rows[0]![1]}  ${outs[0]}\n` +
        `${rows[1]![0]}  ${rows[1]![1]}  ${outs[1]}\n` +
        `${rows[2]![0]}  ${rows[2]![1]}  ?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `In each row the third number is ${rule.why}, so the missing number is ${fmtNum(answer, 0)}.`,
    };
  },
);

/* ================================================= counting figures ====== */

add("reason:figures:count", "Counting Figures", "Moderate", [7, 2], ([ni, qi]) => {
  const n = 2 + (ni as number);
  const squares = (n * (n + 1) * (2 * n + 1)) / 6;
  const rects = ((n * (n + 1)) / 2) * ((n * (n + 1)) / 2);
  const isSquare = (qi as number) === 0;
  const answer = isSquare ? squares : rects;
  const opts = numericOptions(answer, [n * n, squares, rects, answer + n], (v) => fmtNum(v, 0));
  return {
    prompt:
      `A square grid is divided into ${n} x ${n} equal small squares. ` +
      `How many ${isSquare ? "squares" : "rectangles"} of all sizes are there in the figure?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: isSquare
      ? `The number of squares is the sum of the squares up to ${n}, that is ` +
        `${Array.from({ length: n }, (_, k) => `${k + 1} x ${k + 1}`).join(" + ")} = ${squares}.`
      : `The number of rectangles is the square of 1 + 2 + ... + ${n}, that is ${(n * (n + 1)) / 2} x ${(n * (n + 1)) / 2} = ${rects}.`,
  };
});

/* ================================================ seating and puzzles === */

const PEOPLE = [
  "Amit",
  "Bela",
  "Chetan",
  "Divya",
  "Esha",
  "Farhan",
  "Gagan",
  "Harpreet",
  "Isha",
  "Jatin",
  "Kiran",
  "Lalit",
];
const ORD = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];

function permute<T>(items: T[], index: number): T[] {
  const pool = [...items];
  const out: T[] = [];
  let rest = index;
  for (let n = pool.length; n > 0; n -= 1) {
    const k = rest % n;
    rest = Math.floor(rest / n);
    out.push(pool.splice(k, 1)[0] as T);
  }
  return out;
}

function rotate<T>(list: T[], by: number): T[] {
  const k = ((by % list.length) + list.length) % list.length;
  return [...list.slice(k), ...list.slice(0, k)];
}

/* linear seating */

add("reason:seating:linear", "Seating Arrangement", "Moderate", [720, 12, 4], ([pi, off, qi]) => {
  const names = Array.from(
    { length: 6 },
    (_, i) => PEOPLE[((off as number) + i) % PEOPLE.length] as string,
  );
  const order = permute(names, pi as number);
  const clues: string[] = [`${order[0]} sits at the extreme left end of the row.`];
  for (let i = 1; i < 6; i += 1) {
    const ref = i % 2 === 1 ? i - 1 : i - 2;
    const gap = i - ref;
    clues.push(
      gap === 1
        ? `${order[i]} sits immediately to the right of ${order[ref]}.`
        : `${order[i]} sits ${ORD[gap - 1]} to the right of ${order[ref]}.`,
    );
  }
  const shown = rotate(clues, ((pi as number) % 5) + 1);
  const head =
    `Six friends sit in a row facing north.\n` + shown.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const seatLine = order.join(", ");
  const q = qi as number;
  if (q === 3) {
    const who = order[3] as string;
    const opts = textOptions(
      "Fourth",
      ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"],
      (pi as number) + (off as number),
    );
    if (!opts) return null;
    return {
      prompt: `${head}\nWhat is the position of ${who} from the left end?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `From the left the order is ${seatLine}, so ${who} is fourth from the left.`,
    };
  }
  if (q === 2) {
    const opts = numericOptions(2, [1, 3, 4, 0], (v) => fmtNum(v, 0));
    return {
      prompt: `${head}\nHow many persons sit between ${order[1]} and ${order[4]}?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `From the left the order is ${seatLine}. Between ${order[1]} and ${order[4]} sit ${order[2]} and ${order[3]}, that is 2 persons.`,
    };
  }
  const answer = q === 0 ? (order[5] as string) : (order[1] as string);
  const opts = textOptions(answer, order as string[], (pi as number) + (qi as number));
  if (!opts) return null;
  return {
    prompt:
      q === 0
        ? `${head}\nWho sits at the extreme right end of the row?`
        : `${head}\nWho sits third to the left of ${order[4]}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      q === 0
        ? `From the left the order is ${seatLine}, so ${order[5]} is at the extreme right end.`
        : `From the left the order is ${seatLine}. Three places to the left of ${order[4]} is ${order[1]}.`,
  };
});

/* circular seating */

add(
  "reason:seating:circular",
  "Seating Arrangement",
  "Difficult",
  [40320, 4, 3],
  ([pi, off, qi]) => {
    const names = Array.from(
      { length: 8 },
      (_, i) => PEOPLE[((off as number) * 2 + i) % PEOPLE.length] as string,
    );
    const order = permute(names, pi as number); // clockwise order
    const clues: string[] = [`${order[0]} sits exactly opposite ${order[4]}.`];
    for (let i = 1; i < 8; i += 1) {
      if (i === 4) continue;
      const ref = i % 2 === 1 ? i - 1 : i - 2;
      const gap = i - ref;
      clues.push(`${order[i]} is the ${ORD[gap - 1]} person clockwise from ${order[ref]}.`);
    }
    const shown = rotate(clues, ((pi as number) % 5) + 1);
    const head =
      `Eight friends sit around a circular table facing the centre. Because they face the centre, ` +
      `the person to someone's left is the next person in the clockwise direction.\n` +
      shown.map((c, i) => `${i + 1}. ${c}`).join("\n");
    const ring = order.join(", ");
    const q = qi as number;
    if (q === 2) {
      const opts = numericOptions(2, [1, 3, 4, 5], (v) => fmtNum(v, 0));
      return {
        prompt: `${head}\nHow many persons sit between ${order[1]} and ${order[4]} when counted clockwise from ${order[1]}?`,
        answer: opts.answer,
        distractors: opts.distractors,
        explanation: `Clockwise the order is ${ring}. Between ${order[1]} and ${order[4]} lie ${order[2]} and ${order[3]}, that is 2 persons.`,
      };
    }
    const answer = q === 0 ? (order[6] as string) : (order[5] as string);
    const opts = textOptions(answer, order as string[], (pi as number) + (qi as number));
    if (!opts) return null;
    return {
      prompt:
        q === 0
          ? `${head}\nWho sits exactly opposite ${order[2]}?`
          : `${head}\nWho is second to the left of ${order[3]}?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        q === 0
          ? `Clockwise the order is ${ring}. The person four seats away from ${order[2]} is ${order[6]}.`
          : `Clockwise the order is ${ring}. Left means clockwise here, so two places to the left of ${order[3]} is ${order[5]}.`,
    };
  },
);

/* floor puzzle */

add(
  "reason:puzzle:floor",
  "Puzzles and Arrangements",
  "Difficult",
  [5040, 8, 4],
  ([pi, off, qi]) => {
    const names = Array.from(
      { length: 7 },
      (_, i) => PEOPLE[((off as number) + i) % PEOPLE.length] as string,
    );
    const order = permute(names, pi as number); // index 0 = floor 1 (lowest)
    const clues: string[] = [`${order[0]} lives on the lowest floor.`];
    for (let i = 1; i < 7; i += 1) {
      const ref = i % 2 === 1 ? i - 1 : i - 2;
      const gap = i - ref;
      clues.push(
        gap === 1
          ? `${order[i]} lives immediately above ${order[ref]}.`
          : `There is exactly one floor between ${order[ref]} and ${order[i]}, and ${order[i]} lives above ${order[ref]}.`,
      );
    }
    const shown = rotate(clues, ((pi as number) % 5) + 1);
    const head =
      `Seven people live in a seven storey building. The lowest floor is numbered 1 and the topmost floor is numbered 7.\n` +
      shown.map((c, i) => `${i + 1}. ${c}`).join("\n");
    const list = order.map((n, i) => `floor ${i + 1}: ${n}`).join(", ");
    const q = qi as number;
    if (q === 0) {
      const opts = textOptions(order[6] as string, order as string[], pi as number);
      if (!opts) return null;
      return {
        prompt: `${head}\nWho lives on the topmost floor?`,
        answer: opts.answer,
        distractors: opts.distractors,
        explanation: `The arrangement is ${list}, so ${order[6]} lives on floor 7.`,
      };
    }
    if (q === 1) {
      const opts = textOptions(order[3] as string, order as string[], (pi as number) + 2);
      if (!opts) return null;
      return {
        prompt: `${head}\nWho lives on floor 4?`,
        answer: opts.answer,
        distractors: opts.distractors,
        explanation: `The arrangement is ${list}, so floor 4 belongs to ${order[3]}.`,
      };
    }
    if (q === 2) {
      const opts = numericOptions(3, [2, 4, 1, 5], (v) => fmtNum(v, 0));
      return {
        prompt: `${head}\nHow many people live between ${order[1]} and ${order[5]}?`,
        answer: opts.answer,
        distractors: opts.distractors,
        explanation: `The arrangement is ${list}. Between them live ${order[2]}, ${order[3]} and ${order[4]}, that is 3 people.`,
      };
    }
    const opts = numericOptions(5, [4, 6, 3, 7], (v) => fmtNum(v, 0));
    return {
      prompt: `${head}\nOn which floor does ${order[4]} live?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `The arrangement is ${list}, so ${order[4]} lives on floor 5.`,
    };
  },
);

/* ==================================================== input and output == */

add(
  "reason:input-output",
  "Input and Output",
  "Difficult",
  [10, 10, 10, 10, 3],
  ([a, b, c, d, qi]) => {
    const words = [
      "apple",
      "mango",
      "tiger",
      "river",
      "cloud",
      "stone",
      "field",
      "grape",
      "north",
      "quiet",
    ];
    const nums = [
      17 + (a as number),
      42 + (b as number) * 2,
      8 + (c as number),
      65 + (d as number) * 3,
      29 + (a as number) * 2,
    ];
    const tokens: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      tokens.push(String(nums[i]));
      tokens.push(words[((a as number) + i * 2) % words.length] as string);
    }
    const input = tokens.join(" ");
    // Rule: in every step the largest remaining number moves to the left end,
    // so the numbers finish in ascending order from the left.
    const steps: string[] = [];
    let work = [...tokens];
    const remaining = [...nums].sort((x, y) => y - x);
    for (const n of remaining) {
      work = [String(n), ...work.filter((t) => t !== String(n))];
      steps.push(work.join(" "));
    }
    const q = qi as number;
    if (q === 2) {
      const answer = steps.length;
      const opts = numericOptions(answer, [answer - 1, answer + 1, answer + 2, answer - 2], (v) =>
        fmtNum(v, 0),
      );
      return {
        prompt:
          `A machine rearranges a line of words and numbers. In every step the largest remaining ` +
          `number is shifted to the extreme left and the rest keep their order.\n` +
          `Input: ${input}\nHow many steps are needed to complete the arrangement?`,
        answer: opts.answer,
        distractors: opts.distractors,
        explanation:
          `There are ${remaining.length} numbers, and one number is shifted in each step, ` +
          `so the arrangement is complete in ${answer} steps. The last step is: ${steps[steps.length - 1]}`,
      };
    }
    const want = q === 0 ? 1 : 2;
    const answer = steps[want] as string;
    const pool = steps.filter((s2) => s2 !== answer).concat(input);
    const opts = textOptions(answer, pool, (a as number) + (qi as number));
    if (!opts) return null;
    return {
      prompt:
        `A machine rearranges a line of words and numbers. In every step the largest remaining ` +
        `number is shifted to the extreme left and the rest keep their order.\n` +
        `Input: ${input}\nWhich of the following is step ${want + 1} of the arrangement?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `Step 1: ${steps[0]}\nStep 2: ${steps[1]}\nSo step ${want + 1} is ${answer}.`,
    };
  },
);

/* =============================================== alphanumeric series ==== */

add("reason:alphanumeric", "Alphanumeric Series", "Moderate", [12, 12, 3], ([si, ti, qi]) => {
  const symbols = ["#", "@", "$", "%", "&", "*"];
  const seqTokens: string[] = [];
  for (let i = 0; i < 15; i += 1) {
    const kind = ((si as number) + i * 5 + (ti as number)) % 3;
    if (kind === 0) seqTokens.push(String(((si as number) + i * 3) % 10));
    else if (kind === 1) seqTokens.push(ALPHA[((ti as number) + i * 7) % 26] as string);
    else seqTokens.push(symbols[((si as number) + i) % symbols.length] as string);
  }
  const isNum = (t: string) => /^[0-9]$/.test(t);
  const isLet = (t: string) => /^[A-Z]$/.test(t);
  const isSym = (t: string) => !isNum(t) && !isLet(t);
  const q = qi as number;
  const hits: string[] = [];
  let answer = 0;
  let label = "";
  if (q === 0) {
    label = "symbols are immediately preceded by a number";
    for (let i = 1; i < seqTokens.length; i += 1) {
      if (isSym(seqTokens[i] as string) && isNum(seqTokens[i - 1] as string)) {
        answer += 1;
        hits.push(`${seqTokens[i - 1]}${seqTokens[i]}`);
      }
    }
  } else if (q === 1) {
    label = "letters are immediately followed by a symbol";
    for (let i = 0; i < seqTokens.length - 1; i += 1) {
      if (isLet(seqTokens[i] as string) && isSym(seqTokens[i + 1] as string)) {
        answer += 1;
        hits.push(`${seqTokens[i]}${seqTokens[i + 1]}`);
      }
    }
  } else {
    label = "numbers are immediately preceded by a letter and immediately followed by a symbol";
    for (let i = 1; i < seqTokens.length - 1; i += 1) {
      if (
        isNum(seqTokens[i] as string) &&
        isLet(seqTokens[i - 1] as string) &&
        isSym(seqTokens[i + 1] as string)
      ) {
        answer += 1;
        hits.push(`${seqTokens[i - 1]}${seqTokens[i]}${seqTokens[i + 1]}`);
      }
    }
  }
  const opts = numericOptions(
    answer,
    [answer + 1, answer + 2, Math.max(0, answer - 1), answer + 3],
    (v) => fmtNum(v, 0),
  );
  return {
    prompt: `Study the following series and answer the question.\n${seqTokens.join(" ")}\nHow many ${label}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Scanning the series from left to right, the groups that satisfy the condition are ${hits.join(", ") || "none"}, ` +
      `so the required count is ${answer}.`,
  };
});

/* ================================================= word and letters ===== */

const WORDS = [
  "DISTRIBUTION",
  "PERFORMANCE",
  "GOVERNMENT",
  "KNOWLEDGE",
  "BACKGROUND",
  "TRANSPORTS",
  "MAGNITUDES",
  "CHALLENGES",
  "PRODUCTIVE",
  "FRAMEWORKS",
];

add(
  "reason:word:position",
  "Word and Letter Arrangement",
  "Moderate",
  [WORDS.length, 5, 5, 2],
  ([wi, li, ri, qi]) => {
    const word = WORDS[wi as number] as string;
    const n = word.length;
    const fromRight = 4 + (ri as number);
    const toLeft = 1 + (li as number);
    if (fromRight > n) return null;
    const posFromLeft = n - fromRight + 1;
    const target = posFromLeft - toLeft;
    if (target < 1) return null;
    const q = qi as number;
    if (q === 0) {
      const answer = word[target - 1] as string;
      const opts = textOptions(answer, word.split(""), (wi as number) + (li as number));
      if (!opts) return null;
      return {
        prompt:
          (toLeft === 1
            ? `Which letter is immediately to the left of the ${ORD[fromRight - 1]} letter from the `
            : `Which letter is the ${ORD[toLeft - 1]} letter to the left of the ${ORD[fromRight - 1]} letter from the `) +
          `right end of the word ${word}?`,
        answer: opts.answer,
        distractors: opts.distractors,
        explanation:
          `${word} has ${n} letters. The ${ORD[fromRight - 1]} letter from the right is at position ${posFromLeft} ` +
          `from the left. Counting ${toLeft} place${toLeft === 1 ? "" : "s"} further left gives position ${target}, the letter ${answer}.`,
      };
    }
    const sorted = word.split("").sort();
    let same = 0;
    for (let i = 0; i < n; i += 1) if (sorted[i] === word[i]) same += 1;
    const opts = numericOptions(same, [same + 1, same + 2, Math.max(0, same - 1), same + 3], (v) =>
      fmtNum(v, 0),
    );
    return {
      prompt:
        `If the letters of the word ${word} are arranged in alphabetical order from left to right, ` +
        `how many letters remain in the same position as before?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `Alphabetically the word becomes ${sorted.join("")}. Comparing position by position, ${same} letter${same === 1 ? "" : "s"} stay in place.`,
    };
  },
);

/* ==================================================== mirror images ===== */

add("reason:mirror:string", "Mirror and Water Images", "Moderate", [12, 12, 12], ([a, b, c]) => {
  const chars = [
    ALPHA[((a as number) * 2) % 26] as string,
    String((b as number) % 10),
    ALPHA[((b as number) * 3 + 5) % 26] as string,
    String((c as number) % 10),
    ALPHA[((c as number) * 5 + 9) % 26] as string,
  ];
  const original = chars.join("");
  const answer = [...chars].reverse().join("");
  const pool = [
    answer,
    original,
    [...chars].reverse().join("").toLowerCase().toUpperCase().split("").join(""),
    chars
      .slice(1)
      .concat(chars[0] as string)
      .reverse()
      .join(""),
    chars
      .slice()
      .reverse()
      .slice(1)
      .concat(chars[0] as string)
      .join(""),
    [chars[4], chars[3], chars[1], chars[2], chars[0]].join(""),
    [chars[1], chars[0], chars[3], chars[2], chars[4]].join(""),
  ];
  const opts = textOptions(answer, pool, (a as number) + (b as number));
  if (!opts) return null;
  return {
    prompt: `A mirror is placed vertically to the right of the group ${original}. What is its mirror image?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `A vertical mirror on the right reverses the order of the characters, so ${original} appears as ${answer}.`,
  };
});

add("reason:mirror:symmetry", "Mirror and Water Images", "Difficult", [26, 6], ([li, oi]) => {
  const symmetric = "AHIMOTUVWXY".split("");
  const asymmetric = ALPHA.split("").filter((l) => !symmetric.includes(l));
  const answer = symmetric[(li as number) % symmetric.length] as string;
  const pool = asymmetric;
  const opts = textOptions(answer, pool, (li as number) + (oi as number));
  if (!opts) return null;
  return {
    prompt:
      `A mirror is placed vertically beside a capital letter. Which of the following letters ` +
      `looks exactly the same in the mirror?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `The capital letters A, H, I, M, O, T, U, V, W, X and Y are symmetric about a vertical axis, ` +
      `so ${answer} is unchanged in a vertical mirror while the others are not.`,
  };
});

/* ========================================== logical sequence of words === */

const SEQUENCES: { items: string[]; why: string }[] = [
  {
    items: ["Seed", "Plant", "Flower", "Fruit", "Ripe fruit"],
    why: "a plant grows from a seed, bears flowers and then fruit, which finally ripens",
  },
  {
    items: ["Infant", "Child", "Adolescent", "Adult", "Old"],
    why: "this is the natural order of human life stages",
  },
  {
    items: ["Word", "Phrase", "Sentence", "Paragraph", "Chapter"],
    why: "each unit of writing is built from the one before it",
  },
  {
    items: ["Cotton", "Yarn", "Cloth", "Garment", "Shop"],
    why: "cotton is spun into yarn, woven into cloth, stitched into a garment and then sold",
  },
  {
    items: ["Application", "Interview", "Selection", "Appointment", "Salary"],
    why: "this is the order in which a job is obtained and paid for",
  },
  {
    items: ["Disease", "Diagnosis", "Prescription", "Medicine", "Recovery"],
    why: "illness is first identified, then treated and finally cured",
  },
  {
    items: ["Foundation", "Walls", "Roof", "Paint", "House warming"],
    why: "a house is built from the foundation upwards and occupied last",
  },
  {
    items: ["Study", "Examination", "Result", "Degree", "Job"],
    why: "this is the natural academic and professional order",
  },
  {
    items: ["Soil", "Sowing", "Irrigation", "Harvest", "Market"],
    why: "a crop moves from field preparation to sale in this order",
  },
  {
    items: ["Crime", "Arrest", "Trial", "Judgement", "Punishment"],
    why: "this is the legal order in which a criminal case proceeds",
  },
  {
    items: ["Gram", "Kilogram", "Quintal", "Tonne", "Kilotonne"],
    why: "the units rise in order of magnitude",
  },
  {
    items: ["Second", "Minute", "Hour", "Day", "Week"],
    why: "the units of time rise in order of length",
  },
];

add(
  "reason:sequence:words",
  "Logical Sequence of Words",
  "Moderate",
  [SEQUENCES.length, 6, 4],
  ([si, pi, oi]) => {
    const spec = SEQUENCES[si as number] as (typeof SEQUENCES)[number];
    const n = spec.items.length;
    const shuffled = permute(
      spec.items.map((w, i) => ({ w, i })),
      (pi as number) * 37 + 11,
    );
    const listing = shuffled.map((x, i) => `${i + 1}. ${x.w}`).join("   ");
    const correct = spec.items.map((w) => shuffled.findIndex((x) => x.w === w) + 1).join(", ");
    const pool: string[] = [correct];
    for (let k = 1; k <= 6; k += 1) {
      const rotated = permute(
        spec.items.map((w) => shuffled.findIndex((x) => x.w === w) + 1),
        k * 13 + (oi as number) * 5,
      ).join(", ");
      if (!pool.includes(rotated)) pool.push(rotated);
    }
    const opts = textOptions(correct, pool, (si as number) + (oi as number));
    if (!opts) return null;
    return {
      prompt: `Arrange the following words in a meaningful logical order and choose the correct sequence.\n${listing}`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `The meaningful order is ${spec.items.join(" - ")}, because ${spec.why}. ` +
        `In terms of the given numbers that is ${correct}.`,
    };
  },
);

/* ======================================== statement based reasoning ===== */

function lit(id: string, topic: string, difficulty: Difficulty, items: Built[]) {
  templates.push(
    literalTemplate({ id, subject: "Reasoning", topic, difficulty, exams: EX, items }),
  );
}

const FOLLOW4 = [
  "Only conclusion I follows",
  "Only conclusion II follows",
  "Both I and II follow",
  "Neither I nor II follows",
];

function concl(statement: string, c1: string, c2: string, correct: number, why: string): Built {
  const answer = FOLLOW4[correct] as string;
  return {
    prompt: `Statement: ${statement}\nConclusions:\nI. ${c1}\nII. ${c2}\nWhich of the conclusions follows from the statement?`,
    answer,
    distractors: FOLLOW4.filter((v) => v !== answer),
    explanation: why,
  };
}

lit("reason:stmt:conclusion", "Statement and Conclusion", "Moderate", [
  concl(
    "The school has decided that students who remain absent for more than ten days without leave will not be allowed to sit in the annual examination.",
    "Attendance is treated as a condition for appearing in the examination.",
    "No student of the school ever remains absent.",
    0,
    "The statement links attendance to examination eligibility, so the first conclusion is a restatement of the rule; the second is an extreme claim the statement does not support.",
  ),
  concl(
    "The government has raised the minimum support price of wheat for the coming season.",
    "The government wants to encourage wheat cultivation.",
    "Farmers will now stop growing every other crop.",
    0,
    "A higher support price is an incentive to grow the crop, so the first conclusion follows; the second is an exaggeration.",
  ),
  concl(
    "Due to heavy rain, the district administration has declared a holiday in all schools tomorrow.",
    "The safety of students is a concern for the administration.",
    "It will rain heavily tomorrow as well.",
    0,
    "Declaring a holiday for rain shows concern for safety; a forecast for the next day cannot be drawn from the statement.",
  ),
  concl(
    "The bank has introduced an online account opening facility to reduce crowding at branches.",
    "Some customers are able to use online services.",
    "All branch counters will now be closed.",
    0,
    "The facility is meant to be used, so some customers must be able to use it; closing all counters is nowhere implied.",
  ),
  concl(
    "The state has made helmets compulsory for two wheeler riders and pillion riders alike.",
    "Head injuries are a significant cause of harm in two wheeler accidents.",
    "Accidents will now stop completely in the state.",
    0,
    "The rule targets head protection, which implies head injuries matter; stopping all accidents is not a possible conclusion.",
  ),
  concl(
    "The company has announced that all employees must complete a cyber security course within three months.",
    "The company considers cyber security important for its work.",
    "No employee of the company knows anything about cyber security.",
    0,
    "A compulsory course shows the subject is considered important; total ignorance of every employee is an unwarranted extreme.",
  ),
  concl(
    "The examination board has advanced the date sheet of the board examination by two weeks.",
    "The syllabus will be completed earlier than usual this year.",
    "The board has some reason for advancing the schedule.",
    1,
    "Any change of schedule is made for some reason, so the second conclusion follows; the first depends on facts the statement does not give.",
  ),
  concl(
    "The municipal corporation has fined a factory for releasing untreated waste into the river.",
    "Releasing untreated waste into the river is against the rules.",
    "The factory will now shift to another city.",
    0,
    "A fine implies a rule has been broken; the factory's future plans are not indicated.",
  ),
  concl(
    "The library will remain open till midnight during the examination month.",
    "Students are expected to study late during the examination month.",
    "The library remains closed for the rest of the year.",
    0,
    "Extended hours in the examination month point to late study; nothing suggests the library is shut otherwise.",
  ),
  concl(
    "The train fare has been increased by ten per cent from the first of next month.",
    "Passengers will have to pay more from next month.",
    "The number of passengers will fall to zero.",
    0,
    "A fare rise directly means higher payment; a fall to zero passengers is absurd.",
  ),
  concl(
    "The university has reserved thirty seats in each course for students from rural areas.",
    "Rural students were finding it difficult to get admission earlier.",
    "Urban students will not get admission in the university.",
    0,
    "A reservation is created to address a difficulty, which supports the first conclusion; the remaining seats are still open to others.",
  ),
  concl(
    "The hospital has set up a separate counter for senior citizens.",
    "Senior citizens find standing in a long queue difficult.",
    "Senior citizens are the only patients in the hospital.",
    0,
    "A separate counter is a convenience measure for a group that finds queuing hard; the second conclusion contradicts common sense.",
  ),
  concl(
    "The state transport undertaking has decided to replace all diesel buses with electric buses in five years.",
    "Electric buses are considered better than diesel buses by the undertaking.",
    "No diesel bus will run in the state after five years.",
    0,
    "The decision shows a preference for electric buses; private diesel buses may still run, so the second conclusion is too wide.",
  ),
  concl(
    "A notice in the office says that the lift is out of order and will be repaired by evening.",
    "People will have to use the stairs during the day.",
    "The lift has never worked properly.",
    0,
    "If the lift is out of order the alternative is the stairs; the notice says nothing about its past record.",
  ),
]);

const ASSUME4 = [
  "Only assumption I is implicit",
  "Only assumption II is implicit",
  "Both I and II are implicit",
  "Neither I nor II is implicit",
];

function assume(statement: string, a1: string, a2: string, correct: number, why: string): Built {
  const answer = ASSUME4[correct] as string;
  return {
    prompt: `Statement: ${statement}\nAssumptions:\nI. ${a1}\nII. ${a2}\nWhich of the assumptions is implicit in the statement?`,
    answer,
    distractors: ASSUME4.filter((v) => v !== answer),
    explanation: why,
  };
}

lit("reason:stmt:assumption", "Statement and Assumption", "Difficult", [
  assume(
    "An advertisement reads: Buy our water purifier and stay free of waterborne disease.",
    "People are concerned about the quality of their drinking water.",
    "The purifier is able to remove the causes of waterborne disease.",
    2,
    "The advertisement can only work if buyers care about water quality and if the product does what is claimed, so both assumptions are implicit.",
  ),
  assume(
    "A circular from the principal asks all teachers to submit the term marks on the school portal by Friday.",
    "The teachers have access to the school portal.",
    "The teachers will refuse to submit the marks.",
    0,
    "The instruction presumes access to the portal; expecting refusal would defeat the purpose of the circular.",
  ),
  assume(
    "The state government has announced free bus travel for women in state buses.",
    "A sizeable number of women travel by state buses.",
    "The state has the resources to bear the cost.",
    2,
    "The scheme is worth announcing only if women use the buses, and any subsidy presumes the ability to fund it.",
  ),
  assume(
    "A bank has sent a message asking customers to update their identity documents within a month.",
    "The customers will read the message.",
    "Identity documents of some customers are out of date.",
    2,
    "A message is sent in the belief that it will be read, and the request itself presumes that some records need updating.",
  ),
  assume(
    "The newspaper has advised readers to avoid the main road tomorrow because of a procession.",
    "There are other roads available to the readers.",
    "Nobody will use the main road tomorrow.",
    0,
    "Advice to avoid a road presumes an alternative exists; the newspaper cannot assume total compliance.",
  ),
  assume(
    "A coaching centre claims that ninety per cent of its students clear the entrance test.",
    "Students choose a coaching centre partly on the basis of its results.",
    "No student can clear the test without coaching.",
    0,
    "The claim is made because results influence choice; the second assumption is far stronger than anything the claim needs.",
  ),
  assume(
    "The railway has introduced an extra coach on a popular route during the festival season.",
    "The demand for seats rises during the festival season.",
    "The existing coaches were always empty.",
    0,
    "An extra coach presumes higher demand, which contradicts the second assumption.",
  ),
  assume(
    "A company has decided to allow employees to work from home for two days a week.",
    "The work of the company can be done away from the office for some days.",
    "Employees will stop coming to the office altogether.",
    0,
    "The decision presumes some work is location independent; a two day allowance rules out the second assumption.",
  ),
  assume(
    "A notice says that the swimming pool will remain closed for maintenance for a week.",
    "The pool needs maintenance from time to time.",
    "Members will be informed by the notice.",
    2,
    "Both the need for maintenance and the expectation that members read the notice are presumed by the announcement.",
  ),
  assume(
    "The municipal body has decided to install street lights on all lanes of the colony.",
    "Some lanes of the colony are presently unlit.",
    "Street lights improve safety at night.",
    2,
    "The decision presumes both a present gap in lighting and a benefit from filling it.",
  ),
  assume(
    "A school has started an evening remedial class for weak students.",
    "Some students of the school need extra help.",
    "Evening is a suitable time for the students to attend.",
    2,
    "The class is created for students who need help and is scheduled at a time they can attend.",
  ),
  assume(
    "An airline has announced a discount of thirty per cent on tickets booked ninety days in advance.",
    "Some travellers are able to plan their journeys well in advance.",
    "The airline will run at a loss because of the discount.",
    0,
    "The scheme presumes advance planners exist; no airline announces a scheme presuming a loss.",
  ),
  assume(
    "The health department has asked people to use mosquito nets during the monsoon.",
    "Mosquito borne illness rises during the monsoon.",
    "Mosquito nets are available to the people.",
    2,
    "The advisory presumes both the seasonal risk and the practical availability of nets.",
  ),
  assume(
    "A university has made an aptitude test compulsory for admission to its management course.",
    "An aptitude test can help judge suitability for the course.",
    "Marks in the qualifying examination alone are not a complete measure.",
    2,
    "Introducing the test presumes it adds information that the qualifying marks do not already give.",
  ),
]);

const ARG4 = [
  "Only argument I is strong",
  "Only argument II is strong",
  "Both I and II are strong",
  "Neither I nor II is strong",
];

function argue(statement: string, a1: string, a2: string, correct: number, why: string): Built {
  const answer = ARG4[correct] as string;
  return {
    prompt: `Statement: ${statement}\nArguments:\nI. ${a1}\nII. ${a2}\nWhich of the arguments is strong?`,
    answer,
    distractors: ARG4.filter((v) => v !== answer),
    explanation: why,
  };
}

lit("reason:stmt:argument", "Statement and Argument", "Difficult", [
  argue(
    "Should public examinations be conducted entirely online in India?",
    "Yes, online conduct reduces paper leakage and speeds up the declaration of results.",
    "No, because online is a foreign idea.",
    0,
    "The first argument gives a concrete administrative benefit; the second is a prejudice, not a reason.",
  ),
  argue(
    "Should the use of single use plastic be banned completely?",
    "Yes, single use plastic chokes drains and takes centuries to decompose.",
    "No, some small businesses will need time and support to switch to alternatives.",
    2,
    "Both arguments raise real and relevant considerations, one environmental and one about a just transition.",
  ),
  argue(
    "Should school students be given homework every day?",
    "Yes, regular practice strengthens what is taught in class.",
    "No, because teachers dislike checking notebooks.",
    0,
    "The first is a sound educational reason; the second is a trivial convenience argument.",
  ),
  argue(
    "Should the minimum age for a driving licence be raised to twenty years?",
    "Yes, accident data show that very young drivers are involved in a high share of road accidents.",
    "No, then nobody will learn to drive at all.",
    0,
    "The first cites evidence; the second is an absurd exaggeration.",
  ),
  argue(
    "Should government offices adopt a five day working week?",
    "Yes, it saves electricity and transport costs and improves employee well being.",
    "Yes, because private companies also do so.",
    0,
    "The first gives measurable benefits; merely copying the private sector is not by itself a strong reason.",
  ),
  argue(
    "Should coaching institutes be regulated by law?",
    "Yes, regulation can curb misleading advertisements and unfair fee practices.",
    "No, students should be free to choose any institute they like.",
    0,
    "Regulation and free choice are not opposed, so the second argument misses the point while the first addresses a real harm.",
  ),
  argue(
    "Should voting be made compulsory in India?",
    "Yes, a higher turnout gives the elected body a wider mandate.",
    "No, compulsion is difficult to enforce across a very large and mobile electorate.",
    2,
    "Both arguments are relevant, one about legitimacy and one about practical enforcement.",
  ),
  argue(
    "Should mobile phones be allowed in school classrooms?",
    "No, phones distract students and disturb the class.",
    "Yes, because phones are costly.",
    0,
    "The first addresses classroom learning; the price of a phone has nothing to do with the question.",
  ),
  argue(
    "Should India invest heavily in solar energy?",
    "Yes, India has high solar insolation for most of the year and needs to cut fuel imports.",
    "No, because solar panels are made of glass.",
    0,
    "The first states a genuine resource and strategic advantage; the second is irrelevant.",
  ),
  argue(
    "Should sports be made a compulsory subject in schools?",
    "Yes, physical activity improves health and concentration among students.",
    "No, it will reduce the time available for academic subjects.",
    2,
    "Both arguments weigh real costs and benefits and deserve consideration.",
  ),
  argue(
    "Should the railways run more trains at night on busy routes?",
    "Yes, it uses the track capacity that lies idle at night and eases day time congestion.",
    "No, passengers sleep at night.",
    0,
    "The first is an operational argument; the second ignores that overnight travel is common and convenient.",
  ),
  argue(
    "Should agricultural income above a high threshold be taxed?",
    "Yes, it would widen the tax base and reduce the misuse of the exemption by very large earners.",
    "No, all farmers are poor.",
    0,
    "The first addresses a specific misuse; the second is a sweeping generalisation that is factually wrong.",
  ),
]);

const ACTION4 = [
  "Only course of action I follows",
  "Only course of action II follows",
  "Both I and II follow",
  "Neither I nor II follows",
];

function action(statement: string, a1: string, a2: string, correct: number, why: string): Built {
  const answer = ACTION4[correct] as string;
  return {
    prompt: `Statement: ${statement}\nCourses of action:\nI. ${a1}\nII. ${a2}\nWhich course of action logically follows?`,
    answer,
    distractors: ACTION4.filter((v) => v !== answer),
    explanation: why,
  };
}

lit("reason:stmt:action", "Statement and Course of Action", "Difficult", [
  action(
    "A large number of students failed in mathematics in the recent board examination of a school.",
    "The school should arrange remedial classes and diagnose where the students are weak.",
    "The school should stop teaching mathematics.",
    0,
    "A remedial response addresses the cause; dropping the subject is not a solution.",
  ),
  action(
    "Several cases of food poisoning have been reported from a hostel mess.",
    "The mess should be inspected and the kitchen practices corrected at once.",
    "The hostel should be shut down permanently.",
    0,
    "Inspection and correction is proportionate; permanent closure is excessive.",
  ),
  action(
    "The number of road accidents at a particular crossing has risen sharply this year.",
    "A traffic signal and speed breakers should be installed at the crossing.",
    "The crossing should be closed to all traffic forever.",
    0,
    "Engineering measures address the problem; closing a public crossing permanently is disproportionate.",
  ),
  action(
    "Many rural households in a district still do not have a bank account.",
    "Banking correspondents should be deployed and account opening camps organised in those villages.",
    "The district should be denied all government schemes.",
    0,
    "Outreach solves the gap; denying schemes punishes the very people affected.",
  ),
  action(
    "A city is facing an acute shortage of drinking water in summer.",
    "Rainwater harvesting should be made compulsory in new buildings.",
    "The supply pipeline leaks should be identified and repaired.",
    2,
    "Both actions attack the shortage, one by adding supply and one by cutting losses.",
  ),
  action(
    "Fake job advertisements are circulating on social media in the name of a government department.",
    "The department should publish an official notice listing its genuine recruitment channels.",
    "The department should stop recruiting altogether.",
    0,
    "A clarification protects applicants; stopping recruitment harms the department and the candidates.",
  ),
  action(
    "The air quality in a city has fallen to the severe category for several days.",
    "Construction dust and waste burning should be strictly curbed and monitored.",
    "Schools should be advised to limit outdoor activity while the levels stay severe.",
    2,
    "One action reduces the source and the other reduces exposure, so both follow.",
  ),
  action(
    "A number of students of a college were found using unfair means in the internal test.",
    "The college should cancel the tests of those found guilty and hold a re-test under supervision.",
    "The college should expel every student of the college.",
    0,
    "Action must be against those found guilty, not against the whole student body.",
  ),
  action(
    "The state has recorded a steep rise in dengue cases after the monsoon.",
    "Fogging and source reduction drives should be carried out in the affected wards.",
    "People should be told to check for stagnant water in and around their homes every week.",
    2,
    "Both public action and household action are standard and necessary steps against dengue.",
  ),
  action(
    "Many first year students of a university are unable to follow lectures delivered in English.",
    "Bridge courses in academic English should be offered in the first semester.",
    "The university should refuse admission to such students in future.",
    0,
    "A bridge course addresses the gap; refusing admission avoids the responsibility rather than meeting it.",
  ),
  action(
    "A government hospital receives far more patients in the outpatient department than it can handle.",
    "Additional doctors should be posted and appointment slots should be staggered through the day.",
    "The hospital should turn away patients after a fixed number.",
    0,
    "Capacity and scheduling fixes address the load; turning away patients defeats the purpose of a public hospital.",
  ),
  action(
    "Farmers in a region are burning crop residue after harvest every year.",
    "Machines for in situ management of residue should be made available on subsidised hire.",
    "Awareness camps should explain the harm of burning and the alternatives available.",
    2,
    "Providing a workable alternative and explaining it are both necessary for the practice to change.",
  ),
]);

const CAUSE5 = [
  "Statement I is the cause and statement II is its effect",
  "Statement II is the cause and statement I is its effect",
  "Both statements are effects of a common cause",
  "Both statements are independent causes",
];

function cause(s1: string, s2: string, correct: number, why: string): Built {
  const answer = CAUSE5[correct] as string;
  return {
    prompt: `Statement I: ${s1}\nStatement II: ${s2}\nRead the two statements and mark the correct relationship.`,
    answer,
    distractors: CAUSE5.filter((v) => v !== answer),
    explanation: why,
  };
}

lit("reason:stmt:cause", "Cause and Effect", "Difficult", [
  cause(
    "The state government has raised the price of diesel sold in the state.",
    "The fares of state transport buses have been revised upwards this month.",
    0,
    "Fuel is a major input cost for bus operations, so the fuel price rise is the cause and the fare revision the effect.",
  ),
  cause(
    "The number of students appearing for the state teacher eligibility test has doubled this year.",
    "The state announced a large recruitment drive for teachers a few months ago.",
    1,
    "The announcement of vacancies came first and drew more candidates, so statement II is the cause.",
  ),
  cause(
    "Many schools in the district declared a holiday on Tuesday.",
    "The district received unusually heavy rainfall on Monday night and Tuesday morning.",
    1,
    "The rainfall is the cause and the holiday the consequent administrative decision.",
  ),
  cause(
    "Vegetable prices in the city market have risen sharply this week.",
    "Supply trucks from the neighbouring state were held up for several days due to a landslide.",
    1,
    "A supply disruption raises prices, so statement II is the cause of statement I.",
  ),
  cause(
    "The reservoir level of the district dam has fallen below the danger mark.",
    "The district has received less than half of its normal rainfall this season.",
    1,
    "Deficient rainfall causes the reservoir level to fall.",
  ),
  cause(
    "The city recorded its lowest air quality index of the year on Monday.",
    "Several districts around the city reported large scale crop residue burning last week.",
    1,
    "Smoke from residue burning drifts into the city and lowers the air quality.",
  ),
  cause(
    "A large number of people in the town queued outside banks on Saturday.",
    "The bank association had announced a two day strike beginning on Monday.",
    1,
    "The announced strike is the cause; the rush to complete transactions beforehand is the effect.",
  ),
  cause(
    "The university has extended the last date for submission of admission forms.",
    "The university portal remained inaccessible for two days last week.",
    1,
    "The technical failure is the cause and the extension of the date is the remedy, that is the effect.",
  ),
  cause(
    "Sales of air conditioners in the region rose by forty per cent this summer.",
    "The region recorded its highest average summer temperature in a decade.",
    1,
    "The unusually hot summer drove the rise in sales.",
  ),
  cause(
    "The state has reported a sharp rise in the number of dengue patients.",
    "Water stagnated in many localities for weeks after an unusually long monsoon.",
    1,
    "Stagnant water breeds the vector, so it is the cause of the rise in cases.",
  ),
  cause(
    "Many farmers in the district have shifted from paddy to maize this season.",
    "The state announced an assured procurement scheme for maize before the sowing season.",
    1,
    "The assured procurement changed the incentive, so it is the cause of the shift.",
  ),
  cause(
    "Attendance in the evening library of the college has risen steeply.",
    "The college examination schedule was declared last week.",
    1,
    "The approaching examination is the cause of the rise in library attendance.",
  ),
]);

/* ================================================== data sufficiency ==== */

const SUFF4 = [
  "The question can be answered using statement I alone but not statement II alone",
  "The question can be answered using statement II alone but not statement I alone",
  "The question can be answered using both statements together but not either alone",
  "The question cannot be answered even using both statements together",
];

function suff(question: string, s1: string, s2: string, correct: number, why: string): Built {
  const answer = SUFF4[correct] as string;
  return {
    prompt: `Question: ${question}\nStatement I: ${s1}\nStatement II: ${s2}\nWhich statement or statements are sufficient to answer the question?`,
    answer,
    distractors: SUFF4.filter((v) => v !== answer),
    explanation: why,
  };
}

lit("reason:data-sufficiency", "Data Sufficiency", "Difficult", [
  suff(
    "What is the age of the father?",
    "The father is four times as old as his son.",
    "The son is 12 years old.",
    2,
    "The ratio alone or the son's age alone is not enough, but together the father's age is 4 x 12 = 48 years.",
  ),
  suff(
    "In which direction is point B from point A?",
    "Point B is 5 km north of point C.",
    "Point C is 5 km east of point A.",
    2,
    "Each statement fixes only one leg of the path; together B is north east of A.",
  ),
  suff(
    "What is the simple interest earned on a sum in 3 years?",
    "The sum is 20,000 rupees and the rate is 8 per cent per annum.",
    "The sum doubles in 12 years at simple interest.",
    0,
    "Statement I gives principal, rate and time, so the interest is fully determined; statement II gives only the rate indirectly, without the principal.",
  ),
  suff(
    "How many students are there in the class?",
    "The ratio of boys to girls is 3 to 2.",
    "There are 18 more boys than girls.",
    2,
    "The ratio alone gives no number; with a difference of 18 corresponding to one part, each part is 18 and the class has 90 students.",
  ),
  suff(
    "On which day of the week did the meeting take place?",
    "The meeting took place two days after Tuesday.",
    "The meeting took place before Friday of the same week.",
    0,
    "Statement I fixes the day as Thursday; statement II leaves several possibilities open.",
  ),
  suff(
    "What is the speed of the train?",
    "The train crosses a pole in 12 seconds.",
    "The train is 240 metres long.",
    2,
    "Speed needs both distance and time, and together the speed is 240 divided by 12, that is 20 metres per second.",
  ),
  suff(
    "Who among P, Q, R and S is the tallest?",
    "P is taller than Q and R.",
    "S is taller than P.",
    2,
    "Statement I makes P the tallest of three; adding statement II makes S the tallest of all four.",
  ),
  suff(
    "What is the cost price of the article?",
    "The article was sold at a profit of 20 per cent.",
    "The selling price of the article is 960 rupees.",
    2,
    "The percentage alone or the selling price alone is not enough, but together the cost price is 960 divided by 1.2, that is 800 rupees.",
  ),
  suff(
    "How many days will A and B together take to complete the work?",
    "A alone takes 12 days to complete the work.",
    "B is twice as efficient as A.",
    2,
    "Together A does one twelfth and B one sixth in a day, so the work takes 4 days, but neither statement alone gives this.",
  ),
  suff(
    "What is the area of the rectangle?",
    "The perimeter of the rectangle is 40 cm.",
    "The length of the rectangle is 4 cm more than its breadth.",
    2,
    "With the perimeter and the relation between the sides, the sides come out as 12 cm and 8 cm, giving an area of 96 square centimetres.",
  ),
  suff(
    "What is the code for the word LIGHT in a certain language?",
    "In that language MORNING LIGHT is written as fa lo.",
    "In that language BRIGHT MORNING is written as lo ka.",
    2,
    "Comparing the two statements, lo stands for MORNING, so LIGHT must be fa; neither statement alone can establish this.",
  ),
  suff(
    "What is the value of the two digit number?",
    "The sum of its digits is 9.",
    "The number is divisible by 9.",
    3,
    "Every two digit number whose digits add to 9 is divisible by 9, so the second statement adds nothing and many numbers still satisfy both.",
  ),
]);

export const REASONING_FULL_TEMPLATES = templates;
