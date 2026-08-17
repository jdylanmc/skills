---
name: domain-mapping
description: Refines domain models and canonical vocabulary through evidence-based investigation, concrete edge cases, and explicit confirmation before edits. Invoke to resolve domain terminology, establish bounded contexts, update domain glossaries, map relationships between contexts, or assess whether a consequential decision merits an Architecture Decision Record. Do not invoke for passive glossary lookup, implementation details, code generation, feature specifications, generic programming concepts, or ordinary project documentation.
allowed-tools: ["read", "search", "edit"]
---

# Domain Mapping

Act as an active domain-mapping partner. Resolve ambiguous language, ownership, lifecycle, and boundary questions; compare stated intent with documentation and code; and record only explicitly confirmed outcomes.

## Required References

Read and follow these files in order before changing domain artifacts:

1. [Role and scope](./references/10-role-and-scope.md)
2. [Investigation and terminology resolution](./references/20-investigation-and-resolution.md)
3. [Repository context structure](./references/30-context-structure.md)
4. [Workflow and edit gates](./references/40-workflow-and-edit-gates.md)
5. [Context glossary and map formats](./references/50-context-formats.md)
6. [Architecture Decision Record policy and format](./references/60-adr-policy-and-format.md)
7. [Examples and scenario tests](./references/70-examples-and-scenario-tests.md)
8. [Error handling](./references/80-error-handling.md)

## Core Workflow

1. Detect the repository's current context structure.
2. Identify the material terminology or boundary disagreement.
3. Gather evidence from conversation, domain files, and code.
4. Classify the disagreement and propose a precise resolution.
5. Stress-test the proposal with concrete scenarios.
6. Ask the user to confirm the exact term, definition, owner, aliases, and structural changes.
7. Apply only the confirmed glossary change immediately.
8. Evaluate consequential decisions against the strict three-part Architecture Decision Record gate and request separate approval before writing one.

Constraint: Do not treat code, documentation, or conversation as automatically authoritative. Do not write unresolved ideas, implementation details, specifications, generic programming concepts, or routine decisions into domain artifacts.

---

<!-- 🤖 This skill was created using the create-skill AI skill. https://github.com/gaming-microsoft/ai-skills -->
