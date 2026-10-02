/**
 * NEET templates — Biology, Chemistry and Physics at NCERT Class 11-12 level.
 * Biology is fact dominant, Physics and Chemistry mix facts with numericals.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  fmtNum,
  numericOptions,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
  numericTemplate,
  round,
} from "./core";

const NEET = ["NEET", "CBSE Class 11-12 Science", "CUET", "ISC Science"];
const NEET_11 = [...NEET, "CBSE Class 11", "ISC Class 11"];
const NEET_12 = [...NEET, "CBSE Class 12", "ISC Class 12"];
const NEET_WIDE = [...NEET, "JEE Main", "SSC", "Railway"];
const NEET_WIDE_11 = [...NEET_11, "JEE Main", "SSC", "Railway"];
const NEET_WIDE_12 = [...NEET_12, "JEE Main", "SSC", "Railway"];
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
  exams: string[] = NEET,
) {
  templates.push(
    ...factTemplate({ id, subject, topic, difficulty, exams, rows, forward, reverse, explain }),
    matchTemplate({ id, subject, topic, difficulty, exams, rows }),
    statementTemplate({ id, subject, topic, difficulty, exams, rows }),
    statementCountTemplate({ id, subject, topic, difficulty, exams, rows }),
  );
}

function seq(start: number, step: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => start + i * step);
}

/* ============================================================== BIOLOGY */

add(
  "neet:bio:organelle",
  "Biology",
  "Cell Structure and Function",
  "Easy",
  [
    { key: "Mitochondria", value: "Powerhouse of the cell, site of ATP synthesis" },
    { key: "Ribosome", value: "Site of protein synthesis" },
    { key: "Chloroplast", value: "Site of photosynthesis in plant cells" },
    { key: "Lysosome", value: "Suicidal bag containing digestive enzymes" },
    { key: "Golgi apparatus", value: "Packaging and secretion of cellular products" },
    { key: "Rough endoplasmic reticulum", value: "Transport of proteins, studded with ribosomes" },
    { key: "Smooth endoplasmic reticulum", value: "Synthesis of lipids and steroids" },
    { key: "Nucleus", value: "Controls cell activities and stores genetic material" },
    { key: "Vacuole", value: "Storage of water, food and waste, maintains turgor" },
    { key: "Centrosome", value: "Organises spindle fibres during cell division" },
    { key: "Peroxisome", value: "Breaks down hydrogen peroxide and fatty acids" },
    { key: "Nucleolus", value: "Site of ribosomal RNA synthesis" },
  ],
  "What is the main function of the %s?",
  "Which cell organelle performs this function: %s?",
  "The %k is responsible for: %v.",
  NEET_11,
);

add(
  "neet:bio:hormone",
  "Biology",
  "Chemical Coordination",
  "Moderate",
  [
    { key: "Insulin", value: "Pancreas (beta cells of islets of Langerhans)" },
    { key: "Glucagon", value: "Pancreas (alpha cells of islets of Langerhans)" },
    { key: "Thyroxine", value: "Thyroid gland" },
    { key: "Adrenaline", value: "Adrenal medulla" },
    { key: "Cortisol", value: "Adrenal cortex" },
    { key: "Growth hormone", value: "Anterior pituitary" },
    { key: "Oxytocin", value: "Posterior pituitary" },
    { key: "Antidiuretic hormone", value: "Posterior pituitary" },
    { key: "Testosterone", value: "Testes" },
    { key: "Oestrogen", value: "Ovary" },
    { key: "Progesterone", value: "Corpus luteum" },
    { key: "Parathormone", value: "Parathyroid gland" },
    { key: "Melatonin", value: "Pineal gland" },
    { key: "Thymosin", value: "Thymus gland" },
  ],
  "Which gland secretes the hormone %s?",
  undefined,
  "%k is secreted by the %v.",
  NEET_11,
);

add(
  "neet:bio:disease",
  "Biology",
  "Human Health and Disease",
  "Moderate",
  [
    { key: "Malaria", value: "Plasmodium (protozoan)" },
    { key: "Tuberculosis", value: "Mycobacterium tuberculosis (bacterium)" },
    { key: "Cholera", value: "Vibrio cholerae (bacterium)" },
    { key: "Typhoid", value: "Salmonella typhi (bacterium)" },
    { key: "Dengue", value: "Dengue virus spread by Aedes aegypti" },
    { key: "AIDS", value: "Human Immunodeficiency Virus" },
    { key: "Amoebiasis", value: "Entamoeba histolytica (protozoan)" },
    { key: "Ringworm", value: "Fungi such as Trichophyton" },
    { key: "Filariasis", value: "Wuchereria bancrofti (roundworm)" },
    { key: "Ascariasis", value: "Ascaris lumbricoides (roundworm)" },
    { key: "Pneumonia", value: "Streptococcus pneumoniae (bacterium)" },
    { key: "Common cold", value: "Rhinovirus" },
  ],
  "Which pathogen causes %s?",
  "%s is the causative agent of which disease?",
  "%k is caused by %v.",
  NEET_12,
);

add(
  "neet:bio:scientific-name",
  "Biology",
  "Biological Classification",
  "Difficult",
  [
    { key: "Human being", value: "Homo sapiens" },
    { key: "Domestic dog", value: "Canis lupus familiaris" },
    { key: "Domestic cat", value: "Felis catus" },
    { key: "Cow", value: "Bos indicus" },
    { key: "Mango", value: "Mangifera indica" },
    { key: "Rice", value: "Oryza sativa" },
    { key: "Wheat", value: "Triticum aestivum" },
    { key: "Potato", value: "Solanum tuberosum" },
    { key: "Onion", value: "Allium cepa" },
    { key: "Pea", value: "Pisum sativum" },
    { key: "Neem", value: "Azadirachta indica" },
    { key: "Banyan", value: "Ficus benghalensis" },
    { key: "Housefly", value: "Musca domestica" },
    { key: "Fruit fly", value: "Drosophila melanogaster" },
    { key: "Frog", value: "Rana tigrina" },
  ],
  "What is the scientific name of the %s?",
  "%s is the scientific name of which organism?",
  "The scientific name of the %k is %v.",
  NEET_11,
);

add(
  "neet:bio:blood",
  "Biology",
  "Body Fluids and Circulation",
  "Easy",
  [
    { key: "Red blood cells", value: "Transport oxygen using haemoglobin" },
    { key: "White blood cells", value: "Defend the body against infection" },
    { key: "Platelets", value: "Help in blood clotting" },
    { key: "Plasma", value: "Liquid part of blood that transports nutrients and wastes" },
    { key: "Haemoglobin", value: "Iron containing pigment that binds oxygen" },
    { key: "Universal donor blood group", value: "O negative" },
    { key: "Universal recipient blood group", value: "AB positive" },
    { key: "Normal human body temperature", value: "37 degrees Celsius" },
    { key: "Normal resting heart rate of an adult", value: "72 beats per minute" },
    { key: "Largest artery in the human body", value: "Aorta" },
    { key: "Number of chambers in the human heart", value: "Four" },
    { key: "Lifespan of a human red blood cell", value: "About 120 days" },
  ],
  "Identify the correct fact: %s?",
  undefined,
  "%k: %v.",
  NEET_11,
);

add(
  "neet:bio:organ",
  "Biology",
  "Human Physiology",
  "Easy",
  [
    { key: "Largest organ of the human body", value: "Skin" },
    { key: "Largest internal organ of the human body", value: "Liver" },
    { key: "Smallest bone in the human body", value: "Stapes" },
    { key: "Longest bone in the human body", value: "Femur" },
    { key: "Total number of bones in an adult human", value: "206" },
    { key: "Functional unit of the kidney", value: "Nephron" },
    { key: "Functional unit of the lung", value: "Alveolus" },
    { key: "Structural and functional unit of the nervous system", value: "Neuron" },
    { key: "Organ that produces bile", value: "Liver" },
    { key: "Organ that stores bile", value: "Gall bladder" },
    { key: "Gland known as the master gland", value: "Pituitary gland" },
    { key: "Part of the brain that controls balance", value: "Cerebellum" },
    { key: "Part of the brain that controls breathing and heartbeat", value: "Medulla oblongata" },
    { key: "Largest part of the human brain", value: "Cerebrum" },
  ],
  "What is the %s?",
  undefined,
  "The %k is the %v.",
  NEET_11,
);

add(
  "neet:bio:genetics",
  "Biology",
  "Genetics and Evolution",
  "Difficult",
  [
    { key: "Father of Genetics", value: "Gregor Johann Mendel" },
    { key: "Mendel's law of segregation", value: "Alleles separate during gamete formation" },
    {
      key: "Mendel's law of independent assortment",
      value: "Genes for different traits assort independently",
    },
    { key: "Monohybrid phenotypic ratio in F2", value: "3 : 1" },
    { key: "Dihybrid phenotypic ratio in F2", value: "9 : 3 : 3 : 1" },
    { key: "Number of chromosomes in a human somatic cell", value: "46" },
    { key: "Number of chromosomes in a human gamete", value: "23" },
    { key: "Genetic material in most organisms", value: "DNA" },
    { key: "Sugar present in DNA", value: "Deoxyribose" },
    { key: "Base that pairs with adenine in DNA", value: "Thymine" },
    { key: "Base that pairs with guanine in DNA", value: "Cytosine" },
    { key: "Scientists who proposed the DNA double helix", value: "Watson and Crick" },
    { key: "Chromosomal disorder caused by trisomy of chromosome 21", value: "Down syndrome" },
  ],
  "Identify: %s?",
  undefined,
  "%k: %v.",
  NEET_12,
);

add(
  "neet:bio:plant",
  "Biology",
  "Plant Physiology",
  "Moderate",
  [
    { key: "Site of photosynthesis", value: "Chloroplast" },
    { key: "Green pigment that traps light energy", value: "Chlorophyll" },
    { key: "Gas released during photosynthesis", value: "Oxygen" },
    { key: "Gas absorbed during photosynthesis", value: "Carbon dioxide" },
    { key: "Loss of water vapour from leaves", value: "Transpiration" },
    { key: "Tissue that conducts water in plants", value: "Xylem" },
    { key: "Tissue that conducts food in plants", value: "Phloem" },
    { key: "Plant hormone that promotes cell elongation", value: "Auxin" },
    { key: "Plant hormone that promotes fruit ripening", value: "Ethylene" },
    { key: "Plant hormone that induces stomatal closure in stress", value: "Abscisic acid" },
    { key: "Plant hormone that breaks seed dormancy", value: "Gibberellin" },
    { key: "Pores on a leaf used for gas exchange", value: "Stomata" },
  ],
  "Identify the correct term: %s?",
  undefined,
  "%k is %v.",
  NEET_11,
);

/* ============================================================ CHEMISTRY */

add(
  "neet:chem:symbol",
  "Chemistry",
  "Periodic Table",
  "Easy",
  [
    { key: "Sodium", value: "Na" },
    { key: "Potassium", value: "K" },
    { key: "Iron", value: "Fe" },
    { key: "Copper", value: "Cu" },
    { key: "Silver", value: "Ag" },
    { key: "Gold", value: "Au" },
    { key: "Lead", value: "Pb" },
    { key: "Tin", value: "Sn" },
    { key: "Mercury", value: "Hg" },
    { key: "Tungsten", value: "W" },
    { key: "Antimony", value: "Sb" },
    { key: "Calcium", value: "Ca" },
    { key: "Magnesium", value: "Mg" },
    { key: "Aluminium", value: "Al" },
    { key: "Zinc", value: "Zn" },
    { key: "Nitrogen", value: "N" },
    { key: "Phosphorus", value: "P" },
    { key: "Chlorine", value: "Cl" },
    { key: "Helium", value: "He" },
    { key: "Neon", value: "Ne" },
    { key: "Argon", value: "Ar" },
    { key: "Krypton", value: "Kr" },
    { key: "Uranium", value: "U" },
    { key: "Manganese", value: "Mn" },
  ],
  "What is the chemical symbol of %s?",
  "The chemical symbol %s represents which element?",
  "The symbol of %k is %v.",
  NEET_WIDE_11,
);

add(
  "neet:chem:formula",
  "Chemistry",
  "Chemical Formulae",
  "Easy",
  [
    { key: "Common salt", value: "NaCl" },
    { key: "Baking soda", value: "NaHCO3" },
    { key: "Washing soda", value: "Na2CO3.10H2O" },
    { key: "Quick lime", value: "CaO" },
    { key: "Slaked lime", value: "Ca(OH)2" },
    { key: "Limestone", value: "CaCO3" },
    { key: "Plaster of Paris", value: "CaSO4.0.5H2O" },
    { key: "Gypsum", value: "CaSO4.2H2O" },
    { key: "Bleaching powder", value: "CaOCl2" },
    { key: "Caustic soda", value: "NaOH" },
    { key: "Sulphuric acid", value: "H2SO4" },
    { key: "Nitric acid", value: "HNO3" },
    { key: "Hydrochloric acid", value: "HCl" },
    { key: "Ammonia", value: "NH3" },
    { key: "Methane", value: "CH4" },
    { key: "Ethanol", value: "C2H5OH" },
    { key: "Glucose", value: "C6H12O6" },
    { key: "Urea", value: "CO(NH2)2" },
  ],
  "What is the chemical formula of %s?",
  "Which substance has the chemical formula %s?",
  "The chemical formula of %k is %v.",
  NEET_WIDE,
);

{
  const masses = [
    { name: "water (H2O)", mass: 18 },
    { name: "carbon dioxide (CO2)", mass: 44 },
    { name: "sodium chloride (NaCl)", mass: 58.5 },
    { name: "glucose (C6H12O6)", mass: 180 },
    { name: "ammonia (NH3)", mass: 17 },
    { name: "methane (CH4)", mass: 16 },
    { name: "sulphuric acid (H2SO4)", mass: 98 },
    { name: "calcium carbonate (CaCO3)", mass: 100 },
    { name: "oxygen gas (O2)", mass: 32 },
    { name: "nitrogen gas (N2)", mass: 28 },
  ];
  const moles = [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  templates.push(
    numericTemplate({
      id: "neet:chem:mole",
      subject: "Chemistry",
      topic: "Mole Concept",
      difficulty: "Moderate",
      exams: NEET_WIDE_11,
      sizes: [masses.length, moles.length],
      build: ([i, j]) => {
        const entry = masses[i as number] as { name: string; mass: number };
        const n = moles[j as number] as number;
        const grams = round(entry.mass * n, 3);
        const options = numericOptions(
          grams,
          [round(entry.mass / n, 3), entry.mass, round(grams / 2, 3), round(n, 3)],
          (v) => `${fmtNum(v, 3)} g`,
        );
        return {
          prompt: `What is the mass of ${fmtNum(n)} mole${n === 1 ? "" : "s"} of ${entry.name}? (Molar mass = ${fmtNum(entry.mass)} g/mol)`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Mass = number of moles x molar mass = ${fmtNum(n)} x ${fmtNum(entry.mass)} = ${fmtNum(grams, 3)} g.`,
        };
      },
    }),
  );
}

{
  const molesArr = [0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3];
  const volumes = [0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.25, 1.5, 2, 2.5];
  templates.push(
    numericTemplate({
      id: "neet:chem:molarity",
      subject: "Chemistry",
      topic: "Solutions",
      difficulty: "Moderate",
      exams: NEET_WIDE_12,
      sizes: [molesArr.length, volumes.length],
      build: ([i, j]) => {
        const n = molesArr[i as number] as number;
        const v = volumes[j as number] as number;
        const molarity = round(n / v, 3);
        const options = numericOptions(
          molarity,
          [round(v / n, 3), round(n * v, 3), round(molarity * 2, 3)],
          (x) => `${fmtNum(x, 3)} M`,
        );
        return {
          prompt: `${fmtNum(n)} mole of solute is dissolved to make ${fmtNum(v)} litre of solution. What is the molarity?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Molarity = moles of solute / volume in litres = ${fmtNum(n)}/${fmtNum(v)} = ${fmtNum(molarity, 3)} M.`,
        };
      },
    }),
  );
}

{
  const powers = seq(1, 1, 13);
  templates.push(
    numericTemplate({
      id: "neet:chem:ph",
      subject: "Chemistry",
      topic: "Acids Bases and Salts",
      difficulty: "Moderate",
      exams: NEET_WIDE_11,
      sizes: [powers.length, 2],
      build: ([i, j]) => {
        const p = powers[i as number] as number;
        const acidic = j === 0;
        const ph = acidic ? p : 14 - p;
        if (ph < 0 || ph > 14) return null;
        const conc = `1 x 10^-${p}`;
        const nature = ph < 7 ? "acidic" : ph > 7 ? "basic" : "neutral";
        const options = numericOptions(ph, [14 - ph, p, 7], (v) => fmtNum(v));
        return {
          prompt: acidic
            ? `A solution has a hydrogen ion concentration of ${conc} M. What is its pH?`
            : `A solution has a hydroxide ion concentration of ${conc} M. What is its pH?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: acidic
            ? `pH = -log[H+] = -log(10^-${p}) = ${p}. The solution is ${nature}.`
            : `pOH = -log[OH-] = ${p}, so pH = 14 - ${p} = ${ph}. The solution is ${nature}.`,
        };
      },
    }),
  );
}

/* ============================================================== PHYSICS */

add(
  "neet:phy:law",
  "Physics",
  "Laws and Principles",
  "Moderate",
  [
    {
      key: "Newton's first law of motion",
      value: "A body stays at rest or in uniform motion unless acted on by an external force",
    },
    {
      key: "Newton's second law of motion",
      value: "Force equals rate of change of momentum, F = ma",
    },
    {
      key: "Newton's third law of motion",
      value: "Every action has an equal and opposite reaction",
    },
    { key: "Ohm's law", value: "V = IR at constant temperature" },
    { key: "Archimedes' principle", value: "Upthrust equals the weight of fluid displaced" },
    {
      key: "Pascal's law",
      value: "Pressure applied to an enclosed fluid is transmitted equally in all directions",
    },
    { key: "Bernoulli's principle", value: "Faster moving fluid exerts lower pressure" },
    { key: "Hooke's law", value: "Within the elastic limit stress is proportional to strain" },
    {
      key: "Coulomb's law",
      value: "Force between two charges varies inversely with the square of the distance",
    },
    {
      key: "Faraday's law of induction",
      value: "Induced EMF equals the rate of change of magnetic flux",
    },
    { key: "Lenz's law", value: "Induced current opposes the change producing it" },
    { key: "Law of conservation of energy", value: "Energy can neither be created nor destroyed" },
  ],
  "What does %s state?",
  undefined,
  "%k states that %v.",
  NEET_WIDE,
);

{
  const us = seq(0, 2, 16);
  const as = seq(1, 1, 12);
  const ts = seq(2, 1, 12);
  templates.push(
    numericTemplate({
      id: "neet:phy:kinematics",
      subject: "Physics",
      topic: "Motion in a Straight Line",
      difficulty: "Easy",
      exams: NEET_WIDE_11,
      sizes: [us.length, as.length, ts.length, 2],
      build: ([i, j, k, m]) => {
        const u = us[i as number] as number;
        const a = as[j as number] as number;
        const t = ts[k as number] as number;
        const wantV = m === 0;
        const v = u + a * t;
        const s = round(u * t + 0.5 * a * t * t);
        const value = wantV ? v : s;
        const options = numericOptions(
          value,
          [wantV ? s : v, u + a, round(a * t * t), round(value / 2)],
          (x) => `${fmtNum(x)} ${wantV ? "m/s" : "m"}`,
        );
        return {
          prompt: `A body starts with an initial velocity of ${u} m/s and moves with a uniform acceleration of ${a} m/s^2 for ${t} seconds. Find the ${wantV ? "final velocity" : "distance travelled"}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: wantV
            ? `v = u + at = ${u} + ${a} x ${t} = ${v} m/s.`
            : `s = ut + (1/2)at^2 = ${u} x ${t} + 0.5 x ${a} x ${t}^2 = ${fmtNum(s)} m.`,
        };
      },
    }),
  );
}

{
  const volts = seq(2, 1, 24);
  const ohms = seq(2, 1, 24);
  templates.push(
    numericTemplate({
      id: "neet:phy:ohm",
      subject: "Physics",
      topic: "Current Electricity",
      difficulty: "Easy",
      exams: NEET_WIDE_12,
      sizes: [volts.length, ohms.length, 2],
      build: ([i, j, k]) => {
        const v = volts[i as number] as number;
        const r = ohms[j as number] as number;
        const wantI = k === 0;
        const current = round(v / r, 3);
        const power = round((v * v) / r, 3);
        const value = wantI ? current : power;
        const options = numericOptions(
          value,
          [wantI ? power : current, round(v * r, 3), round(r / v, 3)],
          (x) => `${fmtNum(x, 3)} ${wantI ? "A" : "W"}`,
        );
        return {
          prompt: `A resistor of ${r} ohm is connected across a ${v} V supply. Find the ${wantI ? "current through it" : "power dissipated in it"}.`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: wantI
            ? `By Ohm's law, current is voltage divided by resistance: I = V/R = ${v}/${r} = ${fmtNum(current, 3)} A.`
            : `Using P = VI and Ohm's law, power is P = V^2/R = ${v}^2/${r} = ${fmtNum(power, 3)} W.`,
        };
      },
    }),
  );
}

{
  const masses = seq(1, 1, 20);
  const accs = seq(1, 1, 15);
  templates.push(
    numericTemplate({
      id: "neet:phy:force",
      subject: "Physics",
      topic: "Laws of Motion",
      difficulty: "Easy",
      exams: NEET_WIDE_11,
      sizes: [masses.length, accs.length],
      build: ([i, j]) => {
        const m = masses[i as number] as number;
        const a = accs[j as number] as number;
        const f = m * a;
        const options = numericOptions(
          f,
          [m + a, round(m / a, 3), round(a / m, 3), f * 2],
          (v) => `${fmtNum(v)} N`,
        );
        return {
          prompt: `What force is required to give a body of mass ${m} kg an acceleration of ${a} m/s^2?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `By Newton's second law, F = ma = ${m} x ${a} = ${f} N.`,
        };
      },
    }),
  );
}

{
  const objDist = seq(15, 3, 20);
  const focal = seq(5, 1, 12);
  templates.push(
    numericTemplate({
      id: "neet:phy:lens",
      subject: "Physics",
      topic: "Ray Optics",
      difficulty: "Difficult",
      exams: NEET_WIDE_12,
      sizes: [objDist.length, focal.length],
      build: ([i, j]) => {
        const u = objDist[i as number] as number;
        const f = focal[j as number] as number;
        if (u <= f) return null;
        const v = round((u * f) / (u - f), 3);
        const options = numericOptions(
          v,
          [round((u * f) / (u + f), 3), u - f, u + f, round(u / f, 3)],
          (x) => `${fmtNum(x, 3)} cm`,
        );
        return {
          prompt: `An object is placed ${u} cm from a convex lens of focal length ${f} cm. At what distance from the lens is the image formed?`,
          answer: options.answer,
          distractors: options.distractors,
          explanation: `Using 1/v - 1/u = 1/f with the real-is-positive convention, v = uf/(u - f) = ${u} x ${f}/(${u} - ${f}) = ${fmtNum(v, 3)} cm.`,
        };
      },
    }),
  );
}

export const NEET_TEMPLATES = templates;
