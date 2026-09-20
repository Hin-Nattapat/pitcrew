# Design Decisions

Each V0 decision is intentionally reversible.

| Decision | Context | Choice | Consequence | Revisit trigger |
|---|---|---|---|---|
| Single orchestrator | Multiple workflow skills can compete over phase and completion. | Pitcrew alone owns state and gates. | Providers return findings but cannot advance phases. | A harness proves reliable composable state ownership. |
| One skill | Splitting early adds routing ambiguity and installation work. | Ship one `pitcrew` skill with phase references. | One entry point; references load progressively. | Distinct workflows cannot be routed reliably from one description. |
| Plugin distribution | The workflow must travel across repositories and harnesses. | Keep one canonical Agent Skill and minimal manifests. | Direct install remains possible; public marketplaces need separate verification. | A supported universal distribution mechanism replaces adapters. |
| Provider boundary | Teams may prefer different brainstorming or challenge skills. | Treat them as optional bounded capabilities with fallback or stop policy. | Pitcrew works alone and never installs providers implicitly. | Portable dependency metadata and stable provider identities emerge. |
| Markdown artifacts | Humans and agents both need inspectable durable state. | Store task state under `.pitcrew/tasks/<task-id>/`. | Easy review and versioning; schemas are manually enforced. | Malformed artifacts repeatedly break gates or resumption. |
| Proportional depth | Full process would tax trivial work. | Route familiar, local, reversible, non-contract work out. | Process cost follows risk, but thresholds require calibration. | Pilots show frequent over-routing or escaped risk. |
| Paired evaluation | Better agents can masquerade as better workflow. | Compare control and treatment with fixed task, model, revision, permissions, and providers. | Claims remain limited when equivalence or telemetry is missing. | A stronger randomized evaluation design is affordable. |
| No engine in V0 | Retrieval infrastructure could hide whether the workflow itself helps. | Test documented behavior before code intelligence or automation. | V0 is small and manual. | Repeated accepted tasks identify a deterministic bottleneck. |
