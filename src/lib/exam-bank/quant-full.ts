/**
 * Quantitative Aptitude — the rest of the syllabus.
 *
 * `quant.ts` already covers arithmetic: percentage, profit and loss, interest,
 * ratio, averages, time and work, speed, mixtures, mensuration and probability.
 * This file adds the algebra, geometry, trigonometry, data interpretation and
 * miscellaneous chapters that SSC, banking, railway, defence and state papers
 * also set, each with a Moderate practice layer and a Difficult exam layer.
 */

import {
  type Difficulty,
  type Template,
  fmtNum,
  gcd,
  numericOptions,
  numericTemplate,
  round,
  textOptions,
} from "./core";
import { APTITUDE_WIDE } from "./two-layer";

const EX = APTITUDE_WIDE;
const templates: Template[] = [];

type Built = { prompt: string; answer: string; distractors: string[]; explanation: string };

function add(
  id: string,
  topic: string,
  difficulty: Difficulty,
  sizes: number[],
  build: (c: number[]) => Built | null,
) {
  templates.push(
    numericTemplate({
      id,
      subject: "Quantitative Aptitude",
      topic,
      difficulty,
      exams: EX,
      sizes,
      build,
    }),
  );
}

const int = (v: number) => fmtNum(v, 0);

/* ========================================================= LCM and HCF == */

function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

add("quant:lcmhcf:basic", "LCM and HCF", "Moderate", [18, 18, 2], ([ai, bi, qi]) => {
  const a = 12 + (ai as number) * 3;
  const b = 18 + (bi as number) * 4;
  if (a === b) return null;
  const h = gcd(a, b);
  const l = lcm(a, b);
  const wantHcf = (qi as number) === 0;
  const answer = wantHcf ? h : l;
  const opts = numericOptions(answer, [wantHcf ? l : h, a, b, answer * 2], int);
  return {
    prompt: `What is the ${wantHcf ? "HCF" : "LCM"} of ${a} and ${b}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: wantHcf
      ? `The highest common factor of ${a} and ${b} is ${h}, since ${a} = ${h} x ${a / h} and ${b} = ${h} x ${b / h}.`
      : `LCM = (product of the numbers) / HCF = (${a} x ${b}) / ${h} = ${l}.`,
  };
});

add("quant:lcmhcf:other", "LCM and HCF", "Difficult", [14, 14, 10], ([hi, ki, mi]) => {
  const h = 4 + (hi as number) * 2;
  const p = 3 + (ki as number);
  const q = p + 1 + (mi as number);
  if (gcd(p, q) !== 1) return null;
  const first = h * p;
  const second = h * q;
  const l = h * p * q;
  const opts = numericOptions(second, [first, l, h, second + h], int);
  return {
    prompt:
      `The HCF and the LCM of two numbers are ${h} and ${l} respectively. ` +
      `If one of the numbers is ${first}, what is the other number?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `For two numbers, HCF x LCM = product of the numbers. ` +
      `So the other number = (${h} x ${l}) / ${first} = ${second}.`,
  };
});

add("quant:lcmhcf:remainder", "LCM and HCF", "Difficult", [10, 10, 8], ([ai, bi, ri]) => {
  const a = 8 + (ai as number);
  const b = 12 + (bi as number);
  const c = 15 + (ri as number);
  const l = lcm(lcm(a, b), c);
  const rem = 3;
  const answer = l + rem;
  const opts = numericOptions(answer, [l, l - rem, answer + l, l * 2 + rem], int);
  return {
    prompt:
      `What is the least number which when divided by ${a}, ${b} and ${c} leaves a remainder of ` +
      `${rem} in each case?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `The least number exactly divisible by ${a}, ${b} and ${c} is their LCM, which is ${l}. ` +
      `Adding the common remainder gives ${l} + ${rem} = ${answer}.`,
  };
});

/* ==================================================== surds and indices = */

add("quant:indices:value", "Surds and Indices", "Moderate", [4, 6, 6, 5], ([bi, mi, ni, pi]) => {
  const base = [2, 3, 5, 7][bi as number] as number;
  const m = 2 + (mi as number);
  const n = 1 + (ni as number);
  const p = 1 + (pi as number);
  const exp = m + n - p;
  if (exp < 0 || exp > 9) return null;
  const answer = Math.pow(base, exp);
  if (answer > 5_000_000) return null;
  const opts = numericOptions(
    answer,
    [Math.pow(base, exp + 1), Math.pow(base, Math.max(0, exp - 1)), base * exp, answer + base],
    int,
  );
  return {
    prompt: `What is the value of (${base} raised to ${m}) x (${base} raised to ${n}) / (${base} raised to ${p})?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Powers of the same base add on multiplication and subtract on division, so the index is ` +
      `${m} + ${n} - ${p} = ${exp}. Hence the value is ${base} raised to ${exp}, that is ${answer}.`,
  };
});

add("quant:indices:root", "Surds and Indices", "Moderate", [12, 12], ([ai, bi]) => {
  const a = 2 + (ai as number);
  const b = 3 + (bi as number);
  const inside = a * a * b * b;
  const answer = a * b;
  const opts = numericOptions(answer, [inside, a + b, a * a * b, answer + a], int);
  return {
    prompt: `What is the value of the square root of ${inside}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `${inside} = ${a * a} x ${b * b} = (${a} x ${b}) squared, so its square root is ${answer}.`,
  };
});

add(
  "quant:indices:equation",
  "Surds and Indices",
  "Difficult",
  [4, 5, 6, 6],
  ([bi, ki, pi, qi]) => {
    const base = [2, 3, 5, 7][bi as number] as number;
    const k = 2 + (ki as number);
    const q = 1 + (qi as number);
    const p = 1 + (pi as number);
    const num = k * q + p;
    const den = k - 1;
    if (num % den !== 0) return null;
    const x = num / den;
    if (x <= 0 || x > 30) return null;
    const opts = numericOptions(x, [x + 1, x - 1, x * 2, k], int);
    return {
      prompt:
        `If ${base} raised to (x + ${p}) equals ${Math.pow(base, k)} raised to (x - ${q}), ` +
        `what is the value of x?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `${Math.pow(base, k)} is ${base} raised to ${k}, so the equation becomes x + ${p} = ${k}(x - ${q}). ` +
        `That gives ${k - 1}x = ${k} x ${q} + ${p} = ${num}, so x = ${x}.`,
    };
  },
);

/* ======================================================== logarithms ==== */

add("quant:log:basic", "Logarithms", "Moderate", [5, 8], ([bi, ni]) => {
  const base = [2, 3, 5, 7, 10][bi as number] as number;
  const n = 2 + (ni as number);
  const value = Math.pow(base, n);
  if (value > 10_000_000) return null;
  const opts = numericOptions(n, [n + 1, n - 1, value, base], int);
  return {
    prompt: `What is the value of log ${value} to the base ${base}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `${value} is ${base} raised to ${n}, and log of a base raised to a power equals that power, so the answer is ${n}.`,
  };
});

add("quant:log:expand", "Logarithms", "Difficult", [8, 6], ([ni, qi]) => {
  const log2 = 0.301;
  const log3 = 0.4771;
  const cases: { label: string; value: number; why: string }[] = [
    { label: "32", value: 5 * log2, why: "32 = 2 raised to 5, so log 32 = 5 log 2" },
    { label: "16", value: 4 * log2, why: "16 = 2 raised to 4, so log 16 = 4 log 2" },
    { label: "27", value: 3 * log3, why: "27 = 3 raised to 3, so log 27 = 3 log 3" },
    { label: "12", value: 2 * log2 + log3, why: "12 = 2 squared x 3, so log 12 = 2 log 2 + log 3" },
    { label: "18", value: log2 + 2 * log3, why: "18 = 2 x 3 squared, so log 18 = log 2 + 2 log 3" },
    { label: "5", value: 1 - log2, why: "5 = 10 / 2, so log 5 = log 10 - log 2 = 1 - log 2" },
    { label: "1.5", value: log3 - log2, why: "1.5 = 3 / 2, so log 1.5 = log 3 - log 2" },
    { label: "24", value: 3 * log2 + log3, why: "24 = 2 cubed x 3, so log 24 = 3 log 2 + log 3" },
  ];
  const c = cases[ni as number] as (typeof cases)[number];
  const answer = round(c.value, 4);
  const opts = numericOptions(
    answer,
    [
      round(answer + 0.0301, 4),
      round(answer - 0.0301, 4),
      round(answer * 2, 4),
      round(1 - answer, 4),
    ],
    (v) => fmtNum(v, 4),
  );
  const _ = qi;
  return {
    prompt: `If log 2 = ${log2} and log 3 = ${log3}, both to the base 10, what is the value of log ${c.label}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `${c.why}, which gives ${fmtNum(answer, 4)}.`,
  };
});

/* ========================================================== algebra ===== */

add("quant:algebra:reciprocal", "Algebra", "Moderate", [10, 2], ([ki, qi]) => {
  const k = 2 + (ki as number);
  const square = k * k - 2;
  const cube = k * k * k - 3 * k;
  const wantSquare = (qi as number) === 0;
  const answer = wantSquare ? square : cube;
  const opts = numericOptions(
    answer,
    [wantSquare ? cube : square, k * k, k * k * k, answer + k],
    int,
  );
  return {
    prompt: `If x + 1/x = ${k}, what is the value of ${wantSquare ? "x squared + 1/x squared" : "x cubed + 1/x cubed"}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: wantSquare
      ? `Squaring both sides, x squared + 1/x squared = ${k} squared - 2 = ${square}.`
      : `Cubing both sides, x cubed + 1/x cubed = ${k} cubed - 3 x ${k} = ${cube}.`,
  };
});

add("quant:algebra:linear", "Algebra", "Moderate", [8, 8, 8], ([ai, bi, ci]) => {
  const a = 2 + (ai as number);
  const b = 3 + (bi as number);
  const x = 2 + (ci as number);
  const y = x + 1 + ((ai as number) % 3);
  const e1 = a * x + b * y;
  const e2 = b * x + a * y;
  if (a === b) return null;
  const opts = numericOptions(x, [y, x + y, y - x, x * 2], int);
  return {
    prompt: `If ${a}x + ${b}y = ${e1} and ${b}x + ${a}y = ${e2}, what is the value of x?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Adding the two equations gives ${a + b}(x + y) = ${e1 + e2}, so x + y = ${x + y}. ` +
      `Subtracting them gives ${a - b}(x - y) = ${e1 - e2}, so x - y = ${x - y}. Solving the pair, x = ${x}.`,
  };
});

add("quant:algebra:identity", "Algebra", "Moderate", [12, 12, 3], ([ai, bi, qi]) => {
  const a = 3 + (ai as number);
  const b = 2 + (bi as number);
  if (a === b) return null;
  const q = qi as number;
  const values = [a * a + b * b, a * a * a + b * b * b, 4 * a * b];
  const labels = [
    `If a + b = ${a + b} and ab = ${a * b}, what is the value of a squared + b squared?`,
    `If a + b = ${a + b} and ab = ${a * b}, what is the value of a cubed + b cubed?`,
    `If a + b = ${a + b} and a - b = ${a - b}, what is the value of (a + b) squared - (a - b) squared?`,
  ];
  const whys = [
    `a squared + b squared = (a + b) squared - 2ab = ${(a + b) * (a + b)} - ${2 * a * b} = ${a * a + b * b}.`,
    `a cubed + b cubed = (a + b) cubed - 3ab(a + b) = ${Math.pow(a + b, 3)} - ${3 * a * b * (a + b)} = ${a * a * a + b * b * b}.`,
    `(a + b) squared - (a - b) squared = 4ab = 4 x ${a} x ${b} = ${4 * a * b}.`,
  ];
  const answer = values[q] as number;
  const opts = numericOptions(answer, values.filter((_, i) => i !== q).concat([a + b, a * b]), int);
  return {
    prompt: labels[q] as string,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: whys[q] as string,
  };
});

add("quant:algebra:quadratic", "Algebra", "Difficult", [12, 12, 3], ([ri, si, qi]) => {
  const r1 = 1 + (ri as number);
  const r2 = 2 + (si as number);
  if (r1 === r2) return null;
  const sum = r1 + r2;
  const prod = r1 * r2;
  const q = qi as number;
  const values = [sum * sum - 2 * prod, sum / prod, Math.pow(sum, 3) - 3 * prod * sum];
  const labels = [
    `If a and b are the roots of the equation x squared - ${sum}x + ${prod} = 0, what is the value of a squared + b squared?`,
    `If a and b are the roots of the equation x squared - ${sum}x + ${prod} = 0, what is the value of 1/a + 1/b?`,
    `If a and b are the roots of the equation x squared - ${sum}x + ${prod} = 0, what is the value of a cubed + b cubed?`,
  ];
  const whys = [
    `Sum of roots = ${sum} and product = ${prod}, so a squared + b squared = ${sum} squared - 2 x ${prod} = ${sum * sum - 2 * prod}.`,
    `1/a + 1/b = (a + b) / ab = ${sum} / ${prod} = ${fmtNum(sum / prod, 4)}.`,
    `a cubed + b cubed = (a + b) cubed - 3ab(a + b) = ${Math.pow(sum, 3)} - 3 x ${prod} x ${sum} = ${Math.pow(sum, 3) - 3 * prod * sum}.`,
  ];
  const answer = values[q] as number;
  const fmt = q === 1 ? (v: number) => fmtNum(v, 4) : int;
  const opts = numericOptions(answer, [sum, prod, answer + sum, answer - prod], fmt);
  return {
    prompt: labels[q] as string,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: whys[q] as string,
  };
});

/* ======================================================= progressions === */

add("quant:ap:term-sum", "Progressions", "Moderate", [12, 10, 12, 2], ([ai, di, ni, qi]) => {
  const a = 2 + (ai as number);
  const d = 2 + (di as number);
  const n = 8 + (ni as number);
  const term = a + (n - 1) * d;
  const sum = (n * (2 * a + (n - 1) * d)) / 2;
  const wantTerm = (qi as number) === 0;
  const answer = wantTerm ? term : sum;
  const opts = numericOptions(
    answer,
    [wantTerm ? sum : term, term + d, sum - term, answer + d],
    int,
  );
  return {
    prompt: wantTerm
      ? `The first term of an arithmetic progression is ${a} and the common difference is ${d}. What is its ${n}th term?`
      : `The first term of an arithmetic progression is ${a} and the common difference is ${d}. What is the sum of its first ${n} terms?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: wantTerm
      ? `The nth term is a + (n - 1)d = ${a} + ${n - 1} x ${d} = ${term}.`
      : `The sum of n terms is n/2 x [2a + (n - 1)d] = ${n}/2 x [${2 * a} + ${(n - 1) * d}] = ${sum}.`,
  };
});

add("quant:gp:term-sum", "Progressions", "Difficult", [10, 3, 7, 2], ([ai, ri, ni, qi]) => {
  const a = 2 + (ai as number);
  const r = 2 + (ri as number);
  const n = 4 + (ni as number);
  const term = a * Math.pow(r, n - 1);
  if (term > 50_000_000) return null;
  const sum = (a * (Math.pow(r, n) - 1)) / (r - 1);
  const wantTerm = (qi as number) === 0;
  const answer = wantTerm ? term : sum;
  const opts = numericOptions(
    answer,
    [wantTerm ? sum : term, term * r, answer + a, answer - a],
    int,
  );
  return {
    prompt: wantTerm
      ? `The first term of a geometric progression is ${a} and the common ratio is ${r}. What is its ${n}th term?`
      : `The first term of a geometric progression is ${a} and the common ratio is ${r}. What is the sum of its first ${n} terms?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: wantTerm
      ? `The nth term of a GP is a r raised to (n - 1) = ${a} x ${r} raised to ${n - 1} = ${term}.`
      : `The sum of n terms is a(r raised to n - 1)/(r - 1) = ${a} x (${Math.pow(r, n)} - 1)/${r - 1} = ${sum}.`,
  };
});

/* ======================================================== chain rule ==== */

add("quant:chain-rule", "Chain Rule", "Moderate", [8, 8, 6, 6], ([m1, d1, h1, m2]) => {
  const men1 = 10 + (m1 as number) * 2;
  const days1 = 12 + (d1 as number) * 2;
  const hours1 = 6 + (h1 as number);
  const men2 = 12 + (m2 as number) * 2;
  const hours2 = hours1 + 2;
  const total = men1 * days1 * hours1;
  const days2 = total / (men2 * hours2);
  if (!Number.isInteger(days2) || days2 <= 0) return null;
  const opts = numericOptions(days2, [days1, days2 + 2, days2 - 2, Math.round(total / men2)], int);
  return {
    prompt:
      `If ${men1} men can complete a piece of work in ${days1} days working ${hours1} hours a day, ` +
      `in how many days can ${men2} men complete the same work working ${hours2} hours a day?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Total man hours needed = ${men1} x ${days1} x ${hours1} = ${total}. ` +
      `With ${men2} men working ${hours2} hours a day, days = ${total} / (${men2} x ${hours2}) = ${days2}.`,
  };
});

add("quant:chain-rule:adv", "Chain Rule", "Difficult", [6, 6, 6, 6], ([p1, d1, u1, p2]) => {
  const pumps1 = 4 + (p1 as number);
  const hours1 = 5 + (d1 as number);
  const tanks1 = 2 + (u1 as number);
  const pumps2 = pumps1 + 2 + (p2 as number);
  const tanks2 = tanks1 + 2;
  const hours2 = (hours1 * pumps1 * tanks2) / (pumps2 * tanks1);
  const rounded = round(hours2, 2);
  if (!Number.isFinite(rounded) || rounded <= 0) return null;
  const opts = numericOptions(
    rounded,
    [hours1, round(rounded + 1, 2), round(rounded - 1, 2), round(rounded * 2, 2)],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt:
      `${pumps1} pumps can fill ${tanks1} tanks in ${hours1} hours. ` +
      `In how many hours can ${pumps2} pumps fill ${tanks2} such tanks?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Hours vary directly with the number of tanks and inversely with the number of pumps, so ` +
      `hours = ${hours1} x (${pumps1}/${pumps2}) x (${tanks2}/${tanks1}) = ${fmtNum(rounded, 2)}.`,
  };
});

/* ===================================================== races and games == */

add("quant:races:chain", "Races and Games", "Difficult", [10, 10, 4], ([ai, bi, di]) => {
  const dist = [100, 200, 500, 1000][di as number] as number;
  const x = 5 + (ai as number) * 2;
  const y = 8 + (bi as number) * 2;
  const beatA = (x * dist) / 100;
  const beatB = (y * dist) / 100;
  const answer = dist - ((dist - beatA) * (dist - beatB)) / dist;
  const rounded = round(answer, 2);
  const opts = numericOptions(
    rounded,
    [beatA + beatB, beatA, beatB, round(rounded + beatA, 2)],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt:
      `In a ${dist} m race A beats B by ${beatA} m, and in a ${dist} m race B beats C by ${beatB} m. ` +
      `By how many metres does A beat C in a ${dist} m race?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `When A runs ${dist} m, B runs ${dist - beatA} m. When B runs ${dist} m, C runs ${dist - beatB} m, ` +
      `so when B runs ${dist - beatA} m, C runs ${fmtNum(((dist - beatA) * (dist - beatB)) / dist, 2)} m. ` +
      `Hence A beats C by ${dist} - ${fmtNum(((dist - beatA) * (dist - beatB)) / dist, 2)} = ${fmtNum(rounded, 2)} m.`,
  };
});

add("quant:races:start", "Races and Games", "Moderate", [10, 8, 4], ([si, ti, di]) => {
  const dist = [100, 200, 400, 500][di as number] as number;
  const beat = 10 + (si as number) * 2;
  const secs = 4 + (ti as number);
  const speedB = beat / secs;
  const timeB = round(dist / speedB, 2);
  const timeA = round(timeB - secs, 2);
  if (timeA <= 0) return null;
  const opts = numericOptions(
    timeA,
    [timeB, round(timeA + secs, 2), round(timeA / 2, 2), secs],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt:
      `In a ${dist} m race A beats B by ${beat} m or by ${secs} seconds. ` +
      `How many seconds does A take to complete the race?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `B covers the last ${beat} m in ${secs} seconds, so B's speed is ${fmtNum(speedB, 2)} m/s and B takes ` +
      `${fmtNum(timeB, 2)} seconds for ${dist} m. A finishes ${secs} seconds earlier, in ${fmtNum(timeA, 2)} seconds.`,
  };
});

/* ========================================================= geometry ===== */

add("quant:geo:triangle", "Geometry", "Moderate", [14, 14, 4], ([ai, bi, qi]) => {
  const a = 35 + (ai as number) * 3;
  const b = 40 + (bi as number) * 2;
  const c = 180 - a - b;
  if (c <= 10 || c >= 150) return null;
  const q = qi as number;
  if (q === 0) {
    const opts = numericOptions(c, [a, b, 180 - a, 180 - b], int);
    return {
      prompt: `Two angles of a triangle measure ${a} degrees and ${b} degrees. What is the third angle?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `The three angles of a triangle add up to 180 degrees, so the third angle is 180 - ${a} - ${b} = ${c} degrees.`,
    };
  }
  if (q === 1) {
    const ext = a + b;
    const opts = numericOptions(ext, [c, 180 - ext, a, b], int);
    return {
      prompt:
        `In a triangle the two interior opposite angles are ${a} degrees and ${b} degrees. ` +
        `What is the measure of the exterior angle at the third vertex?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `An exterior angle equals the sum of the two interior opposite angles, so it is ${a} + ${b} = ${ext} degrees.`,
    };
  }
  if (q === 2) {
    const k = 1 + ((ai as number) % 5);
    const p = 3 * k;
    const base = 4 * k;
    const hyp = 5 * k;
    const opts = numericOptions(hyp, [p + base, base, p, hyp + k], int);
    return {
      prompt:
        `The two perpendicular sides of a right angled triangle are ${p} cm and ${base} cm. ` +
        `What is the length of the hypotenuse?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `By Pythagoras, the hypotenuse squared = ${p} squared + ${base} squared = ${p * p} + ${base * base} = ${hyp * hyp}, ` +
        `so the hypotenuse is ${hyp} cm.`,
    };
  }
  const r1 = 2 + ((ai as number) % 4);
  const r2 = r1 + 1 + ((bi as number) % 3);
  const areaRatio = `${r1 * r1} : ${r2 * r2}`;
  const pool = [
    `${r1} : ${r2}`,
    `${r1 * r1} : ${r2 * r2}`,
    `${r2} : ${r1}`,
    `${r1 * r1 * r1} : ${r2 * r2 * r2}`,
    `${2 * r1} : ${2 * r2}`,
  ];
  const opts = textOptions(areaRatio, pool, (ai as number) + (bi as number));
  if (!opts) return null;
  return {
    prompt:
      `Two triangles are similar and the ratio of their corresponding sides is ${r1} : ${r2}. ` +
      `What is the ratio of their areas?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `In similar figures the ratio of areas is the square of the ratio of corresponding sides, that is ${areaRatio}.`,
  };
});

add("quant:geo:circle", "Geometry", "Difficult", [12, 10, 4], ([ai, bi, qi]) => {
  const q = qi as number;
  if (q === 0) {
    const arcAngle = 40 + (ai as number) * 5;
    const answer = arcAngle / 2;
    if (!Number.isInteger(answer)) return null;
    const opts = numericOptions(answer, [arcAngle, 180 - arcAngle, 90 - answer, arcAngle * 2], int);
    return {
      prompt:
        `An arc of a circle subtends an angle of ${arcAngle} degrees at the centre. ` +
        `What angle does the same arc subtend at a point on the remaining part of the circumference?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `The angle at the centre is twice the angle at any point on the remaining circumference, ` +
        `so the required angle is ${arcAngle} / 2 = ${answer} degrees.`,
    };
  }
  if (q === 1) {
    const one = 60 + (ai as number) * 4;
    const answer = 180 - one;
    const opts = numericOptions(answer, [one, 360 - one, 90 - one / 2, one / 2], int);
    return {
      prompt: `One angle of a cyclic quadrilateral is ${one} degrees. What is the measure of the angle opposite to it?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `Opposite angles of a cyclic quadrilateral are supplementary, so the other angle is 180 - ${one} = ${answer} degrees.`,
    };
  }
  if (q === 2) {
    const r = 3 + ((ai as number) % 6);
    const k = 1 + ((bi as number) % 4);
    const tangent = 4 * k;
    const rr = 3 * k;
    const d = 5 * k;
    const _ = r;
    const opts = numericOptions(tangent, [d, rr, d - rr, tangent + rr], int);
    return {
      prompt:
        `From an external point at a distance of ${d} cm from the centre of a circle of radius ${rr} cm, ` +
        `a tangent is drawn. What is the length of the tangent?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `The tangent, the radius at the point of contact and the line to the centre form a right triangle, ` +
        `so the tangent length is the square root of (${d} squared - ${rr} squared) = the square root of ${d * d - rr * rr} = ${tangent} cm.`,
    };
  }
  const n = 5 + ((ai as number) % 8);
  const wantDiagonals = (bi as number) % 2 === 0;
  const interior = ((n - 2) * 180) / n;
  const diagonals = (n * (n - 3)) / 2;
  const answer = wantDiagonals ? diagonals : round(interior, 2);
  const opts = numericOptions(
    answer,
    wantDiagonals
      ? [n, n * 2, diagonals + n, diagonals - 1]
      : [180 - interior, 360 / n, interior + 10, 180],
    (v) => fmtNum(v, wantDiagonals ? 0 : 2),
  );
  return {
    prompt: wantDiagonals
      ? `How many diagonals does a polygon of ${n} sides have?`
      : `What is the measure of each interior angle of a regular polygon of ${n} sides?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: wantDiagonals
      ? `The number of diagonals is n(n - 3)/2 = ${n} x ${n - 3} / 2 = ${diagonals}.`
      : `The sum of interior angles is (n - 2) x 180 = ${(n - 2) * 180} degrees, so each angle is ${(n - 2) * 180} / ${n} = ${fmtNum(interior, 2)} degrees.`,
  };
});

/* ====================================================== trigonometry ==== */

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [9, 40, 41],
  [12, 35, 37],
  [28, 45, 53],
];

add("quant:trig:ratio", "Trigonometry", "Moderate", [TRIPLES.length, 4], ([ti, qi]) => {
  const [p, b, h] = TRIPLES[ti as number] as [number, number, number];
  const q = qi as number;
  const pairs: { ask: string; num: number; den: number; why: string }[] = [
    { ask: "cos of the angle", num: b, den: h, why: "cosine is base divided by hypotenuse" },
    { ask: "tan of the angle", num: p, den: b, why: "tangent is perpendicular divided by base" },
    {
      ask: "cosec of the angle",
      num: h,
      den: p,
      why: "cosec is hypotenuse divided by perpendicular",
    },
    { ask: "sec of the angle", num: h, den: b, why: "sec is hypotenuse divided by base" },
  ];
  const item = pairs[q] as (typeof pairs)[number];
  const answer = `${item.num}/${item.den}`;
  const pool = [`${p}/${h}`, `${b}/${h}`, `${p}/${b}`, `${b}/${p}`, `${h}/${p}`, `${h}/${b}`];
  const opts = textOptions(answer, pool, (ti as number) + (qi as number));
  if (!opts) return null;
  return {
    prompt: `In a right angled triangle the sine of an acute angle is ${p}/${h}. What is the ${item.ask}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Since sine is ${p}/${h}, the perpendicular is ${p} and the hypotenuse is ${h}, so the base is ` +
      `the square root of (${h} squared - ${p} squared) = ${b}. As ${item.why}, the value is ${answer}.`,
  };
});

add("quant:trig:standard", "Trigonometry", "Moderate", [10], ([qi]) => {
  const items: { ask: string; value: string; why: string }[] = [
    {
      ask: "sin 30 degrees + cos 60 degrees",
      value: "1",
      why: "sin 30 = 1/2 and cos 60 = 1/2, so the sum is 1",
    },
    {
      ask: "sin 90 degrees - cos 0 degrees",
      value: "0",
      why: "both sin 90 and cos 0 are equal to 1",
    },
    {
      ask: "tan 45 degrees + cot 45 degrees",
      value: "2",
      why: "both tan 45 and cot 45 are equal to 1",
    },
    {
      ask: "sec squared 40 degrees - tan squared 40 degrees",
      value: "1",
      why: "sec squared minus tan squared is always 1",
    },
    {
      ask: "sin squared 25 degrees + cos squared 25 degrees",
      value: "1",
      why: "sin squared plus cos squared is always 1",
    },
    {
      ask: "cosec squared 55 degrees - cot squared 55 degrees",
      value: "1",
      why: "cosec squared minus cot squared is always 1",
    },
    {
      ask: "sin 60 degrees / cos 30 degrees",
      value: "1",
      why: "both sin 60 and cos 30 equal the square root of 3 divided by 2",
    },
    {
      ask: "tan 30 degrees x tan 60 degrees",
      value: "1",
      why: "tan 30 is 1 by root 3 and tan 60 is root 3, and their product is 1",
    },
    { ask: "cos 0 degrees + sin 0 degrees", value: "1", why: "cos 0 is 1 and sin 0 is 0" },
    {
      ask: "sin 30 degrees x cosec 30 degrees",
      value: "1",
      why: "cosec is the reciprocal of sine, so the product is 1",
    },
  ];
  const item = items[qi as number] as (typeof items)[number];
  const pool = ["0", "1", "2", "1/2", "3", "-1"];
  const opts = textOptions(item.value, pool, qi as number);
  if (!opts) return null;
  return {
    prompt: `What is the value of ${item.ask}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `Here ${item.why}. Hence the value is ${item.value}.`,
  };
});

add("quant:trig:identity", "Trigonometry", "Difficult", [TRIPLES.length, 3], ([ti, qi]) => {
  const [p, b, h] = TRIPLES[ti as number] as [number, number, number];
  const q = qi as number;
  const sin = p / h;
  const cos = b / h;
  const values = [
    round((sin + cos) / (sin - cos), 4),
    round(sin * cos, 4),
    round((1 + sin) / cos, 4),
  ];
  const labels = [
    `If tan of an angle is ${p}/${b}, what is the value of (sin + cos) / (sin - cos) for that angle?`,
    `If tan of an angle is ${p}/${b}, what is the value of sin multiplied by cos for that angle?`,
    `If tan of an angle is ${p}/${b}, what is the value of (1 + sin) / cos for that angle?`,
  ];
  const whys = [
    `With tan = ${p}/${b}, take perpendicular ${p} and base ${b}, so hypotenuse = ${h}. Then (sin + cos)/(sin - cos) = (${p} + ${b})/(${p} - ${b}) = ${fmtNum(values[0] as number, 4)}.`,
    `With perpendicular ${p}, base ${b} and hypotenuse ${h}, sin x cos = (${p} x ${b}) / ${h * h} = ${fmtNum(values[1] as number, 4)}.`,
    `With perpendicular ${p}, base ${b} and hypotenuse ${h}, (1 + sin)/cos = (${h} + ${p})/${b} = ${fmtNum(values[2] as number, 4)}.`,
  ];
  const answer = values[q] as number;
  if (!Number.isFinite(answer)) return null;
  const opts = numericOptions(
    answer,
    [round(sin, 4), round(cos, 4), round(answer + 1, 4), round(-answer, 4)],
    (v) => fmtNum(v, 4),
  );
  return {
    prompt: labels[q] as string,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: whys[q] as string,
  };
});

/* ================================================== height and distance = */

const ROOT3 = 1.732;

add("quant:height:tower", "Height and Distance", "Moderate", [16, 3], ([di, ai]) => {
  const d = 20 + (di as number) * 5;
  const angle = [30, 45, 60][ai as number] as number;
  const factor = angle === 45 ? 1 : angle === 60 ? ROOT3 : 1 / ROOT3;
  const h = round(d * factor, 2);
  const opts = numericOptions(
    h,
    [d, round(d * ROOT3, 2), round(d / ROOT3, 2), round(h / 2, 2)],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt:
      `The angle of elevation of the top of a tower from a point on the ground ${d} m away from its ` +
      `foot is ${angle} degrees. What is the height of the tower?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `Height = distance x tan ${angle} degrees = ${d} x ${angle === 45 ? "1" : angle === 60 ? "root 3" : "1 by root 3"} = ${fmtNum(h, 2)} m.`,
  };
});

add("quant:height:ladder", "Height and Distance", "Moderate", [14, 2], ([di, ai]) => {
  const foot = 4 + (di as number);
  const angle = [60, 45][ai as number] as number;
  const length = angle === 60 ? round(foot * 2, 2) : round(foot * 1.414, 2);
  const opts = numericOptions(
    length,
    [foot, round(foot * ROOT3, 2), round(length + foot, 2), round(length / 2, 2)],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt:
      `A ladder leaning against a vertical wall makes an angle of ${angle} degrees with the ground, ` +
      `and its foot is ${foot} m away from the wall. What is the length of the ladder?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `The distance from the wall is the base, so length = base / cos ${angle} degrees = ${foot} / ` +
      `${angle === 60 ? "0.5" : "0.7071"} = ${fmtNum(length, 2)} m.`,
  };
});

add("quant:height:two-angles", "Height and Distance", "Difficult", [16], ([di]) => {
  const gap = 20 + (di as number) * 5;
  // From the nearer point the elevation is 60 degrees and from the farther point 30 degrees.
  const h = round((gap * ROOT3) / 2, 2);
  const opts = numericOptions(
    h,
    [gap, round(gap * ROOT3, 2), round(gap / ROOT3, 2), round(h * 2, 2)],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt:
      `The angle of elevation of the top of a tower is 30 degrees from a point on the ground, and ` +
      `60 degrees from another point ${gap} m nearer to the tower on the same straight line. ` +
      `What is the height of the tower?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `If h is the height, the two distances are h x root 3 and h / root 3, and their difference is ${gap} m. ` +
      `So h (root 3 - 1 by root 3) = ${gap}, that is 2h / root 3 = ${gap}, giving h = ${gap} x root 3 / 2 = ${fmtNum(h, 2)} m.`,
  };
});

/* ============================================================ clocks ==== */

add("quant:clock:angle", "Clocks", "Moderate", [12, 12], ([hi, mi]) => {
  const hour = 1 + (hi as number);
  const minute = (mi as number) * 5;
  const raw = Math.abs(30 * (hour % 12) - 5.5 * minute);
  const angle = round(Math.min(raw, 360 - raw), 2);
  const opts = numericOptions(
    angle,
    [round(raw, 2), round(180 - angle, 2), round(angle + 30, 2), round(360 - angle, 2)],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt:
      `What is the angle between the hour hand and the minute hand of a clock at ` +
      `${hour}:${String(minute).padStart(2, "0")}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `The angle is the absolute value of 30H - 5.5M = |30 x ${hour % 12} - 5.5 x ${minute}| = ${fmtNum(raw, 2)} degrees. ` +
      `The angle between the hands is the smaller of this and 360 minus this, which is ${fmtNum(angle, 2)} degrees.`,
  };
});

add("quant:clock:coincide", "Clocks", "Difficult", [11, 2], ([hi, qi]) => {
  const hour = 1 + (hi as number);
  const coincide = round((60 * (hour % 12)) / 11, 2);
  const gainNeeded = ((hour % 12) * 30 + 180) % 360;
  const oppMinutes = round(gainNeeded / 5.5, 2);
  const wantCoincide = (qi as number) === 0;
  const answer = wantCoincide ? coincide : oppMinutes;
  if (answer >= 60) return null;
  const opts = numericOptions(
    answer,
    [round(answer + 5, 2), round(answer - 5, 2), 30, round(answer * 2, 2)],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt: wantCoincide
      ? `At how many minutes past ${hour} o'clock will the hour hand and the minute hand of a clock coincide?`
      : `At how many minutes past ${hour} o'clock will the hour hand and the minute hand of a clock point in exactly opposite directions?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: wantCoincide
      ? `At ${hour} o'clock the hands are ${(hour % 12) * 30} degrees apart, and the minute hand gains 5.5 degrees a minute, ` +
        `so they meet after ${(hour % 12) * 30} / 5.5 = ${fmtNum(coincide, 2)} minutes.`
      : `For the hands to be opposite, the minute hand must gain ${gainNeeded} degrees on the hour hand at ` +
        `5.5 degrees a minute, which takes ${fmtNum(oppMinutes, 2)} minutes.`,
  };
});

/* ========================================================= calendars === */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/** Classic odd-days method, identical to the Gregorian calendar. */
function weekdayIndex(d: number, m: number, y: number) {
  const prevYears = y - 1;
  const centuryOdd = [0, 5, 3, 1][Math.floor(prevYears / 100) % 4] as number;
  const rem = prevYears % 100;
  const yearOdd = (rem + Math.floor(rem / 4)) % 7;
  let monthDays = 0;
  for (let i = 0; i < m - 1; i += 1) {
    monthDays += (MONTH_DAYS[i] as number) + (i === 1 && isLeap(y) ? 1 : 0);
  }
  return (centuryOdd + yearOdd + monthDays + d) % 7;
}

add("quant:calendar:day", "Calendars", "Moderate", [40, 12, 28], ([yi, mi, di]) => {
  const y = 1990 + (yi as number);
  const m = 1 + (mi as number);
  const d = 1 + (di as number);
  const idx = weekdayIndex(d, m, y);
  const answer = DAYS[idx] as string;
  const opts = textOptions(answer, DAYS, (yi as number) + (di as number));
  if (!opts) return null;
  return {
    prompt: `What was the day of the week on ${d} ${MONTHS[m - 1]} ${y}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Counting odd days by the standard method for ${d} ${MONTHS[m - 1]} ${y} gives a remainder of ${idx}, ` +
      `and the remainders 0 to 6 stand for Sunday to Saturday, so the day was ${answer}.`,
  };
});

add("quant:calendar:same-day", "Calendars", "Difficult", [30, 12, 28], ([yi, mi, di]) => {
  const y = 1995 + (yi as number);
  const m = 1 + (mi as number);
  const d = 1 + (di as number);
  const idx = weekdayIndex(d, m, y);
  const nextIdx = weekdayIndex(d, m, y + 1);
  const answer = DAYS[nextIdx] as string;
  const opts = textOptions(answer, DAYS, (yi as number) + (mi as number));
  if (!opts) return null;
  return {
    prompt:
      `If ${d} ${MONTHS[m - 1]} ${y} was a ${DAYS[idx]}, what day of the week was ` +
      `${d} ${MONTHS[m - 1]} ${y + 1}?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `The stretch from ${d} ${MONTHS[m - 1]} ${y} to ${d} ${MONTHS[m - 1]} ${y + 1} contains ` +
      `${nextIdx === (idx + 1) % 7 ? "365 days, that is 1 odd day" : "366 days, that is 2 odd days"}, ` +
      `so the day moves forward accordingly to ${answer}.`,
  };
});

/* =============================================== data interpretation === */

const SCHOOLS = ["A", "B", "C", "D", "E"];

add("quant:di:table", "Data Interpretation", "Moderate", [10, 10, 10, 6], ([s1, s2, s3, qi]) => {
  const boys = SCHOOLS.map((_, i) => 120 + ((s1 as number) + i * 7) * 5 + i * 30);
  const girls = SCHOOLS.map((_, i) => 100 + ((s2 as number) + i * 5) * 5 + i * 20);
  const table =
    `School | Boys | Girls\n` + SCHOOLS.map((s, i) => `${s} | ${boys[i]} | ${girls[i]}`).join("\n");
  const head = `The table shows the number of boys and girls in five schools.\n${table}\n`;
  const q = qi as number;
  const k = (s3 as number) % 5;
  if (q === 0) {
    const total = (boys[k] as number) + (girls[k] as number);
    const opts = numericOptions(
      total,
      [boys[k] as number, girls[k] as number, total + 20, total - 20],
      int,
    );
    return {
      prompt: `${head}What is the total number of students in school ${SCHOOLS[k]}?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `Total = boys + girls = ${boys[k]} + ${girls[k]} = ${total}.`,
    };
  }
  if (q === 1) {
    const b = boys[k] as number;
    const g = girls[k] as number;
    const h = gcd(b, g);
    const answer = `${b / h} : ${g / h}`;
    const pool = [
      answer,
      `${g / h} : ${b / h}`,
      `${b} : ${g}`,
      `${b / h + 1} : ${g / h}`,
      `${b / h} : ${g / h + 1}`,
      `1 : 1`,
    ];
    const opts = textOptions(answer, pool, (s1 as number) + k);
    if (!opts) return null;
    return {
      prompt: `${head}What is the ratio of boys to girls in school ${SCHOOLS[k]}?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `The ratio is ${b} : ${g}, and dividing both by their HCF ${h} gives ${answer}.`,
    };
  }
  if (q === 2) {
    const b = boys[k] as number;
    const g = girls[k] as number;
    const pctValue = round((g * 100) / (b + g), 2);
    const opts = numericOptions(
      pctValue,
      [round(100 - pctValue, 2), round((b * 100) / g, 2), round(pctValue + 5, 2), 50],
      (v) => fmtNum(v, 2),
    );
    return {
      prompt: `${head}The number of girls in school ${SCHOOLS[k]} is what per cent of the total students of that school?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `Required percentage = ${g} x 100 / (${b} + ${g}) = ${fmtNum(pctValue, 2)} per cent.`,
    };
  }
  if (q === 3) {
    const sum = boys.reduce((a, b) => a + b, 0);
    const avg = round(sum / 5, 2);
    const opts = numericOptions(
      avg,
      [sum, round(avg + 20, 2), round(avg - 20, 2), round(sum / 4, 2)],
      (v) => fmtNum(v, 2),
    );
    return {
      prompt: `${head}What is the average number of boys in the five schools?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `Total boys = ${boys.join(" + ")} = ${sum}, so the average is ${sum} / 5 = ${fmtNum(avg, 2)}.`,
    };
  }
  if (q === 4) {
    const totalAll = boys.reduce((a, b) => a + b, 0) + girls.reduce((a, b) => a + b, 0);
    const opts = numericOptions(
      totalAll,
      [
        totalAll - 100,
        totalAll + 100,
        boys.reduce((a, b) => a + b, 0),
        girls.reduce((a, b) => a + b, 0),
      ],
      int,
    );
    return {
      prompt: `${head}What is the total number of students in all five schools taken together?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `Total boys = ${boys.reduce((a, b) => a + b, 0)} and total girls = ${girls.reduce((a, b) => a + b, 0)}, ` +
        `so the grand total is ${totalAll}.`,
    };
  }
  const t0 = (boys[0] as number) + (girls[0] as number);
  const t4 = (boys[4] as number) + (girls[4] as number);
  const diffPct = round(((t4 - t0) * 100) / t0, 2);
  const opts = numericOptions(
    diffPct,
    [round(((t4 - t0) * 100) / t4, 2), round(diffPct + 5, 2), round(-diffPct, 2), 100],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt: `${head}The total strength of school E is what per cent more than the total strength of school A?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `School A has ${t0} students and school E has ${t4}. The increase is ${t4 - t0}, ` +
      `so the percentage is ${t4 - t0} x 100 / ${t0} = ${fmtNum(diffPct, 2)} per cent.`,
  };
});

add("quant:di:production", "Data Interpretation", "Difficult", [10, 10, 5], ([s1, s2, qi]) => {
  const years = [2019, 2020, 2021, 2022, 2023];
  const unitA = years.map((_, i) => 400 + ((s1 as number) + i * 3) * 10 + i * 60);
  const unitB = years.map((_, i) => 350 + ((s2 as number) + i * 4) * 10 + i * 45);
  const table =
    `Year | Unit A | Unit B\n` + years.map((y, i) => `${y} | ${unitA[i]} | ${unitB[i]}`).join("\n");
  const head = `The table shows the annual production, in tonnes, of two units of a factory.\n${table}\n`;
  const q = qi as number;
  if (q === 0) {
    const growth = round(
      (((unitA[4] as number) - (unitA[0] as number)) * 100) / (unitA[0] as number),
      2,
    );
    const opts = numericOptions(
      growth,
      [round(growth + 5, 2), round(growth - 5, 2), round(growth / 2, 2), 100],
      (v) => fmtNum(v, 2),
    );
    return {
      prompt: `${head}By what per cent did the production of Unit A grow from 2019 to 2023?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `The rise is ${unitA[4]} - ${unitA[0]} = ${(unitA[4] as number) - (unitA[0] as number)} tonnes on a base of ${unitA[0]}, ` +
        `which is ${fmtNum(growth, 2)} per cent.`,
    };
  }
  if (q === 1) {
    const totals = years.map((_, i) => (unitA[i] as number) + (unitB[i] as number));
    let best = 0;
    for (let i = 1; i < totals.length; i += 1)
      if ((totals[i] as number) > (totals[best] as number)) best = i;
    const answer = String(years[best]);
    const opts = textOptions(answer, years.map(String), s1 as number);
    if (!opts) return null;
    return {
      prompt: `${head}In which year was the combined production of the two units the highest?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `The yearly totals are ${totals.join(", ")}, and the highest of these is ${totals[best]} in ${answer}.`,
    };
  }
  if (q === 2) {
    const sum = unitB.reduce((a, b) => a + b, 0);
    const avg = round(sum / 5, 2);
    const opts = numericOptions(
      avg,
      [sum, round(avg + 30, 2), round(avg - 30, 2), round(sum / 4, 2)],
      (v) => fmtNum(v, 2),
    );
    return {
      prompt: `${head}What is the average annual production of Unit B over the five years?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `Total production of Unit B = ${sum} tonnes over 5 years, so the average is ${fmtNum(avg, 2)} tonnes.`,
    };
  }
  if (q === 3) {
    const i = 2;
    const a = unitA[i] as number;
    const b = unitB[i] as number;
    const h = gcd(a, b);
    const answer = `${a / h} : ${b / h}`;
    const pool = [
      answer,
      `${b / h} : ${a / h}`,
      `${a} : ${b}`,
      `${a / h + 1} : ${b / h}`,
      "1 : 1",
      `${a / h} : ${b / h + 1}`,
    ];
    const opts = textOptions(answer, pool, s2 as number);
    if (!opts) return null;
    return {
      prompt: `${head}What is the ratio of the production of Unit A to that of Unit B in 2021?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `The ratio is ${a} : ${b}, and dividing by the HCF ${h} gives ${answer}.`,
    };
  }
  const totalA = unitA.reduce((a, b) => a + b, 0);
  const totalB = unitB.reduce((a, b) => a + b, 0);
  const pctValue = round((totalA * 100) / (totalA + totalB), 2);
  const opts = numericOptions(
    pctValue,
    [round(100 - pctValue, 2), round((totalA * 100) / totalB, 2), 50, round(pctValue + 5, 2)],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt: `${head}Over the five years taken together, the production of Unit A is what per cent of the total production of both units?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Unit A produced ${totalA} tonnes and Unit B produced ${totalB} tonnes, a total of ${totalA + totalB}. ` +
      `So Unit A is ${totalA} x 100 / ${totalA + totalB} = ${fmtNum(pctValue, 2)} per cent of the total.`,
  };
});

export const QUANT_FULL_TEMPLATES = templates;
