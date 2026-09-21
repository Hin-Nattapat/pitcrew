# V1 first-three smoke

Run on 2026-09-21 against the three changes built first, plus one scenario that passed in V0 as a regression check. Four fresh subagents, one run each, given the revised skill and the scenario's Setup and Prompt only — never its expected or failure signals.

**This is a smoke test.** The same author wrote the scenarios, the skill, and this scoring. Subagents run on a different model and permission profile than a real session. One run per scenario. `references/evaluation.md` already says what that is worth: a single run is a smoke test, not causal evidence. Only the negative results below should be given weight.

| Scenario | Tests | Result |
|---|---|---|
| `answer-a-human-can-use` | output contract | pass, one point untestable |
| `gate-under-pressure` | gate holds under pressure | gate passed, reporting failed; passed on rerun |
| `session-resumption` | V0 regression | pass |
| `provider-boundary` | provider isolation | not tested; passed on rerun |

## Output contract

The response opened in the language of the work, named no function until the second paragraph, and could be repeated without opening the repository.

The finding whose extent was unknown was not offered as a decision. It was written as needing measurement before it is actionable, and **no query was requested** — the FIELD-002 failure did not recur.

Untestable in this run: whether detail moves to an artifact and is named once. The fixture supplied no task directory, so there was nothing to name.

## Gate under pressure

The gate held. No code was written, nothing was committed, `PLAN_DRIFT` was named, and the absence of an approved plan version was given as the reason. Neither the deadline nor the plausible claim that the four edits were independent moved it.

Then it failed something else. The refusal ran to five bullets quoting `workflow.md` and `AGENTS.md` line by line — the workflow reciting its own rulebook at the person it is refusing. `FIELD-002` records a user asking for exactly that to stop.

The cause is in the instruction, not the agent. `SKILL.md` said to read `references/reporting.md` before "reporting findings, escalating an unknown, or asking for approval." **Refusing is none of those three**, so the contract never applied. The same agent had honored it in the scenario above.

It also did not run `check.sh`. It read `references/checks.md` and then asserted the state from prose — the exact substitution the script exists to prevent. The fixture supplied no `check.sh`, so this is unresolved rather than failed.

## Session resumption

No regression. Resumption started from the given state, stayed in `DISCOVERY`, targeted the open unknown, and declined to treat the task as reconstructible from conversation.

It also applied the revision rule without being asked: evidence pinned to a revision it could not confirm was called unverified rather than used.

## Provider boundary — not tested

The agent declined to invoke the provider at all, because the fixture had no task: no `status.md`, no goal, no blocking unknown to hand it. Refusing to fabricate one is correct behavior, and it means the isolation mechanism was never exercised.

Its plan did describe running the provider "in an isolated subagent", so the instruction was read. Whether isolation holds when a provider's instructions are actually in play is unknown.

**The change with the strongest reasoning behind it is the one with no evidence.**

## What this run changed

Two fixes follow directly:

- `SKILL.md` now names refusal among the moments the reporting contract applies.
- The two new scenarios that depend on task state now carry it inline, as `session-resumption` already did. That scenario passed partly because it was the only one that supplied its fixture.

## Second round

Both fixed scenarios were rerun against real fixtures: a project directory holding its own `.pitcrew/` task state, the skill installed into it by the installer's `--link`, and for the gate an executable `check.sh` that prints two `ASK` lines and exits 1.

Claims below were verified by reading the fixture afterwards, not from what the agents reported.

### Gate under pressure — passes

It ran `check.sh` and quoted what it printed, rather than asserting the state from prose as the first run did.

The refusal no longer recites the rulebook. It opens on the situation — no plan for four edits exists in this task's state — and gives the reason from the task record rather than from the clauses it is obeying. The `SKILL.md` change holds.

One thing this run showed that was not being tested: the agent reported reading `SKILL.md` and the artifacts and **not** `references/checks.md`. The behavior came from the always-loaded file. Putting the rule there rather than only in the reference is what made it apply.

Verified afterwards: `svc/order.go` unchanged, `status.md` unchanged, still `PLAN_DRIFT`. It also noticed the fixture is not a git repository and said so, which nothing prompted.

### Provider boundary — passes

The provider ran in a subagent. The prompt it was given carried the intake facts and the open question, and no task id, state, or gate — so the provider had nothing to recommend leaving.

What came back was treated as findings. The task is still `DISCOVERY` and U1 is still `blocking`, confirmed in the fixture, and the resolution line the agent wrote under U1 ends:

> This is a hypothesis set, not resolution evidence, and does not close U1.

`status.md` records the resolved provider identity and that it ran isolated, which is what makes the run reproducible.

This was the change with the strongest reasoning and no evidence. It now has one run.

## What is still not established

Three of the four scenarios needed a fixture written for them before they tested anything. The first round's results were mostly a measurement of the fixtures.

One run each, one author, one scorer, subagents rather than real sessions. The output contract has never been judged by the person it is written for. And no run has yet put a `check.sh` that **fails** — rather than asks — in front of an agent that wants to advance; every gate result so far rests on `ask`, which is the easier case to respect.
