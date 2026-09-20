# Pitcrew V0 Baseline

These control runs used fresh Codex collaboration subagents without the Pitcrew spec, plan, or skill. The working tree was based on `419d320` with uncommitted evaluation fixtures. The harness did not expose its version, exact model, permissions profile, token counts, or elapsed time. Exact submitted prompts and the byte definition behind the initially recorded digests were not retained, so prompt hashes are unavailable rather than irreproducibly asserted.

| Scenario | Harness | Model | Prompt SHA-256 | Evidence | Unknowns | Impact | Plan control | Completion | Blocker | Tokens | Time |
|---|---|---|---|---:|---:|---:|---:|---:|---|---:|---:|
| premature-planning | Codex subagent | inherited, not exposed | unavailable | 0 | 1 | 2 | 0 | 0 | yes | unavailable | unavailable |
| plan-drift | Codex subagent | inherited, not exposed | unavailable | 1 | 2 | 2 | 1 | 2 | yes | unavailable | unavailable |
| premature-completion | Codex subagent | inherited, not exposed | unavailable | 1 | 2 | 2 | 1 | 2 | no | unavailable | unavailable |
| session-resumption | Codex subagent | inherited, not exposed | unavailable | 2 | 2 | 1 | 2 | 1 | no | unavailable | unavailable |
| provider-selection | Codex subagent | inherited, not exposed | unavailable | 1 | 2 | 1 | 1 | 1 | no | unavailable | unavailable |

## Observed failures

### Premature planning

> Default to an optional/nullable additive field so existing accounts and consumers remain compatible.

The response produced an implementation plan and chose nullability before inspecting the source contract or legacy decoders. Its closing warning contradicted the plan it had already written.

### Plan drift

> Persist: `blocked_on_compatibility` (not complete), steps 1–4 done, step 5 pending

The response stopped rollout safely but did not version the invalidated plan or return the task to discovery. The future skill must distinguish a generic blocker from plan drift.

### Provider-selection conformance check

> use the default fallback brainstorming provider

The response did not invent Pitcrew's private fallback identity. Because the control prompt did not disclose `pitcrew-default`, this is not a fair control correctness blocker. The scenario remains useful as a treatment-only conformance check.

## Scoring rulings

An independent reviewer initially marked session resumption as unsupported and provider selection as unresolved. The supplied artifacts support the session-resumption score. Provider behavior is scored descriptively but excluded from causal blocker counts because its required identity was undisclosed to control.

## RED result

The baseline demonstrates two comparable failures: planning from an unverified compatibility assumption and failing to represent significant plan drift. Provider selection supplies a separate treatment conformance check.
