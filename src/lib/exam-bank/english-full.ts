/**
 * English Language and English Grammar — the rest of the syllabus.
 *
 * `english.ts` covers synonyms, antonyms, idioms, one word substitution and
 * spellings; `english-grammar.ts` covers tenses, articles, prepositions,
 * voice, narration, subject-verb agreement, error spotting and comprehension.
 * This file adds every remaining chapter that SSC, banking, railway, defence,
 * CUET and state papers set.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const ENG_EXAMS = [
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
  "Punjab Police",
  "Punjab Clerk",
  "State Clerk",
  "PSSSB",
  "PSTET/CTET",
  "Punjab Master Cadre",
  "Punjab ETT Cadre",
];

const templates: Template[] = [];
const lang = chapterFactory(templates, "English Language", ENG_EXAMS);
const gram = chapterFactory(templates, "English Grammar", ENG_EXAMS);

/* ================================================== English Language === */

lang(
  "eng:phrasal-verbs",
  "Phrasal Verbs",
  "What does the phrasal verb %s mean?",
  "The phrasal verb %k means %v.",
  [
    { key: "call off", value: "to cancel" },
    { key: "put off", value: "to postpone" },
    { key: "give in", value: "to surrender or yield" },
    { key: "look after", value: "to take care of" },
    { key: "break down", value: "to stop working" },
    { key: "carry out", value: "to perform or execute" },
    { key: "turn down", value: "to reject" },
    { key: "bring up", value: "to raise a child or raise a topic" },
    { key: "get along", value: "to have a friendly relationship" },
    { key: "run out of", value: "to exhaust the supply of something" },
  ],
  [
    { key: "bear out", value: "to confirm or support the truth of something" },
    { key: "cut back on", value: "to reduce the amount of something" },
    { key: "fall through", value: "to fail to be completed" },
    { key: "iron out", value: "to settle difficulties or differences" },
    { key: "wind up", value: "to bring something to a close" },
  ],
  "Which phrasal verb means %s?",
);

lang(
  "eng:confusables",
  "Commonly Confused Words",
  "Which word correctly completes the sentence: %s?",
  "The correct word is %v, because %k requires exactly that sense.",
  [
    { key: "The teacher gave us good ___ about the examination", value: "advice" },
    { key: "Please ___ me on which course to choose", value: "advise" },
    { key: "The new rules will ___ every student", value: "affect" },
    { key: "The ___ of the new rules was immediate", value: "effect" },
    { key: "I have fewer books ___ my brother has", value: "than" },
    { key: "We went to the library and ___ we came home", value: "then" },
    { key: "The dog wagged ___ tail happily", value: "its" },
    { key: "___ going to rain this evening", value: "It is" },
    { key: "She is standing over ___ near the gate", value: "there" },
    { key: "The players collected ___ medals", value: "their" },
  ],
  [
    { key: "The committee will ___ the new proposal at once", value: "adopt" },
    { key: "He had to ___ himself to the cold climate", value: "adapt" },
    { key: "The principal gave his ___ to the trip", value: "assent" },
    { key: "The steep ___ of the hill tired us", value: "ascent" },
    { key: "The law applies to all citizens without ___", value: "exception" },
  ],
);

lang(
  "eng:sentence-improvement",
  "Sentence Improvement",
  "Choose the correct improvement of the given sentence: %s",
  "The corrected sentence is: %v. The original is wrong because of the grammar of %k.",
  [
    { key: "He is senior than me", value: "He is senior to me" },
    { key: "One of my friend is a doctor", value: "One of my friends is a doctor" },
    { key: "I am living here since 2019", value: "I have been living here since 2019" },
    { key: "She did not came to school yesterday", value: "She did not come to school yesterday" },
    { key: "The both brothers are honest", value: "Both the brothers are honest" },
    { key: "He is more cleverer than his brother", value: "He is cleverer than his brother" },
    { key: "Let he and I settle the matter", value: "Let him and me settle the matter" },
    { key: "Each of the boys were given a prize", value: "Each of the boys was given a prize" },
    { key: "I prefer tea than coffee", value: "I prefer tea to coffee" },
    { key: "He returned back from Delhi last night", value: "He returned from Delhi last night" },
  ],
  [
    {
      key: "Scarcely had he entered the room than the bell rang",
      value: "Scarcely had he entered the room when the bell rang",
    },
    {
      key: "No sooner did he see the police when he ran away",
      value: "No sooner did he see the police than he ran away",
    },
    {
      key: "The reason of his failure is laziness",
      value: "The reason for his failure is laziness",
    },
    {
      key: "He is one of the best student in the class",
      value: "He is one of the best students in the class",
    },
    { key: "I would rather to walk than take a bus", value: "I would rather walk than take a bus" },
  ],
);

lang(
  "eng:fill-blanks",
  "Fill in the Blanks",
  "Choose the word that best fills the blank: %s",
  "The blank is best filled by %v, which fits the sense of %k.",
  [
    { key: "The scientist made a remarkable ___ in cancer research", value: "breakthrough" },
    { key: "His arguments were so ___ that nobody could refute them", value: "convincing" },
    { key: "The minister gave an ___ reply that satisfied nobody", value: "evasive" },
    { key: "Heavy rain caused a ___ in the match", value: "delay" },
    { key: "The witness gave a ___ account of the accident", value: "detailed" },
    { key: "She was praised for her ___ to duty", value: "devotion" },
    { key: "The medicine gave him instant ___ from pain", value: "relief" },
    { key: "The teacher tried to ___ the difficult concept", value: "simplify" },
    { key: "Poverty remains a ___ problem in many countries", value: "persistent" },
    { key: "The company decided to ___ its old machinery", value: "replace" },
  ],
  [
    { key: "The court found the evidence too ___ to convict him", value: "flimsy" },
    { key: "His ___ remarks offended the entire gathering", value: "caustic" },
    { key: "The treaty was signed after ___ negotiations", value: "protracted" },
    { key: "She accepted the award with characteristic ___", value: "modesty" },
    { key: "The manager was asked to ___ the report before the meeting", value: "abridge" },
  ],
);

lang(
  "eng:cloze",
  "Cloze Test",
  "In the passage on public libraries, which word best fits the blank marked %s?",
  "Blank %k takes %v, because that is the only choice that fits both the grammar and the sense of the sentence.",
  [
    { key: "one", value: "institution" },
    { key: "two", value: "freely" },
    { key: "three", value: "regardless" },
    { key: "four", value: "borrow" },
    { key: "five", value: "quiet" },
    { key: "six", value: "encourage" },
    { key: "seven", value: "resources" },
    { key: "eight", value: "community" },
    { key: "nine", value: "membership" },
    { key: "ten", value: "maintained" },
  ],
  [
    { key: "eleven", value: "indispensable" },
    { key: "twelve", value: "custodian" },
    { key: "thirteen", value: "dissemination" },
    { key: "fourteen", value: "equitable" },
    { key: "fifteen", value: "patronage" },
  ],
);

lang(
  "eng:active-passive",
  "Active and Passive Voice",
  "What is the correct passive form of the sentence: %s?",
  "The passive form of %k is %v.",
  [
    { key: "Ravi writes a letter", value: "A letter is written by Ravi" },
    { key: "The teacher praised the student", value: "The student was praised by the teacher" },
    { key: "They are building a bridge", value: "A bridge is being built by them" },
    { key: "She has completed the project", value: "The project has been completed by her" },
    { key: "The gardener waters the plants", value: "The plants are watered by the gardener" },
    { key: "Someone stole my bicycle", value: "My bicycle was stolen" },
    { key: "We will announce the result tomorrow", value: "The result will be announced tomorrow" },
    {
      key: "The police have arrested the thief",
      value: "The thief has been arrested by the police",
    },
    { key: "Open the door", value: "Let the door be opened" },
    { key: "Who broke the window", value: "By whom was the window broken" },
  ],
  [
    { key: "People say that he is honest", value: "It is said that he is honest" },
    { key: "One should keep one's promises", value: "Promises should be kept" },
    {
      key: "They were repairing the road when I passed",
      value: "The road was being repaired when I passed",
    },
    { key: "You must finish the work today", value: "The work must be finished by you today" },
    {
      key: "The committee is considering the proposal",
      value: "The proposal is being considered by the committee",
    },
  ],
);

lang(
  "eng:narration-full",
  "Direct and Indirect Speech",
  "What is the correct indirect form of the sentence: %s?",
  "In indirect speech, %k becomes %v.",
  [
    { key: "He said, 'I am busy today'", value: "He said that he was busy that day" },
    { key: "She said, 'I will come tomorrow'", value: "She said that she would come the next day" },
    { key: "He said to me, 'Where are you going?'", value: "He asked me where I was going" },
    { key: "The teacher said, 'Open your books'", value: "The teacher told us to open our books" },
    {
      key: "He said, 'What a beautiful sight!'",
      value: "He exclaimed that it was a very beautiful sight",
    },
    {
      key: "She said, 'I have finished my homework'",
      value: "She said that she had finished her homework",
    },
    { key: "He said to her, 'Please help me'", value: "He requested her to help him" },
    {
      key: "Mother said, 'Do not touch the stove'",
      value: "Mother warned me not to touch the stove",
    },
    {
      key: "He said, 'The sun rises in the east'",
      value: "He said that the sun rises in the east",
    },
    {
      key: "She said, 'I was reading a novel'",
      value: "She said that she had been reading a novel",
    },
  ],
  [
    {
      key: "He said, 'I shall have finished by then'",
      value: "He said that he would have finished by then",
    },
    {
      key: "She said to him, 'Let us go for a walk'",
      value: "She suggested to him that they should go for a walk",
    },
    {
      key: "He said, 'Alas! I have lost my purse'",
      value: "He exclaimed with sorrow that he had lost his purse",
    },
    {
      key: "The officer said, 'Who has broken this rule?'",
      value: "The officer asked who had broken that rule",
    },
    {
      key: "He said, 'If I were rich, I would travel'",
      value: "He said that if he were rich, he would travel",
    },
  ],
);

lang(
  "eng:para-jumbles",
  "Para Jumbles and Sentence Rearrangement",
  "In the rearrangement exercise on %s, which sentence should come first?",
  "In the passage on %k, the opening sentence is: %v.",
  [
    {
      key: "the importance of reading",
      value: "Reading is the cheapest way of travelling to other worlds",
    },
    {
      key: "the monsoon in India",
      value: "The Indian monsoon arrives on the Kerala coast in the first week of June",
    },
    {
      key: "digital payments",
      value: "Digital payments have grown faster in India than almost anywhere else",
    },
    {
      key: "the water crisis",
      value: "Water is the one resource for which there is no substitute",
    },
    {
      key: "school examinations",
      value: "Examinations were meant to measure learning, not to replace it",
    },
    {
      key: "renewable energy",
      value: "Sunlight is the most abundant source of energy available to the earth",
    },
    {
      key: "urban traffic",
      value: "Every large Indian city is now planned around the car rather than the walker",
    },
    { key: "the value of sport", value: "A playing field teaches lessons that a classroom cannot" },
    {
      key: "public transport",
      value: "A city is judged not by its cars but by the buses its rich are willing to use",
    },
    { key: "waste management", value: "Waste becomes a problem only when it is mixed" },
  ],
  [
    {
      key: "the role of libraries",
      value: "A library is the only public building where silence is an act of service",
    },
    {
      key: "artificial intelligence at work",
      value: "Every new technology first frightens the worker before it reshapes the work",
    },
    {
      key: "food security",
      value: "A country is food secure only when its poorest household can afford a full meal",
    },
    { key: "climate adaptation", value: "Adaptation begins where prevention has already failed" },
    {
      key: "the gig economy",
      value: "Flexible work has been sold as freedom and bought as insecurity",
    },
  ],
);

lang(
  "eng:foreign-phrases",
  "Foreign Words and Phrases",
  "What does the expression %s mean?",
  "%k means %v.",
  [
    { key: "bona fide", value: "genuine or in good faith" },
    { key: "status quo", value: "the existing state of affairs" },
    { key: "vice versa", value: "the other way round" },
    { key: "ad hoc", value: "for a particular purpose only" },
    { key: "de facto", value: "in fact, whether by right or not" },
    { key: "prima facie", value: "at first sight" },
    { key: "carte blanche", value: "full discretionary power" },
    { key: "en masse", value: "all together" },
    { key: "in toto", value: "in full, entirely" },
    { key: "sine die", value: "without a fixed date for resumption" },
  ],
  [
    { key: "sine qua non", value: "an essential condition" },
    { key: "fait accompli", value: "a thing already done and beyond alteration" },
    { key: "ex gratia", value: "given as a favour rather than a legal obligation" },
    { key: "sub judice", value: "under judicial consideration" },
    { key: "quid pro quo", value: "something given in return for something else" },
  ],
  "Which expression means %s?",
);

lang(
  "eng:comprehension-skills",
  "Reading Comprehension Skills",
  "In reading comprehension, what does %s test?",
  "%k tests %v.",
  [
    {
      key: "A main idea question",
      value: "whether the reader can state the central point of the passage in one line",
    },
    {
      key: "An inference question",
      value: "whether the reader can draw a conclusion the passage implies but does not state",
    },
    {
      key: "A vocabulary in context question",
      value: "whether the reader can fix the meaning of a word from the surrounding sentence",
    },
    {
      key: "A tone question",
      value: "whether the reader can identify the writer's attitude to the subject",
    },
    {
      key: "A fact based question",
      value: "whether the reader can locate information stated directly in the passage",
    },
    {
      key: "A title question",
      value: "whether the reader can compress the whole passage into a short heading",
    },
    {
      key: "An assumption question",
      value: "whether the reader can identify what the writer takes for granted",
    },
    {
      key: "A weakening question",
      value: "whether the reader can find a fact that would damage the writer's argument",
    },
    {
      key: "The best first step in comprehension",
      value: "reading the passage once for the overall idea before touching the questions",
    },
    {
      key: "The commonest comprehension error",
      value: "choosing an option that is true in the world but not stated in the passage",
    },
  ],
  [
    {
      key: "An except question",
      value: "whether the reader can eliminate the three options the passage supports",
    },
    {
      key: "A strengthening question",
      value: "whether the reader can find new information that supports the writer's conclusion",
    },
    {
      key: "A structure question",
      value: "whether the reader can describe the role a paragraph plays in the argument",
    },
    {
      key: "An analogy question",
      value:
        "whether the reader can match the logical relationship of the passage to a new situation",
    },
    {
      key: "An author's purpose question",
      value: "whether the reader can state why the passage was written rather than what it says",
    },
  ],
);

/* =================================================== English Grammar === */

gram(
  "eng:gram:nouns",
  "Nouns",
  "In the study of nouns, what is %s?",
  "%k is %v.",
  [
    {
      key: "A proper noun",
      value: "the name of a particular person, place or thing, always capitalised",
    },
    {
      key: "A common noun",
      value: "a name shared by every member of a class, such as boy or city",
    },
    { key: "A collective noun", value: "a word for a group taken as one, such as team or jury" },
    {
      key: "An abstract noun",
      value: "the name of a quality, state or action, such as honesty or freedom",
    },
    { key: "A material noun", value: "the name of a substance, such as gold or wood" },
    {
      key: "A countable noun",
      value: "a noun that has a plural form and can take a number before it",
    },
    {
      key: "An uncountable noun",
      value: "a noun that has no plural and takes much rather than many",
    },
    { key: "The plural of 'child'", value: "children, an irregular plural" },
    { key: "The plural of 'criterion'", value: "criteria" },
    { key: "The plural of 'mouse'", value: "mice" },
  ],
  [
    {
      key: "The plural of 'passer-by'",
      value: "passers-by, since the principal word takes the plural",
    },
    { key: "The plural of 'commander-in-chief'", value: "commanders-in-chief" },
    {
      key: "A noun always used in the plural",
      value: "scissors, trousers and spectacles, which take a plural verb",
    },
    {
      key: "A noun plural in form but singular in use",
      value: "news, mathematics and physics, which take a singular verb",
    },
    {
      key: "The possessive of a plural noun ending in s",
      value: "formed by adding only an apostrophe, as in the boys' hostel",
    },
  ],
);

gram(
  "eng:gram:pronouns",
  "Pronouns",
  "In the study of pronouns, what is %s?",
  "%k is %v.",
  [
    { key: "A personal pronoun", value: "a pronoun standing for a person, such as I, you or they" },
    {
      key: "A reflexive pronoun",
      value: "a pronoun ending in self or selves that turns the action back on the subject",
    },
    {
      key: "A relative pronoun",
      value: "a pronoun such as who, which or that which joins a clause to a noun",
    },
    {
      key: "A demonstrative pronoun",
      value: "a pronoun that points out, such as this, that, these or those",
    },
    {
      key: "An interrogative pronoun",
      value: "a pronoun used to ask a question, such as who or what",
    },
    {
      key: "An indefinite pronoun",
      value: "a pronoun referring to no particular person, such as someone or anybody",
    },
    {
      key: "The pronoun after a preposition",
      value: "always in the objective case, as in between you and me",
    },
    { key: "The pronoun used for a collective noun acting as one", value: "the singular it" },
    { key: "The correct form in 'Let ___ go'", value: "the objective case, as in let him go" },
    {
      key: "The order of pronouns in good usage",
      value: "second person, then third person, then first person, as in you, he and I",
    },
  ],
  [
    {
      key: "The pronoun after 'than' in a comparison",
      value: "the nominative when the verb is understood, as in he is taller than I am",
    },
    {
      key: "The relative pronoun used for the whole preceding clause",
      value: "which, as in he was late, which annoyed everyone",
    },
    {
      key: "The correct relative pronoun after a superlative",
      value: "that, as in this is the best book that I have read",
    },
    {
      key: "The pronoun with 'each', 'every' and 'either'",
      value: "always singular, so each of the boys has his own bag",
    },
    {
      key: "The reciprocal pronouns",
      value: "each other for two persons and one another for more than two",
    },
  ],
);

gram(
  "eng:gram:adjectives",
  "Adjectives and Degrees of Comparison",
  "In the study of adjectives, what is %s?",
  "%k is %v.",
  [
    { key: "The comparative of 'good'", value: "better" },
    { key: "The superlative of 'good'", value: "best" },
    { key: "The comparative of 'bad'", value: "worse" },
    { key: "The comparative of 'little'", value: "less" },
    { key: "The comparative of 'many'", value: "more" },
    { key: "The three degrees of comparison", value: "positive, comparative and superlative" },
    { key: "The adjective used with a plural countable noun", value: "many, as in many students" },
    { key: "The adjective used with an uncountable noun", value: "much, as in much water" },
    {
      key: "The correct form after 'the two'",
      value: "the comparative, as in the better of the two",
    },
    {
      key: "The order of adjectives before a noun",
      value: "opinion, size, age, shape, colour, origin, material, purpose",
    },
  ],
  [
    {
      key: "The rule with 'superior' and 'inferior'",
      value: "they take to, not than, as in superior to the rest",
    },
    { key: "The rule with 'prefer'", value: "it takes to, as in I prefer coffee to tea" },
    {
      key: "Adjectives that cannot be compared",
      value: "absolute adjectives such as unique, perfect and eternal",
    },
    {
      key: "The correct comparison with 'any other'",
      value: "used with the comparative, as in he is taller than any other boy",
    },
    {
      key: "The double comparative error",
      value: "using more with an adjective already in the comparative, as in more better",
    },
  ],
);

gram(
  "eng:gram:adverbs",
  "Adverbs",
  "In the study of adverbs, what is %s?",
  "%k is %v.",
  [
    {
      key: "An adverb of manner",
      value: "an adverb telling how an action is done, such as quickly",
    },
    { key: "An adverb of time", value: "an adverb telling when, such as yesterday or soon" },
    { key: "An adverb of place", value: "an adverb telling where, such as here or outside" },
    {
      key: "An adverb of frequency",
      value: "an adverb telling how often, such as always or rarely",
    },
    { key: "An adverb of degree", value: "an adverb telling how much, such as very or almost" },
    {
      key: "The position of an adverb of frequency",
      value: "before the main verb but after the verb to be",
    },
    { key: "The adverb form of 'happy'", value: "happily" },
    { key: "The adverb form of 'true'", value: "truly, dropping the final e" },
    {
      key: "The difference between 'hard' and 'hardly'",
      value: "hard means with effort while hardly means scarcely",
    },
    {
      key: "The difference between 'late' and 'lately'",
      value: "late means after time while lately means recently",
    },
  ],
  [
    {
      key: "The rule for 'only'",
      value: "it must be placed immediately before the word it limits",
    },
    {
      key: "The difference between 'still', 'yet' and 'already'",
      value:
        "still shows continuation, yet is used in negatives and questions, already shows earlier completion",
    },
    {
      key: "The rule for two negatives",
      value:
        "two negatives in one clause make a positive and are treated as an error in formal English",
    },
    {
      key: "The adverb used with a comparative for emphasis",
      value: "much or far, as in much better, not very better",
    },
    {
      key: "The position of 'enough'",
      value: "after the adjective or adverb it modifies, as in good enough",
    },
  ],
);

gram(
  "eng:gram:conjunctions",
  "Conjunctions",
  "In the study of conjunctions, what is %s?",
  "%k is %v.",
  [
    {
      key: "A coordinating conjunction",
      value: "a conjunction joining two equal clauses, such as and, but or or",
    },
    {
      key: "A subordinating conjunction",
      value:
        "a conjunction joining a dependent clause to a main clause, such as because or although",
    },
    {
      key: "A correlative conjunction",
      value: "a conjunction used in pairs, such as either and or",
    },
    { key: "The partner of 'either'", value: "or" },
    { key: "The partner of 'neither'", value: "nor" },
    { key: "The partner of 'not only'", value: "but also" },
    { key: "The partner of 'hardly'", value: "when" },
    { key: "The partner of 'no sooner'", value: "than" },
    { key: "The partner of 'scarcely'", value: "when" },
    { key: "The conjunction used for contrast", value: "but, although or whereas" },
  ],
  [
    {
      key: "The error with 'although' and 'but'",
      value: "using both in one sentence, since one conjunction is enough",
    },
    {
      key: "The error with 'because' and 'so'",
      value: "using both in one sentence, as in because he was ill so he stayed at home",
    },
    {
      key: "The rule for correlative placement",
      value: "the paired words must be followed by the same part of speech on each side",
    },
    {
      key: "The conjunction after 'lest'",
      value: "should, and never not, as in lest he should fall",
    },
    {
      key: "The conjunction used with 'such'",
      value: "that, as in such a loud noise that nobody could sleep",
    },
  ],
);

gram(
  "eng:gram:modals",
  "Modals and Auxiliaries",
  "In the study of modals, what does %s express?",
  "%k expresses %v.",
  [
    { key: "can", value: "ability or informal permission" },
    { key: "could", value: "past ability or a polite request" },
    { key: "may", value: "permission or a possibility" },
    { key: "might", value: "a weaker possibility than may" },
    { key: "must", value: "strong obligation or a firm conclusion" },
    { key: "should", value: "advice or moral duty" },
    { key: "ought to", value: "moral obligation" },
    { key: "shall", value: "a promise, command or an offer in a question" },
    { key: "will", value: "future action or willingness" },
    { key: "need not", value: "the absence of necessity" },
  ],
  [
    { key: "must have plus past participle", value: "a confident conclusion about the past" },
    {
      key: "should have plus past participle",
      value: "an obligation in the past that was not fulfilled",
    },
    { key: "could have plus past participle", value: "an unrealised past possibility" },
    { key: "used to", value: "a discontinued past habit" },
    {
      key: "dare and need as modals",
      value: "they take the bare infinitive in negatives and questions",
    },
  ],
);

gram(
  "eng:gram:question-tags",
  "Question Tags",
  "Choose the correct question tag for the sentence: %s",
  "The sentence %k takes the tag %v.",
  [
    { key: "He is a doctor,", value: "isn't he?" },
    { key: "She does not like tea,", value: "does she?" },
    { key: "They have finished the work,", value: "haven't they?" },
    { key: "You will come tomorrow,", value: "won't you?" },
    { key: "We can start now,", value: "can't we?" },
    { key: "Ravi went to Delhi,", value: "didn't he?" },
    { key: "It is not raining,", value: "is it?" },
    { key: "Open the window,", value: "will you?" },
    { key: "Let us go for a walk,", value: "shall we?" },
    { key: "I am right,", value: "aren't I?" },
  ],
  [
    { key: "Nobody came to the meeting,", value: "did they?" },
    { key: "Everything is ready,", value: "isn't it?" },
    { key: "He hardly ever speaks,", value: "does he?" },
    { key: "There is little water in the pot,", value: "is there?" },
    { key: "You had better leave now,", value: "hadn't you?" },
  ],
);

gram(
  "eng:gram:clauses",
  "Clauses and Sentence Types",
  "In the study of clauses, what is %s?",
  "%k is %v.",
  [
    { key: "A simple sentence", value: "a sentence with one subject and one finite verb" },
    {
      key: "A compound sentence",
      value: "a sentence with two or more main clauses joined by a coordinating conjunction",
    },
    {
      key: "A complex sentence",
      value: "a sentence with one main clause and at least one subordinate clause",
    },
    { key: "A noun clause", value: "a subordinate clause that does the work of a noun" },
    { key: "An adjective clause", value: "a subordinate clause that qualifies a noun" },
    {
      key: "An adverb clause",
      value: "a subordinate clause that modifies a verb, adjective or adverb",
    },
    { key: "A phrase", value: "a group of words without a finite verb" },
    { key: "A clause", value: "a group of words with a subject and a finite verb" },
    { key: "A declarative sentence", value: "a sentence that makes a statement" },
    { key: "An imperative sentence", value: "a sentence that gives a command or a request" },
  ],
  [
    {
      key: "A defining relative clause",
      value: "a clause essential to the meaning, written without commas",
    },
    {
      key: "A non-defining relative clause",
      value: "a clause giving extra information, set off by commas",
    },
    {
      key: "A compound complex sentence",
      value: "a sentence with at least two main clauses and one subordinate clause",
    },
    {
      key: "An elliptical clause",
      value: "a clause in which words understood from the context are left out",
    },
    {
      key: "A conditional clause of the third type",
      value: "a past unreal condition, using had plus past participle and would have",
    },
  ],
);

gram(
  "eng:gram:punctuation",
  "Punctuation and Capitalisation",
  "In punctuation, what is the rule about %s?",
  "The rule about %k is that %v.",
  [
    { key: "the full stop", value: "it ends a complete statement and marks many abbreviations" },
    { key: "the question mark", value: "it ends a direct question but not an indirect one" },
    { key: "the comma in a list", value: "it separates items in a series of three or more" },
    { key: "the apostrophe in possessives", value: "it shows ownership, as in the boy's book" },
    { key: "the apostrophe in contractions", value: "it marks the letters left out, as in don't" },
    { key: "quotation marks", value: "they enclose the exact words of a speaker" },
    { key: "the colon", value: "it introduces a list, an explanation or a quotation" },
    { key: "the semicolon", value: "it joins two closely related independent clauses" },
    { key: "capital letters", value: "they begin a sentence and every proper noun" },
    { key: "the exclamation mark", value: "it follows an interjection or a strong feeling" },
  ],
  [
    {
      key: "the comma before a non-defining clause",
      value: "it is required, because the clause only adds extra information",
    },
    {
      key: "the dash",
      value: "it marks an abrupt break in thought or encloses a parenthetical remark",
    },
    {
      key: "the hyphen in compound adjectives",
      value: "it joins words acting as one adjective before a noun, as in a well-known writer",
    },
    {
      key: "the apostrophe with joint possession",
      value: "only the last noun takes the apostrophe, as in Ram and Shyam's shop",
    },
    {
      key: "the full stop inside quotation marks",
      value: "it goes inside when the quoted words form a complete sentence",
    },
  ],
);

gram(
  "eng:gram:non-finites",
  "Infinitives, Gerunds and Participles",
  "In the study of non-finite verbs, what is %s?",
  "%k is %v.",
  [
    {
      key: "An infinitive",
      value: "the base form of a verb, usually with to, acting as a noun, adjective or adverb",
    },
    { key: "A gerund", value: "the ing form of a verb used as a noun" },
    {
      key: "A present participle",
      value: "the ing form of a verb used as an adjective or in continuous tenses",
    },
    {
      key: "A past participle",
      value: "the third form of a verb, used in perfect tenses and the passive",
    },
    { key: "The form after a preposition", value: "the gerund, as in he is good at swimming" },
    { key: "The form after 'enjoy'", value: "the gerund, as in she enjoys reading" },
    { key: "The form after 'want'", value: "the to infinitive, as in he wants to leave" },
    { key: "The form after a modal", value: "the bare infinitive, as in he can swim" },
    { key: "The form after 'let' and 'make'", value: "the bare infinitive, as in let him go" },
    {
      key: "A dangling participle",
      value: "a participle whose implied subject is not the subject of the main clause",
    },
  ],
  [
    {
      key: "The difference between 'stop to smoke' and 'stop smoking'",
      value: "the first means pausing in order to smoke and the second means giving up smoking",
    },
    {
      key: "The difference between 'remember to post' and 'remember posting'",
      value: "the first looks forward to a task and the second recalls a past act",
    },
    {
      key: "The form after 'look forward to'",
      value: "the gerund, because to is a preposition here",
    },
    {
      key: "The perfect infinitive",
      value: "to have plus the past participle, used for an action earlier than the main verb",
    },
    {
      key: "The split infinitive",
      value:
        "an adverb placed between to and the verb, now widely accepted but avoided in formal writing",
    },
  ],
);

export const ENGLISH_FULL_TEMPLATES = templates;
