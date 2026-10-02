/**
 * English Language templates — vocabulary, idioms, one word substitution and
 * grammar as asked in Bank, SSC, Railway and CUET papers.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
  numericTemplate,
} from "./core";

const ENG = [
  "Banking",
  "SSC",
  "Railway",
  "UPSC/SSC/Bank",
  "CUET",
  "CBSE MCQ",
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
const templates: Template[] = [];

function add(
  id: string,
  topic: string,
  difficulty: "Easy" | "Moderate" | "Difficult",
  rows: FactRow[],
  forward: string,
  reverse: string | undefined,
  explain: string,
) {
  templates.push(
    ...factTemplate({
      id,
      subject: "English Language",
      topic,
      difficulty,
      exams: ENG,
      rows,
      forward,
      reverse,
      explain,
    }),
    matchTemplate({ id, subject: "English Language", topic, difficulty, exams: ENG, rows }),
    statementTemplate({ id, subject: "English Language", topic, difficulty, exams: ENG, rows }),
    statementCountTemplate({
      id,
      subject: "English Language",
      topic,
      difficulty,
      exams: ENG,
      rows,
    }),
  );
}

/* -------------------------------------------------------------- synonyms */

add(
  "eng:synonym",
  "Synonyms",
  "Easy",
  [
    { key: "Abundant", value: "Plentiful" },
    { key: "Benevolent", value: "Kind-hearted" },
    { key: "Candid", value: "Frank" },
    { key: "Diligent", value: "Hardworking" },
    { key: "Eloquent", value: "Fluent" },
    { key: "Frugal", value: "Thrifty" },
    { key: "Gregarious", value: "Sociable" },
    { key: "Hostile", value: "Unfriendly" },
    { key: "Immense", value: "Enormous" },
    { key: "Jubilant", value: "Overjoyed" },
    { key: "Lucid", value: "Clear" },
    { key: "Meticulous", value: "Extremely careful" },
    { key: "Novice", value: "Beginner" },
    { key: "Obsolete", value: "Outdated" },
    { key: "Perilous", value: "Dangerous" },
    { key: "Quaint", value: "Charmingly old-fashioned" },
    { key: "Reluctant", value: "Unwilling" },
    { key: "Sagacious", value: "Wise" },
    { key: "Tenacious", value: "Persistent" },
    { key: "Vivid", value: "Bright and clear" },
    { key: "Zealous", value: "Enthusiastic" },
    { key: "Astute", value: "Shrewd" },
    { key: "Brevity", value: "Shortness" },
    { key: "Coerce", value: "Compel by force" },
    { key: "Deficit", value: "Shortfall" },
  ],
  "Choose the word that is most nearly the SAME in meaning as '%s'.",
  undefined,
  "'%k' means '%v'; the two words have similar meanings in this context.",
);

/* -------------------------------------------------------------- antonyms */

add(
  "eng:antonym",
  "Antonyms",
  "Moderate",
  [
    { key: "Abundant", value: "Scarce" },
    { key: "Ancient", value: "Modern" },
    { key: "Benevolent", value: "Malevolent" },
    { key: "Brave", value: "Cowardly" },
    { key: "Complex", value: "Simple" },
    { key: "Condemn", value: "Praise" },
    { key: "Diligent", value: "Lazy" },
    { key: "Expand", value: "Contract" },
    { key: "Frugal", value: "Extravagant" },
    { key: "Genuine", value: "Fake" },
    { key: "Humble", value: "Arrogant" },
    { key: "Optimist", value: "Pessimist" },
    { key: "Permanent", value: "Temporary" },
    { key: "Rigid", value: "Flexible" },
    { key: "Scarcity", value: "Abundance" },
    { key: "Transparent", value: "Opaque" },
    { key: "Victory", value: "Defeat" },
    { key: "Wise", value: "Foolish" },
    { key: "Accept", value: "Reject" },
    { key: "Ascend", value: "Descend" },
  ],
  "Choose the word that is most nearly the OPPOSITE in meaning to '%s'.",
  undefined,
  "The opposite of '%k' is %v.",
);

/* ---------------------------------------------------------------- idioms */

add(
  "eng:idiom",
  "Idioms and Phrases",
  "Moderate",
  [
    { key: "A blessing in disguise", value: "Something that seems bad but turns out good" },
    { key: "Once in a blue moon", value: "Very rarely" },
    { key: "To beat about the bush", value: "To avoid coming to the main point" },
    { key: "To let the cat out of the bag", value: "To reveal a secret unintentionally" },
    { key: "A piece of cake", value: "Something very easy to do" },
    { key: "To burn the midnight oil", value: "To work or study late into the night" },
    { key: "To bite the dust", value: "To fail or be defeated" },
    { key: "To turn a deaf ear", value: "To ignore what someone is saying" },
    { key: "To be in hot water", value: "To be in trouble" },
    { key: "To make a mountain out of a molehill", value: "To exaggerate a small problem" },
    { key: "To cost an arm and a leg", value: "To be very expensive" },
    { key: "To hit the nail on the head", value: "To say exactly the right thing" },
    { key: "To smell a rat", value: "To suspect something is wrong" },
    { key: "To be on cloud nine", value: "To be extremely happy" },
    { key: "To call it a day", value: "To stop working for the day" },
    { key: "To keep one's fingers crossed", value: "To hope for good luck" },
    { key: "To add fuel to the fire", value: "To make a bad situation worse" },
    { key: "To be all ears", value: "To be listening very attentively" },
  ],
  "What does the idiom '%s' mean?",
  "Which idiom means '%s'?",
  "'%k' means %v.",
);

/* ------------------------------------------------- one word substitution */

add(
  "eng:one-word",
  "One Word Substitution",
  "Difficult",
  [
    { key: "One who studies the stars and planets", value: "Astronomer" },
    { key: "One who cannot read or write", value: "Illiterate" },
    { key: "One who eats everything", value: "Omnivorous" },
    { key: "One who eats only vegetables", value: "Vegetarian" },
    { key: "A person who loves mankind", value: "Philanthropist" },
    { key: "A person who hates mankind", value: "Misanthrope" },
    { key: "A government run by the people", value: "Democracy" },
    { key: "A government run by a single ruler", value: "Autocracy" },
    { key: "A speech made without preparation", value: "Extempore" },
    { key: "Something that cannot be believed", value: "Incredible" },
    { key: "Something that cannot be avoided", value: "Inevitable" },
    { key: "A remedy for all diseases", value: "Panacea" },
    { key: "A place where coins are made", value: "Mint" },
    { key: "A place where birds are kept", value: "Aviary" },
    { key: "A list of books available in a library", value: "Catalogue" },
    { key: "The life story of a person written by himself", value: "Autobiography" },
    { key: "The life story of a person written by someone else", value: "Biography" },
    { key: "One who is present everywhere", value: "Omnipresent" },
    { key: "One who knows everything", value: "Omniscient" },
    { key: "One who is all powerful", value: "Omnipotent" },
    { key: "Killing of one's own brother", value: "Fratricide" },
    { key: "Murder of a king", value: "Regicide" },
  ],
  "Give the one word substitution for: %s.",
  undefined,
  "%k is called %v.",
);

/* ------------------------------------------------------------- spellings */

add(
  "eng:spelling",
  "Spellings",
  "Moderate",
  [
    { key: "Accommodation", value: "Accommodation" },
    { key: "Occurrence", value: "Occurrence" },
    { key: "Embarrassment", value: "Embarrassment" },
    { key: "Maintenance", value: "Maintenance" },
    { key: "Questionnaire", value: "Questionnaire" },
    { key: "Millennium", value: "Millennium" },
    { key: "Privilege", value: "Privilege" },
    { key: "Necessary", value: "Necessary" },
    { key: "Separate", value: "Separate" },
    { key: "Definitely", value: "Definitely" },
  ],
  "Which of the following is the correctly spelt word for %s?",
  undefined,
  "The correct spelling is %v.",
);

/* ---------------------------------------------------- grammar: preposition */

{
  const items: { sentence: string; answer: string; others: string[]; why: string }[] = [
    {
      sentence: "She has been living in Ludhiana ___ 2015.",
      answer: "since",
      others: ["for", "from", "by"],
      why: "'Since' is used with a specific point of time, while 'for' is used with a duration.",
    },
    {
      sentence: "He is good ___ mathematics.",
      answer: "at",
      others: ["in", "on", "with"],
      why: "'Good at' is the fixed preposition for a skill or subject.",
    },
    {
      sentence: "The book is ___ the table.",
      answer: "on",
      others: ["in", "at", "into"],
      why: "'On' shows a surface contact.",
    },
    {
      sentence: "She is married ___ a doctor.",
      answer: "to",
      others: ["with", "by", "from"],
      why: "The correct collocation is 'married to' a person.",
    },
    {
      sentence: "He died ___ malaria.",
      answer: "of",
      others: ["from", "by", "with"],
      why: "'Died of' is used with a disease, 'died from' with an injury or external cause.",
    },
    {
      sentence: "I congratulated him ___ his success.",
      answer: "on",
      others: ["for", "at", "with"],
      why: "'Congratulate somebody on something' is the standard usage.",
    },
    {
      sentence: "The train arrived ___ the station at noon.",
      answer: "at",
      others: ["in", "on", "to"],
      why: "'Arrive at' is used for a specific place such as a station.",
    },
    {
      sentence: "Please refrain ___ smoking here.",
      answer: "from",
      others: ["of", "to", "at"],
      why: "'Refrain from' is the fixed phrase.",
    },
    {
      sentence: "He was accused ___ theft.",
      answer: "of",
      others: ["for", "with", "by"],
      why: "'Accused of' is the correct collocation, while 'charged with' takes 'with'.",
    },
    {
      sentence: "She insisted ___ paying the bill.",
      answer: "on",
      others: ["at", "for", "to"],
      why: "'Insist on' is the fixed phrase.",
    },
    {
      sentence: "The meeting was postponed ___ Monday.",
      answer: "till",
      others: ["from", "at", "in"],
      why: "'Postponed till' indicates the new point of time.",
    },
    {
      sentence: "This medicine is a cure ___ headache.",
      answer: "for",
      others: ["of", "to", "against"],
      why: "'A cure for' is the standard collocation.",
    },
  ];
  templates.push(
    numericTemplate({
      id: "eng:preposition",
      subject: "English Language",
      topic: "Prepositions",
      difficulty: "Moderate",
      exams: ENG,
      sizes: [items.length],
      build: ([i]) => {
        const item = items[i as number];
        if (!item) return null;
        return {
          prompt: `Fill in the blank with the correct preposition: ${item.sentence}`,
          answer: item.answer,
          distractors: item.others,
          explanation: item.why,
        };
      },
    }),
  );
}

/* --------------------------------------------------- grammar: error spotting */

{
  const items: { sentence: string; answer: string; others: string[]; why: string }[] = [
    {
      sentence: "One of my friends ___ coming to the party.",
      answer: "is",
      others: ["are", "were", "have"],
      why: "'One of my friends' is singular, so the verb must be singular: 'is'.",
    },
    {
      sentence: "Neither of the two answers ___ correct.",
      answer: "is",
      others: ["are", "were", "have been"],
      why: "'Neither' is singular and takes a singular verb.",
    },
    {
      sentence: "The news ___ very disturbing.",
      answer: "is",
      others: ["are", "were", "have"],
      why: "'News' looks plural but is an uncountable singular noun.",
    },
    {
      sentence: "Each of the boys ___ given a prize.",
      answer: "was",
      others: ["were", "are", "have"],
      why: "'Each' is singular, so the singular verb 'was' is used.",
    },
    {
      sentence: "He as well as his brothers ___ present.",
      answer: "was",
      others: ["were", "are", "have"],
      why: "With 'as well as' the verb agrees with the first subject, which is singular here.",
    },
    {
      sentence: "Mathematics ___ my favourite subject.",
      answer: "is",
      others: ["are", "were", "have been"],
      why: "Subject names ending in -ics take a singular verb.",
    },
    {
      sentence: "Ten kilometres ___ a long distance to walk.",
      answer: "is",
      others: ["are", "were", "have been"],
      why: "A measure treated as a single quantity takes a singular verb.",
    },
    {
      sentence: "The jury ___ divided in their opinion.",
      answer: "were",
      others: ["was", "is", "has"],
      why: "When a collective noun acts as individuals, the plural verb is used.",
    },
    {
      sentence: "Either Rahul or his friends ___ responsible.",
      answer: "are",
      others: ["is", "was", "has"],
      why: "With 'either ... or' the verb agrees with the nearer subject, which is plural.",
    },
    {
      sentence: "He is one of the best players who ___ ever played here.",
      answer: "have",
      others: ["has", "is", "was"],
      why: "'Who' refers to 'players' (plural), so the plural verb 'have' is correct.",
    },
  ];
  templates.push(
    numericTemplate({
      id: "eng:subject-verb",
      subject: "English Language",
      topic: "Subject Verb Agreement",
      difficulty: "Moderate",
      exams: ENG,
      sizes: [items.length],
      build: ([i]) => {
        const item = items[i as number];
        if (!item) return null;
        return {
          prompt: `Fill in the blank with the correct verb: ${item.sentence}`,
          answer: item.answer,
          distractors: item.others,
          explanation: item.why,
        };
      },
    }),
  );
}

export const ENGLISH_TEMPLATES = templates;
