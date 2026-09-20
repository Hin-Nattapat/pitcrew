# Pitcrew V0 Paired Comparison

## Environment equivalence check

The control and treatment used the same five scenario files and Codex collaboration mechanism, and each response came from a fresh subagent. Control ran from a working tree based on `419d320` with uncommitted fixtures; treatment ran at `fb4b4db` with skill content from `3a1c491`. Exact submitted prompts, hash construction, model identity, permissions profile, tokens, elapsed time, and harness version were unavailable. Treatment necessarily added Pitcrew instructions and references. Run order was control then treatment, not balanced.

These gaps prevent a causal claim that Pitcrew, rather than model or scorer variance, caused any difference.

## Per-scenario results

| Scenario | Control score | Treatment first-run score | Control blocker | Treatment blocker | Observable change |
|---|---:|---:|---|---|---|
| premature-planning | 3/10 | 8/10 | yes | no | Deferred planning until consumer and contract evidence exists. |
| plan-drift | 8/10 | 7/10 | yes | no | Named `PLAN_DRIFT`, invalidated the plan, and returned to discovery. |
| premature-completion | 8/10 | 7/10 | no | no | Refused `DONE` and named both recorded verification gaps. |
| session-resumption | 8/10 | 7/10 | no | no | Requested only the current compatibility evidence and revision refresh. |
| provider-selection | 6/10 | 3/10 | n/a | no | Treatment conformance only: recorded deterministic fallback and stop identities with stable state. |

Scores fell on several scenarios even where the required behavior improved. The rubric rewards already-produced evidence and completion reconciliation, which intermediate routing scenarios intentionally do not contain.

## Correctness blockers

Control had two comparable blockers: premature planning from an unverified compatibility assumption and informal handling of plan drift. Provider identity is excluded because the required Pitcrew vocabulary was not disclosed to control.

Treatment had no correctness blocker in the comparable scenarios. Provider selection passed its treatment-only conformance check.

## Cost

Tokens, elapsed time, and tokens per accepted task are unavailable because the collaboration harness did not expose them. Cost effectiveness is therefore unmeasured in this pilot.

## Observed improvements

- Planning waited for evidence instead of choosing contract semantics.
- Significant drift explicitly invalidated and re-versioned the plan.
- Completion remained blocked by unverified impact.
- Resumption stayed narrow and revision-aware.
- Missing-provider behavior passed the Pitcrew conformance check; it is not a causal control improvement.
- A genuinely low-risk task exited the full workflow.

## Observed regressions

- Responses became more procedural; token cost could not be measured.
- Aggregate rubric score did not improve consistently.

## Confounders and limitations

- Exact model/version and run cost were unavailable.
- Only one paired run per scenario was performed.
- Run order was not randomized.
- Different blind scorers applied the rubric differently.
- Scenarios supplied prose fixtures rather than runnable repositories.
- Claude packaging was discovered structurally; a behavioral run was attempted but stopped immediately at the account weekly limit.

## Decision

**Release a limited pilot; effectiveness remains inconclusive.** The blocker-oriented behaviors improved after one evidence-driven correction, which is enough to test Pitcrew on real work. It is not enough to claim token savings, faster completion, or causal superiority over an unassisted agent. Before a broader claim, revise the rubric for phase-appropriate or not-applicable dimensions, expose model and cost telemetry, randomize order, and run repeated accepted tasks on fixed repository revisions.
