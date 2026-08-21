---
name: breakdown-code-architecture
description: Maps how an existing codebase or selected area is structured and behaves, with evidence from code relationships expressed in the repository's own terms. Invoke when onboarding to a repository, zooming out from unfamiliar code, tracing modules and callers, documenting existing architecture, or asking how a feature fits into the larger system. Do not invoke for routine implementation, narrow debugging, code review, speculative redesign, resolving domain terminology or glossaries, or planning new work.
allowed-tools: ["read","search","edit","execute"]
includes: ["_base/_molecules/chronicler/chronicler.md","breakdown-code-architecture/references/10-role-scope-and-boundaries.md","breakdown-code-architecture/references/20-orientation-and-evidence.md","breakdown-code-architecture/references/30-relationship-tracing.md","breakdown-code-architecture/references/40-architecture-map-format.md","breakdown-code-architecture/references/50-persistence-and-update-gates.md","breakdown-code-architecture/references/60-examples-and-error-handling.md"]
---

# Breakdown Code Architecture

Build an evidence-backed architecture map for an existing repository or a user-named area. Return the map in the conversation by default. Write architecture documentation only when the user explicitly requests persistence and approves the proposed file change. Never reproduce secret, credential, token, or personal-data values in any output.

The `execute` grant is reserved for Chronicle invocation recording.

## Required References

Read and follow these files in order:

1. [Role, scope, and boundaries](./references/10-role-scope-and-boundaries.md)
2. [Repository orientation and evidence](./references/20-orientation-and-evidence.md)
3. [Relationship tracing workflow](./references/30-relationship-tracing.md)
4. [Architecture map output contract](./references/40-architecture-map-format.md)
5. [Persistence and update gates](./references/50-persistence-and-update-gates.md)
6. [Examples and error handling](./references/60-examples-and-error-handling.md)
7. [Chronicler recording molecule](../_base/_molecules/chronicler/chronicler.md)

## Core Workflow

1. Resolve the target area and requested depth from the user's prompt.
2. Read repository instructions, architecture decisions, and configured domain guidance before describing the code.
3. Orient at one level above the target, then identify entry points, module boundaries, and execution anchors.
4. Trace callers, callees, data access, state transitions, integrations, and test seams using the strongest available code-navigation evidence.
5. Cross-check every material conclusion against source, configuration, tests, or code relationships.
6. Produce the architecture map using the required output contract, scaling the included sections to the target's depth and clearly separating verified facts, reasoned interpretations, and unknowns.
7. If persistence was explicitly requested, preview the destination and complete document, then wait for the exact approval phrase `Approve and write` before editing files. Describing or documenting architecture means returning the map in the conversation and is not by itself a request to write files.

Constraint: Do not infer intent from naming alone, treat directory layout as proof of runtime flow, turn architecture discovery into implementation or redesign work, or reproduce sensitive values in the map or evidence index.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
