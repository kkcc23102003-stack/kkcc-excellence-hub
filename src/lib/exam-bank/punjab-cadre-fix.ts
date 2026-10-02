/**
 * Corrections after checking the real Education Recruitment Board Punjab
 * syllabus documents.
 *
 * Punjabi Paper A is the qualifying language paper for the ETT cadre, the
 * Master cadre and the Lecturer cadre. Its syllabus is a linguistics paper —
 * language and dialect, the Gurmukhi script, phonology, morphology, semantics
 * and spelling — plus a literature part on the Gurus and on Punjabi folklore
 * and culture. Those chapters were missing.
 *
 * Master Cadre is recruited in eight subjects, not six. Physical Education
 * (DPE) and Art and Craft are real Master Cadre subjects and had no bank
 * content at all.
 */

import { type Template } from "./core";
import { chapterFactory } from "./two-layer";

const CADRE = [
  "Punjab ETT Cadre",
  "Punjab Master Cadre",
  "Punjab Lecturer Cadre",
  "PSTET/CTET",
  "State Teacher/TET",
  "PSSSB",
  "Punjab Clerk",
];
const MASTER = ["Punjab Master Cadre", "Punjab Lecturer Cadre", "State Teacher/TET"];

const templates: Template[] = [];
const pa = chapterFactory(templates, "Punjabi Paper A", CADRE);
const lit = chapterFactory(templates, "Punjabi Literature", CADRE);
const pe = chapterFactory(templates, "Physical Education", MASTER);
const art = chapterFactory(templates, "Art and Craft", MASTER);

/* ============================================ Punjabi Paper A ========== */

pa(
  "pa:bhasha-upbhasha",
  "ਭਾਸ਼ਾ ਅਤੇ ਉਪਭਾਸ਼ਾ",
  "ਭਾਸ਼ਾ ਵਿਗਿਆਨ ਅਨੁਸਾਰ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਭਾਸ਼ਾ", value: "ਮਨੁੱਖ ਦੁਆਰਾ ਵਰਤੀ ਜਾਣ ਵਾਲੀ ਯਾਦ੍ਰਿਛਿਕ ਧੁਨੀ ਪ੍ਰਤੀਕਾਂ ਦੀ ਵਿਵਸਥਾ" },
    {
      key: "ਉਪਭਾਸ਼ਾ",
      value: "ਕਿਸੇ ਭਾਸ਼ਾ ਦਾ ਉਹ ਖੇਤਰੀ ਰੂਪ ਜਿਸ ਵਿੱਚ ਉਚਾਰਨ ਤੇ ਸ਼ਬਦਾਵਲੀ ਦਾ ਅੰਤਰ ਹੁੰਦਾ ਹੈ",
    },
    { key: "ਟਕਸਾਲੀ ਪੰਜਾਬੀ", value: "ਮਾਝੀ ਉਪਭਾਸ਼ਾ ਉੱਤੇ ਆਧਾਰਿਤ ਪੰਜਾਬੀ ਦਾ ਪ੍ਰਮਾਣਿਕ ਰੂਪ" },
    { key: "ਮਾਝੀ", value: "ਅੰਮ੍ਰਿਤਸਰ, ਗੁਰਦਾਸਪੁਰ ਅਤੇ ਤਰਨਤਾਰਨ ਦੇ ਮਾਝਾ ਖੇਤਰ ਦੀ ਉਪਭਾਸ਼ਾ" },
    { key: "ਮਲਵਈ", value: "ਲੁਧਿਆਣਾ, ਪਟਿਆਲਾ, ਬਠਿੰਡਾ ਅਤੇ ਸੰਗਰੂਰ ਦੇ ਮਾਲਵਾ ਖੇਤਰ ਦੀ ਉਪਭਾਸ਼ਾ" },
    { key: "ਦੁਆਬੀ", value: "ਜਲੰਧਰ, ਹੁਸ਼ਿਆਰਪੁਰ ਅਤੇ ਕਪੂਰਥਲਾ ਦੇ ਦੁਆਬਾ ਖੇਤਰ ਦੀ ਉਪਭਾਸ਼ਾ" },
    { key: "ਪੁਆਧੀ", value: "ਰੂਪਨਗਰ, ਫ਼ਤਿਹਗੜ੍ਹ ਸਾਹਿਬ ਅਤੇ ਅੰਬਾਲਾ ਵੱਲ ਦੇ ਪੁਆਧ ਖੇਤਰ ਦੀ ਉਪਭਾਸ਼ਾ" },
    { key: "ਪੋਠੋਹਾਰੀ", value: "ਰਾਵਲਪਿੰਡੀ ਵੱਲ ਦੇ ਪੋਠੋਹਾਰ ਖੇਤਰ ਦੀ ਪੱਛਮੀ ਉਪਭਾਸ਼ਾ" },
    { key: "ਪੰਜਾਬੀ ਦਾ ਭਾਸ਼ਾ ਪਰਿਵਾਰ", value: "ਭਾਰਤੀ ਆਰੀਆ ਪਰਿਵਾਰ ਦੀ ਨਵੀਨ ਭਾਰਤੀ ਆਰੀਆ ਸ਼ਾਖਾ" },
    { key: "ਪੰਜਾਬੀ ਦਾ ਵਿਕਾਸ ਸਰੋਤ", value: "ਸ਼ੌਰਸੈਨੀ ਅਪਭ੍ਰੰਸ਼" },
  ],
  [
    {
      key: "ਭਾਸ਼ਾ ਅਤੇ ਉਪਭਾਸ਼ਾ ਵਿੱਚ ਅੰਤਰ",
      value:
        "ਭਾਸ਼ਾ ਦਾ ਲਿਖਤੀ ਸਾਹਿਤ ਤੇ ਪ੍ਰਮਾਣਿਕ ਰੂਪ ਹੁੰਦਾ ਹੈ ਜਦਕਿ ਉਪਭਾਸ਼ਾ ਸੀਮਤ ਖੇਤਰ ਦੀ ਬੋਲੀ ਹੁੰਦੀ ਹੈ",
    },
    {
      key: "ਭਾਸ਼ਾ ਦੀ ਯਾਦ੍ਰਿਛਿਕਤਾ",
      value: "ਸ਼ਬਦ ਅਤੇ ਉਸ ਦੇ ਅਰਥ ਵਿਚਕਾਰ ਕੋਈ ਕੁਦਰਤੀ ਸੰਬੰਧ ਨਹੀਂ ਹੁੰਦਾ, ਇਹ ਸਮਾਜਿਕ ਸਹਿਮਤੀ ਹੈ",
    },
    { key: "ਪੰਜਾਬੀ ਨੂੰ ਰਾਜ ਭਾਸ਼ਾ ਦਾ ਦਰਜਾ", value: "ਪੰਜਾਬ ਰਾਜ ਭਾਸ਼ਾ ਐਕਟ 1967 ਅਧੀਨ ਦਿੱਤਾ ਗਿਆ" },
    { key: "ਉਪਭਾਸ਼ਾ ਦੇ ਨਿਖੇੜ ਦਾ ਆਧਾਰ", value: "ਧੁਨੀਆਤਮਕ, ਰੂਪਾਤਮਕ ਅਤੇ ਸ਼ਬਦਾਵਲੀ ਦੇ ਭੇਦ" },
    { key: "ਭਾਸ਼ਾ ਦੀ ਸਿਰਜਣਾਤਮਕਤਾ", value: "ਸੀਮਤ ਨਿਯਮਾਂ ਤੋਂ ਅਸੀਮਤ ਵਾਕ ਬਣਾਉਣ ਦੀ ਸਮਰੱਥਾ" },
  ],
);

pa(
  "pa:gurmukhi-lipi",
  "ਲਿਪੀ ਅਤੇ ਗੁਰਮੁਖੀ ਲਿਪੀ",
  "ਗੁਰਮੁਖੀ ਲਿਪੀ ਬਾਰੇ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਲਿਪੀ", value: "ਭਾਸ਼ਾ ਦੀਆਂ ਧੁਨੀਆਂ ਨੂੰ ਲਿਖਤੀ ਰੂਪ ਦੇਣ ਵਾਲੀ ਚਿੰਨ੍ਹ ਪ੍ਰਣਾਲੀ" },
    { key: "ਗੁਰਮੁਖੀ ਲਿਪੀ ਨੂੰ ਵਿਵਸਥਿਤ ਕਰਨ ਵਾਲੇ", value: "ਸ੍ਰੀ ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ" },
    { key: "ਗੁਰਮੁਖੀ ਵਰਣਮਾਲਾ ਦੇ ਅੱਖਰ", value: "ਪੈਂਤੀ ਅੱਖਰ, ਜਿਨ੍ਹਾਂ ਨੂੰ ਪੈਂਤੀ ਅੱਖਰੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ" },
    { key: "ਗੁਰਮੁਖੀ ਦੇ ਪਹਿਲੇ ਤਿੰਨ ਅੱਖਰ", value: "ਊੜਾ, ਐੜਾ ਅਤੇ ਈੜੀ, ਜੋ ਸਵਰ ਵਾਹਕ ਹਨ" },
    { key: "ਲਗਾਂ ਮਾਤਰਾਂ ਦੀ ਗਿਣਤੀ", value: "ਦਸ ਲਗਾਂ ਮਾਤਰਾਂ" },
    { key: "ਪੈਰ ਬਿੰਦੀ ਵਾਲੇ ਅੱਖਰ", value: "ਸ਼, ਖ਼, ਗ਼, ਜ਼, ਫ਼ ਅਤੇ ਲ਼" },
    { key: "ਟਿੱਪੀ ਅਤੇ ਬਿੰਦੀ", value: "ਨਾਸਿਕ ਧੁਨੀ ਪ੍ਰਗਟਾਉਣ ਵਾਲੇ ਚਿੰਨ੍ਹ" },
    { key: "ਅੱਧਕ", value: "ਅਗਲੇ ਵਿਅੰਜਨ ਨੂੰ ਦੁੱਤ ਕਰਨ ਵਾਲਾ ਚਿੰਨ੍ਹ, ਜਿਵੇਂ ਪੱਕਾ ਵਿੱਚ" },
    { key: "ਪੈਰ ਵਿੱਚ ਪੈਣ ਵਾਲੇ ਅੱਖਰ", value: "ਹ, ਰ ਅਤੇ ਵ" },
    { key: "ਗੁਰਮੁਖੀ ਦੀ ਲਿਖਣ ਦਿਸ਼ਾ", value: "ਖੱਬੇ ਤੋਂ ਸੱਜੇ" },
  ],
  [
    { key: "ਗੁਰਮੁਖੀ ਨਾਂ ਦਾ ਅਰਥ", value: "ਗੁਰੂ ਦੇ ਮੁਖ ਤੋਂ ਨਿਕਲੀ ਬਾਣੀ ਨੂੰ ਲਿਖਣ ਵਾਲੀ ਲਿਪੀ" },
    { key: "ਗੁਰਮੁਖੀ ਦਾ ਵਿਕਾਸ ਸਰੋਤ", value: "ਬ੍ਰਾਹਮੀ ਤੋਂ ਸ਼ਾਰਦਾ ਅਤੇ ਫਿਰ ਲੰਡੇ ਜਾਂ ਟਾਕਰੀ ਰਾਹੀਂ" },
    {
      key: "ਗੁਰਮੁਖੀ ਦੀ ਧੁਨੀਆਤਮਕ ਵਿਸ਼ੇਸ਼ਤਾ",
      value: "ਇਹ ਲਗਭਗ ਇੱਕ ਧੁਨੀ ਲਈ ਇੱਕ ਚਿੰਨ੍ਹ ਵਾਲੀ ਵਿਗਿਆਨਕ ਲਿਪੀ ਹੈ",
    },
    { key: "ਸੁਰ ਅੰਕਿਤ ਕਰਨ ਵਾਲੇ ਅੱਖਰ", value: "ਘ, ਝ, ਢ, ਧ ਅਤੇ ਭ, ਜੋ ਪੰਜਾਬੀ ਵਿੱਚ ਸੁਰ ਪੈਦਾ ਕਰਦੇ ਹਨ" },
    { key: "ਲੰਡੇ ਲਿਪੀ", value: "ਵਪਾਰੀਆਂ ਦੀ ਸੰਖੇਪ ਲਿਪੀ ਜਿਸ ਵਿੱਚ ਲਗਾਂ ਮਾਤਰਾਂ ਨਹੀਂ ਸਨ" },
  ],
);

pa(
  "pa:dhuni-vigyan",
  "ਧੁਨੀ ਵਿਗਿਆਨ",
  "ਪੰਜਾਬੀ ਧੁਨੀ ਵਿਗਿਆਨ ਵਿੱਚ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਧੁਨੀ ਵਿਗਿਆਨ", value: "ਭਾਸ਼ਾ ਦੀਆਂ ਧੁਨੀਆਂ ਦੇ ਉਚਾਰਨ ਅਤੇ ਵਰਗੀਕਰਨ ਦਾ ਅਧਿਐਨ" },
    { key: "ਸਵਰ", value: "ਉਹ ਧੁਨੀ ਜਿਸ ਦੇ ਉਚਾਰਨ ਵਿੱਚ ਹਵਾ ਬਿਨਾਂ ਰੁਕਾਵਟ ਬਾਹਰ ਨਿਕਲਦੀ ਹੈ" },
    { key: "ਵਿਅੰਜਨ", value: "ਉਹ ਧੁਨੀ ਜਿਸ ਦੇ ਉਚਾਰਨ ਵਿੱਚ ਹਵਾ ਨੂੰ ਕਿਤੇ ਰੁਕਾਵਟ ਮਿਲਦੀ ਹੈ" },
    { key: "ਪੰਜਾਬੀ ਦੇ ਸਵਰਾਂ ਦੀ ਗਿਣਤੀ", value: "ਦਸ ਸਵਰ" },
    { key: "ਉਚਾਰਨ ਅੰਗ", value: "ਬੁੱਲ੍ਹ, ਦੰਦ, ਜੀਭ, ਤਾਲੂ ਅਤੇ ਕੰਠ" },
    { key: "ਕੰਠੀ ਧੁਨੀਆਂ", value: "ਕ, ਖ, ਗ, ਘ ਅਤੇ ਙ" },
    { key: "ਦੰਤੀ ਧੁਨੀਆਂ", value: "ਤ, ਥ, ਦ, ਧ ਅਤੇ ਨ" },
    { key: "ਦੋਸ਼ਟੀ ਧੁਨੀਆਂ", value: "ਪ, ਫ, ਬ, ਭ ਅਤੇ ਮ" },
    { key: "ਨਾਸਿਕ ਧੁਨੀਆਂ", value: "ਙ, ਞ, ਣ, ਨ ਅਤੇ ਮ" },
    { key: "ਸੁਰ", value: "ਉਚਾਰਨ ਵਿੱਚ ਅਵਾਜ਼ ਦਾ ਉਤਰਾਅ ਚੜ੍ਹਾਅ ਜੋ ਅਰਥ ਬਦਲ ਦਿੰਦਾ ਹੈ" },
  ],
  [
    {
      key: "ਪੰਜਾਬੀ ਦੀ ਸੁਰ ਵਾਲੀ ਵਿਸ਼ੇਸ਼ਤਾ",
      value: "ਪੰਜਾਬੀ ਭਾਰਤੀ ਆਰੀਆ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚੋਂ ਇੱਕੋ ਇੱਕ ਸੁਰ ਵਾਲੀ ਭਾਸ਼ਾ ਹੈ",
    },
    { key: "ਤਿੰਨ ਸੁਰਾਂ", value: "ਉੱਚੀ ਸੁਰ, ਨੀਵੀਂ ਸੁਰ ਅਤੇ ਸਮ ਸੁਰ" },
    { key: "ਧੁਨੀਗ੍ਰਾਮ", value: "ਉਹ ਨਿੱਕੀ ਤੋਂ ਨਿੱਕੀ ਧੁਨੀ ਇਕਾਈ ਜੋ ਅਰਥ ਵਿੱਚ ਭੇਦ ਪੈਦਾ ਕਰਦੀ ਹੈ" },
    { key: "ਅਲਪ ਪ੍ਰਾਣ ਅਤੇ ਮਹਾਂ ਪ੍ਰਾਣ", value: "ਘੱਟ ਹਵਾ ਨਾਲ ਅਤੇ ਵੱਧ ਹਵਾ ਨਾਲ ਉਚਾਰੀ ਜਾਣ ਵਾਲੀ ਧੁਨੀ" },
    {
      key: "ਸਘੋਸ਼ ਅਤੇ ਅਘੋਸ਼",
      value: "ਜਿਸ ਦੇ ਉਚਾਰਨ ਵਿੱਚ ਸੁਰ ਤੰਤਰੀਆਂ ਕੰਬਦੀਆਂ ਹਨ ਅਤੇ ਜਿਸ ਵਿੱਚ ਨਹੀਂ ਕੰਬਦੀਆਂ",
    },
  ],
);

pa(
  "pa:arth-vigyan",
  "ਅਰਥ ਵਿਗਿਆਨ ਅਤੇ ਸ਼ਬਦ ਜੋੜ",
  "ਅਰਥ ਵਿਗਿਆਨ ਅਤੇ ਸ਼ਬਦ ਜੋੜਾਂ ਵਿੱਚ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਅਰਥ ਵਿਗਿਆਨ", value: "ਸ਼ਬਦਾਂ ਅਤੇ ਵਾਕਾਂ ਦੇ ਅਰਥਾਂ ਦਾ ਵਿਗਿਆਨਕ ਅਧਿਐਨ" },
    { key: "ਬਹੁ ਅਰਥਕ ਸ਼ਬਦ", value: "ਉਹ ਸ਼ਬਦ ਜਿਸ ਦੇ ਇੱਕ ਤੋਂ ਵੱਧ ਅਰਥ ਹੋਣ" },
    { key: "ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ", value: "ਉਹ ਸ਼ਬਦ ਜਿਨ੍ਹਾਂ ਦੇ ਅਰਥ ਇੱਕੋ ਜਿਹੇ ਹੋਣ" },
    { key: "ਵਿਰੋਧੀ ਸ਼ਬਦ", value: "ਉਹ ਸ਼ਬਦ ਜਿਨ੍ਹਾਂ ਦੇ ਅਰਥ ਉਲਟ ਹੋਣ" },
    { key: "ਸਮਰੂਪ ਭਿੰਨਾਰਥਕ ਸ਼ਬਦ", value: "ਉਹ ਸ਼ਬਦ ਜੋ ਸੁਣਨ ਵਿੱਚ ਮਿਲਦੇ ਜੁਲਦੇ ਪਰ ਅਰਥ ਵਿੱਚ ਵੱਖਰੇ ਹੋਣ" },
    { key: "ਇੱਕ ਸ਼ਬਦ ਬਦਲੇ ਵਾਕੰਸ਼", value: "ਪੂਰੇ ਵਾਕੰਸ਼ ਦੀ ਥਾਂ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਇੱਕ ਸ਼ਬਦ" },
    { key: "ਸ਼ਬਦ ਜੋੜ", value: "ਸ਼ਬਦ ਨੂੰ ਸ਼ੁੱਧ ਰੂਪ ਵਿੱਚ ਲਿਖਣ ਦਾ ਨਿਯਮ" },
    { key: "ਅਰਥ ਸੰਕੋਚ", value: "ਸਮੇਂ ਨਾਲ ਸ਼ਬਦ ਦੇ ਅਰਥ ਖੇਤਰ ਦਾ ਸੀਮਤ ਹੋ ਜਾਣਾ" },
    { key: "ਅਰਥ ਵਿਸਤਾਰ", value: "ਸਮੇਂ ਨਾਲ ਸ਼ਬਦ ਦੇ ਅਰਥ ਖੇਤਰ ਦਾ ਵਧ ਜਾਣਾ" },
    { key: "ਤਤਸਮ ਸ਼ਬਦ", value: "ਸੰਸਕ੍ਰਿਤ ਤੋਂ ਜਿਉਂ ਦਾ ਤਿਉਂ ਲਿਆ ਗਿਆ ਸ਼ਬਦ" },
  ],
  [
    { key: "ਤਦਭਵ ਸ਼ਬਦ", value: "ਸੰਸਕ੍ਰਿਤ ਤੋਂ ਵਿਗੜ ਕੇ ਬਣਿਆ ਸ਼ਬਦ, ਜਿਵੇਂ ਹੱਥ ਹਸਤ ਤੋਂ" },
    {
      key: "ਦੇਸੀ ਸ਼ਬਦ",
      value: "ਉਹ ਸ਼ਬਦ ਜਿਸ ਦਾ ਸਰੋਤ ਸੰਸਕ੍ਰਿਤ ਜਾਂ ਵਿਦੇਸ਼ੀ ਭਾਸ਼ਾ ਨਹੀਂ, ਸਗੋਂ ਸਥਾਨਕ ਹੈ",
    },
    { key: "ਅਰਥ ਅਪਕਰਸ਼", value: "ਸ਼ਬਦ ਦੇ ਅਰਥ ਦਾ ਨੀਵੇਂ ਦਰਜੇ ਵੱਲ ਬਦਲ ਜਾਣਾ" },
    {
      key: "ਸ਼ਬਦ ਜੋੜਾਂ ਵਿੱਚ ਅੱਧਕ ਦਾ ਨਿਯਮ",
      value: "ਦੁੱਤ ਵਿਅੰਜਨ ਦੀ ਥਾਂ ਮੁਕਤਾ ਸਵਰ ਤੋਂ ਬਾਅਦ ਅੱਧਕ ਲਾਇਆ ਜਾਂਦਾ ਹੈ",
    },
    {
      key: "ਪੰਜਾਬੀ ਵਿੱਚ ਵਿਦੇਸ਼ੀ ਸ਼ਬਦਾਂ ਦਾ ਸਰੋਤ",
      value: "ਫ਼ਾਰਸੀ, ਅਰਬੀ, ਤੁਰਕੀ, ਪੁਰਤਗਾਲੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ",
    },
  ],
);

lit(
  "pa:guru-sahiban",
  "ਗੁਰੂ ਸਾਹਿਬਾਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਚਨਾਵਾਂ",
  "ਗੁਰੂ ਸਾਹਿਬਾਨ ਦੀਆਂ ਰਚਨਾਵਾਂ ਵਿੱਚ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਜਪੁਜੀ ਸਾਹਿਬ ਦੇ ਰਚਨਹਾਰ", value: "ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ" },
    { key: "ਆਸਾ ਦੀ ਵਾਰ ਦੇ ਰਚਨਹਾਰ", value: "ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ" },
    { key: "ਬਾਰਹ ਮਾਹਾ ਤੁਖਾਰੀ ਦੇ ਰਚਨਹਾਰ", value: "ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ" },
    { key: "ਅਨੰਦ ਸਾਹਿਬ ਦੇ ਰਚਨਹਾਰ", value: "ਸ੍ਰੀ ਗੁਰੂ ਅਮਰਦਾਸ ਜੀ" },
    { key: "ਸੁਖਮਨੀ ਸਾਹਿਬ ਦੇ ਰਚਨਹਾਰ", value: "ਸ੍ਰੀ ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ" },
    {
      key: "ਆਦਿ ਗ੍ਰੰਥ ਦੇ ਸੰਪਾਦਕ",
      value: "ਸ੍ਰੀ ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ, ਜਿਨ੍ਹਾਂ ਨੇ 1604 ਵਿੱਚ ਸੰਪਾਦਨ ਕੀਤਾ",
    },
    { key: "ਆਦਿ ਗ੍ਰੰਥ ਦੇ ਲਿਖਾਰੀ", value: "ਭਾਈ ਗੁਰਦਾਸ ਜੀ" },
    { key: "ਵਾਰਾਂ ਭਾਈ ਗੁਰਦਾਸ ਜੀ ਦੀ ਪਦਵੀ", value: "ਗੁਰਬਾਣੀ ਦੀ ਕੁੰਜੀ" },
    { key: "ਜਾਪੁ ਸਾਹਿਬ ਦੇ ਰਚਨਹਾਰ", value: "ਸ੍ਰੀ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ" },
    { key: "ਜ਼ਫ਼ਰਨਾਮਾ ਦੇ ਰਚਨਹਾਰ", value: "ਸ੍ਰੀ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ, ਜੋ ਫ਼ਾਰਸੀ ਵਿੱਚ ਹੈ" },
  ],
  [
    { key: "ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ ਦੀ ਬਾਣੀ ਦੇ ਰਾਗ", value: "ਉਨ੍ਹਾਂ ਦੀ ਬਾਣੀ ਉੱਨੀ ਰਾਗਾਂ ਵਿੱਚ ਦਰਜ ਹੈ" },
    { key: "ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਦੇ ਕੁੱਲ ਅੰਗ", value: "1430 ਅੰਗ" },
    { key: "ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਵਿੱਚ ਰਾਗਾਂ ਦੀ ਗਿਣਤੀ", value: "31 ਮੁੱਖ ਰਾਗ" },
    { key: "ਭਗਤ ਬਾਣੀ", value: "ਕਬੀਰ, ਨਾਮਦੇਵ, ਰਵਿਦਾਸ, ਫ਼ਰੀਦ ਆਦਿ ਪੰਦਰਾਂ ਭਗਤਾਂ ਦੀ ਬਾਣੀ" },
    { key: "ਗੁਰੂ ਤੇਗ਼ ਬਹਾਦਰ ਜੀ ਦੀ ਬਾਣੀ ਦਾ ਵਿਸ਼ਾ", value: "ਵੈਰਾਗ, ਨਿਰਭੈਤਾ ਅਤੇ ਸੰਸਾਰ ਦੀ ਨਾਸ਼ਵਾਨਤਾ" },
  ],
);

lit(
  "pa:lok-dhara",
  "ਲੋਕ ਧਾਰਾ ਅਤੇ ਪੰਜਾਬੀ ਸੱਭਿਆਚਾਰ",
  "ਪੰਜਾਬੀ ਲੋਕ ਧਾਰਾ ਅਤੇ ਸੱਭਿਆਚਾਰ ਵਿੱਚ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਲੋਕ ਧਾਰਾ", value: "ਕਿਸੇ ਜਨ ਸਮੂਹ ਦੀ ਪੀੜ੍ਹੀ ਦਰ ਪੀੜ੍ਹੀ ਮੌਖਿਕ ਰੂਪ ਵਿੱਚ ਤੁਰੀ ਆਉਂਦੀ ਵਿਰਾਸਤ" },
    { key: "ਸੱਭਿਆਚਾਰ", value: "ਕਿਸੇ ਸਮਾਜ ਦੇ ਸਾਂਝੇ ਵਿਸ਼ਵਾਸ, ਕਦਰਾਂ, ਰਹੁ ਰੀਤਾਂ ਅਤੇ ਜੀਵਨ ਢੰਗ ਦਾ ਸਮੂਹ" },
    { key: "ਗਿੱਧਾ", value: "ਪੰਜਾਬੀ ਇਸਤਰੀਆਂ ਦਾ ਪ੍ਰਸਿੱਧ ਲੋਕ ਨਾਚ" },
    { key: "ਭੰਗੜਾ", value: "ਪੰਜਾਬੀ ਮਰਦਾਂ ਦਾ ਵਾਢੀ ਨਾਲ ਜੁੜਿਆ ਲੋਕ ਨਾਚ" },
    { key: "ਬੋਲੀ", value: "ਗਿੱਧੇ ਵਿੱਚ ਗਾਇਆ ਜਾਣ ਵਾਲਾ ਛੋਟਾ ਲੋਕ ਕਾਵਿ ਰੂਪ" },
    { key: "ਸੁਹਾਗ", value: "ਵਿਆਹ ਤੋਂ ਪਹਿਲਾਂ ਕੁੜੀ ਦੇ ਘਰ ਗਾਇਆ ਜਾਣ ਵਾਲਾ ਲੋਕ ਗੀਤ" },
    { key: "ਘੋੜੀਆਂ", value: "ਮੁੰਡੇ ਦੇ ਵਿਆਹ ਸਮੇਂ ਗਾਏ ਜਾਣ ਵਾਲੇ ਲੋਕ ਗੀਤ" },
    { key: "ਅਲਾਹੁਣੀਆਂ", value: "ਕਿਸੇ ਦੀ ਮੌਤ ਉੱਤੇ ਗਾਏ ਜਾਣ ਵਾਲੇ ਵੈਣ" },
    { key: "ਲੋਹੜੀ", value: "ਪੋਹ ਦੇ ਅਖ਼ੀਰ ਵਿੱਚ ਮਨਾਇਆ ਜਾਣ ਵਾਲਾ ਅੱਗ ਬਾਲਣ ਦਾ ਤਿਉਹਾਰ" },
    { key: "ਵਿਸਾਖੀ", value: "ਵਿਸਾਖ ਦੀ ਪਹਿਲੀ ਨੂੰ ਵਾਢੀ ਅਤੇ ਖ਼ਾਲਸਾ ਸਾਜਨਾ ਦਾ ਤਿਉਹਾਰ" },
  ],
  [
    { key: "ਲੋਕ ਧਾਰਾ ਦੇ ਲੱਛਣ", value: "ਮੌਖਿਕਤਾ, ਪਰੰਪਰਾਗਤਤਾ, ਸਮੂਹਿਕ ਕਰਤਾਪਣ ਅਤੇ ਅਗਿਆਤ ਰਚਨਹਾਰ" },
    { key: "ਟੱਪਾ", value: "ਦੋ ਤੁਕਾਂ ਵਾਲਾ ਲੋਕ ਕਾਵਿ ਰੂਪ ਜਿਸ ਵਿੱਚ ਪਹਿਲੀ ਤੁਕ ਭੂਮਿਕਾ ਹੁੰਦੀ ਹੈ" },
    { key: "ਸੱਭਿਆਚਾਰ ਦੇ ਅੰਗ", value: "ਪਦਾਰਥਕ, ਪ੍ਰਤਿਮਾਨਕ ਅਤੇ ਬੋਧਾਤਮਕ ਅੰਗ" },
    { key: "ਲੋਕ ਕਥਾ ਦੀਆਂ ਕਿਸਮਾਂ", value: "ਪਰੀ ਕਥਾ, ਪਸ਼ੂ ਕਥਾ, ਦੰਤ ਕਥਾ ਅਤੇ ਮਿੱਥ ਕਥਾ" },
    { key: "ਤੀਆਂ", value: "ਸਾਵਣ ਵਿੱਚ ਕੁੜੀਆਂ ਦਾ ਪੇਕੇ ਘਰ ਮਨਾਇਆ ਜਾਣ ਵਾਲਾ ਤਿਉਹਾਰ" },
  ],
);

/* ========================================== Physical Education ========= */

pe(
  "pe:foundations",
  "Foundations of Physical Education",
  "In physical education, what is %s?",
  "%k is %v.",
  [
    {
      key: "Physical education",
      value: "Education through physical activity for the total development of the individual",
    },
    {
      key: "Aim of physical education",
      value:
        "All round development of the physical, mental, social and emotional aspects of a person",
    },
    {
      key: "Physical fitness",
      value: "The ability to carry out daily tasks with vigour and without undue fatigue",
    },
    {
      key: "Health related fitness components",
      value:
        "Cardiovascular endurance, muscular strength, muscular endurance, flexibility and body composition",
    },
    {
      key: "Skill related fitness components",
      value: "Speed, agility, balance, coordination, power and reaction time",
    },
    {
      key: "Warming up",
      value: "Preparatory activity that raises body temperature and prepares the body for exertion",
    },
    {
      key: "Cooling down",
      value: "Gradual reduction of activity that helps the body return to the resting state",
    },
    {
      key: "BMI",
      value: "Body Mass Index, weight in kilograms divided by the square of height in metres",
    },
    {
      key: "Posture",
      value: "The relative arrangement of body parts in standing, sitting or moving",
    },
    { key: "Father of modern Olympics", value: "Baron Pierre de Coubertin" },
  ],
  [
    {
      key: "Difference between physical education and physical training",
      value:
        "Physical education is broad and educational while physical training is narrow, drill oriented and aims at fitness alone",
    },
    {
      key: "Isotonic and isometric exercise",
      value:
        "Isotonic involves movement with changing muscle length while isometric involves tension without movement",
    },
    {
      key: "Principle of progressive overload",
      value: "Training load must be raised gradually for the body to keep adapting",
    },
    {
      key: "Second wind",
      value:
        "The relief felt after the initial distress in prolonged exercise, as the body adjusts its oxygen supply",
    },
    {
      key: "Oxygen debt",
      value:
        "The extra oxygen consumed after exercise to repay the deficit incurred during anaerobic work",
    },
  ],
);

pe(
  "pe:anatomy-games",
  "Anatomy, Physiology and Games",
  "In sports science and games, what is %s?",
  "%k is %v.",
  [
    { key: "Number of players in a cricket team", value: "Eleven" },
    { key: "Number of players in a hockey team", value: "Eleven" },
    { key: "Number of players in a kabaddi team on the mat", value: "Seven" },
    { key: "Number of players in a basketball team on court", value: "Five" },
    { key: "Number of players in a volleyball team on court", value: "Six" },
    { key: "Length of a standard athletics track", value: "Four hundred metres" },
    {
      key: "Dhyan Chand",
      value: "The hockey legend on whose birthday National Sports Day is observed",
    },
    { key: "National Sports Day in India", value: "The twenty ninth of August" },
    {
      key: "Arjuna Award",
      value: "The award for outstanding performance in sports over a period of years",
    },
    { key: "Major Dhyan Chand Khel Ratna Award", value: "India's highest sporting honour" },
  ],
  [
    {
      key: "Function of the cardiovascular system in exercise",
      value: "It raises cardiac output to deliver more oxygen and remove carbon dioxide and heat",
    },
    {
      key: "Types of muscle tissue",
      value: "Skeletal or voluntary, smooth or involuntary, and cardiac",
    },
    {
      key: "Cause of muscle cramp during exercise",
      value: "Loss of salts and water, poor conditioning and accumulation of lactic acid",
    },
    { key: "RICE in sports injury management", value: "Rest, Ice, Compression and Elevation" },
    {
      key: "Difference between a sprain and a strain",
      value: "A sprain injures a ligament at a joint while a strain injures a muscle or tendon",
    },
  ],
);

/* ================================================ Art and Craft ======== */

art(
  "art:elements",
  "Elements and Principles of Art",
  "In art education, what is %s?",
  "%k is %v.",
  [
    { key: "Elements of art", value: "Line, shape, form, colour, value, texture and space" },
    {
      key: "Principles of design",
      value: "Balance, proportion, rhythm, emphasis, harmony, contrast and unity",
    },
    { key: "Primary colours", value: "Red, blue and yellow" },
    { key: "Secondary colours", value: "Green, orange and violet, each made from two primaries" },
    {
      key: "Complementary colours",
      value: "Colours opposite each other on the colour wheel, such as red and green",
    },
    {
      key: "Warm colours",
      value: "Red, orange and yellow, which suggest heat and advance visually",
    },
    {
      key: "Cool colours",
      value: "Blue, green and violet, which suggest calm and recede visually",
    },
    { key: "Tint", value: "A colour lightened by adding white" },
    { key: "Shade", value: "A colour darkened by adding black" },
    { key: "Perspective", value: "The technique of showing depth and distance on a flat surface" },
  ],
  [
    {
      key: "Linear perspective",
      value: "Depth shown by lines converging at a vanishing point on the horizon",
    },
    {
      key: "Aerial perspective",
      value: "Depth suggested by making distant objects paler, bluer and less detailed",
    },
    {
      key: "Difference between symmetrical and asymmetrical balance",
      value:
        "Symmetrical balance mirrors both sides while asymmetrical balance equalises visual weight differently",
    },
    {
      key: "Value in art",
      value: "The lightness or darkness of a colour, which creates the illusion of form",
    },
    {
      key: "Composition",
      value: "The deliberate arrangement of the elements of art within the picture space",
    },
  ],
);

art(
  "art:indian-crafts",
  "Indian Painting Traditions and Crafts",
  "In Indian art and craft, what is %s?",
  "%k is %v.",
  [
    {
      key: "Madhubani painting",
      value: "The folk painting of Mithila in Bihar, done by women on walls and paper",
    },
    {
      key: "Warli painting",
      value: "The tribal painting of Maharashtra using white geometric figures on an earth ground",
    },
    {
      key: "Phulkari",
      value: "The floral embroidery of Punjab worked on a coarse cotton khaddar cloth",
    },
    {
      key: "Bagh",
      value: "The densest form of Phulkari in which the embroidery covers the whole cloth",
    },
    { key: "Pattachitra", value: "The cloth scroll painting tradition of Odisha and West Bengal" },
    {
      key: "Kalamkari",
      value: "The hand painted or block printed cotton textile art of Andhra Pradesh",
    },
    {
      key: "Tanjore painting",
      value: "The South Indian painting style known for gold foil and gem inlay",
    },
    {
      key: "Blue pottery",
      value: "The glazed pottery craft of Jaipur that uses no clay in its body",
    },
    { key: "Papier mache", value: "The craft of moulding paper pulp, well known in Kashmir" },
    {
      key: "Origami",
      value: "The Japanese art of folding paper into shapes without cutting or pasting",
    },
  ],
  [
    {
      key: "Medium of a fresco",
      value: "Pigment applied on freshly laid wet lime plaster so that it becomes part of the wall",
    },
    {
      key: "Technique of the Ajanta murals",
      value: "Tempera on a prepared dry plaster ground rather than true fresco",
    },
    {
      key: "Difference between batik and tie and dye",
      value: "Batik resists dye with wax while tie and dye resists it by binding the cloth",
    },
    {
      key: "Importance of craft in school education",
      value:
        "It develops fine motor skill, creativity, patience and respect for manual work, as stressed in basic education",
    },
    {
      key: "Collage",
      value:
        "A composition made by pasting different materials such as paper, cloth and leaves on a surface",
    },
  ],
);

export const PUNJAB_CADRE_FIX_TEMPLATES = templates;
