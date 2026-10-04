/** Small editable teaching templates shipped with the app, never stored as a bank in Supabase. */
export const NOTE_DIAGRAM_TEMPLATES = [
  {
    subject: "Biology",
    title: "Blood circulation",
    body: ":::cycle Blood circulation (simplified)\nRight heart → Lungs → Left heart → Body tissues\n:::",
  },
  {
    subject: "Science / Geography",
    title: "Water cycle",
    body: ":::cycle Water cycle (simplified)\nEvaporation → Condensation → Precipitation → Collection\n:::",
  },
  {
    subject: "Accounting",
    title: "Accounting cycle",
    body: ":::flow Accounting cycle\nSource documents → Journal → Ledger → Trial balance → Adjustments → Financial statements\n:::",
  },
  {
    subject: "Taxation",
    title: "GST calculation",
    body: "# GST calculation\nGST = \\frac{TaxableValue \\times Rate}{100}\n:::flow GST calculation\nIdentify taxable value → Confirm applicable rate → Calculate GST → Add GST to taxable value\n:::",
  },
  {
    subject: "Mathematics",
    title: "Quadratic equation",
    body: "# Quadratic equation\nax^2 + bx + c = 0\nx = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\n:::flow Solve a quadratic (a ≠ 0)\nIdentify a, b, c → Calculate discriminant → Substitute in quadratic formula → Check roots\n:::",
  },
  {
    subject: "Computer Awareness",
    title: "Input–process–output",
    body: ":::flow Information processing\nInput → Processing → Output\n:::",
  },
  {
    subject: "Polity",
    title: "Organs of government",
    body: ":::tree Organs of government\nGovernment\nLegislature — makes laws\nExecutive — implements laws\nJudiciary — interprets laws\n:::",
  },
  {
    subject: "Modern History",
    title: "Indian independence timeline",
    body: ":::timeline Independence milestones\n1857: Uprising\n1885: Indian National Congress founded\n1930: Salt March\n1942: Quit India Movement\n1947: Independence and Partition\n:::",
  },
  {
    subject: "Business Economics",
    title: "Demand and supply",
    body: ":::compare Demand and supply\nDemand | Supply\nBuyers' willingness and ability to buy | Sellers' willingness and ability to sell\nUsually falls as price rises, other things equal | Usually rises as price rises, other things equal\n:::",
  },
  {
    subject: "Teaching Aptitude",
    title: "Teaching plan",
    body: ":::flow Lesson planning\nLearning objectives → Prior knowledge → Explain and demonstrate → Guided practice → Assessment → Feedback\n:::",
  },
] as const;
