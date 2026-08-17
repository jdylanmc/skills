---
name: breakdown-to-tickets
description: Converts an approved plan, published `/spec`, `/discovery` handoff or map, referenced ticket, or current conversation into dependency-ordered tracer-bullet implementation tickets. Previews the breakdown and blocker graph, then publishes one ready-for-agent tracker item per approved slice. Provider-neutral and planning-only.
allowed-tools: ["*"]
---

# Breakdown to Tickets

Turn settled intent into a dependency-aware set of implementation tickets. Each ticket is a thin, end-to-end slice that fits one fresh agent session and is independently verifiable.

## Required References

Read and follow these files in order:

1. [Role and boundaries](./references/10-role-and-boundaries.md)
2. [Repository contracts](./references/20-repository-contracts.md)
3. [Inputs and context gathering](./references/30-inputs-and-context-gathering.md)
4. [Vertical slicing model](./references/40-vertical-slicing-model.md)
5. [Prefactoring and wide refactors](./references/50-prefactoring-and-wide-refactors.md)
6. [Ticket formats](./references/60-ticket-formats.md)
7. [Preview and approval](./references/70-preview-and-approval.md)
8. [Publishing, dependencies, and frontier](./references/80-publishing-dependencies-and-frontier.md)
9. [Safeguards and degradation](./references/90-safeguards-and-degradation.md)
10. [Examples and scenario tests](./references/95-examples-and-scenarios.md)
11. [Error handling](./references/99-error-handling.md)

## Core Workflow

1. Read `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, and `docs/agents/triage-labels.md`. If any is missing, direct the user to `/setup-jdylanmc-skills`.
2. Resolve and fully hydrate the source: conversation, path, issue or work-item reference, published spec, Discovery map, or parent ticket.
3. Explore code only when needed. Use canonical domain vocabulary, respect Architecture Decision Records, locate test seams, and identify genuine prefactoring needs.
4. Draft independently verifiable vertical slices and a minimal acyclic blocker graph. Use expand-contract for unavoidable wide mechanical refactors.
5. Present the numbered breakdown and ask only about granularity, blockers, and merge or split choices.
6. Require `Approve and publish`.
7. Publish blockers first, wire relationships in a second pass, apply only the mapped `ready-for-agent` state, verify the graph, and report the frontier.

Constraint: Create the implementation graph but do not execute it. Never close, relabel, rewrite, or otherwise modify the source item; adding a child or related-item link is the only permitted touch.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
