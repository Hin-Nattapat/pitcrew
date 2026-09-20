# Pitcrew

> AI coding agents are getting faster. They still need a pit crew.

Pitcrew is an evidence-driven engineering workflow for coding agents working in unfamiliar, large, or interconnected repositories.

## Status

V0.1 is a documentation-first public pilot. The skill, durable task artifacts, Codex project installation and fresh-session resumption, and Claude Code local-plugin discovery are implemented. Claude behavioral resumption remains unverified because the smoke run hit the account's weekly limit. One real task has run end to end on Antigravity CLI, recorded in [the field log](evals/field-log.md); it delivered an accepted result and resumed from its artifacts after a context reset, but ran a single arm and measured no cost. The first behavioral comparison found no treatment blocker in the comparable scenarios, but did not measure tokens or prove that Pitcrew caused better outcomes. See [the comparison](evals/results/v0-comparison.md) and [smoke record](evals/results/v0-smoke.md).

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

## Install

Clone once, then pick a route.

```bash
git clone https://github.com/Hin-Nattapat/pitcrew.git ~/Tools/pitcrew
```

### Link it (recommended while Pitcrew is changing)

One symlink per skills directory. `git pull` in the clone then updates every harness at once, so no run can silently test a stale copy of the skill.

```bash
ln -s ~/Tools/pitcrew/skills/pitcrew ~/.agents/skills/pitcrew        # Codex, Antigravity CLI
ln -s ~/Tools/pitcrew/skills/pitcrew ~/.claude/skills/pitcrew        # Claude Code
```

The wizard does the same thing with `--link`, including project scope:

```bash
cd <target-project>
node ~/Tools/pitcrew/bin/pitcrew.js install --link
```

Antigravity CLI is known to discover skills through a symlinked skills directory. Discovery of an individually symlinked skill is verified for neither Claude Code nor Codex; run `/skills` (Antigravity), `/plugin` or the skill list (Claude Code), or `$pitcrew` (Codex) once to confirm before relying on it.

### Copy it (wizard)

The wizard asks which harness and scope to install, and copies the skill. It needs Node 18+.

```bash
cd ~/Tools/pitcrew && npm install
cd <target-project>
node ~/Tools/pitcrew/bin/pitcrew.js install
```

`npm install` buys the arrow-key prompt. Without it the wizard still runs and asks the same two questions as a numbered list, so a fresh clone is never blocked.

Replace `<target-project>` with the project directory; do not run the placeholder literally. For automation, pass the choices directly:

```bash
node ~/Tools/pitcrew/bin/pitcrew.js install --target antigravity --scope project
```

Supported targets are `antigravity`, `codex`, `claude`, and `all`. Supported scopes are `project` and `global`. `--link` symlinks instead of copying, `--dry-run` previews destinations, and existing installations require `--force`.

After publishing the npm package, the same interface will be available as `npx pitcrew install`. The package is not published yet.

### Destinations

| Harness | Project | Global |
|---|---|---|
| Antigravity CLI | `.agents/skills/pitcrew` | `~/.gemini/config/skills/pitcrew` |
| Codex | `.agents/skills/pitcrew` | `~/.agents/skills/pitcrew` |
| Claude Code | `.claude/skills/pitcrew` | `~/.claude/skills/pitcrew` |

Start `agy` and run `/skills` to confirm Antigravity discovery, then invoke `/pitcrew`. Codex invokes it as `$pitcrew`.

## Install for Claude Code as a plugin

The repository also carries a marketplace manifest, so Claude Code can install it without a clone:

```text
/plugin marketplace add Hin-Nattapat/pitcrew
/plugin install pitcrew@pitcrew
```

This route is not yet verified against the published repository. For plugin development from the clone, run `claude --plugin-dir ~/Tools/pitcrew`. Invoke the plugin skill as `/pitcrew:pitcrew`. Local plugin discovery and manifest validation are verified; a behavioral Claude run and the marketplace route are not.

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
