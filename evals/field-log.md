# Field log

Paired scenarios in `results/` compare a control and a treatment arm under held-constant conditions. Real tasks cannot hold anything constant, so they cannot answer whether Pitcrew caused an outcome. They can still answer questions no scenario reaches: whether the routing threshold fires at the right time, which gate does real work, and where the process costs more than it returns.

This file records those tasks. One entry per task, written while the task is fresh.

## The rule

Every entry separates **Observed** from **Estimated**. Observed means a number or behavior someone can point at in a transcript, an artifact, or a diff. Estimated means anything reconstructed afterwards.

Estimated values never move into `results/`, `README.md`, or any public claim. A phase-cost breakdown inferred from how a session felt is an estimate even when it is written as a percentage.

When the harness does not expose a value, write `unavailable`. Do not substitute a guess.

## Repository hygiene

This repository is public and implementation-neutral. Entries describe the shape of a task, never the employer's service names, topology, schemas, business rules, or data. "A shared response field consumed by a second service" is the right level of detail.

## Entry format

```markdown
## FIELD-<N>

Date:
Harness and version:
Model:
Skill revision:
Repository shape:
Task shape:

### Routing
Routed into Pitcrew:
Was that the right call:
Artifacts created:

### Observed
Accepted:
Rework cycles:
Drift fired:
Human interventions:
Gates that changed the outcome:
Context resets, and what resumption cost:
Input tokens / output tokens / cache read:
Elapsed time:

### Friction
Where the process cost more than it returned:
What a reader wanted to skip:

### Estimated, not measured

```

## FIELD-001

Date: 2026-09-19
Harness and version: Antigravity CLI, version unavailable
Model: unavailable — the harness does not expose it
Skill revision: unavailable — the installation was a copy, not a pinned revision
Repository shape: a private backend service in a multi-service codebase, with an external data sync and a scoring configuration
Task shape: a full feature lifecycle — schema migration, domain logic, repository query, service, HTTP handler, and tests

### Routing
Routed into Pitcrew: yes
Was that the right call: yes, by the reporter's own assessment — the task crossed a migration, persisted data, and a second service's local environment
Artifacts created: all eight

### Observed
Accepted: yes — the feature merged with tests and a clean linter
Rework cycles: unavailable
Drift fired: no
Human interventions: at least one — the plan approval gate held, and implementation began only after a human approved the plan
Gates that changed the outcome:
- `DISCOVERY` surfaced a local database port collision with another service before implementation started, and the environment was corrected before anything crashed. The unknown register held it as a blocking item rather than an assumption.
- `PLAN_APPROVED` stopped implementation until a human approved a numbered plan.
- `VERIFYING` did **not** catch a set of house-style violations — a handler naming convention, a package-level logger call, and logic that belonged in the domain rather than the service. Focused tests passed and the linter reported no issues, so nothing in the verification matrix objected. A separate project-specific review agent found them afterwards. See the gap below.
Context resets, and what resumption cost: one compaction. Resumption read `status.md` and `plan.md` only, then continued. No repeated or exploratory re-reads were reported.
Input tokens / output tokens / cache read: unavailable. The harness reports session totals server-side, and its local conversation store holds no token fields in plain form.
Elapsed time: unavailable

### Friction
Where the process cost more than it returned: not on this task. The reporter judged eight artifacts proportionate to a feature of this size, and raised the cost only as a concern for smaller work.
What a reader wanted to skip: the full artifact set on short fixes and urgent bugs. No instance of that actually happening is recorded here, so this is a stated preference, not an observation.

### Estimated, not measured
- A phase-cost split of roughly 15–20% discovery and artifacts, 50% implementation and testing, 30% review and refactoring. Reconstructed from the shape of the session after the fact, with no token counts available.
- That Pitcrew reduced rework or token cost. The task ran one arm only. Nothing establishes what the same task would have cost without Pitcrew.
- That the session ran roughly 720 steps. Reported, not recounted.

### Gap this entry opens
`VERIFYING` reconciles requirements, risks, impacts, changes, and tests. A house-style violation is none of those, and `verification.md` has no column that would hold one, so a task can reach `DONE` with passing tests, a clean linter, and code that the repository's own conventions reject.

Pitcrew is implementation-neutral and cannot carry any repository's conventions. Before changing the gate, a scenario has to reproduce the failure: a fixture whose documented standard is violated by code that passes its tests.
