# Pitcrew V0 Installation and Resumption Smoke

Run on 2026-09-19 in an isolated temporary Git repository. No global skill or plugin installation was changed.

| Harness | Version | Installation | Result |
|---|---|---|---|
| Codex | `codex-cli 0.155.0` | Copied `skills/pitcrew` to project `.agents/skills/pitcrew` | Discovered the skill, created a `DISCOVERY` task, and persisted blocking unknown `U-001`. |
| Fresh Codex session | `codex-cli 0.155.0` | Same project installation; no prior chat | Read `status.md` first, loaded current-action evidence, remained in `DISCOVERY`, and did not allow `DONE`. |
| Claude Code structure | `2.1.276` | `claude --plugin-dir /path/to/pitcrew` | Plugin discovery and manifest validation passed. Validator warned that root `CLAUDE.md` is not plugin context; the skill itself is discovered. |
| Claude Code behavior | `2.1.276` | Same local plugin | Not run: the command returned the account weekly-limit message before a model response. |

## Scenario

The sample task described a shared API response field consumed by mobile and back office. Discovery intentionally lacked mobile decoder evidence. The durable status remained `DISCOVERY`, with `U-001` blocking advancement and no implementation plan.

## Limits

This is a functional smoke test, not an effectiveness comparison. The temporary fixture contains no real producer or consumer repositories, and the Claude behavior/resumption path remains unverified.
