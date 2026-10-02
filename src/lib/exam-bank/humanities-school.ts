/**
 * CBSE and ISC senior secondary Humanities.
 *
 * Sources, all from the CBSE Senior Secondary Curriculum 2026-27 published on
 * cbseacademic.nic.in:
 *   History_SecP2_2026-27.pdf         — History, subject code 027
 *   PoliticalScience_SecP2_2026-27.pdf — Political Science, code 028
 *   Geography_SecP2_2026-27.pdf       — Geography, subject code 029
 *
 * History XI (Themes in World History), 80 theory: Unit I Early Societies
 *   (Theme 1) 10; Unit II Empires (Themes 2-3) 20; Unit III Changing
 *   Traditions (Themes 4-5) 20; Unit IV Towards Modernisation (Themes 6-7)
 *   25; Map 5.
 * History XII (Themes in Indian History): Part I 25, Part II 25, Part III 25,
 *   four themes each.
 *
 * Political Science XI: Part A Indian Constitution at Work 40 (ten chapters),
 *   Part B Political Theory 40 (eight chapters).
 * Political Science XII: Part A Contemporary World Politics (six chapters at
 *   6 marks each), Part B Politics in India since Independence.
 *
 * Geography XI: Fundamentals of Physical Geography + India Physical
 *   Environment. Geography XII: Fundamentals of Human Geography + India
 *   People and Economy, with map work.
 *
 * These six subjects were missing from the bank as school papers. The bank
 * held History, Polity and Geography only in their civil-services grade
 * form, which is the wrong level for a board candidate.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const H11 = ["CBSE Class 11", "ISC Class 11", "CUET"];
const H12 = ["CBSE Class 12", "ISC Class 12", "CUET"];

const templates: Template[] = [];
const h11 = chapterFactory(templates, "History Class 11", H11);
const h12 = chapterFactory(templates, "History Class 12", H12);
const p11 = chapterFactory(templates, "Political Science Class 11", H11);
const p12 = chapterFactory(templates, "Political Science Class 12", H12);
const g11 = chapterFactory(templates, "Geography Class 11", H11);
const g12 = chapterFactory(templates, "Geography Class 12", H12);

/* ================== History Class 11 — Themes in World History ========= */

h11(
  "h11:early-empires",
  "Early Societies and Empires",
  "In Themes in World History, what is %s?",
  "%k is %v.",
  [
    { key: "Theme of Unit I", value: "Writing and City Life, based on Mesopotamia" },
    {
      key: "Region called Mesopotamia",
      value: "The land between the Euphrates and the Tigris, in present-day Iraq",
    },
    {
      key: "Script of Mesopotamia",
      value: "Cuneiform, written with a reed stylus on clay tablets",
    },
    { key: "Earliest known city of southern Mesopotamia", value: "Uruk" },
    { key: "Ziggurat", value: "The stepped temple tower at the centre of a Mesopotamian city" },
    { key: "Empire studied under An Empire Across Three Continents", value: "The Roman Empire" },
    { key: "Founder of the Roman Principate", value: "Augustus, in 27 BCE" },
    { key: "Nomadic empire studied in Theme 3", value: "The Mongol empire of Genghis Khan" },
    { key: "Original name of Genghis Khan", value: "Temujin" },
    { key: "Yasa", value: "The code of law associated with Genghis Khan and the Mongol state" },
  ],
  [
    {
      key: "Reason writing developed in Mesopotamia",
      value:
        "The temple and the palace needed to record transactions in a growing urban economy, so accounting need, not literature, drove the invention of the script",
    },
    {
      key: "Three continents of the Roman Empire",
      value:
        "Europe, Asia and Africa, with the Mediterranean at the centre of the empire's communications",
    },
    {
      key: "Difference between the Principate and the Dominate",
      value:
        "Under the Principate the emperor was formally the leading citizen alongside the Senate, under the Dominate from Diocletian he was openly an absolute ruler",
    },
    {
      key: "Reason nomadic societies are hard to study",
      value:
        "They left few written records of their own, so historians depend on accounts written by settled neighbours who were often hostile",
    },
    {
      key: "Change in perception of Genghis Khan in Mongolia today",
      value:
        "He is seen as a national founder and unifier rather than as the destroyer described in Persian and Chinese chronicles",
    },
  ],
);

h11(
  "h11:traditions-modernisation",
  "Changing Traditions and Paths to Modernisation",
  "In Themes in World History, what is %s?",
  "%k is %v.",
  [
    {
      key: "Three orders of medieval European society",
      value: "Those who pray, those who fight and those who work",
    },
    {
      key: "Feudalism",
      value:
        "A social and economic order in which land was held in return for service, chiefly military",
    },
    {
      key: "Manor",
      value: "The estate of a lord, worked by peasants who owed him labour and dues",
    },
    {
      key: "Serf",
      value:
        "A peasant bound to the land, who could not leave the manor without the lord's permission",
    },
    {
      key: "Fourteenth century crisis in Europe",
      value:
        "Famine, the Black Death and warfare, which cut the population sharply and shook the feudal order",
    },
    {
      key: "Renaissance",
      value:
        "The revival of classical learning and art in Europe from the fourteenth century, beginning in Italy",
    },
    {
      key: "Humanism",
      value:
        "The Renaissance outlook that placed human beings and their capacities at the centre of thought",
    },
    {
      key: "Theme 6 of the Class 11 syllabus",
      value: "Displacing Indigenous Peoples, dealing with North America and Australia",
    },
    { key: "Country studied under Paths to Modernisation", value: "Japan and China" },
    {
      key: "Meiji Restoration",
      value:
        "The restoration of imperial rule in Japan in 1868, which began its rapid modernisation",
    },
  ],
  [
    {
      key: "Effect of the Black Death on serfdom",
      value:
        "Labour became scarce and dear, so peasants could bargain for better terms and the bonds of serfdom weakened across much of western Europe",
    },
    {
      key: "Contribution of the printing press to the Renaissance",
      value:
        "It multiplied books cheaply, spread classical texts and new ideas fast, and made it far harder for authority to control what people read",
    },
    {
      key: "Meaning of terra nullius",
      value:
        "The doctrine of land belonging to nobody, used to justify the settlement of Australia as though its indigenous inhabitants had no claim",
    },
    {
      key: "Difference between the Japanese and Chinese paths to modernisation",
      value:
        "Japan modernised under a restored monarchy that borrowed western technology while keeping its own institutions, China's path ran through the collapse of the empire, revolution and eventually a communist state",
    },
    {
      key: "Reason the Three Orders model is only a model",
      value:
        "It was a churchman's idealised picture of society; in practice townspeople, merchants and artisans fitted none of the three, and their rise undid the scheme",
    },
  ],
);

/* ================== History Class 12 — Themes in Indian History ======== */

h12(
  "h12:part1-ancient",
  "Themes in Indian History Part I",
  "In Themes in Indian History Part I, what is %s?",
  "%k is %v.",
  [
    { key: "Theme of Bricks, Beads and Bones", value: "The Harappan civilisation" },
    { key: "First Harappan site to be excavated", value: "Harappa, on the Ravi" },
    { key: "Archaeologist who reported Mohenjodaro", value: "R. D. Banerji" },
    {
      key: "Theme of Kings, Farmers and Towns",
      value: "Early states and economies from about 600 BCE to 600 CE",
    },
    {
      key: "Script of the Ashokan inscriptions",
      value: "Brahmi, with Kharosthi in the north-west",
    },
    { key: "Scholar who deciphered Brahmi", value: "James Prinsep, in 1838" },
    {
      key: "Theme of Kinship, Caste and Class",
      value: "Early societies, studied largely through the Mahabharata",
    },
    { key: "Exogamy", value: "Marriage outside a defined group, such as the gotra" },
    {
      key: "Theme of Thinkers, Beliefs and Buildings",
      value: "Cultural developments from about 600 BCE to 600 CE",
    },
    { key: "Great Stupa studied in the syllabus", value: "The stupa at Sanchi" },
  ],
  [
    {
      key: "Reason Harappan drainage is considered remarkable",
      value:
        "Streets and drains were laid out first and houses built along them, which shows town planning by an authority rather than growth by accident",
    },
    {
      key: "Difficulty in reconstructing Harappan religion",
      value:
        "The script is undeciphered, so interpretation rests on seals and figurines, and archaeologists read the same object in very different ways",
    },
    {
      key: "Value of the Mahabharata as a historical source",
      value:
        "It was composed over centuries by many hands, so it records changing social norms rather than one moment, and must be read critically",
    },
    {
      key: "Reason Sanchi survived while Amaravati did not",
      value:
        "Sanchi was recognised and protected early, with the Bhopal rulers funding its preservation, while Amaravati's sculptures were carried off piecemeal by collectors",
    },
    {
      key: "Difference between the Buddhist and Brahmanical explanations of social order",
      value:
        "The Brahmanical order rested on birth into a varna sanctioned by the Dharmashastras, while the Buddha explained social difference by human agreement and held that birth did not determine worth",
    },
  ],
);

h12(
  "h12:part2-3-medieval-modern",
  "Themes in Indian History Parts II and III",
  "In Themes in Indian History Parts II and III, what is %s?",
  "%k is %v.",
  [
    { key: "Traveller who wrote the Kitab-ul-Hind", value: "Al-Biruni" },
    {
      key: "Moroccan traveller who described fourteenth century India",
      value: "Ibn Battuta, in the Rihla",
    },
    { key: "French traveller who wrote on Mughal India", value: "Francois Bernier" },
    { key: "Imperial capital studied in Part II", value: "Vijayanagara, or Hampi" },
    { key: "Chronicle of the Mughal agrarian order", value: "The Ain-i Akbari of Abu'l Fazl" },
    {
      key: "Permanent Settlement",
      value:
        "The revenue settlement of 1793 in Bengal, which fixed the demand on the zamindars in perpetuity",
    },
    {
      key: "Santhal rebellion",
      value:
        "The uprising of 1855-56 in the Rajmahal hills against moneylenders and the colonial state",
    },
    { key: "Theme of Rebels and the Raj", value: "The revolt of 1857 and its representations" },
    {
      key: "Movement launched by Gandhi in 1930",
      value: "The Civil Disobedience Movement, begun with the Dandi March",
    },
    { key: "Chairman of the Drafting Committee of the Constitution", value: "Dr B. R. Ambedkar" },
  ],
  [
    {
      key: "Reason Bernier's account must be read with caution",
      value:
        "He wrote for a European audience and argued that India lacked private property in land in order to warn France against absolutism, so his picture is shaped by that purpose",
    },
    {
      key: "Cause of the failure of the Permanent Settlement",
      value:
        "The revenue demand was fixed high and inflexibly, zamindars defaulted in bad years, estates were auctioned, and the actual cultivator gained nothing",
    },
    {
      key: "Way the revolt of 1857 spread so quickly",
      value:
        "Sepoy lines were connected across north India, grievances over service conditions met wider rural distress, and dispossessed rulers and taluqdars gave the rising leadership and legitimacy",
    },
    {
      key: "Significance of the Objectives Resolution",
      value:
        "Moved by Nehru in December 1946, it set out the ideals of the Constitution — independence, a sovereign republic, justice, equality and safeguards for minorities — and became the basis of the Preamble",
    },
    {
      key: "Debate in the Constituent Assembly over language",
      value:
        "The Hindi-speaking members pressed for Hindi as the national language, others argued it would disadvantage non-Hindi regions, and the compromise made Hindi the official language with English continuing alongside it",
    },
  ],
);

/* ================== Political Science Class 11 ========================= */

p11(
  "p11:constitution-at-work",
  "Indian Constitution at Work",
  "In Indian Constitution at Work, what is %s?",
  "%k is %v.",
  [
    {
      key: "Constitution",
      value:
        "The body of fundamental rules by which a state is governed and which limits the powers of government",
    },
    {
      key: "Preamble",
      value:
        "The introductory statement declaring India a sovereign socialist secular democratic republic",
    },
    {
      key: "Fundamental Rights",
      value: "The rights in Part III of the Constitution, enforceable by the courts",
    },
    {
      key: "Right to Constitutional Remedies",
      value: "Article 32, called by Ambedkar the heart and soul of the Constitution",
    },
    {
      key: "Writ of habeas corpus",
      value: "An order requiring a detained person to be produced before the court",
    },
    {
      key: "Electoral system used in India",
      value: "First past the post, in single member territorial constituencies",
    },
    {
      key: "Real executive in the Indian system",
      value: "The Council of Ministers headed by the Prime Minister",
    },
    {
      key: "Upper house of the Indian Parliament",
      value: "The Rajya Sabha, the Council of States",
    },
    { key: "Court of record and final court of appeal in India", value: "The Supreme Court" },
    {
      key: "Amendment that gave constitutional status to local government",
      value: "The 73rd and 74th amendments of 1992",
    },
  ],
  [
    {
      key: "Difference between first past the post and proportional representation",
      value:
        "First past the post gives the seat to whoever polls most votes even without a majority and tends to produce stable single-party rule, proportional representation allots seats in proportion to votes and reflects small parties more fairly",
    },
    {
      key: "Meaning of the Constitution as a living document",
      value:
        "It can be amended and reinterpreted, so it grows with society rather than freezing the intentions of 1950",
    },
    {
      key: "Basic structure doctrine",
      value:
        "Laid down in Kesavananda Bharati in 1973, it holds that Parliament may amend the Constitution but cannot alter its basic structure",
    },
    {
      key: "Difference between Fundamental Rights and Directive Principles",
      value:
        "Fundamental Rights are justiciable and restrain the state, Directive Principles are non-justiciable goals that direct the state towards a welfare order",
    },
    {
      key: "Reason a no-confidence motion is central to parliamentary government",
      value:
        "The executive holds office only while it commands the confidence of the Lok Sabha, so the legislature can remove it at any time, which is the essence of responsible government",
    },
  ],
);

p11(
  "p11:political-theory",
  "Political Theory",
  "In political theory, what is %s?",
  "%k is %v.",
  [
    {
      key: "Political theory",
      value:
        "The systematic study of the ideas and principles of political life, such as freedom, equality and justice",
    },
    {
      key: "Negative liberty",
      value: "Freedom understood as the absence of external constraint on the individual",
    },
    {
      key: "Positive liberty",
      value:
        "Freedom understood as the presence of the conditions that allow a person to develop fully",
    },
    {
      key: "Harm principle",
      value:
        "John Stuart Mill's rule that power may be exercised over a person against their will only to prevent harm to others",
    },
    { key: "Formal equality", value: "Equality before the law and the absence of legal privilege" },
    {
      key: "Affirmative action",
      value: "Special measures to help historically disadvantaged groups compete on equal terms",
    },
    {
      key: "Distributive justice",
      value: "Justice concerned with how benefits and burdens are shared in a society",
    },
    {
      key: "Veil of ignorance",
      value: "John Rawls's device of choosing rules without knowing one's own position in society",
    },
    {
      key: "Secularism as understood in India",
      value:
        "Principled distance of the state from all religions, with equal respect for each, rather than a strict wall of separation",
    },
    {
      key: "Citizenship",
      value: "Full and equal membership of a political community, carrying rights and obligations",
    },
  ],
  [
    {
      key: "Difference between Indian and western secularism",
      value:
        "Western secularism demands strict separation and non-interference, Indian secularism allows the state to intervene in religion to end practices such as untouchability, which is why it is described as principled distance",
    },
    {
      key: "Tension between liberty and equality",
      value:
        "Complete liberty lets advantages accumulate and produces inequality, while enforcing equality restricts some freedoms, so a political order has to balance the two rather than maximise either",
    },
    {
      key: "Argument for the veil of ignorance",
      value:
        "Not knowing whether you will be rich or poor, you would choose rules that protect the worst off, so the device yields fair principles without appealing to anyone's goodwill",
    },
    {
      key: "Difference between civic and ethnic nationalism",
      value:
        "Civic nationalism defines the nation by shared citizenship and values open to all, ethnic nationalism defines it by descent, language or religion and excludes those outside that inheritance",
    },
    {
      key: "Criticism of the idea of equality of opportunity",
      value:
        "Formally equal opportunity means little when people start from very unequal social and economic positions, which is the case for affirmative action",
    },
  ],
);

/* ================== Political Science Class 12 ========================= */

p12(
  "p12:world-politics",
  "Contemporary World Politics",
  "In contemporary world politics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Bipolarity",
      value:
        "The division of world power between two blocs, the United States and the Soviet Union, during the Cold War",
    },
    {
      key: "Event that ended the Cold War",
      value: "The disintegration of the Soviet Union in 1991",
    },
    {
      key: "Shock therapy",
      value:
        "The rapid transition to capitalism imposed on the former Soviet republics in the 1990s",
    },
    {
      key: "Non-Aligned Movement",
      value:
        "The grouping of states that refused to join either Cold War bloc, founded at Belgrade in 1961",
    },
    {
      key: "European Union",
      value:
        "A political and economic union of European states, which evolved from the European Economic Community",
    },
    {
      key: "ASEAN",
      value:
        "The Association of Southeast Asian Nations, formed by the Bangkok Declaration of 1967",
    },
    {
      key: "SAARC",
      value: "The South Asian Association for Regional Cooperation, founded in 1985",
    },
    {
      key: "Body with primary responsibility for international peace and security",
      value: "The United Nations Security Council",
    },
    {
      key: "Permanent members of the Security Council",
      value: "China, France, Russia, the United Kingdom and the United States",
    },
    {
      key: "Kyoto Protocol",
      value: "The 1997 agreement committing industrialised states to cut greenhouse gas emissions",
    },
  ],
  [
    {
      key: "Meaning of traditional and non-traditional security",
      value:
        "Traditional security concerns military threats to the state, non-traditional security covers terrorism, human rights, global poverty, health epidemics and environmental degradation",
    },
    {
      key: "Reason India seeks Security Council reform",
      value:
        "The permanent membership reflects the world of 1945 rather than present economic and demographic weight, and India argues that legitimacy requires representation of the developing world",
    },
    {
      key: "Principle of common but differentiated responsibilities",
      value:
        "All states share responsibility for the global environment, but those that industrialised first and emitted most must bear a greater share of the burden",
    },
    {
      key: "Difference between the NAM of the Cold War and today",
      value:
        "It began as a refusal to join either bloc, and since bipolarity ended it has turned towards economic questions and the interests of the global South",
    },
    {
      key: "Effect of the rise of China on the post-Cold War order",
      value:
        "It has made the unipolar moment short-lived, creating an alternative centre of economic and military power and pushing the system towards multipolarity",
    },
  ],
);

p12(
  "p12:india-politics",
  "Politics in India since Independence",
  "In politics in India since independence, what is %s?",
  "%k is %v.",
  [
    {
      key: "Three challenges of nation building in 1947",
      value:
        "Territorial integration, establishing democracy, and ensuring development and well-being",
    },
    {
      key: "Minister who led the integration of the princely states",
      value: "Sardar Vallabhbhai Patel",
    },
    {
      key: "States Reorganisation Commission",
      value:
        "The commission of 1953 whose report led to the reorganisation of states on a linguistic basis in 1956",
    },
    {
      key: "Body that framed India's early Five Year Plans",
      value: "The Planning Commission, set up in 1950",
    },
    {
      key: "Green Revolution",
      value:
        "The rise in food grain output from the late 1960s through high-yielding varieties, fertiliser and irrigation",
    },
    {
      key: "Congress system",
      value:
        "The period of one-party dominance in which the Congress both governed and contained competing interests within itself",
    },
    { key: "Year the Emergency was declared", value: "1975" },
    {
      key: "First non-Congress government at the centre",
      value: "The Janata Party government of 1977",
    },
    {
      key: "Mandal Commission",
      value:
        "The commission whose recommendation of reservation for Other Backward Classes was implemented in 1990",
    },
    {
      key: "Era of coalitions",
      value:
        "The period from 1989 in which no single party won a majority and coalition governments became the norm",
    },
  ],
  [
    {
      key: "Reason one-party dominance in India was different from elsewhere",
      value:
        "The Congress dominated through free and fair elections while opposition parties existed and contested, unlike single-party systems that suppressed opposition",
    },
    {
      key: "Consequences of the Emergency",
      value:
        "It showed that democracy could be suspended through constitutional means, led to the defeat of the Congress in 1977, and produced safeguards limiting the declaration of a national emergency",
    },
    {
      key: "Difference between the first and second phases of the Green Revolution",
      value:
        "The first was confined to wheat in Punjab, Haryana and western Uttar Pradesh and widened regional disparity, the later phase spread to more crops and regions",
    },
    {
      key: "Meaning of the era of coalitions for Indian politics",
      value:
        "Regional parties gained a share of national power, policy came to rest on negotiation between allies, and no single party could impose its programme alone",
    },
    {
      key: "Growing consensus among parties since 1989",
      value:
        "Broad agreement on economic liberalisation, on the political claims of backward castes, on the role of regional parties in national government, and on pragmatic ideological positions",
    },
  ],
);

/* ================== Geography Class 11 and 12 ========================== */

g11(
  "g11:physical-india",
  "Fundamentals of Physical Geography and India Physical Environment",
  "In Class 11 geography, what is %s?",
  "%k is %v.",
  [
    {
      key: "Two branches of geography as a discipline",
      value: "Physical geography and human geography",
    },
    {
      key: "Big bang theory",
      value:
        "The explanation that the universe began from an expanding singularity about 13.7 billion years ago",
    },
    { key: "Three layers of the earth's interior", value: "The crust, the mantle and the core" },
    { key: "Moho discontinuity", value: "The boundary between the crust and the mantle" },
    {
      key: "Continental drift theory",
      value:
        "Alfred Wegener's theory that the continents were once joined as Pangaea and have since drifted apart",
    },
    {
      key: "Plate tectonics",
      value:
        "The theory that the lithosphere is divided into plates that move over the asthenosphere",
    },
    {
      key: "Latitudinal extent of India",
      value: "About 8 degrees 4 minutes north to 37 degrees 6 minutes north",
    },
    {
      key: "Standard meridian of India",
      value: "82 degrees 30 minutes east, passing through Mirzapur",
    },
    {
      key: "Three parallel ranges of the Himalayas",
      value: "The Himadri, the Himachal and the Shiwaliks",
    },
    { key: "Largest physiographic division of India", value: "The peninsular plateau" },
  ],
  [
    {
      key: "Reason the Tropic of Cancer matters for India",
      value:
        "It passes roughly through the middle of the country, so the south lies in the tropics and the north in the subtropics, which shapes the climate of the two halves differently",
    },
    {
      key: "Difference between the eastern and western coastal plains",
      value:
        "The western plain is narrow with estuaries, the eastern is broad with deltas of the Mahanadi, Godavari, Krishna and Kaveri",
    },
    {
      key: "Evidence for continental drift",
      value:
        "The jigsaw fit of the coastlines, matching rock formations and fossils across oceans, and the distribution of ancient glacial deposits",
    },
    {
      key: "Reason India has a single standard time",
      value:
        "The longitudinal extent of about 30 degrees would give a two-hour difference between the extremes, so one meridian at 82 degrees 30 minutes east is used for administrative convenience",
    },
    {
      key: "Difference between the Himalayan and peninsular rivers",
      value:
        "Himalayan rivers are snow-fed and perennial with large deltas, peninsular rivers are rain-fed and seasonal with shorter, shallower courses",
    },
  ],
);

g12(
  "g12:human-india",
  "Fundamentals of Human Geography and India People and Economy",
  "In Class 12 geography, what is %s?",
  "%k is %v.",
  [
    {
      key: "Human geography",
      value: "The study of the relationship between human societies and the earth's surface",
    },
    {
      key: "Determinism",
      value: "The view that the physical environment determines human activity",
    },
    {
      key: "Possibilism",
      value: "The view that nature offers possibilities and humans choose among them",
    },
    { key: "Density of population", value: "The number of persons per unit area of land" },
    {
      key: "Demographic transition",
      value:
        "The model of a population moving from high birth and death rates to low ones through three or more stages",
    },
    {
      key: "Human Development Index",
      value: "A composite of health, education and standard of living, published by the UNDP",
    },
    {
      key: "Primary activity",
      value: "An activity that directly extracts from nature, such as farming, fishing and mining",
    },
    {
      key: "Quaternary activity",
      value: "Knowledge-based activity such as research, information and consultancy",
    },
    { key: "Most densely populated state of India at the 2011 census", value: "Bihar" },
    {
      key: "Least densely populated state of India at the 2011 census",
      value: "Arunachal Pradesh",
    },
  ],
  [
    {
      key: "Difference between growth and development of population",
      value:
        "Growth is the quantitative change in numbers over time, development is the qualitative improvement in living standards, health and education",
    },
    {
      key: "Reason an age-sex pyramid is useful",
      value:
        "Its shape reveals the history and the future of a population at a glance — a broad base means high fertility and a young population, a narrowing base means ageing and a coming fall in the workforce",
    },
    {
      key: "Push and pull factors in migration",
      value:
        "Push factors such as unemployment, poor amenities and natural disaster drive people out, pull factors such as work, education and security draw them in",
    },
    {
      key: "Difference between intensive and extensive subsistence agriculture",
      value:
        "Intensive uses small holdings with heavy labour and high yields per hectare, extensive uses large holdings with machinery and lower yields per hectare",
    },
    {
      key: "Reason water resource management is critical for India",
      value:
        "The country holds about four per cent of the world's fresh water for about eighteen per cent of its population, and irrigation takes the largest share, so demand from agriculture, industry and cities now competes directly",
    },
  ],
);

export const HUMANITIES_SCHOOL_TEMPLATES = templates;
