/**
 * ICSE Class 9 and 10 Mathematics — the chapters ICSE sets that NCERT does not.
 *
 * ICSE Maths is not the NCERT list with a different cover. Class 10 alone
 * carries GST, banking, shares and dividends, matrices, remainder and factor
 * theorem, linear inequations and loci, none of which appear in the NCERT
 * scheme. Those chapters live here so an ICSE student sees their real
 * syllabus and a CBSE student never gets an ICSE-only chapter.
 *
 * Chapters genuinely common to both boards - quadratic equations, arithmetic
 * progressions, coordinate geometry, similarity, circles, mensuration,
 * trigonometry, statistics and probability - stay in ncert9.ts and ncert10.ts
 * and are tagged to both boards there.
 *
 * Each chapter carries a Moderate working layer for the Kit 2 Coins quiz and
 * a Difficult exam layer for the paid test series.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementTemplate,
  statementCountTemplate,
} from "./core";

const templates: Template[] = [];

const ICSE9 = ["ICSE Class 9", "ICSE Class 9-10"];
const ICSE10 = ["ICSE Class 10", "ICSE Class 9-10"];

function chapter(opts: {
  id: string;
  subject: string;
  topic: string;
  exams: string[];
  forward: string;
  reverse?: string;
  explain: string;
  rows: FactRow[];
  hard: FactRow[];
}) {
  const base = { subject: opts.subject, topic: opts.topic, exams: opts.exams };
  templates.push(
    ...factTemplate({
      ...base,
      id: opts.id,
      difficulty: "Moderate",
      rows: opts.rows,
      forward: opts.forward,
      reverse: opts.reverse,
      explain: opts.explain,
    }),
    matchTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
    statementTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
    statementCountTemplate({ ...base, id: opts.id, difficulty: "Moderate", rows: opts.rows }),
  );
  if (opts.hard.length >= 3) {
    const hid = `${opts.id}:adv`;
    templates.push(
      ...factTemplate({
        ...base,
        id: hid,
        difficulty: "Difficult",
        rows: opts.hard,
        forward: opts.forward,
        reverse: opts.reverse,
        explain: opts.explain,
      }),
      matchTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
      statementTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
      statementCountTemplate({ ...base, id: hid, difficulty: "Difficult", rows: opts.hard }),
    );
  }
}

/* ===================================================== ICSE Maths Class 9 */

chapter({
  id: "im9:compound-interest",
  subject: "Math Class 9",
  topic: "Compound Interest (ICSE)",
  exams: ICSE9,
  forward: "In compound interest, what is %s?",
  reverse: "Which formula or term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Simple interest", value: "P times R times T divided by 100" },
    { key: "Amount under compound interest", value: "P times (1 plus R over 100) to the power n" },
    { key: "Compound interest", value: "Amount minus principal" },
    {
      key: "Conversion period",
      value: "The interval after which interest is added to the principal",
    },
    {
      key: "Half-yearly compounding",
      value: "Rate is halved and the number of periods is doubled",
    },
    {
      key: "Quarterly compounding",
      value: "Rate is divided by four and periods multiplied by four",
    },
    { key: "CI for the first year", value: "Equal to the simple interest for that year" },
    { key: "Difference between CI and SI for two years", value: "P times (R over 100) squared" },
    {
      key: "Growth formula",
      value: "Final value equals initial times (1 plus r over 100) to the power n",
    },
    {
      key: "Depreciation formula",
      value: "Final value equals initial times (1 minus r over 100) to the power n",
    },
    {
      key: "Rate when an amount doubles in n years",
      value: "Found by setting the growth factor equal to 2",
    },
    { key: "Inflation", value: "A steady percentage rise in price, handled like compound growth" },
  ],
  hard: [
    { key: "Difference between CI and SI on 8000 at 5 percent for 2 years", value: "20 rupees" },
    {
      key: "Why CI exceeds SI from the second year",
      value: "Interest itself starts earning interest",
    },
    { key: "Sum that amounts to 1331 in 3 years at 10 percent", value: "1000 rupees" },
    {
      key: "Difference for three years",
      value: "P times (R over 100) squared times (3 plus R over 100)",
    },
    {
      key: "Effect of half-yearly compounding on the amount",
      value: "It is slightly larger than yearly compounding at the same nominal rate",
    },
    {
      key: "Population after 2 years of 10 percent growth then 10 percent fall",
      value: "99 percent of the original, not 100",
    },
  ],
});

chapter({
  id: "im9:expansions-factorisation",
  subject: "Math Class 9",
  topic: "Expansions and Factorisation (ICSE)",
  exams: ICSE9,
  forward: "In expansions and factorisation, what is %s?",
  reverse: "Which identity is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "(a plus b) squared", value: "a squared plus 2ab plus b squared" },
    { key: "(a minus b) squared", value: "a squared minus 2ab plus b squared" },
    { key: "a squared minus b squared", value: "(a plus b)(a minus b)" },
    { key: "(a plus b) cubed", value: "a cubed plus b cubed plus 3ab(a plus b)" },
    { key: "(a minus b) cubed", value: "a cubed minus b cubed minus 3ab(a minus b)" },
    { key: "a cubed plus b cubed", value: "(a plus b)(a squared minus ab plus b squared)" },
    { key: "a cubed minus b cubed", value: "(a minus b)(a squared plus ab plus b squared)" },
    {
      key: "(a plus b plus c) squared",
      value: "a squared plus b squared plus c squared plus 2ab plus 2bc plus 2ca",
    },
    { key: "(x plus a)(x plus b)", value: "x squared plus (a plus b) x plus ab" },
    {
      key: "Factorisation by grouping",
      value: "Pairing terms so a common factor appears in each pair",
    },
    { key: "Splitting the middle term", value: "Writing bx as two parts whose product is ac" },
    {
      key: "Perfect square trinomial",
      value: "An expression of the form a squared plus or minus 2ab plus b squared",
    },
  ],
  hard: [
    {
      key: "a cubed plus b cubed plus c cubed minus 3abc",
      value:
        "(a plus b plus c)(a squared plus b squared plus c squared minus ab minus bc minus ca)",
    },
    {
      key: "Value of a cubed plus b cubed plus c cubed when a plus b plus c is zero",
      value: "3abc",
    },
    {
      key: "x squared plus 1 over x squared in terms of x plus 1 over x",
      value: "The square of that sum, minus 2",
    },
    {
      key: "x cubed plus 1 over x cubed in terms of x plus 1 over x",
      value: "The cube of that sum, minus 3 times the sum",
    },
    {
      key: "Factorisation of x to the fourth plus x squared plus 1",
      value: "(x squared plus x plus 1)(x squared minus x plus 1)",
    },
    {
      key: "Why grouping fails when terms are misordered",
      value:
        "The common factor appears only for the correct pairing, so terms must be rearranged first",
    },
  ],
});

chapter({
  id: "im9:indices-logarithms",
  subject: "Math Class 9",
  topic: "Indices and Logarithms (ICSE)",
  exams: ICSE9,
  forward: "In indices and logarithms, what is %s?",
  reverse: "Which law is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "a to the m times a to the n", value: "a to the power m plus n" },
    { key: "a to the m divided by a to the n", value: "a to the power m minus n" },
    { key: "(a to the m) to the n", value: "a to the power mn" },
    { key: "a to the power zero", value: "1 for any non-zero a" },
    { key: "a to the power minus n", value: "1 over a to the n" },
    { key: "a to the power one over n", value: "The nth root of a" },
    {
      key: "Definition of a logarithm",
      value: "If a to the x equals n then log of n to base a is x",
    },
    { key: "log of mn", value: "log m plus log n" },
    { key: "log of m over n", value: "log m minus log n" },
    { key: "log of m to the power p", value: "p times log m" },
    { key: "log of 1 to any base", value: "0" },
    { key: "log of a to base a", value: "1" },
    { key: "Common logarithm", value: "A logarithm to base 10" },
  ],
  hard: [
    {
      key: "Change of base formula",
      value: "log of n to base a equals log n divided by log a in any common base",
    },
    { key: "Value of log 8 to base 2", value: "3" },
    {
      key: "Why a logarithm of a negative number is not defined over the real numbers",
      value: "No real power of a positive base gives a negative result",
    },
    { key: "Value of a to the power log of n to base a", value: "n" },
    { key: "log 2 plus log 5 in base 10", value: "1, since 2 times 5 is 10" },
    { key: "Number of digits in 2 to the power 100", value: "31, found from 100 times log 2" },
  ],
});

/* ==================================================== ICSE Maths Class 10 */

chapter({
  id: "im10:gst",
  subject: "Math Class 10",
  topic: "Goods and Services Tax (ICSE)",
  exams: ICSE10,
  forward: "In GST, what is %s?",
  reverse: "Which term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "GST", value: "A single indirect tax on the supply of goods and services" },
    { key: "CGST", value: "The central share of GST on an intra-state supply" },
    { key: "SGST", value: "The state share of GST on an intra-state supply" },
    { key: "IGST", value: "The single tax charged on an inter-state supply" },
    {
      key: "Intra-state supply",
      value: "A supply within the same state, split into CGST and SGST",
    },
    { key: "Inter-state supply", value: "A supply from one state to another, charged as IGST" },
    { key: "Input tax credit", value: "Credit for the GST already paid on purchases" },
    { key: "Net GST payable", value: "Output GST minus input tax credit" },
    { key: "Discount treatment", value: "GST is charged on the price after discount" },
    { key: "Taxable value", value: "The price on which GST is calculated" },
    { key: "CGST on an 18 percent intra-state supply", value: "9 percent, half the total rate" },
    { key: "IGST on an 18 percent inter-state supply", value: "The full 18 percent" },
  ],
  hard: [
    { key: "Net GST when output is 900 and input credit is 540", value: "360 rupees payable" },
    {
      key: "Why input tax credit prevents cascading",
      value: "Each dealer pays tax only on the value he adds, not on tax already paid",
    },
    {
      key: "GST on goods worth 10000 at 12 percent within a state",
      value: "600 CGST and 600 SGST",
    },
    {
      key: "Effect of a discount on the GST amount",
      value: "It lowers the taxable value, so the GST falls proportionally",
    },
    {
      key: "Dealer with input credit larger than output tax",
      value: "Nothing is payable and the excess is carried forward",
    },
    {
      key: "Total amount paid by the final consumer",
      value: "Taxable value plus GST, with no credit available to him",
    },
  ],
});

chapter({
  id: "im10:banking",
  subject: "Math Class 10",
  topic: "Banking — Recurring Deposits (ICSE)",
  exams: ICSE10,
  forward: "In banking, what is %s?",
  reverse: "Which term or formula is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Recurring deposit",
      value: "An account in which a fixed sum is deposited every month for a fixed term",
    },
    { key: "Maturity value", value: "Total deposited plus the interest earned" },
    { key: "Equivalent principal for one month", value: "P times n times (n plus 1) divided by 2" },
    {
      key: "Interest on a recurring deposit",
      value: "Equivalent principal times r over 100 times 1 over 12",
    },
    { key: "Total sum deposited", value: "Monthly instalment times the number of months" },
    { key: "Monthly instalment", value: "The fixed amount paid in each month" },
    { key: "Time in years for n months", value: "n divided by 12" },
    { key: "Rate of interest", value: "The annual percentage applied to the equivalent principal" },
    { key: "Number of months in 2 years", value: "24" },
    { key: "Interest type used", value: "Simple interest on the equivalent principal" },
    {
      key: "Maturity value formula",
      value: "P times n plus the interest computed on the equivalent principal",
    },
    {
      key: "Effect of a longer term",
      value: "Both the deposit and the interest rise, the interest faster",
    },
  ],
  hard: [
    {
      key: "Equivalent principal for 1000 per month over 12 months",
      value: "78000 rupees, from 1000 times 12 times 13 over 2",
    },
    { key: "Interest on that deposit at 8 percent", value: "520 rupees" },
    { key: "Maturity value in that case", value: "12520 rupees" },
    {
      key: "Why the n(n plus 1) over 2 factor appears",
      value:
        "The first instalment earns interest for n months, the last for one, and the sum is that series",
    },
    {
      key: "Finding the rate when maturity value is given",
      value: "Subtract the deposit to get the interest and solve for r",
    },
    {
      key: "Finding n when the maturity value is known",
      value: "It gives a quadratic in n, whose positive root is the number of months",
    },
  ],
});

chapter({
  id: "im10:shares-dividends",
  subject: "Math Class 10",
  topic: "Shares and Dividends (ICSE)",
  exams: ICSE10,
  forward: "In shares and dividends, what is %s?",
  reverse: "Which term is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Nominal value", value: "The face value printed on a share" },
    { key: "Market value", value: "The price at which the share is actually traded" },
    { key: "Share at par", value: "A share whose market value equals its nominal value" },
    { key: "Share at premium", value: "A share whose market value exceeds its nominal value" },
    { key: "Share at discount", value: "A share whose market value is below its nominal value" },
    { key: "Dividend", value: "The profit paid out per share, always on the nominal value" },
    { key: "Number of shares", value: "Total investment divided by the market value of one share" },
    { key: "Total dividend", value: "Number of shares times nominal value times the rate" },
    { key: "Return percent", value: "Annual income divided by the investment, as a percentage" },
    { key: "Investment", value: "Number of shares times the market value per share" },
    { key: "Annual income", value: "Another name for the total dividend received" },
    { key: "Dividend rate", value: "The percentage of the nominal value paid as profit" },
  ],
  hard: [
    { key: "Income from 100 shares of nominal value 10 paying 8 percent", value: "80 rupees" },
    {
      key: "Return percent when a 10 rupee share at 8 percent is bought at 16",
      value: "5 percent",
    },
    {
      key: "Why dividend never depends on market value",
      value: "The company declares it as a percentage of the face value only",
    },
    {
      key: "Better of two investments",
      value: "The one with the higher return percent, not the higher dividend rate",
    },
    {
      key: "Effect of a rising market value on return percent",
      value: "It falls, because the same income costs more to buy",
    },
    { key: "Shares bought for 7500 at market value 25 with face value 10", value: "300 shares" },
  ],
});

chapter({
  id: "im10:matrices",
  subject: "Math Class 10",
  topic: "Matrices (ICSE)",
  exams: ICSE10,
  forward: "In matrices, what is %s?",
  reverse: "Which term or rule is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Matrix", value: "A rectangular arrangement of numbers in rows and columns" },
    { key: "Order of a matrix", value: "The number of rows by the number of columns" },
    { key: "Row matrix", value: "A matrix with exactly one row" },
    { key: "Column matrix", value: "A matrix with exactly one column" },
    { key: "Square matrix", value: "A matrix with equal numbers of rows and columns" },
    { key: "Zero matrix", value: "A matrix in which every element is zero" },
    { key: "Unit matrix", value: "A square matrix with ones on the diagonal and zeros elsewhere" },
    { key: "Condition for addition", value: "Both matrices must have the same order" },
    {
      key: "Condition for multiplication",
      value: "Columns of the first must equal rows of the second",
    },
    { key: "Order of the product", value: "Rows of the first by columns of the second" },
    { key: "Transpose", value: "The matrix obtained by interchanging rows and columns" },
    { key: "Scalar multiplication", value: "Multiplying every element by the same number" },
  ],
  hard: [
    {
      key: "Why matrix multiplication is not commutative",
      value: "AB and BA may differ in value, and may not even both be defined",
    },
    { key: "Product of a 2 by 3 and a 3 by 2 matrix", value: "A 2 by 2 matrix" },
    {
      key: "Effect of multiplying by the unit matrix",
      value: "The matrix is unchanged, so I behaves like 1",
    },
    { key: "Matrix A with A squared equal to A", value: "An idempotent matrix" },
    {
      key: "Why AB can be zero without A or B being zero",
      value: "Matrix multiplication has zero divisors, unlike ordinary numbers",
    },
    {
      key: "Transpose of a product AB",
      value: "The transpose of B times the transpose of A, in that order",
    },
  ],
});

chapter({
  id: "im10:remainder-factor",
  subject: "Math Class 10",
  topic: "Remainder and Factor Theorem (ICSE)",
  exams: ICSE10,
  forward: "In the remainder and factor theorem, what is %s?",
  reverse: "Which theorem or result is described as: %s?",
  explain: "%k is %v.",
  rows: [
    { key: "Remainder theorem", value: "The remainder on dividing f(x) by (x minus a) is f(a)" },
    { key: "Factor theorem", value: "(x minus a) is a factor of f(x) exactly when f(a) is zero" },
    { key: "Remainder on dividing by (x plus a)", value: "f(minus a)" },
    { key: "Remainder on dividing by (ax minus b)", value: "f of b over a" },
    { key: "Degree of the remainder", value: "Always less than the degree of the divisor" },
    { key: "Remainder when dividing by a linear factor", value: "A constant" },
    { key: "Zero of a polynomial", value: "A value making the polynomial equal to zero" },
    { key: "Synthetic division", value: "A short method of dividing by a linear factor" },
    { key: "f(x) divided by (x minus 1)", value: "Leaves remainder f(1)" },
    { key: "Number of linear factors of a cubic", value: "At most three" },
    {
      key: "Using the factor theorem to factorise",
      value: "Find one root by trial, divide out, then factorise the quotient",
    },
    {
      key: "Rational root candidates",
      value: "Factors of the constant term divided by factors of the leading coefficient",
    },
  ],
  hard: [
    {
      key: "Remainder when x cubed minus 3x squared plus 4 is divided by (x minus 2)",
      value: "0, so (x minus 2) is a factor",
    },
    { key: "Value of k if (x minus 1) is a factor of x cubed plus kx minus 4", value: "3" },
    {
      key: "Why trial roots start with factors of the constant term",
      value: "Any integer root must divide the constant term exactly",
    },
    {
      key: "Remainder when a polynomial is divided by a quadratic",
      value: "A linear expression of the form ax plus b",
    },
    {
      key: "Polynomial leaving the same remainder on division by (x minus 1) and (x minus 2)",
      value: "Its values at 1 and 2 are equal",
    },
    {
      key: "Factorisation of x cubed minus 6x squared plus 11x minus 6",
      value: "(x minus 1)(x minus 2)(x minus 3)",
    },
  ],
});

chapter({
  id: "im10:inequations-loci",
  subject: "Math Class 10",
  topic: "Linear Inequations and Loci (ICSE)",
  exams: ICSE10,
  forward: "In linear inequations and loci, what is %s?",
  reverse: "Which rule or locus is described as: %s?",
  explain: "%k is %v.",
  rows: [
    {
      key: "Linear inequation",
      value: "A statement using a comparison sign instead of an equals sign",
    },
    {
      key: "Effect of multiplying an inequation by a negative number",
      value: "The direction of the inequality reverses",
    },
    { key: "Solution set", value: "The set of all values satisfying the inequation" },
    { key: "Replacement set", value: "The set from which the solutions are chosen" },
    {
      key: "Number line representation",
      value: "A filled circle for inclusive and a hollow circle for strict inequality",
    },
    { key: "Locus", value: "The path of a point moving under a stated condition" },
    {
      key: "Locus of points at a fixed distance from a point",
      value: "A circle centred at that point",
    },
    {
      key: "Locus of points equidistant from two points",
      value: "The perpendicular bisector of the segment joining them",
    },
    {
      key: "Locus of points equidistant from two intersecting lines",
      value: "The pair of angle bisectors",
    },
    {
      key: "Locus of points at a fixed distance from a line",
      value: "Two lines parallel to it, one on each side",
    },
    {
      key: "Locus of points equidistant from two parallel lines",
      value: "A line parallel to both, midway between them",
    },
    {
      key: "Circumcentre as a locus result",
      value: "The point equidistant from all three vertices of a triangle",
    },
  ],
  hard: [
    {
      key: "Solution of minus 2x greater than 6",
      value: "x less than minus 3, since dividing by a negative reverses the sign",
    },
    {
      key: "Why the replacement set matters",
      value: "The same inequation has different solution sets over integers and over real numbers",
    },
    {
      key: "Locus of a point whose distances from two fixed points are in a constant ratio",
      value: "A circle, known as the Apollonius circle",
    },
    {
      key: "Incentre as a locus result",
      value: "The point equidistant from all three sides, where the angle bisectors meet",
    },
    { key: "Greatest integer satisfying 3x minus 5 less than 7", value: "3" },
    {
      key: "Locus of the midpoint of a chord of fixed length in a circle",
      value: "A concentric circle of smaller radius",
    },
  ],
});

export const ICSE_MATHS_TEMPLATES = templates;
