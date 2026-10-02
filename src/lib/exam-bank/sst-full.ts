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

export const SST_FULL_TEMPLATES = templates;
