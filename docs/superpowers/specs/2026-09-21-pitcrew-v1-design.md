# Pitcrew V1 Design

## Status

Proposed design for review. This document authorizes no implementation. It supersedes nothing until a human approves it; [the V0 design](2026-09-19-pitcrew-design.md) remains the description of current behavior.

## Why V1

V0 asked whether a documented workflow changes agent behavior. Two pilots answered, and neither answer was the expected one.

`FIELD-001` delivered an accepted result. `FIELD-002` did not: the approval gate was bypassed, an artifact was written and then contradicted by its own author, findings reached the user without bounds, and the user stopped the work because the output was unusable. `evals/results/v0-comparison.md` remains inconclusive on effectiveness.

Separately, the same author's multi-skill workflow tool was run on real programs. Its record is the mirror image: the work it produced was good, and it lost control of its own process. Chained peer skills hand off to one another, and each handoff loads a fresh set of instructions that outranks the ones before it. A session would enter a brainstorming step and never return to the workflow.

V1 exists because those two failures have one shape. A workflow written as prose cannot bind the agent reading it. The most recently loaded instruction wins, whether it arrives from another skill or from the agent's own reasoning.

## What holds from V0

The five rules are unchanged: discover before planning, evidence before assumptions, freeze an approved plan, verify against impact, persist state outside the conversation.

Three V0 decisions are load-bearing and stay:

- **Single orchestrator.** Pitcrew alone owns state, gates, approval, drift, and completion.
- **Proportional depth.** Risk routing decides whether process applies at all. A binary trigger spends full ceremony on work that does not need it.
- **Evidence-bound claims.** Effectiveness is measured or it is not claimed.

## What V1 changes

### 1. Providers run isolated

V0 told providers to return control. The instruction is addressed to the wrong party: a provider skill does not read Pitcrew's rules, and once its own instructions load into the session they compete with Pitcrew's from a more recent position.

V1 runs every provider in a subagent. Its instructions never enter the orchestrating context; only its findings return. "A provider cannot advance a state" stops being a rule the agent must honor and becomes a property of where the provider runs.

This applies to brainstorming, challenge, review, and any capability added later.

### 2. Gates execute

A gate that an agent evaluates about its own work is an agent grading itself. `FIELD-002` shows what that is worth: the task advanced out of `PLAN_DRIFT` into committed code without an approved plan, and nothing objected.

V1 gives a task a generated check script. One line per gate condition and per premise that a search can settle. The script exits non-zero and names what failed. Pitcrew may not advance a state while its check script fails.

Two rules make the script trustworthy:

- A check is not believed until it has been watched to fail. Break the thing it guards, see the failure print, restore it, run clean.
- A script that completes proves only that it ran to the end. It does not prove every check inside it executed. Conditional blocks, early returns, and loops over empty matches all exit clean.

### 3. State returns without being asked

V0 resumption depends on the agent choosing to read `status.md` first. `FIELD-001` records one session where it chose correctly. That is a sample, not a guarantee.

V1 injects the current state at session start through a harness hook: the state, the current action, the open blocking premises, and nothing else. What the hook injects is paid for by every session of the task, so it carries a size budget. A budget that overflows means too many premises are open, and the answer is to close them, never to trim the injection.

Hook mechanisms differ across harnesses. What is observable on one machine, at the versions installed there on 2026-09-21:

| Harness | Session-start hook | Where |
|---|---|---|
| Claude Code | yes, and a `compact` matcher that fires specifically after a context reset | `settings.json` under `hooks.SessionStart` |
| Codex | yes — `session_start`, alongside `user_prompt_submit`, `post_tool_use`, `stop`, `subagent_start` | `config.toml` under `[hooks.…]` |
| Antigravity CLI | none found | `settings.json` carries four keys, none about hooks; no hooks directory exists |

Claude Code's `compact` matcher is the better fit than session start alone: a context reset mid-task is the moment the state is lost, and it is the moment `FIELD-001` recorded the agent choosing correctly to re-read. Injecting there replaces the choice.

A harness without a hook falls back to V0 behavior — the agent reads `status.md` because the skill says to. That fallback is recorded in the task's environment, never silent, because a resumption that worked without an injected state and one that worked with it are not the same evidence.

This table is what one machine exposes, not documented capability. Confirm before depending on it.

### 4. A program axis, and one retired word

V0 models one task. Real features span several deliveries across sessions and repositories, each owing something concrete to the next. V0 has no way to express that, so the work fragments into unrelated tasks that rediscover each other's conclusions.

V1 adds a program — a **season** in the F1 alias — as an ordered set of **rounds**. Each round names a deliverable, the repository it lands in, the contract it sets for later rounds, what it must not touch, and its prerequisites. A round whose deliverable and contract cannot yet be stated is not a round; it is one line recording the question it waits on.

**The word "phase" is retired from Pitcrew.** V0 used it for workflow states, and this axis needs a word for units of delivery. Two meanings in one vocabulary is a defect in a document whose job is precision. `INTAKE` through `DONE` are **states**. Units of delivery are **rounds**. Nothing is a phase.

### 5. Premises replace bare unknowns

`unknowns.md` records a question and a status. `FIELD-002` shows two things that record cannot hold.

A premise carries its **type**, and the type names where it may be settled.

- **internal** — settled by reading this codebase. Needs a real `file:line`.
- **external** — another team's document, another system's payload. Cannot be settled by reading our own code at all, because our code proves what we read and never what they send.
- **runtime** — settled only by counting what has actually happened.

Conflating the first two is how a source comment becomes evidence that a case occurs. Conflating the first and third is subtler and cost `FIELD-002` a round trip: the agent proposed a database count to answer whether a state was *reachable*, which is a structural question its own code already answered. Reading the code later settled it and disproved the premise the agent had been defending.

**Code answers whether something can happen. Data answers how often it did.** A structural premise may not be settled by a query, not because queries are unreliable but because they answer a different question.

A runtime premise may be escalated for a human to run only after three things are stated: which code paths were read to exhaustion first, which environment will be queried and what its data represents, and what each possible result would mean — written before the query runs.

The third condition retires most such requests before they are made. An agent that cannot say in advance what a given number would prove has not established that the number is worth anyone's access.

It also catches an inversion. In an environment whose data the team generates itself, a nonzero count is evidence that a shape occurs, and a zero count is evidence of nothing at all — only that nobody happened to create one. `FIELD-002` planned to read zero as grounds for accepting the risk, which is the one reading the data could not support.

A premise carries its **extent**. How many call sites, how many rows, what a fix disturbs. A premise without extent cannot be decided by the person it is escalated to, and `FIELD-002` records that person saying exactly this.

A blocked premise blocks design. No round that depends on an open premise may be described as ready. Waiving one is a human act, recorded with the assumption taken and what must be redone if it proves false.

### 6. A coverage check that cannot be satisfied with prose

`discovery.md` currently asks for a coverage check and accepts an assurance. V1 requires a search, its result count, and the count the plan covers. Two numbers that differ are a gap, visible before implementation rather than during review.

### 7. The output contract

`FIELD-002` ranks this above every other failure, and the author's other tool did not solve it with a format template. A template constrains shape, not content: a four-line block becomes four paragraphs and satisfies the template exactly.

The mechanism is not verbosity for its own sake. Listing every consideration is defensible; naming one conclusion and asking for a decision is exposed. An agent optimizing to be defensible produces text that is complete and unusable, and leaves the compression to the reader.

`FIELD-002` also shows the failure is not that the agent could not write a comprehensible sentence. It wrote one — a plain walk through what a user does and what breaks — and buried it beneath ten lines of quoted code and contract commentary. The same shape as the contradicted artifact: the right thing was produced and then made invisible.

Three rules, in order, because the order is the point:

1. **The first line says what the thing is, in the language of the work rather than the language of the code.** The test is whether the reader could repeat it to a colleague without opening the repository.
2. **Every sentence after it must become false if moved to another task.** A sentence that would read just as well in a different piece of work is filler and is deleted. This is checkable in a way that "be concise" is not.
3. **Nothing is proposed until the first line has landed.** Asking a human to run a command is asking for consent, and consent from someone who has not been told what the thing is has no value — they are right to refuse it, and `FIELD-002` records exactly that refusal.

Two further rules follow from the medium: one decision per message, since two questions reliably return one answer; and no table wider than two columns, since wide tables wrap into unreadable text in a terminal and worse in Thai. Tables belong in files.

Detail is not forbidden. It moves to a file, named once. That is the only version of this contract that removes the pressure to enumerate rather than resisting it, because thoroughness keeps a destination.

Two measures make this checkable rather than a matter of taste, and both are recoverable from harness transcripts:

- **Re-ask rate** — the share of assistant messages followed by a human asking what the previous message meant. Such a question is a recorded failure of the message before it.
- **Output length per message.**

### 8. Declared project topology

`docs/roadmap.md` defers code indexing until targeted search repeatedly misses cross-repository edges. `FIELD-002` is that miss: the agent concluded a state was reachable without having read the producing service in the other workspace, and the code it had not read was what disproved it.

What that failure calls for is not an index. An index is derived, needs an engine, and goes stale silently. V1 adds a **declared topology** instead: a short file, written once and approved, naming what exists and how it connects.

It holds only locations and edges — which repositories live in which workspace, which one calls or consumes which, and where the contract between them is defined. Every edge carries an anchor: a path or a search that must match for the edge to be real.

**It never describes behavior.** A file that explains what code does is a second source of truth that ages, and an agent planning against an aged one plans against a lie — worse than having no file. The topology says where to look. Reading is still what says what is there.

The anchors are what keep it honest. Each becomes a line in the task's check script, so an edge that moves prints a failure instead of quietly misleading the next session.

For work spanning several workspaces the file sits in the outermost shared directory and is referenced outward, with `.pitcrew/config.yaml` naming its location.

It is built in two passes, because surveying two workspaces in full would cost most of its budget on edges no task ever uses.

A **bootstrap sweep**, run once and approved once, records only what a mechanical search finds: the repositories, their service clients, message definitions, schema files, and route declarations. It does not read for behavior, so its cost is bounded.

After that the file **grows from real work**. When `DISCOVERY` walks a path and finds an edge the file does not have, it adds the edge with the anchor it has just verified, and the addition arrives inside the discovery output a human already reviews. No separate approval round.

The rule both passes share: no edge is ever written from belief. Each one comes either from the mechanical sweep or from a task that walked it. `FIELD-002` is sufficient evidence for that rule — the edge the agent was most confident in was the one that did not exist.

Whether this reduces total cost is unmeasured. It removes searches in the wrong repository, and it adds whatever the file costs each session that carries it. The net is a measurement, not a claim.

### 9. Two skills, split by entry condition

The tool V1 replaces is eight skills divided by step of work, and that division is the source of its control loss: every step forward is a handoff, and each handoff loads a fresh instruction set that outranks the one before it. Splitting V1 the same way would reproduce the same defect.

The dividing question is not which step the work is at. It is whether the entry conditions differ.

- **`pitcrew`** — one piece of work. Entered when risk routing says process applies. Owns `INTAKE` through `DONE`.
- **`pitcrew-season`** — a feature delivered over several rounds. Entered when work crosses repositories and cannot finish in one session. Owns the rounds and the contracts between them.

Discovery, planning and verification are not skills. They are states of `pitcrew`, and making them skills would make them owners — which is the decision V0 got right and this design keeps.

A season does not load the task skill into its own context; that is the handoff that breaks control. It spawns a subagent per round and receives the result, the same mechanism as a provider. The season stays small and never accumulates the internals of rounds already run.

That isolation has a cost: what happens inside a round is invisible to the season unless the round reports it. A round returns one of three results and nothing else — finished with its contract intact, blocked on a premise it names, or holding a contract it has disproved. The third is the only one the season must reason about, and it is legible without the round's context because the contract is something the season wrote and already knows by name.

A round never edits a contract. It reports that one is broken. A round that could rewrite the thing constraining it is a provider that changes state, which is the defect this design exists to remove.

### 10. Debrief between rounds

A round is not finished when its code lands. It is finished when what it learned has been checked against the rounds that have not run yet.

This is the difference between engineering a feature and patching one. An agent that meets an obstacle mid-round will route around it, because routing around it allows work to continue immediately. Ten rounds of that produces a design nobody chose, assembled from detours. `FIELD-002` is the same failure inside a single task: each contradiction was patched locally rather than sent back to the thing that should have been re-derived.

So every round ends in a **debrief**, whether it succeeded or not. The round returns what it now knows that the season did not know when the rounds were cut. The season checks the remaining rounds and contracts against it, and then either confirms that they still hold or re-cuts and versions them.

Running it only on failure is the mistake worth naming: a round that succeeds still produces knowledge, and a plan that is only revised when something breaks is carried stale until it does.

**A problem found mid-round goes to the debrief, not to a workaround.** The round stops and reports; the season decides. Before it decides, the season states the problem at its root rather than where it surfaced, names what it now knows that it did not before, and weighs at least two options with what each costs. The output is a re-cut season, versioned — never an instruction sent back down to patch around the obstacle.

The cost is proportional. When nothing a round learned touches a later round's contract or an open premise, the debrief is a line confirming so, and nothing is re-planned. The expense arrives only where the design actually moved, which is where it should be spent.

## Architecture

```
topology (declared once, approved, anchored)
└── season (optional) — pitcrew-season
    └── rounds, each owing a contract to the next
        └── round = one task = one pitcrew state machine, run isolated
            └── debrief → confirm the remaining rounds, or re-cut them
        ├── states: INTAKE → DISCOVERY → IMPACT_REVIEW → PLAN_READY
        │           → PLAN_APPROVED → IMPLEMENTING → VERIFYING → DONE
        │           (PLAN_DRIFT returns to DISCOVERY)
        ├── premises: typed, with extent, blocking until settled
        ├── check script: generated, must fail before it is believed
        └── providers: subagents returning findings only
```

Pitcrew owns every transition. Providers, checks, and hooks report; none of them decide.

## Decisions this reverses

Two V0 decisions are revisited, each against its own recorded revisit trigger.

**"One skill."** V0 chose a single skill because splitting early adds routing ambiguity. The program axis, the check script, and the output contract cannot be carried by one skill without it growing past what an agent will follow. The trigger named in `docs/design-decisions.md` was that a single description cannot route distinct workflows reliably; a program and a task are distinct workflows with different entry conditions.

**"No engine in V0."** V0 deferred deterministic tooling until a measured failure demanded it. `docs/problem-review.md` names the condition precisely: a CLI when agents repeatedly make invalid state transitions. `FIELD-002` records the first. One instance is not "repeatedly", and V1 should not ship the engine on the strength of it — but the check script is the smallest thing that addresses the recorded failure, and it is not general tooling.

## What to build first

Ten changes rest on two field observations. This repository's own rule is the smallest change explained by a recorded failure, so the changes are not equal and the spec should say which is which.

Two questions separate them. Does a recorded failure demand it, or does reasoning suggest it? And does it hold by construction, or does it hold only if the agent complies?

The second question matters more. A rule that depends on compliance is the category that `FIELD-002` showed failing — the approval gate was a sentence, and a sentence did not stop a commit.

| Change | Evidence | Holds by |
|---|---|---|
| 1 · providers isolated | observed — control lost to a loaded skill | construction |
| 2 · gates execute | observed — G1 | construction |
| 7 · output contract | observed — G6, ranked first by the user | compliance, but measurable |
| 8 · topology | observed — a cross-workspace edge missed | compliance, anchors excepted |
| 5 · premises typed, with extent | observed — G3, G4 | compliance |
| 6 · coverage as a count | observed — G7 | compliance |
| 3 · state injected at session start | inferred — one successful resumption is not a guarantee | construction |
| 9 · two skills | inferred | construction |
| 4 · seasons and rounds | inferred | compliance |
| 10 · debrief | inferred | compliance |

**Build 1, 2 and 7 first.** The first two are the only changes that hold without the agent's cooperation. The third is the failure the user ranked above every other, and the only one of the compliance-bound changes that arrives with a measure that can fail.

Everything else waits on a question only those three can answer: once two gates hold by construction, how much does a rule that depends on compliance actually buy? If compliance improves because the structural gates bite, the remaining rules may be sufficient as written. If it does not, they need structural forms too — and building them as prose first would be work spent twice.

Shipping all ten at once forecloses that question. A V1 that fails after ten simultaneous changes cannot say which change failed.

## The tool V1 replaces

Nothing is migrated or retired until the first three changes are proven in real work.

The multi-skill tool keeps running in the meantime. Its record across two completed programs is more evidence than V0 has ever produced, and retiring something that works in favour of something untested is the error this spec argues against everywhere else. It earns retirement by being beaten, not by being superseded on paper.

## Measurement

V1 is not adopted on the strength of this document.

Before it replaces V0 behavior:

- a task must be refused advancement by a failing check script, observed, not asserted;
- a provider must run isolated and return findings without the session leaving the workflow;
- a session must resume from an injected state after a context reset;
- re-ask rate and output length must be recorded for a real task under both V0 and V1 instructions.

The last one is the only comparison available here, and it is weak: the tasks differ. It is reported as a field observation, not as evidence of cause.

## Open questions

1. What generates a task's check script, and what happens to a gate condition that has no executable form beyond becoming an `ask` that never closes?
2. What stops a debrief from re-cutting the season every round, and is the drift boundary V0 already defines the right test for it?
3. What re-approves a topology file after the repositories it describes have moved, and does a failing anchor block the task that found it or only report?

## Non-goals

V1 adds no code indexer, retrieval engine, hosted service, or organization integration. It does not bundle third-party skills. It does not claim token savings; cost stands where V0 left it, unmeasured.
