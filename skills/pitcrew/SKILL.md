---
name: pitcrew
description: Use when coding-agent work spans unfamiliar or interconnected repositories, shared contracts, migrations, business rules, multiple sessions, or other cases where incomplete discovery could cause material rework or missed impact.
---

# Pitcrew

Pitcrew establishes evidence before planning and keeps task state outside the conversation. Pitcrew alone owns phase transitions, approval gates, plan drift, and completion.

## Route by risk

Assess reversibility, blast radius, familiarity, contract or data impact, and whether work spans sessions. For a familiar, local, reversible change with no shared contract or data impact, state that the normal repository workflow is sufficient and stop using Pitcrew. Otherwise create or resume `.pitcrew/tasks/<task-id>/`.

Read [references/workflow.md](references/workflow.md) before classifying risk or changing state.

## Resume from state

Read `status.md` first. Then read only the current phase reference, artifacts named by `Current action`, and evidence they cite. Treat evidence from a different repository revision as stale. Do not reconstruct a task from conversation history when durable artifacts exist.

Read [references/task-artifacts.md](references/task-artifacts.md) when creating, updating, or checking task files.

## Advance one gate

Perform the current phase, satisfy its completion criterion, persist the result, and advance one state. Separate evidence, assumptions, and unknowns. A request for an immediate plan does not satisfy discovery.

Reasoning providers may help inside a phase. Regain control before evaluating a gate or changing state. Read [references/capability-providers.md](references/capability-providers.md) when selecting or invoking brainstorming or challenge support.

## Handle drift

When implementation reveals a new affected repository, contradicted contract or business rule, new schema or migration, changed compatibility assumption, or expanded scope, set `PLAN_DRIFT`, record the finding, and return to `DISCOVERY`. Version and reapprove the revised plan before implementation resumes. Do not represent significant drift as a generic blocker or silently patch the approved plan.

## Finish from impact

Enter `DONE` only when the verification matrix reconciles requirements, risks, impacted and excluded components, actual changes, and tests, with no blocking unknown. Passing focused tests alone is insufficient.

Read [references/evaluation.md](references/evaluation.md) only when running or interpreting a Pitcrew evaluation.
