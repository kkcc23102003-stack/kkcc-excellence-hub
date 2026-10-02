/**
 * Social Science, Class 9 and Class 10 — full NCERT syllabus.
 *
 * SST previously had three chapters shared between both classes, and a Class
 * 9 student could be shown a Class 10 chapter. That is fixed here in two
 * ways: the subject is split into "SST Class 9" and "SST Class 10", and every
 * chapter of History, Geography, Civics and Economics is covered for each.
 *
 * Each chapter carries a Moderate working layer for the Kit 2 Coins practice
 * quiz and a Difficult exam layer of the most-asked facts for the paid test
 * series and the unlimited advanced test.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

const templates: Template[] = [];

const S9 = ["CBSE Class 9", "ICSE Class 9", "CBSE Class 9-10", "ICSE Class 9-10"];
const S10 = ["CBSE Class 10", "ICSE Class 10", "CBSE Class 9-10", "ICSE Class 9-10"];

function chapter(opts: {
  id: string;
  subject: string;
  topic: string;
  exams: string[];
  forward: string;
  reverse?: string;
  explain: string;
  rows: FactRow[];
  hard: FactRow[];
}) {
  const base = { subject: opts.subject, topic: opts.topic, exams: opts.exams };
  templates.push(
    ...factTemplate({
      ...base,
      id: opts.id,
      difficulty: "Moderate",
      rows: opts.rows,
      forward: opts.forward,
      reverse: opts.reverse,
      explain: opts.explain,
    }),
    matchTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
    statementTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
    statementCountTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
  );
  if (opts.hard.length >= 3) {
    const hid = `${opts.id}:adv`;
    templates.push(
      ...factTemplate({
        ...base,
        id: hid,
        difficulty: "Difficult",
        rows: opts.hard,
        forward: opts.forward,
        reverse: opts.reverse,
        explain: opts.explain,
      }),
      matchTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
      statementTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
      statementCountTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
    );
  }
}

const c9 = (
  id: string,
  topic: string,
  forward: string,
  explain: string,
  rows: FactRow[],
  hard: FactRow[],
) => chapter({ id, subject: "SST Class 9", topic, exams: S9, forward, explain, rows, hard });

const c10 = (
  id: string,
  topic: string,
  forward: string,
  explain: string,
  rows: FactRow[],
  hard: FactRow[],
) => chapter({ id, subject: "SST Class 10", topic, exams: S10, forward, explain, rows, hard });

/* ================================================= Class 9 — History */

c9(
  "sst9:hist:french",
  "The French Revolution",
  "In the French Revolution, what is %s?",
  "%k is %v.",
  [
    {
      key: "Year the French Revolution began",
      value: "1789, with the storming of the Bastille on 14 July",
    },
    {
      key: "Estates General",
      value: "The assembly of the three estates, called by Louis XVI in May 1789",
    },
    { key: "First Estate", value: "The clergy, exempt from most taxes" },
    { key: "Second Estate", value: "The nobility, also tax exempt" },
    { key: "Third Estate", value: "Everyone else, from peasants to merchants, who paid the taxes" },
    { key: "Taille", value: "The direct tax paid by the third estate to the state" },
    { key: "Tithe", value: "The one tenth share of produce taken by the Church" },
    { key: "Jacobins", value: "The radical political club led by Maximilian Robespierre" },
    {
      key: "Reign of Terror",
      value: "The period from 1793 to 1794 of mass executions under Robespierre",
    },
    {
      key: "Declaration of the Rights of Man",
      value: "The 1789 charter proclaiming liberty, property and equality before law",
    },
  ],
  [
    {
      key: "Book The Social Contract",
      value: "Written by Jean-Jacques Rousseau, arguing government rests on popular consent",
    },
    {
      key: "Montesquieu's contribution",
      value: "The Spirit of the Laws, proposing separation of powers",
    },
    {
      key: "Active citizens",
      value: "Men over 25 paying taxes worth three days of labour, the only ones who could vote",
    },
    { key: "Year France became a republic", value: "1792, after the monarchy was abolished" },
    {
      key: "Slavery in French colonies",
      value: "Abolished in 1794, restored by Napoleon, finally ended in 1848",
    },
  ],
);

c9(
  "sst9:hist:russia",
  "Socialism in Europe and the Russian Revolution",
  "In the Russian Revolution, what is %s?",
  "%k is %v.",
  [
    {
      key: "Bloody Sunday",
      value: "The 1905 shooting of peaceful petitioners outside the Winter Palace",
    },
    {
      key: "February Revolution",
      value: "The 1917 rising that forced Tsar Nicholas II to abdicate",
    },
    { key: "October Revolution", value: "The 1917 Bolshevik seizure of power led by Lenin" },
    {
      key: "Bolsheviks",
      value: "The majority faction of the Social Democratic Party, led by Lenin",
    },
    { key: "Mensheviks", value: "The minority faction favouring a gradual parliamentary path" },
    { key: "Soviet", value: "A council of workers and soldiers" },
    { key: "April Theses", value: "Lenin's 1917 demands for peace, land and control of banks" },
    { key: "Duma", value: "The elected consultative parliament created after 1905" },
    {
      key: "Collectivisation",
      value: "Stalin's policy of merging peasant holdings into collective farms",
    },
    { key: "Kulaks", value: "Well-to-do peasants targeted during collectivisation" },
  ],
  [
    {
      key: "Author of The Communist Manifesto",
      value: "Karl Marx with Friedrich Engels, published in 1848",
    },
    {
      key: "New Economic Policy",
      value: "Lenin's 1921 partial return to private trade to revive the economy",
    },
    { key: "Slogan of the October Revolution", value: "Peace, land and bread" },
    {
      key: "Treaty ending Russia's part in the First World War",
      value: "The Treaty of Brest-Litovsk in 1918",
    },
    {
      key: "Result of the 1932 to 1933 collectivisation famine",
      value: "Over four million deaths despite continued grain requisition",
    },
  ],
);

c9(
  "sst9:hist:nazism",
  "Nazism and the Rise of Hitler",
  "In Nazism and the rise of Hitler, what is %s?",
  "%k is %v.",
  [
    { key: "Treaty of Versailles", value: "The harsh 1919 peace treaty that humiliated Germany" },
    { key: "Weimar Republic", value: "The democratic German republic set up in 1919" },
    { key: "Year Hitler became Chancellor", value: "1933" },
    { key: "Enabling Act", value: "The 1933 law giving Hitler power to rule by decree" },
    { key: "Gestapo", value: "The Nazi secret state police" },
    { key: "SS", value: "The Protection Squads, Hitler's elite security force" },
    { key: "Nuremberg Laws", value: "The 1935 laws stripping German Jews of citizenship" },
    { key: "Holocaust", value: "The Nazi genocide of about six million Jews" },
    { key: "Lebensraum", value: "Hitler's demand for living space through eastward expansion" },
    { key: "Auschwitz", value: "The largest Nazi extermination camp, in occupied Poland" },
  ],
  [
    { key: "Hitler's book", value: "Mein Kampf, setting out his racial and expansionist ideas" },
    { key: "German hyperinflation year", value: "1923, when the mark collapsed to worthlessness" },
    {
      key: "Night of the Long Knives",
      value: "The 1934 purge in which Hitler destroyed rivals within his own movement",
    },
    {
      key: "Nazi view of women",
      value: "They were to bear and raise racially pure children, not to work or enter politics",
    },
    {
      key: "Why the Weimar Republic was unpopular",
      value: "It carried the blame for Versailles, war reparations and the Depression",
    },
  ],
);

c9(
  "sst9:hist:forest-pastoral",
  "Forest Society, Colonialism and Pastoralists",
  "In forest society and pastoralism, what is %s?",
  "%k is %v.",
  [
    {
      key: "Deforestation",
      value: "The clearing of forests, which accelerated sharply under colonial rule",
    },
    {
      key: "Scientific forestry",
      value: "The colonial system of felling natural forest and planting one species in rows",
    },
    {
      key: "Indian Forest Act",
      value: "The 1865 law, amended in 1878 and 1927, that took forests under state control",
    },
    { key: "Reserved forests", value: "Forests where villagers were allowed no access at all" },
    { key: "Protected forests", value: "Forests where limited customary use was permitted" },
    { key: "Shifting cultivation", value: "Slash and burn farming, banned by colonial foresters" },
    { key: "Bastar rebellion", value: "The 1910 forest revolt in the princely state of Bastar" },
    { key: "Gonds and Baigas", value: "Forest communities of central India" },
    { key: "Gujjar Bakarwals", value: "Pastoral herders of Jammu and Kashmir" },
    { key: "Dhangars", value: "The shepherd community of Maharashtra" },
  ],
  [
    {
      key: "First Inspector General of Forests in India",
      value: "Dietrich Brandis, a German expert",
    },
    {
      key: "Waste Land Rules",
      value: "Rules from the 1850s handing uncultivated land to individuals on favourable terms",
    },
    {
      key: "Forest Act of 1927 effect on pastoralists",
      value: "It restricted movement, cut grazing land and forced permits on herders",
    },
    {
      key: "Criminal Tribes Act",
      value: "The 1871 law that branded many nomadic communities as criminal by birth",
    },
    {
      key: "Why colonial rulers disliked shifting cultivation",
      value: "It made timber unavailable and land revenue hard to calculate",
    },
  ],
);

/* =============================================== Class 9 — Geography */

c9(
  "sst9:geo:location-relief",
  "India — Size, Location and Physical Features",
  "In India's size, location and relief, what is %s?",
  "%k is %v.",
  [
    {
      key: "Latitudinal extent of India",
      value: "8 degrees 4 minutes north to 37 degrees 6 minutes north",
    },
    {
      key: "Longitudinal extent of India",
      value: "68 degrees 7 minutes east to 97 degrees 25 minutes east",
    },
    {
      key: "Standard Meridian of India",
      value: "82 degrees 30 minutes east, passing through Mirzapur",
    },
    { key: "Total area of India", value: "About 3.28 million square kilometre" },
    { key: "India's rank in area", value: "Seventh largest country in the world" },
    {
      key: "Tropic of Cancer",
      value: "23 degrees 30 minutes north, passing through eight Indian states",
    },
    { key: "Length of the mainland coastline", value: "About 6100 kilometre" },
    { key: "Highest peak in India", value: "Kanchenjunga, in Sikkim" },
    {
      key: "Western Ghats",
      value: "The continuous hill range along the west coast, higher than the Eastern Ghats",
    },
    {
      key: "Deccan Plateau",
      value: "The triangular plateau south of the Narmada, made of old hard rock",
    },
  ],
  [
    {
      key: "Northernmost range of the Himalayas",
      value: "The Himadri or Great Himalaya, with the loftiest peaks",
    },
    { key: "Shiwaliks", value: "The outermost Himalayan range, formed of unconsolidated sediment" },
    {
      key: "Duns",
      value: "The longitudinal valleys between the Lesser Himalaya and the Shiwaliks",
    },
    {
      key: "Bhabar",
      value: "The narrow pebble belt where rivers disappear after leaving the mountains",
    },
    {
      key: "Why India's east-west time difference is two hours",
      value: "Nearly 30 degrees of longitude separate Gujarat from Arunachal Pradesh",
    },
  ],
);

c9(
  "sst9:geo:drainage-climate",
  "Drainage, Climate and Natural Vegetation",
  "In India's drainage, climate and vegetation, what is %s?",
  "%k is %v.",
  [
    { key: "Longest river in India", value: "The Ganga" },
    { key: "Largest river basin in India", value: "The Ganga basin" },
    {
      key: "Source of the Ganga",
      value: "The Gangotri glacier, where it is called the Bhagirathi",
    },
    {
      key: "Largest delta in the world",
      value: "The Sundarbans, formed by the Ganga and Brahmaputra",
    },
    {
      key: "Peninsular river flowing through a rift valley",
      value: "The Narmada, which drains into the Arabian Sea",
    },
    { key: "Monsoon", value: "The seasonal reversal of wind direction that brings India its rain" },
    { key: "Mawsynram", value: "The wettest place on Earth, in Meghalaya" },
    { key: "Loo", value: "The hot dry wind of north India in May and June" },
    {
      key: "Tropical evergreen forest",
      value: "Dense forest in areas with over 200 cm of rainfall",
    },
    {
      key: "Thorn forest",
      value: "Vegetation of areas with less than 70 cm of rainfall, such as Rajasthan",
    },
  ],
  [
    {
      key: "Western disturbance",
      value: "A winter low from the Mediterranean that brings rain to north-west India",
    },
    {
      key: "October heat",
      value: "The oppressive humid weather of the retreating monsoon in October",
    },
    {
      key: "Jet stream role in the monsoon",
      value: "The subtropical westerly jet withdrawing north allows the monsoon to burst",
    },
    {
      key: "El Nino effect on India",
      value: "A warm eastern Pacific weakens the monsoon and can cause drought",
    },
    {
      key: "Why Tamil Nadu gets winter rain",
      value: "The retreating north-east monsoon picks up moisture over the Bay of Bengal",
    },
  ],
);

c9(
  "sst9:geo:population",
  "Population",
  "In population studies, what is %s?",
  "%k is %v.",
  [
    { key: "Census", value: "The official count of population, taken in India every ten years" },
    { key: "Population density", value: "The number of people per square kilometre" },
    { key: "Density of India in 2011", value: "382 persons per square kilometre" },
    { key: "Most populous state", value: "Uttar Pradesh" },
    { key: "State with the highest density", value: "Bihar" },
    { key: "Sex ratio", value: "The number of females per thousand males" },
    { key: "Birth rate", value: "Live births per thousand people in a year" },
    { key: "Death rate", value: "Deaths per thousand people in a year" },
    { key: "Natural growth rate", value: "Birth rate minus death rate" },
    { key: "Literacy rate in 2011", value: "About 74 percent" },
  ],
  [
    {
      key: "Main cause of India's population growth since 1981",
      value: "A sharply falling death rate with a slowly falling birth rate",
    },
    { key: "Adolescent population share", value: "About one fifth of India's total population" },
    {
      key: "National Population Policy 2000",
      value: "It targeted free education to 14, lower infant mortality and universal immunisation",
    },
    {
      key: "Dependency ratio",
      value: "The ratio of people under 15 and over 59 to the working age group",
    },
    {
      key: "Why migration does not change national population",
      value: "It redistributes people internally without altering the total",
    },
  ],
);

/* ================================================== Class 9 — Civics */

c9(
  "sst9:civ:democracy",
  "What is Democracy and Constitutional Design",
  "In democracy and constitutional design, what is %s?",
  "%k is %v.",
  [
    { key: "Democracy", value: "A government in which rulers are elected by the people" },
    {
      key: "Universal adult franchise",
      value: "The right of every adult citizen to one vote of equal value",
    },
    { key: "Constitution", value: "The supreme law laying down how a country is governed" },
    {
      key: "Constituent Assembly",
      value: "The body that drafted the Indian Constitution between 1946 and 1949",
    },
    { key: "Chairman of the Drafting Committee", value: "Dr B R Ambedkar" },
    { key: "Date the Constitution was adopted", value: "26 November 1949" },
    { key: "Date the Constitution came into force", value: "26 January 1950" },
    { key: "Preamble", value: "The opening statement of the Constitution's values and goals" },
    { key: "Apartheid", value: "The South African system of racial segregation, ended in 1994" },
    {
      key: "Nelson Mandela",
      value: "The leader imprisoned for 28 years who became South Africa's first black President",
    },
  ],
  [
    {
      key: "Time taken to draft the Indian Constitution",
      value: "Two years, eleven months and eighteen days",
    },
    {
      key: "Objectives Resolution",
      value: "Nehru's 1946 resolution setting out the ideals of the Constitution",
    },
    {
      key: "Why democracy is called accountable government",
      value: "Rulers must answer to citizens and face regular elections",
    },
    {
      key: "Difference between a democracy and a dictatorship in decision quality",
      value:
        "Democracy is slower but its decisions are more acceptable and more likely to be followed",
    },
    {
      key: "Words added to the Preamble in 1976",
      value: "Socialist, secular and integrity, by the 42nd Amendment",
    },
  ],
);

c9(
  "sst9:civ:institutions",
  "Electoral Politics, Working of Institutions and Democratic Rights",
  "In electoral politics and institutions, what is %s?",
  "%k is %v.",
  [
    {
      key: "Election Commission of India",
      value: "The independent body that conducts elections in India",
    },
    { key: "Constituency", value: "The area whose voters elect one representative" },
    { key: "Lok Sabha strength", value: "543 elected members" },
    {
      key: "Reserved constituency",
      value: "A seat that only a candidate from a specified community can contest",
    },
    {
      key: "Model Code of Conduct",
      value: "The rules parties must follow once elections are announced",
    },
    {
      key: "Prime Minister",
      value: "The head of government, leader of the majority in the Lok Sabha",
    },
    {
      key: "President of India",
      value: "The head of state, elected indirectly by an electoral college",
    },
    {
      key: "Council of Ministers",
      value: "The body of ministers collectively responsible to the Lok Sabha",
    },
    {
      key: "Judicial review",
      value: "The power of courts to strike down laws violating the Constitution",
    },
    {
      key: "Right to Constitutional Remedies",
      value: "The right Ambedkar called the heart and soul of the Constitution",
    },
  ],
  [
    {
      key: "Number of Fundamental Rights in the Constitution",
      value: "Six, after the right to property was removed in 1978",
    },
    {
      key: "Writ of Habeas Corpus",
      value: "A court order requiring a detained person to be produced before it",
    },
    {
      key: "Difference between a bureaucrat and a minister",
      value:
        "Ministers are elected and take policy decisions; civil servants are appointed and implement them",
    },
    {
      key: "Why India chose first past the post",
      value: "It is simple for voters and usually produces a clear governing majority",
    },
    {
      key: "National Human Rights Commission",
      value: "The body set up in 1993 to inquire into rights violations",
    },
  ],
);

/* =============================================== Class 9 — Economics */

c9(
  "sst9:eco:palampur-resource",
  "Village Palampur and People as Resource",
  "In village economy and human resource, what is %s?",
  "%k is %v.",
  [
    { key: "Factors of production", value: "Land, labour, physical capital and human capital" },
    { key: "Fixed capital", value: "Tools, machines and buildings used over many years" },
    { key: "Working capital", value: "Raw materials and money in hand used up in production" },
    { key: "Multiple cropping", value: "Growing more than one crop on the same land in a year" },
    {
      key: "Green Revolution",
      value: "The use of high yielding varieties that raised wheat and rice output",
    },
    { key: "Human capital", value: "The stock of skill and knowledge embodied in people" },
    {
      key: "Disguised unemployment",
      value: "More people working than needed, so removing some changes nothing",
    },
    {
      key: "Seasonal unemployment",
      value: "Being out of work during part of the year, common in farming",
    },
    {
      key: "Primary sector",
      value: "Activities that directly use natural resources, such as farming",
    },
    { key: "Tertiary sector", value: "Services that support the other two sectors" },
  ],
  [
    {
      key: "Main constraint on farm production in Palampur",
      value: "Land, whose area is fixed and cannot be expanded",
    },
    {
      key: "Why the Green Revolution needed tubewells",
      value: "High yielding varieties require assured irrigation, not just rainfall",
    },
    {
      key: "Effect of disguised unemployment on productivity",
      value: "Output per worker falls though total output stays the same",
    },
    {
      key: "Why education is investment, not consumption",
      value: "It raises future earning capacity, giving a return like physical capital",
    },
    {
      key: "Loss from overuse of chemical fertilisers",
      value: "Soil fertility declines and groundwater is contaminated",
    },
  ],
);

c9(
  "sst9:eco:poverty-food",
  "Poverty as a Challenge and Food Security",
  "In poverty and food security, what is %s?",
  "%k is %v.",
  [
    { key: "Poverty line", value: "The minimum income level needed to meet basic needs" },
    { key: "Calorie norm in rural areas", value: "2400 calories per person per day" },
    { key: "Calorie norm in urban areas", value: "2100 calories per person per day" },
    {
      key: "Social exclusion",
      value: "Being shut out of facilities and opportunities enjoyed by others",
    },
    {
      key: "Vulnerability",
      value: "The greater probability of certain groups becoming or staying poor",
    },
    {
      key: "Food security",
      value: "Availability, accessibility and affordability of food to all at all times",
    },
    {
      key: "Buffer stock",
      value: "Foodgrain the government stores through the Food Corporation of India",
    },
    {
      key: "Minimum Support Price",
      value: "The pre-announced price at which the government buys from farmers",
    },
    {
      key: "Public Distribution System",
      value: "The network of ration shops distributing subsidised foodgrain",
    },
    { key: "Antyodaya Anna Yojana", value: "The 2000 scheme for the poorest of the poor families" },
  ],
  [
    {
      key: "States with the highest poverty ratios",
      value: "Bihar and Odisha have historically been the highest",
    },
    {
      key: "States that have largely reduced poverty",
      value: "Kerala, Punjab, Gujarat, Haryana and West Bengal, by different routes",
    },
    {
      key: "Kerala's route out of poverty",
      value: "Heavy investment in human resource development",
    },
    {
      key: "Main criticism of the buffer stock policy",
      value: "Grain rots in storage while high issue prices keep the poor from buying it",
    },
    {
      key: "MGNREGA guarantee",
      value: "One hundred days of wage employment a year to every rural household that wants it",
    },
  ],
);

/* ================================================ Class 10 — History */

c10(
  "sst10:hist:europe-india",
  "Nationalism in Europe and in India",
  "In the rise of nationalism, what is %s?",
  "%k is %v.",
  [
    {
      key: "Treaty of Vienna",
      value: "The 1815 settlement that restored the monarchies after Napoleon",
    },
    { key: "Giuseppe Mazzini", value: "The Italian revolutionary who founded Young Italy" },
    { key: "Unification of Germany", value: "Achieved in 1871 under Otto von Bismarck" },
    {
      key: "Zollverein",
      value: "The 1834 German customs union that removed internal trade barriers",
    },
    { key: "Rowlatt Act", value: "The 1919 law allowing detention without trial" },
    {
      key: "Jallianwala Bagh massacre",
      value: "The Amritsar killings of 13 April 1919 under General Dyer",
    },
    {
      key: "Non-Cooperation Movement",
      value: "The 1920 to 1922 boycott of British institutions and goods",
    },
    {
      key: "Chauri Chaura",
      value: "The 1922 violence that led Gandhi to call off Non-Cooperation",
    },
    { key: "Dandi March", value: "Gandhi's 1930 salt march that began Civil Disobedience" },
    {
      key: "Poona Pact",
      value: "The 1932 agreement giving depressed classes reserved seats in general constituencies",
    },
  ],
  [
    {
      key: "Allegory of the French nation",
      value: "Marianne, shown wearing a red cap and holding the tricolour",
    },
    { key: "Allegory of the German nation", value: "Germania, wearing a crown of oak leaves" },
    {
      key: "Why Gandhi chose salt for satyagraha",
      value: "The tax touched rich and poor alike, so it united all classes against the state",
    },
    {
      key: "Simon Commission",
      value: "The 1928 all-British commission met with the slogan Go back Simon",
    },
    {
      key: "Swaraj Party founders",
      value: "C R Das and Motilal Nehru, who wanted to contest council elections",
    },
  ],
);

c10(
  "sst10:hist:global-industrial-print",
  "Global World, Industrialisation and Print Culture",
  "In the making of the modern world, what is %s?",
  "%k is %v.",
  [
    { key: "Silk Route", value: "The ancient network linking Asia with Europe and North Africa" },
    { key: "Corn Laws", value: "British laws restricting grain import, abolished in the 1840s" },
    {
      key: "Rinderpest",
      value: "The cattle plague that devastated African livelihoods in the 1890s",
    },
    {
      key: "Indentured labour",
      value: "Bonded labour migration under contract, largely from India after the 1830s",
    },
    { key: "Bretton Woods", value: "The 1944 conference that created the IMF and the World Bank" },
    {
      key: "Proto-industrialisation",
      value: "Large scale production for international markets before factories",
    },
    {
      key: "Spinning Jenny",
      value: "James Hargreaves' 1764 machine that speeded up thread spinning",
    },
    { key: "Gutenberg press", value: "The movable type printing press of about 1448" },
    { key: "Vernacular Press Act", value: "The 1878 law that censored Indian language newspapers" },
    { key: "Woodblock printing", value: "The earliest print technology, developed in China" },
  ],
  [
    {
      key: "Why Indian textiles declined in the nineteenth century",
      value: "British tariffs shut out Indian cloth while machine-made imports flooded India",
    },
    {
      key: "Great Depression start",
      value: "1929, with its worst effects on Indian peasants through falling prices",
    },
    {
      key: "Effect of the Depression on Indian agriculture",
      value: "Prices halved while revenue demands stayed, deepening peasant debt",
    },
    {
      key: "Why the printing press worried authorities",
      value: "It spread dissenting ideas faster than censorship could follow",
    },
    { key: "Fly shuttle inventor", value: "John Kay, whose 1733 device speeded up weaving" },
  ],
);

/* ============================================== Class 10 — Geography */

c10(
  "sst10:geo:resources-forest-water",
  "Resources, Forests and Water Resources",
  "In resources and their conservation, what is %s?",
  "%k is %v.",
  [
    {
      key: "Renewable resource",
      value: "A resource that renews itself within a human timescale, such as solar energy",
    },
    {
      key: "Non-renewable resource",
      value: "A resource whose stock cannot be renewed, such as coal",
    },
    {
      key: "Alluvial soil",
      value: "The most widespread and fertile Indian soil, of the northern plains",
    },
    { key: "Black soil", value: "Regur soil of the Deccan trap, ideal for cotton" },
    { key: "Laterite soil", value: "Soil formed by heavy leaching in high rainfall areas" },
    { key: "Sheet erosion", value: "The removal of a thin layer of topsoil over a wide area" },
    { key: "Contour ploughing", value: "Ploughing along contour lines to slow water runoff" },
    {
      key: "Reserved forests",
      value: "Over half of India's forest land, the most valuable for conservation",
    },
    { key: "Project Tiger", value: "The conservation programme launched in 1973" },
    {
      key: "Multipurpose river project",
      value: "A dam serving irrigation, power, flood control and water supply together",
    },
  ],
  [
    {
      key: "Rio Earth Summit",
      value: "The 1992 conference that adopted Agenda 21 for sustainable development",
    },
    {
      key: "Chipko movement result",
      value: "It resisted deforestation and showed community forestry can succeed",
    },
    {
      key: "Narmada Bachao Andolan objection",
      value: "Large dams displace people and submerge forest without proportionate benefit",
    },
    {
      key: "Tankas of Rajasthan",
      value: "Underground tanks storing rainwater for drinking in the dry season",
    },
    {
      key: "Why Jhabua and Sukhomajri are cited",
      value: "Watershed development there raised water tables and incomes through community effort",
    },
  ],
);

c10(
  "sst10:geo:agri-minerals-industry",
  "Agriculture, Minerals, Energy and Manufacturing",
  "In agriculture, minerals and industry, what is %s?",
  "%k is %v.",
  [
    {
      key: "Kharif season",
      value: "Sowing with the monsoon and harvesting in September and October",
    },
    { key: "Rabi season", value: "Sowing in winter and harvesting in spring" },
    { key: "Zaid season", value: "The short summer season between rabi and kharif" },
    { key: "Primitive subsistence farming", value: "Slash and burn cultivation on small patches" },
    { key: "Largest producer of jute in India", value: "West Bengal" },
    { key: "Leading iron ore states", value: "Odisha, Jharkhand and Chhattisgarh" },
    { key: "Bauxite", value: "The ore from which aluminium is obtained" },
    { key: "Conventional source of energy", value: "Coal, petroleum, natural gas and firewood" },
    {
      key: "Agro-based industry",
      value: "An industry using farm produce as raw material, such as sugar or cotton textiles",
    },
    {
      key: "Basic industry",
      value: "An industry whose product feeds other industries, such as iron and steel",
    },
  ],
  [
    {
      key: "Why India's steel output lags its capacity",
      value: "High energy cost, limited coking coal and low labour productivity",
    },
    {
      key: "Bhilai and Rourkela location factor",
      value: "Proximity to iron ore, coal and water in the Chhotanagpur belt",
    },
    {
      key: "Golden Quadrilateral",
      value: "The expressway network linking Delhi, Mumbai, Chennai and Kolkata",
    },
    {
      key: "Main cause of industrial water pollution",
      value: "Discharge of untreated organic and inorganic effluent into rivers",
    },
    {
      key: "Why cotton textiles moved to Maharashtra and Gujarat",
      value: "Black soil for cotton, a humid climate, port access and capital",
    },
  ],
);

/* ================================================= Class 10 — Civics */

c10(
  "sst10:civ:power-federalism",
  "Power Sharing and Federalism",
  "In power sharing and federalism, what is %s?",
  "%k is %v.",
  [
    {
      key: "Power sharing",
      value: "Distributing power among organs, levels and groups to prevent its concentration",
    },
    {
      key: "Horizontal power sharing",
      value: "Sharing among the legislature, executive and judiciary",
    },
    { key: "Vertical power sharing", value: "Sharing among the union, state and local levels" },
    {
      key: "Federalism",
      value: "A system with two or more levels of government, each with its own jurisdiction",
    },
    {
      key: "Union List",
      value: "Subjects of national importance on which only Parliament may legislate",
    },
    {
      key: "State List",
      value: "Subjects of state and local importance, legislated by state assemblies",
    },
    {
      key: "Concurrent List",
      value: "Subjects on which both levels may legislate, with union law prevailing",
    },
    { key: "Residuary subjects", value: "Subjects in no list, on which the union legislates" },
    {
      key: "Decentralisation",
      value: "Transfer of power from union and state governments to local bodies",
    },
    {
      key: "73rd Amendment",
      value: "The 1992 amendment that gave constitutional status to panchayati raj",
    },
  ],
  [
    {
      key: "Belgium's power sharing model",
      value:
        "Equal Dutch and French ministers in the central government plus a community government",
    },
    {
      key: "Sri Lanka's majoritarian outcome",
      value: "The 1956 Sinhala-only act alienated Tamils and led to civil war",
    },
    {
      key: "Coming together federation",
      value: "Independent states pooling sovereignty, as in the United States",
    },
    {
      key: "Holding together federation",
      value: "A large country dividing power among states, as in India",
    },
    {
      key: "Share of seats reserved for women in local bodies",
      value: "At least one third of all seats and chairperson posts",
    },
  ],
);

c10(
  "sst10:civ:parties-outcomes",
  "Gender Religion and Caste, Political Parties and Outcomes of Democracy",
  "In political life, what is %s?",
  "%k is %v.",
  [
    {
      key: "Sexual division of labour",
      value: "The arrangement by which housework is assigned to women",
    },
    {
      key: "Feminist movement",
      value: "The movement for equal rights and opportunities for women",
    },
    { key: "Communalism", value: "Using religion as the basis of political identity and demands" },
    {
      key: "Secular state",
      value: "A state with no official religion, guaranteeing freedom of faith to all",
    },
    { key: "Casteism", value: "Treating caste as the sole basis of political preference" },
    {
      key: "Political party",
      value: "A group contesting elections to hold power and implement its policies",
    },
    { key: "Ruling party", value: "The party or alliance that forms the government" },
    {
      key: "Opposition party",
      value: "A party that criticises the government and offers an alternative",
    },
    {
      key: "National party recognition",
      value: "Granted on securing six percent of votes in four states plus four Lok Sabha seats",
    },
    {
      key: "Defection",
      value: "Changing party allegiance after being elected on another party's ticket",
    },
  ],
  [
    {
      key: "Anti-defection law effect",
      value: "It stops horse trading but also weakens the independence of individual legislators",
    },
    {
      key: "Main challenge before Indian parties",
      value: "Lack of internal democracy, dynastic succession and money power",
    },
    {
      key: "Why democracy is preferred despite slow decisions",
      value: "It is accountable, responsive and legitimate, and it accommodates diversity",
    },
    {
      key: "Women's representation in the Lok Sabha",
      value: "Historically low, far below the one third reserved in local bodies",
    },
    {
      key: "Difference between communal politics and secular politics",
      value:
        "Communal politics makes religion the ground of political demand; secular politics keeps state and religion separate",
    },
  ],
);

/* ============================================== Class 10 — Economics */

c10(
  "sst10:eco:development-sectors",
  "Development and Sectors of the Indian Economy",
  "In development and economic sectors, what is %s?",
  "%k is %v.",
  [
    { key: "Per capita income", value: "Total income of a country divided by its population" },
    {
      key: "Human Development Index",
      value: "A measure combining income, education and life expectancy",
    },
    {
      key: "Infant mortality rate",
      value: "Deaths of children under one year per thousand live births",
    },
    {
      key: "Literacy rate",
      value: "The share of the population aged seven and above that can read and write",
    },
    {
      key: "Primary sector",
      value: "Activity drawing directly on nature, such as farming and mining",
    },
    { key: "Secondary sector", value: "Manufacturing, which transforms raw material into goods" },
    { key: "Tertiary sector", value: "Services that support the other two sectors" },
    {
      key: "Gross Domestic Product",
      value: "The value of all final goods and services produced in a year",
    },
    {
      key: "Organised sector",
      value: "Employment with fixed terms, registration and social security",
    },
    {
      key: "Unorganised sector",
      value: "Small scattered units outside government regulation, with no job security",
    },
  ],
  [
    {
      key: "Why average income can mislead",
      value: "It hides distribution; a high average may coexist with widespread poverty",
    },
    {
      key: "Kerala versus Haryana comparison",
      value: "Kerala has lower per capita income but far better health and education outcomes",
    },
    { key: "Sector with the largest share of Indian GDP", value: "The tertiary sector" },
    {
      key: "Sector employing the most Indians",
      value: "The primary sector, which shows underemployment",
    },
    {
      key: "Sustainable development",
      value:
        "Development that does not compromise the ability of future generations to meet their needs",
    },
  ],
);

c10(
  "sst10:eco:money-global-consumer",
  "Money and Credit, Globalisation and Consumer Rights",
  "In money, credit and markets, what is %s?",
  "%k is %v.",
  [
    {
      key: "Double coincidence of wants",
      value: "The barter requirement that each party wants what the other offers",
    },
    {
      key: "Currency as legal tender",
      value: "Money the law requires to be accepted in settlement of debt",
    },
    { key: "Demand deposit", value: "Money in a bank account that can be withdrawn on demand" },
    { key: "Collateral", value: "An asset pledged to a lender as security for a loan" },
    {
      key: "Terms of credit",
      value: "The interest rate, collateral, documentation and mode of repayment together",
    },
    {
      key: "Formal sector credit",
      value: "Loans from banks and cooperatives, supervised by the Reserve Bank",
    },
    {
      key: "Informal sector credit",
      value: "Loans from moneylenders and traders, with no supervision",
    },
    { key: "Self Help Group", value: "A small savings group whose members lend to one another" },
    {
      key: "Globalisation",
      value: "The rapid integration of economies through trade, investment and production",
    },
    {
      key: "Multinational corporation",
      value: "A company owning or controlling production in more than one country",
    },
  ],
  [
    {
      key: "Main problem with informal credit",
      value: "Very high interest that traps borrowers in a debt cycle",
    },
    {
      key: "Role of the Reserve Bank in lending",
      value: "It monitors how much banks lend and to whom, especially small borrowers",
    },
    {
      key: "Trade barrier",
      value: "A restriction such as a tariff or quota used to regulate foreign trade",
    },
    {
      key: "Indian liberalisation year",
      value: "1991, when trade and investment barriers were largely removed",
    },
    { key: "COPRA", value: "The Consumer Protection Act of 1986, which created consumer courts" },
  ],
);

export const SST_TEMPLATES = templates;
