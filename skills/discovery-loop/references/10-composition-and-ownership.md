# Composition and Ownership

Discovery Loop coordinates existing skills rather than reproducing their internal workflows.

## Artifact Owners

| Artifact or decision | Owning skill | Discovery Loop responsibility |
| --- | --- | --- |
| Destination, fog map, frontier, dependencies, and Discovery ticket state | `/discovery` | Resume the map, select a branch, and request approved updates. |
| Ticket payload wording | `/create-ticket` | Route every new ticket definition through it before preview or creation. |
| Human decisions and confirmed Shared Understanding for a branch | `/interrogate` | Supply the branch context and preserve the user's decision authority. |
| Canonical vocabulary, bounded contexts, and qualifying Architecture Decision Records | `/domain-mapping` | Invoke only for material domain questions and link confirmed artifacts. |
| Agent-ready branch specification | `/spec` | Invoke only after the branch has no material unresolved fog. |
| Living cross-branch Shared Understanding | `/discovery-loop` | Create or update the succinct index through its own approval gate. |

The owning skill's references, boundaries, confirmation gates, idempotency rules, and degradation behavior remain authoritative. Never emulate a composed skill from memory when it is available.

## Repository Contracts

Before tracker-backed work, read:

- `docs/agents/issue-tracker.md`;
- `docs/agents/domain.md`;
- `docs/agents/triage-labels.md`.

If the repository contract is missing, follow `/discovery` degradation behavior. Do not invent provider operations, labels, hierarchy, or publication semantics.

## Scope

One loop covers one normalized Destination. A broad idea may contain many branches, but unrelated Destinations require separate maps and Shared Understandings.

This skill does not:

- implement product or infrastructure changes;
- replace routine `/breakdown-to-tickets` slicing after a settled specification;
- turn every observation into a ticket;
- treat a recommendation, inference, or research result as a user decision;
- modify a composed skill's artifact outside that skill's workflow.
