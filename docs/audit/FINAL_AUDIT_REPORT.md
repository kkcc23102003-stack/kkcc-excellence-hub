# KKCC Excellence Hub — FINAL AUDIT REPORT (re-verified)

Audit-only phase. **No application code, content, questions, templates, SQL, auth or Supabase configuration was modified.**
The only file written this turn is this report. Every number below was re-checked against the artifacts in this workspace.

---

## 1. Did the exhaustive bank audit actually complete?

**YES — completed successfully (exit 0), independently of the E2E suite.**

Evidence chain:

| Check | Result |
|---|---|
| `bank-audit-full.log` progress lines | Audited 500 → 7000 / 7451 templates, running position count reaching 12,325,877 before the final summary |
| Final log summary | `{"officialRules":35,"paidCatalogueTracks":43,"bankLabels":67,"templates":7451,"positions":12330532,"checked":12330532,"nulls":915520,"structuralInvalid":4403,"qualityRejected":12,"valid":11410597,"exceptions":0,"preserved":true,"empty":0}` |
| `checked == positions` | **12,330,532 == 12,330,532** → every parameter position was examined (not sampled) |
| `exceptions` | **0** |
| `empty` (chapters with no drawable content) | **0** |
| Script exit semantics (tail of `scripts/audit-question-bank.ts`) | `process.exitCode = 1` only if `!preserved || exceptions`; both were false → exit 0 |
| Sample-vs-full comparison | `bank-audit-sample.log`: same template/position totals but `checked: 34,926` (~0.28 %) → confirms the `--full` run genuinely swept the whole space; sample artefacts were not overwritten |
| Authoritative output | `docs/audit/question-bank-audit.json`, sha256 `b47ddcc7…7409`, 15.6 MB, `mode: "exhaustive-all-parameter-positions"`, `generatedAt: 2026-10-01T11:27:17Z`, `templates: [7451]`, `exams: [67]` |
| Internal consistency | Summing `positions/checked/nulls/invalid/rejected/valid/exceptions` over all 7,451 template records reproduces every published aggregate exactly |
| Cross-check vs `bank-gate-diagnostics.log` | `forbidden:undefined 4209` + `explanation<24 194` = **4,403** = `structuralInvalid` ✔; `builder-returned-null 1,188` is counted inside `nulls` (915,520), not as invalid ✔ |
| Cross-check vs coverage docs | `exam-coverage.csv` and `QUESTION_BANK_COVERAGE.md` rows recompute to 67 labels / 78 subjects / 968 subject-chapter pairs / 11,605 slices, matching the JSON |
| Preservation check vs baseline | `docs/audit/baseline-bank.json` holds **6,586** original template IDs; **0 of them are missing** from the current 7,451 → `originalTemplatesPreserved: true` is objectively proven. Positions 12,197,177 → 12,330,532 (**+133,355**), i.e. exactly the 865 added practice templates |

The passing Playwright run was **not** used as evidence of audit completion — the audit is a separate, standalone process whose own counters prove it finished.

---

## 2. Totals (verified)

| Metric | Value |
|---|---|
| Exam / bank labels (`getExamBankExams`) | **67** |
| Official syllabus rules (`OFFICIAL_SYLLABUS_RULES`) | **35** (user's correction confirmed; no invented 36th exists in code) |
| Paid catalogue tracks / paid series / learning series / additional practice | 43 / 56 / 80 / 24 |
| Unique subjects | **78** |
| Exam–subject pairs | **919** |
| Subject–chapter pairs | **968** |
| Unique chapter labels | **940** |
| Exam–subject–chapter slices | **11,605** (0 duplicate slices, 0 blank labels, 0 duplicate exam names) |
| Templates | **7,451** = 6,586 original + 865 practice/foundation (all originals preserved) |
| Parameter positions | **12,330,532** = 12,197,177 + 133,355 — all checked |
| Valid positions | **11,410,597** |
| Null / never-served | **915,520** (incl. 1,188 builder-returned-null) |
| Structural-invalid | **4,403** (4,209 literal `"undefined"`; 194 explanation < 24 chars) |
| Quality-rejected | **12** (5 Punjabi templates) |

---

## 3. Findings by requested category

### Missing coverage
- **11,363 of 11,605 slices (97.9 %) are underfilled** — a generated paper draws < 60 questions (`underfilled: draw.length < 60`).
- **4,331 slices are missing ≥ 1 difficulty tier**: Difficult missing in 3,223; Easy 1,608; Moderate 1,293.
- Draw distribution: 1,596 slices cap at exactly 20, 688 at 32; **197 slices < 20**, **2,139 < 30**.
- **7 exams / 9 omitted catalogue subject mappings** (recorded, not silently faked):
  CBSE Class 11 Commerce → Business Economics; CBSE Class 12 Commerce → Business Economics; CS Executive → Business Economics, Auditing and Ethics; `master-cadre-art-craft`, `master-cadre-sst`, `master-cadre-music` → Art and Culture; RRB ALP → Computer Awareness; RRB NTPC → Computer Awareness.
- **580 zero-count templates** (571 `:stmt3`, 5 `:match`, 4 `:stmt`) declare no drawable content.
- **32 of 67 labels have no recorded official source URL** in the audit record (`source` empty; `officialRule: false` for the same 32).

### Duplicate questions/templates
- **0 duplicate exported template IDs**; 0 duplicate slices; 0 untagged/blank-metadata templates.
- **14 legacy collision IDs remain suffixed `#2`** (`ca:law:contract:{fwd,match,stmt,stmt3}#2`, `hi:sandhi:*#2`, `hi:samas:*#2`, `practice:foundation:ca:law:contract:fwd#2`, `practice:foundation:hi:sandhi:fwd#2`) — IDs deliberately preserved rather than renumbered; the risk is the same content being addressable under two IDs.

### Orphan / unmapped
- **0 orphan rows** in the project-content store; 0 orphans found by the gate diagnostics.
- **63 dead templates** occupy 6,538 positions with `all-null = true` (generated, never servable). Composition verified: 54 `:adv:match` (44 CBSE 9–10 `n9`/`n10` + 10 ICSE 9–10 `im9`/`im10`), 5 `:adv:fwd` (`im9:standard-angles`, `hy:geography/economy/science/punjab`), 4 plain `:fwd` (`ca:acc:classify`, `comp2:devices`, `eg:article`, **`practice:foundation:ca:acc:classify:fwd`** — the defect propagated into the new practice layer from its dead parent).

### Invalid exam / subject / chapter mappings
- 4,403 structural-invalid positions (above) are hidden by runtime gates — never served, but they are lost supply.
- 12 quality-rejected positions in 5 Punjabi templates.
- Grade-scope violation: **ISC Class 11 templates tagged into Class-12 topics — 129; ISC Class 12 tagged into Class-12 topics — 254**; ISC grade scope is not enforced (CBSE 9/10 grade gating is).
- 0 invalid exam names, 0 duplicate exam labels, 0 empty chapter labels.

### PYQ mapping
- Real PYQ exam/year/source metadata is preserved; generated additions are practice-only, never labelled official/PYQ.
- **6 copy sites still contradict that provenance**: `src/lib/kittu-batch-catalog.ts` (`"PYQ-style"` mode), `src/routes/admin.ai-question-engine.tsx:286` ("optimizes for … PYQ patterns"), `src/routes/games.tsx:816` + `:2334`, `src/routes/index.tsx:414` ("PYQ-style practice"), `src/routes/test-series.tsx:152`.

### Class 9–10 coverage
- CBSE Class 9 (3 subjects / 43 chapters / 309 templates), CBSE Class 10 (4/41/387), CBSE Class 9-10 (13/147/1,149), ICSE Class 9 (6/74/599), ICSE Class 10 (6/71/605), ICSE Class 9-10 (13/173/1,477), PSEB Class 9-10 (9/109/1,000) — no empty chapters anywhere.
- Concentrated defects: 54 of the 63 dead templates are the 9–10 `:adv:match` families; `im9:standard-angles:adv:fwd` is dead.
- **66 `(old NCERT)` templates** remain in circulation, **11 of them under the strict `CBSE Class 9` label** (e.g. `n9:sci:diversity:*`), while current CBSE 9 lists still include Diversity / Periodic Classification / Sources of Energy / Management of Natural Resources.
- CBSE Class 9 is the only 9–10 label with a formal official rule (`officialRule: true`); CBSE 9-10, ICSE 9-10 and ICSE 10 are the most underfilled families (126–173 of their slices each).

### Class 11–12 coverage
- CBSE 11 (12/70/449), CBSE 12 (12/58/389), CBSE 11-12 Science (4/104/588), CBSE 11-12 Commerce (9/50/373), ISC 11 (12/99/598), ISC 12 (12/102/589), ISC Science (4/104/588), ISC Commerce (9/50/373), JEE Main (3/74/439), JEE Advanced (3/76/462), NEET (3/85/556).
- ISC 11/12: 100 % of slices underfilled (99/99 and 102/102) and 64 / 68 slices missing a tier; plus the 129 / 254 grade mis-tags above.
- CBSE 11-12 Science is the worst tier gap (84 of 104 slices missing a tier).

### Difficulty / exam / template issues
- Tier gaps and underfill per above; the audit's finite parameter space is **not** unique verified questions and does not prove current-syllabus completeness.
- `fullOfficialSyllabusVerified = false` for all 67 labels; CISCE, NEET, UPSC, PPSC, RRB, PSEB and CA sign-off outstanding.

### Runtime / generation issues
- The non-coprime `textOptions` stride bug (empty Calendars / Logical Sequence of Words) was fixed earlier and is confirmed absent from this audit.
- **`src/routes/games.tsx` `makeFallbackQuestion()` still ends with a hard-coded Polity item (“Article 14”, options Article 14/19/21/32, lines ~568, ~3203, ~4084) reachable under any subject label.**
- 915,520 never-served positions (incl. 1,188 builder-null) and 63 all-null templates are generated each run — wasted generation work, not served content.
- Gate weakness: the audit script fails only on preservation/exceptions, so 4,403 invalid and 63 dead artefacts do **not** fail the run or CI.

### Supabase educational-content boundary
**Holding (re-verified in source this turn):**
- Every educational-looking call in `src/` (`.from("courses"|"lectures"|"materials"|"tests"|"test_questions"|"files"|"site_settings"|"private_settings"|"test_series_overrides"|"ai_question_*")`) is made on **`projectContent`**, the file-backed adapter (`src/lib/project-content.server.ts`, storage `data/project-content.runtime.json`, no `createClient`/`supabase.co`/`fetch` inside it) — not on a Supabase client.
- The Supabase client touches only student/user/auth-domain tables: profiles, user_roles, student_blocks, notifications(+reads), student_doubts, course_enrollments, coupons(+redemptions), admission_enquiries, learning_attempts, coin_*, voucher_*, series_access_grants, test_access_grants, offline_access_grants, payment_transactions, material_purchases.
- `learning_attempts` carries **no educational columns** (exam/subject/chapter/seed removed; `question_timer_seconds` / `answer_revision` only).
- The AI research Edge Function is a 410 stub; research runs server-side.

**Still violating (open):**
- **52 `site_settings` + 15 `test_series_overrides` rows remain publicly readable** via the legacy API (`docs/audit/public-export-status.json`); educational tables show 0 public rows.
- **Legacy Supabase-educational-schema artefacts remain, now verified larger than previously reported:** repo `supabase/RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql` (25 DDL statements, banner present) and `kkcc-excellence-hub-sql-cleaner.sql` (23 DDL statements, banner present) plus `AI_QUESTION_ENGINE_SETUP.md` (instructs deploying the Edge Function + `20261001010000_kkcc_ai_question_engine` migration) — **and 13 SQL files under `public/downloads/` that carry NO warning banner**, including `kkcc-excellence-hub-one-combined.sql` (23 `CREATE TABLE`s covering courses, lectures, materials, tests, test_questions, files, site_settings, private_settings; 13 references to `storage.objects`/`storage.buckets`; 4 mentions of `ai_question_*`) and the 9 `sql-parts/`. They are linked from the served page `public/downloads/index.html` with the instruction “Run this after the cleaner, or directly on a fresh Supabase project.”
- Root cause verified: `scripts/repository-quality-check.mjs` **explicitly skips `public/downloads/`** (line ~37), which is why `check:repo` passed while these files went unaudited.
- Educational assets still in Supabase Storage with legacy policies and year-long signed URLs (recorded from the earlier public-API inspection; **not re-verifiable in this sandbox without credentials**).
- The student-only migration + `supabase/STUDENT_ONLY_SCHEMA.sql` exist and pass PGlite fixtures locally but remain **unapplied remotely**; no private owner export of real data has been taken.

---

## 4. Complete open issue register

### CRITICAL (3)
1. **Access cutover not executed on production** — student-only migration unapplied, no verified private export, legacy educational rows/assets unverified and unrevoked, 52 + 15 config rows still publicly readable.
2. **Legacy Supabase-educational-schema artefacts still present and reachable** — repo SQL/doc remnants (25 / 23 DDL) *plus* **13 un-bannered SQL files publicly served from `public/downloads/`** (one-combined creates the full educational schema incl. storage policies and AI-engine tables) linked from the app's own download page; the repo-quality gate skips that folder.
3. **Educational files remain in Supabase Storage** under legacy policies with year-long signed URLs.

### HIGH (8)
4. 4,209 positions contain the literal string `"undefined"` (4,403 structural-invalid total) — never served, but lost supply.
5. 63 dead templates / 6,538 all-null positions (54 `:adv:match` 9–10 families; 1 defect propagated into the practice layer).
6. Chronic underfill — 11,363 of 11,605 slices (< 60 draw); 197 slices < 20.
7. Missing difficulty tiers — 4,331 slices (Difficult 3,223 / Easy 1,608 / Moderate 1,293).
8. ISC grade scope unenforced — 129 Class-11 tags inside Class-12 topics, 254 Class-12 tags.
9. `games.tsx` hard-coded Polity “Article 14” fallback reachable under any subject.
10. Academic sign-off outstanding — `fullOfficialSyllabusVerified = false` for all 67 labels (CISCE/NEET/UPSC/PPSC/RRB/PSEB/CA); 32 labels have no recorded source URL.
11. 580 zero-count templates overstate pool numbers.

### MEDIUM (7)
12. 66 `(old NCERT)` templates, 11 under the strict `CBSE Class 9` label.
13. 14 legacy `#2` collision IDs still coexist with their originals.
14. 9 omitted paid-catalogue subject mappings across 7 exams.
15. 6 copy sites label practice content “PYQ-style / PYQ patterns”.
16. Stale public claims in the served download banner (“78 subjects, 941 chapters, 1,21,41,553 questions, 55 paid series”) contradict measured values (78 subjects, 940 chapter labels, 12,330,532 positions, 56 paid series).
17. 32 of 67 labels carry no official source URL in the audit record.
18. `scripts/repository-quality-check.mjs` excludes `public/downloads/`, so served SQL escapes every check (root cause of critical 2).

### LOW (3)
19. 11 react-refresh lint warnings (0 errors) remain.
20. Full Playwright suite not rerun after the post-run mobile CSS fix (mobile test passes in isolation; 72/1 was pre-fix).
21. The audit and quality gates do not fail on structural-invalid / dead-template counts (exit code reacts only to preservation and exceptions), so these regressions can return silently.

---

## 5. What was NOT done (per instruction)
- No application file, question, template, option, answer, mapping, SQL, auth or Supabase configuration was modified.
- Nothing was redesigned, deleted or moved; **Questions and Question Bank remain outside Supabase.**
- No fixes were applied to any of the 21 issues above; all remain open.
