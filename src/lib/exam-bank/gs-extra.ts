/**
 * General Studies — the remaining chapters needed to close each syllabus.
 *
 * This file completes Polity, the history streams, geography, environment
 * and science, so that every General Studies subject in the bank matches the
 * published section list of the exams that set it.
 */

import { type Template } from "./core";
import { CIVIL_DEFENCE, GK_WIDE, SSC_RRB, chapterFactory } from "./two-layer";

const templates: Template[] = [];
const POLITY = [...new Set([...GK_WIDE, ...CIVIL_DEFENCE])];
const SCI = [...new Set([...GK_WIDE, ...SSC_RRB, ...CIVIL_DEFENCE])];

const pol = chapterFactory(templates, "Polity", POLITY);
const med = chapterFactory(templates, "Medieval History", GK_WIDE);
const mod = chapterFactory(templates, "Modern History", GK_WIDE);
const cul = chapterFactory(templates, "Art and Culture", GK_WIDE);
const ind = chapterFactory(templates, "Indian Geography", GK_WIDE);
const wor = chapterFactory(templates, "World Geography", GK_WIDE);
const phy = chapterFactory(templates, "Physical Geography", GK_WIDE);
const env = chapterFactory(templates, "Environment and Ecology", GK_WIDE);
const sci = chapterFactory(templates, "General Science", SCI);
const tech = chapterFactory(templates, "Science and Technology", GK_WIDE);

/* ============================================================== Polity = */

pol(
  "pol:making",
  "Making of the Constitution",
  "About the making of the Constitution, what is %s?",
  "%k is %v.",
  [
    {
      key: "Body that framed the Constitution",
      value: "The Constituent Assembly, set up under the Cabinet Mission Plan of 1946",
    },
    { key: "First sitting of the Constituent Assembly", value: "9 December 1946" },
    { key: "Permanent Chairman of the Constituent Assembly", value: "Dr Rajendra Prasad" },
    { key: "Chairman of the Drafting Committee", value: "Dr B R Ambedkar" },
    { key: "Who moved the Objectives Resolution", value: "Jawaharlal Nehru, on 13 December 1946" },
    { key: "Date the Constitution was adopted", value: "26 November 1949" },
    { key: "Date the Constitution came into force", value: "26 January 1950" },
    {
      key: "Time taken to frame the Constitution",
      value: "Two years, eleven months and eighteen days",
    },
    { key: "Constitutional adviser to the Assembly", value: "B N Rau" },
    { key: "Why 26 January was chosen", value: "It marked the Purna Swaraj declaration of 1930" },
  ],
  [
    { key: "Number of members in the Drafting Committee", value: "Seven" },
    { key: "Total number of sessions of the Assembly", value: "Eleven sessions" },
    {
      key: "Who designed the original calligraphy",
      value: "Prem Behari Narain Raizada wrote it by hand and Nandalal Bose led the illustration",
    },
    {
      key: "First woman to preside over a sitting",
      value: "The Assembly had fifteen women members, including Sarojini Naidu and Hansa Mehta",
    },
    {
      key: "Provisional President of India",
      value: "Dr Rajendra Prasad, who later became the first President",
    },
  ],
);

pol(
  "pol:citizenship",
  "Citizenship",
  "About citizenship in India, what is %s?",
  "%k is %v.",
  [
    { key: "Articles dealing with citizenship", value: "Articles 5 to 11 of Part II" },
    { key: "Law governing citizenship", value: "The Citizenship Act of 1955" },
    { key: "Type of citizenship in India", value: "Single citizenship for the whole country" },
    {
      key: "Citizenship by birth",
      value: "Acquired by being born in India, subject to the conditions of the Act",
    },
    {
      key: "Citizenship by descent",
      value: "Acquired through an Indian parent when born outside India",
    },
    {
      key: "Citizenship by registration",
      value:
        "Granted to certain categories such as a person of Indian origin ordinarily resident in India",
    },
    {
      key: "Citizenship by naturalisation",
      value: "Granted to a foreigner who fulfils the residence and other conditions",
    },
    {
      key: "Citizenship by incorporation of territory",
      value: "Granted when a new territory becomes part of India",
    },
    { key: "Authority that can regulate citizenship", value: "Parliament, under Article 11" },
    {
      key: "Overseas Citizen of India",
      value:
        "A status giving certain rights to persons of Indian origin abroad, but not voting rights",
    },
  ],
  [
    {
      key: "Loss of citizenship",
      value: "By renunciation, termination or deprivation under the Citizenship Act",
    },
    {
      key: "Rights available only to citizens",
      value:
        "Articles 15, 16, 19, 29 and 30, along with the right to vote and hold certain offices",
    },
    {
      key: "Citizenship Amendment Act 2019",
      value:
        "It provided an eased path to citizenship for certain migrants who entered before 2015",
    },
    {
      key: "Dual citizenship in India",
      value: "Not permitted; the OCI card is not a form of dual citizenship",
    },
    {
      key: "Article 11 significance",
      value:
        "It lets Parliament make any provision on citizenship, overriding the earlier articles",
    },
  ],
);

pol(
  "pol:amendment",
  "Amendment of the Constitution",
  "About constitutional amendment, what is %s?",
  "%k is %v.",
  [
    { key: "Article dealing with amendment", value: "Article 368" },
    {
      key: "Who can introduce an amendment bill",
      value: "Only a member of Parliament, in either House",
    },
    {
      key: "Role of the state legislatures",
      value: "Ratification by half the states is needed for federal provisions",
    },
    {
      key: "Special majority",
      value: "A majority of the total membership and two thirds of those present and voting",
    },
    { key: "First Amendment", value: "The 1951 amendment that added the Ninth Schedule" },
    { key: "Forty second Amendment", value: "The 1976 amendment called a mini constitution" },
    {
      key: "Forty fourth Amendment",
      value: "The 1978 amendment that removed the right to property from Fundamental Rights",
    },
    {
      key: "Seventy third Amendment",
      value: "The 1992 amendment that gave constitutional status to panchayats",
    },
    { key: "Seventy fourth Amendment", value: "The 1992 amendment on urban local bodies" },
    {
      key: "One hundred and first Amendment",
      value: "The amendment that introduced the Goods and Services Tax",
    },
  ],
  [
    {
      key: "Basic structure doctrine",
      value:
        "Laid down in Kesavananda Bharati in 1973, holding that the basic structure cannot be amended away",
    },
    {
      key: "Golaknath case",
      value:
        "The 1967 ruling that Parliament could not abridge Fundamental Rights, later overruled in part",
    },
    {
      key: "Minerva Mills case",
      value: "The 1980 ruling that struck down clauses giving Parliament unlimited amending power",
    },
    {
      key: "Provisions amendable by simple majority",
      value:
        "Matters such as creation of new states, citizenship and salaries, outside Article 368",
    },
    {
      key: "Role of the President in amendment",
      value: "The President must give assent and cannot return an amendment bill",
    },
  ],
);

pol(
  "pol:union-executive",
  "Union Executive and Council of Ministers",
  "About the Union Executive, what is %s?",
  "%k is %v.",
  [
    {
      key: "Real executive head of the Union",
      value: "The Prime Minister, who heads the Council of Ministers",
    },
    {
      key: "Article on the Council of Ministers",
      value: "Article 74, which makes their advice binding on the President",
    },
    { key: "Article on the appointment of the Prime Minister", value: "Article 75" },
    {
      key: "Collective responsibility",
      value: "The Council of Ministers is collectively responsible to the Lok Sabha",
    },
    {
      key: "Maximum size of the Council of Ministers",
      value: "Fifteen per cent of the strength of the Lok Sabha",
    },
    {
      key: "Three ranks of ministers",
      value: "Cabinet Minister, Minister of State and Deputy Minister",
    },
    { key: "Who administers the oath to the Prime Minister", value: "The President" },
    {
      key: "Cabinet Secretary",
      value: "The senior most civil servant, who heads the Cabinet Secretariat",
    },
    {
      key: "Attorney General of India",
      value: "The highest law officer, appointed under Article 76",
    },
    {
      key: "Comptroller and Auditor General",
      value: "The constitutional auditor appointed under Article 148",
    },
  ],
  [
    {
      key: "Ninety first Amendment on ministers",
      value: "It capped the Council of Ministers at fifteen per cent of the House strength",
    },
    {
      key: "Kitchen cabinet",
      value: "The informal inner circle of the Prime Minister's closest advisers",
    },
    {
      key: "Position of a minister who is not a member of either House",
      value: "The minister must become a member within six months",
    },
    {
      key: "Article 78",
      value:
        "The duty of the Prime Minister to communicate the decisions of the Council to the President",
    },
    {
      key: "CAG's reports",
      value: "They are laid before Parliament and examined by the Public Accounts Committee",
    },
  ],
);

pol(
  "pol:state-government",
  "State Government and Legislature",
  "About state government, what is %s?",
  "%k is %v.",
  [
    { key: "Constitutional head of a state", value: "The Governor, appointed by the President" },
    { key: "Real executive head of a state", value: "The Chief Minister" },
    {
      key: "Lower House of a state legislature",
      value: "The Vidhan Sabha or Legislative Assembly",
    },
    {
      key: "Upper House of a state legislature",
      value: "The Vidhan Parishad or Legislative Council, where it exists",
    },
    { key: "Maximum strength of a Legislative Assembly", value: "Five hundred members" },
    { key: "Term of a Legislative Assembly", value: "Five years, unless dissolved earlier" },
    { key: "Article on the appointment of the Chief Minister", value: "Article 164" },
    {
      key: "Advocate General of a state",
      value: "The highest law officer of the state, appointed by the Governor",
    },
    { key: "Article 213", value: "The power of the Governor to promulgate ordinances" },
    {
      key: "Who can create or abolish a Legislative Council",
      value: "Parliament, on a resolution of the state assembly",
    },
  ],
  [
    {
      key: "Article 200",
      value:
        "The Governor's options on a bill: assent, withhold, return or reserve for the President",
    },
    {
      key: "Discretionary powers of the Governor",
      value:
        "Reserving a bill, recommending President's rule and choosing a Chief Minister in a hung house",
    },
    {
      key: "Maximum size of a Legislative Council",
      value: "One third of the strength of the Assembly, and not less than forty",
    },
    {
      key: "Composition of a Legislative Council",
      value:
        "Members elected by local bodies, graduates, teachers, the Assembly and nominated by the Governor",
    },
    {
      key: "Article 356 and the states",
      value: "President's rule on the breakdown of constitutional machinery in a state",
    },
  ],
);

pol(
  "pol:services",
  "Public Services and Service Commissions",
  "About the public services, what is %s?",
  "%k is %v.",
  [
    {
      key: "All India Services",
      value: "The IAS, IPS and Indian Forest Service, common to the Union and the states",
    },
    {
      key: "Article on the creation of a new All India Service",
      value: "Article 312, requiring a Rajya Sabha resolution",
    },
    {
      key: "Union Public Service Commission",
      value: "The constitutional body under Article 315 that recruits for central services",
    },
    { key: "Appointment of UPSC members", value: "By the President" },
    {
      key: "Term of a UPSC member",
      value: "Six years or up to the age of sixty five, whichever is earlier",
    },
    {
      key: "State Public Service Commission",
      value: "The state counterpart of the UPSC, with members appointed by the Governor",
    },
    {
      key: "Removal of a UPSC member",
      value: "Only by the President on the report of the Supreme Court",
    },
    {
      key: "Article 311",
      value: "Protection given to civil servants against arbitrary dismissal or reduction in rank",
    },
    {
      key: "Staff Selection Commission",
      value: "The body that recruits for Group B and Group C posts in the Union government",
    },
    {
      key: "Central Vigilance Commission",
      value: "The apex integrity institution for the central government",
    },
  ],
  [
    {
      key: "Joint State Public Service Commission",
      value: "A commission serving two or more states, created by Parliament on their request",
    },
    {
      key: "Who can be removed only like a Supreme Court judge",
      value: "The Comptroller and Auditor General and the Chief Election Commissioner",
    },
    {
      key: "Report of the UPSC",
      value:
        "Submitted annually to the President and laid before Parliament with an explanation of any non-acceptance",
    },
    {
      key: "Doctrine of pleasure",
      value:
        "Civil servants hold office during the pleasure of the President, subject to Article 311",
    },
    {
      key: "Lokpal and Lokayuktas Act",
      value: "The 2013 law creating an anti-corruption ombudsman at the Union and state levels",
    },
  ],
);

pol(
  "pol:sources",
  "Sources and Salient Features of the Constitution",
  "In the Constitution, from where did India borrow %s?",
  "India borrowed %k from %v.",
  [
    { key: "the parliamentary system and rule of law", value: "the United Kingdom" },
    { key: "Fundamental Rights and judicial review", value: "the United States" },
    { key: "Directive Principles of State Policy", value: "Ireland" },
    { key: "the concurrent list and freedom of trade", value: "Australia" },
    { key: "emergency provisions", value: "the Weimar Constitution of Germany" },
    { key: "the federal system with a strong centre", value: "Canada" },
    { key: "Fundamental Duties and the five year plans", value: "the erstwhile USSR" },
    { key: "the procedure established by law", value: "Japan" },
    { key: "the amendment procedure and election of the Rajya Sabha", value: "South Africa" },
    { key: "the ideals of liberty, equality and fraternity", value: "France" },
  ],
  [
    { key: "the office of Governor and the power of the President over states", value: "Canada" },
    { key: "the preamble style of the opening declaration", value: "the United States" },
    {
      key: "the impeachment of the President and the removal of judges",
      value: "the United States",
    },
    { key: "the joint sitting of the two Houses", value: "Australia" },
    { key: "the suspension of Fundamental Rights during an emergency", value: "Germany" },
  ],
);

/* ==================================================== Medieval History = */

med(
  "hist:med:administration",
  "Medieval Administration, Economy and Society",
  "In medieval Indian administration, what is %s?",
  "%k is %v.",
  [
    {
      key: "Diwan",
      value: "The head of the revenue department under the Sultanate and the Mughals",
    },
    { key: "Wazir", value: "The chief minister of the Sultan" },
    { key: "Qazi", value: "The judicial officer administering Islamic law" },
    { key: "Muqti or Iqtadar", value: "The holder of an iqta, responsible for revenue and troops" },
    { key: "Kharaj", value: "The land tax collected from cultivators" },
    { key: "Zakat", value: "The religious tax of two and a half per cent on wealth" },
    { key: "Jizya", value: "The tax levied on non-Muslim subjects" },
    { key: "Khalisa land", value: "Land whose revenue went directly to the state treasury" },
    { key: "Karkhana", value: "The royal workshop producing goods for the court" },
    { key: "Sarai", value: "The rest house built along highways for travellers and traders" },
  ],
  [
    {
      key: "Mansab of zat and sawar",
      value: "The two numbers fixing an officer's personal rank and his cavalry obligation",
    },
    { key: "Jagir", value: "The revenue assignment given to a mansabdar in place of cash salary" },
    { key: "Dahsala system", value: "Todar Mal's revenue settlement based on a ten year average" },
    { key: "Dastur-ul-amal", value: "The schedule of revenue rates fixed for each locality" },
    {
      key: "Mughal coin of account",
      value: "The silver rupaya introduced by Sher Shah and continued by the Mughals",
    },
  ],
);

med(
  "hist:med:architecture",
  "Medieval Architecture and Literature",
  "In medieval architecture and literature, what is %s?",
  "%k is %v.",
  [
    { key: "Qutub Minar", value: "The tower at Delhi begun by Qutb-ud-din Aibak" },
    { key: "Alai Darwaza", value: "The gateway built by Alauddin Khalji at the Qutub complex" },
    { key: "Tughlaqabad", value: "The fortified city built by Ghiyasuddin Tughlaq" },
    { key: "Humayun's Tomb", value: "The first great Mughal garden tomb, at Delhi" },
    { key: "Fatehpur Sikri", value: "Akbar's capital city in red sandstone" },
    { key: "Buland Darwaza", value: "The victory gate at Fatehpur Sikri" },
    { key: "Taj Mahal", value: "Shah Jahan's marble mausoleum at Agra" },
    { key: "Red Fort of Delhi", value: "Shah Jahan's fortified palace, built after 1638" },
    { key: "Babur's memoir", value: "The Baburnama, written in Turkish" },
    { key: "Akbarnama", value: "Abul Fazl's official history of Akbar's reign" },
  ],
  [
    {
      key: "Pietra dura",
      value: "The inlay of coloured stones in marble, perfected under Shah Jahan",
    },
    {
      key: "Charbagh",
      value: "The four quartered Persian garden plan used at Humayun's Tomb and the Taj",
    },
    { key: "Padshahnama", value: "The court chronicle of Shah Jahan's reign" },
    { key: "Tuzuk-i-Jahangiri", value: "The memoirs of Jahangir" },
    {
      key: "Indo-Islamic arch and dome",
      value: "The true arch and dome introduced by the Turks, replacing the earlier trabeate style",
    },
  ],
);

/* ====================================================== Modern History = */

mod(
  "hist:mod:governors",
  "Governors General and Viceroys",
  "Among the Governors General and Viceroys, what is %s?",
  "%k is %v.",
  [
    { key: "Warren Hastings", value: "The first Governor General of Bengal, from 1773" },
    {
      key: "Lord Cornwallis",
      value: "The author of the Permanent Settlement and the civil service reforms",
    },
    { key: "Lord Wellesley", value: "The author of the Subsidiary Alliance" },
    { key: "Lord William Bentinck", value: "The Governor General who abolished sati in 1829" },
    {
      key: "Lord Dalhousie",
      value: "The author of the Doctrine of Lapse and the first railway line",
    },
    { key: "Lord Canning", value: "The last Governor General and the first Viceroy of India" },
    { key: "Lord Ripon", value: "The Viceroy of local self government and the Ilbert Bill" },
    { key: "Lord Curzon", value: "The Viceroy who partitioned Bengal in 1905" },
    {
      key: "Lord Chelmsford",
      value: "The Viceroy of the Montagu-Chelmsford reforms and Jallianwala Bagh",
    },
    { key: "Lord Mountbatten", value: "The last Viceroy, who oversaw the transfer of power" },
  ],
  [
    {
      key: "Lord Minto I and Minto II",
      value: "Minto I preceded Wellesley; Minto II introduced separate electorates in 1909",
    },
    {
      key: "Lord Hardinge II",
      value: "The Viceroy who shifted the capital from Calcutta to Delhi in 1911",
    },
    { key: "Lord Irwin", value: "The Viceroy of the Gandhi-Irwin Pact of 1931" },
    {
      key: "Lord Linlithgow",
      value: "The Viceroy during the Second World War and the Quit India Movement",
    },
    {
      key: "Lord Wavell",
      value: "The Viceroy of the Simla Conference and the Cabinet Mission period",
    },
  ],
);

mod(
  "hist:mod:peasant-tribal",
  "Peasant, Tribal and Labour Movements",
  "Among the peasant and tribal movements, what is %s?",
  "%k is %v.",
  [
    {
      key: "Santhal rebellion",
      value: "The 1855 uprising in present-day Jharkhand, led by Sidhu and Kanhu",
    },
    {
      key: "Indigo revolt",
      value: "The 1859 Bengal revolt of ryots against forced indigo cultivation",
    },
    {
      key: "Deccan riots",
      value: "The 1875 agrarian uprising in Maharashtra against moneylenders",
    },
    {
      key: "Munda rebellion",
      value: "The Ulgulan led by Birsa Munda in the late nineteenth century",
    },
    { key: "Champaran Satyagraha", value: "Gandhi's 1917 movement against the tinkathia system" },
    {
      key: "Kheda Satyagraha",
      value: "The 1918 movement for remission of land revenue in Gujarat",
    },
    { key: "Bardoli Satyagraha", value: "The 1928 no-tax movement led by Vallabhbhai Patel" },
    { key: "Moplah rebellion", value: "The 1921 uprising in Malabar" },
    {
      key: "Tebhaga movement",
      value: "The 1946 Bengal sharecroppers' demand for two thirds of the produce",
    },
    {
      key: "Telangana movement",
      value: "The peasant armed struggle against the Nizam's landlords from 1946",
    },
  ],
  [
    {
      key: "Kol uprising",
      value: "The 1831 rising in Chhota Nagpur against outsiders and revenue farmers",
    },
    {
      key: "Pagri Sambhal Jatta",
      value: "The 1907 Punjab agitation led by Ajit Singh against colonial land laws",
    },
    { key: "All India Kisan Sabha", value: "The peasant organisation formed in 1936 at Lucknow" },
    {
      key: "AITUC",
      value:
        "The All India Trade Union Congress, founded in 1920 with Lala Lajpat Rai as president",
    },
    { key: "Eka movement", value: "The 1921 tenant movement of Awadh against high rents" },
  ],
);

mod(
  "hist:mod:press-education",
  "Press, Education and Colonial Policy",
  "In colonial education and the press, what is %s?",
  "%k is %v.",
  [
    {
      key: "Macaulay's Minute",
      value: "The 1835 minute that made English the medium of higher education",
    },
    {
      key: "Wood's Despatch",
      value: "The 1854 despatch called the Magna Carta of English education in India",
    },
    {
      key: "Hunter Commission",
      value: "The 1882 commission on the state of primary and secondary education",
    },
    { key: "First three universities", value: "Calcutta, Bombay and Madras, all founded in 1857" },
    {
      key: "Vernacular Press Act",
      value: "The 1878 law of Lytton curbing Indian language newspapers",
    },
    { key: "Who repealed the Vernacular Press Act", value: "Lord Ripon, in 1882" },
    { key: "First Indian newspaper", value: "The Bengal Gazette of James Augustus Hicky, 1780" },
    { key: "Kesari and Maratha", value: "The newspapers started by Bal Gangadhar Tilak" },
    {
      key: "Amrita Bazar Patrika",
      value: "The Bengali newspaper that turned overnight into English to escape the Press Act",
    },
    {
      key: "Charter Act of 1813 on education",
      value: "It set aside one lakh rupees a year for the revival of learning in India",
    },
  ],
  [
    {
      key: "Sadler Commission",
      value: "The 1917 commission on the reform of university education",
    },
    { key: "Sargent Plan", value: "The 1944 post-war plan for national education" },
    {
      key: "Downward filtration theory",
      value:
        "The policy of educating a small elite in the hope that learning would spread downward",
    },
    {
      key: "Indian Press Act of 1910",
      value: "The law empowering local governments to demand security from printers",
    },
    {
      key: "Hartog Committee",
      value: "The 1929 committee that criticised the wastage and stagnation in primary education",
    },
  ],
);

/* ======================================================= Art and Culture */

cul(
  "hist:cul:literature",
  "Literature, Painting and Handicrafts",
  "In Indian literature and art, what is %s?",
  "%k is %v.",
  [
    {
      key: "Sangam literature",
      value: "The earliest Tamil literature, composed in assemblies of poets",
    },
    { key: "Abhijnanashakuntalam", value: "Kalidasa's Sanskrit play on Shakuntala" },
    { key: "Mrichchhakatika", value: "Shudraka's Sanskrit play, The Little Clay Cart" },
    { key: "Rajatarangini", value: "Kalhana's chronicle of the kings of Kashmir" },
    { key: "Madhubani painting", value: "The folk painting tradition of Mithila in Bihar" },
    { key: "Warli painting", value: "The tribal wall painting of Maharashtra" },
    { key: "Pattachitra", value: "The cloth scroll painting of Odisha and Bengal" },
    { key: "Tanjore painting", value: "The gold leaf panel painting of Tamil Nadu" },
    { key: "Pashmina", value: "The fine woollen craft of Kashmir" },
    { key: "Bidriware", value: "The blackened metal inlay craft of Bidar in Karnataka" },
  ],
  [
    {
      key: "Mughal miniature",
      value: "Court painting blending Persian technique with Indian subject matter",
    },
    { key: "Pahari school", value: "The hill painting tradition of Kangra, Basohli and Guler" },
    {
      key: "Rajput or Rajasthani school",
      value: "The painting tradition of Mewar, Bundi, Kishangarh and Marwar",
    },
    { key: "Kalamkari", value: "The hand painted or block printed cotton craft of Andhra Pradesh" },
    {
      key: "Channapatna toys",
      value: "The lacquered wooden toys of Karnataka, protected by a geographical indication",
    },
  ],
);

cul(
  "hist:cul:religion-philosophy",
  "Religion, Philosophy and Schools of Thought",
  "In Indian philosophy and religion, what is %s?",
  "%k is %v.",
  [
    {
      key: "Six orthodox schools",
      value: "Samkhya, Yoga, Nyaya, Vaisheshika, Mimamsa and Vedanta",
    },
    { key: "Samkhya", value: "The dualist school of purusha and prakriti" },
    { key: "Yoga school", value: "The school of Patanjali, built on eight limbs of practice" },
    { key: "Nyaya", value: "The school of logic and the means of valid knowledge" },
    { key: "Vaisheshika", value: "The school of atomism and categories of reality" },
    { key: "Mimamsa", value: "The school of ritual interpretation of the Vedas" },
    { key: "Advaita Vedanta", value: "Shankaracharya's philosophy of non-dualism" },
    { key: "Vishishtadvaita", value: "Ramanuja's qualified non-dualism" },
    { key: "Dvaita", value: "Madhvacharya's dualist philosophy" },
    { key: "Charvaka", value: "The materialist school that rejected the authority of the Vedas" },
  ],
  [
    { key: "Ajivika sect", value: "The fatalist school founded by Makkhali Gosala" },
    {
      key: "Hinayana and Mahayana",
      value: "The two great divisions of Buddhism, differing on the ideal of liberation",
    },
    {
      key: "Vajrayana",
      value: "The tantric form of Buddhism that developed in the eastern regions",
    },
    { key: "Anekantavada", value: "The Jain doctrine of the many sidedness of reality" },
    {
      key: "Bhakti and Sufi common ground",
      value:
        "Both stressed devotion, equality and the vernacular over ritual and priestly authority",
    },
  ],
);

/* ====================================================== Indian Geography */

ind(
  "geo:ind:transport",
  "Transport and Communication in India",
  "In India's transport network, what is %s?",
  "%k is %v.",
  [
    { key: "Longest national highway", value: "NH 44, from Srinagar to Kanniyakumari" },
    {
      key: "Body that builds national highways",
      value: "The National Highways Authority of India",
    },
    { key: "Largest railway zone by route length", value: "Northern Railway" },
    { key: "Headquarters of Indian Railways", value: "New Delhi" },
    { key: "First railway line in India", value: "Bombay to Thane, in 1853" },
    { key: "Konkan Railway", value: "The line along the western coast from Roha to Mangaluru" },
    { key: "Busiest container port", value: "Jawaharlal Nehru Port at Nhava Sheva" },
    { key: "Inland waterway National Waterway 1", value: "The Ganga between Haldia and Prayagraj" },
    {
      key: "Golden Quadrilateral",
      value: "The highway network joining Delhi, Mumbai, Chennai and Kolkata",
    },
    {
      key: "North South and East West corridors",
      value: "Srinagar to Kanniyakumari and Silchar to Porbandar",
    },
  ],
  [
    {
      key: "Dedicated Freight Corridor",
      value: "The eastern and western corridors built to separate freight from passenger traffic",
    },
    {
      key: "Sagarmala programme",
      value: "The port led development programme for coastal economic growth",
    },
    {
      key: "Bharatmala programme",
      value: "The umbrella highway development programme including border and coastal roads",
    },
    {
      key: "UDAN scheme",
      value: "The regional connectivity scheme making short flights affordable",
    },
    {
      key: "Difference between broad and metre gauge",
      value:
        "Broad gauge is 1.676 metres and is now the standard for almost all Indian Railways routes",
    },
  ],
);

ind(
  "geo:ind:disaster",
  "Disaster Management in India",
  "In disaster management, what is %s?",
  "%k is %v.",
  [
    {
      key: "NDMA",
      value: "The National Disaster Management Authority, chaired by the Prime Minister",
    },
    { key: "NDRF", value: "The National Disaster Response Force, the specialised response force" },
    {
      key: "Disaster Management Act",
      value: "The law of 2005 that created the present institutional framework",
    },
    { key: "Most flood prone river system", value: "The Ganga and Brahmaputra basins" },
    {
      key: "Most cyclone prone coast",
      value: "The east coast, especially Odisha and Andhra Pradesh",
    },
    {
      key: "Seismic Zone V",
      value: "The highest risk zone, covering the north-east, Kutch and parts of the Himalaya",
    },
    {
      key: "Drought prone region",
      value: "The rain shadow areas of the Deccan and parts of Rajasthan and Gujarat",
    },
    { key: "Landslide prone regions", value: "The Himalaya, the north-east and the Western Ghats" },
    {
      key: "IMD",
      value: "The India Meteorological Department, the national agency for weather warnings",
    },
    { key: "Mitigation", value: "Measures taken in advance to reduce the impact of a disaster" },
  ],
  [
    {
      key: "Sendai Framework",
      value: "The 2015 to 2030 global framework for disaster risk reduction",
    },
    {
      key: "Four phases of disaster management",
      value: "Mitigation, preparedness, response and recovery",
    },
    {
      key: "Coastal Regulation Zone",
      value: "The rules restricting construction along the coast to reduce hazard exposure",
    },
    {
      key: "Early warning for cyclones",
      value: "Issued by the IMD through cyclone warning centres along both coasts",
    },
    {
      key: "Role of the State Disaster Response Fund",
      value: "It meets the immediate relief cost of a notified disaster in a state",
    },
  ],
);

ind(
  "geo:ind:parks",
  "National Parks and Biosphere Reserves",
  "Among India's protected areas, what is %s?",
  "%k is %v.",
  [
    { key: "Jim Corbett National Park", value: "India's oldest national park, in Uttarakhand" },
    {
      key: "Kaziranga National Park",
      value: "The Assam park famous for the one-horned rhinoceros",
    },
    { key: "Gir National Park", value: "The Gujarat park that shelters the Asiatic lion" },
    {
      key: "Sundarbans National Park",
      value: "The West Bengal mangrove park of the Royal Bengal Tiger",
    },
    { key: "Ranthambore National Park", value: "The tiger reserve in Rajasthan" },
    { key: "Periyar National Park", value: "The Kerala park known for elephants" },
    { key: "Keoladeo National Park", value: "The Bharatpur bird sanctuary in Rajasthan" },
    { key: "Kanha National Park", value: "The Madhya Pradesh park known for the barasingha" },
    {
      key: "Silent Valley National Park",
      value: "The evergreen forest park of Kerala saved from a dam project",
    },
    {
      key: "Nanda Devi Biosphere Reserve",
      value: "The Uttarakhand reserve around the Nanda Devi peak",
    },
  ],
  [
    {
      key: "Nilgiri Biosphere Reserve",
      value: "India's first biosphere reserve, notified in 1986",
    },
    {
      key: "Great Himalayan National Park",
      value: "The Himachal park inscribed as a World Heritage Site in 2014",
    },
    {
      key: "Manas National Park",
      value: "The Assam park that is a tiger reserve, elephant reserve and World Heritage Site",
    },
    { key: "Valley of Flowers", value: "The Uttarakhand park famous for its alpine meadows" },
    {
      key: "Difference between a national park and a sanctuary",
      value:
        "A national park allows no human rights or grazing, while limited rights may be permitted in a sanctuary",
    },
  ],
);

ind(
  "geo:ind:census",
  "Population and Census of India",
  "About India's population, what is %s?",
  "%k is %v.",
  [
    { key: "Year of the last completed census", value: "2011" },
    { key: "Most populous state", value: "Uttar Pradesh" },
    { key: "Least populous state", value: "Sikkim" },
    { key: "Most densely populated state", value: "Bihar" },
    { key: "State with the highest literacy", value: "Kerala" },
    { key: "State with the highest sex ratio", value: "Kerala" },
    { key: "Sex ratio of India in 2011", value: "943 females per thousand males" },
    { key: "Literacy rate of India in 2011", value: "About 74 per cent" },
    { key: "Density of population of India in 2011", value: "382 persons per square kilometre" },
    { key: "Urban share of India's population in 2011", value: "About 31 per cent" },
  ],
  [
    {
      key: "Demographic dividend",
      value: "The growth advantage from a rising share of people of working age",
    },
    {
      key: "Demographic transition",
      value: "The shift from high birth and death rates to low ones as development proceeds",
    },
    {
      key: "Census organisation",
      value: "The Office of the Registrar General and Census Commissioner, under the Home Ministry",
    },
    { key: "First complete census of India", value: "1881, under Lord Ripon" },
    {
      key: "Child sex ratio concern in 2011",
      value: "It fell to 919, the lowest since independence",
    },
  ],
);

/* ======================================================= World Geography */

wor(
  "geo:wor:physical",
  "World Physical Features and Water Bodies",
  "In world physical geography, what is %s?",
  "%k is %v.",
  [
    { key: "Longest mountain range on land", value: "The Andes, in South America" },
    { key: "Largest plateau in the world", value: "The Tibetan Plateau" },
    { key: "Largest lake in the world", value: "The Caspian Sea" },
    { key: "Largest freshwater lake by area", value: "Lake Superior" },
    {
      key: "Largest waterfall by volume",
      value: "The Boyoma Falls, while Angel Falls is the highest",
    },
    { key: "Largest bay in the world", value: "The Bay of Bengal" },
    { key: "Largest peninsula in the world", value: "The Arabian Peninsula" },
    { key: "Largest archipelago", value: "Indonesia" },
    { key: "Longest canal", value: "The Grand Canal of China" },
    { key: "Canal joining the Mediterranean and the Red Sea", value: "The Suez Canal" },
  ],
  [
    {
      key: "Panama Canal significance",
      value: "It links the Atlantic and the Pacific across the isthmus of Panama",
    },
    {
      key: "Strait of Hormuz",
      value: "The strait through which a large share of the world's oil is shipped",
    },
    {
      key: "Strait of Malacca",
      value: "The channel between Malaysia and Sumatra, a key trade route",
    },
    {
      key: "Great Rift Valley",
      value: "The long trough running from the Middle East through East Africa",
    },
    {
      key: "Mid Atlantic Ridge",
      value: "The submarine mountain chain formed at a divergent plate boundary",
    },
  ],
);

wor(
  "geo:wor:agriculture",
  "World Agriculture, Industry and Trade",
  "In world economic geography, what is %s?",
  "%k is %v.",
  [
    { key: "Largest producer of rice", value: "China, followed by India" },
    { key: "Largest producer of wheat", value: "China" },
    { key: "Largest producer of coffee", value: "Brazil" },
    { key: "Largest producer of natural rubber", value: "Thailand" },
    { key: "Largest producer of gold", value: "China" },
    { key: "Largest exporter of crude oil", value: "Saudi Arabia" },
    { key: "Ruhr region", value: "The old industrial heart of Germany" },
    { key: "Silicon Valley", value: "The technology region of California" },
    { key: "Detroit", value: "The historic automobile centre of the United States" },
    { key: "Largest producer of natural gas", value: "The United States" },
  ],
  [
    {
      key: "Shifting cultivation names",
      value: "Jhum in India, milpa in Mexico, ladang in Indonesia and chena in Sri Lanka",
    },
    {
      key: "Plantation agriculture",
      value: "Large scale single crop farming for export, such as tea, rubber and coffee",
    },
    {
      key: "Extensive commercial grain farming",
      value: "Large farms with low labour input, as in the Canadian and American prairies",
    },
    {
      key: "Market gardening",
      value: "Intensive cultivation of vegetables and fruit near urban markets",
    },
    {
      key: "OPEC",
      value: "The Organization of the Petroleum Exporting Countries, founded in 1960",
    },
  ],
);

phy(
  "geo:phy:vegetation",
  "Natural Vegetation and Soils of the World",
  "In biogeography, what is %s?",
  "%k is %v.",
  [
    {
      key: "Equatorial rainforest",
      value: "Dense evergreen forest of the hot wet equatorial belt",
    },
    {
      key: "Monsoon forest",
      value: "Tropical deciduous forest that sheds leaves in the dry season",
    },
    {
      key: "Mediterranean vegetation",
      value: "Drought resistant scrub and citrus of the warm temperate west coasts",
    },
    { key: "Coniferous forest", value: "Softwood evergreen forest of the cold northern latitudes" },
    { key: "Tundra vegetation", value: "Mosses, lichens and low shrubs of the polar margins" },
    { key: "Mangrove", value: "Salt tolerant tidal forest of sheltered tropical coasts" },
    { key: "Chernozem", value: "The fertile black soil of the temperate grasslands" },
    { key: "Podzol", value: "The acidic leached soil of the coniferous forest belt" },
    { key: "Laterite soil", value: "The leached red soil of hot wet tropical regions" },
    { key: "Humus", value: "The decomposed organic matter that makes soil fertile" },
  ],
  [
    {
      key: "Soil profile horizons",
      value: "The O, A, B, C and R layers from surface litter down to bedrock",
    },
    {
      key: "Leaching",
      value: "The washing down of soluble minerals from the upper soil by percolating water",
    },
    {
      key: "Soil erosion by sheet and gully action",
      value: "Loss of topsoil in thin layers or in deep channels on slopes",
    },
    {
      key: "Contour ploughing",
      value: "Ploughing along the contour to slow runoff and check erosion",
    },
    {
      key: "Desertification",
      value: "The degradation of dry land into desert through overuse and climate stress",
    },
  ],
);

/* ================================================= Environment top-up == */

env(
  "env:biodiversity",
  "Biodiversity and Wildlife",
  "In biodiversity studies, what is %s?",
  "%k is %v.",
  [
    {
      key: "Biodiversity",
      value: "The variety of life at the level of genes, species and ecosystems",
    },
    { key: "Endemic species", value: "A species found naturally in one region and nowhere else" },
    { key: "Endangered species", value: "A species at very high risk of extinction in the wild" },
    { key: "IUCN Red List", value: "The global inventory of the conservation status of species" },
    {
      key: "In situ conservation",
      value: "Protecting species in their natural habitat, as in national parks",
    },
    {
      key: "Ex situ conservation",
      value: "Protecting species outside their habitat, as in zoos and seed banks",
    },
    {
      key: "Biosphere reserve",
      value: "A protected area with a core, a buffer and a transition zone",
    },
    {
      key: "Invasive alien species",
      value: "A non-native species that spreads and harms local ecosystems",
    },
    {
      key: "Convention on Biological Diversity",
      value: "The 1992 Rio treaty on conservation and equitable sharing of benefits",
    },
    {
      key: "National Biodiversity Authority",
      value: "The body at Chennai set up under the Biological Diversity Act of 2002",
    },
  ],
  [
    {
      key: "Nagoya Protocol",
      value: "The 2010 protocol on access to genetic resources and benefit sharing",
    },
    {
      key: "Cartagena Protocol",
      value: "The protocol on the safe transfer and use of living modified organisms",
    },
    {
      key: "Hotspot criteria",
      value: "At least 1,500 endemic vascular plants and a loss of 70 per cent of original habitat",
    },
    {
      key: "Keystone species",
      value: "A species whose removal changes the whole ecosystem out of proportion to its numbers",
    },
    {
      key: "People's Biodiversity Register",
      value: "The village level record of local biological resources and associated knowledge",
    },
  ],
);

env(
  "env:sustainable",
  "Sustainable Development and Renewable Energy",
  "In sustainable development, what is %s?",
  "%k is %v.",
  [
    {
      key: "Sustainable development",
      value: "Development that meets present needs without compromising future generations",
    },
    {
      key: "Brundtland Report",
      value: "The 1987 report Our Common Future that defined sustainable development",
    },
    {
      key: "Sustainable Development Goals",
      value: "The seventeen global goals adopted by the United Nations for 2030",
    },
    {
      key: "Solar energy",
      value: "Energy from sunlight, captured by photovoltaic cells or thermal collectors",
    },
    { key: "Wind energy", value: "Energy from moving air, captured by turbines" },
    {
      key: "Biogas",
      value: "Methane rich gas produced by the anaerobic decomposition of organic waste",
    },
    { key: "Geothermal energy", value: "Heat energy drawn from within the earth" },
    { key: "Tidal energy", value: "Energy generated from the rise and fall of the tides" },
    {
      key: "International Solar Alliance",
      value: "The alliance launched by India and France, headquartered at Gurugram",
    },
    { key: "Three Rs of waste", value: "Reduce, reuse and recycle" },
  ],
  [
    {
      key: "Carbon footprint",
      value: "The total greenhouse gas emissions caused directly or indirectly by an activity",
    },
    {
      key: "Circular economy",
      value: "An economy designed to keep materials in use and eliminate waste",
    },
    {
      key: "Net zero",
      value: "A state in which emissions released are balanced by an equal amount removed",
    },
    {
      key: "Extended producer responsibility",
      value: "The duty of a producer to manage its product at the end of its life",
    },
    {
      key: "Green hydrogen mission",
      value: "India's mission to produce hydrogen through renewable powered electrolysis",
    },
  ],
);

/* ================================================ General Science top-up */

sci(
  "gs:everyday",
  "Everyday Science",
  "In everyday science, why or what is %s?",
  "%k is explained thus: %v.",
  [
    {
      key: "Why food cooks faster in a pressure cooker",
      value: "higher pressure raises the boiling point of water",
    },
    {
      key: "Why we see lightning before hearing thunder",
      value: "light travels far faster than sound",
    },
    {
      key: "Why a mirage appears on a hot road",
      value: "light bends as it passes through layers of air of different density",
    },
    {
      key: "Why ice floats on water",
      value: "ice is less dense than liquid water because of its open structure",
    },
    {
      key: "Why a swimmer's body appears bent in water",
      value: "light refracts as it leaves water and enters air",
    },
    {
      key: "Why iron rusts",
      value: "iron reacts with oxygen and moisture to form hydrated iron oxide",
    },
    { key: "Why milk turns sour", value: "bacteria convert lactose into lactic acid" },
    {
      key: "Why we feel cool after sweating",
      value: "evaporation of sweat draws latent heat from the skin",
    },
    {
      key: "Why a pressure bandage stops bleeding",
      value: "pressure helps the blood clot by slowing the flow",
    },
    {
      key: "Why the stars twinkle",
      value: "atmospheric refraction keeps changing the path of their light",
    },
  ],
  [
    {
      key: "Why the sky appears red at sunrise and sunset",
      value: "sunlight travels a longer path and the shorter wavelengths are scattered away",
    },
    {
      key: "Why a nail sinks but a ship floats",
      value: "the ship displaces water weighing more than itself while the nail does not",
    },
    {
      key: "Why aluminium does not corrode easily",
      value: "a thin adherent oxide layer protects the metal underneath",
    },
    {
      key: "Why a person feels weightless in a freely falling lift",
      value: "both the person and the lift accelerate downward at the same rate",
    },
    {
      key: "Why pure water is a poor conductor of electricity",
      value: "it has very few free ions to carry charge",
    },
  ],
);

sci(
  "gs:human-body",
  "Human Body, Nutrition and Health",
  "About the human body and health, what is %s?",
  "%k is %v.",
  [
    { key: "Normal human body temperature", value: "About 37 degrees Celsius" },
    { key: "Normal pulse rate of an adult at rest", value: "About 72 beats a minute" },
    { key: "Number of chromosomes in a human cell", value: "Forty six, in twenty three pairs" },
    { key: "Largest bone in the human body", value: "The femur" },
    { key: "Smallest bone in the human body", value: "The stapes, in the ear" },
    { key: "Master gland of the body", value: "The pituitary gland" },
    { key: "Vitamin deficiency causing night blindness", value: "Vitamin A" },
    { key: "Vitamin deficiency causing beriberi", value: "Vitamin B1, thiamine" },
    { key: "Mineral needed for haemoglobin", value: "Iron" },
    {
      key: "Balanced diet",
      value:
        "A diet supplying carbohydrates, proteins, fats, vitamins, minerals, fibre and water in right measure",
    },
  ],
  [
    {
      key: "Role of the liver",
      value: "It stores glycogen, detoxifies the blood and produces bile",
    },
    {
      key: "Function of the pancreas",
      value: "It secretes digestive enzymes and the hormones insulin and glucagon",
    },
    { key: "Vector of dengue", value: "The Aedes aegypti mosquito, which bites during the day" },
    {
      key: "Difference between a vaccine and an antibiotic",
      value:
        "A vaccine trains immunity in advance; an antibiotic kills or stops bacteria after infection",
    },
    {
      key: "BMI",
      value:
        "Body mass index, the weight in kilograms divided by the square of the height in metres",
    },
  ],
);

tech(
  "st:health-nuclear",
  "Nuclear, Energy and Health Technology",
  "In science and technology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Nuclear fission",
      value: "The splitting of a heavy nucleus, the process used in reactors",
    },
    {
      key: "Nuclear fusion",
      value: "The joining of light nuclei, the process that powers the Sun",
    },
    {
      key: "Heavy water",
      value: "Deuterium oxide, used as a moderator in Indian pressurised reactors",
    },
    {
      key: "Atomic Energy Commission of India",
      value: "The apex body for India's nuclear programme, created in 1948",
    },
    { key: "BARC", value: "The Bhabha Atomic Research Centre at Trombay" },
    {
      key: "India's three stage nuclear programme",
      value: "Pressurised heavy water reactors, fast breeder reactors and thorium based reactors",
    },
    { key: "Largest nuclear power station in India", value: "Kudankulam in Tamil Nadu" },
    { key: "Radioisotope used in cancer therapy", value: "Cobalt 60" },
    { key: "Radioisotope used to detect thyroid disorders", value: "Iodine 131" },
    {
      key: "Carbon dating",
      value: "The use of carbon 14 decay to estimate the age of organic remains",
    },
  ],
  [
    {
      key: "Why thorium matters to India",
      value: "India has one of the largest thorium reserves and little uranium",
    },
    {
      key: "Fast breeder reactor",
      value: "A reactor that produces more fissile material than it consumes",
    },
    {
      key: "PSLV versus GSLV payload",
      value:
        "PSLV suits polar and sun synchronous orbits while GSLV lifts heavier geostationary payloads",
    },
    {
      key: "Telemedicine",
      value:
        "Delivery of medical consultation and monitoring at a distance using communication technology",
    },
    {
      key: "Nanotechnology",
      value: "Engineering matter at the scale of billionths of a metre, where properties change",
    },
  ],
);

export const GS_EXTRA_TEMPLATES = templates;
