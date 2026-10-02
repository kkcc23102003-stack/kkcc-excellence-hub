import {
  ALL_TEMPLATES,
  COMPACTED_STRUCTURAL_HOLE_COUNT,
  QUESTION_TEMPLATE_DEFINITIONS,
} from "../src/lib/exam-bank/index";
import type { GeneratedQuestion } from "../src/lib/exam-bank/core";
import { INVALID_QUESTION_INDEX_RANGES } from "../src/lib/exam-bank/invalid-index-ranges";

const limitArgument = process.argv.find((argument) => argument.startsWith("--limit="));
const positionLimit = limitArgument ? Number(limitArgument.slice("--limit=".length)) : Infinity;
if (!(positionLimit > 0)) throw new Error("--limit must be a positive number.");

const sourceById = new Map(
  QUESTION_TEMPLATE_DEFINITIONS.map((template) => [template.id, template]),
);
const compactById = new Map(ALL_TEMPLATES.map((template) => [template.id, template]));
const errors: string[] = [];
let scannedPositions = 0;
let comparedPositions = 0;
let observedHoles = 0;
let expectedHoles = 0;

function recordError(message: string) {
  if (errors.length < 50) errors.push(message);
}

function isMappedIndex(index: number, ranges: readonly (readonly [number, number])[]) {
  let low = 0;
  let high = ranges.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const range = ranges[middle];
    if (!range) return false;
    if (index < range[0]) high = middle - 1;
    else if (index > range[1]) low = middle + 1;
    else return true;
  }
  return false;
}

function sameQuestion(left: GeneratedQuestion, right: GeneratedQuestion) {
  return (
    left.prompt === right.prompt &&
    left.answer === right.answer &&
    left.explanation === right.explanation &&
    left.difficulty === right.difficulty &&
    left.subject === right.subject &&
    left.topic === right.topic &&
    left.distractors.length === right.distractors.length &&
    left.distractors.every((value, index) => value === right.distractors[index]) &&
    left.exams.length === right.exams.length &&
    left.exams.every((value, index) => value === right.exams[index])
  );
}

for (const [templateId, ranges] of Object.entries(INVALID_QUESTION_INDEX_RANGES)) {
  const source = sourceById.get(templateId);
  const compacted = compactById.get(templateId);
  if (!source || !compacted) {
    recordError(`Structural-hole map references missing template ${templateId}.`);
    continue;
  }

  let rangeHoles = 0;
  let previousEnd = -1;
  for (const [start, end] of ranges) {
    if (start <= previousEnd || start < 0 || end < start || end >= source.count) {
      recordError(`Invalid or overlapping range [${start}, ${end}] in ${templateId}.`);
      continue;
    }
    rangeHoles += end - start + 1;
    previousEnd = end;
  }
  expectedHoles += rangeHoles;
  if (compacted.count !== source.count - rangeHoles) {
    recordError(
      `${templateId} count drift: raw=${source.count}, mapped holes=${rangeHoles}, compact=${compacted.count}.`,
    );
  }

  let publicIndex = 0;
  const scanLimit = Math.min(source.count, positionLimit);
  for (let rawIndex = 0; rawIndex < scanLimit; rawIndex += 1) {
    scannedPositions += 1;
    const mapped = isMappedIndex(rawIndex, ranges);
    let question: GeneratedQuestion | null | undefined;
    try {
      question = source.at(rawIndex);
    } catch (error) {
      recordError(`${templateId}[${rawIndex}] throws in its raw builder: ${String(error)}`);
      continue;
    }

    if (question === undefined) {
      recordError(`${templateId}[${rawIndex}] returns undefined instead of null or a question.`);
      continue;
    }
    if (question === null) {
      observedHoles += 1;
      if (!mapped) recordError(`${templateId}[${rawIndex}] is an unmapped structural hole.`);
      continue;
    }
    if (mapped) {
      recordError(`${templateId}[${rawIndex}] is mapped as a hole but now builds a question.`);
      continue;
    }

    let compactQuestion: GeneratedQuestion | null | undefined;
    try {
      compactQuestion = compacted.at(publicIndex);
    } catch (error) {
      recordError(
        `${templateId} compact index ${publicIndex} throws while mapping raw index ${rawIndex}: ${String(error)}`,
      );
      publicIndex += 1;
      continue;
    }
    if (!compactQuestion) {
      recordError(`${templateId} compact index ${publicIndex} does not resolve to a question.`);
    } else if (!sameQuestion(question, compactQuestion)) {
      recordError(
        `${templateId} compact index ${publicIndex} does not match raw index ${rawIndex}.`,
      );
    }
    comparedPositions += 1;
    publicIndex += 1;
  }

  if (scanLimit === source.count && publicIndex !== compacted.count) {
    recordError(
      `${templateId} mapped ${publicIndex} valid source positions, expected ${compacted.count}.`,
    );
  }
}

if (expectedHoles !== COMPACTED_STRUCTURAL_HOLE_COUNT) {
  recordError(
    `Exported compacted-hole total ${COMPACTED_STRUCTURAL_HOLE_COUNT} does not match map total ${expectedHoles}.`,
  );
}
if (!Number.isFinite(positionLimit) && observedHoles !== expectedHoles) {
  recordError(`Observed ${observedHoles} raw holes, but the map declares ${expectedHoles}.`);
}

const summary = {
  full: !Number.isFinite(positionLimit),
  mappedTemplates: Object.keys(INVALID_QUESTION_INDEX_RANGES).length,
  rawPositionsScanned: scannedPositions,
  validPositionsCompared: comparedPositions,
  mappedHolesExpected: expectedHoles,
  mappedHolesObserved: observedHoles,
  compactedStructuralHoleCount: COMPACTED_STRUCTURAL_HOLE_COUNT,
  errors,
};
console.log(JSON.stringify(summary, null, 2));
if (errors.length > 0) process.exitCode = 1;
