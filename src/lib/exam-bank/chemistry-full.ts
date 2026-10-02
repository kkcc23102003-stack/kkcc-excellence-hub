/**
 * Chemistry expansion. The older NCERT chapter templates are retained; exact
 * ISC Class 11/12 tags are applied only to chapters verified against the
 * current CISCE syllabus. Other legacy chapters remain available on their
 * broad exam tags without being advertised as ISC class-level content.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const CHEM_BROAD = [
  "NEET",
  "JEE Main",
  "JEE Advanced",
  "CBSE Class 11-12 Science",
  "CUET",
  "ISC Science",
];
const CHEM_11 = [...CHEM_BROAD, "CBSE Class 11", "ISC Class 11"];
const CHEM_12 = [...CHEM_BROAD, "CBSE Class 12", "ISC Class 12"];
const CHEM_WIDE = ["NEET", "JEE Main", "JEE Advanced", "CUET", "SSC", "Railway", "Banking"];

const templates: Template[] = [];
const ch = chapterFactory(templates, "Chemistry", ["NEET", "JEE Main", "JEE Advanced", "CUET"]);
const ch11 = chapterFactory(templates, "Chemistry", CHEM_11);
const ch12 = chapterFactory(templates, "Chemistry", CHEM_12);
const chw = chapterFactory(templates, "Chemistry", CHEM_WIDE);

/* ======================================================== Class 11 ===== */

ch11(
  "chem:atom-structure",
  "Structure of Atom",
  "In atomic structure, what is %s?",
  "%k is %v.",
  [
    {
      key: "Cathode rays",
      value: "A stream of electrons discovered by J. J. Thomson in a discharge tube",
    },
    {
      key: "Charge to mass ratio of an electron",
      value: "1.758 times ten to the power eleven coulomb per kilogram",
    },
    {
      key: "Millikan's oil drop experiment",
      value:
        "The experiment that measured the charge on an electron as 1.602 times ten to the power minus nineteen coulomb",
    },
    {
      key: "Rutherford's gold foil experiment",
      value:
        "The alpha scattering experiment that revealed a small dense positively charged nucleus",
    },
    {
      key: "Bohr's postulate of quantisation",
      value: "Angular momentum of an electron is an integral multiple of h divided by 2 pi",
    },
    {
      key: "Principal quantum number",
      value: "n, which fixes the shell and the main energy of the electron",
    },
    {
      key: "Azimuthal quantum number",
      value: "l, which fixes the subshell and the shape of the orbital",
    },
    {
      key: "Magnetic quantum number",
      value: "m, which fixes the orientation of the orbital in space",
    },
    {
      key: "Pauli exclusion principle",
      value: "No two electrons in an atom can have all four quantum numbers the same",
    },
    {
      key: "Hund's rule of maximum multiplicity",
      value: "Pairing in degenerate orbitals begins only after each is singly filled",
    },
  ],
  [
    {
      key: "Heisenberg uncertainty principle",
      value:
        "Position and momentum of an electron cannot both be measured exactly at the same instant",
    },
    {
      key: "de Broglie relation",
      value:
        "Wavelength equals Planck's constant divided by momentum, giving matter its wave nature",
    },
    {
      key: "Aufbau principle",
      value:
        "Orbitals are filled in order of increasing n plus l value, and for equal values the lower n first",
    },
    {
      key: "Reason for the stability of half filled orbitals",
      value: "Symmetrical distribution and greater exchange energy lower the overall energy",
    },
    {
      key: "Balmer series",
      value: "The visible emission lines of hydrogen from transitions ending at n equals 2",
    },
  ],
);

ch11(
  "chem:bonding",
  "Chemical Bonding and Molecular Structure",
  "In chemical bonding, what is %s?",
  "%k is %v.",
  [
    {
      key: "Ionic bond",
      value:
        "The electrostatic force between oppositely charged ions formed by transfer of electrons",
    },
    {
      key: "Covalent bond",
      value: "A bond formed by the mutual sharing of electron pairs between two atoms",
    },
    {
      key: "Coordinate bond",
      value: "A covalent bond in which both shared electrons come from the same atom",
    },
    {
      key: "Octet rule",
      value:
        "Atoms tend to gain, lose or share electrons to attain eight electrons in the valence shell",
    },
    {
      key: "Bond order",
      value: "Half the difference between the number of bonding and antibonding electrons",
    },
    {
      key: "Sigma bond",
      value: "A bond formed by head on overlap of orbitals along the internuclear axis",
    },
    { key: "Pi bond", value: "A bond formed by sideways overlap of parallel p orbitals" },
    {
      key: "Hybridisation of methane",
      value: "sp3, giving a tetrahedral shape with bond angles of 109 degrees 28 minutes",
    },
    {
      key: "Shape of an sp2 hybridised molecule",
      value: "Trigonal planar with bond angles of 120 degrees",
    },
    {
      key: "Hydrogen bond",
      value:
        "The attraction between hydrogen bonded to N, O or F and a lone pair on a nearby electronegative atom",
    },
  ],
  [
    {
      key: "VSEPR theory",
      value:
        "Electron pairs around a central atom arrange themselves to minimise repulsion, fixing the shape",
    },
    {
      key: "Order of repulsion in VSEPR",
      value:
        "Lone pair to lone pair is greater than lone pair to bond pair, which is greater than bond pair to bond pair",
    },
    {
      key: "Why water is bent and not linear",
      value:
        "The two lone pairs on oxygen repel the bond pairs, reducing the angle to about 104.5 degrees",
    },
    {
      key: "Paramagnetism of the oxygen molecule",
      value:
        "Molecular orbital theory places two unpaired electrons in the pi star antibonding orbitals",
    },
    {
      key: "Fajans rules",
      value:
        "Covalent character rises with a small highly charged cation and a large easily polarised anion",
    },
  ],
);

ch11(
  "chem:thermodynamics",
  "Chemical Thermodynamics",
  "In chemical thermodynamics, what is %s?",
  "%k is %v.",
  [
    {
      key: "System and surroundings",
      value: "The part of the universe under study and everything else around it",
    },
    {
      key: "Isolated system",
      value: "A system that exchanges neither matter nor energy with the surroundings",
    },
    {
      key: "State function",
      value: "A property that depends only on the state, not the path, such as enthalpy or entropy",
    },
    {
      key: "First law of thermodynamics",
      value: "The change in internal energy equals heat absorbed plus work done on the system",
    },
    {
      key: "Enthalpy",
      value: "The heat content of a system at constant pressure, H equals U plus PV",
    },
    {
      key: "Exothermic reaction",
      value: "A reaction that releases heat, for which delta H is negative",
    },
    {
      key: "Endothermic reaction",
      value: "A reaction that absorbs heat, for which delta H is positive",
    },
    {
      key: "Hess's law",
      value: "The total enthalpy change of a reaction is the same whatever the route taken",
    },
    { key: "Entropy", value: "The measure of the disorder or randomness of a system" },
    {
      key: "Gibbs free energy",
      value: "G equals H minus TS; a negative change in G means the process is spontaneous",
    },
  ],
  [
    {
      key: "Second law of thermodynamics",
      value: "The entropy of the universe always increases in a spontaneous process",
    },
    {
      key: "Third law of thermodynamics",
      value: "The entropy of a perfect crystal at absolute zero is zero",
    },
    {
      key: "Condition for equilibrium in terms of free energy",
      value: "The change in Gibbs free energy is zero",
    },
    {
      key: "Bond dissociation enthalpy",
      value: "The enthalpy change when one mole of bonds is broken in the gaseous state",
    },
    {
      key: "Why an endothermic reaction can still be spontaneous",
      value:
        "A large positive entropy change can make T delta S exceed delta H, giving a negative delta G",
    },
  ],
);

ch11(
  "chem:equilibrium",
  "Equilibrium",
  "In chemical and ionic equilibrium, what is %s?",
  "%k is %v.",
  [
    {
      key: "Dynamic equilibrium",
      value:
        "The state where forward and backward reaction rates are equal and concentrations stay constant",
    },
    {
      key: "Law of mass action",
      value:
        "The rate of a reaction is proportional to the product of the active masses of the reactants",
    },
    {
      key: "Equilibrium constant Kc",
      value:
        "The ratio of the product of product concentrations to reactant concentrations, each raised to its coefficient",
    },
    {
      key: "Le Chatelier's principle",
      value: "A system at equilibrium shifts so as to partly undo any change imposed on it",
    },
    {
      key: "Effect of a catalyst on equilibrium",
      value: "It speeds up both directions equally and does not shift the position of equilibrium",
    },
    { key: "Arrhenius acid", value: "A substance that gives hydrogen ions in aqueous solution" },
    { key: "Bronsted Lowry base", value: "A substance that accepts a proton" },
    { key: "Lewis acid", value: "A species that accepts a pair of electrons" },
    { key: "pH", value: "The negative logarithm to base ten of the hydrogen ion concentration" },
    {
      key: "Buffer solution",
      value: "A solution that resists a change in pH on adding a small amount of acid or base",
    },
  ],
  [
    {
      key: "Common ion effect",
      value:
        "The suppression of the ionisation of a weak electrolyte by adding a strong electrolyte with a common ion",
    },
    {
      key: "Solubility product",
      value:
        "The product of the ion concentrations of a sparingly soluble salt in a saturated solution, each raised to its coefficient",
    },
    {
      key: "Condition for precipitation",
      value: "Precipitation occurs when the ionic product exceeds the solubility product",
    },
    {
      key: "Henderson Hasselbalch equation",
      value: "pH equals pKa plus the logarithm of the ratio of salt to acid concentration",
    },
    {
      key: "Effect of pressure on an equilibrium with unequal gas moles",
      value: "Increasing pressure shifts the equilibrium towards the side with fewer gaseous moles",
    },
  ],
);

ch11(
  "chem:redox",
  "Redox Reactions",
  "In redox chemistry, what is %s?",
  "%k is %v.",
  [
    { key: "Oxidation in terms of electrons", value: "The loss of electrons by a species" },
    { key: "Reduction in terms of electrons", value: "The gain of electrons by a species" },
    { key: "Oxidising agent", value: "The species that accepts electrons and is itself reduced" },
    { key: "Reducing agent", value: "The species that donates electrons and is itself oxidised" },
    {
      key: "Oxidation number of oxygen in most compounds",
      value: "Minus two, except in peroxides where it is minus one",
    },
    { key: "Oxidation number of hydrogen in metal hydrides", value: "Minus one" },
    {
      key: "Disproportionation reaction",
      value: "A reaction in which the same element is simultaneously oxidised and reduced",
    },
    {
      key: "Redox couple",
      value: "A pair consisting of the oxidised and reduced form of the same species",
    },
    { key: "Oxidation state of manganese in potassium permanganate", value: "Plus seven" },
    { key: "Oxidation state of chromium in potassium dichromate", value: "Plus six" },
  ],
  [
    {
      key: "Ion electron method",
      value:
        "Balancing a redox equation by splitting it into half reactions and balancing charge and atoms separately",
    },
    {
      key: "Example of disproportionation",
      value: "Chlorine in cold dilute alkali gives chloride and hypochlorite",
    },
    {
      key: "Why fluorine shows only a minus one oxidation state",
      value: "It is the most electronegative element and has no d orbitals to promote electrons",
    },
    {
      key: "Standard hydrogen electrode",
      value: "The reference electrode assigned a potential of exactly zero volts",
    },
    {
      key: "Redox titration indicator for permanganate",
      value: "Permanganate is self indicating; the first permanent pink marks the end point",
    },
  ],
);

chw(
  "chem:hydrogen-sblock",
  "Hydrogen and the s-Block Elements",
  "About hydrogen and the s-block, what is %s?",
  "%k is %v.",
  [
    { key: "Isotopes of hydrogen", value: "Protium, deuterium and tritium" },
    { key: "Heavy water", value: "Deuterium oxide, used as a moderator in nuclear reactors" },
    {
      key: "Water gas",
      value: "A mixture of carbon monoxide and hydrogen made by passing steam over hot coke",
    },
    {
      key: "Alkali metals",
      value: "The group 1 elements lithium, sodium, potassium, rubidium, caesium and francium",
    },
    {
      key: "Alkaline earth metals",
      value: "The group 2 elements beryllium, magnesium, calcium, strontium, barium and radium",
    },
    { key: "Flame colour of sodium", value: "Golden yellow" },
    { key: "Flame colour of potassium", value: "Lilac or pale violet" },
    { key: "Quicklime", value: "Calcium oxide, made by heating limestone" },
    {
      key: "Plaster of Paris",
      value: "Calcium sulphate hemihydrate, made by heating gypsum to about 393 kelvin",
    },
    { key: "Washing soda", value: "Sodium carbonate decahydrate, made by the Solvay process" },
  ],
  [
    {
      key: "Diagonal relationship of lithium",
      value: "Lithium resembles magnesium because of similar size to charge ratio",
    },
    {
      key: "Why alkali metals are stored under kerosene",
      value: "They react vigorously with air and moisture and can catch fire",
    },
    {
      key: "Anomalous behaviour of beryllium",
      value:
        "Small size, high ionisation energy and no d orbitals make its compounds largely covalent",
    },
    {
      key: "Solvay process limitation",
      value:
        "It cannot be used to make potassium carbonate because potassium bicarbonate is too soluble",
    },
    {
      key: "Reason alkali metals are strong reducing agents",
      value:
        "Low ionisation enthalpy and high hydration energy make electron loss easy in solution",
    },
  ],
);

chw(
  "chem:p-block",
  "The p-Block Elements",
  "About the p-block elements, what is %s?",
  "%k is %v.",
  [
    {
      key: "Inert pair effect",
      value:
        "The reluctance of the ns electrons to take part in bonding down a group, favouring lower oxidation states",
    },
    { key: "Borax", value: "Sodium tetraborate decahydrate, used in the borax bead test" },
    {
      key: "Diborane",
      value: "B2H6, an electron deficient molecule with two three centre two electron bonds",
    },
    {
      key: "Allotropes of carbon",
      value: "Diamond, graphite, fullerene, graphene and carbon nanotubes",
    },
    {
      key: "Reason graphite conducts electricity",
      value:
        "Each carbon uses only three of four valence electrons in bonding, leaving one delocalised",
    },
    {
      key: "Producer gas",
      value: "A mixture of carbon monoxide and nitrogen used as a cheap fuel",
    },
    { key: "Laughing gas", value: "Dinitrogen oxide, used as a mild anaesthetic" },
    {
      key: "Brown ring test",
      value: "The test for nitrate ion using ferrous sulphate and concentrated sulphuric acid",
    },
    {
      key: "Bleaching action of chlorine",
      value: "It is permanent and occurs by oxidation in the presence of moisture",
    },
    {
      key: "Noble gases",
      value: "The group 18 elements helium, neon, argon, krypton, xenon and radon",
    },
  ],
  [
    {
      key: "Why nitrogen does not form pentahalides",
      value: "Nitrogen has no vacant d orbitals, so it cannot expand its octet",
    },
    {
      key: "Reason for the low boiling point of ammonia compared with water",
      value:
        "Nitrogen is less electronegative than oxygen, so hydrogen bonding in ammonia is weaker",
    },
    {
      key: "Structure of white phosphorus",
      value:
        "A tetrahedral P4 molecule with a strained bond angle of 60 degrees, which makes it reactive",
    },
    {
      key: "Why fluorine has a lower electron affinity than chlorine",
      value:
        "The small size of fluorine causes strong interelectronic repulsion in the compact 2p subshell",
    },
    {
      key: "First noble gas compound",
      value: "Xenon hexafluoroplatinate, prepared by Neil Bartlett in 1962",
    },
  ],
);

ch11(
  "chem:hydrocarbons",
  "Hydrocarbons",
  "In the chemistry of hydrocarbons, what is %s?",
  "%k is %v.",
  [
    {
      key: "Alkane",
      value:
        "A saturated hydrocarbon with only single carbon to carbon bonds, general formula CnH2n+2",
    },
    {
      key: "Alkene",
      value:
        "An unsaturated hydrocarbon with a carbon to carbon double bond, general formula CnH2n",
    },
    {
      key: "Alkyne",
      value:
        "An unsaturated hydrocarbon with a carbon to carbon triple bond, general formula CnH2n-2",
    },
    { key: "Wurtz reaction", value: "Alkyl halides with sodium in dry ether give a higher alkane" },
    {
      key: "Markovnikov's rule",
      value:
        "In addition of HX to an unsymmetrical alkene, hydrogen adds to the carbon with more hydrogens",
    },
    {
      key: "Peroxide or Kharasch effect",
      value: "Anti Markovnikov addition of HBr to an alkene in the presence of peroxide",
    },
    {
      key: "Ozonolysis",
      value:
        "Cleavage of a double bond by ozone followed by hydrolysis, used to locate the double bond",
    },
    {
      key: "Benzene formula",
      value: "C6H6, a planar cyclic molecule with delocalised pi electrons",
    },
    {
      key: "Aromaticity condition",
      value: "A planar cyclic conjugated system with 4n plus 2 pi electrons, the Huckel rule",
    },
    {
      key: "Friedel Crafts alkylation",
      value:
        "Substitution of an alkyl group on benzene using an alkyl halide and anhydrous aluminium chloride",
    },
  ],
  [
    {
      key: "Reason benzene undergoes substitution rather than addition",
      value: "Substitution preserves the delocalised aromatic sextet and its resonance stability",
    },
    {
      key: "Ortho para directing groups",
      value: "Electron releasing groups such as alkyl, hydroxyl, amino and halogens",
    },
    {
      key: "Meta directing groups",
      value: "Electron withdrawing groups such as nitro, cyano, carboxyl and sulphonic acid",
    },
    {
      key: "Saytzeff rule",
      value:
        "In elimination the more substituted and therefore more stable alkene is the major product",
    },
    {
      key: "Order of stability of carbocations",
      value:
        "Tertiary is more stable than secondary, which is more stable than primary, because of hyperconjugation",
    },
  ],
);

/* ======================================================== Class 12 ===== */

ch12(
  "chem:electrochemistry",
  "Electrochemistry",
  "In electrochemistry, what is %s?",
  "%k is %v.",
  [
    {
      key: "Electrochemical cell",
      value: "A device that converts chemical energy into electrical energy or the reverse",
    },
    {
      key: "Galvanic cell",
      value: "A cell in which a spontaneous redox reaction produces electricity",
    },
    {
      key: "Electrolytic cell",
      value: "A cell in which electrical energy drives a non spontaneous reaction",
    },
    {
      key: "Anode in a galvanic cell",
      value: "The negative electrode where oxidation takes place",
    },
    {
      key: "Cathode in a galvanic cell",
      value: "The positive electrode where reduction takes place",
    },
    {
      key: "Salt bridge",
      value:
        "The tube of inert electrolyte that completes the circuit and maintains electrical neutrality",
    },
    {
      key: "Nernst equation",
      value:
        "The relation giving electrode potential at any concentration from the standard potential",
    },
    {
      key: "Faraday's first law of electrolysis",
      value: "The mass deposited is proportional to the quantity of electricity passed",
    },
    { key: "Value of one faraday", value: "96 500 coulomb, the charge on one mole of electrons" },
    {
      key: "Specific conductance",
      value:
        "The conductance of a solution held between electrodes of unit area and unit separation",
    },
  ],
  [
    {
      key: "Kohlrausch's law",
      value:
        "Limiting molar conductivity is the sum of the independent contributions of the cation and the anion",
    },
    {
      key: "Reason molar conductivity of a weak electrolyte rises sharply on dilution",
      value: "Dilution greatly increases the degree of dissociation",
    },
    {
      key: "Relation between cell potential and Gibbs energy",
      value: "Delta G equals minus nFE, so a positive cell potential means a spontaneous reaction",
    },
    {
      key: "Fuel cell",
      value:
        "A cell that converts the energy of a continuously supplied fuel such as hydrogen directly into electricity",
    },
    {
      key: "Cause of rusting",
      value:
        "Electrochemical corrosion in which iron is oxidised at anodic spots and oxygen is reduced at cathodic spots",
    },
  ],
);

ch12(
  "chem:kinetics",
  "Chemical Kinetics",
  "In chemical kinetics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Rate of reaction",
      value: "The change in concentration of a reactant or product per unit time",
    },
    {
      key: "Rate law",
      value:
        "The experimentally determined expression relating rate to the concentrations of reactants",
    },
    {
      key: "Order of a reaction",
      value: "The sum of the powers of the concentration terms in the experimental rate law",
    },
    {
      key: "Molecularity",
      value: "The number of species colliding in an elementary step; it is always a whole number",
    },
    {
      key: "Zero order reaction",
      value: "A reaction whose rate does not depend on the concentration of the reactant",
    },
    {
      key: "First order rate constant unit",
      value:
        "Per second, since the rate constant of a first order reaction has units of reciprocal time",
    },
    {
      key: "Half life of a first order reaction",
      value: "0.693 divided by the rate constant, independent of initial concentration",
    },
    {
      key: "Activation energy",
      value: "The minimum extra energy the reactants must have for a collision to be effective",
    },
    { key: "Arrhenius equation", value: "k equals A times e to the power minus Ea over RT" },
    {
      key: "Effect of a catalyst on rate",
      value: "It provides an alternative path of lower activation energy, raising the rate",
    },
  ],
  [
    {
      key: "Pseudo first order reaction",
      value:
        "A higher order reaction that behaves as first order because one reactant is in large excess",
    },
    {
      key: "Collision theory requirement",
      value:
        "Colliding molecules must have energy above the activation energy and the correct orientation",
    },
    {
      key: "Effect of temperature on rate",
      value:
        "A rise of ten degrees roughly doubles the rate by increasing the fraction of effective collisions",
    },
    {
      key: "Threshold energy",
      value: "The minimum total energy that colliding molecules must possess for reaction",
    },
    {
      key: "Reason a catalyst does not change delta H",
      value:
        "It changes only the path, and enthalpy is a state function depending only on initial and final states",
    },
  ],
);

ch(
  "chem:surface",
  "Surface Chemistry",
  "In surface chemistry, what is %s?",
  "%k is %v.",
  [
    {
      key: "Adsorption",
      value: "The accumulation of a substance at a surface rather than throughout the bulk",
    },
    {
      key: "Absorption",
      value: "The uniform distribution of a substance throughout the bulk of another",
    },
    {
      key: "Adsorbate and adsorbent",
      value: "The substance that is adsorbed and the surface on which it is adsorbed",
    },
    {
      key: "Physisorption",
      value: "Weak adsorption by van der Waals forces, reversible and favoured at low temperature",
    },
    {
      key: "Chemisorption",
      value: "Adsorption by chemical bonding, irreversible and highly specific",
    },
    {
      key: "Freundlich adsorption isotherm",
      value: "The empirical relation giving the extent of adsorption as a function of pressure",
    },
    {
      key: "Colloid",
      value:
        "A heterogeneous system with dispersed particles between one and one thousand nanometres",
    },
    {
      key: "Tyndall effect",
      value: "The scattering of a beam of light by colloidal particles, making the path visible",
    },
    {
      key: "Brownian movement",
      value:
        "The continuous zigzag motion of colloidal particles caused by uneven molecular bombardment",
    },
    { key: "Emulsion", value: "A colloidal dispersion of one liquid in another, such as milk" },
  ],
  [
    {
      key: "Hardy Schulze rule",
      value:
        "The coagulating power of an ion rises sharply with its charge and opposite sign to the sol particle",
    },
    {
      key: "Peptisation",
      value:
        "The conversion of a fresh precipitate into a colloidal sol by adding a suitable electrolyte",
    },
    {
      key: "Dialysis",
      value:
        "The purification of a sol by removing dissolved electrolytes through a semipermeable membrane",
    },
    {
      key: "Promoter in catalysis",
      value:
        "A substance that increases the activity of a catalyst, such as molybdenum with iron in the Haber process",
    },
    {
      key: "Shape selective catalysis",
      value: "Catalysis by zeolites in which the pore size decides which molecules can react",
    },
  ],
);

ch12(
  "chem:d-f-block",
  "The d-Block and f-Block Elements",
  "About the transition and inner transition elements, what is %s?",
  "%k is %v.",
  [
    {
      key: "Transition element",
      value: "An element whose atom or stable ion has a partly filled d subshell",
    },
    {
      key: "Reason transition metals show variable oxidation states",
      value:
        "The energies of the ns and (n minus 1)d electrons are close, so both can take part in bonding",
    },
    {
      key: "Cause of colour in transition metal ions",
      value: "d to d electronic transitions absorbing part of visible light",
    },
    {
      key: "Reason transition metals are good catalysts",
      value: "Variable oxidation states and the ability to adsorb reactants on the surface",
    },
    {
      key: "Lanthanoid contraction",
      value:
        "The steady decrease in size across the lanthanoid series due to poor shielding by 4f electrons",
    },
    {
      key: "Zinc, cadmium and mercury",
      value:
        "Not regarded as true transition elements because their d subshell is completely filled",
    },
    {
      key: "Preparation of potassium permanganate",
      value:
        "Fusion of pyrolusite with potassium hydroxide followed by oxidation and electrolytic conversion",
    },
    {
      key: "Colour of potassium dichromate solution",
      value: "Orange, turning yellow chromate in alkaline medium",
    },
    {
      key: "Alloy steel component chromium",
      value: "Adds hardness and corrosion resistance, as in stainless steel",
    },
    {
      key: "Actinoids",
      value:
        "The fourteen elements following actinium in which 5f orbitals are progressively filled",
    },
  ],
  [
    {
      key: "Consequence of lanthanoid contraction",
      value: "Zirconium and hafnium have almost identical sizes and are very hard to separate",
    },
    {
      key: "Why Mn2+ is more stable than Fe2+",
      value: "Manganese two has a stable half filled d5 configuration",
    },
    {
      key: "Reason actinoids show more oxidation states than lanthanoids",
      value:
        "5f, 6d and 7s orbitals are closer in energy than the corresponding lanthanoid orbitals",
    },
    {
      key: "Magnetic moment formula",
      value: "The spin only value equals the square root of n times n plus two Bohr magnetons",
    },
    {
      key: "Interstitial compound",
      value:
        "A compound formed when small atoms such as hydrogen, carbon or nitrogen occupy holes in the metal lattice",
    },
  ],
);

ch12(
  "chem:coordination",
  "Coordination Compounds",
  "In coordination chemistry, what is %s?",
  "%k is %v.",
  [
    {
      key: "Coordination compound",
      value: "A compound in which a central metal atom is bonded to ligands by coordinate bonds",
    },
    {
      key: "Ligand",
      value: "An ion or molecule that donates a lone pair to the central metal atom",
    },
    {
      key: "Coordination number",
      value: "The number of ligand donor atoms directly bonded to the central metal",
    },
    {
      key: "Chelate",
      value: "A ring formed when a polydentate ligand binds a metal at more than one site",
    },
    {
      key: "Ambidentate ligand",
      value:
        "A ligand that can bind through either of two different donor atoms, such as the nitrite ion",
    },
    {
      key: "Werner's primary valency",
      value:
        "The oxidation state of the metal, satisfied by negative ions and ionisable outside the sphere",
    },
    {
      key: "Werner's secondary valency",
      value: "The coordination number, satisfied by ligands and non ionisable",
    },
    {
      key: "EDTA denticity",
      value: "Hexadentate, binding through two nitrogen and four oxygen donor atoms",
    },
    {
      key: "Crystal field splitting",
      value:
        "The separation of the five degenerate d orbitals into groups of different energy by ligands",
    },
    {
      key: "Spectrochemical series",
      value: "The arrangement of ligands in order of increasing crystal field splitting power",
    },
  ],
  [
    {
      key: "Strong field ligand effect",
      value: "Large splitting causes pairing of electrons, giving a low spin inner orbital complex",
    },
    {
      key: "Reason the hexacyanoferrate ion is diamagnetic",
      value: "Cyanide is a strong field ligand, so all d electrons pair up in the lower orbitals",
    },
    {
      key: "Linkage isomerism",
      value: "Isomerism arising when an ambidentate ligand binds through different donor atoms",
    },
    {
      key: "Ionisation isomerism",
      value: "Isomerism in which the counter ion and a ligand exchange places",
    },
    {
      key: "Application of coordination compounds in medicine",
      value: "Cisplatin in cancer therapy and EDTA in the treatment of lead poisoning",
    },
  ],
);

ch12(
  "chem:haloalkanes",
  "Haloalkanes and Haloarenes",
  "About haloalkanes and haloarenes, what is %s?",
  "%k is %v.",
  [
    {
      key: "Haloalkane",
      value: "A compound in which a halogen is bonded to an sp3 hybridised carbon",
    },
    {
      key: "Haloarene",
      value: "A compound in which a halogen is bonded directly to an aromatic ring",
    },
    {
      key: "SN1 mechanism",
      value: "A two step substitution through a carbocation, first order in substrate only",
    },
    {
      key: "SN2 mechanism",
      value: "A one step backside attack with inversion of configuration, second order overall",
    },
    {
      key: "Substrate favouring SN1",
      value: "A tertiary halide, because it gives the most stable carbocation",
    },
    {
      key: "Substrate favouring SN2",
      value: "A primary halide, because it offers the least steric hindrance",
    },
    {
      key: "Walden inversion",
      value: "The inversion of configuration at the carbon centre during an SN2 reaction",
    },
    {
      key: "Chloroform on exposure to air and light",
      value: "It slowly oxidises to the poisonous gas phosgene",
    },
    {
      key: "Freons",
      value: "Chlorofluorocarbons once used as refrigerants, now restricted for depleting ozone",
    },
    {
      key: "DDT",
      value:
        "Dichlorodiphenyltrichloroethane, an insecticide banned in many countries for its persistence",
    },
  ],
  [
    {
      key: "Reason haloarenes are less reactive to nucleophilic substitution",
      value:
        "Resonance gives the carbon halogen bond partial double bond character and the carbon is sp2 hybridised",
    },
    {
      key: "Racemisation",
      value: "The formation of an equal mixture of both enantiomers, typical of an SN1 reaction",
    },
    {
      key: "Order of reactivity of alkyl halides in SN1",
      value: "Tertiary is greater than secondary, which is greater than primary",
    },
    {
      key: "Sandmeyer reaction",
      value: "Conversion of a diazonium salt to an aryl halide using a copper one halide",
    },
    {
      key: "Reason iodides are the most reactive halides",
      value: "The carbon iodine bond is the weakest and iodide is the best leaving group",
    },
  ],
);

ch12(
  "chem:alcohols",
  "Alcohols, Phenols and Ethers",
  "About alcohols, phenols and ethers, what is %s?",
  "%k is %v.",
  [
    {
      key: "Alcohol",
      value: "A compound with a hydroxyl group attached to an sp3 hybridised carbon",
    },
    {
      key: "Phenol",
      value: "A compound with a hydroxyl group attached directly to an aromatic ring",
    },
    { key: "Ether", value: "A compound with an oxygen atom bonded to two alkyl or aryl groups" },
    {
      key: "Williamson synthesis",
      value: "Preparation of an ether from an alkyl halide and a sodium alkoxide",
    },
    {
      key: "Lucas test",
      value:
        "A test distinguishing primary, secondary and tertiary alcohols by the speed of turbidity with Lucas reagent",
    },
    {
      key: "Victor Meyer test",
      value: "A test distinguishing the three classes of alcohol by the colour obtained",
    },
    {
      key: "Kolbe reaction",
      value: "Carboxylation of sodium phenoxide with carbon dioxide to give salicylic acid",
    },
    {
      key: "Reimer Tiemann reaction",
      value: "Formylation of phenol with chloroform and alkali to give salicylaldehyde",
    },
    { key: "Product of dehydration of ethanol at 443 K", value: "Ethene" },
    {
      key: "Esterification",
      value:
        "Reaction of an alcohol with a carboxylic acid in the presence of acid to give an ester and water",
    },
  ],
  [
    {
      key: "Reason phenol is more acidic than ethanol",
      value: "The phenoxide ion is resonance stabilised while the ethoxide ion is not",
    },
    {
      key: "Effect of a nitro group on phenol acidity",
      value:
        "Being electron withdrawing it stabilises the phenoxide ion further and increases acidity",
    },
    {
      key: "Reason alcohols have higher boiling points than ethers of similar mass",
      value: "Alcohols form intermolecular hydrogen bonds while ethers cannot",
    },
    {
      key: "Reason phenol does not give the Lucas test",
      value: "The carbon oxygen bond has partial double bond character and does not break easily",
    },
    {
      key: "Acidity order of alcohols",
      value:
        "Primary is more acidic than secondary, which is more acidic than tertiary, because of the electron releasing alkyl groups",
    },
  ],
);

ch12(
  "chem:carbonyl",
  "Aldehydes, Ketones and Carboxylic Acids",
  "About carbonyl compounds, what is %s?",
  "%k is %v.",
  [
    {
      key: "Aldehyde",
      value: "A compound with a carbonyl group bonded to at least one hydrogen atom",
    },
    { key: "Ketone", value: "A compound with a carbonyl group bonded to two carbon atoms" },
    {
      key: "Tollens test",
      value: "Ammoniacal silver nitrate gives a silver mirror with an aldehyde but not a ketone",
    },
    {
      key: "Fehling test",
      value: "An aliphatic aldehyde gives a red precipitate of cuprous oxide with Fehling solution",
    },
    {
      key: "Iodoform test",
      value: "A positive yellow precipitate is given by ethanal, methyl ketones and ethanol",
    },
    {
      key: "Aldol condensation",
      value:
        "Two molecules with alpha hydrogen combine in base to give a beta hydroxy carbonyl compound",
    },
    {
      key: "Cannizzaro reaction",
      value: "Disproportionation of an aldehyde with no alpha hydrogen in concentrated alkali",
    },
    {
      key: "Clemmensen reduction",
      value:
        "Reduction of a carbonyl group to a methylene group using zinc amalgam and hydrochloric acid",
    },
    {
      key: "Wolff Kishner reduction",
      value: "Reduction of a carbonyl group to methylene using hydrazine and a strong base",
    },
    {
      key: "Carboxylic acid functional group",
      value: "The carboxyl group, a carbonyl and a hydroxyl on the same carbon",
    },
  ],
  [
    {
      key: "Reason carboxylic acids are more acidic than phenols",
      value:
        "The carboxylate ion has two equivalent resonance structures spreading the charge over two oxygens",
    },
    {
      key: "Effect of a chlorine substituent on acid strength",
      value: "The electron withdrawing inductive effect stabilises the anion and increases acidity",
    },
    {
      key: "Reason aldehydes are more reactive than ketones to nucleophiles",
      value: "Ketones have two electron releasing alkyl groups and greater steric hindrance",
    },
    {
      key: "HVZ reaction",
      value:
        "Halogenation at the alpha carbon of a carboxylic acid using a halogen and red phosphorus",
    },
    {
      key: "Reason formic acid gives the Tollens test",
      value: "It contains an aldehyde group in addition to the carboxyl group",
    },
  ],
);

ch12(
  "chem:amines",
  "Amines and Diazonium Salts",
  "About amines, what is %s?",
  "%k is %v.",
  [
    {
      key: "Primary amine",
      value: "An amine in which one hydrogen of ammonia is replaced by an alkyl or aryl group",
    },
    {
      key: "Gabriel phthalimide synthesis",
      value: "A method giving pure primary aliphatic amines from phthalimide",
    },
    {
      key: "Hofmann bromamide degradation",
      value: "An amide with bromine and alkali gives a primary amine with one carbon less",
    },
    {
      key: "Carbylamine reaction",
      value:
        "A primary amine with chloroform and alcoholic potash gives a foul smelling isocyanide",
    },
    {
      key: "Hinsberg reagent",
      value:
        "Benzenesulphonyl chloride, used to distinguish primary, secondary and tertiary amines",
    },
    {
      key: "Diazotisation",
      value:
        "Conversion of a primary aromatic amine to a diazonium salt with nitrous acid at low temperature",
    },
    {
      key: "Coupling reaction",
      value: "A diazonium salt couples with phenol or an amine to give a coloured azo dye",
    },
    {
      key: "Reason aniline does not undergo Friedel Crafts reaction",
      value: "The lone pair on nitrogen bonds with aluminium chloride, deactivating the ring",
    },
    {
      key: "Basic nature of amines",
      value: "The lone pair on nitrogen can accept a proton, making amines basic",
    },
    {
      key: "Product of amine with acetic anhydride",
      value: "An N substituted amide, by acetylation",
    },
  ],
  [
    {
      key: "Reason aniline is a weaker base than ethylamine",
      value: "The lone pair on nitrogen is delocalised into the benzene ring and is less available",
    },
    {
      key: "Order of basicity of amines in aqueous solution",
      value:
        "Secondary is greater than primary, which is greater than tertiary, because of solvation and steric effects",
    },
    {
      key: "Reason diazonium salts are prepared below 278 kelvin",
      value: "They are unstable at higher temperature and decompose to phenol and nitrogen",
    },
    {
      key: "Use of the Gabriel synthesis limitation",
      value:
        "It fails for aromatic amines because aryl halides do not undergo nucleophilic substitution with phthalimide",
    },
    {
      key: "Reason nitration of aniline is done after acetylation",
      value:
        "Acetylation reduces the activating power of the amino group and avoids oxidation and excess substitution",
    },
  ],
);

ch12(
  "chem:biomolecules",
  "Biomolecules",
  "In biomolecules, what is %s?",
  "%k is %v.",
  [
    {
      key: "Carbohydrate",
      value: "A polyhydroxy aldehyde or ketone, or a compound that gives these on hydrolysis",
    },
    {
      key: "Reducing sugar",
      value:
        "A sugar with a free aldehyde or ketone group that reduces Tollens and Fehling reagents",
    },
    { key: "Sucrose", value: "A disaccharide of glucose and fructose that is non reducing" },
    {
      key: "Peptide bond",
      value:
        "The amide linkage between the carboxyl group of one amino acid and the amino group of the next",
    },
    {
      key: "Denaturation of protein",
      value:
        "Loss of the secondary and tertiary structure and of biological activity on heating or change of pH",
    },
    { key: "Vitamin C deficiency disease", value: "Scurvy" },
  ],
  [
    {
      key: "Difference between DNA and RNA sugar",
      value: "DNA contains deoxyribose while RNA contains ribose",
    },
    { key: "Base present in RNA but not DNA", value: "Uracil, which replaces thymine" },
  ],
);

ch(
  "chem:biomolecules-polymers",
  "Polymers and Chemistry in Everyday Life",
  "In polymers and applied chemistry, what is %s?",
  "%k is %v.",
  [
    {
      key: "Addition polymer",
      value: "A polymer formed by repeated addition of unsaturated monomers, such as polythene",
    },
    {
      key: "Condensation polymer",
      value: "A polymer formed with the loss of a small molecule, such as nylon 66",
    },
    { key: "Bakelite", value: "A thermosetting condensation polymer of phenol and formaldehyde" },
    {
      key: "Antibiotic",
      value:
        "A substance produced by a micro organism that inhibits or kills other micro organisms",
    },
    {
      key: "Thermoplastic polymer",
      value: "A polymer that softens on heating and can be remoulded, such as polythene",
    },
  ],
  [
    {
      key: "Buna S rubber",
      value: "A copolymer of butadiene and styrene used for automobile tyres",
    },
    {
      key: "Broad spectrum antibiotic",
      value:
        "An antibiotic effective against both gram positive and gram negative bacteria, such as chloramphenicol",
    },
    {
      key: "Reason soaps do not work well in hard water",
      value: "Calcium and magnesium ions form an insoluble scum with the soap anion",
    },
    {
      key: "Teflon",
      value: "Polytetrafluoroethylene, a low-friction polymer used for non-stick coatings",
    },
    {
      key: "Biodegradable polymer PHBV",
      value: "A microbial polyester that can be broken down by microorganisms",
    },
  ],
);
export const CHEMISTRY_FULL_TEMPLATES = templates;
