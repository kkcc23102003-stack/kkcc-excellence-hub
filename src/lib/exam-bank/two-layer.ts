/**
 * Shared two-layer chapter builder and the exam tag presets.
 *
 * Every chapter written with `chapter()` produces two layers:
 *
 *   - **Moderate** — the working knowledge of the chapter. The Kit 2 Coins
 *     practice quiz draws from here, because practice should build fluency.
 *   - **Difficult** — the advanced, exam-oriented, most-asked items. The paid
 *     test series and the unlimited advanced test draw from here.
 *
 * Keeping the builder in one place means every new chapter file gets both
 * layers automatically and none of them can drift out of shape.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

/** Staff selection and railway recruitment. */
export const SSC_RRB = [
  "SSC",
  "SSC CGL",
  "SSC CHSL",
  "SSC MTS",
  "SSC GD Constable",
  "Railway",
  "RRB NTPC",
  "RRB Group D",
  "RRB ALP",
  "UPSC/SSC/Bank",
];

/** Banking and insurance recruitment. */
export const BANKING = ["Banking", "UPSC/SSC/Bank"];

/** Civil services, defence and state services. */
export const CIVIL_DEFENCE = [
  "UPSC CSE",
  "State PSC",
  "PPSC Punjab",
  "Punjab PCS",
  "NDA/CDS",
  "CAPF",
];

/** Punjab state recruitment boards and cadres. */
export const PUNJAB_STATE = [
  "PPSC Punjab",
  "Punjab PCS",
  "PSSSB",
  "Punjab Patwari",
  "Punjab Police",
  "Punjab Clerk",
  "Punjab ETT Cadre",
  "Punjab Master Cadre",
  "Punjab Lecturer Cadre",
  "PSTET/CTET",
  "State Clerk",
  "State Police",
  "State Teacher/TET",
];

/** The widest general-awareness audience: almost every recruitment exam. */
export const GK_WIDE = [
  ...new Set([...SSC_RRB, ...BANKING, ...CIVIL_DEFENCE, ...PUNJAB_STATE, "CUET"]),
];

/** Aptitude papers: SSC, railways, banking, defence and state clerical. */
export const APTITUDE_WIDE = [
  ...new Set([
    ...SSC_RRB,
    ...BANKING,
    "NDA/CDS",
    "CAPF",
    "State PSC",
    "Punjab Patwari",
    "Punjab Police",
    "Punjab Clerk",
    "State Clerk",
    "PSSSB",
    "CUET",
  ]),
];

export type ChapterSpec = {
  id: string;
  subject: string;
  topic: string;
  exams: string[];
  /** `%s` is replaced by the key. */
  forward: string;
  /** `%s` is replaced by the value. Optional. */
  reverse?: string | undefined;
  /** `%k` and `%v` are replaced by key and value. */
  explain: string;
  /** Moderate working layer — feeds the Kit 2 Coins practice quiz. */
  rows: FactRow[];
  /** Difficult exam layer — feeds the paid series and the advanced test. */
  hard: FactRow[];
};

/** Appends both layers of one chapter to `sink`. */
export function chapterInto(sink: Template[], opts: ChapterSpec) {
  const base = { subject: opts.subject, topic: opts.topic, exams: opts.exams };
  sink.push(
    ...factTemplate({
      ...base,
      id: opts.id,
      difficulty: "Moderate",
      rows: opts.rows,
      forward: opts.forward,
      reverse: opts.reverse,
      explain: opts.explain,
    }),
    matchTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
    statementTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
    statementCountTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
  );
  if (opts.hard.length >= 3) {
    const hid = `${opts.id}:adv`;
    sink.push(
      ...factTemplate({
        ...base,
        id: hid,
        difficulty: "Difficult",
        rows: opts.hard,
        forward: opts.forward,
        reverse: opts.reverse,
        explain: opts.explain,
      }),
      matchTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
      statementTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
      statementCountTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
    );
  }
}

/**
 * Convenience factory: binds a subject and an exam list once, so a file full
 * of chapters stays readable.
 */
export function chapterFactory(sink: Template[], subject: string, exams: string[]) {
  return (
    id: string,
    topic: string,
    forward: string,
    explain: string,
    rows: FactRow[],
    hard: FactRow[],
    reverse?: string,
  ) => chapterInto(sink, { id, subject, topic, exams, forward, reverse, explain, rows, hard });
}
