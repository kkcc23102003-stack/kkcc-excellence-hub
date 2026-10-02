/**
 * Indian Polity — the full recruitment-exam syllabus.
 *
 * Polity carried eight chapters. Every serious exam - UPSC, State PSC, SSC,
 * railways, banking and the Punjab cadres - sets far more than that. The
 * missing chapters are added here: citizenship, fundamental duties, the
 * amendment process, centre-state relations, emergency provisions, every
 * constitutional body, the major non-constitutional bodies, the schedules,
 * the sources of the Constitution and the electoral machinery.
 */

import { type Template } from "./core";
import { CIVIL_DEFENCE, GK_WIDE, chapterFactory } from "./two-layer";

const templates: Template[] = [];
const POLITY = [...new Set([...GK_WIDE, ...CIVIL_DEFENCE])];
const ch = chapterFactory(templates, "Polity", POLITY);

ch(
  "pol:preamble",
  "Preamble and Sources of the Constitution",
  "In the Preamble and the sources of the Constitution, what is %s?",
  "%k is %v.",
  [
    { key: "Opening words of the Preamble", value: "We, the people of India" },
    {
      key: "Nature of the Indian state in the Preamble",
      value: "Sovereign, Socialist, Secular, Democratic Republic",
    },
    { key: "Date in the Preamble", value: "26 November 1949" },
    { key: "Parliamentary system source", value: "Borrowed from the United Kingdom" },
    { key: "Fundamental Rights source", value: "Borrowed from the United States" },
    { key: "Directive Principles source", value: "Borrowed from Ireland" },
    { key: "Concurrent List source", value: "Borrowed from Australia" },
    {
      key: "Emergency provisions source",
      value: "Borrowed from the Weimar Constitution of Germany",
    },
    { key: "Fundamental Duties source", value: "Borrowed from the erstwhile USSR" },
    { key: "Procedure established by law source", value: "Borrowed from Japan" },
  ],
  [
    {
      key: "Words added by the 42nd Amendment",
      value: "Socialist, Secular and Integrity, in 1976",
    },
    {
      key: "Whether the Preamble is part of the Constitution",
      value: "Yes, held so in Kesavananda Bharati, 1973",
    },
    { key: "Whether the Preamble can be amended", value: "Yes, but not its basic structure" },
    {
      key: "Berubari Union case on the Preamble",
      value: "It held in 1960 that the Preamble was not part of the Constitution, later overruled",
    },
    {
      key: "Source of the quasi-federal structure",
      value: "Canada, including a strong centre and residuary powers with the union",
    },
  ],
);

ch(
  "pol:union-territory",
  "Union and its Territory, and Citizenship",
  "On the union, its territory and citizenship, what is %s?",
  "%k is %v.",
  [
    { key: "Article 1", value: "Declares India, that is Bharat, to be a Union of States" },
    { key: "Article 2", value: "Empowers Parliament to admit or establish new states" },
    { key: "Article 3", value: "Empowers Parliament to form new states and alter boundaries" },
    { key: "Articles on citizenship", value: "Articles 5 to 11" },
    { key: "Article 11", value: "Gives Parliament the power to regulate citizenship by law" },
    { key: "Citizenship Act", value: "Enacted in 1955 and amended several times since" },
    {
      key: "Citizenship by birth",
      value: "Acquired by being born in India, subject to conditions on parentage",
    },
    {
      key: "Citizenship by naturalisation",
      value: "Granted to a foreigner after a qualifying period of residence",
    },
    {
      key: "Single citizenship",
      value: "India has only union citizenship, with no separate state citizenship",
    },
    {
      key: "Overseas Citizen of India",
      value:
        "A status granting a foreign national of Indian origin most economic rights but no vote",
    },
  ],
  [
    {
      key: "States Reorganisation Act year",
      value: "1956, which redrew states on a linguistic basis",
    },
    {
      key: "Fazl Ali Commission",
      value: "The 1953 commission whose report led to linguistic reorganisation",
    },
    {
      key: "Majority needed to alter a state boundary",
      value: "A simple majority in Parliament, since it is not a constitutional amendment",
    },
    {
      key: "Whether a state's consent is needed to alter its boundary",
      value: "No, only its views must be sought, and they are not binding",
    },
    { key: "Loss of citizenship modes", value: "Renunciation, termination and deprivation" },
  ],
);

ch(
  "pol:fundamental-duties",
  "Fundamental Duties and the Amendment Process",
  "On fundamental duties and constitutional amendment, what is %s?",
  "%k is %v.",
  [
    { key: "Article on Fundamental Duties", value: "Article 51A" },
    { key: "Year Fundamental Duties were added", value: "1976, by the 42nd Amendment" },
    { key: "Committee that recommended them", value: "The Swaran Singh Committee" },
    { key: "Original number of Fundamental Duties", value: "Ten" },
    {
      key: "Current number of Fundamental Duties",
      value: "Eleven, after the 86th Amendment in 2002",
    },
    {
      key: "Eleventh Fundamental Duty",
      value: "To provide education to a child between six and fourteen years",
    },
    { key: "Enforceability of Fundamental Duties", value: "Not enforceable by any court" },
    { key: "Article on amendment", value: "Article 368" },
    {
      key: "Simple majority amendment",
      value: "Used for creating states and changing boundaries, outside Article 368",
    },
    {
      key: "Special majority amendment",
      value: "Two thirds of members present and voting, plus a majority of total membership",
    },
  ],
  [
    {
      key: "Amendments needing state ratification",
      value: "Those affecting federal provisions, needing half the state legislatures",
    },
    {
      key: "Basic structure doctrine",
      value: "Laid down in Kesavananda Bharati, 1973, limiting Parliament's amending power",
    },
    { key: "First Amendment", value: "Enacted in 1951, it added the Ninth Schedule" },
    {
      key: "44th Amendment",
      value: "Enacted in 1978, it removed the right to property from Fundamental Rights",
    },
    {
      key: "Whether an amendment bill can start in a state legislature",
      value: "No, it can be introduced only in Parliament",
    },
  ],
);

ch(
  "pol:centre-state",
  "Centre-State Relations",
  "On centre-state relations, what is %s?",
  "%k is %v.",
  [
    { key: "Seventh Schedule", value: "Contains the Union, State and Concurrent Lists" },
    { key: "Union List subjects", value: "Ninety eight subjects of national importance" },
    { key: "State List subjects", value: "Fifty nine subjects of state and local importance" },
    { key: "Concurrent List subjects", value: "Fifty two subjects on which both may legislate" },
    { key: "Residuary powers", value: "Vest in Parliament under Article 248" },
    {
      key: "Article 249",
      value: "Parliament may legislate on a State List subject in the national interest",
    },
    {
      key: "Article 252",
      value: "Parliament may legislate for two or more states at their request",
    },
    {
      key: "Article 254",
      value: "Union law prevails over state law on a Concurrent List conflict",
    },
    { key: "Finance Commission article", value: "Article 280" },
    { key: "Inter-State Council article", value: "Article 263" },
  ],
  [
    { key: "Sarkaria Commission", value: "The 1983 commission on centre-state relations" },
    {
      key: "Punchhi Commission",
      value: "The 2007 commission that revisited centre-state relations",
    },
    {
      key: "Article 356",
      value: "President's rule in a state on failure of constitutional machinery",
    },
    {
      key: "S R Bommai judgment",
      value: "The 1994 ruling that made Article 356 subject to judicial review",
    },
    {
      key: "Goods and Services Tax Council article",
      value: "Article 279A, added by the 101st Amendment",
    },
  ],
);

ch(
  "pol:emergency",
  "Emergency Provisions",
  "On emergency provisions, what is %s?",
  "%k is %v.",
  [
    {
      key: "Article 352",
      value: "National emergency, on war, external aggression or armed rebellion",
    },
    { key: "Article 356", value: "State emergency, or President's rule" },
    { key: "Article 360", value: "Financial emergency" },
    { key: "Number of national emergencies declared", value: "Three, in 1962, 1971 and 1975" },
    {
      key: "Ground added by the 44th Amendment",
      value: "Armed rebellion replaced internal disturbance",
    },
    {
      key: "Approval period for a national emergency",
      value: "One month, by both Houses with a special majority",
    },
    { key: "Duration once approved", value: "Six months at a time, extendable indefinitely" },
    {
      key: "Article 358",
      value: "Suspends Article 19 automatically during a national emergency on war grounds",
    },
    {
      key: "Article 359",
      value: "Allows suspension of the enforcement of other Fundamental Rights",
    },
    { key: "Financial emergencies so far", value: "None have ever been declared" },
  ],
  [
    {
      key: "Rights that can never be suspended",
      value: "Articles 20 and 21, protected by the 44th Amendment",
    },
    {
      key: "Maximum normal duration of President's rule",
      value: "Three years, with conditions after the first year",
    },
    {
      key: "Who advises the President to proclaim an emergency",
      value: "The Cabinet, in writing, after the 44th Amendment",
    },
    {
      key: "Effect of a national emergency on the federal structure",
      value: "It becomes effectively unitary, with Parliament able to legislate on state subjects",
    },
    {
      key: "Minerva Mills case",
      value: "The 1980 ruling that further limited emergency powers and the amending power",
    },
  ],
);

ch(
  "pol:constitutional-bodies",
  "Constitutional Bodies",
  "Among constitutional bodies, what is %s?",
  "%k is %v.",
  [
    { key: "Election Commission article", value: "Article 324" },
    { key: "Union Public Service Commission article", value: "Article 315" },
    { key: "Comptroller and Auditor General article", value: "Article 148" },
    { key: "Attorney General of India article", value: "Article 76" },
    { key: "Advocate General of a State article", value: "Article 165" },
    { key: "Finance Commission term", value: "Constituted every five years by the President" },
    { key: "National Commission for Scheduled Castes", value: "Article 338" },
    { key: "National Commission for Scheduled Tribes", value: "Article 338A" },
    {
      key: "National Commission for Backward Classes",
      value: "Article 338B, added by the 102nd Amendment",
    },
    { key: "Special Officer for Linguistic Minorities", value: "Article 350B" },
  ],
  [
    {
      key: "Tenure of the Chief Election Commissioner",
      value: "Six years or until the age of 65, whichever is earlier",
    },
    {
      key: "Removal of the Chief Election Commissioner",
      value: "The same manner as a Supreme Court judge",
    },
    {
      key: "Who is called the guardian of the public purse",
      value: "The Comptroller and Auditor General",
    },
    { key: "First law officer of the Government of India", value: "The Attorney General" },
    {
      key: "16th Finance Commission chairman",
      value: "Arvind Panagariya, constituted in 2023 for the period from 2026",
    },
  ],
);

ch(
  "pol:statutory-bodies",
  "Statutory and Non-Constitutional Bodies",
  "Among statutory and non-constitutional bodies, what is %s?",
  "%k is %v.",
  [
    {
      key: "NITI Aayog",
      value: "The policy think tank that replaced the Planning Commission in 2015",
    },
    {
      key: "National Human Rights Commission",
      value: "Set up in 1993 under the Protection of Human Rights Act",
    },
    {
      key: "Central Information Commission",
      value: "Set up in 2005 under the Right to Information Act",
    },
    {
      key: "Central Vigilance Commission",
      value: "The apex anti-corruption body, made statutory in 2003",
    },
    { key: "Lokpal", value: "The national anti-corruption ombudsman created by the 2013 Act" },
    {
      key: "Central Bureau of Investigation",
      value: "Established in 1963 under the Delhi Special Police Establishment Act",
    },
    { key: "National Commission for Women", value: "Set up in 1992 by an Act of Parliament" },
    { key: "National Green Tribunal", value: "Set up in 2010 for environmental cases" },
    { key: "Competition Commission of India", value: "Set up under the Competition Act of 2002" },
    {
      key: "National Disaster Management Authority",
      value: "Set up in 2005, chaired by the Prime Minister",
    },
  ],
  [
    { key: "Chairperson of NITI Aayog", value: "The Prime Minister of India" },
    {
      key: "Chairperson of the NHRC",
      value: "A retired Chief Justice or a judge of the Supreme Court",
    },
    {
      key: "Body that is neither constitutional nor statutory",
      value: "NITI Aayog, which was created by an executive resolution",
    },
    { key: "Lokayukta", value: "The state-level counterpart of the Lokpal" },
    {
      key: "Body recommending the Lokpal chairperson",
      value: "A selection committee headed by the Prime Minister",
    },
  ],
);

ch(
  "pol:elections",
  "Elections and Political Parties",
  "On elections and political parties, what is %s?",
  "%k is %v.",
  [
    { key: "Article 326", value: "Provides elections on the basis of adult suffrage" },
    { key: "Voting age", value: "Eighteen, lowered by the 61st Amendment in 1988" },
    {
      key: "Representation of the People Act",
      value: "The 1950 and 1951 Acts governing elections",
    },
    {
      key: "Model Code of Conduct",
      value: "Rules binding on parties from the announcement of elections",
    },
    { key: "First past the post", value: "The system in which the candidate with most votes wins" },
    { key: "NOTA", value: "The none-of-the-above option, introduced in 2013" },
    { key: "VVPAT", value: "The paper trail machine that lets a voter verify their vote" },
    { key: "Anti-defection law", value: "Contained in the Tenth Schedule, added in 1985" },
    { key: "Deciding authority on defection", value: "The Presiding Officer of the House" },
    {
      key: "Electoral bond",
      value: "A bearer instrument for political donation, struck down in 2024",
    },
  ],
  [
    {
      key: "Recognition as a national party",
      value:
        "Six percent votes in four states plus four Lok Sabha seats, or two percent of Lok Sabha seats from three states",
    },
    {
      key: "Article 324 powers",
      value: "Superintendence, direction and control of elections vest in the Election Commission",
    },
    {
      key: "91st Amendment",
      value: "It capped the Council of Ministers at fifteen percent of House strength",
    },
    {
      key: "Supreme Court ruling on electoral bonds",
      value: "Struck down in February 2024 as violating the right to information",
    },
    { key: "Minimum age to contest a Lok Sabha seat", value: "Twenty five years" },
  ],
);

ch(
  "pol:schedules",
  "Schedules and Important Articles",
  "Among the schedules and key articles, what is %s?",
  "%k is %v.",
  [
    { key: "First Schedule", value: "Lists the states and union territories" },
    { key: "Second Schedule", value: "Salaries and emoluments of high offices" },
    { key: "Third Schedule", value: "Forms of oath and affirmation" },
    { key: "Fourth Schedule", value: "Allocation of Rajya Sabha seats" },
    { key: "Fifth Schedule", value: "Administration of scheduled areas and tribes" },
    { key: "Sixth Schedule", value: "Tribal areas of Assam, Meghalaya, Tripura and Mizoram" },
    { key: "Seventh Schedule", value: "The three legislative lists" },
    { key: "Eighth Schedule", value: "The twenty two recognised languages" },
    { key: "Ninth Schedule", value: "Laws protected from judicial review, added in 1951" },
    { key: "Tenth Schedule", value: "The anti-defection provisions" },
  ],
  [
    {
      key: "Eleventh Schedule",
      value: "Twenty nine subjects for panchayats, added by the 73rd Amendment",
    },
    {
      key: "Twelfth Schedule",
      value: "Eighteen subjects for municipalities, added by the 74th Amendment",
    },
    { key: "Total number of schedules", value: "Twelve" },
    {
      key: "I R Coelho case",
      value:
        "The 2007 ruling that Ninth Schedule laws after 1973 are open to basic structure review",
    },
    {
      key: "Article 32",
      value: "The right to constitutional remedies, called the heart and soul of the Constitution",
    },
  ],
);

export const POLITY_FULL_TEMPLATES = templates;
