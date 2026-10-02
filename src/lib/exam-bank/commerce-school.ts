/**
 * CBSE senior secondary Commerce.
 *
 * Source: CBSE Senior Secondary Curriculum 2026-27, cbseacademic.nic.in —
 * Accountancy (subject code 055) and Business Studies (subject code 054).
 * Both are two-year courses carrying the same code into Class 12, and both
 * are 80 theory plus 20 project.
 *
 * Accountancy Class 11 — Part A Financial Accounting I (56 marks):
 *   Theoretical Framework 12, Accounting Process 44.
 *   Part B Financial Accounting II (24 marks): financial statements of a
 *   sole proprietorship.
 * Accountancy Class 12 — Part A: Accounting for Partnership Firms 36,
 *   Accounting for Companies 24. Part B: Financial Statements Analysis 20.
 *
 * Business Studies Class 11 — Part A Foundations of Business 40 (units 1-6),
 *   Part B Finance and Trade 40 (units 7-10).
 * Business Studies Class 12 — Part A Principles and Functions of Management
 *   50 (units 1-8), Part B Business Finance and Marketing 30 (units 9-12).
 *
 * These four CBSE subjects were missing from the bank entirely. ISC has separate
 * syllabi and is intentionally not tagged to these CBSE-only templates.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const C11 = ["CBSE Class 11", "CBSE Class 11-12 Commerce", "CUET"];
const C12 = ["CBSE Class 12", "CBSE Class 11-12 Commerce", "CUET"];

const templates: Template[] = [];
const a11 = chapterFactory(templates, "Accountancy Class 11", C11);
const a12 = chapterFactory(templates, "Accountancy Class 12", C12);
const b11 = chapterFactory(templates, "Business Studies Class 11", C11);
const b12 = chapterFactory(templates, "Business Studies Class 12", C12);

/* ==================== Accountancy Class 11 ============================== */

a11(
  "ac11:framework",
  "Theoretical Framework of Accounting",
  "In the theoretical framework of accounting, what is %s?",
  "%k is %v.",
  [
    {
      key: "Accounting",
      value:
        "The process of identifying, measuring, recording and communicating financial information",
    },
    {
      key: "Book-keeping",
      value:
        "The recording stage of accounting, concerned with the systematic entry of transactions",
    },
    {
      key: "Business entity concept",
      value: "The assumption that the business is separate from its owner",
    },
    {
      key: "Going concern concept",
      value: "The assumption that the business will continue to operate for the foreseeable future",
    },
    {
      key: "Money measurement concept",
      value: "Only transactions that can be expressed in money are recorded",
    },
    {
      key: "Dual aspect concept",
      value: "Every transaction has two aspects, a debit and an equal credit",
    },
    { key: "Accounting equation", value: "Assets equal liabilities plus capital" },
    {
      key: "Conservatism or prudence",
      value: "Anticipate no profit but provide for all possible losses",
    },
    {
      key: "Matching concept",
      value: "Expenses of a period are matched against the revenues of that same period",
    },
    {
      key: "Qualitative characteristics of accounting information",
      value: "Reliability, relevance, understandability and comparability",
    },
  ],
  [
    {
      key: "Difference between book-keeping and accounting",
      value:
        "Book-keeping only records transactions, accounting also classifies, summarises, interprets and communicates the results",
    },
    {
      key: "Reason the business entity concept matters",
      value:
        "Without it, the owner's private dealings would mix with the firm's, and profit could never be measured for the business itself",
    },
    {
      key: "Basis of accounting under cash and accrual",
      value:
        "The cash basis records only actual receipts and payments, the accrual basis records revenue when earned and expense when incurred regardless of cash",
    },
    {
      key: "Consequence of the going concern assumption for asset valuation",
      value:
        "Assets are shown at cost less depreciation rather than at what they would fetch if sold today, because sale is not anticipated",
    },
    {
      key: "Conflict between conservatism and full disclosure",
      value:
        "Conservatism understates profit to be safe, while full disclosure demands everything material be shown, so the two must be balanced by materiality",
    },
  ],
);

a11(
  "ac11:process",
  "Accounting Process: Journal, Ledger and Trial Balance",
  "In the accounting process, what is %s?",
  "%k is %v.",
  [
    {
      key: "Journal",
      value: "The book of original entry in which transactions are first recorded in date order",
    },
    { key: "Ledger", value: "The book of final entry containing all the accounts of the business" },
    { key: "Posting", value: "Transferring entries from the journal to the ledger" },
    { key: "Golden rule for a personal account", value: "Debit the receiver, credit the giver" },
    { key: "Golden rule for a real account", value: "Debit what comes in, credit what goes out" },
    {
      key: "Golden rule for a nominal account",
      value: "Debit all expenses and losses, credit all incomes and gains",
    },
    {
      key: "Trial balance",
      value:
        "A statement of all ledger balances prepared to check the arithmetical accuracy of the books",
    },
    {
      key: "Cash book",
      value:
        "A subsidiary book that records all cash and bank transactions and also serves as a ledger account",
    },
    {
      key: "Contra entry",
      value: "An entry that affects both the cash and the bank column of the cash book",
    },
    {
      key: "Bank reconciliation statement",
      value: "A statement reconciling the cash book balance with the pass book balance",
    },
  ],
  [
    {
      key: "Errors a trial balance cannot detect",
      value:
        "Errors of omission, of principle, of commission within the same side, compensating errors, and wrong entries made in the original book",
    },
    {
      key: "Suspense account",
      value:
        "A temporary account opened to make a disagreeing trial balance agree, closed once the one-sided errors are located",
    },
    {
      key: "Difference between an error of principle and an error of commission",
      value:
        "An error of principle records a transaction in the wrong class of account, such as capital as revenue, while an error of commission is a clerical slip such as a wrong amount or wrong account of the same class",
    },
    {
      key: "Reason the pass book and cash book differ",
      value:
        "Timing differences such as cheques issued but not presented and cheques deposited but not cleared, plus bank charges and direct credits the firm has not yet recorded",
    },
    {
      key: "Treatment of a petty cash imprest system",
      value:
        "The petty cashier begins each period with a fixed float and is reimbursed exactly what was spent, so the float is restored",
    },
  ],
);

a11(
  "ac11:depreciation-provisions",
  "Depreciation, Provisions and Reserves",
  "In accounting for depreciation and reserves, what is %s?",
  "%k is %v.",
  [
    {
      key: "Depreciation",
      value: "The systematic allocation of the cost of a fixed asset over its useful life",
    },
    {
      key: "Straight line method",
      value: "An equal amount of depreciation charged each year on the original cost",
    },
    {
      key: "Written down value method",
      value: "Depreciation charged at a fixed rate on the reducing book value each year",
    },
    {
      key: "Causes of depreciation",
      value: "Wear and tear, passage of time, obsolescence, depletion and accidents",
    },
    {
      key: "Provision",
      value:
        "An amount set aside for a known liability whose amount cannot be determined with accuracy",
    },
    {
      key: "Reserve",
      value:
        "An appropriation of profit set aside to strengthen the financial position of the business",
    },
    {
      key: "Revenue reserve",
      value: "A reserve created out of revenue profits and available for distribution as dividend",
    },
    {
      key: "Capital reserve",
      value: "A reserve created out of capital profits and not normally available for dividend",
    },
    {
      key: "Secret reserve",
      value:
        "A reserve not disclosed in the balance sheet, which understates the true financial position",
    },
    {
      key: "Scrap value",
      value: "The estimated amount an asset will realise at the end of its useful life",
    },
  ],
  [
    {
      key: "Difference between provision and reserve",
      value:
        "A provision is a charge against profit and must be made even if there is a loss, a reserve is an appropriation of profit made only when there is a profit",
    },
    {
      key: "Reason the written down value method suits machinery",
      value:
        "Repair costs rise as an asset ages, so a falling depreciation charge keeps the total cost of using the asset roughly even across years",
    },
    {
      key: "Effect of charging too little depreciation",
      value:
        "Profit and asset value are both overstated, dividends may be paid out of capital, and the business is left without funds to replace the asset",
    },
    {
      key: "Treatment on sale of a fixed asset",
      value:
        "Depreciation is charged up to the date of sale, the asset account is closed to an asset disposal account, and the difference between book value and sale proceeds is the profit or loss on sale",
    },
    {
      key: "Difference between depreciation, depletion and amortisation",
      value:
        "Depreciation applies to tangible fixed assets, depletion to wasting natural resources such as mines, and amortisation to intangibles such as patents and goodwill",
    },
  ],
);

a11(
  "ac11:final-accounts",
  "Financial Statements of a Sole Proprietorship",
  "In the final accounts of a sole trader, what is %s?",
  "%k is %v.",
  [
    {
      key: "Trading account",
      value: "The account prepared to find the gross profit or gross loss of a period",
    },
    {
      key: "Profit and loss account",
      value:
        "The account prepared to find the net profit or net loss after all indirect expenses and incomes",
    },
    {
      key: "Balance sheet",
      value: "A statement of assets, liabilities and capital on a given date",
    },
    { key: "Gross profit", value: "Net sales less cost of goods sold" },
    {
      key: "Cost of goods sold",
      value: "Opening stock plus purchases plus direct expenses less closing stock",
    },
    {
      key: "Direct expenses",
      value:
        "Expenses incurred to bring goods to a saleable condition, such as carriage inward, wages and freight",
    },
    {
      key: "Outstanding expense",
      value: "An expense incurred but not yet paid, shown as a liability",
    },
    {
      key: "Prepaid expense",
      value: "An expense paid in advance for a future period, shown as an asset",
    },
    {
      key: "Drawings",
      value: "Cash or goods withdrawn by the owner for personal use, deducted from capital",
    },
    {
      key: "Current assets",
      value:
        "Assets expected to be converted into cash within one year, such as stock, debtors and cash",
    },
  ],
  [
    {
      key: "Double effect of a closing adjustment",
      value:
        "Every adjustment appears twice, once in the trading or profit and loss account and once in the balance sheet, which is the dual aspect concept applied to final accounts",
    },
    {
      key: "Treatment of goods distributed as free samples",
      value:
        "Deducted from purchases and charged to the profit and loss account as advertisement expense",
    },
    {
      key: "Treatment of a provision for doubtful debts",
      value:
        "Debtors are shown net of the provision in the balance sheet, and any increase in the provision is charged to the profit and loss account",
    },
    {
      key: "Difference between a trial balance and a balance sheet",
      value:
        "A trial balance lists every ledger balance to test arithmetic, a balance sheet shows only assets, liabilities and capital to report financial position",
    },
    {
      key: "Marshalling of a balance sheet",
      value:
        "The order in which assets and liabilities are arranged, either in order of liquidity or in order of permanence",
    },
  ],
);

/* ==================== Accountancy Class 12 ============================== */

a12(
  "ac12:partnership-basics",
  "Accounting for Partnership Firms: Fundamentals",
  "In partnership accounting, what is %s?",
  "%k is %v.",
  [
    {
      key: "Partnership",
      value:
        "The relation between persons who have agreed to share the profits of a business carried on by all or any of them acting for all",
    },
    {
      key: "Partnership deed",
      value: "The written agreement setting out the terms on which the partners carry on business",
    },
    {
      key: "Profit sharing ratio in the absence of a deed",
      value: "Equal, whatever the capital contributed",
    },
    { key: "Interest on capital in the absence of a deed", value: "No interest is allowed" },
    {
      key: "Interest on a partner's loan in the absence of a deed",
      value: "Six per cent per annum",
    },
    {
      key: "Fixed capital method",
      value:
        "Each partner has a capital account that does not change and a separate current account for all other items",
    },
    {
      key: "Fluctuating capital method",
      value:
        "A single capital account carries drawings, interest, salary and share of profit, so the balance changes each year",
    },
    {
      key: "Profit and loss appropriation account",
      value:
        "The account that distributes net profit among the partners after interest, salary and commission",
    },
    {
      key: "Goodwill",
      value:
        "The value of the reputation of a firm, which enables it to earn more than the normal rate of return",
    },
    {
      key: "Sacrificing ratio",
      value: "The ratio in which old partners give up their share in favour of a new partner",
    },
  ],
  [
    {
      key: "Difference between the fixed and fluctuating capital methods",
      value:
        "Under the fixed method the capital account balance never changes except for fresh capital or permanent withdrawal, and can never be negative in presentation, while under the fluctuating method one account absorbs everything",
    },
    {
      key: "Three methods of valuing goodwill",
      value: "The average profit method, the super profit method and the capitalisation method",
    },
    {
      key: "Super profit",
      value:
        "Actual average profit less the normal profit expected on the capital employed, and goodwill is this figure multiplied by the number of years of purchase",
    },
    {
      key: "Reason interest on a partner's loan is a charge and not an appropriation",
      value:
        "A loan is a liability of the firm and not capital, so the interest must be paid whether or not there is a profit",
    },
    {
      key: "Gaining ratio",
      value:
        "The ratio in which continuing partners acquire the share of a retiring or deceased partner, calculated as new share less old share",
    },
  ],
);

a12(
  "ac12:partnership-changes",
  "Admission, Retirement, Death and Dissolution",
  "In the reconstitution of a partnership, what is %s?",
  "%k is %v.",
  [
    {
      key: "Reconstitution of a firm",
      value:
        "Any change in the agreement among partners, such as admission, retirement, death or a change in the ratio",
    },
    {
      key: "Revaluation account",
      value:
        "The account prepared to record the increase or decrease in the value of assets and liabilities on reconstitution",
    },
    {
      key: "Treatment of the revaluation profit on admission",
      value: "Credited to the old partners in their old profit sharing ratio",
    },
    {
      key: "New profit sharing ratio",
      value:
        "The ratio in which all the partners, including the new one, share profits after admission",
    },
    {
      key: "Treatment of accumulated reserves on admission",
      value:
        "Distributed among the old partners in their old ratio before the new partner is admitted",
    },
    {
      key: "Amount payable to a retiring partner",
      value:
        "Capital balance, plus share of goodwill, revaluation profit and reserves, less drawings and losses",
    },
    {
      key: "Executor's account",
      value: "The account in which the amount due to a deceased partner is transferred",
    },
    {
      key: "Dissolution of a firm",
      value: "The closing down of the business and the winding up of the partnership entirely",
    },
    {
      key: "Realisation account",
      value:
        "The account prepared on dissolution to record the sale of assets and the settlement of liabilities",
    },
    {
      key: "Garner versus Murray rule",
      value:
        "The rule that a solvent partner bears the deficiency of an insolvent partner in the ratio of their last agreed capitals",
    },
  ],
  [
    {
      key: "Difference between dissolution of partnership and dissolution of firm",
      value:
        "Dissolution of partnership changes the relation but the business continues, dissolution of the firm ends the business and the books are closed",
    },
    {
      key: "Difference between the revaluation account and the realisation account",
      value:
        "Revaluation is prepared on reconstitution and records only the change in value, realisation is prepared on dissolution and records the assets and liabilities at their book value and their actual realisation",
    },
    {
      key: "Order of payment on dissolution",
      value:
        "Outside creditors first, then partners' loans, then partners' capital, and any surplus in the profit sharing ratio",
    },
    {
      key: "Way a deceased partner's share of profit is calculated",
      value:
        "On the basis of time or on the basis of turnover from the last balance sheet date to the date of death, using the previous year's rate of profit",
    },
    {
      key: "Hidden goodwill on admission",
      value:
        "Goodwill inferred from the capital the new partner brings, worked out as the total capitalised value of the firm less the actual combined capital",
    },
  ],
);

a12(
  "ac12:company-accounts",
  "Accounting for Companies: Shares and Debentures",
  "In company accounts, what is %s?",
  "%k is %v.",
  [
    {
      key: "Authorised capital",
      value: "The maximum capital a company is permitted to raise by its memorandum of association",
    },
    {
      key: "Issued capital",
      value: "The part of authorised capital actually offered to the public for subscription",
    },
    {
      key: "Called-up capital",
      value: "The part of the subscribed capital that shareholders have been asked to pay",
    },
    { key: "Paid-up capital", value: "The part of the called-up capital actually received" },
    {
      key: "Calls in arrears",
      value: "The amount called up but not yet received from shareholders",
    },
    { key: "Calls in advance", value: "Money received from a shareholder before the call is made" },
    {
      key: "Forfeiture of shares",
      value: "The cancellation of shares on which calls remain unpaid",
    },
    {
      key: "Pro rata allotment",
      value:
        "Allotment of shares in proportion to the number applied for, when the issue is over-subscribed",
    },
    {
      key: "Debenture",
      value:
        "An acknowledgement of debt issued by a company, usually carrying a fixed rate of interest",
    },
    {
      key: "Securities premium",
      value: "The excess of the issue price of a share over its face value",
    },
  ],
  [
    {
      key: "Difference between a share and a debenture",
      value:
        "A share is ownership carrying a variable dividend and voting rights, a debenture is a loan carrying fixed interest, no voting right, and a prior claim on repayment",
    },
    {
      key: "Permitted uses of the securities premium",
      value:
        "Issuing bonus shares, writing off preliminary expenses, writing off the discount or expenses on an issue, providing the premium on redemption, and buying back securities",
    },
    {
      key: "Accounting on reissue of forfeited shares",
      value:
        "The discount allowed on reissue is debited to the share forfeiture account, and any balance left in it is transferred to capital reserve",
    },
    {
      key: "Reason interest on debentures is a charge against profit",
      value:
        "Debenture holders are creditors, so their interest must be paid whether or not the company makes a profit, and it is allowed as a deduction for tax",
    },
    {
      key: "Methods of redemption of debentures",
      value:
        "In lump sum at maturity, in instalments by draw of lots, by purchase in the open market, and by conversion into shares",
    },
  ],
);

a12(
  "ac12:statement-analysis",
  "Financial Statements Analysis and Cash Flow",
  "In financial statement analysis, what is %s?",
  "%k is %v.",
  [
    {
      key: "Comparative statement",
      value:
        "A statement showing figures of two or more periods side by side with the absolute and percentage change",
    },
    {
      key: "Common size statement",
      value:
        "A statement in which every item is expressed as a percentage of a common base, such as revenue from operations or total assets",
    },
    {
      key: "Current ratio",
      value: "Current assets divided by current liabilities, with two to one taken as satisfactory",
    },
    {
      key: "Quick ratio",
      value: "Quick assets divided by current liabilities, with one to one taken as satisfactory",
    },
    { key: "Debt equity ratio", value: "Long term debt divided by shareholders' funds" },
    {
      key: "Inventory turnover ratio",
      value: "Cost of revenue from operations divided by average inventory",
    },
    {
      key: "Operating ratio",
      value:
        "Cost of revenue from operations plus operating expenses, divided by revenue from operations",
    },
    {
      key: "Cash flow statement",
      value:
        "A statement classifying cash flows into operating, investing and financing activities",
    },
    {
      key: "Operating activities",
      value: "The principal revenue-producing activities of the enterprise",
    },
    {
      key: "Financing activities",
      value: "Activities that change the size and composition of owners' capital and borrowings",
    },
  ],
  [
    {
      key: "Reason a high current ratio is not always good",
      value:
        "It may mean idle cash, excessive inventory or slow-moving debtors, so the quick ratio and turnover ratios must be read alongside it",
    },
    {
      key: "Treatment of interest paid by a finance company in the cash flow statement",
      value:
        "For a financial enterprise interest paid and received is an operating activity, while for other enterprises interest paid is financing and interest received is investing",
    },
    {
      key: "Difference between cash flow and fund flow",
      value:
        "Cash flow tracks movement of cash and cash equivalents only, fund flow tracks the change in working capital as a whole",
    },
    {
      key: "Limitations of ratio analysis",
      value:
        "It ignores price level changes and qualitative factors, depends on the reliability of the statements, and a single ratio in isolation can mislead without a standard to compare against",
    },
    {
      key: "Way the operating activities section is prepared under the indirect method",
      value:
        "Start from net profit before tax and extraordinary items, add back non-cash and non-operating charges, deduct non-operating incomes, then adjust for the change in working capital",
    },
  ],
);

/* ==================== Business Studies Class 11 ========================= */

b11(
  "bs11:nature-forms",
  "Nature of Business and Forms of Business Organisation",
  "In the foundations of business, what is %s?",
  "%k is %v.",
  [
    {
      key: "Business",
      value:
        "An economic activity involving the production or exchange of goods and services to earn profit",
    },
    {
      key: "Profession",
      value:
        "An occupation requiring specialised knowledge and governed by a professional body's code of conduct",
    },
    {
      key: "Employment",
      value:
        "An occupation in which a person works for another under a contract of service for wages",
    },
    {
      key: "Industry",
      value: "The part of business concerned with the production or processing of goods",
    },
    {
      key: "Commerce",
      value:
        "Trade together with all the activities that assist trade, called auxiliaries to trade",
    },
    {
      key: "Auxiliaries to trade",
      value: "Transport, banking, insurance, warehousing and advertising",
    },
    {
      key: "Sole proprietorship",
      value: "A business owned, managed and controlled by one person who bears all risk",
    },
    {
      key: "Partnership",
      value: "An association of two or more persons who agree to share the profits of a business",
    },
    {
      key: "Hindu Undivided Family business",
      value: "A business owned by the members of a joint Hindu family and controlled by the Karta",
    },
    {
      key: "Cooperative society",
      value:
        "A voluntary association of persons formed to protect the economic interests of its members, run on one member one vote",
    },
  ],
  [
    {
      key: "Difference between a private and a public company",
      value:
        "A private company restricts the transfer of shares, may have as few as two members and cannot invite the public to subscribe, a public company has no such restriction and needs at least seven members",
    },
    {
      key: "Chief merit and demerit of a sole proprietorship",
      value:
        "Quick decisions and full secrecy, against unlimited liability and limited capital and life",
    },
    {
      key: "Meaning of separate legal entity for a company",
      value:
        "The company can own property, sue and be sued in its own name, and its existence is independent of its members",
    },
    {
      key: "Difference between industry, commerce and trade",
      value:
        "Industry produces, trade buys and sells, and commerce is trade plus the auxiliaries that make trade possible",
    },
    {
      key: "Factors that decide the right form of organisation",
      value:
        "Cost and ease of formation, capital required, liability, continuity, managerial ability and the degree of control desired",
    },
  ],
);

b11(
  "bs11:enterprises-services",
  "Public and Global Enterprises, Business Services and Emerging Modes",
  "In this part of business studies, what is %s?",
  "%k is %v.",
  [
    {
      key: "Departmental undertaking",
      value:
        "The oldest form of public enterprise, run as a department of a ministry with no separate legal identity",
    },
    {
      key: "Statutory corporation",
      value:
        "A public enterprise set up by a special Act of Parliament or a state legislature which defines its powers",
    },
    {
      key: "Government company",
      value:
        "A company in which not less than fifty one per cent of the paid-up capital is held by the government",
    },
    {
      key: "Multinational company",
      value:
        "A company that owns or controls production or service facilities in more than one country",
    },
    {
      key: "Joint venture",
      value:
        "A business arrangement in which two or more parties pool resources for a specific project while remaining separate entities",
    },
    {
      key: "Public Private Partnership",
      value:
        "An arrangement in which a government service is funded and operated through a partnership with the private sector",
    },
    {
      key: "Business services",
      value:
        "Services that support business, chiefly banking, insurance, transport, warehousing and communication",
    },
    {
      key: "Principle of utmost good faith in insurance",
      value: "Both parties must disclose all material facts fully and truthfully",
    },
    {
      key: "Principle of indemnity",
      value: "The insured is compensated only for the actual loss and cannot profit from insurance",
    },
    {
      key: "e-business",
      value:
        "The conduct of business processes over a computer network, of which e-commerce is a part",
    },
  ],
  [
    {
      key: "Difference between e-business and e-commerce",
      value:
        "e-commerce is buying and selling online, e-business is wider and covers all business processes carried on electronically, including production, stock and staff management",
    },
    {
      key: "Business process outsourcing",
      value:
        "Contracting out non-core business processes such as payroll, customer support or accounting to an outside specialist",
    },
    {
      key: "Reason the principle of subrogation exists",
      value:
        "Once the insurer has paid for a total loss, ownership of the damaged property passes to the insurer, so the insured cannot also recover its salvage value",
    },
    {
      key: "Difference between a bank overdraft and a cash credit",
      value:
        "An overdraft lets a current account holder draw beyond the balance up to a limit, cash credit is a separate account sanctioned against the security of stock and debtors",
    },
    {
      key: "Risks of e-business",
      value:
        "Transaction risk, data storage and transmission risk, risk of threat to intellectual property and privacy, and the absence of personal touch",
    },
  ],
);

b11(
  "bs11:finance-trade",
  "Sources of Business Finance, Small Business and Trade",
  "In business finance and trade, what is %s?",
  "%k is %v.",
  [
    {
      key: "Owner's funds",
      value: "Funds supplied by the owners, namely equity shares and retained earnings",
    },
    {
      key: "Borrowed funds",
      value:
        "Funds raised by borrowing, such as debentures, loans, public deposits and trade credit",
    },
    {
      key: "Equity share",
      value:
        "A share carrying ownership, a variable dividend and voting rights, with a residual claim on assets",
    },
    {
      key: "Preference share",
      value:
        "A share carrying a fixed dividend and priority in dividend and repayment, usually without voting rights",
    },
    {
      key: "Retained earnings",
      value: "The part of profit ploughed back into the business rather than distributed",
    },
    {
      key: "Trade credit",
      value:
        "Credit extended by one trader to another for the purchase of goods, a source of short term finance",
    },
    {
      key: "Global Depository Receipt",
      value:
        "A negotiable instrument issued to raise funds abroad, denominated in a currency other than that of the issuing company",
    },
    {
      key: "Internal trade",
      value: "Buying and selling of goods within the boundaries of a country",
    },
    {
      key: "Chamber of commerce",
      value: "An association of business houses that promotes and protects the interests of trade",
    },
    {
      key: "GST",
      value:
        "Goods and Services Tax, a single destination-based indirect tax that replaced many central and state taxes",
    },
  ],
  [
    {
      key: "Difference between equity and preference shares",
      value:
        "Equity carries voting rights, a fluctuating dividend and the residual claim, preference carries a fixed dividend, priority in payment and normally no vote",
    },
    {
      key: "Reason retained earnings are called a costless source",
      value:
        "There is no issue cost and no fixed obligation, though the opportunity cost of the shareholders' forgone dividend is real",
    },
    {
      key: "Role of small business in the Indian economy",
      value:
        "It is the second largest employer after agriculture, uses local resources, spreads industry to rural areas and promotes equitable distribution of income",
    },
    {
      key: "Difference between wholesale and retail trade",
      value:
        "A wholesaler buys in bulk from producers and sells to retailers, a retailer buys from wholesalers and sells in small quantities to final consumers",
    },
    {
      key: "Functions of a departmental store",
      value:
        "It brings many lines of goods under one roof with a central management, offering wide choice, services and amenities at a high operating cost",
    },
  ],
);

/* ==================== Business Studies Class 12 ========================= */

b12(
  "bs12:management-principles",
  "Nature of Management, Principles and Business Environment",
  "In management theory, what is %s?",
  "%k is %v.",
  [
    {
      key: "Management",
      value:
        "The process of getting things done with the aim of achieving goals effectively and efficiently",
    },
    { key: "Effectiveness", value: "Completing the task and achieving the goal" },
    { key: "Efficiency", value: "Achieving the goal at the least cost of resources" },
    { key: "Three levels of management", value: "Top, middle and supervisory or operational" },
    {
      key: "Coordination",
      value:
        "The orderly arrangement of group effort to provide unity of action, called the essence of management",
    },
    { key: "Father of scientific management", value: "F. W. Taylor" },
    { key: "Father of general management", value: "Henri Fayol" },
    {
      key: "Principle of unity of command",
      value: "An employee should receive orders from one superior only",
    },
    {
      key: "Principle of unity of direction",
      value: "One head and one plan for a group of activities having the same objective",
    },
    {
      key: "Business environment",
      value:
        "The sum of all individuals, institutions and forces outside a business that affect its performance",
    },
  ],
  [
    {
      key: "Difference between Taylor's and Fayol's contributions",
      value:
        "Taylor worked from the shop floor upward on efficiency of the worker through scientific study, Fayol worked from the top downward on the administrative functions of the manager",
    },
    {
      key: "Four techniques of scientific management",
      value:
        "Functional foremanship, standardisation and simplification of work, method and time study, and the differential piece wage system",
    },
    {
      key: "Mental revolution in Taylor's principles",
      value:
        "A complete change of attitude on both sides, where workers and management stop fighting over the division of surplus and cooperate to increase it",
    },
    {
      key: "Dimensions of the business environment",
      value: "Economic, social, technological, political and legal",
    },
    {
      key: "Impact of liberalisation, privatisation and globalisation on Indian business",
      value:
        "Increased competition, more demanding customers, rapidly changing technology, the need for change and a market orientation, and the demand for human resources with new skills",
    },
  ],
);

b12(
  "bs12:management-functions",
  "Planning, Organising, Staffing, Directing and Controlling",
  "In the functions of management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Planning",
      value: "Deciding in advance what to do and how to do it, the primary function of management",
    },
    {
      key: "Single use plan",
      value: "A plan made for a one-off event or project, such as a budget or a programme",
    },
    {
      key: "Standing plan",
      value:
        "A plan used repeatedly, such as an objective, strategy, policy, procedure, method or rule",
    },
    {
      key: "Organising",
      value:
        "Identifying and grouping work, assigning duties and establishing authority relationships",
    },
    {
      key: "Functional structure",
      value:
        "An organisation grouped by the functions performed, such as production, marketing and finance",
    },
    {
      key: "Divisional structure",
      value: "An organisation grouped by product lines, each division having its own functions",
    },
    {
      key: "Delegation",
      value:
        "The downward transfer of authority from a superior to a subordinate, consisting of authority, responsibility and accountability",
    },
    {
      key: "Decentralisation",
      value:
        "The systematic dispersal of decision making authority to the lower levels of the organisation",
    },
    {
      key: "Staffing",
      value: "Filling and keeping filled the positions in the organisation structure",
    },
    {
      key: "Controlling",
      value: "Ensuring that actual performance conforms to planned performance",
    },
  ],
  [
    {
      key: "Reason planning is said to be pervasive yet may fail",
      value:
        "Every manager at every level plans, but plans rest on forecasts, reduce creativity, involve cost and time, and cannot guarantee success in a changing environment",
    },
    {
      key: "Difference between authority, responsibility and accountability",
      value:
        "Authority can be delegated, responsibility cannot be entirely transferred, and accountability always remains with the person who delegated",
    },
    {
      key: "Maslow's hierarchy of needs",
      value:
        "Physiological, safety, affiliation or belonging, esteem, and self actualisation, each becoming a motivator only after the one below is broadly satisfied",
    },
    {
      key: "Difference between formal and informal communication",
      value:
        "Formal communication flows along the official chain in vertical, horizontal or diagonal directions, informal or grapevine communication arises from social relationships and spreads fast but can distort",
    },
    {
      key: "Relationship between planning and controlling",
      value:
        "Planning is prescriptive and controlling is evaluative; planning without control is meaningless and control without a plan has no standard, so the two are inseparable twins",
    },
  ],
);

b12(
  "bs12:finance-marketing",
  "Financial Management, Financial Markets, Marketing and Consumer Protection",
  "In business finance and marketing, what is %s?",
  "%k is %v.",
  [
    {
      key: "Financial management",
      value:
        "The planning, raising, controlling and administering of the funds used in the business",
    },
    {
      key: "Capital structure",
      value: "The mix of owners' funds and borrowed funds used to finance the business",
    },
    {
      key: "Financial leverage",
      value:
        "The proportion of debt in the total capital, which raises the return to equity when the return on investment exceeds the cost of debt",
    },
    {
      key: "Working capital",
      value: "The excess of current assets over current liabilities, used to meet day to day needs",
    },
    {
      key: "Money market",
      value:
        "The market for short term funds of up to one year, dealing in treasury bills, commercial paper and call money",
    },
    {
      key: "Capital market",
      value:
        "The market for medium and long term funds, comprising the primary and secondary markets",
    },
    {
      key: "Primary market",
      value:
        "The market in which fresh securities are issued for the first time, also called the new issue market",
    },
    {
      key: "SEBI",
      value: "The Securities and Exchange Board of India, the regulator of the securities market",
    },
    {
      key: "Marketing mix",
      value:
        "The set of controllable variables used to influence buyers, namely product, price, place and promotion",
    },
    {
      key: "Consumer Protection Act",
      value:
        "The law that gives consumers rights and a three-tier machinery of district, state and national commissions for redress",
    },
  ],
  [
    {
      key: "Difference between marketing and selling",
      value:
        "Selling starts with the product and aims to convert it into cash, marketing starts with the customer's need and aims to satisfy it profitably, so selling is only one part of marketing",
    },
    {
      key: "Factors affecting the choice of capital structure",
      value:
        "Cash flow position, interest coverage and debt service coverage, return on investment, cost of debt, tax rate, cost of equity, floatation costs, risk consideration, flexibility, control and the state of the capital market",
    },
    {
      key: "Six rights of a consumer",
      value:
        "The right to safety, to be informed, to choose, to be heard, to seek redressal and to consumer education",
    },
    {
      key: "Four elements of the promotion mix",
      value: "Advertising, personal selling, sales promotion and public relations",
    },
    {
      key: "Difference between the primary and secondary market",
      value:
        "The primary market issues new securities and funds go to the company, the secondary market trades existing securities between investors and the company receives nothing",
    },
  ],
);

export const COMMERCE_SCHOOL_TEMPLATES = templates;
