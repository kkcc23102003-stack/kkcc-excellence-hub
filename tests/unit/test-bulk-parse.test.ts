/**
 * Bulk paste → preview → publish contract.
 *
 * The admin pastes questions with their own explanations, sees them in a
 * preview, edits them, and only then presses Next → Publish. These tests pin
 * the two promises: the pasted explanation is never rewritten, and what the
 * preview shows is exactly what gets inserted.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseBulkMcqText,
  prepareBulkRows,
  serialiseBulkQuestions,
  countBulkQuestions,
} from "../../src/lib/test-bulk-parse";

const PASTED = `Q1. With which words does the Preamble to the Indian Constitution begin?
A) We, the People of India
B) In the Name of Parliament
C) By Order of the President
D) We, the Citizens of India
Answer: A
Explanation: The Preamble begins with 'We, the People of India'.
It declares the source of authority as the people.

Q2. Which Article deals with the Right to Equality before law?
A) Article 12
B) Article 14
C) Article 19
D) Article 21
Ans: B
Solution: Article 14 guarantees equality before the law.

3. The Constitution of India came into force on which date?
1) 15 August 1947
2) 26 January 1950
3) 26 November 1949
4) 2 October 1950
Correct: 26 January 1950
`;

test("every pasted question is parsed with its options and answer", () => {
  const questions = parseBulkMcqText(PASTED);
  assert.equal(questions.length, 3);
  assert.equal(questions[0]?.options.length, 4);
  assert.equal(questions[0]?.correct_index, 0);
  assert.equal(questions[1]?.correct_index, 1);
  assert.equal(questions[2]?.options.length, 4);
  assert.equal(questions[2]?.correct_index, 1);
});

test("the admin's explanation is kept word for word", () => {
  const [first] = parseBulkMcqText(PASTED);
  assert.equal(
    first?.explanation,
    "The Preamble begins with 'We, the People of India'. It declares the source of authority as the people.",
  );
  assert.equal(first?.explanation_source, "paste");
});

test("'Solution:' is accepted as an explanation alias", () => {
  const questions = parseBulkMcqText(PASTED);
  assert.match(questions[1]?.explanation ?? "", /Article 14 guarantees equality/);
});

test("an answer written as full text still resolves to the right option", () => {
  const questions = parseBulkMcqText(PASTED);
  assert.equal(questions[2]?.correct_index, 1);
  assert.equal(questions[2]?.options[1], "26 January 1950");
  assert.equal(questions[2]?.explanation_source, "auto");
});

test("publishing inserts the pasted explanation unchanged", () => {
  const rows = prepareBulkRows(parseBulkMcqText(PASTED), {
    subject: "Polity",
    marks: 2,
    negative_marks: 1,
    startOrder: 7,
  });
  assert.equal(rows.length, 3);
  assert.equal(rows[0]?.subject, "Polity");
  assert.equal(rows[0]?.marks, 2);
  assert.equal(rows[0]?.sort_order, 7);
  assert.equal(rows[1]?.sort_order, 8);
  assert.match(rows[0]?.explanation ?? "", /^The Preamble begins with/);
  // Only the question without a pasted explanation gets a generated one.
  assert.match(rows[2]?.explanation ?? "", /^Correct answer is 26 January 1950/);
});

test("edited preview rows are what gets published (preview == publish)", () => {
  const preview = parseBulkMcqText(PASTED);
  const edited = preview.map((question, index) =>
    index === 0
      ? {
          ...question,
          question_text: "Preamble kis shabdon se shuru hota hai?",
          explanation: "Admin ne khud likhi explanation.",
          marks: 5,
        }
      : question,
  );
  const rows = prepareBulkRows(edited.slice(0, 1), {
    subject: "Polity",
    marks: 2,
    negative_marks: 0,
    startOrder: 0,
  });
  assert.equal(rows[0]?.question_text, "Preamble kis shabdon se shuru hota hai?");
  assert.equal(rows[0]?.explanation, "Admin ne khud likhi explanation.");
  assert.equal(rows[0]?.marks, 5, "a per-question mark override wins over the batch default");
});

test("serialising checked questions back to text round-trips", () => {
  const questions = parseBulkMcqText(PASTED);
  const text = serialiseBulkQuestions(questions.slice(0, 1));
  const again = parseBulkMcqText(text);
  assert.equal(again.length, 1);
  assert.equal(again[0]?.question_text, questions[0]?.question_text);
  assert.equal(again[0]?.explanation, questions[0]?.explanation);
  assert.equal(again[0]?.correct_index, questions[0]?.correct_index);
});

test("a half-written paste is ignored instead of creating a broken question", () => {
  assert.equal(countBulkQuestions("Q1. Only the question text and nothing else"), 0);
  assert.equal(parseBulkMcqText("   \n  \n").length, 0);
  assert.equal(parseBulkMcqText("Q1. Pick one\nA) one\nB) two\n").length, 0);
});

test("an unanswered question is dropped, not guessed", () => {
  const questions = parseBulkMcqText(
    "Q1. Pick one\nA) one\nB) two\nC) three\nD) four\n\nQ2. Answered\nA) yes\nB) no\nAnswer: B\n",
  );
  assert.equal(questions.length, 1);
  assert.equal(questions[0]?.question_text, "Answered");
});
