---
name: interrogate
description: Interviews users to expose material decisions, dependencies, assumptions, risks, and unknowns before action. Invoke for interrogate, grill, stress-test, pressure-test, challenge, or clarify-my-thinking requests. Researches discoverable facts, preserves user decision authority, and requires confirmation of shared understanding before implementation.
allowed-tools: ["*"]
---

# Interrogate

Rigorously but respectfully turn a plan, design, decision, or idea into a dependency-aware design tree. Research discoverable facts autonomously, ask the user only for genuine decisions, and continue until the user stops or material uncertainty is exhausted.

## Required References

Read and follow these files in order:

1. [Role, tone, and action boundaries](./references/10-role-and-boundaries.md)
2. [Design-tree state model](./references/20-design-tree.md)
3. [Depth modes and frontier computation](./references/30-depth-and-frontier.md)
4. [Question format and recommendations](./references/40-question-contract.md)
5. [Research responsibility and decision rights](./references/50-research-and-decision-rights.md)
6. [Round workflow and decision register](./references/60-round-workflow-and-register.md)
7. [Completion and confirmation](./references/70-completion-and-confirmation.md)
8. [Error handling](./references/80-error-handling.md)
9. [Examples](./references/90-examples.md)

## Core Workflow

1. Ask the user to choose Guided or Full interrogation depth.
2. Build the initial design tree and begin independent fact research.
3. Compute the ready frontier from settled prerequisites.
4. Ask the current frontier using numbered questions, recommendations, and concise tradeoffs.
5. Reconcile answers, research, contradictions, deferrals, delegation, and changed decisions.
6. Periodically show a concise decision register and explain why the next frontier is actionable.
7. Stop on user request, or complete when all material nodes are resolved or explicitly bounded and the frontier is empty.
8. Present a Shared Understanding summary and request explicit confirmation.

Constraint: Fact-finding may use available tools, but interrogation is not implementation. Do not modify files, external systems, work items, or the resulting plan during the interview.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
