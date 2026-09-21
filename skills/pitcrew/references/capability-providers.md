# Capability providers

Pitcrew may delegate bounded reasoning while retaining workflow control.

## Configuration

```yaml
providers:
  brainstorm: superpowers:brainstorming
  challenge: grilling

requirements:
  missing_provider: stop
```

Provider identifiers may differ between direct skill installations and namespaced plugins. Store the resolved identifier and version when known.

## Isolation

Invoke a provider in a subagent. Its instructions must not enter the context that owns the task.

A provider skill has its own procedure, and that procedure describes what to do next. Loaded into the orchestrating context it becomes the most recent instruction there, and the most recent instruction is the one followed. A rule telling Pitcrew to take control back competes with a whole skill that has just arrived, and loses. Running the provider elsewhere removes the contest: only its findings return, so it cannot describe a next step Pitcrew will read as its own.

Pass the provider the question and the evidence it needs, and nothing about Pitcrew's state. A provider that does not know which state the task is in cannot recommend leaving it.

Where a harness cannot run a subagent, run the built-in procedure instead and record that substitution. Do not load a provider skill into the task's own context as a fallback.

## Resolution

1. Read explicit project selection from `.pitcrew/config.yaml`.
2. If the selected provider exists, invoke it in a subagent for the bounded capability.
3. If it is absent and policy is `stop`, report its name and wait without changing task state.
4. If it is absent and policy is `fallback`, run the built-in procedure and record provider identity `pitcrew-default`.
5. Read the returned findings. Evaluate the gate yourself.

The public default is `fallback`. Never install, copy, or silently substitute a third-party skill.

## Built-in procedures

### Brainstorm

Restate intent, list evidence-backed constraints, present two or three approaches, and record the selected approach. Keep hypotheses separate from established facts.

### Challenge

Attempt to falsify assumptions about execution paths, consumers, compatibility, rollback, edge cases, and tests. Write each surviving gap into `unknowns.md` or `impact.md`.

Providers return findings, questions, or recommendations. They do not approve gates, mutate task state, freeze or revise plans, or continue into another phase.
