/**
 * Mathematics, chapter by chapter, across the full NCERT Class 11 and Class 12
 * syllabus. JEE Main, JEE Advanced, NDA, CUET and the CBSE and ISC board
 * papers all set questions straight out of these chapters, and the standard
 * results below are exactly what those papers test.
 *
 * Each chapter carries its own class tag, so the Class 11 and Class 12
 * sections stay separate.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementCountTemplate,
  statementTemplate,
} from "./core";

const M11 = [
  "JEE Main",
  "JEE Advanced",
  "NDA/CDS",
  "CBSE Class 11",
  "ISC Class 11",
  "CBSE Class 11-12 Science",
  "ISC Science",
  "CUET",
];

const M12 = [
  "JEE Main",
  "JEE Advanced",
  "NDA/CDS",
  "CBSE Class 12",
  "ISC Class 12",
  "CBSE Class 11-12 Science",
  "ISC Science",
  "CUET",
];

const templates: Template[] = [];

function add(
  id: string,
  topic: string,
  difficulty: "Easy" | "Moderate" | "Difficult",
  exams: string[],
  rows: FactRow[],
  matchLabel: string,
) {
  const subject = "Mathematics";
  const spec = { id, subject, topic, difficulty, exams, rows };
  templates.push(
    ...factTemplate({
      ...spec,
      forward: "In mathematics, %s is:",
      reverse: "Which standard result is stated as: %s?",
      explain:
        "%k is %v. This is a standard NCERT result used directly in JEE, NDA, CUET and board papers.",
    }),
    matchTemplate({ ...spec, label: matchLabel }),
    statementTemplate({ ...spec, label: matchLabel }),
    statementCountTemplate({ ...spec, label: matchLabel }),
  );
}

/* ============================================================ CLASS 11 ==== */

add(
  "ma:sets",
  "Sets",
  "Easy",
  M11,
  [
    { key: "Number of subsets of a set with n elements", value: "2^n" },
    { key: "Number of proper subsets of a set with n elements", value: "2^n - 1" },
    { key: "Number of elements in the power set of a set of size n", value: "2^n" },
    { key: "n(A union B)", value: "n(A) + n(B) - n(A intersection B)" },
    { key: "De Morgan first law", value: "(A union B)' = A' intersection B'" },
    { key: "De Morgan second law", value: "(A intersection B)' = A' union B'" },
    { key: "A intersection A complement", value: "The empty set" },
    { key: "A union A complement", value: "The universal set" },
    { key: "Number of elements in A cross B", value: "n(A) times n(B)" },
    { key: "Sets with no common element", value: "They are called disjoint sets" },
    { key: "A set with exactly one element", value: "A singleton set" },
    { key: "Cardinality of the empty set", value: "Zero" },
  ],
  "set result and its value",
);

add(
  "ma:trig",
  "Trigonometric Functions",
  "Moderate",
  M11,
  [
    { key: "sin^2 x + cos^2 x", value: "1" },
    { key: "1 + tan^2 x", value: "sec^2 x" },
    { key: "1 + cot^2 x", value: "cosec^2 x" },
    { key: "sin(A + B)", value: "sin A cos B + cos A sin B" },
    { key: "cos(A + B)", value: "cos A cos B - sin A sin B" },
    { key: "tan(A + B)", value: "(tan A + tan B) / (1 - tan A tan B)" },
    { key: "sin 2A", value: "2 sin A cos A" },
    { key: "cos 2A", value: "cos^2 A - sin^2 A, also 1 - 2 sin^2 A" },
    { key: "tan 2A", value: "2 tan A / (1 - tan^2 A)" },
    { key: "Period of sin x and cos x", value: "2 pi" },
    { key: "Period of tan x and cot x", value: "pi" },
    { key: "Range of sin x and cos x", value: "The closed interval from -1 to 1" },
  ],
  "trigonometric identity and its value",
);

add(
  "ma:complex",
  "Complex Numbers and Quadratic Equations",
  "Moderate",
  M11,
  [
    { key: "Value of i^2", value: "-1" },
    { key: "Value of i^4", value: "1" },
    { key: "Modulus of a + ib", value: "sqrt(a^2 + b^2)" },
    { key: "Conjugate of a + ib", value: "a - ib" },
    { key: "Product of a complex number and its conjugate", value: "The square of its modulus" },
    { key: "Discriminant of a quadratic equation", value: "D = b^2 - 4ac" },
    { key: "Condition for real and distinct roots", value: "D greater than 0" },
    { key: "Condition for equal roots", value: "D equal to 0" },
    { key: "Condition for complex roots", value: "D less than 0" },
    { key: "Sum of the roots of ax^2 + bx + c = 0", value: "-b / a" },
    { key: "Product of the roots of ax^2 + bx + c = 0", value: "c / a" },
    { key: "Sum of the cube roots of unity", value: "Zero" },
  ],
  "complex number result and its value",
);

add(
  "ma:pnc",
  "Permutations and Combinations",
  "Moderate",
  M11,
  [
    { key: "Number of permutations nPr", value: "n! / (n - r)!" },
    { key: "Number of combinations nCr", value: "n! / (r! (n - r)!)" },
    { key: "Relation between nPr and nCr", value: "nPr = nCr times r!" },
    { key: "Value of nC0 and nCn", value: "Both equal 1" },
    { key: "Value of nC1", value: "n" },
    { key: "Property nCr equals", value: "nC(n - r)" },
    { key: "Pascal's rule", value: "nCr + nC(r-1) = (n+1)Cr" },
    { key: "Sum of all binomial coefficients nCr", value: "2^n" },
    { key: "Circular permutations of n distinct objects", value: "(n - 1)!" },
    { key: "Permutations of n objects with p alike", value: "n! / p!" },
    { key: "Value of 0!", value: "1" },
    { key: "Number of diagonals of an n-sided polygon", value: "n(n - 3) / 2" },
  ],
  "counting formula and its value",
);

add(
  "ma:binomial",
  "Binomial Theorem",
  "Moderate",
  M11,
  [
    { key: "Number of terms in the expansion of (a + b)^n", value: "n + 1" },
    { key: "General term of (a + b)^n", value: "T(r+1) = nCr a^(n-r) b^r" },
    { key: "Middle term when n is even", value: "The (n/2 + 1)th term" },
    { key: "Number of middle terms when n is odd", value: "Two" },
    { key: "Sum of coefficients in (1 + x)^n", value: "2^n, obtained by putting x = 1" },
    { key: "Sum of even-position coefficients in (1 + x)^n", value: "2^(n-1)" },
    {
      key: "Coefficient of the greatest term",
      value: "Found where the ratio of successive terms crosses 1",
    },
    { key: "Expansion of (1 + x)^n for small x", value: "Approximately 1 + nx" },
    { key: "Term independent of x", value: "The term whose power of x is zero" },
    { key: "Number of terms in (a + b + c)^n", value: "(n + 1)(n + 2) / 2" },
    { key: "Binomial coefficients of (a + b)^n", value: "They are symmetric about the middle" },
    { key: "Last term of (a + b)^n", value: "b^n" },
  ],
  "binomial result and its value",
);

add(
  "ma:sequences",
  "Sequences and Series",
  "Easy",
  M11,
  [
    { key: "nth term of an AP", value: "a + (n - 1)d" },
    { key: "Sum of n terms of an AP", value: "(n/2)[2a + (n - 1)d]" },
    { key: "Arithmetic mean of a and b", value: "(a + b) / 2" },
    { key: "nth term of a GP", value: "a r^(n-1)" },
    { key: "Sum of n terms of a GP", value: "a(r^n - 1) / (r - 1) for r not equal to 1" },
    { key: "Sum of an infinite GP", value: "a / (1 - r), valid when the modulus of r is below 1" },
    { key: "Geometric mean of a and b", value: "sqrt(ab)" },
    { key: "Harmonic mean of a and b", value: "2ab / (a + b)" },
    { key: "Relation between AM, GM and HM", value: "GM^2 = AM times HM, and AM is at least GM" },
    { key: "Sum of the first n natural numbers", value: "n(n + 1) / 2" },
    { key: "Sum of the squares of the first n natural numbers", value: "n(n + 1)(2n + 1) / 6" },
    { key: "Sum of the cubes of the first n natural numbers", value: "[n(n + 1) / 2]^2" },
  ],
  "progression formula and its value",
);

add(
  "ma:straight-lines",
  "Straight Lines",
  "Easy",
  M11,
  [
    { key: "Slope of a line through two points", value: "(y2 - y1) / (x2 - x1)" },
    { key: "Slope-intercept form", value: "y = mx + c" },
    { key: "Point-slope form", value: "y - y1 = m(x - x1)" },
    { key: "Intercept form", value: "x/a + y/b = 1" },
    { key: "Normal form", value: "x cos(alpha) + y sin(alpha) = p" },
    { key: "Condition for two lines to be parallel", value: "Their slopes are equal" },
    {
      key: "Condition for two lines to be perpendicular",
      value: "The product of their slopes is -1",
    },
    {
      key: "Distance of a point from a line",
      value: "modulus of (Ax1 + By1 + C) / sqrt(A^2 + B^2)",
    },
    { key: "Distance between two parallel lines", value: "modulus of (C1 - C2) / sqrt(A^2 + B^2)" },
    { key: "Angle between two lines", value: "tan(theta) = modulus of (m1 - m2)/(1 + m1 m2)" },
    { key: "Slope of a line parallel to the x-axis", value: "Zero" },
    { key: "Slope of a line parallel to the y-axis", value: "Not defined for a vertical line" },
  ],
  "coordinate geometry formula and its value",
);

add(
  "ma:conic",
  "Conic Sections",
  "Difficult",
  M11,
  [
    { key: "Standard equation of a circle at the origin", value: "x^2 + y^2 = a^2" },
    { key: "Standard equation of a parabola opening right", value: "y^2 = 4ax" },
    { key: "Focus of y^2 = 4ax", value: "The point (a, 0)" },
    { key: "Directrix of y^2 = 4ax", value: "The line x = -a" },
    { key: "Length of the latus rectum of y^2 = 4ax", value: "4a" },
    { key: "Eccentricity of a parabola", value: "Exactly 1" },
    { key: "Standard equation of an ellipse", value: "x^2/a^2 + y^2/b^2 = 1" },
    { key: "Eccentricity of an ellipse", value: "Less than 1, with b^2 = a^2(1 - e^2)" },
    { key: "Length of the latus rectum of an ellipse", value: "2b^2 / a" },
    { key: "Standard equation of a hyperbola", value: "x^2/a^2 - y^2/b^2 = 1" },
    { key: "Eccentricity of a hyperbola", value: "Greater than 1, with b^2 = a^2(e^2 - 1)" },
    { key: "Eccentricity of a rectangular hyperbola", value: "sqrt(2)" },
  ],
  "conic section property and its value",
);

add(
  "ma:limits",
  "Limits and Derivatives",
  "Moderate",
  M11,
  [
    { key: "Limit of sin x over x as x tends to 0", value: "1" },
    { key: "Limit of (1 - cos x) over x^2 as x tends to 0", value: "1/2" },
    { key: "Limit of tan x over x as x tends to 0", value: "1" },
    { key: "Limit of (e^x - 1) over x as x tends to 0", value: "1" },
    { key: "Limit of (a^x - 1) over x as x tends to 0", value: "log a" },
    { key: "Limit of (x^n - a^n)/(x - a) as x tends to a", value: "n a^(n-1)" },
    { key: "Derivative of x^n", value: "n x^(n-1)" },
    { key: "Derivative of sin x", value: "cos x" },
    { key: "Derivative of cos x", value: "-sin x" },
    { key: "Derivative of tan x", value: "sec^2 x" },
    { key: "Derivative of log x", value: "1 / x" },
    { key: "Derivative of e^x", value: "e^x" },
  ],
  "limit or derivative and its value",
);

add(
  "ma:statistics",
  "Statistics",
  "Easy",
  M11,
  [
    { key: "Mean of ungrouped data", value: "The sum of observations divided by their number" },
    { key: "Median of an odd number of observations", value: "The middle value after sorting" },
    { key: "Mode", value: "The observation with the highest frequency" },
    { key: "Empirical relation between mean, median and mode", value: "Mode = 3 Median - 2 Mean" },
    { key: "Range of a data set", value: "Maximum value minus minimum value" },
    { key: "Variance", value: "The mean of the squared deviations from the mean" },
    { key: "Standard deviation", value: "The positive square root of the variance" },
    { key: "Coefficient of variation", value: "(Standard deviation / Mean) times 100" },
    {
      key: "Effect of adding a constant to every observation",
      value: "The mean shifts, the variance does not change",
    },
    {
      key: "Effect of multiplying every observation by k",
      value: "Variance becomes k^2 times larger",
    },
    { key: "Sum of deviations from the mean", value: "Always zero" },
    {
      key: "Most stable measure of central tendency",
      value: "The mean, as it uses every observation",
    },
  ],
  "statistical measure and its definition",
);

/* ============================================================ CLASS 12 ==== */

add(
  "ma:relations",
  "Relations and Functions",
  "Moderate",
  M12,
  [
    { key: "Reflexive relation", value: "Every element is related to itself" },
    { key: "Symmetric relation", value: "If a is related to b then b is related to a" },
    { key: "Transitive relation", value: "If a R b and b R c then a R c" },
    { key: "Equivalence relation", value: "Reflexive, symmetric and transitive together" },
    {
      key: "One-one function",
      value: "Distinct inputs give distinct outputs, also called injective",
    },
    {
      key: "Onto function",
      value: "Every element of the codomain is an image, also called surjective",
    },
    { key: "Bijective function", value: "Both one-one and onto" },
    { key: "Condition for a function to be invertible", value: "It must be bijective" },
    { key: "Number of relations from a set of m to a set of n elements", value: "2^(mn)" },
    { key: "Number of functions from a set of m to a set of n elements", value: "n^m" },
    { key: "Composition of functions", value: "(g o f)(x) = g(f(x))" },
    { key: "Identity function", value: "f(x) = x, which maps every element to itself" },
  ],
  "relation or function type and its definition",
);

add(
  "ma:inverse-trig",
  "Inverse Trigonometric Functions",
  "Moderate",
  M12,
  [
    { key: "Principal value branch of arcsin x", value: "From -pi/2 to pi/2" },
    { key: "Principal value branch of arccos x", value: "From 0 to pi" },
    { key: "Principal value branch of arctan x", value: "The open interval from -pi/2 to pi/2" },
    { key: "Value of arcsin x + arccos x", value: "pi/2" },
    { key: "Value of arctan x + arccot x", value: "pi/2" },
    { key: "Value of arcsec x + arccosec x", value: "pi/2" },
    { key: "Domain of arcsin x and arccos x", value: "The closed interval from -1 to 1" },
    { key: "Domain of arctan x", value: "All real numbers" },
    { key: "Value of arctan 1", value: "pi/4" },
    { key: "Value of arcsin(1/2)", value: "pi/6" },
    { key: "Value of arccos(1/2)", value: "pi/3" },
    { key: "Derivative of arcsin x", value: "1 / sqrt(1 - x^2)" },
  ],
  "inverse trigonometric result and its value",
);

add(
  "ma:matrices",
  "Matrices and Determinants",
  "Moderate",
  M12,
  [
    { key: "Condition for matrix multiplication AB", value: "Columns of A must equal rows of B" },
    { key: "Symmetric matrix", value: "A' = A" },
    { key: "Skew symmetric matrix", value: "A' = -A, so all diagonal entries are zero" },
    { key: "Determinant of a skew symmetric matrix of odd order", value: "Zero" },
    { key: "Singular matrix", value: "A square matrix whose determinant is zero" },
    {
      key: "Condition for the inverse of A to exist",
      value: "The determinant of A must be non-zero",
    },
    { key: "Formula for the inverse of A", value: "A inverse = adj(A) / det(A)" },
    { key: "Determinant of a product", value: "det(AB) = det(A) times det(B)" },
    { key: "Effect of swapping two rows on a determinant", value: "Its sign changes" },
    { key: "Determinant when two rows are identical", value: "Zero" },
    { key: "Value of det(kA) for an n by n matrix", value: "k^n times det(A)" },
    {
      key: "Area of a triangle by determinants",
      value: "Half the modulus of the determinant of the coordinate matrix",
    },
  ],
  "matrix or determinant result and its value",
);

add(
  "ma:continuity",
  "Continuity and Differentiability",
  "Moderate",
  M12,
  [
    {
      key: "Condition for continuity at a point",
      value: "Left limit, right limit and the function value are all equal",
    },
    {
      key: "Relation between differentiability and continuity",
      value: "Differentiable implies continuous, not the reverse",
    },
    {
      key: "Example of a continuous but non-differentiable function",
      value: "The modulus function at x = 0",
    },
    { key: "Product rule", value: "(uv)\u2032 = u\u2032v + uv\u2032" },
    { key: "Quotient rule", value: "(u/v)' = (u'v - uv') / v^2" },
    { key: "Chain rule", value: "dy/dx = (dy/du)(du/dx)" },
    {
      key: "Rolle's theorem condition",
      value: "Continuous on the closed interval, differentiable inside, equal endpoint values",
    },
    {
      key: "Mean value theorem conclusion",
      value: "There is a c with f'(c) = (f(b) - f(a))/(b - a)",
    },
    { key: "Derivative of arctan x", value: "1 / (1 + x^2)" },
    { key: "Derivative of a constant", value: "Zero" },
    {
      key: "Logarithmic differentiation is used for",
      value: "Functions of the form f(x) raised to g(x)",
    },
    { key: "Second derivative test for a maximum", value: "f'(x) = 0 and f''(x) is negative" },
  ],
  "calculus rule and its statement",
);

add(
  "ma:integrals",
  "Integrals",
  "Difficult",
  M12,
  [
    { key: "Integral of x^n", value: "x^(n+1) / (n + 1) + C, for n not equal to -1" },
    { key: "Integral of 1/x", value: "log of the modulus of x, plus C" },
    { key: "Integral of e^x", value: "e^x + C" },
    { key: "Integral of sin x", value: "-cos x + C" },
    { key: "Integral of cos x", value: "sin x + C" },
    { key: "Integral of sec^2 x", value: "tan x + C" },
    { key: "Integral of 1 / (1 + x^2)", value: "arctan x + C" },
    { key: "Integral of 1 / sqrt(1 - x^2)", value: "arcsin x + C" },
    {
      key: "Integration by parts formula",
      value: "Integral of u dv = uv minus the integral of v du",
    },
    { key: "Order of choosing u in integration by parts", value: "The ILATE rule" },
    { key: "Fundamental theorem of calculus", value: "The definite integral equals F(b) - F(a)" },
    { key: "Definite integral of an odd function over a symmetric interval", value: "Zero" },
  ],
  "integral and its value",
);

add(
  "ma:differential-equations",
  "Differential Equations",
  "Moderate",
  M12,
  [
    {
      key: "Order of a differential equation",
      value: "The order of the highest derivative present",
    },
    {
      key: "Degree of a differential equation",
      value: "The power of the highest order derivative, when polynomial",
    },
    {
      key: "Variable separable form",
      value: "dy/dx = f(x) g(y), solved by separating the variables",
    },
    { key: "Homogeneous differential equation", value: "dy/dx = F(y/x), solved by putting y = vx" },
    { key: "Standard linear form", value: "dy/dx + Py = Q, with P and Q functions of x" },
    { key: "Integrating factor of a linear equation", value: "e raised to the integral of P dx" },
    {
      key: "General solution of a linear equation",
      value: "y times IF equals the integral of Q times IF dx",
    },
    {
      key: "Number of arbitrary constants in a general solution",
      value: "Equal to the order of the equation",
    },
    { key: "Particular solution", value: "A solution with the arbitrary constants determined" },
    { key: "Solution of dy/dx = k y", value: "y = C e^(kx)" },
    {
      key: "Degree of an equation with a derivative inside a radical",
      value: "Not defined until it is made polynomial",
    },
    { key: "Order of the equation for exponential growth", value: "One" },
  ],
  "differential equation type and its method",
);

add(
  "ma:vectors",
  "Vector Algebra",
  "Moderate",
  M12,
  [
    {
      key: "Scalar product of two vectors",
      value: "a . b = modulus a times modulus b times cos(theta)",
    },
    {
      key: "Vector product of two vectors",
      value: "a x b has magnitude modulus a modulus b sin(theta)",
    },
    { key: "Condition for two vectors to be perpendicular", value: "Their scalar product is zero" },
    {
      key: "Condition for two vectors to be parallel",
      value: "Their vector product is the zero vector",
    },
    { key: "Direction of a cross b", value: "Perpendicular to both, by the right hand rule" },
    { key: "Magnitude of a unit vector", value: "Exactly 1" },
    { key: "Projection of a on b", value: "(a . b) divided by the modulus of b" },
    {
      key: "Area of a parallelogram with adjacent sides a and b",
      value: "The modulus of a cross b",
    },
    { key: "Area of a triangle with sides a and b", value: "Half the modulus of a cross b" },
    {
      key: "Scalar triple product [a b c]",
      value: "a . (b x c), the volume of the parallelepiped",
    },
    {
      key: "Condition for three vectors to be coplanar",
      value: "Their scalar triple product is zero",
    },
    { key: "Value of i cross j", value: "k" },
  ],
  "vector result and its value",
);

add(
  "ma:3d",
  "Three Dimensional Geometry",
  "Difficult",
  M12,
  [
    { key: "Direction cosines relation", value: "l^2 + m^2 + n^2 = 1" },
    { key: "Vector equation of a line", value: "r = a + lambda b" },
    { key: "Cartesian equation of a line", value: "(x - x1)/a = (y - y1)/b = (z - z1)/c" },
    {
      key: "Angle between two lines",
      value: "cos(theta) from the scalar product of their direction vectors",
    },
    { key: "Condition for two lines to be perpendicular", value: "a1 a2 + b1 b2 + c1 c2 = 0" },
    { key: "Vector equation of a plane in normal form", value: "r . n = d" },
    { key: "Cartesian equation of a plane", value: "Ax + By + Cz + D = 0" },
    {
      key: "Normal vector to Ax + By + Cz + D = 0",
      value: "The vector with components A, B and C",
    },
    {
      key: "Distance of a point from a plane",
      value: "modulus of (Ax1 + By1 + Cz1 + D) / sqrt(A^2 + B^2 + C^2)",
    },
    {
      key: "Condition for a line to lie in a plane",
      value: "The line direction is perpendicular to the plane normal and a point lies on it",
    },
    { key: "Intercept form of a plane", value: "x/a + y/b + z/c = 1" },
    { key: "Angle between two planes", value: "The angle between their normal vectors" },
  ],
  "three dimensional geometry result and its value",
);

add(
  "ma:lpp",
  "Linear Programming",
  "Easy",
  M12,
  [
    { key: "Objective function", value: "The linear expression to be maximised or minimised" },
    { key: "Constraints", value: "The linear inequalities restricting the variables" },
    { key: "Feasible region", value: "The common region satisfying every constraint" },
    { key: "Feasible solution", value: "Any point lying inside the feasible region" },
    { key: "Optimal solution", value: "The feasible point giving the best objective value" },
    { key: "Location of the optimal value", value: "At a corner point of the feasible region" },
    { key: "Corner point theorem", value: "The optimum, if it exists, occurs at a vertex" },
    { key: "Non-negative restrictions", value: "x is at least 0 and y is at least 0" },
    {
      key: "Bounded feasible region",
      value: "It can be enclosed in a circle, so both optima exist",
    },
    { key: "Unbounded feasible region", value: "The maximum or minimum may not exist" },
    { key: "Shape of a feasible region", value: "Always a convex polygon" },
    { key: "Number of optimal solutions when two vertices tie", value: "Infinitely many" },
  ],
  "linear programming term and its meaning",
);

add(
  "ma:probability",
  "Probability",
  "Moderate",
  M12,
  [
    { key: "Range of a probability value", value: "From 0 to 1 inclusive" },
    { key: "Probability of the sample space", value: "Exactly 1" },
    { key: "Addition theorem", value: "P(A union B) = P(A) + P(B) - P(A intersection B)" },
    { key: "Addition rule for mutually exclusive events", value: "P(A union B) = P(A) + P(B)" },
    { key: "Multiplication rule for independent events", value: "P(A intersection B) = P(A) P(B)" },
    { key: "Conditional probability", value: "P(A given B) = P(A intersection B) / P(B)" },
    {
      key: "Bayes' theorem",
      value: "It reverses conditional probabilities using prior probabilities",
    },
    { key: "Probability of the complement of A", value: "1 - P(A)" },
    { key: "Mean of a binomial distribution", value: "np" },
    { key: "Variance of a binomial distribution", value: "npq" },
    { key: "Probability of exactly r successes in n Bernoulli trials", value: "nCr p^r q^(n-r)" },
    {
      key: "Relation between mean and variance in a binomial distribution",
      value: "Variance is never greater than the mean",
    },
  ],
  "probability rule and its expression",
);

export const MATHS_TEMPLATES = templates;
