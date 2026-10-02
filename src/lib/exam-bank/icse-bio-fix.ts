/**
 * ICSE Class 10 Biology — the chapters still missing after checking the CISCE
 * course structure, which lists sixteen chapters in seven units.
 *
 * Unit 2 Plant Physiology ends with Chemical Coordination in Plants, Unit 3
 * Human Anatomy and Physiology includes Sense Organs as a chapter of its own,
 * and Unit 7 Physical Health and Hygiene carries Health Organisations and
 * Aids to Health. None of those were in the bank.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const C10 = ["ICSE Class 10", "ICSE MCQ", "ICSE Class 9-10"];
const C9 = ["ICSE Class 9", "ICSE MCQ", "ICSE Class 9-10"];

const templates: Template[] = [];
const bio10 = chapterFactory(templates, "Biology Class 10", C10);
const bio9 = chapterFactory(templates, "Biology Class 9", C9);

bio10(
  "icse:b10:plant-coordination",
  "Chemical Coordination in Plants",
  "In plant coordination, what is %s?",
  "%k is %v.",
  [
    {
      key: "Phytohormone",
      value: "A chemical made in one part of a plant that regulates growth in another part",
    },
    {
      key: "Auxin",
      value: "The growth hormone that promotes cell elongation in shoots and causes phototropism",
    },
    {
      key: "Gibberellin",
      value: "The hormone that causes stem elongation, bolting and the breaking of seed dormancy",
    },
    {
      key: "Cytokinin",
      value: "The hormone that promotes cell division and delays the ageing of leaves",
    },
    {
      key: "Abscisic acid",
      value:
        "The growth inhibitor that closes stomata and enforces dormancy, called the stress hormone",
    },
    { key: "Ethylene", value: "The gaseous hormone that hastens the ripening of fruit" },
    {
      key: "Tropism",
      value: "A directional growth movement of a plant part in response to an external stimulus",
    },
    {
      key: "Phototropism",
      value: "Growth movement in response to light; shoots are positively phototropic",
    },
    {
      key: "Geotropism",
      value: "Growth movement in response to gravity; roots are positively geotropic",
    },
    { key: "Hydrotropism", value: "Growth movement of roots towards a source of water" },
  ],
  [
    {
      key: "Mechanism of phototropism",
      value:
        "Auxin moves to the shaded side, which elongates more and bends the shoot towards the light",
    },
    {
      key: "Thigmotropism",
      value: "Growth movement in response to touch, seen in the tendrils of a climbing plant",
    },
    {
      key: "Difference between a tropic and a nastic movement",
      value:
        "A tropic movement is directional and growth based while a nastic movement is non directional and often turgor based",
    },
    {
      key: "Reason the touch me not plant folds its leaves",
      value: "A sudden loss of turgor in the pulvinus at the leaf base, which is a nastic movement",
    },
    {
      key: "Apical dominance",
      value:
        "Suppression of lateral buds by auxin from the apical bud, which is why pruning makes a plant bushy",
    },
  ],
);

bio10(
  "icse:b10:sense-organs",
  "Sense Organs — Eye and Ear",
  "In the study of sense organs, what is %s?",
  "%k is %v.",
  [
    {
      key: "Cornea",
      value: "The transparent front part of the eye where most refraction takes place",
    },
    { key: "Iris", value: "The coloured muscular diaphragm that controls the size of the pupil" },
    { key: "Pupil", value: "The central opening of the iris through which light enters the eye" },
    {
      key: "Lens of the eye",
      value: "The biconvex crystalline structure that focuses light on the retina",
    },
    { key: "Retina", value: "The innermost light sensitive layer carrying rods and cones" },
    { key: "Rods", value: "The retinal cells that give vision in dim light and detect no colour" },
    { key: "Cones", value: "The retinal cells that give colour vision in bright light" },
    { key: "Yellow spot", value: "The point of sharpest vision on the retina, rich in cones" },
    {
      key: "Blind spot",
      value: "The point where the optic nerve leaves the retina, having no rods or cones",
    },
    {
      key: "Accommodation",
      value:
        "The adjustment of the eye lens by the ciliary muscles to focus at different distances",
    },
  ],
  [
    {
      key: "Three parts of the human ear",
      value: "The outer ear, the middle ear and the inner ear",
    },
    {
      key: "Ear ossicles",
      value: "The malleus, incus and stapes, which amplify vibrations in the middle ear",
    },
    {
      key: "Cochlea",
      value: "The spirally coiled part of the inner ear that contains the organ of hearing",
    },
    {
      key: "Semicircular canals",
      value: "The three fluid filled canals of the inner ear that maintain balance",
    },
    {
      key: "Eustachian tube",
      value:
        "The tube joining the middle ear to the pharynx that equalises air pressure across the eardrum",
    },
  ],
);

bio10(
  "icse:b10:health-organisations",
  "Health Organisations and Aids to Health",
  "In the study of health, what is %s?",
  "%k is %v.",
  [
    {
      key: "Health",
      value:
        "A state of complete physical, mental and social well being, not merely the absence of disease",
    },
    {
      key: "World Health Organisation",
      value:
        "The United Nations agency for international public health, with headquarters at Geneva",
    },
    { key: "World Health Day", value: "The seventh of April" },
    {
      key: "Red Cross",
      value: "The international humanitarian organisation founded by Henry Dunant",
    },
    {
      key: "Emblem of the Red Cross",
      value: "A red cross on a white background, the reverse of the Swiss flag",
    },
    { key: "Immunity", value: "The ability of the body to resist a pathogen" },
    {
      key: "Active immunity",
      value:
        "Immunity developed by the body making its own antibodies after infection or vaccination",
    },
    {
      key: "Passive immunity",
      value:
        "Immunity obtained by receiving ready made antibodies, as from mother's milk or an antiserum",
    },
    {
      key: "Vaccine",
      value: "A preparation of weakened or killed pathogens that stimulates active immunity",
    },
    {
      key: "Antiseptic",
      value: "A chemical applied on living tissue to check the growth of micro organisms",
    },
  ],
  [
    {
      key: "Difference between an antiseptic and a disinfectant",
      value:
        "An antiseptic is safe on living tissue while a disinfectant is stronger and used on non living surfaces",
    },
    {
      key: "Pasteurisation",
      value:
        "Heating milk to about 63 degrees Celsius for thirty minutes and cooling it rapidly to kill pathogens",
    },
    {
      key: "Sterilisation by autoclave",
      value: "Killing all micro organisms with steam under pressure at about 121 degrees Celsius",
    },
    { key: "BCG vaccine", value: "The vaccine given against tuberculosis" },
    {
      key: "Function of UNICEF in health",
      value: "It works for the health, nutrition, immunisation and education of children worldwide",
    },
  ],
);

bio9(
  "icse:b9:vegetative-waste",
  "Vegetative Propagation and Waste Management",
  "In applied biology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Vegetative propagation",
      value: "Reproduction from a vegetative part of a plant without seeds",
    },
    {
      key: "Natural vegetative propagation by stem",
      value: "Runners in grass, tubers in potato, bulbs in onion and rhizomes in ginger",
    },
    {
      key: "Vegetative propagation by leaf",
      value: "Buds on the leaf margin of Bryophyllum grow into new plants",
    },
    {
      key: "Cutting",
      value:
        "A piece of stem, root or leaf planted to grow into a new plant, as in rose and sugarcane",
    },
    {
      key: "Layering",
      value: "Bending a branch into the soil so that it roots while still attached to the parent",
    },
    {
      key: "Grafting",
      value: "Joining the stem of one plant, the scion, to the rooted stock of another",
    },
    {
      key: "Advantage of vegetative propagation",
      value:
        "The offspring are genetically identical to the parent, so desirable traits are preserved",
    },
    {
      key: "Tissue culture",
      value: "Growing whole plants from a few cells on a nutrient medium under sterile conditions",
    },
    {
      key: "Biodegradable waste",
      value: "Waste broken down by micro organisms, such as kitchen and garden waste",
    },
    {
      key: "Non biodegradable waste",
      value: "Waste micro organisms cannot decompose, such as plastic, glass and metal",
    },
  ],
  [
    {
      key: "Disadvantage of vegetative propagation",
      value: "There is no genetic variation, so the whole crop can be wiped out by one disease",
    },
    {
      key: "Composting",
      value: "Controlled decomposition of organic waste by micro organisms into manure",
    },
    {
      key: "Vermicomposting",
      value: "Composting with the help of earthworms, which speeds up decomposition",
    },
    {
      key: "Segregation of waste at source",
      value: "Separating biodegradable, recyclable and hazardous waste before disposal",
    },
    {
      key: "Sanitary landfill",
      value:
        "A lined and covered pit where non recyclable waste is buried to prevent leachate reaching groundwater",
    },
  ],
);

export const ICSE_BIO_FIX_TEMPLATES = templates;
