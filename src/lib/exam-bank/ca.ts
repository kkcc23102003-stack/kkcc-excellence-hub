/**
 * CA Foundation and CA Intermediate templates — Accounting, Business Law,
 * Economics, Cost Accounting and Taxation.
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
  pct,
  round,
  rupee,
} from "./core";

const CA = [
  "CA Foundation",
  "CA Intermediate",
  "CS Foundation",
  "CS Executive",
  "CMA Foundation",
  "CMA Intermediate",
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
    ...factTemplate({ id, subject, topic, difficulty, exams: CA, rows, forward, reverse, explain }),
    matchTemplate({ id, subject, topic, difficulty, exams: CA, rows }),
    statementTemplate({ id, subject, topic, difficulty, exams: CA, rows }),
    statementCountTemplate({ id, subject, topic, difficulty, exams: CA, rows }),
  );
}

function seq(start: number, step: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => start + i * step);
}

/* ------------------------------------------------------------- accounting */

add(
  "ca:acc:concepts",
  "Accounting",
  "Accounting Principles",
  "Easy",
  [
    {
      key: "Going Concern",
      value: "The business is assumed to continue operating for the foreseeable future",
    },
    {
      key: "Money Measurement",
      value: "Only transactions measurable in money terms are recorded",
    },
    {
      key: "Business Entity",
      value: "The business is treated as separate from its owners",
    },
    {
      key: "Dual Aspect",
      value: "Every transaction has two effects, giving Assets = Liabilities + Capital",
    },
    {
      key: "Conservatism or Prudence",
      value: "Anticipate no profit but provide for all possible losses",
    },
    {
      key: "Matching",
      value: "Expenses are matched with the revenues of the same accounting period",
    },
    {
      key: "Consistency",
      value: "The same accounting methods are followed from period to period",
    },
    {
      key: "Accrual",
      value:
        "Revenue and expenses are recorded when they are earned or incurred, not when cash moves",
    },
    {
      key: "Cost Concept",
      value: "Assets are recorded at their original acquisition cost",
    },
    {
      key: "Realisation",
      value: "Revenue is recognised when the sale is complete, not when the order is received",
    },
  ],
  "Which accounting concept states: %s?",
  undefined,
  "The %k concept means: %v.",
);

add(
  "ca:acc:golden",
  "Accounting",
  "Journal Entries",
  "Easy",
  [
    { key: "Personal Account", value: "Debit the receiver, credit the giver" },
    { key: "Real Account", value: "Debit what comes in, credit what goes out" },
    {
      key: "Nominal Account",
      value: "Debit all expenses and losses, credit all incomes and gains",
    },
    // Only three golden rules exist, so the chapter was thin. These are the
    // entry rules a journal actually turns on, which keeps the chapter at a
    // usable size without inventing a fourth golden rule.
    { key: "Purchase of goods for cash", value: "Debit Purchases Account, credit Cash Account" },
    { key: "Sale of goods on credit", value: "Debit the customer's account, credit Sales Account" },
    { key: "Cash brought in by the owner", value: "Debit Cash Account, credit Capital Account" },
    {
      key: "Cash withdrawn by the owner for personal use",
      value: "Debit Drawings Account, credit Cash Account",
    },
    { key: "Rent paid", value: "Debit Rent Account, credit Cash or Bank Account" },
    {
      key: "Commission received",
      value: "Debit Cash or Bank Account, credit Commission Received Account",
    },
    {
      key: "Goods returned by a customer",
      value: "Debit Sales Return Account, credit the customer's account",
    },
    {
      key: "Goods returned to a supplier",
      value: "Debit the supplier's account, credit Purchase Return Account",
    },
    { key: "Bad debt written off", value: "Debit Bad Debts Account, credit the debtor's account" },
    {
      key: "Depreciation charged on an asset",
      value: "Debit Depreciation Account, credit the asset account",
    },
    {
      key: "Machinery bought on credit from a supplier",
      value: "Debit Machinery Account, credit the supplier's account",
    },
  ],
  "What is the journal rule for a %s?",
  "Which type of account follows the rule: %s?",
  "For a %k the rule is: %v.",
);

add(
  "ca:acc:classify",
  "Accounting",
  "Classification of Accounts",
  "Moderate",
  [
    { key: "Salary Account", value: "Nominal Account" },
    { key: "Rent Received Account", value: "Nominal Account" },
    { key: "Machinery Account", value: "Real Account" },
    { key: "Cash Account", value: "Real Account" },
    { key: "Goodwill Account", value: "Real Account" },
    { key: "Capital Account", value: "Personal Account" },
    { key: "Drawings Account", value: "Personal Account" },
    { key: "Bank Account", value: "Personal Account" },
    { key: "Outstanding Salary Account", value: "Personal Account" },
    { key: "Discount Allowed Account", value: "Nominal Account" },
  ],
  "How is the %s classified under the traditional approach?",
  undefined,
  "%k is a %v.",
);

{
  const costs = seq(50000, 10000, 40);
  const scraps = seq(2000, 1000, 15);
  const lives = seq(4, 1, 12);
  templates.push(
    numericTemplate({
      id: "ca:acc:slm",
      subject: "Accounting",
      topic: "Depreciation",
      difficulty: "Easy",
      exams: CA,
      sizes: [costs.length, scraps.length, lives.length],
      build: ([i, j, k]) => {
        const cost = costs[i as number] as number;
        const scrap = scraps[j as number] as number;
        const life = lives[k as number] as number;
        if (scrap >= cost) return null;
        const dep = round((cost - scrap) / life);
        const options = numericOptions(
          dep,
          [round(cost / life), round((cost + scrap) / life), round(dep * 2)],
          (v) => rupee(v),
        );
        return {
          prompt: `An asset costing ${rupee(cost)} has a scrap value of ${rupee(scrap)} and a useful life of ${life} years. Find the annual depreciation under the straight line method.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Depreciation = (Cost - Scrap value)/Useful life = (${fmtNum(cost)} - ${fmtNum(scrap)})/${life} = ${fmtNum(dep)} per year.`,
        };
      },
    }),
  );
}

{
  const costs = seq(80000, 20000, 25);
  const rates = [5, 10, 12.5, 15, 20, 25];
  const years = [2, 3];
  templates.push(
    numericTemplate({
      id: "ca:acc:wdv",
      subject: "Accounting",
      topic: "Depreciation",
      difficulty: "Difficult",
      exams: CA,
      sizes: [costs.length, rates.length, years.length],
      build: ([i, j, k]) => {
        const cost = costs[i as number] as number;
        const rate = rates[j as number] as number;
        const years2 = years[k as number] as number;
        const wdv = round(cost * (1 - rate / 100) ** years2);
        const slm = round(cost - (cost * rate * years2) / 100);
        const options = numericOptions(wdv, [slm, round(cost - wdv), cost], (v) => rupee(v));
        return {
          prompt: `An asset costing ${rupee(cost)} is depreciated at ${pct(rate)} per annum on the written down value method. What is its book value at the end of ${years2} years?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `WDV = Cost x (1 - rate)^n = ${fmtNum(cost)} x (1 - ${fmtNum(rate)}/100)^${years2} = ${fmtNum(wdv)}. Under SLM it would instead be ${fmtNum(slm)}.`,
        };
      },
    }),
  );
}

{
  const ca = seq(40000, 10000, 30);
  const cl = seq(20000, 5000, 20);
  templates.push(
    numericTemplate({
      id: "ca:acc:ratio",
      subject: "Accounting",
      topic: "Ratio Analysis",
      difficulty: "Moderate",
      exams: CA,
      sizes: [ca.length, cl.length],
      build: ([i, j]) => {
        const assets = ca[i as number] as number;
        const liabilities = cl[j as number] as number;
        const ratioValue = round(assets / liabilities, 2);
        const options = numericOptions(
          ratioValue,
          [round(liabilities / assets, 2), round(assets / (assets + liabilities), 2)],
          (v) => `${fmtNum(v, 2)} : 1`,
        );
        return {
          prompt: `A firm has current assets of ${rupee(assets)} and current liabilities of ${rupee(liabilities)}. What is its current ratio?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Current ratio = Current assets / Current liabilities = ${fmtNum(assets)}/${fmtNum(liabilities)} = ${fmtNum(ratioValue, 2)} : 1. The ideal benchmark is 2 : 1.`,
        };
      },
    }),
  );
}

/* ------------------------------------------------------------ business law */

add(
  "ca:law:contract",
  "Business Law",
  "Indian Contract Act 1872",
  "Moderate",
  [
    { key: "Section 2(a)", value: "Definition of a proposal or offer" },
    { key: "Section 2(b)", value: "Definition of acceptance and promise" },
    { key: "Section 2(d)", value: "Definition of consideration" },
    { key: "Section 2(e)", value: "Definition of an agreement" },
    { key: "Section 2(h)", value: "Definition of a contract as an agreement enforceable by law" },
    { key: "Section 10", value: "What agreements are contracts" },
    { key: "Section 11", value: "Who is competent to contract" },
    { key: "Section 14", value: "Definition of free consent" },
    { key: "Section 15", value: "Definition of coercion" },
    { key: "Section 16", value: "Definition of undue influence" },
    { key: "Section 17", value: "Definition of fraud" },
    { key: "Section 18", value: "Definition of misrepresentation" },
    { key: "Section 23", value: "Lawful consideration and lawful object" },
    { key: "Section 56", value: "Agreement to do an impossible act, doctrine of frustration" },
    { key: "Section 73", value: "Compensation for loss caused by breach of contract" },
  ],
  "Which provision of the Indian Contract Act 1872 is contained in %s?",
  "Which section of the Indian Contract Act 1872 deals with the %s?",
  "%k of the Indian Contract Act 1872 deals with %v.",
);

add(
  "ca:law:terms",
  "Business Law",
  "Legal Terms",
  "Moderate",
  [
    { key: "Void agreement", value: "An agreement not enforceable by law from the very beginning" },
    {
      key: "Voidable contract",
      value: "A contract enforceable at the option of the aggrieved party",
    },
    {
      key: "Quasi contract",
      value: "An obligation imposed by law without any agreement between parties",
    },
    {
      key: "Contingent contract",
      value: "A contract to do something if an uncertain future event happens",
    },
    {
      key: "Wagering agreement",
      value: "An agreement based on an uncertain event where parties only gain or lose",
    },
    { key: "Consideration", value: "Something in return, the price for the promise" },
    { key: "Novation", value: "Substitution of a new contract in place of an existing one" },
    { key: "Caveat emptor", value: "Let the buyer beware" },
    {
      key: "Bailment",
      value: "Delivery of goods for a purpose on the condition that they be returned",
    },
    { key: "Pledge", value: "Bailment of goods as security for payment of a debt" },
    {
      key: "Indemnity",
      value: "A promise to save another from loss caused by the promisor or a third party",
    },
    {
      key: "Guarantee",
      value: "A promise to discharge the liability of a third person in case of default",
    },
  ],
  "In business law, what does '%s' mean?",
  "Which legal term is described as: %s?",
  "%k means: %v.",
);

/* -------------------------------------------------------------- economics */

add(
  "ca:eco:concepts",
  "Business Economics",
  "Microeconomics",
  "Moderate",
  [
    { key: "Law of Demand", value: "Other things equal, quantity demanded falls as price rises" },
    { key: "Law of Supply", value: "Other things equal, quantity supplied rises as price rises" },
    { key: "Giffen goods", value: "Inferior goods whose demand rises when their price rises" },
    { key: "Veblen goods", value: "Luxury goods whose demand rises with price due to prestige" },
    { key: "Perfectly elastic demand", value: "Elasticity of demand is infinity" },
    { key: "Perfectly inelastic demand", value: "Elasticity of demand is zero" },
    { key: "Unitary elastic demand", value: "Elasticity of demand equals one" },
    { key: "Opportunity cost", value: "Value of the next best alternative forgone" },
    { key: "Monopoly", value: "A market with a single seller and no close substitutes" },
    { key: "Oligopoly", value: "A market dominated by a few large sellers" },
    { key: "Perfect competition", value: "Many buyers and sellers with a homogeneous product" },
    { key: "Monopolistic competition", value: "Many sellers offering differentiated products" },
  ],
  "Which economic concept is described as: %s?",
  undefined,
  "%k: %v.",
);

{
  const oldQ = seq(100, 20, 25);
  const pctQ = [5, 10, 15, 20, 25, 30, 40, 50];
  const pctP = [5, 10, 15, 20, 25];
  templates.push(
    numericTemplate({
      id: "ca:eco:elasticity",
      subject: "Business Economics",
      topic: "Elasticity of Demand",
      difficulty: "Difficult",
      exams: CA,
      sizes: [oldQ.length, pctQ.length, pctP.length],
      build: ([i, j, k]) => {
        const q = oldQ[i as number] as number;
        const dq = pctQ[j as number] as number;
        const dp = pctP[k as number] as number;
        const e = round(dq / dp, 3);
        const nature = e > 1 ? "elastic" : e < 1 ? "inelastic" : "unitary elastic";
        const options = numericOptions(
          e,
          [round(dp / dq, 3), round(dq * dp, 3), round(e / 2, 3)],
          (v) => fmtNum(v, 3),
        );
        return {
          prompt: `When the price of a good falls by ${pct(dp)}, the quantity demanded rises by ${pct(dq)} from ${q} units. What is the price elasticity of demand (in absolute terms)?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Ed = % change in quantity / % change in price = ${fmtNum(dq)}/${fmtNum(dp)} = ${fmtNum(e, 3)}. Demand is therefore ${nature}.`,
        };
      },
    }),
  );
}

/* --------------------------------------------------------- cost accounting */

{
  const fixed = seq(20000, 10000, 30);
  const sp = seq(50, 10, 20);
  const vc = seq(20, 5, 12);
  templates.push(
    numericTemplate({
      id: "ca:cost:bep",
      subject: "Cost Accounting",
      topic: "Marginal Costing",
      difficulty: "Moderate",
      exams: CA,
      sizes: [fixed.length, sp.length, vc.length],
      build: ([i, j, k]) => {
        const f = fixed[i as number] as number;
        const s = sp[j as number] as number;
        const v = vc[k as number] as number;
        if (v >= s) return null;
        const contribution = s - v;
        const bep = round(f / contribution, 2);
        const options = numericOptions(
          bep,
          [round(f / s, 2), round(f / v, 2), round(bep * 2, 2)],
          (x) => `${fmtNum(x, 2)} units`,
        );
        return {
          prompt: `Fixed costs are ${rupee(f)}, the selling price is ${rupee(s)} per unit and the variable cost is ${rupee(v)} per unit. Find the break even point in units.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Contribution per unit = ${fmtNum(s)} - ${fmtNum(v)} = ${fmtNum(contribution)}. BEP (units) = Fixed cost / contribution = ${fmtNum(f)}/${fmtNum(contribution)} = ${fmtNum(bep, 2)} units.`,
        };
      },
    }),
  );
}

{
  const annual = seq(2400, 600, 25);
  const ordering = seq(50, 25, 12);
  const carrying = seq(2, 1, 10);
  templates.push(
    numericTemplate({
      id: "ca:cost:eoq",
      subject: "Cost Accounting",
      topic: "Material Costing",
      difficulty: "Difficult",
      exams: CA,
      sizes: [annual.length, ordering.length, carrying.length],
      build: ([i, j, k]) => {
        const a = annual[i as number] as number;
        const o = ordering[j as number] as number;
        const c = carrying[k as number] as number;
        const eoq = round(Math.sqrt((2 * a * o) / c), 2);
        const options = numericOptions(
          eoq,
          [round((2 * a * o) / c, 2), round(Math.sqrt((a * o) / c), 2), round(eoq / 2, 2)],
          (v) => `${fmtNum(v, 2)} units`,
        );
        return {
          prompt: `Annual requirement is ${fmtNum(a)} units, the ordering cost is ${rupee(o)} per order and the carrying cost is ${rupee(c)} per unit per year. Calculate the Economic Order Quantity.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `EOQ = sqrt(2AO/C) = sqrt(2 x ${fmtNum(a)} x ${fmtNum(o)} / ${fmtNum(c)}) = ${fmtNum(eoq, 2)} units.`,
        };
      },
    }),
  );
}

{
  const sales = seq(100000, 50000, 25);
  const variable = [40, 45, 50, 55, 60, 65, 70];
  templates.push(
    numericTemplate({
      id: "ca:cost:pv",
      subject: "Cost Accounting",
      topic: "Marginal Costing",
      difficulty: "Moderate",
      exams: CA,
      sizes: [sales.length, variable.length],
      build: ([i, j]) => {
        const s = sales[i as number] as number;
        const vPct = variable[j as number] as number;
        const pv = 100 - vPct;
        const contribution = round((s * pv) / 100);
        const options = numericOptions(pv, [vPct, round(pv / 2), round(100 - pv / 2)], (v) =>
          pct(v),
        );
        return {
          prompt: `Sales are ${rupee(s)} and the variable cost is ${pct(vPct)} of sales. What is the Profit Volume (P/V) ratio?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Contribution = Sales - Variable cost = ${fmtNum(s)} - ${fmtNum(s - contribution)} = ${fmtNum(contribution)}. P/V ratio = contribution/sales x 100 = ${fmtNum(pv)}%.`,
        };
      },
    }),
  );
}

/* --------------------------------------------------------------- taxation */

add(
  "ca:tax:gst",
  "Taxation",
  "Goods and Services Tax",
  "Moderate",
  [
    {
      key: "CGST",
      value: "Central Goods and Services Tax levied by the Centre on intra state supply",
    },
    {
      key: "SGST",
      value: "State Goods and Services Tax levied by the State on intra state supply",
    },
    { key: "IGST", value: "Integrated GST levied by the Centre on inter state supply" },
    { key: "UTGST", value: "Union Territory GST levied on supplies within a Union Territory" },
    {
      key: "Input Tax Credit",
      value: "Credit of GST paid on inputs used against output tax liability",
    },
    {
      key: "Composition Scheme",
      value: "Simplified scheme allowing small dealers to pay tax at a flat rate on turnover",
    },
    {
      key: "Reverse Charge Mechanism",
      value: "Liability to pay GST shifts from the supplier to the recipient",
    },
    { key: "GSTIN", value: "15 digit Goods and Services Tax Identification Number" },
    { key: "Exempt supply", value: "Supply attracting nil rate or wholly exempt from tax" },
    {
      key: "Zero rated supply",
      value: "Exports and supplies to SEZ which carry a zero rate with credit",
    },
  ],
  "Under GST law, what does '%s' mean?",
  "Which GST term is described as: %s?",
  "%k means: %v.",
);

{
  const values = seq(10000, 5000, 30);
  const rates = [5, 12, 18, 28];
  templates.push(
    numericTemplate({
      id: "ca:tax:gst-calc",
      subject: "Taxation",
      topic: "GST Computation",
      difficulty: "Easy",
      exams: CA,
      sizes: [values.length, rates.length, 2],
      build: ([i, j, k]) => {
        const value = values[i as number] as number;
        const rate = rates[j as number] as number;
        const intra = k === 0;
        const gst = round((value * rate) / 100);
        const half = round(gst / 2);
        const answerValue = intra ? half : gst;
        const options = numericOptions(
          answerValue,
          [intra ? gst : half, round(value + gst), round(gst * 2)],
          (v) => rupee(v),
        );
        return {
          prompt: intra
            ? `Goods worth ${rupee(value)} are supplied within the same state at a GST rate of ${pct(rate)}. What is the amount of CGST payable?`
            : `Goods worth ${rupee(value)} are supplied from one state to another at a GST rate of ${pct(rate)}. What is the amount of IGST payable?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: intra
            ? `Total GST = ${fmtNum(value)} x ${fmtNum(rate)}/100 = ${fmtNum(gst)}. For an intra state supply this splits equally into CGST and SGST, so CGST = ${fmtNum(half)}.`
            : `For an inter state supply the whole tax is IGST = ${fmtNum(value)} x ${fmtNum(rate)}/100 = ${fmtNum(gst)}.`,
        };
      },
    }),
  );
}

export const CA_TEMPLATES = templates;

/* ------------------------------------------- professional level (advanced)
 *
 * CA Final, CS Professional and CMA Final sit a level above the papers above.
 * The chapters below carry the reporting, audit, financial management and
 * advanced tax content that those three exams share, so they are tagged only
 * to the final-level tracks and never leak into a Foundation paper.
 */

const PRO = ["CA Final", "CS Professional", "CMA Final"];

function addPro(
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
      exams: PRO,
      rows,
      forward,
      reverse,
      explain,
    }),
    matchTemplate({ id, subject, topic, difficulty, exams: PRO, rows }),
    statementTemplate({ id, subject, topic, difficulty, exams: PRO, rows }),
    statementCountTemplate({ id, subject, topic, difficulty, exams: PRO, rows }),
  );
}

addPro(
  "ca:pro:indas",
  "Financial Reporting",
  "Indian Accounting Standards",
  "Difficult",
  [
    { key: "Ind AS 1", value: "Presentation of Financial Statements" },
    { key: "Ind AS 2", value: "Inventories" },
    { key: "Ind AS 7", value: "Statement of Cash Flows" },
    { key: "Ind AS 12", value: "Income Taxes" },
    { key: "Ind AS 16", value: "Property, Plant and Equipment" },
    { key: "Ind AS 19", value: "Employee Benefits" },
    { key: "Ind AS 36", value: "Impairment of Assets" },
    { key: "Ind AS 37", value: "Provisions, Contingent Liabilities and Contingent Assets" },
    { key: "Ind AS 38", value: "Intangible Assets" },
    { key: "Ind AS 103", value: "Business Combinations" },
    { key: "Ind AS 109", value: "Financial Instruments" },
    { key: "Ind AS 115", value: "Revenue from Contracts with Customers" },
  ],
  "Which Indian Accounting Standard is numbered %s?",
  "Which standard number deals with %s?",
  "%k is the Indian Accounting Standard on %v.",
);

addPro(
  "ca:pro:audit",
  "Advanced Auditing",
  "Standards on Auditing",
  "Difficult",
  [
    { key: "SA 200", value: "Overall objectives of the independent auditor" },
    { key: "SA 230", value: "Audit documentation" },
    { key: "SA 240", value: "The auditor's responsibilities relating to fraud" },
    { key: "SA 250", value: "Consideration of laws and regulations in an audit" },
    { key: "SA 315", value: "Identifying and assessing the risks of material misstatement" },
    { key: "SA 320", value: "Materiality in planning and performing an audit" },
    { key: "SA 500", value: "Audit evidence" },
    { key: "SA 530", value: "Audit sampling" },
    { key: "SA 560", value: "Subsequent events" },
    { key: "SA 570", value: "Going concern" },
    { key: "SA 700", value: "Forming an opinion and reporting on financial statements" },
    { key: "SA 705", value: "Modifications to the opinion in the auditor's report" },
  ],
  "Which Standard on Auditing is numbered %s?",
  "Which Standard on Auditing covers %s?",
  "%k is the Standard on Auditing dealing with %v.",
);

addPro(
  "ca:pro:sfm",
  "Strategic Financial Management",
  "Valuation and Risk",
  "Difficult",
  [
    { key: "Beta", value: "A measure of a security's systematic risk relative to the market" },
    { key: "CAPM", value: "Expected return equals risk free rate plus beta times market premium" },
    { key: "WACC", value: "The weighted average cost of equity and debt after tax" },
    { key: "NPV", value: "Present value of cash inflows minus the initial investment" },
    { key: "IRR", value: "The discount rate at which net present value becomes zero" },
    {
      key: "Economic Value Added",
      value: "Net operating profit after tax minus the capital charge",
    },
    {
      key: "Operating Leverage",
      value: "The sensitivity of operating profit to a change in sales",
    },
    {
      key: "Financial Leverage",
      value: "The sensitivity of earnings per share to a change in operating profit",
    },
    {
      key: "Forward Contract",
      value: "A customised over the counter agreement to buy or sell on a future date",
    },
    {
      key: "Futures Contract",
      value: "A standardised exchange traded contract settled through a clearing house",
    },
    {
      key: "Call Option",
      value: "The right without the obligation to buy the underlying at the strike price",
    },
    {
      key: "Put Option",
      value: "The right without the obligation to sell the underlying at the strike price",
    },
  ],
  "In strategic financial management, what does %s mean?",
  "Which term is defined as: %s?",
  "%k means %v.",
);

addPro(
  "ca:pro:dt",
  "Direct Tax Laws",
  "Assessment and Heads of Income",
  "Difficult",
  [
    { key: "Section 15", value: "Charging section for income under the head Salaries" },
    { key: "Section 22", value: "Charging section for income from house property" },
    {
      key: "Section 28",
      value: "Charging section for profits and gains of business or profession",
    },
    { key: "Section 45", value: "Charging section for capital gains" },
    { key: "Section 56", value: "Charging section for income from other sources" },
    { key: "Section 80C", value: "Deduction for specified investments and payments" },
    { key: "Section 80D", value: "Deduction for medical insurance premium" },
    { key: "Section 139", value: "Provision governing the filing of return of income" },
    { key: "Section 143(1)", value: "Summary assessment by way of intimation" },
    { key: "Section 143(3)", value: "Scrutiny assessment after detailed examination" },
    { key: "Section 147", value: "Assessment of income escaping assessment" },
    { key: "Section 234A", value: "Interest for default in furnishing the return of income" },
  ],
  "Under the Income Tax Act, what does %s deal with?",
  "Which section deals with: %s?",
  "%k is the provision on %v.",
);

addPro(
  "ca:pro:gst",
  "Indirect Tax Laws",
  "GST Law and Procedure",
  "Difficult",
  [
    { key: "Section 7 of CGST Act", value: "Defines the scope of the term supply" },
    { key: "Section 9 of CGST Act", value: "The levy and collection of central GST" },
    {
      key: "Section 16 of CGST Act",
      value: "Eligibility and conditions for taking input tax credit",
    },
    { key: "Section 17(5)", value: "Blocked credits on which input tax credit is not available" },
    { key: "Section 22", value: "Persons liable for registration once turnover crosses the limit" },
    { key: "Section 24", value: "Categories of persons required to register compulsorily" },
    { key: "Section 31", value: "Provisions governing the issue of a tax invoice" },
    { key: "GSTR-1", value: "The monthly or quarterly return of outward supplies" },
    { key: "GSTR-3B", value: "The summary return through which tax is paid" },
    { key: "GSTR-9", value: "The annual return filed by a registered person" },
    {
      key: "E-way bill",
      value: "The document required for movement of goods above the value limit",
    },
    {
      key: "Reverse charge",
      value: "A mechanism where the recipient pays the tax instead of the supplier",
    },
  ],
  "Under GST law, what does %s cover?",
  "Which GST provision or return is described as: %s?",
  "%k covers %v.",
);
