/**
 * The last three senior secondary papers the bank was missing.
 *
 * Source: CBSE Senior Secondary Curriculum 2026-27, cbseacademic.nic.in —
 * English Core (301), Sociology (039) and Psychology (037). Each is 80
 * theory plus 20 internal assessment or practical.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const S11 = ["CBSE Class 11", "ISC Class 11", "CUET"];
const S12 = ["CBSE Class 12", "ISC Class 12", "CUET"];
const BOTH = [...new Set([...S11, ...S12])];

const templates: Template[] = [];
const eng = chapterFactory(templates, "English Core", BOTH);
const soc = chapterFactory(templates, "Sociology", BOTH);
const psy = chapterFactory(templates, "Psychology", BOTH);

eng(
  "ec:reading-writing",
  "Reading Comprehension and Writing Skills",
  "In the English Core paper, what is %s?",
  "%k is %v.",
  [
    {
      key: "Note making",
      value:
        "Recording the main and supporting points of a passage in an abbreviated, indented form",
    },
    {
      key: "Summary",
      value:
        "A condensed version of a passage in continuous prose, usually about a third of its length",
    },
    {
      key: "Notice",
      value:
        "A short formal announcement placed within a box, carrying the issuing body, date, heading and writer's name",
    },
    {
      key: "Classified advertisement",
      value:
        "A brief advertisement in a newspaper column, written in note form without complete sentences",
    },
    {
      key: "Formal invitation",
      value:
        "An invitation written in the third person, in the passive, without a signature and with the RSVP at the bottom left",
    },
    {
      key: "Letter to the editor",
      value: "A formal letter raising a public issue, addressed to the editor of a newspaper",
    },
    {
      key: "Job application",
      value: "A formal letter enclosing a curriculum vitae and stating the post applied for",
    },
    {
      key: "Report writing",
      value: "A factual account of an event written in the third person and the past tense",
    },
    {
      key: "Article writing",
      value:
        "A composition on a topic with a title, the writer's name, an introduction, body and conclusion",
    },
    {
      key: "Debate",
      value: "A formal argument for or against a motion, addressed to the chair and the audience",
    },
  ],
  [
    {
      key: "Difference between a summary and a precis",
      value:
        "A summary restates the main ideas in continuous prose, a precis compresses the whole passage to about a third while keeping its order, tone and proportion",
    },
    {
      key: "Reason a notice is written in the passive voice",
      value:
        "It is issued by an institution rather than a person, so the impersonal passive keeps the tone official and avoids naming an actor",
    },
    {
      key: "Difference between a formal and an informal invitation",
      value:
        "A formal invitation is in the third person, printed, with no signature and no salutation, an informal one is a personal letter in the first person",
    },
    {
      key: "Structure expected in an analytical article",
      value:
        "A title and byline, an opening that states the issue, a body that develops points with evidence, and a conclusion that offers a view or a suggestion",
    },
    {
      key: "Way inference questions differ from factual ones in comprehension",
      value:
        "A factual answer is stated in the passage, an inference must be drawn from what is implied but not written, so the answer has to be supported by the text without quoting it directly",
    },
  ],
);

soc(
  "soc:concepts-society",
  "Basic Concepts and Structures of Indian Society",
  "In sociology, what is %s?",
  "%k is %v.",
  [
    { key: "Sociology", value: "The systematic study of human society and social relationships" },
    {
      key: "Society",
      value: "A web of social relationships among people who share a culture and a territory",
    },
    {
      key: "Social group",
      value: "A collection of people who interact regularly and share a sense of belonging",
    },
    { key: "Primary group", value: "A small, intimate and face-to-face group such as the family" },
    {
      key: "Social stratification",
      value: "The structured ranking of groups in a society by wealth, power or status",
    },
    {
      key: "Caste",
      value:
        "A hereditary, endogamous group traditionally linked to an occupation and ranked in a ritual hierarchy",
    },
    {
      key: "Sanskritisation",
      value:
        "M. N. Srinivas's term for a lower caste adopting the customs of a higher caste to raise its status",
    },
    {
      key: "Westernisation",
      value:
        "Change in Indian society brought about by contact with the West in technology, institutions and values",
    },
    {
      key: "Demographic dividend",
      value:
        "The economic advantage of having a large share of the population in the working age group",
    },
    {
      key: "Social change",
      value: "Significant alteration in the social structure and patterns of behaviour over time",
    },
  ],
  [
    {
      key: "Difference between sociology and common sense",
      value:
        "Common sense rests on personal experience and is rarely questioned, sociology rests on systematic evidence, comparison and theory and is open to being disproved",
    },
    {
      key: "Sociological imagination",
      value:
        "C. Wright Mills's idea of connecting personal troubles to public issues, seeing an individual's difficulty as part of a wider social pattern",
    },
    {
      key: "Difference between caste and class",
      value:
        "Caste is ascribed at birth, closed and ritually ranked, class is achieved, open and based on economic position, so movement between classes is possible",
    },
    {
      key: "Reason Sanskritisation does not change the structure",
      value:
        "A group rises within the hierarchy by imitating those above it, but the hierarchy itself and the principle of ranking remain untouched",
    },
    {
      key: "Effect of urbanisation on the joint family",
      value:
        "Migration, small housing and wage employment favour the nuclear household, though kin ties often persist in obligation and support even when residence separates",
    },
  ],
);

psy(
  "psy:foundations",
  "Foundations of Psychology and Human Development",
  "In psychology, what is %s?",
  "%k is %v.",
  [
    { key: "Psychology", value: "The scientific study of mental processes and behaviour" },
    {
      key: "Structuralism",
      value:
        "Wundt's school, which analysed conscious experience into its elements through introspection",
    },
    {
      key: "Behaviourism",
      value: "Watson's school, which held that psychology should study only observable behaviour",
    },
    {
      key: "Psychoanalysis",
      value: "Freud's approach, which explains behaviour through unconscious conflicts",
    },
    {
      key: "Intelligence quotient",
      value: "Mental age divided by chronological age, multiplied by a hundred",
    },
    {
      key: "Theory of multiple intelligences",
      value:
        "Howard Gardner's view that intelligence is not one ability but several independent ones",
    },
    {
      key: "Triarchic theory of intelligence",
      value: "Robert Sternberg's theory of componential, experiential and contextual intelligence",
    },
    {
      key: "Personality",
      value:
        "The characteristic and relatively enduring pattern of thinking, feeling and behaving of an individual",
    },
    {
      key: "Stress",
      value:
        "The pattern of responses to events that threaten or challenge a person's capacity to cope",
    },
    { key: "Attitude", value: "A learned evaluative tendency towards an object, person or issue" },
  ],
  [
    {
      key: "Difference between a case study and an experiment",
      value:
        "A case study examines one individual in depth and yields rich detail but cannot establish cause, an experiment manipulates a variable under control and can establish cause but in an artificial setting",
    },
    {
      key: "Difference between the id, ego and superego",
      value:
        "The id seeks immediate gratification on the pleasure principle, the ego mediates with reality, and the superego holds the internalised moral standards",
    },
    {
      key: "Difference between eustress and distress",
      value:
        "Eustress is the positive stress that motivates and improves performance, distress is the harmful stress that exceeds coping capacity",
    },
    {
      key: "General Adaptation Syndrome",
      value:
        "Hans Selye's three-stage response to prolonged stress — alarm reaction, resistance and exhaustion",
    },
    {
      key: "Reason intelligence tests are criticised as culturally biased",
      value:
        "Items drawn from one culture's vocabulary and experience disadvantage those from another, so a low score may reflect unfamiliarity rather than lower ability",
    },
  ],
);

export const SCHOOL_EXTRA_TEMPLATES = templates;
