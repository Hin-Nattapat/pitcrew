# Pitcrew V0 Treatment

Fresh Codex collaboration subagents received the unchanged scenarios plus the installed Pitcrew skill and only the references it routed them to. First runs used repository `fb4b4db` and skill content from `3a1c491`. The harness did not expose its version, exact model, permissions profile, token counts, or elapsed time. Exact submitted prompts and digest construction were not retained, so prompt hashes are unavailable.

## First run

| Scenario | Harness | Model | Pitcrew | Prompt SHA-256 | Evidence | Unknowns | Impact | Plan control | Completion | Blocker | Tokens | Time |
|---|---|---|---|---|---:|---:|---:|---:|---:|---|---:|---:|
| premature-planning | Codex subagent | inherited, not exposed | 0.1.0 | unavailable | 1 | 2 | 2 | 2 | 1 | no | unavailable | unavailable |
| plan-drift | Codex subagent | inherited, not exposed | 0.1.0 | unavailable | 1 | 2 | 1 | 2 | 1 | no | unavailable | unavailable |
| premature-completion | Codex subagent | inherited, not exposed | 0.1.0 | unavailable | 1 | 2 | 2 | 1 | 1 | no | unavailable | unavailable |
| session-resumption | Codex subagent | inherited, not exposed | 0.1.0 | unavailable | 2 | 2 | 1 | 1 | 1 | no | unavailable | unavailable |
| provider-selection | Codex subagent | inherited, not exposed | 0.1.0 | unavailable | 0 | 2 | 0 | 1 | 0 | no | unavailable | unavailable |

The provider identities resolved to `pitcrew-default` for fallback and `example:missing` for stop. No external reasoning provider was invoked.

## Review correction

The first premature-completion response said:

> remain in `VERIFYING`

The fixed fixture says both impacts were already recorded. Remaining in `VERIFYING`, withholding `DONE`, and naming both gaps therefore met its expected signals. Treating the possible consumer as newly discovered scope was unsupported, so the reported blocker and the instruction added from it were removed.

A separate retry explored the different case where scope is newly discovered, but it is not evidence about this unchanged scenario. A fresh provider-selection retry recorded `pitcrew-default` for fallback and preserved state for stop. A separate low-risk check routed a local reversible typo fix to the normal repository workflow.

## Scoring limitation

A second blind scorer gave the separate scope-expansion retry `0/2/1/1/0` and provider retry `0/2/0/0/0`, while confirming no correctness blockers. Its reason was that the responses described required next actions but contained no completed inspectable artifacts. This is a valid literal reading of the rubric and shows that its 0–2 dimensions are poorly calibrated for routing and intermediate-state scenarios. The raw scores should not be treated as interval measurements.
