/**
 * The remaining theory chapters for the ICSE and CBSE Class 9 and 10 series.
 *
 * The Class 9 series in particular were thin, and Mathematics had no theory
 * chapter at Class 9 at all. Board-specific chapters are tagged so that the
 * ICSE series never shows a CBSE-only chapter and the other way round.
 *
 * Written for KKCC. Nothing here is copied from a board paper or a publisher.
 */

import type { TheoryChapter } from "./theory-bank";

const BOTH: ("ICSE" | "CBSE")[] = ["ICSE", "CBSE"];
const ICSE: ("ICSE" | "CBSE")[] = ["ICSE"];
const CBSE: ("ICSE" | "CBSE")[] = ["CBSE"];

export const THEORY_EXTRA2_CHAPTERS: TheoryChapter[] = [
  /* ================================================ Physics Class 9 ==== */
  {
    id: "th:9:phy:heat-energy",
    subject: "Physics Class 9",
    chapter: "Heat and Energy",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "Define specific heat capacity and state its SI unit. Why does the sea breeze blow from the sea to the land during the day?",
        marks: 3,
        kind: "Short answer",
        points: [
          "Specific heat capacity is the heat needed to raise the temperature of unit mass of a substance by one kelvin.",
          "Its SI unit is joule per kilogram per kelvin.",
          "Water has a very high specific heat capacity, so by day the land heats faster than the sea.",
          "The warm air over the land rises and cooler air from the sea moves in, giving the sea breeze.",
        ],
      },
      {
        q: "State the principle of calorimetry and explain how it is used to find the specific heat capacity of a solid.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Heat lost by the hotter body equals heat gained by the colder body, if no heat escapes to the surroundings.",
          "A heated solid of known mass and temperature is dropped into water of known mass and temperature in a calorimeter.",
          "The final steady temperature is noted and heat lost by the solid is equated to heat gained by water and calorimeter.",
          "Solving m c (t1 - t) = (m1 c1 + w) (t - t2) gives the specific heat capacity c of the solid.",
        ],
      },
      {
        q: "Why are water bodies used as coolants in car radiators and industrial plants?",
        marks: 2,
        kind: "Reason based",
        points: [
          "Water has an unusually high specific heat capacity of about 4200 joule per kilogram per kelvin.",
          "It therefore absorbs a large quantity of heat with only a small rise in its own temperature.",
        ],
      },
      {
        q: "Explain the anomalous expansion of water and state one way it helps aquatic life.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Water contracts on heating from 0 to 4 degrees Celsius and expands above 4 degrees Celsius.",
          "It therefore has its maximum density at 4 degrees Celsius.",
          "In a freezing lake the coldest water stays on top and freezes, while water at 4 degrees Celsius sinks to the bottom.",
          "The ice layer insulates the water below, so fish and other aquatic life survive the winter.",
        ],
      },
    ],
  },
  {
    id: "th:9:phy:reflection",
    subject: "Physics Class 9",
    chapter: "Reflection of Light",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "State the two laws of reflection of light and draw a ray diagram to illustrate them.",
        marks: 3,
        kind: "Diagram",
        points: [
          "The angle of incidence is equal to the angle of reflection.",
          "The incident ray, the reflected ray and the normal at the point of incidence all lie in the same plane.",
          "Draw a plane mirror, an incident ray, the normal at the point of incidence and the reflected ray, marking i and r equal.",
        ],
      },
      {
        q: "List four characteristics of the image formed by a plane mirror.",
        marks: 4,
        kind: "Short answer",
        points: [
          "The image is virtual and erect.",
          "It is of the same size as the object.",
          "It is as far behind the mirror as the object is in front of it.",
          "It is laterally inverted, so the left of the object appears as the right of the image.",
        ],
      },
      {
        q: "Why is a concave mirror used as a shaving mirror and a convex mirror as a rear view mirror?",
        marks: 3,
        kind: "Reason based",
        points: [
          "A concave mirror gives an erect, virtual and magnified image when the face is held within its focus.",
          "A convex mirror always gives an erect, virtual and diminished image.",
          "The diminished image lets the driver see a wide field of view behind the vehicle.",
        ],
      },
      {
        q: "Distinguish between regular and irregular reflection with one example of each.",
        marks: 2,
        kind: "Short answer",
        points: [
          "In regular reflection a parallel beam stays parallel after reflection from a smooth surface, as from a plane mirror.",
          "In irregular or diffuse reflection the beam is scattered in all directions by a rough surface, as from a wall or paper.",
        ],
      },
    ],
  },
  {
    id: "th:9:phy:work-energy",
    subject: "Physics Class 9",
    chapter: "Work, Energy and Power",
    classLevel: 9,
    boards: CBSE,
    questions: [
      {
        q: "Define work and state the conditions under which work done is zero. Give one example of each condition.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Work is the product of the force and the displacement in the direction of the force, W = F s cos theta.",
          "Work is zero when the displacement is zero, as when a man pushes a wall that does not move.",
          "Work is zero when the force is zero, as for a body moving with uniform velocity on a frictionless surface.",
          "Work is zero when the force is perpendicular to the displacement, as for a coolie carrying a load on his head walking on level ground.",
        ],
      },
      {
        q: "Derive an expression for the kinetic energy of a body of mass m moving with velocity v.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Let a constant force F act on a body at rest and move it through a distance s, giving it a velocity v.",
          "From v squared equals u squared plus 2 a s with u equal to zero, s = v squared divided by 2a.",
          "Work done W = F s = m a times v squared over 2a, which simplifies to half m v squared.",
          "This work is stored as kinetic energy, so KE = half m v squared.",
        ],
      },
      {
        q: "State the law of conservation of energy and verify it for a body falling freely from a height h.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Energy can neither be created nor destroyed, only changed from one form to another, and the total remains constant.",
          "At the top the body has potential energy m g h and zero kinetic energy.",
          "After falling a distance x the potential energy is m g (h minus x) and the kinetic energy is m g x.",
          "At every point the sum of potential and kinetic energy equals m g h, which verifies the law.",
        ],
      },
      {
        q: "An electric bulb of 60 W is used for 6 hours a day. Calculate the energy consumed in 30 days in kilowatt hour.",
        marks: 2,
        kind: "Numerical",
        points: [
          "Energy per day = 60 W times 6 h = 360 Wh = 0.36 kWh.",
          "Energy in 30 days = 0.36 times 30 = 10.8 kWh, that is 10.8 units.",
        ],
      },
    ],
  },
  /* ============================================== Chemistry Class 9 ==== */
  {
    id: "th:9:chem:gas-laws",
    subject: "Chemistry Class 9",
    chapter: "Study of Gas Laws",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "State Boyle's law and Charles's law and write the combined gas equation.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Boyle's law states that at constant temperature the volume of a fixed mass of gas is inversely proportional to its pressure, so P V is constant.",
          "Charles's law states that at constant pressure the volume of a fixed mass of gas is directly proportional to its absolute temperature, so V by T is constant.",
          "Combining the two gives P1 V1 by T1 equal to P2 V2 by T2.",
        ],
      },
      {
        q: "What is absolute zero? Why is the Kelvin scale used in gas law calculations?",
        marks: 3,
        kind: "Reason based",
        points: [
          "Absolute zero is minus 273.15 degrees Celsius, the temperature at which the volume of an ideal gas would theoretically become zero.",
          "It is the lowest temperature that is theoretically possible.",
          "The Kelvin scale has no negative values, so volume stays directly proportional to temperature and the ratio V by T is valid.",
        ],
      },
      {
        q: "A gas occupies 300 cubic centimetre at 27 degrees Celsius and 760 mm of mercury. Find its volume at standard temperature and pressure.",
        marks: 3,
        kind: "Numerical",
        points: [
          "Convert temperatures to kelvin, T1 = 27 + 273 = 300 K and T2 = 273 K. P1 = P2 = 760 mm, so pressure cancels.",
          "Apply V1 by T1 = V2 by T2, so 300 by 300 = V2 by 273.",
          "V2 = 273 cubic centimetre at standard temperature and pressure.",
        ],
      },
      {
        q: "State the postulates of the kinetic molecular theory that explain Boyle's law.",
        marks: 3,
        kind: "Long answer",
        points: [
          "A gas consists of a very large number of tiny particles in constant random motion.",
          "Pressure arises from the collisions of these particles with the walls of the container.",
          "Reducing the volume packs the same number of particles into a smaller space, so collisions per unit area per second increase.",
          "The pressure therefore rises as the volume falls, which is Boyle's law.",
        ],
      },
    ],
  },
  {
    id: "th:9:chem:periodic-table",
    subject: "Chemistry Class 9",
    chapter: "The Periodic Table",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "State the modern periodic law and explain how it removed the defects of Mendeleev's table.",
        marks: 3,
        kind: "Long answer",
        points: [
          "The modern periodic law states that the properties of elements are a periodic function of their atomic numbers.",
          "Mendeleev arranged elements by atomic mass, which put a few pairs such as argon and potassium in the wrong order.",
          "Arranging by atomic number places every element correctly and explains the position of isotopes, which have the same atomic number.",
        ],
      },
      {
        q: "Explain the variation of atomic size and metallic character across a period and down a group.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Across a period the nuclear charge rises while the shell stays the same, so atomic size decreases.",
          "Down a group a new shell is added at each step, so atomic size increases.",
          "Metallic character decreases across a period because the tendency to lose electrons falls as nuclear pull rises.",
          "Metallic character increases down a group because the outer electron is farther from the nucleus and easier to lose.",
        ],
      },
      {
        q: "Why are the elements of group 18 called noble gases and placed at the extreme right of the table?",
        marks: 2,
        kind: "Reason based",
        points: [
          "They have a completely filled outermost shell, a duplet in helium and an octet in the rest.",
          "They therefore have no tendency to gain, lose or share electrons and are chemically inert.",
        ],
      },
      {
        q: "Define ionisation potential and electron affinity, and state how each varies across a period.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Ionisation potential is the energy needed to remove the most loosely held electron from a neutral gaseous atom.",
          "Electron affinity is the energy released when a neutral gaseous atom accepts an electron.",
          "Both generally increase across a period as the atomic size falls and the nuclear pull rises.",
        ],
      },
    ],
  },
  {
    id: "th:9:chem:matter-pure",
    subject: "Chemistry Class 9",
    chapter: "Is Matter Around Us Pure",
    classLevel: 9,
    boards: CBSE,
    questions: [
      {
        q: "Differentiate between a mixture and a compound on the basis of four points.",
        marks: 4,
        kind: "Short answer",
        points: [
          "A mixture has components in any ratio, a compound has elements in a fixed ratio by mass.",
          "A mixture keeps the properties of its components, a compound has properties different from its elements.",
          "A mixture can be separated by physical means, a compound only by chemical means.",
          "No energy change usually occurs on forming a mixture, while heat or light is absorbed or given out on forming a compound.",
        ],
      },
      {
        q: "What is a colloid? Explain the Tyndall effect with two examples from everyday life.",
        marks: 3,
        kind: "Long answer",
        points: [
          "A colloid is a heterogeneous mixture whose particles are between one and one thousand nanometre and do not settle on standing.",
          "The Tyndall effect is the scattering of a beam of light by colloidal particles, which makes the path of the beam visible.",
          "Sunlight entering a room through a small hole shows its path because of dust particles in the air.",
          "The beam of a torch is visible in fog or mist because of the water droplets in the air.",
        ],
      },
      {
        q: "Describe how a mixture of common salt, sand and ammonium chloride can be separated.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Heat the mixture, when ammonium chloride sublimes and is collected on a cool surface as a solid.",
          "Add water to the remaining mixture and stir, when common salt dissolves and sand does not.",
          "Filter to separate sand as residue, then evaporate the filtrate to recover common salt.",
        ],
      },
      {
        q: "Calculate the mass percentage of a solution made by dissolving 40 gram of sugar in 320 gram of water.",
        marks: 2,
        kind: "Numerical",
        points: [
          "Mass of solution = 40 + 320 = 360 gram.",
          "Mass percentage = (40 divided by 360) times 100 = 11.1 per cent approximately.",
        ],
      },
    ],
  },
  /* ================================================ Biology Class 9 ==== */
  {
    id: "th:9:bio:nutrition-digestion",
    subject: "Biology Class 9",
    chapter: "Nutrition and the Digestive System",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "Name the enzymes of the human digestive system that act on starch, protein and fat, and state where each acts.",
        marks: 4,
        kind: "Short answer",
        points: [
          "Salivary amylase, or ptyalin, acts on starch in the mouth.",
          "Pepsin acts on protein in the stomach in an acidic medium.",
          "Trypsin acts on protein and pancreatic amylase on starch in the small intestine.",
          "Lipase acts on fat in the small intestine, aided by bile from the liver.",
        ],
      },
      {
        q: "Describe the structure of a villus and explain how it is adapted for absorption.",
        marks: 3,
        kind: "Diagram",
        points: [
          "A villus is a small finger-like projection of the inner wall of the small intestine.",
          "Millions of villi greatly increase the surface area available for absorption.",
          "Each villus has a network of blood capillaries that absorb glucose and amino acids, and a lacteal that absorbs fatty acids and glycerol.",
          "Its wall is only one cell thick, so absorbed food passes quickly into the blood.",
        ],
      },
      {
        q: "Name two deficiency diseases each caused by lack of vitamins and of minerals, with the nutrient involved.",
        marks: 4,
        kind: "Short answer",
        points: [
          "Lack of vitamin C causes scurvy and lack of vitamin D causes rickets.",
          "Lack of vitamin A causes night blindness and lack of vitamin B1 causes beri beri.",
          "Lack of iron causes anaemia.",
          "Lack of iodine causes goitre and lack of calcium weakens bones and teeth.",
        ],
      },
      {
        q: "Why is roughage an essential part of a balanced diet although it provides no nourishment?",
        marks: 2,
        kind: "Reason based",
        points: [
          "Roughage is indigestible cellulose fibre that adds bulk to the food in the alimentary canal.",
          "It helps peristalsis and retains water, so it prevents constipation and keeps the bowel healthy.",
        ],
      },
    ],
  },
  {
    id: "th:9:bio:respiratory-health",
    subject: "Biology Class 9",
    chapter: "The Respiratory System and Health",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "Describe the mechanism of inspiration in human beings.",
        marks: 3,
        kind: "Long answer",
        points: [
          "The diaphragm contracts and flattens, moving downward.",
          "The external intercostal muscles contract and pull the ribs upward and outward.",
          "The volume of the thoracic cavity increases and the pressure inside falls below atmospheric pressure.",
          "Air therefore rushes in through the nostrils, trachea and bronchi into the alveoli.",
        ],
      },
      {
        q: "State four ways in which the alveoli are adapted for the exchange of gases.",
        marks: 4,
        kind: "Short answer",
        points: [
          "They are very numerous, giving an enormous surface area for exchange.",
          "Their walls are only one cell thick, so diffusion is rapid.",
          "They are richly supplied with blood capillaries, which maintains the concentration gradient.",
          "Their inner surface is moist, so gases dissolve before diffusing.",
        ],
      },
      {
        q: "Differentiate between breathing and respiration.",
        marks: 2,
        kind: "Short answer",
        points: [
          "Breathing is a physical process of taking in and giving out air, involving no enzymes and releasing no energy.",
          "Respiration is a biochemical process in the cells that oxidises food with the help of enzymes and releases energy as ATP.",
        ],
      },
      {
        q: "Explain why a person feels breathless at high altitude.",
        marks: 3,
        kind: "Reason based",
        points: [
          "At high altitude the atmospheric pressure and the partial pressure of oxygen are low.",
          "Less oxygen therefore diffuses into the blood at the alveoli and the haemoglobin is less saturated.",
          "The tissues receive less oxygen, so breathing becomes rapid and deep and the person feels breathless until acclimatised.",
        ],
      },
    ],
  },
  {
    id: "th:9:bio:fall-ill",
    subject: "Biology Class 9",
    chapter: "Why Do We Fall Ill",
    classLevel: 9,
    boards: CBSE,
    questions: [
      {
        q: "Differentiate between acute and chronic disease and state which has a more serious long term effect on health.",
        marks: 3,
        kind: "Short answer",
        points: [
          "An acute disease lasts for a short time, such as a common cold or typhoid.",
          "A chronic disease lasts for a long time, often for years, such as tuberculosis or diabetes.",
          "A chronic disease has a more serious long term effect because prolonged poor health causes loss of weight, energy and working capacity.",
        ],
      },
      {
        q: "Name the causative agent and the mode of transmission of malaria, tuberculosis and AIDS.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Malaria is caused by the protozoan Plasmodium and spread by the bite of the female Anopheles mosquito.",
          "Tuberculosis is caused by the bacterium Mycobacterium tuberculosis and spread through air by droplets.",
          "AIDS is caused by the human immunodeficiency virus and spread by sexual contact, infected blood and from mother to child.",
        ],
      },
      {
        q: "Explain the principle of immunisation and name two diseases prevented by vaccination.",
        marks: 3,
        kind: "Long answer",
        points: [
          "The immune system remembers a pathogen it has met once and responds faster and more strongly the next time.",
          "A vaccine introduces a killed or weakened pathogen or its parts, which trains the immune system without causing disease.",
          "Polio and tetanus are prevented by vaccination, as are measles, diphtheria and hepatitis B.",
        ],
      },
      {
        q: "Why are antibiotics effective against bacteria but not against viruses?",
        marks: 2,
        kind: "Reason based",
        points: [
          "Antibiotics block a biochemical pathway of the bacterium, such as cell wall synthesis, which the bacterium needs to live.",
          "Viruses have no such pathways of their own and use the machinery of the host cell, so antibiotics do not affect them.",
        ],
      },
    ],
  },
  {
    id: "th:9:bio:natural-resources",
    subject: "Biology Class 9",
    chapter: "Natural Resources and Improvement in Food Resources",
    classLevel: 9,
    boards: CBSE,
    questions: [
      {
        q: "Draw and explain the nitrogen cycle in nature.",
        marks: 4,
        kind: "Diagram",
        points: [
          "Atmospheric nitrogen is fixed into nitrates by Rhizobium in root nodules, by lightning and by industrial processes.",
          "Plants absorb nitrates and build proteins, which pass to animals through food.",
          "Decomposers break down dead matter and excreta into ammonia, which nitrifying bacteria convert to nitrites and nitrates.",
          "Denitrifying bacteria return nitrogen to the atmosphere, completing the cycle.",
        ],
      },
      {
        q: "Differentiate between manure and fertiliser on three points.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Manure is a natural substance from decomposed plant and animal waste, a fertiliser is a manufactured chemical.",
          "Manure is rich in humus and improves soil texture, a fertiliser adds specific nutrients but not humus.",
          "Manure supplies nutrients in small quantity over a long period, a fertiliser supplies them in large quantity at once.",
        ],
      },
      {
        q: "What is mixed cropping and how does it differ from intercropping?",
        marks: 3,
        kind: "Short answer",
        points: [
          "Mixed cropping is growing two or more crops together on the same field at the same time, with seeds mixed before sowing.",
          "Intercropping grows two or more crops on the same field in a definite pattern of rows.",
          "Mixed cropping reduces the risk of total crop failure, while intercropping also allows separate harvesting and better use of nutrients.",
        ],
      },
      {
        q: "State three methods of preventing soil erosion.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Afforestation and the planting of shelter belts hold the soil with roots and break the force of wind.",
          "Contour ploughing and terrace farming on slopes slow the flow of rainwater.",
          "Crop rotation and the use of cover crops keep the soil covered instead of leaving it bare.",
        ],
      },
    ],
  },
  /* =================================================== Math Class 9 ==== */
  {
    id: "th:9:math:pythagoras",
    subject: "Math Class 9",
    chapter: "Pythagoras Theorem and the Mid-point Theorem",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "State the Pythagoras theorem and its converse.",
        marks: 2,
        kind: "Short answer",
        points: [
          "In a right angled triangle the square on the hypotenuse equals the sum of the squares on the other two sides.",
          "Conversely, if the square on one side of a triangle equals the sum of the squares on the other two sides, the angle opposite the first side is a right angle.",
        ],
      },
      {
        q: "Prove the mid-point theorem: the line joining the mid-points of two sides of a triangle is parallel to the third side and half of it.",
        marks: 4,
        kind: "Long answer",
        points: [
          "In triangle ABC let D and E be the mid-points of AB and AC. Produce DE to F so that DE = EF and join FC.",
          "In triangles ADE and CFE, AE = EC, DE = EF and the vertically opposite angles at E are equal, so the triangles are congruent by SAS.",
          "Hence AD = CF and angle ADE equals angle CFE, so AD is parallel to CF, that is DB is parallel to CF and DB = CF.",
          "DBCF is therefore a parallelogram, so DF is parallel to BC and DF = BC, giving DE parallel to BC and DE = half of BC.",
        ],
      },
      {
        q: "A ladder 13 metre long rests against a vertical wall with its foot 5 metre from the wall. Find the height reached on the wall.",
        marks: 2,
        kind: "Numerical",
        points: [
          "By the Pythagoras theorem, height squared = 13 squared minus 5 squared = 169 minus 25 = 144.",
          "Height = 12 metre.",
        ],
      },
      {
        q: "State the intercept theorem and one practical use of it.",
        marks: 2,
        kind: "Short answer",
        points: [
          "If three or more parallel lines make equal intercepts on one transversal, they make equal intercepts on every other transversal.",
          "It is used to divide a given line segment into any number of equal parts by construction.",
        ],
      },
    ],
  },
  {
    id: "th:9:math:polynomials",
    subject: "Math Class 9",
    chapter: "Polynomials and Linear Equations in Two Variables",
    classLevel: 9,
    boards: CBSE,
    questions: [
      {
        q: "State the remainder theorem and the factor theorem.",
        marks: 2,
        kind: "Short answer",
        points: [
          "If a polynomial p(x) is divided by x minus a, the remainder is p(a).",
          "x minus a is a factor of p(x) if and only if p(a) is zero.",
        ],
      },
      {
        q: "Factorise the polynomial x cubed minus 3 x squared minus 9 x minus 5.",
        marks: 3,
        kind: "Numerical",
        points: [
          "Try x = minus 1, when p(minus 1) = minus 1 minus 3 plus 9 minus 5 = 0, so x + 1 is a factor.",
          "Dividing gives x squared minus 4 x minus 5.",
          "This factorises as (x minus 5)(x plus 1), so the answer is (x plus 1) squared times (x minus 5).",
        ],
      },
      {
        q: "Write two solutions of the equation 2x + 3y = 12 and explain why a linear equation in two variables has infinitely many solutions.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Putting x = 0 gives y = 4, so (0, 4) is a solution.",
          "Putting y = 0 gives x = 6, so (6, 0) is a solution.",
          "Any value assigned to one variable gives a corresponding value of the other, and there are infinitely many such values.",
          "Geometrically the equation is a straight line, and every one of its infinitely many points is a solution.",
        ],
      },
      {
        q: "Expand (a + b + c) squared and use it to find the value of a squared + b squared + c squared when a + b + c = 9 and ab + bc + ca = 26.",
        marks: 3,
        kind: "Numerical",
        points: [
          "(a + b + c) squared = a squared + b squared + c squared + 2(ab + bc + ca).",
          "Substituting, 81 = a squared + b squared + c squared + 2 times 26 = a squared + b squared + c squared + 52.",
          "Hence a squared + b squared + c squared = 29.",
        ],
      },
    ],
  },
  /* =============================================== Physics Class 10 ==== */
  {
    id: "th:10:phy:spectrum-sound",
    subject: "Physics Class 10",
    chapter: "Spectrum and Sound",
    classLevel: 10,
    boards: ICSE,
    questions: [
      {
        q: "What is meant by the dispersion of white light? Draw a labelled diagram to show dispersion by a prism.",
        marks: 3,
        kind: "Diagram",
        points: [
          "Dispersion is the splitting of white light into its constituent colours on passing through a prism.",
          "It occurs because different colours have different wavelengths and are refracted through different angles.",
          "Draw a prism with a narrow beam of white light entering one face and emerging as a band from violet to red.",
          "Violet is deviated the most and red the least.",
        ],
      },
      {
        q: "Define resonance and describe an experiment to demonstrate it with tuning forks.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Resonance is the forced vibration of a body at its own natural frequency when set into vibration by another body of the same frequency.",
          "Mount two identical tuning forks of the same frequency on separate sound boxes with the open ends facing each other.",
          "Strike one fork and let it vibrate, then stop it with the hand after a few seconds.",
          "The second fork is found to be vibrating and sounding, which shows that energy has been transferred by resonance.",
        ],
      },
      {
        q: "Distinguish between an echo and reverberation, and state the condition for hearing a distinct echo.",
        marks: 3,
        kind: "Short answer",
        points: [
          "An echo is a distinct repetition of sound heard after reflection from a distant surface.",
          "Reverberation is the persistence of sound in a hall due to repeated reflections, the repetitions not being distinct.",
          "For a distinct echo the reflecting surface must be at least about 17 metre away, so the reflected sound reaches after one tenth of a second.",
        ],
      },
      {
        q: "State three characteristics of a musical sound and the physical quantity on which each depends.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Loudness depends on the amplitude of the vibration.",
          "Pitch depends on the frequency of the vibration.",
          "Quality or timbre depends on the number and relative intensity of the overtones present.",
        ],
      },
    ],
  },
  /* ============================================= Chemistry Class 10 ==== */
  {
    id: "th:10:chem:study-compounds",
    subject: "Chemistry Class 10",
    chapter: "Study of Compounds — Ammonia, Nitric Acid and Sulphuric Acid",
    classLevel: 10,
    boards: ICSE,
    questions: [
      {
        q: "Describe the preparation of ammonia in the laboratory with the equation, and state why it is not collected over water.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Ammonium chloride and slaked lime are heated together in a hard glass tube sloping downwards.",
          "The equation is 2 NH4Cl + Ca(OH)2 giving CaCl2 + 2 H2O + 2 NH3.",
          "The gas is dried over quicklime, not concentrated sulphuric acid, which would react with it.",
          "It is collected by downward displacement of air because it is highly soluble in water and lighter than air.",
        ],
      },
      {
        q: "Explain why concentrated sulphuric acid is used as a dehydrating agent, with two examples.",
        marks: 3,
        kind: "Reason based",
        points: [
          "It has a strong affinity for water and removes the elements of water from a compound.",
          "With sugar it removes hydrogen and oxygen leaving a black mass of carbon.",
          "With blue copper sulphate crystals it removes the water of crystallisation leaving the white anhydrous salt.",
        ],
      },
      {
        q: "State the conditions of the Ostwald process for the manufacture of nitric acid and write the equations.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Ammonia and air are passed over a platinum rhodium catalyst at about 800 degrees Celsius, giving 4 NH3 + 5 O2 forming 4 NO + 6 H2O.",
          "The nitric oxide is cooled and oxidised in air, 2 NO + O2 giving 2 NO2.",
          "Nitrogen dioxide is absorbed in water in the presence of air, 4 NO2 + 2 H2O + O2 giving 4 HNO3.",
          "The dilute acid obtained is concentrated by distillation with concentrated sulphuric acid.",
        ],
      },
      {
        q: "Why is nitric acid stored in dark coloured bottles?",
        marks: 2,
        kind: "Reason based",
        points: [
          "Nitric acid decomposes on exposure to light into nitrogen dioxide, oxygen and water.",
          "The dissolved nitrogen dioxide turns the acid yellow, so dark bottles prevent this decomposition.",
        ],
      },
    ],
  },
  {
    id: "th:10:chem:reactions-metals",
    subject: "Chemistry Class 10",
    chapter: "Chemical Reactions, Metals and Non-metals",
    classLevel: 10,
    boards: CBSE,
    questions: [
      {
        q: "Define oxidation and reduction in terms of oxygen, hydrogen and electrons, and identify the substance oxidised in the reaction CuO + H2 giving Cu + H2O.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Oxidation is the addition of oxygen or the removal of hydrogen, and in electronic terms the loss of electrons.",
          "Reduction is the removal of oxygen or the addition of hydrogen, and in electronic terms the gain of electrons.",
          "Hydrogen gains oxygen to form water, so hydrogen is oxidised and acts as the reducing agent.",
          "Copper oxide loses oxygen, so it is reduced and acts as the oxidising agent.",
        ],
      },
      {
        q: "What is a displacement reaction? Give one example with a balanced equation and explain it using the reactivity series.",
        marks: 3,
        kind: "Long answer",
        points: [
          "A displacement reaction is one in which a more reactive element displaces a less reactive element from its compound.",
          "Fe + CuSO4 gives FeSO4 + Cu, and the blue solution turns green while a reddish brown deposit forms on the iron.",
          "Iron lies above copper in the reactivity series, so it displaces copper from copper sulphate solution.",
        ],
      },
      {
        q: "Explain why ionic compounds have high melting points and conduct electricity in the molten state but not in the solid state.",
        marks: 3,
        kind: "Reason based",
        points: [
          "Ionic compounds have strong electrostatic forces between oppositely charged ions, so a large amount of energy is needed to break the lattice.",
          "In the solid state the ions are held in fixed positions in the lattice and cannot move.",
          "On melting the lattice breaks and the ions become free to move, so the molten compound conducts electricity.",
        ],
      },
      {
        q: "What is corrosion? State two methods of preventing the rusting of iron.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Corrosion is the gradual eating away of a metal by the action of air, moisture or chemicals on its surface.",
          "Rusting is prevented by painting, oiling or greasing, which keep out air and moisture.",
          "Galvanisation, in which iron is coated with a layer of zinc, gives lasting protection, as does alloying to make stainless steel.",
        ],
      },
    ],
  },
  /* =============================================== Biology Class 10 ==== */
  {
    id: "th:10:bio:endocrine-reproduction",
    subject: "Biology Class 10",
    chapter: "The Endocrine System and Reproduction",
    classLevel: 10,
    boards: ICSE,
    questions: [
      {
        q: "Name the hormone secreted by the thyroid, pancreas, adrenal medulla and pituitary, and state one function of each.",
        marks: 4,
        kind: "Short answer",
        points: [
          "The thyroid secretes thyroxine, which controls the rate of metabolism, growth and development.",
          "The pancreas secretes insulin, which lowers the level of glucose in the blood.",
          "The adrenal medulla secretes adrenaline, which prepares the body for emergency by raising heart rate and blood pressure.",
          "The pituitary secretes growth hormone, which controls the growth of bones and the body as a whole.",
        ],
      },
      {
        q: "Why is the pituitary called the master gland? Name two hormones through which it controls other glands.",
        marks: 3,
        kind: "Reason based",
        points: [
          "It secretes tropic hormones that control the secretion of several other endocrine glands.",
          "Thyroid stimulating hormone controls the thyroid gland.",
          "Adrenocorticotropic hormone controls the cortex of the adrenal gland.",
        ],
      },
      {
        q: "Describe the structure and function of the placenta.",
        marks: 3,
        kind: "Long answer",
        points: [
          "The placenta is a disc shaped structure attached to the uterine wall and connected to the foetus by the umbilical cord.",
          "It has villi on the foetal side that lie in blood spaces on the maternal side, giving a large surface for exchange.",
          "It supplies oxygen and nutrients to the foetus and removes carbon dioxide and nitrogenous waste.",
          "It also secretes hormones that maintain pregnancy and acts as a partial barrier to some harmful substances.",
        ],
      },
      {
        q: "Differentiate between the effects of hormones and of nerve impulses in coordination.",
        marks: 2,
        kind: "Short answer",
        points: [
          "Nerve impulses travel rapidly along neurons and produce a quick, short lived response in a specific organ.",
          "Hormones travel slowly in the blood and produce a slower but longer lasting response, often in several organs.",
        ],
      },
    ],
  },
  {
    id: "th:10:bio:control-environment",
    subject: "Biology Class 10",
    chapter: "Control and Coordination and Our Environment",
    classLevel: 10,
    boards: CBSE,
    questions: [
      {
        q: "Draw a labelled diagram of a neuron and explain how a nerve impulse travels along it.",
        marks: 4,
        kind: "Diagram",
        points: [
          "Label the dendrites, cell body, axon, myelin sheath and nerve endings.",
          "Information is picked up by the dendrites and sets off a chemical reaction that creates an electrical impulse.",
          "The impulse travels along the axon to its end, where it releases chemicals across the synapse.",
          "These chemicals start a similar impulse in the next neuron or cause the muscle to respond.",
        ],
      },
      {
        q: "What is a reflex arc? Explain with the example of withdrawing the hand from a hot object.",
        marks: 3,
        kind: "Long answer",
        points: [
          "A reflex arc is the path taken by a nerve impulse in an involuntary and very quick response to a stimulus.",
          "Receptors in the skin detect heat and send an impulse along a sensory neuron to the spinal cord.",
          "A relay neuron in the spinal cord passes the impulse straight to a motor neuron without waiting for the brain.",
          "The motor neuron makes the arm muscle contract and the hand is withdrawn at once.",
        ],
      },
      {
        q: "Explain why the number of trophic levels in a food chain is limited to four or five.",
        marks: 3,
        kind: "Reason based",
        points: [
          "Only about ten per cent of the energy at one trophic level is passed on to the next.",
          "The rest is lost as heat and in life processes such as respiration and movement.",
          "After four or five levels so little energy is left that it cannot support another level.",
        ],
      },
      {
        q: "Why should we conserve forests and wildlife? State the meaning of sustainable development.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Forests and wildlife maintain ecological balance, preserve biodiversity and protect soil and water.",
          "They also supply timber, medicine, fuel and the livelihood of forest dwelling communities.",
          "Sustainable development is development that meets the needs of the present without compromising the ability of future generations to meet their own needs.",
        ],
      },
    ],
  },
  /* ================================================== Math Class 10 ==== */
  {
    id: "th:10:math:quadratic-ap",
    subject: "Math Class 10",
    chapter: "Quadratic Equations and Arithmetic Progressions",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "Write the quadratic formula and state the condition on the discriminant for the roots to be real and equal, real and distinct, and not real.",
        marks: 3,
        kind: "Short answer",
        points: [
          "For a x squared + b x + c = 0 the roots are x = (minus b plus or minus the square root of (b squared minus 4 a c)) divided by 2 a.",
          "The roots are real and equal when b squared minus 4 a c is zero, and real and distinct when it is positive.",
          "The roots are not real when b squared minus 4 a c is negative.",
        ],
      },
      {
        q: "Derive the formula for the sum of the first n terms of an arithmetic progression.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Write S = a + (a + d) + ... + (l minus d) + l, and again in reverse order.",
          "Adding the two, each of the n pairs gives a + l, so 2 S = n (a + l).",
          "Hence S = n by 2 times (a + l), and putting l = a + (n minus 1) d gives S = n by 2 times (2 a + (n minus 1) d).",
        ],
      },
      {
        q: "Find the roots of the equation 2 x squared minus 5 x + 3 = 0 by factorisation.",
        marks: 2,
        kind: "Numerical",
        points: [
          "Split the middle term, 2 x squared minus 2 x minus 3 x + 3 = 0, giving 2x(x minus 1) minus 3(x minus 1) = 0.",
          "Hence (x minus 1)(2 x minus 3) = 0, so x = 1 or x = 3 by 2.",
        ],
      },
      {
        q: "How many two digit numbers are divisible by 3? Find their sum.",
        marks: 3,
        kind: "Numerical",
        points: [
          "The numbers form an arithmetic progression 12, 15, ..., 99 with a = 12, d = 3 and last term 99.",
          "From 99 = 12 + (n minus 1) times 3 we get n = 30.",
          "Sum = 30 by 2 times (12 + 99) = 15 times 111 = 1665.",
        ],
      },
    ],
  },
  {
    id: "th:10:math:triangles-circles",
    subject: "Math Class 10",
    chapter: "Similar Triangles and Circles",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "State the basic proportionality theorem and its converse.",
        marks: 2,
        kind: "Short answer",
        points: [
          "If a line is drawn parallel to one side of a triangle to intersect the other two sides, it divides them in the same ratio.",
          "Conversely, if a line divides two sides of a triangle in the same ratio, it is parallel to the third side.",
        ],
      },
      {
        q: "Prove that the lengths of the two tangents drawn from an external point to a circle are equal.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Let PA and PB be tangents from an external point P to a circle with centre O. Join OA, OB and OP.",
          "OA and OB are radii and each is perpendicular to the tangent at the point of contact, so the angles at A and B are right angles.",
          "In right triangles OAP and OBP, OA = OB as radii and OP is common, so the triangles are congruent by RHS.",
          "Hence PA = PB by corresponding parts of congruent triangles.",
        ],
      },
      {
        q: "State the criteria for the similarity of two triangles.",
        marks: 3,
        kind: "Short answer",
        points: [
          "AAA or AA, when the corresponding angles are equal.",
          "SSS, when the corresponding sides are in the same ratio.",
          "SAS, when one angle is equal and the sides including it are in the same ratio.",
        ],
      },
      {
        q: "The areas of two similar triangles are 81 square centimetre and 49 square centimetre. If the median of the first is 4.5 centimetre, find the median of the second.",
        marks: 3,
        kind: "Numerical",
        points: [
          "The ratio of the areas of similar triangles equals the square of the ratio of corresponding medians.",
          "So 81 by 49 = (4.5 by m) squared, giving 9 by 7 = 4.5 by m.",
          "Hence m = 4.5 times 7 divided by 9 = 3.5 centimetre.",
        ],
      },
    ],
  },
];
