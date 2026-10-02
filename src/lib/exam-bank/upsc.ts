/**
 * UPSC CSE / State PSC high-yield fact tables.
 *
 * These are the static, repeat-every-year areas of the General Studies paper:
 * Constitution articles and schedules, amendments, modern history, geography,
 * economy and environment. Content is written in-house from standard public
 * syllabus material — no question is copied from any published paper.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

const UPSC = ["UPSC CSE", "UPSC/SSC/Bank", "SSC", "State PSC", "PPSC Punjab", "Railway", "CUET"];
const POLITY_EXAMS = [
  ...UPSC,
  "Punjab Police",
  "State Police",
  "Punjab Clerk",
  "Punjab Patwari",
  "Punjab Master Cadre",
  "Punjab Lecturer Cadre",
  "CLAT/Law",
  "NDA/CDS",
];

const templates: Template[] = [];

function add(
  id: string,
  subject: string,
  topic: string,
  difficulty: "Easy" | "Moderate" | "Difficult",
  exams: string[],
  rows: FactRow[],
  forward: string,
  reverse: string | undefined,
  explain: string,
  matchLabel?: string,
) {
  templates.push(
    ...factTemplate({ id, subject, topic, difficulty, exams, rows, forward, reverse, explain }),
    matchTemplate({ id, subject, topic, difficulty, exams, rows, label: matchLabel }),
    statementTemplate({ id, subject, topic, difficulty, exams, rows, label: matchLabel }),
    statementCountTemplate({ id, subject, topic, difficulty, exams, rows, label: matchLabel }),
  );
}

/* ------------------------------------------------------ constitution: articles */

add(
  "upsc:article",
  "Polity",
  "Constitution Basics",
  "Moderate",
  POLITY_EXAMS,
  [
    { key: "Article 14", value: "Equality before law" },
    {
      key: "Article 15",
      value:
        "Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth",
    },
    { key: "Article 16", value: "Equality of opportunity in public employment" },
    { key: "Article 17", value: "Abolition of untouchability" },
    { key: "Article 18", value: "Abolition of titles" },
    { key: "Article 19", value: "Protection of six freedoms including speech and expression" },
    { key: "Article 20", value: "Protection in respect of conviction for offences" },
    { key: "Article 21", value: "Protection of life and personal liberty" },
    {
      key: "Article 21A",
      value: "Right to free and compulsory education for children aged 6 to 14",
    },
    { key: "Article 22", value: "Protection against arrest and detention in certain cases" },
    { key: "Article 23", value: "Prohibition of traffic in human beings and forced labour" },
    { key: "Article 24", value: "Prohibition of employment of children in factories" },
    { key: "Article 25", value: "Freedom of conscience and free profession of religion" },
    { key: "Article 29", value: "Protection of interests of minorities" },
    { key: "Article 30", value: "Right of minorities to establish educational institutions" },
    { key: "Article 32", value: "Right to constitutional remedies" },
    { key: "Article 40", value: "Organisation of village panchayats" },
    { key: "Article 44", value: "Uniform civil code for the citizens" },
    { key: "Article 50", value: "Separation of judiciary from the executive" },
    { key: "Article 51A", value: "Fundamental duties of citizens" },
  ],
  "Which provision of the Indian Constitution is contained in %s?",
  "Which Article of the Indian Constitution deals with '%s'?",
  "%k of the Constitution provides for %v.",
  "Article and subject",
);

add(
  "upsc:article2",
  "Polity",
  "Constitution Basics",
  "Difficult",
  POLITY_EXAMS,
  [
    { key: "Article 72", value: "Pardoning power of the President" },
    { key: "Article 76", value: "Attorney General of India" },
    { key: "Article 108", value: "Joint sitting of both Houses of Parliament" },
    { key: "Article 110", value: "Definition of a Money Bill" },
    { key: "Article 112", value: "Annual Financial Statement (Union Budget)" },
    { key: "Article 123", value: "Ordinance making power of the President" },
    { key: "Article 143", value: "Advisory jurisdiction of the Supreme Court" },
    { key: "Article 148", value: "Comptroller and Auditor General of India" },
    { key: "Article 161", value: "Pardoning power of the Governor" },
    { key: "Article 165", value: "Advocate General of the State" },
    { key: "Article 213", value: "Ordinance making power of the Governor" },
    { key: "Article 226", value: "Power of High Courts to issue writs" },
    { key: "Article 243", value: "Panchayati Raj institutions" },
    { key: "Article 262", value: "Adjudication of inter-State water disputes" },
    { key: "Article 263", value: "Inter-State Council" },
    { key: "Article 280", value: "Finance Commission" },
    { key: "Article 315", value: "Public Service Commissions for Union and States" },
    { key: "Article 324", value: "Election Commission of India" },
    { key: "Article 352", value: "Proclamation of National Emergency" },
    { key: "Article 356", value: "President's Rule in a State" },
    { key: "Article 360", value: "Financial Emergency" },
    { key: "Article 368", value: "Power of Parliament to amend the Constitution" },
  ],
  "Which provision of the Indian Constitution is contained in %s?",
  "Which Article of the Indian Constitution deals with '%s'?",
  "%k of the Constitution provides for %v.",
  "Article and subject",
);

add(
  "upsc:schedule",
  "Polity",
  "Constitution Basics",
  "Moderate",
  POLITY_EXAMS,
  [
    { key: "First Schedule", value: "States and Union Territories of India" },
    { key: "Second Schedule", value: "Emoluments of the President, Governors and Judges" },
    { key: "Third Schedule", value: "Forms of oaths and affirmations" },
    { key: "Fourth Schedule", value: "Allocation of seats in the Rajya Sabha" },
    { key: "Fifth Schedule", value: "Administration of Scheduled Areas and Scheduled Tribes" },
    { key: "Sixth Schedule", value: "Tribal areas of Assam, Meghalaya, Tripura and Mizoram" },
    { key: "Seventh Schedule", value: "Union, State and Concurrent Lists" },
    { key: "Eighth Schedule", value: "Twenty-two official languages of India" },
    { key: "Ninth Schedule", value: "Laws protected from judicial review, mainly land reform" },
    { key: "Tenth Schedule", value: "Anti-defection provisions" },
    { key: "Eleventh Schedule", value: "Twenty-nine subjects of the Panchayats" },
    { key: "Twelfth Schedule", value: "Eighteen subjects of the Municipalities" },
  ],
  "Which subject is dealt with in the %s of the Indian Constitution?",
  "Which Schedule of the Indian Constitution contains '%s'?",
  "The %k of the Constitution deals with %v.",
  "Schedule and subject",
);

add(
  "upsc:amendment",
  "Polity",
  "Constitution Basics",
  "Difficult",
  POLITY_EXAMS,
  [
    { key: "1st Amendment (1951)", value: "Added the Ninth Schedule to protect land reform laws" },
    { key: "7th Amendment (1956)", value: "Reorganised states on a linguistic basis" },
    {
      key: "42nd Amendment (1976)",
      value: "Added the words Socialist, Secular and Integrity to the Preamble",
    },
    {
      key: "44th Amendment (1978)",
      value: "Removed the Right to Property from Fundamental Rights",
    },
    { key: "52nd Amendment (1985)", value: "Introduced the anti-defection law" },
    { key: "61st Amendment (1989)", value: "Reduced the voting age from 21 to 18 years" },
    {
      key: "73rd Amendment (1992)",
      value: "Gave constitutional status to Panchayati Raj institutions",
    },
    { key: "74th Amendment (1992)", value: "Gave constitutional status to urban local bodies" },
    {
      key: "86th Amendment (2002)",
      value: "Made elementary education a Fundamental Right under Article 21A",
    },
    { key: "97th Amendment (2011)", value: "Gave constitutional status to co-operative societies" },
    { key: "101st Amendment (2016)", value: "Introduced the Goods and Services Tax" },
    {
      key: "102nd Amendment (2018)",
      value: "Gave constitutional status to the National Commission for Backward Classes",
    },
    {
      key: "103rd Amendment (2019)",
      value: "Provided 10 per cent reservation for Economically Weaker Sections",
    },
  ],
  "What was the main effect of the %s to the Indian Constitution?",
  "Which Constitutional Amendment '%s'?",
  "The %k %v.",
  "Amendment and effect",
);

add(
  "upsc:borrow",
  "Polity",
  "Constitution Basics",
  "Moderate",
  POLITY_EXAMS,
  [
    { key: "Parliamentary form of government", value: "Britain" },
    { key: "Rule of law and writs", value: "Britain" },
    { key: "Fundamental Rights and judicial review", value: "United States of America" },
    { key: "Impeachment of the President", value: "United States of America" },
    { key: "Directive Principles of State Policy", value: "Ireland" },
    { key: "Federation with a strong Centre", value: "Canada" },
    { key: "Concurrent List", value: "Australia" },
    { key: "Emergency provisions", value: "Germany (Weimar Constitution)" },
    { key: "Procedure established by law", value: "Japan" },
    { key: "Fundamental Duties", value: "erstwhile USSR" },
    { key: "Liberty, Equality and Fraternity in the Preamble", value: "France" },
    { key: "Amendment procedure of the Constitution", value: "South Africa" },
  ],
  "From which country's constitution has India borrowed the feature of '%s'?",
  undefined,
  "India borrowed %k from the constitution of %v.",
  "constitutional feature and source country",
);

add(
  "upsc:fr",
  "Polity",
  "Fundamental Rights",
  "Moderate",
  POLITY_EXAMS,
  [
    { key: "Habeas Corpus", value: "To produce the body of a detained person before the court" },
    { key: "Mandamus", value: "To command a public authority to perform its legal duty" },
    { key: "Prohibition", value: "To stop a lower court from exceeding its jurisdiction" },
    { key: "Certiorari", value: "To quash the order of a lower court or tribunal" },
    { key: "Quo Warranto", value: "To question the authority of a person holding a public office" },
    { key: "Right to Equality", value: "Articles 14 to 18" },
    { key: "Right to Freedom", value: "Articles 19 to 22" },
    { key: "Right against Exploitation", value: "Articles 23 and 24" },
    { key: "Right to Freedom of Religion", value: "Articles 25 to 28" },
    { key: "Cultural and Educational Rights", value: "Articles 29 and 30" },
    { key: "Right to Constitutional Remedies", value: "Article 32" },
  ],
  "What is the meaning or scope of '%s' under the Indian Constitution?",
  "Which term of the Indian Constitution refers to '%s'?",
  "%k refers to %v.",
  "writ or right and its scope",
);

add(
  "upsc:parliament",
  "Polity",
  "Parliament",
  "Moderate",
  POLITY_EXAMS,
  [
    { key: "Maximum strength of the Lok Sabha", value: "552 members" },
    { key: "Maximum strength of the Rajya Sabha", value: "250 members" },
    { key: "Normal term of the Lok Sabha", value: "Five years" },
    { key: "Term of a Rajya Sabha member", value: "Six years" },
    { key: "Minimum age to contest a Lok Sabha seat", value: "25 years" },
    { key: "Minimum age to become a Rajya Sabha member", value: "30 years" },
    { key: "Quorum for a sitting of either House", value: "One-tenth of the total membership" },
    { key: "Presiding officer of the Rajya Sabha", value: "Vice-President of India" },
    { key: "Maximum gap allowed between two sessions", value: "Six months" },
    { key: "Money Bill can be introduced only in", value: "Lok Sabha" },
    { key: "Maximum time the Rajya Sabha can withhold a Money Bill", value: "Fourteen days" },
    {
      key: "Presiding officer at a joint sitting of Parliament",
      value: "Speaker of the Lok Sabha",
    },
    { key: "Body that certifies a Bill as a Money Bill", value: "Speaker of the Lok Sabha" },
    { key: "First hour of every parliamentary sitting", value: "Question Hour" },
  ],
  "In the Indian Parliament, what is the %s?",
  "Which parliamentary provision is described by '%s'?",
  "%k is %v.",
  "parliamentary provision and its value",
);

add(
  "upsc:president",
  "Polity",
  "President and Governor",
  "Moderate",
  POLITY_EXAMS,
  [
    { key: "Minimum age to become President of India", value: "35 years" },
    { key: "Term of office of the President", value: "Five years" },
    {
      key: "Authority to whom the President submits resignation",
      value: "Vice-President of India",
    },
    {
      key: "Body that elects the President",
      value: "An electoral college of elected MPs and MLAs",
    },
    {
      key: "Procedure to remove the President",
      value: "Impeachment for violation of the Constitution",
    },
    { key: "Authority who appoints the Governor of a State", value: "President of India" },
    { key: "Minimum age to become a Governor", value: "35 years" },
    {
      key: "Normal term of a Governor",
      value: "Five years, holding office during the pleasure of the President",
    },
    { key: "Authority who administers oath to the President", value: "Chief Justice of India" },
    {
      key: "Maximum life of an ordinance issued by the President",
      value: "Six weeks after Parliament reassembles",
    },
  ],
  "Regarding the Indian executive, what is the %s?",
  undefined,
  "%k is %v.",
  "office and its provision",
);

add(
  "upsc:judiciary",
  "Polity",
  "Judiciary",
  "Difficult",
  POLITY_EXAMS,
  [
    { key: "Retirement age of a Supreme Court judge", value: "65 years" },
    { key: "Retirement age of a High Court judge", value: "62 years" },
    { key: "Authority who appoints the Chief Justice of India", value: "President of India" },
    { key: "Court described as the guardian of the Constitution", value: "Supreme Court of India" },
    {
      key: "Case that established the basic structure doctrine",
      value: "Kesavananda Bharati case, 1973",
    },
    { key: "Case that expanded the meaning of Article 21", value: "Maneka Gandhi case, 1978" },
    { key: "Minimum practice as an advocate to become a High Court judge", value: "Ten years" },
    { key: "Court of record at the state level", value: "High Court" },
    {
      key: "Body that hears inter-state water disputes",
      value: "A tribunal constituted under Article 262",
    },
  ],
  "In the Indian judicial system, what is the %s?",
  undefined,
  "%k is %v.",
  "judicial provision and its value",
);

add(
  "upsc:panchayat",
  "Polity",
  "Panchayati Raj",
  "Moderate",
  [...POLITY_EXAMS, "Punjab Patwari", "Punjab Clerk"],
  [
    {
      key: "Amendment that gave constitutional status to Panchayats",
      value: "73rd Constitutional Amendment, 1992",
    },
    { key: "Schedule listing the subjects of the Panchayats", value: "Eleventh Schedule" },
    { key: "Number of subjects in the Eleventh Schedule", value: "Twenty-nine" },
    { key: "Term of a Panchayat", value: "Five years" },
    { key: "Minimum age to contest a Panchayat election", value: "21 years" },
    { key: "Tier of Panchayati Raj at the village level", value: "Gram Panchayat" },
    { key: "Tier of Panchayati Raj at the block level", value: "Panchayat Samiti" },
    { key: "Tier of Panchayati Raj at the district level", value: "Zila Parishad" },
    {
      key: "Committee that recommended three-tier Panchayati Raj",
      value: "Balwant Rai Mehta Committee, 1957",
    },
    {
      key: "Committee that recommended two-tier Panchayati Raj",
      value: "Ashok Mehta Committee, 1977",
    },
    { key: "Assembly of all registered voters of a village", value: "Gram Sabha" },
  ],
  "In the Panchayati Raj system, what is the %s?",
  "Which feature of Panchayati Raj is described by '%s'?",
  "%k is %v.",
  "Panchayati Raj term and its meaning",
);

/* ------------------------------------------------------------ modern history */

add(
  "upsc:freedom",
  "General Awareness",
  "Indian History",
  "Moderate",
  UPSC,
  [
    { key: "Indian National Congress", value: "Founded in 1885 by A. O. Hume" },
    { key: "Partition of Bengal", value: "Announced in 1905 by Lord Curzon" },
    { key: "Muslim League", value: "Founded in 1906 at Dhaka" },
    { key: "Jallianwala Bagh massacre", value: "Took place at Amritsar in 1919" },
    { key: "Non-Cooperation Movement", value: "Launched by Mahatma Gandhi in 1920" },
    {
      key: "Chauri Chaura incident",
      value: "Occurred in 1922, leading to withdrawal of Non-Cooperation",
    },
    { key: "Simon Commission", value: "Came to India in 1928 and was boycotted" },
    { key: "Dandi March", value: "Began in 1930 and started the Civil Disobedience Movement" },
    { key: "Poona Pact", value: "Signed in 1932 between Gandhi and Ambedkar" },
    { key: "Quit India Movement", value: "Launched in 1942 with the slogan Do or Die" },
    { key: "Cabinet Mission", value: "Came to India in 1946" },
    { key: "Indian Independence Act", value: "Passed by the British Parliament in 1947" },
  ],
  "Which statement correctly describes the %s?",
  "Which event of the freedom struggle is described by '%s'?",
  "%k: %v.",
  "event and its description",
);

add(
  "upsc:slogan",
  "General Awareness",
  "Indian History",
  "Easy",
  UPSC,
  [
    { key: "Do or Die", value: "Mahatma Gandhi" },
    { key: "Give me blood and I will give you freedom", value: "Subhas Chandra Bose" },
    { key: "Inquilab Zindabad", value: "Bhagat Singh" },
    { key: "Swaraj is my birthright and I shall have it", value: "Bal Gangadhar Tilak" },
    { key: "Jai Jawan Jai Kisan", value: "Lal Bahadur Shastri" },
    { key: "Jai Hind", value: "Subhas Chandra Bose" },
    { key: "Sare Jahan Se Achha", value: "Muhammad Iqbal" },
    { key: "Vande Mataram", value: "Bankim Chandra Chattopadhyay" },
    { key: "Satyameva Jayate", value: "Taken from the Mundaka Upanishad" },
    { key: "Aram Haram Hai", value: "Jawaharlal Nehru" },
  ],
  "Who is associated with the slogan '%s'?",
  "Which slogan is associated with %s?",
  "The slogan %k is associated with %v.",
  "slogan and the person associated with it",
);

add(
  "upsc:viceroy",
  "General Awareness",
  "Indian History",
  "Difficult",
  UPSC,
  [
    { key: "Lord Ripon", value: "Local self-government and repeal of the Vernacular Press Act" },
    { key: "Lord Curzon", value: "Partition of Bengal in 1905" },
    { key: "Lord Minto II", value: "Separate electorates through the Morley-Minto Reforms" },
    { key: "Lord Chelmsford", value: "Montagu-Chelmsford Reforms and the Rowlatt Act" },
    { key: "Lord Irwin", value: "Gandhi-Irwin Pact and the Dandi March period" },
    { key: "Lord Wavell", value: "Simla Conference and the Wavell Plan" },
    { key: "Lord Mountbatten", value: "Partition of India and transfer of power in 1947" },
    { key: "Lord William Bentinck", value: "Abolition of Sati in 1829" },
    { key: "Lord Dalhousie", value: "Doctrine of Lapse and the first railway line" },
    { key: "Lord Canning", value: "Revolt of 1857 and transfer of power to the Crown" },
  ],
  "Which major development is associated with %s?",
  "During whose tenure did '%s' take place?",
  "%k is associated with %v.",
  "Governor-General or Viceroy and the event",
);

/* ------------------------------------------------------------ geography */

add(
  "upsc:geo-pass",
  "General Awareness",
  "Indian Geography",
  "Difficult",
  UPSC,
  [
    { key: "Rohtang Pass", value: "Himachal Pradesh" },
    { key: "Zoji La", value: "Ladakh and Kashmir Valley" },
    { key: "Nathu La", value: "Sikkim" },
    { key: "Bomdi La", value: "Arunachal Pradesh" },
    { key: "Banihal Pass", value: "Jammu and Kashmir" },
    { key: "Shipki La", value: "Himachal Pradesh" },
    { key: "Palghat Gap", value: "Kerala and Tamil Nadu" },
    { key: "Thal Ghat", value: "Maharashtra" },
    { key: "Bhor Ghat", value: "Maharashtra" },
    { key: "Khardung La", value: "Ladakh" },
  ],
  "In which region or state is %s located?",
  "Which mountain pass is located in %s?",
  "%k is located in %v.",
  "mountain pass and its location",
);

add(
  "upsc:geo-river",
  "General Awareness",
  "Indian Geography",
  "Moderate",
  UPSC,
  [
    { key: "Ganga", value: "Gangotri Glacier in Uttarakhand" },
    { key: "Yamuna", value: "Yamunotri Glacier in Uttarakhand" },
    { key: "Narmada", value: "Amarkantak Plateau in Madhya Pradesh" },
    { key: "Tapi", value: "Multai in Madhya Pradesh" },
    { key: "Godavari", value: "Trimbakeshwar in Maharashtra" },
    { key: "Krishna", value: "Mahabaleshwar in Maharashtra" },
    { key: "Kaveri", value: "Talakaveri in Karnataka" },
    { key: "Mahanadi", value: "Sihawa in Chhattisgarh" },
    { key: "Sutlej", value: "Rakas Lake near Mansarovar in Tibet" },
    { key: "Beas", value: "Beas Kund near Rohtang Pass" },
    { key: "Ravi", value: "Bara Bhangal in Himachal Pradesh" },
    { key: "Chenab", value: "Confluence of Chandra and Bhaga at Tandi" },
    { key: "Jhelum", value: "Verinag in Jammu and Kashmir" },
    { key: "Brahmaputra", value: "Angsi Glacier in Tibet" },
  ],
  "Where does the river %s originate?",
  "Which Indian river originates from %s?",
  "The %k rises at %v.",
  "river and its place of origin",
);

add(
  "upsc:geo-park",
  "General Awareness",
  "Indian Geography",
  "Moderate",
  UPSC,
  [
    { key: "Jim Corbett National Park", value: "Uttarakhand" },
    { key: "Kaziranga National Park", value: "Assam" },
    { key: "Gir National Park", value: "Gujarat" },
    { key: "Ranthambore National Park", value: "Rajasthan" },
    { key: "Sundarbans National Park", value: "West Bengal" },
    { key: "Periyar Wildlife Sanctuary", value: "Kerala" },
    { key: "Bandipur National Park", value: "Karnataka" },
    { key: "Kanha National Park", value: "Madhya Pradesh" },
    { key: "Simlipal National Park", value: "Odisha" },
    { key: "Keoladeo National Park", value: "Rajasthan" },
    { key: "Manas National Park", value: "Assam" },
    { key: "Dachigam National Park", value: "Jammu and Kashmir" },
  ],
  "In which state is %s located?",
  "Which national park or sanctuary is located in %s?",
  "%k is located in %v.",
  "national park and its state",
);

/* ------------------------------------------------------------ economy */

add(
  "upsc:economy",
  "General Awareness",
  "Static GK",
  "Moderate",
  UPSC,
  [
    { key: "Repo rate", value: "Rate at which the RBI lends short-term funds to commercial banks" },
    { key: "Reverse repo rate", value: "Rate at which the RBI absorbs liquidity from banks" },
    { key: "Cash Reserve Ratio", value: "Share of deposits banks must keep as cash with the RBI" },
    {
      key: "Statutory Liquidity Ratio",
      value: "Share of deposits banks must keep in liquid assets",
    },
    {
      key: "Fiscal deficit",
      value: "Excess of total expenditure over total receipts excluding borrowings",
    },
    { key: "Revenue deficit", value: "Excess of revenue expenditure over revenue receipts" },
    {
      key: "Gross Domestic Product",
      value: "Value of goods and services produced within a country's borders",
    },
    { key: "Gross National Product", value: "GDP plus net factor income from abroad" },
    { key: "Inflation", value: "A sustained rise in the general price level" },
    { key: "Disinvestment", value: "Sale of government stake in a public sector undertaking" },
    { key: "Direct tax", value: "A tax whose burden cannot be shifted to another person" },
    { key: "Indirect tax", value: "A tax whose burden can be shifted to the final consumer" },
  ],
  "In Indian economy, what does '%s' mean?",
  "Which economic term is defined as '%s'?",
  "%k means %v.",
  "economic term and its definition",
);

add(
  "upsc:scheme",
  "General Awareness",
  "Government Schemes",
  "Easy",
  UPSC,
  [
    {
      key: "Pradhan Mantri Jan Dhan Yojana",
      value: "Financial inclusion through zero-balance bank accounts",
    },
    { key: "Pradhan Mantri Ujjwala Yojana", value: "LPG connections to women of poor households" },
    { key: "Swachh Bharat Mission", value: "Sanitation and elimination of open defecation" },
    { key: "Beti Bachao Beti Padhao", value: "Improving the child sex ratio and girls' education" },
    { key: "Ayushman Bharat", value: "Health insurance cover for poor families" },
    { key: "Pradhan Mantri Awas Yojana", value: "Affordable housing for all" },
    { key: "MGNREGA", value: "Guaranteed wage employment in rural areas" },
    { key: "Pradhan Mantri Fasal Bima Yojana", value: "Crop insurance for farmers" },
    { key: "Atal Pension Yojana", value: "Pension cover for workers in the unorganised sector" },
    { key: "Stand Up India", value: "Bank loans for SC, ST and women entrepreneurs" },
    { key: "Skill India Mission", value: "Vocational skill training for youth" },
    { key: "Digital India", value: "Delivery of government services in digital form" },
  ],
  "What is the main objective of the %s?",
  "Which government scheme aims at '%s'?",
  "%k aims at %v.",
  "scheme and its objective",
);

add(
  "upsc:environment",
  "General Awareness",
  "Science and Technology",
  "Moderate",
  UPSC,
  [
    { key: "Montreal Protocol", value: "Protection of the ozone layer" },
    { key: "Kyoto Protocol", value: "Reduction of greenhouse gas emissions" },
    { key: "Paris Agreement", value: "Limiting the rise in global average temperature" },
    { key: "Ramsar Convention", value: "Conservation of wetlands" },
    { key: "CITES", value: "Regulation of trade in endangered species" },
    { key: "Basel Convention", value: "Control of transboundary movement of hazardous waste" },
    {
      key: "Convention on Biological Diversity",
      value: "Conservation and sustainable use of biodiversity",
    },
    { key: "Stockholm Convention", value: "Elimination of persistent organic pollutants" },
    { key: "UNFCCC", value: "Framework for international action on climate change" },
    { key: "Project Tiger", value: "Conservation of the tiger in India" },
  ],
  "What is the main purpose of the %s?",
  "Which international agreement or project deals with '%s'?",
  "The %k deals with %v.",
  "convention and its purpose",
);

add(
  "upsc:dpsp",
  "Polity",
  "Directive Principles",
  "Difficult",
  POLITY_EXAMS,
  [
    { key: "Part of the Constitution containing the Directive Principles", value: "Part IV" },
    { key: "Range of Articles covering the Directive Principles", value: "Articles 36 to 51" },
    { key: "Country from which the Directive Principles were borrowed", value: "Ireland" },
    { key: "Article directing a uniform civil code", value: "Article 44" },
    { key: "Article directing the organisation of village panchayats", value: "Article 40" },
    { key: "Article directing separation of judiciary from executive", value: "Article 50" },
    { key: "Article directing promotion of international peace", value: "Article 51" },
    { key: "Article directing the state to secure a living wage", value: "Article 43" },
    {
      key: "Nature of the Directive Principles",
      value: "Non-justiciable, they cannot be enforced by a court",
    },
    {
      key: "Nature of the Fundamental Rights",
      value: "Justiciable, they can be enforced by a court",
    },
  ],
  "Regarding the Directive Principles of State Policy, what is the %s?",
  "Which provision on Directive Principles matches '%s'?",
  "%k is %v.",
  "Directive Principle and its provision",
);

add(
  "upsc:local",
  "Polity",
  "Local Government",
  "Moderate",
  POLITY_EXAMS,
  [
    { key: "Amendment on urban local bodies", value: "74th Constitutional Amendment, 1992" },
    { key: "Schedule listing municipal subjects", value: "Twelfth Schedule" },
    { key: "Number of subjects in the Twelfth Schedule", value: "Eighteen" },
    { key: "Urban body for a very large city", value: "Municipal Corporation" },
    { key: "Urban body for a smaller town", value: "Nagar Panchayat" },
    { key: "Term of an urban local body", value: "Five years" },
    { key: "Body that conducts local body elections", value: "State Election Commission" },
    { key: "Body that reviews the finances of local bodies", value: "State Finance Commission" },
    { key: "Head of a Municipal Corporation", value: "Mayor" },
    { key: "Executive head of a Municipal Corporation", value: "Municipal Commissioner" },
  ],
  "Regarding urban local government, what is the %s?",
  "Which provision of local government matches '%s'?",
  "%k is %v.",
  "local government term and its provision",
);

export const UPSC_TEMPLATES = templates;
