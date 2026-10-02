/**
 * Logical Reasoning templates — series, coding, blood relations, directions,
 * clocks, calendars and alphabet logic as asked in Bank, Railway and SSC.
 */

import { type Template, fmtNum, numericOptions, numericTemplate, round } from "./core";

const BANK_WIDE = [
  "Banking",
  "SSC",
  "Railway",
  "UPSC/SSC/Bank",
  "Punjab Police",
  "Punjab Clerk",
  "State Clerk",
  "CUET",
  "SSC CGL",
  "SSC CHSL",
  "SSC MTS",
  "SSC GD Constable",
  "RRB NTPC",
  "RRB Group D",
  "RRB ALP",
  "NDA/CDS",
  "CAPF",
  "State PSC",
];

function seq(start: number, step: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => start + i * step);
}

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const templates: Template[] = [];

/* ----------------------------------------------------------- number series */

{
  const firsts = seq(2, 1, 40);
  const diffs = seq(3, 1, 18);
  const positions = [4, 5, 6];
  templates.push(
    numericTemplate({
      id: "reason:series:ap",
      subject: "Reasoning",
      topic: "Number Series",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [firsts.length, diffs.length, positions.length],
      build: ([i, j, k]) => {
        const a = firsts[i as number] as number;
        const d = diffs[j as number] as number;
        const missingAt = positions[k as number] as number;
        const terms = seq(a, d, 6);
        const answer = terms[missingAt - 1] as number;
        const shown = terms.map((t, idx) => (idx === missingAt - 1 ? "?" : String(t))).join(", ");
        const options = numericOptions(
          answer,
          [answer + d, answer - d, answer + 1, answer * 2],
          (v) => fmtNum(v),
        );
        return {
          prompt: `Find the missing term: ${shown}`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `The series increases by a constant difference of ${d}. The missing term is ${terms[missingAt - 2]} + ${d} = ${answer}.`,
        };
      },
    }),
  );
}

{
  const firsts = seq(2, 1, 24);
  const ratios = [2, 3, 4, 5];
  templates.push(
    numericTemplate({
      id: "reason:series:gp",
      subject: "Reasoning",
      topic: "Number Series",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [firsts.length, ratios.length, 3],
      build: ([i, j, k]) => {
        const a = firsts[i as number] as number;
        const r = ratios[j as number] as number;
        const missingAt = (k as number) + 3;
        const terms = Array.from({ length: 5 }, (_, t) => a * r ** t);
        const answer = terms[missingAt - 1] as number;
        if (answer > 100000) return null;
        const shown = terms.map((t, idx) => (idx === missingAt - 1 ? "?" : String(t))).join(", ");
        const options = numericOptions(
          answer,
          [answer * r, round(answer / r), answer + r, answer - r],
          (v) => fmtNum(v),
        );
        return {
          prompt: `Find the missing term: ${shown}`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Each term is multiplied by ${r}. So the missing term = ${terms[missingAt - 2]} x ${r} = ${answer}.`,
        };
      },
    }),
  );
}

{
  const starts = seq(2, 1, 30);
  templates.push(
    numericTemplate({
      id: "reason:series:square",
      subject: "Reasoning",
      topic: "Number Series",
      difficulty: "Difficult",
      exams: BANK_WIDE,
      sizes: [starts.length, 3, 2],
      build: ([i, j, k]) => {
        const start = starts[i as number] as number;
        const missingAt = (j as number) + 3;
        const cube = k === 1;
        const terms = Array.from({ length: 5 }, (_, t) =>
          cube ? (start + t) ** 3 : (start + t) ** 2,
        );
        const answer = terms[missingAt - 1] as number;
        if (answer > 200000) return null;
        const shown = terms.map((t, idx) => (idx === missingAt - 1 ? "?" : String(t))).join(", ");
        const base = start + missingAt - 1;
        const options = numericOptions(
          answer,
          [cube ? base ** 2 : base ** 3, answer + base, (base + 1) ** (cube ? 3 : 2)],
          (v) => fmtNum(v),
        );
        return {
          prompt: `Find the missing term: ${shown}`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `The series lists consecutive ${cube ? "cubes" : "squares"} starting from ${start}. The missing term is ${base}${cube ? "^3" : "^2"} = ${answer}.`,
        };
      },
    }),
  );
}

/* --------------------------------------------------------- coding-decoding */

{
  const words = [
    "TABLE",
    "CHAIR",
    "MANGO",
    "HORSE",
    "RIVER",
    "STONE",
    "LIGHT",
    "PAPER",
    "MUSIC",
    "PLANT",
    "WATER",
    "CLOUD",
    "BRAIN",
    "SUGAR",
    "TIGER",
    "HOUSE",
    "GRAPE",
    "SMILE",
    "TRAIN",
    "FIELD",
    "MONEY",
    "NIGHT",
    "PEARL",
    "QUEEN",
    "ROUND",
    "SHARP",
    "TOWER",
    "VOICE",
    "WHEAT",
    "YOUTH",
  ];
  const shifts = [1, 2, 3, 4, 5];
  templates.push(
    numericTemplate({
      id: "reason:coding:shift",
      subject: "Reasoning",
      topic: "Coding and Decoding",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [words.length, shifts.length, 2],
      build: ([i, j, k]) => {
        const word = words[i as number] as string;
        const shift = shifts[j as number] as number;
        const forward = k === 0;
        const delta = forward ? shift : -shift;
        const shiftWord = (source: string, by: number) =>
          source
            .split("")
            .map((ch) => ALPHA[(ALPHA.indexOf(ch) + by + 26) % 26])
            .join("");
        const coded = shiftWord(word, delta);
        const other = words[((i as number) + 5) % words.length] as string;
        const answer = shiftWord(other, delta);
        const pool = [
          shiftWord(other, -delta),
          shiftWord(other, delta + 1),
          shiftWord(other, delta - 1),
          other.split("").reverse().join(""),
        ];
        const seen = new Set([answer]);
        const distractors: string[] = [];
        for (const candidate of pool) {
          if (distractors.length >= 3) break;
          if (seen.has(candidate)) continue;
          seen.add(candidate);
          distractors.push(candidate);
        }
        if (distractors.length < 3) return null;
        return {
          prompt: `In a certain code language, ${word} is written as ${coded}. How is ${other} written in the same code?`,
          answer,
          distractors,
          explanation: `Each letter moves ${Math.abs(delta)} place${Math.abs(delta) === 1 ? "" : "s"} ${forward ? "forward" : "backward"} in the alphabet. Applying the same rule to ${other} gives ${answer}.`,
        };
      },
    }),
  );
}

/* --------------------------------------------------------- alphabet logic */

{
  const positions = seq(1, 1, 26);
  templates.push(
    numericTemplate({
      id: "reason:alpha:position",
      subject: "Reasoning",
      topic: "Alphabet Test",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [positions.length, 2],
      build: ([i, j]) => {
        const pos = positions[i as number] as number;
        const fromRight = j === 1;
        const letter = ALPHA[pos - 1] as string;
        const answer = fromRight ? 27 - pos : pos;
        const options = numericOptions(
          answer,
          [27 - answer, answer + 1, answer - 1, 26 - answer],
          (v) => fmtNum(v),
        );
        return {
          prompt: `What is the position of the letter ${letter} in the English alphabet when counted from the ${fromRight ? "right" : "left"}?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `${letter} is the ${pos}th letter from the left. From the right it is 27 - ${pos} = ${27 - pos}. The required answer is ${answer}.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------------- directions */

{
  const triples: [number, number, number][] = [
    [3, 4, 5],
    [6, 8, 10],
    [9, 12, 15],
    [12, 16, 20],
    [15, 20, 25],
    [5, 12, 13],
    [10, 24, 26],
    [8, 15, 17],
    [7, 24, 25],
    [20, 21, 29],
    [18, 24, 30],
    [21, 28, 35],
  ];
  const dirs: [string, string][] = [
    ["north", "east"],
    ["south", "west"],
    ["north", "west"],
    ["south", "east"],
  ];
  templates.push(
    numericTemplate({
      id: "reason:direction:distance",
      subject: "Reasoning",
      topic: "Direction Sense",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [triples.length, dirs.length, 4],
      build: ([i, j, k]) => {
        const triple = triples[i as number] as [number, number, number];
        const pair = dirs[j as number] as [string, string];
        const scale = (k as number) + 1;
        const a = triple[0] * scale;
        const b = triple[1] * scale;
        const c = triple[2] * scale;
        const options = numericOptions(
          c,
          [a + b, Math.abs(b - a), round(c / 2), round((a + b) / 2)],
          (v) => `${fmtNum(v)} m`,
        );
        return {
          prompt: `A person walks ${a} m towards the ${pair[0]}, then turns and walks ${b} m towards the ${pair[1]}. How far is the person from the starting point?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `The two legs are perpendicular, so the shortest distance = sqrt(${a}^2 + ${b}^2) = sqrt(${a * a} + ${b * b}) = ${c} m.`,
        };
      },
    }),
  );
}

/* ---------------------------------------------------------------- ranking */

{
  const totals = seq(20, 1, 40);
  const fromTop = seq(3, 1, 15);
  templates.push(
    numericTemplate({
      id: "reason:ranking",
      subject: "Reasoning",
      topic: "Ranking and Order",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [totals.length, fromTop.length],
      build: ([i, j]) => {
        const total = totals[i as number] as number;
        const top = fromTop[j as number] as number;
        if (top >= total) return null;
        const bottom = total - top + 1;
        const options = numericOptions(
          bottom,
          [total - top, bottom + 1, total - top - 1, top],
          (v) => fmtNum(v),
        );
        return {
          prompt: `In a class of ${total} students, Ravi ranks ${top}th from the top. What is his rank from the bottom?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Rank from bottom = total - rank from top + 1 = ${total} - ${top} + 1 = ${bottom}.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------------------ clock */

{
  const hours = seq(1, 1, 12);
  const minutes = [0, 5, 10, 15, 20, 24, 30, 36, 40, 45, 48, 50];
  templates.push(
    numericTemplate({
      id: "reason:clock:angle",
      subject: "Reasoning",
      topic: "Clock and Calendar",
      difficulty: "Difficult",
      exams: BANK_WIDE,
      sizes: [hours.length, minutes.length],
      build: ([i, j]) => {
        const h = hours[i as number] as number;
        const m = minutes[j as number] as number;
        let angle = Math.abs(30 * h - 5.5 * m);
        if (angle > 180) angle = 360 - angle;
        angle = round(angle, 1);
        const options = numericOptions(
          angle,
          [round(360 - angle, 1), round(Math.abs(30 * h - 6 * m), 1), round(angle / 2, 1)],
          (v) => `${fmtNum(v, 1)} degrees`,
        );
        return {
          prompt: `What is the angle between the hour hand and the minute hand of a clock at ${h}:${String(m).padStart(2, "0")}?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Angle = |30H - 5.5M| = |30 x ${h} - 5.5 x ${m}| = ${fmtNum(Math.abs(30 * h - 5.5 * m), 1)} degrees, taken as the smaller angle ${fmtNum(angle, 1)} degrees.`,
        };
      },
    }),
  );
}

{
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const offsets = seq(10, 7, 30).concat(seq(15, 11, 20));
  templates.push(
    numericTemplate({
      id: "reason:calendar:day",
      subject: "Reasoning",
      topic: "Clock and Calendar",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [days.length, offsets.length],
      build: ([i, j]) => {
        const startIndex = i as number;
        const offset = offsets[j as number] as number;
        const answerIndex = (startIndex + offset) % 7;
        const answer = days[answerIndex] as string;
        const pool = [
          days[(answerIndex + 1) % 7] as string,
          days[(answerIndex + 6) % 7] as string,
          days[(answerIndex + 3) % 7] as string,
          days[startIndex] as string,
        ];
        const seen = new Set([answer]);
        const distractors: string[] = [];
        for (const candidate of pool) {
          if (distractors.length >= 3) break;
          if (seen.has(candidate)) continue;
          seen.add(candidate);
          distractors.push(candidate);
        }
        if (distractors.length < 3) return null;
        return {
          prompt: `If today is ${days[startIndex]}, what day of the week will it be after ${offset} days?`,
          answer,
          distractors,
          explanation: `${offset} divided by 7 leaves a remainder of ${offset % 7}. Counting ${offset % 7} day(s) forward from ${days[startIndex]} gives ${answer}.`,
        };
      },
    }),
  );
}

/* ----------------------------------------------------- mathematical logic */

{
  const as = seq(6, 1, 30);
  const bs = seq(3, 1, 20);
  templates.push(
    numericTemplate({
      id: "reason:symbols",
      subject: "Reasoning",
      topic: "Mathematical Operations",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [as.length, bs.length, 3],
      build: ([i, j, k]) => {
        const a = as[i as number] as number;
        const b = bs[j as number] as number;
        const mode = k as number;
        const label = [
          "+ means x and x means +",
          "- means / and / means -",
          "+ means - and - means +",
        ][mode] as string;
        let value: number;
        let shown: string;
        let working: string;
        if (mode === 0) {
          value = a * b + 2;
          shown = `${a} + ${b} x 2`;
          working = `${a} x ${b} + 2 = ${a * b} + 2 = ${value}`;
        } else if (mode === 1) {
          value = a / b - 2;
          if (!Number.isInteger(a / b)) return null;
          shown = `${a} - ${b} / 2`;
          working = `${a} / ${b} - 2 = ${a / b} - 2 = ${value}`;
        } else {
          value = a - b + 2;
          shown = `${a} + ${b} - 2`;
          working = `${a} - ${b} + 2 = ${value}`;
        }
        const options = numericOptions(value, [a + b * 2, a * b, a - b, a + b], (v) => fmtNum(v));
        return {
          prompt: `If ${label}, then what is the value of ${shown}?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Substituting the given meanings: ${working}.`,
        };
      },
    }),
  );
}

export const REASONING_TEMPLATES = templates;
