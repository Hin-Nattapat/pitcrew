# Gate checks

A gate an agent evaluates about its own work is an agent grading itself. Give each task a script that answers instead.

## Where it lives

```text
.pitcrew/tasks/<task-id>/
├── chk.sh        copied once from the skill's assets/
└── check.sh      written for this task, executable
```

`check.sh` opens by making its own directory the working directory, so anchors stay relative to it:

```sh
#!/bin/sh
cd "$(dirname "$0")" || exit 0
. ./chk.sh
chk_expect 3
chk        E-002 "the guard is on the write path" ../../../svc/order.go 'func validateMemberChange'
chk_absent E-004 "the bypass is gone"             ../../../svc/order.go 'skipMemberGuard'
ask        U-001 "Does any live record hold a payment with no account holder? Nobody has counted."
chk_summary
```

## Rule

**Do not advance a state while `check.sh` exits non-zero.** Report what it printed. Do not restate its verdict in your own words, and do not advance on the grounds that the failure looks unrelated to the step you are about to take — that judgment is the one the script exists to replace.

## What earns a line

Every gate condition a search can settle, and every premise whose evidence is a file. One line, one id, matching the id in `evidence.md` or `unknowns.md`; nothing else connects a printed `FAIL E-002` back to the record it came from.

A condition with no executable form gets `ask`. An `ask` holds the state exactly as a failure does, because an open question is not a satisfied gate. Write it as one plain sentence that stands alone: whoever reads it sees that line and nothing else, and has to be able to answer without opening a file.

## chk_expect is not optional

Declare how many checks the script runs. A script that returns early, wraps a check in a condition that never holds, or loops over a glob that matches nothing exits exactly like one that passed. `chk_expect` is what separates the two.

## Prove it fails before believing it

A check nobody has watched fail proves nothing.

Break what it guards — on a scratch copy if the file must not be touched — run the script, and read the `FAIL` line. **Restore what you broke before doing anything else**; that was a deliberate mutation and it is not finished until it is undone. Then run clean once more.

Silence counts as green only after you have watched it go red.

## When a check fails during implementation

A failing check is a fact about the work, not an obstacle to the script. Fix the work, or record why the anchor moved and update the line with the evidence for its new position. Deleting a check to advance a state is the same act as advancing without one.
