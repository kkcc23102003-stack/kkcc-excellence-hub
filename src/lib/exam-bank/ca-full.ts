/**
 * CA, CS and CMA — the complete chapter list of the ICAI scheme.
 *
 * Foundation: Accounting, Business Laws, Quantitative Aptitude, Business
 * Economics. Intermediate: Advanced Accounting, Corporate and Other Laws,
 * Taxation, Cost and Management Accounting, Auditing and Ethics, Financial
 * Management. Final: Financial Reporting, Advanced Financial Management,
 * Advanced Auditing, Direct Tax and International Taxation, Indirect Tax.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const FOUND = ["CA Foundation", "CS Foundation", "CMA Foundation"];
const INTER = ["CA Intermediate", "CS Executive", "CMA Intermediate"];
const FINAL = ["CA Final", "CS Professional", "CMA Final"];

const templates: Template[] = [];
const acc = chapterFactory(templates, "Accounting", [...FOUND, ...INTER]);
const law = chapterFactory(templates, "Business Law", [...FOUND, ...INTER]);
const eco = chapterFactory(templates, "Business Economics", FOUND);
const cost = chapterFactory(templates, "Cost Accounting", INTER);
const tax = chapterFactory(templates, "Taxation", INTER);
const audit = chapterFactory(templates, "Advanced Auditing", [...INTER, ...FINAL]);
const dtl = chapterFactory(templates, "Direct Tax Laws", FINAL);
const idt = chapterFactory(templates, "Indirect Tax Laws", FINAL);
const fr = chapterFactory(templates, "Financial Reporting", FINAL);
const sfm = chapterFactory(templates, "Strategic Financial Management", FINAL);

/* ================================================ Accounting (Foundation) */

acc(
  "ca:acc:framework",
  "Theoretical Framework",
  "In the accounting framework, what is %s?",
  "%k is %v.",
  [
    {
      key: "Going concern assumption",
      value:
        "The assumption that the enterprise will continue in operation for the foreseeable future",
    },
    {
      key: "Accrual basis",
      value: "Recording revenue and expense when they arise, not when cash moves",
    },
    {
      key: "Consistency",
      value: "Applying the same accounting policy from one period to the next",
    },
    { key: "Prudence", value: "Providing for all known losses but not anticipating profits" },
    {
      key: "Materiality",
      value: "Disclosing every item large enough to influence a user's decision",
    },
    {
      key: "Money measurement concept",
      value: "Recording only those facts that can be expressed in money",
    },
    { key: "Business entity concept", value: "Treating the business as separate from its owner" },
    {
      key: "Dual aspect concept",
      value: "Every transaction has two effects, which keeps the accounting equation in balance",
    },
    {
      key: "Matching concept",
      value: "Charging the expense of a period against the revenue of that same period",
    },
    { key: "Accounting equation", value: "Assets equal liabilities plus capital" },
  ],
  [
    {
      key: "Substance over form",
      value: "Recording the economic reality of a transaction rather than its legal wrapper",
    },
    {
      key: "Realisation concept",
      value: "Recognising revenue when it is earned and its collection is reasonably certain",
    },
    {
      key: "Qualitative characteristics of statements",
      value: "Understandability, relevance, reliability and comparability",
    },
    {
      key: "Difference between cash and accrual basis",
      value:
        "Cash basis records only receipts and payments, accrual records rights and obligations",
    },
    {
      key: "Fundamental accounting assumptions under AS 1",
      value: "Going concern, consistency and accrual",
    },
  ],
);

acc(
  "ca:acc:process",
  "Accounting Process",
  "In the accounting process, what is %s?",
  "%k is %v.",
  [
    {
      key: "Journal",
      value: "The book of original entry in which a transaction is first recorded",
    },
    {
      key: "Ledger",
      value: "The principal book in which accounts are maintained in a classified form",
    },
    {
      key: "Trial balance",
      value: "A statement of debit and credit balances drawn to check arithmetical accuracy",
    },
    {
      key: "Subsidiary books",
      value:
        "Special journals such as the purchase book and sales book for repetitive transactions",
    },
    {
      key: "Cash book",
      value: "A book that is both a journal and a ledger for cash and bank transactions",
    },
    {
      key: "Contra entry",
      value: "An entry affecting both the cash and bank columns of the cash book",
    },
    {
      key: "Rectification of errors",
      value: "Correcting a wrong entry through a journal entry or a suspense account",
    },
    {
      key: "Error of principle",
      value: "An error where a transaction is recorded against an accounting principle",
    },
    { key: "Compensating error", value: "Two errors whose effects cancel each other out" },
    { key: "Suspense account", value: "A temporary account opened to make a trial balance agree" },
  ],
  [
    {
      key: "Errors not disclosed by a trial balance",
      value: "Errors of omission, principle, commission in the same side and compensating errors",
    },
    {
      key: "Petty cash imprest system",
      value: "A fixed float reimbursed at the end of each period by the amount spent",
    },
    {
      key: "Difference between journal and ledger",
      value: "The journal records chronologically, the ledger classifies by account",
    },
    {
      key: "Closing entries",
      value:
        "Entries that transfer nominal account balances to the trading and profit and loss account",
    },
    {
      key: "Adjusting entries",
      value: "Entries for outstanding, prepaid, accrued and unearned items at the year end",
    },
  ],
);

acc(
  "ca:acc:brs",
  "Bank Reconciliation Statement",
  "In a bank reconciliation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Bank reconciliation statement",
      value: "A statement reconciling the cash book bank balance with the pass book balance",
    },
    {
      key: "Cheque issued but not presented",
      value: "An item that makes the pass book balance higher than the cash book balance",
    },
    {
      key: "Cheque deposited but not credited",
      value: "An item that makes the pass book balance lower than the cash book balance",
    },
    {
      key: "Bank charges",
      value: "An amount debited by the bank but not yet entered in the cash book",
    },
    {
      key: "Direct deposit by a customer",
      value: "An amount credited by the bank but not yet entered in the cash book",
    },
    {
      key: "Standing instruction",
      value: "A payment the bank makes on a recurring order of the customer",
    },
    {
      key: "Dishonoured cheque",
      value: "A cheque returned unpaid, which the bank debits to the account",
    },
    {
      key: "Interest allowed by bank",
      value: "An amount credited by the bank that increases the pass book balance",
    },
    {
      key: "Favourable balance in the cash book",
      value: "A debit balance, meaning money is available at the bank",
    },
    {
      key: "Overdraft",
      value: "A credit balance in the cash book, meaning the account is drawn beyond its funds",
    },
  ],
  [
    {
      key: "Purpose of a reconciliation",
      value:
        "To locate the causes of difference and detect errors or delays, not to correct the bank",
    },
    {
      key: "Treatment of an error in the cash book",
      value: "The cash book is corrected and the corrected balance is used for reconciliation",
    },
    {
      key: "Adjusted cash book method",
      value:
        "Updating the cash book for bank-side items first, then reconciling only timing differences",
    },
    {
      key: "Effect of a wrong credit by the bank",
      value: "It raises the pass book balance and must be reversed in the reconciliation",
    },
    {
      key: "Frequency of reconciliation",
      value: "Usually at the end of every month, to catch timing and recording differences early",
    },
  ],
);

acc(
  "ca:acc:inventory",
  "Inventories",
  "In inventory accounting, what is %s?",
  "%k is %v.",
  [
    { key: "Inventory valuation rule under AS 2", value: "Lower of cost and net realisable value" },
    {
      key: "Net realisable value",
      value: "Estimated selling price less the estimated cost of completion and of sale",
    },
    { key: "FIFO method", value: "Assuming the earliest purchased goods are issued first" },
    {
      key: "Weighted average method",
      value: "Valuing issues at the average cost of the units available",
    },
    {
      key: "Cost of inventory",
      value:
        "Purchase cost, conversion cost and other costs of bringing it to its present location",
    },
    {
      key: "Perpetual inventory system",
      value: "Continuous recording of receipts and issues so the balance is known at all times",
    },
    {
      key: "Periodic inventory system",
      value: "Determining inventory only by physical count at the end of the period",
    },
    {
      key: "Abnormal loss of stock",
      value: "A loss charged to the profit and loss account, not to the cost of goods",
    },
    {
      key: "Normal loss of stock",
      value: "A loss absorbed in the cost of the remaining good units",
    },
    {
      key: "Items excluded from cost of inventory",
      value: "Abnormal waste, storage cost, administrative overhead and selling cost",
    },
  ],
  [
    {
      key: "Why LIFO is not permitted under AS 2",
      value: "It does not reflect the actual flow and can distort the balance sheet value",
    },
    {
      key: "Goods sent on approval",
      value: "They remain the seller's inventory until the buyer accepts them",
    },
    {
      key: "Goods on consignment",
      value: "They remain the consignor's inventory until sold by the consignee",
    },
    {
      key: "Effect of overvaluing closing stock",
      value: "Profit and the asset side are both overstated",
    },
    {
      key: "Retail inventory method",
      value:
        "Estimating cost by reducing the selling value of inventory by the gross margin percentage",
    },
  ],
);

acc(
  "ca:acc:partnership",
  "Partnership Accounts",
  "In partnership accounts, what is %s?",
  "%k is %v.",
  [
    {
      key: "Partnership deed",
      value: "The written agreement setting out the terms among partners",
    },
    {
      key: "Profit sharing in the absence of a deed",
      value: "Equally, whatever the capital contributed",
    },
    { key: "Interest on capital in the absence of a deed", value: "Not allowed" },
    { key: "Interest on a partner's loan in the absence of a deed", value: "Six per cent a year" },
    {
      key: "Fixed capital method",
      value:
        "Keeping the capital account unchanged and routing adjustments through a current account",
    },
    {
      key: "Fluctuating capital method",
      value: "Passing every adjustment through the capital account itself",
    },
    {
      key: "Goodwill",
      value:
        "The value of the firm's reputation, brought in or adjusted when the constitution changes",
    },
    {
      key: "Sacrificing ratio",
      value: "The ratio in which old partners give up their share for a new partner",
    },
    {
      key: "Gaining ratio",
      value: "The ratio in which continuing partners gain on a retirement or death",
    },
    {
      key: "Revaluation account",
      value: "The account that records the gain or loss on revaluing assets and liabilities",
    },
  ],
  [
    {
      key: "Garner versus Murray rule",
      value: "A solvent partner bears the insolvent partner's deficiency in the capital ratio",
    },
    {
      key: "Realisation account",
      value: "The account prepared on dissolution to close all assets and liabilities",
    },
    {
      key: "Joint life policy",
      value: "A policy taken on the lives of all partners to fund a payout on death",
    },
    {
      key: "Treatment of goodwill on admission",
      value: "Credited to the old partners in their sacrificing ratio",
    },
    {
      key: "Piecemeal distribution",
      value: "Distributing cash to partners in instalments as assets are realised",
    },
  ],
);

acc(
  "ca:acc:company",
  "Company Accounts",
  "In company accounts, what is %s?",
  "%k is %v.",
  [
    {
      key: "Authorised capital",
      value: "The maximum capital a company can raise as stated in its memorandum",
    },
    { key: "Issued capital", value: "The part of authorised capital offered to the public" },
    {
      key: "Called up capital",
      value: "The part of the issued capital the company has asked shareholders to pay",
    },
    { key: "Paid up capital", value: "The part of the called up capital actually received" },
    { key: "Calls in arrears", value: "The amount called but not yet received from shareholders" },
    { key: "Calls in advance", value: "Money received from a shareholder before it is called" },
    { key: "Forfeiture of shares", value: "Cancelling shares on which calls remain unpaid" },
    {
      key: "Issue of shares at a premium",
      value: "Issue above face value, the excess going to the securities premium account",
    },
    { key: "Debenture", value: "An acknowledgement of debt carrying a fixed rate of interest" },
    {
      key: "Difference between a share and a debenture",
      value: "A share is ownership with dividend, a debenture is a loan with interest",
    },
  ],
  [
    {
      key: "Uses of the securities premium account",
      value: "Issuing bonus shares, writing off preliminary expenses and premium on redemption",
    },
    {
      key: "Bonus shares",
      value: "Fully paid shares issued free to existing shareholders out of reserves",
    },
    {
      key: "Right shares",
      value: "Shares offered first to existing shareholders in proportion to their holding",
    },
    {
      key: "Capital redemption reserve",
      value: "A reserve created when shares are redeemed out of profits",
    },
    {
      key: "Buy back of shares",
      value: "A company purchasing its own shares, subject to the limits in the Companies Act",
    },
  ],
);

acc(
  "ca:acc:nonprofit",
  "Not-for-Profit Organisations",
  "For a not-for-profit organisation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Receipts and payments account",
      value: "A summary of the cash book showing all receipts and payments of the year",
    },
    {
      key: "Income and expenditure account",
      value: "The equivalent of the profit and loss account for a non-trading concern",
    },
    { key: "Surplus", value: "The excess of income over expenditure" },
    { key: "Deficit", value: "The excess of expenditure over income" },
    { key: "Capital fund", value: "The accumulated fund that takes the place of capital" },
    {
      key: "Subscription",
      value: "The periodic amount received from members, the main revenue receipt",
    },
    { key: "Life membership fee", value: "A capital receipt credited to the capital fund" },
    {
      key: "Legacy",
      value: "An amount received under a will, normally treated as a capital receipt",
    },
    {
      key: "Donation for a specific purpose",
      value: "A capital receipt shown as a separate fund on the liabilities side",
    },
    { key: "Entrance fee", value: "A receipt on admission of a member, usually capitalised" },
  ],
  [
    {
      key: "Difference between receipts and payments and income and expenditure",
      value:
        "The first is cash based and includes capital items, the second is accrual based and only revenue items",
    },
    {
      key: "Treatment of sale of an old asset",
      value:
        "The profit or loss goes to income and expenditure, the proceeds to receipts and payments",
    },
    {
      key: "Outstanding subscription",
      value: "Added to subscription income and shown as an asset",
    },
    {
      key: "Subscription received in advance",
      value: "Deducted from income and shown as a liability",
    },
    { key: "Honorarium", value: "A payment for services rendered, treated as revenue expenditure" },
  ],
);

/* ==================================================== Business Law ====== */

law(
  "ca:law:sale-of-goods",
  "Sale of Goods Act 1930",
  "Under the Sale of Goods Act, what is %s?",
  "%k is %v.",
  [
    {
      key: "Contract of sale",
      value:
        "A contract by which the seller transfers or agrees to transfer property in goods for a price",
    },
    { key: "Sale", value: "A contract where property in the goods passes immediately" },
    {
      key: "Agreement to sell",
      value: "A contract where property is to pass at a future time or on a condition",
    },
    {
      key: "Goods",
      value: "Every kind of movable property other than actionable claims and money",
    },
    {
      key: "Condition",
      value: "A stipulation essential to the main purpose, whose breach allows repudiation",
    },
    {
      key: "Warranty",
      value: "A stipulation collateral to the main purpose, whose breach allows only damages",
    },
    {
      key: "Caveat emptor",
      value: "The rule that the buyer must beware and satisfy himself about the goods",
    },
    { key: "Unpaid seller", value: "A seller who has not received the whole of the price" },
    { key: "Right of lien", value: "The unpaid seller's right to retain possession until payment" },
    {
      key: "Right of stoppage in transit",
      value: "The unpaid seller's right to stop goods in transit when the buyer is insolvent",
    },
  ],
  [
    {
      key: "Doctrine of nemo dat quod non habet",
      value: "No one can give a better title than he himself has",
    },
    { key: "Implied condition as to title", value: "The seller has a right to sell the goods" },
    { key: "Sale by description", value: "The goods must correspond with the description given" },
    { key: "Sale by sample", value: "The bulk must correspond with the sample in quality" },
    {
      key: "Exceptions to caveat emptor",
      value: "Fitness for purpose made known, sale by description, usage of trade and fraud",
    },
  ],
);

law(
  "ca:law:llp",
  "Limited Liability Partnership Act 2008",
  "Under the LLP Act, what is %s?",
  "%k is %v.",
  [
    {
      key: "Limited liability partnership",
      value: "A body corporate with perpetual succession where partners have limited liability",
    },
    { key: "Minimum number of partners in an LLP", value: "Two" },
    { key: "Maximum number of partners in an LLP", value: "No limit" },
    {
      key: "Minimum designated partners",
      value: "Two, of whom at least one must be resident in India",
    },
    { key: "Legal status of an LLP", value: "A separate legal entity distinct from its partners" },
    {
      key: "Liability of a partner in an LLP",
      value: "Limited to the agreed contribution, except for fraud",
    },
    {
      key: "LLP agreement",
      value: "The agreement determining the mutual rights and duties of partners",
    },
    { key: "Registrar for an LLP", value: "The Registrar of Companies" },
    {
      key: "Annual filings by an LLP",
      value: "The annual return and the statement of account and solvency",
    },
    {
      key: "Conversion into an LLP",
      value: "A firm, private company or unlisted public company may convert into an LLP",
    },
  ],
  [
    {
      key: "Difference between an LLP and a partnership firm",
      value:
        "An LLP is a body corporate with limited liability and perpetual succession, a firm is neither",
    },
    {
      key: "Difference between an LLP and a company",
      value: "An LLP has fewer compliances and is governed by agreement rather than by articles",
    },
    {
      key: "Partner as agent in an LLP",
      value: "A partner is the agent of the LLP alone, not of the other partners",
    },
    {
      key: "Whistle blowing under the LLP Act",
      value:
        "Protection given to a partner or employee who provides useful information in an investigation",
    },
    { key: "Winding up of an LLP", value: "May be voluntary or by order of the Tribunal" },
  ],
);

law(
  "ca:law:companies-detail",
  "Companies Act — Incorporation and Prospectus",
  "Under the Companies Act 2013, what is %s?",
  "%k is %v.",
  [
    {
      key: "Memorandum of association",
      value: "The charter defining the company's objects and its relation with outsiders",
    },
    {
      key: "Articles of association",
      value: "The document containing the rules for the internal management of the company",
    },
    {
      key: "Doctrine of ultra vires",
      value: "An act beyond the objects clause is void and cannot be ratified",
    },
    {
      key: "Doctrine of indoor management",
      value: "An outsider dealing in good faith may assume internal procedures were followed",
    },
    {
      key: "Doctrine of constructive notice",
      value: "Every person dealing with the company is presumed to have read its public documents",
    },
    {
      key: "Prospectus",
      value: "Any document inviting the public to subscribe for securities of a company",
    },
    {
      key: "Shelf prospectus",
      value: "A prospectus filed for more than one issue over a stated period",
    },
    {
      key: "Red herring prospectus",
      value: "A prospectus that does not state the price or quantum of securities",
    },
    { key: "Minimum members in a private company", value: "Two" },
    { key: "Minimum members in a public company", value: "Seven" },
  ],
  [
    {
      key: "One person company",
      value: "A company with a single member, allowed only as a private company",
    },
    {
      key: "Maximum members in a private company",
      value: "Two hundred, excluding present and former employee members",
    },
    {
      key: "Certificate of incorporation",
      value: "Conclusive evidence that the company is duly registered",
    },
    {
      key: "Misstatement in a prospectus",
      value: "Attracts civil and criminal liability on the persons who authorised its issue",
    },
    {
      key: "Alteration of the objects clause",
      value: "Requires a special resolution and filing with the Registrar",
    },
  ],
);

/* ================================================ Business Economics ==== */

eco(
  "ca:eco:production-cost",
  "Theory of Production and Cost",
  "In the theory of production and cost, what is %s?",
  "%k is %v.",
  [
    {
      key: "Production function",
      value: "The technical relation between inputs used and output produced",
    },
    {
      key: "Law of variable proportions",
      value: "As one input is increased with others fixed, marginal product first rises then falls",
    },
    {
      key: "Returns to scale",
      value: "The change in output when all inputs are increased in the same proportion",
    },
    { key: "Fixed cost", value: "Cost that does not change with the level of output" },
    { key: "Variable cost", value: "Cost that changes directly with the level of output" },
    { key: "Marginal cost", value: "The addition to total cost from producing one more unit" },
    { key: "Average cost", value: "Total cost divided by the number of units produced" },
    { key: "Opportunity cost", value: "The value of the next best alternative given up" },
    { key: "Explicit cost", value: "Actual payment made to outsiders for inputs" },
    {
      key: "Implicit cost",
      value: "The imputed value of the owner's own resources used in the business",
    },
  ],
  [
    {
      key: "Shape of the average cost curve",
      value: "U shaped, because of economies and then diseconomies of scale",
    },
    {
      key: "Relation between marginal and average cost",
      value: "Marginal cost cuts average cost at its minimum point",
    },
    {
      key: "Economies of scale",
      value: "Fall in long run average cost as the scale of output rises",
    },
    {
      key: "Isoquant",
      value: "A curve showing all input combinations giving the same level of output",
    },
    {
      key: "Isocost line",
      value: "A line showing all input combinations that cost the same amount",
    },
  ],
);

eco(
  "ca:eco:market-forms",
  "Price Determination in Different Markets",
  "In market structure, what is %s?",
  "%k is %v.",
  [
    {
      key: "Perfect competition",
      value: "A market with many buyers and sellers, a homogeneous product and free entry",
    },
    { key: "Monopoly", value: "A market with a single seller and no close substitute" },
    { key: "Monopolistic competition", value: "Many sellers offering differentiated products" },
    { key: "Oligopoly", value: "A market dominated by a few interdependent sellers" },
    {
      key: "Price taker",
      value: "A firm that must accept the market price, as under perfect competition",
    },
    {
      key: "Equilibrium condition of a firm",
      value: "Marginal cost equals marginal revenue, with marginal cost rising",
    },
    {
      key: "Price discrimination",
      value: "Charging different prices to different buyers for the same product",
    },
    {
      key: "Kinked demand curve",
      value: "The oligopoly model explaining why prices tend to stay rigid",
    },
    { key: "Cartel", value: "An agreement among firms to fix output or price" },
    {
      key: "Selling cost",
      value: "Expenditure on advertising and promotion, typical of monopolistic competition",
    },
  ],
  [
    { key: "Shut down point", value: "The point where price equals average variable cost" },
    { key: "Break even point", value: "The output at which total revenue equals total cost" },
    {
      key: "Why the monopolist's marginal revenue is below price",
      value: "Because he must lower the price on all units to sell one more",
    },
    {
      key: "Long run equilibrium under perfect competition",
      value: "Price equals marginal cost and minimum average cost, so profit is normal",
    },
    {
      key: "Product differentiation",
      value: "Making a product appear distinct so the firm faces a downward sloping demand curve",
    },
  ],
);

eco(
  "ca:eco:business-cycles",
  "Business Cycles and Indian Economy",
  "In macroeconomics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Business cycle",
      value: "The recurring pattern of expansion and contraction in economic activity",
    },
    { key: "Phases of a business cycle", value: "Expansion, peak, contraction and trough" },
    { key: "Recession", value: "A period of falling output and rising unemployment" },
    { key: "Depression", value: "A severe and prolonged contraction of economic activity" },
    { key: "Inflation", value: "A sustained rise in the general price level" },
    { key: "Deflation", value: "A sustained fall in the general price level" },
    {
      key: "Gross domestic product",
      value: "The money value of all final goods and services produced within a country in a year",
    },
    { key: "Fiscal policy", value: "Government policy on taxation and public expenditure" },
    { key: "Monetary policy", value: "Central bank policy on money supply and interest rates" },
    { key: "Stagflation", value: "The simultaneous occurrence of stagnation and inflation" },
  ],
  [
    {
      key: "Demand pull inflation",
      value: "Inflation caused by aggregate demand exceeding aggregate supply",
    },
    { key: "Cost push inflation", value: "Inflation caused by a rise in the cost of inputs" },
    {
      key: "Multiplier",
      value: "The ratio of the change in income to the change in investment that caused it",
    },
    {
      key: "Accelerator",
      value: "The effect by which a change in consumption induces a larger change in investment",
    },
    {
      key: "Counter cyclical policy",
      value: "Policy that expands in a downturn and contracts in a boom to smooth the cycle",
    },
  ],
);

/* ================================================== Cost Accounting ===== */

cost(
  "ca:cost:elements",
  "Cost Concepts and Elements",
  "In cost accounting, what is %s?",
  "%k is %v.",
  [
    {
      key: "Cost",
      value: "The amount of expenditure incurred on or attributable to a given thing",
    },
    { key: "Direct cost", value: "Cost that can be traced wholly to a cost object" },
    {
      key: "Indirect cost",
      value: "Cost that cannot be traced to one cost object and must be apportioned",
    },
    { key: "Prime cost", value: "Direct material plus direct labour plus direct expenses" },
    { key: "Factory cost", value: "Prime cost plus factory overhead" },
    { key: "Cost of production", value: "Factory cost plus administration overhead" },
    { key: "Cost of sales", value: "Cost of production plus selling and distribution overhead" },
    {
      key: "Cost centre",
      value: "A location, person or item of equipment for which cost is collected",
    },
    {
      key: "Cost unit",
      value: "The unit of product or service in terms of which cost is expressed",
    },
    { key: "Cost object", value: "Anything for which a separate measurement of cost is required" },
  ],
  [
    {
      key: "Difference between cost and expense",
      value:
        "Cost is the resource sacrificed, expense is the cost charged against revenue of a period",
    },
    { key: "Sunk cost", value: "A past cost that cannot be changed by any future decision" },
    { key: "Differential cost", value: "The difference in total cost between two alternatives" },
    {
      key: "Imputed cost",
      value: "A notional cost not involving actual payment, used for decision making",
    },
    {
      key: "Conversion cost",
      value: "Direct labour plus factory overhead, the cost of converting material into product",
    },
  ],
);

cost(
  "ca:cost:labour-overhead",
  "Labour and Overhead Costing",
  "In labour and overhead costing, what is %s?",
  "%k is %v.",
  [
    {
      key: "Time rate system",
      value: "Paying a worker according to the time spent, whatever the output",
    },
    { key: "Piece rate system", value: "Paying a worker according to the units produced" },
    {
      key: "Labour turnover",
      value: "The rate at which workers leave and are replaced in a period",
    },
    { key: "Idle time", value: "The time for which a worker is paid but produces nothing" },
    {
      key: "Overtime premium",
      value: "The extra amount paid over the normal rate for work beyond normal hours",
    },
    {
      key: "Overhead",
      value: "The total of indirect material, indirect labour and indirect expenses",
    },
    { key: "Allocation of overhead", value: "Charging a whole overhead item to one cost centre" },
    {
      key: "Apportionment of overhead",
      value: "Dividing a common overhead among several cost centres on a fair basis",
    },
    {
      key: "Absorption of overhead",
      value: "Charging overhead of a cost centre to the units produced",
    },
    {
      key: "Under absorption",
      value: "The shortfall when absorbed overhead is less than actual overhead",
    },
  ],
  [
    {
      key: "Halsey premium plan",
      value: "The worker gets fifty per cent of the time saved as bonus",
    },
    {
      key: "Rowan premium plan",
      value:
        "The bonus bears the same proportion to time taken as time saved bears to time allowed",
    },
    { key: "Machine hour rate", value: "An absorption rate based on the hours a machine runs" },
    {
      key: "Treatment of over or under absorption",
      value:
        "Transferred to the costing profit and loss account or adjusted by a supplementary rate",
    },
    {
      key: "Difference between allocation and apportionment",
      value: "Allocation charges a whole item to one centre, apportionment splits it among centres",
    },
  ],
);

cost(
  "ca:cost:methods",
  "Costing Methods and Standard Costing",
  "In costing methods, what is %s?",
  "%k is %v.",
  [
    {
      key: "Job costing",
      value: "Costing applied where work is done against specific customer orders",
    },
    {
      key: "Batch costing",
      value: "Costing applied where identical units are produced in batches",
    },
    {
      key: "Contract costing",
      value: "Costing for long duration work carried out at the customer's site",
    },
    {
      key: "Process costing",
      value: "Costing where output passes through a series of continuous processes",
    },
    {
      key: "Operating costing",
      value: "Costing used by service undertakings such as transport and hospitals",
    },
    {
      key: "Equivalent production",
      value: "Expressing work in progress in terms of completed units",
    },
    {
      key: "Joint products",
      value: "Two or more products of similar value produced together from the same process",
    },
    {
      key: "By product",
      value: "A product of minor value produced incidentally along with the main product",
    },
    {
      key: "Standard costing",
      value: "Setting predetermined costs and comparing them with actuals",
    },
    { key: "Variance", value: "The difference between standard cost and actual cost" },
  ],
  [
    {
      key: "Material price variance",
      value: "The difference in actual quantity multiplied by the difference in rate",
    },
    {
      key: "Labour efficiency variance",
      value: "The standard rate multiplied by the difference between standard and actual hours",
    },
    {
      key: "Favourable variance",
      value: "A variance where actual cost is less than standard cost",
    },
    {
      key: "Budgetary control",
      value: "Comparing actual performance with budgets and acting on the differences",
    },
    {
      key: "Difference between budget and standard",
      value: "A budget is for the whole activity, a standard is per unit",
    },
  ],
);

/* ======================================================== Taxation ====== */

tax(
  "ca:tax:income-heads",
  "Heads of Income",
  "In income tax, what is %s?",
  "%k is %v.",
  [
    { key: "Number of heads of income", value: "Five" },
    {
      key: "The five heads of income",
      value: "Salaries, house property, business or profession, capital gains and other sources",
    },
    { key: "Previous year", value: "The financial year in which income is earned" },
    {
      key: "Assessment year",
      value: "The financial year following the previous year, in which income is assessed",
    },
    { key: "Assessee", value: "A person by whom tax or any other sum is payable under the Act" },
    {
      key: "Gross total income",
      value: "The aggregate of income under all five heads before Chapter VI A deductions",
    },
    {
      key: "Total income",
      value: "Gross total income less the deductions allowed under Chapter VI A",
    },
    {
      key: "Standard deduction from salary",
      value: "A flat deduction allowed from income chargeable under the head salaries",
    },
    {
      key: "Annual value of house property",
      value: "The sum for which the property might reasonably be expected to let",
    },
    {
      key: "Deduction for interest on housing loan",
      value: "Allowed under section 24(b) against income from house property",
    },
  ],
  [
    {
      key: "Short term capital asset",
      value: "An asset held for not more than the period prescribed for that class of asset",
    },
    {
      key: "Indexation benefit",
      value:
        "Adjusting the cost of acquisition for inflation while computing long term capital gains",
    },
    {
      key: "Clubbing of income",
      value: "Including another person's income in the assessee's total income in specified cases",
    },
    {
      key: "Set off of losses",
      value: "Adjusting a loss against income of the same or another head as permitted",
    },
    {
      key: "Carry forward of losses",
      value: "Taking an unabsorbed loss to later years within the limits laid down",
    },
  ],
);

tax(
  "ca:tax:gst-detail",
  "GST — Supply, Registration and Returns",
  "Under GST, what is %s?",
  "%k is %v.",
  [
    { key: "Taxable event under GST", value: "Supply of goods or services or both" },
    {
      key: "CGST",
      value: "Central goods and services tax, levied by the Centre on an intra state supply",
    },
    {
      key: "SGST",
      value: "State goods and services tax, levied by the state on an intra state supply",
    },
    {
      key: "IGST",
      value: "Integrated goods and services tax, levied on an inter state supply and on imports",
    },
    {
      key: "Composite supply",
      value: "Two or more supplies naturally bundled, taxed at the rate of the principal supply",
    },
    {
      key: "Mixed supply",
      value: "Two or more supplies made together for a single price, taxed at the highest rate",
    },
    {
      key: "Input tax credit",
      value: "Credit of the tax paid on inward supplies used for business",
    },
    {
      key: "Reverse charge",
      value: "The liability to pay tax falling on the recipient instead of the supplier",
    },
    {
      key: "Composition scheme",
      value: "A simplified scheme allowing small suppliers to pay tax at a flat rate on turnover",
    },
    { key: "GSTIN", value: "The fifteen digit goods and services tax identification number" },
  ],
  [
    {
      key: "Time of supply of goods",
      value: "Earlier of the date of invoice or the date of payment, as prescribed",
    },
    {
      key: "Place of supply",
      value: "The rule that decides whether a supply is intra state or inter state",
    },
    {
      key: "Blocked credit",
      value: "Input tax credit specifically disallowed, such as on motor vehicles in most cases",
    },
    {
      key: "GSTR 3B",
      value: "The monthly summary return of outward supplies and input tax credit",
    },
    {
      key: "E-way bill",
      value: "The electronic document required for movement of goods above the prescribed value",
    },
  ],
);

/* ============================================ Auditing and Ethics ======= */

audit(
  "ca:audit:basics",
  "Nature and Objectives of Audit",
  "In auditing, what is %s?",
  "%k is %v.",
  [
    {
      key: "Audit",
      value: "The independent examination of financial information to express an opinion",
    },
    {
      key: "Objective of an audit",
      value: "To express an opinion on whether the statements give a true and fair view",
    },
    {
      key: "Audit evidence",
      value: "The information used by the auditor to arrive at conclusions",
    },
    {
      key: "Audit risk",
      value: "The risk that the auditor expresses an inappropriate opinion on misstated statements",
    },
    {
      key: "Inherent risk",
      value: "Susceptibility of an assertion to misstatement before considering controls",
    },
    {
      key: "Control risk",
      value: "The risk that internal control fails to prevent or detect a misstatement",
    },
    {
      key: "Detection risk",
      value: "The risk that the auditor's procedures fail to detect a misstatement",
    },
    {
      key: "Materiality in auditing",
      value: "The threshold above which a misstatement could influence users' decisions",
    },
    {
      key: "Professional scepticism",
      value: "A questioning mind and critical assessment of audit evidence",
    },
    { key: "Vouching", value: "Examining documentary evidence in support of entries in the books" },
  ],
  [
    {
      key: "Verification",
      value: "Confirming the existence, ownership and value of assets and liabilities",
    },
    {
      key: "Difference between vouching and verification",
      value: "Vouching tests the transaction, verification tests the balance at the year end",
    },
    {
      key: "Audit sampling",
      value: "Applying procedures to less than the whole population to draw a conclusion about it",
    },
    {
      key: "Internal check",
      value: "An arrangement of duties so that no one person handles a transaction alone",
    },
    {
      key: "Test of controls",
      value: "A procedure to evaluate whether an internal control operated effectively",
    },
  ],
);

audit(
  "ca:audit:report",
  "Audit Report and Professional Ethics",
  "In audit reporting and ethics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Unmodified opinion",
      value: "The opinion expressed when the statements give a true and fair view",
    },
    {
      key: "Qualified opinion",
      value: "The opinion when a misstatement is material but not pervasive",
    },
    {
      key: "Adverse opinion",
      value: "The opinion when misstatements are both material and pervasive",
    },
    {
      key: "Disclaimer of opinion",
      value: "Issued when the auditor cannot obtain sufficient appropriate evidence",
    },
    {
      key: "Emphasis of matter paragraph",
      value:
        "A paragraph drawing attention to a matter already disclosed, without modifying the opinion",
    },
    {
      key: "Key audit matters",
      value: "Matters of most significance in the audit, reported for listed entities",
    },
    {
      key: "Independence",
      value: "Freedom from any interest that could impair professional judgement",
    },
    {
      key: "Professional misconduct",
      value: "Conduct listed in the schedules to the Chartered Accountants Act",
    },
    {
      key: "Confidentiality",
      value: "The duty not to disclose client information without authority",
    },
    {
      key: "Engagement letter",
      value: "The letter recording the agreed terms of the audit engagement",
    },
  ],
  [
    {
      key: "Threats to independence",
      value: "Self interest, self review, advocacy, familiarity and intimidation",
    },
    {
      key: "Going concern reporting",
      value: "The auditor reports on material uncertainty about the entity continuing in operation",
    },
    {
      key: "Reporting on internal financial controls",
      value:
        "Required for companies under the Companies Act, on the adequacy and operating effectiveness",
    },
    {
      key: "CARO report",
      value: "The additional reporting required by the Companies Auditor's Report Order",
    },
    {
      key: "Auditor's duty on fraud",
      value: "To report a fraud above the prescribed amount to the Central Government",
    },
  ],
);

/* ==================================================== Final papers ====== */

dtl(
  "ca:dtl:international",
  "International Taxation and Transfer Pricing",
  "In international taxation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Double taxation avoidance agreement",
      value: "A treaty between two countries to avoid taxing the same income twice",
    },
    {
      key: "Residential status of a company",
      value: "Determined by incorporation in India or place of effective management",
    },
    {
      key: "Place of effective management",
      value: "The place where key management and commercial decisions are in substance made",
    },
    {
      key: "Transfer pricing",
      value:
        "The rules ensuring that transactions between associated enterprises are at arm's length",
    },
    {
      key: "Arm's length price",
      value: "The price that would apply between unrelated parties in comparable circumstances",
    },
    {
      key: "Associated enterprise",
      value: "An enterprise that participates in the management, control or capital of another",
    },
    {
      key: "Advance pricing agreement",
      value: "An agreement fixing the transfer pricing method in advance for future years",
    },
    {
      key: "Permanent establishment",
      value: "A fixed place of business through which a foreign enterprise operates in a country",
    },
    { key: "Withholding tax", value: "Tax deducted at source on payments made to a non resident" },
    {
      key: "GAAR",
      value: "The general anti avoidance rule against impermissible avoidance arrangements",
    },
  ],
  [
    {
      key: "Comparable uncontrolled price method",
      value: "Comparing the price charged with the price in a comparable uncontrolled transaction",
    },
    {
      key: "Transactional net margin method",
      value: "Comparing the net profit margin relative to an appropriate base",
    },
    {
      key: "Country by country report",
      value:
        "The report large multinational groups must file on their global allocation of income and taxes",
    },
    {
      key: "Equalisation levy",
      value: "The levy on specified digital transactions with non residents",
    },
    {
      key: "Tax treaty tie breaker rule",
      value:
        "The sequence of tests used to decide residence when a person is resident in both states",
    },
  ],
);

idt(
  "ca:idt:customs",
  "Customs Law and Foreign Trade Policy",
  "In customs law, what is %s?",
  "%k is %v.",
  [
    { key: "Taxable event in customs", value: "Import into or export out of India" },
    {
      key: "Basic customs duty",
      value: "The duty levied under the Customs Tariff Act on imported goods",
    },
    {
      key: "IGST on imports",
      value: "Integrated tax levied on the value of imported goods plus customs duty",
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
      key: "Transaction value in customs",
      value: "The price actually paid or payable for the goods when sold for export to India",
    },
    {
      key: "Warehousing under customs",
      value: "Storing imported goods without payment of duty until clearance",
    },
    {
      key: "Duty drawback",
      value: "Refund of duty paid on inputs used in goods that are exported",
    },
    {
      key: "Baggage rules",
      value: "The rules governing duty free allowance for passengers arriving in India",
    },
    {
      key: "Export Promotion Capital Goods scheme",
      value: "A scheme allowing import of capital goods at nil duty against an export obligation",
    },
  ],
  [
    {
      key: "Advance authorisation",
      value: "Authorisation to import inputs duty free for use in export production",
    },
    {
      key: "Special economic zone",
      value: "A duty free enclave treated as foreign territory for trade operations",
    },
    {
      key: "Anti dumping duty",
      value: "Duty imposed to counter goods exported at less than normal value",
    },
    {
      key: "Safeguard duty",
      value: "Duty imposed to protect domestic industry from a surge in imports",
    },
    {
      key: "Provisional assessment",
      value:
        "Assessment made when the final value or classification is not immediately ascertainable",
    },
  ],
);

fr(
  "ca:fr:consolidation",
  "Consolidated Financial Statements",
  "In consolidated financial statements, what is %s?",
  "%k is %v.",
  [
    { key: "Subsidiary", value: "An entity controlled by another entity" },
    {
      key: "Control under Ind AS 110",
      value:
        "Power over the investee, exposure to variable returns and the ability to affect those returns",
    },
    { key: "Associate", value: "An entity over which the investor has significant influence" },
    {
      key: "Joint venture",
      value: "An arrangement where parties with joint control have rights to the net assets",
    },
    {
      key: "Non controlling interest",
      value: "The equity in a subsidiary not attributable to the parent",
    },
    {
      key: "Goodwill on consolidation",
      value: "The excess of consideration transferred over the net identifiable assets acquired",
    },
    {
      key: "Capital reserve on consolidation",
      value: "The excess of net assets acquired over the consideration transferred",
    },
    {
      key: "Equity method",
      value: "Accounting for an associate by adjusting the carrying amount for the share of profit",
    },
    {
      key: "Elimination of intra group transactions",
      value: "Removing sales, balances and unrealised profit within the group",
    },
    {
      key: "Ind AS 103",
      value: "The standard on business combinations, which prescribes the acquisition method",
    },
  ],
  [
    {
      key: "Measurement of non controlling interest",
      value: "At fair value or at the proportionate share of net identifiable assets",
    },
    {
      key: "Bargain purchase gain",
      value:
        "The gain recognised when net assets acquired exceed the consideration, after reassessment",
    },
    {
      key: "Loss of control of a subsidiary",
      value:
        "The parent derecognises the assets and liabilities and recognises any retained interest at fair value",
    },
    {
      key: "Uniform accounting policies",
      value: "Group entities must use the same policies for like transactions in consolidation",
    },
    {
      key: "Reporting date alignment",
      value:
        "Subsidiary statements should be drawn to the same date, and the gap cannot exceed three months",
    },
  ],
);

sfm(
  "ca:sfm:capital-budgeting",
  "Capital Budgeting and Portfolio Management",
  "In financial management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Capital budgeting",
      value: "The process of evaluating and selecting long term investment proposals",
    },
    {
      key: "Net present value",
      value: "The present value of cash inflows less the present value of outflows",
    },
    {
      key: "Internal rate of return",
      value: "The discount rate at which the net present value is zero",
    },
    {
      key: "Payback period",
      value: "The time taken for cumulative cash inflows to recover the initial outlay",
    },
    {
      key: "Profitability index",
      value: "The ratio of the present value of inflows to the initial investment",
    },
    {
      key: "Cost of capital",
      value: "The minimum return a firm must earn to satisfy its providers of funds",
    },
    {
      key: "Weighted average cost of capital",
      value: "The average cost of all sources of finance weighted by their proportion",
    },
    {
      key: "Capital asset pricing model",
      value: "A model linking expected return to systematic risk measured by beta",
    },
    { key: "Beta", value: "The measure of a security's sensitivity to movements in the market" },
    {
      key: "Diversification",
      value: "Spreading investment across assets to reduce unsystematic risk",
    },
  ],
  [
    { key: "Systematic risk", value: "Market wide risk that cannot be removed by diversification" },
    {
      key: "Unsystematic risk",
      value: "Firm specific risk that can be removed by diversification",
    },
    {
      key: "Efficient frontier",
      value: "The set of portfolios offering the highest return for a given level of risk",
    },
    { key: "Sharpe ratio", value: "Excess return over the risk free rate per unit of total risk" },
    {
      key: "Modified internal rate of return",
      value: "The rate that assumes reinvestment at the cost of capital rather than at the IRR",
    },
  ],
);

export const CA_FULL_TEMPLATES = templates;
