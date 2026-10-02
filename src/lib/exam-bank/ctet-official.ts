/**
 * CTET syllabus, taken from the official Information Bulletin.
 *
 * Source: Central Board of Secondary Education, CTET February 2026
 * Information Bulletin, Appendix-I "Structure and Content of Syllabus
 * (Paper I and Paper II)", published on the CTET portal.
 *
 * Official structure, reproduced here so the chapter split can be checked:
 *
 *   Paper I  (classes I-V)   150 MCQ / 150 marks / 2.5 hours, no negative marking
 *     Child Development and Pedagogy 30  (child development 15, inclusive
 *       education 5, learning and pedagogy 10)
 *     Mathematics 30                     (content 15, pedagogy 15)
 *     Environmental Studies 30           (content 15, pedagogy 15)
 *     Language I 30                      (comprehension 15, pedagogy 15)
 *     Language II 30                     (comprehension 15, pedagogy 15)
 *
 *   Paper II (classes VI-VIII) 150 MCQ / 150 marks / 2.5 hours
 *     Child Development and Pedagogy 30
 *     Mathematics and Science 60         (maths 30, science 30; each content
 *       20 and pedagogy 10)   OR   Social Studies / Social Science 60
 *       (content 40, pedagogy 20)
 *     Language I 30, Language II 30
 *
 * Pass mark is 60 per cent, as laid down by NCTE notification
 * No. 76-4/2010/NCTE/Acad dated 11.02.2011.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

/**
 * Central TET and the state TETs that follow the same NCTE structure.
 *
 * PSTET is included because the Punjab State Council of Educational Research
 * and Training sets the identical NCTE structure: Paper I is Child
 * Development and Pedagogy 30, Language I 30, Language II 30, Mathematics 30
 * and Environmental Studies 30; Paper II is Child Development and Pedagogy
 * 30, Language I 30, Language II 30 and Mathematics and Science 60 or Social
 * Studies 60. Both papers are 150 MCQ for 150 marks over two and a half
 * hours, one mark each and no negative marking, and 60 per cent qualifies
 * (55 per cent for SC, ST, OBC and differently abled candidates).
 *
 * The one real difference is the languages. CTET lets a candidate pick any
 * two of twenty languages. PSTET fixes Language I as Punjabi and Language II
 * as English, and draws its content from the Punjab State and SCERT syllabus
 * for classes I-V and VI-VIII rather than the NCERT one.
 */
const TET = ["CTET", "PSTET", "PSTET/CTET", "State Teacher/TET", "UPTET", "HTET"];

const templates: Template[] = [];
const tet = chapterFactory(templates, "Teaching Aptitude", TET);

/* ===================== I. Child Development and Pedagogy, 30 marks ===== */

tet(
  "ct:development-principles",
  "Child Development: Concept and Principles",
  "In child development, what is %s?",
  "%k is %v.",
  [
    {
      key: "Development",
      value:
        "The progressive series of orderly and coherent changes that go on from conception to maturity",
    },
    {
      key: "Growth as distinct from development",
      value:
        "The quantitative increase in size and weight, which stops at maturity, while development is qualitative and continues through life",
    },
    {
      key: "Principle of continuity",
      value: "Development is a continuous process that goes on from conception until death",
    },
    {
      key: "Principle of individual differences",
      value: "Every child develops at his or her own rate, so no two children are alike",
    },
    {
      key: "Cephalocaudal principle",
      value: "Development proceeds from the head downwards to the feet",
    },
    {
      key: "Proximodistal principle",
      value: "Development proceeds from the centre of the body outwards to the limbs",
    },
    {
      key: "Principle of integration",
      value:
        "The child first moves the whole body, then specific parts, and then integrates the two",
    },
    {
      key: "Critical period",
      value: "A limited span in which a particular skill or ability develops best",
    },
    {
      key: "Maturation",
      value:
        "The unfolding of traits that are potentially present in the individual, governed by heredity",
    },
    {
      key: "Relationship of development with learning",
      value:
        "Development sets the readiness for learning, and learning in turn drives further development",
    },
  ],
  [
    {
      key: "Reason development is called cumulative",
      value:
        "Each stage builds on the one before it, so an early deficit is carried forward unless it is addressed",
    },
    {
      key: "Difference between the general to specific principle and integration",
      value:
        "General to specific says a child makes gross responses before refined ones, integration says the child then learns to combine the refined parts into a whole",
    },
    {
      key: "Implication of individual differences for a teacher",
      value:
        "Instruction, pace and assessment have to be varied, because a single method cannot suit every child in the class",
    },
    {
      key: "Predictability of development",
      value:
        "The sequence of development is predictable, but the rate is not, so milestones come in a fixed order at differing ages",
    },
    {
      key: "Interaction of nature and nurture",
      value:
        "Heredity sets the limits of what is possible and the environment decides how far within those limits the child actually goes",
    },
  ],
);

tet(
  "ct:heredity-socialization",
  "Heredity, Environment and Socialization",
  "In the study of heredity and socialization, what is %s?",
  "%k is %v.",
  [
    {
      key: "Heredity",
      value: "The transmission of traits from parents to offspring through genes",
    },
    {
      key: "Environment in child development",
      value: "The sum of all external forces, physical, social and cultural, that act on the child",
    },
    {
      key: "Socialization",
      value: "The process by which a child learns the ways, norms and values of the society",
    },
    { key: "Primary agency of socialization", value: "The family" },
    {
      key: "Secondary agencies of socialization",
      value: "The school, the peer group, the neighbourhood and the media",
    },
    {
      key: "Role of the peer group",
      value:
        "It gives the child a status independent of the family and teaches cooperation, competition and give and take",
    },
    {
      key: "Role of the teacher in socialization",
      value: "The teacher acts as a model, a guide and a source of values beyond the home",
    },
    {
      key: "Authoritative parenting",
      value:
        "Parenting that is warm and responsive but sets firm and reasoned limits, linked to the best child outcomes",
    },
    {
      key: "Authoritarian parenting",
      value: "Parenting that is demanding and controlling with little warmth or explanation",
    },
    {
      key: "Permissive parenting",
      value: "Parenting that is warm but places few demands and sets few limits",
    },
  ],
  [
    {
      key: "Present view of the nature versus nurture debate",
      value:
        "It is no longer seen as opposition, since heredity and environment interact continuously and neither works alone",
    },
    {
      key: "Evidence used to separate heredity from environment",
      value:
        "Studies of identical twins raised apart and of adopted children compared with both sets of parents",
    },
    {
      key: "Socialization as a two-way process",
      value:
        "The child is not a passive receiver, the child also acts on and changes the people who socialize him or her",
    },
    {
      key: "Effect of the school's hidden curriculum",
      value:
        "Values and attitudes are transmitted through routines, rules and teacher behaviour rather than through the stated syllabus",
    },
    {
      key: "Implication for a teacher of a child from a deprived background",
      value:
        "The teacher must enrich the environment rather than lower expectations, because the deficit is in opportunity and not in capacity",
    },
  ],
);

tet(
  "ct:piaget-kohlberg-vygotsky",
  "Piaget, Kohlberg and Vygotsky",
  "In the theories of child development, what is %s?",
  "%k is %v.",
  [
    {
      key: "Piaget's sensorimotor stage",
      value:
        "Birth to two years, when the child knows the world through the senses and actions and gains object permanence",
    },
    {
      key: "Piaget's preoperational stage",
      value:
        "Two to seven years, marked by symbolic thought, egocentrism and the absence of conservation",
    },
    {
      key: "Piaget's concrete operational stage",
      value:
        "Seven to eleven years, when the child can reason logically about concrete objects and gains conservation and reversibility",
    },
    {
      key: "Piaget's formal operational stage",
      value: "Eleven years onwards, when abstract and hypothetical reasoning becomes possible",
    },
    { key: "Assimilation", value: "Fitting new experience into an existing mental structure" },
    {
      key: "Accommodation",
      value: "Changing an existing mental structure to take in new experience",
    },
    {
      key: "Vygotsky's zone of proximal development",
      value:
        "The gap between what a child can do alone and what the child can do with guidance from a more able person",
    },
    {
      key: "Scaffolding",
      value:
        "The temporary support a teacher or peer gives, which is withdrawn as the learner becomes able",
    },
    {
      key: "Kohlberg's preconventional level",
      value: "Morality judged by punishment and by personal benefit",
    },
    {
      key: "Kohlberg's postconventional level",
      value: "Morality judged by the social contract and by universal ethical principles",
    },
  ],
  [
    {
      key: "Central difference between Piaget and Vygotsky",
      value:
        "Piaget held that development leads learning and the child constructs knowledge alone, Vygotsky held that social interaction and language lead development",
    },
    {
      key: "Egocentrism in Piaget's sense",
      value:
        "The inability to take another person's point of view, which is a cognitive limitation and not selfishness",
    },
    {
      key: "Conservation and the age it appears",
      value:
        "The understanding that quantity does not change when appearance changes, which appears in the concrete operational stage",
    },
    {
      key: "Vygotsky's view of private speech",
      value:
        "Self-talk is not immature egocentric speech as Piaget thought, it is a tool of self-guidance that later becomes inner speech",
    },
    {
      key: "Criticism of Kohlberg's theory",
      value:
        "Gilligan argued that it is based on male samples and undervalues the morality of care and relationship shown by girls",
    },
  ],
);

tet(
  "ct:inclusive-education",
  "Inclusive Education and Children with Special Needs",
  "In inclusive education, what is %s?",
  "%k is %v.",
  [
    {
      key: "Inclusive education",
      value:
        "Educating all children, including those with disabilities, together in the regular classroom with the support they need",
    },
    {
      key: "Integration as distinct from inclusion",
      value:
        "Integration places the child in the regular school and expects the child to adjust, inclusion changes the school to suit the child",
    },
    {
      key: "Dyslexia",
      value: "A specific learning disability affecting reading and the decoding of words",
    },
    {
      key: "Dyscalculia",
      value: "A specific learning disability affecting number sense and arithmetic",
    },
    {
      key: "Dysgraphia",
      value: "A specific learning disability affecting handwriting and written expression",
    },
    {
      key: "Act that governs the rights of persons with disabilities in India",
      value: "The Rights of Persons with Disabilities Act, 2016",
    },
    { key: "Number of disabilities recognised by the RPWD Act 2016", value: "Twenty one" },
    {
      key: "Gifted learner",
      value:
        "A learner of markedly high ability who needs enrichment and acceleration rather than repetition",
    },
    {
      key: "Individualised Education Programme",
      value:
        "A written plan of goals and support drawn up for a particular child with special needs",
    },
    {
      key: "Barrier-free environment",
      value:
        "A physical and social setting in which ramps, signage and attitudes allow a disabled child full participation",
    },
  ],
  [
    {
      key: "Reason labelling a child is discouraged",
      value:
        "A label becomes a self-fulfilling prophecy, lowers teacher expectation and shifts attention from the child's needs to the category",
    },
    {
      key: "Difference between impairment, disability and handicap",
      value:
        "Impairment is the loss of a structure or function, disability is the resulting restriction of activity, handicap is the social disadvantage that follows",
    },
    {
      key: "Appropriate teacher response to a child with dyslexia",
      value:
        "Give extra time, allow oral responses, use multisensory methods and assess understanding rather than penalise spelling",
    },
    {
      key: "Enrichment as against acceleration for a gifted child",
      value:
        "Enrichment deepens learning at the same grade, acceleration moves the child to a higher grade, and enrichment is usually preferred for social reasons",
    },
    {
      key: "Meaning of the least restrictive environment",
      value:
        "A child with special needs should be educated with peers without disabilities to the greatest extent that is appropriate",
    },
  ],
);

tet(
  "ct:learning-pedagogy",
  "Learning and Pedagogy: How Children Think and Learn",
  "In learning and pedagogy, what is %s?",
  "%k is %v.",
  [
    {
      key: "Learning",
      value: "A relatively permanent change in behaviour that comes about through experience",
    },
    {
      key: "Constructivism",
      value:
        "The view that the learner actively builds knowledge rather than receiving it ready-made",
    },
    {
      key: "Child-centred education",
      value:
        "Education planned around the interests, needs and pace of the child rather than the convenience of the teacher",
    },
    {
      key: "Discovery learning",
      value:
        "Learning in which the child arrives at the principle himself through exploration, associated with Bruner",
    },
    {
      key: "Meaning of a child as a problem solver",
      value:
        "The view that a child actively forms and tests ideas about the world rather than absorbing facts",
    },
    {
      key: "Significance of a child's errors",
      value:
        "Errors reveal the child's current thinking and are a meaningful step in learning, not a failure to be punished",
    },
    {
      key: "Trial and error learning",
      value:
        "Thorndike's account of learning by repeated attempts in which successful responses are stamped in",
    },
    {
      key: "Insightful learning",
      value:
        "Sudden grasp of the relationship in a problem, demonstrated by Kohler with chimpanzees",
    },
    {
      key: "Intrinsic motivation",
      value: "Motivation that comes from interest and satisfaction in the task itself",
    },
    {
      key: "Extrinsic motivation",
      value: "Motivation that comes from an outside reward or the avoidance of punishment",
    },
  ],
  [
    {
      key: "Reason learning is called a social activity",
      value:
        "Knowledge is built in interaction with teachers and peers, and language mediates that interaction, as Vygotsky argued",
    },
    {
      key: "Difference between rote learning and meaningful learning",
      value:
        "Rote learning stores information without linking it to what is known, meaningful learning connects new material to existing structures and is retained far longer",
    },
    {
      key: "Appropriate use of a child's alternative conception",
      value:
        "The teacher should surface it, create a situation that conflicts with it, and let the child reconstruct, rather than simply declaring it wrong",
    },
    {
      key: "Effect of over-reliance on extrinsic reward",
      value:
        "It can undermine intrinsic motivation, so that the child works only when the reward is present",
    },
    {
      key: "Factors contributing to learning",
      value:
        "Personal factors such as maturation, motivation and health, and environmental factors such as the teacher, the material and the climate of the classroom",
    },
  ],
);

tet(
  "ct:assessment-cce",
  "Assessment for Learning and Continuous Comprehensive Evaluation",
  "In classroom assessment, what is %s?",
  "%k is %v.",
  [
    {
      key: "Assessment for learning",
      value:
        "Assessment used during teaching to guide the next step, also called formative assessment",
    },
    {
      key: "Assessment of learning",
      value:
        "Assessment used at the end to judge and certify achievement, also called summative assessment",
    },
    {
      key: "Continuous and Comprehensive Evaluation",
      value:
        "A school-based system that assesses all aspects of a child's growth regularly through the year",
    },
    {
      key: "Meaning of comprehensive in CCE",
      value: "It covers both scholastic and co-scholastic areas of the child's development",
    },
    {
      key: "Meaning of continuous in CCE",
      value:
        "Assessment is spread through the year rather than concentrated in a final examination",
    },
    {
      key: "Diagnostic test",
      value: "A test used to locate the specific difficulty a learner is facing",
    },
    {
      key: "Remedial teaching",
      value: "Teaching planned to remove a specific difficulty found by a diagnostic test",
    },
    {
      key: "Portfolio assessment",
      value: "Judging a learner from a purposeful collection of his or her work gathered over time",
    },
    {
      key: "Rubric",
      value: "A stated set of criteria and levels against which a piece of work is judged",
    },
    {
      key: "Open-ended question",
      value:
        "A question that admits more than one acceptable answer and reveals the learner's reasoning",
    },
  ],
  [
    {
      key: "Reason grading is preferred to marking in CCE",
      value:
        "Grades reduce unhealthy comparison over small mark differences and shift attention from ranking to the learner's own progress",
    },
    {
      key: "Difference between evaluation and measurement",
      value:
        "Measurement assigns a number to performance, evaluation places a value judgement on it against an objective",
    },
    {
      key: "Purpose of formulating questions to assess readiness",
      value:
        "To find what the learner already knows so that teaching can begin from there rather than from the textbook",
    },
    {
      key: "Weakness of relying only on a written test",
      value:
        "It samples a narrow band of ability, favours literate expression and misses skills, attitudes and practical understanding",
    },
    {
      key: "Way a teacher should use assessment data",
      value:
        "To alter his or her own teaching, because assessment that does not change instruction has no formative value",
    },
  ],
);

/* ===================== II. Mathematics, Paper I content and pedagogy ==== */

tet(
  "ct:maths-primary-content",
  "Primary Mathematics Content for Paper I",
  "In the CTET Paper I mathematics content, what is %s?",
  "%k is %v.",
  [
    {
      key: "Shapes and spatial understanding",
      value: "Recognising shapes and describing position, direction and distance in space",
    },
    {
      key: "Solids around us",
      value:
        "The three dimensional shapes of everyday objects, such as the cube, cuboid, cylinder, cone and sphere",
    },
    {
      key: "Place value",
      value: "The value a digit takes from the position it occupies in a numeral",
    },
    { key: "Standard unit of length in the metric system", value: "The metre" },
    { key: "Standard unit of mass in the metric system", value: "The kilogram" },
    { key: "Perimeter", value: "The total length of the boundary of a closed figure" },
    { key: "Area", value: "The measure of the surface enclosed by a closed figure" },
    {
      key: "Pictograph",
      value: "A representation of data using pictures or symbols to stand for a number of items",
    },
    {
      key: "Pattern in primary mathematics",
      value: "A rule-governed arrangement of numbers, shapes or objects that repeats or grows",
    },
    {
      key: "Topics of the money strand",
      value: "Recognising currency, making amounts, and simple problems of buying, change and rate",
    },
  ],
  [
    {
      key: "Order in which a child should meet a new mathematical idea",
      value:
        "Concrete objects first, then pictorial representation, then the abstract symbol, the concrete to abstract sequence",
    },
    {
      key: "Reason division is taught after multiplication",
      value:
        "Division is understood as the inverse of multiplication and as repeated subtraction, so the earlier operation must be secure first",
    },
    {
      key: "Difference between measurement using a non-standard and a standard unit",
      value:
        "A non-standard unit such as a handspan varies from person to person, which is exactly why the need for a standard unit is felt",
    },
    {
      key: "Meaning of spatial understanding for a young child",
      value:
        "Grasping relations such as inside and outside, near and far, and left and right, which underlie later formal geometry",
    },
    {
      key: "Use of data handling at the primary stage",
      value:
        "Children collect, sort and display real information from their own surroundings, which gives a purpose to counting and comparison",
    },
  ],
);

tet(
  "ct:maths-pedagogy-official",
  "Pedagogical Issues in Teaching Mathematics",
  "In the pedagogy of mathematics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Nature of mathematics",
      value:
        "A study of patterns and relationships expressed in an exact and abstract language, built on logical reasoning",
    },
    {
      key: "Place of mathematics in the curriculum",
      value:
        "It develops the child's power of reasoning and abstraction, and is therefore treated as a core subject",
    },
    {
      key: "Community mathematics",
      value:
        "The mathematics children meet in daily life outside school, in the market, the kitchen and the field",
    },
    {
      key: "Language of mathematics",
      value:
        "The terms, symbols and forms of statement that a learner must acquire to think and communicate mathematically",
    },
    {
      key: "Error analysis",
      value:
        "The study of a learner's wrong answers to find the faulty rule the learner is applying",
    },
    {
      key: "Formal method of evaluation",
      value: "Planned tests and examinations conducted under set conditions",
    },
    {
      key: "Informal method of evaluation",
      value: "Observation, oral questioning and the study of classwork carried on while teaching",
    },
    {
      key: "Diagnostic teaching",
      value:
        "Teaching that first identifies the exact point of a learner's difficulty before remedy is attempted",
    },
    {
      key: "Chief aim of mathematics teaching at the elementary stage",
      value:
        "To mathematise the child's thought process rather than to produce speed in computation",
    },
    {
      key: "Common problem in teaching mathematics",
      value: "Mathematics anxiety and the belief that the subject is only for a talented few",
    },
  ],
  [
    {
      key: "Way a teacher should treat a consistent computational error",
      value:
        "Treat it as a systematic misrule rather than carelessness, uncover the rule the child is using, and reteach at that point",
    },
    {
      key: "Reason mathematics is called a language as well as a science",
      value:
        "It has its own vocabulary, symbols and syntax through which relationships are stated with precision",
    },
    {
      key: "Value of linking school mathematics to community mathematics",
      value:
        "It shows the child that the subject has meaning outside the classroom and it draws on knowledge the child already possesses",
    },
    {
      key: "Way to reduce mathematics anxiety",
      value:
        "Allow multiple strategies, accept errors as part of learning, and use group work and concrete material rather than rewarding speed alone",
    },
    {
      key: "Difference between a problem and an exercise",
      value:
        "An exercise practises a known procedure, a problem requires the learner to decide what procedure applies, which is where mathematical thinking is built",
    },
  ],
);

/* ===================== III. Environmental Studies, Paper I ============== */

tet(
  "ct:evs-content",
  "Environmental Studies Content for Paper I",
  "In the CTET environmental studies content, what is %s?",
  "%k is %v.",
  [
    {
      key: "Six themes of the EVS content syllabus",
      value: "Family and Friends, Food, Shelter, Water, Travel, and Things We Make and Do",
    },
    {
      key: "Sub-themes under Family and Friends",
      value: "Relationships, Work and Play, Animals and Plants",
    },
    { key: "Nuclear family", value: "A family of parents and their children only" },
    {
      key: "Joint family",
      value:
        "A family in which more than one generation or more than one married couple lives together",
    },
    {
      key: "Balanced diet",
      value: "A diet that supplies all the nutrients in the right proportion",
    },
    {
      key: "Chief sources of water",
      value: "Rain, rivers, lakes, ponds, wells, tube wells and springs",
    },
    {
      key: "Rainwater harvesting",
      value:
        "Collecting and storing rainwater where it falls for later use or to recharge groundwater",
    },
    {
      key: "Migratory animals",
      value:
        "Animals that travel long distances seasonally, such as the Siberian crane that visits India in winter",
    },
    {
      key: "Kachcha house",
      value: "A house built of mud, thatch, bamboo or other locally available temporary material",
    },
    {
      key: "Means of transport in a hilly region",
      value: "Ropeway, mule, and narrow road or mountain railway, chosen because of the slope",
    },
  ],
  [
    {
      key: "Reason EVS is taught as one integrated subject at the primary stage",
      value:
        "A young child experiences the world as a whole, so science, social science and environmental education are woven together rather than split",
    },
    {
      key: "Difference between EVS and environmental education",
      value:
        "EVS is the school subject for classes one to five, environmental education is the wider lifelong aim of building concern for the environment",
    },
    {
      key: "Reason the EVS syllabus starts from the child's immediate surroundings",
      value:
        "Learning proceeds from the known to the unknown and from the near to the far, so the family and the neighbourhood come before the nation",
    },
    {
      key: "Role of the Things We Make and Do theme",
      value:
        "It connects the child to local crafts, occupations and tools, and gives dignity to work done with the hands",
    },
    {
      key: "Way water scarcity should be taught in EVS",
      value:
        "Through the child's own observation of local sources, use and wastage, rather than as a set of memorised statistics",
    },
  ],
);

tet(
  "ct:evs-pedagogy-official",
  "Pedagogical Issues in Environmental Studies",
  "In the pedagogy of environmental studies, what is %s?",
  "%k is %v.",
  [
    {
      key: "Scope of EVS",
      value:
        "It draws on science, social science and environmental education and covers the child's whole physical and social surroundings",
    },
    {
      key: "Significance of EVS",
      value:
        "It builds sensitivity to the environment and the habit of observing and questioning the world around the child",
    },
    {
      key: "Integrated EVS",
      value:
        "Teaching in which science and social science content are not separated but developed around a common theme",
    },
    {
      key: "Learning principle from the known to the unknown",
      value: "New material is introduced by linking it to what the child already knows",
    },
    {
      key: "Discussion as an EVS method",
      value:
        "A method in which children exchange and defend observations, which builds language along with content",
    },
    {
      key: "Field visit in EVS",
      value:
        "A planned visit outside the classroom in which children observe the real thing being studied",
    },
    {
      key: "Teaching aid",
      value: "Any material or device used to make learning concrete and interesting",
    },
    {
      key: "Experimentation in EVS",
      value:
        "Simple practical work through which a child tests an idea, such as observing which objects float",
    },
    {
      key: "Chief method recommended in EVS",
      value: "Activity and observation rather than telling and memorising",
    },
    {
      key: "Common problem in teaching EVS",
      value: "Reducing an activity-based subject to textbook reading and question answering",
    },
  ],
  [
    {
      key: "Relation of EVS to science and social science",
      value:
        "At the primary stage EVS carries the seeds of both, and from class six onwards it branches into science and social science as separate subjects",
    },
    {
      key: "Reason a survey is a good EVS activity",
      value:
        "The child collects first-hand information from the real community, which develops observation, recording and interpretation together",
    },
    {
      key: "Way concepts should be presented in EVS",
      value:
        "Through themes drawn from the child's life, so that content, skill and attitude develop together rather than as isolated facts",
    },
    {
      key: "Place of CCE in EVS",
      value:
        "Since much of EVS is activity, attitude and skill, it has to be assessed continuously through observation and record rather than by one written test",
    },
    {
      key: "Weakness of an EVS class taught only from the textbook",
      value:
        "It loses the environment itself, which is the actual source material, and leaves the child with words in place of experience",
    },
  ],
);

/* ===================== IV and V. Language I and Language II ============= */

tet(
  "ct:language-pedagogy-official",
  "Pedagogy of Language Development",
  "In the pedagogy of language development, what is %s?",
  "%k is %v.",
  [
    {
      key: "Language acquisition",
      value: "The natural, unconscious picking up of a language through exposure and use",
    },
    {
      key: "Language learning",
      value:
        "The conscious study of a language, usually in a formal setting with attention to rules",
    },
    { key: "Four language skills", value: "Listening, speaking, reading and writing" },
    { key: "Receptive language skills", value: "Listening and reading" },
    { key: "Productive language skills", value: "Speaking and writing" },
    {
      key: "Mother tongue as the medium at the early stage",
      value:
        "It is recommended because the child already commands it, so thought is not blocked by an unfamiliar code",
    },
    {
      key: "Multilingual classroom",
      value: "A classroom in which learners bring several different home languages",
    },
    {
      key: "Remedial teaching in language",
      value: "Focused teaching planned to remove a specific language difficulty found in a learner",
    },
    {
      key: "Dyslexia as a language difficulty",
      value:
        "A disorder of reading and decoding that is not caused by low intelligence or poor teaching",
    },
    {
      key: "Role of listening and speaking",
      value:
        "They come first in natural language development and form the base on which reading and writing are built",
    },
  ],
  [
    {
      key: "Critical view of the role of grammar in language learning",
      value:
        "Grammar is a means of communicating ideas accurately, not an end in itself, so it should be taught in context rather than as isolated rules to be memorised",
    },
    {
      key: "Way a teacher should treat a learner's language error",
      value:
        "As evidence of an active hypothesis about the language, to be addressed through exposure and use rather than punished",
    },
    {
      key: "Meaning of language as a tool",
      value:
        "Children use language to think, to regulate their own action and to negotiate with others, so it is not merely a subject but the medium of all learning",
    },
    {
      key: "Advantage of a multilingual classroom",
      value:
        "The languages children bring are a resource that builds metalinguistic awareness, and treating them as a problem damages both language and identity",
    },
    {
      key: "Way language comprehension should be evaluated",
      value:
        "Through tasks that call for inference, interpretation and use across all four skills, rather than by recall of the text alone",
    },
  ],
);

/* ===================== Paper II: Mathematics, Science, Social Studies === */

tet(
  "ct:maths-elementary-content",
  "Elementary Mathematics Content for Paper II",
  "In the CTET Paper II mathematics content, what is %s?",
  "%k is %v.",
  [
    { key: "Whole numbers", value: "The natural numbers together with zero" },
    { key: "Integers", value: "The whole numbers together with the negative numbers" },
    {
      key: "Prime number",
      value: "A number greater than one that has exactly two factors, one and itself",
    },
    { key: "Co-prime numbers", value: "Two numbers whose highest common factor is one" },
    {
      key: "Proper fraction",
      value: "A fraction in which the numerator is less than the denominator",
    },
    { key: "Ratio", value: "A comparison of two quantities of the same kind by division" },
    { key: "Proportion", value: "A statement that two ratios are equal" },
    {
      key: "Line of symmetry",
      value: "A line that divides a figure into two parts that are mirror images of each other",
    },
    {
      key: "Instruments used in construction at this stage",
      value: "The straight edge scale, the protractor and the compasses",
    },
    {
      key: "Mensuration",
      value:
        "The branch of mathematics dealing with the measurement of length, area and volume of figures",
    },
  ],
  [
    {
      key: "Five strands of the Paper II mathematics content",
      value: "Number System, Algebra, Geometry, Mensuration and Data Handling",
    },
    {
      key: "Reason algebra is introduced through patterns",
      value:
        "A letter is first met as a way of stating a general rule the child has already seen in a pattern, which makes the variable meaningful rather than mysterious",
    },
    {
      key: "Difference between reflection symmetry and rotational symmetry",
      value:
        "Reflection symmetry folds the figure onto itself about a line, rotational symmetry turns it about a point onto itself",
    },
    {
      key: "Reason negative numbers are hard for learners",
      value:
        "They cannot be modelled by counting objects, so the number line and contexts such as temperature and debt have to carry the meaning",
    },
    {
      key: "Relation of the number system strand to the later strands",
      value:
        "Algebra generalises number, mensuration applies number to space, and data handling applies number to information, so all three rest on a secure number sense",
    },
  ],
);

tet(
  "ct:science-elementary-content",
  "Elementary Science Content for Paper II",
  "In the CTET Paper II science content, what is %s?",
  "%k is %v.",
  [
    {
      key: "Seven strands of the Paper II science content",
      value:
        "Food, Materials, The World of the Living, Moving Things People and Ideas, How Things Work, Natural Phenomena and Natural Resources",
    },
    {
      key: "Sub-topics of the Food strand",
      value: "Sources of food, components of food, and cleaning food",
    },
    {
      key: "Components of food",
      value: "Carbohydrates, proteins, fats, vitamins, minerals, dietary fibre and water",
    },
    { key: "Winnowing", value: "Separating lighter husk from heavier grain using the wind" },
    {
      key: "Sub-topics of the How Things Work strand",
      value: "Electric current and circuits, and magnets",
    },
    { key: "Condition for an electric current to flow", value: "A closed, or complete, circuit" },
    {
      key: "Poles of a magnet",
      value: "The north-seeking and the south-seeking pole, which always occur in a pair",
    },
    {
      key: "Topics of the Natural Phenomena strand",
      value: "Light, sound, and phenomena such as rain, thunder and lightning and the earthquake",
    },
    {
      key: "Topics of the Natural Resources strand",
      value: "Air, water, soil, forests, wildlife and their conservation",
    },
    {
      key: "Meaning of Moving Things People and Ideas",
      value:
        "The strand covering motion, measurement of distance, and means of transport and communication",
    },
  ],
  [
    {
      key: "Reason the science syllabus is organised by themes and not by disciplines",
      value:
        "At the elementary stage physics, chemistry and biology are not separated, because the child meets phenomena as a whole and the themes keep that unity",
    },
    {
      key: "Difference between a conductor and an insulator in this strand",
      value:
        "A conductor allows current to pass, as metals do, and an insulator does not, as rubber and plastic do, which is why wires are covered",
    },
    {
      key: "Way the Materials strand is approached",
      value:
        "Through the properties, grouping and changes of materials of daily use, starting from things the child handles rather than from formal chemistry",
    },
    {
      key: "Reason conservation is placed under Natural Resources",
      value:
        "The strand aims at attitude as much as information, so that the child sees resources as limited and shared",
    },
    {
      key: "Scope of The World of the Living strand",
      value:
        "The characteristics and habitat of living things, plant and animal structure and function, and the interdependence of organisms",
    },
  ],
);

tet(
  "ct:sst-content-official",
  "Social Studies Content for Paper II",
  "In the CTET Paper II social studies content, what is %s?",
  "%k is %v.",
  [
    {
      key: "Three components of the social studies content",
      value: "History, Geography, and Social and Political Life",
    },
    {
      key: "Opening theme of the History component",
      value: "When, Where and How, which deals with sources, dates and the making of history",
    },
    {
      key: "Earliest societies in the History component",
      value: "The hunter-gatherers, followed by the first farmers and herders",
    },
    {
      key: "First cities studied in the History component",
      value: "The cities of the Harappan civilisation",
    },
    { key: "First empire in the History component", value: "The Mauryan empire" },
    {
      key: "Opening theme of the Geography component",
      value: "Geography as a social study and as a science",
    },
    {
      key: "Meaning of environment in its totality",
      value: "The natural and the human environment taken together",
    },
    {
      key: "Two types of resources in the Geography component",
      value: "Natural resources and human resources",
    },
    {
      key: "Three elements of the human environment strand",
      value: "Settlement, transport and communication",
    },
    { key: "Opening theme of Social and Political Life", value: "Diversity" },
  ],
  [
    {
      key: "Themes of the modern period in the History component",
      value:
        "The Establishment of Company Power, Rural Life and Society, Colonialism and Tribal Societies, the Revolt of 1857-58, Women and Reform, Challenging the Caste System, the Nationalist Movement, and India After Independence",
    },
    {
      key: "Themes of the medieval period in the History component",
      value:
        "New Kings and Kingdoms, Sultans of Delhi, Architecture, Creation of an Empire, Social Change and Regional Cultures",
    },
    {
      key: "Order of the Social and Political Life themes",
      value:
        "Diversity, Government, Local Government, Making a Living, Democracy, State Government, Understanding Media, Unpacking Gender, The Constitution, Parliamentary Government, The Judiciary, and Social Justice and the Marginalised",
    },
    {
      key: "Reason the subject is called Social and Political Life and not Civics",
      value:
        "The aim is to let the child examine how institutions actually work in social life, rather than to learn the formal structure of government by rote",
    },
    {
      key: "Weighting of content and pedagogy in the social studies section",
      value: "Forty questions on content and twenty on pedagogical issues, out of sixty",
    },
  ],
);

tet(
  "ct:sst-pedagogy-official",
  "Pedagogical Issues in Social Science",
  "In the pedagogy of social science, what is %s?",
  "%k is %v.",
  [
    {
      key: "Nature of social science",
      value:
        "The systematic study of human society and relationships, drawing on history, geography, political science and economics",
    },
    {
      key: "Primary source",
      value:
        "Material produced at the time being studied, such as an inscription, a coin or a letter",
    },
    {
      key: "Secondary source",
      value:
        "An account written later on the basis of primary sources, such as a textbook or an article",
    },
    {
      key: "Enquiry method",
      value: "A method in which learners frame questions and gather evidence to answer them",
    },
    {
      key: "Empirical evidence",
      value: "Evidence drawn from observation and record rather than from opinion",
    },
    {
      key: "Project work in social science",
      value:
        "An extended piece of work in which learners investigate a question and present their findings",
    },
    {
      key: "Critical thinking in social science",
      value: "The ability to question a source, weigh evidence and recognise bias and perspective",
    },
    {
      key: "Classroom discourse",
      value:
        "The talk between teacher and learners through which meaning is jointly built in the classroom",
    },
    {
      key: "Chief problem in teaching social science",
      value: "Its reduction to the memorising of names, dates and definitions",
    },
    {
      key: "Aim of evaluation in social science",
      value: "To test understanding, interpretation and reasoning rather than recall alone",
    },
  ],
  [
    {
      key: "Reason the same event may be described differently in two sources",
      value:
        "Every source is produced from a standpoint, so the learner must ask who made it, when, and for whom, which is the core skill of historical thinking",
    },
    {
      key: "Value of using primary sources in the classroom",
      value:
        "The learner engages with the raw material of history and sees that accounts are constructed rather than given",
    },
    {
      key: "Way a map should be used in the social science class",
      value:
        "As a source to be read and interrogated, not as an outline to be filled in and memorised",
    },
    {
      key: "Reason classroom discourse matters in social science",
      value:
        "Concepts such as justice, equality and diversity are grasped through argument and the exchange of viewpoints rather than through definition",
    },
    {
      key: "Way a controversial social issue should be handled",
      value:
        "Present the range of positions with evidence and let learners reason, rather than impose a single conclusion",
    },
  ],
);

export const CTET_OFFICIAL_TEMPLATES = templates;
