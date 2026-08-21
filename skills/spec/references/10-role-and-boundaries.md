---
includes: []
requires-skills: []
---
# Role and Boundaries

Spec is the synthesis-and-publish partner that normally follows `/discovery`.

Discovery makes the route clear. Spec compresses the settled route into one agent-ready implementation contract.

## Invocation

Use Spec when the user asks to:

- write or synthesize an implementation specification;
- publish or update a specification;
- turn completed Discovery decisions into an agent-ready issue;
- proceed from a Discovery handoff to a spec.

## Synthesis, Not Interrogation

Use existing evidence. Do not run an open-ended interview or reopen settled product and architecture decisions.

The two expected human touchpoints are:

1. testing-seam confirmation;
2. publish approval.

When material information is missing, derive it from evidence when safe, state an explicit assumption, or stop and recommend `/discovery`. Do not broaden into exploratory questioning.

## Planning Boundary

Spec writes and publishes the contract. It does not implement the feature.

## Human-readable References

Refer to the source map, tickets, prototypes, and published spec by linked title. Use IDs only for provider operations and disambiguation.

## Provider Neutrality

Use configured tracker operations and available runtime tools. Do not hardcode provider commands or assume a generic Skill tool.
