/**
 * English Grammar templates for the "English Grammar" subject.
 *
 * These are the rule-based areas that decide the English section of SSC,
 * Railway, Banking, CTET/TET and state papers: tenses, concord, articles,
 * prepositions, voice, narration and error spotting. The existing
 * `english.ts` file covers vocabulary under "English Language"; this file
 * covers the grammar chapters of the school and teaching syllabus.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

const EG = [
  "SSC",
  "Railway",
  "Banking",
  "UPSC/SSC/Bank",
  "CUET",
  "CBSE MCQ",
  "State Teacher/TET",
  "PSTET/CTET",
  "Punjab Police",
  "NDA/CDS",
  "SSC CGL",
  "SSC CHSL",
  "SSC MTS",
  "SSC GD Constable",
  "RRB NTPC",
  "RRB Group D",
  "RRB ALP",
  "CAPF",
  "State PSC",
];

const templates: Template[] = [];

function add(
  id: string,
  topic: string,
  difficulty: "Easy" | "Moderate" | "Difficult",
  rows: FactRow[],
  forward: string,
  reverse: string | undefined,
  explain: string,
  matchLabel?: string,
) {
  templates.push(
    ...factTemplate({
      id,
      subject: "English Grammar",
      topic,
      difficulty,
      exams: EG,
      rows,
      forward,
      reverse,
      explain,
    }),
    matchTemplate({
      id,
      subject: "English Grammar",
      topic,
      difficulty,
      exams: EG,
      rows,
      label: matchLabel,
    }),
    statementTemplate({
      id,
      subject: "English Grammar",
      topic,
      difficulty,
      exams: EG,
      rows,
      label: matchLabel,
    }),
    statementCountTemplate({
      id,
      subject: "English Grammar",
      topic,
      difficulty,
      exams: EG,
      rows,
      label: matchLabel,
    }),
  );
}

/* ---------------------------------------------------------------- tenses */

add(
  "eg:tense-use",
  "Tenses",
  "Moderate",
  [
    { key: "Simple Present", value: "Used for habitual actions and universal truths" },
    { key: "Present Continuous", value: "Used for an action going on at the time of speaking" },
    {
      key: "Present Perfect",
      value: "Used for an action just completed whose effect still remains",
    },
    {
      key: "Present Perfect Continuous",
      value: "Used for an action that began in the past and is still continuing",
    },
    { key: "Simple Past", value: "Used for an action completed at a definite time in the past" },
    { key: "Past Continuous", value: "Used for an action going on at some time in the past" },
    { key: "Past Perfect", value: "Used for the earlier of two past actions" },
    { key: "Simple Future", value: "Used for an action that will happen later" },
    {
      key: "Future Perfect",
      value: "Used for an action that will be finished before a future time",
    },
  ],
  "What is the correct use of the %s tense?",
  "Which tense is '%s'?",
  "The %k tense is %v.",
  "tense and its use",
);

add(
  "eg:tense-form",
  "Tenses",
  "Easy",
  [
    { key: "He ___ to school every day", value: "goes" },
    { key: "She ___ a letter at the moment", value: "is writing" },
    { key: "They ___ already finished the work", value: "have" },
    { key: "I ___ him yesterday", value: "met" },
    { key: "We ___ for the bus when it started raining", value: "were waiting" },
    { key: "The train ___ before we reached the station", value: "had left" },
    { key: "He ___ the book by next Monday", value: "will have read" },
    { key: "Water ___ at one hundred degrees Celsius", value: "boils" },
    { key: "She has been teaching here ___ 2010", value: "since" },
    { key: "I have known him ___ five years", value: "for" },
  ],
  "Fill in the blank with the correct form: %s.",
  undefined,
  "The correct answer is %v, because the sentence '%k' requires that form.",
  "sentence and the correct form",
);

/* -------------------------------------------------------- subject-verb */

add(
  "eg:concord",
  "Subject-Verb Agreement",
  "Moderate",
  [
    { key: "Each of the boys ___ present", value: "is" },
    { key: "Neither of the answers ___ correct", value: "is" },
    { key: "The quality of the mangoes ___ not good", value: "was" },
    { key: "Bread and butter ___ my breakfast", value: "is" },
    { key: "The jury ___ divided in their opinion", value: "were" },
    { key: "Mathematics ___ my favourite subject", value: "is" },
    { key: "Ten kilometres ___ a long distance", value: "is" },
    { key: "One of my friends ___ a doctor", value: "is" },
    { key: "Either he or his brothers ___ coming", value: "are" },
    { key: "The number of students ___ increasing", value: "is" },
    { key: "A number of students ___ absent today", value: "are" },
    { key: "News ___ travelling fast these days", value: "is" },
  ],
  "Choose the correct verb: %s.",
  undefined,
  "'%k' takes the verb %v by the rule of subject-verb agreement.",
  "sentence and the correct verb",
);

/* ------------------------------------------------------------- articles */

add(
  "eg:article",
  "Articles and Determiners",
  "Easy",
  [
    { key: "He is ___ honest man", value: "an" },
    { key: "She is ___ university student", value: "a" },
    { key: "___ sun rises in the east", value: "The" },
    { key: "He is ___ best boy in the class", value: "the" },
    { key: "I saw ___ one-rupee coin", value: "a" },
    { key: "___ Ganga is a holy river", value: "The" },
    { key: "He plays ___ guitar very well", value: "the" },
    { key: "Gold is ___ precious metal", value: "a" },
    { key: "He was ___ M.L.A. of this area", value: "an" },
    { key: "___ Himalayas protect India from cold winds", value: "The" },
  ],
  "Fill in the blank with the correct article: %s.",
  undefined,
  "The correct article in '%k' is %v.",
  "sentence and the correct article",
);

/* --------------------------------------------------------- prepositions */

add(
  "eg:prep-fixed",
  "Prepositions",
  "Moderate",
  [
    { key: "He is good ___ mathematics", value: "at" },
    { key: "She is married ___ a doctor", value: "to" },
    { key: "He is angry ___ his friend", value: "with" },
    { key: "I congratulated him ___ his success", value: "on" },
    { key: "He died ___ malaria", value: "of" },
    { key: "She insisted ___ going there", value: "on" },
    { key: "He is afraid ___ dogs", value: "of" },
    { key: "We should abide ___ the rules", value: "by" },
    { key: "He is senior ___ me", value: "to" },
    { key: "She is fond ___ music", value: "of" },
    { key: "He was accused ___ theft", value: "of" },
    { key: "I am confident ___ my success", value: "of" },
  ],
  "Fill in the blank with the correct preposition: %s.",
  undefined,
  "The correct preposition in '%k' is %v.",
  "sentence and the correct preposition",
);

/* ---------------------------------------------------------------- voice */

add(
  "eg:voice-rule",
  "Voice",
  "Moderate",
  [
    { key: "He writes a letter", value: "A letter is written by him" },
    { key: "She is singing a song", value: "A song is being sung by her" },
    { key: "They have finished the work", value: "The work has been finished by them" },
    { key: "He wrote a novel", value: "A novel was written by him" },
    { key: "The boy was flying a kite", value: "A kite was being flown by the boy" },
    { key: "She will complete the task", value: "The task will be completed by her" },
    { key: "Open the door", value: "Let the door be opened" },
    { key: "Who broke the glass?", value: "By whom was the glass broken?" },
    {
      key: "People speak English all over the world",
      value: "English is spoken all over the world",
    },
  ],
  "What is the passive voice of '%s'?",
  "What is the active voice of '%s'?",
  "The passive form of '%k' is '%v'.",
  "active and passive voice",
);

/* ------------------------------------------------------------- narration */

add(
  "eg:narration",
  "Narration",
  "Difficult",
  [
    { key: "Reporting verb 'say to' in indirect speech", value: "Changes to 'tell'" },
    {
      key: "An imperative sentence in indirect speech",
      value: "Reporting verb changes to order, request or advise",
    },
    {
      key: "An interrogative sentence beginning with a helping verb",
      value: "Introduced by 'if' or 'whether'",
    },
    { key: "Simple present in direct speech", value: "Changes to simple past in indirect speech" },
    {
      key: "Present continuous in direct speech",
      value: "Changes to past continuous in indirect speech",
    },
    {
      key: "Present perfect in direct speech",
      value: "Changes to past perfect in indirect speech",
    },
    { key: "The word 'now' in indirect speech", value: "Changes to 'then'" },
    { key: "The word 'today' in indirect speech", value: "Changes to 'that day'" },
    { key: "The word 'tomorrow' in indirect speech", value: "Changes to 'the next day'" },
    { key: "The word 'here' in indirect speech", value: "Changes to 'there'" },
    { key: "A universal truth in indirect speech", value: "The tense does not change" },
  ],
  "In reported speech, what happens to '%s'?",
  "Which rule of narration states that '%s'?",
  "%k: %v.",
  "narration rule and its effect",
);

/* ---------------------------------------------------------- error spotting */

add(
  "eg:error",
  "Error Spotting",
  "Difficult",
  [
    { key: "He is one of the best student in the class", value: "'student' should be 'students'" },
    { key: "I have visited Delhi last year", value: "'have visited' should be 'visited'" },
    { key: "He is senior than me", value: "'than' should be 'to'" },
    { key: "She is more cleverer than her sister", value: "'more cleverer' should be 'cleverer'" },
    { key: "The furnitures are very costly", value: "'furnitures' should be 'furniture'" },
    { key: "He returned back from Delhi", value: "'returned back' should be 'returned'" },
    { key: "Each of the students were given a prize", value: "'were' should be 'was'" },
    { key: "He discussed about the problem", value: "'discussed about' should be 'discussed'" },
    { key: "I am living here since 2015", value: "'am living' should be 'have been living'" },
    { key: "Let you and I go together", value: "'I' should be 'me'" },
  ],
  "Identify the error in the sentence: '%s'.",
  undefined,
  "In '%k', %v.",
  "sentence and its error",
);

/* ------------------------------------------------------ reading / usage */

add(
  "eg:phrasal",
  "Reading Comprehension",
  "Moderate",
  [
    { key: "Call off", value: "To cancel" },
    { key: "Put off", value: "To postpone" },
    { key: "Give up", value: "To abandon or stop doing something" },
    { key: "Look after", value: "To take care of" },
    { key: "Break down", value: "To stop functioning" },
    { key: "Carry out", value: "To perform or execute" },
    { key: "Bring up", value: "To raise a child" },
    { key: "Turn down", value: "To reject" },
    { key: "Run out of", value: "To exhaust the supply of something" },
    { key: "Get along with", value: "To have a friendly relationship with" },
    { key: "Look into", value: "To investigate" },
    { key: "Put up with", value: "To tolerate" },
  ],
  "What does the phrasal verb '%s' mean?",
  "Which phrasal verb means '%s'?",
  "%k means %v.",
  "phrasal verb and its meaning",
);

export const ENGLISH_GRAMMAR_TEMPLATES = templates;
