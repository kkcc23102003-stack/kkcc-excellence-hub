/**
 * NCERT / CBSE / ICSE Class 9 — full syllabus coverage.
 *
 * Two things this file fixes.
 *
 * First, coverage. Class 9 Science had six of its twelve chapters and Class 9
 * Maths had exactly one of twelve. Every remaining chapter of the current
 * NCERT syllabus is added here, and the chapters that the 2023 rationalisation
 * dropped are kept too, tagged to the old-syllabus track, because state boards
 * and many competitive exams still ask them.
 *
 * Second, depth. Each chapter carries a working fact table and a higher-order
 * fact table. Direct recall from the working table is Easy; matching and
 * two-statement items are Moderate; three-statement items are Difficult. The
 * higher-order table raises recall to Moderate and keeps its multi-step forms
 * Difficult. This supplies all three paid-paper tiers without changing
 * syllabus coverage or reusing a question at multiple difficulty labels.
 *
 * Nothing here is copied from a board paper or a publisher. The facts are
 * syllabus facts; the wording is ours.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  literalTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

const templates: Template[] = [];

/** Current NCERT syllabus, as examined by both boards in Class 9. */
const C9 = ["CBSE Class 9", "ICSE Class 9", "CBSE Class 9-10", "ICSE Class 9-10"];

/**
 * Chapters the 2023 rationalisation removed from NCERT but which state
 * boards, olympiads and entrance foundations still set.
 */
const C9_OLD = [...C9, "State Board MCQ", "NTSE/Olympiad"];

/**
 * ICSE Class 9 Maths follows a different chapter list from NCERT, so the
 * chapters below that exist only in the NCERT scheme are tagged to CBSE
 * alone. The ICSE-only chapters live in icse-maths.ts.
 */
const CBSE9_ONLY = ["CBSE Class 9", "CBSE Class 9-10"];

/**
 * One chapter, in two layers.
 *
 * `rows` is the Moderate working layer that feeds the practice quiz.
 * `hard` is the Difficult exam layer that feeds the paid series.
 */
function chapter(opts: {
  id: string;
  subject: string;
  topic: string;
  exams?: string[];
  forward: string;
  reverse?: string;
  explain: string;
  rows: FactRow[];
  hard: FactRow[];
}) {
  const exams = opts.exams ?? C9;
  const base = {
    subject: opts.subject,
    topic: opts.topic,
    exams,
  };
  templates.push(
    ...factTemplate({
      ...base,
      id: opts.id,
      difficulty: "Moderate",
      rows: opts.rows,
      forward: opts.forward,
      reverse: opts.reverse,
      explain: opts.explain,
    }),
    matchTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
    statementTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
    statementCountTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
  );
  if (opts.hard.length >= 3) {
    const hid = `${opts.id}:adv`;
    templates.push(
      ...factTemplate({
        ...base,
        id: hid,
        difficulty: "Difficult",
        rows: opts.hard,
        forward: opts.forward,
        reverse: opts.reverse,
        explain: opts.explain,
      }),
      matchTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
      statementTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
      statementCountTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
    );
  }
}

/* ========================================================= Science Class 9 */

chapter({
  id: "n9:sci:atoms-molecules",
  subject: "Science Class 9",
  topic: "Atoms and Molecules",
  forward: "In atoms and molecules, what is %s?",
  reverse: "Which term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Law of conservation of mass",
      value: "Mass is neither created nor destroyed in a chemical reaction",
    },
    {
      key: "Law of constant proportions",
      value: "A pure compound always has the same elements in the same mass ratio",
    },
    { key: "Atomic mass unit", value: "One twelfth the mass of one atom of carbon-12" },
    { key: "Molecular mass of water", value: "18 u, from 2 x 1 for hydrogen plus 16 for oxygen" },
    { key: "Mole", value: "The amount of a substance containing 6.022 x 10^23 particles" },
    { key: "Avogadro constant", value: "6.022 x 10^23 particles per mole" },
    { key: "Molar mass", value: "The mass of one mole of a substance, in grams" },
    { key: "Valency", value: "The combining capacity of an atom" },
    {
      key: "Polyatomic ion",
      value: "A group of atoms carrying a single net charge, such as sulphate",
    },
    { key: "Chemical formula of ammonia", value: "NH3, one nitrogen with three hydrogen atoms" },
    {
      key: "Formula unit mass",
      value: "The mass of a formula unit of an ionic compound, such as NaCl at 58.5 u",
    },
    { key: "Symbol of sodium", value: "Na, taken from its Latin name natrium" },
  ],
  hard: [
    { key: "22 g of CO2", value: "0.5 mole, because the molar mass of CO2 is 44 g" },
    {
      key: "Number of atoms in 1 mole of water",
      value: "3 x 6.022 x 10^23, since each molecule has three atoms",
    },
    { key: "Mass of 0.2 mole of glucose", value: "36 g, from 0.2 x 180 g per mole" },
    { key: "Molar mass of calcium carbonate", value: "100 g per mole, from 40 plus 12 plus 48" },
    { key: "Percentage of nitrogen in urea", value: "About 46.7 percent, from 28 out of 60" },
    { key: "Gram atomic mass of oxygen", value: "16 g, the mass of one mole of oxygen atoms" },
  ],
});

chapter({
  id: "n9:sci:tissues",
  subject: "Science Class 9",
  topic: "Tissues",
  forward: "In the chapter on tissues, what is %s?",
  reverse: "Which tissue or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Meristematic tissue", value: "Dividing plant tissue found at root and shoot tips" },
    { key: "Parenchyma", value: "Simple permanent tissue with thin walls that stores food" },
    { key: "Collenchyma", value: "Tissue with thickened corners that gives flexibility to stems" },
    { key: "Sclerenchyma", value: "Dead, lignified tissue that gives hardness and strength" },
    { key: "Xylem", value: "Complex tissue carrying water and minerals upward" },
    { key: "Phloem", value: "Complex tissue carrying food in both directions" },
    { key: "Squamous epithelium", value: "Flat cells lining blood vessels and mouth" },
    { key: "Areolar tissue", value: "Connective tissue filling space between organs" },
    { key: "Adipose tissue", value: "Fat-storing connective tissue under the skin" },
    { key: "Striated muscle", value: "Voluntary skeletal muscle with light and dark bands" },
    {
      key: "Cardiac muscle",
      value: "Involuntary, branched, rhythmically contracting heart muscle",
    },
    { key: "Neuron", value: "The structural and functional unit of nervous tissue" },
  ],
  hard: [
    {
      key: "Tissue with dead cells at maturity in plants",
      value: "Sclerenchyma and the tracheids and vessels of xylem",
    },
    { key: "Only connective tissue that is fluid", value: "Blood, whose matrix is plasma" },
    {
      key: "Tissue that repairs a broken bone",
      value: "Bone, a rigid connective tissue with a calcium and phosphorus matrix",
    },
    {
      key: "Companion cell",
      value: "The living phloem cell that keeps the enucleate sieve tube working",
    },
    { key: "Lateral meristem", value: "Cambium, which increases the girth of a stem" },
    {
      key: "Tendon versus ligament",
      value:
        "Tendon joins muscle to bone and is inelastic; ligament joins bone to bone and is elastic",
    },
  ],
});

chapter({
  id: "n9:sci:motion",
  subject: "Science Class 9",
  topic: "Motion",
  forward: "In the chapter on motion, what is %s?",
  reverse: "Which quantity or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Distance", value: "The total path length covered, a scalar quantity" },
    { key: "Displacement", value: "The shortest distance from start to finish, a vector quantity" },
    { key: "Speed", value: "Distance covered per unit time" },
    { key: "Velocity", value: "Displacement per unit time, a vector" },
    { key: "Acceleration", value: "The rate of change of velocity with time" },
    { key: "Uniform motion", value: "Equal distances covered in equal intervals of time" },
    { key: "SI unit of acceleration", value: "Metre per second squared" },
    { key: "First equation of motion", value: "v = u + at" },
    { key: "Second equation of motion", value: "s = ut + half a t squared" },
    { key: "Third equation of motion", value: "v squared minus u squared equals 2as" },
    { key: "Slope of a distance-time graph", value: "The speed of the body" },
    { key: "Area under a velocity-time graph", value: "The displacement of the body" },
  ],
  hard: [
    {
      key: "Centripetal acceleration",
      value: "v squared divided by r, directed towards the centre of the circular path",
    },
    {
      key: "Body with uniform speed on a circle",
      value: "Accelerated motion, because the direction of velocity keeps changing",
    },
    { key: "Distance in the nth second", value: "u plus a times (2n minus 1) divided by 2" },
    {
      key: "Negative slope on a velocity-time graph",
      value: "Retardation, meaning velocity is decreasing",
    },
    {
      key: "Average velocity for uniform acceleration",
      value: "Half the sum of the initial and final velocities",
    },
    {
      key: "Displacement when a body returns to its start",
      value: "Zero, however long the path travelled",
    },
  ],
});

chapter({
  id: "n9:sci:gravitation",
  subject: "Science Class 9",
  topic: "Gravitation",
  forward: "In gravitation, what is %s?",
  reverse: "Which term or law is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Universal law of gravitation",
      value:
        "Every mass attracts every other mass with a force proportional to the product of the masses and inversely proportional to the square of the distance",
    },
    { key: "Value of G", value: "6.67 x 10^-11 N m squared per kg squared" },
    { key: "Value of g on Earth", value: "About 9.8 metre per second squared" },
    { key: "Mass", value: "The amount of matter in a body, the same everywhere" },
    { key: "Weight", value: "The force of gravity on a body, equal to mass times g" },
    { key: "Free fall", value: "Motion under gravity alone, with no other force acting" },
    { key: "Thrust", value: "The force acting perpendicular to a surface" },
    { key: "Pressure", value: "Thrust per unit area, measured in pascal" },
    {
      key: "Archimedes principle",
      value: "A body in a fluid is buoyed up by a force equal to the weight of the fluid displaced",
    },
    { key: "Buoyant force", value: "The upward force a fluid exerts on a body immersed in it" },
    {
      key: "Relative density",
      value: "The density of a substance divided by the density of water",
    },
    { key: "Weight on the Moon", value: "One sixth of the weight on Earth" },
  ],
  hard: [
    {
      key: "Why g is greater at the poles",
      value:
        "The Earth is flattened there, so the radius is smaller and g varies as one over r squared",
    },
    {
      key: "Value of g at the centre of the Earth",
      value: "Zero, because the mass pulls equally in all directions",
    },
    {
      key: "Why a body floats",
      value: "Its density is less than the fluid, so the buoyant force balances its weight",
    },
    { key: "Time of flight for a body thrown up with speed u", value: "2u divided by g" },
    {
      key: "Maximum height reached by a body thrown up with speed u",
      value: "u squared divided by 2g",
    },
    {
      key: "Weight of a body in a freely falling lift",
      value: "Zero, the state called weightlessness",
    },
  ],
});

chapter({
  id: "n9:sci:work-energy",
  subject: "Science Class 9",
  topic: "Work and Energy",
  forward: "In work and energy, what is %s?",
  reverse: "Which term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Work", value: "The product of force and displacement in the direction of the force" },
    { key: "SI unit of work", value: "Joule, which is one newton metre" },
    { key: "Kinetic energy", value: "Energy due to motion, equal to half m v squared" },
    { key: "Potential energy", value: "Energy due to position, equal to mgh near the Earth" },
    {
      key: "Law of conservation of energy",
      value: "Energy can be transformed but never created or destroyed",
    },
    { key: "Power", value: "The rate of doing work, measured in watt" },
    { key: "One kilowatt hour", value: "3.6 x 10^6 joule, the commercial unit of energy" },
    { key: "One horsepower", value: "About 746 watt" },
    { key: "Zero work", value: "Work done when the force is perpendicular to the displacement" },
    {
      key: "Negative work",
      value: "Work done when force and displacement point in opposite directions",
    },
    { key: "Energy in a stretched spring", value: "Elastic potential energy" },
    { key: "Commercial unit of electrical energy", value: "The kilowatt hour, called one unit" },
  ],
  hard: [
    {
      key: "Work done by a body moving in a complete circle",
      value: "Zero, since the centripetal force is always perpendicular to the motion",
    },
    {
      key: "Effect of doubling speed on kinetic energy",
      value: "It becomes four times, because energy varies as the square of speed",
    },
    {
      key: "Relation between kinetic energy and momentum",
      value: "Kinetic energy equals p squared divided by 2m",
    },
    {
      key: "Work done against gravity on a level road",
      value: "Zero, because there is no vertical displacement",
    },
    {
      key: "Energy change for a falling body",
      value: "Potential energy converts into kinetic energy, their sum staying constant",
    },
    {
      key: "Power of a machine lifting 100 kg through 5 m in 10 s",
      value: "490 watt, from mgh divided by time",
    },
  ],
});

chapter({
  id: "n9:sci:food-resources",
  subject: "Science Class 9",
  topic: "Improvement in Food Resources",
  forward: "In improvement in food resources, what is %s?",
  reverse: "Which term or practice is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Kharif crops",
      value: "Crops sown with the monsoon and harvested in autumn, such as paddy and maize",
    },
    { key: "Rabi crops", value: "Winter crops such as wheat, gram and mustard" },
    {
      key: "Hybridisation",
      value: "Crossing genetically dissimilar plants to combine desired traits",
    },
    {
      key: "Macronutrients",
      value: "The six nutrients plants need in large amounts, including nitrogen and phosphorus",
    },
    { key: "Manure", value: "Organic matter from decomposed plant and animal waste" },
    {
      key: "Fertiliser",
      value: "A commercially made nutrient supplying nitrogen, phosphorus or potassium",
    },
    { key: "Mixed cropping", value: "Growing two or more crops together on the same field" },
    { key: "Crop rotation", value: "Growing different crops in sequence on the same field" },
    { key: "Vermicompost", value: "Compost prepared using earthworms" },
    { key: "Apiculture", value: "The rearing of honeybees for honey and wax" },
    { key: "Pisciculture", value: "The rearing of fish" },
    {
      key: "Composite fish culture",
      value: "Rearing five or six compatible fish species in one pond",
    },
  ],
  hard: [
    {
      key: "Why leguminous crops improve soil",
      value: "Rhizobium in their root nodules fixes atmospheric nitrogen",
    },
    {
      key: "Photoperiod",
      value: "The duration of sunlight, which controls flowering and grain formation",
    },
    {
      key: "Advantage of intercropping over mixed cropping",
      value: "Crops are planted in defined row patterns, so harvesting and spraying stay separate",
    },
    {
      key: "Italian bee variety used in apiculture",
      value: "Apis mellifera, valued for high honey yield and gentle nature",
    },
    {
      key: "Why fertilisers alone degrade soil",
      value: "They add nutrients but no organic matter, so soil texture and microbial life decline",
    },
    {
      key: "Bee pasturage",
      value: "The flowers available to bees, which decides the quantity and taste of honey",
    },
  ],
});

/* -- chapters removed by the 2023 rationalisation, still set by other boards */

chapter({
  id: "n9:sci:diversity",
  subject: "Science Class 9",
  topic: "Diversity in Living Organisms (old NCERT)",
  exams: C9_OLD,
  forward: "In classification of living organisms, what is %s?",
  reverse: "Which group or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Binomial nomenclature", value: "The two-word naming system given by Carolus Linnaeus" },
    { key: "Monera", value: "Prokaryotes with no true nucleus, such as bacteria" },
    { key: "Protista", value: "Unicellular eukaryotes such as amoeba and paramecium" },
    {
      key: "Fungi",
      value: "Heterotrophic eukaryotes with chitin cell walls that feed saprophytically",
    },
    { key: "Thallophyta", value: "Plants with an undifferentiated body, the algae" },
    { key: "Bryophyta", value: "The amphibians of the plant kingdom, such as moss" },
    { key: "Pteridophyta", value: "The first plants with true vascular tissue, such as fern" },
    { key: "Gymnosperms", value: "Plants bearing naked seeds, such as pine and deodar" },
    { key: "Porifera", value: "Pore-bearing animals with canal systems, the sponges" },
    {
      key: "Coelenterata",
      value: "Animals with a body cavity and tissue-level organisation, such as hydra",
    },
    { key: "Arthropoda", value: "The largest animal phylum, with jointed legs and an exoskeleton" },
    { key: "Chordata", value: "Animals with a notochord, dorsal nerve cord and gill slits" },
  ],
  hard: [
    {
      key: "Hierarchy of classification",
      value: "Kingdom, phylum, class, order, family, genus, species",
    },
    { key: "Phylum with a water vascular system", value: "Echinodermata, such as the starfish" },
    { key: "Animals with an open circulatory system", value: "Arthropods and most molluscs" },
    { key: "Warm-blooded egg-laying mammal", value: "The platypus, a monotreme" },
    {
      key: "Difference between Pisces and Amphibia",
      value:
        "Pisces breathe only by gills throughout life; amphibians use gills as larvae and lungs as adults",
    },
    {
      key: "Pteridophyta versus Gymnosperms",
      value: "Pteridophytes bear no seeds at all; gymnosperms bear naked seeds without fruit",
    },
  ],
});

chapter({
  id: "n9:sci:illness",
  subject: "Science Class 9",
  topic: "Why Do We Fall Ill (old NCERT)",
  exams: C9_OLD,
  forward: "In health and disease, what is %s?",
  reverse: "Which disease or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Acute disease", value: "A disease that lasts a short time, such as the common cold" },
    { key: "Chronic disease", value: "A long-lasting disease, such as tuberculosis or diabetes" },
    {
      key: "Infectious disease",
      value: "A disease caused by a pathogen and spread from person to person",
    },
    {
      key: "Malaria",
      value: "A protozoan disease caused by Plasmodium and spread by the Anopheles mosquito",
    },
    { key: "Tuberculosis", value: "A bacterial lung disease caused by Mycobacterium tuberculosis" },
    {
      key: "Typhoid",
      value: "A bacterial disease caused by Salmonella typhi, spread through contaminated water",
    },
    { key: "Dengue", value: "A viral disease spread by the Aedes mosquito" },
    { key: "AIDS", value: "A viral disease caused by HIV, which weakens the immune system" },
    {
      key: "Antibiotic",
      value: "A medicine that blocks a bacterial pathway and does not work on viruses",
    },
    {
      key: "Vaccine",
      value: "A preparation that trains the immune system to recognise a pathogen",
    },
    { key: "Vector", value: "An organism that carries a pathogen from one host to another" },
    { key: "Kala-azar", value: "A protozoan disease caused by Leishmania" },
  ],
  hard: [
    {
      key: "Why antibiotics do not act on viruses",
      value:
        "Viruses use the host cell machinery and lack the bacterial pathways antibiotics block",
    },
    { key: "Disease spread through air", value: "Tuberculosis, pneumonia and the common cold" },
    { key: "Organ affected in Japanese encephalitis", value: "The brain" },
    {
      key: "Principle of immunisation",
      value:
        "The immune system remembers a first exposure, so a later real infection is met quickly",
    },
    {
      key: "Peptic ulcer causative agent",
      value: "Helicobacter pylori, shown by Marshall and Warren",
    },
    {
      key: "Why public hygiene affects individual health",
      value:
        "Most infections spread through shared air, water and vectors, which no individual controls alone",
    },
  ],
});

chapter({
  id: "n9:sci:natural-resources",
  subject: "Science Class 9",
  topic: "Natural Resources (old NCERT)",
  exams: C9_OLD,
  forward: "In natural resources, what is %s?",
  reverse: "Which cycle, layer or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Troposphere", value: "The lowest layer of the atmosphere where weather occurs" },
    {
      key: "Ozone layer",
      value: "The stratospheric layer that absorbs harmful ultraviolet radiation",
    },
    { key: "Nitrogen fixation", value: "Conversion of atmospheric nitrogen into usable compounds" },
    { key: "Humus", value: "The dark organic matter in soil formed from decayed remains" },
    { key: "Soil erosion", value: "The removal of topsoil by wind or water" },
    {
      key: "Greenhouse effect",
      value: "Warming of the Earth by gases that trap outgoing infrared radiation",
    },
    {
      key: "Eutrophication",
      value: "Nutrient enrichment of water leading to algal bloom and oxygen loss",
    },
    {
      key: "Water cycle",
      value: "The continuous movement of water through evaporation, condensation and precipitation",
    },
    {
      key: "Carbon cycle",
      value: "The circulation of carbon through photosynthesis, respiration and combustion",
    },
    {
      key: "Biogeochemical cycle",
      value: "The circulation of an element between living things and the environment",
    },
    { key: "Chlorofluorocarbons", value: "Compounds that destroy stratospheric ozone" },
    { key: "Smog", value: "A visible haze of smoke and fog caused by pollutants" },
  ],
  hard: [
    { key: "Percentage of nitrogen in air", value: "About 78 percent by volume" },
    {
      key: "Why coastal areas have moderate climate",
      value: "Water has a high specific heat, so the sea warms and cools slowly",
    },
    {
      key: "How lightning fixes nitrogen",
      value: "It converts nitrogen and oxygen into oxides that dissolve in rain as nitrates",
    },
    {
      key: "Main greenhouse gas by contribution",
      value: "Carbon dioxide, followed by methane and nitrous oxide",
    },
    {
      key: "Why ozone is harmful at ground level",
      value:
        "It is a reactive pollutant that damages lungs and crops, though it protects us in the stratosphere",
    },
    {
      key: "Bacteria converting ammonia to nitrite",
      value: "Nitrosomonas, in the nitrification step",
    },
  ],
});

// Keep one simple, hand-curated review template for each legacy chapter. The
// original Moderate/Difficult source layers above remain untouched; these
// additions preserve the six old-NCERT chapters in the easy review path too.
templates.push(
  literalTemplate({
    id: "n9:sci:diversity:old-easy-review",
    subject: "Science Class 9",
    topic: "Diversity in Living Organisms (old NCERT)",
    difficulty: "Easy",
    exams: C9_OLD,
    items: [
      {
        prompt: "Which kingdom contains single-celled organisms with a true nucleus?",
        answer: "Protista",
        distractors: ["Monera", "Fungi", "Plantae"],
        explanation: "Protists are unicellular eukaryotes, so their cells contain a true nucleus.",
      },
      {
        prompt: "Which plant group bears naked seeds rather than seeds enclosed in fruit?",
        answer: "Gymnosperms",
        distractors: ["Bryophytes", "Pteridophytes", "Angiosperms"],
        explanation: "Gymnosperms bear naked seeds, commonly on cones, without enclosing fruit.",
      },
      {
        prompt: "Which animal phylum is recognised by jointed legs and an exoskeleton?",
        answer: "Arthropoda",
        distractors: ["Porifera", "Chordata", "Coelenterata"],
        explanation: "Arthropods have jointed appendages and a protective external skeleton.",
      },
    ],
  }),
  literalTemplate({
    id: "n9:sci:illness:old-easy-review",
    subject: "Science Class 9",
    topic: "Why Do We Fall Ill (old NCERT)",
    difficulty: "Easy",
    exams: C9_OLD,
    items: [
      {
        prompt: "What kind of disease usually lasts for only a short time?",
        answer: "An acute disease",
        distractors: ["A chronic disease", "A hereditary disease", "A deficiency disease"],
        explanation: "An acute disease has a short course, unlike a long-lasting chronic disease.",
      },
      {
        prompt: "Which parasite causes malaria in humans?",
        answer: "Plasmodium",
        distractors: ["Salmonella typhi", "Mycobacterium tuberculosis", "HIV"],
        explanation:
          "Malaria is caused by Plasmodium and is transmitted by infected Anopheles mosquitoes.",
      },
      {
        prompt: "Antibiotics act against which broad group of disease-causing organisms?",
        answer: "Bacteria",
        distractors: ["Viruses", "Allergens", "Nutrient deficiencies"],
        explanation: "Antibiotics target bacterial pathways and do not work against viruses.",
      },
    ],
  }),
  literalTemplate({
    id: "n9:sci:natural-resources:old-easy-review",
    subject: "Science Class 9",
    topic: "Natural Resources (old NCERT)",
    difficulty: "Easy",
    exams: C9_OLD,
    items: [
      {
        prompt: "Which atmospheric layer is closest to Earth's surface?",
        answer: "The troposphere",
        distractors: ["The stratosphere", "The mesosphere", "The thermosphere"],
        explanation:
          "The troposphere is the lowest atmospheric layer and is where most weather occurs.",
      },
      {
        prompt: "What process converts atmospheric nitrogen into usable compounds?",
        answer: "Nitrogen fixation",
        distractors: ["Denitrification", "Evaporation", "Condensation"],
        explanation:
          "Nitrogen fixation changes atmospheric nitrogen into compounds that plants can use.",
      },
      {
        prompt:
          "Which atmospheric feature absorbs much of the Sun's harmful ultraviolet radiation?",
        answer: "The ozone layer",
        distractors: ["The troposphere", "The ionosphere", "The cloud layer"],
        explanation: "Stratospheric ozone absorbs most incoming harmful ultraviolet radiation.",
      },
    ],
  }),
);

/* ============================================================ Maths Class 9 */

chapter({
  id: "n9:math:number-systems",
  subject: "Math Class 9",
  exams: CBSE9_ONLY,
  topic: "Number Systems",
  forward: "In number systems, what is %s?",
  reverse: "Which term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Rational number",
      value: "A number that can be written as p over q where q is not zero",
    },
    {
      key: "Irrational number",
      value: "A number that cannot be written as p over q, such as root 2",
    },
    { key: "Real number", value: "Any number that is either rational or irrational" },
    {
      key: "Terminating decimal",
      value: "A decimal that ends, produced when the denominator has only 2 and 5 as prime factors",
    },
    {
      key: "Non-terminating recurring decimal",
      value: "A decimal that repeats forever, always a rational number",
    },
    {
      key: "Rationalising factor of root 3",
      value: "Root 3, since their product is the rational number 3",
    },
    { key: "a to the power m times a to the power n", value: "a to the power m plus n" },
    { key: "a to the power zero", value: "1, for any non-zero a" },
    { key: "Square root of 2, approximately", value: "1.414, an irrational number" },
    { key: "Number of rationals between any two rationals", value: "Infinitely many" },
    { key: "Sum of a rational and an irrational number", value: "Always irrational" },
    { key: "a to the power minus n", value: "1 divided by a to the power n" },
  ],
  hard: [
    {
      key: "0.999 recurring",
      value: "Exactly 1, as shown by letting x equal it and solving 10x minus x",
    },
    {
      key: "Product of two irrational numbers",
      value: "May be rational or irrational, for example root 2 times root 2 is 2",
    },
    {
      key: "Rationalised form of 1 over (root 5 minus root 3)",
      value: "(root 5 plus root 3) divided by 2",
    },
    {
      key: "Decimal expansion of 1 over 7",
      value: "0.142857 recurring, with a six-digit repeating block",
    },
    {
      key: "Condition for p over q to terminate",
      value: "In lowest terms, q must be of the form 2 to the m times 5 to the n",
    },
    {
      key: "Value of (root 3 plus root 2) times (root 3 minus root 2)",
      value: "1, using the difference of squares",
    },
  ],
});

chapter({
  id: "n9:math:coordinate-geometry",
  subject: "Math Class 9",
  topic: "Coordinate Geometry",
  forward: "In coordinate geometry, what is %s?",
  reverse: "Which term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Abscissa", value: "The x coordinate of a point, its distance from the y axis" },
    { key: "Ordinate", value: "The y coordinate of a point, its distance from the x axis" },
    { key: "Origin", value: "The point (0, 0) where the two axes meet" },
    { key: "First quadrant", value: "The region where both x and y are positive" },
    { key: "Second quadrant", value: "The region where x is negative and y is positive" },
    { key: "Third quadrant", value: "The region where both x and y are negative" },
    { key: "Fourth quadrant", value: "The region where x is positive and y is negative" },
    { key: "Point on the x axis", value: "A point of the form (a, 0)" },
    { key: "Point on the y axis", value: "A point of the form (0, b)" },
    { key: "Cartesian plane", value: "The plane formed by two perpendicular number lines" },
    { key: "Coordinates of a point", value: "An ordered pair giving its position as (x, y)" },
    { key: "Distance of (3, 4) from the origin", value: "5 units" },
  ],
  hard: [
    { key: "Quadrant of the point (-4, -7)", value: "The third quadrant" },
    { key: "Mirror image of (5, 3) in the x axis", value: "(5, -3)" },
    { key: "Mirror image of (5, 3) in the y axis", value: "(-5, 3)" },
    {
      key: "Points where abscissa equals ordinate",
      value: "They lie on the line y equals x, through the origin",
    },
    { key: "Area of the triangle formed by (0,0), (4,0) and (0,3)", value: "6 square units" },
    {
      key: "Perpendicular distance of (7, -2) from the x axis",
      value: "2 units, the absolute value of the ordinate",
    },
  ],
});

chapter({
  id: "n9:math:linear-equations",
  subject: "Math Class 9",
  exams: CBSE9_ONLY,
  topic: "Linear Equations in Two Variables",
  forward: "In linear equations in two variables, what is %s?",
  reverse: "Which term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Standard form", value: "ax plus by plus c equals 0, where a and b are not both zero" },
    {
      key: "Solution of a linear equation in two variables",
      value: "An ordered pair that satisfies the equation",
    },
    { key: "Number of solutions", value: "Infinitely many, forming a straight line" },
    { key: "Graph of a linear equation in two variables", value: "A straight line" },
    { key: "Graph of y equals 0", value: "The x axis" },
    { key: "Graph of x equals 0", value: "The y axis" },
    { key: "Graph of x equals a", value: "A line parallel to the y axis" },
    { key: "Graph of y equals b", value: "A line parallel to the x axis" },
    { key: "Equation of a line through the origin", value: "y equals mx, with no constant term" },
    { key: "Minimum points needed to draw the line", value: "Two distinct points" },
    {
      key: "x intercept",
      value: "The x value where the line crosses the x axis, found by putting y equal to 0",
    },
    {
      key: "y intercept",
      value: "The y value where the line crosses the y axis, found by putting x equal to 0",
    },
  ],
  hard: [
    { key: "Value of k if (2, 0) satisfies 2x plus 3y equals k", value: "4" },
    { key: "Equation of the line through (0,0) and (2,6)", value: "y equals 3x" },
    {
      key: "Why 3x plus 4 equals 0 is also a two-variable equation",
      value: "It can be written as 3x plus 0y plus 4 equals 0, graphing as a vertical line",
    },
    { key: "Point where 2x plus y equals 6 meets the y axis", value: "(0, 6)" },
    { key: "Condition for (a, b) to lie on px plus qy equals r", value: "pa plus qb must equal r" },
    {
      key: "Relation between Celsius and Fahrenheit as a linear equation",
      value: "F equals nine fifths C plus 32",
    },
  ],
});

chapter({
  id: "n9:math:euclid",
  subject: "Math Class 9",
  exams: CBSE9_ONLY,
  topic: "Introduction to Euclid's Geometry",
  forward: "In Euclid's geometry, what is %s?",
  reverse: "Which axiom or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Axiom", value: "An assumption used throughout mathematics, not just geometry" },
    { key: "Postulate", value: "An assumption specific to geometry" },
    { key: "Theorem", value: "A statement proved using axioms and earlier results" },
    {
      key: "Euclid's first postulate",
      value: "A straight line may be drawn from any point to any other point",
    },
    { key: "Euclid's second postulate", value: "A terminated line can be produced indefinitely" },
    {
      key: "Euclid's third postulate",
      value: "A circle can be drawn with any centre and any radius",
    },
    { key: "Euclid's fourth postulate", value: "All right angles are equal to one another" },
    {
      key: "Euclid's fifth postulate",
      value: "The parallel postulate about interior angles summing to less than two right angles",
    },
    { key: "First axiom", value: "Things equal to the same thing are equal to one another" },
    { key: "Fourth axiom", value: "Things that coincide with one another are equal" },
    { key: "Fifth axiom", value: "The whole is greater than the part" },
    {
      key: "Euclid's Elements",
      value: "The thirteen-book work in which this geometry was organised",
    },
  ],
  hard: [
    {
      key: "Why the fifth postulate is special",
      value:
        "It is the only one not self-evident, and denying it gives valid non-Euclidean geometries",
    },
    {
      key: "Playfair's axiom",
      value: "Through a point not on a line, exactly one parallel to that line can be drawn",
    },
    { key: "Number of lines through two distinct points", value: "Exactly one" },
    { key: "Number of common points of two distinct lines", value: "At most one" },
    {
      key: "Difference between an axiom and a postulate in Euclid",
      value: "Axioms are common to all mathematics; postulates are assumed only for geometry",
    },
    {
      key: "Consequence of the fifth postulate",
      value: "The angles of a triangle add up to 180 degrees",
    },
  ],
});

chapter({
  id: "n9:math:lines-angles",
  subject: "Math Class 9",
  topic: "Lines and Angles",
  forward: "In lines and angles, what is %s?",
  reverse: "Which term or result is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Acute angle", value: "An angle less than 90 degrees" },
    { key: "Obtuse angle", value: "An angle between 90 and 180 degrees" },
    { key: "Reflex angle", value: "An angle between 180 and 360 degrees" },
    { key: "Complementary angles", value: "Two angles adding to 90 degrees" },
    { key: "Supplementary angles", value: "Two angles adding to 180 degrees" },
    { key: "Linear pair", value: "Two adjacent angles on a straight line, adding to 180 degrees" },
    {
      key: "Vertically opposite angles",
      value: "Angles opposite each other at an intersection, always equal",
    },
    { key: "Transversal", value: "A line cutting two or more lines at distinct points" },
    {
      key: "Corresponding angles",
      value: "Equal angles in matching positions when the lines are parallel",
    },
    {
      key: "Alternate interior angles",
      value: "Equal angles on opposite sides of the transversal between the parallel lines",
    },
    {
      key: "Co-interior angles",
      value:
        "Angles on the same side of the transversal, supplementary when the lines are parallel",
    },
    { key: "Angle sum of a triangle", value: "180 degrees" },
  ],
  hard: [
    {
      key: "Exterior angle theorem",
      value: "An exterior angle equals the sum of the two interior opposite angles",
    },
    { key: "Angle between the bisectors of a linear pair", value: "90 degrees" },
    { key: "Sum of all angles around a point", value: "360 degrees" },
    { key: "Angle whose supplement is four times itself", value: "36 degrees" },
    {
      key: "If two lines are each parallel to a third line",
      value: "They are parallel to one another",
    },
    { key: "Angle whose complement is one third of itself", value: "67.5 degrees" },
  ],
});

chapter({
  id: "n9:math:triangles",
  subject: "Math Class 9",
  topic: "Triangles",
  forward: "In triangles, what is %s?",
  reverse: "Which criterion or property is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "SSS congruence",
      value: "Three sides of one triangle equal to three sides of the other",
    },
    { key: "SAS congruence", value: "Two sides and the included angle equal" },
    { key: "ASA congruence", value: "Two angles and the included side equal" },
    { key: "AAS congruence", value: "Two angles and a non-included side equal" },
    { key: "RHS congruence", value: "In right triangles, the hypotenuse and one side equal" },
    { key: "Isosceles triangle property", value: "Angles opposite equal sides are equal" },
    { key: "Converse of the isosceles property", value: "Sides opposite equal angles are equal" },
    { key: "Equilateral triangle", value: "All three sides equal and each angle 60 degrees" },
    { key: "Triangle inequality", value: "The sum of any two sides is greater than the third" },
    { key: "Largest angle of a triangle", value: "The angle opposite the longest side" },
    { key: "Median", value: "A line from a vertex to the midpoint of the opposite side" },
    { key: "Altitude", value: "The perpendicular from a vertex to the opposite side" },
  ],
  hard: [
    {
      key: "Why AAA is not a congruence criterion",
      value: "Equal angles give similar triangles, which may differ in size",
    },
    {
      key: "Why SSA generally fails",
      value: "Two different triangles can share two sides and a non-included angle",
    },
    {
      key: "Point of concurrence of the medians",
      value: "The centroid, which divides each median in the ratio 2 to 1",
    },
    {
      key: "Point of concurrence of the perpendicular bisectors",
      value: "The circumcentre, equidistant from all three vertices",
    },
    {
      key: "Point of concurrence of the angle bisectors",
      value: "The incentre, equidistant from all three sides",
    },
    {
      key: "Possible third side when two sides are 7 and 10",
      value: "Any length strictly between 3 and 17",
    },
  ],
});

chapter({
  id: "n9:math:quadrilaterals",
  subject: "Math Class 9",
  topic: "Quadrilaterals",
  forward: "In quadrilaterals, what is %s?",
  reverse: "Which figure or property is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Angle sum of a quadrilateral", value: "360 degrees" },
    { key: "Parallelogram", value: "A quadrilateral with both pairs of opposite sides parallel" },
    { key: "Diagonals of a parallelogram", value: "They bisect each other" },
    {
      key: "Rectangle",
      value: "A parallelogram with one right angle, so all four are right angles",
    },
    { key: "Diagonals of a rectangle", value: "They are equal and bisect each other" },
    { key: "Rhombus", value: "A parallelogram with all sides equal" },
    { key: "Diagonals of a rhombus", value: "They bisect each other at right angles" },
    { key: "Square", value: "A quadrilateral that is both a rectangle and a rhombus" },
    { key: "Trapezium", value: "A quadrilateral with exactly one pair of parallel sides" },
    { key: "Kite", value: "A quadrilateral with two pairs of adjacent sides equal" },
    {
      key: "Midpoint theorem",
      value:
        "The segment joining midpoints of two sides is parallel to the third and half its length",
    },
    {
      key: "Converse of the midpoint theorem",
      value: "A line through one midpoint parallel to another side bisects the third side",
    },
  ],
  hard: [
    {
      key: "Figure formed by joining the midpoints of any quadrilateral",
      value: "Always a parallelogram",
    },
    { key: "Figure formed by joining the midpoints of a rectangle", value: "A rhombus" },
    { key: "Figure formed by joining the midpoints of a rhombus", value: "A rectangle" },
    { key: "Quadrilateral with equal diagonals bisecting at right angles", value: "A square" },
    {
      key: "Condition for a parallelogram to be a rectangle",
      value: "Its diagonals must be equal",
    },
    { key: "Angles of a parallelogram in the ratio 2 to 3", value: "72, 108, 72 and 108 degrees" },
  ],
});

chapter({
  id: "n9:math:circles",
  subject: "Math Class 9",
  topic: "Circles",
  forward: "Regarding circles, what is %s?",
  reverse: "Which term or theorem is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Chord", value: "A line segment joining two points on a circle" },
    { key: "Diameter", value: "The longest chord, passing through the centre" },
    { key: "Arc", value: "A part of the circumference of a circle" },
    { key: "Segment", value: "The region between a chord and its arc" },
    { key: "Sector", value: "The region between two radii and their arc" },
    { key: "Perpendicular from the centre to a chord", value: "It bisects the chord" },
    { key: "Equal chords of a circle", value: "They are equidistant from the centre" },
    {
      key: "Angle subtended at the centre by an arc",
      value: "Twice the angle it subtends anywhere on the remaining circle",
    },
    { key: "Angles in the same segment", value: "They are equal" },
    { key: "Angle in a semicircle", value: "A right angle" },
    { key: "Cyclic quadrilateral", value: "A quadrilateral whose four vertices lie on one circle" },
    { key: "Opposite angles of a cyclic quadrilateral", value: "They are supplementary" },
  ],
  hard: [
    { key: "Number of circles through three non-collinear points", value: "Exactly one" },
    {
      key: "Exterior angle of a cyclic quadrilateral",
      value: "Equal to the interior opposite angle",
    },
    { key: "Chord of length 8 in a circle of radius 5", value: "It lies 3 units from the centre" },
    {
      key: "Congruent circles with equal chords",
      value: "The chords subtend equal angles at the centres",
    },
    {
      key: "Why a parallelogram inscribed in a circle must be a rectangle",
      value: "Its opposite angles are both equal and supplementary, so each is 90 degrees",
    },
    { key: "Longer of two chords", value: "The one nearer to the centre" },
  ],
});

chapter({
  id: "n9:math:herons",
  subject: "Math Class 9",
  exams: CBSE9_ONLY,
  topic: "Heron's Formula",
  forward: "In Heron's formula, what is %s?",
  reverse: "Which formula or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Heron's formula", value: "Area equals root of s(s-a)(s-b)(s-c)" },
    { key: "Semi-perimeter", value: "Half the perimeter, written as s" },
    { key: "Area of a triangle by base and height", value: "Half times base times height" },
    { key: "Area of an equilateral triangle of side a", value: "Root 3 over 4 times a squared" },
    { key: "Area of a right triangle", value: "Half the product of the two legs" },
    { key: "Area of a 3, 4, 5 triangle", value: "6 square units" },
    { key: "Area of a triangle with sides 13, 14 and 15", value: "84 square units" },
    {
      key: "Use of Heron's formula",
      value: "Finding area when all three sides are known but no height is given",
    },
    {
      key: "Area of a quadrilateral by Heron",
      value: "Split it along a diagonal and add the two triangle areas",
    },
    { key: "Perimeter of an equilateral triangle of side a", value: "3a" },
    {
      key: "Area of an isosceles triangle with equal sides a and base b",
      value: "b over 4 times root of (4a squared minus b squared)",
    },
    { key: "Unit of area", value: "Square units, such as square centimetre" },
  ],
  hard: [
    {
      key: "Area of a triangle with sides 18, 24 and 30",
      value: "216 square units; it is a right triangle",
    },
    { key: "Height of an equilateral triangle of side 12", value: "6 root 3 units" },
    { key: "Effect of doubling every side on the area", value: "The area becomes four times" },
    { key: "Area of an equilateral triangle of perimeter 60", value: "100 root 3 square units" },
    {
      key: "Why s minus a must be positive",
      value: "Otherwise the triangle inequality fails and no such triangle exists",
    },
    {
      key: "Area of a rhombus by Heron",
      value: "Split along a diagonal into two congruent triangles and double one area",
    },
  ],
});

chapter({
  id: "n9:math:surface-volume",
  subject: "Math Class 9",
  topic: "Surface Areas and Volumes",
  forward: "In surface areas and volumes, what is %s?",
  reverse: "Which formula is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Volume of a cuboid", value: "Length times breadth times height" },
    { key: "Total surface area of a cuboid", value: "2(lb plus bh plus hl)" },
    { key: "Volume of a cube of edge a", value: "a cubed" },
    { key: "Total surface area of a cube", value: "6a squared" },
    { key: "Curved surface area of a cylinder", value: "2 pi r h" },
    { key: "Volume of a cylinder", value: "pi r squared h" },
    { key: "Curved surface area of a cone", value: "pi r l, where l is the slant height" },
    { key: "Volume of a cone", value: "One third pi r squared h" },
    { key: "Surface area of a sphere", value: "4 pi r squared" },
    { key: "Volume of a sphere", value: "Four thirds pi r cubed" },
    { key: "Curved surface area of a hemisphere", value: "2 pi r squared" },
    { key: "Volume of a hemisphere", value: "Two thirds pi r cubed" },
  ],
  hard: [
    { key: "Slant height of a cone", value: "Root of r squared plus h squared" },
    {
      key: "Total surface area of a hemisphere",
      value: "3 pi r squared, adding the flat circular face",
    },
    {
      key: "Ratio of volumes of a cone, hemisphere and cylinder of equal radius and height",
      value: "1 to 2 to 3",
    },
    {
      key: "Effect of doubling the radius of a sphere on volume",
      value: "The volume becomes eight times",
    },
    {
      key: "Cost of painting, in terms of the figure",
      value: "Proportional to the surface area, not the volume",
    },
    { key: "Number of small spheres of radius r from one of radius 2r", value: "Eight" },
  ],
});

chapter({
  id: "n9:math:statistics",
  subject: "Math Class 9",
  topic: "Statistics",
  forward: "In statistics, what is %s?",
  reverse: "Which measure or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Mean", value: "The sum of all observations divided by their number" },
    { key: "Median", value: "The middle value when the data is arranged in order" },
    { key: "Mode", value: "The observation that occurs most often" },
    { key: "Range", value: "The difference between the largest and smallest observation" },
    { key: "Class interval", value: "The width of a group in a frequency distribution" },
    { key: "Frequency", value: "The number of times an observation occurs" },
    { key: "Class mark", value: "The midpoint of a class interval" },
    { key: "Primary data", value: "Data collected by the investigator directly" },
    { key: "Secondary data", value: "Data taken from a source where it was already collected" },
    {
      key: "Histogram",
      value: "A bar graph for continuous grouped data, with no gaps between bars",
    },
    {
      key: "Frequency polygon",
      value: "A line graph joining the midpoints of the tops of histogram bars",
    },
    { key: "Median of an even number of observations", value: "The mean of the two middle values" },
  ],
  hard: [
    {
      key: "Effect of adding a constant to every observation",
      value: "The mean increases by that constant; the range stays the same",
    },
    { key: "Effect of multiplying every observation by k", value: "The mean is multiplied by k" },
    { key: "Mean of the first n natural numbers", value: "(n plus 1) divided by 2" },
    {
      key: "Why the mean is sensitive to outliers",
      value: "Every value enters the sum, so one extreme value shifts it",
    },
    {
      key: "Best measure for heavily skewed data",
      value: "The median, since it depends only on position",
    },
    { key: "Sum of deviations from the mean", value: "Always zero" },
  ],
});

export const NCERT9_TEMPLATES = templates;
