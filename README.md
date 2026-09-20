# Pitcrew

> AI coding agents are getting faster. They still need a pit crew.

Pitcrew is an evidence-driven engineering workflow for coding agents working in unfamiliar, large, or interconnected repositories.

## Status

V0.1 is a documentation-first public pilot. The skill, durable task artifacts, Codex project installation and fresh-session resumption, and Claude Code local-plugin discovery are implemented. Claude behavioral resumption remains unverified because the smoke run hit the account's weekly limit. The first behavioral comparison found no treatment blocker in the comparable scenarios, but did not measure tokens or prove that Pitcrew caused better outcomes. See [the comparison](evals/results/v0-comparison.md) and [smoke record](evals/results/v0-smoke.md).

## When to use it

Use Pitcrew for unfamiliar brownfield code, cross-repository changes, shared contracts, migrations, business rules, or work spanning sessions. Skip it for familiar, local, reversible changes with no shared contract or data impact.

## Workflow

| State | Alias | Gate |
|---|---|---|
| `INTAKE` | Garage | Goal, constraints, success criteria, and risk are recorded. |
| `DISCOVERY` | Track Walk | Execution paths are evidenced; unknowns are controlled. |
| `IMPACT_REVIEW` | Track Map | Direct, indirect, excluded, and uncertain impacts are justified. |
| `PLAN_READY` | Race Strategy | Every step cites evidence, behavior, tests, and risks. |
| `PLAN_APPROVED` | Parc Ferme | A human approves a versioned plan. |
| `IMPLEMENTING` | Stint | Work follows the approved plan. |
| `PLAN_DRIFT` | Red Flag | Material new facts return the task to discovery. |
| `VERIFYING` | Scrutineering | Requirements, risks, impact, changes, and tests reconcile. |
| `DONE` | Chequered Flag | No blocking unknown remains. |

## Install with the Pitcrew wizard

The wizard asks which harness and scope to install. From a local clone:

```bash
node /path/to/pitcrew/bin/pitcrew.js install
```

For automation, pass the choices directly:

```bash
node /path/to/pitcrew/bin/pitcrew.js install --target antigravity --scope project
```

Supported targets are `antigravity`, `codex`, `claude`, and `all`. Supported scopes are `project` and `global`. `--dry-run` previews destinations; existing installations require `--force`.

After publishing the npm package, the same interface will be available as:

```bash
npx pitcrew install
```

## Install for Antigravity CLI

The project-local destination is `.agents/skills/pitcrew`, which Antigravity CLI discovers automatically. Start `agy`, run `/skills` to confirm discovery, then invoke `/pitcrew`. The global destination is `~/.gemini/antigravity-cli/skills/pitcrew`.

## Install for Codex

From a local clone, copy `skills/pitcrew` into the target project's `.agents/skills/` directory, then restart Codex:

```bash
mkdir -p /path/to/project/.agents/skills
cp -R /path/to/pitcrew/skills/pitcrew /path/to/project/.agents/skills/
```

Invoke it as `$pitcrew`. This project-local route is verified. Marketplace installation is future work and is not yet documented as available.

## Install for Claude Code

Run Claude Code with the local plugin during evaluation or development:

```bash
claude --plugin-dir /path/to/pitcrew
```

Invoke the plugin skill as `/pitcrew:pitcrew`. Plugin discovery and manifest validation are verified; a behavioral Claude run and public marketplace installation are not yet verified.

## First task

Ask the agent to use Pitcrew and state the risky change:

```text
Use $pitcrew to investigate adding a response field shared by the API, mobile app, and back office. Do not plan until discovery is complete.
```

Pitcrew creates or resumes `.pitcrew/tasks/<task-id>/`. A later session reads `status.md` first and loads only current-phase evidence.

## Optional reasoning providers

Pitcrew works alone. Brainstorming and challenge skills remain separate capability providers and never own workflow state. Select installed providers per project:

```yaml
# .pitcrew/config.yaml
providers:
  brainstorm: superpowers:brainstorming
  challenge: grilling

requirements:
  missing_provider: stop
```

Use `fallback` to run Pitcrew's built-in procedure and record `pitcrew-default`, or `stop` to pause when a named provider is missing.

## Non-goals

V0 is not a code indexer, RAG system, MCP server, hosted service, or replacement for debugging, TDD, review, brainstorming, or grilling. It coordinates when those techniques run and preserves the evidence and decisions they produce.

See [the design](docs/superpowers/specs/2026-09-19-pitcrew-design.md), [problem review](docs/problem-review.md), [roadmap](docs/roadmap.md), and [contributor instructions](AGENTS.md). Contributions are licensed under the [MIT License](LICENSE).
