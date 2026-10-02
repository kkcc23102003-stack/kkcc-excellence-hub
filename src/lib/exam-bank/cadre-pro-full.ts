/**
 * The rest of the Master Cadre DPE and Art and Craft syllabus, and the rest
 * of the CA Intermediate Taxation, Auditing and Financial Management papers.
 *
 * Physical Education, Taxation, Auditing and Ethics and Financial Management
 * each carried only six chapters, and Art and Craft ten. These are the
 * remaining modules the real syllabus lists.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const MASTER = ["Punjab Master Cadre", "Punjab Lecturer Cadre", "State Teacher/TET"];
const INTER = ["CA Intermediate", "CS Executive", "CMA Intermediate"];

const templates: Template[] = [];
const pe = chapterFactory(templates, "Physical Education", MASTER);
const art = chapterFactory(templates, "Art and Craft", MASTER);
const tax = chapterFactory(templates, "Taxation", INTER);
const aud = chapterFactory(templates, "Auditing and Ethics", INTER);
const fm = chapterFactory(templates, "Financial Management", INTER);

/* ====================================================== Physical Education */

pe(
  "pe:injuries-first-aid",
  "Sports Injuries, First Aid and Rehabilitation",
  "In sports medicine, what is %s?",
  "%k is %v.",
  [
    { key: "Soft tissue injury to a ligament", value: "A sprain" },
    { key: "Soft tissue injury to a muscle or tendon", value: "A strain" },
    { key: "Contusion", value: "A bruise caused by a direct blow, with bleeding under the skin" },
    { key: "Abrasion", value: "A graze in which the top layer of the skin is scraped off" },
    { key: "Dislocation", value: "The displacement of a bone from its normal position at a joint" },
    { key: "Fracture in which the bone breaks the skin", value: "A compound or open fracture" },
    {
      key: "Fracture in which the bone does not break the skin",
      value: "A simple or closed fracture",
    },
    { key: "Immediate treatment protocol for a soft tissue injury", value: "The RICE method" },
    { key: "Expansion of RICE", value: "Rest, Ice, Compression and Elevation" },
    {
      key: "Aim of first aid",
      value: "To preserve life, prevent the condition worsening and promote recovery",
    },
  ],
  [
    {
      key: "Greenstick fracture",
      value:
        "An incomplete fracture in which the bone bends and cracks on one side, common in children",
    },
    {
      key: "Reason ice is applied to a fresh injury",
      value: "It constricts blood vessels, which limits swelling, bleeding and pain",
    },
    {
      key: "Difference between a first degree and a third degree sprain",
      value:
        "A first degree is a mild stretch of the ligament, a third degree is a complete tear needing medical care",
    },
    {
      key: "Golden hour",
      value:
        "The first hour after a serious injury, when prompt treatment most improves the chance of survival",
    },
    {
      key: "Chief means of preventing sports injury",
      value:
        "Proper warm up, correct technique, protective gear, suitable surface and progressive training load",
    },
  ],
);

pe(
  "pe:kinesiology-biomechanics",
  "Kinesiology and Biomechanics",
  "In kinesiology and biomechanics, what is %s?",
  "%k is %v.",
  [
    { key: "Kinesiology", value: "The study of human movement" },
    {
      key: "Biomechanics",
      value: "The study of the mechanical laws that govern movement of the body",
    },
    { key: "Axis and plane of a forward roll", value: "The frontal axis in the sagittal plane" },
    { key: "Movement that decreases the angle at a joint", value: "Flexion" },
    { key: "Movement that increases the angle at a joint", value: "Extension" },
    { key: "Movement of a limb away from the midline", value: "Abduction" },
    { key: "Movement of a limb towards the midline", value: "Adduction" },
    { key: "Muscle that produces the desired movement", value: "The agonist, or prime mover" },
    { key: "Muscle that opposes the prime mover", value: "The antagonist" },
    {
      key: "Newton's law explaining recoil in shooting",
      value: "The third law, of action and reaction",
    },
  ],
  [
    {
      key: "Three classes of lever in the body",
      value:
        "First class as in nodding the head, second class as in rising on the toes, third class as in a biceps curl",
    },
    {
      key: "Reason a sprinter crouches at the start",
      value:
        "It lowers the centre of gravity and puts the body in line with the drive, giving greater forward acceleration",
    },
    {
      key: "Factors that determine stability",
      value:
        "The height of the centre of gravity, the size of the base and the line of gravity falling within it",
    },
    {
      key: "Projectile factors in a throw",
      value: "The angle, speed and height of release, along with air resistance",
    },
    {
      key: "Difference between isotonic and isometric contraction",
      value:
        "Isotonic changes muscle length and moves the joint, isometric develops tension without changing length",
    },
  ],
);

pe(
  "pe:test-measurement",
  "Test, Measurement and Evaluation in Physical Education",
  "In physical education measurement, what is %s?",
  "%k is %v.",
  [
    { key: "Test", value: "A tool or instrument used to collect data about a trait" },
    { key: "Measurement", value: "The process of assigning a number to the trait being tested" },
    {
      key: "Evaluation",
      value: "The judgement of worth made after comparing the measurement with a standard",
    },
    {
      key: "Test of cardiovascular endurance",
      value: "The Harvard step test, or the twelve minute Cooper run and walk",
    },
    {
      key: "Test that measures explosive leg strength",
      value: "The standing broad jump, or the vertical jump",
    },
    { key: "Test that measures agility", value: "The shuttle run, or the Illinois agility test" },
    { key: "Test that measures flexibility", value: "The sit and reach test" },
    {
      key: "Test that measures abdominal strength",
      value: "The partial curl up, or bent knee sit ups",
    },
    {
      key: "Body Mass Index formula",
      value: "Weight in kilograms divided by the square of height in metres",
    },
    {
      key: "Fitness test battery of the AAHPER",
      value:
        "A six item battery including pull ups, sit ups, shuttle run, standing broad jump, dash and the six hundred yard run",
    },
  ],
  [
    {
      key: "Validity of a test",
      value: "The extent to which a test measures what it claims to measure",
    },
    {
      key: "Reliability of a test",
      value: "The consistency with which a test gives the same result on repetition",
    },
    {
      key: "Objectivity of a test",
      value: "The degree to which two different scorers arrive at the same result",
    },
    {
      key: "Rikli and Jones test",
      value: "The senior citizen fitness test, measuring functional fitness in older adults",
    },
    {
      key: "Purpose of somatotyping",
      value:
        "To classify body build as endomorph, mesomorph or ectomorph, useful in selecting athletes for events",
    },
  ],
);

pe(
  "pe:psychology-sociology",
  "Sports Psychology and Sociology",
  "In sports psychology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Motivation",
      value: "The inner drive that starts, directs and sustains behaviour towards a goal",
    },
    {
      key: "Intrinsic motivation",
      value: "Motivation that comes from within, such as the joy of playing",
    },
    {
      key: "Extrinsic motivation",
      value: "Motivation from outside rewards such as prizes, money or praise",
    },
    { key: "Anxiety in sport", value: "A state of worry and tension about performance" },
    { key: "State anxiety", value: "Anxiety felt in a particular situation, which passes with it" },
    {
      key: "Trait anxiety",
      value: "A stable tendency in a person to feel anxious in many situations",
    },
    { key: "Aggression that aims to win within the rules", value: "Instrumental aggression" },
    { key: "Aggression that aims to harm an opponent", value: "Hostile aggression" },
    { key: "Personality type described by Jung", value: "Introvert and extrovert" },
    {
      key: "Sportsmanship",
      value: "Fair play, respect for opponents and officials, and grace in victory or defeat",
    },
  ],
  [
    {
      key: "Inverted U hypothesis",
      value:
        "Performance improves with arousal up to an optimum point and then declines as arousal rises further",
    },
    {
      key: "Big Five personality traits",
      value: "Openness, conscientiousness, extraversion, agreeableness and neuroticism",
    },
    {
      key: "Psychological techniques to control anxiety",
      value:
        "Deep breathing, progressive relaxation, meditation, imagery, self talk and goal setting",
    },
    {
      key: "Socialisation through sport",
      value:
        "The process by which a player learns the norms, roles and values of society through participation",
    },
    {
      key: "Role of leadership in a team",
      value:
        "A leader sets direction, builds cohesion, motivates and takes responsibility for decisions under pressure",
    },
  ],
);

pe(
  "pe:postural-deformities",
  "Posture, Postural Deformities and Corrective Exercise",
  "In postural care, what is %s?",
  "%k is %v.",
  [
    {
      key: "Good posture",
      value: "The position in which the body is held with least strain on muscles and joints",
    },
    {
      key: "Kyphosis",
      value: "An exaggerated outward curve of the upper back, giving round shoulders",
    },
    { key: "Lordosis", value: "An exaggerated inward curve of the lower back" },
    { key: "Scoliosis", value: "A sideways curvature of the spine" },
    { key: "Flat foot", value: "The deformity in which the arch of the foot is lowered or absent" },
    {
      key: "Knock knee",
      value: "The deformity in which the knees touch while the ankles stay apart",
    },
    { key: "Bow leg", value: "The deformity in which the knees stay apart while the ankles touch" },
    {
      key: "Corrective exercise for kyphosis",
      value: "Chakrasana, Dhanurasana and backward bending with shoulder stretches",
    },
    {
      key: "Corrective exercise for flat foot",
      value: "Walking on the toes, picking up objects with the toes and rope skipping",
    },
    {
      key: "Chief cause of postural deformity",
      value:
        "Malnutrition, wrong habits of sitting and standing, disease and carrying heavy loads wrongly",
    },
  ],
  [
    {
      key: "Corrective exercise for lordosis",
      value:
        "Forward bending, Halasana, Paschimottanasana and strengthening of the abdominal muscles",
    },
    {
      key: "Corrective exercise for scoliosis",
      value:
        "Bending on the convex side, hanging on the bar and swimming, especially the side stroke",
    },
    {
      key: "Difference between dynamic and static posture",
      value: "Static posture is the alignment at rest, dynamic posture the alignment while moving",
    },
    {
      key: "Reason posture matters for an athlete",
      value:
        "Good alignment gives efficient movement, reduces fatigue and lowers the risk of chronic injury",
    },
    {
      key: "Genu valgum and genu varum",
      value: "The medical names of knock knee and bow leg respectively",
    },
  ],
);

pe(
  "pe:athletics-track-field",
  "Athletics — Track and Field Events",
  "In athletics, what is %s?",
  "%k is %v.",
  [
    { key: "Length of a standard outdoor track", value: "Four hundred metres" },
    { key: "Number of lanes on a standard track", value: "Eight, each 1.22 metres wide" },
    {
      key: "Sprint events in athletics",
      value: "The one hundred, two hundred and four hundred metres",
    },
    { key: "Middle distance events", value: "The eight hundred and fifteen hundred metres" },
    { key: "Long distance track events", value: "The five thousand and ten thousand metres" },
    { key: "Length of a marathon", value: "42.195 kilometres" },
    { key: "Throwing events in athletics", value: "Shot put, discus, javelin and hammer" },
    {
      key: "Jumping events in athletics",
      value: "Long jump, high jump, triple jump and pole vault",
    },
    { key: "High jump technique using a back layout", value: "The Fosbury flop" },
    { key: "Number of events in the decathlon", value: "Ten" },
  ],
  [
    {
      key: "Shot put techniques",
      value: "The O'Brien or glide technique and the rotational or spin technique",
    },
    { key: "Three phases of the triple jump", value: "The hop, the step and the jump" },
    {
      key: "Reason for a staggered start in the two hundred metres",
      value: "Outer lanes cover a longer curve, so the stagger equalises the distance run",
    },
    {
      key: "Baton exchange zone in a relay",
      value: "The thirty metre zone within which the baton must pass from one runner to the next",
    },
    {
      key: "Events of the heptathlon",
      value:
        "Seven events for women, including the hurdles, high jump, shot put, two hundred metres, long jump, javelin and eight hundred metres",
    },
  ],
);

/* ========================================================= Art and Craft */

art(
  "ac:printmaking",
  "Printmaking and Graphic Art",
  "In printmaking, what is %s?",
  "%k is %v.",
  [
    {
      key: "Printmaking",
      value: "The making of multiple impressions of an image from a prepared surface",
    },
    {
      key: "Relief printing",
      value: "Printing from the raised surface of a block, the cut areas staying blank",
    },
    {
      key: "Intaglio printing",
      value: "Printing from lines cut or bitten into a plate, which hold the ink",
    },
    {
      key: "Lithography",
      value:
        "Planographic printing from a flat stone or plate, using the repulsion of grease and water",
    },
    {
      key: "Serigraphy",
      value: "Screen printing, in which ink is pushed through a stencilled mesh",
    },
    { key: "Woodcut", value: "A relief print taken from a carved wooden block" },
    { key: "Linocut", value: "A relief print taken from carved linoleum" },
    {
      key: "Etching",
      value: "An intaglio process in which acid bites the drawn lines into a metal plate",
    },
    {
      key: "Edition in printmaking",
      value: "The limited set of identical prints pulled from one plate, each numbered",
    },
    {
      key: "Artist's proof",
      value: "An impression kept by the artist outside the numbered edition",
    },
  ],
  [
    {
      key: "Difference between etching and engraving",
      value:
        "Etching bites the line with acid through a ground, engraving cuts it directly with a burin",
    },
    {
      key: "Aquatint",
      value:
        "An intaglio technique using powdered resin to produce broad tonal areas rather than lines",
    },
    {
      key: "Drypoint",
      value:
        "Scratching directly into the plate with a needle, whose raised burr gives a soft velvety line",
    },
    {
      key: "Reason an image prints in reverse",
      value:
        "The block or plate transfers a mirror image to the paper, so text must be cut in reverse",
    },
    {
      key: "Registration in colour printing",
      value:
        "The exact alignment of successive colour blocks so the layers fall in the right place",
    },
  ],
);

art(
  "ac:perspective-drawing",
  "Perspective, Still Life and Figure Drawing",
  "In drawing, what is %s?",
  "%k is %v.",
  [
    {
      key: "Perspective",
      value: "The method of showing three dimensional depth on a flat surface",
    },
    {
      key: "Horizon line",
      value: "The line at the level of the viewer's eye in a perspective drawing",
    },
    {
      key: "Vanishing point",
      value: "The point on the horizon at which receding parallel lines appear to meet",
    },
    {
      key: "One point perspective",
      value: "Perspective with a single vanishing point, used for a head-on view",
    },
    {
      key: "Two point perspective",
      value: "Perspective with two vanishing points, used for a corner view",
    },
    {
      key: "Aerial perspective",
      value: "The suggestion of distance by lightening tone and reducing detail and colour",
    },
    {
      key: "Still life",
      value: "A drawing or painting of inanimate objects arranged by the artist",
    },
    {
      key: "Foreshortening",
      value: "The apparent shortening of a form as it turns away from the viewer",
    },
    { key: "Chiaroscuro", value: "The strong contrast of light and shade used to model form" },
    {
      key: "Canon of human proportion in drawing",
      value: "The adult figure is about seven and a half heads tall",
    },
  ],
  [
    {
      key: "Three point perspective",
      value:
        "Perspective with a third vanishing point above or below, used for a worm's eye or bird's eye view",
    },
    {
      key: "Gesture drawing",
      value:
        "A rapid drawing that captures the movement and attitude of the figure rather than its outline",
    },
    {
      key: "Contour drawing",
      value:
        "Drawing the edges of a form with a continuous line, often without looking at the paper",
    },
    {
      key: "Difference between a cast shadow and a form shadow",
      value:
        "A form shadow lies on the object away from the light, a cast shadow falls from the object on to another surface",
    },
    {
      key: "Reason a circle is drawn as an ellipse in perspective",
      value: "A circle seen at an angle compresses along the axis pointing away from the viewer",
    },
  ],
);

art(
  "ac:textile-craft",
  "Textile, Embroidery and Fabric Craft",
  "In textile craft, what is %s?",
  "%k is %v.",
  [
    { key: "Embroidery of Punjab", value: "Phulkari" },
    { key: "Embroidery of Kashmir with fine woollen thread", value: "Kashida" },
    { key: "White thread embroidery of Bengal", value: "Kantha" },
    { key: "Mirror work embroidery of Gujarat and Rajasthan", value: "Shisha, or abhla bharat" },
    { key: "White on white embroidery of Lucknow", value: "Chikankari" },
    { key: "Resist dyeing by tying and knotting", value: "Bandhani, or tie and dye" },
    { key: "Resist dyeing in which the yarn is dyed before weaving", value: "Ikat" },
    { key: "Ikat textile of Odisha", value: "Bandha, and of Gujarat the double ikat Patola" },
    { key: "Wax resist printing on cloth", value: "Batik" },
    { key: "Hand block printing centre of Rajasthan", value: "Sanganer and Bagru" },
    { key: "Brocade weaving of Varanasi", value: "Banarasi brocade, with zari work" },
  ],
  [
    {
      key: "Difference between single and double ikat",
      value:
        "Single ikat resist dyes only the warp or weft, double ikat dyes both so the pattern matches on the loom",
    },
    {
      key: "Kalamkari technique",
      value: "Hand painting or block printing on cotton with natural dyes using a pen-like kalam",
    },
    {
      key: "Warp and weft",
      value: "The warp runs lengthwise on the loom, the weft is woven across it",
    },
    {
      key: "Bagh and chope phulkari",
      value:
        "Bagh covers the whole cloth with darn stitch, chope is worked on the border in a double running stitch for weddings",
    },
    {
      key: "Reason natural dyes need a mordant",
      value: "The mordant fixes the dye to the fibre so the colour does not wash out",
    },
  ],
);

art(
  "ac:paper-model-craft",
  "Paper Craft, Origami and Model Making",
  "In paper and model craft, what is %s?",
  "%k is %v.",
  [
    { key: "Origami", value: "The Japanese art of folding paper without cutting or pasting" },
    { key: "Kirigami", value: "The art of folding and cutting paper" },
    { key: "Quilling", value: "Rolling narrow strips of paper into coils to build a design" },
    { key: "Papier mache", value: "Craft made from paper pulp or strips moulded and hardened" },
    { key: "Papier mache craft centre of India", value: "Kashmir, especially Srinagar" },
    { key: "Collage", value: "A composition made by pasting different materials on a surface" },
    {
      key: "Montage",
      value: "A composition assembled from parts of photographs or printed images",
    },
    {
      key: "Mosaic",
      value: "A design made by setting small pieces of tile, glass or paper close together",
    },
    {
      key: "Tool used to score a fold cleanly",
      value: "A bone folder, or the back of a craft knife",
    },
    {
      key: "Adhesive commonly used in paper craft",
      value: "Fevicol or white glue, and paste made from flour",
    },
  ],
  [
    {
      key: "Mountain fold and valley fold",
      value: "A mountain fold makes the crease point up, a valley fold makes it point down",
    },
    {
      key: "Reason scoring is done before folding thick card",
      value: "It breaks the fibres along the line so the card folds sharply without cracking",
    },
    {
      key: "Value of craft work in school education",
      value:
        "It trains fine motor skill, patience, planning and creative problem solving, and links art to other subjects",
    },
    {
      key: "Best use of waste material in craft",
      value:
        "Recycled paper, bottles and cloth build environmental awareness while keeping craft affordable",
    },
    {
      key: "Papier mache process",
      value:
        "Soaking and pulping paper, moulding it over a form, drying, sanding, priming and finally painting and lacquering",
    },
  ],
);

/* =============================================================== Taxation */

tax(
  "tx:basic-concepts",
  "Basic Concepts and Charge of Income Tax",
  "In the basic concepts of income tax, what is %s?",
  "%k is %v.",
  [
    { key: "Assessment year", value: "The year in which the income of the previous year is taxed" },
    { key: "Previous year", value: "The financial year in which the income is earned" },
    { key: "Assessee", value: "A person by whom any tax or other sum is payable under the Act" },
    {
      key: "Section that defines person",
      value:
        "Section 2(31), covering individual, HUF, company, firm, AOP, BOI, local authority and artificial juridical person",
    },
    { key: "Section that charges income tax", value: "Section 4, the charging section" },
    { key: "Number of heads of income", value: "Five" },
    {
      key: "Gross total income",
      value: "The total of income under all five heads before Chapter VI-A deductions",
    },
    {
      key: "Total income",
      value: "Gross total income less the deductions allowed under Chapter VI-A",
    },
    {
      key: "Rate at which income tax is charged",
      value: "The rate prescribed by the Finance Act for the relevant assessment year",
    },
    {
      key: "Surcharge",
      value:
        "An additional charge on the income tax payable where income exceeds a prescribed limit",
    },
  ],
  [
    {
      key: "Reason income of the previous year is taxed in the assessment year",
      value:
        "Income can only be computed after the year ends, so assessment follows the year of earning",
    },
    {
      key: "Exceptions where income is taxed in the same year",
      value:
        "Shipping business of non-residents, persons leaving India, AOP formed for a short purpose, transfer of property to avoid tax and discontinued business",
    },
    {
      key: "Health and education cess",
      value: "A cess of four per cent charged on income tax plus surcharge",
    },
    {
      key: "Marginal relief",
      value:
        "Relief that ensures the extra tax with surcharge does not exceed the income above the threshold",
    },
    {
      key: "Difference between the old and the new tax regime",
      value:
        "The new regime under section 115BAC offers lower slab rates but withdraws most exemptions and deductions",
    },
  ],
);

tax(
  "tx:house-property",
  "Income from House Property",
  "Under the head house property, what is %s?",
  "%k is %v.",
  [
    { key: "Charging section for house property", value: "Section 22" },
    {
      key: "Basis of charge under house property",
      value:
        "The annual value of property consisting of buildings or land appurtenant thereto, of which the assessee is the owner",
    },
    {
      key: "Annual value",
      value:
        "The sum for which the property might reasonably be expected to be let from year to year",
    },
    {
      key: "Standard deduction under house property",
      value: "Thirty per cent of the net annual value, under section 24(a)",
    },
    { key: "Deduction for interest on borrowed capital", value: "Allowed under section 24(b)" },
    {
      key: "Limit of interest deduction for a self occupied house",
      value: "Two lakh rupees where the loan is for purchase or construction completed in time",
    },
    { key: "Annual value of a self occupied house", value: "Nil" },
    {
      key: "Municipal tax deduction",
      value: "Allowed from gross annual value only when actually paid by the owner during the year",
    },
    {
      key: "Treatment of pre-construction interest",
      value: "Allowed in five equal annual instalments from the year of completion",
    },
    {
      key: "Composite rent",
      value:
        "Rent covering both the building and services or assets, which may need to be split between heads",
    },
  ],
  [
    {
      key: "Computation of gross annual value",
      value:
        "The higher of expected rent and actual rent received, expected rent itself being the higher of municipal and fair rent capped at standard rent",
    },
    {
      key: "Treatment of unrealised rent",
      value:
        "It is excluded from actual rent if the conditions of Rule 4 are met, and is taxed under section 25A when recovered",
    },
    {
      key: "Deemed owner under section 27",
      value:
        "A person treated as owner although not the legal owner, such as a transferor to spouse or minor child or a holder under a long lease",
    },
    {
      key: "Set off limit for loss from house property",
      value:
        "Two lakh rupees against other heads in a year, with the balance carried forward for eight years",
    },
    {
      key: "Treatment of a let out property vacant for part of the year",
      value:
        "Where vacancy reduces the actual rent below expected rent, the actual rent received is taken as gross annual value",
    },
  ],
);

tax(
  "tx:business-profession",
  "Profits and Gains of Business or Profession",
  "Under the head business or profession, what is %s?",
  "%k is %v.",
  [
    { key: "Charging section for business income", value: "Section 28" },
    { key: "Section allowing depreciation", value: "Section 32" },
    {
      key: "Method of depreciation under the Income Tax Act",
      value: "The written down value method on a block of assets",
    },
    {
      key: "Block of assets",
      value: "A group of assets of the same class carrying the same rate of depreciation",
    },
    {
      key: "Additional depreciation",
      value: "Twenty per cent allowed on new plant and machinery in a manufacturing business",
    },
    {
      key: "Section for general business deductions",
      value: "Section 37(1), for revenue expenditure laid out wholly and exclusively for business",
    },
    { key: "Section disallowing payments in cash above the limit", value: "Section 40A(3)" },
    {
      key: "Cash payment limit under section 40A(3)",
      value: "Ten thousand rupees, and thirty five thousand for transporters",
    },
    { key: "Presumptive scheme for small business", value: "Section 44AD" },
    { key: "Presumptive scheme for professionals", value: "Section 44ADA" },
  ],
  [
    {
      key: "Rate of presumptive income under section 44AD",
      value: "Eight per cent of turnover, and six per cent for receipts through banking channels",
    },
    {
      key: "Effect of section 43B",
      value:
        "Certain expenses such as statutory dues are allowed only in the year of actual payment",
    },
    {
      key: "Disallowance under section 40(a)(ia)",
      value:
        "Thirty per cent of a payment to a resident is disallowed where tax was deductible and not deducted or paid",
    },
    {
      key: "Difference between capital and revenue expenditure",
      value:
        "Capital expenditure gives an enduring benefit and is capitalised, revenue expenditure is consumed in the year and is deducted",
    },
    {
      key: "Tax audit requirement under section 44AB",
      value:
        "Audit is required where turnover exceeds the prescribed limit, raised where cash receipts and payments are within five per cent",
    },
  ],
);

tax(
  "tx:capital-gains",
  "Capital Gains",
  "Under the head capital gains, what is %s?",
  "%k is %v.",
  [
    { key: "Charging section for capital gains", value: "Section 45" },
    {
      key: "Capital asset",
      value:
        "Property of any kind held by an assessee, with the exclusions listed in section 2(14)",
    },
    {
      key: "Asset excluded from the definition of capital asset",
      value: "Stock in trade, personal effects and rural agricultural land",
    },
    {
      key: "Transfer",
      value:
        "Sale, exchange, relinquishment, extinguishment of rights or compulsory acquisition, under section 2(47)",
    },
    { key: "Holding period for a long term listed equity share", value: "More than twelve months" },
    {
      key: "Holding period for long term immovable property",
      value: "More than twenty four months",
    },
    {
      key: "Indexation",
      value: "Adjusting the cost of acquisition for inflation using the cost inflation index",
    },
    {
      key: "Exemption for investment in a residential house",
      value: "Section 54, and section 54F for other long term assets",
    },
    {
      key: "Exemption for investment in specified bonds",
      value: "Section 54EC, limited to fifty lakh rupees",
    },
    {
      key: "Capital Gains Account Scheme",
      value:
        "The deposit scheme used where the reinvestment is not completed before the return is filed",
    },
  ],
  [
    {
      key: "Full value of consideration for immovable property",
      value:
        "The stamp duty value is taken where it exceeds the actual consideration beyond the tolerance limit, under section 50C",
    },
    {
      key: "Capital gain on a depreciable asset",
      value: "It is always short term under section 50, even if the asset was held for many years",
    },
    {
      key: "Cost of acquisition of an asset received under a will",
      value:
        "The cost to the previous owner, and the holding period of the previous owner is included",
    },
    {
      key: "Slump sale",
      value:
        "The transfer of an undertaking for a lump sum without values assigned to individual assets, taxed under section 50B",
    },
    {
      key: "Section 112A",
      value:
        "Long term gains on listed equity above one lakh twenty five thousand rupees are taxed at a concessional rate without indexation",
    },
  ],
);

tax(
  "tx:tds-returns",
  "TDS, Advance Tax and Return Filing",
  "In tax administration, what is %s?",
  "%k is %v.",
  [
    { key: "TDS", value: "Tax deducted at source by the payer before making a payment" },
    { key: "TCS", value: "Tax collected at source by the seller from the buyer" },
    { key: "Section for TDS on salary", value: "Section 192" },
    { key: "Section for TDS on interest other than on securities", value: "Section 194A" },
    { key: "Section for TDS on contract payments", value: "Section 194C" },
    { key: "Section for TDS on professional fees", value: "Section 194J" },
    { key: "Section for TDS on rent", value: "Section 194I" },
    { key: "Certificate issued for TDS on salary", value: "Form 16" },
    { key: "Certificate issued for TDS other than on salary", value: "Form 16A" },
    { key: "Statement showing tax credited to an assessee", value: "Form 26AS" },
  ],
  [
    {
      key: "Advance tax instalments for a non-corporate assessee",
      value:
        "Fifteen per cent by June, forty five by September, seventy five by December and the whole by March",
    },
    {
      key: "Interest under sections 234A, 234B and 234C",
      value:
        "For late filing, for default in payment of advance tax and for deferment of instalments",
    },
    {
      key: "Consequence of not quoting a PAN",
      value:
        "Tax is deducted at the higher of the normal rate or twenty per cent under section 206AA",
    },
    {
      key: "Annual Information Statement",
      value:
        "The comprehensive statement of a taxpayer's reported financial transactions available on the portal",
    },
    {
      key: "Belated and updated return",
      value:
        "A belated return is filed under section 139(4) after the due date, an updated return under section 139(8A) within the extended window on payment of additional tax",
    },
  ],
);

/* ==================================================== Auditing and Ethics */

aud(
  "au:documentation",
  "Audit Documentation and Working Papers",
  "In audit documentation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Audit documentation",
      value: "The record of procedures performed, evidence obtained and conclusions reached",
    },
    { key: "Standard on audit documentation", value: "SA 230" },
    {
      key: "Audit file",
      value: "The folder or other storage holding the documentation for one engagement",
    },
    {
      key: "Permanent audit file",
      value: "The file holding information of continuing relevance across years",
    },
    {
      key: "Current audit file",
      value: "The file holding information relating to the audit of the current period only",
    },
    { key: "Ownership of working papers", value: "They are the property of the auditor" },
    {
      key: "Retention period for audit documentation",
      value: "Not less than seven years from the date of the auditor's report",
    },
    {
      key: "Time limit for assembling the final audit file",
      value: "Ordinarily not more than sixty days after the date of the auditor's report",
    },
    {
      key: "Contents of a permanent file",
      value:
        "The memorandum and articles, organisation chart, past financial statements and the engagement letter",
    },
    {
      key: "Purpose of audit documentation",
      value:
        "Evidence of the basis for the opinion and evidence that the audit was planned and performed as per standards",
    },
  ],
  [
    {
      key: "Experienced auditor test",
      value:
        "Documentation must let an experienced auditor with no previous connection understand the work done and the conclusions reached",
    },
    {
      key: "Treatment of a change to documentation after assembly",
      value:
        "Nothing may be deleted, and any addition must record the reason, who made it and when",
    },
    {
      key: "Reason working papers are confidential",
      value:
        "They contain client information the auditor is bound to keep confidential under the Code of Ethics",
    },
    {
      key: "Documentation of significant matters",
      value: "The matter, the professional judgement made and the conclusion must all be recorded",
    },
    {
      key: "Relationship between SA 230 and SQC 1",
      value:
        "SA 230 governs the engagement documentation, SQC 1 the firm's overall quality control policies including retention",
    },
  ],
);

aud(
  "au:company-audit",
  "Company Audit — Appointment, Rights and Duties",
  "In company audit, what is %s?",
  "%k is %v.",
  [
    {
      key: "Section governing appointment of an auditor",
      value: "Section 139 of the Companies Act, 2013",
    },
    {
      key: "Term of appointment of an auditor",
      value: "Five years, from the conclusion of one annual general meeting to the sixth",
    },
    {
      key: "Authority that appoints the first auditor",
      value: "The Board of Directors, within thirty days of registration",
    },
    { key: "Section listing disqualifications of an auditor", value: "Section 141" },
    { key: "Section on removal of an auditor", value: "Section 140" },
    { key: "Section on the powers and duties of an auditor", value: "Section 143" },
    { key: "Section that fixes the remuneration of the auditor", value: "Section 142" },
    { key: "Section listing services an auditor may not render", value: "Section 144" },
    {
      key: "Body that regulates the audit of listed entities in India",
      value: "The National Financial Reporting Authority",
    },
    {
      key: "Report on statutory matters annexed to the audit report",
      value: "The Companies Auditor's Report Order report",
    },
  ],
  [
    {
      key: "Rotation requirement under section 139(2)",
      value:
        "A listed or prescribed company may not appoint an individual for more than one term of five years or a firm for more than two terms",
    },
    {
      key: "Duty of the auditor to report fraud",
      value:
        "Under section 143(12) fraud above the prescribed amount must be reported to the Central Government and below it to the Board or audit committee",
    },
    {
      key: "Right of the auditor on access",
      value:
        "A right of access at all times to the books, accounts and vouchers, wherever kept, and to information from officers",
    },
    {
      key: "Removal before the expiry of the term",
      value: "It requires a special resolution and the previous approval of the Central Government",
    },
    {
      key: "Reporting on internal financial controls",
      value:
        "The auditor of a company must report on the adequacy and operating effectiveness of internal financial controls over financial reporting",
    },
  ],
);

aud(
  "au:professional-ethics",
  "Professional Ethics and the Code of Conduct",
  "In professional ethics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Act governing the profession of chartered accountancy in India",
      value: "The Chartered Accountants Act, 1949",
    },
    {
      key: "Schedule listing professional misconduct by a member in practice",
      value: "The First and Second Schedules to the Act",
    },
    {
      key: "Five fundamental principles of the Code of Ethics",
      value:
        "Integrity, objectivity, professional competence and due care, confidentiality and professional behaviour",
    },
    {
      key: "Independence in audit",
      value:
        "Freedom from influences that compromise professional judgement, in fact and in appearance",
    },
    {
      key: "Self interest threat",
      value: "A threat arising from a financial or other interest of the auditor in the client",
    },
    {
      key: "Self review threat",
      value: "A threat arising when the auditor reviews work that the firm itself performed",
    },
    {
      key: "Advocacy threat",
      value:
        "A threat arising when the auditor promotes the client's position to the point of compromising objectivity",
    },
    {
      key: "Familiarity threat",
      value: "A threat arising from a long or close relationship with the client",
    },
    {
      key: "Intimidation threat",
      value: "A threat arising from actual or perceived pressure on the auditor",
    },
    {
      key: "Body that hears disciplinary cases",
      value: "The Board of Discipline and the Disciplinary Committee of the Institute",
    },
  ],
  [
    {
      key: "Safeguards against threats to independence",
      value:
        "Rotation of partners, engagement quality review, prohibition of certain services and consultation with the ethics standards board",
    },
    {
      key: "Solicitation of professional work",
      value:
        "Advertising or soliciting clients is professional misconduct except as permitted by the Council guidelines",
    },
    {
      key: "Restriction on sharing fees",
      value: "A member may not share fees with a person who is not a member of the Institute",
    },
    {
      key: "Circumstances in which confidentiality may be set aside",
      value:
        "Where disclosure is permitted by the client or required by law or by a professional duty",
    },
    {
      key: "Difference between the First and Second Schedules",
      value:
        "The First deals with less grave misconduct heard by the Board of Discipline, the Second with grave misconduct heard by the Disciplinary Committee",
    },
  ],
);

aud(
  "au:special-entities",
  "Audit of Banks, Insurance and Non-Corporate Entities",
  "In the audit of special entities, what is %s?",
  "%k is %v.",
  [
    { key: "Act governing bank audits in India", value: "The Banking Regulation Act, 1949" },
    {
      key: "Classification of a bank advance overdue beyond ninety days",
      value: "A non-performing asset",
    },
    { key: "Categories of non-performing assets", value: "Substandard, doubtful and loss assets" },
    { key: "Audit conducted at a bank branch by an outside firm", value: "The concurrent audit" },
    {
      key: "Long Form Audit Report",
      value: "The detailed questionnaire-based report submitted by a bank auditor",
    },
    { key: "Act governing insurance company audits", value: "The Insurance Act, 1938" },
    {
      key: "Chief audit risk in an insurance company",
      value: "The adequacy of the provision for outstanding claims and the actuarial reserve",
    },
    {
      key: "Audit of a charitable trust",
      value: "Conducted under the relevant Public Trusts Act and section 12A of the Income Tax Act",
    },
    { key: "Form in which a trust audit report is filed for tax", value: "Form 10B" },
    {
      key: "Chief audit concern in an educational institution",
      value: "Completeness of fee income and proper application of grants",
    },
  ],
  [
    {
      key: "Income recognition norm for a bank",
      value:
        "Income on a non-performing asset is recognised only on actual receipt, not on accrual",
    },
    {
      key: "Provisioning requirement for bank advances",
      value:
        "Provision is made at prescribed rates by asset class, rising with the age and security cover of the advance",
    },
    {
      key: "Chief audit risk in a hospital",
      value:
        "Unbilled or understated patient revenue and the valuation and control of drug and consumable stock",
    },
    {
      key: "Audit of a cooperative society",
      value:
        "Governed by the relevant State Cooperative Societies Act, with a special report on overdue debts and the observance of the Act and bye-laws",
    },
    {
      key: "Reason bank audit relies heavily on the computer system",
      value:
        "Core banking processes almost every transaction, so controls over the system replace the checking of individual vouchers",
    },
  ],
);

/* ================================================== Financial Management */

fm(
  "fm:time-value",
  "Time Value of Money, Risk and Return",
  "In financial mathematics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Time value of money",
      value: "The principle that a rupee today is worth more than a rupee tomorrow",
    },
    { key: "Compounding", value: "Finding the future value of a present sum" },
    { key: "Discounting", value: "Finding the present value of a future sum" },
    { key: "Annuity", value: "A series of equal cash flows at equal intervals" },
    { key: "Annuity due", value: "An annuity whose payments fall at the beginning of each period" },
    { key: "Perpetuity", value: "An annuity that continues for ever" },
    {
      key: "Present value of a perpetuity",
      value: "The annual cash flow divided by the discount rate",
    },
    {
      key: "Rule of 72",
      value: "A rough estimate that money doubles in 72 divided by the rate per cent years",
    },
    { key: "Systematic risk", value: "Market-wide risk that cannot be removed by diversification" },
    {
      key: "Unsystematic risk",
      value: "Firm-specific risk that can be removed by diversification",
    },
  ],
  [
    {
      key: "Capital Asset Pricing Model",
      value: "Expected return equals the risk free rate plus beta times the market risk premium",
    },
    {
      key: "Beta",
      value: "The measure of a security's sensitivity to movements in the market as a whole",
    },
    {
      key: "Effective annual rate against the nominal rate",
      value:
        "The effective rate reflects the frequency of compounding, so it exceeds the nominal rate when compounding is more than annual",
    },
    {
      key: "Coefficient of variation",
      value:
        "Standard deviation divided by the expected return, used to compare risk per unit of return",
    },
    {
      key: "Benefit of portfolio diversification",
      value:
        "Combining assets whose returns are less than perfectly correlated reduces total risk without a matching loss of return",
    },
  ],
);

fm(
  "fm:ratio-analysis",
  "Ratio Analysis and Financial Statement Analysis",
  "In financial analysis, what is %s?",
  "%k is %v.",
  [
    { key: "Current ratio", value: "Current assets divided by current liabilities" },
    { key: "Ideal current ratio", value: "Two to one" },
    {
      key: "Quick ratio",
      value: "Quick assets divided by current liabilities, with an ideal of one to one",
    },
    { key: "Debt equity ratio", value: "Long term debt divided by shareholders' funds" },
    {
      key: "Interest coverage ratio",
      value: "Earnings before interest and tax divided by interest",
    },
    { key: "Inventory turnover ratio", value: "Cost of goods sold divided by average inventory" },
    { key: "Debtors turnover ratio", value: "Credit sales divided by average debtors" },
    { key: "Return on equity", value: "Profit after tax divided by shareholders' funds" },
    {
      key: "Earnings per share",
      value: "Profit available to equity shareholders divided by the number of equity shares",
    },
    { key: "Price earnings ratio", value: "Market price per share divided by earnings per share" },
  ],
  [
    {
      key: "Du Pont analysis",
      value:
        "Return on equity broken into net profit margin, asset turnover and the equity multiplier",
    },
    {
      key: "Reason a high current ratio is not always good",
      value:
        "It may mean idle cash, slow moving stock or poor collection rather than sound liquidity",
    },
    {
      key: "Operating cycle",
      value:
        "The time from buying raw material to collecting cash from the sale of the finished goods",
    },
    {
      key: "Limitation of ratio analysis",
      value:
        "Ratios rest on historical cost accounts, ignore price level changes and can be distorted by different accounting policies",
    },
    {
      key: "Difference between horizontal and vertical analysis",
      value:
        "Horizontal compares figures across years, vertical expresses each item as a percentage of a base within one year",
    },
  ],
);

fm(
  "fm:dividend-policy",
  "Dividend Policy Decisions",
  "In dividend policy, what is %s?",
  "%k is %v.",
  [
    { key: "Dividend", value: "The part of profit distributed to shareholders" },
    { key: "Dividend payout ratio", value: "Dividend per share divided by earnings per share" },
    { key: "Retention ratio", value: "One minus the dividend payout ratio" },
    {
      key: "Model holding dividend policy irrelevant",
      value: "The Modigliani and Miller hypothesis",
    },
    {
      key: "Model holding dividend policy relevant through a valuation formula",
      value: "The Walter model and the Gordon model",
    },
    {
      key: "Interim dividend",
      value: "A dividend declared by the Board between two annual general meetings",
    },
    { key: "Stock dividend", value: "A bonus issue of shares in place of a cash dividend" },
    {
      key: "Stock split",
      value:
        "The division of a share into shares of smaller face value, which does not change the capital",
    },
    {
      key: "Share buyback",
      value:
        "The purchase by a company of its own shares, which returns cash and reduces the share count",
    },
    {
      key: "Stable dividend policy",
      value: "Paying a steady amount or a steady rate of dividend from year to year",
    },
  ],
  [
    {
      key: "Walter model conclusion for a growth firm",
      value:
        "Where the return on investment exceeds the cost of capital the firm should retain all earnings, so the optimum payout is nil",
    },
    {
      key: "Gordon model formula",
      value:
        "Price equals the expected dividend divided by the difference between the cost of equity and the growth rate",
    },
    {
      key: "Bird in hand argument",
      value:
        "Investors prefer a certain present dividend to an uncertain future capital gain, so a higher payout raises value",
    },
    {
      key: "Clientele effect",
      value:
        "A firm attracts the class of investors whose income and tax preference suits its dividend policy",
    },
    {
      key: "Signalling effect of a dividend change",
      value:
        "A rise signals management's confidence in future earnings and a cut usually signals difficulty, so prices react",
    },
  ],
);

fm(
  "fm:cash-treasury",
  "Cash Management and Treasury Operations",
  "In cash management, what is %s?",
  "%k is %v.",
  [
    { key: "Motive of holding cash for day to day operations", value: "The transaction motive" },
    { key: "Motive of holding cash for unforeseen needs", value: "The precautionary motive" },
    { key: "Motive of holding cash to seize a bargain", value: "The speculative motive" },
    {
      key: "Cash budget",
      value: "A statement of expected cash receipts and payments for a period",
    },
    {
      key: "Model that finds the optimum cash balance like an order quantity",
      value: "The Baumol model",
    },
    {
      key: "Model that uses upper and lower control limits for cash",
      value: "The Miller and Orr model",
    },
    {
      key: "Float in cash management",
      value:
        "The difference between the bank balance and the book balance, caused by cheques in transit",
    },
    {
      key: "Lock box system",
      value:
        "A system in which customers pay into a local post box that the bank clears directly, cutting collection time",
    },
    {
      key: "Concentration banking",
      value: "Collecting at regional centres and transferring balances to a central account",
    },
    {
      key: "Marketable securities",
      value:
        "Short term investments in which surplus cash is parked, such as treasury bills and commercial paper",
    },
  ],
  [
    {
      key: "Baumol model formula",
      value:
        "The optimum transaction size is the square root of twice the annual cash need times the transaction cost divided by the holding cost rate",
    },
    {
      key: "Return point in the Miller and Orr model",
      value:
        "The lower limit plus one third of the spread, the level to which the balance is restored on hitting a limit",
    },
    {
      key: "Playing the float",
      value:
        "Writing cheques against a book balance lower than the bank balance in the knowledge of clearing delay, a practice to be used with care",
    },
    {
      key: "Objective of cash management",
      value:
        "To meet payment obligations on time while keeping idle cash, and so the cost of holding it, to a minimum",
    },
    {
      key: "Difference between a cash budget and a fund flow statement",
      value:
        "A cash budget forecasts cash for the future, a fund flow statement explains past changes in working capital",
    },
  ],
);

export const CADRE_PRO_FULL_TEMPLATES = templates;
