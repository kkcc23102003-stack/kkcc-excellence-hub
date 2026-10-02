/**
 * Environment and Ecology — a compulsory General Studies section for UPSC,
 * State PSC, SSC and the forest/defence services, kept as its own subject.
 */

import { type Template } from "./core";
import { GK_WIDE, chapterFactory } from "./two-layer";

const templates: Template[] = [];
const chapter = chapterFactory(templates, "Environment and Ecology", GK_WIDE);

chapter(
  "env:ecosystem",
  "Ecosystem and Ecology",
  "In ecology, what is %s?",
  "%k is %v.",
  [
    {
      key: "Ecosystem",
      value: "A community of organisms together with their physical environment",
    },
    { key: "Producer", value: "An autotroph that makes its own food, such as a green plant" },
    {
      key: "Food chain",
      value: "The sequence of who eats whom, transferring energy between levels",
    },
    { key: "Trophic level", value: "The position an organism occupies in a food chain" },
    {
      key: "Ten per cent law",
      value: "Only about ten per cent of energy passes to the next trophic level",
    },
    {
      key: "Decomposer",
      value: "An organism that breaks down dead matter, such as bacteria and fungi",
    },
    { key: "Biome", value: "A large regional ecosystem such as a tundra, desert or rainforest" },
    {
      key: "Ecological succession",
      value: "The orderly change in a community over time towards a climax",
    },
    {
      key: "Biodiversity hotspot",
      value: "A region with high endemism that has lost most of its original habitat",
    },
    {
      key: "Number of biodiversity hotspots in India",
      value: "Four, including the Himalaya and the Western Ghats",
    },
  ],
  [
    {
      key: "Why the energy pyramid is always upright",
      value: "Energy is lost as heat at each transfer, so it cannot increase upwards",
    },
    {
      key: "Keystone species",
      value: "A species whose removal disproportionately changes the whole ecosystem",
    },
    {
      key: "Biomagnification",
      value: "The increasing concentration of a persistent toxin at higher trophic levels",
    },
    {
      key: "Edge effect",
      value: "The distinct conditions and species richness found at the boundary of two ecosystems",
    },
    {
      key: "Inverted biomass pyramid",
      value:
        "Found in aquatic ecosystems, where producer biomass is smaller than consumer biomass at an instant",
    },
  ],
);

chapter(
  "env:pollution",
  "Pollution and Climate Change",
  "On pollution and climate change, what is %s?",
  "%k is %v.",
  [
    { key: "Greenhouse gas with the largest share", value: "Carbon dioxide" },
    {
      key: "Most potent common greenhouse gas per molecule",
      value: "Sulphur hexafluoride, far above methane",
    },
    { key: "Gas responsible for ozone depletion", value: "Chlorofluorocarbons" },
    { key: "Ozone layer location", value: "The stratosphere" },
    {
      key: "Acid rain cause",
      value: "Sulphur dioxide and nitrogen oxides from burning fossil fuels",
    },
    {
      key: "Air Quality Index categories",
      value: "Good, satisfactory, moderate, poor, very poor and severe",
    },
    {
      key: "Eutrophication",
      value: "Nutrient enrichment of water that causes algal blooms and oxygen loss",
    },
    { key: "BOD", value: "Biochemical oxygen demand, a measure of organic pollution in water" },
    { key: "Minamata disease", value: "Mercury poisoning, first reported in Japan" },
    { key: "Itai-itai disease", value: "Cadmium poisoning, also first reported in Japan" },
  ],
  [
    { key: "Montreal Protocol", value: "The 1987 treaty phasing out ozone depleting substances" },
    {
      key: "Kigali Amendment",
      value: "The 2016 amendment to the Montreal Protocol phasing down hydrofluorocarbons",
    },
    {
      key: "Paris Agreement goal",
      value: "Holding warming well below two degrees, pursuing one and a half degrees",
    },
    {
      key: "IPCC",
      value: "The Intergovernmental Panel on Climate Change, set up by UNEP and WMO in 1988",
    },
    {
      key: "Carbon sequestration",
      value: "The long-term capture and storage of carbon dioxide from the atmosphere",
    },
  ],
);

chapter(
  "env:conservation",
  "Conservation, Laws and Protected Areas",
  "On environmental conservation in India, what is %s?",
  "%k is %v.",
  [
    { key: "Project Tiger launch year", value: "1973" },
    { key: "Project Elephant launch year", value: "1992" },
    { key: "National animal of India", value: "The Royal Bengal Tiger" },
    { key: "National bird of India", value: "The Indian peacock" },
    { key: "National aquatic animal of India", value: "The Gangetic dolphin" },
    { key: "Wildlife Protection Act year", value: "1972" },
    { key: "Environment Protection Act year", value: "1986" },
    { key: "Forest Conservation Act year", value: "1980" },
    {
      key: "Kaziranga National Park",
      value: "The Assam park famous for the one-horned rhinoceros",
    },
    {
      key: "Gir National Park",
      value: "The Gujarat park that is the last home of the Asiatic lion",
    },
  ],
  [
    {
      key: "National Green Tribunal",
      value: "The environmental court established by the NGT Act of 2010",
    },
    {
      key: "Article 48A",
      value: "The Directive Principle directing the State to protect the environment and wildlife",
    },
    {
      key: "Article 51A(g)",
      value: "The Fundamental Duty to protect and improve the natural environment",
    },
    { key: "Ramsar Convention", value: "The 1971 treaty on the conservation of wetlands" },
    { key: "CITES", value: "The convention regulating international trade in endangered species" },
  ],
);

export const ENVIRONMENT_TEMPLATES = templates;
