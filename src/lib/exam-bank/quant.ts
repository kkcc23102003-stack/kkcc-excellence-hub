/**
 * Quantitative Aptitude templates — the arithmetic core asked in IBPS/SBI,
 * RRB NTPC & Group D, SSC CGL/CHSL and most state exams.
 *
 * Every template is a genuine parameterised sum: the numbers change, the
 * mathematics is real, and each distractor is a documented common mistake.
 */

import {
  type Template,
  fmtNum,
  gcd,
  numericOptions,
  numericTemplate,
  pct,
  ratio,
  round,
  rupee,
} from "./core";

const BANK = [
  "Banking",
  "SSC",
  "Railway",
  "UPSC/SSC/Bank",
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
const BANK_WIDE = [...BANK, "Punjab Patwari", "Punjab Police", "Punjab Clerk", "State Clerk"];

/** Arithmetic sequence helper: `seq(100, 20, 5)` -> [100, 120, 140, 160, 180]. */
function seq(start: number, step: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => start + i * step);
}

const templates: Template[] = [];

/* ------------------------------------------------------------ profit & loss */

{
  const cps = seq(120, 20, 90); // 120 .. 1900
  const rates = [5, 8, 10, 12, 15, 16, 20, 24, 25, 30, 32, 35, 40, 45, 50, 60];
  templates.push(
    numericTemplate({
      id: "quant:pl:sp",
      subject: "Quantitative Aptitude",
      topic: "Profit and Loss",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [cps.length, rates.length],
      build: ([i, j]) => {
        const cp = cps[i as number] as number;
        const rate = rates[j as number] as number;
        const sp = round(cp * (1 + rate / 100));
        const options = numericOptions(
          sp,
          [cp * (1 - rate / 100), cp + rate, round(cp * (1 + rate / 50)), cp - rate],
          (v) => rupee(v),
        );
        return {
          prompt: `An article is bought for ${rupee(cp)} and sold at a profit of ${pct(rate)}. What is its selling price?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `SP = CP x (100 + profit%)/100 = ${fmtNum(cp)} x ${100 + rate}/100 = ${fmtNum(sp)}.`,
        };
      },
    }),
  );
}

{
  const cps = seq(200, 25, 70);
  const gains = seq(10, 5, 40);
  templates.push(
    numericTemplate({
      id: "quant:pl:rate",
      subject: "Quantitative Aptitude",
      topic: "Profit and Loss",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [cps.length, gains.length],
      build: ([i, j]) => {
        const cp = cps[i as number] as number;
        const gain = gains[j as number] as number;
        const sp = cp + gain;
        const rate = round((gain / cp) * 100);
        const options = numericOptions(
          rate,
          [round((gain / sp) * 100), round((gain / cp) * 50), gain, round((gain / cp) * 200)],
          (v) => pct(v),
        );
        return {
          prompt: `A trader buys a item for ${rupee(cp)} and sells it for ${rupee(sp)}. Find the profit percentage.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Profit = ${fmtNum(sp)} - ${fmtNum(cp)} = ${fmtNum(gain)}. Profit% = profit/CP x 100 = ${fmtNum(gain)}/${fmtNum(cp)} x 100 = ${fmtNum(rate)}%.`,
        };
      },
    }),
  );
}

{
  const mps = seq(400, 50, 60);
  const d1 = [5, 10, 12, 15, 20, 25, 30];
  const d2 = [4, 5, 8, 10, 12, 15, 20];
  templates.push(
    numericTemplate({
      id: "quant:pl:successive",
      subject: "Quantitative Aptitude",
      topic: "Discount",
      difficulty: "Difficult",
      exams: BANK_WIDE,
      sizes: [mps.length, d1.length, d2.length],
      build: ([i, j, k]) => {
        const mp = mps[i as number] as number;
        const a = d1[j as number] as number;
        const b = d2[k as number] as number;
        const sp = round(mp * (1 - a / 100) * (1 - b / 100));
        const options = numericOptions(
          sp,
          [round(mp * (1 - (a + b) / 100)), round(mp * (1 - a / 100)), round(mp - a - b)],
          (v) => rupee(v),
        );
        return {
          prompt: `The marked price of an item is ${rupee(mp)}. Successive discounts of ${pct(a)} and ${pct(b)} are allowed. What is the net selling price?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Successive discounts multiply: SP = ${fmtNum(mp)} x ${(100 - a) / 100} x ${(100 - b) / 100} = ${fmtNum(sp)}. Adding the discounts (${a + b}%) is the classic trap.`,
        };
      },
    }),
  );
}

/* ---------------------------------------------------------------- interest */

{
  const ps = seq(1000, 500, 60);
  const rs = [2, 2.5, 3, 4, 5, 6, 6.5, 7, 7.5, 8, 9, 10, 11, 12, 12.5, 15];
  const ts = [1, 2, 3, 4, 5, 6, 8, 10];
  templates.push(
    numericTemplate({
      id: "quant:si",
      subject: "Quantitative Aptitude",
      topic: "Simple Interest",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [ps.length, rs.length, ts.length],
      build: ([i, j, k]) => {
        const p = ps[i as number] as number;
        const r = rs[j as number] as number;
        const t = ts[k as number] as number;
        const si = round((p * r * t) / 100);
        const options = numericOptions(
          si,
          [round(p + si), round((p * r) / 100), round((p * r * t) / 1000), round(si * 2)],
          (v) => rupee(v),
        );
        return {
          prompt: `Find the simple interest on ${rupee(p)} at ${pct(r)} per annum for ${fmtNum(t)} year${t === 1 ? "" : "s"}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `SI = P x R x T / 100 = ${fmtNum(p)} x ${fmtNum(r)} x ${fmtNum(t)} / 100 = ${fmtNum(si)}.`,
        };
      },
    }),
  );
}

{
  const ps = seq(2000, 1000, 40);
  const rs = [4, 5, 6, 8, 10, 12, 15, 20, 25];
  const ts = [2, 3];
  templates.push(
    numericTemplate({
      id: "quant:ci",
      subject: "Quantitative Aptitude",
      topic: "Compound Interest",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [ps.length, rs.length, ts.length],
      build: ([i, j, k]) => {
        const p = ps[i as number] as number;
        const r = rs[j as number] as number;
        const t = ts[k as number] as number;
        const amount = round(p * (1 + r / 100) ** t);
        const ci = round(amount - p);
        const si = round((p * r * t) / 100);
        const options = numericOptions(ci, [si, amount, round(ci * 2), round(si + p)], (v) =>
          rupee(v),
        );
        return {
          prompt: `Find the compound interest on ${rupee(p)} at ${pct(r)} per annum compounded annually for ${fmtNum(t)} years.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `A = P(1 + R/100)^T = ${fmtNum(p)} x (1 + ${fmtNum(r)}/100)^${t} = ${fmtNum(amount)}. CI = A - P = ${fmtNum(ci)}. Simple interest would only be ${fmtNum(si)}.`,
        };
      },
    }),
  );
}

/* -------------------------------------------------------------- percentage */

{
  const bases = seq(120, 20, 80);
  const rates = [5, 8, 12, 15, 18, 20, 24, 25, 28, 32, 35, 40, 45, 55, 60, 65, 72, 75, 80, 90];
  templates.push(
    numericTemplate({
      id: "quant:pct:of",
      subject: "Quantitative Aptitude",
      topic: "Percentage",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [bases.length, rates.length],
      build: ([i, j]) => {
        const base = bases[i as number] as number;
        const rate = rates[j as number] as number;
        const value = round((base * rate) / 100);
        const options = numericOptions(
          value,
          [round(base - value), round((base * rate) / 1000), round(base / rate), base + rate],
          (v) => fmtNum(v),
        );
        return {
          prompt: `What is ${pct(rate)} of ${fmtNum(base)}?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `${fmtNum(rate)}% of ${fmtNum(base)} = ${fmtNum(base)} x ${fmtNum(rate)}/100 = ${fmtNum(value)}.`,
        };
      },
    }),
  );
}

{
  const olds = seq(200, 50, 60);
  const changes = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75];
  templates.push(
    numericTemplate({
      id: "quant:pct:change",
      subject: "Quantitative Aptitude",
      topic: "Percentage",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [olds.length, changes.length, 2],
      build: ([i, j, k]) => {
        const oldValue = olds[i as number] as number;
        const change = changes[j as number] as number;
        const up = k === 0;
        const newValue = round(oldValue * (1 + (up ? change : -change) / 100));
        const options = numericOptions(
          newValue,
          [
            round(oldValue * (1 - (up ? change : -change) / 100)),
            round(oldValue + change),
            round((oldValue * change) / 100),
          ],
          (v) => fmtNum(v),
        );
        return {
          prompt: `The value ${fmtNum(oldValue)} ${up ? "increases" : "decreases"} by ${pct(change)}. What is the new value?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `New value = ${fmtNum(oldValue)} x (100 ${up ? "+" : "-"} ${fmtNum(change)})/100 = ${fmtNum(newValue)}.`,
        };
      },
    }),
  );
}

/* ----------------------------------------------------------------- average */

{
  const starts = seq(10, 3, 70);
  const counts = [4, 5, 6, 7, 8, 9, 10, 11, 12, 15];
  templates.push(
    numericTemplate({
      id: "quant:avg:consecutive",
      subject: "Quantitative Aptitude",
      topic: "Average",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [starts.length, counts.length],
      build: ([i, j]) => {
        const start = starts[i as number] as number;
        const n = counts[j as number] as number;
        const last = start + n - 1;
        const avg = round((start + last) / 2);
        const sum = round(((start + last) * n) / 2);
        const options = numericOptions(avg, [sum, round(sum / (n + 1)), last, start], (v) =>
          fmtNum(v),
        );
        return {
          prompt: `Find the average of the ${n} consecutive integers from ${start} to ${last}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `For consecutive numbers the average equals (first + last)/2 = (${start} + ${last})/2 = ${fmtNum(avg)}.`,
        };
      },
    }),
  );
}

{
  const avgs = seq(20, 2, 45);
  const ns = seq(5, 1, 16);
  const newVals = seq(30, 6, 20);
  templates.push(
    numericTemplate({
      id: "quant:avg:newmember",
      subject: "Quantitative Aptitude",
      topic: "Average",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [avgs.length, ns.length, newVals.length],
      build: ([i, j, k]) => {
        const avg = avgs[i as number] as number;
        const n = ns[j as number] as number;
        const extra = newVals[k as number] as number;
        const newAvg = round((avg * n + extra) / (n + 1));
        const options = numericOptions(
          newAvg,
          [round((avg * n + extra) / n), round(avg + extra), round((avg + extra) / 2)],
          (v) => fmtNum(v),
        );
        return {
          prompt: `The average of ${n} numbers is ${fmtNum(avg)}. If one more number ${fmtNum(extra)} is included, what is the new average?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Old total = ${fmtNum(avg)} x ${n} = ${fmtNum(avg * n)}. New total = ${fmtNum(avg * n + extra)} over ${n + 1} numbers, so the average is ${fmtNum(newAvg)}.`,
        };
      },
    }),
  );
}

/* --------------------------------------------------------------- ratio/age */

{
  const aParts = seq(2, 1, 12);
  const bParts = seq(3, 1, 12);
  const totals = seq(200, 100, 30);
  templates.push(
    numericTemplate({
      id: "quant:ratio:divide",
      subject: "Quantitative Aptitude",
      topic: "Ratio and Proportion",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [aParts.length, bParts.length, totals.length],
      build: ([i, j, k]) => {
        const a = aParts[i as number] as number;
        const b = bParts[j as number] as number;
        if (gcd(a, b) !== 1 || a === b) return null;
        const total = totals[k as number] as number;
        const share = round((total * a) / (a + b));
        const options = numericOptions(
          share,
          [round((total * b) / (a + b)), round(total / 2), round((total * a) / b)],
          (v) => rupee(v),
        );
        return {
          prompt: `${rupee(total)} is divided between two people in the ratio ${a} : ${b}. What is the share of the first person?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Total parts = ${a} + ${b} = ${a + b}. First share = ${fmtNum(total)} x ${a}/${a + b} = ${fmtNum(share)}.`,
        };
      },
    }),
  );
}

{
  const ratios: [number, number][] = [
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [3, 5],
    [4, 7],
    [5, 7],
    [2, 5],
    [5, 8],
    [7, 9],
  ];
  const multiples = seq(2, 1, 14);
  const years = seq(4, 2, 10);
  templates.push(
    numericTemplate({
      id: "quant:ages",
      subject: "Quantitative Aptitude",
      topic: "Problems on Ages",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [ratios.length, multiples.length, years.length],
      build: ([i, j, k]) => {
        const pair = ratios[i as number] as [number, number];
        const mult = multiples[j as number] as number;
        const after = years[k as number] as number;
        const age1 = pair[0] * mult;
        const age2 = pair[1] * mult;
        const future = age1 + after;
        const options = numericOptions(
          future,
          [age2 + after, age1, age1 - after, age2 - after],
          (v) => `${fmtNum(v)} years`,
        );
        return {
          prompt: `The present ages of A and B are in the ratio ${pair[0]} : ${pair[1]}. If B is now ${age2} years old, what will A's age be after ${after} years?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `One part = ${age2}/${pair[1]} = ${mult}. So A is ${pair[0]} x ${mult} = ${age1} years now, and after ${after} years A will be ${future} years old.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------------ time & work */

{
  const aDays = seq(4, 1, 30);
  const bDays = seq(6, 1, 30);
  templates.push(
    numericTemplate({
      id: "quant:work:together",
      subject: "Quantitative Aptitude",
      topic: "Time and Work",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [aDays.length, bDays.length],
      build: ([i, j]) => {
        const a = aDays[i as number] as number;
        const b = bDays[j as number] as number;
        if (a >= b) return null;
        const together = round((a * b) / (a + b));
        const options = numericOptions(
          together,
          [round((a + b) / 2), a + b, round(Math.abs(b - a)), round((a * b) / Math.abs(b - a))],
          (v) => `${fmtNum(v)} days`,
        );
        return {
          prompt: `A can finish a piece of work in ${a} days and B can finish the same work in ${b} days. Working together, in how many days will they complete it?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Combined one-day work = 1/${a} + 1/${b} = ${a + b}/${a * b}. Time = ${a * b}/${a + b} = ${fmtNum(together)} days.`,
        };
      },
    }),
  );
}

{
  const fill = seq(3, 1, 26);
  const empty = seq(5, 1, 26);
  templates.push(
    numericTemplate({
      id: "quant:pipes",
      subject: "Quantitative Aptitude",
      topic: "Pipes and Cisterns",
      difficulty: "Difficult",
      exams: BANK_WIDE,
      sizes: [fill.length, empty.length],
      build: ([i, j]) => {
        const a = fill[i as number] as number;
        const b = empty[j as number] as number;
        if (b <= a) return null;
        const net = round((a * b) / (b - a));
        const options = numericOptions(
          net,
          [round((a * b) / (a + b)), b - a, a + b, round((a + b) / 2)],
          (v) => `${fmtNum(v)} hours`,
        );
        return {
          prompt: `A pipe fills a tank in ${a} hours while an outlet pipe empties it in ${b} hours. If both are opened together, in how many hours will the tank be filled?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Net one-hour work = 1/${a} - 1/${b} = ${b - a}/${a * b}. Time = ${a * b}/${b - a} = ${fmtNum(net)} hours.`,
        };
      },
    }),
  );
}

/* -------------------------------------------------------- speed, distance */

{
  const speeds = seq(20, 5, 30);
  const times = [2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10];
  templates.push(
    numericTemplate({
      id: "quant:tsd:distance",
      subject: "Quantitative Aptitude",
      topic: "Time, Speed and Distance",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [speeds.length, times.length],
      build: ([i, j]) => {
        const speed = speeds[i as number] as number;
        const time = times[j as number] as number;
        const distance = round(speed * time);
        const options = numericOptions(
          distance,
          [round(speed / time), round(speed + time), round(distance / 2), round(distance * 2)],
          (v) => `${fmtNum(v)} km`,
        );
        return {
          prompt: `A vehicle travels at ${fmtNum(speed)} km/h for ${fmtNum(time)} hours. What distance does it cover?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Distance = speed x time = ${fmtNum(speed)} x ${fmtNum(time)} = ${fmtNum(distance)} km.`,
        };
      },
    }),
  );
}

{
  const lengths = seq(100, 10, 40);
  const speeds = seq(36, 3, 25);
  templates.push(
    numericTemplate({
      id: "quant:train:pole",
      subject: "Quantitative Aptitude",
      topic: "Problems on Trains",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [lengths.length, speeds.length],
      build: ([i, j]) => {
        const length = lengths[i as number] as number;
        const kmph = speeds[j as number] as number;
        const mps = round((kmph * 5) / 18, 4);
        const time = round(length / mps);
        const options = numericOptions(
          time,
          [round(length / kmph), round((length * 18) / (kmph * 5) / 2), round(length / (mps * 2))],
          (v) => `${fmtNum(v)} seconds`,
        );
        return {
          prompt: `A train ${length} m long is running at ${kmph} km/h. How long will it take to cross a pole?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Convert speed: ${kmph} km/h = ${kmph} x 5/18 = ${fmtNum(mps)} m/s. Time = length/speed = ${length}/${fmtNum(mps)} = ${fmtNum(time)} seconds.`,
        };
      },
    }),
  );
}

{
  const boat = seq(6, 1, 25);
  const stream = seq(1, 1, 10);
  templates.push(
    numericTemplate({
      id: "quant:boats",
      subject: "Quantitative Aptitude",
      topic: "Boats and Streams",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [boat.length, stream.length, 2],
      build: ([i, j, k]) => {
        const b = boat[i as number] as number;
        const s = stream[j as number] as number;
        if (s >= b) return null;
        const down = k === 0;
        const value = down ? b + s : b - s;
        const options = numericOptions(
          value,
          [down ? b - s : b + s, b, s, round(b * s)],
          (v) => `${fmtNum(v)} km/h`,
        );
        return {
          prompt: `The speed of a boat in still water is ${b} km/h and the speed of the stream is ${s} km/h. Find its ${down ? "downstream" : "upstream"} speed.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `${down ? "Downstream" : "Upstream"} speed = boat ${down ? "+" : "-"} stream = ${b} ${down ? "+" : "-"} ${s} = ${value} km/h.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------- mixture, partner */

{
  const qty = seq(20, 5, 30);
  const milkPct = [60, 65, 70, 75, 80, 85, 90];
  const added = seq(5, 5, 12);
  templates.push(
    numericTemplate({
      id: "quant:mixture",
      subject: "Quantitative Aptitude",
      topic: "Mixture and Alligation",
      difficulty: "Difficult",
      exams: BANK_WIDE,
      sizes: [qty.length, milkPct.length, added.length],
      build: ([i, j, k]) => {
        const total = qty[i as number] as number;
        const p = milkPct[j as number] as number;
        const water = added[k as number] as number;
        const milk = round((total * p) / 100, 4);
        const newPct = round((milk / (total + water)) * 100);
        const options = numericOptions(
          newPct,
          [p, round(100 - newPct), round((milk / total) * 100 - water)],
          (v) => pct(v),
        );
        return {
          prompt: `A ${total} litre mixture contains ${pct(p)} milk. If ${water} litres of water is added, what is the percentage of milk in the new mixture?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Milk stays ${fmtNum(milk)} L while the total becomes ${total} + ${water} = ${total + water} L. New milk% = ${fmtNum(milk)}/${total + water} x 100 = ${fmtNum(newPct)}%.`,
        };
      },
    }),
  );
}

{
  const capA = seq(2000, 500, 25);
  const capB = seq(3000, 500, 25);
  const profits = seq(3000, 1500, 18);
  templates.push(
    numericTemplate({
      id: "quant:partnership",
      subject: "Quantitative Aptitude",
      topic: "Partnership",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [capA.length, capB.length, profits.length],
      build: ([i, j, k]) => {
        const a = capA[i as number] as number;
        const b = capB[j as number] as number;
        const profit = profits[k as number] as number;
        const share = round((profit * a) / (a + b));
        const options = numericOptions(
          share,
          [round((profit * b) / (a + b)), round(profit / 2), round((profit * a) / b)],
          (v) => rupee(v),
        );
        return {
          prompt: `A invests ${rupee(a)} and B invests ${rupee(b)} in a business for the same period. If the annual profit is ${rupee(profit)}, what is A's share?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `For equal time, profit is shared in the capital ratio ${ratio(a, b)}. A's share = ${fmtNum(profit)} x ${a}/${a + b} = ${fmtNum(share)}.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------------ mensuration */

{
  const lengths = seq(6, 1, 35);
  const breadths = seq(4, 1, 30);
  templates.push(
    numericTemplate({
      id: "quant:mens:rect",
      subject: "Quantitative Aptitude",
      topic: "Mensuration",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [lengths.length, breadths.length, 2],
      build: ([i, j, k]) => {
        const l = lengths[i as number] as number;
        const b = breadths[j as number] as number;
        if (l <= b) return null;
        const wantArea = k === 0;
        const area = l * b;
        const perimeter = 2 * (l + b);
        const value = wantArea ? area : perimeter;
        const options = numericOptions(
          value,
          [wantArea ? perimeter : area, l + b, round(value / 2), l * b * 2],
          (v) => `${fmtNum(v)} ${wantArea ? "sq cm" : "cm"}`,
        );
        return {
          prompt: `A rectangle has length ${l} cm and breadth ${b} cm. Find its ${wantArea ? "area" : "perimeter"}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: wantArea
            ? `Area = length x breadth = ${l} x ${b} = ${area} sq cm.`
            : `Perimeter = 2(length + breadth) = 2(${l} + ${b}) = ${perimeter} cm.`,
        };
      },
    }),
  );
}

{
  const radii = seq(3, 1, 25);
  const heights = seq(5, 1, 25);
  templates.push(
    numericTemplate({
      id: "quant:mens:cylinder",
      subject: "Quantitative Aptitude",
      topic: "Mensuration",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [radii.length, heights.length],
      build: ([i, j]) => {
        const r = radii[i as number] as number;
        const h = heights[j as number] as number;
        const volume = round((22 / 7) * r * r * h);
        const options = numericOptions(
          volume,
          [round((22 / 7) * r * h), round((22 / 7) * r * r), round(2 * (22 / 7) * r * h)],
          (v) => `${fmtNum(v)} cubic cm`,
        );
        return {
          prompt: `Find the volume of a cylinder of radius ${r} cm and height ${h} cm. (Take pi = 22/7)`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Volume = pi r^2 h = 22/7 x ${r}^2 x ${h} = ${fmtNum(volume)} cubic cm.`,
        };
      },
    }),
  );
}

/* --------------------------------------------------------- number systems */

{
  const as = seq(12, 2, 40);
  const bs = seq(16, 2, 40);
  templates.push(
    numericTemplate({
      id: "quant:hcf-lcm",
      subject: "Quantitative Aptitude",
      topic: "Number System",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [as.length, bs.length, 2],
      build: ([i, j, k]) => {
        const a = as[i as number] as number;
        const b = bs[j as number] as number;
        if (a >= b) return null;
        const h = gcd(a, b);
        const l = (a * b) / h;
        const wantHcf = k === 0;
        const value = wantHcf ? h : l;
        const options = numericOptions(value, [wantHcf ? l : h, a, b, round(a * b)], (v) =>
          fmtNum(v),
        );
        return {
          prompt: `Find the ${wantHcf ? "HCF" : "LCM"} of ${a} and ${b}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `HCF(${a}, ${b}) = ${h} and LCM = product/HCF = ${a * b}/${h} = ${l}. The required ${wantHcf ? "HCF" : "LCM"} is ${value}.`,
        };
      },
    }),
  );
}

{
  const as = seq(11, 1, 40);
  const bs = seq(13, 1, 40);
  const cs = seq(2, 1, 12);
  templates.push(
    numericTemplate({
      id: "quant:simplification",
      subject: "Quantitative Aptitude",
      topic: "Simplification",
      difficulty: "Easy",
      exams: BANK_WIDE,
      sizes: [as.length, bs.length, cs.length],
      build: ([i, j, k]) => {
        const a = as[i as number] as number;
        const b = bs[j as number] as number;
        const c = cs[k as number] as number;
        const value = a + b * c;
        const options = numericOptions(value, [(a + b) * c, a * b + c, a + b + c, a * c + b], (v) =>
          fmtNum(v),
        );
        return {
          prompt: `Simplify using BODMAS: ${a} + ${b} x ${c} = ?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Multiplication comes before addition: ${b} x ${c} = ${b * c}, then ${a} + ${b * c} = ${value}. Adding first would wrongly give ${(a + b) * c}.`,
        };
      },
    }),
  );
}

{
  const nums = seq(144, 1, 120);
  templates.push(
    numericTemplate({
      id: "quant:divisibility",
      subject: "Quantitative Aptitude",
      topic: "Number System",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [nums.length, 4],
      build: ([i, j]) => {
        const n = nums[i as number] as number;
        const divisors = [3, 4, 9, 11];
        const d = divisors[j as number] as number;
        const rem = n % d;
        const options = numericOptions(
          rem,
          [d - rem, (n % (d + 1)) as number, (n % 10) as number],
          (v) => fmtNum(v),
        );
        return {
          prompt: `What is the remainder when ${n} is divided by ${d}?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `${n} = ${d} x ${Math.floor(n / d)} + ${rem}, so the remainder is ${rem}.`,
        };
      },
    }),
  );
}

/* -------------------------------------------------------------- data & probability */

{
  const reds = seq(2, 1, 14);
  const blues = seq(3, 1, 14);
  const greens = seq(1, 1, 10);
  templates.push(
    numericTemplate({
      id: "quant:prob:balls",
      subject: "Quantitative Aptitude",
      topic: "Probability",
      difficulty: "Moderate",
      exams: BANK_WIDE,
      sizes: [reds.length, blues.length, greens.length],
      build: ([i, j, k]) => {
        const r = reds[i as number] as number;
        const b = blues[j as number] as number;
        const g = greens[k as number] as number;
        const total = r + b + g;
        const div = gcd(r, total);
        const answer = `${r / div}/${total / div}`;
        const wrongDiv = gcd(b, total);
        const pool = [
          `${b / wrongDiv}/${total / wrongDiv}`,
          `${r}/${b + g}`,
          `${r + b}/${total}`,
          `${g}/${total}`,
          `${r}/${total + 1}`,
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
          prompt: `A bag contains ${r} red, ${b} blue and ${g} green balls. One ball is drawn at random. What is the probability that it is red?`,
          answer,
          distractors,
          explanation: `Total balls = ${r} + ${b} + ${g} = ${total}. P(red) = ${r}/${total} = ${answer}.`,
        };
      },
    }),
  );
}

{
  const ns = seq(5, 1, 12);
  const rs = seq(2, 1, 4);
  templates.push(
    numericTemplate({
      id: "quant:pnc",
      subject: "Quantitative Aptitude",
      topic: "Permutation and Combination",
      difficulty: "Difficult",
      exams: BANK_WIDE,
      sizes: [ns.length, rs.length, 2],
      build: ([i, j, k]) => {
        const n = ns[i as number] as number;
        const r = rs[j as number] as number;
        if (r >= n) return null;
        const wantC = k === 0;
        let perm = 1;
        for (let t = 0; t < r; t += 1) perm *= n - t;
        let fact = 1;
        for (let t = 2; t <= r; t += 1) fact *= t;
        const comb = perm / fact;
        const value = wantC ? comb : perm;
        const options = numericOptions(value, [wantC ? perm : comb, n * r, n + r], (v) =>
          fmtNum(v),
        );
        return {
          prompt: `Find the value of ${wantC ? "C" : "P"}(${n}, ${r}).`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `P(${n}, ${r}) = ${perm} and C(${n}, ${r}) = P/${r}! = ${perm}/${fact} = ${comb}. The required value is ${value}.`,
        };
      },
    }),
  );
}

export const QUANT_TEMPLATES = templates;
