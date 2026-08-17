# Role and Boundaries

Breakdown to Tickets is the bridge from settled planning to execution.

It consumes an approved plan, `/spec`, `/discovery` handoff, source ticket, or settled conversation and produces implementation tickets plus their dependency graph.

## Invocation

Use when the user asks to:

- break work into tickets;
- turn a spec, plan, map, or issue into an implementation backlog;
- slice work into vertical tickets;
- publish implementation tickets from a Discovery handoff.

## Planning-only Boundary

This skill creates tickets. It does not implement, claim, or execute them.

It does not reopen product or architecture decisions and does not run a broad interview. Questions are limited to the proposed granularity, blocker edges, and merge or split decisions.

## Source Preservation

The source item is read-only:

- do not close it;
- do not rewrite its body;
- do not change its state or labels;
- do not post unrelated comments.

A native child or related-item relationship may be added because it organizes the new tickets. That relation is the only permitted touch.

## Human-readable Names

Use linked ticket titles in previews and reports. Use IDs only for provider operations and disambiguation.

## Relationship to Other Skills

Consume `/discovery`, `/spec`, and `/domain-mapping` outputs. When product decisions or vocabulary remain unresolved, redirect rather than deciding them here.
