/**
 * Punjab Master Cadre Music.
 *
 * Source: Education Recruitment Board, Punjab — public notice on the Master
 * Cadre syllabus, which publishes one syllabus per subject for exactly eight
 * subjects: DPE, English, Hindi, Maths, Punjabi, Science, Social Science and
 * **Music**. The 4161-post advertisement carried 25 Music vacancies and 168
 * Physical Education vacancies alongside Maths 912, Science 859, English 790,
 * Social Science 633, Punjabi 534 and Hindi 240.
 *
 * Paper: 150 objective questions, 150 marks, 150 minutes, computer based,
 * bilingual, one mark per question and no negative marking. A candidate sits
 * the paper of the one subject applied for.
 *
 * Music is also an option for the Paper II subject section of PSTET, which
 * publishes a separate Music answer key alongside Science & Maths, Social
 * Studies and Art & Craft.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const MUSIC = ["Punjab Master Cadre", "PSTET", "PSTET/CTET", "Punjab Lecturer Cadre"];

const templates: Template[] = [];
const mus = chapterFactory(templates, "Music", MUSIC);

mus(
  "mc:swara-saptak",
  "Swara, Saptak and the Basics of Naad",
  "In the fundamentals of Indian music, what is %s?",
  "%k is %v.",
  [
    { key: "Naad", value: "Musical sound that is regular, pleasant and measurable" },
    {
      key: "Number of swaras in the Indian saptak",
      value: "Seven, called Sa, Re, Ga, Ma, Pa, Dha and Ni",
    },
    {
      key: "Full names of the seven swaras",
      value: "Shadaj, Rishabh, Gandhar, Madhyam, Pancham, Dhaivat and Nishad",
    },
    { key: "Achal swaras", value: "Shadaj and Pancham, which do not change their pitch" },
    {
      key: "Vikrit swaras",
      value: "The five swaras that can be komal or teevra, namely Re, Ga, Ma, Dha and Ni",
    },
    { key: "Swara that can only be teevra", value: "Madhyam" },
    { key: "Three saptaks used in performance", value: "Mandra, Madhya and Taar" },
    {
      key: "Shruti",
      value:
        "The smallest perceptible interval of pitch, of which there are twenty two in the octave",
    },
    {
      key: "Komal swara",
      value: "A swara sounded lower than its natural pitch, marked with a line below it",
    },
    {
      key: "Teevra swara",
      value: "Madhyam sounded higher than its natural pitch, marked with a vertical line above it",
    },
  ],
  [
    {
      key: "Relation between the twenty two shrutis and the twelve swaras",
      value:
        "The twenty two shrutis are the micro-intervals of the octave, and the twelve swaras of practical music are selected from them, four each on Sa and Pa in the classical reckoning",
    },
    {
      key: "Difference between naad and mere sound",
      value:
        "Naad has a regular periodic vibration and a definite pitch, while ordinary noise is irregular and has no fixed pitch",
    },
    {
      key: "Three characteristics of naad",
      value:
        "Pitch or ucchata, intensity or teevrata, and timbre or jati, the last being what distinguishes two instruments sounding the same note",
    },
    {
      key: "Meaning of the shuddha saptak",
      value:
        "The scale of the seven natural swaras, which in the Bhatkhande system corresponds to Raga Bilawal",
    },
    {
      key: "Way the saptaks are written in notation",
      value:
        "A dot below the swara marks the mandra saptak, no dot marks the madhya, and a dot above marks the taar saptak",
    },
  ],
);

mus(
  "mc:raga-structure",
  "Raga: Definition, Jati and Classification",
  "In raga theory, what is %s?",
  "%k is %v.",
  [
    {
      key: "Raga",
      value:
        "A melodic framework of at least five swaras, pleasing to the ear, with a fixed ascent and descent",
    },
    { key: "Aaroha", value: "The ascending order of swaras in a raga" },
    { key: "Avaroha", value: "The descending order of swaras in a raga" },
    { key: "Pakad", value: "The characteristic phrase by which a raga is recognised" },
    { key: "Vadi swara", value: "The most prominent swara of a raga, its sonant" },
    { key: "Samvadi swara", value: "The second most prominent swara, consonant with the vadi" },
    { key: "Vivadi swara", value: "A dissonant swara, normally avoided in the raga" },
    { key: "Anuvadi swara", value: "The remaining assonant swaras of the raga" },
    { key: "Audav jati", value: "A raga that uses five swaras" },
    { key: "Sampurna jati", value: "A raga that uses all seven swaras" },
  ],
  [
    {
      key: "Three jatis of raga by number of swaras",
      value:
        "Audav with five, Shadav with six and Sampurna with seven, and a raga may take different jatis in ascent and descent",
    },
    {
      key: "Minimum requirements for a melody to be called a raga",
      value:
        "At least five swaras, Shadaj must be present, both Madhyam and Pancham cannot be omitted together, and the shuddha and vikrit form of one swara cannot be used side by side in the same phrase",
    },
    {
      key: "Relation between vadi and samvadi",
      value:
        "They usually stand at an interval of a fourth or a fifth, so nine or thirteen shrutis apart",
    },
    {
      key: "Thaat in the Bhatkhande system",
      value:
        "A parent scale of seven swaras in ascending order from which ragas are derived, and there are ten such thaats",
    },
    {
      key: "Ten thaats of the Bhatkhande system",
      value: "Bilawal, Kalyan, Khamaj, Bhairav, Poorvi, Marwa, Kafi, Asavari, Bhairavi and Todi",
    },
  ],
);

mus(
  "mc:taal-laya",
  "Taal, Laya and the Rhythm System",
  "In the rhythm system of Indian music, what is %s?",
  "%k is %v.",
  [
    { key: "Taal", value: "The cyclic arrangement of beats that measures musical time" },
    { key: "Matra", value: "A single beat, the unit of measure of a taal" },
    { key: "Sam", value: "The first and most emphatic beat of a taal cycle" },
    {
      key: "Khali",
      value: "The empty beat of a taal, shown by a wave of the hand and marked zero",
    },
    { key: "Taali", value: "A beat marked by a clap in the counting of a taal" },
    { key: "Vibhag", value: "A section or division of a taal cycle" },
    { key: "Number of matras in Teentaal", value: "Sixteen, in four vibhags of four" },
    { key: "Number of matras in Ektaal", value: "Twelve, in six vibhags of two" },
    {
      key: "Number of matras in Jhaptaal",
      value: "Ten, in four vibhags of two, three, two and three",
    },
    { key: "Number of matras in Dadra", value: "Six, in two vibhags of three" },
  ],
  [
    {
      key: "Three layas of Indian music",
      value:
        "Vilambit or slow, Madhya or medium and Drut or fast, the medium being twice the slow and the fast twice the medium",
    },
    {
      key: "Difference between taal and laya",
      value:
        "Taal is the fixed cycle of beats and its pattern of claps and waves, laya is the speed at which that cycle moves",
    },
    {
      key: "Theka",
      value: "The standard pattern of bols that identifies a taal on the tabla or pakhawaj",
    },
    {
      key: "Tihai",
      value:
        "A rhythmic phrase played three times in succession so that its last stroke lands on the sam",
    },
    {
      key: "Structure of Teentaal in claps and waves",
      value:
        "Clap on beat one, clap on five, wave on nine and clap on thirteen, so three claps and one khali give the name",
    },
  ],
);

mus(
  "mc:vocal-forms",
  "Vocal Forms: Khayal, Dhrupad and Light Genres",
  "In the vocal forms of Indian music, what is %s?",
  "%k is %v.",
  [
    {
      key: "Dhrupad",
      value: "The oldest surviving classical vocal form, grave in mood and sung in four sections",
    },
    { key: "Four sections of a dhrupad", value: "Sthayi, Antara, Sanchari and Abhog" },
    {
      key: "Khayal",
      value:
        "The principal classical vocal form today, freer than dhrupad and sung in two sections",
    },
    { key: "Two sections of a khayal", value: "Sthayi and Antara" },
    { key: "Bada khayal", value: "The slow khayal, sung in vilambit laya" },
    { key: "Chhota khayal", value: "The fast khayal, sung in drut laya" },
    { key: "Thumri", value: "A semi-classical romantic form with a free treatment of the raga" },
    {
      key: "Tarana",
      value:
        "A fast composition using rhythmic syllables such as ta, na, dir and tom in place of words",
    },
    { key: "Alaap", value: "The unmetered opening exposition in which the raga is unfolded" },
    { key: "Taan", value: "A fast melodic run of swaras used to elaborate the raga" },
  ],
  [
    {
      key: "Chief difference between dhrupad and khayal",
      value:
        "Dhrupad is austere, keeps to the composition and uses pakhawaj, while khayal allows extensive improvisation with taans and is accompanied by tabla",
    },
    { key: "Four banis of dhrupad", value: "Gauhar, Dagar, Khandar and Nauhar" },
    {
      key: "Gharana",
      value:
        "A lineage or school of performance with its own style, repertoire and teaching tradition, such as Gwalior, Agra, Kirana, Jaipur and Patiala",
    },
    { key: "Gharana regarded as the oldest of khayal", value: "Gwalior" },
    {
      key: "Difference between bandish and alaap",
      value:
        "Bandish is the fixed composition set to a taal, alaap is the free improvisatory exposition of the raga outside the rhythmic cycle",
    },
  ],
);

mus(
  "mc:instruments",
  "Musical Instruments and their Classification",
  "In the classification of musical instruments, what is %s?",
  "%k is %v.",
  [
    { key: "Four classes of Indian musical instruments", value: "Tat, Sushir, Avanaddh and Ghan" },
    { key: "Tat vadya", value: "Stringed instruments, such as the sitar, sarod, veena and violin" },
    { key: "Sushir vadya", value: "Wind instruments, such as the flute, shehnai and harmonium" },
    {
      key: "Avanaddh vadya",
      value: "Membrane or percussion instruments, such as the tabla, pakhawaj and mridangam",
    },
    {
      key: "Ghan vadya",
      value: "Solid struck instruments, such as the manjira, ghatam and jaltarang",
    },
    { key: "Instrument that accompanies dhrupad", value: "The pakhawaj" },
    { key: "Instrument that accompanies khayal", value: "The tabla" },
    { key: "Drone instrument of Indian music", value: "The tanpura" },
    { key: "Instrument associated with Pandit Ravi Shankar", value: "The sitar" },
    { key: "Instrument associated with Ustad Bismillah Khan", value: "The shehnai" },
  ],
  [
    {
      key: "Reason the tanpura is essential in a performance",
      value:
        "It holds the drone of the tonic and its consonant, so the singer keeps a constant reference for pitch throughout the raga",
    },
    {
      key: "Parts of the tabla",
      value:
        "The right hand dayan of wood and the left hand bayan of metal, each with a syahi paste patch that gives the definite pitch",
    },
    {
      key: "Difference between sitar and sarod",
      value:
        "The sitar has frets and sympathetic strings and is played with a mizrab, the sarod is fretless with a metal fingerboard and is played with a plectrum of coconut shell",
    },
    {
      key: "Folk instruments of Punjab",
      value: "The dhol, dholki, tumbi, algoza, chimta, sarangi and dhadd",
    },
    {
      key: "Classification of the harmonium",
      value:
        "It is a sushir vadya, a wind instrument, because its reeds are sounded by air from the bellows",
    },
  ],
);

mus(
  "mc:history-theory",
  "History of Indian Music and its Theorists",
  "In the history of Indian music, what is %s?",
  "%k is %v.",
  [
    { key: "Oldest source of Indian music", value: "The Samaveda" },
    { key: "Author of the Natyashastra", value: "Bharata Muni" },
    { key: "Author of the Sangeet Ratnakara", value: "Sharangdeva" },
    {
      key: "Scholar who devised the modern thaat system",
      value: "Pandit Vishnu Narayan Bhatkhande",
    },
    {
      key: "Scholar who founded the Gandharva Mahavidyalaya",
      value: "Pandit Vishnu Digambar Paluskar",
    },
    { key: "Musician credited with the dhrupad at Akbar's court", value: "Tansen" },
    { key: "Number of melakarta ragas in the Carnatic system", value: "Seventy two" },
    { key: "Scholar who systematised the melakarta scheme", value: "Venkatamakhin" },
    { key: "Trinity of Carnatic music", value: "Tyagaraja, Muthuswami Dikshitar and Syama Sastri" },
    {
      key: "Term for the guru-disciple tradition of teaching music",
      value: "The guru-shishya parampara",
    },
  ],
  [
    {
      key: "Contribution of Bhatkhande to modern music",
      value:
        "He collected and notated thousands of compositions, devised a workable notation and reduced the ragas of Hindustani music to ten thaats, making systematic teaching possible",
    },
    {
      key: "Contribution of Paluskar",
      value:
        "He took music out of the closed gharana and into the public institution, founded schools, devised his own notation and gave the art social respectability",
    },
    {
      key: "Difference between the Hindustani and Carnatic systems",
      value:
        "Hindustani grew in the north with Persian influence and organises ragas by ten thaats, Carnatic developed in the south, is more composition-centred and organises ragas by seventy two melakartas",
    },
    {
      key: "Significance of the Samaveda for music",
      value:
        "Its verses were chanted to fixed melodic patterns, and the descending scale of samagana is regarded as the origin of the Indian swara system",
    },
    {
      key: "Musical contribution of Amir Khusrau",
      value:
        "He is traditionally credited with the qawwali, the khayal and the tarana, and with instruments such as the sitar and tabla, although the attributions are debated",
    },
  ],
);

mus(
  "mc:notation-pedagogy",
  "Notation Systems and the Teaching of Music",
  "In music notation and pedagogy, what is %s?",
  "%k is %v.",
  [
    {
      key: "Two chief notation systems of Hindustani music",
      value: "The Bhatkhande system and the Paluskar system",
    },
    { key: "Swaralipi", value: "The written notation of swaras and taal" },
    { key: "Sign for the sam in Bhatkhande notation", value: "A cross, written as x" },
    { key: "Sign for the khali in Bhatkhande notation", value: "A zero" },
    {
      key: "Way a komal swara is written in Bhatkhande notation",
      value: "With a horizontal line placed below the swara",
    },
    {
      key: "Way a teevra Madhyam is written",
      value: "With a vertical line placed above the swara",
    },
    { key: "Meend", value: "A glide from one swara to another without breaking the sound" },
    { key: "Gamak", value: "A heavy oscillation on a swara used as ornament" },
    { key: "Kan swara", value: "A grace note touched lightly before the main swara" },
    {
      key: "Aim of music education in school",
      value:
        "To build aesthetic sense, discipline and creative expression rather than to produce professional performers",
    },
  ],
  [
    {
      key: "Reason a standard notation was needed in Indian music",
      value:
        "The tradition was oral, so compositions were lost with their singers, and notation let the repertoire be preserved, printed and taught to a class rather than to one disciple",
    },
    {
      key: "Limitation of written notation in Indian music",
      value:
        "It cannot fully record meend, gamak and the subtle shrutis, so it remains a skeleton that still needs the living demonstration of a teacher",
    },
    {
      key: "Order in which music should be taught to a beginner",
      value:
        "Voice culture and swara recognition first, then alankars and simple taals, then easy ragas and bandishes, moving from imitation to independent rendering",
    },
    {
      key: "Value of group singing in a school",
      value:
        "It builds pitch sense, rhythm and cooperation at once, and lets a large class take part where individual training is not possible",
    },
    {
      key: "Way a music teacher should assess a learner",
      value:
        "Continuously, through listening to pitch accuracy, rhythm, breath control and expression in performance, rather than by a written test alone",
    },
  ],
);

export const MUSIC_CADRE_TEMPLATES = templates;
