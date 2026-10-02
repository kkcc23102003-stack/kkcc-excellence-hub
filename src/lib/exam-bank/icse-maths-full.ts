/**
 * The ICSE Mathematics chapters still missing from Class 9 and Class 10.
 *
 * Measured against the Selina and CISCE chapter lists, Class 9 was short of a
 * whole strand: the board sets trigonometrical ratios, standard angles,
 * solution of right triangles and complementary angles in Class 9, none of
 * which the NCERT Class 9 scheme carries. Mid-point and intercept theorem,
 * Pythagoras theorem, area theorems, rectilinear figures, mean and median,
 * distance formula and the graphical solution of simultaneous equations were
 * also absent.
 *
 * Class 10 was short of ratio and proportion, the section and mid-point
 * formula, the equation of a straight line, constructions, and the graphical
 * treatment of statistics with histogram, ogive and the measures of central
 * tendency.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const ICSE9 = ["ICSE Class 9", "ICSE Class 9-10"];
const ICSE10 = ["ICSE Class 10", "ICSE Class 9-10"];

const templates: Template[] = [];
const m9 = chapterFactory(templates, "Math Class 9", ICSE9);
const m10 = chapterFactory(templates, "Math Class 10", ICSE10);

/* ==================================================== ICSE Maths Class 9 */

m9(
  "im9:midpoint-theorem",
  "Mid-point and Intercept Theorem (ICSE)",
  "In the mid-point and intercept theorems, what is %s?",
  "%k is %v.",
  [
    {
      key: "Mid-point theorem",
      value:
        "The line joining the mid-points of two sides of a triangle is parallel to the third side and half of it",
    },
    {
      key: "Converse of the mid-point theorem",
      value:
        "A line through the mid-point of one side and parallel to another bisects the third side",
    },
    {
      key: "Intercept theorem",
      value:
        "If three or more parallel lines make equal intercepts on one transversal they make equal intercepts on every transversal",
    },
    { key: "Length of the mid-segment when the third side is 14 cm", value: "7 cm" },
    { key: "Mid-point of the segment joining (2, 4) and (6, 8)", value: "(4, 6)" },
    {
      key: "Figure formed by joining the mid-points of the sides of any quadrilateral",
      value: "A parallelogram",
    },
    { key: "Figure formed by joining the mid-points of a rectangle", value: "A rhombus" },
    { key: "Figure formed by joining the mid-points of a rhombus", value: "A rectangle" },
    {
      key: "Perimeter of the medial triangle",
      value: "Half the perimeter of the original triangle",
    },
    {
      key: "Area of the medial triangle",
      value: "One fourth of the area of the original triangle",
    },
  ],
  [
    {
      key: "Proof idea of the mid-point theorem",
      value: "Produce the mid-segment to its own length and use SAS to get a parallelogram",
    },
    {
      key: "Figure formed by joining the mid-points of a square",
      value: "A square of half the area",
    },
    {
      key: "Number of triangles congruent to the medial triangle inside a triangle",
      value: "Four, all congruent and similar to the original",
    },
    {
      key: "Use of the intercept theorem in construction",
      value: "To divide a given line segment into any number of equal parts",
    },
    {
      key: "Mid-segment of a trapezium",
      value: "Parallel to both parallel sides and equal to half their sum",
    },
  ],
);

m9(
  "im9:pythagoras",
  "Pythagoras Theorem (ICSE)",
  "In the Pythagoras theorem, what is %s?",
  "%k is %v.",
  [
    {
      key: "Pythagoras theorem",
      value:
        "In a right triangle the square on the hypotenuse equals the sum of the squares on the other two sides",
    },
    {
      key: "Converse of the Pythagoras theorem",
      value:
        "If the square on one side equals the sum of the squares on the other two, the triangle is right angled",
    },
    { key: "Hypotenuse when the legs are 3 cm and 4 cm", value: "5 cm" },
    { key: "Hypotenuse when the legs are 6 cm and 8 cm", value: "10 cm" },
    { key: "Hypotenuse when the legs are 5 cm and 12 cm", value: "13 cm" },
    { key: "Missing leg when the hypotenuse is 17 cm and one leg is 8 cm", value: "15 cm" },
    { key: "Diagonal of a square of side a", value: "a times root two" },
    { key: "Altitude of an equilateral triangle of side a", value: "Root three by two times a" },
    {
      key: "Pythagorean triplet",
      value:
        "Three whole numbers that satisfy the relation a squared plus b squared equals c squared",
    },
    {
      key: "Nature of a triangle with sides 7, 24 and 25",
      value: "Right angled, because 49 plus 576 equals 625",
    },
  ],
  [
    {
      key: "Diagonal of a cuboid with edges a, b and c",
      value: "The square root of a squared plus b squared plus c squared",
    },
    {
      key: "Relation in a right triangle with altitude to the hypotenuse",
      value: "The altitude is the geometric mean of the two segments of the hypotenuse",
    },
    {
      key: "Test for an obtuse triangle",
      value: "The square on the longest side exceeds the sum of the squares on the other two",
    },
    {
      key: "Test for an acute triangle",
      value: "The square on the longest side is less than the sum of the squares on the other two",
    },
    {
      key: "Apollonius theorem",
      value:
        "The sum of the squares on two sides equals twice the square on the median to the third side plus twice the square on half that side",
    },
  ],
);

m9(
  "im9:area-theorems",
  "Area Theorems — Parallelograms and Triangles (ICSE)",
  "In the area theorems, what is %s?",
  "%k is %v.",
  [
    { key: "Area of a parallelogram", value: "Base times the corresponding height" },
    {
      key: "Parallelograms on the same base and between the same parallels",
      value: "Equal in area",
    },
    { key: "Triangles on the same base and between the same parallels", value: "Equal in area" },
    {
      key: "Area of a triangle compared with a parallelogram on the same base and between the same parallels",
      value: "Half the area of the parallelogram",
    },
    {
      key: "Effect of a median on the area of a triangle",
      value: "It divides the triangle into two triangles of equal area",
    },
    {
      key: "Area of a trapezium",
      value: "Half the sum of the parallel sides times the distance between them",
    },
    { key: "Area of a rhombus from its diagonals", value: "Half the product of the diagonals" },
    {
      key: "Effect of the diagonals of a parallelogram on its area",
      value: "They divide it into four triangles of equal area",
    },
    { key: "Area of a triangle with base 12 cm and height 5 cm", value: "30 square centimetres" },
    {
      key: "Area of a parallelogram with base 9 cm and height 4 cm",
      value: "36 square centimetres",
    },
  ],
  [
    {
      key: "Triangles with equal areas on the same base",
      value: "Their vertices lie on a line parallel to that base",
    },
    {
      key: "Area of the triangle formed by joining the mid-points of the sides",
      value: "One fourth of the area of the given triangle",
    },
    {
      key: "Ratio of areas of two triangles with the same height",
      value: "The ratio of their bases",
    },
    {
      key: "Area of a quadrilateral from a diagonal",
      value: "Half the diagonal times the sum of the perpendiculars from the opposite vertices",
    },
    {
      key: "Line joining a vertex to the mid-point of the opposite side of a parallelogram",
      value: "It cuts off a triangle of area one fourth of the parallelogram",
    },
  ],
);

m9(
  "im9:rectilinear-figures",
  "Rectilinear Figures and Construction of Polygons (ICSE)",
  "In rectilinear figures, what is %s?",
  "%k is %v.",
  [
    {
      key: "Rectilinear figure",
      value: "A closed plane figure bounded only by straight line segments",
    },
    {
      key: "Sum of the interior angles of an n sided polygon",
      value: "(n minus 2) times 180 degrees",
    },
    { key: "Sum of the exterior angles of any convex polygon", value: "360 degrees" },
    { key: "Each interior angle of a regular hexagon", value: "120 degrees" },
    { key: "Each exterior angle of a regular pentagon", value: "72 degrees" },
    {
      key: "Number of diagonals of an n sided polygon",
      value: "n times (n minus 3) divided by two",
    },
    { key: "Number of diagonals of a hexagon", value: "Nine" },
    { key: "Regular polygon", value: "A polygon with all sides equal and all angles equal" },
    {
      key: "Convex polygon",
      value: "A polygon in which every interior angle is less than 180 degrees",
    },
    { key: "Sum of the interior angles of a quadrilateral", value: "360 degrees" },
  ],
  [
    { key: "Number of sides when each exterior angle is 24 degrees", value: "Fifteen" },
    { key: "Number of sides when each interior angle is 140 degrees", value: "Nine" },
    {
      key: "Instruments allowed in an ICSE construction",
      value: "Only a ruler and a pair of compasses, with the construction arcs left showing",
    },
    {
      key: "Construction of a regular hexagon in a circle",
      value: "Step off the radius six times round the circumference",
    },
    {
      key: "Interior angle of a regular polygon in terms of n",
      value: "180 degrees minus 360 by n",
    },
  ],
);

m9(
  "im9:trig-ratios",
  "Trigonometrical Ratios (ICSE)",
  "In trigonometrical ratios, what is %s?",
  "%k is %v.",
  [
    { key: "Sine of an angle", value: "The side opposite the angle divided by the hypotenuse" },
    {
      key: "Cosine of an angle",
      value: "The side adjacent to the angle divided by the hypotenuse",
    },
    { key: "Tangent of an angle", value: "The side opposite divided by the side adjacent" },
    { key: "Cosecant of an angle", value: "The reciprocal of the sine" },
    { key: "Secant of an angle", value: "The reciprocal of the cosine" },
    { key: "Cotangent of an angle", value: "The reciprocal of the tangent" },
    {
      key: "Relation between tangent, sine and cosine",
      value: "Tangent equals sine divided by cosine",
    },
    { key: "Fundamental identity", value: "Sine squared plus cosine squared equals one" },
    { key: "Identity involving secant", value: "One plus tangent squared equals secant squared" },
    {
      key: "Identity involving cosecant",
      value: "One plus cotangent squared equals cosecant squared",
    },
  ],
  [
    { key: "Greatest possible value of the sine of an angle", value: "One" },
    { key: "Range of the secant of an acute angle", value: "Greater than or equal to one" },
    { key: "Sine of an angle when the cosine is three fifths", value: "Four fifths" },
    { key: "Value of tangent times cotangent", value: "One" },
    {
      key: "Reason a trigonometric ratio has no unit",
      value: "It is a ratio of two lengths, so the units cancel",
    },
  ],
);

m9(
  "im9:standard-angles",
  "Trigonometrical Ratios of Standard Angles (ICSE)",
  "Among the standard angles, what is %s?",
  "%k is %v.",
  [
    { key: "Sine of 0 degrees", value: "Zero" },
    { key: "Sine of 30 degrees", value: "One half" },
    { key: "Sine of 45 degrees", value: "One by root two" },
    { key: "Sine of 60 degrees", value: "Root three by two" },
    { key: "Sine of 90 degrees", value: "One" },
    { key: "Cosine of 60 degrees", value: "One half" },
    { key: "Tangent of 45 degrees", value: "One" },
    { key: "Tangent of 30 degrees", value: "One by root three" },
    { key: "Tangent of 60 degrees", value: "Root three" },
    { key: "Tangent of 90 degrees", value: "Not defined" },
  ],
  [
    { key: "Value of sine 30 degrees plus cosine 60 degrees", value: "One" },
    { key: "Value of two times sine 45 degrees times cosine 45 degrees", value: "One" },
    {
      key: "Value of tangent 60 degrees minus tangent 30 degrees over one plus their product",
      value: "One by root three, the tangent of 30 degrees",
    },
    { key: "Value of sine squared 30 plus cosine squared 30", value: "One" },
    { key: "Value of cosecant 30 degrees", value: "Two" },
    { key: "Value of cosine 30 degrees", value: "Root three by two" },
  ],
);

m9(
  "im9:right-triangles-complementary",
  "Solution of Right Triangles and Complementary Angles (ICSE)",
  "In right triangles and complementary angles, what is %s?",
  "%k is %v.",
  [
    {
      key: "Solution of a right triangle",
      value: "Finding all the unknown sides and angles from the given parts",
    },
    {
      key: "Data needed to solve a right triangle",
      value: "Either two sides, or one side and one acute angle",
    },
    { key: "Complementary angles", value: "Two angles whose sum is 90 degrees" },
    { key: "Sine of (90 degrees minus A)", value: "Cosine of A" },
    { key: "Cosine of (90 degrees minus A)", value: "Sine of A" },
    { key: "Tangent of (90 degrees minus A)", value: "Cotangent of A" },
    { key: "Secant of (90 degrees minus A)", value: "Cosecant of A" },
    {
      key: "Angle of elevation",
      value:
        "The angle the line of sight makes with the horizontal when the object is above the observer",
    },
    {
      key: "Angle of depression",
      value:
        "The angle the line of sight makes with the horizontal when the object is below the observer",
    },
    {
      key: "Sum of the two acute angles of a right triangle",
      value: "90 degrees, so they are complementary",
    },
  ],
  [
    {
      key: "Value of sine 35 degrees minus cosine 55 degrees",
      value: "Zero, since 35 and 55 are complementary",
    },
    { key: "Value of tangent 20 degrees times tangent 70 degrees", value: "One" },
    { key: "Value of A when sine A equals cosine A for an acute angle", value: "45 degrees" },
    {
      key: "Height of a tower whose shadow equals its height",
      value: "The angle of elevation of the sun is 45 degrees",
    },
    {
      key: "Relation between angle of elevation and angle of depression for two observers",
      value: "They are equal, being alternate angles between parallel horizontals",
    },
  ],
);

m9(
  "im9:mean-median",
  "Mean and Median (ICSE)",
  "In mean and median, what is %s?",
  "%k is %v.",
  [
    { key: "Arithmetic mean", value: "The sum of all observations divided by their number" },
    {
      key: "Mean of a frequency distribution",
      value: "The sum of f times x divided by the sum of f",
    },
    { key: "Median", value: "The middle value when the data are arranged in order" },
    { key: "Median of an odd number of observations", value: "The value of the middle term" },
    { key: "Median of an even number of observations", value: "The mean of the two middle terms" },
    { key: "Mode", value: "The observation that occurs most often" },
    { key: "Mean of the first five natural numbers", value: "Three" },
    { key: "Median of 3, 5, 7, 9 and 11", value: "Seven" },
    {
      key: "Effect on the mean of adding a constant to every observation",
      value: "The mean increases by the same constant",
    },
    {
      key: "Effect on the mean of multiplying every observation by a constant",
      value: "The mean is multiplied by the same constant",
    },
  ],
  [
    {
      key: "Empirical relation between mean, median and mode",
      value: "Mode is approximately three times the median minus twice the mean",
    },
    { key: "Measure least affected by extreme values", value: "The median" },
    { key: "Sum of the deviations of the observations from their mean", value: "Zero" },
    {
      key: "Short cut method for the mean",
      value: "Assumed mean plus the mean of the deviations from it",
    },
    {
      key: "Combined mean of two groups",
      value: "The total of both sums of observations divided by the total number of observations",
    },
  ],
);

m9(
  "im9:distance-graphical",
  "Distance Formula and Graphical Solution (ICSE)",
  "In coordinate work, what is %s?",
  "%k is %v.",
  [
    {
      key: "Distance formula",
      value: "The square root of the sum of the squares of the differences of the coordinates",
    },
    {
      key: "Distance of a point from the origin",
      value: "The square root of x squared plus y squared",
    },
    { key: "Distance between (0, 0) and (3, 4)", value: "Five units" },
    { key: "Distance between (1, 2) and (4, 6)", value: "Five units" },
    {
      key: "Condition for three points to be collinear by distances",
      value: "The sum of two of the distances equals the third",
    },
    {
      key: "Graphical solution of simultaneous equations",
      value: "The coordinates of the point at which the two lines intersect",
    },
    { key: "Graph of two equations with no solution", value: "Two parallel lines" },
    { key: "Graph of two equations with infinitely many solutions", value: "Two coincident lines" },
    { key: "Graph of x equals 4", value: "A line parallel to the y axis" },
    { key: "Graph of y equals minus 3", value: "A line parallel to the x axis" },
  ],
  [
    {
      key: "Test that a triangle is isosceles using coordinates",
      value: "Two of the three side lengths from the distance formula are equal",
    },
    {
      key: "Test that a quadrilateral is a rhombus using coordinates",
      value: "All four sides are equal but the diagonals are unequal",
    },
    {
      key: "Centre of a circle through three points by distances",
      value: "The point equidistant from all three, found by equating distances",
    },
    {
      key: "Condition for the lines a1x plus b1y plus c1 and a2x plus b2y plus c2 to be parallel",
      value: "a1 over a2 equals b1 over b2 but not equal to c1 over c2",
    },
    {
      key: "Reason a graphical solution may be only approximate",
      value: "The point of intersection has to be read off the scale of the graph",
    },
  ],
);

/* =================================================== ICSE Maths Class 10 */

m10(
  "im10:ratio-proportion",
  "Ratio and Proportion (ICSE)",
  "In ratio and proportion, what is %s?",
  "%k is %v.",
  [
    { key: "Ratio", value: "A comparison of two quantities of the same kind by division" },
    { key: "Proportion", value: "An equality of two ratios" },
    {
      key: "Continued proportion",
      value: "Three quantities a, b and c such that a is to b as b is to c",
    },
    { key: "Mean proportional between a and b", value: "The square root of a times b" },
    { key: "Third proportional to a and b", value: "b squared divided by a" },
    { key: "Fourth proportional to a, b and c", value: "b times c divided by a" },
    {
      key: "Componendo",
      value: "If a over b equals c over d then (a plus b) over b equals (c plus d) over d",
    },
    {
      key: "Dividendo",
      value: "If a over b equals c over d then (a minus b) over b equals (c minus d) over d",
    },
    {
      key: "Componendo and dividendo",
      value: "(a plus b) over (a minus b) equals (c plus d) over (c minus d)",
    },
    { key: "Alternendo", value: "If a over b equals c over d then a over c equals b over d" },
  ],
  [
    { key: "Mean proportional between 4 and 9", value: "Six" },
    { key: "Invertendo", value: "If a over b equals c over d then b over a equals d over c" },
    { key: "Duplicate ratio of a to b", value: "a squared to b squared" },
    { key: "Product of the extremes in a proportion", value: "Equal to the product of the means" },
    {
      key: "Use of componendo and dividendo in solving equations",
      value: "It removes a complicated denominator from an equation given as a ratio",
    },
  ],
);

m10(
  "im10:section-line",
  "Section Formula and Equation of a Line (ICSE)",
  "In coordinate geometry, what is %s?",
  "%k is %v.",
  [
    {
      key: "Section formula for internal division",
      value: "The point ((m x2 plus n x1) over (m plus n), (m y2 plus n y1) over (m plus n))",
    },
    {
      key: "Mid-point formula",
      value: "The average of the x coordinates and the average of the y coordinates",
    },
    {
      key: "Centroid of a triangle",
      value: "The average of the coordinates of the three vertices",
    },
    {
      key: "Slope of a line through two points",
      value: "The difference of the y coordinates divided by the difference of the x coordinates",
    },
    { key: "Slope intercept form", value: "y equals m x plus c" },
    { key: "Point slope form", value: "y minus y1 equals m times (x minus x1)" },
    {
      key: "Two point form",
      value: "The equation obtained by equating the slope through the two given points",
    },
    { key: "Condition for two lines to be parallel", value: "Their slopes are equal" },
    {
      key: "Condition for two lines to be perpendicular",
      value: "The product of their slopes is minus one",
    },
    { key: "Slope of a line inclined at 45 degrees to the x axis", value: "One" },
  ],
  [
    { key: "Slope of a line parallel to the y axis", value: "Not defined, since the run is zero" },
    {
      key: "Equation of the perpendicular bisector of a segment",
      value: "The line through its mid-point with slope the negative reciprocal of the segment",
    },
    {
      key: "Ratio in which the x axis divides the join of two points",
      value: "The ratio of the y coordinates taken with opposite signs",
    },
    {
      key: "Coordinates of the centroid of a triangle with vertices (0,0), (6,0) and (0,9)",
      value: "(2, 3)",
    },
    {
      key: "Condition that three points are collinear using slopes",
      value: "The slope of the first pair equals the slope of the second pair",
    },
  ],
);

m10(
  "im10:constructions",
  "Constructions — Circles and Tangents (ICSE)",
  "In geometrical constructions, what is %s?",
  "%k is %v.",
  [
    {
      key: "Circumcircle of a triangle",
      value:
        "The circle through all three vertices, centred at the point where the perpendicular bisectors meet",
    },
    {
      key: "Circumcentre",
      value: "The point of intersection of the perpendicular bisectors of the sides",
    },
    {
      key: "Incircle of a triangle",
      value:
        "The circle touching all three sides, centred at the point where the angle bisectors meet",
    },
    { key: "Incentre", value: "The point of intersection of the internal angle bisectors" },
    {
      key: "Tangent from a point on a circle",
      value: "The line through the point perpendicular to the radius at that point",
    },
    {
      key: "Number of tangents from an external point",
      value: "Two, and they are equal in length",
    },
    {
      key: "Construction of a tangent from an external point",
      value:
        "Draw a circle on the join of the centre and the point as diameter and mark where it cuts the given circle",
    },
    { key: "Circumcentre of a right triangle", value: "The mid-point of the hypotenuse" },
    { key: "Circumradius of a right triangle", value: "Half the hypotenuse" },
    {
      key: "Marking required in an ICSE construction",
      value: "All construction arcs and lines must be left clearly visible",
    },
  ],
  [
    {
      key: "Incentre of an equilateral triangle",
      value: "It coincides with the circumcentre, centroid and orthocentre",
    },
    {
      key: "Relation between circumradius and inradius of an equilateral triangle",
      value: "The circumradius is twice the inradius",
    },
    {
      key: "Construction of a circumscribing circle about a regular hexagon",
      value: "The centre is the meeting point of the diagonals and the radius equals the side",
    },
    {
      key: "Locus of points equidistant from two intersecting lines",
      value: "The pair of bisectors of the angles between them",
    },
    {
      key: "Locus of points equidistant from two fixed points",
      value: "The perpendicular bisector of the segment joining them",
    },
  ],
);

m10(
  "im10:graphical-statistics",
  "Graphical Representation and Measures of Central Tendency (ICSE)",
  "In statistics, what is %s?",
  "%k is %v.",
  [
    {
      key: "Histogram",
      value: "A bar diagram for continuous data in which the bars touch each other",
    },
    { key: "Ogive", value: "A curve drawn from the cumulative frequencies" },
    {
      key: "Less than ogive",
      value: "The curve plotted with upper class boundaries against cumulative frequency",
    },
    {
      key: "More than ogive",
      value: "The curve plotted with lower class boundaries against cumulative frequency",
    },
    {
      key: "Median from an ogive",
      value:
        "The abscissa of the point where the two ogives cross, or the reading at half the total frequency",
    },
    {
      key: "Mode from a histogram",
      value: "The abscissa found by joining the corners of the tallest bar to its neighbours",
    },
    { key: "Lower quartile", value: "The value below which one quarter of the observations lie" },
    {
      key: "Upper quartile",
      value: "The value below which three quarters of the observations lie",
    },
    { key: "Inter quartile range", value: "The upper quartile minus the lower quartile" },
    { key: "Class mark", value: "The average of the upper and lower limits of a class" },
  ],
  [
    {
      key: "Position of the median for n observations on an ogive",
      value: "At the value of n by two on the cumulative frequency axis",
    },
    {
      key: "Reason a histogram needs continuous classes",
      value: "The bars must touch, so inclusive classes are first converted to exclusive form",
    },
    {
      key: "Adjustment factor for inclusive classes",
      value:
        "Half the difference between the upper limit of one class and the lower limit of the next",
    },
    {
      key: "Effect of an outlier on the mean and the median",
      value: "The mean shifts markedly while the median hardly moves",
    },
    {
      key: "Use of the inter quartile range",
      value: "It measures spread while ignoring the extreme quarter at each end",
    },
  ],
);

export const ICSE_MATHS_FULL_TEMPLATES = templates;
