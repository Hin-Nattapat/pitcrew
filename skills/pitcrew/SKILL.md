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

Perform the current phase, satisfy its completion criterion, persist the result, and advance one state. Do not advance while the task's `check.sh` exits non-zero; report what it printed rather than your reading of it. Read [references/checks.md](references/checks.md) when writing, running, or repairing that script. Separate evidence, assumptions, and unknowns. A request for an immediate plan does not satisfy discovery.

Reasoning providers may help inside a phase. Run them in a subagent so their instructions never reach this context, and evaluate the gate yourself from what they return. Read [references/capability-providers.md](references/capability-providers.md) when selecting or invoking brainstorming or challenge support.

## Report so a human can act

Open with what the thing is, in the language of the work, in a sentence the reader could repeat without opening the repository. Delete any sentence that would read just as well in a different task. Propose nothing until that first sentence has landed — asking someone to run a command is asking for consent, and consent without comprehension is worthless. Keep detail in the artifact and name it once.

Read [references/reporting.md](references/reporting.md) before reporting findings, escalating an unknown, asking for approval, or refusing to do what you were asked. A refusal is held to this contract too: give the reason once, in the language of the work, and do not recite the rule you are following back to the person you are refusing.

## Handle drift

When implementation reveals a new affected repository, contradicted contract or business rule, new schema or migration, changed compatibility assumption, or expanded scope, set `PLAN_DRIFT`, record the finding, and return to `DISCOVERY`. Version and reapprove the revised plan before implementation resumes. Do not represent significant drift as a generic blocker or silently patch the approved plan.

## Finish from impact

Enter `DONE` only when the verification matrix reconciles requirements, risks, impacted and excluded components, actual changes, and tests, with no blocking unknown. Passing focused tests alone is insufficient.

Read [references/evaluation.md](references/evaluation.md) only when running or interpreting a Pitcrew evaluation.
