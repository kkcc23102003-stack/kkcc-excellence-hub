/**
 * The rest of the General Science, CSAT, Business Economics and Cost
 * Accounting syllabus.
 *
 * These four subjects each carried only seven chapters. General Science and
 * CSAT feed the SSC, railway, banking, defence and civil services series,
 * and the other two the CA, CS and CMA series.
 */

import { type Template } from "./core";
import { CIVIL_DEFENCE, GK_WIDE, SSC_RRB, chapterFactory } from "./two-layer";

const SCI = [...new Set([...GK_WIDE, ...SSC_RRB, ...CIVIL_DEFENCE])];
const CSAT_EXAMS = ["UPSC CSE", "State PSC", "PPSC Punjab", "Punjab PCS", "CAPF"];
const FOUND = ["CA Foundation", "CS Foundation", "CMA Foundation", "CBSE Class 11-12 Commerce"];
const INTER = ["CA Intermediate", "CS Executive", "CMA Intermediate"];

const templates: Template[] = [];
const sci = chapterFactory(templates, "General Science", SCI);
const csat = chapterFactory(templates, "CSAT", CSAT_EXAMS);
const eco = chapterFactory(templates, "Business Economics", FOUND);
const cost = chapterFactory(templates, "Cost Accounting", INTER);

/* ======================================================= General Science */

sci(
  "gsc:units-measurement",
  "Units, Measurement and Scientific Instruments",
  "In measurement and instruments, what is %s?",
  "%k is %v.",
  [
    { key: "SI unit of force", value: "The newton" },
    { key: "SI unit of pressure", value: "The pascal" },
    { key: "SI unit of energy and work", value: "The joule" },
    { key: "SI unit of power", value: "The watt" },
    { key: "SI unit of electric charge", value: "The coulomb" },
    { key: "Instrument that measures atmospheric pressure", value: "The barometer" },
    { key: "Instrument that measures the intensity of an earthquake", value: "The seismograph" },
    { key: "Instrument that measures humidity", value: "The hygrometer" },
    { key: "Instrument that measures the speed of a vehicle", value: "The speedometer" },
    { key: "Instrument used to view distant objects", value: "The telescope" },
  ],
  [
    {
      key: "Seven base units of the SI system",
      value: "Metre, kilogram, second, ampere, kelvin, mole and candela",
    },
    { key: "Instrument that measures the purity of milk", value: "The lactometer" },
    { key: "Instrument that measures blood pressure", value: "The sphygmomanometer" },
    {
      key: "Light year",
      value: "The distance travelled by light in one year, a unit of distance and not of time",
    },
    {
      key: "Reason a sudden fall in the barometer reading signals a storm",
      value:
        "It shows a rapid drop in atmospheric pressure, which draws in air and brings cyclonic weather",
    },
  ],
);

sci(
  "gsc:light-sound",
  "Light, Sound and Wave Phenomena",
  "In the study of light and sound, what is %s?",
  "%k is %v.",
  [
    { key: "Speed of light in vacuum", value: "About three lakh kilometre per second" },
    { key: "Speed of sound in air at room temperature", value: "About 343 metre per second" },
    {
      key: "Phenomenon that causes a rainbow",
      value: "Dispersion, refraction and total internal reflection of sunlight in water droplets",
    },
    {
      key: "Reason the sky appears blue",
      value: "Scattering of sunlight by air molecules, which scatter blue light most",
    },
    { key: "Mirror used in a vehicle headlight", value: "A concave mirror" },
    { key: "Lens used to correct short sight", value: "A concave lens" },
    { key: "Lens used to correct long sight", value: "A convex lens" },
    { key: "Defect corrected by a cylindrical lens", value: "Astigmatism" },
    {
      key: "Range of audible frequency for human beings",
      value: "Twenty hertz to twenty thousand hertz",
    },
    { key: "Sound above the audible range", value: "Ultrasound" },
  ],
  [
    {
      key: "Reason the sun appears red at sunrise and sunset",
      value:
        "The light travels a longer path through the atmosphere, so blue is scattered away and red reaches the eye",
    },
    {
      key: "Total internal reflection",
      value:
        "The complete reflection of light back into a denser medium when the angle of incidence exceeds the critical angle",
    },
    {
      key: "Application of total internal reflection",
      value: "Optical fibres, which carry light and data over long distances with little loss",
    },
    {
      key: "Doppler effect",
      value:
        "The apparent change in frequency when the source and the observer move relative to each other",
    },
    {
      key: "Reason sound travels faster in water than in air",
      value:
        "Water is denser and far less compressible, so its molecules transfer the vibration more readily",
    },
  ],
);

sci(
  "gsc:chemistry-daily",
  "Acids, Bases, Metals and Chemistry in Daily Life",
  "In everyday chemistry, what is %s?",
  "%k is %v.",
  [
    { key: "Chemical name of common salt", value: "Sodium chloride" },
    { key: "Chemical name of baking soda", value: "Sodium bicarbonate" },
    { key: "Chemical name of washing soda", value: "Sodium carbonate decahydrate" },
    { key: "Chemical name of bleaching powder", value: "Calcium oxychloride" },
    { key: "Chemical name of plaster of Paris", value: "Calcium sulphate hemihydrate" },
    { key: "Chemical name of quicklime", value: "Calcium oxide" },
    { key: "pH of a neutral solution", value: "Seven" },
    { key: "Acid present in the stomach", value: "Hydrochloric acid" },
    { key: "Acid present in lemon", value: "Citric acid" },
    { key: "Acid present in curd", value: "Lactic acid" },
  ],
  [
    {
      key: "Reason baking soda is used in cooking",
      value:
        "On heating it releases carbon dioxide, which makes the dough rise and the product soft and porous",
    },
    {
      key: "Gas used in fire extinguishers",
      value: "Carbon dioxide, which is heavier than air and cuts off the supply of oxygen",
    },
    {
      key: "Reason iron rusts but aluminium does not corrode away",
      value:
        "Aluminium forms a thin, tough oxide layer that protects the metal, while rust is flaky and exposes fresh iron",
    },
    {
      key: "Chemical used to purify drinking water",
      value: "Chlorine or bleaching powder, which kills the bacteria",
    },
    { key: "Alloy of copper and zinc", value: "Brass, while bronze is an alloy of copper and tin" },
  ],
);

sci(
  "gsc:plant-biology",
  "Plant Life, Agriculture and Crop Science",
  "In plant science, what is %s?",
  "%k is %v.",
  [
    { key: "Process by which plants make food", value: "Photosynthesis" },
    { key: "Green pigment used in photosynthesis", value: "Chlorophyll" },
    { key: "Gas taken in by plants in photosynthesis", value: "Carbon dioxide" },
    { key: "Loss of water from the leaves of a plant", value: "Transpiration" },
    { key: "Tissue that carries water in a plant", value: "The xylem" },
    { key: "Tissue that carries food in a plant", value: "The phloem" },
    { key: "Hormone that promotes the growth of stems", value: "Auxin" },
    { key: "Hormone that causes the ripening of fruit", value: "Ethylene" },
    { key: "Bacterium that fixes nitrogen in the root nodules of legumes", value: "Rhizobium" },
    { key: "Nutrient that makes leaves green and healthy", value: "Nitrogen" },
  ],
  [
    {
      key: "Difference between C3 and C4 plants",
      value:
        "C4 plants such as maize and sugarcane fix carbon dioxide more efficiently at high temperature and lose less water",
    },
    {
      key: "Reason leaves fall in autumn in temperate regions",
      value:
        "It reduces transpiration when water uptake is difficult in the cold, and is triggered by abscisic acid",
    },
    { key: "Hydroponics", value: "Growing plants in a nutrient solution without soil" },
    {
      key: "Vermicompost",
      value: "Compost prepared by earthworms from organic waste, which enriches the soil naturally",
    },
    {
      key: "Reason legumes are used in crop rotation",
      value:
        "Their root nodules fix atmospheric nitrogen, which restores the fertility of the soil for the next crop",
    },
  ],
);

sci(
  "gsc:disease-immunity",
  "Diseases, Immunity and Public Health",
  "In health science, what is %s?",
  "%k is %v.",
  [
    { key: "Disease caused by a deficiency of insulin", value: "Diabetes mellitus" },
    { key: "Disease caused by a deficiency of iodine", value: "Goitre" },
    { key: "Vector of dengue and chikungunya", value: "The Aedes mosquito" },
    { key: "Vector of malaria", value: "The female Anopheles mosquito" },
    { key: "Organism that causes tuberculosis", value: "The bacterium Mycobacterium tuberculosis" },
    { key: "Organ affected by hepatitis", value: "The liver" },
    { key: "Universal donor blood group", value: "O negative" },
    { key: "Universal recipient blood group", value: "AB positive" },
    { key: "Scientist who discovered the vaccine for smallpox", value: "Edward Jenner" },
    { key: "Scientist who discovered penicillin", value: "Alexander Fleming" },
  ],
  [
    {
      key: "Difference between a communicable and a non-communicable disease",
      value:
        "A communicable disease spreads from one person to another through a pathogen, a non-communicable one does not",
    },
    {
      key: "Active and passive immunity",
      value:
        "Active immunity is produced by the body's own response to infection or vaccine, passive by ready-made antibodies received from outside",
    },
    {
      key: "Reason antibiotic resistance is a public health problem",
      value:
        "Overuse and incomplete courses let resistant bacteria survive and multiply, so common infections become hard to treat",
    },
    {
      key: "Herd immunity",
      value:
        "Protection of a whole population when enough of it is immune that the chain of transmission breaks",
    },
    {
      key: "Zoonotic disease",
      value:
        "A disease that spreads from animals to human beings, such as rabies, plague and avian influenza",
    },
  ],
);

/* ==================================================================== CSAT */

csat(
  "csat:data-sufficiency",
  "Data Sufficiency and Analytical Judgement",
  "In data sufficiency questions, what is %s?",
  "%k is %v.",
  [
    {
      key: "Data sufficiency question",
      value:
        "A question asking not for the answer but whether the given statements are enough to find it",
    },
    {
      key: "Standard instruction in a two statement question",
      value:
        "Decide whether statement one alone, statement two alone, both together or neither is sufficient",
    },
    {
      key: "First step in solving a data sufficiency question",
      value: "Identify exactly what is being asked before reading the statements",
    },
    {
      key: "Common trap in data sufficiency",
      value: "Actually computing the answer instead of only checking sufficiency",
    },
    {
      key: "Second common trap",
      value: "Carrying information from statement one into the testing of statement two",
    },
    {
      key: "Test of sufficiency for a value question",
      value: "The statement is sufficient only if it yields exactly one value",
    },
    {
      key: "Test of sufficiency for a yes or no question",
      value: "The statement is sufficient if it always gives the same answer, whether yes or no",
    },
    {
      key: "Best order of testing",
      value: "Test each statement alone first, and only then test them together",
    },
    {
      key: "Meaning of the option both together are sufficient",
      value: "Neither alone is enough but the two combined give a unique answer",
    },
    {
      key: "Use of the counter example method",
      value:
        "Finding two cases consistent with a statement that give different answers proves it insufficient",
    },
  ],
  [
    {
      key: "Reason an equation in two unknowns is usually insufficient alone",
      value:
        "It has infinitely many solutions unless a further constraint such as integrality fixes a unique pair",
    },
    {
      key: "Handling of a statement that merely restates the question",
      value: "It adds no new information and is therefore insufficient",
    },
    {
      key: "Effect of a hidden constraint such as a positive integer",
      value:
        "It can reduce infinitely many solutions to one, so a single equation may then be sufficient",
    },
    {
      key: "Best use of time in a data sufficiency set",
      value:
        "Stop as soon as sufficiency is settled, since the numerical answer itself carries no marks",
    },
    {
      key: "Judging sufficiency in a ratio question",
      value: "A ratio alone never fixes absolute values, so one actual quantity must also be known",
    },
  ],
);

csat(
  "csat:syllogism-statements",
  "Syllogism, Assumptions and Course of Action",
  "In logical reasoning, what is %s?",
  "%k is %v.",
  [
    {
      key: "Syllogism",
      value: "A form of reasoning in which a conclusion is drawn from two given premises",
    },
    {
      key: "Best method of solving a syllogism",
      value: "Drawing Venn diagrams for all possible arrangements of the premises",
    },
    {
      key: "Rule about two negative premises",
      value: "No definite conclusion can be drawn from two negative premises",
    },
    {
      key: "Rule about two particular premises",
      value: "No definite conclusion can be drawn from two particular premises",
    },
    {
      key: "Assumption",
      value: "Something taken for granted and not stated, on which the statement rests",
    },
    {
      key: "Inference",
      value: "Something that follows from the given facts although it is not stated",
    },
    {
      key: "Course of action",
      value: "A step proposed to improve or solve the problem described in the statement",
    },
    {
      key: "Test of a valid assumption",
      value: "The statement would fall apart if the assumption were not true",
    },
    {
      key: "Test of a valid course of action",
      value:
        "It must be practical, within the authority of the agency and address the stated problem",
    },
    {
      key: "Statement and argument question",
      value:
        "A question asking whether a given argument is strong or weak in relation to the statement",
    },
  ],
  [
    {
      key: "Difference between an assumption and an inference",
      value:
        "An assumption is presupposed before the statement is made, an inference is drawn after it",
    },
    {
      key: "Test of a strong argument",
      value:
        "It must be directly related, of real and practical importance, and not merely an individual opinion or a restatement",
    },
    {
      key: "Possibility case in syllogism",
      value:
        "A conclusion using may be or possibility is valid if at least one arrangement of the premises permits it",
    },
    {
      key: "Complementary pair in syllogism",
      value:
        "Where two conclusions are of the form some and no about the same terms, either one or the other must follow",
    },
    {
      key: "Common error in course of action questions",
      value:
        "Choosing extreme or punitive steps that are impractical, rather than steps a responsible agency would actually take",
    },
  ],
);

csat(
  "csat:time-work-speed",
  "Time, Work, Speed and Distance for CSAT",
  "In arithmetic word problems, what is %s?",
  "%k is %v.",
  [
    {
      key: "Relation among speed, distance and time",
      value: "Distance equals speed multiplied by time",
    },
    {
      key: "Conversion from kilometre per hour to metre per second",
      value: "Multiply by five and divide by eighteen",
    },
    {
      key: "Average speed for equal distances at two speeds",
      value: "Twice the product of the speeds divided by their sum",
    },
    {
      key: "Time taken by a train to cross a pole",
      value: "The length of the train divided by its speed",
    },
    {
      key: "Time taken by a train to cross a platform",
      value: "The sum of the lengths divided by the speed",
    },
    {
      key: "Relative speed of two bodies moving in opposite directions",
      value: "The sum of their speeds",
    },
    {
      key: "Relative speed of two bodies moving in the same direction",
      value: "The difference of their speeds",
    },
    {
      key: "Speed of a boat downstream",
      value: "The speed of the boat plus the speed of the stream",
    },
    {
      key: "Work done in one day by a person finishing a job in n days",
      value: "One nth of the work",
    },
    { key: "Combined rate of two workers", value: "The sum of their individual one day rates" },
  ],
  [
    {
      key: "Inverse relation in time and work",
      value:
        "More workers take proportionately less time for the same work, so the product of workers and days is constant",
    },
    {
      key: "Time for A and B working together",
      value: "The product of their individual times divided by their sum",
    },
    {
      key: "Effect of a leak on a filling pipe",
      value:
        "The leak's rate is subtracted from the filling rate, so the net rate and hence the time are found from the difference",
    },
    {
      key: "Reason average speed is not the simple mean of two speeds",
      value:
        "Equal distances are covered in unequal times, so the slower speed applies for longer and pulls the average down",
    },
    {
      key: "Chain rule in work problems",
      value:
        "Men times days times hours divided by work is constant, which links all four quantities in one relation",
    },
  ],
);

csat(
  "csat:english-comprehension",
  "Reading Comprehension Strategy for CSAT",
  "In reading comprehension, what is %s?",
  "%k is %v.",
  [
    {
      key: "Main idea of a passage",
      value: "The central point the author is making, which the whole passage supports",
    },
    { key: "Tone of a passage", value: "The attitude of the author towards the subject" },
    {
      key: "Inference question",
      value: "A question whose answer is not stated but follows logically from the passage",
    },
    {
      key: "Best first step in a comprehension set",
      value: "Read the passage once for the main idea before going to the questions",
    },
    {
      key: "Test of the correct option",
      value: "It must be supported by the passage alone, not by outside knowledge",
    },
    {
      key: "Common wrong option type",
      value: "One that is true in the real world but is not stated or implied in the passage",
    },
    {
      key: "Second common wrong option type",
      value: "One that is too extreme, using words such as always, never or only",
    },
    {
      key: "Assumption question in comprehension",
      value: "A question asking what the author must be taking for granted",
    },
    {
      key: "Vocabulary in context question",
      value: "A question asking the meaning a word carries in the particular sentence",
    },
    {
      key: "Purpose of a paragraph",
      value:
        "The role it plays in the argument, such as giving an example, raising an objection or drawing a conclusion",
    },
  ],
  [
    {
      key: "Reason outside knowledge is dangerous in comprehension",
      value:
        "The examiner tests only what the passage says, so what a candidate already believes often points to a trap option",
    },
    {
      key: "Handling of an except or not question",
      value: "Find the three options the passage supports, and the remaining one is the answer",
    },
    {
      key: "Reading strategy for a dense philosophical passage",
      value:
        "Track the argument rather than the detail, marking where the author agrees, objects or concludes",
    },
    {
      key: "Signal words that mark a turn in the argument",
      value: "However, yet, nevertheless, on the contrary and although",
    },
    {
      key: "Best way to judge tone",
      value:
        "Look at the adjectives and adverbs the author chooses, which reveal approval, criticism, caution or neutrality",
    },
  ],
);

/* ====================================================== Business Economics */

eco(
  "be:market-structures",
  "Market Structures and Firm Behaviour",
  "In market structure, what is %s?",
  "%k is %v.",
  [
    {
      key: "Perfect competition",
      value:
        "A market with many buyers and sellers of a homogeneous product and free entry and exit",
    },
    { key: "Monopoly", value: "A market with a single seller and no close substitute" },
    {
      key: "Monopolistic competition",
      value: "A market with many sellers of differentiated products",
    },
    { key: "Oligopoly", value: "A market dominated by a few large sellers" },
    {
      key: "Demand curve facing a firm in perfect competition",
      value: "A horizontal line, perfectly elastic at the market price",
    },
    {
      key: "Condition for equilibrium of a firm",
      value: "Marginal cost equals marginal revenue, with marginal cost rising",
    },
    {
      key: "Price discrimination",
      value: "Charging different prices to different buyers for the same product",
    },
    { key: "Duopoly", value: "An oligopoly with exactly two sellers" },
    { key: "Kinked demand curve", value: "The oligopoly model explaining why prices stay rigid" },
    {
      key: "Barrier to entry",
      value:
        "Anything that prevents new firms from entering a market, such as patents, licences or high fixed cost",
    },
  ],
  [
    {
      key: "Reason a monopolist's marginal revenue is below price",
      value:
        "To sell one more unit the monopolist must lower the price on all units, so the revenue gained is less than the price",
    },
    {
      key: "Difference between the short run and the long run for a competitive firm",
      value:
        "Supernormal profit can persist in the short run, but free entry competes it away so only normal profit remains in the long run",
    },
    {
      key: "Selling cost in monopolistic competition",
      value:
        "Expenditure on advertising and promotion to shift the firm's demand curve, absent in perfect competition",
    },
    {
      key: "Shut down point",
      value:
        "The point at which price falls below average variable cost, when the firm stops producing even in the short run",
    },
    {
      key: "Three conditions for price discrimination",
      value:
        "The seller must have market power, must be able to separate buyers by elasticity, and must prevent resale between them",
    },
  ],
);

eco(
  "be:public-finance",
  "Public Finance, Budget and Fiscal Policy",
  "In public finance, what is %s?",
  "%k is %v.",
  [
    { key: "Public finance", value: "The study of the income and expenditure of the government" },
    {
      key: "Revenue receipt",
      value: "A receipt that neither creates a liability nor reduces an asset",
    },
    {
      key: "Capital receipt",
      value: "A receipt that either creates a liability or reduces an asset",
    },
    { key: "Fiscal deficit", value: "Total expenditure less total receipts other than borrowing" },
    { key: "Revenue deficit", value: "The excess of revenue expenditure over revenue receipts" },
    { key: "Primary deficit", value: "The fiscal deficit less interest payments" },
    { key: "Direct tax", value: "A tax whose burden cannot be shifted, such as income tax" },
    { key: "Indirect tax", value: "A tax whose burden can be shifted, such as GST" },
    { key: "Progressive tax", value: "A tax whose rate rises as income rises" },
    {
      key: "Law that sets fiscal deficit targets in India",
      value: "The Fiscal Responsibility and Budget Management Act, 2003",
    },
  ],
  [
    {
      key: "Reason the primary deficit matters",
      value:
        "It shows the current year's borrowing need excluding the burden of past debt, so it measures present fiscal discipline",
    },
    {
      key: "Canons of taxation of Adam Smith",
      value: "Equality, certainty, convenience and economy",
    },
    {
      key: "Difference between fiscal and monetary policy",
      value:
        "Fiscal policy uses government spending and taxation, monetary policy uses interest rates and the money supply",
    },
    {
      key: "Crowding out effect",
      value: "Heavy government borrowing raises interest rates and squeezes out private investment",
    },
    {
      key: "Automatic stabiliser",
      value:
        "A feature such as progressive tax or unemployment benefit that cushions the cycle without any new decision",
    },
  ],
);

eco(
  "be:business-organisation",
  "Business Organisation and Entrepreneurship",
  "In business organisation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Sole proprietorship",
      value: "A business owned and run by one person with unlimited liability",
    },
    {
      key: "Partnership firm",
      value:
        "A business owned by two or more persons who share profits, governed by the Indian Partnership Act, 1932",
    },
    {
      key: "Limited Liability Partnership",
      value: "A body corporate combining the flexibility of a partnership with limited liability",
    },
    {
      key: "Private limited company",
      value:
        "A company that restricts the transfer of shares and cannot invite the public to subscribe",
    },
    {
      key: "One Person Company",
      value: "A company with a single member, introduced by the Companies Act, 2013",
    },
    {
      key: "Memorandum of Association",
      value: "The charter of a company stating its name, objects, capital and liability",
    },
    {
      key: "Articles of Association",
      value: "The document containing the internal rules for the management of a company",
    },
    {
      key: "Certificate of Incorporation",
      value: "The document that brings a company into legal existence",
    },
    {
      key: "Perpetual succession",
      value: "The continuance of a company regardless of the death or exit of its members",
    },
    {
      key: "Entrepreneurship",
      value:
        "The act of organising the factors of production and bearing risk to create an enterprise",
    },
  ],
  [
    {
      key: "Doctrine of ultra vires",
      value:
        "An act beyond the objects in the memorandum is void and cannot be ratified even by all the members",
    },
    {
      key: "Difference between a partnership and an LLP",
      value:
        "Partners of a firm have unlimited liability and the firm is not a separate legal person, while an LLP is a body corporate with limited liability",
    },
    {
      key: "Lifting the corporate veil",
      value:
        "Looking behind the separate legal personality to hold the members liable where the company is used for fraud or evasion",
    },
    {
      key: "Startup as recognised in India",
      value:
        "An entity within ten years of incorporation with turnover below the prescribed limit, working on innovation or a scalable model",
    },
    {
      key: "Role of the entrepreneur in economic development",
      value:
        "Innovation, capital formation, employment generation and the balanced regional spread of industry",
    },
  ],
);

eco(
  "be:international-trade",
  "International Trade and the Balance of Payments",
  "In international economics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Balance of trade",
      value: "The difference between the value of exports and imports of goods",
    },
    {
      key: "Balance of payments",
      value: "The record of all economic transactions of a country with the rest of the world",
    },
    {
      key: "Current account of the balance of payments",
      value: "The account recording trade in goods and services, income and transfers",
    },
    {
      key: "Capital account",
      value: "The account recording flows of investment, loans and banking capital",
    },
    {
      key: "Theory of absolute advantage",
      value: "The theory of Adam Smith that a country should produce what it makes most cheaply",
    },
    {
      key: "Theory of comparative advantage",
      value:
        "The theory of David Ricardo that trade benefits both countries even if one is better at everything",
    },
    { key: "Tariff", value: "A tax levied on imports or exports" },
    {
      key: "Quota in trade",
      value: "A physical limit on the quantity of a good that may be imported",
    },
    {
      key: "Devaluation",
      value: "A deliberate reduction in the external value of a currency under a fixed rate system",
    },
    { key: "Body that governs world trade rules", value: "The World Trade Organization" },
  ],
  [
    {
      key: "Reason the balance of payments always balances",
      value:
        "It is drawn on double entry principles, so any gap in the autonomous items is offset by accommodating items and reserves",
    },
    {
      key: "Difference between devaluation and depreciation",
      value:
        "Devaluation is a policy decision under a fixed rate, depreciation is a market fall under a floating rate",
    },
    {
      key: "J curve effect",
      value:
        "After a devaluation the trade balance first worsens and only later improves as volumes adjust",
    },
    {
      key: "Most favoured nation treatment",
      value:
        "The WTO principle that a concession given to one member must be extended to all members",
    },
    {
      key: "Effect of a tariff on the domestic economy",
      value:
        "It raises the domestic price, protects local producers, earns revenue but reduces consumer surplus and overall efficiency",
    },
  ],
);

/* ========================================================= Cost Accounting */

cost(
  "ca:job-contract-costing",
  "Job, Batch and Contract Costing",
  "In specific order costing, what is %s?",
  "%k is %v.",
  [
    {
      key: "Job costing",
      value: "Costing applied where work is done against a specific customer order",
    },
    {
      key: "Batch costing",
      value: "Costing applied where identical units are produced in batches",
    },
    {
      key: "Contract costing",
      value: "Costing applied to large jobs that run over a long period, usually at the site",
    },
    {
      key: "Economic batch quantity",
      value: "The batch size at which set up and carrying costs together are minimum",
    },
    {
      key: "Work certified",
      value: "The value of work approved by the architect or engineer up to a date",
    },
    { key: "Work uncertified", value: "Work completed but not yet approved for certification" },
    {
      key: "Retention money",
      value:
        "The part of the certified value withheld by the contractee until the defects period ends",
    },
    {
      key: "Escalation clause",
      value: "A clause allowing the contract price to rise if the cost of material or labour rises",
    },
    {
      key: "Cost plus contract",
      value: "A contract in which the price is the actual cost plus an agreed percentage of profit",
    },
    {
      key: "Notional profit",
      value: "The difference between the value of work certified and the cost of work certified",
    },
  ],
  [
    {
      key: "Profit taken to the profit and loss account on an incomplete contract",
      value:
        "A prudent portion of the notional profit, the share rising as the contract nears completion",
    },
    {
      key: "Treatment when a contract is less than one fourth complete",
      value: "No profit is transferred, the whole notional profit being kept as reserve",
    },
    {
      key: "Difference between job costing and process costing",
      value:
        "Job costing collects cost for each distinct order, process costing averages cost over all units of a continuous process",
    },
    {
      key: "Reason an escalation clause is used",
      value:
        "It protects the contractor against price rises over a long contract without inflating the original quotation",
    },
    {
      key: "Work in progress in contract accounts",
      value:
        "Work certified plus work uncertified less the reserve for unrealised profit and the cash received",
    },
  ],
);

cost(
  "ca:process-costing",
  "Process Costing, Joint and By-products",
  "In process costing, what is %s?",
  "%k is %v.",
  [
    {
      key: "Process costing",
      value:
        "Costing used where production is continuous and output passes through several processes",
    },
    {
      key: "Normal loss",
      value: "The unavoidable loss expected in the ordinary course of a process",
    },
    { key: "Abnormal loss", value: "Loss in excess of the normal expected loss" },
    { key: "Abnormal gain", value: "Actual loss less than the normal expected loss" },
    {
      key: "Treatment of normal loss",
      value: "Its cost is absorbed by the good units, and any scrap value reduces the process cost",
    },
    {
      key: "Treatment of abnormal loss",
      value:
        "It is valued at the cost of a good unit and transferred to the costing profit and loss account",
    },
    {
      key: "Equivalent production",
      value: "Incomplete units expressed as an equivalent number of completed units",
    },
    {
      key: "Joint products",
      value:
        "Two or more products of roughly equal importance produced together from the same process",
    },
    {
      key: "By-product",
      value: "A product of minor value produced incidentally along with the main product",
    },
    {
      key: "Split off point",
      value: "The point at which joint products become separately identifiable",
    },
  ],
  [
    {
      key: "Methods of apportioning joint cost",
      value:
        "Physical units, net realisable value, average unit cost and the survey or point value method",
    },
    {
      key: "Reason joint cost should not decide whether to process further",
      value:
        "It is a sunk cost common to all products, so only the incremental revenue and incremental cost after the split off point matter",
    },
    {
      key: "Treatment of a by-product of small value",
      value:
        "Its net realisable value is credited to the main process, reducing the cost of the main product",
    },
    {
      key: "Inter-process profit",
      value:
        "Profit added when output is transferred from one process to the next at a price above cost, which must be eliminated from closing stock",
    },
    {
      key: "FIFO and average method in equivalent production",
      value:
        "FIFO keeps opening work in progress separate at its own cost, the average method merges it with current cost",
    },
  ],
);

cost(
  "ca:service-costing",
  "Service and Operating Costing",
  "In service costing, what is %s?",
  "%k is %v.",
  [
    {
      key: "Operating costing",
      value: "Costing applied to undertakings that render a service rather than produce goods",
    },
    { key: "Cost unit in passenger transport", value: "The passenger kilometre" },
    { key: "Cost unit in goods transport", value: "The tonne kilometre" },
    { key: "Cost unit in a hospital", value: "The patient day, or the bed day" },
    { key: "Cost unit in a hotel", value: "The room day, or the guest day" },
    { key: "Cost unit in electricity generation", value: "The kilowatt hour" },
    { key: "Cost unit in a canteen", value: "The meal served" },
    {
      key: "Standing charge in transport costing",
      value:
        "A fixed cost incurred whether the vehicle runs or not, such as insurance and road tax",
    },
    {
      key: "Running charge in transport costing",
      value: "A variable cost that depends on distance run, such as fuel and tyres",
    },
    { key: "Maintenance charge", value: "A semi-variable cost such as repairs and servicing" },
  ],
  [
    {
      key: "Absolute and commercial tonne kilometre",
      value:
        "The absolute figure multiplies each load by the distance it actually moves, the commercial figure uses the average load over the total distance",
    },
    {
      key: "Reason a service undertaking needs a composite cost unit",
      value:
        "Service output varies in two dimensions at once, such as weight and distance, so a single measure would distort cost",
    },
    {
      key: "Treatment of the return journey without load",
      value:
        "The empty run adds distance but no revenue tonne kilometre, so it raises the cost per tonne kilometre",
    },
    {
      key: "Chief cost in a hospital",
      value:
        "Salaries and wages of medical and support staff, followed by drugs, consumables and the depreciation of equipment",
    },
    {
      key: "Use of operating cost statements",
      value:
        "They fix fares or rates, compare vehicles or units, and reveal idle capacity and avoidable cost",
    },
  ],
);

cost(
  "ca:reconciliation",
  "Cost Control Accounts and Reconciliation",
  "In cost accounting systems, what is %s?",
  "%k is %v.",
  [
    {
      key: "Integral accounting system",
      value: "A single set of books recording both cost and financial transactions",
    },
    {
      key: "Non-integral or cost ledger accounting",
      value: "A system in which cost and financial records are kept separately",
    },
    {
      key: "Cost ledger control account",
      value: "The account that completes the double entry in a non-integral system",
    },
    {
      key: "Reason for reconciliation of cost and financial accounts",
      value: "The two sets of books show different profits under a non-integral system",
    },
    {
      key: "Item appearing only in financial accounts",
      value: "Interest received, dividend, loss on sale of an asset and donations",
    },
    {
      key: "Item appearing only in cost accounts",
      value: "Notional rent on owned premises and notional interest on own capital",
    },
    {
      key: "Effect of over absorption of overhead in cost accounts",
      value: "Cost profit is higher than financial profit to that extent",
    },
    {
      key: "Effect of under absorption of overhead",
      value: "Cost profit is lower than financial profit to that extent",
    },
    {
      key: "Statement prepared to bring the two profits together",
      value: "The reconciliation statement",
    },
    {
      key: "Starting point of a reconciliation statement",
      value: "Either profit as per cost accounts or profit as per financial accounts",
    },
  ],
  [
    {
      key: "Reason an integral system needs no reconciliation",
      value:
        "Both cost and financial data come from one set of books, so only one profit figure exists",
    },
    {
      key: "Treatment of different stock valuation methods",
      value:
        "Where cost accounts and financial accounts value stock differently, the difference is adjusted in the reconciliation statement",
    },
    {
      key: "Treatment of abnormal loss in reconciliation",
      value:
        "Abnormal items charged in one set of books and not the other must be added back or deducted to align the profits",
    },
    {
      key: "Advantage of the integral system",
      value:
        "It avoids duplication, saves time and cost, and removes the need for reconciliation altogether",
    },
    {
      key: "Treatment of depreciation charged at different rates",
      value:
        "The excess or short charge in cost accounts compared with financial accounts is adjusted in the reconciliation",
    },
  ],
);

export const GS_COMMERCE_FULL_TEMPLATES = templates;
