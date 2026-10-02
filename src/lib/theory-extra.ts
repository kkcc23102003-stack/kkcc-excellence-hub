/**
 * Theory chapters that complete the ICSE and CBSE Class 9 and 10 syllabus.
 *
 * The two boards do not teach the same course, so chapters are tagged with the
 * board or boards they actually belong to. ICSE-only chapters such as
 * Calorimetry, Machines, Mole Concept and Metallurgy never appear in the CBSE
 * series, and CBSE-only chapters such as Gravitation, The Human Eye and
 * Heredity and Evolution never appear in the ICSE series.
 *
 * Written for KKCC. Nothing here is copied from a board paper or a publisher.
 */

import type { TheoryChapter } from "./theory-bank";

const BOTH: ("ICSE" | "CBSE")[] = ["ICSE", "CBSE"];
const ICSE: ("ICSE" | "CBSE")[] = ["ICSE"];
const CBSE: ("ICSE" | "CBSE")[] = ["CBSE"];

export const THEORY_EXTRA_CHAPTERS: TheoryChapter[] = [
  /* ================================================ Physics Class 9 ==== */
  {
    id: "th:9:phy:measurement",
    subject: "Physics Class 9",
    chapter: "Measurements and Experimentation",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "Define least count. Find the least count of a vernier callipers in which 10 vernier divisions coincide with 9 main scale divisions of 1 mm each.",
        marks: 3,
        kind: "Numerical",
        points: [
          "Least count is the smallest measurement an instrument can read reliably.",
          "Least count of a vernier = value of one main scale division divided by the number of vernier divisions.",
          "= 1 mm / 10 = 0.1 mm = 0.01 cm.",
        ],
      },
      {
        q: "State the three requirements of a good simple pendulum experiment and write the expression for its time period.",
        marks: 3,
        kind: "Short answer",
        points: [
          "The bob must be heavy and small, the thread light and inextensible, and the amplitude small.",
          "T = 2 pi times the square root of (l / g).",
          "The time period is independent of the mass of the bob and of the amplitude for small swings.",
        ],
      },
      {
        q: "Why is the second's pendulum 99.4 cm long, and what is its time period?",
        marks: 2,
        kind: "Reason based",
        points: [
          "A second's pendulum has a time period of exactly 2 seconds.",
          "Putting T = 2 s and g = 9.8 m/s squared in T = 2 pi root(l/g) gives l about 0.994 m.",
          "It therefore takes one second for each swing from one extreme to the other.",
        ],
      },
      {
        q: "Distinguish between fundamental and derived units, giving two examples of each.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Fundamental units are independent and cannot be derived from others, such as metre and kilogram.",
          "Derived units are built from fundamental units, such as newton and joule.",
          "The SI system has seven fundamental units.",
        ],
      },
    ],
  },
  {
    id: "th:9:phy:fluids",
    subject: "Physics Class 9",
    chapter: "Pressure in Fluids and Upthrust",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "State Archimedes' principle and use it to explain why an iron nail sinks but an iron ship floats.",
        marks: 4,
        kind: "Long answer",
        points: [
          "A body immersed in a fluid experiences an upthrust equal to the weight of the fluid displaced.",
          "The nail displaces a small volume, so the upthrust is less than its weight and it sinks.",
          "A ship is hollow, so it displaces a very large volume of water before it is fully submerged.",
          "The upthrust then equals its weight and the ship floats.",
        ],
      },
      {
        q: "Derive the expression P = h rho g for the pressure at a depth h in a liquid.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Consider a horizontal area A at depth h with a liquid column of volume A h above it.",
          "Mass of the column = A h rho, so its weight = A h rho g.",
          "Pressure = force / area = A h rho g / A = h rho g.",
        ],
      },
      {
        q: "State the law of flotation and explain why a ship rides higher in sea water than in river water.",
        marks: 3,
        kind: "Reason based",
        points: [
          "A floating body displaces a weight of fluid equal to its own weight.",
          "Sea water is denser than river water, so a smaller volume must be displaced for the same weight.",
          "Less of the hull is therefore submerged in sea water.",
        ],
      },
      {
        q: "State Pascal's law and give two of its applications.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Pressure applied to an enclosed fluid is transmitted equally in all directions.",
          "Application one: the hydraulic press and the hydraulic brake.",
          "Application two: the hydraulic jack and the hydraulic lift.",
        ],
      },
    ],
  },
  {
    id: "th:9:phy:gravitation",
    subject: "Physics Class 9",
    chapter: "Gravitation",
    classLevel: 9,
    boards: CBSE,
    questions: [
      {
        q: "State the universal law of gravitation and write its mathematical form, naming every symbol.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Every body attracts every other body with a force proportional to the product of their masses.",
          "The force is inversely proportional to the square of the distance between their centres.",
          "F = G m1 m2 / r squared, where G is the universal gravitational constant, 6.67 times ten to the power minus eleven.",
        ],
      },
      {
        q: "Distinguish between mass and weight with three points of difference.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Mass is the quantity of matter in a body; weight is the force with which the earth attracts it.",
          "Mass is a scalar measured in kilograms; weight is a vector measured in newtons.",
          "Mass is constant everywhere; weight changes with the value of g.",
        ],
      },
      {
        q: "Why does a body weigh less at the equator than at the poles?",
        marks: 2,
        kind: "Reason based",
        points: [
          "The earth bulges at the equator, so the equatorial radius is larger.",
          "Since g is inversely proportional to the square of the radius, g is smaller at the equator.",
          "Weight, being mg, is therefore less at the equator.",
        ],
      },
      {
        q: "A stone is thrown vertically upward with a velocity of 20 m/s. Find the maximum height reached and the time of flight. Take g = 10 m/s squared.",
        marks: 3,
        kind: "Numerical",
        points: [
          "At the highest point v = 0, so using v squared = u squared minus 2 g h, h = 400 / 20 = 20 m.",
          "Time to rise = u / g = 20 / 10 = 2 s.",
          "Total time of flight = 2 times 2 = 4 s.",
        ],
      },
    ],
  },
  {
    id: "th:9:phy:sound",
    subject: "Physics Class 9",
    chapter: "Sound",
    classLevel: 9,
    boards: BOTH,
    questions: [
      {
        q: "Explain why sound cannot travel through vacuum. Describe an experiment to show this.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Sound is a mechanical wave and needs a material medium to carry the vibration.",
          "An electric bell is suspended inside a bell jar connected to a vacuum pump.",
          "As the air is pumped out, the sound fades even though the hammer is still seen striking.",
          "When air is let back in, the sound returns.",
        ],
      },
      {
        q: "Define echo. Why must a reflecting surface be at least 17 m away for an echo to be heard?",
        marks: 3,
        kind: "Reason based",
        points: [
          "An echo is a sound heard again after reflection from a distant surface.",
          "The sensation of sound persists in the ear for about 0.1 s.",
          "In 0.1 s sound travels 34 m at 340 m/s, so the reflector must be at least half of that, 17 m, away.",
        ],
      },
      {
        q: "Distinguish between loudness, pitch and quality of a musical sound.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Loudness depends on amplitude; a larger amplitude gives a louder sound.",
          "Pitch depends on frequency; a higher frequency gives a shriller sound.",
          "Quality or timbre depends on the waveform and lets us tell two instruments apart.",
        ],
      },
      {
        q: "What is ultrasound? State two of its practical uses.",
        marks: 2,
        kind: "Short answer",
        points: [
          "Ultrasound is sound of frequency above 20 000 Hz, beyond human hearing.",
          "It is used in medical imaging such as sonography and in echocardiography.",
          "It is also used in SONAR to find the depth of the sea and to detect flaws in metal castings.",
        ],
      },
    ],
  },

  /* ============================================== Chemistry Class 9 ==== */
  {
    id: "th:9:chem:language",
    subject: "Chemistry Class 9",
    chapter: "The Language of Chemistry",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "Define valency and radical. Write the formula of aluminium sulphate and explain how you arrived at it.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Valency is the combining capacity of an element or radical.",
          "A radical is a charged group of atoms that behaves as a single unit in a reaction.",
          "Aluminium has valency three and the sulphate radical has valency two.",
          "Criss-crossing the valencies gives Al2(SO4)3.",
        ],
      },
      {
        q: "Balance the equation for the reaction of iron with steam and state why balancing is necessary.",
        marks: 3,
        kind: "Short answer",
        points: [
          "3Fe + 4H2O gives Fe3O4 + 4H2.",
          "Balancing is required by the law of conservation of mass.",
          "The number of atoms of each element must be the same on both sides.",
        ],
      },
      {
        q: "Give the difference between a molecular formula and an empirical formula with one example.",
        marks: 3,
        kind: "Short answer",
        points: [
          "The empirical formula gives the simplest whole number ratio of atoms.",
          "The molecular formula gives the actual number of atoms in one molecule.",
          "For benzene the empirical formula is CH and the molecular formula is C6H6.",
        ],
      },
    ],
  },
  {
    id: "th:9:chem:matter",
    subject: "Chemistry Class 9",
    chapter: "Matter in Our Surroundings",
    classLevel: 9,
    boards: CBSE,
    questions: [
      {
        q: "Explain the effect of temperature and pressure on the three states of matter using the kinetic theory.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Raising the temperature increases the kinetic energy of particles and weakens the force of attraction.",
          "A solid therefore melts to a liquid and a liquid boils to a gas.",
          "Increasing pressure pushes particles closer, so a gas can be liquefied.",
          "Cooling plus compression together liquefy a gas most easily.",
        ],
      },
      {
        q: "Why does evaporation cause cooling? Give two everyday examples.",
        marks: 3,
        kind: "Reason based",
        points: [
          "The faster particles escape from the surface, taking latent heat from the liquid left behind.",
          "The average energy of the remaining liquid falls, so its temperature drops.",
          "Water stays cool in an earthen pot and we feel cool when sweat evaporates.",
        ],
      },
      {
        q: "Define sublimation and latent heat of fusion. Give one substance that sublimes.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Sublimation is the direct change of a solid to a gas without becoming liquid.",
          "Latent heat of fusion is the heat needed to melt 1 kg of a solid at its melting point without a rise in temperature.",
          "Camphor, ammonium chloride, naphthalene and iodine sublime.",
        ],
      },
    ],
  },
  {
    id: "th:9:chem:water",
    subject: "Chemistry Class 9",
    chapter: "Water and Its Hardness",
    classLevel: 9,
    boards: ICSE,
    questions: [
      {
        q: "Distinguish between temporary and permanent hardness of water and give one method of removing each.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Temporary hardness is due to the bicarbonates of calcium and magnesium.",
          "It is removed by boiling or by Clark's process using slaked lime.",
          "Permanent hardness is due to the chlorides and sulphates of calcium and magnesium.",
          "It is removed by washing soda or by an ion exchange resin.",
        ],
      },
      {
        q: "Define water of crystallisation. Describe what happens when blue copper sulphate crystals are heated.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Water of crystallisation is the fixed number of water molecules chemically combined in one formula unit of a crystal.",
          "Blue CuSO4.5H2O loses its water on heating and turns white anhydrous copper sulphate.",
          "Adding water turns it blue again, so it is used to test for water.",
        ],
      },
      {
        q: "Why is hard water unsuitable for washing and for use in boilers?",
        marks: 3,
        kind: "Reason based",
        points: [
          "Hard water reacts with soap to form an insoluble scum, wasting soap.",
          "In boilers it deposits scale, which is a poor conductor of heat and wastes fuel.",
          "Scale can block pipes and may cause the boiler to burst.",
        ],
      },
    ],
  },

  /* ================================================ Biology Class 9 ==== */
  {
    id: "th:9:bio:tissues",
    subject: "Biology Class 9",
    chapter: "Tissues",
    classLevel: 9,
    boards: BOTH,
    questions: [
      {
        q: "Differentiate between meristematic and permanent tissue, and name the three kinds of meristem by position.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Meristematic tissue is made of thin walled dividing cells with dense cytoplasm and no vacuole.",
          "Permanent tissue is made of cells that have lost the power to divide and have taken a fixed shape.",
          "Apical meristem is at the tips of root and shoot and increases length.",
          "Intercalary meristem is at the base of leaves and lateral meristem increases girth.",
        ],
      },
      {
        q: "Draw and label a neuron, and state the function of each labelled part.",
        marks: 4,
        kind: "Diagram",
        points: [
          "Label the cell body, dendrites, axon, myelin sheath and nerve endings.",
          "Dendrites receive the impulse and carry it towards the cell body.",
          "The axon carries the impulse away from the cell body.",
          "The myelin sheath insulates the axon and speeds up conduction.",
        ],
      },
      {
        q: "Compare xylem and phloem in structure and function.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Xylem has tracheids, vessels, xylem parenchyma and fibres; phloem has sieve tubes, companion cells, phloem parenchyma and fibres.",
          "Xylem carries water and minerals upward only; phloem carries food in both directions.",
          "Xylem conduction is passive; phloem translocation uses energy.",
        ],
      },
    ],
  },
  {
    id: "th:9:bio:diversity",
    subject: "Biology Class 9",
    chapter: "Diversity in Living Organisms",
    classLevel: 9,
    boards: CBSE,
    questions: [
      {
        q: "State the basis of the five kingdom classification and name the five kingdoms with one example each.",
        marks: 4,
        kind: "Long answer",
        points: [
          "The basis is cell structure, body organisation, mode of nutrition and reproduction.",
          "Monera, such as bacteria, and Protista, such as Amoeba.",
          "Fungi, such as yeast, and Plantae, such as a mango tree.",
          "Animalia, such as a human being.",
        ],
      },
      {
        q: "Why are bryophytes called the amphibians of the plant kingdom?",
        marks: 2,
        kind: "Reason based",
        points: [
          "They grow on land but need water for the male gamete to reach the egg.",
          "They therefore live on land yet depend on water to reproduce, like amphibians.",
          "Moss and Marchantia are examples.",
        ],
      },
      {
        q: "Write three distinguishing features of Phylum Arthropoda and name two examples.",
        marks: 3,
        kind: "Short answer",
        points: [
          "The body is segmented with jointed appendages and a chitinous exoskeleton.",
          "They have an open circulatory system and a haemocoel.",
          "Prawn, cockroach, butterfly and spider are examples.",
        ],
      },
    ],
  },

  /* ================================================ Physics Class 10 === */
  {
    id: "th:10:phy:machines",
    subject: "Physics Class 10",
    chapter: "Machines and Work, Power, Energy",
    classLevel: 10,
    boards: ICSE,
    questions: [
      {
        q: "Define mechanical advantage, velocity ratio and efficiency, and derive the relation between them.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Mechanical advantage is the ratio of load to effort.",
          "Velocity ratio is the ratio of the distance moved by the effort to that moved by the load.",
          "Efficiency is the ratio of useful work output to work input.",
          "Efficiency = MA / VR, so for an ideal machine MA equals VR.",
        ],
      },
      {
        q: "Why is the efficiency of a machine always less than 100 per cent? State two ways to raise it.",
        marks: 3,
        kind: "Reason based",
        points: [
          "Part of the work input is spent against friction and in lifting the movable parts.",
          "Output is therefore always less than input.",
          "Efficiency is raised by lubricating the parts and by using lighter movable components.",
        ],
      },
      {
        q: "A pulley system has a velocity ratio of 5 and an efficiency of 80 per cent. Find the mechanical advantage and the effort needed to raise a load of 200 N.",
        marks: 3,
        kind: "Numerical",
        points: [
          "MA = efficiency times VR = 0.8 times 5 = 4.",
          "Effort = load / MA = 200 / 4 = 50 N.",
          "The work input is therefore greater than the useful work output.",
        ],
      },
    ],
  },
  {
    id: "th:10:phy:calorimetry",
    subject: "Physics Class 10",
    chapter: "Calorimetry",
    classLevel: 10,
    boards: ICSE,
    questions: [
      {
        q: "Define specific heat capacity and explain why water is used as a coolant in car radiators.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Specific heat capacity is the heat needed to raise the temperature of unit mass by one degree.",
          "Water has an unusually high specific heat capacity of 4200 J per kg per kelvin.",
          "It can therefore absorb a large amount of heat for a small rise in temperature.",
          "This makes it an efficient coolant in radiators and in industry.",
        ],
      },
      {
        q: "Define latent heat of fusion of ice and state its value. Why does ice at 0 degrees Celsius cool a drink better than water at 0 degrees Celsius?",
        marks: 3,
        kind: "Reason based",
        points: [
          "It is the heat needed to melt 1 kg of ice at 0 degrees Celsius without a change in temperature.",
          "Its value is 336 000 J per kg, or 336 J per gram.",
          "Ice absorbs this extra latent heat from the drink while melting, so it cools far more effectively.",
        ],
      },
      {
        q: "Calculate the heat energy required to convert 50 g of ice at 0 degrees Celsius into water at 30 degrees Celsius.",
        marks: 3,
        kind: "Numerical",
        points: [
          "Heat to melt the ice = 0.05 times 336 000 = 16 800 J.",
          "Heat to warm the water = 0.05 times 4200 times 30 = 6300 J.",
          "Total heat = 16 800 + 6300 = 23 100 J.",
        ],
      },
    ],
  },
  {
    id: "th:10:phy:eye",
    subject: "Physics Class 10",
    chapter: "The Human Eye and the Colourful World",
    classLevel: 10,
    boards: CBSE,
    questions: [
      {
        q: "Explain the defects of vision called myopia and hypermetropia, giving the cause and the correction for each.",
        marks: 4,
        kind: "Long answer",
        points: [
          "In myopia the image forms in front of the retina because the eyeball is too long or the lens too curved.",
          "It is corrected with a concave lens of suitable focal length.",
          "In hypermetropia the image forms behind the retina because the eyeball is too short or the lens too flat.",
          "It is corrected with a convex lens.",
        ],
      },
      {
        q: "What is the power of accommodation of the eye? State the near point and far point of a normal eye.",
        marks: 3,
        kind: "Short answer",
        points: [
          "It is the ability of the eye lens to change its focal length by the action of ciliary muscles.",
          "The near point of a normal eye is 25 cm.",
          "The far point is at infinity.",
        ],
      },
      {
        q: "Why does the sun appear reddish at sunrise and sunset?",
        marks: 3,
        kind: "Reason based",
        points: [
          "At sunrise and sunset the light travels a much longer path through the atmosphere.",
          "Most of the shorter blue wavelengths are scattered away by air molecules.",
          "Mainly the longer red wavelengths reach the eye, so the sun looks reddish.",
        ],
      },
    ],
  },
  {
    id: "th:10:phy:electromagnetism",
    subject: "Physics Class 10",
    chapter: "Magnetic Effects of Electric Current",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "State Fleming's left hand rule and Fleming's right hand rule, and name one device based on each.",
        marks: 4,
        kind: "Long answer",
        points: [
          "In the left hand rule the forefinger shows the field, the middle finger the current and the thumb the force.",
          "It gives the direction of force on a current carrying conductor, as in an electric motor.",
          "In the right hand rule the thumb shows motion, the forefinger the field and the middle finger the induced current.",
          "It gives the direction of induced current, as in an electric generator.",
        ],
      },
      {
        q: "Describe the construction and working of a simple electric motor with the role of the split ring commutator.",
        marks: 4,
        kind: "Long answer",
        points: [
          "A rectangular coil is placed between the poles of a permanent magnet and carries a current.",
          "The two sides of the coil carry current in opposite directions, so the forces on them are opposite and the coil rotates.",
          "After half a rotation the split ring commutator reverses the current in the coil.",
          "The direction of the torque is thus maintained and rotation continues.",
        ],
      },
      {
        q: "What is electromagnetic induction? State the two factors that increase the induced EMF.",
        marks: 3,
        kind: "Short answer",
        points: [
          "It is the production of an EMF in a coil when the magnetic flux linked with it changes.",
          "A faster relative motion between the coil and the magnet increases the induced EMF.",
          "More turns in the coil and a stronger magnet also increase it.",
        ],
      },
    ],
  },

  /* ============================================== Chemistry Class 10 === */
  {
    id: "th:10:chem:periodic",
    subject: "Chemistry Class 10",
    chapter: "Periodic Properties and Variations",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "Explain how atomic size, ionisation energy and metallic character vary across a period and down a group, giving the reason in each case.",
        marks: 5,
        kind: "Long answer",
        points: [
          "Across a period nuclear charge rises while the shell number stays the same, so atomic size decreases.",
          "Ionisation energy therefore increases across a period and metallic character decreases.",
          "Down a group a new shell is added each time, so atomic size increases.",
          "The outermost electron is farther and better shielded, so ionisation energy decreases.",
          "Metallic character therefore increases down a group.",
        ],
      },
      {
        q: "Define electronegativity and electron affinity, and state which is the most electronegative element.",
        marks: 3,
        kind: "Short answer",
        points: [
          "Electronegativity is the tendency of an atom in a bond to attract the shared pair of electrons.",
          "Electron affinity is the energy released when a neutral gaseous atom gains an electron.",
          "Fluorine is the most electronegative element.",
        ],
      },
      {
        q: "Why is the modern periodic law an improvement on Mendeleev's law?",
        marks: 3,
        kind: "Reason based",
        points: [
          "Mendeleev arranged elements by increasing atomic mass, which left anomalous pairs.",
          "The modern law arranges them by increasing atomic number, which is a fundamental property.",
          "This removed the anomalous pairs and gave isotopes a single place in the table.",
        ],
      },
    ],
  },
  {
    id: "th:10:chem:mole",
    subject: "Chemistry Class 10",
    chapter: "Mole Concept and Stoichiometry",
    classLevel: 10,
    boards: ICSE,
    questions: [
      {
        q: "State Avogadro's law and explain how it leads to the relation that one mole of any gas occupies 22.4 litres at STP.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Equal volumes of all gases at the same temperature and pressure contain equal numbers of molecules.",
          "One mole contains 6.022 times ten to the power twenty three molecules.",
          "Since the number of molecules fixes the volume, one mole of every gas occupies the same volume at STP.",
          "That volume, the gram molecular volume, is 22.4 litres.",
        ],
      },
      {
        q: "Calculate the volume of oxygen at STP needed to burn 12 g of carbon completely, and the mass of carbon dioxide formed.",
        marks: 4,
        kind: "Numerical",
        points: [
          "C + O2 gives CO2, so 12 g of carbon is exactly one mole.",
          "One mole of carbon needs one mole of oxygen, which is 22.4 litres at STP.",
          "One mole of carbon dioxide is formed.",
          "Its mass is 44 g.",
        ],
      },
      {
        q: "Define empirical formula and molecular formula, and state the relation between them.",
        marks: 3,
        kind: "Short answer",
        points: [
          "The empirical formula gives the simplest whole number ratio of the atoms present.",
          "The molecular formula gives the actual number of atoms in one molecule.",
          "Molecular formula = n times the empirical formula, where n = molecular mass divided by empirical formula mass.",
        ],
      },
    ],
  },
  {
    id: "th:10:chem:metallurgy",
    subject: "Chemistry Class 10",
    chapter: "Metallurgy",
    classLevel: 10,
    boards: ICSE,
    questions: [
      {
        q: "Describe the extraction of aluminium from alumina by the Hall Heroult process, including the role of cryolite.",
        marks: 5,
        kind: "Long answer",
        points: [
          "Purified alumina is dissolved in molten cryolite with a little fluorspar in an iron tank lined with graphite.",
          "Cryolite lowers the fusion temperature from about 2050 to about 950 degrees Celsius and increases conductivity.",
          "The graphite lining acts as the cathode and graphite rods act as the anode.",
          "Aluminium is deposited at the cathode and oxygen is liberated at the anode.",
          "The oxygen burns the anode away, so the anodes must be replaced periodically.",
        ],
      },
      {
        q: "Define the terms ore, gangue and flux, and state the difference between calcination and roasting.",
        marks: 4,
        kind: "Short answer",
        points: [
          "An ore is a mineral from which a metal can be extracted profitably; gangue is the earthy impurity with it.",
          "A flux is a substance added to remove the gangue as a fusible slag.",
          "Calcination is heating the ore strongly in a limited supply of air to drive off moisture and carbon dioxide.",
          "Roasting is heating the ore strongly in excess air, used chiefly for sulphide ores.",
        ],
      },
      {
        q: "Why is aluminium not extracted by reduction with carbon?",
        marks: 2,
        kind: "Reason based",
        points: [
          "Aluminium is a highly reactive metal with a very strong affinity for oxygen.",
          "Carbon cannot reduce its oxide at a practical temperature and would form aluminium carbide.",
          "Electrolytic reduction of the molten oxide is used instead.",
        ],
      },
    ],
  },
  {
    id: "th:10:chem:carbon",
    subject: "Chemistry Class 10",
    chapter: "Carbon and Its Compounds",
    classLevel: 10,
    boards: CBSE,
    questions: [
      {
        q: "Explain catenation and tetravalency, and state why carbon forms a very large number of compounds.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Catenation is the ability of carbon atoms to link with one another to form long chains and rings.",
          "Tetravalency means each carbon atom can form four strong covalent bonds.",
          "Carbon to carbon bonds are strong because of the small size of the atom.",
          "Together these allow chains, branches, rings and multiple bonds, giving millions of compounds.",
        ],
      },
      {
        q: "What are homologous series? State three characteristics using the alkane series as an example.",
        marks: 3,
        kind: "Short answer",
        points: [
          "A homologous series is a family of compounds with the same functional group and general formula.",
          "Successive members differ by a CH2 unit and by 14 units of molecular mass.",
          "They show a gradual change in physical properties and similar chemical properties.",
        ],
      },
      {
        q: "Describe the preparation and two properties of ethanol, and explain what denatured alcohol is.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Ethanol is obtained industrially by the fermentation of sugar in the presence of yeast.",
          "It reacts with sodium to give sodium ethoxide and hydrogen.",
          "Heated with concentrated sulphuric acid at 443 K it dehydrates to ethene.",
          "Denatured alcohol is ethanol made unfit to drink by adding methanol and a dye.",
        ],
      },
    ],
  },

  /* ================================================ Biology Class 10 === */
  {
    id: "th:10:bio:excretory",
    subject: "Biology Class 10",
    chapter: "Excretory and Nervous System",
    classLevel: 10,
    boards: ICSE,
    questions: [
      {
        q: "Draw a labelled diagram of a nephron and describe the three steps of urine formation.",
        marks: 5,
        kind: "Diagram",
        points: [
          "Label the Bowman's capsule, glomerulus, proximal tubule, loop of Henle, distal tubule and collecting duct.",
          "Ultrafiltration occurs in the glomerulus under high blood pressure, forming the glomerular filtrate.",
          "Selective reabsorption in the tubules returns glucose, amino acids, most water and salts to the blood.",
          "Tubular secretion adds extra potassium ions, hydrogen ions and drugs to the filtrate.",
          "The fluid remaining is urine, which passes to the collecting duct.",
        ],
      },
      {
        q: "Describe a reflex arc with an example, naming every component in order.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Receptor in the skin detects the stimulus, such as a pin prick.",
          "The sensory neuron carries the impulse to the spinal cord.",
          "A relay neuron in the spinal cord passes it to the motor neuron.",
          "The motor neuron carries it to the effector muscle, which withdraws the hand.",
        ],
      },
      {
        q: "Differentiate between the cerebrum, the cerebellum and the medulla oblongata in function.",
        marks: 3,
        kind: "Short answer",
        points: [
          "The cerebrum is the seat of intelligence, memory, will and voluntary action.",
          "The cerebellum maintains balance and coordinates muscular activity.",
          "The medulla oblongata controls involuntary actions such as heartbeat, breathing and swallowing.",
        ],
      },
    ],
  },
  {
    id: "th:10:bio:photosynthesis",
    subject: "Biology Class 10",
    chapter: "Photosynthesis and Transpiration",
    classLevel: 10,
    boards: ICSE,
    questions: [
      {
        q: "Describe an experiment to prove that carbon dioxide is necessary for photosynthesis.",
        marks: 5,
        kind: "Long answer",
        points: [
          "Destarch a potted plant by keeping it in the dark for two days.",
          "Enclose one leaf in a flask containing potassium hydroxide, which absorbs carbon dioxide.",
          "Keep the plant in sunlight for a few hours.",
          "Test both the enclosed leaf and a normal leaf with iodine after removing chlorophyll.",
          "Only the normal leaf turns blue black, proving carbon dioxide is essential.",
        ],
      },
      {
        q: "State the significance of transpiration and name three factors that affect its rate.",
        marks: 4,
        kind: "Short answer",
        points: [
          "It creates the transpiration pull that lifts water and minerals up the xylem.",
          "It cools the plant by evaporation and keeps cells turgid.",
          "The rate rises with temperature, wind speed and light intensity.",
          "It falls when the humidity of the surrounding air is high.",
        ],
      },
      {
        q: "Explain the opening and closing of stomata in terms of the turgidity of guard cells.",
        marks: 3,
        kind: "Reason based",
        points: [
          "In light the guard cells make sugar, absorb water by osmosis and become turgid.",
          "Their thin outer wall bulges outward while the thick inner wall is pulled apart, so the stoma opens.",
          "In darkness the guard cells lose water, become flaccid and the stoma closes.",
        ],
      },
    ],
  },
  {
    id: "th:10:bio:life-processes",
    subject: "Biology Class 10",
    chapter: "Life Processes",
    classLevel: 10,
    boards: CBSE,
    questions: [
      {
        q: "Describe the process of nutrition in Amoeba with the help of a labelled diagram.",
        marks: 5,
        kind: "Diagram",
        points: [
          "Amoeba shows holozoic nutrition and feeds on any point of its surface.",
          "Ingestion: pseudopodia surround the food particle and form a food vacuole.",
          "Digestion: enzymes secreted into the vacuole break the food down.",
          "Absorption and assimilation: digested food diffuses into the cytoplasm and is used for energy and growth.",
          "Egestion: the undigested residue is thrown out as the cell moves forward.",
        ],
      },
      {
        q: "Why is the human heart called a double circulation pump? Explain its advantage.",
        marks: 4,
        kind: "Reason based",
        points: [
          "Blood passes through the heart twice in one complete circuit of the body.",
          "The pulmonary circulation carries blood between the heart and the lungs.",
          "The systemic circulation carries blood between the heart and the rest of the body.",
          "Oxygenated and deoxygenated blood stay separate, giving an efficient oxygen supply needed by warm blooded animals.",
        ],
      },
      {
        q: "Differentiate between aerobic and anaerobic respiration, giving the products of each in muscle cells and in yeast.",
        marks: 4,
        kind: "Short answer",
        points: [
          "Aerobic respiration occurs in the presence of oxygen and gives carbon dioxide, water and a large amount of energy.",
          "Anaerobic respiration occurs without oxygen and gives much less energy.",
          "In muscle cells it gives lactic acid, which causes cramps.",
          "In yeast it gives ethanol and carbon dioxide.",
        ],
      },
    ],
  },
  {
    id: "th:10:bio:heredity",
    subject: "Biology Class 10",
    chapter: "Heredity and Evolution",
    classLevel: 10,
    boards: CBSE,
    questions: [
      {
        q: "State Mendel's law of segregation and illustrate it with a monohybrid cross up to the F2 generation.",
        marks: 5,
        kind: "Long answer",
        points: [
          "Two alleles of a pair separate during gamete formation so that each gamete receives only one.",
          "A cross between tall TT and dwarf tt gives all Tt tall plants in F1.",
          "Selfing F1 gives TT, Tt, Tt and tt in the F2 generation.",
          "The phenotypic ratio is 3 tall to 1 dwarf.",
          "The genotypic ratio is 1 to 2 to 1.",
        ],
      },
      {
        q: "Distinguish between homologous and analogous organs with one example of each, and state what each shows about evolution.",
        marks: 4,
        kind: "Short answer",
        points: [
          "Homologous organs have the same basic structure but different functions, such as the forelimbs of a human and a bat.",
          "They indicate a common ancestor and divergent evolution.",
          "Analogous organs have different structures but the same function, such as the wings of a bird and an insect.",
          "They indicate convergent evolution and not common ancestry.",
        ],
      },
      {
        q: "How is the sex of a child determined in human beings? Explain why the father is responsible.",
        marks: 3,
        kind: "Reason based",
        points: [
          "A mother is XX and produces only X bearing eggs.",
          "A father is XY and produces both X bearing and Y bearing sperm.",
          "An X sperm gives a girl and a Y sperm gives a boy, so the father decides the sex of the child.",
        ],
      },
    ],
  },

  /* ================================================== Maths Class 10 === */
  {
    id: "th:10:math:trigonometry",
    subject: "Math Class 10",
    chapter: "Heights and Distances",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "The angle of elevation of the top of a tower from a point on level ground 30 m from its foot is 60 degrees. Find the height of the tower.",
        marks: 3,
        kind: "Numerical",
        points: [
          "Let the height be h. Then tan 60 = h / 30.",
          "tan 60 equals root 3, so h = 30 root 3.",
          "The height is about 51.96 m.",
        ],
      },
      {
        q: "From the top of a 60 m high building, the angles of depression of the top and bottom of a pole are 30 and 60 degrees. Find the height of the pole.",
        marks: 4,
        kind: "Numerical",
        points: [
          "Let the horizontal distance be d. From the bottom, tan 60 = 60 / d, so d = 60 / root 3 = 20 root 3.",
          "From the top of the pole, tan 30 = (60 minus h) / d.",
          "So 60 minus h = 20 root 3 divided by root 3 = 20.",
          "The height of the pole is 40 m.",
        ],
      },
      {
        q: "Prove the identity: (1 + cot A minus cosec A)(1 + tan A + sec A) = 2.",
        marks: 4,
        kind: "Long answer",
        points: [
          "Write everything in terms of sin A and cos A over a common denominator.",
          "The first bracket becomes (sin A + cos A minus 1) / sin A.",
          "The second becomes (cos A + sin A + 1) / cos A.",
          "Multiplying and using sin squared + cos squared = 1 gives 2 sin A cos A / (sin A cos A) = 2.",
        ],
      },
    ],
  },
  {
    id: "th:10:math:mensuration",
    subject: "Math Class 10",
    chapter: "Surface Areas and Volumes",
    classLevel: 10,
    boards: BOTH,
    questions: [
      {
        q: "A solid is in the form of a cone mounted on a hemisphere of the same radius 7 cm. The total height is 21 cm. Find the volume of the solid.",
        marks: 4,
        kind: "Numerical",
        points: [
          "Height of the cone = 21 minus 7 = 14 cm.",
          "Volume of the cone = one third times 22/7 times 49 times 14 = 718.67 cubic cm.",
          "Volume of the hemisphere = two thirds times 22/7 times 343 = 718.67 cubic cm.",
          "Total volume is about 1437.33 cubic cm.",
        ],
      },
      {
        q: "A metallic sphere of radius 6 cm is melted and drawn into a wire of radius 0.2 cm. Find the length of the wire.",
        marks: 3,
        kind: "Numerical",
        points: [
          "Volume of the sphere = four thirds pi times 216 = 288 pi cubic cm.",
          "Volume of the wire = pi times 0.04 times l.",
          "Equating, l = 288 / 0.04 = 7200 cm, that is 72 m.",
        ],
      },
      {
        q: "Derive the formula for the curved surface area of a cone of radius r and slant height l.",
        marks: 3,
        kind: "Long answer",
        points: [
          "Open out the curved surface to get a sector of a circle of radius l.",
          "The arc length of the sector equals the circumference of the base, 2 pi r.",
          "Area of the sector = half times arc length times radius = half times 2 pi r times l = pi r l.",
        ],
      },
    ],
  },
];
