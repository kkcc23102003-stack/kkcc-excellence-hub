/**
 * The remaining ETT Paper A sections, the ETT Paper B Punjabi section, and
 * the Master Cadre DPE and Art and Craft papers.
 *
 * The ERB Paper A syllabus has six sections: language and dialect, script and
 * Gurmukhi script, phonemic awareness, word knowledge (parts of speech plus
 * root, prefix and suffix), vocabulary (phrase, clause, classification of
 * sentences, semantics) and grammar (gender, tense, causal verbs,
 * punctuation, idioms, adverbs and spelling). Prefix and suffix, phrase and
 * clause with sentence classification, and causal verbs with voice were the
 * three still missing.
 *
 * Paper B carries a different Punjabi section — folklore, Punjabi culture,
 * idioms and proverbs, translation and sentence conversion — so translation
 * and sentence conversion are added under Punjabi Literature.
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

/* ====================================== ETT Paper A — remaining ======= */

pa(
  "pa:agetar-pichhetar",
  "ਅਗੇਤਰ, ਪਿਛੇਤਰ ਅਤੇ ਮੂਲ ਸ਼ਬਦ",
  "ਸ਼ਬਦ ਰਚਨਾ ਵਿੱਚ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਮੂਲ ਸ਼ਬਦ", value: "ਉਹ ਬੁਨਿਆਦੀ ਸ਼ਬਦ ਜਿਸ ਤੋਂ ਹੋਰ ਸ਼ਬਦ ਬਣਦੇ ਹਨ" },
    { key: "ਅਗੇਤਰ", value: "ਮੂਲ ਸ਼ਬਦ ਦੇ ਅੱਗੇ ਲੱਗ ਕੇ ਨਵਾਂ ਅਰਥ ਦੇਣ ਵਾਲਾ ਅੰਸ਼" },
    { key: "ਪਿਛੇਤਰ", value: "ਮੂਲ ਸ਼ਬਦ ਦੇ ਪਿੱਛੇ ਲੱਗ ਕੇ ਨਵਾਂ ਅਰਥ ਦੇਣ ਵਾਲਾ ਅੰਸ਼" },
    { key: "ਅਣ ਅਗੇਤਰ ਦਾ ਅਰਥ", value: "ਨਾਂਹ ਵਾਚਕ, ਜਿਵੇਂ ਅਣਜਾਣ ਅਤੇ ਅਣਥੱਕ ਵਿੱਚ" },
    { key: "ਬੇ ਅਗੇਤਰ ਦਾ ਅਰਥ", value: "ਬਿਨਾਂ ਜਾਂ ਰਹਿਤ, ਜਿਵੇਂ ਬੇਸਮਝ ਅਤੇ ਬੇਈਮਾਨ ਵਿੱਚ" },
    { key: "ਕੁ ਅਗੇਤਰ ਦਾ ਅਰਥ", value: "ਮਾੜਾ ਜਾਂ ਬੁਰਾ, ਜਿਵੇਂ ਕੁਕਰਮ ਅਤੇ ਕੁਸੰਗ ਵਿੱਚ" },
    { key: "ਸੁ ਅਗੇਤਰ ਦਾ ਅਰਥ", value: "ਚੰਗਾ ਜਾਂ ਸੋਹਣਾ, ਜਿਵੇਂ ਸੁਕਰਮ ਅਤੇ ਸੁਗੰਧ ਵਿੱਚ" },
    { key: "ਈ ਪਿਛੇਤਰ ਦਾ ਕੰਮ", value: "ਨਾਂਵ ਤੋਂ ਵਿਸ਼ੇਸ਼ਣ ਬਣਾਉਂਦਾ ਹੈ, ਜਿਵੇਂ ਪੰਜਾਬ ਤੋਂ ਪੰਜਾਬੀ" },
    { key: "ਵਾਲਾ ਪਿਛੇਤਰ ਦਾ ਕੰਮ", value: "ਕਰਤਾ ਜਾਂ ਸੰਬੰਧ ਦਰਸਾਉਂਦਾ ਹੈ, ਜਿਵੇਂ ਦੁੱਧ ਵਾਲਾ" },
    { key: "ਪਣ ਪਿਛੇਤਰ ਦਾ ਕੰਮ", value: "ਭਾਵਵਾਚਕ ਨਾਂਵ ਬਣਾਉਂਦਾ ਹੈ, ਜਿਵੇਂ ਬਚਪਣ ਅਤੇ ਲੜਕਪਣ" },
  ],
  [
    { key: "ਸਾਧਾਰਨ ਸ਼ਬਦ", value: "ਉਹ ਸ਼ਬਦ ਜਿਸ ਦੇ ਹੋਰ ਟੁਕੜੇ ਨਾ ਕੀਤੇ ਜਾ ਸਕਣ, ਜਿਵੇਂ ਘਰ" },
    { key: "ਮਿਸ਼ਰਿਤ ਸ਼ਬਦ", value: "ਮੂਲ ਸ਼ਬਦ ਨਾਲ ਅਗੇਤਰ ਜਾਂ ਪਿਛੇਤਰ ਜੁੜ ਕੇ ਬਣਿਆ ਸ਼ਬਦ" },
    { key: "ਸੰਯੁਕਤ ਸ਼ਬਦ", value: "ਦੋ ਸੁਤੰਤਰ ਸ਼ਬਦਾਂ ਦੇ ਮੇਲ ਤੋਂ ਬਣਿਆ ਸ਼ਬਦ, ਜਿਵੇਂ ਰਸੋਈ ਘਰ" },
    { key: "ਦੁਹਰੁਕਤੀ", value: "ਇੱਕੋ ਸ਼ਬਦ ਦੇ ਦੁਹਰਾਉ ਤੋਂ ਬਣਿਆ ਰੂਪ, ਜਿਵੇਂ ਘਰ ਘਰ" },
    { key: "ਸਮਾਸ", value: "ਦੋ ਜਾਂ ਵੱਧ ਸ਼ਬਦਾਂ ਦੇ ਸੰਖੇਪ ਮੇਲ ਤੋਂ ਬਣਿਆ ਨਵਾਂ ਸ਼ਬਦ" },
  ],
);

pa(
  "pa:vakansh-upvak",
  "ਵਾਕੰਸ਼, ਉਪਵਾਕ ਅਤੇ ਵਾਕ ਦੀ ਵੰਡ",
  "ਵਾਕ ਬਣਤਰ ਵਿੱਚ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਵਾਕ", value: "ਸ਼ਬਦਾਂ ਦਾ ਉਹ ਸਮੂਹ ਜੋ ਪੂਰਾ ਅਰਥ ਪ੍ਰਗਟ ਕਰੇ" },
    { key: "ਵਾਕੰਸ਼", value: "ਸ਼ਬਦਾਂ ਦਾ ਉਹ ਸਮੂਹ ਜਿਸ ਵਿੱਚ ਕਿਰਿਆ ਨਾ ਹੋਵੇ ਅਤੇ ਅਰਥ ਅਧੂਰਾ ਰਹੇ" },
    {
      key: "ਉਪਵਾਕ",
      value: "ਸ਼ਬਦਾਂ ਦਾ ਉਹ ਸਮੂਹ ਜਿਸ ਵਿੱਚ ਕਰਤਾ ਤੇ ਕਿਰਿਆ ਹੋਵੇ ਪਰ ਜੋ ਵੱਡੇ ਵਾਕ ਦਾ ਹਿੱਸਾ ਹੋਵੇ",
    },
    { key: "ਉਦੇਸ਼", value: "ਵਾਕ ਦਾ ਉਹ ਭਾਗ ਜਿਸ ਬਾਰੇ ਕੁਝ ਕਿਹਾ ਜਾਵੇ" },
    { key: "ਵਿਧੇ", value: "ਵਾਕ ਦਾ ਉਹ ਭਾਗ ਜੋ ਉਦੇਸ਼ ਬਾਰੇ ਕੁਝ ਦੱਸੇ" },
    { key: "ਸਾਧਾਰਨ ਵਾਕ", value: "ਇੱਕ ਹੀ ਕਿਰਿਆ ਵਾਲਾ ਵਾਕ" },
    { key: "ਸੰਯੁਕਤ ਵਾਕ", value: "ਦੋ ਜਾਂ ਵੱਧ ਸੁਤੰਤਰ ਉਪਵਾਕਾਂ ਵਾਲਾ ਵਾਕ" },
    { key: "ਮਿਸ਼ਰਿਤ ਵਾਕ", value: "ਇੱਕ ਪ੍ਰਧਾਨ ਉਪਵਾਕ ਅਤੇ ਇੱਕ ਜਾਂ ਵੱਧ ਅਧੀਨ ਉਪਵਾਕਾਂ ਵਾਲਾ ਵਾਕ" },
    { key: "ਪ੍ਰਸ਼ਨਵਾਚਕ ਵਾਕ", value: "ਉਹ ਵਾਕ ਜਿਸ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਪੁੱਛਿਆ ਜਾਵੇ" },
    { key: "ਆਗਿਆਵਾਚਕ ਵਾਕ", value: "ਉਹ ਵਾਕ ਜਿਸ ਵਿੱਚ ਹੁਕਮ, ਬੇਨਤੀ ਜਾਂ ਸਲਾਹ ਹੋਵੇ" },
  ],
  [
    { key: "ਬਣਤਰ ਦੇ ਆਧਾਰ ਉੱਤੇ ਵਾਕ ਦੀ ਵੰਡ", value: "ਸਾਧਾਰਨ, ਸੰਯੁਕਤ ਅਤੇ ਮਿਸ਼ਰਿਤ ਵਾਕ" },
    {
      key: "ਅਰਥ ਦੇ ਆਧਾਰ ਉੱਤੇ ਵਾਕ ਦੀ ਵੰਡ",
      value: "ਬਿਆਨੀਆ, ਪ੍ਰਸ਼ਨਵਾਚਕ, ਆਗਿਆਵਾਚਕ, ਇੱਛਾਵਾਚਕ, ਵਿਸਮਿਕ ਅਤੇ ਸ਼ਰਤੀ ਵਾਕ",
    },
    { key: "ਪ੍ਰਧਾਨ ਉਪਵਾਕ", value: "ਉਹ ਉਪਵਾਕ ਜੋ ਆਪਣੇ ਆਪ ਵਿੱਚ ਪੂਰਾ ਅਰਥ ਦੇਵੇ" },
    { key: "ਅਧੀਨ ਉਪਵਾਕ", value: "ਉਹ ਉਪਵਾਕ ਜੋ ਪ੍ਰਧਾਨ ਉਪਵਾਕ ਉੱਤੇ ਨਿਰਭਰ ਹੋਵੇ" },
    {
      key: "ਵਾਕੰਸ਼ ਅਤੇ ਉਪਵਾਕ ਵਿੱਚ ਅੰਤਰ",
      value: "ਉਪਵਾਕ ਵਿੱਚ ਕਿਰਿਆ ਹੁੰਦੀ ਹੈ ਜਦਕਿ ਵਾਕੰਸ਼ ਵਿੱਚ ਨਹੀਂ ਹੁੰਦੀ",
    },
  ],
);

pa(
  "pa:prernarthak-vach",
  "ਪ੍ਰੇਰਨਾਰਥਕ ਕਿਰਿਆ ਅਤੇ ਵਾਚ",
  "ਕਿਰਿਆ ਦੇ ਰੂਪਾਂ ਵਿੱਚ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਕਿਰਿਆ", value: "ਉਹ ਸ਼ਬਦ ਜੋ ਕਿਸੇ ਕੰਮ ਦੇ ਹੋਣ ਜਾਂ ਕਰਨ ਨੂੰ ਪ੍ਰਗਟ ਕਰੇ" },
    { key: "ਅਕਰਮਕ ਕਿਰਿਆ", value: "ਉਹ ਕਿਰਿਆ ਜਿਸ ਨੂੰ ਕਰਮ ਦੀ ਲੋੜ ਨਾ ਹੋਵੇ" },
    { key: "ਸਕਰਮਕ ਕਿਰਿਆ", value: "ਉਹ ਕਿਰਿਆ ਜਿਸ ਨੂੰ ਕਰਮ ਦੀ ਲੋੜ ਹੋਵੇ" },
    { key: "ਪ੍ਰੇਰਨਾਰਥਕ ਕਿਰਿਆ", value: "ਉਹ ਕਿਰਿਆ ਜਿਸ ਵਿੱਚ ਕਰਤਾ ਕਿਸੇ ਹੋਰ ਤੋਂ ਕੰਮ ਕਰਵਾਉਂਦਾ ਹੈ" },
    { key: "ਪਹਿਲੀ ਪ੍ਰੇਰਨਾਰਥਕ ਕਿਰਿਆ ਦੀ ਉਦਾਹਰਨ", value: "ਲਿਖ ਤੋਂ ਲਿਖਾ, ਭਾਵ ਕਿਸੇ ਤੋਂ ਲਿਖਵਾਉਣਾ" },
    { key: "ਦੂਜੀ ਪ੍ਰੇਰਨਾਰਥਕ ਕਿਰਿਆ ਦੀ ਉਦਾਹਰਨ", value: "ਲਿਖ ਤੋਂ ਲਿਖਵਾ, ਭਾਵ ਕਿਸੇ ਹੋਰ ਰਾਹੀਂ ਲਿਖਵਾਉਣਾ" },
    { key: "ਵਾਚ", value: "ਕਿਰਿਆ ਦਾ ਉਹ ਰੂਪ ਜੋ ਦੱਸੇ ਕਿ ਵਾਕ ਵਿੱਚ ਕਰਤਾ ਪ੍ਰਧਾਨ ਹੈ ਜਾਂ ਕਰਮ" },
    { key: "ਕਰਤਰੀ ਵਾਚ", value: "ਉਹ ਵਾਚ ਜਿਸ ਵਿੱਚ ਕਰਤਾ ਪ੍ਰਧਾਨ ਹੁੰਦਾ ਹੈ" },
    { key: "ਕਰਮਣੀ ਵਾਚ", value: "ਉਹ ਵਾਚ ਜਿਸ ਵਿੱਚ ਕਰਮ ਪ੍ਰਧਾਨ ਹੁੰਦਾ ਹੈ" },
    { key: "ਭਾਵ ਵਾਚ", value: "ਉਹ ਵਾਚ ਜਿਸ ਵਿੱਚ ਨਾ ਕਰਤਾ ਨਾ ਕਰਮ, ਸਗੋਂ ਕਿਰਿਆ ਦਾ ਭਾਵ ਪ੍ਰਧਾਨ ਹੁੰਦਾ ਹੈ" },
  ],
  [
    { key: "ਸੰਯੁਕਤ ਕਿਰਿਆ", value: "ਦੋ ਜਾਂ ਵੱਧ ਕਿਰਿਆਵਾਂ ਦੇ ਮੇਲ ਤੋਂ ਬਣੀ ਕਿਰਿਆ, ਜਿਵੇਂ ਖਾ ਲਿਆ" },
    { key: "ਸਹਾਇਕ ਕਿਰਿਆ", value: "ਉਹ ਕਿਰਿਆ ਜੋ ਮੁੱਖ ਕਿਰਿਆ ਨਾਲ ਆ ਕੇ ਕਾਲ ਜਾਂ ਭਾਵ ਪ੍ਰਗਟ ਕਰੇ" },
    {
      key: "ਕਰਤਰੀ ਤੋਂ ਕਰਮਣੀ ਵਾਚ ਦੀ ਤਬਦੀਲੀ",
      value: "ਕਰਮ ਨੂੰ ਕਰਤਾ ਬਣਾ ਕੇ ਕਰਤਾ ਨਾਲ ਦੁਆਰਾ ਜਾਂ ਤੋਂ ਲਾਇਆ ਜਾਂਦਾ ਹੈ",
    },
    { key: "ਕਾਲ ਦੀਆਂ ਕਿਸਮਾਂ", value: "ਵਰਤਮਾਨ, ਭੂਤ ਅਤੇ ਭਵਿੱਖਤ ਕਾਲ" },
    { key: "ਸ਼ਰਤੀ ਭਾਵ", value: "ਕਿਰਿਆ ਦਾ ਉਹ ਰੂਪ ਜੋ ਸ਼ਰਤ ਉੱਤੇ ਨਿਰਭਰ ਕੰਮ ਪ੍ਰਗਟ ਕਰੇ" },
  ],
);

/* ================================== ETT Paper B — Punjabi section ===== */

lit(
  "pb:anuvad-vak-badli",
  "ਅਨੁਵਾਦ ਅਤੇ ਵਾਕ ਬਦਲੀ",
  "ਅਨੁਵਾਦ ਅਤੇ ਵਾਕ ਬਦਲੀ ਵਿੱਚ %s ਕੀ ਹੈ?",
  "%k %v ਹੈ।",
  [
    { key: "ਅਨੁਵਾਦ", value: "ਇੱਕ ਭਾਸ਼ਾ ਦੀ ਗੱਲ ਨੂੰ ਦੂਜੀ ਭਾਸ਼ਾ ਵਿੱਚ ਉਸੇ ਅਰਥ ਨਾਲ ਪ੍ਰਗਟ ਕਰਨਾ" },
    { key: "ਸ਼ਬਦਾਰਥ ਅਨੁਵਾਦ", value: "ਸ਼ਬਦ ਦਰ ਸ਼ਬਦ ਕੀਤਾ ਜਾਣ ਵਾਲਾ ਅਨੁਵਾਦ" },
    { key: "ਭਾਵਾਰਥ ਅਨੁਵਾਦ", value: "ਮੂਲ ਦੇ ਭਾਵ ਨੂੰ ਸਹਿਜ ਭਾਸ਼ਾ ਵਿੱਚ ਪ੍ਰਗਟ ਕਰਨ ਵਾਲਾ ਅਨੁਵਾਦ" },
    {
      key: "ਚੰਗੇ ਅਨੁਵਾਦ ਦੀ ਪਹਿਲੀ ਸ਼ਰਤ",
      value: "ਮੂਲ ਦਾ ਅਰਥ ਬਿਨਾਂ ਬਦਲੇ ਸਹਿਜ ਤੇ ਸਪਸ਼ਟ ਭਾਸ਼ਾ ਵਿੱਚ ਆਵੇ",
    },
    { key: "ਵਾਕ ਬਦਲੀ", value: "ਵਾਕ ਦਾ ਅਰਥ ਬਦਲੇ ਬਿਨਾਂ ਉਸ ਦੀ ਬਣਤਰ ਬਦਲਣਾ" },
    { key: "ਬਿਆਨੀਆ ਤੋਂ ਪ੍ਰਸ਼ਨਵਾਚਕ ਬਦਲੀ", value: "ਬਿਆਨ ਨੂੰ ਪ੍ਰਸ਼ਨ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖਣਾ" },
    { key: "ਸਾਧਾਰਨ ਤੋਂ ਮਿਸ਼ਰਿਤ ਵਾਕ ਬਦਲੀ", value: "ਵਾਕੰਸ਼ ਨੂੰ ਅਧੀਨ ਉਪਵਾਕ ਵਿੱਚ ਬਦਲਣਾ" },
    { key: "ਸਿੱਧੀ ਕਥਨੀ", value: "ਬੁਲਾਰੇ ਦੇ ਸ਼ਬਦ ਜਿਉਂ ਦੇ ਤਿਉਂ ਪੁੱਠੇ ਕਾਮਿਆਂ ਵਿੱਚ ਲਿਖਣਾ" },
    { key: "ਅਸਿੱਧੀ ਕਥਨੀ", value: "ਬੁਲਾਰੇ ਦੀ ਗੱਲ ਨੂੰ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਪ੍ਰਗਟ ਕਰਨਾ" },
    { key: "ਅਖਾਣ", value: "ਲੋਕ ਅਨੁਭਵ ਉੱਤੇ ਆਧਾਰਿਤ ਸੰਖੇਪ ਤੇ ਸੰਪੂਰਨ ਕਥਨ" },
  ],
  [
    {
      key: "ਅਖਾਣ ਅਤੇ ਮੁਹਾਵਰੇ ਵਿੱਚ ਅੰਤਰ",
      value: "ਅਖਾਣ ਆਪਣੇ ਆਪ ਵਿੱਚ ਪੂਰਾ ਵਾਕ ਹੁੰਦਾ ਹੈ ਜਦਕਿ ਮੁਹਾਵਰਾ ਵਾਕ ਵਿੱਚ ਢਾਲਣਾ ਪੈਂਦਾ ਹੈ",
    },
    {
      key: "ਅਨੁਵਾਦ ਵਿੱਚ ਮੁਹਾਵਰੇ ਦੀ ਸਮੱਸਿਆ",
      value:
        "ਮੁਹਾਵਰੇ ਦਾ ਸ਼ਬਦਾਰਥ ਅਨੁਵਾਦ ਅਰਥਹੀਣ ਹੋ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਸਮਾਨ ਭਾਵ ਵਾਲਾ ਮੁਹਾਵਰਾ ਲੱਭਣਾ ਪੈਂਦਾ ਹੈ",
    },
    {
      key: "ਸਿੱਧੀ ਤੋਂ ਅਸਿੱਧੀ ਕਥਨੀ ਵਿੱਚ ਬਦਲੀ",
      value: "ਪੜਨਾਂਵ, ਕਾਲ ਅਤੇ ਸਮਾਂ ਸਥਾਨ ਸੂਚਕ ਸ਼ਬਦ ਬਦਲਦੇ ਹਨ",
    },
    {
      key: "ਕਰਤਰੀ ਤੋਂ ਕਰਮਣੀ ਵਾਕ ਬਦਲੀ",
      value: "ਕਰਮ ਵਾਕ ਦੇ ਸ਼ੁਰੂ ਵਿੱਚ ਆਉਂਦਾ ਹੈ ਅਤੇ ਕਿਰਿਆ ਦਾ ਰੂਪ ਬਦਲਦਾ ਹੈ",
    },
    {
      key: "ਦਫ਼ਤਰੀ ਅਨੁਵਾਦ ਦੀ ਲੋੜ",
      value:
        "ਪੰਜਾਬ ਵਿੱਚ ਸਰਕਾਰੀ ਕੰਮਕਾਜ ਪੰਜਾਬੀ ਵਿੱਚ ਹੋਣ ਕਾਰਨ ਅੰਗਰੇਜ਼ੀ ਦਸਤਾਵੇਜ਼ਾਂ ਦਾ ਅਨੁਵਾਦ ਜ਼ਰੂਰੀ ਹੈ",
    },
  ],
);

/* ========================================= Master Cadre — DPE ========= */

pe(
  "pe:training-methods",
  "Training Methods and Sports Training",
  "In sports training, what is %s?",
  "%k is %v.",
  [
    {
      key: "Sports training",
      value: "A planned scientific process of preparing an athlete for the highest performance",
    },
    {
      key: "Continuous training method",
      value: "Training at a steady moderate intensity for a long time to build endurance",
    },
    {
      key: "Interval training",
      value: "Alternating bouts of hard work with fixed recovery periods",
    },
    { key: "Fartlek", value: "Speed play, in which pace is varied freely over natural terrain" },
    {
      key: "Circuit training",
      value: "Moving through a set of stations, each with a different exercise",
    },
    {
      key: "Weight training",
      value: "Training with resistance to develop muscular strength and power",
    },
    {
      key: "Isometric exercise",
      value: "Muscle contraction without any visible change in length or joint angle",
    },
    {
      key: "Isokinetic exercise",
      value: "Exercise at a constant speed through the full range of movement",
    },
    { key: "Strength", value: "The ability of a muscle to overcome resistance" },
    { key: "Endurance", value: "The ability to sustain activity against fatigue" },
  ],
  [
    {
      key: "Principle of specificity",
      value: "Training must match the demands of the particular sport and the muscles it uses",
    },
    {
      key: "Principle of reversibility",
      value: "Fitness gains are lost when training stops or is reduced",
    },
    {
      key: "Periodisation",
      value: "Dividing the training year into preparatory, competitive and transition phases",
    },
    {
      key: "Tapering",
      value: "Reducing training load before a competition so the athlete peaks on the day",
    },
    {
      key: "Overtraining",
      value:
        "A state of staleness from excessive load without adequate recovery, shown by falling performance and fatigue",
    },
  ],
);

pe(
  "pe:yoga-health",
  "Yoga, Health and Nutrition",
  "In yoga and health education, what is %s?",
  "%k is %v.",
  [
    {
      key: "Yoga",
      value:
        "A discipline of physical postures, breathing and meditation for physical and mental well being",
    },
    { key: "Author of the Yoga Sutras", value: "Patanjali" },
    {
      key: "Ashtanga yoga",
      value:
        "The eight limbs of yoga: yama, niyama, asana, pranayama, pratyahara, dharana, dhyana and samadhi",
    },
    { key: "Asana", value: "A steady and comfortable body posture" },
    { key: "Pranayama", value: "The regulation and control of breath" },
    { key: "International Yoga Day", value: "The twenty first of June" },
    {
      key: "Balanced diet",
      value: "A diet containing all nutrients in the right proportion for the needs of the body",
    },
    { key: "Macronutrients", value: "Carbohydrates, proteins and fats, needed in large amounts" },
    { key: "Micronutrients", value: "Vitamins and minerals, needed in small amounts" },
    {
      key: "Obesity",
      value: "An excess accumulation of body fat, usually a body mass index above thirty",
    },
  ],
  [
    {
      key: "Benefit of pranayama on the respiratory system",
      value: "It increases vital capacity, strengthens the diaphragm and improves oxygen exchange",
    },
    {
      key: "Surya Namaskar",
      value: "A sequence of twelve linked postures that exercises the whole body",
    },
    {
      key: "Difference between yoga and physical exercise",
      value:
        "Yoga works on body, breath and mind together and is done slowly with awareness, exercise chiefly on the body",
    },
    {
      key: "Effect of regular exercise on the heart",
      value: "The heart muscle thickens, stroke volume rises and the resting pulse falls",
    },
    {
      key: "Role of protein in an athlete's diet",
      value: "It repairs and builds muscle tissue after training",
    },
  ],
);

/* =================================== Master Cadre — Art and Craft ===== */

art(
  "art:drawing-methods",
  "Drawing, Media and Techniques",
  "In art technique, what is %s?",
  "%k is %v.",
  [
    {
      key: "Still life",
      value: "A drawing or painting of inanimate objects arranged by the artist",
    },
    { key: "Landscape", value: "A picture whose main subject is natural scenery" },
    { key: "Portrait", value: "A representation of a person, usually the face and shoulders" },
    {
      key: "Sketching",
      value: "A quick freehand drawing that records the essentials of a subject",
    },
    { key: "Shading", value: "Varying tone to give the impression of light, shadow and volume" },
    { key: "Hatching", value: "Shading with a set of closely spaced parallel lines" },
    {
      key: "Cross hatching",
      value: "Shading with two or more sets of intersecting parallel lines",
    },
    { key: "Stippling", value: "Building tone using small dots" },
    {
      key: "Water colour",
      value:
        "A transparent painting medium in which pigment is bound with gum and thinned with water",
    },
    { key: "Poster colour", value: "An opaque water based paint that dries to a flat matt finish" },
  ],
  [
    {
      key: "Difference between opaque and transparent media",
      value:
        "Opaque paint covers what is below it while transparent paint lets the ground show through",
    },
    {
      key: "Vanishing point",
      value: "The point on the horizon at which receding parallel lines appear to meet",
    },
    {
      key: "One point and two point perspective",
      value: "One vanishing point is used for a frontal view and two for a view at an angle",
    },
    {
      key: "Importance of a preliminary sketch",
      value: "It fixes composition, proportion and placement before the final work begins",
    },
    {
      key: "Golden section in composition",
      value: "A proportion of roughly 1 to 1.618 that is found pleasing to the eye",
    },
  ],
);

art(
  "art:craft-pedagogy",
  "Craft Work and Art Pedagogy",
  "In art and craft teaching, what is %s?",
  "%k is %v.",
  [
    {
      key: "Craft",
      value: "A skilled activity in which useful or decorative articles are made by hand",
    },
    {
      key: "Clay modelling",
      value: "Shaping clay by hand or on a wheel into three dimensional forms",
    },
    { key: "Paper craft", value: "Making objects by folding, cutting, tearing and pasting paper" },
    {
      key: "Block printing",
      value: "Printing a design by inking a carved block and pressing it on cloth or paper",
    },
    { key: "Stencil", value: "A cut out sheet through which colour is applied to repeat a design" },
    { key: "Weaving", value: "Interlacing warp and weft threads to make a fabric" },
    { key: "Embroidery", value: "Decorating cloth with needle and thread" },
    {
      key: "Aim of art education in school",
      value: "Developing observation, imagination, expression and aesthetic sense",
    },
    {
      key: "Correlation in art teaching",
      value: "Linking art activity with other school subjects to deepen understanding",
    },
    {
      key: "Display of children's work",
      value: "Exhibiting work to build confidence and give recognition to every child",
    },
  ],
  [
    {
      key: "Reason a teacher should not draw on a child's work",
      value:
        "It replaces the child's own expression and discourages confidence in his or her own ability",
    },
    {
      key: "Assessment in art education",
      value:
        "It should judge effort, originality and growth rather than compare children against one fixed standard",
    },
    {
      key: "Value of craft in the basic education scheme",
      value:
        "Gandhi's Nai Talim placed productive craft at the centre of learning, linking head, heart and hand",
    },
    {
      key: "Free expression method",
      value: "Letting the child choose subject and treatment so that imagination is not restricted",
    },
    {
      key: "Use of local and waste material in craft",
      value:
        "It makes craft affordable, teaches resourcefulness and builds environmental awareness",
    },
  ],
);

export const ETT_MASTER_FIX_TEMPLATES = templates;
