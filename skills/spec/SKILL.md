---
name: spec
description: Synthesizes a publishable, ready-for-agent implementation specification from settled conversation context, a Discovery map and handoff, prototypes, and repository evidence. Invoke after `/discovery` to write, publish, or update a specification. Confirms testing seams, but does not conduct a broad interview or reopen settled decisions.
allowed-tools: ["*"]
includes: ["_base/_molecules/chronicler/chronicler.md","spec/references/10-role-and-boundaries.md","spec/references/20-inputs-and-repository-contracts.md","spec/references/30-evidence-and-synthesis.md","spec/references/40-testing-seams.md","spec/references/50-specification-format.md","spec/references/60-publishing-and-idempotency.md","spec/references/70-safeguards-and-degradation.md","spec/references/80-examples-and-scenarios.md","spec/references/90-error-handling.md"]
---

# Spec

Turn an already-clear effort into one publishable implementation specification. Synthesize what Discovery, the conversation, prototypes, and repository evidence already establish; confirm the testing seams; then publish through the configured issue tracker.

## Required References

Read and follow these files in order:

1. [Role and boundaries](./references/10-role-and-boundaries.md)
2. [Inputs and repository contracts](./references/20-inputs-and-repository-contracts.md)
3. [Evidence and synthesis](./references/30-evidence-and-synthesis.md)
4. [Testing seams](./references/40-testing-seams.md)
5. [Specification format](./references/50-specification-format.md)
6. [Publishing and idempotency](./references/60-publishing-and-idempotency.md)
7. [Safeguards and degradation](./references/70-safeguards-and-degradation.md)
8. [Examples and scenario tests](./references/80-examples-and-scenarios.md)
9. [Error handling](./references/90-error-handling.md)
10. [Chronicler recording molecule](../_base/_molecules/chronicler/chronicler.md)

## Core Workflow

1. Read `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, and `docs/agents/triage-labels.md`. If any is missing, direct the user to `/setup-jdylanmc-skills`.
2. Gather the current conversation, Discovery map, resolved tickets, handoff, prototypes, and relevant repository evidence.
3. Classify material points as settled decisions, inferred guidance, or unresolved blockers. Stop when blockers make publication misleading.
4. Select the highest practical testing seams, prefer existing seams, minimize their number, and ask the user to confirm them.
5. Draft the seven-section specification using canonical domain vocabulary.
6. Detect an existing specification and update rather than duplicate it.
7. Preview the complete specification, target, source links, and mapped `ready-for-agent` label. Require `Approve and publish`.
8. Publish, apply only the mapped label, verify the result, and report its linked title.

Constraint: Synthesize rather than interview. Do not reopen settled decisions, implement the feature, run general triage, or modify Discovery artifacts.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
