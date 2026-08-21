---
name: discovery
description: Charts a shared route map and one-question decision or investigation tickets for an effort too large for one agent session whose path to a named Destination is unclear, then resolves tickets one at a time until nothing material remains before execution or handoff. Invoke to chart a map from a loose idea or work an existing Discovery map. Domain-agnostic and planning-first; requires repository issue-tracker guidance.
allowed-tools: ["*"]
includes: ["_base/_molecules/chronicler/chronicler.md","discovery/references/10-role-and-boundaries.md","discovery/references/20-tracker-contract.md","discovery/references/30-map-model.md","discovery/references/40-ticket-model-and-types.md","discovery/references/50-fog-and-scope.md","discovery/references/60-frontier-claim-and-concurrency.md","discovery/references/70-chart-mode.md","discovery/references/80-work-mode-and-completion.md","discovery/references/90-safeguards-and-degradation.md","discovery/references/95-examples-and-scenarios.md","discovery/references/99-error-handling.md"]
---

# Discovery

Turn a large, foggy effort into a shared, low-resolution map and a dependency-aware set of decision or investigation tickets. Work the route one ticket at a time until it is clear enough to execute or hand off.

## Required References

Read and follow these files in order:

1. [Role and boundaries](./references/10-role-and-boundaries.md)
2. [Tracker contract](./references/20-tracker-contract.md)
3. [Map model](./references/30-map-model.md)
4. [Ticket model and types](./references/40-ticket-model-and-types.md)
5. [Fog and scope](./references/50-fog-and-scope.md)
6. [Frontier, claiming, and concurrency](./references/60-frontier-claim-and-concurrency.md)
7. [Chart mode](./references/70-chart-mode.md)
8. [Work mode and completion](./references/80-work-mode-and-completion.md)
9. [Safeguards and capability degradation](./references/90-safeguards-and-degradation.md)
10. [Examples and scenario tests](./references/95-examples-and-scenarios.md)
11. [Error handling](./references/99-error-handling.md)
12. [Chronicler recording molecule](../_base/_molecules/chronicler/chronicler.md)

## Core Workflow

1. Read `docs/agents/issue-tracker.md`; if absent, direct the user to `/setup-jdylanmc-skills` or explicitly confirm a local-only Markdown fallback.
2. Detect whether the user wants to chart a new map or work an existing one. Ask when ambiguous.
3. **Chart:** Confirm the Destination with `/interrogate` and `/domain-mapping`, explore breadth-first, preview the map and tickets, obtain approval, create map then children then dependencies, launch safe research, and stop.
4. **Work:** Load the map at low resolution, select and claim a frontier ticket, use the appropriate skills, resolve at most one non-research ticket, preview all consequential updates, obtain approval, then update the ticket and map.
5. Continue across sessions until the route is clear and emit a handoff summary.

Constraint: Delegate provider mechanics to `docs/agents/issue-tracker.md`. Refresh and verify before every mutation. Plan by default; execute toward the Destination only when the map's Notes explicitly permit a named scope.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
