/**
 * The high-yield layer: the facts that actually decide papers.
 *
 * Every other module in this bank teaches a chapter. This one does something
 * narrower — it drills the handful of items per subject that examiners come
 * back to year after year: the article numbers, the dates, the constants,
 * the ratios, the first-and-only facts. These are the questions a student
 * should be able to answer in two seconds on exam day.
 *
 * On sourcing, plainly: these are ORIGINAL questions written on the topics
 * and in the pattern that repeat across papers. They are not copied from any
 * question paper. Reproducing a board's or commission's actual paper is
 * their copyright, so what is written here is our own wording of the same
 * examinable facts. A student who knows these answers the real thing.
 *
 * Difficulty is Difficult throughout, so this layer feeds the paid series
 * and the admin pull, never the free Kit 2 Coins practice.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";
import { GK_WIDE, SSC_RRB, CIVIL_DEFENCE, PUNJAB_STATE } from "./two-layer";

/**
 * Its own tag, so this layer can be sold and unlocked on its own. The wider
 * tags are kept alongside it so these questions still surface in the exam
 * series a student has already paid for.
 */
const HY = "High-Yield";

const templates: Template[] = [];

const polity = chapterFactory(templates, "Polity", [HY, ...GK_WIDE]);
const modern = chapterFactory(templates, "Modern History", [HY, ...GK_WIDE]);
const geo = chapterFactory(templates, "Indian Geography", [HY, ...GK_WIDE]);
const eco = chapterFactory(templates, "Indian Economy", [HY, ...GK_WIDE]);
const sci = chapterFactory(templates, "General Science", [HY, ...SSC_RRB, ...CIVIL_DEFENCE]);
const pb = chapterFactory(templates, "Punjab GK", [HY, ...PUNJAB_STATE]);

polity(
  "hy:polity",
  "Most Repeated: Constitution Articles and Amendments",
  "Which article or provision is %s?",
  "%k — %v.",
  [
    { key: "Equality before law", value: "Article 14" },
    { key: "Abolition of untouchability", value: "Article 17" },
    { key: "Right to freedom of speech and expression", value: "Article 19(1)(a)" },
    { key: "Protection of life and personal liberty", value: "Article 21" },
    { key: "Right to education for ages six to fourteen", value: "Article 21A" },
    { key: "Right to constitutional remedies", value: "Article 32" },
    { key: "Directive Principles of State Policy", value: "Part IV, Articles 36 to 51" },
    { key: "Fundamental Duties", value: "Article 51A, added by the 42nd Amendment" },
    { key: "President's rule in a state", value: "Article 356" },
    { key: "Financial emergency", value: "Article 360" },
    { key: "Amendment procedure of the Constitution", value: "Article 368" },
    { key: "Official language of the Union", value: "Article 343, Hindi in Devanagari script" },
  ],
  [
    {
      key: "Amendment that added the words socialist, secular and integrity to the Preamble",
      value: "The 42nd Amendment of 1976, called the mini-Constitution",
    },
    {
      key: "Amendment that lowered the voting age from twenty one to eighteen",
      value: "The 61st Amendment of 1988",
    },
    {
      key: "Amendments that gave constitutional status to panchayats and municipalities",
      value: "The 73rd and 74th Amendments of 1992",
    },
    {
      key: "Amendment that made education a fundamental right",
      value: "The 86th Amendment of 2002, which inserted Article 21A",
    },
    {
      key: "Amendment that introduced the Goods and Services Tax",
      value: "The 101st Amendment of 2016",
    },
    {
      key: "Case that laid down the basic structure doctrine",
      value: "Kesavananda Bharati versus State of Kerala, 1973",
    },
  ],
);

modern(
  "hy:modern",
  "Most Repeated: Freedom Movement Dates and Sessions",
  "In the freedom movement, what is %s?",
  "%k — %v.",
  [
    {
      key: "Year the Indian National Congress was founded",
      value: "1885, at Bombay under W. C. Bonnerjee",
    },
    { key: "Year of the Partition of Bengal", value: "1905, by Lord Curzon" },
    {
      key: "Session at which Congress and the Muslim League signed a pact",
      value: "The Lucknow session of 1916",
    },
    { key: "Year of the Jallianwala Bagh massacre", value: "13 April 1919, at Amritsar" },
    { key: "Year the Non-Cooperation Movement was launched", value: "1920" },
    {
      key: "Event that led Gandhi to withdraw Non-Cooperation",
      value: "Chauri Chaura, February 1922",
    },
    {
      key: "Session that adopted Purna Swaraj as the goal",
      value: "Lahore, December 1929, under Jawaharlal Nehru",
    },
    { key: "Date the Dandi March began", value: "12 March 1930" },
    { key: "Year of the Quit India Movement", value: "1942, with the call Do or Die" },
    { key: "Year of the Cabinet Mission", value: "1946" },
  ],
  [
    {
      key: "Difference between the Simon Commission boycott and the Round Table Conferences",
      value:
        "The Simon Commission was boycotted in 1927 because it had no Indian member, while the three Round Table Conferences of 1930 to 1932 did include Indians, and Gandhi attended only the second",
    },
    {
      key: "Significance of the Poona Pact",
      value:
        "Signed in 1932 between Gandhi and Ambedkar, it replaced separate electorates for the Depressed Classes with reserved seats in a joint electorate",
    },
    {
      key: "Reason 1919 matters twice in the freedom movement",
      value:
        "It brought both the Rowlatt Act and the Jallianwala Bagh massacre, and the Montagu-Chelmsford reforms with dyarchy in the provinces",
    },
    {
      key: "Order of Gandhi's three great movements",
      value: "Non-Cooperation 1920, Civil Disobedience 1930, Quit India 1942",
    },
    {
      key: "Act that introduced provincial autonomy in British India",
      value:
        "The Government of India Act 1935, though its proposed federation never came into force",
    },
  ],
);

geo(
  "hy:geography",
  "Most Repeated: Indian Geography Constants",
  "In Indian geography, what is %s?",
  "%k — %v.",
  [
    { key: "Longest river of India", value: "The Ganga, about 2,525 km" },
    { key: "Largest state of India by area", value: "Rajasthan" },
    { key: "Smallest state of India by area", value: "Goa" },
    { key: "Highest peak located entirely within India", value: "Nanda Devi" },
    { key: "Standard meridian of India", value: "82 degrees 30 minutes east" },
    { key: "Number of states India shares with the Tropic of Cancer", value: "Eight" },
    { key: "Longest land border India shares", value: "With Bangladesh" },
    { key: "Southernmost point of the Indian mainland", value: "Kanyakumari, Cape Comorin" },
    { key: "Largest freshwater lake of India", value: "Wular Lake in Jammu and Kashmir" },
    { key: "State with the longest coastline", value: "Gujarat" },
  ],
  [
    {
      key: "Reason the south-west monsoon splits into two branches",
      value:
        "The Western Ghats and the peninsular shape divide it into the Arabian Sea branch and the Bay of Bengal branch, which is why Cherrapunji is drenched while Rajasthan stays dry",
    },
    {
      key: "Difference between the Western and Eastern Ghats",
      value:
        "The Western Ghats are continuous, higher and older with passes, the Eastern Ghats are broken by the deltas of the Mahanadi, Godavari, Krishna and Kaveri",
    },
    {
      key: "Reason Tamil Nadu gets rain in winter",
      value:
        "The retreating north-east monsoon picks up moisture over the Bay of Bengal and strikes the Coromandel coast",
    },
    {
      key: "Reason the Deccan Plateau lies in the rain shadow of the Western Ghats",
      value:
        "The south-west monsoon loses moisture on the windward slope before descending over the plateau",
    },
    {
      key: "Two major west-flowing rift-valley rivers of India",
      value: "The Narmada and Tapti, which flow west towards the Arabian Sea",
    },
  ],
);

eco(
  "hy:economy",
  "Most Repeated: Economy Terms and Institutions",
  "In the Indian economy, what is %s?",
  "%k — %v.",
  [
    {
      key: "Repo rate",
      value: "The rate at which the RBI lends to commercial banks against securities",
    },
    { key: "Reverse repo rate", value: "The rate at which the RBI borrows from commercial banks" },
    { key: "Cash Reserve Ratio", value: "The share of deposits a bank keeps with the RBI in cash" },
    {
      key: "Statutory Liquidity Ratio",
      value: "The share of deposits a bank keeps in liquid assets with itself",
    },
    { key: "Body that decides the repo rate", value: "The Monetary Policy Committee of the RBI" },
    { key: "Year the RBI was established", value: "1935, nationalised in 1949" },
    { key: "Year of economic liberalisation in India", value: "1991" },
    { key: "Body that replaced the Planning Commission", value: "NITI Aayog, in 2015" },
    { key: "Full form of GST", value: "Goods and Services Tax, introduced on 1 July 2017" },
    {
      key: "Organisation that publishes the Human Development Index",
      value: "The United Nations Development Programme",
    },
  ],
  [
    {
      key: "Difference between fiscal deficit and revenue deficit",
      value:
        "Fiscal deficit is total expenditure less total receipts excluding borrowing, revenue deficit is only the shortfall on the revenue account, so a fiscal deficit can exist with no revenue deficit at all",
    },
    {
      key: "Difference between GDP and GNP",
      value:
        "GDP counts output produced inside the country whoever produces it, GNP counts output produced by nationals wherever they are, so GNP is GDP plus net factor income from abroad",
    },
    {
      key: "Effect of the RBI raising the repo rate",
      value:
        "Borrowing becomes dearer, credit contracts and demand cools, which is the standard response to inflation",
    },
    {
      key: "Primary deficit",
      value: "The fiscal deficit after subtracting interest payments on past borrowings",
    },
    {
      key: "Open market operation by the RBI",
      value: "Purchase or sale of government securities to manage banking-system liquidity",
    },
  ],
);

sci(
  "hy:science",
  "Most Repeated: Science Facts and Units",
  "In general science, what is %s?",
  "%k — %v.",
  [
    { key: "SI unit of force", value: "The newton" },
    { key: "SI unit of pressure", value: "The pascal" },
    { key: "SI unit of electrical resistance", value: "The ohm" },
    { key: "Unit of power", value: "The watt, one joule per second" },
    { key: "Vitamin whose deficiency causes scurvy", value: "Vitamin C, ascorbic acid" },
    { key: "Vitamin whose deficiency causes rickets", value: "Vitamin D" },
    { key: "Major anthropogenic greenhouse gas by human emissions", value: "Carbon dioxide" },
    { key: "Chemical name of common salt", value: "Sodium chloride" },
    {
      key: "Number of chromosomes in a human somatic cell",
      value: "Forty six, in twenty three pairs",
    },
    { key: "Largest gland in the human body", value: "The liver" },
    { key: "Universal donor blood group for red-cell transfusion", value: "O negative" },
    { key: "pH of pure water at 25 degrees Celsius", value: "Seven, neutral" },
  ],
  [
    {
      key: "Reason a body weighs less at the equator than at the poles",
      value:
        "The earth bulges at the equator so the distance from the centre is greater, and the rotation supplies a centrifugal effect, both of which reduce the effective value of g",
    },
    {
      key: "Difference between hard and soft water in one line",
      value:
        "Hard water carries dissolved calcium and magnesium salts that stop soap lathering, soft water does not",
    },
    {
      key: "Reason the sky is blue",
      value: "Rayleigh scattering — shorter blue wavelengths scatter far more than longer red ones",
    },
    {
      key: "Why carbon dioxide is used in fire extinguishers",
      value:
        "It does not support combustion and forms a blanket that displaces oxygen around the fire",
    },
    {
      key: "Main role of haemoglobin in human blood",
      value: "Transporting oxygen from the lungs to body tissues",
    },
  ],
);

pb(
  "hy:punjab",
  "Most Repeated: Punjab Facts for State Papers",
  "About Punjab, what is %s?",
  "%k — %v.",
  [
    { key: "Capital of Punjab", value: "Chandigarh, shared with Haryana as a union territory" },
    { key: "Number of districts in Punjab", value: "Twenty three" },
    {
      key: "Five rivers that give Punjab its name",
      value: "Sutlej, Beas, Ravi, Chenab and Jhelum",
    },
    {
      key: "Rivers of the Punjab that flow in India today",
      value: "The Sutlej, the Beas and the Ravi",
    },
    { key: "State animal of Punjab", value: "The blackbuck" },
    { key: "State bird of Punjab", value: "The northern goshawk, baaz" },
    { key: "Official language of Punjab", value: "Punjabi, in Gurmukhi script" },
    {
      key: "Year Punjab was reorganised on a linguistic basis",
      value: "1966, when Haryana and Himachal areas were separated",
    },
    { key: "Founder of the Sikh faith", value: "Guru Nanak Dev Ji, born in 1469" },
    {
      key: "Guru who founded the Khalsa",
      value: "Guru Gobind Singh Ji, in 1699 at Anandpur Sahib",
    },
    { key: "Guru who compiled the Adi Granth", value: "Guru Arjan Dev Ji, in 1604" },
    { key: "Ruler known as the Lion of Punjab", value: "Maharaja Ranjit Singh" },
  ],
  [
    {
      key: "Significance of 1849 in Punjab history",
      value:
        "The Second Anglo-Sikh War ended and Punjab was annexed by the British, ending the Sikh empire",
    },
    {
      key: "Reason the Green Revolution began in Punjab",
      value:
        "Assured canal irrigation, consolidated holdings and receptive farmers let high-yielding wheat varieties, fertiliser and tubewells be adopted quickly",
    },
    {
      key: "Difference between the Anandpur Sahib Resolution and the Punjabi Suba movement",
      value:
        "The Punjabi Suba movement of the 1950s and 60s demanded a Punjabi-speaking state and succeeded in 1966, the Anandpur Sahib Resolution of 1973 went further and sought greater state autonomy",
    },
    {
      key: "The two rivers between which the Doaba region lies",
      value: "The Beas and Sutlej, as Doaba means the land between two rivers",
    },
    {
      key: "The two rivers between which the Majha region lies",
      value: "The Ravi and Beas in the traditional regional division of Punjab",
    },
  ],
);

export const HIGH_YIELD_TEMPLATES = templates;
