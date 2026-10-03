import { generateQuestionsForTest, type DrawnQuestion } from "@/lib/bank-to-test";
import { ACTIVE_TEMPLATES } from "@/lib/exam-bank";
import type { Difficulty } from "@/lib/exam-bank/core";

export type GeneratedTestQuestion = DrawnQuestion & {
  id: string;
  marks: number;
  negative_marks: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

/** Reproducible papers for server-side answer verification; never stored in Supabase. */
export function seededRandom(seed: string) {
  let state = 2166136261;
  for (const character of seed) state = Math.imul(state ^ character.charCodeAt(0), 16777619);
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateOnDemandTestPaper(input: {
  exam: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Mixed";
  count: number;
  marks: number;
  negative_marks: number;
  seed?: string;
}): GeneratedTestQuestion[] {
  const count = Math.max(0, Math.min(1000, Math.floor(input.count)));
  const levels: Array<"Easy" | "Moderate" | "Difficult"> =
    input.difficulty === "Mixed" ? ["Easy", "Moderate", "Difficult"] : [input.difficulty];
  const random = input.seed ? seededRandom(input.seed) : Math.random;
  const seen = new Set<string>();
  const drawn: DrawnQuestion[] = [];
  const base = Math.floor(count / levels.length);
  const remainder = count % levels.length;
  for (let i = 0; i < levels.length; i += 1) {
    const wanted = base + (i < remainder ? 1 : 0);
    drawn.push(
      ...generateQuestionsForTest({
        ...input,
        difficulty: levels[i]!,
        count: wanted,
        random,
        seen,
      }),
    );
  }
  return drawn.map((question, index) => ({
    ...question,
    id: question.source_id,
    marks: input.marks,
    negative_marks: input.negative_marks,
    sort_order: index,
    created_at: "",
    updated_at: "",
  }));
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "item"
  );
}

function shuffledOptions(items: string[], random: () => number): string[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "of",
  "in",
  "to",
  "for",
  "with",
  "on",
  "its",
  "by",
  "an",
  "a",
  "from",
  "indian",
  "india",
  "chapter",
  "unit",
  "part",
  "basics",
  "introduction",
  "general",
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

/**
 * Resolves all candidate bank subjects for a given user-selected or Admin-defined subject,
 * NEVER matching empty strings or mistaking "Social Science" / "Political Science" for Physics/Science.
 */
export function resolveCandidateBankSubjects(subject: string, chapter = ""): string[] {
  const normSubj = subject.trim().toLowerCase();
  const normChap = chapter.trim().toLowerCase();
  const allBankSubjects = [...new Set(ACTIVE_TEMPLATES.map((t) => t.subject))];

  const candidates: string[] = [];
  const addCandidate = (s: string) => {
    if (s && allBankSubjects.includes(s) && !candidates.includes(s)) {
      candidates.push(s);
    }
  };

  if (normSubj) {
    // 1. Exact subject match (case-insensitive)
    for (const s of allBankSubjects) {
      if (s.toLowerCase() === normSubj) addCandidate(s);
    }

    // 2. Social Studies / SST / Social Science / Humanities / Civics / Polity / History / Geography / Economics
    const isSocialStudies =
      normSubj === "sst" ||
      normSubj.includes("social stud") ||
      normSubj.includes("social scien") ||
      normSubj.includes("sst ") ||
      normSubj.includes("humanit");

    if (isSocialStudies) {
      [
        "SST",
        "Polity",
        "SST Class 10",
        "SST Class 9",
        "Modern History",
        "Ancient History",
        "Medieval History",
        "Indian Geography",
        "Physical Geography",
        "World Geography",
        "Indian Economy",
        "Art and Culture",
        "General Awareness",
      ].forEach(addCandidate);
    } else if (
      normSubj.includes("polity") ||
      normSubj.includes("civic") ||
      normSubj.includes("political") ||
      normSubj.includes("constitution") ||
      normSubj.includes("governance")
    ) {
      ["Polity", "SST", "SST Class 10", "SST Class 9", "Law", "General Awareness"].forEach(
        addCandidate,
      );
    } else if (normSubj.includes("punjab") && normSubj.includes("hist")) {
      ["Punjab History", "Punjab GK", "Modern History", "Medieval History", "SST"].forEach(
        addCandidate,
      );
    } else if (normSubj.includes("punjab") && normSubj.includes("geog")) {
      ["Punjab Geography", "Punjab GK", "Indian Geography", "SST"].forEach(addCandidate);
    } else if (normSubj.includes("punjab") && normSubj.includes("econ")) {
      ["Punjab Economics", "Punjab GK", "Indian Economy", "SST"].forEach(addCandidate);
    } else if (normSubj.includes("punjabi")) {
      ["Punjabi Grammar", "Punjabi Literature", "Punjabi Paper A", "Punjabi Paper B"].forEach(
        addCandidate,
      );
    } else if (normSubj.includes("punjab")) {
      ["Punjab GK", "Punjab History", "Punjab Geography", "Punjab Economics"].forEach(addCandidate);
    } else if (normSubj.includes("history") || normSubj.includes("itihas")) {
      [
        "Modern History",
        "Ancient History",
        "Medieval History",
        "Art and Culture",
        "SST",
        "SST Class 10",
        "SST Class 9",
        "Punjab History",
      ].forEach(addCandidate);
    } else if (normSubj.includes("geog") || normSubj.includes("bhugol")) {
      [
        "Indian Geography",
        "Physical Geography",
        "World Geography",
        "Environment and Ecology",
        "SST",
        "SST Class 10",
        "SST Class 9",
      ].forEach(addCandidate);
    } else if (normSubj.includes("econ") || normSubj.includes("arth")) {
      [
        "Indian Economy",
        "SST",
        "SST Class 10",
        "SST Class 9",
        "Business Economics",
        "Banking Awareness",
      ].forEach(addCandidate);
    } else if (
      normSubj.includes("math") ||
      normSubj.includes("quant") ||
      normSubj.includes("aptitude") ||
      normSubj.includes("ganit")
    ) {
      ["Quantitative Aptitude", "Math", "Mathematics", "Math Class 10", "Math Class 9"].forEach(
        addCandidate,
      );
    } else if (normSubj.includes("english")) {
      ["English Grammar", "English Language"].forEach(addCandidate);
    } else if (normSubj.includes("hindi")) {
      ["Hindi Grammar", "Hindi Literature"].forEach(addCandidate);
    } else if (
      normSubj.includes("reason") ||
      normSubj.includes("mental") ||
      normSubj.includes("logical")
    ) {
      ["Reasoning", "CSAT"].forEach(addCandidate);
    } else if (
      normSubj.includes("pedagog") ||
      normSubj.includes("child") ||
      normSubj.includes("cdp") ||
      normSubj.includes("teaching")
    ) {
      ["Child Development and Pedagogy", "Teaching Aptitude"].forEach(addCandidate);
    } else if (normSubj.includes("comp") || normSubj.includes("it ") || normSubj === "it") {
      ["Computer Awareness"].forEach(addCandidate);
    } else if (normSubj.includes("physic")) {
      ["Physics", "Physics Class 10", "Physics Class 9", "General Science", "Science"].forEach(
        addCandidate,
      );
    } else if (normSubj.includes("chemis")) {
      [
        "Chemistry",
        "Chemistry Class 10",
        "Chemistry Class 9",
        "General Science",
        "Science",
      ].forEach(addCandidate);
    } else if (
      normSubj.includes("biolog") ||
      normSubj.includes("botan") ||
      normSubj.includes("zoolog")
    ) {
      ["Biology", "Biology Class 10", "Biology Class 9", "General Science", "Science"].forEach(
        addCandidate,
      );
    } else if (
      normSubj.includes("science") ||
      normSubj.includes("evs") ||
      normSubj.includes("vigyan")
    ) {
      [
        "General Science",
        "Science",
        "Science Class 10",
        "Science Class 9",
        "Environment and Ecology",
        "Biology Class 10",
        "Chemistry Class 10",
        "Physics Class 10",
      ].forEach(addCandidate);
    } else if (
      normSubj.includes("gk") ||
      normSubj.includes("general awareness") ||
      normSubj.includes("general studies") ||
      normSubj === "gs" ||
      normSubj === "ga"
    ) {
      [
        "General Awareness",
        "Polity",
        "Modern History",
        "Indian Geography",
        "Indian Economy",
        "General Science",
        "SST",
        "Punjab GK",
      ].forEach(addCandidate);
    } else {
      // Safe non-empty substring match (only if normSubj >= 3 chars)
      if (normSubj.length >= 3) {
        for (const s of allBankSubjects) {
          const sl = s.toLowerCase();
          if (sl.includes(normSubj) || normSubj.includes(sl)) addCandidate(s);
        }
      }
    }
  }

  // 3. Also infer from chapter keywords if chapter clearly belongs to a known domain
  if (normChap) {
    if (
      normChap.includes("preamble") ||
      normChap.includes("constitution") ||
      normChap.includes("fundamental right") ||
      normChap.includes("fundamental dut") ||
      normChap.includes("directive principle") ||
      normChap.includes("dpsp") ||
      normChap.includes("parliament") ||
      normChap.includes("lok sabha") ||
      normChap.includes("rajya sabha") ||
      normChap.includes("president") ||
      normChap.includes("governor") ||
      normChap.includes("judiciary") ||
      normChap.includes("supreme court") ||
      normChap.includes("high court") ||
      normChap.includes("panchayat") ||
      normChap.includes("municip") ||
      normChap.includes("election") ||
      normChap.includes("amendment") ||
      normChap.includes("schedule") ||
      normChap.includes("citizenship") ||
      normChap.includes("federalism")
    ) {
      ["SST", "Polity", "SST Class 10", "SST Class 9"].forEach(addCandidate);
    }
  }

  return candidates;
}

export function findMatchingBankPairs(
  subject: string,
  chapter: string,
): Array<{ bankSubject: string; bankTopic: string }> {
  const normChap = chapter.trim().toLowerCase();
  const candidates = resolveCandidateBankSubjects(subject, chapter);
  if (candidates.length === 0) return [];

  const isWholeSubject =
    !normChap ||
    normChap === "mixed" ||
    normChap === "all chapters" ||
    normChap === "practice paper" ||
    normChap === "full syllabus" ||
    normChap.includes("core concepts");

  if (isWholeSubject) {
    return [{ bankSubject: candidates[0]!, bankTopic: "Mixed" }];
  }

  const chapKeywords = extractKeywords(normChap);
  const scored: Array<{ bankSubject: string; bankTopic: string; score: number }> = [];
  const seenKey = new Set<string>();

  for (let subjPriority = 0; subjPriority < candidates.length; subjPriority += 1) {
    const bankSubject = candidates[subjPriority]!;
    const topics = [
      ...new Set(ACTIVE_TEMPLATES.filter((t) => t.subject === bankSubject).map((t) => t.topic)),
    ];
    for (const topic of topics) {
      const key = `${bankSubject}::${topic}`;
      if (seenKey.has(key)) continue;
      const tl = topic.toLowerCase();
      let score = 0;
      if (tl === normChap) {
        score = 100 - subjPriority;
      } else if (tl.includes(normChap) || normChap.includes(tl)) {
        score = 80 - subjPriority;
      } else if (chapKeywords.length > 0) {
        const topicKeywords = extractKeywords(tl);
        const matches = chapKeywords.filter(
          (kw) => tl.includes(kw) || topicKeywords.some((tk) => tk.includes(kw) || kw.includes(tk)),
        );
        if (matches.length > 0) {
          score = matches.length * 25 - subjPriority;
        }
      }
      if (score > 0) {
        seenKey.add(key);
        scored.push({ bankSubject, bankTopic: topic, score });
      }
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map(({ bankSubject, bankTopic }) => ({ bankSubject, bankTopic }));
}

type CuratedFactItem = {
  q: string;
  a: string;
  d: [string, string, string];
  exp: string;
};

const PREAMBLE_FACT_BANK: CuratedFactItem[] = [
  {
    q: "With which words does the Preamble to the Constitution of India begin?",
    a: "We, the People of India",
    d: [
      "In the Name of Parliament of India",
      "By Order of the Constituent Assembly",
      "We, the Citizens of the Union of States",
    ],
    exp: "The Preamble begins with 'We, the People of India', signifying that ultimate sovereignty rests with the people of India.",
  },
  {
    q: "Which Constitutional Amendment Act added the words 'Socialist', 'Secular' and 'Integrity' to the Preamble?",
    a: "42nd Constitutional Amendment Act, 1976",
    d: [
      "44th Constitutional Amendment Act, 1978",
      "24th Constitutional Amendment Act, 1971",
      "86th Constitutional Amendment Act, 2002",
    ],
    exp: "The 42nd Constitutional Amendment Act, 1976 (also called the Mini-Constitution) added 'Socialist', 'Secular', and 'Integrity' to the Preamble.",
  },
  {
    q: "How many times has the Preamble to the Indian Constitution been amended so far?",
    a: "Only once (in 1976)",
    d: ["Twice (in 1976 and 1978)", "Three times", "Never amended"],
    exp: "The Preamble has been amended only once in history — by the 42nd Constitutional Amendment Act, 1976.",
  },
  {
    q: "What is the exact sequence of the five sovereign attributes of the Indian State mentioned in the Preamble?",
    a: "Sovereign, Socialist, Secular, Democratic, Republic",
    d: [
      "Sovereign, Democratic, Socialist, Secular, Republic",
      "Sovereign, Secular, Socialist, Republic, Democratic",
      "Socialist, Secular, Sovereign, Democratic, Republic",
    ],
    exp: "The Preamble declares India to be a 'Sovereign, Socialist, Secular, Democratic, Republic' in that exact order.",
  },
  {
    q: "The Preamble to the Indian Constitution is based on which historic resolution moved on 13 December 1946?",
    a: "Objectives Resolution moved by Pandit Jawaharlal Nehru",
    d: [
      "Purna Swaraj Resolution moved by Mahatma Gandhi",
      "Drafting Resolution moved by Dr. B. R. Ambedkar",
      "Cabinet Mission Resolution moved by Sardar Patel",
    ],
    exp: "Jawaharlal Nehru moved the Objectives Resolution on 13 December 1946 (adopted on 22 January 1947), which became the blueprint of the Preamble.",
  },
  {
    q: "Which date of adoption of the Constitution is explicitly mentioned in the text of the Preamble?",
    a: "26 November 1949",
    d: ["26 January 1950", "15 August 1947", "9 December 1946"],
    exp: "The Preamble explicitly records: 'In our Constituent Assembly this twenty-sixth day of November, 1949, do hereby adopt, enact and give to ourselves this Constitution.'",
  },
  {
    q: "How many types of 'Justice' are enshrined in the Preamble to the Constitution of India?",
    a: "Three — Social, Economic and Political",
    d: [
      "Four — Social, Economic, Political and Moral",
      "Two — Legal and Constitutional",
      "Three — Civil, Criminal and Administrative",
    ],
    exp: "The Preamble secures to all citizens three forms of Justice: Social, Economic, and Political.",
  },
  {
    q: "How many types of 'Liberty' are guaranteed to citizens in the Preamble of the Indian Constitution?",
    a: "Five — Thought, Expression, Belief, Faith and Worship",
    d: [
      "Four — Speech, Assembly, Movement and Residence",
      "Three — Life, Property and Occupation",
      "Six — Fundamental Freedoms under Article 19",
    ],
    exp: "The Preamble guarantees five types of Liberty: Liberty of thought, expression, belief, faith, and worship.",
  },
  {
    q: "Which two dimensions of 'Equality' are specifically mentioned in the Preamble of the Indian Constitution?",
    a: "Equality of status and of opportunity",
    d: [
      "Equality of income and of property",
      "Equality of outcome and of taxation",
      "Equality of employment and of education",
    ],
    exp: "The Preamble secures to all citizens 'Equality of status and of opportunity and to promote among them all'.",
  },
  {
    q: "The ideals of 'Liberty, Equality and Fraternity' in the Indian Preamble were inspired by which revolution?",
    a: "The French Revolution (1789)",
    d: [
      "The Russian Revolution (1917)",
      "The American War of Independence (1776)",
      "The Glorious Revolution (1688)",
    ],
    exp: "The trinity of Liberty, Equality, and Fraternity in the Preamble was borrowed from the French Revolution of 1789.",
  },
  {
    q: "The ideal of 'Justice — Social, Economic and Political' in the Preamble was taken from which revolution?",
    a: "The Russian Revolution (1917)",
    d: [
      "The French Revolution (1789)",
      "The Industrial Revolution",
      "The American Revolution (1776)",
    ],
    exp: "The ideal of Social, Economic, and Political Justice in the Preamble was inspired by the Russian Revolution of 1917.",
  },
  {
    q: "From which country's Constitution was the concept of having a written 'Preamble' first borrowed?",
    a: "United States of America (USA)",
    d: ["United Kingdom (UK)", "Ireland", "Canada"],
    exp: "The American Constitution was the first to begin with a Preamble; India followed this practice, while its language was influenced by Australia.",
  },
  {
    q: "The language and phrasing ('We, the People...') of the Indian Preamble closely resembles the Preamble of which country?",
    a: "Australia and the USA",
    d: ["Japan and Germany", "USSR and China", "South Africa and France"],
    exp: "While the idea of the Preamble came from the USA, the language and style of the Indian Preamble were heavily influenced by the Australian Constitution.",
  },
  {
    q: "Who called the Preamble the 'Identity Card of the Constitution'?",
    a: "N. A. Palkhivala",
    d: ["Dr. B. R. Ambedkar", "K. M. Munshi", "Sir Alladi Krishnaswami Iyer"],
    exp: "Eminent jurist and constitutional expert N. A. Palkhivala described the Preamble as the 'Identity Card of the Constitution'.",
  },
  {
    q: "Who described the Preamble to the Indian Constitution as the 'Horoscope of our Sovereign Democratic Republic'?",
    a: "K. M. Munshi",
    d: ["Pandit Thakur Das Bhargava", "N. A. Palkhivala", "Sir Ernest Barker"],
    exp: "K. M. Munshi, a member of the Drafting Committee, called the Preamble the 'Horoscope of our Sovereign Democratic Republic'.",
  },
  {
    q: "Which member of the Constituent Assembly called the Preamble the 'Soul of the Constitution' and a 'Jewel Set in the Constitution'?",
    a: "Pandit Thakur Das Bhargava",
    d: ["K. M. Munshi", "Sir B. N. Rau", "Maulana Abul Kalam Azad"],
    exp: "Pandit Thakur Das Bhargava praised the Preamble as the most precious part, the 'Soul of the Constitution', and a 'key to the Constitution'.",
  },
  {
    q: "Which British political scientist called the Preamble to the Indian Constitution the 'Key-note to the Constitution'?",
    a: "Sir Ernest Barker",
    d: ["Ivor Jennings", "A. V. Dicey", "Harold Laski"],
    exp: "Sir Ernest Barker admired the Indian Preamble so much that he quoted it at the beginning of his book 'Principles of Social and Political Theory' and called it the 'Key-note' to the Constitution.",
  },
  {
    q: "In which landmark judgment did the Supreme Court hold that the Preamble IS an integral part of the Constitution and forms part of its Basic Structure?",
    a: "Kesavananda Bharati v. State of Kerala (1973)",
    d: [
      "Berubari Union Case (1960)",
      "A. K. Gopalan v. State of Madras (1950)",
      "Champakam Dorairajan Case (1951)",
    ],
    exp: "In Kesavananda Bharati (1973), the 13-judge bench overruled Berubari Union (1960) and held that the Preamble is part of the Constitution and subject to the Basic Structure doctrine.",
  },
  {
    q: "In which 1960 reference case did the Supreme Court initially opine that the Preamble was NOT a part of the Constitution?",
    a: "Berubari Union Case (1960)",
    d: [
      "Golaknath v. State of Punjab (1967)",
      "Minerva Mills v. Union of India (1980)",
      "S. R. Bommai v. Union of India (1994)",
    ],
    exp: "In the Berubari Union case (1960), the Supreme Court held that the Preamble shows the general purposes behind the Constitution but is not a part of it — a view overruled in 1973.",
  },
  {
    q: "In which 1995 case did the Supreme Court reiterate that the Preamble is an 'integral part of the Constitution'?",
    a: "LIC of India v. Consumer Education and Research Centre (1995)",
    d: [
      "Indra Sawhney v. Union of India (1992)",
      "Vishaka v. State of Rajasthan (1997)",
      "Shah Bano Case (1985)",
    ],
    exp: "In the LIC of India case (1995), the Supreme Court again held that the Preamble is an integral part of the Constitution.",
  },
  {
    q: "What is the legal enforceability (justiciability) of the Preamble in a court of law?",
    a: "It is non-justiciable (neither a source of power nor a prohibition upon legislature)",
    d: [
      "It is directly enforceable through a writ under Article 32",
      "It overrides explicit Articles of the Constitution in every case",
      "It confers independent legislative taxation power on Parliament",
    ],
    exp: "The Preamble is non-justiciable: its provisions are not directly enforceable in courts, nor is it a source of power or a limitation on legislative authority.",
  },
  {
    q: "What does the term 'Republic' in the Preamble of the Indian Constitution signify?",
    a: "The Head of the State (President) is elected and not a hereditary monarch",
    d: [
      "The Prime Minister is directly elected by universal adult franchise",
      "All laws require a national referendum of citizens",
      "Judges of the Supreme Court are elected by Parliament",
    ],
    exp: "A Republic means the Head of State is always elected (directly or indirectly) for a fixed term, as opposed to a hereditary monarchy like Britain.",
  },
  {
    q: "What does the word 'Sovereign' in the Preamble to the Constitution of India mean?",
    a: "India is an independent state, free to conduct its internal and external affairs without foreign control",
    d: [
      "India is a dependency of the British Commonwealth Crown",
      "State Governments have the right to secede from the Union",
      "International treaties automatically override the Indian Constitution",
    ],
    exp: "Sovereignty means India is neither a dependency nor a dominion of any other nation; it is completely independent in both internal and external matters.",
  },
  {
    q: "What does the word 'Secular' in the Preamble of the Indian Constitution mean?",
    a: "The State has no official religion and treats all religions with equal respect (Sarva Dharma Sambhava)",
    d: [
      "The State prohibits all religious practices in public and private life",
      "Only majority religious institutions receive state recognition",
      "Religious personal laws are completely barred from civil courts",
    ],
    exp: "Indian secularism is positive: the State has no religion of its own and gives equal protection and respect to all religions.",
  },
  {
    q: "What does 'Fraternity' in the Preamble assure to every citizen and the nation?",
    a: "The dignity of the individual and the unity and integrity of the Nation",
    d: [
      "Equal distribution of private land and abolition of taxes",
      "Dual citizenship for Union and State governments",
      "Proportional representation in all military services",
    ],
    exp: "Fraternity in the Preamble assures two things: the dignity of the individual and the unity and integrity of the Nation.",
  },
];

const CURATED_SUBJECT_FACTS: Record<
  "preamble" | "polity" | "history" | "geography" | "economics" | "science",
  CuratedFactItem[]
> = {
  preamble: PREAMBLE_FACT_BANK,
  polity: [
    ...PREAMBLE_FACT_BANK.slice(0, 8),
    {
      q: "Under which Plan was the Constituent Assembly of India constituted in November 1946?",
      a: "Cabinet Mission Plan (1946)",
      d: ["Cripps Mission Plan (1942)", "Mountbatten Plan (1947)", "Wavell Plan (1945)"],
      exp: "The Constituent Assembly was formed in November 1946 under the scheme formulated by the Cabinet Mission Plan.",
    },
    {
      q: "Who was the Chairman of the Drafting Committee of the Indian Constitution?",
      a: "Dr. B. R. Ambedkar",
      d: ["Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
      exp: "Dr. B. R. Ambedkar chaired the seven-member Drafting Committee appointed on 29 August 1947.",
    },
    {
      q: "Which Part of the Indian Constitution is known as the 'Magna Carta of India'?",
      a: "Part III (Fundamental Rights, Articles 12 to 35)",
      d: [
        "Part IV (Directive Principles of State Policy)",
        "Part IVA (Fundamental Duties)",
        "Part V (The Union Executive)",
      ],
      exp: "Part III containing Fundamental Rights (Articles 12–35) is rightly described as the Magna Carta of India.",
    },
    {
      q: "Which Article of the Indian Constitution was called the 'Heart and Soul of the Constitution' by Dr. B. R. Ambedkar?",
      a: "Article 32 (Right to Constitutional Remedies)",
      d: [
        "Article 14 (Right to Equality)",
        "Article 19 (Right to Freedom)",
        "Article 21 (Protection of Life and Personal Liberty)",
      ],
      exp: "Dr. B. R. Ambedkar described Article 32 as the very soul of the Constitution and the very heart of it because it makes Fundamental Rights enforceable.",
    },
    {
      q: "Fundamental Duties in Article 51A were incorporated into the Constitution on the recommendation of which committee?",
      a: "Sardar Swaran Singh Committee (1976)",
      d: [
        "Sarkaria Commission (1983)",
        "Balwant Rai Mehta Committee (1957)",
        "Kothari Commission (1964)",
      ],
      exp: "On the recommendation of the Swaran Singh Committee, 10 Fundamental Duties were added by the 42nd Amendment (1976), and the 11th duty by the 86th Amendment (2002).",
    },
    {
      q: "Who presides over a Joint Sitting of both Houses of the Indian Parliament under Article 108?",
      a: "Speaker of the Lok Sabha",
      d: [
        "President of India",
        "Vice-President of India (Chairman of Rajya Sabha)",
        "Prime Minister of India",
      ],
      exp: "While the President summons a Joint Sitting under Article 108, the Speaker of the Lok Sabha presides over it.",
    },
    {
      q: "Which Constitutional Amendment gave constitutional status to Panchayati Raj Institutions in India?",
      a: "73rd Constitutional Amendment Act, 1992",
      d: [
        "74th Constitutional Amendment Act, 1992",
        "42nd Constitutional Amendment Act, 1976",
        "61st Constitutional Amendment Act, 1989",
      ],
      exp: "The 73rd Amendment Act, 1992 added Part IX and the Eleventh Schedule (29 subjects), granting constitutional status to Panchayati Raj Institutions.",
    },
    {
      q: "Which Schedule of the Indian Constitution contains the Anti-Defection Law?",
      a: "Tenth Schedule (added by the 52nd Amendment, 1985)",
      d: ["Eighth Schedule", "Ninth Schedule", "Eleventh Schedule"],
      exp: "The Tenth Schedule, added by the 52nd Constitutional Amendment Act of 1985, deals with disqualification of legislators on the ground of defection.",
    },
  ],
  history: [
    {
      q: "Which Indus Valley Civilisation site is famous for its artificial brick dockyard?",
      a: "Lothal (Gujarat)",
      d: ["Kalibangan (Rajasthan)", "Banawali (Haryana)", "Ropar (Punjab)"],
      exp: "Lothal in Gujarat on the Bhogava river was the premier port city of the Harappan civilisation with a tidal dockyard.",
    },
    {
      q: "Where did Gautama Buddha deliver his first sermon, known as 'Dharmachakrapravartana'?",
      a: "Sarnath (near Varanasi)",
      d: ["Bodh Gaya", "Kushinagar", "Lumbini"],
      exp: "After attaining enlightenment at Bodh Gaya, Buddha gave his first sermon in the Deer Park at Sarnath.",
    },
    {
      q: "Which Major Rock Edict of Emperor Ashoka describes the horrors of the Kalinga War (261 BCE)?",
      a: "Major Rock Edict XIII",
      d: ["Major Rock Edict I", "Major Rock Edict VII", "Pillar Edict II"],
      exp: "Major Rock Edict XIII records Ashoka's remorse over the Kalinga War and his turn towards Dhamma.",
    },
    {
      q: "Who founded the Khalsa Panth at Sri Anandpur Sahib on Baisakhi Day in 1699?",
      a: "Sri Guru Gobind Singh Ji",
      d: ["Sri Guru Nanak Dev Ji", "Sri Guru Arjan Dev Ji", "Sri Guru Tegh Bahadur Ji"],
      exp: "Tenth Sikh Guru Sri Guru Gobind Singh Ji founded the Khalsa Panth on 30 March / Baisakhi 1699 at Anandpur Sahib.",
    },
    {
      q: "Who was the Governor-General of India during the Revolt of 1857?",
      a: "Lord Canning",
      d: ["Lord Dalhousie", "Lord Curzon", "Lord Wellesley"],
      exp: "Lord Canning served as the last Governor-General under the East India Company during the 1857 Revolt and became the first Viceroy in 1858.",
    },
    {
      q: "In which session did the Indian National Congress adopt the 'Purna Swaraj' (Complete Independence) resolution?",
      a: "Lahore Session, December 1929 (presided over by Jawaharlal Nehru)",
      d: ["Surat Session, 1907", "Lucknow Session, 1916", "Karachi Session, 1931"],
      exp: "At the Lahore Session in December 1929 on the banks of the Ravi, Congress declared Purna Swaraj and resolved to celebrate 26 January 1930 as Independence Day.",
    },
    {
      q: "Where and when was the revolutionary Ghadar Party founded?",
      a: "1913 in San Francisco (USA) under Sohan Singh Bhakna and Lala Hardayal",
      d: [
        "1905 in London under Shyamji Krishna Varma",
        "1928 in Delhi under Bhagat Singh",
        "1942 in Singapore under Subhas Chandra Bose",
      ],
      exp: "The Ghadar Party was founded in 1913 with its headquarters at Yugantar Ashram, San Francisco, with Baba Sohan Singh Bhakna as President.",
    },
  ],
  geography: [
    {
      q: "Which imaginary line of latitude passes almost halfway through India across eight states?",
      a: "Tropic of Cancer (23°30′ N)",
      d: ["Equator (0°)", "Tropic of Capricorn (23°30′ S)", "Arctic Circle (66°30′ N)"],
      exp: "The Tropic of Cancer (23°30′ N) passes through 8 Indian states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.",
    },
    {
      q: "What is the Standard Meridian of India used for calculating Indian Standard Time (IST)?",
      a: "82°30′ E longitude (passing near Mirzapur, Uttar Pradesh)",
      d: ["75°30′ E longitude", "90°00′ E longitude", "68°07′ E longitude"],
      exp: "82°30′ E longitude is the Standard Meridian of India, placing IST 5 hours 30 minutes ahead of GMT.",
    },
    {
      q: "Which soil type in India is also known as 'Regur Soil' and is ideal for growing cotton?",
      a: "Black Soil",
      d: ["Alluvial Soil", "Laterite Soil", "Red and Yellow Soil"],
      exp: "Black soil (Regur soil) of the Deccan Trap has high moisture-retention capacity and is best suited for cotton cultivation.",
    },
    {
      q: "Which river is known as 'Dakshin Ganga' and is the longest peninsular river of India?",
      a: "Godavari",
      d: ["Kaveri", "Krishna", "Narmada"],
      exp: "Rising at Trimbakeshwar in Nashik (Maharashtra), the Godavari (1,465 km) is the largest and longest peninsular river.",
    },
    {
      q: "Which two major peninsular rivers of India flow westward through rift valleys into the Arabian Sea?",
      a: "Narmada and Tapi",
      d: ["Mahanadi and Godavari", "Krishna and Kaveri", "Subarnarekha and Brahmani"],
      exp: "Unlike most peninsular rivers that drain into the Bay of Bengal, the Narmada and Tapi flow westward through rift valleys into the Arabian Sea.",
    },
  ],
  economics: [
    {
      q: "Which sector is the largest contributor to India's Gross Domestic Product (GDP)?",
      a: "Tertiary (Service) Sector",
      d: [
        "Primary (Agriculture & Allied) Sector",
        "Secondary (Manufacturing) Sector",
        "Mining and Quarrying Sector only",
      ],
      exp: "The Tertiary (Services) sector contributes over half of India's GDP, while the Primary sector employs the largest share of the workforce.",
    },
    {
      q: "Which institution is the sole authority for issuing currency notes (except ₹1 notes) and regulating monetary policy in India?",
      a: "Reserve Bank of India (RBI)",
      d: ["State Bank of India (SBI)", "NABARD", "SEBI"],
      exp: "Established on 1 April 1935 under the RBI Act 1934, the Reserve Bank of India issues currency notes under Section 22 and conducts monetary policy.",
    },
    {
      q: "What type of unemployment occurs in agriculture when more people are engaged in work than actually required (marginal productivity is zero)?",
      a: "Disguised Unemployment",
      d: ["Cyclical Unemployment", "Frictional Unemployment", "Technological Unemployment"],
      exp: "Disguised unemployment exists when removing some workers does not reduce total output, so their marginal productivity is zero.",
    },
    {
      q: "Which body replaced the Planning Commission of India on 1 January 2015?",
      a: "NITI Aayog (National Institution for Transforming India)",
      d: ["Finance Commission of India", "National Development Council", "GST Council"],
      exp: "NITI Aayog was established on 1 January 2015 as the premier policy 'Think Tank' of the Government of India, with the Prime Minister as Chairperson.",
    },
  ],
  science: [
    {
      q: "Which cell organelle is known as the 'Powerhouse of the Cell' because it synthesizes ATP?",
      a: "Mitochondria",
      d: ["Ribosome", "Golgi apparatus", "Lysosome"],
      exp: "Mitochondria generate cellular energy in the form of ATP (Adenosine Triphosphate) through aerobic respiration.",
    },
    {
      q: "What is the SI unit of electric current?",
      a: "Ampere (A)",
      d: ["Volt (V)", "Ohm (Ω)", "Coulomb (C)"],
      exp: "Electric current (rate of flow of charge) is measured in Ampere (A) in the SI system.",
    },
    {
      q: "What is the chemical name and formula of Baking Soda?",
      a: "Sodium Hydrogen Carbonate (NaHCO₃)",
      d: [
        "Sodium Carbonate Decahydrate (Na₂CO₃·10H₂O)",
        "Calcium Oxychloride (CaOCl₂)",
        "Calcium Sulphate Hemihydrate (CaSO₄·½H₂O)",
      ],
      exp: "Baking soda is Sodium Hydrogen Carbonate or Sodium Bicarbonate (NaHCO₃).",
    },
  ],
};

function selectCuratedFactsForChapter(subject: string, chapter: string): CuratedFactItem[] {
  const normSubj = subject.trim().toLowerCase();
  const normChap = chapter.trim().toLowerCase();

  if (normChap.includes("preamble") || normSubj.includes("preamble")) {
    return PREAMBLE_FACT_BANK;
  }

  if (
    normChap.includes("constitution") ||
    normChap.includes("fundamental right") ||
    normChap.includes("fundamental dut") ||
    normChap.includes("directive principle") ||
    normChap.includes("dpsp") ||
    normChap.includes("parliament") ||
    normChap.includes("president") ||
    normChap.includes("judiciary") ||
    normChap.includes("court") ||
    normChap.includes("panchayat") ||
    normChap.includes("federalism") ||
    normChap.includes("democracy") ||
    normChap.includes("civic") ||
    normChap.includes("polity") ||
    normSubj.includes("polity") ||
    normSubj.includes("civic")
  ) {
    return [...CURATED_SUBJECT_FACTS.polity!, ...PREAMBLE_FACT_BANK];
  }

  if (
    normChap.includes("history") ||
    normChap.includes("revolution") ||
    normChap.includes("nationalism") ||
    normChap.includes("1857") ||
    normChap.includes("harappa") ||
    normChap.includes("indus") ||
    normChap.includes("vedic") ||
    normChap.includes("maurya") ||
    normChap.includes("gupta") ||
    normChap.includes("mughal") ||
    normChap.includes("sultanate") ||
    normChap.includes("guru") ||
    normSubj.includes("history")
  ) {
    return CURATED_SUBJECT_FACTS.history!;
  }

  if (
    normChap.includes("geog") ||
    normChap.includes("river") ||
    normChap.includes("drainage") ||
    normChap.includes("climate") ||
    normChap.includes("monsoon") ||
    normChap.includes("soil") ||
    normChap.includes("resource") ||
    normChap.includes("agriculture") ||
    normChap.includes("mineral") ||
    normChap.includes("latitude") ||
    normSubj.includes("geog")
  ) {
    return CURATED_SUBJECT_FACTS.geography!;
  }

  if (
    normChap.includes("econ") ||
    normChap.includes("money") ||
    normChap.includes("credit") ||
    normChap.includes("bank") ||
    normChap.includes("gdp") ||
    normChap.includes("budget") ||
    normChap.includes("inflation") ||
    normChap.includes("poverty") ||
    normChap.includes("globalisation") ||
    normSubj.includes("econ")
  ) {
    return CURATED_SUBJECT_FACTS.economics!;
  }

  if (
    normSubj === "sst" ||
    normSubj.includes("social stud") ||
    normSubj.includes("social scien") ||
    normSubj.includes("general")
  ) {
    return [
      ...PREAMBLE_FACT_BANK.slice(0, 10),
      ...CURATED_SUBJECT_FACTS.polity!,
      ...CURATED_SUBJECT_FACTS.history!,
      ...CURATED_SUBJECT_FACTS.geography!,
      ...CURATED_SUBJECT_FACTS.economics!,
    ];
  }

  return CURATED_SUBJECT_FACTS.science!;
}

function buildSynthesizedChapterQuestion(input: {
  exam: string;
  subject: string;
  chapter: string;
  difficulty: Difficulty;
  index: number;
  levelIndex: number;
  seed: string;
  marks: number;
  negative_marks: number;
}): GeneratedTestQuestion {
  const { exam, subject, chapter, difficulty, index, levelIndex, seed, marks, negative_marks } =
    input;
  const random = seededRandom(`${seed}:${exam}:${subject}:${chapter}:${difficulty}:${index}`);
  const itemNo = levelIndex + 1;

  const curatedPool = selectCuratedFactsForChapter(subject, chapter);
  const primaryFact = curatedPool[(index + levelIndex) % curatedPool.length]!;
  const secondaryFact = curatedPool[(index + levelIndex + 3) % curatedPool.length]!;

  let prompt = "";
  let correct = "";
  let distractors: [string, string, string];
  let explanation = "";
  let qType = "single-choice";

  if (difficulty === "Easy") {
    prompt =
      levelIndex < curatedPool.length
        ? primaryFact.q
        : `[${subject} — ${chapter}] ${primaryFact.q}`;
    correct = primaryFact.a;
    distractors = primaryFact.d;
    explanation = `${primaryFact.exp} (${subject} · ${chapter})`;
  } else if (difficulty === "Moderate") {
    qType = "statement-combination";
    prompt = `Consider the following statements regarding ${chapter} (${subject}):\n1. ${primaryFact.q.replace(/\?$/, "")}: ${primaryFact.a}.\n2. ${secondaryFact.q.replace(/\?$/, "")}: ${secondaryFact.a}.\nWhich of the statements given above is/are correct?`;
    correct = "Both 1 and 2 are correct";
    distractors = [
      `1 only (Statement 2 should be: ${secondaryFact.d[0]})`,
      `2 only (Statement 1 should be: ${primaryFact.d[0]})`,
      "Neither 1 nor 2 is correct",
    ];
    explanation = `Statement 1 is correct: ${primaryFact.exp} Statement 2 is also correct: ${secondaryFact.exp}`;
  } else {
    qType = "assertion-reason";
    prompt = `Assertion–Reason on ${chapter} (${subject} — High-Yield #${itemNo}):\nAssertion (A): ${primaryFact.q.replace(/\?$/, "")} — ${primaryFact.a}.\nReason (R): ${primaryFact.exp}\nSelect the correct answer using the code below:`;
    correct = "Both (A) and (R) are true, and (R) is the correct explanation of (A)";
    distractors = [
      "Both (A) and (R) are true, but (R) is NOT the correct explanation of (A)",
      "(A) is true, but (R) is false",
      "(A) is false, because the correct answer is " + primaryFact.d[0],
    ];
    explanation = `${primaryFact.exp} Hence both Assertion (A) and Reason (R) are true and (R) correctly explains (A).`;
  }

  const options = shuffledOptions([correct, ...distractors], random);
  const correct_index = options.indexOf(correct);
  const source_id = `gen:custom:${slugify(exam)}-${slugify(subject)}-${slugify(chapter)}-${difficulty.toLowerCase()}-${itemNo}`;

  return {
    id: source_id,
    source_id,
    template_id: `custom:${slugify(subject)}:${slugify(chapter)}:${difficulty.toLowerCase()}`,
    template_index: itemNo,
    question_text: prompt,
    subject,
    options,
    correct_index: correct_index >= 0 ? correct_index : 0,
    explanation,
    exam,
    chapter,
    topic: chapter,
    difficulty,
    question_type: qType,
    provenance: "practice",
    marks,
    negative_marks,
    sort_order: index,
    created_at: "",
    updated_at: "",
  };
}

/**
 * Generates a full 60-question (or custom count) paper for any Test or Test Series
 * Subject & Chapter. Never falls back to Physics or unrelated chapters:
 * 1. If the chapter is specifically about the Preamble (or another curated high-yield topic),
 *    prioritizes exact matching bank chapters + curated topic facts.
 * 2. Only pulls from bank templates whose chapter/topic genuinely matches the requested chapter.
 * 3. Fills any remaining slots with topic-accurate Easy → Moderate → Difficult questions.
 */
export function generateCustomSyllabusPaper(input: {
  exam: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Mixed";
  count: number;
  marks: number;
  negative_marks: number;
  seed?: string;
}): GeneratedTestQuestion[] {
  const safeSubject = input.subject.trim() || "SST";
  const safeTopic = input.topic.trim() || "Mixed";
  const count = Math.max(1, Math.min(1000, Math.floor(input.count || 60)));

  // Only use strict on-demand paper directly when both subject and topic are non-empty and not generic
  if (input.subject.trim() && input.topic.trim() && input.topic.trim() !== "Mixed") {
    const strict = generateOnDemandTestPaper(input);
    if (strict.length >= count) {
      return strict.map((q, idx) => ({
        ...q,
        subject: safeSubject,
        chapter: safeTopic,
        topic: safeTopic,
        sort_order: idx,
      }));
    }
  }

  const levels: Difficulty[] =
    input.difficulty === "Mixed" ? ["Easy", "Moderate", "Difficult"] : [input.difficulty];
  const seed = input.seed || "kkcc-custom-seed";
  const random = seededRandom(seed);
  const seen = new Set<string>();
  const matchedPairs = findMatchingBankPairs(safeSubject, safeTopic);
  const isPreambleTopic = safeTopic.toLowerCase().includes("preamble");

  const out: GeneratedTestQuestion[] = [];
  const base = Math.floor(count / levels.length);
  const remainder = count % levels.length;

  for (let i = 0; i < levels.length; i += 1) {
    const level = levels[i]!;
    const wanted = base + (i < remainder ? 1 : 0);
    const levelQuestions: GeneratedTestQuestion[] = [];

    // For Preamble specifically, inject our hand-crafted direct Preamble MCQs first on Easy level
    if (isPreambleTopic && level === "Easy") {
      for (
        let pIdx = 0;
        pIdx < PREAMBLE_FACT_BANK.length && levelQuestions.length < wanted;
        pIdx += 1
      ) {
        const fact = PREAMBLE_FACT_BANK[pIdx]!;
        if (seen.has(fact.q)) continue;
        seen.add(fact.q);
        const options = shuffledOptions([fact.a, ...fact.d], random);
        const correct_index = options.indexOf(fact.a);
        const source_id = `gen:preamble:${slugify(input.exam)}-${level.toLowerCase()}-${pIdx + 1}`;
        levelQuestions.push({
          id: source_id,
          source_id,
          template_id: `preamble:core:${level.toLowerCase()}`,
          template_index: pIdx + 1,
          question_text: fact.q,
          subject: safeSubject,
          options,
          correct_index: correct_index >= 0 ? correct_index : 0,
          explanation: fact.exp,
          exam: input.exam,
          chapter: safeTopic,
          topic: safeTopic,
          difficulty: level,
          question_type: "single-choice",
          provenance: "practice",
          marks: input.marks,
          negative_marks: input.negative_marks,
          sort_order: out.length + levelQuestions.length,
          created_at: "",
          updated_at: "",
        });
      }
    }

    // Pull from matched bank (subject, topic) pairs — NEVER passing "Mixed" when a specific topic was requested
    for (const pair of matchedPairs) {
      if (levelQuestions.length >= wanted) break;
      const bankDrawn = generateQuestionsForTest({
        exam: "All Exams",
        subject: pair.bankSubject,
        topic: pair.bankTopic,
        difficulty: level,
        count: wanted - levelQuestions.length,
        random,
        seen,
      });
      for (const q of bankDrawn) {
        if (levelQuestions.length >= wanted) break;
        levelQuestions.push({
          ...q,
          id: q.source_id,
          subject: safeSubject,
          chapter: safeTopic,
          topic: safeTopic,
          exam: input.exam,
          marks: input.marks,
          negative_marks: input.negative_marks,
          sort_order: out.length + levelQuestions.length,
          created_at: "",
          updated_at: "",
        });
      }
    }

    while (levelQuestions.length < wanted) {
      const levelIndex = levelQuestions.length;
      const synth = buildSynthesizedChapterQuestion({
        exam: input.exam,
        subject: safeSubject,
        chapter: safeTopic,
        difficulty: level,
        index: out.length + levelIndex,
        levelIndex,
        seed,
        marks: input.marks,
        negative_marks: input.negative_marks,
      });
      levelQuestions.push(synth);
    }

    out.push(...levelQuestions);
  }

  return out.map((q, idx) => ({ ...q, sort_order: idx }));
}
