/**
 * The rest of the General Studies history and culture syllabus.
 *
 * Ancient, Medieval and Modern History and Art and Culture carried six or
 * seven chapters each, which is far short of what UPSC, the State PSCs, SSC,
 * the railways, NDA and CAPF set. These are the modules the standard syllabus
 * lists that the bank had no chapter for.
 */

import { type Template } from "./core";
import { GK_WIDE, chapterFactory } from "./two-layer";

const templates: Template[] = [];
const anc = chapterFactory(templates, "Ancient History", GK_WIDE);
const med = chapterFactory(templates, "Medieval History", GK_WIDE);
const mod = chapterFactory(templates, "Modern History", GK_WIDE);
const art = chapterFactory(templates, "Art and Culture", GK_WIDE);

/* ======================================================= Ancient History */

anc(
  "anc:prehistoric",
  "Prehistoric India and the Stone Age",
  "In prehistoric India, what is %s?",
  "%k is %v.",
  [
    { key: "Three ages of the Stone Age", value: "Palaeolithic, Mesolithic and Neolithic" },
    {
      key: "Chief tool material of the Palaeolithic age",
      value: "Unpolished, chipped stone, mainly quartzite",
    },
    {
      key: "Characteristic tool of the Mesolithic age",
      value: "The microlith, a very small stone tool",
    },
    {
      key: "Chief advance of the Neolithic age",
      value: "Agriculture, domestication of animals and polished stone tools",
    },
    { key: "Site famous for prehistoric rock paintings", value: "Bhimbetka in Madhya Pradesh" },
    { key: "Earliest Neolithic site of the subcontinent", value: "Mehrgarh in Baluchistan" },
    { key: "First metal used by man", value: "Copper" },
    { key: "Chalcolithic age", value: "The age of stone and copper used together" },
    { key: "Important Chalcolithic site in Maharashtra", value: "Inamgaon" },
    { key: "First animal domesticated by man", value: "The dog" },
  ],
  [
    {
      key: "Significance of Burzahom in Kashmir",
      value: "A Neolithic site known for pit dwellings and the burial of dogs with their masters",
    },
    {
      key: "Earliest evidence of rice cultivation in India",
      value: "Koldihwa in the Belan valley of Uttar Pradesh",
    },
    { key: "Discoverer of the Bhimbetka rock shelters", value: "V S Wakankar, in 1957" },
    {
      key: "Significance of Adamgarh and Bagor",
      value:
        "They give the earliest evidence of animal domestication in India, in the Mesolithic period",
    },
    {
      key: "Reason the Neolithic period is called a revolution",
      value: "Food production replaced food gathering, which allowed settled village life",
    },
  ],
);

anc(
  "anc:sangam",
  "The Sangam Age and Early South India",
  "In the Sangam age, what is %s?",
  "%k is %v.",
  [
    { key: "Three kingdoms of the Sangam age", value: "The Cheras, the Cholas and the Pandyas" },
    { key: "Emblem of the Chola dynasty", value: "The tiger" },
    { key: "Emblem of the Pandya dynasty", value: "The fish" },
    { key: "Emblem of the Chera dynasty", value: "The bow" },
    { key: "Capital of the Pandyas", value: "Madurai" },
    { key: "Capital of the early Cholas", value: "Uraiyur, with Puhar as the port capital" },
    { key: "Sangam", value: "An assembly of Tamil poets held under royal patronage" },
    { key: "Greatest Tamil epic of the age", value: "Silappadikaram, by Ilango Adigal" },
    { key: "Tamil work on ethics by Tiruvalluvar", value: "The Tirukkural" },
    { key: "Greatest Chera ruler of the Sangam age", value: "Senguttuvan" },
  ],
  [
    { key: "Five divisions of Sangam land", value: "Kurinji, Mullai, Marudam, Neydal and Palai" },
    {
      key: "Tolkappiyam",
      value: "The earliest Tamil grammar, which also describes the society of the age",
    },
    {
      key: "Battle of Talaikkadu",
      value: "The battle in which the Pandya ruler Nedunjeliyan defeated the Chera and Chola kings",
    },
    {
      key: "Chief port of the Sangam Cholas",
      value: "Puhar, also called Kaveripattinam, a centre of Roman trade",
    },
    {
      key: "Manimekalai",
      value: "The Tamil epic by Sattanar, a sequel to Silappadikaram with a Buddhist theme",
    },
  ],
);

anc(
  "anc:foreign-invasions",
  "Foreign Invasions — Persians, Greeks, Shakas and Kushanas",
  "Among the foreign invasions of ancient India, what is %s?",
  "%k is %v.",
  [
    { key: "First foreign invader of India", value: "Cyrus of Persia, in the sixth century BC" },
    { key: "Persian ruler who annexed the Indus valley", value: "Darius the First" },
    { key: "Year Alexander invaded India", value: "326 BC" },
    {
      key: "Battle fought by Alexander against Porus",
      value: "The Battle of Hydaspes, on the Jhelum",
    },
    { key: "River at which Alexander's army refused to advance", value: "The Beas" },
    { key: "Greatest Indo-Greek ruler", value: "Menander, also called Milinda" },
    { key: "Buddhist text recording Menander's questions", value: "The Milindapanha" },
    { key: "Greatest Kushana ruler", value: "Kanishka" },
    {
      key: "Era started by Kanishka in AD 78",
      value: "The Shaka era, the national calendar of India",
    },
    { key: "Greatest Shaka ruler", value: "Rudradaman the First" },
  ],
  [
    {
      key: "First Indian ruler to issue gold coins on a large scale",
      value: "The Kushanas, particularly Vima Kadphises and Kanishka",
    },
    {
      key: "Buddhist council held under Kanishka",
      value: "The fourth, at Kundalavana in Kashmir, presided over by Vasumitra",
    },
    {
      key: "Junagadh rock inscription of Rudradaman",
      value:
        "The earliest long inscription in chaste Sanskrit, recording repair of the Sudarshana lake",
    },
    {
      key: "Effect of Alexander's invasion on India",
      value:
        "It opened land and sea routes between India and the West and left behind Indo-Greek states",
    },
    {
      key: "Two schools of art patronised by the Kushanas",
      value: "The Gandhara school in grey schist and the Mathura school in red sandstone",
    },
  ],
);

anc(
  "anc:trade-urbanisation",
  "Ancient Indian Trade, Guilds and Urbanisation",
  "In the economy of ancient India, what is %s?",
  "%k is %v.",
  [
    {
      key: "Second urbanisation of India",
      value: "The rise of towns in the Ganga valley from about the sixth century BC",
    },
    { key: "Guild of merchants or craftsmen", value: "The shreni" },
    {
      key: "Chief port of the western coast in the Roman trade",
      value: "Bharuch, called Barygaza by the Greeks",
    },
    {
      key: "Greek text describing Indian ports and trade",
      value: "The Periplus of the Erythraean Sea",
    },
    {
      key: "Chief Indian export to the Roman empire",
      value: "Spices, textiles, pearls and precious stones",
    },
    { key: "Chief item received in return from Rome", value: "Gold and silver coin" },
    {
      key: "Punch-marked coins",
      value: "The earliest Indian coins, of silver and copper, stamped with symbols",
    },
    { key: "Nigama", value: "A corporation of merchants in an ancient town" },
    {
      key: "Uttarapatha",
      value: "The great northern trade route from the north west to the Ganga valley",
    },
    { key: "Dakshinapatha", value: "The southern trade route running towards the Deccan" },
  ],
  [
    {
      key: "Reason iron was central to the second urbanisation",
      value:
        "Iron ploughshares and axes allowed the clearing of the Ganga forests and a surplus that fed towns",
    },
    { key: "Sarthavaha", value: "The leader of a caravan of traders" },
    {
      key: "Effect of the Roman trade on India",
      value: "A large inflow of gold, which Pliny complained was draining Rome of its bullion",
    },
    {
      key: "Role of guilds as bankers",
      value: "They received deposits and endowments and paid interest, acting as banks for donors",
    },
    {
      key: "Arikamedu",
      value:
        "A port near Puducherry excavated with Roman pottery and amphorae, proving Indo-Roman trade",
    },
  ],
);

anc(
  "anc:science-education",
  "Ancient Indian Science, Mathematics and Education",
  "In ancient Indian learning, what is %s?",
  "%k is %v.",
  [
    { key: "Astronomer who stated that the earth rotates on its axis", value: "Aryabhata" },
    { key: "Work of Aryabhata", value: "The Aryabhatiya" },
    { key: "Astronomer who wrote the Brihat Samhita", value: "Varahamihira" },
    { key: "Mathematician who wrote the Brahmasphuta Siddhanta", value: "Brahmagupta" },
    { key: "Father of Indian surgery", value: "Sushruta" },
    { key: "Work on medicine composed by Charaka", value: "The Charaka Samhita" },
    { key: "Author of the Ashtadhyayi", value: "Panini" },
    { key: "Ancient university of Bihar", value: "Nalanda" },
    { key: "Ancient university of the north west", value: "Takshashila" },
    {
      key: "University of Odisha of the ancient period",
      value: "Ratnagiri, with Pushpagiri and Lalitagiri",
    },
  ],
  [
    {
      key: "Contribution of Brahmagupta to mathematics",
      value: "The first clear rules for calculating with zero and with negative numbers",
    },
    { key: "Ruler who founded Nalanda", value: "Kumaragupta the First of the Gupta dynasty" },
    {
      key: "Chinese pilgrim who studied at Nalanda",
      value: "Hiuen Tsang, in the reign of Harshavardhana",
    },
    {
      key: "Sushruta's surgical achievement",
      value:
        "Rhinoplasty, along with cataract operations and the classification of surgical instruments",
    },
    {
      key: "Vikramshila university",
      value: "A centre of Tantric Buddhist learning founded by Dharmapala of the Pala dynasty",
    },
  ],
);

anc(
  "anc:sources",
  "Sources of Ancient Indian History — Coins and Inscriptions",
  "Among the sources of ancient Indian history, what is %s?",
  "%k is %v.",
  [
    { key: "Numismatics", value: "The study of coins" },
    { key: "Epigraphy", value: "The study of inscriptions" },
    { key: "Scholar who deciphered the Brahmi script", value: "James Prinsep, in 1837" },
    { key: "Script of most Ashokan inscriptions", value: "Brahmi" },
    {
      key: "Script used in the north western Ashokan edicts",
      value: "Kharosthi, written right to left",
    },
    {
      key: "Inscription recording Ashoka's Kalinga war remorse",
      value: "The thirteenth major rock edict",
    },
    {
      key: "Allahabad pillar inscription",
      value: "The prashasti of Samudragupta, composed by Harisena",
    },
    {
      key: "Aihole inscription",
      value: "The record of Pulakeshin the Second, composed by Ravikirti",
    },
    { key: "Greek ambassador at the Mauryan court", value: "Megasthenes" },
    { key: "Work written by Megasthenes", value: "The Indica" },
  ],
  [
    {
      key: "Hathigumpha inscription",
      value: "The record of Kharavela of Kalinga, in the Udayagiri hills of Odisha",
    },
    {
      key: "Nasik inscription of Gautami Balashri",
      value: "The record praising the Satavahana ruler Gautamiputra Satakarni",
    },
    {
      key: "Significance of the Sohgaura copper plate",
      value: "One of the earliest inscriptions, recording relief measures during a famine",
    },
    {
      key: "Value of coins as a historical source",
      value:
        "They fix dynasties and dates, show the extent of rule, and reveal the economy and religion of the age",
    },
    {
      key: "Mehrauli iron pillar",
      value:
        "The rust-free pillar at Delhi, whose inscription refers to a king Chandra, usually identified with Chandragupta the Second",
    },
  ],
);

/* ====================================================== Medieval History */

med(
  "med:early-medieval",
  "Early Medieval India and the Rajputs",
  "In early medieval India, what is %s?",
  "%k is %v.",
  [
    {
      key: "Tripartite struggle",
      value: "The contest for Kannauj among the Palas, Pratiharas and Rashtrakutas",
    },
    { key: "Founder of the Pala dynasty", value: "Gopala" },
    { key: "Greatest Pala ruler", value: "Dharmapala" },
    { key: "Founder of the Gurjara Pratihara power", value: "Nagabhata the First" },
    {
      key: "Four Agnikula Rajput clans",
      value: "The Pratiharas, Chauhans, Solankis and Paramaras",
    },
    { key: "Rajput ruler defeated at the second battle of Tarain", value: "Prithviraj Chauhan" },
    { key: "Year of the second battle of Tarain", value: "1192" },
    { key: "Poet of Prithviraj Chauhan's court", value: "Chand Bardai" },
    { key: "Dynasty that built the Sun temple at Konark", value: "The Eastern Gangas" },
    { key: "Dynasty that built the Khajuraho temples", value: "The Chandelas" },
  ],
  [
    {
      key: "Reason Kannauj was fought over",
      value:
        "It commanded the fertile Ganga valley and stood as the symbol of paramountcy in north India",
    },
    {
      key: "Feudalism in early medieval India",
      value:
        "The grant of revenue-free land to officials and temples, which fragmented political authority",
    },
    {
      key: "Dilwara temples",
      value: "The Jain marble temples at Mount Abu built under the Solankis of Gujarat",
    },
    {
      key: "Kalhana's Rajatarangini",
      value:
        "The chronicle of the kings of Kashmir, regarded as the first true work of Indian history writing",
    },
    {
      key: "Reason the Rajputs failed against the Turks",
      value: "Political disunity, outdated cavalry tactics and the absence of a common command",
    },
  ],
);

med(
  "med:southern-kingdoms",
  "The Cholas, Rashtrakutas and Southern Kingdoms",
  "Among the southern kingdoms, what is %s?",
  "%k is %v.",
  [
    { key: "Founder of the imperial Chola dynasty", value: "Vijayalaya" },
    { key: "Chola ruler who conquered Sri Lanka", value: "Rajaraja the First" },
    { key: "Chola ruler who led the expedition to South East Asia", value: "Rajendra the First" },
    { key: "Temple built by Rajaraja the First", value: "The Brihadeshwara temple at Thanjavur" },
    { key: "Title taken by Rajendra after his northern campaign", value: "Gangaikonda Chola" },
    {
      key: "Unit of Chola local self government",
      value: "The village assembly, the ur and the sabha",
    },
    {
      key: "Inscription describing Chola village administration",
      value: "The Uttaramerur inscription",
    },
    { key: "Founder of the Rashtrakuta dynasty", value: "Dantidurga" },
    { key: "Rashtrakuta ruler who built the Kailasa temple at Ellora", value: "Krishna the First" },
    { key: "Capital of the Rashtrakutas", value: "Manyakheta" },
  ],
  [
    {
      key: "Chola bronze technique",
      value: "The lost wax process, which produced the Nataraja and other icons",
    },
    {
      key: "Variyam in Chola administration",
      value: "A committee of the village sabha chosen by lot to manage a specific function",
    },
    {
      key: "Dravida style of the Chola temple",
      value: "A pyramidal vimana over the sanctum, with a gopuram gateway and a pillared mandapa",
    },
    { key: "Chalukya ruler who defeated Harshavardhana", value: "Pulakeshin the Second" },
    {
      key: "Reason Chola naval power mattered",
      value:
        "It protected the maritime trade with South East Asia and China and carried the Srivijaya expedition",
    },
  ],
);

med(
  "med:arab-turkish",
  "Arab and Turkish Invasions",
  "In the Turkish conquest of India, what is %s?",
  "%k is %v.",
  [
    { key: "Year of the Arab conquest of Sind", value: "AD 712" },
    { key: "Arab commander who conquered Sind", value: "Muhammad bin Qasim" },
    { key: "Ruler of Sind defeated by the Arabs", value: "Dahir" },
    { key: "Number of raids by Mahmud of Ghazni", value: "Seventeen" },
    { key: "Temple plundered by Mahmud of Ghazni in 1025", value: "The Somnath temple in Gujarat" },
    { key: "Scholar who came to India with Mahmud of Ghazni", value: "Alberuni" },
    { key: "Work written by Alberuni on India", value: "The Kitab-ul-Hind, or Tahqiq-i-Hind" },
    {
      key: "Year of the first battle of Tarain",
      value: "1191, in which Prithviraj defeated Muhammad Ghori",
    },
    { key: "Slave general who founded the Delhi Sultanate", value: "Qutb-ud-din Aibak" },
    { key: "Chronicle of Mahmud's reign", value: "The Tarikh-i-Yamini of Utbi" },
  ],
  [
    {
      key: "Difference between the aims of Mahmud and Ghori",
      value: "Mahmud raided for plunder, Ghori came to found an empire",
    },
    {
      key: "Reason the Arab conquest of Sind had limited effect",
      value: "It remained an isolated outpost and did not lead to further expansion into India",
    },
    {
      key: "Iqta system introduced by the Turks",
      value: "The assignment of revenue from a territory to an officer in place of a salary",
    },
    { key: "Chahalgani", value: "The corps of forty Turkish nobles organised by Iltutmish" },
    {
      key: "Reason the Turks succeeded militarily",
      value:
        "Superior mounted archery, the iron stirrup, unified command and swift cavalry tactics",
    },
  ],
);

med(
  "med:later-mughals",
  "The Later Mughals and the Decline of the Empire",
  "In the decline of the Mughal empire, what is %s?",
  "%k is %v.",
  [
    { key: "Last powerful Mughal emperor", value: "Aurangzeb, who died in 1707" },
    { key: "Emperor during Nadir Shah's invasion", value: "Muhammad Shah, called Rangeela" },
    { key: "Year of Nadir Shah's invasion of Delhi", value: "1739" },
    {
      key: "Treasure carried away by Nadir Shah",
      value: "The Peacock throne and the Koh-i-noor diamond",
    },
    { key: "Year of the third battle of Panipat", value: "1761" },
    { key: "Parties to the third battle of Panipat", value: "The Marathas and Ahmad Shah Abdali" },
    { key: "Last Mughal emperor", value: "Bahadur Shah the Second, deposed in 1858" },
    {
      key: "Mughal emperor who granted the Diwani of Bengal to the Company",
      value: "Shah Alam the Second",
    },
    { key: "Founder of the independent state of Hyderabad", value: "Nizam-ul-Mulk Asaf Jah" },
    { key: "Founder of the independent state of Awadh", value: "Saadat Khan Burhan-ul-Mulk" },
  ],
  [
    {
      key: "Chief causes of Mughal decline",
      value:
        "Weak successors, the Deccan and Rajput wars, the jagirdari crisis, foreign invasions and the rise of regional powers",
    },
    {
      key: "Jagirdari crisis",
      value:
        "Too many nobles chasing too few revenue assignments, which strained the mansabdari system",
    },
    {
      key: "Effect of the third battle of Panipat",
      value: "It broke Maratha ascendancy in the north and cleared the way for British expansion",
    },
    {
      key: "Deccan policy of Aurangzeb",
      value:
        "Prolonged campaigns against Bijapur, Golconda and the Marathas that drained the treasury and the army",
    },
    {
      key: "Sayyid brothers",
      value:
        "The king makers who raised and deposed Mughal emperors in the early eighteenth century",
    },
  ],
);

med(
  "med:land-revenue",
  "Medieval Land Revenue and Administrative Systems",
  "In medieval administration, what is %s?",
  "%k is %v.",
  [
    {
      key: "Market reforms introduced by Alauddin Khilji",
      value: "Price control in the Delhi markets with strict enforcement",
    },
    { key: "Iqta", value: "A revenue assignment given to an officer in lieu of salary" },
    { key: "Mansabdari system", value: "The Mughal system of ranking officers by zat and sawar" },
    { key: "Zat in the mansabdari system", value: "The rank fixing personal status and salary" },
    {
      key: "Sawar in the mansabdari system",
      value: "The number of horsemen the mansabdar had to maintain",
    },
    { key: "Jagir", value: "A revenue assignment given to a mansabdar in place of cash salary" },
    {
      key: "Zabti or Dahsala system",
      value:
        "Akbar's revenue system based on measurement and the average of ten years' produce and prices",
    },
    { key: "Officer who devised the Dahsala system", value: "Raja Todar Mal" },
    { key: "Diwan in Mughal administration", value: "The head of the revenue department" },
    {
      key: "Mir Bakshi",
      value: "The head of the military department in the Mughal administration",
    },
  ],
  [
    {
      key: "Dagh and chehra system",
      value:
        "The branding of horses and the descriptive roll of soldiers, introduced by Alauddin Khilji to stop fraud",
    },
    {
      key: "Difference between kharaj and khums",
      value:
        "Kharaj was the land tax on cultivators, khums the state's share of war booty and mines",
    },
    {
      key: "Sher Shah's revenue measures",
      value:
        "Survey and measurement of land, the patta and qabuliyat, and a fixed share of one third of the produce",
    },
    {
      key: "Ijaradari system",
      value:
        "Revenue farming, in which collection was auctioned to the highest bidder, common in the late Mughal period",
    },
    {
      key: "Reason the jagir was transferable",
      value: "Frequent transfer prevented a mansabdar from building a local base of power",
    },
  ],
);

med(
  "med:sikh-gurus",
  "The Sikh Gurus and the Rise of the Khalsa",
  "In Sikh history, what is %s?",
  "%k is %v.",
  [
    { key: "Founder of Sikhism", value: "Guru Nanak Dev, born in 1469" },
    { key: "Birthplace of Guru Nanak Dev", value: "Talwandi, now Nankana Sahib" },
    {
      key: "Guru who introduced the langar",
      value: "Guru Nanak Dev, and it was organised by Guru Angad Dev",
    },
    { key: "Guru who compiled the Gurmukhi script", value: "Guru Angad Dev" },
    { key: "Guru who founded Amritsar", value: "Guru Ram Das" },
    { key: "Guru who compiled the Adi Granth", value: "Guru Arjan Dev" },
    { key: "First Sikh martyr", value: "Guru Arjan Dev, executed in 1606" },
    { key: "Guru who founded the Akal Takht", value: "Guru Hargobind" },
    { key: "Guru martyred at Delhi in 1675", value: "Guru Tegh Bahadur" },
    { key: "Guru who founded the Khalsa in 1699", value: "Guru Gobind Singh" },
  ],
  [
    { key: "Five Ks of the Khalsa", value: "Kesh, kangha, kara, kachera and kirpan" },
    {
      key: "Panj Pyare",
      value: "The five beloved ones initiated by Guru Gobind Singh at Anandpur Sahib in 1699",
    },
    {
      key: "Miri and Piri",
      value: "The two swords of Guru Hargobind, standing for temporal and spiritual authority",
    },
    {
      key: "Guru Granth Sahib as the eternal Guru",
      value:
        "Guru Gobind Singh ended the line of living Gurus and vested guruship in the scripture",
    },
    {
      key: "Banda Singh Bahadur",
      value:
        "The commander who led the Sikhs after Guru Gobind Singh and struck coins in the Guru's name",
    },
  ],
);

/* ======================================================== Modern History */

mod(
  "mod:anglo-wars",
  "The Anglo-Mysore, Anglo-Maratha and Anglo-Sikh Wars",
  "Among the wars of British expansion, what is %s?",
  "%k is %v.",
  [
    {
      key: "Battle that laid the foundation of British rule in India",
      value: "The Battle of Plassey, in 1757",
    },
    { key: "Battle that confirmed British power in Bengal", value: "The Battle of Buxar, in 1764" },
    { key: "Ruler defeated at Plassey", value: "Siraj-ud-Daulah" },
    { key: "Treaty ending the first Anglo-Mysore war", value: "The Treaty of Madras, 1769" },
    { key: "Treaty ending the third Anglo-Mysore war", value: "The Treaty of Seringapatam, 1792" },
    { key: "Ruler killed in the fourth Anglo-Mysore war", value: "Tipu Sultan, in 1799" },
    { key: "Treaty that began the second Anglo-Maratha war", value: "The Treaty of Bassein, 1802" },
    {
      key: "Treaty ending the third Anglo-Maratha war",
      value: "The Treaty of Poona, and the end of the Peshwaship in 1818",
    },
    { key: "Treaty ending the first Anglo-Sikh war", value: "The Treaty of Lahore, 1846" },
    { key: "Year Punjab was annexed", value: "1849, after the second Anglo-Sikh war" },
  ],
  [
    {
      key: "Subsidiary alliance",
      value:
        "Wellesley's system under which a state kept a British force, paid for it and surrendered its foreign policy",
    },
    {
      key: "Doctrine of lapse",
      value: "Dalhousie's policy of annexing a state whose ruler died without a natural heir",
    },
    {
      key: "States annexed under the doctrine of lapse",
      value: "Satara, Jhansi, Nagpur, Sambalpur and Udaipur among others",
    },
    {
      key: "Reason the Treaty of Bassein was decisive",
      value:
        "The Peshwa accepted subsidiary alliance, which brought the Maratha confederacy under British control",
    },
    {
      key: "Significance of the Battle of Buxar over Plassey",
      value:
        "Plassey was won by conspiracy, Buxar by arms against a combined force, and it brought the Diwani of Bengal",
    },
  ],
);

mod(
  "mod:economic-impact",
  "Economic Impact of British Rule and the Drain of Wealth",
  "In the economic history of British India, what is %s?",
  "%k is %v.",
  [
    {
      key: "Drain of wealth theory",
      value:
        "The argument that a part of India's national wealth was exported to Britain without return",
    },
    { key: "Author of Poverty and Un-British Rule in India", value: "Dadabhai Naoroji" },
    { key: "Author of The Economic History of India", value: "Romesh Chandra Dutt" },
    {
      key: "Permanent Settlement of Bengal",
      value: "Cornwallis's settlement of 1793 fixing revenue with the zamindars for ever",
    },
    { key: "Ryotwari system", value: "A settlement made directly with the individual cultivator" },
    {
      key: "Officers associated with the Ryotwari system",
      value: "Thomas Munro and Alexander Read, in Madras",
    },
    { key: "Mahalwari system", value: "A settlement made with the village or mahal as a whole" },
    {
      key: "Deindustrialisation",
      value: "The decline of Indian handicrafts under competition from British machine goods",
    },
    {
      key: "Commercialisation of agriculture",
      value: "The shift to cash crops such as indigo, cotton, jute and opium for export",
    },
    { key: "Year of the great Bengal famine under Company rule", value: "1770" },
  ],
  [
    {
      key: "Home charges",
      value:
        "The expenses of the India Office, pensions and interest charged to Indian revenues and paid in Britain",
    },
    {
      key: "Effect of the Permanent Settlement on the cultivator",
      value:
        "The fixed heavy demand and absentee zamindari left the actual tiller insecure and impoverished",
    },
    {
      key: "One way drain through trade",
      value:
        "India's export surplus was not paid for in bullion but adjusted against home charges and Council bills",
    },
    {
      key: "Reason Indian handicrafts declined",
      value:
        "Free entry of cheap British machine goods, loss of court patronage and discriminatory tariffs",
    },
    {
      key: "Effect of railways on the Indian economy",
      value:
        "They served the export of raw material and the import of manufactures rather than Indian industry",
    },
  ],
);

mod(
  "mod:constitutional-acts",
  "Constitutional Development from 1773 to 1935",
  "Among the constitutional Acts of British India, what is %s?",
  "%k is %v.",
  [
    { key: "First Act of Parliament to regulate the Company", value: "The Regulating Act of 1773" },
    { key: "Act that created the Governor General of Bengal", value: "The Regulating Act of 1773" },
    { key: "Act that set up the Board of Control", value: "Pitt's India Act of 1784" },
    {
      key: "Act that ended the Company's trade monopoly with India",
      value: "The Charter Act of 1813",
    },
    {
      key: "Act that made the Governor General of Bengal the Governor General of India",
      value: "The Charter Act of 1833",
    },
    {
      key: "Act that transferred Indian government to the Crown",
      value: "The Government of India Act of 1858",
    },
    {
      key: "Act that introduced separate electorates",
      value: "The Indian Councils Act of 1909, the Morley-Minto reforms",
    },
    {
      key: "Act that introduced dyarchy in the provinces",
      value: "The Government of India Act of 1919, the Montagu-Chelmsford reforms",
    },
    {
      key: "Act that introduced provincial autonomy",
      value: "The Government of India Act of 1935",
    },
    {
      key: "Act that provided for the partition and independence of India",
      value: "The Indian Independence Act of 1947",
    },
  ],
  [
    {
      key: "Dyarchy",
      value:
        "The division of provincial subjects into reserved and transferred, the latter under Indian ministers",
    },
    {
      key: "Significance of the Charter Act of 1833",
      value:
        "It ended the Company's commercial functions, centralised legislation and opened services to Indians in principle",
    },
    {
      key: "Federation proposed by the 1935 Act",
      value:
        "An all India federation of provinces and princely states, which never came into being",
    },
    {
      key: "Reason separate electorates were criticised",
      value:
        "They institutionalised communal division by making religion the basis of representation",
    },
    {
      key: "Source of the 1935 Act in the present Constitution",
      value:
        "The federal scheme, office of Governor, judiciary, public service commissions and emergency provisions",
    },
  ],
);

mod(
  "mod:revolutionary",
  "The Revolutionary Movement and the Ghadar Party",
  "In the revolutionary movement, what is %s?",
  "%k is %v.",
  [
    {
      key: "Revolutionary who threw a bomb at Muzaffarpur in 1908",
      value: "Khudiram Bose, with Prafulla Chaki",
    },
    { key: "Case in which Aurobindo Ghosh was tried", value: "The Alipore bomb case" },
    { key: "Founder of the Abhinav Bharat society", value: "Vinayak Damodar Savarkar" },
    { key: "Year the Ghadar Party was founded", value: "1913, at San Francisco" },
    { key: "Founder president of the Ghadar Party", value: "Sohan Singh Bhakna" },
    { key: "Newspaper of the Ghadar Party", value: "The Ghadar" },
    {
      key: "Revolutionary hanged for the Kakori conspiracy",
      value: "Ram Prasad Bismil, with Ashfaqullah Khan and others",
    },
    { key: "Year of the Kakori train robbery", value: "1925" },
    {
      key: "Organisation founded by Chandrashekhar Azad and Bhagat Singh",
      value: "The Hindustan Socialist Republican Association",
    },
    { key: "Year Bhagat Singh was hanged", value: "1931, with Rajguru and Sukhdev" },
  ],
  [
    {
      key: "Komagata Maru incident",
      value:
        "The 1914 turning back of a ship of Indian passengers from Canada, which fed Ghadar sentiment",
    },
    {
      key: "Assembly bomb case of 1929",
      value:
        "Bhagat Singh and Batukeshwar Dutt threw a bomb in the Central Assembly to make the deaf hear",
    },
    { key: "Chittagong armoury raid", value: "The 1930 raid led by Surya Sen in Bengal" },
    {
      key: "Reason Bhagat Singh's trial mattered politically",
      value: "He used the court as a platform to spread socialist and anti-imperialist ideas",
    },
    {
      key: "Indian National Army",
      value: "The force organised by Rash Behari Bose and led by Subhas Chandra Bose from 1943",
    },
  ],
);

mod(
  "mod:gandhian-movements",
  "The Gandhian Mass Movements",
  "In the Gandhian phase of the freedom struggle, what is %s?",
  "%k is %v.",
  [
    { key: "Year Gandhi returned to India from South Africa", value: "1915" },
    {
      key: "Gandhi's first satyagraha in India",
      value: "Champaran, in 1917, for the indigo cultivators of Bihar",
    },
    {
      key: "Satyagraha for the mill workers of Ahmedabad",
      value: "The Ahmedabad mill strike of 1918",
    },
    {
      key: "Satyagraha in Kheda",
      value: "The 1918 campaign for remission of revenue in a year of crop failure",
    },
    {
      key: "Act against which the Rowlatt Satyagraha was launched",
      value: "The Rowlatt Act of 1919",
    },
    { key: "Date of the Jallianwala Bagh massacre", value: "The thirteenth of April 1919" },
    {
      key: "Officer responsible for the Jallianwala Bagh massacre",
      value: "General Reginald Dyer",
    },
    { key: "Year the Non-Cooperation Movement was launched", value: "1920" },
    {
      key: "Incident that led Gandhi to withdraw Non-Cooperation",
      value: "Chauri Chaura, in February 1922",
    },
    {
      key: "Act that began the Civil Disobedience Movement",
      value: "The Dandi march and the breaking of the salt law in 1930",
    },
  ],
  [
    {
      key: "Poorna Swaraj resolution",
      value: "The demand for complete independence adopted at the Lahore session of 1929",
    },
    {
      key: "Gandhi-Irwin Pact",
      value:
        "The 1931 agreement under which Gandhi suspended Civil Disobedience and attended the second Round Table Conference",
    },
    {
      key: "Poona Pact of 1932",
      value:
        "The agreement between Gandhi and Ambedkar replacing separate electorates for the depressed classes with reserved seats",
    },
    {
      key: "Slogan of the Quit India Movement",
      value: "Do or die, given by Gandhi in August 1942",
    },
    {
      key: "Cripps Mission",
      value:
        "The 1942 British offer of dominion status after the war, rejected as a post-dated cheque",
    },
  ],
);

mod(
  "mod:partition-integration",
  "Partition, Integration of States and Independence",
  "In the transfer of power, what is %s?",
  "%k is %v.",
  [
    { key: "Mission that proposed a three tier plan in 1946", value: "The Cabinet Mission" },
    { key: "Date of Direct Action Day", value: "The sixteenth of August 1946" },
    { key: "Last Viceroy of India", value: "Lord Mountbatten" },
    {
      key: "Plan under which India was partitioned",
      value: "The Mountbatten Plan of the third of June 1947",
    },
    { key: "Chairman of the boundary commission", value: "Sir Cyril Radcliffe" },
    { key: "Date of Indian independence", value: "The fifteenth of August 1947" },
    { key: "Minister who integrated the princely states", value: "Sardar Vallabhbhai Patel" },
    { key: "Secretary who assisted Patel in the integration", value: "V P Menon" },
    {
      key: "Instrument of Accession",
      value: "The document by which a princely state acceded to India or Pakistan",
    },
    {
      key: "State integrated by police action in 1948",
      value: "Hyderabad, through Operation Polo",
    },
  ],
  [
    {
      key: "Three options given to the princely states",
      value: "Accede to India, accede to Pakistan, or remain independent in theory",
    },
    {
      key: "Reason Junagadh acceded to India",
      value:
        "Its ruler acceded to Pakistan against the wishes of a Hindu majority population, and a plebiscite favoured India",
    },
    {
      key: "Circumstances of Kashmir's accession",
      value: "Maharaja Hari Singh acceded in October 1947 after a tribal invasion from Pakistan",
    },
    {
      key: "States Reorganisation Act",
      value: "The 1956 Act that redrew State boundaries on a linguistic basis",
    },
    {
      key: "Fazl Ali Commission",
      value: "The States Reorganisation Commission of 1953 whose report led to the 1956 Act",
    },
  ],
);

/* ========================================================= Art and Culture */

art(
  "cul:folk-tribal",
  "Folk Arts, Puppetry and Tribal Traditions",
  "In the folk arts of India, what is %s?",
  "%k is %v.",
  [
    { key: "Folk painting of Bihar", value: "Madhubani, or Mithila painting" },
    { key: "Folk painting of Maharashtra", value: "Warli painting" },
    { key: "Scroll painting of Odisha", value: "Pattachitra" },
    { key: "Folk painting of Andhra Pradesh on cloth", value: "Kalamkari" },
    { key: "Tribal wall art of Jharkhand", value: "Sohrai and Khovar painting" },
    { key: "String puppetry of Rajasthan", value: "Kathputli" },
    { key: "Shadow puppetry of Andhra Pradesh", value: "Tholu Bommalata" },
    { key: "Glove puppetry of Kerala", value: "Pavakathakali" },
    { key: "Folk theatre of Uttar Pradesh", value: "Nautanki" },
    { key: "Folk theatre of Maharashtra", value: "Tamasha" },
  ],
  [
    { key: "Folk theatre of Bengal", value: "Jatra" },
    { key: "Folk theatre of Gujarat", value: "Bhavai" },
    { key: "Ritual theatre of Kerala with elaborate make-up", value: "Theyyam" },
    {
      key: "Phad painting",
      value: "The Rajasthani scroll painting of the epics of Pabuji and Devnarayan, sung by Bhopas",
    },
    {
      key: "Gond art",
      value:
        "The tribal painting of Madhya Pradesh built from dots and lines depicting nature and myth",
    },
  ],
);

art(
  "cul:heritage-sites",
  "UNESCO World Heritage Sites of India",
  "Among India's World Heritage Sites, what is %s?",
  "%k is %v.",
  [
    {
      key: "First Indian sites inscribed by UNESCO in 1983",
      value: "Agra Fort, Ajanta caves, Ellora caves and the Taj Mahal",
    },
    { key: "World heritage site of Odisha", value: "The Sun temple at Konark" },
    {
      key: "World heritage site in Madhya Pradesh known for temples",
      value: "The Khajuraho group of monuments",
    },
    { key: "World heritage site of Karnataka with Vijayanagara ruins", value: "Hampi" },
    {
      key: "World heritage site in Tamil Nadu on the coast",
      value: "The group of monuments at Mahabalipuram",
    },
    { key: "Natural world heritage site of Assam", value: "Kaziranga National Park" },
    {
      key: "Natural world heritage site of Rajasthan",
      value: "Keoladeo National Park at Bharatpur",
    },
    {
      key: "Mountain railway inscribed as a world heritage site",
      value: "The Darjeeling Himalayan Railway, with Nilgiri and Kalka Shimla",
    },
    {
      key: "World heritage city of Gujarat",
      value: "Ahmedabad, India's first world heritage city",
    },
    {
      key: "Buddhist world heritage site in Madhya Pradesh",
      value: "The Buddhist monuments at Sanchi",
    },
  ],
  [
    {
      key: "Body that maintains the world heritage list",
      value: "UNESCO, through its World Heritage Committee",
    },
    {
      key: "Jantar Mantar inscribed as a world heritage site",
      value: "The observatory at Jaipur, built by Sawai Jai Singh the Second",
    },
    {
      key: "Mixed world heritage site of India",
      value: "Khangchendzonga National Park in Sikkim, listed for both natural and cultural value",
    },
    {
      key: "Rani ki Vav",
      value: "The eleventh century stepwell at Patan in Gujarat, inscribed in 2014",
    },
    { key: "Dholavira", value: "The Harappan city in the Rann of Kutch inscribed in 2021" },
  ],
);

art(
  "cul:music-gharanas",
  "Indian Music, Instruments and Gharanas",
  "In Indian music, what is %s?",
  "%k is %v.",
  [
    { key: "Two main systems of Indian classical music", value: "Hindustani and Carnatic" },
    { key: "Raga", value: "A melodic framework of notes on which a composition is built" },
    { key: "Tala", value: "The rhythmic cycle of Indian music" },
    { key: "Oldest Indian treatise on music and drama", value: "Bharata's Natyashastra" },
    { key: "Instrument played by Pandit Ravi Shankar", value: "The sitar" },
    { key: "Instrument played by Ustad Bismillah Khan", value: "The shehnai" },
    { key: "Instrument played by Pandit Hariprasad Chaurasia", value: "The flute, or bansuri" },
    { key: "Instrument played by Ustad Amjad Ali Khan", value: "The sarod" },
    { key: "Instrument played by Ustad Zakir Hussain", value: "The tabla" },
    { key: "Principal vocal form of Hindustani music", value: "Khayal" },
  ],
  [
    {
      key: "Four classes of Indian musical instruments",
      value: "Tata or string, Sushira or wind, Avanaddha or percussion, and Ghana or solid",
    },
    { key: "Dhrupad", value: "The oldest and most austere form of Hindustani vocal music" },
    {
      key: "Trinity of Carnatic music",
      value: "Tyagaraja, Muthuswami Dikshitar and Shyama Shastri",
    },
    { key: "Gwalior gharana", value: "The oldest khayal gharana of Hindustani music" },
    {
      key: "Thumri",
      value: "A light classical Hindustani form with a romantic or devotional text",
    },
  ],
);

art(
  "cul:fairs-festivals",
  "Fairs, Festivals and Regional Traditions",
  "Among Indian fairs and festivals, what is %s?",
  "%k is %v.",
  [
    { key: "Harvest festival of Punjab", value: "Baisakhi" },
    { key: "Harvest festival of Tamil Nadu", value: "Pongal" },
    { key: "Harvest festival of Assam", value: "Bihu" },
    { key: "Harvest festival of Kerala", value: "Onam" },
    { key: "Boat race festival of Kerala", value: "The Nehru Trophy boat race at Punnamada lake" },
    { key: "Camel fair of Rajasthan", value: "The Pushkar fair" },
    { key: "Largest religious gathering in the world", value: "The Kumbh Mela" },
    { key: "Four sites of the Kumbh Mela", value: "Prayagraj, Haridwar, Ujjain and Nashik" },
    { key: "Chariot festival of Puri", value: "The Rath Yatra of Lord Jagannath" },
    { key: "Festival of Ladakh with masked dances", value: "The Hemis festival" },
  ],
  [
    {
      key: "Hornbill festival",
      value: "The festival of Nagaland held in December, showcasing all its tribes",
    },
    {
      key: "Thrissur Pooram",
      value:
        "The temple festival of Kerala famous for caparisoned elephants and percussion ensembles",
    },
    {
      key: "Significance of Chhath Puja",
      value:
        "The worship of the setting and rising sun, chiefly in Bihar, Jharkhand and eastern Uttar Pradesh",
    },
    {
      key: "Losar",
      value: "The new year festival of the Tibetan Buddhist communities of the Himalaya",
    },
    {
      key: "Sonepur Mela",
      value: "The cattle fair of Bihar on Kartik Purnima, once Asia's largest",
    },
  ],
);

art(
  "cul:buddhist-jain-art",
  "Buddhist, Jain and Temple Art",
  "In the religious art of India, what is %s?",
  "%k is %v.",
  [
    { key: "Stupa", value: "A hemispherical Buddhist mound raised over relics" },
    { key: "Harmika", value: "The square railing at the top of a stupa" },
    {
      key: "Medhi",
      value: "The raised drum or base of a stupa that carries the circumambulatory path",
    },
    { key: "Chaitya", value: "A Buddhist prayer hall with a stupa at the apsidal end" },
    { key: "Vihara", value: "A Buddhist monastery with cells around a courtyard" },
    { key: "Cave site famous for Buddhist paintings", value: "Ajanta, in Maharashtra" },
    { key: "Cave site with Buddhist, Hindu and Jain caves together", value: "Ellora" },
    { key: "Jain pilgrimage hill of Gujarat", value: "Shatrunjaya at Palitana" },
    { key: "Jain colossus at Shravanabelagola", value: "The statue of Gomateshwara, or Bahubali" },
    {
      key: "Nagara and Dravida temple styles",
      value: "The north Indian curvilinear shikhara and the south Indian pyramidal vimana",
    },
  ],
  [
    {
      key: "Vesara style",
      value: "The hybrid temple style of the Deccan combining Nagara and Dravida features",
    },
    {
      key: "Panchayatana plan",
      value: "A temple plan with a main shrine and four subsidiary shrines at the corners",
    },
    {
      key: "Difference between the Gandhara and Mathura Buddha images",
      value:
        "Gandhara shows Greco-Roman realism in grey schist, Mathura an indigenous fuller form in red sandstone",
    },
    {
      key: "Mudra of the Buddha showing the first sermon",
      value: "The Dharmachakra pravartana mudra",
    },
    {
      key: "Dilwara temples",
      value: "The Jain marble temples at Mount Abu, famous for their carved ceilings",
    },
  ],
);

art(
  "cul:cinema-martial",
  "Indian Cinema, Theatre Forms and Martial Arts",
  "In Indian performing arts, what is %s?",
  "%k is %v.",
  [
    {
      key: "First Indian feature film",
      value: "Raja Harishchandra, made by Dadasaheb Phalke in 1913",
    },
    { key: "Father of Indian cinema", value: "Dadasaheb Phalke" },
    { key: "Highest award in Indian cinema", value: "The Dadasaheb Phalke Award" },
    { key: "Director of the Apu trilogy", value: "Satyajit Ray" },
    { key: "Sanskrit drama by Kalidasa on Shakuntala", value: "Abhijnanashakuntalam" },
    { key: "Martial art of Kerala", value: "Kalaripayattu" },
    { key: "Martial art of Punjab", value: "Gatka" },
    { key: "Martial art of Manipur", value: "Thang-Ta" },
    { key: "Martial art of Tamil Nadu with a staff", value: "Silambam" },
    { key: "Martial art of Maharashtra", value: "Mardani Khel" },
  ],
  [
    {
      key: "Oldest surviving Sanskrit theatre tradition",
      value: "Kutiyattam of Kerala, recognised by UNESCO",
    },
    {
      key: "Mallakhamb",
      value: "The Maharashtrian sport of gymnastics performed on a vertical pole or rope",
    },
    {
      key: "Indian film to win the Academy Award for best foreign language film nomination first",
      value: "Mother India, nominated in 1958",
    },
    {
      key: "Parallel cinema movement",
      value:
        "The realist Indian film movement of the 1950s to 1970s, led by Ray, Ghatak and Benegal",
    },
    {
      key: "Thang-Ta and Sarit Sarak",
      value: "The armed and unarmed forms of the Manipuri martial tradition",
    },
  ],
);

export const HISTORY_FULL2_TEMPLATES = templates;
