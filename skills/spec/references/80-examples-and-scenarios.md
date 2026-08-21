---
includes: []
requires-skills: []
---
# Examples and Scenario Tests

## Completed Discovery Map

Spec reads the map, decision tickets, handoff, domain guidance, and relevant code. It proposes one high-level seam, confirms it, previews the full spec and mapped label, publishes after approval, and reports the linked title.

## Existing Specification

An open specification already links the same Discovery map. Spec updates it in place and preserves human discussion.

## Local-only Mode

Spec publishes `.scratch/<feature>/specs/<spec-name>.md` with `kind: spec`, relative source links, and the configured ready state.

## Contradictory Evidence

An approved prototype conflicts with an Architecture Decision Record. Spec identifies both, follows the governing record when clear, and documents the prototype as superseded.

## Discovery Incomplete

A material decision remains open. Spec reports the Blocker and source ticket or fog, recommends resuming `/discovery`, and does not publish.

## Scenario Invariants

A valid run must:

- synthesize instead of broadly interviewing;
- confirm testing seams;
- distinguish settled decisions, inferences, and blockers;
- require publish approval;
- update rather than duplicate;
- apply only the mapped `ready-for-agent` state;
- link but not mutate Discovery artifacts;
- verify and report the published item.
