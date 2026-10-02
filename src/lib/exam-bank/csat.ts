/**
 * CSAT — the Civil Services Aptitude Test, General Studies Paper II of the
 * UPSC preliminary examination, also used by several State PSCs.
 *
 * The paper is qualifying at 33 per cent, so candidates need format fidelity
 * more than volume: comprehension, interpersonal and communication skills,
 * logical reasoning and analytical ability, decision making and problem
 * solving, general mental ability, basic numeracy and data interpretation.
 */

import {
  type Difficulty,
  type Template,
  fmtNum,
  literalTemplate,
  numericOptions,
  numericTemplate,
  round,
  textOptions,
} from "./core";
import { chapterFactory } from "./two-layer";

const CSAT_EXAMS = ["UPSC CSE", "State PSC", "PPSC Punjab", "Punjab PCS", "CAPF"];

const templates: Template[] = [];
const chapter = chapterFactory(templates, "CSAT", CSAT_EXAMS);

type Built = { prompt: string; answer: string; distractors: string[]; explanation: string };

function add(
  id: string,
  topic: string,
  difficulty: Difficulty,
  sizes: number[],
  build: (c: number[]) => Built | null,
) {
  templates.push(
    numericTemplate({ id, subject: "CSAT", topic, difficulty, exams: CSAT_EXAMS, sizes, build }),
  );
}

/* ====================================================== comprehension == */

chapter(
  "csat:comprehension",
  "Comprehension",
  "In CSAT comprehension, what is %s?",
  "%k is %v.",
  [
    {
      key: "The central idea question",
      value: "a question asking for the single point the whole passage is built around",
    },
    {
      key: "The correct way to treat outside knowledge",
      value: "it must be set aside, because only what the passage states or implies can be used",
    },
    {
      key: "An inference",
      value: "a conclusion the passage makes necessary, not merely one it makes possible",
    },
    { key: "An assumption", value: "something the author takes as true without stating it" },
    {
      key: "The commonest trap option",
      value: "a statement that is true in general but goes beyond the passage",
    },
    {
      key: "An extreme option",
      value:
        "an option using words such as always, never or only, rarely supported by a balanced passage",
    },
    {
      key: "The value of the first and last sentences",
      value: "they usually carry the author's framing and conclusion",
    },
    {
      key: "A tone question",
      value: "a question about the author's attitude, such as critical, neutral or appreciative",
    },
    {
      key: "The best reading order",
      value:
        "read the passage once for sense, then read each question and return to the relevant lines",
    },
    {
      key: "A vocabulary in context question",
      value: "a question asking what a word means as used in that particular sentence",
    },
  ],
  [
    {
      key: "The difference between an inference and a restatement",
      value:
        "a restatement repeats the passage in other words, while an inference adds a step the passage compels",
    },
    {
      key: "The treatment of a conditional statement",
      value: "if the passage says if A then B, it does not follow that if B then A",
    },
    {
      key: "A most logical and rational option",
      value:
        "the option that respects the passage, avoids extremes and needs no outside assumption",
    },
    {
      key: "Passages with two views",
      value: "the author's own position must be separated from the view being reported",
    },
    {
      key: "The danger of partial truth",
      value:
        "an option may state something the passage says, yet still not answer the question asked",
    },
  ],
);

chapter(
  "csat:interpersonal",
  "Interpersonal and Communication Skills",
  "In interpersonal and communication skills, what is %s?",
  "%k is %v.",
  [
    {
      key: "Communication",
      value: "the exchange of meaning between a sender and a receiver through a shared code",
    },
    {
      key: "Feedback",
      value: "the receiver's response, which tells the sender whether the message was understood",
    },
    {
      key: "Noise in communication",
      value: "anything physical or psychological that distorts the message",
    },
    {
      key: "Non-verbal communication",
      value: "meaning carried by posture, gesture, expression and tone rather than words",
    },
    {
      key: "Active listening",
      value: "listening with full attention and confirming understanding before responding",
    },
    {
      key: "Empathy",
      value: "the capacity to understand another person's feelings from their point of view",
    },
    {
      key: "Assertiveness",
      value: "stating one's position clearly while respecting the rights of others",
    },
    {
      key: "Formal communication",
      value: "communication that follows the official chain of an organisation",
    },
    {
      key: "Informal communication",
      value: "the grapevine, which spreads outside official channels",
    },
    {
      key: "Barrier of semantic origin",
      value: "a barrier caused by differences in the meaning attached to words",
    },
  ],
  [
    {
      key: "Downward communication",
      value: "instructions and policy flowing from a superior to subordinates",
    },
    {
      key: "Upward communication",
      value: "reports, suggestions and grievances flowing from subordinates to superiors",
    },
    {
      key: "Horizontal communication",
      value: "exchange between officers of equal rank for coordination",
    },
    {
      key: "Emotional intelligence",
      value: "the ability to recognise and manage one's own and others' emotions",
    },
    {
      key: "Conflict resolution by collaboration",
      value: "seeking a solution that meets the substantive concerns of both sides",
    },
  ],
);

chapter(
  "csat:decision-making",
  "Decision Making and Problem Solving",
  "In decision making for a public servant, what is the sound response when %s?",
  "When %k, the sound response is %v.",
  [
    {
      key: "a subordinate makes an honest mistake that has already been corrected",
      value:
        "counsel the subordinate privately and record the lesson, rather than start punitive action",
    },
    {
      key: "two departments give conflicting written instructions",
      value:
        "put the conflict on record and seek a written clarification from the common superior authority",
    },
    {
      key: "a citizen is unable to produce a document because of a genuine hardship",
      value: "look for a lawful alternative proof and help the citizen complete the process",
    },
    {
      key: "an influential person seeks an out of turn favour",
      value: "explain the rule courteously and deal with the case strictly by its turn",
    },
    {
      key: "a decision must be taken urgently and the file is incomplete",
      value: "take the minimum decision the emergency requires and record the reasons for it",
    },
    {
      key: "a junior colleague raises a valid objection in public",
      value: "acknowledge the point, examine it and correct the course if the objection is right",
    },
    {
      key: "a scheme is popular but the funds sanctioned are insufficient",
      value: "prioritise transparently on stated criteria and report the shortfall upward",
    },
    {
      key: "a rumour spreads that may cause public panic",
      value: "issue a prompt, factual and verifiable clarification through official channels",
    },
    {
      key: "a colleague asks you to conceal a minor irregularity",
      value: "decline, and advise the colleague to report and regularise it",
    },
    {
      key: "the public is angry about a delay for which your office is responsible",
      value: "acknowledge the delay, give a firm timeline and fix accountability internally",
    },
  ],
  [
    {
      key: "a lawful order appears unwise in the circumstances",
      value: "carry out the order while placing your reasoned objection on record",
    },
    {
      key: "personal interest could be read into an official decision",
      value: "disclose the interest and recuse yourself from that decision",
    },
    {
      key: "relief must be distributed and the list is disputed",
      value: "verify with an independent survey, publish the list and allow a short appeal window",
    },
    {
      key: "a whistleblower in your office fears retaliation",
      value: "protect the identity, examine the complaint on merits and prevent any adverse action",
    },
    {
      key: "an approved procedure is producing an unjust result in a class of cases",
      value:
        "follow the procedure in the pending case and simultaneously propose a reasoned amendment",
    },
  ],
);

/* ================================================= general mental ability */

add("csat:mental:series", "General Mental Ability", "Moderate", [15, 12, 4], ([ai, di, qi]) => {
  const a = 3 + (ai as number);
  const d = 2 + (di as number);
  const kind = qi as number;
  const terms: number[] = [];
  let why = "";
  if (kind === 0) {
    for (let i = 0; i < 6; i += 1) terms.push(a + i * d);
    why = `each term increases by ${d}`;
  } else if (kind === 1) {
    for (let i = 0; i < 6; i += 1) terms.push(a + (i * (i + 1) * d) / 2);
    why = `the gaps themselves increase by ${d} each time`;
  } else if (kind === 2) {
    let cur = a;
    for (let i = 0; i < 6; i += 1) {
      terms.push(cur);
      cur = cur * 2 + d;
    }
    why = `each term is twice the previous term plus ${d}`;
  } else {
    for (let i = 0; i < 6; i += 1) terms.push(a * a + i * i * d);
    why = `the squares of 0, 1, 2 and so on multiplied by ${d} are added to ${a * a}`;
  }
  const answer = terms[5] as number;
  if (!Number.isInteger(answer) || Math.abs(answer) > 2_000_000) return null;
  const shown = terms.slice(0, 5).map(String).join(", ");
  const opts = numericOptions(answer, [answer + d, answer + 2 * d, answer + 1, answer - 1], (v) =>
    fmtNum(v, 0),
  );
  return {
    prompt: `What comes next in the series?\n${shown}, ?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `In this series ${why}, so the next term is ${fmtNum(answer, 0)}.`,
  };
});

add("csat:mental:order", "General Mental Ability", "Moderate", [12, 10, 10], ([ti, li, ri]) => {
  const total = 25 + (ti as number);
  const fromLeft = 6 + (li as number);
  const fromRight = 5 + (ri as number);
  if (fromLeft + fromRight > total + 1) return null;
  const between = total - fromLeft - fromRight;
  if (between < 0) return null;
  const opts = numericOptions(
    between,
    [between + 1, between - 1, total - fromLeft, total - fromRight],
    (v) => fmtNum(v, 0),
  );
  return {
    prompt:
      `In a row of ${total} students, Anil is ${fromLeft}th from the left end and Bhavna is ` +
      `${fromRight}th from the right end. How many students are there between them?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `Anil occupies position ${fromLeft} from the left and Bhavna occupies position ` +
      `${total - fromRight + 1} from the left. The students strictly between them number ` +
      `${total} - ${fromLeft} - ${fromRight} = ${between}.`,
  };
});

/* ======================================================= basic numeracy = */

add("csat:numeracy:percent", "Basic Numeracy", "Moderate", [12, 12, 3], ([bi, pi, qi]) => {
  const base = 200 + (bi as number) * 50;
  const pct = 5 + (pi as number) * 5;
  const q = qi as number;
  if (q === 0) {
    const answer = round((base * pct) / 100, 2);
    const opts = numericOptions(
      answer,
      [round(answer / 10, 2), round(answer * 2, 2), round(answer / 2, 2), round(answer * 10, 2)],
      (v) => fmtNum(v, 2),
    );
    return {
      prompt: `What is ${pct} per cent of ${base}?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `${pct} per cent of ${base} = ${base} x ${pct} / 100 = ${fmtNum(answer, 2)}.`,
    };
  }
  if (q === 1) {
    const increased = round(base * (1 + pct / 100), 2);
    const opts = numericOptions(
      increased,
      [base, round(base * (1 - pct / 100), 2), round(increased + base, 2), round(base + pct, 2)],
      (v) => fmtNum(v, 2),
    );
    return {
      prompt: `If ${base} is increased by ${pct} per cent, what is the new value?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `The increase is ${fmtNum((base * pct) / 100, 2)}, so the new value is ${base} + ${fmtNum((base * pct) / 100, 2)} = ${fmtNum(increased, 2)}.`,
    };
  }
  const after = round(base * (1 + pct / 100) * (1 - pct / 100), 2);
  const netPct = round(-((pct * pct) / 100), 2);
  const opts = numericOptions(
    after,
    [
      base,
      round(base * (1 + pct / 100), 2),
      round(base * (1 - pct / 100), 2),
      round(after + base, 2),
    ],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt:
      `The price of an item is first increased by ${pct} per cent and then decreased by ${pct} per cent. ` +
      `If the original price was ${base} rupees, what is the final price?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `A rise and an equal fall always leave a net loss of ${fmtNum(Math.abs(netPct), 2)} per cent, ` +
      `so the final price is ${base} x ${fmtNum(1 + pct / 100, 4)} x ${fmtNum(1 - pct / 100, 4)} = ${fmtNum(after, 2)} rupees.`,
  };
});

add(
  "csat:numeracy:ratio-average",
  "Basic Numeracy",
  "Moderate",
  [10, 10, 10, 2],
  ([ai, bi, ci, qi]) => {
    const p = 2 + (ai as number);
    const q2 = 3 + (bi as number);
    const k = 4 + (ci as number);
    const part = k * 120;
    if (p === q2) return null;
    if ((qi as number) === 0) {
      const total = (p + q2) * part;
      const share = p * part;
      const opts = numericOptions(
        share,
        [q2 * part, total, total - share, Math.round(total / 2)],
        (v) => fmtNum(v, 0),
      );
      return {
        prompt:
          `An amount of ${total} rupees is divided between two persons in the ratio ${p} : ${q2}. ` +
          `What is the share of the first person?`,
        answer: opts.answer,
        distractors: opts.distractors,
        explanation:
          `The total is divided into ${p} + ${q2} = ${p + q2} parts, so one part is ${total} / ${p + q2} = ${part}. ` +
          `The first share is ${p} x ${part} = ${share} rupees.`,
      };
    }
    const nums = [k, k + p, k + q2, k + p + q2, k + 2 * p];
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = round(sum / nums.length, 2);
    const opts = numericOptions(
      avg,
      [sum, round(avg + 1, 2), round(avg - 1, 2), round(sum / 4, 2)],
      (v) => fmtNum(v, 2),
    );
    return {
      prompt: `What is the average of the numbers ${nums.join(", ")}?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `The sum is ${nums.join(" + ")} = ${sum}, and dividing by ${nums.length} gives ${fmtNum(avg, 2)}.`,
    };
  },
);

add("csat:numeracy:time-work", "Basic Numeracy", "Difficult", [10, 10], ([ai, bi]) => {
  const a = 6 + (ai as number);
  const b = 8 + (bi as number);
  if (a === b) return null;
  const together = round((a * b) / (a + b), 2);
  const opts = numericOptions(together, [a, b, round(a + b, 2), round((a + b) / 2, 2)], (v) =>
    fmtNum(v, 2),
  );
  return {
    prompt:
      `A can finish a piece of work in ${a} days and B can finish the same work in ${b} days. ` +
      `Working together, in how many days will they finish it?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation:
      `In one day A does 1/${a} and B does 1/${b} of the work, together ${fmtNum(1 / a + 1 / b, 4)} of it. ` +
      `So the whole work takes ${a} x ${b} / (${a} + ${b}) = ${fmtNum(together, 2)} days.`,
  };
});

/* ================================================== data interpretation = */

add("csat:di:bar", "Data Interpretation", "Moderate", [10, 10, 5], ([s1, s2, qi]) => {
  const items = ["Rice", "Wheat", "Maize", "Pulses", "Oilseeds"];
  const wobble = [0, 37, -14, 52, -23];
  const yearOne = items.map(
    (_, i) =>
      180 +
      (s1 as number) * 7 +
      i * 34 +
      (i % 2 === 0 ? i * i * 9 : -i * 6) +
      (wobble[i] as number),
  );
  const yearTwo = items.map(
    (_, i) =>
      (yearOne[i] as number) +
      18 +
      (s2 as number) * 4 +
      (i % 3 === 0 ? i * 21 : -i * 5) +
      ((wobble[(i + 2) % 5] as number) % 29),
  );
  const table =
    `Crop | 2022 | 2023\n` + items.map((c, i) => `${c} | ${yearOne[i]} | ${yearTwo[i]}`).join("\n");
  const head = `The table shows the output, in thousand tonnes, of five crops in a district.\n${table}\n`;
  const q = qi as number;
  if (q === 0) {
    const total = yearTwo.reduce((a, b) => a + b, 0);
    const opts = numericOptions(
      total,
      [yearOne.reduce((a, b) => a + b, 0), total + 50, total - 50, Math.round(total / 5)],
      (v) => fmtNum(v, 0),
    );
    return {
      prompt: `${head}What was the total output of all five crops in 2023?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `Adding the 2023 column, ${yearTwo.join(" + ")} = ${total} thousand tonnes.`,
    };
  }
  if (q === 1) {
    let best = 0;
    let bestGrowth = -Infinity;
    for (let i = 0; i < items.length; i += 1) {
      const g = ((yearTwo[i] as number) - (yearOne[i] as number)) / (yearOne[i] as number);
      if (g > bestGrowth) {
        bestGrowth = g;
        best = i;
      }
    }
    const answer = items[best] as string;
    const opts = textOptions(answer, items, s1 as number);
    if (!opts) return null;
    return {
      prompt: `${head}Which crop recorded the highest percentage growth from 2022 to 2023?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation:
        `The percentage growth for each crop is ` +
        items
          .map(
            (c, i) =>
              `${c} ${fmtNum((((yearTwo[i] as number) - (yearOne[i] as number)) * 100) / (yearOne[i] as number), 1)}`,
          )
          .join(", ") +
        `, and the highest of these is ${answer}.`,
    };
  }
  if (q === 2) {
    const i = (s2 as number) % items.length;
    const diff = (yearTwo[i] as number) - (yearOne[i] as number);
    const opts = numericOptions(
      diff,
      [Math.abs(diff) + 10, Math.abs(diff) - 10, yearOne[i] as number, yearTwo[i] as number],
      (v) => fmtNum(v, 0),
    );
    return {
      prompt: `${head}By how many thousand tonnes did the output of ${items[i]} change between 2022 and 2023?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `The change is ${yearTwo[i]} - ${yearOne[i]} = ${diff} thousand tonnes.`,
    };
  }
  if (q === 3) {
    const total = yearTwo.reduce((a, b) => a + b, 0);
    const i = (s1 as number) % items.length;
    const share = round(((yearTwo[i] as number) * 100) / total, 2);
    const opts = numericOptions(
      share,
      [round(100 - share, 2), round(share + 5, 2), 20, round(share / 2, 2)],
      (v) => fmtNum(v, 2),
    );
    return {
      prompt: `${head}In 2023, ${items[i]} accounted for what percentage of the total output of the five crops?`,
      answer: opts.answer,
      distractors: opts.distractors,
      explanation: `The share is ${yearTwo[i]} x 100 / ${total} = ${fmtNum(share, 2)} per cent.`,
    };
  }
  const avgOne = round(yearOne.reduce((a, b) => a + b, 0) / 5, 2);
  const opts = numericOptions(
    avgOne,
    [
      round(yearTwo.reduce((a, b) => a + b, 0) / 5, 2),
      round(avgOne + 20, 2),
      round(avgOne - 20, 2),
      yearOne.reduce((a, b) => a + b, 0),
    ],
    (v) => fmtNum(v, 2),
  );
  return {
    prompt: `${head}What was the average output per crop in 2022?`,
    answer: opts.answer,
    distractors: opts.distractors,
    explanation: `The 2022 total is ${yearOne.reduce((a, b) => a + b, 0)} thousand tonnes, so the average is ${fmtNum(avgOne, 2)} thousand tonnes.`,
  };
});

/* =========================================== logical and analytical ===== */

const LOGIC_ITEMS: Built[] = [
  {
    prompt:
      "Statement: All members of the committee who attended the meeting signed the register. " +
      "Rahul did not sign the register.\nWhich conclusion follows necessarily?",
    answer: "Rahul did not attend the meeting",
    distractors: [
      "Rahul is not a member of the committee",
      "Rahul attended the meeting but forgot to sign",
      "Some members who attended did not sign",
    ],
    explanation:
      "The statement says attendance implies signing. Since Rahul did not sign, he cannot have attended. " +
      "Nothing is said about his membership.",
  },
  {
    prompt:
      "Statement: If the dam is opened, the low lying fields will be flooded. The low lying fields are flooded.\n" +
      "Which conclusion follows necessarily?",
    answer: "Nothing definite can be concluded about the dam",
    distractors: ["The dam was opened", "The dam was not opened", "The dam will be opened again"],
    explanation:
      "Affirming the consequent is invalid. The fields may have been flooded by rain or some other cause, " +
      "so the state of the dam cannot be concluded.",
  },
  {
    prompt:
      "Statement: No student who submitted the assignment late was awarded full marks. " +
      "Sita was awarded full marks.\nWhich conclusion follows necessarily?",
    answer: "Sita did not submit the assignment late",
    distractors: [
      "Sita submitted the assignment first",
      "Every student who submitted on time got full marks",
      "Sita is the best student in the class",
    ],
    explanation:
      "Late submission rules out full marks. Since Sita got full marks, she cannot have submitted late. " +
      "The converse claim about on-time students does not follow.",
  },
  {
    prompt:
      "Statement: Every officer in the department either knows Punjabi or knows Hindi. " +
      "Mohan is an officer in the department and does not know Hindi.\nWhich conclusion follows necessarily?",
    answer: "Mohan knows Punjabi",
    distractors: [
      "Mohan knows both Punjabi and Hindi",
      "Mohan knows neither language",
      "All officers know Punjabi",
    ],
    explanation:
      "The statement is an inclusive either-or. With Hindi ruled out for Mohan, the remaining option, Punjabi, must hold.",
  },
  {
    prompt:
      "Statement: Whenever the tender value exceeds one crore rupees, the approval of the head office is required. " +
      "A tender was approved by the head office.\nWhich conclusion follows necessarily?",
    answer: "Nothing definite can be said about the value of that tender",
    distractors: [
      "The tender value exceeded one crore rupees",
      "The tender value was below one crore rupees",
      "Head office approval is never needed below one crore rupees",
    ],
    explanation:
      "The rule only tells us what must happen above one crore. Head office approval may also be taken in other cases, " +
      "so the value cannot be inferred.",
  },
  {
    prompt:
      "Statement: Only those candidates who cleared the written test were called for the interview. " +
      "Kiran was called for the interview.\nWhich conclusion follows necessarily?",
    answer: "Kiran cleared the written test",
    distractors: [
      "Kiran will be selected",
      "Everyone who cleared the written test was called",
      "Kiran scored the highest in the written test",
    ],
    explanation:
      "The word only makes clearing the written test a necessary condition for the interview call, " +
      "so Kiran must have cleared it. It does not make the condition sufficient.",
  },
  {
    prompt:
      "Statement: All the files cleared on Monday were signed by the Director. " +
      "Some files signed by the Director were returned with objections.\nWhich conclusion follows necessarily?",
    answer: "It is possible that some files cleared on Monday were returned with objections",
    distractors: [
      "All files cleared on Monday were returned with objections",
      "No file cleared on Monday was returned with objections",
      "The Director signs only files that carry objections",
    ],
    explanation:
      "The files returned with objections may or may not overlap with Monday's files, " +
      "so only a statement of possibility is safe.",
  },
  {
    prompt:
      "Statement: A person can be enrolled in the scheme only if the person is both a resident of the district " +
      "and above sixty years of age. Ramesh is above sixty years of age.\nWhich conclusion follows necessarily?",
    answer: "Ramesh may or may not be enrolled in the scheme",
    distractors: [
      "Ramesh is enrolled in the scheme",
      "Ramesh is a resident of the district",
      "Ramesh cannot be enrolled in the scheme",
    ],
    explanation:
      "Age is only one of two necessary conditions. Without knowing about residence, nothing definite can be said.",
  },
  {
    prompt:
      "Statement: The bus leaves at six only if all passengers have boarded by five fifty. " +
      "The bus left at six today.\nWhich conclusion follows necessarily?",
    answer: "All passengers had boarded by five fifty",
    distractors: [
      "Some passengers boarded after five fifty",
      "The bus leaves at six every day",
      "The bus was full today",
    ],
    explanation:
      "Only if introduces a necessary condition for the six o'clock departure, so the departure guarantees that the condition was met.",
  },
  {
    prompt:
      "Statement: Unless the grant is released, the construction will stop. The construction has not stopped.\n" +
      "Which conclusion follows necessarily?",
    answer: "The grant was released",
    distractors: [
      "The grant was not released",
      "The construction will stop soon",
      "The grant will be released next month",
    ],
    explanation:
      "Unless A, B means if not A then B. Since B, the stoppage, did not happen, A, the release of the grant, must have happened.",
  },
  {
    prompt:
      "Statement: In the office, every clerk reports to a superintendent and every superintendent reports to an officer. " +
      "Sunita is a clerk.\nWhich conclusion follows necessarily?",
    answer: "Sunita's reporting chain eventually reaches an officer",
    distractors: [
      "Sunita reports directly to an officer",
      "Sunita is also a superintendent",
      "Every officer supervises exactly one superintendent",
    ],
    explanation:
      "Sunita reports to a superintendent, who in turn reports to an officer, so the chain reaches an officer, though not directly.",
  },
  {
    prompt:
      "Statement: Most of the villages in the block have a primary school, and all villages with a primary school " +
      "have a drinking water facility.\nWhich conclusion follows necessarily?",
    answer: "Most of the villages in the block have a drinking water facility",
    distractors: [
      "All villages in the block have a drinking water facility",
      "No village without a school has water",
      "Every village has both a school and water",
    ],
    explanation:
      "Most villages have schools, and schools guarantee water, so at least that same majority must have water. " +
      "Villages without schools may still have water, so no universal claim follows.",
  },
];

templates.push(
  literalTemplate({
    id: "csat:logical-analytical",
    subject: "CSAT",
    topic: "Logical Reasoning and Analytical Ability",
    difficulty: "Difficult",
    exams: CSAT_EXAMS,
    items: LOGIC_ITEMS,
  }),
);

export const CSAT_TEMPLATES = templates;
