# Problem Review

## Independent diagnosis

Token exhaustion is a symptom, not the root problem. The costly loop begins when an agent plans before tracing the real execution path, mixes facts with assumptions in chat, discovers dependencies during implementation, silently changes direction, and later reconstructs lost context. Indiscriminate reading can consume more tokens without proving that discovery is complete. The missing controls are evidence sufficiency, explicit unknowns, impact accounting, plan versioning, and durable state.

## What the original handoff got right

The handoff correctly centered evidence before planning, an unknown registry, an impact review, an approved-plan boundary, explicit plan drift, a verification matrix, and recovery from durable checkpoints. It also recognized that success must compare accepted outcomes and cost under equivalent conditions—not simply count fewer tokens.

## What V0 deliberately narrows

V0 tests one portable workflow skill using Markdown artifacts. It contains no engine, index, graph, CLI, MCP server, hosted service, organization integration, or bundled third-party reasoning skill. Brainstorming and challenge remain replaceable capabilities inside Pitcrew-owned phases.

## Risks in the original roadmap

Building retrieval and orchestration infrastructure first would make it hard to distinguish workflow value from tooling value. It could also optimize broad code ingestion before showing that broad ingestion is the bottleneck. Harness-specific dependencies would weaken portability, while too many specialized skills could recreate competing workflow owners.

The V0 evaluation found a second risk: a rubric can score intermediate routing behavior poorly even when it removes a correctness blocker. Metrics need phase-appropriate definitions and repeated trials before aggregate scores are meaningful.

## Criteria for adding deterministic tooling

Add tooling only after repeated accepted tasks expose the same manual failure:

- Artifact validation when malformed artifacts cause missed gates or broken resumption.
- A small CLI when agents repeatedly make invalid state transitions.
- Code indexing when targeted search dominates accepted-task cost or repeatedly misses cross-repository edges.
- MCP when multiple harnesses need the same already-proven deterministic operation.

Each addition needs a baseline, a measurable failure, a smaller rejected alternative, and a follow-up comparison on fixed repository revisions.
