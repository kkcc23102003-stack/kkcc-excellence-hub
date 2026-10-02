/**
 * Punjab state exam fact tables — PPSC, Punjab Police, Patwari, Clerk,
 * ETT / Master Cadre and PSTET.
 *
 * Punjab GK is the highest-scoring section of every Punjab state paper and the
 * same static areas repeat year after year: districts, rivers and canals, the
 * Sikh Gurus, Maharaja Ranjit Singh, the Anglo-Sikh wars, the Ghadar movement,
 * reorganisation, folk culture and the Green Revolution. Written in-house from
 * standard public syllabus material.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

const PB = [
  "PPSC Punjab",
  "Punjab PCS",
  "PSSSB",
  "Punjab Police",
  "Punjab Patwari",
  "Punjab Clerk",
  "Punjab ETT Cadre",
  "Punjab Master Cadre",
  "Punjab Lecturer Cadre",
  "PSTET/CTET",
  "State Teacher/TET",
  "State PSC",
  "State Clerk",
  "UPSC CSE",
];

const templates: Template[] = [];

function add(
  id: string,
  subject: string,
  topic: string,
  difficulty: "Easy" | "Moderate" | "Difficult",
  rows: FactRow[],
  forward: string,
  reverse: string | undefined,
  explain: string,
  matchLabel?: string,
) {
  templates.push(
    ...factTemplate({ id, subject, topic, difficulty, exams: PB, rows, forward, reverse, explain }),
    matchTemplate({ id, subject, topic, difficulty, exams: PB, rows, label: matchLabel }),
    statementTemplate({ id, subject, topic, difficulty, exams: PB, rows, label: matchLabel }),
    statementCountTemplate({ id, subject, topic, difficulty, exams: PB, rows, label: matchLabel }),
  );
}

/* --------------------------------------------------------------- Sikh Gurus */

add(
  "pb:guru",
  "Punjab History",
  "Sikh Gurus",
  "Moderate",
  [
    { key: "Guru Nanak Dev Ji", value: "Founder of Sikhism, born in 1469 at Talwandi" },
    { key: "Guru Angad Dev Ji", value: "Popularised the Gurmukhi script" },
    { key: "Guru Amar Das Ji", value: "Established the Manji system and strengthened langar" },
    { key: "Guru Ram Das Ji", value: "Founded the city of Amritsar" },
    { key: "Guru Arjan Dev Ji", value: "Compiled the Adi Granth and was the first Sikh martyr" },
    {
      key: "Guru Hargobind Ji",
      value: "Introduced the concept of Miri and Piri and built the Akal Takht",
    },
    { key: "Guru Har Rai Ji", value: "Seventh Guru, known for compassion and herbal healing" },
    { key: "Guru Har Krishan Ji", value: "Youngest of the Sikh Gurus" },
    {
      key: "Guru Tegh Bahadur Ji",
      value: "Martyred at Delhi in 1675 defending freedom of religion",
    },
    { key: "Guru Gobind Singh Ji", value: "Founded the Khalsa in 1699 at Anandpur Sahib" },
  ],
  "Which achievement is associated with %s?",
  "Which Sikh Guru is described as '%s'?",
  "%k: %v.",
  "Sikh Guru and his contribution",
);

add(
  "pb:guru-order",
  "Punjab History",
  "Sikh Gurus",
  "Easy",
  [
    { key: "First Sikh Guru", value: "Guru Nanak Dev Ji" },
    { key: "Second Sikh Guru", value: "Guru Angad Dev Ji" },
    { key: "Third Sikh Guru", value: "Guru Amar Das Ji" },
    { key: "Fourth Sikh Guru", value: "Guru Ram Das Ji" },
    { key: "Fifth Sikh Guru", value: "Guru Arjan Dev Ji" },
    { key: "Sixth Sikh Guru", value: "Guru Hargobind Ji" },
    { key: "Seventh Sikh Guru", value: "Guru Har Rai Ji" },
    { key: "Eighth Sikh Guru", value: "Guru Har Krishan Ji" },
    { key: "Ninth Sikh Guru", value: "Guru Tegh Bahadur Ji" },
    { key: "Tenth Sikh Guru", value: "Guru Gobind Singh Ji" },
  ],
  "Who was the %s?",
  "What is the position of %s in the line of Sikh Gurus?",
  "The %k was %v.",
  "order and the Sikh Guru",
);

/* ------------------------------------------------------ Maharaja Ranjit Singh */

add(
  "pb:ranjit",
  "Punjab History",
  "Maharaja Ranjit Singh",
  "Moderate",
  [
    { key: "Birth year of Maharaja Ranjit Singh", value: "1780 at Gujranwala" },
    { key: "Misl to which Ranjit Singh belonged", value: "Sukerchakia Misl" },
    { key: "Year Ranjit Singh captured Lahore", value: "1799" },
    { key: "Year of his formal coronation as Maharaja", value: "1801" },
    { key: "Treaty signed with the British in 1809", value: "Treaty of Amritsar" },
    { key: "River fixed as the boundary by the Treaty of Amritsar", value: "River Sutlej" },
    {
      key: "Famous diamond obtained by Ranjit Singh",
      value: "Koh-i-Noor, obtained from Shah Shuja",
    },
    { key: "Capital of the Sikh Empire under Ranjit Singh", value: "Lahore" },
    { key: "Year of the death of Maharaja Ranjit Singh", value: "1839" },
    { key: "Popular title of Maharaja Ranjit Singh", value: "Sher-e-Punjab, the Lion of Punjab" },
    { key: "European generals employed in his army", value: "Ventura and Allard" },
  ],
  "Regarding Maharaja Ranjit Singh, what is the %s?",
  "Which fact about Maharaja Ranjit Singh matches '%s'?",
  "%k is %v.",
  "fact and its value",
);

add(
  "pb:anglosikh",
  "Punjab History",
  "Anglo-Sikh Wars",
  "Difficult",
  [
    { key: "First Anglo-Sikh War", value: "Fought during 1845 to 1846" },
    { key: "Treaty that ended the First Anglo-Sikh War", value: "Treaty of Lahore, 1846" },
    { key: "Battle of Mudki", value: "First major battle of the First Anglo-Sikh War, 1845" },
    { key: "Battle of Sobraon", value: "Decisive battle of the First Anglo-Sikh War, 1846" },
    { key: "Second Anglo-Sikh War", value: "Fought during 1848 to 1849" },
    {
      key: "Battle of Chillianwala",
      value: "Heavily contested battle of the Second Anglo-Sikh War, 1849",
    },
    { key: "Battle of Gujrat", value: "Final battle that ended the Second Anglo-Sikh War" },
    { key: "Year of the annexation of Punjab", value: "1849" },
    { key: "Governor-General who annexed Punjab", value: "Lord Dalhousie" },
    { key: "Last ruler of the Sikh Empire", value: "Maharaja Duleep Singh" },
  ],
  "Regarding the Anglo-Sikh Wars, what is the %s?",
  "Which event of the Anglo-Sikh Wars is described by '%s'?",
  "%k: %v.",
  "event and its description",
);

add(
  "pb:ghadar",
  "Punjab History",
  "Ghadar Movement",
  "Moderate",
  [
    { key: "Year the Ghadar Party was founded", value: "1913" },
    { key: "City where the Ghadar Party was founded", value: "San Francisco in the United States" },
    { key: "First president of the Ghadar Party", value: "Sohan Singh Bhakna" },
    { key: "Leading ideologue of the Ghadar Party", value: "Lala Har Dayal" },
    { key: "Newspaper published by the Ghadar Party", value: "Ghadar" },
    { key: "Ship associated with the Ghadar episode of 1914", value: "Komagata Maru" },
    { key: "Port where the Komagata Maru was turned away", value: "Vancouver in Canada" },
    { key: "Trial of Ghadar revolutionaries in India", value: "Lahore Conspiracy Case" },
    { key: "Kartar Singh Sarabha", value: "Young Ghadar revolutionary executed in 1915" },
  ],
  "Regarding the Ghadar Movement, what is the %s?",
  "Which fact of the Ghadar Movement matches '%s'?",
  "%k is %v.",
  "fact and its value",
);

add(
  "pb:freedom-pb",
  "Punjab History",
  "Freedom Movement in Punjab",
  "Moderate",
  [
    { key: "Jallianwala Bagh massacre", value: "Took place at Amritsar on 13 April 1919" },
    { key: "Officer responsible for the Jallianwala Bagh firing", value: "General Reginald Dyer" },
    { key: "Leader who renounced knighthood after Jallianwala Bagh", value: "Rabindranath Tagore" },
    {
      key: "Commission that enquired into the Jallianwala Bagh massacre",
      value: "Hunter Commission",
    },
    { key: "Akali movement of the 1920s", value: "Struggle for the reform of Sikh shrines" },
    {
      key: "Body formed in 1920 to manage Sikh shrines",
      value: "Shiromani Gurdwara Parbandhak Committee",
    },
    { key: "Bhagat Singh, Rajguru and Sukhdev", value: "Executed at Lahore on 23 March 1931" },
    {
      key: "Organisation of Bhagat Singh and his comrades",
      value: "Hindustan Socialist Republican Association",
    },
    { key: "Udham Singh", value: "Avenged Jallianwala Bagh by shooting Michael O'Dwyer in 1940" },
    {
      key: "Lala Lajpat Rai",
      value: "Died after a lathi charge during the Simon Commission protest",
    },
  ],
  "Which statement correctly describes '%s'?",
  "Which event or person of the Punjab freedom struggle is described by '%s'?",
  "%k: %v.",
  "event and its description",
);

add(
  "pb:reorg",
  "Punjab History",
  "Punjab Reorganisation",
  "Moderate",
  [
    { key: "Act under which Punjab was reorganised", value: "Punjab Reorganisation Act, 1966" },
    { key: "Date of the reorganisation of Punjab", value: "1 November 1966" },
    { key: "New state carved out of Punjab in 1966", value: "Haryana" },
    { key: "Hill areas of Punjab transferred in 1966", value: "Merged into Himachal Pradesh" },
    { key: "Status given to Chandigarh in 1966", value: "Union Territory and joint capital" },
    { key: "Present capital of Punjab", value: "Chandigarh" },
    {
      key: "High Court having jurisdiction over Punjab",
      value: "Punjab and Haryana High Court at Chandigarh",
    },
    { key: "Official language of Punjab", value: "Punjabi written in Gurmukhi" },
    { key: "Number of districts in Punjab at present", value: "Twenty-three" },
    { key: "Number of Lok Sabha seats from Punjab", value: "Thirteen" },
    { key: "Number of Rajya Sabha seats from Punjab", value: "Seven" },
    { key: "Strength of the Punjab Legislative Assembly", value: "One hundred and seventeen" },
  ],
  "Regarding the reorganisation and set-up of Punjab, what is the %s?",
  "Which fact about Punjab matches '%s'?",
  "%k is %v.",
  "fact and its value",
);

/* ---------------------------------------------------------------- Punjab GK */

add(
  "pb:district",
  "Punjab GK",
  "Districts and Headquarters",
  "Moderate",
  [
    { key: "Sahibzada Ajit Singh Nagar district", value: "Mohali" },
    { key: "Shahid Bhagat Singh Nagar district", value: "Nawanshahr" },
    { key: "Sri Muktsar Sahib district", value: "Muktsar" },
    { key: "Rupnagar district", value: "Rupnagar (Ropar)" },
    { key: "Fatehgarh Sahib district", value: "Fatehgarh Sahib" },
    { key: "Tarn Taran district", value: "Tarn Taran" },
    { key: "Gurdaspur district", value: "Gurdaspur" },
    { key: "Kapurthala district", value: "Kapurthala" },
    { key: "Hoshiarpur district", value: "Hoshiarpur" },
    { key: "Firozpur district", value: "Firozpur" },
    { key: "Malerkotla district", value: "Malerkotla" },
    { key: "Pathankot district", value: "Pathankot" },
  ],
  "What is the headquarters of %s in Punjab?",
  "Which district of Punjab has its headquarters at %s?",
  "The headquarters of %k is %v.",
  "district and its headquarters",
);

add(
  "pb:dance",
  "Punjab GK",
  "Folk Dances and Fairs",
  "Easy",
  [
    { key: "Bhangra", value: "Energetic harvest dance performed by men" },
    { key: "Giddha", value: "Folk dance performed by women with bolis" },
    { key: "Jhumar", value: "Slow, graceful dance of the Sandalbar region" },
    { key: "Luddi", value: "Victory dance with a swaying head movement" },
    { key: "Sammi", value: "Dance of the women of the Sandalbar tribes" },
    { key: "Kikli", value: "Dance in which two girls whirl holding hands" },
    { key: "Malwai Giddha", value: "Giddha performed by men of the Malwa region" },
    { key: "Gatka", value: "Traditional Sikh martial art performed with sticks and swords" },
    { key: "Dhamal", value: "Vigorous dance performed in a circle around the drum" },
    { key: "Julli", value: "Dance performed by holy men in a sitting posture" },
  ],
  "Which description matches the Punjabi folk form '%s'?",
  "Which Punjabi folk form is described as '%s'?",
  "%k is %v.",
  "folk form and its description",
);

add(
  "pb:fair",
  "Punjab GK",
  "Folk Dances and Fairs",
  "Moderate",
  [
    { key: "Hola Mohalla", value: "Anandpur Sahib" },
    { key: "Maghi Mela", value: "Sri Muktsar Sahib" },
    { key: "Shaheedi Jor Mela", value: "Fatehgarh Sahib" },
    { key: "Rural Olympics", value: "Kila Raipur in Ludhiana district" },
    { key: "Chhapar Mela", value: "Chhapar in Ludhiana district" },
    { key: "Jarg Mela", value: "Jarg in Ludhiana district" },
    { key: "Baba Sheikh Farid Aagman Purb", value: "Faridkot" },
    { key: "Harballabh Sangeet Sammelan", value: "Jalandhar" },
    { key: "Roshni Mela", value: "Jagraon" },
  ],
  "At which place in Punjab is the %s held?",
  "Which Punjab fair or festival is held at %s?",
  "The %k is held at %v.",
  "fair and its place",
);

add(
  "pb:place",
  "Punjab GK",
  "Important Places",
  "Moderate",
  [
    { key: "Harmandir Sahib (Golden Temple)", value: "Amritsar" },
    { key: "Jallianwala Bagh", value: "Amritsar" },
    { key: "Wagah Border", value: "Near Amritsar" },
    { key: "Virasat-e-Khalsa museum", value: "Anandpur Sahib" },
    { key: "Punjab Agricultural University", value: "Ludhiana" },
    { key: "Guru Nanak Dev University", value: "Amritsar" },
    { key: "Punjabi University", value: "Patiala" },
    { key: "Qila Mubarak", value: "Bathinda" },
    { key: "Sheesh Mahal", value: "Patiala" },
    { key: "Hari Ke Wetland", value: "Confluence of the Beas and Sutlej" },
    { key: "Rock Garden", value: "Chandigarh" },
    { key: "Bhakra Nangal Dam", value: "On the Sutlej near Nangal" },
  ],
  "Where in Punjab is %s located?",
  "Which important landmark of Punjab is located at %s?",
  "%k is located at %v.",
  "landmark and its location",
);

add(
  "pb:symbol",
  "Punjab GK",
  "Current Static GK",
  "Easy",
  [
    { key: "State animal of Punjab", value: "Blackbuck" },
    { key: "State bird of Punjab", value: "Northern Goshawk (Baaz)" },
    { key: "State tree of Punjab", value: "Shisham" },
    { key: "State flower of Punjab", value: "Gladiolus" },
    { key: "State sport of Punjab", value: "Kabaddi" },
    { key: "Largest district of Punjab by area", value: "Ludhiana" },
    { key: "Most populous district of Punjab", value: "Ludhiana" },
    { key: "Industrial hub of Punjab known for hosiery", value: "Ludhiana" },
    { key: "City of Punjab known as the sports goods centre", value: "Jalandhar" },
    { key: "City of Punjab known as the City of Gurus", value: "Amritsar" },
  ],
  "What is the %s?",
  "Which Punjab fact matches '%s'?",
  "%k is %v.",
  "Punjab symbol and its value",
);

/* --------------------------------------------------------- Punjab geography */

add(
  "pb:region",
  "Punjab Geography",
  "Malwa Majha Doaba Regions",
  "Moderate",
  [
    { key: "Majha region", value: "Area between the rivers Ravi and Beas" },
    { key: "Doaba region", value: "Area between the rivers Beas and Sutlej" },
    { key: "Malwa region", value: "Area south of the river Sutlej" },
    { key: "Amritsar", value: "Belongs to the Majha region" },
    { key: "Gurdaspur", value: "Belongs to the Majha region" },
    { key: "Jalandhar", value: "Belongs to the Doaba region" },
    { key: "Hoshiarpur", value: "Belongs to the Doaba region" },
    { key: "Kapurthala", value: "Belongs to the Doaba region" },
    { key: "Ludhiana", value: "Belongs to the Malwa region" },
    { key: "Patiala", value: "Belongs to the Malwa region" },
    { key: "Bathinda", value: "Belongs to the Malwa region" },
  ],
  "Which statement is correct about %s?",
  "Which region or district of Punjab is described as '%s'?",
  "%k: %v.",
  "region or district and its description",
);

add(
  "pb:river",
  "Punjab Geography",
  "Rivers of Punjab",
  "Moderate",
  [
    { key: "Sutlej", value: "Longest river of Punjab, rising near Mansarovar in Tibet" },
    { key: "Beas", value: "Rises at Beas Kund near the Rohtang Pass" },
    { key: "Ravi", value: "Rises at Bara Bhangal in Himachal Pradesh" },
    { key: "Chenab", value: "Formed by the union of the Chandra and Bhaga streams" },
    { key: "Jhelum", value: "Rises at Verinag in Jammu and Kashmir" },
    { key: "Ghaggar", value: "Seasonal river of the Malwa region" },
    { key: "Hari Ke Pattan", value: "Confluence of the Sutlej and the Beas" },
    { key: "Meaning of the name Punjab", value: "The land of five rivers" },
    { key: "Rivers flowing through present-day Punjab", value: "Sutlej, Beas and Ravi" },
  ],
  "Which statement is correct about %s?",
  "Which river or fact of Punjab is described as '%s'?",
  "%k: %v.",
  "river and its description",
);

add(
  "pb:canal",
  "Punjab Geography",
  "Canal Irrigation",
  "Difficult",
  [
    { key: "Bhakra Nangal Dam", value: "Built on the river Sutlej" },
    { key: "Pong Dam", value: "Built on the river Beas" },
    { key: "Ranjit Sagar Dam (Thein Dam)", value: "Built on the river Ravi" },
    { key: "Upper Bari Doab Canal", value: "Takes off from the Ravi at Madhopur" },
    { key: "Sirhind Canal", value: "Takes off from the Sutlej at Ropar" },
    { key: "Bist Doab Canal", value: "Irrigates the Doaba region from the Sutlej" },
    { key: "Indira Gandhi Canal", value: "Takes off from the Harike barrage for Rajasthan" },
    { key: "Treaty governing the sharing of these rivers", value: "Indus Waters Treaty of 1960" },
    { key: "Main source of irrigation in Punjab today", value: "Tube wells" },
  ],
  "Which statement is correct about the %s?",
  "Which irrigation work of Punjab is described as '%s'?",
  "%k: %v.",
  "irrigation work and its description",
);

add(
  "pb:border",
  "Punjab Geography",
  "Borders and Neighbouring States",
  "Easy",
  [
    { key: "State to the north of Punjab", value: "Jammu and Kashmir" },
    { key: "State to the north-east of Punjab", value: "Himachal Pradesh" },
    { key: "State to the south and south-east of Punjab", value: "Haryana" },
    { key: "State to the south-west of Punjab", value: "Rajasthan" },
    { key: "Country to the west of Punjab", value: "Pakistan" },
    { key: "Union Territory on the eastern border of Punjab", value: "Chandigarh" },
    { key: "Line separating Punjab from Pakistan", value: "Radcliffe Line" },
    { key: "Main land crossing between Punjab and Pakistan", value: "Attari-Wagah border" },
  ],
  "Which is the %s?",
  "Which boundary fact of Punjab matches '%s'?",
  "%k is %v.",
  "boundary and its answer",
);

add(
  "pb:soil",
  "Punjab Geography",
  "Soils and Crops",
  "Moderate",
  [
    { key: "Main soil type of Punjab", value: "Alluvial soil" },
    { key: "Main crop of the rabi season in Punjab", value: "Wheat" },
    { key: "Main crop of the kharif season in Punjab", value: "Paddy" },
    { key: "Crop once called the white gold of Punjab", value: "Cotton" },
    { key: "Cotton belt of Punjab", value: "The southern Malwa districts" },
    { key: "Crop grown mainly for cattle fodder", value: "Berseem" },
    { key: "Season in which maize is sown in Punjab", value: "Kharif season" },
    { key: "Chief oilseed crop of Punjab", value: "Mustard" },
  ],
  "Regarding the agriculture of Punjab, what is the %s?",
  "Which agricultural fact of Punjab matches '%s'?",
  "%k is %v.",
  "agricultural fact and its value",
);

/* -------------------------------------------------------- Punjab economics */

add(
  "pb:green",
  "Punjab Economics",
  "Green Revolution",
  "Moderate",
  [
    { key: "Decade in which the Green Revolution began in Punjab", value: "The late 1960s" },
    { key: "Crop that gained most from the Green Revolution", value: "Wheat" },
    {
      key: "Scientist called the father of the Indian Green Revolution",
      value: "M. S. Swaminathan",
    },
    { key: "Scientist called the father of the world Green Revolution", value: "Norman Borlaug" },
    { key: "Type of seeds used in the Green Revolution", value: "High-yielding variety seeds" },
    {
      key: "University that led the Green Revolution in Punjab",
      value: "Punjab Agricultural University, Ludhiana",
    },
    { key: "Price support announced for farmers before sowing", value: "Minimum Support Price" },
    {
      key: "Body that recommends the Minimum Support Price",
      value: "Commission for Agricultural Costs and Prices",
    },
    {
      key: "Chief ecological cost of the Green Revolution in Punjab",
      value: "Falling groundwater levels",
    },
    {
      key: "Popular name of Punjab for its food grain contribution",
      value: "The granary of India",
    },
  ],
  "Regarding the Green Revolution, what is the %s?",
  "Which fact of the Green Revolution matches '%s'?",
  "%k is %v.",
  "fact and its value",
);

add(
  "pb:industry",
  "Punjab Economics",
  "Industry and MSME",
  "Moderate",
  [
    { key: "Ludhiana", value: "Hosiery, woollens and bicycle parts" },
    { key: "Jalandhar", value: "Sports goods and hand tools" },
    { key: "Batala", value: "Foundry and machine tools" },
    { key: "Phagwara", value: "Sugar mills" },
    { key: "Amritsar", value: "Textiles and handloom shawls" },
    { key: "Mandi Gobindgarh", value: "Steel rolling mills" },
    { key: "Kapurthala", value: "Rail Coach Factory" },
    { key: "Mohali", value: "Information technology and electronics" },
    { key: "Hoshiarpur", value: "Wood inlay work and light engineering" },
  ],
  "Which industry is %s in Punjab best known for?",
  "Which town of Punjab is best known for '%s'?",
  "%k is known for %v.",
  "industrial town and its product",
);

add(
  "pb:rivers-canals",
  "Punjab GK",
  "Rivers and Canals",
  "Moderate",
  [
    { key: "Longest river of Punjab", value: "Sutlej" },
    { key: "River on which the Bhakra dam is built", value: "Sutlej" },
    { key: "River on which the Pong dam is built", value: "Beas" },
    { key: "River on which the Ranjit Sagar dam is built", value: "Ravi" },
    { key: "Place where the Sutlej and Beas meet", value: "Harike Pattan" },
    { key: "Canal taking off from the Sutlej at Ropar", value: "Sirhind Canal" },
    { key: "Canal taking off from the Ravi at Madhopur", value: "Upper Bari Doab Canal" },
    { key: "Canal carrying Punjab waters into Rajasthan", value: "Indira Gandhi Canal" },
    { key: "Treaty that divided the Indus system waters", value: "Indus Waters Treaty, 1960" },
    { key: "Rivers allotted to India by the Indus Waters Treaty", value: "Ravi, Beas and Sutlej" },
  ],
  "Regarding the rivers and canals of Punjab, what is the %s?",
  "Which fact about Punjab rivers matches '%s'?",
  "%k is %v.",
  "river fact and its answer",
);

add(
  "pb:sports",
  "Punjab GK",
  "Sports and Awards",
  "Moderate",
  [
    { key: "Milkha Singh", value: "Athletics, known as the Flying Sikh" },
    { key: "Balbir Singh Senior", value: "Hockey, triple Olympic gold medallist" },
    { key: "Kapil Dev", value: "Cricket, captain of the 1983 World Cup winning team" },
    { key: "Harbhajan Singh", value: "Cricket, off-spin bowling" },
    { key: "Abhinav Bindra", value: "Shooting, Olympic gold medallist" },
    { key: "Pargat Singh", value: "Hockey, former Indian captain" },
    { key: "Sandeep Singh", value: "Hockey, drag-flick specialist" },
    { key: "Kila Raipur", value: "Village famous for the Rural Olympics" },
    { key: "State sport of Punjab", value: "Kabaddi" },
    { key: "Maharaja Ranjit Singh Award", value: "Punjab's highest state sports honour" },
  ],
  "With which sport or distinction is %s associated?",
  "Which Punjab sports personality or item is described as '%s'?",
  "%k is associated with %v.",
  "sports personality and the sport",
);

add(
  "pb:climate",
  "Punjab Geography",
  "Climate",
  "Moderate",
  [
    { key: "Type of climate in Punjab", value: "Semi-arid to sub-humid continental climate" },
    { key: "Hottest months in Punjab", value: "May and June" },
    { key: "Coldest month in Punjab", value: "January" },
    { key: "Main source of rainfall in Punjab", value: "South-west monsoon" },
    { key: "Winter rain in Punjab is caused by", value: "Western disturbances" },
    { key: "Average annual rainfall of Punjab", value: "About 500 to 700 millimetres" },
    {
      key: "Region of Punjab receiving the highest rainfall",
      value: "The sub-mountainous north-east",
    },
    { key: "Region of Punjab receiving the lowest rainfall", value: "The south-western districts" },
    { key: "Local dust-laden summer wind of Punjab", value: "Loo" },
  ],
  "Regarding the climate of Punjab, what is the %s?",
  "Which climatic fact of Punjab matches '%s'?",
  "%k is %v.",
  "climatic fact and its answer",
);

add(
  "pb:agri",
  "Punjab Economics",
  "Agriculture",
  "Moderate",
  [
    {
      key: "Share of Punjab in the central pool of wheat",
      value: "Among the highest of all states",
    },
    { key: "Main rabi crop of Punjab", value: "Wheat" },
    { key: "Main kharif crop of Punjab", value: "Paddy" },
    {
      key: "Agency that procures grain in Punjab",
      value: "Food Corporation of India with state agencies",
    },
    {
      key: "Body that recommends the Minimum Support Price",
      value: "Commission for Agricultural Costs and Prices",
    },
    {
      key: "Leading agricultural university of Punjab",
      value: "Punjab Agricultural University, Ludhiana",
    },
    {
      key: "Chief cause of falling water table in Punjab",
      value: "Intensive paddy cultivation with tube wells",
    },
    { key: "Practice discouraged to control winter smog", value: "Burning of paddy stubble" },
    {
      key: "Crop diversification in Punjab aims to shift from",
      value: "The wheat-paddy cycle to other crops",
    },
  ],
  "Regarding agriculture in Punjab, what is the %s?",
  "Which agricultural fact of Punjab matches '%s'?",
  "%k is %v.",
  "agricultural fact and its answer",
);

add(
  "pb:budget",
  "Punjab Economics",
  "Budget Basics",
  "Moderate",
  [
    { key: "Article requiring an annual financial statement for a state", value: "Article 202" },
    { key: "House in which a state Money Bill is introduced", value: "The Legislative Assembly" },
    { key: "Fund into which all state revenues flow", value: "Consolidated Fund of the State" },
    { key: "Fund used for urgent unforeseen expenditure", value: "Contingency Fund of the State" },
    { key: "Officer who audits state accounts", value: "Comptroller and Auditor General of India" },
    { key: "Body that recommends devolution to states", value: "Finance Commission" },
    { key: "Revenue deficit", value: "Excess of revenue expenditure over revenue receipts" },
    {
      key: "Fiscal deficit",
      value: "Excess of total expenditure over receipts other than borrowings",
    },
    { key: "Largest source of a state's own tax revenue", value: "State Goods and Services Tax" },
  ],
  "Regarding state budgets, what is the %s?",
  "Which budget term is described as '%s'?",
  "%k is %v.",
  "budget term and its meaning",
);

add(
  "pb:employment",
  "Punjab Economics",
  "Employment",
  "Moderate",
  [
    { key: "MGNREGA", value: "Guarantees one hundred days of wage employment in rural areas" },
    {
      key: "Disguised unemployment",
      value: "More people employed than actually needed for the work",
    },
    {
      key: "Seasonal unemployment",
      value: "Lack of work during part of the year, common in farming",
    },
    {
      key: "Structural unemployment",
      value: "Mismatch between workers' skills and available jobs",
    },
    { key: "Organised sector", value: "Employment with regular wages and social security" },
    { key: "Unorganised sector", value: "Employment without job security or regular wages" },
    { key: "Ghar Ghar Rozgar", value: "Punjab's employment generation and counselling programme" },
    { key: "Skill India Mission", value: "Vocational skill training to improve employability" },
    {
      key: "Main reason for youth migration from Punjab",
      value: "Limited industrial and service sector jobs",
    },
  ],
  "Regarding employment, what does '%s' mean?",
  "Which employment term is described as '%s'?",
  "%k: %v.",
  "employment term and its meaning",
);

add(
  "pb:coop",
  "Punjab Economics",
  "Cooperative Sector",
  "Moderate",
  [
    { key: "Markfed", value: "Punjab State Cooperative Supply and Marketing Federation" },
    { key: "Milkfed", value: "Punjab State Cooperative Milk Producers' Federation" },
    { key: "Verka", value: "Milk and dairy brand of Milkfed Punjab" },
    { key: "Sugarfed", value: "Punjab State Federation of Cooperative Sugar Mills" },
    {
      key: "Primary Agricultural Credit Society",
      value: "Village level cooperative that gives short-term crop loans",
    },
    {
      key: "Amendment giving constitutional status to cooperatives",
      value: "97th Constitutional Amendment, 2011",
    },
    { key: "Chief aim of a cooperative society", value: "Service to members rather than profit" },
    { key: "Apex cooperative bank of a state", value: "State Cooperative Bank" },
    { key: "Operation Flood", value: "National programme that built dairy cooperatives" },
  ],
  "What does %s refer to in the cooperative sector?",
  "Which cooperative body is described as '%s'?",
  "%k is %v.",
  "cooperative body and its description",
);

export const PUNJAB_TEMPLATES = templates;
