/**
 * Second batch of fact tables — widens General Awareness, Computer Awareness,
 * Business Law and English vocabulary so no section stays thin.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

const GA = [
  "Banking",
  "SSC",
  "Railway",
  "UPSC/SSC/Bank",
  "Punjab Police",
  "State Police",
  "CUET",
  "UPSC CSE",
  "State PSC",
  "PPSC Punjab",
  "Punjab Patwari",
  "Punjab Clerk",
  "State Clerk",
  "Punjab ETT Cadre",
  "Punjab Master Cadre",
  "PSTET/CTET",
  "State Teacher/TET",
  "NDA/CDS",
  "Punjab PCS",
  "PSSSB",
  "Punjab Lecturer Cadre",
  "PSEB Class 9-10",
  "SSC CGL",
  "SSC CHSL",
  "SSC MTS",
  "SSC GD Constable",
  "RRB NTPC",
  "RRB Group D",
  "RRB ALP",
  "CAPF",
];
const CA_EXAMS = ["CA Foundation", "CA Intermediate"];
const ENG = ["Banking", "SSC", "Railway", "UPSC/SSC/Bank", "CUET", "CBSE MCQ"];

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
  exams: string[] = GA,
) {
  templates.push(
    ...factTemplate({ id, subject, topic, difficulty, exams, rows, forward, reverse, explain }),
    matchTemplate({ id, subject, topic, difficulty, exams, rows }),
    statementTemplate({ id, subject, topic, difficulty, exams, rows }),
    statementCountTemplate({ id, subject, topic, difficulty, exams, rows }),
  );
}

/* ================================================== GENERAL AWARENESS ++ */

add(
  "gk2:superlative",
  "General Awareness",
  "Indian Geography",
  "Moderate",
  [
    { key: "Largest state of India by area", value: "Rajasthan" },
    { key: "Smallest state of India by area", value: "Goa" },
    { key: "Most populous state of India", value: "Uttar Pradesh" },
    { key: "Longest river of India", value: "Ganga" },
    { key: "Largest freshwater lake in India", value: "Wular Lake" },
    { key: "Largest saltwater lake in India", value: "Chilika Lake" },
    { key: "Highest mountain peak in India", value: "Kangchenjunga" },
    { key: "Highest waterfall in India", value: "Kunchikal Falls" },
    { key: "Largest desert in India", value: "Thar Desert" },
    { key: "Longest coastline among Indian states", value: "Gujarat" },
    { key: "Southernmost point of mainland India", value: "Kanyakumari" },
    { key: "Largest delta in the world", value: "Sundarbans delta" },
    { key: "State with the largest forest cover in India", value: "Madhya Pradesh" },
    { key: "Highest dam in India", value: "Tehri Dam" },
    { key: "Largest port in India", value: "Mumbai Port" },
    { key: "Longest railway platform in India", value: "Hubballi Junction" },
  ],
  "What is the %s?",
  undefined,
  "The %k is %v.",
);

add(
  "gk2:world-superlative",
  "General Awareness",
  "World Geography",
  "Moderate",
  [
    { key: "Largest country in the world by area", value: "Russia" },
    { key: "Smallest country in the world", value: "Vatican City" },
    { key: "Largest ocean in the world", value: "Pacific Ocean" },
    { key: "Smallest ocean in the world", value: "Arctic Ocean" },
    { key: "Longest river in the world", value: "Nile" },
    { key: "Largest river by water volume", value: "Amazon" },
    { key: "Highest mountain peak in the world", value: "Mount Everest" },
    { key: "Largest desert in the world", value: "Sahara Desert" },
    { key: "Largest continent in the world", value: "Asia" },
    { key: "Smallest continent in the world", value: "Australia" },
    { key: "Deepest point in the ocean", value: "Mariana Trench" },
    { key: "Largest island in the world", value: "Greenland" },
    { key: "Highest waterfall in the world", value: "Angel Falls" },
    { key: "Largest lake in the world", value: "Caspian Sea" },
    { key: "Coldest place on Earth", value: "Antarctica" },
  ],
  "What is the %s?",
  undefined,
  "The %k is %v.",
);

add(
  "gk2:national-symbol",
  "General Awareness",
  "Static GK",
  "Easy",
  [
    { key: "National animal of India", value: "Bengal Tiger" },
    { key: "National bird of India", value: "Indian Peacock" },
    { key: "National flower of India", value: "Lotus" },
    { key: "National tree of India", value: "Banyan" },
    { key: "National fruit of India", value: "Mango" },
    { key: "National river of India", value: "Ganga" },
    { key: "National aquatic animal of India", value: "River Dolphin" },
    { key: "National heritage animal of India", value: "Indian Elephant" },
    { key: "National game associated with India historically", value: "Hockey" },
    { key: "National anthem of India", value: "Jana Gana Mana" },
    { key: "National song of India", value: "Vande Mataram" },
    { key: "National emblem of India", value: "Lion Capital of Ashoka at Sarnath" },
    { key: "National calendar of India", value: "Saka calendar" },
    { key: "National currency symbol of India", value: "Rupee symbol adopted in 2010" },
  ],
  "What is the %s?",
  undefined,
  "The %k is the %v.",
);

add(
  "gk2:inventions",
  "General Awareness",
  "Science and Technology",
  "Moderate",
  [
    { key: "Telephone", value: "Alexander Graham Bell" },
    { key: "Electric bulb", value: "Thomas Alva Edison" },
    { key: "Radio", value: "Guglielmo Marconi" },
    { key: "Television", value: "John Logie Baird" },
    { key: "Aeroplane", value: "Wright Brothers" },
    { key: "Printing press", value: "Johannes Gutenberg" },
    { key: "Steam engine", value: "James Watt" },
    { key: "Dynamite", value: "Alfred Nobel" },
    { key: "Penicillin", value: "Alexander Fleming" },
    { key: "Polio vaccine", value: "Jonas Salk" },
    { key: "Theory of relativity", value: "Albert Einstein" },
    { key: "Law of gravitation", value: "Isaac Newton" },
    { key: "Periodic table of elements", value: "Dmitri Mendeleev" },
    { key: "Theory of evolution by natural selection", value: "Charles Darwin" },
    { key: "X-rays", value: "Wilhelm Roentgen" },
    { key: "Raman effect", value: "C. V. Raman" },
    { key: "World Wide Web", value: "Tim Berners-Lee" },
  ],
  "Who invented or discovered the %s?",
  undefined,
  "The %k is credited to %v.",
);

add(
  "gk2:parliament",
  "General Awareness",
  "Indian Polity",
  "Moderate",
  [
    { key: "Maximum strength of the Lok Sabha", value: "552 members" },
    { key: "Maximum strength of the Rajya Sabha", value: "250 members" },
    { key: "Normal term of the Lok Sabha", value: "5 years" },
    { key: "Term of a Rajya Sabha member", value: "6 years" },
    { key: "Minimum age to become a member of the Lok Sabha", value: "25 years" },
    { key: "Minimum age to become a member of the Rajya Sabha", value: "30 years" },
    { key: "Minimum age to become the President of India", value: "35 years" },
    { key: "Term of the President of India", value: "5 years" },
    { key: "Presiding officer of the Rajya Sabha", value: "Vice President of India" },
    { key: "House that cannot be dissolved", value: "Rajya Sabha" },
    { key: "House where a Money Bill can be introduced", value: "Lok Sabha only" },
    {
      key: "Quorum required for a sitting of either House",
      value: "One tenth of the total membership",
    },
    { key: "Body that conducts elections in India", value: "Election Commission of India" },
    {
      key: "Chairman of the Planning Commission's successor NITI Aayog",
      value: "Prime Minister of India",
    },
    { key: "Authority that appoints the Chief Justice of India", value: "President of India" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

add(
  "gk2:schemes",
  "General Awareness",
  "Government Schemes",
  "Moderate",
  [
    {
      key: "Pradhan Mantri Jan Dhan Yojana",
      value: "Universal access to banking and financial inclusion",
    },
    { key: "Swachh Bharat Abhiyan", value: "Nationwide cleanliness and sanitation drive" },
    { key: "Beti Bachao Beti Padhao", value: "Improving the child sex ratio and girls' education" },
    { key: "Ayushman Bharat", value: "Health insurance cover for poor families" },
    { key: "Make in India", value: "Boosting domestic manufacturing and investment" },
    { key: "Digital India", value: "Transforming India into a digitally empowered society" },
    { key: "Skill India Mission", value: "Training youth in employable skills" },
    { key: "Atal Pension Yojana", value: "Guaranteed pension for the unorganised sector" },
    {
      key: "Pradhan Mantri Ujjwala Yojana",
      value: "Free LPG connections to women of BPL households",
    },
    { key: "MGNREGA", value: "Guaranteed 100 days of wage employment in rural areas" },
    { key: "Pradhan Mantri Awas Yojana", value: "Affordable housing for all" },
    { key: "Kisan Credit Card scheme", value: "Timely and adequate credit to farmers" },
    { key: "Stand Up India", value: "Bank loans for SC, ST and women entrepreneurs" },
    {
      key: "Mid Day Meal Scheme",
      value: "Free lunch to school children to improve nutrition and attendance",
    },
  ],
  "What is the main objective of the %s?",
  "Which government scheme aims at: %s?",
  "The %k aims at %v.",
);

add(
  "gk2:punjab",
  "General Awareness",
  "Punjab GK",
  "Moderate",
  [
    { key: "Capital of Punjab", value: "Chandigarh" },
    { key: "Official language of Punjab", value: "Punjabi" },
    { key: "Script used for Punjabi", value: "Gurmukhi" },
    { key: "State animal of Punjab", value: "Blackbuck" },
    { key: "State bird of Punjab", value: "Northern Goshawk (Baaz)" },
    { key: "State tree of Punjab", value: "Shisham" },
    { key: "Number of districts in Punjab", value: "23" },
    { key: "Largest city of Punjab by population", value: "Ludhiana" },
    { key: "City known as the Manchester of India", value: "Ludhiana" },
    { key: "Holiest shrine of Sikhism", value: "Golden Temple, Amritsar" },
    { key: "Founder of Sikhism", value: "Guru Nanak Dev Ji" },
    { key: "Tenth Sikh Guru", value: "Guru Gobind Singh Ji" },
    { key: "Compiler of the Guru Granth Sahib", value: "Guru Arjan Dev Ji" },
    { key: "Site of the 1919 massacre in Amritsar", value: "Jallianwala Bagh" },
    {
      key: "Five rivers that give Punjab its name",
      value: "Sutlej, Beas, Ravi, Chenab and Jhelum",
    },
    { key: "Main food crop of Punjab", value: "Wheat" },
    { key: "Harvest festival of Punjab", value: "Baisakhi" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ================================================= COMPUTER AWARENESS ++ */

add(
  "comp2:generations",
  "Computer Awareness",
  "Computer Generations",
  "Moderate",
  [
    { key: "First generation computers", value: "Vacuum tubes" },
    { key: "Second generation computers", value: "Transistors" },
    { key: "Third generation computers", value: "Integrated circuits" },
    { key: "Fourth generation computers", value: "Microprocessors" },
    { key: "Fifth generation computers", value: "Artificial intelligence and parallel processing" },
  ],
  "Which technology characterises %s?",
  undefined,
  "%k used %v.",
);

add(
  "comp2:extensions",
  "Computer Awareness",
  "File Formats",
  "Easy",
  [
    { key: ".docx", value: "Microsoft Word document" },
    { key: ".xlsx", value: "Microsoft Excel spreadsheet" },
    { key: ".pptx", value: "Microsoft PowerPoint presentation" },
    { key: ".pdf", value: "Portable Document Format file" },
    { key: ".jpg", value: "Compressed image file" },
    { key: ".mp3", value: "Compressed audio file" },
    { key: ".mp4", value: "Video file" },
    { key: ".exe", value: "Executable program file in Windows" },
    { key: ".html", value: "Web page file" },
    { key: ".zip", value: "Compressed archive file" },
    { key: ".txt", value: "Plain text file" },
    { key: ".csv", value: "Comma separated values data file" },
  ],
  "What kind of file has the extension %s?",
  "Which file extension is used for a %s?",
  "The extension %k denotes a %v.",
);

add(
  "comp2:memory",
  "Computer Awareness",
  "Memory Units",
  "Easy",
  [
    { key: "1 Byte", value: "8 bits" },
    { key: "1 Kilobyte", value: "1024 bytes" },
    { key: "1 Megabyte", value: "1024 kilobytes" },
    { key: "1 Gigabyte", value: "1024 megabytes" },
    { key: "1 Terabyte", value: "1024 gigabytes" },
    { key: "1 Petabyte", value: "1024 terabytes" },
    { key: "1 Nibble", value: "4 bits" },
  ],
  "How much is %s?",
  undefined,
  "In the standard exam convention for memory units, %k is treated as %v.",
);

add(
  "comp2:devices",
  "Computer Awareness",
  "Input and Output Devices",
  "Easy",
  [
    { key: "Keyboard", value: "Input device" },
    { key: "Mouse", value: "Input device" },
    { key: "Scanner", value: "Input device" },
    { key: "Microphone", value: "Input device" },
    { key: "Joystick", value: "Input device" },
    { key: "Monitor", value: "Output device" },
    { key: "Printer", value: "Output device" },
    { key: "Speaker", value: "Output device" },
    { key: "Plotter", value: "Output device" },
    { key: "Touch screen", value: "Both input and output device" },
    { key: "Modem", value: "Both input and output device" },
    { key: "USB flash drive", value: "external storage device" },
  ],
  "A %s is classified as which type of device?",
  undefined,
  "A %k is an %v.",
);

/* ==================================================== BUSINESS LAW ++ */

add(
  "law2:companies",
  "Business Law",
  "Companies Act 2013",
  "Difficult",
  [
    { key: "Minimum number of members in a private company", value: "2" },
    { key: "Maximum number of members in a private company", value: "200" },
    { key: "Minimum number of members in a public company", value: "7" },
    { key: "Minimum number of directors in a private company", value: "2" },
    { key: "Minimum number of directors in a public company", value: "3" },
    {
      key: "Maximum number of directors in a company",
      value: "15, which can be increased by special resolution",
    },
    { key: "Minimum number of members in a One Person Company", value: "1" },
    {
      key: "Document containing the constitution of a company",
      value: "Memorandum of Association",
    },
    {
      key: "Document containing the internal rules of a company",
      value: "Articles of Association",
    },
    { key: "Document inviting the public to subscribe to shares", value: "Prospectus" },
    {
      key: "Certificate that brings a company into existence",
      value: "Certificate of Incorporation",
    },
    {
      key: "Authority that regulates companies in India",
      value: "Registrar of Companies under the Ministry of Corporate Affairs",
    },
  ],
  "Under the Companies Act 2013, identify: %s?",
  undefined,
  "%k: %v.",
  CA_EXAMS,
);

add(
  "law2:partnership",
  "Business Law",
  "Partnership Act 1932",
  "Moderate",
  [
    { key: "Minimum number of partners in a partnership firm", value: "2" },
    { key: "Maximum number of partners in a partnership firm", value: "50" },
    { key: "Act governing partnership in India", value: "Indian Partnership Act 1932" },
    {
      key: "Partner who shares profits but does not take part in management",
      value: "Sleeping or dormant partner",
    },
    { key: "Partner who lends only his name to the firm", value: "Nominal partner" },
    { key: "Partner who shares profits but not losses", value: "Partner in profits only" },
    { key: "Document containing the terms of partnership", value: "Partnership deed" },
    { key: "Profit sharing ratio when the deed is silent", value: "Equal among all partners" },
    { key: "Interest on partner's loan when the deed is silent", value: "6 percent per annum" },
    {
      key: "Liability of partners in a general partnership",
      value: "Unlimited, joint and several",
    },
  ],
  "Under partnership law, identify: %s?",
  undefined,
  "%k: %v.",
  CA_EXAMS,
);

add(
  "law2:negotiable",
  "Business Law",
  "Negotiable Instruments Act 1881",
  "Difficult",
  [
    { key: "An unconditional order in writing directing a bank to pay", value: "Cheque" },
    { key: "An unconditional promise in writing to pay a certain sum", value: "Promissory note" },
    {
      key: "An unconditional order directing a person to pay a certain sum",
      value: "Bill of exchange",
    },
    { key: "Person who draws a cheque", value: "Drawer" },
    { key: "Bank on which a cheque is drawn", value: "Drawee" },
    { key: "Person in whose favour a cheque is drawn", value: "Payee" },
    { key: "Cheque that can be encashed across the counter", value: "Open or bearer cheque" },
    { key: "Cheque with two parallel transverse lines", value: "Crossed cheque" },
    { key: "Validity period of a cheque in India", value: "Three months from the date of issue" },
    {
      key: "Offence of dishonour of cheque for insufficiency of funds",
      value: "Section 138 of the Negotiable Instruments Act",
    },
  ],
  "Under the Negotiable Instruments Act, identify: %s?",
  undefined,
  "%k: %v.",
  CA_EXAMS,
);

/* ======================================================= ENGLISH ++ */

add(
  "eng2:synonym",
  "English Language",
  "Synonyms",
  "Moderate",
  [
    { key: "Alleviate", value: "Relieve or lessen" },
    { key: "Arduous", value: "Difficult and tiring" },
    { key: "Belligerent", value: "Aggressive" },
    { key: "Cryptic", value: "Mysterious" },
    { key: "Despondent", value: "Dejected" },
    { key: "Enigma", value: "A puzzle or mystery" },
    { key: "Futile", value: "Useless" },
    { key: "Garrulous", value: "Talkative" },
    { key: "Hapless", value: "Unfortunate" },
    { key: "Impeccable", value: "Flawless" },
    { key: "Laconic", value: "Using very few words" },
    { key: "Mitigate", value: "Make less severe" },
    { key: "Nonchalant", value: "Casually unconcerned" },
    { key: "Ostentatious", value: "Showy" },
    { key: "Placate", value: "Pacify" },
    { key: "Redundant", value: "Superfluous" },
    { key: "Scrutinise", value: "Examine closely" },
    { key: "Tedious", value: "Boringly long" },
    { key: "Ubiquitous", value: "Present everywhere" },
    { key: "Vindicate", value: "Clear of blame" },
  ],
  "Choose the word that is most nearly the SAME in meaning as '%s'.",
  undefined,
  "'%k' means '%v'; the two words have similar meanings in this context.",
  ENG,
);

add(
  "eng2:one-word",
  "English Language",
  "One Word Substitution",
  "Difficult",
  [
    { key: "A person who does not believe in God", value: "Atheist" },
    { key: "A person who believes in God", value: "Theist" },
    { key: "One who is new to a trade or profession", value: "Novice" },
    { key: "One who walks on foot", value: "Pedestrian" },
    { key: "One who can speak many languages", value: "Polyglot" },
    { key: "A medicine that kills germs", value: "Antiseptic" },
    { key: "A doctor who treats the teeth", value: "Dentist" },
    { key: "A doctor who treats the eyes", value: "Ophthalmologist" },
    { key: "A person who repairs machines", value: "Mechanic" },
    { key: "A place where soldiers live", value: "Barracks" },
    { key: "A place where orphans live", value: "Orphanage" },
    { key: "A place where dead bodies are kept", value: "Mortuary" },
    { key: "Words written on a tomb", value: "Epitaph" },
    { key: "Study of ancient things", value: "Archaeology" },
    { key: "Study of birds", value: "Ornithology" },
    { key: "Study of insects", value: "Entomology" },
    { key: "Study of earthquakes", value: "Seismology" },
    { key: "Study of the human mind", value: "Psychology" },
  ],
  "Give the one word substitution for: %s.",
  undefined,
  "%k is called %v.",
  ENG,
);

add(
  "eng2:idiom",
  "English Language",
  "Idioms and Phrases",
  "Moderate",
  [
    { key: "To pull someone's leg", value: "To tease or joke with someone" },
    { key: "To break the ice", value: "To start a conversation in an awkward situation" },
    { key: "To face the music", value: "To accept the unpleasant consequences" },
    { key: "To get cold feet", value: "To become nervous before an event" },
    { key: "To spill the beans", value: "To disclose a secret" },
    { key: "To be under the weather", value: "To feel unwell" },
    { key: "To go the extra mile", value: "To make a special effort" },
    { key: "To sit on the fence", value: "To remain neutral" },
    { key: "To have a green thumb", value: "To be skilled at gardening" },
    { key: "To throw in the towel", value: "To give up" },
    { key: "To steal someone's thunder", value: "To take credit for another's work" },
    { key: "To play second fiddle", value: "To take a less important role" },
    { key: "To be at loggerheads", value: "To be in strong disagreement" },
    { key: "To cut corners", value: "To do something cheaply or hastily" },
    { key: "To leave no stone unturned", value: "To try every possible way" },
  ],
  "What does the idiom '%s' mean?",
  "Which idiom means '%s'?",
  "'%k' means %v.",
  ENG,
);

export const EXTRA_FACT_TEMPLATES = templates;
