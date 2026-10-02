/**
 * The CA Final papers, filled out against the ICAI new scheme.
 *
 * Financial Reporting, Advanced Financial Management, Direct Tax Laws and
 * International Taxation, Indirect Tax Laws and Advanced Auditing each carried
 * only a handful of chapters, which is nowhere near a 100 mark ICAI paper.
 * Every chapter below is a module the institute actually sets, and the same
 * ground is examined by CS Professional and CMA Final.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const PRO = ["CA Final", "CS Professional", "CMA Final"];

const templates: Template[] = [];
const fr = chapterFactory(templates, "Financial Reporting", PRO);
const afm = chapterFactory(templates, "Strategic Financial Management", PRO);

/* ================================================== Financial Reporting */

fr(
  "fr:ppe-borrowing",
  "Ind AS 16 and Ind AS 23 — Property, Plant and Equipment",
  "Under the standards on fixed assets, what is %s?",
  "%k is %v.",
  [
    { key: "Standard governing property, plant and equipment", value: "Ind AS 16" },
    { key: "Standard governing borrowing costs", value: "Ind AS 23" },
    { key: "Standard governing intangible assets", value: "Ind AS 38" },
    { key: "Standard governing investment property", value: "Ind AS 40" },
    { key: "Standard governing impairment of assets", value: "Ind AS 36" },
    {
      key: "Cost of an item of property, plant and equipment",
      value: "Purchase price, directly attributable costs and the estimated cost of dismantling",
    },
    {
      key: "Qualifying asset under Ind AS 23",
      value:
        "An asset that necessarily takes a substantial period of time to get ready for its intended use or sale",
    },
    {
      key: "Treatment of borrowing cost on a qualifying asset",
      value: "It is capitalised as part of the cost of that asset",
    },
    {
      key: "Residual value",
      value: "The amount the entity would obtain on disposal at the end of the asset's useful life",
    },
    {
      key: "Recoverable amount under Ind AS 36",
      value: "The higher of fair value less costs of disposal and value in use",
    },
  ],
  [
    {
      key: "Revaluation model under Ind AS 16",
      value:
        "The asset is carried at fair value less subsequent depreciation, and the whole class must be revalued",
    },
    {
      key: "Treatment of a revaluation surplus",
      value:
        "It is credited to other comprehensive income and accumulated in a revaluation reserve in equity",
    },
    {
      key: "Point at which capitalisation of borrowing cost ceases",
      value:
        "When substantially all the activities necessary to prepare the asset for use are complete",
    },
    {
      key: "Treatment of income earned on temporary investment of specific borrowings",
      value: "It is deducted from the borrowing cost eligible for capitalisation",
    },
    {
      key: "Difference between Ind AS 40 and Ind AS 16",
      value:
        "Investment property is held to earn rentals or for capital appreciation, not for use in production or supply",
    },
  ],
);

fr(
  "fr:employee-sbp",
  "Ind AS 19 and Ind AS 102 — Employee Benefits and Share-based Payment",
  "In accounting for employee benefits, what is %s?",
  "%k is %v.",
  [
    { key: "Standard governing employee benefits", value: "Ind AS 19" },
    { key: "Standard governing share-based payment", value: "Ind AS 102" },
    {
      key: "Defined contribution plan",
      value: "A plan under which the employer's obligation is limited to the agreed contribution",
    },
    {
      key: "Defined benefit plan",
      value:
        "A plan under which the employer bears the actuarial and investment risk of the promised benefit",
    },
    {
      key: "Short-term employee benefit",
      value:
        "A benefit expected to be settled wholly within twelve months of the end of the period",
    },
    {
      key: "Method used to measure a defined benefit obligation",
      value: "The projected unit credit method",
    },
    {
      key: "Treatment of actuarial gains and losses",
      value:
        "They are recognised in other comprehensive income and never reclassified to profit or loss",
    },
    {
      key: "Equity-settled share-based payment",
      value: "A transaction settled by issuing the entity's own equity instruments",
    },
    {
      key: "Cash-settled share-based payment",
      value: "A transaction settled in cash based on the price of the entity's equity instruments",
    },
    {
      key: "Grant date",
      value:
        "The date on which the entity and the counterparty agree to the share-based payment arrangement",
    },
  ],
  [
    {
      key: "Measurement of an equity-settled award to an employee",
      value:
        "At the fair value of the equity instrument on the grant date, never remeasured afterwards",
    },
    {
      key: "Measurement of a cash-settled award",
      value:
        "At the fair value of the liability, remeasured at every reporting date until settlement",
    },
    {
      key: "Vesting condition",
      value:
        "A condition that determines whether the entity receives the services entitling the counterparty to the award",
    },
    {
      key: "Treatment of a market vesting condition",
      value: "It is built into the grant date fair value and is not trued up if it fails",
    },
    {
      key: "Net interest on a defined benefit liability",
      value:
        "The discount rate applied to the net defined benefit liability, recognised in profit or loss",
    },
  ],
);

fr(
  "fr:business-combinations",
  "Ind AS 103 — Business Combinations and Goodwill",
  "In a business combination, what is %s?",
  "%k is %v.",
  [
    { key: "Standard governing business combinations", value: "Ind AS 103" },
    { key: "Method required for a business combination", value: "The acquisition method" },
    { key: "Acquirer", value: "The entity that obtains control of the acquiree" },
    {
      key: "Acquisition date",
      value: "The date on which the acquirer obtains control of the acquiree",
    },
    {
      key: "Goodwill in a business combination",
      value:
        "Consideration transferred plus non-controlling interest less the net identifiable assets acquired",
    },
    {
      key: "Treatment of a bargain purchase",
      value:
        "After reassessment, the gain is recognised in other comprehensive income and taken to capital reserve",
    },
    {
      key: "Treatment of acquisition-related costs",
      value: "They are expensed as incurred and never added to the cost of the combination",
    },
    {
      key: "Measurement of identifiable assets and liabilities acquired",
      value: "At their acquisition-date fair value",
    },
    {
      key: "Contingent consideration",
      value:
        "Additional consideration payable if agreed future events occur, measured at fair value on the acquisition date",
    },
    {
      key: "Measurement period under Ind AS 103",
      value: "A maximum of one year from the acquisition date to finalise provisional amounts",
    },
  ],
  [
    {
      key: "Two options for measuring non-controlling interest",
      value:
        "At fair value, or at the proportionate share of the acquiree's net identifiable assets",
    },
    {
      key: "Treatment of goodwill after recognition",
      value: "It is not amortised but tested for impairment at least annually under Ind AS 36",
    },
    {
      key: "Common control business combination",
      value: "It is accounted for by the pooling of interests method with restated prior periods",
    },
    {
      key: "Treatment of a previously held equity interest in a step acquisition",
      value:
        "It is remeasured to fair value at the acquisition date and the gain or loss taken to profit or loss",
    },
    {
      key: "Treatment of a change in contingent consideration classified as a liability",
      value:
        "It is remeasured to fair value at each reporting date with the change in profit or loss",
    },
  ],
);

fr(
  "fr:income-taxes",
  "Ind AS 12 — Accounting for Income Taxes",
  "In accounting for income taxes, what is %s?",
  "%k is %v.",
  [
    { key: "Standard governing income taxes", value: "Ind AS 12" },
    {
      key: "Approach followed by Ind AS 12",
      value: "The balance sheet approach, based on temporary differences",
    },
    {
      key: "Temporary difference",
      value: "The difference between the carrying amount of an asset or liability and its tax base",
    },
    {
      key: "Tax base of an asset",
      value: "The amount deductible for tax purposes against future taxable economic benefits",
    },
    {
      key: "Taxable temporary difference",
      value: "A difference that will give rise to taxable amounts in future periods",
    },
    {
      key: "Deductible temporary difference",
      value: "A difference that will give rise to deductible amounts in future periods",
    },
    { key: "Result of a taxable temporary difference", value: "A deferred tax liability" },
    { key: "Result of a deductible temporary difference", value: "A deferred tax asset" },
    { key: "Current tax", value: "The tax payable on the taxable profit of the period" },
    {
      key: "Rate at which deferred tax is measured",
      value: "The rate expected to apply when the asset is realised or the liability settled",
    },
  ],
  [
    {
      key: "Condition for recognising a deferred tax asset",
      value:
        "It is probable that future taxable profit will be available against which it can be used",
    },
    {
      key: "Treatment of deferred tax on a revaluation surplus",
      value: "It is recognised in other comprehensive income, following the item it relates to",
    },
    {
      key: "Permissibility of discounting deferred tax",
      value: "Deferred tax assets and liabilities must not be discounted",
    },
    {
      key: "Initial recognition exemption",
      value:
        "No deferred tax is recognised on initial recognition of an asset or liability outside a business combination that affects neither accounting nor taxable profit",
    },
    {
      key: "Treatment of unused tax losses",
      value:
        "A deferred tax asset is recognised only to the extent that future taxable profit is probable, with convincing evidence",
    },
  ],
);

fr(
  "fr:financial-analysis",
  "Analysis of Financial Statements and Corporate Reporting",
  "In the analysis of financial statements, what is %s?",
  "%k is %v.",
  [
    {
      key: "Horizontal analysis",
      value: "Comparison of a line item across several accounting periods",
    },
    {
      key: "Vertical analysis",
      value: "Expression of every line item as a percentage of a base figure in the same statement",
    },
    {
      key: "Return on capital employed",
      value: "Earnings before interest and tax divided by capital employed",
    },
    { key: "Debt to equity ratio", value: "Total debt divided by shareholders' funds" },
    {
      key: "Interest coverage ratio",
      value: "Earnings before interest and tax divided by interest expense",
    },
    {
      key: "Earnings per share",
      value:
        "Profit attributable to equity holders divided by the weighted average number of equity shares",
    },
    { key: "Standard governing earnings per share", value: "Ind AS 33" },
    {
      key: "Diluted earnings per share",
      value: "Earnings per share adjusted for all dilutive potential equity shares",
    },
    { key: "Standard governing operating segments", value: "Ind AS 108" },
    { key: "Standard governing related party disclosures", value: "Ind AS 24" },
  ],
  [
    {
      key: "Window dressing",
      value: "Presenting the accounts so as to show a healthier position than the facts warrant",
    },
    {
      key: "Chief operating decision maker under Ind AS 108",
      value:
        "The function that allocates resources to and assesses the performance of the operating segments",
    },
    {
      key: "Treatment of a bonus issue in computing earnings per share",
      value:
        "It is treated as if it occurred at the beginning of the earliest period presented, and prior figures are restated",
    },
    {
      key: "Antidilutive potential equity shares",
      value:
        "Shares whose conversion would increase earnings per share, so they are excluded from the diluted figure",
    },
    {
      key: "Purpose of a common size statement",
      value:
        "It allows comparison between entities of different size by removing the effect of scale",
    },
  ],
);

fr(
  "fr:integrated-reporting",
  "Integrated Reporting and Sustainability Disclosure",
  "In integrated and sustainability reporting, what is %s?",
  "%k is %v.",
  [
    {
      key: "Integrated reporting",
      value:
        "A concise report on how an organisation creates value over the short, medium and long term",
    },
    {
      key: "Body that issued the Integrated Reporting Framework",
      value: "The International Integrated Reporting Council",
    },
    {
      key: "Six capitals of integrated reporting",
      value:
        "Financial, manufactured, intellectual, human, social and relationship, and natural capital",
    },
    {
      key: "Indian sustainability report mandated by SEBI",
      value: "The Business Responsibility and Sustainability Report",
    },
    {
      key: "Entities required to file a BRSR",
      value: "The top one thousand listed entities by market capitalisation",
    },
    {
      key: "Value creation",
      value:
        "The increase, decrease or transformation of the capitals brought about by the organisation's activities",
    },
    { key: "Triple bottom line", value: "Reporting on people, planet and profit together" },
    {
      key: "Corporate social responsibility obligation under the Companies Act",
      value:
        "Two per cent of the average net profit of the three immediately preceding financial years",
    },
    { key: "Section of the Companies Act governing CSR", value: "Section 135" },
    {
      key: "ESG",
      value:
        "Environmental, social and governance factors used to judge an entity's sustainability",
    },
  ],
  [
    {
      key: "Guiding principles of the Integrated Reporting Framework",
      value:
        "Strategic focus, connectivity of information, stakeholder relationships, materiality, conciseness, reliability and consistency",
    },
    {
      key: "Difference between an integrated report and an annual report",
      value:
        "An integrated report explains value creation across all six capitals, not only the financial outcome",
    },
    {
      key: "Greenwashing",
      value:
        "Presenting a misleadingly favourable picture of an entity's environmental performance",
    },
    {
      key: "Materiality in sustainability reporting",
      value:
        "A matter is material if it substantively affects the organisation's ability to create value",
    },
    {
      key: "Value reporting foundation",
      value: "The body formed by the merger of the IIRC and SASB, later consolidated into the ISSB",
    },
  ],
);

/* =================================== Advanced Financial Management ==== */

afm(
  "afm:mergers",
  "Mergers, Acquisitions and Corporate Restructuring",
  "In mergers and acquisitions, what is %s?",
  "%k is %v.",
  [
    {
      key: "Merger",
      value:
        "The combination of two or more entities into one, with the transferor ceasing to exist",
    },
    {
      key: "Amalgamation in the nature of merger",
      value: "A combination in which the businesses and shareholders of both companies continue",
    },
    { key: "Horizontal merger", value: "A merger between two firms in the same line of business" },
    {
      key: "Vertical merger",
      value: "A merger between firms at different stages of the same production chain",
    },
    { key: "Conglomerate merger", value: "A merger between firms in unrelated businesses" },
    {
      key: "Takeover",
      value: "Acquisition of control over the management of a company by buying its shares",
    },
    {
      key: "Demerger",
      value: "The transfer of one or more undertakings of a company to another company",
    },
    {
      key: "Synergy",
      value:
        "The value of the combined firm in excess of the sum of the values of the separate firms",
    },
    {
      key: "Swap ratio",
      value: "The number of shares of the acquirer issued for each share of the target",
    },
    {
      key: "Leveraged buyout",
      value: "An acquisition financed largely by debt secured on the assets of the target",
    },
  ],
  [
    {
      key: "Poison pill",
      value:
        "A defence that makes the target unattractive, often by letting existing holders buy shares cheaply",
    },
    {
      key: "White knight",
      value: "A friendly acquirer sought by a target to escape a hostile bidder",
    },
    {
      key: "Basis on which a swap ratio is usually fixed",
      value:
        "The relative intrinsic values of the two companies, by earnings, assets or market price",
    },
    {
      key: "Reverse merger",
      value: "An unlisted company merges into a listed one to gain a listing without an issue",
    },
    {
      key: "Effect of a merger on earnings per share of the acquirer",
      value:
        "It is accretive if the target is bought at a price earnings ratio below the acquirer's own",
    },
  ],
);

afm(
  "afm:security-valuation",
  "Security Analysis and Business Valuation",
  "In security analysis and valuation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Intrinsic value of a share",
      value: "The present value of the future cash flows expected from it",
    },
    {
      key: "Dividend discount model",
      value:
        "Value equals the next dividend divided by the difference between the required return and the growth rate",
    },
    { key: "Price earnings ratio", value: "Market price per share divided by earnings per share" },
    { key: "Book value per share", value: "Net worth divided by the number of equity shares" },
    {
      key: "Free cash flow to the firm",
      value:
        "Operating cash flow after tax less capital expenditure and the increase in working capital",
    },
    {
      key: "Free cash flow to equity",
      value: "Free cash flow to the firm less interest after tax plus net new borrowing",
    },
    {
      key: "Enterprise value",
      value: "Market capitalisation plus debt less cash and cash equivalents",
    },
    {
      key: "Fundamental analysis",
      value: "Valuation from the economy, the industry and the company's financials",
    },
    { key: "Technical analysis", value: "Forecasting price from past price and volume patterns" },
    {
      key: "Efficient market hypothesis",
      value: "The proposition that prices already reflect all available information",
    },
  ],
  [
    { key: "Three forms of market efficiency", value: "Weak, semi-strong and strong form" },
    {
      key: "Gordon growth model assumption",
      value:
        "Dividends grow at a constant rate for ever and that rate is less than the required return",
    },
    {
      key: "Economic value added",
      value: "Net operating profit after tax less the capital charge on capital employed",
    },
    {
      key: "Market value added",
      value: "Market value of the firm less the capital contributed by investors",
    },
    {
      key: "Reason a relative valuation uses a peer multiple",
      value:
        "It prices the company against comparable firms when forecasting cash flows is unreliable",
    },
  ],
);

afm(
  "afm:portfolio-mutual-funds",
  "Portfolio Performance and Mutual Funds",
  "In portfolio management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Mutual fund",
      value: "A trust that pools money from investors and invests it in securities",
    },
    {
      key: "Net asset value",
      value: "The net assets of a scheme divided by the number of units outstanding",
    },
    {
      key: "Open-ended scheme",
      value: "A scheme with no fixed maturity in which units can be bought and sold continuously",
    },
    {
      key: "Close-ended scheme",
      value: "A scheme with a fixed maturity whose units are listed on an exchange",
    },
    {
      key: "Exchange traded fund",
      value: "A fund tracking an index whose units trade on a stock exchange like a share",
    },
    {
      key: "Systematic investment plan",
      value: "Investing a fixed sum at regular intervals in a scheme",
    },
    {
      key: "Sharpe ratio",
      value:
        "Excess return over the risk free rate divided by the standard deviation of the portfolio",
    },
    {
      key: "Treynor ratio",
      value: "Excess return over the risk free rate divided by the beta of the portfolio",
    },
    {
      key: "Jensen's alpha",
      value:
        "The return of the portfolio in excess of that predicted by the capital asset pricing model",
    },
    {
      key: "Regulator of mutual funds in India",
      value: "The Securities and Exchange Board of India",
    },
  ],
  [
    {
      key: "Difference between the Sharpe and Treynor measures",
      value:
        "Sharpe uses total risk while Treynor uses only systematic risk, so Treynor suits a well diversified portfolio",
    },
    {
      key: "Expense ratio",
      value: "The annual cost of running a scheme as a percentage of its average net assets",
    },
    {
      key: "Tracking error",
      value:
        "The standard deviation of the difference between the returns of a fund and its benchmark",
    },
    {
      key: "Effect of diversification on unsystematic risk",
      value: "It is reduced and can in principle be eliminated, while systematic risk remains",
    },
    {
      key: "Exit load",
      value:
        "A charge deducted from the redemption proceeds if units are sold within a stated period",
    },
  ],
);

afm(
  "afm:international-finance",
  "International Financial Management",
  "In international finance, what is %s?",
  "%k is %v.",
  [
    { key: "Spot rate", value: "The rate for immediate delivery of a currency" },
    {
      key: "Forward rate",
      value: "The rate agreed today for exchange of a currency at a future date",
    },
    {
      key: "Direct quotation",
      value: "The price of one unit of foreign currency in terms of the home currency",
    },
    {
      key: "Indirect quotation",
      value: "The number of units of foreign currency for one unit of the home currency",
    },
    {
      key: "Purchasing power parity",
      value: "Exchange rates adjust so that identical goods cost the same in both countries",
    },
    {
      key: "Interest rate parity",
      value: "The forward premium on a currency equals the differential in interest rates",
    },
    {
      key: "Transaction exposure",
      value:
        "The risk that the value of a committed foreign currency cash flow changes with the rate",
    },
    {
      key: "Translation exposure",
      value:
        "The risk that the reported value of foreign assets and liabilities changes on consolidation",
    },
    {
      key: "American depository receipt",
      value:
        "A negotiable instrument issued in the United States representing shares of a foreign company",
    },
    {
      key: "External commercial borrowing",
      value: "A loan raised by an Indian entity from a recognised lender abroad",
    },
  ],
  [
    {
      key: "Covered interest arbitrage",
      value:
        "Borrowing in the low interest currency and lending in the high interest one with the exchange risk hedged forward",
    },
    {
      key: "Economic exposure",
      value:
        "The effect of unexpected exchange rate changes on the present value of future operating cash flows",
    },
    {
      key: "Natural hedge",
      value:
        "Matching foreign currency receipts against payments in the same currency so the exposures offset",
    },
    {
      key: "Leading and lagging",
      value: "Advancing or postponing foreign currency payments in expectation of a rate movement",
    },
    {
      key: "Forward premium in annualised terms",
      value:
        "The forward less the spot rate, divided by the spot rate, times twelve over the number of months, expressed as a percentage",
    },
  ],
);

afm(
  "afm:interest-rate-risk",
  "Interest Rate Risk and Money Market Operations",
  "In interest rate risk management, what is %s?",
  "%k is %v.",
  [
    { key: "Money market", value: "The market for short-term funds of up to one year" },
    {
      key: "Treasury bill",
      value: "A short-term discounted instrument issued by the Government of India",
    },
    {
      key: "Commercial paper",
      value: "An unsecured short-term promissory note issued by a creditworthy company",
    },
    {
      key: "Certificate of deposit",
      value: "A negotiable short-term instrument issued by a bank against a deposit",
    },
    { key: "Call money", value: "Funds borrowed and lent between banks for one day" },
    {
      key: "Repo rate",
      value: "The rate at which the Reserve Bank lends to banks against government securities",
    },
    {
      key: "Yield curve",
      value: "A curve plotting yield against maturity for instruments of the same credit quality",
    },
    {
      key: "Duration of a bond",
      value:
        "The weighted average time to receipt of its cash flows, a measure of interest rate sensitivity",
    },
    {
      key: "Forward rate agreement",
      value: "A contract fixing an interest rate on a notional amount for a future period",
    },
    {
      key: "Interest rate swap",
      value:
        "An agreement to exchange fixed rate for floating rate interest payments on a notional principal",
    },
  ],
  [
    {
      key: "Relation between bond price and interest rate",
      value: "They move inversely, so a rise in rates lowers the price",
    },
    {
      key: "Modified duration",
      value:
        "Duration divided by one plus the yield, giving the percentage price change for a one per cent change in yield",
    },
    {
      key: "Convexity",
      value: "The curvature in the price yield relationship that duration alone does not capture",
    },
    {
      key: "Immunisation of a bond portfolio",
      value:
        "Matching the duration of the portfolio to the investment horizon so price and reinvestment risk offset",
    },
    {
      key: "Inverted yield curve",
      value:
        "A curve on which short-term yields exceed long-term yields, often read as a signal of slowdown",
    },
  ],
);

afm(
  "afm:dividend-startup",
  "Dividend Decisions, Lease Finance and Startup Funding",
  "In financing decisions, what is %s?",
  "%k is %v.",
  [
    {
      key: "Dividend policy",
      value: "The decision on how much of the earnings to distribute and how much to retain",
    },
    {
      key: "Walter's model conclusion for a growth firm",
      value:
        "The optimum payout is nil, because the return on investment exceeds the cost of capital",
    },
    {
      key: "Gordon's model",
      value:
        "A dividend capitalisation model in which value depends on payout, growth and the required return",
    },
    {
      key: "Modigliani and Miller dividend irrelevance",
      value: "In a perfect market the value of a firm is unaffected by its dividend policy",
    },
    { key: "Stock dividend", value: "A bonus issue of shares in place of a cash dividend" },
    {
      key: "Share buyback",
      value: "A company purchasing its own shares, which reduces the equity base",
    },
    {
      key: "Finance lease",
      value:
        "A lease that transfers substantially all the risks and rewards of ownership to the lessee",
    },
    {
      key: "Operating lease",
      value: "A lease that does not transfer substantially all the risks and rewards of ownership",
    },
    {
      key: "Venture capital",
      value: "Equity finance provided to young, high-risk, high-growth businesses",
    },
    {
      key: "Angel investor",
      value: "An individual who invests personal funds in a startup at a very early stage",
    },
  ],
  [
    {
      key: "Bird in the hand argument",
      value:
        "Investors prefer a certain current dividend to an uncertain future capital gain, so payout raises value",
    },
    {
      key: "Clientele effect",
      value:
        "A firm attracts the investors whose tax position and income needs suit its dividend policy",
    },
    {
      key: "Sale and lease back",
      value:
        "An owner sells an asset and immediately takes it back on lease to release locked up capital",
    },
    {
      key: "Seed capital",
      value: "The first funding used to prove a concept before a product exists",
    },
    {
      key: "Crowd funding",
      value:
        "Raising small amounts from a large number of people, usually through an online platform",
    },
  ],
);

/* ========================== Direct Tax Laws and International Taxation */

const dt = chapterFactory(templates, "Direct Tax Laws", PRO);

dt(
  "dt:pgbp",
  "Profits and Gains of Business or Profession — Advanced",
  "Under the head business or profession, what is %s?",
  "%k is %v.",
  [
    { key: "Section charging profits and gains of business or profession", value: "Section 28" },
    { key: "Section allowing depreciation", value: "Section 32" },
    { key: "Section allowing general business expenditure", value: "Section 37(1)" },
    {
      key: "Condition in section 37(1)",
      value:
        "The expenditure must be wholly and exclusively for the business and not capital or personal",
    },
    {
      key: "Section disallowing payments to a related person in excess of fair value",
      value: "Section 40A(2)",
    },
    { key: "Section disallowing cash payments above the limit", value: "Section 40A(3)" },
    {
      key: "Cash payment limit under section 40A(3)",
      value: "Ten thousand rupees, and thirty five thousand for goods carriage",
    },
    { key: "Section allowing certain deductions only on actual payment", value: "Section 43B" },
    { key: "Section for presumptive taxation of small business", value: "Section 44AD" },
    { key: "Section for presumptive taxation of professionals", value: "Section 44ADA" },
  ],
  [
    {
      key: "Rate of presumptive income under section 44AD",
      value:
        "Eight per cent of turnover, and six per cent for receipts through prescribed banking channels",
    },
    {
      key: "Additional depreciation under section 32(1)(iia)",
      value: "Twenty per cent of the cost of new plant and machinery acquired by a manufacturer",
    },
    {
      key: "Treatment of expenditure disallowed for want of tax deduction at source",
      value:
        "Thirty per cent of the sum is disallowed under section 40(a)(ia) and allowed in the year of payment",
    },
    {
      key: "Block of assets",
      value:
        "A group of assets of the same class and rate on which depreciation is computed collectively",
    },
    {
      key: "Treatment of speculation loss",
      value: "It can be set off only against speculation profit and carried forward for four years",
    },
  ],
);

dt(
  "dt:capital-gains",
  "Capital Gains — Advanced and Exemptions",
  "In capital gains, what is %s?",
  "%k is %v.",
  [
    { key: "Section charging capital gains", value: "Section 45" },
    {
      key: "Capital asset",
      value:
        "Property of any kind held by an assessee, excluding stock in trade and personal effects",
    },
    {
      key: "Holding period for a listed equity share to be long term",
      value: "More than twelve months",
    },
    {
      key: "Holding period for immovable property to be long term",
      value: "More than twenty four months",
    },
    { key: "Section giving the benefit of indexation", value: "The second proviso to section 48" },
    {
      key: "Section exempting gain on a residential house reinvested in a house",
      value: "Section 54",
    },
    { key: "Section exempting gain reinvested in specified bonds", value: "Section 54EC" },
    {
      key: "Limit of investment under section 54EC",
      value: "Fifty lakh rupees in a financial year",
    },
    { key: "Section taxing short-term gain on listed shares", value: "Section 111A" },
    {
      key: "Section taxing long-term gain on listed shares above the threshold",
      value: "Section 112A",
    },
  ],
  [
    {
      key: "Time limit to invest under section 54EC",
      value: "Six months from the date of transfer",
    },
    {
      key: "Capital gains account scheme",
      value:
        "A deposit made before the due date of return where the reinvestment is not complete, to preserve the exemption",
    },
    {
      key: "Full value of consideration for immovable property under section 50C",
      value:
        "The stamp duty value, if it exceeds the actual consideration beyond the tolerance limit",
    },
    {
      key: "Treatment of depreciable assets under section 50",
      value:
        "Gain on a block of assets is always deemed short term, whatever the period of holding",
    },
    {
      key: "Slump sale under section 50B",
      value:
        "Transfer of an undertaking for a lump sum, with the net worth taken as the cost of acquisition",
    },
  ],
);

dt(
  "dt:clubbing-setoff",
  "Clubbing, Set Off and Carry Forward of Losses",
  "In clubbing and set off, what is %s?",
  "%k is %v.",
  [
    { key: "Section clubbing the income of a spouse", value: "Section 64(1)" },
    { key: "Section clubbing the income of a minor child", value: "Section 64(1A)" },
    {
      key: "Exemption allowed on a minor's clubbed income",
      value: "One thousand five hundred rupees per child under section 10(32)",
    },
    { key: "Section on intra-head set off", value: "Section 70" },
    { key: "Section on inter-head set off", value: "Section 71" },
    {
      key: "Head against which a loss from house property can be set off",
      value: "Any head, subject to a limit of two lakh rupees in a year",
    },
    { key: "Carry forward period for a business loss", value: "Eight assessment years" },
    { key: "Carry forward period for unabsorbed depreciation", value: "Indefinite" },
    {
      key: "Set off allowed for a long-term capital loss",
      value: "Only against long-term capital gain",
    },
    { key: "Carry forward period for a capital loss", value: "Eight assessment years" },
  ],
  [
    {
      key: "Condition for carrying forward a business loss",
      value: "The return must be filed within the due date under section 139(1)",
    },
    {
      key: "Section restricting carry forward on change in shareholding of a closely held company",
      value: "Section 79",
    },
    {
      key: "Treatment of loss from owning and maintaining race horses",
      value: "Set off only against such income and carried forward for four years",
    },
    {
      key: "Set off allowed against winnings from lottery and card games",
      value: "No loss or expenditure may be set off against such winnings",
    },
    {
      key: "Order of set off of current depreciation, business loss and unabsorbed depreciation",
      value:
        "Current depreciation first, then brought forward business loss, then unabsorbed depreciation",
    },
  ],
);

dt(
  "dt:assessment-entities",
  "Assessment of Companies, Firms, Trusts and MAT",
  "In the assessment of entities, what is %s?",
  "%k is %v.",
  [
    { key: "Section providing minimum alternate tax", value: "Section 115JB" },
    { key: "Rate of minimum alternate tax on book profit", value: "Fifteen per cent" },
    { key: "Carry forward period for MAT credit", value: "Fifteen assessment years" },
    { key: "Section providing alternate minimum tax on non-corporates", value: "Section 115JC" },
    {
      key: "Concessional rate for a domestic company under section 115BAA",
      value: "Twenty two per cent, without specified deductions",
    },
    {
      key: "Concessional rate for a new manufacturing company under section 115BAB",
      value: "Fifteen per cent",
    },
    { key: "Section governing the assessment of a firm", value: "Section 184" },
    {
      key: "Limit on remuneration to working partners",
      value: "As prescribed in section 40(b), based on the book profit slabs",
    },
    {
      key: "Section exempting income of a charitable trust applied to its objects",
      value: "Section 11",
    },
    {
      key: "Application requirement for a charitable trust",
      value: "At least eighty five per cent of the income must be applied to its objects",
    },
  ],
  [
    {
      key: "Adjustment to book profit for MAT",
      value:
        "Book profit is the profit under the Companies Act adjusted by the additions and deductions listed in the Explanation to section 115JB",
    },
    {
      key: "Effect of opting for section 115BAA",
      value: "The option once exercised cannot be withdrawn and MAT ceases to apply",
    },
    {
      key: "Registration required by a charitable trust",
      value: "Registration under section 12AB",
    },
    {
      key: "Taxation of an association of persons where members' shares are indeterminate",
      value: "At the maximum marginal rate",
    },
    {
      key: "Accumulation permitted to a trust under section 11(2)",
      value:
        "Income may be accumulated for a specified purpose for up to five years on filing Form 10",
    },
  ],
);

dt(
  "dt:appeals-penalties",
  "Appeals, Revision, Penalties and Prosecution",
  "In appeals and penalties, what is %s?",
  "%k is %v.",
  [
    { key: "First appellate authority", value: "The Commissioner of Income-tax (Appeals)" },
    { key: "Second appellate authority", value: "The Income Tax Appellate Tribunal" },
    {
      key: "Time limit to appeal to the Commissioner (Appeals)",
      value: "Thirty days from the date of service of the order",
    },
    {
      key: "Time limit to appeal to the Tribunal",
      value: "Sixty days from the date of communication of the order",
    },
    {
      key: "Appeal from an order of the Tribunal",
      value: "To the High Court, on a substantial question of law",
    },
    { key: "Section for revision by the Commissioner against the assessee", value: "Section 263" },
    {
      key: "Section for revision by the Commissioner in favour of the assessee",
      value: "Section 264",
    },
    {
      key: "Penalty for under-reporting of income",
      value: "Fifty per cent of the tax payable on the under-reported income",
    },
    {
      key: "Penalty for misreporting of income",
      value: "Two hundred per cent of the tax payable on the misreported income",
    },
    { key: "Section providing for penalty for under-reporting", value: "Section 270A" },
  ],
  [
    {
      key: "Condition for revision under section 263",
      value: "The order must be erroneous and prejudicial to the interests of the revenue",
    },
    {
      key: "Dispute Resolution Committee",
      value:
        "A body under section 245MA for small and medium taxpayers to settle specified disputes",
    },
    {
      key: "Faceless appeal scheme",
      value:
        "A scheme disposing of appeals without personal interface, by allocation to a random appeal unit",
    },
    {
      key: "Immunity under section 270AA",
      value:
        "Immunity from penalty and prosecution where tax and interest are paid and no appeal is filed",
    },
    { key: "Section providing prosecution for wilful attempt to evade tax", value: "Section 276C" },
  ],
);

dt(
  "dt:dtaa-nonresident",
  "Double Taxation Relief and Non-resident Taxation",
  "In international taxation, what is %s?",
  "%k is %v.",
  [
    { key: "Section providing unilateral relief from double taxation", value: "Section 91" },
    { key: "Section giving effect to an agreement with another country", value: "Section 90" },
    { key: "DTAA", value: "A double taxation avoidance agreement between two countries" },
    {
      key: "Exemption method of relief",
      value: "Income taxed in one country is exempt in the other",
    },
    {
      key: "Credit method of relief",
      value: "Income is taxed in both, with credit given for the foreign tax paid",
    },
    {
      key: "Tax residency certificate",
      value:
        "A certificate from the other country needed to claim treaty benefit under section 90(4)",
    },
    {
      key: "Permanent establishment",
      value:
        "A fixed place of business through which the business of an enterprise is wholly or partly carried on",
    },
    { key: "Section taxing the income of a non-resident sportsman", value: "Section 115BBA" },
    {
      key: "Equalisation levy",
      value: "A levy on specified digital services received by a non-resident from an Indian payer",
    },
    { key: "Section on income deemed to accrue or arise in India", value: "Section 9" },
  ],
  [
    {
      key: "General anti-avoidance rule",
      value:
        "The rule in Chapter X-A allowing an arrangement to be declared impermissible and its tax benefit denied",
    },
    {
      key: "Significant economic presence",
      value:
        "A test deeming business connection in India from digital transactions above prescribed thresholds",
    },
    {
      key: "Place of effective management",
      value:
        "The place where key management and commercial decisions for the entity as a whole are in substance made",
    },
    {
      key: "Advance pricing agreement",
      value:
        "An agreement with the Board fixing the transfer pricing method in advance for up to five years",
    },
    {
      key: "Base erosion and profit shifting",
      value:
        "Strategies exploiting gaps between tax rules to shift profits to low or no tax locations",
    },
  ],
);

/* ================================================= Indirect Tax Laws == */

const it = chapterFactory(templates, "Indirect Tax Laws", PRO);

it(
  "it:levy-charge",
  "Levy and Collection of GST, Exemptions and Composition",
  "In the levy of GST, what is %s?",
  "%k is %v.",
  [
    { key: "Charging section of the CGST Act", value: "Section 9" },
    { key: "Tax levied on an intra-State supply", value: "Central GST and State GST" },
    { key: "Tax levied on an inter-State supply", value: "Integrated GST" },
    {
      key: "Reverse charge",
      value: "The liability to pay tax cast on the recipient instead of the supplier",
    },
    { key: "Section defining supply", value: "Section 7 of the CGST Act" },
    { key: "Composition levy section", value: "Section 10 of the CGST Act" },
    {
      key: "Turnover limit for the composition scheme for goods",
      value: "One crore fifty lakh rupees",
    },
    {
      key: "Composition rate for a manufacturer",
      value: "One per cent of the turnover in the State",
    },
    {
      key: "Composition rate for a restaurant service",
      value: "Five per cent of the turnover in the State",
    },
    {
      key: "Entitlement of a composition dealer to input tax credit",
      value: "None, and he may not collect tax from his customer",
    },
  ],
  [
    {
      key: "Activities treated neither as supply of goods nor of services",
      value: "Those listed in Schedule III, such as services by an employee to the employer",
    },
    {
      key: "Supply without consideration that is still taxable",
      value:
        "The activities in Schedule I, such as a supply between distinct or related persons in the course of business",
    },
    {
      key: "Composite supply",
      value:
        "Two or more naturally bundled supplies with a principal supply, taxed at the rate of the principal supply",
    },
    {
      key: "Mixed supply",
      value:
        "Two or more supplies made together for a single price, taxed at the highest applicable rate",
    },
    {
      key: "Effect of an exemption on input tax credit",
      value: "Credit attributable to exempt supplies must be reversed",
    },
  ],
);

it(
  "it:time-value-place",
  "Time, Value and Place of Supply",
  "In determining the charge, what is %s?",
  "%k is %v.",
  [
    {
      key: "Time of supply of goods under forward charge",
      value:
        "The earlier of the date of issue of the invoice or the last date on which it should have been issued",
    },
    {
      key: "Time of supply of services under forward charge",
      value: "The date of invoice if issued in time, otherwise the date of provision of service",
    },
    { key: "Section governing the value of supply", value: "Section 15 of the CGST Act" },
    {
      key: "Transaction value",
      value:
        "The price actually paid or payable where supplier and recipient are unrelated and price is the sole consideration",
    },
    {
      key: "Treatment of a discount given before or at the time of supply",
      value: "It is excluded from the value if it is recorded in the invoice",
    },
    {
      key: "Place of supply of goods where movement is involved",
      value: "The location where the movement of goods terminates for delivery to the recipient",
    },
    {
      key: "Place of supply of immovable property services",
      value: "The location of the immovable property",
    },
    {
      key: "Place of supply of restaurant and catering services",
      value: "The location where the service is actually performed",
    },
    {
      key: "Place of supply of transportation of passengers to a registered person",
      value: "The location of the registered recipient",
    },
    {
      key: "Test for an inter-State supply",
      value: "The location of the supplier and the place of supply are in different States",
    },
  ],
  [
    {
      key: "Treatment of a post-supply discount",
      value:
        "It is deductible only if it was agreed before the supply, is linked to invoices, and the credit is reversed by the recipient",
    },
    {
      key: "Inclusion of subsidies in the value of supply",
      value:
        "Subsidies directly linked to the price are included, except those given by the Central or State Government",
    },
    {
      key: "Time of supply under reverse charge for goods",
      value:
        "The earliest of receipt of goods, date of payment, or thirty one days from the invoice",
    },
    {
      key: "Place of supply of services where the recipient is unregistered and the address is not on record",
      value: "The location of the supplier",
    },
    {
      key: "Treatment of interest or late fee for delayed payment",
      value: "It is included in the value of supply",
    },
  ],
);

it(
  "it:payment-refund",
  "Payment of Tax, Refunds and E-way Bill",
  "In payment and refund under GST, what is %s?",
  "%k is %v.",
  [
    {
      key: "Electronic cash ledger",
      value: "The ledger in which every deposit of tax, interest, penalty or fee is credited",
    },
    {
      key: "Electronic credit ledger",
      value: "The ledger in which eligible input tax credit is credited",
    },
    {
      key: "Electronic liability register",
      value: "The register showing all liabilities of a registered person",
    },
    {
      key: "Due date for payment of tax by a regular taxpayer",
      value: "The twentieth of the following month, with the return in Form GSTR-3B",
    },
    { key: "Rate of interest on delayed payment of tax", value: "Eighteen per cent per annum" },
    {
      key: "Rate of interest on undue or excess claim of input tax credit",
      value: "Twenty four per cent per annum",
    },
    { key: "Time limit to claim a refund", value: "Two years from the relevant date" },
    { key: "Form in which a refund application is made", value: "Form GST RFD-01" },
    {
      key: "Threshold value above which an e-way bill is required",
      value: "Fifty thousand rupees",
    },
    { key: "Form in which an e-way bill is generated", value: "Form GST EWB-01" },
  ],
  [
    {
      key: "Order in which the electronic credit ledger must be used",
      value:
        "IGST credit first, and only then CGST and SGST credit, as laid down in sections 49A and 49B",
    },
    {
      key: "Provisional refund to a zero-rated exporter",
      value: "Ninety per cent of the claim, granted within seven days of acknowledgement",
    },
    {
      key: "Validity of an e-way bill",
      value:
        "One day for every two hundred kilometres, and one day for every twenty kilometres for over dimensional cargo",
    },
    {
      key: "Refund of unutilised credit on an inverted duty structure",
      value:
        "Allowed where the rate on inputs is higher than the rate on output supplies, subject to the prescribed formula",
    },
    {
      key: "Restriction on use of the electronic credit ledger under rule 86B",
      value:
        "A taxpayer with taxable turnover above fifty lakh rupees a month must pay at least one per cent of output liability in cash",
    },
  ],
);

it(
  "it:assessment-demand",
  "Assessment, Audit, Demand and Recovery",
  "In GST assessment and recovery, what is %s?",
  "%k is %v.",
  [
    {
      key: "Self assessment",
      value: "The assessment of tax by the registered person himself under section 59",
    },
    {
      key: "Provisional assessment",
      value: "Assessment under section 60 where the value or rate cannot be determined",
    },
    {
      key: "Scrutiny of returns",
      value: "Verification of the correctness of a return by the proper officer under section 61",
    },
    {
      key: "Best judgement assessment of a non-filer",
      value: "Assessment under section 62 of a registered person who fails to file a return",
    },
    {
      key: "Summary assessment",
      value: "Assessment under section 64 in special cases to protect the interest of revenue",
    },
    { key: "Section for demand where there is no fraud", value: "Section 73" },
    { key: "Section for demand involving fraud or wilful misstatement", value: "Section 74" },
    {
      key: "Time limit for an order under section 73",
      value: "Three years from the due date of the annual return",
    },
    {
      key: "Time limit for an order under section 74",
      value: "Five years from the due date of the annual return",
    },
    {
      key: "Audit by the tax authorities",
      value: "An audit under section 65 conducted at the place of business or in the office",
    },
  ],
  [
    {
      key: "Penalty where tax and interest are paid before the notice under section 73",
      value: "No penalty is payable and no notice is issued",
    },
    {
      key: "Penalty where tax and interest are paid within thirty days of a notice under section 74",
      value: "Twenty five per cent of the tax",
    },
    {
      key: "Special audit under section 66",
      value:
        "An audit directed by an officer and carried out by a nominated chartered or cost accountant",
    },
    {
      key: "Detention and release of goods in transit",
      value:
        "Section 129 allows release on payment of the penalty prescribed, which differs for the owner and others",
    },
    {
      key: "Recovery of arrears",
      value:
        "Section 79 allows deduction from money owed, detention and sale of goods, garnishee proceedings and recovery as land revenue",
    },
  ],
);

it(
  "it:appeals-advance-ruling",
  "Appeals, Advance Ruling and Offences under GST",
  "In GST appeals and rulings, what is %s?",
  "%k is %v.",
  [
    {
      key: "First appeal against an adjudicating authority",
      value: "To the Appellate Authority under section 107",
    },
    {
      key: "Time limit for a first appeal",
      value: "Three months from the date of communication of the order",
    },
    { key: "Pre-deposit for a first appeal", value: "Ten per cent of the disputed tax" },
    {
      key: "Appeal against the order of the Appellate Authority",
      value: "To the Appellate Tribunal under section 112",
    },
    {
      key: "Advance ruling",
      value:
        "A written decision on specified questions given to an applicant before the transaction",
    },
    {
      key: "Body that gives an advance ruling",
      value: "The Authority for Advance Ruling in the State or Union territory",
    },
    {
      key: "Binding effect of an advance ruling",
      value: "It binds only the applicant and the concerned officer",
    },
    {
      key: "Time limit to appeal against an advance ruling",
      value: "Thirty days from the date of communication",
    },
    { key: "Section listing offences and penalties", value: "Section 122 of the CGST Act" },
    { key: "General penalty under section 125", value: "Up to twenty five thousand rupees" },
  ],
  [
    {
      key: "Threshold for a cognizable and non-bailable offence under GST",
      value: "Where the tax evaded exceeds five crore rupees",
    },
    {
      key: "Compounding of offences",
      value:
        "Section 138 permits settlement on payment of a compounding amount, except in the excluded cases",
    },
    {
      key: "Questions on which an advance ruling can be sought",
      value:
        "Classification, applicability of a notification, time and value of supply, input tax credit, liability to pay and registration",
    },
    {
      key: "Effect of suppression of facts on an advance ruling",
      value: "It may be declared void ab initio under section 104",
    },
    {
      key: "Anti-profiteering",
      value:
        "Section 171 requires that a rate reduction or credit benefit be passed on by a commensurate reduction in price",
    },
  ],
);

it(
  "it:customs-ftp",
  "Customs Valuation, Procedures and Foreign Trade Policy",
  "In customs law, what is %s?",
  "%k is %v.",
  [
    { key: "Charging section of the Customs Act", value: "Section 12" },
    { key: "Taxable event for import duty", value: "The import of goods into India" },
    {
      key: "Section governing the valuation of imported goods",
      value: "Section 14 of the Customs Act",
    },
    {
      key: "Primary basis of customs valuation",
      value: "The transaction value of the imported goods",
    },
    {
      key: "Duty levied in place of GST on imports",
      value: "Integrated tax under section 3(7) of the Customs Tariff Act",
    },
    {
      key: "Bill of entry",
      value: "The document filed by an importer for clearance of imported goods",
    },
    {
      key: "Shipping bill",
      value: "The document filed by an exporter for clearance of goods for export",
    },
    {
      key: "Warehousing of imported goods",
      value: "Deposit of dutiable goods in a bonded warehouse without payment of duty",
    },
    {
      key: "Baggage rules",
      value: "The rules prescribing the free allowance for a passenger arriving in India",
    },
    {
      key: "Duty drawback",
      value: "Refund of duty paid on inputs used in goods that are exported",
    },
  ],
  [
    {
      key: "Sequence of customs valuation methods",
      value:
        "Transaction value, then identical goods, similar goods, deductive value, computed value and finally the residual method",
    },
    {
      key: "Advance authorisation scheme",
      value:
        "A scheme permitting duty free import of inputs physically incorporated in an export product",
    },
    {
      key: "EPCG scheme",
      value:
        "Import of capital goods at zero duty against an export obligation of six times the duty saved in six years",
    },
    {
      key: "Provisional assessment under customs",
      value:
        "Assessment under section 18 where the duty cannot be finally determined, on execution of a bond",
    },
    {
      key: "Remission of duties and taxes on exported products",
      value:
        "The RoDTEP scheme, which refunds embedded central, State and local duties not otherwise rebated",
    },
  ],
);

/* =============================================== Advanced Auditing ==== */

const aa = chapterFactory(templates, "Advanced Auditing", PRO);

aa(
  "aa:professional-ethics",
  "Professional Ethics and the Code of Conduct",
  "In professional ethics, what is %s?",
  "%k is %v.",
  [
    { key: "Act governing the profession in India", value: "The Chartered Accountants Act, 1949" },
    {
      key: "Schedule dealing with professional misconduct by a member in practice",
      value: "The First and Second Schedules to the Act",
    },
    {
      key: "Body that hears cases of misconduct",
      value: "The Disciplinary Committee and the Board of Discipline of the Institute",
    },
    {
      key: "Fundamental principle of integrity",
      value: "Being straightforward and honest in all professional and business relationships",
    },
    {
      key: "Fundamental principle of objectivity",
      value:
        "Not allowing bias, conflict of interest or undue influence to override professional judgement",
    },
    {
      key: "Fundamental principle of confidentiality",
      value:
        "Not disclosing information acquired in the course of professional work without authority",
    },
    {
      key: "Self-interest threat",
      value: "A threat arising from a financial or other interest of the member in the client",
    },
    {
      key: "Self-review threat",
      value: "A threat arising where the member must re-evaluate his own earlier judgement",
    },
    {
      key: "Advocacy threat",
      value:
        "A threat arising where the member promotes the client's position to the point of compromising objectivity",
    },
    {
      key: "Familiarity threat",
      value: "A threat arising from a long or close relationship with the client",
    },
  ],
  [
    {
      key: "Permissibility of a contingent fee",
      value:
        "A member in practice may not charge fees contingent on the findings or results, except where permitted by regulation",
    },
    {
      key: "Restriction on advertisement",
      value:
        "A member may not solicit clients by advertisement, circular or personal communication, beyond what the guidelines allow",
    },
    {
      key: "Ceiling on the number of tax audits per partner",
      value: "Sixty tax audit assignments in an assessment year",
    },
    {
      key: "Effect of holding shares in the auditee",
      value:
        "It creates a self-interest threat and disqualifies the member from audit under section 141 of the Companies Act",
    },
    {
      key: "Safeguard against an intimidation threat",
      value:
        "Consultation with the firm's ethics partner, rotation of the engagement partner, or withdrawal from the engagement",
    },
  ],
);

aa(
  "aa:company-audit-caro",
  "Company Audit and the Companies (Auditor's Report) Order",
  "In company audit, what is %s?",
  "%k is %v.",
  [
    {
      key: "Section on the appointment of an auditor",
      value: "Section 139 of the Companies Act, 2013",
    },
    {
      key: "Term of an auditor appointed at an annual general meeting",
      value: "Five consecutive years, until the conclusion of the sixth meeting",
    },
    { key: "Section listing disqualifications of an auditor", value: "Section 141" },
    { key: "Section listing the powers and duties of an auditor", value: "Section 143" },
    { key: "Section restricting non-audit services", value: "Section 144" },
    {
      key: "Section on removal of an auditor before the term expires",
      value: "Section 140, requiring a special resolution and Central Government approval",
    },
    {
      key: "Rotation of auditors for prescribed companies",
      value: "An individual for one term of five years and a firm for two terms of five years",
    },
    {
      key: "Order prescribing additional reporting matters",
      value: "The Companies (Auditor's Report) Order, 2020",
    },
    {
      key: "Reporting on internal financial controls",
      value: "Required under section 143(3)(i) for the prescribed companies",
    },
    {
      key: "Duty on suspicion of fraud",
      value: "Reporting to the Central Government or the audit committee under section 143(12)",
    },
  ],
  [
    {
      key: "Threshold for reporting fraud to the Central Government",
      value: "Where the fraud involves an amount of one crore rupees or more",
    },
    {
      key: "Companies to which CARO 2020 does not apply",
      value:
        "Banking and insurance companies, section 8 companies, one person companies and prescribed small companies",
    },
    {
      key: "Branch audit",
      value:
        "Audit under section 143(8) by the company's auditor or another qualified person, whose report the principal auditor deals with",
    },
    {
      key: "Cost audit",
      value: "An audit under section 148 by a cost accountant for prescribed classes of companies",
    },
    {
      key: "Effect of a casual vacancy caused by resignation",
      value:
        "It is filled by the Board within thirty days and approved at a general meeting within three months",
    },
  ],
);

aa(
  "aa:specialised-audits",
  "Audit of Banks, Insurance Companies and NBFCs",
  "In the audit of financial sector entities, what is %s?",
  "%k is %v.",
  [
    { key: "Act governing banking companies", value: "The Banking Regulation Act, 1949" },
    { key: "Regulator of banks in India", value: "The Reserve Bank of India" },
    {
      key: "Non-performing asset",
      value: "An advance on which interest or instalment is overdue for more than ninety days",
    },
    {
      key: "Classification of an NPA overdue for up to twelve months",
      value: "A substandard asset",
    },
    {
      key: "Classification of an asset that has remained substandard for twelve months",
      value: "A doubtful asset",
    },
    {
      key: "Loss asset",
      value: "An asset identified as uncollectible, though not yet written off",
    },
    {
      key: "Long form audit report",
      value: "A detailed questionnaire-based report submitted by a bank's statutory auditor",
    },
    {
      key: "Concurrent audit",
      value: "An ongoing examination of transactions at the branch as they occur",
    },
    {
      key: "Regulator of insurance companies",
      value: "The Insurance Regulatory and Development Authority of India",
    },
    {
      key: "Solvency margin",
      value: "The excess of the value of assets over liabilities that an insurer must maintain",
    },
  ],
  [
    {
      key: "Capital to risk weighted assets ratio",
      value:
        "A measure of a bank's capital against its risk weighted assets, prescribed under the Basel norms",
    },
    {
      key: "Provision required on a standard asset",
      value:
        "A general provision at the rate prescribed by the Reserve Bank for the category of advance",
    },
    {
      key: "Principal risk in an NBFC audit",
      value:
        "Asset liability mismatch and the correctness of income recognition and asset classification",
    },
    {
      key: "Audit of a co-operative society",
      value:
        "Governed by the relevant State Act, with a report on overdue debts and the classification of the society",
    },
    {
      key: "Reserve for unexpired risk",
      value:
        "A provision in general insurance for the portion of premium relating to the unexpired period of a policy",
    },
  ],
);

aa(
  "aa:internal-forensic",
  "Internal Audit, Due Diligence and Forensic Audit",
  "In internal and special audits, what is %s?",
  "%k is %v.",
  [
    {
      key: "Internal audit",
      value:
        "An independent appraisal activity within an entity to review its operations as a service to management",
    },
    { key: "Section requiring internal audit", value: "Section 138 of the Companies Act, 2013" },
    {
      key: "Due diligence",
      value: "An investigation of a business before an acquisition, investment or lending decision",
    },
    {
      key: "Financial due diligence",
      value: "A review of the quality of earnings, assets, liabilities and cash flow of the target",
    },
    {
      key: "Forensic audit",
      value:
        "An examination of records to obtain evidence of fraud that may be used in legal proceedings",
    },
    {
      key: "Operational audit",
      value: "An appraisal of the efficiency and effectiveness of operations",
    },
    {
      key: "Management audit",
      value: "An appraisal of the performance of the management as a whole",
    },
    {
      key: "Performance audit",
      value: "An audit of economy, efficiency and effectiveness in the use of resources",
    },
    {
      key: "Whistle blower mechanism",
      value:
        "A vigil mechanism under section 177 for directors and employees to report genuine concerns",
    },
    {
      key: "Audit trail requirement in accounting software",
      value:
        "The record of every change made to a book of account, with the date, which cannot be disabled",
    },
  ],
  [
    {
      key: "Fraud triangle",
      value: "The three conditions of incentive or pressure, opportunity and rationalisation",
    },
    {
      key: "Difference between forensic audit and statutory audit",
      value:
        "A statutory audit gives an opinion on the financial statements while a forensic audit seeks evidence of a specific fraud",
    },
    {
      key: "Benford's law in forensic work",
      value:
        "The expected frequency of leading digits in natural data, used to detect fabricated numbers",
    },
    {
      key: "Hidden liability in due diligence",
      value:
        "An obligation such as a contingent claim or product warranty not evident from the balance sheet",
    },
    {
      key: "Relationship between internal audit and the statutory auditor",
      value:
        "The statutory auditor may use internal audit work under SA 610 after evaluating its objectivity and competence",
    },
  ],
);

export const CA_FINAL_FULL_TEMPLATES = templates;
