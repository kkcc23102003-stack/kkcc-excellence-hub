/**
 * Geography — Physical, Indian and World, as three separate exam subjects.
 *
 * Every General Studies paper from SSC to UPSC splits geography this way,
 * so the chapters below follow the published section lists rather than one
 * lumped "Geography" topic.
 */

import { type Template } from "./core";
import { GK_WIDE, chapterFactory } from "./two-layer";

const templates: Template[] = [];

const phys = chapterFactory(templates, "Physical Geography", GK_WIDE);
const india = chapterFactory(templates, "Indian Geography", GK_WIDE);
const world = chapterFactory(templates, "World Geography", GK_WIDE);

/* ----------------------------------------------------- Physical */

phys(
  "geo:phy:universe",
  "Universe and Solar System",
  "In the universe and solar system, what is %s?",
  "%k is %v.",
  [
    { key: "Largest planet", value: "Jupiter" },
    { key: "Smallest planet", value: "Mercury" },
    { key: "Hottest planet", value: "Venus, because of its dense carbon dioxide atmosphere" },
    { key: "Red Planet", value: "Mars, from its iron oxide surface" },
    { key: "Planet with the most moons", value: "Saturn" },
    { key: "Nearest star to the Earth", value: "The Sun" },
    { key: "Time sunlight takes to reach the Earth", value: "About 8 minutes and 20 seconds" },
    { key: "Earth's only natural satellite", value: "The Moon" },
    { key: "Galaxy containing the solar system", value: "The Milky Way" },
    { key: "Dwarf planet demoted in 2006", value: "Pluto" },
  ],
  [
    {
      key: "Why Venus is hotter than Mercury",
      value: "A runaway greenhouse effect from its thick carbon dioxide atmosphere",
    },
    { key: "Asteroid belt location", value: "Between Mars and Jupiter" },
    {
      key: "Light year",
      value: "The distance light travels in one year, about 9.46 trillion kilometres",
    },
    {
      key: "Cause of the seasons",
      value: "The tilt of the Earth's axis at 23.5 degrees, not the distance from the Sun",
    },
    {
      key: "Perihelion and aphelion",
      value:
        "The nearest and farthest points of the Earth from the Sun, in early January and early July",
    },
  ],
);

phys(
  "geo:phy:lithosphere",
  "Interior of the Earth and Landforms",
  "In physical geography, what is %s?",
  "%k is %v.",
  [
    { key: "Layers of the Earth", value: "Crust, mantle and core" },
    { key: "Thickest layer of the Earth", value: "The mantle" },
    { key: "Mohorovicic discontinuity", value: "The boundary between the crust and the mantle" },
    {
      key: "Plate tectonics",
      value: "The theory that the lithosphere is broken into moving plates",
    },
    { key: "Fold mountains", value: "Mountains formed by compression, such as the Himalayas" },
    { key: "Volcano types", value: "Active, dormant and extinct" },
    { key: "Richter scale", value: "The scale measuring earthquake magnitude" },
    { key: "Seismograph", value: "The instrument that records earthquake waves" },
    {
      key: "Focus and epicentre",
      value: "The point of origin inside the Earth and the point vertically above it",
    },
    { key: "Igneous rock", value: "Rock formed by the cooling of magma or lava" },
  ],
  [
    {
      key: "Waves that cannot pass through liquid",
      value: "S waves, which is how the liquid outer core was inferred",
    },
    {
      key: "Ring of Fire",
      value: "The Pacific rim belt of earthquakes and volcanoes along subduction zones",
    },
    {
      key: "Sial, sima and nife",
      value: "The silica-alumina crust, silica-magnesium layer and nickel-iron core",
    },
    { key: "Metamorphic rock examples", value: "Marble from limestone and slate from shale" },
    { key: "Continental drift proponent", value: "Alfred Wegener, who proposed Pangaea in 1912" },
  ],
);

phys(
  "geo:phy:atmosphere",
  "Atmosphere and Climate",
  "In the atmosphere and climatology, what is %s?",
  "%k is %v.",
  [
    { key: "Lowest layer of the atmosphere", value: "The troposphere, where weather occurs" },
    { key: "Layer containing the ozone", value: "The stratosphere" },
    { key: "Layer where meteors burn", value: "The mesosphere" },
    { key: "Most abundant atmospheric gas", value: "Nitrogen, about 78 per cent" },
    { key: "Instrument for atmospheric pressure", value: "The barometer" },
    { key: "Instrument for humidity", value: "The hygrometer" },
    { key: "Instrument for wind speed", value: "The anemometer" },
    {
      key: "Trade winds",
      value: "Steady winds blowing from the subtropical highs towards the equator",
    },
    { key: "Isobar", value: "A line joining places of equal atmospheric pressure" },
    { key: "Cyclone", value: "A low pressure system with inward spiralling winds" },
  ],
  [
    {
      key: "Coriolis effect",
      value:
        "The deflection of winds by the Earth's rotation, right in the north and left in the south",
    },
    {
      key: "Inversion of temperature",
      value: "A condition in which temperature rises with height, trapping fog and pollutants",
    },
    { key: "El Nino", value: "The warming of the eastern Pacific that weakens the Indian monsoon" },
    {
      key: "Jet stream",
      value: "A narrow band of fast upper-air westerlies that steers weather systems",
    },
    { key: "Types of rainfall", value: "Convectional, orographic and cyclonic" },
  ],
);

phys(
  "geo:phy:oceanography",
  "Oceanography",
  "In oceanography, what is %s?",
  "%k is %v.",
  [
    { key: "Largest ocean", value: "The Pacific Ocean" },
    { key: "Deepest point of the ocean", value: "The Challenger Deep in the Mariana Trench" },
    { key: "Average ocean salinity", value: "About 35 parts per thousand" },
    { key: "Saltiest sea", value: "The Dead Sea, which is a lake" },
    { key: "Cause of tides", value: "The gravitational pull of the Moon and the Sun" },
    { key: "Spring tide", value: "The highest tide, at new moon and full moon" },
    { key: "Neap tide", value: "The lowest tide, at the first and third quarters" },
    {
      key: "Continental shelf",
      value: "The shallow submerged margin of a continent, richest in fish",
    },
    { key: "Gulf Stream", value: "The warm current of the North Atlantic" },
    { key: "Coral reef requirement", value: "Warm, shallow, clear and salty water" },
  ],
  [
    {
      key: "Why Grand Banks is a rich fishery",
      value: "The meeting of the warm Gulf Stream and the cold Labrador Current",
    },
    { key: "Thermocline", value: "The ocean layer of rapid temperature decrease with depth" },
    { key: "Upwelling", value: "The rise of cold nutrient-rich water, as off the Peruvian coast" },
    {
      key: "Tsunami cause",
      value: "Submarine earthquakes, landslides or volcanic eruptions, not winds",
    },
    {
      key: "Coral bleaching",
      value: "Loss of symbiotic algae due to warming, leaving corals white",
    },
  ],
);

/* --------------------------------------------------------- Indian */

india(
  "geo:ind:physiography",
  "Physiography of India",
  "In the physiography of India, what is %s?",
  "%k is %v.",
  [
    { key: "Highest peak in India", value: "Kangchenjunga, in Sikkim" },
    { key: "Southernmost point of India", value: "Indira Point, in the Nicobar Islands" },
    { key: "Longest mountain range in India", value: "The Himalayas" },
    { key: "Northernmost Himalayan range", value: "The Trans-Himalaya, including the Karakoram" },
    { key: "Western Ghats highest peak", value: "Anaimudi, in Kerala" },
    { key: "Largest plateau of India", value: "The Deccan Plateau" },
    { key: "Thar Desert location", value: "Western Rajasthan" },
    {
      key: "Largest delta in the world",
      value: "The Sundarbans delta of the Ganga and Brahmaputra",
    },
    { key: "Number of states in India", value: "Twenty eight" },
    { key: "State with the longest coastline", value: "Gujarat" },
  ],
  [
    {
      key: "Duns",
      value: "Longitudinal valleys between the Lesser Himalaya and the Shiwaliks, such as Dehradun",
    },
    {
      key: "Bhabar and Terai",
      value: "The pebbly porous belt and the marshy belt below it in the northern plain",
    },
    {
      key: "Khadar and Bhangar",
      value: "The newer flood-plain alluvium and the older terrace alluvium",
    },
    {
      key: "Palghat gap",
      value: "The major gap in the Western Ghats linking Kerala and Tamil Nadu",
    },
    {
      key: "Difference between Eastern and Western Ghats",
      value: "The Western Ghats are continuous and higher; the Eastern Ghats are broken by rivers",
    },
  ],
);

india(
  "geo:ind:rivers",
  "Drainage System of India",
  "In India's drainage system, what is %s?",
  "%k is %v.",
  [
    { key: "Longest river in India", value: "The Ganga" },
    { key: "Source of the Ganga", value: "The Gangotri glacier, as the Bhagirathi" },
    { key: "Largest river basin of India", value: "The Ganga basin" },
    { key: "Brahmaputra in Tibet", value: "Called the Tsangpo" },
    { key: "Longest peninsular river", value: "The Godavari, called the Dakshin Ganga" },
    {
      key: "Rivers flowing into the Arabian Sea",
      value: "The Narmada and the Tapi, through rift valleys",
    },
    { key: "Sutlej source", value: "Rakas Lake near Mansarovar in Tibet" },
    { key: "Chenab formation", value: "The confluence of the Chandra and Bhaga at Tandi" },
    { key: "Indus tributaries in Punjab", value: "The Jhelum, Chenab, Ravi, Beas and Sutlej" },
    { key: "Largest freshwater lake in India", value: "Wular Lake, in Jammu and Kashmir" },
  ],
  [
    {
      key: "Why the Narmada and Tapi form estuaries",
      value:
        "They flow through rift valleys with a steep gradient and carry little silt to the mouth",
    },
    {
      key: "Antecedent rivers of the Himalaya",
      value: "The Indus, Sutlej and Brahmaputra, older than the mountains they cut through",
    },
    {
      key: "Indus Waters Treaty allocation",
      value: "Eastern rivers to India, western rivers largely to Pakistan, signed in 1960",
    },
    {
      key: "Peninsular drainage divide",
      value: "The Western Ghats, which separate the Arabian Sea and Bay of Bengal drainage",
    },
    {
      key: "Loktak Lake",
      value: "The largest freshwater lake of the north-east, in Manipur, with floating phumdis",
    },
  ],
);

india(
  "geo:ind:climate-soil",
  "Climate, Soil and Vegetation of India",
  "On India's climate, soils and vegetation, what is %s?",
  "%k is %v.",
  [
    { key: "Type of climate in India", value: "Tropical monsoon" },
    { key: "Onset of the south-west monsoon", value: "Kerala, around the first of June" },
    { key: "Wettest place in India", value: "Mawsynram in Meghalaya" },
    { key: "Retreating monsoon rainfall region", value: "The Coromandel coast of Tamil Nadu" },
    { key: "Most widespread soil of India", value: "Alluvial soil" },
    { key: "Soil best for cotton", value: "Black soil, or regur" },
    {
      key: "Laterite soil region",
      value: "Areas of heavy rain and high temperature, such as the Western Ghats",
    },
    {
      key: "Tropical evergreen forest region",
      value:
        "Areas with over 200 centimetres of rain, such as the Western Ghats and the north-east",
    },
    { key: "Most widespread forest type in India", value: "Tropical deciduous, or monsoon forest" },
    { key: "Mangrove forest of India", value: "The Sundarbans" },
  ],
  [
    {
      key: "Mango showers",
      value: "Pre-monsoon showers of Kerala and Karnataka that help ripen mangoes",
    },
    { key: "Kalbaisakhi", value: "Violent pre-monsoon thunderstorms of Bengal and Assam" },
    { key: "Loo", value: "The hot dry wind of the northern plains in May and June" },
    {
      key: "Why Tamil Nadu is dry in the south-west monsoon",
      value: "It lies in the rain shadow of the Western Ghats and parallel to the Bay branch",
    },
    {
      key: "Western disturbances",
      value: "Mediterranean-origin systems bringing winter rain to north-west India",
    },
  ],
);

india(
  "geo:ind:resources",
  "Agriculture, Minerals and Industry",
  "On India's resources and economy geography, what is %s?",
  "%k is %v.",
  [
    { key: "Largest producer of wheat in India", value: "Uttar Pradesh" },
    { key: "Largest producer of rice in India", value: "West Bengal" },
    { key: "Largest producer of sugarcane in India", value: "Uttar Pradesh" },
    { key: "Largest producer of cotton in India", value: "Gujarat" },
    { key: "Largest producer of tea in India", value: "Assam" },
    { key: "Largest coal producing state", value: "Jharkhand" },
    { key: "Largest iron ore producing state", value: "Odisha" },
    { key: "Leading oil field of India", value: "Mumbai High" },
    { key: "Green Revolution crop", value: "Mainly wheat, from the mid nineteen sixties" },
    { key: "Busiest port of India by traffic", value: "Deendayal, formerly Kandla, in Gujarat" },
  ],
  [
    {
      key: "Why Chhota Nagpur is the mineral heart of India",
      value: "It has coal, iron ore, mica, bauxite and copper together in one plateau belt",
    },
    {
      key: "Operation Flood",
      value: "The dairy programme led by Verghese Kurien that made India the largest milk producer",
    },
    { key: "Blue Revolution", value: "The programme for fisheries and aquaculture development" },
    { key: "Jhum cultivation", value: "Shifting cultivation practised in the north-eastern hills" },
    {
      key: "Golden Quadrilateral",
      value: "The national highway network linking Delhi, Mumbai, Chennai and Kolkata",
    },
  ],
);

/* ---------------------------------------------------------- World */

world(
  "geo:wor:continents",
  "Continents, Countries and Capitals",
  "In world geography, what is %s?",
  "%k is %v.",
  [
    { key: "Largest continent", value: "Asia" },
    { key: "Smallest continent", value: "Australia" },
    { key: "Largest country by area", value: "Russia" },
    { key: "Smallest country in the world", value: "Vatican City" },
    { key: "Country with the largest population", value: "India" },
    { key: "Longest river in the world", value: "The Nile, by conventional measure" },
    { key: "Highest mountain in the world", value: "Mount Everest" },
    { key: "Largest desert in the world", value: "The Sahara, among hot deserts" },
    { key: "Largest island in the world", value: "Greenland" },
    { key: "Deepest lake in the world", value: "Lake Baikal, in Russia" },
  ],
  [
    {
      key: "Country spanning the most time zones",
      value: "France, counting its overseas territories",
    },
    { key: "Strait separating Asia and North America", value: "The Bering Strait" },
    { key: "Landlocked country surrounded by one country", value: "Lesotho, inside South Africa" },
    { key: "Line dividing North and South Korea", value: "The 38th parallel" },
    { key: "Line between India and China", value: "The McMahon Line" },
  ],
);

world(
  "geo:wor:regions",
  "World Climate, Grasslands and Resources",
  "On world regions and resources, what is %s?",
  "%k is %v.",
  [
    { key: "Prairies", value: "The temperate grasslands of North America" },
    { key: "Pampas", value: "The temperate grasslands of Argentina" },
    { key: "Steppes", value: "The temperate grasslands of Eurasia" },
    { key: "Velds", value: "The temperate grasslands of South Africa" },
    { key: "Downs", value: "The temperate grasslands of Australia" },
    { key: "Savanna", value: "The tropical grassland of Africa" },
    { key: "Tundra", value: "The cold treeless region of the high latitudes" },
    { key: "Taiga", value: "The coniferous forest belt of the northern high latitudes" },
    { key: "Mediterranean climate crop", value: "Citrus fruit, olives and grapes" },
    { key: "Largest producer of crude oil", value: "The United States" },
  ],
  [
    {
      key: "Chinook",
      value: "The warm dry wind of the Rockies that clears snow from the prairies",
    },
    { key: "Harmattan", value: "The hot dry dust-laden wind of West Africa" },
    { key: "Mistral", value: "The cold north wind that blows down the Rhone valley" },
    {
      key: "Why the west coasts of continents in the thirties are deserts",
      value: "Descending subtropical high pressure air and cold offshore currents",
    },
    {
      key: "Great Barrier Reef",
      value: "The world's largest coral reef system, off Queensland, Australia",
    },
  ],
);

export const GEOGRAPHY_TEMPLATES = templates;
