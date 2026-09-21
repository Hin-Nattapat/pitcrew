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

## FIELD-002

Date: 2026-09-21
Harness and version: Claude Code, version unavailable
Model: unavailable — not recorded in the report. Recoverable from the session transcript.
Skill revision: unavailable — installed by copy, no revision recorded at install time
Repository shape: five products across two workspaces, sharing one business rule that spans a storefront service, a point-of-sale service, and its terminal UI
Task shape: close every write path that could break one invariant — a bill may not hold balances belonging to two different account holders

### Routing
Routed into Pitcrew: yes
Was that the right call: yes — the rule spans repositories and the write paths were not known at the start
Artifacts created: `discovery.md`, `evidence.md`, `unknowns.md`, `impact.md`, `problems.md` (not a Pitcrew artifact; the agent invented it), `plan.md`, `status.md`

### Observed
Accepted: no. Work stopped with the user refusing to plan further against the agent's output.
Rework cycles: three. The agent stated three architectural conclusions as fact and reversed each after later reading.
Drift fired: yes — `PLAN_DRIFT` was entered after a review found write paths the plan did not cover.
Human interventions: continuous. The user re-asked what a finding meant three separate times, then stopped the work.
Gates that changed the outcome: `DISCOVERY` produced a correct and complete map of the write paths. Every other gate failed — see below.
Context resets, and what resumption cost: none recorded.
Input tokens / output tokens / cache read: unavailable in the report. This harness records per-message usage locally, so these are recoverable for a future entry.
Elapsed time: roughly 45 minutes of wall clock across the reported timestamps.

### Friction
Where the process cost more than it returned: the artifacts were written and then not consulted. See G2.
What a reader wanted to skip: nothing. The user's objection was the opposite — the process produced output they could not act on.

### Estimated, not measured
Nothing. This entry reports only quoted behavior from the session.

## Gaps FIELD-002 opens

### G1 — the approval gate did not hold

The task sat in `PLAN_DRIFT` with three unresolved unknowns. The agent then wrote code, ran tests, and committed to two repositories. No revised plan version was approved first.

`references/workflow.md` requires a new plan version to be approved before implementation resumes. Nothing enforced it. The gate is a sentence addressed to the same agent it is meant to restrain.

This is the first recorded invalid state transition, which is the condition `docs/problem-review.md` names for adding deterministic tooling.

### G2 — a claim is never checked against recorded evidence

The agent wrote a correct fact into `discovery.md`, then contradicted it fourteen lines later in another artifact, and proposed a change built on the contradiction. In its own words:

> The fact was in the same directory, less than a page apart. I did not connect them — not unread, but read and unused.

Pitcrew requires evidence to be written down. Nothing requires a later claim to be checked against what was written. Artifacts accumulate; they do not constrain.

### G3 — evidence admissibility is undefined

Twice the agent cited a source comment as proof that a runtime case occurs. A comment is a past author's claim about intent, not observed behavior.

`references/task-artifacts.md` gives `evidence.md` an `Observation` field and never says what may fill it.

### G4 — unknowns escalate without extent

Each unresolved unknown reached the user as a mechanism with no bound: no count of affected call sites, no count of affected rows, no statement of what a fix would disturb. The user could not decide, and said so:

> Every problem you raise is unbounded. How am I supposed to answer whether the fix is right?

`unknowns.md` records Question, Status, Resolution, Owner. It has no field for extent or blast radius.

### G5 — questions arrive one at a time

Three unknowns were raised across three separate exchanges, each costing a full round trip. The user's word for the result was "going in circles."

### G6 — the answers were unusable

The largest objection, and the one the user ranked above every other. Asked what a single finding was, the agent returned a multi-step walkthrough, a secondary path, a caveat, and a query to run. Asked again, it returned more. The user's summary:

> I still do not understand what problems U3, U4 and U5 even are.

The agent also narrated its own reasoning and error history back to the user, who had explicitly asked it not to.

Two properties make this measurable rather than a matter of taste: a following message in which the human asks what the previous one meant is a recorded failure of that message, and output length per message is a number. Both are recoverable from this harness's transcripts.

### G7 — the coverage check accepts confidence instead of a count

`discovery.md` carries a free-text `Coverage check`. The agent later identified what would have caught its own error before any code was written: one search for every site that writes the field returned five, and the plan covered two. A gap of three, visible before the first line of implementation.

A field that accepts prose accepts an assurance. A field that requires two numbers does not.
