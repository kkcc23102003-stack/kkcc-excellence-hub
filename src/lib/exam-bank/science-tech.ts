/**
 * General Science and Science and Technology.
 *
 * "General Science" is the physics, chemistry and biology section set by SSC,
 * railways, defence and State PSC papers. "Science and Technology" is the
 * current-affairs-flavoured section of UPSC and State PSC General Studies.
 */

import { type Template } from "./core";
import { CIVIL_DEFENCE, GK_WIDE, SSC_RRB, chapterFactory } from "./two-layer";

const templates: Template[] = [];
const SCI = [...new Set([...GK_WIDE, ...SSC_RRB, ...CIVIL_DEFENCE])];

const science = chapterFactory(templates, "General Science", SCI);
const tech = chapterFactory(templates, "Science and Technology", GK_WIDE);

science(
  "gs:phy",
  "Physics for Competitive Exams",
  "In physics, what is %s?",
  "%k is %v.",
  [
    { key: "SI unit of force", value: "The newton" },
    { key: "SI unit of power", value: "The watt" },
    { key: "SI unit of pressure", value: "The pascal" },
    { key: "SI unit of frequency", value: "The hertz" },
    { key: "Speed of light in vacuum", value: "About 3 times 10 to the power 8 metres per second" },
    { key: "Instrument to measure current", value: "The ammeter, connected in series" },
    {
      key: "Newton's first law",
      value: "A body stays at rest or in uniform motion unless acted on by a net force",
    },
    {
      key: "Device that converts electrical energy to mechanical energy",
      value: "The electric motor",
    },
    { key: "Device that converts mechanical energy to electrical energy", value: "The generator" },
    {
      key: "Reason the sky is blue",
      value: "Scattering of shorter wavelengths of sunlight by air molecules",
    },
  ],
  [
    {
      key: "Why a stone sinks but a ship floats",
      value: "The ship displaces water weighing more than itself, so buoyancy balances its weight",
    },
    {
      key: "Doppler effect",
      value: "The apparent change in frequency due to relative motion of source and observer",
    },
    {
      key: "Why bulbs at home are in parallel",
      value: "Each gets full voltage and can be switched independently",
    },
    {
      key: "Total internal reflection condition",
      value: "Light travelling from a denser to a rarer medium beyond the critical angle",
    },
    { key: "Escape velocity from the Earth", value: "About 11.2 kilometres per second" },
  ],
);

science(
  "gs:chem",
  "Chemistry for Competitive Exams",
  "In chemistry, what is %s?",
  "%k is %v.",
  [
    { key: "Chemical formula of common salt", value: "Sodium chloride" },
    { key: "Chemical name of baking soda", value: "Sodium bicarbonate" },
    { key: "Chemical name of washing soda", value: "Sodium carbonate decahydrate" },
    { key: "Chemical name of quicklime", value: "Calcium oxide" },
    { key: "Lightest element", value: "Hydrogen" },
    { key: "Most abundant element in the Earth's crust", value: "Oxygen" },
    { key: "Metal that is liquid at room temperature", value: "Mercury" },
    { key: "pH of a neutral solution", value: "Seven at twenty five degrees Celsius" },
    {
      key: "Gas used in electric bulbs",
      value: "Argon or nitrogen, to prevent oxidation of the filament",
    },
    { key: "Alloy of copper and zinc", value: "Brass" },
  ],
  [
    {
      key: "Why stainless steel does not rust",
      value: "Chromium forms a thin passive oxide film over the surface",
    },
    {
      key: "Aqua regia",
      value: "A mixture of concentrated nitric and hydrochloric acid that dissolves gold",
    },
    {
      key: "Isotopes",
      value: "Atoms of the same element with the same protons but different neutrons",
    },
    {
      key: "Catalyst",
      value: "A substance that changes the rate of a reaction without being consumed",
    },
    { key: "Hardest natural substance", value: "Diamond, an allotrope of carbon" },
  ],
);

science(
  "gs:bio",
  "Biology for Competitive Exams",
  "In biology, what is %s?",
  "%k is %v.",
  [
    { key: "Powerhouse of the cell", value: "The mitochondrion" },
    { key: "Largest gland in the human body", value: "The liver" },
    { key: "Largest organ of the human body", value: "The skin" },
    { key: "Number of bones in an adult human", value: "Two hundred and six" },
    { key: "Number of chambers in the human heart", value: "Four" },
    { key: "Universal donor blood group", value: "O negative" },
    { key: "Universal recipient blood group", value: "AB positive" },
    { key: "Vitamin deficiency causing scurvy", value: "Vitamin C" },
    { key: "Vitamin deficiency causing rickets", value: "Vitamin D" },
    { key: "Hormone that regulates blood sugar", value: "Insulin, from the pancreas" },
  ],
  [
    {
      key: "Why the Rh factor matters in pregnancy",
      value: "An Rh negative mother can develop antibodies against an Rh positive foetus",
    },
    { key: "Function of the nephron", value: "The filtering unit of the kidney that forms urine" },
    {
      key: "Mendel's law of segregation",
      value: "Each parent passes on only one of a pair of alleles to the offspring",
    },
    { key: "Vector of malaria", value: "The female Anopheles mosquito" },
    {
      key: "Difference between artery and vein",
      value:
        "Arteries carry blood away from the heart at high pressure; veins return it and have valves",
    },
  ],
);

tech(
  "st:space-defence",
  "Space and Defence Technology",
  "In India's space and defence technology, what is %s?",
  "%k is %v.",
  [
    { key: "ISRO headquarters", value: "Bengaluru" },
    { key: "India's first satellite", value: "Aryabhata, launched in 1975" },
    { key: "Chandrayaan-1 launch year", value: "2008" },
    {
      key: "Chandrayaan-3 achievement",
      value: "The first soft landing near the lunar south pole, in 2023",
    },
    { key: "Mangalyaan", value: "The Mars Orbiter Mission, launched in 2013" },
    { key: "PSLV", value: "The Polar Satellite Launch Vehicle, ISRO's workhorse" },
    {
      key: "GSLV",
      value: "The Geosynchronous Satellite Launch Vehicle, with a cryogenic upper stage",
    },
    { key: "NavIC", value: "India's regional navigation satellite system" },
    { key: "DRDO", value: "The Defence Research and Development Organisation" },
    { key: "Agni series", value: "India's family of surface to surface ballistic missiles" },
  ],
  [
    { key: "Gaganyaan", value: "India's crewed orbital spaceflight programme" },
    {
      key: "Aditya-L1",
      value: "India's solar observation mission placed at the first Lagrange point",
    },
    { key: "Mission Shakti", value: "India's 2019 anti-satellite missile test" },
    {
      key: "SSLV",
      value: "The Small Satellite Launch Vehicle for launch-on-demand small payloads",
    },
    { key: "BrahMos", value: "The supersonic cruise missile built with Russia" },
  ],
);

tech(
  "st:computing-biotech",
  "Computing, Biotechnology and Energy",
  "In modern science and technology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Artificial intelligence",
      value: "Systems that perform tasks normally requiring human intelligence",
    },
    { key: "Machine learning", value: "A branch of AI in which systems learn patterns from data" },
    { key: "Blockchain", value: "A distributed tamper-evident ledger of linked records" },
    {
      key: "Internet of Things",
      value: "A network of everyday devices that sense and exchange data",
    },
    {
      key: "5G",
      value: "The fifth generation mobile standard offering high speed and low latency",
    },
    { key: "Genome", value: "The complete set of genetic material of an organism" },
    { key: "CRISPR", value: "A precise gene editing technology" },
    { key: "Stem cell", value: "An undifferentiated cell that can develop into other cell types" },
    { key: "Renewable energy example", value: "Solar, wind, hydro, geothermal and biomass" },
    {
      key: "Green hydrogen",
      value: "Hydrogen produced by electrolysis using renewable electricity",
    },
  ],
  [
    {
      key: "Quantum computing advantage",
      value: "Qubits can hold superposed states, allowing certain problems to be solved far faster",
    },
    {
      key: "Bt cotton",
      value: "Cotton engineered with a Bacillus thuringiensis gene for pest resistance",
    },
    {
      key: "mRNA vaccine principle",
      value: "It delivers instructions for cells to make a viral protein that trains immunity",
    },
    {
      key: "National Quantum Mission",
      value: "India's mission to build quantum computers, communication and sensing capability",
    },
    {
      key: "Difference between nuclear fission and fusion",
      value: "Fission splits heavy nuclei; fusion joins light nuclei and powers the Sun",
    },
  ],
);

export const SCIENCE_TECH_TEMPLATES = templates;
