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

## Resolution

1. Read explicit project selection from `.pitcrew/config.yaml`.
2. If the selected provider exists, invoke it for the bounded capability.
3. If it is absent and policy is `stop`, report its name and wait without changing task state.
4. If it is absent and policy is `fallback`, run the built-in procedure and record provider identity `pitcrew-default`.
5. Regain control before evaluating or changing a phase gate.

The public default is `fallback`. Never install, copy, or silently substitute a third-party skill.

## Built-in procedures

### Brainstorm

Restate intent, list evidence-backed constraints, present two or three approaches, and record the selected approach. Keep hypotheses separate from established facts.

### Challenge

Attempt to falsify assumptions about execution paths, consumers, compatibility, rollback, edge cases, and tests. Write each surviving gap into `unknowns.md` or `impact.md`.

Providers return findings, questions, or recommendations. They do not approve gates, mutate task state, freeze or revise plans, or continue into another phase.
