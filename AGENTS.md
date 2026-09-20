# Contributor Instructions

## Workflow changes

- Read `docs/superpowers/specs/2026-09-19-pitcrew-design.md` and the current plan under `docs/superpowers/plans/` before changing workflow behavior.
- Run the relevant scenario without the proposed instruction first. Record the exact failure before editing `skills/pitcrew/`.
- Make the smallest instruction change explained by that failure, then rerun the failed scenario and one previously passing scenario with fresh agents.
- Keep Pitcrew as the only owner of phase transitions. Optional providers return bounded findings only.

## Claims and evidence

- Tie public behavior and effectiveness claims to committed evaluation results.
- Do not infer token savings, speed, or causality when model, revision, permissions, providers, tokens, or time are unavailable or differ.
- Mark unverified installation routes and roadmap behavior explicitly.

## Git hygiene

- Work on a feature branch, never directly on `main` or `develop`.
- Inspect the worktree before editing and preserve unrelated user changes.
- Stage explicit paths; do not use blanket staging.
- Run the relevant validators and `git diff --check` before committing.
