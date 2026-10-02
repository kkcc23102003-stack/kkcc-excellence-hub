/**
 * Teaching Aptitude for the TET and cadre exams, plus the General Studies
 * subjects that were still running thin for SSC, Railway, Banking, NDA and the
 * state exams.
 *
 * Teaching Aptitude is the Paper 1 and Paper 2 common section of CTET, PSTET,
 * the ETT cadre and the Master and Lecturer cadres. Science and Technology,
 * General Science, World Geography, Art and Culture and the three History
 * blocks each carried only three to six chapters, which is well short of what
 * an SSC CGL or RRB NTPC General Awareness section actually asks.
 */

import { type Template } from "./core";
import { CIVIL_DEFENCE, GK_WIDE, chapterFactory } from "./two-layer";

const TET = [
  "PSTET/CTET",
  "State Teacher/TET",
  "Punjab ETT Cadre",
  "Punjab Master Cadre",
  "Punjab Lecturer Cadre",
  "CTET",
  "UPTET",
  "HTET",
];

const templates: Template[] = [];
const teach = chapterFactory(templates, "Teaching Aptitude", TET);
const scitech = chapterFactory(templates, "Science and Technology", GK_WIDE);
const gsci = chapterFactory(templates, "General Science", GK_WIDE);
const wgeo = chapterFactory(templates, "World Geography", GK_WIDE);
const pgeo = chapterFactory(templates, "Physical Geography", GK_WIDE);
const culture = chapterFactory(templates, "Art and Culture", GK_WIDE);
const anc = chapterFactory(templates, "Ancient History", GK_WIDE);
const med = chapterFactory(templates, "Medieval History", GK_WIDE);
const mod = chapterFactory(templates, "Modern History", GK_WIDE);
const env = chapterFactory(templates, "Environment and Ecology", GK_WIDE);
const eco = chapterFactory(templates, "Indian Economy", [...GK_WIDE, ...CIVIL_DEFENCE]);

/* =============================================== Teaching Aptitude ===== */

teach(
  "tet:language-pedagogy",
  "Pedagogy of Language",
  "In language pedagogy, what is %s?",
  "%k is %v.",
  [
    {
      key: "Language acquisition",
      value: "The natural subconscious process by which a child picks up the first language",
    },
    {
      key: "Language learning",
      value: "The conscious study of the rules and structure of a language",
    },
    { key: "Four language skills", value: "Listening, speaking, reading and writing" },
    {
      key: "Receptive skills",
      value: "Listening and reading, in which the learner takes in language",
    },
    {
      key: "Productive skills",
      value: "Speaking and writing, in which the learner produces language",
    },
    {
      key: "Mother tongue in the classroom",
      value: "It is a resource that supports concept building, not an obstacle to be removed",
    },
    {
      key: "Remedial teaching",
      value: "Focused re-teaching planned after diagnosing the specific errors a learner makes",
    },
    {
      key: "Comprehensible input",
      value:
        "Krashen's idea that learners progress when exposed to language slightly above their current level",
    },
    {
      key: "Whole language approach",
      value: "Teaching reading through meaningful whole texts rather than isolated letters",
    },
    {
      key: "Phonics approach",
      value: "Teaching reading by linking letters to their sounds and blending them",
    },
  ],
  [
    {
      key: "Chomsky's language acquisition device",
      value:
        "The innate mental capacity that lets every normal child acquire grammar from limited input",
    },
    {
      key: "Role of error in language learning",
      value:
        "Errors are natural signs of the learner's developing system and should guide teaching rather than invite punishment",
    },
    {
      key: "Communicative approach",
      value:
        "Teaching language through real tasks and meaningful interaction rather than drilling grammar rules",
    },
    {
      key: "Multilingualism as a resource",
      value:
        "The National Curriculum Framework treats the child's home languages as an asset for classroom learning",
    },
    {
      key: "Diagnostic versus achievement test in language",
      value:
        "A diagnostic test locates specific weaknesses while an achievement test measures overall attainment",
    },
  ],
);

teach(
  "tet:maths-pedagogy",
  "Pedagogy of Mathematics",
  "In mathematics pedagogy, what is %s?",
  "%k is %v.",
  [
    {
      key: "Aim of mathematics teaching at the primary stage",
      value: "Mathematisation of the child's thinking, not mere computation",
    },
    {
      key: "Concrete to abstract principle",
      value: "Teaching begins with real objects, then pictures, then symbols",
    },
    {
      key: "Inductive method",
      value: "Moving from particular examples to a general rule or formula",
    },
    {
      key: "Deductive method",
      value: "Applying an already stated rule or formula to particular problems",
    },
    {
      key: "Heuristic method",
      value: "Letting the learner discover the result by investigation and guided questioning",
    },
    {
      key: "Mathematics laboratory",
      value: "A space with manipulatives where children verify results by doing",
    },
    {
      key: "Error analysis in mathematics",
      value: "Studying the pattern in a child's mistakes to find the faulty concept behind them",
    },
    {
      key: "Common cause of difficulty in word problems",
      value: "Weak language comprehension rather than weak computation",
    },
    {
      key: "Open ended problem",
      value: "A problem that allows more than one strategy or more than one correct answer",
    },
    {
      key: "Place value teaching aid",
      value: "The abacus, bundles of sticks and place value charts",
    },
  ],
  [
    {
      key: "Van Hiele levels",
      value:
        "The sequence of geometric thinking from visualisation and analysis to deduction and rigour",
    },
    {
      key: "Reason drill alone is inadequate",
      value: "It builds speed without understanding and does not transfer to new situations",
    },
    {
      key: "Constructivist mathematics classroom",
      value:
        "One where children build concepts through activity, discussion and reflection rather than receiving rules",
    },
    {
      key: "Purpose of estimation in the syllabus",
      value: "It develops number sense and lets children judge whether an answer is reasonable",
    },
    {
      key: "Diagnostic test in mathematics",
      value: "A test designed to locate the exact step at which a child's procedure breaks down",
    },
  ],
);

teach(
  "tet:evs-pedagogy",
  "Pedagogy of Environmental Studies",
  "In EVS pedagogy, what is %s?",
  "%k is %v.",
  [
    {
      key: "Scope of EVS at the primary stage",
      value: "An integrated subject drawing on science, social science and environmental education",
    },
    {
      key: "Six themes of the EVS syllabus",
      value: "Family and friends, food, shelter, water, travel and things we make and do",
    },
    {
      key: "Central method of EVS teaching",
      value: "Observation, exploration and discussion based on the child's own surroundings",
    },
    {
      key: "Field visit in EVS",
      value:
        "A planned visit that lets children gather first hand information from the real environment",
    },
    {
      key: "Survey method",
      value: "Children collect information from people around them and present their findings",
    },
    {
      key: "Experiential learning",
      value: "Learning through direct experience followed by reflection",
    },
    {
      key: "Concept map",
      value: "A diagram showing how ideas are linked, used to organise and assess understanding",
    },
    {
      key: "Discussion method",
      value: "Learning through structured exchange of ideas among children",
    },
    {
      key: "Role of questions in EVS",
      value: "Open questions push children to observe, compare, classify and infer",
    },
    {
      key: "Continuous and comprehensive evaluation",
      value: "Regular assessment of both scholastic and co-scholastic growth",
    },
  ],
  [
    {
      key: "Reason EVS is not taught as separate science and social science",
      value:
        "The primary child sees the environment as a whole, so an integrated approach matches how the child thinks",
    },
    {
      key: "Constructivist view of EVS",
      value:
        "The child already holds ideas about the environment, and teaching must build on and refine them",
    },
    {
      key: "Project method in EVS",
      value:
        "A purposeful activity carried out in a social setting, following Kilpatrick's steps of purposing, planning, executing and judging",
    },
    {
      key: "Assessment tools suited to EVS",
      value:
        "Portfolios, anecdotal records, checklists and rating scales rather than only written tests",
    },
    {
      key: "Handling an alternative conception",
      value:
        "Bring the child's idea into the open, create a conflicting experience, and let the child rebuild the concept",
    },
  ],
);

teach(
  "tet:guidance",
  "Guidance, Counselling and School Management",
  "In school guidance and management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Guidance",
      value: "Organised help given to an individual to understand himself and make wise choices",
    },
    {
      key: "Counselling",
      value: "A personal interaction in which a trained person helps a pupil resolve a difficulty",
    },
    { key: "Educational guidance", value: "Help in choosing subjects, courses and study methods" },
    {
      key: "Vocational guidance",
      value: "Help in choosing, preparing for and progressing in an occupation",
    },
    {
      key: "Cumulative record card",
      value: "A continuous record of a pupil's abilities, achievements, interests and health",
    },
    {
      key: "Anecdotal record",
      value: "A factual written description of a significant incident of pupil behaviour",
    },
    {
      key: "Sociometry",
      value: "A technique for mapping the pattern of acceptance and rejection within a group",
    },
    {
      key: "Case study in guidance",
      value: "An intensive all round study of one pupil to understand a persistent problem",
    },
    {
      key: "Role of the class teacher in guidance",
      value: "First level identification of difficulty and referral to the counsellor",
    },
    {
      key: "Parent teacher meeting",
      value: "A structured interaction to share the child's progress and agree on joint support",
    },
  ],
  [
    {
      key: "Difference between guidance and counselling",
      value:
        "Guidance is broader, largely informative and often group based, while counselling is personal, in depth and remedial",
    },
    {
      key: "Rapport in counselling",
      value:
        "The relationship of trust and acceptance without which the pupil will not speak freely",
    },
    {
      key: "Directive counselling",
      value:
        "Counsellor centred counselling in which the counsellor leads and advises, associated with Williamson",
    },
    {
      key: "Non directive counselling",
      value: "Client centred counselling in which the pupil leads, associated with Carl Rogers",
    },
    {
      key: "Confidentiality in school counselling",
      value: "Information shared must be protected except where the pupil's safety is at risk",
    },
  ],
);

teach(
  "tet:individual-differences",
  "Individual Differences and Intelligence",
  "In educational psychology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Individual differences",
      value: "The variation among learners in ability, interest, pace and background",
    },
    {
      key: "Intelligence quotient",
      value: "Mental age divided by chronological age multiplied by one hundred",
    },
    {
      key: "Spearman's two factor theory",
      value: "Intelligence has a general factor g and specific factors s",
    },
    {
      key: "Gardner's theory of multiple intelligences",
      value: "Intelligence is not single but a set of relatively independent intelligences",
    },
    {
      key: "Emotional intelligence",
      value: "The ability to perceive, understand and manage emotions in oneself and others",
    },
    { key: "Creativity", value: "The ability to produce ideas that are both novel and useful" },
    {
      key: "Divergent thinking",
      value: "Generating many different possible answers to an open problem",
    },
    { key: "Convergent thinking", value: "Arriving at the single best answer to a closed problem" },
    {
      key: "Gifted child",
      value:
        "A child of markedly superior ability who needs enrichment beyond the regular syllabus",
    },
    {
      key: "Slow learner",
      value: "A child of below average ability who learns at a slower pace but is not disabled",
    },
  ],
  [
    {
      key: "Reason IQ alone is an inadequate measure",
      value:
        "It ignores creativity, emotional and social competence and the influence of environment on test performance",
    },
    {
      key: "Enrichment versus acceleration",
      value:
        "Enrichment deepens learning at the same grade while acceleration moves the child to a higher grade",
    },
    {
      key: "Nature versus nurture in intelligence",
      value:
        "Heredity sets a range of potential while environment decides where within that range a child performs",
    },
    {
      key: "Torrance test",
      value:
        "A test of creative thinking measuring fluency, flexibility, originality and elaboration",
    },
    {
      key: "Implication of individual differences for teaching",
      value:
        "Teaching must be differentiated in content, process and product rather than uniform for all",
    },
  ],
);

/* ============================================ Science and Technology === */

scitech(
  "gs:scitech:space",
  "Indian Space Programme and Satellites",
  "In the Indian space programme, what is %s?",
  "%k is %v.",
  [
    { key: "ISRO headquarters", value: "Bengaluru, Karnataka" },
    { key: "Founder of the Indian space programme", value: "Dr Vikram Sarabhai" },
    { key: "India's first satellite", value: "Aryabhata, launched in 1975" },
    {
      key: "Chandrayaan-1",
      value:
        "India's first lunar mission, launched in 2008, which confirmed water molecules on the moon",
    },
    {
      key: "Chandrayaan-3",
      value: "The mission that soft landed near the lunar south pole in August 2023",
    },
    {
      key: "Mangalyaan",
      value:
        "The Mars Orbiter Mission of 2013, which made India the first country to succeed on its first attempt",
    },
    {
      key: "PSLV",
      value: "The Polar Satellite Launch Vehicle, ISRO's most reliable workhorse rocket",
    },
    {
      key: "GSLV",
      value:
        "The Geosynchronous Satellite Launch Vehicle, used for heavier communication satellites",
    },
    { key: "NAVIC", value: "India's regional navigation satellite system, formerly called IRNSS" },
    {
      key: "Satish Dhawan Space Centre",
      value: "India's launch site at Sriharikota in Andhra Pradesh",
    },
  ],
  [
    {
      key: "Reason Sriharikota was chosen as a launch site",
      value:
        "It lies close to the equator on the east coast, giving extra rotational velocity and a safe sea range",
    },
    {
      key: "Aditya-L1",
      value: "India's first solar observatory mission, placed at the Lagrange point L1",
    },
    { key: "Gaganyaan", value: "India's planned human spaceflight programme" },
    {
      key: "Geostationary orbit altitude",
      value: "About 36 000 kilometres above the equator, with a period of twenty four hours",
    },
    {
      key: "Cryogenic engine",
      value:
        "An engine using liquefied gases such as liquid hydrogen and liquid oxygen as propellants",
    },
  ],
);

scitech(
  "gs:scitech:defence-it",
  "Defence Technology and Information Technology",
  "In defence and information technology, what is %s?",
  "%k is %v.",
  [
    {
      key: "DRDO",
      value: "The Defence Research and Development Organisation, headquartered in New Delhi",
    },
    { key: "Agni missile", value: "India's surface to surface ballistic missile series" },
    {
      key: "BrahMos",
      value: "The supersonic cruise missile developed jointly by India and Russia",
    },
    { key: "Tejas", value: "India's indigenously developed light combat aircraft" },
    { key: "INS Vikrant", value: "India's first indigenously designed and built aircraft carrier" },
    {
      key: "Artificial intelligence",
      value:
        "The branch of computer science that builds systems performing tasks needing human intelligence",
    },
    {
      key: "Machine learning",
      value:
        "A field in which systems improve performance on a task from data without explicit programming",
    },
    {
      key: "Internet of Things",
      value: "A network of physical devices that collect and exchange data over the internet",
    },
    {
      key: "Blockchain",
      value: "A distributed tamper resistant ledger of records linked by cryptography",
    },
    {
      key: "Cloud computing",
      value:
        "Delivery of computing resources such as storage and processing over the internet on demand",
    },
  ],
  [
    {
      key: "Difference between a ballistic and a cruise missile",
      value:
        "A ballistic missile follows a high arcing free fall path while a cruise missile flies low and is powered throughout",
    },
    {
      key: "Quantum computing",
      value:
        "Computing that uses qubits which can hold superpositions, allowing certain problems to be solved far faster",
    },
    {
      key: "5G technology advantage",
      value:
        "Very high data rates, very low latency and support for a large density of connected devices",
    },
    {
      key: "Integrated Guided Missile Development Programme",
      value:
        "The DRDO programme led by Dr A. P. J. Abdul Kalam that produced Agni, Prithvi, Akash, Trishul and Nag",
    },
    {
      key: "Cyber security triad",
      value: "Confidentiality, integrity and availability of information",
    },
  ],
);

scitech(
  "gs:scitech:biotech-health",
  "Biotechnology, Health and Nanotechnology",
  "In biotechnology and health technology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Biotechnology",
      value: "The use of living organisms or their parts to make useful products",
    },
    {
      key: "Genetic engineering",
      value: "The deliberate modification of an organism's genetic material",
    },
    { key: "Recombinant DNA", value: "DNA formed by joining segments from different sources" },
    {
      key: "Bt cotton",
      value: "Cotton carrying a Bacillus thuringiensis gene that makes it resistant to bollworm",
    },
    {
      key: "Golden rice",
      value: "Rice engineered to produce beta carotene, a precursor of vitamin A",
    },
    {
      key: "Polymerase chain reaction",
      value: "A technique that makes millions of copies of a specific DNA segment",
    },
    {
      key: "Stem cell",
      value: "An unspecialised cell that can divide and differentiate into specialised cell types",
    },
    {
      key: "Vaccine",
      value:
        "A preparation that stimulates the immune system to build protection against a disease",
    },
    {
      key: "mRNA vaccine",
      value: "A vaccine that delivers messenger RNA so that cells make the antigen themselves",
    },
    {
      key: "Nanotechnology",
      value: "The manipulation of matter at a scale of one to one hundred nanometres",
    },
  ],
  [
    {
      key: "CRISPR Cas9",
      value: "A precise gene editing tool adapted from a bacterial defence system",
    },
    {
      key: "Gene therapy",
      value: "Treating a disorder by inserting a correct gene into the patient's cells",
    },
    {
      key: "Cloning",
      value: "Producing a genetically identical copy of an organism, as with Dolly the sheep",
    },
    {
      key: "Difference between a DNA vaccine and a conventional vaccine",
      value:
        "A DNA vaccine supplies genetic instructions while a conventional vaccine supplies the antigen itself",
    },
    {
      key: "Biofortification",
      value: "Breeding or engineering crops to raise their vitamin and mineral content",
    },
  ],
);

/* =================================================== General Science === */

gsci(
  "gs:sci:human-body",
  "Human Body, Nutrition and Diseases",
  "In general science, what is %s?",
  "%k is %v.",
  [
    { key: "Largest organ of the human body", value: "The skin" },
    { key: "Largest gland in the human body", value: "The liver" },
    { key: "Universal donor blood group", value: "O negative" },
    { key: "Universal recipient blood group", value: "AB positive" },
    {
      key: "Normal human body temperature",
      value: "About 37 degrees Celsius or 98.6 degrees Fahrenheit",
    },
    { key: "Vitamin whose deficiency causes night blindness", value: "Vitamin A" },
    { key: "Vitamin whose deficiency causes rickets", value: "Vitamin D" },
    { key: "Deficiency disease caused by lack of iodine", value: "Goitre" },
    { key: "Hormone that regulates blood sugar", value: "Insulin, secreted by the pancreas" },
    { key: "Disease caused by the female Anopheles mosquito", value: "Malaria" },
  ],
  [
    {
      key: "Reason vitamin C deficiency causes bleeding gums",
      value:
        "Vitamin C is needed to make collagen, which holds connective tissue and blood vessel walls together",
    },
    {
      key: "Function of haemoglobin",
      value: "It binds oxygen in the lungs and releases it in the tissues",
    },
    {
      key: "Master gland of the body",
      value: "The pituitary gland, which controls the other endocrine glands",
    },
    {
      key: "Difference between a communicable and a non communicable disease",
      value:
        "A communicable disease spreads from person to person while a non communicable one does not",
    },
    { key: "Cause of beriberi", value: "Deficiency of vitamin B1 or thiamine" },
  ],
);

gsci(
  "gs:sci:everyday-physics",
  "Everyday Physics and Chemistry",
  "In everyday science, what is %s?",
  "%k is %v.",
  [
    { key: "Instrument used to measure atmospheric pressure", value: "The barometer" },
    { key: "Instrument used to measure humidity", value: "The hygrometer" },
    {
      key: "Device that converts electrical energy to mechanical energy",
      value: "The electric motor",
    },
    {
      key: "Device that converts mechanical energy to electrical energy",
      value: "The generator or dynamo",
    },
    {
      key: "Reason a swimming pool looks shallower than it is",
      value: "Refraction of light as it passes from water into air",
    },
    {
      key: "Gas used in electric bulbs",
      value: "Argon or nitrogen, to prevent oxidation of the filament",
    },
    { key: "Chemical name of common salt", value: "Sodium chloride" },
    { key: "Chemical name of baking soda", value: "Sodium bicarbonate" },
    { key: "Acid present in the stomach", value: "Hydrochloric acid" },
    { key: "Gas responsible for the smell of a rotten egg", value: "Hydrogen sulphide" },
  ],
  [
    {
      key: "Reason a pressure cooker cooks faster",
      value:
        "Higher pressure raises the boiling point of water, so food cooks at a higher temperature",
    },
    {
      key: "Reason ice floats on water",
      value: "Ice has an open cage structure and so is less dense than liquid water",
    },
    {
      key: "Reason a mirage is seen on a hot road",
      value: "Total internal reflection of light in air layers of different density",
    },
    {
      key: "Working principle of a fuse",
      value:
        "A wire of low melting point melts and breaks the circuit when the current exceeds a safe value",
    },
    {
      key: "Reason detergents work better than soap in hard water",
      value: "Their calcium and magnesium salts are soluble, so no scum is formed",
    },
  ],
);

/* =================================================== World Geography === */

wgeo(
  "gs:wgeo:continents",
  "Continents, Countries and Boundaries",
  "In world geography, what is %s?",
  "%k is %v.",
  [
    { key: "Largest continent by area", value: "Asia" },
    { key: "Smallest continent by area", value: "Australia" },
    { key: "Largest country by area", value: "Russia" },
    { key: "Smallest country by area", value: "Vatican City" },
    { key: "Country with the longest coastline", value: "Canada" },
    { key: "Line dividing India and Pakistan", value: "The Radcliffe Line" },
    { key: "Line dividing India and China", value: "The McMahon Line" },
    { key: "Line dividing North and South Korea", value: "The 38th parallel" },
    { key: "Continent known as the Dark Continent", value: "Africa" },
    { key: "Strait separating Asia from North America", value: "The Bering Strait" },
  ],
  [
    { key: "Durand Line", value: "The boundary between Pakistan and Afghanistan" },
    { key: "Hindenburg Line", value: "The boundary between Germany and Poland" },
    { key: "Maginot Line", value: "The fortified boundary between France and Germany" },
    { key: "Country called the Land of the Midnight Sun", value: "Norway" },
    {
      key: "Reason the Prime Meridian passes through Greenwich",
      value: "It was fixed by international agreement in 1884 as the zero of longitude",
    },
  ],
);

wgeo(
  "gs:wgeo:rivers-mountains",
  "World Rivers, Mountains and Deserts",
  "In world physical geography, what is %s?",
  "%k is %v.",
  [
    { key: "Longest river in the world", value: "The Nile" },
    { key: "Largest river by volume of water", value: "The Amazon" },
    { key: "Highest mountain peak in the world", value: "Mount Everest, at 8 848.86 metres" },
    { key: "Longest mountain range on land", value: "The Andes in South America" },
    { key: "Largest hot desert in the world", value: "The Sahara" },
    { key: "Largest cold desert in the world", value: "Antarctica" },
    { key: "Deepest ocean trench", value: "The Mariana Trench in the Pacific Ocean" },
    { key: "Largest ocean", value: "The Pacific Ocean" },
    { key: "Largest freshwater lake by area", value: "Lake Superior" },
    { key: "Deepest lake in the world", value: "Lake Baikal in Russia" },
  ],
  [
    { key: "River that crosses the equator twice", value: "The Congo" },
    { key: "Highest waterfall in the world", value: "Angel Falls in Venezuela" },
    { key: "Sea with the highest salinity", value: "The Dead Sea" },
    {
      key: "Reason the Amazon carries the most water",
      value:
        "It drains the largest basin, which lies in the equatorial belt of very heavy rainfall",
    },
    {
      key: "Great Barrier Reef location",
      value: "Off the north east coast of Queensland, Australia",
    },
  ],
);

pgeo(
  "gs:pgeo:atmosphere",
  "Atmosphere, Winds and Climate",
  "In physical geography, what is %s?",
  "%k is %v.",
  [
    { key: "Troposphere", value: "The lowest layer of the atmosphere, where all weather occurs" },
    {
      key: "Stratosphere",
      value: "The layer above the troposphere, which contains the ozone layer",
    },
    { key: "Ionosphere", value: "The layer that reflects radio waves back to the earth" },
    {
      key: "Trade winds",
      value: "The steady winds blowing from the subtropical highs towards the equator",
    },
    {
      key: "Westerlies",
      value: "The winds blowing from the subtropical highs towards the temperate lows",
    },
    { key: "Doldrums", value: "The equatorial belt of calm and light variable winds" },
    {
      key: "Monsoon",
      value: "A seasonal reversal of wind direction caused by differential heating of land and sea",
    },
    { key: "Cyclone", value: "A system of low pressure with winds spiralling inward" },
    { key: "Anticyclone", value: "A system of high pressure with winds spiralling outward" },
    { key: "Isobar", value: "A line on a map joining places of equal atmospheric pressure" },
  ],
  [
    {
      key: "Coriolis force",
      value:
        "The deflecting force caused by the earth's rotation, to the right in the northern hemisphere",
    },
    {
      key: "Reason temperature falls with height in the troposphere",
      value:
        "Air is heated mainly from the earth's surface, and density and water vapour both decrease upward",
    },
    {
      key: "El Nino",
      value: "The periodic warming of the eastern Pacific that weakens the Indian monsoon",
    },
    {
      key: "La Nina",
      value:
        "The periodic cooling of the eastern Pacific, usually associated with a good Indian monsoon",
    },
    {
      key: "Jet stream",
      value:
        "A narrow band of very fast winds in the upper troposphere that steers weather systems",
    },
  ],
);

/* ==================================================== Art and Culture == */

culture(
  "gs:culture:dance-music",
  "Classical Dance, Music and Theatre",
  "In Indian culture, what is %s?",
  "%k is %v.",
  [
    { key: "Bharatanatyam", value: "The classical dance of Tamil Nadu" },
    {
      key: "Kathak",
      value: "The classical dance of Uttar Pradesh, the only one with strong Persian influence",
    },
    { key: "Kathakali", value: "The classical dance drama of Kerala, known for elaborate make up" },
    { key: "Odissi", value: "The classical dance of Odisha, marked by the tribhanga posture" },
    { key: "Kuchipudi", value: "The classical dance of Andhra Pradesh" },
    { key: "Manipuri", value: "The classical dance of Manipur, associated with the Raas Leela" },
    { key: "Mohiniyattam", value: "The classical solo dance of Kerala performed by women" },
    {
      key: "Sattriya",
      value: "The classical dance of Assam, developed in the Vaishnava monasteries",
    },
    {
      key: "Natya Shastra",
      value: "Bharata Muni's ancient treatise on dramaturgy and performance",
    },
    {
      key: "Two main schools of Indian classical music",
      value: "Hindustani in the north and Carnatic in the south",
    },
  ],
  [
    {
      key: "Difference between Hindustani and Carnatic music",
      value:
        "Hindustani emphasises improvisation within a raga while Carnatic is largely composition based",
    },
    {
      key: "Dhrupad",
      value: "The oldest surviving form of Hindustani vocal music, austere and meditative",
    },
    { key: "Yakshagana", value: "The folk theatre form of coastal Karnataka" },
    {
      key: "Koodiyattam",
      value: "The Sanskrit theatre of Kerala recognised by UNESCO as intangible heritage",
    },
    { key: "Tala", value: "The rhythmic cycle that organises time in Indian classical music" },
  ],
);

culture(
  "gs:culture:architecture",
  "Architecture, Painting and Heritage Sites",
  "In Indian art and heritage, what is %s?",
  "%k is %v.",
  [
    { key: "Nagara style", value: "The north Indian temple style with a curvilinear shikhara" },
    {
      key: "Dravida style",
      value: "The south Indian temple style with a pyramidal vimana and a gopuram gateway",
    },
    {
      key: "Vesara style",
      value: "The hybrid Deccan temple style combining Nagara and Dravida features",
    },
    {
      key: "Ajanta caves",
      value: "The Buddhist rock cut caves in Maharashtra famous for their murals",
    },
    {
      key: "Ellora caves",
      value: "The rock cut caves in Maharashtra with Buddhist, Hindu and Jain shrines together",
    },
    {
      key: "Khajuraho temples",
      value: "The Chandela temples in Madhya Pradesh known for their sculpture",
    },
    {
      key: "Konark Sun Temple",
      value: "The thirteenth century temple in Odisha shaped like a chariot",
    },
    { key: "Sanchi Stupa", value: "The Buddhist stupa in Madhya Pradesh begun under Ashoka" },
    { key: "Madhubani painting", value: "The folk painting tradition of Mithila in Bihar" },
    {
      key: "Warli painting",
      value: "The tribal painting tradition of Maharashtra using simple white geometric figures",
    },
  ],
  [
    {
      key: "Gandhara school of art",
      value: "The Buddhist sculpture school of the north west showing strong Greco Roman influence",
    },
    {
      key: "Mathura school of art",
      value: "The indigenous sculpture school using spotted red sandstone",
    },
    {
      key: "Indo Islamic architectural feature",
      value: "The true arch and the dome, introduced in place of the trabeate system",
    },
    {
      key: "Charbagh",
      value: "The four part Persian garden plan used at Humayun's Tomb and the Taj Mahal",
    },
    {
      key: "Pattachitra",
      value: "The cloth based scroll painting tradition of Odisha and West Bengal",
    },
  ],
);

/* ======================================================== History ====== */

anc(
  "gs:anc:vedic",
  "Vedic Period and Later Vedic Society",
  "About the Vedic age, what is %s?",
  "%k is %v.",
  [
    { key: "Oldest Veda", value: "The Rigveda" },
    { key: "Number of Vedas", value: "Four: Rigveda, Samaveda, Yajurveda and Atharvaveda" },
    { key: "Veda dealing with music", value: "The Samaveda" },
    { key: "Veda dealing with sacrificial formulae", value: "The Yajurveda" },
    { key: "Gayatri Mantra source", value: "The Rigveda, addressed to the solar deity Savitri" },
    { key: "Most mentioned river in the Rigveda", value: "The Sindhu" },
    { key: "Most revered river in the Rigveda", value: "The Saraswati" },
    { key: "Chief deity of the Rigveda by number of hymns", value: "Indra" },
    { key: "Sabha and Samiti", value: "The two tribal assemblies of the Vedic polity" },
    { key: "Satyameva Jayate source", value: "The Mundaka Upanishad" },
  ],
  [
    {
      key: "Change in the position of women in the later Vedic period",
      value:
        "Their status declined; they lost the right to attend assemblies and to perform sacrifices independently",
    },
    {
      key: "Varna system in the later Vedic period",
      value: "It hardened from an occupational division into a birth based hierarchy",
    },
    {
      key: "Purusha Sukta",
      value:
        "The hymn in the tenth mandala of the Rigveda describing the fourfold division of society",
    },
    {
      key: "Economy of the later Vedic period",
      value: "It shifted from pastoralism to settled agriculture with iron tools",
    },
    {
      key: "Ashrama system",
      value: "The four stages of life: brahmacharya, grihastha, vanaprastha and sannyasa",
    },
  ],
);

med(
  "gs:med:bhakti-sufi",
  "Bhakti and Sufi Movements",
  "In the Bhakti and Sufi movements, who or what is %s?",
  "%k is %v.",
  [
    {
      key: "Kabir",
      value: "The nirguna saint poet whose verses attacked ritual and caste in both religions",
    },
    {
      key: "Guru Nanak Dev Ji",
      value: "The founder of Sikhism, who preached one God, honest work and sharing",
    },
    { key: "Mirabai", value: "The Rajput saint poetess devoted to Krishna" },
    { key: "Tulsidas", value: "The author of the Ramcharitmanas in Awadhi" },
    { key: "Surdas", value: "The blind poet of Krishna devotion, author of the Sursagar" },
    {
      key: "Chaitanya Mahaprabhu",
      value: "The Bengal saint who spread Krishna devotion through kirtan",
    },
    { key: "Ramanuja", value: "The exponent of Vishishtadvaita or qualified non dualism" },
    {
      key: "Moinuddin Chishti",
      value: "The Sufi saint of the Chishti order whose dargah is at Ajmer",
    },
    { key: "Nizamuddin Auliya", value: "The Chishti Sufi saint of Delhi" },
    {
      key: "Amir Khusrau",
      value:
        "The poet and musician, disciple of Nizamuddin Auliya, credited with developing the qawwali",
    },
  ],
  [
    {
      key: "Difference between saguna and nirguna Bhakti",
      value:
        "Saguna worships God with form and attributes while nirguna worships the formless absolute",
    },
    {
      key: "Central Sufi concept of wahdat al wujud",
      value: "The unity of being, the doctrine that all existence is one with God",
    },
    {
      key: "Contribution of the Bhakti movement to language",
      value:
        "Saints composed in the regional languages, which enriched Hindi, Punjabi, Marathi, Bengali and Tamil",
    },
    {
      key: "Silsila",
      value:
        "A Sufi order or chain of spiritual succession, such as Chishti, Suhrawardi, Qadiri and Naqshbandi",
    },
    {
      key: "Social impact of the Bhakti movement",
      value: "It weakened caste rigidity and ritualism and made devotion accessible to all",
    },
  ],
);

mod(
  "gs:mod:reform",
  "Socio-Religious Reform Movements",
  "In the nineteenth century reform movements, who or what is %s?",
  "%k is %v.",
  [
    {
      key: "Raja Ram Mohan Roy",
      value: "The founder of the Brahmo Samaj and the leading campaigner against sati",
    },
    { key: "Year sati was abolished", value: "1829, by Lord William Bentinck" },
    {
      key: "Ishwar Chandra Vidyasagar",
      value: "The reformer whose efforts led to the Widow Remarriage Act of 1856",
    },
    {
      key: "Dayanand Saraswati",
      value: "The founder of the Arya Samaj, who gave the call to go back to the Vedas",
    },
    { key: "Satyarth Prakash", value: "The principal work of Dayanand Saraswati" },
    {
      key: "Jyotiba Phule",
      value:
        "The founder of the Satyashodhak Samaj, who worked for the lower castes and for women's education",
    },
    {
      key: "Swami Vivekananda",
      value: "The disciple of Ramakrishna who founded the Ramakrishna Mission",
    },
    {
      key: "Sir Syed Ahmed Khan",
      value:
        "The founder of the Aligarh Movement and of the college that became Aligarh Muslim University",
    },
    {
      key: "Annie Besant",
      value:
        "The Theosophical Society leader who founded the Central Hindu College and led the Home Rule League",
    },
    {
      key: "Prarthana Samaj",
      value: "The Bombay reform society associated with M. G. Ranade and Atmaram Pandurang",
    },
  ],
  [
    {
      key: "Common feature of the reform movements",
      value:
        "They used reason and appeals to ancient texts to attack ritualism, caste rigidity and the subordination of women",
    },
    {
      key: "Difference between the Brahmo Samaj and the Arya Samaj",
      value:
        "The Brahmo Samaj rejected Vedic infallibility and idol worship while the Arya Samaj upheld the Vedas as the final authority",
    },
    {
      key: "Young Bengal Movement",
      value: "The radical movement led by Henry Vivian Derozio at Hindu College, Calcutta",
    },
    {
      key: "Shuddhi movement",
      value: "The Arya Samaj programme of reconverting people to Hinduism",
    },
    {
      key: "Age of Consent Act 1891",
      value:
        "The law raising the age of consent for girls, driven by the campaign of B. M. Malabari",
    },
  ],
);

/* ================================================== Environment ======== */

env(
  "gs:env:conservation",
  "Conservation, Protected Areas and Biodiversity",
  "In environmental conservation, what is %s?",
  "%k is %v.",
  [
    {
      key: "National park",
      value: "A strictly protected area where no human activity or grazing is allowed",
    },
    {
      key: "Wildlife sanctuary",
      value: "A protected area where certain regulated human activities may be permitted",
    },
    {
      key: "Biosphere reserve",
      value:
        "A large area with a core, a buffer and a transition zone, recognised under the UNESCO programme",
    },
    {
      key: "Project Tiger",
      value: "The conservation programme launched in 1973 to protect the tiger and its habitat",
    },
    {
      key: "Project Elephant",
      value: "The programme launched in 1992 to protect elephants and their corridors",
    },
    { key: "Jim Corbett National Park", value: "India's first national park, in Uttarakhand" },
    {
      key: "Kaziranga National Park",
      value: "The Assam park famous for the one horned rhinoceros",
    },
    {
      key: "Gir National Park",
      value: "The Gujarat park that is the only natural home of the Asiatic lion",
    },
    {
      key: "Ramsar Convention",
      value: "The international treaty for the conservation and wise use of wetlands",
    },
    {
      key: "Biodiversity hotspot",
      value:
        "A region with exceptional endemic species that is under serious threat of habitat loss",
    },
  ],
  [
    {
      key: "Biodiversity hotspots in India",
      value: "The Himalaya, the Western Ghats and Sri Lanka, the Indo Burma region and Sundaland",
    },
    {
      key: "In situ and ex situ conservation",
      value:
        "Protecting species in their natural habitat and protecting them outside it, as in zoos and seed banks",
    },
    {
      key: "IUCN Red List",
      value: "The global inventory classifying species by their risk of extinction",
    },
    {
      key: "Wildlife Protection Act 1972 Schedule I",
      value: "The schedule giving the highest degree of protection with the strictest penalties",
    },
    {
      key: "Montreal Protocol",
      value: "The 1987 treaty to phase out substances that deplete the ozone layer",
    },
  ],
);

/* ================================================ Indian Economy ======= */

eco(
  "gs:eco:planning-budget",
  "Planning, Budget and Fiscal Policy",
  "In the Indian economy, what is %s?",
  "%k is %v.",
  [
    {
      key: "NITI Aayog",
      value: "The policy think tank that replaced the Planning Commission in 2015",
    },
    {
      key: "First Five Year Plan focus",
      value: "Agriculture and irrigation, based on the Harrod Domar model",
    },
    { key: "Second Five Year Plan focus", value: "Heavy industry, based on the Mahalanobis model" },
    {
      key: "Union Budget article",
      value: "Article 112, which calls it the Annual Financial Statement",
    },
    { key: "Fiscal deficit", value: "Total expenditure minus total receipts excluding borrowings" },
    { key: "Revenue deficit", value: "Revenue expenditure minus revenue receipts" },
    { key: "Primary deficit", value: "Fiscal deficit minus interest payments" },
    { key: "Direct tax", value: "A tax whose burden cannot be shifted, such as income tax" },
    {
      key: "Indirect tax",
      value: "A tax whose burden can be shifted to the consumer, such as GST",
    },
    {
      key: "Finance Commission",
      value:
        "The body constituted under Article 280 to recommend the sharing of taxes between the Centre and the states",
    },
  ],
  [
    {
      key: "FRBM Act",
      value:
        "The Fiscal Responsibility and Budget Management Act of 2003, setting targets for deficit reduction",
    },
    {
      key: "Difference between the plan and the non plan classification",
      value: "It was discontinued from 2017 and replaced by a revenue and capital classification",
    },
    {
      key: "Consolidated Fund of India",
      value: "The fund under Article 266 into which all revenues and loans of the government flow",
    },
    {
      key: "Contingency Fund of India",
      value:
        "The fund under Article 267 placed at the disposal of the President for unforeseen expenditure",
    },
    {
      key: "Crowding out effect",
      value: "Heavy government borrowing raises interest rates and reduces private investment",
    },
  ],
);

export const TEACHING_GS_FULL_TEMPLATES = templates;
