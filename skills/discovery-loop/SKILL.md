---
name: discovery-loop
description: Runs an interactive, tracker-backed fog-of-war loop over an epic, theme, or idea by composing Discovery, Interrogate, Domain Mapping, Spec, and Create Ticket. Invoke when the user wants to explore and document a broad effort continuously until they explicitly exit, with parallel research, ordered tickets, and a living Shared Understanding. Do not invoke for a bounded interview, a one-time specification, routine ticket breakdown, or implementation.
allowed-tools: ["*"]
---

# Discovery Loop

Continuously clear the fog around one epic, theme, or idea. Maintain a canonical Discovery map, resolve one actionable frontier branch at a time, publish a specification when that branch becomes clear, and keep one succinct Shared Understanding current until the user explicitly exits.

The wildcard tool grant is required because this orchestrator invokes composed skills, launches subagents, reads repository and tracker evidence, and persists its own approved Shared Understanding. Constrain every mutation through the owning workflow's approval gate and use read-only capability profiles for research subagents.

## Required References

Read and follow these files in order:

1. [Composition and ownership](./references/10-composition-and-ownership.md)
2. [Loop workflow](./references/20-loop-workflow.md)
3. [Shared Understanding format](./references/30-shared-understanding-format.md)
4. [Delegation and concurrency](./references/40-delegation-and-concurrency.md)
5. [Safeguards and error recovery](./references/50-safeguards-and-error-recovery.md)
6. [Examples and scenario tests](./references/60-examples-and-scenario-tests.md)

## Core Workflow

1. Confirm the epic, theme, or idea and the observable Destination. Resume the matching Discovery map and Shared Understanding when they already exist.
2. Invoke `/discovery` to chart or refresh the fog map. Pass every proposed new ticket through `/create-ticket` before the applicable Discovery preview and approval gate.
3. Select one ready frontier branch. Launch independent, read-only research through subagents in parallel; use `/interrogate` for genuine user decisions and `/domain-mapping` for consequential vocabulary or domain boundaries.
4. Reconcile the evidence, decisions, assumptions, dependencies, and newly visible fog. Preview and apply tracker or domain mutations only through the owning skill's confirmation gates.
5. When the branch is clear and crisp, invoke `/spec` to publish or update its branch specification, then preview and update the Shared Understanding with links, ticket order, blockers, and safe parallel lanes.
6. Show the refreshed frontier and continue automatically while a ready, in-scope branch exists. When only blocked work or a fully clear Destination remains, present that state and await user direction. Never treat an empty frontier, silence, or "looks good" as an exit; stop only when the user explicitly asks to exit, pause, or hand off.
7. On exit, reconcile in-flight work and present the final Shared Understanding without implying that unresolved or accepted unknowns are settled.

Constraint: Orchestrate planning and knowledge capture only. Do not implement the Destination, bypass a composed skill's approval gate, duplicate its durable artifact, or silently end because the current frontier is empty.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
