/**
 * Chemistry expansion — organic/inorganic fact base plus parameterised
 * numericals (gas laws, concentration, thermochemistry, radioactivity).
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  fmtNum,
  numericOptions,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
  numericTemplate,
  round,
} from "./core";

const CHEM = [
  "NEET",
  "JEE Main",
  "JEE Advanced",
  "CBSE Class 11-12 Science",
  "CUET",
  "ISC Science",
  "CBSE Class 11",
  "CBSE Class 12",
  "ISC Class 11",
  "ISC Class 12",
];
const CHEM_WIDE = [...CHEM, "SSC", "Railway", "Banking"];
const templates: Template[] = [];

function add(
  id: string,
  topic: string,
  difficulty: "Easy" | "Moderate" | "Difficult",
  rows: FactRow[],
  forward: string,
  reverse: string | undefined,
  explain: string,
  exams: string[] = CHEM,
) {
  templates.push(
    ...factTemplate({
      id,
      subject: "Chemistry",
      topic,
      difficulty,
      exams,
      rows,
      forward,
      reverse,
      explain,
    }),
    matchTemplate({ id, subject: "Chemistry", topic, difficulty, exams, rows }),
    statementTemplate({ id, subject: "Chemistry", topic, difficulty, exams, rows }),
    statementCountTemplate({ id, subject: "Chemistry", topic, difficulty, exams, rows }),
  );
}

function seq(start: number, step: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => start + i * step);
}

/* --------------------------------------------------- functional groups */

add(
  "chem:functional",
  "Organic Chemistry Basics",
  "Moderate",
  [
    { key: "Alcohol", value: "-OH (hydroxyl)" },
    { key: "Aldehyde", value: "-CHO" },
    { key: "Ketone", value: ">C=O (carbonyl between carbons)" },
    { key: "Carboxylic acid", value: "-COOH" },
    { key: "Ester", value: "-COO-" },
    { key: "Amine", value: "-NH2" },
    { key: "Amide", value: "-CONH2" },
    { key: "Ether", value: "-O- between two alkyl groups" },
    { key: "Nitrile", value: "-CN" },
    { key: "Nitro group", value: "-NO2" },
    { key: "Alkene", value: "C=C double bond" },
    { key: "Alkyne", value: "C triple bond C" },
    { key: "Thiol", value: "-SH" },
    { key: "Acid chloride", value: "-COCl" },
  ],
  "What is the functional group present in a/an %s?",
  "The group %s characterises which class of organic compound?",
  "A %k contains the %v group.",
);

add(
  "chem:iupac",
  "IUPAC Nomenclature",
  "Moderate",
  [
    { key: "CH4", value: "Methane" },
    { key: "C2H6", value: "Ethane" },
    { key: "C3H8", value: "Propane" },
    { key: "C4H10", value: "Butane" },
    { key: "C5H12", value: "Pentane" },
    { key: "C2H4", value: "Ethene" },
    { key: "C2H2", value: "Ethyne" },
    { key: "CH3OH", value: "Methanol" },
    { key: "C2H5OH", value: "Ethanol" },
    { key: "HCHO", value: "Methanal" },
    { key: "CH3CHO", value: "Ethanal" },
    { key: "CH3COOH", value: "Ethanoic acid" },
    { key: "CH3COCH3", value: "Propanone" },
    { key: "C6H6", value: "Benzene" },
    { key: "CHCl3", value: "Trichloromethane" },
  ],
  "What is the IUPAC name of the compound %s?",
  "Which compound has the IUPAC name %s?",
  "The IUPAC name of %k is %v.",
  CHEM_WIDE,
);

/* ------------------------------------------------------ periodic trends */

add(
  "chem:periodic",
  "Periodic Classification",
  "Moderate",
  [
    { key: "Scientist who gave the modern periodic law", value: "Henry Moseley" },
    { key: "Scientist who arranged elements by atomic mass", value: "Dmitri Mendeleev" },
    { key: "Basis of the modern periodic table", value: "Atomic number" },
    { key: "Number of periods in the modern periodic table", value: "7" },
    { key: "Number of groups in the modern periodic table", value: "18" },
    { key: "Group of alkali metals", value: "Group 1" },
    { key: "Group of alkaline earth metals", value: "Group 2" },
    { key: "Group of halogens", value: "Group 17" },
    { key: "Group of noble gases", value: "Group 18" },
    { key: "Most electronegative element", value: "Fluorine" },
    { key: "Element with the largest atomic radius in period 3", value: "Sodium" },
    { key: "Trend of atomic radius across a period from left to right", value: "Decreases" },
    { key: "Trend of ionisation enthalpy down a group", value: "Decreases" },
    { key: "Trend of metallic character down a group", value: "Increases" },
    { key: "Elements of group 3 to 12 are called", value: "Transition elements" },
    { key: "Lightest element in the periodic table", value: "Hydrogen" },
  ],
  "Identify: %s?",
  undefined,
  "%k: %v.",
);

/* ---------------------------------------------------------------- ores */

add(
  "chem:ore",
  "Metallurgy",
  "Difficult",
  [
    { key: "Bauxite", value: "Aluminium" },
    { key: "Haematite", value: "Iron" },
    { key: "Magnetite", value: "Iron" },
    { key: "Galena", value: "Lead" },
    { key: "Zinc blende", value: "Zinc" },
    { key: "Calamine", value: "Zinc" },
    { key: "Cinnabar", value: "Mercury" },
    { key: "Copper pyrites", value: "Copper" },
    { key: "Malachite", value: "Copper" },
    { key: "Cryolite", value: "Aluminium" },
    { key: "Pitchblende", value: "Uranium" },
    { key: "Rock salt", value: "Sodium" },
    { key: "Dolomite", value: "Magnesium" },
    { key: "Bornite", value: "Copper" },
  ],
  "%s is an ore of which metal?",
  undefined,
  "%k is an important ore of %v.",
  CHEM_WIDE,
);

/* -------------------------------------------------------------- gas laws */

{
  const p1 = seq(1, 1, 15);
  const v1 = seq(2, 1, 15);
  const p2 = seq(2, 1, 15);
  templates.push(
    numericTemplate({
      id: "chem:boyle",
      subject: "Chemistry",
      topic: "States of Matter",
      difficulty: "Easy",
      exams: CHEM,
      sizes: [p1.length, v1.length, p2.length],
      build: ([i, j, k]) => {
        const pa = p1[i as number] as number;
        const va = v1[j as number] as number;
        const pb = p2[k as number] as number;
        if (pb === pa) return null;
        const vb = round((pa * va) / pb, 3);
        const options = numericOptions(
          vb,
          [round((pb * va) / pa, 3), round(pa * va * pb, 3), va],
          (v) => `${fmtNum(v, 3)} L`,
        );
        return {
          prompt: `A gas occupies ${va} L at ${pa} atm. At constant temperature, what volume will it occupy at ${pb} atm?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `By Boyle's law P1V1 = P2V2, so V2 = P1V1/P2 = ${pa} x ${va}/${pb} = ${fmtNum(vb, 3)} L.`,
        };
      },
    }),
  );
}

{
  const t1 = seq(250, 10, 16);
  const v1 = seq(2, 1, 14);
  const t2 = seq(300, 15, 16);
  templates.push(
    numericTemplate({
      id: "chem:charles",
      subject: "Chemistry",
      topic: "States of Matter",
      difficulty: "Moderate",
      exams: CHEM,
      sizes: [t1.length, v1.length, t2.length],
      build: ([i, j, k]) => {
        const ta = t1[i as number] as number;
        const va = v1[j as number] as number;
        const tb = t2[k as number] as number;
        if (tb === ta) return null;
        const vb = round((va * tb) / ta, 3);
        const options = numericOptions(
          vb,
          [round((va * ta) / tb, 3), round(va + (tb - ta), 3), va],
          (v) => `${fmtNum(v, 3)} L`,
        );
        return {
          prompt: `A gas occupies ${va} L at ${ta} K. At constant pressure, what volume will it occupy at ${tb} K?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `By Charles's law V1/T1 = V2/T2, so V2 = V1 x T2/T1 = ${va} x ${tb}/${ta} = ${fmtNum(vb, 3)} L.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------ radioactivity */

{
  const halfLives = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30];
  const nHalf = [1, 2, 3, 4, 5, 6];
  const initial = seq(80, 20, 15);
  templates.push(
    numericTemplate({
      id: "chem:halflife",
      subject: "Chemistry",
      topic: "Nuclear Chemistry",
      difficulty: "Moderate",
      exams: CHEM,
      sizes: [halfLives.length, nHalf.length, initial.length],
      build: ([i, j, k]) => {
        const half = halfLives[i as number] as number;
        const n = nHalf[j as number] as number;
        const amount = initial[k as number] as number;
        const remaining = round(amount / 2 ** n, 4);
        const time = half * n;
        const options = numericOptions(
          remaining,
          [round(amount / (2 * n), 4), round(amount - remaining, 4), round(amount / 2, 4)],
          (v) => `${fmtNum(v, 4)} g`,
        );
        return {
          prompt: `A radioactive sample of ${amount} g has a half life of ${half} days. How much of it remains after ${time} days?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `${time} days equals ${n} half lives. Remaining = ${amount}/2^${n} = ${fmtNum(remaining, 4)} g.`,
        };
      },
    }),
  );
}

/* --------------------------------------------------- percentage composition */

{
  const compounds = [
    { name: "water (H2O)", element: "hydrogen", part: 2, total: 18 },
    { name: "water (H2O)", element: "oxygen", part: 16, total: 18 },
    { name: "carbon dioxide (CO2)", element: "carbon", part: 12, total: 44 },
    { name: "carbon dioxide (CO2)", element: "oxygen", part: 32, total: 44 },
    { name: "methane (CH4)", element: "carbon", part: 12, total: 16 },
    { name: "ammonia (NH3)", element: "nitrogen", part: 14, total: 17 },
    { name: "glucose (C6H12O6)", element: "carbon", part: 72, total: 180 },
    { name: "glucose (C6H12O6)", element: "oxygen", part: 96, total: 180 },
    { name: "calcium carbonate (CaCO3)", element: "calcium", part: 40, total: 100 },
    { name: "sodium chloride (NaCl)", element: "sodium", part: 23, total: 58.5 },
    { name: "sulphuric acid (H2SO4)", element: "sulphur", part: 32, total: 98 },
    { name: "urea CO(NH2)2", element: "nitrogen", part: 28, total: 60 },
  ];
  templates.push(
    numericTemplate({
      id: "chem:composition",
      subject: "Chemistry",
      topic: "Some Basic Concepts of Chemistry",
      difficulty: "Moderate",
      exams: CHEM,
      sizes: [compounds.length],
      build: ([i]) => {
        const c = compounds[i as number];
        if (!c) return null;
        const value = round((c.part / c.total) * 100, 2);
        const options = numericOptions(
          value,
          [round(100 - value, 2), round((c.total / c.part) * 100, 2), round(value / 2, 2)],
          (v) => `${fmtNum(v, 2)}%`,
        );
        return {
          prompt: `Calculate the percentage by mass of ${c.element} in ${c.name}. (Molar mass = ${fmtNum(c.total)} g/mol)`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Mass of ${c.element} per mole = ${fmtNum(c.part)} g. Percentage = ${fmtNum(c.part)}/${fmtNum(c.total)} x 100 = ${fmtNum(value, 2)}%.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------------ physics add-ons */

{
  const masses = seq(2, 2, 15);
  const heights = seq(2, 1, 20);
  templates.push(
    numericTemplate({
      id: "phy:pe",
      subject: "Physics",
      topic: "Work Energy and Power",
      difficulty: "Easy",
      exams: CHEM_WIDE,
      sizes: [masses.length, heights.length, 2],
      build: ([i, j, k]) => {
        const m = masses[i as number] as number;
        const h = heights[j as number] as number;
        const g = k === 0 ? 10 : 9.8;
        const pe = round(m * g * h, 2);
        const options = numericOptions(
          pe,
          [round(m * h, 2), round(m * g, 2), round(pe / 2, 2)],
          (v) => `${fmtNum(v, 2)} J`,
        );
        return {
          prompt: `Find the potential energy of a body of mass ${m} kg raised to a height of ${h} m. (Take g = ${g} m/s^2)`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `PE = mgh = ${m} x ${g} x ${h} = ${fmtNum(pe, 2)} J.`,
        };
      },
    }),
  );
}

{
  const works = seq(100, 50, 20);
  const times = seq(2, 1, 20);
  templates.push(
    numericTemplate({
      id: "phy:power",
      subject: "Physics",
      topic: "Work Energy and Power",
      difficulty: "Easy",
      exams: CHEM_WIDE,
      sizes: [works.length, times.length],
      build: ([i, j]) => {
        const w = works[i as number] as number;
        const t = times[j as number] as number;
        const p = round(w / t, 3);
        const options = numericOptions(
          p,
          [round(w * t, 3), round(t / w, 3), w],
          (v) => `${fmtNum(v, 3)} W`,
        );
        return {
          prompt: `If ${w} J of work is done in ${t} seconds, what is the power?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Power = work/time = ${w}/${t} = ${fmtNum(p, 3)} W.`,
        };
      },
    }),
  );
}

{
  const r1 = seq(2, 1, 18);
  const r2 = seq(3, 1, 18);
  templates.push(
    numericTemplate({
      id: "phy:resistors",
      subject: "Physics",
      topic: "Current Electricity",
      difficulty: "Moderate",
      exams: CHEM_WIDE,
      sizes: [r1.length, r2.length, 2],
      build: ([i, j, k]) => {
        const a = r1[i as number] as number;
        const b = r2[j as number] as number;
        if (a >= b) return null;
        const series = a + b;
        const parallel = round((a * b) / (a + b), 3);
        const wantSeries = k === 0;
        const value = wantSeries ? series : parallel;
        const options = numericOptions(
          value,
          [wantSeries ? parallel : series, round(a * b, 3), Math.abs(b - a)],
          (v) => `${fmtNum(v, 3)} ohm`,
        );
        return {
          prompt: `Two resistors of ${a} ohm and ${b} ohm are connected in ${wantSeries ? "series" : "parallel"}. Find the equivalent resistance.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: wantSeries
            ? `In series R = R1 + R2 = ${a} + ${b} = ${series} ohm.`
            : `In parallel 1/R = 1/${a} + 1/${b}, so R = ${a} x ${b}/(${a} + ${b}) = ${fmtNum(parallel, 3)} ohm.`,
        };
      },
    }),
  );
}

export const CHEM_EXTRA_TEMPLATES = templates;
