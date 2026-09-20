# Workflow

Pitcrew applies proportional depth. Classify the task before creating the full artifact set.

## Risk routing

Consider five inputs:

- reversibility: can the change be undone safely and cheaply?
- blast radius: how many components or users can observe it?
- familiarity: is the relevant execution path already evidenced?
- contract or data impact: can schemas, persisted data, or compatibility change?
- session span: must another session resume this work?

Use the normal repository workflow only when the task is familiar, local, reversible, single-session, and has no shared contract or data impact. A typo in one private error message qualifies. A field added to an API consumed by another repository enters Pitcrew even if the edit is one line.

## States and gates

| State | Alias | Completion criterion |
|---|---|---|
| `INTAKE` | Garage | Goal, observable success, constraints, and initial risk are recorded. |
| `DISCOVERY` | Track Walk | Relevant execution paths have revision-bound evidence; every blocking unknown is resolved or escalated. |
| `IMPACT_REVIEW` | Track Map | Direct, indirect, excluded, and uncertain impacts have evidence or an owner. |
| `PLAN_READY` | Race Strategy | Every step names evidence, scope, expected behavior, verification, and risk. |
| `PLAN_APPROVED` | Parc Ferme | A human approved a numbered plan version. |
| `IMPLEMENTING` | Stint | All approved steps are complete, or a drift predicate fired. |
| `PLAN_DRIFT` | Red Flag | The invalidated assumption and affected plan steps are recorded; state returns to `DISCOVERY`. |
| `VERIFYING` | Scrutineering | The verification matrix reconciles requirements, risks, impacts, changes, and tests. |
| `DONE` | Chequered Flag | Verification passed and no blocking unknown remains. |

Only Pitcrew changes task state. A reasoning provider may return findings, questions, or recommendations; it never approves a gate or selects the next state.

After an approved step completes, persist its result and remain in `IMPLEMENTING` while approved steps remain. Enter `VERIFYING` only after every approved step completes. Enter `PLAN_DRIFT` only when a drift predicate fires.

## Drift boundary

Significant drift is any new affected repository, contradicted contract or business rule, new schema or migration, changed compatibility assumption, or scope expansion. Set `PLAN_DRIFT`; preserve completed work; mark affected evidence and plan steps; return to discovery; issue a new plan version for approval.

An implementation detail is minor only when scope, observable behavior, constraints, compatibility, and verification remain unchanged. Record it in the current step without reopening the plan.
