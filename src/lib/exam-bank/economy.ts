/**
 * Indian Economy — the General Studies economy section, as a full subject.
 *
 * Covers basic concepts, national income, money and banking, public finance,
 * planning and development, and external sector, matching the way SSC, banking,
 * railway, State PSC and UPSC papers actually set the section.
 */

import { type Template } from "./core";
import { BANKING, GK_WIDE, chapterFactory } from "./two-layer";

const templates: Template[] = [];
const ECO = [...new Set([...GK_WIDE, ...BANKING])];
const chapter = chapterFactory(templates, "Indian Economy", ECO);

chapter(
  "eco:basics",
  "Basic Concepts of Economics",
  "In basic economics, what is %s?",
  "%k is %v.",
  [
    { key: "Microeconomics", value: "The study of individual units such as a household or a firm" },
    {
      key: "Macroeconomics",
      value: "The study of the economy as a whole, such as national income and inflation",
    },
    { key: "Law of demand", value: "Other things equal, demand falls as price rises" },
    { key: "Law of supply", value: "Other things equal, supply rises as price rises" },
    { key: "Opportunity cost", value: "The value of the next best alternative given up" },
    { key: "Elastic demand", value: "Demand that changes more than proportionately with price" },
    { key: "Giffen goods", value: "Inferior goods whose demand rises when price rises" },
    { key: "Veblen goods", value: "Luxury goods bought more when they become costlier" },
    { key: "Mixed economy", value: "An economy with both public and private sectors, as in India" },
    {
      key: "Equilibrium price",
      value: "The price at which quantity demanded equals quantity supplied",
    },
  ],
  [
    {
      key: "Difference between change in demand and change in quantity demanded",
      value: "A change in demand shifts the curve; a change in quantity demanded moves along it",
    },
    {
      key: "Law of diminishing marginal utility",
      value: "Each additional unit consumed gives less extra satisfaction",
    },
    {
      key: "Production possibility curve",
      value:
        "A curve showing the maximum combinations of two goods producible with given resources",
    },
    {
      key: "Cross elasticity for substitutes",
      value: "Positive, because a rise in one good's price raises demand for the other",
    },
    {
      key: "Consumer surplus",
      value: "The difference between what a consumer is willing to pay and what is actually paid",
    },
  ],
);

chapter(
  "eco:national-income",
  "National Income and Growth",
  "In national income accounting, what is %s?",
  "%k is %v.",
  [
    {
      key: "GDP",
      value: "The market value of all final goods and services produced within a country in a year",
    },
    { key: "GNP", value: "GDP plus net factor income from abroad" },
    { key: "NNP", value: "GNP minus depreciation" },
    { key: "National income", value: "NNP at factor cost" },
    { key: "Per capita income", value: "National income divided by population" },
    { key: "Nominal GDP", value: "GDP measured at current prices" },
    { key: "Real GDP", value: "GDP measured at constant, base-year prices" },
    {
      key: "Body that estimates national income in India",
      value: "The National Statistical Office",
    },
    { key: "Base year of the current GDP series", value: "2011-12" },
    { key: "Primary sector", value: "Agriculture, forestry, fishing and mining" },
  ],
  [
    { key: "GDP deflator", value: "The ratio of nominal to real GDP, times one hundred" },
    {
      key: "Why GDP at market price exceeds GDP at factor cost",
      value: "It includes indirect taxes and excludes subsidies",
    },
    {
      key: "Gross Value Added",
      value:
        "Output less intermediate consumption, the production-side measure now headlined in India",
    },
    {
      key: "Who first estimated India's national income",
      value: "Dadabhai Naoroji, in Poverty and Un-British Rule in India",
    },
    { key: "Largest contributor to India's GDP", value: "The services sector" },
  ],
);

chapter(
  "eco:money-banking",
  "Money, Banking and Inflation",
  "In money and banking, what is %s?",
  "%k is %v.",
  [
    { key: "Central bank of India", value: "The Reserve Bank of India, established in 1935" },
    { key: "Repo rate", value: "The rate at which the RBI lends to banks against securities" },
    { key: "Reverse repo rate", value: "The rate at which the RBI absorbs liquidity from banks" },
    { key: "CRR", value: "The share of deposits banks keep as cash with the RBI" },
    {
      key: "SLR",
      value: "The share of deposits banks keep in liquid assets such as government securities",
    },
    { key: "Inflation", value: "A sustained rise in the general price level" },
    { key: "Deflation", value: "A sustained fall in the general price level" },
    { key: "CPI", value: "The Consumer Price Index, the RBI's headline inflation target measure" },
    { key: "WPI", value: "The Wholesale Price Index, which excludes services" },
    {
      key: "Legal tender in India",
      value: "Currency notes and coins issued under the RBI Act and Coinage Act",
    },
  ],
  [
    {
      key: "India's inflation target",
      value: "Four per cent CPI, with a band of plus or minus two per cent",
    },
    {
      key: "Monetary Policy Committee composition",
      value: "Six members, three from the RBI and three appointed by the government",
    },
    {
      key: "Stagflation",
      value: "High inflation together with stagnant growth and high unemployment",
    },
    {
      key: "Open market operations",
      value: "The RBI's purchase and sale of government securities to manage liquidity",
    },
    {
      key: "Difference between M1 and M3",
      value: "M1 is narrow money; M3 adds time deposits and is the broad money aggregate",
    },
  ],
);

chapter(
  "eco:public-finance",
  "Public Finance and Budget",
  "In public finance, what is %s?",
  "%k is %v.",
  [
    { key: "Fiscal deficit", value: "Total expenditure minus total receipts excluding borrowings" },
    { key: "Revenue deficit", value: "Revenue expenditure minus revenue receipts" },
    { key: "Primary deficit", value: "Fiscal deficit minus interest payments" },
    { key: "Direct tax", value: "A tax whose burden cannot be shifted, such as income tax" },
    { key: "Indirect tax", value: "A tax whose burden can be shifted, such as GST" },
    { key: "GST introduction date", value: "1 July 2017" },
    { key: "Constitutional amendment for GST", value: "The One Hundred and First Amendment" },
    { key: "GST Council chairperson", value: "The Union Finance Minister" },
    { key: "Finance Commission article", value: "Article 280" },
    {
      key: "Consolidated Fund of India",
      value: "The fund into which all government revenues and loans flow, under Article 266",
    },
  ],
  [
    {
      key: "FRBM Act",
      value: "The 2003 law setting fiscal deficit and debt targets for the Union",
    },
    {
      key: "Contingency Fund of India",
      value:
        "An imprest fund at the disposal of the President for urgent unforeseen spending, under Article 267",
    },
    {
      key: "Capital receipts",
      value:
        "Receipts that create a liability or reduce an asset, such as borrowings and disinvestment",
    },
    {
      key: "Difference between tax and cess",
      value: "A cess is levied for a specific purpose and is not shareable with the states",
    },
    {
      key: "Zero-based budgeting",
      value: "Budgeting in which every expenditure is justified afresh rather than incrementally",
    },
  ],
);

chapter(
  "eco:planning",
  "Planning, Poverty and Development",
  "On planning and development in India, what is %s?",
  "%k is %v.",
  [
    { key: "Planning Commission replacement", value: "NITI Aayog, from 1 January 2015" },
    { key: "First Five Year Plan focus", value: "Agriculture, based on the Harrod-Domar model" },
    { key: "Second Five Year Plan focus", value: "Heavy industry, on the Mahalanobis model" },
    { key: "Last Five Year Plan", value: "The Twelfth, which ended in 2017" },
    { key: "Economic reforms year", value: "1991, under P V Narasimha Rao and Manmohan Singh" },
    {
      key: "MGNREGA",
      value: "The 2005 law guaranteeing a hundred days of wage employment to a rural household",
    },
    {
      key: "Human Development Index components",
      value: "Life expectancy, education and per capita income",
    },
    { key: "Body that publishes the HDI", value: "The United Nations Development Programme" },
    {
      key: "Tendulkar Committee",
      value: "The committee that revised the poverty line methodology in 2009",
    },
    { key: "Gini coefficient", value: "A measure of income inequality between zero and one" },
  ],
  [
    { key: "LPG reforms", value: "Liberalisation, privatisation and globalisation, begun in 1991" },
    {
      key: "Rangarajan Committee",
      value: "The 2014 committee that raised the poverty line above the Tendulkar estimate",
    },
    {
      key: "Lorenz curve",
      value:
        "The curve plotting cumulative income against cumulative population to show inequality",
    },
    {
      key: "Disguised unemployment",
      value:
        "Employment where the marginal product of the extra worker is nearly zero, common in agriculture",
    },
    {
      key: "Demographic dividend",
      value: "The growth potential from a rising share of working-age population",
    },
  ],
);

chapter(
  "eco:external",
  "External Sector and International Bodies",
  "On the external sector, what is %s?",
  "%k is %v.",
  [
    { key: "Balance of trade", value: "The difference between merchandise exports and imports" },
    {
      key: "Balance of payments",
      value: "The record of all economic transactions with the rest of the world",
    },
    {
      key: "Current account",
      value: "The BoP account covering trade, services, income and transfers",
    },
    { key: "FDI", value: "Foreign direct investment, a lasting investment in an enterprise" },
    {
      key: "FPI",
      value: "Foreign portfolio investment in financial assets, which can leave quickly",
    },
    { key: "IMF headquarters", value: "Washington DC" },
    { key: "World Bank headquarters", value: "Washington DC" },
    { key: "WTO headquarters", value: "Geneva" },
    { key: "SDR", value: "Special Drawing Rights, the IMF's reserve asset" },
    { key: "Custodian of India's foreign exchange reserves", value: "The Reserve Bank of India" },
  ],
  [
    {
      key: "Devaluation versus depreciation",
      value:
        "Devaluation is a deliberate cut under a fixed rate; depreciation is a market fall under a floating rate",
    },
    { key: "FEMA", value: "The Foreign Exchange Management Act of 1999, which replaced FERA" },
    { key: "Bretton Woods institutions", value: "The IMF and the World Bank, founded in 1944" },
    { key: "Hard currency", value: "A widely accepted, stable currency such as the US dollar" },
    {
      key: "Current account convertibility in India",
      value: "Allowed since 1994; the capital account remains only partially convertible",
    },
  ],
);

export const ECONOMY_TEMPLATES = templates;
