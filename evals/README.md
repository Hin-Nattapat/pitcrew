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
