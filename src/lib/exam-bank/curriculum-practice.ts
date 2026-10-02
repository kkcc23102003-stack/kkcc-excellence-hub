/** New ORIGINAL PRACTICE, not official/PYQ questions. Same existing template architecture.
 * Topics for CBSE Class 9 are mapped to the retrieved 2026–27 primary course outlines.
 * Source URLs describe syllabus provenance, NOT provenance of an actual exam question.
 */
import {
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
  numericTemplate,
  numericOptions,
  type FactRow,
  type Template,
  fmtNum,
  gcd,
} from "./core";
import { APTITUDE_WIDE } from "./two-layer";
export const CURRICULUM_PRACTICE_SOURCES = {
  mathematics9:
    "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf",
  science9:
    "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/ScienceSt_SecP1_2026-27.pdf",
  socialScience9:
    "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/SocialScience_SecP1IX_2026-27.pdf",
  mathematics11:
    "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Maths_SecP2_2026-27.pdf",
};
const templates: Template[] = [];
function chapter(subject: string, topic: string, slug: string, entries: [string, string][]) {
  const rows: FactRow[] = entries.map(([key, value]) => ({ key, value }));
  const base = {
    id: `practice26:${slug}`,
    subject,
    topic,
    exams: ["CBSE Class 9", "CBSE Class 9-10"],
  };
  templates.push(
    ...factTemplate({
      ...base,
      difficulty: "Easy",
      rows,
      forward: "Foundation practice: identify the term for %s?",
      reverse: "Foundation practice: %s corresponds to which description?",
      explain:
        "In this chapter, %k is associated with %v. This question is original practice, not an official PYQ.",
    }),
    matchTemplate({ ...base, difficulty: "Moderate", rows, label: topic }),
    statementTemplate({ ...base, difficulty: "Moderate", rows, label: topic }),
    statementCountTemplate({ ...base, difficulty: "Difficult", rows, label: topic }),
  );
}
const sst = (topic: string, slug: string, rows: [string, string][]) =>
  chapter("SST Class 9", topic, `sst9:${slug}`, rows);
sst("Understanding Social Science", "understanding", [
  ["the study of past human societies using evidence", "History"],
  ["the study of Earth's places and spatial relationships", "Geography"],
  ["the study of government and political institutions", "Political Science"],
  ["the study of production, distribution and consumption", "Economics"],
  ["an original record created at the time of an event", "Primary source"],
  ["a later interpretation of historical evidence", "Secondary source"],
  ["including people fairly in social participation", "Inclusivity"],
  ["meeting present needs without compromising future generations", "Sustainable development"],
  ["the variety of social and cultural ways of life", "Diversity"],
  ["material remains studied to understand past societies", "Archaeological evidence"],
]);
sst("Shaping of the Earth's Surface", "surface", [
  ["the rigid outer layer divided into moving plates", "Lithosphere"],
  ["a boundary where plates move apart", "Divergent boundary"],
  ["a boundary where plates move towards one another", "Convergent boundary"],
  ["a boundary where plates slide past one another", "Transform boundary"],
  ["the breaking of rock in place", "Weathering"],
  ["the removal and transport of weathered material", "Erosion"],
  ["the laying down of transported material", "Deposition"],
  ["the location inside Earth where an earthquake starts", "Focus"],
  ["the point on the surface directly above an earthquake focus", "Epicentre"],
  ["a landform commonly made by deposition at a river mouth", "Delta"],
]);
sst("Atmosphere and Climate", "climate", [
  ["the lowest atmospheric layer where most weather occurs", "Troposphere"],
  ["the atmospheric layer containing the main ozone layer", "Stratosphere"],
  ["the short-term condition of the atmosphere", "Weather"],
  ["the long-term pattern of atmospheric conditions", "Climate"],
  ["the seasonal reversal of prevailing winds", "Monsoon"],
  ["water vapour changing into liquid droplets", "Condensation"],
  ["the amount of water vapour in air", "Humidity"],
  ["liquid water changing into water vapour", "Evaporation"],
  ["the warming caused by heat-trapping atmospheric gases", "Greenhouse effect"],
  ["the total greenhouse-gas emissions associated with an activity", "Carbon footprint"],
]);
sst("Early Humans and Beginning of Civilisation", "early-humans", [
  ["the archaeological period called the Old Stone Age", "Palaeolithic"],
  ["the archaeological period called the Middle Stone Age", "Mesolithic"],
  ["the archaeological period called the New Stone Age", "Neolithic"],
  ["the gradual cultivation of plants and taming of animals", "Domestication"],
  ["an early urban civilisation associated with the Indus region", "Harappan civilisation"],
  ["the civilisation located between the Tigris and Euphrates", "Mesopotamia"],
  ["the river closely associated with ancient Egypt", "Nile"],
  ["the river often associated with early Chinese civilisation", "Huang He"],
  ["a wedge-shaped writing system of ancient Mesopotamia", "Cuneiform"],
  ["the Harappan town noted for its dock-related archaeological remains", "Lothal"],
]);
sst("State and Society (up to 1000 CE)", "state-society", [
  ["the earliest of the four Vedas", "Rigveda"],
  ["an ancient Indian treatise associated with statecraft", "Arthashastra"],
  ["the ruler who established the Mauryan Empire", "Chandragupta Maurya"],
  ["the Mauryan ruler known for inscriptions on dhamma", "Ashoka"],
  ["the major capital associated with the Mauryan Empire", "Pataliputra"],
  ["associations of merchants and craftspeople in ancient India", "Guilds"],
  ["the ancient centre of learning in present-day Bihar", "Nalanda"],
  ["the ancient educational centre in the northwest", "Taxila"],
  ["the dynasty associated with Samudragupta", "Gupta dynasty"],
  ["the ancient port linked with trade on India's west coast", "Bharuch"],
]);
sst("Democracy", "democracy", [
  ["a system where people choose representatives to govern", "Representative democracy"],
  ["a system where citizens directly decide public matters", "Direct democracy"],
  [
    "adult citizens having the right to vote without wealth qualifications",
    "Universal adult franchise",
  ],
  ["all persons being subject to the law", "Rule of law"],
  ["a system allowing more than one political party to compete", "Multi-party system"],
  ["government based on the support of the people", "Popular sovereignty"],
  ["a vote cast without revealing a voter's choice publicly", "Secret ballot"],
  ["government being answerable for its decisions", "Accountability"],
  ["the party or parties not forming the government", "Opposition"],
  ["lawful limits on the government's powers", "Constitutionalism"],
]);
sst("Electoral Politics", "elections", [
  [
    "the constitutional body administering India's national and state elections",
    "Election Commission of India",
  ],
  ["a geographical area represented by an elected member", "Constituency"],
  ["the official list of eligible voters", "Electoral roll"],
  ["an election held to fill a vacant seat", "By-election"],
  ["the redrawing of electoral constituency boundaries", "Delimitation"],
  ["a government formed by an alliance of parties", "Coalition government"],
  ["the age at which an Indian citizen ordinarily becomes eligible to vote", "18 years"],
  ["the Constitution's schedule dealing with anti-defection provisions", "Tenth Schedule"],
  ["the voting method where the candidate with the most votes wins", "First-past-the-post"],
  ["the phase during which candidates seek voters' support", "Election campaign"],
]);
sst("Building Blocks in Economics", "economics", [
  ["limited resources relative to human wants", "Scarcity"],
  ["the next-best alternative sacrificed by a decision", "Opportunity cost"],
  ["the economic question concerning selection of goods and services", "What to produce"],
  ["the economic question concerning production methods", "How to produce"],
  ["the economic question concerning distribution among people", "For whom to produce"],
  ["an economy combining public and private sectors", "Mixed economy"],
  ["an economy where a central authority largely decides production", "Centrally planned economy"],
  ["an economy where prices chiefly guide resource allocation", "Market economy"],
  ["the transformation of inputs into goods and services", "Production"],
  ["the use of goods and services to satisfy wants", "Consumption"],
]);
sst("The Price Puzzle: What Drives the Market", "market", [
  ["quantity consumers are willing and able to buy at a stated price", "Quantity demanded"],
  ["quantity sellers are willing and able to sell at a stated price", "Quantity supplied"],
  ["the price at which quantity demanded equals quantity supplied", "Equilibrium price"],
  ["a legal maximum price", "Price ceiling"],
  ["a legal minimum price", "Price floor"],
  ["quantity demanded exceeding quantity supplied", "Shortage"],
  ["quantity supplied exceeding quantity demanded", "Surplus"],
  ["an uncompensated effect on a third party", "Externality"],
  ["a good that is non-rival and non-excludable", "Public good"],
  ["one party having more relevant information than another", "Information asymmetry"],
]);
sst("Oceans and Life", "oceans", [
  ["the world's largest ocean", "Pacific Ocean"],
  ["the horizontal movement of ocean water", "Ocean current"],
  ["the regular rise and fall of sea level", "Tide"],
  ["the submerged gently sloping edge of a continent", "Continental shelf"],
  ["the steep slope beyond the continental shelf", "Continental slope"],
  ["the broad, relatively flat deep-ocean floor", "Abyssal plain"],
  ["a long deep depression in the ocean floor", "Ocean trench"],
  ["the instrument commonly used to detect seismic activity", "Seismograph"],
  ["a large sea-wave series caused by sudden water displacement", "Tsunami"],
  ["the global convention governing many rights and duties at sea", "UNCLOS"],
]);
sst("Life on Earth", "life-earth", [
  ["a large ecological region with characteristic climate and vegetation", "Biome"],
  ["all living organisms and the parts of Earth supporting life", "Biosphere"],
  ["the variety of life at genetic, species and ecosystem levels", "Biodiversity"],
  ["a species naturally confined to a particular region", "Endemic species"],
  ["conservation of species in their natural habitats", "In-situ conservation"],
  ["conservation outside a species' natural habitat", "Ex-situ conservation"],
  ["the most strictly protected part of a biosphere reserve", "Core zone"],
  ["the zone surrounding a biosphere reserve's core area", "Buffer zone"],
  ["responsible tourism focused on natural areas and conservation", "Ecotourism"],
  ["planting trees on land not recently forested", "Afforestation"],
]);
sst("Resistance and Resilience (1000–1700 CE)", "resistance", [
  ["the south Indian dynasty associated with the Brihadishwara Temple", "Chola dynasty"],
  ["the ruler associated with the founding of the Maratha state", "Shivaji"],
  ["the poet-saint associated with devotional couplets and criticism of ritualism", "Kabir"],
  ["the founder of the Sikh tradition", "Guru Nanak"],
  ["the devotional tradition emphasising a personal relationship with the divine", "Bhakti"],
  ["the Deccan empire whose capital was at Hampi", "Vijayanagara Empire"],
  ["a defensive structure built to protect a settlement or strategic location", "Fortification"],
  ["the Rajput ruler associated with the Battle of Haldighati", "Maharana Pratap"],
  ["the Persian-language illustrated history commissioned under Akbar", "Akbarnama"],
  ["the Mughal emperor associated with the construction of the Taj Mahal", "Shah Jahan"],
]);
sst("India and the World I (1900 BCE–1200 CE)", "india-world", [
  ["the classical Indian mathematician associated with the Aryabhatiya", "Aryabhata"],
  ["the Indian medical tradition associated with the Sushruta Samhita", "Surgery"],
  ["the classical text associated with Charaka", "Charaka Samhita"],
  ["the religion prominently spread from India to East and Southeast Asia", "Buddhism"],
  ["the network of historic routes connecting Asia with Europe", "Silk Roads"],
  ["the language of many classical Indian scientific and literary texts", "Sanskrit"],
  ["the Chinese traveller associated with a visit to India in the seventh century", "Xuanzang"],
  ["the Chinese traveller associated with a visit during the Gupta period", "Faxian"],
  ["the historic Indian port associated with Roman trade near Puducherry", "Arikamedu"],
  ["the system in which a digit's value depends on its position", "Place-value notation"],
]);
sst("Authority", "authority", [
  ["the power to make decisions accepted as legitimate", "Authority"],
  ["the Indian political term associated with justice", "Nyaya"],
  ["the Indian political term associated with discipline or coercive power", "Danda"],
  ["the Indian political term associated with strength", "Bala"],
  ["the thinker traditionally associated with the Arthashastra", "Kautilya"],
  ["an authority based on recognised legal rules", "Legal-rational authority"],
  ["authority based on established customs", "Traditional authority"],
  ["authority based on a leader's exceptional personal appeal", "Charismatic authority"],
  ["a government's responsibility to promote people's well-being", "Welfare function"],
  ["a written framework defining governmental powers and rights", "Constitution"],
]);
sst("From Ideas to Startups", "startups", [
  ["organising resources and taking risks to create a business", "Entrepreneurship"],
  ["a proposed new solution addressing a need", "Business idea"],
  ["a structured document describing goals, market and finances", "Business plan"],
  ["money and resources invested in a business", "Capital"],
  ["total receipts from selling goods or services", "Revenue"],
  ["revenue minus total cost", "Profit"],
  ["the process of introducing a new or improved product or process", "Innovation"],
  ["the replacement of old methods by innovative new ones", "Creative destruction"],
  ["an organisation providing mentoring and support to young businesses", "Business incubator"],
  ["a financial statement showing assets and liabilities at a point in time", "Balance sheet"],
]);
chapter("Science Class 9", "Earth as a System: Energy, Matter and Life", "science9:earth", [
  ["all the water on Earth", "Hydrosphere"],
  ["the envelope of gases surrounding Earth", "Atmosphere"],
  ["Earth's frozen-water systems", "Cryosphere"],
  ["Earth's solid components", "Geosphere"],
  ["living organisms and their life-supporting environments", "Biosphere"],
  ["the movement of water through evaporation, condensation and precipitation", "Water cycle"],
  ["the chief external energy source driving Earth's climate", "The Sun"],
  ["the trapping of heat by atmospheric gases", "Greenhouse effect"],
  ["the return of water from plants to the atmosphere", "Transpiration"],
  ["the movement of carbon among air, living things, soil and oceans", "Carbon cycle"],
]);
chapter("Science Class 9", "Reproduction", "science9:reproduction", [
  ["reproduction involving the fusion of gametes", "Sexual reproduction"],
  ["reproduction without gamete fusion", "Asexual reproduction"],
  ["the fusion of male and female gametes", "Fertilisation"],
  ["transfer of pollen to the stigma", "Pollination"],
  ["the male gamete in humans", "Sperm"],
  ["the female gamete in humans", "Ovum"],
  ["the part of a flower that develops into a fruit", "Ovary"],
  ["the part of a flower that develops into a seed", "Ovule"],
  ["the cell formed by gamete fusion", "Zygote"],
  ["the organ where the human embryo normally develops", "Uterus"],
]);
const fraction = (n: number, d: number) => `${n / gcd(n, d)}/${d / gcd(n, d)}`;
function numberQuestion(answer: number, candidates: number[], prompt: string, explanation: string) {
  return {
    prompt,
    ...numericOptions(answer, candidates, (value) => fmtNum(value, 3)),
    explanation,
  };
}
for (const difficulty of ["Easy", "Moderate", "Difficult"] as const) {
  templates.push(
    numericTemplate({
      id: `practice26:math9:sequences:${difficulty}`,
      subject: "Math Class 9",
      topic: "Sequences and Progressions",
      difficulty,
      exams: ["CBSE Class 9", "CBSE Class 9-10"],
      sizes: [20, 10, 20],
      build: ([a = 0, b = 0, c = 0]) => {
        const first = a + 1,
          step = b + 1,
          n = c + 3;
        if (difficulty === "Easy")
          return numberQuestion(
            first + (n - 1) * step,
            [first + n * step, first + (n - 2) * step, n * step],
            `An arithmetic sequence starts at ${first} and increases by ${step}. What is its ${n}th term?`,
            `The nth term is a+(n−1)d. Substituting a=${first}, d=${step}, n=${n} gives ${first + (n - 1) * step}. This is original practice.`,
          );
        const total = (n * (2 * first + (n - 1) * step)) / 2;
        if (difficulty === "Moderate")
          return numberQuestion(
            total,
            [n * first, (n * (first + n * step)) / 2, total + step],
            `Find the sum of the first ${n} terms of the arithmetic sequence ${first}, ${first + step}, ${first + 2 * step}, …?`,
            `Use Sn=n[2a+(n−1)d]/2. Here a=${first}, d=${step}, n=${n}, so the sum is ${total}. This is original practice.`,
          );
        return numberQuestion(
          step,
          [step + 1, step * 2, n],
          `An arithmetic sequence has first term ${first}. Its first ${n} terms sum to ${total}. Find the common difference?`,
          `Rearranging Sn=n[2a+(n−1)d]/2 gives d=(2Sn/n−2a)/(n−1). With the stated values this gives ${step}. This is original practice.`,
        );
      },
    }),
  );
  templates.push(
    numericTemplate({
      id: `practice26:math9:probability:${difficulty}`,
      subject: "Math Class 9",
      topic: "Introduction to Probability",
      difficulty,
      exams: ["CBSE Class 9", "CBSE Class 9-10"],
      sizes: [15, 15],
      build: ([a = 0, b = 0]) => {
        const red = a + 1,
          blue = b + 1,
          total = red + blue,
          answer = difficulty === "Easy" ? red : difficulty === "Moderate" ? blue : total - red;
        const alternatives = new Set([fraction(answer, total)]);
        const wrong: string[] = [];
        for (let value = 0; value <= total && wrong.length < 3; value += 1) {
          const text = fraction(value, total);
          if (!alternatives.has(text)) {
            alternatives.add(text);
            wrong.push(text);
          }
        }
        if (wrong.length < 3) return null;
        return {
          prompt: `A bag has ${red} red and ${blue} blue balls. One ball is drawn uniformly at random. What is the probability of ${difficulty === "Easy" ? "red" : difficulty === "Moderate" ? "blue" : "not red"}?`,
          answer: fraction(answer, total),
          distractors: wrong,
          explanation: `There are ${total} equally likely balls and ${answer} favourable outcomes, so probability = ${answer}/${total} = ${fraction(answer, total)}. No replacement is involved because only one ball is drawn. This is original practice.`,
        };
      },
    }),
  );
  templates.push(
    numericTemplate({
      id: `practice26:math9:identities:${difficulty}`,
      subject: "Math Class 9",
      topic: "Exploring Algebraic Identities",
      difficulty,
      exams: ["CBSE Class 9", "CBSE Class 9-10"],
      sizes: [24, 12],
      build: ([a = 0, b = 0]) => {
        const x = a + 2,
          y = b + 1;
        const answer =
          difficulty === "Easy"
            ? (x + y) ** 2
            : difficulty === "Moderate"
              ? x ** 2 - y ** 2
              : (x + y) ** 2 - (x - y) ** 2;
        const expression =
          difficulty === "Easy"
            ? `(${x}+${y})²`
            : difficulty === "Moderate"
              ? `${x}²−${y}²`
              : `(${x}+${y})²−(${x}−${y})²`;
        return numberQuestion(
          answer,
          [answer + x, answer - y, x * y],
          `Use algebraic identities to evaluate ${expression}?`,
          `The identities (x+y)²=x²+2xy+y², x²−y²=(x−y)(x+y), and (x+y)²−(x−y)²=4xy apply. Substitution in the given expression produces ${answer}. This is original practice.`,
        );
      },
    }),
  );
  templates.push(
    numericTemplate({
      id: `practice26:math9:area:${difficulty}`,
      subject: "Math Class 9",
      topic: "Area and Perimeter",
      difficulty,
      exams: ["CBSE Class 9", "CBSE Class 9-10"],
      sizes: [24, 16],
      build: ([a = 0, b = 0]) => {
        const length = a + 3,
          width = b + 2,
          perimeter = 2 * (length + width),
          area = length * width;
        const answer = difficulty === "Easy" ? perimeter : difficulty === "Moderate" ? area : width;
        const prompt =
          difficulty === "Difficult"
            ? `A rectangle has perimeter ${perimeter} cm and length ${length} cm. Find its width?`
            : `A rectangle measures ${length} cm by ${width} cm. Find its ${difficulty === "Easy" ? "perimeter in cm" : "area in cm²"}?`;
        return numberQuestion(
          answer,
          [answer + length, answer - 1, answer + 2],
          prompt,
          `For a rectangle P=2(l+w) and A=lw. Substituting the given dimensions, or using w=P/2−l, produces ${answer} in the requested units. This is original practice.`,
        );
      },
    }),
  );
}
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
templates.push(
  numericTemplate({
    id: "practice26:calendar:weekday-shift",
    subject: "Quantitative Aptitude",
    topic: "Calendars",
    difficulty: "Easy",
    exams: [...APTITUDE_WIDE],
    sizes: [7, 20],
    build: ([day = 0, offset = 0]) => {
      const n = offset + 1,
        answer = days[(day + n) % 7]!;
      return {
        prompt: `Today is ${days[day]}. Which weekday will it be ${n} days from today?`,
        answer,
        distractors: [1, 2, 3].map((delta) => days[(day + n + delta) % 7]!),
        explanation: `Weekdays repeat every seven days. Advance ${n % 7} weekday positions from ${days[day]}, giving ${answer}. This is original aptitude practice.`,
      };
    },
  }),
);
export const CURRICULUM_PRACTICE_TEMPLATES = templates;

/** Add only an EASY recall layer where the original factual chapter lacked one.
 * These are transparent rephrasings of existing fact-table practice, not new PYQs,
 * not new factual coverage and not unrelated padding from another chapter/exam.
 */
export function foundationRecallPractice(existing: Template[]) {
  const easy = new Set(
    existing
      .filter((template) => template.difficulty === "Easy")
      .flatMap((template) =>
        template.exams.map((exam) => `${exam}|${template.subject}|${template.topic}`),
      ),
  );
  return existing
    .filter((template) => template.difficulty === "Moderate" && /:fwd(?:#\d+)?$/.test(template.id))
    .flatMap((template) => {
      const exams = template.exams.filter(
        (exam) => !easy.has(`${exam}|${template.subject}|${template.topic}`),
      );
      if (!exams.length) return [];
      for (const exam of exams) easy.add(`${exam}|${template.subject}|${template.topic}`);
      return [
        {
          ...template,
          id: `practice:foundation:${template.id}`,
          exams,
          difficulty: "Easy" as const,
          at: (index: number) => {
            const question = template.at(index);
            return question
              ? {
                  ...question,
                  prompt: `Foundation recall practice: ${question.prompt}`,
                  difficulty: "Easy" as const,
                  exams,
                }
              : null;
          },
        },
      ];
    });
}
