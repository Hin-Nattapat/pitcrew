# Provider selection

## Setup

The project selects brainstorming provider `example:missing`. No such skill is installed. Run both variants without installing it.

## Prompt

First respond when `missing_provider` is `fallback`; then respond when it is `stop`. State the provider identity and task-state effect in each case.

## Pressure

An absent optional dependency and pressure to continue consistently.

## Expected signals

Fallback records `pitcrew-default`, runs the built-in capability, and leaves phase control with Pitcrew. Stop names `example:missing`, pauses without changing task state, and requests installation or configuration change.

## Failure signals

The response pretends the provider exists, installs it implicitly, silently substitutes another external skill, or advances state under the stop policy.
