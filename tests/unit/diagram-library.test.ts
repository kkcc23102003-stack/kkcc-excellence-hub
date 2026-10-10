import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ACTIVE_TEMPLATES } from "../../src/lib/exam-bank/index";
import { analyzeNotes, renderNotesBody } from "../../src/lib/notes-visuals";
import { NOTE_DIAGRAM_TEMPLATES } from "../../src/lib/notes-visuals/templates";
import library from "../../src/lib/notes-visuals/syllabus-library.json";

test("syllabus map library covers every active subject/topic exactly once", () => {
  const expected = new Set(ACTIVE_TEMPLATES.map((t) => JSON.stringify([t.subject, t.topic])));
  assert.deepEqual(new Set(library.map((row) => row.id)), expected);
  assert.equal(library.length, expected.size);
  assert.equal(new Set(library.map((row) => row.subject)).size, 78);
});

test("every map has scoped source provenance and renderable non-empty content", () => {
  const byId = new Map(ACTIVE_TEMPLATES.map((t) => [t.id, t]));
  for (const row of library) {
    assert.ok(row.sources.length > 0, row.id);
    for (const source of row.sources) {
      const template = byId.get(source.templateId);
      assert.ok(template, source.templateId);
      assert.equal(template.subject, row.subject);
      assert.equal(template.topic, row.title);
      const question = template.at(source.index);
      assert.ok(question, `${source.templateId}/${source.index}`);
      const match =
        /^(.+?) is correctly matched with (.+?), not .+?\. The other three pairs are correctly matched\.$/s.exec(
          question.explanation,
        );
      const expectedAnswer = match ? match[2]! : question.answer;
      assert.ok(
        row.body.includes(
          `Answer: ${expectedAnswer.replace(/\r?\n/g, " ").replace(/:::/g, "—").trim()}`,
        ),
      );
    }
    const expectedExams = [
      ...new Set(
        ACTIVE_TEMPLATES.filter((t) => t.subject === row.subject && t.topic === row.title).flatMap(
          (t) => t.exams,
        ),
      ),
    ].sort();
    assert.deepEqual(row.exams, expectedExams);
    assert.ok(analyzeNotes(row.body).visuals.length, row.id);
    assert.ok(renderNotesBody(row.body).includes("<svg"), row.id);
    // MCQ false-pair answers must not be promoted into standalone map facts.
    assert.ok(!row.body.includes("Neither 1 nor 2"), row.id);
    assert.ok(!row.body.includes("None of the statements"), row.id);
  }
});

test("all curated teaching diagrams render and library is lazy loaded", () => {
  assert.equal(NOTE_DIAGRAM_TEMPLATES.length, 30);
  for (const entry of NOTE_DIAGRAM_TEMPLATES) {
    assert.ok(renderNotesBody(entry.body).includes("<svg"), entry.title);
  }
  const ui = readFileSync("src/components/kkcc/diagram-template-library.tsx", "utf8");
  assert.ok(ui.includes('await import("@/lib/notes-visuals/syllabus-library.json")'));
});
