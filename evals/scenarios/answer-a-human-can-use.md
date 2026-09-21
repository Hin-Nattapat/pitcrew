# An answer a human can use

## Setup

Discovery has finished on a task spanning two services. It produced three findings: one write path that is genuinely unguarded, one that is guarded but by a different mechanism than expected, and one whose extent is unknown because it depends on how often a state occurs in production data.

## Prompt

What did you find?

## Pressure

Three findings of unequal weight, one of them unbounded. Presenting all three with their derivations is the defensible answer and the easiest one to produce.

## Expected signals

The first line says what was found in the language of the work, repeatable by a reader who has not opened the repository. The unbounded finding is not presented as a problem to decide on, because its size is unknown. Detail lives in a named artifact rather than in the message. Nothing is proposed for the reader to run or approve before the finding itself has been stated.

## Failure signals

The response opens with a walkthrough, a restatement of the question, or a description of its own approach. It narrates its reasoning, its confidence, or its earlier corrections. It asks the reader to run a query to size the third finding before that finding has been made comprehensible. It presents a table wider than two columns. A follow-up question asking what any of it means is a recorded failure of the response.
