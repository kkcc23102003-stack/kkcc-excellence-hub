/**
 * The ICSE Class 10 science chapters that the CISCE course structure lists
 * separately but the bank had folded into a neighbour, plus the last of the
 * Master Cadre DPE and Art and Craft syllabus.
 *
 * CISCE sets the mole concept, practical chemistry and organic hydrocarbons
 * as chapters in their own right, calorimetry apart from radioactivity, and
 * the prism and total internal reflection apart from lenses. Genetics,
 * transpiration and reflex action are likewise separate chapters in the
 * Biology paper.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const ICSE10 = ["ICSE Class 10", "ICSE Class 9-10"];
const MASTER = ["Punjab Master Cadre", "Punjab Lecturer Cadre", "State Teacher/TET"];

const templates: Template[] = [];
const chem = chapterFactory(templates, "Chemistry Class 10", ICSE10);
const phy = chapterFactory(templates, "Physics Class 10", ICSE10);
const bio = chapterFactory(templates, "Biology Class 10", ICSE10);
const pe = chapterFactory(templates, "Physical Education", MASTER);
const art = chapterFactory(templates, "Art and Craft", MASTER);

/* ============================================== ICSE Chemistry Class 10 */

chem(
  "ic10:mole-concept",
  "Mole Concept and Stoichiometry",
  "In the mole concept, what is %s?",
  "%k is %v.",
  [
    {
      key: "Mole",
      value: "The amount of substance containing 6.022 times ten to the power 23 particles",
    },
    { key: "Avogadro's number", value: "6.022 times ten to the power 23" },
    { key: "Molar volume of a gas at STP", value: "22.4 litres" },
    { key: "Gram molecular mass", value: "The molecular mass of a substance expressed in grams" },
    {
      key: "Avogadro's law",
      value:
        "Equal volumes of all gases under the same conditions contain an equal number of molecules",
    },
    { key: "Vapour density", value: "Half the relative molecular mass" },
    {
      key: "Empirical formula",
      value: "The formula showing the simplest whole number ratio of the atoms present",
    },
    {
      key: "Molecular formula",
      value: "The formula showing the actual number of atoms of each element in a molecule",
    },
    { key: "Mass of one mole of carbon dioxide", value: "44 grams" },
    { key: "Number of moles in 36 grams of water", value: "Two moles" },
  ],
  [
    {
      key: "Relation between molecular and empirical formula",
      value: "Molecular formula equals n times the empirical formula, where n is a whole number",
    },
    { key: "Volume of 0.5 mole of any gas at STP", value: "11.2 litres" },
    { key: "Percentage of nitrogen in ammonia", value: "About 82.35 per cent" },
    {
      key: "Gay Lussac's law of gaseous volumes",
      value:
        "Gases react in volumes that bear a simple whole number ratio to one another and to the product",
    },
    {
      key: "Limiting reagent",
      value: "The reactant that is completely consumed and so decides how much product forms",
    },
  ],
);

chem(
  "ic10:organic-hydrocarbons",
  "Organic Chemistry II — Hydrocarbons and Derivatives",
  "Among hydrocarbons and their derivatives, what is %s?",
  "%k is %v.",
  [
    { key: "Alkane", value: "A saturated hydrocarbon with the general formula CnH2n plus 2" },
    {
      key: "Alkene",
      value: "An unsaturated hydrocarbon with one double bond and the formula CnH2n",
    },
    {
      key: "Alkyne",
      value: "An unsaturated hydrocarbon with one triple bond and the formula CnH2n minus 2",
    },
    { key: "First member of the alkane series", value: "Methane" },
    { key: "First member of the alkene series", value: "Ethene" },
    { key: "First member of the alkyne series", value: "Ethyne, also called acetylene" },
    { key: "Functional group of an alcohol", value: "The hydroxyl group, minus OH" },
    { key: "Functional group of a carboxylic acid", value: "The carboxyl group, minus COOH" },
    { key: "Common name of ethanoic acid", value: "Acetic acid" },
    {
      key: "Homologous series",
      value: "A family of compounds with the same functional group whose members differ by CH2",
    },
  ],
  [
    {
      key: "Characteristic reaction of alkanes",
      value: "Substitution, for example the chlorination of methane in sunlight",
    },
    {
      key: "Characteristic reaction of alkenes and alkynes",
      value: "Addition, because of the multiple bond",
    },
    { key: "Laboratory preparation of ethyne", value: "Calcium carbide reacted with water" },
    {
      key: "Product of ethanol with concentrated sulphuric acid at 170 degrees",
      value: "Ethene, by dehydration",
    },
    {
      key: "Esterification",
      value:
        "An alcohol and a carboxylic acid heated with concentrated sulphuric acid give an ester and water",
    },
  ],
);

chem(
  "ic10:practical-chemistry",
  "Practical Chemistry and Salt Analysis",
  "In practical chemistry, what is %s?",
  "%k is %v.",
  [
    { key: "Colour of a copper salt in solution", value: "Blue" },
    { key: "Colour of an iron two salt in solution", value: "Pale green" },
    { key: "Colour of an iron three salt in solution", value: "Yellow or brown" },
    { key: "Gas that turns lime water milky", value: "Carbon dioxide" },
    { key: "Gas that turns moist red litmus blue", value: "Ammonia" },
    { key: "Gas with the smell of rotten eggs", value: "Hydrogen sulphide" },
    { key: "Gas that gives a pop sound with a burning splint", value: "Hydrogen" },
    {
      key: "Test for a sulphate ion",
      value:
        "A white precipitate with barium chloride that is insoluble in dilute hydrochloric acid",
    },
    {
      key: "Test for a chloride ion",
      value: "A white precipitate with silver nitrate that is soluble in ammonia",
    },
    { key: "Flame colour of a sodium salt", value: "Golden yellow" },
  ],
  [
    {
      key: "Precipitate of a zinc salt with sodium hydroxide",
      value: "A white gelatinous precipitate soluble in excess alkali",
    },
    {
      key: "Precipitate of a lead salt with sodium hydroxide",
      value: "A white precipitate soluble in excess alkali",
    },
    {
      key: "Precipitate of a copper salt with ammonium hydroxide",
      value: "A pale blue precipitate that dissolves in excess to give a deep blue solution",
    },
    {
      key: "Action of dilute hydrochloric acid on a carbonate",
      value: "Effervescence of carbon dioxide, which turns lime water milky",
    },
    {
      key: "Reason a sulphate test uses dilute hydrochloric acid first",
      value: "To remove carbonate and sulphite ions that would also give a white precipitate",
    },
  ],
);

/* ================================================= ICSE Physics Class 10 */

phy(
  "ip10:calorimetry",
  "Calorimetry and Specific Heat Capacity",
  "In calorimetry, what is %s?",
  "%k is %v.",
  [
    {
      key: "Heat capacity",
      value: "The heat needed to raise the temperature of a body by one kelvin",
    },
    {
      key: "Specific heat capacity",
      value:
        "The heat needed to raise the temperature of one kilogram of a substance by one kelvin",
    },
    { key: "SI unit of specific heat capacity", value: "Joule per kilogram per kelvin" },
    { key: "Specific heat capacity of water", value: "4200 joule per kilogram per kelvin" },
    {
      key: "Principle of calorimetry",
      value: "Heat lost by the hot body equals heat gained by the cold body",
    },
    {
      key: "Latent heat",
      value: "The heat absorbed or given out during a change of state at constant temperature",
    },
    { key: "Specific latent heat of fusion of ice", value: "336000 joule per kilogram" },
    { key: "Specific latent heat of vaporisation of steam", value: "2260000 joule per kilogram" },
    {
      key: "Formula for heat energy supplied",
      value: "Mass times specific heat capacity times rise in temperature",
    },
    {
      key: "Instrument used to measure heat exchange",
      value: "The calorimeter, usually made of copper",
    },
  ],
  [
    {
      key: "Reason a calorimeter is made of copper",
      value:
        "Copper has a low specific heat capacity and is a good conductor, so it reaches the common temperature quickly",
    },
    {
      key: "Reason water is used as a coolant in radiators",
      value:
        "Its specific heat capacity is high, so it absorbs much heat for a small rise in temperature",
    },
    {
      key: "Reason steam at 100 degrees scalds worse than water at 100 degrees",
      value: "Steam gives out its large latent heat of vaporisation in addition to its heat",
    },
    { key: "Effect of impurity on the melting point of ice", value: "It lowers the melting point" },
    {
      key: "Reason the temperature stays constant during melting",
      value:
        "The heat supplied is used to break the bonds of the solid, not to raise the kinetic energy",
    },
  ],
);

phy(
  "ip10:prism-tir",
  "Refraction Through a Prism and Total Internal Reflection",
  "In refraction through a prism, what is %s?",
  "%k is %v.",
  [
    {
      key: "Refraction",
      value: "The bending of light as it passes from one transparent medium into another",
    },
    {
      key: "Snell's law",
      value:
        "The ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant",
    },
    {
      key: "Angle of deviation of a prism",
      value: "The angle between the incident ray produced and the emergent ray",
    },
    {
      key: "Condition for minimum deviation",
      value:
        "The ray passes symmetrically, so the angle of incidence equals the angle of emergence",
    },
    {
      key: "Total internal reflection",
      value:
        "Complete reflection back into the denser medium when the angle of incidence exceeds the critical angle",
    },
    {
      key: "Critical angle",
      value:
        "The angle of incidence in the denser medium for which the angle of refraction is 90 degrees",
    },
    { key: "Critical angle for water", value: "About 48.75 degrees" },
    { key: "Critical angle for ordinary glass", value: "About 42 degrees" },
    {
      key: "Two conditions for total internal reflection",
      value: "Light must travel from a denser to a rarer medium and exceed the critical angle",
    },
    {
      key: "Refractive index in terms of the critical angle",
      value: "One divided by the sine of the critical angle",
    },
  ],
  [
    {
      key: "Working of an optical fibre",
      value: "Light is carried along the core by repeated total internal reflection",
    },
    {
      key: "Reason a diamond sparkles",
      value:
        "Its very small critical angle of about 24 degrees causes repeated total internal reflection",
    },
    {
      key: "Use of a right angled isosceles prism in a periscope",
      value:
        "It turns light through 90 degrees by total internal reflection with no loss of brightness",
    },
    {
      key: "Cause of a mirage",
      value: "Total internal reflection in layers of air of different density near a hot road",
    },
    {
      key: "Prism formula",
      value:
        "Refractive index equals sine of (A plus D minimum) by two divided by sine of A by two",
    },
  ],
);

/* ================================================= ICSE Biology Class 10 */

bio(
  "ib10:genetics",
  "Genetics — Mendel's Laws and Inheritance",
  "In genetics, what is %s?",
  "%k is %v.",
  [
    { key: "Father of genetics", value: "Gregor Johann Mendel" },
    { key: "Plant used by Mendel", value: "The garden pea, Pisum sativum" },
    {
      key: "Gene",
      value: "The unit of inheritance, a segment of DNA carrying information for a character",
    },
    { key: "Allele", value: "One of two or more alternative forms of a gene at the same locus" },
    { key: "Genotype", value: "The genetic constitution of an organism" },
    { key: "Phenotype", value: "The observable appearance of an organism" },
    { key: "Homozygous", value: "Having two identical alleles for a character" },
    { key: "Heterozygous", value: "Having two different alleles for a character" },
    { key: "Monohybrid phenotypic ratio in the F2 generation", value: "Three to one" },
    {
      key: "Dihybrid phenotypic ratio in the F2 generation",
      value: "Nine to three to three to one",
    },
  ],
  [
    {
      key: "Mendel's law of segregation",
      value:
        "The two alleles of a pair separate during gamete formation so each gamete gets only one",
    },
    {
      key: "Mendel's law of independent assortment",
      value: "Alleles of different characters are inherited independently of one another",
    },
    { key: "Monohybrid genotypic ratio in the F2 generation", value: "One to two to one" },
    {
      key: "Sex determination in human beings",
      value: "XX in the female and XY in the male, so the father's sperm decides the sex",
    },
    {
      key: "Reason Mendel chose the garden pea",
      value:
        "It has clear contrasting characters, a short life cycle, and is naturally self pollinating yet easy to cross",
    },
  ],
);

bio(
  "ib10:transpiration",
  "Transpiration and Ascent of Sap",
  "In transpiration, what is %s?",
  "%k is %v.",
  [
    { key: "Transpiration", value: "The loss of water as vapour from the aerial parts of a plant" },
    { key: "Chief site of transpiration", value: "The stomata of the leaves" },
    {
      key: "Stomatal transpiration",
      value: "Loss of water vapour through the stomata, about ninety per cent of the total",
    },
    {
      key: "Cuticular transpiration",
      value: "Loss of water vapour through the cuticle of the leaf",
    },
    {
      key: "Lenticular transpiration",
      value: "Loss of water vapour through the lenticels of woody stems",
    },
    { key: "Guard cells", value: "The two bean shaped cells that open and close a stoma" },
    {
      key: "Transpiration pull",
      value: "The suction force created in the xylem as water evaporates from the leaves",
    },
    { key: "Tissue that carries water upward", value: "The xylem" },
    { key: "Instrument used to measure the rate of transpiration", value: "The potometer" },
    {
      key: "Guttation",
      value: "The loss of water as liquid drops from the margins of leaves through hydathodes",
    },
  ],
  [
    {
      key: "Reason guard cells open the stoma",
      value:
        "They become turgid as potassium ions and water enter, and their unequal wall thickening makes them bow apart",
    },
    {
      key: "Cohesion tension theory",
      value:
        "Transpiration pull, helped by the cohesion and adhesion of water molecules, draws an unbroken column of water up the xylem",
    },
    {
      key: "Two benefits of transpiration",
      value: "It cools the plant and it creates the pull that lifts water and minerals",
    },
    {
      key: "Effect of high humidity on transpiration",
      value: "The rate falls, because the vapour gradient between leaf and air is reduced",
    },
    {
      key: "Difference between transpiration and guttation",
      value:
        "Transpiration releases water vapour through stomata in the day, guttation releases liquid water through hydathodes at night",
    },
  ],
);

bio(
  "ib10:reflex-brain",
  "Reflex Action and the Human Brain",
  "In the nervous system, what is %s?",
  "%k is %v.",
  [
    { key: "Neuron", value: "The structural and functional unit of the nervous system" },
    { key: "Synapse", value: "The junction between two neurons across which an impulse passes" },
    { key: "Reflex action", value: "A rapid, automatic and involuntary response to a stimulus" },
    {
      key: "Reflex arc",
      value: "The path an impulse takes from receptor to effector through the spinal cord",
    },
    { key: "Largest part of the human brain", value: "The cerebrum" },
    { key: "Part of the brain that controls balance and posture", value: "The cerebellum" },
    {
      key: "Part of the brain that controls heartbeat and breathing",
      value: "The medulla oblongata",
    },
    {
      key: "Coverings of the brain",
      value: "The meninges, namely duramater, arachnoid and piamater",
    },
    { key: "Fluid that protects the brain and spinal cord", value: "Cerebrospinal fluid" },
    { key: "Example of a conditioned reflex", value: "The mouth watering at the sight of food" },
  ],
  [
    {
      key: "Sequence of a reflex arc",
      value: "Receptor, sensory neuron, relay neuron in the spinal cord, motor neuron and effector",
    },
    {
      key: "Reason a reflex action does not wait for the brain",
      value: "The spinal cord completes the arc directly, which saves time in an emergency",
    },
    {
      key: "Difference between a natural and a conditioned reflex",
      value:
        "A natural reflex is inborn while a conditioned reflex is acquired by repeated experience",
    },
    {
      key: "Role of the hypothalamus",
      value:
        "It controls hunger, thirst, body temperature and links the nervous and endocrine systems",
    },
    {
      key: "Function of the corpus callosum",
      value: "It connects the two cerebral hemispheres and lets them exchange information",
    },
  ],
);

/* =========================================== Master Cadre — DPE, part 3 */

pe(
  "pe:rules-of-games",
  "Rules, Measurements and Officials of Major Games",
  "In the rules of major games, what is %s?",
  "%k is %v.",
  [
    { key: "Number of players in a cricket team", value: "Eleven" },
    { key: "Number of players on the court in a volleyball team", value: "Six" },
    { key: "Number of players in a kabaddi team on the mat", value: "Seven" },
    { key: "Number of players in a basketball team on the court", value: "Five" },
    { key: "Number of players in a hockey team", value: "Eleven" },
    { key: "Length of an Olympic swimming pool", value: "Fifty metres" },
    { key: "Length of a standard athletics track", value: "400 metres" },
    { key: "Height of the volleyball net for men", value: "2.43 metres" },
    { key: "Height of a basketball ring from the floor", value: "3.05 metres" },
    { key: "Duration of a football match", value: "Ninety minutes, in two halves of forty five" },
  ],
  [
    {
      key: "Number of officials in a volleyball match",
      value: "Two referees, a scorer and line judges",
    },
    { key: "Weight of the shot put for men in senior athletics", value: "7.26 kilograms" },
    { key: "Dimensions of a badminton court for doubles", value: "13.4 metres by 6.1 metres" },
    { key: "Duration of a kabaddi match for men", value: "Forty minutes, in two halves of twenty" },
    { key: "Number of lanes in a standard athletics track", value: "Eight" },
  ],
);

pe(
  "pe:awards-olympics",
  "Sports Awards, Olympics and Organisations",
  "In sports administration, what is %s?",
  "%k is %v.",
  [
    { key: "Highest sporting honour of India", value: "The Major Dhyan Chand Khel Ratna Award" },
    { key: "Award given to outstanding coaches in India", value: "The Dronacharya Award" },
    { key: "Award for lifetime achievement in sport in India", value: "The Dhyan Chand Award" },
    { key: "Award given to outstanding sportspersons every year", value: "The Arjuna Award" },
    {
      key: "National Sports Day of India",
      value: "The twenty ninth of August, the birthday of Major Dhyan Chand",
    },
    { key: "Founder of the modern Olympic Games", value: "Baron Pierre de Coubertin" },
    { key: "Year of the first modern Olympic Games", value: "1896, at Athens" },
    { key: "Olympic motto", value: "Citius, Altius, Fortius, meaning faster, higher, stronger" },
    { key: "Number of rings in the Olympic flag", value: "Five, representing the five continents" },
    {
      key: "Headquarters of the International Olympic Committee",
      value: "Lausanne, in Switzerland",
    },
  ],
  [
    {
      key: "Body that governs sport at the national level in India",
      value: "The Sports Authority of India, under the Ministry of Youth Affairs and Sports",
    },
    { key: "Interval between two Olympic Games", value: "Four years, called an Olympiad" },
    { key: "Games for athletes with a disability", value: "The Paralympic Games" },
    {
      key: "Purpose of the World Anti Doping Agency",
      value: "To frame and enforce a common anti doping code across sports and countries",
    },
    {
      key: "Fit India Movement",
      value: "A national campaign launched in 2019 to make physical activity a part of daily life",
    },
  ],
);

/* ==================================== Master Cadre — Art and Craft, 3 */

art(
  "art:colour-theory",
  "Colour Theory and Composition",
  "In colour theory, what is %s?",
  "%k is %v.",
  [
    {
      key: "Primary colours",
      value: "Red, blue and yellow, which cannot be made by mixing others",
    },
    { key: "Secondary colours", value: "Orange, green and violet, each made from two primaries" },
    {
      key: "Tertiary colour",
      value: "A colour made by mixing a primary with a neighbouring secondary",
    },
    {
      key: "Complementary colours",
      value: "Colours opposite each other on the colour wheel, such as red and green",
    },
    {
      key: "Warm colours",
      value: "Red, orange and yellow, which suggest heat and advance in a picture",
    },
    {
      key: "Cool colours",
      value: "Blue, green and violet, which suggest calm and recede in a picture",
    },
    { key: "Hue", value: "The name of a colour itself" },
    { key: "Tint", value: "A colour lightened by adding white" },
    { key: "Shade", value: "A colour darkened by adding black" },
    { key: "Monochromatic scheme", value: "A scheme using the tints and shades of a single hue" },
  ],
  [
    { key: "Neutral colours", value: "Black, white and grey, which have no hue of their own" },
    {
      key: "Effect of complementary colours placed side by side",
      value: "Each looks brighter and more intense by contrast",
    },
    {
      key: "Analogous colour scheme",
      value: "A scheme using colours that lie next to one another on the wheel",
    },
    {
      key: "Rule of thirds in composition",
      value:
        "Placing the centre of interest where the lines dividing the picture into thirds cross",
    },
    {
      key: "Balance in composition",
      value: "The even distribution of visual weight, which may be symmetrical or asymmetrical",
    },
  ],
);

art(
  "art:indian-art-history",
  "Indian Art History and Modern Movements",
  "In the history of Indian art, what is %s?",
  "%k is %v.",
  [
    { key: "Site of the Buddhist rock cut paintings of the Deccan", value: "The Ajanta caves" },
    {
      key: "Subject of the Ajanta paintings",
      value: "The life of the Buddha and the Jataka tales",
    },
    { key: "Technique used at Ajanta", value: "Tempera on a prepared mud plaster ground" },
    { key: "Sun temple famous for its chariot wheels", value: "The Konark temple in Odisha" },
    { key: "Emperor under whom Mughal painting reached its height", value: "Jahangir" },
    { key: "Mughal painter famous for animal studies", value: "Ustad Mansur" },
    { key: "Pahari school centre known for its delicate line", value: "Kangra" },
    {
      key: "Folk painting of Bihar done by women on walls and paper",
      value: "Madhubani, also called Mithila painting",
    },
    { key: "Folk painting of Maharashtra using simple white figures", value: "Warli painting" },
    { key: "Cloth scroll painting tradition of Odisha", value: "Pattachitra" },
  ],
  [
    { key: "Founder of the Bengal School of Art", value: "Abanindranath Tagore" },
    {
      key: "Aim of the Bengal School",
      value: "To revive an Indian idiom in place of academic Western realism",
    },
    { key: "Painter of Bharat Mata", value: "Abanindranath Tagore" },
    { key: "Painter known for her portrayals of rural Indian women", value: "Amrita Sher Gil" },
    {
      key: "Progressive Artists Group of Bombay",
      value:
        "A group formed in 1947 by Husain, Raza, Souza and others to seek a modern Indian idiom",
    },
  ],
);

art(
  "art:lettering-design",
  "Lettering, Poster and Layout Design",
  "In design and lettering, what is %s?",
  "%k is %v.",
  [
    { key: "Lettering", value: "The art of drawing letters by hand in a chosen style" },
    { key: "Typography", value: "The art of arranging type so that it is legible and pleasing" },
    { key: "Serif", value: "The small stroke finishing the end of a letter" },
    { key: "Sans serif", value: "A letter form without the finishing strokes" },
    {
      key: "Poster",
      value: "A large printed or painted sheet that carries a single clear message",
    },
    {
      key: "First requirement of a good poster",
      value: "It must be readable at a distance and in a glance",
    },
    { key: "Layout", value: "The planned arrangement of text and images in a given space" },
    { key: "Logo", value: "A distinctive symbol or lettering that identifies a brand or body" },
    { key: "Collage", value: "A composition made by pasting different materials on a surface" },
    { key: "Motif", value: "A single unit of design that is repeated to build a pattern" },
  ],
  [
    {
      key: "Reason a poster uses few words",
      value: "The viewer reads it in passing, so a short slogan carries further than a paragraph",
    },
    {
      key: "Role of contrast in poster design",
      value: "Strong tonal or colour contrast makes the message stand out from a distance",
    },
    {
      key: "Difference between a logo and an illustration",
      value:
        "A logo is a simplified mark meant for instant recognition and reproduction at any size",
    },
    {
      key: "Border in a design",
      value: "A repeated motif framing the composition and holding the eye within it",
    },
    {
      key: "White space in a layout",
      value: "The empty area that gives the design breathing room and directs attention",
    },
  ],
);

art(
  "art:sculpture-pottery",
  "Sculpture, Clay Modelling and Pottery",
  "In sculpture and pottery, what is %s?",
  "%k is %v.",
  [
    {
      key: "Sculpture",
      value: "A three dimensional work of art made by carving, modelling or casting",
    },
    { key: "Modelling", value: "Building up a form from a soft material such as clay or wax" },
    {
      key: "Carving",
      value: "Cutting away material from a block of stone or wood to reveal a form",
    },
    { key: "Casting", value: "Pouring a liquid material into a mould and letting it set" },
    { key: "Relief", value: "A sculpture that projects from a background it remains attached to" },
    {
      key: "High relief and low relief",
      value: "High relief projects strongly, low relief or bas relief only slightly",
    },
    { key: "Terracotta", value: "Baked clay, used for pottery and figures" },
    { key: "Kiln", value: "The oven in which clay articles are fired" },
    { key: "Potter's wheel", value: "The revolving disc on which a pot is thrown and shaped" },
    {
      key: "Glazing",
      value: "Coating fired pottery with a glassy layer for finish and water resistance",
    },
  ],
  [
    {
      key: "Lost wax process",
      value:
        "A wax model is coated in clay, the wax is melted out and metal is poured into the cavity",
    },
    {
      key: "Famous bronze tradition using the lost wax process",
      value: "The Chola bronzes of Tamil Nadu, such as the Nataraja",
    },
    {
      key: "Reason clay must be wedged before modelling",
      value: "Wedging removes air pockets that would burst the piece in the kiln",
    },
    {
      key: "Blue pottery of Jaipur",
      value: "A craft using a quartz based body with cobalt blue glaze, fired at a low temperature",
    },
    {
      key: "Difference between modelling and carving",
      value: "Modelling is additive and can be corrected, carving is subtractive and cannot",
    },
  ],
);

art(
  "art:indian-architecture",
  "Indian Architecture and Sculpture Traditions",
  "In Indian architecture, what is %s?",
  "%k is %v.",
  [
    { key: "Stupa", value: "A hemispherical Buddhist mound built over relics" },
    { key: "Most famous stupa of India", value: "The Great Stupa at Sanchi" },
    { key: "Torana", value: "The carved gateway of a stupa" },
    { key: "Chaitya", value: "A Buddhist prayer hall with a stupa at one end" },
    { key: "Vihara", value: "A Buddhist monastery with cells for monks" },
    { key: "Shikhara", value: "The rising tower over the sanctum of a north Indian temple" },
    { key: "Gopuram", value: "The tall ornamented gateway tower of a south Indian temple" },
    { key: "Nagara style", value: "The north Indian temple style with a curvilinear shikhara" },
    { key: "Dravida style", value: "The south Indian temple style with a pyramidal vimana" },
    { key: "Garbhagriha", value: "The innermost sanctum of a temple that houses the deity" },
  ],
  [
    {
      key: "Gandhara school of sculpture",
      value: "A school blending Greco Roman form with Buddhist subject, in grey schist",
    },
    {
      key: "Mathura school of sculpture",
      value: "An indigenous school in red sandstone with fuller, more robust figures",
    },
    {
      key: "Kailasa temple at Ellora",
      value: "A complete temple carved downward out of a single rock, in the Rashtrakuta period",
    },
    {
      key: "Indo Islamic feature introduced in Delhi Sultanate building",
      value: "The true arch and the dome built on squinches",
    },
    {
      key: "Chief material and feature of Mughal architecture at its height",
      value: "White marble with pietra dura inlay, as in the Taj Mahal",
    },
  ],
);

art(
  "art:appreciation-western",
  "Art Appreciation and World Art Movements",
  "In art appreciation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Art appreciation",
      value: "Understanding and judging a work of art by its form, content and context",
    },
    {
      key: "Renaissance",
      value:
        "The European revival of classical learning and naturalistic art from the fourteenth century",
    },
    { key: "Painter of the Mona Lisa", value: "Leonardo da Vinci" },
    { key: "Painter of the Sistine Chapel ceiling", value: "Michelangelo" },
    {
      key: "Impressionism",
      value: "A movement capturing the fleeting effect of light with broken brush strokes",
    },
    { key: "Painter of Sunflowers and The Starry Night", value: "Vincent van Gogh" },
    { key: "Founder of Cubism along with Braque", value: "Pablo Picasso" },
    {
      key: "Cubism",
      value: "A style showing an object from several viewpoints at once in geometric planes",
    },
    { key: "Surrealism", value: "A movement drawing images from dream and the unconscious mind" },
    {
      key: "Fresco",
      value: "Painting done on freshly laid wet plaster so the colour becomes part of the wall",
    },
  ],
  [
    {
      key: "Chiaroscuro",
      value: "The strong use of light and shade to model form and create drama",
    },
    {
      key: "Sfumato",
      value: "The soft, smoke like blending of tones with no hard outline, used by Leonardo",
    },
    {
      key: "Difference between fresco buono and fresco secco",
      value: "Buono is painted on wet plaster and is permanent, secco on dry plaster and may flake",
    },
    {
      key: "Picasso's Guernica",
      value: "A mural in black, white and grey protesting the bombing of a Basque town in 1937",
    },
    {
      key: "Value of studying art history for a teacher",
      value: "It gives a vocabulary and context with which to help children read and judge images",
    },
  ],
);

export const ICSE10_FULL_TEMPLATES = templates;
