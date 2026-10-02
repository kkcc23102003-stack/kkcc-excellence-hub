/**
 * PSEB / NCERT Class 9 and 10 fact tables.
 *
 * PSEB follows the NCERT syllabus for Science, Mathematics and Social Science,
 * so these tables serve PSEB Class 9-10 students as well as CBSE, ICSE and the
 * board-based questions that appear in Punjab ETT, Master and Lecturer cadre
 * papers. Written in-house from standard public syllabus material.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

const BOARD = [
  "PSEB Class 9-10",
  "CBSE Class 9-10",
  "CBSE MCQ",
  "State Board MCQ",
  "ICSE Class 9-10",
  "Punjab ETT Cadre",
  "Punjab Master Cadre",
  "PSTET/CTET",
  "State Teacher/TET",
];

/** Class-specific board tags, so a Class 9 student never sees Class 10 work. */
const CLASS_9 = ["CBSE Class 9", "ICSE Class 9"];
const CLASS_10 = ["CBSE Class 10", "ICSE Class 10"];

/**
 * Chapter ids carry their class (`pseb9:` or `pseb10:`), so the class tags can
 * be attached automatically rather than repeated on every call.
 */
function classTags(id: string): string[] {
  if (id.startsWith("pseb9:")) return CLASS_9;
  if (id.startsWith("pseb10:")) return CLASS_10;
  // Shared social-science and language chapters are taught in both years.
  return [...CLASS_9, ...CLASS_10];
}
const BOARD_GK = [...BOARD, "SSC", "Railway", "Punjab Police", "PSSSB", "Punjab Clerk"];

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
  matchLabel?: string,
  baseExams: string[] = BOARD,
) {
  const exams = [...baseExams, ...classTags(id)];
  templates.push(
    ...factTemplate({ id, subject, topic, difficulty, exams, rows, forward, reverse, explain }),
    matchTemplate({ id, subject, topic, difficulty, exams, rows, label: matchLabel }),
    statementTemplate({ id, subject, topic, difficulty, exams, rows, label: matchLabel }),
    statementCountTemplate({ id, subject, topic, difficulty, exams, rows, label: matchLabel }),
  );
}

/* ====================================================== Science Class 9 */

add(
  "pseb9:matter",
  "Science Class 9",
  "Matter in Our Surroundings",
  "Easy",
  [
    { key: "Change of solid directly into gas", value: "Sublimation" },
    { key: "Change of liquid into vapour at any temperature", value: "Evaporation" },
    { key: "Change of gas into liquid", value: "Condensation" },
    { key: "Temperature at which a solid melts", value: "Melting point" },
    { key: "Temperature at which a liquid boils", value: "Boiling point" },
    { key: "Heat required to change 1 kg of solid into liquid", value: "Latent heat of fusion" },
    {
      key: "Heat required to change 1 kg of liquid into gas",
      value: "Latent heat of vaporisation",
    },
    { key: "State of matter with fixed shape and volume", value: "Solid" },
    { key: "State of matter with highest compressibility", value: "Gas" },
    { key: "Fourth state of matter in fluorescent tubes", value: "Plasma" },
  ],
  "What is the term for '%s'?",
  "What does '%s' mean?",
  "%k is called %v.",
  "term and its meaning",
);

add(
  "pseb9:pure",
  "Science Class 9",
  "Is Matter Around Us Pure",
  "Moderate",
  [
    { key: "Separating cream from milk", value: "Centrifugation" },
    { key: "Separating salt from sea water", value: "Evaporation" },
    {
      key: "Separating two miscible liquids with close boiling points",
      value: "Fractional distillation",
    },
    { key: "Separating dyes in black ink", value: "Chromatography" },
    { key: "Separating oil and water", value: "Using a separating funnel" },
    { key: "Separating camphor from salt", value: "Sublimation" },
    { key: "Tyndall effect is shown by", value: "Colloids" },
    { key: "Particle size is largest in", value: "Suspension" },
    { key: "A homogeneous mixture", value: "Solution" },
    { key: "Solution of a metal in another metal", value: "Alloy" },
  ],
  "Which method or answer fits '%s'?",
  "'%s' is used for which purpose?",
  "%k — %v.",
  "process and its method",
);

add(
  "pseb9:atom",
  "Science Class 9",
  "Structure of the Atom",
  "Moderate",
  [
    { key: "Discovered the electron", value: "J. J. Thomson" },
    { key: "Discovered the proton", value: "E. Goldstein" },
    { key: "Discovered the neutron", value: "James Chadwick" },
    { key: "Proposed the nuclear model of the atom", value: "Ernest Rutherford" },
    { key: "Proposed that electrons revolve in fixed shells", value: "Niels Bohr" },
    { key: "Charge on an electron", value: "Negative" },
    { key: "Charge on a neutron", value: "No charge" },
    { key: "Maximum electrons in the K shell", value: "Two" },
    { key: "Maximum electrons in the L shell", value: "Eight" },
    { key: "Atoms of the same element with different mass numbers", value: "Isotopes" },
    { key: "Atoms of different elements with the same mass number", value: "Isobars" },
  ],
  "In atomic structure, what is the answer for '%s'?",
  "Which term matches '%s'?",
  "%k: %v.",
  "atomic fact and its answer",
);

add(
  "pseb9:cell",
  "Science Class 9",
  "The Fundamental Unit of Life",
  "Moderate",
  [
    { key: "Powerhouse of the cell", value: "Mitochondria" },
    { key: "Kitchen of the cell", value: "Chloroplast" },
    { key: "Suicidal bags of the cell", value: "Lysosomes" },
    { key: "Control centre of the cell", value: "Nucleus" },
    { key: "Packaging and dispatch of materials", value: "Golgi apparatus" },
    { key: "Site of protein synthesis", value: "Ribosomes" },
    { key: "Discovered the cell", value: "Robert Hooke" },
    { key: "Movement of water through a semi-permeable membrane", value: "Osmosis" },
    { key: "Cells without a true nucleus", value: "Prokaryotic cells" },
    { key: "Rigid outer covering of a plant cell", value: "Cell wall" },
  ],
  "Which cell part or term matches '%s'?",
  "What is '%s' known as?",
  "%k is %v.",
  "cell structure and its role",
);

add(
  "pseb9:motion",
  "Science Class 9",
  "Force and Laws of Motion",
  "Moderate",
  [
    {
      key: "Newton's first law of motion",
      value: "A body stays at rest or in uniform motion unless a force acts",
    },
    { key: "Newton's second law of motion", value: "Force equals rate of change of momentum" },
    {
      key: "Newton's third law of motion",
      value: "Every action has an equal and opposite reaction",
    },
    { key: "Another name for Newton's first law", value: "Law of inertia" },
    { key: "Product of mass and velocity", value: "Momentum" },
    { key: "SI unit of force", value: "Newton" },
    { key: "SI unit of momentum", value: "Kilogram metre per second" },
    { key: "Quantity that measures inertia", value: "Mass" },
    { key: "Principle behind the recoil of a gun", value: "Conservation of momentum" },
  ],
  "What does '%s' state or mean?",
  "Which law or quantity is described by '%s'?",
  "%k: %v.",
  "law and its statement",
);

add(
  "pseb9:sound",
  "Science Class 9",
  "Sound",
  "Moderate",
  [
    { key: "Speed of sound in air at room temperature", value: "About 344 metres per second" },
    { key: "Sound cannot travel through", value: "Vacuum" },
    { key: "Number of vibrations per second", value: "Frequency" },
    { key: "SI unit of frequency", value: "Hertz" },
    { key: "Range of audible frequency for humans", value: "20 Hz to 20,000 Hz" },
    { key: "Sound above 20,000 Hz", value: "Ultrasound" },
    { key: "Sound below 20 Hz", value: "Infrasound" },
    { key: "Repetition of sound by reflection", value: "Echo" },
    { key: "Technique using ultrasound to find sea depth", value: "SONAR" },
    { key: "Loudness of sound depends on", value: "Amplitude" },
    { key: "Pitch of sound depends on", value: "Frequency" },
  ],
  "In the chapter Sound, what is the answer for '%s'?",
  "Which term matches '%s'?",
  "%k: %v.",
  "sound fact and its answer",
);

/* ===================================================== Science Class 10 */

add(
  "pseb10:reaction",
  "Science Class 10",
  "Chemical Reactions and Equations",
  "Moderate",
  [
    { key: "Reaction in which two substances combine to form one", value: "Combination reaction" },
    {
      key: "Reaction in which one substance splits into two or more",
      value: "Decomposition reaction",
    },
    {
      key: "Reaction in which a more reactive element replaces a less reactive one",
      value: "Displacement reaction",
    },
    { key: "Reaction in which two compounds exchange ions", value: "Double displacement reaction" },
    { key: "Reaction that releases heat", value: "Exothermic reaction" },
    { key: "Reaction that absorbs heat", value: "Endothermic reaction" },
    { key: "Gain of oxygen or loss of hydrogen", value: "Oxidation" },
    { key: "Loss of oxygen or gain of hydrogen", value: "Reduction" },
    { key: "Slow damage of iron in moist air", value: "Corrosion" },
    { key: "Oxidation of fats and oils causing bad smell", value: "Rancidity" },
  ],
  "What is the term for '%s'?",
  "What does '%s' mean?",
  "%k is called %v.",
  "reaction type and its definition",
);

add(
  "pseb10:acid",
  "Science Class 10",
  "Acids, Bases and Salts",
  "Moderate",
  [
    { key: "pH value of a neutral solution", value: "Seven" },
    { key: "pH range of an acidic solution", value: "Less than seven" },
    { key: "pH range of a basic solution", value: "More than seven" },
    { key: "Common name of sodium hydrogen carbonate", value: "Baking soda" },
    { key: "Common name of sodium carbonate decahydrate", value: "Washing soda" },
    { key: "Common name of calcium sulphate hemihydrate", value: "Plaster of Paris" },
    { key: "Common name of calcium oxychloride", value: "Bleaching powder" },
    { key: "Acid present in the stomach", value: "Hydrochloric acid" },
    { key: "Acid present in lemon", value: "Citric acid" },
    { key: "Acid present in curd", value: "Lactic acid" },
    { key: "Acid present in ant sting", value: "Formic acid" },
  ],
  "What is the answer for '%s'?",
  "Which item matches '%s'?",
  "%k is %v.",
  "chemical and its common name",
);

add(
  "pseb10:life",
  "Science Class 10",
  "Life Processes",
  "Moderate",
  [
    { key: "Largest gland in the human body", value: "Liver" },
    { key: "Green pigment that traps sunlight", value: "Chlorophyll" },
    { key: "Openings on a leaf for gas exchange", value: "Stomata" },
    { key: "Functional unit of the kidney", value: "Nephron" },
    { key: "Vessel that carries blood away from the heart", value: "Artery" },
    { key: "Vessel that carries blood back to the heart", value: "Vein" },
    { key: "Tissue that carries water in plants", value: "Xylem" },
    { key: "Tissue that carries food in plants", value: "Phloem" },
    { key: "Number of chambers in the human heart", value: "Four" },
    { key: "Enzyme in saliva that digests starch", value: "Salivary amylase" },
    { key: "Process of removing metabolic waste", value: "Excretion" },
  ],
  "In Life Processes, what is the answer for '%s'?",
  "Which term matches '%s'?",
  "%k is %v.",
  "biological term and its answer",
);

add(
  "pseb10:light",
  "Science Class 10",
  "Light Reflection and Refraction",
  "Difficult",
  [
    { key: "Mirror used as a rear-view mirror in vehicles", value: "Convex mirror" },
    { key: "Mirror used by dentists", value: "Concave mirror" },
    { key: "Mirror used in vehicle headlights", value: "Concave mirror" },
    { key: "Lens used to correct myopia", value: "Concave lens" },
    { key: "Lens used to correct hypermetropia", value: "Convex lens" },
    { key: "SI unit of the power of a lens", value: "Dioptre" },
    { key: "Bending of light entering another medium", value: "Refraction" },
    { key: "Ratio of speed of light in vacuum to that in a medium", value: "Refractive index" },
    { key: "Distance between the pole and the focus", value: "Focal length" },
    { key: "Image formed by a plane mirror", value: "Virtual, erect and of the same size" },
  ],
  "In Light, what is the answer for '%s'?",
  "Which optical term matches '%s'?",
  "%k is %v.",
  "optical item and its answer",
);

add(
  "pseb10:electricity",
  "Science Class 10",
  "Electricity",
  "Difficult",
  [
    { key: "SI unit of electric current", value: "Ampere" },
    { key: "SI unit of potential difference", value: "Volt" },
    { key: "SI unit of resistance", value: "Ohm" },
    { key: "SI unit of electric power", value: "Watt" },
    { key: "SI unit of electric charge", value: "Coulomb" },
    {
      key: "Ohm's law",
      value: "Current is directly proportional to potential difference at constant temperature",
    },
    { key: "Instrument that measures current", value: "Ammeter" },
    { key: "Instrument that measures potential difference", value: "Voltmeter" },
    {
      key: "Connection in which current is the same through all components",
      value: "Series connection",
    },
    {
      key: "Connection in which voltage is the same across all components",
      value: "Parallel connection",
    },
    { key: "Commercial unit of electrical energy", value: "Kilowatt hour" },
  ],
  "In Electricity, what is the answer for '%s'?",
  "Which electrical term matches '%s'?",
  "%k is %v.",
  "electrical quantity and its unit",
);

/* ========================================================= Mathematics */

add(
  "pseb9:math",
  "Math Class 9",
  "Polynomials",
  "Moderate",
  [
    { key: "Degree of a linear polynomial", value: "One" },
    { key: "Degree of a quadratic polynomial", value: "Two" },
    { key: "Degree of a cubic polynomial", value: "Three" },
    { key: "Degree of a non-zero constant polynomial", value: "Zero" },
    { key: "Number of zeroes of a linear polynomial", value: "One" },
    { key: "Maximum zeroes of a quadratic polynomial", value: "Two" },
    { key: "(a + b) squared", value: "a squared plus 2ab plus b squared" },
    { key: "(a - b) squared", value: "a squared minus 2ab plus b squared" },
    { key: "a squared minus b squared", value: "(a + b)(a - b)" },
    { key: "Remainder when p(x) is divided by (x - a)", value: "p(a)" },
  ],
  "In Polynomials, what is '%s'?",
  "Which identity or fact equals '%s'?",
  "%k is %v.",
  "polynomial fact and its value",
);

add(
  "pseb10:trig",
  "Math Class 10",
  "Trigonometry",
  "Difficult",
  [
    { key: "sin 0 degrees", value: "0" },
    { key: "sin 30 degrees", value: "1/2" },
    { key: "sin 45 degrees", value: "1/root 2" },
    { key: "sin 60 degrees", value: "root 3/2" },
    { key: "sin 90 degrees", value: "1" },
    { key: "cos 0 degrees", value: "1" },
    { key: "cos 60 degrees", value: "1/2" },
    { key: "tan 45 degrees", value: "1" },
    { key: "tan 0 degrees", value: "0" },
    { key: "Value of sin squared A plus cos squared A", value: "1" },
    { key: "Value of 1 plus tan squared A", value: "sec squared A" },
    { key: "Value of 1 plus cot squared A", value: "cosec squared A" },
  ],
  "What is the value of %s?",
  "Which trigonometric expression has the value '%s'?",
  "%k = %v.",
  "trigonometric expression and its value",
);

/* ============================================== Social Science (SST) */

add(
  "pseb:sst-nat",
  "SST",
  "Nationalism in India",
  "Moderate",
  [
    { key: "Rowlatt Act", value: "Passed in 1919, allowing detention without trial" },
    { key: "Jallianwala Bagh massacre", value: "Took place at Amritsar in April 1919" },
    { key: "Non-Cooperation Movement", value: "Launched in 1920 by Mahatma Gandhi" },
    { key: "Chauri Chaura incident", value: "Led Gandhi to call off Non-Cooperation in 1922" },
    { key: "Simon Commission", value: "Boycotted in 1928 with the slogan Go Back Simon" },
    { key: "Dandi March", value: "Gandhi's salt march of 1930" },
    { key: "Civil Disobedience Movement", value: "Began with the breaking of the salt law" },
    { key: "Poona Pact", value: "Agreement of 1932 on reserved seats for depressed classes" },
    { key: "Quit India Movement", value: "Launched in 1942" },
    { key: "Swaraj Party", value: "Founded by C. R. Das and Motilal Nehru" },
  ],
  "Which statement correctly describes the %s?",
  "Which event is described as '%s'?",
  "%k: %v.",
  "event and its description",
  BOARD_GK,
);

add(
  "pseb:sst-res",
  "SST",
  "Resources and Development",
  "Moderate",
  [
    { key: "Black soil", value: "Best suited for cotton cultivation" },
    { key: "Alluvial soil", value: "Most fertile soil of the northern plains" },
    { key: "Laterite soil", value: "Formed by intense leaching in high rainfall areas" },
    { key: "Arid soil", value: "Sandy soil of the desert region" },
    { key: "Removal of topsoil by wind and water", value: "Soil erosion" },
    { key: "Deep channels cut by running water", value: "Gullies" },
    { key: "Ploughing along contour lines", value: "Contour ploughing" },
    { key: "Growing crops in strips with grass in between", value: "Strip cropping" },
    { key: "Resource that can be renewed by nature", value: "Renewable resource" },
    { key: "Resource with a limited stock", value: "Non-renewable resource" },
  ],
  "Which statement is correct about '%s'?",
  "Which resource term is described as '%s'?",
  "%k: %v.",
  "resource term and its description",
  BOARD_GK,
);

add(
  "pseb:sst-money",
  "SST",
  "Money and Credit",
  "Moderate",
  [
    { key: "Body that issues currency notes in India", value: "Reserve Bank of India" },
    { key: "Money that is accepted as a medium of exchange by law", value: "Legal tender" },
    { key: "Difficulty of matching wants in barter", value: "Double coincidence of wants" },
    { key: "Assets that a borrower gives as security", value: "Collateral" },
    { key: "Credit taken from moneylenders and traders", value: "Informal sector credit" },
    { key: "Credit from banks and cooperatives", value: "Formal sector credit" },
    { key: "Group of people who save and lend among themselves", value: "Self Help Group" },
    { key: "Extra amount paid on a loan", value: "Interest" },
    { key: "Situation where a borrower cannot repay", value: "Debt trap" },
  ],
  "In Money and Credit, what is '%s'?",
  "Which term is described as '%s'?",
  "%k is %v.",
  "economic term and its meaning",
  BOARD_GK,
);

export const PSEB_TEMPLATES = templates;
