/**
 * NCERT / CBSE / ICSE Class 10 — full syllabus coverage.
 *
 * Class 10 Science had five of its thirteen chapters and Class 10 Maths had
 * exactly one of fourteen. Every remaining chapter of the current NCERT
 * syllabus is added here, and the chapters dropped by the 2023
 * rationalisation are kept on an old-syllabus track because state boards and
 * entrance foundations still set them.
 *
 * Each chapter carries a working fact table and a higher-order fact table.
 * The shared question builders calibrate direct recall as Easy, pair matching
 * and two-statement items as Moderate, and three-statement items as Difficult;
 * recall from the higher-order table is Moderate. This yields meaningful
 * difficulty tiers without changing syllabus coverage or duplicating questions.
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

const C10 = ["CBSE Class 10", "ICSE Class 10", "CBSE Class 9-10", "ICSE Class 9-10"];
const C10_OLD = [...C10, "State Board MCQ", "NTSE/Olympiad"];

/**
 * ICSE Class 10 Maths sets GST, banking, shares, matrices and loci instead of
 * several NCERT chapters, so NCERT-only chapters are tagged to CBSE alone.
 * The ICSE-only chapters live in icse-maths.ts.
 */
const CBSE10_ONLY = ["CBSE Class 10", "CBSE Class 9-10"];

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
  const base = { subject: opts.subject, topic: opts.topic, exams: opts.exams ?? C10 };
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

/* ======================================================== Science Class 10 */

chapter({
  id: "n10:sci:metals",
  subject: "Science Class 10",
  topic: "Metals and Non-metals",
  forward: "In metals and non-metals, what is %s?",
  reverse: "Which term or property is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Malleability", value: "The property of being hammered into thin sheets" },
    { key: "Ductility", value: "The property of being drawn into wires" },
    { key: "Most ductile metal", value: "Gold" },
    { key: "Best conductor of heat and electricity", value: "Silver" },
    { key: "Only liquid metal at room temperature", value: "Mercury" },
    {
      key: "Amphoteric oxide",
      value: "An oxide reacting with both acids and bases, such as aluminium oxide",
    },
    {
      key: "Ionic bond",
      value: "A bond formed by transfer of electrons from a metal to a non-metal",
    },
    { key: "Reactivity series", value: "Metals arranged in decreasing order of reactivity" },
    { key: "Roasting", value: "Heating a sulphide ore strongly in excess air" },
    { key: "Calcination", value: "Heating a carbonate ore in limited air to give the oxide" },
    { key: "Corrosion", value: "The gradual eating away of a metal by air and moisture" },
    { key: "Galvanisation", value: "Coating iron with a layer of zinc to prevent rusting" },
  ],
  hard: [
    {
      key: "Thermite reaction",
      value: "Aluminium reduces iron oxide with enough heat to weld rails",
    },
    {
      key: "Aqua regia",
      value: "Three parts concentrated HCl to one part concentrated HNO3, which dissolves gold",
    },
    {
      key: "Why sodium is stored in kerosene",
      value: "It reacts violently with air and moisture and can catch fire",
    },
    {
      key: "Metal extracted by electrolysis",
      value: "Highly reactive metals such as sodium, magnesium and aluminium",
    },
    {
      key: "Why zinc protects iron even when scratched",
      value: "Zinc is more reactive, so it corrodes sacrificially instead of the iron",
    },
    {
      key: "Non-metal that conducts electricity",
      value: "Graphite, because of its free delocalised electrons",
    },
  ],
});

chapter({
  id: "n10:sci:carbon",
  subject: "Science Class 10",
  topic: "Carbon and its Compounds",
  forward: "In carbon and its compounds, what is %s?",
  reverse: "Which term or compound is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Catenation",
      value: "The ability of carbon to link with itself in long chains and rings",
    },
    { key: "Tetravalency", value: "Carbon's capacity to form four covalent bonds" },
    { key: "Covalent bond", value: "A bond formed by sharing of electron pairs" },
    {
      key: "Saturated hydrocarbon",
      value: "A compound with only single carbon to carbon bonds, an alkane",
    },
    {
      key: "Unsaturated hydrocarbon",
      value: "A compound with a double or triple bond, an alkene or alkyne",
    },
    {
      key: "Homologous series",
      value: "Compounds with the same functional group differing by CH2",
    },
    { key: "Functional group of an alcohol", value: "The hydroxyl group, OH" },
    { key: "Functional group of a carboxylic acid", value: "COOH" },
    {
      key: "Esterification",
      value: "Reaction of an alcohol with a carboxylic acid to give a sweet-smelling ester",
    },
    { key: "Saponification", value: "Hydrolysis of an ester with alkali to give soap" },
    {
      key: "Micelle",
      value: "The spherical cluster soap forms in water, trapping oily dirt inside",
    },
    {
      key: "Denatured alcohol",
      value: "Ethanol made unfit to drink by adding poisonous substances",
    },
  ],
  hard: [
    {
      key: "Why a candle sometimes burns with a sooty flame",
      value: "Incomplete combustion of unsaturated compounds leaves unburnt carbon",
    },
    {
      key: "Test for unsaturation",
      value: "Bromine water is decolourised by an alkene or alkyne but not by an alkane",
    },
    {
      key: "Why soap fails in hard water",
      value: "Calcium and magnesium ions form an insoluble scum instead of lather",
    },
    { key: "Number of structural isomers of butane", value: "Two, n-butane and isobutane" },
    {
      key: "Product of ethanol with hot concentrated sulphuric acid",
      value: "Ethene, by dehydration at about 443 kelvin",
    },
    {
      key: "Why detergents work in hard water",
      value: "Their calcium and magnesium salts remain soluble, so lather still forms",
    },
  ],
});

chapter({
  id: "n10:sci:control",
  subject: "Science Class 10",
  topic: "Control and Coordination",
  forward: "In control and coordination, what is %s?",
  reverse: "Which part or hormone is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Neuron", value: "The unit of the nervous system, carrying electrical impulses" },
    {
      key: "Synapse",
      value: "The gap between two neurons across which chemicals carry the signal",
    },
    {
      key: "Reflex arc",
      value: "The short pathway through the spinal cord that gives an automatic response",
    },
    { key: "Cerebrum", value: "The seat of thinking, memory and voluntary action" },
    { key: "Cerebellum", value: "The part controlling posture, balance and precision of movement" },
    {
      key: "Medulla",
      value: "The part controlling involuntary actions such as heartbeat and breathing",
    },
    { key: "Phototropism", value: "Growth of a plant part towards or away from light" },
    { key: "Geotropism", value: "Growth in response to gravity" },
    { key: "Auxin", value: "The plant hormone promoting cell elongation at shoot tips" },
    { key: "Abscisic acid", value: "The plant hormone that inhibits growth and causes wilting" },
    { key: "Thyroxine", value: "The thyroid hormone regulating metabolism, needing iodine" },
    { key: "Insulin", value: "The pancreatic hormone that lowers blood glucose" },
  ],
  hard: [
    {
      key: "Why reflex actions bypass the brain",
      value: "The spinal cord completes the arc, which is far faster than conscious processing",
    },
    { key: "Hormone released in an emergency", value: "Adrenaline, from the adrenal glands" },
    { key: "Cause of dwarfism", value: "Deficiency of growth hormone in childhood" },
    { key: "Cause of goitre", value: "Iodine deficiency, which prevents thyroxine synthesis" },
    {
      key: "Why nervous control cannot reach every cell",
      value:
        "Nerve cells do not innervate all tissues, so hormones carry chemical messages through blood",
    },
    {
      key: "Movement in the touch-me-not plant",
      value: "A nastic movement from water loss in cells, not growth and not directional",
    },
  ],
});

chapter({
  id: "n10:sci:reproduction",
  subject: "Science Class 10",
  topic: "How do Organisms Reproduce",
  forward: "In reproduction, what is %s?",
  reverse: "Which process or part is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Binary fission", value: "One cell splitting into two, as in amoeba" },
    { key: "Multiple fission", value: "One cell splitting into many, as in plasmodium" },
    { key: "Budding", value: "A new individual growing as an outgrowth, as in hydra and yeast" },
    {
      key: "Fragmentation",
      value: "Breaking into pieces that each grow into a new organism, as in spirogyra",
    },
    { key: "Regeneration", value: "Rebuilding a whole organism from a body part, as in planaria" },
    {
      key: "Vegetative propagation",
      value: "New plants from roots, stems or leaves without seeds",
    },
    { key: "Pollination", value: "Transfer of pollen from anther to stigma" },
    { key: "Fertilisation", value: "Fusion of the male and female gametes to form a zygote" },
    { key: "Stamen", value: "The male reproductive part, the anther and filament" },
    { key: "Pistil", value: "The female reproductive part, the stigma, style and ovary" },
    {
      key: "Placenta",
      value: "The disc that exchanges nutrients and waste between mother and embryo",
    },
    { key: "Puberty", value: "The stage at which reproductive organs mature" },
  ],
  hard: [
    {
      key: "Why variation is greater in sexual reproduction",
      value: "Two different genomes combine and crossing over reshuffles genes",
    },
    {
      key: "Advantage of vegetative propagation",
      value: "The new plant is genetically identical and flowers earlier",
    },
    {
      key: "Function of the seminal vesicle and prostate",
      value: "They add fluid that nourishes the sperm and eases its transport",
    },
    {
      key: "What happens to the uterine lining if no fertilisation occurs",
      value: "It breaks down and is shed as menstruation",
    },
    {
      key: "Barrier method of contraception",
      value: "Condoms and diaphragms, which also reduce the spread of infection",
    },
    {
      key: "Why tissue culture is used commercially",
      value: "Thousands of identical disease-free plants can be raised from a small tissue sample",
    },
  ],
});

chapter({
  id: "n10:sci:heredity",
  subject: "Science Class 10",
  topic: "Heredity",
  forward: "In heredity, what is %s?",
  reverse: "Which term or result is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Heredity", value: "The passing of traits from parents to offspring" },
    { key: "Gene", value: "The unit of inheritance, a segment of DNA coding for a trait" },
    { key: "Allele", value: "One of the alternative forms of a gene" },
    { key: "Dominant trait", value: "The trait that appears in the F1 generation" },
    { key: "Recessive trait", value: "The trait masked in F1 and reappearing in F2" },
    { key: "Genotype", value: "The genetic make-up of an organism" },
    { key: "Phenotype", value: "The observable appearance of an organism" },
    { key: "Homozygous", value: "Carrying two identical alleles of a gene" },
    { key: "Heterozygous", value: "Carrying two different alleles of a gene" },
    { key: "Monohybrid F2 ratio", value: "3 to 1 by phenotype" },
    { key: "Dihybrid F2 ratio", value: "9 to 3 to 3 to 1" },
    { key: "Sex chromosomes in humans", value: "XX in females and XY in males" },
  ],
  hard: [
    { key: "Genotypic ratio of a monohybrid cross in F2", value: "1 to 2 to 1" },
    {
      key: "Who determines the sex of a child",
      value: "The father, since only he produces both X and Y gametes",
    },
    {
      key: "Mendel's law of independent assortment",
      value: "Alleles of different genes separate independently during gamete formation",
    },
    {
      key: "Why acquired traits are not inherited",
      value: "They do not change the DNA of the germ cells",
    },
    {
      key: "Result of a test cross with a heterozygote",
      value: "A 1 to 1 ratio of dominant to recessive offspring",
    },
    { key: "Number of chromosomes in a human gamete", value: "23, half the diploid number of 46" },
  ],
});

chapter({
  id: "n10:sci:human-eye",
  subject: "Science Class 10",
  topic: "The Human Eye and the Colourful World",
  forward: "In the human eye and the colourful world, what is %s?",
  reverse: "Which part or phenomenon is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Cornea", value: "The transparent front layer where most refraction occurs" },
    { key: "Iris", value: "The coloured muscular diaphragm that controls the pupil size" },
    { key: "Pupil", value: "The opening that regulates how much light enters" },
    { key: "Retina", value: "The light-sensitive screen where a real inverted image forms" },
    { key: "Accommodation", value: "The ability of the eye lens to change its focal length" },
    { key: "Least distance of distinct vision", value: "About 25 cm for a normal adult eye" },
    { key: "Myopia", value: "Near-sightedness, corrected with a concave lens" },
    { key: "Hypermetropia", value: "Far-sightedness, corrected with a convex lens" },
    { key: "Presbyopia", value: "Age-related loss of accommodation, corrected with bifocals" },
    { key: "Dispersion", value: "Splitting of white light into its component colours by a prism" },
    {
      key: "Scattering of light",
      value: "Redirection of light by fine particles, which makes the sky blue",
    },
    { key: "Tyndall effect", value: "The visible path of a light beam through a colloid" },
  ],
  hard: [
    {
      key: "Why the sun looks reddish at sunrise and sunset",
      value: "Light travels a longer path, so blue is scattered away and red reaches the eye",
    },
    {
      key: "Why stars twinkle but planets do not",
      value:
        "Stars are point sources, so atmospheric refraction fluctuates; planets are extended sources that average out",
    },
    {
      key: "Why the sun is visible before actual sunrise",
      value: "Atmospheric refraction bends its light, advancing sunrise by about two minutes",
    },
    {
      key: "Colour deviated most by a prism",
      value: "Violet, because it has the shortest wavelength",
    },
    { key: "Power of a lens for a myopic far point of 2 m", value: "Minus 0.5 dioptre" },
    {
      key: "Why the sky is dark to an astronaut",
      value: "There is no atmosphere in space to scatter sunlight",
    },
  ],
});

chapter({
  id: "n10:sci:magnetic-effects",
  subject: "Science Class 10",
  topic: "Magnetic Effects of Electric Current",
  forward: "In magnetic effects of electric current, what is %s?",
  reverse: "Which rule or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Magnetic field", value: "The region around a magnet where its force can be felt" },
    {
      key: "Magnetic field lines",
      value: "Curves showing field direction, running north to south outside a magnet",
    },
    {
      key: "Right hand thumb rule",
      value: "Thumb along the current gives the field direction by the curled fingers",
    },
    {
      key: "Solenoid",
      value: "A coil of many circular turns acting like a bar magnet when carrying current",
    },
    {
      key: "Electromagnet",
      value: "A soft iron core inside a solenoid, magnetised only while current flows",
    },
    {
      key: "Fleming's left hand rule",
      value: "Gives the direction of force on a current-carrying conductor in a field",
    },
    {
      key: "Fleming's right hand rule",
      value: "Gives the direction of induced current in a moving conductor",
    },
    {
      key: "Electric motor",
      value: "A device converting electrical energy into mechanical energy",
    },
    {
      key: "Electric generator",
      value: "A device converting mechanical energy into electrical energy",
    },
    {
      key: "Electromagnetic induction",
      value: "Production of current by a changing magnetic field",
    },
    { key: "Live wire colour in Indian wiring", value: "Red or brown" },
    {
      key: "Earth wire",
      value: "The green wire connecting the metal body to the ground for safety",
    },
  ],
  hard: [
    {
      key: "Why field lines never intersect",
      value: "Two directions of the field at one point is impossible",
    },
    {
      key: "Frequency of Indian AC supply",
      value: "50 hertz, so the current reverses direction 100 times a second",
    },
    {
      key: "Function of the split ring in a motor",
      value: "It reverses the current every half turn so rotation continues in one direction",
    },
    {
      key: "Cause of a short circuit",
      value: "Live and neutral wires touching directly, giving a sudden very large current",
    },
    {
      key: "Why an overloaded circuit is dangerous",
      value: "Excess current heats the wiring and can start a fire, which the fuse prevents",
    },
    {
      key: "Field inside a long current-carrying solenoid",
      value: "Uniform and parallel to the axis throughout",
    },
  ],
});

chapter({
  id: "n10:sci:environment",
  subject: "Science Class 10",
  topic: "Our Environment",
  forward: "In our environment, what is %s?",
  reverse: "Which term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Ecosystem",
      value: "All the organisms of an area together with their physical surroundings",
    },
    { key: "Producer", value: "An organism making its own food by photosynthesis" },
    { key: "Herbivore", value: "A first-order consumer that eats plants" },
    { key: "Carnivore", value: "A consumer that eats other animals" },
    { key: "Decomposer", value: "An organism breaking down dead matter into simple substances" },
    { key: "Food chain", value: "A series of organisms each eating the previous one" },
    { key: "Trophic level", value: "A step in the food chain" },
    {
      key: "Ten percent law",
      value: "Only about ten percent of energy passes to the next trophic level",
    },
    {
      key: "Biomagnification",
      value: "Increasing concentration of a harmful chemical up the food chain",
    },
    {
      key: "Biodegradable waste",
      value: "Waste broken down by microorganisms, such as paper and food scraps",
    },
    {
      key: "Non-biodegradable waste",
      value: "Waste microorganisms cannot break down, such as plastic and glass",
    },
    { key: "Ozone depletion", value: "Thinning of the ozone layer, mainly by chlorofluorocarbons" },
  ],
  hard: [
    {
      key: "Why food chains rarely exceed four levels",
      value: "Only ten percent of energy transfers each step, so little is left beyond the fourth",
    },
    {
      key: "Why energy flow is one way",
      value: "Energy lost as heat at each level cannot return to the previous level",
    },
    {
      key: "Why humans often carry the highest pesticide load",
      value: "We eat at several trophic levels, so biomagnified chemicals accumulate in us",
    },
    {
      key: "Effect of removing all decomposers",
      value: "Nutrients would stay locked in dead matter and cycling would stop",
    },
    {
      key: "Montreal Protocol",
      value: "The 1987 agreement that froze and then cut CFC production",
    },
    {
      key: "Difference between a food chain and a food web",
      value: "A web is many interlinked chains, which makes an ecosystem far more stable",
    },
  ],
});

/* -- old-syllabus chapters still set by state boards and entrance foundations */

chapter({
  id: "n10:sci:periodic",
  subject: "Science Class 10",
  topic: "Periodic Classification of Elements (old NCERT)",
  exams: C10_OLD,
  forward: "In periodic classification, what is %s?",
  reverse: "Which law or trend is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Dobereiner's triads",
      value: "Groups of three elements where the middle atomic mass is the mean of the other two",
    },
    {
      key: "Newlands' law of octaves",
      value: "Every eighth element repeats properties, like musical notes",
    },
    {
      key: "Mendeleev's periodic law",
      value: "Properties of elements are a periodic function of their atomic masses",
    },
    { key: "Modern periodic law", value: "Properties are a periodic function of atomic number" },
    { key: "Number of groups in the modern table", value: "18" },
    { key: "Number of periods in the modern table", value: "7" },
    { key: "Group 1 elements", value: "The alkali metals" },
    { key: "Group 17 elements", value: "The halogens" },
    { key: "Group 18 elements", value: "The noble gases" },
    { key: "Trend of atomic size across a period", value: "It decreases from left to right" },
    { key: "Trend of metallic character down a group", value: "It increases" },
    { key: "Valency in a period", value: "It first increases to four and then decreases to zero" },
  ],
  hard: [
    {
      key: "Why atomic size decreases across a period",
      value: "Nuclear charge rises while electrons enter the same shell, pulling them closer",
    },
    {
      key: "Why Mendeleev left gaps",
      value: "He predicted undiscovered elements such as eka-silicon, later found as germanium",
    },
    {
      key: "Why isotopes posed a problem for Mendeleev",
      value: "They have different atomic masses but must occupy the same position",
    },
    {
      key: "Position of hydrogen",
      value: "Anomalous, since it resembles both alkali metals and halogens",
    },
    { key: "Most electronegative element", value: "Fluorine" },
    {
      key: "Why noble gases are in a separate group",
      value: "Their complete outermost shell makes them inert and unlike any other group",
    },
  ],
});

chapter({
  id: "n10:sci:energy-sources",
  subject: "Science Class 10",
  topic: "Sources of Energy (old NCERT)",
  exams: C10_OLD,
  forward: "In sources of energy, what is %s?",
  reverse: "Which source or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Fossil fuel",
      value: "A non-renewable fuel formed from buried organic remains, such as coal and petroleum",
    },
    {
      key: "Renewable source",
      value: "A source replenished naturally, such as solar or wind energy",
    },
    {
      key: "Solar cooker",
      value: "A blackened insulated box with a glass sheet that traps infrared radiation",
    },
    {
      key: "Solar cell",
      value: "A device converting sunlight directly into electricity, usually from silicon",
    },
    {
      key: "Biogas",
      value: "A mixture rich in methane produced by anaerobic decomposition of waste",
    },
    { key: "Hydropower", value: "Electricity from falling water turning a turbine" },
    { key: "Wind energy", value: "Electricity from moving air turning the blades of a windmill" },
    { key: "Geothermal energy", value: "Energy from heat stored in the Earth's interior" },
    {
      key: "Nuclear fission",
      value: "Splitting of a heavy nucleus such as uranium, releasing large energy",
    },
    { key: "Nuclear fusion", value: "Joining of light nuclei, the process powering the sun" },
    { key: "Tidal energy", value: "Energy harnessed from the rise and fall of sea levels" },
    {
      key: "OTEC",
      value:
        "Ocean thermal energy conversion, using the temperature difference between surface and deep water",
    },
  ],
  hard: [
    { key: "Minimum wind speed for a useful windmill", value: "About 15 kilometre per hour" },
    {
      key: "Why biogas is a superior fuel to dung cakes",
      value: "It burns without smoke, leaves no residue and the slurry remains a good manure",
    },
    {
      key: "Main problem with nuclear energy",
      value: "Safe disposal of long-lived radioactive waste and the risk of leakage",
    },
    {
      key: "Why solar cells remain expensive",
      value: "Very pure silicon and silver interconnections raise the manufacturing cost",
    },
    {
      key: "Environmental cost of large dams",
      value: "Submergence of land and forests, and displacement of local communities",
    },
    {
      key: "Why hydrogen is an attractive fuel",
      value: "It has very high calorific value and its combustion gives only water",
    },
  ],
});

chapter({
  id: "n10:sci:natural-resource-mgmt",
  subject: "Science Class 10",
  topic: "Management of Natural Resources (old NCERT)",
  exams: C10_OLD,
  forward: "In management of natural resources, what is %s?",
  reverse: "Which term or movement is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Sustainable development",
      value:
        "Meeting present needs without harming the ability of future generations to meet theirs",
    },
    { key: "The three R's", value: "Reduce, reuse and recycle" },
    {
      key: "Chipko movement",
      value: "The Garhwal protest in which villagers hugged trees to stop felling",
    },
    {
      key: "Stakeholders in forest management",
      value: "Local people, the forest department, industry and conservationists",
    },
    { key: "Khadin", value: "A traditional water harvesting structure of Rajasthan" },
    { key: "Kulh", value: "A traditional canal irrigation system of Himachal Pradesh" },
    {
      key: "Watershed management",
      value: "Scientific conservation of soil and water to increase production",
    },
    {
      key: "Ganga Action Plan",
      value: "A multi-crore project launched in 1985 to clean the Ganga",
    },
    {
      key: "Coliform bacteria",
      value:
        "A group of bacteria in human intestines whose presence indicates sewage contamination",
    },
    {
      key: "Advantage of groundwater over surface storage",
      value: "It does not evaporate and does not breed mosquitoes",
    },
    { key: "Fossil fuel formed from buried vegetation", value: "Coal" },
    {
      key: "Main aim of dam construction",
      value: "Irrigation, electricity generation and drinking water supply",
    },
  ],
  hard: [
    {
      key: "Why local people manage forests better",
      value:
        "They depend on the forest long term, so they harvest sustainably rather than clear-fell",
    },
    {
      key: "Why monoculture plantations harm biodiversity",
      value: "A single species replaces a varied habitat and the dependent food webs collapse",
    },
    {
      key: "Main argument against large dams",
      value: "Social displacement, economic cost and ecological damage often outweigh the benefit",
    },
    {
      key: "Why reduce ranks first among the three R's",
      value: "Not consuming a resource saves all the energy that reuse and recycling still need",
    },
    {
      key: "Objection to recycling in practice",
      value: "Recycling itself consumes energy, so reusing an item without reprocessing is better",
    },
    {
      key: "Amrita Devi Bishnoi",
      value: "She led villagers who gave their lives protecting khejri trees in Rajasthan in 1731",
    },
  ],
});

// Preserve the legacy Class 10 chapters in a simple review tier as well as
// their existing Moderate and Difficult question families above.
templates.push(
  literalTemplate({
    id: "n10:sci:periodic:old-easy-review",
    subject: "Science Class 10",
    topic: "Periodic Classification of Elements (old NCERT)",
    difficulty: "Easy",
    exams: C10_OLD,
    items: [
      {
        prompt: "The modern periodic law relates element properties to which quantity?",
        answer: "Atomic number",
        distractors: ["Atomic mass", "Number of neutrons", "Density"],
        explanation:
          "In the modern periodic table, properties recur periodically with atomic number.",
      },
      {
        prompt: "How many groups are present in the modern periodic table?",
        answer: "18",
        distractors: ["7", "8", "16"],
        explanation:
          "The modern periodic table has 18 vertical groups and seven horizontal periods.",
      },
      {
        prompt: "What generally happens to atomic size from left to right across a period?",
        answer: "It decreases",
        distractors: ["It increases", "It stays exactly constant", "It first falls then doubles"],
        explanation:
          "Across a period, increasing nuclear charge pulls electrons in the same shell closer.",
      },
    ],
  }),
  literalTemplate({
    id: "n10:sci:energy-sources:old-easy-review",
    subject: "Science Class 10",
    topic: "Sources of Energy (old NCERT)",
    difficulty: "Easy",
    exams: C10_OLD,
    items: [
      {
        prompt: "Which process releases energy by joining light atomic nuclei?",
        answer: "Nuclear fusion",
        distractors: ["Nuclear fission", "Combustion", "Radioactive decay only"],
        explanation: "Nuclear fusion joins light nuclei and is the main process powering the Sun.",
      },
      {
        prompt: "Which gas forms the largest part of ordinary biogas?",
        answer: "Methane",
        distractors: ["Oxygen", "Nitrogen", "Chlorine"],
        explanation: "Biogas is produced by anaerobic decomposition and is rich in methane.",
      },
      {
        prompt: "A solar cell directly converts sunlight into what?",
        answer: "Electricity",
        distractors: ["Thermal energy", "Mechanical energy", "Sound energy"],
        explanation:
          "A photovoltaic solar cell converts light energy directly into electrical energy.",
      },
    ],
  }),
  literalTemplate({
    id: "n10:sci:natural-resource-mgmt:old-easy-review",
    subject: "Science Class 10",
    topic: "Management of Natural Resources (old NCERT)",
    difficulty: "Easy",
    exams: C10_OLD,
    items: [
      {
        prompt: "What are the three R's used in resource conservation?",
        answer: "Reduce, reuse and recycle",
        distractors: [
          "Repair, replace and remove",
          "Recover, release and return",
          "Reuse, refill and refuse",
        ],
        explanation:
          "Reducing use, reusing products and recycling materials help conserve resources.",
      },
      {
        prompt: "Which movement involved villagers hugging trees to prevent their felling?",
        answer: "The Chipko movement",
        distractors: [
          "The Swadeshi movement",
          "The Bhoodan movement",
          "The Narmada Bachao Andolan",
        ],
        explanation:
          "In the Chipko movement, villagers embraced trees to oppose commercial felling.",
      },
      {
        prompt: "A khadin is a traditional structure used mainly for what purpose?",
        answer: "Harvesting and storing rainwater in Rajasthan",
        distractors: ["Generating tidal electricity", "Measuring forest cover", "Producing biogas"],
        explanation:
          "A khadin is a traditional runoff-harvesting system used in arid parts of Rajasthan.",
      },
    ],
  }),
);

/* =========================================================== Maths Class 10 */

chapter({
  id: "n10:math:real-numbers",
  subject: "Math Class 10",
  exams: CBSE10_ONLY,
  topic: "Real Numbers",
  forward: "In real numbers, what is %s?",
  reverse: "Which result or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Fundamental theorem of arithmetic",
      value: "Every composite number factorises into primes uniquely, apart from order",
    },
    {
      key: "Euclid's division lemma",
      value:
        "For integers a and b with b positive, a equals bq plus r with r from 0 up to b minus 1",
    },
    { key: "HCF times LCM of two numbers", value: "Equal to the product of the two numbers" },
    {
      key: "HCF of 6 and 20",
      value: "2",
      note: "Since 6 = 2 × 3 and 20 = 2² × 5, their greatest common factor is 2.",
    },
    {
      key: "LCM of 6 and 20",
      value: "60",
      note: "Taking the highest prime powers gives 2² × 3 × 5 = 60, the least common multiple.",
    },
    { key: "Irrational number", value: "A real number that cannot be written as p over q" },
    { key: "Root 2", value: "Irrational, proved by contradiction" },
    {
      key: "Terminating decimal condition",
      value: "The denominator in lowest terms must be 2 to the m times 5 to the n",
    },
    { key: "Prime factorisation of 156", value: "2 squared times 3 times 13" },
    { key: "Co-prime numbers", value: "Numbers whose HCF is 1" },
    { key: "Smallest composite number", value: "4" },
    { key: "Smallest prime number", value: "2, the only even prime" },
  ],
  hard: [
    {
      key: "Why the product of HCF and LCM rule fails for three numbers",
      value: "The relation holds only for two numbers; for three it is not generally true",
    },
    {
      key: "Decimal nature of 13 over 3125",
      value: "Terminating, since 3125 is 5 to the fifth power",
    },
    {
      key: "Largest number dividing 70 and 125 leaving remainders 5 and 8",
      value: "13, the HCF of 65 and 117",
    },
    {
      key: "Why root 2 plus root 3 is irrational",
      value: "Assuming it rational and squaring forces root 6 to be rational, which is false",
    },
    {
      key: "Unit digit of 6 to the power n",
      value: "Always 6, so 6 to the n can never end in zero",
    },
    {
      key: "Least number divisible by all of 1 to 10",
      value: "2520, the LCM of those ten numbers",
    },
  ],
});

chapter({
  id: "n10:math:polynomials",
  subject: "Math Class 10",
  exams: CBSE10_ONLY,
  topic: "Polynomials",
  forward: "In polynomials, what is %s?",
  reverse: "Which term or relation is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Degree of a polynomial", value: "The highest power of the variable" },
    { key: "Linear polynomial", value: "A polynomial of degree one" },
    { key: "Quadratic polynomial", value: "A polynomial of degree two" },
    { key: "Cubic polynomial", value: "A polynomial of degree three" },
    { key: "Zero of a polynomial", value: "A value of x for which the polynomial equals zero" },
    { key: "Number of zeroes of a quadratic", value: "At most two" },
    { key: "Sum of zeroes of ax squared plus bx plus c", value: "Minus b over a" },
    { key: "Product of zeroes of ax squared plus bx plus c", value: "c over a" },
    {
      key: "Geometrical meaning of a zero",
      value: "The x coordinate where the graph meets the x axis",
    },
    { key: "Graph of a quadratic polynomial", value: "A parabola" },
    {
      key: "Division algorithm for polynomials",
      value: "p(x) equals g(x) q(x) plus r(x), with degree of r less than degree of g",
    },
    { key: "Quadratic with given zeroes", value: "x squared minus (sum) x plus (product)" },
  ],
  hard: [
    {
      key: "Sum of zeroes of a cubic ax cubed plus bx squared plus cx plus d",
      value: "Minus b over a",
    },
    { key: "Product of zeroes of that cubic", value: "Minus d over a" },
    { key: "Sum of products of zeroes taken two at a time in a cubic", value: "c over a" },
    { key: "Condition for the zeroes of a quadratic to be reciprocals", value: "a must equal c" },
    {
      key: "Condition for the zeroes to be equal in magnitude and opposite in sign",
      value: "b must be zero",
    },
    {
      key: "Quadratic whose zeroes are 2 plus root 3 and 2 minus root 3",
      value: "x squared minus 4x plus 1",
    },
  ],
});

chapter({
  id: "n10:math:linear-pair",
  subject: "Math Class 10",
  exams: CBSE10_ONLY,
  topic: "Pair of Linear Equations in Two Variables",
  forward: "In a pair of linear equations, what is %s?",
  reverse: "Which condition or method is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Consistent pair", value: "A pair having at least one solution" },
    { key: "Inconsistent pair", value: "A pair having no solution" },
    { key: "Dependent pair", value: "A pair with infinitely many solutions, the same line twice" },
    { key: "Condition for a unique solution", value: "a1 over a2 is not equal to b1 over b2" },
    { key: "Condition for no solution", value: "a1 over a2 equals b1 over b2 but not c1 over c2" },
    {
      key: "Condition for infinitely many solutions",
      value: "a1 over a2 equals b1 over b2 equals c1 over c2",
    },
    { key: "Graph of an inconsistent pair", value: "Two parallel lines" },
    { key: "Graph of a unique solution", value: "Two intersecting lines" },
    {
      key: "Substitution method",
      value: "Express one variable from one equation and substitute into the other",
    },
    { key: "Elimination method", value: "Add or subtract the equations to remove one variable" },
    {
      key: "Cross multiplication method",
      value: "Solving using the ratios of coefficients in a fixed pattern",
    },
    { key: "Number of solutions of two coincident lines", value: "Infinitely many" },
  ],
  hard: [
    {
      key: "Value of k for which kx plus 3y equals 7 and 2x minus y equals 5 have a unique solution",
      value: "Any k other than minus 6",
    },
    {
      key: "Why a consistent dependent pair is still one line",
      value: "The second equation is a multiple of the first, so both graph the same line",
    },
    {
      key: "Equations x plus 2y equals 5 and 3x plus 6y equals 15",
      value: "Dependent, with infinitely many solutions",
    },
    {
      key: "Equations 2x plus 3y equals 7 and 4x plus 6y equals 9",
      value: "Inconsistent, giving parallel lines",
    },
    {
      key: "Age problem pattern",
      value: "Present ages give one equation and a past or future condition gives the second",
    },
    {
      key: "Boat and stream pattern",
      value: "Downstream speed is u plus v and upstream speed is u minus v, giving two equations",
    },
  ],
});

chapter({
  id: "n10:math:quadratic",
  subject: "Math Class 10",
  topic: "Quadratic Equations",
  forward: "In quadratic equations, what is %s?",
  reverse: "Which formula or condition is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Standard form", value: "ax squared plus bx plus c equals 0 with a not zero" },
    { key: "Discriminant", value: "b squared minus 4ac" },
    {
      key: "Quadratic formula",
      value: "x equals minus b plus or minus root of the discriminant, all over 2a",
    },
    {
      key: "Condition for two distinct real roots",
      value: "The discriminant is greater than zero",
    },
    { key: "Condition for two equal real roots", value: "The discriminant equals zero" },
    { key: "Condition for no real roots", value: "The discriminant is less than zero" },
    { key: "Sum of the roots", value: "Minus b over a" },
    { key: "Product of the roots", value: "c over a" },
    {
      key: "Factorisation method",
      value: "Splitting the middle term so the expression factors into two brackets",
    },
    {
      key: "Completing the square",
      value: "Rewriting the equation as a perfect square plus a constant",
    },
    { key: "Roots of x squared minus 5x plus 6 equals 0", value: "2 and 3" },
    { key: "Maximum number of roots of a quadratic", value: "Two" },
  ],
  hard: [
    { key: "Value of k for which kx squared minus 4x plus 1 has equal roots", value: "4" },
    {
      key: "Nature of the roots of 2x squared minus 3x plus 5 equals 0",
      value: "No real roots, since the discriminant is minus 31",
    },
    {
      key: "Quadratic whose roots are the reciprocals of those of ax squared plus bx plus c",
      value: "cx squared plus bx plus a",
    },
    {
      key: "Why a negative root is rejected in a word problem",
      value: "Lengths, ages and counts cannot be negative in context",
    },
    {
      key: "Sum of a number and its reciprocal equal to 13 over 6",
      value: "The number is 2 or one half",
    },
    { key: "Condition for one root to be zero", value: "The constant term c must be zero" },
  ],
});

chapter({
  id: "n10:math:ap",
  subject: "Math Class 10",
  topic: "Arithmetic Progressions",
  forward: "In arithmetic progressions, what is %s?",
  reverse: "Which formula or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Arithmetic progression",
      value: "A sequence in which each term differs from the previous by a fixed amount",
    },
    { key: "Common difference", value: "The fixed gap d between consecutive terms" },
    { key: "nth term of an AP", value: "a plus (n minus 1) d" },
    { key: "Sum of the first n terms", value: "n over 2 times (2a plus (n minus 1) d)" },
    { key: "Sum when the last term is known", value: "n over 2 times (a plus l)" },
    { key: "Sum of the first n natural numbers", value: "n times (n plus 1) over 2" },
    { key: "Common difference of 3, 7, 11, 15", value: "4" },
    { key: "Tenth term of 2, 5, 8", value: "29" },
    { key: "AP with d equal to zero", value: "A constant sequence, all terms the same" },
    { key: "AP with negative d", value: "A decreasing sequence" },
    { key: "First term of an AP", value: "Denoted a, the starting value" },
    { key: "Number of terms from a to l", value: "(l minus a) over d, plus 1" },
  ],
  hard: [
    { key: "Which term of 3, 8, 13 is 78", value: "The sixteenth term" },
    { key: "Sum of the first 20 even natural numbers", value: "420" },
    { key: "Three numbers in AP with sum 3a", value: "Take them as a minus d, a and a plus d" },
    { key: "nth term from the end of an AP", value: "l minus (n minus 1) d" },
    {
      key: "Why the difference of successive sums gives a term",
      value: "S n minus S n minus 1 equals the nth term",
    },
    { key: "Number of three-digit numbers divisible by 7", value: "128" },
  ],
});

chapter({
  id: "n10:math:triangles",
  subject: "Math Class 10",
  topic: "Triangles and Similarity",
  forward: "In similarity of triangles, what is %s?",
  reverse: "Which criterion or theorem is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Similar triangles",
      value: "Triangles with equal corresponding angles and proportional corresponding sides",
    },
    {
      key: "Basic proportionality theorem",
      value: "A line parallel to one side divides the other two sides in the same ratio",
    },
    { key: "Thales theorem", value: "Another name for the basic proportionality theorem" },
    { key: "AAA similarity", value: "All three corresponding angles equal" },
    { key: "AA similarity", value: "Two corresponding angles equal, which forces the third" },
    { key: "SSS similarity", value: "All three pairs of corresponding sides in the same ratio" },
    {
      key: "SAS similarity",
      value: "Two pairs of sides proportional with the included angles equal",
    },
    {
      key: "Ratio of areas of similar triangles",
      value: "The square of the ratio of corresponding sides",
    },
    {
      key: "Pythagoras theorem",
      value:
        "In a right triangle the square on the hypotenuse equals the sum of the squares on the other two sides",
    },
    {
      key: "Converse of Pythagoras theorem",
      value:
        "If the square on one side equals the sum of the other two squares, the triangle is right angled",
    },
    { key: "Congruent triangles", value: "Similar triangles whose ratio of sides is exactly one" },
    { key: "Scale factor", value: "The common ratio of corresponding sides of similar figures" },
  ],
  hard: [
    {
      key: "Areas of two similar triangles in the ratio 9 to 16",
      value: "Their corresponding sides are in the ratio 3 to 4",
    },
    {
      key: "Why all squares are similar but not all rhombuses",
      value: "Squares have fixed angles; rhombuses share side ratios but can differ in angle",
    },
    {
      key: "Perpendicular from the right angle to the hypotenuse",
      value: "It creates two triangles each similar to the original and to each other",
    },
    {
      key: "Ratio of perimeters of similar triangles",
      value: "Equal to the ratio of corresponding sides",
    },
    {
      key: "Triangle with sides 7, 24 and 25",
      value: "Right angled, since 49 plus 576 equals 625",
    },
    {
      key: "Why AAA is enough for similarity but not congruence",
      value: "Equal angles fix the shape but leave the size free",
    },
  ],
});

chapter({
  id: "n10:math:coordinate",
  subject: "Math Class 10",
  topic: "Coordinate Geometry",
  forward: "In coordinate geometry, what is %s?",
  reverse: "Which formula is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Distance formula", value: "Root of (x2 minus x1) squared plus (y2 minus y1) squared" },
    { key: "Distance of a point from the origin", value: "Root of x squared plus y squared" },
    {
      key: "Section formula for internal division",
      value: "((m x2 plus n x1) over (m plus n), (m y2 plus n y1) over (m plus n))",
    },
    { key: "Midpoint formula", value: "The average of the x coordinates and of the y coordinates" },
    { key: "Centroid of a triangle", value: "The average of the three vertices' coordinates" },
    { key: "Distance between (0,0) and (6,8)", value: "10 units" },
    { key: "Midpoint of (2,3) and (6,7)", value: "(4, 5)" },
    { key: "Collinear points", value: "Three points that lie on one straight line" },
    {
      key: "Condition for collinearity by area",
      value: "The area of the triangle they form is zero",
    },
    { key: "Point dividing a segment in ratio 1 to 1", value: "The midpoint" },
    { key: "Coordinates on the x axis", value: "Of the form (a, 0)" },
    { key: "Coordinates on the y axis", value: "Of the form (0, b)" },
  ],
  hard: [
    { key: "Ratio in which the x axis divides the join of (1, -5) and (-4, 5)", value: "1 to 1" },
    {
      key: "Type of quadrilateral with equal diagonals and equal sides",
      value: "A square, checked using the distance formula",
    },
    {
      key: "Point equidistant from the three vertices of a triangle",
      value: "The circumcentre, found by equating distances",
    },
    {
      key: "Why the centroid divides a median in 2 to 1",
      value:
        "The section formula applied to the vertex and the midpoint of the opposite side gives it",
    },
    { key: "Area of a triangle with vertices (1,2), (4,6) and (1,6)", value: "6 square units" },
    {
      key: "Fourth vertex of a parallelogram",
      value: "Found by equating the midpoints of the two diagonals",
    },
  ],
});

chapter({
  id: "n10:math:trig-applications",
  subject: "Math Class 10",
  topic: "Some Applications of Trigonometry",
  forward: "In heights and distances, what is %s?",
  reverse: "Which term or standard result is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Angle of elevation",
      value: "The angle above the horizontal when looking up at an object",
    },
    {
      key: "Angle of depression",
      value: "The angle below the horizontal when looking down at an object",
    },
    { key: "Line of sight", value: "The straight line from the observer's eye to the object" },
    { key: "tan of the angle of elevation", value: "Height divided by horizontal distance" },
    { key: "Angle of elevation when height equals distance", value: "45 degrees" },
    { key: "Shadow length at 45 degrees elevation", value: "Equal to the height of the object" },
    { key: "sin 30 degrees", value: "One half" },
    { key: "cos 60 degrees", value: "One half" },
    { key: "tan 60 degrees", value: "Root 3" },
    { key: "tan 30 degrees", value: "1 over root 3" },
    {
      key: "Relation of the two angles from the two ends of a line",
      value: "The angle of elevation from one point equals the angle of depression from the other",
    },
    { key: "Horizontal distance from height h at 30 degrees", value: "h root 3" },
  ],
  hard: [
    {
      key: "Effect on shadow when elevation rises from 30 to 60 degrees",
      value: "The shadow shortens from h root 3 to h over root 3",
    },
    {
      key: "Height of a tower whose shadow is root 3 times its height",
      value: "The elevation of the sun is 30 degrees",
    },
    {
      key: "Two towers of equal height with a point between them",
      value: "The distances are in the ratio of the cotangents of the two angles",
    },
    {
      key: "Why the observer's eye height matters",
      value: "It must be added to the calculated height when the angle is measured from eye level",
    },
    { key: "Angle of elevation of the sun when shadow equals height", value: "45 degrees" },
    {
      key: "Distance of a boat seen at depression 60 degrees from a 150 m cliff",
      value: "50 root 3 metre",
    },
  ],
});

chapter({
  id: "n10:math:circles",
  subject: "Math Class 10",
  topic: "Circles and Tangents",
  forward: "About circles and tangents, what is %s?",
  reverse: "Which theorem or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Tangent to a circle", value: "A line meeting the circle at exactly one point" },
    { key: "Secant", value: "A line cutting the circle at two points" },
    { key: "Point of contact", value: "The single point where a tangent touches the circle" },
    {
      key: "Tangent and radius",
      value: "The tangent is perpendicular to the radius at the point of contact",
    },
    { key: "Number of tangents from a point on the circle", value: "Exactly one" },
    { key: "Number of tangents from an external point", value: "Exactly two" },
    { key: "Number of tangents from a point inside the circle", value: "None" },
    { key: "Lengths of tangents from an external point", value: "They are equal" },
    { key: "Number of tangents parallel to a given line", value: "Two" },
    {
      key: "Tangent length from distance d and radius r",
      value: "Root of d squared minus r squared",
    },
    {
      key: "Angle between the two tangents from an external point",
      value: "Supplementary to the angle they subtend at the centre",
    },
    { key: "Common tangent", value: "A line that is tangent to two circles at once" },
  ],
  hard: [
    {
      key: "Quadrilateral formed by an external point, the centre and the two contact points",
      value: "A cyclic quadrilateral, since the two radii make right angles",
    },
    {
      key: "Tangent length from a point 13 cm from the centre of a circle of radius 5 cm",
      value: "12 cm",
    },
    { key: "Parallelogram circumscribing a circle", value: "It must be a rhombus" },
    {
      key: "Sum of opposite sides of a quadrilateral circumscribing a circle",
      value: "The two sums are equal",
    },
    {
      key: "Angle between two tangents inclined at 60 degrees to each other",
      value: "They subtend 120 degrees at the centre",
    },
    {
      key: "Why two tangents from a point are equal",
      value:
        "The two right triangles formed share the hypotenuse and a radius, so they are congruent",
    },
  ],
});

chapter({
  id: "n10:math:areas-circles",
  subject: "Math Class 10",
  exams: CBSE10_ONLY,
  topic: "Areas Related to Circles",
  forward: "In areas related to circles, what is %s?",
  reverse: "Which formula is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Circumference of a circle", value: "2 pi r" },
    { key: "Area of a circle", value: "pi r squared" },
    { key: "Length of an arc of angle theta", value: "theta over 360 times 2 pi r" },
    { key: "Area of a sector of angle theta", value: "theta over 360 times pi r squared" },
    { key: "Area of a minor segment", value: "Area of the sector minus the area of the triangle" },
    { key: "Area of a semicircle", value: "Half pi r squared" },
    { key: "Perimeter of a semicircle", value: "pi r plus 2r" },
    { key: "Area of a quadrant", value: "One quarter pi r squared" },
    { key: "Area of a ring between radii R and r", value: "pi times (R squared minus r squared)" },
    { key: "Value of pi used in most problems", value: "22 over 7 or 3.14" },
    { key: "Angle of a semicircular sector", value: "180 degrees" },
    { key: "Distance covered in one wheel rotation", value: "The circumference of the wheel" },
  ],
  hard: [
    {
      key: "Area swept by a minute hand in one hour",
      value: "The full circle, pi r squared, with r the hand length",
    },
    { key: "Angle swept by the hour hand in one hour", value: "30 degrees" },
    { key: "Effect of doubling the radius on the area", value: "The area becomes four times" },
    {
      key: "Area of the segment cut by a chord subtending 90 degrees",
      value: "pi r squared over 4 minus r squared over 2",
    },
    {
      key: "Number of rotations of a wheel of radius r over distance d",
      value: "d divided by 2 pi r",
    },
    { key: "Ratio of areas of two circles with radii in ratio 2 to 3", value: "4 to 9" },
  ],
});

chapter({
  id: "n10:math:surface-volume",
  subject: "Math Class 10",
  topic: "Surface Areas and Volumes",
  forward: "In surface areas and volumes, what is %s?",
  reverse: "Which formula is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Volume of a cylinder", value: "pi r squared h" },
    { key: "Curved surface area of a cylinder", value: "2 pi r h" },
    { key: "Volume of a cone", value: "One third pi r squared h" },
    { key: "Curved surface area of a cone", value: "pi r l" },
    { key: "Volume of a sphere", value: "Four thirds pi r cubed" },
    { key: "Surface area of a sphere", value: "4 pi r squared" },
    { key: "Volume of a hemisphere", value: "Two thirds pi r cubed" },
    { key: "Total surface area of a hemisphere", value: "3 pi r squared" },
    {
      key: "Volume of a frustum",
      value: "One third pi h times (R squared plus r squared plus Rr)",
    },
    { key: "Slant height of a frustum", value: "Root of h squared plus (R minus r) squared" },
    {
      key: "Rule when a solid is recast",
      value: "The volume stays the same while the surface area changes",
    },
    { key: "Volume of a cuboid", value: "Length times breadth times height" },
  ],
  hard: [
    { key: "Number of spheres of radius r from a sphere of radius 3r", value: "Twenty seven" },
    {
      key: "Surface area of a combination solid",
      value: "Add only the exposed faces; hidden circular faces are not counted",
    },
    {
      key: "Height of a cone made by melting a sphere of the same radius",
      value: "Four times the radius",
    },
    { key: "Curved surface area of a frustum", value: "pi times (R plus r) times l" },
    {
      key: "Why volume is conserved when a wire is drawn from a solid",
      value: "Only shape changes; no material is added or removed",
    },
    {
      key: "Ratio of volumes of a cone and cylinder with the same base and height",
      value: "1 to 3",
    },
  ],
});

chapter({
  id: "n10:math:statistics",
  subject: "Math Class 10",
  topic: "Statistics",
  forward: "In statistics, what is %s?",
  reverse: "Which measure or formula is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Direct method for the mean", value: "Sum of f times x divided by the sum of f" },
    { key: "Assumed mean method", value: "Mean equals a plus the mean of the deviations from a" },
    {
      key: "Step deviation method",
      value: "Mean equals a plus h times the mean of the step deviations",
    },
    { key: "Mode of grouped data", value: "l plus the modal-class correction times h" },
    { key: "Median of grouped data", value: "l plus ((n over 2 minus cf) over f) times h" },
    { key: "Modal class", value: "The class with the highest frequency" },
    { key: "Median class", value: "The class in which the n over 2 th observation lies" },
    { key: "Cumulative frequency", value: "The running total of frequencies up to a class" },
    { key: "Empirical relation", value: "Mode equals 3 median minus 2 mean" },
    { key: "Ogive", value: "A cumulative frequency curve" },
    { key: "Class mark", value: "The average of the upper and lower class limits" },
    { key: "Class size", value: "The difference between the upper and lower class limits" },
  ],
  hard: [
    {
      key: "Why the step deviation method is preferred",
      value: "Dividing by the class size keeps the arithmetic small without changing the answer",
    },
    {
      key: "Point of intersection of the less than and more than ogives",
      value: "Its x coordinate is the median",
    },
    { key: "Mean if every observation increases by 5", value: "It also increases by 5" },
    {
      key: "Use of the empirical relation",
      value: "Finding the third measure when two of mean, median and mode are known",
    },
    {
      key: "Best measure when the data has extreme values",
      value: "The median, which ignores the size of outliers",
    },
    {
      key: "Effect of unequal class sizes on the mode formula",
      value: "Classes must be made equal first, otherwise the modal class is misleading",
    },
  ],
});

chapter({
  id: "n10:math:probability",
  subject: "Math Class 10",
  topic: "Probability",
  forward: "In probability, what is %s?",
  reverse: "Which term or value is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Probability of an event",
      value: "Favourable outcomes divided by total equally likely outcomes",
    },
    { key: "Range of a probability", value: "From 0 to 1 inclusive" },
    { key: "Probability of a sure event", value: "1" },
    { key: "Probability of an impossible event", value: "0" },
    { key: "Sum of the probabilities of an event and its complement", value: "1" },
    { key: "Probability of a head on one coin toss", value: "One half" },
    { key: "Total outcomes when two coins are tossed", value: "Four" },
    { key: "Probability of getting a 4 on a die", value: "One sixth" },
    { key: "Total outcomes when two dice are thrown", value: "Thirty six" },
    { key: "Number of cards in a standard deck", value: "Fifty two" },
    { key: "Number of face cards in a deck", value: "Twelve" },
    { key: "Probability of drawing a red card", value: "One half" },
  ],
  hard: [
    {
      key: "Probability of a sum of 7 with two dice",
      value: "One sixth, from six favourable outcomes out of thirty six",
    },
    {
      key: "Most likely sum with two dice",
      value: "Seven, which has the greatest number of combinations",
    },
    { key: "Probability of at least one head in two tosses", value: "Three quarters" },
    {
      key: "Probability of a king or a heart from a deck",
      value: "Sixteen over fifty two, after removing the double-counted king of hearts",
    },
    { key: "Probability of a non-leap year having 53 Sundays", value: "One seventh" },
    { key: "Probability of a leap year having 53 Sundays", value: "Two sevenths" },
  ],
});

export const NCERT10_TEMPLATES = templates;
