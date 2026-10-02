/**
 * The two CA Intermediate papers the bank had no subject for at all.
 *
 * Under the ICAI new scheme the Intermediate course has six papers, and
 * Auditing and Ethics together with Financial Management and Strategic
 * Management are two of them. The Intermediate series carried only
 * Accounting, Cost Accounting, Taxation and Law, so a candidate saw four of
 * the six papers. The same ground is set by CS Executive and CMA
 * Intermediate.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const INTER = ["CA Intermediate", "CS Executive", "CMA Intermediate", "CA Final"];

const templates: Template[] = [];
const aud = chapterFactory(templates, "Auditing and Ethics", INTER);
const fm = chapterFactory(templates, "Financial Management", INTER);

/* ==================================================== Auditing and Ethics */

aud(
  "au:nature-objective",
  "Nature, Objective and Scope of Audit",
  "In the nature and scope of audit, what is %s?",
  "%k is %v.",
  [
    {
      key: "Audit",
      value:
        "An independent examination of financial information of any entity with a view to expressing an opinion on it",
    },
    {
      key: "Objective of an audit of financial statements",
      value:
        "To obtain reasonable assurance whether the statements as a whole are free from material misstatement",
    },
    { key: "Reasonable assurance", value: "A high but not absolute level of assurance" },
    {
      key: "Body that issues the Standards on Auditing in India",
      value: "The Institute of Chartered Accountants of India",
    },
    { key: "Standard on the overall objectives of the auditor", value: "SA 200" },
    {
      key: "Professional scepticism",
      value:
        "An attitude of a questioning mind, alert to conditions that may indicate misstatement",
    },
    {
      key: "Professional judgement",
      value:
        "The application of relevant training, knowledge and experience in making informed decisions",
    },
    {
      key: "Inherent limitation of an audit",
      value:
        "The use of testing, the limitations of internal control, and the fact that most evidence is persuasive rather than conclusive",
    },
    {
      key: "True and fair view",
      value:
        "That the statements are free from material misstatement and fairly present the state of affairs",
    },
    {
      key: "Materiality",
      value:
        "Information is material if its omission or misstatement could influence the economic decisions of users",
    },
  ],
  [
    {
      key: "Difference between an audit and an investigation",
      value:
        "An audit forms an opinion on the statements as a whole, an investigation examines a specific matter in depth for a special purpose",
    },
    {
      key: "Reason an auditor cannot give absolute assurance",
      value:
        "Sampling, the inherent limits of internal control, the possibility of collusion and the use of judgement",
    },
    {
      key: "Performance materiality",
      value:
        "An amount set below materiality to reduce the risk that uncorrected misstatements together exceed materiality",
    },
    {
      key: "Relationship between the auditor and management",
      value:
        "Management is responsible for preparing the statements, the auditor only for the opinion on them",
    },
    {
      key: "Standard on agreeing the terms of an audit engagement",
      value: "SA 210, which requires an engagement letter",
    },
  ],
);

aud(
  "au:risk-planning",
  "Audit Planning, Risk Assessment and Materiality",
  "In audit planning and risk, what is %s?",
  "%k is %v.",
  [
    { key: "Standard on planning an audit", value: "SA 300" },
    {
      key: "Standard on identifying and assessing the risks of material misstatement",
      value: "SA 315",
    },
    { key: "Standard on materiality in planning and performing an audit", value: "SA 320" },
    { key: "Standard on the auditor's responses to assessed risks", value: "SA 330" },
    {
      key: "Audit risk",
      value:
        "The risk that the auditor expresses an inappropriate opinion when the statements are materially misstated",
    },
    { key: "Components of audit risk", value: "Inherent risk, control risk and detection risk" },
    {
      key: "Inherent risk",
      value: "The susceptibility of an assertion to misstatement before considering controls",
    },
    {
      key: "Control risk",
      value: "The risk that a misstatement will not be prevented or detected by internal control",
    },
    {
      key: "Detection risk",
      value: "The risk that the auditor's procedures will not detect an existing misstatement",
    },
    {
      key: "Overall audit strategy",
      value: "The document setting the scope, timing and direction of the audit",
    },
  ],
  [
    {
      key: "Relationship between detection risk and the other components",
      value: "Detection risk is inversely related to the assessed risk of material misstatement",
    },
    {
      key: "Significant risk",
      value:
        "An identified risk of material misstatement that requires special audit consideration",
    },
    {
      key: "Risk assessment procedures",
      value:
        "Enquiry, analytical procedures, observation and inspection to understand the entity and its environment",
    },
    {
      key: "Difference between the audit plan and the audit strategy",
      value:
        "The strategy sets the overall scope and direction, the plan sets out the nature, timing and extent of procedures",
    },
    {
      key: "Effect of a change in circumstances on planning",
      value: "Planning is continuous, so the strategy and plan are revised as the audit progresses",
    },
  ],
);

aud(
  "au:internal-control",
  "Internal Control and Audit in an Automated Environment",
  "In internal control, what is %s?",
  "%k is %v.",
  [
    {
      key: "Internal control",
      value:
        "The process designed to provide reasonable assurance about reliability of reporting, effectiveness of operations and compliance with law",
    },
    {
      key: "Five components of internal control",
      value:
        "Control environment, risk assessment, control activities, information and communication, and monitoring",
    },
    {
      key: "Control environment",
      value:
        "The governance and management functions and the attitude of those charged with governance towards control",
    },
    {
      key: "Segregation of duties",
      value: "Dividing authorisation, custody and recording among different persons",
    },
    {
      key: "Walk through test",
      value:
        "Tracing one transaction through the whole system to confirm the auditor's understanding",
    },
    {
      key: "Test of control",
      value: "A procedure to evaluate the operating effectiveness of a control",
    },
    {
      key: "Substantive procedure",
      value: "A procedure to detect material misstatement at the assertion level",
    },
    {
      key: "General IT control",
      value:
        "A control over access, change management and operations that supports the application controls",
    },
    {
      key: "Application control",
      value: "An automated control within a business process, such as a validation check",
    },
    {
      key: "Audit trail",
      value:
        "The chain of records allowing a transaction to be traced from source to the financial statements",
    },
  ],
  [
    {
      key: "Limitation of internal control",
      value: "Human error, collusion, management override and the cost benefit constraint",
    },
    {
      key: "Effect of a weak control environment on the audit",
      value: "The auditor increases substantive testing and may perform more work at the year end",
    },
    {
      key: "Computer assisted audit technique",
      value: "Software used to test data and extract exceptions from large populations",
    },
    {
      key: "Risk of auditing around the computer",
      value:
        "The processing logic is never tested, so systematic errors within the system may go undetected",
    },
    {
      key: "Reason management override is a significant risk",
      value:
        "Management can circumvent controls that otherwise operate effectively, so journal entries are always tested",
    },
  ],
);

aud(
  "au:evidence-sampling",
  "Audit Evidence, Sampling and Analytical Procedures",
  "In audit evidence, what is %s?",
  "%k is %v.",
  [
    { key: "Standard on audit evidence", value: "SA 500" },
    { key: "Standard on audit sampling", value: "SA 530" },
    { key: "Standard on analytical procedures", value: "SA 520" },
    { key: "Standard on external confirmations", value: "SA 505" },
    {
      key: "Sufficiency of audit evidence",
      value: "The measure of the quantity of audit evidence",
    },
    {
      key: "Appropriateness of audit evidence",
      value: "The measure of the quality, that is its relevance and reliability",
    },
    {
      key: "Most reliable source of audit evidence",
      value: "Evidence obtained directly by the auditor from an independent external source",
    },
    {
      key: "Audit sampling",
      value:
        "Applying procedures to less than one hundred per cent of a population so that all units have a chance of selection",
    },
    {
      key: "Statistical sampling",
      value: "Sampling using random selection and probability theory to evaluate the results",
    },
    {
      key: "Analytical procedure",
      value:
        "Evaluation of financial information through the study of plausible relationships among data",
    },
  ],
  [
    {
      key: "Sampling risk",
      value:
        "The risk that the conclusion from a sample differs from the conclusion that testing the whole population would give",
    },
    {
      key: "Non-sampling risk",
      value:
        "The risk of a wrong conclusion for any reason other than sampling, such as an inappropriate procedure",
    },
    {
      key: "Stratification",
      value:
        "Dividing a population into sub-populations of similar characteristics to improve efficiency",
    },
    {
      key: "Positive and negative confirmation",
      value:
        "A positive request asks for a reply in every case, a negative only if the respondent disagrees",
    },
    {
      key: "Treatment of a deviation found in a sample",
      value:
        "It is projected to the population and the effect on the assessed risk is reconsidered",
    },
  ],
);

aud(
  "au:audit-report",
  "The Audit Report and Modified Opinions",
  "In the auditor's report, what is %s?",
  "%k is %v.",
  [
    { key: "Standard on forming an opinion and reporting", value: "SA 700" },
    { key: "Standard on modifications to the opinion", value: "SA 705" },
    { key: "Standard on emphasis of matter and other matter paragraphs", value: "SA 706" },
    { key: "Standard on key audit matters", value: "SA 701" },
    {
      key: "Unmodified opinion",
      value:
        "The opinion expressed when the statements are prepared, in all material respects, in accordance with the framework",
    },
    {
      key: "Qualified opinion",
      value:
        "The opinion where misstatements are material but not pervasive, or evidence is lacking but not pervasively",
    },
    {
      key: "Adverse opinion",
      value: "The opinion where misstatements are both material and pervasive",
    },
    {
      key: "Disclaimer of opinion",
      value:
        "Issued where the auditor cannot obtain sufficient appropriate evidence and the possible effects are pervasive",
    },
    {
      key: "Emphasis of matter paragraph",
      value:
        "A paragraph drawing attention to a matter properly presented or disclosed that is fundamental to users' understanding",
    },
    {
      key: "Key audit matters",
      value:
        "Matters that were of most significance in the audit, communicated in the report of a listed entity",
    },
  ],
  [
    {
      key: "Meaning of pervasive",
      value:
        "Effects that are not confined to specific elements, or if so confined represent a substantial proportion, or are fundamental to users' understanding",
    },
    {
      key: "Difference between an emphasis of matter and a qualification",
      value: "An emphasis of matter does not modify the opinion, a qualification does",
    },
    {
      key: "Standard on going concern",
      value:
        "SA 570, requiring evaluation of management's assessment and reporting of material uncertainty",
    },
    { key: "Standard on comparative information", value: "SA 710" },
    {
      key: "Reporting when the entity's records are not maintained as required",
      value:
        "The auditor reports the fact under section 143(3) and considers the effect on the opinion",
    },
  ],
);

aud(
  "au:audit-of-items",
  "Audit of Items of Financial Statements",
  "In the audit of specific items, what is %s?",
  "%k is %v.",
  [
    {
      key: "Principal assertion tested for sales",
      value: "Occurrence, that recorded sales actually took place",
    },
    {
      key: "Principal assertion tested for purchases and liabilities",
      value: "Completeness, that all liabilities incurred have been recorded",
    },
    {
      key: "Chief procedure for verifying inventory",
      value: "Attendance at the physical count and testing the counts",
    },
    { key: "Standard on inventory attendance", value: "SA 501" },
    {
      key: "Chief procedure for verifying trade receivables",
      value: "External confirmation from customers",
    },
    {
      key: "Cut off procedure",
      value: "Testing that transactions near the year end are recorded in the correct period",
    },
    {
      key: "Vouching",
      value: "Examining documentary evidence in support of an entry in the books",
    },
    {
      key: "Verification",
      value:
        "Establishing the existence, ownership, valuation and presentation of an asset or liability",
    },
    { key: "Chief risk in the audit of cash", value: "Misappropriation and teeming and lading" },
    {
      key: "Teeming and lading",
      value:
        "Concealing a shortage by applying a later receipt against an earlier customer's account",
    },
  ],
  [
    {
      key: "Audit of a contingent liability",
      value:
        "Enquiry of management and legal counsel, review of board minutes, and confirmation that disclosure is adequate",
    },
    {
      key: "Audit of depreciation",
      value:
        "Testing the rate, method, consistency and the completeness of the asset register against the accounting policy",
    },
    {
      key: "Window dressing of current assets",
      value:
        "Recording sales after the year end as before it, or delaying the recording of purchases, to improve ratios",
    },
    {
      key: "Audit of related party transactions",
      value:
        "SA 550 requires identification of relationships, evaluation of the business rationale and adequacy of disclosure",
    },
    {
      key: "Written representation",
      value:
        "A written statement by management to the auditor under SA 580, which is evidence but not a substitute for other evidence",
    },
  ],
);

/* ================================================= Financial Management */

fm(
  "fm:scope-objectives",
  "Scope and Objectives of Financial Management",
  "In financial management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Financial management",
      value:
        "The planning, organising, directing and controlling of the financial activities of an enterprise",
    },
    {
      key: "Primary objective of financial management",
      value: "Maximisation of shareholder wealth",
    },
    {
      key: "Three key decisions in financial management",
      value: "The investment, financing and dividend decisions",
    },
    {
      key: "Investment decision",
      value: "The decision on where to commit the firm's long-term funds",
    },
    {
      key: "Financing decision",
      value: "The decision on the mix of debt and equity used to raise funds",
    },
    {
      key: "Time value of money",
      value: "The principle that a rupee today is worth more than a rupee tomorrow",
    },
    { key: "Compounding", value: "Finding the future value of a present sum" },
    { key: "Discounting", value: "Finding the present value of a future sum" },
    { key: "Annuity", value: "A series of equal cash flows at regular intervals" },
    { key: "Perpetuity", value: "An annuity that continues for ever" },
    {
      key: "Present value of a perpetuity",
      value: "The annual cash flow divided by the discount rate",
    },
  ],
  [
    {
      key: "Reason wealth maximisation is preferred to profit maximisation",
      value: "It accounts for the timing and the risk of cash flows, which profit alone ignores",
    },
    {
      key: "Agency problem",
      value:
        "The conflict between managers and shareholders when managers pursue their own interests",
    },
    {
      key: "Effective annual rate for a nominal rate compounded more than once a year",
      value:
        "One plus the nominal rate divided by the number of periods, raised to that number, less one",
    },
    {
      key: "Rule of 72",
      value: "A sum roughly doubles in seventy two divided by the rate per cent years",
    },
    {
      key: "Treasury function",
      value: "Management of cash, banking relationships, funding and financial risk",
    },
  ],
);

fm(
  "fm:cost-of-capital",
  "Cost of Capital, Leverage and Capital Structure",
  "In the cost of capital, what is %s?",
  "%k is %v.",
  [
    {
      key: "Cost of capital",
      value: "The minimum return a firm must earn to satisfy its providers of funds",
    },
    {
      key: "Weighted average cost of capital",
      value: "The cost of each source weighted by its proportion in the capital structure",
    },
    {
      key: "Cost of debt after tax",
      value: "The interest rate multiplied by one less the tax rate",
    },
    {
      key: "Cost of equity under the dividend growth model",
      value: "The next dividend divided by the market price, plus the growth rate",
    },
    {
      key: "Cost of equity under the capital asset pricing model",
      value: "The risk free rate plus beta times the market risk premium",
    },
    { key: "Beta", value: "A measure of the systematic risk of a security relative to the market" },
    {
      key: "Operating leverage",
      value: "The contribution divided by earnings before interest and tax",
    },
    {
      key: "Financial leverage",
      value: "Earnings before interest and tax divided by earnings before tax",
    },
    { key: "Combined leverage", value: "The product of operating and financial leverage" },
    {
      key: "Trading on equity",
      value: "Using fixed cost debt to raise the return to equity shareholders",
    },
  ],
  [
    {
      key: "Net income approach to capital structure",
      value: "Value rises and the cost of capital falls as more debt is used",
    },
    {
      key: "Net operating income approach",
      value:
        "The overall cost of capital and the value of the firm are independent of the capital structure",
    },
    {
      key: "Modigliani and Miller proposition without taxes",
      value: "The value of the firm is unaffected by leverage in a perfect market",
    },
    {
      key: "Modigliani and Miller proposition with taxes",
      value: "Value rises with leverage by the present value of the interest tax shield",
    },
    {
      key: "Trade off theory of capital structure",
      value:
        "The optimum gearing balances the tax shield of debt against the costs of financial distress",
    },
  ],
);

fm(
  "fm:capital-budgeting",
  "Capital Budgeting and Investment Appraisal",
  "In capital budgeting, what is %s?",
  "%k is %v.",
  [
    {
      key: "Capital budgeting",
      value: "The process of evaluating and selecting long-term investment proposals",
    },
    {
      key: "Payback period",
      value: "The time taken for the cash inflows to recover the initial outlay",
    },
    {
      key: "Net present value",
      value: "The present value of the inflows less the present value of the outflows",
    },
    {
      key: "Decision rule under net present value",
      value: "Accept the project if the net present value is positive",
    },
    {
      key: "Internal rate of return",
      value: "The discount rate at which the net present value is zero",
    },
    {
      key: "Decision rule under internal rate of return",
      value: "Accept the project if the internal rate of return exceeds the cost of capital",
    },
    {
      key: "Profitability index",
      value: "The present value of the inflows divided by the initial investment",
    },
    {
      key: "Accounting rate of return",
      value: "Average annual profit after tax divided by the average investment",
    },
    {
      key: "Discounted payback period",
      value: "The time taken to recover the outlay from the discounted cash inflows",
    },
    { key: "Sunk cost", value: "A cost already incurred that is irrelevant to the decision" },
  ],
  [
    {
      key: "Reason net present value is preferred to internal rate of return",
      value:
        "It assumes reinvestment at the cost of capital and measures the absolute addition to wealth",
    },
    {
      key: "Multiple internal rates of return",
      value: "They arise when the cash flow stream changes sign more than once",
    },
    {
      key: "Capital rationing",
      value:
        "Selecting projects when funds are limited, usually by ranking on the profitability index",
    },
    {
      key: "Equivalent annual cost",
      value:
        "The annuity whose present value equals the cost of a project, used to compare assets of unequal life",
    },
    {
      key: "Treatment of depreciation in capital budgeting",
      value: "It is added back as a non-cash charge, but its tax shield is counted",
    },
  ],
);

fm(
  "fm:working-capital",
  "Working Capital Management",
  "In working capital management, what is %s?",
  "%k is %v.",
  [
    { key: "Working capital", value: "The excess of current assets over current liabilities" },
    { key: "Gross working capital", value: "The total investment in current assets" },
    {
      key: "Operating cycle",
      value:
        "The time from the purchase of raw material to the collection of cash from the customer",
    },
    {
      key: "Cash conversion cycle",
      value: "The operating cycle less the creditors' payment period",
    },
    { key: "Current ratio", value: "Current assets divided by current liabilities" },
    { key: "Quick ratio", value: "Current assets less inventory, divided by current liabilities" },
    {
      key: "Economic order quantity",
      value: "The order size that minimises the total of ordering and carrying cost",
    },
    {
      key: "ABC analysis of inventory",
      value:
        "Classifying items by value so that control effort is concentrated on the high value few",
    },
    {
      key: "Factoring",
      value: "Sale of trade receivables to a financial institution for immediate cash",
    },
    {
      key: "Commercial paper as a source of working capital",
      value: "An unsecured short-term promissory note issued by a creditworthy company",
    },
  ],
  [
    {
      key: "Conservative working capital policy",
      value:
        "Holding a high level of current assets financed largely by long-term funds, giving low risk and low return",
    },
    {
      key: "Aggressive working capital policy",
      value:
        "Holding a low level of current assets financed largely by short-term funds, giving high risk and high return",
    },
    {
      key: "Baumol model",
      value:
        "A model applying the economic order quantity logic to determine the optimum cash balance",
    },
    {
      key: "Miller Orr model",
      value:
        "A model setting upper and lower cash limits with a return point, for uncertain cash flows",
    },
    {
      key: "Cost of forgoing a cash discount of two ten net thirty",
      value: "About thirty seven per cent a year, so the discount is usually worth taking",
    },
  ],
);

fm(
  "fm:financing-sources",
  "Sources of Finance and Financial Markets",
  "Among sources of finance, what is %s?",
  "%k is %v.",
  [
    {
      key: "Equity share capital",
      value: "Permanent risk capital carrying voting rights and a residual claim",
    },
    {
      key: "Preference share capital",
      value: "Capital carrying a preferential right to dividend and to repayment on winding up",
    },
    {
      key: "Debenture",
      value:
        "An instrument acknowledging a debt of the company, usually carrying a fixed rate of interest",
    },
    {
      key: "Retained earnings",
      value: "Profits ploughed back into the business, the cheapest source of long-term funds",
    },
    { key: "Term loan", value: "A loan from a bank or institution repayable over a fixed period" },
    {
      key: "Rights issue",
      value: "An issue of shares to existing shareholders in proportion to their holding",
    },
    {
      key: "Bonus issue",
      value: "A free issue of shares to existing shareholders out of reserves",
    },
    { key: "Initial public offer", value: "The first sale of shares by a company to the public" },
    {
      key: "Primary market",
      value: "The market in which securities are issued for the first time",
    },
    {
      key: "Secondary market",
      value: "The market in which existing securities are traded between investors",
    },
  ],
  [
    {
      key: "Book building",
      value:
        "A price discovery process in which bids are collected within a price band before the issue price is fixed",
    },
    {
      key: "Green shoe option",
      value: "An over-allotment option allowing the issuer to stabilise the price after listing",
    },
    {
      key: "Deep discount bond",
      value:
        "A bond issued far below face value that pays no periodic interest and is redeemed at par",
    },
    {
      key: "Difference between a debenture and a share",
      value:
        "A debenture is a creditor's claim carrying interest, a share is ownership carrying dividend",
    },
    {
      key: "Seed and venture capital",
      value:
        "Equity finance for an unproven idea and for an early stage high growth business respectively",
    },
  ],
);

fm(
  "fm:strategic-management",
  "Strategic Management and Strategic Analysis",
  "In strategic management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Strategy",
      value: "The direction and scope of an organisation over the long term to achieve advantage",
    },
    {
      key: "Vision statement",
      value: "A statement of what the organisation aspires to become in the future",
    },
    {
      key: "Mission statement",
      value: "A statement of the present purpose and business of the organisation",
    },
    {
      key: "SWOT analysis",
      value: "An analysis of strengths, weaknesses, opportunities and threats",
    },
    {
      key: "PESTLE analysis",
      value:
        "An analysis of political, economic, social, technological, legal and environmental factors",
    },
    {
      key: "Porter's five forces",
      value:
        "Rivalry, threat of new entrants, threat of substitutes, bargaining power of buyers and of suppliers",
    },
    {
      key: "Cost leadership strategy",
      value: "Competing by becoming the lowest cost producer in the industry",
    },
    {
      key: "Differentiation strategy",
      value: "Competing by offering something the customer perceives as unique",
    },
    {
      key: "Focus strategy",
      value: "Competing by serving a narrow segment better than broader rivals",
    },
    {
      key: "Value chain",
      value: "The set of primary and support activities through which a firm creates value",
    },
  ],
  [
    {
      key: "Stuck in the middle",
      value:
        "Porter's term for a firm that pursues no generic strategy consistently and so earns below average returns",
    },
    {
      key: "BCG matrix categories",
      value:
        "Stars, cash cows, question marks and dogs, plotted on growth and relative market share",
    },
    {
      key: "Ansoff matrix",
      value: "Market penetration, market development, product development and diversification",
    },
    {
      key: "Core competence",
      value: "A capability that is valuable, rare, hard to imitate and organised for use",
    },
    {
      key: "Difference between strategy formulation and implementation",
      value:
        "Formulation is entrepreneurial and analytical, implementation is operational and depends on structure, systems and people",
    },
  ],
);

export const CA_INTER_FULL_TEMPLATES = templates;
