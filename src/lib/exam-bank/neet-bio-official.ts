/**
 * NEET Biology chapters that the official NMC syllabus lists and the bank
 * did not have.
 *
 * Checked against the National Medical Commission (UGMEB) NEET UG syllabus,
 * which sets Biology in ten units. The bank already held 21 of the listed
 * chapters; these are the remaining ones. Chapter names follow the official
 * document, not a coaching book.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

/** NEET UG only. AIIMS and JIPMER are merged into NEET. */
const NEET = ["NEET"];

const templates: Template[] = [];
const bio = chapterFactory(templates, "Biology", NEET);

/* ------------------------------- Unit 1: Diversity in the Living World */

bio(
  "nb:living-world",
  "The Living World",
  "In the study of the living world, what is %s?",
  "%k is %v.",
  [
    {
      key: "Taxonomy",
      value: "The science of identification, nomenclature and classification of organisms",
    },
    {
      key: "Systematics",
      value: "The study of the diversity of organisms and their evolutionary relationships",
    },
    { key: "Basic unit of classification", value: "The species" },
    {
      key: "Order of taxonomic categories from lowest to highest",
      value: "Species, genus, family, order, class, phylum and kingdom",
    },
    {
      key: "Binomial nomenclature",
      value: "The two-word naming system of genus and species, given by Carolus Linnaeus",
    },
    {
      key: "Code that governs the naming of animals",
      value: "The International Code of Zoological Nomenclature",
    },
    {
      key: "Herbarium",
      value: "A store of dried, pressed and preserved plant specimens mounted on sheets",
    },
    { key: "Taxon", value: "A taxonomic group of any rank" },
    {
      key: "Key in taxonomy",
      value: "An analytical device with paired contrasting couplets used to identify an organism",
    },
    { key: "Monograph", value: "A work containing all the information on any one taxon" },
  ],
  [
    {
      key: "Rules of binomial nomenclature",
      value:
        "Names are in Latin and italicised, the genus begins with a capital and the species with a small letter, and both are underlined when handwritten",
    },
    {
      key: "Difference between a herbarium and a botanical garden",
      value:
        "A herbarium holds dried preserved specimens, a botanical garden grows living plants under their scientific names",
    },
    {
      key: "Museum in taxonomic study",
      value:
        "A collection of preserved plant and animal specimens, insects in boxes and larger animals as skeletons or in preservative",
    },
    {
      key: "Reason species is called the basic unit",
      value:
        "It is the smallest group of organisms that are fundamentally similar and can interbreed to give fertile offspring",
    },
    {
      key: "Metabolism as a defining feature of life",
      value:
        "The sum of all chemical reactions in the body, and no non-living object performs metabolism",
    },
  ],
);

bio(
  "nb:plant-kingdom",
  "Plant Kingdom",
  "In the plant kingdom, what is %s?",
  "%k is %v.",
  [
    {
      key: "Five main groups of the plant kingdom",
      value: "Algae, bryophytes, pteridophytes, gymnosperms and angiosperms",
    },
    {
      key: "Amphibians of the plant kingdom",
      value: "Bryophytes, which live on land but need water for reproduction",
    },
    { key: "First vascular land plants", value: "Pteridophytes" },
    { key: "Plants that bear naked seeds", value: "Gymnosperms" },
    { key: "Pigment of green algae", value: "Chlorophyll a and b" },
    { key: "Pigment that gives brown algae its colour", value: "Fucoxanthin" },
    { key: "Pigment that gives red algae its colour", value: "r-phycoerythrin" },
    {
      key: "Dominant phase in the life cycle of a bryophyte",
      value: "The gametophyte, which is haploid",
    },
    {
      key: "Dominant phase in the life cycle of a pteridophyte",
      value: "The sporophyte, which is diploid",
    },
    {
      key: "Double fertilisation",
      value:
        "The fusion of one male gamete with the egg and the other with the two polar nuclei, unique to angiosperms",
    },
  ],
  [
    {
      key: "Alternation of generations",
      value:
        "The regular alternation of a haploid gametophyte and a diploid sporophyte in the life cycle of a plant",
    },
    {
      key: "Haplontic, diplontic and haplo-diplontic life cycles",
      value:
        "In the haplontic type the gametophyte dominates as in most algae, in the diplontic the sporophyte dominates as in seed plants, and the haplo-diplontic has both free-living as in bryophytes and pteridophytes",
    },
    {
      key: "Heterospory",
      value:
        "The production of two kinds of spore, microspores and megaspores, seen in Selaginella and Salvinia and regarded as a step towards the seed habit",
    },
    {
      key: "Coralloid roots of Cycas",
      value: "Small specialised roots that host nitrogen-fixing cyanobacteria",
    },
    {
      key: "Reason gymnosperms have no fruit",
      value:
        "The ovules are not enclosed in an ovary, so after fertilisation the seed remains naked and no fruit wall forms",
    },
  ],
);

bio(
  "nb:animal-kingdom",
  "Animal Kingdom",
  "In the animal kingdom, what is %s?",
  "%k is %v.",
  [
    {
      key: "Basis of the classification of animals",
      value: "Levels of organisation, symmetry, germ layers, coelom, segmentation and notochord",
    },
    { key: "Phylum of sponges", value: "Porifera" },
    { key: "Phylum with cnidoblasts", value: "Coelenterata, or Cnidaria" },
    { key: "Phylum of flatworms", value: "Platyhelminthes" },
    { key: "Phylum of roundworms", value: "Aschelminthes, or Nematoda" },
    { key: "Phylum with metameric segmentation and a true coelom", value: "Annelida" },
    { key: "Largest phylum of the animal kingdom", value: "Arthropoda" },
    { key: "Phylum with a mantle and a radula", value: "Mollusca" },
    { key: "Phylum with a water vascular system", value: "Echinodermata" },
    { key: "Three subphyla of Chordata", value: "Urochordata, Cephalochordata and Vertebrata" },
  ],
  [
    {
      key: "Four fundamental characters of a chordate",
      value:
        "A notochord, a dorsal hollow nerve cord, paired pharyngeal gill slits and a post-anal tail",
    },
    {
      key: "Difference between a coelomate, pseudocoelomate and acoelomate",
      value:
        "A coelomate has a body cavity lined by mesoderm, a pseudocoelomate has a cavity not fully lined by mesoderm, and an acoelomate has no cavity",
    },
    {
      key: "Diploblastic and triploblastic organisation",
      value:
        "Diploblastic animals have two germ layers with mesoglea between, triploblastic animals have a true mesoderm",
    },
    {
      key: "Reason echinoderms are called so",
      value: "They have a spiny endoskeleton of calcareous ossicles",
    },
    {
      key: "Distinguishing feature of Aves",
      value:
        "The presence of feathers, forelimbs modified into wings, a beak without teeth and pneumatic bones",
    },
  ],
);

/* ------------------- Unit 2: Structural Organisation in Plants and Animals */

bio(
  "nb:anatomy-flowering",
  "Anatomy of Flowering Plants",
  "In plant anatomy, what is %s?",
  "%k is %v.",
  [
    {
      key: "Meristematic tissue",
      value: "Tissue of actively dividing cells responsible for growth",
    },
    {
      key: "Apical meristem",
      value: "The meristem at the tip of root and shoot, causing increase in length",
    },
    {
      key: "Lateral meristem",
      value:
        "The meristem that causes increase in girth, such as the vascular cambium and cork cambium",
    },
    { key: "Three simple permanent tissues", value: "Parenchyma, collenchyma and sclerenchyma" },
    { key: "Complex permanent tissues", value: "Xylem and phloem" },
    { key: "Components of xylem", value: "Tracheids, vessels, xylem fibres and xylem parenchyma" },
    {
      key: "Components of phloem",
      value: "Sieve tube elements, companion cells, phloem fibres and phloem parenchyma",
    },
    {
      key: "Tissue system of the ground tissue",
      value: "Cortex, pericycle, pith and medullary rays",
    },
    {
      key: "Casparian strip",
      value: "The band of suberin on the radial and transverse walls of the endodermis",
    },
    {
      key: "Vascular bundle of a dicot stem",
      value: "Conjoint, collateral and open, arranged in a ring",
    },
  ],
  [
    {
      key: "Difference between a dicot and a monocot root",
      value:
        "A dicot root has two to four xylem bundles and a cambium develops later, a monocot root has many xylem bundles and no cambium",
    },
    {
      key: "Secondary growth in a dicot stem",
      value:
        "The vascular cambium forms secondary xylem inward and secondary phloem outward, while the cork cambium forms the periderm",
    },
    {
      key: "Annual rings",
      value:
        "Rings of early and late wood formed in one year, whose count gives the age of the tree",
    },
    {
      key: "Heartwood and sapwood",
      value:
        "Heartwood is the dark, non-conducting inner wood filled with tyloses and resins, sapwood is the lighter outer conducting wood",
    },
    {
      key: "Difference between bulliform cells and guard cells",
      value:
        "Bulliform cells are large empty epidermal cells of a monocot leaf that roll it in water stress, guard cells are bean-shaped chloroplast-bearing cells that regulate the stoma",
    },
  ],
);

bio(
  "nb:structural-animals",
  "Structural Organisation in Animals",
  "In animal tissue and organisation, what is %s?",
  "%k is %v.",
  [
    { key: "Four types of animal tissue", value: "Epithelial, connective, muscular and neural" },
    {
      key: "Epithelium that lines the blood vessels",
      value: "Simple squamous epithelium, called endothelium",
    },
    {
      key: "Epithelium of the inner lining of the small intestine",
      value: "Simple columnar epithelium with microvilli",
    },
    { key: "Junction that stops leakage across a tissue", value: "The tight junction" },
    { key: "Junction that allows the exchange of ions between cells", value: "The gap junction" },
    {
      key: "Most abundant connective tissue of the body",
      value: "Areolar, a loose connective tissue",
    },
    { key: "Fluid connective tissues", value: "Blood and lymph" },
    { key: "Muscle that is striated and voluntary", value: "Skeletal muscle" },
    { key: "Muscle that is striated and involuntary", value: "Cardiac muscle" },
    { key: "Functional unit of the nervous tissue", value: "The neuron" },
  ],
  [
    {
      key: "Difference between tendon and ligament",
      value:
        "A tendon is dense regular connective tissue joining muscle to bone, a ligament is elastic and joins bone to bone",
    },
    {
      key: "Intercalated disc",
      value:
        "The junction between adjacent cardiac muscle cells that lets the whole heart contract as a unit",
    },
    {
      key: "Structures of the earthworm's digestive tract in order",
      value: "Mouth, buccal cavity, pharynx, oesophagus, gizzard, stomach, intestine and anus",
    },
    {
      key: "Nephridia of the earthworm",
      value: "The excretory organs, of three types, septal, integumentary and pharyngeal",
    },
    {
      key: "Reason the frog is a poikilotherm",
      value:
        "Its body temperature changes with the surroundings, so it hibernates in winter and aestivates in summer",
    },
  ],
);

/* ------------------------------------------ Unit 4: Plant Physiology */

bio(
  "nb:transport-plants",
  "Transport in Plants and Mineral Nutrition",
  "In plant transport and nutrition, what is %s?",
  "%k is %v.",
  [
    {
      key: "Diffusion",
      value: "The passive movement of substances from a region of higher to lower concentration",
    },
    { key: "Osmosis", value: "The diffusion of water across a semi-permeable membrane" },
    { key: "Water potential of pure water", value: "Zero, the highest value" },
    {
      key: "Plasmolysis",
      value: "The shrinking of the protoplast away from the cell wall in a hypertonic solution",
    },
    { key: "Imbibition", value: "The absorption of water by a solid colloid causing it to swell" },
    {
      key: "Theory explaining the ascent of sap",
      value: "The cohesion-tension and transpiration pull theory",
    },
    {
      key: "Theory explaining the translocation of sugars",
      value: "The pressure flow, or mass flow, hypothesis",
    },
    {
      key: "Essential macronutrients of plants",
      value:
        "Carbon, hydrogen, oxygen, nitrogen, phosphorus, sulphur, potassium, calcium and magnesium",
    },
    {
      key: "Element whose deficiency causes chlorosis",
      value: "Nitrogen, magnesium, iron, sulphur, manganese, zinc or molybdenum",
    },
    { key: "Enzyme of biological nitrogen fixation", value: "Nitrogenase" },
  ],
  [
    {
      key: "Apoplast and symplast pathways",
      value:
        "The apoplast moves water through cell walls and intercellular spaces, the symplast through the cytoplasm and plasmodesmata",
    },
    {
      key: "Role of leghaemoglobin in a root nodule",
      value: "It scavenges oxygen, because nitrogenase is destroyed by oxygen",
    },
    {
      key: "Root pressure",
      value:
        "The positive pressure developed in the xylem by active absorption of ions, which causes guttation but cannot account for the full ascent of sap",
    },
    {
      key: "Difference between a macronutrient and a micronutrient",
      value:
        "Macronutrients are needed in concentrations above ten millimole per kilogram of dry matter, micronutrients below it",
    },
    {
      key: "Criteria of essentiality of an element",
      value:
        "The plant cannot complete its life cycle without it, it cannot be replaced by another element, and it is directly involved in metabolism",
    },
  ],
);

bio(
  "nb:plant-growth",
  "Plant Growth and Development",
  "In plant growth and development, what is %s?",
  "%k is %v.",
  [
    {
      key: "Growth",
      value: "An irreversible permanent increase in the size of an organ or its parts",
    },
    {
      key: "Three phases of growth",
      value: "The phases of meristematic, elongation and maturation",
    },
    {
      key: "Curve obtained when growth is plotted against time",
      value: "A sigmoid, or S-shaped, curve",
    },
    {
      key: "Differentiation",
      value:
        "The process by which cells derived from the meristem mature to perform specific functions",
    },
    {
      key: "Dedifferentiation",
      value: "The regaining of the capacity to divide by a differentiated cell",
    },
    {
      key: "Plasticity in plants",
      value:
        "The ability to follow different pathways of growth in different conditions, as in heterophylly",
    },
    { key: "Hormone that promotes cell elongation and apical dominance", value: "Auxin" },
    { key: "Hormone that promotes cell division", value: "Cytokinin" },
    { key: "Hormone called the stress hormone", value: "Abscisic acid" },
    { key: "Gaseous plant hormone", value: "Ethylene" },
  ],
  [
    {
      key: "Photoperiodism",
      value:
        "The response of flowering to the relative length of day and night, perceived by the leaves",
    },
    { key: "Vernalisation", value: "The promotion of flowering by a period of low temperature" },
    {
      key: "Role of gibberellin in brewing",
      value:
        "It induces alpha-amylase in the aleurone layer of barley, which speeds up the malting process",
    },
    {
      key: "Bolting",
      value:
        "The sudden elongation of the internode before flowering, induced by gibberellin in rosette plants",
    },
    {
      key: "Difference between arithmetic and geometric growth",
      value:
        "In arithmetic growth only one daughter cell continues to divide, in geometric growth both do, giving the exponential phase of the sigmoid curve",
    },
  ],
);

/* ----------------------------------------- Unit 5: Human Physiology */

bio(
  "nb:locomotion",
  "Locomotion and Movement",
  "In locomotion and movement, what is %s?",
  "%k is %v.",
  [
    {
      key: "Three types of movement shown by cells of the human body",
      value: "Amoeboid, ciliary and muscular",
    },
    { key: "Number of bones in the adult human body", value: "Two hundred and six" },
    {
      key: "Bones of the axial skeleton",
      value: "Eighty, the skull, vertebral column, sternum and ribs",
    },
    {
      key: "Bones of the appendicular skeleton",
      value: "One hundred and twenty six, the limbs and girdles",
    },
    { key: "Number of vertebrae in the human vertebral column", value: "Twenty six" },
    { key: "Number of pairs of ribs", value: "Twelve" },
    { key: "Functional unit of a striated muscle fibre", value: "The sarcomere" },
    { key: "Protein of the thick filament", value: "Myosin" },
    { key: "Proteins of the thin filament", value: "Actin, tropomyosin and troponin" },
    { key: "Ion that triggers muscle contraction", value: "Calcium" },
  ],
  [
    {
      key: "Sliding filament theory",
      value:
        "Contraction occurs when the thin filaments slide over the thick filaments, so the sarcomere shortens while the filaments keep their length",
    },
    {
      key: "Change in the bands during contraction",
      value:
        "The I band shortens and the H zone disappears, while the A band stays the same length",
    },
    {
      key: "Red and white muscle fibres",
      value:
        "Red fibres are rich in myoglobin and mitochondria and are fatigue resistant, white fibres have less myoglobin, depend on glycolysis and fatigue quickly",
    },
    {
      key: "Myasthenia gravis",
      value:
        "An autoimmune disorder affecting the neuromuscular junction, causing fatigue and weakness of the skeletal muscle",
    },
    {
      key: "Difference between a ball and socket joint and a hinge joint",
      value:
        "A ball and socket joint as at the shoulder allows movement in all planes, a hinge joint as at the knee allows movement in one plane only",
    },
  ],
);

/* --------------------------------------------- Unit 6: Reproduction */

bio(
  "nb:sexual-repro-plants",
  "Sexual Reproduction in Flowering Plants",
  "In plant reproduction, what is %s?",
  "%k is %v.",
  [
    {
      key: "Microsporogenesis",
      value: "The formation of microspores from the pollen mother cell by meiosis",
    },
    {
      key: "Megasporogenesis",
      value: "The formation of megaspores from the megaspore mother cell by meiosis",
    },
    { key: "Number of cells in a mature embryo sac", value: "Seven cells with eight nuclei" },
    {
      key: "Cells of a typical embryo sac",
      value: "One egg, two synergids, three antipodals and one central cell with two polar nuclei",
    },
    {
      key: "Filiform apparatus",
      value: "The thickening in the synergids that guides the pollen tube into the embryo sac",
    },
    {
      key: "Triple fusion",
      value:
        "The fusion of one male gamete with the two polar nuclei to form the primary endosperm nucleus",
    },
    { key: "Ploidy of the endosperm", value: "Triploid" },
    { key: "Apomixis", value: "The formation of a seed without fertilisation" },
    { key: "Polyembryony", value: "The occurrence of more than one embryo in a seed" },
    {
      key: "Parthenocarpy",
      value: "The development of a fruit without fertilisation, giving a seedless fruit",
    },
  ],
  [
    {
      key: "Significance of double fertilisation",
      value:
        "It gives a diploid zygote and a triploid endosperm, so food is laid down only when fertilisation has actually occurred",
    },
    {
      key: "Outbreeding devices in flowering plants",
      value:
        "Dichogamy, self incompatibility, unisexuality and the release of pollen before the stigma matures, all of which prevent inbreeding",
    },
    {
      key: "Difference between geitonogamy and xenogamy",
      value:
        "Geitonogamy transfers pollen between two flowers of the same plant, xenogamy between flowers of different plants and so brings genetic variation",
    },
    {
      key: "Advantage of apomixis to a farmer",
      value:
        "Hybrid seed can be produced year after year without segregation, so hybrid vigour is not lost",
    },
    {
      key: "Structure of the pollen wall",
      value:
        "An outer sporopollenin exine with germ pores and an inner cellulose and pectin intine",
    },
  ],
);

bio(
  "nb:human-reproduction",
  "Human Reproduction and Reproductive Health",
  "In human reproduction, what is %s?",
  "%k is %v.",
  [
    { key: "Site of sperm production", value: "The seminiferous tubules of the testis" },
    { key: "Cells that nourish the developing sperm", value: "Sertoli cells" },
    { key: "Cells that secrete testosterone", value: "The Leydig, or interstitial, cells" },
    {
      key: "Usual site of fertilisation in the human female",
      value: "The ampullary-isthmic junction of the fallopian tube",
    },
    { key: "Stage of the embryo that implants in the uterus", value: "The blastocyst" },
    { key: "Hormone detected in a pregnancy test", value: "Human chorionic gonadotropin" },
    { key: "Hormone that triggers ovulation", value: "The luteinising hormone surge" },
    { key: "Length of the human menstrual cycle", value: "About twenty eight days" },
    {
      key: "Duration of human pregnancy",
      value: "About nine months, or two hundred and eighty days",
    },
    { key: "Hormone responsible for milk ejection", value: "Oxytocin" },
  ],
  [
    {
      key: "Phases of the menstrual cycle",
      value:
        "The menstrual phase, the follicular or proliferative phase, ovulation, and the luteal or secretory phase",
    },
    {
      key: "Role of the corpus luteum",
      value:
        "It secretes progesterone, which maintains the endometrium, and it degenerates if fertilisation does not occur",
    },
    {
      key: "Amniocentesis and its misuse",
      value:
        "A test of foetal chromosomes and metabolic disorders from amniotic fluid, whose misuse for sex determination is banned by law",
    },
    {
      key: "Assisted reproductive technologies",
      value:
        "IVF with embryo transfer, ZIFT, GIFT, ICSI, artificial insemination and intrauterine insemination",
    },
    {
      key: "Difference between ZIFT and GIFT",
      value:
        "ZIFT transfers a zygote or early embryo into the fallopian tube, GIFT transfers an ovum from a donor into the fallopian tube of a female who cannot produce one",
    },
  ],
);

/* --------------------------------- Unit 7: Genetics and Evolution */

bio(
  "nb:inheritance-variation",
  "Principles of Inheritance and Variation",
  "In Mendelian genetics, what is %s?",
  "%k is %v.",
  [
    { key: "Plant used by Mendel", value: "The garden pea, Pisum sativum" },
    {
      key: "Law of dominance",
      value: "In a heterozygote only one allele, the dominant one, expresses itself",
    },
    {
      key: "Law of segregation",
      value:
        "The two alleles of a pair separate during gamete formation, so each gamete receives only one",
    },
    {
      key: "Law of independent assortment",
      value: "The alleles of two different genes assort independently of each other",
    },
    { key: "Phenotypic ratio of a monohybrid cross in F2", value: "Three to one" },
    { key: "Phenotypic ratio of a dihybrid cross in F2", value: "Nine to three to three to one" },
    {
      key: "Test cross",
      value:
        "A cross of an individual of dominant phenotype with the recessive parent to find its genotype",
    },
    {
      key: "Incomplete dominance",
      value:
        "The condition in which the heterozygote shows an intermediate phenotype, as in Mirabilis jalapa",
    },
    {
      key: "Codominance",
      value: "The condition in which both alleles express fully, as in the AB blood group",
    },
    { key: "Disorder caused by an extra chromosome 21", value: "Down syndrome" },
  ],
  [
    {
      key: "Linkage and recombination",
      value:
        "Genes on the same chromosome tend to be inherited together, and crossing over separates them at a frequency proportional to the distance between them",
    },
    {
      key: "Pleiotropy",
      value: "A single gene affecting more than one character, as the gene for phenylketonuria",
    },
    {
      key: "Chromosomal theory of inheritance",
      value:
        "Proposed by Sutton and Boveri, it holds that the behaviour of chromosomes in meiosis parallels the behaviour of Mendel's factors",
    },
    {
      key: "Sex determination in human beings",
      value:
        "The XX and XY system, in which the male is heterogametic and the sperm decides the sex of the child",
    },
    {
      key: "Difference between Klinefelter and Turner syndrome",
      value:
        "Klinefelter is 47 with XXY, a sterile male with some feminine traits, Turner is 45 with X0, a sterile female with rudimentary ovaries",
    },
  ],
);

bio(
  "nb:evolution-official",
  "Evolution",
  "In evolutionary biology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Theory of natural selection",
      value:
        "Charles Darwin's theory that individuals better fitted to the environment leave more offspring",
    },
    { key: "Book in which Darwin published his theory", value: "On the Origin of Species" },
    {
      key: "Theory of use and disuse",
      value:
        "The theory of Lamarck, that organs used develop and unused organs are lost, and that such traits are inherited",
    },
    {
      key: "Homologous organs",
      value:
        "Organs of the same basic structure and origin but different function, showing divergent evolution",
    },
    {
      key: "Analogous organs",
      value: "Organs of different origin but similar function, showing convergent evolution",
    },
    {
      key: "Experiment that produced amino acids from a simulated primitive atmosphere",
      value: "The Miller and Urey experiment",
    },
    {
      key: "Hardy-Weinberg principle",
      value:
        "In a large random-mating population free of selection, the allele frequencies remain constant",
    },
    {
      key: "Equation of the Hardy-Weinberg principle",
      value: "p squared plus 2pq plus q squared equals one",
    },
    {
      key: "Earliest known human-like ancestor",
      value: "Ramapithecus, followed by Australopithecus and Homo habilis",
    },
    {
      key: "Adaptive radiation",
      value:
        "The evolution of many different species from one ancestral form in a new habitat, as in Darwin's finches",
    },
  ],
  [
    {
      key: "Five factors that disturb Hardy-Weinberg equilibrium",
      value:
        "Gene migration or gene flow, genetic drift, mutation, genetic recombination and natural selection",
    },
    {
      key: "Founder effect",
      value:
        "A marked change in allele frequency when a small group founds a new population, so the new population differs from the original",
    },
    {
      key: "Industrial melanism",
      value:
        "The rise of the dark peppered moth in industrial England, a documented case of natural selection",
    },
    { key: "Three types of natural selection", value: "Stabilising, directional and disruptive" },
    {
      key: "Evidence for evolution from embryology",
      value:
        "Vertebrate embryos share features such as gill slits, which Haeckel over-interpreted but which still show common ancestry",
    },
  ],
);

/* -------------------------------- Unit 8: Biology and Human Welfare */

bio(
  "nb:microbes-welfare",
  "Microbes in Human Welfare",
  "In the use of microbes, what is %s?",
  "%k is %v.",
  [
    { key: "Microbe used in making curd", value: "Lactobacillus, the lactic acid bacteria" },
    {
      key: "Microbe used in baking and brewing",
      value: "Saccharomyces cerevisiae, the baker's yeast",
    },
    { key: "Organism from which penicillin was obtained", value: "Penicillium notatum" },
    { key: "Fungus that yields the cholesterol-lowering statin", value: "Monascus purpureus" },
    {
      key: "Immunosuppressive drug from a fungus",
      value: "Cyclosporin A, from Trichoderma polysporum",
    },
    {
      key: "Enzyme used to clear clots in blood vessels",
      value: "Streptokinase, from Streptococcus",
    },
    { key: "Bacterium used as a biological insecticide", value: "Bacillus thuringiensis" },
    { key: "Fungus used as a biological control of plant disease", value: "Trichoderma" },
    { key: "Biofertiliser formed by a fungus and a root", value: "Mycorrhiza, chiefly Glomus" },
    { key: "Gas that makes bread rise", value: "Carbon dioxide, produced by yeast" },
  ],
  [
    {
      key: "Stages of sewage treatment",
      value:
        "Primary treatment removes solids by settling, secondary or biological treatment uses aerobic flocs and then anaerobic digestion of the sludge",
    },
    {
      key: "Flocs in sewage treatment",
      value:
        "Masses of bacteria with fungal filaments that consume the organic matter and reduce the biochemical oxygen demand",
    },
    {
      key: "Composition of biogas",
      value:
        "Chiefly methane, with carbon dioxide and hydrogen, produced by methanogens such as Methanobacterium",
    },
    {
      key: "Role of Nucleopolyhedrovirus",
      value:
        "A narrow-spectrum insecticidal virus that controls insect pests without harming other organisms, useful in integrated pest management",
    },
    {
      key: "Reason Bacillus thuringiensis is safe to non-target insects",
      value:
        "The toxin is an inactive protoxin that becomes active only in the alkaline gut of a susceptible insect",
    },
  ],
);

/* ------------------------------- Unit 10: Ecology and Environment */

bio(
  "nb:organisms-populations",
  "Organisms and Populations",
  "In population ecology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Population",
      value: "A group of individuals of the same species living in a given area",
    },
    {
      key: "Population density",
      value: "The number of individuals of a population per unit area or volume",
    },
    { key: "Natality", value: "The number of births per unit population per unit time" },
    { key: "Mortality", value: "The number of deaths per unit population per unit time" },
    {
      key: "Exponential growth equation",
      value: "dN by dt equals rN, which gives a J-shaped curve",
    },
    {
      key: "Logistic growth curve",
      value: "The S-shaped or sigmoid curve obtained when resources are limited",
    },
    {
      key: "Carrying capacity",
      value: "The maximum population size an environment can support, denoted K",
    },
    { key: "Mutualism", value: "An interaction in which both species benefit" },
    {
      key: "Commensalism",
      value: "An interaction in which one species benefits and the other is unaffected",
    },
    {
      key: "Amensalism",
      value: "An interaction in which one species is harmed and the other is unaffected",
    },
  ],
  [
    {
      key: "Gause's competitive exclusion principle",
      value:
        "Two species competing for the same limiting resource cannot coexist indefinitely, and the inferior competitor is eliminated",
    },
    {
      key: "Difference between an r-selected and a K-selected species",
      value:
        "An r-selected species produces many small offspring with little care, a K-selected species produces few offspring with much parental care",
    },
    {
      key: "Brood parasitism",
      value:
        "A bird laying its eggs in the nest of another species, as the cuckoo does in a crow's nest",
    },
    {
      key: "Allen's rule",
      value: "Mammals of colder climates have shorter ears and limbs, which reduces heat loss",
    },
    {
      key: "Diapause",
      value:
        "A stage of suspended development used by some zooplankton to survive unfavourable conditions",
    },
  ],
);

bio(
  "nb:ecosystem-biodiversity",
  "Ecosystem, Biodiversity and Conservation",
  "In ecosystem ecology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Productivity in an ecosystem",
      value: "The rate of biomass production per unit area per unit time",
    },
    {
      key: "Gross primary productivity",
      value: "The rate at which producers capture and store energy as biomass",
    },
    {
      key: "Net primary productivity",
      value: "Gross primary productivity minus the respiration of the producers",
    },
    {
      key: "Ten per cent law",
      value:
        "Only about ten per cent of the energy at one trophic level passes to the next, given by Lindeman",
    },
    { key: "Pyramid that is always upright", value: "The pyramid of energy" },
    {
      key: "Ecological succession on a bare rock",
      value: "Xerarch primary succession, beginning with lichens as pioneers",
    },
    {
      key: "Ecological succession in a water body",
      value: "Hydrarch succession, ending in a mesic forest community",
    },
    {
      key: "Number of biodiversity hotspots in India",
      value: "Four, the Western Ghats and Sri Lanka, the Himalaya, Indo-Burma and Sundaland",
    },
    {
      key: "In situ conservation",
      value:
        "Conservation of a species in its natural habitat, as in national parks and biosphere reserves",
    },
    {
      key: "Ex situ conservation",
      value:
        "Conservation outside the natural habitat, as in zoos, botanical gardens and seed banks",
    },
  ],
  [
    {
      key: "Reason the pyramid of biomass in a sea can be inverted",
      value:
        "The producers are tiny phytoplankton with a very small standing biomass but a very high turnover, which supports a larger biomass of consumers",
    },
    {
      key: "Species-area relationship",
      value:
        "Alexander von Humboldt's finding that species richness rises with area to a limit, with the slope of the log plot usually between 0.1 and 0.2",
    },
    {
      key: "Rivet popper hypothesis",
      value:
        "Paul Ehrlich's analogy that losing each species is like removing a rivet from an aircraft, harmless at first but fatal if key rivets go",
    },
    {
      key: "Four causes of biodiversity loss",
      value:
        "Habitat loss and fragmentation, over-exploitation, alien species invasion and co-extinction",
    },
    {
      key: "Sacred groves",
      value:
        "Forest patches protected on religious grounds by local communities, a traditional form of in situ conservation",
    },
  ],
);

export const NEET_BIO_OFFICIAL_TEMPLATES = templates;
