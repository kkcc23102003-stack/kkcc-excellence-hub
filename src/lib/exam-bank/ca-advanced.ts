/**
 * CA, CS and CMA — the papers the first CA module left thin.
 *
 * Financial Reporting, Advanced Auditing, Direct Tax Laws, Indirect Tax Laws
 * and Strategic Financial Management each carried only two or three chapters,
 * which does not cover a real Intermediate or Final paper. This module fills
 * those five papers out and deepens Cost Accounting, Business Economics,
 * Taxation and Business Law.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const FOUND = [
  "CA Foundation",
  "CS Foundation",
  "CMA Foundation",
  "CBSE Class 11-12 Commerce",
  "ISC Commerce",
];
const INTER = ["CA Intermediate", "CS Executive", "CMA Intermediate"];
const FINAL = ["CA Final", "CS Professional", "CMA Final"];

const templates: Template[] = [];
const law = chapterFactory(templates, "Business Law", [...FOUND, ...INTER]);
const eco = chapterFactory(templates, "Business Economics", FOUND);
const cost = chapterFactory(templates, "Cost Accounting", INTER);
const tax = chapterFactory(templates, "Taxation", INTER);
const audit = chapterFactory(templates, "Advanced Auditing", [...INTER, ...FINAL]);
const dtl = chapterFactory(templates, "Direct Tax Laws", FINAL);
const idt = chapterFactory(templates, "Indirect Tax Laws", FINAL);
const fr = chapterFactory(templates, "Financial Reporting", FINAL);
const sfm = chapterFactory(templates, "Strategic Financial Management", FINAL);

/* =================================================== Business Law ====== */

law(
  "ca:law:contract",
  "Indian Contract Act 1872 — Formation",
  "Under the Indian Contract Act, what is %s?",
  "%k is %v.",
  [
    { key: "Contract", value: "An agreement enforceable by law under section 2(h)" },
    {
      key: "Proposal",
      value:
        "Signifying to another a willingness to do or abstain from doing something to obtain assent",
    },
    {
      key: "Consideration",
      value:
        "Something done or promised at the desire of the promisor, which need not be adequate but must be real",
    },
    { key: "Void agreement", value: "An agreement not enforceable by law from the very beginning" },
    {
      key: "Voidable contract",
      value: "A contract enforceable at the option of one party but not the other",
    },
    {
      key: "Coercion",
      value:
        "Committing or threatening to commit an act forbidden by the Indian Penal Code to obtain consent",
    },
    {
      key: "Undue influence",
      value: "Using a dominant position in a relationship to obtain an unfair advantage",
    },
    {
      key: "Capacity to contract",
      value: "A person of the age of majority, of sound mind and not disqualified by law",
    },
    {
      key: "Agreement with a minor",
      value: "Void ab initio, as held in Mohori Bibee versus Dharmodas Ghose",
    },
    { key: "Quantum meruit", value: "A claim for payment in proportion to the work actually done" },
  ],
  [
    {
      key: "Doctrine of privity of contract",
      value:
        "Only a party to a contract can sue on it, subject to recognised exceptions such as a trust or family settlement",
    },
    {
      key: "Anticipatory breach",
      value: "Repudiation of a contract by a party before the due date of performance",
    },
    {
      key: "Rule in Hadley versus Baxendale",
      value:
        "Damages are limited to loss arising naturally or within the contemplation of both parties",
    },
    {
      key: "Contingent contract",
      value: "A contract to do or not do something if an uncertain collateral event happens",
    },
    {
      key: "Difference between a wagering agreement and a contingent contract",
      value:
        "A wager is void and the event is the sole determinant, while a contingent contract is valid and collateral",
    },
  ],
);

law(
  "ca:law:negotiable",
  "Negotiable Instruments Act 1881",
  "Under the Negotiable Instruments Act, what is %s?",
  "%k is %v.",
  [
    {
      key: "Negotiable instrument",
      value: "A promissory note, bill of exchange or cheque payable to order or bearer",
    },
    {
      key: "Promissory note",
      value:
        "An unconditional written undertaking signed by the maker to pay a certain sum to a specified person or bearer",
    },
    {
      key: "Bill of exchange",
      value:
        "An unconditional written order signed by the drawer directing a person to pay a certain sum",
    },
    {
      key: "Cheque",
      value: "A bill of exchange drawn on a specified banker and payable on demand",
    },
    {
      key: "Holder",
      value: "A person entitled in his own name to possess the instrument and recover the amount",
    },
    {
      key: "Holder in due course",
      value:
        "A holder who took the instrument for consideration, before maturity and in good faith",
    },
    { key: "Endorsement", value: "Signing on the instrument for the purpose of negotiation" },
    {
      key: "Crossing of a cheque",
      value:
        "Two parallel transverse lines directing that payment be made only through a bank account",
    },
    {
      key: "Days of grace",
      value: "The three days allowed beyond the due date for a time instrument",
    },
    {
      key: "Dishonour of cheque under section 138",
      value:
        "An offence punishable with imprisonment up to two years or fine up to twice the amount, or both",
    },
  ],
  [
    {
      key: "Notice period under section 138",
      value:
        "The payee must demand payment within thirty days of receiving information of dishonour",
    },
    {
      key: "Time to file a complaint under section 138",
      value: "Within one month of the expiry of the fifteen day period given to the drawer",
    },
    {
      key: "Difference between a general and a special crossing",
      value:
        "A general crossing is payable through any bank, a special crossing only through the named bank",
    },
    {
      key: "Effect of a not negotiable crossing",
      value:
        "The transferee gets no better title than the transferor, removing the key feature of negotiability",
    },
    {
      key: "Presumption as to consideration",
      value:
        "Every negotiable instrument is presumed to have been made for consideration unless proved otherwise",
    },
  ],
);

/* ============================================== Business Economics ===== */

eco(
  "ca:eco:demand",
  "Theory of Demand and Elasticity",
  "In the theory of demand, what is %s?",
  "%k is %v.",
  [
    {
      key: "Law of demand",
      value: "Other things being equal, a fall in price raises the quantity demanded",
    },
    {
      key: "Giffen good",
      value:
        "An inferior good whose demand rises when its price rises, an exception to the law of demand",
    },
    {
      key: "Price elasticity of demand",
      value: "The percentage change in quantity demanded divided by the percentage change in price",
    },
    {
      key: "Perfectly elastic demand",
      value: "Elasticity equal to infinity, shown by a horizontal demand curve",
    },
    {
      key: "Perfectly inelastic demand",
      value: "Elasticity equal to zero, shown by a vertical demand curve",
    },
    {
      key: "Income elasticity of a normal good",
      value: "Positive, since demand rises as income rises",
    },
    {
      key: "Cross elasticity of substitutes",
      value: "Positive, since a rise in the price of one raises demand for the other",
    },
    {
      key: "Law of diminishing marginal utility",
      value: "Marginal utility falls as successive units of a good are consumed",
    },
    {
      key: "Consumer surplus",
      value: "The excess of what a consumer is willing to pay over what is actually paid",
    },
    {
      key: "Indifference curve",
      value: "A curve showing all combinations of two goods giving the same satisfaction",
    },
  ],
  [
    {
      key: "Reason an indifference curve is convex to the origin",
      value: "The diminishing marginal rate of substitution between the two goods",
    },
    {
      key: "Total outlay method",
      value:
        "Judging elasticity from whether total expenditure rises, falls or stays constant when price changes",
    },
    {
      key: "Veblen effect",
      value: "Demand for a prestige good rises with price because of its snob value",
    },
    {
      key: "Relation between elasticity and total revenue",
      value:
        "Revenue rises with a price cut when demand is elastic and falls when demand is inelastic",
    },
    {
      key: "Income effect and substitution effect",
      value:
        "The change in demand due to a change in real income and due to a change in relative price",
    },
  ],
);

eco(
  "ca:eco:money-banking",
  "Money, Banking and National Income",
  "In macroeconomics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Gross Domestic Product",
      value: "The market value of all final goods and services produced within a country in a year",
    },
    { key: "Gross National Product", value: "GDP plus net factor income from abroad" },
    { key: "Net National Product", value: "GNP minus depreciation" },
    { key: "National income", value: "Net national product measured at factor cost" },
    {
      key: "Three methods of measuring national income",
      value: "The product method, the income method and the expenditure method",
    },
    {
      key: "Functions of money",
      value:
        "Medium of exchange, measure of value, store of value and standard of deferred payment",
    },
    {
      key: "Credit creation",
      value: "The process by which commercial banks multiply deposits by lending",
    },
    {
      key: "Cash Reserve Ratio",
      value: "The share of net demand and time liabilities a bank must keep with the central bank",
    },
    {
      key: "Statutory Liquidity Ratio",
      value:
        "The share of liabilities a bank must hold in liquid assets such as government securities",
    },
    {
      key: "Repo rate",
      value: "The rate at which the central bank lends to commercial banks against securities",
    },
  ],
  [
    {
      key: "Money multiplier",
      value: "The reciprocal of the cash reserve ratio, giving the maximum expansion of deposits",
    },
    {
      key: "Difference between GDP at market price and at factor cost",
      value: "Factor cost equals market price minus indirect taxes plus subsidies",
    },
    {
      key: "Open market operations",
      value: "Purchase or sale of government securities by the central bank to change liquidity",
    },
    {
      key: "Demand pull inflation",
      value: "Inflation caused by aggregate demand exceeding aggregate supply",
    },
    {
      key: "Cost push inflation",
      value: "Inflation caused by rising input costs such as wages or raw materials",
    },
  ],
);

/* ================================================= Cost Accounting ===== */

cost(
  "ca:cost:marginal",
  "Marginal Costing and Break Even Analysis",
  "In marginal costing, what is %s?",
  "%k is %v.",
  [
    {
      key: "Marginal cost",
      value:
        "The additional cost of producing one more unit, that is the total variable cost per unit",
    },
    {
      key: "Contribution",
      value: "Sales minus variable cost, which first covers fixed cost and then gives profit",
    },
    {
      key: "Profit volume ratio",
      value: "Contribution divided by sales, expressed as a percentage",
    },
    { key: "Break even point in units", value: "Fixed cost divided by contribution per unit" },
    { key: "Break even point in value", value: "Fixed cost divided by the profit volume ratio" },
    { key: "Margin of safety", value: "The excess of actual sales over break even sales" },
    {
      key: "Angle of incidence",
      value: "The angle between the sales line and the total cost line at the break even point",
    },
    {
      key: "Key factor",
      value: "The limiting factor such as scarce material or machine hours that restricts output",
    },
    {
      key: "Treatment of fixed cost in marginal costing",
      value: "It is charged wholly to the period and not to the product",
    },
    {
      key: "Differential cost",
      value: "The change in total cost between two alternative courses of action",
    },
  ],
  [
    {
      key: "Decision rule when a key factor exists",
      value:
        "Rank products by contribution per unit of the key factor, not by contribution per unit of product",
    },
    {
      key: "Make or buy decision rule",
      value:
        "Make if the marginal cost of making is less than the buying price, assuming spare capacity",
    },
    {
      key: "Reason marginal costing profit differs from absorption costing profit",
      value: "The two treat fixed overhead in closing and opening stock differently",
    },
    {
      key: "Cash break even point",
      value: "Break even computed after excluding non cash fixed costs such as depreciation",
    },
    {
      key: "Composite break even point",
      value:
        "The break even point for a multi product firm computed from the weighted average profit volume ratio",
    },
  ],
);

cost(
  "ca:cost:budget",
  "Budgetary Control and Activity Based Costing",
  "In budgeting and modern costing, what is %s?",
  "%k is %v.",
  [
    {
      key: "Budget",
      value: "A financial or quantitative plan prepared in advance of a defined period",
    },
    {
      key: "Budgetary control",
      value: "Comparing actual results with budgeted figures and acting on the variance",
    },
    {
      key: "Fixed budget",
      value: "A budget prepared for a single level of activity and not adjusted for changes",
    },
    {
      key: "Flexible budget",
      value: "A budget that is adjusted to the actual level of activity achieved",
    },
    {
      key: "Zero base budgeting",
      value: "Building every budget afresh from zero, with each item justified anew",
    },
    {
      key: "Master budget",
      value: "The summary budget consolidating all functional budgets of the organisation",
    },
    {
      key: "Cash budget",
      value: "A budget of expected cash receipts and payments over the budget period",
    },
    {
      key: "Principal budget factor",
      value: "The factor that limits the activities of the undertaking, usually sales",
    },
    {
      key: "Activity based costing",
      value: "Assigning overhead to products using the activities that actually drive the cost",
    },
    {
      key: "Cost driver",
      value: "The factor that causes a change in the cost of an activity, such as number of setups",
    },
  ],
  [
    {
      key: "Advantage of activity based costing over traditional absorption",
      value:
        "It traces overhead through real cost drivers, giving far more accurate product costs in a diverse product mix",
    },
    {
      key: "Budget manual",
      value: "The document setting out the responsibilities, routines and procedures of budgeting",
    },
    {
      key: "Performance budgeting",
      value: "Budgeting linked to the objectives, programmes and outputs of each function",
    },
    {
      key: "Limitation of zero base budgeting",
      value: "It is time consuming and demands substantial managerial effort and training",
    },
    {
      key: "Value added and non value added activity",
      value:
        "An activity that increases worth to the customer and one that can be eliminated without loss of worth",
    },
  ],
);

/* ======================================================= Taxation ====== */

tax(
  "ca:tax:residential",
  "Residential Status and Scope of Total Income",
  "In income tax, what is %s?",
  "%k is %v.",
  [
    {
      key: "Previous year",
      value: "The financial year in which income is earned, ending on the thirty first of March",
    },
    {
      key: "Assessment year",
      value: "The financial year following the previous year in which income is assessed",
    },
    {
      key: "Basic condition of residence",
      value: "Stay in India for 182 days or more in the previous year",
    },
    {
      key: "Alternative basic condition",
      value:
        "Stay of 60 days or more in the previous year and 365 days or more in the preceding four years",
    },
    {
      key: "Resident and ordinarily resident",
      value:
        "A resident who is also a resident in two of the ten preceding years and stayed 730 days in seven preceding years",
    },
    { key: "Non resident", value: "A person who satisfies neither basic condition of residence" },
    {
      key: "Scope of income for a resident and ordinarily resident",
      value: "Global income, whether earned in India or abroad",
    },
    {
      key: "Scope of income for a non resident",
      value: "Only income received or accruing in India",
    },
    {
      key: "Heads of income",
      value: "Salaries, house property, business or profession, capital gains and other sources",
    },
    { key: "Assessee", value: "Any person by whom tax or any other sum is payable under the Act" },
  ],
  [
    {
      key: "Residential status of a Hindu Undivided Family",
      value:
        "Resident if control and management of its affairs is wholly or partly situated in India",
    },
    {
      key: "Residential status of a company",
      value: "Resident if it is an Indian company or its place of effective management is in India",
    },
    {
      key: "Deemed to accrue in India",
      value: "Income from a business connection, property, asset or source of income in India",
    },
    {
      key: "Relief under section 90",
      value: "Relief from double taxation under an agreement with another country",
    },
    {
      key: "Relief under section 91",
      value: "Unilateral relief where no double taxation avoidance agreement exists",
    },
  ],
);

tax(
  "ca:tax:deductions",
  "Clubbing, Set Off and Deductions under Chapter VI-A",
  "In computing total income, what is %s?",
  "%k is %v.",
  [
    {
      key: "Clubbing of income",
      value:
        "Including the income of another person in the assessee's total income in specified cases",
    },
    {
      key: "Intra head set off",
      value: "Adjusting a loss under one head against income under the same head",
    },
    {
      key: "Inter head set off",
      value: "Adjusting a loss under one head against income under another head in the same year",
    },
    {
      key: "Carry forward of business loss",
      value: "A business loss may be carried forward for eight assessment years",
    },
    {
      key: "Carry forward of unabsorbed depreciation",
      value: "It may be carried forward indefinitely",
    },
    {
      key: "Section 80C",
      value: "Deduction up to one lakh fifty thousand for specified savings and payments",
    },
    {
      key: "Section 80D",
      value: "Deduction for medical insurance premium paid for self and family",
    },
    { key: "Section 80E", value: "Deduction for interest on a loan taken for higher education" },
    {
      key: "Section 80G",
      value: "Deduction for donations to specified funds and charitable institutions",
    },
    {
      key: "Section 80TTA",
      value: "Deduction up to ten thousand for interest on a savings bank account",
    },
  ],
  [
    {
      key: "Set off rule for speculation loss",
      value: "It can be set off only against speculation profit and carried forward for four years",
    },
    {
      key: "Set off rule for capital loss",
      value: "A long term capital loss can be set off only against long term capital gain",
    },
    {
      key: "House property loss set off limit",
      value: "Only two lakh rupees can be set off against other heads in a year",
    },
    {
      key: "Clubbing of a minor's income",
      value: "It is clubbed with the parent having the higher income, with an exemption per child",
    },
    {
      key: "Condition for carrying forward a loss",
      value: "The return must be filed within the due date prescribed under section 139(1)",
    },
  ],
);

/* ============================================== Advanced Auditing ====== */

audit(
  "ca:audit:planning",
  "Audit Planning, Risk Assessment and Materiality",
  "In audit planning, what is %s?",
  "%k is %v.",
  [
    {
      key: "Audit planning",
      value:
        "Developing an overall strategy and a detailed approach for the expected conduct of the audit",
    },
    {
      key: "Audit programme",
      value:
        "A detailed written plan of the procedures to be performed, with their extent and timing",
    },
    {
      key: "Materiality",
      value: "The magnitude of a misstatement that could influence the economic decisions of users",
    },
    {
      key: "Audit risk",
      value:
        "The risk that the auditor expresses an inappropriate opinion on materially misstated statements",
    },
    {
      key: "Inherent risk",
      value:
        "The susceptibility of a balance or class of transactions to material misstatement before controls",
    },
    {
      key: "Control risk",
      value: "The risk that a misstatement is not prevented or detected by internal control",
    },
    {
      key: "Detection risk",
      value:
        "The risk that the auditor's procedures fail to detect an existing material misstatement",
    },
    {
      key: "Audit evidence",
      value:
        "The information used by the auditor in arriving at the conclusions on which the opinion is based",
    },
    {
      key: "Audit sampling",
      value:
        "Applying procedures to less than one hundred per cent of items so as to draw a conclusion on the whole",
    },
    {
      key: "Audit working papers",
      value: "The record of procedures performed, evidence obtained and conclusions reached",
    },
  ],
  [
    {
      key: "Relation between the three components of audit risk",
      value: "Audit risk is the product of inherent risk, control risk and detection risk",
    },
    {
      key: "Effect of higher assessed risk on detection risk",
      value:
        "Detection risk must be lowered by more extensive and more timely substantive procedures",
    },
    {
      key: "Performance materiality",
      value:
        "An amount set below overall materiality to reduce the risk that uncorrected misstatements aggregate above it",
    },
    {
      key: "Professional scepticism",
      value: "An attitude of a questioning mind and a critical assessment of audit evidence",
    },
    {
      key: "Ownership of working papers",
      value:
        "They are the property of the auditor, though portions may be made available to the client at discretion",
    },
  ],
);

audit(
  "ca:audit:internal-control",
  "Internal Control, Vouching and Verification",
  "In audit execution, what is %s?",
  "%k is %v.",
  [
    {
      key: "Internal control",
      value:
        "The process designed to give reasonable assurance about reliability of reporting and compliance",
    },
    {
      key: "Internal check",
      value:
        "The arrangement of duties so that no one person handles a transaction from start to finish",
    },
    {
      key: "Internal audit",
      value: "An independent appraisal activity within an organisation to review its operations",
    },
    {
      key: "Vouching",
      value: "Examining documentary evidence to verify the authenticity of entries in the books",
    },
    {
      key: "Verification",
      value:
        "Confirming the existence, ownership, valuation and presentation of assets and liabilities",
    },
    { key: "Valuation of stock", value: "At cost or net realisable value, whichever is lower" },
    {
      key: "Walk through test",
      value:
        "Tracing a few transactions through the system to confirm the auditor's understanding of it",
    },
    {
      key: "Compliance procedure",
      value:
        "A test to obtain evidence that internal controls operated effectively through the period",
    },
    {
      key: "Substantive procedure",
      value: "A test designed to detect material misstatements in balances and transactions",
    },
    {
      key: "Analytical procedure",
      value: "Evaluation of financial information by studying plausible relationships among data",
    },
  ],
  [
    {
      key: "Teeming and lading",
      value:
        "A cash defalcation concealed by applying a later receipt to cover an earlier misappropriation",
    },
    {
      key: "Window dressing",
      value: "Presenting accounts so as to show a better position than actually exists",
    },
    {
      key: "Difference between internal check and internal audit",
      value:
        "Internal check is built into the routine and is continuous, internal audit is a separate later review",
    },
    {
      key: "Auditor's duty on suspected fraud",
      value:
        "Extend procedures, obtain sufficient appropriate evidence and report under section 143(12) where applicable",
    },
    {
      key: "Cut off procedure",
      value:
        "Testing that transactions near the period end are recorded in the correct accounting period",
    },
  ],
);

audit(
  "ca:audit:company-audit",
  "Company Audit and Reporting under CARO",
  "In company audit, what is %s?",
  "%k is %v.",
  [
    {
      key: "Appointment of the first auditor",
      value:
        "By the Board within thirty days of registration, failing which by the members within ninety days",
    },
    {
      key: "Tenure of an auditor",
      value:
        "Appointment at an annual general meeting to hold office till the conclusion of the sixth such meeting",
    },
    {
      key: "Rotation of auditors",
      value:
        "An individual auditor for one term of five years and a firm for two terms of five years in prescribed companies",
    },
    {
      key: "Removal of an auditor before term",
      value:
        "By special resolution after obtaining the previous approval of the Central Government",
    },
    {
      key: "Section 143 of the Companies Act",
      value: "The section setting out the powers and duties of the auditor",
    },
    {
      key: "CARO",
      value:
        "The Companies Auditor's Report Order, requiring a report on specified additional matters",
    },
    {
      key: "Unmodified opinion",
      value:
        "The opinion expressed when the statements give a true and fair view in all material respects",
    },
    {
      key: "Qualified opinion",
      value: "The opinion expressed when misstatements are material but not pervasive",
    },
    {
      key: "Adverse opinion",
      value: "The opinion expressed when misstatements are both material and pervasive",
    },
    {
      key: "Disclaimer of opinion",
      value:
        "Issued when the auditor cannot obtain sufficient appropriate evidence and the possible effect is pervasive",
    },
  ],
  [
    {
      key: "Services an auditor may not render under section 144",
      value:
        "Accounting and book keeping, internal audit, actuarial services, investment banking and management services",
    },
    {
      key: "Emphasis of matter paragraph",
      value:
        "A paragraph drawing attention to a matter properly disclosed that is fundamental to users' understanding",
    },
    {
      key: "Key audit matters",
      value:
        "Matters of most significance in the audit of the current period, communicated in the auditor's report",
    },
    {
      key: "Branch audit",
      value:
        "Audit of a branch by the company auditor or by another qualified person appointed under section 143(8)",
    },
    {
      key: "Auditor's duty to report fraud",
      value:
        "Fraud above the prescribed limit is reported to the Central Government, smaller frauds to the audit committee or Board",
    },
  ],
);

/* ============================================== Direct Tax Laws ======== */

dtl(
  "ca:dtl:assessment",
  "Assessment Procedure and Return Filing",
  "In the assessment procedure, what is %s?",
  "%k is %v.",
  [
    {
      key: "Section 139(1)",
      value: "The section requiring a person to furnish a return of income by the due date",
    },
    {
      key: "Belated return",
      value: "A return filed after the due date, permitted under section 139(4)",
    },
    {
      key: "Revised return",
      value: "A return filed under section 139(5) to correct an omission or wrong statement",
    },
    {
      key: "Updated return",
      value:
        "A return under section 139(8A) allowing voluntary updating on payment of additional tax",
    },
    {
      key: "Summary assessment",
      value: "Processing of the return under section 143(1) with prima facie adjustments",
    },
    {
      key: "Scrutiny assessment",
      value: "Detailed assessment under section 143(3) after notice and hearing",
    },
    {
      key: "Best judgment assessment",
      value: "Assessment under section 144 where the assessee fails to comply with notices",
    },
    {
      key: "Income escaping assessment",
      value: "Reassessment under section 147 where income chargeable to tax has escaped assessment",
    },
    {
      key: "Self assessment tax",
      value: "Tax paid by the assessee under section 140A before furnishing the return",
    },
    {
      key: "Advance tax",
      value:
        "Tax paid in instalments during the previous year where the liability is ten thousand or more",
    },
  ],
  [
    {
      key: "Faceless assessment",
      value:
        "Assessment conducted electronically through the National Faceless Assessment Centre without personal interface",
    },
    {
      key: "Interest under section 234A",
      value: "Interest for default in furnishing the return of income",
    },
    { key: "Interest under section 234B", value: "Interest for default in payment of advance tax" },
    {
      key: "Interest under section 234C",
      value: "Interest for deferment of instalments of advance tax",
    },
    {
      key: "Appeal hierarchy under the Income Tax Act",
      value:
        "Commissioner Appeals, then the Appellate Tribunal, then the High Court and the Supreme Court",
    },
  ],
);

dtl(
  "ca:dtl:tds",
  "Tax Deduction and Collection at Source",
  "In TDS and TCS, what is %s?",
  "%k is %v.",
  [
    {
      key: "Tax deducted at source",
      value: "Tax collected at the point of payment by the payer on behalf of the recipient",
    },
    {
      key: "Section 192",
      value: "Deduction of tax at source on salary at the average rate of income tax",
    },
    { key: "Section 194A", value: "Deduction on interest other than interest on securities" },
    { key: "Section 194C", value: "Deduction on payments to contractors and sub contractors" },
    { key: "Section 194J", value: "Deduction on fees for professional or technical services" },
    { key: "Section 194I", value: "Deduction on rent of land, building, plant or machinery" },
    {
      key: "TAN",
      value: "The Tax Deduction and Collection Account Number every deductor must obtain",
    },
    {
      key: "Form 16",
      value: "The certificate of tax deducted at source on salary issued to the employee",
    },
    {
      key: "Form 26AS",
      value: "The annual consolidated tax statement showing credits available to a taxpayer",
    },
    {
      key: "Tax collected at source",
      value: "Tax collected by a seller from the buyer of specified goods at the time of sale",
    },
  ],
  [
    {
      key: "Consequence of failure to deduct tax",
      value:
        "Disallowance of the expenditure and liability as an assessee in default with interest and penalty",
    },
    {
      key: "Disallowance under section 40(a)(ia)",
      value:
        "Thirty per cent of the specified expenditure is disallowed where tax was not deducted or paid",
    },
    {
      key: "Certificate for lower deduction",
      value: "A certificate under section 197 allowing deduction at a lower or nil rate",
    },
    {
      key: "Due date for depositing TDS",
      value:
        "Generally the seventh of the following month, and the thirtieth of April for March deductions",
    },
    {
      key: "Higher rate of deduction for non filers",
      value:
        "Tax is deducted at a higher rate under section 206AB for specified non filers of return",
    },
  ],
);

/* ============================================ Indirect Tax Laws ======== */

idt(
  "ca:idt:gst-supply",
  "GST — Supply, Time and Value of Supply",
  "Under GST law, what is %s?",
  "%k is %v.",
  [
    {
      key: "Supply under section 7",
      value:
        "All forms of supply of goods or services made for a consideration in the course of business",
    },
    {
      key: "Composite supply",
      value: "Two or more naturally bundled supplies of which one is the principal supply",
    },
    {
      key: "Mixed supply",
      value: "Two or more supplies made together for a single price that are not naturally bundled",
    },
    {
      key: "Tax rate for a composite supply",
      value: "The rate applicable to the principal supply",
    },
    {
      key: "Tax rate for a mixed supply",
      value: "The highest rate among the supplies bundled together",
    },
    {
      key: "Reverse charge mechanism",
      value: "Liability to pay tax placed on the recipient instead of the supplier",
    },
    {
      key: "Time of supply of goods",
      value:
        "The earlier of the date of issue of invoice or the last date on which it ought to have been issued",
    },
    {
      key: "Transaction value",
      value:
        "The price actually paid or payable where supplier and recipient are unrelated and price is the sole consideration",
    },
    {
      key: "Exempt supply",
      value: "A supply attracting nil rate or wholly exempt, including non taxable supply",
    },
    {
      key: "Zero rated supply",
      value: "Export of goods or services and supply to a special economic zone unit or developer",
    },
  ],
  [
    {
      key: "Schedule I supply",
      value:
        "Activities treated as supply even without consideration, such as permanent transfer of business assets on which credit was taken",
    },
    {
      key: "Inclusion in value of supply",
      value:
        "Taxes other than GST, incidental expenses, interest for late payment and subsidies other than government subsidies",
    },
    {
      key: "Difference between zero rated and exempt supply",
      value: "Input tax credit is available for zero rated supply but not for exempt supply",
    },
    {
      key: "Place of supply for immovable property services",
      value: "The location of the immovable property",
    },
    {
      key: "Time of supply under reverse charge for services",
      value: "The earlier of the date of payment or the sixty first day from the date of invoice",
    },
  ],
);

idt(
  "ca:idt:itc-returns",
  "GST — Input Tax Credit, Registration and Returns",
  "Under GST compliance, what is %s?",
  "%k is %v.",
  [
    {
      key: "Input tax credit",
      value: "Credit of GST paid on inward supplies used in the course or furtherance of business",
    },
    {
      key: "Condition for claiming input tax credit",
      value:
        "Possession of a tax invoice, receipt of goods or services, tax actually paid and return furnished",
    },
    {
      key: "Blocked credit under section 17(5)",
      value:
        "Credit not available on motor vehicles, food and beverages, club membership and personal consumption",
    },
    {
      key: "Threshold for registration for goods",
      value: "Aggregate turnover above forty lakh rupees in most states",
    },
    {
      key: "Composition scheme",
      value:
        "A simplified scheme allowing a small supplier to pay tax at a flat rate on turnover without credit",
    },
    { key: "GSTR-1", value: "The monthly or quarterly return of outward supplies" },
    {
      key: "GSTR-3B",
      value: "The summary return of outward supplies, input tax credit and tax payable",
    },
    { key: "GSTR-9", value: "The annual return to be furnished by a registered person" },
    {
      key: "E-way bill",
      value: "The electronic document required for movement of goods above the prescribed value",
    },
    {
      key: "Electronic credit ledger",
      value: "The ledger in which input tax credit claimed in the return is credited",
    },
  ],
  [
    {
      key: "Order of utilisation of integrated tax credit",
      value: "IGST credit is used first against IGST, then against CGST and SGST in any order",
    },
    {
      key: "Reversal of credit for non payment",
      value:
        "Credit must be reversed if the recipient does not pay the supplier within one hundred and eighty days",
    },
    {
      key: "Restriction under rule 36(4)",
      value: "Credit is limited to invoices actually reflected in the auto generated statement",
    },
    {
      key: "Compulsory registration",
      value:
        "Required irrespective of turnover for inter state suppliers, casual taxable persons and those liable under reverse charge",
    },
    {
      key: "Consequence of not filing returns",
      value:
        "Late fee and interest, blocking of the e-way bill facility and possible cancellation of registration",
    },
  ],
);

/* ============================================= Financial Reporting ===== */

fr(
  "ca:fr:ind-as",
  "Ind AS Framework and Presentation",
  "In Ind AS reporting, what is %s?",
  "%k is %v.",
  [
    {
      key: "Ind AS",
      value:
        "Indian Accounting Standards, converged with International Financial Reporting Standards",
    },
    { key: "Ind AS 1", value: "The standard on presentation of financial statements" },
    { key: "Ind AS 7", value: "The standard on the statement of cash flows" },
    {
      key: "Ind AS 8",
      value: "The standard on accounting policies, changes in estimates and errors",
    },
    {
      key: "Fair value",
      value:
        "The price receivable on selling an asset in an orderly transaction between market participants",
    },
    {
      key: "Ind AS 113",
      value: "The standard establishing a single framework for measuring fair value",
    },
    {
      key: "Complete set of financial statements",
      value:
        "Balance sheet, statement of profit and loss, statement of changes in equity, cash flow statement and notes",
    },
    {
      key: "Other comprehensive income",
      value:
        "Items of income and expense not recognised in profit or loss as required by other standards",
    },
    {
      key: "Going concern assumption",
      value:
        "Statements are prepared assuming the entity will continue operating in the foreseeable future",
    },
    {
      key: "Materiality under Ind AS",
      value:
        "Information is material if omitting or misstating it could influence users' decisions",
    },
  ],
  [
    {
      key: "Fair value hierarchy",
      value: "Level 1 quoted prices, Level 2 observable inputs and Level 3 unobservable inputs",
    },
    {
      key: "Retrospective application",
      value: "Applying a new policy as if it had always been applied, restating comparatives",
    },
    {
      key: "Difference between a change in policy and a change in estimate",
      value:
        "A policy change is applied retrospectively while an estimate change is applied prospectively",
    },
    {
      key: "First time adoption standard",
      value: "Ind AS 101, which governs transition and requires an opening Ind AS balance sheet",
    },
    {
      key: "Reclassification adjustment",
      value:
        "Amounts reclassified to profit or loss in the current period that were recognised in other comprehensive income earlier",
    },
  ],
);

fr(
  "ca:fr:revenue-leases",
  "Revenue Recognition, Leases and Financial Instruments",
  "In Ind AS measurement, what is %s?",
  "%k is %v.",
  [
    { key: "Ind AS 115", value: "The standard on revenue from contracts with customers" },
    {
      key: "Five step model of revenue recognition",
      value:
        "Identify the contract, identify performance obligations, determine price, allocate price and recognise revenue",
    },
    {
      key: "Performance obligation",
      value: "A promise in a contract to transfer a distinct good or service to the customer",
    },
    { key: "Ind AS 116", value: "The standard on leases" },
    {
      key: "Lessee accounting under Ind AS 116",
      value: "Recognition of a right of use asset and a lease liability for almost all leases",
    },
    {
      key: "Short term lease exemption",
      value: "Leases of twelve months or less may be expensed on a straight line basis",
    },
    {
      key: "Ind AS 109",
      value:
        "The standard on financial instruments, covering classification, measurement and impairment",
    },
    {
      key: "Amortised cost category",
      value:
        "For assets held to collect contractual cash flows that are solely principal and interest",
    },
    {
      key: "Expected credit loss model",
      value: "Impairment recognised on expected rather than incurred losses",
    },
    {
      key: "Ind AS 110",
      value: "The standard on consolidated financial statements, based on the concept of control",
    },
  ],
  [
    {
      key: "Variable consideration",
      value:
        "Consideration estimated using the expected value or most likely amount, constrained to avoid significant reversal",
    },
    {
      key: "Control under Ind AS 110",
      value:
        "Power over the investee, exposure to variable returns and the ability to use power to affect returns",
    },
    {
      key: "Three stage impairment approach",
      value:
        "Twelve month expected losses in stage one and lifetime expected losses once credit risk increases significantly",
    },
    {
      key: "Sale and leaseback under Ind AS 116",
      value: "Accounted as a sale only if the transfer qualifies as a sale under Ind AS 115",
    },
    {
      key: "Contract asset and receivable",
      value:
        "A contract asset is a conditional right to consideration while a receivable is an unconditional right",
    },
  ],
);

/* ================================ Strategic Financial Management ======= */

sfm(
  "ca:sfm:cost-of-capital",
  "Cost of Capital, Leverage and Capital Structure",
  "In financial management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Cost of capital",
      value:
        "The minimum rate of return a firm must earn to keep the market value of its shares unchanged",
    },
    {
      key: "Weighted average cost of capital",
      value:
        "The average cost of all sources of finance weighted by their proportion in the capital structure",
    },
    {
      key: "Cost of equity under the dividend growth model",
      value: "Expected dividend divided by market price plus the growth rate",
    },
    {
      key: "Capital asset pricing model",
      value: "Cost of equity equals the risk free rate plus beta times the market risk premium",
    },
    { key: "Beta", value: "A measure of the systematic risk of a security relative to the market" },
    {
      key: "Operating leverage",
      value: "The ratio of contribution to earnings before interest and tax",
    },
    {
      key: "Financial leverage",
      value: "The ratio of earnings before interest and tax to earnings before tax",
    },
    { key: "Combined leverage", value: "The product of operating leverage and financial leverage" },
    {
      key: "Trading on equity",
      value: "Using fixed cost debt to raise the return available to equity shareholders",
    },
    {
      key: "Optimum capital structure",
      value: "The mix of debt and equity at which the weighted average cost of capital is lowest",
    },
  ],
  [
    {
      key: "Net income approach",
      value: "Cost of capital falls and firm value rises steadily as more debt is used",
    },
    {
      key: "Modigliani Miller proposition without taxes",
      value: "Firm value is independent of capital structure in a perfect market",
    },
    {
      key: "Effect of corporate tax in the Modigliani Miller model",
      value: "Value rises with debt by the present value of the interest tax shield",
    },
    {
      key: "Reason cost of debt is lower than cost of equity",
      value: "Interest is tax deductible and debt holders bear less risk than shareholders",
    },
    {
      key: "Indifference point in EBIT EPS analysis",
      value:
        "The EBIT level at which earnings per share is the same under two financing alternatives",
    },
  ],
);

sfm(
  "ca:sfm:derivatives-forex",
  "Derivatives, Foreign Exchange and Risk Management",
  "In financial risk management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Derivative",
      value:
        "A financial instrument whose value is derived from an underlying asset, rate or index",
    },
    {
      key: "Forward contract",
      value:
        "A customised over the counter agreement to buy or sell an asset at a fixed future price",
    },
    {
      key: "Futures contract",
      value: "A standardised exchange traded contract with daily mark to market settlement",
    },
    {
      key: "Call option",
      value: "A right but not an obligation to buy the underlying at the strike price",
    },
    {
      key: "Put option",
      value: "A right but not an obligation to sell the underlying at the strike price",
    },
    {
      key: "Option premium",
      value: "The price the buyer pays the writer for the right conferred by the option",
    },
    {
      key: "Swap",
      value: "An agreement to exchange a series of cash flows, such as fixed for floating interest",
    },
    { key: "Spot rate", value: "The rate of exchange for immediate delivery of currency" },
    {
      key: "Forward premium",
      value: "The excess of the forward rate over the spot rate for a currency",
    },
    {
      key: "Hedging",
      value: "Taking an offsetting position to reduce exposure to an adverse price movement",
    },
  ],
  [
    {
      key: "Interest rate parity",
      value:
        "The forward differential between two currencies equals the difference in their interest rates",
    },
    {
      key: "Purchasing power parity",
      value:
        "The change in the exchange rate equals the difference in inflation rates between the two countries",
    },
    {
      key: "Intrinsic value of an option",
      value: "The gain from immediate exercise, which is never less than zero",
    },
    {
      key: "Transaction, translation and economic exposure",
      value:
        "Exposure on settled deals, on consolidation of statements and on long run competitive position",
    },
    {
      key: "Money market hedge",
      value:
        "Covering a foreign currency exposure by borrowing and investing in the two money markets",
    },
  ],
);

export const CA_ADVANCED_TEMPLATES = templates;
