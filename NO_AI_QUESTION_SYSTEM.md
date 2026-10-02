# KKCC Deterministic No-AI Question System

The question engine can run without Gemini, OpenAI, web search, or any other AI API.

## How it works

`trusted facts/data + deterministic templates -> question generated on demand -> quality gates -> test`

The generator does **not** insert generated question text into Supabase. The existing
Supabase database remains responsible for normal app data such as users, enrollments,
progress, attempts, payments, coins and test configuration.

## Quality controls

Every candidate passes the existing hard publishability gate and an additional
zero-AI deterministic quality check. The checks cover:

- non-empty and meaningful stem
- exactly four distinct options
- non-empty answer and explanation
- placeholder/undefined content rejection
- duplicate option rejection
- duplicate prompt protection within a generated test
- explanation-not-just-answer check
- option-length anomaly penalty
- answer leakage penalty for simple stems
- exam, subject, topic and difficulty routing
- high-yield/exact-exam prioritisation
- template/topic diversity while filling a paper

A candidate below the deterministic quality threshold is skipped rather than used
just to reach the requested count.

## Quantity

The bank is template-driven. A single trusted fact table can produce forward,
reverse, matching, statement, statement-count and numeric variants. This creates a
large finite set of reproducible questions without storing millions of individual
question rows.

The generator can keep drawing until it reaches the requested test count or the
filtered bank is exhausted. It never claims an unavailable question exists.

## Important limitation

Deterministic validation can catch structural and construction errors very well,
but it cannot independently prove that a source fact is historically/scientifically
true. Source facts must therefore be curated from trusted material when new
question families are added.

## On-demand test mode

A test can now be marked `question_source = deterministic`. In that mode Supabase stores only the generation recipe (`generation_exam`, `generation_subject`, `generation_topic`, `generation_difficulty`, `generation_count`). The MCQ text/options/explanations are generated fresh on every test-open request and are never inserted into `test_questions`.

This means reopening a test gives a fresh draw. Because no history is stored, the system cannot promise that every question will be globally new forever; it can only generate a fresh random draw from the available deterministic bank.
