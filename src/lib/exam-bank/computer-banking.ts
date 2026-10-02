/**
 * Banking Awareness and Computer Awareness — the rest of the syllabus.
 *
 * `facts-banking.ts` covers abbreviations, banking history, banking terms,
 * numericals, computer abbreviations, fundamentals, generations, file formats,
 * devices, shortcuts and memory units. This file adds the remaining chapters
 * that IBPS, SBI, RRB, insurance and state clerical papers set.
 */

import { type Template } from "./core";
import { APTITUDE_WIDE, BANKING, SSC_RRB, chapterFactory } from "./two-layer";

const BANK_EXAMS = [
  ...new Set([
    ...BANKING,
    "SSC CGL",
    "RRB NTPC",
    "State Clerk",
    "Punjab Clerk",
    "PSSSB",
    "State PSC",
  ]),
];
const COMP_EXAMS = [...new Set([...BANKING, ...SSC_RRB, ...APTITUDE_WIDE, "CUET", "PSTET/CTET"])];

const templates: Template[] = [];
const bank = chapterFactory(templates, "Banking Awareness", BANK_EXAMS);
const comp = chapterFactory(templates, "Computer Awareness", COMP_EXAMS);

/* =================================================== Banking Awareness = */

bank(
  "bank:rbi",
  "RBI and its Functions",
  "About the Reserve Bank of India, what is %s?",
  "%k is %v.",
  [
    { key: "Year the RBI was established", value: "1935, under the RBI Act of 1934" },
    { key: "Year the RBI was nationalised", value: "1949" },
    { key: "Headquarters of the RBI", value: "Mumbai" },
    { key: "First Governor of the RBI", value: "Sir Osborne Smith" },
    { key: "First Indian Governor of the RBI", value: "C D Deshmukh" },
    {
      key: "Banker to the government",
      value: "A core RBI function of managing the accounts and debt of the Union and the states",
    },
    {
      key: "Lender of last resort",
      value: "The RBI role of lending to banks facing a liquidity crisis",
    },
    {
      key: "Currency issuing authority in India",
      value: "The RBI, for all notes except the one rupee note",
    },
    { key: "Issuer of the one rupee note", value: "The Ministry of Finance, Government of India" },
    {
      key: "Minimum reserve system",
      value:
        "The RBI keeps at least 200 crore rupees in gold and foreign securities against note issue",
    },
  ],
  [
    {
      key: "Section 22 of the RBI Act",
      value: "The provision giving the RBI the sole right to issue bank notes in India",
    },
    {
      key: "Ways and Means Advances",
      value:
        "Short-term RBI credit to governments to bridge temporary mismatches in receipts and payments",
    },
    {
      key: "Clean Note Policy",
      value:
        "The RBI policy of withdrawing soiled notes and keeping good quality notes in circulation",
    },
    {
      key: "Central board of the RBI",
      value: "The apex governing body, with the Governor, Deputy Governors and nominated directors",
    },
    {
      key: "Financial Stability Report",
      value: "The half-yearly RBI publication assessing risks to the financial system",
    },
  ],
);

bank(
  "bank:monetary-policy",
  "Monetary Policy and Rates",
  "In monetary policy, what is %s?",
  "%k is %v.",
  [
    {
      key: "Repo rate",
      value: "The rate at which the RBI lends short-term funds to banks against securities",
    },
    { key: "Reverse repo rate", value: "The rate at which the RBI borrows from banks" },
    {
      key: "Bank rate",
      value: "The rate at which the RBI lends long-term funds without collateral",
    },
    {
      key: "Cash Reserve Ratio",
      value: "The share of net demand and time liabilities kept as cash with the RBI",
    },
    {
      key: "Statutory Liquidity Ratio",
      value: "The share of liabilities kept in cash, gold or approved securities",
    },
    {
      key: "Marginal Standing Facility",
      value: "An overnight window letting banks borrow beyond the repo limit at a higher rate",
    },
    {
      key: "Open Market Operations",
      value: "The RBI purchase and sale of government securities to manage liquidity",
    },
    {
      key: "Liquidity Adjustment Facility",
      value: "The repo and reverse repo framework used for day to day liquidity management",
    },
    { key: "Monetary Policy Committee size", value: "Six members, headed by the RBI Governor" },
    {
      key: "Inflation target of the RBI",
      value: "Four per cent CPI inflation with a band of two per cent on either side",
    },
  ],
  [
    {
      key: "Effect of a repo rate cut",
      value: "Borrowing becomes cheaper, credit expands and demand is stimulated",
    },
    {
      key: "Standing Deposit Facility",
      value: "An uncollateralised RBI window to absorb liquidity, introduced in 2022",
    },
    {
      key: "Difference between CRR and SLR",
      value:
        "CRR is held as cash with the RBI and earns nothing; SLR is held by the bank itself in liquid assets and earns a return",
    },
    {
      key: "Operation Twist",
      value:
        "Simultaneous purchase of long-term and sale of short-term government securities to shape the yield curve",
    },
    {
      key: "Quantitative versus qualitative tools",
      value:
        "Quantitative tools such as repo and CRR affect the volume of credit; qualitative tools such as margin requirements affect its direction",
    },
  ],
);

bank(
  "bank:structure",
  "Structure and Types of Banks",
  "In the Indian banking structure, what is %s?",
  "%k is %v.",
  [
    { key: "Scheduled bank", value: "A bank listed in the Second Schedule of the RBI Act" },
    { key: "Public sector bank", value: "A bank in which the government holds a majority stake" },
    {
      key: "Private sector bank",
      value: "A bank in which private shareholders hold the majority stake",
    },
    {
      key: "Regional Rural Bank",
      value: "A bank set up in 1975 to serve rural credit needs, sponsored by a commercial bank",
    },
    {
      key: "Cooperative bank",
      value: "A member-owned bank registered under cooperative societies law",
    },
    {
      key: "Payments bank",
      value: "A differentiated bank that accepts deposits up to a limit but cannot lend",
    },
    {
      key: "Small finance bank",
      value: "A differentiated bank focused on small borrowers and priority sector lending",
    },
    { key: "Largest public sector bank in India", value: "The State Bank of India" },
    {
      key: "Development finance institution",
      value: "An institution such as NABARD or SIDBI that funds long-term development",
    },
    {
      key: "Year of the first bank nationalisation",
      value: "1969, when fourteen major banks were nationalised",
    },
  ],
  [
    { key: "Deposit limit of a payments bank", value: "Two lakh rupees per individual customer" },
    {
      key: "Priority sector target for a small finance bank",
      value: "Seventy five per cent of adjusted net bank credit",
    },
    { key: "NABARD", value: "The apex bank for agriculture and rural development, set up in 1982" },
    {
      key: "EXIM Bank",
      value: "The apex institution for financing India's foreign trade, set up in 1982",
    },
    {
      key: "Narasimham Committee",
      value: "The committee whose 1991 and 1998 reports shaped Indian banking sector reform",
    },
  ],
);

bank(
  "bank:negotiable",
  "Negotiable Instruments",
  "In the law of negotiable instruments, what is %s?",
  "%k is %v.",
  [
    { key: "Negotiable Instruments Act year", value: "1881" },
    { key: "Cheque", value: "A bill of exchange drawn on a bank and payable on demand" },
    {
      key: "Promissory note",
      value: "A written unconditional promise to pay a certain sum to a person or bearer",
    },
    {
      key: "Bill of exchange",
      value: "A written unconditional order directing a person to pay a certain sum",
    },
    { key: "Drawer of a cheque", value: "The account holder who writes and signs the cheque" },
    { key: "Drawee of a cheque", value: "The bank on which the cheque is drawn" },
    { key: "Payee", value: "The person to whom the amount is to be paid" },
    {
      key: "Crossed cheque",
      value: "A cheque with two parallel lines, payable only through a bank account",
    },
    { key: "Validity period of a cheque", value: "Three months from the date of issue" },
    {
      key: "Post-dated cheque",
      value: "A cheque bearing a future date, payable only on or after that date",
    },
  ],
  [
    {
      key: "Section 138",
      value:
        "The provision making the dishonour of a cheque for insufficiency of funds a punishable offence",
    },
    {
      key: "Account payee crossing",
      value:
        "A crossing directing that the proceeds be credited only to the account of the named payee",
    },
    {
      key: "Endorsement in blank",
      value:
        "An endorsement carrying only the signature, which makes the instrument payable to bearer",
    },
    {
      key: "Holder in due course",
      value: "A person who obtains the instrument for value, in good faith and before maturity",
    },
    { key: "Stale cheque", value: "A cheque presented after its validity period has expired" },
  ],
);

bank(
  "bank:npa-basel",
  "NPA, Capital and Basel Norms",
  "In banking regulation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Non-performing asset",
      value: "A loan on which interest or principal is overdue for more than ninety days",
    },
    {
      key: "Substandard asset",
      value: "An asset that has remained an NPA for up to twelve months",
    },
    {
      key: "Doubtful asset",
      value: "An asset that has remained substandard for more than twelve months",
    },
    {
      key: "Loss asset",
      value: "An asset identified as uncollectible by the bank or the auditors",
    },
    { key: "Provisioning", value: "Setting aside part of profit to cover expected loan losses" },
    {
      key: "CRAR",
      value: "The capital to risk weighted assets ratio, the core capital adequacy measure",
    },
    { key: "Minimum CRAR in India", value: "Nine per cent, higher than the Basel minimum" },
    { key: "Tier 1 capital", value: "Core capital, mainly paid-up equity and disclosed reserves" },
    {
      key: "Tier 2 capital",
      value: "Supplementary capital such as revaluation reserves and subordinated debt",
    },
    {
      key: "SARFAESI Act",
      value: "The 2002 law letting banks enforce security interest without court intervention",
    },
  ],
  [
    {
      key: "Basel III",
      value:
        "The post-crisis framework adding a capital conservation buffer, leverage ratio and liquidity ratios",
    },
    {
      key: "Capital conservation buffer",
      value: "An extra 2.5 per cent of common equity held above the minimum requirement",
    },
    {
      key: "Liquidity Coverage Ratio",
      value: "High quality liquid assets sufficient to survive a thirty day stress period",
    },
    {
      key: "Prompt Corrective Action",
      value: "The RBI framework restricting a weak bank's operations on breach of risk thresholds",
    },
    {
      key: "Insolvency and Bankruptcy Code",
      value: "The 2016 law giving a time-bound resolution process for stressed assets",
    },
  ],
);

bank(
  "bank:inclusion",
  "Financial Inclusion and Schemes",
  "Among financial inclusion measures, what is %s?",
  "%k is %v.",
  [
    {
      key: "Pradhan Mantri Jan Dhan Yojana",
      value: "The 2014 scheme for a basic bank account for every household",
    },
    {
      key: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
      value: "A low premium term life insurance scheme for account holders",
    },
    {
      key: "Pradhan Mantri Suraksha Bima Yojana",
      value: "A low premium accident insurance scheme for account holders",
    },
    {
      key: "Atal Pension Yojana",
      value: "A guaranteed pension scheme for workers in the unorganised sector",
    },
    {
      key: "MUDRA Yojana",
      value: "A scheme refinancing small business loans in Shishu, Kishore and Tarun categories",
    },
    {
      key: "Stand Up India",
      value: "A scheme for bank loans to scheduled caste, scheduled tribe and women entrepreneurs",
    },
    {
      key: "Basic Savings Bank Deposit Account",
      value: "A no-frills account with no minimum balance requirement",
    },
    {
      key: "Business correspondent",
      value: "An agent who delivers banking services in unbanked areas on behalf of a bank",
    },
    {
      key: "Direct Benefit Transfer",
      value: "Crediting subsidies straight into the beneficiary's bank account",
    },
    {
      key: "Kisan Credit Card",
      value: "A short-term credit facility for farmers, introduced in 1998",
    },
  ],
  [
    { key: "Shishu category of MUDRA", value: "Loans up to fifty thousand rupees" },
    {
      key: "Financial Inclusion Index",
      value: "The RBI composite index measuring access, usage and quality of financial services",
    },
    {
      key: "Lead Bank Scheme",
      value: "A scheme assigning each district to a lead bank for coordinated credit planning",
    },
    {
      key: "Self Help Group bank linkage",
      value: "The NABARD programme connecting savings groups to formal bank credit",
    },
    {
      key: "Priority sector lending target",
      value: "Forty per cent of adjusted net bank credit for domestic commercial banks",
    },
  ],
);

bank(
  "bank:digital",
  "Digital Banking and Payment Systems",
  "In digital banking, what is %s?",
  "%k is %v.",
  [
    {
      key: "NEFT",
      value: "National Electronic Funds Transfer, a round the clock batch settlement system",
    },
    {
      key: "RTGS",
      value: "Real Time Gross Settlement, used for high value transfers settled one by one",
    },
    { key: "Minimum amount for RTGS", value: "Two lakh rupees" },
    {
      key: "IMPS",
      value: "Immediate Payment Service, an instant interbank transfer available at all hours",
    },
    {
      key: "UPI",
      value: "Unified Payments Interface, which links bank accounts to a single mobile application",
    },
    {
      key: "NPCI",
      value: "The National Payments Corporation of India, the umbrella body for retail payments",
    },
    { key: "RuPay", value: "India's domestic card payment network" },
    {
      key: "AEPS",
      value:
        "Aadhaar Enabled Payment System, allowing transactions through biometric authentication",
    },
    {
      key: "IFSC",
      value: "The eleven character Indian Financial System Code identifying a bank branch",
    },
    {
      key: "MICR",
      value: "Magnetic Ink Character Recognition, the nine digit code used in cheque processing",
    },
  ],
  [
    { key: "CBDC", value: "Central Bank Digital Currency, the digital rupee issued by the RBI" },
    {
      key: "Bharat Bill Payment System",
      value: "An interoperable platform for recurring bill payments",
    },
    {
      key: "NACH",
      value: "National Automated Clearing House, used for bulk repetitive credits and debits",
    },
    {
      key: "Tokenisation",
      value: "Replacing card details with a unique token so the actual number is not stored",
    },
    {
      key: "Two factor authentication",
      value: "A security requirement combining two independent proofs of identity",
    },
  ],
);

bank(
  "bank:markets",
  "Money Market, Capital Market and SEBI",
  "In financial markets, what is %s?",
  "%k is %v.",
  [
    { key: "Money market", value: "The market for short-term funds of up to one year" },
    { key: "Capital market", value: "The market for long-term funds through equity and debt" },
    {
      key: "Treasury bill",
      value: "A short-term government instrument issued at a discount for 91, 182 or 364 days",
    },
    {
      key: "Commercial paper",
      value: "An unsecured short-term promissory note issued by a company",
    },
    {
      key: "Certificate of deposit",
      value: "A negotiable short-term deposit instrument issued by a bank",
    },
    { key: "Call money", value: "Interbank borrowing for one day" },
    {
      key: "Primary market",
      value: "The market where new securities are issued for the first time",
    },
    { key: "Secondary market", value: "The market where existing securities are traded" },
    { key: "SEBI establishment", value: "1988, given statutory status in 1992" },
    { key: "SEBI headquarters", value: "Mumbai" },
  ],
  [
    {
      key: "IPO versus FPO",
      value:
        "An IPO is a company's first public issue; an FPO is a further issue by an already listed company",
    },
    {
      key: "Mutual fund",
      value:
        "A pooled investment vehicle regulated by SEBI, managed by an asset management company",
    },
    {
      key: "Gilt-edged securities",
      value: "Government securities carrying negligible credit risk",
    },
    {
      key: "Book building",
      value: "A price discovery process in which bids are collected within a price band",
    },
    { key: "Sensex and Nifty", value: "The benchmark indices of the BSE and the NSE" },
  ],
);

bank(
  "bank:insurance",
  "Insurance and IRDAI",
  "In insurance, what is %s?",
  "%k is %v.",
  [
    {
      key: "IRDAI",
      value: "The Insurance Regulatory and Development Authority of India, set up in 1999",
    },
    { key: "IRDAI headquarters", value: "Hyderabad" },
    {
      key: "Life insurance",
      value: "A contract paying a sum on death or on maturity of the policy",
    },
    { key: "General insurance", value: "Insurance of property, health, motor and liability risks" },
    { key: "Premium", value: "The amount paid by the insured to keep the policy in force" },
    { key: "Sum assured", value: "The guaranteed amount payable under a life insurance policy" },
    { key: "Term insurance", value: "Pure risk cover paying only on death within the policy term" },
    {
      key: "Principle of indemnity",
      value: "The insured is restored to the same position, not allowed to profit from a loss",
    },
    {
      key: "Insurable interest",
      value: "A financial interest in the subject matter, without which the contract is void",
    },
    { key: "Bancassurance", value: "The sale of insurance products through bank branches" },
  ],
  [
    {
      key: "Principle of utmost good faith",
      value: "Both parties must disclose all material facts fully and truthfully",
    },
    {
      key: "Subrogation",
      value: "The insurer's right to step into the shoes of the insured after paying a claim",
    },
    { key: "Reinsurance", value: "Insurance taken by an insurer to spread its own risk" },
    {
      key: "Free look period",
      value: "The window, usually fifteen days, in which a policyholder may return a new policy",
    },
    {
      key: "Ayushman Bharat PM-JAY",
      value: "The health assurance scheme covering five lakh rupees per family a year",
    },
  ],
);

bank(
  "bank:international",
  "International Financial Institutions",
  "Among international financial bodies, what is %s?",
  "%k is %v.",
  [
    { key: "IMF headquarters", value: "Washington DC" },
    { key: "World Bank headquarters", value: "Washington DC" },
    { key: "Asian Development Bank headquarters", value: "Manila, Philippines" },
    { key: "New Development Bank headquarters", value: "Shanghai, China" },
    { key: "AIIB headquarters", value: "Beijing, China" },
    {
      key: "Bank for International Settlements",
      value: "The bank for central banks, located in Basel",
    },
    { key: "WTO headquarters", value: "Geneva, Switzerland" },
    { key: "SDR", value: "The Special Drawing Right, the reserve asset of the IMF" },
    {
      key: "IBRD",
      value:
        "The International Bank for Reconstruction and Development, the main lending arm of the World Bank",
    },
    {
      key: "IDA",
      value: "The International Development Association, the soft loan window of the World Bank",
    },
  ],
  [
    {
      key: "Composition of the SDR basket",
      value: "The US dollar, euro, Chinese renminbi, Japanese yen and pound sterling",
    },
    {
      key: "FATF",
      value:
        "The Financial Action Task Force, which sets standards against money laundering and terror financing",
    },
    {
      key: "Basel Committee",
      value: "The committee at the BIS that frames global banking supervision standards",
    },
    {
      key: "IFC",
      value:
        "The International Finance Corporation, the private sector arm of the World Bank Group",
    },
    {
      key: "MIGA",
      value:
        "The Multilateral Investment Guarantee Agency, which insures investments against political risk",
    },
  ],
);

bank(
  "bank:accounts-kyc",
  "Types of Accounts and KYC",
  "About bank accounts and KYC, what is %s?",
  "%k is %v.",
  [
    {
      key: "Savings account",
      value: "An interest bearing deposit account for individuals with limited transactions",
    },
    {
      key: "Current account",
      value: "A transaction account for businesses that earns no interest",
    },
    { key: "Fixed deposit", value: "A lump sum deposit locked for a fixed term at a fixed rate" },
    {
      key: "Recurring deposit",
      value: "A deposit built by fixed monthly instalments over a chosen term",
    },
    { key: "KYC", value: "Know Your Customer, the identity and address verification process" },
    {
      key: "Officially valid document",
      value: "A document such as Aadhaar, passport, voter card or driving licence accepted for KYC",
    },
    {
      key: "Nomination",
      value: "Naming a person to receive the balance on the death of the account holder",
    },
    { key: "Joint account", value: "An account held by two or more persons together" },
    {
      key: "Dormant account",
      value: "An account with no customer induced transaction for over two years",
    },
    {
      key: "DICGC cover",
      value: "Deposit insurance of up to five lakh rupees per depositor per bank",
    },
  ],
  [
    {
      key: "Video KYC",
      value: "Video based customer identification permitted by the RBI for remote onboarding",
    },
    {
      key: "Central KYC Registry",
      value: "A central repository so that KYC once done can be reused across institutions",
    },
    {
      key: "Money laundering",
      value: "The process of making illegally obtained money appear legitimate",
    },
    {
      key: "Suspicious Transaction Report",
      value: "A report a bank must file with FIU-IND on transactions that appear suspicious",
    },
    {
      key: "Escheatment to DEAF",
      value:
        "Transfer of unclaimed deposits over ten years old to the Depositor Education and Awareness Fund",
    },
  ],
);

/* ================================================== Computer Awareness = */

comp(
  "comp:os",
  "Operating Systems",
  "About operating systems, what is %s?",
  "%k is %v.",
  [
    {
      key: "Operating system",
      value: "System software that manages hardware and provides services to applications",
    },
    {
      key: "Kernel",
      value: "The core of the operating system that controls memory, processes and devices",
    },
    {
      key: "Booting",
      value: "The process of loading the operating system into memory when a computer starts",
    },
    { key: "Multitasking", value: "Running more than one task apparently at the same time" },
    { key: "GUI", value: "A graphical user interface using windows, icons and a pointer" },
    { key: "CLI", value: "A command line interface in which instructions are typed as text" },
    { key: "Examples of operating systems", value: "Windows, Linux, macOS, Android and iOS" },
    { key: "Open source operating system", value: "Linux, whose source code is freely available" },
    {
      key: "File system",
      value: "The method an operating system uses to store and organise files on a disk",
    },
    {
      key: "Device driver",
      value: "Software that lets the operating system communicate with a hardware device",
    },
  ],
  [
    {
      key: "Virtual memory",
      value: "Disk space used as an extension of RAM so larger programs can run",
    },
    {
      key: "Deadlock",
      value: "A state in which processes each hold a resource the other needs and none can proceed",
    },
    {
      key: "Thrashing",
      value: "Excessive page swapping that leaves the CPU doing little useful work",
    },
    {
      key: "Time sharing system",
      value: "An operating system that gives each user a slice of processor time in turn",
    },
    {
      key: "Real time operating system",
      value: "An operating system that guarantees a response within a fixed time limit",
    },
  ],
);

comp(
  "comp:office",
  "MS Office and Applications",
  "In office applications, what is %s?",
  "%k is %v.",
  [
    { key: "MS Word", value: "A word processing program used to create and edit documents" },
    {
      key: "MS Excel",
      value: "A spreadsheet program used for calculations, charts and data analysis",
    },
    { key: "MS PowerPoint", value: "A presentation program used to build slide shows" },
    { key: "MS Access", value: "A desktop database management program" },
    { key: "Cell in a spreadsheet", value: "The intersection of a row and a column" },
    { key: "Default extension of a Word file", value: "docx" },
    { key: "Default extension of an Excel file", value: "xlsx" },
    { key: "Default extension of a PowerPoint file", value: "pptx" },
    {
      key: "Formula bar",
      value: "The bar in a spreadsheet that shows and edits the contents of the active cell",
    },
    {
      key: "Mail merge",
      value: "A Word feature that combines a letter template with a list of recipients",
    },
  ],
  [
    {
      key: "VLOOKUP",
      value:
        "An Excel function that searches the first column of a range and returns a value from another column",
    },
    {
      key: "Pivot table",
      value: "An Excel tool that summarises large data sets by grouping and aggregating",
    },
    {
      key: "Absolute cell reference",
      value: "A reference fixed with dollar signs so it does not change when copied",
    },
    {
      key: "Conditional formatting",
      value: "A feature that changes a cell's appearance when it meets a stated condition",
    },
    {
      key: "Slide master",
      value: "The PowerPoint template controlling the layout and design of every slide",
    },
  ],
);

comp(
  "comp:network",
  "Networking and Internet",
  "In computer networking, what is %s?",
  "%k is %v.",
  [
    { key: "LAN", value: "A local area network covering a small area such as an office" },
    { key: "WAN", value: "A wide area network spanning cities or countries" },
    { key: "MAN", value: "A metropolitan area network covering a city" },
    { key: "Router", value: "A device that forwards data packets between different networks" },
    {
      key: "Switch",
      value: "A device that connects devices within a network and forwards frames by address",
    },
    {
      key: "Modem",
      value: "A device that converts digital signals to analogue and back for transmission",
    },
    { key: "IP address", value: "A numeric label uniquely identifying a device on a network" },
    { key: "URL", value: "The address of a resource on the web" },
    { key: "HTTP", value: "The protocol used to transfer web pages" },
    { key: "HTTPS", value: "HTTP secured with encryption" },
  ],
  [
    {
      key: "OSI model layers",
      value: "Physical, data link, network, transport, session, presentation and application",
    },
    {
      key: "TCP versus UDP",
      value:
        "TCP is connection oriented and reliable; UDP is connectionless and faster but unreliable",
    },
    {
      key: "DNS",
      value: "The Domain Name System, which translates a domain name into an IP address",
    },
    { key: "IPv6 address length", value: "128 bits, against 32 bits for IPv4" },
    {
      key: "Topology",
      value: "The physical or logical layout of a network, such as star, bus, ring or mesh",
    },
  ],
);

comp(
  "comp:dbms",
  "Database and DBMS",
  "In database management, what is %s?",
  "%k is %v.",
  [
    { key: "Database", value: "An organised collection of related data" },
    { key: "DBMS", value: "Software that stores, retrieves and manages data in a database" },
    { key: "RDBMS", value: "A database management system based on the relational model of tables" },
    { key: "Table", value: "A collection of rows and columns holding data about one entity" },
    { key: "Record", value: "A single row of a table" },
    { key: "Field", value: "A single column of a table" },
    { key: "Primary key", value: "A column whose value uniquely identifies each row" },
    { key: "Foreign key", value: "A column that refers to the primary key of another table" },
    {
      key: "SQL",
      value: "Structured Query Language, used to query and manipulate relational data",
    },
    { key: "Query", value: "A request to retrieve or change data in a database" },
  ],
  [
    {
      key: "Normalisation",
      value: "Organising tables to reduce redundancy and avoid update anomalies",
    },
    {
      key: "ACID properties",
      value: "Atomicity, consistency, isolation and durability of a transaction",
    },
    {
      key: "Candidate key",
      value: "Any column or set of columns that could serve as the primary key",
    },
    { key: "Join", value: "An operation combining rows of two tables on a related column" },
    {
      key: "Index",
      value: "A structure that speeds up searches at the cost of extra storage and slower writes",
    },
  ],
);

comp(
  "comp:security",
  "Cyber Security",
  "In cyber security, what is %s?",
  "%k is %v.",
  [
    {
      key: "Virus",
      value: "Malicious code that attaches itself to a file and spreads when the file runs",
    },
    { key: "Worm", value: "Malware that spreads across a network by itself without a host file" },
    { key: "Trojan horse", value: "Malware disguised as useful software" },
    { key: "Ransomware", value: "Malware that encrypts files and demands payment to release them" },
    { key: "Phishing", value: "Fraudulent messages that trick a user into revealing credentials" },
    { key: "Firewall", value: "A barrier that filters traffic between a network and the outside" },
    { key: "Antivirus", value: "Software that detects and removes malicious programs" },
    { key: "Encryption", value: "Converting data into a form readable only with the correct key" },
    {
      key: "Strong password practice",
      value: "A long password mixing cases, digits and symbols, not reused elsewhere",
    },
    { key: "OTP", value: "A one time password valid for a single transaction or session" },
  ],
  [
    {
      key: "Information Technology Act",
      value: "The 2000 law governing electronic records, digital signatures and cyber offences",
    },
    {
      key: "Digital signature",
      value: "A cryptographic proof of the origin and integrity of an electronic record",
    },
    {
      key: "DDoS attack",
      value: "A flood of traffic from many machines that makes a service unavailable",
    },
    {
      key: "Man in the middle attack",
      value:
        "An attacker secretly relaying and possibly altering communication between two parties",
    },
    {
      key: "CERT-In",
      value: "The Indian Computer Emergency Response Team, the national cyber incident agency",
    },
  ],
);

comp(
  "comp:number-systems",
  "Number Systems and Data Representation",
  "In computer number systems, what is %s?",
  "%k is %v.",
  [
    { key: "Binary number system", value: "A base 2 system using only the digits 0 and 1" },
    { key: "Octal number system", value: "A base 8 system using digits 0 to 7" },
    { key: "Decimal number system", value: "A base 10 system using digits 0 to 9" },
    { key: "Hexadecimal number system", value: "A base 16 system using 0 to 9 and A to F" },
    { key: "Bit", value: "A single binary digit, 0 or 1" },
    { key: "Byte", value: "A group of eight bits" },
    { key: "Nibble", value: "A group of four bits" },
    {
      key: "ASCII",
      value: "A character encoding standard using seven or eight bits per character",
    },
    { key: "Unicode", value: "A universal character encoding covering the scripts of the world" },
    { key: "Binary of decimal 10", value: "1010" },
  ],
  [
    {
      key: "Two's complement",
      value: "The standard way of representing signed integers in binary",
    },
    { key: "Hexadecimal of decimal 255", value: "FF" },
    { key: "Number of values in one byte", value: "256, that is 2 raised to 8" },
    { key: "Gray code", value: "A binary code in which successive values differ in only one bit" },
    {
      key: "BCD",
      value: "Binary Coded Decimal, in which each decimal digit is stored in four bits",
    },
  ],
);

comp(
  "comp:languages",
  "Programming Languages and Software",
  "About programming and software, what is %s?",
  "%k is %v.",
  [
    {
      key: "Machine language",
      value: "Instructions written directly in binary, understood by the processor",
    },
    {
      key: "Assembly language",
      value: "A low level language using mnemonic codes in place of binary",
    },
    { key: "High level language", value: "A human readable language such as C, Java or Python" },
    {
      key: "Compiler",
      value: "A translator that converts an entire program into machine code at once",
    },
    { key: "Interpreter", value: "A translator that converts and executes a program line by line" },
    { key: "Assembler", value: "A translator that converts assembly language into machine code" },
    {
      key: "System software",
      value: "Software that runs the computer itself, such as the operating system",
    },
    {
      key: "Application software",
      value: "Software written for a user task, such as a word processor",
    },
    { key: "Algorithm", value: "A finite, ordered set of steps for solving a problem" },
    {
      key: "Flowchart",
      value: "A diagram showing the steps of an algorithm using standard symbols",
    },
  ],
  [
    {
      key: "Object oriented programming",
      value:
        "A paradigm built on classes and objects with encapsulation, inheritance and polymorphism",
    },
    {
      key: "Difference between compiler and interpreter",
      value:
        "A compiler reports all errors after translating the whole program; an interpreter stops at the first error it meets",
    },
    { key: "Debugging", value: "The process of finding and removing errors from a program" },
    {
      key: "Firmware",
      value: "Software permanently stored in a hardware device, such as the BIOS",
    },
    {
      key: "Open source software",
      value: "Software whose source code may be freely used, studied and modified",
    },
  ],
);

comp(
  "comp:emerging",
  "Emerging Technologies",
  "Among emerging computing technologies, what is %s?",
  "%k is %v.",
  [
    {
      key: "Cloud computing",
      value: "Delivery of computing resources over the internet on demand",
    },
    {
      key: "Artificial intelligence",
      value: "Systems that carry out tasks normally needing human intelligence",
    },
    {
      key: "Machine learning",
      value: "A branch of AI in which systems learn from data rather than explicit rules",
    },
    {
      key: "Big data",
      value: "Data sets too large or fast moving for traditional tools to handle",
    },
    {
      key: "Internet of Things",
      value: "A network of everyday devices that sense and exchange data",
    },
    { key: "Blockchain", value: "A distributed tamper evident ledger of linked records" },
    {
      key: "Virtual reality",
      value: "A computer generated environment the user can experience as real",
    },
    {
      key: "Augmented reality",
      value: "Digital information layered over a view of the real world",
    },
    { key: "Data mining", value: "Discovering patterns in large data sets" },
    {
      key: "Chatbot",
      value: "A program that holds a conversation with a user in natural language",
    },
  ],
  [
    {
      key: "SaaS, PaaS and IaaS",
      value: "The three cloud service models: software, platform and infrastructure as a service",
    },
    {
      key: "Edge computing",
      value: "Processing data close to where it is generated instead of in a distant data centre",
    },
    { key: "Quantum computing", value: "Computing with qubits that can hold superposed states" },
    { key: "Digital twin", value: "A live virtual replica of a physical object or process" },
    {
      key: "Generative AI",
      value: "Models that produce new text, images or code rather than only classifying data",
    },
  ],
);

export const COMPUTER_BANKING_TEMPLATES = templates;
