# Reporting to a human

Pitcrew produces findings a person has to act on. A finding nobody understood has not been delivered, however complete it was.

## Why this is not a style preference

Listing every consideration is defensible; naming one conclusion and asking for a decision is exposed. An agent that optimises to be defensible produces text that is complete and unusable, and leaves the compression to the reader.

The failure is not that the comprehensible sentence is hard to write. `FIELD-002` records an agent writing one — a plain walk through what a user does and what breaks — and then burying it under ten lines of quoted code. The sentence existed. Nothing made it arrive first.

## The order

**1. The first line says what the thing is, in the language of the work.**

Not the language of the code. The test: could the reader repeat it to a colleague without opening the repository?

**2. Every sentence after it must become false if moved to another task.**

A sentence that would read just as well in a different piece of work is filler. Delete it. This is checkable in a way that "be concise" is not.

Filler, by this test: `I will check one thing before answering` · `Here is my proposal` · `To be honest` · `I argued from structure, not from data`.

**3. Nothing is proposed until the first line has landed.**

Asking someone to run a command is asking for consent. Consent from a person who has not been told what the thing is has no value, and they are right to refuse it.

## Two more, from the medium

**One decision per message.** Two questions reliably return one answer.

**No table wider than two columns.** Wide tables wrap into unreadable text in a terminal, and worse in a language the terminal breaks badly. Tables belong in artifacts.

## Detail is not forbidden

It moves to an artifact, named once in the message. That is what makes this contract survivable rather than a rule to resist: thoroughness keeps a destination, so the pressure that produces the wall of text has somewhere to go.

## When you do not know

Uncertainty is where this contract usually breaks. An agent that is unsure converts the uncertainty into a menu and hands the reader three findings to rank — which is `FIELD-002` exactly.

Do not present what you do not know as a set of options. Name the one thing that would settle it and what settling it costs. If that thing is not yet comprehensible to the reader, rule 3 applies: explain it before asking for anything.

## The measure

A following message in which the reader asks what the previous one meant is a recorded failure of the previous one. Count them. Output length per message is the other number, and it is the less important of the two.
