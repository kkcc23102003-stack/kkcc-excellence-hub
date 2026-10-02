/**
 * ICSE and CBSE Class 9 and Class 10 with Physics, Chemistry and Biology kept
 * as separate subjects.
 *
 * ICSE does not teach one combined "Science" paper. It sets Physics,
 * Chemistry and Biology as three papers with their own syllabus and their own
 * chapter list, so this file mirrors that split. CBSE students are tagged on
 * the same chapters because the content overlaps almost completely; only the
 * paper structure differs.
 *
 * Chapter names follow the ICSE (CISCE) syllabus wording.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementCountTemplate,
  statementTemplate,
} from "./core";

const ICSE_9 = [
  "ICSE Class 9",
  "CBSE Class 9",
  "CBSE Class 9-10",
  "ICSE Class 9-10",
  "PSEB Class 9-10",
  "State Board MCQ",
  "CBSE MCQ",
];

const ICSE_10 = [
  "ICSE Class 10",
  "CBSE Class 10",
  "CBSE Class 9-10",
  "ICSE Class 9-10",
  "PSEB Class 9-10",
  "State Board MCQ",
  "CBSE MCQ",
];

/** Class 10 science is also the feeder pool for NEET, JEE and Railway GS. */
const ICSE_10_WIDE = [...ICSE_10, "NEET", "JEE Main", "RRB Group D", "SSC MTS"];

const templates: Template[] = [];

function add(
  id: string,
  subject: string,
  topic: string,
  difficulty: "Easy" | "Moderate" | "Difficult",
  exams: string[],
  rows: FactRow[],
  matchLabel: string,
) {
  const spec = { id, subject, topic, difficulty, exams, rows };
  templates.push(
    ...factTemplate({
      ...spec,
      forward: "In the ICSE syllabus, %s is:",
      reverse: "Which term or law is described as: %s?",
      explain: "%k is %v. This is a syllabus definition and a repeat board-paper question.",
    }),
    matchTemplate({ ...spec, label: matchLabel }),
    statementTemplate({ ...spec, label: matchLabel }),
    statementCountTemplate({ ...spec, label: matchLabel }),
  );
}

/* ================================================== PHYSICS — CLASS 9 ==== */

add(
  "icse9:phy:measure",
  "Physics Class 9",
  "Measurements and Experimentation",
  "Easy",
  ICSE_9,
  [
    { key: "Number of fundamental units in SI", value: "Seven" },
    { key: "SI unit of length", value: "metre" },
    { key: "SI unit of mass", value: "kilogram" },
    { key: "SI unit of time", value: "second" },
    { key: "Least count of a vernier callipers", value: "0.01 cm, that is 0.1 mm" },
    { key: "Least count of a screw gauge", value: "0.01 mm" },
    { key: "Pitch of a screw gauge", value: "Distance moved in one complete rotation" },
    { key: "Zero error", value: "Reading shown when the instrument should read zero" },
    { key: "Time period of a simple pendulum", value: "T = 2 pi sqrt(l/g)" },
    { key: "Length of a seconds pendulum", value: "About 100 cm, with a period of 2 s" },
    { key: "Quantity a pendulum period does not depend on", value: "The mass of the bob" },
    { key: "1 light year", value: "About 9.46 x 10^15 metre" },
  ],
  "measurement term and its value",
);

add(
  "icse9:phy:motion",
  "Physics Class 9",
  "Motion in One Dimension",
  "Easy",
  ICSE_9,
  [
    { key: "Scalar quantity", value: "Has magnitude only, such as speed or distance" },
    { key: "Vector quantity", value: "Has magnitude and direction, such as velocity" },
    { key: "Speed", value: "Distance travelled per unit time" },
    { key: "Velocity", value: "Displacement per unit time" },
    { key: "Acceleration", value: "Rate of change of velocity" },
    { key: "First equation of motion", value: "v = u + at" },
    { key: "Second equation of motion", value: "s = ut + (1/2)at^2" },
    { key: "Third equation of motion", value: "v^2 = u^2 + 2as" },
    { key: "Slope of a distance-time graph", value: "Speed" },
    { key: "Slope of a velocity-time graph", value: "Acceleration" },
    { key: "Area under a velocity-time graph", value: "Distance travelled" },
    { key: "Retardation", value: "Negative acceleration, when velocity decreases" },
  ],
  "motion term and its definition",
);

add(
  "icse9:phy:laws",
  "Physics Class 9",
  "Laws of Motion",
  "Moderate",
  ICSE_9,
  [
    { key: "Newton's first law", value: "A body keeps its state unless an external force acts" },
    { key: "Inertia", value: "The tendency of a body to resist a change in its state" },
    { key: "Linear momentum", value: "p = mv, a vector quantity" },
    { key: "Newton's second law", value: "Force equals the rate of change of momentum" },
    { key: "Newton's third law", value: "Action and reaction are equal and opposite" },
    { key: "SI unit of force", value: "newton" },
    { key: "1 newton", value: "Force that gives 1 kg an acceleration of 1 m s^-2" },
    { key: "Gravitational unit of force", value: "kilogram force, equal to 9.8 N" },
    {
      key: "Law of conservation of momentum",
      value: "Total momentum is constant with no external force",
    },
    { key: "Recoil of a gun", value: "An example of conservation of momentum" },
    { key: "Universal law of gravitation", value: "F = G m1 m2 / r^2" },
    {
      key: "Difference between mass and weight",
      value: "Mass is in kilogram, weight is a force in newton",
    },
  ],
  "law of motion and its statement",
);

add(
  "icse9:phy:pressure",
  "Physics Class 9",
  "Fluids — Pressure and Upthrust",
  "Moderate",
  ICSE_9,
  [
    { key: "Thrust", value: "The force acting normally on a surface" },
    { key: "Pressure", value: "Thrust per unit area" },
    { key: "SI unit of pressure", value: "pascal, that is N m^-2" },
    { key: "Pressure at a depth h in a liquid", value: "P = h rho g" },
    { key: "Pascal's law", value: "Pressure in an enclosed liquid is transmitted equally" },
    { key: "Device based on Pascal law", value: "The hydraulic press and hydraulic brakes" },
    { key: "Upthrust", value: "The upward force a fluid exerts on an immersed body" },
    { key: "Archimedes' principle", value: "Upthrust equals the weight of the fluid displaced" },
    { key: "Condition for a body to float", value: "Its density is less than the fluid density" },
    { key: "Relative density", value: "Density of a substance divided by density of water" },
    { key: "Instrument to measure relative density", value: "The hydrometer" },
    {
      key: "Atmospheric pressure at sea level",
      value: "About 76 cm of mercury, or 1.013 x 10^5 Pa",
    },
  ],
  "fluid term and its definition",
);

add(
  "icse9:phy:heat",
  "Physics Class 9",
  "Heat and Energy",
  "Easy",
  ICSE_9,
  [
    { key: "Heat", value: "A form of energy that flows due to a temperature difference" },
    { key: "SI unit of heat", value: "joule" },
    { key: "Specific heat capacity", value: "Heat needed to raise 1 kg by 1 K" },
    { key: "Specific heat capacity of water", value: "4200 J kg^-1 K^-1" },
    {
      key: "Anomalous expansion of water",
      value: "Water expands when cooled below 4 degrees Celsius",
    },
    { key: "Temperature at which water has maximum density", value: "4 degrees Celsius" },
    {
      key: "Why aquatic life survives in winter",
      value: "Ice floats and insulates the water below",
    },
    { key: "Conduction", value: "Heat transfer without bulk movement of particles" },
    { key: "Convection", value: "Heat transfer by actual movement of the fluid" },
    { key: "Radiation", value: "Heat transfer needing no material medium" },
    { key: "Greenhouse effect", value: "Trapping of infrared radiation by atmospheric gases" },
    { key: "Renewable source of energy", value: "Solar, wind, hydro, tidal and biomass energy" },
  ],
  "heat term and its definition",
);

add(
  "icse9:phy:light",
  "Physics Class 9",
  "Light — Reflection and Spherical Mirrors",
  "Moderate",
  ICSE_9,
  [
    { key: "First law of reflection", value: "Angle of incidence equals the angle of reflection" },
    {
      key: "Second law of reflection",
      value: "Incident ray, normal and reflected ray lie in one plane",
    },
    {
      key: "Image formed by a plane mirror",
      value: "Virtual, erect, of the same size and laterally inverted",
    },
    {
      key: "Distance of the image in a plane mirror",
      value: "As far behind as the object is in front",
    },
    { key: "Focal length of a spherical mirror", value: "Half the radius of curvature" },
    { key: "Mirror used as a shaving mirror", value: "A concave mirror" },
    {
      key: "Mirror used as a rear-view mirror",
      value: "A convex mirror, it gives a wide field of view",
    },
    { key: "Image by a convex mirror", value: "Always virtual, erect and diminished" },
    { key: "Mirror formula", value: "1/v + 1/u = 1/f" },
    { key: "Magnification of a mirror", value: "m = -v/u, also height ratio" },
    {
      key: "Use of a concave mirror in a torch",
      value: "It gives a parallel beam from a source at the focus",
    },
    { key: "Number of images between two mirrors at 60 degrees", value: "Five" },
  ],
  "reflection term and its value",
);

add(
  "icse9:phy:sound",
  "Physics Class 9",
  "Sound",
  "Easy",
  ICSE_9,
  [
    { key: "Nature of sound waves", value: "Longitudinal mechanical waves" },
    { key: "Medium in which sound cannot travel", value: "Vacuum" },
    { key: "Speed of sound in air at 20 degrees Celsius", value: "About 344 m s^-1" },
    { key: "Speed of sound in water", value: "About 1500 m s^-1" },
    { key: "Speed of sound in steel", value: "About 5000 m s^-1" },
    { key: "Audible range for humans", value: "20 Hz to 20,000 Hz" },
    { key: "Infrasonic sound", value: "Frequency below 20 Hz" },
    { key: "Ultrasonic sound", value: "Frequency above 20,000 Hz" },
    { key: "Echo", value: "Sound heard again after reflection from a surface" },
    { key: "Minimum distance to hear a distinct echo", value: "About 17 metre" },
    { key: "Pitch of a sound", value: "Determined by its frequency" },
    { key: "Loudness of a sound", value: "Determined by its amplitude" },
  ],
  "sound term and its value",
);

add(
  "icse9:phy:current",
  "Physics Class 9",
  "Current Electricity and Magnetism",
  "Moderate",
  ICSE_9,
  [
    { key: "Electric current", value: "Rate of flow of charge, I = Q/t" },
    { key: "SI unit of current", value: "ampere" },
    { key: "SI unit of potential difference", value: "volt" },
    { key: "Ohm's law", value: "V = IR at constant temperature" },
    { key: "SI unit of resistance", value: "ohm" },
    { key: "Resistors in series", value: "R = R1 + R2 + R3" },
    { key: "Resistors in parallel", value: "1/R = 1/R1 + 1/R2 + 1/R3" },
    {
      key: "Material used for a fuse wire",
      value: "An alloy of tin and lead, with a low melting point",
    },
    { key: "Colour of the earth wire in India", value: "Green" },
    { key: "Magnetic field direction rule for a straight wire", value: "Right hand thumb rule" },
    {
      key: "Material that is strongly attracted by a magnet",
      value: "A ferromagnetic material such as iron",
    },
    {
      key: "Use of a soft iron core in an electromagnet",
      value: "It strengthens the magnetic field",
    },
  ],
  "electricity term and its value",
);

/* ================================================= PHYSICS — CLASS 10 ==== */

add(
  "icse10:phy:force",
  "Physics Class 10",
  "Force, Work, Power and Energy",
  "Moderate",
  ICSE_10,
  [
    { key: "Moment of a force", value: "Force times perpendicular distance from the pivot" },
    { key: "SI unit of moment of force", value: "newton metre" },
    {
      key: "Principle of moments",
      value: "Sum of clockwise moments equals sum of anticlockwise moments",
    },
    { key: "Couple", value: "Two equal and opposite parallel forces that produce rotation" },
    { key: "Centre of gravity", value: "The point where the whole weight appears to act" },
    { key: "Work done", value: "W = F s cos(theta)" },
    { key: "SI unit of work", value: "joule" },
    { key: "Power", value: "Rate of doing work, measured in watt" },
    { key: "Kinetic energy", value: "(1/2)mv^2" },
    { key: "Potential energy", value: "mgh" },
    { key: "Law of conservation of energy", value: "Energy is neither created nor destroyed" },
    { key: "Efficiency of a machine", value: "Useful work output divided by total work input" },
  ],
  "mechanics term and its expression",
);

add(
  "icse10:phy:machines",
  "Physics Class 10",
  "Machines",
  "Moderate",
  ICSE_10,
  [
    { key: "Mechanical advantage", value: "Load divided by effort" },
    { key: "Velocity ratio", value: "Effort distance divided by load distance" },
    { key: "Efficiency of a machine", value: "Mechanical advantage divided by velocity ratio" },
    { key: "Efficiency of an ideal machine", value: "100 per cent, since there is no friction" },
    { key: "Class I lever", value: "Fulcrum lies between load and effort, such as a seesaw" },
    { key: "Class II lever", value: "Load lies between fulcrum and effort, such as a nutcracker" },
    { key: "Class III lever", value: "Effort lies between fulcrum and load, such as forceps" },
    { key: "Velocity ratio of a single fixed pulley", value: "One" },
    { key: "Use of a single fixed pulley", value: "It changes the direction of the effort" },
    { key: "Velocity ratio of a single movable pulley", value: "Two" },
    { key: "Velocity ratio of a block and tackle with n pulleys", value: "n" },
    { key: "Lever with mechanical advantage always less than one", value: "A class III lever" },
  ],
  "machine term and its value",
);

add(
  "icse10:phy:light",
  "Physics Class 10",
  "Light — Refraction and Lenses",
  "Difficult",
  ICSE_10,
  [
    { key: "Refraction", value: "Bending of light when it passes between two media" },
    { key: "Snell's law", value: "sin(i) / sin(r) is a constant, the refractive index" },
    { key: "Refractive index of water", value: "1.33" },
    { key: "Refractive index of glass", value: "About 1.5" },
    { key: "Critical angle for glass and air", value: "About 42 degrees" },
    {
      key: "Condition for total internal reflection",
      value: "Denser to rarer medium, beyond the critical angle",
    },
    {
      key: "Use of total internal reflection",
      value: "Optical fibres and a totally reflecting prism",
    },
    { key: "Lens formula", value: "1/v - 1/u = 1/f" },
    { key: "Power of a lens", value: "P = 1/f in metre, unit dioptre" },
    { key: "Lens used to correct short sight", value: "A concave lens" },
    { key: "Dispersion of light", value: "Splitting of white light into its component colours" },
    {
      key: "Colour that bends the most in a prism",
      value: "Violet, it has the shortest wavelength",
    },
  ],
  "refraction term and its value",
);

add(
  "icse10:phy:sound",
  "Physics Class 10",
  "Sound — Vibrations and Resonance",
  "Moderate",
  ICSE_10,
  [
    { key: "Free vibrations", value: "Vibrations at the natural frequency with no external force" },
    { key: "Damped vibrations", value: "Amplitude falls with time because of friction" },
    { key: "Forced vibrations", value: "Vibrations kept going by a periodic external force" },
    {
      key: "Resonance",
      value: "Forced vibration when the applied frequency equals the natural one",
    },
    { key: "Example of resonance", value: "Soldiers breaking step while crossing a bridge" },
    {
      key: "Frequency of a stretched string",
      value: "It rises as tension rises and as length falls",
    },
    {
      key: "Effect of temperature on the speed of sound",
      value: "Speed rises by about 0.61 m s^-1 per degree Celsius",
    },
    {
      key: "Effect of humidity on the speed of sound",
      value: "Speed increases as humidity increases",
    },
    { key: "Noise pollution", value: "Unwanted loud sound harmful to health" },
    { key: "Unit of loudness level", value: "decibel" },
    { key: "Safe limit of sound for humans", value: "About 80 decibel" },
    { key: "Quality or timbre of a sound", value: "Decided by the overtones present" },
  ],
  "sound term and its definition",
);

add(
  "icse10:phy:electricity",
  "Physics Class 10",
  "Current Electricity and Household Circuits",
  "Moderate",
  ICSE_10,
  [
    { key: "Ohm's law", value: "V = IR at constant temperature" },
    { key: "Resistivity", value: "Resistance of a wire of unit length and unit area" },
    { key: "SI unit of resistivity", value: "ohm metre" },
    {
      key: "Effect of length on resistance",
      value: "Resistance is directly proportional to length",
    },
    { key: "Effect of area on resistance", value: "Resistance is inversely proportional to area" },
    { key: "EMF of a cell", value: "Work done per unit charge by the cell" },
    { key: "Terminal voltage", value: "V = EMF minus the drop across internal resistance" },
    { key: "Heating effect of current", value: "H = I^2 R t, called Joule heating" },
    { key: "Electrical power", value: "P = VI, also I^2 R" },
    {
      key: "Commercial unit of electrical energy",
      value: "kilowatt hour, the board of trade unit",
    },
    { key: "Purpose of earthing", value: "It carries leakage current safely to the ground" },
    { key: "Position of a fuse in a circuit", value: "In the live wire, before the appliance" },
  ],
  "electricity term and its value",
);

add(
  "icse10:phy:magnetism",
  "Physics Class 10",
  "Electromagnetism",
  "Moderate",
  ICSE_10,
  [
    { key: "Oersted experiment", value: "A current-carrying wire deflects a magnetic needle" },
    {
      key: "Right hand thumb rule",
      value: "It gives the direction of the magnetic field of a wire",
    },
    {
      key: "Fleming's left hand rule",
      value: "It gives the direction of force on a current in a field",
    },
    { key: "Fleming's right hand rule", value: "It gives the direction of the induced current" },
    {
      key: "Principle of a DC motor",
      value: "A current-carrying coil experiences a torque in a field",
    },
    { key: "Principle of an AC generator", value: "Electromagnetic induction" },
    {
      key: "Function of a split ring commutator",
      value: "It reverses the current every half rotation",
    },
    {
      key: "Function of slip rings in an AC generator",
      value: "They keep a continuous connection to the coil",
    },
    {
      key: "Transformer that increases voltage",
      value: "A step-up transformer, with more secondary turns",
    },
    { key: "Transformer works only with", value: "Alternating current" },
    {
      key: "Energy loss in a transformer core",
      value: "Eddy currents, reduced by laminating the core",
    },
    { key: "Frequency of AC mains in India", value: "50 Hz" },
  ],
  "electromagnetism term and its definition",
);

add(
  "icse10:phy:modern",
  "Physics Class 10",
  "Calorimetry and Radioactivity",
  "Moderate",
  ICSE_10,
  [
    { key: "Heat capacity", value: "Heat needed to raise the whole body by 1 K" },
    { key: "Specific latent heat of fusion of ice", value: "336 J g^-1" },
    { key: "Specific latent heat of vaporisation of steam", value: "2260 J g^-1" },
    {
      key: "Principle of calorimetry",
      value: "Heat lost by the hot body equals heat gained by the cold body",
    },
    { key: "Alpha particle", value: "A helium nucleus, with charge +2e" },
    { key: "Beta particle", value: "A fast-moving electron from the nucleus" },
    { key: "Gamma radiation", value: "High-energy electromagnetic radiation with no charge" },
    { key: "Most penetrating radiation", value: "Gamma rays" },
    { key: "Least penetrating radiation", value: "Alpha particles, stopped by paper" },
    { key: "Change in mass number on alpha emission", value: "It decreases by four" },
    { key: "Change in atomic number on beta emission", value: "It increases by one" },
    { key: "Background radiation", value: "Radiation always present from natural sources" },
  ],
  "heat or radioactivity term and its value",
);

/* ================================================ CHEMISTRY — CLASS 9 ==== */

add(
  "icse9:chem:matter",
  "Chemistry Class 9",
  "Matter and Its Composition",
  "Easy",
  ICSE_9,
  [
    { key: "Matter", value: "Anything that has mass and occupies space" },
    { key: "Three states of matter", value: "Solid, liquid and gas" },
    { key: "Sublimation", value: "Direct change from solid to gas" },
    { key: "Substances that sublime", value: "Camphor, naphthalene, iodine and ammonium chloride" },
    { key: "Diffusion", value: "Mixing of particles because of their random motion" },
    { key: "State with the strongest intermolecular force", value: "Solid" },
    { key: "Effect of temperature on diffusion", value: "Diffusion becomes faster" },
    { key: "Melting point of ice", value: "0 degrees Celsius, that is 273 K" },
    { key: "Boiling point of water", value: "100 degrees Celsius, that is 373 K" },
    { key: "Latent heat", value: "Heat absorbed during a change of state at constant temperature" },
    { key: "Kelvin value of 0 degrees Celsius", value: "273 K" },
    { key: "Interconversion of states depends on", value: "Temperature and pressure" },
  ],
  "state of matter term and its definition",
);

add(
  "icse9:chem:structure",
  "Chemistry Class 9",
  "Atomic Structure and Chemical Bonding",
  "Moderate",
  ICSE_9,
  [
    { key: "Charge and mass of a proton", value: "Positive, with a mass of 1 amu" },
    { key: "Charge and mass of a neutron", value: "Neutral, with a mass of 1 amu" },
    { key: "Charge of an electron", value: "Negative, mass about 1/1836 amu" },
    { key: "Atomic number", value: "The number of protons in the nucleus" },
    { key: "Mass number", value: "The sum of protons and neutrons" },
    { key: "Isotopes", value: "Same atomic number but different mass number" },
    { key: "Isobars", value: "Same mass number but different atomic number" },
    { key: "Maximum electrons in a shell", value: "2n^2, where n is the shell number" },
    { key: "Duplet rule", value: "Two electrons complete the first shell" },
    { key: "Octet rule", value: "Eight electrons complete the outermost shell" },
    { key: "Ionic bond", value: "Formed by complete transfer of electrons" },
    { key: "Covalent bond", value: "Formed by sharing of electron pairs" },
  ],
  "atomic structure term and its definition",
);

add(
  "icse9:chem:periodic",
  "Chemistry Class 9",
  "The Periodic Table",
  "Moderate",
  ICSE_9,
  [
    { key: "Modern periodic law", value: "Properties are a periodic function of atomic number" },
    { key: "Number of periods in the modern periodic table", value: "Seven" },
    { key: "Number of groups in the modern periodic table", value: "Eighteen" },
    { key: "Group 1 elements", value: "Alkali metals" },
    { key: "Group 2 elements", value: "Alkaline earth metals" },
    { key: "Group 17 elements", value: "Halogens" },
    { key: "Group 18 elements", value: "Noble or inert gases" },
    { key: "Atomic size across a period", value: "It decreases from left to right" },
    { key: "Atomic size down a group", value: "It increases" },
    { key: "Metallic character across a period", value: "It decreases" },
    { key: "Ionisation potential across a period", value: "It increases" },
    { key: "Most electronegative element", value: "Fluorine" },
  ],
  "periodic table trend and its direction",
);

add(
  "icse9:chem:water",
  "Chemistry Class 9",
  "Water, Air and Atmospheric Pollution",
  "Easy",
  ICSE_9,
  [
    { key: "Universal solvent", value: "Water" },
    { key: "Hard water", value: "Water containing calcium and magnesium salts" },
    { key: "Cause of temporary hardness", value: "Bicarbonates of calcium and magnesium" },
    {
      key: "Cause of permanent hardness",
      value: "Chlorides and sulphates of calcium and magnesium",
    },
    { key: "Removal of temporary hardness", value: "By boiling the water" },
    {
      key: "Water of crystallisation",
      value: "Fixed water molecules in a crystal, as in blue vitriol",
    },
    { key: "Efflorescence", value: "Loss of water of crystallisation on exposure to air" },
    { key: "Deliquescence", value: "Absorbing moisture and dissolving in it" },
    { key: "Percentage of nitrogen in air", value: "About 78 per cent" },
    { key: "Percentage of oxygen in air", value: "About 21 per cent" },
    { key: "Main cause of acid rain", value: "Oxides of sulphur and nitrogen" },
    { key: "Gas responsible for the ozone hole", value: "Chlorofluorocarbons" },
  ],
  "water or air term and its value",
);

add(
  "icse9:chem:language",
  "Chemistry Class 9",
  "Language of Chemistry and Chemical Changes",
  "Moderate",
  ICSE_9,
  [
    { key: "Symbol of sodium", value: "Na, from natrium" },
    { key: "Symbol of potassium", value: "K, from kalium" },
    { key: "Symbol of iron", value: "Fe, from ferrum" },
    { key: "Symbol of silver", value: "Ag, from argentum" },
    { key: "Symbol of gold", value: "Au, from aurum" },
    { key: "Symbol of lead", value: "Pb, from plumbum" },
    { key: "Valency of the sulphate radical", value: "Two, formula SO4^2-" },
    { key: "Valency of the ammonium radical", value: "One, formula NH4^+" },
    { key: "Valency of the phosphate radical", value: "Three, formula PO4^3-" },
    {
      key: "Law of conservation of mass",
      value: "Mass is neither created nor destroyed in a reaction",
    },
    { key: "Exothermic reaction", value: "A reaction that releases heat" },
    { key: "Endothermic reaction", value: "A reaction that absorbs heat" },
  ],
  "chemical symbol or law and its meaning",
);

/* =============================================== CHEMISTRY — CLASS 10 ==== */

add(
  "icse10:chem:periodic",
  "Chemistry Class 10",
  "Periodic Properties and Bonding",
  "Moderate",
  ICSE_10,
  [
    { key: "Electronegativity down a group", value: "It decreases" },
    { key: "Electron affinity across a period", value: "It increases" },
    { key: "Nature of oxides of metals", value: "Basic" },
    { key: "Nature of oxides of non-metals", value: "Acidic" },
    {
      key: "Electrovalent compound",
      value: "Formed by transfer of electrons, such as sodium chloride",
    },
    { key: "Covalent compound", value: "Formed by sharing of electrons, such as methane" },
    { key: "Coordinate bond", value: "Both shared electrons come from one atom" },
    { key: "Example of a coordinate bond", value: "The ammonium ion" },
    {
      key: "Melting point of ionic compounds",
      value: "High, because of strong electrostatic forces",
    },
    { key: "Conductivity of covalent compounds", value: "Poor, they have no free ions" },
    {
      key: "Solubility of ionic compounds",
      value: "Soluble in water, insoluble in organic solvents",
    },
    { key: "Element with the largest atomic size in period 3", value: "Sodium" },
  ],
  "bonding or periodic property and its value",
);

add(
  "icse10:chem:acids",
  "Chemistry Class 10",
  "Acids, Bases and Salts",
  "Easy",
  ICSE_10,
  [
    { key: "Arrhenius acid", value: "A substance that gives hydrogen ions in water" },
    { key: "Arrhenius base", value: "A substance that gives hydroxide ions in water" },
    { key: "pH of a neutral solution", value: "7" },
    { key: "pH range of an acid", value: "Below 7" },
    { key: "pH range of a base", value: "Above 7" },
    { key: "Colour of litmus in acid", value: "Red" },
    { key: "Colour of methyl orange in acid", value: "Pink or red" },
    { key: "Colour of phenolphthalein in base", value: "Pink" },
    { key: "Neutralisation reaction", value: "Acid plus base gives salt plus water" },
    { key: "Acid salt", value: "A salt with replaceable hydrogen, such as sodium bisulphate" },
    { key: "Basic salt", value: "A salt with replaceable hydroxide, such as basic lead nitrate" },
    { key: "Common name of sodium hydrogen carbonate", value: "Baking soda" },
  ],
  "acid-base term and its value",
);

add(
  "icse10:chem:electro",
  "Chemistry Class 10",
  "Electrolysis",
  "Difficult",
  ICSE_10,
  [
    { key: "Electrolysis", value: "Decomposition of an electrolyte by passing electricity" },
    {
      key: "Electrolyte",
      value: "A substance that conducts electricity in molten or aqueous state",
    },
    { key: "Non-electrolyte", value: "A substance that does not conduct, such as sugar solution" },
    { key: "Cathode", value: "The negative electrode where reduction occurs" },
    { key: "Anode", value: "The positive electrode where oxidation occurs" },
    { key: "Cation", value: "A positive ion that moves to the cathode" },
    { key: "Anion", value: "A negative ion that moves to the anode" },
    { key: "Strong electrolyte", value: "Completely ionised, such as hydrochloric acid" },
    { key: "Weak electrolyte", value: "Partly ionised, such as acetic acid" },
    { key: "Electroplating", value: "Coating a metal with another metal by electrolysis" },
    { key: "Electrolyte used to electroplate with silver", value: "Sodium argentocyanide" },
    { key: "Product at the cathode in the electrolysis of brine", value: "Hydrogen gas" },
  ],
  "electrolysis term and its definition",
);

add(
  "icse10:chem:metallurgy",
  "Chemistry Class 10",
  "Metallurgy",
  "Moderate",
  ICSE_10,
  [
    { key: "Ore", value: "A mineral from which a metal can be extracted profitably" },
    { key: "Gangue", value: "Earthy impurity present in an ore" },
    { key: "Flux", value: "A substance added to remove gangue as slag" },
    { key: "Main ore of aluminium", value: "Bauxite" },
    { key: "Process to concentrate bauxite", value: "Baeyer's process" },
    {
      key: "Electrolyte in the Hall-Heroult process",
      value: "Alumina dissolved in molten cryolite",
    },
    { key: "Role of cryolite", value: "It lowers the melting point and increases conductivity" },
    { key: "Calcination", value: "Heating an ore strongly in limited air" },
    { key: "Roasting", value: "Heating a sulphide ore strongly in excess air" },
    { key: "Most reactive metal in the activity series", value: "Potassium" },
    { key: "Alloy of copper and zinc", value: "Brass" },
    { key: "Alloy of copper and tin", value: "Bronze" },
  ],
  "metallurgy term and its meaning",
);

add(
  "icse10:chem:organic",
  "Chemistry Class 10",
  "Organic Chemistry",
  "Moderate",
  ICSE_10,
  [
    { key: "Catenation", value: "The ability of carbon to link with itself in chains" },
    { key: "Hydrocarbon", value: "A compound of carbon and hydrogen only" },
    { key: "General formula of alkanes", value: "CnH2n+2" },
    { key: "General formula of alkenes", value: "CnH2n" },
    { key: "General formula of alkynes", value: "CnH2n-2" },
    { key: "Functional group of alcohols", value: "The hydroxyl group, -OH" },
    { key: "Functional group of carboxylic acids", value: "The carboxyl group, -COOH" },
    { key: "Functional group of aldehydes", value: "-CHO" },
    {
      key: "Homologous series",
      value: "Compounds differing by a CH2 unit with the same functional group",
    },
    { key: "Isomerism", value: "Same molecular formula but different structures" },
    { key: "IUPAC name of acetic acid", value: "Ethanoic acid" },
    {
      key: "Product of ethanol and ethanoic acid",
      value: "An ester, in an esterification reaction",
    },
  ],
  "organic chemistry term and its meaning",
);

add(
  "icse10:chem:analytical",
  "Chemistry Class 10",
  "Analytical Chemistry and Mole Concept",
  "Difficult",
  ICSE_10,
  [
    { key: "Colour of a ferrous hydroxide precipitate", value: "Dirty green" },
    { key: "Colour of a ferric hydroxide precipitate", value: "Reddish brown" },
    { key: "Colour of a copper hydroxide precipitate", value: "Pale blue" },
    {
      key: "Precipitate soluble in excess sodium hydroxide",
      value: "Zinc, lead and aluminium hydroxide",
    },
    { key: "Precipitate soluble in excess ammonium hydroxide", value: "Copper and zinc hydroxide" },
    { key: "Gas that turns lime water milky", value: "Carbon dioxide" },
    { key: "Avogadro's number", value: "6.022 x 10^23" },
    { key: "Molar volume of a gas at STP", value: "22.4 litre" },
    {
      key: "Gay-Lussac's law",
      value: "Gases react in simple ratios of volume at the same conditions",
    },
    { key: "Avogadro's law", value: "Equal volumes of gases have equal numbers of molecules" },
    { key: "Relative molecular mass of water", value: "18" },
    { key: "Empirical formula", value: "The simplest whole number ratio of atoms" },
  ],
  "analytical test and its observation",
);

/* ================================================== BIOLOGY — CLASS 9 ==== */

add(
  "icse9:bio:cell",
  "Biology Class 9",
  "Cell — The Unit of Life",
  "Easy",
  ICSE_9,
  [
    { key: "Scientist who discovered the cell", value: "Robert Hooke, in 1665" },
    { key: "Powerhouse of the cell", value: "Mitochondria" },
    { key: "Suicidal bags of the cell", value: "Lysosomes" },
    { key: "Kitchen of the cell", value: "Chloroplast" },
    { key: "Control centre of the cell", value: "Nucleus" },
    { key: "Organelle for protein synthesis", value: "Ribosome" },
    { key: "Organelle that packages and secretes", value: "Golgi apparatus" },
    { key: "Cell wall material in plants", value: "Cellulose" },
    { key: "Organelle absent in animal cells", value: "Cell wall, plastids and a large vacuole" },
    { key: "Organelle absent in plant cells", value: "Centrosome" },
    { key: "Prokaryotic cell", value: "A cell with no true nucleus, such as a bacterium" },
    { key: "Semi-permeable membrane in a cell", value: "The plasma membrane" },
  ],
  "cell organelle and its function",
);

add(
  "icse9:bio:tissues",
  "Biology Class 9",
  "Tissues — Plant and Animal",
  "Moderate",
  ICSE_9,
  [
    { key: "Meristematic tissue", value: "Dividing tissue found at growing tips" },
    { key: "Parenchyma", value: "Simple tissue for storage and photosynthesis" },
    { key: "Collenchyma", value: "Living tissue giving flexibility to young stems" },
    { key: "Sclerenchyma", value: "Dead tissue giving mechanical strength" },
    { key: "Xylem", value: "Conducts water and minerals upward" },
    { key: "Phloem", value: "Conducts prepared food in both directions" },
    { key: "Epithelial tissue", value: "Covers and lines body surfaces" },
    { key: "Connective tissue", value: "Joins and supports, such as blood and bone" },
    { key: "Muscular tissue that is voluntary", value: "Striated or skeletal muscle" },
    {
      key: "Muscular tissue found in the heart",
      value: "Cardiac muscle, involuntary and striated",
    },
    { key: "Nervous tissue unit", value: "The neuron" },
    { key: "Fluid connective tissue", value: "Blood and lymph" },
  ],
  "tissue and its function",
);

add(
  "icse9:bio:plant",
  "Biology Class 9",
  "Plant Physiology and Photosynthesis",
  "Moderate",
  ICSE_9,
  [
    { key: "Equation of photosynthesis", value: "6CO2 + 6H2O gives C6H12O6 + 6O2 in light" },
    { key: "Site of photosynthesis", value: "The chloroplast, mainly in mesophyll cells" },
    { key: "Pigment that traps light energy", value: "Chlorophyll" },
    { key: "Gas released in photosynthesis", value: "Oxygen, which comes from water" },
    { key: "Osmosis", value: "Movement of solvent through a semi-permeable membrane" },
    { key: "Diffusion", value: "Movement of particles from high to low concentration" },
    { key: "Plasmolysis", value: "Shrinking of protoplasm in a hypertonic solution" },
    { key: "Transpiration", value: "Loss of water as vapour from aerial plant parts" },
    { key: "Structure controlling transpiration", value: "The stomata, guarded by guard cells" },
    { key: "Ascent of sap", value: "Upward movement of water through the xylem" },
    { key: "Turgor pressure", value: "Pressure of cell contents against the cell wall" },
    { key: "Instrument to measure transpiration", value: "The potometer" },
  ],
  "plant process and its definition",
);

add(
  "icse9:bio:human",
  "Biology Class 9",
  "Nutrition, Health and Hygiene",
  "Easy",
  ICSE_9,
  [
    { key: "Deficiency disease of vitamin A", value: "Night blindness" },
    { key: "Deficiency disease of vitamin B1", value: "Beri-beri" },
    { key: "Deficiency disease of vitamin C", value: "Scurvy" },
    { key: "Deficiency disease of vitamin D", value: "Rickets in children" },
    { key: "Deficiency of iron", value: "Anaemia" },
    { key: "Deficiency of iodine", value: "Goitre" },
    { key: "Deficiency of protein in children", value: "Kwashiorkor and marasmus" },
    { key: "Disease caused by a female Anopheles bite", value: "Malaria" },
    { key: "Vector of dengue", value: "The Aedes aegypti mosquito" },
    { key: "Causative agent of tuberculosis", value: "Mycobacterium tuberculosis" },
    { key: "Vitamin synthesised by human skin", value: "Vitamin D, in sunlight" },
    { key: "Water-soluble vitamins", value: "Vitamin B complex and vitamin C" },
  ],
  "deficiency or disease and its cause",
);

/* ================================================= BIOLOGY — CLASS 10 ==== */

add(
  "icse10:bio:cellcycle",
  "Biology Class 10",
  "Cell Cycle, Cell Division and Genetics",
  "Moderate",
  ICSE_10_WIDE,
  [
    { key: "Mitosis", value: "Division giving two identical diploid daughter cells" },
    { key: "Meiosis", value: "Reduction division giving four haploid cells" },
    { key: "Site of mitosis in plants", value: "Meristematic tissue at root and shoot tips" },
    { key: "Stage where chromosomes align at the equator", value: "Metaphase" },
    { key: "Stage where chromatids move to the poles", value: "Anaphase" },
    { key: "Number of chromosomes in a human cell", value: "46, that is 23 pairs" },
    { key: "Father of genetics", value: "Gregor Johann Mendel" },
    { key: "Plant used by Mendel", value: "The garden pea, Pisum sativum" },
    { key: "Mendel's law of segregation", value: "Alleles separate during gamete formation" },
    { key: "Monohybrid phenotypic ratio", value: "3 to 1" },
    { key: "Dihybrid phenotypic ratio", value: "9 to 3 to 3 to 1" },
    { key: "Sex chromosomes of a human male", value: "XY" },
  ],
  "genetics term and its value",
);

add(
  "icse10:bio:transport",
  "Biology Class 10",
  "Circulatory System and Transportation",
  "Moderate",
  ICSE_10_WIDE,
  [
    { key: "Number of chambers in the human heart", value: "Four" },
    { key: "Blood vessel carrying blood away from the heart", value: "Artery" },
    { key: "Only artery carrying deoxygenated blood", value: "The pulmonary artery" },
    { key: "Only vein carrying oxygenated blood", value: "The pulmonary vein" },
    { key: "Valve between the right atrium and right ventricle", value: "The tricuspid valve" },
    {
      key: "Valve between the left atrium and left ventricle",
      value: "The bicuspid or mitral valve",
    },
    { key: "Chamber with the thickest wall", value: "The left ventricle" },
    { key: "Pigment in red blood cells", value: "Haemoglobin" },
    { key: "Lifespan of a red blood cell", value: "About 120 days" },
    { key: "Cell responsible for blood clotting", value: "The platelet, or thrombocyte" },
    { key: "Universal donor blood group", value: "O negative" },
    { key: "Universal recipient blood group", value: "AB positive" },
  ],
  "circulatory structure and its function",
);

add(
  "icse10:bio:excretion",
  "Biology Class 10",
  "Excretory and Nervous System",
  "Moderate",
  ICSE_10_WIDE,
  [
    { key: "Structural and functional unit of the kidney", value: "The nephron" },
    { key: "Number of nephrons in one human kidney", value: "About one million" },
    { key: "Process in the glomerulus", value: "Ultrafiltration" },
    { key: "Main nitrogenous waste in humans", value: "Urea" },
    { key: "Organ that makes urea", value: "The liver" },
    { key: "Tube carrying urine from kidney to bladder", value: "The ureter" },
    { key: "Structural unit of the nervous system", value: "The neuron" },
    { key: "Largest part of the human brain", value: "The cerebrum" },
    { key: "Part of the brain controlling balance", value: "The cerebellum" },
    {
      key: "Part of the brain controlling heartbeat and breathing",
      value: "The medulla oblongata",
    },
    { key: "Reflex action is controlled by", value: "The spinal cord" },
    { key: "Gap between two neurons", value: "The synapse" },
  ],
  "organ or structure and its function",
);

add(
  "icse10:bio:endocrine",
  "Biology Class 10",
  "Endocrine System and Reproduction",
  "Moderate",
  ICSE_10_WIDE,
  [
    { key: "Master gland of the body", value: "The pituitary gland" },
    { key: "Hormone from the thyroid gland", value: "Thyroxine, which needs iodine" },
    { key: "Hormone that lowers blood sugar", value: "Insulin, from the pancreas" },
    { key: "Emergency hormone", value: "Adrenaline, from the adrenal medulla" },
    { key: "Growth hormone deficiency in children", value: "Dwarfism" },
    { key: "Excess growth hormone in children", value: "Gigantism" },
    { key: "Male sex hormone", value: "Testosterone" },
    { key: "Female sex hormones", value: "Oestrogen and progesterone" },
    { key: "Site of fertilisation in humans", value: "The fallopian tube" },
    { key: "Normal human gestation period", value: "About 280 days, or nine months" },
    { key: "Structure that nourishes the foetus", value: "The placenta" },
    { key: "Number of chromosomes in a human gamete", value: "23" },
  ],
  "hormone or structure and its function",
);

add(
  "icse10:bio:ecology",
  "Biology Class 10",
  "Photosynthesis, Respiration and Ecosystem",
  "Easy",
  ICSE_10_WIDE,
  [
    { key: "Site of aerobic respiration", value: "The mitochondria" },
    { key: "Energy currency of the cell", value: "ATP" },
    { key: "Product of anaerobic respiration in muscles", value: "Lactic acid" },
    { key: "Product of anaerobic respiration in yeast", value: "Ethanol and carbon dioxide" },
    { key: "Net ATP from one glucose in aerobic respiration", value: "About 36 to 38 ATP" },
    { key: "Producers in an ecosystem", value: "Green plants and other autotrophs" },
    {
      key: "Ten per cent law",
      value: "Only ten per cent of energy passes to the next trophic level",
    },
    { key: "Decomposers", value: "Bacteria and fungi that break down dead matter" },
    { key: "Main greenhouse gas", value: "Carbon dioxide" },
    { key: "Gas that depletes the ozone layer", value: "Chlorofluorocarbons" },
    { key: "Biodegradable waste", value: "Waste broken down by microorganisms, such as paper" },
    { key: "Three Rs of waste management", value: "Reduce, reuse and recycle" },
  ],
  "ecology or respiration term and its meaning",
);

export const ICSE_TEMPLATES = templates;
