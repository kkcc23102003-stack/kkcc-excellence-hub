/**
 * Banking Awareness and Computer Awareness fact tables plus banking numericals.
 * These two sections decide the IBPS / SBI / RRB scorecard.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  fmtNum,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
  numericOptions,
  numericTemplate,
  round,
  rupee,
} from "./core";

const BANK = [
  "Banking",
  "UPSC/SSC/Bank",
  "SSC",
  "Railway",
  "UPSC CSE",
  "State PSC",
  "PPSC Punjab",
  "Punjab Clerk",
  "State Clerk",
];
const templates: Template[] = [];

function add(
  id: string,
  subject: string,
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
      subject,
      topic,
      difficulty,
      exams: BANK,
      rows,
      forward,
      reverse,
      explain,
    }),
    matchTemplate({ id, subject, topic, difficulty, exams: BANK, rows }),
    statementTemplate({ id, subject, topic, difficulty, exams: BANK, rows }),
    statementCountTemplate({ id, subject, topic, difficulty, exams: BANK, rows }),
  );
}

function seq(start: number, step: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => start + i * step);
}

/* ------------------------------------------------------ banking abbreviations */

add(
  "bank:abbr",
  "Banking Awareness",
  "Banking Abbreviations",
  "Easy",
  [
    { key: "RBI", value: "Reserve Bank of India" },
    { key: "NEFT", value: "National Electronic Funds Transfer" },
    { key: "RTGS", value: "Real Time Gross Settlement" },
    { key: "IMPS", value: "Immediate Payment Service" },
    { key: "UPI", value: "Unified Payments Interface" },
    { key: "IFSC", value: "Indian Financial System Code" },
    { key: "MICR", value: "Magnetic Ink Character Recognition" },
    { key: "KYC", value: "Know Your Customer" },
    { key: "NPA", value: "Non Performing Asset" },
    { key: "CRR", value: "Cash Reserve Ratio" },
    { key: "SLR", value: "Statutory Liquidity Ratio" },
    { key: "MCLR", value: "Marginal Cost of funds based Lending Rate" },
    { key: "CASA", value: "Current Account Savings Account" },
    { key: "NPCI", value: "National Payments Corporation of India" },
    { key: "NABARD", value: "National Bank for Agriculture and Rural Development" },
    { key: "SIDBI", value: "Small Industries Development Bank of India" },
    { key: "SEBI", value: "Securities and Exchange Board of India" },
    { key: "IRDAI", value: "Insurance Regulatory and Development Authority of India" },
    { key: "PFRDA", value: "Pension Fund Regulatory and Development Authority" },
    { key: "DICGC", value: "Deposit Insurance and Credit Guarantee Corporation" },
    { key: "ATM", value: "Automated Teller Machine" },
    { key: "CIBIL", value: "Credit Information Bureau India Limited" },
    { key: "EMI", value: "Equated Monthly Instalment" },
    { key: "FDI", value: "Foreign Direct Investment" },
    { key: "GST", value: "Goods and Services Tax" },
    { key: "PAN", value: "Permanent Account Number" },
    { key: "NRI", value: "Non Resident Indian" },
    { key: "BHIM", value: "Bharat Interface for Money" },
  ],
  "What is the full form of %s in banking?",
  "Which abbreviation stands for '%s'?",
  "%k stands for %v.",
);

/* -------------------------------------------------------------- banking terms */

add(
  "bank:terms",
  "Banking Awareness",
  "Banking Terms",
  "Moderate",
  [
    {
      key: "Repo Rate",
      value: "Rate at which the RBI lends money to commercial banks against securities",
    },
    {
      key: "Reverse Repo Rate",
      value: "Rate at which the RBI borrows money from commercial banks",
    },
    {
      key: "Cash Reserve Ratio",
      value: "Share of deposits banks must keep as cash reserves with the RBI",
    },
    {
      key: "Statutory Liquidity Ratio",
      value:
        "Share of deposits banks must keep in liquid assets such as gold and approved securities",
    },
    {
      key: "Bank Rate",
      value: "Rate at which the RBI lends long term funds to banks without collateral",
    },
    {
      key: "Non Performing Asset",
      value: "A loan on which interest or principal is overdue for more than 90 days",
    },
    {
      key: "Bancassurance",
      value: "Sale of insurance products through bank branches",
    },
    {
      key: "Cheque truncation",
      value: "Clearing a cheque using its electronic image instead of the physical instrument",
    },
    {
      key: "Priority Sector Lending",
      value: "Mandated bank lending to agriculture, MSME and weaker sections",
    },
    {
      key: "Open Market Operations",
      value: "RBI buying or selling government securities to manage liquidity",
    },
    {
      key: "Marginal Standing Facility",
      value: "Overnight window for banks to borrow from the RBI against SLR securities",
    },
    {
      key: "Core Banking Solution",
      value: "Networked system that lets a customer bank from any branch",
    },
  ],
  "In banking, what does '%s' mean?",
  undefined,
  "%k means: %v.",
);

/* ------------------------------------------------------------- banking firsts */

add(
  "bank:firsts",
  "Banking Awareness",
  "Banking History",
  "Difficult",
  [
    { key: "oldest bank in India still in operation", value: "State Bank of India" },
    { key: "first bank of purely Indian origin", value: "Punjab National Bank" },
    { key: "first Indian bank to open a branch outside India", value: "Bank of India" },
    { key: "central bank of India", value: "Reserve Bank of India" },
    { key: "regulator of the securities market in India", value: "SEBI" },
    { key: "regulator of the insurance sector in India", value: "IRDAI" },
    { key: "organisation that operates UPI and RuPay", value: "NPCI" },
    { key: "apex bank for agriculture and rural development", value: "NABARD" },
    { key: "bank that issues currency notes in India", value: "Reserve Bank of India" },
    { key: "authority that issues one rupee notes in India", value: "Ministry of Finance" },
  ],
  "Which institution is the %s?",
  undefined,
  "The %k is %v.",
);

/* ------------------------------------------------- computer awareness facts */

add(
  "comp:abbr",
  "Computer Awareness",
  "Computer Abbreviations",
  "Easy",
  [
    { key: "CPU", value: "Central Processing Unit" },
    { key: "RAM", value: "Random Access Memory" },
    { key: "ROM", value: "Read Only Memory" },
    { key: "HTTP", value: "HyperText Transfer Protocol" },
    { key: "HTML", value: "HyperText Markup Language" },
    { key: "URL", value: "Uniform Resource Locator" },
    { key: "USB", value: "Universal Serial Bus" },
    { key: "GUI", value: "Graphical User Interface" },
    { key: "LAN", value: "Local Area Network" },
    { key: "WAN", value: "Wide Area Network" },
    { key: "ISP", value: "Internet Service Provider" },
    { key: "PDF", value: "Portable Document Format" },
    { key: "SQL", value: "Structured Query Language" },
    { key: "OS", value: "Operating System" },
    { key: "BIOS", value: "Basic Input Output System" },
    { key: "IP", value: "Internet Protocol" },
    { key: "FTP", value: "File Transfer Protocol" },
    { key: "DNS", value: "Domain Name System" },
    { key: "VPN", value: "Virtual Private Network" },
    { key: "AI", value: "Artificial Intelligence" },
  ],
  "What is the full form of %s in computing?",
  "Which computing abbreviation stands for '%s'?",
  "%k stands for %v.",
);

add(
  "comp:concepts",
  "Computer Awareness",
  "Computer Fundamentals",
  "Moderate",
  [
    { key: "Volatile memory that loses data when power is off", value: "RAM" },
    { key: "Permanent memory that stores the boot firmware", value: "ROM" },
    { key: "Brain of the computer that executes instructions", value: "CPU" },
    { key: "Smallest unit of digital data", value: "Bit" },
    { key: "Group of eight bits", value: "Byte" },
    { key: "Software that manages hardware and other software", value: "Operating System" },
    { key: "Program that translates the whole source code at once", value: "Compiler" },
    { key: "Program that translates source code line by line", value: "Interpreter" },
    { key: "Malicious program that replicates itself", value: "Virus" },
    { key: "Security system that filters network traffic", value: "Firewall" },
    { key: "Unsolicited bulk email", value: "Spam" },
    { key: "Fraud that tricks users into revealing passwords", value: "Phishing" },
    { key: "Temporary high speed memory near the CPU", value: "Cache" },
    { key: "Device that connects a network to the internet", value: "Router" },
  ],
  "Which computing term is described as: %s?",
  undefined,
  "%v is defined as: %k.",
);

add(
  "comp:shortcut",
  "Computer Awareness",
  "Keyboard Shortcuts",
  "Easy",
  [
    { key: "Ctrl + C", value: "Copy the selection" },
    { key: "Ctrl + X", value: "Cut the selection" },
    { key: "Ctrl + V", value: "Paste from the clipboard" },
    { key: "Ctrl + Z", value: "Undo the last action" },
    { key: "Ctrl + Y", value: "Redo the last action" },
    { key: "Ctrl + A", value: "Select all" },
    { key: "Ctrl + S", value: "Save the document" },
    { key: "Ctrl + P", value: "Print the document" },
    { key: "Ctrl + F", value: "Find text" },
    { key: "Ctrl + N", value: "Open a new document" },
    { key: "Alt + F4", value: "Close the active window" },
    { key: "Ctrl + B", value: "Make the text bold" },
    { key: "Ctrl + I", value: "Make the text italic" },
    { key: "Ctrl + U", value: "Underline the text" },
  ],
  "What is the function of the shortcut %s?",
  "Which keyboard shortcut is used to %s?",
  "%k is used to %v.",
);

/* ------------------------------------------------------- banking numericals */

{
  const principals = seq(50000, 25000, 40);
  const rates = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12];
  const years = [1, 2, 3, 4, 5];
  templates.push(
    numericTemplate({
      id: "bank:num:fd",
      subject: "Banking Awareness",
      topic: "Banking Numericals",
      difficulty: "Moderate",
      exams: BANK,
      sizes: [principals.length, rates.length, years.length],
      build: ([i, j, k]) => {
        const p = principals[i as number] as number;
        const r = rates[j as number] as number;
        const t = years[k as number] as number;
        const maturity = round(p * (1 + r / 100) ** t);
        const simple = round(p + (p * r * t) / 100);
        const options = numericOptions(maturity, [simple, round(maturity - p), p], (v) => rupee(v));
        return {
          prompt: `A fixed deposit of ${rupee(p)} is made at ${fmtNum(r)}% per annum compounded annually for ${t} year${t === 1 ? "" : "s"}. What is the maturity amount?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Maturity = P(1 + R/100)^T = ${fmtNum(p)} x (1 + ${fmtNum(r)}/100)^${t} = ${fmtNum(maturity)}.`,
        };
      },
    }),
  );
}

{
  const deposits = seq(100000, 50000, 30);
  const crr = [3, 3.5, 4, 4.5, 5, 5.5, 6];
  const slr = [16, 17, 18, 18.5, 19, 20, 21];
  templates.push(
    numericTemplate({
      id: "bank:num:crr-slr",
      subject: "Banking Awareness",
      topic: "Banking Numericals",
      difficulty: "Difficult",
      exams: BANK,
      sizes: [deposits.length, crr.length, slr.length],
      build: ([i, j, k]) => {
        const d = deposits[i as number] as number;
        const c = crr[j as number] as number;
        const s = slr[k as number] as number;
        const lendable = round(d * (1 - (c + s) / 100));
        const options = numericOptions(
          lendable,
          [round(d * (1 - c / 100)), round(d * ((c + s) / 100)), d],
          (v) => rupee(v),
        );
        return {
          prompt: `A bank has deposits of ${rupee(d)}. If the CRR is ${fmtNum(c)}% and the SLR is ${fmtNum(s)}%, how much can the bank lend out?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `CRR + SLR = ${fmtNum(c + s)}% is locked away. Lendable funds = ${fmtNum(d)} x (100 - ${fmtNum(c + s)})/100 = ${fmtNum(lendable)}.`,
        };
      },
    }),
  );
}

export const BANKING_TEMPLATES = templates;
