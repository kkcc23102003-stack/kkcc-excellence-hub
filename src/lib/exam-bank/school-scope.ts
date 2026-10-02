import type { Template } from "./core";
/** Topic-level grade separation, checked against the retrieved CBSE 2026–27 primary PDFs.
 * This is a practice-bank scope gate, NOT a claim that every fact meets the entire syllabus.
 * It removes only incorrect exam tags. Original builders, IDs and other exam tags remain intact.
 */
const physics11 = new Set([
  "Units and Measurements",
  "Motion in a Straight Line",
  "Motion in a Plane",
  "Laws of Motion",
  "Work Energy and Power",
  "System of Particles and Rotational Motion",
  "Gravitation",
  "Mechanical Properties of Solids",
  "Mechanical Properties of Fluids",
  "Thermal Properties of Matter",
  "Thermodynamics",
  "Kinetic Theory of Gases",
  "Oscillations",
  "Waves",
]);
const physics12 = new Set([
  "Electric Charges and Fields",
  "Electrostatic Potential and Capacitance",
  "Current Electricity",
  "Moving Charges and Magnetism",
  "Magnetism and Matter",
  "Electromagnetic Induction",
  "Alternating Current",
  "Electromagnetic Waves",
  "Ray Optics",
  "Ray Optics and Optical Instruments",
  "Wave Optics",
  "Dual Nature of Radiation and Matter",
  "Atoms and Nuclei",
  "Semiconductor Electronics",
]);
const math11 = new Set([
  "Sets",
  "Relations and Functions",
  "Trigonometric Functions",
  "Complex Numbers and Quadratic Equations",
  "Quadratic Equations",
  "Linear Inequalities",
  "Permutations and Combinations",
  "Binomial Theorem",
  "Sequences and Series",
  "Straight Lines",
  "Circles",
  "Conic Sections",
  "Three Dimensional Geometry",
  "Limits and Derivatives",
  "Differentiation",
  "Statistics",
  "Probability",
]);
const math12 = new Set([
  "Relations and Functions",
  "Inverse Trigonometric Functions",
  "Matrices and Determinants",
  "Continuity and Differentiability",
  "Differentiation",
  "Integration",
  "Integrals",
  "Applications of Derivatives",
  "Applications of Integrals",
  "Differential Equations",
  "Vector Algebra",
  "Three Dimensional Geometry",
  "Linear Programming",
  "Probability",
]);
const chemistry11 = new Set([
  "Some Basic Concepts of Chemistry",
  "Mole Concept",
  "Structure of Atom",
  "Periodic Table",
  "Periodic Classification",
  "Chemical Bonding and Molecular Structure",
  "Thermodynamics",
  "Equilibrium",
  "Redox Reactions",
  "Organic Chemistry Basics",
  "IUPAC Nomenclature",
  "Hydrocarbons",
  "Hydrogen and the s-Block Elements",
  "The p-Block Elements",
  "States of Matter",
]);
const chemistry12 = new Set([
  "Solutions",
  "Electrochemistry",
  "Chemical Kinetics",
  "The d-Block and f-Block Elements",
  "Coordination Compounds",
  "Haloalkanes and Haloarenes",
  "Alcohols, Phenols and Ethers",
  "Aldehydes, Ketones and Carboxylic Acids",
  "Amines and Diazonium Salts",
  "Biomolecules, Polymers and Chemistry in Everyday Life",
  "Biomolecules",
  "Surface Chemistry",
  "Metallurgy",
]);
const biology11 = new Set([
  "The Living World",
  "Biological Classification",
  "Plant Kingdom",
  "Animal Kingdom",
  "Morphology of Flowering Plants",
  "Anatomy of Flowering Plants",
  "Structural Organisation in Animals",
  "Cell Structure and Function",
  "Biomolecules",
  "Cell Cycle and Cell Division",
  "Photosynthesis",
  "Respiration in Plants",
  "Plant Physiology",
  "Breathing and Exchange of Gases",
  "Body Fluids and Circulation",
  "Excretory Products and Elimination",
  "Locomotion and Movement",
  "Neural Control and Coordination",
  "Chemical Coordination",
]);
const biology12 = new Set([
  "Reproduction",
  "Genetics and Evolution",
  "Molecular Basis of Inheritance",
  "Human Health and Disease",
  "Biotechnology",
  "Ecology and Environment",
  "Microbes in Human Welfare",
]);
const scopes: Record<string, [Set<string>, Set<string>]> = {
  Physics: [physics11, physics12],
  Mathematics: [math11, math12],
  Chemistry: [chemistry11, chemistry12],
  Biology: [biology11, biology12],
};
const science9 = new Set([
  "The Fundamental Unit of Life",
  "Cell",
  "Tissues",
  "Motion",
  "Force and Laws of Motion",
  "Work and Energy",
  "Work, Energy and Simple Machines",
  "Sound",
  "Is Matter Around Us Pure",
  "Exploring Mixtures and their Separation",
  "Atoms and Molecules",
  "Structure of the Atom",
  "Diversity in Living Organisms (old NCERT)",
  "Diversity",
  "Reproduction",
  "Earth as a System: Energy, Matter and Life",
]);
export function applySchoolGradeScope(templates: Template[]) {
  let removed = 0;
  for (const template of templates) {
    const pair = scopes[template.subject];
    template.exams = template.exams.filter((exam) => {
      let allowed = true;
      if (pair && (exam === "CBSE Class 11" || exam === "CBSE Class 12" || exam === "ISC Class 11" || exam === "ISC Class 12"))
        allowed = pair[exam.endsWith("11") ? 0 : 1].has(template.topic);
      if (exam === "ISC Class 11" && /Class 12$/i.test(template.subject)) allowed = false;
      if (exam === "ISC Class 12" && /Class 11$/i.test(template.subject)) allowed = false;
      if (exam === "CBSE Class 9" && template.subject === "SST") allowed = false; // These were Class 10 chapters wrongly tagged as Class 9.
      if (
        exam === "CBSE Class 9" &&
        template.subject === "SST Class 9" &&
        !template.id.startsWith("practice26:")
      )
        allowed = false; // New 2026–27 course outline is NOT the old French-Revolution list.
      if (exam === "CBSE Class 9" && template.subject === "Science Class 9")
        allowed = science9.has(template.topic);
      if (!allowed) removed += 1;
      return allowed;
    });
  }
  return removed;
}
