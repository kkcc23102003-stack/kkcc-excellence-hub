/**
 * Punjab GK, History, Geography and Economics — the rest of the syllabus.
 *
 * `punjab.ts` covers districts, rivers, folk dances, important places, sports,
 * the Sikh Gurus, Maharaja Ranjit Singh, the Anglo-Sikh wars, the Ghadar
 * movement, reorganisation, the regions, soils, canals, climate, the Green
 * Revolution, cooperatives and MSME. This file adds every remaining chapter
 * that PPSC, PSSSB, Punjab Police, Patwari and the teaching cadres set.
 */

import { type Template } from "./core";
import { PUNJAB_STATE, chapterFactory } from "./two-layer";

const PB = [...new Set([...PUNJAB_STATE, "State PSC", "UPSC CSE", "CUET"])];

const templates: Template[] = [];
const gk = chapterFactory(templates, "Punjab GK", PB);
const hist = chapterFactory(templates, "Punjab History", PB);
const geo = chapterFactory(templates, "Punjab Geography", PB);
const eco = chapterFactory(templates, "Punjab Economics", PB);

/* ============================================================ Punjab GK */

gk(
  "pb:gk:symbols",
  "State Symbols and Punjab at a Glance",
  "About Punjab, what is %s?",
  "%k is %v.",
  [
    { key: "Capital of Punjab", value: "Chandigarh, shared with Haryana" },
    { key: "State animal of Punjab", value: "The blackbuck" },
    { key: "State bird of Punjab", value: "The northern goshawk, called baaz" },
    { key: "State tree of Punjab", value: "The shisham" },
    { key: "State flower of Punjab", value: "The gladiolus" },
    { key: "Official language of Punjab", value: "Punjabi, written in the Gurmukhi script" },
    { key: "Meaning of the name Punjab", value: "The land of five rivers" },
    { key: "Punjab Day", value: "1 November, marking the reorganisation of 1966" },
    { key: "Number of districts in Punjab", value: "Twenty three" },
    { key: "Largest city of Punjab by population", value: "Ludhiana" },
  ],
  [
    {
      key: "Area of Punjab",
      value: "About 50,362 square kilometres, roughly 1.5 per cent of India",
    },
    { key: "Position of Punjab by area among Indian states", value: "Twentieth" },
    { key: "Literacy rate of Punjab in the 2011 census", value: "About 75.8 per cent" },
    { key: "Sex ratio of Punjab in the 2011 census", value: "895 females per thousand males" },
    { key: "Newest district of Punjab", value: "Malerkotla, carved out in 2021" },
  ],
);

gk(
  "pb:gk:administration",
  "Administrative Setup of Punjab",
  "In the administration of Punjab, what is %s?",
  "%k is %v.",
  [
    { key: "Constitutional head of Punjab", value: "The Governor" },
    { key: "Real executive head of Punjab", value: "The Chief Minister" },
    { key: "Strength of the Punjab Vidhan Sabha", value: "One hundred and seventeen seats" },
    { key: "Lok Sabha seats from Punjab", value: "Thirteen" },
    { key: "Rajya Sabha seats from Punjab", value: "Seven" },
    { key: "High Court for Punjab", value: "The Punjab and Haryana High Court at Chandigarh" },
    { key: "Head of a district in Punjab", value: "The Deputy Commissioner" },
    { key: "Head of district police", value: "The Senior Superintendent of Police" },
    {
      key: "Number of divisions in Punjab",
      value: "Five: Patiala, Rupnagar, Jalandhar, Faridkot and Ferozepur",
    },
    { key: "Tehsil", value: "The revenue subdivision of a district, headed by a Tehsildar" },
  ],
  [
    {
      key: "Punjab Public Service Commission",
      value: "The constitutional body at Patiala that conducts state civil services recruitment",
    },
    {
      key: "Punjab State Election Commission",
      value: "The body that conducts panchayat and municipal elections in the state",
    },
    {
      key: "Three tiers of panchayati raj in Punjab",
      value: "Gram Panchayat, Panchayat Samiti and Zila Parishad",
    },
    {
      key: "Lokpal of Punjab",
      value: "The state anti-corruption ombudsman established under the Punjab Lokpal Act",
    },
    { key: "Patwari", value: "The village level revenue official who maintains land records" },
  ],
);

gk(
  "pb:gk:institutions",
  "Universities and Institutions of Punjab",
  "Among the institutions of Punjab, what is %s?",
  "%k is %v.",
  [
    {
      key: "Punjab Agricultural University",
      value: "The university at Ludhiana that led the Green Revolution",
    },
    {
      key: "Punjabi University",
      value: "The university at Patiala, founded in 1962 for Punjabi language and culture",
    },
    { key: "Guru Nanak Dev University", value: "The university at Amritsar, founded in 1969" },
    { key: "Panjab University", value: "The historic university now located at Chandigarh" },
    { key: "IIT of Punjab", value: "The Indian Institute of Technology at Ropar" },
    { key: "IIM of Punjab", value: "The Indian Institute of Management at Amritsar" },
    {
      key: "PGIMER",
      value: "The Postgraduate Institute of Medical Education and Research at Chandigarh",
    },
    { key: "Thapar Institute", value: "The engineering institute at Patiala" },
    { key: "NIT of the region", value: "The National Institute of Technology at Jalandhar" },
    {
      key: "Punjab School Education Board",
      value: "The board at Mohali that conducts school examinations in the state",
    },
  ],
  [
    {
      key: "Central University of Punjab",
      value: "The central university at Bathinda, established in 2009",
    },
    {
      key: "Guru Angad Dev Veterinary and Animal Sciences University",
      value: "The veterinary university at Ludhiana",
    },
    {
      key: "Baba Farid University of Health Sciences",
      value: "The health sciences university at Faridkot",
    },
    {
      key: "Maharaja Ranjit Singh Punjab Technical University",
      value: "The technical university at Bathinda",
    },
    {
      key: "National Institute of Pharmaceutical Education and Research",
      value: "The pharmaceutical institute at Mohali",
    },
  ],
);

gk(
  "pb:gk:festivals",
  "Fairs, Festivals and Culture of Punjab",
  "Among the fairs and festivals of Punjab, what is %s?",
  "%k is %v.",
  [
    {
      key: "Baisakhi",
      value: "The harvest festival in April, also marking the founding of the Khalsa in 1699",
    },
    { key: "Lohri", value: "The mid-January bonfire festival marking the end of winter" },
    { key: "Hola Mohalla", value: "The Sikh martial festival held at Anandpur Sahib after Holi" },
    { key: "Maghi", value: "The festival at Muktsar commemorating the forty liberated ones" },
    { key: "Teej", value: "The monsoon festival of swings celebrated by women" },
    {
      key: "Jor Mela",
      value: "The fair at Fatehgarh Sahib remembering the younger sons of Guru Gobind Singh",
    },
    { key: "Chhapar Mela", value: "The fair held at Chhapar village in Ludhiana district" },
    { key: "Rural Olympics", value: "The rural sports festival held at Kila Raipur" },
    { key: "Harballabh Sangeet Sammelan", value: "The classical music festival held at Jalandhar" },
    { key: "Phulkari", value: "The traditional Punjabi embroidery of flower work on a shawl" },
  ],
  [
    { key: "Roshni Mela", value: "The fair held at Jagraon in Ludhiana district" },
    {
      key: "Baba Sheikh Farid Aagman Purb",
      value: "The cultural festival held at Faridkot in honour of Baba Farid",
    },
    {
      key: "Kapurthala Heritage Festival",
      value: "The festival celebrating the Indo-French architecture of Kapurthala",
    },
    {
      key: "Naina Devi Mela",
      value: "The pilgrimage fair drawing devotees from Punjab to the nearby shrine",
    },
    {
      key: "Punjabi Suba movement outcome",
      value: "The linguistic reorganisation of 1 November 1966 that created present-day Punjab",
    },
  ],
);

gk(
  "pb:gk:personalities",
  "Personalities of Punjab",
  "Among the personalities of Punjab, who or what is %s?",
  "%k is %v.",
  [
    { key: "Bhagat Singh", value: "The revolutionary of Khatkar Kalan, hanged at Lahore in 1931" },
    { key: "Lala Lajpat Rai", value: "The Punjab Kesari, leader of the Lal Bal Pal trio" },
    {
      key: "Udham Singh",
      value: "The revolutionary who avenged the Jallianwala Bagh massacre in 1940",
    },
    { key: "Kartar Singh Sarabha", value: "The young Ghadar revolutionary hanged in 1915" },
    { key: "Milkha Singh", value: "The Flying Sikh, India's celebrated sprinter" },
    { key: "Balbir Singh Senior", value: "The hockey legend of three Olympic gold medals" },
    {
      key: "Amrita Pritam",
      value:
        "The Punjabi poet and novelist, first woman to win the Sahitya Akademi Award in Punjabi",
    },
    { key: "Bhai Vir Singh", value: "The father of modern Punjabi literature" },
    {
      key: "Baba Farid",
      value: "The Sufi saint whose verses are included in the Guru Granth Sahib",
    },
    {
      key: "M S Randhawa",
      value: "The administrator and writer closely associated with the Green Revolution in Punjab",
    },
  ],
  [
    { key: "Sir Sobha Singh", value: "The painter famous for portraits of the Sikh Gurus" },
    {
      key: "Shaheed Sukhdev Thapar",
      value: "The revolutionary of Ludhiana hanged with Bhagat Singh in 1931",
    },
    {
      key: "Diwan Todar Mal",
      value: "The merchant of Sirhind who bought land to cremate the younger sahibzadas",
    },
    {
      key: "Hari Singh Nalwa",
      value: "The general of Maharaja Ranjit Singh who commanded on the north-west frontier",
    },
    {
      key: "Giani Zail Singh",
      value: "The first Sikh President of India, earlier Chief Minister of Punjab",
    },
  ],
);

gk(
  "pb:gk:schemes",
  "Government Schemes of Punjab",
  "Among the schemes of the Punjab government, what is %s?",
  "%k is %v.",
  [
    {
      key: "Ashirwad Scheme",
      value: "Financial assistance for the marriage of daughters of poor families",
    },
    { key: "Punjab Ghar Ghar Rozgar", value: "The state employment and skill development mission" },
    {
      key: "Smart Ration Card Scheme",
      value: "Subsidised wheat delivered through smart cards to eligible families",
    },
    {
      key: "Mission Tandarust Punjab",
      value: "The state mission for clean air, water, soil and safe food",
    },
    {
      key: "Punjab Nirman Programme",
      value: "The rural and urban infrastructure development programme of the state",
    },
    {
      key: "Sarbat Sehat Bima Yojana",
      value: "The state health insurance scheme covering five lakh rupees a family a year",
    },
    {
      key: "Mera Kam Mera Maan",
      value: "A scheme supporting skill training and self employment for the youth",
    },
    {
      key: "Punjab Divyangjan Shaktikaran Yojana",
      value: "A scheme for the welfare and empowerment of persons with disabilities",
    },
    {
      key: "Pani Bachao Paisa Kamao",
      value: "A scheme paying farmers for the electricity they save on tubewells",
    },
    {
      key: "Punjab State Food Commission",
      value: "The body that monitors implementation of the food security law in the state",
    },
  ],
  [
    {
      key: "Punjab Agri Export Policy",
      value: "The policy framework for promoting export of agricultural produce from the state",
    },
    {
      key: "Crop Residue Management scheme",
      value: "Subsidised machinery to manage paddy stubble in place of burning it",
    },
    {
      key: "Punjab Industrial and Business Development Policy",
      value: "The policy offering fiscal incentives to new industrial units in the state",
    },
    {
      key: "Smart Village Campaign",
      value: "The state campaign funding village level infrastructure works",
    },
    {
      key: "Punjab State Council for Science and Technology",
      value: "The state body that promotes scientific research and environmental studies",
    },
  ],
);

gk(
  "pb:gk:tourism",
  "Tourism and Heritage of Punjab",
  "Among the tourist and heritage sites of Punjab, what is %s?",
  "%k is %v.",
  [
    {
      key: "Golden Temple",
      value: "Sri Harmandir Sahib at Amritsar, the holiest shrine of Sikhism",
    },
    { key: "Jallianwala Bagh", value: "The memorial at Amritsar of the massacre of 13 April 1919" },
    {
      key: "Wagah Border",
      value: "The India-Pakistan border post near Amritsar known for the retreat ceremony",
    },
    { key: "Virasat-e-Khalsa", value: "The heritage museum at Anandpur Sahib" },
    { key: "Qila Mubarak", value: "The historic fort at Bathinda, one of the oldest in India" },
    { key: "Sheesh Mahal", value: "The palace of mirrors at Patiala" },
    { key: "Jagatjit Palace", value: "The Indo-French palace at Kapurthala" },
    {
      key: "Harike Wetland",
      value: "The Ramsar wetland at the confluence of the Beas and the Sutlej",
    },
    {
      key: "Gurdwara Fatehgarh Sahib",
      value: "The shrine remembering the martyrdom of the younger sahibzadas",
    },
    { key: "Rock Garden", value: "The sculpture garden at Chandigarh built by Nek Chand" },
  ],
  [
    { key: "Ropar heritage", value: "The Harappan and later site at Rupnagar on the Sutlej" },
    {
      key: "Sanghol",
      value: "The archaeological site in Fatehgarh Sahib district with Kushana period remains",
    },
    {
      key: "Ramsar sites of Punjab",
      value: "Harike, Kanjli, Ropar, Beas Conservation Reserve, Nangal and Keshopur-Miani",
    },
    {
      key: "Hazur Sahib link",
      value: "The takht outside Punjab at Nanded where Guru Gobind Singh passed away",
    },
    {
      key: "Takhts located in Punjab",
      value: "Akal Takht at Amritsar, Kesgarh Sahib at Anandpur and Damdama Sahib at Talwandi Sabo",
    },
  ],
);

/* ======================================================= Punjab History */

hist(
  "pb:hist:ancient",
  "Ancient Punjab",
  "In the ancient history of Punjab, what is %s?",
  "%k is %v.",
  [
    { key: "Harappan site in Punjab", value: "Rupnagar, on the Sutlej" },
    {
      key: "Land of the Rigveda",
      value: "The Sapta Sindhu, the region of the seven rivers, largely present-day Punjab",
    },
    {
      key: "Battle of the Hydaspes",
      value: "The 326 BCE battle between Alexander and Porus on the Jhelum",
    },
    {
      key: "Porus",
      value: "The Paurava king who fought Alexander and was restored to his kingdom",
    },
    { key: "Taxila", value: "The ancient centre of learning in undivided Punjab" },
    {
      key: "Chandragupta Maurya's rise",
      value: "He drove out the Greek garrisons from Punjab before taking Magadha",
    },
    { key: "Sanghol", value: "The Kushana period Buddhist site in Fatehgarh Sahib district" },
    {
      key: "Indo-Greek rule in Punjab",
      value: "The rule of kings such as Menander after the Mauryas",
    },
    {
      key: "Huna invasions",
      value: "The fifth and sixth century invasions that struck Punjab and the north-west",
    },
    {
      key: "Gandhara school reach",
      value: "Its Greco-Buddhist sculpture spread across the north-west including Punjab",
    },
  ],
  [
    {
      key: "Dasarajna",
      value: "The Rigvedic battle of ten kings fought on the Parushni, the modern Ravi",
    },
    { key: "Ancient name of the Sutlej", value: "Shatadru" },
    { key: "Ancient name of the Beas", value: "Vipasha" },
    { key: "Ancient name of the Ravi", value: "Parushni or Iravati" },
    { key: "Ancient name of the Chenab", value: "Asikni or Chandrabhaga" },
  ],
);

hist(
  "pb:hist:medieval",
  "Medieval Punjab and the Sufi Tradition",
  "In medieval Punjab, what is %s?",
  "%k is %v.",
  [
    {
      key: "First Battle of Tarain",
      value: "Fought in 1191 near Thanesar, won by Prithviraj Chauhan",
    },
    {
      key: "Second Battle of Tarain",
      value: "Fought in 1192, won by Muhammad Ghori, opening Punjab to Turkish rule",
    },
    { key: "First Battle of Panipat", value: "Fought in 1526, where Babur defeated Ibrahim Lodi" },
    {
      key: "Baba Farid",
      value: "The Chishti Sufi of Pakpattan whose verses are in the Guru Granth Sahib",
    },
    { key: "Shah Hussain", value: "The Sufi poet of Lahore known for his kafis" },
    {
      key: "Bulleh Shah",
      value: "The Sufi poet of Kasur, the greatest name in Punjabi Sufi verse",
    },
    { key: "Waris Shah", value: "The poet of Heer, the best known Punjabi qissa" },
    {
      key: "Sirhind",
      value: "The Mughal provincial town of Punjab, later destroyed by Banda Singh Bahadur",
    },
    {
      key: "Lahore under the Mughals",
      value: "A provincial capital and for a time the imperial capital under Akbar",
    },
    { key: "Guru Nanak's birthplace", value: "Talwandi, now Nankana Sahib" },
  ],
  [
    {
      key: "Third Battle of Panipat",
      value: "Fought in 1761, when Ahmad Shah Abdali defeated the Marathas",
    },
    {
      key: "Abdali's invasions",
      value: "Repeated Afghan raids between 1748 and 1767 that devastated Punjab",
    },
    {
      key: "Vadda Ghallughara",
      value: "The great massacre of 1762 in which Abdali killed thousands of Sikhs",
    },
    { key: "Chhota Ghallughara", value: "The lesser massacre of 1746 in the Kahnuwan area" },
    {
      key: "Banda Singh Bahadur",
      value: "The Sikh commander who captured Sirhind in 1710 and struck coins in the Gurus' name",
    },
  ],
);

hist(
  "pb:hist:misls",
  "The Sikh Misls",
  "About the Sikh misls, what is %s?",
  "%k is %v.",
  [
    {
      key: "Misl",
      value: "A confederate Sikh fighting unit that held territory in eighteenth century Punjab",
    },
    { key: "Number of misls", value: "Twelve" },
    {
      key: "Sukerchakia Misl",
      value: "The misl of Maharaja Ranjit Singh's family, based at Gujranwala",
    },
    {
      key: "Ahluwalia Misl",
      value: "The misl led by Jassa Singh Ahluwalia, centred on Kapurthala",
    },
    { key: "Ramgarhia Misl", value: "The misl led by Jassa Singh Ramgarhia" },
    { key: "Bhangi Misl", value: "The misl that held Lahore and Amritsar before Ranjit Singh" },
    {
      key: "Phulkian Misl",
      value: "The misl from which the Patiala, Nabha and Jind houses descended",
    },
    { key: "Dal Khalsa", value: "The combined army of the misls, organised in 1748" },
    {
      key: "Gurmata",
      value:
        "A binding resolution passed by the Sarbat Khalsa in the presence of the Guru Granth Sahib",
    },
    {
      key: "Rakhi system",
      value: "The protection tax the misls collected from villages in return for security",
    },
  ],
  [
    {
      key: "Jassa Singh Ahluwalia's title",
      value: "Sultan-ul-Qaum, given after the capture of Lahore in 1761",
    },
    {
      key: "Kanhaiya Misl",
      value: "The misl whose alliance by marriage strengthened Ranjit Singh's position",
    },
    { key: "Nishanwalia Misl", value: "The misl that carried the standard of the Dal Khalsa" },
    { key: "Karorsinghia Misl", value: "The misl founded by Karora Singh in the Doaba region" },
    {
      key: "End of the misl period",
      value: "Ranjit Singh's capture of Lahore in 1799 and his coronation in 1801",
    },
  ],
);

hist(
  "pb:hist:jallianwala",
  "Jallianwala Bagh and the National Movement in Punjab",
  "About the national movement in Punjab, what is %s?",
  "%k is %v.",
  [
    { key: "Date of the Jallianwala Bagh massacre", value: "13 April 1919, on Baisakhi" },
    { key: "Officer responsible for the massacre", value: "Brigadier General Reginald Dyer" },
    { key: "Lieutenant Governor of Punjab in 1919", value: "Sir Michael O'Dwyer" },
    {
      key: "Rowlatt Act",
      value: "The 1919 law allowing detention without trial, which triggered the protests",
    },
    {
      key: "Hunter Committee",
      value: "The official committee that inquired into the Punjab disturbances of 1919",
    },
    { key: "Rabindranath Tagore's response", value: "He renounced his knighthood in protest" },
    { key: "Udham Singh's act", value: "He shot Michael O'Dwyer in London in 1940" },
    { key: "Leaders arrested before the massacre", value: "Dr Satyapal and Dr Saifuddin Kitchlew" },
    { key: "Martial law in Punjab", value: "Imposed in April 1919 across several districts" },
    {
      key: "Jallianwala Bagh memorial",
      value: "The national memorial at Amritsar, inaugurated in 1961",
    },
  ],
  [
    {
      key: "Congress inquiry into the massacre",
      value: "A non-official committee including Motilal Nehru and Gandhi",
    },
    {
      key: "Crawling order",
      value:
        "Dyer's order that Indians crawl along the lane where a British woman had been assaulted",
    },
    {
      key: "Effect of the massacre on the national movement",
      value: "It led directly to the Non-Cooperation Movement of 1920",
    },
    {
      key: "Punjab's share in the Indian Army in 1919",
      value:
        "Punjab supplied a disproportionately large share of recruits during the First World War",
    },
    {
      key: "Shaheed Udham Singh's assumed name",
      value: "Ram Mohammad Singh Azad, chosen to show communal unity",
    },
  ],
);

hist(
  "pb:hist:reform-movements",
  "Reform and Political Movements in Punjab",
  "Among the movements of Punjab, what is %s?",
  "%k is %v.",
  [
    {
      key: "Namdhari or Kuka movement",
      value: "The reform movement led by Baba Ram Singh from 1857",
    },
    { key: "Singh Sabha movement", value: "The Sikh reform movement begun at Amritsar in 1873" },
    { key: "Chief Khalsa Diwan", value: "The central body of the Singh Sabhas formed in 1902" },
    {
      key: "Akali movement",
      value: "The movement of the 1920s to free gurdwaras from mahant control",
    },
    {
      key: "Shiromani Gurdwara Parbandhak Committee",
      value: "The body formed in 1920 to manage historical gurdwaras",
    },
    {
      key: "Nankana Sahib tragedy",
      value: "The killing of Akali reformers at Nankana Sahib in February 1921",
    },
    { key: "Guru ka Bagh morcha", value: "The non-violent Akali agitation of 1922" },
    {
      key: "Babbar Akali movement",
      value: "The militant offshoot of the Akali movement in the Doaba region",
    },
    {
      key: "Naujawan Bharat Sabha",
      value: "The youth organisation founded by Bhagat Singh in 1926",
    },
    {
      key: "Punjab Land Alienation Act",
      value: "The 1900 law restricting transfer of agricultural land to non-agricultural castes",
    },
  ],
  [
    {
      key: "Sikh Gurdwaras Act",
      value: "The 1925 law that placed historical gurdwaras under elected committee control",
    },
    {
      key: "Pagri Sambhal Jatta movement",
      value: "The 1907 agrarian agitation led by Ajit Singh against colonial land laws",
    },
    {
      key: "Arya Samaj in Punjab",
      value: "The reform movement that spread rapidly in Punjab after Dayanand's visit",
    },
    {
      key: "Kirti Kisan Party",
      value: "The peasant and workers party formed by returned Ghadarites in the 1920s",
    },
    {
      key: "Jaito morcha",
      value: "The Akali agitation of 1923-24 over the deposition of the Nabha ruler",
    },
  ],
);

hist(
  "pb:hist:post-1947",
  "Punjab after Independence",
  "In the history of Punjab after 1947, what is %s?",
  "%k is %v.",
  [
    {
      key: "Radcliffe Line",
      value: "The 1947 boundary that divided Punjab between India and Pakistan",
    },
    { key: "First capital of Indian Punjab", value: "Shimla, before Chandigarh was built" },
    { key: "Architect of Chandigarh", value: "Le Corbusier" },
    { key: "PEPSU", value: "The Patiala and East Punjab States Union, merged into Punjab in 1956" },
    {
      key: "Punjabi Suba movement",
      value: "The demand for a Punjabi speaking state, led by the Akali Dal",
    },
    {
      key: "Punjab Reorganisation Act",
      value: "The 1966 law that created Haryana and gave hill areas to Himachal Pradesh",
    },
    { key: "Date of reorganisation", value: "1 November 1966" },
    {
      key: "Status of Chandigarh after 1966",
      value: "A union territory serving as the shared capital of Punjab and Haryana",
    },
    {
      key: "Bhakra Dam",
      value: "The dam on the Sutlej that transformed irrigation and power in Punjab",
    },
    {
      key: "Green Revolution in Punjab",
      value: "The late nineteen sixties adoption of high yielding wheat varieties",
    },
  ],
  [
    {
      key: "Indus Waters Treaty and Punjab",
      value: "The 1960 treaty gave India the Ravi, Beas and Sutlej, shaping Punjab's canal network",
    },
    {
      key: "Shah Commission on Chandigarh",
      value: "The commission that examined the boundary and capital issues after reorganisation",
    },
    { key: "Anandpur Sahib Resolution", value: "The 1973 Akali Dal resolution on state autonomy" },
    {
      key: "Rajiv-Longowal Accord",
      value: "The 1985 agreement on Chandigarh, river waters and other Punjab issues",
    },
    {
      key: "Punjab's role in national food security",
      value: "The state has long contributed a leading share of wheat and rice to the central pool",
    },
  ],
);

/* ==================================================== Punjab Geography */

geo(
  "pb:geo:physiography",
  "Physiography of Punjab",
  "In the physiography of Punjab, what is %s?",
  "%k is %v.",
  [
    {
      key: "Main physical divisions of Punjab",
      value: "The Shiwalik hills, the piedmont plain and the alluvial plain",
    },
    { key: "Highest part of Punjab", value: "The Shiwalik range in the north-east" },
    { key: "General slope of Punjab", value: "From north-east to south-west" },
    { key: "Bet lands", value: "The low lying flood plains along the rivers" },
    { key: "Chos", value: "The seasonal hill torrents that descend from the Shiwaliks" },
    { key: "Kandi belt", value: "The undulating piedmont strip at the foot of the Shiwaliks" },
    { key: "Bhangar of Punjab", value: "The older alluvium forming the upland plain" },
    { key: "Khadar of Punjab", value: "The newer alluvium in the river flood plains" },
    {
      key: "Southern part of Punjab",
      value: "The sandy tract merging into the Rajasthan desert margin",
    },
    {
      key: "Average elevation of the Punjab plain",
      value: "Between about 180 and 300 metres above sea level",
    },
  ],
  [
    {
      key: "Problem of the Kandi belt",
      value: "Rapid runoff, soil erosion and a deep water table",
    },
    { key: "Tobas", value: "Natural depressions in the south-west that collect rainwater" },
    {
      key: "Choe management",
      value: "Check dams and afforestation used to control hill torrents in the Shiwaliks",
    },
    {
      key: "Sand dunes in Punjab",
      value: "Stabilised dunes found in the Mansa and Bathinda tract",
    },
    {
      key: "Geological base of the Punjab plain",
      value: "Thick Quaternary alluvium deposited by the Himalayan rivers",
    },
  ],
);

geo(
  "pb:geo:forests-wildlife",
  "Forests and Wildlife of Punjab",
  "About the forests and wildlife of Punjab, what is %s?",
  "%k is %v.",
  [
    {
      key: "Forest cover of Punjab",
      value: "One of the lowest in India, under four per cent of the geographical area",
    },
    { key: "Main forest type of Punjab", value: "Tropical dry deciduous and thorn forest" },
    { key: "Where most forest is found", value: "The Shiwalik districts in the north-east" },
    { key: "State animal habitat", value: "The blackbuck, protected at Abohar" },
    {
      key: "Abohar Wildlife Sanctuary",
      value: "The sanctuary in Fazilka district known for the blackbuck",
    },
    {
      key: "Harike Wildlife Sanctuary",
      value: "The wetland sanctuary at the Beas-Sutlej confluence",
    },
    {
      key: "Bir Moti Bagh Sanctuary",
      value: "The sanctuary near Patiala, a former royal hunting preserve",
    },
    { key: "Common tree of Punjab", value: "The shisham, the state tree" },
    {
      key: "Social forestry in Punjab",
      value: "Roadside, canal side and farm forestry to raise tree cover outside forests",
    },
    {
      key: "Indian skimmer and Harike",
      value: "A notable migratory bird recorded at the Harike wetland",
    },
  ],
  [
    {
      key: "Ramsar sites of Punjab",
      value: "Harike, Kanjli, Ropar, Nangal, Keshopur-Miani and the Beas Conservation Reserve",
    },
    {
      key: "Beas Conservation Reserve",
      value: "The stretch of the Beas protected for the Indus river dolphin",
    },
    {
      key: "Indus river dolphin",
      value: "The endangered freshwater dolphin found in the Beas in Punjab",
    },
    {
      key: "Bir sanctuaries",
      value: "Small protected woodlands such as Bir Bhunerheri and Bir Gurdialpura",
    },
    {
      key: "Main threat to Punjab's wetlands",
      value: "Agricultural runoff, industrial effluent and shrinking water spread",
    },
  ],
);

geo(
  "pb:geo:industry-transport",
  "Industry, Minerals and Transport in Punjab",
  "About industry and transport in Punjab, what is %s?",
  "%k is %v.",
  [
    { key: "Industrial capital of Punjab", value: "Ludhiana, known for hosiery and bicycles" },
    { key: "Jalandhar industry", value: "Sports goods and hand tools" },
    { key: "Batala industry", value: "Foundries and machine tools" },
    { key: "Mandi Gobindgarh", value: "The steel town of Punjab" },
    { key: "Phagwara industry", value: "Sugar and engineering units" },
    {
      key: "Mineral position of Punjab",
      value: "Poor in minerals, with mainly sand, gravel and kankar",
    },
    {
      key: "Main thermal power station",
      value: "The Guru Hargobind Thermal Plant at Lehra Mohabbat and others in the south-west",
    },
    {
      key: "Hydel project on the Sutlej",
      value: "Bhakra, along with Anandpur Sahib and Mukerian hydel channels",
    },
    { key: "Railway junction of importance", value: "Ludhiana, on the Delhi-Amritsar main line" },
    {
      key: "International airport of Punjab",
      value: "Sri Guru Ram Dass Jee International Airport at Amritsar",
    },
  ],
  [
    { key: "Refinery in Punjab", value: "The Guru Gobind Singh Refinery at Bathinda" },
    {
      key: "Dry port of Punjab",
      value: "The inland container depots at Ludhiana and Dhandari Kalan",
    },
    { key: "Mohali industry", value: "Information technology, electronics and pharmaceuticals" },
    {
      key: "Kartarpur Corridor",
      value: "The 2019 corridor linking Dera Baba Nanak to the shrine at Kartarpur in Pakistan",
    },
    {
      key: "Reason for limited heavy industry",
      value: "Absence of mineral and coal resources and a long border location",
    },
  ],
);

geo(
  "pb:geo:population",
  "Population and Settlement in Punjab",
  "About the population of Punjab, what is %s?",
  "%k is %v.",
  [
    { key: "Population of Punjab in 2011", value: "About 2.77 crore" },
    { key: "Most populous district", value: "Ludhiana" },
    { key: "Least populous district in 2011", value: "Barnala" },
    { key: "Density of population in 2011", value: "About 551 persons per square kilometre" },
    { key: "Urban share of population", value: "About 37 per cent in 2011" },
    { key: "Decadal growth rate in 2011", value: "About 13.9 per cent" },
    { key: "Highest literacy district in 2011", value: "Hoshiarpur" },
    { key: "Main language spoken", value: "Punjabi" },
    { key: "Chief religion by number", value: "Sikhism, followed by Hinduism" },
    {
      key: "Doaba region migration",
      value: "The region with the largest overseas migration from Punjab",
    },
  ],
  [
    {
      key: "Child sex ratio concern",
      value: "Punjab has long had one of the lowest child sex ratios in India",
    },
    {
      key: "Reason for in-migration to Punjab",
      value: "Demand for agricultural and industrial labour, mainly from eastern states",
    },
    { key: "Rural settlement pattern of Punjab", value: "Largely compact nucleated villages" },
    {
      key: "Class I cities of Punjab",
      value: "Ludhiana, Amritsar, Jalandhar and Patiala among others",
    },
    {
      key: "Effect of Green Revolution on settlement",
      value: "Growth of market towns and mandis across the plain",
    },
  ],
);

/* ==================================================== Punjab Economics */

eco(
  "pb:eco:agriculture-pattern",
  "Cropping Pattern and Agricultural Marketing",
  "In Punjab's agriculture, what is %s?",
  "%k is %v.",
  [
    { key: "Main rabi crop of Punjab", value: "Wheat" },
    { key: "Main kharif crop of Punjab", value: "Paddy" },
    {
      key: "Cotton belt of Punjab",
      value: "The south-western districts such as Bathinda, Mansa and Fazilka",
    },
    { key: "Kinnow", value: "The citrus fruit grown widely in the Abohar and Hoshiarpur belts" },
    {
      key: "Mandi system",
      value: "The regulated market yard network run by the state marketing board",
    },
    {
      key: "Punjab Mandi Board",
      value: "The body that regulates agricultural markets in the state",
    },
    {
      key: "Minimum Support Price",
      value: "The assured price at which the government procures wheat and paddy",
    },
    {
      key: "Contribution of Punjab to the central pool",
      value: "A leading share of the wheat and rice procured for the nation",
    },
    { key: "Cropping intensity of Punjab", value: "Among the highest in India, near 190 per cent" },
    { key: "Chief source of irrigation in Punjab", value: "Tubewells, followed by canals" },
  ],
  [
    {
      key: "Problem of monoculture",
      value: "The wheat-paddy cycle has depleted groundwater and reduced soil health",
    },
    {
      key: "Crop diversification",
      value:
        "The shift towards maize, pulses, oilseeds and horticulture to break the wheat-paddy cycle",
    },
    {
      key: "Punjab Preservation of Subsoil Water Act",
      value: "The 2009 law fixing the earliest date for transplanting paddy",
    },
    {
      key: "Direct seeded rice",
      value: "A water saving method of sowing paddy without transplanting",
    },
    {
      key: "Custom hiring centres",
      value:
        "Village level machinery banks that make costly implements affordable to small farmers",
    },
  ],
);

eco(
  "pb:eco:livestock",
  "Dairy, Livestock and Allied Sectors",
  "In Punjab's allied agriculture, what is %s?",
  "%k is %v.",
  [
    { key: "Verka", value: "The dairy brand of the Punjab state cooperative milk federation" },
    { key: "Milkfed Punjab", value: "The apex cooperative milk marketing federation of the state" },
    {
      key: "Chief milch animal of Punjab",
      value: "The buffalo, with the Murrah breed widely kept",
    },
    { key: "Sahiwal", value: "A well known indigenous cattle breed of the Punjab region" },
    {
      key: "Poultry in Punjab",
      value: "A fast growing allied sector, concentrated near urban markets",
    },
    {
      key: "Fisheries in Punjab",
      value: "Inland fish farming practised mainly in the south-western districts",
    },
    {
      key: "Beekeeping in Punjab",
      value: "A successful allied enterprise, with the state a major honey producer",
    },
    { key: "Punjab's rank in milk production per person", value: "Among the highest in India" },
    {
      key: "Goat and sheep rearing",
      value: "A supplementary activity for small and landless households",
    },
    {
      key: "Veterinary university of Punjab",
      value: "Guru Angad Dev Veterinary and Animal Sciences University, Ludhiana",
    },
  ],
  [
    {
      key: "Role of allied sectors in diversification",
      value:
        "Dairy, poultry and fisheries raise farm income without adding to the water burden of paddy",
    },
    {
      key: "Milk cooperative structure",
      value: "Village societies, district milk unions and the state federation",
    },
    {
      key: "Punjab Dairy Development Board",
      value: "The body that trains dairy farmers and promotes commercial dairying",
    },
    {
      key: "Mushroom cultivation",
      value: "A high value indoor enterprise promoted for small holders in Punjab",
    },
    {
      key: "Agro processing potential",
      value:
        "Value addition in milk, kinnow, potato and wheat products is the main scope for rural employment",
    },
  ],
);

eco(
  "pb:eco:fiscal",
  "Public Finance and Development in Punjab",
  "About Punjab's public finance and development, what is %s?",
  "%k is %v.",
  [
    {
      key: "Main own tax revenue of Punjab",
      value: "State goods and services tax, along with excise on liquor and stamp duty",
    },
    {
      key: "Punjab budget presentation",
      value: "Presented each year in the Vidhan Sabha by the Finance Minister",
    },
    {
      key: "Fiscal deficit",
      value: "The excess of total expenditure over total receipts other than borrowings",
    },
    {
      key: "Debt burden of Punjab",
      value: "One of the higher debt to state income ratios among Indian states",
    },
    {
      key: "Free power to agriculture",
      value: "A long standing subsidy that is a major charge on the state budget",
    },
    {
      key: "Punjab State Power Corporation",
      value: "The state utility that generates and distributes electricity",
    },
    {
      key: "State Finance Commission",
      value: "The body that recommends devolution of funds to local bodies",
    },
    {
      key: "Per capita income of Punjab",
      value:
        "Above the national average but overtaken by several states since the nineteen nineties",
    },
    {
      key: "Chief source of non-tax revenue",
      value: "Interest receipts, dividends and user charges",
    },
    {
      key: "Punjab Infrastructure Development Board",
      value: "The body that plans and funds state infrastructure projects",
    },
  ],
  [
    {
      key: "Reason for Punjab's slowing growth",
      value: "Stagnant agriculture, limited industrialisation and a heavy subsidy and debt burden",
    },
    {
      key: "FRBM in the state context",
      value:
        "State fiscal responsibility laws cap the fiscal deficit as a share of state domestic product",
    },
    {
      key: "Off budget borrowing",
      value:
        "Borrowing through state corporations that does not appear directly in the budget deficit",
    },
    {
      key: "Outstanding liabilities concern",
      value: "High interest payments crowd out capital expenditure on schools, health and roads",
    },
    {
      key: "Way forward suggested for Punjab",
      value:
        "Crop diversification, agro processing, subsidy rationalisation and skill led industrialisation",
    },
  ],
);

export const PUNJAB_FULL_TEMPLATES = templates;
