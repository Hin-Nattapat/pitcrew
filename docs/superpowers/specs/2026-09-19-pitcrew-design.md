# Pitcrew V0 Design

## Status

Proposed design for review. This document authorizes no implementation beyond the repository documentation itself.

## Product statement

AI coding agents are getting faster. They still need a pit crew.

Pitcrew is a portable, evidence-driven engineering workflow for coding agents working in unfamiliar, large, or interconnected repositories. It helps an agent establish what is true before planning, preserve task state outside the conversation, detect when implementation invalidates the plan, and verify the result against the affected system rather than tests alone.

Pitcrew is model-agnostic. Its first distribution targets both Claude Code and Codex through the open Agent Skills format.

## Problem diagnosis

Token exhaustion is a visible symptom, not the root problem. The recurring failure pattern is:

1. An agent plans before tracing the real execution path.
2. Evidence, assumptions, and unknowns remain mixed in conversation history.
3. Implementation reveals missed dependencies or business rules.
4. The agent patches the plan implicitly and continues.
5. Review discovers scope drift, missing impacts, or incorrect behavior.
6. A later session repeats part of the investigation because task state was not preserved.

Reading more files indiscriminately does not solve this. It can increase token consumption while leaving the agent unsure whether discovery is complete. The workflow needs explicit sufficiency criteria, durable evidence, and controlled re-entry when new facts invalidate the plan.

## Design principles

Pitcrew preserves five non-negotiable rules:

1. Discover before planning.
2. Use evidence before assumptions.
3. Freeze an approved plan before implementation.
4. Verify against impact, not only tests.
5. Persist task state outside the conversation.

Additional principles:

- Keep the workflow independent of any model or agent harness.
- Use clear engineering terms as canonical state names; F1 language is a memorable alias, not hidden jargon.
- Spend process in proportion to risk. Small, local, reversible work must not require the full race procedure.
- Treat significant plan drift as new information, not as permission to patch opportunistically.
- Prove the workflow before building an engine around it.

## V0 scope

V0 is a documentation-first Agent Skill repository. It contains:

- one `pitcrew` skill;
- workflow and task-artifact references;
- a manual evaluation protocol and scoring rubric;
- public-facing documentation of the problem, decisions, open questions, and roadmap;
- realistic evaluation scenarios used to test the skill before release.

V0 contains no CLI, MCP server, database, code indexer, graph store, hosted service, or multi-agent orchestrator.

## Workflow

Canonical states remain explicit and machine-friendly. Branded aliases make the workflow memorable.

| State | Pitcrew alias | Completion condition |
|---|---|---|
| `INTAKE` | Garage | Goal, constraints, success criteria, and initial risk are recorded. |
| `DISCOVERY` | Track Walk | Relevant execution paths are evidenced and blocking unknowns are resolved or escalated. |
| `IMPACT_REVIEW` | Track Map | Direct, indirect, excluded, and uncertain impacts are accounted for. |
| `PLAN_READY` | Race Strategy | Every plan step cites evidence, scope, expected behavior, and verification. |
| `PLAN_APPROVED` | Parc Ferme | A human approves a versioned implementation contract. |
| `IMPLEMENTING` | Stint | Work follows the approved plan one bounded step at a time. |
| `VERIFYING` | Scrutineering | Requirements, risks, impacts, tests, and actual changes are reconciled. |
| `DONE` | Chequered Flag | Completion criteria pass and no blocking unknown remains. |

When an implementation finding invalidates the approved scope, contract, business rule, or compatibility assumption, the task enters `PLAN_DRIFT` (`RED_FLAG`) and returns to discovery. Minor implementation detail that preserves the contract does not reopen the plan.

## Task artifacts

The consuming repository stores task state in a project-local `.pitcrew/tasks/<task-id>/` directory. V0 defines the schemas as Markdown templates rather than executable validation.

Minimum artifacts:

```text
.pitcrew/tasks/<task-id>/
├── intake.md
├── discovery.md
├── evidence.md
├── unknowns.md
├── impact.md
├── plan.md
├── verification.md
└── status.md
```

Artifacts contain decisions and evidence, not raw transcripts. Code evidence records repository, revision, file, symbol or line reference, and the conclusion it supports. Each artifact states its completion condition so another session can resume without reconstructing the entire conversation.

## Skill behavior

The `pitcrew` skill activates for work where incomplete discovery creates material risk: cross-repository changes, unfamiliar brownfield behavior, shared contracts, migrations, business rules, or work likely to span sessions.

The skill first classifies risk. Low-risk local work exits to the repository's normal workflow. Qualifying work follows the state machine, loads only the reference needed for the current phase, and updates durable task artifacts at phase boundaries.

Pitcrew owns task state and gates. Brainstorming, grilling, debugging, TDD, and code review remain optional reasoning techniques inside the relevant phase. They do not become competing orchestrators.

## Capability providers

Pitcrew owns orchestration but may delegate bounded reasoning work to separately installed skills. These skills are capability providers, not workflow owners.

| Capability | Example provider | Boundary |
|---|---|---|
| `brainstorm` | `superpowers:brainstorming` | Clarifies intent and explores alternatives, then returns its result to the current Pitcrew phase. |
| `challenge` | `grilling` or `grill-me-with-docs` | Challenges the evidence-backed analysis or plan, then returns findings without advancing task state. |

Agent Skill metadata does not provide portable skill-to-skill dependency installation. Pitcrew therefore must not assume an external provider is present or attempt to install one implicitly. Public installation includes a small built-in procedure for each required capability so the core workflow remains usable by itself.

A consuming repository may select stricter providers in `.pitcrew/config.yaml`:

```yaml
providers:
  brainstorm: superpowers:brainstorming
  challenge: grilling

requirements:
  missing_provider: stop
```

`missing_provider` has two policies:

- `fallback` uses Pitcrew's built-in procedure and records that choice. This is the public default.
- `stop` reports the missing skill and waits for the user to install it or change the project configuration.

Provider selection changes reasoning inside a phase only. A provider cannot approve a gate, freeze or revise a plan, mutate Pitcrew task state, or continue into another phase. Control always returns to Pitcrew.

For reproducibility, every task records the resolved harness, model, Pitcrew version, and provider identities when known:

```yaml
environment:
  harness: claude-code
  model: provider/model-version
  pitcrew_version: 0.1.0
  providers:
    brainstorm: superpowers:brainstorming@6.4.1
    challenge: grilling@1.0.0
```

## Evaluation design

Pitcrew must be evaluated against ordinary agent behavior, not against another model.

Each comparison holds constant:

- task and acceptance criteria;
- repository revision and starting state;
- model and model version;
- agent harness and tool permissions;
- starting prompt and available source material;
- reasoning provider names, versions, and missing-provider policy.

The control arm works without Pitcrew. The treatment arm uses Pitcrew. Run order should be balanced, outputs should be scored against the same rubric, and reviewers should be blind to the arm where practical. A single paired run is a smoke test, not evidence of effectiveness.

Primary outcome metrics:

- accepted-task completion rate;
- correctness and escaped defects;
- missed impacted components or compatibility boundaries;
- plan changes after implementation begins;
- rework cycles;
- unresolved assumptions presented as facts.

Cost metrics:

- input and output tokens per accepted task;
- elapsed time per accepted task;
- number of files read and proportion later judged relevant;
- human interventions and review rounds.

The primary efficiency measure is tokens per accepted task. Lower tokens with a defective result is not an improvement.

## Repository shape

The intended V0 layout is:

```text
pitcrew/
├── README.md
├── LICENSE
├── AGENTS.md
├── CLAUDE.md
├── skills/
│   └── pitcrew/
│       ├── SKILL.md
│       └── references/
│           ├── workflow.md
│           ├── task-artifacts.md
│           └── evaluation.md
├── docs/
│   ├── problem-review.md
│   ├── design-decisions.md
│   ├── open-questions.md
│   └── roadmap.md
└── evals/
    ├── README.md
    ├── rubric.md
    └── scenarios/
```

Directories are created only when their first real file is ready. Empty placeholders are not part of the implementation.

## Distribution

The canonical source is `skills/pitcrew/`. Direct installation into a project or user skill directory remains useful for local development and trials. Public reusable distribution packages the skill as a minimal plugin because plugins provide the installable unit for sharing one or more skills across repositories.

V0 includes one Pitcrew skill. External reasoning providers remain separate installations. The plugin does not silently bundle or copy third-party skills. Harness-specific manifests or adapters are added only where the shared Agent Skills package cannot express required installation behavior.

The repository is public and implementation-neutral. Company-specific topology, service names, credentials, production data, and proprietary business rules remain outside it.

## Relationship to the original handoff

The original handoff correctly identifies the five core rules, phase-separated context, evidence ledger, unknown registry, impact review, plan drift, verification matrix, recovery checkpoints, and causal measurement problem. Pitcrew retains those concepts.

V0 defers the handoff's proposed code-intelligence engine, MCP server, language extractors, graph storage, business-knowledge integrations, and Teams support. Those are possible solutions to measured bottlenecks, not prerequisites for testing the workflow. The handoff's proposed V1 therefore becomes a later roadmap candidate rather than the first release.

## Future decision gates

Add deterministic tooling only after evaluation shows a repeated manual bottleneck:

- Add schema validation when malformed artifacts cause real failures.
- Add a CLI when phase transitions or resumption are unreliable without it.
- Add code indexing when targeted repository search dominates cost or misses cross-repository edges.
- Add MCP when multiple harnesses need the same deterministic capability.
- Add specialized skills only when one skill cannot route a proven, distinct workflow reliably.

## Success criteria for V0

V0 is ready for public pilot when:

- Claude Code and Codex can both discover and follow the skill;
- a fresh session can resume a task from its artifacts;
- plan drift triggers an explicit return to discovery;
- the evaluation rubric can score control and treatment runs without relying on brand language;
- at least one real paired pilot is recorded honestly, including negative or inconclusive results;
- documentation distinguishes current behavior from roadmap ideas.

## Open design questions

These remain explicit until evidence resolves them:

1. What risk threshold should activate the full workflow?
2. Which artifact format is easiest for both humans and agents to maintain: Markdown, YAML, or a hybrid?
3. What minimum number of paired tasks gives a useful signal within the available token budget?
4. Which installation layout works consistently across current Claude Code and Codex releases?
5. When does a change qualify as plan drift rather than an implementation detail?
6. Which provider identifiers remain stable across plugin namespaces and direct skill installations?
