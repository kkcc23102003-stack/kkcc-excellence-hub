/**
 * Physics, chapter by chapter, across the full NCERT Class 11 and Class 12
 * syllabus. This is the bank JEE Main, JEE Advanced, NEET, NDA and the CBSE
 * and ISC board papers all draw from, so every chapter here carries the
 * definitions, constants, laws and units those papers actually ask about.
 *
 * Each chapter is tagged with its own class, so a Class 11 student never
 * meets a Class 12 chapter and the board sections stay clean.
 */

import {
  type FactRow,
  type Template,
  factTemplate,
  matchTemplate,
  statementCountTemplate,
  statementTemplate,
} from "./core";

/** Exams that ask Class 11 physics. */
const P11 = [
  "JEE Main",
  "JEE Advanced",
  "NEET",
  "NDA/CDS",
  "CBSE Class 11",
  "ISC Class 11",
  "CBSE Class 11-12 Science",
  "ISC Science",
  "CUET",
];

/** Exams that ask Class 12 physics. */
const P12 = [
  "JEE Main",
  "JEE Advanced",
  "NEET",
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
  const subject = "Physics";
  const spec = { id, subject, topic, difficulty, exams, rows };
  templates.push(
    ...factTemplate({
      ...spec,
      forward: "In physics, %s is:",
      reverse: "Which physics quantity or law is described as: %s?",
      explain:
        "%k is %v. This is a standard NCERT result and a repeat favourite in JEE, NEET and NDA papers.",
    }),
    matchTemplate({ ...spec, label: matchLabel }),
    statementTemplate({ ...spec, label: matchLabel }),
    statementCountTemplate({ ...spec, label: matchLabel }),
  );
}

/* ============================================================ CLASS 11 ==== */

add(
  "ph:units",
  "Units and Measurements",
  "Easy",
  P11,
  [
    { key: "SI unit of force", value: "newton (kg m s^-2)" },
    { key: "SI unit of work and energy", value: "joule (N m)" },
    { key: "SI unit of power", value: "watt (J s^-1)" },
    { key: "SI unit of pressure", value: "pascal (N m^-2)" },
    { key: "SI unit of frequency", value: "hertz (s^-1)" },
    { key: "SI unit of electric charge", value: "coulomb (A s)" },
    { key: "SI unit of magnetic flux", value: "weber (V s)" },
    { key: "SI unit of luminous intensity", value: "candela" },
    { key: "SI unit of amount of substance", value: "mole" },
    { key: "Dimensional formula of force", value: "[M L T^-2]" },
    { key: "Dimensional formula of energy", value: "[M L^2 T^-2]" },
    { key: "Dimensional formula of pressure", value: "[M L^-1 T^-2]" },
  ],
  "physical quantity and its SI unit",
);

add(
  "ph:kinematics",
  "Motion in a Straight Line",
  "Easy",
  P11,
  [
    { key: "First equation of motion", value: "v = u + at" },
    { key: "Second equation of motion", value: "s = ut + (1/2)at^2" },
    { key: "Third equation of motion", value: "v^2 = u^2 + 2as" },
    { key: "Distance in the nth second", value: "s_n = u + (a/2)(2n - 1)" },
    { key: "Slope of a displacement-time graph", value: "Instantaneous velocity" },
    { key: "Slope of a velocity-time graph", value: "Acceleration" },
    { key: "Area under a velocity-time graph", value: "Displacement" },
    { key: "Area under an acceleration-time graph", value: "Change in velocity" },
    { key: "Acceleration due to gravity near the surface", value: "9.8 m s^-2 downward" },
    { key: "Motion with zero acceleration", value: "Uniform velocity, straight-line graph" },
    { key: "Average velocity", value: "Total displacement divided by total time" },
    { key: "Average speed", value: "Total path length divided by total time" },
  ],
  "kinematic quantity and its expression",
);

add(
  "ph:plane",
  "Motion in a Plane",
  "Moderate",
  P11,
  [
    { key: "Maximum height of a projectile", value: "u^2 sin^2(theta) / 2g" },
    { key: "Time of flight of a projectile", value: "2u sin(theta) / g" },
    { key: "Horizontal range of a projectile", value: "u^2 sin(2 theta) / g" },
    { key: "Angle giving maximum range", value: "45 degrees" },
    { key: "Path of a projectile", value: "A parabola" },
    { key: "Horizontal velocity during projectile motion", value: "Remains constant" },
    { key: "Centripetal acceleration", value: "v^2 / r, directed towards the centre" },
    { key: "Angular velocity in terms of period", value: "omega = 2 pi / T" },
    { key: "Relation between linear and angular velocity", value: "v = r omega" },
    { key: "Two angles giving the same range", value: "theta and 90 - theta" },
    { key: "Acceleration at the top of a projectile path", value: "g, vertically downward" },
    { key: "Scalar product of two perpendicular vectors", value: "Zero" },
  ],
  "projectile or circular-motion quantity and its expression",
);

add(
  "ph:laws-motion",
  "Laws of Motion",
  "Easy",
  P11,
  [
    { key: "Newton's first law", value: "A body stays at rest or in uniform motion unless forced" },
    { key: "Newton's second law", value: "F = dp/dt, which gives F = ma for constant mass" },
    { key: "Newton's third law", value: "Every action has an equal and opposite reaction" },
    { key: "Another name for the first law", value: "The law of inertia" },
    { key: "SI unit of impulse", value: "newton second, same as kg m s^-1" },
    { key: "Impulse equals", value: "Change in linear momentum" },
    { key: "Limiting friction", value: "mu_s times the normal reaction" },
    { key: "Kinetic friction compared with static friction", value: "Slightly smaller" },
    { key: "Angle of repose", value: "tan(theta) = mu_s" },
    { key: "Conserved quantity when net external force is zero", value: "Total linear momentum" },
    { key: "Banking angle on a frictionless road", value: "tan(theta) = v^2 / rg" },
    { key: "Apparent weight in a freely falling lift", value: "Zero" },
  ],
  "law of motion and its statement",
);

add(
  "ph:work-energy",
  "Work Energy and Power",
  "Easy",
  P11,
  [
    { key: "Work done by a constant force", value: "W = F s cos(theta)" },
    { key: "Kinetic energy", value: "(1/2)mv^2" },
    { key: "Gravitational potential energy near the surface", value: "mgh" },
    { key: "Elastic potential energy of a spring", value: "(1/2)kx^2" },
    { key: "Work-energy theorem", value: "Net work done equals change in kinetic energy" },
    { key: "Instantaneous power", value: "P = F . v" },
    {
      key: "Work done by a centripetal force",
      value: "Zero, the force is perpendicular to motion",
    },
    { key: "Coefficient of restitution in a perfectly elastic collision", value: "e = 1" },
    { key: "Coefficient of restitution in a perfectly inelastic collision", value: "e = 0" },
    { key: "Quantity conserved in every collision", value: "Linear momentum" },
    { key: "Commercial unit of energy", value: "kilowatt hour, equal to 3.6 x 10^6 J" },
    { key: "1 horsepower", value: "About 746 watt" },
  ],
  "energy quantity and its expression",
);

add(
  "ph:rotation",
  "System of Particles and Rotational Motion",
  "Moderate",
  P11,
  [
    { key: "Moment of inertia of a ring about its axis", value: "MR^2" },
    { key: "Moment of inertia of a disc about its axis", value: "(1/2)MR^2" },
    { key: "Moment of inertia of a solid sphere about a diameter", value: "(2/5)MR^2" },
    { key: "Moment of inertia of a hollow sphere about a diameter", value: "(2/3)MR^2" },
    { key: "Moment of inertia of a rod about its centre", value: "(1/12)ML^2" },
    { key: "Torque", value: "tau = r x F, also I alpha" },
    { key: "Angular momentum", value: "L = I omega, also r x p" },
    { key: "Rotational kinetic energy", value: "(1/2)I omega^2" },
    { key: "Theorem of parallel axes", value: "I = I_cm + Md^2" },
    { key: "Theorem of perpendicular axes", value: "I_z = I_x + I_y, for a plane lamina" },
    { key: "Conserved when external torque is zero", value: "Angular momentum" },
    { key: "Radius of gyration", value: "k, defined by I = Mk^2" },
  ],
  "rotational quantity and its expression",
);

add(
  "ph:gravitation",
  "Gravitation",
  "Moderate",
  P11,
  [
    { key: "Newton's law of gravitation", value: "F = G m1 m2 / r^2" },
    { key: "Universal gravitational constant G", value: "6.67 x 10^-11 N m^2 kg^-2" },
    { key: "Escape velocity from the Earth", value: "About 11.2 km s^-1" },
    { key: "Orbital velocity close to the Earth", value: "About 7.9 km s^-1" },
    { key: "Relation between escape and orbital velocity", value: "v_e = sqrt(2) times v_o" },
    { key: "Kepler's first law", value: "Planets move in ellipses with the Sun at one focus" },
    { key: "Kepler's second law", value: "The radius vector sweeps equal areas in equal times" },
    { key: "Kepler's third law", value: "T^2 is proportional to a^3" },
    { key: "Time period of a geostationary satellite", value: "24 hours" },
    { key: "Height of a geostationary orbit", value: "About 36,000 km" },
    { key: "Value of g at the centre of the Earth", value: "Zero" },
    { key: "Gravitational potential energy of two masses", value: "-G m1 m2 / r" },
  ],
  "gravitation quantity and its value",
);

add(
  "ph:solids",
  "Mechanical Properties of Solids",
  "Moderate",
  P11,
  [
    { key: "Hooke's law", value: "Within the elastic limit, stress is proportional to strain" },
    { key: "Young's modulus", value: "Longitudinal stress divided by longitudinal strain" },
    { key: "Bulk modulus", value: "Volume stress divided by volume strain" },
    { key: "Modulus of rigidity", value: "Shearing stress divided by shearing strain" },
    { key: "Poisson's ratio", value: "Lateral strain divided by longitudinal strain" },
    { key: "SI unit of stress", value: "N m^-2, the same as pascal" },
    { key: "Unit of strain", value: "It is dimensionless" },
    { key: "Elastic potential energy per unit volume", value: "(1/2) stress x strain" },
    { key: "Compressibility", value: "The reciprocal of bulk modulus" },
    { key: "Material with the largest Young modulus in common use", value: "Steel" },
    { key: "Breaking stress", value: "Maximum stress a material bears before fracture" },
    {
      key: "Elastic after-effect",
      value: "Delay in regaining original shape after stress removal",
    },
  ],
  "elastic property and its definition",
);

add(
  "ph:fluids",
  "Mechanical Properties of Fluids",
  "Moderate",
  P11,
  [
    {
      key: "Pascal's law",
      value: "Pressure applied to a confined fluid is transmitted undiminished",
    },
    { key: "Archimedes' principle", value: "Upthrust equals the weight of the displaced fluid" },
    {
      key: "Bernoulli's theorem",
      value: "P + (1/2)rho v^2 + rho g h stays constant along a streamline",
    },
    { key: "Equation of continuity", value: "A1 v1 = A2 v2" },
    { key: "Stokes' law", value: "F = 6 pi eta r v" },
    { key: "Terminal velocity", value: "Constant velocity when viscous drag balances net weight" },
    { key: "Reynolds number below 1000", value: "Flow is streamline" },
    { key: "Excess pressure inside a soap bubble", value: "4T / R" },
    { key: "Excess pressure inside a liquid drop", value: "2T / R" },
    { key: "Rise of liquid in a capillary tube", value: "h = 2T cos(theta) / (r rho g)" },
    { key: "SI unit of surface tension", value: "N m^-1" },
    { key: "SI unit of coefficient of viscosity", value: "Pa s, also called poiseuille" },
  ],
  "fluid law and its statement",
);

add(
  "ph:thermal",
  "Thermal Properties of Matter",
  "Easy",
  P11,
  [
    { key: "Absolute zero on the Celsius scale", value: "-273.15 degrees Celsius" },
    { key: "Triple point of water", value: "273.16 K" },
    { key: "Specific heat capacity of water", value: "4186 J kg^-1 K^-1" },
    { key: "Latent heat of fusion of ice", value: "3.34 x 10^5 J kg^-1" },
    { key: "Latent heat of vaporisation of water", value: "22.6 x 10^5 J kg^-1" },
    {
      key: "Coefficient of volume expansion",
      value: "Three times the linear expansion coefficient",
    },
    { key: "Anomalous expansion of water", value: "Water contracts from 0 to 4 degrees Celsius" },
    { key: "Mode of heat transfer needing no medium", value: "Radiation" },
    { key: "Stefan-Boltzmann law", value: "E is proportional to T^4" },
    { key: "Wien's displacement law", value: "lambda_max times T is constant" },
    {
      key: "Newton's law of cooling",
      value: "Rate of cooling is proportional to the excess temperature",
    },
    { key: "Perfect absorber and emitter", value: "A black body, with emissivity 1" },
  ],
  "thermal quantity and its value",
);

add(
  "ph:thermodynamics",
  "Thermodynamics",
  "Moderate",
  P11,
  [
    {
      key: "Zeroth law of thermodynamics",
      value: "It defines temperature through thermal equilibrium",
    },
    {
      key: "First law of thermodynamics",
      value: "dQ = dU + dW, a statement of energy conservation",
    },
    {
      key: "Second law, Kelvin-Planck statement",
      value: "No engine can convert all heat into work",
    },
    { key: "Isothermal process", value: "Temperature constant, so dU = 0 and dQ = dW" },
    { key: "Adiabatic process", value: "No heat exchange, so dQ = 0 and dW = -dU" },
    { key: "Isochoric process", value: "Volume constant, so dW = 0 and dQ = dU" },
    { key: "Isobaric process", value: "Pressure constant, so dW = P dV" },
    { key: "Efficiency of a Carnot engine", value: "1 - T2/T1, with temperatures in kelvin" },
    { key: "Adiabatic relation for an ideal gas", value: "P V^gamma is constant" },
    { key: "Mayer relation", value: "Cp - Cv = R" },
    { key: "Value of gamma for a monatomic gas", value: "1.67, that is 5/3" },
    { key: "Value of gamma for a diatomic gas", value: "1.4, that is 7/5" },
  ],
  "thermodynamic process and its condition",
);

add(
  "ph:kinetic-theory",
  "Kinetic Theory of Gases",
  "Moderate",
  P11,
  [
    { key: "Ideal gas equation", value: "PV = nRT" },
    { key: "Universal gas constant R", value: "8.314 J mol^-1 K^-1" },
    { key: "Boltzmann constant", value: "1.38 x 10^-23 J K^-1" },
    { key: "Pressure of an ideal gas", value: "P = (1/3) rho v_rms^2" },
    { key: "Root mean square speed", value: "v_rms = sqrt(3RT/M)" },
    { key: "Average kinetic energy per molecule", value: "(3/2) k T" },
    { key: "Degrees of freedom of a monatomic gas", value: "3" },
    { key: "Degrees of freedom of a diatomic gas at room temperature", value: "5" },
    { key: "Law of equipartition of energy", value: "Each degree of freedom carries (1/2) k T" },
    { key: "Mean free path", value: "Average distance travelled between two collisions" },
    { key: "Avogadro's number", value: "6.022 x 10^23 per mole" },
    { key: "Molar volume of an ideal gas at STP", value: "22.4 litre" },
  ],
  "kinetic theory quantity and its expression",
);

add(
  "ph:oscillations",
  "Oscillations",
  "Moderate",
  P11,
  [
    {
      key: "Condition for simple harmonic motion",
      value: "Acceleration is proportional to and opposite the displacement",
    },
    { key: "Time period of a spring-mass system", value: "T = 2 pi sqrt(m/k)" },
    { key: "Time period of a simple pendulum", value: "T = 2 pi sqrt(l/g)" },
    { key: "Displacement equation in SHM", value: "x = A sin(omega t + phi)" },
    { key: "Maximum velocity in SHM", value: "A omega, at the mean position" },
    { key: "Maximum acceleration in SHM", value: "A omega^2, at the extreme position" },
    { key: "Total energy in SHM", value: "(1/2) m omega^2 A^2, and it stays constant" },
    { key: "Kinetic energy at the mean position", value: "Maximum" },
    { key: "Potential energy at the extreme position", value: "Maximum" },
    { key: "Phase difference between displacement and velocity", value: "pi/2" },
    { key: "Phase difference between displacement and acceleration", value: "pi" },
    {
      key: "Time period of a pendulum in a freely falling lift",
      value: "Infinite, the pendulum does not oscillate",
    },
  ],
  "SHM quantity and its expression",
);

add(
  "ph:waves",
  "Waves",
  "Moderate",
  P11,
  [
    { key: "Wave speed relation", value: "v = f lambda" },
    { key: "Speed of sound in air at 0 degrees Celsius", value: "About 332 m s^-1" },
    { key: "Speed of a transverse wave on a string", value: "v = sqrt(T/mu)" },
    { key: "Speed of sound in a gas by Laplace", value: "v = sqrt(gamma P / rho)" },
    { key: "Frequency range of audible sound", value: "20 Hz to 20,000 Hz" },
    { key: "Beat frequency", value: "The difference of the two source frequencies" },
    {
      key: "Condition for constructive interference",
      value: "Path difference is an integral multiple of lambda",
    },
    {
      key: "Condition for destructive interference",
      value: "Path difference is an odd multiple of lambda/2",
    },
    {
      key: "Fundamental frequency of a closed organ pipe",
      value: "v/4L, only odd harmonics appear",
    },
    { key: "Fundamental frequency of an open organ pipe", value: "v/2L, all harmonics appear" },
    { key: "Doppler effect", value: "Apparent change in frequency due to relative motion" },
    { key: "Nature of sound waves in air", value: "Longitudinal and mechanical" },
  ],
  "wave quantity and its expression",
);

/* ============================================================ CLASS 12 ==== */

add(
  "ph:electrostatics",
  "Electric Charges and Fields",
  "Moderate",
  P12,
  [
    { key: "Coulomb's law", value: "F = k q1 q2 / r^2, with k = 9 x 10^9 N m^2 C^-2" },
    { key: "Permittivity of free space", value: "8.85 x 10^-12 C^2 N^-1 m^-2" },
    { key: "Charge on an electron", value: "-1.6 x 10^-19 C" },
    { key: "Electric field of a point charge", value: "E = kq / r^2" },
    { key: "Gauss's law", value: "Flux through a closed surface equals q_enclosed / epsilon_0" },
    { key: "Field of an infinite line charge", value: "lambda / (2 pi epsilon_0 r)" },
    {
      key: "Field of an infinite charged sheet",
      value: "sigma / (2 epsilon_0), independent of distance",
    },
    { key: "Field inside a charged conducting shell", value: "Zero" },
    { key: "Electric dipole moment", value: "p = q x 2a, directed from negative to positive" },
    { key: "Torque on a dipole in a uniform field", value: "tau = p x E" },
    { key: "Field on the axis of a dipole", value: "2kp / r^3" },
    { key: "Field on the equatorial line of a dipole", value: "kp / r^3" },
  ],
  "electrostatic quantity and its expression",
);

add(
  "ph:potential",
  "Electrostatic Potential and Capacitance",
  "Moderate",
  P12,
  [
    { key: "Electric potential of a point charge", value: "V = kq / r" },
    { key: "Relation between field and potential", value: "E = -dV/dr" },
    { key: "SI unit of capacitance", value: "farad, that is coulomb per volt" },
    { key: "Capacitance of a parallel plate capacitor", value: "C = epsilon_0 A / d" },
    { key: "Energy stored in a capacitor", value: "(1/2)CV^2, also Q^2 / 2C" },
    { key: "Capacitors in series", value: "1/C = 1/C1 + 1/C2 + ..." },
    { key: "Capacitors in parallel", value: "C = C1 + C2 + ..." },
    { key: "Effect of a dielectric of constant K", value: "Capacitance becomes K times larger" },
    {
      key: "Potential inside a charged conducting shell",
      value: "Constant and equal to the surface value",
    },
    { key: "Work done in moving a charge on an equipotential surface", value: "Zero" },
    { key: "Angle between field lines and an equipotential surface", value: "90 degrees" },
    { key: "Energy density of an electric field", value: "(1/2) epsilon_0 E^2" },
  ],
  "capacitance quantity and its expression",
);

add(
  "ph:current",
  "Current Electricity",
  "Easy",
  P12,
  [
    { key: "Ohm's law", value: "V = IR at constant temperature" },
    { key: "Resistance of a wire", value: "R = rho L / A" },
    { key: "Resistors in series", value: "R = R1 + R2 + ..." },
    { key: "Resistors in parallel", value: "1/R = 1/R1 + 1/R2 + ..." },
    { key: "Drift velocity relation", value: "I = n A e v_d" },
    {
      key: "Kirchhoff's junction rule",
      value: "Sum of currents at a junction is zero, from charge conservation",
    },
    {
      key: "Kirchhoff's loop rule",
      value: "Sum of potential differences in a loop is zero, from energy conservation",
    },
    { key: "Balanced Wheatstone bridge condition", value: "P/Q = R/S" },
    { key: "Power dissipated in a resistor", value: "P = I^2 R, also V^2 / R" },
    { key: "SI unit of resistivity", value: "ohm metre" },
    { key: "Effect of temperature on a metal conductor", value: "Resistance increases" },
    { key: "Effect of temperature on a semiconductor", value: "Resistance decreases" },
  ],
  "current electricity law and its expression",
);

add(
  "ph:magnetism",
  "Moving Charges and Magnetism",
  "Moderate",
  P12,
  [
    { key: "Lorentz force on a moving charge", value: "F = q(v x B)" },
    { key: "Force on a current-carrying conductor", value: "F = B I L sin(theta)" },
    { key: "Biot-Savart law", value: "dB = (mu_0 / 4 pi) I dl sin(theta) / r^2" },
    { key: "Field at the centre of a circular coil", value: "mu_0 N I / 2R" },
    { key: "Field due to a long straight wire", value: "mu_0 I / (2 pi r)" },
    { key: "Field inside a long solenoid", value: "mu_0 n I" },
    { key: "Permeability of free space", value: "4 pi x 10^-7 T m A^-1" },
    { key: "Radius of a charged particle path in a magnetic field", value: "r = mv / qB" },
    { key: "Cyclotron frequency", value: "f = qB / (2 pi m)" },
    {
      key: "Work done by a magnetic force",
      value: "Zero, the force is always perpendicular to velocity",
    },
    { key: "Torque on a current loop", value: "tau = N B I A sin(theta)" },
    { key: "Instrument based on torque on a coil", value: "Moving coil galvanometer" },
  ],
  "magnetic quantity and its expression",
);

add(
  "ph:emi",
  "Electromagnetic Induction",
  "Moderate",
  P12,
  [
    {
      key: "Faraday's law of induction",
      value: "Induced emf equals the negative rate of change of flux",
    },
    { key: "Lenz's law", value: "The induced current opposes the change producing it" },
    { key: "Physical principle behind Lenz law", value: "Conservation of energy" },
    { key: "Motional emf", value: "e = B l v" },
    { key: "SI unit of magnetic flux", value: "weber" },
    { key: "SI unit of inductance", value: "henry" },
    { key: "Self inductance of a solenoid", value: "L = mu_0 n^2 A l" },
    { key: "Energy stored in an inductor", value: "(1/2) L I^2" },
    { key: "Emf induced by mutual inductance", value: "e = -M dI/dt" },
    { key: "Eddy currents", value: "Circulating currents induced in a bulk conductor" },
    { key: "Use of laminated cores in transformers", value: "To reduce eddy current losses" },
    { key: "Device working on mutual induction", value: "Transformer" },
  ],
  "induction law and its statement",
);

add(
  "ph:ac",
  "Alternating Current",
  "Moderate",
  P12,
  [
    { key: "RMS value of an alternating current", value: "I_0 / sqrt(2), about 0.707 I_0" },
    { key: "Frequency of AC supply in India", value: "50 Hz" },
    { key: "Inductive reactance", value: "X_L = omega L" },
    { key: "Capacitive reactance", value: "X_C = 1 / (omega C)" },
    { key: "Impedance of a series LCR circuit", value: "Z = sqrt(R^2 + (X_L - X_C)^2)" },
    {
      key: "Resonance condition in a series LCR circuit",
      value: "X_L = X_C, so omega = 1/sqrt(LC)",
    },
    { key: "Impedance at resonance", value: "Minimum and equal to R" },
    { key: "Power factor", value: "cos(phi) = R / Z" },
    { key: "Power consumed by a pure inductor", value: "Zero, it is a wattless current" },
    { key: "Phase of current in a pure inductor", value: "Current lags voltage by pi/2" },
    { key: "Phase of current in a pure capacitor", value: "Current leads voltage by pi/2" },
    { key: "Transformer turns ratio", value: "V_s / V_p = N_s / N_p" },
  ],
  "AC quantity and its expression",
);

add(
  "ph:em-waves",
  "Electromagnetic Waves",
  "Easy",
  P12,
  [
    { key: "Speed of electromagnetic waves in vacuum", value: "3 x 10^8 m s^-1" },
    { key: "Relation for the speed of light", value: "c = 1 / sqrt(mu_0 epsilon_0)" },
    { key: "Nature of electromagnetic waves", value: "Transverse, with E perpendicular to B" },
    { key: "Longest wavelength in the spectrum", value: "Radio waves" },
    { key: "Shortest wavelength in the spectrum", value: "Gamma rays" },
    { key: "Waves used in RADAR", value: "Microwaves" },
    { key: "Waves used in a TV remote", value: "Infrared" },
    { key: "Waves absorbed by the ozone layer", value: "Ultraviolet" },
    { key: "Waves used to detect bone fractures", value: "X-rays" },
    { key: "Range of visible light", value: "About 400 nm to 700 nm" },
    { key: "Concept introduced by Maxwell", value: "Displacement current" },
    { key: "Scientist who produced EM waves in the laboratory", value: "Heinrich Hertz" },
  ],
  "electromagnetic wave and its use",
);

add(
  "ph:ray-optics",
  "Ray Optics and Optical Instruments",
  "Moderate",
  P12,
  [
    { key: "Mirror formula", value: "1/v + 1/u = 1/f" },
    { key: "Lens formula", value: "1/v - 1/u = 1/f" },
    { key: "Focal length of a spherical mirror", value: "Half the radius of curvature" },
    { key: "Power of a lens", value: "P = 1/f, measured in dioptre" },
    { key: "Snell's law", value: "n1 sin(i) = n2 sin(r)" },
    { key: "Refractive index of water", value: "About 1.33" },
    { key: "Refractive index of crown glass", value: "About 1.5" },
    { key: "Critical angle for water to air", value: "About 48.6 degrees" },
    {
      key: "Condition for total internal reflection",
      value: "Light goes from denser to rarer beyond the critical angle",
    },
    { key: "Lens maker formula", value: "1/f = (n - 1)(1/R1 - 1/R2)" },
    { key: "Defect corrected by a concave lens", value: "Myopia, or short sightedness" },
    { key: "Defect corrected by a convex lens", value: "Hypermetropia, or long sightedness" },
  ],
  "optics formula and its expression",
);

add(
  "ph:wave-optics",
  "Wave Optics",
  "Difficult",
  P12,
  [
    {
      key: "Huygens' principle",
      value: "Every point on a wavefront acts as a source of secondary wavelets",
    },
    { key: "Fringe width in a double slit experiment", value: "beta = D lambda / d" },
    { key: "Condition for a bright fringe", value: "Path difference is n lambda" },
    { key: "Condition for a dark fringe", value: "Path difference is (2n - 1) lambda / 2" },
    {
      key: "Effect of immersing the apparatus in water",
      value: "Fringe width decreases by the refractive index",
    },
    { key: "Width of the central maximum in single slit diffraction", value: "2 D lambda / a" },
    { key: "Condition for a diffraction minimum", value: "a sin(theta) = n lambda" },
    { key: "Polarisation proves", value: "Light is a transverse wave" },
    { key: "Brewster's law", value: "tan(i_p) = n, the refractive index" },
    {
      key: "Angle between reflected and refracted rays at the polarising angle",
      value: "90 degrees",
    },
    { key: "Malus' law", value: "I = I_0 cos^2(theta)" },
    { key: "Resolving power of a telescope", value: "D / (1.22 lambda)" },
  ],
  "wave optics law and its expression",
);

add(
  "ph:dual-nature",
  "Dual Nature of Radiation and Matter",
  "Moderate",
  P12,
  [
    { key: "Planck's constant", value: "6.626 x 10^-34 J s" },
    { key: "Energy of a photon", value: "E = h nu, also hc / lambda" },
    { key: "Einstein's photoelectric equation", value: "K_max = h nu - phi" },
    { key: "Threshold frequency", value: "The minimum frequency needed to eject an electron" },
    { key: "Work function", value: "The minimum energy needed to free an electron from a metal" },
    {
      key: "Effect of increasing light intensity",
      value: "Photocurrent increases, stopping potential does not",
    },
    { key: "Effect of increasing light frequency", value: "Stopping potential increases" },
    { key: "de Broglie wavelength", value: "lambda = h / p, also h / mv" },
    {
      key: "de Broglie wavelength of an accelerated electron",
      value: "lambda = 12.27 / sqrt(V) angstrom",
    },
    { key: "Experiment confirming matter waves", value: "The Davisson-Germer experiment" },
    { key: "1 electron volt in joule", value: "1.6 x 10^-19 J" },
    { key: "Momentum of a photon", value: "h / lambda" },
  ],
  "quantum quantity and its expression",
);

add(
  "ph:atoms-nuclei",
  "Atoms and Nuclei",
  "Moderate",
  P12,
  [
    {
      key: "Result of the Rutherford scattering experiment",
      value: "The atom has a small, dense, positive nucleus",
    },
    {
      key: "Bohr's quantisation condition",
      value: "Angular momentum is an integral multiple of h / 2 pi",
    },
    { key: "Radius of the first Bohr orbit", value: "0.53 angstrom" },
    { key: "Ground state energy of hydrogen", value: "-13.6 eV" },
    { key: "Energy of the nth hydrogen level", value: "-13.6 / n^2 eV" },
    { key: "Series lying in the ultraviolet region", value: "The Lyman series" },
    { key: "Series lying in the visible region", value: "The Balmer series" },
    { key: "Nuclear radius relation", value: "R = R_0 A^(1/3), with R_0 about 1.2 fm" },
    { key: "Mass defect", value: "Difference between the mass of nucleons and the nucleus" },
    { key: "Binding energy per nucleon at maximum", value: "About 8.8 MeV, near iron-56" },
    { key: "Law of radioactive decay", value: "N = N_0 e^(-lambda t)" },
    { key: "Relation between half life and decay constant", value: "T_half = 0.693 / lambda" },
  ],
  "atomic or nuclear quantity and its value",
);

add(
  "ph:semiconductors",
  "Semiconductor Electronics",
  "Moderate",
  P12,
  [
    { key: "Energy gap in a conductor", value: "Zero, the bands overlap" },
    { key: "Energy gap in an insulator", value: "Large, more than about 3 eV" },
    { key: "Energy gap in silicon", value: "About 1.1 eV" },
    { key: "Energy gap in germanium", value: "About 0.7 eV" },
    {
      key: "Dopant producing an n-type semiconductor",
      value: "A pentavalent atom such as phosphorus",
    },
    { key: "Dopant producing a p-type semiconductor", value: "A trivalent atom such as boron" },
    { key: "Majority carriers in n-type material", value: "Electrons" },
    { key: "Majority carriers in p-type material", value: "Holes" },
    { key: "Barrier potential of a silicon diode", value: "About 0.7 V" },
    { key: "Barrier potential of a germanium diode", value: "About 0.3 V" },
    { key: "Diode used as a voltage regulator", value: "The Zener diode, in reverse bias" },
    { key: "Output frequency of a full wave rectifier on 50 Hz input", value: "100 Hz" },
  ],
  "semiconductor property and its value",
);

export const PHYSICS_TEMPLATES = templates;
