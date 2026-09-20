# Pitcrew Evaluations

These evaluations compare observable engineering behavior, not writing style or use of Pitcrew vocabulary.

## Procedure

1. Start every run in a fresh context.
2. Hold scenario text, model/version, harness, permissions, and source material constant.
3. Run the control without loading Pitcrew.
4. Preserve the raw response outside the scoring sheet.
5. Have a separate reviewer score it using [rubric.md](rubric.md).
6. Record environment, score, blockers, exact failure quotes, tokens, and elapsed time.
7. Treat one run as a smoke test; do not claim effectiveness from it.

Use the same scenario files unchanged for control and treatment. A run is accepted only when it has no correctness blocker.

## Real tasks

Scenario runs answer whether Pitcrew changes behavior under held-constant conditions. They cannot say whether its routing threshold fires at the right time on real work, because the scenarios choose that for them.

Record real tasks in [field-log.md](field-log.md). A field entry is not paired evidence and never supports an effectiveness claim; it collects routing decisions, gate outcomes, and friction that scenarios cannot reach. Entries separate observed values from estimated ones, and estimates stay out of `results/` and the public README.
