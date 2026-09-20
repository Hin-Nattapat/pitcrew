# Task artifacts

Store durable state under `.pitcrew/tasks/<task-id>/`. Record conclusions and evidence, not raw transcripts.

## `intake.md`

```markdown
# Goal
# Success criteria
# Constraints
# Initial risk
```

## `discovery.md`

```markdown
# Execution paths
# Sources of truth
# Existing behavior
# Coverage check
```

## `evidence.md`

Repeat this record for every decision-changing observation:

```markdown
## <ID>
Repository:
Revision:
File/symbol:
Observation:
Supported conclusion:
Freshness:
```

Evidence is stale when its recorded repository revision differs from the current revision. Recheck stale evidence before using it to pass a gate.

## `unknowns.md`

```markdown
## <ID>
Question:
Status: unresolved | resolved | accepted-risk | escalated | blocking
Resolution/evidence:
Owner:
```

## `impact.md`

```markdown
# Direct
# Indirect
# Excluded with reason
# Uncertain
# Risks
```

## `plan.md`

```markdown
Plan version:
Approval:

## Step <N>
Evidence:
Scope:
Expected behavior:
Verification:
Risks:
```

## `verification.md`

```markdown
| Requirement or risk | Method | Result | Evidence | Remaining gap |
|---|---|---|---|---|
```

## `status.md`

```markdown
Task ID:
State:
Plan version:
Completed phases:
Current action:
Environment:
```

`Environment` records repository and revision plus harness, model, Pitcrew version, and resolved provider identities when known. Write `unavailable` for values the harness does not expose.

A fresh session reads `status.md` first, then the artifact named by `Current action` and the evidence it cites. It does not load every task file by default.
