import assert from "node:assert/strict";
import {
  countSyllabusMatches,
  mapSyllabusToBank,
  parseSyllabusOutline,
} from "../src/lib/test-series-syllabus";

const parsed = parseSyllabusOutline(`Subject: Punjab GK
  Chapter: Punjab at a glance
    Topic: Districts and Headquarters
    Topic: Folk Dances and Fairs`);
assert.deepEqual(parsed.errors, [], "the labelled nested syllabus format should parse cleanly");
assert.equal(parsed.syllabus.subjects.length, 1);
assert.equal(parsed.syllabus.subjects[0]?.chapters[0]?.topics.length, 2);

const numbered = parseSyllabusOutline(
  `1. Punjab GK\n1.1 Punjab at a glance\n1.1.1 Districts and Headquarters`,
);
assert.deepEqual(numbered.errors, [], "numbered syllabus outlines should infer their hierarchy");
assert.equal(
  numbered.syllabus.subjects[0]?.chapters[0]?.topics[0]?.name,
  "Districts and Headquarters",
);

const labelledVariants = parseSyllabusOutline(
  `Subject — Punjab GK\nChapter 1: Punjab at a glance\nTopic 1.1: Districts and Headquarters`,
);
assert.deepEqual(labelledVariants.errors, [], "dash and numbered labels should parse cleanly");
assert.equal(labelledVariants.syllabus.subjects[0]?.chapters[0]?.topics.length, 1);

const mapped = mapSyllabusToBank(parsed.syllabus, "Punjab PCS");
const coverage = countSyllabusMatches(mapped, "Punjab PCS");
assert.equal(coverage.missingSubjects.length, 0, "exact bank subjects should map");
assert.equal(coverage.missingTopics.length, 0, "exact bank topic tags should map");
assert.equal(coverage.mappedTopics, 2);
assert.ok(coverage.questionPositions > 0, "the preview should report real bank positions");

const unknown = parseSyllabusOutline(`Subject: Not a bank subject
  Chapter: Unmapped chapter
    Topic: Unmapped topic`);
assert.deepEqual(unknown.errors, []);
const unknownCoverage = countSyllabusMatches(
  mapSyllabusToBank(unknown.syllabus, "Punjab PCS"),
  "Punjab PCS",
);
assert.equal(unknownCoverage.missingSubjects.length, 1);
assert.equal(
  unknownCoverage.mappedTopics,
  0,
  "unknown outline terms must not fuzzy-match another topic",
);

const malformed = parseSyllabusOutline(`  Chapter: Orphan chapter\n    Topic: Orphan topic`);
assert.ok(malformed.errors.some((message) => message.includes("chapter must follow a subject")));

console.log("Test-series syllabus parse, exact bank mapping, and no-fuzzy-fallback gates: PASS");
