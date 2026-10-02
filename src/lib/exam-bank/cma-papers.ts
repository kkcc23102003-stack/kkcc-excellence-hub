/**
 * The two CMA Intermediate papers the bank did not have.
 *
 * Source: Institute of Cost Accountants of India, Syllabus 2022 —
 * Paper 9 Operations Management and Strategic Management (OMSM) and
 * Paper 12 Management Accounting (MA), both in Group II.
 *
 * Paper 12 sections: introduction to management accounting; activity based
 * costing; decision making tools (marginal costing, its short-term
 * applications, transfer pricing); standard costing and variance analysis;
 * forecasting, budgeting and budgetary control; divisional performance
 * measurement; responsibility accounting; decision theory.
 *
 * Paper 9 Section A operations management: introduction; operations
 * planning; design of operational systems and control; operation research
 * and production planning and control; productivity and quality management;
 * project management, monitoring and control; economics of maintenance and
 * spares management. Section B strategic management: introduction;
 * strategic analysis and planning; formulation and implementation of
 * strategy; digital strategy.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const CMA = ["CMA Intermediate", "CMA Final"];

const templates: Template[] = [];
const ma = chapterFactory(templates, "Management Accounting", CMA);
const om = chapterFactory(templates, "Operations and Strategic Management", CMA);

ma(
  "cma:ma:costing-tools",
  "Marginal Costing, Activity Based Costing and Decision Making",
  "In management accounting, what is %s?",
  "%k is %v.",
  [
    {
      key: "Management accounting",
      value:
        "The provision of financial and non-financial information to managers for planning, control and decision making",
    },
    {
      key: "Marginal cost",
      value:
        "The change in total cost from producing one more unit, in practice the variable cost per unit",
    },
    {
      key: "Contribution",
      value: "Sales less variable cost, the amount available to cover fixed cost and profit",
    },
    {
      key: "Profit volume ratio",
      value: "Contribution divided by sales, expressed as a percentage",
    },
    {
      key: "Break-even point",
      value: "The level of output at which total contribution equals fixed cost, so profit is nil",
    },
    {
      key: "Margin of safety",
      value: "The excess of actual or budgeted sales over break-even sales",
    },
    {
      key: "Activity based costing",
      value:
        "Assigning overhead to products by the activities that drive it rather than by a single volume base",
    },
    { key: "Cost driver", value: "The factor that causes the cost of an activity to change" },
    {
      key: "Key factor",
      value: "The limiting factor that restricts output, against which contribution is maximised",
    },
    {
      key: "Transfer price",
      value: "The price at which one division of a firm supplies goods or services to another",
    },
  ],
  [
    {
      key: "Difference between marginal and absorption costing",
      value:
        "Marginal costing charges only variable cost to the product and writes fixed cost off against the period, absorption costing carries fixed overhead into inventory, so the two give different profit whenever stock levels change",
    },
    {
      key: "Reason activity based costing was developed",
      value:
        "Overhead grew large and no longer moved with labour hours, so a single volume base cross-subsidised low-volume complex products at the expense of simple high-volume ones",
    },
    {
      key: "Basis for accepting a special order below normal price",
      value:
        "Accept if the price exceeds marginal cost and spare capacity exists, provided the order does not disturb the regular market or existing contribution",
    },
    {
      key: "Principles of transfer pricing",
      value:
        "Market price where an outside market exists, marginal cost plus an opportunity charge where it does not, and negotiated price where divisions must retain autonomy — the aim being goal congruence rather than divisional advantage",
    },
    {
      key: "Make or buy decision rule",
      value:
        "Compare the marginal cost of making with the buying price, add any opportunity cost of the capacity used, and treat unavoidable fixed cost as irrelevant",
    },
  ],
);

ma(
  "cma:ma:control-performance",
  "Standard Costing, Budgetary Control and Performance Measurement",
  "In management control, what is %s?",
  "%k is %v.",
  [
    {
      key: "Standard cost",
      value: "A predetermined cost of a product or operation under specified conditions",
    },
    { key: "Variance", value: "The difference between standard cost and actual cost" },
    {
      key: "Material price variance",
      value: "Actual quantity multiplied by the difference between standard and actual price",
    },
    {
      key: "Material usage variance",
      value: "Standard price multiplied by the difference between standard and actual quantity",
    },
    {
      key: "Labour rate variance",
      value: "Actual hours multiplied by the difference between standard and actual rate",
    },
    {
      key: "Labour efficiency variance",
      value: "Standard rate multiplied by the difference between standard and actual hours",
    },
    {
      key: "Budget",
      value: "A quantitative plan of action for a future period, expressed in money or units",
    },
    {
      key: "Flexible budget",
      value: "A budget that adjusts to the actual level of activity achieved",
    },
    {
      key: "Zero base budgeting",
      value: "Building the budget from nil each period, so every item must be justified afresh",
    },
    {
      key: "Responsibility accounting",
      value:
        "Reporting results against the manager who controls them, through cost, profit and investment centres",
    },
  ],
  [
    {
      key: "Difference between a fixed and a flexible budget",
      value:
        "A fixed budget is set for one activity level and becomes useless if output differs, a flexible budget restates the cost allowance at the level actually achieved, which makes the variance meaningful",
    },
    {
      key: "Difference between return on investment and residual income",
      value:
        "Return on investment is a ratio and can make a divisional manager reject a project that beats the cost of capital but lowers the average, residual income is an absolute figure after a capital charge and avoids that distortion",
    },
    {
      key: "Meaning of management by exception",
      value:
        "Reporting only variances that are significant, so managerial attention goes where it is needed rather than to every line",
    },
    {
      key: "Three types of responsibility centre",
      value:
        "A cost centre where the manager controls cost only, a profit centre where the manager controls cost and revenue, and an investment centre where the manager also controls the capital employed",
    },
    {
      key: "Reason an adverse variance is not always bad",
      value:
        "An adverse material price variance may buy better quality that cuts usage and rework, so variances interact and must be read together rather than one by one",
    },
  ],
);

om(
  "cma:om:operations",
  "Operations Management, Planning and Quality",
  "In operations management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Operations management",
      value:
        "The design, operation and improvement of the systems that create a firm's goods and services",
    },
    { key: "Productivity", value: "The ratio of output produced to the input used" },
    {
      key: "Plant layout",
      value: "The physical arrangement of machines, workstations and services within a facility",
    },
    {
      key: "Process layout",
      value: "A layout grouping similar machines together, suited to job and batch production",
    },
    {
      key: "Product layout",
      value: "A layout arranging machines in the sequence of operations, suited to mass production",
    },
    {
      key: "Economic order quantity",
      value: "The order size that minimises the sum of ordering cost and carrying cost",
    },
    {
      key: "Just in time",
      value:
        "A system in which material arrives exactly when needed, so inventory is cut to a minimum",
    },
    {
      key: "Total quality management",
      value:
        "An organisation-wide approach of continuous improvement in which quality is everyone's responsibility",
    },
    {
      key: "Six Sigma",
      value: "A method of reducing variation to about 3.4 defects per million opportunities",
    },
    {
      key: "Critical path",
      value: "The longest path through a network, which determines the minimum project duration",
    },
  ],
  [
    {
      key: "Difference between PERT and CPM",
      value:
        "PERT uses three time estimates and suits projects of uncertain duration such as research, CPM uses a single estimate with a cost-time trade-off and suits repetitive construction-type work",
    },
    {
      key: "Difference between preventive and breakdown maintenance",
      value:
        "Preventive maintenance services equipment on a schedule to avoid failure, breakdown maintenance repairs after failure — the economic choice balances downtime cost against the cost of servicing",
    },
    {
      key: "Meaning of float or slack in a network",
      value:
        "The time an activity can be delayed without delaying the project; activities on the critical path have zero float",
    },
    {
      key: "Reason a product layout raises productivity but reduces flexibility",
      value:
        "Machines are dedicated to one sequence, which cuts handling and setup, but changing the product means rebuilding the line",
    },
    {
      key: "Difference between quality control and quality assurance",
      value:
        "Quality control inspects output to detect defects, quality assurance builds the process so that defects do not occur",
    },
  ],
);

om(
  "cma:om:strategy",
  "Strategic Management and Digital Strategy",
  "In strategic management, what is %s?",
  "%k is %v.",
  [
    {
      key: "Strategy",
      value:
        "The long-term direction and scope of an organisation, matching its resources to a changing environment",
    },
    { key: "Vision statement", value: "A statement of what the organisation aspires to become" },
    {
      key: "Mission statement",
      value: "A statement of the organisation's present purpose and business",
    },
    {
      key: "SWOT analysis",
      value:
        "An assessment of internal strengths and weaknesses against external opportunities and threats",
    },
    {
      key: "PESTLE analysis",
      value:
        "Scanning the political, economic, social, technological, legal and environmental context",
    },
    {
      key: "Porter's five forces",
      value:
        "Rivalry, the threat of new entrants, the threat of substitutes, and the bargaining power of buyers and of suppliers",
    },
    { key: "Porter's generic strategies", value: "Cost leadership, differentiation and focus" },
    {
      key: "Value chain",
      value:
        "Porter's framework of primary and support activities through which a firm creates value",
    },
    {
      key: "BCG matrix",
      value:
        "A portfolio grid of stars, cash cows, question marks and dogs, plotted on growth and relative market share",
    },
    {
      key: "Digital strategy",
      value:
        "The use of digital technology to change the business model and the way value is delivered",
    },
  ],
  [
    {
      key: "Difference between strategy formulation and implementation",
      value:
        "Formulation decides what to do and is largely analytical and centralised, implementation makes it happen through structure, systems and people and is where most strategies fail",
    },
    {
      key: "Difference between corporate, business and functional strategy",
      value:
        "Corporate strategy decides which businesses to be in, business strategy decides how to compete in each, and functional strategy aligns marketing, operations and finance behind that choice",
    },
    {
      key: "Risk of being stuck in the middle",
      value:
        "A firm that pursues neither cost leadership nor differentiation clearly ends with neither the lowest cost nor a premium price, and is beaten on both sides",
    },
    {
      key: "Use of the BCG matrix in practice",
      value:
        "Cash from cash cows funds question marks that can become stars, while dogs are divested — but the grid uses only two variables and ignores synergy between units",
    },
    {
      key: "Way digital technology changes competitive advantage",
      value:
        "It lowers entry barriers and raises buyer power by making information transparent, so advantage shifts from scale and location to data, network effects and speed of learning",
    },
  ],
);

export const CMA_PAPERS_TEMPLATES = templates;
