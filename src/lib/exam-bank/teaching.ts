/**
 * Teaching Aptitude — Child Development and Pedagogy.
 *
 * Paper I and Paper II of CTET, PSTET and the state TETs devote thirty marks
 * to child development and pedagogy, and a further pedagogy block to each
 * subject paper. These chapters follow that published section list.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const TEACH_EXAMS = [
  "PSTET/CTET",
  "State Teacher/TET",
  "Punjab ETT Cadre",
  "Punjab Master Cadre",
  "Punjab Lecturer Cadre",
];

const templates: Template[] = [];
const chapter = chapterFactory(templates, "Teaching Aptitude", TEACH_EXAMS);

chapter(
  "tet:development",
  "Child Development",
  "In child development, what is %s?",
  "%k is %v.",
  [
    {
      key: "Development",
      value: "The progressive series of orderly changes in a child from conception to maturity",
    },
    {
      key: "Growth",
      value: "The quantitative increase in size and weight, which stops at maturity",
    },
    {
      key: "Maturation",
      value: "The unfolding of traits that were potentially present, governed by heredity",
    },
    {
      key: "Principle of continuity",
      value: "Development goes on continuously from birth to death",
    },
    { key: "Cephalocaudal principle", value: "Development proceeds from head to foot" },
    {
      key: "Proximodistal principle",
      value: "Development proceeds from the centre of the body outward to the limbs",
    },
    {
      key: "Principle of individual differences",
      value: "Every child develops at a rate and in a pattern of their own",
    },
    {
      key: "Heredity",
      value: "The transmission of traits from parents to offspring through genes",
    },
    {
      key: "Environment",
      value: "All the external forces, physical and social, that act upon the child",
    },
    {
      key: "Socialisation",
      value: "The process by which a child learns the ways, values and roles of the society",
    },
  ],
  [
    {
      key: "Nature versus nurture debate",
      value:
        "The question of how far development owes to heredity and how far to environment; both are now held to interact",
    },
    {
      key: "Critical period",
      value: "A limited span during which a particular ability develops most readily",
    },
    {
      key: "Developmental task",
      value:
        "A skill or attitude a child is expected to acquire at a given stage, such as walking in infancy",
    },
    {
      key: "Adolescence",
      value:
        "The stage of rapid physical, emotional and social change roughly from twelve to nineteen years",
    },
    {
      key: "Role of the family as the primary agency",
      value: "It gives the child the first language, values and emotional security",
    },
  ],
);

chapter(
  "tet:piaget",
  "Theories of Learning and Development",
  "In the theories of development and learning, what is %s?",
  "%k is %v.",
  [
    {
      key: "Piaget's sensorimotor stage",
      value:
        "Birth to two years, when the child learns through senses and action and gains object permanence",
    },
    {
      key: "Piaget's preoperational stage",
      value: "Two to seven years, marked by symbolic thought, egocentrism and lack of conservation",
    },
    {
      key: "Piaget's concrete operational stage",
      value: "Seven to eleven years, when logical thought about concrete things appears",
    },
    {
      key: "Piaget's formal operational stage",
      value: "Eleven years onward, when abstract and hypothetical reasoning becomes possible",
    },
    { key: "Assimilation", value: "Fitting new experience into an existing mental scheme" },
    { key: "Accommodation", value: "Changing an existing scheme to fit a new experience" },
    {
      key: "Vygotsky's zone of proximal development",
      value: "The gap between what a learner can do alone and what they can do with guidance",
    },
    {
      key: "Scaffolding",
      value: "Temporary support given by a teacher or peer, withdrawn as the learner becomes able",
    },
    {
      key: "Kohlberg's theory",
      value: "A stage theory of moral development, from obedience to universal ethical principles",
    },
    {
      key: "Erikson's theory",
      value: "A theory of eight psychosocial stages, each with a central conflict to resolve",
    },
  ],
  [
    {
      key: "Difference between Piaget and Vygotsky",
      value:
        "Piaget saw development as leading learning, while Vygotsky held that social learning leads development",
    },
    {
      key: "Conservation",
      value: "Understanding that quantity stays the same when only the appearance changes",
    },
    {
      key: "Egocentrism in the preoperational child",
      value: "Inability to take a point of view other than one's own",
    },
    {
      key: "Constructivism",
      value: "The view that learners actively build knowledge rather than receive it ready made",
    },
    {
      key: "Private speech in Vygotsky's theory",
      value:
        "Self-directed talk that guides the child's own thinking and later becomes inner speech",
    },
  ],
);

chapter(
  "tet:learning",
  "Learning and Motivation",
  "About learning and motivation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Learning",
      value: "A relatively permanent change in behaviour brought about by experience",
    },
    {
      key: "Classical conditioning",
      value: "Pavlov's learning by association of a neutral stimulus with a natural one",
    },
    {
      key: "Operant conditioning",
      value: "Skinner's learning shaped by the consequences that follow behaviour",
    },
    {
      key: "Reinforcement",
      value: "Any consequence that increases the chance of a behaviour being repeated",
    },
    {
      key: "Punishment",
      value: "A consequence that reduces the chance of a behaviour being repeated",
    },
    {
      key: "Trial and error learning",
      value: "Thorndike's learning by repeated attempts until the successful response is fixed",
    },
    { key: "Insight learning", value: "Kohler's sudden grasp of the relationships in a problem" },
    {
      key: "Observational learning",
      value: "Bandura's learning by watching and imitating a model",
    },
    {
      key: "Intrinsic motivation",
      value: "Motivation that comes from interest and satisfaction in the task itself",
    },
    {
      key: "Extrinsic motivation",
      value: "Motivation that comes from rewards, marks or approval outside the task",
    },
  ],
  [
    {
      key: "Maslow's hierarchy of needs",
      value: "Physiological, safety, belonging, esteem and self-actualisation needs, in that order",
    },
    {
      key: "Transfer of learning",
      value:
        "The effect of earlier learning on later learning, which may be positive, negative or zero",
    },
    {
      key: "Law of effect",
      value: "Thorndike's law that responses followed by satisfaction are strengthened",
    },
    {
      key: "Plateau in the learning curve",
      value: "A period of no apparent progress despite continued practice",
    },
    {
      key: "Forgetting by interference",
      value: "Loss of recall because earlier or later learning gets in the way",
    },
  ],
);

chapter(
  "tet:inclusive",
  "Inclusive Education and Special Needs",
  "In inclusive education, what is %s?",
  "%k is %v.",
  [
    {
      key: "Inclusive education",
      value:
        "Educating every child, whatever the ability or background, in the same regular classroom",
    },
    { key: "Dyslexia", value: "A specific learning difficulty affecting reading and spelling" },
    {
      key: "Dysgraphia",
      value: "A specific learning difficulty affecting handwriting and written expression",
    },
    {
      key: "Dyscalculia",
      value: "A specific learning difficulty affecting number sense and calculation",
    },
    {
      key: "Gifted learner",
      value: "A child of markedly high ability who needs enrichment beyond the usual syllabus",
    },
    {
      key: "Slow learner",
      value: "A child who learns at a below average pace but is not intellectually disabled",
    },
    {
      key: "Remedial teaching",
      value: "Extra focused teaching to close a specific identified gap",
    },
    {
      key: "Barrier free environment",
      value:
        "Physical and attitudinal arrangements that let a disabled child move and learn freely",
    },
    {
      key: "Rights of Persons with Disabilities Act",
      value: "The 2016 law recognising twenty one disabilities and mandating inclusive education",
    },
    {
      key: "Individualised Education Plan",
      value:
        "A written plan of goals and support prepared for a particular child with special needs",
    },
  ],
  [
    {
      key: "Difference between integration and inclusion",
      value:
        "Integration asks the child to fit the school, while inclusion changes the school to fit the child",
    },
    {
      key: "Universal Design for Learning",
      value:
        "Designing lessons from the start with multiple means of representation, action and engagement",
    },
    {
      key: "Assistive technology",
      value: "Devices and software such as screen readers and braille displays that support access",
    },
    {
      key: "Role of the teacher towards a disadvantaged learner",
      value:
        "To hold high expectations, remove barriers and use the child's own language and context",
    },
    {
      key: "Sarva Shiksha Abhiyan on inclusion",
      value: "It adopted a zero rejection policy so that no child with special needs is left out",
    },
  ],
);

chapter(
  "tet:assessment",
  "Assessment and Evaluation",
  "In classroom assessment, what is %s?",
  "%k is %v.",
  [
    { key: "Assessment", value: "The gathering of evidence about what a learner knows and can do" },
    {
      key: "Evaluation",
      value: "Judging the worth of learning against a standard, using assessment evidence",
    },
    {
      key: "Formative assessment",
      value: "Assessment during learning, used to guide the next step of teaching",
    },
    {
      key: "Summative assessment",
      value: "Assessment at the end of a unit or year, used to certify achievement",
    },
    {
      key: "Continuous and Comprehensive Evaluation",
      value: "Regular assessment of both scholastic and co-scholastic growth",
    },
    {
      key: "Diagnostic test",
      value: "A test designed to locate the exact point of a learner's difficulty",
    },
    {
      key: "Achievement test",
      value: "A test measuring how much has been learnt in a given subject",
    },
    {
      key: "Reliability of a test",
      value: "The consistency with which a test gives the same result on repetition",
    },
    {
      key: "Validity of a test",
      value: "The extent to which a test measures what it claims to measure",
    },
    {
      key: "Portfolio assessment",
      value: "Judging progress from a purposeful collection of the learner's own work",
    },
  ],
  [
    {
      key: "Norm referenced testing",
      value: "Comparing a learner's score with the scores of the group",
    },
    {
      key: "Criterion referenced testing",
      value: "Comparing a learner's performance with a fixed standard of mastery",
    },
    {
      key: "Difference between measurement and evaluation",
      value: "Measurement assigns a number, while evaluation adds a judgement of worth",
    },
    {
      key: "Rubric",
      value: "A scoring guide listing the criteria and the levels of quality for each",
    },
    {
      key: "Purpose of assessment for learning",
      value: "To give feedback that helps the learner improve, not merely to rank",
    },
  ],
);

chapter(
  "tet:pedagogy",
  "Pedagogy and Classroom Practice",
  "In pedagogy and classroom practice, what is %s?",
  "%k is %v.",
  [
    {
      key: "Child centred education",
      value: "Teaching built around the interests, pace and experience of the learner",
    },
    {
      key: "Activity based learning",
      value: "Learning through doing, with the activity carrying the concept",
    },
    {
      key: "Play way method",
      value: "Teaching young children through games and play, associated with Froebel",
    },
    {
      key: "Project method",
      value:
        "Learning through a purposeful task carried through in a real setting, associated with Kilpatrick",
    },
    {
      key: "Heuristic method",
      value: "Letting the learner discover the principle by investigating for themselves",
    },
    { key: "Inductive method", value: "Moving from particular examples to the general rule" },
    { key: "Deductive method", value: "Moving from the general rule to particular examples" },
    {
      key: "Micro teaching",
      value: "Practising one teaching skill with a small group for a short time, then reviewing it",
    },
    {
      key: "Teaching aid",
      value: "Any material or device that makes the lesson clearer and more concrete",
    },
    {
      key: "Lesson plan",
      value: "A written scheme of the objectives, steps, aids and evaluation for one period",
    },
  ],
  [
    {
      key: "Bloom's taxonomy of the cognitive domain",
      value: "Remember, understand, apply, analyse, evaluate and create",
    },
    {
      key: "Difference between teaching method and teaching strategy",
      value:
        "A method is the general way of presenting content, while a strategy is the planned choice of methods for a goal",
    },
    {
      key: "Constructivist classroom",
      value: "One where learners build meaning through enquiry, discussion and reflection",
    },
    {
      key: "Role of error in learning",
      value:
        "Errors show the learner's current thinking and are a resource for teaching, not merely a fault",
    },
    {
      key: "Reflective practice",
      value: "The habit of examining one's own teaching in order to improve it",
    },
  ],
);

chapter(
  "tet:rte",
  "Right to Education and School Policy",
  "In school education policy, what is %s?",
  "%k is %v.",
  [
    {
      key: "Right to Education Act",
      value:
        "The 2009 law giving free and compulsory education to children of six to fourteen years",
    },
    {
      key: "Article 21A",
      value: "The fundamental right to education, inserted by the Eighty sixth Amendment",
    },
    { key: "Age group covered by the RTE Act", value: "Six to fourteen years" },
    {
      key: "Reservation for weaker sections in private schools",
      value: "Twenty five per cent of the entry class seats under the RTE Act",
    },
    {
      key: "No detention policy",
      value: "The RTE provision against holding a child back up to Class 8, later amended",
    },
    {
      key: "School Management Committee",
      value:
        "The body of parents and local members that oversees a government school under the RTE Act",
    },
    {
      key: "Mid Day Meal Scheme",
      value: "The scheme providing a cooked meal in school, now called PM POSHAN",
    },
    {
      key: "National Curriculum Framework 2005",
      value: "The framework that urged linking school knowledge to life outside",
    },
    {
      key: "National Education Policy 2020",
      value:
        "The policy that replaced the ten plus two structure with a five plus three plus three plus four design",
    },
    {
      key: "Foundational Literacy and Numeracy mission",
      value: "NIPUN Bharat, aimed at reading and arithmetic by the end of Class 3",
    },
  ],
  [
    {
      key: "Pupil teacher ratio under the RTE Act",
      value: "Thirty to one at the primary level and thirty five to one at the upper primary level",
    },
    {
      key: "Prohibitions under the RTE Act",
      value: "Physical punishment, mental harassment, screening at admission and capitation fees",
    },
    {
      key: "Kothari Commission",
      value:
        "The 1964 to 1966 commission that proposed the common school system and six per cent of GDP for education",
    },
    {
      key: "Samagra Shiksha",
      value: "The integrated scheme covering school education from pre-school to Class 12",
    },
    {
      key: "Three language formula",
      value:
        "The policy of learning the regional language, Hindi and English, restated in the 2020 policy",
    },
  ],
);

export const TEACHING_TEMPLATES = templates;
