/**
 * Theory question bank for ICSE and CBSE Class 9 and Class 10.
 *
 * Board papers are not only MCQs. Most of the marks sit in short-answer,
 * long-answer, reason-based and diagram questions. This library holds the
 * theory questions that repeat in those papers, chapter by chapter, each with
 * its mark weight and a marking-scheme style answer outline so a student can
 * self-check.
 *
 * These are written for KKCC. They are not copied from any board paper or
 * publisher. Where a question mirrors a standard board pattern, the wording
 * here is our own.
 */

export type TheoryQuestion = {
  /** The question as it would appear on a paper. */
  q: string;
  /** Mark weight, which decides how much a student should write. */
  marks: number;
  /** Marking-scheme style answer outline, one bullet per expected point. */
  points: string[];
  /** Short/long answer, reason-based, diagram or numerical. */
  kind: "Short answer" | "Long answer" | "Reason based" | "Diagram" | "Numerical";
};

import { THEORY_EXTRA_CHAPTERS } from "./theory-extra";
import { THEORY_EXTRA2_CHAPTERS } from "./theory-extra2";

export type TheoryChapter = {
  id: string;
  subject: string;
  chapter: string;
  classLevel: 9 | 10;
  boards: ("ICSE" | "CBSE")[];
  questions: TheoryQuestion[];
};

const BOTH: ("ICSE" | "CBSE")[] = ["ICSE", "CBSE"];

export const THEORY_CHAPTERS: TheoryChapter[] = [
  /* ------------------------------------------------- Physics Class 9 */
  {
    id: "th:9:phy:motion",
    subject: "Physics Class 9",
    chapter: "Motion in One Dimension",
    classLevel: 9,
    boards: BOTH,
    questions: [
      {
        q: "Distinguish between distance and displacement with one example of each.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Distance is the total path length, a scalar, and is never negative.",
          "Displacement is the shortest straight line from start to finish, a vector.",
          "A body moving once round a circular track of radius r covers a distance of 2 pi r but has zero displacement.",
        ],
      },
      {
        q: "Derive the equation v = u + at from a velocity-time graph.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Draw a straight-line velocity-time graph starting at u and ending at v after time t.",
          "Acceleration is the slope of the graph, so a = (v - u) / t.",
          "Rearranging gives at = v - u, hence v = u + at.",
        ],
      },
      {
        q: "A body is moving with uniform speed on a circular path. Is its velocity constant? Give a reason.",
        marks: 2,
        kind: "Reason based",
        points: [
          "No, the velocity is not constant.",
          "Velocity is a vector; the direction of motion changes continuously along a circle, so velocity changes even though speed does not.",
        ],
      },
      {
        q: "Draw a distance-time graph for a body at rest and for a body in uniform motion, and state what the slope shows.",
        marks: 3,
        kind: "Diagram",
        points: [
          "At rest: a straight line parallel to the time axis.",
          "Uniform motion: a straight line sloping upward from the origin.",
          "The slope of a distance-time graph gives the speed of the body.",
        ],
      },
      {
        q: "A car starting from rest reaches 20 m/s in 5 s. Find its acceleration and the distance covered.",
        marks: 3,
        kind: "Numerical",
        points: [
          "u = 0, v = 20 m/s, t = 5 s.",
          "a = (v - u)/t = 20/5 = 4 m/s^2.",
          "s = ut + (1/2)at^2 = 0 + (1/2)(4)(25) = 50 m.",
        ],
      },
      {
        q: "What does the area under a velocity-time graph represent? Justify your answer.",
        marks: 2,
        kind: "Reason based",
        points: [
          "It represents the displacement of the body.",
          "Area equals velocity multiplied by time, and velocity times time is displacement.",
        ],
      },
    ],
  },
  {
    id: "th:9:phy:laws",
    subject: "Physics Class 9",
    chapter: "Laws of Motion",
    classLevel: 9,
    boards: BOTH,
    questions: [
      {
        q: "State Newton\u2019s second law of motion and derive F = ma from it.",
        marks: 3,
        kind: "Long answer",
        points: [
          "The rate of change of momentum is directly proportional to the applied force and takes place in the direction of the force.",
          "F is proportional to (mv - mu)/t = m(v - u)/t = ma.",
          "Choosing the SI unit of force makes the constant one, so F = ma.",
        ],
      },
      {
        q: "Why is it easier to stop a lightly loaded truck than a heavily loaded one moving at the same speed?",
        marks: 2,
        kind: "Reason based",
        points: [
          "Momentum is the product of mass and velocity.",
          "The heavier truck has greater momentum, so a larger force or longer time is needed to bring it to rest.",
        ],
      },
      {
        q: "State the law of conservation of momentum and explain the recoil of a gun using it.",
        marks: 3,
        kind: "Long answer",
        points: [
          "In the absence of an external force, the total momentum of a system stays constant.",
          "Before firing, gun and bullet are at rest, so total momentum is zero.",
          "After firing, the forward momentum of the bullet equals the backward momentum of the gun, which is the recoil.",
        ],
      },
      {
        q: "Explain why a person falling on a concrete floor is hurt more than on a heap of sand.",
        marks: 2,
        kind: "Reason based",
        points: [
          "Sand increases the time taken to stop.",
          "For the same change in momentum, a longer time means a smaller force, so the injury is less.",
        ],
      },
      {
        q: "Define inertia and name its three types with one example each.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Inertia is the tendency of a body to resist any change in its state of rest or motion.",
          "Inertia of rest: dust falls off a carpet when beaten.",
          "Inertia of motion: a passenger lurches forward when a bus stops suddenly.",
          "Inertia of direction: mud flies off tangentially from a moving wheel.",
        ],
      },
    ],
  },
  /* ----------------------------------------------- Chemistry Class 9 */
  {
    id: "th:9:chem:structure",
    subject: "Chemistry Class 9",
    chapter: "Atomic Structure and Chemical Bonding",
    classLevel: 9,
    boards: BOTH,
    questions: [
      {
        q: "Define isotopes and isobars, giving one example of each.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Isotopes have the same atomic number but different mass numbers, for example protium, deuterium and tritium.",
          "Isobars have the same mass number but different atomic numbers, for example argon-40 and calcium-40.",
          "Isotopes have identical chemical properties; isobars do not.",
        ],
      },
      {
        q: "Explain the formation of sodium chloride by transfer of electrons.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Sodium has the configuration 2, 8, 1 and loses one electron to form Na+ with a stable octet.",
          "Chlorine has 2, 8, 7 and gains that electron to form Cl- with a stable octet.",
          "The oppositely charged ions attract electrostatically, forming the ionic compound NaCl.",
        ],
      },
      {
        q: "Why do ionic compounds conduct electricity in molten state but not in solid state?",
        marks: 2,
        kind: "Reason based",
        points: [
          "In the solid state the ions are held in fixed positions in the lattice and cannot move.",
          "On melting, the lattice breaks and the ions become free to move and carry current.",
        ],
      },
      {
        q: "Draw the electron dot structure of a water molecule and state the type of bond present.",
        marks: 3,
        kind: "Diagram",
        points: [
          "Oxygen shares one electron pair with each of two hydrogen atoms.",
          "Oxygen is left with two lone pairs.",
          "The bonds are single covalent bonds.",
        ],
      },
      {
        q: "State the octet rule and explain why noble gases are unreactive.",
        marks: 2,
        kind: "Reason based",
        points: [
          "Atoms combine so as to attain eight electrons in the outermost shell.",
          "Noble gases already have a complete octet, or a duplet for helium, so they have no tendency to combine.",
        ],
      },
    ],
  },
  /* ------------------------------------------------- Biology Class 9 */
  {
    id: "th:9:bio:cell",
    subject: "Biology Class 9",
    chapter: "Cell — The Unit of Life",
    classLevel: 9,
    boards: BOTH,
    questions: [
      {
        q: "Give three differences between a plant cell and an animal cell.",
        marks: 3,
        kind: "Short answer",
        points: [
          "A plant cell has a cellulose cell wall; an animal cell has only a plasma membrane.",
          "A plant cell has plastids including chloroplasts; an animal cell has none.",
          "A plant cell has one large central vacuole; an animal cell has small or no vacuoles.",
        ],
      },
      {
        q: "Why are mitochondria called the powerhouse of the cell?",
        marks: 2,
        kind: "Reason based",
        points: [
          "Aerobic respiration takes place inside the mitochondria.",
          "They release energy from glucose and store it as ATP, which the cell uses for all its work.",
        ],
      },
      {
        q: "Why are lysosomes known as suicidal bags?",
        marks: 2,
        kind: "Reason based",
        points: [
          "They contain powerful digestive enzymes.",
          "When a cell is damaged or worn out, the lysosomes burst and the enzymes digest the cell itself.",
        ],
      },
      {
        q: "Draw a labelled diagram of a plant cell showing any six parts.",
        marks: 3,
        kind: "Diagram",
        points: [
          "Label the cell wall, plasma membrane and nucleus.",
          "Label the chloroplast, central vacuole and mitochondria.",
          "The diagram should be neat, proportionate and drawn with a pencil.",
        ],
      },
      {
        q: "Distinguish between prokaryotic and eukaryotic cells on any three points.",
        marks: 3,
        kind: "Short answer",
        points: [
          "A prokaryotic cell has no nuclear membrane; a eukaryotic cell has a true nucleus.",
          "Prokaryotes lack membrane-bound organelles; eukaryotes have them.",
          "Prokaryotic cells are smaller, typically 1 to 10 micrometre, against 10 to 100 micrometre.",
        ],
      },
    ],
  },
  /* ------------------------------------------------ Physics Class 10 */
  {
    id: "th:10:phy:light",
    subject: "Physics Class 10",
    chapter: "Light — Refraction and Lenses",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "State the laws of refraction of light.",
        marks: 2,
        kind: "Short answer",
        points: [
          "The incident ray, the refracted ray and the normal at the point of incidence all lie in the same plane.",
          "The ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant for a given pair of media, which is Snell\u2019s law.",
        ],
      },
      {
        q: "What is total internal reflection? State the two conditions necessary for it.",
        marks: 3,
        kind: "Short answer",
        points: [
          "When light travelling in a denser medium strikes the boundary beyond the critical angle, it is reflected entirely back into the denser medium.",
          "Condition one: light must travel from a denser to a rarer medium.",
          "Condition two: the angle of incidence must be greater than the critical angle.",
        ],
      },
      {
        q: "Why does a diamond sparkle brilliantly?",
        marks: 2,
        kind: "Reason based",
        points: [
          "Diamond has a very high refractive index of about 2.42, so its critical angle is only about 24 degrees.",
          "Light entering it undergoes repeated total internal reflection before emerging, which produces the sparkle.",
        ],
      },
      {
        q: "Draw a ray diagram to show the formation of an image by a convex lens when the object is between F and 2F.",
        marks: 3,
        kind: "Diagram",
        points: [
          "One ray parallel to the principal axis passes through the far focus after refraction.",
          "A second ray through the optical centre goes straight on.",
          "The image forms beyond 2F on the other side and is real, inverted and magnified.",
        ],
      },
      {
        q: "An object is placed 30 cm from a convex lens of focal length 10 cm. Find the image distance and the magnification.",
        marks: 3,
        kind: "Numerical",
        points: [
          "Using 1/v - 1/u = 1/f with u = -30 cm and f = +10 cm.",
          "1/v = 1/10 + 1/(-30) = (3 - 1)/30 = 2/30, so v = +15 cm.",
          "m = v/u = 15/(-30) = -0.5, so the image is real, inverted and half the size.",
        ],
      },
      {
        q: "Explain why the sky appears blue on a clear day.",
        marks: 2,
        kind: "Reason based",
        points: [
          "Air molecules scatter shorter wavelengths far more strongly than longer ones.",
          "Blue light is scattered most among visible colours reaching the eye, so the sky looks blue.",
        ],
      },
    ],
  },
  {
    id: "th:10:phy:electricity",
    subject: "Physics Class 10",
    chapter: "Current Electricity and Household Circuits",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "State Ohm\u2019s law and draw the V-I graph for an ohmic conductor.",
        marks: 3,
        kind: "Diagram",
        points: [
          "At constant temperature, the current through a conductor is directly proportional to the potential difference across it.",
          "The V-I graph is a straight line passing through the origin.",
          "The slope of that line gives the resistance of the conductor.",
        ],
      },
      {
        q: "Why is a fuse always connected in the live wire and never in the neutral wire?",
        marks: 2,
        kind: "Reason based",
        points: [
          "If the fuse blows in the live wire, the supply to the appliance is cut off completely.",
          "A fuse in the neutral wire would leave the appliance still connected to the live line, which stays dangerous.",
        ],
      },
      {
        q: "Explain why the filament of an electric bulb is made of tungsten.",
        marks: 2,
        kind: "Reason based",
        points: [
          "Tungsten has a very high melting point of about 3380 degrees Celsius, so it does not melt when white hot.",
          "It has high resistivity and low volatility, so it glows brightly and lasts.",
        ],
      },
      {
        q: "Derive the expression for the equivalent resistance of three resistors connected in parallel.",
        marks: 3,
        kind: "Long answer",
        points: [
          "In parallel the potential difference V is the same across each resistor.",
          "The main current divides, so I = I1 + I2 + I3 = V/R1 + V/R2 + V/R3.",
          "Since I = V/R, dividing throughout by V gives 1/R = 1/R1 + 1/R2 + 1/R3.",
        ],
      },
      {
        q: "An electric heater of 1000 W works for 3 hours daily. Find the units of energy consumed in 30 days.",
        marks: 3,
        kind: "Numerical",
        points: [
          "Power = 1000 W = 1 kW.",
          "Energy per day = 1 kW x 3 h = 3 kWh.",
          "Energy in 30 days = 3 x 30 = 90 kWh, that is 90 units.",
        ],
      },
    ],
  },
  /* ---------------------------------------------- Chemistry Class 10 */
  {
    id: "th:10:chem:electro",
    subject: "Chemistry Class 10",
    chapter: "Electrolysis",
    classLevel: 10,
    boards: ["ICSE"],
    questions: [
      {
        q: "Define electrolysis and name the products formed at each electrode during the electrolysis of molten lead bromide.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Electrolysis is the decomposition of an electrolyte in molten or aqueous state by the passage of electricity.",
          "At the cathode, lead ions gain electrons and grey lead metal is deposited.",
          "At the anode, bromide ions lose electrons and reddish brown bromine vapour is released.",
        ],
      },
      {
        q: "Distinguish between a strong electrolyte and a weak electrolyte with one example of each.",
        marks: 3,
        kind: "Short answer",
        points: [
          "A strong electrolyte ionises almost completely in solution, for example hydrochloric acid.",
          "A weak electrolyte ionises only partly, for example acetic acid.",
          "Strong electrolytes therefore conduct far better at the same concentration.",
        ],
      },
      {
        q: "Why is an aqueous solution of sodium chloride a good conductor while solid sodium chloride is not?",
        marks: 2,
        kind: "Reason based",
        points: [
          "In the solid, ions are locked in a rigid lattice and cannot move.",
          "In solution, the lattice dissociates and the free ions carry the current.",
        ],
      },
      {
        q: "Explain the electroplating of an iron spoon with silver, naming the anode, cathode and electrolyte.",
        marks: 3,
        kind: "Long answer",
        points: [
          "The anode is a pure silver plate and the cathode is the clean iron spoon.",
          "The electrolyte is a solution of sodium argentocyanide.",
          "Silver dissolves from the anode and deposits evenly on the spoon at the cathode.",
        ],
      },
    ],
  },
  {
    id: "th:10:chem:acids",
    subject: "Chemistry Class 10",
    chapter: "Acids, Bases and Salts",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "What is a neutralisation reaction? Write the equation for the reaction between sodium hydroxide and hydrochloric acid.",
        marks: 3,
        kind: "Short answer",
        points: [
          "A reaction in which an acid and a base react to give a salt and water only.",
          "NaOH + HCl gives NaCl + H2O.",
          "The reaction is exothermic and the resulting solution is neutral.",
        ],
      },
      {
        q: "Explain why an aqueous solution of an acid conducts electricity but a solution of glucose does not.",
        marks: 2,
        kind: "Reason based",
        points: [
          "An acid ionises in water to give free hydrogen ions and anions that carry current.",
          "Glucose dissolves as neutral molecules and produces no ions, so it cannot conduct.",
        ],
      },
      {
        q: "Define pH and state the pH ranges for acidic, neutral and basic solutions.",
        marks: 3,
        kind: "Short answer",
        points: [
          "pH is a measure of the hydrogen ion concentration of a solution on a scale of 0 to 14.",
          "Acidic solutions have a pH below 7 and basic solutions above 7.",
          "A neutral solution such as pure water has a pH of exactly 7.",
        ],
      },
      {
        q: "Why does dry hydrogen chloride gas not turn dry blue litmus red?",
        marks: 2,
        kind: "Reason based",
        points: [
          "Acidic behaviour requires the release of hydrogen ions, which needs water.",
          "Dry hydrogen chloride has no water to ionise in, so it produces no H+ ions and the litmus is unchanged.",
        ],
      },
    ],
  },
  /* ------------------------------------------------ Biology Class 10 */
  {
    id: "th:10:bio:transport",
    subject: "Biology Class 10",
    chapter: "Circulatory System and Transportation",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "Give three differences between an artery and a vein.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Arteries carry blood away from the heart; veins carry it towards the heart.",
          "Arteries have thick elastic walls and a narrow lumen; veins have thin walls and a wide lumen.",
          "Veins have valves to stop backflow; arteries, apart from the two great arteries, do not.",
        ],
      },
      {
        q: "Why is the wall of the left ventricle thicker than that of the right ventricle?",
        marks: 2,
        kind: "Reason based",
        points: [
          "The left ventricle pumps blood to the whole body through the aorta.",
          "It must generate much higher pressure than the right ventricle, which pumps only to the nearby lungs.",
        ],
      },
      {
        q: "Describe the double circulation of blood in humans.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Blood passes through the heart twice in one complete circuit.",
          "Pulmonary circulation carries deoxygenated blood from the right ventricle to the lungs and back to the left atrium.",
          "Systemic circulation carries oxygenated blood from the left ventricle to the body and back to the right atrium.",
        ],
      },
      {
        q: "Draw a labelled diagram of the internal structure of the human heart.",
        marks: 3,
        kind: "Diagram",
        points: [
          "Label the four chambers: right and left atrium, right and left ventricle.",
          "Label the tricuspid, bicuspid and the two semilunar valves.",
          "Label the aorta, pulmonary artery, pulmonary vein and the two venae cavae.",
        ],
      },
      {
        q: "State the functions of blood plasma and name any two constituents it transports.",
        marks: 2,
        kind: "Short answer",
        points: [
          "Plasma transports nutrients, hormones, waste and heat around the body.",
          "It carries digested food such as glucose and amino acids, and waste such as urea.",
        ],
      },
    ],
  },
  {
    id: "th:10:bio:genetics",
    subject: "Biology Class 10",
    chapter: "Cell Cycle, Cell Division and Genetics",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "Give three differences between mitosis and meiosis.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Mitosis produces two daughter cells; meiosis produces four.",
          "Mitosis keeps the chromosome number the same; meiosis halves it.",
          "Mitosis occurs in somatic cells; meiosis occurs in reproductive cells.",
        ],
      },
      {
        q: "State Mendel\u2019s law of segregation and explain it with a monohybrid cross.",
        marks: 3,
        kind: "Long answer",
        points: [
          "The two alleles of a gene separate during gamete formation so that each gamete gets only one.",
          "A cross between tall TT and dwarf tt gives all Tt tall plants in the F1 generation.",
          "Selfing the F1 gives a 3 to 1 phenotypic ratio and a 1 to 2 to 1 genotypic ratio in F2.",
        ],
      },
      {
        q: "Why is meiosis necessary for sexually reproducing organisms?",
        marks: 2,
        kind: "Reason based",
        points: [
          "It halves the chromosome number so that gametes are haploid.",
          "Fertilisation then restores the diploid number, keeping it constant across generations.",
        ],
      },
      {
        q: "Explain how the sex of a child is determined in humans.",
        marks: 3,
        kind: "Long answer",
        points: [
          "The mother is XX and produces only X-bearing eggs.",
          "The father is XY and produces both X-bearing and Y-bearing sperm.",
          "An X sperm gives a girl and a Y sperm gives a boy, so the father determines the sex.",
        ],
      },
    ],
  },
];

THEORY_CHAPTERS.push(...THEORY_EXTRA_CHAPTERS);
THEORY_CHAPTERS.push(...THEORY_EXTRA2_CHAPTERS);

/** Every distinct subject in the theory library. */
export function theorySubjects(): string[] {
  return [...new Set(THEORY_CHAPTERS.map((c) => c.subject))].sort();
}

/** Chapters for one board and class, e.g. ICSE class 10. */
export function theoryChapters(board: "ICSE" | "CBSE", classLevel: 9 | 10): TheoryChapter[] {
  return THEORY_CHAPTERS.filter(
    (c) => c.classLevel === classLevel && c.boards.includes(board),
  ).sort((a, b) => a.subject.localeCompare(b.subject) || a.chapter.localeCompare(b.chapter));
}

/** Totals used on the test series cards. */
export function theoryTotals(board: "ICSE" | "CBSE", classLevel: 9 | 10) {
  const chapters = theoryChapters(board, classLevel);
  const questions = chapters.reduce((sum, c) => sum + c.questions.length, 0);
  const marks = chapters.reduce((sum, c) => sum + c.questions.reduce((s, q) => s + q.marks, 0), 0);
  return {
    chapters: chapters.length,
    subjects: new Set(chapters.map((c) => c.subject)).size,
    questions,
    marks,
  };
}
