/**
 * Indian History — Ancient, Medieval, Modern and Art and Culture.
 *
 * History used to sit inside a single "Indian History" chapter of General
 * Awareness. Every exam that matters sets it as a full section, so it is
 * broken out here into four real subjects with their own chapters, the way
 * UPSC, State PSC, SSC, railways and the Punjab cadres actually examine it.
 */

import { type Template } from "./core";
import { GK_WIDE, chapterFactory } from "./two-layer";

const templates: Template[] = [];

const ancient = chapterFactory(templates, "Ancient History", GK_WIDE);
const medieval = chapterFactory(templates, "Medieval History", GK_WIDE);
const modern = chapterFactory(templates, "Modern History", GK_WIDE);
const culture = chapterFactory(templates, "Art and Culture", GK_WIDE);

/* ------------------------------------------------------ Ancient History */

ancient(
  "hist:anc:indus",
  "Indus Valley Civilisation",
  "In the Indus Valley Civilisation, what is %s?",
  "%k is %v.",
  [
    { key: "Harappa", value: "The first site excavated, in 1921, on the Ravi in Punjab" },
    { key: "Mohenjodaro", value: "The Sindh site on the Indus, famous for the Great Bath" },
    { key: "Dholavira", value: "The Gujarat site known for its water reservoirs and signboard" },
    { key: "Lothal", value: "The Gujarat site with the world's earliest known dockyard" },
    { key: "Kalibangan", value: "The Rajasthan site where ploughed fields were found" },
    {
      key: "Great Bath",
      value: "The large watertight tank at Mohenjodaro, probably for ritual bathing",
    },
    { key: "Chief crop of the civilisation", value: "Wheat and barley" },
    { key: "Metal unknown to the Harappans", value: "Iron" },
    { key: "Town planning feature", value: "A grid pattern with a citadel and a lower town" },
    { key: "Script of the civilisation", value: "Pictographic and still undeciphered" },
  ],
  [
    { key: "Banawali", value: "The Haryana site showing both pre-Harappan and Harappan phases" },
    { key: "Rakhigarhi", value: "The largest Harappan site in India, in Haryana" },
    { key: "Surkotada", value: "The Gujarat site where horse bones were reported" },
    { key: "Chanhudaro", value: "The only Harappan city without a citadel, known for bead making" },
    {
      key: "Probable cause of decline",
      value: "A combination of climate change, river shifts and declining trade",
    },
  ],
);

ancient(
  "hist:anc:vedic",
  "Vedic Period",
  "In the Vedic period, what is %s?",
  "%k is %v.",
  [
    { key: "Rigveda", value: "The oldest Veda, a collection of hymns to the gods" },
    { key: "Samaveda", value: "The Veda of melodies, the root of Indian music" },
    { key: "Yajurveda", value: "The Veda of sacrificial formulae" },
    { key: "Atharvaveda", value: "The Veda of charms and spells" },
    { key: "Gayatri Mantra", value: "A hymn to Savitr in the third mandala of the Rigveda" },
    { key: "Sabha and Samiti", value: "The two tribal assemblies of the early Vedic age" },
    { key: "Chief deity of the Rigveda", value: "Indra, to whom the most hymns are addressed" },
    {
      key: "Varna system",
      value: "The fourfold division into Brahmana, Kshatriya, Vaishya and Shudra",
    },
    { key: "Satapatha Brahmana", value: "A prose commentary attached to the Yajurveda" },
    { key: "Upanishads", value: "The philosophical texts at the close of the Vedic corpus" },
  ],
  [
    { key: "Purusha Sukta", value: "The tenth mandala hymn that first describes the four varnas" },
    { key: "Dasarajna", value: "The battle of ten kings on the Parushni, in the Rigveda" },
    {
      key: "Later Vedic political change",
      value: "Tribal chiefship gave way to territorial kingship and janapadas",
    },
    { key: "Satyameva Jayate source", value: "The Mundaka Upanishad" },
    {
      key: "Aranyakas",
      value: "The forest texts linking the ritual Brahmanas to the philosophical Upanishads",
    },
  ],
);

ancient(
  "hist:anc:religions",
  "Buddhism, Jainism and the Mahajanapadas",
  "On Buddhism, Jainism and the Mahajanapadas, what is %s?",
  "%k is %v.",
  [
    { key: "Number of Mahajanapadas", value: "Sixteen, listed in the Anguttara Nikaya" },
    { key: "Most powerful Mahajanapada", value: "Magadha, which absorbed the rest" },
    { key: "Gautama Buddha's birthplace", value: "Lumbini, in present-day Nepal" },
    { key: "Place of Buddha's enlightenment", value: "Bodh Gaya, under the Bodhi tree" },
    { key: "Place of the first sermon", value: "Sarnath, near Varanasi" },
    { key: "Buddha's death place", value: "Kushinagar" },
    {
      key: "Four Noble Truths",
      value: "The core Buddhist teaching on suffering and its cessation",
    },
    { key: "Mahavira", value: "The twenty fourth Tirthankara of Jainism" },
    { key: "Triratna of Jainism", value: "Right faith, right knowledge and right conduct" },
    { key: "Jain sects", value: "Digambara and Svetambara" },
  ],
  [
    {
      key: "First Buddhist Council",
      value: "Held at Rajgriha under Ajatashatru, soon after the Buddha's death",
    },
    {
      key: "Fourth Buddhist Council",
      value: "Held in Kashmir under Kanishka, where the schism into Hinayana and Mahayana hardened",
    },
    { key: "First Jain Council", value: "Held at Pataliputra under Chandragupta Maurya" },
    { key: "Language of early Buddhist texts", value: "Pali" },
    { key: "Tripitaka", value: "The three baskets: Vinaya, Sutta and Abhidhamma" },
  ],
);

ancient(
  "hist:anc:mauryan",
  "Mauryan and Post-Mauryan Empires",
  "In the Mauryan and post-Mauryan period, what is %s?",
  "%k is %v.",
  [
    { key: "Founder of the Mauryan empire", value: "Chandragupta Maurya, in 322 BCE" },
    { key: "Chanakya", value: "Chandragupta's mentor, author of the Arthashastra" },
    { key: "Ashoka's Kalinga war", value: "Fought in 261 BCE, after which he embraced Buddhism" },
    { key: "Ashoka's edicts language", value: "Mostly Prakrit in Brahmi script" },
    { key: "Who deciphered Brahmi", value: "James Prinsep, in 1837" },
    { key: "Megasthenes", value: "The Greek ambassador who wrote Indica" },
    { key: "Last Mauryan ruler", value: "Brihadratha, killed by Pushyamitra Sunga" },
    { key: "Kanishka", value: "The greatest Kushana ruler, patron of Mahayana Buddhism" },
    { key: "Satavahana capital", value: "Pratishthana, on the Godavari" },
    { key: "Sangam literature", value: "The earliest Tamil literature, of the three Sangams" },
  ],
  [
    {
      key: "Ashoka's Dhamma",
      value: "A moral code of tolerance, non-violence and duty, not a separate religion",
    },
    { key: "Rock Edict XIII", value: "The edict describing the remorse after the Kalinga war" },
    { key: "Saka era", value: "Started in 78 CE, generally credited to Kanishka" },
    {
      key: "Charaka and Sushruta",
      value: "Physicians associated with the Kushana court and Indian medicine",
    },
    {
      key: "Junagadh inscription of Rudradaman",
      value: "The earliest long inscription in chaste Sanskrit, of about 150 CE",
    },
  ],
);

ancient(
  "hist:anc:gupta",
  "Gupta and Post-Gupta India",
  "In the Gupta and post-Gupta period, what is %s?",
  "%k is %v.",
  [
    {
      key: "Founder of the Gupta dynasty",
      value: "Sri Gupta, though Chandragupta I began its rise",
    },
    { key: "Samudragupta", value: "Called the Indian Napoleon for his conquests" },
    {
      key: "Allahabad Pillar inscription",
      value: "Composed by Harisena in praise of Samudragupta",
    },
    { key: "Chandragupta II", value: "Vikramaditya, in whose court the Navaratnas served" },
    { key: "Fa-Hien", value: "The Chinese pilgrim who visited during Chandragupta II's reign" },
    { key: "Aryabhata", value: "The Gupta-age astronomer who wrote the Aryabhatiya" },
    { key: "Kalidasa", value: "The Sanskrit poet and dramatist of the Gupta court" },
    { key: "Nalanda", value: "The great Buddhist university of Bihar, patronised by the Guptas" },
    { key: "Harshavardhana", value: "The seventh century ruler of Kanauj" },
    { key: "Hiuen Tsang", value: "The Chinese pilgrim who visited Harsha's court" },
  ],
  [
    {
      key: "Why the Gupta age is called the golden age",
      value:
        "Peak achievement in mathematics, astronomy, literature, sculpture and temple architecture together",
    },
    {
      key: "Mehrauli iron pillar",
      value: "The rust-resistant pillar in Delhi, attributed to Chandra, probably Chandragupta II",
    },
    { key: "Gupta land grant term", value: "Agrahara, a tax-free grant to Brahmanas" },
    {
      key: "Cause of Gupta decline",
      value: "Huna invasions, feudal fragmentation and declining trade",
    },
    {
      key: "Tripartite struggle",
      value: "The contest for Kanauj between the Palas, Pratiharas and Rashtrakutas",
    },
  ],
);

/* ----------------------------------------------------- Medieval History */

medieval(
  "hist:med:sultanate",
  "Delhi Sultanate",
  "In the Delhi Sultanate, what is %s?",
  "%k is %v.",
  [
    { key: "First Battle of Tarain", value: "Fought in 1191, won by Prithviraj Chauhan" },
    { key: "Second Battle of Tarain", value: "Fought in 1192, won by Muhammad Ghori" },
    { key: "Founder of the Slave dynasty", value: "Qutb-ud-din Aibak, in 1206" },
    {
      key: "Iltutmish",
      value: "The real consolidator of the Sultanate, who introduced the tanka and jital",
    },
    { key: "Razia Sultan", value: "The only woman to sit on the throne of Delhi" },
    { key: "Balban", value: "The Sultan who asserted the theory of kingship as the shadow of God" },
    { key: "Alauddin Khalji", value: "The Sultan who imposed market control and price regulation" },
    {
      key: "Muhammad bin Tughlaq",
      value: "Remembered for the token currency and the transfer of capital to Daulatabad",
    },
    {
      key: "Firoz Shah Tughlaq",
      value: "Known for canals, the jizya on Brahmanas and public works",
    },
    { key: "Last Lodi ruler", value: "Ibrahim Lodi, defeated at Panipat in 1526" },
  ],
  [
    { key: "Iqta system", value: "Assignment of revenue from land in lieu of salary to officers" },
    { key: "Diwan-i-Arz", value: "The military department, organised by Balban" },
    { key: "Chehra and dagh", value: "Alauddin's descriptive roll and horse branding system" },
    { key: "Amir Khusrau", value: "The poet of the Sultanate court, called the parrot of India" },
    { key: "Timur's invasion", value: "The 1398 sack of Delhi that broke Tughlaq power" },
  ],
);

medieval(
  "hist:med:mughal",
  "Mughal Empire",
  "In the Mughal empire, what is %s?",
  "%k is %v.",
  [
    { key: "First Battle of Panipat", value: "Fought in 1526, where Babur defeated Ibrahim Lodi" },
    {
      key: "Second Battle of Panipat",
      value: "Fought in 1556, where Akbar's forces defeated Hemu",
    },
    { key: "Battle of Khanwa", value: "Fought in 1527, where Babur defeated Rana Sanga" },
    {
      key: "Sher Shah Suri",
      value: "The Afghan who ousted Humayun and reformed revenue and roads",
    },
    { key: "Din-i-Ilahi", value: "Akbar's syncretic order, proclaimed in 1582" },
    { key: "Mansabdari system", value: "Akbar's ranking system fixing zat and sawar" },
    { key: "Todar Mal", value: "Akbar's revenue minister, author of the zabti system" },
    { key: "Jahangir", value: "The emperor who received Sir Thomas Roe" },
    { key: "Shah Jahan", value: "The builder of the Taj Mahal and the Peacock Throne" },
    { key: "Aurangzeb", value: "The last powerful Mughal, who reimposed the jizya in 1679" },
  ],
  [
    {
      key: "Zabti or Dahsala system",
      value: "Revenue fixed on a ten-year average of produce and prices",
    },
    {
      key: "Battle of Haldighati",
      value: "Fought in 1576 between Akbar's forces and Maharana Pratap",
    },
    { key: "Ain-i-Akbari", value: "Abul Fazl's detailed account of Akbar's administration" },
    {
      key: "Jagirdari crisis",
      value: "The late Mughal shortage of assignable land against the number of mansabdars",
    },
    {
      key: "Battle of Plassey significance for the Mughals",
      value: "It marked the effective end of Mughal authority in Bengal in 1757",
    },
  ],
);

medieval(
  "hist:med:regional",
  "Vijayanagara, Bahmani, Marathas and Bhakti",
  "In regional medieval India, what is %s?",
  "%k is %v.",
  [
    { key: "Founders of Vijayanagara", value: "Harihara and Bukka, in 1336" },
    { key: "Krishnadevaraya", value: "The greatest Vijayanagara ruler, author of Amuktamalyada" },
    { key: "Battle of Talikota", value: "Fought in 1565, which broke Vijayanagara" },
    { key: "Bahmani founder", value: "Alauddin Bahman Shah, in 1347" },
    { key: "Mahmud Gawan", value: "The Bahmani minister who reformed the administration" },
    { key: "Shivaji's coronation", value: "Held at Raigad in 1674" },
    { key: "Chauth", value: "The Maratha levy of one fourth of the revenue" },
    { key: "Sardeshmukhi", value: "An additional Maratha levy of one tenth" },
    { key: "Kabir", value: "The Bhakti saint whose verses appear in the Guru Granth Sahib" },
    { key: "Guru Nanak", value: "The founder of Sikhism, born in 1469 at Talwandi" },
  ],
  [
    { key: "Ashtapradhan", value: "Shivaji's council of eight ministers" },
    {
      key: "Third Battle of Panipat",
      value: "Fought in 1761, where Ahmad Shah Abdali defeated the Marathas",
    },
    { key: "Amuktamalyada language", value: "Telugu, written by Krishnadevaraya" },
    {
      key: "Chaitanya Mahaprabhu",
      value: "The Bengal Vaishnava saint of the Krishna bhakti movement",
    },
    {
      key: "Sufi silsila most popular in India",
      value: "The Chishti order, of Moinuddin Chishti and Nizamuddin Auliya",
    },
  ],
);

/* ------------------------------------------------------- Modern History */

modern(
  "hist:mod:company",
  "Advent of Europeans and Company Rule",
  "In the period of Company rule, what is %s?",
  "%k is %v.",
  [
    { key: "First European to reach India by sea", value: "Vasco da Gama, at Calicut in 1498" },
    { key: "English East India Company charter", value: "Granted by Elizabeth I in 1600" },
    { key: "Battle of Plassey", value: "Fought in 1757, won by Clive over Siraj-ud-Daulah" },
    { key: "Battle of Buxar", value: "Fought in 1764, after which the Company gained the Diwani" },
    { key: "Diwani of Bengal", value: "Granted in 1765, giving the Company revenue rights" },
    {
      key: "Regulating Act",
      value: "Passed in 1773, the first British attempt to control the Company",
    },
    { key: "Permanent Settlement", value: "Introduced by Cornwallis in 1793 in Bengal" },
    {
      key: "Ryotwari system",
      value: "Revenue settled directly with the cultivator, in Madras and Bombay",
    },
    {
      key: "Mahalwari system",
      value: "Revenue settled with the village community, in the north-west",
    },
    {
      key: "Doctrine of Lapse",
      value: "Dalhousie's policy of annexing states without a natural heir",
    },
  ],
  [
    { key: "Subsidiary Alliance author", value: "Lord Wellesley, from 1798" },
    { key: "Pitt's India Act", value: "Passed in 1784, it created the Board of Control" },
    {
      key: "Charter Act of 1813",
      value: "It ended the Company's Indian trade monopoly except in tea and China",
    },
    {
      key: "Charter Act of 1833",
      value: "It made the Governor General of Bengal the Governor General of India",
    },
    {
      key: "Drain of wealth theory",
      value: "Advanced by Dadabhai Naoroji in Poverty and Un-British Rule in India",
    },
  ],
);

modern(
  "hist:mod:1857-reform",
  "Revolt of 1857 and Social Reform",
  "On 1857 and the reform movements, what is %s?",
  "%k is %v.",
  [
    {
      key: "Immediate cause of the 1857 revolt",
      value: "The greased cartridge of the Enfield rifle",
    },
    { key: "Where the revolt began", value: "Meerut, on 10 May 1857" },
    {
      key: "Mangal Pandey",
      value: "The sepoy of Barrackpore who struck the first blow in March 1857",
    },
    { key: "Symbolic leader of the revolt", value: "Bahadur Shah Zafar" },
    { key: "Rani Lakshmibai", value: "The leader of the revolt at Jhansi" },
    {
      key: "Result of the revolt",
      value: "The Crown took over from the Company by the Act of 1858",
    },
    {
      key: "Raja Ram Mohan Roy",
      value: "Founder of the Brahmo Samaj, who campaigned against sati",
    },
    { key: "Year sati was abolished", value: "1829, under Lord William Bentinck" },
    {
      key: "Ishwar Chandra Vidyasagar",
      value: "The reformer behind the Widow Remarriage Act of 1856",
    },
    { key: "Dayanand Saraswati", value: "Founder of the Arya Samaj in 1875" },
  ],
  [
    {
      key: "Why 1857 failed",
      value:
        "No common leadership or programme, limited geographic spread and superior British organisation",
    },
    {
      key: "Queen's Proclamation",
      value: "Issued in 1858, promising non-interference in religion and equal treatment",
    },
    { key: "Young Bengal movement", value: "Led by Henry Vivian Derozio at Hindu College" },
    { key: "Prarthana Samaj", value: "Founded in Bombay in 1867, associated with M G Ranade" },
    { key: "Satyashodhak Samaj", value: "Founded by Jyotiba Phule in 1873 for the lower castes" },
  ],
);

modern(
  "hist:mod:national-movement",
  "Indian National Movement",
  "In the Indian national movement, what is %s?",
  "%k is %v.",
  [
    { key: "Founding of the Indian National Congress", value: "1885, by A O Hume" },
    { key: "First President of the Congress", value: "Womesh Chandra Bonnerjee" },
    { key: "Partition of Bengal", value: "Carried out by Curzon in 1905 and annulled in 1911" },
    {
      key: "Surat Split",
      value: "The 1907 division of the Congress into moderates and extremists",
    },
    { key: "Lucknow Pact", value: "The 1916 Congress-League agreement" },
    { key: "Champaran Satyagraha", value: "Gandhi's first Indian satyagraha, in 1917" },
    { key: "Khilafat Movement", value: "Launched in 1919 in support of the Ottoman Caliph" },
    { key: "Simon Commission", value: "The 1927 all-British commission boycotted across India" },
    { key: "Purna Swaraj resolution", value: "Adopted at the Lahore session in 1929" },
    { key: "Quit India Movement", value: "Launched on 8 August 1942 with the call Do or Die" },
  ],
  [
    {
      key: "Gandhi-Irwin Pact",
      value: "Signed in March 1931, ending the first Civil Disobedience phase",
    },
    {
      key: "Communal Award",
      value:
        "Announced by Ramsay MacDonald in 1932, giving separate electorates to depressed classes",
    },
    { key: "Cabinet Mission", value: "The 1946 mission proposing a three-tier federal grouping" },
    {
      key: "Indian National Army founder",
      value: "Rash Behari Bose, later led by Subhas Chandra Bose",
    },
    { key: "Mountbatten Plan", value: "The 3 June 1947 plan for partition and transfer of power" },
  ],
);

/* -------------------------------------------------------- Art & Culture */

culture(
  "hist:cul:architecture",
  "Indian Architecture and Sculpture",
  "In Indian architecture and sculpture, what is %s?",
  "%k is %v.",
  [
    { key: "Nagara style", value: "The north Indian temple style with a curvilinear shikhara" },
    {
      key: "Dravida style",
      value: "The south Indian temple style with a pyramidal vimana and gopuram",
    },
    { key: "Vesara style", value: "The hybrid Deccan style combining Nagara and Dravida" },
    { key: "Khajuraho temples", value: "Chandela temples in Madhya Pradesh, in Nagara style" },
    { key: "Brihadeeswarar Temple", value: "The Chola temple at Thanjavur, built by Rajaraja I" },
    {
      key: "Konark Sun Temple",
      value: "The thirteenth century Odisha temple shaped like a chariot",
    },
    { key: "Ajanta caves", value: "Buddhist caves in Maharashtra famous for mural paintings" },
    { key: "Ellora caves", value: "Caves of three faiths, including the rock-cut Kailasa temple" },
    { key: "Sanchi Stupa", value: "The Mauryan-age Buddhist stupa in Madhya Pradesh" },
    {
      key: "Indo-Islamic charbagh",
      value: "The four-part garden layout used at Humayun's Tomb and the Taj",
    },
  ],
  [
    {
      key: "Gandhara school",
      value: "Greco-Buddhist sculpture in grey schist, with realistic drapery",
    },
    {
      key: "Mathura school",
      value: "Indigenous sculpture in red sandstone, with a fuller, spiritual form",
    },
    {
      key: "Amaravati school",
      value: "The Andhra school in white marble, known for narrative panels",
    },
    {
      key: "Hoysala temples",
      value: "Star-shaped plan and soapstone carving, at Belur and Halebidu",
    },
    {
      key: "Dilwara temples",
      value: "The Jain marble temples at Mount Abu, famous for ceiling work",
    },
  ],
);

culture(
  "hist:cul:performing",
  "Dance, Music and Festivals",
  "In Indian performing arts, what is %s?",
  "%k is %v.",
  [
    { key: "Bharatanatyam", value: "The classical dance of Tamil Nadu" },
    { key: "Kathak", value: "The classical dance of north India, known for footwork and spins" },
    { key: "Kathakali", value: "The classical dance-drama of Kerala with elaborate make-up" },
    { key: "Odissi", value: "The classical dance of Odisha, based on temple sculpture" },
    { key: "Kuchipudi", value: "The classical dance-drama of Andhra Pradesh" },
    { key: "Manipuri", value: "The classical dance of Manipur, gentle and devotional" },
    { key: "Mohiniyattam", value: "The classical solo dance of Kerala" },
    { key: "Sattriya", value: "The classical dance of Assam, from Vaishnava monasteries" },
    { key: "Bhangra and Giddha", value: "The folk dances of Punjab" },
    { key: "Natya Shastra", value: "Bharata's treatise, the foundation of Indian performing arts" },
  ],
  [
    {
      key: "Hindustani versus Carnatic",
      value:
        "Hindustani is north Indian with Persian influence; Carnatic is south Indian and more composition-led",
    },
    { key: "Dhrupad", value: "The oldest surviving form of Hindustani vocal music" },
    {
      key: "Thyagaraja, Muthuswami Dikshitar and Syama Sastri",
      value: "The trinity of Carnatic music",
    },
    { key: "Yakshagana", value: "The folk theatre of coastal Karnataka" },
    {
      key: "Number of recognised classical dance forms",
      value: "Eight, as recognised by the Sangeet Natak Akademi",
    },
  ],
);

export const HISTORY_TEMPLATES = templates;
