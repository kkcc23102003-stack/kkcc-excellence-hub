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
  "punjab",
  "punjabi",
  "hindi",
  "english",
  "chapter",
  "unit",
  "part",
  "basics",
  "introduction",
  "general",
  "rules",
  "concepts",
  "ਪੰਜਾਬੀ",
  "ਪੰਜਾਬ",
  "हिंदी",
  "ਅਤੇ",
  "ਵਿੱਚ",
  "ਦੀ",
  "ਦੇ",
  "ਦਾ",
  "ਨੂੰ",
  "ਤੇ",
  "ਦੀਆਂ",
  "ਉਨ੍ਹਾਂ",
  "और",
  "का",
  "की",
  "के",
  "में",
  "से",
  "पर",
  "उसके",
]);

const BILINGUAL_KEYWORD_EXPANSIONS: Array<{ pattern: RegExp; tokens: string[] }> = [
  {
    pattern: /ਗੁਰਮੁਖੀ|ਲਿਪੀ|ਧੁਨੀ|ਵਰਣਮਾਲਾ|gurmukhi|phonetic|orthograph/i,
    tokens: ["ਗੁਰਮੁਖੀ", "ਲਿਪੀ", "ਧੁਨੀ", "ਸ਼ਬਦ", "ਭਾਸ਼ਾ", "ਉਪਭਾਸ਼ਾਵਾਂ", "ਸ਼੍ਰੇਣੀਆਂ", "ਬਣਤਰ"],
  },
  {
    pattern: /ਵਿਆਕਰਣ|ਨਿਯਮ|ਵਾਕ|vyakaran/i,
    tokens: [
      "ਵਿਆਕਰਣ",
      "ਸ਼ਬਦ",
      "ਵਾਕ",
      "ਬਣਤਰ",
      "ਸ਼੍ਰੇਣੀਆਂ",
      "ਪੜਨਾਂਵ",
      "ਵਿਸ਼ੇਸ਼ਣ",
      "ਕਿਰਿਆ",
      "ਲਿੰਗ",
      "ਵਚਨ",
      "ਕਾਰਕ",
      "ਕਾਲ",
      "ਵਾਚ",
      "ਸੰਧੀ",
      "ਸਮਾਸ",
      "ਜੋੜ",
    ],
  },
  {
    pattern: /ਮੁਹਾਵਰੇ|ਅਖਾਣ|idiom|proverb|ਸਮਾਨਾਰਥਕ|ਵਿਰੋਧੀ|ਸ਼ਬਦਾਵਲੀ/i,
    tokens: [
      "ਮੁਹਾਵਰੇ",
      "ਅਖਾਣ",
      "ਸ਼ਬਦ",
      "ਜੋੜ",
      "ਸ਼ੁੱਧ",
      "ਅਸ਼ੁੱਧ",
      "ਸਮਾਨਾਰਥੀ",
      "ਵਿਰੋਧੀ",
      "idioms",
      "phrases",
      "synonyms",
      "antonyms",
    ],
  },
  {
    pattern: /ਸਾਹਿਤ|ਸੱਭਿਆਚਾਰ|ਕਵਿਤਾ|ਨਾਵਲ|ਕਹਾਣੀ|ਲੋਕ|ਵਾਰਤਕ/i,
    tokens: [
      "ਸਾਹਿਤ",
      "ਸੱਭਿਆਚਾਰ",
      "ਕਵਿਤਾ",
      "ਨਾਵਲ",
      "ਕਹਾਣੀ",
      "ਗੁਰੂ",
      "ਸਾਹਿਬਾਨ",
      "ਰਚਨਾਵਾਂ",
      "ਲੋਕ",
      "ਧਾਰਾ",
      "ਵਾਰਤਕ",
      "ਜੀਵਨੀ",
      "ਲੇਖਕ",
      "ਕਾਲ",
      "ਵੰਡ",
    ],
  },
  {
    pattern: /ਅਲੰਕਾਰ|ਰਸ|ਛੰਦ|ਸ਼ਕਤੀਆਂ|alankar|chhand/i,
    tokens: ["ਅਲੰਕਾਰ", "ਰਸ", "ਛੰਦ", "ਸਾਹਿਤਕ"],
  },
  {
    pattern: /ਅਣਡਿੱਠਾ|ਪੈਰਾ|ਪਠਨ|ਅਨੁਵਾਦ|comprehension|unseen|passage|translation/i,
    tokens: ["ਅਨੁਵਾਦ", "ਵਾਕ", "ਬਦਲੀ", "ਪਠਨ", "ਬੋਧ", "comprehension", "cloze", "reading"],
  },
  {
    pattern: /वर्ण|संज्ञा|सर्वनाम|विशेषण|क्रिया|व्याकरण|संधि|समास|मुहावरे|अलंकार|रस|छंद|साहित्य/i,
    tokens: [
      "वर्ण",
      "संज्ञा",
      "सर्वनाम",
      "विशेषण",
      "क्रिया",
      "लिंग",
      "वचन",
      "कारक",
      "काल",
      "वाच्य",
      "संधि",
      "समास",
      "रस",
      "छंद",
      "अलंकार",
      "काव्य",
      "गद्य",
    ],
  },
  {
    pattern: /sikh|guru|misl|ranjit|khalsa|martyr|ghadar|jallianwala/i,
    tokens: [
      "sikh",
      "gurus",
      "misls",
      "ancient",
      "medieval",
      "sufi",
      "jallianwala",
      "national",
      "movement",
      "personalities",
      "reform",
    ],
  },
  {
    pattern:
      /piaget|vygotsky|kohlberg|erikson|constructiv|theories of learning|growth.*development/i,
    tokens: [
      "child",
      "development",
      "theories",
      "learning",
      "motivation",
      "cognition",
      "psychology",
    ],
  },
  {
    pattern: /tense|parts of speech/i,
    tokens: ["tenses", "nouns", "pronouns", "adjectives", "adverbs"],
  },
  {
    pattern: /voice|narration|direct.*indirect/i,
    tokens: ["active", "passive", "voice", "direct", "indirect", "speech"],
  },
];

function extractBaseKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

function extractKeywords(text: string): string[] {
  const base = extractBaseKeywords(text);
  const expanded = new Set<string>(base);
  for (const rule of BILINGUAL_KEYWORD_EXPANSIONS) {
    if (rule.pattern.test(text)) {
      for (const tok of rule.tokens) expanded.add(tok.toLowerCase());
    }
  }
  return [...expanded];
}

/**
 * Resolves all candidate bank subjects for a given user-selected or Admin-defined subject,
 * NEVER matching empty strings or mistaking "Social Science" / "Political Science" for Physics/Science.
 */
export function resolveCandidateBankSubjects(subject: string, chapter = ""): string[] {
  const normSubj = subject.trim().toLowerCase();
  const normChap = chapter.trim().toLowerCase();
  const combined = `${normSubj} ${normChap}`;
  const allBankSubjects = [...new Set(ACTIVE_TEMPLATES.map((t) => t.subject))];

  const candidates: string[] = [];
  const addCandidate = (s: string) => {
    if (s && allBankSubjects.includes(s) && !candidates.includes(s)) {
      candidates.push(s);
    }
  };

  // Detect Gurmukhi script in subject or chapter -> Punjabi
  const hasGurmukhi = /[\u0A00-\u0A7F]/.test(`${subject} ${chapter}`);
  // Detect Devanagari script in subject or chapter -> Hindi
  const hasDevanagari = /[\u0900-\u097F]/.test(`${subject} ${chapter}`);

  const isGenericSubj =
    !normSubj ||
    normSubj === "general" ||
    normSubj === "mixed" ||
    normSubj === "all" ||
    normSubj === "all subjects" ||
    normSubj === "complete" ||
    normSubj === "complete test" ||
    normSubj === "default";

  if (!isGenericSubj) {
    // 1. Exact subject match (case-insensitive), unless chapter specifically redirects within a subject family
    const skipExactFirst =
      (normSubj === "punjab gk" &&
        (normChap.includes("hist") ||
          normChap.includes("guru") ||
          normChap.includes("geog") ||
          normChap.includes("river") ||
          normChap.includes("econ") ||
          normChap.includes("agricult"))) ||
      (normSubj === "english language" &&
        (normChap.includes("tense") ||
          normChap.includes("grammar") ||
          normChap.includes("preposition") ||
          normChap.includes("article"))) ||
      (normSubj === "english grammar" &&
        (normChap.includes("voice") ||
          normChap.includes("narration") ||
          normChap.includes("speech") ||
          normChap.includes("idiom") ||
          normChap.includes("comprehension")));

    if (!skipExactFirst) {
      for (const s of allBankSubjects) {
        if (s.toLowerCase() === normSubj) addCandidate(s);
      }
    }

    // 2. If Gurmukhi or Punjabi subject, prioritize Punjabi bank subjects
    if (
      hasGurmukhi ||
      normSubj.includes("punjabi") ||
      normSubj.includes("gurmukhi") ||
      normSubj.includes("ਪੰਜਾਬੀ")
    ) {
      if (
        normChap.includes("ਅਲੰਕਾਰ") ||
        normChap.includes("ਰਸ") ||
        normChap.includes("ਛੰਦ") ||
        normSubj.includes("paper b")
      ) {
        ["Punjabi Paper B", "Punjabi Literature", "Punjabi Grammar", "Punjabi Paper A"].forEach(
          addCandidate,
        );
      } else if (
        normSubj.includes("literature") ||
        normSubj.includes("ਸਾਹਿਤ") ||
        normChap.includes("ਸਾਹਿਤ")
      ) {
        ["Punjabi Literature", "Punjabi Paper B", "Punjabi Paper A", "Punjabi Grammar"].forEach(
          addCandidate,
        );
      } else if (normSubj.includes("grammar") || normSubj.includes("ਵਿਆਕਰਣ")) {
        ["Punjabi Grammar", "Punjabi Paper A", "Punjabi Paper B", "Punjabi Literature"].forEach(
          addCandidate,
        );
      } else {
        ["Punjabi Paper A", "Punjabi Grammar", "Punjabi Paper B", "Punjabi Literature"].forEach(
          addCandidate,
        );
      }
    } else if (hasDevanagari || normSubj.includes("hindi") || normSubj.includes("हिंदी")) {
      if (normSubj.includes("literature") || normSubj.includes("साहित्य")) {
        ["Hindi Literature", "Hindi Grammar"].forEach(addCandidate);
      } else {
        ["Hindi Grammar", "Hindi Literature"].forEach(addCandidate);
      }
    } else if (normSubj.includes("punjab") && normSubj.includes("hist")) {
      ["Punjab History", "Punjab GK", "Modern History", "Medieval History", "SST"].forEach(
        addCandidate,
      );
    } else if (normSubj.includes("punjab") && normSubj.includes("geog")) {
      ["Punjab Geography", "Punjab GK", "Indian Geography", "SST"].forEach(addCandidate);
    } else if (normSubj.includes("punjab") && normSubj.includes("econ")) {
      ["Punjab Economics", "Punjab GK", "Indian Economy", "SST"].forEach(addCandidate);
    } else if (normSubj.includes("punjab")) {
      if (normChap.includes("geog") || normChap.includes("river") || normChap.includes("soil")) {
        ["Punjab Geography", "Punjab GK", "Punjab History", "Punjab Economics"].forEach(
          addCandidate,
        );
      } else if (
        normChap.includes("econ") ||
        normChap.includes("agricult") ||
        normChap.includes("industry")
      ) {
        ["Punjab Economics", "Punjab GK", "Punjab Geography", "Punjab History"].forEach(
          addCandidate,
        );
      } else if (
        normChap.includes("hist") ||
        normChap.includes("guru") ||
        normChap.includes("misl") ||
        normChap.includes("ranjit")
      ) {
        ["Punjab History", "Punjab GK", "Punjab Geography", "Punjab Economics"].forEach(
          addCandidate,
        );
      } else {
        ["Punjab GK", "Punjab History", "Punjab Geography", "Punjab Economics"].forEach(
          addCandidate,
        );
      }
    } else if (
      normSubj.includes("pedagog") ||
      normSubj.includes("child") ||
      normSubj.includes("cdp") ||
      normSubj.includes("teaching") ||
      normSubj.includes("psycholog") ||
      normSubj.includes("education")
    ) {
      ["Teaching Aptitude", "Psychology"].forEach(addCandidate);
    } else if (normSubj.includes("english")) {
      if (
        normSubj.includes("language") ||
        normChap.includes("comprehension") ||
        normChap.includes("vocab") ||
        normChap.includes("idiom")
      ) {
        ["English Language", "English Grammar", "English Core"].forEach(addCandidate);
      } else {
        ["English Grammar", "English Language", "English Core"].forEach(addCandidate);
      }
    } else if (
      normSubj.includes("math") ||
      normSubj.includes("quant") ||
      normSubj.includes("numerical") ||
      normSubj.includes("arithmetic") ||
      normSubj.includes("ganit")
    ) {
      ["Quantitative Aptitude", "Math Class 10", "Math Class 9", "Mathematics", "CSAT"].forEach(
        addCandidate,
      );
    } else if (
      normSubj.includes("reason") ||
      normSubj.includes("mental") ||
      normSubj.includes("logical") ||
      normSubj.includes("intelligence") ||
      normSubj === "csat"
    ) {
      ["Reasoning", "CSAT"].forEach(addCandidate);
    } else if (
      normSubj.includes("comp") ||
      normSubj.includes("information tech") ||
      normSubj.includes("ict") ||
      normSubj.includes("it ") ||
      normSubj === "it"
    ) {
      ["Computer Awareness"].forEach(addCandidate);
    } else if (
      normSubj.includes("evs") ||
      normSubj.includes("environment") ||
      normSubj.includes("ecolog")
    ) {
      ["Environment and Ecology", "Biology Class 10", "Indian Geography"].forEach(addCandidate);
    } else if (
      normSubj.includes("account") ||
      normSubj.includes("commerce") ||
      normSubj.includes("business") ||
      normSubj.includes("cost") ||
      normSubj.includes("audit") ||
      normSubj.includes("tax") ||
      normSubj.includes("financ")
    ) {
      [
        "Accounting",
        "Accountancy Class 12",
        "Accountancy Class 11",
        "Business Studies Class 12",
        "Business Studies Class 11",
        "Business Economics",
        "Business Law",
        "Cost Accounting",
        "Auditing and Ethics",
        "Taxation",
        "Financial Management",
        "Financial Reporting",
        "Strategic Financial Management",
        "Direct Tax Laws",
        "Indirect Tax Laws",
        "Advanced Auditing",
        "Management Accounting",
        "Operations and Strategic Management",
      ].forEach(addCandidate);
    } else if (normSubj.includes("law") || normSubj.includes("legal")) {
      ["Business Law", "Polity"].forEach(addCandidate);
    } else if (normSubj.includes("music")) {
      ["Music", "Art and Culture"].forEach(addCandidate);
    } else if (normSubj.includes("art") && normSubj.includes("craft")) {
      ["Art and Craft", "Art and Culture"].forEach(addCandidate);
    } else if (normSubj.includes("art") || normSubj.includes("cultur")) {
      [
        "Art and Culture",
        "Art and Craft",
        "Modern History",
        "Ancient History",
        "Medieval History",
      ].forEach(addCandidate);
    } else if (
      normSubj.includes("physical ed") ||
      normSubj.includes("sports") ||
      normSubj.includes("yoga")
    ) {
      ["Physical Education"].forEach(addCandidate);
    } else if (normSubj.includes("sociolog")) {
      ["Sociology", "SST"].forEach(addCandidate);
    } else if (
      normSubj === "sst" ||
      normSubj.includes("social stud") ||
      normSubj.includes("social scien") ||
      normSubj.includes("sst ") ||
      normSubj.includes("humanit")
    ) {
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
      [
        "Polity",
        "SST",
        "Political Science Class 12",
        "Political Science Class 11",
        "SST Class 10",
        "SST Class 9",
        "General Awareness",
      ].forEach(addCandidate);
    } else if (normSubj.includes("history") || normSubj.includes("itihas")) {
      [
        "Modern History",
        "Ancient History",
        "Medieval History",
        "Art and Culture",
        "History Class 12",
        "History Class 11",
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
        "Geography Class 12",
        "Geography Class 11",
        "Environment and Ecology",
        "SST",
        "SST Class 10",
        "SST Class 9",
      ].forEach(addCandidate);
    } else if (
      normSubj.includes("econ") ||
      normSubj.includes("arth") ||
      normSubj.includes("banking")
    ) {
      [
        "Indian Economy",
        "Banking Awareness",
        "Business Economics",
        "SST",
        "SST Class 10",
        "SST Class 9",
      ].forEach(addCandidate);
    } else if (normSubj.includes("physic")) {
      [
        "Physics",
        "Physics Class 10",
        "Physics Class 9",
        "General Science",
        "Science Class 10",
        "Science Class 9",
      ].forEach(addCandidate);
    } else if (normSubj.includes("chemis")) {
      [
        "Chemistry",
        "Chemistry Class 10",
        "Chemistry Class 9",
        "General Science",
        "Science Class 10",
        "Science Class 9",
      ].forEach(addCandidate);
    } else if (
      normSubj.includes("biolog") ||
      normSubj.includes("botan") ||
      normSubj.includes("zoolog")
    ) {
      [
        "Biology",
        "Biology Class 10",
        "Biology Class 9",
        "General Science",
        "Science Class 10",
        "Science Class 9",
      ].forEach(addCandidate);
    } else if (normSubj.includes("science") || normSubj.includes("vigyan")) {
      [
        "General Science",
        "Science Class 10",
        "Science Class 9",
        "Science and Technology",
        "Biology Class 10",
        "Chemistry Class 10",
        "Physics Class 10",
        "Environment and Ecology",
      ].forEach(addCandidate);
    } else if (
      normSubj.includes("gk") ||
      normSubj.includes("general knowledge") ||
      normSubj.includes("general awareness") ||
      normSubj.includes("general studies") ||
      normSubj.includes("subject specialization") ||
      normSubj === "gs" ||
      normSubj === "ga"
    ) {
      if (normChap.includes("punjab") && normChap.includes("geog")) {
        ["Punjab Geography", "Punjab GK", "Indian Geography"].forEach(addCandidate);
      } else if (normChap.includes("punjab") && normChap.includes("hist")) {
        ["Punjab History", "Punjab GK", "Modern History"].forEach(addCandidate);
      } else if (normChap.includes("punjab")) {
        ["Punjab GK", "Punjab History", "Punjab Geography", "Punjab Economics"].forEach(
          addCandidate,
        );
      } else if (normChap.includes("polity") || normChap.includes("constitution")) {
        ["Polity", "SST", "General Awareness"].forEach(addCandidate);
      } else {
        [
          "General Awareness",
          "Polity",
          "Modern History",
          "Indian Geography",
          "Indian Economy",
          "Art and Culture",
          "Punjab GK",
          "SST",
        ].forEach(addCandidate);
      }
    } else {
      // Safe non-empty substring match (only if normSubj >= 3 chars), excluding Science/Physics/Chemistry/Biology
      if (normSubj.length >= 3) {
        for (const s of allBankSubjects) {
          const sl = s.toLowerCase();
          if (
            sl.includes("science") ||
            sl.includes("physics") ||
            sl.includes("chemistry") ||
            sl.includes("biology")
          ) {
            continue;
          }
          if (sl.includes(normSubj) || normSubj.includes(sl)) addCandidate(s);
        }
      }
    }
  }

  // 3. Also infer from chapter keywords if chapter clearly belongs to a known domain
  if (normChap) {
    if (hasGurmukhi || normChap.includes("punjabi") || normChap.includes("gurmukhi")) {
      ["Punjabi Paper A", "Punjabi Grammar", "Punjabi Paper B", "Punjabi Literature"].forEach(
        addCandidate,
      );
    } else if (hasDevanagari || normChap.includes("hindi")) {
      ["Hindi Grammar", "Hindi Literature"].forEach(addCandidate);
    } else if (
      normChap.includes("piaget") ||
      normChap.includes("vygotsky") ||
      normChap.includes("kohlberg") ||
      normChap.includes("pedagog") ||
      normChap.includes("inclusive education") ||
      normChap.includes("child development")
    ) {
      ["Teaching Aptitude", "Psychology"].forEach(addCandidate);
    } else if (
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
      ["Polity", "SST", "SST Class 10", "SST Class 9"].forEach(addCandidate);
    } else if (combined.includes("punjab")) {
      ["Punjab GK", "Punjab History", "Punjab Geography", "Punjab Economics"].forEach(addCandidate);
    }
  }

  if (isGenericSubj && candidates.length === 0) {
    [
      "General Awareness",
      "Polity",
      "Modern History",
      "Indian Geography",
      "Indian Economy",
      "SST",
    ].forEach(addCandidate);
  }

  return candidates;
}

export function isScienceSubjectOrChapter(subject: string, chapter = ""): boolean {
  const combined = `${subject} ${chapter}`.toLowerCase();
  if (
    combined.includes("social science") ||
    combined.includes("political science") ||
    combined.includes("computer science") ||
    combined.includes("home science") ||
    combined.includes("library science") ||
    combined.includes("moral science")
  ) {
    return false;
  }
  return (
    combined.includes("science") ||
    combined.includes("physic") ||
    combined.includes("chemis") ||
    combined.includes("biolog") ||
    combined.includes("botan") ||
    combined.includes("zoolog") ||
    combined.includes("vigyan") ||
    combined.includes("living world") ||
    combined.includes("human body") ||
    combined.includes("chemical reaction") ||
    combined.includes("force, energy") ||
    combined.includes("light, reflection") ||
    combined.includes("electricity")
  );
}

const LEGACY_SCIENCE_FALLBACK_PATTERNS: RegExp[] = [
  /Powerhouse of the Cell/i,
  /SI unit of electric current/i,
  /Sodium Hydrogen Carbonate \(NaHCO₃\)/i,
  /chemical name of Baking Soda/i,
  /normal pH of human blood/i,
  /Vitamin is synthesized in the human skin in the presence of sunlight/i,
  /Greenhouse Effect in Earth's atmosphere/i,
  /Force = Mass × Acceleration \(F = ma\)/i,
  /mirror is used in the headlights of cars to produce a parallel beam/i,
  /part of the human brain is responsible for maintaining posture and balance/i,
  /process of conversion of a solid directly into vapour without passing through the liquid state/i,
  /metal remains in a liquid state at room temperature/i,
  /acid is naturally present in lemons and oranges/i,
  /In the study of light and sound, what is Mirror used in vehicle rear-view/i,
  /In biology, what is Universal donor blood group/i,
  /Largest gland in the human body — The liver/i,
  /Hardest natural substance — A substance that scratches all others/i,
];

export function isLegacyScienceFallbackForNonScienceSubject(
  questionText: string,
  subject: string,
  chapter = "",
): boolean {
  if (isScienceSubjectOrChapter(subject, chapter)) return false;
  return LEGACY_SCIENCE_FALLBACK_PATTERNS.some((pattern) => pattern.test(questionText));
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
        const topicKeywords = extractBaseKeywords(tl);
        const matches = chapKeywords.filter((kw) =>
          topicKeywords.some(
            (tk) =>
              tk === kw ||
              (kw.length >= 4 && tk.length >= 4 && (tk.startsWith(kw) || kw.startsWith(tk))),
          ),
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

type CuratedSubjectCategory =
  | "preamble"
  | "polity"
  | "history"
  | "geography"
  | "economics"
  | "punjabi"
  | "punjab_gk"
  | "hindi"
  | "english"
  | "pedagogy"
  | "mathematics"
  | "reasoning"
  | "computer"
  | "commerce"
  | "environment"
  | "art_pe"
  | "science";

const CURATED_SUBJECT_FACTS: Record<CuratedSubjectCategory, CuratedFactItem[]> = {
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
  punjabi: [
    {
      q: "ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ (ਪੈਂਤੀ ਅੱਖਰੀ) ਵਿੱਚ ਮੂਲ ਰੂਪ ਵਿੱਚ ਕਿੰਨੇ ਅੱਖਰ ਸਨ ਅਤੇ ਨਵੀਨ ਵਰਗ ਸਮੇਤ ਕੁੱਲ ਕਿੰਨੇ ਅੱਖਰ ਹਨ?",
      a: "ਮੂਲ 35 ਅੱਖਰ ਅਤੇ ਨਵੀਨ ਵਰਗ ਸਮੇਤ ਕੁੱਲ 41 ਅੱਖਰ",
      d: [
        "ਮੂਲ 32 ਅੱਖਰ ਅਤੇ ਕੁੱਲ 38 ਅੱਖਰ",
        "ਮੂਲ 36 ਅੱਖਰ ਅਤੇ ਕੁੱਲ 42 ਅੱਖਰ",
        "ਮੂਲ 30 ਅੱਖਰ ਅਤੇ ਕੁੱਲ 35 ਅੱਖਰ",
      ],
      exp: "ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਪਹਿਲਾਂ 35 ਅੱਖਰ (ਪੈਂਤੀ) ਸਨ; ਫ਼ਾਰਸੀ ਧੁਨੀਆਂ ਲਈ ਬਿੰਦੀ ਵਾਲੇ 6 ਅੱਖਰ (ਸ਼, ਖ਼, ਗ਼, ਜ਼, ਫ਼, ਲ਼) ਸ਼ਾਮਲ ਹੋਣ ਨਾਲ ਕੁੱਲ 41 ਅੱਖਰ ਹਨ।",
    },
    {
      q: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਲਿਖਣ ਲਈ ਕਿਹੜੀ ਲਿਪੀ ਸਭ ਤੋਂ ਢੁਕਵੀਂ ਅਤੇ ਪ੍ਰਮਾਣਿਕ ਮੰਨੀ ਜਾਂਦੀ ਹੈ?",
      a: "ਗੁਰਮੁਖੀ ਲਿਪੀ",
      d: ["ਦੇਵਨਾਗਰੀ ਲਿਪੀ", "ਰੋਮਨ ਲਿਪੀ", "ਬ੍ਰਹਮੀ ਲਿਪੀ"],
      exp: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਦੀਆਂ ਧੁਨੀਆਂ ਨੂੰ ਪ੍ਰਗਟਾਉਣ ਲਈ ਗੁਰਮੁਖੀ ਲਿਪੀ ਹੀ ਮਿਆਰੀ ਅਤੇ ਸੰਪੂਰਨ ਲਿਪੀ ਹੈ, ਜਿਸ ਨੂੰ ਸ੍ਰੀ ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ ਨੇ ਨਿਖਾਰਿਆ।",
    },
    {
      q: "ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ ਸਵਰ ਵਾਹਕ (Vowel Bearers) ਕਿਹੜੇ ਤਿੰਨ ਅੱਖਰ ਹਨ?",
      a: "ੳ, ਅ, ੲ",
      d: ["ਸ, ਹ, ਕ", "ਕ, ਚ, ਟ", "ਯ, ਰ, ਲ"],
      exp: "ਗੁਰਮੁਖੀ ਵਿੱਚ 'ੳ, ਅ, ੲ' ਤਿੰਨ ਸਵਰ ਵਾਹਕ ਹਨ ਜਿਨ੍ਹਾਂ ਨਾਲ ਲਗਾਂ ਲੱਗ ਕੇ ਦਸ ਸਵਰ ਧੁਨੀਆਂ ਬਣਦੀਆਂ ਹਨ।",
    },
    {
      q: "ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਅਨੁਸਾਰ ਨਾਂਵ (Noun) ਦੀਆਂ ਕਿੰਨੀਆਂ ਕਿਸਮਾਂ ਹੁੰਦੀਆਂ ਹਨ?",
      a: "5 ਕਿਸਮਾਂ (ਆਮ ਨਾਂਵ, ਖਾਸ ਨਾਂਵ, ਇਕੱਠਵਾਚਕ, ਵਸਤੂਵਾਚਕ, ਭਾਵਵਾਚਕ)",
      d: ["3 ਕਿਸਮਾਂ", "4 ਕਿਸਮਾਂ", "7 ਕਿਸਮਾਂ"],
      exp: "ਪੰਜਾਬੀ ਵਿੱਚ ਨਾਂਵ ਦੀਆਂ ਪੰਜ ਕਿਸਮਾਂ ਹਨ: ਆਮ/ਜਾਤੀਵਾਚਕ ਨਾਂਵ, ਖਾਸ/ਨਿੱਜਵਾਚਕ ਨਾਂਵ, ਇਕੱਠਵਾਚਕ ਨਾਂਵ, ਵਸਤੂਵਾਚਕ ਨਾਂਵ ਅਤੇ ਭਾਵਵਾਚਕ ਨਾਂਵ।",
    },
    {
      q: "ਜਿਹੜੇ ਸ਼ਬਦ ਨਾਂਵ ਦੀ ਥਾਂ ਤੇ ਵਰਤੇ ਜਾਣ, ਉਹਨਾਂ ਨੂੰ ਪੰਜਾਬੀ ਵਿਆਕਰਣ ਵਿੱਚ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਇਸ ਦੀਆਂ ਕਿੰਨੀਆਂ ਕਿਸਮਾਂ ਹਨ?",
      a: "ਪੜਨਾਂਵ (6 ਕਿਸਮਾਂ)",
      d: ["ਵਿਸ਼ੇਸ਼ਣ (4 ਕਿਸਮਾਂ)", "ਕਿਰਿਆ ਵਿਸ਼ੇਸ਼ਣ (8 ਕਿਸਮਾਂ)", "ਸੰਬੰਧਕ (3 ਕਿਸਮਾਂ)"],
      exp: "ਨਾਂਵ ਦੀ ਥਾਂ ਵਰਤੇ ਜਾਣ ਵਾਲੇ ਸ਼ਬਦ ਪੜਨਾਂਵ ਅਖਵਾਉਂਦੇ ਹਨ ਅਤੇ ਪੜਨਾਂਵ ਦੀਆਂ 6 ਕਿਸਮਾਂ ਹੁੰਦੀਆਂ ਹਨ।",
    },
    {
      q: "'ਨੌਂ ਦੋ ਗਿਆਰਾਂ ਹੋਣਾ' ਮੁਹਾਵਰੇ ਦਾ ਸਹੀ ਅਰਥ ਕੀ ਹੈ?",
      a: "ਦੌੜ ਜਾਣਾ ਜਾਂ ਖਿਸਕ ਜਾਣਾ",
      d: ["ਹਿਸਾਬ ਲਗਾਉਣਾ", "ਬਹੁਤ ਖੁਸ਼ ਹੋਣਾ", "ਸਖ਼ਤ ਮਿਹਨਤ ਕਰਨਾ"],
      exp: "'ਨੌਂ ਦੋ ਗਿਆਰਾਂ ਹੋਣਾ' ਪੰਜਾਬੀ ਦਾ ਪ੍ਰਸਿੱਧ ਮੁਹਾਵਰਾ ਹੈ ਜਿਸ ਦਾ ਅਰਥ ਮੌਕੇ ਤੋਂ ਦੌੜ ਜਾਣਾ ਜਾਂ ਭੱਜ ਜਾਣਾ ਹੈ।",
    },
    {
      q: "'ਉੱਚਾ ਲੰਮਾ ਗੱਭਰੂ ਪੱਲੇ ਟਕੇ ਚਾਰ' ਅਖਾਣ ਕਦੋਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      a: "ਜਦੋਂ ਕਿਸੇ ਦੀ ਬਾਹਰੀ ਦਿੱਖ ਚੰਗੀ ਹੋਵੇ ਪਰ ਗੁਣ ਜਾਂ ਅਸਲੀਅਤ ਘੱਟ ਹੋਵੇ",
      d: ["ਜਦੋਂ ਕੋਈ ਬਹੁਤ ਅਮੀਰ ਹੋਵੇ", "ਜਦੋਂ ਕੋਈ ਬਹੁਤ ਬਹਾਦਰ ਹੋਵੇ", "ਜਦੋਂ ਕੋਈ ਖੇਤੀ ਕਰਦਾ ਹੋਵੇ"],
      exp: "ਇਹ ਅਖਾਣ ਉਦੋਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ ਜਦੋਂ ਬਾਹਰੋਂ ਸ਼ਾਨੋ-ਸ਼ੌਕਤ ਦਿਸੇ ਪਰ ਅੰਦਰੋਂ ਗੁਣ ਜਾਂ ਸਮਰੱਥਾ ਨਾ ਹੋਵੇ।",
    },
    {
      q: "ਪੰਜਾਬੀ ਸੂਫ਼ੀ ਕਾਵਿ-ਧਾਰਾ ਦਾ ਮੋਢੀ ਕਿਸ ਨੂੰ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ?",
      a: "ਬਾਬਾ ਸ਼ੇਖ਼ ਫ਼ਰੀਦ ਜੀ",
      d: ["ਸ਼ਾਹ ਹੁਸੈਨ", "ਬੁੱਲ੍ਹੇ ਸ਼ਾਹ", "ਹਾਸ਼ਮ ਸ਼ਾਹ"],
      exp: "ਬਾਬਾ ਸ਼ੇਖ਼ ਫ਼ਰੀਦ ਜੀ (1173–1266 ਈ.) ਨੂੰ ਪੰਜਾਬੀ ਸੂਫ਼ੀ ਕਾਵਿ ਅਤੇ ਪੰਜਾਬੀ ਸਾਹਿਤ ਦਾ ਮੋਢੀ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",
    },
    {
      q: "ਆਧੁਨਿਕ ਪੰਜਾਬੀ ਸਾਹਿਤ ਦਾ ਪਿਤਾਮਾ (Father of Modern Punjabi Literature) ਕਿਸ ਨੂੰ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
      a: "ਭਾਈ ਵੀਰ ਸਿੰਘ ਜੀ",
      d: ["ਪ੍ਰੋ. ਪੂਰਨ ਸਿੰਘ", "ਧਨੀ ਰਾਮ ਚਾਤ੍ਰਿਕ", "ਨਾਨਕ ਸਿੰਘ"],
      exp: "ਭਾਈ ਵੀਰ ਸਿੰਘ ਜੀ ਨੂੰ ਆਧੁਨਿਕ ਪੰਜਾਬੀ ਕਵਿਤਾ, ਨਾਵਲ ('ਸੁੰਦਰੀ') ਅਤੇ ਵਾਰਤਕ ਦਾ ਮੋਢੀ ਹੋਣ ਕਰਕੇ ਆਧੁਨਿਕ ਪੰਜਾਬੀ ਸਾਹਿਤ ਦਾ ਪਿਤਾਮਾ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",
    },
    {
      q: "ਪੰਜਾਬੀ ਦੀ ਟਕਸਾਲੀ (ਮਿਆਰੀ) ਭਾਸ਼ਾ ਦਾ ਆਧਾਰ ਕਿਹੜੀ ਉਪਭਾਸ਼ਾ ਹੈ?",
      a: "ਮਾਝੀ ਉਪਭਾਸ਼ਾ",
      d: ["ਮਲਵਈ ਉਪਭਾਸ਼ਾ", "ਦੁਆਬੀ ਉਪਭਾਸ਼ਾ", "ਪੁਆਧੀ ਉਪਭਾਸ਼ਾ"],
      exp: "ਅੰਮ੍ਰਿਤਸਰ, ਤਰਨਤਾਰਨ ਅਤੇ ਗੁਰਦਾਸਪੁਰ ਖੇਤਰ ਵਿੱਚ ਬੋਲੀ ਜਾਂਦੀ ਮਾਝੀ ਉਪਭਾਸ਼ਾ ਨੂੰ ਪੰਜਾਬੀ ਦੀ ਟਕਸਾਲੀ ਭਾਸ਼ਾ ਦਾ ਆਧਾਰ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",
    },
  ],
  punjab_gk: [
    {
      q: "Who founded the city of Amritsar (originally Ramdaspur) in 1574?",
      a: "Sri Guru Ram Das Ji (Fourth Sikh Guru)",
      d: [
        "Sri Guru Amar Das Ji (Third Sikh Guru)",
        "Sri Guru Arjan Dev Ji (Fifth Sikh Guru)",
        "Sri Guru Hargobind Sahib Ji (Sixth Sikh Guru)",
      ],
      exp: "Fourth Sikh Guru Sri Guru Ram Das Ji founded Chak Ramdas / Ramdaspur in 1574, which later came to be known as Amritsar after the Amrit Sarovar.",
    },
    {
      q: "Who compiled the Adi Granth Sahib and installed it at Sri Harmandir Sahib in 1604?",
      a: "Sri Guru Arjan Dev Ji (Fifth Sikh Guru)",
      d: ["Sri Guru Nanak Dev Ji", "Sri Guru Angad Dev Ji", "Sri Guru Gobind Singh Ji"],
      exp: "Fifth Sikh Guru Sri Guru Arjan Dev Ji compiled the Adi Granth in 1604 with Bhai Gurdas Ji as the scribe, and Baba Buddha Ji was appointed the first Granthi.",
    },
    {
      q: "Between which two rivers does the 'Bist Doab' (Doaba region) of Punjab lie?",
      a: "Beas and Sutlej rivers",
      d: [
        "Ravi and Beas rivers (Bari Doab)",
        "Ravi and Chenab rivers (Rechna Doab)",
        "Chenab and Jhelum rivers (Chaj Doab)",
      ],
      exp: "Bist Jalandhar Doab (Doaba) is the fertile region between the Beas and Sutlej rivers covering Jalandhar, Hoshiarpur, Kapurthala, and Shaheed Bhagat Singh Nagar.",
    },
    {
      q: "Which treaty was signed between Maharaja Ranjit Singh and the British East India Company on 25 April 1809?",
      a: "Treaty of Amritsar (1809) with River Sutlej as the boundary",
      d: ["Treaty of Lahore (1846)", "Treaty of Bhyrowal (1846)", "Treaty of Tripartite (1838)"],
      exp: "The Treaty of Amritsar (1809) was signed between Maharaja Ranjit Singh and Charles T. Metcalfe, fixing the River Sutlej as the southern boundary of Ranjit Singh's empire.",
    },
    {
      q: "On which date did the linguistic reorganisation of modern Punjab take place under the Punjab Reorganisation Act?",
      a: "1 November 1966",
      d: ["15 August 1947", "26 January 1950", "1 November 1956"],
      exp: "Modern Punjabi-speaking Punjab state was formed on 1 November 1966 on the recommendation of the Shah Commission.",
    },
    {
      q: "What are the official State Bird, State Animal, and State Tree of Punjab?",
      a: "Baaz (Northern Goshawk), Blackbuck (Kala Hiran), and Sheesham (Tahli)",
      d: [
        "Peacock, Tiger, and Banyan",
        "Sarus Crane, Nilgai, and Peepal",
        "Black Francolin, Chinkara, and Neem",
      ],
      exp: "Punjab's state symbols are Baaz (Northern Goshawk) as State Bird, Blackbuck as State Animal, and Sheesham (Dalbergia sissoo / Tahli) as State Tree.",
    },
  ],
  hindi: [
    {
      q: "हिंदी वर्णमाला में मूल स्वरों और कुल वर्णों की मानक संख्या कितनी मानी जाती है?",
      a: "11 स्वर और कुल 52 वर्ण",
      d: ["10 स्वर और 48 वर्ण", "13 स्वर और 56 वर्ण", "9 स्वर और 44 वर्ण"],
      exp: "मानक हिंदी वर्णमाला में 11 स्वर और 33 मूल व्यंजन सहित कुल 52 वर्ण होते हैं।",
    },
    {
      q: "किसी व्यक्ति, वस्तु, स्थान, जाति या भाव के नाम को व्याकरण में क्या कहते हैं?",
      a: "संज्ञा",
      d: ["सर्वनाम", "विशेषण", "क्रिया-विशेषण"],
      exp: "किसी प्राणी, वस्तु, स्थान, जाति या भाव के नाम को संज्ञा कहते हैं; जैसे—राम, भारत, बचपन, मिठास।",
    },
    {
      q: "संज्ञा के स्थान पर प्रयुक्त होने वाले शब्दों को क्या कहते हैं और हिंदी में इसके कितने भेद हैं?",
      a: "सर्वनाम (6 भेद)",
      d: ["विशेषण (4 भेद)", "कारक (8 भेद)", "वाच्य (3 भेद)"],
      exp: "संज्ञा के स्थान पर आने वाले शब्द सर्वनाम कहलाते हैं। हिंदी में सर्वनाम के 6 भेद हैं: पुरुषवाचक, निश्चयवाचक, अनिश्चयवाचक, संबंधवाचक, प्रश्नवाचक और निजवाचक।",
    },
    {
      q: "'विद्या + आल = विद्यालय' में कौन-सी संधि है?",
      a: "दीर्घ स्वर संधि",
      d: ["गुण स्वर संधि", "वृद्धि स्वर संधि", "यण स्वर संधि"],
      exp: "समान स्वर (आ + आ = आ) मिलकर दीर्घ हो जाने के कारण 'विद्यालय' में दीर्घ स्वर संधि है।",
    },
    {
      q: "हिंदी साहित्य के इतिहास में 'भक्तिकाल' को किसने 'स्वर्ण युग' (Golden Age) कहा है?",
      a: "जॉर्ज ग्रियर्सन (George Grierson)",
      d: ["आचार्य रामचंद्र शुक्ल", "हजारी प्रसाद द्विवेदी", "डॉ. नगेंद्र"],
      exp: "जॉर्ज ग्रियर्सन ने हिंदी साहित्य के भक्तिकाल को अपनी उत्कृष्ट काव्य-चेतना और लोकमंगल के कारण 'स्वर्ण काल / स्वर्ण युग' की संज्ञा दी।",
    },
  ],
  english: [
    {
      q: "Choose the grammatically correct sentence in the Present Perfect Continuous tense for an action that started in the past and continues in the present:",
      a: "She has been preparing for the competitive examination since morning.",
      d: [
        "She is preparing for the competitive examination since morning.",
        "She have been preparing for the competitive examination from morning.",
        "She had prepared for the competitive examination since morning.",
      ],
      exp: "Present Perfect Continuous ('has/have been + V-ing') is used with 'since' (point in time) or 'for' (period of time) for actions continuing from the past into the present.",
    },
    {
      q: "Identify the correct Passive Voice of the sentence: 'The committee approved the new education policy.'",
      a: "The new education policy was approved by the committee.",
      d: [
        "The new education policy is approved by the committee.",
        "The new education policy has been approved by the committee.",
        "The new education policy had approved by the committee.",
      ],
      exp: "A sentence in Simple Past Active ('approved') converts to 'was/were + past participle (V3)' in Passive Voice.",
    },
    {
      q: "According to Subject–Verb Agreement rules, which verb form correctly completes: 'Neither the teacher nor the students ___ present in the hall.'?",
      a: "were (agrees with the nearer subject 'students')",
      d: ["was", "is", "has been"],
      exp: "When two subjects are joined by 'Neither...nor' or 'Either...or', the verb agrees in number and person with the nearer subject ('students' -> plural 'were').",
    },
    {
      q: "What is the meaning of the English idiom 'To burn the midnight oil'?",
      a: "To work or study late into the night with great dedication",
      d: [
        "To waste expensive resources carelessly",
        "To create a sudden dispute without reason",
        "To postpone an urgent task indefinitely",
      ],
      exp: "'To burn the midnight oil' means to study or work late at night.",
    },
    {
      q: "Choose the correct preposition: 'He is senior ___ me in service by five years.'",
      a: "to (Latin comparatives like senior, junior, superior, inferior, prior take 'to')",
      d: ["than", "from", "over"],
      exp: "Latin comparative adjectives ending in '-ior' (senior, junior, superior, inferior, prior, anterior, posterior) are followed by the preposition 'to', never 'than'.",
    },
  ],
  pedagogy: [
    {
      q: "According to Jean Piaget's Theory of Cognitive Development, in which stage does a child develop 'Object Permanence'?",
      a: "Sensorimotor Stage (Birth to 2 years)",
      d: [
        "Pre-operational Stage (2 to 7 years)",
        "Concrete Operational Stage (7 to 11 years)",
        "Formal Operational Stage (11+ years)",
      ],
      exp: "Object permanence—the understanding that objects continue to exist even when they cannot be seen or heard—develops during the Sensorimotor stage.",
    },
    {
      q: "In Lev Vygotsky's Sociocultural Theory of learning, what does 'Zone of Proximal Development (ZPD)' refer to?",
      a: "The gap between what a learner can do independently and what they can achieve with guidance (Scaffolding)",
      d: [
        "A fixed biological limit of intelligence determined purely by heredity",
        "Standardized summative examination scores at the end of the academic year",
        "Rote memorisation of textbook definitions without peer interaction",
      ],
      exp: "Vygotsky defined ZPD as the distance between actual developmental level (independent problem solving) and potential development through adult guidance or capable peers.",
    },
    {
      q: "Which type of classroom assessment is conducted continuously during instruction to diagnose learning gaps and provide immediate feedback?",
      a: "Formative Assessment (Assessment for Learning)",
      d: [
        "Summative Assessment (Year-end board grading only)",
        "Norm-Referenced Ranking Test only",
        "High-Stakes Certification Examination",
      ],
      exp: "Formative assessment ('Assessment for Learning') monitors student learning during the instructional process to improve teaching and learning.",
    },
    {
      q: "What is the core principle of 'Inclusive Education' under the RTE Act 2009 and NEP 2020?",
      a: "Educating children with diverse abilities and special needs together in regular classrooms with appropriate support",
      d: [
        "Segregating slow learners into separate permanent institutions",
        "Using a rigid, uniform teaching method without any curriculum adaptation",
        "Focusing classroom instruction exclusively on high-scoring students",
      ],
      exp: "Inclusive education welcomes all learners—regardless of disability, social background, or learning pace—into regular schools by adapting pedagogy and providing equitable support.",
    },
    {
      q: "What new school curricular and pedagogical structure is recommended by the National Education Policy (NEP) 2020 to replace the 10+2 system?",
      a: "5 + 3 + 3 + 4 curricular structure (Foundational, Preparatory, Middle, and Secondary stages)",
      d: [
        "8 + 4 curricular structure",
        "6 + 3 + 3 curricular structure",
        "4 + 4 + 4 curricular structure",
      ],
      exp: "NEP 2020 replaces 10+2 with a 5+3+3+4 structure covering ages 3–8 (Foundational), 8–11 (Preparatory), 11–14 (Middle), and 14–18 (Secondary).",
    },
  ],
  mathematics: [
    {
      q: "If the HCF of two positive integers is 12 and their LCM is 180, and one of the numbers is 36, what is the other number?",
      a: "60 (using Product of two numbers = HCF × LCM => 36 × x = 12 × 180)",
      d: ["45", "48", "72"],
      exp: "For any two positive integers a and b, a × b = HCF(a, b) × LCM(a, b). Therefore, b = (12 × 180) / 36 = 60.",
    },
    {
      q: "An article with a cost price of ₹800 is sold at a profit of 15%. What is its selling price?",
      a: "₹920",
      d: ["₹880", "₹915", "₹960"],
      exp: "Profit = 15% of ₹800 = (15/100) × 800 = ₹120. Selling Price = Cost Price + Profit = ₹800 + ₹120 = ₹920.",
    },
    {
      q: "What is the Simple Interest on a principal of ₹5,000 at 8% per annum for 3 years?",
      a: "₹1,200",
      d: ["₹1,000", "₹1,250", "₹1,400"],
      exp: "Simple Interest (SI) = (P × R × T) / 100 = (5000 × 8 × 3) / 100 = ₹1,200.",
    },
    {
      q: "If A can complete a piece of work in 10 days and B can complete the same work in 15 days, in how many days will they complete it working together?",
      a: "6 days",
      d: ["5 days", "8 days", "12.5 days"],
      exp: "Combined 1-day work = 1/10 + 1/15 = (3 + 2)/30 = 5/30 = 1/6. Hence, working together they finish the work in 6 days.",
    },
    {
      q: "What is the area of a circle whose radius is 7 cm (take π = 22/7)?",
      a: "154 cm²",
      d: ["44 cm²", "88 cm²", "308 cm²"],
      exp: "Area of a circle = πr² = (22/7) × 7 × 7 = 154 cm².",
    },
  ],
  reasoning: [
    {
      q: "Find the next term in the number series: 3, 7, 15, 31, 63, ?",
      a: "127 (pattern: ×2 + 1 at each step -> 63 × 2 + 1 = 127)",
      d: ["125", "115", "95"],
      exp: "Each term follows the rule (previous term × 2) + 1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, and 63×2+1=127.",
    },
    {
      q: "In a certain code language, if 'TEACHER' is coded by shifting each letter +2 forward in the alphabet as 'VGCEJGT', how is 'SCHOOL' coded?",
      a: "UEJQQN",
      d: ["TDIPPM", "UFKRRP", "RDGNNK"],
      exp: "Shifting each letter +2 positions forward: S->U, C->E, H->J, O->Q, O->Q, L->N gives 'UEJQQN'.",
    },
    {
      q: "Pointing to a gentleman, Asha said, 'His only brother is the father of my daughter's father.' How is the gentleman related to Asha?",
      a: "Father's brother (Paternal Uncle)",
      d: ["Brother", "Grandfather", "Brother-in-law"],
      exp: "'My daughter's father' is Asha's husband. The father of Asha's husband is Asha's father-in-law, or if referring to Asha's own father's brother, he is Uncle.",
    },
    {
      q: "Rohan walks 8 km North, then turns right and walks 6 km East. What is his shortest straight-line distance from the starting point?",
      a: "10 km (by Pythagoras theorem: √(8² + 6²) = √(64 + 36) = √100 = 10 km)",
      d: ["14 km", "12 km", "7 km"],
      exp: "The path forms a right-angled triangle with legs 8 km and 6 km. Shortest distance = √(8² + 6²) = 10 km.",
    },
  ],
  computer: [
    {
      q: "Which component of the Central Processing Unit (CPU) performs all arithmetic calculations and logical comparisons?",
      a: "Arithmetic Logic Unit (ALU)",
      d: ["Control Unit (CU)", "Cache Register Only", "Secondary Hard Disk"],
      exp: "The Arithmetic Logic Unit (ALU) inside the CPU executes arithmetic operations (addition, subtraction) and logical comparisons (AND, OR, NOT).",
    },
    {
      q: "Which computer memory is 'volatile'—meaning its stored data is lost as soon as power is switched off?",
      a: "RAM (Random Access Memory)",
      d: ["ROM (Read Only Memory)", "Solid State Drive (SSD)", "Optical Blu-ray Disc"],
      exp: "RAM is primary volatile working memory, whereas ROM, SSD, and Hard Disk are non-volatile storage.",
    },
    {
      q: "In MS Excel, every formula or function must begin with which symbol?",
      a: "Equal sign (=), for example =SUM(A1:A10)",
      d: ["Hash symbol (#)", "Ampersand (&)", "Dollar sign ($)"],
      exp: "In Microsoft Excel and spreadsheet software, all formulas begin with the '=' sign so the cell evaluates the expression.",
    },
    {
      q: "What does the protocol acronym 'HTTPS' stand for in secure web browsing?",
      a: "HyperText Transfer Protocol Secure",
      d: [
        "High Transmission Text Program System",
        "Hyperlink Terminal Transfer Process Standard",
        "Host Transfer Telecommunication Protocol Service",
      ],
      exp: "HTTPS (HyperText Transfer Protocol Secure) encrypts communication between the browser and server using TLS/SSL.",
    },
  ],
  commerce: [
    {
      q: "What is the fundamental 'Accounting Equation' that forms the basis of the Double Entry System and Balance Sheet?",
      a: "Assets = Liabilities + Capital (Owner's Equity)",
      d: [
        "Assets = Revenue − Expenses",
        "Capital = Assets + Liabilities",
        "Liabilities = Assets + Capital",
      ],
      exp: "Under the Dual Aspect Concept, total resources (Assets) of a business are always equal to the claims of creditors (Liabilities) plus owners (Capital).",
    },
    {
      q: "What is the Golden Rule of Accounting for 'Nominal Accounts' (Incomes, Expenses, Gains, and Losses)?",
      a: "Debit all expenses and losses, Credit all incomes and gains",
      d: [
        "Debit the receiver, Credit the giver",
        "Debit what comes in, Credit what goes out",
        "Debit all assets, Credit all expenses",
      ],
      exp: "Nominal accounts follow: 'Debit all expenses and losses, Credit all incomes and gains'. Personal accounts follow 'Debit receiver, Credit giver' and Real accounts follow 'Debit what comes in, Credit what goes out'.",
    },
    {
      q: "Under Goods and Services Tax (GST) in India, which tax is levied on an 'Inter-State' supply of goods and services?",
      a: "IGST (Integrated Goods and Services Tax)",
      d: ["CGST + SGST only", "Value Added Tax (VAT) only", "Central Excise Duty only"],
      exp: "Inter-state supplies attract IGST collected by the Centre under Article 269A, whereas intra-state supplies attract CGST + SGST/UTGST.",
    },
    {
      q: "Under the Indian Contract Act, 1872, which section defines a valid 'Contract' as 'an agreement enforceable by law'?",
      a: "Section 2(h) of the Indian Contract Act, 1872",
      d: ["Section 10", "Section 14", "Section 73"],
      exp: "Section 2(h) defines a contract as an agreement enforceable by law, while Section 10 lays down the essentials of a valid contract.",
    },
  ],
  environment: [
    {
      q: "According to Raymond Lindeman's '10% Law' of energy flow in an ecosystem, how much energy is transferred from one trophic level to the next?",
      a: "Approximately 10% of the energy (while 90% is lost largely as metabolic heat)",
      d: ["50% of the energy", "90% of the energy", "100% of the energy"],
      exp: "Lindeman's 10% Law (1942) states that only about 10% of organic energy stored at one trophic level is converted into biomass at the next trophic level.",
    },
    {
      q: "Which international treaty signed in 1987 was adopted specifically to phase out substances that deplete the stratospheric Ozone Layer?",
      a: "Montreal Protocol (1987)",
      d: ["Kyoto Protocol (1997)", "Ramsar Convention (1971)", "Basel Convention (1989)"],
      exp: "The Montreal Protocol on Substances that Deplete the Ozone Layer was signed on 16 September 1987 to phase out CFCs and halons.",
    },
    {
      q: "In which year was the Wildlife (Protection) Act enacted by the Parliament of India to safeguard wild animals, birds, and protected areas?",
      a: "1972",
      d: ["1980", "1986", "2002"],
      exp: "The Wildlife (Protection) Act was enacted in 1972, followed by Project Tiger in 1973 and the Environment (Protection) Act in 1986.",
    },
  ],
  art_pe: [
    {
      q: "Which classical dance form originated in Tamil Nadu and was historically performed as 'Sadir' in temple traditions?",
      a: "Bharatanatyam",
      d: ["Kathakali (Kerala)", "Odissi (Odisha)", "Manipuri (Manipur)"],
      exp: "Bharatanatyam is the oldest classical dance tradition of Tamil Nadu, codified in Bharata Muni's Natya Shastra.",
    },
    {
      q: "On which date is 'International Day of Yoga' celebrated annually across the world?",
      a: "21 June",
      d: ["29 August (National Sports Day)", "5 June", "12 January"],
      exp: "The United Nations proclaimed 21 June (the summer solstice) as International Day of Yoga in December 2014.",
    },
    {
      q: "In Indian Classical Music, how many fundamental Swaras (notes) constitute a 'Saptak'?",
      a: "7 Shuddha Swaras (Sa, Re, Ga, Ma, Pa, Dha, Ni)",
      d: ["5 Swaras", "9 Swaras", "11 Swaras"],
      exp: "A Saptak consists of the seven fundamental notes: Shadja (Sa), Rishabha (Re), Gandhara (Ga), Madhyama (Ma), Panchama (Pa), Dhaivata (Dha), and Nishada (Ni).",
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
  const combined = `${normSubj} ${normChap}`;

  // 1. Punjabi / Gurmukhi
  if (
    /[\u0A00-\u0A7F]/.test(`${subject} ${chapter}`) ||
    normSubj.includes("punjabi") ||
    normSubj.includes("gurmukhi") ||
    normChap.includes("punjabi") ||
    normChap.includes("gurmukhi")
  ) {
    return CURATED_SUBJECT_FACTS.punjabi;
  }

  // 2. Hindi / Devanagari
  if (
    /[\u0900-\u097F]/.test(`${subject} ${chapter}`) ||
    normSubj.includes("hindi") ||
    normChap.includes("hindi")
  ) {
    return CURATED_SUBJECT_FACTS.hindi;
  }

  // 3. Preamble
  if (normChap.includes("preamble") || normSubj.includes("preamble")) {
    return PREAMBLE_FACT_BANK;
  }

  // 4. Child Development & Pedagogy / Teaching Aptitude / Psychology
  if (
    normSubj.includes("pedagog") ||
    normSubj.includes("child") ||
    normSubj.includes("cdp") ||
    normSubj.includes("teaching") ||
    normSubj.includes("psycholog") ||
    normChap.includes("pedagog") ||
    normChap.includes("piaget") ||
    normChap.includes("vygotsky") ||
    normChap.includes("kohlberg") ||
    normChap.includes("inclusive education") ||
    normChap.includes("child development")
  ) {
    return CURATED_SUBJECT_FACTS.pedagogy;
  }

  // 5. English Language & Grammar
  if (
    normSubj.includes("english") ||
    normChap.includes("english") ||
    normChap.includes("tense") ||
    normChap.includes("noun") ||
    normChap.includes("pronoun") ||
    normChap.includes("preposition") ||
    normChap.includes("passive voice") ||
    normChap.includes("narration") ||
    normChap.includes("comprehension") ||
    normChap.includes("vocabulary")
  ) {
    return CURATED_SUBJECT_FACTS.english;
  }

  // 6. Mathematics & Quantitative Aptitude
  if (
    normSubj.includes("math") ||
    normSubj.includes("quant") ||
    normSubj.includes("numerical") ||
    normSubj.includes("arithmetic") ||
    normChap.includes("mensuration") ||
    normChap.includes("algebra") ||
    normChap.includes("trigonometr") ||
    normChap.includes("percentage") ||
    normChap.includes("number system") ||
    normChap.includes("profit and loss") ||
    normChap.includes("quadratic") ||
    normChap.includes("calculus") ||
    normChap.includes("matrices")
  ) {
    return CURATED_SUBJECT_FACTS.mathematics;
  }

  // 7. Reasoning & Mental Ability
  if (
    normSubj.includes("reason") ||
    normSubj.includes("mental") ||
    normSubj.includes("logical") ||
    normSubj === "csat" ||
    normChap.includes("syllogism") ||
    normChap.includes("coding-decoding") ||
    normChap.includes("blood relation") ||
    normChap.includes("seating arrangement")
  ) {
    return CURATED_SUBJECT_FACTS.reasoning;
  }

  // 8. Computer Awareness & IT
  if (
    normSubj.includes("comp") ||
    normSubj.includes("information tech") ||
    normSubj.includes("ict") ||
    normChap.includes("ms office") ||
    normChap.includes("cyber security") ||
    normChap.includes("dbms") ||
    normChap.includes("operating system") ||
    normChap.includes("networking")
  ) {
    return CURATED_SUBJECT_FACTS.computer;
  }

  // 9. Punjab GK, Punjab History, Punjab Geography, Punjab Economy
  if (
    normSubj.includes("punjab") ||
    normChap.includes("punjab") ||
    normChap.includes("sikh guru") ||
    normChap.includes("misl")
  ) {
    return CURATED_SUBJECT_FACTS.punjab_gk;
  }

  // 10. Commerce, Accounting, Business Studies, Costing, Auditing, Taxation, Financial Management, Law
  if (
    normSubj.includes("account") ||
    normSubj.includes("commerce") ||
    normSubj.includes("business") ||
    normSubj.includes("cost") ||
    normSubj.includes("audit") ||
    normSubj.includes("tax") ||
    normSubj.includes("financ") ||
    normSubj.includes("law") ||
    normChap.includes("ledger") ||
    normChap.includes("balance sheet") ||
    normChap.includes("gst") ||
    normChap.includes("partnership") ||
    normChap.includes("debenture") ||
    normChap.includes("contract act")
  ) {
    return CURATED_SUBJECT_FACTS.commerce;
  }

  // 11. Environment & Ecology (EVS)
  if (
    normSubj.includes("environment") ||
    normSubj.includes("ecolog") ||
    normSubj.includes("evs") ||
    normChap.includes("ecosystem") ||
    normChap.includes("biodiversity") ||
    normChap.includes("environmental studies") ||
    normChap.includes("climate change")
  ) {
    return CURATED_SUBJECT_FACTS.environment;
  }

  // 12. Art, Craft, Music, Physical Education
  if (
    normSubj.includes("art") ||
    normSubj.includes("music") ||
    normSubj.includes("physical ed") ||
    normChap.includes("raga") ||
    normChap.includes("taal") ||
    normChap.includes("painting") ||
    normChap.includes("olympic") ||
    normChap.includes("yoga")
  ) {
    return CURATED_SUBJECT_FACTS.art_pe;
  }

  // 13. Science, Physics, Chemistry, Biology (ONLY when explicitly Science/Physics/Chemistry/Biology!)
  if (
    (normSubj.includes("science") &&
      !normSubj.includes("social") &&
      !normSubj.includes("political")) ||
    normSubj.includes("physic") ||
    normSubj.includes("chemis") ||
    normSubj.includes("biolog") ||
    normChap.includes("cell") ||
    normChap.includes("chemical") ||
    normChap.includes("electric") ||
    normChap.includes("optics") ||
    normChap.includes("thermodynamic") ||
    normChap.includes("human body")
  ) {
    return CURATED_SUBJECT_FACTS.science;
  }

  // 14. Polity & Constitution
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
    normSubj.includes("civic") ||
    normSubj.includes("political")
  ) {
    return [...CURATED_SUBJECT_FACTS.polity, ...PREAMBLE_FACT_BANK];
  }

  // 15. History & Culture
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
    return CURATED_SUBJECT_FACTS.history;
  }

  // 16. Geography
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
    return CURATED_SUBJECT_FACTS.geography;
  }

  // 17. Economics & Banking
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
    normSubj.includes("econ") ||
    normSubj.includes("banking")
  ) {
    return CURATED_SUBJECT_FACTS.economics;
  }

  // 18. Default for SST, General Awareness, General Knowledge, Sociology, or any general humanities subject — NEVER Science!
  if (combined.includes("punjab")) {
    return CURATED_SUBJECT_FACTS.punjab_gk;
  }
  return [
    ...PREAMBLE_FACT_BANK.slice(0, 6),
    ...CURATED_SUBJECT_FACTS.polity,
    ...CURATED_SUBJECT_FACTS.history,
    ...CURATED_SUBJECT_FACTS.geography,
    ...CURATED_SUBJECT_FACTS.economics,
  ];
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
  const isPunjabi =
    /[\u0A00-\u0A7F]/.test(`${subject} ${chapter}`) ||
    subject.toLowerCase().includes("punjabi") ||
    subject.toLowerCase().includes("gurmukhi");

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
    if (isPunjabi) {
      prompt = `${chapter} (${subject}) ਸੰਬੰਧੀ ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ 'ਤੇ ਵਿਚਾਰ ਕਰੋ:\n1. ${primaryFact.q.replace(/\?$/, "")} — ${primaryFact.a}।\n2. ${secondaryFact.q.replace(/\?$/, "")} — ${secondaryFact.a}।\nਉਪਰੋਕਤ ਵਿੱਚੋਂ ਕਿਹੜਾ/ਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹੈ/ਹਨ?`;
      correct = "1 ਅਤੇ 2 ਦੋਵੇਂ ਸਹੀ ਹਨ";
      distractors = [
        `ਸਿਰਫ਼ 1 ਸਹੀ ਹੈ (ਕਥਨ 2 ਵਿੱਚ '${secondaryFact.d[0]}' ਨਹੀਂ ਆਉਂਦਾ)`,
        `ਸਿਰਫ਼ 2 ਸਹੀ ਹੈ (ਕਥਨ 1 ਵਿੱਚ '${primaryFact.d[0]}' ਨਹੀਂ ਆਉਂਦਾ)`,
        "ਨਾ ਤਾਂ 1 ਅਤੇ ਨਾ ਹੀ 2 ਸਹੀ ਹੈ",
      ];
      explanation = `ਕਥਨ 1 ਸਹੀ ਹੈ: ${primaryFact.exp} ਕਥਨ 2 ਵੀ ਸਹੀ ਹੈ: ${secondaryFact.exp}`;
    } else {
      prompt = `Consider the following statements regarding ${chapter} (${subject}):\n1. ${primaryFact.q.replace(/\?$/, "")}: ${primaryFact.a}.\n2. ${secondaryFact.q.replace(/\?$/, "")}: ${secondaryFact.a}.\nWhich of the statements given above is/are correct?`;
      correct = "Both 1 and 2 are correct";
      distractors = [
        `1 only (Statement 2 should be: ${secondaryFact.d[0]})`,
        `2 only (Statement 1 should be: ${primaryFact.d[0]})`,
        "Neither 1 nor 2 is correct",
      ];
      explanation = `Statement 1 is correct: ${primaryFact.exp} Statement 2 is also correct: ${secondaryFact.exp}`;
    }
  } else {
    qType = "assertion-reason";
    if (isPunjabi) {
      prompt = `${chapter} (${subject} — ਪ੍ਰਸ਼ਨ #${itemNo}) ਸੰਬੰਧੀ ਕਥਨ (A) ਅਤੇ ਕਾਰਨ (R) ਪੜ੍ਹੋ:\nਕਥਨ (A): ${primaryFact.q.replace(/\?$/, "")} — ${primaryFact.a}।\nਕਾਰਨ (R): ${primaryFact.exp}\nਹੇਠਾਂ ਦਿੱਤੇ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਸਹੀ ਉੱਤਰ ਚੁਣੋ:`;
      correct = "(A) ਅਤੇ (R) ਦੋਵੇਂ ਸਹੀ ਹਨ ਅਤੇ (R), (A) ਦੀ ਸਹੀ ਵਿਆਖਿਆ ਕਰਦਾ ਹੈ";
      distractors = [
        "(A) ਅਤੇ (R) ਦੋਵੇਂ ਸਹੀ ਹਨ ਪਰ (R), (A) ਦੀ ਸਹੀ ਵਿਆਖਿਆ ਨਹੀਂ ਕਰਦਾ",
        "(A) ਸਹੀ ਹੈ ਪਰ (R) ਗਲਤ ਹੈ",
        `(A) ਗਲਤ ਹੈ ਕਿਉਂਕਿ '${primaryFact.d[0]}' ਸਹੀ ਨਹੀਂ ਹੈ`,
      ];
      explanation = `${primaryFact.exp} ਇਸ ਲਈ ਕਥਨ (A) ਅਤੇ ਕਾਰਨ (R) ਦੋਵੇਂ ਸਹੀ ਹਨ।`;
    } else {
      prompt = `Assertion–Reason on ${chapter} (${subject} — High-Yield #${itemNo}):\nAssertion (A): ${primaryFact.q.replace(/\?$/, "")} — ${primaryFact.a}.\nReason (R): ${primaryFact.exp}\nSelect the correct answer using the code below:`;
      correct = "Both (A) and (R) are true, and (R) is the correct explanation of (A)";
      distractors = [
        "Both (A) and (R) are true, but (R) is NOT the correct explanation of (A)",
        "(A) is true, but (R) is false",
        "(A) is false, because the correct answer is " + primaryFact.d[0],
      ];
      explanation = `${primaryFact.exp} Hence both Assertion (A) and Reason (R) are true and (R) correctly explains (A).`;
    }
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
 * 2. Pulls from bank templates whose chapter/topic matches the requested chapter (first at the
 *    requested difficulty, then across sibling difficulties of the same chapter).
 * 3. Missing coverage is reported; no sibling chapter or synthetic filler is used.
 *    (so Punjabi always pulls from Punjabi templates, Pedagogy from Teaching Aptitude, etc.).
 * 4. Fills any remaining slots with subject-accurate Easy → Moderate → Difficult questions.
 */
/** Strict bank-only generation: never invent a paper or relabel another chapter. */
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
  const subject = input.subject.trim();
  const topic = input.topic.trim();
  if (
    !subject ||
    /^(general|mixed|all|all subjects|default)$/i.test(subject) ||
    !topic ||
    input.count < 1
  )
    return [];
  const norm = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
  const exact = [...new Set(ACTIVE_TEMPLATES.map((t) => t.subject))].find(
    (s) => norm(s) === norm(subject),
  );
  // Subject aliases may resolve to their own family; chapter words never change the subject.
  const subjects = exact ? [exact] : resolveCandidateBankSubjects(subject, "");
  const pairs = [
    ...new Map(
      ACTIVE_TEMPLATES.filter(
        (t) =>
          subjects.includes(t.subject) &&
          (input.exam === "All Exams" || t.exams.includes(input.exam)) &&
          (topic === "Mixed" || norm(t.topic) === norm(topic)),
      ).map((t) => [`${t.subject}::${t.topic}`, { subject: t.subject, topic: t.topic }]),
    ).values(),
  ];
  const random = seededRandom(input.seed || "kkcc-strict-paper");
  const seen = new Set<string>();
  const out: GeneratedTestQuestion[] = [];
  const levels: Difficulty[] =
    input.difficulty === "Mixed" ? ["Easy", "Moderate", "Difficult"] : [input.difficulty];
  const count = Math.min(1000, Math.floor(input.count));
  // Round-robin keeps mixed papers varied without imposing an artificial 60-question quota.
  for (let round = 0; round < count; round++) {
    const before = out.length;
    for (const level of levels)
      for (const pair of pairs) {
        if (out.length >= count) break;
        const drawn = generateQuestionsForTest({
          exam: input.exam,
          ...pair,
          difficulty: level,
          count: 1,
          random,
          seen,
        });
        for (const question of drawn)
          out.push({
            ...question,
            id: question.source_id,
            subject,
            marks: input.marks,
            negative_marks: input.negative_marks,
            sort_order: out.length,
            created_at: "",
            updated_at: "",
          });
      }
    if (out.length === before || out.length >= count) break;
  }
  return out;
}
