/**
 * Punjab Master Cadre Mathematics — the graduation level chapters the ERB
 * syllabus lists that no school level module covers.
 *
 * The official subject list runs: matrices and determinants, set theory,
 * sequences and series, binomial theorem, continuity and differentiability,
 * applications of derivatives, limits, integrals, differential equations,
 * vector spaces, linear inequalities, straight lines, conic sections, three
 * dimensional geometry, complex numbers, trigonometric functions,
 * permutations and combinations, numerical analysis, number theory,
 * mathematical reasoning, statistics, probability, linear programming,
 * equilibrium and dynamics.
 *
 * The bank already held the Class 11 and 12 half of that list under
 * Mathematics. What was missing is the degree level tail — vector spaces,
 * numerical analysis, number theory, linear programming, mathematical
 * reasoning, and the statics and dynamics pair. This module adds those and
 * tags the whole set for the Master and Lecturer cadres.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const MASTER = ["Punjab Master Cadre", "Punjab Lecturer Cadre", "State Teacher/TET", "PPSC Punjab"];

const templates: Template[] = [];
const mc = chapterFactory(templates, "Mathematics", MASTER);

mc(
  "mc:math:vector-spaces",
  "Vector Spaces and Linear Algebra",
  "In linear algebra, what is %s?",
  "%k is %v.",
  [
    {
      key: "Vector space",
      value:
        "A set closed under addition and scalar multiplication satisfying the eight vector space axioms",
    },
    {
      key: "Subspace",
      value:
        "A non empty subset of a vector space that is itself a vector space under the same operations",
    },
    { key: "Linear combination", value: "A sum of scalar multiples of a finite set of vectors" },
    {
      key: "Linear dependence",
      value:
        "A set of vectors in which one vector can be written as a linear combination of the others",
    },
    { key: "Basis", value: "A linearly independent set that spans the whole vector space" },
    { key: "Dimension", value: "The number of vectors in any basis of the space" },
    {
      key: "Rank of a matrix",
      value:
        "The number of linearly independent rows, equal to the number of linearly independent columns",
    },
    {
      key: "Nullity",
      value:
        "The dimension of the null space, that is the solution space of the homogeneous system",
    },
    {
      key: "Eigenvalue",
      value: "A scalar lambda for which there is a non zero vector x with Ax equal to lambda x",
    },
    {
      key: "Eigenvector",
      value: "A non zero vector whose direction is unchanged by the linear transformation",
    },
  ],
  [
    {
      key: "Rank nullity theorem",
      value:
        "For a linear map on a finite dimensional space, rank plus nullity equals the dimension of the domain",
    },
    {
      key: "Cayley Hamilton theorem",
      value: "Every square matrix satisfies its own characteristic equation",
    },
    {
      key: "Condition for a matrix to be diagonalisable",
      value: "It must have a full set of linearly independent eigenvectors",
    },
    {
      key: "Trace and eigenvalues",
      value: "The trace of a matrix equals the sum of its eigenvalues",
    },
    {
      key: "Determinant and eigenvalues",
      value: "The determinant equals the product of the eigenvalues",
    },
  ],
);

mc(
  "mc:math:numerical-analysis",
  "Numerical Analysis",
  "In numerical analysis, what is %s?",
  "%k is %v.",
  [
    {
      key: "Bisection method",
      value:
        "A root finding method that repeatedly halves an interval in which the function changes sign",
    },
    {
      key: "Newton Raphson method",
      value:
        "An iterative root finding method using the tangent, with the formula x minus f(x) over f dash (x)",
    },
    {
      key: "Regula falsi method",
      value:
        "The method of false position, which uses the chord joining two points of opposite sign",
    },
    {
      key: "Order of convergence of Newton Raphson",
      value: "Quadratic, provided the initial guess is close enough and the derivative is non zero",
    },
    {
      key: "Trapezoidal rule",
      value: "Numerical integration approximating the area under a curve by trapezia",
    },
    {
      key: "Simpson's one third rule",
      value: "Numerical integration fitting a parabola through every three consecutive points",
    },
    {
      key: "Requirement of Simpson's one third rule",
      value: "The number of subintervals must be even",
    },
    { key: "Forward difference operator", value: "Delta f of x equals f of x plus h minus f of x" },
    {
      key: "Newton's forward interpolation formula",
      value: "An interpolation formula used near the beginning of a table of equally spaced values",
    },
    {
      key: "Lagrange interpolation",
      value: "An interpolation method that works for unequally spaced data points",
    },
  ],
  [
    {
      key: "Reason the bisection method always converges",
      value:
        "The interval containing a sign change halves each step, so the bracket shrinks to the root",
    },
    {
      key: "Drawback of the Newton Raphson method",
      value: "It fails or diverges if the derivative is near zero or the initial guess is poor",
    },
    {
      key: "Truncation error",
      value: "The error from replacing an exact mathematical process by an approximate one",
    },
    {
      key: "Round off error",
      value: "The error from representing numbers with a finite number of digits",
    },
    {
      key: "Runge Kutta fourth order method",
      value:
        "A single step method of solving an ordinary differential equation with error of order h to the fifth",
    },
  ],
);

mc(
  "mc:math:number-theory",
  "Number Theory",
  "In number theory, what is %s?",
  "%k is %v.",
  [
    {
      key: "Division algorithm",
      value:
        "For integers a and b with b positive there exist unique q and r with a equal to bq plus r and r less than b",
    },
    {
      key: "Euclidean algorithm",
      value: "A repeated division method for finding the greatest common divisor of two integers",
    },
    {
      key: "Prime number",
      value: "An integer greater than one whose only positive divisors are one and itself",
    },
    {
      key: "Fundamental theorem of arithmetic",
      value: "Every integer greater than one factors into primes uniquely apart from order",
    },
    { key: "Congruence modulo n", value: "a is congruent to b modulo n when n divides a minus b" },
    {
      key: "Euler's totient function",
      value: "The count of integers up to n that are coprime to n",
    },
    {
      key: "Fermat's little theorem",
      value:
        "If p is prime and p does not divide a then a to the power p minus one is congruent to one modulo p",
    },
    {
      key: "Wilson's theorem",
      value: "p is prime if and only if p minus one factorial is congruent to minus one modulo p",
    },
    {
      key: "Perfect number",
      value: "A number equal to the sum of its proper divisors, such as six and twenty eight",
    },
    { key: "Coprime numbers", value: "Two integers whose greatest common divisor is one" },
  ],
  [
    {
      key: "Euler's theorem",
      value: "If a and n are coprime then a to the power phi of n is congruent to one modulo n",
    },
    {
      key: "Chinese remainder theorem",
      value:
        "A system of congruences with pairwise coprime moduli has a unique solution modulo the product",
    },
    {
      key: "Number of divisors formula",
      value:
        "For n with prime factorisation p to the a times q to the b, the count is a plus one times b plus one",
    },
    {
      key: "Infinitude of primes",
      value:
        "Euclid proved there are infinitely many primes by contradiction using the product of all primes plus one",
    },
    {
      key: "Linear Diophantine equation solvability",
      value: "ax plus by equals c has integer solutions exactly when the gcd of a and b divides c",
    },
  ],
);

mc(
  "mc:math:lpp-reasoning",
  "Linear Programming and Mathematical Reasoning",
  "In linear programming and logic, what is %s?",
  "%k is %v.",
  [
    {
      key: "Linear programming problem",
      value: "Optimising a linear objective function subject to linear constraints",
    },
    {
      key: "Objective function",
      value: "The linear function of the decision variables that is to be maximised or minimised",
    },
    {
      key: "Feasible region",
      value:
        "The set of all points satisfying every constraint including the non negativity conditions",
    },
    {
      key: "Corner point theorem",
      value: "If an optimal solution exists it occurs at a corner point of the feasible region",
    },
    {
      key: "Unbounded feasible region",
      value: "A feasible region that extends indefinitely, where an optimum may not exist",
    },
    { key: "Statement in logic", value: "A sentence that is either true or false but not both" },
    {
      key: "Negation",
      value: "The statement that is true exactly when the original statement is false",
    },
    {
      key: "Conjunction",
      value: "The compound statement p and q, true only when both parts are true",
    },
    {
      key: "Disjunction",
      value: "The compound statement p or q, false only when both parts are false",
    },
    {
      key: "Contrapositive of if p then q",
      value: "If not q then not p, which is logically equivalent to the original",
    },
  ],
  [
    {
      key: "Converse of if p then q",
      value: "If q then p, which is not logically equivalent to the original statement",
    },
    {
      key: "Tautology",
      value: "A compound statement that is true for every truth value of its components",
    },
    {
      key: "Contradiction in logic",
      value: "A compound statement that is false for every truth value of its components",
    },
    {
      key: "Slack variable",
      value:
        "A non negative variable added to a less than or equal constraint to make it an equation",
    },
    {
      key: "Proof by contradiction",
      value: "Assuming the negation of the claim and deriving an impossibility",
    },
  ],
);

mc(
  "mc:math:statics-dynamics",
  "Equilibrium and Dynamics",
  "In mechanics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Equilibrium of a particle",
      value: "The state in which the vector sum of all forces acting on it is zero",
    },
    {
      key: "Condition for equilibrium of a rigid body",
      value: "The resultant force and the resultant moment about any point must both be zero",
    },
    {
      key: "Moment of a force",
      value:
        "The product of the force and the perpendicular distance from the point to the line of action",
    },
    {
      key: "Couple",
      value: "Two equal and opposite parallel forces whose lines of action are different",
    },
    {
      key: "Triangle law of forces",
      value:
        "If three forces in equilibrium are represented in order by the sides of a triangle, they balance",
    },
    {
      key: "Lami's theorem",
      value:
        "Each of three concurrent forces in equilibrium is proportional to the sine of the angle between the other two",
    },
    {
      key: "Limiting friction",
      value: "The maximum frictional force that acts just before sliding begins",
    },
    {
      key: "Angle of friction",
      value: "The angle whose tangent equals the coefficient of limiting friction",
    },
    {
      key: "Projectile",
      value: "A body thrown into space that moves under gravity alone after release",
    },
    {
      key: "Range of a projectile",
      value: "u squared sine two theta divided by g on a horizontal plane",
    },
  ],
  [
    {
      key: "Maximum range condition for a projectile",
      value: "The angle of projection must be forty five degrees",
    },
    {
      key: "Simple harmonic motion",
      value:
        "Motion in which acceleration is proportional to displacement and directed towards the mean position",
    },
    {
      key: "Time period of simple harmonic motion",
      value: "Two pi times the square root of displacement over acceleration",
    },
    {
      key: "Work energy theorem",
      value: "The work done by the resultant force equals the change in kinetic energy",
    },
    {
      key: "Coefficient of restitution",
      value:
        "The ratio of the relative velocity of separation to the relative velocity of approach",
    },
  ],
);

export const MASTER_CADRE_MATHS_TEMPLATES = templates;
