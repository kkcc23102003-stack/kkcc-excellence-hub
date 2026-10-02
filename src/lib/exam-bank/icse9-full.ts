/**
 * ICSE Class 9 and 10 — completing the chapter list against the CISCE course
 * structure and the prescribed Selina chapter order.
 *
 * Class 9 Biology runs to nineteen chapters; the bank was missing respiration
 * in plants, the economic importance of bacteria and fungi, the skin,
 * ecosystems, and aids to health. Class 9 Chemistry needs elements compounds
 * and mixtures, physical and chemical changes as its own chapter, and
 * practical chemistry. Class 9 Physics keeps upthrust and floatation apart
 * from pressure in fluids, and magnetism apart from current electricity.
 * Class 10 Chemistry and Physics needed the same chapters unmerged.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const C9 = ["ICSE Class 9", "ICSE MCQ", "ICSE Class 9-10"];
const C10 = ["ICSE Class 10", "ICSE MCQ", "ICSE Class 9-10"];

const templates: Template[] = [];
const bio9 = chapterFactory(templates, "Biology Class 9", C9);
const chem9 = chapterFactory(templates, "Chemistry Class 9", C9);
const phy9 = chapterFactory(templates, "Physics Class 9", C9);
const chem10 = chapterFactory(templates, "Chemistry Class 10", C10);
const phy10 = chapterFactory(templates, "Physics Class 10", C10);

/* ================================================ Biology Class 9 ===== */

bio9(
  "icse:b9:plant-respiration",
  "Respiration in Plants",
  "In plant respiration, what is %s?",
  "%k is %v.",
  [
    { key: "Respiration", value: "The oxidation of food inside cells to release energy" },
    {
      key: "Aerobic respiration",
      value: "Respiration in the presence of oxygen, giving carbon dioxide, water and much energy",
    },
    {
      key: "Anaerobic respiration in plants",
      value: "Respiration without oxygen, giving ethanol, carbon dioxide and little energy",
    },
    {
      key: "Site of respiration in a cell",
      value: "The mitochondrion, called the powerhouse of the cell",
    },
    { key: "Energy currency of the cell", value: "ATP, adenosine triphosphate" },
    { key: "Gaseous exchange in leaves", value: "Through the stomata by simple diffusion" },
    { key: "Gaseous exchange in stems", value: "Through the lenticels of woody stems" },
    {
      key: "Gaseous exchange in roots",
      value: "Through the root hairs from air in the soil spaces",
    },
    { key: "Glycolysis", value: "The breakdown of glucose to pyruvic acid in the cytoplasm" },
    {
      key: "Fermentation",
      value: "Anaerobic breakdown of sugar by yeast into ethanol and carbon dioxide",
    },
  ],
  [
    {
      key: "Difference between respiration and combustion",
      value:
        "Respiration is a slow stepwise enzyme controlled process while combustion is rapid and uncontrolled",
    },
    {
      key: "Difference between respiration and photosynthesis",
      value:
        "Respiration releases energy and gives out carbon dioxide while photosynthesis stores energy and takes it in",
    },
    {
      key: "Respiratory quotient",
      value: "The ratio of carbon dioxide given out to oxygen taken in",
    },
    {
      key: "Experiment to show carbon dioxide is released",
      value:
        "Germinating seeds in a flask with potassium hydroxide draw water up the delivery tube",
    },
    {
      key: "Compensation point",
      value:
        "The light intensity at which the rates of photosynthesis and respiration are exactly equal",
    },
  ],
);

bio9(
  "icse:b9:bacteria-fungi",
  "Economic Importance of Bacteria and Fungi",
  "About the uses and harms of microbes, what is %s?",
  "%k is %v.",
  [
    { key: "Bacteria", value: "Unicellular prokaryotes without a true nucleus" },
    {
      key: "Fungi",
      value: "Heterotrophic eukaryotes with a chitinous cell wall and no chlorophyll",
    },
    { key: "Saprophyte", value: "An organism that feeds on dead and decaying organic matter" },
    {
      key: "Nitrogen fixing bacteria",
      value: "Rhizobium in root nodules of legumes, which fixes atmospheric nitrogen",
    },
    {
      key: "Role of bacteria in curd formation",
      value: "Lactobacillus converts the lactose of milk into lactic acid",
    },
    {
      key: "Use of yeast in baking",
      value: "It ferments sugar to carbon dioxide, which makes the dough rise",
    },
    { key: "Source of penicillin", value: "The fungus Penicillium notatum" },
    {
      key: "Decomposers",
      value: "Bacteria and fungi that break down dead matter and return nutrients to the soil",
    },
    { key: "Food spoilage", value: "The decay of food by the growth of bacteria and fungi" },
    {
      key: "Pasteurisation",
      value: "Heating milk to kill pathogenic bacteria without changing its taste",
    },
  ],
  [
    {
      key: "Role of bacteria in the nitrogen cycle",
      value:
        "Nitrifying bacteria convert ammonia to nitrite and nitrate while denitrifying bacteria return nitrogen to the air",
    },
    {
      key: "Bacterial diseases in humans",
      value: "Tuberculosis, typhoid, cholera, tetanus and diphtheria",
    },
    { key: "Fungal diseases in humans", value: "Ringworm, athlete's foot and candidiasis" },
    {
      key: "Retting of fibres",
      value: "Bacterial decay of the soft tissue of jute and flax stems to free the fibres",
    },
    {
      key: "Methods of food preservation",
      value: "Drying, salting, sugaring, refrigeration, canning and adding chemical preservatives",
    },
  ],
);

bio9(
  "icse:b9:skin",
  "Skin — Structure and Functions",
  "About the human skin, what is %s?",
  "%k is %v.",
  [
    { key: "Skin", value: "The largest organ of the body, forming its protective outer covering" },
    { key: "Epidermis", value: "The outer layer of the skin, made of stratified epithelium" },
    {
      key: "Dermis",
      value: "The inner thicker layer of skin containing blood vessels, nerves and glands",
    },
    {
      key: "Malpighian layer",
      value: "The innermost living layer of the epidermis where new cells are made",
    },
    {
      key: "Melanin",
      value:
        "The pigment of the Malpighian layer that gives skin its colour and screens ultraviolet light",
    },
    {
      key: "Sebaceous gland",
      value: "The gland that secretes sebum, an oil that keeps skin and hair supple",
    },
    {
      key: "Sweat gland",
      value: "The coiled gland in the dermis that secretes sweat for cooling and excretion",
    },
    { key: "Composition of sweat", value: "Water with small amounts of salt and urea" },
    {
      key: "Function of subcutaneous fat",
      value: "It insulates the body and acts as a store of energy",
    },
    {
      key: "Sensory function of skin",
      value: "It carries receptors for touch, pressure, pain, heat and cold",
    },
  ],
  [
    {
      key: "Role of skin in temperature regulation",
      value:
        "Sweating cools by evaporation, and blood vessels dilate to lose heat or constrict to conserve it",
    },
    { key: "Vitamin made in the skin", value: "Vitamin D, formed on exposure to sunlight" },
    {
      key: "Reason the skin is called the jack of all trades",
      value: "It protects, excretes, senses, regulates temperature and makes vitamin D",
    },
    {
      key: "Goose flesh",
      value:
        "Contraction of the erector pili muscles in cold, which traps a layer of insulating air",
    },
    {
      key: "Difference between sweat and urine",
      value:
        "Both contain water, salt and urea, but urine is far more concentrated and contains no lactic acid",
    },
  ],
);

bio9(
  "icse:b9:ecosystems",
  "Ecosystems and Diversity in Living Organisms",
  "In the study of ecosystems, what is %s?",
  "%k is %v.",
  [
    {
      key: "Ecosystem",
      value:
        "A community of living organisms together with the non living environment they interact with",
    },
    {
      key: "Biotic components",
      value: "The living parts of an ecosystem, that is producers, consumers and decomposers",
    },
    {
      key: "Abiotic components",
      value: "The non living parts such as light, temperature, water, air and soil",
    },
    { key: "Producer", value: "A green plant that makes its own food by photosynthesis" },
    { key: "Herbivore", value: "A primary consumer that feeds only on plants" },
    { key: "Carnivore", value: "A consumer that feeds on other animals" },
    { key: "Food chain", value: "A linear sequence showing who eats whom and how energy flows" },
    { key: "Food web", value: "A network of interconnected food chains in an ecosystem" },
    { key: "Trophic level", value: "Each feeding step in a food chain" },
    { key: "Habitat", value: "The place where an organism naturally lives" },
  ],
  [
    {
      key: "Ten per cent law",
      value: "Only about ten per cent of energy passes from one trophic level to the next",
    },
    {
      key: "Reason food chains rarely exceed four or five links",
      value:
        "So little energy is left after successive ten per cent transfers that no further level can be supported",
    },
    {
      key: "Ecological pyramid of numbers",
      value: "A diagram showing the number of organisms at each trophic level",
    },
    {
      key: "Niche",
      value: "The functional role an organism plays in its ecosystem, not merely where it lives",
    },
    {
      key: "Difference between a food chain and a food web",
      value:
        "A food chain is a single straight pathway while a food web is many interlinked chains and is more realistic",
    },
  ],
);

bio9(
  "icse:b9:aids-to-health",
  "Aids to Health and Diseases",
  "In health education, what is %s?",
  "%k is %v.",
  [
    {
      key: "Communicable disease",
      value: "A disease that spreads from an infected person to a healthy one",
    },
    {
      key: "Non communicable disease",
      value: "A disease that does not spread from person to person, such as diabetes",
    },
    { key: "Pathogen", value: "A micro organism that causes disease" },
    {
      key: "Vector",
      value: "An organism that carries a pathogen from one host to another, such as a mosquito",
    },
    {
      key: "Carrier",
      value: "A person who harbours a pathogen without showing symptoms but can infect others",
    },
    {
      key: "Incubation period",
      value: "The time between entry of the pathogen and the appearance of symptoms",
    },
    { key: "Antibody", value: "A protein made by the body that neutralises a specific antigen" },
    { key: "Antigen", value: "Any foreign substance that triggers an immune response" },
    { key: "Vaccination", value: "Giving a weakened or killed pathogen to build active immunity" },
    {
      key: "Antibiotic",
      value: "A medicine that kills or stops the growth of bacteria but not of viruses",
    },
  ],
  [
    {
      key: "Difference between disinfectant and antiseptic",
      value:
        "A disinfectant is used on non living surfaces while an antiseptic is mild enough for living tissue",
    },
    {
      key: "Natural passive immunity",
      value: "Antibodies passed from mother to child through the placenta or breast milk",
    },
    {
      key: "Artificial active immunity",
      value: "Immunity developed after vaccination, which is long lasting",
    },
    {
      key: "Reason antibiotics do not work against viral infections",
      value:
        "Viruses have no cell wall or independent metabolic machinery for antibiotics to attack",
    },
    {
      key: "Function of the World Health Organisation",
      value: "It directs international health work, sets standards and coordinates disease control",
    },
  ],
);

/* ============================================== Chemistry Class 9 ===== */

chem9(
  "icse:c9:elements-mixtures",
  "Elements, Compounds and Mixtures",
  "In the classification of matter, what is %s?",
  "%k is %v.",
  [
    { key: "Element", value: "A pure substance made of only one kind of atom" },
    {
      key: "Compound",
      value:
        "A pure substance formed when two or more elements combine chemically in a fixed ratio",
    },
    {
      key: "Mixture",
      value: "A material containing two or more substances not chemically combined",
    },
    {
      key: "Homogeneous mixture",
      value: "A mixture of uniform composition throughout, such as a salt solution",
    },
    {
      key: "Heterogeneous mixture",
      value: "A mixture of non uniform composition, such as sand and iron filings",
    },
    {
      key: "Metalloid",
      value: "An element showing properties of both metals and non metals, such as silicon",
    },
    {
      key: "Separation by sublimation",
      value: "Used when one component sublimes, as with camphor and salt",
    },
    {
      key: "Separation by a magnet",
      value: "Used when one component is magnetic, as with iron filings and sulphur",
    },
    {
      key: "Separation by fractional distillation",
      value: "Used for two miscible liquids with different boiling points",
    },
    {
      key: "Chromatography",
      value:
        "A method of separating dissolved substances by their different rates of movement on a medium",
    },
  ],
  [
    {
      key: "Difference between a compound and a mixture",
      value:
        "A compound has fixed composition and new properties while a mixture keeps the properties of its components",
    },
    {
      key: "Reason a solution is called a homogeneous mixture",
      value: "The solute particles are dispersed evenly and cannot be seen or filtered out",
    },
    {
      key: "Separating funnel use",
      value: "Separating two immiscible liquids of different densities, such as oil and water",
    },
    {
      key: "Difference between distillation and fractional distillation",
      value:
        "Distillation separates a solid from a liquid while fractional distillation separates miscible liquids",
    },
    {
      key: "Tyndall effect in a colloid",
      value: "Colloidal particles scatter a light beam, while a true solution does not",
    },
  ],
);

chem9(
  "icse:c9:physical-chemical",
  "Physical and Chemical Changes",
  "About changes in matter, what is %s?",
  "%k is %v.",
  [
    {
      key: "Physical change",
      value: "A change in which no new substance is formed and which is usually reversible",
    },
    { key: "Chemical change", value: "A change in which one or more new substances are formed" },
    {
      key: "Combination reaction",
      value: "A reaction in which two or more substances combine to form a single product",
    },
    {
      key: "Decomposition reaction",
      value: "A reaction in which a single compound breaks into two or more products",
    },
    {
      key: "Displacement reaction",
      value: "A reaction in which a more reactive element displaces a less reactive one",
    },
    {
      key: "Double displacement reaction",
      value: "A reaction in which two compounds exchange their ions",
    },
    { key: "Exothermic reaction", value: "A reaction that gives out heat" },
    { key: "Endothermic reaction", value: "A reaction that absorbs heat" },
    {
      key: "Burning",
      value: "A chemical change in which a substance combines with oxygen giving heat and light",
    },
    {
      key: "Conditions for a chemical change",
      value: "Heat, light, electricity, pressure, a catalyst or the presence of water",
    },
  ],
  [
    {
      key: "Reason rusting is a chemical change",
      value:
        "A new substance, hydrated iron oxide, is formed and the change cannot be reversed physically",
    },
    {
      key: "Reason melting of ice is a physical change",
      value: "Only the state changes; the substance remains water and the change is reversible",
    },
    {
      key: "Photochemical reaction",
      value: "A reaction brought about by light, such as the decomposition of silver chloride",
    },
    {
      key: "Electrolytic decomposition",
      value:
        "A decomposition reaction brought about by passing electricity, as in the electrolysis of water",
    },
    {
      key: "Kindling temperature",
      value: "The lowest temperature to which a substance must be heated before it catches fire",
    },
  ],
);

/* ================================================ Physics Class 9 ===== */

phy9(
  "icse:p9:upthrust",
  "Upthrust, Archimedes' Principle and Floatation",
  "About upthrust and floatation, what is %s?",
  "%k is %v.",
  [
    { key: "Upthrust", value: "The upward force a fluid exerts on a body immersed in it" },
    {
      key: "Archimedes' principle",
      value: "The upthrust on an immersed body equals the weight of the fluid it displaces",
    },
    { key: "Apparent weight", value: "The true weight of a body minus the upthrust acting on it" },
    {
      key: "Law of floatation",
      value: "A floating body displaces a weight of fluid equal to its own weight",
    },
    {
      key: "Relative density",
      value: "The ratio of the density of a substance to the density of water",
    },
    {
      key: "Condition for a body to sink",
      value: "Its density is greater than the density of the fluid",
    },
    {
      key: "Condition for a body to float",
      value: "Its density is less than or equal to the density of the fluid",
    },
    {
      key: "Hydrometer",
      value: "An instrument that measures the relative density of a liquid by floatation",
    },
    {
      key: "Centre of buoyancy",
      value:
        "The point through which the upthrust acts, the centre of gravity of the displaced fluid",
    },
    {
      key: "Density of water",
      value: "One thousand kilograms per cubic metre, or one gram per cubic centimetre",
    },
  ],
  [
    {
      key: "Reason a body weighs less in water",
      value: "The upthrust of the water acts upward and opposes part of its weight",
    },
    {
      key: "Reason ice floats with most of its volume submerged",
      value:
        "The density of ice is about nine tenths that of water, so nine tenths must be submerged",
    },
    {
      key: "Condition for stable equilibrium of a floating body",
      value: "The centre of buoyancy must lie above the centre of gravity",
    },
    {
      key: "Reason a ship floats higher in sea water",
      value: "Sea water is denser, so less volume need be displaced to balance the same weight",
    },
    {
      key: "Working of a submarine",
      value: "Ballast tanks are flooded to increase weight and sink, and blown with air to rise",
    },
  ],
);

phy9(
  "icse:p9:magnetism",
  "Magnetism",
  "In magnetism, what is %s?",
  "%k is %v.",
  [
    {
      key: "Magnet",
      value: "A body that attracts iron and points north south when freely suspended",
    },
    {
      key: "Magnetic poles",
      value: "The two regions of a magnet where the attracting power is strongest",
    },
    { key: "Basic law of magnetism", value: "Like poles repel and unlike poles attract" },
    {
      key: "Surest test of magnetism",
      value: "Repulsion, because attraction also occurs with unmagnetised iron",
    },
    { key: "Magnetic substances", value: "Iron, nickel, cobalt and their alloys" },
    {
      key: "Induced magnetism",
      value: "Magnetism developed temporarily in a magnetic material near a magnet",
    },
    {
      key: "Magnetic field",
      value: "The region around a magnet in which its influence can be detected",
    },
    {
      key: "Magnetic field lines",
      value: "Imaginary lines running from north to south outside a magnet that map the field",
    },
    { key: "Neutral point", value: "A point where the resultant magnetic field is zero" },
    {
      key: "Electromagnet",
      value: "A temporary magnet made by passing current through a coil wound on soft iron",
    },
  ],
  [
    {
      key: "Reason magnetic field lines never intersect",
      value: "At a point of intersection the field would have two directions, which is impossible",
    },
    {
      key: "Difference between a temporary and a permanent magnet",
      value: "Soft iron magnetises and demagnetises easily while steel retains magnetism",
    },
    {
      key: "Magnetic keepers",
      value:
        "Soft iron pieces placed across the poles of stored magnets to form closed loops and prevent self demagnetisation",
    },
    {
      key: "Method of demagnetisation",
      value:
        "Heating, hammering or withdrawing the magnet slowly from an alternating current solenoid",
    },
    {
      key: "Reason soft iron is used for an electromagnet core",
      value: "It has high permeability and loses its magnetism as soon as the current stops",
    },
  ],
);

/* ============================================= Chemistry Class 10 ===== */

chem10(
  "icse:c10:chemical-bonding",
  "Chemical Bonding",
  "In chemical bonding, what is %s?",
  "%k is %v.",
  [
    {
      key: "Electrovalent bond",
      value: "A bond formed by the complete transfer of electrons from a metal to a non metal",
    },
    {
      key: "Covalent bond",
      value: "A bond formed by the mutual sharing of one or more pairs of electrons",
    },
    {
      key: "Coordinate bond",
      value: "A covalent bond in which both electrons of the shared pair come from one atom",
    },
    {
      key: "Duplet rule",
      value: "The tendency of hydrogen and helium to attain two electrons in the outermost shell",
    },
    {
      key: "Octet rule",
      value: "The tendency of atoms to attain eight electrons in the outermost shell",
    },
    {
      key: "Example of an electrovalent compound",
      value: "Sodium chloride, magnesium oxide and calcium chloride",
    },
    {
      key: "Example of a covalent compound",
      value: "Hydrogen chloride, methane, ammonia and water",
    },
    {
      key: "Polar covalent compound",
      value:
        "A covalent compound in which the shared pair is unequally attracted, such as hydrogen chloride",
    },
    { key: "Example of a coordinate bond", value: "The ammonium ion and the hydronium ion" },
    {
      key: "Conductivity of electrovalent compounds",
      value: "They conduct electricity when molten or in aqueous solution, not in the solid state",
    },
  ],
  [
    {
      key: "Reason electrovalent compounds have high melting points",
      value: "Strong electrostatic forces hold the oppositely charged ions in a rigid lattice",
    },
    {
      key: "Reason covalent compounds are usually poor conductors",
      value: "They consist of neutral molecules and provide no free ions or electrons",
    },
    {
      key: "Reason hydrogen chloride ionises in water but not in toluene",
      value: "Water has a high dielectric constant and solvates the ions, while toluene does not",
    },
    {
      key: "Electron dot structure of nitrogen",
      value: "Two nitrogen atoms share three pairs, forming a triple bond",
    },
    {
      key: "Difference between polar and non polar covalent bonds",
      value:
        "A polar bond joins atoms of different electronegativity so the charge is unevenly shared",
    },
  ],
);

phy10(
  "icse:p10:radioactivity",
  "Radioactivity and Modern Physics",
  "In radioactivity, what is %s?",
  "%k is %v.",
  [
    {
      key: "Radioactivity",
      value: "The spontaneous disintegration of an unstable nucleus with the emission of radiation",
    },
    {
      key: "Alpha particle",
      value:
        "A helium nucleus with two protons and two neutrons, carrying a double positive charge",
    },
    {
      key: "Beta particle",
      value: "A fast moving electron emitted when a neutron converts to a proton",
    },
    {
      key: "Gamma radiation",
      value: "High energy electromagnetic radiation with no charge and no mass",
    },
    {
      key: "Most penetrating radiation",
      value: "Gamma radiation, which needs thick lead or concrete to stop it",
    },
    {
      key: "Least penetrating radiation",
      value: "The alpha particle, stopped by a sheet of paper",
    },
    {
      key: "Effect of alpha emission on mass number",
      value: "The mass number falls by four and the atomic number by two",
    },
    {
      key: "Effect of beta emission on atomic number",
      value: "The atomic number rises by one while the mass number stays the same",
    },
    {
      key: "Half life",
      value: "The time in which half the nuclei of a radioactive sample disintegrate",
    },
    {
      key: "Nuclear fission",
      value: "The splitting of a heavy nucleus into lighter nuclei with release of energy",
    },
  ],
  [
    {
      key: "Nuclear fusion",
      value: "The joining of light nuclei into a heavier one, the source of the sun's energy",
    },
    {
      key: "Reason gamma emission does not change the atom",
      value: "It carries away only energy, so neither mass number nor atomic number changes",
    },
    {
      key: "Background radiation",
      value: "The low level radiation always present from cosmic rays, rocks and the atmosphere",
    },
    {
      key: "Radioactive isotope used in cancer therapy",
      value: "Cobalt sixty, which emits gamma rays",
    },
    {
      key: "Safety precaution when handling radioactive material",
      value: "Use lead shielding, remote handling tongs and limit exposure time",
    },
  ],
);

export const ICSE9_FULL_TEMPLATES = templates;
