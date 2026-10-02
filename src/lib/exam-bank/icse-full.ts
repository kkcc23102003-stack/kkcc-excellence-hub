/**
 * ICSE Class 9 and 10 — the chapters the earlier split had left out.
 *
 * Checked against the CISCE subject syllabus: Biology needs absorption and
 * transpiration, population, human evolution and pollution; Chemistry needs
 * hydrogen, gas laws and the study of compounds; Physics needs the spectrum
 * and a separate refraction chapter.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const C9 = ["ICSE Class 9", "ICSE MCQ", "ICSE Class 9-10"];
const C10 = ["ICSE Class 10", "ICSE MCQ", "ICSE Class 9-10"];

const templates: Template[] = [];
const bio9 = chapterFactory(templates, "Biology Class 9", C9);
const bio10 = chapterFactory(templates, "Biology Class 10", C10);
const chem9 = chapterFactory(templates, "Chemistry Class 9", C9);
const chem10 = chapterFactory(templates, "Chemistry Class 10", C10);
const phy10 = chapterFactory(templates, "Physics Class 10", C10);

/* ================================================== Biology Class 9 ===== */

bio9(
  "icse:b9:classification",
  "Introducing Biology and Classification",
  "In biological classification, what is %s?",
  "%k is %v.",
  [
    { key: "Taxonomy", value: "The science of identifying, naming and classifying organisms" },
    {
      key: "Binomial nomenclature",
      value: "The two word naming system of genus and species given by Linnaeus",
    },
    {
      key: "Five kingdom classification",
      value: "Whittaker's scheme of Monera, Protista, Fungi, Plantae and Animalia",
    },
    { key: "Monera", value: "The kingdom of prokaryotes such as bacteria and cyanobacteria" },
    {
      key: "Protista",
      value: "The kingdom of unicellular eukaryotes such as Amoeba and Paramecium",
    },
    { key: "Fungi", value: "The kingdom of heterotrophic organisms with a chitinous cell wall" },
    {
      key: "Order of taxonomic hierarchy",
      value: "Kingdom, phylum, class, order, family, genus and species",
    },
    {
      key: "Species",
      value: "A group of organisms that can interbreed and produce fertile offspring",
    },
    { key: "Prokaryote", value: "A cell without a true nucleus or membrane bound organelles" },
    { key: "Eukaryote", value: "A cell with a true nucleus enclosed by a nuclear membrane" },
  ],
  [
    {
      key: "Basis of the five kingdom system",
      value: "Cell structure, body organisation, mode of nutrition and reproduction",
    },
    {
      key: "Virus placement in classification",
      value: "Viruses are excluded because they are acellular and inert outside a host",
    },
    {
      key: "Bryophytes",
      value: "The amphibians of the plant kingdom, needing water for fertilisation",
    },
    { key: "Pteridophytes", value: "The first land plants with true vascular tissue" },
    {
      key: "Difference between angiosperms and gymnosperms",
      value: "Angiosperm seeds are enclosed in a fruit, gymnosperm seeds are naked",
    },
  ],
);

bio9(
  "icse:b9:flower-seed",
  "Flower, Pollination and Seeds",
  "In plant reproduction, what is %s?",
  "%k is %v.",
  [
    { key: "Flower", value: "The reproductive organ of an angiosperm" },
    { key: "Androecium", value: "The male part of a flower, made of stamens" },
    { key: "Gynoecium", value: "The female part of a flower, made of carpels" },
    { key: "Pollination", value: "The transfer of pollen from an anther to a stigma" },
    { key: "Self pollination", value: "Transfer of pollen within the same flower or plant" },
    {
      key: "Cross pollination",
      value: "Transfer of pollen to a flower of another plant of the same species",
    },
    {
      key: "Fertilisation in plants",
      value: "The fusion of the male gamete with the egg to form a zygote",
    },
    {
      key: "Double fertilisation",
      value: "The angiosperm process where one gamete forms the zygote and the other the endosperm",
    },
    { key: "Cotyledon", value: "The seed leaf that stores or absorbs food for the embryo" },
    { key: "Germination", value: "The process by which a seed develops into a seedling" },
  ],
  [
    {
      key: "Epigeal germination",
      value: "Germination in which the cotyledons are pushed above the soil",
    },
    {
      key: "Hypogeal germination",
      value: "Germination in which the cotyledons stay below the soil",
    },
    {
      key: "Conditions necessary for germination",
      value: "Water, suitable temperature and oxygen",
    },
    {
      key: "Vegetative propagation",
      value: "Reproduction from a vegetative part such as a stem, root or leaf",
    },
    {
      key: "Advantage of cross pollination",
      value: "It brings genetic variation and produces healthier offspring",
    },
  ],
);

bio9(
  "icse:b9:human-systems",
  "Digestive, Respiratory and Skeletal Systems",
  "In human physiology, what is %s?",
  "%k is %v.",
  [
    { key: "Digestion", value: "The breakdown of complex food into simple absorbable substances" },
    { key: "Enzyme in saliva", value: "Salivary amylase, which acts on starch" },
    {
      key: "Function of the small intestine",
      value: "Completion of digestion and absorption of nutrients",
    },
    {
      key: "Villi",
      value: "Finger like projections of the small intestine that increase absorptive surface",
    },
    {
      key: "Peristalsis",
      value: "The wave of muscular contraction that pushes food along the alimentary canal",
    },
    { key: "Breathing", value: "The physical process of taking in and giving out air" },
    {
      key: "Respiration",
      value: "The chemical process of releasing energy from food inside cells",
    },
    { key: "Diaphragm", value: "The muscular sheet below the lungs that helps in breathing" },
    { key: "Number of bones in an adult human", value: "Two hundred and six" },
    {
      key: "Function of the skeleton",
      value: "Support, protection, movement and production of blood cells",
    },
  ],
  [
    {
      key: "Axial and appendicular skeleton",
      value:
        "The axial is the skull, vertebral column and rib cage; the appendicular is the limbs and girdles",
    },
    {
      key: "Types of joints",
      value: "Immovable, slightly movable and freely movable synovial joints",
    },
    {
      key: "Function of the skin",
      value: "Protection, sensation, temperature regulation and excretion of sweat",
    },
    { key: "Layers of the skin", value: "The epidermis and the dermis" },
    {
      key: "Vital capacity",
      value: "The maximum volume of air that can be exhaled after the deepest inhalation",
    },
  ],
);

/* ================================================= Biology Class 10 ===== */

bio10(
  "icse:b10:absorption",
  "Absorption by Roots and Transpiration",
  "In plant water relations, what is %s?",
  "%k is %v.",
  [
    {
      key: "Osmosis",
      value:
        "The movement of solvent through a semipermeable membrane from a dilute to a concentrated solution",
    },
    {
      key: "Diffusion",
      value:
        "The movement of particles from a region of higher concentration to lower concentration",
    },
    {
      key: "Root hair",
      value: "The unicellular extension of a root epidermal cell that absorbs water",
    },
    {
      key: "Turgidity",
      value: "The swollen firm state of a cell that has taken in water by osmosis",
    },
    {
      key: "Plasmolysis",
      value: "The shrinking of the protoplasm away from the cell wall in a hypertonic solution",
    },
    { key: "Transpiration", value: "The loss of water as vapour from the aerial parts of a plant" },
    { key: "Stomata", value: "The pores on a leaf through which most transpiration occurs" },
    { key: "Guard cells", value: "The bean shaped cells that open and close a stoma" },
    {
      key: "Transpiration pull",
      value: "The suction force created by transpiration that lifts water up the xylem",
    },
    { key: "Ascent of sap", value: "The upward movement of water and minerals through the xylem" },
  ],
  [
    {
      key: "Hypotonic solution",
      value: "A solution less concentrated than the cell sap, causing the cell to swell",
    },
    {
      key: "Hypertonic solution",
      value: "A solution more concentrated than the cell sap, causing the cell to shrink",
    },
    { key: "Guttation", value: "The loss of liquid water from leaf margins through hydathodes" },
    {
      key: "Significance of transpiration",
      value: "It cools the plant, helps mineral transport and maintains the ascent of sap",
    },
    {
      key: "Root pressure",
      value: "The pressure developed in root cells that pushes water up a short distance",
    },
  ],
);

bio10(
  "icse:b10:population",
  "Population and Human Evolution",
  "About population and evolution, what is %s?",
  "%k is %v.",
  [
    {
      key: "Population explosion",
      value: "The sudden rapid rise in the number of people in a region",
    },
    { key: "Birth rate", value: "The number of live births per thousand people in a year" },
    { key: "Death rate", value: "The number of deaths per thousand people in a year" },
    { key: "Population density", value: "The number of people living per square kilometre" },
    { key: "Demography", value: "The statistical study of human populations" },
    { key: "Family planning", value: "Voluntary regulation of the number and spacing of children" },
    {
      key: "Evolution",
      value: "The gradual change in inherited characteristics of a population over generations",
    },
    {
      key: "Natural selection",
      value: "Darwin's mechanism by which better adapted individuals survive and reproduce",
    },
    {
      key: "Homologous organs",
      value: "Organs of similar basic structure but different function, showing common ancestry",
    },
    {
      key: "Analogous organs",
      value: "Organs of different structure but similar function, showing convergent evolution",
    },
  ],
  [
    {
      key: "Vestigial organs",
      value: "Reduced and functionless organs that were useful in ancestors, such as the appendix",
    },
    {
      key: "Fossils as evidence",
      value: "Preserved remains that show the sequence of life forms through geological time",
    },
    { key: "Homo sapiens", value: "The scientific name of modern human beings" },
    {
      key: "Consequences of population explosion",
      value: "Pressure on land, water, food, housing and employment, and rising pollution",
    },
    { key: "Sex ratio", value: "The number of females per thousand males in a population" },
  ],
);

bio10(
  "icse:b10:pollution",
  "Pollution and Waste Management",
  "In environmental studies, what is %s?",
  "%k is %v.",
  [
    {
      key: "Pollution",
      value:
        "The undesirable change in the physical, chemical or biological quality of the environment",
    },
    { key: "Pollutant", value: "The substance or energy that causes pollution" },
    {
      key: "Biodegradable waste",
      value: "Waste broken down by micro organisms, such as vegetable peels",
    },
    {
      key: "Non biodegradable waste",
      value: "Waste that micro organisms cannot break down, such as plastic",
    },
    {
      key: "Air pollution",
      value: "Contamination of air by gases and particulate matter harmful to life",
    },
    {
      key: "Greenhouse effect",
      value: "The trapping of long wave radiation by gases such as carbon dioxide",
    },
    {
      key: "Global warming",
      value: "The rise in average global temperature caused by an enhanced greenhouse effect",
    },
    {
      key: "Acid rain",
      value: "Rain made acidic by oxides of sulphur and nitrogen dissolved in it",
    },
    {
      key: "Eutrophication",
      value: "The enrichment of a water body with nutrients, causing algal bloom and oxygen loss",
    },
    {
      key: "Biomagnification",
      value: "The increasing concentration of a persistent pollutant at higher trophic levels",
    },
  ],
  [
    {
      key: "Ozone layer depletion",
      value: "The thinning of stratospheric ozone chiefly by chlorofluorocarbons",
    },
    {
      key: "Effect of ozone depletion",
      value: "More ultraviolet radiation reaches the earth, raising skin cancer and cataract risk",
    },
    {
      key: "Noise pollution effects",
      value: "Hearing loss, sleep disturbance, irritability and raised blood pressure",
    },
    { key: "Three Rs of waste management", value: "Reduce, reuse and recycle" },
    {
      key: "Sewage treatment stages",
      value: "Primary settling, secondary biological treatment and tertiary polishing",
    },
  ],
);

/* ================================================ Chemistry Class 9 ===== */

chem9(
  "icse:c9:hydrogen",
  "Study of the First Element — Hydrogen",
  "About hydrogen, what is %s?",
  "%k is %v.",
  [
    {
      key: "Position of hydrogen in the periodic table",
      value: "Group 1, though it resembles both alkali metals and halogens",
    },
    {
      key: "Laboratory preparation of hydrogen",
      value: "Action of dilute sulphuric acid on granulated zinc",
    },
    {
      key: "Why granulated zinc is used",
      value: "It gives a steady, controllable rate of reaction",
    },
    {
      key: "Why nitric acid is not used to prepare hydrogen",
      value: "It is an oxidising agent and gives oxides of nitrogen instead",
    },
    {
      key: "Test for hydrogen gas",
      value: "It burns with a pop sound when a burning splint is brought near",
    },
    { key: "Density of hydrogen", value: "The lightest of all gases" },
    {
      key: "Reaction of hydrogen with oxygen",
      value: "It burns to form water, with a large release of heat",
    },
    {
      key: "Reducing nature of hydrogen",
      value: "It removes oxygen from metal oxides such as copper oxide",
    },
    {
      key: "Industrial use of hydrogen",
      value: "Manufacture of ammonia by the Haber process and hydrogenation of oils",
    },
    {
      key: "Hydrogenation of oils",
      value: "Adding hydrogen to unsaturated oils with a nickel catalyst to make vanaspati",
    },
  ],
  [
    {
      key: "Why hydrogen is collected over water",
      value: "It is insoluble in water and lighter than air",
    },
    { key: "Drying agent used for hydrogen", value: "Anhydrous calcium chloride" },
    {
      key: "Reaction of hydrogen with active metals",
      value: "It forms ionic hydrides, such as sodium hydride",
    },
    {
      key: "Hydrogen as a fuel of the future",
      value: "It gives a high calorific value and its only product is water",
    },
    {
      key: "Why hydrogen is placed with the halogens too",
      value: "Like a halogen it is diatomic and forms a uninegative ion",
    },
  ],
);

chem9(
  "icse:c9:gas-laws",
  "Study of Gas Laws",
  "In the gas laws, what is %s?",
  "%k is %v.",
  [
    {
      key: "Boyle's law",
      value:
        "At constant temperature the volume of a gas is inversely proportional to its pressure",
    },
    {
      key: "Charles's law",
      value:
        "At constant pressure the volume of a gas is directly proportional to its absolute temperature",
    },
    {
      key: "Absolute zero",
      value: "Minus two hundred and seventy three degrees Celsius, the lowest possible temperature",
    },
    {
      key: "Kelvin scale conversion",
      value: "Kelvin equals degrees Celsius plus two hundred and seventy three",
    },
    { key: "Combined gas equation", value: "P1V1 divided by T1 equals P2V2 divided by T2" },
    {
      key: "Standard temperature and pressure",
      value: "Zero degrees Celsius and seven hundred and sixty millimetres of mercury",
    },
    {
      key: "Gay Lussac's law of combining volumes",
      value:
        "Gases combine in simple whole number ratios of volume at the same temperature and pressure",
    },
    {
      key: "Avogadro's law",
      value:
        "Equal volumes of all gases at the same temperature and pressure contain equal numbers of molecules",
    },
    { key: "Effect of heating a gas at constant pressure", value: "Its volume increases" },
    { key: "Effect of increasing pressure at constant temperature", value: "The volume decreases" },
  ],
  [
    {
      key: "Why a correction to STP is needed",
      value:
        "Gas volume changes with temperature and pressure, so values must be compared at a fixed standard",
    },
    {
      key: "Assumption in the kinetic theory of gases",
      value: "Molecules are in constant random motion and collisions are perfectly elastic",
    },
    {
      key: "Real gas deviation from ideal behaviour",
      value:
        "It occurs at high pressure and low temperature, where molecular volume and attraction matter",
    },
    {
      key: "Aqueous tension",
      value: "The pressure exerted by water vapour when a gas is collected over water",
    },
    {
      key: "Relation between Avogadro's law and molar volume",
      value: "One mole of any gas occupies 22.4 litres at STP",
    },
  ],
);

/* =============================================== Chemistry Class 10 ===== */

chem10(
  "icse:c10:compounds",
  "Study of Compounds — Acids, Ammonia and Salts",
  "About the study of compounds, what is %s?",
  "%k is %v.",
  [
    {
      key: "Laboratory preparation of hydrogen chloride",
      value: "Heating sodium chloride with concentrated sulphuric acid",
    },
    { key: "Nature of hydrochloric acid", value: "A strong monobasic mineral acid" },
    {
      key: "Aqua regia",
      value: "A mixture of three parts concentrated hydrochloric acid and one part nitric acid",
    },
    { key: "Use of aqua regia", value: "It dissolves noble metals such as gold and platinum" },
    {
      key: "Laboratory preparation of ammonia",
      value: "Heating ammonium chloride with slaked lime",
    },
    { key: "Drying agent for ammonia", value: "Quicklime, because ammonia is basic" },
    {
      key: "Test for ammonia",
      value: "It turns moist red litmus blue and gives dense white fumes with hydrogen chloride",
    },
    {
      key: "Haber process",
      value:
        "The industrial manufacture of ammonia from nitrogen and hydrogen with an iron catalyst",
    },
    {
      key: "Contact process",
      value: "The industrial manufacture of sulphuric acid using vanadium pentoxide",
    },
    {
      key: "Ostwald process",
      value: "The manufacture of nitric acid by catalytic oxidation of ammonia",
    },
  ],
  [
    {
      key: "Why ammonia is not dried over sulphuric acid",
      value: "Being basic, it would react with the acid instead of being dried",
    },
    {
      key: "Oleum",
      value:
        "Fuming sulphuric acid formed by dissolving sulphur trioxide in concentrated sulphuric acid",
    },
    {
      key: "Dehydrating action of sulphuric acid",
      value: "It removes the elements of water, charring sugar to carbon",
    },
    {
      key: "Why concentrated nitric acid is stored in dark bottles",
      value: "It decomposes in light to give nitrogen dioxide, which turns it yellow",
    },
    {
      key: "Fountain experiment",
      value: "A demonstration of the extreme solubility of ammonia or hydrogen chloride in water",
    },
  ],
);

/* ================================================= Physics Class 10 ===== */

phy10(
  "icse:p10:spectrum",
  "Spectrum and Dispersion of Light",
  "About the spectrum of light, what is %s?",
  "%k is %v.",
  [
    { key: "Dispersion", value: "The splitting of white light into its constituent colours" },
    {
      key: "Cause of dispersion",
      value:
        "Different colours travel at different speeds in a medium and so bend by different amounts",
    },
    { key: "Colour deviated the most by a prism", value: "Violet" },
    { key: "Colour deviated the least by a prism", value: "Red" },
    { key: "Spectrum", value: "The band of colours obtained when white light is dispersed" },
    {
      key: "Order of colours in the visible spectrum",
      value: "Violet, indigo, blue, green, yellow, orange and red",
    },
    {
      key: "Infrared radiation",
      value: "Radiation beyond the red end, detected by its heating effect",
    },
    {
      key: "Ultraviolet radiation",
      value: "Radiation beyond the violet end, detected by fluorescence",
    },
    {
      key: "Monochromatic light",
      value: "Light of a single wavelength, which is not dispersed by a prism",
    },
    {
      key: "Rainbow formation",
      value: "Dispersion, internal reflection and refraction of sunlight by water droplets",
    },
  ],
  [
    {
      key: "Electromagnetic spectrum order",
      value: "Gamma rays, X rays, ultraviolet, visible, infrared, microwaves and radio waves",
    },
    {
      key: "Use of infrared radiation",
      value: "Remote controls, thermal imaging and physiotherapy",
    },
    {
      key: "Use of ultraviolet radiation",
      value: "Sterilisation, detecting forged notes and producing vitamin D",
    },
    {
      key: "Why the sky looks blue",
      value: "Shorter blue wavelengths are scattered far more by air molecules",
    },
    {
      key: "Recombination of the spectrum",
      value: "A second inverted prism recombines the colours into white light",
    },
  ],
);

export const ICSE_FULL_TEMPLATES = templates;
