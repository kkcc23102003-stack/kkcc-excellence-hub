/**
 * Social Studies — the combined school Social Science subject.
 *
 * SST is the subject the quiz quick-practice buttons point at and the one
 * SSC, Railway, Police, PSSSB and the teaching cadres draw their Social
 * Science questions from, yet it carried three chapters. All four strands
 * are covered here: history, geography, civics and economics, at the
 * Class 9 and 10 level the boards and these exams actually set.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const SST_EXAMS = [
  "PSEB Class 9-10",
  "CBSE Class 9-10",
  "CBSE MCQ",
  "State Board MCQ",
  "ICSE Class 9-10",
  "Punjab ETT Cadre",
  "Punjab Master Cadre",
  "PSTET/CTET",
  "State Teacher/TET",
  "SSC",
  "Railway",
  "Punjab Police",
  "PSSSB",
  "Punjab Clerk",
];

const templates: Template[] = [];
const sst = chapterFactory(templates, "SST", SST_EXAMS);

/* ================================================================ History */

sst(
  "sst:french-revolution",
  "The French Revolution",
  "In the French Revolution, what is %s?",
  "%k is %v.",
  [
    { key: "Year the French Revolution began", value: "1789" },
    { key: "Event of the fourteenth of July 1789", value: "The storming of the Bastille" },
    { key: "King of France at the outbreak of the revolution", value: "Louis the Sixteenth" },
    { key: "Queen of France executed in 1793", value: "Marie Antoinette" },
    { key: "Slogan of the French Revolution", value: "Liberty, equality and fraternity" },
    { key: "Assembly that met in May 1789", value: "The Estates General" },
    {
      key: "First and second estates of French society",
      value: "The clergy and the nobility, both exempt from taxes",
    },
    { key: "Third estate", value: "The commoners, who paid all the taxes" },
    { key: "Tax paid by peasants to the church", value: "The tithe" },
    { key: "Direct tax paid to the state", value: "The taille" },
  ],
  [
    { key: "Author of The Social Contract", value: "Jean Jacques Rousseau" },
    {
      key: "Author of The Spirit of the Laws",
      value: "Montesquieu, who proposed the division of power",
    },
    {
      key: "Tennis Court Oath",
      value:
        "The pledge of the third estate in June 1789 not to disperse until a constitution was drafted",
    },
    {
      key: "Reign of Terror",
      value: "The period from 1793 to 1794 under Robespierre, marked by mass executions",
    },
    { key: "Year Napoleon Bonaparte crowned himself emperor", value: "1804" },
  ],
);

sst(
  "sst:russian-revolution",
  "Socialism in Europe and the Russian Revolution",
  "In the Russian Revolution, what is %s?",
  "%k is %v.",
  [
    { key: "Year of the Russian Revolution", value: "1917" },
    { key: "Last Tsar of Russia", value: "Tsar Nicholas the Second" },
    { key: "Leader of the Bolsheviks", value: "Vladimir Lenin" },
    {
      key: "Bolsheviks",
      value: "The majority group of the Russian Social Democratic Workers Party led by Lenin",
    },
    { key: "Mensheviks", value: "The minority group that favoured a gradual, parliamentary path" },
    {
      key: "Event of February 1917",
      value: "The abdication of the Tsar and the formation of a provisional government",
    },
    { key: "Event of October 1917", value: "The Bolshevik seizure of power in Petrograd" },
    { key: "Soviet", value: "A council of workers, soldiers and peasants" },
    { key: "Author of The Communist Manifesto", value: "Karl Marx and Friedrich Engels" },
    { key: "Slogan of the Bolsheviks in 1917", value: "Peace, land and bread" },
  ],
  [
    {
      key: "Bloody Sunday",
      value: "The firing on a peaceful workers' procession in St Petersburg in January 1905",
    },
    {
      key: "April Theses",
      value:
        "Lenin's demands of 1917 for peace, land to the peasants and the nationalisation of banks",
    },
    {
      key: "New Economic Policy",
      value: "Lenin's 1921 policy allowing limited private trade to revive the economy",
    },
    {
      key: "Collectivisation under Stalin",
      value:
        "The forced merging of peasant holdings into large state-run collective farms from 1929",
    },
    {
      key: "Comintern",
      value: "The Communist International, founded in 1919 to support communist parties abroad",
    },
  ],
);

sst(
  "sst:nazism-hitler",
  "Nazism and the Rise of Hitler",
  "In the rise of Nazism, what is %s?",
  "%k is %v.",
  [
    {
      key: "Treaty that ended the First World War for Germany",
      value: "The Treaty of Versailles, signed in 1919",
    },
    { key: "Republic established in Germany in 1919", value: "The Weimar Republic" },
    { key: "Year Hitler became Chancellor of Germany", value: "1933" },
    {
      key: "Hitler's political party",
      value: "The National Socialist German Workers Party, or Nazi Party",
    },
    { key: "Hitler's autobiography", value: "Mein Kampf" },
    { key: "Reichstag", value: "The German parliament" },
    { key: "Enabling Act of 1933", value: "The law that gave Hitler the power to rule by decree" },
    { key: "Nazi secret police", value: "The Gestapo" },
    { key: "Holocaust", value: "The Nazi genocide of about six million Jews" },
    { key: "Year the Second World War began", value: "1939" },
  ],
  [
    {
      key: "Effect of the Great Depression on Germany",
      value: "Mass unemployment and the collapse of the currency, which fed support for the Nazis",
    },
    {
      key: "Nuremberg Laws of 1935",
      value: "Laws stripping German Jews of citizenship and forbidding marriage with Germans",
    },
    {
      key: "Lebensraum",
      value: "Hitler's doctrine of living space, used to justify eastward expansion",
    },
    {
      key: "Reason the Weimar Republic was unpopular",
      value:
        "It was blamed for accepting the humiliating Versailles settlement and the war guilt clause",
    },
    {
      key: "Nuremberg Tribunal",
      value: "The international court that tried Nazi war criminals after the war",
    },
  ],
);

sst(
  "sst:global-world-print",
  "The Making of a Global World and Print Culture",
  "In the making of the modern world, what is %s?",
  "%k is %v.",
  [
    {
      key: "Silk route",
      value: "The ancient trade route linking Asia with Europe and North Africa",
    },
    {
      key: "Country from which potatoes, maize and tomatoes came to the Old World",
      value: "The Americas",
    },
    {
      key: "Indentured labour",
      value:
        "A bonded labourer contracted to work for an employer for a fixed period to pay a passage",
    },
    { key: "Rinderpest", value: "The cattle plague that devastated African herds in the 1890s" },
    {
      key: "Bretton Woods institutions",
      value: "The International Monetary Fund and the World Bank",
    },
    { key: "Year of the Bretton Woods conference", value: "1944" },
    { key: "Inventor of the printing press in Europe", value: "Johann Gutenberg" },
    { key: "First book printed by Gutenberg", value: "The Bible" },
    { key: "Country where print technology first developed", value: "China" },
    {
      key: "First printing press brought to India",
      value: "By Portuguese missionaries to Goa in the mid sixteenth century",
    },
  ],
  [
    { key: "Corn Laws", value: "British laws restricting the import of corn, repealed in 1846" },
    {
      key: "Great Depression",
      value:
        "The worldwide economic collapse beginning in 1929, marked by falling prices and mass unemployment",
    },
    {
      key: "Vernacular Press Act of 1878",
      value:
        "The law giving the colonial government power to censor reports in Indian language newspapers",
    },
    {
      key: "Effect of print on the Indian reform movement",
      value:
        "It carried debate on sati, widow remarriage and caste to a wide public in the vernacular",
    },
    {
      key: "Assembly line introduced by Henry Ford",
      value: "Mass production by moving the work to the worker, which cut costs and raised output",
    },
  ],
);

/* ============================================================== Geography */

sst(
  "sst:india-physical",
  "India — Location, Physical Features, Drainage and Climate",
  "In the physical geography of India, what is %s?",
  "%k is %v.",
  [
    {
      key: "Latitudinal extent of India",
      value: "About 8 degrees 4 minutes north to 37 degrees 6 minutes north",
    },
    {
      key: "Standard meridian of India",
      value: "82 degrees 30 minutes east, passing through Mirzapur",
    },
    {
      key: "Tropic of Cancer's position in India",
      value: "It passes through the middle of the country, through eight States",
    },
    { key: "Highest peak in India", value: "Kanchenjunga" },
    { key: "Northernmost range of the Himalayas", value: "The Himadri, or Great Himalaya" },
    { key: "Longest river of India", value: "The Ganga" },
    { key: "Largest peninsular river", value: "The Godavari, called the Dakshin Ganga" },
    { key: "Two rivers flowing into the Arabian Sea", value: "The Narmada and the Tapi" },
    { key: "Wind system that gives India most of its rain", value: "The south west monsoon" },
    { key: "Wettest place in India", value: "Mawsynram in Meghalaya" },
  ],
  [
    {
      key: "Reason the Narmada and Tapi flow in rift valleys",
      value: "They occupy faulted troughs formed by the down-warping of the peninsular block",
    },
    {
      key: "Western disturbance",
      value: "A cyclonic storm from the Mediterranean that brings winter rain to north west India",
    },
    {
      key: "Mango shower",
      value: "Pre-monsoon showers in Kerala and Karnataka that help the ripening of mangoes",
    },
    { key: "Loo", value: "The hot dry wind blowing over north India in May and June" },
    {
      key: "Burst of the monsoon",
      value: "The sudden onset of heavy rain as the south west monsoon reaches a region",
    },
  ],
);

sst(
  "sst:vegetation-population",
  "Natural Vegetation, Wildlife and Population",
  "In natural vegetation and population, what is %s?",
  "%k is %v.",
  [
    {
      key: "Rainfall needed for tropical evergreen forest",
      value: "More than 200 centimetres a year",
    },
    { key: "Most widespread forest type in India", value: "Tropical deciduous, or monsoon forest" },
    { key: "Tree characteristic of the thorn forest", value: "The acacia, or babool" },
    { key: "Vegetation of the coastal deltas", value: "Mangrove, or tidal forest" },
    { key: "National animal of India", value: "The tiger" },
    { key: "National bird of India", value: "The peacock" },
    { key: "Project launched in 1973 to save the tiger", value: "Project Tiger" },
    { key: "Population density", value: "The number of persons per square kilometre" },
    { key: "Sex ratio", value: "The number of females per thousand males" },
    { key: "Most populous State of India", value: "Uttar Pradesh" },
  ],
  [
    {
      key: "Biosphere reserve",
      value:
        "A protected area conserving the whole ecosystem, with a core, a buffer and a transition zone",
    },
    {
      key: "Reason the Sundarbans are named so",
      value:
        "After the sundari tree that dominates the mangrove forest of the Ganga Brahmaputra delta",
    },
    { key: "Three components of population change", value: "Birth rate, death rate and migration" },
    {
      key: "Demographic dividend",
      value:
        "The economic advantage of having a large share of the population in the working age group",
    },
    {
      key: "Adolescent population's significance",
      value:
        "It is the largest single age group and its health and education decide the country's future workforce",
    },
  ],
);

sst(
  "sst:agriculture-minerals",
  "Agriculture, Minerals and Energy Resources",
  "In agriculture and mineral resources, what is %s?",
  "%k is %v.",
  [
    {
      key: "Kharif crop season",
      value: "The season sown with the onset of the monsoon and harvested in September and October",
    },
    { key: "Rabi crop season", value: "The season sown in winter and harvested in spring" },
    { key: "Chief kharif crop of India", value: "Rice" },
    { key: "Chief rabi crop of India", value: "Wheat" },
    { key: "Largest producer of jute in India", value: "West Bengal" },
    { key: "Beverage crop grown in Assam and the Nilgiris", value: "Tea" },
    { key: "Chief iron ore producing State", value: "Odisha" },
    { key: "Best quality iron ore", value: "Magnetite, with about seventy per cent metallic iron" },
    { key: "Mineral called brown diamond for its importance to industry", value: "Coal" },
    {
      key: "Conventional and non-conventional sources of energy",
      value:
        "Coal, petroleum and natural gas are conventional; solar, wind and biogas are non-conventional",
    },
  ],
  [
    {
      key: "Green Revolution",
      value:
        "The rise in food grain output from the late 1960s through high yielding seeds, fertiliser and irrigation",
    },
    {
      key: "Operation Flood",
      value:
        "The programme that made India the largest milk producer, linked with the White Revolution",
    },
    { key: "Shifting cultivation", value: "Slash and burn farming, called jhum in the north east" },
    { key: "Reason bauxite is important", value: "It is the ore from which aluminium is obtained" },
    {
      key: "Advantage of non-conventional energy",
      value:
        "It is renewable, non-polluting and available locally, which reduces import dependence",
    },
  ],
);

sst(
  "sst:industries-transport",
  "Manufacturing Industries and Lifelines of the National Economy",
  "In industry and transport, what is %s?",
  "%k is %v.",
  [
    {
      key: "Manufacturing",
      value: "The production of goods in large quantities from raw materials",
    },
    {
      key: "Agro based industry",
      value: "An industry using agricultural produce as its raw material, such as cotton textiles",
    },
    {
      key: "Mineral based industry",
      value: "An industry using minerals as its raw material, such as iron and steel",
    },
    { key: "First successful cotton textile mill in India", value: "Set up at Mumbai in 1854" },
    {
      key: "Largest public sector steel plant collaboration of the 1950s",
      value: "Bhilai with Soviet help, Rourkela with German and Durgapur with British",
    },
    {
      key: "Longest national highway of India",
      value: "National Highway 44, from Srinagar to Kanyakumari",
    },
    {
      key: "Golden Quadrilateral",
      value: "The superhighway linking Delhi, Kolkata, Chennai and Mumbai",
    },
    { key: "Largest port of India", value: "Mumbai" },
    {
      key: "Largest railway zone network",
      value: "Indian Railways, the principal mode of long-distance freight and passenger transport",
    },
    {
      key: "Chief cause of industrial water pollution",
      value: "The discharge of untreated effluent into rivers and lakes",
    },
  ],
  [
    {
      key: "Reason iron and steel plants are located near coal fields",
      value: "Coal is bulky and weight losing, so transport cost is minimised by locating near it",
    },
    {
      key: "Difference between a basic and a consumer industry",
      value:
        "A basic industry supplies raw material to other industries, a consumer industry makes goods for direct use",
    },
    {
      key: "Thermal pollution from industry",
      value:
        "The discharge of hot water from factories and power plants into rivers, which harms aquatic life",
    },
    {
      key: "Role of the National Waterways",
      value: "They offer the cheapest mode of bulk transport and reduce road and rail congestion",
    },
    {
      key: "Importance of the information technology industry",
      value: "It is a major employer and export earner, concentrated in software technology parks",
    },
  ],
);

/* ================================================================= Civics */

sst(
  "sst:democracy-constitution",
  "Democracy, Constitutional Design and Electoral Politics",
  "In democracy and the constitution, what is %s?",
  "%k is %v.",
  [
    {
      key: "Democracy",
      value: "A form of government in which the rulers are elected by the people",
    },
    {
      key: "Chairman of the Drafting Committee of the Indian Constitution",
      value: "Dr B R Ambedkar",
    },
    {
      key: "Date the Constitution of India came into force",
      value: "The twenty sixth of January 1950",
    },
    {
      key: "Time taken to frame the Constitution",
      value: "Two years, eleven months and eighteen days",
    },
    { key: "Body that conducts elections in India", value: "The Election Commission of India" },
    { key: "Minimum age to vote in India", value: "Eighteen years" },
    {
      key: "Universal adult franchise",
      value: "The right of every adult citizen to vote, without distinction",
    },
    { key: "By-election", value: "An election held to fill a seat that has fallen vacant" },
    { key: "Constituency", value: "The area whose voters elect one representative" },
    {
      key: "Preamble",
      value:
        "The introductory statement declaring India a sovereign socialist secular democratic republic",
    },
  ],
  [
    {
      key: "Reason seats are reserved for Scheduled Castes and Tribes",
      value:
        "To ensure their fair representation, since a weaker section may not otherwise win in a general contest",
    },
    {
      key: "Model code of conduct",
      value: "The set of norms binding parties and candidates once elections are announced",
    },
    {
      key: "Difference between a direct and an indirect democracy",
      value:
        "In a direct democracy the people decide themselves, in an indirect one they elect representatives to decide",
    },
    {
      key: "Merit of democracy over other forms",
      value:
        "It is accountable, responsive, legitimate and allows peaceful correction of its own mistakes",
    },
    {
      key: "Challenge of expansion in a democracy",
      value:
        "Extending the principle of democratic government to all regions, social groups and institutions",
    },
  ],
);

sst(
  "sst:federalism-parties",
  "Federalism, Power Sharing and Political Parties",
  "In federalism and party politics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Federalism",
      value: "A system in which power is divided between a central authority and constituent units",
    },
    {
      key: "Three lists in the Seventh Schedule",
      value: "The Union List, the State List and the Concurrent List",
    },
    {
      key: "Subjects in the Union List",
      value: "Defence, foreign affairs, banking, communications and currency",
    },
    {
      key: "Subjects in the State List",
      value: "Police, trade, commerce, agriculture and irrigation",
    },
    {
      key: "Residuary powers",
      value: "Powers over subjects in no list, which rest with the Union government",
    },
    {
      key: "Third tier of government in India",
      value: "Local government, the panchayats and municipalities",
    },
    {
      key: "Amendment that gave constitutional status to local government",
      value: "The seventy third and seventy fourth amendments of 1992",
    },
    {
      key: "Political party",
      value: "A group of people who contest elections and hold power on an agreed set of policies",
    },
    {
      key: "National party",
      value: "A party recognised in four or more States by the Election Commission",
    },
    {
      key: "Coalition government",
      value: "A government formed by an alliance of two or more parties",
    },
  ],
  [
    {
      key: "Horizontal and vertical power sharing",
      value:
        "Horizontal is among the legislature, executive and judiciary; vertical is among levels of government",
    },
    {
      key: "Reason India is called a quasi federal state",
      value:
        "Power is divided, but the Union is stronger, with residuary powers and control over State boundaries",
    },
    {
      key: "Coming together and holding together federations",
      value:
        "Independent states joining, as in the United States; a large country devolving power, as in India",
    },
    {
      key: "Chief challenge before Indian political parties",
      value:
        "Lack of internal democracy, dynastic succession, money power and the absence of meaningful choice",
    },
    {
      key: "Defection",
      value:
        "An elected member changing party after the election, checked by the anti-defection law",
    },
  ],
);

/* ============================================================== Economics */

sst(
  "sst:development-sectors",
  "Development, Sectors of the Economy and Poverty",
  "In development economics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Development",
      value: "A process of improvement in income together with health, education and security",
    },
    { key: "Per capita income", value: "The total income of a country divided by its population" },
    {
      key: "Body that publishes the Human Development Report",
      value: "The United Nations Development Programme",
    },
    {
      key: "Three dimensions of the Human Development Index",
      value: "Health, education and standard of living",
    },
    {
      key: "Primary sector",
      value:
        "The sector producing goods by exploiting natural resources, such as farming and mining",
    },
    {
      key: "Secondary sector",
      value: "The sector transforming natural products into other forms, that is manufacturing",
    },
    { key: "Tertiary sector", value: "The sector producing services that support the other two" },
    { key: "Largest employer among the three sectors in India", value: "The primary sector" },
    { key: "Largest contributor to India's gross domestic product", value: "The tertiary sector" },
    {
      key: "Poverty line",
      value: "The minimum level of income considered adequate to meet basic needs",
    },
  ],
  [
    {
      key: "Disguised unemployment",
      value:
        "More people working on a job than are needed, so removing some would not reduce output",
    },
    {
      key: "Organised and unorganised sector",
      value:
        "The organised sector is registered and follows the law on wages and hours; the unorganised is not",
    },
    {
      key: "Mahatma Gandhi National Rural Employment Guarantee Act",
      value:
        "The law of 2005 guaranteeing a hundred days of wage employment a year to a rural household",
    },
    {
      key: "Reason per capita income alone is an inadequate measure",
      value:
        "It hides the distribution of income and ignores health, education and public facilities",
    },
    {
      key: "Sustainable development",
      value:
        "Development that meets present needs without compromising the ability of future generations to meet theirs",
    },
  ],
);

sst(
  "sst:globalisation-consumer",
  "Globalisation, Food Security and Consumer Rights",
  "In globalisation and consumer protection, what is %s?",
  "%k is %v.",
  [
    {
      key: "Globalisation",
      value:
        "The rapid integration of countries through trade, investment and the movement of people",
    },
    {
      key: "Multinational corporation",
      value: "A company that owns or controls production in more than one country",
    },
    {
      key: "Liberalisation",
      value: "The removal of government barriers and restrictions on trade and investment",
    },
    { key: "Year India began its new economic policy", value: "1991" },
    {
      key: "World Trade Organisation",
      value: "The body that frames and enforces the rules of international trade",
    },
    {
      key: "Food security",
      value: "The availability, accessibility and affordability of food to all people at all times",
    },
    {
      key: "Buffer stock",
      value:
        "The stock of food grain procured by the government through the Food Corporation of India",
    },
    {
      key: "Minimum support price",
      value: "The price announced in advance at which the government buys grain from farmers",
    },
    {
      key: "Public distribution system",
      value: "The distribution of food grain to ration card holders through fair price shops",
    },
    {
      key: "Year the Consumer Protection Act was first passed",
      value: "1986, and replaced by a new Act in 2019",
    },
  ],
  [
    {
      key: "Six rights of a consumer",
      value: "Safety, information, choice, redressal, representation and consumer education",
    },
    { key: "Standard mark for agricultural products", value: "AGMARK" },
    {
      key: "Standard mark for industrial and consumer goods",
      value: "The ISI mark of the Bureau of Indian Standards",
    },
    { key: "National Consumers Day in India", value: "The twenty fourth of December" },
    {
      key: "Fair trade",
      value:
        "A movement seeking better prices and working conditions for producers in developing countries",
    },
  ],
);

/* ========================================== Civics & Polity Core Chapters */

sst(
  "sst:preamble",
  "Preamble",
  "Regarding the Preamble of the Indian Constitution, what is %s?",
  "In the Preamble of the Indian Constitution, %k is %v.",
  [
    {
      key: "Opening phrase of the Preamble of India",
      value: "We, the People of India, showing that ultimate sovereignty rests with the citizens",
    },
    {
      key: "Nature of the Indian State declared in the Preamble",
      value: "Sovereign, Socialist, Secular, Democratic and Republic",
    },
    {
      key: "Three forms of Justice secured by the Preamble",
      value: "Social, economic and political justice",
    },
    {
      key: "Five forms of Liberty guaranteed in the Preamble",
      value: "Liberty of thought, expression, belief, faith and worship",
    },
    {
      key: "Two dimensions of Equality mentioned in the Preamble",
      value: "Equality of status and of opportunity",
    },
    {
      key: "Core objective of Fraternity in the Preamble",
      value: "Assuring the dignity of the individual and the unity and integrity of the Nation",
    },
    {
      key: "Historical basis of the Preamble",
      value: "The Objectives Resolution moved by Jawaharlal Nehru on 13 December 1946",
    },
    {
      key: "Date of adoption mentioned in the Preamble",
      value: "Twenty-sixth day of November, 1949 (26 November 1949)",
    },
    {
      key: "Three words added to the Preamble by the 42nd Amendment Act 1976",
      value: "Socialist, Secular and Integrity",
    },
    {
      key: "Revolution that inspired the ideals of Liberty, Equality and Fraternity",
      value: "The French Revolution of 1789",
    },
  ],
  [
    {
      key: "Revolution that inspired Social, Economic and Political Justice in the Preamble",
      value: "The Russian Revolution of 1917",
    },
    {
      key: "Supreme Court ruling in the Kesavananda Bharati case (1973) on the Preamble",
      value:
        "The Preamble is an integral part of the Constitution and can be amended without altering the Basic Structure",
    },
    {
      key: "Supreme Court view in the Berubari Union case (1960) on the Preamble",
      value:
        "It held that the Preamble is a key to the minds of the makers but not a part of the Constitution, later overruled",
    },
    {
      key: "Jurist who called the Preamble the Identity Card of the Constitution",
      value: "N. A. Palkhivala",
    },
    {
      key: "Thinker who described the Preamble as the Horoscope of our Sovereign Democratic Republic",
      value: "K. M. Munshi",
    },
  ],
);

sst(
  "sst:indian-constitution",
  "Indian Constitution and Constituent Assembly",
  "In the making of the Indian Constitution, what is %s?",
  "In the Indian Constitution, %k is %v.",
  [
    {
      key: "Plan under which the Constituent Assembly of India was constituted in 1946",
      value: "The Cabinet Mission Plan of 1946",
    },
    {
      key: "Temporary Chairman of the first meeting of the Constituent Assembly on 9 December 1946",
      value: "Dr. Sachchidananda Sinha",
    },
    {
      key: "Permanent President of the Constituent Assembly elected on 11 December 1946",
      value: "Dr. Rajendra Prasad",
    },
    {
      key: "Chairman of the Drafting Committee of the Indian Constitution",
      value: "Dr. B. R. Ambedkar",
    },
    {
      key: "Constitutional Advisor to the Constituent Assembly",
      value: "Sir B. N. Rau",
    },
    {
      key: "Total time taken to frame the Indian Constitution",
      value: "2 years, 11 months and 18 days across 11 sessions",
    },
    {
      key: "Original structure of the Constitution of India on 26 January 1950",
      value: "A Preamble, 395 Articles in 22 Parts and 8 Schedules",
    },
    {
      key: "Present number of Schedules in the Indian Constitution",
      value: "Twelve Schedules",
    },
    {
      key: "Source country of the Parliamentary System and Rule of Law in India",
      value: "The United Kingdom (British Constitution)",
    },
    {
      key: "Source country of Directive Principles of State Policy",
      value: "The Irish Constitution (Ireland)",
    },
  ],
  [
    {
      key: "Eighth Schedule of the Indian Constitution",
      value: "Lists the 22 officially recognised languages of the Republic of India",
    },
    {
      key: "Tenth Schedule of the Indian Constitution",
      value: "Contains the Anti-Defection Law added by the 52nd Amendment Act, 1985",
    },
    {
      key: "Reason 26 January was chosen for the commencement of the Constitution",
      value: "To commemorate the Purna Swaraj declaration celebrated on 26 January 1930",
    },
    {
      key: "Calligrapher of the original English manuscript of the Indian Constitution",
      value: "Prem Behari Narain Raizada",
    },
    {
      key: "Source of Fundamental Rights and Judicial Review in the Indian Constitution",
      value: "The Constitution of the United States of America",
    },
  ],
);

sst(
  "sst:fundamental-rights-duties",
  "Fundamental Rights and Fundamental Duties",
  "In the Fundamental Rights and Duties of the Constitution, what is %s?",
  "Under Fundamental Rights and Duties, %k is %v.",
  [
    {
      key: "Part and Articles of the Constitution containing Fundamental Rights",
      value: "Part III, spanning Articles 12 to 35, often called the Magna Carta of India",
    },
    {
      key: "Right to Equality in the Indian Constitution",
      value: "Guaranteed under Articles 14 to 18, including abolition of untouchability",
    },
    {
      key: "Article 17 of the Indian Constitution",
      value: "Abolishes Untouchability and forbids its practice in any form",
    },
    {
      key: "Article 21 of the Indian Constitution",
      value: "Guarantees Protection of Life and Personal Liberty",
    },
    {
      key: "Article 21A added by the 86th Amendment Act 2002",
      value: "Makes free and compulsory education a Fundamental Right for children aged 6 to 14",
    },
    {
      key: "Article 24 under Right against Exploitation",
      value: "Prohibits employment of children below 14 years in factories and mines",
    },
    {
      key: "Article 32 of the Indian Constitution",
      value: "Right to Constitutional Remedies, empowering the Supreme Court to issue five writs",
    },
    {
      key: "Amendment that removed the Right to Property from Fundamental Rights",
      value:
        "The 44th Constitutional Amendment Act, 1978, making it a legal right under Article 300A",
    },
    {
      key: "Part and Article containing Fundamental Duties",
      value: "Part IVA, Article 51A, containing 11 Fundamental Duties",
    },
    {
      key: "Committee that recommended the inclusion of Fundamental Duties in 1976",
      value: "The Sardar Swaran Singh Committee",
    },
  ],
  [
    {
      key: "Fundamental Rights available ONLY to citizens of India and not foreigners",
      value: "Articles 15, 16, 19, 29 and 30",
    },
    {
      key: "Fundamental Rights that cannot be suspended even during a National Emergency",
      value: "Articles 20 and 21, as safeguarded by the 44th Amendment Act",
    },
    {
      key: "Writ of Habeas Corpus",
      value:
        "An order to produce a detained person before the court to examine the legality of arrest",
    },
    {
      key: "Writ of Mandamus",
      value: "A command issued by a court to a public official to perform a mandatory public duty",
    },
    {
      key: "Writ of Quo Warranto",
      value: "An inquiry into the legality of a person's claim to a public office",
    },
  ],
);

sst(
  "sst:directive-principles",
  "Directive Principles of State Policy",
  "Under the Directive Principles of State Policy, what is %s?",
  "In Part IV (DPSP) of the Constitution, %k is %v.",
  [
    {
      key: "Part and Articles of the Constitution dealing with Directive Principles",
      value: "Part IV, Articles 36 to 51",
    },
    {
      key: "Legal nature of Directive Principles of State Policy",
      value: "Non-justiciable guidelines fundamental in the governance of the country",
    },
    {
      key: "Article 39A of the Constitution",
      value: "Directs the State to promote equal justice and provide free legal aid to the poor",
    },
    {
      key: "Article 40 of the Constitution",
      value: "Directs the State to organise village panchayats as units of self-government",
    },
    {
      key: "Article 44 of the Constitution",
      value: "Directs the State to endeavour to secure a Uniform Civil Code for citizens",
    },
    {
      key: "Article 45 of the Constitution",
      value: "Provides for early childhood care and education for children below six years",
    },
    {
      key: "Article 48A of the Constitution",
      value: "Directs the State to protect and improve the environment, forests and wildlife",
    },
    {
      key: "Article 50 of the Constitution",
      value: "Directs the State to separate the judiciary from the executive in public services",
    },
    {
      key: "Article 51 of the Constitution",
      value: "Directs the State to promote international peace and security",
    },
    {
      key: "Concept of Welfare State in the Indian Constitution",
      value: "Embodied primarily in the Directive Principles of State Policy",
    },
  ],
  [
    {
      key: "Three broad categories of Directive Principles",
      value: "Socialistic, Gandhian and Liberal-Intellectual principles",
    },
    {
      key: "Scholar who described DPSP and Fundamental Rights as the Conscience of the Constitution",
      value: "Granville Austin",
    },
    {
      key: "Dr. B. R. Ambedkar's description of Directive Principles",
      value: "Novel features of the Indian Constitution, resembling the Instrument of Instructions",
    },
    {
      key: "Minerva Mills case (1980) ruling on Fundamental Rights and DPSP",
      value:
        "The Indian Constitution is founded on the bedrock of balance between Part III and Part IV",
    },
    {
      key: "Directive Principle added by the 97th Constitutional Amendment Act 2011",
      value:
        "Article 43B, promoting voluntary formation and autonomous functioning of cooperative societies",
    },
  ],
);

sst(
  "sst:parliament-executive",
  "Union Executive and Parliament of India",
  "In the Union Executive and Parliament of India, what is %s?",
  "In India's parliamentary system, %k is %v.",
  [
    {
      key: "Three components of the Parliament of India under Article 79",
      value: "The President of India, the Lok Sabha and the Rajya Sabha",
    },
    {
      key: "Minimum age required to become the President of India",
      value: "Thirty-five years",
    },
    {
      key: "Minimum age required to be a member of the Lok Sabha",
      value: "Twenty-five years",
    },
    {
      key: "Minimum age required to be a member of the Rajya Sabha",
      value: "Thirty years",
    },
    {
      key: "Ex-officio Chairman of the Rajya Sabha",
      value: "The Vice-President of India",
    },
    {
      key: "Presiding officer of a Joint Sitting of both Houses of Parliament under Article 108",
      value: "The Speaker of the Lok Sabha",
    },
    {
      key: "House of Parliament in which a Money Bill can be introduced under Article 110",
      value: "Only in the Lok Sabha, on the recommendation of the President",
    },
    {
      key: "Maximum time the Rajya Sabha can delay a Money Bill",
      value: "Fourteen days",
    },
    {
      key: "Collective responsibility of the Union Council of Ministers under Article 75",
      value: "Collectively responsible to the Lok Sabha",
    },
    {
      key: "Maximum permissible gap between two sessions of Parliament",
      value: "Six months",
    },
  ],
  [
    {
      key: "Article 61 of the Indian Constitution",
      value:
        "Lays down the procedure for impeachment of the President for violation of the Constitution",
    },
    {
      key: "Article 123 of the Indian Constitution",
      value: "Empowers the President to promulgate ordinances when Parliament is not in session",
    },
    {
      key: "Article 72 of the Indian Constitution",
      value: "Grants pardoning power to the President of India, including in death sentence cases",
    },
    {
      key: "Largest parliamentary committee of India",
      value:
        "The Estimates Committee, consisting of 30 members drawn exclusively from the Lok Sabha",
    },
    {
      key: "Public Accounts Committee of Parliament",
      value:
        "Examines the audit reports of the CAG and has 22 members (15 Lok Sabha, 7 Rajya Sabha)",
    },
  ],
);

sst(
  "sst:judiciary-courts",
  "Supreme Court, High Courts and Judiciary",
  "In the Indian judicial system, what is %s?",
  "In the Indian judiciary, %k is %v.",
  [
    {
      key: "Date of inauguration of the Supreme Court of India",
      value: "28 January 1950",
    },
    {
      key: "Retirement age of a Judge of the Supreme Court of India",
      value: "Sixty-five years",
    },
    {
      key: "Retirement age of a Judge of a High Court in India",
      value: "Sixty-two years",
    },
    {
      key: "Authority that appoints the Chief Justice and Judges of the Supreme Court",
      value: "The President of India under Article 124",
    },
    {
      key: "Article 131 of the Indian Constitution",
      value: "Grants exclusive original jurisdiction to the Supreme Court in federal disputes",
    },
    {
      key: "Article 143 of the Indian Constitution",
      value: "Empowers the President to seek the advisory opinion of the Supreme Court",
    },
    {
      key: "Article 226 of the Indian Constitution",
      value: "Empowers High Courts to issue writs for Fundamental Rights and other legal rights",
    },
    {
      key: "Guardian and final interpreter of the Constitution of India",
      value: "The Supreme Court of India",
    },
    {
      key: "Pioneers of Public Interest Litigation (PIL) in India",
      value: "Justice P. N. Bhagwati and Justice V. R. Krishna Iyer",
    },
    {
      key: "Common High Court for Punjab, Haryana and the Union Territory of Chandigarh",
      value: "The Punjab and Haryana High Court located at Chandigarh",
    },
  ],
  [
    {
      key: "Why the writ jurisdiction of a High Court (Article 226) is wider than the Supreme Court (Article 32)",
      value: "High Courts can issue writs for both Fundamental Rights and ordinary legal rights",
    },
    {
      key: "Article 129 of the Indian Constitution",
      value: "Declares the Supreme Court to be a Court of Record with power to punish for contempt",
    },
    {
      key: "Grounds for removal of a Supreme Court or High Court Judge",
      value:
        "Proved misbehaviour or incapacity, through an address passed by special majority of both Houses",
    },
    {
      key: "Basic Structure Doctrine propounded by the Supreme Court in 1973",
      value:
        "Parliament can amend the Constitution under Article 368 but cannot destroy its basic features",
    },
    {
      key: "Article 142 of the Indian Constitution",
      value:
        "Empowers the Supreme Court to pass any decree or order necessary for doing complete justice",
    },
  ],
);

sst(
  "sst:panchayati-raj-local",
  "Panchayati Raj and Urban Local Government",
  "In Panchayati Raj and local self-government, what is %s?",
  "In India's local self-government system, %k is %v.",
  [
    {
      key: "Committee that recommended the three-tier Panchayati Raj system in 1957",
      value: "The Balwant Rai Mehta Committee",
    },
    {
      key: "First district in India to inaugurate Panchayati Raj on 2 October 1959",
      value: "Nagaur district in Rajasthan",
    },
    {
      key: "Constitutional Amendment that gave constitutional status to Panchayati Raj Institutions",
      value: "The 73rd Constitutional Amendment Act, 1992 (effective 24 April 1993)",
    },
    {
      key: "Constitutional Amendment that gave constitutional status to Municipalities",
      value: "The 74th Constitutional Amendment Act, 1992",
    },
    {
      key: "Schedule and number of subjects assigned to Panchayats",
      value: "Eleventh Schedule containing 29 functional items",
    },
    {
      key: "Schedule and number of subjects assigned to Municipalities",
      value: "Twelfth Schedule containing 18 functional items",
    },
    {
      key: "Three tiers of Panchayati Raj under Part IX",
      value:
        "Gram Panchayat at village level, Panchayat Samiti at block level and Zila Parishad at district level",
    },
    {
      key: "Minimum age required to contest a Panchayat or Municipal election",
      value: "Twenty-one years",
    },
    {
      key: "Minimum reservation of seats for women in Panchayati Raj under Article 243D",
      value: "Not less than one-third (and 50 percent in states such as Punjab)",
    },
    {
      key: "National Panchayati Raj Day celebrated in India",
      value: "24 April",
    },
  ],
  [
    {
      key: "Gram Sabha under Article 243A",
      value:
        "The body consisting of all registered voters in the area of a Panchayat at the village level",
    },
    {
      key: "Body that conducts elections to Panchayats and Municipalities",
      value: "The State Election Commission appointed under Article 243K",
    },
    {
      key: "State Finance Commission under Article 243I",
      value:
        "Constituted by the Governor every five years to review the financial position of Panchayats",
    },
    {
      key: "Ashok Mehta Committee (1977) recommendation",
      value: "Proposed replacing the three-tier system with a two-tier Panchayati Raj structure",
    },
    {
      key: "L. M. Singhvi Committee (1986) recommendation",
      value:
        "Recommended constitutional recognition and protection for Panchayati Raj institutions",
    },
  ],
);

sst(
  "sst:ancient-india",
  "Ancient Indian History and Civilisations",
  "In Ancient Indian History, what is %s?",
  "In Ancient Indian History, %k is %v.",
  [
    {
      key: "Port city of the Indus Valley Civilisation famous for its artificial brick dockyard",
      value: "Lothal in Gujarat",
    },
    {
      key: "Harappan site located in Punjab (India) on the banks of the Sutlej",
      value: "Ropar (Rupnagar)",
    },
    {
      key: "Oldest Veda composed in the Saptasindhu region",
      value: "The Rigveda, divided into 10 Mandalas and 1,028 hymns",
    },
    {
      key: "Site where Gautama Buddha delivered his first sermon (Dharmachakrapravartana)",
      value: "Sarnath near Varanasi",
    },
    {
      key: "Twenty-fourth and last Tirthankara of Jainism",
      value: "Vardhamana Mahavira",
    },
    {
      key: "Author of the Arthashastra, the ancient treatise on statecraft and polity",
      value: "Kautilya (Chanakya / Vishnugupta)",
    },
    {
      key: "Greek ambassador sent by Seleucus Nicator to the court of Chandragupta Maurya",
      value: "Megasthenes, who wrote Indica",
    },
    {
      key: "Rock Edict of Ashoka that describes the Kalinga War of 261 BCE",
      value: "Major Rock Edict XIII",
    },
    {
      key: "Gupta ruler known as the Napoleon of India for his military conquests",
      value: "Samudragupta, whose victories are recorded on the Prayagraj Pillar Inscription",
    },
    {
      key: "Chinese Buddhist pilgrim who visited India during the reign of Harshavardhana",
      value: "Hiuen Tsang (Xuanzang)",
    },
  ],
  [
    {
      key: "Harappan site in Gujarat famous for its three-part city plan and giant water reservoirs",
      value: "Dholavira",
    },
    {
      key: "Script of the majority of Ashoka's inscriptions across India",
      value: "Brahmi script, deciphered by James Prinsep in 1837",
    },
    {
      key: "Upanishad from which India's national motto Satyameva Jayate is taken",
      value: "The Mundaka Upanishad",
    },
    {
      key: "Fourth Buddhist Council held in Kashmir during the reign of Kanishka",
      value: "Presided over by Vasumitra, marking the division into Hinayana and Mahayana",
    },
    {
      key: "Mathematician and astronomer of the Gupta era who wrote the Aryabhatiya",
      value: "Aryabhata, who explained solar and lunar eclipses and the place-value system",
    },
  ],
);

sst(
  "sst:medieval-india",
  "Medieval Indian History and Bhakti-Sufi Tradition",
  "In Medieval Indian History, what is %s?",
  "In Medieval Indian History, %k is %v.",
  [
    {
      key: "Founder of the Slave (Mamluk) Dynasty and the Delhi Sultanate in 1206",
      value: "Qutb-ud-din Aibak",
    },
    {
      key: "First and only woman ruler of the Delhi Sultanate",
      value: "Razia Sultana",
    },
    {
      key: "Delhi Sultan who introduced market control and price regulation reforms",
      value: "Alauddin Khilji",
    },
    {
      key: "First Battle of Panipat (1526)",
      value: "Babur defeated Ibrahim Lodi, establishing the Mughal Empire in India",
    },
    {
      key: "Revenue system introduced by Raja Todar Mal under Emperor Akbar",
      value: "The Dahsala (Zabti) system of land assessment",
    },
    {
      key: "Military and civil grading system introduced by Akbar for nobles",
      value: "The Mansabdari system",
    },
    {
      key: "Founder of the Khalsa Panth at Anandpur Sahib on Baisakhi 1699",
      value: "Sri Guru Gobind Singh Ji",
    },
    {
      key: "Founder of the Maratha Empire crowned Chhatrapati at Raigad in 1674",
      value: "Chhatrapati Shivaji Maharaj",
    },
    {
      key: "Founders of the Vijayanagara Empire in 1336",
      value: "Harihara I and Bukka Raya I of the Sangama dynasty",
    },
    {
      key: "Sufi saint of Ajmer associated with the Chishti order in India",
      value: "Khwaja Moinuddin Chishti",
    },
  ],
  [
    {
      key: "Compile year and compiler of the Adi Granth installed at Harmandir Sahib",
      value: "Compiled in 1604 by the fifth Sikh Guru, Sri Guru Arjan Dev Ji",
    },
    {
      key: "Moroccan traveller who visited India during the reign of Muhammad bin Tughlaq",
      value: "Ibn Battuta, author of the Rihla",
    },
    {
      key: "Ashtapradhan in the administration of Chhatrapati Shivaji Maharaj",
      value: "The council of eight ministers headed by the Peshwa",
    },
    {
      key: "Author of Ain-i-Akbari and Akbarnama",
      value: "Abul Fazl",
    },
    {
      key: "Greatest ruler of the Vijayanagara Empire and author of Amuktamalyada",
      value: "Krishnadevaraya of the Tuluva dynasty",
    },
  ],
);

sst(
  "sst:modern-india-freedom",
  "Modern Indian History and Freedom Struggle",
  "In Modern Indian History and the Freedom Struggle, what is %s?",
  "In the Indian freedom struggle, %k is %v.",
  [
    {
      key: "Governor-General of India during the Revolt of 1857",
      value: "Lord Canning, who also became the first Viceroy of India",
    },
    {
      key: "Founder and year of establishment of the Indian National Congress",
      value: "Founded in December 1885 by A. O. Hume, with W. C. Bonnerjee as first President",
    },
    {
      key: "Viceroy responsible for the Partition of Bengal in 1905",
      value: "Lord Curzon",
    },
    {
      key: "Movement launched in 1905 in protest against the Partition of Bengal",
      value: "The Swadeshi and Boycott Movement",
    },
    {
      key: "Ghadar Party founded in 1913 in San Francisco",
      value:
        "Revolutionary organisation with Sohan Singh Bhakna as President and Lala Hardayal as leader",
    },
    {
      key: "Jallianwala Bagh Massacre date and place",
      value: "13 April 1919 (Baisakhi day) in Amritsar",
    },
    {
      key: "Congress session of December 1929 that adopted the Purna Swaraj resolution",
      value: "The Lahore Session presided over by Jawaharlal Nehru",
    },
    {
      key: "Dandi March (Salt Satyagraha) led by Mahatma Gandhi in 1930",
      value: "Began on 12 March 1930 from Sabarmati Ashram and reached Dandi on 6 April 1930",
    },
    {
      key: "Quit India Movement launched in August 1942",
      value: "Mass movement in which Mahatma Gandhi gave the call Do or Die",
    },
    {
      key: "Founder of the Forward Bloc and leader of the Azad Hind Fauj (INA)",
      value: "Netaji Subhas Chandra Bose",
    },
  ],
  [
    {
      key: "Poona Pact of September 1932",
      value:
        "Signed between Mahatma Gandhi and Dr. B. R. Ambedkar providing reserved seats for Depressed Classes",
    },
    {
      key: "Hindustan Socialist Republican Association (HSRA) reorganised in 1928",
      value: "Led by Chandrashekhar Azad, Bhagat Singh, Sukhdev and Rajguru",
    },
    {
      key: "Permanent Settlement of Bengal (1793)",
      value: "Land revenue system introduced by Lord Cornwallisrecognising zamindars as landowners",
    },
    {
      key: "Founder of the Brahmo Samaj in 1828 and pioneer of Indian social reform",
      value: "Raja Ram Mohan Roy",
    },
    {
      key: "Founder of the Satya Shodhak Samaj in 1873 and author of Gulamgiri",
      value: "Mahatma Jyotirao Phule",
    },
  ],
);

export const SST_FULL_TEMPLATES = templates;
