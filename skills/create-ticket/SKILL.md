---
name: create-ticket
description: Converts chaotic conversational input into one or more crisp, engine-agnostic ticket payloads without publishing them. Invoke to draft, format, tighten, or reconcile a bug report, feature request, or Discovery question from raw conversation before a tracker skill creates it. Detects multiple distinct issues, classifies each as a defect or feature at minimum while using task or question only when clearly warranted, strips emotional filler while preserving facts, and marks missing reproduction or acceptance detail as unresolved instead of inventing it. Do not invoke to publish, comment on, close, relabel, or execute a tracker item, or to research code.
allowed-tools: ["read","execute"]
includes: ["_base/_molecules/chronicler/chronicler.md","create-ticket/references/10-role-and-boundaries.md","create-ticket/references/20-input-and-issue-splitting.md","create-ticket/references/30-classification-and-fact-extraction.md","create-ticket/references/40-ticket-formats.md","create-ticket/references/50-acceptance-criteria-and-unresolved-items.md","create-ticket/references/60-clarifying-questions.md","create-ticket/references/70-composition-contract.md","create-ticket/references/90-safeguards-and-degradation.md","create-ticket/references/95-examples-and-scenarios.md","create-ticket/references/99-error-handling.md"]
---

# Create Ticket

Turn messy conversational input into ready-to-review ticket payloads. This is a formatting and reconciliation engine, not a publisher: it never talks to a tracker, never touches code, and never executes what it describes.

## Required References

Read and follow these files in order:

1. [Role and boundaries](./references/10-role-and-boundaries.md)
2. [Input parsing and issue splitting](./references/20-input-and-issue-splitting.md)
3. [Classification and fact extraction](./references/30-classification-and-fact-extraction.md)
4. [Ticket formats](./references/40-ticket-formats.md)
5. [Acceptance criteria and unresolved items](./references/50-acceptance-criteria-and-unresolved-items.md)
6. [Clarifying questions](./references/60-clarifying-questions.md)
7. [Composition contract](./references/70-composition-contract.md)
8. [Safeguards and degradation](./references/90-safeguards-and-degradation.md)
9. [Examples and scenario tests](./references/95-examples-and-scenarios.md)
10. [Error handling](./references/99-error-handling.md)
11. [Chronicler recording molecule](../_base/_molecules/chronicler/chronicler.md)

## Core Workflow

1. Gather the raw conversational input and any caller-supplied context: target format, parent, known blockers, and verification seam.
2. Split the input into distinct issues by observable outcome, not by sentence or paragraph. One issue becomes one ticket.
3. Classify each issue as a defect, a feature, or another declared kind. Extract foundational facts and discard emotional filler without softening or amplifying severity.
4. Render each ticket in the format the caller needs: the canonical remote tracker body (Parent, What to build, Acceptance criteria, Blocked by) or a Discovery one-question ticket.
5. Build binary, checkable acceptance criteria strictly from stated or directly implied facts. Return missing reproduction steps or acceptance detail as unresolved metadata outside the tracker payload rather than inventing criteria.
6. If a usable payload cannot be safely formed for an issue, ask up to the minimum focused questions needed to unblock it. Otherwise skip straight to output.
7. Return the payload set for the caller to preview, approve, and publish. Take no further action.

Constraint: Do not publish, comment on, label, close, or otherwise mutate any
tracker item. Do not read or search code to investigate root cause. Do not
execute, implement, or claim any ticket; Chronicle invocation recording is the
only execution exception. Formatting is the entire job.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
