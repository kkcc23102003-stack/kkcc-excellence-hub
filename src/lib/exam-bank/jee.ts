/**
 * JEE templates — Mathematics, Physics and Chemistry at Class 11-12 level.
 * Mathematics is almost entirely parameterised, which is exactly how JEE
 * algebra, calculus and coordinate geometry are practised.
 */

import { type Template, fmtNum, gcd, numericOptions, numericTemplate, round } from "./core";

const JEE = ["JEE Main", "JEE Advanced"];
const JEE_WIDE = [...JEE, "NEET"];
const templates: Template[] = [];

function seq(start: number, step: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => start + i * step);
}

/* ------------------------------------------------------ quadratic equations */

{
  const roots1 = seq(-8, 1, 17);
  const roots2 = seq(-8, 1, 17);
  templates.push(
    numericTemplate({
      id: "jee:math:quadratic",
      subject: "Mathematics",
      topic: "Quadratic Equations",
      difficulty: "Easy",
      exams: JEE,
      sizes: [roots1.length, roots2.length, 2],
      build: ([i, j, k]) => {
        const p = roots1[i as number] as number;
        const q = roots2[j as number] as number;
        if (p >= q) return null;
        const b = -(p + q);
        const c = p * q;
        const wantSum = k === 0;
        const value = wantSum ? p + q : c;
        const sign = (n: number) => (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`);
        const options = numericOptions(
          value,
          [wantSum ? c : p + q, -value, b, round(value / 2)],
          (v) => fmtNum(v),
        );
        return {
          prompt: `For the quadratic equation x^2 ${sign(b)}x ${sign(c)} = 0, find the ${wantSum ? "sum" : "product"} of its roots.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `For ax^2 + bx + c = 0, sum of roots = -b/a = ${p + q} and product = c/a = ${c}. Here the roots are ${p} and ${q}.`,
        };
      },
    }),
  );
}

{
  const as = seq(1, 1, 8);
  const bs = seq(-10, 1, 21);
  const cs = seq(-10, 1, 21);
  templates.push(
    numericTemplate({
      id: "jee:math:discriminant",
      subject: "Mathematics",
      topic: "Quadratic Equations",
      difficulty: "Moderate",
      exams: JEE,
      sizes: [as.length, bs.length, cs.length],
      build: ([i, j, k]) => {
        const a = as[i as number] as number;
        const b = bs[j as number] as number;
        const c = cs[k as number] as number;
        if (c === 0) return null;
        const d = b * b - 4 * a * c;
        const sign = (n: number) => (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`);
        const options = numericOptions(
          d,
          [b * b + 4 * a * c, b * b - a * c, -d, round(Math.abs(d) / 2)],
          (v) => fmtNum(v),
        );
        return {
          prompt: `Find the discriminant of the quadratic equation ${a}x^2 ${sign(b)}x ${sign(c)} = 0.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `D = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${d}. ${d > 0 ? "Roots are real and distinct." : d === 0 ? "Roots are real and equal." : "Roots are imaginary."}`,
        };
      },
    }),
  );
}

/* ----------------------------------------------------------- progressions */

{
  const firsts = seq(1, 1, 30);
  const diffs = seq(2, 1, 20);
  const ns = seq(5, 1, 20);
  templates.push(
    numericTemplate({
      id: "jee:math:ap-term",
      subject: "Mathematics",
      topic: "Sequences and Series",
      difficulty: "Easy",
      exams: JEE,
      sizes: [firsts.length, diffs.length, ns.length, 2],
      build: ([i, j, k, m]) => {
        const a = firsts[i as number] as number;
        const d = diffs[j as number] as number;
        const n = ns[k as number] as number;
        const wantTerm = m === 0;
        const term = a + (n - 1) * d;
        const sum = (n * (2 * a + (n - 1) * d)) / 2;
        const value = wantTerm ? term : sum;
        const options = numericOptions(
          value,
          [wantTerm ? sum : term, a + n * d, round(value / 2), value + d],
          (v) => fmtNum(v),
        );
        return {
          prompt: `In an arithmetic progression the first term is ${a} and the common difference is ${d}. Find the ${wantTerm ? `${n}th term` : `sum of the first ${n} terms`}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: wantTerm
            ? `a_n = a + (n-1)d = ${a} + ${n - 1} x ${d} = ${term}.`
            : `S_n = n/2 [2a + (n-1)d] = ${n}/2 [2 x ${a} + ${n - 1} x ${d}] = ${sum}.`,
        };
      },
    }),
  );
}

{
  const firsts = seq(1, 1, 12);
  const ratios = [2, 3, 4, 5];
  const ns = seq(3, 1, 8);
  templates.push(
    numericTemplate({
      id: "jee:math:gp",
      subject: "Mathematics",
      topic: "Sequences and Series",
      difficulty: "Moderate",
      exams: JEE,
      sizes: [firsts.length, ratios.length, ns.length, 2],
      build: ([i, j, k, m]) => {
        const a = firsts[i as number] as number;
        const r = ratios[j as number] as number;
        const n = ns[k as number] as number;
        const wantTerm = m === 0;
        const term = a * r ** (n - 1);
        const sum = (a * (r ** n - 1)) / (r - 1);
        const value = wantTerm ? term : sum;
        if (value > 1000000) return null;
        const options = numericOptions(
          value,
          [wantTerm ? sum : term, a * r ** n, round(value / r)],
          (v) => fmtNum(v),
        );
        return {
          prompt: `A geometric progression has first term ${a} and common ratio ${r}. Find the ${wantTerm ? `${n}th term` : `sum of the first ${n} terms`}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: wantTerm
            ? `a_n = a r^(n-1) = ${a} x ${r}^${n - 1} = ${term}.`
            : `S_n = a(r^n - 1)/(r - 1) = ${a}(${r}^${n} - 1)/${r - 1} = ${sum}.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------------ logarithms */

{
  const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const powers = seq(1, 1, 8);
  templates.push(
    numericTemplate({
      id: "jee:math:log",
      subject: "Mathematics",
      topic: "Logarithms",
      difficulty: "Easy",
      exams: JEE,
      sizes: [bases.length, powers.length],
      build: ([i, j]) => {
        const b = bases[i as number] as number;
        const p = powers[j as number] as number;
        const value = b ** p;
        if (value > 1000000) return null;
        const options = numericOptions(p, [value, b, round(value / b), p + 1], (v) => fmtNum(v));
        return {
          prompt: `Evaluate log base ${b} of ${value}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Since ${b}^${p} = ${value}, log base ${b} of ${value} = ${p}.`,
        };
      },
    }),
  );
}

/* ---------------------------------------------------------- differentiation */

{
  const coeffs = seq(1, 1, 20);
  const powersArr = seq(2, 1, 10);
  templates.push(
    numericTemplate({
      id: "jee:math:derivative",
      subject: "Mathematics",
      topic: "Differentiation",
      difficulty: "Easy",
      exams: JEE,
      sizes: [coeffs.length, powersArr.length],
      build: ([i, j]) => {
        const a = coeffs[i as number] as number;
        const n = powersArr[j as number] as number;
        const answer = `${a * n}x^${n - 1}`;
        const pool = [
          `${a}x^${n - 1}`,
          `${a * n}x^${n}`,
          `${a * (n + 1)}x^${n}`,
          `${a / n}x^${n + 1}`,
          `${n}x^${n - 1}`,
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
          prompt: `Differentiate y = ${a}x^${n} with respect to x.`,
          answer,
          distractors,
          explanation: `Using the power rule d/dx(ax^n) = anx^(n-1), we get ${a} x ${n} x^(${n}-1) = ${answer}.`,
        };
      },
    }),
  );
}

{
  const coeffs = seq(1, 1, 20);
  const powersArr = seq(1, 1, 10);
  templates.push(
    numericTemplate({
      id: "jee:math:integral",
      subject: "Mathematics",
      topic: "Integration",
      difficulty: "Moderate",
      exams: JEE,
      sizes: [coeffs.length, powersArr.length],
      build: ([i, j]) => {
        const a = coeffs[i as number] as number;
        const n = powersArr[j as number] as number;
        const num = a;
        const den = n + 1;
        const g = gcd(num, den);
        const coef = den / g === 1 ? `${num / g}` : `(${num / g}/${den / g})`;
        const answer = `${coef}x^${n + 1} + C`;
        const pool = [
          `${a}x^${n + 1} + C`,
          `${a * n}x^${n - 1} + C`,
          `(${a}/${n})x^${n} + C`,
          `${coef}x^${n} + C`,
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
          prompt: `Evaluate the indefinite integral of ${a}x^${n} with respect to x.`,
          answer,
          distractors,
          explanation: `Integral of ax^n dx = a x^(n+1)/(n+1) + C = ${a}x^${n + 1}/${n + 1} + C = ${answer}.`,
        };
      },
    }),
  );
}

/* ----------------------------------------------------- coordinate geometry */

{
  const x1 = seq(-6, 1, 13);
  const y1 = seq(-6, 1, 13);
  const dx = [3, 4, 6, 8, 5, 12];
  templates.push(
    numericTemplate({
      id: "jee:math:distance",
      subject: "Mathematics",
      topic: "Straight Lines",
      difficulty: "Easy",
      exams: JEE,
      sizes: [x1.length, y1.length, dx.length],
      build: ([i, j, k]) => {
        const ax = x1[i as number] as number;
        const ay = y1[j as number] as number;
        const step = dx[k as number] as number;
        const pairs: Record<number, number> = { 3: 4, 4: 3, 6: 8, 8: 6, 5: 12, 12: 5 };
        const stepY = pairs[step] as number;
        const bx = ax + step;
        const by = ay + stepY;
        const d = Math.sqrt(step * step + stepY * stepY);
        const options = numericOptions(
          d,
          [step + stepY, Math.abs(step - stepY), round(d / 2, 3), step * stepY],
          (v) => fmtNum(v, 3),
        );
        return {
          prompt: `Find the distance between the points (${ax}, ${ay}) and (${bx}, ${by}).`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Distance = sqrt((${bx} - ${ax})^2 + (${by} - ${ay})^2) = sqrt(${step * step} + ${stepY * stepY}) = ${fmtNum(d, 3)}.`,
        };
      },
    }),
  );
}

{
  const centreX = seq(-5, 1, 11);
  const centreY = seq(-5, 1, 11);
  const radii = seq(1, 1, 12);
  templates.push(
    numericTemplate({
      id: "jee:math:circle",
      subject: "Mathematics",
      topic: "Circles",
      difficulty: "Moderate",
      exams: JEE,
      sizes: [centreX.length, centreY.length, radii.length],
      build: ([i, j, k]) => {
        const h = centreX[i as number] as number;
        const kk = centreY[j as number] as number;
        const r = radii[k as number] as number;
        const c = h * h + kk * kk - r * r;
        const sign = (n: number) => (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`);
        const answer = `(${h}, ${kk})`;
        const pool = [`(${-h}, ${-kk})`, `(${kk}, ${h})`, `(${h}, ${-kk})`, `(${-h}, ${kk})`];
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
          prompt: `Find the centre of the circle x^2 + y^2 ${sign(-2 * h)}x ${sign(-2 * kk)}y ${sign(c)} = 0.`,
          answer,
          distractors,
          explanation: `For x^2 + y^2 + 2gx + 2fy + c = 0 the centre is (-g, -f). Here 2g = ${-2 * h} and 2f = ${-2 * kk}, so the centre is (${h}, ${kk}) with radius ${r}.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------------- matrices */

{
  const as = seq(1, 1, 10);
  const bs = seq(1, 1, 10);
  const cs = seq(1, 1, 10);
  const ds = seq(1, 1, 10);
  templates.push(
    numericTemplate({
      id: "jee:math:determinant",
      subject: "Mathematics",
      topic: "Matrices and Determinants",
      difficulty: "Easy",
      exams: JEE,
      sizes: [as.length, bs.length, cs.length, ds.length],
      build: ([i, j, k, m]) => {
        const a = as[i as number] as number;
        const b = bs[j as number] as number;
        const c = cs[k as number] as number;
        const d = ds[m as number] as number;
        const det = a * d - b * c;
        const options = numericOptions(det, [a * d + b * c, a * b - c * d, a + d - b - c], (v) =>
          fmtNum(v),
        );
        return {
          prompt: `Find the determinant of the 2x2 matrix [[${a}, ${b}], [${c}, ${d}]].`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `For [[a, b], [c, d]] the determinant is ad - bc = ${a} x ${d} - ${b} x ${c} = ${a * d} - ${b * c} = ${det}.`,
        };
      },
    }),
  );
}

/* ---------------------------------------------------------- binomial */

{
  const ns = seq(4, 1, 12);
  const rs = seq(1, 1, 6);
  templates.push(
    numericTemplate({
      id: "jee:math:binomial",
      subject: "Mathematics",
      topic: "Binomial Theorem",
      difficulty: "Difficult",
      exams: JEE,
      sizes: [ns.length, rs.length],
      build: ([i, j]) => {
        const n = ns[i as number] as number;
        const r = rs[j as number] as number;
        if (r > n) return null;
        let c = 1;
        for (let t = 0; t < r; t += 1) c = (c * (n - t)) / (t + 1);
        c = Math.round(c);
        const options = numericOptions(c, [n * r, n + r, Math.round(c / 2), c * 2], (v) =>
          fmtNum(v),
        );
        return {
          prompt: `In the binomial expansion of (1 + x)^${n}, what is the coefficient of x^${r}?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `The coefficient of x^r in (1+x)^n is C(n, r). Here C(${n}, ${r}) = ${c}.`,
        };
      },
    }),
  );
}

/* --------------------------------------------------------- physics (JEE) */

{
  const masses = seq(1, 1, 15);
  const velocities = seq(2, 2, 15);
  templates.push(
    numericTemplate({
      id: "jee:phy:ke",
      subject: "Physics",
      topic: "Work Energy and Power",
      difficulty: "Easy",
      exams: JEE_WIDE,
      sizes: [masses.length, velocities.length, 2],
      build: ([i, j, k]) => {
        const m = masses[i as number] as number;
        const v = velocities[j as number] as number;
        const wantKe = k === 0;
        const ke = round(0.5 * m * v * v);
        const p = m * v;
        const value = wantKe ? ke : p;
        const options = numericOptions(
          value,
          [wantKe ? p : ke, m * v * v, round(value / 2)],
          (x) => `${fmtNum(x)} ${wantKe ? "J" : "kg m/s"}`,
        );
        return {
          prompt: `A body of mass ${m} kg moves with a velocity of ${v} m/s. Find its ${wantKe ? "kinetic energy" : "linear momentum"}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: wantKe
            ? `KE = (1/2)mv^2 = 0.5 x ${m} x ${v}^2 = ${fmtNum(ke)} J.`
            : `p = mv = ${m} x ${v} = ${p} kg m/s.`,
        };
      },
    }),
  );
}

{
  const freqs = seq(100, 50, 20);
  const speeds = [330, 340, 343, 350];
  templates.push(
    numericTemplate({
      id: "jee:phy:wave",
      subject: "Physics",
      topic: "Waves",
      difficulty: "Moderate",
      exams: JEE_WIDE,
      sizes: [freqs.length, speeds.length],
      build: ([i, j]) => {
        const f = freqs[i as number] as number;
        const v = speeds[j as number] as number;
        const lambda = round(v / f, 4);
        const options = numericOptions(
          lambda,
          [round(f / v, 4), round(v * f, 4), round(lambda * 2, 4)],
          (x) => `${fmtNum(x, 4)} m`,
        );
        return {
          prompt: `A sound wave of frequency ${f} Hz travels at ${v} m/s. What is its wavelength?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `v = f x lambda, so lambda = v/f = ${v}/${f} = ${fmtNum(lambda, 4)} m.`,
        };
      },
    }),
  );
}

export const JEE_TEMPLATES = templates;
