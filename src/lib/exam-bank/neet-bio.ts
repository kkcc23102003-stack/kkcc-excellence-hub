/**
 * NEET Biology — the heavy NCERT Class 11-12 fact base.
 * Biology carries 360 of the 720 NEET marks, so it gets the widest fact
 * coverage in the bank.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

const NEET = [
  "NEET",
  "CBSE Class 11-12 Science",
  "CUET",
  "ISC Science",
  "CBSE Class 11",
  "CBSE Class 12",
  "ISC Class 11",
  "ISC Class 12",
];
const templates: Template[] = [];

function add(
  id: string,
  topic: string,
  difficulty: "Easy" | "Moderate" | "Difficult",
  rows: FactRow[],
  forward: string,
  reverse: string | undefined,
  explain: string,
) {
  templates.push(
    ...factTemplate({
      id,
      subject: "Biology",
      topic,
      difficulty,
      exams: NEET,
      rows,
      forward,
      reverse,
      explain,
    }),
    matchTemplate({ id, subject: "Biology", topic, difficulty, exams: NEET, rows }),
    statementTemplate({ id, subject: "Biology", topic, difficulty, exams: NEET, rows }),
    statementCountTemplate({ id, subject: "Biology", topic, difficulty, exams: NEET, rows }),
  );
}

/* --------------------------------------------------------- biomolecules */

add(
  "bio:biomolecule",
  "Biomolecules",
  "Moderate",
  [
    { key: "Monomer unit of proteins", value: "Amino acids" },
    { key: "Monomer unit of starch and glycogen", value: "Glucose" },
    { key: "Monomer unit of nucleic acids", value: "Nucleotides" },
    { key: "Storage polysaccharide in plants", value: "Starch" },
    { key: "Storage polysaccharide in animals", value: "Glycogen" },
    { key: "Structural polysaccharide of the plant cell wall", value: "Cellulose" },
    { key: "Structural polysaccharide of the insect exoskeleton", value: "Chitin" },
    { key: "Number of standard amino acids in proteins", value: "20" },
    { key: "Bond joining two amino acids", value: "Peptide bond" },
    { key: "Bond joining two monosaccharides", value: "Glycosidic bond" },
    { key: "Bond joining nucleotides in a DNA strand", value: "Phosphodiester bond" },
    { key: "Bond holding the two strands of DNA together", value: "Hydrogen bond" },
    { key: "Most abundant protein in the animal world", value: "Collagen" },
    { key: "Most abundant enzyme in the biosphere", value: "RuBisCO" },
    { key: "Secondary structure of protein stabilised by hydrogen bonds", value: "Alpha helix" },
    { key: "Non protein part required by an enzyme", value: "Cofactor" },
    { key: "Organic cofactor tightly bound to an enzyme", value: "Prosthetic group" },
    { key: "Substance on which an enzyme acts", value: "Substrate" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ------------------------------------------------------- photosynthesis */

add(
  "bio:photosynthesis",
  "Photosynthesis",
  "Moderate",
  [
    { key: "Site of the light reaction", value: "Thylakoid membrane of the chloroplast" },
    { key: "Site of the dark reaction or Calvin cycle", value: "Stroma of the chloroplast" },
    { key: "Primary CO2 acceptor in C3 plants", value: "Ribulose 1,5-bisphosphate (RuBP)" },
    { key: "Primary CO2 acceptor in C4 plants", value: "Phosphoenolpyruvate (PEP)" },
    { key: "First stable product of the C3 cycle", value: "3-phosphoglyceric acid" },
    { key: "First stable product of the C4 cycle", value: "Oxaloacetic acid" },
    { key: "Enzyme that fixes CO2 in C3 plants", value: "RuBisCO" },
    { key: "Enzyme that fixes CO2 in C4 plants", value: "PEP carboxylase" },
    {
      key: "Source of oxygen released in photosynthesis",
      value: "Water molecules split during photolysis",
    },
    { key: "Special leaf anatomy of C4 plants", value: "Kranz anatomy" },
    { key: "Photosynthetic pigment that absorbs red and blue light", value: "Chlorophyll a" },
    { key: "Reaction centre pigment of photosystem I", value: "P700" },
    { key: "Reaction centre pigment of photosystem II", value: "P680" },
    { key: "Wasteful process occurring in C3 plants at high oxygen", value: "Photorespiration" },
    { key: "Limiting factor law in photosynthesis", value: "Blackman's law of limiting factors" },
  ],
  "In photosynthesis, identify: %s?",
  undefined,
  "%k is %v.",
);

/* ------------------------------------------------------------ respiration */

add(
  "bio:respiration",
  "Respiration in Plants",
  "Moderate",
  [
    { key: "Site of glycolysis", value: "Cytoplasm" },
    { key: "Site of the Krebs cycle", value: "Mitochondrial matrix" },
    { key: "Site of the electron transport chain", value: "Inner mitochondrial membrane" },
    { key: "End product of glycolysis", value: "Pyruvic acid" },
    { key: "Net ATP produced in glycolysis", value: "2 ATP" },
    { key: "Total ATP from complete aerobic oxidation of one glucose", value: "36 to 38 ATP" },
    { key: "Final electron acceptor in aerobic respiration", value: "Oxygen" },
    { key: "Product of alcoholic fermentation in yeast", value: "Ethanol and carbon dioxide" },
    { key: "Product of lactic acid fermentation in muscles", value: "Lactic acid" },
    { key: "Respiratory quotient of carbohydrates", value: "1" },
    { key: "Respiratory quotient of fats", value: "Less than 1" },
    { key: "Enzyme complex that synthesises ATP", value: "ATP synthase" },
  ],
  "In respiration, identify: %s?",
  undefined,
  "%k is %v.",
);

/* -------------------------------------------------------- human digestion */

add(
  "bio:digestion",
  "Digestion and Absorption",
  "Easy",
  [
    { key: "Enzyme in saliva that digests starch", value: "Salivary amylase (ptyalin)" },
    { key: "Enzyme in gastric juice that digests protein", value: "Pepsin" },
    { key: "Enzyme that digests fat in the small intestine", value: "Lipase" },
    { key: "Acid secreted by the stomach", value: "Hydrochloric acid" },
    {
      key: "Cells that secrete hydrochloric acid in the stomach",
      value: "Parietal or oxyntic cells",
    },
    { key: "Cells that secrete pepsinogen", value: "Chief or zymogen cells" },
    { key: "Main site of digestion and absorption of food", value: "Small intestine" },
    { key: "Finger like projections that increase absorptive area", value: "Villi" },
    { key: "Largest gland in the human body", value: "Liver" },
    { key: "Fluid that emulsifies fats", value: "Bile" },
    { key: "Vestigial organ attached to the caecum", value: "Vermiform appendix" },
    { key: "Number of permanent teeth in an adult human", value: "32" },
    { key: "Dental formula of an adult human", value: "2123/2123" },
    { key: "Vitamin whose deficiency causes bleeding gums", value: "Vitamin C" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ----------------------------------------------------------- respiration human */

add(
  "bio:breathing",
  "Breathing and Exchange of Gases",
  "Moderate",
  [
    { key: "Main muscle of breathing", value: "Diaphragm" },
    { key: "Functional unit of the lung where gas exchange occurs", value: "Alveoli" },
    {
      key: "Volume of air inspired or expired in normal breathing",
      value: "Tidal volume, about 500 mL",
    },
    {
      key: "Maximum volume of air a person can breathe out after deep inspiration",
      value: "Vital capacity",
    },
    { key: "Air remaining in the lungs after forceful expiration", value: "Residual volume" },
    { key: "Percentage of oxygen transported by haemoglobin", value: "About 97 percent" },
    {
      key: "Main form in which carbon dioxide is transported in blood",
      value: "As bicarbonate ions",
    },
    { key: "Enzyme that speeds up formation of carbonic acid in RBC", value: "Carbonic anhydrase" },
    { key: "Respiratory centre of the brain", value: "Medulla oblongata" },
    { key: "Disease caused by inhalation of silica dust", value: "Silicosis" },
    { key: "Disease marked by inflammation of the bronchi", value: "Bronchitis" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ------------------------------------------------------------- excretion */

add(
  "bio:excretion",
  "Excretory Products and Elimination",
  "Moderate",
  [
    { key: "Structural and functional unit of the kidney", value: "Nephron" },
    { key: "Main nitrogenous waste of humans", value: "Urea" },
    { key: "Main nitrogenous waste of birds and reptiles", value: "Uric acid" },
    { key: "Main nitrogenous waste of bony fishes", value: "Ammonia" },
    { key: "Organ that converts ammonia into urea", value: "Liver" },
    { key: "Cup shaped structure enclosing the glomerulus", value: "Bowman's capsule" },
    { key: "Process of blood filtration in the glomerulus", value: "Ultrafiltration" },
    {
      key: "Hormone that increases water reabsorption in the kidney",
      value: "Antidiuretic hormone (vasopressin)",
    },
    { key: "Condition of increased urine output due to low ADH", value: "Diabetes insipidus" },
    { key: "Artificial method of removing wastes from blood", value: "Haemodialysis" },
    { key: "Animals that excrete urea", value: "Ureotelic animals" },
    { key: "Counter current mechanism site in the nephron", value: "Loop of Henle and vasa recta" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ---------------------------------------------------------- neural control */

add(
  "bio:neural",
  "Neural Control and Coordination",
  "Moderate",
  [
    { key: "Structural and functional unit of the nervous system", value: "Neuron" },
    { key: "Junction between two neurons", value: "Synapse" },
    { key: "Chemical released at a synapse", value: "Neurotransmitter" },
    { key: "Fatty sheath that insulates an axon", value: "Myelin sheath" },
    { key: "Gaps in the myelin sheath", value: "Nodes of Ranvier" },
    { key: "Part of the brain controlling posture and balance", value: "Cerebellum" },
    { key: "Part of the brain controlling body temperature and hunger", value: "Hypothalamus" },
    { key: "Part of the brain that relays sensory information", value: "Thalamus" },
    { key: "Number of pairs of cranial nerves in humans", value: "12 pairs" },
    { key: "Number of pairs of spinal nerves in humans", value: "31 pairs" },
    { key: "Protective membranes covering the brain", value: "Meninges" },
    { key: "Part of the eye containing rods and cones", value: "Retina" },
    { key: "Photoreceptor responsible for colour vision", value: "Cones" },
    { key: "Photoreceptor responsible for vision in dim light", value: "Rods" },
    { key: "Part of the ear that contains the organ of Corti", value: "Cochlea" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ---------------------------------------------------------- reproduction */

add(
  "bio:reproduction",
  "Reproduction",
  "Moderate",
  [
    { key: "Male reproductive part of a flower", value: "Stamen (androecium)" },
    { key: "Female reproductive part of a flower", value: "Pistil (gynoecium)" },
    { key: "Transfer of pollen to the stigma", value: "Pollination" },
    { key: "Fusion of male and female gametes", value: "Fertilisation" },
    { key: "Characteristic double fertilisation occurs in", value: "Angiosperms" },
    { key: "Ploidy of the endosperm in angiosperms", value: "Triploid (3n)" },
    { key: "Site of sperm production in humans", value: "Seminiferous tubules of the testes" },
    { key: "Site of egg production in humans", value: "Ovary" },
    {
      key: "Normal site of fertilisation in humans",
      value: "Ampullary isthmic junction of the fallopian tube",
    },
    { key: "Hormone detected in a pregnancy test", value: "Human chorionic gonadotropin (hCG)" },
    { key: "Duration of human gestation", value: "About 280 days or nine months" },
    { key: "Structure that supplies nutrition to the foetus", value: "Placenta" },
    { key: "Hormone responsible for milk ejection", value: "Oxytocin" },
    { key: "Hormone responsible for milk production", value: "Prolactin" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ------------------------------------------------------------- molecular */

add(
  "bio:molecular",
  "Molecular Basis of Inheritance",
  "Difficult",
  [
    {
      key: "Experiment that proved DNA is the genetic material",
      value: "Hershey and Chase bacteriophage experiment",
    },
    { key: "Scientist who discovered transformation in bacteria", value: "Frederick Griffith" },
    {
      key: "Scientists who identified the transforming principle as DNA",
      value: "Avery, MacLeod and McCarty",
    },
    { key: "Process of making RNA from DNA", value: "Transcription" },
    { key: "Process of making protein from mRNA", value: "Translation" },
    { key: "Enzyme that synthesises RNA", value: "RNA polymerase" },
    { key: "Enzyme that joins Okazaki fragments", value: "DNA ligase" },
    { key: "Enzyme that unwinds the DNA double helix", value: "Helicase" },
    { key: "Number of nucleotides in one codon", value: "Three" },
    { key: "Total number of codons in the genetic code", value: "64" },
    { key: "Number of stop codons", value: "Three" },
    { key: "Universal start codon", value: "AUG" },
    { key: "Operon model of gene regulation in bacteria", value: "Lac operon of Jacob and Monod" },
    { key: "Project that sequenced the entire human genome", value: "Human Genome Project" },
    {
      key: "Technique used in DNA fingerprinting",
      value: "Analysis of variable number tandem repeats",
    },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ------------------------------------------------------------- ecology */

add(
  "bio:ecology",
  "Ecology and Environment",
  "Moderate",
  [
    { key: "Ten percent law of energy transfer was given by", value: "Lindeman" },
    { key: "Organisms that make their own food", value: "Producers or autotrophs" },
    { key: "Organisms that break down dead organic matter", value: "Decomposers" },
    { key: "Pyramid of energy in any ecosystem is always", value: "Upright" },
    { key: "Pyramid of numbers in a tree ecosystem is", value: "Inverted" },
    { key: "Interaction where both species benefit", value: "Mutualism" },
    { key: "Interaction where one benefits and the other is unaffected", value: "Commensalism" },
    { key: "Interaction where one benefits and the other is harmed", value: "Parasitism" },
    {
      key: "Gradual and predictable change in species composition",
      value: "Ecological succession",
    },
    { key: "Region with very high species richness and endemism", value: "Biodiversity hotspot" },
    { key: "Gas mainly responsible for the greenhouse effect", value: "Carbon dioxide" },
    { key: "Gas responsible for depletion of the ozone layer", value: "Chlorofluorocarbons" },
    { key: "Unit used to measure the thickness of the ozone layer", value: "Dobson unit" },
    { key: "Excessive nutrient enrichment of a water body", value: "Eutrophication" },
    {
      key: "Amount of oxygen consumed by microbes to decompose organic matter",
      value: "Biochemical Oxygen Demand",
    },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ------------------------------------------------------- biotechnology */

add(
  "bio:biotech",
  "Biotechnology",
  "Difficult",
  [
    { key: "Enzyme that cuts DNA at specific sites", value: "Restriction endonuclease" },
    { key: "First restriction enzyme discovered", value: "Hind II" },
    { key: "Enzyme used to join DNA fragments", value: "DNA ligase" },
    { key: "Technique used to amplify DNA in vitro", value: "Polymerase Chain Reaction" },
    { key: "Enzyme used in PCR", value: "Taq polymerase" },
    {
      key: "Bacterium used as a natural genetic engineer of plants",
      value: "Agrobacterium tumefaciens",
    },
    { key: "Most commonly used cloning vector in bacteria", value: "Plasmid" },
    { key: "Technique to separate DNA fragments by size", value: "Gel electrophoresis" },
    { key: "Dye used to stain DNA in gel electrophoresis", value: "Ethidium bromide" },
    { key: "Genetically modified cotton resistant to bollworm", value: "Bt cotton" },
    { key: "Golden rice is enriched with", value: "Provitamin A (beta carotene)" },
    { key: "First recombinant human insulin produced commercially", value: "Humulin" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* -------------------------------------------------------- classification */

add(
  "bio:kingdom",
  "Biological Classification",
  "Moderate",
  [
    { key: "Scientist who proposed the five kingdom classification", value: "R. H. Whittaker" },
    { key: "Scientist who proposed binomial nomenclature", value: "Carolus Linnaeus" },
    { key: "Kingdom that includes all prokaryotes", value: "Monera" },
    { key: "Kingdom that includes unicellular eukaryotes", value: "Protista" },
    { key: "Kingdom that includes moulds, yeasts and mushrooms", value: "Fungi" },
    { key: "Bacteria that can survive in extreme habitats", value: "Archaebacteria" },
    { key: "Organisms with a cell wall of chitin", value: "Fungi" },
    { key: "Association between fungus and the roots of higher plants", value: "Mycorrhiza" },
    { key: "Association between algae and fungi", value: "Lichen" },
    { key: "Acellular infectious agents made of protein only", value: "Prions" },
    { key: "Infectious agents made of free RNA without a protein coat", value: "Viroids" },
    { key: "Largest phylum of the animal kingdom", value: "Arthropoda" },
    { key: "Phylum characterised by a water vascular system", value: "Echinodermata" },
    { key: "Phylum with a true coelom and notochord", value: "Chordata" },
    { key: "Animals with three germ layers", value: "Triploblastic animals" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ------------------------------------------------------------ cell cycle */

add(
  "bio:cell-cycle",
  "Cell Cycle and Cell Division",
  "Moderate",
  [
    { key: "Phase of the cell cycle where DNA replicates", value: "S phase" },
    { key: "Longest phase of the cell cycle", value: "Interphase" },
    { key: "Division that produces two identical daughter cells", value: "Mitosis" },
    { key: "Division that halves the chromosome number", value: "Meiosis" },
    { key: "Stage where chromosomes align at the equator", value: "Metaphase" },
    { key: "Stage where sister chromatids separate", value: "Anaphase" },
    { key: "Stage where the nuclear envelope reforms", value: "Telophase" },
    { key: "Sub stage of prophase I where crossing over occurs", value: "Pachytene" },
    { key: "Structure where crossing over is visible", value: "Chiasma" },
    { key: "Division of the cytoplasm after nuclear division", value: "Cytokinesis" },
    { key: "Quiescent stage where cells exit the cell cycle", value: "G0 phase" },
    { key: "Cell division in which synapsis of homologous chromosomes occurs", value: "Meiosis I" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

/* ------------------------------------------------------------ morphology */

add(
  "bio:morphology",
  "Morphology of Flowering Plants",
  "Easy",
  [
    { key: "Modified stem of potato", value: "Tuber" },
    { key: "Modified stem of ginger", value: "Rhizome" },
    { key: "Modified stem of onion", value: "Bulb" },
    { key: "Modified root of carrot", value: "Conical tap root" },
    { key: "Modified root of radish", value: "Fusiform tap root" },
    { key: "Modified leaf of a pitcher plant", value: "Pitcher for trapping insects" },
    { key: "Modified leaves of cactus", value: "Spines" },
    { key: "Aestivation in which margins do not overlap", value: "Valvate" },
    { key: "Placentation in a pea pod", value: "Marginal" },
    { key: "Placentation in china rose and tomato", value: "Axile" },
    { key: "Type of root system in monocots", value: "Fibrous root system" },
    { key: "Type of venation in monocot leaves", value: "Parallel venation" },
    { key: "Number of cotyledons in a dicot seed", value: "Two" },
    { key: "Inflorescence in which the main axis continues to grow", value: "Racemose" },
  ],
  "Identify: %s?",
  undefined,
  "%k is %v.",
);

export const NEET_BIO_TEMPLATES = templates;
