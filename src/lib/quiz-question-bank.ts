/**
 * KKCC Kit 2 Coins quiz — original factual question bank.
 *
 * Every entry is a real exam-style MCQ with one correct answer and plausible
 * distractors. Study-advice / "what is the best strategy" style items are not
 * allowed here: students must always get an actual examinable question.
 *
 * Keys are `${subject}::${topic}` and match `KITTU_SUBJECT_TOPICS`.
 */

export type QuizBankItem = {
  prompt: string;
  answer: string;
  distractors: string[];
  explanation: string;
};

const bank: Record<string, QuizBankItem[]> = {};

function add(subject: string, topic: string, items: QuizBankItem[]) {
  bank[`${subject}::${topic}`] = items;
}

/* ------------------------------------------------------------------ Polity */

add("Polity", "Constitution Basics", [
  {
    prompt: "The Constitution of India came into force on which date?",
    answer: "26 January 1950",
    distractors: ["15 August 1947", "26 November 1949", "2 October 1950"],
    explanation:
      "The Constituent Assembly adopted the Constitution on 26 November 1949 and it came into force on 26 January 1950, celebrated as Republic Day.",
  },
  {
    prompt: "Who was the Chairman of the Drafting Committee of the Indian Constitution?",
    answer: "Dr. B. R. Ambedkar",
    distractors: ["Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
    explanation:
      "Dr. B. R. Ambedkar chaired the Drafting Committee. Dr. Rajendra Prasad was the President of the Constituent Assembly.",
  },
  {
    prompt: "Which Schedule of the Constitution contains the recognised languages of India?",
    answer: "Eighth Schedule",
    distractors: ["Sixth Schedule", "Tenth Schedule", "Twelfth Schedule"],
    explanation:
      "The Eighth Schedule lists the languages recognised by the Constitution. The Tenth Schedule deals with anti-defection.",
  },
  {
    prompt:
      "The idea of the Preamble's 'Liberty, Equality and Fraternity' was drawn from which country?",
    answer: "France",
    distractors: ["United States of America", "Ireland", "Canada"],
    explanation:
      "The ideals of liberty, equality and fraternity were inspired by the French Revolution.",
  },
  {
    prompt: "Which words were added to the Preamble by the 42nd Constitutional Amendment, 1976?",
    answer: "Socialist, Secular and Integrity",
    distractors: ["Sovereign and Democratic", "Republic and Justice", "Federal and Parliamentary"],
    explanation:
      "The 42nd Amendment added the words 'Socialist', 'Secular' and 'Integrity' to the Preamble.",
  },
]);

add("Polity", "Fundamental Rights", [
  {
    prompt: "Right to Constitutional Remedies is guaranteed under which Article?",
    answer: "Article 32",
    distractors: ["Article 14", "Article 19", "Article 21"],
    explanation:
      "Article 32 allows a citizen to move the Supreme Court directly for enforcement of Fundamental Rights. Dr. Ambedkar called it the heart and soul of the Constitution.",
  },
  {
    prompt: "Article 21 of the Indian Constitution protects which right?",
    answer: "Protection of life and personal liberty",
    distractors: [
      "Right to property",
      "Right to freedom of religion",
      "Right against exploitation",
    ],
    explanation:
      "Article 21 states that no person shall be deprived of life or personal liberty except according to procedure established by law.",
  },
  {
    prompt: "Abolition of untouchability is provided in which Article?",
    answer: "Article 17",
    distractors: ["Article 15", "Article 19", "Article 25"],
    explanation: "Article 17 abolishes untouchability and forbids its practice in any form.",
  },
  {
    prompt: "Which writ is issued to produce a detained person before the court?",
    answer: "Habeas Corpus",
    distractors: ["Mandamus", "Certiorari", "Quo Warranto"],
    explanation:
      "Habeas Corpus literally means 'to have the body'. It protects personal liberty against unlawful detention.",
  },
  {
    prompt: "Right to Education for children aged 6 to 14 years was inserted by which Article?",
    answer: "Article 21A",
    distractors: ["Article 19A", "Article 29", "Article 45"],
    explanation:
      "The 86th Amendment Act, 2002 inserted Article 21A, making free and compulsory education a Fundamental Right for children aged 6 to 14.",
  },
]);

add("Polity", "Directive Principles", [
  {
    prompt: "Directive Principles of State Policy are contained in which Part of the Constitution?",
    answer: "Part IV",
    distractors: ["Part II", "Part III", "Part V"],
    explanation:
      "Part IV (Articles 36 to 51) contains the Directive Principles. They guide the State in law-making but are not enforceable by courts.",
  },
  {
    prompt:
      "The concept of Directive Principles of State Policy was borrowed from the Constitution of which country?",
    answer: "Ireland",
    distractors: ["United Kingdom", "United States of America", "Australia"],
    explanation:
      "India borrowed the Directive Principles from the Irish Constitution, which in turn drew on the Spanish Constitution.",
  },
  {
    prompt: "Organisation of village panchayats is directed by which Article?",
    answer: "Article 40",
    distractors: ["Article 38", "Article 44", "Article 51"],
    explanation:
      "Article 40 directs the State to organise village panchayats and give them powers to function as units of self-government.",
  },
  {
    prompt: "Which Article of the Directive Principles speaks of a Uniform Civil Code?",
    answer: "Article 44",
    distractors: ["Article 39", "Article 41", "Article 48"],
    explanation:
      "Article 44 directs the State to endeavour to secure a Uniform Civil Code for citizens throughout the territory of India.",
  },
]);

add("Polity", "Parliament", [
  {
    prompt: "Who presides over a joint sitting of both Houses of Parliament?",
    answer: "Speaker of the Lok Sabha",
    distractors: ["President of India", "Vice President of India", "Prime Minister"],
    explanation:
      "A joint sitting under Article 108 is presided over by the Speaker of the Lok Sabha; in the Speaker's absence the Deputy Speaker presides.",
  },
  {
    prompt: "What is the maximum strength of the Lok Sabha as provided in the Constitution?",
    answer: "552",
    distractors: ["500", "545", "600"],
    explanation:
      "The Constitution provides a maximum Lok Sabha strength of 552 members: 530 from states, 20 from union territories and 2 earlier nominated Anglo-Indians.",
  },
  {
    prompt: "A Money Bill can be introduced only in which House?",
    answer: "Lok Sabha",
    distractors: ["Rajya Sabha", "Either House", "Joint sitting only"],
    explanation:
      "Under Article 110, a Money Bill can be introduced only in the Lok Sabha, and only on the recommendation of the President.",
  },
  {
    prompt: "The Rajya Sabha can retain a Money Bill for a maximum period of",
    answer: "14 days",
    distractors: ["7 days", "30 days", "6 months"],
    explanation:
      "The Rajya Sabha must return a Money Bill within 14 days. If it fails to do so, the Bill is deemed passed by both Houses.",
  },
  {
    prompt: "Who is the ex-officio Chairman of the Rajya Sabha?",
    answer: "Vice President of India",
    distractors: ["President of India", "Speaker of the Lok Sabha", "Leader of the House"],
    explanation:
      "The Vice President of India is the ex-officio Chairman of the Rajya Sabha under Article 64.",
  },
]);

add("Polity", "President and Governor", [
  {
    prompt: "The President of India is elected by which method?",
    answer: "Proportional representation by single transferable vote",
    distractors: [
      "Direct election by all citizens",
      "First-past-the-post by the Lok Sabha",
      "Open voice vote in Parliament",
    ],
    explanation:
      "The President is elected indirectly by an electoral college through proportional representation using the single transferable vote and secret ballot.",
  },
  {
    prompt: "The Governor of a State is appointed by",
    answer: "The President of India",
    distractors: ["The Prime Minister", "The State Legislature", "The Chief Justice of India"],
    explanation:
      "Under Article 155, the Governor of a State is appointed by the President by warrant under his hand and seal.",
  },
  {
    prompt: "What is the term of office of the President of India?",
    answer: "5 years",
    distractors: ["4 years", "6 years", "7 years"],
    explanation:
      "The President holds office for a term of five years from the date of entering office and is eligible for re-election.",
  },
  {
    prompt: "Under which Article can the President proclaim a National Emergency?",
    answer: "Article 352",
    distractors: ["Article 356", "Article 360", "Article 368"],
    explanation:
      "Article 352 deals with National Emergency, Article 356 with President's Rule in states and Article 360 with Financial Emergency.",
  },
]);

add("Polity", "Panchayati Raj", [
  {
    prompt:
      "Which Constitutional Amendment gave constitutional status to Panchayati Raj institutions?",
    answer: "73rd Amendment",
    distractors: ["42nd Amendment", "44th Amendment", "74th Amendment"],
    explanation:
      "The 73rd Amendment Act, 1992 added Part IX and the Eleventh Schedule, giving constitutional status to Panchayati Raj institutions.",
  },
  {
    prompt: "Which committee first recommended the three-tier Panchayati Raj system in India?",
    answer: "Balwant Rai Mehta Committee",
    distractors: ["Ashok Mehta Committee", "Sarkaria Commission", "L. M. Singhvi Committee"],
    explanation:
      "The Balwant Rai Mehta Committee (1957) recommended a three-tier structure of Gram Panchayat, Panchayat Samiti and Zila Parishad.",
  },
  {
    prompt: "The Eleventh Schedule of the Constitution contains how many subjects for Panchayats?",
    answer: "29",
    distractors: ["18", "25", "32"],
    explanation:
      "The Eleventh Schedule lists 29 functional subjects that may be devolved to Panchayati Raj institutions.",
  },
  {
    prompt: "The village-level body of all registered voters in a Panchayat area is called",
    answer: "Gram Sabha",
    distractors: ["Zila Parishad", "Panchayat Samiti", "Nagar Panchayat"],
    explanation:
      "The Gram Sabha consists of all persons registered in the electoral rolls of a village within a Panchayat area.",
  },
]);

add("Polity", "Judiciary", [
  {
    prompt: "Who appoints the Chief Justice of India?",
    answer: "The President of India",
    distractors: ["The Prime Minister", "The Parliament", "The Law Minister"],
    explanation:
      "The Chief Justice of India is appointed by the President, conventionally following the collegium recommendation.",
  },
  {
    prompt:
      "Disputes between the Government of India and one or more States are heard under which jurisdiction of the Supreme Court?",
    answer: "Original jurisdiction",
    distractors: ["Appellate jurisdiction", "Advisory jurisdiction", "Revisional jurisdiction"],
    explanation:
      "Article 131 gives the Supreme Court exclusive original jurisdiction in federal disputes between the Centre and States or between States.",
  },
  {
    prompt: "What is the retirement age of a Supreme Court judge in India?",
    answer: "65 years",
    distractors: ["60 years", "62 years", "70 years"],
    explanation:
      "A Supreme Court judge retires at 65 years, while a High Court judge retires at 62 years.",
  },
  {
    prompt: "Under which Article can the President seek the advisory opinion of the Supreme Court?",
    answer: "Article 143",
    distractors: ["Article 131", "Article 136", "Article 226"],
    explanation:
      "Article 143 empowers the President to refer questions of public importance to the Supreme Court for its advisory opinion.",
  },
]);

add("Polity", "Local Government", [
  {
    prompt: "Which Constitutional Amendment gave constitutional status to urban local bodies?",
    answer: "74th Amendment",
    distractors: ["73rd Amendment", "69th Amendment", "86th Amendment"],
    explanation:
      "The 74th Amendment Act, 1992 added Part IXA and the Twelfth Schedule relating to municipalities.",
  },
  {
    prompt: "The Twelfth Schedule of the Constitution lists how many subjects for municipalities?",
    answer: "18",
    distractors: ["11", "22", "29"],
    explanation: "The Twelfth Schedule lists 18 functional items relating to urban local bodies.",
  },
  {
    prompt: "A Municipal Corporation is normally constituted for",
    answer: "A large urban area",
    distractors: ["A single village", "A group of villages", "A transitional rural area"],
    explanation:
      "Municipal Corporations are created for large urban areas, Municipal Councils for smaller urban areas and Nagar Panchayats for transitional areas.",
  },
]);

/* --------------------------------------------------------- English Grammar */

add("English Grammar", "Tenses", [
  {
    prompt: "Choose the correct sentence.",
    answer: "She has completed her assignment.",
    distractors: [
      "She have completed her assignment.",
      "She has completing her assignment.",
      "She is completed her assignment.",
    ],
    explanation:
      "Present perfect with a singular third-person subject takes 'has' followed by the past participle 'completed'.",
  },
  {
    prompt: "Fill in the blank: They ___ in this school since 2019.",
    answer: "have been studying",
    distractors: ["are studying", "studied", "will study"],
    explanation:
      "'Since 2019' marks an action starting in the past and continuing now, so the present perfect continuous 'have been studying' is used.",
  },
  {
    prompt: "Choose the correct past perfect sentence.",
    answer: "The train had left before we reached the station.",
    distractors: [
      "The train has left before we reached the station.",
      "The train left before we had reached the station yesterday tomorrow.",
      "The train was leave before we reach the station.",
    ],
    explanation:
      "For the earlier of two past actions we use the past perfect: 'had left' happened before 'reached'.",
  },
  {
    prompt: "Fill in the blank: Water ___ at 100 degrees Celsius.",
    answer: "boils",
    distractors: ["is boiling", "boiled", "has boiled"],
    explanation: "Universal truths and scientific facts take the simple present tense.",
  },
]);

add("English Grammar", "Subject-Verb Agreement", [
  {
    prompt: "Choose the grammatically correct sentence.",
    answer: "The list of items is on the desk.",
    distractors: [
      "The list of items are on the desk.",
      "The list of items were on the desk.",
      "The list of items have been on desk.",
    ],
    explanation:
      "The subject is the singular noun 'list', not 'items', so the singular verb 'is' is correct.",
  },
  {
    prompt: "Fill in the blank: Neither the teacher nor the students ___ present.",
    answer: "were",
    distractors: ["was", "is", "has been"],
    explanation:
      "With 'neither...nor', the verb agrees with the nearer subject. 'Students' is plural, so 'were' is correct.",
  },
  {
    prompt: "Choose the correct sentence.",
    answer: "Mathematics is my favourite subject.",
    distractors: [
      "Mathematics are my favourite subject.",
      "Mathematics were my favourite subject now.",
      "Mathematics have my favourite subject.",
    ],
    explanation: "Subjects like mathematics, physics and news end in -s but take a singular verb.",
  },
  {
    prompt: "Fill in the blank: Each of the boys ___ a notebook.",
    answer: "has",
    distractors: ["have", "are having", "were having"],
    explanation:
      "'Each' is singular, so it takes the singular verb 'has' even when followed by a plural noun.",
  },
]);

add("English Grammar", "Articles and Determiners", [
  {
    prompt: "Fill in the blank: ___ honest man is respected everywhere.",
    answer: "An",
    distractors: ["A", "The", "No article"],
    explanation:
      "'Honest' begins with a vowel sound because the 'h' is silent, so the article 'an' is used.",
  },
  {
    prompt: "Fill in the blank: He is ___ university student.",
    answer: "a",
    distractors: ["an", "the", "no article"],
    explanation: "'University' begins with the consonant sound /ju:/, so the article 'a' is used.",
  },
  {
    prompt: "Fill in the blank: ___ Ganga is a sacred river.",
    answer: "The",
    distractors: ["A", "An", "No article"],
    explanation:
      "Names of rivers, oceans, mountain ranges and holy books take the definite article 'the'.",
  },
  {
    prompt: "Choose the correct sentence.",
    answer: "I have little money, so I cannot buy it.",
    distractors: [
      "I have a little money, so I cannot buy it.",
      "I have few money, so I cannot buy it.",
      "I have the little money, so I cannot buy it.",
    ],
    explanation:
      "'Little' with an uncountable noun carries a negative sense of 'hardly any', which matches the second clause.",
  },
]);

add("English Grammar", "Prepositions", [
  {
    prompt: "Fill in the blank: We reached the station ___ time.",
    answer: "in",
    distractors: ["at", "on", "by"],
    explanation: "'In time' means early enough. 'On time' means exactly at the scheduled moment.",
  },
  {
    prompt: "Fill in the blank: She has been ill ___ Monday.",
    answer: "since",
    distractors: ["for", "from", "during"],
    explanation: "'Since' is used with a point of time, while 'for' is used with a period of time.",
  },
  {
    prompt: "Fill in the blank: He is good ___ mathematics.",
    answer: "at",
    distractors: ["in", "on", "with"],
    explanation: "The fixed expression is 'good at' a skill or subject.",
  },
  {
    prompt: "Fill in the blank: The book is ___ the table.",
    answer: "on",
    distractors: ["in", "at", "into"],
    explanation: "'On' indicates contact with a surface, so a book resting on a table takes 'on'.",
  },
]);

add("English Grammar", "Voice", [
  {
    prompt: "Change to passive voice: 'The teacher teaches the lesson.'",
    answer: "The lesson is taught by the teacher.",
    distractors: [
      "The lesson was taught by the teacher.",
      "The lesson has taught by the teacher.",
      "The lesson is teaching by the teacher.",
    ],
    explanation: "Simple present active becomes 'is/are + past participle' in the passive voice.",
  },
  {
    prompt: "Change to passive voice: 'They will complete the project.'",
    answer: "The project will be completed by them.",
    distractors: [
      "The project will completed by them.",
      "The project is completed by them.",
      "The project would completed by them.",
    ],
    explanation: "Simple future active becomes 'will be + past participle' in the passive voice.",
  },
  {
    prompt: "Change to active voice: 'The letter was written by Rahul.'",
    answer: "Rahul wrote the letter.",
    distractors: [
      "Rahul writes the letter.",
      "Rahul has wrote the letter.",
      "Rahul was writing letter.",
    ],
    explanation: "The passive 'was written' corresponds to the simple past active form 'wrote'.",
  },
]);

add("English Grammar", "Narration", [
  {
    prompt: "Change to indirect speech: He said, 'I am busy.'",
    answer: "He said that he was busy.",
    distractors: [
      "He said that he is busy.",
      "He said that I was busy.",
      "He says that he was busy.",
    ],
    explanation:
      "When the reporting verb is in the past, the present tense in direct speech shifts to the past tense.",
  },
  {
    prompt: "Change to indirect speech: She said to me, 'Please help me.'",
    answer: "She requested me to help her.",
    distractors: [
      "She said me to help her.",
      "She ordered me that help her.",
      "She told that please help me.",
    ],
    explanation:
      "Requests in indirect speech use a reporting verb such as 'requested' with the infinitive form.",
  },
  {
    prompt: "Change to indirect speech: He said, 'What is your name?'",
    answer: "He asked what my name was.",
    distractors: [
      "He asked what is your name.",
      "He asked that what my name was.",
      "He told what my name is.",
    ],
    explanation:
      "Questions become statements in indirect speech with the reporting verb 'asked' and no question mark.",
  },
]);

add("English Grammar", "Error Spotting", [
  {
    prompt: "Find the error: 'One of my friend is a doctor.'",
    answer: "'friend' should be 'friends'",
    distractors: [
      "'One' should be 'Ones'",
      "'is' should be 'are'",
      "'a doctor' should be 'doctor'",
    ],
    explanation:
      "'One of' is always followed by a plural noun, so the correct form is 'One of my friends is a doctor.'",
  },
  {
    prompt: "Find the error: 'He is senior than me.'",
    answer: "'than' should be 'to'",
    distractors: ["'senior' should be 'seniors'", "'is' should be 'was'", "'me' should be 'my'"],
    explanation:
      "Latin comparatives such as senior, junior, superior and inferior take 'to', not 'than'.",
  },
  {
    prompt: "Find the error: 'She did not went to school.'",
    answer: "'went' should be 'go'",
    distractors: [
      "'did' should be 'does'",
      "'not' should be removed",
      "'to school' should be 'at school'",
    ],
    explanation:
      "After the auxiliary 'did', the main verb takes the base form: 'She did not go to school.'",
  },
]);

add("English Grammar", "Reading Comprehension", [
  {
    prompt:
      "Read: 'Solar cookers need direct sunlight. On cloudy days they work slowly.' What can be concluded?",
    answer: "Solar cooker performance depends on available sunlight.",
    distractors: [
      "Solar cookers never work at all.",
      "Solar cookers work best at night.",
      "Cloudy days have no effect on solar cookers.",
    ],
    explanation:
      "The passage links cooking speed with sunlight, so performance depends on available sunlight.",
  },
  {
    prompt:
      "Read: 'The library opens at 9 a.m. and closes at 6 p.m., except on Sunday when it stays shut.' How many days a week is the library open?",
    answer: "Six",
    distractors: ["Five", "Seven", "Four"],
    explanation: "The library is closed only on Sunday, so it is open for the remaining six days.",
  },
  {
    prompt: "Read: 'Ravi scored more than Meena but less than Sunil.' Who scored the highest?",
    answer: "Sunil",
    distractors: ["Ravi", "Meena", "Cannot be determined"],
    explanation: "The order from the passage is Sunil > Ravi > Meena, so Sunil scored the highest.",
  },
]);

/* ----------------------------------------------------------- Hindi Grammar */

add("Hindi Grammar", "संग्या और सर्वनाम", [
  {
    prompt: "‘राधा पढ़ती है।’ वाक्य में ‘राधा’ किस प्रकार की संज्ञा है?",
    answer: "व्यक्तिवाचक संज्ञा",
    distractors: ["जातिवाचक संज्ञा", "भाववाचक संज्ञा", "समूहवाचक संज्ञा"],
    explanation: "‘राधा’ किसी विशेष व्यक्ति का नाम है, इसलिए यह व्यक्तिवाचक संज्ञा है।",
  },
  {
    prompt: "‘सेना’ शब्द किस प्रकार की संज्ञा है?",
    answer: "समूहवाचक संज्ञा",
    distractors: ["व्यक्तिवाचक संज्ञा", "द्रव्यवाचक संज्ञा", "भाववाचक संज्ञा"],
    explanation: "‘सेना’ अनेक सैनिकों के समूह का बोध कराती है, इसलिए यह समूहवाचक संज्ञा है।",
  },
  {
    prompt: "‘मिठास’ शब्द किस प्रकार की संज्ञा है?",
    answer: "भाववाचक संज्ञा",
    distractors: ["जातिवाचक संज्ञा", "व्यक्तिवाचक संज्ञा", "द्रव्यवाचक संज्ञा"],
    explanation: "गुण, भाव या दशा का बोध कराने वाले शब्द भाववाचक संज्ञा कहलाते हैं।",
  },
  {
    prompt: "‘मुझे पानी चाहिए।’ में ‘मुझे’ कौन-सा पद है?",
    answer: "सर्वनाम",
    distractors: ["संज्ञा", "क्रिया", "विशेषण"],
    explanation: "संज्ञा के स्थान पर प्रयुक्त होने वाला शब्द सर्वनाम कहलाता है।",
  },
]);

add("Hindi Grammar", "क्रिया और काल", [
  {
    prompt: "‘राम खाना खा रहा है।’ में कौन-सा काल है?",
    answer: "वर्तमान काल",
    distractors: ["भूतकाल", "भविष्यत् काल", "आज्ञार्थक"],
    explanation: "क्रिया अभी जारी है, इसलिए यह वर्तमान काल (अपूर्ण वर्तमान) है।",
  },
  {
    prompt: "‘बच्चे कल खेलेंगे।’ में कौन-सा काल है?",
    answer: "भविष्यत् काल",
    distractors: ["वर्तमान काल", "भूतकाल", "संदिग्ध वर्तमान"],
    explanation: "कार्य आगे होगा, इसलिए यह भविष्यत् काल है।",
  },
  {
    prompt: "‘मोहन सो गया।’ में कौन-सा काल है?",
    answer: "भूतकाल",
    distractors: ["वर्तमान काल", "भविष्यत् काल", "संभाव्य भविष्यत्"],
    explanation: "कार्य पहले पूरा हो चुका है, इसलिए यह भूतकाल है।",
  },
  {
    prompt: "‘सीता पत्र लिखती है।’ में क्रिया किस प्रकार की है?",
    answer: "सकर्मक क्रिया",
    distractors: ["अकर्मक क्रिया", "संयुक्त क्रिया", "प्रेरणार्थक क्रिया"],
    explanation: "जिस क्रिया का कर्म होता है, वह सकर्मक क्रिया कहलाती है। यहाँ ‘पत्र’ कर्म है।",
  },
]);

add("Hindi Grammar", "संधि और समास", [
  {
    prompt: "‘विद्यालय’ का सही संधि-विच्छेद क्या है?",
    answer: "विद्या + आलय",
    distractors: ["विद्य + लय", "वि + धालय", "विद्याय + लय"],
    explanation: "‘विद्या’ और ‘आलय’ के मेल से ‘विद्यालय’ बनता है; यह दीर्घ स्वर संधि है।",
  },
  {
    prompt: "‘सज्जन’ में कौन-सी संधि है?",
    answer: "व्यंजन संधि",
    distractors: ["दीर्घ स्वर संधि", "विसर्ग संधि", "गुण संधि"],
    explanation: "‘सत् + जन’ के मेल से ‘सज्जन’ बनता है, इसलिए यह व्यंजन संधि है।",
  },
  {
    prompt: "‘राजपुत्र’ में कौन-सा समास है?",
    answer: "तत्पुरुष समास",
    distractors: ["द्वंद्व समास", "बहुव्रीहि समास", "अव्ययीभाव समास"],
    explanation: "‘राजा का पुत्र’ अर्थ निकलने के कारण यह तत्पुरुष समास है।",
  },
  {
    prompt: "‘माता-पिता’ में कौन-सा समास है?",
    answer: "द्वंद्व समास",
    distractors: ["तत्पुरुष समास", "कर्मधारय समास", "बहुव्रीहि समास"],
    explanation: "दोनों पद प्रधान हैं और ‘और’ से जुड़ते हैं, इसलिए यह द्वंद्व समास है।",
  },
]);

add("Hindi Grammar", "कारक और विभक्ति", [
  {
    prompt: "‘राम ने पुस्तक दी।’ में ‘राम ने’ कौन-सा कारक है?",
    answer: "कर्ता कारक",
    distractors: ["कर्म कारक", "करण कारक", "अधिकरण कारक"],
    explanation: "जो क्रिया करता है वह कर्ता कारक होता है; इसका चिह्न ‘ने’ है।",
  },
  {
    prompt: "‘कलम से पत्र लिखा गया।’ में ‘कलम से’ कौन-सा कारक है?",
    answer: "करण कारक",
    distractors: ["कर्ता कारक", "संप्रदान कारक", "अपादान कारक"],
    explanation: "जिस साधन से कार्य होता है, वह करण कारक होता है; चिह्न ‘से’ है।",
  },
  {
    prompt: "‘बच्चे को दूध दो।’ में ‘बच्चे को’ कौन-सा कारक है?",
    answer: "संप्रदान कारक",
    distractors: ["कर्म कारक", "करण कारक", "संबंध कारक"],
    explanation: "जिसके लिए कुछ दिया जाता है, वह संप्रदान कारक होता है; चिह्न ‘को/के लिए’ है।",
  },
  {
    prompt: "‘पेड़ से पत्ते गिरे।’ में ‘पेड़ से’ कौन-सा कारक है?",
    answer: "अपादान कारक",
    distractors: ["करण कारक", "अधिकरण कारक", "कर्म कारक"],
    explanation: "अलग होने का भाव व्यक्त करने वाला कारक अपादान कारक कहलाता है।",
  },
]);

add("Hindi Grammar", "पर्यायवाची और विलोम शब्द", [
  {
    prompt: "‘सूर्य’ का पर्यायवाची शब्द कौन-सा है?",
    answer: "रवि",
    distractors: ["चंद्र", "सागर", "पवन"],
    explanation: "‘सूर्य’ के पर्यायवाची शब्द हैं — रवि, भानु, दिनकर, आदित्य।",
  },
  {
    prompt: "‘कमल’ का पर्यायवाची शब्द कौन-सा है?",
    answer: "पंकज",
    distractors: ["अंबर", "अनल", "तरु"],
    explanation: "‘कमल’ के पर्यायवाची शब्द हैं — पंकज, जलज, नीरज, सरोज।",
  },
  {
    prompt: "‘सुख’ का विलोम शब्द क्या है?",
    answer: "दुःख",
    distractors: ["आनंद", "हर्ष", "प्रसन्नता"],
    explanation: "‘सुख’ का विपरीतार्थक शब्द ‘दुःख’ है; शेष विकल्प पर्यायवाची हैं।",
  },
  {
    prompt: "‘आदि’ का विलोम शब्द क्या है?",
    answer: "अंत",
    distractors: ["प्रारंभ", "आरंभ", "मूल"],
    explanation: "‘आदि’ का अर्थ आरंभ है, इसलिए इसका विलोम ‘अंत’ होगा।",
  },
]);

add("Hindi Grammar", "मुहावरे और लोकोक्तियाँ", [
  {
    prompt: "‘आँखों का तारा होना’ मुहावरे का अर्थ क्या है?",
    answer: "बहुत प्रिय होना",
    distractors: ["डर जाना", "दूर चला जाना", "समय नष्ट करना"],
    explanation: "‘आँखों का तारा’ का अर्थ है अत्यंत प्रिय व्यक्ति।",
  },
  {
    prompt: "‘नौ दो ग्यारह होना’ का अर्थ क्या है?",
    answer: "भाग जाना",
    distractors: ["गिनती सीखना", "धन कमाना", "झगड़ा करना"],
    explanation: "इस मुहावरे का अर्थ है चुपचाप भाग जाना।",
  },
  {
    prompt: "लोकोक्ति ‘अधजल गगरी छलकत जाय’ का अर्थ क्या है?",
    answer: "अल्पज्ञ व्यक्ति अधिक दिखावा करता है",
    distractors: ["घड़ा हमेशा भरा रहता है", "पानी बचाना चाहिए", "मेहनत से सफलता मिलती है"],
    explanation: "आधी भरी गगरी अधिक छलकती है, अर्थात कम ज्ञान वाला अधिक दिखावा करता है।",
  },
  {
    prompt: "‘दाँतों तले उँगली दबाना’ का अर्थ क्या है?",
    answer: "आश्चर्यचकित होना",
    distractors: ["क्रोधित होना", "भूख लगना", "चुप हो जाना"],
    explanation: "यह मुहावरा अत्यधिक आश्चर्य प्रकट करने के अर्थ में प्रयुक्त होता है।",
  },
]);

add("Hindi Grammar", "वाक्य शुद्धि", [
  {
    prompt: "इनमें से शुद्ध वाक्य कौन-सा है?",
    answer: "मुझे यह पुस्तक अच्छी लगी।",
    distractors: [
      "मुझे यह पुस्तक अच्छा लगी।",
      "मुझको यह पुस्तक अच्छे लगा।",
      "मैं यह पुस्तक अच्छी लगी।",
    ],
    explanation: "‘पुस्तक’ स्त्रीलिंग है, इसलिए विशेषण और क्रिया भी स्त्रीलिंग रूप में होंगे।",
  },
  {
    prompt: "शुद्ध वाक्य चुनिए।",
    answer: "वह आठ बजे विद्यालय जाता है।",
    distractors: [
      "वह आठ बजे विद्यालय जाती है।",
      "वह आठ बजे विद्यालय जाते है।",
      "वह आठ बजे विद्यालय जाना है।",
    ],
    explanation: "पुल्लिंग एकवचन कर्ता ‘वह’ के साथ ‘जाता है’ क्रिया रूप शुद्ध है।",
  },
  {
    prompt: "‘वह आता है।’ का शुद्ध बहुवचन रूप क्या है?",
    answer: "वे आते हैं।",
    distractors: ["वह आते हैं।", "वे आता है।", "वह आता हैं।"],
    explanation: "बहुवचन में कर्ता ‘वे’ और क्रिया ‘आते हैं’ दोनों बहुवचन रूप लेते हैं।",
  },
]);

/* --------------------------------------------------------------------- SST */

add("SST", "History", [
  {
    prompt: "Who founded the Mauryan Empire?",
    answer: "Chandragupta Maurya",
    distractors: ["Ashoka", "Bindusara", "Harshavardhana"],
    explanation:
      "Chandragupta Maurya founded the Mauryan Empire in 322 BCE with the guidance of Chanakya (Kautilya).",
  },
  {
    prompt: "The Dandi March of 1930 was a protest against which tax?",
    answer: "Salt tax",
    distractors: ["Land revenue", "Income tax", "Trade tax"],
    explanation:
      "Mahatma Gandhi marched to Dandi to break the British salt law and monopoly on salt production.",
  },
  {
    prompt: "In which year was the Jallianwala Bagh massacre?",
    answer: "1919",
    distractors: ["1905", "1930", "1942"],
    explanation:
      "The Jallianwala Bagh massacre took place in Amritsar on 13 April 1919 under General Dyer's orders.",
  },
  {
    prompt: "The Quit India Movement was launched in which year?",
    answer: "1942",
    distractors: ["1920", "1930", "1947"],
    explanation: "The Quit India Movement began on 8 August 1942 with the slogan 'Do or Die'.",
  },
]);

add("SST", "Geography", [
  {
    prompt: "Which imaginary line lies at 0 degree latitude?",
    answer: "Equator",
    distractors: ["Prime Meridian", "Tropic of Cancer", "Arctic Circle"],
    explanation:
      "The Equator is at 0° latitude and divides the Earth into the Northern and Southern Hemispheres.",
  },
  {
    prompt: "Which soil is most suitable for cotton cultivation in India?",
    answer: "Black soil",
    distractors: ["Alluvial soil", "Laterite soil", "Desert soil"],
    explanation:
      "Black soil, also called regur soil, retains moisture well and is ideal for cotton in the Deccan region.",
  },
  {
    prompt: "The Tropic of Cancer is located at approximately which latitude?",
    answer: "23.5° North",
    distractors: ["23.5° South", "66.5° North", "0°"],
    explanation:
      "The Tropic of Cancer lies at about 23.5° N and passes through eight Indian states.",
  },
  {
    prompt: "Which is the longest river in India?",
    answer: "Ganga",
    distractors: ["Godavari", "Brahmaputra", "Narmada"],
    explanation:
      "The Ganga is the longest river flowing within India, with the Godavari being the longest peninsular river.",
  },
]);

add("SST", "Civics", [
  {
    prompt: "Who conducts elections to Parliament and State Legislatures in India?",
    answer: "Election Commission of India",
    distractors: ["Supreme Court", "Union Home Ministry", "NITI Aayog"],
    explanation:
      "Article 324 vests superintendence, direction and control of elections in the Election Commission of India.",
  },
  {
    prompt: "What is the minimum age to vote in Indian general elections?",
    answer: "18 years",
    distractors: ["16 years", "21 years", "25 years"],
    explanation: "The 61st Amendment Act, 1988 reduced the voting age from 21 to 18 years.",
  },
  {
    prompt: "In a democracy, the final authority rests with",
    answer: "The people",
    distractors: ["The army", "The judiciary alone", "The bureaucracy"],
    explanation:
      "Democracy is based on popular sovereignty: ultimate political authority belongs to the people.",
  },
]);

add("SST", "Economics", [
  {
    prompt: "What does GDP stand for?",
    answer: "Gross Domestic Product",
    distractors: ["General Domestic Price", "Gross Demand Product", "General Development Plan"],
    explanation:
      "GDP is the market value of all final goods and services produced within a country in a given period.",
  },
  {
    prompt: "A sustained rise in the general price level is called",
    answer: "Inflation",
    distractors: ["Deflation", "Recession", "Devaluation"],
    explanation:
      "Inflation reduces the purchasing power of money as the general price level rises over time.",
  },
  {
    prompt: "Per capita income is calculated as",
    answer: "National income divided by total population",
    distractors: [
      "Total exports divided by imports",
      "Total savings divided by investment",
      "Government revenue divided by expenditure",
    ],
    explanation:
      "Per capita income is the average income of a person, found by dividing national income by population.",
  },
]);

add("SST", "Nationalism in India", [
  {
    prompt: "The Non-Cooperation Movement was launched in which year?",
    answer: "1920",
    distractors: ["1916", "1930", "1942"],
    explanation:
      "Mahatma Gandhi launched the Non-Cooperation Movement in 1920 after the Jallianwala Bagh massacre and the Khilafat issue.",
  },
  {
    prompt: "The Indian National Congress was founded in which year?",
    answer: "1885",
    distractors: ["1857", "1905", "1919"],
    explanation:
      "The Indian National Congress was founded in 1885 with A. O. Hume playing a key organising role.",
  },
  {
    prompt: "Who gave the slogan 'Swaraj is my birthright and I shall have it'?",
    answer: "Bal Gangadhar Tilak",
    distractors: ["Gopal Krishna Gokhale", "Lala Lajpat Rai", "Bipin Chandra Pal"],
    explanation: "Bal Gangadhar Tilak, a leader of the extremist group, gave this famous slogan.",
  },
]);

add("SST", "Resources and Development", [
  {
    prompt: "Resources that can be renewed or reproduced by natural processes are called",
    answer: "Renewable resources",
    distractors: ["Non-renewable resources", "Stock resources", "Reserve resources"],
    explanation:
      "Solar energy, wind and forests are renewable because natural processes replenish them.",
  },
  {
    prompt: "Which of these is a non-renewable resource?",
    answer: "Coal",
    distractors: ["Solar energy", "Wind energy", "Hydro energy"],
    explanation:
      "Coal takes millions of years to form, so once consumed it cannot be replaced within human timescales.",
  },
  {
    prompt: "Sustainable development mainly means",
    answer: "Meeting present needs without compromising future generations",
    distractors: [
      "Using all resources immediately",
      "Only increasing industrial output",
      "Stopping every development project",
    ],
    explanation:
      "Sustainable development balances economic growth with environmental protection and future needs.",
  },
]);

add("SST", "Democracy and Diversity", [
  {
    prompt: "Social divisions become dangerous for democracy when",
    answer: "One division becomes the only basis of politics",
    distractors: [
      "People have multiple overlapping identities",
      "Communities negotiate through elections",
      "Diversity is accommodated in policy",
    ],
    explanation:
      "Overlapping identities are manageable, but when politics is organised around a single division it can lead to conflict.",
  },
  {
    prompt: "Which country's civil rights movement is often studied with the Black Power movement?",
    answer: "United States of America",
    distractors: ["Belgium", "Sri Lanka", "Nepal"],
    explanation:
      "The African-American civil rights movement and the Black Power movement took place in the United States.",
  },
  {
    prompt: "Belgium successfully accommodated diversity mainly through",
    answer: "Power sharing arrangements between communities",
    distractors: [
      "Majority rule without safeguards",
      "Banning regional languages",
      "Removing local governments",
    ],
    explanation:
      "Belgium used a power-sharing model between Dutch, French and German speaking groups.",
  },
]);

add("SST", "Money and Credit", [
  {
    prompt: "The main function of money is to act as",
    answer: "A medium of exchange",
    distractors: ["A form of jewellery", "A tax document", "A transport pass"],
    explanation:
      "Money removes the double coincidence of wants problem of barter by acting as a medium of exchange.",
  },
  {
    prompt: "Which institution issues currency notes in India?",
    answer: "Reserve Bank of India",
    distractors: ["State Bank of India", "Ministry of Finance directly", "NITI Aayog"],
    explanation:
      "The Reserve Bank of India issues currency notes on behalf of the central government; one-rupee notes are issued by the Ministry of Finance.",
  },
  {
    prompt: "Self Help Groups mainly help rural households by",
    answer: "Providing small loans without collateral",
    distractors: ["Printing currency", "Collecting income tax", "Fixing crop prices"],
    explanation:
      "SHGs pool small savings and provide credit to members at reasonable rates without collateral.",
  },
]);

/* --------------------------------------------------------- Punjab History */

add("Punjab History", "Sikh Gurus", [
  {
    prompt: "Who was the founder of Sikhism?",
    answer: "Guru Nanak Dev Ji",
    distractors: ["Guru Angad Dev Ji", "Guru Arjan Dev Ji", "Guru Gobind Singh Ji"],
    explanation:
      "Guru Nanak Dev Ji (1469–1539) was the first Sikh Guru and the founder of Sikhism.",
  },
  {
    prompt: "Who compiled the Adi Granth?",
    answer: "Guru Arjan Dev Ji",
    distractors: ["Guru Nanak Dev Ji", "Guru Hargobind Ji", "Guru Tegh Bahadur Ji"],
    explanation:
      "Guru Arjan Dev Ji, the fifth Guru, compiled the Adi Granth and installed it at Harmandir Sahib in 1604.",
  },
  {
    prompt: "Who founded the Khalsa in 1699?",
    answer: "Guru Gobind Singh Ji",
    distractors: ["Guru Har Rai Ji", "Guru Amar Das Ji", "Guru Ram Das Ji"],
    explanation: "Guru Gobind Singh Ji created the Khalsa at Anandpur Sahib on Baisakhi in 1699.",
  },
  {
    prompt: "Which Guru founded the city of Amritsar?",
    answer: "Guru Ram Das Ji",
    distractors: ["Guru Angad Dev Ji", "Guru Arjan Dev Ji", "Guru Har Krishan Ji"],
    explanation: "Guru Ram Das Ji, the fourth Guru, founded the city that became Amritsar.",
  },
]);

add("Punjab History", "Maharaja Ranjit Singh", [
  {
    prompt: "Maharaja Ranjit Singh made which city the capital of his empire?",
    answer: "Lahore",
    distractors: ["Amritsar", "Patiala", "Multan"],
    explanation:
      "Maharaja Ranjit Singh captured Lahore in 1799 and made it the capital of the Sikh Empire.",
  },
  {
    prompt: "Maharaja Ranjit Singh is popularly known by which title?",
    answer: "Sher-e-Punjab",
    distractors: ["Shaheed-e-Azam", "Punjab Kesari", "Lok Nayak"],
    explanation: "Maharaja Ranjit Singh is remembered as 'Sher-e-Punjab', the Lion of Punjab.",
  },
  {
    prompt: "The Treaty of Amritsar (1809) was signed between Ranjit Singh and",
    answer: "The British East India Company",
    distractors: ["The Afghans", "The Marathas", "The Mughals"],
    explanation:
      "The Treaty of Amritsar in 1809 fixed the Sutlej as the boundary between Ranjit Singh's territory and British influence.",
  },
]);

add("Punjab History", "Anglo-Sikh Wars", [
  {
    prompt: "The First Anglo-Sikh War was fought during which years?",
    answer: "1845–46",
    distractors: ["1839–40", "1848–49", "1857–58"],
    explanation:
      "The First Anglo-Sikh War took place in 1845–46 and ended with the Treaty of Lahore.",
  },
  {
    prompt: "Punjab was annexed by the British after which war?",
    answer: "Second Anglo-Sikh War",
    distractors: ["First Anglo-Sikh War", "Third Anglo-Maratha War", "Anglo-Afghan War"],
    explanation:
      "After the Second Anglo-Sikh War (1848–49), Lord Dalhousie annexed Punjab in 1849.",
  },
  {
    prompt: "Which treaty ended the First Anglo-Sikh War?",
    answer: "Treaty of Lahore",
    distractors: ["Treaty of Amritsar", "Treaty of Bhairowal only", "Treaty of Sugauli"],
    explanation:
      "The Treaty of Lahore (1846) ended the First Anglo-Sikh War and imposed heavy terms on the Sikh state.",
  },
]);

add("Punjab History", "Freedom Movement in Punjab", [
  {
    prompt: "The Jallianwala Bagh massacre took place in which city?",
    answer: "Amritsar",
    distractors: ["Lahore", "Ludhiana", "Jalandhar"],
    explanation: "The massacre occurred at Jallianwala Bagh in Amritsar on 13 April 1919.",
  },
  {
    prompt: "Bhagat Singh was associated with which revolutionary organisation?",
    answer: "Hindustan Socialist Republican Association",
    distractors: ["Anushilan Samiti", "Servants of India Society", "Swaraj Party"],
    explanation:
      "Bhagat Singh was a leading member of the Hindustan Socialist Republican Association (HSRA).",
  },
  {
    prompt: "The Akali movement in Punjab was mainly linked with",
    answer: "Reform and control of gurdwaras",
    distractors: [
      "Railway construction",
      "Textile mill strikes",
      "Land revenue settlement in Bengal",
    ],
    explanation:
      "The Akali movement of the 1920s sought to free gurdwaras from mahants and place them under elected committees.",
  },
]);

add("Punjab History", "Ghadar Movement", [
  {
    prompt: "The Ghadar Party was founded in which year?",
    answer: "1913",
    distractors: ["1905", "1919", "1925"],
    explanation:
      "The Ghadar Party was formed in 1913 by Indian immigrants in the United States and Canada.",
  },
  {
    prompt: "Who was the first president of the Ghadar Party?",
    answer: "Sohan Singh Bhakna",
    distractors: ["Lala Har Dayal", "Kartar Singh Sarabha", "Rash Behari Bose"],
    explanation:
      "Sohan Singh Bhakna was the first president, while Lala Har Dayal was the general secretary.",
  },
  {
    prompt: "The Ghadar Party was founded in which country?",
    answer: "United States of America",
    distractors: ["United Kingdom", "Germany", "Singapore"],
    explanation:
      "The party was founded at San Francisco in the United States by Punjabi immigrants.",
  },
]);

add("Punjab History", "Punjab Reorganisation", [
  {
    prompt: "The Punjab Reorganisation Act was passed in which year?",
    answer: "1966",
    distractors: ["1947", "1956", "1971"],
    explanation:
      "The Punjab Reorganisation Act, 1966 created Haryana and transferred hill areas to Himachal Pradesh.",
  },
  {
    prompt: "Which state was carved out of Punjab in 1966?",
    answer: "Haryana",
    distractors: ["Rajasthan", "Uttarakhand", "Jharkhand"],
    explanation: "Haryana was created on 1 November 1966 under the Punjab Reorganisation Act.",
  },
  {
    prompt: "Chandigarh currently serves as the capital of",
    answer: "Both Punjab and Haryana",
    distractors: ["Only Punjab", "Only Haryana", "Punjab and Himachal Pradesh"],
    explanation:
      "Chandigarh is a Union Territory serving as the joint capital of Punjab and Haryana.",
  },
]);

/* -------------------------------------------------------------- Punjab GK */

add("Punjab GK", "Districts and Headquarters", [
  {
    prompt: "Which city is the capital of Punjab?",
    answer: "Chandigarh",
    distractors: ["Ludhiana", "Amritsar", "Patiala"],
    explanation: "Chandigarh is the capital of Punjab and is administered as a Union Territory.",
  },
  {
    prompt: "Which is the largest city of Punjab by population?",
    answer: "Ludhiana",
    distractors: ["Amritsar", "Jalandhar", "Bathinda"],
    explanation: "Ludhiana is the largest city of Punjab and a major industrial centre.",
  },
  {
    prompt: "Sri Harmandir Sahib is located in which district?",
    answer: "Amritsar",
    distractors: ["Gurdaspur", "Tarn Taran", "Kapurthala"],
    explanation: "Sri Harmandir Sahib, the Golden Temple, is located in Amritsar district.",
  },
]);

add("Punjab GK", "Rivers and Canals", [
  {
    prompt: "Which three rivers flow through present-day Punjab?",
    answer: "Sutlej, Beas and Ravi",
    distractors: ["Ganga, Yamuna and Son", "Chenab, Jhelum and Indus", "Narmada, Tapi and Mahi"],
    explanation:
      "Of the five historic rivers, Sutlej, Beas and Ravi flow through Indian Punjab today.",
  },
  {
    prompt: "The Bhakra Dam is built on which river?",
    answer: "Sutlej",
    distractors: ["Beas", "Ravi", "Ghaggar"],
    explanation:
      "The Bhakra Dam is constructed on the Sutlej river and forms the Gobind Sagar reservoir.",
  },
  {
    prompt: "Pong Dam is constructed on which river?",
    answer: "Beas",
    distractors: ["Sutlej", "Ravi", "Chenab"],
    explanation:
      "Pong Dam, also called Beas Dam, is built on the Beas river in Himachal Pradesh and serves Punjab's irrigation.",
  },
]);

add("Punjab GK", "Folk Dances and Fairs", [
  {
    prompt: "Which is the well-known male folk dance of Punjab?",
    answer: "Bhangra",
    distractors: ["Giddha", "Garba", "Bihu"],
    explanation:
      "Bhangra is the energetic male folk dance of Punjab; Giddha is traditionally performed by women.",
  },
  {
    prompt: "Which festival marks the harvest season in Punjab?",
    answer: "Baisakhi",
    distractors: ["Onam", "Pongal", "Bihu"],
    explanation:
      "Baisakhi, celebrated in April, marks the harvest of rabi crops and the founding of the Khalsa.",
  },
  {
    prompt: "Lohri in Punjab is mainly associated with",
    answer: "The end of winter and the harvest of sugarcane season",
    distractors: ["The start of the monsoon", "The sowing of paddy", "Ganga Dussehra rituals"],
    explanation:
      "Lohri is celebrated in January, marking the passing of the winter solstice and the harvest season.",
  },
]);

add("Punjab GK", "Sports and Awards", [
  {
    prompt: "Milkha Singh, the famous athlete from Punjab, is known as",
    answer: "The Flying Sikh",
    distractors: ["The Wall", "The Hurricane", "The Punjab Express"],
    explanation: "Milkha Singh earned the title 'The Flying Sikh' for his sprinting achievements.",
  },
  {
    prompt: "Which traditional sport is strongly associated with rural Punjab?",
    answer: "Kabaddi",
    distractors: ["Water polo", "Ice hockey", "Sailing"],
    explanation: "Circle-style kabaddi is a hugely popular traditional rural sport in Punjab.",
  },
  {
    prompt: "India's highest sporting honour is now known as",
    answer: "Major Dhyan Chand Khel Ratna Award",
    distractors: ["Arjuna Award", "Dronacharya Award", "Padma Shri"],
    explanation:
      "The Rajiv Gandhi Khel Ratna was renamed the Major Dhyan Chand Khel Ratna Award in 2021.",
  },
]);

add("Punjab GK", "Important Places", [
  {
    prompt: "The Golden Temple is located in which city?",
    answer: "Amritsar",
    distractors: ["Ludhiana", "Patiala", "Chandigarh"],
    explanation: "Sri Harmandir Sahib, known as the Golden Temple, is in Amritsar.",
  },
  {
    prompt: "Wagah Border is located near which Punjab city?",
    answer: "Amritsar",
    distractors: ["Ferozepur", "Pathankot", "Fazilka"],
    explanation:
      "The Attari–Wagah border ceremony takes place near Amritsar on the India–Pakistan border.",
  },
  {
    prompt: "Qila Mubarak, a historic fort, is located in which Punjab city?",
    answer: "Bathinda",
    distractors: ["Jalandhar", "Moga", "Hoshiarpur"],
    explanation: "Qila Mubarak in Bathinda is one of the oldest surviving forts in India.",
  },
]);

add("Punjab GK", "Current Static GK", [
  {
    prompt: "What is the official language of Punjab?",
    answer: "Punjabi",
    distractors: ["Hindi", "Urdu", "English"],
    explanation: "Punjabi, written in the Gurmukhi script, is the official language of Punjab.",
  },
  {
    prompt: "Punjab was formed as a linguistic state in which year?",
    answer: "1966",
    distractors: ["1950", "1956", "1972"],
    explanation: "Punjab was reorganised on a linguistic basis on 1 November 1966.",
  },
  {
    prompt: "Which is the state animal of Punjab?",
    answer: "Blackbuck",
    distractors: ["Tiger", "Nilgai", "Sambar"],
    explanation:
      "The blackbuck is the state animal of Punjab and the northern goshawk is the state bird.",
  },
]);

/* ------------------------------------------------------- Punjab Geography */

add("Punjab Geography", "Malwa Majha Doaba Regions", [
  {
    prompt: "Punjab is traditionally divided into which three regions?",
    answer: "Malwa, Majha and Doaba",
    distractors: [
      "Konkan, Malabar and Deccan",
      "Terai, Bhabar and Bhangar",
      "Bundelkhand, Baghelkhand and Rohilkhand",
    ],
    explanation:
      "Punjab's cultural-geographic regions are Malwa (south of Sutlej), Majha (between Ravi and Beas) and Doaba (between Beas and Sutlej).",
  },
  {
    prompt: "The Doaba region of Punjab lies between which two rivers?",
    answer: "Beas and Sutlej",
    distractors: ["Ravi and Beas", "Sutlej and Ghaggar", "Ravi and Chenab"],
    explanation:
      "'Doaba' literally means the land between two waters — here the Beas and the Sutlej.",
  },
  {
    prompt: "The Majha region lies between which two rivers?",
    answer: "Ravi and Beas",
    distractors: ["Beas and Sutlej", "Sutlej and Yamuna", "Chenab and Jhelum"],
    explanation: "Majha lies between the Ravi and the Beas and includes Amritsar and Gurdaspur.",
  },
]);

add("Punjab Geography", "Rivers of Punjab", [
  {
    prompt: "Which is the longest river flowing through Punjab?",
    answer: "Sutlej",
    distractors: ["Beas", "Ravi", "Ghaggar"],
    explanation: "The Sutlej is the longest of the rivers flowing through Indian Punjab.",
  },
  {
    prompt: "The Beas river merges with the Sutlej at which place?",
    answer: "Harike",
    distractors: ["Ropar", "Ferozepur", "Nangal"],
    explanation:
      "The Beas joins the Sutlej at Harike, where the Harike wetland and barrage are located.",
  },
  {
    prompt: "The name 'Punjab' means the land of how many rivers?",
    answer: "Five",
    distractors: ["Three", "Four", "Seven"],
    explanation:
      "'Punj' means five and 'aab' means water, referring to the Sutlej, Beas, Ravi, Chenab and Jhelum.",
  },
]);

add("Punjab Geography", "Canal Irrigation", [
  {
    prompt: "Which type of irrigation dominates farming in Punjab along with tube wells?",
    answer: "Canal irrigation",
    distractors: ["Tank irrigation", "Drip-only irrigation", "Rain-fed farming only"],
    explanation: "Punjab relies heavily on an extensive canal network supplemented by tube wells.",
  },
  {
    prompt: "The Indira Gandhi Canal takes off from which barrage on the Sutlej-Beas system?",
    answer: "Harike Barrage",
    distractors: ["Ropar Barrage", "Hussainiwala Barrage", "Madhopur Barrage"],
    explanation:
      "The Indira Gandhi Canal originates from the Harike Barrage and irrigates parts of Rajasthan.",
  },
  {
    prompt: "The Upper Bari Doab Canal draws water from which river?",
    answer: "Ravi",
    distractors: ["Sutlej", "Beas", "Ghaggar"],
    explanation: "The Upper Bari Doab Canal is fed by the Ravi river at Madhopur headworks.",
  },
]);

add("Punjab Geography", "Soils and Crops", [
  {
    prompt: "Which two crops dominate Punjab's cropping pattern?",
    answer: "Wheat and rice",
    distractors: ["Tea and coffee", "Rubber and coconut", "Jute and mesta"],
    explanation:
      "Punjab's rabi-kharif cycle is dominated by wheat and paddy, making it a key contributor to the national food pool.",
  },
  {
    prompt: "Which soil type is most widespread in Punjab?",
    answer: "Alluvial soil",
    distractors: ["Black soil", "Laterite soil", "Peaty soil"],
    explanation:
      "Punjab lies in the Indo-Gangetic plain and is dominated by fertile alluvial soil.",
  },
  {
    prompt: "Wheat in Punjab is mainly grown in which cropping season?",
    answer: "Rabi",
    distractors: ["Kharif", "Zaid", "Monsoon only"],
    explanation: "Wheat is a rabi crop sown around October-November and harvested in March-April.",
  },
]);

add("Punjab Geography", "Climate", [
  {
    prompt: "Punjab experiences which type of climate?",
    answer: "Subtropical semi-arid with extreme seasons",
    distractors: ["Equatorial rainforest climate", "Mediterranean climate", "Polar tundra climate"],
    explanation:
      "Punjab has hot summers, cool winters and moderate monsoon rainfall, typical of a subtropical semi-arid zone.",
  },
  {
    prompt: "Most of Punjab's annual rainfall comes from",
    answer: "The south-west monsoon",
    distractors: [
      "The north-east monsoon",
      "Cyclonic storms from the Bay of Bengal",
      "Snowfall only",
    ],
    explanation:
      "Roughly three-quarters of Punjab's rain falls during the south-west monsoon between July and September.",
  },
  {
    prompt: "Winter rainfall in Punjab is mainly caused by",
    answer: "Western disturbances",
    distractors: ["Retreating monsoon", "Loo winds", "Tropical cyclones"],
    explanation: "Western disturbances bring light winter rain that benefits the rabi wheat crop.",
  },
]);

add("Punjab Geography", "Borders and Neighbouring States", [
  {
    prompt: "Punjab shares an international border with which country?",
    answer: "Pakistan",
    distractors: ["Nepal", "China", "Bangladesh"],
    explanation: "Punjab's western boundary is the international border with Pakistan.",
  },
  {
    prompt: "Which state lies to the south of Punjab?",
    answer: "Haryana",
    distractors: ["Himachal Pradesh", "Jammu and Kashmir", "Uttarakhand"],
    explanation:
      "Punjab is bordered by Haryana to the south and south-east, Himachal Pradesh to the east and Rajasthan to the south-west.",
  },
  {
    prompt: "Which union territory is surrounded by Punjab and Haryana?",
    answer: "Chandigarh",
    distractors: ["Delhi", "Ladakh", "Daman and Diu"],
    explanation:
      "Chandigarh is a Union Territory located between Punjab and Haryana and serves as capital of both.",
  },
]);

/* ------------------------------------------------------- Punjab Economics */

add("Punjab Economics", "Agriculture", [
  {
    prompt: "Punjab is often called by which name because of its farm output?",
    answer: "The granary of India",
    distractors: [
      "The spice garden of India",
      "The tea bowl of India",
      "The cotton island of India",
    ],
    explanation: "Punjab's high wheat and rice production earned it the title 'granary of India'.",
  },
  {
    prompt: "Which practice has caused falling groundwater levels in Punjab?",
    answer: "Excessive tube well irrigation for paddy",
    distractors: ["Rainwater harvesting", "Crop rotation with pulses", "Use of drip irrigation"],
    explanation:
      "Water-intensive paddy cultivation supported by free or cheap power has depleted groundwater in many blocks.",
  },
  {
    prompt: "Minimum Support Price (MSP) is announced mainly to",
    answer: "Assure farmers a guaranteed price for notified crops",
    distractors: [
      "Fix retail shop prices",
      "Control industrial wages",
      "Set export duties on machinery",
    ],
    explanation:
      "MSP protects farmers from price falls by guaranteeing procurement at a declared price.",
  },
]);

add("Punjab Economics", "Green Revolution", [
  {
    prompt: "The Green Revolution in India began in which decade?",
    answer: "1960s",
    distractors: ["1940s", "1980s", "2000s"],
    explanation:
      "The Green Revolution started in the mid-1960s with high-yielding variety seeds, fertilisers and assured irrigation.",
  },
  {
    prompt: "Who is known as the Father of the Green Revolution in India?",
    answer: "M. S. Swaminathan",
    distractors: ["Verghese Kurien", "Norman Borlaug only", "C. Subramaniam only"],
    explanation:
      "M. S. Swaminathan is called the Father of the Green Revolution in India for his work on high-yielding wheat varieties.",
  },
  {
    prompt: "Which crops benefited most from the Green Revolution in Punjab?",
    answer: "Wheat and rice",
    distractors: ["Tea and coffee", "Jute and cotton only", "Pulses and oilseeds"],
    explanation:
      "High-yielding varieties of wheat and later rice drove Punjab's production increase.",
  },
]);

add("Punjab Economics", "Industry and MSME", [
  {
    prompt: "Ludhiana in Punjab is best known for which industry?",
    answer: "Hosiery and bicycle manufacturing",
    distractors: ["Shipbuilding", "Petroleum refining only", "Diamond cutting"],
    explanation:
      "Ludhiana is a major hub for hosiery, woollens, bicycles and light engineering goods.",
  },
  {
    prompt: "MSME stands for",
    answer: "Micro, Small and Medium Enterprises",
    distractors: [
      "Managed State Market Enterprises",
      "Modern Service and Manufacturing Exports",
      "Ministry of State Market Economy",
    ],
    explanation:
      "MSMEs are classified by investment and turnover and form a major share of Punjab's industrial units.",
  },
  {
    prompt: "Jalandhar in Punjab is particularly famous for manufacturing",
    answer: "Sports goods",
    distractors: ["Aircraft parts", "Marine engines", "Solar panels only"],
    explanation:
      "Jalandhar is an internationally known centre for sports goods and leather products.",
  },
]);

add("Punjab Economics", "Budget Basics", [
  {
    prompt: "A government budget is mainly a statement of",
    answer: "Estimated receipts and expenditure for a financial year",
    distractors: ["Only past year profits", "Bank interest rates", "Company balance sheets"],
    explanation:
      "A budget presents estimated revenue and expenditure of the government for the coming financial year.",
  },
  {
    prompt: "Fiscal deficit is the excess of",
    answer: "Total expenditure over total receipts excluding borrowings",
    distractors: [
      "Exports over imports",
      "Savings over investment",
      "Revenue receipts over capital receipts",
    ],
    explanation: "Fiscal deficit indicates the total borrowing requirement of the government.",
  },
  {
    prompt: "India's financial year runs from",
    answer: "1 April to 31 March",
    distractors: ["1 January to 31 December", "1 July to 30 June", "1 October to 30 September"],
    explanation:
      "The Indian financial year begins on 1 April and ends on 31 March of the next calendar year.",
  },
]);

add("Punjab Economics", "Employment", [
  {
    prompt: "Unemployment where more workers are engaged than actually required is called",
    answer: "Disguised unemployment",
    distractors: ["Frictional unemployment", "Seasonal unemployment", "Cyclical unemployment"],
    explanation:
      "Disguised unemployment is common in agriculture, where removing some workers would not reduce output.",
  },
  {
    prompt: "MGNREGA guarantees how many days of wage employment per rural household per year?",
    answer: "100 days",
    distractors: ["50 days", "150 days", "200 days"],
    explanation:
      "The Mahatma Gandhi National Rural Employment Guarantee Act guarantees 100 days of unskilled wage employment.",
  },
  {
    prompt: "Unemployment that occurs only during certain months of the year is called",
    answer: "Seasonal unemployment",
    distractors: ["Structural unemployment", "Disguised unemployment", "Voluntary unemployment"],
    explanation:
      "Agricultural workers often face seasonal unemployment between sowing and harvesting periods.",
  },
]);

add("Punjab Economics", "Cooperative Sector", [
  {
    prompt: "A cooperative society is mainly based on the principle of",
    answer: "Voluntary membership and mutual help",
    distractors: [
      "Private monopoly profit",
      "Compulsory state ownership",
      "Foreign shareholding only",
    ],
    explanation:
      "Cooperatives are member-owned, democratic organisations formed for mutual economic benefit.",
  },
  {
    prompt: "Verka is a well-known cooperative brand of Punjab in which sector?",
    answer: "Milk and dairy products",
    distractors: ["Steel", "Cement", "Textiles"],
    explanation:
      "Verka is the brand of the Punjab State Cooperative Milk Producers' Federation (Milkfed).",
  },
  {
    prompt: "Primary Agricultural Credit Societies mainly provide",
    answer: "Short-term credit to farmers at the village level",
    distractors: [
      "Long-term industrial loans",
      "Foreign currency trading",
      "Mutual fund distribution only",
    ],
    explanation:
      "PACS are village-level cooperative units supplying short-term crop loans and farm inputs.",
  },
]);

/* ---------------------------------------------------------- Punjabi Paper A */

add("Punjabi Paper A", "ਪਠਨ ਬੋਧ", [
  {
    prompt:
      "ਪੜ੍ਹੋ: ‘ਪਿੰਡ ਦੀ ਲਾਇਬ੍ਰੇਰੀ ਸਵੇਰੇ ਨੌਂ ਵਜੇ ਖੁੱਲ੍ਹਦੀ ਹੈ ਅਤੇ ਸ਼ਾਮ ਪੰਜ ਵਜੇ ਬੰਦ ਹੁੰਦੀ ਹੈ।’ ਲਾਇਬ੍ਰੇਰੀ ਕਿੰਨੇ ਘੰਟੇ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ?",
    answer: "ਅੱਠ ਘੰਟੇ",
    distractors: ["ਛੇ ਘੰਟੇ", "ਨੌਂ ਘੰਟੇ", "ਦਸ ਘੰਟੇ"],
    explanation: "ਨੌਂ ਵਜੇ ਤੋਂ ਪੰਜ ਵਜੇ ਤੱਕ ਦਾ ਸਮਾਂ ਅੱਠ ਘੰਟੇ ਬਣਦਾ ਹੈ।",
  },
  {
    prompt: "ਪੜ੍ਹੋ: ‘ਰੁੱਖ ਹਵਾ ਸਾਫ਼ ਕਰਦੇ ਹਨ ਅਤੇ ਮਿੱਟੀ ਦੀ ਖੋਰ ਰੋਕਦੇ ਹਨ।’ ਇਸ ਵਾਕ ਦਾ ਮੁੱਖ ਭਾਵ ਕੀ ਹੈ?",
    answer: "ਰੁੱਖ ਵਾਤਾਵਰਣ ਲਈ ਲਾਭਦਾਇਕ ਹਨ",
    distractors: [
      "ਰੁੱਖ ਸਿਰਫ਼ ਛਾਂ ਦਿੰਦੇ ਹਨ",
      "ਰੁੱਖ ਮਿੱਟੀ ਖ਼ਰਾਬ ਕਰਦੇ ਹਨ",
      "ਰੁੱਖਾਂ ਦਾ ਹਵਾ ਨਾਲ ਸੰਬੰਧ ਨਹੀਂ",
    ],
    explanation: "ਵਾਕ ਵਿੱਚ ਰੁੱਖਾਂ ਦੇ ਦੋ ਵਾਤਾਵਰਣਕ ਲਾਭ ਦੱਸੇ ਗਏ ਹਨ।",
  },
  {
    prompt: "ਪਠਨ ਬੋਧ ਵਿੱਚ ਸਹੀ ਉੱਤਰ ਕਿਸ ਆਧਾਰ ਉੱਤੇ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ?",
    answer: "ਪੈਰੇ ਵਿੱਚ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਉੱਤੇ",
    distractors: [
      "ਆਪਣੀ ਨਿੱਜੀ ਰਾਇ ਦੇ ਆਧਾਰ ਉੱਤੇ",
      "ਵਿਕਲਪ ਦੀ ਲੰਬਾਈ ਦੇ ਆਧਾਰ ਉੱਤੇ",
      "ਸਿਰਫ਼ ਸਿਰਲੇਖ ਦੇ ਆਧਾਰ ਉੱਤੇ",
    ],
    explanation: "ਪਠਨ ਬੋਧ ਦਾ ਉੱਤਰ ਹਮੇਸ਼ਾ ਦਿੱਤੇ ਪੈਰੇ ਦੀ ਜਾਣਕਾਰੀ ਨਾਲ ਮਿਲਾ ਕੇ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।",
  },
]);

add("Punjabi Paper A", "ਪੱਤਰ ਲਿਖਣ", [
  {
    prompt: "ਸਰਕਾਰੀ ਦਫ਼ਤਰ ਨੂੰ ਲਿਖਿਆ ਜਾਣ ਵਾਲਾ ਪੱਤਰ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਹੁੰਦਾ ਹੈ?",
    answer: "ਸਰਕਾਰੀ ਪੱਤਰ",
    distractors: ["ਨਿੱਜੀ ਪੱਤਰ", "ਵਧਾਈ ਪੱਤਰ", "ਸੱਦਾ ਪੱਤਰ"],
    explanation: "ਦਫ਼ਤਰੀ ਕੰਮ ਲਈ ਲਿਖਿਆ ਪੱਤਰ ਸਰਕਾਰੀ ਜਾਂ ਦਫ਼ਤਰੀ ਪੱਤਰ ਕਹਾਉਂਦਾ ਹੈ।",
  },
  {
    prompt: "ਨਿੱਜੀ ਪੱਤਰ ਦੀ ਭਾਸ਼ਾ ਕਿਹੋ ਜਿਹੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?",
    answer: "ਸਰਲ ਅਤੇ ਆਪਣੱਤ ਭਰੀ",
    distractors: ["ਬਹੁਤ ਕਾਨੂੰਨੀ", "ਸਿਰਫ਼ ਅੰਗਰੇਜ਼ੀ ਮਿਸ਼ਰਿਤ", "ਬਿਲਕੁਲ ਰਸਮੀ ਅਤੇ ਸਖ਼ਤ"],
    explanation: "ਨਿੱਜੀ ਪੱਤਰ ਵਿੱਚ ਸਰਲ, ਆਤਮੀਯ ਭਾਸ਼ਾ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।",
  },
  {
    prompt: "ਦਫ਼ਤਰੀ ਪੱਤਰ ਵਿੱਚ ਵਿਸ਼ਾ (ਵਿਸ਼ਾ-ਸੂਚਨਾ) ਕਿੱਥੇ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ?",
    answer: "ਸੰਬੋਧਨ ਤੋਂ ਬਾਅਦ ਅਤੇ ਮੁੱਖ ਭਾਗ ਤੋਂ ਪਹਿਲਾਂ",
    distractors: ["ਪੱਤਰ ਦੇ ਅੰਤ ਵਿੱਚ", "ਦਸਤਖ਼ਤ ਤੋਂ ਬਾਅਦ", "ਪਤੇ ਤੋਂ ਪਹਿਲਾਂ"],
    explanation: "ਦਫ਼ਤਰੀ ਪੱਤਰ ਵਿੱਚ ‘ਵਿਸ਼ਾ’ ਸੰਬੋਧਨ ਤੋਂ ਬਾਅਦ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।",
  },
]);

add("Punjabi Paper A", "ਸੰਖੇਪ ਲਿਖਣ", [
  {
    prompt: "ਸੰਖੇਪ ਲਿਖਣ ਵਿੱਚ ਮੂਲ ਪੈਰੇ ਦਾ ਲਗਭਗ ਕਿੰਨਾ ਭਾਗ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ?",
    answer: "ਇੱਕ ਤਿਹਾਈ",
    distractors: ["ਪੂਰਾ", "ਦੋ ਤਿਹਾਈ", "ਨੌਂ ਦਸਵਾਂ"],
    explanation: "ਆਮ ਤੌਰ ਉੱਤੇ ਸੰਖੇਪ ਮੂਲ ਪੈਰੇ ਦਾ ਲਗਭਗ ਇੱਕ ਤਿਹਾਈ ਹੁੰਦਾ ਹੈ।",
  },
  {
    prompt: "ਸੰਖੇਪ ਲਿਖਣ ਸਮੇਂ ਕੀ ਨਹੀਂ ਕਰਨਾ ਚਾਹੀਦਾ?",
    answer: "ਆਪਣੀ ਨਵੀਂ ਜਾਣਕਾਰੀ ਜੋੜਨੀ",
    distractors: ["ਮੁੱਖ ਵਿਚਾਰ ਰੱਖਣੇ", "ਆਪਣੀ ਭਾਸ਼ਾ ਵਰਤਣੀ", "ਬੇਲੋੜੇ ਵੇਰਵੇ ਹਟਾਉਣੇ"],
    explanation: "ਸੰਖੇਪ ਵਿੱਚ ਨਵੀਂ ਜਾਣਕਾਰੀ ਜਾਂ ਨਿੱਜੀ ਰਾਇ ਨਹੀਂ ਜੋੜੀ ਜਾਂਦੀ।",
  },
  {
    prompt: "ਸੰਖੇਪ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਸ ਪੁਰਖ ਵਿੱਚ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ?",
    answer: "ਅਨਯ ਪੁਰਖ",
    distractors: ["ਉੱਤਮ ਪੁਰਖ", "ਮੱਧਮ ਪੁਰਖ", "ਕਿਸੇ ਵੀ ਪੁਰਖ"],
    explanation: "ਸੰਖੇਪ ਲਿਖਣ ਵਿੱਚ ਅਨਯ ਪੁਰਖ ਅਤੇ ਭੂਤਕਾਲ ਦੀ ਵਰਤੋਂ ਆਮ ਹੈ।",
  },
]);

add("Punjabi Paper A", "ਅਨੁਵਾਦ", [
  {
    prompt: "‘He is reading a book.’ ਦਾ ਸਹੀ ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਕੀ ਹੈ?",
    answer: "ਉਹ ਕਿਤਾਬ ਪੜ੍ਹ ਰਿਹਾ ਹੈ।",
    distractors: ["ਉਹ ਕਿਤਾਬ ਪੜ੍ਹੇਗਾ।", "ਉਸਨੇ ਕਿਤਾਬ ਪੜ੍ਹੀ।", "ਉਹ ਕਿਤਾਬ ਲਿਖ ਰਿਹਾ ਹੈ।"],
    explanation: "‘is reading’ ਲਗਾਤਾਰ ਵਰਤਮਾਨ ਕਾਲ ਹੈ, ਜਿਸਦਾ ਅਨੁਵਾਦ ‘ਪੜ੍ਹ ਰਿਹਾ ਹੈ’ ਹੁੰਦਾ ਹੈ।",
  },
  {
    prompt: "‘ਮੈਂ ਕੱਲ੍ਹ ਸਕੂਲ ਜਾਵਾਂਗਾ।’ ਦਾ ਸਹੀ ਅੰਗਰੇਜ਼ੀ ਅਨੁਵਾਦ ਕੀ ਹੈ?",
    answer: "I will go to school tomorrow.",
    distractors: [
      "I went to school tomorrow.",
      "I am going school yesterday.",
      "I have gone to school tomorrow.",
    ],
    explanation: "ਭਵਿੱਖ ਕਾਲ ਲਈ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ‘will go’ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    prompt: "ਅਨੁਵਾਦ ਕਰਦੇ ਸਮੇਂ ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ ਕੀ ਹੈ?",
    answer: "ਮੂਲ ਵਾਕ ਦਾ ਅਰਥ ਸਹੀ ਰੱਖਣਾ",
    distractors: ["ਹਰ ਸ਼ਬਦ ਦਾ ਸ਼ਬਦ-ਬ-ਸ਼ਬਦ ਅਨੁਵਾਦ", "ਵਾਕ ਲੰਮਾ ਕਰਨਾ", "ਨਵੇਂ ਵਿਚਾਰ ਜੋੜਨੇ"],
    explanation: "ਚੰਗਾ ਅਨੁਵਾਦ ਅਰਥ ਅਤੇ ਭਾਵ ਦੋਹਾਂ ਨੂੰ ਸਹੀ ਰੱਖਦਾ ਹੈ।",
  },
]);

add("Punjabi Paper A", "ਸ਼ਬਦਾਵਲੀ", [
  {
    prompt: "‘ਦਿਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕੀ ਹੈ?",
    answer: "ਰਾਤ",
    distractors: ["ਸਵੇਰ", "ਦੁਪਹਿਰ", "ਸ਼ਾਮ"],
    explanation: "‘ਦਿਨ’ ਦਾ ਉਲਟ ਅਰਥ ਵਾਲਾ ਸ਼ਬਦ ‘ਰਾਤ’ ਹੈ।",
  },
  {
    prompt: "‘ਪਾਣੀ’ ਦਾ ਸਮਾਨਾਰਥੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?",
    answer: "ਜਲ",
    distractors: ["ਅੱਗ", "ਧਰਤੀ", "ਹਵਾ"],
    explanation: "‘ਪਾਣੀ’ ਦੇ ਸਮਾਨਾਰਥੀ ਸ਼ਬਦ ਹਨ — ਜਲ, ਨੀਰ, ਅੰਬੁ।",
  },
  {
    prompt: "‘ਗਿਆਨ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕੀ ਹੈ?",
    answer: "ਅਗਿਆਨ",
    distractors: ["ਵਿਦਿਆ", "ਬੁੱਧੀ", "ਸਿੱਖਿਆ"],
    explanation: "‘ਅ’ ਅਗੇਤਰ ਲਾ ਕੇ ‘ਗਿਆਨ’ ਦਾ ਵਿਰੋਧੀ ‘ਅਗਿਆਨ’ ਬਣਦਾ ਹੈ।",
  },
]);

add("Punjabi Paper A", "ਸਰਕਾਰੀ ਭਾਸ਼ਾ", [
  {
    prompt: "ਪੰਜਾਬ ਰਾਜ ਦੀ ਸਰਕਾਰੀ ਭਾਸ਼ਾ ਕਿਹੜੀ ਹੈ?",
    answer: "ਪੰਜਾਬੀ",
    distractors: ["ਹਿੰਦੀ", "ਅੰਗਰੇਜ਼ੀ", "ਉਰਦੂ"],
    explanation: "ਪੰਜਾਬ ਰਾਜਭਾਸ਼ਾ ਐਕਟ ਅਨੁਸਾਰ ਪੰਜਾਬੀ ਸੂਬੇ ਦੀ ਸਰਕਾਰੀ ਭਾਸ਼ਾ ਹੈ।",
  },
  {
    prompt: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਕਿਹੜੀ ਲਿਪੀ ਵਿੱਚ ਲਿਖੀ ਜਾਂਦੀ ਹੈ?",
    answer: "ਗੁਰਮੁਖੀ",
    distractors: ["ਦੇਵਨਾਗਰੀ", "ਰੋਮਨ", "ਬੰਗਲਾ"],
    explanation: "ਭਾਰਤੀ ਪੰਜਾਬ ਵਿੱਚ ਪੰਜਾਬੀ ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ ਲਿਖੀ ਜਾਂਦੀ ਹੈ।",
  },
  {
    prompt: "ਪੰਜਾਬੀ ਸੰਵਿਧਾਨ ਦੀ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਸ਼ਾਮਲ ਹੈ?",
    answer: "ਅੱਠਵੀਂ ਅਨੁਸੂਚੀ",
    distractors: ["ਛੇਵੀਂ ਅਨੁਸੂਚੀ", "ਦਸਵੀਂ ਅਨੁਸੂਚੀ", "ਬਾਰ੍ਹਵੀਂ ਅਨੁਸੂਚੀ"],
    explanation: "ਪੰਜਾਬੀ ਸੰਵਿਧਾਨ ਦੀ ਅੱਠਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਦਰਜ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ।",
  },
]);

/* --------------------------------------------------------- Punjabi Grammar */

add("Punjabi Grammar", "ਨਾਵ ਅਤੇ ਪੜਨਾਵ", [
  {
    prompt: "‘ਮੈਂ’ ਸ਼ਬਦ ਕਿਹੜਾ ਪਦ ਹੈ?",
    answer: "ਪੜਨਾਵ",
    distractors: ["ਨਾਂਵ", "ਕਿਰਿਆ", "ਵਿਸ਼ੇਸ਼ਣ"],
    explanation: "ਜੋ ਸ਼ਬਦ ਨਾਂਵ ਦੀ ਥਾਂ ਵਰਤਿਆ ਜਾਵੇ, ਉਹ ਪੜਨਾਵ ਹੁੰਦਾ ਹੈ।",
  },
  {
    prompt: "‘ਅੰਮ੍ਰਿਤਸਰ’ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਨਾਂਵ ਹੈ?",
    answer: "ਖ਼ਾਸ ਨਾਂਵ",
    distractors: ["ਆਮ ਨਾਂਵ", "ਭਾਵ ਨਾਂਵ", "ਸਮੂਹ ਨਾਂਵ"],
    explanation: "ਕਿਸੇ ਵਿਸ਼ੇਸ਼ ਥਾਂ ਜਾਂ ਵਿਅਕਤੀ ਦਾ ਨਾਂ ਖ਼ਾਸ ਨਾਂਵ ਹੁੰਦਾ ਹੈ।",
  },
  {
    prompt: "‘ਸੁੰਦਰਤਾ’ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਨਾਂਵ ਹੈ?",
    answer: "ਭਾਵ ਨਾਂਵ",
    distractors: ["ਖ਼ਾਸ ਨਾਂਵ", "ਆਮ ਨਾਂਵ", "ਸਮੂਹ ਨਾਂਵ"],
    explanation: "ਗੁਣ ਜਾਂ ਭਾਵ ਦੱਸਣ ਵਾਲਾ ਨਾਂਵ ਭਾਵ ਨਾਂਵ ਕਹਾਉਂਦਾ ਹੈ।",
  },
]);

add("Punjabi Grammar", "ਲਿੰਗ ਅਤੇ ਵਚਨ", [
  {
    prompt: "‘ਘੋੜਾ’ ਦਾ ਇਸਤਰੀ ਲਿੰਗ ਰੂਪ ਕੀ ਹੈ?",
    answer: "ਘੋੜੀ",
    distractors: ["ਘੋੜੇ", "ਘੋੜਿਆਂ", "ਘੋੜਾਪਨ"],
    explanation: "‘ਘੋੜਾ’ ਪੁਲਿੰਗ ਹੈ ਅਤੇ ਇਸਦਾ ਇਸਤਰੀ ਲਿੰਗ ‘ਘੋੜੀ’ ਹੈ।",
  },
  {
    prompt: "‘ਕਿਤਾਬ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ਕੀ ਹੈ?",
    answer: "ਕਿਤਾਬਾਂ",
    distractors: ["ਕਿਤਾਬੀ", "ਕਿਤਾਬੇ", "ਕਿਤਾਬਪਨ"],
    explanation: "ਇਸਤਰੀ ਲਿੰਗ ਸ਼ਬਦਾਂ ਵਿੱਚ ਆਮ ਤੌਰ ਉੱਤੇ ‘ਆਂ’ ਲਾ ਕੇ ਬਹੁਵਚਨ ਬਣਦਾ ਹੈ।",
  },
  {
    prompt: "‘ਮੁੰਡਾ’ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ਕੀ ਹੈ?",
    answer: "ਮੁੰਡੇ",
    distractors: ["ਮੁੰਡੀ", "ਮੁੰਡਿਆ", "ਮੁੰਡਾਂ"],
    explanation: "‘ਆ’ ਅੰਤ ਵਾਲੇ ਪੁਲਿੰਗ ਸ਼ਬਦ ਬਹੁਵਚਨ ਵਿੱਚ ‘ਏ’ ਅੰਤ ਲੈਂਦੇ ਹਨ।",
  },
]);

add("Punjabi Grammar", "ਕਿਰਿਆ ਦੇ ਰੂਪ", [
  {
    prompt: "‘ਉਹ ਪੜ੍ਹ ਰਿਹਾ ਹੈ।’ ਵਿੱਚ ਕਿਹੜਾ ਕਾਲ ਹੈ?",
    answer: "ਵਰਤਮਾਨ ਕਾਲ",
    distractors: ["ਭੂਤ ਕਾਲ", "ਭਵਿੱਖ ਕਾਲ", "ਹੁਕਮੀ ਰੂਪ"],
    explanation: "‘ਰਿਹਾ ਹੈ’ ਲਗਾਤਾਰ ਵਰਤਮਾਨ ਕਾਲ ਦਾ ਰੂਪ ਹੈ।",
  },
  {
    prompt: "‘ਉਸਨੇ ਚਿੱਠੀ ਲਿਖੀ।’ ਵਿੱਚ ਕਿਰਿਆ ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਹੈ?",
    answer: "ਸਕਰਮਕ ਕਿਰਿਆ",
    distractors: ["ਅਕਰਮਕ ਕਿਰਿਆ", "ਸੰਯੁਕਤ ਕਿਰਿਆ", "ਪ੍ਰੇਰਣਾਰਥਕ ਕਿਰਿਆ"],
    explanation: "ਜਿਸ ਕਿਰਿਆ ਦਾ ਕਰਮ ਹੋਵੇ, ਉਹ ਸਕਰਮਕ ਕਿਰਿਆ ਹੁੰਦੀ ਹੈ; ਇੱਥੇ ‘ਚਿੱਠੀ’ ਕਰਮ ਹੈ।",
  },
  {
    prompt: "‘ਅਸੀਂ ਕੱਲ੍ਹ ਜਾਵਾਂਗੇ।’ ਵਿੱਚ ਕਿਹੜਾ ਕਾਲ ਹੈ?",
    answer: "ਭਵਿੱਖ ਕਾਲ",
    distractors: ["ਵਰਤਮਾਨ ਕਾਲ", "ਭੂਤ ਕਾਲ", "ਸੰਭਾਵੀ ਭੂਤ"],
    explanation: "‘ਜਾਵਾਂਗੇ’ ਭਵਿੱਖ ਵਿੱਚ ਹੋਣ ਵਾਲੇ ਕੰਮ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।",
  },
]);

add("Punjabi Grammar", "ਵਾਕ ਸੁਧਾਰ", [
  {
    prompt: "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸ਼ੁੱਧ ਵਾਕ ਕਿਹੜਾ ਹੈ?",
    answer: "ਮੈਂ ਸਕੂਲ ਜਾ ਰਿਹਾ ਹਾਂ।",
    distractors: ["ਮੈਂ ਸਕੂਲ ਜਾ ਰਿਹਾ ਹੈ।", "ਮੈਂ ਸਕੂਲ ਜਾ ਰਹੇ ਹਾਂ।", "ਮੈਂ ਸਕੂਲ ਜਾ ਰਹੀ ਹੈ।"],
    explanation: "‘ਮੈਂ’ ਉੱਤਮ ਪੁਰਖ ਇਕਵਚਨ ਹੈ, ਇਸ ਲਈ ਕਿਰਿਆ ‘ਜਾ ਰਿਹਾ ਹਾਂ’ ਸਹੀ ਹੈ।",
  },
  {
    prompt: "ਲਿੰਗ-ਵਚਨ ਪੱਖੋਂ ਸ਼ੁੱਧ ਵਾਕ ਚੁਣੋ।",
    answer: "ਕੁੜੀਆਂ ਖੇਡ ਰਹੀਆਂ ਹਨ।",
    distractors: ["ਕੁੜੀਆਂ ਖੇਡ ਰਿਹਾ ਹੈ।", "ਕੁੜੀਆਂ ਖੇਡ ਰਹੀ ਹੈ।", "ਕੁੜੀਆਂ ਖੇਡ ਰਹੇ ਹਨ।"],
    explanation: "ਬਹੁਵਚਨ ਇਸਤਰੀ ਲਿੰਗ ਕਰਤਾ ਨਾਲ ‘ਰਹੀਆਂ ਹਨ’ ਰੂਪ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    prompt: "ਕਿਰਿਆ ਦੇ ਸਹੀ ਰੂਪ ਵਾਲਾ ਵਾਕ ਚੁਣੋ।",
    answer: "ਉਸਨੇ ਮੈਨੂੰ ਕਿਤਾਬ ਦਿੱਤੀ।",
    distractors: ["ਉਸਨੇ ਮੈਨੂੰ ਕਿਤਾਬ ਦਿੱਤਾ।", "ਉਸ ਮੈਨੂੰ ਕਿਤਾਬ ਦਿੱਤੀ।", "ਉਸਨੇ ਮੈਂ ਕਿਤਾਬ ਦਿੱਤੀ।"],
    explanation: "‘ਕਿਤਾਬ’ ਇਸਤਰੀ ਲਿੰਗ ਹੈ, ਇਸ ਲਈ ਕਿਰਿਆ ‘ਦਿੱਤੀ’ ਸਹੀ ਹੈ।",
  },
]);

add("Punjabi Grammar", "ਮੁਹਾਵਰੇ", [
  {
    prompt: "‘ਅੱਖਾਂ ਦਾ ਤਾਰਾ ਹੋਣਾ’ ਮੁਹਾਵਰੇ ਦਾ ਅਰਥ ਕੀ ਹੈ?",
    answer: "ਬਹੁਤ ਪਿਆਰਾ ਹੋਣਾ",
    distractors: ["ਡਰ ਜਾਣਾ", "ਦੂਰ ਚਲੇ ਜਾਣਾ", "ਗੁੱਸੇ ਹੋਣਾ"],
    explanation: "ਇਹ ਮੁਹਾਵਰਾ ਬਹੁਤ ਪਿਆਰੇ ਵਿਅਕਤੀ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    prompt: "‘ਹੱਥ ਖੜ੍ਹੇ ਕਰਨਾ’ ਦਾ ਅਰਥ ਕੀ ਹੈ?",
    answer: "ਅਸਮਰੱਥਾ ਪ੍ਰਗਟ ਕਰਨੀ",
    distractors: ["ਖ਼ੁਸ਼ ਹੋਣਾ", "ਲੜਾਈ ਕਰਨੀ", "ਦੌੜ ਜਿੱਤਣੀ"],
    explanation: "ਜਦੋਂ ਕੋਈ ਕੰਮ ਕਰਨ ਤੋਂ ਅਸਮਰੱਥ ਹੋਵੇ ਤਾਂ ਇਹ ਮੁਹਾਵਰਾ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    prompt: "‘ਨੱਕ ਵਿੱਚ ਦਮ ਕਰਨਾ’ ਦਾ ਅਰਥ ਕੀ ਹੈ?",
    answer: "ਬਹੁਤ ਤੰਗ ਕਰਨਾ",
    distractors: ["ਮਦਦ ਕਰਨੀ", "ਸਲਾਹ ਦੇਣੀ", "ਚੁੱਪ ਰਹਿਣਾ"],
    explanation: "ਇਹ ਮੁਹਾਵਰਾ ਕਿਸੇ ਨੂੰ ਬਹੁਤ ਪਰੇਸ਼ਾਨ ਕਰਨ ਦੇ ਅਰਥ ਵਿੱਚ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
  },
]);

add("Punjabi Grammar", "ਸਮਾਨਾਰਥੀ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ", [
  {
    prompt: "‘ਸੂਰਜ’ ਦਾ ਸਮਾਨਾਰਥੀ ਸ਼ਬਦ ਕਿਹੜਾ ਹੈ?",
    answer: "ਭਾਨੂ",
    distractors: ["ਚੰਦ", "ਤਾਰਾ", "ਬੱਦਲ"],
    explanation: "‘ਸੂਰਜ’ ਦੇ ਸਮਾਨਾਰਥੀ ਸ਼ਬਦ ਹਨ — ਭਾਨੂ, ਰਵੀ, ਦਿਨਕਰ।",
  },
  {
    prompt: "‘ਅਮੀਰ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕੀ ਹੈ?",
    answer: "ਗ਼ਰੀਬ",
    distractors: ["ਧਨੀ", "ਸ਼ਾਹੂਕਾਰ", "ਵੱਡਾ"],
    explanation: "‘ਅਮੀਰ’ ਦਾ ਉਲਟ ਅਰਥ ਵਾਲਾ ਸ਼ਬਦ ‘ਗ਼ਰੀਬ’ ਹੈ।",
  },
  {
    prompt: "‘ਜਿੱਤ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਕੀ ਹੈ?",
    answer: "ਹਾਰ",
    distractors: ["ਸਫਲਤਾ", "ਵਿਜੈ", "ਖ਼ੁਸ਼ੀ"],
    explanation: "‘ਜਿੱਤ’ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ‘ਹਾਰ’ ਹੈ; ਬਾਕੀ ਸਮਾਨਾਰਥੀ ਹਨ।",
  },
]);

/* ------------------------------------------------------ Punjabi Literature */

add("Punjabi Literature", "ਕਵਿਤਾ", [
  {
    prompt: "‘ਸੁਨੇਹੜੇ’ ਕਾਵਿ-ਸੰਗ੍ਰਹਿ ਕਿਸ ਦੀ ਰਚਨਾ ਹੈ?",
    answer: "ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ",
    distractors: ["ਸ਼ਿਵ ਕੁਮਾਰ ਬਟਾਲਵੀ", "ਪ੍ਰੋ. ਮੋਹਨ ਸਿੰਘ", "ਭਾਈ ਵੀਰ ਸਿੰਘ"],
    explanation: "‘ਸੁਨੇਹੜੇ’ ਲਈ ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ ਨੂੰ ਸਾਹਿਤ ਅਕਾਦਮੀ ਪੁਰਸਕਾਰ ਮਿਲਿਆ ਸੀ।",
  },
  {
    prompt: "ਪੰਜਾਬੀ ਕਵਿਤਾ ਵਿੱਚ ‘ਬਿਰਹਾ ਦਾ ਸੁਲਤਾਨ’ ਕਿਸਨੂੰ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
    answer: "ਸ਼ਿਵ ਕੁਮਾਰ ਬਟਾਲਵੀ",
    distractors: ["ਪ੍ਰੋ. ਪੂਰਨ ਸਿੰਘ", "ਧਨੀ ਰਾਮ ਚਾਤ੍ਰਿਕ", "ਨਾਨਕ ਸਿੰਘ"],
    explanation: "ਸ਼ਿਵ ਕੁਮਾਰ ਬਟਾਲਵੀ ਨੂੰ ਬਿਰਹਾ ਦੀ ਕਵਿਤਾ ਕਰਕੇ ਇਹ ਪਦਵੀ ਮਿਲੀ।",
  },
  {
    prompt: "‘ਹੀਰ’ ਦੀ ਪ੍ਰਸਿੱਧ ਕਿੱਸਾ-ਰਚਨਾ ਕਿਸਨੇ ਕੀਤੀ?",
    answer: "ਵਾਰਿਸ ਸ਼ਾਹ",
    distractors: ["ਬੁੱਲ੍ਹੇ ਸ਼ਾਹ", "ਸ਼ਾਹ ਹੁਸੈਨ", "ਹਾਸ਼ਮ ਸ਼ਾਹ"],
    explanation: "ਵਾਰਿਸ ਸ਼ਾਹ ਦੀ ‘ਹੀਰ’ ਪੰਜਾਬੀ ਕਿੱਸਾ ਸਾਹਿਤ ਦੀ ਸਿਖਰ ਮੰਨੀ ਜਾਂਦੀ ਹੈ।",
  },
]);

add("Punjabi Literature", "ਗਦ", [
  {
    prompt: "ਪੰਜਾਬੀ ਦਾ ਪਹਿਲਾ ਆਧੁਨਿਕ ਨਾਵਲ ‘ਸੁੰਦਰੀ’ ਕਿਸਨੇ ਲਿਖਿਆ?",
    answer: "ਭਾਈ ਵੀਰ ਸਿੰਘ",
    distractors: ["ਨਾਨਕ ਸਿੰਘ", "ਗੁਰਬਖ਼ਸ਼ ਸਿੰਘ ਪ੍ਰੀਤਲੜੀ", "ਜਸਵੰਤ ਸਿੰਘ ਕੰਵਲ"],
    explanation: "ਭਾਈ ਵੀਰ ਸਿੰਘ ਦੀ ‘ਸੁੰਦਰੀ’ (1898) ਪੰਜਾਬੀ ਦਾ ਪਹਿਲਾ ਆਧੁਨਿਕ ਨਾਵਲ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  {
    prompt: "ਪੰਜਾਬੀ ਨਾਵਲ ਦਾ ਪਿਤਾਮਾ ਕਿਸਨੂੰ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
    answer: "ਨਾਨਕ ਸਿੰਘ",
    distractors: ["ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ", "ਸੰਤ ਸਿੰਘ ਸੇਖੋਂ", "ਬਲਵੰਤ ਗਾਰਗੀ"],
    explanation: "ਨਾਨਕ ਸਿੰਘ ਨੂੰ ਪੰਜਾਬੀ ਨਾਵਲ ਦਾ ਪਿਤਾਮਾ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",
  },
  {
    prompt: "ਪੰਜਾਬੀ ਨਾਟਕ ਖੇਤਰ ਦਾ ਪ੍ਰਸਿੱਧ ਨਾਂ ਕਿਹੜਾ ਹੈ?",
    answer: "ਬਲਵੰਤ ਗਾਰਗੀ",
    distractors: ["ਵਾਰਿਸ ਸ਼ਾਹ", "ਧਨੀ ਰਾਮ ਚਾਤ੍ਰਿਕ", "ਸ਼ਿਵ ਕੁਮਾਰ ਬਟਾਲਵੀ"],
    explanation: "ਬਲਵੰਤ ਗਾਰਗੀ ਪੰਜਾਬੀ ਨਾਟਕ ਅਤੇ ਰੰਗਮੰਚ ਦੇ ਮਹੱਤਵਪੂਰਨ ਲੇਖਕ ਸਨ।",
  },
]);

add("Punjabi Literature", "ਲੇਖਕ ਅਤੇ ਰਚਨਾਵਾਂ", [
  {
    prompt: "‘ਪਿੰਜਰ’ ਨਾਵਲ ਕਿਸਦੀ ਰਚਨਾ ਹੈ?",
    answer: "ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ",
    distractors: ["ਨਾਨਕ ਸਿੰਘ", "ਕਰਤਾਰ ਸਿੰਘ ਦੁੱਗਲ", "ਗੁਰਦਿਆਲ ਸਿੰਘ"],
    explanation: "‘ਪਿੰਜਰ’ ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ ਦਾ ਪ੍ਰਸਿੱਧ ਨਾਵਲ ਹੈ।",
  },
  {
    prompt: "‘ਮੜ੍ਹੀ ਦਾ ਦੀਵਾ’ ਨਾਵਲ ਦੇ ਲੇਖਕ ਕੌਣ ਹਨ?",
    answer: "ਗੁਰਦਿਆਲ ਸਿੰਘ",
    distractors: ["ਜਸਵੰਤ ਸਿੰਘ ਕੰਵਲ", "ਸੰਤ ਸਿੰਘ ਸੇਖੋਂ", "ਮੋਹਨ ਸਿੰਘ"],
    explanation: "ਗੁਰਦਿਆਲ ਸਿੰਘ ਨੂੰ ਪੰਜਾਬੀ ਸਾਹਿਤ ਲਈ ਗਿਆਨਪੀਠ ਪੁਰਸਕਾਰ ਵੀ ਮਿਲਿਆ।",
  },
  {
    prompt: "‘ਅੱਜ ਆਖਾਂ ਵਾਰਿਸ ਸ਼ਾਹ ਨੂੰ’ ਕਵਿਤਾ ਕਿਸਨੇ ਲਿਖੀ?",
    answer: "ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ",
    distractors: ["ਸ਼ਿਵ ਕੁਮਾਰ ਬਟਾਲਵੀ", "ਪਾਸ਼", "ਸੁਰਜੀਤ ਪਾਤਰ"],
    explanation: "ਇਹ ਕਵਿਤਾ ਵੰਡ ਦੇ ਦੁਖਾਂਤ ਉੱਤੇ ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ ਦੀ ਸਭ ਤੋਂ ਪ੍ਰਸਿੱਧ ਰਚਨਾ ਹੈ।",
  },
]);

add("Punjabi Literature", "ਵਿਸ਼ੇ", [
  {
    prompt: "ਅੰਮ੍ਰਿਤਾ ਪ੍ਰੀਤਮ ਦੀ ਰਚਨਾ ‘ਪਿੰਜਰ’ ਦਾ ਮੁੱਖ ਵਿਸ਼ਾ ਕੀ ਹੈ?",
    answer: "ਵੰਡ ਸਮੇਂ ਔਰਤਾਂ ਦਾ ਦੁਖਾਂਤ",
    distractors: ["ਖੇਤੀ ਤਕਨੀਕ", "ਸ਼ਹਿਰੀ ਵਪਾਰ", "ਖੇਡ ਮੁਕਾਬਲੇ"],
    explanation: "‘ਪਿੰਜਰ’ 1947 ਦੀ ਵੰਡ ਅਤੇ ਔਰਤਾਂ ਉੱਤੇ ਹੋਏ ਅਤਿਆਚਾਰ ਨੂੰ ਪੇਸ਼ ਕਰਦਾ ਹੈ।",
  },
  {
    prompt: "ਪੰਜਾਬੀ ਕਿੱਸਾ ਸਾਹਿਤ ਦਾ ਮੁੱਖ ਵਿਸ਼ਾ ਆਮ ਤੌਰ ਉੱਤੇ ਕੀ ਰਿਹਾ ਹੈ?",
    answer: "ਪ੍ਰੇਮ-ਕਥਾਵਾਂ ਅਤੇ ਸਮਾਜਿਕ ਸੰਘਰਸ਼",
    distractors: ["ਸਿਰਫ਼ ਵਿਗਿਆਨ", "ਸਿਰਫ਼ ਵਪਾਰ", "ਸਿਰਫ਼ ਯਾਤਰਾ ਵਰਣਨ"],
    explanation: "ਹੀਰ-ਰਾਂਝਾ, ਸੱਸੀ-ਪੁੰਨੂੰ ਵਰਗੇ ਕਿੱਸੇ ਪ੍ਰੇਮ ਅਤੇ ਸਮਾਜਿਕ ਟਕਰਾਅ ਉੱਤੇ ਆਧਾਰਿਤ ਹਨ।",
  },
  {
    prompt: "ਪ੍ਰਗਤੀਵਾਦੀ ਪੰਜਾਬੀ ਸਾਹਿਤ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕਿਸ ਗੱਲ ਉੱਤੇ ਜ਼ੋਰ ਦਿੰਦਾ ਹੈ?",
    answer: "ਸਮਾਜਿਕ ਬਰਾਬਰੀ ਅਤੇ ਕਿਰਤੀ ਵਰਗ",
    distractors: ["ਰਾਜ ਦਰਬਾਰ ਦੀ ਪ੍ਰਸ਼ੰਸਾ", "ਕੇਵਲ ਧਾਰਮਿਕ ਕਰਮਕਾਂਡ", "ਕੇਵਲ ਪ੍ਰਕਿਰਤੀ ਵਰਣਨ"],
    explanation: "ਪ੍ਰਗਤੀਵਾਦੀ ਲਹਿਰ ਸਮਾਜਿਕ ਨਾਬਰਾਬਰੀ ਅਤੇ ਕਿਰਤੀ ਜਮਾਤ ਦੇ ਸੰਘਰਸ਼ ਨੂੰ ਵਿਸ਼ਾ ਬਣਾਉਂਦੀ ਹੈ।",
  },
]);

add("Punjabi Literature", "ਸਾਹਿਤਕ ਅਲੰਕਾਰ", [
  {
    prompt: "‘ਉਹ ਫੁੱਲ ਵਾਂਗ ਸੁੰਦਰ ਹੈ।’ ਵਿੱਚ ਕਿਹੜਾ ਅਲੰਕਾਰ ਹੈ?",
    answer: "ਉਪਮਾ",
    distractors: ["ਰੂਪਕ", "ਅਨੁਪ੍ਰਾਸ", "ਅਤਿਕਥਨੀ"],
    explanation: "‘ਵਾਂਗ’ ਸ਼ਬਦ ਨਾਲ ਤੁਲਨਾ ਹੋਣ ਕਰਕੇ ਇਹ ਉਪਮਾ ਅਲੰਕਾਰ ਹੈ।",
  },
  {
    prompt: "‘ਮੁੱਖ ਚੰਦ ਹੈ।’ ਵਿੱਚ ਕਿਹੜਾ ਅਲੰਕਾਰ ਹੈ?",
    answer: "ਰੂਪਕ",
    distractors: ["ਉਪਮਾ", "ਸ਼ਲੇਸ਼", "ਯਮਕ"],
    explanation: "ਜਿੱਥੇ ਉਪਮੇਯ ਨੂੰ ਸਿੱਧਾ ਉਪਮਾਨ ਕਹਿ ਦਿੱਤਾ ਜਾਵੇ, ਉੱਥੇ ਰੂਪਕ ਅਲੰਕਾਰ ਹੁੰਦਾ ਹੈ।",
  },
  {
    prompt: "ਇੱਕੋ ਅੱਖਰ ਦੀ ਵਾਰ-ਵਾਰ ਆਵ੍ਰਿਤੀ ਨਾਲ ਕਿਹੜਾ ਅਲੰਕਾਰ ਬਣਦਾ ਹੈ?",
    answer: "ਅਨੁਪ੍ਰਾਸ",
    distractors: ["ਉਪਮਾ", "ਰੂਪਕ", "ਵਿਰੋਧਾਭਾਸ"],
    explanation: "ਵਿਅੰਜਨ ਦੀ ਦੁਹਰਾਈ ਨਾਲ ਅਨੁਪ੍ਰਾਸ ਅਲੰਕਾਰ ਬਣਦਾ ਹੈ।",
  },
]);

add("Punjabi Literature", "ਸਾਹਿਤ ਵਿੱਚ ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ", [
  {
    prompt: "ਪੰਜਾਬੀ ਲੋਕ-ਗੀਤਾਂ ਵਿੱਚ ‘ਬੋਲੀਆਂ’ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਸ ਮੌਕੇ ਗਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ?",
    answer: "ਵਿਆਹ ਅਤੇ ਖ਼ੁਸ਼ੀ ਦੇ ਮੌਕਿਆਂ ਉੱਤੇ",
    distractors: ["ਸਿਰਫ਼ ਸੋਗ ਸਮੇਂ", "ਸਿਰਫ਼ ਪ੍ਰੀਖਿਆ ਸਮੇਂ", "ਸਿਰਫ਼ ਯਾਤਰਾ ਸਮੇਂ"],
    explanation: "ਬੋਲੀਆਂ ਗਿੱਧੇ ਅਤੇ ਵਿਆਹ ਵਰਗੇ ਖ਼ੁਸ਼ੀ ਦੇ ਮੌਕਿਆਂ ਦਾ ਹਿੱਸਾ ਹਨ।",
  },
  {
    prompt: "‘ਸੁਹਾਗ’ ਅਤੇ ‘ਘੋੜੀਆਂ’ ਕਿਸ ਮੌਕੇ ਦੇ ਲੋਕ-ਗੀਤ ਹਨ?",
    answer: "ਵਿਆਹ",
    distractors: ["ਵਾਢੀ", "ਲੋਹੜੀ", "ਮੇਲਾ"],
    explanation: "ਸੁਹਾਗ ਕੁੜੀ ਦੇ ਅਤੇ ਘੋੜੀਆਂ ਮੁੰਡੇ ਦੇ ਵਿਆਹ ਨਾਲ ਜੁੜੇ ਲੋਕ-ਗੀਤ ਹਨ।",
  },
  {
    prompt: "ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ ਵਿੱਚ ‘ਤੀਆਂ’ ਦਾ ਤਿਉਹਾਰ ਕਿਸ ਮਹੀਨੇ ਨਾਲ ਜੁੜਿਆ ਹੈ?",
    answer: "ਸਾਵਣ",
    distractors: ["ਮਾਘ", "ਚੇਤ", "ਪੋਹ"],
    explanation: "ਤੀਆਂ ਸਾਵਣ ਮਹੀਨੇ ਦਾ ਤਿਉਹਾਰ ਹੈ, ਜਿਸ ਵਿੱਚ ਕੁੜੀਆਂ ਗਿੱਧਾ ਪਾਉਂਦੀਆਂ ਹਨ।",
  },
]);

/* ---------------------------------------------------------------- Commerce */

add("Commerce", "Accounting Equation", [
  {
    prompt: "The accounting equation is",
    answer: "Assets = Liabilities + Capital",
    distractors: [
      "Assets = Liabilities - Capital",
      "Capital = Assets + Liabilities",
      "Liabilities = Assets + Capital",
    ],
    explanation: "Every transaction keeps the equation Assets = Liabilities + Capital in balance.",
  },
  {
    prompt: "If assets are ₹80,000 and liabilities are ₹30,000, what is the capital?",
    answer: "₹50,000",
    distractors: ["₹110,000", "₹30,000", "₹80,000"],
    explanation: "Capital = Assets − Liabilities = 80,000 − 30,000 = ₹50,000.",
  },
  {
    prompt: "Purchase of machinery for cash will",
    answer: "Change the composition of assets without changing the total",
    distractors: ["Increase total assets", "Decrease capital", "Increase liabilities"],
    explanation:
      "One asset (cash) decreases while another asset (machinery) increases by the same amount.",
  },
]);

add("Commerce", "Journal Entries", [
  {
    prompt: "According to the modern rules of accounting, an increase in expense is",
    answer: "Debited",
    distractors: ["Credited", "Ignored", "Recorded only in the ledger"],
    explanation: "Under the modern approach, expenses and assets are debited when they increase.",
  },
  {
    prompt: "Goods sold for cash will be recorded as",
    answer: "Cash A/c Dr., To Sales A/c",
    distractors: [
      "Sales A/c Dr., To Cash A/c",
      "Purchase A/c Dr., To Cash A/c",
      "Cash A/c Dr., To Capital A/c",
    ],
    explanation: "Cash (asset) increases so it is debited, and Sales (income) is credited.",
  },
  {
    prompt: "The book of original entry is called",
    answer: "Journal",
    distractors: ["Ledger", "Trial balance", "Balance sheet"],
    explanation: "Transactions are first recorded in the journal, then posted to the ledger.",
  },
]);

add("Commerce", "Business Law", [
  {
    prompt: "Which of these is essential for a valid contract?",
    answer: "Free consent of the parties",
    distractors: ["An unlawful object", "Absence of consideration", "Incapacity of both parties"],
    explanation:
      "Section 10 of the Indian Contract Act requires free consent, lawful consideration, lawful object and competent parties.",
  },
  {
    prompt: "An agreement enforceable by law is called a",
    answer: "Contract",
    distractors: ["Proposal", "Invitation to offer", "Mere promise"],
    explanation:
      "Section 2(h) of the Indian Contract Act, 1872 defines a contract as an agreement enforceable by law.",
  },
  {
    prompt: "A contract with a minor in India is",
    answer: "Void ab initio",
    distractors: ["Valid", "Voidable at the minor's option", "Illegal but enforceable"],
    explanation:
      "As held in Mohori Bibee v. Dharmodas Ghose, an agreement with a minor is void from the beginning.",
  },
]);

add("Commerce", "Economics Demand Supply", [
  {
    prompt: "According to the law of demand, when price rises, quantity demanded generally",
    answer: "Falls",
    distractors: ["Rises", "Remains constant always", "Becomes zero immediately"],
    explanation:
      "Other things remaining equal, price and quantity demanded move in opposite directions.",
  },
  {
    prompt: "The demand curve normally slopes",
    answer: "Downward from left to right",
    distractors: ["Upward from left to right", "Vertically", "Horizontally at all prices"],
    explanation:
      "The inverse relation between price and quantity demanded gives a downward sloping demand curve.",
  },
  {
    prompt: "Equilibrium price in a market is determined where",
    answer: "Quantity demanded equals quantity supplied",
    distractors: ["Demand is highest", "Supply is highest", "Government fixes it always"],
    explanation: "Market equilibrium occurs at the intersection of the demand and supply curves.",
  },
]);

add("Commerce", "Business Mathematics", [
  {
    prompt: "An article costing ₹800 is sold at 25% profit. What is the selling price?",
    answer: "₹1,000",
    distractors: ["₹825", "₹960", "₹1,200"],
    explanation: "Profit = 25% of 800 = ₹200, so SP = 800 + 200 = ₹1,000.",
  },
  {
    prompt: "Find simple interest on ₹5,000 at 8% per annum for 2 years.",
    answer: "₹800",
    distractors: ["₹400", "₹1,000", "₹1,600"],
    explanation: "SI = P × R × T / 100 = 5000 × 8 × 2 / 100 = ₹800.",
  },
  {
    prompt:
      "A shopkeeper allows a 10% discount on a marked price of ₹2,500. What is the sale price?",
    answer: "₹2,250",
    distractors: ["₹2,400", "₹2,000", "₹2,750"],
    explanation: "Discount = 10% of 2500 = ₹250, so sale price = 2500 − 250 = ₹2,250.",
  },
]);

add("Commerce", "Partnership Basics", [
  {
    prompt: "In the absence of a partnership deed, profits are shared",
    answer: "Equally among partners",
    distractors: ["In capital ratio", "In the ratio of time devoted", "Only by the senior partner"],
    explanation:
      "The Indian Partnership Act, 1932 provides for equal profit sharing when the deed is silent.",
  },
  {
    prompt:
      "In the absence of an agreement, interest on a partner's loan to the firm is allowed at",
    answer: "6% per annum",
    distractors: ["5% per annum", "9% per annum", "12% per annum"],
    explanation: "When the deed is silent, a partner's loan carries interest at 6% per annum.",
  },
  {
    prompt:
      "What is the maximum number of partners allowed in a firm under the Companies Act rules?",
    answer: "50",
    distractors: ["10", "20", "100"],
    explanation:
      "The Companies (Miscellaneous) Rules, 2014 set the maximum number of partners at 50.",
  },
]);

/* -------------------------------------------------------------------- Law */

add("Law", "Constitutional Law", [
  {
    prompt: "Which writ is issued to a public official to perform a public duty?",
    answer: "Mandamus",
    distractors: ["Habeas Corpus", "Certiorari", "Quo Warranto"],
    explanation:
      "Mandamus commands a public authority to perform a duty that it has failed to perform.",
  },
  {
    prompt: "Under which Article can a High Court issue writs?",
    answer: "Article 226",
    distractors: ["Article 32", "Article 136", "Article 143"],
    explanation:
      "Article 226 empowers High Courts to issue writs for Fundamental Rights and other purposes, giving them a wider scope than Article 32.",
  },
  {
    prompt: "Which writ is issued to challenge a person holding a public office unlawfully?",
    answer: "Quo Warranto",
    distractors: ["Mandamus", "Prohibition", "Habeas Corpus"],
    explanation:
      "Quo Warranto questions the legal authority of a person occupying a public office.",
  },
]);

add("Law", "Legal Reasoning", [
  {
    prompt:
      "Principle: A person who intentionally causes harm to another's property is liable. Facts: Ravi accidentally drops a glass while helping a shopkeeper. Is Ravi liable?",
    answer: "No, because the act was not intentional",
    distractors: [
      "Yes, because the glass broke",
      "Yes, because he was in the shop",
      "No, because glasses are cheap",
    ],
    explanation:
      "The principle requires intention. An accidental act does not satisfy the stated condition.",
  },
  {
    prompt:
      "Principle: A contract requires free consent. Facts: Meena signs an agreement after receiving a serious threat. What is the position?",
    answer: "The contract is voidable at Meena's option",
    distractors: [
      "The contract is fully valid",
      "The contract is void from the beginning",
      "The contract becomes a criminal offence automatically",
    ],
    explanation:
      "Consent obtained by coercion makes the contract voidable at the option of the aggrieved party.",
  },
  {
    prompt: "In legal reasoning questions, the answer must be based on",
    answer: "The given principle applied to the given facts",
    distractors: ["Personal moral opinion", "General news knowledge", "The longest option"],
    explanation:
      "Legal reasoning tests application of the stated principle to the stated facts, even if the principle differs from real law.",
  },
]);

add("Law", "Torts", [
  {
    prompt: "The tort of trespass to land requires",
    answer: "Unlawful entry onto another's land",
    distractors: ["A written agreement", "Financial loss in every case", "Police permission"],
    explanation:
      "Trespass to land is actionable per se: direct unauthorised entry is enough, without proving damage.",
  },
  {
    prompt: "The rule in Rylands v. Fletcher relates to",
    answer: "Strict liability for escape of a dangerous thing",
    distractors: [
      "Liability only when negligence is proved",
      "Contractual damages",
      "Criminal conspiracy",
    ],
    explanation:
      "Rylands v. Fletcher established strict liability for the escape of dangerous things brought onto land in a non-natural use.",
  },
  {
    prompt: "'Volenti non fit injuria' means",
    answer: "No injury is done to one who consents",
    distractors: [
      "The thing speaks for itself",
      "Let the buyer beware",
      "An act of God excuses all liability",
    ],
    explanation: "It is a defence in tort where the claimant voluntarily accepted a known risk.",
  },
]);

add("Law", "Contracts", [
  {
    prompt: "Under the Indian Contract Act, an agreement without consideration is generally",
    answer: "Void",
    distractors: ["Valid", "Voidable", "Illegal"],
    explanation:
      "Section 25 states that an agreement made without consideration is void, subject to limited exceptions.",
  },
  {
    prompt: "A display of goods in a shop window with a price tag is treated as",
    answer: "An invitation to offer",
    distractors: ["A valid offer", "An acceptance", "A binding contract"],
    explanation:
      "Goods displayed for sale are an invitation to treat; the customer makes the offer at the counter.",
  },
  {
    prompt: "Which of these is a valid consideration?",
    answer: "A promise to do something lawful at the promisor's desire",
    distractors: [
      "A promise to commit an unlawful act",
      "Past illegal payments",
      "An impossible act",
    ],
    explanation: "Consideration must be lawful, real and at the desire of the promisor.",
  },
]);

add("Law", "Criminal Law Basics", [
  {
    prompt: "'Mens rea' in criminal law means",
    answer: "Guilty mind or criminal intention",
    distractors: ["Guilty act", "Court procedure", "Witness statement"],
    explanation:
      "A crime normally requires both a guilty act (actus reus) and a guilty mind (mens rea).",
  },
  {
    prompt: "The principle 'innocent until proven guilty' means",
    answer: "The burden of proof lies on the prosecution",
    distractors: [
      "The accused must prove innocence",
      "Police decide guilt",
      "Bail is always denied",
    ],
    explanation:
      "The prosecution must prove guilt beyond reasonable doubt; the accused is presumed innocent.",
  },
  {
    prompt: "An offence for which police can arrest without a warrant is called",
    answer: "A cognizable offence",
    distractors: ["A non-cognizable offence", "A compoundable offence", "A bailable offence only"],
    explanation:
      "In cognizable offences the police may arrest without a warrant and start investigation without magistrate's permission.",
  },
]);

/* -------------------------------------------------------------- Reasoning */

add("Reasoning", "Analogy", [
  {
    prompt: "Doctor : Hospital :: Teacher : ?",
    answer: "School",
    distractors: ["Book", "Student", "Chalk"],
    explanation:
      "A doctor works in a hospital, so by the same relation a teacher works in a school.",
  },
  {
    prompt: "Pen : Write :: Knife : ?",
    answer: "Cut",
    distractors: ["Sharp", "Kitchen", "Metal"],
    explanation:
      "The relation is tool to its function: a pen is used to write, a knife is used to cut.",
  },
  {
    prompt: "Bird : Nest :: Bee : ?",
    answer: "Hive",
    distractors: ["Honey", "Flower", "Wing"],
    explanation: "A nest is the dwelling of a bird, and a hive is the dwelling of bees.",
  },
]);

add("Reasoning", "Series", [
  {
    prompt: "Find the next term: 3, 6, 12, 24, ?",
    answer: "48",
    distractors: ["30", "36", "60"],
    explanation: "Each term is multiplied by 2, so the next term is 24 × 2 = 48.",
  },
  {
    prompt: "Find the next term: 2, 5, 10, 17, ?",
    answer: "26",
    distractors: ["24", "25", "28"],
    explanation: "The differences are 3, 5, 7, so the next difference is 9 and 17 + 9 = 26.",
  },
  {
    prompt: "Find the missing term: 1, 4, 9, 16, ?",
    answer: "25",
    distractors: ["20", "24", "36"],
    explanation: "The series is of perfect squares: 1², 2², 3², 4², so the next is 5² = 25.",
  },
]);

add("Reasoning", "Coding-Decoding", [
  {
    prompt: "If CAT is coded as DBU, how is DOG coded?",
    answer: "EPH",
    distractors: ["EPG", "DPH", "FQI"],
    explanation: "Each letter moves one step forward: D→E, O→P, G→H, giving EPH.",
  },
  {
    prompt: "If BOOK is written as AMMI, which rule is applied?",
    answer: "Each letter moves backward by one, two, two and two steps respectively",
    distractors: [
      "Letters are reversed only",
      "Vowels are removed",
      "Each letter moves forward by three",
    ],
    explanation:
      "B→A is −1 and O→M, O→M, K→I are −2 each, so the shift pattern is 1, 2, 2, 2 backwards.",
  },
  {
    prompt: "If 'RED' is coded as 'SFE', then 'BLUE' is coded as",
    answer: "CMVF",
    distractors: ["CMUF", "BMVF", "CNVF"],
    explanation: "Each letter advances by one position: B→C, L→M, U→V, E→F.",
  },
]);

add("Reasoning", "Syllogism", [
  {
    prompt:
      "Statements: All pens are books. All books are papers. Conclusion: All pens are papers. Is the conclusion valid?",
    answer: "Yes, it follows",
    distractors: ["No, it does not follow", "Only partially follows", "Data is insufficient"],
    explanation:
      "Two universal affirmative statements in a chain give a valid universal affirmative conclusion.",
  },
  {
    prompt:
      "Statements: Some cats are dogs. All dogs are animals. Conclusion: Some cats are animals. Is it valid?",
    answer: "Yes, it follows",
    distractors: ["No, it does not follow", "Only the converse follows", "Data is insufficient"],
    explanation: "Cats that are dogs must be animals, so 'some cats are animals' is valid.",
  },
  {
    prompt:
      "Statements: No flower is a stone. All stones are hard. Conclusion: No flower is hard. Is it valid?",
    answer: "No, it does not follow",
    distractors: [
      "Yes, it follows",
      "It follows only in the converse form",
      "Both conclusions follow",
    ],
    explanation:
      "Flowers are excluded from stones, not from all hard things, so the conclusion is invalid.",
  },
]);

add("Reasoning", "Direction Sense", [
  {
    prompt:
      "A man walks 5 km north, then turns right and walks 3 km. In which direction is he from the starting point?",
    answer: "North-east",
    distractors: ["North-west", "South-east", "South-west"],
    explanation: "Walking north and then east places him to the north-east of the starting point.",
  },
  {
    prompt:
      "Ravi walks 4 km east, turns right and walks 4 km, then turns right and walks 4 km. Which direction is he facing?",
    answer: "West",
    distractors: ["North", "East", "South"],
    explanation:
      "Starting east, the first right turn faces south and the second right turn faces west.",
  },
  {
    prompt: "If you face north and turn 180 degrees clockwise, which direction do you face?",
    answer: "South",
    distractors: ["East", "West", "North"],
    explanation: "A 180-degree turn from north results in facing south.",
  },
]);

add("Reasoning", "Blood Relation", [
  {
    prompt:
      "Pointing to a man, Sita said, 'He is the son of my grandfather's only son.' How is the man related to Sita?",
    answer: "Brother",
    distractors: ["Father", "Uncle", "Cousin"],
    explanation: "Her grandfather's only son is her father, so the father's son is her brother.",
  },
  {
    prompt: "A is the mother of B. B is the sister of C. How is C related to A?",
    answer: "Son or daughter of A",
    distractors: ["Brother of A", "Father of A", "Uncle of A"],
    explanation: "Since B and C are siblings and A is B's mother, C is A's child.",
  },
  {
    prompt: "If P is the father of Q and Q is the father of R, how is P related to R?",
    answer: "Grandfather",
    distractors: ["Father", "Brother", "Uncle"],
    explanation: "P is two generations above R, making P the grandfather of R.",
  },
]);

add("Reasoning", "Seating Arrangement", [
  {
    prompt:
      "Five friends sit in a row. A is to the immediate left of B, and B is to the immediate left of C. Who sits between A and C?",
    answer: "B",
    distractors: ["A", "C", "Nobody"],
    explanation: "The order is A, B, C, so B sits between A and C.",
  },
  {
    prompt:
      "In a circular arrangement facing the centre, if X is to the immediate right of Y, then Y is to the",
    answer: "Immediate left of X",
    distractors: ["Immediate right of X", "Opposite of X", "Second to the right of X"],
    explanation:
      "In a circle facing the centre, right and left positions are mutually reversed between two neighbours.",
  },
  {
    prompt:
      "Six students sit in a row. If R is third from the left end, how many students are to the left of R?",
    answer: "Two",
    distractors: ["Three", "Four", "One"],
    explanation:
      "Being third from the left means exactly two students are seated to the left of R.",
  },
]);

/* ------------------------------------------------------- Teaching Aptitude */

add("Teaching Aptitude", "Child Development", [
  {
    prompt:
      "Who proposed the theory of cognitive development with stages such as sensorimotor and preoperational?",
    answer: "Jean Piaget",
    distractors: ["B. F. Skinner", "Ivan Pavlov", "Edward Thorndike"],
    explanation:
      "Jean Piaget described four stages: sensorimotor, preoperational, concrete operational and formal operational.",
  },
  {
    prompt: "Development proceeds from head to foot. This principle is called",
    answer: "Cephalocaudal principle",
    distractors: ["Proximodistal principle", "Recapitulation theory", "Maturation lag"],
    explanation:
      "The cephalocaudal principle states that growth and control develop from the head downwards.",
  },
  {
    prompt: "Heredity and environment influence a child's development",
    answer: "Together and interactively",
    distractors: [
      "Only heredity matters",
      "Only environment matters",
      "Neither influences development",
    ],
    explanation:
      "Modern developmental psychology holds that heredity and environment interact continuously.",
  },
]);

add("Teaching Aptitude", "Learning Theories", [
  {
    prompt: "Classical conditioning was demonstrated by",
    answer: "Ivan Pavlov",
    distractors: ["Jean Piaget", "Lev Vygotsky", "Albert Bandura"],
    explanation:
      "Pavlov's experiments with dogs demonstrated learning through the association of stimuli.",
  },
  {
    prompt: "Operant conditioning with reinforcement and punishment is associated with",
    answer: "B. F. Skinner",
    distractors: ["Jerome Bruner", "Kohlberg", "Erikson"],
    explanation:
      "Skinner showed that behaviour is shaped by its consequences through reinforcement schedules.",
  },
  {
    prompt: "The concept of the Zone of Proximal Development was given by",
    answer: "Lev Vygotsky",
    distractors: ["Jean Piaget", "John Dewey", "Maria Montessori"],
    explanation:
      "Vygotsky described the gap between what a learner can do alone and with guidance.",
  },
]);

add("Teaching Aptitude", "Inclusive Education", [
  {
    prompt: "Inclusive education mainly means",
    answer: "Educating all learners together with required support",
    distractors: [
      "Teaching only gifted learners",
      "Separate schools for every disability",
      "Removing assessment for some learners",
    ],
    explanation:
      "Inclusive education places all children in common classrooms with adaptations and support as needed.",
  },
  {
    prompt:
      "The Right to Education Act, 2009 provides free and compulsory education for children aged",
    answer: "6 to 14 years",
    distractors: ["3 to 10 years", "5 to 16 years", "6 to 18 years"],
    explanation:
      "The RTE Act, 2009 operationalises Article 21A for children in the 6–14 age group.",
  },
  {
    prompt: "Which practice best supports an inclusive classroom?",
    answer: "Using multiple teaching methods and flexible assessment",
    distractors: [
      "One uniform method for all learners",
      "Ignoring slow learners",
      "Seating all weak learners outside",
    ],
    explanation:
      "Differentiated instruction and flexible assessment help learners with diverse needs participate fully.",
  },
]);

add("Teaching Aptitude", "Assessment", [
  {
    prompt: "Assessment conducted during the teaching process to improve learning is called",
    answer: "Formative assessment",
    distractors: ["Summative assessment", "Placement testing only", "Norm-referenced ranking"],
    explanation:
      "Formative assessment provides continuous feedback during instruction, unlike summative assessment at the end.",
  },
  {
    prompt: "A test that measures what it claims to measure is said to have",
    answer: "Validity",
    distractors: ["Reliability", "Objectivity", "Usability"],
    explanation:
      "Validity refers to accuracy of measurement; reliability refers to consistency of results.",
  },
  {
    prompt: "CCE in school education stands for",
    answer: "Continuous and Comprehensive Evaluation",
    distractors: [
      "Central Common Examination",
      "Certified Curriculum Evaluation",
      "Combined Classroom Experiment",
    ],
    explanation:
      "CCE assesses both scholastic and co-scholastic areas continuously through the year.",
  },
]);

add("Teaching Aptitude", "Pedagogy", [
  {
    prompt: "Teaching that begins with specific examples and moves to a general rule is called",
    answer: "Inductive method",
    distractors: ["Deductive method", "Lecture method", "Drill method"],
    explanation:
      "The inductive method moves from examples to generalisation; the deductive method starts from the rule.",
  },
  {
    prompt: "Which method is most suitable for developing scientific enquiry skills?",
    answer: "Experiment and activity based method",
    distractors: ["Pure lecture method", "Dictation of notes", "Rote memorisation of definitions"],
    explanation:
      "Hands-on experimentation lets learners observe, hypothesise and verify, building enquiry skills.",
  },
  {
    prompt: "Teaching aids are used mainly to",
    answer: "Make learning concrete and interesting",
    distractors: [
      "Replace the teacher completely",
      "Reduce the syllabus",
      "Increase examination difficulty",
    ],
    explanation:
      "Audio-visual and activity aids support understanding by making abstract ideas concrete.",
  },
]);

add("Teaching Aptitude", "Classroom Management", [
  {
    prompt: "The most effective way to handle a disruptive student is to",
    answer: "Understand the cause and redirect the behaviour positively",
    distractors: [
      "Use physical punishment",
      "Ignore the student permanently",
      "Remove the student from school",
    ],
    explanation:
      "Positive behaviour support addresses causes and teaches alternative behaviour, unlike punishment.",
  },
  {
    prompt: "Corporal punishment in Indian schools is",
    answer: "Prohibited under the RTE Act, 2009",
    distractors: [
      "Allowed for senior classes",
      "Allowed with parental consent",
      "Allowed only in private schools",
    ],
    explanation:
      "Section 17 of the RTE Act prohibits physical punishment and mental harassment of children.",
  },
  {
    prompt: "Good classroom management primarily aims at",
    answer: "Creating an environment that supports learning",
    distractors: [
      "Keeping students silent at all times",
      "Finishing the syllabus without teaching",
      "Reducing teacher involvement",
    ],
    explanation:
      "Effective management organises time, space and behaviour so that meaningful learning can take place.",
  },
]);

/* --------------------------------------------- Mathematics concept support */

add("Math", "Data Interpretation", [
  {
    prompt:
      "A school has 400 students: 120 in Class 9, 150 in Class 10 and the rest in Class 11. How many students are in Class 11?",
    answer: "130",
    distractors: ["120", "140", "150"],
    explanation: "Class 11 students = 400 − (120 + 150) = 400 − 270 = 130.",
  },
  {
    prompt: "In a survey of 200 people, 25% preferred tea. How many people preferred tea?",
    answer: "50",
    distractors: ["25", "40", "75"],
    explanation: "25% of 200 = 200 × 25/100 = 50 people.",
  },
  {
    prompt:
      "Monthly sales were ₹40,000 in April and ₹50,000 in May. What is the percentage increase?",
    answer: "25%",
    distractors: ["10%", "20%", "40%"],
    explanation: "Increase = 10,000. Percentage increase = 10,000/40,000 × 100 = 25%.",
  },
  {
    prompt:
      "A pie chart shows 90 degrees for sports out of 360 degrees. What share of the total does sports represent?",
    answer: "25%",
    distractors: ["10%", "30%", "45%"],
    explanation: "90/360 × 100 = 25%, since the full circle represents 100%.",
  },
]);

add("Math Class 9", "Lines and Angles", [
  {
    prompt: "Two angles are supplementary if their sum is",
    answer: "180 degrees",
    distractors: ["90 degrees", "270 degrees", "360 degrees"],
    explanation: "Supplementary angles add up to 180°, while complementary angles add up to 90°.",
  },
  {
    prompt: "If two lines intersect, the vertically opposite angles are",
    answer: "Equal",
    distractors: ["Supplementary always", "Complementary always", "Unequal always"],
    explanation: "Vertically opposite angles formed by two intersecting lines are always equal.",
  },
  {
    prompt: "The sum of all angles of a triangle is",
    answer: "180 degrees",
    distractors: ["90 degrees", "270 degrees", "360 degrees"],
    explanation: "The angle sum property of a triangle states the total is 180°.",
  },
]);

add("Math Class 9", "Triangles", [
  {
    prompt: "Two triangles are congruent by SAS criterion when",
    answer: "Two sides and the included angle are equal",
    distractors: [
      "Two angles and any side are equal",
      "All three angles are equal",
      "Only one side is equal",
    ],
    explanation: "SAS congruence requires two sides and the angle between those sides to be equal.",
  },
  {
    prompt: "In an isosceles triangle, the angles opposite the equal sides are",
    answer: "Equal",
    distractors: ["Supplementary", "Complementary", "Always right angles"],
    explanation: "Angles opposite equal sides of an isosceles triangle are equal.",
  },
  {
    prompt:
      "AAA is not a congruence criterion because equal angles only guarantee that triangles are",
    answer: "Similar",
    distractors: ["Congruent", "Equal in area", "Right angled"],
    explanation:
      "Equal angles fix the shape but not the size, so the triangles are similar but not necessarily congruent.",
  },
]);

add("Math Class 9", "Quadrilaterals", [
  {
    prompt: "The sum of all interior angles of a quadrilateral is",
    answer: "360 degrees",
    distractors: ["180 degrees", "270 degrees", "540 degrees"],
    explanation: "A quadrilateral can be divided into two triangles, giving 2 × 180° = 360°.",
  },
  {
    prompt: "In a parallelogram, the diagonals",
    answer: "Bisect each other",
    distractors: ["Are always equal", "Are always perpendicular", "Never intersect"],
    explanation:
      "Diagonals of a parallelogram bisect each other; they are equal only in a rectangle.",
  },
  {
    prompt: "A quadrilateral with all sides equal and all angles 90 degrees is a",
    answer: "Square",
    distractors: ["Rhombus", "Rectangle", "Trapezium"],
    explanation:
      "A square has all sides equal and all angles right angles; a rhombus has equal sides but not necessarily right angles.",
  },
]);

add("Math Class 10", "Triangles", [
  {
    prompt:
      "Two triangles are similar if their corresponding angles are equal and corresponding sides are",
    answer: "In the same ratio",
    distractors: ["Equal in length", "Perpendicular", "Unrelated"],
    explanation:
      "Similar triangles have equal corresponding angles and proportional corresponding sides.",
  },
  {
    prompt: "The Basic Proportionality Theorem is also known as",
    answer: "Thales theorem",
    distractors: ["Pythagoras theorem", "Heron's theorem", "Euclid's division lemma"],
    explanation:
      "The Basic Proportionality Theorem, stated by Thales, says a line parallel to one side divides the other two sides proportionally.",
  },
  {
    prompt:
      "If the ratio of corresponding sides of two similar triangles is 2:3, the ratio of their areas is",
    answer: "4:9",
    distractors: ["2:3", "3:2", "8:27"],
    explanation:
      "The ratio of areas of similar triangles equals the square of the ratio of corresponding sides.",
  },
]);

/* -------------------------------------------------- Science (competitive) */

add("Science", "Physics Basics", [
  {
    prompt: "The SI unit of force is",
    answer: "Newton",
    distractors: ["Joule", "Watt", "Pascal"],
    explanation: "Force is measured in newton (N), where 1 N = 1 kg·m/s².",
  },
  {
    prompt: "Which quantity is a vector?",
    answer: "Velocity",
    distractors: ["Speed", "Mass", "Temperature"],
    explanation: "Velocity has both magnitude and direction, making it a vector quantity.",
  },
  {
    prompt: "The SI unit of power is",
    answer: "Watt",
    distractors: ["Newton", "Joule", "Ampere"],
    explanation: "Power is the rate of doing work; 1 watt = 1 joule per second.",
  },
  {
    prompt: "Which law states that every action has an equal and opposite reaction?",
    answer: "Newton's third law of motion",
    distractors: ["Newton's first law of motion", "Law of conservation of mass", "Ohm's law"],
    explanation: "Newton's third law describes action-reaction pairs acting on different bodies.",
  },
  {
    prompt: "The acceleration due to gravity near Earth's surface is about",
    answer: "9.8 m/s²",
    distractors: ["1.6 m/s²", "3.7 m/s²", "19.6 m/s²"],
    explanation: "The standard value of g near Earth's surface is approximately 9.8 m/s².",
  },
]);

add("Science", "Mechanics", [
  {
    prompt: "The rate of change of velocity is called",
    answer: "Acceleration",
    distractors: ["Momentum", "Displacement", "Force"],
    explanation: "Acceleration is defined as the change in velocity per unit time.",
  },
  {
    prompt: "Momentum of a body is the product of",
    answer: "Mass and velocity",
    distractors: ["Mass and acceleration", "Force and time only", "Mass and displacement"],
    explanation: "Linear momentum p = mv, the product of mass and velocity.",
  },
  {
    prompt:
      "A body continues in its state of rest or uniform motion unless acted upon by an external force. This is",
    answer: "Newton's first law of motion",
    distractors: ["Newton's second law", "Newton's third law", "Hooke's law"],
    explanation: "Newton's first law is also known as the law of inertia.",
  },
  {
    prompt: "The SI unit of momentum is",
    answer: "kg·m/s",
    distractors: ["N/s", "J·s", "m/s²"],
    explanation: "Momentum = mass × velocity, so its unit is kilogram metre per second.",
  },
]);

add("Science", "Work and Energy", [
  {
    prompt: "The SI unit of work is",
    answer: "Joule",
    distractors: ["Newton", "Watt", "Pascal"],
    explanation: "Work = force × displacement, measured in joule (N·m).",
  },
  {
    prompt: "Kinetic energy of a body of mass m moving with velocity v is",
    answer: "½mv²",
    distractors: ["mv", "mgh", "2mv²"],
    explanation: "Kinetic energy is given by KE = ½mv².",
  },
  {
    prompt: "Potential energy of a body at height h is given by",
    answer: "mgh",
    distractors: ["½mv²", "mv", "mg/h"],
    explanation: "Gravitational potential energy PE = mgh, where g is acceleration due to gravity.",
  },
  {
    prompt: "Work done is zero when the force and displacement are",
    answer: "Perpendicular to each other",
    distractors: ["In the same direction", "In opposite directions", "Both very large"],
    explanation: "Work = F·s·cosθ, and cos 90° = 0, so perpendicular force does no work.",
  },
]);

add("Science", "Optics", [
  {
    prompt: "A ray of light passing from a rarer to a denser medium bends",
    answer: "Towards the normal",
    distractors: ["Away from the normal", "Along the surface", "Back into the same medium always"],
    explanation:
      "Light slows down in a denser medium, so the refracted ray bends towards the normal.",
  },
  {
    prompt: "The image formed on the retina of the human eye is",
    answer: "Real and inverted",
    distractors: ["Virtual and erect", "Virtual and inverted", "Real and erect"],
    explanation:
      "The eye lens forms a real, inverted image on the retina; the brain interprets it upright.",
  },
  {
    prompt: "The splitting of white light into its component colours is called",
    answer: "Dispersion",
    distractors: ["Reflection", "Diffraction", "Polarisation"],
    explanation:
      "A prism disperses white light into a spectrum because each colour refracts differently.",
  },
  {
    prompt: "A convex lens is also called a",
    answer: "Converging lens",
    distractors: ["Diverging lens", "Plane lens", "Cylindrical mirror"],
    explanation: "A convex lens converges parallel rays to a focal point.",
  },
  {
    prompt: "Which defect of vision is corrected using a concave lens?",
    answer: "Myopia",
    distractors: ["Hypermetropia", "Presbyopia", "Astigmatism"],
    explanation: "Myopia, or short-sightedness, is corrected with a concave (diverging) lens.",
  },
]);

add("Science", "Current Electricity", [
  {
    prompt: "The SI unit of electric current is",
    answer: "Ampere",
    distractors: ["Volt", "Ohm", "Watt"],
    explanation:
      "Current is measured in ampere; volt measures potential difference and ohm measures resistance.",
  },
  {
    prompt: "Ohm's law states that",
    answer: "V = IR at constant temperature",
    distractors: ["V = I/R", "I = VR", "R = VI"],
    explanation:
      "Ohm's law says potential difference is directly proportional to current at constant temperature.",
  },
  {
    prompt: "Resistors connected in series have a total resistance equal to",
    answer: "The sum of individual resistances",
    distractors: [
      "The reciprocal of the sum of reciprocals",
      "The product of resistances",
      "The smallest resistance",
    ],
    explanation: "In series, R = R₁ + R₂ + R₃, so total resistance increases.",
  },
  {
    prompt: "Electrical energy consumed is commercially measured in",
    answer: "Kilowatt-hour",
    distractors: ["Joule per second", "Newton metre", "Ampere-hour"],
    explanation: "One kilowatt-hour, or one unit, equals 3.6 × 10⁶ joules.",
  },
]);

add("Science", "Chemistry Basics", [
  {
    prompt: "The pH of a neutral solution at 25 degrees Celsius is",
    answer: "7",
    distractors: ["0", "10", "14"],
    explanation:
      "In a neutral solution, hydrogen and hydroxide ion concentrations are equal, giving pH 7.",
  },
  {
    prompt: "Which gas is produced when an acid reacts with a metal carbonate?",
    answer: "Carbon dioxide",
    distractors: ["Oxygen", "Hydrogen", "Nitrogen"],
    explanation:
      "Acid + metal carbonate gives salt, water and carbon dioxide, which turns lime water milky.",
  },
  {
    prompt: "The chemical formula of common salt is",
    answer: "NaCl",
    distractors: ["KCl", "CaCO₃", "NaOH"],
    explanation: "Common salt is sodium chloride, NaCl.",
  },
  {
    prompt: "An atom that has lost an electron becomes",
    answer: "A positively charged ion",
    distractors: ["A negatively charged ion", "A neutron", "A molecule"],
    explanation:
      "Losing a negatively charged electron leaves the atom with a net positive charge, forming a cation.",
  },
]);

add("Science", "Mole Concept", [
  {
    prompt: "One mole of any substance contains how many particles?",
    answer: "6.022 × 10²³",
    distractors: ["6.022 × 10²²", "3.011 × 10²³", "1.6 × 10⁻¹⁹"],
    explanation: "Avogadro's number is 6.022 × 10²³ particles per mole.",
  },
  {
    prompt: "How many moles are present in 36 g of water? (Molar mass = 18 g/mol)",
    answer: "2 moles",
    distractors: ["1 mole", "3 moles", "18 moles"],
    explanation: "Moles = given mass / molar mass = 36/18 = 2 moles.",
  },
  {
    prompt: "The molar mass of carbon dioxide (CO₂) is approximately",
    answer: "44 g/mol",
    distractors: ["28 g/mol", "32 g/mol", "18 g/mol"],
    explanation: "CO₂ = 12 + (2 × 16) = 44 g/mol.",
  },
  {
    prompt: "The volume occupied by one mole of an ideal gas at STP is",
    answer: "22.4 litres",
    distractors: ["11.2 litres", "24.0 litres", "1 litre"],
    explanation: "At standard temperature and pressure, one mole of any ideal gas occupies 22.4 L.",
  },
]);

add("Science", "Periodic Table", [
  {
    prompt: "Across a period from left to right, atomic radius generally",
    answer: "Decreases",
    distractors: ["Increases", "Remains constant", "Becomes zero"],
    explanation:
      "Increasing nuclear charge pulls electrons closer, decreasing atomic radius across a period.",
  },
  {
    prompt: "The modern periodic table is arranged in order of increasing",
    answer: "Atomic number",
    distractors: ["Atomic mass", "Density", "Valency"],
    explanation: "Moseley's modern periodic law arranges elements by increasing atomic number.",
  },
  {
    prompt: "Elements of Group 18 are called",
    answer: "Noble gases",
    distractors: ["Alkali metals", "Halogens", "Transition metals"],
    explanation:
      "Group 18 contains helium, neon, argon and other noble gases with stable configurations.",
  },
  {
    prompt: "Which element has the highest electronegativity?",
    answer: "Fluorine",
    distractors: ["Oxygen", "Chlorine", "Nitrogen"],
    explanation: "Fluorine is the most electronegative element on the Pauling scale.",
  },
]);

add("Science", "Chemical Bonding", [
  {
    prompt: "A covalent bond is formed by",
    answer: "Sharing of electron pairs",
    distractors: [
      "Complete transfer of electrons",
      "Transfer of protons",
      "Attraction between nuclei only",
    ],
    explanation: "Covalent bonding involves mutual sharing of electrons between atoms.",
  },
  {
    prompt: "An ionic bond is formed by",
    answer: "Transfer of electrons from one atom to another",
    distractors: ["Sharing of electrons", "Sharing of protons", "Overlap of nuclei"],
    explanation:
      "One atom loses electrons and another gains them, forming oppositely charged ions.",
  },
  {
    prompt: "Which type of bond exists in a sodium chloride crystal?",
    answer: "Ionic bond",
    distractors: ["Covalent bond", "Metallic bond", "Hydrogen bond"],
    explanation:
      "Sodium transfers an electron to chlorine, forming Na⁺ and Cl⁻ held by ionic bonds.",
  },
]);

add("Science", "Biology Basics", [
  {
    prompt: "Which organelle is called the powerhouse of the cell?",
    answer: "Mitochondria",
    distractors: ["Ribosome", "Golgi body", "Nucleus"],
    explanation: "Mitochondria generate ATP through cellular respiration.",
  },
  {
    prompt: "The green pigment necessary for photosynthesis is",
    answer: "Chlorophyll",
    distractors: ["Haemoglobin", "Melanin", "Carotene"],
    explanation: "Chlorophyll in chloroplasts absorbs light energy for photosynthesis.",
  },
  {
    prompt: "The basic structural and functional unit of life is",
    answer: "The cell",
    distractors: ["The tissue", "The organ", "The molecule"],
    explanation:
      "Cell theory states that the cell is the basic unit of structure and function in living organisms.",
  },
  {
    prompt: "Which organelle is responsible for protein synthesis?",
    answer: "Ribosome",
    distractors: ["Lysosome", "Vacuole", "Centrosome"],
    explanation: "Ribosomes translate mRNA into polypeptide chains during protein synthesis.",
  },
]);

add("Science", "Genetics", [
  {
    prompt: "In a monohybrid cross Tt × Tt, the expected phenotypic ratio is",
    answer: "3 : 1",
    distractors: ["1 : 1", "9 : 3 : 3 : 1", "1 : 2 : 1 phenotypes"],
    explanation: "Tt × Tt gives TT, Tt, Tt, tt — three dominant and one recessive phenotype.",
  },
  {
    prompt: "Who is known as the father of genetics?",
    answer: "Gregor Mendel",
    distractors: ["Charles Darwin", "Louis Pasteur", "Robert Hooke"],
    explanation: "Gregor Mendel's pea plant experiments established the laws of inheritance.",
  },
  {
    prompt: "The genotypic ratio of a monohybrid cross Tt × Tt is",
    answer: "1 : 2 : 1",
    distractors: ["3 : 1", "1 : 1", "9 : 3 : 3 : 1"],
    explanation: "The genotypes are 1 TT, 2 Tt and 1 tt, giving a 1:2:1 genotypic ratio.",
  },
  {
    prompt: "In humans, the sex of a child is determined by",
    answer: "The chromosome contributed by the father",
    distractors: [
      "The chromosome contributed by the mother",
      "Diet during pregnancy",
      "The number of siblings",
    ],
    explanation:
      "The mother always contributes X; the father contributes either X or Y, deciding the sex.",
  },
]);

add("Science", "Human Physiology", [
  {
    prompt: "The functional unit of the human kidney is",
    answer: "Nephron",
    distractors: ["Neuron", "Alveolus", "Villus"],
    explanation: "Nephrons filter blood and form urine, making them the kidney's functional unit.",
  },
  {
    prompt: "Exchange of gases in the human lungs takes place in the",
    answer: "Alveoli",
    distractors: ["Trachea", "Bronchi", "Larynx"],
    explanation: "Alveoli provide a large, thin surface for oxygen and carbon dioxide exchange.",
  },
  {
    prompt: "How many chambers does the human heart have?",
    answer: "Four",
    distractors: ["Two", "Three", "Five"],
    explanation: "The human heart has two atria and two ventricles.",
  },
  {
    prompt: "The largest gland in the human body is",
    answer: "Liver",
    distractors: ["Pancreas", "Thyroid", "Salivary gland"],
    explanation:
      "The liver is the largest gland and performs metabolism, detoxification and bile production.",
  },
  {
    prompt: "Insulin is secreted by which organ?",
    answer: "Pancreas",
    distractors: ["Liver", "Kidney", "Thyroid"],
    explanation: "Beta cells in the islets of Langerhans of the pancreas secrete insulin.",
  },
]);

add("Science", "Ecology", [
  {
    prompt: "Green plants in an ecosystem are called",
    answer: "Producers",
    distractors: ["Consumers", "Decomposers", "Predators"],
    explanation:
      "Producers capture solar energy and convert it into chemical energy by photosynthesis.",
  },
  {
    prompt: "Organisms that break down dead organic matter are called",
    answer: "Decomposers",
    distractors: ["Producers", "Herbivores", "Carnivores"],
    explanation: "Bacteria and fungi decompose dead matter and recycle nutrients.",
  },
  {
    prompt: "Only about how much energy is transferred to the next trophic level?",
    answer: "10 percent",
    distractors: ["50 percent", "90 percent", "100 percent"],
    explanation:
      "The ten percent law states that roughly 10% of energy passes to the next trophic level.",
  },
  {
    prompt: "Which gas is mainly responsible for the greenhouse effect?",
    answer: "Carbon dioxide",
    distractors: ["Oxygen", "Nitrogen", "Helium"],
    explanation:
      "Carbon dioxide traps outgoing infrared radiation and drives the greenhouse effect.",
  },
]);

add("Science", "Units and Measurements", [
  {
    prompt: "The SI unit of temperature is",
    answer: "Kelvin",
    distractors: ["Celsius", "Fahrenheit", "Joule"],
    explanation: "Kelvin is the SI base unit of thermodynamic temperature.",
  },
  {
    prompt: "The SI unit of pressure is",
    answer: "Pascal",
    distractors: ["Newton", "Bar", "Torr"],
    explanation: "One pascal equals one newton per square metre.",
  },
  {
    prompt: "The SI unit of frequency is",
    answer: "Hertz",
    distractors: ["Decibel", "Watt", "Radian"],
    explanation: "One hertz equals one cycle per second.",
  },
  {
    prompt: "How many base units are there in the SI system?",
    answer: "Seven",
    distractors: ["Five", "Six", "Nine"],
    explanation:
      "The seven SI base units are metre, kilogram, second, ampere, kelvin, mole and candela.",
  },
]);

/* ----------------------------------------------------------- Science Class 9 */

add("Science Class 9", "Matter in Our Surroundings", [
  {
    prompt: "Which state of matter has a definite shape and a definite volume?",
    answer: "Solid",
    distractors: ["Liquid", "Gas", "Plasma"],
    explanation: "Solids have closely packed particles, giving both definite shape and volume.",
  },
  {
    prompt: "The change of a solid directly into vapour is called",
    answer: "Sublimation",
    distractors: ["Evaporation", "Condensation", "Fusion"],
    explanation:
      "Camphor and naphthalene sublime, changing from solid to gas without becoming liquid.",
  },
  {
    prompt: "The temperature at which a solid melts to become a liquid is called its",
    answer: "Melting point",
    distractors: ["Boiling point", "Dew point", "Flash point"],
    explanation: "The melting point of ice at normal pressure is 0 °C or 273 K.",
  },
  {
    prompt: "Evaporation causes cooling because",
    answer: "Particles absorb latent heat from the surroundings",
    distractors: [
      "Particles release heat to the surroundings",
      "Pressure suddenly increases",
      "Air becomes heavier",
    ],
    explanation:
      "Evaporating particles take latent heat of vaporisation from the surroundings, lowering temperature.",
  },
  {
    prompt: "0 degrees Celsius is equal to how many kelvin?",
    answer: "273 K",
    distractors: ["0 K", "100 K", "373 K"],
    explanation: "Temperature in kelvin = temperature in Celsius + 273.",
  },
]);

add("Science Class 9", "Is Matter Around Us Pure", [
  {
    prompt: "A solution in which no more solute can dissolve at a given temperature is",
    answer: "A saturated solution",
    distractors: ["An unsaturated solution", "A suspension", "A colloid"],
    explanation: "A saturated solution holds the maximum solute possible at that temperature.",
  },
  {
    prompt: "Which of these is a homogeneous mixture?",
    answer: "Sugar dissolved in water",
    distractors: ["Sand in water", "Oil in water", "Chalk powder in water"],
    explanation: "A true solution such as sugar in water has a uniform composition throughout.",
  },
  {
    prompt: "The Tyndall effect is shown by",
    answer: "Colloids",
    distractors: ["True solutions", "Pure water", "Sugar syrup"],
    explanation:
      "Colloidal particles are large enough to scatter a beam of light, producing the Tyndall effect.",
  },
  {
    prompt:
      "Which method is used to separate two miscible liquids with a large boiling point difference?",
    answer: "Distillation",
    distractors: ["Filtration", "Sedimentation", "Sublimation"],
    explanation:
      "Simple distillation separates miscible liquids whose boiling points differ by more than 25 K.",
  },
  {
    prompt: "An alloy is an example of",
    answer: "A homogeneous mixture",
    distractors: ["A compound", "An element", "A heterogeneous mixture"],
    explanation: "Alloys such as brass are homogeneous mixtures of metals.",
  },
]);

add("Science Class 9", "Atoms and Molecules", [
  {
    prompt: "The law of conservation of mass was given by",
    answer: "Antoine Lavoisier",
    distractors: ["John Dalton", "J. J. Thomson", "Ernest Rutherford"],
    explanation:
      "Lavoisier showed that mass is neither created nor destroyed in a chemical reaction.",
  },
  {
    prompt: "The value of Avogadro's number is",
    answer: "6.022 × 10²³",
    distractors: ["6.022 × 10²²", "3.011 × 10²³", "9.1 × 10⁻³¹"],
    explanation: "One mole of any substance contains 6.022 × 10²³ particles.",
  },
  {
    prompt: "The chemical formula of calcium carbonate is",
    answer: "CaCO₃",
    distractors: ["CaCl₂", "Ca(OH)₂", "CaSO₄"],
    explanation: "Calcium carbonate, found in limestone and marble, has the formula CaCO₃.",
  },
  {
    prompt: "The molecular mass of water (H₂O) is approximately",
    answer: "18 u",
    distractors: ["16 u", "20 u", "32 u"],
    explanation: "H₂O = (2 × 1) + 16 = 18 u.",
  },
  {
    prompt: "Who proposed the atomic theory of matter in 1808?",
    answer: "John Dalton",
    distractors: ["Niels Bohr", "James Chadwick", "Robert Hooke"],
    explanation: "Dalton's atomic theory described atoms as indivisible particles of elements.",
  },
]);

add("Science Class 9", "Structure of the Atom", [
  {
    prompt: "Which subatomic particle revolves around the nucleus?",
    answer: "Electron",
    distractors: ["Proton", "Neutron", "Positron"],
    explanation: "Electrons occupy shells around the nucleus, which contains protons and neutrons.",
  },
  {
    prompt: "The neutron was discovered by",
    answer: "James Chadwick",
    distractors: ["J. J. Thomson", "Ernest Rutherford", "Niels Bohr"],
    explanation: "James Chadwick discovered the neutral neutron in 1932.",
  },
  {
    prompt: "Atoms of the same element with different mass numbers are called",
    answer: "Isotopes",
    distractors: ["Isobars", "Isotones", "Ions"],
    explanation: "Isotopes have the same atomic number but different numbers of neutrons.",
  },
  {
    prompt: "The maximum number of electrons in the K shell is",
    answer: "2",
    distractors: ["8", "18", "32"],
    explanation: "Using 2n², the first shell (n = 1) holds a maximum of 2 electrons.",
  },
  {
    prompt: "Rutherford's alpha particle scattering experiment led to the discovery of the",
    answer: "Nucleus",
    distractors: ["Electron", "Neutron", "Proton shell"],
    explanation:
      "Most alpha particles passed straight through, showing the atom is mostly empty with a dense nucleus.",
  },
]);

add("Science Class 9", "The Fundamental Unit of Life", [
  {
    prompt: "Who discovered the cell?",
    answer: "Robert Hooke",
    distractors: ["Robert Brown", "Anton van Leeuwenhoek", "Rudolf Virchow"],
    explanation: "Robert Hooke observed cork cells in 1665 and named them cells.",
  },
  {
    prompt: "Which organelle is known as the powerhouse of the cell?",
    answer: "Mitochondria",
    distractors: ["Nucleus", "Ribosome", "Vacuole"],
    explanation: "Mitochondria release energy in the form of ATP during respiration.",
  },
  {
    prompt: "The movement of water molecules through a semi-permeable membrane is called",
    answer: "Osmosis",
    distractors: ["Diffusion", "Active transport", "Plasmolysis"],
    explanation:
      "Osmosis is the movement of solvent molecules across a selectively permeable membrane.",
  },
  {
    prompt: "Which organelle is called the suicidal bag of the cell?",
    answer: "Lysosome",
    distractors: ["Golgi apparatus", "Ribosome", "Chloroplast"],
    explanation:
      "Lysosomes contain digestive enzymes that can break down the cell itself when damaged.",
  },
  {
    prompt: "Plant cells differ from animal cells because they have",
    answer: "A cell wall and plastids",
    distractors: ["Only a nucleus", "Only mitochondria", "No cell membrane"],
    explanation: "Plant cells possess a cellulose cell wall, plastids and a large central vacuole.",
  },
]);

add("Science Class 9", "Tissues", [
  {
    prompt: "Which plant tissue is responsible for growth in length?",
    answer: "Apical meristem",
    distractors: ["Lateral meristem", "Sclerenchyma", "Phloem"],
    explanation:
      "Apical meristem present at root and shoot tips increases the length of the plant.",
  },
  {
    prompt: "Which tissue transports water in plants?",
    answer: "Xylem",
    distractors: ["Phloem", "Parenchyma", "Collenchyma"],
    explanation: "Xylem conducts water and minerals upward from roots to leaves.",
  },
  {
    prompt: "Blood is an example of which type of tissue?",
    answer: "Connective tissue",
    distractors: ["Epithelial tissue", "Muscular tissue", "Nervous tissue"],
    explanation: "Blood is a fluid connective tissue with plasma as its matrix.",
  },
  {
    prompt: "Which muscle tissue is involuntary and found in the heart?",
    answer: "Cardiac muscle",
    distractors: ["Striated muscle", "Skeletal muscle", "Voluntary muscle"],
    explanation: "Cardiac muscle is involuntary, striated and found only in the heart.",
  },
  {
    prompt: "The functional unit of nervous tissue is the",
    answer: "Neuron",
    distractors: ["Nephron", "Alveolus", "Villus"],
    explanation: "Neurons transmit nerve impulses and form the functional unit of nervous tissue.",
  },
]);

add("Science Class 9", "Motion", [
  {
    prompt: "The slope of a distance-time graph gives",
    answer: "Speed",
    distractors: ["Acceleration", "Force", "Displacement"],
    explanation: "Distance divided by time equals speed, which is the slope of the graph.",
  },
  {
    prompt: "The area under a velocity-time graph gives",
    answer: "Displacement",
    distractors: ["Acceleration", "Force", "Momentum"],
    explanation:
      "Velocity multiplied by time gives displacement, which is the area under the curve.",
  },
  {
    prompt: "Which of these is a scalar quantity?",
    answer: "Distance",
    distractors: ["Displacement", "Velocity", "Acceleration"],
    explanation:
      "Distance has magnitude only, while displacement, velocity and acceleration are vectors.",
  },
  {
    prompt: "A body moving in a circular path with uniform speed has",
    answer: "Changing velocity because direction changes",
    distractors: ["Constant velocity", "Zero acceleration", "No change in direction"],
    explanation:
      "Speed is constant but direction changes continuously, so velocity and acceleration are non-zero.",
  },
  {
    prompt: "The SI unit of acceleration is",
    answer: "m/s²",
    distractors: ["m/s", "N/kg only", "km/h"],
    explanation:
      "Acceleration is the change of velocity per second, measured in metre per second squared.",
  },
]);

add("Science Class 9", "Force and Laws of Motion", [
  {
    prompt: "Newton's second law of motion gives the relation",
    answer: "F = ma",
    distractors: ["F = mv", "F = m/a", "F = ½mv²"],
    explanation:
      "Force equals the rate of change of momentum, which for constant mass gives F = ma.",
  },
  {
    prompt: "The tendency of a body to resist change in its state of motion is called",
    answer: "Inertia",
    distractors: ["Momentum", "Friction", "Impulse"],
    explanation: "Inertia is described by Newton's first law and depends on the mass of the body.",
  },
  {
    prompt: "Action and reaction forces always act",
    answer: "On two different bodies",
    distractors: ["On the same body", "In the same direction", "Only when bodies touch"],
    explanation:
      "Because action and reaction act on different bodies, they never cancel each other out.",
  },
  {
    prompt: "The impulse acting on a body is equal to its change in",
    answer: "Momentum",
    distractors: ["Mass", "Density", "Volume"],
    explanation: "Impulse = force × time = change in momentum, measured in kg·m/s.",
  },
  {
    prompt: "A body of mass 2 kg accelerates at 3 m/s². The force acting on it is",
    answer: "6 N",
    distractors: ["1.5 N", "5 N", "9 N"],
    explanation: "F = ma = 2 × 3 = 6 newton.",
  },
]);

add("Science Class 9", "Gravitation", [
  {
    prompt: "The value of the universal gravitational constant G is approximately",
    answer: "6.67 × 10⁻¹¹ N·m²/kg²",
    distractors: ["9.8 N·m²/kg²", "6.022 × 10²³ N·m²/kg²", "3.0 × 10⁸ N·m²/kg²"],
    explanation: "G is a universal constant with value 6.67 × 10⁻¹¹ N·m²/kg².",
  },
  {
    prompt: "The weight of a body on the Moon is about",
    answer: "One sixth of its weight on Earth",
    distractors: ["Equal to its weight on Earth", "Six times its weight on Earth", "Zero"],
    explanation: "The Moon's gravitational acceleration is about one sixth of Earth's value.",
  },
  {
    prompt: "A body floats in a liquid when its density is",
    answer: "Less than the density of the liquid",
    distractors: [
      "More than the density of the liquid",
      "Equal to zero",
      "Always equal to water's density",
    ],
    explanation:
      "A body floats if the buoyant force balances its weight, which happens when it is less dense than the liquid.",
  },
  {
    prompt: "Archimedes' principle states that the upward buoyant force equals",
    answer: "The weight of fluid displaced",
    distractors: ["The weight of the object", "The mass of the object", "The volume of the object"],
    explanation: "The buoyant force on a submerged body equals the weight of the displaced fluid.",
  },
  {
    prompt: "Mass of a body",
    answer: "Remains the same everywhere",
    distractors: ["Changes with location", "Is measured in newton", "Becomes zero in space"],
    explanation:
      "Mass is a constant measure of matter; weight changes with gravitational acceleration.",
  },
]);

add("Science Class 9", "Work and Energy", [
  {
    prompt: "The SI unit of work and energy is",
    answer: "Joule",
    distractors: ["Newton", "Watt", "Pascal"],
    explanation: "One joule is the work done when a force of one newton moves a body one metre.",
  },
  {
    prompt: "The commercial unit of electrical energy is",
    answer: "Kilowatt-hour",
    distractors: ["Watt", "Joule", "Newton metre"],
    explanation: "One kilowatt-hour equals 3.6 × 10⁶ joules.",
  },
  {
    prompt: "Power is defined as",
    answer: "The rate of doing work",
    distractors: ["Force times distance", "Mass times acceleration", "Energy times time"],
    explanation: "Power = work done / time taken, measured in watt.",
  },
  {
    prompt: "A body of mass 2 kg moving at 3 m/s has kinetic energy of",
    answer: "9 J",
    distractors: ["3 J", "6 J", "18 J"],
    explanation: "KE = ½mv² = ½ × 2 × 3² = 9 joule.",
  },
  {
    prompt: "The law of conservation of energy states that energy",
    answer: "Can be transformed but not created or destroyed",
    distractors: ["Can be created in engines", "Is destroyed by friction", "Increases with time"],
    explanation: "Total energy of an isolated system remains constant; it only changes form.",
  },
]);

add("Science Class 9", "Sound", [
  {
    prompt: "Sound cannot travel through",
    answer: "Vacuum",
    distractors: ["Air", "Water", "Steel"],
    explanation: "Sound is a mechanical wave and needs a material medium to travel.",
  },
  {
    prompt: "The speed of sound is greatest in",
    answer: "Solids",
    distractors: ["Liquids", "Gases", "Vacuum"],
    explanation: "Closely packed particles in solids transmit vibrations fastest.",
  },
  {
    prompt: "The audible range of frequency for a normal human ear is",
    answer: "20 Hz to 20,000 Hz",
    distractors: ["2 Hz to 200 Hz", "200 Hz to 2,000 Hz", "20 kHz to 200 kHz"],
    explanation: "Below 20 Hz is infrasonic and above 20 kHz is ultrasonic for humans.",
  },
  {
    prompt: "The repeated reflection of sound that produces a distinct repetition is called",
    answer: "Echo",
    distractors: ["Reverberation", "Refraction", "Resonance"],
    explanation:
      "An echo is heard when reflected sound reaches the ear at least 0.1 second after the original.",
  },
  {
    prompt: "SONAR works on the principle of",
    answer: "Reflection of ultrasonic waves",
    distractors: ["Refraction of light", "Dispersion of sound", "Diffraction of radio waves"],
    explanation:
      "SONAR sends ultrasonic pulses and measures the time taken for the echo to return.",
  },
]);

add("Science Class 9", "Natural Resources", [
  {
    prompt: "Which gas is the most abundant in the Earth's atmosphere?",
    answer: "Nitrogen",
    distractors: ["Oxygen", "Carbon dioxide", "Argon"],
    explanation: "Nitrogen makes up about 78% of the atmosphere by volume.",
  },
  {
    prompt: "Which layer of the atmosphere contains the ozone layer?",
    answer: "Stratosphere",
    distractors: ["Troposphere", "Mesosphere", "Thermosphere"],
    explanation: "The ozone layer in the stratosphere absorbs harmful ultraviolet radiation.",
  },
  {
    prompt: "Which of these is a biogeochemical cycle?",
    answer: "The nitrogen cycle",
    distractors: ["The rock crushing cycle", "The trade cycle", "The election cycle"],
    explanation:
      "Nitrogen, carbon, oxygen and water cycles move elements between living and non-living components.",
  },
  {
    prompt: "Bacteria that convert atmospheric nitrogen into usable compounds are called",
    answer: "Nitrogen-fixing bacteria",
    distractors: ["Denitrifying bacteria", "Pathogenic bacteria", "Lactic acid bacteria"],
    explanation: "Rhizobium in root nodules of legumes fixes atmospheric nitrogen into ammonia.",
  },
  {
    prompt: "The main cause of acid rain is",
    answer: "Oxides of sulphur and nitrogen in the air",
    distractors: ["Excess oxygen", "Excess ozone", "Helium released by balloons"],
    explanation: "SO₂ and NO₂ dissolve in rain water to form sulphuric and nitric acids.",
  },
]);

/* ---------------------------------------------------------- Science Class 10 */

add("Science Class 10", "Chemical Reactions and Equations", [
  {
    prompt: "In a balanced chemical equation, the number of atoms of each element is",
    answer: "Equal on both sides",
    distractors: ["Greater on the product side", "Greater on the reactant side", "Always doubled"],
    explanation: "Balancing satisfies the law of conservation of mass.",
  },
  {
    prompt: "The reaction Fe + CuSO₄ → FeSO₄ + Cu is an example of",
    answer: "A displacement reaction",
    distractors: [
      "A combination reaction",
      "A decomposition reaction",
      "A double displacement reaction",
    ],
    explanation: "The more reactive iron displaces copper from copper sulphate solution.",
  },
  {
    prompt: "Rusting of iron is an example of",
    answer: "Oxidation",
    distractors: ["Reduction", "Neutralisation", "Sublimation"],
    explanation: "Iron reacts with oxygen and moisture, gaining oxygen, which is oxidation.",
  },
  {
    prompt: "A reaction that absorbs heat from the surroundings is called",
    answer: "Endothermic",
    distractors: ["Exothermic", "Neutral", "Catalytic"],
    explanation:
      "Endothermic reactions take in heat, lowering the temperature of the surroundings.",
  },
  {
    prompt: "Decomposition of a substance using electricity is called",
    answer: "Electrolysis",
    distractors: ["Photolysis", "Thermolysis", "Hydrolysis"],
    explanation:
      "Electrolytic decomposition splits a compound by passing electric current through it.",
  },
]);

add("Science Class 10", "Acids, Bases and Salts", [
  {
    prompt: "The pH of a strong acid is",
    answer: "Less than 7",
    distractors: ["Exactly 7", "More than 7", "Exactly 14 always"],
    explanation: "Acids release H⁺ ions in solution, giving a pH below 7.",
  },
  {
    prompt: "Which gas is evolved when a metal reacts with a dilute acid?",
    answer: "Hydrogen",
    distractors: ["Oxygen", "Carbon dioxide", "Chlorine"],
    explanation: "Metal + dilute acid gives salt and hydrogen gas, which burns with a pop sound.",
  },
  {
    prompt: "The chemical name of baking soda is",
    answer: "Sodium hydrogen carbonate",
    distractors: ["Sodium carbonate", "Calcium carbonate", "Sodium chloride"],
    explanation: "Baking soda is NaHCO₃, sodium hydrogen carbonate.",
  },
  {
    prompt: "Bleaching powder is chemically",
    answer: "Calcium oxychloride",
    distractors: ["Sodium chloride", "Calcium sulphate", "Sodium hydroxide"],
    explanation: "Bleaching powder, CaOCl₂, is made by passing chlorine over dry slaked lime.",
  },
  {
    prompt: "Plaster of Paris is obtained by heating",
    answer: "Gypsum",
    distractors: ["Limestone", "Common salt", "Washing soda"],
    explanation: "Heating gypsum at 373 K gives plaster of Paris, CaSO₄·½H₂O.",
  },
]);

add("Science Class 10", "Metals and Non-metals", [
  {
    prompt: "Metals generally form which type of oxides?",
    answer: "Basic oxides",
    distractors: ["Acidic oxides", "Neutral oxides only", "No oxides"],
    explanation: "Metal oxides are basic and react with acids to form salt and water.",
  },
  {
    prompt: "Which is the most ductile metal?",
    answer: "Gold",
    distractors: ["Iron", "Copper", "Aluminium"],
    explanation: "Gold is the most ductile and malleable metal known.",
  },
  {
    prompt: "Which non-metal is a good conductor of electricity?",
    answer: "Graphite",
    distractors: ["Sulphur", "Phosphorus", "Iodine"],
    explanation: "Graphite has free delocalised electrons, making it a good conductor.",
  },
  {
    prompt: "The process of coating iron with zinc to prevent rusting is called",
    answer: "Galvanisation",
    distractors: ["Anodising", "Alloying", "Electroplating with tin"],
    explanation: "Galvanisation covers iron with a protective layer of zinc.",
  },
  {
    prompt: "Brass is an alloy of",
    answer: "Copper and zinc",
    distractors: ["Copper and tin", "Iron and carbon", "Aluminium and copper"],
    explanation: "Brass contains copper and zinc, while bronze contains copper and tin.",
  },
]);

add("Science Class 10", "Carbon and Its Compounds", [
  {
    prompt: "The valency of carbon is",
    answer: "4",
    distractors: ["2", "3", "6"],
    explanation: "Carbon has four valence electrons and forms four covalent bonds.",
  },
  {
    prompt: "The functional group -COOH is called",
    answer: "Carboxylic acid group",
    distractors: ["Aldehyde group", "Ketone group", "Alcohol group"],
    explanation: "-COOH is the carboxyl group found in acids such as ethanoic acid.",
  },
  {
    prompt: "The common name of ethanoic acid is",
    answer: "Acetic acid",
    distractors: ["Formic acid", "Citric acid", "Lactic acid"],
    explanation:
      "Ethanoic acid, CH₃COOH, is commonly called acetic acid; 5-8% solution is vinegar.",
  },
  {
    prompt: "Compounds with the same molecular formula but different structures are called",
    answer: "Isomers",
    distractors: ["Isotopes", "Isobars", "Allotropes"],
    explanation: "Structural isomers share a molecular formula but differ in arrangement of atoms.",
  },
  {
    prompt: "Soap molecules form which structure in water?",
    answer: "Micelles",
    distractors: ["Crystals", "Polymers", "Emulsions only"],
    explanation:
      "The hydrophobic tails cluster inward and hydrophilic heads face water, forming micelles.",
  },
]);

add("Science Class 10", "Life Processes", [
  {
    prompt: "Exchange of gases in humans mainly occurs in the",
    answer: "Alveoli",
    distractors: ["Trachea", "Bronchi", "Diaphragm"],
    explanation:
      "Alveoli provide a thin, large surface area for gas exchange with blood capillaries.",
  },
  {
    prompt: "The functional unit of the kidney is",
    answer: "Nephron",
    distractors: ["Neuron", "Nephridia", "Villus"],
    explanation: "Each kidney contains about a million nephrons that filter blood.",
  },
  {
    prompt: "Which enzyme in saliva breaks down starch?",
    answer: "Salivary amylase",
    distractors: ["Pepsin", "Trypsin", "Lipase"],
    explanation:
      "Salivary amylase begins the digestion of starch into simpler sugars in the mouth.",
  },
  {
    prompt: "Xylem in plants transports",
    answer: "Water and minerals",
    distractors: ["Food only", "Hormones only", "Oxygen only"],
    explanation: "Xylem carries water and dissolved minerals from roots to the rest of the plant.",
  },
  {
    prompt: "The opening on the leaf surface used for gaseous exchange is called",
    answer: "Stomata",
    distractors: ["Lenticel", "Cuticle", "Chloroplast"],
    explanation: "Stomata, guarded by guard cells, allow exchange of gases and transpiration.",
  },
]);

add("Science Class 10", "Control and Coordination", [
  {
    prompt: "The functional unit of the nervous system is the",
    answer: "Neuron",
    distractors: ["Nephron", "Alveolus", "Axon only"],
    explanation: "Neurons receive, conduct and transmit nerve impulses.",
  },
  {
    prompt: "The gap between two neurons is called",
    answer: "Synapse",
    distractors: ["Dendrite", "Axon", "Myelin"],
    explanation: "Chemical signals cross the synaptic gap to transmit impulses between neurons.",
  },
  {
    prompt: "Which part of the brain controls balance and posture?",
    answer: "Cerebellum",
    distractors: ["Cerebrum", "Medulla", "Hypothalamus"],
    explanation: "The cerebellum maintains posture, balance and precision of voluntary actions.",
  },
  {
    prompt: "Which plant hormone promotes cell elongation?",
    answer: "Auxin",
    distractors: ["Abscisic acid", "Cytokinin", "Ethylene"],
    explanation: "Auxin causes cell elongation and is responsible for phototropism.",
  },
  {
    prompt: "Which hormone regulates blood sugar level in humans?",
    answer: "Insulin",
    distractors: ["Thyroxine", "Adrenaline", "Testosterone"],
    explanation: "Insulin from the pancreas lowers blood glucose by promoting its uptake by cells.",
  },
]);

add("Science Class 10", "How Do Organisms Reproduce", [
  {
    prompt: "Binary fission is commonly seen in",
    answer: "Amoeba",
    distractors: ["Hydra", "Planaria", "Yeast"],
    explanation: "Amoeba divides into two daughter cells by binary fission.",
  },
  {
    prompt: "Budding is a method of reproduction in",
    answer: "Yeast and Hydra",
    distractors: ["Amoeba only", "Spirogyra only", "Planaria only"],
    explanation: "In budding, a new individual develops from an outgrowth of the parent body.",
  },
  {
    prompt: "The male reproductive part of a flower is the",
    answer: "Stamen",
    distractors: ["Pistil", "Ovary", "Stigma"],
    explanation: "The stamen consists of the anther and filament and produces pollen grains.",
  },
  {
    prompt: "Fertilisation in humans normally takes place in the",
    answer: "Fallopian tube",
    distractors: ["Uterus", "Ovary", "Cervix"],
    explanation: "The sperm fuses with the ovum in the fallopian tube, forming a zygote.",
  },
  {
    prompt: "Regeneration is best observed in",
    answer: "Planaria",
    distractors: ["Human beings", "Birds", "Insects"],
    explanation: "Planaria can regenerate a complete organism from body fragments.",
  },
]);

add("Science Class 10", "Heredity", [
  {
    prompt: "Who is regarded as the father of genetics?",
    answer: "Gregor Mendel",
    distractors: ["Charles Darwin", "Hugo de Vries", "Lamarck"],
    explanation: "Mendel's pea plant experiments established the principles of inheritance.",
  },
  {
    prompt: "In a monohybrid cross between two heterozygous tall plants, the phenotypic ratio is",
    answer: "3 : 1",
    distractors: ["1 : 1", "1 : 2 : 1", "9 : 3 : 3 : 1"],
    explanation: "Tt × Tt yields three tall and one dwarf plant.",
  },
  {
    prompt: "The dihybrid phenotypic ratio in the F2 generation is",
    answer: "9 : 3 : 3 : 1",
    distractors: ["3 : 1", "1 : 2 : 1", "1 : 1 : 1 : 1"],
    explanation: "A dihybrid cross of two heterozygous parents gives a 9:3:3:1 phenotypic ratio.",
  },
  {
    prompt: "In humans, a male has which pair of sex chromosomes?",
    answer: "XY",
    distractors: ["XX", "YY", "XO"],
    explanation: "Human males are XY and females are XX.",
  },
  {
    prompt: "Traits acquired during the lifetime of an organism are",
    answer: "Not inherited by the next generation",
    distractors: ["Always inherited", "Inherited only by males", "Inherited only by females"],
    explanation: "Acquired traits do not change the DNA of germ cells, so they are not inherited.",
  },
]);

add("Science Class 10", "Light Reflection and Refraction", [
  {
    prompt: "The focal length of a spherical mirror is equal to",
    answer: "Half of its radius of curvature",
    distractors: [
      "Twice its radius of curvature",
      "Equal to its radius of curvature",
      "One fourth of its radius of curvature",
    ],
    explanation: "For a spherical mirror, f = R/2.",
  },
  {
    prompt: "A concave mirror forms a real, inverted and enlarged image when the object is placed",
    answer: "Between F and C",
    distractors: ["At infinity", "Beyond C", "Between P and F"],
    explanation:
      "An object between the focus and centre of curvature gives a magnified real image beyond C.",
  },
  {
    prompt: "The power of a lens is measured in",
    answer: "Dioptre",
    distractors: ["Lumen", "Candela", "Lux"],
    explanation: "Power P = 1/f (in metres) and is measured in dioptre (D).",
  },
  {
    prompt: "Which mirror is used as a rear-view mirror in vehicles?",
    answer: "Convex mirror",
    distractors: ["Concave mirror", "Plane mirror only", "Cylindrical mirror"],
    explanation:
      "A convex mirror always forms an erect, diminished image and gives a wider field of view.",
  },
  {
    prompt: "The refractive index of a medium is the ratio of",
    answer: "Speed of light in vacuum to speed of light in the medium",
    distractors: [
      "Speed of light in the medium to speed in vacuum",
      "Wavelength to frequency",
      "Angle of incidence to angle of reflection",
    ],
    explanation:
      "n = c/v, where c is the speed of light in vacuum and v is the speed in the medium.",
  },
]);

add("Science Class 10", "Human Eye and Colourful World", [
  {
    prompt: "The blue colour of the sky is due to",
    answer: "Scattering of light",
    distractors: ["Reflection of light", "Total internal reflection", "Dispersion by clouds"],
    explanation: "Air molecules scatter shorter blue wavelengths more strongly than red.",
  },
  {
    prompt: "Which part of the eye controls the amount of light entering it?",
    answer: "Iris",
    distractors: ["Cornea", "Retina", "Optic nerve"],
    explanation: "The iris adjusts the size of the pupil to control incoming light.",
  },
  {
    prompt: "The least distance of distinct vision for a normal human eye is",
    answer: "25 cm",
    distractors: ["10 cm", "50 cm", "100 cm"],
    explanation: "A normal eye can see objects clearly from about 25 cm to infinity.",
  },
  {
    prompt: "Hypermetropia is corrected using a",
    answer: "Convex lens",
    distractors: ["Concave lens", "Cylindrical lens", "Bifocal lens only"],
    explanation: "Long-sightedness is corrected with a converging convex lens.",
  },
  {
    prompt: "The splitting of white light by a prism into seven colours is called",
    answer: "Dispersion",
    distractors: ["Refraction", "Scattering", "Reflection"],
    explanation: "Different colours refract by different amounts, producing a spectrum.",
  },
]);

add("Science Class 10", "Electricity", [
  {
    prompt: "The SI unit of electric charge is",
    answer: "Coulomb",
    distractors: ["Ampere", "Volt", "Ohm"],
    explanation: "One coulomb is the charge transported by one ampere in one second.",
  },
  {
    prompt: "Ohm's law is mathematically expressed as",
    answer: "V = IR",
    distractors: ["V = I/R", "I = VR", "R = V·I"],
    explanation:
      "At constant temperature, potential difference is directly proportional to current.",
  },
  {
    prompt: "The resistance of a conductor increases when",
    answer: "Its length increases",
    distractors: [
      "Its area of cross-section increases",
      "Its temperature decreases in metals",
      "Current through it increases",
    ],
    explanation: "R = ρl/A, so resistance is directly proportional to length.",
  },
  {
    prompt: "Electric power is given by",
    answer: "P = VI",
    distractors: ["P = V/I", "P = I/V", "P = V + I"],
    explanation: "Power equals potential difference times current, also expressed as I²R or V²/R.",
  },
  {
    prompt: "In a household circuit, appliances are connected in",
    answer: "Parallel",
    distractors: ["Series", "Mixed series only", "Star connection"],
    explanation:
      "Parallel connection gives each appliance the same voltage and independent operation.",
  },
]);

add("Science Class 10", "Magnetic Effects of Electric Current", [
  {
    prompt: "A current-carrying conductor produces",
    answer: "A magnetic field around it",
    distractors: ["Only heat", "A vacuum", "An electric field only"],
    explanation:
      "Oersted showed that an electric current creates a magnetic field around the conductor.",
  },
  {
    prompt: "The direction of the magnetic field around a straight conductor is given by",
    answer: "The right-hand thumb rule",
    distractors: ["Lenz's law", "Ohm's law", "Coulomb's law"],
    explanation:
      "Point the right thumb along the current and the curled fingers show the field direction.",
  },
  {
    prompt: "Fleming's left-hand rule is used to find the direction of",
    answer: "Force on a current-carrying conductor in a magnetic field",
    distractors: ["Induced current", "Magnetic field of a solenoid", "Resistance of a wire"],
    explanation:
      "Fleming's left-hand rule applies to motors; the right-hand rule applies to generators.",
  },
  {
    prompt: "Electromagnetic induction was discovered by",
    answer: "Michael Faraday",
    distractors: ["James Watt", "Alessandro Volta", "André-Marie Ampère"],
    explanation: "Faraday showed that a changing magnetic field induces a current in a conductor.",
  },
  {
    prompt: "The earth wire in a domestic circuit is used to",
    answer: "Provide a low-resistance path to the ground for safety",
    distractors: ["Increase voltage", "Reduce electricity bill", "Store extra current"],
    explanation:
      "Earthing protects users from shock by diverting leakage current safely to the ground.",
  },
]);

add("Science Class 10", "Our Environment", [
  {
    prompt: "Waste that is broken down by microorganisms is called",
    answer: "Biodegradable waste",
    distractors: ["Non-biodegradable waste", "Radioactive waste", "Electronic waste"],
    explanation: "Vegetable peels and paper are biodegradable; plastics and metals are not.",
  },
  {
    prompt: "In a food chain, green plants occupy the trophic level of",
    answer: "Producers",
    distractors: ["Primary consumers", "Secondary consumers", "Decomposers"],
    explanation: "Producers form the first trophic level by converting solar energy into food.",
  },
  {
    prompt: "The ozone layer protects us from",
    answer: "Ultraviolet radiation",
    distractors: ["Infrared radiation", "Radio waves", "Visible light"],
    explanation: "Stratospheric ozone absorbs harmful UV rays from the Sun.",
  },
  {
    prompt: "Which chemical is mainly responsible for ozone depletion?",
    answer: "Chlorofluorocarbons",
    distractors: ["Carbon dioxide", "Methane", "Sulphur dioxide"],
    explanation: "CFCs release chlorine atoms that destroy ozone molecules in the stratosphere.",
  },
  {
    prompt: "The accumulation of harmful chemicals at higher trophic levels is called",
    answer: "Biomagnification",
    distractors: ["Eutrophication", "Biodegradation", "Nitrification"],
    explanation: "Non-degradable pesticides concentrate progressively along the food chain.",
  },
]);

/* --------------------------------------- Additional chapterwise coverage */

add("Math", "Number System", [
  {
    prompt: "Which of these is an irrational number?",
    answer: "√2",
    distractors: ["0.75", "22/7 as a fraction value", "−5"],
    explanation: "√2 cannot be written as a ratio of two integers, so it is irrational.",
  },
  {
    prompt: "The smallest prime number is",
    answer: "2",
    distractors: ["0", "1", "3"],
    explanation: "2 is the smallest and the only even prime number.",
  },
  {
    prompt: "The HCF of 12 and 18 is",
    answer: "6",
    distractors: ["2", "3", "36"],
    explanation: "Common factors of 12 and 18 are 1, 2, 3 and 6; the highest is 6.",
  },
  {
    prompt: "The LCM of 4 and 6 is",
    answer: "12",
    distractors: ["6", "10", "24"],
    explanation: "The smallest number divisible by both 4 and 6 is 12.",
  },
]);

add("Math", "Simplification", [
  {
    prompt: "BODMAS gives the correct order of operations as",
    answer: "Brackets, Orders, Division, Multiplication, Addition, Subtraction",
    distractors: [
      "Addition first, then brackets",
      "Subtraction first, then division",
      "Left to right without any rule",
    ],
    explanation: "BODMAS fixes the order in which arithmetic operations must be performed.",
  },
  {
    prompt: "Simplify: 12 + 4 × 3",
    answer: "24",
    distractors: ["48", "18", "36"],
    explanation: "Multiplication comes first: 4 × 3 = 12, then 12 + 12 = 24.",
  },
  {
    prompt: "Simplify: (15 − 5) ÷ 2",
    answer: "5",
    distractors: ["10", "12.5", "7.5"],
    explanation: "Brackets first: 15 − 5 = 10, then 10 ÷ 2 = 5.",
  },
]);

add("Math", "Percentage", [
  {
    prompt: "If a number is increased by 20% and then decreased by 20%, the net change is",
    answer: "A 4% decrease",
    distractors: ["No change", "A 4% increase", "A 20% decrease"],
    explanation: "Net effect = −(20 × 20)/100 = −4%, so the value falls by 4%.",
  },
  {
    prompt: "What percentage is 45 out of 180?",
    answer: "25%",
    distractors: ["20%", "30%", "40%"],
    explanation: "45/180 × 100 = 25%.",
  },
  {
    prompt: "A student scored 360 out of 450 marks. What is the percentage?",
    answer: "80%",
    distractors: ["75%", "85%", "90%"],
    explanation: "360/450 × 100 = 80%.",
  },
]);

add("Math", "Time and Work", [
  {
    prompt: "A can do a work in 10 days and B in 15 days. Working together they take",
    answer: "6 days",
    distractors: ["5 days", "12 days", "25 days"],
    explanation: "Combined one-day work = 1/10 + 1/15 = 1/6, so the work takes 6 days.",
  },
  {
    prompt:
      "If 5 workers finish a job in 12 days, how long will 10 equally efficient workers take?",
    answer: "6 days",
    distractors: ["24 days", "10 days", "8 days"],
    explanation:
      "Work is inversely proportional to the number of workers: 5 × 12 = 10 × x, so x = 6.",
  },
  {
    prompt: "A pipe fills a tank in 8 hours. What part of the tank is filled in 2 hours?",
    answer: "One fourth",
    distractors: ["One half", "One eighth", "One third"],
    explanation: "In one hour 1/8 is filled, so in two hours 2/8 = 1/4 is filled.",
  },
]);

add("Math", "Ratio and Proportion", [
  {
    prompt: "If a : b = 2 : 3 and b : c = 3 : 4, then a : c is",
    answer: "2 : 4",
    distractors: ["3 : 4", "2 : 3", "4 : 9"],
    explanation: "Chaining the ratios gives a : b : c = 2 : 3 : 4, so a : c = 2 : 4 or 1 : 2.",
  },
  {
    prompt: "Divide ₹600 in the ratio 2 : 3. The smaller share is",
    answer: "₹240",
    distractors: ["₹200", "₹300", "₹360"],
    explanation: "Total parts = 5, so smaller share = 600 × 2/5 = ₹240.",
  },
  {
    prompt: "The mean proportional between 4 and 9 is",
    answer: "6",
    distractors: ["5", "13", "36"],
    explanation: "Mean proportional = √(4 × 9) = √36 = 6.",
  },
]);

add("Math", "Profit and Loss", [
  {
    prompt: "An article bought for ₹500 is sold for ₹600. The profit percentage is",
    answer: "20%",
    distractors: ["10%", "16.67%", "25%"],
    explanation: "Profit = ₹100, profit% = 100/500 × 100 = 20%.",
  },
  {
    prompt: "If the selling price is less than the cost price, the result is",
    answer: "Loss",
    distractors: ["Profit", "No transaction", "Discount"],
    explanation: "Loss occurs when SP is below CP; loss = CP − SP.",
  },
  {
    prompt: "A shopkeeper marks an item at ₹1,000 and allows 20% discount. The selling price is",
    answer: "₹800",
    distractors: ["₹750", "₹820", "₹900"],
    explanation: "Discount = 20% of 1000 = ₹200, so SP = 1000 − 200 = ₹800.",
  },
]);

add("Math", "Simple Interest", [
  {
    prompt: "The formula for simple interest is",
    answer: "P × R × T / 100",
    distractors: ["P × R / T", "P + R + T", "P × T / R"],
    explanation: "Simple interest depends on principal, rate and time in the ratio PRT/100.",
  },
  {
    prompt: "Simple interest on ₹2,000 at 10% per annum for 3 years is",
    answer: "₹600",
    distractors: ["₹200", "₹300", "₹660"],
    explanation: "SI = 2000 × 10 × 3 / 100 = ₹600.",
  },
  {
    prompt: "In how many years will ₹1,000 amount to ₹1,200 at 10% simple interest?",
    answer: "2 years",
    distractors: ["1 year", "3 years", "4 years"],
    explanation: "Interest = ₹200 and yearly interest = ₹100, so the time is 2 years.",
  },
]);

add("Math Class 9", "Number Systems", [
  {
    prompt:
      "A rational number has a terminating decimal expansion when its denominator has prime factors",
    answer: "Only 2 and/or 5",
    distractors: ["Only 3 and 7", "Any prime number", "Only odd numbers"],
    explanation: "In lowest terms, denominators of the form 2ᵐ5ⁿ give terminating decimals.",
  },
  {
    prompt: "Which of these is a rational number?",
    answer: "0.75",
    distractors: ["√3", "π", "√7"],
    explanation: "0.75 = 3/4 can be written as a ratio of integers, so it is rational.",
  },
  {
    prompt: "Every real number is either rational or",
    answer: "Irrational",
    distractors: ["Imaginary", "Complex only", "Negative"],
    explanation: "The set of real numbers is the union of rational and irrational numbers.",
  },
]);

add("Math Class 9", "Polynomials", [
  {
    prompt: "The degree of the polynomial 5x³ − 2x + 7 is",
    answer: "3",
    distractors: ["1", "2", "7"],
    explanation: "The degree is the highest power of the variable, which is 3 here.",
  },
  {
    prompt: "A polynomial of degree 2 is called",
    answer: "Quadratic",
    distractors: ["Linear", "Cubic", "Constant"],
    explanation: "Degree 1 is linear, degree 2 is quadratic and degree 3 is cubic.",
  },
  {
    prompt: "If p(x) = x² − 4, then p(2) equals",
    answer: "0",
    distractors: ["2", "4", "−4"],
    explanation: "p(2) = 2² − 4 = 4 − 4 = 0, so 2 is a zero of the polynomial.",
  },
]);

add("Math Class 9", "Coordinate Geometry", [
  {
    prompt: "The point (0, 0) in the Cartesian plane is called the",
    answer: "Origin",
    distractors: ["Focus", "Vertex", "Centroid"],
    explanation: "The intersection of the x-axis and y-axis is the origin.",
  },
  {
    prompt: "A point with coordinates (−3, 5) lies in which quadrant?",
    answer: "Second quadrant",
    distractors: ["First quadrant", "Third quadrant", "Fourth quadrant"],
    explanation: "Negative x and positive y place the point in the second quadrant.",
  },
  {
    prompt: "The distance of the point (4, 0) from the origin is",
    answer: "4 units",
    distractors: ["0 units", "2 units", "16 units"],
    explanation: "The point lies on the x-axis, so its distance from the origin is 4 units.",
  },
]);

add("Math Class 9", "Linear Equations in Two Variables", [
  {
    prompt: "The graph of a linear equation in two variables is always",
    answer: "A straight line",
    distractors: ["A parabola", "A circle", "A hyperbola"],
    explanation: "Every solution of ax + by + c = 0 lies on a straight line.",
  },
  {
    prompt: "How many solutions does a linear equation in two variables have?",
    answer: "Infinitely many",
    distractors: ["Exactly one", "Exactly two", "None"],
    explanation: "Each value of x gives a corresponding y, producing infinitely many solutions.",
  },
  {
    prompt: "If x + y = 10 and x = 4, then y equals",
    answer: "6",
    distractors: ["4", "14", "40"],
    explanation: "Substituting x = 4 gives y = 10 − 4 = 6.",
  },
]);

add("Math Class 9", "Circles", [
  {
    prompt: "The longest chord of a circle is the",
    answer: "Diameter",
    distractors: ["Radius", "Tangent", "Secant"],
    explanation: "The diameter passes through the centre and is the longest chord.",
  },
  {
    prompt: "Equal chords of a circle are equidistant from the",
    answer: "Centre",
    distractors: ["Circumference", "Tangent point", "Chord midpoint only"],
    explanation: "A standard circle theorem states equal chords are equidistant from the centre.",
  },
  {
    prompt: "The angle in a semicircle is",
    answer: "90 degrees",
    distractors: ["45 degrees", "60 degrees", "180 degrees"],
    explanation: "An angle subtended by a diameter at any point on the circle is a right angle.",
  },
]);

add("Math Class 9", "Heron's Formula", [
  {
    prompt: "Heron's formula is used to find the",
    answer: "Area of a triangle when all three sides are known",
    distractors: ["Perimeter of a circle", "Volume of a cone", "Slope of a line"],
    explanation: "Area = √(s(s−a)(s−b)(s−c)), where s is the semi-perimeter.",
  },
  {
    prompt: "In Heron's formula, s stands for",
    answer: "The semi-perimeter of the triangle",
    distractors: ["The shortest side", "The area", "The sum of two sides"],
    explanation: "s = (a + b + c)/2, half the perimeter of the triangle.",
  },
  {
    prompt: "The area of a triangle with sides 3, 4 and 5 units is",
    answer: "6 square units",
    distractors: ["12 square units", "10 square units", "7.5 square units"],
    explanation: "It is a right triangle, so area = ½ × 3 × 4 = 6 square units.",
  },
]);

add("Math Class 9", "Statistics", [
  {
    prompt: "The mean of 4, 6 and 8 is",
    answer: "6",
    distractors: ["4", "8", "18"],
    explanation: "Mean = (4 + 6 + 8)/3 = 18/3 = 6.",
  },
  {
    prompt: "The most frequently occurring observation in a data set is the",
    answer: "Mode",
    distractors: ["Mean", "Median", "Range"],
    explanation: "Mode is the value that appears most often in the data.",
  },
  {
    prompt: "The middle value of an ordered data set is called the",
    answer: "Median",
    distractors: ["Mean", "Mode", "Frequency"],
    explanation: "After arranging data in order, the central value is the median.",
  },
]);

add("Math Class 10", "Real Numbers", [
  {
    prompt: "Euclid's division lemma states that for positive integers a and b, a = bq + r where",
    answer: "0 ≤ r < b",
    distractors: ["r > b", "r = b always", "r is always zero"],
    explanation: "The remainder is always non-negative and strictly less than the divisor.",
  },
  {
    prompt: "The HCF of 6 and 20 is",
    answer: "2",
    distractors: ["4", "10", "60"],
    explanation: "6 = 2 × 3 and 20 = 2² × 5, so the common factor is 2.",
  },
  {
    prompt:
      "The Fundamental Theorem of Arithmetic states that every composite number can be expressed as",
    answer: "A unique product of primes",
    distractors: [
      "A sum of two primes",
      "A product of two even numbers",
      "A difference of squares",
    ],
    explanation:
      "Prime factorisation of a composite number is unique apart from the order of factors.",
  },
]);

add("Math Class 10", "Polynomials", [
  {
    prompt: "For the quadratic polynomial ax² + bx + c, the sum of zeroes is",
    answer: "−b/a",
    distractors: ["c/a", "b/a", "−c/a"],
    explanation: "Sum of zeroes = −b/a and product of zeroes = c/a.",
  },
  {
    prompt: "For x² − 5x + 6, the product of zeroes is",
    answer: "6",
    distractors: ["−5", "5", "−6"],
    explanation: "Product of zeroes = c/a = 6/1 = 6.",
  },
  {
    prompt: "A quadratic polynomial has at most how many zeroes?",
    answer: "Two",
    distractors: ["One", "Three", "Four"],
    explanation: "A polynomial of degree n has at most n zeroes.",
  },
]);

add("Math Class 10", "Pair of Linear Equations", [
  {
    prompt: "A pair of linear equations has no solution when the lines are",
    answer: "Parallel",
    distractors: ["Intersecting", "Coincident", "Perpendicular"],
    explanation: "Parallel lines never meet, so the system is inconsistent with no solution.",
  },
  {
    prompt: "A pair of linear equations has infinitely many solutions when the lines are",
    answer: "Coincident",
    distractors: ["Parallel", "Intersecting at one point", "Perpendicular"],
    explanation: "Coincident lines overlap completely, giving infinitely many common solutions.",
  },
  {
    prompt: "If x + y = 12 and x − y = 4, then x equals",
    answer: "8",
    distractors: ["4", "6", "16"],
    explanation: "Adding the equations gives 2x = 16, so x = 8 and y = 4.",
  },
]);

add("Math Class 10", "Quadratic Equations", [
  {
    prompt: "The roots of ax² + bx + c = 0 are real and equal when",
    answer: "b² − 4ac = 0",
    distractors: ["b² − 4ac > 0", "b² − 4ac < 0", "a = 0"],
    explanation: "The discriminant being zero gives two equal real roots.",
  },
  {
    prompt: "The roots of x² − 5x + 6 = 0 are",
    answer: "2 and 3",
    distractors: ["1 and 6", "−2 and −3", "5 and 6"],
    explanation: "Factorising gives (x − 2)(x − 3) = 0, so x = 2 or x = 3.",
  },
  {
    prompt: "If the discriminant is negative, the quadratic equation has",
    answer: "No real roots",
    distractors: ["Two distinct real roots", "Two equal real roots", "Exactly one real root"],
    explanation: "A negative discriminant means the roots are imaginary, so no real roots exist.",
  },
]);

add("Math Class 10", "Arithmetic Progressions", [
  {
    prompt: "The nth term of an AP is given by",
    answer: "a + (n − 1)d",
    distractors: ["a + nd", "an + d", "a − (n − 1)d"],
    explanation: "Each term increases by the common difference d from the first term a.",
  },
  {
    prompt: "The common difference of the AP 3, 7, 11, 15 is",
    answer: "4",
    distractors: ["3", "7", "11"],
    explanation: "d = 7 − 3 = 4, and the difference stays constant.",
  },
  {
    prompt: "The sum of the first n terms of an AP is",
    answer: "n/2 × [2a + (n − 1)d]",
    distractors: ["n × (a + d)", "a + (n − 1)d", "n/2 × (a × d)"],
    explanation: "Sₙ = n/2 [2a + (n − 1)d], which also equals n/2 (first term + last term).",
  },
]);

add("Math Class 10", "Coordinate Geometry", [
  {
    prompt: "The distance between points (0, 0) and (3, 4) is",
    answer: "5 units",
    distractors: ["7 units", "12 units", "25 units"],
    explanation: "Distance = √(3² + 4²) = √25 = 5 units.",
  },
  {
    prompt: "The midpoint of the line joining (2, 4) and (6, 8) is",
    answer: "(4, 6)",
    distractors: ["(8, 12)", "(2, 6)", "(3, 4)"],
    explanation: "Midpoint = ((2+6)/2, (4+8)/2) = (4, 6).",
  },
  {
    prompt: "The distance formula between (x₁, y₁) and (x₂, y₂) is",
    answer: "√((x₂ − x₁)² + (y₂ − y₁)²)",
    distractors: ["(x₂ − x₁) + (y₂ − y₁)", "√((x₂ + x₁)² + (y₂ + y₁)²)", "(x₂ × y₂) − (x₁ × y₁)"],
    explanation: "The distance formula follows directly from the Pythagoras theorem.",
  },
]);

add("Math Class 10", "Trigonometry", [
  {
    prompt: "The value of sin²θ + cos²θ is",
    answer: "1",
    distractors: ["0", "2", "tan²θ"],
    explanation: "This is the fundamental Pythagorean trigonometric identity.",
  },
  {
    prompt: "The value of sin 30 degrees is",
    answer: "1/2",
    distractors: ["1", "√3/2", "0"],
    explanation: "sin 30° = 1/2 and cos 30° = √3/2.",
  },
  {
    prompt: "The value of tan 45 degrees is",
    answer: "1",
    distractors: ["0", "√3", "1/√3"],
    explanation: "tan 45° = sin 45° / cos 45° = 1.",
  },
  {
    prompt: "sec²θ − tan²θ equals",
    answer: "1",
    distractors: ["0", "2", "cot²θ"],
    explanation: "This identity follows from dividing sin²θ + cos²θ = 1 by cos²θ.",
  },
]);

add("Math Class 10", "Circles", [
  {
    prompt: "The tangent at any point of a circle is perpendicular to the",
    answer: "Radius through the point of contact",
    distractors: ["Diameter only", "Nearest chord", "Circumference"],
    explanation: "The radius drawn to the point of contact is always perpendicular to the tangent.",
  },
  {
    prompt: "How many tangents can be drawn to a circle from an external point?",
    answer: "Two",
    distractors: ["One", "Three", "Infinitely many"],
    explanation:
      "From an external point exactly two tangents can be drawn, and they are equal in length.",
  },
  {
    prompt: "The lengths of two tangents drawn from an external point to a circle are",
    answer: "Equal",
    distractors: ["Always unequal", "In the ratio 1:2", "Zero"],
    explanation: "Tangents drawn from an external point to a circle are equal in length.",
  },
]);

add("Math Class 10", "Surface Areas and Volumes", [
  {
    prompt: "The volume of a cone is",
    answer: "(1/3)πr²h",
    distractors: ["πr²h", "2πrh", "(4/3)πr³"],
    explanation: "A cone has one third the volume of a cylinder with the same base and height.",
  },
  {
    prompt: "The volume of a sphere of radius r is",
    answer: "(4/3)πr³",
    distractors: ["4πr²", "(1/3)πr³", "2πr³"],
    explanation: "Volume of a sphere = (4/3)πr³ and surface area = 4πr².",
  },
  {
    prompt: "The curved surface area of a cylinder is",
    answer: "2πrh",
    distractors: ["πr²h", "2πr(r + h)", "πrl"],
    explanation: "Curved surface area = 2πrh; total surface area = 2πr(r + h).",
  },
]);

add("Math Class 10", "Statistics", [
  {
    prompt: "The empirical relationship between mean, median and mode is",
    answer: "Mode = 3 Median − 2 Mean",
    distractors: ["Mode = 2 Median − 3 Mean", "Mean = 3 Mode − 2 Median", "Median = Mean + Mode"],
    explanation: "This empirical formula connects the three measures of central tendency.",
  },
  {
    prompt: "The class mark of the class interval 10–20 is",
    answer: "15",
    distractors: ["10", "20", "30"],
    explanation: "Class mark = (lower limit + upper limit)/2 = (10 + 20)/2 = 15.",
  },
  {
    prompt: "Which measure of central tendency is most affected by extreme values?",
    answer: "Mean",
    distractors: ["Median", "Mode", "Range of classes"],
    explanation: "The mean uses every observation, so outliers shift it strongly.",
  },
]);

add("Math Class 10", "Probability", [
  {
    prompt: "The probability of a sure event is",
    answer: "1",
    distractors: ["0", "0.5", "100"],
    explanation: "A certain event has probability 1, and an impossible event has probability 0.",
  },
  {
    prompt: "The probability of getting a head when a fair coin is tossed once is",
    answer: "1/2",
    distractors: ["1", "1/4", "0"],
    explanation: "There are two equally likely outcomes, so P(head) = 1/2.",
  },
  {
    prompt: "A die is thrown once. What is the probability of getting an even number?",
    answer: "1/2",
    distractors: ["1/3", "1/6", "2/3"],
    explanation: "Even numbers 2, 4 and 6 give 3 favourable outcomes out of 6, so P = 1/2.",
  },
  {
    prompt: "If P(E) = 0.3, then P(not E) is",
    answer: "0.7",
    distractors: ["0.3", "1.3", "0"],
    explanation: "P(E) + P(not E) = 1, so P(not E) = 1 − 0.3 = 0.7.",
  },
]);

export const QUIZ_TOPIC_BANK: Readonly<Record<string, readonly QuizBankItem[]>> = bank;

export const QUIZ_BANK_SUBJECTS: readonly string[] = Array.from(
  new Set(Object.keys(bank).map((key) => key.split("::")[0] ?? "")),
).filter(Boolean);

/** Returns the factual questions stored for an exact subject and topic pair. */
export function getBankItems(subject: string, topic: string): readonly QuizBankItem[] {
  return bank[`${subject}::${topic}`] ?? [];
}

/** Returns every factual question available for a subject, across all of its topics. */
export function getSubjectBankItems(subject: string): readonly QuizBankItem[] {
  const prefix = `${subject}::`;
  const items: QuizBankItem[] = [];
  for (const [key, value] of Object.entries(bank)) {
    if (key.startsWith(prefix)) items.push(...value);
  }
  return items;
}
