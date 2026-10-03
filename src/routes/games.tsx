import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DIFFICULTY_LADDER,
  QUESTIONS_PER_LEVEL,
  levelForIndex,
  type LadderLevel,
} from "@/lib/quiz-levels";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Gift } from "lucide-react";
import {
  claimRewardVoucher,
  listRewardVouchers,
  type VoucherOffer,
} from "@/lib/vouchers.functions";
import { safeServerCall } from "@/lib/safe-server-call";
import { listMySeriesAccess } from "@/lib/test-access.functions";
import { PAID_TEST_SERIES } from "@/lib/test-series-catalog";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BrainCircuit,
  Calculator,
  ChevronLeft,
  Infinity as InfinityIcon,
  Layers,
  Shuffle,
  Timer,
  CalendarClock,
  CheckCircle2,
  FlaskConical,
  Gamepad2,
  Globe2,
  Landmark,
  Loader2,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { FeatureUnavailable, SiteLayout } from "@/components/kkcc/site-layout";
import { useAppControls } from "@/components/kkcc/app-controls-provider";
import type { PublicKittuRewardControls } from "@/lib/app-controls.functions";
import {
  KITTU_EXAM_TRACKS,
  KITTU_PRACTICE_MODES,
  KITTU_SUBJECT_TOPICS,
  type KittuPracticeBatch,
  type KittuPracticeMode,
} from "@/lib/kittu-batch-catalog";
import { getBankItems, getSubjectBankItems } from "@/lib/quiz-question-bank";
import { getExamBankTopics, sampleQuestion as sampleExamBankQuestion } from "@/lib/exam-bank";
import {
  ADVANCED_BANK_DIFFICULTY,
  ADVANCED_SEARCH_PARAM,
  ADVANCED_SEARCH_VALUE,
  PRACTICE_BANK_DIFFICULTY,
} from "@/lib/question-routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CONVERSION_SENTENCE,
  KIT2_PER_23KAAT,
  MONTHLY_VOUCHER_THRESHOLD,
  REWARD_PER_QUESTION,
  KAAT_PER_MONTH_TARGET,
  DAILY_REWARD_CAP as CYCLE_DAILY_CAP,
  formatKit2AsRupees,
  kit2ToKaat,
  kit2ToNextKaat,
} from "@/lib/coin-conversion";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Kit 2 Coins — KKCC" },
      {
        name: "description",
        content:
          "Endless NEET, JEE, JEE Advanced and competitive-exam quiz with local Kit 2 Coins, 60-second timer, explanations and weekly vouchers.",
      },
      { property: "og:title", content: "Kit 2 Coins — KKCC" },
      {
        property: "og:description",
        content:
          "Practice NEET, JEE Main, JEE Advanced and general competitive-exam style questions with explanations.",
      },
    ],
  }),
  component: GamesPage,
});

type Subject =
  | "Polity"
  | "English Grammar"
  | "Hindi Grammar"
  | "Math"
  | "Math Class 9"
  | "Math Class 10"
  | "Science"
  | "Science Class 9"
  | "Science Class 10"
  | "Physics Class 9"
  | "Physics Class 10"
  | "Chemistry Class 9"
  | "Chemistry Class 10"
  | "Biology Class 9"
  | "Biology Class 10"
  | "SST Class 9"
  | "SST Class 10"
  | "SST"
  | "Punjab History"
  | "Punjab GK"
  | "Punjab Geography"
  | "Punjab Economics"
  | "Punjabi Paper A"
  | "Punjabi Paper B"
  | "Punjabi Grammar"
  | "Punjabi Literature"
  | "Hindi Literature"
  | "Physical Education"
  | "Art and Craft"
  | "Commerce"
  | "Law"
  | "Reasoning"
  | "Teaching Aptitude"
  | "Quantitative Aptitude"
  | "General Awareness"
  | "Banking Awareness"
  | "Computer Awareness"
  | "English Language"
  | "Biology"
  | "Chemistry"
  | "Physics"
  | "Mathematics"
  | "Accounting"
  | "Business Law"
  | "Business Economics"
  | "Cost Accounting"
  | "Taxation"
  | "Auditing and Ethics"
  | "Financial Management"
  | "Financial Reporting"
  | "Strategic Financial Management"
  | "Direct Tax Laws"
  | "Indirect Tax Laws"
  | "Advanced Auditing"
  | "CSAT"
  | "Ancient History"
  | "Medieval History"
  | "Modern History"
  | "Art and Culture"
  | "Physical Geography"
  | "Indian Geography"
  | "World Geography"
  | "Indian Economy"
  | "Environment and Ecology"
  | "General Science"
  | "Science and Technology";
type SubjectFilter = Subject | "Mixed";
type TopicFilter = string | "Mixed";
type PracticeMode = KittuPracticeMode;
type ExamTrack = string;

type QuizQuestion = {
  id: string;
  subject: Subject;
  topic: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  /** Exam tracks this question is high-yield for, shown as badges. */
  examTags?: string[];
};

type RawQuestion = Omit<QuizQuestion, "id" | "options" | "answerIndex"> & {
  id: string;
  options: string[];
  answer: string;
};

type LocalKittuTransaction = {
  id: string;
  amount: number;
  source: string;
  reason: string;
  created_at: string;
};

type VoucherCode = {
  code: string;
  created_at: string;
};

type LocalKittuState = {
  weekKey: string;
  balance: number;
  weekEarned: number;
  dailyClaimDate: string;
  dailyEarnDate: string;
  dailyEarned: number;
  vouchers: number;
  voucherCodes: VoucherCode[];
  transactions: LocalKittuTransaction[];
};

type KittuWallet = ReturnType<typeof useLocalKittuWallet>;

const LOCAL_KITTU_WALLET_KEY = "kkcc:kittu-quiz-quest:weekly:v1";
const LOCAL_KITTU_RECENT_KEY = "kkcc:kittu-quiz-quest:recent-questions:v1";
/** One 23KAAT coin is worth 1000 Kit 2 Coins, so that is the weekly target. */
/**
 * Ceiling on one monthly cycle.
 *
 * A completed daily task is 1,000 questions. Twenty-eight completed days
 * reach 100 23KAAT worth of Kit 2 Coins, which is the only point at which a
 * voucher can be raised. The cycle is the calendar month and the balance
 * resets to zero when it rolls over.
 *
 * Practice itself is never limited. Only the coins stop.
 */
const WEEKLY_REWARD_CAP = MONTHLY_VOUCHER_THRESHOLD;
const DEFAULT_DAILY_GIFT = 5;
const DEFAULT_DAILY_REWARD_CAP = CYCLE_DAILY_CAP;
const DEFAULT_DAILY_PRACTICE_HOURS = 8;
const QUESTION_TIME_SECONDS = 60;

const DEFAULT_KITTU_REWARDS: PublicKittuRewardControls = {
  dailyRewardCap: DEFAULT_DAILY_REWARD_CAP,
  dailyPracticeHours: DEFAULT_DAILY_PRACTICE_HOURS,
  dailyGift: DEFAULT_DAILY_GIFT,
  correctReward: REWARD_PER_QUESTION,
  wrongReward: REWARD_PER_QUESTION / 10,
};

const EXAM_TRACKS: ExamTrack[] = [...KITTU_EXAM_TRACKS];
const SUBJECTS: Subject[] = [
  "Polity",
  "English Grammar",
  "Hindi Grammar",
  "Math",
  "Math Class 9",
  "Math Class 10",
  "Science",
  "Science Class 9",
  "Science Class 10",
  "SST",
  "Punjab History",
  "Punjab GK",
  "Punjab Geography",
  "Punjab Economics",
  "Punjabi Paper A",
  "Punjabi Paper B",
  "Punjabi Grammar",
  "Punjabi Literature",
  "Hindi Literature",
  "Physical Education",
  "Art and Craft",
  "Commerce",
  "Law",
  "Reasoning",
  "Teaching Aptitude",
  "Quantitative Aptitude",
  "General Awareness",
  "Banking Awareness",
  "Computer Awareness",
  "English Language",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Accounting",
  "Business Law",
  "Business Economics",
  "Cost Accounting",
  "Taxation",
  "Auditing and Ethics",
  "Financial Management",
  "Financial Reporting",
  "Strategic Financial Management",
  "Direct Tax Laws",
  "Indirect Tax Laws",
  "Advanced Auditing",

  "Physics Class 9",
  "Physics Class 10",
  "Chemistry Class 9",
  "Chemistry Class 10",
  "Biology Class 9",
  "Biology Class 10",

  "SST Class 9",
  "SST Class 10",

  "CSAT",
  "Ancient History",
  "Medieval History",
  "Modern History",
  "Art and Culture",
  "Physical Geography",
  "Indian Geography",
  "World Geography",
  "Indian Economy",
  "Environment and Ecology",
  "General Science",
  "Science and Technology",
];
const SCHOOL_SUBJECTS: Subject[] = [
  "Science Class 9",
  "Science Class 10",
  "Math Class 9",
  "Math Class 10",
  "SST",
  "English Grammar",
  "Hindi Grammar",

  "Physics Class 9",
  "Physics Class 10",
  "Chemistry Class 9",
  "Chemistry Class 10",
  "Biology Class 9",
  "Biology Class 10",

  "SST Class 9",
  "SST Class 10",
];
const PUNJAB_SUBJECTS: Subject[] = [
  "Punjab History",
  "Punjab GK",
  "Punjab Geography",
  "Punjab Economics",
  "Punjabi Paper A",
  "Punjabi Paper B",
  "Punjabi Grammar",
  "Punjabi Literature",
  "Hindi Literature",
  "Physical Education",
  "Art and Craft",
  "Polity",
  "Math",
  "English Grammar",
  "Hindi Grammar",
];
const GOVT_SUBJECTS: Subject[] = [
  "Polity",
  "Math",
  "Reasoning",
  "English Grammar",
  "Hindi Grammar",
  "Science",
  "SST",
];

/** The General Studies syllabus shared by UPSC, the State PSCs and the defence exams. */
const GS_SUBJECTS: Subject[] = [
  "Polity",
  "Ancient History",
  "Medieval History",
  "Modern History",
  "Art and Culture",
  "Physical Geography",
  "Indian Geography",
  "World Geography",
  "Indian Economy",
  "Environment and Ecology",
  "General Science",
  "Science and Technology",
];

/** Sections that decide the Bank, Railway and SSC scorecard. */
const APTITUDE_SUBJECTS: Subject[] = [
  "Quantitative Aptitude",
  "Reasoning",
  "General Awareness",
  "English Language",
  "Computer Awareness",
];
const BANKING_SUBJECTS: Subject[] = [...APTITUDE_SUBJECTS, "Banking Awareness"];
const NEET_SUBJECTS: Subject[] = ["Biology", "Chemistry", "Physics"];
const JEE_SUBJECTS: Subject[] = ["Mathematics", "Physics", "Chemistry"];
const CA_SUBJECTS: Subject[] = [
  "Accounting",
  "Business Law",
  "Business Economics",
  "Cost Accounting",
  "Taxation",
  "Auditing and Ethics",
  "Financial Management",
  "Financial Reporting",
  "Strategic Financial Management",
  "Direct Tax Laws",
  "Indirect Tax Laws",
  "Advanced Auditing",
];

const TEACHING_EXAMS = new Set([
  "Punjab ETT Cadre",
  "PSTET/CTET",
  "Punjab Master Cadre",
  "Punjab Lecturer Cadre",
  "State Teacher/TET",
]);
const PUNJAB_EXAMS = new Set([
  "Punjab ETT Cadre",
  "PPSC Punjab",
  "Punjab PCS",
  "PSSSB",
  "Punjab Patwari",
  "Punjab Police",
  "Punjab Master Cadre",
  "Punjab Lecturer Cadre",
  "Punjab Clerk",
]);
const COMMERCE_EXAMS = new Set([
  "CA Foundation",
  "CA Intermediate",
  "CBSE Class 11-12 Commerce",
  "ISC Commerce",
]);
const SCHOOL_BOARD_EXAMS = new Set([
  "CBSE MCQ",
  "CBSE Class 9-10",
  "CBSE Class 11-12 Science",
  "CBSE Class 11-12 Commerce",
  "ICSE MCQ",
  "ICSE Class 9-10",
  "ISC Science",
  "ISC Commerce",
  "State Board MCQ",
  "PSEB Class 9-10",
]);
const GOVT_EXAMS = new Set([
  "UPSC/SSC/Bank",
  "UPSC CSE",
  "SSC",
  "Banking",
  "Railway",
  "NDA/CDS",
  "State PSC",
  "State Police",
  "State Patwari/Revenue",
  "State Clerk",
  "Other Competitive Exam",
]);

type PracticeTarget = {
  label: string;
  exam: ExamTrack;
  subject: SubjectFilter;
  topic: TopicFilter;
  mode: PracticeMode;
  hint: string;
};

const SUBJECT_META: Record<Subject, { icon: LucideIcon; glow: string }> = {
  Polity: { icon: Landmark, glow: "from-violet-500/20 to-cyan-400/10" },
  "English Grammar": { icon: BrainCircuit, glow: "from-sky-400/20 to-violet-500/10" },
  "Hindi Grammar": { icon: BrainCircuit, glow: "from-orange-300/20 to-pink-400/10" },
  Math: { icon: Calculator, glow: "from-amber-300/20 to-violet-500/10" },
  "Math Class 9": { icon: Calculator, glow: "from-amber-300/20 to-violet-500/10" },
  "Math Class 10": { icon: Calculator, glow: "from-amber-300/20 to-violet-500/10" },
  Science: { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Science Class 9": { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Physics Class 9": { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Physics Class 10": { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Chemistry Class 9": { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Chemistry Class 10": { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Biology Class 9": { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Biology Class 10": { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  "SST Class 9": { icon: Landmark, glow: "from-amber-400/20 to-orange-400/10" },
  "SST Class 10": { icon: Landmark, glow: "from-amber-400/20 to-orange-400/10" },

  "Science Class 10": { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  SST: { icon: Globe2, glow: "from-sky-400/20 to-emerald-400/10" },
  "Punjab History": { icon: Landmark, glow: "from-violet-500/20 to-amber-300/10" },
  "Punjab GK": { icon: Trophy, glow: "from-cyan-400/20 to-emerald-400/10" },
  "Punjab Geography": { icon: Globe2, glow: "from-sky-400/20 to-emerald-400/10" },
  "Punjab Economics": { icon: Target, glow: "from-amber-300/20 to-emerald-400/10" },
  "Punjabi Paper A": { icon: BrainCircuit, glow: "from-violet-500/20 to-pink-400/10" },
  "Punjabi Paper B": { icon: BrainCircuit, glow: "from-violet-500/20 to-pink-400/10" },
  "Punjabi Grammar": { icon: BrainCircuit, glow: "from-violet-500/20 to-pink-400/10" },
  "Punjabi Literature": { icon: BrainCircuit, glow: "from-violet-500/20 to-pink-400/10" },
  Commerce: { icon: Calculator, glow: "from-emerald-400/20 to-amber-300/10" },
  Law: { icon: Landmark, glow: "from-violet-500/20 to-cyan-400/10" },
  Reasoning: { icon: BrainCircuit, glow: "from-cyan-400/20 to-violet-500/10" },
  "Teaching Aptitude": { icon: Sparkles, glow: "from-primary/20 to-cyan-400/10" },
  "Quantitative Aptitude": { icon: Calculator, glow: "from-cyan-400/20 to-emerald-400/10" },
  "General Awareness": { icon: Globe2, glow: "from-amber-300/20 to-cyan-400/10" },
  "Banking Awareness": { icon: Landmark, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Computer Awareness": { icon: BrainCircuit, glow: "from-violet-500/20 to-cyan-400/10" },
  "English Language": { icon: Sparkles, glow: "from-pink-400/20 to-violet-500/10" },
  Biology: { icon: Sparkles, glow: "from-emerald-400/20 to-lime-300/10" },
  Chemistry: { icon: Target, glow: "from-amber-300/20 to-pink-400/10" },
  Physics: { icon: BrainCircuit, glow: "from-sky-400/20 to-violet-500/10" },
  Mathematics: { icon: Calculator, glow: "from-cyan-400/20 to-violet-500/10" },
  Accounting: { icon: Calculator, glow: "from-emerald-400/20 to-amber-300/10" },
  "Business Law": { icon: Landmark, glow: "from-violet-500/20 to-amber-300/10" },
  "Business Economics": { icon: Target, glow: "from-amber-300/20 to-emerald-400/10" },
  "Cost Accounting": { icon: Calculator, glow: "from-lime-300/20 to-cyan-400/10" },
  Taxation: { icon: Landmark, glow: "from-pink-400/20 to-amber-300/10" },

  CSAT: { icon: BrainCircuit, glow: "from-cyan-400/20 to-violet-500/10" },
  "Ancient History": { icon: Landmark, glow: "from-amber-300/20 to-orange-400/10" },
  "Medieval History": { icon: Landmark, glow: "from-orange-300/20 to-pink-400/10" },
  "Modern History": { icon: Landmark, glow: "from-violet-500/20 to-amber-300/10" },
  "Art and Culture": { icon: Sparkles, glow: "from-pink-400/20 to-amber-300/10" },
  "Hindi Literature": { icon: BrainCircuit, glow: "from-orange-300/20 to-amber-300/10" },
  "Physical Education": { icon: Trophy, glow: "from-emerald-400/20 to-amber-300/10" },
  "Art and Craft": { icon: Sparkles, glow: "from-pink-400/20 to-violet-500/10" },
  "Auditing and Ethics": { icon: ShieldCheck, glow: "from-sky-400/20 to-emerald-400/10" },
  "Financial Management": { icon: Calculator, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Financial Reporting": { icon: Calculator, glow: "from-cyan-400/20 to-violet-500/10" },
  "Strategic Financial Management": { icon: Target, glow: "from-violet-500/20 to-amber-300/10" },
  "Direct Tax Laws": { icon: Landmark, glow: "from-amber-300/20 to-orange-400/10" },
  "Indirect Tax Laws": { icon: Landmark, glow: "from-orange-300/20 to-pink-400/10" },
  "Advanced Auditing": { icon: ShieldCheck, glow: "from-emerald-400/20 to-sky-400/10" },
  "Physical Geography": { icon: Globe2, glow: "from-sky-400/20 to-cyan-400/10" },
  "Indian Geography": { icon: Globe2, glow: "from-emerald-400/20 to-sky-400/10" },
  "World Geography": { icon: Globe2, glow: "from-cyan-400/20 to-violet-500/10" },
  "Indian Economy": { icon: Target, glow: "from-amber-300/20 to-emerald-400/10" },
  "Environment and Ecology": { icon: Sparkles, glow: "from-emerald-400/20 to-lime-300/10" },
  "General Science": { icon: FlaskConical, glow: "from-emerald-400/20 to-cyan-400/10" },
  "Science and Technology": { icon: FlaskConical, glow: "from-sky-400/20 to-violet-500/10" },
};

const PRACTICE_MODES: PracticeMode[] = [...KITTU_PRACTICE_MODES];

const SUBJECT_TOPICS: Record<Subject, string[]> = KITTU_SUBJECT_TOPICS;

const EMPTY_LOCAL_KITTU_STATE: LocalKittuState = {
  weekKey: "",
  balance: 0,
  weekEarned: 0,
  dailyClaimDate: "",
  dailyEarnDate: "",
  dailyEarned: 0,
  vouchers: 0,
  voucherCodes: [],
  transactions: [],
};

const QUESTION_BANK: RawQuestion[] = [
  {
    id: "polity-1",
    subject: "Polity",
    topic: "Constitution",
    prompt:
      "Which part of the Indian Constitution contains the Directive Principles of State Policy?",
    options: ["Part II", "Part III", "Part IV", "Part V"],
    answer: "Part IV",
    explanation:
      "Directive Principles of State Policy are listed in Part IV, Articles 36 to 51. They guide law-making and governance but are not directly enforceable by courts.",
  },
  {
    id: "polity-2",
    subject: "Polity",
    topic: "Fundamental Rights",
    prompt:
      "Right to Constitutional Remedies is associated with which Article of the Indian Constitution?",
    options: ["Article 14", "Article 19", "Article 21", "Article 32"],
    answer: "Article 32",
    explanation:
      "Article 32 lets citizens directly approach the Supreme Court for enforcement of Fundamental Rights. Dr. B. R. Ambedkar called it the heart and soul of the Constitution.",
  },
  {
    id: "polity-3",
    subject: "Polity",
    topic: "Parliament",
    prompt: "Who presides over a joint sitting of both Houses of Parliament?",
    options: ["President", "Vice President", "Speaker of Lok Sabha", "Prime Minister"],
    answer: "Speaker of Lok Sabha",
    explanation:
      "A joint sitting is presided over by the Speaker of the Lok Sabha. In the Speaker's absence, the Deputy Speaker or other designated authority may preside.",
  },
  {
    id: "polity-4",
    subject: "Polity",
    topic: "President",
    prompt: "The President of India is elected by which method?",
    options: [
      "Direct public vote",
      "Proportional representation by single transferable vote",
      "Voice vote",
      "First-past-the-post",
    ],
    answer: "Proportional representation by single transferable vote",
    explanation:
      "The President is elected indirectly by an electoral college using proportional representation through the single transferable vote system.",
  },
  {
    id: "polity-5",
    subject: "Polity",
    topic: "Panchayati Raj",
    prompt:
      "Which Constitutional Amendment gave constitutional status to Panchayati Raj institutions?",
    options: ["42nd", "44th", "73rd", "86th"],
    answer: "73rd",
    explanation:
      "The 73rd Amendment Act, 1992 gave constitutional status to Panchayati Raj institutions and added Part IX to the Constitution.",
  },
  {
    id: "polity-6",
    subject: "Polity",
    topic: "Fundamental Duties",
    prompt: "Fundamental Duties were added to the Constitution by which Amendment?",
    options: ["24th", "42nd", "44th", "61st"],
    answer: "42nd",
    explanation:
      "Fundamental Duties were added by the 42nd Amendment Act, 1976, based on recommendations of the Swaran Singh Committee.",
  },
  {
    id: "science-1",
    subject: "Science",
    topic: "Biology",
    prompt: "Which organelle is known as the powerhouse of the cell?",
    options: ["Ribosome", "Mitochondria", "Golgi body", "Nucleus"],
    answer: "Mitochondria",
    explanation:
      "Mitochondria produce ATP during cellular respiration. ATP is the usable energy currency of the cell, so mitochondria are called the powerhouse.",
  },
  {
    id: "science-2",
    subject: "Science",
    topic: "Physics",
    prompt: "The SI unit of electric current is",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    answer: "Ampere",
    explanation:
      "Electric current is measured in ampere. Volt measures potential difference, ohm measures resistance, and watt measures power.",
  },
  {
    id: "science-3",
    subject: "Science",
    topic: "Chemistry",
    prompt: "Which gas is released when acids react with metal carbonates?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answer: "Carbon dioxide",
    explanation:
      "Acids react with metal carbonates to form salt, water and carbon dioxide gas. CO₂ turns lime water milky.",
  },
  {
    id: "science-4",
    subject: "Science",
    topic: "Biology",
    prompt: "The green pigment required for photosynthesis is",
    options: ["Haemoglobin", "Chlorophyll", "Melanin", "Insulin"],
    answer: "Chlorophyll",
    explanation:
      "Chlorophyll absorbs sunlight, mainly blue and red wavelengths, helping plants convert carbon dioxide and water into glucose.",
  },
  {
    id: "science-5",
    subject: "Science",
    topic: "Physics",
    prompt: "The image formed on the retina of the human eye is",
    options: ["Real and inverted", "Virtual and erect", "Virtual and inverted", "Real and erect"],
    answer: "Real and inverted",
    explanation:
      "The eye lens forms a real and inverted image on the retina. The brain interprets it as upright.",
  },
  {
    id: "science-6",
    subject: "Science",
    topic: "Chemistry",
    prompt: "The pH value of a neutral solution at 25°C is",
    options: ["0", "7", "10", "14"],
    answer: "7",
    explanation:
      "A neutral solution has equal hydrogen and hydroxide ion concentration. At 25°C, its pH is 7.",
  },
  {
    id: "sst-1",
    subject: "SST",
    topic: "Geography",
    prompt: "Which latitude is also known as the Tropic of Cancer?",
    options: ["23½° N", "23½° S", "66½° N", "0°"],
    answer: "23½° N",
    explanation:
      "The Tropic of Cancer lies at about 23.5° North latitude. It passes through India and marks the northern limit of the overhead Sun.",
  },
  {
    id: "sst-2",
    subject: "SST",
    topic: "History",
    prompt: "Who founded the Mauryan Empire?",
    options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Harsha"],
    answer: "Chandragupta Maurya",
    explanation:
      "Chandragupta Maurya founded the Mauryan Empire with guidance from Chanakya/Kautilya after defeating the Nanda dynasty.",
  },
  {
    id: "sst-3",
    subject: "SST",
    topic: "Economics",
    prompt: "GDP stands for",
    options: [
      "Gross Domestic Product",
      "General Domestic Price",
      "Gross Demand Product",
      "General Development Plan",
    ],
    answer: "Gross Domestic Product",
    explanation:
      "Gross Domestic Product measures the value of final goods and services produced within a country's domestic territory during a period.",
  },
  {
    id: "sst-4",
    subject: "SST",
    topic: "Geography",
    prompt: "Which soil is best known for cotton cultivation in India?",
    options: ["Alluvial soil", "Black soil", "Laterite soil", "Desert soil"],
    answer: "Black soil",
    explanation:
      "Black soil, also called regur soil, retains moisture well and is suitable for cotton cultivation, especially in the Deccan region.",
  },
  {
    id: "sst-5",
    subject: "SST",
    topic: "History",
    prompt: "The Dandi March was associated with protest against which tax?",
    options: ["Land tax", "Salt tax", "Income tax", "Trade tax"],
    answer: "Salt tax",
    explanation:
      "Mahatma Gandhi led the Dandi March in 1930 to protest against the British monopoly and tax on salt.",
  },
  {
    id: "sst-6",
    subject: "SST",
    topic: "Geography",
    prompt: "The imaginary line that divides Earth into Northern and Southern Hemispheres is",
    options: ["Prime Meridian", "Equator", "Tropic of Capricorn", "Arctic Circle"],
    answer: "Equator",
    explanation:
      "The Equator is at 0° latitude and divides Earth into the Northern and Southern Hemispheres.",
  },
];

function GamesPage() {
  const controls = useAppControls();

  return (
    <SiteLayout>
      {controls.kittuQuizEnabled ? (
        <GamesContent rewards={controls.kittuRewards} batches={controls.kittuPracticeBatches} />
      ) : (
        <FeatureUnavailable
          title="Kit 2 Coins Quiz is temporarily paused"
          description="The quiz zone is currently being refreshed by the KKCC team. Please check back shortly."
          actionTo="/courses"
          actionLabel="Open courses"
        />
      )}
    </SiteLayout>
  );
}

function GamesContent({
  rewards,
  batches,
}: {
  rewards: PublicKittuRewardControls;
  batches: KittuPracticeBatch[];
}) {
  const wallet = useLocalKittuWallet(rewards);
  const [launch, setLaunch] = useState<PracticeTarget | null>(null);

  return (
    <>
      {/* What the month is worth, before anything else on the page. */}
      <RewardVouchers wallet={wallet} />

      <GameHero wallet={wallet} />

      {/* Pick the paper the way a textbook app does: exam, then subject, then
          chapter, then the kind of question set. Nobody should have to scroll
          to find the quiz. */}
      <QuizLauncher onStart={setLaunch} />

      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        {/* Only the quiz. Everything that used to sit around it — the wallet,
            the ledger, the rules and the in-quiz selector — has been removed,
            because choosing above should be the whole journey. */}
        <EndlessQuizQuest
          onReward={wallet.addQuizReward}
          rewards={rewards}
          batches={batches}
          launch={launch}
        />
      </section>
    </>
  );
}

/** The four steps a student walks, exactly like a textbook app. */
const LAUNCH_STEPS = ["Exam", "Subject", "Chapter", "Question set"] as const;

type QuestionSet = "Chapterwise" | "Subjectwise" | "Combined" | "Unlimited";

const QUESTION_SETS: { id: QuestionSet; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "Chapterwise", label: "Chapterwise", hint: "Only the chapter you picked", icon: BookOpen },
  { id: "Subjectwise", label: "Subjectwise", hint: "Every chapter of the subject", icon: Layers },
  { id: "Combined", label: "Combined", hint: "All subjects, like the real paper", icon: Shuffle },
  { id: "Unlimited", label: "Unlimited", hint: "Endless mixed practice", icon: InfinityIcon },
];

const MODE_HINTS: Record<PracticeMode, string> = {
  "NCERT-based": "Straight from the textbook",
  "Exam-pattern": "Shaped like past papers",
  "High-yield": "The ones that repeat most",
};

/**
 * A two-pane wizard. The left rail always shows all four steps and what has
 * been chosen so far; the right pane shows only the step you are on. Fixed
 * height, so nothing jumps as you move between steps. Stacks on a phone.
 */
/**
 * The three rewards, at the very top of the page so a student sees what the
 * month is worth before they start.
 *
 * Availability is real: the gift vouchers carry a daily quota shared across
 * everyone, counted on the server and reset at 1 AM. When the day's are
 * gone the card says so and says when they return, rather than failing in
 * some vague way.
 */
function RewardVouchers({ wallet }: { wallet: KittuWallet }) {
  const qc = useQueryClient();
  const listVouchers = useServerFn(listRewardVouchers);
  const claim = useServerFn(claimRewardVoucher);

  const vouchersQuery = useQuery({
    queryKey: ["quiz", "reward-vouchers"],
    queryFn: () => safeServerCall(() => listVouchers({} as never), [] as VoucherOffer[]),
    staleTime: 60_000,
  });

  const claimMutation = useMutation({
    mutationFn: (voucher_type: string) =>
      claim({ data: { voucher_type, earned_kit2: wallet.weekEarned } } as never),
    onSuccess: (r) => {
      toast.success("Claim raised", {
        description: `Show code ${r.code} at the centre to collect your voucher.`,
      });
      void qc.invalidateQueries({ queryKey: ["quiz", "reward-vouchers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const offers = vouchersQuery.data ?? [];
  if (offers.length === 0) return null;

  const targetDone = wallet.weekEarned >= MONTHLY_VOUCHER_THRESHOLD;

  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-black">Rewards you can win this month</h2>
          <p className="text-xs text-muted-foreground">
            {targetDone
              ? "Target complete — pick a reward below."
              : `${Math.round((wallet.weekEarned / MONTHLY_VOUCHER_THRESHOLD) * 100)}% of the way there`}
          </p>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {offers.map((v) => {
            // A quota of zero means the voucher is not on offer at all, not
            // that today's stock ran out. Promising it returns at 1 AM would
            // be a lie, so the card is simply not shown.
            if (v.daily_quota === 0) return null;
            const soldOut = v.daily_quota !== null && v.remaining_today <= 0;
            const claimed = v.my_status === "pending" || v.my_status === "fulfilled";
            return (
              <div key={v.id} className="surface-panel flex flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Gift className="h-5 w-5" />
                  </span>
                  <span className="text-lg font-black">&#8377;{v.value_inr}</span>
                </div>
                <p className="mt-3 text-sm font-bold">{v.label}</p>

                {v.daily_quota !== null ? (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {soldOut
                      ? `All ${v.daily_quota} of today's vouchers are claimed. More at 1 AM.`
                      : `${v.remaining_today} of ${v.daily_quota} left today`}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">Always available</p>
                )}

                <Button
                  className="mt-3 w-full rounded-full"
                  size="sm"
                  variant={targetDone && !soldOut && !claimed ? "default" : "outline"}
                  disabled={!targetDone || soldOut || claimed || claimMutation.isPending}
                  onClick={() => claimMutation.mutate(v.id)}
                >
                  {claimed
                    ? v.my_status === "fulfilled"
                      ? "Collected"
                      : "Claim raised"
                    : soldOut
                      ? "Back at 1 AM"
                      : targetDone
                        ? "Claim"
                        : "Finish the target"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function QuizLauncher({ onStart }: { onStart: (target: PracticeTarget) => void }) {
  const [step, setStep] = useState(0);
  const [exam, setExam] = useState<ExamTrack | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);
  const [set, setSet] = useState<QuestionSet | null>(null);
  const [mode, setMode] = useState<PracticeMode>("NCERT-based");
  const [query, setQuery] = useState("");

  const subjects = useMemo(() => (exam ? getSubjectsForExam(exam) : []), [exam]);
  const chapters = useMemo(
    () => (exam && subject ? getTopicsForSubject(exam, subject) : []),
    [exam, subject],
  );
  const options = useMemo<readonly string[]>(
    () => (step === 0 ? EXAM_TRACKS : step === 1 ? subjects : step === 2 ? chapters : []),
    [step, subjects, chapters],
  );
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options;
    return options.filter((item) => item.toLowerCase().includes(term));
  }, [options, query]);

  const values: (string | null)[] = [
    exam,
    subject,
    chapter ?? (set && set !== "Chapterwise" ? "Whole subject" : null),
    set,
  ];
  const placeholders = ["Choose an exam", "Choose a subject", "Choose or skip", "Choose a set"];

  function go(next: number) {
    setStep(next);
    setQuery("");
  }

  function pick(value: string) {
    if (step === 0) {
      setExam(value as ExamTrack);
      setSubject(null);
      setChapter(null);
      setSet(null);
    } else if (step === 1) {
      setSubject(value as Subject);
      setChapter(null);
      setSet(null);
    } else {
      setChapter(value);
      setSet("Chapterwise");
    }
    go(step + 1);
  }

  function start() {
    if (!exam || !set) return;
    const wide = set === "Combined" || set === "Unlimited";
    if (wide) {
      onStart({
        exam,
        subject: "Mixed",
        topic: "Mixed",
        mode,
        label: `${exam} — ${set}`,
        hint: set === "Unlimited" ? "Endless mixed practice" : "All subjects of this exam",
      });
      return;
    }
    if (!subject) return;
    onStart({
      exam,
      subject,
      topic: set === "Chapterwise" && chapter ? chapter : "Mixed",
      mode,
      label: set === "Chapterwise" && chapter ? chapter : `${subject} — all chapters`,
      hint: `${exam} · ${set}`,
    });
  }

  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-lg font-black leading-tight sm:text-xl">Start a quiz</h2>
              <p className="text-xs text-muted-foreground">
                Exam, subject, chapter, then how you want to practise.
              </p>
            </div>
          </div>
          {set ? (
            <Button onClick={start} className="font-bold">
              <Sparkles className="mr-1.5 h-4 w-4" /> Start quiz
            </Button>
          ) : null}
        </div>

        <div className="surface-panel overflow-hidden p-0">
          <div className="grid md:grid-cols-[15rem_minmax(0,1fr)]">
            {/* Left rail — all four steps, always visible. */}
            <ol className="flex gap-1 overflow-x-auto border-b p-2 md:block md:space-y-1 md:overflow-visible md:border-b-0 md:border-r md:p-3">
              {LAUNCH_STEPS.map((label, index) => {
                const active = step === index;
                const done = values[index] != null;
                const reachable = index <= step || done;
                return (
                  <li key={label} className="shrink-0 md:shrink">
                    <button
                      type="button"
                      disabled={!reachable}
                      onClick={() => go(index)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        active ? "bg-primary/10 ring-1 ring-primary/40" : "hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          done
                            ? "bg-primary text-primary-foreground"
                            : active
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          {label}
                        </span>
                        <span
                          className={`block truncate text-xs font-semibold ${
                            done ? "" : "text-muted-foreground/70"
                          }`}
                        >
                          {values[index] ?? placeholders[index]}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Right pane — the current step only, at a fixed height. */}
            <div className="flex h-[22rem] flex-col p-3 sm:p-4">
              {step < 3 ? (
                <>
                  <div className="mb-3 flex items-center gap-2">
                    {options.length > 10 ? (
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder={`Search ${(LAUNCH_STEPS[step] ?? "option").toLowerCase()}`}
                          className="w-full rounded-lg border bg-background py-2 pl-8 pr-3 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    ) : (
                      <p className="flex-1 text-sm font-semibold">
                        {step === 1 ? `Subjects in ${exam}` : `Chapters in ${subject}`}
                      </p>
                    )}
                    {step === 2 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setChapter(null);
                          setSet("Subjectwise");
                          go(3);
                        }}
                      >
                        Skip chapter
                      </Button>
                    ) : null}
                  </div>

                  <div className="grid flex-1 content-start gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.length === 0 ? (
                      <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
                        Nothing matches “{query}”.
                      </p>
                    ) : (
                      filtered.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => pick(item)}
                          className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition hover:border-primary hover:bg-primary/5 ${
                            values[step] === item ? "border-primary bg-primary/10" : "bg-background"
                          }`}
                        >
                          {item}
                        </button>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col overflow-y-auto pr-1">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {QUESTION_SETS.map((item) => {
                      const disabled =
                        item.id === "Chapterwise"
                          ? !chapter
                          : item.id === "Subjectwise"
                            ? !subject
                            : false;
                      const Icon = item.icon;
                      const picked = set === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => setSet(item.id)}
                          className={`flex items-center gap-2.5 rounded-lg border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                            picked
                              ? "border-primary bg-primary/10"
                              : "bg-background hover:border-primary/50"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                              picked
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-bold">{item.label}</span>
                            <span className="block truncate text-[11px] text-muted-foreground">
                              {item.hint}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Question style
                  </p>
                  <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                    {PRACTICE_MODES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setMode(item)}
                        className={`rounded-lg border px-3 py-2 text-left transition ${
                          mode === item
                            ? "border-primary bg-primary/10"
                            : "bg-background hover:border-primary/50"
                        }`}
                      >
                        <span className="block text-xs font-bold">{item}</span>
                        <span className="block text-[10px] text-muted-foreground">
                          {MODE_HINTS[item]}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto pt-4">
                    <Button onClick={start} disabled={!set} className="w-full font-black">
                      <Sparkles className="mr-1.5 h-4 w-4" /> Start quiz
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function useLocalKittuWallet(rewards: PublicKittuRewardControls = DEFAULT_KITTU_REWARDS) {
  const week = useMemo(() => getKittuWeek(), []);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<LocalKittuState>({
    ...EMPTY_LOCAL_KITTU_STATE,
    weekKey: week.key,
  });

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCAL_KITTU_WALLET_KEY);
      if (saved) setState(normalizeLocalKittuState(JSON.parse(saved), week.key, week.todayKey));
    } catch {
      setState({ ...EMPTY_LOCAL_KITTU_STATE, weekKey: week.key });
    } finally {
      setReady(true);
    }
  }, [week.key, week.todayKey]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(LOCAL_KITTU_WALLET_KEY, JSON.stringify(state));
  }, [ready, state]);

  const addCoins = (amount: number, source: string, reason: string) => {
    const safeAmount = roundKittu(amount);
    if (safeAmount <= 0) return;
    setState((current) => {
      const weeklyState =
        current.weekKey === week.key ? current : resetForNewWeek(current, week.key);
      const dailyState = resetDailyIfNeeded(weeklyState, week.todayKey);
      // Whichever ceiling bites first, the day's or the week's.
      const dailyRoom = roundKittu(Math.max(0, rewards.dailyRewardCap - dailyState.dailyEarned));
      const weeklyRoom = roundKittu(Math.max(0, WEEKLY_REWARD_CAP - dailyState.weekEarned));
      const room = Math.min(dailyRoom, weeklyRoom);
      const awarded = roundKittu(Math.min(room, safeAmount));
      if (awarded <= 0) {
        toast.info(
          weeklyRoom <= 0 ? "This month's target is complete" : "Today's daily task is complete",
          {
            description:
              weeklyRoom <= 0
                ? "Keep practising — questions never stop. A new cycle starts next month."
                : "Keep practising — questions never stop. Rewards resume tomorrow.",
          },
        );
        return dailyState;
      }
      const tx: LocalKittuTransaction = {
        id: createLocalId(),
        amount: awarded,
        source,
        reason,
        created_at: new Date().toISOString(),
      };
      return {
        ...dailyState,
        balance: roundKittu(dailyState.balance + awarded),
        weekEarned: roundKittu(dailyState.weekEarned + awarded),
        dailyEarned: roundKittu(dailyState.dailyEarned + awarded),
        transactions: [tx, ...dailyState.transactions].slice(0, 30),
      };
    });
  };

  const claimDaily = () => {
    if (state.dailyClaimDate === week.todayKey) {
      toast.info("Daily Kit 2 Coins already claimed", {
        description: "Come back tomorrow for another small boost.",
      });
      return;
    }
    const todayEarned = state.dailyEarnDate === week.todayKey ? state.dailyEarned : 0;
    if (todayEarned >= rewards.dailyRewardCap) {
      toast.info("Today's daily task is complete", {
        description:
          "Rewards unlock again tomorrow. Practice never stops — keep going for the learning.",
      });
      return;
    }

    setState((current) => {
      const weeklyState =
        current.weekKey === week.key ? current : resetForNewWeek(current, week.key);
      const dailyState = resetDailyIfNeeded(weeklyState, week.todayKey);
      const dailyRoom = roundKittu(Math.max(0, rewards.dailyRewardCap - dailyState.dailyEarned));
      const weeklyRoom = roundKittu(Math.max(0, WEEKLY_REWARD_CAP - dailyState.weekEarned));
      const room = Math.min(dailyRoom, weeklyRoom);
      const awarded = roundKittu(Math.min(rewards.dailyGift, room));
      const tx: LocalKittuTransaction = {
        id: createLocalId(),
        amount: awarded,
        source: "daily_quiz_bonus",
        reason: "Daily quiz Kit 2 Coins",
        created_at: new Date().toISOString(),
      };
      return {
        ...dailyState,
        balance: roundKittu(dailyState.balance + awarded),
        weekEarned: roundKittu(dailyState.weekEarned + awarded),
        dailyEarned: roundKittu(dailyState.dailyEarned + awarded),
        dailyClaimDate: week.todayKey,
        transactions: [tx, ...dailyState.transactions].slice(0, 30),
      };
    });
    toast.success("Daily Kit 2 Coins bonus claimed", {
      description: "Stored only on this device and counted inside today's task.",
    });
  };

  const addQuizReward = (coins: number, detail: string) => {
    addCoins(coins, "local_quiz_reward", detail);
  };

  const dailyEarned = state.dailyEarnDate === week.todayKey ? state.dailyEarned : 0;

  return {
    balance: state.balance,
    weekEarned: state.weekEarned,
    dailyEarned,
    dailyRemaining: roundKittu(Math.max(0, rewards.dailyRewardCap - dailyEarned)),
    vouchers: state.vouchers,
    latestVoucherCode: state.voucherCodes[0]?.code ?? "",
    kaatValue: kit2ToKaat(state.balance),
    rupeeValue: formatKit2AsRupees(state.balance),
    coinsToNextKaat: kit2ToNextKaat(state.balance),
    dailyClaimed: state.dailyClaimDate === week.todayKey,
    // Progress against what the cycle can actually yield.
    progressPercent: Math.min(100, Math.round((state.weekEarned / WEEKLY_REWARD_CAP) * 100)),
    transactions: state.transactions,
    weekLabel: week.label,
    weekEndsLabel: week.endsLabel,
    claimDaily,
    addQuizReward,
  };
}

function scrollToQuizPlayground() {
  if (typeof document === "undefined") return;
  document
    .getElementById("quiz-playground")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function GameHero({ wallet }: { wallet: KittuWallet }) {
  return (
    <section className="border-b bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_10%,var(--background)),color-mix(in_oklab,var(--accent)_6%,var(--background)))]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:py-20">
        <div>
          <Badge variant="secondary" className="rounded-full">
            <BrainCircuit className="mr-1.5 h-3.5 w-3.5 text-primary" /> Answer and win
          </Badge>
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Answer questions. <span className="text-primary">Win rewards.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every answer earns Kit 2 Coins. Finish the month&rsquo;s target and claim a{" "}
            <span className="font-bold text-foreground">
              &#8377;{KAAT_PER_MONTH_TARGET} Amazon or Flipkart gift voucher
            </span>{" "}
            from the centre. Keep practising daily and the target looks after itself.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button className="rounded-full" onClick={scrollToQuizPlayground}>
              <Zap className="mr-2 h-4 w-4" /> Start quiz now
            </Button>
            <Button
              className="rounded-full"
              variant="secondary"
              disabled={wallet.dailyClaimed}
              onClick={wallet.claimDaily}
            >
              <KittuCoin size="sm" /> {wallet.dailyClaimed ? "Daily 5 claimed" : "Claim daily 5"}
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {[
              "60-second MCQ",
              "Instant explanation",
              "Exam-wise batches",
              "Daily task, daily reward",
              `\u20B9${KAAT_PER_MONTH_TARGET} voucher on target`,
            ].map((label) => (
              <span key={label} className="rounded-full border bg-background px-3 py-1.5">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/*
          One clean coin card. The weekly goal and daily-remaining tiles live in
          the wallet panel further down, so they are not repeated here.
        */}
        <div className="surface-panel relative overflow-hidden p-7">
          <div className="absolute -right-8 -top-8 opacity-60">
            <KittuCoinStack />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
            This month’s Kit 2 Coins
          </p>
          <p className="mt-3 flex items-center gap-3 text-6xl font-black leading-none text-primary">
            <KittuCoin size="lg" /> {formatKittu(wallet.balance)}
          </p>
          <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${wallet.progressPercent}%` }}
            />
          </div>
          <p className="mt-2.5 flex items-center justify-between text-xs font-bold">
            <span className="text-muted-foreground">
              {wallet.progressPercent}% of {KIT2_PER_23KAAT.toLocaleString("en-IN")}
            </span>
            <span className="text-primary">{formatKittu(wallet.dailyRemaining)} left today</span>
          </p>
          {/* What the balance is worth, using the one shared rate. */}
          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border bg-muted/40 px-4 py-3">
            <span className="min-w-0">
              <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                Worth
              </span>
              <span className="mt-0.5 flex items-baseline gap-1.5 text-lg font-black">
                {wallet.kaatValue} 23KAAT
                <span className="text-sm font-bold text-muted-foreground">
                  ({wallet.rupeeValue})
                </span>
              </span>
            </span>
            {wallet.coinsToNextKaat > 0 && (
              <span className="shrink-0 text-right text-[11px] font-bold leading-tight text-muted-foreground">
                {formatKittu(wallet.coinsToNextKaat)} more
                <br />
                for the next one
              </span>
            )}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {CONVERSION_SENTENCE} · {wallet.weekLabel} · resets to zero after {wallet.weekEndsLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

function EndlessQuizQuest({
  onReward,
  rewards = DEFAULT_KITTU_REWARDS,
  batches = [],
  launch = null,
}: {
  onReward: (coins: number, detail: string) => void;
  rewards?: PublicKittuRewardControls;
  batches?: KittuPracticeBatch[];
  /** Selection handed down by the launcher above the fold. */
  launch?: PracticeTarget | null;
}) {
  const [exam, setExam] = useState<ExamTrack>("All Exams");
  const [subject, setSubject] = useState<SubjectFilter>("Mixed");
  const [topic, setTopic] = useState<TopicFilter>("Mixed");
  const [mode, setMode] = useState<PracticeMode>("NCERT-based");
  const [practiceQuery, setPracticeQuery] = useState("");
  const [levelStep, setLevelStep] = useState(0);
  const [initialQuestion] = useState(() =>
    generateQuestion("Mixed", "All Exams", "Mixed", "NCERT-based"),
  );
  const [question, setQuestion] = useState<QuizQuestion>(initialQuestion);
  const [questionHistory, setQuestionHistory] = useState<QuizQuestion[]>(() => [initialQuestion]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [recentSignatures, setRecentSignatures] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_TIME_SECONDS);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const listSeriesAccess = useServerFn(listMySeriesAccess);
  const [advancedAccessChecked, setAdvancedAccessChecked] = useState(false);
  const [advancedAccessAllowed, setAdvancedAccessAllowed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedAdvanced = params.get(ADVANCED_SEARCH_PARAM) === ADVANCED_SEARCH_VALUE;
    if (!requestedAdvanced) {
      setAdvancedAccessChecked(true);
      setAdvancedAccessAllowed(true);
      return;
    }

    let active = true;
    void safeServerCall(() => listSeriesAccess(), [])
      .then((grants) => {
        if (!active) return;
        const now = Date.now();
        const live = new Set(
          (grants ?? [])
            .filter((grant) => !grant.expires_at || new Date(grant.expires_at).getTime() > now)
            .map((grant) => grant.series_id),
        );
        const allowed = PAID_TEST_SERIES.some(
          (series) => live.has(series.id) && series.examTrack === (params.get("exam") ?? ""),
        );
        setAdvancedAccessAllowed(allowed);
        setAdvancedAccessChecked(true);
      })
      .catch(() => {
        if (active) {
          setAdvancedAccessAllowed(false);
          setAdvancedAccessChecked(true);
        }
      });

    return () => {
      active = false;
    };
  }, [listSeriesAccess]);

  const availableTopics = useMemo(() => getTopicsForSubject(exam, subject), [exam, subject]);
  const examChoices = useMemo(() => getExamsForSubject(subject), [subject]);
  const customPracticeTargets = useMemo(
    () =>
      batches
        .filter((batch) => batch.enabled)
        .map((batch) => practiceTargetFromBatch(batch))
        .filter((target): target is PracticeTarget => Boolean(target)),
    [batches],
  );
  const practiceSearchResults = useMemo(
    () => searchPracticeTargets(practiceQuery, customPracticeTargets),
    [practiceQuery, customPracticeTargets],
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCAL_KITTU_RECENT_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        setRecentSignatures(parsed.filter((item) => typeof item === "string").slice(0, 200));
      }
    } catch {
      setRecentSignatures([]);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedExam = params.get("exam");
    const requestedSubject = params.get("subject");
    const requestedTopic = params.get("topic");
    const requestedMode = params.get("mode");
    setAdvancedOnly(params.get(ADVANCED_SEARCH_PARAM) === ADVANCED_SEARCH_VALUE);

    const nextExam = requestedExam && EXAM_TRACKS.includes(requestedExam) ? requestedExam : exam;
    const subjects = getSubjectsForExam(nextExam);
    const nextSubject: SubjectFilter =
      requestedSubject && subjects.includes(requestedSubject as Subject)
        ? (requestedSubject as Subject)
        : subject;
    const topics = getTopicsForSubject(nextExam, nextSubject);
    const nextTopic = requestedTopic && topics.includes(requestedTopic) ? requestedTopic : "Mixed";
    const nextMode = PRACTICE_MODES.includes(requestedMode as PracticeMode)
      ? (requestedMode as PracticeMode)
      : mode;

    if (nextExam !== exam || nextSubject !== subject || nextTopic !== topic || nextMode !== mode) {
      const generated = generateQuestionWithAntiRepeat(
        nextSubject,
        nextExam,
        nextTopic,
        nextMode,
        recentSignatures,
      );
      setExam(nextExam);
      setSubject(nextSubject);
      setTopic(nextTopic);
      setMode(nextMode);
      setQuestion(generated);
      setQuestionHistory([generated]);
      setHistoryIndex(0);
      rememberQuestion(generated);
    }
    // This URL bootstrap must run once with the originally loaded defaults.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        LOCAL_KITTU_RECENT_KEY,
        JSON.stringify(recentSignatures.slice(0, 200)),
      );
    } catch {
      // Local storage may be unavailable in private mode; quiz still works.
    }
  }, [recentSignatures]);

  function rememberQuestion(nextQuestionItem: QuizQuestion) {
    const signature = questionSignature(nextQuestionItem);
    setRecentSignatures((current) =>
      [signature, ...current.filter((item) => item !== signature)].slice(0, 200),
    );
  }

  function resetAnswerState() {
    setSelected(null);
    setAnswered(false);
    setTimedOut(false);
    setSecondsLeft(QUESTION_TIME_SECONDS);
  }

  function pushQuestionToHistory(generated: QuizQuestion) {
    setQuestionHistory((current) => {
      const base = current.slice(0, historyIndex + 1);
      const next = [...base, generated].slice(-80);
      setHistoryIndex(next.length - 1);
      return next;
    });
  }

  function nextQuestion(
    nextSubject: SubjectFilter = subject,
    nextExam: ExamTrack = exam,
    nextTopic: TopicFilter = topic,
    nextMode: PracticeMode = mode,
  ) {
    const sameTrack =
      nextSubject === subject && nextExam === exam && nextTopic === topic && nextMode === mode;
    if (sameTrack && historyIndex < questionHistory.length - 1) {
      const nextIndex = historyIndex + 1;
      const savedNext = questionHistory[nextIndex];
      if (savedNext) {
        setHistoryIndex(nextIndex);
        setQuestion(savedNext);
        resetAnswerState();
        return;
      }
    }
    const safeSubject =
      nextSubject !== "Mixed" && !getSubjectsForExam(nextExam).includes(nextSubject)
        ? "Mixed"
        : nextSubject;
    const topics = getTopicsForSubject(nextExam, safeSubject);
    const safeTopic = nextTopic !== "Mixed" && !topics.includes(nextTopic) ? "Mixed" : nextTopic;
    // A new subject/exam/chapter restarts the ladder at Easy; continuing the
    // same track walks it forward one question at a time.
    const step = sameTrack ? levelStep + 1 : 0;
    setLevelStep(step);
    setLadderLevel(levelForIndex(step));
    const generated = generateQuestionWithAntiRepeat(
      safeSubject,
      nextExam,
      safeTopic,
      nextMode,
      recentSignatures,
    );
    setQuestion(generated);
    pushQuestionToHistory(generated);
    rememberQuestion(generated);
    resetAnswerState();
  }

  function showPreviousQuestion() {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    const previous = questionHistory[nextIndex];
    if (!previous) return;
    setHistoryIndex(nextIndex);
    setQuestion(previous);
    resetAnswerState();
  }

  function changeExam(nextExam: ExamTrack) {
    const nextSubject =
      subject !== "Mixed" && !getSubjectsForExam(nextExam).includes(subject) ? "Mixed" : subject;
    const topics = getTopicsForSubject(nextExam, nextSubject);
    const nextTopic = topic !== "Mixed" && !topics.includes(topic) ? "Mixed" : topic;
    setExam(nextExam);
    setSubject(nextSubject);
    setTopic(nextTopic);
    nextQuestion(nextSubject, nextExam, nextTopic, mode);
  }

  /**
   * Step 1 of the guided flow. The subject is chosen first, so if the current
   * exam does not offer it we fall back to All Exams rather than silently
   * serving another subject.
   */
  function chooseSubject(nextSubject: SubjectFilter) {
    const nextExam =
      nextSubject !== "Mixed" && !getSubjectsForExam(exam).includes(nextSubject)
        ? "All Exams"
        : exam;
    const topics = getTopicsForSubject(nextExam, nextSubject);
    const nextTopic = topic !== "Mixed" && !topics.includes(topic) ? "Mixed" : topic;
    setSubject(nextSubject);
    setExam(nextExam);
    setTopic(nextTopic);
    nextQuestion(nextSubject, nextExam, nextTopic, mode);
  }

  function changeTopic(nextTopic: TopicFilter) {
    setTopic(nextTopic);
    nextQuestion(subject, exam, nextTopic, mode);
  }

  function changeMode(nextMode: PracticeMode) {
    setMode(nextMode);
    nextQuestion(subject, exam, topic, nextMode);
  }

  // The launcher sits above the fold and hands its selection down here.
  useEffect(() => {
    if (!launch) return;
    setExam(launch.exam);
    setSubject(launch.subject);
    setTopic(launch.topic);
    setMode(launch.mode);
    setLevelStep(0);
    nextQuestion(launch.subject, launch.exam, launch.topic, launch.mode);
    scrollToQuizPlayground();
    // nextQuestion is stable enough for this one-shot apply.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launch]);

  function applyPracticeTarget(target: PracticeTarget) {
    setExam(target.exam);
    setSubject(target.subject);
    setTopic(target.topic);
    setMode(target.mode);
    setPracticeQuery("");
    nextQuestion(target.subject, target.exam, target.topic, target.mode);
  }

  const finishAttempt = useCallback(
    (index: number | null, timeout = false) => {
      if (answered) return;
      const correct = index !== null && index === question.answerIndex;
      const coins = timeout ? 0 : correct ? rewards.correctReward : rewards.wrongReward;
      const nextStreak = correct ? streak + 1 : 0;

      setSelected(index);
      setAnswered(true);
      setTimedOut(timeout);
      setTotalCount((current) => current + 1);
      setCorrectCount((current) => current + (correct ? 1 : 0));
      setStreak(nextStreak);

      if (coins > 0) {
        onReward(
          coins,
          `${exam} ${question.subject} quiz ${correct ? "correct" : "wrong but reviewed"}: ${question.topic}`,
        );
      }
    },
    [
      answered,
      exam,
      onReward,
      question.answerIndex,
      question.subject,
      question.topic,
      rewards.correctReward,
      rewards.wrongReward,
      streak,
    ],
  );

  useEffect(() => {
    if (answered) return;
    if (secondsLeft <= 0) {
      finishAttempt(null, true);
      return;
    }
    const timerId = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearTimeout(timerId);
  }, [answered, finishAttempt, secondsLeft]);

  const advancedRequested =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get(ADVANCED_SEARCH_PARAM) ===
      ADVANCED_SEARCH_VALUE;

  if (advancedRequested && !advancedAccessChecked) {
    return (
      <div className="surface-panel p-8 text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
        <p className="mt-3 text-sm font-semibold">Checking your series access…</p>
      </div>
    );
  }

  if (advancedRequested && !advancedAccessAllowed) {
    return (
      <div className="surface-panel p-8 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-3 text-lg font-black">Advanced test access required</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          This unlimited advanced paper is available only to students with a live enrolment in the
          corresponding test series.
        </p>
        <Button asChild className="mt-5 rounded-full">
          <Link to="/test-series">Open test series</Link>
        </Button>
      </div>
    );
  }

  const accuracy = totalCount ? Math.round((correctCount / totalCount) * 100) : 0;
  const SubjectIcon = SUBJECT_META[question.subject].icon;
  const rewardText = timedOut
    ? "Time over: no Kit 2 Coins reward for skipped questions."
    : selected === question.answerIndex
      ? `Correct: +${formatKittu(rewards.correctReward)} Kit 2 Coin.`
      : `Wrong: +${formatKittu(rewards.wrongReward)} Kit 2 Coin.`;

  return (
    <div id="quiz-playground" className="surface-panel scroll-mt-20 overflow-hidden p-0">
      <div className="border-b p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge variant="secondary" className="mb-3 rounded-full">
              <BrainCircuit className="mr-1.5 h-3.5 w-3.5" /> Endless exam quiz
            </Badge>
            <h2 className="text-xl font-bold">Kit 2 Coins Quiz</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This quiz never finishes: choose exam, subject, chapter and
              NCERT/exam-pattern/high-yield mode. NEET, CA, CBSE, ICSE, Punjab, Banking, Railways
              and UPSC tracks now stay strict to the selected subject, with instant explanations and
              a 60-second timer.
            </p>
          </div>
          <KittuCoin size="md" />
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[1.75rem] border bg-background p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="secondary" className="rounded-full">
              <SubjectIcon className="mr-1.5 h-3.5 w-3.5" /> {exam} · {question.subject} ·{" "}
              {question.topic}
            </Badge>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={historyIndex <= 0}
                onClick={showPreviousQuestion}
              >
                Previous question
              </Button>
              <span className="rounded-full border bg-muted px-3 py-1 text-xs font-black">
                {secondsLeft}s timer
              </span>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.max(0, (secondsLeft / QUESTION_TIME_SECONDS) * 100)}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
              Level
            </span>
            {DIFFICULTY_LADDER.map((level, index) => {
              const current = levelForIndex(levelStep);
              const reached = DIFFICULTY_LADDER.indexOf(current) >= index;
              return (
                <span
                  key={level}
                  className={`rounded-full border px-3 py-1 text-[11px] font-black ${
                    level === current
                      ? "border-primary bg-primary text-primary-foreground"
                      : reached
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}. {level}
                </span>
              );
            })}
            <span className="text-[11px] font-bold text-muted-foreground">
              {(levelStep % QUESTIONS_PER_LEVEL) + 1} of {QUESTIONS_PER_LEVEL} in this level
            </span>
          </div>

          <h3 className="quiz-question-text mt-5 whitespace-pre-line text-xl font-black leading-relaxed sm:text-2xl">
            {question.prompt}
          </h3>

          {question.examTags && question.examTags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                Important for
              </span>
              {question.examTags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                    tag === exam
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/60 text-muted-foreground",
                  )}
                >
                  {tag}
                </span>
              ))}
              {question.examTags.length > 6 && (
                <span className="text-[10px] font-bold text-muted-foreground">
                  +{question.examTags.length - 6} more
                </span>
              )}
            </div>
          )}

          <div className="mt-6 grid gap-3">
            {question.options.map((option, index) => {
              const isCorrect = index === question.answerIndex;
              const isSelected = selected === index;
              return (
                <button
                  key={`${question.id}-${option}`}
                  type="button"
                  disabled={answered}
                  onClick={() => finishAttempt(index)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl border bg-background px-4 py-3 text-left text-sm font-semibold transition-colors",
                    !answered ? "hover:border-primary/60 hover:bg-muted/50" : "",
                    answered && isCorrect ? "border-success bg-success/10 text-success" : "",
                    answered && isSelected && !isCorrect
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "",
                  )}
                >
                  <span className="flex min-w-0 items-center">
                    <span className="mr-3 grid h-7 w-7 shrink-0 place-items-center rounded-xl border bg-muted text-xs font-black">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="min-w-0">{option}</span>
                  </span>
                  {answered && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                  {answered && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-6 rounded-3xl border bg-muted/35 p-5">
              <p className="flex items-center gap-2 text-sm font-black text-primary">
                <Sparkles className="h-4 w-4" /> Explanation
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">{rewardText}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {question.explanation}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  disabled={historyIndex <= 0}
                  onClick={showPreviousQuestion}
                >
                  Previous question
                </Button>
                <Button className="rounded-full" onClick={() => nextQuestion()}>
                  Next question <RefreshCcw className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <QuizStat
            icon={CalendarClock}
            label="Timer"
            value={`${secondsLeft}s`}
            tone="border bg-muted/30"
          />
          <QuizStat
            icon={Trophy}
            label="Correct"
            value={`${correctCount}/${totalCount}`}
            tone="border bg-muted/30"
          />
          <QuizStat
            icon={Target}
            label="Accuracy"
            value={`${accuracy}%`}
            tone="border bg-muted/30"
          />
          <QuizStat icon={Zap} label="Streak" value={`${streak}`} tone="border bg-muted/30" />
          <div className="rounded-3xl border bg-background/70 p-5 text-sm leading-relaxed text-muted-foreground">
            <p className="font-bold text-foreground">Coin logic</p>
            <p className="mt-2">
              Correct answer gives {formatKittu(rewards.correctReward)} Kit 2 Coin. Wrong answer
              gives {formatKittu(rewards.wrongReward)} learning coin after the explanation. Timeouts
              do not reward coins.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function QuizStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={cn("rounded-3xl border p-5", tone)}>
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-3xl font-black text-foreground">{value}</p>
    </div>
  );
}

function generateQuestionWithAntiRepeat(
  filter: SubjectFilter,
  exam: ExamTrack,
  topic: TopicFilter,
  mode: PracticeMode,
  recentSignatures: string[],
): QuizQuestion {
  let candidate = generateQuestion(filter, exam, topic, mode);
  for (let attempt = 0; attempt < 25; attempt += 1) {
    if (!recentSignatures.includes(questionSignature(candidate))) return candidate;
    candidate = generateQuestion(filter, exam, topic, mode);
  }
  return candidate;
}

function questionSignature(question: QuizQuestion) {
  // Options are part of the signature because some chapters legitimately reuse
  // the same stem (for example "choose the correct sentence") with new choices.
  const optionKey = [...question.options].sort().join("~");
  return `${question.subject}|${question.topic}|${question.prompt}|${optionKey}`
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function generateQuestion(
  filter: SubjectFilter,
  exam: ExamTrack,
  topic: TopicFilter,
  mode: PracticeMode,
): QuizQuestion {
  const availableSubjects = getSubjectsForExam(exam);
  const subject = filter === "Mixed" ? pick(availableSubjects) : filter;
  const selectedTopic = normalizeTopic(exam, subject, topic);

  if (selectedTopic !== "Mixed") return makeTopicQuestion(exam, subject, selectedTopic, mode);
  if (exam === "NEET") return makeNeetQuestion(mode);
  if (exam === "JEE Main" || exam === "JEE Advanced") {
    if (subject === "Math") return makeJeeMathQuestion(exam === "JEE Advanced", mode);
    return makeJeeScienceQuestion(exam === "JEE Advanced", mode);
  }
  if (SCHOOL_BOARD_EXAMS.has(exam) && !COMMERCE_EXAMS.has(exam)) {
    return makeSchoolBoardQuestion(exam, subject, mode);
  }
  if (COMMERCE_EXAMS.has(exam)) return makeCommerceQuestion(exam, subject, mode);
  if (TEACHING_EXAMS.has(exam)) return makeTeachingQuestionStrict(exam, subject, mode);
  if (PUNJAB_EXAMS.has(exam)) return makePunjabQuestionStrict(exam, subject, mode);
  if (exam === "CLAT/Law") return makeLawQuestionStrict(subject, mode);
  if (GOVT_EXAMS.has(exam)) return makeGovtQuestionStrict(exam, subject, mode);
  if (exam === "CUET")
    return makeTopicQuestion(exam, subject, pick(getTopicsForSubject(exam, subject)), mode);

  return makeTopicQuestion(exam, subject, pick(getTopicsForSubject(exam, subject)), mode);
}

/**
 * Invert `getSubjectsForExam` so the guided flow can ask "subject first, then
 * which exam". Only exams that actually offer the subject are shown.
 */
function getExamsForSubject(subject: SubjectFilter): ExamTrack[] {
  if (subject === "Mixed") return EXAM_TRACKS;
  const matches = EXAM_TRACKS.filter(
    (track) => track !== "All Exams" && getSubjectsForExam(track).includes(subject),
  );
  return ["All Exams", ...matches];
}

function getSubjectsForExam(exam: ExamTrack): Subject[] {
  if (exam === "NEET") return uniqueSubjects([...NEET_SUBJECTS, "Science"]);
  if (exam === "JEE Main" || exam === "JEE Advanced")
    return uniqueSubjects([...JEE_SUBJECTS, "Math", "Science"]);
  if (exam === "CBSE Class 11-12 Science" || exam === "ISC Science") {
    return uniqueSubjects(["Science", "Math", "English Grammar", ...NEET_SUBJECTS, "Mathematics"]);
  }
  if (exam === "CBSE Class 11-12 Commerce" || exam === "ISC Commerce") {
    return uniqueSubjects(["Commerce", "Math", "English Grammar", ...CA_SUBJECTS]);
  }
  if (exam === "CA Foundation" || exam === "CA Intermediate") {
    return uniqueSubjects([
      ...CA_SUBJECTS,
      "Commerce",
      "Quantitative Aptitude",
      "English Language",
    ]);
  }
  if (SCHOOL_BOARD_EXAMS.has(exam)) return SCHOOL_SUBJECTS;
  if (COMMERCE_EXAMS.has(exam))
    return uniqueSubjects(["Commerce", "Math", "English Grammar", ...CA_SUBJECTS]);
  if (exam === "CLAT/Law") return ["Law", "Polity", "English Grammar", "Math", "Reasoning"];
  if (TEACHING_EXAMS.has(exam))
    return uniqueSubjects([
      "Teaching Aptitude",
      ...SCHOOL_SUBJECTS,
      ...PUNJAB_SUBJECTS,
      ...GS_SUBJECTS,
    ]);
  if (exam === "UPSC CSE")
    return uniqueSubjects([...GS_SUBJECTS, "CSAT", "Reasoning", "Quantitative Aptitude"]);
  if (exam === "State PSC")
    return uniqueSubjects([...GS_SUBJECTS, "CSAT", ...PUNJAB_SUBJECTS, ...APTITUDE_SUBJECTS]);
  if (exam === "NDA/CDS")
    return uniqueSubjects([
      "Mathematics",
      "English Language",
      "General Science",
      ...GS_SUBJECTS,
      "Reasoning",
    ]);
  if (PUNJAB_EXAMS.has(exam))
    return uniqueSubjects([...PUNJAB_SUBJECTS, ...APTITUDE_SUBJECTS, ...GS_SUBJECTS]);
  if (exam === "Banking")
    return uniqueSubjects([
      ...BANKING_SUBJECTS,
      "Math",
      "English Grammar",
      "Hindi Grammar",
      "SST",
      "Indian Economy",
    ]);
  if (exam === "Railway")
    return uniqueSubjects([
      ...APTITUDE_SUBJECTS,
      "Math",
      "Science",
      "SST",
      "Polity",
      "English Grammar",
      "Hindi Grammar",
      ...GS_SUBJECTS,
    ]);
  if (GOVT_EXAMS.has(exam))
    return uniqueSubjects([...APTITUDE_SUBJECTS, ...GOVT_SUBJECTS, ...GS_SUBJECTS]);
  if (exam === "CUET")
    return uniqueSubjects([
      ...SCHOOL_SUBJECTS,
      "Commerce",
      "Polity",
      ...APTITUDE_SUBJECTS,
      ...NEET_SUBJECTS,
    ]);
  return SUBJECTS;
}

function getTopicsForSubject(_exam: ExamTrack, subject: SubjectFilter): string[] {
  if (subject === "Mixed") return [];
  /*
   * The chapter list is read straight from the question bank, so every chapter
   * added to a syllabus shows up here without a second edit. The older curated
   * list is merged in afterwards to keep the hand written questions reachable.
   */
  const fromBank = getExamBankTopics(subject);
  const curated = SUBJECT_TOPICS[subject] ?? [];
  const merged = Array.from(new Set([...fromBank, ...curated]));
  return merged.length > 0 ? merged : SUBJECT_TOPICS.SST;
}

function normalizeTopic(exam: ExamTrack, subject: Subject, topic: TopicFilter): TopicFilter {
  const topics = getTopicsForSubject(exam, subject);
  return topic !== "Mixed" && topics.includes(topic) ? topic : "Mixed";
}

function uniqueSubjects(items: Subject[]): Subject[] {
  return Array.from(new Set(items));
}

function practiceTargetFromBatch(batch: KittuPracticeBatch): PracticeTarget | null {
  const label = batch.label.trim();
  if (!label) return null;

  const exam = EXAM_TRACKS.includes(batch.exam) ? batch.exam : "Other Competitive Exam";
  const availableSubjects = getSubjectsForExam(exam);
  const subject =
    batch.subject !== "Mixed" && availableSubjects.includes(batch.subject as Subject)
      ? (batch.subject as Subject)
      : "Mixed";
  const availableTopics = getTopicsForSubject(exam, subject);
  const topic =
    batch.topic !== "Mixed" && availableTopics.includes(batch.topic) ? batch.topic : "Mixed";
  const mode = PRACTICE_MODES.includes(batch.mode)
    ? batch.mode
    : suggestPracticeMode(exam, subject);

  return {
    label,
    exam,
    subject,
    topic,
    mode,
    hint: "Admin-practice batch",
  };
}

function searchPracticeTargets(
  query: string,
  customTargets: PracticeTarget[] = [],
): PracticeTarget[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const targets: Array<PracticeTarget & { priority: number }> = [];
  for (const customTarget of customTargets) {
    const customText =
      `${customTarget.label} ${customTarget.exam} ${customTarget.subject} ${customTarget.topic}`.toLowerCase();
    if (customText.includes(normalized)) {
      targets.push({ ...customTarget, hint: "Admin practice batch", priority: 0 });
    }
  }

  for (const track of EXAM_TRACKS) {
    const trackText = track.toLowerCase();
    if (trackText.includes(normalized)) {
      targets.push({
        label: `${track} — full practice`,
        exam: track,
        subject: "Mixed",
        topic: "Mixed",
        mode: suggestPracticeMode(track, "Mixed"),
        hint: "Exam preset",
        priority: trackText.startsWith(normalized) ? 0 : 1,
      });
    }

    for (const subjectItem of getSubjectsForExam(track)) {
      const subjectText = subjectItem.toLowerCase();
      if (subjectText.includes(normalized)) {
        targets.push({
          label: `${subjectItem} — ${track}`,
          exam: track,
          subject: subjectItem,
          topic: "Mixed",
          mode: suggestPracticeMode(track, subjectItem),
          hint: "Subject practice",
          priority: subjectText.startsWith(normalized) ? 1 : 2,
        });
      }

      for (const topicItem of getTopicsForSubject(track, subjectItem)) {
        const combinedTopic = `${subjectItem} ${topicItem}`.toLowerCase();
        const topicText = topicItem.toLowerCase();
        if (topicText.includes(normalized) || combinedTopic.includes(normalized)) {
          targets.push({
            label: `${topicItem} — ${subjectItem}`,
            exam: track,
            subject: subjectItem,
            topic: topicItem,
            mode: suggestPracticeMode(track, subjectItem),
            hint: "Chapterwise practice",
            priority: topicText.startsWith(normalized) ? 1 : 2,
          });
        }
      }
    }
  }

  const seen = new Set<string>();
  return targets
    .sort((left, right) => left.priority - right.priority || left.label.localeCompare(right.label))
    .filter((target) => {
      const key = `${target.exam}|${target.subject}|${target.topic}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 14);
}

function suggestPracticeMode(exam: ExamTrack, subject: SubjectFilter): PracticeMode {
  if (
    SCHOOL_BOARD_EXAMS.has(exam) ||
    subject === "Science Class 9" ||
    subject === "Science Class 10" ||
    subject === "Math Class 9" ||
    subject === "Math Class 10"
  ) {
    return "NCERT-based";
  }
  if (exam === "NEET" || exam === "JEE Main" || exam === "JEE Advanced" || exam === "CUET") {
    return "High-yield";
  }
  return "Exam-pattern";
}

function hydrateQuestion(raw: RawQuestion): QuizQuestion {
  const shuffled = shuffle(raw.options);
  const answerIndex = Math.max(
    0,
    shuffled.findIndex((option) => option === raw.answer),
  );
  return {
    ...raw,
    id: `${raw.id}-${createLocalId()}`,
    options: shuffled,
    answerIndex,
  };
}

function makeNeetQuestion(mode: PracticeMode = "High-yield"): QuizQuestion {
  const type = Math.floor(Math.random() * 6);
  if (type === 0) {
    return makeConceptQuestion(
      "Science",
      "NEET Biology · Genetics",
      "In a simple monohybrid cross between two heterozygous tall pea plants, what phenotypic ratio is expected?",
      "3 tall : 1 dwarf",
      ["1 tall : 1 dwarf", "3 tall : 1 dwarf", "9 : 3 : 3 : 1", "All dwarf", "All tall"],
      "For Tt × Tt, the genotypes are TT, Tt, Tt and tt. Three show tall phenotype and one shows dwarf phenotype, so the phenotypic ratio is 3:1.",
    );
  }
  if (type === 1) {
    return makeConceptQuestion(
      "Science",
      "NEET Biology · Human Physiology",
      "Which structure is the functional unit of the human kidney?",
      "Nephron",
      ["Neuron", "Nephron", "Alveolus", "Villus", "Osteon"],
      "A nephron filters blood, reabsorbs useful substances and helps form urine. It is the basic structural and functional unit of the kidney.",
    );
  }
  if (type === 2) {
    const mass = randomInt(18, 90, 18);
    const answer = mass / 18;
    return makeNumericQuestion(
      "NEET Chemistry · Mole Concept",
      `How many moles are present in ${mass} g of water? Molar mass of H₂O = 18 g mol⁻¹.`,
      answer,
      `Moles = given mass / molar mass = ${mass}/18 = ${answer} mol.`,
      "Science",
    );
  }
  if (type === 3) {
    const voltage = randomInt(6, 24, 3);
    const resistance = randomInt(2, 8);
    const answer = voltage / resistance;
    return makeNumericQuestion(
      "NEET Physics · Current Electricity",
      `A ${voltage} V battery is connected across a ${resistance} Ω resistor. Find the current in ampere.`,
      answer,
      `Using Ohm's law, I = V/R = ${voltage}/${resistance} = ${answer} A.`,
      "Science",
    );
  }
  if (type === 4) {
    return makeConceptQuestion(
      "Science",
      "NEET Chemistry · Periodic Table",
      "Across a period from left to right, what generally happens to atomic radius?",
      "It decreases",
      [
        "It decreases",
        "It increases",
        "It remains exactly same",
        "It becomes zero",
        "It first becomes infinite",
      ],
      "Across a period, nuclear charge increases while shells remain same, so electrons are pulled closer and atomic radius generally decreases.",
    );
  }
  return makeConceptQuestion(
    "Science",
    "NEET Biology · Ecology",
    "In an ecosystem, which group converts light energy into chemical energy?",
    "Producers",
    ["Producers", "Primary consumers", "Decomposers", "Carnivores", "Parasites"],
    "Producers such as green plants and algae perform photosynthesis and store solar energy as chemical energy in food.",
  );
}

function makeJeeMathQuestion(advanced: boolean, mode: PracticeMode = "High-yield"): QuizQuestion {
  void mode;
  if (advanced) {
    const k = 6;
    return makeNumericQuestion(
      "JEE Advanced Maths · Quadratic Equations",
      "If the roots of x² − 5x + k = 0 differ by 1, find k.",
      k,
      "Let roots be r and r+1. Their sum is 5, so 2r+1 = 5 and r = 2. Roots are 2 and 3, product k = 6.",
    );
  }
  const type = Math.floor(Math.random() * 4);
  if (type === 0) {
    const a = randomInt(2, 8);
    const b = randomInt(2, 8);
    const answer = a * a + b * b;
    return makeNumericQuestion(
      "JEE Main Maths · Coordinate Geometry",
      `What is the square of the distance between points (0, 0) and (${a}, ${b})?`,
      answer,
      `Distance squared = (x₂-x₁)² + (y₂-y₁)² = ${a}² + ${b}² = ${answer}.`,
    );
  }
  if (type === 1) {
    const n = randomInt(8, 24);
    const answer = (n * (n + 1)) / 2;
    return makeNumericQuestion(
      "JEE Main Maths · Series",
      `Find the sum of the first ${n} natural numbers.`,
      answer,
      `Sum of first n natural numbers = n(n+1)/2 = ${n}×${n + 1}/2 = ${answer}.`,
    );
  }
  if (type === 2) {
    return makeConceptQuestion(
      "Math",
      "JEE Main Maths · Trigonometry",
      "What is the value of sin²θ + cos²θ for any real θ?",
      "1",
      ["0", "1", "2", "sin θ", "cos θ"],
      "The fundamental identity is sin²θ + cos²θ = 1 for every real value of θ.",
    );
  }
  return makeNumericQuestion(
    "JEE Main Maths · AP",
    "For the arithmetic progression 3, 7, 11, ... which term is 79?",
    20,
    "aₙ = a + (n−1)d. Here 79 = 3 + (n−1)4, so 76 = 4(n−1), n−1 = 19 and n = 20.",
  );
}

function makeJeeScienceQuestion(
  advanced: boolean,
  mode: PracticeMode = "High-yield",
): QuizQuestion {
  void mode;
  const type = Math.floor(Math.random() * 5);
  if (advanced && type <= 1) {
    return makeConceptQuestion(
      "Science",
      "JEE Advanced Physics · Mechanics",
      "For a conservative force field, which quantity remains path independent?",
      "Work done between two fixed points",
      [
        "Work done between two fixed points",
        "Frictional heat produced",
        "Time taken along a path",
        "Average speed",
        "Air drag",
      ],
      "In a conservative field, work depends only on initial and final positions, not on the path. This idea is central to potential energy.",
    );
  }
  if (type === 0) {
    const force = randomInt(5, 30, 5);
    const displacement = randomInt(2, 10);
    const answer = force * displacement;
    return makeNumericQuestion(
      "JEE Physics · Work Energy",
      `A constant force of ${force} N moves a body by ${displacement} m in the direction of force. Find the work done in joule.`,
      answer,
      `Work done = F × s × cos 0° = ${force} × ${displacement} = ${answer} J.`,
      "Science",
    );
  }
  if (type === 1) {
    return makeConceptQuestion(
      "Science",
      "JEE Chemistry · Chemical Bonding",
      "Which type of bond is mainly formed by sharing of electron pairs?",
      "Covalent bond",
      ["Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond", "Coordinate geometry"],
      "A covalent bond forms when atoms share electron pairs to complete their valence shells.",
    );
  }
  if (type === 2) {
    return makeConceptQuestion(
      "Science",
      "JEE Chemistry · Periodic Trends",
      "Which property generally increases from left to right across a period?",
      "Electronegativity",
      [
        "Electronegativity",
        "Atomic radius",
        "Metallic character",
        "Number of shells",
        "Nuclear mass becomes zero",
      ],
      "Effective nuclear charge increases across a period, so electronegativity generally increases while atomic radius decreases.",
    );
  }
  if (type === 3) {
    const capacitance = randomInt(2, 10);
    const voltage = randomInt(2, 8);
    const answer = capacitance * voltage;
    return makeNumericQuestion(
      "JEE Physics · Electrostatics",
      `A ${capacitance} μF capacitor is charged to ${voltage} V. What is Q in μC?`,
      answer,
      `Charge Q = CV = ${capacitance} × ${voltage} = ${answer} μC.`,
      "Science",
    );
  }
  return makeConceptQuestion(
    "Science",
    "JEE Physics · Optics",
    "For a ray passing from rarer to denser medium, which statement is generally true?",
    "It bends towards the normal",
    [
      "It bends towards the normal",
      "It always bends away from the normal",
      "It never changes direction",
      "It becomes sound",
      "It stops at boundary",
    ],
    "When light enters a denser medium from a rarer medium, its speed decreases and the ray bends towards the normal.",
  );
}

function makeSchoolBoardQuestion(
  exam: ExamTrack,
  preferredSubject: Subject,
  mode: PracticeMode = "NCERT-based",
): QuizQuestion {
  const subject = preferredSubject === "Polity" ? "SST" : preferredSubject;
  const strictTopic = pick(getTopicsForSubject(exam, subject));
  if (
    subject === "Math Class 9" ||
    subject === "Math Class 10" ||
    subject === "Science Class 9" ||
    subject === "Science Class 10" ||
    subject === "Science" ||
    subject === "English Grammar" ||
    subject === "Hindi Grammar" ||
    subject === "SST"
  ) {
    return makeTopicQuestion(exam, subject, strictTopic, mode);
  }
  const type = Math.floor(Math.random() * 7);

  if (subject === "Math" || type === 0) {
    const a = randomInt(2, 12);
    const b = randomInt(3, 15);
    const answer = a * b + b;
    return makeNumericQuestion(
      `${exam} · Mathematics MCQ`,
      `Evaluate ${a} × ${b} + ${b}.`,
      answer,
      `Use order of operations: multiply first, ${a} × ${b} = ${a * b}; then add ${b}. Answer = ${answer}.`,
      "Math",
    );
  }

  if (type === 1) {
    return makeConceptQuestion(
      "Science",
      `${exam} · Science MCQ`,
      "Which process converts liquid water into water vapour?",
      "Evaporation",
      ["Evaporation", "Condensation", "Freezing", "Sublimation", "Sedimentation"],
      "Evaporation is the change of liquid water into vapour from the surface, usually helped by heat and air movement.",
    );
  }

  if (type === 2) {
    return makeConceptQuestion(
      "Science",
      `${exam} · Biology MCQ`,
      "Which part of a plant mainly performs photosynthesis?",
      "Leaf",
      ["Leaf", "Root hair", "Seed coat", "Stem bark", "Flower petal only"],
      "Leaves contain chlorophyll in chloroplasts and are the main sites of photosynthesis in most plants.",
    );
  }

  if (type === 3) {
    return makeConceptQuestion(
      "SST",
      `${exam} · History/Civics MCQ`,
      "In civics, the term 'democracy' mainly means",
      "Government by the people through participation or representatives",
      [
        "Government by the people through participation or representatives",
        "Rule by one hereditary king only",
        "Rule without elections",
        "Government with no rights",
        "Only military rule",
      ],
      "Democracy is based on people's participation, elections, representation and accountability.",
    );
  }

  if (type === 4) {
    return makeConceptQuestion(
      "SST",
      `${exam} · Geography MCQ`,
      "Which imaginary line is at 0° latitude?",
      "Equator",
      ["Equator", "Prime Meridian", "Tropic of Cancer", "Arctic Circle", "International Date Line"],
      "The Equator is the 0° latitude line and divides Earth into Northern and Southern Hemispheres.",
    );
  }

  if (type === 5) {
    return makeConceptQuestion(
      "SST",
      `${exam} · English/Language MCQ`,
      "Choose the grammatically correct sentence.",
      "She has completed her homework.",
      [
        "She has completed her homework.",
        "She have completed her homework.",
        "She completing her homework yesterday.",
        "She complete her homework now.",
        "She were completed homework.",
      ],
      "With singular subject 'she', the present perfect form is 'has completed'.",
    );
  }

  return makeConceptQuestion(
    "Science",
    `${exam} · Physics MCQ`,
    "The SI unit of force is",
    "Newton",
    ["Newton", "Watt", "Joule per second", "Ampere", "Pascal second"],
    "Force is measured in newton (N). Watt measures power and ampere measures electric current.",
  );
}

function makeCommerceQuestion(
  exam: ExamTrack,
  subject: Subject = "Commerce",
  mode: PracticeMode = "High-yield",
): QuizQuestion {
  if (subject === "Commerce") {
    return makeTopicQuestion(exam, "Commerce", pick(SUBJECT_TOPICS.Commerce), mode);
  }
  if (subject === "Math") {
    return makeTopicQuestion(exam, "Math", pick(SUBJECT_TOPICS.Math), mode);
  }
  if (subject === "English Grammar") {
    return makeTopicQuestion(
      exam,
      "English Grammar",
      pick(SUBJECT_TOPICS["English Grammar"]),
      mode,
    );
  }
  const type = Math.floor(Math.random() * 5);
  if (type === 0) {
    const assets = randomInt(40000, 120000, 10000);
    const liabilities = randomInt(10000, 60000, 5000);
    const answer = assets - liabilities;
    return makeNumericQuestion(
      `${exam} · Accounting Equation`,
      `If assets are ₹${assets} and liabilities are ₹${liabilities}, what is owner's equity?`,
      answer,
      `Accounting equation: Assets = Liabilities + Equity. So Equity = ${assets} - ${liabilities} = ₹${answer}.`,
      "Math",
    );
  }
  if (type === 1) {
    return makeConceptQuestion(
      "SST",
      `${exam} · Business Law`,
      "Which element is essential for a valid contract?",
      "Free consent",
      [
        "Free consent",
        "Only oral promise",
        "No consideration",
        "Unlawful object",
        "Secret terms only",
      ],
      "A valid contract needs free consent, lawful object, consideration and capacity of parties.",
    );
  }
  if (type === 2) {
    return makeConceptQuestion(
      "SST",
      `${exam} · Economics`,
      "When price rises and quantity demanded falls, which law is being applied?",
      "Law of demand",
      ["Law of demand", "Law of supply", "Gresham's law", "Law of inertia", "Law of conservation"],
      "The law of demand states that, other things equal, demand falls when price rises.",
    );
  }
  if (type === 3) {
    const cp = randomInt(1000, 5000, 500);
    const rate = randomInt(5, 20, 5);
    const answer = cp + (cp * rate) / 100;
    return makeNumericQuestion(
      `${exam} · Business Maths`,
      `A product costing ₹${cp} is sold at ${rate}% profit. Find selling price.`,
      answer,
      `Selling price = cost + profit = ${cp} + ${rate}% of ${cp} = ₹${answer}.`,
      "Math",
    );
  }
  return makeConceptQuestion(
    "SST",
    `${exam} · Mercantile Law`,
    "In contract law, consideration means",
    "Something of value exchanged between parties",
    [
      "Something of value exchanged between parties",
      "Only respect between parties",
      "A casual invitation",
      "A non-legal promise only",
      "A government tax receipt",
    ],
    "Consideration is the value exchanged by parties and is generally required for enforceable contracts.",
  );
}

function makeTeachingQuestion(exam: ExamTrack): QuizQuestion {
  const type = Math.floor(Math.random() * 5);
  if (type === 0) {
    return makeConceptQuestion(
      "SST",
      `${exam} · Child Development`,
      "Which teaching approach best supports inclusive education?",
      "Adapting activities to different learner needs",
      [
        "Adapting activities to different learner needs",
        "Ignoring slow learners",
        "Using only one method for all",
        "Removing students with doubts",
        "Testing without teaching",
      ],
      "Inclusive education means adapting methods, materials and pace so different learners can participate meaningfully.",
    );
  }
  if (type === 1) {
    return makeConceptQuestion(
      "SST",
      `${exam} · Pedagogy`,
      "Formative assessment is mainly used to",
      "Improve learning during the teaching process",
      [
        "Improve learning during the teaching process",
        "Only rank students at the end",
        "Punish wrong answers",
        "Replace classroom teaching",
        "Avoid feedback",
      ],
      "Formative assessment gives ongoing feedback so teachers and students can improve before final evaluation.",
    );
  }
  if (type === 2) return makeMathQuestion();
  if (type === 3) {
    return makeConceptQuestion(
      "Science",
      `${exam} · EVS/Science`,
      "Which practice best supports environmental awareness in primary classes?",
      "Observation of local plants, water and waste habits",
      [
        "Observation of local plants, water and waste habits",
        "Only memorising definitions",
        "Avoiding outdoor examples",
        "Skipping discussion",
        "Using unrelated formulas",
      ],
      "Young learners understand EVS better through local observation, discussion and real-life examples.",
    );
  }
  return makeConceptQuestion(
    "SST",
    `${exam} · Punjab/Language Pedagogy`,
    "For language learning, which activity builds speaking confidence?",
    "Short classroom conversation and role play",
    [
      "Short classroom conversation and role play",
      "Silent copying only",
      "No feedback",
      "Only marks display",
      "Ignoring pronunciation",
    ],
    "Role play and guided conversation help students practise vocabulary, pronunciation and confidence.",
  );
}

function makePunjabQuestion(exam: ExamTrack): QuizQuestion {
  const type = Math.floor(Math.random() * 5);
  if (type === 0) {
    return makeConceptQuestion(
      "SST",
      `${exam} · Punjab GK`,
      "Which river is historically associated with Punjab's name as the land of five rivers?",
      "The Indus river system tributaries of the region",
      [
        "The Indus river system tributaries of the region",
        "Only the Ganga river",
        "Only the Yamuna river",
        "Only the Narmada river",
        "Only the Godavari river",
      ],
      "Punjab's identity is linked with the five rivers of the north-western Indus river system region.",
    );
  }
  if (type === 1) {
    return makeConceptQuestion(
      "Polity",
      `${exam} · Indian Polity`,
      "Which level of government is closest to village-level administration?",
      "Panchayat",
      [
        "Panchayat",
        "Supreme Court",
        "Lok Sabha only",
        "Rajya Sabha only",
        "Election Commission only",
      ],
      "Panchayats are local self-government institutions at village level under Part IX of the Constitution.",
    );
  }
  if (type === 2) return makeMathQuestion();
  if (type === 3) {
    return makeConceptQuestion(
      "SST",
      `${exam} · Punjab Administration`,
      "A Patwari is mainly associated with which type of record?",
      "Land and revenue records",
      [
        "Land and revenue records",
        "Space research",
        "Bank currency printing",
        "Railway signalling",
        "Passport printing",
      ],
      "Patwari-level work is commonly linked with land/revenue records and local revenue administration.",
    );
  }
  return makeTeachingQuestion(exam);
}

function makeLawQuestion(): QuizQuestion {
  const type = Math.floor(Math.random() * 3);
  if (type === 0) {
    return makeConceptQuestion(
      "Polity",
      "CLAT/Law · Constitution",
      "Which writ is used to produce a detained person before a court?",
      "Habeas corpus",
      ["Habeas corpus", "Mandamus", "Certiorari", "Quo warranto", "Prohibition"],
      "Habeas corpus protects personal liberty by requiring the authority to produce the detained person before court.",
    );
  }
  if (type === 1) {
    const banked = makeBankQuestion("Law", "Legal Reasoning", "CLAT/Law · Legal Reasoning");
    if (banked) return banked;
  }
  return makeMathQuestion();
}

function makeGovtQuestion(exam: ExamTrack): QuizQuestion {
  const type = Math.floor(Math.random() * 6);
  if (type === 0) return makeGeneratedSubjectQuestion("Polity", exam);
  if (type === 1) return makeGeneratedSubjectQuestion("SST", exam);
  if (type === 2) return makeMathQuestion();
  if (type === 3) {
    return makeConceptQuestion(
      "SST",
      `${exam} · Economy`,
      "Which term means a sustained rise in the general price level?",
      "Inflation",
      ["Inflation", "Deflation", "Depreciation", "Monsoon", "Fiscal federalism"],
      "Inflation is the sustained increase in the general price level of goods and services.",
    );
  }
  if (type === 4) {
    return makeConceptQuestion(
      "Polity",
      `${exam} · Governance`,
      "The Election Commission of India is primarily responsible for",
      "Conducting and supervising elections",
      [
        "Conducting and supervising elections",
        "Printing currency",
        "Commanding armed forces",
        "Collecting income tax",
        "Running courts",
      ],
      "The Election Commission supervises, directs and controls elections to Parliament, state legislatures and key constitutional offices.",
    );
  }
  return makeConceptQuestion(
    "Science",
    `${exam} · General Science`,
    "Which vitamin is mainly produced in skin under sunlight exposure?",
    "Vitamin D",
    ["Vitamin D", "Vitamin C", "Vitamin B12", "Vitamin K only", "Vitamin A only"],
    "Sunlight helps skin synthesize vitamin D, important for calcium metabolism and bone health.",
  );
}

function makeGeneratedSubjectQuestion(subject: Subject, exam: ExamTrack): QuizQuestion {
  const examLabel = exam === "All Exams" ? "Competitive" : exam;
  if (subject === "Polity") {
    const schedules = [
      {
        clue: "official languages of India",
        answer: "Eighth Schedule",
        explanation:
          "The Eighth Schedule lists the constitutionally recognised languages of India.",
      },
      {
        clue: "anti-defection provisions",
        answer: "Tenth Schedule",
        explanation: "The Tenth Schedule contains anti-defection rules for legislators.",
      },
      {
        clue: "Panchayati Raj institutions",
        answer: "Eleventh Schedule",
        explanation: "The Eleventh Schedule lists subjects that may be devolved to Panchayats.",
      },
      {
        clue: "municipalities and urban local bodies",
        answer: "Twelfth Schedule",
        explanation:
          "The Twelfth Schedule covers functions of municipalities and urban local bodies.",
      },
    ];
    const item = pick(schedules);
    return makeConceptQuestion(
      "Polity",
      `${examLabel} · Constitution Schedules`,
      `Which Constitution Schedule is linked with ${item.clue}?`,
      item.answer,
      [
        "First Schedule",
        "Fifth Schedule",
        "Sixth Schedule",
        "Eighth Schedule",
        "Tenth Schedule",
        "Eleventh Schedule",
        "Twelfth Schedule",
      ],
      item.explanation,
    );
  }

  if (subject === "Science") {
    const units = [
      { quantity: "force", answer: "Newton", symbol: "N" },
      { quantity: "power", answer: "Watt", symbol: "W" },
      { quantity: "electric current", answer: "Ampere", symbol: "A" },
      { quantity: "pressure", answer: "Pascal", symbol: "Pa" },
      { quantity: "frequency", answer: "Hertz", symbol: "Hz" },
    ];
    const item = pick(units);
    return makeConceptQuestion(
      "Science",
      `${examLabel} · SI Units`,
      `What is the SI unit of ${item.quantity}?`,
      item.answer,
      ["Joule", "Newton", "Watt", "Ampere", "Pascal", "Hertz", "Kelvin"],
      `${item.answer} (${item.symbol}) is the standard SI unit used for ${item.quantity}.`,
    );
  }

  const geography = [
    {
      clue: "0° latitude",
      answer: "Equator",
      explanation:
        "The Equator is the 0° latitude line that divides Earth into Northern and Southern Hemispheres.",
    },
    {
      clue: "0° longitude",
      answer: "Prime Meridian",
      explanation:
        "The Prime Meridian is 0° longitude and is used as the reference for longitudes and time zones.",
    },
    {
      clue: "23.5° N latitude",
      answer: "Tropic of Cancer",
      explanation: "The Tropic of Cancer lies at about 23.5° N and passes through India.",
    },
    {
      clue: "23.5° S latitude",
      answer: "Tropic of Capricorn",
      explanation: "The Tropic of Capricorn lies at about 23.5° S in the Southern Hemisphere.",
    },
  ];
  const item = pick(geography);
  return makeConceptQuestion(
    "SST",
    `${examLabel} · Geography Lines`,
    `Which geographical line is described as ${item.clue}?`,
    item.answer,
    [
      "Equator",
      "Prime Meridian",
      "Tropic of Cancer",
      "Tropic of Capricorn",
      "Arctic Circle",
      "Antarctic Circle",
    ],
    item.explanation,
  );
}

function makeTeachingQuestionStrict(
  exam: ExamTrack,
  subject: Subject,
  mode: PracticeMode,
): QuizQuestion {
  if (subject === "Teaching Aptitude") return makeTeachingQuestion(exam);
  return makeTopicQuestion(exam, subject, pick(getTopicsForSubject(exam, subject)), mode);
}

function makePunjabQuestionStrict(
  exam: ExamTrack,
  subject: Subject,
  mode: PracticeMode,
): QuizQuestion {
  return makeTopicQuestion(exam, subject, pick(getTopicsForSubject(exam, subject)), mode);
}

function makeLawQuestionStrict(subject: Subject, mode: PracticeMode): QuizQuestion {
  const resolvedSubject = subject === "Law" ? "Law" : subject;
  return makeTopicQuestion(
    "CLAT/Law",
    resolvedSubject,
    pick(getTopicsForSubject("CLAT/Law", resolvedSubject)),
    mode,
  );
}

function makeGovtQuestionStrict(
  exam: ExamTrack,
  subject: Subject,
  mode: PracticeMode,
): QuizQuestion {
  return makeTopicQuestion(exam, subject, pick(getTopicsForSubject(exam, subject)), mode);
}

/**
 * Builds a question from the curated factual bank.
 *
 * The exact chapter is preferred. When a chapter has no stored questions yet,
 * any other verified question of the same subject is used so that a student
 * never sees a vague "what is the best strategy" style item.
 */
function makeBankQuestion(
  subject: Subject,
  topic: string,
  topicLabel: string,
  exactOnly = false,
): QuizQuestion | null {
  const exact = getBankItems(subject, topic);
  const pool = exact.length > 0 ? exact : exactOnly ? [] : getSubjectBankItems(subject);
  if (pool.length === 0) return null;
  const item = pick(pool);
  return makeConceptQuestion(
    subject,
    topicLabel,
    item.prompt,
    item.answer,
    [item.answer, ...item.distractors],
    item.explanation,
  );
}

/**
 * The level the next bank draw should target. The quiz component moves this
 * along so a run runs Easy first, then Moderate, then Difficult.
 */
let ladderLevel: LadderLevel = "Easy";

function setLadderLevel(level: LadderLevel) {
  ladderLevel = level;
}

/**
 * Advanced mode. Set from the URL when a student opens the unlimited
 * advanced test from a paid series. Every draw then comes from the Difficult,
 * exam-oriented layer of the bank and the run has no end.
 */
let advancedOnly = false;

function setAdvancedOnly(value: boolean) {
  advancedOnly = value;
}

/**
 * Builds a question from the mega exam bank (Bank, Railway, SSC, NEET, JEE, CA).
 *
 * The bank is template driven, so the exact chapter is tried first and the
 * whole subject is used as a fallback. Every item it returns is a real
 * examinable question with a worked explanation.
 */
function makeExamBankQuestion(
  exam: ExamTrack,
  subject: Subject,
  topic: string,
  topicLabel: string,
): QuizQuestion | null {
  const examFilter = exam === "All Exams" ? undefined : exam;
  // Chapter routing is strict: never serve another chapter's question here.
  // When a chapter has no bank coverage the caller falls through to its own
  // chapter-correct generator instead.
  // Level first: the run walks Easy -> Moderate -> Difficult. Each fallback
  // drops one constraint so a thin chapter still returns a real question.
  // Which layer of the bank to draw from. Advanced mode never falls back to
  // an easier level: the point of that test is that every question is an
  // exam-level one. Ordinary practice leads with the Moderate working layer
  // and only then follows the ladder.
  const drawn = advancedOnly
    ? (sampleExamBankQuestion({
        subject,
        topic,
        exam: examFilter,
        difficulty: ADVANCED_BANK_DIFFICULTY,
      }) ??
      sampleExamBankQuestion({ subject, topic, difficulty: ADVANCED_BANK_DIFFICULTY }) ??
      sampleExamBankQuestion({
        subject,
        exam: examFilter,
        difficulty: ADVANCED_BANK_DIFFICULTY,
      }) ??
      sampleExamBankQuestion({ subject, difficulty: ADVANCED_BANK_DIFFICULTY }))
    : (sampleExamBankQuestion({
        subject,
        topic,
        exam: examFilter,
        difficulty: PRACTICE_BANK_DIFFICULTY,
      }) ??
      sampleExamBankQuestion({ subject, topic, difficulty: PRACTICE_BANK_DIFFICULTY }) ??
      sampleExamBankQuestion({ subject, topic, exam: examFilter, difficulty: ladderLevel }) ??
      sampleExamBankQuestion({ subject, topic, difficulty: ladderLevel }) ??
      sampleExamBankQuestion({ subject, topic, exam: examFilter }) ??
      sampleExamBankQuestion({ subject, topic }));
  if (!drawn) return null;
  const built = makeConceptQuestion(
    subject,
    `${topicLabel} · ${drawn.difficulty}`,
    drawn.prompt,
    drawn.answer,
    [drawn.answer, ...drawn.distractors],
    drawn.explanation,
  );
  // Carry the exam tags through so the card can show which papers ask this.
  return { ...built, examTags: drawn.exams };
}

/**
 * Last-resort factual question for a subject/chapter that has no dedicated
 * generator branch. It still returns a real examinable question.
 */
function makeFallbackQuestion(subject: Subject, topic: string, topicLabel: string): QuizQuestion {
  // Never substitute a question from another subject. If the exact chapter is
  // sparse, use another verified question from the same subject only.
  const exact =
    makeBankQuestion(subject, topic, topicLabel) ??
    makeExamBankQuestion("All Exams", subject, topic, topicLabel);
  if (exact) return exact;

  const subjectItems = getSubjectBankItems(subject);
  if (subjectItems.length > 0) {
    const item = pick(subjectItems);
    return makeConceptQuestion(
      subject,
      topicLabel,
      item.prompt,
      item.answer,
      [item.answer, ...item.distractors],
      item.explanation,
    );
  }

  throw new Error(`No verified question is available for ${subject} / ${topic}.`);
}

function makeTopicQuestion(
  exam: ExamTrack,
  subject: Subject,
  topic: string,
  mode: PracticeMode,
): QuizQuestion {
  const examLabel = exam === "All Exams" ? "Competitive Practice" : exam;
  const topicLabel = `${examLabel} · ${topic} · ${mode}`;

  // The mega exam bank covers Bank/Railway/SSC/NEET/JEE/CA chapters end to end.
  const fromExamBank = makeExamBankQuestion(exam, subject, topic, topicLabel);
  if (fromExamBank && Math.random() < 0.75) return fromExamBank;

  // Verified chapter questions get priority; generators still add fresh variety.
  if (Math.random() < 0.6) {
    const banked = makeBankQuestion(subject, topic, topicLabel, true);
    if (banked) return banked;
  }

  if (subject === "Math Class 9") return makeClassMathTopicQuestion(subject, topic, topicLabel);
  if (subject === "Math Class 10") return makeClassMathTopicQuestion(subject, topic, topicLabel);
  if (subject === "Science Class 9")
    return makeClassScienceTopicQuestion(subject, topic, topicLabel);
  if (subject === "Science Class 10")
    return makeClassScienceTopicQuestion(subject, topic, topicLabel);
  if (subject === "English Grammar") return makeEnglishGrammarQuestion(topic, topicLabel);
  if (subject === "Hindi Grammar") return makeHindiGrammarQuestion(topic, topicLabel);
  if (subject === "Polity") return makePolityTopicQuestion(topic, topicLabel);
  if (subject === "SST") return makeSstTopicQuestion(topic, topicLabel);
  if (subject === "Punjab History") return makePunjabHistoryQuestion(topic, topicLabel);
  if (subject === "Punjab GK") return makePunjabGkQuestion(topic, topicLabel);
  if (subject === "Punjab Geography") return makePunjabGeographyQuestion(topic, topicLabel);
  if (subject === "Punjab Economics") return makePunjabEconomicsQuestion(topic, topicLabel);
  if (subject === "Punjabi Paper A") return makePunjabiPaperAQuestion(topic, topicLabel);
  if (subject === "Punjabi Grammar") return makePunjabiGrammarQuestion(topic, topicLabel);
  if (subject === "Punjabi Literature") return makePunjabiLiteratureQuestion(topic, topicLabel);
  if (subject === "Commerce") return makeCommerceTopicQuestion(topic, topicLabel);
  if (subject === "Law") return makeLawTopicQuestion(topic, topicLabel);
  if (subject === "Reasoning") return makeReasoningQuestion(topic, topicLabel);
  if (subject === "Teaching Aptitude") return makeTeachingAptitudeTopicQuestion(topic, topicLabel);
  if (subject === "Science") return makeScienceTopicQuestion(topic, topicLabel);
  if (subject === "Math") {
    const mathTopic = topic === "Number System" ? "Arithmetic" : topic;
    return makeTopicMathQuestion(mathTopic, topicLabel);
  }

  return makeFallbackQuestion(subject, topic, topicLabel);
}

function makeClassMathTopicQuestion(
  subject: Subject,
  topic: string,
  topicLabel: string,
): QuizQuestion {
  if (topic === "Number Systems" || topic === "Real Numbers") {
    const denominator = pick([2, 4, 5, 8, 10]);
    return makeConceptQuestion(
      subject,
      topicLabel,
      `Which fraction form guarantees a terminating decimal expansion?`,
      `p/q where q has only prime factors 2 and 5, such as denominator ${denominator}.`,
      [
        "q has prime factor 3",
        `q has only prime factors 2 and 5, such as denominator ${denominator}.`,
        "q is any odd number",
        "q is always 7",
        "q must be irrational",
      ],
      "A rational number in lowest form has a terminating decimal when its denominator contains only 2s and/or 5s.",
    );
  }
  if (topic === "Polynomials") {
    return makeNumericQuestion(
      topicLabel,
      "If p(x)=x²−5x+6, what is the product of its roots?",
      6,
      "For ax²+bx+c, product of roots = c/a = 6/1 = 6.",
      subject,
    );
  }
  if (topic === "Coordinate Geometry") {
    const x = randomInt(3, 9);
    const y = randomInt(3, 9);
    return makeNumericQuestion(
      topicLabel,
      `What is the square of the distance from (0,0) to (${x},${y})?`,
      x * x + y * y,
      `Distance squared = x² + y² = ${x}² + ${y}² = ${x * x + y * y}.`,
      subject,
    );
  }
  if (topic === "Linear Equations in Two Variables" || topic === "Pair of Linear Equations") {
    const x = randomInt(2, 8);
    const y = randomInt(1, 7);
    const sum = x + y;
    return makeNumericQuestion(
      topicLabel,
      `If x + y = ${sum} and x = ${x}, find y.`,
      y,
      `Substitute x in the equation: y = ${sum} − ${x} = ${y}. First solve one variable, then substitute carefully.`,
      subject,
    );
  }
  if (topic === "Quadratic Equations") {
    return makeConceptQuestion(
      subject,
      topicLabel,
      "For ax²+bx+c=0, when are the roots real and equal?",
      "When b²−4ac = 0",
      ["b²−4ac < 0", "b²−4ac = 0", "b²−4ac > 4", "a=0", "c=0 only"],
      "The discriminant D=b²−4ac. Equal real roots occur exactly when D=0.",
    );
  }
  if (topic === "Arithmetic Progressions") {
    const n = randomInt(8, 15);
    const a = randomInt(2, 8);
    const d = randomInt(2, 6);
    const answer = a + (n - 1) * d;
    return makeNumericQuestion(
      topicLabel,
      `In an AP with a=${a} and d=${d}, find the ${n}th term.`,
      answer,
      `aₙ = a + (n−1)d = ${a} + ${n - 1}×${d} = ${answer}.`,
      subject,
    );
  }
  if (topic === "Trigonometry") {
    return makeConceptQuestion(
      subject,
      topicLabel,
      "What is the value of sin²θ + cos²θ for every angle θ?",
      "1",
      ["0", "1", "tan²θ", "sec²θ", "2 sinθ"],
      "sin²θ + cos²θ = 1 is the basic Pythagorean identity and is commonly tested in examinations.",
    );
  }
  if (topic === "Circles") {
    return makeConceptQuestion(
      subject,
      topicLabel,
      "The tangent to a circle at a point is",
      "Perpendicular to the radius at that point",
      [
        "Parallel to radius",
        "Perpendicular to the radius at that point",
        "Always a diameter",
        "Always a chord",
        "Always outside centre",
      ],
      "A key high-yield property: radius is perpendicular to the tangent at the point of contact.",
    );
  }
  if (topic === "Probability") {
    const total = pick([10, 12, 15, 20, 25]);
    return makeConceptQuestion(
      subject,
      topicLabel,
      `If an event has 3 favourable outcomes out of ${total} equally likely outcomes, probability is`,
      `3/${total}`,
      [`1/${total}`, `3/${total}`, `${total}/3`, "0", `${total}`],
      "Probability = favourable outcomes / total outcomes, when outcomes are equally likely.",
    );
  }
  if (topic === "Statistics") {
    const a = randomInt(4, 9) * 2;
    const b = randomInt(5, 10) * 2;
    const c = randomInt(6, 11) * 2;
    return makeNumericQuestion(
      topicLabel,
      `Find the mean of ${a}, ${b} and ${c}.`,
      Math.round((a + b + c) / 3),
      `Mean = sum of observations / number of observations = (${a}+${b}+${c})/3 = ${(a + b + c) / 3}. Rounded to nearest whole number: ${Math.round((a + b + c) / 3)}.`,
      subject,
    );
  }
  if (topic === "Heron's Formula") {
    return makeConceptQuestion(
      subject,
      topicLabel,
      "Heron's formula is mainly used to find",
      "Area of a triangle when all three sides are known",
      [
        "Radius of circle",
        "Area of a triangle when all three sides are known",
        "Slope of a line",
        "HCF of numbers",
        "Discriminant only",
      ],
      "Heron's formula calculates the area using semi-perimeter and all three sides.",
    );
  }
  if (topic === "Triangles" || topic === "Quadrilaterals" || topic === "Lines and Angles") {
    const banked = makeBankQuestion(subject, topic, topicLabel);
    if (banked) return banked;
  }
  if (topic === "Surface Areas and Volumes") {
    return makeConceptQuestion(
      subject,
      topicLabel,
      "Cone volume formula for high-yield revision is",
      "(1/3)πr²h",
      ["πr²h", "(1/3)πr²h", "2πrh", "4/3πr³", "2πr²"],
      "A cone has one-third volume of a cylinder with the same base radius and height.",
    );
  }
  return makeTopicMathQuestion(topic, topicLabel, subject);
}

function makeClassScienceTopicQuestion(
  subject: Subject,
  topic: string,
  topicLabel: string,
): QuizQuestion {
  const conceptMap: Array<[string, string, string, string[], string]> = [
    [
      "Chemical Reactions and Equations",
      "In a balanced chemical equation, the number of atoms on both sides is",
      "Equal",
      ["Equal", "Always greater on product side", "Zero", "Always different", "Only doubled"],
      "A balanced equation conserves atoms, so each element has the same number of atoms on both sides.",
    ],
    [
      "Is Matter Around Us Pure",
      "A solution in which no more solute can dissolve at a given temperature is called",
      "Saturated solution",
      ["Saturated solution", "Suspension", "Colloid", "Alloy", "Aerosol"],
      "A saturated solution contains the maximum amount of solute that can dissolve at that temperature.",
    ],
    [
      "Structure of the Atom",
      "Subatomic particles around the nucleus are called",
      "Electrons",
      ["Protons", "Electrons", "Neutrons", "Nucleons", "Isotopes"],
      "Electrons revolve around the nucleus, while protons and neutrons are present in the nucleus.",
    ],
    [
      "Natural Resources",
      "The most efficient way to conserve natural resources is to",
      "Reduce, reuse and recycle",
      [
        "Reduce, reuse and recycle",
        "Use all groundwater first",
        "Only increase mining",
        "Avoid all farming",
        "Never plant trees",
      ],
      "The 3Rs—reduce, reuse and recycle—reduce extraction pressure and conserve resources sustainably.",
    ],
    [
      "Motion",
      "The slope of a displacement-time graph gives",
      "Velocity",
      ["Acceleration", "Velocity", "Force", "Mass", "Energy"],
      "Velocity = displacement/time, so the slope of displacement-time graph gives velocity.",
    ],
    [
      "Force and Laws of Motion",
      "Newton's second law of motion directly relates force to",
      "Mass × acceleration",
      [
        "Force × time only",
        "Mass × acceleration",
        "Speed + friction",
        "Pressure × area",
        "Only weight",
      ],
      "F = ma is the mathematical form of Newton's second law.",
    ],
    [
      "Gravitation",
      "The value of gravitational acceleration near Earth's surface is approximately",
      "9.8 m/s²",
      ["1.6 m/s²", "9.8 m/s²", "24 m/s²", "0 m/s²", "100 m/s²"],
      "Near Earth, g is about 9.8 m/s² and points toward Earth's centre.",
    ],
    [
      "Work and Energy",
      "The SI unit of work is",
      "Joule",
      ["Joule", "Newton", "Watt", "Pascal", "Ampere"],
      "Work = force × displacement, and its SI unit is joule (N·m).",
    ],
    [
      "Sound",
      "Sound cannot travel through",
      "Vacuum",
      ["Air", "Water", "Steel", "Vacuum", "Wood"],
      "Sound needs a material medium; vacuum has no particles to carry vibrations.",
    ],
    [
      "Acids, Bases and Salts",
      "The pH of a strong acid is generally",
      "Less than 7",
      ["Less than 7", "Exactly 14", "Exactly 7", "More than 14 only", "No pH value"],
      "Acids have pH less than 7; bases have pH more than 7 and neutral solutions have pH 7.",
    ],
    [
      "Metals and Non-metals",
      "Metals generally form",
      "Basic oxides",
      [
        "Acidic oxides",
        "Neutral salts only",
        "Basic oxides",
        "Noble gases",
        "Alkaline earth by heating only",
      ],
      "Most metallic oxides are basic and react with acids to form salt and water.",
    ],
    [
      "Carbon and Its Compounds",
      "Combustion of carbon-based fuels generally releases",
      "Carbon dioxide and water vapour",
      [
        "Carbon dioxide and water vapour",
        "Oxygen only",
        "Hydrogen peroxide only",
        "Nitrogen only",
        "Diffusion only",
      ],
      "Complete combustion of hydrocarbons produces carbon dioxide and water vapour.",
    ],
    [
      "Life Processes",
      "In human respiration, the exchange of gases mainly occurs in",
      "Alveoli",
      ["Alveoli", "Trachea", "Oesophagus", "Villi", "Neuron"],
      "Alveoli provide thin, large surface area for oxygen and carbon dioxide exchange.",
    ],
    [
      "Control and Coordination",
      "Nerve impulses are carried by functional units called",
      "Neurons",
      ["Neurons", "Alveoli", "Nephron", "Villi", "Chlorophyll"],
      "Neurons carry electrical/chemical impulses and are the functional units of the nervous system.",
    ],
    [
      "How Do Organisms Reproduce",
      "Binary fission is commonly observed in",
      "Amoeba",
      ["Amoeba", "Pea plant", "Human", "Bird", "Hydra only"],
      "In binary fission, one parent organism divides into two daughter cells.",
    ],
    [
      "Heredity",
      "The carrier of genes from parents to offspring is",
      "Chromosomes/DNA",
      ["Chromosomes/DNA", "Only cell wall", "Only mitochondria", "Vacuole", "Chloroplast only"],
      "Genes are located on chromosomes/DNA and transmit hereditary traits.",
    ],
    [
      "Light Reflection and Refraction",
      "A concave mirror can form a real and enlarged image when the object is",
      "Between focus and centre of curvature",
      [
        "At infinity only",
        "Between focus and centre of curvature",
        "Behind mirror only",
        "Inside focus only",
        "At principal axis never",
      ],
      "For a concave mirror, an object between F and C forms a real, inverted and enlarged image beyond C.",
    ],
    [
      "Human Eye and Colourful World",
      "The phenomenon responsible for the blue colour of the sky is",
      "Scattering of light",
      ["Reflection only", "Scattering of light", "Conduction", "Neutralisation", "Magnetism"],
      "Small air molecules scatter shorter blue wavelengths more strongly.",
    ],
    [
      "Electricity",
      "The SI unit of electric current is",
      "Ampere",
      ["Ampere", "Ohm", "Volt", "Watt", "Ohm metre"],
      "Electric current is measured in ampere (A). Volt measures potential difference and ohm measures resistance.",
    ],
    [
      "Magnetic Effects of Electric Current",
      "A current-carrying conductor produces",
      "Magnetic field around it",
      [
        "Magnetic field around it",
        "No visible effect",
        "Only heat always",
        "Vacuum",
        "Static mass increase",
      ],
      "Oersted's observation shows that electric current creates a magnetic field around the conductor.",
    ],
    [
      "Our Environment",
      "Biodegradable waste generally",
      "Breaks down naturally by microbes",
      [
        "Breaks down naturally by microbes",
        "Never changes",
        "Only enters deep oceans",
        "Becomes metal",
        "Creates electricity",
      ],
      "Biodegradable waste such as food peels is decomposed by microbes naturally.",
    ],
    [
      "Matter in Our Surroundings",
      "The state of matter with definite shape and volume is",
      "Solid",
      ["Solid", "Liquid only", "Gas", "Plasma", "Vapour"],
      "Solids have both definite shape and definite volume.",
    ],
    [
      "Atoms and Molecules",
      "The mole concept is linked with Avogadro number",
      "6.022 × 10²³ particles",
      [
        "6.022 × 10²³ particles",
        "10 particles",
        "100 atoms",
        "1 dozen molecules",
        "Infinite particles",
      ],
      "One mole of a substance contains approximately 6.022 × 10²³ particles.",
    ],
    [
      "Tissues",
      "Plant tissue responsible for photosynthesis includes",
      "Chlorenchyma",
      ["Chlorenchyma", "Only xylem", "Phloem", "Parenchyma absent", "Meristem only"],
      "Chlorenchyma contains chloroplasts and supports photosynthesis in plants.",
    ],
    [
      "The Fundamental Unit of Life",
      "The powerhouse of the cell is",
      "Mitochondria",
      ["Mitochondria", "Nucleus", "Ribosome", "Vacuole", "Cell wall"],
      "Mitochondria produce ATP through cellular respiration.",
    ],
  ];

  const match = conceptMap.find(([chapter]) => chapter === topic);
  if (match) {
    const [, prompt, answer, options, explanation] = match;
    return makeConceptQuestion(subject, topicLabel, prompt, answer, options, explanation);
  }

  const [, prompt, answer, options, explanation] = pick(conceptMap);
  return makeConceptQuestion(subject, topicLabel, prompt, answer, options, explanation);
}

function makeScienceTopicQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic === "Mechanics" || topic === "Work and Energy" || topic === "Motion") {
    const force = pick([5, 10, 15, 20, 25]);
    const displacement = pick([2, 4, 6, 8, 10]);
    const answer = force * displacement;
    return makeNumericQuestion(
      topicLabel,
      `A force of ${force} N moves a body by ${displacement} m in its direction. Find work done.`,
      answer,
      `Work done = force × displacement = ${force} × ${displacement} = ${answer} J.`,
      "Science",
    );
  }
  if (topic === "Optics" || topic === "Light Reflection and Refraction") {
    return makeConceptQuestion(
      "Science",
      topicLabel,
      "A ray of light travelling from a rarer medium into a denser medium generally",
      "Bends towards the normal",
      [
        "Bends towards the normal",
        "Bends away from the normal",
        "Always reflects completely",
        "Stops at the boundary",
        "Travels faster in the denser medium",
      ],
      "When light enters a denser optical medium, speed decreases and the refracted ray bends towards the normal.",
    );
  }
  if (topic === "Current Electricity" || topic === "Electricity") {
    const voltage = pick([6, 9, 12, 18, 24]);
    const resistance = pick([2, 3, 4, 6, 8]);
    const answer = Number((voltage / resistance).toFixed(1));
    return makeNumericQuestion(
      topicLabel,
      `A ${voltage} V source is connected across a ${resistance} Ω resistor. Find the current.`,
      answer,
      `Ohm's law gives I = V/R = ${voltage}/${resistance} = ${answer} A.`,
      "Science",
    );
  }
  if (topic === "Mole Concept" || topic === "Chemistry Basics") {
    const mass = pick([18, 36, 54, 72, 90]);
    const answer = mass / 18;
    return makeNumericQuestion(
      topicLabel,
      `Calculate the number of moles in ${mass} g of water. Molar mass = 18 g mol⁻¹.`,
      answer,
      `Moles = given mass / molar mass = ${mass}/18 = ${answer} mol.`,
      "Science",
    );
  }
  if (topic === "Periodic Table") {
    return makeConceptQuestion(
      "Science",
      topicLabel,
      "Across a period from left to right, atomic radius generally",
      "Decreases",
      [
        "Decreases",
        "Increases",
        "Becomes zero",
        "Remains exactly unchanged",
        "First becomes infinite",
      ],
      "Effective nuclear charge increases across a period, pulling electrons closer and generally decreasing atomic radius.",
    );
  }
  if (topic === "Chemical Bonding") {
    return makeConceptQuestion(
      "Science",
      topicLabel,
      "A covalent bond mainly forms by",
      "Sharing of electron pairs",
      [
        "Sharing of electron pairs",
        "Complete transfer of protons",
        "Only metallic attraction",
        "No electron involvement",
        "Only gravitational pull",
      ],
      "Atoms form covalent bonds by sharing electron pairs to complete their valence shells.",
    );
  }
  if (topic === "Genetics" || topic === "Heredity") {
    return makeConceptQuestion(
      "Science",
      topicLabel,
      "In a monohybrid cross Tt × Tt, the expected phenotypic ratio is",
      "3 tall : 1 dwarf",
      ["1 tall : 1 dwarf", "3 tall : 1 dwarf", "9 : 3 : 3 : 1", "All dwarf", "All tall"],
      "Tt × Tt gives TT, Tt, Tt and tt. Three plants are tall and one is dwarf, so the phenotypic ratio is 3:1.",
    );
  }
  if (topic === "Human Physiology" || topic === "Life Processes") {
    return makeConceptQuestion(
      "Science",
      topicLabel,
      "The functional unit of the human kidney is",
      "Nephron",
      ["Nephron", "Neuron", "Alveolus", "Villus", "Osteon"],
      "Nephrons filter blood, reabsorb useful substances and form urine; they are functional units of kidneys.",
    );
  }
  if (topic === "Ecology" || topic === "Our Environment") {
    return makeConceptQuestion(
      "Science",
      topicLabel,
      "Which organisms convert solar energy into chemical energy in an ecosystem?",
      "Producers",
      ["Producers", "Decomposers", "Secondary consumers", "Carnivores only", "Parasites only"],
      "Green plants and other producers capture light energy through photosynthesis and store it in food.",
    );
  }
  if (
    topic === "Units and Measurements" ||
    topic === "Physics Basics" ||
    topic === "Biology Basics"
  ) {
    return makeGeneratedSubjectQuestion("Science", "Competitive Practice");
  }
  return makeClassScienceTopicQuestion("Science", topic, topicLabel);
}

function makeEnglishGrammarQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic === "Tenses") {
    return makeConceptQuestion(
      "English Grammar",
      topicLabel,
      "Choose the correct present perfect sentence.",
      "She has completed the assignment.",
      [
        "She has completed the assignment.",
        "She have completed the assignment.",
        "She complete yesterday assignment.",
        "She is completed the assignment.",
        "She has completing the assignment.",
      ],
      "Use 'has completed' with singular third person and a past participle for present perfect.",
    );
  }
  if (topic === "Subject-Verb Agreement") {
    return makeConceptQuestion(
      "English Grammar",
      topicLabel,
      "Choose the correct sentence.",
      "The list of items is on the desk.",
      [
        "The list of items are on the desk.",
        "The list of items is on the desk.",
        "The list of items were on desk.",
        "The list are items on desk.",
        "The list of items be on desk.",
      ],
      "The subject is singular 'list', not plural 'items', so the verb is 'is'.",
    );
  }
  if (topic === "Articles and Determiners") {
    return makeConceptQuestion(
      "English Grammar",
      topicLabel,
      "Fill in the blank: ___ honest man deserves respect.",
      "An",
      ["A", "An", "The only", "No article ever", "Many"],
      "'Honest' begins with a vowel sound because h is silent, so we use 'an'.",
    );
  }
  if (topic === "Prepositions") {
    return makeConceptQuestion(
      "English Grammar",
      topicLabel,
      "Choose the correct preposition: We arrived ___ the station on time.",
      "at",
      ["in", "at", "on", "by", "with"],
      "For smaller locations/points, 'at' is used: at the station.",
    );
  }
  return makeFallbackQuestion("English Grammar", topic, topicLabel);
}

function makeHindiGrammarQuestion(topic: string, topicLabel: string): QuizQuestion {
  const questionsByTopic: Record<
    string,
    Array<{ prompt: string; answer: string; options: string[]; explanation: string }>
  > = {
    "संग्या और सर्वनाम": [
      {
        prompt: "‘राधा पढ़ती है।’ में ‘राधा’ किस प्रकार की संज्ञा का उदाहरण है?",
        answer: "व्यक्तिवाचक संज्ञा",
        options: ["व्यक्तिवाचक संज्ञा", "भाववाचक संज्ञा", "समूहवाचक संज्ञा", "द्रव्यवाचक संज्ञा"],
        explanation: "‘राधा’ किसी विशेष व्यक्ति का नाम है, इसलिए यह व्यक्तिवाचक संज्ञा है।",
      },
      {
        prompt: "‘मुझे पानी चाहिए।’ में ‘मुझे’ कौन सा पद है?",
        answer: "सर्वनाम",
        options: ["संग्या", "सर्वनाम", "क्रिया", "विशेषण"],
        explanation: "जो शब्द संज्ञा के स्थान पर प्रयोग होता है, वह सर्वनाम कहलाता है।",
      },
      {
        prompt: "”सेना” शब्द किस प्रकार की संज्ञा है?",
        answer: "समूहवाचक संज्ञा",
        options: ["जातिवाचक संज्ञा", "द्रव्यवाचक संज्ञा", "समूहवाचक संज्ञा", "भाववाचक संज्ञा"],
        explanation: "‘सेना’ कई सैनिकों के समूह का बोध कराती है, इसलिए समूहवाचक संज्ञा है।",
      },
    ],
    "क्रिया और काल": [
      {
        prompt: "‘राम खाना खा रहा है।’ में कौन सा काल है?",
        answer: "वर्तमान काल",
        options: ["वर्तमान काल", "भूतकाल", "भविष्यत काल", "कोई काल नहीं"],
        explanation: "क्रिया अभी जारी है, इसलिए यह वर्तमान काल है।",
      },
      {
        prompt: "‘बच्चे कल खेलेंगे।’ में कौन सा काल है?",
        answer: "भविष्यत काल",
        options: ["भविष्यत काल", "वर्तमान काल", "भूतकाल", "आज्ञार्थक संकेत के बिना"],
        explanation: "काम आगे होगा, इसलिए यह भविष्यत काल है।",
      },
      {
        prompt: "‘मोहन सो गया।’ में कौन सा काल है?",
        answer: "भूतकाल",
        options: ["भूतकाल", "वर्तमान काल", "भविष्यत काल", "केवल विशेषण संकेत"],
        explanation: "काम पहले पूरा हो चुका है, इसलिए भूतकाल है।",
      },
    ],
    "संधि और समास": [
      {
        prompt: "‘विद्यालय’ का सही संधि विच्छेद क्या है?",
        answer: "विद्या + आलय",
        options: ["विद्या + आलय", "विद्य + लय", "वि + धालय", "विद्याई + लय"],
        explanation: "‘विद्या + आलय’ मिलकर ‘विद्यालय’ बनाते हैं।",
      },
      {
        prompt: "‘सज्जन’ में कौन सी संधि है?",
        answer: "व्यंजन संधि",
        options: ["दीर्घ स्वर संधि", "व्यंजन संधि", "विसर्ग संधि", "गुण संधि"],
        explanation: "‘सत् + जन’ के मेल से ‘सज्जन’ बनता है, इसलिए यह व्यंजन संधि है।",
      },
      {
        prompt: "‘राजपुत्र’ शब्द में कौन सा समास है?",
        answer: "तत्पुरुष समास",
        options: ["तत्पुरुष समास", "अव्ययीभाव समास", "द्वंद्व समास", "बहुब्रीहि समास"],
        explanation: "‘राजा का पुत्र’ भाव व्यक्त होने के कारण यह तत्पुरुष समास है।",
      },
    ],
    "कारक और विभक्ति": [
      {
        prompt: "‘राम ने पुस्तक दी।’ में ‘राम ने’ कौन सा कारक है?",
        answer: "कर्ता कारक",
        options: ["कर्ता कारक", "कर्म कारक", "करण कारक", "अधिकरण कारक"],
        explanation: "जो क्रिया करता है, वह कर्ता कारक होता है।",
      },
      {
        prompt: "‘कलम से पत्र लिखा गया।’ में ‘कलम से’ कौन सा कारक है?",
        answer: "करण कारक",
        options: ["करण कारक", "कर्ता कारक", "कर्म कारक", "संबोधन कारक"],
        explanation: "कार्य जिस साधन से होता है, वह करण कारक होता है।",
      },
      {
        prompt: "‘बच्चे को दूध दिया।’ में ‘बच्चे को’ कौन सा कारक है?",
        answer: "संप्रदान कारक",
        options: ["संप्रदान कारक", "अधिकरण कारक", "करण कारक", "सम्बन्ध कारक"],
        explanation: "जिसके लिए वस्तु दी जाती है, वह संप्रदान कारक होता है।",
      },
    ],
    "पर्यायवाची और विलोम शब्द": [
      {
        prompt: "‘सूर्य’ का पर्यायवाची शब्द क्या है?",
        answer: "रवि",
        options: ["रवि", "चन्द्र", "सागर", "वन"],
        explanation: "‘सूर्य’ के पर्यायवाची शब्दों में ‘रवि’, ‘भानु’ और ‘आदित्य’ आते हैं।",
      },
      {
        prompt: "‘कमल’ का सही पर्यायवाची कौन सा है?",
        answer: "पंकज",
        options: ["पंकज", "सूख", "विरोध", "अंधेरा"],
        explanation: "‘कमल’ को ‘पंकज’ भी कहा जाता है।",
      },
      {
        prompt: "‘सुख’ का विलोम शब्द क्या है?",
        answer: "दुःख",
        options: ["आनंद", "दुःख", "खुशी", "आश्चर्य"],
        explanation: "‘सुख’ का ठीक विलोम ‘दुःख’ है।",
      },
    ],
    "मुहावरे और लोकोक्तियाँ": [
      {
        prompt: "‘आँखों का तारा होना’ मुहावरे का अर्थ क्या है?",
        answer: "अत्यंत प्रिय होना",
        options: ["अत्यंत प्रिय होना", "डर लगना", "दूर चला जाना", "समय खराब करना"],
        explanation: "‘आँखों का तारा’ का अर्थ बहुत प्रिय या बहुत प्यारा व्यक्ति होता है।",
      },
      {
        prompt: "‘आसमान सिर पर उठाना’ का अर्थ क्या है?",
        answer: "बहुत ऊँचावान या घमंडी होना",
        options: ["बहुत ऊँचावान या घमंडी होना", "तेज दौड़ना", "पानी पिलाना", "आकाश गिनना"],
        explanation: "यह मुहावरा अत्यधिक घमंड या अत्यधिक आवाज उठाने के अर्थ में प्रयोग होता है।",
      },
      {
        prompt: "लोकोक्ति ‘अधजल गगरी छलकत जाए’ का मुख्य संकेत क्या है?",
        answer: "अधूरे ज्ञान वाला अत्यधिक बोलता है",
        options: [
          "पूर्ण ज्ञान हमेशा शांत होता है",
          "अधूरे ज्ञान वाला अत्यधिक बोलता है",
          "पानी बचाना आवश्यक है",
          "गगरी लोहे की होनी चाहिए",
        ],
        explanation: "अधजल गगरी अत्यधिक छलकती है, अर्थात आधा ज्ञान ज्यादा दिखावा करता है।",
      },
    ],
    "वाक्य शुद्धि": [
      {
        prompt: "इनमें से शुद्ध वाक्य कौन सा है?",
        answer: "मैं विद्यालय जाता हूँ।",
        options: [
          "मैं विद्यालय जाता हूँ।",
          "मैं विद्यालय जा रहे हैं।",
          "हम विद्यालय जाता है।",
          "वे विद्यालय जाता है।",
        ],
        explanation: "कर्ता और क्रिया में उचित अनुरूपता रखने वाला वाक्य पहला विकल्प है।",
      },
      {
        prompt: "सही लिंग-वचन वाला वाक्य कौन सा है?",
        answer: "मेरी किताब नई है।",
        options: [
          "मेरा किताब नई है।",
          "मेरी किताब नई है।",
          "वे किताब नया है।",
          "ये किताबें पुराना है।",
        ],
        explanation: "‘किताब’ स्त्रीलिंग है, इसलिए ‘मेरी’ और ‘नई’ प्रयोग उचित हैं।",
      },
      {
        prompt: "‘वह आता है।’ का सही बहुवचन रूप क्या है?",
        answer: "वे आते हैं।",
        options: ["वे आते हैं।", "वह आते हैं।", "वे आता है।", "वह आता हैं।"],
        explanation: "‘वे आते हैं।’ में कर्ता और क्रिया दोनों बहुवचन हैं।",
      },
    ],
  };

  const topicItems = questionsByTopic[topic];
  if (!topicItems || topicItems.length === 0) {
    return makeFallbackQuestion("Hindi Grammar", topic, topicLabel);
  }
  const item = pick(topicItems);
  return makeConceptQuestion(
    "Hindi Grammar",
    topicLabel,
    item.prompt,
    item.answer,
    item.options,
    item.explanation,
  );
}

function makePolityTopicQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic.toLowerCase().includes("preamble")) {
    const preambleQuestions = [
      {
        prompt:
          "Which Constitutional Amendment Act added the words 'Socialist', 'Secular' and 'Integrity' to the Preamble?",
        answer: "42nd Constitutional Amendment Act, 1976",
        options: [
          "42nd Constitutional Amendment Act, 1976",
          "44th Constitutional Amendment Act, 1978",
          "24th Constitutional Amendment Act, 1971",
          "86th Constitutional Amendment Act, 2002",
        ],
        explanation:
          "The 42nd Constitutional Amendment Act, 1976 added 'Socialist', 'Secular' and 'Integrity' to the Preamble of the Indian Constitution.",
      },
      {
        prompt: "Who called the Preamble the 'Identity Card of the Constitution'?",
        answer: "N. A. Palkhivala",
        options: ["N. A. Palkhivala", "Dr. B. R. Ambedkar", "K. M. Munshi", "Sir B. N. Rau"],
        explanation:
          "Eminent jurist N. A. Palkhivala described the Preamble as the 'Identity Card of the Constitution'.",
      },
      {
        prompt:
          "Which landmark Supreme Court judgment held that the Preamble is an integral part of the Constitution and subject to the Basic Structure doctrine?",
        answer: "Kesavananda Bharati v. State of Kerala (1973)",
        options: [
          "Kesavananda Bharati v. State of Kerala (1973)",
          "Berubari Union Case (1960)",
          "A. K. Gopalan Case (1950)",
          "Golaknath Case (1967)",
        ],
        explanation:
          "In Kesavananda Bharati (1973), the Supreme Court overruled Berubari Union (1960) and held that the Preamble is part of the Constitution.",
      },
    ];
    const item = pick(preambleQuestions);
    return makeConceptQuestion(
      "Polity",
      topicLabel,
      item.prompt,
      item.answer,
      item.options,
      item.explanation,
    );
  }
  if (topic === "Constitution Schedules" || topic === "Constitution Basics") {
    const schedules = [
      {
        clue: "official languages of India",
        answer: "Eighth Schedule",
        explanation:
          "The Eighth Schedule lists the constitutionally recognised languages of India.",
      },
      {
        clue: "anti-defection provisions",
        answer: "Tenth Schedule",
        explanation: "The Tenth Schedule contains anti-defection rules for legislators.",
      },
      {
        clue: "Panchayati Raj institutions",
        answer: "Eleventh Schedule",
        explanation: "The Eleventh Schedule lists subjects that may be devolved to Panchayats.",
      },
      {
        clue: "municipalities and urban local bodies",
        answer: "Twelfth Schedule",
        explanation:
          "The Twelfth Schedule covers functions of municipalities and urban local bodies.",
      },
    ];
    const item = pick(schedules);
    return makeConceptQuestion(
      "Polity",
      topicLabel,
      `Which Constitution Schedule is linked with ${item.clue}?`,
      item.answer,
      ["Eighth Schedule", "Tenth Schedule", "Eleventh Schedule", "Twelfth Schedule"],
      item.explanation,
    );
  }
  if (topic === "Judiciary") {
    return makeConceptQuestion(
      "Polity",
      topicLabel,
      "Which court entertains cases connected with federal disputes between states?",
      "Supreme Court of India",
      [
        "District Court",
        "Supreme Court of India",
        "High Court in every state",
        "Lok Sabha committee",
        "Election Tribunal only",
      ],
      "The Supreme Court has exclusive original jurisdiction in disputes between the Government of India and one or more states or between states inter se.",
    );
  }
  if (topic === "President and Governor") {
    return makeConceptQuestion(
      "Polity",
      topicLabel,
      "The Governor of a state is appointed by whom?",
      "President of India",
      [
        "Prime Minister only",
        "President of India",
        "State legislature",
        "Chief Justice",
        "Home Ministry",
      ],
      "Article 155 provides that every state shall have a Governor appointed by the President.",
    );
  }
  return makeFallbackQuestion("Polity", topic, topicLabel);
}

function makeSstTopicQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic.toLowerCase().includes("preamble")) {
    const preambleQuestions = [
      {
        prompt: "With which words does the Preamble to the Constitution of India begin?",
        answer: "We, the People of India",
        options: [
          "We, the People of India",
          "In the Name of Parliament",
          "By Order of the President",
          "We, the States of the Union",
        ],
        explanation:
          "The Preamble begins with 'We, the People of India', signifying that ultimate sovereignty rests with the citizens.",
      },
      {
        prompt:
          "The Preamble to the Indian Constitution is based on which historic resolution moved on 13 December 1946?",
        answer: "Objectives Resolution moved by Pandit Jawaharlal Nehru",
        options: [
          "Objectives Resolution moved by Pandit Jawaharlal Nehru",
          "Purna Swaraj Resolution moved by Mahatma Gandhi",
          "Drafting Resolution moved by Dr. B. R. Ambedkar",
          "Cabinet Mission Plan moved by Sardar Patel",
        ],
        explanation:
          "Jawaharlal Nehru moved the Objectives Resolution on 13 December 1946, which became the basis of the Preamble.",
      },
      {
        prompt:
          "Which words were added to the Preamble by the 42nd Constitutional Amendment Act, 1976?",
        answer: "Socialist, Secular and Integrity",
        options: [
          "Socialist, Secular and Integrity",
          "Liberty, Equality and Fraternity",
          "Sovereign, Democratic and Republic",
          "Social, Economic and Political Justice",
        ],
        explanation:
          "The 42nd Amendment Act of 1976 added the three words 'Socialist', 'Secular' and 'Integrity' to the Preamble.",
      },
    ];
    const item = pick(preambleQuestions);
    return makeConceptQuestion(
      "SST",
      topicLabel,
      item.prompt,
      item.answer,
      item.options,
      item.explanation,
    );
  }
  if (topic === "History" || topic === "Nationalism in India") {
    const historyQuestions = [
      {
        prompt: "Who founded the Mauryan Empire?",
        answer: "Chandragupta Maurya",
        options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Harshavardhana", "Akbar"],
        explanation:
          "Chandragupta Maurya founded the Mauryan Empire with the guidance of Chanakya/Kautilya.",
      },
      {
        prompt: "The Dandi March was connected with protest against which tax?",
        answer: "Salt tax",
        options: ["Land tax", "Salt tax", "Income tax", "Trade tax", "Vehicle tax"],
        explanation:
          "Mahatma Gandhi led the Dandi March in 1930 to protest against the British monopoly and salt tax.",
      },
      {
        prompt: "The Non-Cooperation Movement was launched in which early-1920s year?",
        answer: "1920",
        options: ["1920", "1928", "1935", "1942", "1947"],
        explanation:
          "The Non-Cooperation Movement began in 1920 and became a mass movement under Mahatma Gandhi.",
      },
    ];
    const item = pick(historyQuestions);
    return makeConceptQuestion(
      "SST",
      topicLabel,
      item.prompt,
      item.answer,
      item.options,
      item.explanation,
    );
  }
  if (topic === "Geography" || topic === "Resources and Development") {
    const geographyQuestions = [
      {
        prompt: "Which imaginary line is at 0° latitude?",
        answer: "Equator",
        options: ["Equator", "Prime Meridian", "Tropic of Cancer", "Arctic Circle", "Date Line"],
        explanation:
          "The Equator is the 0° latitude line and divides Earth into Northern and Southern Hemispheres.",
      },
      {
        prompt: "Which soil is most suitable for cotton cultivation in India?",
        answer: "Black soil",
        options: ["Alluvial soil", "Black soil", "Laterite soil", "Desert soil", "Mountain soil"],
        explanation:
          "Black/Regur soil retains moisture and is especially suitable for cotton cultivation in the Deccan region.",
      },
      {
        prompt: "Sustainable development mainly means",
        answer: "Meeting present needs without compromising future generations",
        options: [
          "Meeting present needs without compromising future generations",
          "Using all resources immediately",
          "Only industrial growth",
          "Only urban expansion",
          "Ignoring environmental limits",
        ],
        explanation:
          "Sustainable development balances present requirements with the ability of future generations to meet their own needs.",
      },
    ];
    const item = pick(geographyQuestions);
    return makeConceptQuestion(
      "SST",
      topicLabel,
      item.prompt,
      item.answer,
      item.options,
      item.explanation,
    );
  }
  if (topic === "Economics" || topic === "Money and Credit") {
    return makeConceptQuestion(
      "SST",
      topicLabel,
      "The principal function of money in an economy is",
      "Medium of exchange",
      ["Store of salt", "Medium of exchange", "Only ornament", "Only tax record", "Only bank note"],
      "Money works as a medium of exchange, a unit of account and a store of value.",
    );
  }
  if (topic === "Democracy and Diversity" || topic === "Civics") {
    return makeConceptQuestion(
      "SST",
      topicLabel,
      "The most important idea of democracy is",
      "Popular sovereignty and equal political participation",
      [
        "Only military might",
        "Popular sovereignty and equal political participation",
        "Private ownership only",
        "One-person permanent rule",
        "No elections",
      ],
      "Democracy centres on citizen participation, representation and accountability.",
    );
  }
  const economics = [
    {
      clue: "Per capita income",
      answer: "Average income",
      options: [
        "Average income",
        "Only farm output",
        "Total black money",
        "Foreign trade only",
        "Government debt",
      ],
      explanation:
        "Per capita income is total income divided by population; it indicates average income.",
    },
    {
      clue: "Inflation",
      answer: "Sustained rise in general price level",
      options: [
        "Fall in output",
        "Sustained rise in general price level",
        "Fall in taxes",
        "Monsoon reporting",
        "Bank holiday",
      ],
      explanation:
        "Inflation is a sustained rise in the general price level of goods and services over time.",
    },
    {
      clue: "GDP",
      answer: "Gross Domestic Product",
      options: [
        "Gross Domestic Product",
        "General Domestic Price",
        "General Development Plan",
        "Great Debt Product",
        "Global Deposit Pool",
      ],
      explanation: "GDP measures the value of final goods and services produced within a country.",
    },
  ];
  const item = pick(economics);
  return makeConceptQuestion(
    "SST",
    topicLabel,
    `What does ${item.clue} mean?`,
    item.answer,
    item.options,
    item.explanation,
  );
}

function makePunjabHistoryQuestion(topic: string, topicLabel: string): QuizQuestion {
  const map: Array<[string, string, string, string[], string]> = [
    [
      "Sikh Gurus",
      "Guru Nanak Dev Ji was the founder of",
      "Sikhism",
      ["Islam", "Sikhism", "Buddhism", "Jainism", "Christianity"],
      "Guru Nanak Dev Ji is regarded as the founder of Sikhism and the first Sikh Guru.",
    ],
    [
      "Maharaja Ranjit Singh",
      "Maharaja Ranjit Singh established his capital at",
      "Lahore",
      ["Amritsar", "Patiala", "Lahore", "Multan", "Jalandhar"],
      "Maharaja Ranjit Singh ruled the Sikh Empire with Lahore as his capital.",
    ],
    [
      "Anglo-Sikh Wars",
      "The Anglo-Sikh Wars brought which major result?",
      "Annexation of Punjab by the British",
      [
        "French trade monopoly",
        "Annexation of Punjab by the British",
        "Creation of Pakistan",
        "Delhi Sultanate revival",
        "Portuguese ports",
      ],
      "After the Anglo-Sikh Wars, Punjab came under British control.",
    ],
    [
      "Freedom Movement in Punjab",
      "The Jallianwala Bagh incident is associated with Punjab's freedom movement and occurred in",
      "1919",
      ["1857", "1919", "1930", "1942", "1947"],
      "The Jallianwala Bagh massacre took place on 13 April 1919 in Amritsar during the freedom movement.",
    ],
    [
      "Ghadar Movement",
      "The Ghadar Party was mainly linked with which revolutionary idea?",
      "Overthrow of British rule through armed struggle",
      [
        "Computer literacy",
        "Overthrow of British rule through armed struggle",
        "Only railway expansion",
        "Only agricultural credit",
        "Medical research",
      ],
      "The Ghadar Party aimed to organise armed resistance against British colonial rule.",
    ],
  ];
  const item = map.find(([name]) => name === topic);
  if (item) {
    const [, prompt, answer, options, explanation] = item;
    return makeConceptQuestion("Punjab History", topicLabel, prompt, answer, options, explanation);
  }
  return makeFallbackQuestion("Punjab History", topic, topicLabel);
}

function makePunjabGkQuestion(topic: string, topicLabel: string): QuizQuestion {
  const map: Array<[string, string, string, string[], string]> = [
    [
      "Districts and Headquarters",
      "Which city is the capital of Punjab?",
      "Chandigarh",
      ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
      "Chandigarh is the administrative capital; important district headquarters also include Amritsar, Jalandhar and Patiala.",
    ],
    [
      "Rivers and Canals",
      "Which river is most closely associated with Punjab's irrigation system?",
      "Sutlej",
      ["Godavari", "Sutlej", "Narmada", "Kaveri", "Yamuna only"],
      "The Sutlej is a major river system influencing Punjab's canal irrigation.",
    ],
    [
      "Folk Dances and Fairs",
      "Which folk form is widely associated with Punjab?",
      "Bhangra / Giddha",
      ["Bhangra / Giddha", "Only Kathakali", "Only Odissi", "Only Bharatnatyam", "Only Ramlila"],
      "Bhangra and Giddha are traditional Punjabi performance forms.",
    ],
    [
      "Sports and Awards",
      "Which sport is a strong traditional strength of Punjab?",
      "Hockey and kabaddi",
      ["Only cricket", "Hockey and kabaddi", "Only sailing", "Only archery", "Only water polo"],
      "Punjab has a strong sporting tradition in hockey, kabaddi and rural games.",
    ],
    [
      "Important Places",
      "The Golden Temple is located in",
      "Amritsar",
      ["Amritsar", "Delhi", "Ludhiana", "Chandigarh", "Patiala"],
      "The Golden Temple, or Harmandir Sahib, is in Amritsar and is the holiest Sikh shrine.",
    ],
  ];
  const item = map.find(([name]) => name === topic);
  if (item) {
    const [, prompt, answer, options, explanation] = item;
    return makeConceptQuestion("Punjab GK", topicLabel, prompt, answer, options, explanation);
  }
  return makeFallbackQuestion("Punjab GK", topic, topicLabel);
}

function makePunjabGeographyQuestion(topic: string, topicLabel: string): QuizQuestion {
  const map: Array<[string, string, string, string[], string]> = [
    [
      "Malwa Majha Doaba Regions",
      "Which is the correct group of Punjab's cultural-geographic zones?",
      "Malwa, Majha and Doaba",
      [
        "Malwa, Majha and Doaba",
        "Konkan and Malabar",
        "Deccan and Vidarbha",
        "Bundelkhand and Baghelkhand",
        "Tirhut and Saurashtra",
      ],
      "Punjab is commonly divided into Malwa, Majha and Doaba regions.",
    ],
    [
      "Rivers of Punjab",
      "The main rivers of Punjab include",
      "Sutlej, Beas and Ravi",
      [
        "Sutlej, Beas and Ravi",
        "Ganga and Yamuna only",
        "Narmada and Chambal",
        "Mahanadi and Godavari",
        "Brahmaputra and Teesta",
      ],
      "The major river system of Punjab consists of Sutlej, Beas and Ravi.",
    ],
    [
      "Canal Irrigation",
      "Which system supplies water for farming in Punjab?",
      "Canal irrigation network",
      [
        "Only borewells",
        "Canal irrigation network",
        "Only rainfall",
        "Only tank irrigation",
        "No irrigation",
      ],
      "Punjab uses an extensive canal system to support intensive farming.",
    ],
    [
      "Soils and Crops",
      "The main crops grown in Punjab are",
      "Wheat and rice",
      ["Wheat and rice", "Only rubber and coffee", "Only tea", "Only millets", "Only coconut"],
      "Punjab is a major producer of wheat and rice.",
    ],
    [
      "Climate",
      "Punjab lies in which climatic zone?",
      "Subtropical semi-arid steppe climate",
      [
        "Equatorial",
        "Subtropical semi-arid steppe climate",
        "Antarctic",
        "Mediterranean only",
        "Desert polar",
      ],
      "Punjab generally lies in a subtropical semi-arid climatic zone with pronounced seasons.",
    ],
    [
      "Borders and Neighbouring States",
      "Punjab shares its western border with",
      "Pakistan",
      ["China", "Pakistan", "Nepal", "Bangladesh", "Bhutan"],
      "Punjab shares its western border with Pakistan and connects with Himachal Pradesh, Jammu and Kashmir and Rajasthan.",
    ],
  ];
  const item = map.find(([name]) => name === topic);
  if (item) {
    const [, prompt, answer, options, explanation] = item;
    return makeConceptQuestion(
      "Punjab Geography",
      topicLabel,
      prompt,
      answer,
      options,
      explanation,
    );
  }
  return makeFallbackQuestion("Punjab Geography", topic, topicLabel);
}

function makePunjabEconomicsQuestion(topic: string, topicLabel: string): QuizQuestion {
  const map: Array<[string, string, string, string[], string]> = [
    [
      "Agriculture",
      "Punjab's economy is special because of its strong performance in",
      "Agriculture and allied activities",
      [
        "Agriculture and allied activities",
        "Only space research",
        "Only textiles",
        "Only software exports",
        "No farming",
      ],
      "Punjab's economy has a strong agricultural base and allied activities.",
    ],
    [
      "Green Revolution",
      "The Green Revolution in Punjab mainly increased production of",
      "Wheat and rice",
      [
        "Only tea and coffee",
        "Wheat and rice",
        "Oil seeds only",
        "Tropical fruits only",
        "Improved horses",
      ],
      "The Green Revolution raised wheat and rice output through improved seeds, irrigation, fertilisers and practices.",
    ],
    [
      "Industry and MSME",
      "Which sector is also important in Punjab besides agriculture?",
      "Small and medium industries / manufacturing",
      [
        "Only fishing",
        "Small and medium industries / manufacturing",
        "Only floriculture",
        "Gas stations",
        "No industry",
      ],
      "Punjab supports MSMEs, food processing, textiles, and manufacturing alongside farming.",
    ],
    [
      "Budget Basics",
      "A government budget mainly shows",
      "Estimated revenue and expenditure",
      [
        "Only party slogans",
        "Estimated revenue and expenditure",
        "Only railway timetables",
        "No policy",
        "Only weather forecast",
      ],
      "A budget is a statement of estimated revenue and expenditure for a fiscal period.",
    ],
    [
      "Employment",
      "Which problem is frequently linked with unemployment?",
      "Mismatch between skills and jobs",
      [
        "Too many farmers only",
        "Mismatch between skills and jobs",
        "No demand",
        "Only excess rain",
        "Too little education always",
      ],
      "Employment questions often test skill mismatch, job creation and labour-force issues.",
    ],
    [
      "Cooperative Sector",
      "The cooperative movement is mainly based on",
      "Collective ownership and mutual benefit",
      [
        "Total private monopoly",
        "Collective ownership and mutual benefit",
        "Individual secrecy only",
        "Tax evasion",
        "Only insurance",
      ],
      "Cooperatives are member-driven organisations for shared economic benefit.",
    ],
  ];
  const item = map.find(([name]) => name === topic);
  if (item) {
    const [, prompt, answer, options, explanation] = item;
    return makeConceptQuestion(
      "Punjab Economics",
      topicLabel,
      prompt,
      answer,
      options,
      explanation,
    );
  }
  return makeFallbackQuestion("Punjab Economics", topic, topicLabel);
}

type PunjabiQuestionTemplate = {
  prompt: string;
  answer: string;
  options: string[];
  explanation: string;
};

function makePunjabiConceptQuestion(
  subject: "Punjabi Paper A" | "Punjabi Grammar" | "Punjabi Literature",
  topic: string,
  topicLabel: string,
  known?: PunjabiQuestionTemplate,
): QuizQuestion {
  if (!known) return makeFallbackQuestion(subject, topic, topicLabel);
  return makeConceptQuestion(
    subject,
    topicLabel,
    known.prompt,
    known.answer,
    known.options,
    known.explanation,
  );
}

function makePunjabiPaperAQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic === "ਪਠਨ ਬੋਧ") {
    return makePunjabiConceptQuestion("Punjabi Paper A", topic, topicLabel, {
      prompt: "ਪਠਨ ਬੋਧ ਵਿੱਚ ਉੱਤਰ ਕਿਵੇਂ ਚੁਣੀਏ?",
      answer: "ਪੈਰਾਗ੍ਰਾਫ਼ ਦੇ ਸਬੂਤ ਨਾਲ ਮਿਲਾਣਾ",
      options: [
        "ਪੈਰਾਗ੍ਰਾਫ਼ ਦੇ ਸਬੂਤ ਨਾਲ ਮਿਲਾਣਾ",
        "ਸਿਰਫ਼ ਸਿਰਲੇਖ ਵੇਖਣਾ",
        "ਬਾਹਰੀ ਰਾਏ ਵਰਤਣਾ",
        "ਵਿਕਲਪ ਦੀ ਲੰਬਾਈ ਵੇਖਣਾ",
      ],
      explanation: "ਪਠਨ ਬੋਧ ਵਿੱਚ ਉੱਤਰ ਪੈਰਾਗ੍ਰਾਫ਼ ਦੀ ਜਾਣਕਾਰੀ ਨਾਲ ਮਿਲਾਣਾ ਮੁੱਖ ਨਿਯਮ ਹੈ।",
    });
  }
  if (topic === "ਸ਼ਬਦਾਵਲੀ") {
    return makePunjabiConceptQuestion("Punjabi Paper A", topic, topicLabel, {
      prompt: "‘ਦਿਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕੀ ਹੈ?",
      answer: "ਰਾਤ",
      options: ["ਰਾਤ", "ਸਵੇਰ", "ਉਪਰ", "ਨਦੀ"],
      explanation: "ਦਿਨ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਰਾਤ ਹੈ।",
    });
  }
  return makePunjabiConceptQuestion("Punjabi Paper A", topic, topicLabel);
}

function makePunjabiGrammarQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic === "ਨਾਵ ਅਤੇ ਪੜਨਾਵ") {
    return makePunjabiConceptQuestion("Punjabi Grammar", topic, topicLabel, {
      prompt: "‘ਮੈਂ’ ਸ਼ਬਦ ਕਿਹੜੀ ਪੱਟੀ ਹੈ?",
      answer: "ਪੜਨਾਵ",
      options: ["ਪੜਨਾਵ", "ਨਾਵ", "ਕਿਰਿਆ", "ਵਿਰਾਮ"],
      explanation: "ਜੋ ਸ਼ਬਦ ਨਾਵ ਦੀ ਥਾਂ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ, ਉਹ ਪੜਨਾਵ ਹੁੰਦਾ ਹੈ।",
    });
  }
  if (topic === "ਲਿੰਗ ਅਤੇ ਵਚਨ") {
    return makePunjabiConceptQuestion("Punjabi Grammar", topic, topicLabel, {
      prompt: "‘ਘੋੜਾ’ ਕਿਹੜੀ ਲਿੰਗ-ਵਚਨ ਹਾਲਤ ਹੈ?",
      answer: "ਪੁਲਿੰਗ ਇਕ ਵਚਨ",
      options: ["ਪੁਲਿੰਗ ਇਕ ਵਚਨ", "ਸਤ੍ਰੀਲਿੰਗ ਬਹੁਵਚਨ", "ਕੋਈ ਵਚਨ ਨਹੀਂ", "ਸਿਰਫ਼ ਕਿਰਿਆ"],
      explanation: "‘ਘੋੜਾ’ ਪੁਲਿੰਗ ਅਤੇ ਇਕ ਵਚਨ ਦੀ ਮਿਸਾਲ ਹੈ।",
    });
  }
  return makePunjabiConceptQuestion("Punjabi Grammar", topic, topicLabel);
}

function makePunjabiLiteratureQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic === "ਲੇਖਕ ਅਤੇ ਰਚਨਾਵਾਂ") {
    return makePunjabiConceptQuestion("Punjabi Literature", topic, topicLabel, {
      prompt: "‘ਪਿੰਜਰ’ ਰਚਨਾ ਕਿਹੜੀ ਲੇਖਿਕਾ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?",
      answer: "ਅਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ",
      options: ["ਅਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ", "ਪਤਰਕਾਰ", "ਕੋਈ ਔਰ", "ਸਿਰਫ਼ ਗਾਇਕ"],
      explanation: "ਪਿੰਜਰ ਅਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ ਦੀ ਮਹੱਤਵਪੂਰਣ ਰਚਨਾ ਹੈ।",
    });
  }
  if (topic === "ਸਾਹਿਤਕ ਅਲੰਕਾਰ") {
    return makePunjabiConceptQuestion("Punjabi Literature", topic, topicLabel, {
      prompt: "‘ਉਹ ਫੁੱਲ ਵਾਂਗ ਸੁੰਦਰ ਹੈ।’ ਵਿੱਚ ਕਿਹੜਾ ਅਲੰਕਾਰ ਹੈ?",
      answer: "ਉਪਮਾ",
      options: ["ਉਪਮਾ", "ਅਨੁਪਰਾਸ", "ਕੋਈ ਨਹੀਂ", "ਸਿਰਫ਼ ਰੀਮ"],
      explanation: "ਜਿੱਥੇ ਦੋ ਵਸਤੂਆਂ ਦੀ ਤੁਲਨਾ ਕੀਤੀ ਜਾਂਦੀ ਹੈ, ਉਹ ਉਪਮਾ ਅਲੰਕਾਰ ਹੈ।",
    });
  }
  return makePunjabiConceptQuestion("Punjabi Literature", topic, topicLabel);
}

function makeCommerceTopicQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (
    topic === "Accounting Equation" ||
    topic === "Journal Entries" ||
    topic === "Partnership Basics"
  ) {
    const banked = makeBankQuestion("Commerce", topic, topicLabel);
    if (banked) return banked;
  }
  if (topic === "Business Law" || topic === "Contracts") {
    return makeConceptQuestion(
      "Commerce",
      topicLabel,
      "A valid contract requires",
      "Offer, acceptance, lawful object, consideration and free consent",
      [
        "Only oral promise",
        "Offer, acceptance, lawful object, consideration and free consent",
        "Only friendship",
        "No capacity",
        "Only signature",
      ],
      "Contract law requires a combination of lawful essentials, not just a promise.",
    );
  }
  return makeFallbackQuestion("Commerce", topic, topicLabel);
}

function makeLawTopicQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic === "Constitutional Law") {
    const banked = makeBankQuestion("Law", topic, topicLabel);
    if (banked) return banked;
  }
  if (topic === "Torts" || topic === "Criminal Law Basics") {
    const banked = makeBankQuestion("Law", topic, topicLabel);
    if (banked) return banked;
  }
  return makeFallbackQuestion("Law", topic, topicLabel);
}

function makeReasoningQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic === "Series") {
    const start = randomInt(2, 12);
    const step = randomInt(2, 6);
    return makeNumericQuestion(
      topicLabel,
      `Continue the number series: ${start}, ${start + step}, ${start + 2 * step}, ?`,
      start + 3 * step,
      `The series increases by ${step} each time, so next term = ${start + 2 * step} + ${step} = ${start + 3 * step}.`,
      "Reasoning",
    );
  }
  if (topic === "Coding-Decoding") {
    const banked = makeBankQuestion("Reasoning", topic, topicLabel);
    if (banked) return banked;
  }
  if (topic === "Syllogism") {
    const banked = makeBankQuestion("Reasoning", topic, topicLabel);
    if (banked) return banked;
  }
  if (
    topic === "Blood Relation" ||
    topic === "Direction Sense" ||
    topic === "Seating Arrangement"
  ) {
    const banked = makeBankQuestion("Reasoning", topic, topicLabel);
    if (banked) return banked;
  }
  return makeFallbackQuestion("Reasoning", topic, topicLabel);
}

function makeTeachingAptitudeTopicQuestion(topic: string, topicLabel: string): QuizQuestion {
  if (topic === "Inclusive Education") {
    return makeConceptQuestion(
      "Teaching Aptitude",
      topicLabel,
      "Inclusive education mainly aims to",
      "Ensure equal learning access with support for every learner",
      [
        "Keep only toppers",
        "Ensure equal learning access with support for every learner",
        "Remove questions",
        "Only ranking",
        "Only homework",
      ],
      "Inclusive education ensures all learners, including those with diverse needs, participate with support.",
    );
  }
  if (topic === "Assessment") {
    return makeConceptQuestion(
      "Teaching Aptitude",
      topicLabel,
      "Assessment is most useful when it",
      "Monitors learning and guides improvement",
      [
        "Only punishes",
        "Monitors learning and guides improvement",
        "Ignores feedback",
        "Only inspects handwriting",
        "Only declares topper",
      ],
      "Assessment should support learning, not merely compare marks.",
    );
  }
  return makeFallbackQuestion("Teaching Aptitude", topic, topicLabel);
}

function makeTopicMathQuestion(
  topic: string,
  topicLabel: string,
  subject: Subject = "Math",
): QuizQuestion {
  if (topic === "Percentage") {
    const base = randomInt(120, 640, 20);
    const percent = pick([5, 10, 12, 15, 20, 25]);
    const answer = (base * percent) / 100;
    return makeNumericQuestion(
      topicLabel,
      `Find ${percent}% of ${base}.`,
      answer,
      `${percent}% = ${percent}/100. ${base} × ${percent}/100 = ${answer}.`,
      subject,
    );
  }
  if (topic === "Simple Interest") {
    const principal = randomInt(1200, 8400, 400);
    const rate = pick([4, 5, 6, 8, 10, 12]);
    const years = pick([1, 2, 3, 4]);
    const answer = (principal * rate * years) / 100;
    return makeNumericQuestion(
      topicLabel,
      `Calculate simple interest on ₹${principal} at ${rate}% per annum for ${years} years.`,
      answer,
      `SI = P×R×T/100 = ${principal}×${rate}×${years}/100 = ₹${answer}.`,
      subject,
    );
  }
  if (topic === "Ratio and Proportion") {
    const a = pick([3, 4, 5, 7, 8]);
    const b = pick([2, 5, 6, 9, 11]);
    const total = (a + b) * randomInt(4, 12);
    const answer = (total * a) / (a + b);
    return makeNumericQuestion(
      topicLabel,
      `Two quantities divide ₹${total} in the ratio ${a}:${b}. Find the first quantity.`,
      answer,
      `Total parts = ${a + b}. First share = ${total} × ${a}/${a + b} = ${answer}.`,
      subject,
    );
  }
  if (topic === "Profit and Loss") {
    const cost = randomInt(240, 1800, 40);
    const profit = pick([10, 15, 20, 25, 30]);
    const answer = cost + (cost * profit) / 100;
    return makeNumericQuestion(
      topicLabel,
      `An item costs ₹${cost}. What is the selling price at ${profit}% profit?`,
      answer,
      `Selling price = cost price + ${profit}% profit = ₹${cost} + ₹${(cost * profit) / 100} = ₹${answer}.`,
      subject,
    );
  }
  if (topic === "Time and Work") {
    const daysA = pick([4, 6, 8, 10, 12]);
    const daysB = pick([6, 8, 10, 12, 15]);
    const answer = Number((1 / (1 / daysA + 1 / daysB)).toFixed(1));
    return makeConceptQuestion(
      subject,
      topicLabel,
      `A completes work in ${daysA} days and B in ${daysB} days. Together they finish it in about`,
      `${answer} days`,
      [`${answer} days`, `${daysA + daysB} days`, `${daysA} days`, `${daysB} days`, "1 day"],
      `Together rate = 1/${daysA} + 1/${daysB}; total time is the reciprocal, about ${answer} days.`,
    );
  }
  if (topic === "Data Interpretation") {
    const banked = makeBankQuestion("Math", topic, topicLabel);
    if (banked) return banked;
    const boys = randomInt(120, 320, 20);
    const girls = randomInt(80, 280, 20);
    return makeNumericQuestion(
      topicLabel,
      `A school has ${boys} boys and ${girls} girls. How many students are there in total?`,
      boys + girls,
      `Total students = ${boys} + ${girls} = ${boys + girls}.`,
      subject,
    );
  }
  if (topic === "Simplification" || topic === "Number System" || topic === "Arithmetic") {
    const x = randomInt(6, 18);
    const y = randomInt(3, 12);
    const z = randomInt(4, 15);
    const answer = x * y + z;
    return makeNumericQuestion(
      topicLabel,
      `Evaluate ${x} × ${y} + ${z}.`,
      answer,
      `By BODMAS: ${x} × ${y} = ${x * y}; then add ${z}. Answer = ${answer}.`,
      subject,
    );
  }
  const speed = pick([30, 40, 50, 60, 75, 90]);
  const time = pick([2, 3, 4, 5]);
  const answer = speed * time;
  return makeNumericQuestion(
    topicLabel,
    `A vehicle travels at ${speed} km/h for ${time} hours. What distance does it cover?`,
    answer,
    `Distance = speed × time = ${speed} × ${time} = ${answer} km.`,
    subject,
  );
}

function makeConceptQuestion(
  subject: Subject,
  topic: string,
  prompt: string,
  answer: string,
  optionBank: string[],
  explanation: string,
): QuizQuestion {
  const uniqueDistractors = optionBank.filter(
    (option, index, array) => option !== answer && array.indexOf(option) === index,
  );
  const options = shuffle([answer, ...shuffle(uniqueDistractors).slice(0, 3)]);
  return {
    id: `auto-${subject}-${topic}-${createLocalId()}`,
    subject,
    topic,
    prompt,
    options,
    answerIndex: Math.max(
      0,
      options.findIndex((option) => option === answer),
    ),
    explanation,
  };
}

function makeMathQuestion(): QuizQuestion {
  const type = Math.floor(Math.random() * 6);
  if (type === 0) {
    const base = randomInt(80, 500, 10);
    const percent = [5, 10, 12, 15, 20, 25][randomInt(0, 5)] ?? 10;
    const answer = (base * percent) / 100;
    return makeNumericQuestion(
      "Percentage",
      `What is ${percent}% of ${base}?`,
      answer,
      `${percent}% means ${percent}/100. So ${percent}% of ${base} = ${base} × ${percent}/100 = ${answer}.`,
    );
  }
  if (type === 1) {
    const p = randomInt(1000, 9000, 500);
    const r = randomInt(4, 12);
    const t = randomInt(1, 4);
    const answer = (p * r * t) / 100;
    return makeNumericQuestion(
      "Simple Interest",
      `Find simple interest on ₹${p} at ${r}% per annum for ${t} years.`,
      answer,
      `Simple Interest = P × R × T / 100 = ${p} × ${r} × ${t} / 100 = ₹${answer}.`,
    );
  }
  if (type === 2) {
    const a = randomInt(12, 70);
    const b = randomInt(12, 70);
    const c = randomInt(12, 70);
    const answer = Math.round((a + b + c) / 3);
    return makeNumericQuestion(
      "Average",
      `The marks are ${a}, ${b} and ${c}. What is the nearest whole-number average?`,
      answer,
      `Average = sum of observations / number of observations = (${a}+${b}+${c})/3 = ${((a + b + c) / 3).toFixed(2)}, nearest whole number ${answer}.`,
    );
  }
  if (type === 3) {
    const speed = randomInt(30, 90, 5);
    const time = randomInt(2, 6);
    const answer = speed * time;
    return makeNumericQuestion(
      "Speed & Distance",
      `A vehicle travels at ${speed} km/h for ${time} hours. What distance does it cover?`,
      answer,
      `Distance = speed × time = ${speed} × ${time} = ${answer} km.`,
    );
  }
  if (type === 4) {
    const cp = randomInt(200, 1000, 50);
    const profitPercent = [10, 15, 20, 25, 30][randomInt(0, 4)] ?? 20;
    const answer = cp + (cp * profitPercent) / 100;
    return makeNumericQuestion(
      "Profit & Loss",
      `A book costs ₹${cp}. It is sold at ${profitPercent}% profit. What is the selling price?`,
      answer,
      `Selling price = Cost price + profit = ${cp} + ${profitPercent}% of ${cp} = ₹${answer}.`,
    );
  }
  const x = randomInt(3, 15);
  const y = randomInt(3, 15);
  const answer = x * y + x;
  return makeNumericQuestion(
    "Arithmetic",
    `Calculate: ${x} × ${y} + ${x}`,
    answer,
    `Use BODMAS: multiply first, ${x} × ${y} = ${x * y}. Then add ${x}. Answer = ${answer}.`,
  );
}

function makeNumericQuestion(
  topic: string,
  prompt: string,
  answer: number,
  explanation: string,
  subject: Subject = "Math",
): QuizQuestion {
  const options = shuffle([
    String(answer),
    String(Math.max(0, answer + randomInt(2, 12))),
    String(Math.max(0, answer - randomInt(2, 12))),
    String(answer + randomInt(13, 25)),
  ]);
  return {
    id: `auto-${subject}-${topic}-${createLocalId()}`,
    subject,
    topic,
    prompt,
    options,
    answerIndex: Math.max(
      0,
      options.findIndex((option) => option === String(answer)),
    ),
    explanation,
  };
}

function KittuCoin({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClass =
    size === "sm"
      ? "h-6 w-6 text-[8px]"
      : size === "lg"
        ? "h-16 w-16 text-lg"
        : "h-10 w-10 text-xs";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-grid shrink-0 rotate-3 place-items-center rounded-[35%] font-black text-white shadow-[0_0_20px_rgba(125,92,255,0.45),0_0_30px_rgba(56,232,255,0.22)]",
        sizeClass,
        className,
      )}
    >
      <span className="absolute inset-0 rounded-[35%] bg-[conic-gradient(from_180deg,#21115f,#7d5cff,#38e8ff,#9cff6e,#7d5cff,#21115f)]" />
      <span className="absolute inset-[9%] rounded-[32%] bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,#38e8ff_18%,#7d5cff_52%,#17133b_100%)] shadow-[inset_0_2px_7px_rgba(255,255,255,0.35),inset_0_-5px_10px_rgba(0,0,0,0.35)]" />
      <span className="absolute inset-[20%] rounded-full border border-white/35 bg-white/10" />
      <span className="relative -rotate-3 leading-none drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">
        K
      </span>
    </span>
  );
}

function KittuCoinStack() {
  return (
    <div className="relative h-24 w-24">
      <KittuCoin size="lg" className="absolute right-2 top-1 rotate-12" />
      <KittuCoin size="md" className="absolute bottom-3 left-1 -rotate-12" />
      <KittuCoin size="sm" className="absolute bottom-0 right-7 rotate-6" />
    </div>
  );
}

function normalizeLocalKittuState(
  value: unknown,
  currentWeekKey: string,
  todayKey: string,
): LocalKittuState {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const savedWeekKey = typeof row["weekKey"] === "string" ? row["weekKey"] : "";
  const vouchers = Math.max(0, Math.floor(Number(row["vouchers"] ?? 0) || 0));
  const voucherCodes = Array.isArray(row["voucherCodes"])
    ? row["voucherCodes"].slice(0, 10).map((item) => {
        const voucher = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          code: typeof voucher["code"] === "string" ? voucher["code"] : "KQ-LOCAL",
          created_at:
            typeof voucher["created_at"] === "string"
              ? voucher["created_at"]
              : new Date().toISOString(),
        };
      })
    : [];

  if (savedWeekKey !== currentWeekKey) {
    return {
      ...EMPTY_LOCAL_KITTU_STATE,
      weekKey: currentWeekKey,
      vouchers,
      voucherCodes,
    };
  }

  const dailyEarnDate = typeof row["dailyEarnDate"] === "string" ? row["dailyEarnDate"] : "";
  const dailyEarned = dailyEarnDate === todayKey ? Number(row["dailyEarned"] ?? 0) || 0 : 0;

  return {
    weekKey: currentWeekKey,
    balance: Math.max(0, roundKittu(Number(row["balance"] ?? 0) || 0)),
    weekEarned: Math.max(0, roundKittu(Number(row["weekEarned"] ?? 0) || 0)),
    dailyClaimDate: typeof row["dailyClaimDate"] === "string" ? row["dailyClaimDate"] : "",
    dailyEarnDate: todayKey,
    dailyEarned: Math.max(0, roundKittu(dailyEarned)),
    vouchers,
    voucherCodes,
    transactions: Array.isArray(row["transactions"])
      ? row["transactions"].slice(0, 30).map((item) => {
          const tx = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          return {
            id: typeof tx["id"] === "string" ? tx["id"] : createLocalId(),
            amount: roundKittu(Number(tx["amount"] ?? 0) || 0),
            source: typeof tx["source"] === "string" ? tx["source"] : "local",
            reason: typeof tx["reason"] === "string" ? tx["reason"] : "Kit 2 Coins quiz activity",
            created_at:
              typeof tx["created_at"] === "string" ? tx["created_at"] : new Date().toISOString(),
          };
        })
      : [],
  };
}

function resetForNewWeek(current: LocalKittuState, weekKey: string): LocalKittuState {
  return {
    ...EMPTY_LOCAL_KITTU_STATE,
    weekKey,
    vouchers: current.vouchers,
    voucherCodes: current.voucherCodes,
  };
}

function resetDailyIfNeeded(current: LocalKittuState, todayKey: string): LocalKittuState {
  if (current.dailyEarnDate === todayKey) return current;
  return { ...current, dailyEarnDate: todayKey, dailyEarned: 0 };
}

function getKittuWeek(date = new Date()) {
  // Kept under the old name so every call site stays valid, but the window
  // is the calendar month now: the cycle resets on the 1st and the balance
  // starts again from zero.
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  const year = Number(dateParts["year"]);
  const month = Number(dateParts["month"]);
  const startUtc = new Date(Date.UTC(year, month - 1, 1));
  const endUtc = new Date(Date.UTC(year, month, 1) - 1);

  return {
    key: `${dateParts["year"]}-${dateParts["month"]}`,
    todayKey: `${dateParts["year"]}-${dateParts["month"]}-${dateParts["day"]}`,
    label: startUtc.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      month: "long",
      year: "numeric",
    }),
    endsLabel: endUtc.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
    }),
  };
}

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function roundKittu(value: number) {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
}

function formatKittu(value: number) {
  return roundKittu(value).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/** Unbiased Fisher-Yates shuffle so the correct option is never position-biased. */
function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index] as T;
    copy[index] = copy[swapIndex] as T;
    copy[swapIndex] = current;
  }
  return copy;
}

function pick<T>(items: readonly T[]): T {
  const selected = items[Math.floor(Math.random() * items.length)] ?? items[0];
  if (selected === undefined) throw new Error("Cannot pick from an empty list.");
  return selected;
}

function randomInt(min: number, max: number, step = 1) {
  const count = Math.floor((max - min) / step) + 1;
  return min + Math.floor(Math.random() * count) * step;
}
