import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_TEMPLATES } from "../../src/lib/exam-bank/index";
import { checkDeterministicQuality } from "../../src/lib/exam-bank/deterministic-quality";
test("Punjabi gender/number explanations pass unchanged quality rules for every emitted forward/reverse item", () => {
  const templates = ALL_TEMPLATES.filter((t) => /^pa:(ling|vachan):(fwd|rev)$/.test(t.id));
  assert.equal(templates.length, 4);
  for (const t of templates)
    for (let i = 0; i < t.count; i++) {
      const q = t.at(i);
      if (!q) continue;
      assert.ok(checkDeterministicQuality(q).publishable, `${t.id}:${i}`);
      assert.ok(q.explanation.length > 40);
    }
});
