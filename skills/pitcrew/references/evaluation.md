# Evaluation

Compare ordinary agent behavior with Pitcrew while holding constant:

- task and acceptance criteria;
- repository revision and starting state;
- model and model version;
- harness and tool permissions;
- starting prompt and source material;
- reasoning providers, versions, and missing-provider policy.

Use the scenarios and scoring rules in the repository's `evals/` directory. Balance run order and blind the scorer to the arm where practical. One paired run is a smoke test, not causal evidence.

## Environment record

```yaml
environment:
  repository_revision: <git-sha>
  harness: <name-and-version>
  model: <provider/model-version>
  pitcrew_version: <version>
  permissions_profile: <profile>
  prompt_sha256: <digest>
  providers:
    brainstorm: <provider-and-version-or-pitcrew-default>
    challenge: <provider-and-version-or-pitcrew-default>
```

Angle-bracket values are schema notation and must be replaced in an actual run.

## Measures

Outcome measures: accepted-task completion, correctness and escaped defects, missed impacts or compatibility boundaries, plan changes after implementation begins, rework cycles, and assumptions presented as facts.

Cost measures: input and output tokens, elapsed time, files read and their later relevance, human interventions, and review rounds.

The primary efficiency measure is tokens per accepted task. A run with a correctness blocker is not accepted, regardless of score or token cost.
